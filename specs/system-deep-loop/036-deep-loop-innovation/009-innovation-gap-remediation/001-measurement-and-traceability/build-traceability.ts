// ───────────────────────────────────────────────────────────────────
// MODULE: Recommendation Traceability Builder
// ───────────────────────────────────────────────────────────────────
//
// Read-only join over the frozen recommendation ledger. Selects the
// canonical adoption set, records merge lineage without changing that
// denominator, attaches the inherited transition contract, and emits
// evidence-bound status plus consolidation aliases. Never opens the
// frozen ledger or validation report for write.

import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const PHASE_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(PHASE_DIR, '..', '..', '..', '..', '..');

const LEDGER_PACKET_REL = path.join(
  'specs',
  'system-deep-loop',
  '036-deep-loop-innovation',
  '001-research-inputs-and-architecture',
  '004-architecture-coverage-and-transition-contract',
  '002-recommendation-ledger-bijective-map'
);
const LEDGER_REL = path.join(LEDGER_PACKET_REL, 'recommendation-ledger.json');
const REPORT_REL = path.join(LEDGER_PACKET_REL, 'recommendation-ledger-validation.json');

const EXPECTED_SOURCE_ROWS = 178;
const EXPECTED_ADOPTIONS = 72;
const ADOPT_013 = 'adopt-as-phase-013';
const MERGE_PREFIX = 'merge-into-';
const INHERITED_ID = 'DLR-B-057';
const INHERITED_RELATION = 'inherited_phase_contract';
const INHERITED_DISPOSITION = 'adopt-as-phase-006';
const STALE_PREFIX = '.opencode/specs/';
const CANONICAL_PREFIX = 'specs/';
const SCHEMA_VERSION = '1.0.0';

const TRACEABILITY_FILE = 'recommendation-traceability.json';
const TRACEABILITY_SCHEMA_FILE = 'recommendation-traceability.schema.json';
const ALIAS_FILE = 'consolidation-alias-manifest.json';
const ALIAS_SCHEMA_FILE = 'consolidation-alias-manifest.schema.json';
const VALIDATION_FILE = 'traceability-validation.json';
const VALIDATION_SCHEMA_FILE = 'traceability-validation.schema.json';
const DIGESTS_FILE = 'source-digests.json';
const INVENTORY_FILE = 'current-tree-inventory.json';
const PATH_INVENTORY_FILE = 'frozen-path-inventory.json';

const PATH_BEARING_FIELDS = Object.freeze([
  'rows[].source_path',
  'rows[].companion_evidence.path',
  'source_manifest[].path',
  'phase_manifest.path'
]);

const LIBRARY_VALUES = Object.freeze(['absent', 'present_unverified', 'test_verified'] as const);
const SHADOW_VALUES = Object.freeze(['not_wired', 'shadow_wired'] as const);
const AUTHORITY_VALUES = Object.freeze(['legacy_authoritative', 'cut_over'] as const);
const SCALAR_VALUES = Object.freeze(['legacy_authoritative', 'shadow_wired', 'cut_over'] as const);

const FIXTURE_EVIDENCE = Object.freeze({
  runtime_path: '.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts',
  runtime_symbol: 'AuthorityFlipCoordinator',
  composition_root: '.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts',
  test_path: '.opencode/skills/system-deep-loop/runtime/tests/unit/per-mode-authority-flip.vitest.ts',
  test_name: 'AuthorityFlipCoordinator'
});

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

type LibraryStatus = (typeof LIBRARY_VALUES)[number];
type ShadowStatus = (typeof SHADOW_VALUES)[number];
type AuthorityStatus = (typeof AUTHORITY_VALUES)[number];
type CompositionStatus = (typeof SCALAR_VALUES)[number];

interface FrozenRow {
  id: string;
  source_path: string;
  companion_evidence: { path: string; sha256: string } | null;
  disposition: string;
  original_recommendation: string;
  original_target: string;
  [key: string]: unknown;
}

interface FrozenLedger {
  source_manifest: Array<{ path: string; [key: string]: unknown }>;
  phase_manifest: { path: string; [key: string]: unknown };
  rows: FrozenRow[];
  [key: string]: unknown;
}

interface FrozenReport {
  verdict: string;
  source_bijection: { actual: { total: number } };
  adopted_per_phase: Record<string, { count: number; row_ids: string[] }>;
  [key: string]: unknown;
}

interface EvidenceRef {
  presence: 'absent' | 'verified';
  path: string | null;
  symbol: string | null;
  name: string | null;
}

interface StatusFields {
  library: LibraryStatus;
  shadow: ShadowStatus;
  authority: AuthorityStatus;
}

interface InheritedDependency {
  id: typeof INHERITED_ID;
  relation: typeof INHERITED_RELATION;
  frozen_disposition: typeof INHERITED_DISPOSITION;
}

interface CanonicalRow {
  id: string;
  disposition: typeof ADOPT_013;
  depends_on_recommendation: InheritedDependency;
  runtime_symbol: EvidenceRef;
  composition_root: EvidenceRef;
  test_evidence: EvidenceRef;
  status: StatusFields;
  composition_status: CompositionStatus;
}

interface LineageRow {
  id: string;
  disposition: string;
  resolves_to: string;
  chain: string[];
  depends_on_recommendation: InheritedDependency;
  runtime_symbol: EvidenceRef;
  composition_root: EvidenceRef;
  test_evidence: EvidenceRef;
  status: StatusFields;
  composition_status: CompositionStatus;
}

interface AliasEntry {
  old_path: string;
  current_path: string;
}

interface PathInventoryEntry {
  field: string;
  path: string;
  stale: boolean;
}

interface TreeInventory {
  runtime_files: string[];
  exported_symbols: Array<{ path: string; symbol: string }>;
  composition_root_candidates: string[];
  named_tests: Array<{ path: string; name: string }>;
}

interface SourceDigests {
  ledger_path: string;
  ledger_sha256: string;
  report_path: string;
  report_sha256: string;
  captured_at: 'before_generation';
}

interface TraceabilityDoc {
  schema_version: string;
  source: {
    ledger_path: string;
    ledger_sha256: string;
    report_path: string;
    report_sha256: string;
    report_verdict: string;
    source_row_count: number;
  };
  canonical_adoptions: {
    count: number;
    denominator: number;
    selection: typeof ADOPT_013;
    rows: CanonicalRow[];
  };
  merged_lineage: {
    count: number;
    counted_in_denominator: false;
    rows: LineageRow[];
  };
  inherited_contract: InheritedDependency & {
    frozen_phase: '006';
    reclassified_as_phase_013: false;
  };
}

interface AliasDoc {
  schema_version: string;
  repository_root_rule: string;
  stale_prefix: string;
  canonical_prefix: string;
  entries: AliasEntry[];
}

interface ArtifactSet {
  traceability: TraceabilityDoc;
  aliases: AliasDoc;
  pathInventory: { schema_version: string; fields: readonly string[]; entries: PathInventoryEntry[] };
  treeInventory: TreeInventory & { schema_version: string };
  digests: SourceDigests;
  traceabilityText: string;
  aliasText: string;
  pathInventoryText: string;
  treeInventoryText: string;
  digestText: string;
  traceabilitySchemaText: string;
  aliasSchemaText: string;
  validationSchemaText: string;
}

class TraceabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TraceabilityError';
  }
}

function fail(message: string): never {
  throw new TraceabilityError(message);
}

function assertCondition(condition: unknown, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. CANONICAL BYTES AND DIGESTS
// ───────────────────────────────────────────────────────────────────

function sha256Bytes(buffer: Buffer | string): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      sorted[key] = sortKeys(record[key]);
    }
    return sorted;
  }
  return value;
}

