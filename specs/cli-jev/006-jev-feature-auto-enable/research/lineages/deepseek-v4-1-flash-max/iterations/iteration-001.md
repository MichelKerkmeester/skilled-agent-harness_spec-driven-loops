# Iteration 001 — The shared gate and the four proven features' live-path pattern

- **Focus:** What is the exact live-path contract behind `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs` (`featureReady`, `JEV_FEATURE_<NAME>`, auto-on with a stored credential), and how did each of the four proven features earn its auto-on slot? What must a candidate feature demonstrate to pass that gate? (Q1)
- **Read first:** no `steer.md` exists in this lineage yet (checked at iteration start, absent).
- **Lens:** every claim gets a `file:line`; every "confirmed" names the check that produced it.

## Actions Taken

1. Read `jev-features.mjs` end to end (186 lines) and its test suite `tests/jev-features.test.mjs` (260 lines).
2. Located every gate call site with `grep -rn "featureReady|featureEnabled|jevReady"` across `.skilled` (5 files) and read each site's surrounding code: `cite-drift-scan.mjs`, `injection-screen-posttooluse.mjs`, `reviewer-scorer.cjs`, `run-benchmark.cjs`.
3. Read the auto-grader resolution block in `run-benchmark.cjs:600-640` and the reviewer resolution in `reviewer-scorer.cjs:290-320`.
4. Grepped the documented switch names across `.env.example`, `ENV-REFERENCE.md`, `hook-flags.env.example`, `hooks/README.md`.

## Findings

### F-001 — The gate registers exactly four features; the three candidates are absent from it (P0, Q1)

`FEATURES` (`jev-features.mjs:38-55`) holds `cite-drift`, `injection-screen`, `verdict-fallback`, `hallucination-grader` — and nothing else. No entry, no `JEV_FEATURE_*` name and no live call site exists for track narrowing, clarify default or alignment suggestion. The documented surfaces name exactly the same four (`.env.example:451-455`, `ENV-REFERENCE.md:433-437`, `hook-flags.env.example:50-54`).

- **Confirmed by:** reading the `FEATURES` table and grepping `JEV_FEATURE` across the four doc surfaces; the only `featureReady`/`featureSwitch` call sites in `.skilled` are the four proven paths (plus the module and its tests).
- **Implication:** earning a live path means adding a `FEATURES` entry with a `JEV_FEATURE_<UPPER_SNAKE>` name, a live call site that asks `featureReady` first, and docs; the gate itself does not need changes.

### F-002 — The gate contract is switch-first, then one bounded readiness probe; a disabled feature never spawns (P0, Q1)

`featureSwitch` resolves in order: master `JEV_FEATURES` → the feature's own env → its aliases; each key reads `env` first and falls back to the hook-flags file (env wins per key); only `0/false/no/off` (trimmed, case-insensitive) switch off (`jev-features.mjs:71-106`). `jevReady` walks PATH in-process, then runs exactly one bounded `jev auth status --provider <JEV_PROVIDER|official>` (10 s default timeout, `stdio: ['ignore','pipe','pipe']`, output discarded) (`:149-165`). `featureReady` asks the switch first and only a permitted feature reaches readiness (`:181-186`). The test suite proves the no-spawn property: a disabled feature logs zero stub calls (`jev-features.test.mjs:197-206`).

- **Confirmed by:** reading all three functions and the switch/readiness test matrix (`jev-features.test.mjs:56-229`); the stub `jev` fixture records argv, and the disabled case asserts an empty log.
- **Implication:** auto-on with a stored credential = `featureReady(name).ready`; the switch is an opt-out only, and a closed gate costs no process spawn.

### F-003 — The four proven live paths share one integration shape: gate first, fail open, never block (P0, Q1)

- **cite-drift:** `runAdvise` returns 0 unless `featureSwitch('cite-drift', ctx.env).enabled` (`cite-drift-scan.mjs:1547`), then its own `adviseGate` re-checks the CLI: exact `jev --version` match plus `auth status` (`:1467-1476`). Alias `SKDOC_CITE_DRIFT_CHECK` (`jev-features.mjs:41`).
- **injection-screen:** the PostToolUse hook asks `featureReady('injection-screen', process.env)` and returns `done()` when not ready (`injection-screen-posttooluse.mjs:90-91`); advisory output only, never blocks, always exits 0 (`:96-104`).
- **verdict-fallback:** `graderRequested === 'auto'` resolves through `featureReady('verdict-fallback', env)` to `jev` or `noop`, and the gate reason is recorded (`reviewer-scorer.cjs:299-306`).
- **hallucination-grader:** `run-benchmark.cjs` resolves `auto` only on the 5dim path through `featureReady('hallucination-grader')` (`:610-621`), keeps `noop` for every other scorer without spawning a readiness check (`:615-621`), and an explicit `--grader jev` without readiness exits 2 naming the gate reason (`:624-629`).

