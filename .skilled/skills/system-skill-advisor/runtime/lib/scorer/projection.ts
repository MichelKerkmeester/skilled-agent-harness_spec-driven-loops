// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Skill Projection
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join, resolve } from 'node:path';

import Database from 'better-sqlite3';

import { getManifest } from '../embedders/registry.js';
import type { BackendKind } from '../embedders/types.js';
import { lifecycleStatusForPath } from '../lifecycle/archive-handling.js';
import { createPrivateSkillLinkCheck } from '../private-skill-target.js';
import { sanitizeDerivedMetadata, sanitizeMetadataStringArray } from '../skill-graph/metadata-sanitizer.js';
import { docTierWeight, isDocTriggerHarvestEnabled } from '../skill-graph/doc-frontmatter.js';
import { providerModelId } from '../skill-graph/skill-graph-db.js';
import { parseJsonObject, parseJsonStringArray, readJsonObject } from '../utils/json-guard.js';
import { parseSkillFrontmatter } from '../utils/skill-markdown.js';
import type {
  AdvisorEmbeddingSignature,
  AdvisorEmbeddingStalenessVerdict,
  AdvisorProjection,
  SkillDocTriggerProjection,
  SkillEdgeProjection,
  SkillLifecycleStatus,
  SkillProjection,
} from './types.js';
import { phraseVariants, unique } from './text.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface SkillNodeRow {
  readonly id: string;
  readonly family: string;
  readonly category: string;
  readonly domains: string | null;
  readonly intent_signals: string | null;
  readonly derived: string | null;
  readonly source_path: string;
}

interface SkillEdgeRow {
  readonly source_id: string;
  readonly target_id: string;
  readonly edge_type: SkillEdgeProjection['edgeType'];
  readonly weight: number;
  readonly context: string;
}

interface SkillMarkdownMetadata {
  readonly name: string;
  readonly description: string;
  readonly keywords: readonly string[];
}

