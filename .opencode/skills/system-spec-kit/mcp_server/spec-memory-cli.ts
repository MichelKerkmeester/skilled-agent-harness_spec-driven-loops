#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Spec Memory CLI
// ---------------------------------------------------------------
// Daemon-backed command line client for the mk-spec-memory tool
// surface. The CLI is intentionally IPC-only: all persistence remains
// owned by the already-running context server daemon.

import { spawn } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, statSync } from 'node:fs';
import net from 'node:net';
import { createRequire } from 'node:module';
import path from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import { fileURLToPath } from 'node:url';

import { resolveDatabasePaths } from './core/config.js';
import {
  TOOL_DEFINITIONS,
  type ToolDefinition,
  ToolSchemaValidationError,
  validateToolArgs,
} from './tool-schemas.js';

const JSON_RPC_PROTOCOL_VERSION = '2025-06-18';
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_SOCKET_DIR = '/tmp/mk-spec-memory';
const SOCKET_FILE_NAME = 'daemon-ipc.sock';
const RESERVED_COMMANDS = new Set(['list-tools', 'completion']);

const EXIT_SUCCESS = 0;
const EXIT_RUNTIME = 1;
const EXIT_USAGE = 64;
const EXIT_PROTOCOL = 69;
const EXIT_RETRYABLE = 75;

type OutputFormat = 'json' | 'text' | 'jsonl';
type ToolListMode = 'full' | 'compact' | 'names-only';
type CompletionShell = 'bash' | 'zsh';

interface ParsedCommand {
  readonly command: string;
  readonly format: OutputFormat;
  readonly timeoutMs: number;
  readonly sessionId?: string;
  readonly warmOnly: boolean;
  readonly toolListMode: ToolListMode;
  readonly completionShell?: CompletionShell;
  readonly args: Record<string, unknown>;
  readonly help: boolean;
  readonly version: boolean;
}

interface CliIo {
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

interface RepoPaths {
  readonly opencodeDir: string;
  readonly repoRoot: string;
  readonly launcherPath: string;
  readonly bridgePath: string;
  readonly dbDir: string;
  readonly packageJsonPath: string;
}

interface BridgeProbeResult {
  readonly status: string;
  readonly reason?: string;
}

interface BridgeModule {
  readonly getIpcSocketPath: (serviceName: string, options?: { dbDir?: string }) => string;
  readonly probeDaemon: (socketPath: string, options?: { timeoutMs?: number; deepProbe?: boolean }) => Promise<BridgeProbeResult>;
  readonly toConnectionOptions: (socketPath: string) => string | net.NetConnectOpts;
}

interface JsonRpcResponse {
  readonly jsonrpc?: string;
  readonly id?: unknown;
  readonly result?: unknown;
  readonly error?: {
    readonly code?: number;
    readonly message?: string;
    readonly data?: unknown;
  };
}

interface InitializeResult {
  readonly protocolVersion?: string;
}

interface ToolResult {
  readonly content?: Array<{ readonly type?: string; readonly text?: string }>;
  readonly isError?: boolean;
}

class CliUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliUsageError';
  }
}

class CliRetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliRetryableError';
  }
}

class CliProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliProtocolError';
  }
}

class JsonRpcError extends Error {
  public readonly code?: number;
  public readonly data?: unknown;

  constructor(error: NonNullable<JsonRpcResponse['error']>) {
    super(error.message ?? 'JSON-RPC request failed');
    this.name = 'JsonRpcError';
    this.code = error.code;
    this.data = error.data;
  }
}

// Awaits drain when the kernel pipe buffer is full: a fire-and-forget
// write followed by process.exit() truncates large payloads at the pipe
// buffer boundary (observed as exactly 64KB on darwin). Streams without
// emitter methods (test fakes) resolve immediately.
async function writeLine(stream: Pick<NodeJS.WriteStream, 'write'>, value: string): Promise<void> {
  const flushed = stream.write(`${value}\n`);
  if (flushed) return;
  const drainable = stream as Pick<NodeJS.WriteStream, 'write'> & Partial<Pick<NodeJS.WriteStream, 'once' | 'off'>>;
  if (typeof drainable.once !== 'function') return;
  await new Promise<void>((resolve) => {
    const settle = (): void => {
      drainable.off?.('drain', settle);
      drainable.off?.('error', settle);
      drainable.off?.('close', settle);
      resolve();
    };
    drainable.once?.('drain', settle);
    drainable.once?.('error', settle);
    drainable.once?.('close', settle);
  });
}

