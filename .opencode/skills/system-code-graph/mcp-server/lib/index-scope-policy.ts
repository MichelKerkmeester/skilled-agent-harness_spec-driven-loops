// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Index Scope Policy
// ───────────────────────────────────────────────────────────────

export const CODE_GRAPH_INDEX_SKILLS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_SKILLS';
export const CODE_GRAPH_INDEX_AGENTS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_AGENTS';
export const CODE_GRAPH_INDEX_COMMANDS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_COMMANDS';
export const CODE_GRAPH_INDEX_SPECS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_SPECS';
export const CODE_GRAPH_INDEX_PLUGINS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_PLUGINS';
export const CODE_GRAPH_SCOPE_FINGERPRINT_KEY = 'scope_fingerprint';
export const CODE_GRAPH_SCOPE_LABEL_KEY = 'scope_label';
export const CODE_GRAPH_SCOPE_SOURCE_KEY = 'scope_source';

export const CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS = {
  skill: ['**/.opencode/skills/**'],
  agent: ['**/.opencode/agents/**'],
  command: ['**/.opencode/commands/**'],
  specs: ['**/.opencode/specs/**'],
  plugins: ['**/.opencode/plugins/**'],
} as const;

export const CODE_GRAPH_SKILL_EXCLUDE_GLOBS = CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.skill;

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

/**
 * True when the resolved scope is the DEFAULT end-user-code scope: no `.opencode`
 * opt-ins at all (skills/agents/commands/specs/plugins off, and no per-skill
 * allow-list). This is the scope a fresh repo clone gets.
 *
 * Used to decide whether a first-time empty-graph full scan is cheap + safe
 * enough to auto-run on a read path: a default-scope clone "just works", while a
 * maintainer who has opted `.opencode` in (a large scope) keeps the explicit
 * `code_graph_scan` gate so a quick query never silently triggers a big scan.
 */
