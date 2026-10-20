---
title: "Feature Specification: Phase 14: handover-docs-promotion"
description: "The automatic in-session handover worked live on five runtimes, but the root README named it in one dense bullet and the command library left out /speckit:handoff. This phase gives the feature a plain highlight, a one-line setup section and correct links on every doc surface that describes sessions, and says plainly how its handoff note differs from a packet's handover.md."
trigger_phrases:
  - "handover docs promotion"
  - "phase 14 handover docs promotion"
  - "endless sessions readme"
  - "turn on endless sessions"
  - "in-session handover docs"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: handover-docs-promotion

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/165-handover-docs-promotion` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-live-hop-and-notice-reason |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, `validate_document.py` passes on every touched doc and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Session relaunch loop specification.

**Scope Boundary**: Documentation only. The markdown surfaces that introduce the framework or describe starting a session, and the `/speckit:handoff` command doc. No code, test or config changes.

**Dependencies**:
- Phase 013's shell shim, outside-loop nudge rule and live hops, which this phase describes.
- The source-of-truth docs: the session-relaunch README, the `bin/` README, the feature catalog entry and the three session-relaunch playbooks.

**Deliverables**:
- A root README highlight, a "What you get" section and a Quick Start setup section for the feature.
- `/speckit:handoff` listed in the root README command library, with the command count corrected.
- A sentence or link on each other surface that describes sessions or the handoff command, and a plain line wherever the handoff note sits near the packet's `handover.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 013 made every interactive runtime launch hop to a fresh session in the same terminal, and live hops passed on Claude Code, Codex, Pi, OpenCode and Hermes. The root README still named the feature in one long bullet under Spec Kit, with no setup steps a reader could copy. Its command library listed 39 entry points and left out `/speckit:handoff`, and its shared hook core list left out `session-relaunch`. The packet's `handover.md` and the relaunch handoff note sat side by side in several docs with nothing saying they are different files.

### Purpose
A reader of the root README learns in one pass that a long session keeps going in the same terminal, which runtimes do it on their own, and the one line that turns it on. Every other doc that describes sessions points to the same setup and keeps the two handoff files apart.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root README: a summary bullet, an "Endless Sessions" subsection under What You Get, a "Turn On Endless Sessions" Quick Start subsection, a `/speckit:handoff` command entry with the corrected count, `session-relaunch` in the shared hook cores, a Hermes plugin note, a FAQ entry and a related-documents link.
- The system-spec-kit README's Session relaunch row: which runtimes hop on their own and how the note differs from `handover.md`.
- The `/speckit:handoff` command doc: the shim removes the need to start the wrapper by hand, and the note is not `handover.md`.
- The commands index: the `handoff.md` tree line and a clearer group description.

### Out of Scope
- Code, tests and config, which phase 013 already shipped.
- `AGENTS.md`, whose only mention is the Gate 3 exemption for handoff notes, a gate rule this phase must not edit.
- The hooks README, `bin/` README, env reference, feature catalog and the three playbooks, which already describe the shim, the symlinked repository and the outside-loop rule.
- The cli-* runtime skills, which dispatch non-interactive runs that the shim passes straight through.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Highlight, Endless Sessions section, Quick Start setup, command entry and count, hook core list, Hermes note, FAQ, related link |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Session relaunch row: automatic runtimes, note versus `handover.md` |
| `.skilled/commands/speckit/handoff.md` | Modify | Shim sentence and note versus `handover.md` |
| `.skilled/commands/README.txt` | Modify | `handoff.md` tree line, group description |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The root README introduces the feature near the top in plain words and gives a setup section with the one-line `source` command, the runtimes that hop on their own, the `/speckit:handoff` runtimes, the symlinked-repository note and a link to the session-relaunch README. |
| REQ-002 | Every fact the docs state matches the source-of-truth docs: the 0.80 default of `SESSION_RELAUNCH_THRESHOLD`, the `SYSTEM_SESSION_RELAUNCH_DISABLED` kill switch, the Hermes plugin switch and config line, no nudge outside the loop and the timeout notice. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The root README command library lists `/speckit:handoff`, and its command counts match the files under `.skilled/commands/`. |
| REQ-004 | Each other doc surface that describes sessions or the handoff command mentions or links the feature, and none says the wrapper must be started by hand or that a handoff is manual by default. |
| REQ-005 | Wherever the relaunch handoff note and a packet's `handover.md` both appear, the doc says which is which. |
| REQ-006 | `validate_document.py` passes on every touched markdown doc, `hvr_scan.py` adds no finding over its baseline, the README audit adds no finding on a touched file and the runtime mirror check passes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of the root README finds the feature in the summary and the setup line in Quick Start without opening another file.
- **SC-002**: The doc validators and the mirror check pass, and the HVR and README-audit findings on touched files equal their baselines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A promotional line overstates the feature | Med | Every claim is copied from the session-relaunch README, and the docs keep auto-compaction named as the fallback |
| Risk | A new anchor link breaks | Low | The Quick Start heading has no emoji, so its anchor is plain, and the cross-file anchor matches the source heading |
| Dependency | Phase 013's shim and live hops | The docs would describe untested behavior | Phase 013 recorded the live hops for all five automatic runtimes |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The root README grows by about 50 lines, in proportion to its other feature sections.

### Security
- **NFR-S01**: No doc tells a reader to export `HERMES_ENABLE_PROJECT_PLUGINS` for the whole shell. The shim scopes it to a wrapped launch.

### Reliability
- **NFR-R01**: Every local link added resolves to a file in the repository.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A reader without the shim: the docs say no session is nudged and auto-compaction stays the fallback.
- A reader in a repository that links `.skilled`: the docs say the symlink counts.

### Error Scenarios
- A hop that stalls: the docs say the record is disarmed and a macOS notice carries the reason and the manual command.

### State Transitions
- A session with no bound packet: the docs say the continuity save runs only when a packet is bound.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Four docs, about 60 lines |
| Risk | 2/25 | Documentation only |
| Research | 4/20 | A grep sweep over every markdown surface |
| **Total** | **11/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
