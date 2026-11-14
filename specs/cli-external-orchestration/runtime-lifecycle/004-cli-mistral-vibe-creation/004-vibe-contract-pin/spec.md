---
title: "Feature Specification: Phase 4: vibe-contract-pin"
description: "Every success-path claim about Mistral Vibe's headless contract is a source reading, because no authenticated dispatch has run. This phase spends isolated, keyed print-mode dispatches to pin the payload shapes, stdin behavior, process name and catalog listing that later phases build on."
trigger_phrases:
  - "vibe contract pin"
  - "phase 4 vibe contract pin"
  - "vibe authenticated dispatch evidence"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: vibe-contract-pin

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
| **Phase** | 4 of 12 |
| **Predecessor** | 003-dsh-mistral-route |
| **Successor** | 005-cli-mistral-vibe-skill-packet |
| **Handoff Criteria** | `evidence/` holds the export, both payloads and the exit code; open questions 1, 3, 4 and 7 are answered |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: Keyed print-mode dispatches run from a disposable `VIBE_HOME` and a temp working directory, plus the evidence they leave in this packet. No file outside this packet changes.

**Dependencies**:
- The operator's key in `MISTRAL_API_KEY`, exported in `~/.zshenv`. The phase plan names it as this phase's only dependency.

**Deliverables**:
- `evidence/` with `export.json`, the `--output json` and `streaming` payloads, the exit code, the stdin probe, the ancestor names and the catalog result.
- A hand-written model row for each roster model, drafted in `scratch/vibe-model-rows.toml`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research behind this build ran no authenticated Vibe dispatch, so the output payload shapes, stdin handling, the process name a recursion guard sees and the catalog listing of the two roster models are all unconfirmed. The skill packet, runtime folder, dispatch rules and executor kind in phases 005 to 009 would each encode a guess about them.

### Purpose
Replace research open questions 1, 3, 4 and 7 with recorded evidence from real dispatches, before any phase writes them into a contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ env | grep -c MISTRAL_API_KEY
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hand-write one `[[models]]` row per roster model, `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` on the `mistral` provider, each with `thinking = "max"`, because reasoning effort has no CLI flag.
- Run one authenticated `vibe -p` dispatch per output mode (`text`, `json`, `streaming`), each with a fresh `VIBE_HOME`, a temp working directory and `--output-dir`, and keep `export.json`, both payloads and the exit code.
- Probe whether stdin is a prompt source, and record the process names a tool call sees in its ancestor walk.
- Check whether the Mistral catalog serves both roster ids from a `VIBE_HOME` with no hand-written rows.

### Out of Scope
- The hook decision wire format (research open question 2) - phase 008 settles it when it ports the guards.
- The ACP supervisor - an optional second dispatch mode, worth building only after print mode is proven.
- The session-relaunch loop - Vibe has no idle or compaction event, so only an outer supervisor could drive it.
- Turn-stopping guards (completion evidence, ask surface) - there is no strict `post_agent` hook, so they are not portable.
- Sandbox mode - there is no CLI or config field, and the executor kind fails closed on a sandbox request.
- Skill precedence (question 5) and the shared usage pool (question 6) - the phase plan assigns neither to this phase.
- Any default model change - DevPass stays the default on every runtime.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/vibe-model-rows.toml` | Create | The two hand-written model rows copied into each disposable `VIBE_HOME` |
| `scratch/ancestors.sh` | Create | Prints the command name of each ancestor process up to pid 1 |
| `evidence/export.json`, `evidence/exit-code.txt` | Create | Outcome record and exit code of the text-mode DeepSeek dispatch |
| `evidence/export-glm.json` | Create | Outcome record of the GLM dispatch |
| `evidence/output-json.txt`, `evidence/output-streaming.txt` | Create | Raw stdout of the `json` and `streaming` dispatches |
| `evidence/json-run/`, `evidence/streaming-run/` | Create | Outcome records of the `json` and `streaming` dispatches |
| `evidence/stdin.md`, `evidence/ancestors.txt`, `evidence/catalog.md` | Create | Answers to open questions 3, 4 and 7 |
| `goal.md` | Modify | Log rows that answer questions 1, 3, 4 and 7 with their evidence path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A keyed text-mode dispatch from a disposable `VIBE_HOME` and a temp cwd completes and leaves its outcome record | `jq -r .exit_code evidence/export.json` prints `0` and `cat evidence/exit-code.txt` prints `0` |
| REQ-002 | The `json` and `streaming` payloads are captured verbatim | `evidence/output-json.txt` and `evidence/output-streaming.txt` are non-empty and each run exited 0 |
| REQ-003 | Research open questions 1, 3, 4 and 7 are answered from evidence | `goal.md` log rows Q1, Q3, Q4 and Q7 read `Done` and each names a file in `evidence/` |
| REQ-004 | No dispatch writes to the operator's `~/.vibe` | `find ~/.vibe -newer scratch/run-start.marker \| wc -l` prints `0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each roster model has a hand-written row pinning `max` and answers one dispatch | `rg -c 'thinking = "max"' scratch/vibe-model-rows.toml` prints `2`, and the GLM dispatch exits 0 |
| REQ-006 | No file in this packet holds the key value | `rg -l -F -- "$MISTRAL_API_KEY" evidence scratch \| wc -l` prints `0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls evidence` lists `export.json`, `exit-code.txt`, `output-json.txt` and `output-streaming.txt`.
- **SC-002**: Phase 005 can fill its cli-reference and providers-and-models references from `evidence/` with no UNKNOWN left for questions 1, 3, 4 and 7.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `MISTRAL_API_KEY` exported in `~/.zshenv` (Measured Behavior prints 0) | High: no keyed run is possible, and the phase cannot start | The operator exports it. T001 checks the count before any dispatch and never prints the value |
| Risk | Vibe writes `~/.vibe/logs`, `~/.vibe/vibehistory` and `~/.vibe/trusted_folders.toml` in the operator's home, as it did during research | Med | Every command sets `VIBE_HOME` to a fresh temp dir, and T013 compares `~/.vibe` against a start marker |
| Risk | The schema carries `experimental_enable_model_catalog`, so a missing catalog entry may mean the catalog is off rather than the id absent | Low | `evidence/catalog.md` records the exit code and first stderr line for each id, and the hand-written rows pin both models either way |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: What are the `--output json` and `streaming` payload shapes? Decision: this phase's T006 and T007 answer it.
- Q3: Is stdin a prompt source in 3.1.2? Decision: this phase's T008 answers it.
- Q4: Does the ancestor walk see `vibe` or `vibe-rs`? Decision: this phase's T009 answers it.
- Q7: Does the Mistral catalog list `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` for Vibe without a hand-written row? Decision: this phase's T010 answers it.
<!-- /ANCHOR:questions -->

---