- **Confirmed by:** reading each call site's surrounding code in full, plus the shared test proving readiness/switch composition (`jev-features.test.mjs:208-229`).
- **Implication:** a candidate's live path must keep its pre-Jev behavior byte-identical when the gate is closed; every proven path does.

### F-004 — The auto-on resolution records provenance: resolved choice plus gate reason (P1, Q1)

Both benchmark paths resolve `auto` once, before any work, and record the resolved grader and its reason (`run-benchmark.cjs:606-612`, `reviewer-scorer.cjs:301-305`). The report carries the choice so a shifted score is attributable to the grader, and `--grader noop` restores the old score (spec 006 `spec.md:128`).

- **Confirmed by:** reading both resolution blocks; the comment in `run-benchmark.cjs:606-609` states the provenance intent.
- **Implication:** a candidate serving in a scored or measured path should record the same provenance (feature name, gate reason, resolved transport).

### F-005 — The test pattern for a gated feature is a stub-CLI fixture with a no-spawn proof (P1, Q1)

`jev-features.test.mjs` builds a temp stub `jev` that appends its argv to a log and exits with a chosen code (`:35-45`), then asserts: unset switches leave every feature on (`:56-60`), master/feature/alias/config/env-override matrices (`:62-153`), readiness pass/fail/no-CLI (`:159-191`), the disabled-feature no-spawn proof (`:197-206`), and frozen `FEATURES` plus CommonJS reach with zero warnings (`:235-260`).

- **Confirmed by:** reading the whole suite.
- **Implication:** a candidate's tests can reuse this fixture shape; the gate itself is already covered, so new tests should target the candidate's own question constants, record shape and fallback behavior.

### F-006 — cite-drift diverges from `featureReady`: it uses `featureSwitch` plus a version-pinned private gate (P2, Q1)

`cite-drift-scan.mjs` imports only `featureSwitch` (`:25`) and implements its own `adviseGate` that additionally requires the first `jev --version` line to equal `JEV_VERSION` (`:1467-1476`). The shared `jevReady` has no version pin (`jev-features.mjs:149-165`). So two live-path shapes exist: shared readiness (injection screen, both graders) and version-pinned private readiness (cite-drift).

- **Confirmed by:** comparing the two code paths; the grep for gate imports shows cite-drift imports `featureSwitch` only.
- **Implication:** a candidate integration can choose either shape; if question or option formats are version-sensitive, the cite-drift shape is the precedent.

## Ruled Out

- **A gate change is needed to register candidates.** Not so: `FEATURES` is data; adding an entry plus a call site is the whole integration (F-001, F-002).
- **The gate costs a spawn when disabled.** Disproved by the test's empty-log assertion (F-002).

## Dead Ends

None. All four research actions produced evidence.

## Edge Cases

- Ambiguous input: none; the dispatch topic names the gate file and its symbols exactly.
- Contradictory evidence: none; the four call sites agree on the fail-open shape.
- Missing dependencies: `steer.md` absent (expected at iteration 1); no lead review to weigh yet.
- Partial success: none; all reads succeeded.

## Sources Consulted

- `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:38-55,71-106,149-165,181-186`
- `.skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:28-260`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:25,1467-1476,1547`
- `.skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs:90-104`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:299-306`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:606-633`
- `.env.example:451-455`; `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:433-437`; `.skilled/hooks/hook-flags.env.example:50-54`

## Assessment

- New information ratio: 1.0
- Questions addressed: Q1
- Questions answered: Q1 — the gate contract and the four proven features' auto-on pattern are established; the candidate-relevant contract is: FEATURES entry + live call site asking `featureReady` first + fail-open fallback + provenance recording + stub-CLI tests.

## Reflection

- What worked and why: reading the gate module end to end first made every call-site read cheap — each site's correctness could be judged against one contract. The test suite doubled as a specification of the required properties (no-spawn, frozen tables, CJS reach).
- What did not work and why: nothing failed; the only friction is breadth — the four call sites plus docs needed five reads to cover, which is at the top of the per-iteration budget.
- What I would do differently: for the per-feature iterations, read the scorer's keep-rule and corpus sections first and only then the surrounding machinery, because the keep rule is where the topic's open questions live.

## Recommended Next Focus

Iteration 2 — spec-track narrowing (Q2): read `score-track-narrowing.mjs` keep-rule, corpus construction, scoring and report sections, plus the recorded runs behind the 97/256 keep and the 270-row repeat (106 vs 82, bootstrap interval spanning zero), and the 049 track-narrowing improvements. Deliverable: corpus/labels/keep-rule/power verdict, accuracy changes, hardening list, integration shape, test plan.
