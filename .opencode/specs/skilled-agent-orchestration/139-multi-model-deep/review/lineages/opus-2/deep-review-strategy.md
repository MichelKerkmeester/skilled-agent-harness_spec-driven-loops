# Deep Review Strategy — opus-2 lineage

## topic
Multi-model deep review (opus-2 fanout lineage) of the recent daemon-reliability work:
daemon re-election (release-not-kill on owner disposal), reap-before-respawn on stale-lease
reclaim, mk-code-index reconnecting proxy, hook path-portability, and the live + hermetic
durability tests.

## review-dimensions
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## completed-dimensions
- [x] correctness — single-writer/lease/reap paths traced; no P0/P1; F001, F006 (P2).
- [x] security — owner-scoped cleanup, EPERM-as-live, symlink/ownership guards, session
  ancestry re-proof all verified sound; no findings.
- [x] traceability — shipped behavior matches narrative (spec_code partial, F002);
  cross-runtime hook parity gap (F004).
- [x] maintainability — F002, F003, F005, F007 (P2 test/doc/hygiene advisories).

## running-findings
- P0: 0
- P1: 0
- P2: 7 (F001–F007), all active advisories. Δ from prior: +7 (first pass).

## what-worked
- Reading both launchers in full and tracing the secondary-launcher SIGTERM/exit path to
  confirm lease cleanup is owner-scoped (disproves a tempting "secondary tears down daemon
  lease" P1).
- Comparing mk-spec-memory vs mk-code-index lease/reap symmetry surfaced F001 and F006.

## what-failed
- Could not confirm/deny whether the respawned context-server rebinds a stale UDS without
  reading `context-server.js` (out of 12-file scope) — folded into F002.

## exhausted-approaches
- (none)

## ruled-out-directions
- "Fresh-session reap kills the daemon under a live secondary" → by-design recover-via-
  reconnect; residual risk is the test gap (F002), not a code bug.
- "settings.local.json missing SPECKIT_DAEMON_REELECTION=1" → flag lives in MCP server env,
  not the hooks/permissions file.

## next-focus
Single-iteration cap reached → synthesis. If extended: read context-server.js bind path
(F002), confirm hook intent vs hook_system.md (F004), weigh childPid-in-lease parity for
mk-code-index (F001).

## known-context
- resource-map.md not present. Skipping coverage gate.
- Shared angle brief: review RECENT changes only, prefer high-confidence findings, P0/P1/P2
  rubric per `review/shared-context.md`.

## cross-reference-status
- Core: spec_code = partial; checklist_evidence = N/A (files target, no checklist.md).
- Overlay: agent_cross_runtime = partial (F004); feature_catalog_code / playbook_capability
  = not-run (docs out of scope).

## files-under-review
| File | Coverage | Findings |
|------|----------|----------|
| mk-spec-memory-launcher.cjs | full | none (clean) |
| lib/model-server-supervision.cjs | full | none |
| lib/launcher-ipc-bridge.cjs | full | none |
| lib/launcher-session-proxy.cjs | full | none |
| mk-code-index-launcher.cjs | full | F001, F006 |
| daemon-reelection-adoption-live.vitest.ts | full | F002, F003 |
| daemon-reelection-release-integration.vitest.ts | full | none |
| session-cleanup.sh | full | none (commended) |
| check-comment-hygiene.sh | full | F005 |
| .claude/settings.local.json | full | F004 (cross-ref), F007 |
| .codex/hooks.json | full | none |
| .devin/hooks.v1.json | full | F004 |

## review-boundaries
- maxIterations: 1 (hard cap reached)
- convergenceThreshold: 0.10
- severityThreshold: P2
- artifact_dir: .opencode/specs/skilled-agent-orchestration/139-multi-model-deep/review/lineages/opus-2 (fanout override — bound directly)

## Non-Goals
- Reviewing pre-existing unrelated code outside the recent daemon-reliability changes.
- Reading the daemon (`context-server.js`) or MCP/runtime config files (out of 12-file scope).
- Implementing fixes (observation-only).

## Stop Conditions
- config.maxIterations=1 reached with all 4 dimensions covered and no P0 outstanding.
