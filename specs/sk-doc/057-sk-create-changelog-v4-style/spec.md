---
title: "Feature Specification: Rewrite sk-create-changelog template and workflow to the v4 narrative style"
description: "The sk-create-changelog template still mandates machine-era sections (Files Changed tables, Test Impact metrics, Schema Changes) and stale paths, so its output no longer matches the narrative house style the v4.0.0.0 changelog established. This packet rewrites the template and workflow so generated changelogs read why-first, carry benefit-led headings, omit unimportant internal detail, and enforce voice at validation time."
trigger_phrases:
  - "changelog v4 style"
  - "sk-create-changelog template rewrite"
  - "changelog narrative format"
  - "changelog omission rules"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rewrite sk-create-changelog template and workflow to the v4 narrative style

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-22 |
| **Branch** | current branch, no worktree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-create-changelog template still models the machine-era changelog format. The global template at `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` mandates Files Changed tables, a Test Impact Before/After metrics table, a Schema Changes table and memory-app-specific category names (`Search`, `Saving Memories`). The v4.0.0.0 changelog for system-spec-kit established a different house style: narrative opening, Why This Release, What's New at a Glance, topical H2 sections with benefit-led H4 headings, inline Breaking markers, and one earned-evidence table in six hundred lines. Generated changelogs have drifted accordingly, and the packet points its "real examples" at dead `NN--component` paths.

The workflow describes voice rules as prose but enforces none of them, and it has no logic for what to leave out, which is the other half of what makes v4 readable.

### Purpose

`/create:changelog` produces changelogs that read like v4.0.0.0: why-first, benefit-led, concise, with enforced tone and explicit omission rules, validated by structural checks and the existing Human Voice scanner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Full rewrite of `assets/changelog-template.md` to the two-tier v4 shape (compact and expanded), with generic topical category guidance and an earned-evidence table rule.
- SKILL.md format contract, voice/style rules, omission decision-aid, validation checks, and success criteria aligned to the new template.
- Worked examples reworked into an annotated v4-style entry; stale paths fixed across the reference set.
- Command surface YAML reconciliation where old snippets contradict the new template.
- Packet version bump to 1.1.0.0 and packet-local nested changelog entry at close-out.
- cli-codex (gpt-5.6 luna xhigh) sub-agent dispatches for drafting review and independent consistency review.

### Out of Scope

- Rewriting already-published changelog files to the new style - history stays as written.
- system-spec-kit nested changelog templates (`.skilled/skills/system-spec-kit/templates/changelog/root.md` and `phase.md`) - owned by another packet; nested tone guidance is noted as advisory only.
- New runtime scanner scripts beyond wiring the existing HVR scanner and lightweight structural checks.
- GitHub release mechanics - unchanged boundary already documented in the packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modify | Full rewrite to the v4 two-tier narrative shape |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Format contract, voice rules, omission aid, validation, success criteria |
| `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md` | Modify | Annotated v4-style global example, fixed paths |
| `.skilled/skills/sk-doc/sk-create-changelog/references/README.md` | Modify | Stale-path and route-map touch-ups |
| `.skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md` | Modify | Stale-format touch-ups only |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modify | Reconcile stale validation snippets |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | Reconcile stale validation snippets |
| `specs/sk-doc/057-sk-create-changelog-v4-style/*` | Create | This packet's docs and nested changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template models the v4 two-tier shape: compact (summary, Why This Release, What's New at a Glance, Upgrade) and expanded (adds topical H2 sections with benefit-led H4 story items, `&nbsp;` separators, inline Breaking markers, Upgrade Notes) | `assets/changelog-template.md` contains both shapes and no longer lists Files Changed, Test Impact, or Schema Changes as default sections |
| REQ-002 | Omission decision-aid exists and is enforceable: file inventories, test metrics, schema churn, and mid-cycle internal experiments are dropped by default; reverted experiments compress to one-line story sentences; tables appear only when measured numbers are the story | SKILL.md and template both carry the keep/drop rules; worked example demonstrates them |
| REQ-003 | Voice and structure rules are concrete and checkable: smart person not a developer, why first, one idea per sentence, HVR punctuation bans, 2-5 word benefit-led headings, bold lead-in bullets, no metrics soup, conciseness caps | SKILL.md validation section names each rule as a check; HVR scanner is wired as the voice gate |
| REQ-004 | Stale references are gone: no `NN--component` paths, dead example pointers replaced with `system-spec-kit/v4.0.0.0.md` as the canonical exemplar, generic category vocabulary replaces `Search`/`Saving Memories` | grep finds no `NN--` or `Saving Memories` in the packet; every relative link target exists |
| REQ-005 | Validation runs before delivery and the packet closes at 1.1.0.0 with a nested changelog entry | validate_document.py passes on rewritten files; version fields read 1.1.0.0; nested entry written via the generator |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Command YAMLs no longer instruct the old header/highlight format; mismatch note in SKILL.md removed or updated to describe the reconciled state | auto and confirm YAMLs align with the template or the SKILL.md note accurately describes any remaining delta |
| REQ-007 | cli-codex consistency review pass runs over template, SKILL.md, and worked examples | Review verdict line recorded in the packet scratch or implementation summary; confirmed findings applied |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten template, read beside `v4.0.0.0.md`, models the same structure and voice; a changelog generated from it would not look out of place in `.skilled/changelog/system-spec-kit/`.
- **SC-002**: The worked example passes the packet's own validation checks; a deliberately wrong sample (old table format) fails them.
- **SC-003**: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` passes on every rewritten file.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/057-sk-create-changelog-v4-style --strict` returns RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | HVR scanner path and invocation in `sk-create-with-human-voice` | Validation wiring points at a wrong path | Verify scanner file exists before wiring; keep a documented fallback |
| Risk | Compact format for small releases loses the files record entirely | Readers lose the file map they had | Keep an optional collapsed appendix pattern for large releases; omission rules state when it earns its place |
| Risk | Downstream consumers (command YAMLs) still reference the old shape | Mixed-format output | REQ-006 reconciliation step |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The user approved tables-as-earned-evidence and the omission direction during planning.
<!-- /ANCHOR:questions -->
