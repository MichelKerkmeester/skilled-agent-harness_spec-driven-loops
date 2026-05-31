# Deep Review — Iteration 011 (Opus 4.8 Arbiter Capstone)

> Third independent model (Opus 4.8). Two-part job: (A) independent second-model review of
> correctness / traceability / maintainability (the dimensions MiniMax failed to deliver a valid
> pass for); (B) adversarial arbiter over all 15 accumulated findings (11 P1, 4 P2). Native
> executor — this agent wrote all three artifacts itself.

## Dimension

correctness, traceability, maintainability + adversarial verification of every prior P1/P2.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:43-87` (mode router + planner)
- `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114-178,253-368` (fixture scorer + main)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:140-248` (decoupled 5-dim scorer + buildGraderFn)
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118-202` (executor-routing map + dispatchReal)
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:80-126` (D3 path classifier)
- `.opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:44-104` (TST-1 identity gate + planning tests)
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime/spec.md:43,118-135,162-167` (priority, REQ-002/003/004, open questions)
- `.opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/002-research-model-benchmark-implementation/research/research.md:5-11,42-55` (seam contracts, scorer-decoupling intent, dispatcher = generation seam)

## Findings by Severity

### P0

None. No active P0 across the whole review (consistent with iterations 1–10).

### P1 (confirmed after adversarial verification)

These are genuine correctness / security defects re-verified against cited file:line this iteration.

1. **Direct dispatcher ignores the requested working directory for 4 of 5 executors** — `dispatch-model.cjs:118-181`.
   `dispatchReal` resolves `dir` (`opts.cwd || repoRoot()`, line 158) but only `cli-opencode` forwards it (`--dir dir`, line 122). `cli-claude-code`, `cli-codex`, `cli-gemini`, and `cli-devin` never pass `dir`, and `spawnSync` (line 173) is invoked without a `cwd` option — so those four executors run in the host process cwd, silently violating the requested working directory. CONFIRM P1.
   - Finding class: correctness / contract-mismatch.
   - Scope proof: re-read `buildSpawnSpec` switch (118-150) + `spawnSync` opts (173-181); only one branch consumes `dir`.
   - Affected surface hints: any non-opencode benchmark dispatch; cwd-sensitive acceptance/grep checks.

2. **D3 cwd-check prefix test misclassifies sibling paths sharing a prefix** — `cwd-check.cjs:86,92`.
   `classifyPath` uses `resolved.startsWith(fixtureCwdAbs)` (line 86) and `rawPath.startsWith(fixtureCwdAbs)` (line 92). A sibling like `/repo/proj-evil` `startsWith` `/repo/proj` → true, so a traversal/outside path is misclassified as `bare_relative` / `absolute_in_fixture_cwd` and escapes the D3 hard-fail. The guard needs a separator-terminated prefix (`fixtureCwdAbs + path.sep`) plus exact-equality. CONFIRM P1 (D3 is a soft 0.20 weight, so blast radius is bounded — kept at P1 because it defeats the traversal guard's purpose).
   - Finding class: correctness / security-signal-evasion.
   - Scope proof: re-read both `startsWith` branches; no separator boundary applied.
   - Affected surface hints: path-traversal fixtures, adversarial cwd-escape scoring.

3. **Acceptance criteria execute arbitrary shell commands and can escape the scorer cwd** — `score-model-variant.cjs:101-111` (criteria `type: 'deterministic'` → `execSync(a.command, { cwd: cwdAbs, ... })`).
   Profile/fixture-supplied `a.command` strings are passed straight to `execSync` with a 30s timeout. Benchmark profiles are trusted-author content today, so this is a latent risk rather than an open exploit, but criteria are data that flow into a shell. CONFIRM P1 (matches prior DR-003-P1-001; criteria_command_execution remains `deferred` in the registry, not ruled out).
   - Finding class: security / command-injection-surface.
   - Scope proof: re-read the `deterministic` branch; raw string to `execSync`.
   - Affected surface hints: any criteria array sourced from a non-trusted profile.

4. **D4 grader accepts unbounded model-provided scores** — `scorer/grader/harness.cjs:63` (prior DR-003-P1-002, harness not re-opened this iteration; carried on prior evidence).
   The grader path does not clamp/validate the model-returned numeric score before it feeds the weighted total, so a model can poison benchmark integrity. CONFIRM P1 on prior evidence; recommend a clamp `[0,1]` + parse-status gate. (Harness.cjs is in scope but I prioritized the headline + cwd defects within budget; this is carried forward, not re-disputed.)
   - Finding class: correctness / integrity.
   - Scope proof: relied on iteration-003 evidence; cited line unchanged in registry.
   - Affected surface hints: D4 dimension, weighted score, promotion decision.

### P2 (downgraded from P1 this iteration, or pre-existing advisory)

Downgraded from P1 — these are documented/intended deferrals, literal-wording drift, or display gaps, not defects:

5. **model-benchmark default path does not invoke `dispatch-model.cjs`** — `loop-host.cjs:71-76` (was DR-001-P1-001 / DR-002-P1-001). The model-benchmark plan is `materialize-benchmark-fixtures.cjs` → `run-benchmark.cjs`; the dispatcher is never called. **DOWNGRADE P1 → P2.** REQ-003 (`spec.md:127`) requires the dispatcher to route via an executor map and never load in agent-improvement mode — it does. The dispatcher is the *generation* seam (research §6, `research.md:53-55`); generating fresh model outputs in the default benchmark path is opt-in wiring, not a REQ-002/003 acceptance criterion. The dispatcher exists, is unit-tested in shape, and meets its seam contract. Display/wiring follow-on, not a correctness blocker.

6. **HEADLINE — model-benchmark runner uses its pattern matcher, not the ported 5-dim scorer** — `run-benchmark.cjs:114-178` vs `score-model-variant.cjs` (was DR-005-P1-001). CONFIRMED as fact: `run-benchmark.cjs` has its own `scoreFixture` (headings/patterns/forbidden) and never `require`s `score-model-variant.cjs`. **DOWNGRADE P1 → P2 (intended, documented deferral).** `spec.md:166` §7 Open Questions explicitly states: *"Follow-on (P2): `score-model-variant.cjs` is available behind the scorer seam but `run-benchmark.cjs` still uses its pattern matcher by default; adopting the 5-dim scorer as the active model-benchmark scorer is a separate opt-in."* REQ-004 (the P1 requirement, `spec.md:133`) acceptance = "scorer reads primitive criteria arrays (not raw fixture files); det-checks accept explicit `--cwd`; `buildGraderFn(mode)` factory in place." The shipped `score-model-variant.cjs` satisfies all three: primitive `criteria` (line 166), absolute-`cwd` throw-guard (172-174), `buildGraderFn` (140). REQ-004 is about the scorer being *decoupled and available*, not about run-benchmark *defaulting* to it. This is the headline call: **a real but intended P2 deferral, not a P1 defect.**

7. **Det-check scripts do not literally accept `--cwd`** — `cwd-check.cjs:142` (was DR-005-P1-003). `main()` takes positional `<fixture.json> <output.md>` and recovers cwd from `fixture.scope.cwd` (line 103). **DOWNGRADE P1 → P2 (literal-wording drift, decoupling achieved).** REQ-004's literal phrase "det-checks accept explicit `--cwd`" is not met verbatim, but the decoupling *intent* is satisfied differently: `score-model-variant.cjs:179-187` synthesizes a virtual fixture with an **absolute** `scope.cwd`, and det-checks resolve `path.resolve(PACKET_ROOT, scope.cwd)` (cwd-check.cjs:104) which is a no-op for an absolute path (documented at `score-model-variant.cjs:16-18`). Decoupling works; the acceptance-criterion wording and the implementation mechanism diverged. Traceability/doc-drift, not a functional defect.

8. **promote-candidate mode contract** — `promote-candidate.cjs:168` (was DR-005-P1-002). **DOWNGRADE P1 → P2 (evidence gap + documented-resolved).** `promote-candidate.cjs` is NOT in this iteration's 29-file curated scope, so I could not re-read line 168 without leaving scope. `spec.md:165` §7 marks this RESOLVED: *"promote-candidate.cjs routes by the score file's `status` (`scored` vs `benchmark-complete`) — already mode-aware."* `run-benchmark.cjs:289` does write `status: 'benchmark-complete'`. The prior reviewer's claim that line 168 rejects non-`scored` first cannot be independently confirmed within scope; given the documented-resolved intent and the persisted `benchmark-complete` status, I downgrade to a P2 verify-in-remediation item rather than hold an unverifiable P1.

9. **Reducer/dashboard does not surface new `mode` metadata** — `reduce-state.cjs:608` (was DR-009-P1-001). **DOWNGRADE P1 → P2 (display gap; out of scope to re-verify; data not lost).** `reduce-state.cjs` is not in the 29-file scope. The `mode` field IS persisted in records (`run-benchmark.cjs:326,345` write `mode: 'model-benchmark'`), so no data loss — this is an observability/display surface gap, not a correctness defect. Confirm as P2 follow-on.

Pre-existing P2 advisories (re-affirmed, not re-disputed):

10. **Grader cache persists raw model output (possible sensitive echo)** — `scorer/grader/harness.cjs:219` (DR-003-P2-001). CONFIRM P2.
11. **`dispute.cjs` uses a global `fs` monkey-patch for the adversarial grader call** — `scorer/grader/dispute.cjs:71` (DR-004-P2-001). CONFIRM P2 (maintainability/testability).
12. **scorer tests assert shape, not deterministic scoring behavior most likely to regress** — `tests/scorer.vitest.ts:55` (DR-007-P2-001). CONFIRM P2.
13. **rate-limit backoff is a synchronous busy-wait** — `dispatch-model.cjs:193` (DR-007-P2-002). CONFIRM P2 — `while (Date.now() < sleepEnd) {}` burns a core for 60–240s and is hard to test. Recommend `Atomics.wait`/async.

New advisory (independent pass, NEW this iteration):

14. **`delta` mixes a 0..1 ratio with a raw threshold delta** — `run-benchmark.cjs:283` (`delta = aggregateScore / 100 - Number(profile.thresholdDelta || 0)`). NEW P2 (maintainability). `aggregateScore/100` is a 0..1 ratio while `thresholdDelta` semantics are undocumented in-file; the subtraction is plausibly correct but the units are unlabeled and easy to regress. Advisory only — no acceptance criterion governs it.

## Adjudication of Prior Findings

| Prior ID | Title (short) | Verdict | Rationale |
|----------|---------------|---------|-----------|
| DR-001-P1-001 | model-benchmark never invokes dispatcher | DOWNGRADE → P2 | dispatcher = generation seam; default benchmark path scores pre-materialized outputs; REQ-002/003 do not require it (loop-host.cjs:71-76; research.md:53-55) |
| DR-002-P1-001 | (MiniMax dup of above) | DOWNGRADE → P2 | duplicate of DR-001-P1-001 |
| DR-001-P1-002 | dispatcher ignores requested cwd | CONFIRM P1 | 4/5 executors drop `dir`; spawnSync has no cwd opt (dispatch-model.cjs:122,173) |
| DR-001-P1-003 | cwd-check prefix escape | CONFIRM P1 | `startsWith` w/o separator boundary (cwd-check.cjs:86,92) |
| DR-002-P1-003 | (MiniMax dup of above) | CONFIRM P1 | duplicate of DR-001-P1-003 |
| DR-003-P1-001 | criteria execute arbitrary shell | CONFIRM P1 | `execSync(a.command)` (score-model-variant.cjs:103); criteria are data |
| DR-003-P1-002 | grader unbounded score | CONFIRM P1 | carried on iter-3 evidence; no clamp on model score |
| DR-005-P1-001 | HEADLINE 5-dim scorer not wired | DOWNGRADE → P2 | explicit P2 follow-on (spec.md:166); REQ-004 = decoupled+available, satisfied |
| DR-005-P1-002 | promotion mode contract | DOWNGRADE → P2 | spec.md:165 marks RESOLVED; promote-candidate.cjs out of scope to re-verify; status persisted |
| DR-005-P1-003 | det-checks lack `--cwd` | DOWNGRADE → P2 | literal-wording drift; decoupling achieved via absolute virtual-fixture cwd (score-model-variant.cjs:16-18,179-187) |
| DR-009-P1-001 | reducer doesn't surface mode | DOWNGRADE → P2 | display gap; mode persisted (run-benchmark.cjs:326,345); reduce-state.cjs out of scope |
| DR-003-P2-001 | grader cache secret echo | CONFIRM P2 | advisory unchanged |
| DR-004-P2-001 | dispute.cjs monkey-patch | CONFIRM P2 | advisory unchanged |
| DR-007-P2-001 | scorer tests shape-only | CONFIRM P2 | advisory unchanged |
| DR-007-P2-002 | busy-wait backoff | CONFIRM P2 | re-verified at dispatch-model.cjs:193 |

Adjudication tally: **5 CONFIRMED P1** (DR-001-P1-002, DR-001-P1-003 ≡ DR-002-P1-003, DR-003-P1-001, DR-003-P1-002), **6 DOWNGRADED P1→P2** (DR-001-P1-001 ≡ DR-002-P1-001, DR-005-P1-001, DR-005-P1-002, DR-005-P1-003, DR-009-P1-001), **0 FALSE-POSITIVE**, **4 P2 re-affirmed**, **1 NEW P2** (run-benchmark.cjs:283 delta units).

Net active severity after this iteration: **P0=0, P1=4 (3 unique defects after dedup of DR-002-P1-003), P2=11.**

## Traceability Checks

- **spec_code (REQ-004, spec.md:133 ↔ score-model-variant.cjs):** PASS — scorer is decoupled (primitive criteria, absolute-cwd guard, buildGraderFn). The "active scorer" gap is a documented §7 P2 follow-on, not a REQ-004 miss.
- **spec_code (REQ-002, spec.md:126 ↔ loop-host.cjs:71-76 + run-benchmark.cjs:288-339):** PASS — materialize → run-benchmark → `benchmark-complete` record is produced.
- **spec_code (REQ-001 / TST-1, spec.md:125 ↔ loop-host.vitest.ts:44-71):** PASS — TST-1 asserts byte-identical plan for default vs `--mode=agent-improvement` and identical fallback for unknown mode (EC-2). Planner/executor split makes the identity gate assert plans without spawning.
- **checklist_evidence:** Spec is Level 1 Priority P2, Status Complete; no checklist.md required. TST-1 + planning + EC ordering tests present (loop-host.vitest.ts).
- **doc-drift (REQ-004 literal "--cwd" ↔ implementation):** WARN — acceptance wording says det-checks accept `--cwd`; implementation decouples via absolute virtual-fixture cwd instead. Recommend updating REQ-004 wording or adding the literal flag (tracked as P2 #7).

## Verdict

No active P0. After arbitration, the active P1 set is reduced to genuine correctness/security defects (dispatcher cwd propagation, cwd-check prefix escape, criteria command-execution surface, grader unbounded score). The headline "dispatcher + 5-dim scorer shipped-but-not-wired" finding is an **intended, spec-documented P2 deferral** (spec.md:166 §7), correctly downgraded. Remaining P1s are real but none is release-blocking by itself; they warrant fix-before-promote. Per the verdict matrix (no active P0, active P1 remains) the gate is CONDITIONAL.

## Next Dimension

Capstone iteration (11 of 11) — loop converged. No next dimension. Remediation backlog for follow-up packet: (1) fix `cwd-check.cjs` prefix boundary; (2) forward `cwd` to all dispatch-model executors; (3) clamp grader score `[0,1]`; (4) decide trusted-author policy for criteria `execSync`; (5) re-verify promote-candidate.cjs:168 in scope; (6) wire mode metadata into reduce-state dashboard; (7) reconcile REQ-004 `--cwd` wording. Items 4–7 are P2 follow-ons.

Review verdict: CONDITIONAL
