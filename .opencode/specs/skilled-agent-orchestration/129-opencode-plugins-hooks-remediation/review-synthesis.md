# Review Synthesis - packet 129 (Fable 5 + Sol xhigh)

> Two independent reviews of the two-model (GPT-5.6-Sol + Opus 4.8) fix-design plan. Both reviewers re-verified every cited file:line against the real code.
> **Fable 5: READY-WITH-CHANGES · Sol xhigh: NOT-READY.** Combined: **NOT-READY** until the items below are addressed.

## 1. Verdict

NOT-READY until: the flagged fix-designs are corrected, the 3 operator decisions are made, and the cross-file coordination is planned. Fable 5 = READY-WITH-CHANGES, Sol xhigh = NOT-READY; both re-verified every cited file:line against real code.

## 2. Disputes resolved (4-model consensus - no code fix unless noted)

| Plugin | Finding | Class | Resolution |
|--------|---------|-------|------------|
| 003-mk-code-graph | F3 | non-issue | 4-model consensus: dist is verifiably fresh and running the compiled JS from .claude/settings.json is intentional. No code fix. Keep the dist-freshness / CI gate as process discipline. |
| 005-mk-deep-loop-guard | O3 | non-issue | SDK types tool.execute.before as exactly {tool,sessionID,callID}; the guard demonstrably fires in production. Optional harmless extras: lowercase tool-normalize + one SDK-shape contract fixture. No speculative id fallbacks. |
| 005-mk-deep-loop-guard | F3 | operator-decision | Do NOT fail-closed (regresses 2 pinned tests and needs an F2/F5 envelope that does not exist). Consensus: keep fail-open + a 'reject-mode degraded' audit line only. Final semantics is an operator decision. |
| 002-mk-skill-advisor | O5 | non-issue | The delete resolver is a strict superset of the write resolver and handles the native properties.info.id shape; existing vitest proves targeted eviction. Opus's premise was backwards. Fold any optional shared-resolver refactor into F9. |
| 006-mk-dist-freshness-guard | O2 | by-design | tool.execute.before exposes only {args}; there is no warning channel and stdout is forbidden by the TUI-safety invariant. Doc-only; both models actually converge here. |
| 007-session-cleanup | F4 | doc-only | The plugin already uses the documented event({event}) shape; the code comment claiming raw-event compatibility is simply false. Fix = delete the false claim (no behavior change). |
| 007-session-cleanup | O3 | by-design | Re-election deliberately detaches shared daemons for adoption; the descendant walk is correct. Make Opus's caveat a HARD GATE: prove an adopted/released daemon is not reaped before O1 flips the orphan sweeper live. |

## 3. Design defects to correct BEFORE coding (REVIEW-FLAGs)

