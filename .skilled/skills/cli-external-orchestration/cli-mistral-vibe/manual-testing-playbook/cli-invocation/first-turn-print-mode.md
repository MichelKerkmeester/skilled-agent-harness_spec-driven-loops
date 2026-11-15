---
title: "VIB-CLI-001 -- First-turn print-mode run"
description: "This scenario validates that a keyed Vibe print-mode turn on the deepseek-flash alias finishes and writes an export.json outcome record with exit_code 0 and outcome finished."
version: 1.0.0.0
---

# VIB-CLI-001 -- First-turn print-mode run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-CLI-001`.

---

## 1. OVERVIEW

This scenario validates the print-mode invocation surface on a keyed run. It focuses on the one record a caller may trust, `export.json`, and on the alias the run actually loaded.

### Why This Matters

A Vibe turn prints its reply to stdout and writes no exit code there. `--output json` and `--output streaming` frame the reply but carry no verdict either, and a denied tool call returns to the model as a tool error while the turn continues. A caller that reads stdout alone can record a failed or unguarded run as a success. The outcome is the pair `exit_code` plus `outcome` in `export.json`, and `config.active_model` is the only field that proves which alias the run loaded.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a keyed print-mode turn on `deepseek-flash` finishes and leaves an `export.json` pair of `0` and `finished`.
- Real user request: `Run one Vibe print-mode turn on deepseek-flash and tell me from the run record whether it finished. Do not read the verdict from the console text.`
- Prompt: `Quote the line in your context that starts with "**Objective:**" exactly, then stop. Use no tools.`
- Expected execution process: Create a scratch folder and a disposable `VIBE_HOME` -> copy the repository config into the home -> render the repository hooks into the home -> run print mode with one roster alias and `--output-dir` -> read `out/export.json` and require the `0`/`finished` pair.
- Expected signals: The process exits `0`. `out/export.json` records `exit_code` `0`, `outcome` `finished`, `stop_reason` null, `error` null and `vibe_version` `3.1.2`. `config.active_model` is `deepseek-flash`. `journal_dir` is `session`. With the rendered home hooks and `VIBE_SPEC_FOLDER` set, the reply quotes the bound packet's `**Objective:**` line; `VIB-GOAL-002` covers the slice itself.
- Evidence: The command transcript with its exit code, and the `export.json` record with the fields above quoted.
- Desired user-visible outcome: A clear statement that the turn finished, with the alias and the outcome pair a later caller can reproduce.
- Pass/fail: PASS if `export.json` records `exit_code` `0` and `outcome` `finished` on `deepseek-flash`. FAIL if the pair is anything else, if `active_model` names another alias, or if the verdict is read from stdout alone.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm `command -v vibe` and `vibe --version </dev/null` prints `vibe 3.1.2`.
2. Confirm `MISTRAL_API_KEY` is exported in the child's environment, by name only.
3. Create one scratch folder outside the checkout and a disposable home inside it.
4. Copy `$REPO/.vibe/config.toml` into the home, so the two roster rows and `allowed_models` are present, and render the repository hooks into it with `render-home-hooks.cjs`.
5. Run the dispatch and keep stdout, stderr and the exit code apart.
6. Read `out/export.json` before you read stdout.

### Commands

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
VIBE_HOME="$RUN_DIR/.vibe-home"
mkdir -p "$VIBE_HOME"
cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"
cd "$RUN_DIR" && AI_SESSION_CHILD=1 VIBE_SPEC_FOLDER="$REPO/specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks" VIBE_HOME="$VIBE_HOME" vibe -p 'Quote the line in your context that starts with "**Objective:**" exactly, then stop. Use no tools.' --model deepseek-flash --output-dir "$RUN_DIR/out" </dev/null
node -e 'const j=require(process.argv[1]); console.log(JSON.stringify({exit_code:j.exit_code,outcome:j.outcome,active_model:j.config.active_model,vibe_version:j.vibe_version},null,2))' "$RUN_DIR/out/export.json"
```

### Recorded Result

- Verdict: `PASS`.
- Date: 2026-11-14.
- Basis: recorded evidence from an earlier keyed run, not a run started by this review. The record at `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/export.json` exists, and `node` read `exit_code` `0` and `outcome` `finished` from it.
- Observed: `vibe_version` `3.1.2`, `config.active_model` `deepseek-flash`, `steps` `1`, `journal_dir` `session`, `stop_reason` null and `error` null.
- Observed: the export carries one warning that no supported plugin manifest was found for the guard bundle folder. The bundle is a hook bundle declared in `hooks.toml`, so the warning is informational and does not change the outcome pair.
- Caveat: the recorded run passed `--prompt-file` and ran from the checkout root with a trusted home so the project hook would load. It proves print mode and the outcome record; it does not prove the scratch-cwd isolation, which `VIB-HR-001` checks statically. A later keyed scratch-cwd run with the rendered home hooks also quoted the Objective line; its record is under `011-vibe-context-and-goal-hooks/scratch/scratch-cwd-home-hooks/`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-CLI-001 | First-turn print-mode run | Prove a keyed print-mode turn finishes on deepseek-flash | `Quote the line in your context that starts with "**Objective:**" exactly, then stop. Use no tools.` | 1. `REPO="$(pwd -P)"; RUN_DIR="$(mktemp -d)"; VIBE_HOME="$RUN_DIR/.vibe-home"` -> 2. `cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"` and `node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"` -> 3. run the dispatch shape from section 3 with `--model deepseek-flash` -> 4. read `out/export.json` with the `node -e` reader | Step 3: exit `0`. Step 4: `exit_code` `0`, `outcome` `finished`, `active_model` `deepseek-flash`, `vibe_version` `3.1.2` | The saved record `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/export.json`, read with `node` on the recorded date | PASS if the pair is `0`/`finished` on `deepseek-flash`. FAIL if the pair differs, the alias differs, or the verdict comes from stdout | 1. Read `export.json` before stdout. 2. If `outcome` is `usage_error`, confirm the home carried `config.toml`. 3. If `active_model` differs, confirm `--model` named a roster alias and the home held its row |

### Failure Triage

1. Read `export.json` before stdout, and quote the `exit_code` and `outcome` pair.
2. If the pair is `1`/`usage_error`, confirm the home carried a `config.toml` with the two roster rows; an empty home offers only `mistral-medium-3.5`.
3. If `active_model` names another alias, confirm the command named `deepseek-flash` or `glm-flash` and nothing else.
4. If `export.json` is absent, confirm `--output-dir` was passed and pointed outside the checkout.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Isolation policy, command notation and verdict rules |
| [SKILL.md](../../SKILL.md) | Dispatch shape, provider preflight and the completion pair |
| [cli-reference.md](../../references/cli-reference.md) | Flag set, output payloads, `export.json` fields and the exit taxonomy |
| [providers-and-models.md](../../references/providers-and-models.md) | The two roster aliases and the `allowed_models` close |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.vibe/config.toml` | The `mistral` provider, the two model rows and `allowed_models` |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs` | Generated agent profiles the home may also carry |
| `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks/scratch/first-turn/export.json` | Recorded outcome record for the cited run |
| `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin/evidence/export.json` | The contract-pin record that fixes the field set |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: VIB-CLI-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/first-turn-print-mode.md`