export interface CommandBridgeProjection extends SkillProjection {
  readonly inventoryId?: string;
  readonly routingEnabled?: boolean;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const advisorDbDirOverride = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
const SKILL_GRAPH_DB = advisorDbDirOverride
  ? join(advisorDbDirOverride, 'skill-graph.sqlite')
  : join('.skilled', 'skills', 'system-skill-advisor', 'runtime', 'database', 'skill-graph.sqlite');

export const HAND_AUTHORED_COMMAND_BRIDGES: readonly CommandBridgeProjection[] = [
  {
    id: 'command-spec-kit',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-spec-kit',
    description: 'Spec Kit command bridge for /spec_kit workflows.',
    keywords: ['/speckit:plan', '/speckit:resume', '/deep:research', '/deep:review'],
    domains: ['spec-kit', 'command'],
    intentSignals: ['/speckit:plan', '/speckit:resume', '/deep:research', '/deep:review'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'memory:save',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'memory:save',
    description: 'Memory save command bridge for /speckit:save context preservation (the retired /memory:save id is kept as the scorer key).',
    keywords: ['/speckit:save', 'save context', 'save memory', 'preserve session context'],
    domains: ['memory', 'command'],
    intentSignals: ['/speckit:save', 'save context', 'save memory', 'preserve session context'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'command-memory-save',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-memory-save',
    description: 'Memory save command bridge for /speckit:save context preservation (the retired /memory:save id is kept as the scorer key).',
    keywords: ['/speckit:save', 'save context', 'save memory'],
    domains: ['memory', 'command'],
    intentSignals: ['/speckit:save', 'save context', 'save memory'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'create:agent',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'create:agent',
    description: 'Create command bridge for /create:agent OpenCode agent scaffolding.',
    keywords: ['/create:agent', 'create new agent', 'create agent', 'new agent', 'make new agent'],
    domains: ['create', 'agent', 'command'],
    intentSignals: ['/create:agent', 'create new agent', 'create agent', 'new agent', 'make new agent'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    id: 'create:manual-testing-playbook',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'create:manual-testing-playbook',
    description: 'Create command bridge for /create:manual-testing-playbook manual testing playbook scaffolding.',
    keywords: ['/create:manual-testing-playbook', 'create testing playbook', 'create test playbook', 'testing playbook'],
    domains: ['create', 'testing', 'playbook', 'command'],
    intentSignals: ['/create:manual-testing-playbook', 'create testing playbook', 'create test playbook', 'testing playbook'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
];

// BEGIN GENERATED COMMAND BRIDGES
export const GENERATED_COMMAND_BRIDGES: readonly CommandBridgeProjection[] = [
  {
    inventoryId: 'command-spec-kit',
    routingEnabled: true,
    id: 'command-spec-kit',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-spec-kit',
    description: 'Spec Kit command bridge for /spec_kit workflows.',
    keywords: ['/speckit:plan', '/speckit:resume', '/deep:research', '/deep:review'],
    domains: ['spec-kit', 'command'],
    intentSignals: ['/speckit:plan', '/speckit:resume', '/deep:research', '/deep:review'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'memory:save',
    routingEnabled: true,
    id: 'memory:save',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'memory:save',
    description: 'Memory save command bridge for /speckit:save context preservation (the retired /memory:save id is kept as the scorer key).',
    keywords: ['/speckit:save', 'save context', 'save memory', 'preserve session context'],
    domains: ['memory', 'command'],
    intentSignals: ['/speckit:save', 'save context', 'save memory', 'preserve session context'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-memory-save',
    routingEnabled: true,
    id: 'command-memory-save',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-memory-save',
    description: 'Memory save command bridge for /speckit:save context preservation (the retired /memory:save id is kept as the scorer key).',
    keywords: ['/speckit:save', 'save context', 'save memory'],
    domains: ['memory', 'command'],
    intentSignals: ['/speckit:save', 'save context', 'save memory'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-agent',
    routingEnabled: true,
    id: 'create:agent',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'create:agent',
    description: 'Create command bridge for /create:agent OpenCode agent scaffolding.',
    keywords: ['/create:agent', 'create new agent', 'create agent', 'new agent', 'make new agent'],
    domains: ['create', 'agent', 'command'],
    intentSignals: ['/create:agent', 'create new agent', 'create agent', 'new agent', 'make new agent'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-manual-testing-playbook',
    routingEnabled: true,
    id: 'create:manual-testing-playbook',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'create:manual-testing-playbook',
    description: 'Create command bridge for /create:manual-testing-playbook manual testing playbook scaffolding.',
    keywords: ['/create:manual-testing-playbook', 'create testing playbook', 'create test playbook', 'testing playbook'],
    domains: ['create', 'testing', 'playbook', 'command'],
    intentSignals: ['/create:manual-testing-playbook', 'create testing playbook', 'create test playbook', 'testing playbook'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-setup',
    routingEnabled: true,
    id: 'command-doctor-setup',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:setup',
    description: '',
    keywords: ['set up skilled', 'help me set up skilled', 'is my skilled install healthy', 'skilled setup check', 'getting started with skilled'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:setup'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-env',
    routingEnabled: true,
    id: 'command-doctor-env',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:env list',
    description: '',
    keywords: ['check my environment variables', 'which environment variable switches are set', 'skilled environment switch values', 'environment switch inventory'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:env list'],
    leadPhrases: ['check my environment variables'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-git-hooks',
    routingEnabled: true,
    id: 'command-doctor-git-hooks',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:git hooks',
    description: '',
    keywords: ['turn off a git hook check', 'disable comment hygiene gate', 'pre-commit gate keeps blocking', 'git hook settings'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:git hooks'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-runtime-mirrors',
    routingEnabled: true,
    id: 'command-doctor-runtime-mirrors',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:runtime-mirrors',
    description: '',
    keywords: ['runtime mirror drift', 'agent command mirror parity', 'command catalog drift', 'cursor devin codex sync check', 'discovery mirror out of sync'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:runtime-mirrors'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-skill-advisor-skill-budget',
    routingEnabled: true,
    id: 'command-doctor-skill-advisor-skill-budget',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:skill-advisor skill-budget',
    description: '',
    keywords: ['skill budget audit', 'description budget check', 'skill char count drift', 'frontmatter description trim'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:skill-advisor skill-budget'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-git-setup',
    routingEnabled: true,
    id: 'command-doctor-git-setup',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:git setup',
    description: '',
    keywords: ['sk-git setup check', 'is my sk-git setup working', 'which git rules are live', 'check my git hooks setup'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:git setup'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-git-standards',
    routingEnabled: true,
    id: 'command-doctor-git-standards',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:git standards',
    description: '',
    keywords: ['change commit message rules', 'allow longer commit subjects', 'stop checking pr descriptions', 'customize sk-git standards'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:git standards'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-sk-code',
    routingEnabled: true,
    id: 'command-doctor-sk-code',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:sk-code',
    description: '',
    keywords: ['sk-code setup check', 'verify my sk-code surface', 'sk-code battery fails', 'does my sk-code surface route'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:sk-code'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-skill-advisor-tune',
    routingEnabled: true,
    id: 'command-doctor-skill-advisor-tune',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:skill-advisor tune',
    description: '',
    keywords: ['skill advisor scoring', 'advisor recommendation tuning', 'skill advisor recommends the wrong skill'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:skill-advisor tune'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-skill-advisor-rebuild',
    routingEnabled: true,
    id: 'command-doctor-skill-advisor-rebuild',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:skill-advisor rebuild',
    description: '',
    keywords: ['skill advisor rebuild', 'rebuild the skill graph database', 'rerun the skill_graph scan', 'new skill not appearing in advisor results'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:skill-advisor rebuild'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-skill-advisor-parent-skill',
    routingEnabled: true,
    id: 'command-doctor-skill-advisor-parent-skill',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:skill-advisor parent-skill',
    description: '',
    keywords: ['parent skill structure audit', 'nested mode packet check', 'mode-registry drift guard', 'single graph-metadata identity', 'skill root metadata contract', 'missing skill json files'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:skill-advisor parent-skill'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-skill-advisor-skill-graph-freshness',
    routingEnabled: true,
    id: 'command-doctor-skill-advisor-skill-graph-freshness',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:skill-advisor skill-graph-freshness',
    description: '',
    keywords: ['skill graph freshness', 'skill-graph zombie ghost nodes', 'compiled vs sqlite vs disk graph drift', 'reindex staleness check'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:skill-advisor skill-graph-freshness'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-skill-advisor-router-reach',
    routingEnabled: true,
    id: 'command-doctor-skill-advisor-router-reach',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:skill-advisor router-reach',
    description: '',
    keywords: ['router reach check', 'does a declared phrase reach its hub', 'router vocabulary reach', 'phrase reaches nobody', 'routing residue allowlist'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:skill-advisor router-reach'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-speckit',
    routingEnabled: true,
    id: 'command-doctor-speckit',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:speckit',
    description: '',
    keywords: ['trigger index drift', 'trigger index lookup fails', 'retrieval conventions doctor', 'ripgrep recipe check', 'citation drift summary'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:speckit'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-update',
    routingEnabled: true,
    id: 'command-doctor-update',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:update',
    description: '',
    keywords: ['doctor update command', 'update skills to latest release', 'skilled release update', 'update skilled to the latest release', 'check for skilled updates', 'is there a newer skilled release'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:update'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-deep-loop',
    routingEnabled: true,
    id: 'command-doctor-deep-loop',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:deep-loop',
    description: '',
    keywords: ['deep-loop coverage graph check', 'deep-loop graph empty or stale', 'deep-research convergence drift', 'deep-review iteration graph'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:deep-loop'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-mcp-debug',
    routingEnabled: true,
    id: 'command-doctor-mcp-debug',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:mcp debug',
    description: '',
    keywords: ['Code Mode broken', 'debug an MCP connection', 'MCP connection failure', 'mcp-doctor.sh diagnostic script'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:mcp debug'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-mcp-install',
    routingEnabled: true,
    id: 'command-doctor-mcp-install',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:mcp install',
    description: '',
    keywords: ['install the MCP servers', 'Code Mode fresh install', 'reinstall Code Mode MCP'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:mcp install'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-ci-report',
    routingEnabled: true,
    id: 'command-doctor-ci-report',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:ci report',
    description: '',
    keywords: ['ci workflow status report', 'which ci workflow switches are off', 'github actions drift report', 'ci workflow inventory'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:ci report'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-ci-scaffold',
    routingEnabled: true,
    id: 'command-doctor-ci-scaffold',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:ci scaffold',
    description: '',
    keywords: ['scaffold a github actions workflow', 'create a workflow from the ci template', 'new workflow with timeout and switch'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:ci scaffold'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-doctor-ci-toggle',
    routingEnabled: true,
    id: 'command-doctor-ci-toggle',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: '/doctor:ci toggle',
    description: '',
    keywords: ['turn off a ci workflow', 'set a ci switch variable', 'disable a workflow group'],
    domains: ['doctor', 'command'],
    intentSignals: ['/doctor:ci toggle'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-benchmark',
    routingEnabled: false,
    id: 'command-create-benchmark',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-benchmark',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-changelog',
    routingEnabled: false,
    id: 'command-create-changelog',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-changelog',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-command',
    routingEnabled: false,
    id: 'command-create-command',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-command',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-diff',
    routingEnabled: false,
    id: 'command-create-diff',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-diff',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-feature-catalog',
    routingEnabled: false,
    id: 'command-create-feature-catalog',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-feature-catalog',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-goal',
    routingEnabled: false,
    id: 'command-create-goal',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-goal',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-readme',
    routingEnabled: false,
    id: 'command-create-readme',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-readme',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-repo-rule',
    routingEnabled: false,
    id: 'command-create-repo-rule',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-repo-rule',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-skill',
    routingEnabled: false,
    id: 'command-create-skill',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-skill',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-skill-parent',
    routingEnabled: false,
    id: 'command-create-skill-parent',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-skill-parent',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-create-with-human-voice',
    routingEnabled: false,
    id: 'command-create-with-human-voice',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-create-with-human-voice',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-deep-ai-council',
    routingEnabled: false,
    id: 'command-deep-ai-council',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-deep-ai-council',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-deep-research',
    routingEnabled: false,
    id: 'command-deep-research',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-deep-research',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-deep-review',
    routingEnabled: false,
    id: 'command-deep-review',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-deep-review',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-design-chart',
    routingEnabled: false,
    id: 'command-design-chart',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-design-chart',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-design-diagram',
    routingEnabled: false,
    id: 'command-design-diagram',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-design-diagram',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-design-extract',
    routingEnabled: false,
    id: 'command-design-extract',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-design-extract',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-prompt-improver',
    routingEnabled: false,
    id: 'command-prompt-improver',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-prompt-improver',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-spec-kit-complete',
    routingEnabled: false,
    id: 'command-spec-kit-complete',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-spec-kit-complete',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-spec-kit-implement',
    routingEnabled: false,
    id: 'command-spec-kit-implement',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-spec-kit-implement',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-spec-kit-plan',
    routingEnabled: false,
    id: 'command-spec-kit-plan',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-spec-kit-plan',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
  {
    inventoryId: 'command-spec-kit-resume',
    routingEnabled: false,
    id: 'command-spec-kit-resume',
    kind: 'command',
    family: 'system',
    category: 'command',
    name: 'command-spec-kit-resume',
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  },
];
// END GENERATED COMMAND BRIDGES

export const COMMAND_BRIDGES: readonly CommandBridgeProjection[] = GENERATED_COMMAND_BRIDGES;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function scoringCommandBridges(
  bridges: readonly CommandBridgeProjection[],
): CommandBridgeProjection[] {
  return bridges.filter((bridge) => bridge.routingEnabled !== false);
}

function jsonArray(value: string | null | undefined): string[] {
  return value ? parseJsonStringArray(value) : [];
}

function jsonObject(value: string | null | undefined): Record<string, unknown> {
  return value ? parseJsonObject(value) ?? {} : {};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function reduceDerivedPathEntry(value: string): string {
  if (!value.includes('/')) return value;
  const fileName = basename(value);
  const extension = extname(fileName);
  // Full repo paths create generic assets/patterns/md/js tokens that match
  // unrelated prompts; the extension-free basename preserves the distinct concept.
  return extension ? fileName.slice(0, -extension.length) : fileName;
}

function boundedDemotion(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.min(1, value))
    : undefined;
}

function readJson(filePath: string): Record<string, unknown> {
  return readJsonObject(filePath) ?? {};
}

function parseSkillMarkdown(skillMdPath: string, fallbackId: string): SkillMarkdownMetadata {
  if (!existsSync(skillMdPath)) {
    return { name: fallbackId, description: '', keywords: [] };
  }
  const { frontmatter, keywords } = parseSkillFrontmatter(readFileSync(skillMdPath, 'utf8'));
  return {
    name: frontmatter.name || fallbackId,
    description: frontmatter.description || '',
    keywords,
  };
}

function lifecycleStatus(raw: unknown, sourcePath: string): SkillLifecycleStatus {
  if (raw === 'deprecated' || raw === 'archived' || raw === 'future' || raw === 'active') return raw;
  const pathStatus = lifecycleStatusForPath(sourcePath);
  return pathStatus === 'archived' || pathStatus === 'future' ? pathStatus : 'active';
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

function projectionFromRow(row: SkillNodeRow): SkillProjection {
  const derived = sanitizeDerivedMetadata(jsonObject(row.derived), row.source_path) ?? {};
  const graphMetadata = readJson(row.source_path);
  const skillDir = dirname(row.source_path);
  const skillMd = parseSkillMarkdown(join(skillDir, 'SKILL.md'), row.id);
  const lifecycle = lifecycleStatus(
    graphMetadata.lifecycle_status ?? derived.lifecycle_status,
    row.source_path,
  );
  const redirectTo = typeof graphMetadata.redirect_to === 'string'
    ? graphMetadata.redirect_to
    : (typeof derived.redirect_to === 'string' ? derived.redirect_to : null);
  const redirectFrom = stringArray(graphMetadata.redirect_from ?? derived.redirect_from);
  // Distinguish derivedTriggers (intent-shaped phrases) from
  // derivedKeywords (entity-shaped concepts). Previously both fields were
  // assigned the same array (value-by-reference), which double-counted the
  // same evidence into two scoring inputs. Triggers now come from
  // `derived.trigger_phrases` only; keywords come from `derived.key_topics`
  // + `derived.entities` + `derived.key_files` + `derived.source_docs`. Each
  // pipeline still passes through `phraseVariants` and `unique`. The two
  // arrays may overlap when authors duplicate entries, but they are no longer
  // assigned the same value-by-reference.
  const derivedTriggers = unique(
    stringArray(derived.trigger_phrases).flatMap((entry) => phraseVariants(entry)),
  );
  const derivedKeywords = unique([
    ...stringArray(derived.key_topics),
    ...stringArray(derived.entities),
    ...stringArray(derived.key_files).map(reduceDerivedPathEntry),
    ...stringArray(derived.source_docs).map(reduceDerivedPathEntry),
  ].flatMap((entry) => phraseVariants(entry)));

  return {
    id: row.id,
    kind: 'skill',
    family: row.family,
    category: row.category,
    name: skillMd.name,
    description: skillMd.description,
    keywords: unique(skillMd.keywords.flatMap((entry) => phraseVariants(entry))),
    domains: unique(sanitizeMetadataStringArray(jsonArray(row.domains), row.source_path).flatMap((entry) => phraseVariants(entry))),
    intentSignals: unique(sanitizeMetadataStringArray(jsonArray(row.intent_signals), row.source_path).flatMap((entry) => phraseVariants(entry))),
    derivedTriggers,
    derivedKeywords,
    derivedDemotion: boundedDemotion(derived.demotion),
    // V2 derived sync stamps generated_at (the canonical author/sync time of
    // the derived block); older shapes carried last_updated_at/created_at.
    // generated_at leads the chain so a V2 block's real freshness wins over a
    // stray legacy field. This value is AUTHOR-TIME, not runtime: rebuild
    // re-indexes the existing block without re-stamping it; only a
    // derived-content change through sync re-stamps generated_at.
    derivedGeneratedAt: isoTimestampOrNull(derived.generated_at ?? derived.last_updated_at ?? derived.created_at),
    sourcePath: row.source_path,
    lifecycleStatus: lifecycle,
    redirectTo,
    redirectFrom,
  };
}

function isoTimestampOrNull(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

// ───────────────────────────────────────────────────────────────────
// 6. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface SkillDocRow {
  readonly skill_id: string;
  readonly doc_path: string;
  readonly trigger_phrases: string;
  readonly importance_tier: string | null;
}

interface MetadataRow {
  readonly key: string;
  readonly value: string;
}

interface TableNameRow {
  readonly name: string;
}

interface EmbeddingModelRow {
  readonly model_id: string | null;
}

interface StoredEmbeddingSummary {
  readonly vectorCount: number;
  readonly missingModelCount: number;
  readonly modelIds: readonly string[];
  readonly dim: number | null;
}

interface ActiveEmbeddingPointer {
  readonly name: string;
  readonly dim: number;
  readonly provider: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 7. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const ACTIVE_EMBEDDER_NAME_KEY = 'active_embedder_name';
const ACTIVE_EMBEDDER_DIM_KEY = 'active_embedder_dim';
const ACTIVE_EMBEDDER_PROVIDER_KEY = 'active_embedder_provider';

// ───────────────────────────────────────────────────────────────────
// 8. HELPERS
// ───────────────────────────────────────────────────────────────────

function sqliteTableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare(`
    SELECT 1 AS present
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
    LIMIT 1
  `).get(tableName) as { present: number } | undefined;
  return Boolean(row);
}

function readMetadataMap(db: Database.Database): Map<string, string> {
  if (!sqliteTableExists(db, 'vec_metadata')) return new Map();
  const rows = db.prepare(`
    SELECT key, value
    FROM vec_metadata
    WHERE key IN (?, ?, ?)
  `).all(ACTIVE_EMBEDDER_NAME_KEY, ACTIVE_EMBEDDER_DIM_KEY, ACTIVE_EMBEDDER_PROVIDER_KEY) as MetadataRow[];
  return new Map(rows.map((row) => [row.key, row.value]));
}

function providerForBackend(backend: BackendKind | undefined): string | null {
  switch (backend) {
    case 'ollama':
      return 'ollama';
    case 'api':
      return 'openai';
    case 'sentence-transformers':
      return 'hf-local';
    default:
      return null;
  }
}

function readActiveEmbeddingPointer(db: Database.Database): ActiveEmbeddingPointer | null {
  const metadata = readMetadataMap(db);
  const name = metadata.get(ACTIVE_EMBEDDER_NAME_KEY);
  const rawDim = metadata.get(ACTIVE_EMBEDDER_DIM_KEY);
  const dim = rawDim && /^[0-9]+$/.test(rawDim) ? Number.parseInt(rawDim, 10) : null;
  if (!name || dim === null || dim <= 0) {
    return null;
  }
  const metadataProvider = metadata.get(ACTIVE_EMBEDDER_PROVIDER_KEY);
  const manifest = getManifest(name);
  return {
    name,
    dim,
    provider: metadataProvider && metadataProvider.trim().length > 0
      ? metadataProvider
      : providerForBackend(manifest?.backend),
  };
}

function signatureFromPointer(pointer: ActiveEmbeddingPointer): AdvisorEmbeddingSignature {
  const profileId = pointer.provider
    ? providerModelId({ provider: pointer.provider, model: pointer.name, dim: pointer.dim })
    : null;
  return {
    provider: pointer.provider,
    name: pointer.name,
    dim: pointer.dim,
    modelId: pointer.name,
    providerModelId: profileId,
  };
}

function parseProviderModelId(modelId: string): { provider: string; name: string; dim: number } | null {
  const slugParts = modelId.split('__');
  if (slugParts.length >= 3 && /^[0-9]+$/.test(slugParts[2])) {
    return {
      provider: slugParts[0],
      name: slugParts[1],
      dim: Number.parseInt(slugParts[2], 10),
    };
  }

  const parts = modelId.split(':');
  for (let index = parts.length - 1; index >= 2; index--) {
    if (!/^[0-9]+$/.test(parts[index])) continue;
    return {
      provider: parts[0],
      name: parts.slice(1, index).join(':'),
      dim: Number.parseInt(parts[index], 10),
    };
  }
  return null;
}

function signatureFromModelId(modelId: string, fallbackDim: number | null): AdvisorEmbeddingSignature {
  const parsed = parseProviderModelId(modelId);
  if (parsed) {
    return {
      provider: parsed.provider,
      name: parsed.name,
      dim: parsed.dim,
      modelId,
      providerModelId: modelId,
    };
  }
  return {
    provider: null,
    name: modelId,
    dim: fallbackDim ?? 0,
    modelId,
    providerModelId: null,
  };
}

function activeCompatibleModelIds(active: AdvisorEmbeddingSignature): Set<string> {
  const ids = new Set<string>([active.modelId]);
  if (active.providerModelId) ids.add(active.providerModelId);
  const manifest = getManifest(active.name);
  if (active.provider && manifest?.ollamaName) {
    ids.add(providerModelId({ provider: active.provider, model: manifest.ollamaName, dim: active.dim }));
  }
  return ids;
}

function vecTables(db: Database.Database): Array<{ name: string; dim: number }> {
  const rows = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name GLOB 'vec_[0-9]*'
    ORDER BY name ASC
  `).all() as TableNameRow[];
  return rows
    .map((row) => {
      const match = /^vec_([0-9]+)$/.exec(row.name);
      return match ? { name: row.name, dim: Number.parseInt(match[1], 10) } : null;
    })
    .filter((row): row is { name: string; dim: number } => row !== null);
}

function summarizeModelRows(rows: readonly EmbeddingModelRow[], dim: number | null): StoredEmbeddingSummary {
  const normalizedModelIds = rows.map((row) => row.model_id?.trim() ?? '');
  const modelIds = unique(
    normalizedModelIds.filter((modelId) => modelId.length > 0),
  );
  return {
    vectorCount: rows.length,
    missingModelCount: normalizedModelIds.filter((modelId) => modelId.length === 0).length,
    modelIds,
    dim,
  };
}

function summarizeVecTable(db: Database.Database, tableName: string, dim: number): StoredEmbeddingSummary {
  const rows = db.prepare(`
    SELECT model_id
    FROM ${tableName}
    WHERE embedding IS NOT NULL
    ORDER BY skill_id ASC
  `).all() as EmbeddingModelRow[];
  return summarizeModelRows(rows, dim);
}

function summarizeLegacyEmbeddings(db: Database.Database): StoredEmbeddingSummary {
  if (!sqliteTableExists(db, 'skill_nodes')) {
    return { vectorCount: 0, missingModelCount: 0, modelIds: [], dim: null };
  }
  const rows = db.prepare(`
    SELECT embedding_model_id AS model_id
    FROM skill_nodes
    WHERE embedding IS NOT NULL
    ORDER BY id ASC
  `).all() as EmbeddingModelRow[];
  return summarizeModelRows(rows, null);
}

function combineSummaries(summaries: readonly StoredEmbeddingSummary[]): StoredEmbeddingSummary {
  return {
    vectorCount: summaries.reduce((total, summary) => total + summary.vectorCount, 0),
    missingModelCount: summaries.reduce((total, summary) => total + summary.missingModelCount, 0),
    modelIds: unique(summaries.flatMap((summary) => [...summary.modelIds])),
    dim: summaries.find((summary) => summary.dim !== null)?.dim ?? null,
  };
}

function storedEmbeddingSummary(db: Database.Database, active: ActiveEmbeddingPointer | null): StoredEmbeddingSummary {
  const tables = vecTables(db);
  if (active) {
    const activeTable = tables.find((table) => table.dim === active.dim);
    if (activeTable) {
      const summary = summarizeVecTable(db, activeTable.name, activeTable.dim);
      if (summary.vectorCount > 0 || summary.missingModelCount > 0) {
        return summary;
      }
    }
    const nonActiveSummaries = tables
      .filter((table) => table.dim !== active.dim)
      .map((table) => summarizeVecTable(db, table.name, table.dim))
      .filter((summary) => summary.vectorCount > 0 || summary.missingModelCount > 0);
    return combineSummaries(nonActiveSummaries);
  }

  const legacy = summarizeLegacyEmbeddings(db);
  if (legacy.vectorCount > 0 || legacy.missingModelCount > 0) {
    return legacy;
  }
  return combineSummaries(
    tables
      .map((table) => summarizeVecTable(db, table.name, table.dim))
      .filter((summary) => summary.vectorCount > 0 || summary.missingModelCount > 0),
  );
}

function buildEmbeddingStalenessVerdict(
  active: AdvisorEmbeddingSignature | null,
  summary: StoredEmbeddingSummary,
): AdvisorEmbeddingStalenessVerdict {
  if (summary.vectorCount === 0 && summary.missingModelCount === 0) {
    return { stale: false, active, stored: null, vectorCount: 0 };
  }

  const storedModelId = summary.modelIds[0] ?? null;
  const rawStored = storedModelId
    ? signatureFromModelId(storedModelId, summary.dim)
    : null;
  const stored = rawStored && active && activeCompatibleModelIds(active).has(rawStored.modelId)
    ? { ...active, modelId: rawStored.modelId }
    : rawStored;
  const base = {
    active,
    stored,
    vectorCount: summary.vectorCount,
    modelIds: summary.modelIds,
  };

  if (!active) {
    return { ...base, stale: true, reason: 'main active-embedder pointer incomplete' };
  }
  if (summary.missingModelCount > 0) {
    return { ...base, stale: true, reason: 'projection embedding model missing' };
  }
  if (summary.modelIds.length !== 1) {
    return {
      ...base,
      stale: true,
      reason: `projection model set '${summary.modelIds.join(', ')}' != active '${active.name}'`,
    };
  }
  if (stored && stored.dim > 0 && stored.provider !== null && stored.dim !== active.dim) {
    return { ...base, stale: true, reason: `projection dim ${stored.dim} != active ${active.dim}` };
  }
  if (!activeCompatibleModelIds(active).has(summary.modelIds[0])) {
    return {
      ...base,
      stale: true,
      reason: `projection model '${summary.modelIds[0]}' != active '${active.name}'`,
    };
  }
  return { ...base, stale: false };
}

// ───────────────────────────────────────────────────────────────────
// 9. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export function readAdvisorEmbeddingStaleness(db: Database.Database): AdvisorEmbeddingStalenessVerdict {
  try {
    const activePointer = readActiveEmbeddingPointer(db);
    const active = activePointer ? signatureFromPointer(activePointer) : null;
    return buildEmbeddingStalenessVerdict(active, storedEmbeddingSummary(db, activePointer));
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      stale: true,
      reason: `projection embedding staleness check failed: ${reason}`,
      active: null,
      stored: null,
      vectorCount: 0,
      modelIds: [],
    };
  }
}

/**
 * Load doc-level trigger projections grouped by skill id. Tolerates a
 * pre-migration database (missing skill_docs table) by returning an
 * empty map — the read-only recommend path never runs migrations.
 */
function loadDocTriggersBySkill(db: Database.Database): Map<string, SkillDocTriggerProjection[]> {
  const bySkill = new Map<string, SkillDocTriggerProjection[]>();
  if (!isDocTriggerHarvestEnabled()) return bySkill;
  let docRows: SkillDocRow[];
  try {
    docRows = db.prepare(`
      SELECT skill_id, doc_path, trigger_phrases, importance_tier
      FROM skill_docs
      ORDER BY skill_id ASC, doc_path ASC
    `).all() as SkillDocRow[];
  } catch {
    return bySkill;
  }
  for (const row of docRows) {
    const phrases = unique(parseJsonStringArray(row.trigger_phrases).flatMap((entry) => phraseVariants(entry)));
    if (phrases.length === 0) continue;
    const entry: SkillDocTriggerProjection = {
      docPath: row.doc_path,
      phrases,
      tierWeight: docTierWeight(row.importance_tier),
    };
    const existing = bySkill.get(row.skill_id);
    if (existing) existing.push(entry);
    else bySkill.set(row.skill_id, [entry]);
  }
  return bySkill;
}

function loadSqliteProjection(workspaceRoot: string): AdvisorProjection | null {
  const dbPath = isAbsolute(SKILL_GRAPH_DB) ? SKILL_GRAPH_DB : join(workspaceRoot, SKILL_GRAPH_DB);
  if (!existsSync(dbPath)) return null;
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`
      SELECT id, family, category, domains, intent_signals, derived, source_path
      FROM skill_nodes
      ORDER BY id ASC
    `).all() as SkillNodeRow[];
    const edgeRows = db.prepare(`
      SELECT source_id, target_id, edge_type, weight, context
      FROM skill_edges
      ORDER BY source_id ASC, edge_type ASC, target_id ASC
    `).all() as SkillEdgeRow[];
    const docTriggersBySkill = loadDocTriggersBySkill(db);
    const embeddingStaleness = readAdvisorEmbeddingStaleness(db);
    return {
      skills: [
        ...rows.map((row) => {
          const projection = projectionFromRow(row);
          const docTriggers = docTriggersBySkill.get(row.id);
          return docTriggers && docTriggers.length > 0 ? { ...projection, docTriggers } : projection;
        }),
        ...scoringCommandBridges(COMMAND_BRIDGES),
      ],
      edges: edgeRows.map((row) => ({
        sourceId: row.source_id,
        targetId: row.target_id,
        edgeType: row.edge_type,
        weight: Math.max(0, Math.min(1, row.weight)),
        context: row.context,
      })),
      generatedAt: new Date().toISOString(),
      source: 'sqlite',
      embeddingSignature: embeddingStaleness.stored,
      embeddingStaleness,
    };
  } finally {
    db.close();
  }
}

function loadFilesystemProjection(workspaceRoot: string): AdvisorProjection {
  const skillRoot = join(workspaceRoot, '.skilled', 'skills');
  const skills: SkillProjection[] = [];
  const edges: SkillEdgeProjection[] = [];
  if (!existsSync(skillRoot)) {
    return {
      skills: scoringCommandBridges(COMMAND_BRIDGES),
      edges,
      generatedAt: new Date().toISOString(),
      source: 'filesystem',
    };
  }
  const isTrustedLink = createPrivateSkillLinkCheck(skillRoot);
  for (const entry of readdirSync(skillRoot, { withFileTypes: true })) {
    // A private skill is linked in on purpose; read it only when its target
    // stays inside a directory the operator trusts.
    const linkedPrivateSkill = entry.name.startsWith('local-')
      && entry.isSymbolicLink()
      && isTrustedLink(join(skillRoot, entry.name));
    if (!entry.isDirectory() && !linkedPrivateSkill) continue;
    const skillDir = join(skillRoot, entry.name);
    const metadataPath = join(skillDir, 'graph-metadata.json');
    if (!existsSync(metadataPath)) continue;
    const metadata = readJson(metadataPath);
    const skillMd = parseSkillMarkdown(join(skillDir, 'SKILL.md'), entry.name);
    const skillId = typeof metadata.skill_id === 'string' ? metadata.skill_id : entry.name;
    const rawDerived = typeof metadata.derived === 'object' && metadata.derived !== null && !Array.isArray(metadata.derived)
      ? metadata.derived as Record<string, unknown>
      : {};
    const derived = sanitizeDerivedMetadata(rawDerived, metadataPath) ?? {};
    // Same split applied here as in projectionFromRow above —
    // derivedTriggers (from trigger_phrases) and derivedKeywords (from
    // key_topics + entities + key_files + source_docs) are now distinct.
    const derivedTriggers = unique(
      stringArray(derived.trigger_phrases).flatMap((item) => phraseVariants(item)),
    );
    const derivedKeywords = unique([
      ...stringArray(derived.key_topics),
      ...stringArray(derived.entities),
      ...stringArray(derived.key_files).map(reduceDerivedPathEntry),
      ...stringArray(derived.source_docs).map(reduceDerivedPathEntry),
    ].flatMap((item) => phraseVariants(item)));
    skills.push({
      id: skillId,
      kind: 'skill',
      family: typeof metadata.family === 'string' ? metadata.family : 'system',
      category: typeof metadata.category === 'string' ? metadata.category : 'skill',
      name: skillMd.name,
      description: skillMd.description,
      keywords: unique(skillMd.keywords.flatMap((item) => phraseVariants(item))),
      domains: unique(sanitizeMetadataStringArray(stringArray(metadata.domains), metadataPath).flatMap((item) => phraseVariants(item))),
      intentSignals: unique(sanitizeMetadataStringArray(stringArray(metadata.intent_signals), metadataPath).flatMap((item) => phraseVariants(item))),
      derivedTriggers,
      derivedKeywords,
      derivedDemotion: boundedDemotion(derived.demotion),
      // generated_at leads the chain (canonical V2 author/sync time); see the
      // SQLite branch above for why this is author-time, not runtime.
      derivedGeneratedAt: isoTimestampOrNull(derived.generated_at ?? derived.last_updated_at ?? derived.created_at),
      sourcePath: metadataPath,
      lifecycleStatus: lifecycleStatus(metadata.lifecycle_status ?? derived.lifecycle_status, metadataPath),
      redirectTo: typeof metadata.redirect_to === 'string' ? metadata.redirect_to : undefined,
      redirectFrom: stringArray(metadata.redirect_from),
    });
  }
  return {
    skills: [...skills, ...scoringCommandBridges(COMMAND_BRIDGES)],
    edges,
    generatedAt: new Date().toISOString(),
    source: 'filesystem',
  };
}

// ───────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ───────────────────────────────────────────────────────────────────

// Previously a bare `catch {}` swallowed every SQLite read error
// and silently fell back to the filesystem projection, hiding corrupt-DB and
// schema-drift failures from operators. We now distinguish three cases:
//   1. SQLite read succeeded → return that projection ('sqlite').
//   2. SQLite DB does not exist yet → loadSqliteProjection returns null and we
//      fall through to a clean 'filesystem' projection (legitimate first run).
//   3. SQLite read THREW → we still degrade to filesystem so the daemon stays
//      up, but the projection is tagged 'filesystem-fallback' with a
//      fallbackReason carrying the underlying error message AND the failure
//      is logged via console.warn so it surfaces in daemon logs.
export function loadAdvisorProjection(workspaceRoot: string): AdvisorProjection {
  const resolvedRoot = resolve(workspaceRoot);
  try {
    const sqliteProjection = loadSqliteProjection(resolvedRoot);
    if (sqliteProjection !== null) return sqliteProjection;
    return loadFilesystemProjection(resolvedRoot);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[advisor-projection] SQLite projection failed; degraded to filesystem fallback: ${reason}`);
    const fallback = loadFilesystemProjection(resolvedRoot);
    return {
      ...fallback,
      source: 'filesystem-fallback',
      fallbackReason: reason,
    };
  }
}

export function createFixtureProjection(
  skills: readonly SkillProjection[],
  edges: readonly SkillEdgeProjection[] = [],
): AdvisorProjection {
  return {
    skills,
    edges,
    generatedAt: new Date().toISOString(),
    source: 'fixture',
  };
}
