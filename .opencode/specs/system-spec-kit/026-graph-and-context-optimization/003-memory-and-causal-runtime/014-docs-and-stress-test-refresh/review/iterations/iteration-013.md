# Deep Review Iteration 013

## Dimension

traceability — 013 continuity reconciliation + 3 changelogs accuracy vs deployed reality; 014 parent+children completion-metadata consistency

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` severity definitions and evidence requirements.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104` review scope manifest.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:10` active prior findings for dedupe.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-strategy.md:84` prior traceability findings and exhausted directions.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:15` parent continuity and phase map.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/graph-metadata.json:41` parent graph status and active-child pointer.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair/implementation-summary.md:15` 004 continuity and deployment prose.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair/graph-metadata.json:37` 004 graph status and causal summary.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-001-self-maintaining-index.md:23` selected 013 changelog 001.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-002-checkpoint-v2-file-snapshot.md:23` selected 013 changelog 002.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-in-place-recycle.md:23` selected 013 changelog 003.
- `.opencode/bin/lib/launcher-session-proxy.cjs:18` live `-32001`/`-32002` source anchors.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1018` checkpoint-v2 gate-fix source spot-check.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/spec.md:15` 014 parent completion metadata.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/graph-metadata.json:40` 014 parent graph metadata.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/implementation-summary.md:45` child completion summaries.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/implementation-summary.md:46` child completion summaries.

## Findings by Severity

### P0

None.

### P1

#### R13-P1-001 [P1] 013 continuity surfaces still disagree on active and deployed state

- Claim: The 013 reconciliation claims the phase parent is complete, all five children are shipped/deployed, and no next action is binding, but the same parent and 004 child metadata still preserve older active-child and deploy-gated states.
- Evidence: Parent frontmatter says all five child phases shipped/deployed and no next safe action remains, and the phase map marks `004` and `005` complete shipped+deployed. The same parent `Open Questions` section still says the active child is `002-checkpoint-v2-file-snapshot`, while parent graph metadata points `derived.last_active_child_id` at `003-mcp-front-proxy`. The 004 frontmatter says it was deployed and live DB v30 migrated, but the body says `IMPLEMENTED, NOT DEPLOYED`, `Completed` is deploy-deferred, no dist rebuild/daemon restart/live migration was performed, and limitations still say deployment needs a separate confirmed runtime window. The 004 graph causal summary also says production stays on v29 and v30 is branch-only until a separate daemon restart. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:15`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:39`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:96`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md:119`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/graph-metadata.json:97`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair/implementation-summary.md:15`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair/implementation-summary.md:37`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair/implementation-summary.md:90`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair/implementation-summary.md:154`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair/graph-metadata.json:78`]
- Counterevidence sought: I checked the parent spec, parent graph metadata, 004 implementation summary frontmatter/body, and 004 graph metadata for a single authoritative deployed state. They remain mutually incompatible.
- Alternative explanation: The deploy-deferred 004 body/graph prose may be stale setup text after a later deploy, but it is still in active continuity and graph metadata surfaces consumed by resume/search.
- Final severity: P1.
- Confidence: 0.93.
- Downgrade trigger: Reconcile the parent active-child text/pointer and the 004 deployment status to one source-backed truth, either fully deployed or explicitly not deployed, with matching `graph-metadata.json` and implementation summary continuity.

### P2

#### R13-P2-001 [P2] 013/001 changelog can be read as globally removing `-32001` while the deployed runtime still emits it

- Claim: The selected `013/001` changelog says the async drain “removes the `-32001` error class,” but deployed source now defines `-32001` as the live launcher retryable recycle error. The line later narrows the fix to the vector-drain path, so this is recorded as an ambiguity/advisory rather than a second required-fix error-code finding.
- Evidence: `013/001` describes “outage-safe drain that removes the `-32001` error class” and separately lists “The `-32001` outage class on the vector-drain path.” The deployed proxy source defines `RETRYABLE_RECYCLE_ERROR` with `code: -32001`, and `replaySnapshot()` emits the retryable error frame for non-replayable pending requests during recycle. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-001-self-maintaining-index.md:23`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-001-self-maintaining-index.md:39`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:18`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`]
- Recommendation: Qualify the changelog summary/frontmatter as “removes `-32001` from the index vector-drain outage path only; launcher recycle `-32001` remains live.”

## Traceability Checks

- `spec_code`: FAIL for 013 continuity reconciliation due `R13-P1-001`; parent, child summary, and graph metadata disagree on completion and deploy state.
- `checklist_evidence`: Not re-opened for prior serverInfo/tool-count findings; those remain recorded as `R3-P1-001` and `R3-P1-002` and were not duplicated.
- `feature_catalog_code`: Not re-reported; prior tool-count drift remains active and outside this slice.
- `selected_013_changelogs`: Advisory drift found in `013/001` as `R13-P2-001`. The `013/002` checkpoint-v2 gate-fix claim was spot-checked against `hasMainVectorPayloadTables()` and still matches the source’s `vec_memories`-only gate. The `013/003` front-proxy changelog matches the live proxy’s retryable `-32001` and fail-closed `-32002` anchors.
- `014_parent_children_completion_metadata`: No new finding. Parent and child status/completion fields consistently say complete/shipped. The parent graph `causal_summary` still repeats the historical problem statement (“do not yet describe these capabilities”), but because the same problem statement remains in `spec.md` and the status fields are complete, this pass treats it as low-signal historical context rather than a separate completion-metadata defect.
- `code_graph`: Not used. Prior strategy records stale readiness; this pass used direct reads and exact searches as graphless fallback.

## Verdict

CONDITIONAL. One new P1 blocks a clean traceability pass until 013 continuity/deployment metadata is reconciled; one P2 advisory tightens the selected changelog wording.

## Next Dimension

Next useful pass: targeted reconciliation review after the 013 metadata fix, specifically checking parent `spec.md`, parent `graph-metadata.json`, 004 `implementation-summary.md`, and 004 `graph-metadata.json` against the actual deployed state.

Review verdict: CONDITIONAL
