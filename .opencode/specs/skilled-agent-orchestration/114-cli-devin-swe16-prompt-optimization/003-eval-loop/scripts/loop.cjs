#!/usr/bin/env node
/**
 * scripts/loop.cjs
 *
 * Main orchestrator for the bespoke deep-loop per council-report.md.
 * Implements the 10-step iteration cycle from 003-eval-loop spec.md.
 *
 * Modes:
 *   --mock                 Use dispatchMock; no real SWE 1.6 calls.
 *   --mock-mode <name>     high-score | low-score | default (default: rotates)
 *   --real                 Real cli-devin dispatches.
 *   --max-iters <n>        Override max from config (default: 12)
 *   --resume               Resume from existing state (skip init).
 *
 * Exit codes:
 *   0  converged + synthesis written
 *   1  budget exhausted (synthesis written with best-known)
 *   2  paused (sentinel file written)
 *   3  fatal (bug; check stderr)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PACKET_ROOT = path.resolve(__dirname, '..');
const RIG_ROOT = path.resolve(PACKET_ROOT, '..', '002-eval-rig');
const STATE_DIR = path.join(PACKET_ROOT, 'state');
const ITERATIONS_DIR = path.join(PACKET_ROOT, 'iterations');
const VARIANTS_DIR = path.join(PACKET_ROOT, 'variants');
const STATE_JSONL = path.join(STATE_DIR, 'eval-loop-state.jsonl');
const BEST_VARIANT_PATH = path.join(STATE_DIR, 'best-variant.json');
const DASHBOARD_PATH = path.join(STATE_DIR, 'eval-loop-dashboard.md');
const PAUSE_SENTINEL = path.join(STATE_DIR, '.eval-loop-pause');

const config = require(path.join(STATE_DIR, 'eval-loop-config.json'));
const dispatchModule = require('./dispatch-swe16.cjs');
const scoreModule = require('./score-variant.cjs');
const convergeModule = require('./converge.cjs');
const mutateModule = require('./mutate.cjs');
const renderModule = require('./render-variant.cjs');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function appendState(row) {
  fs.appendFileSync(STATE_JSONL, JSON.stringify(row) + '\n');
}

function readState() {
  if (!fs.existsSync(STATE_JSONL)) return [];
  return fs.readFileSync(STATE_JSONL, 'utf8').split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch (_) { return null; }
  }).filter(Boolean);
}

function loadBestVariant() {
  if (!fs.existsSync(BEST_VARIANT_PATH)) return null;
  return JSON.parse(fs.readFileSync(BEST_VARIANT_PATH, 'utf8'));
}

function saveBestVariant(b) {
  fs.writeFileSync(BEST_VARIANT_PATH, JSON.stringify(b, null, 2));
}

function fixturePath(id) {
  return path.join(RIG_ROOT, 'fixtures', id, 'task.json');
}

function variantTemplatePath(meta) {
  // Try to map meta → a seeded variant file
  const seeded = fs.readdirSync(VARIANTS_DIR).filter((f) => f.endsWith('.md'));
  for (const f of seeded) {
    const full = path.join(VARIANTS_DIR, f);
    const { meta: m } = renderModule.readVariantTemplate(full);
    if (mutateModule.variantSignature(m) === mutateModule.variantSignature(meta)) {
      return full;
    }
  }
  // No exact match: synthesize a variant file dynamically from the closest seed
  return null;
}

function synthesizeVariantFile(meta, signature) {
  // Build a new variant template using the closest seeded variant's body
  const seeded = fs.readdirSync(VARIANTS_DIR).filter((f) => f.endsWith('.md'));
  if (seeded.length === 0) throw new Error('no seeded variants found');
  // Use the first seeded variant as the body template; meta is overridden
  const seedPath = path.join(VARIANTS_DIR, seeded[0]);
  const { body } = renderModule.readVariantTemplate(seedPath);
  const newPath = path.join(VARIANTS_DIR, `v-mut-${signature}.md`);
  const fm = `---\nid: v-mut-${signature}\nframework: "${meta.framework || 'STAR'}"\npreplanning_density: "${meta.preplanning_density || 'medium'}"\nthinking_threshold: "${meta.thinking_threshold || '5'}"\nbundle_gate_strictness: "${meta.bundle_gate_strictness || 'standard'}"\nanti_hallucination_strength: "${meta.anti_hallucination_strength || 'standard'}"\nsource: mutated\nparent_signature: "${meta._parent_signature || ''}"\n---\n`;
  fs.writeFileSync(newPath, fm + body);
  return newPath;
}

async function scoreVariantOnFixtures(variantPath, variantId, variantSig, opts) {
  const fixtures = config.fixtures;
  const fixtureResults = [];
  let parallelWave = config.swe16.max_concurrent || 3;

  for (let i = 0; i < fixtures.length; i += parallelWave) {
    const wave = fixtures.slice(i, i + parallelWave);
    // For simplicity, run sequentially within wave for now (avoids contention bugs)
    for (const fixtureId of wave) {
      const fxPath = fixturePath(fixtureId);
      const fixture = JSON.parse(fs.readFileSync(fxPath, 'utf8'));
      // Render the variant against this fixture
      const tmpPrompt = renderModule.renderVariant({ variant_template_path: variantPath, fixture });
      const tmpPromptPath = path.join(STATE_DIR, 'in-flight', `prompt-${variantId}-${fixtureId}.md`);
      fs.mkdirSync(path.dirname(tmpPromptPath), { recursive: true });
      fs.writeFileSync(tmpPromptPath, tmpPrompt.body);

      // Dispatch (mock or real)
      const dispatchResult = dispatchModule.dispatch({
        prompt_file: tmpPromptPath,
        mock: opts.mock,
        mock_mode: opts.mock_mode,
      });
      if (!dispatchResult.ok) {
        fixtureResults.push({
          fixtureId,
          dispatch_failed: true,
          dispatch_result: dispatchResult,
          weightedScore: 0,
        });
        if (dispatchResult.paused) {
          return { fixtureResults, paused: true, pause_reason: dispatchResult.pause_reason };
        }
        continue;
      }

      // Score via 002 rig
      const scored = await scoreModule.scoreVariantFixture({
        variantId,
        variantHash: variantSig,
        fixturePath: fxPath,
        swe16OutputText: dispatchResult.stdout,
        rubricVersion: config.rubric.version,
        mode: opts.mock ? 'mock' : 'real',
        mockMode: opts.mock_mode || 'high-confidence',
      });
      fixtureResults.push({ ...scored, cache_hit: dispatchResult.mock || false });

      // Cleanup in-flight prompt file
      try { fs.unlinkSync(tmpPromptPath); } catch (_) {}
    }
  }
  return { fixtureResults, paused: false };
}

function variantScoreFromFixtureResults(fixtureResults) {
  const valid = fixtureResults.filter((r) => typeof r.weightedScore === 'number');
  if (valid.length === 0) return 0;
  const sum = valid.reduce((acc, r) => acc + r.weightedScore, 0);
  return Math.round((sum / valid.length) * 10000) / 10000;
}

function updateDashboard(opts) {
  const { run, bestVariant, convergence } = opts;
  const lines = [
    '# eval-loop dashboard',
    '',
    `**Last run**: iter-${run}`,
    `**Best variant**: ${bestVariant ? bestVariant.variantId : 'none'} (score=${bestVariant ? bestVariant.variantScore : 'n/a'})`,
    '',
    '## Convergence',
    `- iterCount: ${convergence.iterCount}`,
    `- stopScore: ${convergence.stopScore}`,
    `- stopCandidate: ${convergence.stopCandidate}`,
    `- legalStopBundle: coverage=${convergence.legalStopBundle.coverage} quality=${convergence.legalStopBundle.quality} budget=${convergence.legalStopBundle.budget}`,
    `- shouldStop: ${convergence.shouldStop}`,
    '',
    '## Recent iterations',
    '| Run | Variant | Score | Signal mix |',
    '|-----|---------|-------|------------|',
  ];
  const rows = readState().filter((r) => r.type === 'iteration').slice(-6);
  for (const r of rows) {
    lines.push(`| ${r.run} | ${r.variantId} | ${r.variantScore} | plateau=${r.convergence ? r.convergence.plateau.value : '?'} exhaustion=${r.convergence ? r.convergence.exhaustion.value : '?'} mad=${r.convergence ? r.convergence.mad.value : '?'} |`);
  }
  fs.writeFileSync(DASHBOARD_PATH, lines.join('\n') + '\n');
}

function writeIterationMd(run, payload) {
  const iterPath = path.join(ITERATIONS_DIR, `iteration-${String(run).padStart(3, '0')}.md`);
  const lines = [
    `# Iteration ${run}`,
    '',
    `**Variant**: ${payload.variantId}  (parent: ${payload.parentVariantId || 'baseline'})`,
    `**Score**: ${payload.variantScore}`,
    `**Mutation axis**: ${payload.mutationAxis || 'n/a'}  (${payload.mutationFrom || ''} → ${payload.mutationTo || ''})`,
    '',
    '## Fixture results',
    '',
    '| Fixture | Weighted | D1 | D2 | D3 | D4 | D5 | hard_gate |',
    '|---------|----------|----|----|----|----|----|-----------|',
  ];
  for (const fr of (payload.fixtureResults || [])) {
    const d = fr.deterministic || {};
    const g = fr.grader || {};
    lines.push(`| ${fr.fixtureId} | ${fr.weightedScore} | ${d.acceptance ? d.acceptance.score : '?'} | ${d.bundleGate ? d.bundleGate.score : '?'} | ${d.cwdCheck ? d.cwdCheck.score : '?'} | ${g.score ?? '?'} | ${d.preplanning ? d.preplanning.score : '?'} | ${fr.hard_gate_failed ? 'YES' : '-'} |`);
  }
  if (payload.convergence) {
    lines.push('', '## Convergence signals');
    lines.push(`- plateau: ${payload.convergence.plateau.value} (${payload.convergence.plateau.reason})`);
    lines.push(`- exhaustion: ${payload.convergence.exhaustion.value} (${payload.convergence.exhaustion.reason})`);
    lines.push(`- mad: ${payload.convergence.mad.value} (${payload.convergence.mad.reason})`);
    lines.push(`- stopScore: ${payload.convergence.stopScore}`);
    lines.push(`- shouldStop: ${payload.convergence.shouldStop}`);
  }
  lines.push('', `**Final-line variant score**: ${payload.variantScore}`);
  fs.writeFileSync(iterPath, lines.join('\n') + '\n');
}

function parseArgs(argv) {
  const out = { mock: false, mock_mode: 'default', max_iters: null, resume: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--mock') out.mock = true;
    else if (argv[i] === '--real') out.mock = false;
    else if (argv[i] === '--mock-mode') out.mock_mode = argv[++i];
    else if (argv[i] === '--max-iters') out.max_iters = parseInt(argv[++i], 10);
    else if (argv[i] === '--resume') out.resume = true;
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.mkdirSync(ITERATIONS_DIR, { recursive: true });

  if (fs.existsSync(PAUSE_SENTINEL) && !args.resume) {
    process.stderr.write('eval-loop: pause sentinel present; pass --resume to continue\n');
    process.exit(2);
  }
  if (args.resume) {
    try { fs.unlinkSync(PAUSE_SENTINEL); } catch (_) {}
  }

  // Init state if empty
  const initialState = readState();
  if (initialState.length === 0) {
    appendState({ type: 'loop_start', ts: new Date().toISOString(), config_version: 'v1.0.0', mode: args.mock ? 'mock' : 'real' });
  }

  const maxIters = args.max_iters || config.budget.max_iterations;
  let noImprovementCount = 0;
  let bestVariant = loadBestVariant();
  let prevBestScore = bestVariant ? bestVariant.variantScore : 0;

  for (let run = (initialState.filter((r) => r.type === 'iteration').length) + 1; run <= maxIters; run++) {
    // Step 1-2: pre-stop check
    const convCheck = convergeModule.evaluateConvergence({
      statePath: STATE_JSONL,
      bestVariantPath: BEST_VARIANT_PATH,
      mutationCoveragePath: path.join(STATE_DIR, 'mutation-coverage.json'),
    });
    if (convCheck.shouldStop) {
      process.stdout.write(`eval-loop: CONVERGED at iter ${run - 1} (stopScore=${convCheck.stopScore})\n`);
      appendState({ type: 'converged', ts: new Date().toISOString(), at_iter: run - 1, convergence: convCheck });
      break;
    }

    // Step 3: pick variant
    const proposal = mutateModule.proposeNextVariant({
      bestVariant: bestVariant || { meta: { framework: 'STAR', preplanning_density: 'medium', thinking_threshold: '5' } },
      noImprovementCount,
    });
    if (!proposal) {
      process.stdout.write(`eval-loop: mutation queue exhausted at iter ${run}; exiting\n`);
      appendState({ type: 'exhausted', ts: new Date().toISOString(), at_iter: run });
      break;
    }

    let variantPath = proposal.variantPath;
    let variantId = proposal.meta ? proposal.meta.id : null;
    if (!variantPath) {
      // Mutation produced a new meta but no file; synthesize one
      variantPath = synthesizeVariantFile(proposal.meta, proposal.signature);
      variantId = `v-mut-${proposal.signature}`;
    } else {
      variantId = variantId || path.basename(variantPath, '.md');
    }
    const variantSig = proposal.signature;

    // Step 4-5: dispatch + score
    process.stdout.write(`eval-loop: iter ${run} dispatching variant=${variantId} (source=${proposal.source || 'seeded'})\n`);
    const t0 = Date.now();
    const swept = await scoreVariantOnFixtures(variantPath, variantId, variantSig, {
      mock: args.mock,
      mock_mode: args.mock_mode,
    });
    const durationMs = Date.now() - t0;

    if (swept.paused) {
      appendState({ type: 'paused', ts: new Date().toISOString(), at_iter: run, reason: swept.pause_reason });
      process.stdout.write(`eval-loop: PAUSED at iter ${run} (${swept.pause_reason}); resume via 'node scripts/loop.cjs --resume'\n`);
      process.exit(2);
    }

    // Step 6: aggregate variant score
    const variantScore = variantScoreFromFixtureResults(swept.fixtureResults);

    // Step 7-8: append state row + update best
    const row = {
      type: 'iteration',
      run,
      variantId,
      variantSignature: variantSig,
      parentVariantId: bestVariant ? bestVariant.variantId : null,
      mutationAxis: proposal.axis || null,
      mutationFrom: proposal.from || null,
      mutationTo: proposal.to || null,
      fixtureResults: swept.fixtureResults,
      variantScore,
      ts: new Date().toISOString(),
      durationMs,
      status: 'complete',
    };

    // Step 9: convergence eval and attach to row
    const conv = convergeModule.evaluateConvergence({
      statePath: STATE_JSONL,
      bestVariantPath: BEST_VARIANT_PATH,
      mutationCoveragePath: path.join(STATE_DIR, 'mutation-coverage.json'),
    });
    row.convergence = conv;

    appendState(row);
    writeIterationMd(run, row);

    // Update best
    if (!bestVariant || variantScore > bestVariant.variantScore) {
      bestVariant = { variantId, variantSignature: variantSig, variantScore, meta: proposal.meta, at_iter: run };
      saveBestVariant(bestVariant);
      noImprovementCount = 0;
    } else {
      noImprovementCount += 1;
    }

    updateDashboard({ run, bestVariant, convergence: conv });

    // Iter-1 sanity gate
    if (run === 1 && config.iter1_sanity_review && config.iter1_sanity_review.enabled) {
      const skip = process.env[config.iter1_sanity_review.skip_env_var] === 'true';
      if (skip) {
        appendState({ type: 'iter1_sanity_gate', status: 'skipped_via_env', ts: new Date().toISOString() });
        process.stdout.write('eval-loop: iter1 sanity gate SKIPPED via env\n');
      } else {
        // Interactive review via scripts/iter1-sanity-gate.cjs in 002
        const gate = require('child_process').spawnSync('node',
          [path.join(RIG_ROOT, 'scripts', 'iter1-sanity-gate.cjs'), STATE_JSONL],
          { stdio: 'inherit' }
        );
        appendState({ type: 'iter1_sanity_gate', status: gate.status === 0 ? 'approved' : 'rejected', exit_code: gate.status, ts: new Date().toISOString() });
        if (gate.status !== 0) {
          process.stdout.write('eval-loop: iter-1 sanity gate REJECTED; aborting\n');
          process.exit(1);
        }
      }
    }
  }

  // Step 10 (post-loop): write synthesis
  const synthesize = require('./synthesize.cjs');
  synthesize.writeSynthesis({
    statePath: STATE_JSONL,
    bestVariantPath: BEST_VARIANT_PATH,
    outputPath: path.join(PACKET_ROOT, 'synthesis.md'),
  });

  appendState({ type: 'loop_end', ts: new Date().toISOString(), best_variant_id: bestVariant ? bestVariant.variantId : null });
  process.stdout.write(`eval-loop: COMPLETE. best=${bestVariant ? bestVariant.variantId : 'none'} score=${bestVariant ? bestVariant.variantScore : 0}\n`);
}

if (require.main === module) {
  main().catch((err) => {
    process.stderr.write('eval-loop fatal: ' + err.stack + '\n');
    process.exit(3);
  });
}

module.exports = { main };
