---
title: "017: Playbook quality audit (phase parent)"
description: "Phase parent for auditing manual_testing_playbook fairness, mapping mk-spec-memory MCP tool coverage, and authoring deterministic scenarios for uncovered or stale surfaces."
trigger_phrases:
  - "017 playbook quality audit"
  - "manual testing playbook fairness audit"
  - "mk-spec-memory tool coverage audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-playbook-quality-audit"
    last_updated_at: "2026-05-17T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded three-phase playbook audit packet"
    next_safe_action: "Inspect child evidence CSVs and scenario additions"
    blockers: []
    key_files:
      - "001-fairness-audit/evidence/playbook-fairness-audit.csv"
      - "002-tool-coverage-audit/evidence/tool-coverage-audit.csv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000017000"
      session_id: "017-playbook-quality-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: B, new spec folder under 026/017-playbook-quality-audit"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT - only spec.md + description.json + graph-metadata.json at this level. -->

# 017: Playbook quality audit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 2 phase parent |
| Priority | P1 |
| Status | Complete |
| Created | 2026-05-17 |
| Branch | main |
| Parent track | 026-graph-and-context-optimization |
| Predecessor | 016/004 cat-24 fixture surgery and audit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:root-purpose -->
## 2. ROOT PURPOSE

Audit the manual testing playbook as a test corpus, not as prose. The immediate trigger was cat-24 fixture surgery: stale exact IDs, random sampling, aspirational thresholds, and orphaned memory rows made several retrieval-quality scenarios look like model failures when the ground truth itself had drifted.

This packet freezes that lesson into three child phases: a fairness audit, a 42-tool coverage audit, and a scoped expansion pass that adds deterministic scenarios for uncovered mk-spec-memory surfaces.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:sub-phase-list -->
## 3. SUB-PHASE LIST

| Phase | Folder | Runtime note | Outcome |
|-------|--------|--------------|---------|
| 001 | `001-fairness-audit` | Native Codex; cli-codex self-invocation refused by skill guard | CSV inventory for 345 scenarios across 25 category folders |
| 002 | `002-tool-coverage-audit` | Native Codex local sweep | CSV cross-reference for the 42 mk-spec-memory MCP tools |
| 003 | `003-scenario-expansion` | Native Codex local authoring | 15 deterministic scenarios added and 3 cat-24 scenarios repaired/calibrated |
<!-- /ANCHOR:sub-phase-list -->

---

<!-- ANCHOR:what-needs-done -->
## 4. WHAT NEEDS DONE

The packet is complete when:

- `001-fairness-audit/evidence/playbook-fairness-audit.csv` has one row per pre-expansion scenario.
- `002-tool-coverage-audit/evidence/tool-coverage-audit.csv` has one row per requested mk-spec-memory tool.
- `003-scenario-expansion` records deterministic scenario additions for uncovered/happy-path-only surfaces.
- Existing cat-24 repaired scenarios keep the post-016 fixture-surgery pattern: live IDs, deterministic fixtures, calibrated thresholds, and no dependence on orphaned memory rows.

Constraints preserved: stay on `main`, strict-scope staging, `.js` generated helper extension, no `z_archive/**` writes, no auto-rerun of newly authored scenarios.
<!-- /ANCHOR:what-needs-done -->
