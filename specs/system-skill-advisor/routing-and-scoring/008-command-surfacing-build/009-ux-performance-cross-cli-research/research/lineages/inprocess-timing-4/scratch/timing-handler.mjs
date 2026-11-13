// Timing harness for the in-process advisor handler on the degraded path.
// Reads the committed corpus, refuses any holdout row, and scores a fixed set
// of non-holdout prompts. Modes: cold (one prompt in this fresh process),
// warm (all prompts in one already-loaded process), fallback (the Python
// scorer the CLI spawns today), shape (answer comparison, no timing).
import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ADV = path.join(ROOT, '.skilled/skills/system-skill-advisor/runtime');
const DIST = path.join(ADV, 'dist/runtime');
const CORPUS = path.join(ADV, 'scripts/routing-accuracy/command-prompts.jsonl');

// Fixed sample: eight plain tune rows that span the failure classes named in
// segment three plus two typed rows. No holdout id is named or read.
const SAMPLE_IDS = [
  'cmd-create-readme-plain-tune-01',
  'cmd-doctor-setup-plain-tune-01',
  'cmd-create-agent-plain-tune-01',
  'cmd-speckit-save-plain-tune-01',
  'cmd-doctor-mcp-plain-tune-01',
  'cmd-speckit-implement-plain-tune-01',
  'cmd-create-repo-rule-plain-tune-01',
  'cmd-doctor-sk-skill-plain-tune-01',
  'cmd-create-readme-typed-01',
  'cmd-doctor-setup-typed-01',
];
// Warm-up rows that are not part of the measured set, so no measured call
// rides the prompt cache a warm-up call would have filled.
const WARMUP_IDS = ['nm-sk-doc-01', 'nm-sk-code-01'];

const OPTIONS = {
  topK: 3,
  includeAttribution: false,
  includeAbstainReasons: true,
  includeCompiledRoute: true,
  compiledRouteTopOnly: true,
  confidenceThreshold: 0.8,
  uncertaintyThreshold: 0.35,
};

function loadRows(ids) {
  const rows = readFileSync(CORPUS, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line))
    .filter((row) => ids.includes(row.id));
  for (const row of rows) {
    if (row.split === 'holdout') {
      throw new Error(`refusing holdout row ${row.id}`);
    }
  }
  const found = new Map(rows.map((row) => [row.id, row]));
  const missing = ids.filter((id) => !found.has(id));
  if (missing.length > 0) throw new Error(`missing rows: ${missing.join(',')}`);
  return ids.map((id) => found.get(id));
}

function parseHandlerResponse(response) {
  const text = response?.content?.[0]?.text;
  const payload = JSON.parse(text);
  return payload?.data?.recommendations ?? [];
}

function toAdvisorRecommendation(row) {
  // The public handler row keeps confidence and uncertainty but not the
  // pass/fail bit the Q026 filter reads, so the harness recomputes it with
  // the same thresholds the hook sends.
  return {
    skill: row.skillId,
    kind: row.kind,
    ...(row.command ? { command: row.command } : {}),
    ...(row.policy ? { policy: row.policy } : {}),
    ...(row.ownerSkillId ? { ownerSkillId: row.ownerSkillId } : {}),
    ...(row.needsMode ? { needsMode: true } : {}),
    confidence: row.confidence,
    uncertainty: row.uncertainty,
    passes_threshold:
      typeof row.confidence === 'number' &&
      typeof row.uncertainty === 'number' &&
      row.confidence >= OPTIONS.confidenceThreshold &&
      row.uncertainty <= OPTIONS.uncertaintyThreshold,
    reason: '',
  };
}

function topSummary(rows) {
  const top = rows[0];
  if (!top) return { top: null, command: null, needsMode: false, kind: null };
  return {
    top: top.skillId ?? top.skill ?? null,
    command: top.command ?? null,
    needsMode: top.needsMode === true,
    kind: top.kind ?? null,
  };
}

function percentile(sorted, p) {
  if (sorted.length === 0) return null;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[index];
}

function stats(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  return {
    n: sorted.length,
    median: percentile(sorted, 50),
    worst: sorted.at(-1) ?? null,
    best: sorted[0] ?? null,
  };
}

const mode = process.argv[2] ?? 'cold';
const index = Number(process.argv[3] ?? 0);
const rows = loadRows([...new Set([...SAMPLE_IDS, ...WARMUP_IDS])]);
const byId = new Map(rows.map((row) => [row.id, row]));
const measured = SAMPLE_IDS.map((id) => byId.get(id));

function out(line) {
  process.stdout.write(`${JSON.stringify(line)}\n`);
}

