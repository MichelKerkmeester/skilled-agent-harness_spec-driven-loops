// Exactness ratchet: measure the exact fraction per crate and refuse a
// regression.
//
// The north star's measure of success for HONEST is that the exact fraction
// ratchets toward 100% and no release ever regresses it. Tonight that promise
// depended on remembering to measure widely, and it failed: a change measured
// on six crates showed two gains and no regressions, while serde_json had
// dropped 91.98% -> 66.22% and serde_core 95.03% -> 80.76%. The crates that
// moved were exactly the ones not sampled, which is the normal case — a binder
// change moves failures between stages, so the crates leaning on the changed
// stage are the ones that move.
//
//   node scripts/rust-exactness-ratchet.mjs measure   # build the crate set, print fractions
//   node scripts/rust-exactness-ratchet.mjs baseline  # measure and store as the baseline
//   node scripts/rust-exactness-ratchet.mjs check     # measure and fail on any regression
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync} from 'node:fs';
import {join} from 'node:path';

import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scratch = process.env.SUPERCOV_RATCHET_WORK ?? join(root, 'target', 'exactness-ratchet');
const wrapper = join(root, `spikes/rustc-backend/target/debug/supercov-rustc-backend-spike${process.platform === 'win32' ? '.exe' : ''}`);
const baselinePath = join(root, 'spikes/rustc-backend/exactness-baseline.json');
const work = join(scratch, 'exactness-work');

// Chosen to span the stages a binder change can move failures between: serde's
// collapsed generated matches, syn/quote/proc-macro2's macro expansion,
// tracing's attribute macros, and plain authored code in bytes/http/either.
const dependencies = [
  ['serde_json', '1'],
  ['serde', '1'],
  ['syn', '2'],
  ['quote', '1'],
  ['proc-macro2', '1'],
  ['tracing', '0.1'],
  ['bytes', '1.12'],
  ['http', '1'],
  ['either', '1'],
  ['once_cell', '1'],
  ['log', '0.4'],
  ['itoa', '1'],
  ['memchr', '2'],
];

const registry = execFileSync('sh', [
  '-c',
  'ls -d "$HOME"/.cargo/registry/src/*/ | head -1',
]).toString().trim();
assert(registry, 'no cargo registry checkout found');

