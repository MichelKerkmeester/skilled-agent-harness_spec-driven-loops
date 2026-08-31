---
title: "Feature Specification: Phase 6: Command and Hub Wiring"
description: "The mode packet exists and nothing can reach it. This phase registers it across four hub files, authors /create:repo-rule through sk-create-command rather than by hand, and restores the cross-runtime mirror a sibling packet already lost once to a dangling symlink."
trigger_phrases:
  - "command wiring"
  - "hub registration"
  - "mode registry"
  - "create repo-rule command"
  - "cross-runtime mirror"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: Command and Hub Wiring

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-agents-md-integration |
| **Successor** | 007-validation-and-changelog |
| **Handoff Criteria** | The command resolves in both runtime directories and all four hub files name the mode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the create-repo-rule packet, and the first that makes it reachable.

**Scope Boundary**: the command and its assets, four hub registration files, and the
cross-runtime mirror. No change to the mode's own documents.

**Dependencies**:
- `sk-create-command` owns slash-command authoring per the mode boundary; this phase calls it.
- Phases 3 through 5 complete, so the mode has something to route to.

**Deliverables**:
- `/create:repo-rule` with its router `.md` and three assets.
- Entries in `mode-registry.json`, `hub-router.json`, `command-metadata.json`, `leaf-manifest.json`.
- The `.claude/commands/create/` mirror symlink.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet is complete and unreachable. Nothing in `mode-registry.json` names it, the hub router has no signals that would select it, no command invokes it, and the advisor cannot recommend what it does not know exists. Every prior phase deferred registration deliberately, so the packet could be built and proved without a half-wired mode sitting in the hub. That deferral now has to end, and it ends across four separate registration files plus a command with three assets - which is exactly the kind of multi-file wiring where one file gets missed. A sibling packet already lost three command mirrors to dangling symlinks and needed a dedicated phase to restore them.

### Purpose
Make the mode reachable by every path that should reach it, and verify each path rather than assume registration implies availability.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `/create:repo-rule` authored **through `sk-create-command`**, not by hand: the router `.md` plus `create-repo-rule-auto.yaml`, `-confirm.yaml`, and `-presentation.txt`.
- `mode-registry.json`: the mode entry with its tool surface and command binding.
- `hub-router.json`: routing signals and vocabulary that select this mode over its siblings.
- `command-metadata.json`: command, owner mode, description, argument hint, user intent, three-step choreography, and the discriminator against sibling commands.
- `leaf-manifest.json`: the mode entry.
- The cross-runtime mirror at `.claude/commands/create/repo-rule.md`.
- Verification that each registration surface actually resolves.

### Out of Scope
- **Hand-authoring the command** - `sk-create-command` owns the shape, and bypassing it would produce a command unlike its eleven siblings.
- **Changing the mode's documents** - phases 3 through 5 closed them.
- **The changelog symlink** - phase 7.
- **Advisor retraining or rebuild** - phase 7 runs the smoke test; this phase provides what it would find.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/create/repo-rule.md` | Create | Thin router command |
| `.opencode/commands/create/assets/create-repo-rule-{auto,confirm}.yaml` | Create | Workflow assets |
| `.opencode/commands/create/assets/create-repo-rule-presentation.txt` | Create | Presentation contract |
| `.claude/commands/create/repo-rule.md` | Create | Mirror symlink |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Register the mode |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Routing signals |
| `.opencode/skills/sk-doc/command-metadata.json` | Modify | Command declaration |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Modify | Mode entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The command is authored through `sk-create-command`, and carries the same shape as its eleven siblings. |
| REQ-002 | All four registration files name the mode, and each entry is verified by reading the file back rather than by assuming the write succeeded. |
| REQ-003 | The cross-runtime mirror resolves - a symlink whose target exists, checked by following it. |
| REQ-004 | The mode's discriminator says when to prefer a sibling command, so the hub can route between overlapping intents. |
| REQ-005 | Every registration file still parses as JSON after the edit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The three-step choreography matches the sibling pattern: hub, then mode contract, then presentation. |
| REQ-007 | Routing signals distinguish this mode from `sk-create-skill`, which is the likely confusion. |
| REQ-008 | The argument hint covers create, revise and retire, since the mode owns all three. |
| REQ-009 | Registration counts are checked before and after, so a silent no-op write is caught. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/create:repo-rule` resolves in both `.opencode/commands/create/` and `.claude/commands/create/`.
- **SC-002**: All four registration files name the mode, verified by reading each back.
- **SC-003**: Mode count rises by exactly one in every file that counts modes.
- **SC-004**: A request phrased as "add a repo rule" routes here rather than to `sk-create-skill`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | One of four registration files is missed | High - a partially registered mode fails in a way that looks like a routing bug | REQ-002 and REQ-009: read each file back and check counts, rather than trusting the write |
| Risk | The mirror symlink dangles | Med, and precedented - a sibling packet lost three and needed a phase to restore them | REQ-003 follows the link rather than checking it exists |
| Risk | The mode collides with `sk-create-skill` in routing | Med - both are asked for in similar words | REQ-004 and REQ-007: an explicit discriminator, and signals that separate constrain-shaped from capability-shaped requests |
| Risk | Hand-rolling the command because calling another mode is slower | Med - it would produce a command unlike its siblings | REQ-001; the mode boundary already assigns this |
| Risk | A JSON edit breaks a file the whole hub loads | High | REQ-005 parses every file after the edit |
| Dependency | `sk-create-command` | Owns the command shape | Present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Verifiability
- **NFR-V01**: Every registration is confirmed by reading it back, never by a successful write.
- **NFR-V02**: The mirror is confirmed by following the symlink to a real file.

### Consistency
- **NFR-C01**: The command matches its eleven siblings in structure and asset naming.
- **NFR-C02**: The choreography has the same three steps in the same order as every sibling.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Registration Boundaries
- **A file that already names the mode**: idempotent; count before and after and do not double-add.
- **A JSON file with a trailing-comma or ordering convention**: match the file's existing style, since a reformat would bury the real change in noise.
- **A registration that writes successfully and changes nothing**: caught by the count check, which is why counts are taken rather than exit codes trusted.

### Routing Boundaries
- **"Create a rule for the repo"**: this mode.
- **"Create a skill that enforces X"**: `sk-create-skill`; the discriminator says so.
- **"Add a rule to AGENTS.md"**: neither - that is an always-loaded row, and the decision tests refuse it.

### Mirror Boundaries
- **The mirror directory does not exist**: create it, matching the sibling layout.
- **A mirror that exists but points elsewhere**: a real defect; report rather than overwrite silently.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 new files, 4 modified registries, 1 symlink |
| Risk | 14/25 | Edits four shared files the whole hub loads |
| Research | 6/20 | Sibling entries are the pattern; `sk-create-command` owns the command |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Do other runtimes beyond `.claude/` need mirrors? **UNKNOWN. Only `.claude/` mirrors were observed; whether `.codex/`, `.cursor/`, `.pi/` or `.devin/` carry command directories was not checked. Enumerate before assuming one mirror is enough.**
- Should the command expose retire, given it deletes a file? **Leaning yes with confirm-mode default, because a mode that owns retirement and hides it behind manual editing has not really owned it. The blast radius is one file and two rows, all in git.**
<!-- /ANCHOR:questions -->

---
