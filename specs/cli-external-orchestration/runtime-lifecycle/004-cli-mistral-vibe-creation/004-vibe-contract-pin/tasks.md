---
title: "Tasks: Phase 4: vibe-contract-pin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe contract pin tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: vibe-contract-pin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is a fresh `mktemp -d` used as `VIBE_HOME`, holding `config.toml` built from `scratch/vibe-model-rows.toml`. `W` is a fresh `mktemp -d` used as the working directory. Every dispatch runs as `cd "$W" && VIBE_HOME="$H" vibe -p ... --output-dir <dir> </dev/null`, with new `H` and `W` per task. Paths are relative to this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the operator exported the key (`~/.zshenv`). Verify: `zsh -c 'env | grep -c MISTRAL_API_KEY'` prints `1`.
- [x] T002 Confirm the pinned binary (`~/.local/bin/vibe`). Verify: `vibe --version` prints `vibe 3.1.2`.
- [x] T003 Write the isolation start marker (`scratch/run-start.marker`). Verify: `ls scratch/run-start.marker` prints the path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Hand-write one `[[models]]` row per roster model on the `mistral` provider, `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash`, each with an alias and `thinking = "max"` (`scratch/vibe-model-rows.toml`). Verify: `rg -c '^\[\[models\]\]' scratch/vibe-model-rows.toml` prints `2` and `rg -c 'thinking = "max"' scratch/vibe-model-rows.toml` prints `2`.
- [x] T005 Run one harmless text-mode dispatch on the DeepSeek alias and copy the outcome record and exit code (`evidence/export.json`). Verify: `jq -r .exit_code evidence/export.json` prints `0` and `cat evidence/exit-code.txt` prints `0`.
- [x] T006 Run the same dispatch with `--output json` and `--output-dir evidence/json-run`, and keep stdout verbatim (`evidence/output-json.txt`). Verify: `test -s evidence/output-json.txt && echo ok` prints `ok` and `jq -r .exit_code evidence/json-run/export.json` prints `0`.
- [x] T007 Run the same dispatch with `--output streaming` and `--output-dir evidence/streaming-run`, and keep stdout verbatim (`evidence/output-streaming.txt`). Verify: `test -s evidence/output-streaming.txt && echo ok` prints `ok` and `jq -r .exit_code evidence/streaming-run/export.json` prints `0`.
- [x] T008 Pipe the prompt on stdin to `vibe -p` with no prompt text and record the exit code and whether an answer printed (`evidence/stdin.md`). Verify: `rg -c '^(exit|answered):' evidence/stdin.md` prints `2`.
- [x] T009 Write an ancestor-walk script and have one `--auto-approve` dispatch run it through its shell tool (`scratch/ancestors.sh`, `evidence/ancestors.txt`). Verify: `rg -c -w -e vibe -e vibe-rs evidence/ancestors.txt` prints `1` or more.
- [x] T010 From a `VIBE_HOME` with no model rows, dispatch each roster id with `--model` and record the exit code and first stderr line (`evidence/catalog.md`). Verify: `rg -c -e deepseek-v4-1-flash-1017 -e zai-glm-5-3-flash evidence/catalog.md` prints `2`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run one harmless dispatch on the GLM alias (`evidence/export-glm.json`). Verify: `jq -r .exit_code evidence/export-glm.json` prints `0`.
- [x] T012 Check that no file holds the key value (`evidence/`, `scratch/`). Verify: `rg -l -F -- "$MISTRAL_API_KEY" evidence scratch | wc -l` prints `0`.
- [x] T013 Check that no run wrote to the operator's home (`~/.vibe`). Verify: `find ~/.vibe -newer scratch/run-start.marker | wc -l` prints `0`.
- [x] T014 Record the answers to research open questions 1, 3, 4 and 7, each with its evidence file (`goal.md`). Verify: `rg -c '^\| Q[1347] \|.*\| Done \|' goal.md` prints `4`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `evidence/` holds the export, both payloads and the exit code
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase plan**: See `../001-deep-research/research/phase-plan.md`
<!-- /ANCHOR:cross-refs -->

---
