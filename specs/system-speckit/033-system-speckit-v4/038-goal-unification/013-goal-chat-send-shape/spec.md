---
title: "Feature Specification: Phase 13: goal-chat-send-shape"
description: "A session resent a parent goal in chat with every anchor, template comment, divider and section number, because each goal send surface said to send the durable slice minus its frontmatter and none bounded the sent text. This phase defines the chat slice and a 4,000-character send cap and states both wherever an agent decides what goal text to send."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "goal chat slice"
  - "parent goal chat send cap"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: goal-chat-send-shape

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-open-items-research |
| **Successor** | None |
| **Handoff Criteria** | Every goal send surface names the chat slice and the 4,000-character cap, and the goal suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Goal unification specification.

**Scope Boundary**: What an agent sends in chat when it resends a parent goal: the rule text on every instruction surface, the chat slice renderer and the goal template. Injection payloads, the file-side budget and the existing packet goal files keep their current behavior.

**Dependencies**:
- The operator's requirement that a parent goal sent in chat never exceeds 4,000 characters and carries no anchors or other file scaffolding.
- The read-only audit of every goal send surface that preceded this phase.

**Deliverables**:
- A chat slice that drops heading section numbers, proven by a test that failed before the change.
- The chat slice definition and the 4,000-character cap in `AGENTS.md`, the spec-kit `SKILL.md`, the set-string playbook, the goal template, five speckit workflow assets and the resend reminder.
- A regenerated lazy-goal golden snapshot.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A session bound to a phase parent edited a criterion and resent the parent `goal.md` in chat. It followed the file's own resend paragraph and pasted the durable slice verbatim: the H1, the template source and voice-rule comments, every anchor marker, the `---` dividers and the numbered section headings. The operator asked for a copy under 4,000 characters without anchors or dividers, then set a 2,846-character version with unnumbered headings.

The audit found no surface that stated either rule. `AGENTS.md`, the spec-kit `SKILL.md`, the set-string playbook, the goal template, the speckit workflow assets and the injected resend reminder all said to send the durable slice with the frontmatter excluded, and the validator defines that slice with anchors and comments included. Nothing bounded the sent text either: six top-level packet goals exceed 4,000 characters in the file today.

### Purpose

An agent deciding what goal text to send meets both rules at that point. The chat slice carries no frontmatter, HTML comments, anchor markers, dividers or section numbers, and a parent goal over 4,000 characters is cut before it is sent.

### Amendment to Frozen Decisions

This phase amends wording the goal unification program froze. The frozen records themselves are not rewritten.

- **Parent decision D3** says frontmatter is never sent to chat. That still holds, and the chat slice now also drops comments, anchor markers, dividers and heading section numbers.
- **Parent decision D6** bounds the parent durable slice in the file at 3,000 and 4,000 characters. That still holds, and the same 4,000 figure now also bounds the text an agent sends.
- **ADR-003** in `002-decisions-and-contract-freeze/decision-record.md` names the durable slice as the chat payload. The chat payload is now the chat slice that `renderChatSlice` produces.
- **ADR-008** in the same record quotes the `AGENTS.md` posture row as resending the stripped slice. The row now names the chat slice, states the cap and overrides the resend wording inside existing `goal.md` files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `renderChatSlice` drops heading section numbers, and the resend reminder names the chat slice and the 4,000 figure.
- The chat slice definition and the cap on every instruction surface an agent reads before it sends a goal.
- The goal template's resend paragraph and the lazy-goal golden snapshot.
- Row 13 and its handoff row in the parent's phase map, the parent's binding row and this phase's child goal.

### Out of Scope
- New length enforcement code. The operator decided the rule lives in the docs and in the reminder.
- Rewriting the resend paragraphs inside existing packet `goal.md` files. The `AGENTS.md` override clause covers them.
- Rewriting the ADR text recorded in phase 002.
- Injection payloads, which already carry the pointer and criteria projection under a 4,000-character objective cap.
- Descriptive docs that restate the resend rule without instructing a send, such as the goal hook README and `hook-system.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Modify | Chat slice drops heading section numbers, reminder names the chat slice and the cap |
| `.opencode/hooks/goal/lib/goal-slice.test.cjs` | Modify | New chat slice case, updated heading assertions, reminder cap assertion |
| `AGENTS.md` | Modify | Goal posture row defines the chat slice, states the cap and overrides file wording |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | Goal paragraph renders the chat slice under the cap |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modify | Section 5 defines the chat slice and adds the cap |
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Modify | Operator copy paragraph |
| `.opencode/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Modify | Resend payload, Claude Code and Codex bind lines, objective shape note |
| `.opencode/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml` | Modify | Resume reminder |
| `../goal.md`, `../spec.md` | Modify | Binding row 013, phase map row 13 and its handoff row |
| Snapshot, Hermes skill copy, trigger index, metadata | Regenerate | `scaffold-golden-snapshots.vitest.ts.snap`, `.hermes/skills/system-spec-kit/SKILL.md`, `trigger-index.json` and its fixtures, `description.json` and `graph-metadata.json` here and in the parent |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The chat slice carries no frontmatter, HTML comment, anchor marker, `---` divider or heading section number, and it keeps the title, tables and bullets. |
| REQ-002 | Every instruction surface that tells an agent what goal text to send names the chat slice and states that a parent goal over 4,000 characters is never sent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The goal template's resend paragraph carries both rules, and the lazy-goal snapshot matches the template. |
| REQ-004 | The parent binds this phase's child goal and stays under the 4,000-character error tier. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .opencode/hooks/goal/lib/goal-slice.test.cjs` passes, and its new chat slice case failed before the change.
- **SC-002**: `goal.cjs packet` on the parent prints a `chat_slice` with no `<!--`, no divider line and no numbered heading.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 167 existing goal files keep their older resend paragraphs, and 79 of them say to resend the full text | An agent reading only the file follows the old wording | The `AGENTS.md` row loads on every turn and overrides the file wording |
| Risk | The parent slice sits at 3,990 characters | The next binding row crosses the error tier | The next row needs a real cut in the playbook's Section 4 order |
| Dependency | Runtimes that load the goal module in-process | They keep the old reminder text until restarted | The docs carry the same rule without the reminder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 10. OPEN QUESTIONS

- Should a nested phase parent report a real `packet_budget` instead of `unknown`? `isPhaseChild` in `goal-slice.cjs` treats a nested phase parent as a child, while the validator applies the budget to it. Recorded, not changed in this phase.
<!-- /ANCHOR:questions -->
