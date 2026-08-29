# Deep Review Report: 034-spec-template-context-optimizations

**Lineage:** pi-flash-review · sessionId `fanout-pi-flash-review-1786551828250-nkwps1` · executor cli-pi/deepseek-v4-flash · generation 1
**Loop:** 10 iterations, stop-policy max-iterations (convergence telemetry only) · convergence threshold 0.10
**Reviewed:** 2026-08-12T16:30:48Z – 2026-08-12T16:55:00Z

---

## 1. Executive Summary

**Verdict: CONDITIONAL** · active P0=0, P1=8, P2=8 · `hasAdvisories=false` · `releaseReadinessState=in-progress`

The packet is a well-structured Level-2 planning packet for six 033-recommendation optimizations across templates, validation rules, and the memory MCP. The planning quality is high (ADR coverage, refutation-list binding, byte-identical render gate). However, the review found the packet's **current-state claims are contradicted by the working tree**: an uncommitted implementation of all four phases already exists (docs say "Planned — no implementation yet"), and three acceptance criteria (REQ-002 byte-identical render, REQ-004 warn severity, REQ-005 scope rule behavior) are not satisfied by that implementation as it stands. Five P1 findings concern spec-vs-code contradiction or gate failure; three further P1s are structural (phase naming, test coverage, false positives).

Scope reviewed: the packet's six docs plus the referenced implementation surfaces (manifest templates, spec-kit-docs.json, inline-gate-renderer, validate.sh + rules, memory-search/context handlers) as they exist in the working tree.

## 2. Planning Trigger

Verdict CONDITIONAL routes to `/speckit:plan` for remediation. The remediation is unusual: the four implementation phases already exist uncommitted in the working tree, so the primary work is **reconciliation and gate repair** rather than greenfield implementation — (a) decide whether the uncommitted implementation is the sanctioned Phase 1-4 work (commit + update packet docs) or out-of-band drift (revert); (b) repair the three failing acceptance gates; (c) resolve Open Questions 1 and 3 with repo evidence. A PASS would have routed to `/create:changelog`; that is premature while any P1 remains.

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | First/Last | Status |
|----|-----|-----------|-------|----------|-----------|--------|
| F001 | P1 | correctness | Byte-identical render gate RED: golden snapshot suite fails at all levels | scaffold-golden-snapshots.vitest.ts:44 — vitest 4 failures (spec.md Levels 1/2/3/3+); templates carry 2,017-line uncommitted diff; .snap unmodified | 1/1 | active |
| F002 | P1 | correctness | Packet fails its own validate.sh --strict gate (DESCRIPTION_SHAPE) | check-description-shape.sh:11 — exit=2; description.json missing `level` (sibling 033 has `level:1`) | 1/1 | active |
| F003 | P2 | correctness | Stale "944 lines" constant for research.md.tmpl | spec.md:108 — committed 946, working 948, L1 render 175 | 1/1 | active |
| F004 | P2 | correctness | REQ-001 acceptance references nonexistent "level contract" schema field (+ F009 merged: docs entry has no level key) | spec-kit-docs.json:124 — documents entries carry only template/owner/creationTrigger/absenceBehavior | 1/3 | active |
| F005 | P1 | security | Budget enforcement duplicated — local `enforceSearchTokenBudget` instead of shared `enforceTokenBudget` (CHK-006 violation) | memory-search.ts:869/2417 vs memory-context.ts:551/2153 | 2/2 | active |
| F006 | P2 | security | `search_shown` feedback enqueued before token-budget truncation | memory-search.ts:2387 vs 2417 | 2/2 | active |
| F007 | P1 | traceability | Packet docs stale: "no implementation started" vs uncommitted full-phases implementation | implementation-summary.md:54; git status: 10 modified + 2 new files on all §3 surfaces | 3/3 | active |
| F008 | P1 | traceability | REQ-004 "warn severity" unmet — AC_COVERAGE never emits warn status (adjudicated by execution) | check-ac-coverage.sh:172 — under-covered 037 packet: STATUS=pass, validate.sh `+` prefix | 3/6 | active |
| F010 | P1 | maintainability | Cross-doc phase-number collision: plan.md Phase N ≠ tasks.md Phase N | plan.md:70-88 vs tasks.md:39-73 | 4/4 | active |
| F011 | P2 | maintainability | Template consolidation only partially realizes the "shared core" claim | spec.md.tmpl:1 — inline gate markers: 71/30/20/18 | 4/4 | active |
| F012 | P2 | maintainability | AC_COVERAGE manual-infeasible escape hatch undocumented at packet level | decision-record.md:58 vs check-ac-coverage.sh:147 (three-token class match) | 4/4 | active |
| F013 | P1 | correctness | REQ-001 renderer-snapshot acceptance has no automated proof for research.md.tmpl | scaffold-golden-snapshots.vitest.ts:37 — lazyAddonDoc excluded; no test renders research.md.tmpl | 5/5 | active |
| F014 | P2 | correctness | REQ-001 savings lopsided: L1=175 L2=350 but L3/3+/phase stay 944 | research.md.tmpl:152 — measured renders | 5/5 | active |
| F015 | P1 | correctness | Scope-adherence rule false-positives on the packet's own docs | check-scope-adherence.sh:115 — combined change-set of impl + packet docs warns; MK_SCOPE_BASE contract undefined | 8/8 | active |
| F016 | P2 | traceability | REQ-004 and REQ-006 lack dedicated checklist traceability | checklist.md:72 — 0 standalone mentions; only bundled in CHK-011 | 9/9 | active |
| F017 | P2 | traceability | Open Question 1 answerable from repo evidence but kept open (T002 pending) | spec.md:191 — 0 `research.md.tmpl` hits in system-deep-loop; SKILL.md:303/340 workflow-owned | 10/10 | active |

