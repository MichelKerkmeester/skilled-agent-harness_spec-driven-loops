---
title: "Feature Specification: Phase 5: cli-mistral-vibe-skill-packet"
description: "No cli-external-orchestration mode exists for Mistral Vibe, so a dispatcher has no hard rules, references or prompt card and would improvise flags. This phase writes the cli-mistral-vibe mode packet from the contract phase 004 pins."
trigger_phrases:
  - "cli mistral vibe skill packet"
  - "phase 5 cli mistral vibe skill packet"
  - "cli-mistral-vibe mode packet"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: cli-mistral-vibe-skill-packet

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 12 |
| **Predecessor** | 004-vibe-contract-pin |
| **Successor** | 006-vibe-runtime-folder-and-mirrors |
| **Handoff Criteria** | `hard-rules.json` parses and every rule names its check; `validate_document.py` reports 0 issues |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: New files under `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/` only. No hub file, hook code, executor code or runtime folder changes in this phase.

**Dependencies**:
- Phase 004's `evidence/`, which supplies the payload shapes, stdin behavior, process name and catalog result the references state.

**Deliverables**:
- `SKILL.md`, `ROUTER.md` and `hard-rules.json` for the `cli-mistral-vibe` mode.
- Four references (cli-reference, providers-and-models, runtime folder, hooks) and a prompt card.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-external-orchestration hub has a mode packet for each governed runtime, but none for Vibe. A dispatcher reaching for `vibe -p` today has no rule requiring an isolated `VIBE_HOME`, `--output-dir` or a roster model, and no reference telling it to read `export.json` instead of stdout.

### Purpose
Give Vibe a mode packet whose rules and references a dispatcher can follow, with every fact traced to phase 004's evidence or the research.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/cli-external-orchestration/cli-mistral-vibe
ls: .skilled/skills/cli-external-orchestration/cli-mistral-vibe: No such file or directory
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write `SKILL.md` and `ROUTER.md` in the shape of the sibling mode `cli-deepseek-harness`, with print mode (`vibe -p`) as the only documented dispatch surface.
- Write `hard-rules.json` with one rule per dispatch hazard, each naming its `check`: `print-mode-only`, `isolated-vibe-home`, `output-dir-required`, `vibe-closed-roster`, `no-repo-root-cwd` and the shared `stdin-redirect-required`. The roster rule takes a Vibe-specific name because `closed-roster` already names DeepSeek Harness's check, which passes every non-dsh command.
- Write `references/cli-reference.md` (flags, budgets, the 0 to 4 exit taxonomy, `export.json`) and `references/providers-and-models.md` (the `mistral` provider, the two model rows with `thinking = "max"`, `allowed_models`).
- Write `references/runtime-folder-and-sync.md` (the `.vibe/` layout phase 006 builds) and `references/guards-and-hooks.md` (the seven hook types and which accept `strict`).
- Write `assets/prompt-quality-card.md`, the prompt card for Vibe dispatches.

### Out of Scope
- Hub registration, the hub router and advisor vocabulary - phase 010 owns them, and the hub files are being edited by another session.
- The preflight code that enforces each rule's `check` - phase 007 builds it in `.skilled/hooks/dispatch/lib/`.
- The deep-loop executor kind and a fanout-executor reference - phase 009 owns them.
- The `.vibe/` folder itself - phase 006 builds it.
- The manual-testing playbook, `README.md`, changelog and feature catalog entry - phase 012 owns the playbook and cross-runtime docs, and the phase plan names none of them here.
- The hook decision wire format - phase 008 settles it, so the hooks reference marks it UNKNOWN.
- The ACP supervisor - an optional second dispatch mode, worth building only after print mode is proven.
- The session-relaunch loop - Vibe has no idle or compaction event, so only an outer supervisor could drive it.
- Turn-stopping guards (completion evidence, ask surface) - there is no strict `post_agent` hook, so they are not portable.
- Sandbox mode - there is no CLI or config field, and the kind fails closed on a sandbox request.
- Any default model change - DevPass stays the default on every runtime.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md` | Create | Mode contract: when to dispatch Vibe and how |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/ROUTER.md` | Create | Intent signals and resource map |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json` | Create | Five dispatch rules, each naming its check |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/cli-reference.md` | Create | Flags, budgets, exit codes, `export.json`, output payloads |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/providers-and-models.md` | Create | Provider row, model rows, closed roster |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/runtime-folder-and-sync.md` | Create | `.vibe/` layout and sync split |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Create | Hook types, `strict` support, porting plan |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/assets/prompt-quality-card.md` | Create | Prompt card for Vibe dispatches |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `hard-rules.json` parses and every rule names its check | `jq '[.[] \| select((.check // "") == "")] \| length' hard-rules.json` prints `0` and `jq -r '.[].check' hard-rules.json \| rg -c -x -e print-mode-only -e isolated-vibe-home -e output-dir-required -e vibe-closed-roster -e no-repo-root-cwd -e stdin-redirect-required` prints `6` |
| REQ-002 | Every markdown file in the packet passes the document validator | `validate_document.py <file>` prints `Total issues: 0` for each of the seven `.md` files |
| REQ-003 | The cli-reference states the payload shapes, stdin behavior and process name from phase 004's evidence | `rg -o UNKNOWN references/cli-reference.md \| wc -l` prints `0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The providers reference pins both roster models with `thinking = "max"` and keeps DevPass the default | `rg -c 'thinking = "max"' references/providers-and-models.md` prints `2` and `rg -c DevPass references/providers-and-models.md` prints `1` or more |
| REQ-005 | `SKILL.md` tells the dispatcher to read `export.json`, never stdout, for the outcome | `rg -n 'export.json' SKILL.md` prints at least one line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find .skilled/skills/cli-external-orchestration/cli-mistral-vibe -type f | wc -l` prints `8`.
- **SC-002**: Phase 007 can implement each rule from its `check` id and message alone, with no question back to this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004's evidence | High: the cli-reference and providers reference would state guesses | T001 refuses to start until the evidence files exist |
| Risk | The hook decision wire format is unknown until phase 008 | Med | `guards-and-hooks.md` marks it UNKNOWN and names phase 008 as its owner |
| Risk | Another session is editing the hub and cli-opencode files | Med | This phase writes only inside the new mode folder, and T014 diffs the `.skilled` status against a baseline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What are the `--output json` and `streaming` payload shapes? UNKNOWN until phase 004 records them.
- Is stdin a prompt source in 3.1.2? UNKNOWN until phase 004 records it. The shared `stdin-redirect-required` rule applies either way, because an open stdin can hang any headless dispatch.
- Does a recursion guard's ancestor walk see `vibe` or `vibe-rs`? UNKNOWN until phase 004 records it.
- Does the Mistral catalog list both roster ids without a hand-written row? UNKNOWN until phase 004 records it.
- What does a hook receive and how does it answer? UNKNOWN until phase 008.
- Does a Vibe turn draw on the same Mistral usage pool as an API turn (research question 6)? UNKNOWN, and no phase owns it.
<!-- /ANCHOR:questions -->

---
