// MODULE: Deep-Loop Permissions Gate

import { existsSync, lstatSync, readlinkSync, realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

export type OperationClass = 'read' | 'write' | 'edit' | 'delete' | 'execute';
export type PermissionScope = 'packet-local' | 'repo-wide' | 'external';
export type PermissionEffect = 'allow' | 'deny';

export type PermissionRule = {
  target_glob: string;
  operation_class: OperationClass;
  scope: PermissionScope;
  effect: PermissionEffect;
  rationale: string;
};

export type PermissionsMatrix = {
  version: string;
  description?: string;
  rules: PermissionRule[];
};

export type ToolCallEvaluation = {
  allowed: boolean;
  reason: string;
  ruleId?: string;
};

export type PreDispatchToolCall = {
  toolName: string;
  args: Record<string, unknown>;
};

type NormalizedTarget = {
  operation: OperationClass;
  targets: string[];
};

type Specificity = {
  literalPrefixLength: number;
  wildcardCount: number;
};

type RuleMatch = {
  rule: PermissionRule;
  ruleId: string;
  specificity: Specificity;
  index: number;
};

const DEFAULT_DENY_REASON = 'default-deny (matrix empty or malformed)';
const MAX_SYMLINK_DEPTH = 10;
const globCache = new Map<string, RegExp>();
let repoRootCache: string | null | undefined;

function isPermissionsMatrix(value: unknown): value is PermissionsMatrix {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const candidate = value as { version?: unknown; rules?: unknown };
  return typeof candidate.version === 'string' && Array.isArray(candidate.rules);
}

function isPermissionRule(value: unknown): value is PermissionRule {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const candidate = value as Partial<Record<keyof PermissionRule, unknown>>;
  return (
    typeof candidate.target_glob === 'string' &&
    isOperationClass(candidate.operation_class) &&
    (candidate.scope === 'packet-local' || candidate.scope === 'repo-wide' || candidate.scope === 'external') &&
    (candidate.effect === 'allow' || candidate.effect === 'deny') &&
    typeof candidate.rationale === 'string'
  );
}

function isOperationClass(value: unknown): value is OperationClass {
  return value === 'read' || value === 'write' || value === 'edit' || value === 'delete' || value === 'execute';
}

function normalizeSeparators(value: string): string {
  return value.replace(/\\/g, '/');
}

function expandHome(value: string): string {
  if (value === '~') return homedir();
  if (value.startsWith('~/')) return path.join(homedir(), value.slice(2));
  return value;
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function globToRegexSource(glob: string): string {
  let source = '';

  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];
    const next = glob[index + 1];

    if (char === '*' && next === '*') {
      source += '.*';
      index += 1;
      continue;
    }

    if (char === '*') {
      source += '[^/]*';
      continue;
    }

    if (char === '?') {
      source += '[^/]';
      continue;
    }

    if (char === '[') {
      const closeIndex = glob.indexOf(']', index + 1);
      if (closeIndex > index + 1) {
        source += glob.slice(index, closeIndex + 1);
        index = closeIndex;
        continue;
      }
    }

    source += escapeRegex(char);
  }

  return source;
}

function compileGlob(glob: string): RegExp {
  const normalizedGlob = normalizeSeparators(expandHome(glob));
  const cached = globCache.get(normalizedGlob);
  if (cached) return cached;

  const regex = new RegExp(`^${globToRegexSource(normalizedGlob)}$`);
  globCache.set(normalizedGlob, regex);
  return regex;
}

function globMatches(glob: string, target: string): boolean {
  return compileGlob(glob).test(normalizeSeparators(expandHome(target)));
}