function currentModulePath(): string {
  return fileURLToPath(import.meta.url);
}

function findRepoPaths(startFile = currentModulePath()): RepoPaths {
  let current = path.dirname(startFile);

  while (true) {
    const directOpencodeDir = path.basename(current) === '.opencode' ? current : path.join(current, '.opencode');
    const launcherPath = path.join(directOpencodeDir, 'bin', 'mk-spec-memory-launcher.cjs');
    const bridgePath = path.join(directOpencodeDir, 'bin', 'lib', 'launcher-ipc-bridge.cjs');
    if (existsSync(launcherPath) && existsSync(bridgePath)) {
      const repoRoot = path.dirname(directOpencodeDir);
      return {
        opencodeDir: directOpencodeDir,
        repoRoot,
        launcherPath,
        bridgePath,
        dbDir: resolveDatabasePaths().databaseDir,
        packageJsonPath: path.join(directOpencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'package.json'),
      };
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new CliProtocolError('Unable to locate .opencode/bin launcher assets from CLI path');
    }
    current = parent;
  }
}

function loadBridge(paths: RepoPaths): BridgeModule {
  const require = createRequire(import.meta.url);
  return require(paths.bridgePath) as BridgeModule;
}

function readCliVersion(paths: RepoPaths): string {
  const require = createRequire(import.meta.url);
  const pkg = require(paths.packageJsonPath) as { version?: unknown };
  return typeof pkg.version === 'string' ? pkg.version : '0.0.0';
}

function toKebabCommand(name: string): string {
  return name.replace(/_/g, '-');
}

function toCamelCommand(name: string): string {
  return name.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

function commandAliases(name: string): string[] {
  return Array.from(new Set([name, toKebabCommand(name), toCamelCommand(name)]));
}

function usageText(command?: string): string {
  const tool = command ? getToolDefinition(command) : null;
  if (tool) {
    return `spec-memory ${tool.name}

Description:
  ${tool.description}

Aliases:
  ${commandAliases(tool.name).join(', ')}

Input schema:
${JSON.stringify(tool.inputSchema, null, 2)}`;
  }

  return `spec-memory - daemon-backed CLI for mk-spec-memory

Usage:
  spec-memory list-tools [--format json|text|jsonl] [--compact|--names-only]
  spec-memory completion bash|zsh
  spec-memory <tool_name> [--json '{...}'] [--format json|text|jsonl] [--timeout-ms N] [--session-id ID] [--warm-only]
  spec-memory <tool_name> --param value [--another-param value]

Examples:
  spec-memory list-tools --format text
  spec-memory list-tools --compact
  spec-memory completion zsh
  spec-memory memory_stats --format json
  spec-memory memory_search --query "gold query battery" --limit 3
  spec-memory memory_context --json '{"input":"resume", "mode":"resume"}'

Exit codes:
  0 success, 1 runtime error, 64 usage/schema error, 69 protocol mismatch, 75 retryable daemon error

Exit 69 recovery:
  - Missing or stale dist entrypoint: run npm run build --workspace=@spec-kit/mcp-server.
    - Backend protocol version changed: rebuild the CLI and daemon from the same checkout, then update any pinned client.
    - Socket path or daemon config mismatch: check SPECKIT_IPC_SOCKET_DIR, socket length, and daemon config before retrying.`;
}

function parseCompletionShell(raw: string): CompletionShell {
  if (raw === 'bash' || raw === 'zsh') return raw;
  throw new CliUsageError('completion shell must be one of: bash, zsh');
}

function normalizeName(value: string): string {
  return value.replace(/[-_]/g, '').toLowerCase();
}

function toCamelCaseFlag(value: string): string {
  return value.replace(/-([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

function commandMap(): Map<string, ToolDefinition> {
  const map = new Map<string, ToolDefinition>();
  for (const tool of TOOL_DEFINITIONS) {
    for (const alias of commandAliases(tool.name)) {
      const existing = map.get(alias);
      if (existing && existing.name !== tool.name) {
        throw new CliProtocolError(`Command alias collision: ${alias} maps to ${existing.name} and ${tool.name}`);
      }
      map.set(alias, tool);
    }
  }
  return map;
}

function getToolDefinition(command: string): ToolDefinition | null {
  return commandMap().get(command) ?? null;
}

function inputPropertyNames(tool: ToolDefinition): string[] {
  const schema = tool.inputSchema;
  const properties = typeof schema === 'object' && schema !== null && !Array.isArray(schema)
    ? (schema as { readonly properties?: unknown }).properties
    : null;
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return [];
  return Object.keys(properties);
}

function resolvePropertyName(rawFlag: string, tool: ToolDefinition): string {
  const exact = inputPropertyNames(tool).find((name) => name === rawFlag);
  if (exact) return exact;

  const normalized = normalizeName(rawFlag);
  const matched = inputPropertyNames(tool).find((name) => normalizeName(name) === normalized);
  if (matched) return matched;

  return rawFlag.includes('-') ? toCamelCaseFlag(rawFlag) : rawFlag;
}

function parseValue(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new CliUsageError(`Invalid JSON value: ${message}`);
    }
  }
  return raw;
}

function parsePositiveInteger(raw: string, flagName: string): number {
  if (!/^\d+$/.test(raw)) {
    throw new CliUsageError(`${flagName} must be a positive integer`);
  }
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value <= 0) {
    throw new CliUsageError(`${flagName} must be a positive integer`);
  }
  return value;
}

function parseFormat(raw: string): OutputFormat {
  if (raw === 'json' || raw === 'text' || raw === 'jsonl') return raw;
  throw new CliUsageError('--format must be one of: json, text, jsonl');
}

function parseInlineBoolean(raw: string, flagName: string): boolean {
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  throw new CliUsageError(`${flagName} must be true or false`);
}

function readOptionValue(tokens: string[], index: number, flagName: string): { readonly value: string; readonly nextIndex: number } {
  const inline = tokens[index].match(/^--[^=]+=(.*)$/);
  if (inline) return { value: inline[1], nextIndex: index + 1 };
  const value = tokens[index + 1];
  if (value === undefined) {
    throw new CliUsageError(`${flagName} requires a value`);
  }
  return { value, nextIndex: index + 2 };
}

function parseJsonObject(raw: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new CliUsageError(`--json must be a valid JSON object: ${message}`);
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new CliUsageError('--json must be a JSON object');
  }
  return parsed as Record<string, unknown>;
}

function envFlagEnabled(name: string): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === null) return false;
  return ['1', 'true', 'yes', 'on'].includes(raw.trim().toLowerCase());
}

