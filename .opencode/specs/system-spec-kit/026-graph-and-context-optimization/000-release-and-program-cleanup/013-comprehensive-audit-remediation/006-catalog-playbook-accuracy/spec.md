---
title: "Feature Specification: Phase 6: catalog-playbook-accuracy"
description: "Remediate 10 verified accuracy defects in the feature catalog and manual testing playbook: stale coverage claims, wrong tool count, broken scenario-to-catalog links, garbled contract fields, stale implementation paths, and stale MCP call shapes."
trigger_phrases:
  - "catalog playbook accuracy"
  - "feature catalog defects"
  - "playbook scenario links"
  - "tool count 37"
  - "catalog playbook remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "026/000-release-and-program-cleanup/013-comprehensive-audit-remediation/006-catalog-playbook-accuracy"
    last_updated_at: "2026-06-04T20:45:44Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Fill spec.md with real content from verified backlog"
    next_safe_action: "all fixes complete — handoff to parent cluster"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/24--local-llm-query-intelligence/313-category-overview.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "subagent-F-catalog-playbook-implement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: catalog-playbook-accuracy

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-metadata-status-derivation |
| **Successor** | 007-governance-alignment |
| **Handoff Criteria** | All 10 findings resolved; grep verification clean; validate.sh passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the comprehensive audit remediation specification.

