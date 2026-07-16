# Deep Review Report — 014 docs + stress-test refresh (+ 013 reconciliation, serverInfo fix)

<!-- ANCHOR:deep-review-014-session-work -->
<!-- SPECKIT_TEMPLATE_SOURCE: deep-review/review-report | v1 -->

## 1. Executive Summary

- **Verdict: CONDITIONAL** (hasAdvisories=true)
- **Findings (post-adversarial-adjudication): P0=0, P1=9, P2=9**
- **Iterations:** 20 (4 sequential dimension passes + two 6/7-wide parallel `gpt-5.5-fast --variant xhigh` batches + an adversarial verification pass + a completeness sweep). Stop reason: maxIterationsReached (20/20).
- **Scope:** 73 files from this session's commits only — `014` packet (parent + 4 children), the playbook/feature-catalog/README-cluster/stress-durability artifacts, the `013` continuity reconciliation + 3 changelogs, and the serverInfo `1.7.2→1.8.0` fix.
- **Bottom line:** zero blockers. Every confirmed P1 is a **documentation-accuracy or test-fidelity** issue (no runtime-behavior defects). The shipped code/tests pass; the findings are about docs claiming more/different than the source, tests modeling rather than driving production paths, and packet metadata that lagged the deployed state.

## 2. Planning Trigger

