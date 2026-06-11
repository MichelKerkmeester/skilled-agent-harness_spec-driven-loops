#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Skill Advisor CLI
// ---------------------------------------------------------------

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import net from 'node:net';
import { createRequire } from 'node:module';
import path from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import { fileURLToPath } from 'node:url';

import {
  SKILL_ADVISOR_CLI_TOOL_MANIFEST,
  type SkillAdvisorCliToolDefinition,
} from './skill-advisor-cli-manifest.js';

const JSON_RPC_PROTOCOL_VERSION = '2025-06-18';
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_SOCKET_DIR = '/tmp/mk-skill-advisor';
const RESERVED_COMMANDS = new Set(['list-tools']);

const EXIT_SUCCESS = 0;
const EXIT_RUNTIME = 1;
const EXIT_USAGE = 64;
const EXIT_PROTOCOL = 69;
const EXIT_RETRYABLE = 75;

type OutputFormat = 'json' | 'text' | 'jsonl';

interface ParsedCommand {
  readonly command: string;
  readonly format: OutputFormat;
  readonly timeoutMs: number;
  readonly sessionId?: string;
  readonly warmOnly: boolean;
  readonly args: Record<string, unknown>;
  readonly help: boolean;
  readonly version: boolean;
  readonly trusted: boolean;
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
  readonly packageLockPath: string;
}

interface BridgeProbeResult {
  readonly status: string;
  readonly reason?: string;
}

