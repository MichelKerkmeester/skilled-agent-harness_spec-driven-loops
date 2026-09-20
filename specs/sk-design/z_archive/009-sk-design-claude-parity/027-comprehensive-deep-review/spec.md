---
title: "Feature Specification: Comprehensive Deep Review — sk-design"
description: "20-iteration autonomous deep review of the entire sk-design hub (all 6 modes: interface/foundations/motion/audit/md-generator/mcp-open-design transport, plus shared/benchmark/feature_catalog/changelog/manual_testing_playbook) for bugs and sk-doc template alignment, via GPT-5.5-fast at high reasoning effort, dispatched in parallel waves of 4-5 iterations."
trigger_phrases:
  - "sk-design comprehensive review"
  - "sk-design 20 iteration review"
  - "sk-design bug sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review"
    last_updated_at: "2026-07-09T09:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "20 iterations + full remediation complete; all checkers pass"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-foundations/SKILL.md"
      - ".opencode/skills/sk-design/design-motion/SKILL.md"
      - ".opencode/skills/sk-design/design-audit/SKILL.md"
      - ".opencode/skills/sk-design/design-md-generator/SKILL.md"
      - ".opencode/skills/sk-design/design-mcp-open-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-009-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Spec folder: new phase (027) under 009-sk-design-claude-parity — confirmed by operator, distinct from the already-closed 10-iteration spec-folder review at 009/review/ (2026-07-06)."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Comprehensive Deep Review — sk-design

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 27 of 27 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `009-sk-design-claude-parity` packet built sk-design to Claude-parity and was closed complete on 2026-07-06, with its own 10-iteration review covering only the spec-folder documentation of packet 009 itself (`009/review/`, status complete, 8 P1 findings recommending a `010-...-remediation` follow-up). Neither that review nor phase 006's template-conformance work for `system-deep-loop` has done a deep, iteration-by-iteration bug/correctness/security/traceability review of the actual `sk-design` skill tree's content — the hub's SKILL.md/mode-registry/hub-router, all six modes' SKILL.md/references/assets/procedures, and the outsized `design-md-generator` backend (2847 files).

### Purpose
Run a genuine 20-iteration autonomous `/deep:review` loop (GPT-5.5-fast, high reasoning effort, forced max-iterations) over the entire `sk-design` skill tree, dispatched in parallel waves of 4-5 concurrent iterations rather than strictly sequentially, covering correctness, security, traceability (including sk-doc template alignment), and maintainability for the hub and each of its packets, then fix whatever real bugs are found.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/{SKILL.md,README.md,command-metadata.json,description.json,graph-metadata.json,hub-router.json,mode-registry.json}` (hub tier).
- `.opencode/skills/sk-design/{design-interface,design-foundations,design-motion,design-audit}/` — the four design-judgment mode packets (SKILL.md, references/, assets/, procedures/).
- `.opencode/skills/sk-design/design-mcp-open-design/` — the transport-axis packet (lighter scrutiny per project convention: "pure transport is exempt" from full design-judgment review, but still checked for correctness/security/traceability as code+docs).
- `.opencode/skills/sk-design/design-md-generator/` (2847 files — backend/, assets/, procedures/, references/, feature_catalog/, manual_testing_playbook/, changelog/; representative sampling disclosed given scale, `node_modules/` excluded).
- `.opencode/skills/sk-design/{shared,benchmark,feature_catalog,changelog,manual_testing_playbook}/` (hub-level cross-cutting dirs).
- sk-doc template alignment across every SKILL.md/README/changelog in the tree.
- Any genuine bug found (logic error, broken reference, incorrect script behavior, security issue) — fixed as part of this pass, not just reported.

### Out of Scope
- `.opencode/specs/sk-design/009-sk-design-claude-parity/review/` — the already-closed 2026-07-06 spec-folder review and its recommended remediation packet; not touched, not re-litigated (don't-rewrite-history).
- `design-md-generator/node_modules/`.
- `.opencode/specs/descriptions.json` and the SQLite/vector daemon index.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| Any file under `.opencode/skills/sk-design/` with a genuine finding | Modify | Fix confirmed via the review loop's claim-adjudication + independent re-verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | 20 forced review iterations complete, dispatched in parallel waves of 4-5 | `deep-review-state.jsonl` shows 20 `type:"iteration"` records, all passing `verify-iteration.cjs` |
| REQ-002 | All 4 review dimensions covered for the hub and each of the 6 modes | `deep-review-strategy.md` dimension coverage table shows correctness/security/traceability/maintainability touched for each area |
| REQ-003 | Every confirmed P0/P1 finding is fixed and independently re-verified | `review-report.md` Active Finding Registry shows 0 open P0/P1 after remediation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-004 | sk-doc template alignment checked fresh, not assumed from any prior review | Fresh `package_skill.py --check` (per mode packet) + `parent-skill-check.cjs` (hub) runs as part of the review |
| REQ-005 | No regression introduced by any fix | Relevant test suites re-run after fixes, pre-existing vs new failures distinguished |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20/20 iterations complete, mechanically valid (narrative + state + delta artifacts), dispatched across 5 waves of parallel agents.
- **SC-002**: Final packet verdict (PASS/CONDITIONAL/FAIL) stated with real evidence.
- **SC-003**: Every real bug found is either fixed-and-verified or explicitly deferred with the operator's approval — none silently dropped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `deep_review_auto.yaml`'s phase_loop contract | Same hand-driven orchestration proven twice this session (5-iter and 20-iter sequential runs), now adapted for wave-parallel dispatch | Reduce/convergence/strategy-update steps run once per wave instead of once per iteration; per-wave prompts scoped to non-overlapping areas so concurrent iterations don't duplicate coverage |
| Risk | `design-md-generator`'s 2847 files far exceed any area reviewed so far this session | Under-sampling could miss real bugs in the largest, highest-risk (executable backend) area | 4 of 20 iterations dedicated to it specifically (vs. 1 combined pass for smaller areas), explicit sampling disclosure in the review report |
| Risk | Parallel iterations within a wave cannot see each other's live findings | Two agents in the same wave could pick overlapping sub-areas | Per-wave prompts assign disjoint file sets up front, not left to agent discretion |
| Risk | Known reducer bug (`reduce-state.cjs` silently drops registered findings) reproduced twice already this session | Remediation could scope against an incomplete registry | Manually cross-check the raw `deep-review-state.jsonl` against the auto-generated registry before remediation, per established this-session practice |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding — spec-folder placement confirmed by the operator (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
**Given**
**Given**
**Given**
**Given**
**Given**
-->
