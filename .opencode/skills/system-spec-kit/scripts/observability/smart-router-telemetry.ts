// ---------------------------------------------------------------
// MODULE: Smart Router Telemetry
// ---------------------------------------------------------------

import * as fs from 'node:fs';
import * as path from 'node:path';

export type ComplianceClass =
  | 'always'
  | 'conditional_expected'
  | 'on_demand_expected'
  | 'extra'
  | 'missing_expected'
  | 'unknown_unparsed';

export type TelemetryEvidenceSource = 'live_wrapper' | 'static_prediction';

export type ComplianceRecord = {
  promptId: string;
  selectedSkill: string;
  observedSkill?: string | null;
  observedSkills?: string[];
  predictedRoute: string[];
  allowedResources: string[];
  actualReads: string[];
  evidenceSource?: TelemetryEvidenceSource;
  complianceClass: ComplianceClass;
  timestamp: string;
};

type ResourceTier = 'always' | 'conditional_expected' | 'on_demand_expected';

type ParsedResource = {
  path: string;
  tier: ResourceTier;
  unknown: boolean;
  required: boolean;
};

const UNKNOWN_MARKERS = new Set([
  'unknown_unparsed',
  '__unknown_unparsed__',
  'unknown:unparsed',
]);

const TIER_PREFIXES: Record<string, ResourceTier> = {
  always: 'always',
  conditional: 'conditional_expected',
  conditional_expected: 'conditional_expected',
  on_demand: 'on_demand_expected',
  on_demand_expected: 'on_demand_expected',
  expected: 'conditional_expected',
};

const TELEMETRY_PATH_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_PATH';
const TELEMETRY_DIR_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_DIR';
const TELEMETRY_MAX_BYTES_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_MAX_BYTES';
const TELEMETRY_BACKUP_SUFFIX = '.1';
const DEFAULT_TELEMETRY_MAX_BYTES = 1024 * 1024; // 1 MiB

type ComplianceInput = Omit<ComplianceRecord, 'complianceClass' | 'timestamp' | 'evidenceSource'> & {
  evidenceSource?: TelemetryEvidenceSource;
};

const activePromptInputs = new Map<string, ComplianceInput>();

