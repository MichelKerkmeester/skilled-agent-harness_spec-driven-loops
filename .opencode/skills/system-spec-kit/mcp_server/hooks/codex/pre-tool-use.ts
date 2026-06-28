#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Codex PreToolUse Hook — Bash Deny Policy
// ───────────────────────────────────────────────────────────────
// Codex PreToolUse is intentionally narrow here: only Bash commands can
// be denied, and only when they match starter policy phrases.

import {
  existsSync,
  readFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export interface CodexPreToolUseInput {
  readonly tool?: string;
  readonly tool_name?: string;
  readonly toolName?: string;
  readonly command?: string;
  readonly tool_input?: {
    readonly command?: string;
    readonly [key: string]: unknown;
  };
  readonly toolInput?: {
    readonly command?: string;
    readonly [key: string]: unknown;
  };
  readonly input?: {
    readonly command?: string;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

export interface BashDenylistEntry {
  readonly pattern: string;
  readonly reason?: string;
}

export interface OpenDesignPreconditions {
  readonly guardedTools?: readonly string[];
}

export interface CodexPolicyFile {
  readonly version?: number;
  readonly notes?: string;
  readonly bashDenylist?: readonly (string | BashDenylistEntry)[];
  readonly bash_denylist?: readonly (string | BashDenylistEntry)[];
  readonly openDesignPreconditions?: OpenDesignPreconditions;
  readonly toolPreconditions?: {
    readonly openDesignPreconditions?: OpenDesignPreconditions;
  };
}

export type CodexPreToolUseOutput =
  | {
    readonly decision: 'deny';
    readonly reason: string;
  }
  | Record<string, never>;

export interface CodexPreToolUseDependencies {
  readonly policyPath?: string;
  readonly readPolicy?: () => CodexPolicyFile;
  readonly validateOpenDesignToken?: (token: unknown, input: CodexPreToolUseInput) => boolean;
}

export const DEFAULT_CODEX_BASH_DENYLIST: readonly string[] = [
  'rm -rf /',
  'rm -rf ~',
  'rm -rf $HOME',
  'git push --force main',
  'git push --force master',
  'git push -f main',
  'git push -f master',
  'git reset --hard',
  'git reset --hard origin/main',
  'git reset --hard origin/master',
  'sudo shutdown',
  'sudo reboot',
  'sudo rm -rf',
  ':(){ :|:& };:',
  'chmod -R 777 /',
  'chown -R root:root /',
  'dd if=/dev/zero of=/dev/',
  'mkfs.ext4 /dev/',
];

export const DEFAULT_POLICY: CodexPolicyFile = {
  version: 1,
  notes: 'In-memory starter Bash denylist for Codex PreToolUse; this is not a comprehensive destructive-command policy or shell-safety parser. Run npm run setup:codex-policy to write a repo-local policy file.',
  bashDenylist: DEFAULT_CODEX_BASH_DENYLIST,
};

let cachedPolicyPath: string | null = null;
let cachedPolicy: CodexPolicyFile | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseCodexPreToolUseInput(raw: string): CodexPreToolUseInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function defaultCodexPolicyPath(): string {
  return resolve(process.cwd(), '.codex', 'policy.json');
}

function writeMissingPolicyDiagnostic(policyPath: string): void {
  process.stderr.write(`${JSON.stringify({
    hook: 'codex-pre-tool-use',
    status: 'in_memory_default',
    policyPath,
  })}\n`);
}

function loadPolicy(policyPath: string): CodexPolicyFile {
  if (cachedPolicy && cachedPolicyPath === policyPath) {
    return cachedPolicy;
  }
  if (!existsSync(policyPath)) {
    cachedPolicy = DEFAULT_POLICY;
    cachedPolicyPath = policyPath;
    writeMissingPolicyDiagnostic(policyPath);
    return cachedPolicy;
  }
  try {
    const parsed = JSON.parse(readFileSync(policyPath, 'utf8')) as unknown;
    cachedPolicy = isRecord(parsed) ? parsed as CodexPolicyFile : DEFAULT_POLICY;
  } catch {
    cachedPolicy = DEFAULT_POLICY;
  }
  cachedPolicyPath = policyPath;
  return cachedPolicy;
}

function readPolicyQuiet(policyPath: string): CodexPolicyFile {
  if (!existsSync(policyPath)) {
    return {};
  }
  try {
    const parsed = JSON.parse(readFileSync(policyPath, 'utf8')) as unknown;
    return isRecord(parsed) ? parsed as CodexPolicyFile : {};
  } catch {
    return {};
  }
}

function toolNameFor(input: CodexPreToolUseInput): string | null {
  const toolName = input.tool ?? input.tool_name ?? input.toolName;
  return typeof toolName === 'string' ? toolName : null;
}

function bashCommandFor(input: CodexPreToolUseInput): string | null {
  const command = input.command ?? input.tool_input?.command ?? input.toolInput?.command ?? input.input?.command;
  return typeof command === 'string' ? command : null;
}

function normalizeEntry(entry: string | BashDenylistEntry): BashDenylistEntry | null {
  if (typeof entry === 'string' && entry.trim().length > 0) {
    return { pattern: entry.trim() };
  }
  if (typeof entry !== 'object' || entry === null) {
    return null;
  }
  if (typeof entry.pattern === 'string' && entry.pattern.trim().length > 0) {
    return {
      pattern: entry.pattern.trim(),
      ...(entry.reason ? { reason: entry.reason } : {}),
    };
  }
  return null;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function commandMatchesPattern(command: string, pattern: string): boolean {
  const escaped = escapeRegex(pattern).replace(/\s+/g, '\\s+');
  const startsWithWord = /^\w/.test(pattern);
  const endsWithWord = /\w$/.test(pattern);
  const prefix = startsWithWord ? '(?<![\\w-])' : '';
  const suffix = endsWithWord ? '(?![\\w-])' : '(?=$|[\\s;&|])';
  return new RegExp(`${prefix}${escaped}${suffix}`).test(command);
}

function denylistMatch(
  command: string,
  entries: readonly (string | BashDenylistEntry)[] | undefined,
): BashDenylistEntry | null {
  for (const rawEntry of entries ?? []) {
    const entry = normalizeEntry(rawEntry);
    if (!entry) {
      continue;
    }
    if (commandMatchesPattern(command, entry.pattern)) {
      return entry;
    }
  }
  return null;
}

function denylistEntries(policy: CodexPolicyFile): readonly (string | BashDenylistEntry)[] {
  return [
    ...(policy.bashDenylist ?? []),
    ...(policy.bash_denylist ?? []),
    ...DEFAULT_CODEX_BASH_DENYLIST,
  ];
}

function normalizeGuardedToolName(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function guardedToolEntries(preconditions: OpenDesignPreconditions | undefined): readonly string[] {
  if (!Array.isArray(preconditions?.guardedTools)) {
    return [];
  }
  return preconditions.guardedTools
    .map(normalizeGuardedToolName)
    .filter((toolName): toolName is string => toolName !== null);
}

function resolveGuardedOpenDesignTools(
  dependencies: CodexPreToolUseDependencies,
): readonly string[] {
  const policy = dependencies.readPolicy?.()
    ?? readPolicyQuiet(dependencies.policyPath ?? defaultCodexPolicyPath());
  return [
    ...guardedToolEntries(policy.openDesignPreconditions),
    ...guardedToolEntries(policy.toolPreconditions?.openDesignPreconditions),
  ];
}

function fieldFromRecord(record: unknown, key: string): unknown {
  return isRecord(record) ? record[key] : undefined;
}

function extractDesignProofToken(input: CodexPreToolUseInput): unknown {
  return fieldFromRecord(input.tool_input, 'designProofToken')
    ?? fieldFromRecord(input.toolInput, 'designProofToken')
    ?? fieldFromRecord(input.input, 'designProofToken')
    ?? input.designProofToken;
}

const SHA256_DIGEST_PATTERN = /^sha256:[a-f0-9]{64}$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && SHA256_DIGEST_PATTERN.test(value);
}

function hasValidLoadedFiles(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }
  return value.every((file) => (
    isRecord(file)
    && isNonEmptyString(file.path)
    && isDigest(file.sha256)
  ));
}

function hasValidWorkflowModes(value: unknown): boolean {
  return Array.isArray(value)
    && value.length > 0
    && value.every(isNonEmptyString);
}

function isValidTokenTimeWindow(issuedAt: unknown, expiresAt: unknown): boolean {
  if (typeof issuedAt !== 'string' || typeof expiresAt !== 'string') {
    return false;
  }
  const issuedTime = Date.parse(issuedAt);
  const expiryTime = Date.parse(expiresAt);
  if (!Number.isFinite(issuedTime) || !Number.isFinite(expiryTime)) {
    return false;
  }
  const now = Date.now();
  return issuedTime <= now && now < expiryTime;
}

function isStructurallyValidDesignProofToken(token: unknown): boolean {
  if (!isRecord(token) || token.version !== 1) {
    return false;
  }
  if (!hasValidLoadedFiles(token.loadedFiles) || !hasValidWorkflowModes(token.workflowModes)) {
    return false;
  }
  if (!isDigest(token.subjectDigest)
    || !isDigest(token.briefDigest)
    || !isDigest(token.formAnswersDigest)
    || !isDigest(token.openDesignLineageDigest)) {
    return false;
  }
  if (!isValidTokenTimeWindow(token.issuedAt, token.expiresAt)) {
    return false;
  }
  return token.singleUse === true
    && isNonEmptyString(token.nonce)
    && isNonEmptyString(token.runId)
    && isNonEmptyString(token.mintedBy)
    && isNonEmptyString(token.boundSurface);
}

function evaluateOpenDesignPrecondition(
  input: CodexPreToolUseInput,
  dependencies: CodexPreToolUseDependencies,
): CodexPreToolUseOutput | null {
  let toolName: string | null;
  let guardedTools: readonly string[];
  try {
    toolName = toolNameFor(input);
    if (!toolName) {
      return null;
    }
    guardedTools = resolveGuardedOpenDesignTools(dependencies);
  } catch {
    return null;
  }

  if (guardedTools.length === 0 || !guardedTools.includes(toolName)) {
    return null;
  }

  try {
    const token = extractDesignProofToken(input);
    const valid = dependencies.validateOpenDesignToken
      ? dependencies.validateOpenDesignToken(token, input)
      : isStructurallyValidDesignProofToken(token);
    if (!valid) {
      return {
        decision: 'deny',
        reason: 'Guarded Open Design call denied: missing or invalid design proof token',
      };
    }
    return {};
  } catch {
    return {
      decision: 'deny',
      reason: 'Guarded Open Design call denied: precondition validator error',
    };
  }
}

export function clearCodexPreToolUsePolicyCacheForTests(): void {
  cachedPolicy = null;
  cachedPolicyPath = null;
}

export function handleCodexPreToolUse(
  input: CodexPreToolUseInput | null,
  dependencies: CodexPreToolUseDependencies = {},
): CodexPreToolUseOutput {
  try {
    if (!input) {
      return {};
    }

    const openDesignDecision = evaluateOpenDesignPrecondition(input, dependencies);
    if (openDesignDecision !== null) {
      return openDesignDecision;
    }

    if (toolNameFor(input) !== 'Bash') {
      return {};
    }

    const command = bashCommandFor(input);
    if (command === null) {
      return {};
    }

    const policy = dependencies.readPolicy?.() ?? loadPolicy(dependencies.policyPath ?? defaultCodexPolicyPath());
    const match = denylistMatch(command, denylistEntries(policy));
    if (!match) {
      return {};
    }

    return {
      decision: 'deny',
      reason: match.reason ?? `Codex PreToolUse denied Bash command matching ${match.pattern}`,
    };
  } catch {
    return {};
  }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

function writeHookOutput(output: CodexPreToolUseOutput): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const input = rawInput ? parseCodexPreToolUseInput(rawInput) : null;
  await writeHookOutput(handleCodexPreToolUse(input));
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
