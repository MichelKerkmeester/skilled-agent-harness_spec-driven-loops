# Deep Review Strategy: gpt55-2

## Topic

Multi-model deep review of recent daemon-reliability, reap fix, hook portability and Barter sync work.

## Review Dimensions

| Dimension | Status | Notes |
|-----------|--------|-------|
| correctness | complete | One active P1 and one active P2 found in the stale-reclaim reap path. |
| security | pending | No full security iteration in this max-1 lineage. |
| traceability | partial | One checker-policy gap found; spec docs are template placeholders and cannot validate acceptance claims. |
| maintainability | pending | No full maintainability iteration in this max-1 lineage. |

## Completed Dimensions

| Iteration | Dimension | Verdict | Summary |
|-----------|-----------|---------|---------|
| 1 | correctness | CONDITIONAL | Fresh-session stale reclaim can reap a daemon still serving a live secondary; two P2 follow-ups recorded. |

## Running Findings

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 |
| P2 | 2 |

## What Worked

- Direct reads of the release path, stale-reclaim branch, live adoption test, and fresh-session single-writer test exposed a combined scenario not covered by either test alone.
- Running the hygiene checker against both target launchers confirmed the reversed packet-label gap is not theoretical.

## What Failed

- Code graph was stale, so structural graph answers were not used for finding evidence.
- The packet spec docs remain scaffold placeholders, so checklist evidence could only be marked partial.

## Exhausted Approaches

- Treating missing `SPECKIT_DAEMON_REELECTION` in hook JSON as a finding was ruled out; the documented default-on switch lives in MCP runtime configs, not these hook files.

## Ruled-Out Directions

- `check-comment-hygiene.sh` being Python with a `.sh` extension was not reported; repo docs and tests consistently invoke it with `python3`, so it is convention noise.

## Next Focus

| Dimension | Files | Reason |
|-----------|-------|--------|
| security | `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/lib/launcher-ipc-bridge.cjs`, runtime config files | Validate legacy lease trust boundaries, stored socket paths, and hook command portability. |

## Known Context

- Parent config review target is a 12-file recent-change surface covering daemon re-election/reap, reconnecting proxies, cleanup, comment hygiene, and hook portability.
- `resource-map.md` was not present in the spec folder at init. Skipping coverage gate.
- Memory resume surfaced only scaffold continuity: recent action "Initialized Level 2 template" and next safe action "Replace continuity placeholders".

## Cross-Reference Status

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | Shared context claims are materially supported for release and fresh reap separately, but F001 identifies an uncovered combined-session scenario. |
| checklist_evidence | partial | `checklist.md` is scaffolded with unchecked generic items; no acceptance evidence rows exist for these recent changes. |
| feature_catalog_code | partial | Feature catalog claims default-on via runtime configs; runtime configs were outside this lineage's file target except hook configs. |
| playbook_capability | not_applicable | No playbook execution in this max-1 lineage. |

## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | targeted | Release path, stale-reclaim branch, reap helper, lease writes, and legacy layout comments. |
| `.opencode/bin/lib/model-server-supervision.cjs` | targeted | Process liveness and reap primitives referenced through launcher behavior. |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | targeted | Deep probe and bridge decision reviewed for interaction with stale reclaim. |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | targeted | Reattach behavior reviewed as mitigation, not a full no-drop guarantee. |
| `.opencode/bin/mk-code-index-launcher.cjs` | targeted | Stale-reclaim parity and reversed packet-label comment. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | full | Confirms separate secondary-survival and fresh-session-reap scenarios, not their combination. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts` | targeted | Confirms release-vs-kill primitive coverage. |
| `.opencode/scripts/session-cleanup.sh` | full | Bash syntax passed; ancestry re-proof appears sound. |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | full | Checker misses `096 packet` ordering. |
| `.claude/settings.local.json` | full | Hook commands are repo-relative via project-dir `cd`. |
| `.codex/hooks.json` | full | Hook commands are repo-relative via project-dir `cd`. |
| `.devin/hooks.v1.json` | full | Hook commands are repo-relative via project-dir `cd`. |

## Review Boundaries

- `config.maxIterations` was 1, so the loop stopped by `maxIterationsReached`, not convergence.
- No files outside `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/review/lineages/gpt55-2` were modified.
- Target files were read-only.

## Non-Goals

- Do not implement fixes during the review.
- Do not merge sibling lineage findings into this lineage's registry.

## Stop Conditions

- Stop after one iteration per `config.maxIterations: 1`.
- Synthesize with `CONDITIONAL` if any P1 remains active.