**Scope Boundary**: Markdown and JSON docs inside feature_catalog/**, manual_testing_playbook/**, README.md, and the single test-line in review-fixes.vitest.ts. No .ts source changes except the test expectation.

**Dependencies**:
- Cluster D (F7 dependency: cluster D removes the phase-label strings from tool-schemas.ts and context-server.ts; this cluster qualifies the catalog claim in the interim)
- F9 depends on F6 (both touch 313-category-overview.md; do F6 first)

**Deliverables**:
- All 10 doc/test findings resolved per verified-backlog.json specs
- grep verification evidence per finding

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The feature catalog and manual testing playbook contain 10 verified accuracy defects: universal coverage claims that contradict the measured 69% audit result, a stale tool count (36 vs canonical 37) in five README locations and one test assertion, a release-gate script threshold 4 files short of the real count, five broken scenario-to-catalog cross-links, a garbled scenario contract in scenario 232, stale implementation paths in the local-LLM category overview, a false "cleanup complete" claim about phase-label removal, a wrong verifier script path in scenario 234, stale scenario numbering (401-415 instead of 361-375) in the local-LLM playbook README, and two stale MCP call shapes in scenarios 032 and catalog 253.

### Purpose

Replace all 10 defects with accurate, verified text so the catalog and playbook faithfully reflect the shipped codebase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- feature_catalog/feature_catalog.md lines 3946, 3950 — coverage universality claims (F1, F7)
- feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md line 30 — cleanup-complete claim (F7)
- README.md lines 45, 256, 581, 1003, 1038 — 36-tool -> 37-tool (F2)
- mcp_server/tests/review-fixes.vitest.ts line 117 — toBe(36) -> toBe(37) (F2)
- manual_testing_playbook/manual_testing_playbook.md lines 166, 173 — 380 -> 384 (F3); line 2692 garbled text (F5)
- manual_testing_playbook/02--mutation/019-*.md — broken catalog link (F4)
- manual_testing_playbook/01--retrieval/006-*.md — broken catalog link (F4)
- manual_testing_playbook/01--retrieval/007-*.md — broken catalog link (F4)
- manual_testing_playbook/14--stress-testing/170-*.md — broken catalog link (F4)
- manual_testing_playbook/04--maintenance/036-*.md — broken catalog link (F4)
- manual_testing_playbook/16--tooling-and-scripts/232-*.md lines 18, 21 — garbled contract fields (F5)
- feature_catalog/24--local-llm-query-intelligence/313-category-overview.md lines 40-47 — stale paths (F6, F9)
- manual_testing_playbook/24--local-llm-query-intelligence/README.md — scenario numbers 401-415 -> 361-375 (F9)
- manual_testing_playbook/16--tooling-and-scripts/234-*.md line 38 — wrong verifier path (F8)
- manual_testing_playbook/03--discovery/032-*.md line 37 — stale session_bootstrap call (F10)
- feature_catalog/17--governance/253-*.md line 28 — stale memory_ingest_start call (F10)

### Out of Scope

- Any .ts source file except review-fixes.vitest.ts line 117 (F2 test-only change)
- Removing '[Phase 007]' from tool-schemas.ts or 'Phase 027' from context-server.ts — owned by cluster A

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| feature_catalog/feature_catalog.md | Modify | F1: partial-coverage language; F7: qualify cleanup-complete claim |
| feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md | Modify | F7: qualify cleanup-complete claim in leaf |
| README.md | Modify | F2: 36-tool -> 37-tool (5 occurrences) |
| mcp_server/tests/review-fixes.vitest.ts | Modify | F2: toBe(36) -> toBe(37) |
| manual_testing_playbook/manual_testing_playbook.md | Modify | F3: 380->384; F5: fix garbled line 2692 |
| manual_testing_playbook/02--mutation/019-*.md | Modify | F4: fix broken catalog link |
| manual_testing_playbook/01--retrieval/006-*.md | Modify | F4: fix broken catalog link |
| manual_testing_playbook/01--retrieval/007-*.md | Modify | F4: fix broken catalog link |
| manual_testing_playbook/14--stress-testing/170-*.md | Modify | F4: fix broken catalog link |
| manual_testing_playbook/04--maintenance/036-*.md | Modify | F4: fix broken catalog link |
| manual_testing_playbook/16--tooling-and-scripts/232-*.md | Modify | F5: fix garbled contract fields |
| feature_catalog/24--local-llm-query-intelligence/313-category-overview.md | Modify | F6: stale paths; F9: scenario range |
| manual_testing_playbook/24--local-llm-query-intelligence/README.md | Modify | F9: scenario numbers 401-415 -> 361-375 |
| manual_testing_playbook/16--tooling-and-scripts/234-*.md | Modify | F8: wrong verifier path |
| manual_testing_playbook/03--discovery/032-*.md | Modify | F10: stale session_bootstrap call shape |
| feature_catalog/17--governance/253-*.md | Modify | F10: stale memory_ingest_start call shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-F1 | Replace universal coverage claims in feature_catalog.md with measured ~69% partial-coverage language | grep 'every source file\|Every non-test .ts file' near lines 3946/3950 returns 0 hits |
| REQ-F2 | Update tool count from 36 to 37 in README (5 occurrences) and test file | grep '36-tool' README.md returns 0; test toBe(37) |
| REQ-F3 | Update playbook release gate from 380 to 384 scenario files | bash check block passes; date updated |
| REQ-F4 | Fix 5 broken catalog links in scenario files | ls each target path returns the file |
| REQ-F5 | Replace garbled contract text in scenario 232 and playbook root | grep 'sort -u\`' at lines 18/21/2692 returns 0 hits |
| REQ-F6 | Fix stale paths in 313-category-overview.md SOURCE FILES table | ls shared/embeddings/factory.ts and causal-graph.ts confirm existence |
| REQ-F7 | Qualify cleanup-complete claim in 214 leaf and master catalog | Claim accurately notes two known residual instances; dependency on cluster A noted |
| REQ-F8 | Fix verifier path in scenario 234 from scripts/ to assets/scripts/ | python3 ../sk-code/assets/scripts/verify_alignment_drift.py path resolves |
| REQ-F9 | Update scenario numbers 401-415 to 361-375 in README and 313-category-overview.md | grep '40[1-9]\|41[0-5]' in these files returns 0 hits |
| REQ-F10 | Replace stale MCP call shapes in scenario 032 and catalog 253 | grep 'includeGraphStatus\|dryRun' in these files returns 0 hits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All grep verifications per finding return 0 hits on the removed/replaced text
- **SC-002**: ls confirms all 5 corrected catalog target paths resolve to existing files
- **SC-003**: validate.sh --strict passes with Errors: 0 on this spec folder
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cluster A removing '[Phase 007]' from tool-schemas.ts and 'Phase 027' from context-server.ts | F7 claim accuracy depends on A landing; qualify with known-residual note until then | State the dependency explicitly in the doc |
| Risk | F9 scenario number renames may have additional cross-references | Missed references leave stale numbers | grep all 401-415 refs in the playbook/24 dir before patching |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- F7: Cluster A status — have '[Phase 007]' and 'Phase 027' been removed yet? If yes, the claim can be updated to fully accurate; if no, the qualified language applies.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