function defaultWarmOnly(): boolean {
  return envFlagEnabled('SPECKIT_SPEC_MEMORY_CLI_WARM_ONLY')
    || envFlagEnabled('SPECKIT_SPEC_MEMORY_CLI_PROMPT_TIME')
    || envFlagEnabled('SPECKIT_CLI_PROMPT_TIME')
    || envFlagEnabled('OPENCODE_PROMPT_TIME')
    || envFlagEnabled('OPENCODE_PROMPT_TIME')
    || envFlagEnabled('CLAUDE_CODE_PROMPT_TIME');
}

export function parseCliArgs(argv: string[]): ParsedCommand {
  const command = argv[0];
  const warmOnlyDefault = defaultWarmOnly();
  if (!command || command === '--help' || command === '-h') {
    return { command: '', format: 'text', timeoutMs: DEFAULT_TIMEOUT_MS, warmOnly: warmOnlyDefault, toolListMode: 'full', args: {}, help: true, version: false };
  }
  if (command === '--version' || command === '-v') {
    return { command: '', format: 'text', timeoutMs: DEFAULT_TIMEOUT_MS, warmOnly: warmOnlyDefault, toolListMode: 'full', args: {}, help: false, version: true };
  }

  let format: OutputFormat = 'json';
  let timeoutMs = DEFAULT_TIMEOUT_MS;
  let sessionId: string | undefined;
  let warmOnly = warmOnlyDefault;
  let toolListMode: ToolListMode = 'full';
  let completionShell: CompletionShell | undefined;
  let jsonPayload: Record<string, unknown> | null = null;
  const tool = getToolDefinition(command);
  const parsedArgs: Record<string, unknown> = {};
  const tokens = argv.slice(1);
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];
    if (command === 'completion' && completionShell === undefined && !token.startsWith('--')) {
      completionShell = parseCompletionShell(token);
      index += 1;
      continue;
    }
    if (!token.startsWith('--')) {
      throw new CliUsageError(`Unexpected positional argument: ${token}`);
    }
    const rawFlag = token.slice(2).split('=', 1)[0];
    const option = `--${rawFlag}`;

    if (rawFlag === 'help' || rawFlag === 'h') {
      return { command, format: 'text', timeoutMs, sessionId, warmOnly, toolListMode, completionShell, args: {}, help: true, version: false };
    }
    if (rawFlag === 'format') {
      const read = readOptionValue(tokens, index, option);
      format = parseFormat(read.value);
      index = read.nextIndex;
      continue;
    }
    if (rawFlag === 'timeout-ms') {
      const read = readOptionValue(tokens, index, option);
      timeoutMs = parsePositiveInteger(read.value, option);
      index = read.nextIndex;
      continue;
    }
    if (rawFlag === 'session-id') {
      const read = readOptionValue(tokens, index, option);
      sessionId = read.value;
      index = read.nextIndex;
      continue;
    }
    if (rawFlag === 'warm-only') {
      const inline = token.match(/^--[^=]+=(.*)$/);
      warmOnly = inline ? parseInlineBoolean(inline[1], option) : true;
      index += 1;
      continue;
    }
    if (rawFlag === 'no-warm-only') {
      warmOnly = false;
      index += 1;
      continue;
    }
    if (rawFlag === 'compact') {
      toolListMode = 'compact';
      index += 1;
      continue;
    }
    if (rawFlag === 'names-only') {
      toolListMode = 'names-only';
      index += 1;
      continue;
    }
    if (rawFlag === 'json') {
      const read = readOptionValue(tokens, index, option);
      jsonPayload = parseJsonObject(read.value);
      index = read.nextIndex;
      continue;
    }

    if (!tool) {
      throw new CliUsageError(`Unknown command: ${command}`);
    }

    const propertyName = resolvePropertyName(rawFlag, tool);
    const inline = token.match(/^--[^=]+=(.*)$/);
    if (inline) {
      parsedArgs[propertyName] = parseValue(inline[1]);
      index += 1;
      continue;
    }

    const next = tokens[index + 1];
    if (next === undefined || next.startsWith('--')) {
      parsedArgs[propertyName] = true;
      index += 1;
      continue;
    }
    parsedArgs[propertyName] = parseValue(next);
    index += 2;
  }

  if (jsonPayload && Object.keys(parsedArgs).length > 0) {
    throw new CliUsageError('--json cannot be combined with per-parameter flags');
  }

  return {
    command,
    format,
    timeoutMs,
    sessionId,
    warmOnly,
    toolListMode,
    completionShell,
    args: jsonPayload ?? parsedArgs,
    help: false,
    version: false,
  };
}

