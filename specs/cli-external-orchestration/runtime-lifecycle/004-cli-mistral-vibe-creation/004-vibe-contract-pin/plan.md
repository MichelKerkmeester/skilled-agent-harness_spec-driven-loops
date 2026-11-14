---
title: "Implementation Plan: Phase 4: vibe-contract-pin"
description: "Run keyed Mistral Vibe print-mode dispatches from disposable homes and temp working directories, and keep the outcome records and payloads as evidence. The evidence answers research open questions 1, 3, 4 and 7 before phase 005 writes the contract."
trigger_phrases:
  - "vibe contract pin plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: vibe-contract-pin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | zsh commands and TOML model rows |
| **Framework** | Mistral Vibe 3.1.2 print mode (`vibe -p`) |
| **Storage** | Files in this packet's `evidence/` and `scratch/` |
| **Testing** | `jq`, `rg` and `find` over the evidence files |

### Overview
Nothing in the repository changes. Each dispatch runs with `VIBE_HOME` set to a fresh `mktemp -d` holding a `config.toml` built from `scratch/vibe-model-rows.toml`, a temp working directory instead of the repository root, `--output-dir`, and stdin closed unless stdin is the thing under test. The evidence files decide each open question, and `goal.md` records the answers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `vibe --version` prints `vibe 3.1.2`
- [ ] `zsh -c 'env | grep -c MISTRAL_API_KEY'` prints `1` (it prints `0` today)
- [ ] `scratch/run-start.marker` exists before the first dispatch

### Definition of Done
- [ ] `jq -r .exit_code evidence/export.json` prints `0`
- [ ] `find ~/.vibe -newer scratch/run-start.marker | wc -l` prints `0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Isolated probe runs.

### Key Components
- **Disposable `VIBE_HOME`**: holds the hand-written model rows and absorbs the logs, history and trust file Vibe writes, which otherwise land in `~/.vibe`.
- **Temp working directory**: keeps the run away from the repository root, its dotenv file and the project `AGENTS.md` walk.
- **`--output-dir`**: makes Vibe write `export.json`, the typed outcome record, on every exit.

### Data Flow
The dispatch reads the prompt from `-p`, the model row from `$VIBE_HOME/config.toml` and the key from the environment. It calls the `mistral` provider, writes `export.json` to the output dir and prints the payload to stdout. Both are copied into `evidence/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the key count, the pinned version and the start marker. Implementation writes the model rows and runs the text, json, streaming, stdin, ancestor and catalog dispatches into `evidence/`. Verification runs the GLM dispatch, checks that no key and no `~/.vibe` write leaked, and records the four answers in `goal.md`. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A dispatch is judged by `export.json`'s `exit_code` and `outcome`, never by stdout alone, because a denied tool call can still exit 0. The edge case is isolation: `find ~/.vibe -newer scratch/run-start.marker | wc -l` must print `0` after the last run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe` 3.1.2 at `~/.local/bin/vibe`, `jq`, `rg`, and `MISTRAL_API_KEY` exported in `~/.zshenv`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a run writes outside its temp dirs, or an evidence file holds a key. Delete the affected file in `evidence/` and rerun the task. If `~/.vibe` changed, list the new files and hand the list to the operator instead of deleting anything in their home.
<!-- /ANCHOR:rollback -->

---