export function isDefaultEndUserScope(policy: IndexScopePolicy): boolean {
  return policy.includeSkills === false
    && policy.includedSkillsList === 'none'
    && policy.includeAgents === false
    && policy.includeCommands === false
    && policy.includeSpecs === false
    && policy.includePlugins === false;
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

const SKILL_NAME_PATTERN = /^sk-[a-z0-9-]+$/;

function isEnabledEnvValue(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function isIndexScopePolicySource(value: string | null | undefined): value is IndexScopePolicySource {
  return value === 'default' || value === 'env' || value === 'scan-argument';
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

function normalizeSkillList(values: readonly string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(value => SKILL_NAME_PATTERN.test(value)))].sort();
}

function normalizeGlobList(values: readonly string[] | undefined): string[] {
  return [...new Set((values ?? []).map(value => value.trim()).filter(Boolean))].sort();
}

function encodeGlobList(values: readonly string[]): string {
  return `[${values.map(value => encodeURIComponent(value)).join(',')}]`;
}

function decodeGlobList(value: string | undefined): string[] | null {
  const match = value?.match(/^\[(.*)\]$/);
  if (!match) {
    return null;
  }
  if (match[1].length === 0) {
    return [];
  }
  try {
    return normalizeGlobList(match[1].split(',').map(segment => decodeURIComponent(segment)));
  } catch {
    return null;
  }
}

function parseSkillsEnvValue(value: string | undefined): IncludedSkillsList {
  const normalized = value?.trim();
  if (!normalized || normalized.toLowerCase() === 'false') {
    return 'none';
  }
  if (normalized.toLowerCase() === 'true') {
    return 'all';
  }

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
  return parseSkillsEnvValue(env[CODE_GRAPH_INDEX_SKILLS_ENV]);
}

function buildFingerprint(policy: Omit<IndexScopePolicy, 'fingerprint' | 'label'>): string {
  const skills = policy.includedSkillsList === 'all'
    ? 'all'
    : policy.includedSkillsList === 'none'
      ? 'none'
      : `list[${[...policy.includedSkillsList].sort().join(',')}]`;
  const baseSegments = [
    'code-graph-scope:v2',
    `skills=${skills}`,
    `agents=${policy.includeAgents ? 'all' : 'none'}`,
    `commands=${policy.includeCommands ? 'all' : 'none'}`,
    `specs=${policy.includeSpecs ? 'all' : 'none'}`,
    `plugins=${policy.includePlugins ? 'all' : 'none'}`,
  ];
  if (policy.includeGlobs.length === 0 && policy.excludeGlobs.length === 0) {
    return baseSegments.join(':');
  }

  return [
    'code-graph-scope:v3',
    ...baseSegments.slice(1),
    `includeGlobs=${encodeGlobList(policy.includeGlobs)}`,
    `excludeGlobs=${encodeGlobList(policy.excludeGlobs)}`,
  ].join(':');
}

function buildLabel(policy: Omit<IndexScopePolicy, 'fingerprint' | 'label'>): string {
  // A skills allowlist indexes a different surface than "all skills"; disclose
  // the named subset so `includeSkills:['sk-code']` is not reported the same as
  // `includeSkills:true`.
  const skillsLabel = policy.includedSkillsList === 'all'
    ? 'skills'
    : Array.isArray(policy.includedSkillsList) && policy.includedSkillsList.length > 0
      ? `skills: ${[...policy.includedSkillsList].sort().join(', ')}`
      : null;
  const includedFolders = [
    skillsLabel,
    policy.includeAgents ? 'agents' : null,
    policy.includeCommands ? 'commands' : null,
    policy.includeSpecs ? 'specs' : null,
    policy.includePlugins ? 'plugins' : null,
  ].filter(Boolean);
  const includedSuffix = includedFolders.length > 0
    ? `; opted-in .opencode folders: ${includedFolders.join(', ')}`
    : '; .opencode skill, agent, command, specs and plugins excluded';
  // Glob narrowing changes what the graph can answer about; hiding it behind
  // the generic folder summary made a *.ts-only scan read as a full scan.
  const globSegments: string[] = [];
  if (policy.includeGlobs.length > 0) {
    globSegments.push(`includeGlobs: ${policy.includeGlobs.join(', ')}`);
  }
  if (policy.excludeGlobs.length > 0) {
    globSegments.push(`excludeGlobs: ${policy.excludeGlobs.join(', ')}`);
  }
  const globSuffix = globSegments.length > 0 ? `; narrowed by ${globSegments.join('; ')}` : '';
  return `end-user code only${includedSuffix}${globSuffix}`;
}

function buildIndexScopePolicy(input: {
  includedSkillsList: IncludedSkillsList;
  includeAgents: boolean;
  includeCommands: boolean;
  includeSpecs: boolean;
  includePlugins: boolean;
  includeGlobs?: readonly string[];
  excludeGlobs?: readonly string[];
  source: IndexScopePolicySource;
}): IndexScopePolicy {
  const includeSkills = input.includedSkillsList !== 'none';
  const policyWithoutDerivedText = {
    includeSkills,
    includedSkillsList: input.includedSkillsList,
    source: input.source,
    excludedSkillGlobs: input.includedSkillsList === 'none' ? CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.skill : [],
    includeAgents: input.includeAgents,
    includeCommands: input.includeCommands,
    includeSpecs: input.includeSpecs,
    includePlugins: input.includePlugins,
    includeGlobs: normalizeGlobList(input.includeGlobs),
    excludeGlobs: normalizeGlobList(input.excludeGlobs),
    excludedAgentGlobs: input.includeAgents ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.agent,
    excludedCommandGlobs: input.includeCommands ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.command,
    excludedSpecGlobs: input.includeSpecs ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.specs,
    excludedPluginGlobs: input.includePlugins ? [] : CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS.plugins,
  };
  return {
    ...policyWithoutDerivedText,
    fingerprint: buildFingerprint(policyWithoutDerivedText),
    label: buildLabel(policyWithoutDerivedText),
  };
}

export function resolveIndexScopePolicy(input: ResolveIndexScopePolicyInput = {}): IndexScopePolicy {
  const env = input.env ?? process.env;
  const perCallProvided = hasPerCallScopeOverride(input);
  const includedSkillsList = resolveIncludedSkillsList(input.includeSkills, env);
  const includeAgents = input.includeAgents ?? isEnabledEnvValue(env[CODE_GRAPH_INDEX_AGENTS_ENV]);
  const includeCommands = input.includeCommands ?? isEnabledEnvValue(env[CODE_GRAPH_INDEX_COMMANDS_ENV]);
  const includeSpecs = input.includeSpecs ?? isEnabledEnvValue(env[CODE_GRAPH_INDEX_SPECS_ENV]);
  const includePlugins = input.includePlugins ?? isEnabledEnvValue(env[CODE_GRAPH_INDEX_PLUGINS_ENV]);
  const includeGlobs = normalizeGlobList(input.includeGlobs);
  const excludeGlobs = normalizeGlobList(input.excludeGlobs);
  const envProvided = includedSkillsList !== 'none'
    || includeAgents
    || includeCommands
    || includeSpecs
    || includePlugins
    || includeGlobs.length > 0
    || excludeGlobs.length > 0;
  const source: IndexScopePolicySource = perCallProvided
    ? 'scan-argument'
    : envProvided
      ? 'env'
      : 'default';

  return buildIndexScopePolicy({
    includedSkillsList,
    includeAgents,
    includeCommands,
    includeSpecs,
    includePlugins,
    includeGlobs,
    excludeGlobs,
    source,
  });
}

export function parseIndexScopePolicyFromFingerprint(input: {
  fingerprint: string | null;
  source?: string | null;
}): IndexScopePolicy | null {
  const version = input.fingerprint?.startsWith('code-graph-scope:v3:')
    ? 'v3'
    : input.fingerprint?.startsWith('code-graph-scope:v2:')
      ? 'v2'
      : null;
  if (!version) {
    return null;
  }

  const fingerprint = input.fingerprint ?? '';
  const segments = fingerprint.split(':').slice(2);
  const values = new Map<string, string>();
  for (const segment of segments) {
    const [key, value] = segment.split('=');
    if (!key || value === undefined) {
      return null;
    }
    values.set(key, value);
  }

  const skillsValue = values.get('skills');
  let includedSkillsList: IncludedSkillsList;
  if (skillsValue === 'all') {
    includedSkillsList = 'all';
  } else if (skillsValue === 'none') {
    includedSkillsList = 'none';
  } else {
    const match = skillsValue?.match(/^list\[(.*)\]$/);
    if (!match) {
      return null;
    }
    includedSkillsList = match[1].length > 0 ? normalizeSkillList(match[1].split(',')) : 'none';
  }

  return buildIndexScopePolicy({
    includedSkillsList,
    includeAgents: values.get('agents') === 'all',
    includeCommands: values.get('commands') === 'all',
    includeSpecs: values.get('specs') === 'all',
    includePlugins: values.get('plugins') === 'all',
    includeGlobs: version === 'v3' ? (decodeGlobList(values.get('includeGlobs')) ?? []) : [],
    excludeGlobs: version === 'v3' ? (decodeGlobList(values.get('excludeGlobs')) ?? []) : [],
    source: isIndexScopePolicySource(input.source) ? input.source : 'default',
  });
}

function sameIncludedSkills(left: IncludedSkillsList, right: IncludedSkillsList): boolean {
  if (left === right) {
    return true;
  }
  return Array.isArray(left)
    && Array.isArray(right)
    && left.join(',') === right.join(',');
}

export function scopeFingerprintsMatchOrLegacy(
  storedFingerprint: string | null | undefined,
  candidateFingerprint: string | null | undefined,
): boolean {
  if (storedFingerprint === candidateFingerprint) {
    return true;
  }

  const storedPolicy = parseIndexScopePolicyFromFingerprint({ fingerprint: storedFingerprint ?? null });
  const candidatePolicy = parseIndexScopePolicyFromFingerprint({ fingerprint: candidateFingerprint ?? null });
  if (!storedPolicy || !candidatePolicy || !storedFingerprint?.startsWith('code-graph-scope:v2:')) {
    return false;
  }

  return sameIncludedSkills(storedPolicy.includedSkillsList, candidatePolicy.includedSkillsList)
    && storedPolicy.includeAgents === candidatePolicy.includeAgents
    && storedPolicy.includeCommands === candidatePolicy.includeCommands
    && storedPolicy.includeSpecs === candidatePolicy.includeSpecs
    && storedPolicy.includePlugins === candidatePolicy.includePlugins;
}
