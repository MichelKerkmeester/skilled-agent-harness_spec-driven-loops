---
title: "Tasks: Phase 6: vibe-runtime-folder-and-mirrors"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe runtime folder and mirrors tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: vibe-runtime-folder-and-mirrors

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

Commands run from the repository root. `G` is `.skilled/skills/system-spec-kit/runtime/cli/vibe`. `M` is `.skilled/skills/cli-external-orchestration/cli-mistral-vibe`. `S` is this packet's `scratch/` folder. `PY` is `~/.local/share/uv/tools/mistral-vibe/bin/python`. `H` is a fresh `mktemp -d` set as `VIBE_HOME` for every Vibe command.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 005's layout reference is in place (`M/references/runtime-folder-and-sync.md`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py M/references/runtime-folder-and-sync.md` prints `Total issues: 0`.
- [x] T002 Write the isolation start marker (`S/run-start.marker`). Verify: `test -f S/run-start.marker && echo ok` prints `ok`.
- [x] T003 Capture the config schema from a disposable home (`S/vibe-config-schema.json`). Verify: `jq -r '.properties.allowed_models.type' S/vibe-config-schema.json` prints `array`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Hand-author the provider row, two model rows and closed `allowed_models` (`.vibe/config.toml`). Verify: `PY -c 'print(len(__import__("tomllib").load(open(".vibe/config.toml","rb"))["allowed_models"]))'` prints `2`.
- [x] T005 Write the agents generator and run it (`G/sync-agents-vibe.cjs`). Verify: `ls .vibe/agents/*.toml | wc -l` prints the same number as `ls .skilled/agents/*.md | wc -l`.
- [x] T006 Write the skills generator, failing on a duplicate frontmatter `name`, and run it (`G/sync-skills-vibe.cjs`). Verify: `find .vibe/skills -maxdepth 1 -type l | wc -l` prints the same number as `find .dsh/skills -maxdepth 1 -type l ! -name 'local-*' | wc -l` plus one, for `cli-mistral-vibe`, which the dsh farm predates (`sync-skills-dsh.cjs --check` reports it MISSING).
- [x] T007 Write the prompts generator and run it (`G/sync-prompts-vibe.cjs`). Verify: `ls .vibe/prompts | wc -l` prints the same number as `ls .dsh/prompts | wc -l`.
- [x] T008 Write the sync manifest with the hand-authored, derived and generated split (`.vibe/SYNC.md`). Verify: `rg -c -- '--check' .vibe/SYNC.md` prints `3` or more.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Write a script that validates a TOML file against a JSON schema, and run it on the config (`S/validate-config.py`). Verify: `PY S/validate-config.py .vibe/config.toml S/vibe-config-schema.json` prints `valid`.
- [x] T010 Run each generator in check mode (`G/`). Verify: `node G/sync-agents-vibe.cjs --check && node G/sync-skills-vibe.cjs --check && node G/sync-prompts-vibe.cjs --check && echo ok` prints `ok`.
- [x] T011 Remove one generated skill link and check for drift (`.vibe/skills/`). Verify: `node G/sync-skills-vibe.cjs --check` exits 1, then after `node G/sync-skills-vibe.cjs` the check prints `ok` again.
- [x] T012 Run one keyed headless dispatch from `S` with the checkout root in `H/trusted_folders.toml`, `VIBE_STRICT_CONFIG=1` and `--output-dir S/strict-load` (`S/strict-load/export.json`). Verify: `jq -r .exit_code S/strict-load/export.json` prints `0`.
- [x] T013 Dispatch `--model mistral-medium-3.5` from `S` with the checkout root in `H/trusted_folders.toml` and the repository config (`S/allowed-models/export.json`). Verify: `jq -r .outcome S/allowed-models/export.json` prints `usage_error`, which proves `allowed_models` closes the built-in model out.
- [x] T014 Check that no Vibe command wrote to the operator's home (`~/.vibe`). Verify: `find ~/.vibe -newer S/run-start.marker | wc -l` prints `0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: T009 prints `valid` and T010 prints `ok`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sync split model**: See `.dsh/SYNC.md`
<!-- /ANCHOR:cross-refs -->

---
