# Iteration 1: Programme charter baseline

## Focus
Read the mandated starting documents in order and map what the landing, rename and debt-fixes packets already closed, deferred or contradicted. This iteration does not hunt live residue. It sets the exclusion set so later angles do not report already-fixed items as new findings.

## Findings

### F-I1-001 — 054 is a debt packet, not a second decommission. CONFIRMED. P2 (scope)
Packet 054 `spec.md` in-scope list is the six 052 goal-log debt rows, the trigger-index move, the rollback-runbook delete and a behavior-preserving alignment of `runtime/` and `scripts/`. Out of scope includes nesting `scripts/` under `runtime/` and the D5 preserved set. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md:45-57]
Tasks T004-T008 are marked done. T009 (five-agent code alignment and code READMEs) and T010-T012 (typecheck, gates, packet close) are still open. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:47-62]
Smallest fix: keep 054 closed only after T009-T012, or split T009 into its own packet if alignment is still running.

### F-I1-002 — 052 already named debt 054 did not absorb. CONFIRMED. P1 (programme hole)
The 052 goal LOG still lists items that 054 did not take:
- Three sk-doc validator class defects (playbook folder-index READMEs, compiled deep-loop contracts, install-scripts folder README), each failing the same way at `5220257bf7`. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:197-200]
- `validate-command-references.cjs` depends on machine-local ignored sqlite files, so doctor command-reference checks pass only where daemons have run. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:201]
- Eleven deleted runtime hook mirrors in the checkout predate the landing lane and remain "the operator's pending deletion". [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:116]
- `onnxruntime-common` absent from the main checkout `node_modules` while the HF provider resolves it through the skill-root tree. A fresh install was not run. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:208]
D6 says debt includes a skipped gate and a doc or hook that describes or serves a surface that no longer exists. Those four rows meet D6 and sit outside 054. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:60]
Smallest fix: open a follow-up packet (or extend 054) that names each row with an owner. Do not treat 054 close as "decommission debt cleared".

### F-I1-003 — 053 pass-3 P2s cited by the last review report are already gone on the live files. CONFIRMED. P2 (stale review artifact)
`luna-max-pass3/review-report.md` still lists F001 at `README.md:771` (`[mcp-server/]` label) and F002 (four-vs-three dependency arithmetic). [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3/review-report.md:77-114]
Live `README.md:771` now says `stress-test/` and `runtime/` with no `[mcp-server/]` label. [SOURCE: README.md:771]
Live `.opencode/bin/README.md:183` now says "spec-kit runtime's ENV-REFERENCE.md". [SOURCE: .opencode/bin/README.md:183]
Live 053 summary line 56 says "declares three dependencies instead of twelve". [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:56]
The 052 LOG attributes those two P2s to `85d9791eb3`. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:127]
Smallest fix: stamp the 053 review report as superseded for F001/F002, or the next review loop will rediscover closed items.

### F-I1-004 — 053 implementation-summary contradicts itself on whether the rename review ran. CONFIRMED. P2 (evidence)
Limitation 5 says "The ten-iteration review has not run. AC-010 stays open". [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:210-211]
The verification table two screens above says the ten-iteration review PASS'd as lineage `luna-max-pass3`. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:180]
The 052 LOG also records attempt 4 PASS at `556ab01b71`. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:127]
Smallest fix: delete or rewrite limitation 5 so the packet does not claim AC-010 is still open.

### F-I1-005 — 053 left two stale references and an unfinished suite on purpose. CONFIRMED. P2 (carried debt)
Limitation 7: `scripts/tests/workflow-invariance.vitest.ts:150` allowlists a playbook file under a `pipeline-architecture/` directory that does not exist, and two sk-doc fixtures name `system-spec-kit/shared/mcp-server/database`, a path that has never existed. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:222-226]
Limitation 3: the runtime suite did not finish. A scoped run reached 669 passing and 24 failing; 18 failures reproduce on the pre-rename layout and 6 were attributed to interference. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:197-203]
Neither item is in 054's six-row debt list. [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md:47]
Smallest fix: add both to the next debt inventory. Re-run the 24 failing tests in isolation before treating them as rename-safe.

### F-I1-006 — Attempt-1 stalled 053 review report is not at the path the 052 LOG names. CONFIRMED. P2 (artifact)
052 LOG says attempt 1 was kept as `review/lineages/luna-max-pass3.attempt-1-stalled` in worktree 044. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:124]
Read of `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3.attempt-1-stalled/review-report.md` returned not found.
Present reports confirmed by read: `luna-max-pass3` (PASS, 2 P2) and `luna-max-pass3.attempt-3-conditional` (2 P1, 2 P2, later fixed).
INFERRED: attempt-1 and attempt-2 lineages may live only under `specs/` or may have been omitted from the committed tree. What would confirm: a path-specific read of `specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3.attempt-1-stalled/review-report.md` and the attempt-2 sibling.
Smallest fix: either commit the stalled lineages or correct the 052 LOG path.

## Sources Consulted
- specs/system-speckit/052-memory-decommission-landing/goal.md (full)
- .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md (full)
- .opencode/specs/system-speckit/054-decommission-debt-fixes/spec.md (full)
- .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md (full)
- .opencode/specs/system-speckit/054-decommission-debt-fixes/plan.md (lines 1-80)
- .opencode/specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3/review-report.md (findings)
- .opencode/specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3.attempt-3-conditional/review-report.md (findings)
- README.md (mcp-server / stress-test lines)
- .opencode/bin/README.md:183

## Assessment
- newInfoRatio: 1.0
- Novelty justification: First iteration. All charter mappings are new to this packet.
- Confidence: high on document-to-document claims. Medium on whether attempt-1 artifacts exist elsewhere.

## Reflection
- Worked: reading the four mandated packets before grepping live code. That produced an exclusion set (fixed P2s, 054 already-taken rows).
- Failed: treating the 053 PASS review report as current-tree truth. Live files had already moved.
- Ruled out: treating 054 close as "decommission complete". The packet never claimed the leftover D6 rows.

## Dead Ends
- Re-reading the last 053 review report as a live defect list. Two of its P2s are already gone.

## Recommended Next Focus
Angle 1a: live code or config that still serves or describes the retired memory database, memory MCP tools or spec-memory launcher. Search live surfaces only. Exclude advisor MCP and historical spec prose.
