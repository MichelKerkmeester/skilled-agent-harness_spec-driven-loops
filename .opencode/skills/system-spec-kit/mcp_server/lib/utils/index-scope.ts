// ───────────────────────────────────────────────────────────────
// MODULE: Index Scope Invariants
// ───────────────────────────────────────────────────────────────

const SEGMENT_BOUNDARY = '(^|/)';
const SEGMENT_END = '(/|$)';

export type IndexScopePolicySource = 'default' | 'env' | 'scan-argument';
export type IncludedSkillsList = 'all' | 'none' | string[];

export interface IndexScopePolicy {
  includeSkills: boolean;
  includedSkillsList: IncludedSkillsList;
  source: IndexScopePolicySource;
  fingerprint: string;
  label: string;
  excludedSkillGlobs: readonly string[];
  includeAgents: boolean;
  includeCommands: boolean;
  includeSpecs: boolean;
  includePlugins: boolean;
  includeGlobs: readonly string[];
  excludeGlobs: readonly string[];
  excludedAgentGlobs: readonly string[];
  excludedCommandGlobs: readonly string[];
  excludedSpecGlobs: readonly string[];
  excludedPluginGlobs: readonly string[];
}

export interface ResolveIndexScopePolicyInput {
  includeSkills?: boolean | string[];
  includeAgents?: boolean;
  includeCommands?: boolean;
  includeSpecs?: boolean;
  includePlugins?: boolean;
  includeGlobs?: readonly string[];
  excludeGlobs?: readonly string[];
  env?: Record<string, string | undefined>;
}

const CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS = {
  skill: ['**/.opencode/skills/**'],
  agent: ['**/.opencode/agents/**'],
  command: ['**/.opencode/commands/**'],
  specs: ['**/.opencode/specs/**'],
  plugins: ['**/.opencode/plugins/**'],
} as const;

function compileSegmentPattern(segment: string): RegExp {
  return new RegExp(`${SEGMENT_BOUNDARY}${segment}${SEGMENT_END}`, 'i');
}

function normalizeIndexScopePath(filePath: string | null | undefined): string {
  if (!filePath || typeof filePath !== 'string') {
    return '';
  }

  return filePath.replace(/\\/g, '/').replace(/\/+/g, '/');
}

function matchesAnyPattern(filePath: string, patterns: readonly RegExp[]): boolean {
  const normalizedPath = normalizeIndexScopePath(filePath);
  return patterns.some(pattern => pattern.test(normalizedPath));
}

function normalizeGlobList(values: readonly string[] | undefined): string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort();
}

function normalizeSkillList(values: readonly string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(value => /^sk-[a-z0-9-]+$/.test(value)))].sort();
}

function parseSkillsEnvValue(value: string | undefined): IncludedSkillsList {
  const normalized = value?.trim();
  if (!normalized || normalized.toLowerCase() === 'false') return 'none';
  if (normalized.toLowerCase() === 'true') return 'all';
  const skills = normalizeSkillList(normalized.split(','));
  return skills.length > 0 ? skills : 'none';
}

function resolveIncludedSkillsList(
  includeSkills: ResolveIndexScopePolicyInput['includeSkills'],
  env: Record<string, string | undefined>,
): IncludedSkillsList {
  if (includeSkills === true) return 'all';
  if (includeSkills === false) return 'none';
  if (Array.isArray(includeSkills)) {
    const skills = normalizeSkillList(includeSkills);
    return skills.length > 0 ? skills : 'none';
  }
  return parseSkillsEnvValue(env.SPECKIT_CODE_GRAPH_INDEX_SKILLS);
}

