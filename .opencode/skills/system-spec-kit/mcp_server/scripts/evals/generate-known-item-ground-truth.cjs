#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const Database = require('better-sqlite3');

const TARGET_QUERY_COUNT = Number.parseInt(process.env.SPECKIT_KNOWN_ITEM_QUERY_COUNT ?? '60', 10);
const DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve('lib/eval/data/ground-truth.json');

const INTENT_TYPES = new Set([
  'add_feature',
  'fix_bug',
  'refactor',
  'security_audit',
  'understand',
  'find_spec',
  'find_decision',
]);

const COMPLEXITY_TIERS = ['simple', 'moderate', 'complex'];
const QUERY_CATEGORIES = [
  'factual',
  'temporal',
  'graph_relationship',
  'cross_document',
  'hard_negative',
  'anchor_based',
  'scope_filtered',
];
const QUERY_SOURCES = ['manual', 'trigger_derived', 'pattern_derived', 'seed'];
const LENGTH_BUCKET_QUOTAS = {
  short: 12,
  medium: 16,
  long: 16,
  xlong: 16,
};

function stableHash(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function normalizeWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeTitle(value) {
  return normalizeWhitespace(value)
    .replace(/\s+\[template:[^\]]+\]/gi, '')
    .replace(/^Feature Specification:\s*/i, '')
    .replace(/^Implementation Plan:\s*/i, '')
    .replace(/^Task Breakdown:\s*/i, '')
    .replace(/^Verification Checklist:\s*/i, '')
    .replace(/^Implementation Summary:\s*/i, '')
    .replace(/^Decision Record:\s*/i, '')
    .replace(/^Description:\s*/i, '')
    .replace(/^Phase\s+\d+:\s*/i, '')
    .replace(/^["']|["']$/g, '')
    .trim();
}

function contentLengthBucket(length) {
  if (length < 900) return 'short';
  if (length < 3_000) return 'medium';
  if (length < 9_000) return 'long';
  return 'xlong';
}

function complexityTier(length) {
  if (length < 1_200) return 'simple';
  if (length < 7_500) return 'moderate';
  return 'complex';
}

function parseJsonArray(raw) {
  if (typeof raw !== 'string' || raw.trim().length === 0) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function extractFrontMatterList(content, key) {
  const lines = String(content ?? '').split(/\r?\n/);
  const out = [];
  let inKey = false;
  for (const line of lines.slice(0, 80)) {
    if (new RegExp(`^${key}:\\s*$`, 'i').test(line)) {
      inKey = true;
      continue;
    }
    if (inKey) {
      const match = line.match(/^\s*-\s*["']?(.+?)["']?\s*$/);
      if (match) {
        out.push(normalizeWhitespace(match[1]));
        continue;
      }
      if (/^\S/.test(line)) break;
    }
  }
  return out.filter(Boolean);
}

function extractFrontMatterScalar(content, key) {
  const lines = String(content ?? '').split(/\r?\n/).slice(0, 80);
  const pattern = new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'i');
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) return normalizeWhitespace(match[1]);
  }
  return '';
}

function subjectForRow(row) {
  const title = normalizeTitle(row.title);
  const description = extractFrontMatterScalar(row.content_text, 'description');
  const stem = path.basename(row.file_path ?? '').replace(/\.(md|json)$/i, '');
  const fallback = row.spec_folder
    ? row.spec_folder.split('/').at(-1)?.replace(/^\d+-/, '').replace(/-/g, ' ')
    : stem.replace(/-/g, ' ');
  const subject = title || normalizeTitle(description) || normalizeTitle(fallback);
  return subject.length > 140 ? `${subject.slice(0, 137).trim()}...` : subject;
}

function triggerPhrasesForRow(row) {
  return [
    ...parseJsonArray(row.trigger_phrases),
    ...extractFrontMatterList(row.content_text, 'trigger_phrases'),
  ]
    .map(normalizeWhitespace)
    .filter((phrase, index, all) => phrase.length > 0 && all.indexOf(phrase) === index);
}

function inferIntent(row) {
  const text = `${row.title ?? ''} ${row.file_path ?? ''} ${row.content_text?.slice(0, 600) ?? ''}`.toLowerCase();
  if (text.includes('decision-record') || text.includes('adr') || text.includes('decision')) return 'find_decision';
  if (text.includes('security') || text.includes('audit') || text.includes('redteam')) return 'security_audit';
  if (text.includes('bug') || text.includes('fix') || text.includes('remediation') || text.includes('regression')) return 'fix_bug';
  if (text.includes('refactor') || text.includes('migration') || text.includes('cleanup')) return 'refactor';
  if (text.includes('implement') || text.includes('feature') || text.includes('add ')) return 'add_feature';
  if (/\b(spec|plan|tasks|checklist|description)\.(md|json)$/i.test(row.file_path ?? '')) return 'find_spec';
  return 'understand';
}

function inferCategory(row) {
  const file = row.file_path ?? '';
  if (/implementation-summary\.md$/i.test(file)) return 'temporal';
  if (/decision-record\.md$/i.test(file)) return 'cross_document';
  if (/checklist\.md$/i.test(file)) return 'anchor_based';
  if (/description\.json$/i.test(file)) return 'factual';
  if (row.spec_folder) return 'scope_filtered';
  return 'factual';
}

function buildQuery(row, index) {
  const subject = subjectForRow(row);
  const triggers = triggerPhrasesForRow(row);
  const fileName = path.basename(row.file_path ?? '');
  let query;
  let source = 'pattern_derived';

  if (triggers.length > 0 && index % 3 === 0) {
    const trigger = triggers[0].replace(/[?.!]+$/g, '');
    query = /^(where|what|how|why|when|which|find)\b/i.test(trigger)
      ? trigger
      : `where is ${trigger} documented`;
    source = 'trigger_derived';
  } else if (/description\.json$/i.test(fileName)) {
    query = `find the description for ${subject}`;
  } else if (/spec\.md$/i.test(fileName)) {
    query = `find the spec for ${subject}`;
  } else if (/plan\.md$/i.test(fileName)) {
    query = `how was ${subject} planned`;
  } else if (/tasks\.md$/i.test(fileName)) {
    query = `what tasks implement ${subject}`;
  } else if (/checklist\.md$/i.test(fileName)) {
    query = `what verification checklist covers ${subject}`;
  } else if (/decision-record\.md$/i.test(fileName)) {
    query = `what decisions govern ${subject}`;
  } else if (/implementation-summary\.md$/i.test(fileName)) {
    query = `what was completed for ${subject}`;
  } else if (fileName.toLowerCase().includes('research') || String(row.file_path ?? '').includes('/research/')) {
    query = `what research explains ${subject}`;
  } else {
    query = `how does ${subject} work`;
  }

  query = normalizeWhitespace(query).replace(/\s+\?/g, '?');
  return {
    query: query.endsWith('?') ? query : query,
    source,
  };
}

function groupKey(row) {
  return [
    row.context_type ?? 'unknown',
    row.source_kind ?? 'unknown',
    row.importance_tier ?? 'unknown',
    contentLengthBucket(row.content_length),
  ].join('|');
}

function selectRows(rows, targetCount) {
  const groups = new Map();
  for (const row of rows) {
    const key = groupKey(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  for (const groupRows of groups.values()) {
    groupRows.sort((left, right) => stableHash(left.id).localeCompare(stableHash(right.id)));
  }

  const keys = [...groups.keys()].sort();
  const selected = [];
  const selectedIds = new Set();

  for (const [bucket, quota] of Object.entries(LENGTH_BUCKET_QUOTAS)) {
    const bucketKeys = keys.filter((key) => key.endsWith(`|${bucket}`));
    while (selected.filter((row) => contentLengthBucket(row.content_length) === bucket).length < quota) {
      let changed = false;
      for (const key of bucketKeys) {
        const groupRows = groups.get(key) ?? [];
        while (groupRows.length > 0) {
          const row = groupRows.shift();
          if (!selectedIds.has(row.id)) {
            selected.push(row);
            selectedIds.add(row.id);
            changed = true;
            break;
          }
        }
        if (selected.filter((row) => contentLengthBucket(row.content_length) === bucket).length >= quota) break;
      }
      if (!changed) break;
    }
  }

  while (selected.length < targetCount) {
    let changed = false;
    for (const key of keys) {
      const groupRows = groups.get(key) ?? [];
      while (groupRows.length > 0) {
        const row = groupRows.shift();
        if (!selectedIds.has(row.id)) {
          selected.push(row);
          selectedIds.add(row.id);
          changed = true;
          break;
        }
      }
      if (selected.length >= targetCount) break;
    }
    if (!changed) break;
  }

  return selected;
}

function ensureUniqueQuery(query, row, seenQueries) {
  let candidate = query;
  if (!seenQueries.has(candidate.toLowerCase())) return candidate;

  const source = normalizeWhitespace(row.source_kind ?? '');
  const context = normalizeWhitespace(row.context_type ?? '');
  const suffix = [context, source].filter(Boolean).join(' ');
  candidate = suffix ? `${query} in ${suffix} memory` : `${query} for memory ${row.id}`;
  if (!seenQueries.has(candidate.toLowerCase())) return candidate;

  return `${candidate} ${row.id}`;
}

function buildDuplicateIndexes(rows) {
  const byHash = new Map();
  const byTitleAndFolder = new Map();

  for (const row of rows) {
    if (row.content_hash) {
      if (!byHash.has(row.content_hash)) byHash.set(row.content_hash, []);
      byHash.get(row.content_hash).push(row);
    }
    const title = normalizeTitle(row.title).toLowerCase();
    if (title && row.spec_folder) {
      const key = `${title}|${row.spec_folder}`;
      if (!byTitleAndFolder.has(key)) byTitleAndFolder.set(key, []);
      byTitleAndFolder.get(key).push(row);
    }
  }

  return { byHash, byTitleAndFolder };
}

function obviousNearDuplicates(row, indexes) {
  const candidates = [];
  if (row.content_hash) {
    for (const duplicate of indexes.byHash.get(row.content_hash) ?? []) {
      if (duplicate.id !== row.id) candidates.push({ row: duplicate, relevance: 2 });
    }
  }

  const title = normalizeTitle(row.title).toLowerCase();
  const titleKey = title && row.spec_folder ? `${title}|${row.spec_folder}` : '';
  if (titleKey) {
    for (const duplicate of indexes.byTitleAndFolder.get(titleKey) ?? []) {
      if (duplicate.id !== row.id) candidates.push({ row: duplicate, relevance: 1 });
    }
  }

  const seen = new Set();
  return candidates
    .filter((candidate) => {
      if (seen.has(candidate.row.id)) return false;
      seen.add(candidate.row.id);
      return true;
    })
    .sort((left, right) => right.relevance - left.relevance || left.row.id - right.row.id)
    .slice(0, 2);
}

function validateDataset(dataset) {
  if (!dataset || !Array.isArray(dataset.queries) || !Array.isArray(dataset.relevances)) {
    throw new Error('Generated dataset does not match the expected top-level schema.');
  }
  for (const query of dataset.queries) {
    if (!Number.isInteger(query.id) || typeof query.query !== 'string' || query.query.length === 0) {
      throw new Error(`Invalid query row: ${JSON.stringify(query)}`);
    }
    if (!INTENT_TYPES.has(query.intentType)) throw new Error(`Invalid intentType: ${query.intentType}`);
    if (!COMPLEXITY_TIERS.includes(query.complexityTier)) throw new Error(`Invalid complexityTier: ${query.complexityTier}`);
    if (!QUERY_CATEGORIES.includes(query.category)) throw new Error(`Invalid category: ${query.category}`);
    if (!QUERY_SOURCES.includes(query.source)) throw new Error(`Invalid source: ${query.source}`);
  }
  const queryIds = new Set(dataset.queries.map((query) => query.id));
  for (const relevance of dataset.relevances) {
    if (!queryIds.has(relevance.queryId)) throw new Error(`Relevance references missing queryId: ${relevance.queryId}`);
    if (!Number.isInteger(relevance.memoryId)) throw new Error(`Invalid memoryId: ${relevance.memoryId}`);
    if (![0, 1, 2, 3].includes(relevance.relevance)) throw new Error(`Invalid relevance: ${relevance.relevance}`);
  }
}

function main() {
  if (!Number.isInteger(TARGET_QUERY_COUNT) || TARGET_QUERY_COUNT <= 0) {
    throw new Error(`Invalid target query count: ${TARGET_QUERY_COUNT}`);
  }

  const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  const rows = db.prepare(`
    SELECT
      id,
      spec_folder,
      file_path,
      title,
      trigger_phrases,
      importance_tier,
      context_type,
      source_kind,
      content_hash,
      near_duplicate_of,
      content_text,
      length(coalesce(content_text, '')) AS content_length
    FROM memory_index
    WHERE parent_id IS NULL
      AND embedding_status = 'success'
      AND deleted_at IS NULL
      AND length(coalesce(content_text, '')) >= 240
    ORDER BY id ASC
  `).all();

  if (rows.length < TARGET_QUERY_COUNT) {
    throw new Error(`Only ${rows.length} active parent rows available; need ${TARGET_QUERY_COUNT}.`);
  }

  const selected = selectRows(rows, TARGET_QUERY_COUNT);
  const duplicateIndexes = buildDuplicateIndexes(rows);
  const queries = [];
  const relevances = [];
  const seenQueries = new Set();

  selected.forEach((row, index) => {
    const id = index + 1;
    const queryParts = buildQuery(row, index);
    const intentType = inferIntent(row);
    const category = inferCategory(row);
    const relativePath = path.relative(process.cwd(), row.file_path ?? '');

    queries.push({
      id,
      query: ensureUniqueQuery(queryParts.query, row, seenQueries),
      intentType,
      complexityTier: complexityTier(row.content_length),
      category,
      source: queryParts.source,
      expectedResultDescription: `Known-item lookup for memory ${row.id}: ${normalizeTitle(row.title)} (${relativePath || row.spec_folder}).`,
      notes: `Generated from active parent memory ${row.id}; content length ${row.content_length}; ${row.context_type ?? 'unknown'} / ${row.source_kind ?? 'unknown'} / ${row.importance_tier ?? 'unknown'}.`,
    });
    seenQueries.add(queries.at(-1).query.toLowerCase());

    relevances.push({
      queryId: id,
      memoryId: row.id,
      relevance: 3,
    });

    for (const duplicate of obviousNearDuplicates(row, duplicateIndexes)) {
      relevances.push({
        queryId: id,
        memoryId: duplicate.row.id,
        relevance: duplicate.relevance,
      });
    }
  });

  const dataset = { queries, relevances };
  validateDataset(dataset);
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(dataset, null, 2)}\n`);

  const distribution = queries.reduce((acc, query) => {
    acc.intentType[query.intentType] = (acc.intentType[query.intentType] ?? 0) + 1;
    acc.complexityTier[query.complexityTier] = (acc.complexityTier[query.complexityTier] ?? 0) + 1;
    acc.category[query.category] = (acc.category[query.category] ?? 0) + 1;
    acc.source[query.source] = (acc.source[query.source] ?? 0) + 1;
    return acc;
  }, { intentType: {}, complexityTier: {}, category: {}, source: {} });

  console.log(JSON.stringify({
    outputPath: OUTPUT_PATH,
    dbPath: DB_PATH,
    activeParentRows: rows.length,
    queries: queries.length,
    relevances: relevances.length,
    exactKnownItems: selected.length,
    nearDuplicateLabels: relevances.length - selected.length,
    distribution,
  }, null, 2));
}

main();
