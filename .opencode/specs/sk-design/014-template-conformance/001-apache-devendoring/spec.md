---
title: "Feature Specification: De-vendor design-interface's Apache-2.0 dependency"
description: "design-interface carried a committed Apache-2.0 LICENSE.txt for guidance vendored verbatim from Anthropic's frontend-design skill. This packet rewrote that guidance in original words first, then removed the license and every citing site, in that order. Shipped as commit 8fa4752968."
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
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-reconciler"
    recent_action: "Reconciled packet docs against the shipped de-vendor commit 8fa4752968"
    next_safe_action: "None; packet complete and verified against design-interface on disk"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/design-process/design-principles.md"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/README.md"
      - ".opencode/skills/sk-design/design-interface/changelog/v1.1.0.0.md"
      - ".opencode/skills/sk-design/design-interface/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
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
| **Status** | Complete — shipped as commit `8fa4752968` |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.opencode/skills/sk-design/design-interface/LICENSE.txt` was the full Apache-2.0 text, committed in the skill's first commit (`c9c2d381c34`) as the compliance artefact for content vendored verbatim from Anthropic's `frontend-design` skill. Nothing regenerated it — there was no script, postinstall hook, or download step — so it persisted purely because it was a tracked git object: any checkout, branch switch, or new worktree restored it. As long as `references/design-process/design-principles.md` was genuinely vendored Apache-2.0 text, the license was legally required and could not simply be deleted.

### Purpose

Remove the Apache-2.0 obligation honestly by de-vendoring the guidance first — rewriting it in original words while preserving its intent — and only then deleting `LICENSE.txt` and every site that cites it. Deleting the license before the rewrite would ship Apache-2.0 content without its required license; this packet's ordering exists specifically to prevent that.

### Outcome

Both steps shipped in that order inside a single commit, `8fa4752968` ("refactor(sk-design): re-author the interface design guidance in original words"). All six sections of `design-principles.md` were re-authored, `LICENSE.txt` was removed with `git rm`, every citing site was cleared, the licensing-and-provenance manual-testing scenario was deleted, and `changelog/v1.1.0.0.md` records the change. `design-interface` no longer carries any Apache-2.0 obligation.
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

Delivered exactly as scoped, in commit `8fa4752968` (9 files, +80/-332). The `git show --stat` file list matches this table row for row; the only two resolutions the plan left open are noted in the Description column.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-interface/references/design-process/design-principles.md` | Rewrite (guidance) + edit (attribution line) | Original-words rewrite of the vendored guidance across all six H2 sections (`+50/-50`). Delivered: the attribution line was **removed** rather than rewritten, since after the rewrite there was no upstream source left to attribute |
| `design-interface/LICENSE.txt` | Delete (`git rm`) | The Apache-2.0 text itself (177 lines), removed after the rewrite landed in the same commit |
| `design-interface/SKILL.md` | Modify | `license: Apache-2.0; see LICENSE.txt` frontmatter line and both provenance citations removed |
| `design-interface/README.md` | Modify | Licensing Q&A and resource-table row removed |
| `design-interface/manual-testing-playbook/licensing-and-provenance/licensing-and-provenance-integrity.md` | Delete or invert | Delivered: **deleted** (93 lines). Its PASS condition was the presence of `LICENSE.txt`, so inverting it would have preserved a scenario with no remaining subject |
| `design-interface/manual-testing-playbook/manual-testing-playbook.md` | Modify | ID-007 summary references removed; scenario counts reconciled from 31 across 20 categories to 30 across 19 |
| `design-interface/changelog/` | Create (new entry) | `v1.1.0.0.md` — "Original design guidance, Apache dependency removed" |
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

- **SC-001**: `design-interface` carries no Apache-2.0 obligation — no `LICENSE.txt`, no license frontmatter, no provenance citation. **Met** — `LICENSE.txt` does not resolve on disk, and `grep -rn 'Apache\|LICENSE.txt' design-interface/ --exclude-dir=changelog` returns nothing.
- **SC-002**: The rewritten `design-principles.md` still teaches the same direction, voice, and process it did before, in original words. **Met** — the file retains all six H2 sections (OVERVIEW, GROUND IT IN THE SUBJECT, DESIGN PRINCIPLES, PROCESS, RESTRAINT AND SELF-CRITIQUE, WRITING IN DESIGN); `changelog/v1.1.0.0.md` §2 enumerates the preserved substance.
- **SC-003**: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface/ --check` still reports the skill valid after the removal. **Met** — `Result: PASS` ("Skill is valid!"), one unrelated advisory warning about `SKILL.md` word count.
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

- None outstanding — the ordering and hard-stop condition were fixed by the parent packet's decision, and the hard stop was never reached: the rewrite preserved intent, so Phase 2 proceeded as planned.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md` (de-vendor-then-delete ordering)
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
