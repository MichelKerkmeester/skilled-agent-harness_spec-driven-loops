#!/usr/bin/env node
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const VALID_TIERS = new Set(['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated']);
const DOCS = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md', 'implementation-summary.md', 'research/research.md', 'research.md', 'handover.md', 'resource-map.md'];
const GRAPH = 'graph-metadata.json';
const DEFAULT_SCAN_LOG = '/tmp/scan-stdout.log';
const DB_PATH = '.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite';

function args(argv) {
  const out = { dryRun: false, root: '.opencode/specs', scanLog: DEFAULT_SCAN_LOG, lineage: true };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--dry-run') out.dryRun = true;
    else if (argv[i] === '--root') out.root = argv[++i] ?? out.root;
    else if (argv[i] === '--scan-log') out.scanLog = argv[++i] ?? out.scanLog;
    else if (argv[i] === '--no-lineage') out.lineage = false;
    else if (argv[i] === '--help' || argv[i] === '-h') {
      console.log('Usage: node repair-graph-metadata.mjs [--dry-run] [--root .opencode/specs] [--scan-log /tmp/scan-stdout.log] [--no-lineage]');
      process.exit(0);
    }
  }
  return out;
}

function repoRoot() {
  let current = process.cwd();
  while (true) {
    if (fs.existsSync(path.join(current, '.opencode', 'specs'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return process.cwd();
    current = parent;
  }
}

const posix = (value) => value.replace(/\\/g, '/');
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const isIso = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value);
const tier = (value) => value === 'high' ? 'important' : (VALID_TIERS.has(value) ? value : 'normal');

function unique(values, limit = Infinity) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
    if (out.length >= limit) break;
  }
  return out;
}

function status(value) {
  if (typeof value !== 'string' || !value.trim()) return 'planned';
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (normalized === 'done' || normalized === 'completed') return 'complete';
  if (normalized === 'active') return 'in_progress';
  return normalized;
}

function scanText(scanLog) {
  if (!fs.existsSync(scanLog)) return null;
  const raw = fs.readFileSync(scanLog, 'utf8');
  const match = raw.match(/"text":"([\s\S]*)"\}\],"isError"/);
  return match ? JSON.parse(`"${match[1]}"`) : raw;
}

function scanFailures(scanLog) {
  const text = scanText(scanLog);
  if (!text) return { graph: new Map(), lineageIds: [] };
  let parsed;
  try { parsed = JSON.parse(text); } catch { return { graph: new Map(), lineageIds: [] }; }
  const graph = new Map();
  const lineageIds = new Set();
  for (const file of parsed?.data?.files ?? []) {
    const detail = file.errorDetail ?? file.rejectionReason ?? '';
    if ((file.status === 'failed' || file.status === 'rejected') && path.basename(file.filePath ?? '') === GRAPH) {
      graph.set(path.resolve(file.filePath), detail || 'scan reported graph metadata failure');
    }
    const match = detail.match(/E_LINEAGE: predecessor (\d+) logical identity/);
    if (match) lineageIds.add(Number(match[1]));
  }
  return { graph, lineageIds: [...lineageIds].sort((a, b) => a - b) };
}

function graphFiles(root) {
  const out = [];
  const skip = new Set(['node_modules', '.git', 'scratch', 'memory']);
  function walk(current) {
    let entries = [];
    try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!skip.has(entry.name) && !entry.name.startsWith('.')) walk(next);
      } else if (entry.isFile() && entry.name === GRAPH && fs.existsSync(path.join(current, 'spec.md'))) {
        out.push(next);
      }
    }
  }
  walk(root);
  return out.sort();
}

function folderId(file, specsRoot) {
  return posix(path.relative(specsRoot, path.dirname(file)));
}

function parentId(specFolder, specsRoot) {
  const parts = specFolder.split('/');
  for (let end = parts.length - 1; end > 0; end -= 1) {
    const candidate = parts.slice(0, end).join('/');
    if (fs.existsSync(path.join(specsRoot, candidate, 'spec.md'))) return candidate;
  }
  return null;
}