function validateCommand(parsed: ParsedCommand): { readonly tool: ToolDefinition; readonly args: Record<string, unknown> } | null {
  if (RESERVED_COMMANDS.has(parsed.command)) return null;
  const tool = getToolDefinition(parsed.command);
  if (!tool) {
    throw new CliUsageError(`Unknown command: ${parsed.command}`);
  }

  const args = { ...parsed.args };
  const properties = new Set(inputPropertyNames(tool));
  if (parsed.sessionId && !Object.prototype.hasOwnProperty.call(args, 'sessionId') && properties.has('sessionId')) {
    args.sessionId = parsed.sessionId;
  } else if (parsed.sessionId && !Object.prototype.hasOwnProperty.call(args, 'session_id') && properties.has('session_id')) {
    args.session_id = parsed.sessionId;
  }

  return {
    tool,
    args: validateToolArgs(tool.name, args) as Record<string, unknown>,
  };
}

function renderJson(value: unknown, format: OutputFormat): string {
  if (format === 'jsonl') return JSON.stringify(value);
  return JSON.stringify(value, null, 2);
}

function compactTool(tool: ToolDefinition): Record<string, unknown> {
  return {
    name: tool.name,
    command: tool.name,
    kebabCommand: toKebabCommand(tool.name),
    camelCommand: toCamelCommand(tool.name),
    aliases: commandAliases(tool.name),
    description: tool.description,
  };
}