interface BridgeModule {
  readonly getIpcSocketPath: (serviceName: string, options?: { dbDir?: string }) => string;
  readonly maybeBridgeLeaseHolder: (options: unknown) => unknown;
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

interface ToolPayloadResult {
  readonly payload: unknown;
  readonly isError: boolean;
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

class ToolSchemaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ToolSchemaValidationError';
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
    const launcherPath = path.join(directOpencodeDir, 'bin', 'mk-skill-advisor-launcher.cjs');
    const bridgePath = path.join(directOpencodeDir, 'bin', 'lib', 'launcher-ipc-bridge.cjs');
    if (existsSync(launcherPath) && existsSync(bridgePath)) {
      const repoRoot = path.dirname(directOpencodeDir);
      const mcpServerDir = path.join(directOpencodeDir, 'skills', 'system-skill-advisor', 'mcp_server');
      return {
        opencodeDir: directOpencodeDir,
        repoRoot,
        launcherPath,
        bridgePath,
        dbDir: path.join(mcpServerDir, 'database'),
        packageJsonPath: path.join(mcpServerDir, 'package.json'),
        packageLockPath: path.join(mcpServerDir, 'package-lock.json'),
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
  const bridge = require(paths.bridgePath) as Partial<BridgeModule>;
  if (
    typeof bridge.getIpcSocketPath !== 'function'
    || typeof bridge.maybeBridgeLeaseHolder !== 'function'
    || typeof bridge.probeDaemon !== 'function'
    || typeof bridge.toConnectionOptions !== 'function'
  ) {
    throw new CliProtocolError('launcher IPC bridge does not expose the expected helper contract');
  }
  return bridge as BridgeModule;
}

function readJsonFile(filePath: string): Record<string, unknown> | null {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readCliVersion(paths: RepoPaths): string {
  const packageJson = existsSync(paths.packageJsonPath) ? readJsonFile(paths.packageJsonPath) : null;
  if (typeof packageJson?.version === 'string') return packageJson.version;
  const packageLock = existsSync(paths.packageLockPath) ? readJsonFile(paths.packageLockPath) : null;
  if (typeof packageLock?.version === 'string') return packageLock.version;
  return '0.0.0';
}

function normalizeName(value: string): string {
  return value.replace(/[-_]/g, '').toLowerCase();
}

function toCamelCaseFlag(value: string): string {
  return value.replace(/-([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

function setCommandAlias(map: Map<string, SkillAdvisorCliToolDefinition>, alias: string, tool: SkillAdvisorCliToolDefinition): void {
  const existing = map.get(alias);
  if (existing && existing.name !== tool.name) {
    throw new CliProtocolError(`Command alias collision: ${alias} maps to ${existing.name} and ${tool.name}`);
  }
  map.set(alias, tool);
}

function commandMap(): Map<string, SkillAdvisorCliToolDefinition> {
  const map = new Map<string, SkillAdvisorCliToolDefinition>();
  for (const tool of SKILL_ADVISOR_CLI_TOOL_MANIFEST) {
    for (const alias of tool.aliases) {
      setCommandAlias(map, alias, tool);
      setCommandAlias(map, normalizeName(alias), tool);
    }
  }
  return map;
}

function getToolDefinition(command: string): SkillAdvisorCliToolDefinition | null {
  return commandMap().get(command) ?? commandMap().get(normalizeName(command)) ?? null;
}

function inputPropertyNames(tool: SkillAdvisorCliToolDefinition): string[] {
  const schema = tool.inputSchema;
  const properties = typeof schema === 'object' && schema !== null && !Array.isArray(schema)
    ? (schema as { readonly properties?: unknown }).properties
    : null;
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return [];
  return Object.keys(properties);
}

function resolvePropertyName(rawFlag: string, tool: SkillAdvisorCliToolDefinition): string {
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
  if (/^-?(?:\d+|\d*\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) {
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) return parsed;
  }
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

function envTrustedDefault(): boolean {
  return process.env.MK_SKILL_ADVISOR_CLI_TRUSTED === '1'
    || process.env.SPECKIT_SKILL_ADVISOR_CLI_TRUSTED === '1';
}

function envFlagEnabled(name: string): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === null) return false;
  return ['1', 'true', 'yes', 'on'].includes(raw.trim().toLowerCase());
}

function defaultWarmOnly(): boolean {
  return envFlagEnabled('MK_SKILL_ADVISOR_CLI_WARM_ONLY')
    || envFlagEnabled('SPECKIT_SKILL_ADVISOR_CLI_WARM_ONLY')
    || envFlagEnabled('MK_SKILL_ADVISOR_CLI_PROMPT_TIME')
    || envFlagEnabled('SPECKIT_SKILL_ADVISOR_CLI_PROMPT_TIME')
    || envFlagEnabled('SPECKIT_CLI_PROMPT_TIME')
    || envFlagEnabled('OPENCODE_PROMPT_TIME')
    || envFlagEnabled('CODEX_PROMPT_TIME')
    || envFlagEnabled('CLAUDE_CODE_PROMPT_TIME');
}

export function parseCliArgs(argv: string[]): ParsedCommand {
  const command = argv[0];
  const trustedDefault = envTrustedDefault();
  const warmOnlyDefault = defaultWarmOnly();
  if (!command || command === '--help' || command === '-h') {
    return { command: '', format: 'text', timeoutMs: DEFAULT_TIMEOUT_MS, warmOnly: warmOnlyDefault, args: {}, help: true, version: false, trusted: trustedDefault };
  }
  if (command === '--version' || command === '-v') {
    return { command: '', format: 'text', timeoutMs: DEFAULT_TIMEOUT_MS, warmOnly: warmOnlyDefault, args: {}, help: false, version: true, trusted: trustedDefault };
  }

  let format: OutputFormat = 'json';
  let timeoutMs = DEFAULT_TIMEOUT_MS;
  let sessionId: string | undefined;
  let warmOnly = warmOnlyDefault;
  let jsonPayload: Record<string, unknown> | null = null;
  let trusted = trustedDefault;
  const tool = getToolDefinition(command);
  const parsedArgs: Record<string, unknown> = {};
  const tokens = argv.slice(1);
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];
    if (!token.startsWith('--')) {
      throw new CliUsageError(`Unexpected positional argument: ${token}`);
    }
    const rawFlag = token.slice(2).split('=', 1)[0];
    const option = `--${rawFlag}`;

    if (rawFlag === 'help' || rawFlag === 'h') {
      return { command, format: 'text', timeoutMs, sessionId, warmOnly, args: {}, help: true, version: false, trusted };
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
    if (rawFlag === 'json') {
      const read = readOptionValue(tokens, index, option);
      jsonPayload = parseJsonObject(read.value);
      index = read.nextIndex;
      continue;
    }
    if (rawFlag === 'trusted' || rawFlag === 'maintainer') {
      trusted = true;
      index += 1;
      continue;
    }
    if (rawFlag === 'untrusted') {
      trusted = false;
      index += 1;
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
    args: jsonPayload ?? parsedArgs,
    help: false,
    version: false,
    trusted,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function schemaTypes(schema: Record<string, unknown>): string[] {
  const type = schema.type;
  if (typeof type === 'string') return [type];
  if (Array.isArray(type) && type.every((entry) => typeof entry === 'string')) return type as string[];
  return [];
}

function coerceValueForSchema(schema: unknown, value: unknown): unknown {
  if (!isRecord(schema)) return value;
  const types = schemaTypes(schema);
  if (types.includes('number') && typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (types.includes('boolean') && typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  if (types.includes('object') && isRecord(value) && isRecord(schema.properties)) {
    return coerceObjectForSchema(schema, value);
  }
  if (types.includes('array') && Array.isArray(value)) {
    return value.map((entry) => coerceValueForSchema(schema.items, entry));
  }
  return value;
}

function coerceObjectForSchema(schema: Record<string, unknown>, args: Record<string, unknown>): Record<string, unknown> {
  if (!isRecord(schema.properties)) return args;
  const coerced: Record<string, unknown> = { ...args };
  for (const [key, value] of Object.entries(args)) {
    coerced[key] = coerceValueForSchema(schema.properties[key], value);
  }
  return coerced;
}

function expectedTypeLabel(types: string[]): string {
  return types.length > 0 ? types.join(' or ') : 'valid JSON schema value';
}

function valueType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function valueMatchesTypes(value: unknown, types: string[]): boolean {
  if (types.length === 0) return true;
  return types.some((type) => {
    if (type === 'null') return value === null;
    if (type === 'array') return Array.isArray(value);
    if (type === 'object') return isRecord(value);
    if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
    if (type === 'integer') return Number.isInteger(value);
    return typeof value === type;
  });
}

function validateJsonSchema(schema: unknown, value: unknown, location: string): void {
  if (!isRecord(schema)) return;
  const types = schemaTypes(schema);
  if (!valueMatchesTypes(value, types)) {
    throw new ToolSchemaValidationError(`${location} expected ${expectedTypeLabel(types)}, received ${valueType(value)}`);
  }

  if (Object.prototype.hasOwnProperty.call(schema, 'const') && value !== schema.const) {
    throw new ToolSchemaValidationError(`${location} must be ${JSON.stringify(schema.const)}`);
  }
  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    throw new ToolSchemaValidationError(`${location} must be one of: ${schema.enum.map(String).join(', ')}`);
  }

  if (typeof value === 'string') {
    if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
      throw new ToolSchemaValidationError(`${location} must be at least ${schema.minLength} character(s)`);
    }
    if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
      throw new ToolSchemaValidationError(`${location} must be at most ${schema.maxLength} character(s)`);
    }
  }

  if (typeof value === 'number') {
    if (typeof schema.minimum === 'number' && value < schema.minimum) {
      throw new ToolSchemaValidationError(`${location} must be >= ${schema.minimum}`);
    }
    if (typeof schema.maximum === 'number' && value > schema.maximum) {
      throw new ToolSchemaValidationError(`${location} must be <= ${schema.maximum}`);
    }
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === 'number' && value.length < schema.minItems) {
      throw new ToolSchemaValidationError(`${location} must contain at least ${schema.minItems} item(s)`);
    }
    if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) {
      throw new ToolSchemaValidationError(`${location} must contain at most ${schema.maxItems} item(s)`);
    }
    value.forEach((entry, index) => validateJsonSchema(schema.items, entry, `${location}[${index}]`));
  }

  if (isRecord(value)) {
    const properties = isRecord(schema.properties) ? schema.properties : {};
    const required = Array.isArray(schema.required) ? schema.required.filter((entry): entry is string => typeof entry === 'string') : [];
    for (const key of required) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        throw new ToolSchemaValidationError(`${location}.${key} is required`);
      }
    }
    if (schema.additionalProperties === false) {
      const unknownKeys = Object.keys(value).filter((key) => !Object.prototype.hasOwnProperty.call(properties, key));
      if (unknownKeys.length > 0) {
        throw new ToolSchemaValidationError(`Unknown parameter(s): ${unknownKeys.join(', ')}`);
      }
    }
    for (const [key, nestedValue] of Object.entries(value)) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        validateJsonSchema(properties[key], nestedValue, `${location}.${key}`);
      }
    }
  }
}

function formatValidationMessage(error: unknown): string {
  if (error instanceof ToolSchemaValidationError) return error.message;
  if (error instanceof Error) return error.message;
  return String(error);
}

function applySchemaDefaults(schema: unknown, args: Record<string, unknown>): Record<string, unknown> {
  if (!isRecord(schema) || !isRecord(schema.properties)) return args;
  const withDefaults: Record<string, unknown> = { ...args };
  for (const [key, propertySchema] of Object.entries(schema.properties)) {
    if (Object.prototype.hasOwnProperty.call(withDefaults, key)) continue;
    if (isRecord(propertySchema) && Object.prototype.hasOwnProperty.call(propertySchema, 'default')) {
      withDefaults[key] = propertySchema.default;
    }
  }
  return withDefaults;
}

function validateToolArgs(tool: SkillAdvisorCliToolDefinition, args: Record<string, unknown>): Record<string, unknown> {
  const coerced = coerceObjectForSchema(tool.inputSchema, applySchemaDefaults(tool.inputSchema, args));
  try {
    validateJsonSchema(tool.inputSchema, coerced, tool.name);
  } catch (error: unknown) {
    throw new ToolSchemaValidationError(`Invalid arguments for ${tool.name}: ${formatValidationMessage(error)}`);
  }
  return coerced;
}

function isPropagateApply(args: Record<string, unknown>): boolean {
  return args.mode === 'apply' && args.dryRun !== true;
}

function assertTrustedForMutation(toolName: string, args: Record<string, unknown>, trusted: boolean): void {
  const requiresTrusted = toolName === 'advisor_rebuild'
    || toolName === 'skill_graph_scan'
    || (toolName === 'skill_graph_propagate_enhances' && isPropagateApply(args));
  if (!requiresTrusted || trusted) return;
  throw new CliUsageError(`${toolName} requires --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1`);
}

function validateCommand(parsed: ParsedCommand): { readonly tool: SkillAdvisorCliToolDefinition; readonly args: Record<string, unknown> } | null {
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

  const validated = validateToolArgs(tool, args);
  assertTrustedForMutation(tool.name, validated, parsed.trusted);
  return { tool, args: validated };
}

function renderJson(value: unknown, format: OutputFormat): string {
  if (format === 'jsonl') return JSON.stringify(value);
  return JSON.stringify(value, null, 2);
}

function usageText(command?: string): string {
  const tool = command ? getToolDefinition(command) : null;
  if (tool) {
    return `skill-advisor ${tool.command}

Description:
  ${tool.description}

Aliases:
  ${tool.aliases.join(', ')}

Input schema:
${JSON.stringify(tool.inputSchema, null, 2)}`;
  }

  const commands = SKILL_ADVISOR_CLI_TOOL_MANIFEST
    .map((entry) => `  ${entry.command} (${entry.kebabCommand}, ${entry.camelCommand})`)
    .join('\n');

  return `skill-advisor - daemon-backed CLI for mk-skill-advisor

Usage:
  skill-advisor list-tools [--format json|text|jsonl]
  skill-advisor <tool_name> [--json '{...}'] [--format json|text|jsonl] [--timeout-ms N] [--trusted] [--warm-only]
  skill-advisor <tool_name> --param value [--another-param value]

Commands:
${commands}

Examples:
  skill-advisor list-tools --format text
  skill-advisor advisor_status --workspace-root "$PWD" --format text
  skill-advisor advisor_recommend --prompt "implement cli core"
  skill-advisor advisor_rebuild --trusted --force true
  skill-advisor skill_graph_scan --trusted --format text

Trusted context:
  Mutation commands require --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1.
  Calls are sent as untrusted by default.

Exit codes:
  0 success, 1 runtime error, 64 usage/schema error, 69 protocol mismatch, 75 retryable daemon error`;
}

function renderToolList(format: OutputFormat): string {
  const payload = {
    status: 'ok',
    data: {
      count: SKILL_ADVISOR_CLI_TOOL_MANIFEST.length,
      tools: SKILL_ADVISOR_CLI_TOOL_MANIFEST.map((tool) => ({
        name: tool.name,
        command: tool.command,
        kebabCommand: tool.kebabCommand,
        camelCommand: tool.camelCommand,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    },
  };

  if (format === 'text') {
    return SKILL_ADVISOR_CLI_TOOL_MANIFEST.map((tool) => tool.name).join('\n');
  }
  return renderJson(payload, format);
}

function isErrorPayload(payload: unknown): boolean {
  return isRecord(payload) && payload.status === 'error';
}

function extractToolPayload(toolName: string, result: unknown): ToolPayloadResult {
  const toolResult = result && typeof result === 'object' ? result as ToolResult : null;
  const firstText = toolResult?.content?.find((entry) => typeof entry.text === 'string')?.text;
  if (firstText) {
    try {
      const payload = JSON.parse(firstText) as unknown;
      return {
        payload,
        isError: toolResult?.isError === true || isErrorPayload(payload),
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

function getDataRecord(payload: unknown): Record<string, unknown> | null {
  if (!isRecord(payload) || !isRecord(payload.data)) return null;
  return payload.data;
}

function renderJobText(toolName: string, payload: unknown): string | null {
  const data = getDataRecord(payload);
  if (!data) return null;

  if (toolName === 'advisor_rebuild') {
    return [
      `advisor_rebuild: ${data.rebuilt === true ? 'rebuilt' : 'skipped'}`,
      `reason: ${String(data.reason ?? 'unknown')}`,
      `freshness: ${String(data.freshnessBefore ?? 'unknown')} -> ${String(data.freshnessAfter ?? 'unknown')}`,
      `generation: ${String(data.generationBefore ?? 'unknown')} -> ${String(data.generationAfter ?? 'unknown')}`,
      `skillCount: ${String(data.skillCount ?? 'unknown')}`,
    ].join('\n');
  }

  if (toolName === 'skill_graph_scan') {
    const scan = isRecord(data.scan) ? data.scan : data;
    return [
      'skill_graph_scan: completed',
      `generation: ${String(data.generationBefore ?? 'unknown')} -> ${String(data.generationAfter ?? 'unknown')}`,
      `scannedFiles: ${String(scan.scannedFiles ?? 'unknown')}`,
      `indexedFiles: ${String(scan.indexedFiles ?? 'unknown')}`,
      `indexedEdges: ${String(scan.indexedEdges ?? 'unknown')}`,
      `rejectedEdges: ${String(scan.rejectedEdges ?? 'unknown')}`,
    ].join('\n');
  }

  return null;
}

function renderPayload(payload: unknown, format: OutputFormat, toolName?: string): string {
  if (format === 'json' || format === 'jsonl') return renderJson(payload, format);
  if (toolName) {
    const jobText = renderJobText(toolName, payload);
    if (jobText) return jobText;
  }
  if (isRecord(payload)) {
    if (typeof payload.summary === 'string') return payload.summary;
    if (typeof payload.error === 'string') return payload.error;
    if (typeof payload.message === 'string') return payload.message;
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
  for (const tool of SKILL_ADVISOR_CLI_TOOL_MANIFEST) {
    for (const alias of tool.aliases) {
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

function ensureSocketEnvironment(): void {
  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
    process.env.SPECKIT_IPC_SOCKET_DIR = DEFAULT_SOCKET_DIR;
  }
  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
  if (!socketDir || socketDir.startsWith('tcp://')) return;
  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  const stat = statSync(socketDir);
  if ((stat.mode & 0o022) !== 0) {
    throw new CliProtocolError(`IPC socket directory is group/world-writable: ${socketDir}`);
  }
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

function callerMeta(trusted: boolean): Record<string, unknown> {
  return {
    transport: 'cli',
    trusted,
    callerAuthority: trusted ? 'trusted' : 'untrusted',
    pid: process.pid,
    client: 'skill-advisor-cli',
  };
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

async function callTool(toolName: string, args: Record<string, unknown>, timeoutMs: number, trusted: boolean, warmOnly: boolean): Promise<unknown> {
  ensureSocketEnvironment();
  const paths = findRepoPaths();
  const bridge = loadBridge(paths);
  const socketPath = bridge.getIpcSocketPath('mk-skill-advisor', { dbDir: paths.dbDir });
  if (socketPathTooLong(socketPath)) {
    throw new CliProtocolError(`IPC socket path exceeds the Darwin sun_path limit: ${socketPath}`);
  }

  await ensureDaemonReady(socketPath, bridge, paths, timeoutMs, warmOnly);

  const client = await JsonRpcSocketClient.connect(socketPath, bridge, timeoutMs);
  try {
    const initialize = await client.request('initialize', {
      protocolVersion: JSON_RPC_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: 'skill-advisor-cli', version: readCliVersion(paths) },
    }, timeoutMs) as InitializeResult;
    if (initialize.protocolVersion && initialize.protocolVersion !== JSON_RPC_PROTOCOL_VERSION) {
      throw new CliProtocolError(`backend protocol version changed: ${initialize.protocolVersion}`);
    }
    client.notify('notifications/initialized');
    return await client.request('tools/call', {
      name: toolName,
      arguments: args,
      _meta: callerMeta(trusted),
    }, timeoutMs);
  } finally {
    client.close();
  }
}

async function invokeToolPayload(toolName: string, args: Record<string, unknown>, timeoutMs: number, trusted: boolean, warmOnly: boolean): Promise<ToolPayloadResult> {
  const result = await callTool(toolName, args, timeoutMs, trusted, warmOnly);
  return extractToolPayload(toolName, result);
}

function generationFromPayload(payload: unknown): unknown {
  return getDataRecord(payload)?.generation ?? null;
}

async function runSkillGraphScanJob(args: Record<string, unknown>, timeoutMs: number, trusted: boolean, warmOnly: boolean): Promise<ToolPayloadResult> {
  const workspaceRoot = findRepoPaths().repoRoot;
  const before = await invokeToolPayload('advisor_status', { workspaceRoot }, timeoutMs, false, warmOnly);
  const scan = await invokeToolPayload('skill_graph_scan', args, timeoutMs, trusted, warmOnly);
  const after = await invokeToolPayload('advisor_status', { workspaceRoot }, timeoutMs, false, warmOnly);
  const status = isRecord(scan.payload) && typeof scan.payload.status === 'string' ? scan.payload.status : 'ok';
  const scanData = getDataRecord(scan.payload) ?? scan.payload;

  return {
    payload: {
      status,
      data: {
        progress: [
          { step: 'advisor_status_before', generation: generationFromPayload(before.payload), ok: !before.isError },
          { step: 'skill_graph_scan', ok: !scan.isError },
          { step: 'advisor_status_after', generation: generationFromPayload(after.payload), ok: !after.isError },
        ],
        generationBefore: generationFromPayload(before.payload),
        generationAfter: generationFromPayload(after.payload),
        scan: scanData,
      },
      ...(isRecord(scan.payload) && typeof scan.payload.error === 'string' ? { error: scan.payload.error } : {}),
    },
    isError: before.isError || scan.isError || after.isError,
  };
}

export async function runSkillAdvisorCli(argv: string[], io: CliIo = { stdout: process.stdout, stderr: process.stderr }): Promise<number> {
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
      await writeLine(io.stdout, renderToolList(parsed.format));
      return EXIT_SUCCESS;
    }

    const validated = validateCommand(parsed);
    if (!validated) {
      throw new CliUsageError(`Unknown command: ${parsed.command}`);
    }

    const invoked = validated.tool.name === 'skill_graph_scan'
      ? await runSkillGraphScanJob(validated.args, parsed.timeoutMs, parsed.trusted, parsed.warmOnly)
      : await invokeToolPayload(validated.tool.name, validated.args, parsed.timeoutMs, parsed.trusted, parsed.warmOnly);
    await writeLine(io.stdout, renderPayload(invoked.payload, parsed.format, validated.tool.name));
    return invoked.isError ? EXIT_RUNTIME : EXIT_SUCCESS;
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
  EXIT_USAGE,
  commandMap,
  closestCommand,
  ensureSocketEnvironment,
  exitCodeForError,
  findRepoPaths,
  renderToolList,
  resolvePropertyName,
};

if (isCliEntrypoint()) {
  // Natural exit via process.exitCode: a hard process.exit() drops any
  // stdout bytes still queued behind the kernel pipe buffer, truncating
  // large payloads. Pending pipe writes keep the event loop alive until
  // they flush; all sockets and timers are closed or unref'd by here.
  process.exitCode = await runSkillAdvisorCli(process.argv.slice(2));
}