function stableJson(value: unknown): string {
  return JSON.stringify(sortKeys(value), null, 2) + '\n';
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function posixRel(from: string, to: string): string {
  return path.relative(from, to).split(path.sep).join('/');
}

// ───────────────────────────────────────────────────────────────────
// 4. FROZEN INPUT READER
// ───────────────────────────────────────────────────────────────────

function readOnlyFile(absPath: string): Buffer {
  const fd = fs.openSync(absPath, 'r');
  try {
    return fs.readFileSync(fd);
  } finally {
    fs.closeSync(fd);
  }
}

function loadFrozenInputs(): {
  ledgerAbs: string;
  reportAbs: string;
  ledgerBytes: Buffer;
  reportBytes: Buffer;
  ledgerSha: string;
  reportSha: string;
  ledger: FrozenLedger;
  report: FrozenReport;
} {
  const ledgerAbs = path.join(REPO_ROOT, LEDGER_REL);
  const reportAbs = path.join(REPO_ROOT, REPORT_REL);
  assertCondition(fs.existsSync(ledgerAbs), 'Frozen ledger is missing');
  assertCondition(fs.existsSync(reportAbs), 'Frozen validation report is missing');
  const ledgerBytes = readOnlyFile(ledgerAbs);
  const reportBytes = readOnlyFile(reportAbs);
  const ledger = JSON.parse(ledgerBytes.toString('utf8')) as FrozenLedger;
  const report = JSON.parse(reportBytes.toString('utf8')) as FrozenReport;
  return {
    ledgerAbs,
    reportAbs,
    ledgerBytes,
    reportBytes,
    ledgerSha: sha256Bytes(ledgerBytes),
    reportSha: sha256Bytes(reportBytes),
    ledger,
    report
  };
}

function assertFrozenUnchanged(expectedLedger: string, expectedReport: string): void {
  const again = loadFrozenInputs();
  assertCondition(again.ledgerSha === expectedLedger, 'Frozen ledger bytes changed');
  assertCondition(again.reportSha === expectedReport, 'Frozen validation report bytes changed');
}

function verifyReportBaseline(report: FrozenReport): void {
  assertCondition(report.verdict === 'PASS', 'Frozen validation report is not PASS');
  assertCondition(
    report.source_bijection.actual.total === EXPECTED_SOURCE_ROWS,
    'Frozen report source total is not 178'
  );
  assertCondition(
    report.adopted_per_phase['013']?.count === EXPECTED_ADOPTIONS,
    'Frozen report phase-013 count is not 72'
  );
}

function assertInheritedFrozenDisposition(ledger: FrozenLedger): void {
  const row = ledger.rows.find((candidate) => candidate.id === INHERITED_ID);
  assertCondition(row, 'Inherited transition recommendation is missing from the frozen ledger');
  assertCondition(
    row.disposition === INHERITED_DISPOSITION,
    'Inherited transition recommendation is not frozen to phase 006'
  );
}

// ───────────────────────────────────────────────────────────────────
// 5. SELECTION AND MERGE LINEAGE
// ───────────────────────────────────────────────────────────────────

function rowsById(rows: FrozenRow[]): Map<string, FrozenRow> {
  const map = new Map<string, FrozenRow>();
  for (const row of rows) {
    assertCondition(!map.has(row.id), 'Duplicate frozen id: ' + row.id);
    map.set(row.id, row);
  }
  return map;
}

function parseMergeTarget(disposition: string): string | null {
  if (!disposition.startsWith(MERGE_PREFIX)) {
    return null;
  }
  return disposition.slice(MERGE_PREFIX.length);
}

function followMerge(
  start: FrozenRow,
  index: Map<string, FrozenRow>
): { terminal: FrozenRow; chain: string[] } {
  const chain: string[] = [];
  const seen = new Set<string>();
  let current = start;
  while (current.disposition.startsWith(MERGE_PREFIX)) {
    assertCondition(!seen.has(current.id), 'Merge cycle involving ' + current.id);
    seen.add(current.id);
    chain.push(current.id);
    const targetId = parseMergeTarget(current.disposition);
    assertCondition(targetId && targetId.length > 0, 'Merge target missing on ' + current.id);
    assertCondition(targetId !== current.id, 'Self-merge on ' + current.id);
    const target = index.get(targetId);
    assertCondition(target, 'Missing merge target ' + targetId + ' from ' + current.id);
    current = target;
  }
  chain.push(current.id);
  return { terminal: current, chain };
}

function selectCanonical(ledger: FrozenLedger): FrozenRow[] {
  const selected = ledger.rows.filter((row) => row.disposition === ADOPT_013);
  const ids = selected.map((row) => row.id);
  assertCondition(ids.length === EXPECTED_ADOPTIONS, 'Canonical adoption count is ' + ids.length + ', expected 72');
  assertCondition(new Set(ids).size === EXPECTED_ADOPTIONS, 'Canonical adoption IDs are not unique');
  return [...selected].sort((a, b) => a.id.localeCompare(b.id));
}

function resolveLineage(ledger: FrozenLedger, canonicalIds: Set<string>): Array<{
  row: FrozenRow;
  terminal: FrozenRow;
  chain: string[];
}> {
  const index = rowsById(ledger.rows);
  const included: Array<{ row: FrozenRow; terminal: FrozenRow; chain: string[] }> = [];
  for (const row of ledger.rows) {
    if (!row.disposition.startsWith(MERGE_PREFIX)) {
      continue;
    }
    const followed = followMerge(row, index);
    if (followed.terminal.disposition === ADOPT_013 && canonicalIds.has(followed.terminal.id)) {
      included.push({ row, terminal: followed.terminal, chain: followed.chain });
    }
  }
  included.sort((a, b) => a.row.id.localeCompare(b.row.id));
  return included;
}

// ───────────────────────────────────────────────────────────────────
// 6. EVIDENCE AND STATUS
// ───────────────────────────────────────────────────────────────────

function absentEvidence(): EvidenceRef {
  return { presence: 'absent', path: null, symbol: null, name: null };
}

function inheritedDependency(): InheritedDependency {
  return {
    id: INHERITED_ID,
    relation: INHERITED_RELATION,
    frozen_disposition: INHERITED_DISPOSITION
  };
}

function baselineStatus(): StatusFields {
  return {
    library: 'absent',
    shadow: 'not_wired',
    authority: 'legacy_authoritative'
  };
}

function evidenceComplete(row: {
  runtime_symbol: EvidenceRef;
  composition_root: EvidenceRef;
  test_evidence: EvidenceRef;
}): boolean {
  return (
    row.runtime_symbol.presence === 'verified' &&
    Boolean(row.runtime_symbol.path) &&
    Boolean(row.runtime_symbol.symbol) &&
    row.composition_root.presence === 'verified' &&
    Boolean(row.composition_root.path) &&
    row.test_evidence.presence === 'verified' &&
    Boolean(row.test_evidence.path) &&
    Boolean(row.test_evidence.name)
  );
}

function deriveScalar(status: StatusFields): CompositionStatus {
  if (status.authority === 'cut_over') {
    return 'cut_over';
  }
  if (status.shadow === 'shadow_wired' && status.authority === 'legacy_authoritative') {
    return 'shadow_wired';
  }
  return 'legacy_authoritative';
}

function assertStatusLegal(
  status: StatusFields,
  evidence: {
    runtime_symbol: EvidenceRef;
    composition_root: EvidenceRef;
    test_evidence: EvidenceRef;
  },
  scalar: CompositionStatus
): void {
  assertCondition((LIBRARY_VALUES as readonly string[]).includes(status.library), 'Invalid library status');
  assertCondition((SHADOW_VALUES as readonly string[]).includes(status.shadow), 'Invalid shadow status');
  assertCondition((AUTHORITY_VALUES as readonly string[]).includes(status.authority), 'Invalid authority status');
  assertCondition((SCALAR_VALUES as readonly string[]).includes(scalar), 'Invalid composition status');
  assertCondition(scalar === deriveScalar(status), 'composition_status does not match the three status fields');

  if (status.library === 'absent') {
    assertCondition(evidence.runtime_symbol.presence === 'absent', 'absent library cannot carry a runtime symbol');
  }
  if (status.library === 'present_unverified') {
    assertCondition(evidence.runtime_symbol.presence === 'verified', 'present_unverified requires a verified symbol');
    assertCondition(evidence.test_evidence.presence === 'absent', 'present_unverified cannot carry test evidence');
  }
  if (status.library === 'test_verified') {
    assertCondition(evidence.test_evidence.presence === 'verified', 'test_verified requires named test evidence');
  }
  if (status.shadow === 'shadow_wired' || status.authority === 'cut_over') {
    assertCondition(
      evidenceComplete(evidence),
      'shadow or authority advancement requires verified symbol, composition root, and test evidence'
    );
  }
}

function assertEvidenceShape(ref: EvidenceRef, kind: 'runtime_symbol' | 'composition_root' | 'test_evidence'): void {
  if (ref.presence === 'absent') {
    assertCondition(ref.path === null && ref.symbol === null && ref.name === null, kind + ' absence must be explicit');
    return;
  }
  assertCondition(typeof ref.path === 'string' && ref.path.length > 0, kind + ' verified path is missing');
  if (kind === 'runtime_symbol') {
    assertCondition(typeof ref.symbol === 'string' && ref.symbol.length > 0, 'verified runtime symbol is missing');
  }
  if (kind === 'test_evidence') {
    assertCondition(typeof ref.name === 'string' && ref.name.length > 0, 'verified test name is missing');
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fileContainsSymbol(absPath: string, symbol: string): boolean {
  const text = fs.readFileSync(absPath, 'utf8');
  const escaped = escapeRegExp(symbol);
  const exportPattern = new RegExp(
    '(?:export\\s+(?:async\\s+)?(?:function|class|const|type|interface|enum)\\s+' +
      escaped +
      '\\b|export\\s+\\{[^}]*\\b' +
      escaped +
      '\\b)'
  );
  return exportPattern.test(text);
}

function fileContainsTestName(absPath: string, name: string): boolean {
  const text = fs.readFileSync(absPath, 'utf8');
  return text.includes(name);
}

function resolveRepoPath(relPath: string): string {
  assertCondition(!path.isAbsolute(relPath), 'Evidence path must be repository-relative: ' + relPath);
  const normalized = path.normalize(relPath);
  assertCondition(
    !normalized.split(path.sep).includes('..'),
    'Evidence path escapes the repository: ' + relPath
  );
  return path.join(REPO_ROOT, normalized);
}

function assertVerifiedEvidence(ref: EvidenceRef, kind: 'runtime_symbol' | 'composition_root' | 'test_evidence'): void {
  assertEvidenceShape(ref, kind);
  if (ref.presence !== 'verified' || !ref.path) {
    return;
  }
  const abs = resolveRepoPath(ref.path);
  assertCondition(fs.existsSync(abs), 'Verified path does not exist: ' + ref.path);
  if (kind === 'runtime_symbol' && ref.symbol) {
    assertCondition(fileContainsSymbol(abs, ref.symbol), 'Runtime symbol is not declared in ' + ref.path);
  }
  if (kind === 'test_evidence' && ref.name) {
    assertCondition(fileContainsTestName(abs, ref.name), 'Test name is not declared in ' + ref.path);
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. CURRENT-TREE INVENTORY
// ───────────────────────────────────────────────────────────────────

function walkFiles(absDir: string, suffix: string): string[] {
  if (!fs.existsSync(absDir)) {
    return [];
  }
  const found: string[] = [];
  const stack = [absDir];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') {
          continue;
        }
        stack.push(full);
      } else if (entry.isFile() && entry.name.endsWith(suffix)) {
        found.push(posixRel(REPO_ROOT, full));
      }
    }
  }
  found.sort();
  return found;
}

function extractExports(relPath: string): string[] {
  const text = fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
  const names = new Set<string>();
  const pattern = /export\s+(?:async\s+)?(?:function|class|const|type|interface|enum)\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  let match: RegExpExecArray | null = pattern.exec(text);
  while (match) {
    names.add(match[1]);
    match = pattern.exec(text);
  }
  return [...names].sort();
}

function extractTestNames(relPath: string): string[] {
  const text = fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
  const names = new Set<string>();
  const pattern = /(?:describe|it|test)\(\s*['`]([^'`]+)/g;
  let match: RegExpExecArray | null = pattern.exec(text);
  while (match) {
    names.add(match[1]);
    match = pattern.exec(text);
  }
  return [...names].sort();
}

function buildTreeInventory(): TreeInventory {
  const runtimeRoot = path.join(REPO_ROOT, '.opencode', 'skills', 'system-deep-loop', 'runtime');
  const runtimeFiles = walkFiles(path.join(runtimeRoot, 'lib'), '.ts');
  const testFiles = walkFiles(path.join(runtimeRoot, 'tests'), '.ts');
  const exported_symbols: Array<{ path: string; symbol: string }> = [];
  for (const file of runtimeFiles) {
    for (const symbol of extractExports(file)) {
      exported_symbols.push({ path: file, symbol });
    }
  }
  const named_tests: Array<{ path: string; name: string }> = [];
  for (const file of testFiles) {
    for (const name of extractTestNames(file)) {
      named_tests.push({ path: file, name });
    }
  }
  const composition_root_candidates = runtimeFiles.filter((file) =>
    /(?:adapter|composition|mode-root|coordinator|registry)/i.test(file)
  );
  return {
    runtime_files: runtimeFiles,
    exported_symbols,
    composition_root_candidates,
    named_tests
  };
}

// ───────────────────────────────────────────────────────────────────
// 8. ALIAS RESOLUTION
// ───────────────────────────────────────────────────────────────────

function collectSelectedRows(canonical: FrozenRow[], lineage: FrozenRow[], inherited: FrozenRow): FrozenRow[] {
  const byId = new Map<string, FrozenRow>();
  for (const row of [...canonical, ...lineage, inherited]) {
    byId.set(row.id, row);
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function collectPathInventory(ledger: FrozenLedger, selected: FrozenRow[]): PathInventoryEntry[] {
  const entries: PathInventoryEntry[] = [];
  const seen = new Set<string>();
  function add(field: string, value: string): void {
    const key = field + '\0' + value;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    entries.push({
      field,
      path: value,
      stale: value.startsWith(STALE_PREFIX)
    });
  }
  for (const row of selected) {
    add('rows[].source_path', row.source_path);
    if (row.companion_evidence?.path) {
      add('rows[].companion_evidence.path', row.companion_evidence.path);
    }
  }
  for (const manifest of ledger.source_manifest) {
    const used = selected.some((row) => row.source_path === manifest.path);
    if (used) {
      add('source_manifest[].path', manifest.path);
    }
  }
  entries.sort((a, b) => a.path.localeCompare(b.path) || a.field.localeCompare(b.field));
  return entries;
}

function listCanonicalSpecFiles(): string[] {
  return walkFiles(path.join(REPO_ROOT, 'specs'), '').filter((rel) => rel.startsWith('specs/'));
}

function resolveStalePointer(stalePath: string, canonicalFiles: string[]): string {
  assertCondition(stalePath.startsWith(STALE_PREFIX), 'Not a stale pre-consolidation pointer: ' + stalePath);
  const historical = stalePath.slice(STALE_PREFIX.length);
  const direct = CANONICAL_PREFIX + historical;
  if (fs.existsSync(path.join(REPO_ROOT, direct))) {
    return direct;
  }
  const segments = historical.split('/').filter(Boolean);
  assertCondition(segments.length > 0, 'Stale pointer has no path segments: ' + stalePath);
  for (let drop = 0; drop < segments.length; drop += 1) {
    const suffix = segments.slice(drop).join('/');
    const matches = canonicalFiles.filter(
      (candidate) => candidate === CANONICAL_PREFIX + suffix || candidate.endsWith('/' + suffix)
    );
    if (matches.length === 1) {
      return matches[0];
    }
    if (matches.length > 1) {
      fail('Ambiguous alias for ' + stalePath + ' at suffix ' + suffix);
    }
  }
  fail('Unresolved stale pointer: ' + stalePath);
}

function normalizeRepoRelative(relPath: string): string {
  assertCondition(typeof relPath === 'string' && relPath.length > 0, 'Alias path is empty');
  assertCondition(!path.isAbsolute(relPath), 'Alias path must be repository-relative: ' + relPath);
  const posix = relPath.split('\\').join('/');
  assertCondition(!posix.startsWith('/'), 'Alias path must not be absolute: ' + relPath);
  const normalized = path.posix.normalize(posix);
  assertCondition(
    normalized === posix || !posix.includes('/./'),
    'Alias path is not canonical: ' + relPath
  );
  const abs = path.resolve(REPO_ROOT, normalized);
  const rel = posixRel(REPO_ROOT, abs);
  assertCondition(!rel.startsWith('..'), 'Alias path escapes the repository: ' + relPath);
  return normalized.replace(/^\.\//, '');
}

function assertTargetExists(relPath: string): void {
  const abs = path.join(REPO_ROOT, relPath);
  assertCondition(fs.existsSync(abs), 'Alias target does not exist: ' + relPath);
}

function detectAliasCycle(entries: AliasEntry[]): void {
  const map = new Map(entries.map((entry) => [entry.old_path, entry.current_path]));
  for (const start of map.keys()) {
    const seen = new Set<string>();
    let current: string | undefined = start;
    while (current && map.has(current)) {
      assertCondition(!seen.has(current), 'Cyclic alias involving ' + current);
      seen.add(current);
      current = map.get(current);
    }
  }
}

function buildAliasManifest(pathInventory: PathInventoryEntry[]): AliasDoc {
  const stale = pathInventory.filter((entry) => entry.stale);
  const uniqueOld = [...new Set(stale.map((entry) => entry.path))].sort();
  const canonicalFiles = listCanonicalSpecFiles();
  const entries: AliasEntry[] = uniqueOld.map((oldPath) => {
    const current = resolveStalePointer(oldPath, canonicalFiles);
    const oldNorm = normalizeRepoRelative(oldPath);
    const currentNorm = normalizeRepoRelative(current);
    assertCondition(oldNorm === oldPath, 'Stale pointer is not a canonical relative path: ' + oldPath);
    assertTargetExists(currentNorm);
    return { old_path: oldPath, current_path: currentNorm };
  });
  const oldCounts = new Map<string, number>();
  for (const entry of entries) {
    oldCounts.set(entry.old_path, (oldCounts.get(entry.old_path) ?? 0) + 1);
  }
  for (const [oldPath, count] of oldCounts) {
    assertCondition(count === 1, 'Duplicate alias for ' + oldPath);
  }
  const grouped = new Map<string, Set<string>>();
  for (const entry of entries) {
    const set = grouped.get(entry.old_path) ?? new Set<string>();
    set.add(entry.current_path);
    grouped.set(entry.old_path, set);
  }
  for (const [oldPath, targets] of grouped) {
    assertCondition(targets.size === 1, 'Ambiguous alias for ' + oldPath);
  }
  detectAliasCycle(entries);
  for (const stalePath of uniqueOld) {
    assertCondition(
      entries.some((entry) => entry.old_path === stalePath),
      'Unresolved stale pointer: ' + stalePath
    );
  }
  return {
    schema_version: SCHEMA_VERSION,
    repository_root_rule: 'paths are repo-relative POSIX, must resolve inside the repository, and targets must exist',
    stale_prefix: STALE_PREFIX,
    canonical_prefix: CANONICAL_PREFIX,
    entries
  };
}

function validateAliasDoc(doc: AliasDoc, pathInventory: PathInventoryEntry[]): void {
  assertCondition(doc.schema_version === SCHEMA_VERSION, 'Alias schema_version drifted');
  const stale = [...new Set(pathInventory.filter((entry) => entry.stale).map((entry) => entry.path))].sort();
  const byOld = new Map<string, Set<string>>();
  const seenPairs = new Set<string>();
  for (const entry of doc.entries) {
    const oldPath = normalizeRepoRelative(entry.old_path);
    const current = normalizeRepoRelative(entry.current_path);
    const pair = oldPath + '\0' + current;
    if (seenPairs.has(pair)) {
      fail('Duplicate alias for ' + oldPath);
    }
    seenPairs.add(pair);
    const targets = byOld.get(oldPath) ?? new Set<string>();
    targets.add(current);
    byOld.set(oldPath, targets);
  }
  for (const [oldPath, targets] of byOld) {
    assertCondition(targets.size === 1, 'Ambiguous alias for ' + oldPath);
  }
  detectAliasCycle(doc.entries);
  for (const entry of doc.entries) {
    assertTargetExists(normalizeRepoRelative(entry.current_path));
  }
  for (const stalePath of stale) {
    const matches = doc.entries.filter((entry) => entry.old_path === stalePath);
    assertCondition(matches.length === 1, 'Stale pointer is not uniquely resolved: ' + stalePath);
  }
  assertCondition(doc.entries.length === stale.length, 'Alias count does not match inventoried stale pointers');
}

// ───────────────────────────────────────────────────────────────────
// 9. SCHEMAS
// ───────────────────────────────────────────────────────────────────

const EVIDENCE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['presence', 'path', 'symbol', 'name'],
  properties: {
    presence: { enum: ['absent', 'verified'] },
    path: { type: ['string', 'null'] },
    symbol: { type: ['string', 'null'] },
    name: { type: ['string', 'null'] }
  }
};

const STATUS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['library', 'shadow', 'authority'],
  properties: {
    library: { enum: [...LIBRARY_VALUES] },
    shadow: { enum: [...SHADOW_VALUES] },
    authority: { enum: [...AUTHORITY_VALUES] }
  }
};

const DEPENDENCY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'relation', 'frozen_disposition'],
  properties: {
    id: { const: INHERITED_ID },
    relation: { const: INHERITED_RELATION },
    frozen_disposition: { const: INHERITED_DISPOSITION }
  }
};

function buildTraceabilitySchema(): unknown {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: TRACEABILITY_SCHEMA_FILE,
    title: 'Recommendation Traceability Join',
    type: 'object',
    additionalProperties: false,
    required: ['schema_version', 'source', 'canonical_adoptions', 'merged_lineage', 'inherited_contract'],
    properties: {
      schema_version: { const: SCHEMA_VERSION },
      source: {
        type: 'object',
        additionalProperties: false,
        required: [
          'ledger_path',
          'ledger_sha256',
          'report_path',
          'report_sha256',
          'report_verdict',
          'source_row_count'
        ],
        properties: {
          ledger_path: { type: 'string', minLength: 1 },
          ledger_sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
          report_path: { type: 'string', minLength: 1 },
          report_sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
          report_verdict: { const: 'PASS' },
          source_row_count: { const: EXPECTED_SOURCE_ROWS }
        }
      },
      canonical_adoptions: {
        type: 'object',
        additionalProperties: false,
        required: ['count', 'denominator', 'selection', 'rows'],
        properties: {
          count: { const: EXPECTED_ADOPTIONS },
          denominator: { const: EXPECTED_ADOPTIONS },
          selection: { const: ADOPT_013 },
          rows: {
            type: 'array',
            minItems: EXPECTED_ADOPTIONS,
            maxItems: EXPECTED_ADOPTIONS,
            items: {
              type: 'object',
              additionalProperties: false,
              required: [
                'id',
                'disposition',
                'depends_on_recommendation',
                'runtime_symbol',
                'composition_root',
                'test_evidence',
                'status',
                'composition_status'
              ],
              properties: {
                id: { type: 'string', pattern: '^DLR-[ABC]-[0-9]{3}$' },
                disposition: { const: ADOPT_013 },
                depends_on_recommendation: DEPENDENCY_SCHEMA,
                runtime_symbol: EVIDENCE_SCHEMA,
                composition_root: EVIDENCE_SCHEMA,
                test_evidence: EVIDENCE_SCHEMA,
                status: STATUS_SCHEMA,
                composition_status: { enum: [...SCALAR_VALUES] }
              }
            }
          }
        }
      },
      merged_lineage: {
        type: 'object',
        additionalProperties: false,
        required: ['count', 'counted_in_denominator', 'rows'],
        properties: {
          count: { type: 'integer', minimum: 0 },
          counted_in_denominator: { const: false },
          rows: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: [
                'id',
                'disposition',
                'resolves_to',
                'chain',
                'depends_on_recommendation',
                'runtime_symbol',
                'composition_root',
                'test_evidence',
                'status',
                'composition_status'
              ],
              properties: {
                id: { type: 'string', pattern: '^DLR-[ABC]-[0-9]{3}$' },
                disposition: { type: 'string', pattern: '^merge-into-DLR-[ABC]-[0-9]{3}$' },
                resolves_to: { type: 'string', pattern: '^DLR-[ABC]-[0-9]{3}$' },
                chain: { type: 'array', items: { type: 'string' }, minItems: 2 },
                depends_on_recommendation: DEPENDENCY_SCHEMA,
                runtime_symbol: EVIDENCE_SCHEMA,
                composition_root: EVIDENCE_SCHEMA,
                test_evidence: EVIDENCE_SCHEMA,
                status: STATUS_SCHEMA,
                composition_status: { enum: [...SCALAR_VALUES] }
              }
            }
          }
        }
      },
      inherited_contract: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'relation', 'frozen_disposition', 'frozen_phase', 'reclassified_as_phase_013'],
        properties: {
          id: { const: INHERITED_ID },
          relation: { const: INHERITED_RELATION },
          frozen_disposition: { const: INHERITED_DISPOSITION },
          frozen_phase: { const: '006' },
          reclassified_as_phase_013: { const: false }
        }
      }
    }
  };
}

function buildAliasSchema(): unknown {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: ALIAS_SCHEMA_FILE,
    title: 'Consolidation Alias Manifest',
    type: 'object',
    additionalProperties: false,
    required: ['schema_version', 'repository_root_rule', 'stale_prefix', 'canonical_prefix', 'entries'],
    properties: {
      schema_version: { const: SCHEMA_VERSION },
      repository_root_rule: { type: 'string', minLength: 1 },
      stale_prefix: { const: STALE_PREFIX },
      canonical_prefix: { const: CANONICAL_PREFIX },
      entries: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['old_path', 'current_path'],
          properties: {
            old_path: { type: 'string', minLength: 1 },
            current_path: { type: 'string', minLength: 1 }
          }
        }
      }
    }
  };
}

function buildValidationSchema(): unknown {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: VALIDATION_SCHEMA_FILE,
    title: 'Traceability Validation Report',
    type: 'object',
    additionalProperties: false,
    required: [
      'schema_version',
      'verdict',
      'source_digests',
      'counts',
      'inherited_contract',
      'status_derivation',
      'aliases',
      'determinism',
      'negative_fixtures',
      'frozen_input_preservation',
      'hashes'
    ],
    properties: {
      schema_version: { const: SCHEMA_VERSION },
      verdict: { const: 'PASS' },
      source_digests: { type: 'object' },
      counts: { type: 'object' },
      inherited_contract: { type: 'object' },
      status_derivation: { type: 'object' },
      aliases: { type: 'object' },
      determinism: { type: 'object' },
      negative_fixtures: { type: 'object' },
      frozen_input_preservation: { type: 'object' },
      hashes: { type: 'object' }
    }
  };
}

function runJsonSchema(schemaPath: string, instancePath: string): void {
  const python = [
    'import json, sys',
    'import jsonschema',
    'schema_path, instance_path = sys.argv[1], sys.argv[2]',
    'with open(schema_path, encoding="utf-8") as handle: schema = json.load(handle)',
    'with open(instance_path, encoding="utf-8") as handle: instance = json.load(handle)',
    'jsonschema.Draft202012Validator.check_schema(schema)',
    'jsonschema.Draft202012Validator(schema).validate(instance)'
  ].join('\n');
  const result = childProcess.spawnSync('python3', ['-c', python, schemaPath, instancePath], {
    encoding: 'utf8'
  });
  assertCondition(
    result.status === 0,
    'JSON Schema validation failed for ' + instancePath + ': ' + (result.stderr || result.stdout || result.status)
  );
}

// ───────────────────────────────────────────────────────────────────
// 10. BUILD
// ───────────────────────────────────────────────────────────────────

function projectCanonical(row: FrozenRow): CanonicalRow {
  const evidence = {
    runtime_symbol: absentEvidence(),
    composition_root: absentEvidence(),
    test_evidence: absentEvidence()
  };
  const status = baselineStatus();
  const scalar = deriveScalar(status);
  assertStatusLegal(status, evidence, scalar);
  return {
    id: row.id,
    disposition: ADOPT_013,
    depends_on_recommendation: inheritedDependency(),
    ...evidence,
    status,
    composition_status: scalar
  };
}

function projectLineage(row: FrozenRow, terminal: FrozenRow, chain: string[]): LineageRow {
  const evidence = {
    runtime_symbol: absentEvidence(),
    composition_root: absentEvidence(),
    test_evidence: absentEvidence()
  };
  const status = baselineStatus();
  const scalar = deriveScalar(status);
  assertStatusLegal(status, evidence, scalar);
  return {
    id: row.id,
    disposition: row.disposition,
    resolves_to: terminal.id,
    chain,
    depends_on_recommendation: inheritedDependency(),
    ...evidence,
    status,
    composition_status: scalar
  };
}

function buildTraceability(
  ledger: FrozenLedger,
  report: FrozenReport,
  digests: SourceDigests
): TraceabilityDoc {
  verifyReportBaseline(report);
  assertInheritedFrozenDisposition(ledger);
  assertCondition(ledger.rows.length === EXPECTED_SOURCE_ROWS, 'Frozen ledger row count is not 178');
  const canonicalFrozen = selectCanonical(ledger);
  const canonicalIds = new Set(canonicalFrozen.map((row) => row.id));
  const lineage = resolveLineage(ledger, canonicalIds);
  for (const item of lineage) {
    assertCondition(canonicalIds.has(item.terminal.id), 'Lineage terminal is outside the canonical set: ' + item.row.id);
    assertCondition(
      !canonicalIds.has(item.row.id),
      'Merged lineage id collided with the adoption denominator: ' + item.row.id
    );
  }
  const canonicalRows = canonicalFrozen.map(projectCanonical);
  const lineageRows = lineage.map((item) => projectLineage(item.row, item.terminal, item.chain));
  assertCondition(canonicalRows.length === EXPECTED_ADOPTIONS, 'Projected canonical count drifted');
  return {
    schema_version: SCHEMA_VERSION,
    source: {
      ledger_path: LEDGER_REL.split(path.sep).join('/'),
      ledger_sha256: digests.ledger_sha256,
      report_path: REPORT_REL.split(path.sep).join('/'),
      report_sha256: digests.report_sha256,
      report_verdict: report.verdict,
      source_row_count: EXPECTED_SOURCE_ROWS
    },
    canonical_adoptions: {
      count: canonicalRows.length,
      denominator: EXPECTED_ADOPTIONS,
      selection: ADOPT_013,
      rows: canonicalRows
    },
    merged_lineage: {
      count: lineageRows.length,
      counted_in_denominator: false,
      rows: lineageRows
    },
    inherited_contract: {
      ...inheritedDependency(),
      frozen_phase: '006',
      reclassified_as_phase_013: false
    }
  };
}

function validateTraceability(doc: TraceabilityDoc, ledger: FrozenLedger, tree: TreeInventory): void {
  assertCondition(doc.schema_version === SCHEMA_VERSION, 'Traceability schema_version drifted');
  assertCondition(doc.canonical_adoptions.count === EXPECTED_ADOPTIONS, 'Canonical count is not 72');
  assertCondition(doc.canonical_adoptions.denominator === EXPECTED_ADOPTIONS, 'Denominator is not 72');
  assertCondition(
    doc.canonical_adoptions.rows.length === EXPECTED_ADOPTIONS,
    'Canonical row array length is not 72'
  );
  assertCondition(
    doc.canonical_adoptions.count + 0 === doc.canonical_adoptions.denominator,
    'Lineage inflated the adoption denominator'
  );
  assertCondition(
    doc.merged_lineage.counted_in_denominator === false,
    'Merged lineage is counted in the adoption denominator'
  );
  const ids = doc.canonical_adoptions.rows.map((row) => row.id);
  assertCondition(new Set(ids).size === EXPECTED_ADOPTIONS, 'Canonical IDs are not unique');
  const canonicalSet = new Set(ids);
  for (const row of doc.canonical_adoptions.rows) {
    assertCondition(row.disposition === ADOPT_013, 'Non-canonical disposition in adoption set: ' + row.id);
    assertCondition(row.depends_on_recommendation.id === INHERITED_ID, 'Missing inherited dependency on ' + row.id);
    assertCondition(
      row.depends_on_recommendation.relation === INHERITED_RELATION,
      'Inherited relation changed on ' + row.id
    );
    assertCondition(
      row.depends_on_recommendation.frozen_disposition === INHERITED_DISPOSITION,
      'Inherited dependency reclassified on ' + row.id
    );
    assertEvidenceShape(row.runtime_symbol, 'runtime_symbol');
    assertEvidenceShape(row.composition_root, 'composition_root');
    assertEvidenceShape(row.test_evidence, 'test_evidence');
    assertVerifiedEvidence(row.runtime_symbol, 'runtime_symbol');
    assertVerifiedEvidence(row.composition_root, 'composition_root');
    assertVerifiedEvidence(row.test_evidence, 'test_evidence');
    assertStatusLegal(row.status, row, row.composition_status);
    if (row.runtime_symbol.presence === 'absent') {
      assertCondition(row.status.library !== 'test_verified', 'Empty evidence cannot be test_verified: ' + row.id);
      assertCondition(
        row.runtime_symbol.symbol === null,
        'Absent runtime symbol serialized an inferred name: ' + row.id
      );
    }
  }
  for (const row of doc.merged_lineage.rows) {
    assertCondition(canonicalSet.has(row.resolves_to), 'Lineage terminal outside canonical set: ' + row.id);
    assertCondition(!canonicalSet.has(row.id), 'Lineage id is counted as an adoption: ' + row.id);
    assertCondition(row.disposition.startsWith(MERGE_PREFIX), 'Lineage row is not a merge: ' + row.id);
    assertCondition(row.chain[row.chain.length - 1] === row.resolves_to, 'Lineage chain does not end at terminal');
    assertCondition(row.depends_on_recommendation.id === INHERITED_ID, 'Lineage missing inherited dependency');
    assertEvidenceShape(row.runtime_symbol, 'runtime_symbol');
    assertEvidenceShape(row.composition_root, 'composition_root');
    assertEvidenceShape(row.test_evidence, 'test_evidence');
    assertStatusLegal(row.status, row, row.composition_status);
  }
  assertCondition(doc.inherited_contract.id === INHERITED_ID, 'Inherited contract id drifted');
  assertCondition(doc.inherited_contract.reclassified_as_phase_013 === false, 'Inherited contract reclassified');
  assertInheritedFrozenDisposition(ledger);
  assertCondition(tree.runtime_files.length > 0, 'Current-tree inventory is empty');
}

function buildArtifacts(): ArtifactSet {
  const frozen = loadFrozenInputs();
  const digests: SourceDigests = {
    ledger_path: LEDGER_REL.split(path.sep).join('/'),
    ledger_sha256: frozen.ledgerSha,
    report_path: REPORT_REL.split(path.sep).join('/'),
    report_sha256: frozen.reportSha,
    captured_at: 'before_generation'
  };
  const canonicalFrozen = selectCanonical(frozen.ledger);
  const canonicalIds = new Set(canonicalFrozen.map((row) => row.id));
  const lineage = resolveLineage(frozen.ledger, canonicalIds);
  const inherited = frozen.ledger.rows.find((row) => row.id === INHERITED_ID);
  assertCondition(inherited, 'Inherited recommendation missing');
  const selected = collectSelectedRows(
    canonicalFrozen,
    lineage.map((item) => item.row),
    inherited
  );
  const pathInventoryEntries = collectPathInventory(frozen.ledger, selected);
  const treeInventory = buildTreeInventory();
  const traceability = buildTraceability(frozen.ledger, frozen.report, digests);
  validateTraceability(traceability, frozen.ledger, treeInventory);
  const aliases = buildAliasManifest(pathInventoryEntries);
  validateAliasDoc(aliases, pathInventoryEntries);
  const pathInventory = {
    schema_version: SCHEMA_VERSION,
    fields: PATH_BEARING_FIELDS,
    entries: pathInventoryEntries
  };
  const treeDoc = { schema_version: SCHEMA_VERSION, ...treeInventory };
  assertFrozenUnchanged(frozen.ledgerSha, frozen.reportSha);
  return {
    traceability,
    aliases,
    pathInventory,
    treeInventory: treeDoc,
    digests,
    traceabilityText: stableJson(traceability),
    aliasText: stableJson(aliases),
    pathInventoryText: stableJson(pathInventory),
    treeInventoryText: stableJson(treeDoc),
    digestText: stableJson(digests),
    traceabilitySchemaText: stableJson(buildTraceabilitySchema()),
    aliasSchemaText: stableJson(buildAliasSchema()),
    validationSchemaText: stableJson(buildValidationSchema())
  };
}

function assertWriteTarget(destination: string): void {
  const rel = posixRel(PHASE_DIR, destination);
  assertCondition(!rel.startsWith('..'), 'Refusing to write outside the phase folder: ' + destination);
  const frozenRel = posixRel(path.join(REPO_ROOT, LEDGER_PACKET_REL), destination);
  assertCondition(frozenRel.startsWith('..'), 'Refusing to write into frozen ledger inputs');
}

function writeArtifacts(artifacts: ArtifactSet): void {
  const outputs: Record<string, string> = {
    [TRACEABILITY_FILE]: artifacts.traceabilityText,
    [TRACEABILITY_SCHEMA_FILE]: artifacts.traceabilitySchemaText,
    [ALIAS_FILE]: artifacts.aliasText,
    [ALIAS_SCHEMA_FILE]: artifacts.aliasSchemaText,
    [VALIDATION_SCHEMA_FILE]: artifacts.validationSchemaText,
    [DIGESTS_FILE]: artifacts.digestText,
    [INVENTORY_FILE]: artifacts.treeInventoryText,
    [PATH_INVENTORY_FILE]: artifacts.pathInventoryText
  };
  for (const [name, body] of Object.entries(outputs)) {
    const destination = path.join(PHASE_DIR, name);
    assertWriteTarget(destination);
    const temporary = destination + '.tmp';
    fs.writeFileSync(temporary, body, 'utf8');
    fs.renameSync(temporary, destination);
  }
}

function writeValidationReport(reportText: string): void {
  const destination = path.join(PHASE_DIR, VALIDATION_FILE);
  assertWriteTarget(destination);
  const temporary = destination + '.tmp';
  fs.writeFileSync(temporary, reportText, 'utf8');
  fs.renameSync(temporary, destination);
}

function verifyWritten(artifacts: ArtifactSet): void {
  const files: Record<string, string> = {
    [TRACEABILITY_FILE]: artifacts.traceabilityText,
    [TRACEABILITY_SCHEMA_FILE]: artifacts.traceabilitySchemaText,
    [ALIAS_FILE]: artifacts.aliasText,
    [ALIAS_SCHEMA_FILE]: artifacts.aliasSchemaText,
    [DIGESTS_FILE]: artifacts.digestText,
    [INVENTORY_FILE]: artifacts.treeInventoryText,
    [PATH_INVENTORY_FILE]: artifacts.pathInventoryText
  };
  for (const [name, expected] of Object.entries(files)) {
    const actual = fs.readFileSync(path.join(PHASE_DIR, name), 'utf8');
    assertCondition(actual === expected, 'Written artifact drift: ' + name);
  }
  const frozen = loadFrozenInputs();
  const doc = JSON.parse(artifacts.traceabilityText) as TraceabilityDoc;
  validateTraceability(doc, frozen.ledger, artifacts.treeInventory);
  validateAliasDoc(JSON.parse(artifacts.aliasText) as AliasDoc, artifacts.pathInventory.entries);
  runJsonSchema(path.join(PHASE_DIR, TRACEABILITY_SCHEMA_FILE), path.join(PHASE_DIR, TRACEABILITY_FILE));
  runJsonSchema(path.join(PHASE_DIR, ALIAS_SCHEMA_FILE), path.join(PHASE_DIR, ALIAS_FILE));
}

// ───────────────────────────────────────────────────────────────────
// 11. STATUS MATRIX AND NEGATIVE FIXTURES
// ───────────────────────────────────────────────────────────────────

function verifiedRuntime(): EvidenceRef {
  return {
    presence: 'verified',
    path: FIXTURE_EVIDENCE.runtime_path,
    symbol: FIXTURE_EVIDENCE.runtime_symbol,
    name: null
  };
}

function verifiedRoot(): EvidenceRef {
  return {
    presence: 'verified',
    path: FIXTURE_EVIDENCE.composition_root,
    symbol: null,
    name: null
  };
}

function verifiedTest(): EvidenceRef {
  return {
    presence: 'verified',
    path: FIXTURE_EVIDENCE.test_path,
    symbol: null,
    name: FIXTURE_EVIDENCE.test_name
  };
}

function exercisePermittedStatusCombinations(): Array<{ name: string; scalar: CompositionStatus }> {
  const complete = {
    runtime_symbol: verifiedRuntime(),
    composition_root: verifiedRoot(),
    test_evidence: verifiedTest()
  };
  const cases: Array<{ name: string; status: StatusFields; evidence: typeof complete; scalar: CompositionStatus }> = [
    {
      name: 'baseline-absent',
      status: baselineStatus(),
      evidence: {
        runtime_symbol: absentEvidence(),
        composition_root: absentEvidence(),
        test_evidence: absentEvidence()
      },
      scalar: 'legacy_authoritative'
    },
    {
      name: 'library-present-unverified',
      status: { library: 'present_unverified', shadow: 'not_wired', authority: 'legacy_authoritative' },
      evidence: {
        runtime_symbol: verifiedRuntime(),
        composition_root: absentEvidence(),
        test_evidence: absentEvidence()
      },
      scalar: 'legacy_authoritative'
    },
    {
      name: 'library-test-verified-legacy',
      status: { library: 'test_verified', shadow: 'not_wired', authority: 'legacy_authoritative' },
      evidence: complete,
      scalar: 'legacy_authoritative'
    },
    {
      name: 'shadow-wired-legacy-authority',
      status: { library: 'test_verified', shadow: 'shadow_wired', authority: 'legacy_authoritative' },
      evidence: complete,
      scalar: 'shadow_wired'
    },
    {
      name: 'cut-over-with-shadow',
      status: { library: 'test_verified', shadow: 'shadow_wired', authority: 'cut_over' },
      evidence: complete,
      scalar: 'cut_over'
    },
    {
      name: 'cut-over-without-shadow-label',
      status: { library: 'test_verified', shadow: 'not_wired', authority: 'cut_over' },
      evidence: complete,
      scalar: 'cut_over'
    }
  ];
  const results: Array<{ name: string; scalar: CompositionStatus }> = [];
  for (const item of cases) {
    assertVerifiedEvidence(item.evidence.runtime_symbol, 'runtime_symbol');
    if (item.evidence.composition_root.presence === 'verified') {
      assertVerifiedEvidence(item.evidence.composition_root, 'composition_root');
    }
    if (item.evidence.test_evidence.presence === 'verified') {
      assertVerifiedEvidence(item.evidence.test_evidence, 'test_evidence');
    }
    assertStatusLegal(item.status, item.evidence, item.scalar);
    assertCondition(deriveScalar(item.status) === item.scalar, 'Permitted status derivation drifted: ' + item.name);
    results.push({ name: item.name, scalar: item.scalar });
  }
  return results;
}

interface FixtureCase {
  name: string;
  category: string;
  apply: (artifacts: ArtifactSet, ledger: FrozenLedger) => void;
}

function fixtureCases(): FixtureCase[] {
  return [
    {
      name: 'selection-wrong-count',
      category: 'selection',
      apply(artifacts) {
        artifacts.traceability.canonical_adoptions.rows.pop();
        artifacts.traceability.canonical_adoptions.count = artifacts.traceability.canonical_adoptions.rows.length;
      }
    },
    {
      name: 'selection-duplicate-ids',
      category: 'selection',
      apply(artifacts) {
        artifacts.traceability.canonical_adoptions.rows[1].id = artifacts.traceability.canonical_adoptions.rows[0].id;
      }
    },
    {
      name: 'selection-extra-row',
      category: 'selection',
      apply(artifacts) {
        const extra = clone(artifacts.traceability.canonical_adoptions.rows[0]);
        extra.id = 'DLR-A-999';
        artifacts.traceability.canonical_adoptions.rows.push(extra);
        artifacts.traceability.canonical_adoptions.count = artifacts.traceability.canonical_adoptions.rows.length;
      }
    },
    {
      name: 'selection-wrong-phase',
      category: 'selection',
      apply(artifacts) {
        (artifacts.traceability.canonical_adoptions.rows[0] as { disposition: string }).disposition =
          'adopt-as-phase-012';
      }
    },
    {
      name: 'merge-missing-target',
      category: 'merge',
      apply(_artifacts, ledger) {
        const mergeRow = ledger.rows.find((row) => row.disposition.startsWith(MERGE_PREFIX));
        assertCondition(mergeRow, 'No merge row available for fixture');
        mergeRow.disposition = 'merge-into-DLR-A-999';
        followMerge(mergeRow, rowsById(ledger.rows));
      }
    },
    {
      name: 'merge-self-link',
      category: 'merge',
      apply(_artifacts, ledger) {
        const mergeRow = ledger.rows.find((row) => row.disposition.startsWith(MERGE_PREFIX));
        assertCondition(mergeRow, 'No merge row available for fixture');
        mergeRow.disposition = MERGE_PREFIX + mergeRow.id;
        followMerge(mergeRow, rowsById(ledger.rows));
      }
    },
    {
      name: 'merge-cycle',
      category: 'merge',
      apply(_artifacts, ledger) {
        const merges = ledger.rows.filter((row) => row.disposition.startsWith(MERGE_PREFIX));
        assertCondition(merges.length >= 2, 'Need two merge rows for a cycle fixture');
        merges[0].disposition = MERGE_PREFIX + merges[1].id;
        merges[1].disposition = MERGE_PREFIX + merges[0].id;
        followMerge(merges[0], rowsById(ledger.rows));
      }
    },
    {
      name: 'merge-terminal-outside-set',
      category: 'merge',
      apply(artifacts) {
        artifacts.traceability.merged_lineage.rows[0].resolves_to = INHERITED_ID;
        artifacts.traceability.merged_lineage.rows[0].chain = [
          artifacts.traceability.merged_lineage.rows[0].id,
          INHERITED_ID
        ];
      }
    },
    {
      name: 'dependency-missing',
      category: 'dependency',
      apply(artifacts) {
        (artifacts.traceability.canonical_adoptions.rows[0] as { depends_on_recommendation: unknown }).depends_on_recommendation =
          { id: 'DLR-A-001', relation: INHERITED_RELATION, frozen_disposition: INHERITED_DISPOSITION };
      }
    },
    {
      name: 'dependency-changed-relation',
      category: 'dependency',
      apply(artifacts) {
        (artifacts.traceability.canonical_adoptions.rows[0].depends_on_recommendation as { relation: string }).relation =
          'optional_peer';
      }
    },
    {
      name: 'dependency-reclassified-phase-013',
      category: 'dependency',
      apply(artifacts) {
        (
          artifacts.traceability.canonical_adoptions.rows[0].depends_on_recommendation as {
            frozen_disposition: string;
          }
        ).frozen_disposition = ADOPT_013;
      }
    },
    {
      name: 'evidence-invented-path',
      category: 'evidence',
      apply(artifacts) {
        artifacts.traceability.canonical_adoptions.rows[0].runtime_symbol = {
          presence: 'verified',
          path: 'no/such/runtime-symbol.ts',
          symbol: 'InventedSymbol',
          name: null
        };
      }
    },
    {
      name: 'evidence-invented-symbol',
      category: 'evidence',
      apply(artifacts) {
        artifacts.traceability.canonical_adoptions.rows[0].runtime_symbol = {
          presence: 'verified',
          path: FIXTURE_EVIDENCE.runtime_path,
          symbol: 'ThisSymbolDoesNotExistAnywhere',
          name: null
        };
      }
    },
    {
      name: 'evidence-inferred-from-prose',
      category: 'evidence',
      apply(artifacts, ledger) {
        const id = artifacts.traceability.canonical_adoptions.rows[0].id;
        const source = ledger.rows.find((row) => row.id === id);
        assertCondition(source, 'Source row missing');
        artifacts.traceability.canonical_adoptions.rows[0].runtime_symbol = {
          presence: 'verified',
          path: FIXTURE_EVIDENCE.runtime_path,
          symbol: source.original_recommendation.split(/\s+/)[0],
          name: null
        };
      }
    },
    {
      name: 'status-invalid-enum',
      category: 'status',
      apply(artifacts) {
        (artifacts.traceability.canonical_adoptions.rows[0].status as { library: string }).library = 'implemented';
      }
    },
    {
      name: 'status-contradictory',
      category: 'status',
      apply(artifacts) {
        artifacts.traceability.canonical_adoptions.rows[0].status.shadow = 'shadow_wired';
        artifacts.traceability.canonical_adoptions.rows[0].composition_status = 'shadow_wired';
      }
    },
    {
      name: 'status-multiple-scalars',
      category: 'status',
      apply(artifacts) {
        (artifacts.traceability.canonical_adoptions.rows[0] as { composition_status: unknown }).composition_status = [
          'legacy_authoritative',
          'cut_over'
        ];
      }
    },
    {
      name: 'status-advanced-without-evidence',
      category: 'status',
      apply(artifacts) {
        artifacts.traceability.canonical_adoptions.rows[0].status.authority = 'cut_over';
        artifacts.traceability.canonical_adoptions.rows[0].composition_status = 'cut_over';
      }
    },
    {
      name: 'status-scalar-mismatch',
      category: 'status',
      apply(artifacts) {
        artifacts.traceability.canonical_adoptions.rows[0].composition_status = 'cut_over';
      }
    },
    {
      name: 'alias-missing',
      category: 'alias',
      apply(artifacts) {
        artifacts.aliases.entries.pop();
      }
    },
    {
      name: 'alias-duplicate',
      category: 'alias',
      apply(artifacts) {
        artifacts.aliases.entries.push(clone(artifacts.aliases.entries[0]));
      }
    },
    {
      name: 'alias-ambiguous',
      category: 'alias',
      apply(artifacts) {
        const dup = clone(artifacts.aliases.entries[0]);
        dup.current_path = artifacts.aliases.entries[1]?.current_path ?? 'specs/system-deep-loop/036-deep-loop-innovation/spec.md';
        artifacts.aliases.entries.push(dup);
      }
    },
    {
      name: 'alias-cyclic',
      category: 'alias',
      apply(artifacts) {
        const first = artifacts.aliases.entries[0];
        const second = artifacts.aliases.entries[1] ?? clone(first);
        if (artifacts.aliases.entries.length < 2) {
          artifacts.aliases.entries.push(second);
        }
        first.current_path = second.old_path;
        second.current_path = first.old_path;
      }
    },
    {
      name: 'alias-escaping',
      category: 'alias',
      apply(artifacts) {
        artifacts.aliases.entries[0].current_path = '../../etc/passwd';
      }
    },
    {
      name: 'alias-nonexistent-target',
      category: 'alias',
      apply(artifacts) {
        artifacts.aliases.entries[0].current_path = 'specs/does-not-exist-traceability-alias.md';
      }
    },
    {
      name: 'source-mutation-ledger',
      category: 'source-mutation',
      apply(artifacts) {
        artifacts.traceability.source.ledger_sha256 = '0'.repeat(64);
      }
    },
    {
      name: 'source-mutation-report',
      category: 'source-mutation',
      apply(artifacts) {
        artifacts.traceability.source.report_sha256 = 'f'.repeat(64);
      }
    }
  ];
}

function validateBuiltState(artifacts: ArtifactSet, ledger: FrozenLedger): void {
  if (artifacts.traceability.source.ledger_sha256 !== artifacts.digests.ledger_sha256) {
    fail('Recorded ledger digest does not match captured frozen bytes');
  }
  if (artifacts.traceability.source.report_sha256 !== artifacts.digests.report_sha256) {
    fail('Recorded report digest does not match captured frozen bytes');
  }
  validateTraceability(artifacts.traceability, ledger, artifacts.treeInventory);
  validateAliasDoc(artifacts.aliases, artifacts.pathInventory.entries);
}

function runOneFixture(
  name: string,
  base?: ArtifactSet
): { name: string; rejected: true; error: string } {
  const frozen = loadFrozenInputs();
  const artifacts = clone(base ?? buildArtifacts());
  const ledger = clone(frozen.ledger);
  const fixture = fixtureCases().find((item) => item.name === name);
  assertCondition(fixture, 'Unknown fixture: ' + name);
  let rejected = false;
  let errorMessage = '';
  try {
    fixture.apply(artifacts, ledger);
    if (name.startsWith('merge-missing') || name.startsWith('merge-self') || name.startsWith('merge-cycle')) {
      fail('Merge fixture should have thrown during apply');
    }
    validateBuiltState(artifacts, ledger);
  } catch (error) {
    rejected = true;
    errorMessage = error instanceof Error ? error.message : String(error);
  }
  assertCondition(rejected, 'Negative fixture unexpectedly passed: ' + name);
  return { name, rejected: true, error: errorMessage };
}

function runNegativeFixtures(
  base: ArtifactSet
): Array<{ name: string; category: string; verdict: 'rejected'; error: string }> {
  return fixtureCases().map((fixture) => {
    const result = runOneFixture(fixture.name, base);
    return { name: fixture.name, category: fixture.category, verdict: 'rejected', error: result.error };
  });
}

function writeFixtureDescriptors(): void {
  const dir = path.join(PHASE_DIR, 'fixtures', 'negative');
  fs.mkdirSync(dir, { recursive: true });
  for (const fixture of fixtureCases()) {
    const body = stableJson({
      name: fixture.name,
      category: fixture.category,
      expected_exit: 'non-zero',
      runner: 'node build-traceability.ts --fixture ' + fixture.name
    });
    const destination = path.join(dir, fixture.name + '.json');
    assertWriteTarget(destination);
    fs.writeFileSync(destination, body, 'utf8');
  }
}

function permittedCutOverImpossibleWithoutEvidence(): void {
  const status: StatusFields = {
    library: 'absent',
    shadow: 'not_wired',
    authority: 'cut_over'
  };
  let rejected = false;
  try {
    assertStatusLegal(status, {
      runtime_symbol: absentEvidence(),
      composition_root: absentEvidence(),
      test_evidence: absentEvidence()
    }, 'cut_over');
  } catch {
    rejected = true;
  }
  assertCondition(rejected, 'cut_over was accepted without verified authority evidence');
}

// ───────────────────────────────────────────────────────────────────
// 12. REPORT AND CLI
// ───────────────────────────────────────────────────────────────────

function buildValidationReport(
  first: ArtifactSet,
  second: ArtifactSet,
  fixtures: Array<{ name: string; category: string; verdict: 'rejected'; error: string }>,
  statusMatrix: Array<{ name: string; scalar: CompositionStatus }>
): unknown {
  const frozen = loadFrozenInputs();
  return {
    schema_version: SCHEMA_VERSION,
    verdict: 'PASS',
    source_digests: {
      before: first.digests,
      after: {
        ledger_sha256: frozen.ledgerSha,
        report_sha256: frozen.reportSha
      },
      unchanged: frozen.ledgerSha === first.digests.ledger_sha256 && frozen.reportSha === first.digests.report_sha256
    },
    counts: {
      frozen_source_rows: EXPECTED_SOURCE_ROWS,
      canonical_adoptions: first.traceability.canonical_adoptions.count,
      merged_lineage: first.traceability.merged_lineage.count,
      denominator: first.traceability.canonical_adoptions.denominator,
      lineage_excluded_from_denominator: true
    },
    inherited_contract: first.traceability.inherited_contract,
    status_derivation: {
      published_rows_all_legacy_authoritative: first.traceability.canonical_adoptions.rows.every(
        (row) => row.composition_status === 'legacy_authoritative'
      ),
      permitted_combinations: statusMatrix,
      cut_over_requires_evidence: true
    },
    aliases: {
      count: first.aliases.entries.length,
      entries: first.aliases.entries
    },
    determinism: {
      builds: 2,
      verdict: 'PASS',
      build_1: {
        traceability_sha256: sha256Bytes(first.traceabilityText),
        alias_sha256: sha256Bytes(first.aliasText),
        schema_sha256: sha256Bytes(first.traceabilitySchemaText),
        validation_schema_sha256: sha256Bytes(first.validationSchemaText)
      },
      build_2: {
        traceability_sha256: sha256Bytes(second.traceabilityText),
        alias_sha256: sha256Bytes(second.aliasText),
        schema_sha256: sha256Bytes(second.traceabilitySchemaText),
        validation_schema_sha256: sha256Bytes(second.validationSchemaText)
      }
    },
    negative_fixtures: {
      count: fixtures.length,
      verdict: 'PASS',
      cases: fixtures
    },
    frozen_input_preservation: {
      ledger_sha256: frozen.ledgerSha,
      report_sha256: frozen.reportSha,
      write_access: 'none',
      unchanged: true
    },
    hashes: {
      artifacts: {
        [TRACEABILITY_FILE]: sha256Bytes(first.traceabilityText),
        [ALIAS_FILE]: sha256Bytes(first.aliasText),
        [TRACEABILITY_SCHEMA_FILE]: sha256Bytes(first.traceabilitySchemaText),
        [ALIAS_SCHEMA_FILE]: sha256Bytes(first.aliasSchemaText),
        [INVENTORY_FILE]: sha256Bytes(first.treeInventoryText),
        [PATH_INVENTORY_FILE]: sha256Bytes(first.pathInventoryText),
        [DIGESTS_FILE]: sha256Bytes(first.digestText)
      }
    }
  };
}

function assertDeterministic(first: ArtifactSet, second: ArtifactSet): void {
  const keys: Array<keyof ArtifactSet> = [
    'traceabilityText',
    'aliasText',
    'pathInventoryText',
    'treeInventoryText',
    'digestText',
    'traceabilitySchemaText',
    'aliasSchemaText',
    'validationSchemaText'
  ];
  for (const key of keys) {
    assertCondition(first[key] === second[key], 'Non-deterministic rebuild for ' + key);
  }
}

function listFixtures(): void {
  for (const fixture of fixtureCases()) {
    process.stdout.write(fixture.name + '\n');
  }
}

function main(): void {
  const argument = process.argv[2] || '--verify';
  if (argument === '--list-fixtures') {
    listFixtures();
    return;
  }
  if (argument === '--fixture') {
    const name = process.argv[3];
    assertCondition(name, 'Usage: node build-traceability.ts --fixture <name>');
    const result = runOneFixture(name);
    process.stderr.write('REJECTED ' + result.name + ': ' + result.error + '\n');
    process.exitCode = 1;
    return;
  }
  assertCondition(
    argument === '--write' || argument === '--verify',
    'Usage: node build-traceability.ts [--write|--verify|--fixture <name>|--list-fixtures]'
  );
  const first = buildArtifacts();
  const second = buildArtifacts();
  assertDeterministic(first, second);
  const statusMatrix = exercisePermittedStatusCombinations();
  permittedCutOverImpossibleWithoutEvidence();
  const fixtures = runNegativeFixtures(first);
  const report = buildValidationReport(first, second, fixtures, statusMatrix);
  const reportText = stableJson(report);
  if (argument === '--write') {
    writeArtifacts(first);
    writeFixtureDescriptors();
    writeValidationReport(reportText);
  }
  verifyWritten(first);
  const writtenReport = fs.readFileSync(path.join(PHASE_DIR, VALIDATION_FILE), 'utf8');
  if (argument === '--write') {
    assertCondition(writtenReport === reportText, 'Validation report drift');
  }
  runJsonSchema(path.join(PHASE_DIR, VALIDATION_SCHEMA_FILE), path.join(PHASE_DIR, VALIDATION_FILE));
  const frozen = loadFrozenInputs();
  assertCondition(frozen.ledgerSha === first.digests.ledger_sha256, 'Ledger digest drifted after generation');
  assertCondition(frozen.reportSha === first.digests.report_sha256, 'Report digest drifted after generation');
  process.stdout.write(
    'PASS measurement traceability: canonical=' +
      first.traceability.canonical_adoptions.count +
      ' lineage=' +
      first.traceability.merged_lineage.count +
      ' aliases=' +
      first.aliases.entries.length +
      ' fixtures=' +
      fixtures.length +
      '\n'
  );
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write('FAIL measurement traceability: ' + message + '\n');
    process.exitCode = 1;
  }
}
