---
title: "Feature Specification: Phase 6: vibe-runtime-folder-and-mirrors"
description: "Mistral Vibe reads project config, agents, skills and prompts only from a root .vibe/ folder in a trusted directory, and this repository has none. This phase adds a hand-authored config with a closed model roster and generated agent, skill and prompt mirrors whose --check keeps them in sync."
trigger_phrases:
  - "vibe runtime folder and mirrors"
  - "phase 6 vibe runtime folder and mirrors"
  - "vibe sync generators"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: vibe-runtime-folder-and-mirrors

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
| **Phase** | 6 of 12 |
| **Predecessor** | 005-cli-mistral-vibe-skill-packet |
| **Successor** | 007-dispatch-recognition-and-hard-rules |
| **Handoff Criteria** | The config validates against the schema `vibe config schema` prints, a keyed load under `--trust` with `VIBE_STRICT_CONFIG=1` exits 0, and each generator `--check` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The `.vibe/` config, its three generated mirrors, `SYNC.md`, and the three generators that write and check the mirrors. No hook file, guard bundle, dispatch rule or executor code.

**Dependencies**:
- Phase 005's mode packet. Its `references/runtime-folder-and-sync.md` is the layout this phase builds, and its `references/providers-and-models.md` holds the model rows the config copies.

**Deliverables**:
- `.vibe/config.toml` with the `mistral` provider, two model rows and a closed `allowed_models`.
- Generated `.vibe/agents/*.toml`, `.vibe/skills/` and `.vibe/prompts/`, each with a `--check` generator, and `.vibe/SYNC.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Without a `.vibe/` folder, a Vibe run in this repository has an open model list and none of the repository's agents, skills or command prompts. A hand-made copy of those sources would drift the first time a source changes, and nothing would catch it.

### Purpose
Give Vibe a project folder whose config closes the model roster and whose mirrors are generated from `.skilled/` and proven in sync by a `--check` run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .vibe
ls: .vibe: No such file or directory
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hand-author `.vibe/config.toml` with the `mistral` provider row, the two model rows from phase 005 with `thinking = "max"`, and `allowed_models` closed to those two. `skill_paths` stays unset so the generated farm is the only project skill source.
- Generate `.vibe/agents/<name>.toml` from `.skilled/agents/*.md`, with the agent body as `instructions`.
- Generate `.vibe/skills/<name>` as relative symlinks, one per canonical `SKILL.md`, named by its frontmatter `name`.
- Generate `.vibe/prompts/*.md` pointer stubs from `.skilled/commands/**/*.md`.
- Write `.vibe/SYNC.md` with the hand-authored, derived and generated split of `.dsh/SYNC.md` and the three `--check` commands.

### Out of Scope
- `.vibe/hooks.toml` and `.vibe/plugins/repo-guards/` - research section 5 lists them in the mirror, but phase 008 builds the guard bundle and settles the hook wire format.
- Dispatch preflight rules - phase 007 builds them.
- The deep-loop executor kind - phase 009 builds it.
- A `.vibe/commands/` mirror - Vibe reads no such directory, so commands reach it as prompt stubs.
- The ACP supervisor - an optional second dispatch mode, worth building only after print mode is proven.
- The session-relaunch loop - Vibe has no idle or compaction event, so only an outer supervisor could drive it.
- Turn-stopping guards (completion evidence, ask surface) - there is no strict `post_agent` hook, so they are not portable.
- Sandbox mode - there is no CLI or config field, and the executor kind fails closed on a sandbox request.
- Any default model change - DevPass stays the default on every runtime.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.vibe/config.toml` | Create | Hand-authored provider, model rows and closed `allowed_models` |
| `.vibe/agents/*.toml` | Create | Generated agent profiles |
| `.vibe/skills/<name>` | Create | Generated relative symlinks to canonical skills |
| `.vibe/prompts/*.md` | Create | Generated command pointer stubs |
| `.vibe/SYNC.md` | Create | Hand-authored sync manifest |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs` | Create | Agents generator with `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs` | Create | Skills generator with `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs` | Create | Prompts generator with `--check` |
| `scratch/validate-config.py` | Create | Validates `.vibe/config.toml` against the schema Vibe prints |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The config satisfies the schema `vibe config schema` prints | `scratch/validate-config.py`, run with Vibe's own Python, prints `valid` |
| REQ-002 | Each generator's `--check` exits 0 on a fresh tree | `node <generator> --check && echo ok` prints `ok` for all three generators |
| REQ-003 | The model roster is closed to the two Mistral rows | Reading `.vibe/config.toml` with `tomllib` gives `allowed_models` of length `2` |
| REQ-004 | No Vibe command writes to the operator's `~/.vibe` | `find ~/.vibe -newer scratch/run-start.marker \| wc -l` prints `0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `--check` catches drift | With one generated skill link removed, `sync-skills-vibe.cjs --check` exits 1, and a write run restores it |
| REQ-006 | Vibe loads the config under `--trust` with strict config on | A keyed headless run from this packet's `scratch/` with `--trust` and `VIBE_STRICT_CONFIG=1` writes an `export.json` whose `exit_code` is `0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls .vibe` lists `SYNC.md`, `agents`, `config.toml`, `prompts` and `skills`.
- **SC-002**: Phase 008 can add `hooks.toml` and `plugins/` beside these files without changing any generator.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005's runtime-folder and providers references | High: without them the layout and model rows are guesses | T001 checks the runtime-folder reference passes the document validator before any write |
| Dependency | `MISTRAL_API_KEY` for the strict-config load in REQ-006 | Med: REQ-001 to REQ-005 do not need it | Run REQ-006 last. Phase 004 already needs the key exported |
| Risk | `vibe config schema` only prints the JSON schema of `config.toml` (its help says "Print the JSON schema"), so it cannot accept or refuse a config by itself | Med | REQ-001 validates the config against that schema, and REQ-006 proves Vibe loads it under `--trust` |
| Risk | A same-name skill is shadowed by its first claimant, and the precedence between `skill_paths` and `.vibe/skills` is unknown | Med | `skill_paths` stays unset and the skills generator fails on a duplicate frontmatter `name` |
| Risk | Rendering agents to TOML may drop frontmatter Vibe does not model | Low | `SYNC.md` lists the dropped fields per agent |
| Risk | Vibe writes into `~/.vibe` when `VIBE_HOME` is unset, as it did during research | Med | Every Vibe command sets `VIBE_HOME` to a fresh temp dir, and T013 compares `~/.vibe` against a start marker |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which source claims a skill name first, `skill_paths` or `.vibe/skills` (research question 5)? UNKNOWN. Decision for this phase: leave `skill_paths` unset so no collision can arise.
- Does `--trust` from a subdirectory of the repository apply the root `.vibe/config.toml`? UNKNOWN until T012 runs.
- Which phase wires the three `--check` commands into the pre-commit mirror gate and CI? UNKNOWN, and the phase plan names no owner.
<!-- /ANCHOR:questions -->

---
