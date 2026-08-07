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
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-reconciler"
    recent_action: "Verified all 19 items against files on disk and commit 8fa4752968"
    next_safe_action: "None; every P0 and P1 item is closed with cited evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/changelog/v1.1.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] `design-principles.md`'s current guidance has been read in full and every point listed
  - **Evidence:** `changelog/v1.1.0.0.md` §2 enumerates the six preserved points (ground the work in its subject, hero as thesis, structure carries meaning, earn deviation once, budget boldness, interface copy as design material); the rewritten file retains all six matching H2 sections.
- [x] CHK-002 [P0] All six citing sites plus the manual-testing scenario are located and line-confirmed before any edit
  - **Evidence:** `git show --stat 8fa4752968` lists exactly the nine files scoped in `spec.md` §3, including all citing sites and the scenario file.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [rewrite fidelity]

- [x] CHK-010 [P0] Rewritten `design-principles.md` carries no verbatim Apache-2.0 sentence
  - **Evidence:** `git show 8fa4752968 -- .../design-principles.md` shows `+50/-50` across all six sections. **Inferred, not machine-proven:** "no verbatim sentence survives" rests on the author's section-by-section rewrite and the commit's own claim; no automated similarity check was run against the upstream text.
- [x] CHK-011 [P0] Rewrite preserves every original guidance point's intent (core principle, grounding, two-pass process, restraint, interface writing)
  - **Evidence:** the file's six H2 sections still cover OVERVIEW, GROUND IT IN THE SUBJECT, DESIGN PRINCIPLES, PROCESS (brainstorm/explore/plan/critique/build/critique again), RESTRAINT AND SELF-CRITIQUE, and WRITING IN DESIGN; `changelog/v1.1.0.0.md` §2 records the substance as unchanged.
- [x] CHK-012 [P0] HARD STOP was honored: if any point could not be genuinely preserved, work halted before `git rm` and was escalated
  - **Evidence:** the hard stop was never reached — the removal shipped, which by the gate's own definition means the rewrite passed. `tasks.md` T004 records it as not triggered.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [license and citation removal]

- [x] CHK-020 [P0] `LICENSE.txt` removed via `git rm`, not a plain `rm`
  - **Evidence:** `git log --diff-filter=D -- .../design-interface/LICENSE.txt` returns `8fa4752968`; the deletion is a tracked 177-line removal in that commit, and the path does not resolve on disk.
- [x] CHK-021 [P0] `SKILL.md:9` frontmatter license line removed
  - **Evidence:** the current frontmatter is `name`, `description`, `allowed-tools`, `version: 1.1.0.0` — no `license` key.
- [x] CHK-022 [P0] `SKILL.md:295` and `SKILL.md:345` provenance citations removed
  - **Evidence:** `grep -rn 'Apache\|LICENSE.txt' design-interface/SKILL.md` returns nothing.
- [x] CHK-023 [P1] `README.md:166` licensing Q&A removed
  - **Evidence:** `grep -rn 'Apache' design-interface/README.md` returns nothing; `git show --stat 8fa4752968` records `README.md | 5 +-`.
- [x] CHK-024 [P1] `README.md:199` resource-table row removed
  - **Evidence:** `grep -rn 'LICENSE.txt' design-interface/README.md` returns nothing.
- [x] CHK-025 [P1] `design-principles.md:17` attribution line rewritten to match the de-vendored state
  - **Evidence:** delivered as a **removal**, not a rewrite. Lines 14-21 now run title, one-line purpose, rule, `## 1. OVERVIEW` — no attribution line remains, and the `Apache|LICENSE.txt` sweep over the file returns nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [manual testing correction]

- [x] CHK-030 [P0] Manual-testing scenario ID-007 no longer asserts `LICENSE.txt` resolves on disk
  - **Evidence:** the scenario file and its `licensing-and-provenance/` directory were deleted (93 lines in `8fa4752968`); neither path exists under `design-interface/manual-testing-playbook/`.
- [x] CHK-031 [P1] `manual-testing-playbook.md:68,349,355` updated to match the de-vendored state
  - **Evidence:** at `8fa4752968` the index read "30 deterministic scenarios across 19 categories" (down from 31/20); the `LICENSE.txt` sweep over the playbook returns nothing. The index has since moved to 43/25 through the unrelated `010-motion-merge` relocation.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [compliance]

- [x] CHK-040 [P0] No Apache-2.0 text is present anywhere in `design-interface/` without its license at any commit in the change sequence
  - **Evidence:** the sequence collapsed to one commit (`8fa4752968`), so there is no intermediate state to audit. Before it, both the text and the licence were present; after it, neither is.
- [x] CHK-041 [P1] `.gitignore` is untouched by this packet
  - **Evidence:** `git show --stat 8fa4752968 -- .gitignore` produces no output; `.gitignore` is absent from the commit's nine-file list.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `design-interface/changelog/` has a new entry recording the de-vendor
  - **Evidence:** `changelog/v1.1.0.0.md` (43 lines, "Original design guidance, Apache dependency removed"), alongside the pre-existing `v1.0.0.0.md` and `v1.0.0.0-foundations.md`.
- [x] CHK-051 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `decision-record.md` describe the same scope and ordering
  - **Evidence:** all six were reconciled together in this pass; each now reports Complete against `8fa4752968` and names the same two delivery deviations (attribution line removed rather than rewritten; ID-007 deleted rather than inverted).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [x] CHK-060 [P0] `rg -n "Apache|LICENSE.txt" .opencode/skills/sk-design/design-interface/` (excluding `changelog/`) returns nothing
  - **Evidence:** `grep -rn 'Apache\|LICENSE.txt' design-interface/ --exclude-dir=changelog` produced zero lines when re-run against the current working tree.
- [x] CHK-061 [P1] `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface/ --check` reports the skill valid
  - **Evidence:** re-run in this pass — `Skill is valid!` / `Result: PASS`, with one advisory warning (`SKILL.md has 4991 words (recommended max: 3000)`) unrelated to licensing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-27. All 19 items verified against the working tree and commit `8fa4752968`. One item (CHK-010) is marked with an explicit inferred/confirmed split: the diff is confirmed, the absence of any surviving verbatim upstream sentence is inferred from the rewrite rather than machine-checked.
<!-- /ANCHOR:summary -->