`/speckit:plan` **recommended** (CONDITIONAL verdict, 9 active P1s). The P1s cluster into 4 small remediation workstreams; all are low-risk doc/test edits.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 9, "P2": 9 },
  "remediationWorkstreams": [
    "WS1 doc-accuracy: serverInfo 1.7.2 citation, tool-count 55-vs-36, E429-vs-coalesced, README replay-boundary 'read-only', durability-README catalog-bound (P2)",
    "WS2 playbook-executability: EX-037 includeEmbeddings param, EX-037 scratch-copy restore, EX-039 move-reconciliation scope",
    "WS3 test-fidelity: recycle stress drive real replaySnapshot (or expose __testing hook); checkpoint snapshotFormat assertion; enrichment deferred-row coverage",
    "WS4 packet-metadata: 013 continuity active-child/deployed agreement, stale 'In Progress' graph entity, setup-era frontmatter on 014 children, -32001 changelog wording"
  ],
  "specSeed": "Reconcile session docs/tests to deployed source: version/tool-count/error-code framing, playbook scenario executability, stress-test production-path fidelity, packet completion metadata.",
  "planSeed": "9 P1 + 9 P2 surgical edits across docs + 3 stress .ts; no runtime code changes required except optional __testing replay export.",
  "findingClasses": ["doc-accuracy-drift", "test-isolation", "traceability", "packet-metadata-staleness"],
  "affectedSurfacesSeed": ["feature_catalog/", "manual_testing_playbook/", "mcp_server/README.md", "mcp_server/stress_test/durability/", "013 + 014 spec docs", "changelogs"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### P1 (9 — confirmed by adversarial re-verification)

| ID | Title | File:line | Dim | Recommendation |
|----|-------|-----------|-----|----------------|
| R1-P1-001 | Recycle stress models the proxy `replaySnapshot()` instead of driving it | `mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76` | correctness | Drive `createSessionProxy()` or expose a narrow `__testing` replay hook so the stress exercises the production replay + `-32001` emission. |
| R10-P1-001 | README labels proxy replay boundary "read-only" though `memory_save` is replayable | `mcp_server/README.md:254` | correctness | Reword to "read + idempotent-write tools" (or name `memory_save` dedup semantics). |
| R13-P1-001 | 013 continuity surfaces disagree on active-child / deployed state | `013-…/spec.md:119` (+ graph-metadata `last_active_child_id`) | correctness | Make parent spec, graph-metadata, and child summaries agree (active child = 003; all complete). |
| R3-P1-001 | 014/003 implementation-summary still cites pre-fix serverInfo `1.7.2` | `014/003-readme-cluster-update/implementation-summary.md:72` | traceability | Mark `1.7.2` as historical pre-fix evidence; current state is `1.8.0`. |
| R3-P1-002 | Tool-count contradicts canonical `TOOL_DEFINITIONS.length` | `feature_catalog/feature_catalog.md:48` (says 55; also 54 at :60) | traceability | `TOOL_DEFINITIONS` lists **36** (`tool-schemas.ts:670-716`); fix the catalog count or name the counted surface explicitly. |
| R16-P1-001 | EX-037 requires `includeEmbeddings`, which the strict MCP surface rejects | `manual_testing_playbook/lifecycle/050-…roundtrip.md:35` | correctness | Remove/replace the unsupported parameter so the scenario runs as written. |
| R16-P1-002 | EX-037 says restore into a scratch copy, but `checkpoint_restore` has no per-call scratch | `…/050-…roundtrip.md:71` | correctness | Rewrite to the supported restore flow (or document the real isolation mechanism). |
| R20-P1-001 | Error-code catalog documents active `E429` scan rejections after coalescing replaced them | `feature_catalog/08-…/error-code-reference.md:30` | traceability | `memory_index_scan` now returns `coalesced:true` success (`memory-index.ts:355-365`); frame `E429` as legacy. |
| R9-P1-001 | EX-039 overstates when move reconciliation fires (packet_id + doc-type) | `manual_testing_playbook/maintenance/040-…refinements.md:63` | correctness | Narrow to the real conditions (sibling rename, same basename/grandparent, exactly one old row — `incremental-index.ts:500-579`). |

### P2 (9 — advisories; includes 1 adversarial downgrade)

| ID | Title | File:line | Note |
|----|-------|-----------|------|
| R5-P2-001 | Durability README claims checkpoint catalog stays bounded after v2 restore | `mcp_server/stress_test/durability/README.md:21` | **Downgraded P1→P2** by adversarial pass: the test bounds on-disk dirs, not catalog rows; re-escalate if used as a release gate. |
| R5-P2-002 | Checkpoint stress assertion masks missing `snapshotFormat` (`?? 'v2'`) | `…/checkpoint-v2-contention-stress.vitest.ts:156` | Use `expect(created.snapshotFormat).toBe('v2')`. |
| R11-P2-001 | Enrichment stress overstates backfill coverage for deferred marker rows | `…/enrichment-marker-backfill-stress.vitest.ts:9` | Clarify deferred rows are intentionally skipped. |
| R12-P2-001 | 004 checklist summary marks P2 complete while deferred P2 rows unchecked | `014/004-…/checklist.md:136` | Reconcile checklist summary vs item state. |
| R12-P2-002 | Parent graph-metadata retains stale "In Progress" derived entity | `014/graph-metadata.json:64` | NER entity from pre-completion derive; refresh on next save. |
| R13-P2-001 | 013/001 changelog reads as globally removing `-32001` | `changelog-013-001-self-maintaining-index.md:23` | Scope wording to the index vector-drain outage class only. |
| R18-P2-001 | 001/002 non-checklist docs carry setup-era completion metadata | `014/001-…/spec.md:27` | Refresh setup-era frontmatter to completed state. |
| R18-P2-002 | Setup-era checklist frontmatter conflicts with completed child continuity | `014/001-…/checklist.md:26` | Align checklist frontmatter with completion. |
| R8-P2-001 | Feature catalog labels proxy replayable set "read-mostly" though `memory_save` replays | `feature_catalog/feature_catalog.md:3445` | Same root as R10-P1-001; align terminology. |

## 4. Remediation Workstreams

1. **WS1 — Doc-accuracy drift (P1×4 + P2×3):** serverInfo `1.7.2`→historical (R3-P1-001), tool-count 55→36 / name surface (R3-P1-002), E429→coalesced framing (R20-P1-001, R13-P2-001), replay-boundary "read-only"→"read+idempotent-write" (R10-P1-001, R8-P2-001), durability catalog-bound wording (R5-P2-001).
2. **WS2 — Playbook executability (P1×3):** EX-037 `includeEmbeddings` (R16-P1-001), EX-037 scratch-copy restore (R16-P1-002), EX-039 move-reconciliation scope (R9-P1-001).
3. **WS3 — Test fidelity (P1×1 + P2×2):** recycle stress drive real replay (R1-P1-001), snapshotFormat assertion (R5-P2-002), enrichment deferred coverage (R11-P2-001).
4. **WS4 — Packet metadata (P1×1 + P2×3):** 013 continuity agreement (R13-P1-001), stale graph entity (R12-P2-002), setup-era frontmatter (R18-P2-001/002), 004 checklist summary (R12-P2-001).

## 5. Spec Seed

- A `015-` (or in-place) remediation packet: "Reconcile 013/014 docs + stress tests to deployed source." Scope = doc/test edits only; no runtime change except an optional `__testing` replay export. All edits are additive/corrective to already-shipped artifacts.

## 6. Plan Seed

- WS1: 7 doc edits (feature_catalog ×3, README ×1, error-code ref ×1, 014/003 impl-summary ×1, durability README ×1).
- WS2: 3 playbook scenario rewrites (050 ×2, 040 ×1).
- WS3: 1 stress test rework (recycle) + 2 assertion/wording fixes.
- WS4: 4 metadata reconciliations (013 trio, 014 graph-metadata, 014/001 frontmatter ×2, 004 checklist).
- Verify each with `validate.sh --strict` on touched packets + re-run `npm run stress:durability`; re-grep the cited source anchors.

## 7. Traceability Status

**Core protocols:** `spec_code` — partial pass, confirmed drift (serverInfo, tool-count, replay boundary, move-reconciliation). `checklist_evidence` — drift (004 checklist summary vs items; setup-era frontmatter).
**Overlay protocols:** `feature_catalog_code` — confirmed drift (`feature_catalog.md:48` vs `tool-schemas.ts:670-716`; replay-set labeling). `playbook_capability` — confirmed drift (EX-037, EX-039 broader than source). `skill_agent` — recycle-stress claim vs executable path (R1-P1-001). `agent_cross_runtime` — n/a for this changeset.

## 8. Deferred Items

- All 9 P2s are advisory (non-blocking). R5-P2-001 carries a re-escalation trigger (if the catalog-bound claim is ever used as a release gate).
- The empty coverage-graph meant graph-convergence never gated STOP; the loop ran the full 20 iterations by design (operator requested 20). No silent truncation.

## 9. Search Ledger

- Dimensions covered: correctness, security, traceability, maintainability — each ≥3 passes. Security: **clean across all 3 passes** (0 findings; stress isolation verified to use throwaway temp DBs/sockets, no production `~/.mk-spec-memory` or `daemon-ipc.sock` access, no secret leakage).
- Bug classes searched: test-isolation/fidelity, doc-vs-source drift, version/count traceability, error-code framing, playbook executability, packet-metadata staleness, comment hygiene (clean — no spec-paths/ids in stress `.ts`).
- Ruled out: P0/runtime defects (none found); security exposure (none); comment-hygiene violations (none).
- searchDebt: none. cleanSearchProof: security + comment-hygiene dimensions returned clean with cited evidence.

## 10. Audit Appendix

- **Convergence:** 20/20 iterations; ratios trended down (1.0→0.0 early, 0.14–0.33 in parallel passes) — diminishing returns confirm saturation. No P0 in any pass.
- **Adversarial self-check:** iter 14 re-verified the then-active P1 set: **6 confirmed, 1 downgraded (R5→P2), 0 false-positives**; later P1s (R16×2, R20) evidenced with source anchors.
- **Coverage:** 4/4 dimensions; core + overlay traceability protocols all exercised.
- **Sources reviewed:** stress `.ts` ×4, README cluster ×3, feature_catalog (incl. 5 new files), playbook (6 new EX), `context-server.ts`, `tool-schemas.ts`, `launcher-session-proxy.cjs`, `checkpoints.ts`, `incremental-index.ts`, `memory-index.ts`, 013+014 spec docs, 3 changelogs.

<!-- /ANCHOR:deep-review-014-session-work -->
