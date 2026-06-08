# Deep Review Strategy — gpt55-1 Lineage

## Topic

Multi-model deep review of recent daemon-reliability, daemon re-election, reap-before-respawn, and hook-portability work across the 12-file target from the parent review config.

## Review Dimensions

- [x] correctness — covered in iteration 001; one active P1 and one P2.
- [x] security — covered as a trust-boundary sweep over lease/socket handling and hook commands; no active security finding recorded.
- [x] traceability — covered against shared-context claims and the local test matrix; one active P2 test-gap finding.
- [x] maintainability — covered for launcher parity and cleanup scripts; no separate maintainability finding recorded.

## Completed Dimensions

| Dimension | Status | Evidence |
|-----------|--------|----------|
| correctness | CONDITIONAL | F001 P1, F002 P2 |
| security | PASS | Hook commands use project-dir fallback; no secret or shell-injection finding recorded. |
| traceability | PARTIAL | F003 P2; spec_code partial because the O_EXCL mutex claim is stronger than code. |
| maintainability | PASS | Single pass read the launcher/test/support surfaces. |

## Running Findings

| Severity | Active | Delta |
|----------|--------|-------|
| P0 | 0 | 0 |
| P1 | 1 | +1 |
| P2 | 2 | +2 |

## What Worked

- Reading the stale-owner reclaim branch together with the owner-lease writer and the post-write lease reprobe exposed the P1 race without needing speculative runtime assumptions.
- Comparing the release branch with the normal shutdown branch isolated F002 as bounded hardening rather than a release blocker.
- Splitting the live test into its two existing cases made the missing combined secondary-plus-fresh-reap matrix row concrete.

## What Failed

- Treating the local packet spec/checklist as authoritative did not work; they are still template placeholders. The actionable review scope came from `review/shared-context.md` and the parent review config.
- Full convergence was impossible by design because this lineage is capped at `maxIterations=1`.

## Exhausted Approaches

- Hook portability path existence check: all reviewed hook commands use `cd "${<RUNTIME>_PROJECT_DIR:-$PWD}" && node <relative>` and no missing target was found in this pass.
- Dead `SPEC_KIT_DB_DIR` test-isolation candidate: not recorded because the fake-root database directory aligns with the launcher's derived path for the copied launcher.

## Ruled-Out Directions

- P0 classification for F001: not asserted. The race can produce multiple daemons, but the final owner/lease reprobes and heartbeat shutdown reduce immediate certainty of unrecoverable data loss.
- Security finding for bare `node` in hooks: not asserted. The portability rewrite intentionally removed a Homebrew-specific absolute path; PATH dependency is a deployment tradeoff, not a proven defect in this pass.

## Next Focus

Fix or retest F001 first. A follow-up pass should require an atomic stale-owner reclaim mutex or an explicit respawn lock shared by the stale-reclaim path, plus a concurrent stale-owner reclaim live test that starts multiple fresh sessions after owner disposal.

## Known Context

- `review/shared-context.md` states daemon re-election is default-on in runtime configs, owner disposal releases the daemon, and a fresh session should reap the released daemon before respawn to preserve the single-writer invariant.
- `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` are still template scaffolds for this review packet.
- `resource-map.md` not present. Skipping coverage gate.

## Cross-Reference Status

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| spec_code | core | partial | `shared-context.md:7-12`, `mk-spec-memory-launcher.cjs:1482-1502` | Reap behavior exists, but the inline O_EXCL mutex claim is not true for the stale-reclaim branch. |
| checklist_evidence | core | partial | `checklist.md:47-118` | Local checklist is template-only; no checked claim overstates completion, but it does not prove the daemon work. |
| feature_catalog_code | overlay | not run | n/a | Catalog/docs outside the 12-file target were not reviewed in this lineage. |
| playbook_capability | overlay | not run | n/a | Manual playbook outside the 12-file target was not reviewed in this lineage. |

## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | targeted/full-risk | F001, F002 |
| `.opencode/bin/lib/model-server-supervision.cjs` | targeted | F002 descendant-kill timer behavior |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | targeted | Probe/socket behavior checked; no finding |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | targeted | Reconnect/replay classifier checked; no finding |
| `.opencode/bin/mk-code-index-launcher.cjs` | targeted | Lease parity checked; no separate finding |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | full targeted | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts` | full | Release-vs-kill primitives covered; no finding |
| `.opencode/scripts/session-cleanup.sh` | full | Ancestry re-proof checked; no finding |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | full | Checker behavior read; no finding |
| `.claude/settings.local.json` | full | Portable hook commands checked; no finding |
| `.codex/hooks.json` | full | Portable hook commands checked; no finding |
| `.devin/hooks.v1.json` | full | Portable hook commands checked; no finding |

## Review Boundaries

- artifact_dir: `.opencode/specs/skilled-agent-orchestration/139-multi-model-deep/review/lineages/gpt55-1` bound directly from `config.fanout_lineage_artifact_dir`.
- maxIterations: 1.
- No writes outside the lineage artifact directory.
- No `resolveArtifactRoot` node command was run.
- SAVE phase was intentionally not run because it would write continuity outside this lineage directory.
