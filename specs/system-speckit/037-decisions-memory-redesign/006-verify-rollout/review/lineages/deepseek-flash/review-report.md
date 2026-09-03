---
title: "Deep Review Report: 006-verify-rollout (memory-redesign packet, phase 6)"
trigger_phrases: []
---
# Deep Review Report: 006-verify-rollout (memory-redesign packet, phase 6)

**Session:** fanout-deepseek-flash-1787807016319-a8sfw4 · generation 1 · lineage new
**Target:** `specs/system-speckit/037-decisions-memory-redesign/006-verify-rollout` (spec-folder)
**Executor:** cli-devin (deepseek-v4-flash-max) · loop 10/10 iterations · stop policy: max-iterations

---

## 1. Executive Summary

**Verdict: CONDITIONAL** — no active P0; 4 active P1; 9 active P2; `hasAdvisories: true`.

**Scope:** Audit of the EXECUTED constitutional-memory deprecation rollout per the packet's own 61-touchpoint census (004/research.md), the 003/004/005/006 REQ sets, and the 41-path `goal-file-manifest.txt` (WORKSTREAM A).

**Headline:** The deprecation's runtime levers are all correctly off — the constitutional tier is removed from the type/config surface, the search default and indexer/prime scans no longer touch `constitutional/`, the active-row predicate excludes the tier, and the strict schema no longer exposes the deprecated option. What fails is the packet's own close-out story: the verify phase's requirements reference artifacts and states that do not exist (DECISIONS.md; a "deleted" folder), the folder deletion half of the rehome plan was not executed, and load-bearing docs (feature-catalog, playbooks, advisor keyword map, root-doc pointers) still describe the removed layer as current.

**Convergence reason:** maxIterationsReached (composite stop score 0.46 < 0.60; rolling avg 0.025 < 0.08; dimension coverage 4/4 — convergence-adjacent but the configured stop policy is max-iterations).

---

## 2. Planning Trigger

CONDITIONAL → route to `/speckit:plan` for remediation. Primary lanes: (a) reconcile the packet's spec wording with executed state (folder-kept decision record, DECISIONS.md retarget), (b) execute the outstanding census TODO items (feature-catalog rewrite, playbook re-verify, advisor keyword removal, render.ts docstring, 8-file deletion or explicit keep), (c) packet-hygiene close-out (tasks/plan/implementation-summary scaffolds, changelog entry, graph-metadata refresh).

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | First/Last | Status |
|----|-----|-----------|-------|----------|-----------|--------|
| F001 | P1 | correctness | Learned-triggers path live despite 003 REQ-003 "flagged off" claim | `lib/search/pipeline/stage2-fusion.ts:72,794-830`; `lib/search/learned-feedback.ts:480-516`; `tool-schemas.ts:528-535` | 1/10 | active |
| F002 | P2 | maintainability | 26 test/stress files pass removed `includeConstitutional` option; typecheck-excluded | `tests/integration-search-pipeline.vitest.ts:218`; `handlers/memory-search.ts:667-701`; `tsconfig.json` exclude | 1/10 | active |
| F003 | P2 | maintainability | Residual live constitutional literals in runtime modules (partly documented legacy) | `lib/config/type-inference.ts:136,343`; `lib/config/memory-types.ts:113,196`; `lib/cognitive/fsrs-scheduler.ts:374,394`; `lib/feedback/*`; `lib/storage/lineage-state.ts:537,1479` | 1/10 | active |
| F004 | P2 | security | `excludePatterns` raw regex + specFolder canonical-discipline only | `tool-schemas.ts:420-423`; `handlers/memory-search.ts:673-675` | 4/10 | active |
| F005 | P1 | traceability | 004 folder deletion not executed: 8 fully-inlined rule files remain; root docs keep 18 load-bearing links; 006 REQ-003 unsatisfiable as written | `constitutional/comment-hygiene.md:1` (+7 more); `AGENTS.md:41,71,72,90,116,363`; `CLAUDE.md:41,71,72,90,116,363`; 004 spec scope; research.md:161 | 5/10 | active |
| F006 | P2 | traceability | Advisor keyword map retains retired tier keyword | `system-skill-advisor/mcp-server/scripts/skill_advisor.py:2001` | 5/10 | active |
| F007 | P1 | traceability | 006 spec references reversed DECISIONS.md surface in 6 places (REQ-005, SC-003, purpose, risks) | `006-verify-rollout/spec.md:22,66,86,130,140,150`; 002 spec.md continuity (reversal 08:10) | 5/10 | active |
| F008 | P1 | traceability | Feature catalog describes removed constitutional machinery as current (17 refs) | `feature-catalog/feature-catalog.md:1224,1248,3346-3347` | 6/10 | active |
| F009 | P2 | traceability | Manual-testing playbooks still exercise removed constitutional behavior | `manual-testing-playbook/retrieval-enhancements/constitutional-memory-as-expert-knowledge-injection-pi-a4.md:1`; `tooling-and-scripts/constitutional-memory-manager-command.md:1` (+6) | 6/10 | active |
| F010 | P2 | maintainability | 006 packet docs are template scaffolds; changelog deliverable absent; negative-control test never mapped | `006-verify-rollout/tasks.md:1` (T001/T003/implement-core); `plan.md`, `implementation-summary.md` placeholders; no 037 changelog dir | 6/10 | active |
| F011 | P2 | traceability | `goal-file-manifest.txt` omits files where deprecation findings live (memory-search.ts, learned-feedback.ts, stage2-fusion.ts, +4) | `goal-file-manifest.txt:1` vs 004/research.md census | 6/10 | active |
| F012 | P2 | maintainability | Live-but-inert constitutional branches in ranking/normalization paths | `lib/search/hybrid-search.ts:2652`; `lib/search/lexical-normalizer.ts:25-28`; `lib/config/type-inference.ts:343` | 7/10 | active |
| F013 | P2 | maintainability | render.ts:457 docstring still says "constitutional context" (census F1 named TODO) | `system-skill-advisor/mcp-server/lib/render.ts:457` | 8/10 | active |
| F014 | P2 | maintainability | Packet metadata stale vs execution (graph status draft; last_save pre-execution) | `006-verify-rollout/graph-metadata.json:42,197`; `description.json` lastUpdated 08:01:12 | 9/10 | active |