function renderToolList(format: OutputFormat, mode: ToolListMode = 'full'): string {
  const payload = {
    status: 'ok',
    data: {
      count: TOOL_DEFINITIONS.length,
      mode,
      tools: TOOL_DEFINITIONS.map((tool) => ({
        name: tool.name,
        command: tool.name,
        kebabCommand: toKebabCommand(tool.name),
        camelCommand: toCamelCommand(tool.name),
        aliases: commandAliases(tool.name),
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    },
  };
  const compactPayload = {
    status: 'ok',
    data: {
      count: TOOL_DEFINITIONS.length,
      mode,
      tools: TOOL_DEFINITIONS.map(compactTool),
    },
  };
  const namesOnlyPayload = {
    status: 'ok',
    data: {
      count: TOOL_DEFINITIONS.length,
      mode,
      names: TOOL_DEFINITIONS.map((tool) => tool.name),
    },
  };

  if (format === 'text') {
    return TOOL_DEFINITIONS.map((tool) => tool.name).join('\n');
  }
  if (mode === 'compact') return renderJson(compactPayload, format);
  if (mode === 'names-only') return renderJson(namesOnlyPayload, format);
  return renderJson(payload, format);
}

function completionWords(): string[] {
  return ['list-tools', 'completion', ...TOOL_DEFINITIONS.map((tool) => tool.name)];
}

function shellWords(words: readonly string[]): string {
  return words.join(' ');
}

function renderBashCompletion(): string {
  const commands = shellWords(completionWords());
  const commonFlags = shellWords(['--help', '--format', '--json', '--timeout-ms', '--session-id', '--warm-only', '--no-warm-only']);
  const listFlags = shellWords(['--help', '--format', '--compact', '--names-only']);
  return `_spec_memory_completion() {
  local cur
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  if [[ \${COMP_CWORD} -eq 1 ]]; then
    COMPREPLY=( $(compgen -W "${commands}" -- "\${cur}") )
    return 0
  fi
  case "\${COMP_WORDS[1]}" in
    completion) COMPREPLY=( $(compgen -W "bash zsh" -- "\${cur}") ) ;;
    list-tools) COMPREPLY=( $(compgen -W "${listFlags}" -- "\${cur}") ) ;;
    *) COMPREPLY=( $(compgen -W "${commonFlags}" -- "\${cur}") ) ;;
  esac
}
complete -F _spec_memory_completion spec-memory`;
}

function renderZshCompletion(): string {
  const commands = shellWords(completionWords());
  const commonFlags = shellWords(['--help', '--format', '--json', '--timeout-ms', '--session-id', '--warm-only', '--no-warm-only']);
  const listFlags = shellWords(['--help', '--format', '--compact', '--names-only']);
  return `#compdef spec-memory
_spec_memory() {
  local -a commands common_flags list_flags shells
  commands=(${commands})
  common_flags=(${commonFlags})
  list_flags=(${listFlags})
  shells=(bash zsh)
  if (( CURRENT == 2 )); then
    _describe 'commands' commands
    return
  fi
  case \${words[2]} in
    completion) _describe 'shells' shells ;;
    list-tools) _describe 'flags' list_flags ;;
    *) _describe 'flags' common_flags ;;
  esac
}
_spec_memory "$@"`;
}

function renderCompletion(shell: CompletionShell): string {
  return shell === 'bash' ? renderBashCompletion() : renderZshCompletion();
}

function isErrorPayload(payload: unknown): boolean {
  return Boolean(payload)
    && typeof payload === 'object'
    && !Array.isArray(payload)
    && (payload as { readonly status?: unknown }).status === 'error';
}

function extractToolPayload(toolName: string, result: unknown): { readonly payload: unknown; readonly isError: boolean } {
  const toolResult = result && typeof result === 'object' ? result as ToolResult : null;
  const firstText = toolResult?.content?.find((entry) => typeof entry.text === 'string')?.text;
  if (firstText) {
    try {
      return {
        payload: JSON.parse(firstText) as unknown,
        isError: toolResult?.isError === true,
      };
    } catch {
      return {
        payload: {
          status: toolResult?.isError ? 'error' : 'ok',
          tool: toolName,
          text: firstText,
        },
        isError: toolResult?.isError === true,
      };
    }
  }
  return {
    payload: {
      status: toolResult?.isError ? 'error' : 'ok',
      tool: toolName,
      result,
    },
    isError: toolResult?.isError === true,
  };
}

function renderPayload(payload: unknown, format: OutputFormat): string {
  if (format === 'json' || format === 'jsonl') return renderJson(payload, format);
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    if (typeof record.summary === 'string') return record.summary;
    if (typeof record.error === 'string') return record.error;
    if (typeof record.message === 'string') return record.message;
  }
  return typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
}

function isProtocolMismatch(error: unknown): boolean {
  if (error instanceof JsonRpcError && error.code === -32002) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /protocol.*(mismatch|changed|version)/i.test(message);
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof CliRetryableError) return true;
  if (error instanceof JsonRpcError && error.code === -32001) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /SQLITE_BUSY|ECONNREFUSED|ENOENT|ECONNRESET|EPIPE|ETIMEDOUT|backend unavailable|retry/i.test(message);
}

function exitCodeForError(error: unknown): number {
  if (error instanceof CliUsageError || error instanceof ToolSchemaValidationError) return EXIT_USAGE;
  if (error instanceof CliProtocolError || isProtocolMismatch(error)) return EXIT_PROTOCOL;
  if (isRetryableError(error)) return EXIT_RETRYABLE;
  if (error instanceof JsonRpcError && error.code === -32602) return EXIT_USAGE;
  return EXIT_RUNTIME;
}

function levenshteinDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_value, index) => index);
  const current = new Array<number>(right.length + 1);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + cost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function closestCommand(command: string): string | undefined {
  const targets = new Map<string, string>([['list-tools', 'list-tools']]);
  targets.set('completion', 'completion');
  for (const tool of TOOL_DEFINITIONS) {
    for (const alias of commandAliases(tool.name)) {
      targets.set(alias, tool.name);
    }
  }

  let best: { readonly command: string; readonly distance: number } | null = null;
  for (const [alias, canonical] of targets) {
    const distance = levenshteinDistance(normalizeName(command), normalizeName(alias));
    if (!best || distance < best.distance || (distance === best.distance && canonical < best.command)) {
      best = { command: canonical, distance };
    }
  }

  if (!best) return undefined;
  const threshold = Math.max(2, Math.floor(normalizeName(command).length * 0.4));
  return best.distance <= threshold ? best.command : undefined;
}