function childrenIds(folder, specsRoot) {
  let entries = [];
  try { entries = fs.readdirSync(folder, { withFileTypes: true }); } catch { return []; }
  return entries
    .filter((entry) => entry.isDirectory() && /^\d{3}(?:[-_].+)?$/.test(entry.name))
    .map((entry) => path.join(folder, entry.name))
    .filter((child) => fs.existsSync(path.join(child, GRAPH)))
    .map((child) => posix(path.relative(specsRoot, child)))
    .sort();
}

function docHints(folder) {
  const sourceDocs = [];
  let joined = '';
  for (const doc of DOCS) {
    const file = path.join(folder, doc);
    if (!fs.existsSync(file)) continue;
    sourceDocs.push(posix(doc));
    joined += `\n${fs.readFileSync(file, 'utf8')}`;
  }
  const title = joined.match(/^title:\s*["']?([^"'\n]+)["']?/m)?.[1] ?? joined.match(/^#\s+(.+)$/m)?.[1] ?? null;
  const description = joined.match(/^description:\s*["']?([^"'\n]+)["']?/m)?.[1] ?? null;
  const triggerPhrases = [...joined.matchAll(/trigger_phrases:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => match[1].split(',').map((value) => value.replace(/^['"\s]+|['"\s]+$/g, '')));
  return {
    title,
    description,
    triggerPhrases: unique(triggerPhrases, 12),
    importanceTier: joined.match(/^importance_tier:\s*["']?([^"'\n]+)["']?/m)?.[1] ?? null,
    status: joined.match(/^status:\s*["']?([^"'\n]+)["']?/im)?.[1] ?? null,
    sourceDocs,
  };
}

function words(...inputs) {
  const stop = new Set(['the', 'and', 'for', 'with', 'from', 'this', 'that', 'into', 'spec', 'phase', 'packet']);
  return unique(inputs.filter(Boolean).join(' ').toLowerCase().split(/[^a-z0-9._-]+/).filter((token) => token.length >= 3 && !stop.has(token)), 12);
}

function cleanName(specFolder) {
  return path.basename(specFolder).replace(/^\d{3}[-_]/, '').replace(/[-_]+/g, ' ').replace(/\b\d{3}\b/g, '').replace(/\s+/g, ' ').trim() || 'current packet';
}

function schemaIssues(data) {
  const d = data?.derived;
  const issues = [];
  if (data?.schema_version !== 1) issues.push('schema_version');
  if (typeof data?.packet_id !== 'string' || !data.packet_id.trim()) issues.push('packet_id');
  if (typeof data?.spec_folder !== 'string' || !data.spec_folder.trim()) issues.push('spec_folder');
  if (!(typeof data?.parent_id === 'string' || data?.parent_id === null)) issues.push('parent_id');
  if (!Array.isArray(data?.children_ids)) issues.push('children_ids');
  if (!data?.manual || typeof data.manual !== 'object') issues.push('manual');
  for (const key of ['trigger_phrases', 'key_topics', 'key_files', 'entities', 'source_docs']) {
    if (!Array.isArray(d?.[key])) issues.push(`derived.${key}`);
  }
  for (const key of ['importance_tier', 'status', 'causal_summary', 'created_at', 'last_save_at']) {
    if (typeof d?.[key] !== 'string') issues.push(`derived.${key}`);
  }
  if (!VALID_TIERS.has(d?.importance_tier)) issues.push('derived.importance_tier.enum');
  if (!isIso(d?.created_at)) issues.push('derived.created_at.iso');
  if (!isIso(d?.last_save_at)) issues.push('derived.last_save_at.iso');
  if (!(d?.last_accessed_at === null || isIso(d?.last_accessed_at))) issues.push('derived.last_accessed_at');
  return issues;
}

function refs(values) {
  if (!Array.isArray(values)) return [];
  return values.filter((entry) => entry && typeof entry === 'object' && typeof entry.packet_id === 'string' && entry.packet_id.trim())
    .map((entry) => ({
      packet_id: entry.packet_id.trim(),
      reason: typeof entry.reason === 'string' && entry.reason.trim() ? entry.reason.trim() : 'Imported relationship',
      source: typeof entry.source === 'string' && entry.source.trim() ? entry.source.trim() : 'repair-graph-metadata',
      ...(typeof entry.spec_folder === 'string' && entry.spec_folder.trim() ? { spec_folder: entry.spec_folder.trim() } : {}),
      ...(typeof entry.title === 'string' && entry.title.trim() ? { title: entry.title.trim() } : {}),
    }));
}

function cleanKeyFiles(values, specFolder) {
  return unique(values, 40).filter((value) => {
    const normalized = posix(value);
    if (/^(spec|plan|tasks|checklist|decision-record|implementation-summary|research|handover|resource-map)\.md$/.test(normalized)) return true;
    if (normalized === 'research/research.md') return true;
    if (normalized.startsWith('.opencode/specs/') || normalized.startsWith('specs/')) return normalized.includes(`/${specFolder}/`);
    return !/^\d{3}[-_][a-z0-9._-]+\/.+/.test(normalized);
  }).slice(0, 20);
}

function cleanEntities(values, specFolder) {
  if (!Array.isArray(values)) return [];
  return values.map((entry) => ({
    name: String(entry?.name ?? '').trim(),
    kind: String(entry?.kind ?? 'unknown').trim(),
    path: String(entry?.path ?? '').trim(),
    source: String(entry?.source ?? 'derived').trim(),
  })).filter((entry) => entry.name && entry.kind && entry.path && entry.source)
    .filter((entry) => {
      const normalized = posix(entry.path);
      return !(normalized.startsWith('.opencode/specs/') || normalized.startsWith('specs/')) || normalized.includes(`/${specFolder}/`);
    })
    .slice(0, 24);
}

function repairGraph(file, specsRoot, now, failedGraph) {
  const original = fs.readFileSync(file, 'utf8');
  let existing = {};
  let parseError = null;
  try { existing = JSON.parse(original); } catch (error) { parseError = error.message; }
  const folder = path.dirname(file);
  const specFolder = folderId(file, specsRoot);
  const reason = failedGraph.get(path.resolve(file)) ?? '';
  const compact = reason.includes('V-rule hard block: V8');
  const hints = docHints(folder);
  const d = existing.derived && typeof existing.derived === 'object' ? existing.derived : {};
  const issuesBefore = parseError ? ['json_parse'] : schemaIssues(existing);
  const fallbackTopics = words(specFolder, hints.title, hints.description, d.causal_summary, existing.title);
  const sourceDocs = unique([...(Array.isArray(d.source_docs) ? d.source_docs : []), ...hints.sourceDocs]);
  const localName = cleanName(specFolder);
  const repaired = {
    schema_version: 1,
    packet_id: compact ? specFolder : (typeof existing.packet_id === 'string' && existing.packet_id.trim() ? existing.packet_id.trim() : specFolder),
    spec_folder: compact ? specFolder : specFolder,
    parent_id: parentId(specFolder, specsRoot),
    children_ids: childrenIds(folder, specsRoot),
    ...(existing.migrated === true || existing.schema_version !== 1 ? { migrated: true, migration_source: 'legacy' } : {}),
    manual: compact ? { depends_on: [], supersedes: [], related_to: [] } : {
      depends_on: refs(existing.manual?.depends_on),
      supersedes: refs(existing.manual?.supersedes),
      related_to: refs(existing.manual?.related_to),
    },
    derived: {
      trigger_phrases: compact ? unique([localName, `${localName} graph metadata`], 12) : unique([...(Array.isArray(d.trigger_phrases) ? d.trigger_phrases : []), ...hints.triggerPhrases, specFolder, ...fallbackTopics], 12),
      key_topics: compact ? words(localName) : unique([...(Array.isArray(d.key_topics) ? d.key_topics : []), ...fallbackTopics], 12),
      importance_tier: tier(d.importance_tier ?? hints.importanceTier),
      status: status(d.status ?? existing.status ?? hints.status),
      key_files: compact ? hints.sourceDocs : cleanKeyFiles([...(Array.isArray(d.key_files) ? d.key_files : []), ...hints.sourceDocs], specFolder),
      entities: compact ? [] : cleanEntities(d.entities, specFolder),
      causal_summary: compact ? 'Graph metadata for the current packet.' : String(d.causal_summary ?? existing.summary ?? hints.description ?? hints.title ?? `Packet metadata for ${specFolder}.`).trim(),
      created_at: isIso(d.created_at) ? d.created_at : fs.statSync(file).mtime.toISOString(),
      last_save_at: isIso(d.last_save_at ?? existing.updated_at) ? (d.last_save_at ?? existing.updated_at) : now,
      ...(typeof d.save_lineage === 'string' && ['description_only', 'graph_only', 'same_pass'].includes(d.save_lineage) ? { save_lineage: d.save_lineage } : {}),
      last_accessed_at: d.last_accessed_at === null || isIso(d.last_accessed_at) ? d.last_accessed_at : null,
      source_docs: sourceDocs,
    },
  };
  const fixes = [];
  if (parseError) fixes.push('parse_error_rewritten');
  if (issuesBefore.includes('schema_version')) fixes.push('schema_v1_upgrade');
  if (d.importance_tier === 'high') fixes.push('importance_high_to_important');
  if (issuesBefore.some((issue) => issue.startsWith('derived.') || ['packet_id', 'spec_folder', 'parent_id', 'children_ids', 'manual'].includes(issue))) fixes.push('required_fields_normalized');
  if (reason && fixes.length === 0) fixes.push('scan_reported_graph_metadata_normalized');
  if (compact) fixes.push('v8_foreign_reference_compaction');
  const content = json(repaired);
  return { filePath: file, changed: fixes.length > 0 && content !== original, content, fixes, issuesBefore, issuesAfter: schemaIssues(repaired) };
}

function sqliteJson(db, sql) {
  const out = execFileSync('sqlite3', ['-json', db, sql], { encoding: 'utf8' }).trim();
  return out ? JSON.parse(out) : [];
}

const sql = (value) => value == null ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`;

function scope(row) {
  const tuple = [['tenant', row.tenant_id], ['user', row.user_id], ['agent', row.agent_id], ['session', row.session_id]]
    .filter((entry) => typeof entry[1] === 'string' && entry[1].trim());
  return tuple.length ? `scope-sha256:${crypto.createHash('sha256').update(JSON.stringify(tuple)).digest('hex').slice(0, 24)}` : null;
}

function logicalKey(row) {
  const canonicalPath = String(row.canonical_file_path || row.file_path).replace(/\\/g, '/');
  const anchorId = typeof row.anchor_id === 'string' && row.anchor_id.trim() ? row.anchor_id.trim() : '_';
  const prefix = scope(row);
  if ([row.spec_folder, canonicalPath, anchorId].some((part) => String(part).includes('::'))) {
    return `logical-sha256:${crypto.createHash('sha256').update(JSON.stringify({ version: 2, specFolder: row.spec_folder, scopePrefix: prefix, canonicalPath, anchorId })).digest('hex')}`;
  }
  return prefix ? `${row.spec_folder}::${prefix}::${canonicalPath}::${anchorId}` : `${row.spec_folder}::${canonicalPath}::${anchorId}`;
}

function repairLineage(db, ids, dryRun, backupDir) {
  const out = { candidates: ids.length, changed: 0, skipped: 0, failures: [] };
  if (ids.length === 0 || !fs.existsSync(db)) return out;
  if (!dryRun) {
    for (const suffix of ['', '-wal', '-shm']) {
      const source = `${db}${suffix}`;
      if (fs.existsSync(source)) fs.copyFileSync(source, path.join(backupDir, path.basename(source)));
    }
  }
  for (const id of ids) {
    try {
      const rows = sqliteJson(db, `SELECT id, spec_folder, file_path, canonical_file_path, anchor_id, tenant_id, user_id, agent_id, session_id, updated_at FROM memory_index WHERE id = ${id};`);
      const lineageRows = sqliteJson(db, `SELECT memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id FROM memory_lineage WHERE memory_id = ${id};`);
      if (rows.length !== 1 || lineageRows.length !== 1 || lineageRows[0].version_number !== 1 || lineageRows[0].predecessor_memory_id !== null) {
        out.skipped += 1;
        continue;
      }
      const nextKey = logicalKey(rows[0]);
      if (nextKey === lineageRows[0].logical_key && lineageRows[0].root_memory_id === id) {
        out.skipped += 1;
        continue;
      }
      out.changed += 1;
      if (dryRun) continue;
      const updatedAt = rows[0].updated_at || new Date().toISOString();
      execFileSync('sqlite3', [db, `
        BEGIN;
        DELETE FROM active_memory_projection WHERE logical_key = ${sql(lineageRows[0].logical_key)};
        DELETE FROM active_memory_projection WHERE active_memory_id = ${id} AND logical_key != ${sql(nextKey)};
        UPDATE memory_lineage SET logical_key = ${sql(nextKey)}, root_memory_id = ${id} WHERE memory_id = ${id};
        INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
        VALUES (${sql(nextKey)}, ${id}, ${id}, ${sql(updatedAt)})
        ON CONFLICT(logical_key) DO UPDATE SET root_memory_id = excluded.root_memory_id, active_memory_id = excluded.active_memory_id, updated_at = excluded.updated_at;
        COMMIT;
      `]);
    } catch (error) {
      out.failures.push({ id, error: error.message });
    }
  }
  return out;
}

function run() {
  const options = args(process.argv.slice(2));
  const root = repoRoot();
  const specsRoot = path.resolve(root, options.root);
  const now = new Date().toISOString();
  const backupDir = path.join(os.tmpdir(), `repair-graph-metadata-${now.replace(/[:.]/g, '-')}`);
  const scan = scanFailures(options.scanLog);
  const repairs = graphFiles(specsRoot).map((file) => repairGraph(file, specsRoot, now, scan.graph));
  const changed = repairs.filter((repair) => repair.changed);
  const failed = repairs.filter((repair) => repair.issuesAfter.length > 0);
  if (!options.dryRun && (changed.length > 0 || (options.lineage && scan.lineageIds.length > 0))) fs.mkdirSync(backupDir, { recursive: true });
  if (!options.dryRun) {
    for (const repair of changed) {
      const backup = path.join(backupDir, path.relative(root, repair.filePath));
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      fs.copyFileSync(repair.filePath, backup);
      fs.writeFileSync(repair.filePath, repair.content);
    }
  }
  const lineage = options.lineage ? repairLineage(path.resolve(root, DB_PATH), scan.lineageIds, options.dryRun, backupDir) : { candidates: 0, changed: 0, skipped: 0, failures: [] };
  const fixCounts = {};
  for (const repair of changed) for (const fix of repair.fixes) fixCounts[fix] = (fixCounts[fix] ?? 0) + 1;
  const report = {
    dryRun: options.dryRun,
    root: specsRoot,
    backupDir: options.dryRun ? null : backupDir,
    graphMetadata: {
      scanned: repairs.length,
      scanFailedGraphMetadataFiles: scan.graph.size,
      changed: changed.length,
      failedValidationAfterRepair: failed.length,
      fixes: fixCounts,
      failures: failed.slice(0, 20).map((repair) => ({ filePath: path.relative(root, repair.filePath), issuesAfter: repair.issuesAfter })),
      changedFiles: changed.map((repair) => path.relative(root, repair.filePath)),
    },
    lineage,
    beforeAfter: {
      graphFilesNeedingRepairBefore: repairs.filter((repair) => repair.issuesBefore.length > 0 || repair.fixes.length > 0).length,
      graphFilesNeedingRepairAfter: failed.length,
      lineageRowsNeedingRepairBefore: lineage.candidates,
      lineageRowsNeedingRepairAfter: lineage.failures.length,
    },
  };
  console.log(JSON.stringify(report, null, 2));
  if (failed.length > 0 || lineage.failures.length > 0) process.exitCode = 2;
}

run();