function sanitizeValue(value: string): string {
  return value
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeList(values: string[]): string[] {
  return values
    .map((value) => sanitizeValue(String(value)))
    .filter((value) => value.length > 0);
}

function inferEvidenceSource(input: {
  readonly evidenceSource?: TelemetryEvidenceSource;
  readonly actualReads?: readonly string[];
  readonly observedSkill?: string | null;
  readonly observedSkills?: readonly string[];
  readonly allowedResources?: readonly string[];
}): TelemetryEvidenceSource {
  if (input.evidenceSource === 'live_wrapper' || input.evidenceSource === 'static_prediction') {
    return input.evidenceSource;
  }

  if ((input.actualReads ?? []).length > 0) {
    return 'live_wrapper';
  }

  if (sanitizeValue(input.observedSkill ?? '').length > 0 || (input.observedSkills ?? []).length > 0) {
    return 'live_wrapper';
  }

  if ((input.allowedResources ?? []).some((resource) => UNKNOWN_MARKERS.has(sanitizeValue(resource).toLowerCase()))) {
    return 'static_prediction';
  }

  return 'live_wrapper';
}

function parseAllowedResource(value: string): ParsedResource {
  const sanitized = sanitizeValue(value);
  const lowered = sanitized.toLowerCase();

  if (UNKNOWN_MARKERS.has(lowered)) {
    return { path: sanitized, tier: 'always', unknown: true, required: false };
  }

  const prefixMatch = sanitized.match(/^([a-z_]+):(.*)$/i);
  if (prefixMatch) {
    const prefix = prefixMatch[1].toLowerCase();
    const tier = TIER_PREFIXES[prefix];
    if (tier) {
      return {
        path: sanitizeValue(prefixMatch[2]),
        tier,
        unknown: false,
        required: prefix === 'expected',
      };
    }
    return { path: sanitized, tier: 'always', unknown: true, required: false };
  }

  return { path: sanitized, tier: 'always', unknown: false, required: false };
}

function tierRank(tier: ResourceTier): number {
  if (tier === 'on_demand_expected') {
    return 3;
  }
  if (tier === 'conditional_expected') {
    return 2;
  }
  return 1;
}

function classForTier(tier: ResourceTier): ComplianceClass {
  return tier;
}

function locateRepoRoot(startDir: string): string {
  let current = path.resolve(startDir);

  while (true) {
    if (fs.existsSync(path.join(current, '.opencode', 'skills'))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return path.resolve(startDir);
    }
    current = parent;
  }
}

export function telemetryFilePath(outputPath?: string): string {
  if (outputPath && outputPath.trim().length > 0) {
    return path.resolve(outputPath);
  }

  const pathOverride = process.env[TELEMETRY_PATH_ENV];
  if (pathOverride && pathOverride.trim().length > 0) {
    return path.resolve(pathOverride);
  }

  const override = process.env[TELEMETRY_DIR_ENV];
  if (override && override.trim().length > 0) {
    return path.join(path.resolve(override), 'compliance.jsonl');
  }

  const repoRoot = locateRepoRoot(process.cwd());
  return path.join(repoRoot, '.opencode', 'skills', '.smart-router-telemetry', 'compliance.jsonl');
}

function positiveIntFromEnv(envName: string, fallback: number): number {
  const raw = Number(process.env[envName]);
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : fallback;
}

// Rotates the telemetry file to a single backup generation when appending
// would push it past the size cap, so the file never grows unbounded while
// still preserving the most recent prior generation (never deleted outright).
// Dependency-light rename, matching the mk-dist-freshness-guard / spec-gate
// log-rotation idiom. Any failure here (e.g. a concurrent writer, an
// unwritable backup target) is swallowed so the caller still appends the
// record -- rotation is a best-effort space bound, never a reason to drop
// observability data.
function rotateTelemetryFileIfNeeded(resolvedOutputPath: string, incomingBytes: number): void {
  try {
    const stats = fs.statSync(resolvedOutputPath);
    const maxBytes = positiveIntFromEnv(TELEMETRY_MAX_BYTES_ENV, DEFAULT_TELEMETRY_MAX_BYTES);
    if (stats.size + incomingBytes <= maxBytes) {
      return;
    }

    const backupPath = `${resolvedOutputPath}${TELEMETRY_BACKUP_SUFFIX}`;
    try {
      fs.unlinkSync(backupPath);
    } catch {
      // A prior backup generation is optional.
    }
    fs.renameSync(resolvedOutputPath, backupPath);
  } catch {
    // Absent/unreadable file needs no rotation; a rotation error must still
    // let the append below through untouched.
  }
}

function appendJsonl(record: ComplianceRecord, outputPath?: string): void {
  try {
    const resolvedOutputPath = telemetryFilePath(outputPath);
    fs.mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
    const line = `${JSON.stringify(record)}\n`;
    rotateTelemetryFileIfNeeded(resolvedOutputPath, Buffer.byteLength(line, 'utf8'));
    fs.appendFileSync(resolvedOutputPath, line, 'utf8');
  } catch {
    // Observe-only: telemetry must never alter caller behavior.
  }
}

function unique(values: string[]): string[] {
  return [...new Set(sanitizeList(values))].sort();
}

export function classifyCompliance(allowed: string[], actual: string[]): ComplianceClass {
  const allowedResources = sanitizeList(allowed).map(parseAllowedResource);
  const actualReads = sanitizeList(actual);

  if (allowedResources.length === 0 || allowedResources.some((resource) => resource.unknown)) {
    return 'unknown_unparsed';
  }

  const allowedByPath = new Map<string, ResourceTier>();
  for (const resource of allowedResources) {
    if (resource.path.length === 0) {
      continue;
    }
    const existingTier = allowedByPath.get(resource.path);
    if (!existingTier || tierRank(resource.tier) > tierRank(existingTier)) {
      allowedByPath.set(resource.path, resource.tier);
    }
  }

  const actualSet = new Set(actualReads);
  if (actualSet.size === 0) {
    return 'missing_expected';
  }

  for (const read of actualSet) {
    if (!allowedByPath.has(read)) {
      return 'extra';
    }
  }

  for (const resource of allowedResources) {
    if (resource.required && !actualSet.has(resource.path)) {
      return 'missing_expected';
    }
  }

  let highestTier: ResourceTier = 'always';
  for (const resourcePath of actualSet) {
    const tier = allowedByPath.get(resourcePath) ?? 'always';
    if (tierRank(tier) > tierRank(highestTier)) {
      highestTier = tier;
    }
  }

  return classForTier(highestTier);
}

function classForInput(input: ComplianceInput): ComplianceClass {
  const observedSkills = unique([
    ...(input.observedSkills ?? []),
    ...(input.observedSkill ? [input.observedSkill] : []),
  ]);
  const selectedSkill = sanitizeValue(input.selectedSkill);
  if (observedSkills.some((skill) => skill !== selectedSkill)) {
    return 'extra';
  }
  return classifyCompliance(input.allowedResources, input.actualReads);
}

function buildRecord(input: ComplianceInput): ComplianceRecord {
  const observedSkills = unique([
    ...(input.observedSkills ?? []),
    ...(input.observedSkill ? [input.observedSkill] : []),
  ]);
  const observedSkill = observedSkills.length === 1 ? observedSkills[0] : observedSkills.join(',');
  const baseRecord: ComplianceRecord = {
    promptId: sanitizeValue(input.promptId),
    selectedSkill: sanitizeValue(input.selectedSkill),
    ...(observedSkill ? { observedSkill } : {}),
    ...(observedSkills.length > 0 ? { observedSkills } : {}),
    predictedRoute: sanitizeList(input.predictedRoute),
    allowedResources: sanitizeList(input.allowedResources),
    actualReads: sanitizeList(input.actualReads),
    evidenceSource: inferEvidenceSource(input),
    complianceClass: classForInput(input),
    timestamp: new Date().toISOString(),
  };
  return baseRecord;
}

export function recordSmartRouterCompliance(
  input: ComplianceInput,
  options: { readonly outputPath?: string } = {},
): ComplianceRecord {
  const record = buildRecord(input);
  appendJsonl(record, options.outputPath);
  return record;
}

export function startSmartRouterCompliancePrompt(input: ComplianceInput): void {
  const promptId = sanitizeValue(input.promptId);
  activePromptInputs.set(promptId, {
    promptId,
    selectedSkill: sanitizeValue(input.selectedSkill),
    predictedRoute: sanitizeList(input.predictedRoute),
    allowedResources: sanitizeList(input.allowedResources),
    actualReads: sanitizeList(input.actualReads),
    evidenceSource: inferEvidenceSource(input),
    observedSkills: unique([
      ...(input.observedSkills ?? []),
      ...(input.observedSkill ? [input.observedSkill] : []),
    ]),
  });
}

export function recordSmartRouterPromptObservation(input: ComplianceInput): void {
  const promptId = sanitizeValue(input.promptId);
  const existing = activePromptInputs.get(promptId);
  if (!existing) {
    startSmartRouterCompliancePrompt(input);
    return;
  }

  activePromptInputs.set(promptId, {
    ...existing,
    predictedRoute: unique([...existing.predictedRoute, ...sanitizeList(input.predictedRoute)]),
    allowedResources: unique([...existing.allowedResources, ...sanitizeList(input.allowedResources)]),
    actualReads: unique([...existing.actualReads, ...sanitizeList(input.actualReads)]),
    evidenceSource: inferEvidenceSource({
      evidenceSource: existing.evidenceSource ?? input.evidenceSource,
      actualReads: unique([...existing.actualReads, ...sanitizeList(input.actualReads)]),
      observedSkill: input.observedSkill,
      observedSkills: [
        ...(existing.observedSkills ?? []),
        ...(input.observedSkills ?? []),
      ],
      allowedResources: unique([...existing.allowedResources, ...sanitizeList(input.allowedResources)]),
    }),
    observedSkills: unique([
      ...(existing.observedSkills ?? []),
      ...(input.observedSkills ?? []),
      ...(input.observedSkill ? [input.observedSkill] : []),
    ]),
  });
}

function isTelemetryEvidenceSource(value: unknown): value is TelemetryEvidenceSource {
  return value === 'live_wrapper' || value === 'static_prediction';
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function parseSmartRouterComplianceRecord(line: string): ComplianceRecord | null {
  try {
    const parsed = JSON.parse(line) as Record<string, unknown>;
    if (
      typeof parsed.promptId !== 'string'
      || typeof parsed.selectedSkill !== 'string'
      || !isStringList(parsed.predictedRoute)
      || !isStringList(parsed.allowedResources)
      || !isStringList(parsed.actualReads)
      || typeof parsed.timestamp !== 'string'
    ) {
      return null;
    }

    const observedSkill = typeof parsed.observedSkill === 'string' ? parsed.observedSkill : null;
    const observedSkills = isStringList(parsed.observedSkills) ? parsed.observedSkills : [];
    return {
      promptId: parsed.promptId,
      selectedSkill: parsed.selectedSkill,
      ...(observedSkill ? { observedSkill } : {}),
      ...(observedSkills.length > 0 ? { observedSkills } : {}),
      predictedRoute: parsed.predictedRoute,
      allowedResources: parsed.allowedResources,
      actualReads: parsed.actualReads,
      ...(typeof parsed.complianceClass === 'string' ? { complianceClass: parsed.complianceClass as ComplianceClass } : { complianceClass: 'unknown_unparsed' }),
      evidenceSource: isTelemetryEvidenceSource(parsed.evidenceSource)
        ? parsed.evidenceSource
        : inferEvidenceSource({
          actualReads: parsed.actualReads,
          observedSkill,
          observedSkills,
          allowedResources: parsed.allowedResources,
        }),
      timestamp: parsed.timestamp,
    };
  } catch {
    return null;
  }
}

export function readSmartRouterComplianceJsonl(inputPath: string): ComplianceRecord[] {
  if (!fs.existsSync(inputPath)) {
    return [];
  }

  const records: ComplianceRecord[] = [];
  for (const line of fs.readFileSync(inputPath, 'utf8').split('\n')) {
    if (line.trim().length === 0) {
      continue;
    }
    const record = parseSmartRouterComplianceRecord(line);
    if (record) {
      records.push(record);
    }
  }
  return records;
}

export function finalizeSmartRouterCompliancePrompt(
  promptId: string,
  options: { readonly outputPath?: string } = {},
): ComplianceRecord | null {
  const sanitizedPromptId = sanitizeValue(promptId);
  const input = activePromptInputs.get(sanitizedPromptId);
  if (!input) {
    return null;
  }
  activePromptInputs.delete(sanitizedPromptId);
  return recordSmartRouterCompliance(input, options);
}
