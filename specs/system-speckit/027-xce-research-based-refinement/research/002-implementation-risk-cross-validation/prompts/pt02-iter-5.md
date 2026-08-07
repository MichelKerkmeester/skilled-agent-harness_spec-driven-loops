Deep-research iter 5/10 cross-validation pass for packet 027.

ITER 5 FOCUS: IRQ5 — Phase 005 subprocess reliability at 24-40 sequential dispatches.

READ FIRST:
- 027/005-code-graph-adoption-eval/spec.md (full Risks block + REQ-005 timeout + REQ-008 retry + REQ-006 incremental save + L2 EDGE CASES)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md to 004.md (especially iter-1 + iter-2 findings on file-graph state assumptions)
- .opencode/skills/cli-opencode/SKILL.md §4 ALWAYS rule 5 (the `</dev/null` rule from 097)
- .opencode/skills/cli-opencode/references/integration_patterns.md §6 (failure patterns + position rule)
- .opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md (097 fix details)
- ~/.local/share/opencode/log/ — list (do NOT read content)
- 027/research/research.md (any prior pass-1 finding on subprocess reliability)

QUESTION: Phase 005 dispatches 24-40 sequential opencode subprocesses (12-20 tasks × 2 conditions). Stress points:
- Resource leakage across 40 sequential subprocesses: file handles? db connections to opencode.db? memory growth in the spawning Node process?
- The 097 fix (`</dev/null`) prevents stdin-startup-deadlock for ONE invocation. Does it also prevent issues at 40 sequential invocations? Are there other latent bugs (DB lock contention, fs-events watcher leaks, plugin reload race)?
- 10-min per-task timeout. If task 17 hangs at 10 min, does the orchestrator cleanly kill the subprocess and continue? What about the pid stuck in zombie state?
- Incremental JSONL saving (REQ-006). Race condition risk if two tasks try to append simultaneously? Spec says "JSONL per task" — suggests no shared file, but verify.
- 2 retries per task (REQ-010). After retry-2 fails, mark `failed:true` and continue — but does the eval-runs/ output schema gracefully handle mixed success/timeout/failed records?
- Subprocess auth: each opencode subprocess runs the auth pre-flight (per cli-opencode SKILL.md ALWAYS rule 11). Is the cache shared across subprocesses, or does each subprocess re-auth? At scale this matters.
- Cross-platform concerns: macOS file-watcher (`service=file.watcher backend=fs-events`) — does it leak inotify-equivalent across 40 spawns?
- The ~/.local/share/opencode/opencode.db is shared. Pass-1 had stale-process-DB-lock issues. Are 40 sequential subprocesses going to recreate that pattern?
- Test reliability: how does the smoke test (`tests/code-graph-adoption-eval.vitest.ts`) cover this at non-trivial scale? 1 task × 2 conditions = 2 dispatches won't surface the resource-leak issue.

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-005.md` (Focus, Actions with file:line, Findings with verdicts BLOCKING/CONFIRMED/NO-CHANGE-NEEDED, Q-Answered, Q-Remaining, Next Focus = IRQ6)
2. APPEND `>>` ONE LINE to `pt-02/deep-research-state.jsonl`:
{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ5"}
3. WRITE `pt-02/deltas/iter-005.jsonl` (1 iter record + ≥3 finding records)

CONSTRAINTS: LEAF, ≤12 tools, READ-ONLY 027/* + skills/cli-opencode/ + skills/system-spec-kit/, WRITE pt-02/ ONLY, file:line cites required.

NEXT: IRQ6 — Cross-phase integration contract (Phase 002 imports Phase 001's classifyFileRole — JSON contract drift surfaces?).