---

## 4. Remediation Workstreams

**Lane 1 — Packet-truth reconciliation (highest priority; unblocks verify close-out):**
- F005: record the folder-keep decision (Option 1 wholesale) in 006 or a decision-record; retarget 004 REQ-003 and 006 REQ-003 wording to the executed state; optionally execute the 8-file deletion per research Option 1.
- F007: retarget 006 spec REQ-005/SC-003/purpose/risks from DECISIONS.md to root-doc steering parity (content already verified present in AGENTS.md/CLAUDE.md).

**Lane 2 — Outstanding census TODO execution:**
- F008: rewrite feature-catalog entries (catalog:1224,1248,3346-3347 and the other 14 refs) to post-deprecation behavior.
- F009: re-verify/rewrite or archive the 8 playbooks referencing removed behavior.
- F006: remove the "constitutional memory" advisor keyword entry (skill_advisor.py:2001).
- F013: rename render.ts:457 docstring.
- F001: either add an explicit learned-trigger disable gate or update 003 REQ-003 wording to "dormant-by-empty-data (census KEEP)".

**Lane 3 — Packet hygiene close-out (006 phase itself):**
- F010: replace tasks.md/plan.md/implementation-summary.md scaffolds; map the negative-control test explicitly (answer the spec's open question); produce the 037 changelog entry.
- F011: reconcile goal-file-manifest.txt with the census file set.
- F014: refresh graph-metadata.json (status, entities, last_save) and description.json.
- F012/F003: mechanical-sweep or document-legacy the inert constitutional branches; keep documented audit/DB-compat literals.
- F002: clean the 26 stale `includeConstitutional` test params (or restore a deprecated-option declaration).
- F004: document a regex budget for `excludePatterns` or compile with timeout.

---

## 5. Spec Seed

- 006 spec.md: REQ-005 → "root-doc steering parity" (drop DECISIONS.md); REQ-003 → reference the kept-as-docs folder state; add executed-state evidence mapping (negative-control test names); resolve the open question.
- 004 spec.md: REQ-003/SC-003 → align with the folder-keep decision (Option 1) or mandate the 8-file deletion.
- 003 spec.md: REQ-003 → "learned-triggers retained per census KEEP, dormant at 0 rows" (or add a flag).

## 6. Plan Seed

1. Add decision record (or 006 spec amendment) documenting: folder kept wholesale as unindexed reference docs; DECISIONS.md retarget; learned-triggers KEEP rationale.
2. Rewrite feature-catalog (17 refs) + 8 playbooks; remove advisor keyword; rename render.ts docstring.
3. Replace 006 scaffolds; create changelog/037 entry; refresh graph-metadata + description.json; update manifest.
4. Clean 26 stale test params; sweep inert branches (hybrid-search CASE, lexical-normalizer groups, type-inference path check).
5. Re-run the post-deprecation gate: full mcp-server suite green + ADR negative control + link check (live verification — deferred from this leaf).

## 7. Traceability Status

| Protocol | Level | Status | Evidence | Findings |
|----------|-------|--------|----------|----------|
| spec_code | core | partial | 003 REQ-001/002 pass (search/prime/indexer verified off); 004 REQ-003 fail (folder not deleted); 006 REQ-003/REQ-005 wording unsatisfiable; 003 REQ-003 wording contradicted | F001, F005, F007 |
| checklist_evidence | core | notApplicable | No checklist.md (Level 1); tasks.md template residue | F010 |
| feature_catalog_code | overlay | fail | 17 constitutional refs; 3+ materially false removed-behavior claims | F008 |
| playbook_capability | overlay | partial | 8 playbooks assume removed capabilities | F009 |
| skill_agent / agent_cross_runtime | overlay | notApplicable | spec-folder target | - |

## 8. Deferred Items

- **H6 DB-row deletion** (21 constitutional rows in context-index.sqlite): cannot be verified statically (requires DB access); must be part of the live post-deprecation gate. The negative control (ADR-shaped default search returns zero constitutional) also requires live execution.
- **003 REQ-004 / 006 REQ-001** (full suite green under new defaults): requires running the mcp-server suite — deferred to operator (leaf has no write authority for repo tooling).
- **G1 BARTER.md links** (6 refs): asserted from census, not re-read (BARTER.md not present in this workspace root read scope) — verify during Lane 1.
- **F004**: hardening suggestion only.
- **F012/F003**: recommended cleanup; inert today.

## 9. Audit Appendix

### Iteration table

| # | Focus | Files | New P0/P1/P2 | Ratio | Status |
|---|-------|-------|--------------|-------|--------|
| 1 | D1 search plumbing & tier deprecation | 11 | 0/1/2 | 0.35 | complete |
| 2 | D1 handlers/hooks/index scope | 15 | 0/0/0 | 0.00 | complete |
| 3 | D1 server/CLI/API/schemas | 6 | 0/0/0 | 0.00 | complete |
| 4 | D2 security | 8 | 0/0/1 | 0.05 | complete |
| 5 | D3 spec_code census | 16 | 0/1/2 | 0.35 | complete |
| 6 | D3 overlays + hygiene | 9 | 0/1/3 | 0.40 | complete |
| 7 | D4 tests/eval/literals | 16 | 0/0/1 | 0.10 | complete |
| 8 | D4 docs census | 9 | 0/0/1 | 0.05 | complete |
| 9 | Broaden: REQ evidence + metadata | 8 | 0/0/1 | 0.05 | complete |
| 10 | Final: adversarial replay + telemetry | 6 | 0/0/0 | 0.00 | complete |

### Convergence signal replay (from JSONL fields only)

- Ratios: 0.35, 0.0, 0.0, 0.05, 0.35, 0.40, 0.10, 0.05, 0.05, 0.0
- Rolling avg (last 2): 0.025 (< 0.08) · MAD vote: pass (no churn) · Dimension coverage: 1.0 (4/4 + protocols attempted)
- Composite: 0.4575 (< 0.60) → no convergence stop; stopped at maxIterationsReached (policy)
- P0 override: not triggered (0 P0)
- Replay verdict: matches recorded synthesis (no false-positive stop)

### File coverage matrix

41/41 manifest paths reviewed (grouped sweeps in iterations 1-9) + 15 discovered extras (learned-feedback.ts, stage2-fusion.ts, memory-search.ts, memory-learned-maintenance.ts, memory-context.ts, memory-crud.ts, memory-ingest.ts, vector-index-schema.ts, search-flags.ts, active-row-predicate.ts, etc.). All manifest paths verified to exist.

### Dimension breakdown

| Dimension | Iterations | Verdict |
|-----------|-----------|---------|
| correctness | 1-3, 10 | CONDITIONAL (F001) |
| security | 4, 10 | PASS (F004 advisory) |
| traceability | 5-6, 9-10 | CONDITIONAL (F005, F007, F008 + advisories) |
| maintainability | 7-8, 9-10 | CONDITIONAL (advisories only) |

### Method notes

Static review only (no repo tooling executed, no files modified outside the lineage artifact dir). Severity math: `min(1, (10*P0 + 5*P1 + P2)/20)` documented per iteration. P0/P1 findings carry typed claim-adjudication packets (F001 iter 1, F005 iter 5, F007 iter 6, F008 iter 6). Registry reconciled at iteration 10 (P1:4, P2:9). UNKNOWN items: H6 DB rows, suite execution, BARTER.md link state — flagged for operator verification.
