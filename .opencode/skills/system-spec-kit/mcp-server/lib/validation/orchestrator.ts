// ───────────────────────────────────────────────────────────────────
// MODULE: Validation Orchestrator
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolveLevelContract, type SpecKitLevel } from '../templates/level-contract-resolver.js';
import { isPhaseParent } from '../spec/is-phase-parent.js';
import { runSpecDocStructureRule, FREEFORM_WORKFLOW_DOCS, type RuleResult, type SpecDocRuleName } from './spec-doc-structure.js';
import {
  checkGeneratedMetadataIntegrity,
  resolveGeneratedMetadataIntegrity,
} from './generated-metadata-integrity.js';
import {
  checkGeneratedMetadataDrift,
  resolveGeneratedMetadataDrift,
} from '../graph/generated-metadata-drift.js';
import {
  isGeneratedMetadataDriftGateEnabled,
  isGeneratedMetadataGrandfatherEnabled,
  isStatusCompletionConsistencyGateEnabled,
} from '../config/capability-flags.js';

export interface ValidateOpts {
  strict?: boolean;
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export interface ValidationEntry {
  rule: string;
  status: 'pass' | 'warn' | 'error' | 'info';
  message: string;
  details: string[];
}

export interface ValidationReport {
  folder: string;
  level: SpecKitLevel;
  engine: string;
  entries: ValidationEntry[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
  passed: boolean;
}

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
function findSkillRoot(startDir: string): string {
  let current = startDir;
  for (let depth = 0; depth < 8; depth += 1) {
    if (fs.existsSync(path.join(current, 'templates', 'spec-kit-docs.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return path.resolve(startDir, '../../..');
}

const SKILL_ROOT = findSkillRoot(MODULE_DIR);
const TEMPLATE_ROOT = path.join(SKILL_ROOT, 'templates');
const TEMPLATE_SUBDIRECTORIES = ['core', 'addons', 'packet-types'] as const;
const VALIDATOR_REGISTRY_PATH = path.join(SKILL_ROOT, 'scripts', 'lib', 'validator-registry.json');
const VALIDATOR_RULES_ROOT = path.join(SKILL_ROOT, 'scripts', 'rules');
const VALIDATOR_DIST_VALIDATION_ROOT = path.join(SKILL_ROOT, 'scripts', 'dist', 'validation');
const VALIDATE_SCRIPT_DIR = path.join(SKILL_ROOT, 'scripts', 'spec');
const VALID_LEVELS = new Set<SpecKitLevel>(['1', '2', '3', '3+', 'phase', 'review']);
const CANONICAL_CONTINUITY_DOC = 'implementation-summary.md';
const OPTIONAL_CONTINUITY_DOCS = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'handover.md',
  'debug-delegation.md',
  'research/research.md',
  'before-after.md',
  'timeline.md',
  'roadmap.md',
]);
const REQUIRED_FRONTMATTER_KEYS = ['packet_pointer', 'last_updated_at', 'last_updated_by', 'recent_action', 'next_safe_action'];
const REQUIRED_SCALAR_FRONTMATTER_FIELDS = ['title', 'description', 'importance_tier', 'contextType'];
const SCALAR_FRONTMATTER_DOCS = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md', 'implementation-summary.md'];
// Named in the report so a verdict can be attributed to what produced it.
const ENGINE_NAME = 'orchestrator';
const CHECKLIST_H1_PREFIX = '# Verification Checklist:';
const OPTIONAL_TEMPLATE_HEADER_RE = /^(?:L(?:2|3\+?)|FIX ADDENDUM)\s*:/iu;
const OPTIONAL_TEMPLATE_ANCHORS = new Set(['affected-surfaces', 'nfr', 'edge-cases', 'complexity', 'phase-deps', 'effort', 'enhanced-rollback']);
const MERGED_VERIFICATION_ANCHORS = new Set([
  'protocol',
  'pre-impl',
  'code-quality',
  'testing',
  'fix-completeness',
  'security',
  'docs',
  'file-org',
  'summary',
  'arch-verify',
  'perf-verify',
  'deploy-ready',
  'compliance-verify',
  'docs-verify',
  'sign-off',
]);
const MERGED_VERIFICATION_HEADERS = new Set([
  'VERIFICATION CHECKLIST',
  'VERIFICATION CHECKLIST:',
  'VERIFICATION PROTOCOL',
  'PRE-IMPLEMENTATION',
  'CODE QUALITY',
  'TESTING',
  'TESTING CHECKLIST',
  'FIX COMPLETENESS',
  'SECURITY',
  'DOCUMENTATION',
  'FILE ORGANIZATION',
  'VERIFICATION SUMMARY',
  'L3+: ARCHITECTURE VERIFICATION',
  'L3+: PERFORMANCE VERIFICATION',
  'L3+: DEPLOYMENT READINESS',
  'L3+: COMPLIANCE VERIFICATION',
  'L3+: DOCUMENTATION VERIFICATION',
  'L3+: SIGN-OFF',
]);

export type RegistrySeverity = 'error' | 'warn' | 'info' | 'skip';

export interface ValidatorRegistryEntry {
  rule_id: string;
  script_path: string;
  severity: RegistrySeverity;
  strict_only?: boolean;
  aliases?: string[];
}

interface ShellRuleOutput {
  rule: string;
  status: string;
  message: string;
  details: string[];
}

const REGISTRY_SHELL_RULE_WRAPPER = String.raw`set -euo pipefail
folder="$1"
level="$2"
rule_script="$3"
rule_id="$4"
STRICT_MODE="$5"
validate_script_dir="$6"

RULES_DIR="$validate_script_dir/../rules"
VALIDATOR_REGISTRY_JSON="$validate_script_dir/../lib/validator-registry.json"
JSON_MODE=false
QUIET_MODE=false
VERBOSE=false
LEVEL_METHOD="inferred"
DETECTED_LEVEL="$level"
RULE_NAME=""
RULE_STATUS="pass"
RULE_MESSAGE=""
RULE_DETAILS=()
RULE_REMEDIATION=""

source "$validate_script_dir/../lib/shell-common.sh"
source "$rule_script"

if ! type run_check >/dev/null 2>&1; then
  printf 'rule\t%s\n' "$rule_id"
  printf 'status\tfail\n'
  printf 'message\tRule script has no run_check function\n'
  exit 0
fi

if [[ "$(basename "$rule_script")" == "check-canonical-save.sh" ]]; then
  SPECKIT_CANONICAL_SAVE_RULE="$rule_id"
  run_check "$folder" "$level" "$rule_id"
  unset SPECKIT_CANONICAL_SAVE_RULE
else
  run_check "$folder" "$level"
fi

printf 'rule\t%s\n' "${'${'}RULE_NAME:-$rule_id}"
printf 'status\t%s\n' "${'${'}RULE_STATUS:-pass}"
printf 'message\t%s\n' "${'${'}RULE_MESSAGE:-OK}"
if [[ -n "${'${'}RULE_DETAILS[*]-}" ]]; then
  for detail in "${'${'}RULE_DETAILS[@]}"; do
    printf 'detail\t%s\n' "$detail"
  done
fi
`;

function normalizeLevel(raw: string): SpecKitLevel {
  if (raw === '3+') return '3+';
  if (raw === 'phase' || raw === 'phase-parent') return 'phase';
  if (raw === 'review') return 'review';
  if (raw === '1' || raw === '2' || raw === '3') return raw;
  throw new Error(`Unsupported spec kit level: ${raw || '(empty)'}`);
}

function detectLevel(folder: string): SpecKitLevel {
  if (isPhaseParent(folder)) return 'phase';
  const specPath = path.join(folder, 'spec.md');
  if (fs.existsSync(specPath)) {
    const head = fs.readFileSync(specPath, 'utf8').slice(0, 4096);
    const marker = head.match(/SPECKIT_LEVEL:\s*(1|2|3\+?|phase|review)/u)?.[1];
    if (marker) return normalizeLevel(marker);
    const yamlLevel = head.match(/^level:\s*(1|2|3\+?)\s*$/mu)?.[1];
    if (yamlLevel) return normalizeLevel(yamlLevel);
    const tableLevel = head.match(/\|\s*\*\*Level\*\*\s*\|\s*(1|2|3\+?)\s*\|/u)?.[1];
    if (tableLevel) return normalizeLevel(tableLevel);
  }
  if (fs.existsSync(path.join(folder, 'decision-record.md'))) return '3';
  if (fs.existsSync(path.join(folder, 'checklist.md'))) return '2';
  const tasksPath = path.join(folder, 'tasks.md');
  if (fs.existsSync(tasksPath) && fs.readFileSync(tasksPath, 'utf8').includes('<!-- ANCHOR:protocol -->')) return '2';
  return '1';
}

function entry(rule: string, status: ValidationEntry['status'], message: string, details: string[] = []): ValidationEntry {
  return { rule, status, message, details };
}

const PACKET_FOLDER_RE = /^\d{3}-[a-z0-9-]+$/u;

// A track sits directly inside the specs root, is named for the track rather
// than numbered like a packet, and has no spec of its own — it is the drawer,
// not a document in it. Requiring all three keeps a genuine packet from taking
// the exemption just because of where it happens to sit.
function isTrackRoot(folder: string): boolean {
  const resolved = path.resolve(folder);
  if (path.basename(path.dirname(resolved)) !== 'specs') return false;
  if (PACKET_FOLDER_RE.test(path.basename(resolved))) return false;
  return !fs.existsSync(path.join(resolved, 'spec.md'));
}

function isRegistryEntry(value: unknown): value is ValidatorRegistryEntry {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  const severity = candidate.severity;
  return typeof candidate.rule_id === 'string'
    && typeof candidate.script_path === 'string'
    && (severity === 'error' || severity === 'warn' || severity === 'info' || severity === 'skip');
}

function readValidatorRegistry(): ValidatorRegistryEntry[] {
  if (!fs.existsSync(VALIDATOR_REGISTRY_PATH)) return [];
  const parsed = JSON.parse(fs.readFileSync(VALIDATOR_REGISTRY_PATH, 'utf8')) as unknown;
  return Array.isArray(parsed) ? parsed.filter(isRegistryEntry) : [];
}

function resolveRegistryRuleScript(scriptPath: string): string | null {
  if (scriptPath.startsWith('rules/') && scriptPath.endsWith('.sh')) {
    const resolved = path.resolve(SKILL_ROOT, 'scripts', scriptPath);
    const rulesRoot = path.resolve(VALIDATOR_RULES_ROOT);
    if (resolved !== rulesRoot && !resolved.startsWith(`${rulesRoot}${path.sep}`)) return null;
    return fs.existsSync(resolved) && fs.statSync(resolved).isFile() ? resolved : null;
  }

  if (/^validation\/[^/]+\.ts$/u.test(scriptPath)) {
    const compiledName = `${path.basename(scriptPath, '.ts')}.js`;
    const resolved = path.resolve(VALIDATOR_DIST_VALIDATION_ROOT, compiledName);
    const validationRoot = path.resolve(VALIDATOR_DIST_VALIDATION_ROOT);
    if (resolved !== validationRoot && !resolved.startsWith(`${validationRoot}${path.sep}`)) return null;
    return fs.existsSync(resolved) && fs.statSync(resolved).isFile() ? resolved : null;
  }

  return null;
}

function isRegistryShellRulePath(scriptPath: string): boolean {
  return scriptPath.startsWith('rules/') && scriptPath.endsWith('.sh');
}

function isRegistryNodeRulePath(scriptPath: string): boolean {
  return /^validation\/[^/]+\.ts$/u.test(scriptPath);
}

function parseShellRuleOutput(ruleId: string, output: string): ShellRuleOutput {
  const parsed: ShellRuleOutput = {
    rule: ruleId,
    status: 'pass',
    message: '',
    details: [],
  };
  for (const line of output.replace(/\r\n/gu, '\n').split('\n')) {
    if (!line) continue;
    const separatorIndex = line.indexOf('\t');
    if (separatorIndex === -1) continue;
    const kind = line.slice(0, separatorIndex);
    const value = line.slice(separatorIndex + 1);
    if (kind === 'rule') parsed.rule = value || parsed.rule;
    else if (kind === 'status') parsed.status = value || parsed.status;
    else if (kind === 'message') parsed.message = value;
    else if (kind === 'detail') parsed.details.push(value);
  }
  return parsed;
}

function mapShellRuleStatus(status: string, severity: RegistrySeverity): ValidationEntry['status'] {
  if (status === 'pass') return 'pass';
  if (status === 'skip') return 'pass';
  if (status === 'warn') return 'warn';
  if (status === 'info') return 'info';
  if (status === 'fail') {
    if (severity === 'warn') return 'warn';
    if (severity === 'info') return 'info';
    return 'error';
  }
  return 'error';
}

function registryExecutionErrorDetails(result: ReturnType<typeof spawnSync>): string[] {
  return [result.stdout, result.stderr, result.error?.message].filter((item): item is string => Boolean(item));
}

function runRegistryNodeRule(
  folder: string,
  rule: ValidatorRegistryEntry,
  scriptPath: string,
  strict: boolean,
): ValidationEntry {
  const result = spawnSync('node', [
    scriptPath,
    '--folder',
    folder,
    ...(strict ? ['--strict'] : []),
  ], {
    cwd: SKILL_ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });

  const stdout = result.stdout ?? '';
  if (result.error || stdout.length === 0) {
    return entry(rule.rule_id, 'error', `Registry node rule bridge failed for ${rule.rule_id}`, registryExecutionErrorDetails(result));
  }

  const parsed = parseShellRuleOutput(rule.rule_id, stdout);
  if (!parsed.message) {
    return entry(rule.rule_id, 'error', 'Registry node rule returned no parseable output', [stdout]);
  }

  return entry(rule.rule_id, mapShellRuleStatus(parsed.status, rule.severity), parsed.message, parsed.details);
}

function runRegistryShellRule(
  folder: string,
  level: SpecKitLevel,
  rule: ValidatorRegistryEntry,
  scriptPath: string,
  strict: boolean,
): ValidationEntry {
  const result = spawnSync('bash', [
    '-c',
    REGISTRY_SHELL_RULE_WRAPPER,
    'registry-shell-rule-wrapper',
    folder,
    level,
    scriptPath,
    rule.rule_id,
    strict ? 'true' : 'false',
    VALIDATE_SCRIPT_DIR,
  ], {
    cwd: SKILL_ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });

  if (result.error || result.status !== 0) {
    return entry(rule.rule_id, 'error', `Registry shell rule bridge failed for ${rule.rule_id}`, registryExecutionErrorDetails(result));
  }

  const parsed = parseShellRuleOutput(rule.rule_id, result.stdout ?? '');
  if (!parsed.message) {
    return entry(rule.rule_id, 'error', 'Registry shell rule returned no parseable output', [result.stdout ?? '']);
  }

  return entry(parsed.rule, mapShellRuleStatus(parsed.status, rule.severity), parsed.message, parsed.details);
}

function runRegistryShellRules(
  folder: string,
  level: SpecKitLevel,
  nativeRuleIds: Set<string>,
  opts: ValidateOpts,
): ValidationEntry[] {
  const strict = opts.strict === true;
  return readValidatorRegistry()
    .filter((rule) => shouldRunRegistryShellRule(rule, nativeRuleIds, strict))
    .flatMap((rule) => {
      const scriptPath = resolveRegistryRuleScript(rule.script_path);
      if (!scriptPath) return [];
      if (isRegistryShellRulePath(rule.script_path)) {
        return [runRegistryShellRule(folder, level, rule, scriptPath, strict)];
      }
      if (isRegistryNodeRulePath(rule.script_path)) {
        return [runRegistryNodeRule(folder, rule, scriptPath, strict)];
      }
      return [];
    });
}

function shouldRunRegistryShellRule(rule: ValidatorRegistryEntry, nativeRuleIds: Set<string>, strict: boolean): boolean {
  if (rule.severity === 'skip') return false;
  if (rule.strict_only === true && !strict) return false;
  if (!isRuleSelected(rule.rule_id)) return false;
  return !nativeRuleIds.has(rule.rule_id);
}

// A caller can narrow the run to a named subset. This selects which rules run;
// it never selects a different validator, so a packet's verdict on any given
// rule stays the same however the run was narrowed.
//
// An unrecognised name is fatal rather than ignored: a narrowed run that
// silently matches nothing reports a clean pass for a packet nobody checked,
// which is the one failure a gate must never have.
function ruleSubset(): Set<string> | null {
  const raw = (process.env.SPECKIT_RULES ?? '').trim();
  if (raw === '') return null;

  const canonical = new Map<string, string>();
  for (const rule of readValidatorRegistry()) {
    canonical.set(rule.rule_id, rule.rule_id);
    for (const alias of rule.aliases ?? []) canonical.set(alias, rule.rule_id);
  }

  const selected = new Set<string>();
  const unknown: string[] = [];
  for (const token of raw.split(',')) {
    const name = token.trim().toUpperCase().replace(/-/gu, '_');
    if (name === '') continue;
    const resolved = canonical.get(name);
    if (resolved === undefined) unknown.push(token.trim());
    else selected.add(resolved);
  }

  if (unknown.length > 0) {
    throw new Error(`SPECKIT_RULES names ${unknown.length} rule(s) that do not exist: ${unknown.join(', ')}`);
  }
  return selected.size === 0 ? null : selected;
}

let RULE_SUBSET: Set<string> | null | undefined;

function isRuleSelected(ruleId: string): boolean {
  if (RULE_SUBSET === undefined) RULE_SUBSET = ruleSubset();
  return RULE_SUBSET === null || RULE_SUBSET.has(ruleId);
}

// Reset between validations so a long-lived process is not pinned to whatever
// the environment said the first time it validated anything.
function resetRuleSubset(): void {
  RULE_SUBSET = undefined;
}

function docsForLevel(level: SpecKitLevel): string[] {
  const contract = resolveLevelContract(level);
  return [...contract.requiredCoreDocs, ...contract.requiredAddonDocs];
}

function lifecycleRequiredDocsForLevel(level: SpecKitLevel): string[] {
  return [...resolveLevelContract(level).lifecycleRequiredDocs.afterImplementationStarts];
}

const STARTED_WORK_ITEM_RE = /^[ \t]*[-*] \[[xX]\]/mu;

function hasStartedWork(folder: string): boolean {
  for (const docName of ['checklist.md', 'tasks.md']) {
    const content = readIfExists(path.join(folder, docName));
    if (content && STARTED_WORK_ITEM_RE.test(content)) return true;
  }
  return false;
}

function requiredDocsForLevel(folder: string, level: SpecKitLevel): string[] {
  const started = hasStartedWork(folder);
  const docs = docsForLevel(level);
  if (!started) return docs;
  return [
    ...docs,
    ...lifecycleRequiredDocsForLevel(level).filter((docName) => !docs.includes(docName)),
  ];
}

function validationDocsForLevel(folder: string, level: SpecKitLevel): string[] {
  const contract = resolveLevelContract(level);
  const docs = [...docsForLevel(level)];
  const presentLifecycleDocs = lifecycleRequiredDocsForLevel(level)
    .filter((docName) => fs.existsSync(path.join(folder, docName)));
  // Workflow loops generate their own artifacts with a shape the authored template
  // never described, so comparing them against it reports every such packet as broken.
  const presentAddons = [...contract.optionalAddonDocs, ...contract.lazyAddonDocs]
    .filter((docName) => !FREEFORM_WORKFLOW_DOCS.has(docName))
    .filter((docName) => fs.existsSync(path.join(folder, docName)));
  for (const docName of [...presentLifecycleDocs, ...presentAddons]) {
    if (!docs.includes(docName)) docs.push(docName);
  }
  return docs;
}

function readIfExists(filePath: string): string | null {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function stripFences(content: string): string {
  const lines = content.replace(/\r\n/gu, '\n').split('\n');
  let inFence = false;
  return lines.map((line) => {
    if (/^\s*(```|~~~)/u.test(line)) {
      inFence = !inFence;
      return '';
    }
    return inFence ? '' : line;
  }).join('\n');
}

function renderInlineGates(template: string, level: SpecKitLevel): string {
  const lines = template.split(/(?<=\n)/u);
  const output: string[] = [];
  const stack: boolean[] = [];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(`{3}|~~~)/u.test(line)) {
      if (stack.every(Boolean)) output.push(line);
      inFence = !inFence;
      continue;
    }
    if (!inFence) {
      const open = line.match(/^\s*<!--\s*IF\s+(.+?)\s*-->\s*$/u);
      if (open) {
        const values = open[1].match(/level:([A-Za-z0-9+,_ -]+)/u)?.[1]
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean) ?? [];
        stack.push(values.includes(level));
        continue;
      }
      if (/^\s*<!--\s*\/IF\s*-->\s*$/u.test(line)) {
        stack.pop();
        continue;
      }
    }
    if (stack.every(Boolean)) output.push(line);
  }
  return output.join('');
}

function templateNameForDoc(level: SpecKitLevel, docName: string): string {
  if (level === 'phase' && docName === 'spec.md') return 'phase-parent.spec.md.tmpl';
  if (level === 'review' && docName === 'spec.md') return 'review.spec.md.tmpl';
  if (docName === 'research/research.md') return 'research.md.tmpl';
  return `${docName}.tmpl`;
}

function templatePathForName(templateName: string): string {
  for (const subdirectory of TEMPLATE_SUBDIRECTORIES) {
    const candidate = path.join(TEMPLATE_ROOT, subdirectory, templateName);
    if (fs.existsSync(candidate)) return candidate;
  }
  return path.join(TEMPLATE_ROOT, templateName);
}

function renderedTemplate(level: SpecKitLevel, docName: string): string | null {
  const templatePath = templatePathForName(templateNameForDoc(level, docName));
  if (!fs.existsSync(templatePath)) return null;
  return renderInlineGates(fs.readFileSync(templatePath, 'utf8'), level);
}

// A required doc with no backing template is a freeform artifact (e.g. a review
// report). Template-source and frontmatter-continuity gates apply only to
// authored, template-backed spec docs; for every numbered level and phase
// parents this set is identical to docsForLevel, so the filter is a no-op there.
function authoredDocsForLevel(level: SpecKitLevel, folder: string): string[] {
  return validationDocsForLevel(folder, level).filter((docName) =>
    fs.existsSync(templatePathForName(templateNameForDoc(level, docName))),
  );
}

function normalizeHeader(raw: string): string {
  return raw
    .replace(/\[[^\]]+\]/gu, '')
    .replace(/^\d+\.\s*/u, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .toUpperCase();
}

function h2Headers(content: string): string[] {
  return [...stripFences(content).matchAll(/^##\s+(.+)$/gmu)].map((match) => normalizeHeader(match[1]));
}

function anchors(content: string): string[] {
  return [...stripFences(content).matchAll(/<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/gu)].map((match) => match[1]);
}

function validateFileExists(folder: string, level: SpecKitLevel): ValidationEntry {
  const requiredDocs = level === 'phase' ? docsForLevel(level) : requiredDocsForLevel(folder, level);
  const missing = requiredDocs.filter((docName) => !fs.existsSync(path.join(folder, docName)));
  if (level === 'phase') {
    for (const required of ['description.json', 'graph-metadata.json']) {
      if (!fs.existsSync(path.join(folder, required))) missing.push(required);
    }
  }
  return missing.length === 0
    ? entry('FILE_EXISTS', 'pass', `All required files present for Level ${level}`)
    : entry('FILE_EXISTS', 'error', `Missing ${missing.length} required file(s) for Level ${level}`, missing);
}

// Canonical spec-doc placeholder markers. Mirrors check-placeholders.sh
// (YOUR_VALUE_HERE + NEEDS_CLARIFICATION underscore/space). Mustache `{{...}}`
// is intentionally NOT included: it is not the canonical spec-doc placeholder
// syntax and legit spec-doc content uses it, so flagging it false-positives.
const PLACEHOLDER_MARKER_RE = /<YOUR_VALUE_HERE:|\[YOUR_VALUE_HERE:|\[NEEDS_CLARIFICATION:|\[NEEDS CLARIFICATION:/u;

function validatePlaceholders(folder: string, level: SpecKitLevel): ValidationEntry {
  const findings: string[] = [];
  for (const docName of validationDocsForLevel(folder, level)) {
    const content = readIfExists(path.join(folder, docName));
    if (!content) continue;
    const lines = content.split(/\r?\n/u);
    // Track fenced code blocks: a line starting with ``` toggles in_code and is
    // itself skipped, matching check-placeholders.sh awk behavior.
    let inCode = false;
    lines.forEach((line, index) => {
      if (/^\s*```/u.test(line)) {
        inCode = !inCode;
        return;
      }
      if (inCode) return;
      const match = PLACEHOLDER_MARKER_RE.exec(line);
      if (!match) return;
      // Skip inline-backtick-wrapped markers: if the matched marker is
      // immediately preceded by a backtick on this line, it is escaped content
      // (parity with the shell rule's grep -v of backtick-wrapped cases).
      if (match.index > 0 && line.charAt(match.index - 1) === '`') return;
      findings.push(`${docName}:${index + 1}: ${line.trim().slice(0, 120)}`);
    });
  }
  return findings.length === 0
    ? entry('PLACEHOLDER_FILLED', 'pass', 'No unfilled template placeholders found')
    : entry('PLACEHOLDER_FILLED', 'error', `${findings.length} placeholder(s) found`, findings);
}

function validateTemplateSource(folder: string, level: SpecKitLevel): ValidationEntry {
  const missing = authoredDocsForLevel(level, folder).filter((docName) => {
    const content = readIfExists(path.join(folder, docName));
    return content && !content.split(/\r?\n/u).slice(0, 70).some((line) => line.includes('SPECKIT_TEMPLATE_SOURCE:'));
  });
  return missing.length === 0
    ? entry('TEMPLATE_SOURCE', 'pass', 'Template source headers present')
    : entry('TEMPLATE_SOURCE', 'error', 'Template source header missing', missing);
}

function validateTemplateShape(folder: string, level: SpecKitLevel, scope: 'headers' | 'anchors'): ValidationEntry {
  if (level === 'phase' && isPhaseParent(folder)) {
    return entry(scope === 'headers' ? 'TEMPLATE_HEADERS' : 'ANCHORS_VALID', 'pass', 'Phase parent lean template shape accepted');
  }

  const findings: string[] = [];
  let checked = 0;
  const legacyChecklist = fs.existsSync(path.join(folder, 'checklist.md'));
  for (const docName of validationDocsForLevel(folder, level)) {
    const actual = readIfExists(path.join(folder, docName));
    const expected = renderedTemplate(level, docName);
    if (!actual || !expected) continue;
    checked += 1;

    if (scope === 'headers') {
      const actualHeaders = h2Headers(actual);
      const expectedHeaders = h2Headers(expected).filter((header) =>
        !OPTIONAL_TEMPLATE_HEADER_RE.test(header)
        && !(legacyChecklist && docName === 'tasks.md' && MERGED_VERIFICATION_HEADERS.has(header)),
      );
      let cursor = 0;
      for (const expectedHeader of expectedHeaders) {
        const foundAt = expectedHeader === 'ADR-001:'
          ? actualHeaders.findIndex((header, index) => index >= cursor && /^ADR-001:/u.test(header))
          : actualHeaders.indexOf(expectedHeader, cursor);
        if (foundAt === -1) findings.push(`${docName}: missing or out-of-order header '${expectedHeader}'`);
        else cursor = foundAt + 1;
      }
    } else {
      const actualAnchors = new Set(anchors(actual));
      const expectedAnchors = anchors(expected).filter((anchor) =>
        !OPTIONAL_TEMPLATE_ANCHORS.has(anchor)
        && !(legacyChecklist && docName === 'tasks.md' && MERGED_VERIFICATION_ANCHORS.has(anchor)),
      );
      for (const expectedAnchor of expectedAnchors) {
        if (!actualAnchors.has(expectedAnchor)) findings.push(`${docName}: missing required anchor '${expectedAnchor}'`);
      }
      const openCount = (stripFences(actual).match(/<!--\s*ANCHOR:/gu) ?? []).length;
      const closeCount = (stripFences(actual).match(/<!--\s*\/ANCHOR:/gu) ?? []).length;
      if (openCount !== closeCount) findings.push(`${docName}: anchor open/close count mismatch (${openCount}/${closeCount})`);
    }
  }
  // The template comparison only reaches H2s, so the checklist title is checked
  // on its own or a mistitled document passes as template-shaped. Frontmatter is
  // skipped first: a `#` line inside it is a YAML comment, and reading one as
  // the title lets a genuinely broken heading pass on the strength of a comment.
  if (scope === 'headers') {
    const checklist = readIfExists(path.join(folder, 'checklist.md'));
    if (checklist !== null) {
      const lines = checklist.split(/\r?\n/u);
      let start = 0;
      if (lines[0]?.trim() === '---') {
        const close = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
        if (close > 0) start = close + 1;
      }
      const h1 = lines.slice(start).find((line) => line.startsWith('# '));
      if (h1 !== undefined && !h1.startsWith(CHECKLIST_H1_PREFIX)) {
        findings.push(`checklist.md: H1 should start with '${CHECKLIST_H1_PREFIX}' (found: '${h1.slice(0, 60)}')`);
      }
    }
  }

  const rule = scope === 'headers' ? 'TEMPLATE_HEADERS' : 'ANCHORS_VALID';
  return findings.length === 0
    ? entry(rule, 'pass', `Template ${scope} match in ${checked} file(s)`)
    : entry(rule, 'error', `${findings.length} template ${scope} issue(s) found`, findings);
}

function validatePriorityTags(folder: string): ValidationEntry {
  const legacyChecklist = readIfExists(path.join(folder, 'checklist.md'));
  const tasks = readIfExists(path.join(folder, 'tasks.md'));
  const checklist = legacyChecklist ?? (tasks ? extractMergedVerification(tasks) : null);
  const sourceName = legacyChecklist ? 'checklist.md' : 'tasks.md';
  if (!checklist) return entry('PRIORITY_TAGS', 'pass', 'No checklist found');
  const findings = checklist
    .split(/\r?\n/u)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter(({ line }) => /^-\s+\[[ xX]\]/u.test(line) && !/\*{0,2}CHK-[A-Za-z0-9-]+\*{0,2}\s+\[P[012]\]/u.test(line))
    .map(({ line, index }) => `${sourceName}:${index}: ${line.trim().slice(0, 120)}`);
  return findings.length === 0
    ? entry('PRIORITY_TAGS', 'pass', legacyChecklist ? 'Checklist priority tags use CHK-* [P*] format' : 'Verification checklist priority tags use CHK-* [P*] format')
    : entry('PRIORITY_TAGS', 'warn', `${findings.length} ${legacyChecklist ? 'checklist' : 'verification'} item(s) have non-standard priority tags`, findings);
}

function extractMergedVerification(content: string): string | null {
  const startMarker = '<!-- ANCHOR:protocol -->';
  const start = content.indexOf(startMarker);
  if (start === -1) return null;
  const signOffEndMarker = '<!-- /ANCHOR:sign-off -->';
  const summaryEndMarker = '<!-- /ANCHOR:summary -->';
  const endMarker = content.indexOf(signOffEndMarker, start) !== -1 ? signOffEndMarker : summaryEndMarker;
  const end = content.indexOf(endMarker, start);
  if (end === -1) return null;
  return content.slice(start, end + endMarker.length);
}

function extractSessionIds(content: string): { sessionIds: string[]; parentSessionIds: string[] } {
  const sessionIds: string[] = [];
  const parentSessionIds: string[] = [];
  for (const match of content.matchAll(/^\s{6}session_id:\s*(.+?)\s*$/gmu)) {
    sessionIds.push(match[1].replace(/^["']|["']$/gu, ''));
  }
  for (const match of content.matchAll(/^\s{6}parent_session_id:\s*(.+?)\s*$/gmu)) {
    const value = match[1].replace(/^["']|["']$/gu, '');
    if (value !== 'null' && value.trim()) parentSessionIds.push(value);
  }
  return { sessionIds, parentSessionIds };
}

// Bounds for the session-lineage tree walk so a pathological/hostile specs
// tree (millions of dirs, deep nesting) cannot turn a --strict run into a DoS.
// Sized well above any realistic specs layout, so normal trees are never
// truncated; on overrun the walk stops early and lineage validation degrades to
// a best-effort warning rather than hanging.
const SESSION_SCAN_MAX_DIRS = 50_000;
const SESSION_SCAN_MAX_DEPTH = 24;
const SESSION_SCAN_MAX_MS = 5_000;

function collectKnownSessionIds(folder: string): Set<string> {
  const root = (() => {
    const marker = `${path.sep}.opencode${path.sep}specs${path.sep}`;
    const index = folder.indexOf(marker);
    return index >= 0 ? folder.slice(0, index + marker.length - 1) : path.dirname(folder);
  })();
  const known = new Set<string>();
  const stack: Array<{ dir: string; depth: number }> = [{ dir: root, depth: 0 }];
  const startedAt = Date.now();
  let dirsScanned = 0;
  while (stack.length > 0) {
    if (dirsScanned >= SESSION_SCAN_MAX_DIRS || Date.now() - startedAt > SESSION_SCAN_MAX_MS) break;
    const { dir: current, depth } = stack.pop()!;
    dirsScanned += 1;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const dirent of entries) {
      const full = path.join(current, dirent.name);
      if (dirent.isDirectory()) {
        if (dirent.name === 'node_modules' || dirent.name === '.git' || dirent.name === 'scratch') continue;
        if (depth + 1 <= SESSION_SCAN_MAX_DEPTH) stack.push({ dir: full, depth: depth + 1 });
      } else if (dirent.isFile() && dirent.name === CANONICAL_CONTINUITY_DOC) {
        const content = readIfExists(full);
        if (!content) continue;
        for (const id of extractSessionIds(content).sessionIds) known.add(id);
      }
    }
  }
  return known;
}

function validateSpecDocRule(folder: string, level: SpecKitLevel, rule: SpecDocRuleName): ValidationEntry {
  const result: RuleResult = runSpecDocStructureRule({ folder, level, rule });
  const status = result.status === 'fail' ? 'error' : result.status;
  const details = [...result.details];
  if (rule === 'FRONTMATTER_MEMORY_BLOCK') {
    const known = collectKnownSessionIds(folder);
    const content = readIfExists(path.join(folder, CANONICAL_CONTINUITY_DOC));
    if (content) {
      for (const parentId of extractSessionIds(content).parentSessionIds) {
        if (!known.has(parentId)) {
          details.push(`SESSION_LINEAGE_BROKEN: ${CANONICAL_CONTINUITY_DOC}: parent_session_id '${parentId}' does not exist in known packet frontmatter`);
        }
      }
    }
  }
  const hasLineageWarning = details.some((detail) => detail.startsWith('SESSION_LINEAGE_BROKEN:'));
  return entry(
    result.rule,
    status === 'pass' && hasLineageWarning ? 'warn' : status,
    hasLineageWarning && status === 'pass' ? 'Session lineage warning(s) found' : result.message,
    details,
  );
}

function validateGeneratedMetadataIntegrity(folder: string): ValidationEntry {
  const report = checkGeneratedMetadataIntegrity(folder);
  const resolved = resolveGeneratedMetadataIntegrity(report, {
    grandfather: isGeneratedMetadataGrandfatherEnabled(),
    statusCompletionConsistencyEnforced: isStatusCompletionConsistencyGateEnabled(),
  });
  return entry(resolved.rule, resolved.status, resolved.message, resolved.details);
}

function validateGeneratedMetadataDrift(folder: string): ValidationEntry {
  const report = checkGeneratedMetadataDrift(folder);
  // Flag off keeps the gate in grandfather report mode, flag on enforces the verdict. The
  // gate reads and reports only, it never writes the folder it re-derives.
  const resolved = resolveGeneratedMetadataDrift(report, {
    grandfather: !isGeneratedMetadataDriftGateEnabled(),
  });
  return entry(resolved.rule, resolved.status, resolved.message, resolved.details);
}

function unquote(raw: string): string {
  const value = raw.trim();
  const quoted = (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith("'") && value.endsWith("'"));
  return quoted ? value.slice(1, -1).trim() : value;
}

function isBlankScalar(value: string | null): boolean {
  return value === null || value === '' || value === '[]' || value.toLowerCase() === 'null';
}

// A declared-but-empty field passes a key-presence test while still leaving the
// packet undiscoverable, so the value has to be inspected rather than the key.
function emptyRequiredFrontmatterFields(frontmatter: string): string[] {
  const lines = frontmatter.split(/\r?\n/u);
  const scalar = (field: string): string | null => {
    const line = lines.find((entry) => entry.startsWith(`${field}:`));
    return line === undefined ? null : unquote(line.slice(field.length + 1));
  };

  const empty = REQUIRED_SCALAR_FRONTMATTER_FIELDS.filter((field) => isBlankScalar(scalar(field)));

  const listIndex = lines.findIndex((entry) => entry.startsWith('trigger_phrases:'));
  let hasTriggerPhrase = false;
  if (listIndex >= 0) {
    hasTriggerPhrase = !isBlankScalar(unquote(lines[listIndex].slice('trigger_phrases:'.length)));
    for (let i = listIndex + 1; !hasTriggerPhrase && i < lines.length; i += 1) {
      if (/^[A-Za-z_][A-Za-z0-9_]*:/u.test(lines[i])) break;
      const item = lines[i].match(/^\s*-\s*(.*)$/u);
      if (item && !isBlankScalar(unquote(item[1]))) hasTriggerPhrase = true;
    }
  }
  if (!hasTriggerPhrase) empty.push('trigger_phrases');

  return empty;
}

function validateFrontmatterBasics(folder: string, level: SpecKitLevel): ValidationEntry {
  const missing: string[] = [];
  const empty: string[] = [];
  const frontmatterOf = (docName: string): string | null => {
    const content = readIfExists(path.join(folder, docName));
    return content === null ? null : content.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? null;
  };

  // The continuity block is only required on the doc that carries it. A doc
  // with no frontmatter is missing every key, which is what it reports.
  for (const docName of authoredDocsForLevel(level, folder).filter((name) =>
    name === CANONICAL_CONTINUITY_DOC || !OPTIONAL_CONTINUITY_DOCS.has(name),
  )) {
    if (readIfExists(path.join(folder, docName)) === null) continue;
    const frontmatter = frontmatterOf(docName) ?? '';
    for (const key of REQUIRED_FRONTMATTER_KEYS) {
      if (!new RegExp(`^\\s{4}${key}:`, 'mu').test(frontmatter)) {
        missing.push(`${docName}: missing _memory.continuity.${key}`);
      }
    }
  }

  // The scalar fields feed retrieval, so the core documents must carry them.
  // The set is fixed rather than derived from the level contract: deriving it
  // pulls in whatever add-ons a packet happens to have, which quietly widens
  // what the rule demands as packets grow optional documents.
  for (const docName of SCALAR_FRONTMATTER_DOCS) {
    const content = readIfExists(path.join(folder, docName));
    if (content === null) continue;
    // An opened-but-unterminated block is its own fault, and reporting it as a
    // set of empty fields would send the reader looking for the wrong thing.
    if (/^---\r?\n/u.test(content) && frontmatterOf(docName) === null) {
      empty.push(`${docName}: Unclosed YAML frontmatter (missing closing ---)`);
      continue;
    }
    const frontmatter = frontmatterOf(docName);
    if (frontmatter === null) continue;
    for (const field of emptyRequiredFrontmatterFields(frontmatter)) {
      empty.push(`${docName}: Empty required frontmatter field: ${field}`);
    }
  }
  if (empty.length > 0) {
    return entry('FRONTMATTER_VALID', 'error', `Found ${empty.length} frontmatter issue(s)`, [...empty, ...missing]);
  }
  return missing.length === 0
    ? entry('FRONTMATTER_VALID', 'pass', 'Frontmatter continuity basics present')
    : entry('FRONTMATTER_VALID', 'warn', `${missing.length} frontmatter continuity warning(s)`, missing);
}

export function validateFolder(folderPath: string, opts: ValidateOpts = {}): ValidationReport {
  const folder = path.resolve(folderPath);
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    throw new Error(`Folder not found: ${folderPath}`);
  }
  resetRuleSubset();

  // A track is the directory packets are filed under, not a packet. It carries
  // metadata so the tracks are searchable, which is enough to make it look like
  // a phase parent, and it then fails rules it can never satisfy — its name is
  // a track name and will never match the packet naming convention.
  if (isTrackRoot(folder)) {
    const entries = [entry('TRACK_ROOT', 'info', 'Track directory, not a packet; no packet rules apply')];
    return {
      folder,
      level: '1',
      engine: ENGINE_NAME,
      entries,
      summary: { errors: 0, warnings: 0, info: entries.length },
      passed: true,
    };
  }

  const level = normalizeLevel(opts.strict && isPhaseParent(folder) ? 'phase' : detectLevel(folder));
  const entries: ValidationEntry[] = [];

  entries.push(validateFileExists(folder, level));
  entries.push(validatePlaceholders(folder, level));
  entries.push(validateTemplateSource(folder, level));
  entries.push(validateTemplateShape(folder, level, 'headers'));
  entries.push(validateTemplateShape(folder, level, 'anchors'));
  entries.push(validatePriorityTags(folder));
  entries.push(validateFrontmatterBasics(folder, level));
  entries.push(validateSpecDocRule(folder, level, 'FRONTMATTER_MEMORY_BLOCK'));
  entries.push(validateSpecDocRule(folder, level, 'SPEC_DOC_SUFFICIENCY'));
  // These three are registered against the same module. The registry dispatcher
  // cannot spawn that form, so without running them here they vanish from the
  // report entirely rather than reporting that they had no payload to check.
  entries.push(validateSpecDocRule(folder, level, 'MERGE_LEGALITY'));
  entries.push(validateSpecDocRule(folder, level, 'CROSS_ANCHOR_CONTAMINATION'));
  entries.push(validateSpecDocRule(folder, level, 'POST_SAVE_FINGERPRINT'));
  entries.push(entry('LEVEL_DECLARED', 'info', `Detected Level ${level}`));
  entries.push(entry('GRAPH_METADATA_PRESENT', fs.existsSync(path.join(folder, 'graph-metadata.json')) ? 'pass' : 'warn', 'Graph metadata checked'));
  entries.push(validateGeneratedMetadataIntegrity(folder));
  entries.push(validateGeneratedMetadataDrift(folder));
  const nativeRuleIds = new Set(entries.map((item) => item.rule));
  const selected = entries.filter((item) => isRuleSelected(item.rule));
  entries.length = 0;
  entries.push(...selected, ...runRegistryShellRules(folder, level, nativeRuleIds, opts));

  const summary = {
    errors: entries.filter((item) => item.status === 'error').length,
    warnings: entries.filter((item) => item.status === 'warn').length,
    info: entries.filter((item) => item.status === 'info').length,
  };
  return {
    folder,
    level,
    engine: ENGINE_NAME,
    entries,
    summary,
    // A warning is advice. Promoting every one of them to a hard failure under
    // strict made the registry's severity tiers decorative and left the gate
    // red for most of the corpus, which is how a gate stops being read at all.
    // Strict still decides which rules RUN; it no longer decides what a warning
    // MEANS.
    passed: summary.errors === 0,
  };
}

export const __testables = {
  mapShellRuleStatus,
  resolveRegistryRuleScript,
  runRegistryNodeRule,
  shouldRunRegistryShellRule,
  hasStartedWork,
  validateFileExists,
};

function parseCliArgs(argv: string[]): { folder: string; opts: ValidateOpts } {
  let folder = '';
  const opts: ValidateOpts = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case '--folder':
        folder = argv[index + 1] ?? '';
        index += 1;
        break;
      case '--strict':
        opts.strict = true;
        break;
      case '--json':
        opts.json = true;
        break;
      case '--quiet':
      case '-q':
        opts.quiet = true;
        break;
      case '--verbose':
        opts.verbose = true;
        break;
      default:
        if (!arg.startsWith('--') && !folder) folder = arg;
        break;
    }
  }
  if (!folder) {
    throw new Error('Usage: orchestrator --folder <spec-folder> [--strict] [--json] [--quiet]');
  }
  return { folder, opts };
}

function printReport(report: ValidationReport, opts: ValidateOpts): void {
  if (opts.json) {
    process.stdout.write(`${JSON.stringify(report)}\n`);
    return;
  }
  if (opts.quiet) {
    const status = report.passed ? 'PASSED' : 'FAILED';
    process.stdout.write(`RESULT: ${status} (errors=${report.summary.errors} warnings=${report.summary.warnings})\n`);
    return;
  }
  process.stdout.write(`\nSpec Folder Validation v3.0.0\n\n`);
  process.stdout.write(`  Folder: ${report.folder}\n`);
  process.stdout.write(`  Level:  ${report.level}\n`);
  process.stdout.write(`  Engine: ${ENGINE_NAME}\n\n`);
  for (const item of report.entries) {
    if (item.status === 'info' && !opts.verbose) continue;
    const marker = item.status === 'error' ? 'x' : item.status === 'warn' ? '!' : item.status === 'info' ? 'i' : '+';
    process.stdout.write(`${marker} ${item.rule}: ${item.message}\n`);
    // A rule names what it actually found only in its details — including an
    // advisory that passes — so they print whenever a rule produced any.
    for (const detail of item.details) process.stdout.write(`    - ${detail}\n`);
  }
  process.stdout.write(`\nSummary: Errors: ${report.summary.errors}  Warnings: ${report.summary.warnings}\n\n`);
  process.stdout.write(`RESULT: ${report.passed ? 'PASSED' : 'FAILED'}\n`);
  writeRepairHint(report);
}

// Some of these rules fail on facts the repository can recompute — where the
// packet sits, what level it declares, whether its generated metadata still
// matches its sources. A reader has no way to know which, and would otherwise
// hand-edit what one command settles. The failure output is the only place the
// reader is guaranteed to be looking, so the offer belongs here.
const RECOMPUTABLE_RULES = new Set([
  'DESCRIPTION_SHAPE',
  'GENERATED_METADATA_INTEGRITY',
  'GENERATED_METADATA_DRIFT',
  'METADATA_DISK_PATH_CONSISTENCY',
  'SPEC_DOC_INTEGRITY',
]);

function writeRepairHint(report: ValidationReport): void {
  const hit = report.entries.some(
    (item) => (item.status === 'error' || item.status === 'warn') && RECOMPUTABLE_RULES.has(item.rule),
  );
  if (!hit) return;
  // Printed relative to where the reader is standing, so the line can be copied
  // rather than retyped around an absolute path.
  const target = path.relative(process.cwd(), report.folder) || report.folder;
  process.stdout.write('\nSome of these are recomputable from the repository:\n');
  process.stdout.write(
    `  preview  node .opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs --folder ${target}\n`,
  );
  process.stdout.write('  apply    add --apply\n');
}

// Compare resolved filesystem paths, not the raw URL string: a repo path with
// spaces or "|" makes import.meta.url percent-encode while argv stays literal,
// so `file://${argv}` equality silently fails and the CLI entry never runs.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { folder, opts } = parseCliArgs(process.argv.slice(2));
    const report = validateFolder(folder, opts);
    printReport(report, opts);
    process.exitCode = report.passed ? 0 : 2;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR: ${message}`);
    process.exitCode = /Folder not found|ENOENT|EACCES|manifest|Internal template contract/u.test(message) ? 3 : 1;
  }
}