## 4. Remediation Workstreams

| Lane | Findings | Execution order | Notes |
|------|----------|-----------------|-------|
| **L1: State reconciliation** | F007, F002 | 1 | Decide commit-vs-revert of the uncommitted implementation; regenerate description.json with `level` (canonical flow) so the packet passes its own gate. All other lanes assume this decision. |
| **L2: Template/render gate repair** | F001, F013, F014, F004, F003, F011 | 2 | Fix or regenerate golden snapshots (byte-identical proof); add research.md.tmpl render snapshots; reword "944" and "level contract" claims; state the achieved consolidation architecture precisely. |
| **L3: Validation-rule contract fixes** | F008, F015, F012 | 2 | Make AC_COVERAGE actually emit warn (or amend REQ-004 to advisory); fix scope-rule false positives + define changed-files contract (OQ3); document the escape-hatch classification. |
| **L4: Memory budget polish** | F005, F006 | 2 | Reuse shared `enforceTokenBudget` (CHK-006) or refactor to a common module; move feedback enqueue after truncation. |
| **L5: Structural cleanup** | F010, F016, F017 | 3 | Rename tasks.md lifecycle phases or add mapping table; add CHK rows for REQ-004/006; resolve OQ1 with repo evidence. |

## 5. Spec Seed

- REQ-001 acceptance: replace "944 lines" with a reproducible measurement command; add research.md.tmpl render-snapshot coverage; drop or define the "level contract" schema field.
- REQ-002: state the achieved architecture precisely (inline per-template gating vs extracted shared core) and keep the byte-identical gate mandatory.
- REQ-004: either amend acceptance to "advisory (INFO) with message" or require `RULE_STATUS=warn` on under-coverage; document the escape-hatch classification criteria.
- REQ-005: define the changed-files contract (git diff base vs declared paths); declare that the packet's own docs are in-scope for completion change-sets.
- REQ-006: acceptance already met functionally (tests pass); update wording to permit the local-mirror implementation or mandate shared-helper reuse.
- All REQs: reconcile the packet's current-state claims with the working tree.