function measure() {
  rmSync(work, {recursive: true, force: true});
  mkdirSync(join(work, 'src'), {recursive: true});
  writeFileSync(
    join(work, 'Cargo.toml'),
    ['[package]', 'name = "exactness-probe"', 'version = "0.0.0"', 'edition = "2021"', 'publish = false', '', '[dependencies]']
      .concat(dependencies.map(([name, version]) => `${name} = "${version}"`))
      .concat(['', '[workspace]', ''])
      .join('\n'),
  );
  writeFileSync(join(work, 'src/lib.rs'), '// exactness probe\n');
  const out = join(work, 'out');

  // Traces reach gigabytes and are never read here.
  // The loop must not inherit stdout: spawnSync waits for EOF on the pipe, and
  // a background process holding it open blocks forever.
  const reaper = spawnSync('sh', [
    '-c',
    `(while true; do find ${out} -name '*.jsonl' -size +5M -mmin +1 -delete 2>/dev/null; sleep 30; done) >/dev/null 2>&1 & echo $!`,
  ]).stdout.toString().trim();
  try {
    spawnSync('cargo', ['build', '-j', '4'], {
      cwd: work,
      encoding: 'utf8',
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
        RUSTUP_TOOLCHAIN: '1.95.0',
        CARGO_TARGET_DIR: join(work, 'target'),
        RUSTC_WRAPPER: wrapper,
        // Absolute: cargo runs a dependency with its own directory as cwd, so a
        // relative path writes into the registry and leaves an empty dir that
        // reads exactly like "nothing to report".
        SUPERCOV_RUST_COMPILER_OUTPUT: out,
        SUPERCOV_RUST_INSTRUMENT_MIR: '1',
        SUPERCOV_RUST_SOURCE_ROOT: registry,
        SUPERCOV_RUST_TARGET_ROOT: join(work, 'target'),
            SUPERCOV_RUST_STATIC_RUNTIME_DIRECTORY:
          process.env.SUPERCOV_RATCHET_RUNTIME ?? join(scratch, 'repro-runtime'),
      },
      maxBuffer: 256 * 1024 * 1024,
    });
  } finally {
    if (reaper) spawnSync('kill', [reaper]);
  }

  const fractions = {};
  if (!existsSync(out)) return fractions;
  for (const name of readdirSync(out)) {
    if (!name.startsWith('manifest-') || !name.endsWith('.json')) continue;
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(join(out, name), 'utf8'));
    } catch {
      continue;
    }
    const total =
      manifest.points.length + manifest.branches.length + manifest.decisions.length;
    // Tiny build-script crates add noise without signal.
    if (total < 100) continue;
    const declined = (manifest.unmeasuredObligations ?? []).length;
    // Track uncompiled declines separately. Discovering more code that this
    // build does not contain lowers the exact fraction while making the
    // report more honest, and a ratchet that cannot tell that apart from a
    // binder getting worse will veto exactly the changes it exists to protect.
    const uncompiled = (manifest.limitations ?? []).filter((limitation) =>
      limitation.startsWith('RUST_OBLIGATION_NOT_COMPILED'),
    ).length;
    // Which DECLINED obligations are uncompiled, as opposed to how many
    // not-compiled MESSAGES there are. The two are different populations —
    // several messages can name one obligation, and one message can accompany
    // a scope decline covering many — and only the per-obligation count can
    // be removed from the fraction. The wrapper embeds the obligation id in
    // the marker as `UNMEASURABLE<id>|<reason>`.
    const declinedIds = new Set(manifest.unmeasuredObligations ?? []);
    const uncompiledDeclined = new Set();
    for (const limitation of manifest.limitations ?? []) {
      if (!limitation.startsWith('RUST_OBLIGATION_NOT_COMPILED')) continue;
      const marked = limitation.match(/UNMEASURABLE([^|]+)\|/);
      if (marked && declinedIds.has(marked[1])) uncompiledDeclined.add(marked[1]);
    }
    // Exactness measures BINDING, so code this build never compiled belongs in
    // neither half of the fraction. Counting it as a failure meant a change
    // that merely recognised more absent code read as the binder getting
    // worse — and per-definition obligation identity, which counts each
    // expansion of eliminated code separately, could never converge because of
    // it: tracing regressed 0.65 with zero unbound messages.
    const measurable = total - uncompiledDeclined.size;
    const unbound = declined - uncompiledDeclined.size;
    // Total conditions across all decisions. Decomposing one recorded
    // condition into the several it always was raises this without adding
    // obligations, and can lower the exact fraction when the new conditions
    // cannot yet bind. That is a merged number being replaced by an honest
    // decline, which the ratchet must not read as the binder getting worse.
    const conditions = manifest.decisions.reduce(
      (total, decision) => total + (decision.conditions ?? []).length,
      0,
    );
    const previous = fractions[manifest.crate];
    // A crate can be compiled more than once (lib and test targets); keep the
    // largest obligation count so the comparison is stable.
    if (previous && previous.obligations >= total) continue;
    fractions[manifest.crate] = {
      obligations: total,
      declined,
      uncompiled,
      conditions,
      measurable,
      // Bodies whose obligations were actually BOUND. Exactness alone cannot
      // tell "everything bound" from "nothing was checked": both drive declines
      // to zero and both score 100%. A change that stopped binding entirely
      // once scored +28.26 and +21.37 here and reported "held or improved".
      // This is the number that falls when checking stops.
      boundBodies: manifest.boundBodies ?? 0,
      exact:
        measurable > 0
          ? Number((((measurable - unbound) / measurable) * 100).toFixed(2))
          : 100,
    };
  }
  return fractions;
}

// Which phase owns an obligation, so a declined one is attributed to the
// failure that actually cost it. DeclineScope is already per-kind, so this
// mirrors how the binder decides what to give up.
const OWNING_PHASE = [
  ['point', 'statement'],
  ['decision', 'decision'],
  ['group', 'match'],
  ['branch-logical-selection', 'logical-selection'],
  ['branch-match-arm', 'match'],
  ['branch-decision-outcome', 'decision'],
  ['branch-loop-entry', 'loop'],
  ['branch-try-operator', 'try'],
];

