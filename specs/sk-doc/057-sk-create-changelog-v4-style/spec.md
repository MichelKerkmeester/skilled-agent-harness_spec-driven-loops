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

### Concision Pass (2026-09-29)

Entries written to the v4 contract still ran long. The workflow drew content from every completed task, and nothing stopped one fact from appearing in the opening, the glance list, the detail and the upgrade notes. The mode's own v1.3.1.0 entry spent two of its six bullets on playbook scenario IDs and one on docs catching up. The skill's docs had the same habit, stating most rules in two to four places. The operator asked for entries and docs that keep the tone, voice and style but read shorter, leave out unimportant detail and never repeat themselves.
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
- Concision pass: content chosen by reader impact and each fact said once, taught by the template, `SKILL.md` and both command YAMLs' content steps, with two new checks for internal labels and repeated sentences.
- Concision pass: the mode's `SKILL.md`, `README.md`, template and four references rewritten so each rule lives in one place, keeping every section, rule and step number the playbook cites.
- Concision pass: the mode's `changelog/v1.3.2.0.md`, its Hermes copy and the two playbook scenarios whose rule number moved.

### Out of Scope

- Rewriting already-published changelog files to the new style - history stays as written.
- system-spec-kit nested changelog templates (`.skilled/skills/system-spec-kit/templates/changelog/root.md` and `phase.md`) - owned by another packet; nested tone guidance is noted as advisory only.
- New runtime scanner scripts beyond wiring the existing HVR scanner and lightweight structural checks.
- GitHub release mechanics - unchanged boundary already documented in the packet.
- Concision pass: rewriting published entries, v1.3.1.0 included, and the rest of the manual testing playbook.

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
| `.skilled/skills/sk-doc/sk-create-changelog/README.md` | Modify | Concision pass: overview and FAQ merged, one troubleshooting row for long entries |
| `.skilled/skills/sk-doc/sk-create-changelog/references/version-bump-rules.md` | Modify | Concision pass: em dashes removed, shorter prose |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.3.2.0.md` | Create | Concision pass: the mode's entry, written to the new rules |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-line/*.md` | Modify | Concision pass: CHG-008 and CHG-009 cite rule 7, the renumbered release-line rule |
| `.hermes/skills/sk-create-changelog/SKILL.md` | Regenerate | Concision pass: generated copy of the new `SKILL.md` |
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

### Concision Pass Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Content is chosen by reader impact: keep what the reader would notice, act on or decide differently about, and drop test changes, internal labels, process detail and follow-on housekeeping | Template section 3 carries Choose by Reader Impact, both YAMLs carry a SELECT CONTENT step and no source instruction transcribes `tasks.md` items |
| REQ-009 | Each fact is said once: every section has one job, and validation looks for internal labels and repeated sentences | Template section 3 carries Say Each Fact Once, SKILL.md section 9 checks 7 and 8 name both, and the packet checker fails v1.3.1.0 and a planted repeat while the exemplar passes |
| REQ-010 | The skill's docs are shorter with no rule lost and no cited number moved | Total bytes fall, every load-bearing token survives, the router code and keyword line match HEAD byte for byte and every validator passes |
| REQ-011 | The mode releases as 1.3.2.0 with an entry written to the new rules | `SKILL.md` reads 1.3.2.0 and `changelog/v1.3.2.0.md` passes the checker, the voice scan and `validate_document.py --type changelog` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten template, read beside `v4.0.0.0.md`, models the same structure and voice; a changelog generated from it would not look out of place in `.skilled/changelog/system-spec-kit/`.
- **SC-002**: The worked example passes the packet's own validation checks; a deliberately wrong sample (old table format) fails them.
- **SC-003**: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` passes on every rewritten file.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/057-sk-create-changelog-v4-style --strict` returns RESULT: PASSED.
- **SC-005**: After the concision pass, the mode's new entry and the lean worked example carry fewer bullets than the entries they follow, in the same voice, and sk-doc serves compiled routing again once the commit re-mints its manifest.
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
