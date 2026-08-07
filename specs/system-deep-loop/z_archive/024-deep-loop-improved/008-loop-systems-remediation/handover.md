# Handover — 009 Loop-Systems Remediation (finish the remaining rec-fixes)

> Resume doc for a fresh session. Goal: complete the 4 remaining 009 rec-fix phases, finalize all 6 child specs to Complete, validate `009 --recursive` clean, commit per phase, push. Context ran out mid-campaign; codex repeatedly OOM'd on the large deep-improvement/playbook files — run sequential, tight-scoped.

## 1. Where things stand

- **Branch:** `system-speckit/028-memory-search-intelligence`. A **concurrent session is also committing** to this branch (mcp-open-design / skill-benchmark / design-token-lint, "D5-*"). HEAD moves on its own; rebase/pull-then-push if a push is rejected. The `skill-benchmark/tests/design-token-lint.vitest.ts` failure in the deep-improvement suite is **theirs, not ours — ignore it.**
- **Parent packet:** `.opencode/specs/system-deep-loop/024-deep-loop-improved/` (the `002-implementation` parent was ungrouped earlier this arc; its children are now 156 root phases `002`–`008`; the whole 156 tree validates 63/63).
- **This phase parent:** `024-deep-loop-improved/008-loop-systems-remediation/` with 6 children (below).

### Committed + verified (do NOT redo)
- `7812385f` — **001 rollback hash-guard** (`deep-improvement/scripts/shared/rollback-candidate.cjs`): verifies the accepted-state hash, fail-closes on unexpected canonical target drift, still allows legitimate pre-ship rollback. Adversarial regression test in `promote-candidate-benchmark.vitest.ts` ("allows pre-ship rollback but blocks rollback from unexpected target drift").
- `7812385f` — **003 model-benchmark ledger** (`.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml`): emits the reducer ledger row like sibling deep modes.
- `7812385f` — **006 plugin tests** (`mk-goal-continuation.test.cjs`, `mk-goal-state.test.cjs`): fail-closed continuation gates + adversarial injection coverage. 6/6 plugin tests pass.
- **002 `:92`** investigated → **design-intent, no code change** (no-phase command = legacy one-step canonical mutation; `--phase=accept`/`--phase=ship` = the staging path). Document this in the 002 spec; do not "fix" it.

### Uncommitted in the working tree (resume from here)
- `008-loop-systems-remediation/` — the 6 child folders are scaffolded; specs partially authored (states below). **Untracked.**
- `024-deep-loop-improved/{spec.md, description.json, graph-metadata.json}` — modified (phase-map gained the `009` row; metadata re-regenerated). **Uncommitted.**

### Verification baselines (green now)
- `cd .opencode/skills/deep-loop-runtime && PATH=/opt/homebrew/bin:$PATH npm test` → **60 files / 545 tests pass**.
- All `.opencode/plugins/tests/*.test.cjs` → **6/6 pass** (run each with `PATH=/opt/homebrew/bin:$PATH node <file>`).
- `cd .opencode/skills/deep-loop-workflows/deep-improvement/scripts && PATH=/opt/homebrew/bin:$PATH npx vitest run` → passes except the concurrent session's `design-token-lint` (ignore).

## 2. Remaining work (4 fixes)

### 002 `:541` mirror-sync gate — `deep-improvement/scripts/shared/promote-candidate.cjs`
Around L541 (`verifyMirrorSync(agentName, candidateContent, …)`): the pre-mutation mirror-sync check blocks a **legitimate in-sync** agent-definition promotion. Narrow it so an in-sync mirror passes and only a genuine out-of-sync mirror blocks. Add a regression test (in-sync promotion allowed; out-of-sync still blocked). Verify with the deep-improvement vitest suite. (Leave `:92` as design-intent.)

### 004 adversarial playbook scenarios — markdown only
Author one adversarial scenario per fixed deep-review cluster, under the right skill `manual_testing_playbook/` dir, each phrased to **FAIL if the bug regresses**, TEST EXECUTION pointing at the real regression test:
(a) loop-lock refresh-under-concurrent-reclaim must NOT split-brain; (b) `writeStateAtomic(undefined)` must THROW; (c) concurrent diff-gated append must NOT lose rows; (d) deferred-writer flush error must surface (no unhandled rejection); (e) jsonl append after no-trailing-newline must NOT corrupt; (f) mk-goal terminal-goal same-objective re-set must NOT carry stale usage; (g) mk-goal injection clamp must preserve directive + fence markers; (h) fanout exit-0/no-artifact must NOT be reported fulfilled. Match each skill's existing scenario format (OVERVIEW / SCENARIO CONTRACT / TEST EXECUTION / SOURCE ANCHORS).

### 005 tighten pass-criteria + audit source-only — markdown only
**Verify codex's claimed-Complete work actually landed** (it OOM'd; status may be premature). For high-risk `deep-loop-runtime/manual_testing_playbook` scenarios in `state-safety`, `coverage-graph`, `fanout`, `validation`: change SCENARIO CONTRACT pass criterion from "source inspection OR tests prove behavior" to **require the test RUN (EXIT 0) AND source confirms**. Audit the 3 source-only scenarios MiMo passed by inspection (`speckit-autopilot-lifecycle`, `single-loop-telemetry-heartbeat`, `coverage-graph-fuzzy-merge`): mandate the runnable test or mark inspection-by-nature explicitly.

### 006 genuinely-concurrent tests — `deep-loop-runtime/tests/unit/{atomic-state,jsonl-repair}.vitest.ts`
The "concurrent" tests are actually sequential. codex's in-process **write-barrier rewrite timed out** and was reverted. Use a **child-process harness instead**: spawn 2 short node processes that each append to the same JSONL via the real append fn, then assert both rows survive (use `tests/helpers/spawn-cjs.ts` as a pattern). Keep the suite green.

## 3. Finalization (after the 4 fixes)
1. Finalize every 009 child `spec.md` to **Status: Complete** + fill `plan.md`/`tasks.md`/`implementation-summary.md` (001 is currently `Review`; 002/004/006 unstatused; 003/005 say Complete — re-verify 005).
2. Regen metadata: `generate-description.js <child> <base>` + `backfill-graph-metadata.ts <child>` for each child, then the `009` parent, then the `156` parent. base = `.opencode/specs/skilled-agent-orchestration`.
3. `validate.sh 008-loop-systems-remediation --recursive` → clean; also re-validate `156 --recursive`.
4. Commit per phase (or one remediation commit), explicit paths, trailers; push (rebase if the concurrent writer moved HEAD).

## 4. Discipline / gotchas
- **OOM:** codex (gpt-5.5) OOMs on the big files — dispatch **sequential, one file, tell it to read ONLY the target file**, reasoning-effort `high` (not xhigh). Node for tests: `/opt/homebrew/bin` (v25; ABI for sqlite/vitest).
- One phase = one commit; scope-lock; comment hygiene (no spec/phase ids in code comments); never `git add -A`.
- Finding = hypothesis: confirm each fix with a RED-before regression test.