## 6. Plan Seed

1. (L1) Decide uncommitted-implementation disposition; regenerate description.json; re-run `validate.sh --strict` → target exit 0.
2. (L2) Regenerate golden snapshots after confirming byte-identical renders; add research.md.tmpl snapshots; re-run full vitest suite → green.
3. (L3) Fix AC_COVERAGE status emission + scope-rule declared-set; add fixtures (in-scope incl. packet docs, out-of-scope, under-covered) to a rule-level test.
4. (L4) Consolidate budget helpers; reorder feedback enqueue; re-run memory-search-token-budget.vitest.ts (5/5 must stay green).
5. (L5) Rename tasks.md phases / add mapping; add CHK rows; resolve OQ1 (evidence in this report §F017) and OQ3.
6. Capture regression baseline per phase; re-run the whole authoritative gate after; report delta.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | **fail** | F001 (render gate), F002 (packet's own gate), F007 (doc-vs-worktree), F008 (REQ-004 acceptance), F015 (REQ-005 behavior) |
| `checklist_evidence` | core | partial | No false completion marks (all CHK unchecked — honest); F016 thin REQ-004/006 traceability |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog for this target |
| `playbook_capability` | overlay | notApplicable | No manual-testing playbook for this target |

Required core protocols executed across iterations 1, 3, 6, 8, 9, 10. `gatingFailures` = 1 (spec_code fail).

## 8. Deferred Items

- P2 advisories (F003, F004, F006, F011, F012, F014, F016, F017) — non-blocking, fold into lanes above.
- Blocked checks: none.
- Follow-up: verify committed-state provenance of the uncommitted implementation before L1 decisions; confirm who authored it and whether it is the sanctioned Phase 1-4 work.

## 9. Audit Appendix

**Coverage:** correctness (iterations 1, 5, 7, 8) · security (2) · traceability (3, 6, 9, 10) · maintainability (4). All four configured dimensions covered.

**Convergence replay (telemetry only, stop-policy=max-iterations):** ratios 0.72, 0.60, 0.73, 0.64, 0.55, 0.33, 0.00, 0.50, 0.17, 0.17; rolling avg last 2 = 0.17; MAD noise floor = 0.24 (latest 0.17 ≤ floor → stop vote); dimension coverage 100% with stabilization; composite telemetry would have voted STOP by iteration 7+, but `--stop-policy=max-iterations` was honored — the loop ran all 10 iterations and broadened angles (REQ-001/004/005/006 deep dives, fixture executions) instead of synthesizing early. Replay agrees with the recorded stop reason `maxIterationsReached`.

**Claim adjudication:** F008 re-verified by direct execution on a real under-covered packet (037: 0/9 ACs) — STATUS=pass, validate.sh `+` prefix; severity P1 confirmed, confidence 0.92, downgrade trigger recorded. All other P1s carry file:line evidence verified by re-read.

**File coverage matrix:** 16 files reviewed across 10 iterations (6 packet docs, 10 implementation surfaces); every finding cites file:line observed in this session.

**Verification evidence:** `validate.sh --strict` on the target packet → exit 2 (DESCRIPTION_SHAPE); `npx vitest run scaffold-golden-snapshots.vitest.ts inline-gate-renderer.vitest.ts` → 4 failed/14 passed; `npx vitest run mcp-server/tests/memory-search-token-budget.vitest.ts` → 5/5 passed; AC_COVERAGE + scope-adherence fixtures executed directly with observed status output.

**Reducer reconciliation:** the reducer synthesized `SUMMARY-*` count-only placeholder rows (no evidence) because iteration `findingsSummary` counts exceeded per-record `findingDetails`; these placeholders were dropped at synthesis in favor of the 16 evidence-backed findings above. `deep-review-findings-registry.json` remains the machine-owned mirror; its open-finding list includes the placeholders and should be regenerated from the synthesis-final state before reuse.