function unknownCommandContext(message: string): { readonly hint: string; readonly suggestion?: string } | null {
  const match = message.match(/^Unknown command: (.+)$/);
  if (!match) return null;
  return {
    hint: 'Try `list-tools` to see available commands.',
    suggestion: closestCommand(match[1]),
  };
}

function socketPathTooLong(socketPath: string): boolean {
  if (socketPath.startsWith('tcp://')) return false;
  return process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103;
}

// `mode: 0o700` only applies when mkdir CREATES the dir. A pre-existing socket dir
// (e.g. an attacker-planted dir or symlink on a shared host) is not protected by the
// mkdir above, so the client must refuse to probe/connect under a dir it does not own,
// a symlinked dir, or a group/world-writable dir, and must reject a foreign-owned or
// symlinked socket node — otherwise a fake daemon could answer initialize and spoof results.
function assertSocketPerimeter(socketDir: string): void {
  const dirLink = lstatSync(socketDir);
  if (dirLink.isSymbolicLink()) {
    throw new CliProtocolError(`IPC socket directory is a symlink; refusing to connect: ${socketDir}`);
  }
  const dirStat = statSync(socketDir);
  const uid = typeof process.getuid === 'function' ? process.getuid() : null;
  if (uid !== null && dirStat.uid !== uid) {
    throw new CliProtocolError(`IPC socket directory is not owned by the current user (uid ${dirStat.uid} != ${uid}): ${socketDir}`);
  }
  if ((dirStat.mode & 0o022) !== 0) {
    throw new CliProtocolError(`IPC socket directory is group/world-writable: ${socketDir}`);
  }
  const socketPath = path.join(socketDir, SOCKET_FILE_NAME);
  let nodeLink;
  try {
    nodeLink = lstatSync(socketPath);
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
    if (code === 'ENOENT') return;
    throw error;
  }
  if (nodeLink.isSymbolicLink()) {
    throw new CliProtocolError(`IPC socket path is a symlink; refusing to connect: ${socketPath}`);
  }
  if (uid !== null && nodeLink.uid !== uid) {
    throw new CliProtocolError(`IPC socket is not owned by the current user (uid ${nodeLink.uid} != ${uid}): ${socketPath}`);
  }
}

