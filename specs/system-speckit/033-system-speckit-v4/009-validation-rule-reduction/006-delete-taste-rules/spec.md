---
title: "Feature Specification: Rules Nothing Reads"
description: "Delete the nine advisory rules that no code path and no downstream workflow consumes, keeping the one that a real consumer depends on."
trigger_phrases:
  - "delete taste rules"
  - "advisory rules with no consumer"
  - "validation rule deletion"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/006-delete-taste-rules"
    last_updated_at: "2026-08-30T08:15:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Deleted nine advisory rules and every reference to them"
    next_safe_action: "Begin the next phase: stop copying derived facts into authored prose"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/references/validation/validation-rules.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rules Nothing Reads

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | 005-framework-doc-matches-behaviour |
| **Successor** | 007-derive-not-grade |
| **Handoff Criteria** | Every deleted rule is gone from the registry, its implementation, its tests and its documentation, and no packet changes verdict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Fifteen rules were registered below error severity. Since phase 1 a warning no
longer fails a run, so none of them could block anything. What they still did
was print: every packet validated carried their output whether or not they had
anything to say, and a reader learns to skim a report that is mostly no-ops.

Measured on a fixed sample of 300 live packets, four of them never produced a
finding at all. `LINKS_VALID` sat behind `SPECKIT_VALIDATE_LINKS`, which nothing
sets, and reported "skipped" 296 times out of 296. `SCOPE_ADHERENCE` needs a
change-set that `validate.sh` never supplies, and reported "not active" 296
times out of 296. `GOAL_SHAPE` was a no-op on 294 of 296 packets, because
almost no packet has a goal document. `PHASE_LINKS` and `PHASE_PARENT_CONTENT`
were no-ops on 259 of 296, since most packets are not phased.

The largest producer, `EVIDENCE_CITED`, fired 92 times, and its check is
satisfied by any sufficiently long string containing a backtick span or a
keyword. The cheapest way to clear it is to write a citation for work nobody
did, which makes it worse than absent.

### Purpose

Remove the rules that no code path and no downstream workflow reads, so that
what the gate prints is what someone should act on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Nine rule registrations, their implementations, their tests, and their
  documentation.
- The remediation-hint map and the two script registries that named them.

**Out of scope**

- `AC_COVERAGE`. It reads like the others and was a deletion candidate until a
  repo-wide check found a real consumer: deep review names it in its completion
  criteria and surfaces its status in synthesis. It stays.
- `evidence-marker-audit.ts`. It is a standalone audit CLI with its own tests,
  not a registry rule. Deleting `EVIDENCE_CITED` leaves the `[EVIDENCE: ...]`
  markers ungraded by validation; this tool still audits their syntax.
- Any rule at error severity. Those decide verdicts and belong to a later phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | A rule is deleted only after a repo-wide search finds no consumer outside its own implementation, tests and docs | P0 |
| REQ-002 | No packet changes verdict as a result of the deletion | P0 |
| REQ-003 | No reference to a deleted rule survives outside historical changelogs | P0 |
| REQ-004 | The test suites stay green without weakening an assertion to accommodate the change | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The registry shrinks from 45 rules to 36, and the report a packet produces
  shrinks by nine lines.
- A fixed 300-packet sample returns byte-identical verdicts before and after.
- A repo-wide search for the nine names returns nothing outside changelogs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| A rule has a consumer outside spec-kit | A downstream workflow silently loses a signal | Searched the whole repository per rule rather than the validation library alone; that search is what saved `AC_COVERAGE` |
| Deleting the only node-format rule strands its execution path | The bridge becomes dead code with a passing test | Confirmed three node rules remain registered; the bridge test now runs against one that ships |
| A test is kept green by loosening it | Enforcement disappears behind a passing suite | Tests for deleted rules were removed with them; no surviving assertion was relaxed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The one judgement this phase required — whether an advisory rule had a
reader — was answered per rule by repo-wide search, and one rule survived it.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `../spec.md` — the parent packet and its phase map
- `plan.md`, `tasks.md` — this phase's approach and execution
<!-- /ANCHOR:related-docs -->
