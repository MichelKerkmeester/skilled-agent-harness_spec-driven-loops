---
title: "Feature Specification: De-vendor design-interface's Apache-2.0 dependency"
description: "design-interface carries a committed Apache-2.0 LICENSE.txt for guidance vendored verbatim from Anthropic's frontend-design skill. This packet rewrites that guidance in original words first, then removes the license and every citing site, in that order."
trigger_phrases:
  - "apache devendoring"
  - "design-interface license removal"
  - "design principles rewrite"
  - "vendored guidance de-vendor"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/001-apache-devendoring"
    last_updated_at: "2026-07-27T14:52:12.976Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec with ordered de-vendor-then-delete steps"
    next_safe_action: "Rewrite design-principles.md guidance in original words (step 1)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/LICENSE.txt"
      - ".opencode/skills/sk-design/design-interface/references/design-process/design-principles.md"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/README.md"
      - ".opencode/skills/sk-design/design-interface/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: De-vendor design-interface's Apache-2.0 dependency
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned — no work started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.opencode/skills/sk-design/design-interface/LICENSE.txt` is the full Apache-2.0 text, committed in the skill's first commit (`c9c2d381c34`) as the compliance artefact for content vendored verbatim from Anthropic's `frontend-design` skill. Nothing regenerates it — there is no script, postinstall hook, or download step — so it persists purely because it is a tracked git object: any checkout, branch switch, or new worktree restores it. As long as `references/design-process/design-principles.md` is genuinely vendored Apache-2.0 text, the license is legally required and cannot simply be deleted.

### Purpose

Remove the Apache-2.0 obligation honestly by de-vendoring the guidance first — rewriting it in original words while preserving its intent — and only then deleting `LICENSE.txt` and every site that cites it. Deleting the license before the rewrite would ship Apache-2.0 content without its required license; this packet's ordering exists specifically to prevent that.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewriting `references/design-process/design-principles.md`'s guidance in original words, preserving its intent (aesthetic direction, grounding, two-pass process, restraint, interface writing).
- `git rm .opencode/skills/sk-design/design-interface/LICENSE.txt` (not a plain `rm` — a plain remove leaves it restorable from `HEAD`).
- Removing the `license: Apache-2.0; see LICENSE.txt` frontmatter line and both provenance citations in `SKILL.md`.
- Removing the licensing Q&A and the `LICENSE.txt` resource-table row in `README.md`.
- Rewriting the attribution line in `design-principles.md` that currently points at `../../LICENSE.txt`.
- Deleting or inverting manual-testing scenario ID-007 (its current PASS condition is "`LICENSE.txt` resolves on disk," which becomes false after this packet), plus its two summary references in `manual-testing-playbook.md`.
- Recording the de-vendor in `design-interface/changelog/`.

### Out of Scope

- Any change to `.gitignore` — an ignore rule would mask the compliance state rather than resolve it, and is explicitly rejected as an approach.
- Any change to the design judgment or routing content of `design-interface` beyond the cited licensing/attribution sites.
- Fixing the hub-wide template/structure conformance gaps — those are `002-design-interface`'s scope, not this packet's.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-interface/references/design-process/design-principles.md` | Rewrite (guidance) + edit (attribution line) | Original-words rewrite of the vendored guidance; attribution line at `:17` rewritten to match the new provenance state |
| `design-interface/LICENSE.txt` | Delete (`git rm`) | The Apache-2.0 text itself, only after the rewrite lands |
| `design-interface/SKILL.md` | Modify | Remove `license: Apache-2.0; see LICENSE.txt` (`:9`) and provenance citations (`:295`, `:345`) |
| `design-interface/README.md` | Modify | Remove licensing Q&A (`:166`) and resource-table row (`:199`) |
| `design-interface/manual-testing-playbook/licensing-and-provenance/licensing-and-provenance-integrity.md` | Delete or invert | ID-007's PASS condition currently depends on `LICENSE.txt` existing |
| `design-interface/manual-testing-playbook/manual-testing-playbook.md` | Modify | Two summary references to ID-007/`LICENSE.txt` (`:68`, `:349`/`:355`) |
| `design-interface/changelog/` | Create (new entry) | Record the de-vendor as a versioned change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `design-principles.md`'s guidance is rewritten in original words before any deletion happens | Diff shows no verbatim Apache-2.0 sentence carried over; intent (grounding, direction, restraint, interface writing) is preserved |
| REQ-002 | `LICENSE.txt` is removed via `git rm`, not a plain `rm` | `git status` shows the deletion staged; the file does not reappear on `git checkout` |
| REQ-003 | Every citing site is removed or rewritten: `SKILL.md:9,295,345`; `README.md:166,199`; `design-principles.md:17` | `rg -n "Apache\|LICENSE.txt"` over `design-interface/` (excluding `changelog/`) returns nothing |
| REQ-004 | Manual-testing scenario ID-007 no longer asserts `LICENSE.txt` exists | ID-007 file is deleted or its PASS condition is inverted to confirm de-vendored state; `manual-testing-playbook.md:68,349,355` updated to match |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | De-vendor recorded in `changelog/` | A new changelog entry describing the rewrite and license removal exists |
| REQ-006 | `.gitignore` is left untouched | `git diff .gitignore` (or equivalent check) shows no change from this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `design-interface` carries no Apache-2.0 obligation — no `LICENSE.txt`, no license frontmatter, no provenance citation.
- **SC-002**: The rewritten `design-principles.md` still teaches the same direction, voice, and process it did before, in original words.
- **SC-003**: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface/ --check` still reports the skill valid after the removal.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewrite drifts from the original intent (loses a rule the guidance depended on) | Interface mode quality regresses silently | Compare rewritten guidance section-by-section against the current text before deleting the license; do not delete until the comparison passes |
| Risk | A citing site is missed | Skill still claims an Apache-2.0 license it no longer needs, or references a deleted file | `rg -n "Apache\|LICENSE.txt"` sweep in checklist as the closing gate |
| Dependency | `changelog/` versioning convention | Entry must match existing `v1.0.0.0*.md` format | Read an existing entry before authoring the new one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The ordering (rewrite, then delete) is never reversed, even under time pressure — this is the packet's core safety property.

### Compliance
- **NFR-C01**: No Apache-2.0 text is shipped without its `LICENSE.txt` at any intermediate commit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **Rewrite cannot preserve intent in original words**: HARD STOP before `git rm LICENSE.txt` — escalate to the operator rather than shipping a lossy rewrite or leaving Apache-2.0 text unlicensed.
- **A worktree or branch restores `LICENSE.txt` mid-packet**: expected, since it is a tracked object until the `git rm` commit lands; re-run the removal, do not treat it as a regression.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding — the ordering and hard-stop condition are fixed by the parent packet's decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md` (de-vendor-then-delete ordering)
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
