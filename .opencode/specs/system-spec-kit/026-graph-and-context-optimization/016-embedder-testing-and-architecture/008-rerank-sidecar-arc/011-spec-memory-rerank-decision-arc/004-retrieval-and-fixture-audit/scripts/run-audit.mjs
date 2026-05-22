import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] ?? process.cwd());
const packetDir = path.join(root, '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit');
const arcDir = path.dirname(packetDir);
const mcpDir = path.join(root, '.opencode/skills/system-spec-kit/mcp_server');
const evidenceDir = path.join(packetDir, 'evidence');
const fixturePath = path.join(mcpDir, 'benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json');
const dbPath = path.join(mcpDir, 'database/context-index.sqlite');
const offEvidencePath = path.join(arcDir, '001-off-baseline-audit/evidence/off-baseline-2026-05-21.json');
const bgeEvidencePath = path.join(arcDir, '002-bge-v2-m3-trial/evidence/bge-v2-m3-bench-2026-05-21.json');
const ipcSocketPath = path.join(mcpDir, 'database/daemon-ipc.sock');

process.env.SPEC_KIT_DB_DIR = path.join(mcpDir, 'database');
process.env.MEMORY_DB_PATH = dbPath;
process.env.EMBEDDINGS_PROVIDER = 'ollama';
process.env.OLLAMA_EMBEDDINGS_MODEL = 'nomic-embed-text-v1.5';
process.env.SPECKIT_SKIP_API_VALIDATION = 'true';
process.env.SPECKIT_RESPONSE_PROFILE_V1 = 'false';
process.env.SPECKIT_INTENT_AUTO_PROFILE = 'false';
process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1 = 'false';
process.env.SPECKIT_FILE_WATCHER = 'false';
process.env.SPECKIT_EVAL_LOGGING = 'false';
process.env.SPECKIT_CROSS_ENCODER = 'false';
process.env.RERANKER_LOCAL = 'false';

fs.mkdirSync(evidenceDir, { recursive: true });
const require = createRequire(path.join(mcpDir, 'package.json'));
const Database = require('better-sqlite3');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function shortDocId(docId) {
  return String(docId ?? '').replace(/^specs\//, '').replace(/^\.opencode\/specs\//, '');
}

function rowDocId(row) {
  const canonical = row.canonical_file_path ?? row.canonicalFilePath ?? row.file_path ?? row.filePath;
  return shortDocId(canonical);
}

function rankOf(ids, id) {
  const idx = ids.findIndex((candidate) => String(candidate) === String(id));
  return idx === -1 ? null : idx + 1;
}

function hasTop(rank, n) {
  return rank !== null && rank <= n;
}

function summarizeCounts(rows, key) {
  const counts = {};
  for (const row of rows) counts[row[key]] = (counts[row[key]] ?? 0) + 1;
  return counts;
}

function summarizeByCategory(rows, classKey = 'class') {
  const out = {};
  for (const row of rows) {
    const category = row.category ?? 'unknown';
    out[category] ??= {};
    out[category][row[classKey]] = (out[category][row[classKey]] ?? 0) + 1;
  }
  return out;
}

function metricSummary(rows) {
  const n = rows.length || 1;
  return {
    count: rows.length,
    hit_rate_at_5: rows.filter((row) => row.hit_at_5).length / n,
    recall_at_5: rows.reduce((sum, row) => sum + row.recall_at_5, 0) / n,
    ndcg_at_10: rows.reduce((sum, row) => sum + row.ndcg_at_10, 0) / n,
  };
}

async function importMcp(relativePath) {
  return import(pathToFileURL(path.join(mcpDir, relativePath)).href);
}

async function ollamaEmbedding(query) {
  const response = await fetch('http://localhost:11434/api/embed', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'nomic-embed-text:v1.5', input: query }),
  });
  if (!response.ok) {
    throw new Error(`Ollama embedding failed: ${response.status} ${response.statusText}`);
  }
  const body = await response.json();
  const vector = body.embeddings?.[0];
  if (!Array.isArray(vector) || vector.length !== 768) {
    throw new Error(`Ollama embedding returned invalid vector length ${vector?.length}`);
  }
  return Float32Array.from(vector);
}