function ensureSocketEnvironment(): void {
  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
    process.env.SPECKIT_IPC_SOCKET_DIR = DEFAULT_SOCKET_DIR;
  }
  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
  if (!socketDir || socketDir.startsWith('tcp://')) return;
  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  assertSocketPerimeter(socketDir);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function spawnLauncher(paths: RepoPaths): void {
  const child = spawn(process.execPath, [paths.launcherPath], {
    cwd: paths.repoRoot,
    env: process.env,
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

async function waitForDaemon(socketPath: string, bridge: BridgeModule, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastReason = 'not probed';

  while (Date.now() <= deadline) {
    const remaining = Math.max(1, deadline - Date.now());
    const probe = await bridge.probeDaemon(socketPath, {
      timeoutMs: Math.min(remaining, 5000),
      deepProbe: true,
    });
    if (probe.status === 'alive') return;
    lastReason = probe.reason ?? probe.status;
    await sleep(100);
  }

  throw new CliRetryableError(`backend unavailable: ${lastReason}`);
}

class JsonRpcSocketClient {
  private nextId = 1;
  private readonly decoder = new StringDecoder('utf8');

  private constructor(
    private readonly socket: net.Socket,
  ) {}

  static connect(socketPath: string, bridge: BridgeModule, timeoutMs: number): Promise<JsonRpcSocketClient> {
    return new Promise((resolve, reject) => {
      let socket: net.Socket;
      let settled = false;
      const finish = (error?: Error): void => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        socket.off?.('connect', onConnect);
        socket.off?.('error', onError);
        if (error) {
          socket.destroy?.();
          reject(error);
          return;
        }
        resolve(new JsonRpcSocketClient(socket));
      };
      const onConnect = (): void => finish();
      const onError = (error: Error): void => finish(error);
      const timer = setTimeout(() => finish(new CliRetryableError('connection timed out')), timeoutMs);
      timer.unref?.();

      try {
        const connectionOptions = bridge.toConnectionOptions(socketPath);
        socket = typeof connectionOptions === 'string'
          ? net.createConnection(connectionOptions)
          : net.createConnection(connectionOptions);
      } catch (error: unknown) {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
        return;
      }
      socket.once('connect', onConnect);
      socket.once('error', onError);
    });
  }

  notify(method: string, params?: unknown): void {
    const frame = params === undefined
      ? { jsonrpc: '2.0', method }
      : { jsonrpc: '2.0', method, params };
    this.socket.write(`${JSON.stringify(frame)}\n`);
  }

  request(method: string, params: unknown, timeoutMs: number): Promise<unknown> {
    const id = this.nextId++;
    const request = { jsonrpc: '2.0', id, method, params };
    return new Promise((resolve, reject) => {
      let buffer = '';
      let settled = false;

      const cleanup = (): void => {
        clearTimeout(timer);
        this.socket.off('data', onData);
        this.socket.off('error', onError);
        this.socket.off('close', onClose);
      };
      const finish = (error: unknown, value?: unknown): void => {
        if (settled) return;
        settled = true;
        cleanup();
        if (error) {
          reject(error);
          return;
        }
        resolve(value);
      };
      const onData = (chunk: Buffer | string): void => {
        buffer += Buffer.isBuffer(chunk) ? this.decoder.write(chunk) : String(chunk ?? '');
        let newlineIndex = buffer.indexOf('\n');
        while (newlineIndex !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);
          newlineIndex = buffer.indexOf('\n');
          if (!line) continue;
          let parsed: JsonRpcResponse;
          try {
            parsed = JSON.parse(line) as JsonRpcResponse;
          } catch {
            continue;
          }
          if (parsed.id !== id) continue;
          if (parsed.error) {
            finish(new JsonRpcError(parsed.error));
            return;
          }
          finish(null, parsed.result);
          return;
        }
      };
      const onError = (error: Error): void => finish(error);
      const onClose = (): void => finish(new CliRetryableError('socket closed before response'));
      const timer = setTimeout(() => finish(new CliRetryableError(`${method} timed out`)), timeoutMs);
      timer.unref?.();

      this.socket.on('data', onData);
      this.socket.once('error', onError);
      this.socket.once('close', onClose);
      this.socket.write(`${JSON.stringify(request)}\n`);
    });
  }

  close(): void {
    this.socket.end();
    this.socket.destroy();
  }
}

async function ensureDaemonReady(socketPath: string, bridge: BridgeModule, paths: RepoPaths, timeoutMs: number, warmOnly: boolean): Promise<void> {
  const initialProbe = await bridge.probeDaemon(socketPath, { timeoutMs: Math.min(timeoutMs, 5000), deepProbe: true });
  if (initialProbe.status === 'alive') return;
  if (warmOnly) {
    throw new CliRetryableError(`backend unavailable: ${initialProbe.reason ?? initialProbe.status}`);
  }
  spawnLauncher(paths);
  await waitForDaemon(socketPath, bridge, timeoutMs);
}

async function callTool(toolName: string, args: Record<string, unknown>, timeoutMs: number, warmOnly: boolean): Promise<unknown> {
  ensureSocketEnvironment();
  const paths = findRepoPaths();
  const bridge = loadBridge(paths);
  const socketPath = bridge.getIpcSocketPath('mk-spec-memory', { dbDir: paths.dbDir });
  if (socketPathTooLong(socketPath)) {
    throw new CliProtocolError(`IPC socket path exceeds the Darwin sun_path limit: ${socketPath}`);
  }

  await ensureDaemonReady(socketPath, bridge, paths, timeoutMs, warmOnly);

  const client = await JsonRpcSocketClient.connect(socketPath, bridge, timeoutMs);
  try {
    const initialize = await client.request('initialize', {
      protocolVersion: JSON_RPC_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: 'spec-memory-cli', version: readCliVersion(paths) },
    }, timeoutMs) as InitializeResult;
    if (initialize.protocolVersion && initialize.protocolVersion !== JSON_RPC_PROTOCOL_VERSION) {
      throw new CliProtocolError(`backend protocol version changed: ${initialize.protocolVersion}`);
    }
    client.notify('notifications/initialized');
    return await client.request('tools/call', { name: toolName, arguments: args }, timeoutMs);
  } finally {
    client.close();
  }
}