| Plugin | Finding | Correction required |
|--------|---------|---------------------|
| 006-mk-dist-freshness-guard | O5 | UNSAFE AS WRITTEN: removing .json from watched inputs breaks freshness detection - compiled code imports routing-prototypes.json and ground-truth.json. Keep .json watched; instead store a build content-hash (see O3) rather than mtime+size. |
| 006-mk-dist-freshness-guard | O3 | mtime+size is not a tamper identity (content can change while both are preserved, and the finding covers revert/tamper). Store and verify a build content-hash; keep the mtime fallback branch, which is load-bearing. |
| 006-mk-dist-freshness-guard | F1 | One-phase postbuild attestation can bless stale output if source changes mid-compile. Use the staged origin-tagged design (O3->O4->F1); prefer a dist content-hash anchor. |
| 007-session-cleanup | F2 | process.pid is NOT session-scoped - PluginInput is workspace/server-scoped and carries no session identity. This is the one real 'kill the wrong process' hazard. Gate behind proven ownership + dry-run staging; land O4 (neutral read-order) and O7 (blank CLAUDE_SESSION_PID) first. |
| 007-session-cleanup | O5 | Use the canonical Hooks.dispose callback (it exists in the installed API) instead of guessing global.disposed / server.instance.disposed strings. |
| 007-session-cleanup | O1 | Keep Claude orphan sweeping in dry-run until the O3 detached-daemon-adoption survival check is proven live. |
| 001-mk-spec-memory | F7 | The selected re-stat-after-parse fix is a mitigation, not a fix - it still races (bytes can be appended after parseTranscript returns). Use the fd + endOffset snapshot-parse design instead. |
| 001-mk-spec-memory | F6 | Appending surfaced sections to an already-built envelope is insufficient because the emitter truncates the string independently downstream; account for the truncation, not just the append. |
| 002-mk-skill-advisor | F1 | The DB-only signature misses SKILL.md and graph-metadata.json changes; use the canonical multi-file signature (SQLite + JSON + SKILL.md). Caveat: WAL-mode SQLite may not bump mtime until checkpoint - add a test; the 5-min TTL bounds residual staleness. |
| 002-mk-skill-advisor | F5 | The proposed ~5s shim timeout exceeds Claude's 3s UserPromptSubmit kill; the number must be < 3s with grace-inside-budget (see operator decision). |
| 004-mk-goal | F2 | The text-part-only refreshGoalActivity accepts role-less parts (extractAssistantEvidence rejects only an explicit non-assistant role) - require an explicit assistant role. |
| 004-mk-goal | F4 | updatedAtMs is wall-clock, not a monotonic revision, and tests pin nowMs to a constant; same-millisecond evidence collides. Use a monotonic revision counter or tie-breaker. |
| 004-mk-goal | F6 | Rolling back a reserved continuation turn on promptAsync timeout is unsafe - a timeout is delivery-indeterminate (the request may have been accepted). Treat timeout as maybe-delivered. |
| 003-mk-code-graph | F2 | The Claude-fallback timeout only kills the process group and still depends on error/exit/close to settle; ensure the promise resolves even if descendants retain stdio. |

## 4. Operator decisions (block implementation)

- mk-skill-advisor F6: the two models propose OPPOSITE behavior. GPT (silent-on-no-brief) matches the canonical renderer, but silently removes the per-turn constitutional hygiene directive the OpenCode surface currently delivers every no-brief turn. Decide the no-brief policy before implementation.
- mk-skill-advisor F5/F11: proposed ~5s shim/convergence exceeds Claude's 3s UserPromptSubmit kill. Set the timeout (< 3s) with grace-inside-budget (that part is an unambiguous win either way).
- mk-deep-loop-guard F3: reject-mode semantics - keep fail-open + audit line (consensus) vs a stricter hard-enforcement contract (needs the not-yet-existing envelope).

## 5. Coordination (must plan before/while coding)

- CROSS-FILE COLLISION: user-prompt-submit.ts is edited by BOTH mk-code-graph F4 and mk-spec-memory F8/O4 - must be ONE coordinated change under a single < 3s budget. mk-code-graph F4 scope also needs compact-inject.ts, not just session-prime.ts.
- SELECT A WINNING DESIGN per finding where the two models differ (~10: 001 F2/F5/F7, 002 F1/F6/F11, 005 F2/F5, 006 F1/O5, 007 O2/O5). Default: Opus-minimal now, GPT-structural as an explicitly-tracked phase 2.
- REBUILD SEQUENCING: one rebuild + freshness-verify step per mcp_server package AFTER all its source edits (honor the operator-gated daemon/rebuild constraints); never per-fix rebuilds.
- CLAUDE-HOOK FRESHNESS POSTURE (repo-wide): keep .claude/settings.json targeting dist; add a CI freshness gate that WARNs on stderr only and never gates execution (fail-open).
- SINGLE-SOURCE the advisor directive text (currently triplicated across render.ts, mk-skill-advisor-bridge.mjs, and the plugin) as a tracked follow-up, or drift returns.

## 6. Implementation order (safest first)

1. `003-mk-code-graph`
2. `002-mk-skill-advisor`
3. `006-mk-dist-freshness-guard`
4. `001-mk-spec-memory`
5. `005-mk-deep-loop-guard`
6. `004-mk-goal`
7. `007-session-cleanup`

Both reviewers agree mk-code-graph is lowest risk (do first) and the process-signal / autonomous / cross-runtime plugins are most dangerous (do last). Sol ranked session-cleanup + mk-goal most dangerous; Fable ranked mk-deep-loop-guard + mk-spec-memory. Reconciled: bounded single-surface first, then schema/lifecycle, then the dangerous three (deep-loop, goal, cleanup) behind the operator decisions and dry-run gates.