async function sidecarRerank(query, rows) {
  const documents = rows.map((row) => row.content_text ?? row.content ?? row.file_path ?? '');
  const response = await fetch('http://localhost:8765/rerank', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'BAAI/bge-reranker-v2-m3',
      query,
      documents,
    }),
  });
  if (!response.ok) {
    throw new Error(`Sidecar rerank failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function classifyProbes(fixture, db) {
  const byId = db.prepare(`
    SELECT id, spec_folder, file_path, canonical_file_path, title, document_type, parent_id
    FROM memory_index
    WHERE id = ?
  `);
  const byDoc = db.prepare(`
    SELECT id, spec_folder, file_path, canonical_file_path, title, document_type, parent_id
    FROM memory_index
    WHERE canonical_file_path = ?
       OR file_path = ?
       OR canonical_file_path = ?
       OR file_path = ?
    ORDER BY id DESC
    LIMIT 1
  `);
  return fixture.probes.map((probe) => {
    const original = probe.gold_memory_ids?.[0] ?? null;
    const goldDoc = probe.gold_doc_ids?.[0] ?? null;
    const midRow = original == null ? null : byId.get(original);
    const normalizedDoc = shortDocId(goldDoc);
    const docRow = goldDoc
      ? byDoc.get(goldDoc, goldDoc, normalizedDoc, `specs/${normalizedDoc}`)
      : null;
    let classification = 'unusable';
    let resolvedMemoryId = null;
    if (midRow) {
      classification = 'valid';
      resolvedMemoryId = midRow.id;
    } else if (docRow) {
      classification = 'replaced';
      resolvedMemoryId = docRow.id;
    } else if (goldDoc) {
      classification = 'stale';
    }
    return {
      probe_id: probe.id,
      query: probe.query,
      category: probe.category,
      difficulty: probe.difficulty,
      class: classification,
      original_gold_memory_id: original,
      gold_doc_id: goldDoc,
      resolved_memory_id: resolvedMemoryId,
      resolved_doc_id: docRow ? rowDocId(docRow) : midRow ? rowDocId(midRow) : null,
      resolution_note: midRow
        ? 'gold_memory_id resolved'
        : docRow
          ? 'gold_memory_id missing; gold_doc_id resolved to current memory row'
          : 'gold_memory_id missing; no current row matched gold_doc_id',
    };
  });
}

async function directHandlerTop20(probe, handleMemorySearch) {
  const response = await handleMemorySearch({
    query: probe.query,
    limit: 20,
    mode: 'deep',
    rerank: false,
    includeContent: false,
    includeTrace: false,
    bypassCache: true,
    trackAccess: false,
  });
  const envelope = JSON.parse(response.content[0].text);
  const results = envelope.data?.results ?? [];
  return results.map((row) => ({
    id: row.id,
    file_path: row.file_path ?? row.filePath ?? null,
    score: row.score ?? null,
  }));
}

async function canConnectSocket(socketPath) {
  if (!fs.existsSync(socketPath)) return false;
  return new Promise((resolve) => {
    const socket = net.createConnection(socketPath);
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 1000);
    socket.once('connect', () => {
      clearTimeout(timer);
      socket.end();
      resolve(true);
    });
    socket.once('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

function computeNdcg(rank) {
  return rank !== null && rank <= 10 ? 1 / Math.log2(rank + 1) : 0;
}

function computeMetrics(classification, offEvidence) {
  const classByProbe = new Map(classification.rows.map((row) => [row.probe_id, row]));
  const rows = [];
  for (const probe of offEvidence.probes) {
    const cls = classByProbe.get(probe.fixture_id);
    if (!cls || !['valid', 'replaced'].includes(cls.class)) continue;
    const returnedMemoryIds = probe.returned_memory_ids ?? [];
    const returnedDocIds = (probe.returned_doc_ids ?? []).map(shortDocId);
    const memoryRank = cls.resolved_memory_id == null ? null : rankOf(returnedMemoryIds, cls.resolved_memory_id);
    const docRank = cls.gold_doc_id == null ? null : rankOf(returnedDocIds, shortDocId(cls.gold_doc_id));
    const rank = [memoryRank, docRank].filter((value) => value !== null).sort((a, b) => a - b)[0] ?? null;
    rows.push({
      probe_id: probe.fixture_id,
      category: cls.category,
      class: cls.class,
      resolved_memory_id: cls.resolved_memory_id,
      rank_at_5: rank !== null && rank <= 5 ? rank : null,
      rank_at_10: rank !== null && rank <= 10 ? rank : null,
      hit_at_5: rank !== null && rank <= 5,
      recall_at_5: rank !== null && rank <= 5 ? 1 : 0,
      ndcg_at_10: computeNdcg(rank),
    });
  }
  const perCategory = {};
  for (const category of [...new Set(rows.map((row) => row.category))].sort()) {
    perCategory[category] = metricSummary(rows.filter((row) => row.category === category));
  }
  return {
    generated_at: new Date().toISOString(),
    source: 'Recomputed from Phase 1 OFF returned_memory_ids/returned_doc_ids over valid+replaced subset',
    subset: 'valid+replaced',
    summary: metricSummary(rows),
    phase1_off_summary: offEvidence.summary,
    delta_vs_phase1_off: {
      hit_rate_at_5: metricSummary(rows).hit_rate_at_5 - offEvidence.summary.hit_rate_at_5,
      recall_at_5: metricSummary(rows).recall_at_5 - offEvidence.summary.recall_at_5,
      ndcg_at_10: metricSummary(rows).ndcg_at_10 - offEvidence.summary.ndcg_at_10,
    },
    per_category: perCategory,
    probes: rows,
  };
}

function laneStats(rows) {
  const denomin = rows.length || 1;
  const lanes = ['fts5', 'vector', 'fused', 'final_pool'];
  const out = {};
  for (const lane of lanes) {
    out[lane] = {};
    for (const n of [20, 50, 100]) {
      out[lane][`top_${n}`] = rows.filter((row) => row.coverage[lane]?.[`top_${n}`]).length / denomin;
    }
  }
  return out;
}

async function main() {
  const fixture = readJson(fixturePath);
  const offEvidence = readJson(offEvidencePath);
  const bgeEvidence = readJson(bgeEvidencePath);
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const classificationRows = classifyProbes(fixture, db);
  const classification = {
    generated_at: new Date().toISOString(),
    fixture_path: path.relative(root, fixturePath),
    db_path: path.relative(root, dbPath),
    summary: {
      total: classificationRows.length,
      counts_by_class: summarizeCounts(classificationRows, 'class'),
      counts_by_category_and_class: summarizeByCategory(classificationRows),
    },
    rows: classificationRows,
  };
  writeJson(path.join(evidenceDir, 'probe-classification-2026-05-21.json'), classification);
  db.close();

  process.chdir(mcpDir);
  const vectorIndex = await importMcp('dist/lib/search/vector-index.js');
  const hybridSearch = await importMcp('dist/lib/search/hybrid-search.js');
  const { executeStage2 } = await importMcp('dist/lib/search/pipeline/stage2-fusion.js');
  const { handleMemorySearch } = await importMcp('dist/handlers/memory-search.js');
  vectorIndex.initializeDb();
  hybridSearch.init(vectorIndex.getDb(), vectorIndex.vectorSearch, null);

  const usable = classificationRows.filter((row) => ['valid', 'replaced'].includes(row.class));
  const coverageRows = [];
  const rerankRows = [];
  for (const [index, probeClass] of usable.entries()) {
    const probe = fixture.probes.find((candidate) => candidate.id === probeClass.probe_id);
    const embedding = await ollamaEmbedding(probe.query);
    const fts = hybridSearch.ftsSearch(probe.query, { limit: 100, includeArchived: false });
    const vector = vectorIndex.vectorSearch(embedding, {
      limit: 100,
      includeArchived: false,
      includeConstitutional: false,
    });
    const fused = await hybridSearch.collectRawCandidates(probe.query, embedding, {
      limit: 100,
      includeArchived: false,
    });
    const stage2 = await executeStage2({
      candidates: fused,
      config: {
        query: probe.query,
        searchType: 'hybrid',
        limit: 100,
        includeArchived: false,
        includeConstitutional: false,
        includeContent: true,
        rerank: false,
        applyLengthPenalty: false,
        trackAccess: false,
        enableSessionBoost: false,
        enableCausalBoost: false,
      },
      stage1Metadata: {},
    });
    const finalPool = stage2.scored.slice(0, 100);
    const ranks = {
      fts5: rankOf(fts.map((row) => row.id), probeClass.resolved_memory_id),
      vector: rankOf(vector.map((row) => row.id), probeClass.resolved_memory_id),
      fused: rankOf(fused.map((row) => row.id), probeClass.resolved_memory_id),
      final_pool: rankOf(finalPool.map((row) => row.id), probeClass.resolved_memory_id),
    };
    const coverage = {};
    for (const [lane, rank] of Object.entries(ranks)) {
      coverage[lane] = {
        rank,
        top_20: hasTop(rank, 20),
        top_50: hasTop(rank, 50),
        top_100: hasTop(rank, 100),
      };
    }
    coverageRows.push({
      probe_id: probe.id,
      category: probe.category,
      class: probeClass.class,
      original_gold_memory_id: probeClass.original_gold_memory_id,
      resolved_memory_id: probeClass.resolved_memory_id,
      candidate_counts: {
        fts5: fts.length,
        vector: vector.length,
        fused: fused.length,
        final_pool: finalPool.length,
      },
      coverage,
      top_ids: {
        fts5: fts.slice(0, 100).map((row) => row.id),
        vector: vector.slice(0, 100).map((row) => row.id),
        fused: fused.slice(0, 100).map((row) => row.id),
        final_pool: finalPool.slice(0, 100).map((row) => row.id),
      },
    });

    const rerankCandidates = finalPool.slice(0, 30);
    const preTop5 = rerankCandidates.slice(0, 5).map((row) => row.id);
    let rerankBody = null;
    let rerankError = null;
    try {
      rerankBody = await sidecarRerank(probe.query, rerankCandidates);
    } catch (error) {
      rerankError = error instanceof Error ? error.message : String(error);
    }
    const scored = rerankCandidates.map((row, pos) => {
      const match = rerankBody?.results?.find((item) => item.index === pos);
      const raw = typeof match?.relevance_score === 'number' ? match.relevance_score : null;
      const stage2Score = typeof row.score === 'number' ? row.score : 0;
      const blended = raw == null ? stage2Score : (stage2Score * 0.8) + (raw * 0.2);
      return {
        memory_id: row.id,
        pre_pos: pos + 1,
        stage2_score: stage2Score,
        raw_rerank_sigmoid: raw,
        blended_score_weight_0_20: blended,
      };
    }).sort((a, b) => b.blended_score_weight_0_20 - a.blended_score_weight_0_20)
      .map((row, pos) => ({ ...row, post_pos: pos + 1, delta: (pos + 1) - row.pre_pos }));
    const postTop5 = scored.slice(0, 5).map((row) => row.memory_id);
    rerankRows.push({
      probe_id: probe.id,
      category: probe.category,
      class: probeClass.class,
      resolved_memory_id: probeClass.resolved_memory_id,
      rerank_error: rerankError,
      rerank_model: rerankBody?.model ?? 'BAAI/bge-reranker-v2-m3',
      latency_ms: rerankBody?.latency_ms ?? null,
      pre_top5: preTop5,
      post_top5: postTop5,
      reranker_changed_top5: JSON.stringify(preTop5) !== JSON.stringify(postTop5),
      gold_pre_pos: rankOf(rerankCandidates.map((row) => row.id), probeClass.resolved_memory_id),
      gold_post_pos: rankOf(scored.map((row) => row.memory_id), probeClass.resolved_memory_id),
      max_abs_delta: scored.reduce((max, row) => Math.max(max, Math.abs(row.delta)), 0),
      candidates: scored,
    });
    if ((index + 1) % 10 === 0) {
      console.error(`audited ${index + 1}/${usable.length} usable probes`);
    }
  }

  const coverage = {
    generated_at: new Date().toISOString(),
    subset: 'valid+replaced',
    summary: {
      total: coverageRows.length,
      lane_hit_rates: laneStats(coverageRows),
      pre_rerank_coverage_final_pool: coverageRows.filter((row) => row.coverage.final_pool.top_100).length / (coverageRows.length || 1),
    },
    rows: coverageRows,
  };
  writeJson(path.join(evidenceDir, 'candidate-coverage-2026-05-21.json'), coverage);

  const changedTop5 = rerankRows.filter((row) => row.reranker_changed_top5).length;
  const rerankEffect = {
    generated_at: new Date().toISOString(),
    subset: 'valid+replaced',
    scoring_note: 'blended_score_weight_0_20 = stage2_score * 0.8 + BAAI/bge-reranker-v2-m3 sigmoid * 0.2',
    summary: {
      total: rerankRows.length,
      rerank_effect_v: changedTop5 / (rerankRows.length || 1),
      changed_top5_count: changedTop5,
      max_abs_delta_histogram: summarizeCounts(rerankRows.map((row) => ({ bucket: String(row.max_abs_delta) })), 'bucket'),
      max_abs_delta_observed: Math.max(...rerankRows.map((row) => row.max_abs_delta), 0),
      errors: rerankRows.filter((row) => row.rerank_error).length,
    },
    rows: rerankRows,
  };
  writeJson(path.join(evidenceDir, 'rerank-effect-2026-05-21.json'), rerankEffect);

  const paritySampleIds = ['fixture-001', 'fixture-011', 'fixture-023', 'fixture-024', 'fixture-039'];
  const sampleRows = [];
  for (const probeId of paritySampleIds) {
    const probe = fixture.probes.find((candidate) => candidate.id === probeId);
    const direct = await directHandlerTop20(probe, handleMemorySearch);
    sampleRows.push({ probe_id: probe.id, category: probe.category, direct_top20: direct });
  }
  const socketReachable = await canConnectSocket(ipcSocketPath);
  const parityVerdict = socketReachable ? 'deferred' : 'deferred';
  const parityMd = [
    '# Handler Parity Evidence - 2026-05-21',
    '',
    `Verdict: **${parityVerdict}**`,
    '',
    `Canonical daemon IPC socket checked: \`${path.relative(root, ipcSocketPath)}\``,
    '',
    socketReachable
      ? 'The socket accepted a raw connection, but this packet-local runner does not include a JSON-RPC daemon client. REQ-003 remains deferred to a non-sandboxed MCP client run.'
      : 'No canonical daemon IPC socket was present at the documented `database/daemon-ipc.sock` path, so Path B could not be executed in this sandbox. Path A direct-handler samples are captured below for replay parity follow-up.',
    '',
    '| Probe | Category | Path A top-20 memory ids | Path B | Verdict |',
    '|---|---|---|---|---|',
    ...sampleRows.map((row) => `| ${row.probe_id} | ${row.category} | ${row.direct_top20.map((item) => item.id).join(', ')} | unavailable | deferred |`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(evidenceDir, 'handler-parity-2026-05-21.md'), parityMd);

  const metrics = computeMetrics(classification, offEvidence);
  metrics.phase2_bge_summary = bgeEvidence.summary;
  metrics.branch_inputs = {
    pre_rerank_coverage_v: coverage.summary.pre_rerank_coverage_final_pool,
    rerank_effect_v: rerankEffect.summary.rerank_effect_v,
  };
  metrics.branch_decision = coverage.summary.pre_rerank_coverage_final_pool < 0.30
    ? 'RETRIEVAL_WORK'
    : rerankEffect.summary.rerank_effect_v < 0.10
      ? 'SCORING_INTEGRATION_WORK'
      : 'PHASE_3_JUSTIFIED';
  metrics.next_recommendation = metrics.branch_decision === 'RETRIEVAL_WORK'
    ? 'new arc 012-retrieval-pipeline-audit (FTS / vector / RRF / chunking)'
    : metrics.branch_decision === 'SCORING_INTEGRATION_WORK'
      ? 'new packet 011/005-scoring-integration-fix (WEIGHT_RERANKER + score blending)'
      : 'execute 011/003-domain-tuned-finetune with target: retrieval surfaces gold candidates but bge-v2-m3 under-ranks them after Stage 2';
  writeJson(path.join(evidenceDir, 'valid-subset-metrics-2026-05-21.json'), metrics);

  console.log(JSON.stringify({
    branch_decision: metrics.branch_decision,
    classification: classification.summary.counts_by_class,
    usable_count: usable.length,
    pre_rerank_coverage_final_pool: coverage.summary.pre_rerank_coverage_final_pool,
    rerank_effect_v: rerankEffect.summary.rerank_effect_v,
    hit_rate_at_5_valid_subset: metrics.summary.hit_rate_at_5,
    handler_parity: parityVerdict,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