// Rank families by the obligations they actually cost.
//
// The first version of this attributed a definition's whole declined set to
// every limitation naming that definition, so a body with several failures
// counted its obligations once per failure and the columns summed to seven
// times the corpus total. Each obligation is now attributed once, to the
// phase that owns its kind, and the total is asserted against the crate's
// declined count so the arithmetic cannot drift again.
function families(measured) {
  const totals = {};
  let attributed = 0;
  let declinedTotal = 0;
  for (const name of readdirSync(join(work, 'out'))) {
    if (!name.startsWith('manifest-') || !name.endsWith('.json')) continue;
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(join(work, 'out', name), 'utf8'));
    } catch {
      continue;
    }
    const size =
      manifest.points.length + manifest.branches.length + manifest.decisions.length;
    if (size < 100) continue;
    const declined = new Set(manifest.unmeasuredObligations ?? []);
    if (declined.size === 0) continue;
    if (measured[manifest.crate]?.obligations !== size) continue;
    declinedTotal += declined.size;
    const kindOf = new Map();
    for (const point of manifest.points) kindOf.set(point.id, 'point');
    for (const decision of manifest.decisions) kindOf.set(decision.id, 'decision');
    for (const group of manifest.selectionGroups ?? []) kindOf.set(group.id, 'group');
    for (const branch of manifest.branches) kindOf.set(branch.id, `branch-${branch.kind}`);
    const definitionsOf = new Map();
    for (const obligation of [
      ...manifest.points,
      ...manifest.branches,
      ...manifest.decisions,
      ...(manifest.selectionGroups ?? []),
    ]) {
      definitionsOf.set(obligation.id, obligation.definitions ?? []);
    }
    const limitations = (manifest.limitations ?? [])
      .filter((limitation) => !limitation.startsWith('RUST_FRONTEND_PRIVATE'))
      .map((limitation) => {
        const parsed = limitation.match(/^([A-Z_]+): (.*?) in (.*?): /);
        return parsed
          ? {kind: parsed[1], phase: parsed[2], definition: parsed[3]}
          : null;
      })
      .filter(Boolean);
    for (const id of declined) {
      const kind = kindOf.get(id) ?? '';
      const owner = OWNING_PHASE.find(([prefix]) => kind === prefix)?.[1];
      const candidates = (definitionsOf.get(id) ?? []).flatMap((definition) =>
        limitations.filter((limitation) => limitation.definition === definition),
      );
      const matched =
        candidates.find((limitation) => owner && limitation.phase.includes(owner)) ??
        candidates[0];
      const key = matched
        ? `${matched.kind.replace('RUST_OBLIGATION_', '')} :: ${matched.phase}`
        : `UNATTRIBUTED :: ${kind || 'unknown'}`;
      totals[key] = (totals[key] ?? 0) + 1;
      attributed += 1;
    }
  }
  console.log(`cost  family   (${attributed} attributed of ${declinedTotal} declined)`);
  for (const [key, cost] of Object.entries(totals).sort((a, b) => b[1] - a[1])) {
    console.log(String(cost).padStart(5), ' ', key.slice(0, 72));
  }
  assert.equal(
    attributed,
    declinedTotal,
    'every declined obligation must be attributed exactly once',
  );
}

const mode = process.argv[2] ?? 'measure';
const measured = measure();
const names = Object.keys(measured).sort();
assert(
  names.length >= 8,
  `only ${names.length} crates measured; the probe build did not run — a partial set silently reads as "no regressions"`,
);

if (mode === 'families') {
  families(measured);
  process.exit(0);
}

if (mode === 'baseline') {
  writeFileSync(baselinePath, `${JSON.stringify(measured, null, 2)}\n`);
  console.log(`baseline stored for ${names.length} crates`);
  for (const name of names) console.log(`  ${name}: ${measured[name].exact}%`);
  process.exit(0);
}

if (mode === 'measure' || !existsSync(baselinePath)) {
  for (const name of names) console.log(`  ${name}: ${measured[name].exact}%`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const regressions = [];
const gains = [];
for (const name of names) {
  const before = baseline[name];
  if (!before) {
    console.log(`  ${name}: ${measured[name].exact}% (new)`);
    continue;
  }
  // Checked before exactness, because a fall here invalidates the fraction
  // rather than merely lowering it.
  const boundBefore = before.boundBodies ?? 0;
  const boundNow = measured[name].boundBodies ?? 0;
  if (boundBefore > 0 && boundNow < boundBefore) {
    regressions.push(
      `${name} bound ${boundNow} bodies, was ${boundBefore} — binding stopped, ` +
        `so its ${measured[name].exact}% is not a measurement`,
    );
    continue;
  }
  const delta = Number((measured[name].exact - before.exact).toFixed(2));
  const newlyUncompiled = (measured[name].uncompiled ?? 0) - (before.uncompiled ?? 0);
  const newlyDecomposed = (measured[name].conditions ?? 0) - (before.conditions ?? 0);
  if (delta < 0 && newlyDecomposed > 0 && measured[name].obligations === before.obligations) {
    // Same obligations, more conditions: a decision that was reported as one
    // condition is now reported as the several it always had.
    console.log(
      `  decomposed: ${name} ${before.exact}% -> ${measured[name].exact}% (${delta}), ` +
        `+${newlyDecomposed} conditions recorded`,
    );
  } else if (delta < 0 && newlyUncompiled > 0) {
    // Honesty gained, not exactness lost: the drop is accounted for by
    // constructs newly recognised as absent from this build.
    console.log(
      `  honesty: ${name} ${before.exact}% -> ${measured[name].exact}% (${delta}), ` +
        `+${newlyUncompiled} uncompiled declared`,
    );
  } else if (delta < 0) regressions.push(`${name} ${before.exact}% -> ${measured[name].exact}% (${delta})`);
  else if (delta > 0) gains.push(`${name} ${before.exact}% -> ${measured[name].exact}% (+${delta})`);
}
for (const name of Object.keys(baseline)) {
  if (!measured[name]) regressions.push(`${name} disappeared from the measurement`);
}
for (const gain of gains) console.log(`  gain: ${gain}`);
if (regressions.length > 0) {
  for (const regression of regressions) console.error(`  REGRESSION: ${regression}`);
  console.error('exactness regressed; the north star forbids landing this');
  process.exit(1);
}
console.log(`exactness held or improved across ${names.length} crates`);