function measureSpecificity(glob: string): Specificity {
  const normalizedGlob = normalizeSeparators(expandHome(glob));
  const wildcardIndex = normalizedGlob.search(/[*?[]/);
  const literalPrefixLength = wildcardIndex === -1 ? normalizedGlob.length : wildcardIndex;
  const wildcardCount = [...normalizedGlob].filter((char) => char === '*' || char === '?' || char === '[').length;

  return { literalPrefixLength, wildcardCount };
}

function compareSpecificity(left: Specificity, right: Specificity): number {
  if (left.literalPrefixLength !== right.literalPrefixLength) {
    return left.literalPrefixLength - right.literalPrefixLength;
  }
  return right.wildcardCount - left.wildcardCount;
}

function sanitizePathForReason(target: string): string {
  if (target.startsWith(process.cwd())) return normalizeSeparators(path.relative(process.cwd(), target));
  return normalizeSeparators(target);
}

function findRepoRoot(): string | null {
  if (repoRootCache !== undefined) return repoRootCache;

  let current = process.cwd();
  while (true) {
    if (existsSync(path.join(current, '.git')) || existsSync(path.join(current, '.opencode'))) {
      repoRootCache = realpathSync.native(current);
      return repoRootCache;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      repoRootCache = null;
      return repoRootCache;
    }
    current = parent;
  }
}

function resolveExistingPathWithDepth(absPath: string): string | null {
  let current = absPath;
  let depth = 0;

  while (true) {
    const stat = lstatSync(current);
    if (!stat.isSymbolicLink()) return realpathSync.native(current);
    if (depth >= MAX_SYMLINK_DEPTH) return null;
    const linkTarget = readlinkSync(current);
    current = path.resolve(path.dirname(current), linkTarget);
    depth += 1;
  }
}

function resolvePathTarget(rawPath: string): string | null {
  const absolutePath = path.resolve(expandHome(rawPath));

  try {
    if (existsSync(absolutePath)) return resolveExistingPathWithDepth(absolutePath);

    const missingSegments: string[] = [];
    let existingParent = absolutePath;
    while (!existsSync(existingParent)) {
      const parent = path.dirname(existingParent);
      if (parent === existingParent) return null;
      missingSegments.unshift(path.basename(existingParent));
      existingParent = parent;
    }

    const resolvedParent = resolveExistingPathWithDepth(existingParent);
    if (!resolvedParent) return null;
    return path.join(resolvedParent, ...missingSegments);
  } catch {
    return null;
  }
}

function pathCandidates(rawPath: string): string[] | null {
  const resolved = resolvePathTarget(rawPath);
  if (!resolved) return null;

  const absolute = normalizeSeparators(resolved);
  const relative = normalizeSeparators(path.relative(process.cwd(), resolved));
  const candidates = new Set<string>([absolute]);
  if (relative !== '') candidates.add(relative);

  const repoRoot = findRepoRoot();
  if (repoRoot && resolved.startsWith(repoRoot)) {
    candidates.add(normalizeSeparators(path.relative(repoRoot, resolved)));
  }

  const opencodeIndex = absolute.indexOf('/.opencode/');
  if (opencodeIndex >= 0) {
    candidates.add(absolute.slice(opencodeIndex + 1));
  }

  return [...candidates];
}

function stringArg(args: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = args[key];
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return null;
}

function mapToolToOperation(toolName: string): OperationClass | null {
  const normalized = toolName.toLowerCase();
  if (normalized === 'read' || normalized === 'grep' || normalized === 'glob') return 'read';
  if (normalized === 'write') return 'write';
  if (normalized === 'edit' || normalized === 'multiedit' || normalized === 'apply_patch') return 'edit';
  if (normalized === 'delete') return 'delete';
  if (normalized === 'bash' || normalized === 'exec' || normalized === 'shell') return 'execute';
  return null;
}

function tokenizeCommand(command: string): string[] {
  const matches = command.match(/"[^"]*"|'[^']*'|[^\s]+/g);
  return matches?.map((token) => token.replace(/^['"]|['"]$/g, '')) ?? [];
}

function commandSegments(command: string): string[] {
  return command
    .split(/\s*(?:&&|\|\||;|\|)\s*/u)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function bashTargets(command: string): string[] {
  const targets: string[] = [];

  for (const segment of commandSegments(command)) {
    const tokens = tokenizeCommand(segment);
    if (tokens.length === 0) continue;
    const commandName = path.basename(tokens[0]);

    if (commandName === 'cd') continue;

    if (commandName === 'sed' && tokens.some((token) => token === '-i' || token.startsWith('-i'))) {
      targets.push('Exec(sed -i)');
      continue;
    }

    if (commandName === 'find' && tokens.includes('-delete')) {
      targets.push('Exec(rm)');
      continue;
    }

    if (commandName === 'git' && tokens[1] === 'rm') {
      targets.push('Exec(rm)');
      continue;
    }

    targets.push(`Exec(${commandName})`);
  }

  return targets.length > 0 ? targets : ['Exec(unknown)'];
}

function normalizeToolCall(toolName: string, args: Record<string, unknown>): NormalizedTarget | ToolCallEvaluation {
  const operation = mapToolToOperation(toolName);
  if (!operation) return { allowed: false, reason: `default-deny (unsupported tool ${toolName})` };

  if (operation === 'execute') {
    const command = stringArg(args, ['command', 'cmd', 'script']);
    if (!command) return { allowed: false, reason: 'default-deny (missing Bash command)' };
    return { operation, targets: bashTargets(command) };
  }

  const rawPath =
    stringArg(args, ['file_path', 'path', 'target_path']) ??
    stringArg(args, ['source_path', 'old_path', 'new_path']);
  if (!rawPath) return { allowed: false, reason: 'default-deny (missing file path)' };

  const candidates = pathCandidates(rawPath);
  if (!candidates) return { allowed: false, reason: 'symlink resolution failed' };
  return { operation, targets: candidates };
}

function findBestRule(operation: OperationClass, targets: string[], activeMatrix: PermissionsMatrix): RuleMatch | null {
  let bestMatch: RuleMatch | null = null;

  activeMatrix.rules.forEach((rule, index) => {
    if (!isPermissionRule(rule) || rule.operation_class !== operation) return;
    if (!targets.some((target) => globMatches(rule.target_glob, target))) return;

    const match: RuleMatch = {
      rule,
      ruleId: `rule-${index + 1}`,
      specificity: measureSpecificity(rule.target_glob),
      index,
    };

    if (!bestMatch) {
      bestMatch = match;
      return;
    }

    const specificityDelta = compareSpecificity(match.specificity, bestMatch.specificity);
    if (specificityDelta > 0 || (specificityDelta === 0 && match.index < bestMatch.index)) {
      bestMatch = match;
    }
  });

  return bestMatch;
}

function evaluateNormalizedTarget(operation: OperationClass, targets: string[], activeMatrix: PermissionsMatrix): ToolCallEvaluation {
  const match = findBestRule(operation, targets, activeMatrix);
  if (!match) return { allowed: false, reason: DEFAULT_DENY_REASON };

  const targetLabel = targets.map(sanitizePathForReason).join(', ');
  if (match.rule.effect === 'allow') {
    return {
      allowed: true,
      reason: `allowed by ${match.ruleId} (${match.rule.target_glob}) for ${targetLabel}`,
      ruleId: match.ruleId,
    };
  }

  return {
    allowed: false,
    reason: `denied by ${match.ruleId}: target_glob=${match.rule.target_glob}; rationale=${match.rule.rationale}`,
    ruleId: match.ruleId,
  };
}

export function evaluateToolCall(
  toolName: string,
  args: Record<string, unknown>,
  activeMatrix: PermissionsMatrix,
): ToolCallEvaluation {
  try {
    if (!isPermissionsMatrix(activeMatrix) || activeMatrix.rules.length === 0 || !activeMatrix.rules.every(isPermissionRule)) {
      return { allowed: false, reason: DEFAULT_DENY_REASON };
    }

    const normalized = normalizeToolCall(toolName, args);
    if ('allowed' in normalized) return normalized;

    if (normalized.operation === 'execute') {
      for (const target of normalized.targets) {
        const result = evaluateNormalizedTarget(normalized.operation, [target], activeMatrix);
        if (!result.allowed) return result;
      }
    }

    return evaluateNormalizedTarget(normalized.operation, normalized.targets, activeMatrix);
  } catch {
    return { allowed: false, reason: DEFAULT_DENY_REASON };
  }
}

export function evaluatePreDispatchToolCalls(
  toolCalls: PreDispatchToolCall[],
  activeMatrix?: PermissionsMatrix | null,
): ToolCallEvaluation {
  if (!activeMatrix) {
    return {
      allowed: true,
      reason: 'legacy fallback: no permissions-matrix configured; use RM-8 four-layer prose mitigation',
    };
  }

  for (const toolCall of toolCalls) {
    const result = evaluateToolCall(toolCall.toolName, toolCall.args, activeMatrix);
    if (!result.allowed) return result;
  }

  return { allowed: true, reason: `all ${toolCalls.length} tool calls allowed by permissions matrix` };
}
