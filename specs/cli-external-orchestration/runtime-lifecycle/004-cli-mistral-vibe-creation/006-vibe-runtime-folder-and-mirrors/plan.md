---
title: "Implementation Plan: Phase 6: vibe-runtime-folder-and-mirrors"
description: "Add .vibe/ with a hand-authored config.toml that closes the model roster, and three Node generators that write and check the agent, skill and prompt mirrors, following .dsh/SYNC.md's split. Proof is schema validation against vibe config schema, a strict-config load under --trust, and each generator's --check."
trigger_phrases:
  - "vibe runtime folder and mirrors plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: vibe-runtime-folder-and-mirrors

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TOML config, Node CommonJS generators, Markdown |
| **Framework** | Mistral Vibe 3.1.2 project config discovery |
| **Storage** | Files and symlinks in `.vibe/` |
| **Testing** | Generator `--check`, `jsonschema` validation with Vibe's own Python, one keyed strict-config run |

### Overview
Create `.vibe/` at the repository root and three generators in `.skilled/skills/system-spec-kit/runtime/cli/vibe/`, named and shaped like the `.dsh` generators beside them. The config is hand-authored from phase 005's providers reference, and the mirrors are generated from `.skilled/agents`, `.skilled/skills` and `.skilled/commands`. Each generator's `--check`, a schema validation and a strict-config load under `--trust` prove the result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/runtime-folder-and-sync.md` prints `Total issues: 0`
- [x] `ls .vibe` prints No such file or directory (`spec.md` Measured Behavior)

### Definition of Done
- [ ] `node <generator> --check && echo ok` prints `ok` for all three generators
- [ ] `scratch/validate-config.py` prints `valid`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generated runtime mirror.

### Key Components
- **`.vibe/config.toml`**: hand-authored, the only place the roster is closed. Without it Vibe allows any configured model.
- **Three generators**: write the agent, skill and prompt mirrors and exit 1 on drift in `--check` mode. Without them the mirrors drift silently.
- **`.vibe/SYNC.md`**: the inventory a maintainer reads to know which file is hand-authored, derived or generated.

### Data Flow
Each generator reads its `.skilled/` source, renders the target tree under `.vibe/`, and in `--check` mode compares instead of writing. Vibe finds `.vibe/config.toml` by walking up from its working directory and applies it only in a trusted folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup checks phase 005's runtime-folder reference, writes the isolation marker and captures `vibe config schema` from a disposable home. Implementation writes `config.toml`, the three generators and `SYNC.md`. Verification validates the config, runs each `--check`, proves drift detection, loads the config under `--trust` with strict config, and checks `~/.vibe`. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The happy path is `ok` from all three `--check` runs and `valid` from the schema check. The edge case is drift: removing one generated skill link must make `sync-skills-vibe.cjs --check` exit 1, and a write run must restore it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node` for the generators, Vibe's own Python at `~/.local/share/uv/tools/mistral-vibe/bin/python` (3.12.11, with `tomllib` and `jsonschema`), `jq`, and `MISTRAL_API_KEY` for the strict-config run only. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: Vibe refuses the config under strict mode, or a generator cannot reach a clean `--check`. Delete `.vibe/` and `.skilled/skills/system-spec-kit/runtime/cli/vibe/` in one commit. No other runtime reads either path.
<!-- /ANCHOR:rollback -->

---
