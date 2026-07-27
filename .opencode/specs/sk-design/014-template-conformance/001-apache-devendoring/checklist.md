---
title: "Verification Checklist: De-vendor design-interface's Apache-2.0 dependency"
description: "Verification checklist for the ordered de-vendor-then-delete change: rewrite fidelity, license and citation removal, manual-testing correction, and changelog record."
trigger_phrases:
  - "apache devendoring checklist"
  - "design-interface license removal checklist"
  - "design principles rewrite checklist"
  - "vendored guidance de-vendor checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/001-apache-devendoring"
    last_updated_at: "2026-07-27T14:52:12.976Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist, no item checked yet"
    next_safe_action: "Verify CHK-001 once Phase 1 rewrite lands"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/LICENSE.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: De-vendor design-interface's Apache-2.0 dependency
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `design-principles.md`'s current guidance has been read in full and every point listed
  - **Evidence (planned):** `.opencode/skills/sk-design/design-interface/references/design-process/design-principles.md` (full read, point list recorded in the rewrite draft)
- [ ] CHK-002 [P0] All six citing sites plus the manual-testing scenario are located and line-confirmed before any edit
  - **Evidence (planned):** `rg -n "Apache|LICENSE.txt" .opencode/skills/sk-design/design-interface/`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [rewrite fidelity]

- [ ] CHK-010 [P0] Rewritten `design-principles.md` carries no verbatim Apache-2.0 sentence
  - **Evidence (planned):** diff of `design-interface/references/design-process/design-principles.md` against its pre-rewrite content
- [ ] CHK-011 [P0] Rewrite preserves every original guidance point's intent (core principle, grounding, two-pass process, restraint, interface writing)
  - **Evidence (planned):** point-by-point comparison table (original vs. rewrite) attached to the plan's Phase 1 notes
- [ ] CHK-012 [P0] HARD STOP was honored: if any point could not be genuinely preserved, work halted before `git rm` and was escalated
  - **Evidence (planned):** plan.md Phase 1 T004 outcome
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [license and citation removal]

- [ ] CHK-020 [P0] `LICENSE.txt` removed via `git rm`, not a plain `rm`
  - **Evidence (planned):** `git log --diff-filter=D -- .opencode/skills/sk-design/design-interface/LICENSE.txt`
- [ ] CHK-021 [P0] `SKILL.md:9` frontmatter license line removed
  - **Evidence (planned):** `sed -n '1,15p' .opencode/skills/sk-design/design-interface/SKILL.md`
- [ ] CHK-022 [P0] `SKILL.md:295` and `SKILL.md:345` provenance citations removed
  - **Evidence (planned):** `rg -n "LICENSE.txt|Apache" .opencode/skills/sk-design/design-interface/SKILL.md`
- [ ] CHK-023 [P1] `README.md:166` licensing Q&A removed
  - **Evidence (planned):** `rg -n "Apache" .opencode/skills/sk-design/design-interface/README.md`
- [ ] CHK-024 [P1] `README.md:199` resource-table row removed
  - **Evidence (planned):** `rg -n "LICENSE.txt" .opencode/skills/sk-design/design-interface/README.md`
- [ ] CHK-025 [P1] `design-principles.md:17` attribution line rewritten to match the de-vendored state
  - **Evidence (planned):** `sed -n '15,20p' .opencode/skills/sk-design/design-interface/references/design-process/design-principles.md`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [manual testing correction]

- [ ] CHK-030 [P0] Manual-testing scenario ID-007 no longer asserts `LICENSE.txt` resolves on disk
  - **Evidence (planned):** `.opencode/skills/sk-design/design-interface/manual-testing-playbook/licensing-and-provenance/licensing-and-provenance-integrity.md` (deleted, or PASS condition inverted)
- [ ] CHK-031 [P1] `manual-testing-playbook.md:68,349,355` updated to match the de-vendored state
  - **Evidence (planned):** `rg -n "LICENSE.txt" .opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [compliance]

- [ ] CHK-040 [P0] No Apache-2.0 text is present anywhere in `design-interface/` without its license at any commit in the change sequence
  - **Evidence (planned):** commit-by-commit review of the de-vendor sequence (rewrite commit precedes `git rm` commit)
- [ ] CHK-041 [P1] `.gitignore` is untouched by this packet
  - **Evidence (planned):** `git diff .gitignore` (expect empty)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `design-interface/changelog/` has a new entry recording the de-vendor
  - **Evidence (planned):** new file under `.opencode/skills/sk-design/design-interface/changelog/`
- [ ] CHK-051 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `decision-record.md` describe the same scope and ordering
  - **Evidence (planned):** cross-read of all six packet files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P0] `rg -n "Apache|LICENSE.txt" .opencode/skills/sk-design/design-interface/` (excluding `changelog/`) returns nothing
  - **Evidence (planned):** command output attached to `implementation-summary.md`
- [ ] CHK-061 [P1] `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface/ --check` reports the skill valid
  - **Evidence (planned):** command output attached to `implementation-summary.md`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: TBD (packet authored 2026-07-27; no work started, nothing verified yet)
<!-- /ANCHOR:summary -->
