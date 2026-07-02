---
title: "Feature Specification: Validate.sh Template-Scaffold Detection"
description: "Add a new validate.sh check detecting never-touched-since-scaffold docs (title/packet_pointer/last_updated_by scaffold markers), distinct from the existing PLACEHOLDER_FILLED bracket-text check."
trigger_phrases:
  - "validate.sh template detection"
  - "scaffold never touched check"
  - "template author last_updated_by"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/010-validate-sh-template-detection"
    last_updated_at: "2026-07-01T08:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from research.md F-010 (Tier2 #18)"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation to MiMo v2.5 ultraspeed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Validate.sh Template-Scaffold Detection

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 10 |
| **Predecessor** | 009-convergence-design-and-hardening |
| **Successor** | 011-synthesis-integrity-and-orchestrator-watchdog |
| **Handoff Criteria** | A new validate.sh rule flags a doc whose scaffold-signature markers (title `[template:...]`, `packet_pointer: "scaffold/..."`, `last_updated_by: "template-author"`) are still present alongside a Complete status claim |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several folders in this packet carried `Status: Complete` while their `plan.md`/`tasks.md`/`implementation-summary.md` were still byte-identical, untouched scaffold templates — confirmed directly for `008-loop-systems-remediation/tasks.md` and `implementation-summary.md` (title literally `"[template:level_1/tasks.md]"`, `packet_pointer: "scaffold/008-loop-systems-remediation"`, `last_updated_by: "template-author"`), and for 3 other folders per `research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-010). The existing `validate.sh` `PLACEHOLDER_FILLED` rule checks for `[bracketed prose placeholder]` text but does not check these specific scaffold-signature markers, so a doc whose BODY text happens to be non-bracketed (or was partially edited) but whose frontmatter still screams "never touched" can pass validation while claiming Complete.

### Purpose
Add a distinct, narrowly-targeted validate.sh check that flags exactly this signature — scaffold-origin frontmatter markers still present on a doc whose parent/self claims Complete status — so this class of drift is caught automatically going forward, complementing (not replacing) the existing PLACEHOLDER_FILLED rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New validate.sh rule (e.g. `SCAFFOLD_NEVER_TOUCHED`) checking each required doc (`plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`) for: title containing `[template:`, `_memory.continuity.packet_pointer` starting with `"scaffold/"`, or `_memory.continuity.last_updated_by == "template-author"` — flagged as an error when the folder's own `spec.md` claims `Status: Complete`.
- Add the rule to the existing rule-severity table (mirroring `RULE_SEVERITY_PLACEHOLDER_FILLED`) and to the printed summary output format.

### Out of Scope
- The other 5 systemic-prevention checks from Tier 3 (phase-map sync, completion_pct sync, packet-id consistency, ADR-folder completeness, comment-hygiene lint) — those are explicitly deferred to a future phase per the parent's own scope note; this phase adds ONLY the template-detection check named in Tier2#18.
- Retroactively fixing every file this new check would flag — that's covered by child 007 (008-parent scaffolds) already; this phase adds the DETECTOR, not the fix for every instance.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modify | New `SCAFFOLD_NEVER_TOUCHED` rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | New rule detects the exact scaffold-signature pattern | Running validate.sh against a fixture folder with `packet_pointer: "scaffold/..."` + `Status: Complete` fails with the new rule; a genuinely-complete, real folder passes |
| REQ-002 | Rule is additive, not a replacement | Existing `PLACEHOLDER_FILLED` and all other rules still run and behave identically |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running validate.sh against `008-loop-systems-remediation` BEFORE child 007's fix would fail with the new rule (confirming it would have caught this exact drift); running it AFTER child 007's fix passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | This phase's own validation depends on child 007 having already fixed 008's scaffolds | If run before 007, the new rule will (correctly) flag 008 as still broken | Sequence after 007 per the parent's Predecessor field |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by `research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-010) and §5#18.
<!-- /ANCHOR:questions -->
