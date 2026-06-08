# Deep Review Strategy — fan-out lineage opus-1

## Topic
Multi-model deep review (native opus lineage) of the recent daemon-reliability, reap-fix, and hook-portability work across 12 declared files. Single-iteration lineage (maxIterations=1): one comprehensive pass over all four dimensions.

## Review Dimensions
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Completed Dimensions
- [x] correctness — reap-fix logic, hook command shape, codex matcher asymmetry. Verdict: sound; one P2 (F003).
- [x] security — lease O_EXCL mutex, EPERM bail, socket-dir ownership guards, session-scoped ancestry re-proof. Verdict: no findings (positives recorded).
- [x] traceability — spec→code→test for reap + hooks. Verdict: spec_code pass; one P2 coverage gap (F002); checklist_evidence partial.
- [x] maintainability — sibling-launcher divergence, tracked-file hygiene, script naming. Verdict: three P2 (F001, F004, F005).

## Running Findings
- P0: 0 (Δ 0)
- P1: 0 (Δ 0)
- P2: 5 (Δ +5) — F001..F005, all active advisories

## What Worked
- Scoping by the three recent commits (`7c8b221cf3`, `7b082bdcf4`, `3b087a4a25`) then reading the exact diffs before the surrounding code — fast path to the load-bearing change.
- Cross-launcher `grep` parity sweep (reelection/detached/childPid) to classify the code-index stale-reclaim branch as correct-by-design rather than a bug.

## What Failed
- N/A (single pass, no stuck cycles).

## Exhausted Approaches
- Deeper tracing of code-index's SIGKILL-orphan edge — bounded by tethered/mirror-exit design and out of the re-election scope.

## Ruled-Out Directions
- Leaked model-server on reap (release path kills it).
- Permanent transport loss for a connected secondary on fresh-session reap (reconnecting proxy → transient only; downgraded to F002).
- `${CLAUDE_PROJECT_DIR:-$PWD}` wrong-dir fallback (intended best-effort, matches working Devin form).

## Next Focus
Single-iteration lineage complete. For a follow-up: open packet 028 `checklist.md` (close `checklist_evidence`) and read `launcher-session-proxy.cjs` reconnect logic to confirm/escalate F002.

## Known Context
- `resource-map.md not present. Skipping coverage gate` for `skilled-agent-orchestration/139-multi-model-deep`.
- Re-election is default-on via committed runtime configs; spec-memory launcher only. Code-index launcher is non-re-election (tethered, mirror-exit, lease has no childPid).

## Cross-Reference Status
### Core (hard)
- spec_code: **pass** — reap + hook claims resolve to shipped code + asserting test.
- checklist_evidence: **partial** — durability test verified to exist & assert single-writer; packet 028 checklist.md not opened.
### Overlay (advisory)
- feature_catalog_code: **partial** — changelog/RELEASE_NOTES/ENV_REFERENCE reconciliation claimed by commit, not opened.
- skill_agent / agent_cross_runtime / playbook_capability: **N/A** for files target.

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| mk-spec-memory-launcher.cjs | full | reap fix @1482-1502; release path @1372-1385; relaunch abort guard @1332 |
| lib/model-server-supervision.cjs | full | supervisor/crash-loop/socket-ownership guards — sound |
| lib/launcher-ipc-bridge.cjs | full | deep-probe + retry-before-reap — sound |
| lib/launcher-session-proxy.cjs | partial | reconnecting proxy; characterized via callers + test, not opened line-by-line |
| mk-code-index-launcher.cjs | targeted | stale-reclaim branch @916; lease/launch/shutdown confirmed non-re-election → F001 |
| daemon-reelection-adoption-live.vitest.ts | full | proves reap single-writer (lsof) → F002 coverage gap |
| daemon-reelection-release-integration.vitest.ts | partial | release-vs-kill decision (sleeper stand-in) per sibling-test header |
| scripts/session-cleanup.sh | full | session-scoped, re-proves ancestry — sound |
| sk-code/scripts/check-comment-hygiene.sh | full | Python-in-.sh → F005 |
| .claude/settings.local.json | full | hooks portable; allow-list hygiene → F004 |
| .codex/hooks.json | full | hooks portable; matcher asymmetry → F003 |
| .devin/hooks.v1.json | full | hooks portable + $PWD fallback — sound |

## Review Boundaries
- maxIterations: 1 · convergenceThreshold: 0.10 · severityThreshold: P2
- Target files READ-ONLY. Observation-only. No fixes applied.
- Outputs confined to `review/lineages/opus-1/`.

## Non-Goals
- Fixing any finding (report-only).
- Reviewing files outside the 12 declared targets.

## Stop Conditions
- maxIterations=1 reached with all 4 dimensions covered and no P0/P1 → STOP to synthesis.