function isEnabledEnvValue(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function hasPerCallScopeOverride(input: ResolveIndexScopePolicyInput): boolean {
  return input.includeSkills !== undefined
    || input.includeAgents !== undefined
    || input.includeCommands !== undefined
    || input.includeSpecs !== undefined
    || input.includePlugins !== undefined
    || input.includeGlobs !== undefined
    || input.excludeGlobs !== undefined;
}

function buildFingerprint(policy: Omit<IndexScopePolicy, 'fingerprint' | 'label'>): string {
  const skills = policy.includedSkillsList === 'all'
    ? 'all'
    : policy.includedSkillsList === 'none'
      ? 'none'
      : `list[${[...policy.includedSkillsList].sort().join(',')}]`;
  return [
    'code-graph-scope:v3',
    `skills=${skills}`,
    `agents=${policy.includeAgents ? 'all' : 'none'}`,
    `commands=${policy.includeCommands ? 'all' : 'none'}`,
    `specs=${policy.includeSpecs ? 'all' : 'none'}`,
    `plugins=${policy.includePlugins ? 'all' : 'none'}`,
  ].join(':');
}

function buildLabel(policy: Omit<IndexScopePolicy, 'fingerprint' | 'label'>): string {
  const includedFolders = [
    policy.includeSkills ? 'skills' : null,
    policy.includeAgents ? 'agents' : null,
    policy.includeCommands ? 'commands' : null,
    policy.includeSpecs ? 'specs' : null,
    policy.includePlugins ? 'plugins' : null,
  ].filter(Boolean);
  const includedSuffix = includedFolders.length > 0
    ? `; opted-in .opencode folders: ${includedFolders.join(', ')}`
    : '; .opencode skill, agent, command, specs and plugins excluded';
  return `end-user code only${includedSuffix}`;
}

function resolveIndexScopePolicy(input: ResolveIndexScopePolicyInput = {}): IndexScopePolicy {
  const env = input.env ?? process.env;
  const includedSkillsList = resolveIncludedSkillsList(input.includeSkills, env);
  const includeAgents = input.includeAgents ?? isEnabledEnvValue(env.SPECKIT_CODE_GRAPH_INDEX_AGENTS);
  const includeCommands = input.includeCommands ?? isEnabledEnvValue(env.SPECKIT_CODE_GRAPH_INDEX_COMMANDS);
  const includeSpecs = input.includeSpecs ?? isEnabledEnvValue(env.SPECKIT_CODE_GRAPH_INDEX_SPECS);
  const includePlugins = input.includePlugins ?? isEnabledEnvValue(env.SPECKIT_CODE_GRAPH_INDEX_PLUGINS);
  const includeGlobs = normalizeGlobList(input.includeGlobs);
  const excludeGlobs = normalizeGlobList(input.excludeGlobs);
  const envProvided = includedSkillsList !== 'none'
    || includeAgents
    || includeCommands
    || includeSpecs
    || includePlugins
    || includeGlobs.length > 0
    || excludeGlobs.length > 0;
  const source: IndexScopePolicySource = hasPerCallScopeOverride(input)
    ? 'scan-argument'
    : envProvided
      ? 'env'
      : 'default';
  const policyWithoutDerivedText = {
    includeSkills: includedSkillsList !== 'none',
    includedSkillsList,
    source,
    excludedSkillGlobs: includedSkillsList === 'none' ? CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.skill : [],
    includeAgents,
    includeCommands,
    includeSpecs,
    includePlugins,
    includeGlobs,
    excludeGlobs,
    excludedAgentGlobs: includeAgents ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.agent,
    excludedCommandGlobs: includeCommands ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.command,
    excludedSpecGlobs: includeSpecs ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.specs,
    excludedPluginGlobs: includePlugins ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.plugins,
  };
  return {
    ...policyWithoutDerivedText,
    fingerprint: buildFingerprint(policyWithoutDerivedText),
    label: buildLabel(policyWithoutDerivedText),
  };
}

// z_archive intentionally NOT excluded: archived spec content stays in the
// memory index and is deprioritized by ARCHIVE_MULTIPLIERS (0.1) in
// shared/scoring/folder-scoring.ts. Excluding it here would override the
// decay design and remove archived content from search entirely.
export const EXCLUDED_FOR_MEMORY = [
  compileSegmentPattern('z_future'),
  compileSegmentPattern('external'),
] as const;

export const EXCLUDED_FOR_CODE_GRAPH = [
  compileSegmentPattern('external'),
  compileSegmentPattern('node_modules'),
  compileSegmentPattern('\\.git'),
  compileSegmentPattern('dist'),
  compileSegmentPattern('vendor'),
  compileSegmentPattern('z_future'),
  compileSegmentPattern('z_archive'),
] as const;

function getCodeGraphPolicy(
  policyInput?: IndexScopePolicy | ResolveIndexScopePolicyInput,
): IndexScopePolicy {
  if (policyInput && 'fingerprint' in policyInput) {
    return policyInput;
  }
  return resolveIndexScopePolicy(policyInput);
}

function matchOpencodeSkillPath(filePath: string): string | null | undefined {
  const normalizedPath = normalizeIndexScopePath(filePath);
  const match = normalizedPath.match(/(?:^|\/)\.opencode\/skills(?:\/([^/]+))?(?:\/|$)/i);
  return match ? (match[1] ?? null) : undefined;
}

function matchesOpencodeFolder(filePath: string, folder: string): boolean {
  const normalizedPath = normalizeIndexScopePath(filePath);
  return new RegExp(`(?:^|/)\\.opencode/${folder}(?:/|$)`, 'i').test(normalizedPath);
}

export function shouldIndexForMemory(absolutePath: string): boolean {
  return !matchesAnyPattern(absolutePath, EXCLUDED_FOR_MEMORY);
}

export function shouldIndexForCodeGraph(
  absolutePath: string,
  policyInput?: IndexScopePolicy | ResolveIndexScopePolicyInput,
): boolean {
  if (matchesAnyPattern(absolutePath, EXCLUDED_FOR_CODE_GRAPH)) {
    return false;
  }
  const policy = getCodeGraphPolicy(policyInput);
  const skillName = matchOpencodeSkillPath(absolutePath);
  if (skillName !== undefined) {
    if (policy.includedSkillsList === 'none') return false;
    if (policy.includedSkillsList === 'all') return true;
    return skillName === null || policy.includedSkillsList.includes(skillName);
  }
  if (matchesOpencodeFolder(absolutePath, 'agents') && !policy.includeAgents) return false;
  if (matchesOpencodeFolder(absolutePath, 'commands') && !policy.includeCommands) return false;
  if (matchesOpencodeFolder(absolutePath, 'specs') && !policy.includeSpecs) return false;
  if (matchesOpencodeFolder(absolutePath, 'plugins') && !policy.includePlugins) return false;
  return true;
}

export function isConstitutionalPath(absolutePath: string): boolean {
  return compileSegmentPattern('constitutional').test(normalizeIndexScopePath(absolutePath));
}

export function isIndexableConstitutionalMemoryPath(absolutePath: string): boolean {
  const normalizedPath = normalizeIndexScopePath(absolutePath);
  if (!isConstitutionalPath(normalizedPath)) {
    return false;
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const constitutionalIndex = segments.findIndex(segment => segment.toLowerCase() === 'constitutional');
  const basename = segments[segments.length - 1]?.toLowerCase() ?? '';
  return constitutionalIndex >= 0 && basename !== 'readme.md';
}