if (mode === 'cold') {
  const row = measured[index];
  if (!row) throw new Error(`no measured row at index ${index}`);
  // The node process is already up; this is the cost a CLI process pays when
  // it dynamically imports the handler on its first degraded call.
  const importStart = performance.now();
  const { handleAdvisorRecommend } = await import(path.join(DIST, 'handlers/advisor-recommend.js'));
  const importMs = performance.now() - importStart;
  const callStart = performance.now();
  const response = await handleAdvisorRecommend({
    workspaceRoot: ROOT,
    prompt: row.prompt,
    options: OPTIONS,
  });
  const handlerMs = performance.now() - callStart;
  const recs = parseHandlerResponse(response);
  out({
    mode,
    index,
    id: row.id,
    split: row.split,
    importMs,
    handlerMs,
    totalMs: performance.now(),
    ...topSummary(recs.map((r) => ({ ...r, needsMode: r.needsMode }))),
    recommendationCount: recs.length,
  });
} else if (mode === 'warm') {
  const { handleAdvisorRecommend } = await import(path.join(DIST, 'handlers/advisor-recommend.js'));
  for (const id of WARMUP_IDS) {
    const row = byId.get(id);
    await handleAdvisorRecommend({ workspaceRoot: ROOT, prompt: row.prompt, options: OPTIONS });
  }
  const timings = [];
  for (const [position, row] of measured.entries()) {
    const start = performance.now();
    const response = await handleAdvisorRecommend({
      workspaceRoot: ROOT,
      prompt: row.prompt,
      options: OPTIONS,
    });
    const handlerMs = performance.now() - start;
    const recs = parseHandlerResponse(response);
    timings.push(handlerMs);
    out({
      mode,
      index: position,
      id: row.id,
      split: row.split,
      handlerMs,
      ...topSummary(recs),
      recommendationCount: recs.length,
    });
  }
  out({ mode: 'warm-summary', ...stats(timings) });
} else if (mode === 'fallback') {
  const { runAdvisorSubprocess } = await import(path.join(DIST, 'lib/subprocess.js'));
  const timings = [];
  for (const [position, row] of measured.entries()) {
    const start = performance.now();
    const result = await runAdvisorSubprocess(row.prompt, {
      workspaceRoot: ROOT,
      timeoutMs: 5000,
      thresholdConfig: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 },
    });
    const elapsedMs = performance.now() - start;
    timings.push(elapsedMs);
    out({
      mode,
      index: position,
      id: row.id,
      split: row.split,
      elapsedMs,
      ok: result.ok,
      errorCode: result.errorCode,
      recommendationCount: result.recommendations.length,
      ...topSummary(result.recommendations),
    });
  }
  out({ mode: 'fallback-summary', ...stats(timings) });
} else if (mode === 'shape') {
  const { handleAdvisorRecommend } = await import(path.join(DIST, 'handlers/advisor-recommend.js'));
  const { degradedRecommendations } = await import(path.join(DIST, 'skill-advisor-cli.js'));
  const { runAdvisorSubprocess } = await import(path.join(DIST, 'lib/subprocess.js'));
  for (const [position, row] of measured.entries()) {
    const start = performance.now();
    const response = await handleAdvisorRecommend({
      workspaceRoot: ROOT,
      prompt: row.prompt,
      options: OPTIONS,
    });
    const inProcessMs = performance.now() - start;
    const recs = parseHandlerResponse(response);
    const shaped = degradedRecommendations(recs.map(toAdvisorRecommendation), row.prompt);
    const fallbackStart = performance.now();
    const fallback = await runAdvisorSubprocess(row.prompt, {
      workspaceRoot: ROOT,
      timeoutMs: 5000,
      thresholdConfig: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 },
    });
    const fallbackMs = performance.now() - fallbackStart;
    const fallbackShaped = degradedRecommendations(
      fallback.recommendations.map((r) => ({ ...r, passes_threshold: r.passes_threshold === true })),
      row.prompt,
    );
    out({
      mode,
      index: position,
      id: row.id,
      split: row.split,
      inProcessMs,
      fallbackMs,
      inProcess: {
        top: shaped[0]?.skillId ?? null,
        command: shaped[0]?.command ?? null,
        kind: shaped[0]?.kind ?? null,
        count: shaped.length,
        commandKept: shaped.some((r) => typeof r.command === 'string'),
      },
      fallback: {
        top: fallbackShaped[0]?.skillId ?? null,
        command: fallbackShaped[0]?.command ?? null,
        kind: fallbackShaped[0]?.kind ?? null,
        count: fallbackShaped.length,
        commandKept: fallbackShaped.some((r) => typeof r.command === 'string'),
      },
      rawHandlerTop: topSummary(recs),
    });
  }
} else if (mode === 'shape-live') {
  const { handleAdvisorRecommend } = await import(path.join(DIST, 'handlers/advisor-recommend.js'));
  const { degradedRecommendations } = await import(path.join(DIST, 'skill-advisor-cli.js'));
  const { commandRowFor } = await import(path.join(DIST, 'lib/command-attach.js'));
  const { runAdvisorSubprocess } = await import(path.join(DIST, 'lib/subprocess.js'));

  // The literal rank 6 shape: handler rows go through the existing Q026 filter
  // with skillId standing in for the skill name. It must be measured as the
  // rank describes it, before any row-mapping fix.
  // The corrected shape: trust the handler's own command when the prompt typed
  // it, which is the Q026 rule, and otherwise collapse to the owner skill.
  function correctedShaped(recs, prompt) {
    const offered = new Set();
    const out = [];
    for (const row of recs) {
      const confidence = row.confidence;
      const uncertainty = row.uncertainty;
      const passes = typeof confidence === 'number' && typeof uncertainty === 'number'
        && confidence >= OPTIONS.confidenceThreshold && uncertainty <= OPTIONS.uncertaintyThreshold;
      if (!passes) continue;
      const base = { confidence, uncertainty, reason: '' };
      if (typeof row.command === 'string' && prompt.includes(row.command.split(' ')[0])) {
        out.push({
          skillId: row.skillId,
          kind: 'command',
          command: row.command,
          ...(row.policy ? { policy: row.policy } : {}),
          ownerSkillId: row.ownerSkillId,
          ...base,
        });
        offered.add(row.skillId);
        continue;
      }
      const ownerRow = commandRowFor(row.skillId);
      if (ownerRow) {
        if (offered.has(ownerRow.ownerSkillId)) continue;
        out.push({ skillId: ownerRow.ownerSkillId, kind: 'skill', ...base });
        offered.add(ownerRow.ownerSkillId);
        continue;
      }
      if (offered.has(row.skillId)) continue;
      out.push({ skillId: row.skillId, kind: 'skill', ...base });
      offered.add(row.skillId);
    }
    return out;
  }

  const hubPrompts = [
    { id: 'synthetic-sk-doc-hub', split: 'tune', prompt: 'use the sk-doc skill' },
    { id: 'synthetic-deep-loop-hub', split: 'tune', prompt: 'use the system-deep-loop skill' },
  ];
  for (const [position, row] of [...measured, ...hubPrompts].entries()) {
    const start = performance.now();
    const response = await handleAdvisorRecommend({
      workspaceRoot: ROOT,
      prompt: row.prompt,
      options: OPTIONS,
    });
    const inProcessMs = performance.now() - start;
    const recs = parseHandlerResponse(response);
    const naive = degradedRecommendations(recs.map(toAdvisorRecommendation), row.prompt);
    const corrected = correctedShaped(recs, row.prompt);
    const fallbackStart = performance.now();
    const fallback = await runAdvisorSubprocess(row.prompt, {
      workspaceRoot: ROOT,
      timeoutMs: 5000,
      thresholdConfig: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 },
    });
    const fallbackMs = performance.now() - fallbackStart;
    const fallbackShaped = degradedRecommendations(
      fallback.recommendations.map((r) => ({ ...r, passes_threshold: r.passes_threshold === true })),
      row.prompt,
    );
    const summary = (rows) => ({
      top: rows[0]?.skillId ?? null,
      command: rows[0]?.command ?? null,
      count: rows.length,
      commandKept: rows.some((r) => typeof r.command === 'string'),
    });
    out({
      mode,
      index: position,
      id: row.id,
      split: row.split,
      inProcessMs,
      fallbackMs,
      rawTop: topSummary(recs),
      naive: summary(naive),
      corrected: summary(corrected),
      fallback: summary(fallbackShaped),
      fallbackRawTop: topSummary(fallback.recommendations),
    });
  }
} else if (mode === 'long') {
  const { handleAdvisorRecommend } = await import(path.join(DIST, 'handlers/advisor-recommend.js'));
  const base = measured[0].prompt;
  const targetChars = 10_000;
  const filler = 'context for the request ';
  const makeLong = (seed) => {
    let text = `${base} ${'x'.repeat(seed % 7)} `;
    while (text.length < targetChars - filler.length) text += filler;
    return text.slice(0, targetChars);
  };
  const cold = process.argv[4] === 'cold';
  const callOnce = async (prompt, index) => {
    const start = performance.now();
    const response = await handleAdvisorRecommend({ workspaceRoot: ROOT, prompt, options: OPTIONS });
    const handlerMs = performance.now() - start;
    const recs = parseHandlerResponse(response);
    out({ mode, run: cold ? 'cold' : 'warm', index, chars: prompt.length, handlerMs, ...topSummary(recs), recommendationCount: recs.length });
  };
  if (cold) {
    await callOnce(makeLong(index), index);
  } else {
    for (let i = 0; i < 10; i += 1) await callOnce(makeLong(i + 1), i);
  }
} else {
  throw new Error(`unknown mode ${mode}`);
}
