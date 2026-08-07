---
title: "Tasks: Phase 006: fleet-wide validation and closeout"
description: "Task list for fleet-wide README validation, per-surface gates, failure fixes, changelog reconciliation, and packet closeout."
trigger_phrases:
  - "phase 006 tasks"
  - "fleet validation tasks"
  - "readme closeout tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/006-validation-and-closeout"
    last_updated_at: "2026-08-04T19:25:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 006 tasks"
    next_safe_action: "Execute the validation inventory, per-surface gates, and closeout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-validation-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 006: fleet-wide validation and closeout

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending. Completed items carry concrete evidence.
- Task IDs: T001–T009. P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Build the validation inventory: list every README touched by phases 004 and 005 from `git diff --name-only`, re-scan the skill tree for any README added since, and tag each entry as standalone or child mode with its source phase [evidence: inventory `50/50` README files, split `11` standalone + `39` child modes]
- [x] T002 [P] Capture the baseline: record the `validate_document.py --type readme` output shape on the mcp-obsidian exemplar and confirm the link guard invocation scope on one changed skill [evidence: `validate_document.py --type readme` reports total issues 0; whole-repo guard baseline recorded with pre-existing unrelated failures]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` over every standalone skill README in the inventory and record per-README results [evidence: `11/11` standalone README validators passed with total issues 0]
- [x] T004 [P] Run the README validator over every child-mode skill README in the inventory and record per-README results [evidence: `39/39` child README validators passed with total issues 0]
- [x] T005 [P] Run the markdown link guard scoped to each changed skill and record per-skill broken-link counts [evidence: direct per-README link probe checked `602/602` links with broken `0`; whole-repo guard baseline remains unrelated]
- [x] T006 [P] Grep HVR violations (em dashes, semicolons, Oxford comma patterns, banned words) across all rewritten READMEs, exempt code-fence lines, and record every exemption [evidence: prose HVR violations `0`; `9` code-fence exemptions recorded]
- [x] T007 [P] Confirm every rewritten README carries a version field and every release version has a changelog entry. Reconcile gaps by adding entries in house style [evidence: version/changelog scan `50/50` complete, gaps `0`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P] Log every gate failure with its root cause, fix it within scope (READMEs, changelogs, phase docs, generated metadata only), and re-run each failed gate to a clean result [evidence: phase-doc defects and `6` HVR prose hits fixed; re-runs clean]
- [x] T009 [P] Close out: write `implementation-summary.md` with the evidence table, regenerate `description.json` and `graph-metadata.json`, refresh changed leaf manifests, run validate.sh on every packet phase folder, and confirm `git diff --check` exits clean [evidence: `57/57` phase folders errors 0, `11/11` leaf manifests refreshed, `git diff --check` clean]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every rewritten skill README validates with zero issues under the README validator, shows zero broken links per changed skill, carries no HVR violations in prose, states a version, and has a changelog entry for its release. Every gate failure is fixed within scope and re-verified clean. The packet closes with an evidence-backed implementation summary, fresh metadata, zero validate.sh errors across all phase folders, and a clean diff check.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-008)
- Plan: `plan.md`
- Validator: `.opencode/skills/sk-doc/scripts/validate_document.py`
- Link guard: `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`
- Human Voice Rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
- Parent packet: `../spec.md` and `../handover.md` (section 6 roadmap)
<!-- /ANCHOR:cross-refs -->