export async function runSpecMemoryCli(argv: string[], io: CliIo = { stdout: process.stdout, stderr: process.stderr }): Promise<number> {
  try {
    const parsed = parseCliArgs(argv);
    if (parsed.help) {
      await writeLine(io.stdout, usageText(parsed.command || undefined));
      return EXIT_SUCCESS;
    }
    if (parsed.version) {
      await writeLine(io.stdout, readCliVersion(findRepoPaths()));
      return EXIT_SUCCESS;
    }
    if (parsed.command === 'list-tools') {
      await writeLine(io.stdout, renderToolList(parsed.format, parsed.toolListMode));
      return EXIT_SUCCESS;
    }
    if (parsed.command === 'completion') {
      if (!parsed.completionShell) {
        throw new CliUsageError('completion requires a shell: bash or zsh');
      }
      await writeLine(io.stdout, renderCompletion(parsed.completionShell));
      return EXIT_SUCCESS;
    }

    const validated = validateCommand(parsed);
    if (!validated) {
      throw new CliUsageError(`Unknown command: ${parsed.command}`);
    }
    const result = await callTool(validated.tool.name, validated.args, parsed.timeoutMs, parsed.warmOnly);
    const { payload, isError } = extractToolPayload(validated.tool.name, result);
    await writeLine(io.stdout, renderPayload(payload, parsed.format));
    return isError || isErrorPayload(payload) ? EXIT_RUNTIME : EXIT_SUCCESS;
  } catch (error: unknown) {
    const exitCode = exitCodeForError(error);
    const message = error instanceof Error ? error.message : String(error);
    const unknownCommand = unknownCommandContext(message);
    const payload = {
      status: 'error',
      error: message,
      exitCode,
      ...(unknownCommand ? { hint: unknownCommand.hint } : {}),
      ...(unknownCommand?.suggestion ? { suggestion: unknownCommand.suggestion } : {}),
    };
    const format = (() => {
      try {
        return parseCliArgs(argv).format;
      } catch {
        return 'text' as OutputFormat;
      }
    })();
    if (format === 'json' || format === 'jsonl') {
      await writeLine(io.stderr, renderJson(payload, format));
    } else {
      await writeLine(io.stderr, [
        `ERROR: ${message}`,
        unknownCommand ? `Hint: ${unknownCommand.hint}` : null,
        unknownCommand?.suggestion ? `Did you mean \`${unknownCommand.suggestion}\`?` : null,
      ].filter((line): line is string => Boolean(line)).join('\n'));
    }
    return exitCode;
  }
}

function isCliEntrypoint(): boolean {
  const invoked = process.argv[1];
  if (!invoked) return false;
  return path.resolve(invoked) === path.resolve(currentModulePath());
}

export const __testing = {
  DEFAULT_SOCKET_DIR,
  EXIT_PROTOCOL,
  EXIT_RETRYABLE,
  EXIT_RUNTIME,
  EXIT_USAGE,
  commandMap,
  commandAliases,
  assertSocketPerimeter,
  ensureSocketEnvironment,
  exitCodeForError,
  findRepoPaths,
  isErrorPayload,
  closestCommand,
  renderCompletion,
  renderToolList,
  resolvePropertyName,
};

if (isCliEntrypoint()) {
  // Natural exit via process.exitCode: a hard process.exit() drops any
  // stdout bytes still queued behind the kernel pipe buffer, truncating
  // large payloads. Pending pipe writes keep the event loop alive until
  // they flush; all sockets and timers are closed or unref'd by here.
  process.exitCode = await runSpecMemoryCli(process.argv.slice(2));
}
