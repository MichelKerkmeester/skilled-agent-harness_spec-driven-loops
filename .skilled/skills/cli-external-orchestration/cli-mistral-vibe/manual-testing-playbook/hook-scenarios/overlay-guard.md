---
title: "VIB-HK-012 -- Overlay guard refuses a write an overlay owns"
description: "This scenario validates that the Vibe overlay-guard pre_tool hook refuses a write to a file a vendored overlay owns, names the overlay file to edit instead, and leaves the live file untouched."
version: 1.0.1.0
---

# VIB-HK-012 -- Overlay guard refuses a write an overlay owns

This document captures the operator contract for `VIB-HK-012`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to change one value in a file that a vendored overlay owns. The `overlay-guard` `pre_tool` hook must refuse the write and name the overlay file to edit instead.

### Why This Matters

An edit made in place is lost at the next re-pin, so the refusal is the only thing that keeps the operator's change from silently disappearing. A Vibe deny leaves the session at exit 0 and the reply may paraphrase it, so only the journal shows that the guard judged the path against the overlay manifest. Without this scenario, a broken engine path or a broken hook binding would let the in-place edit land with no signal that the guard was ever consulted.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `overlay-guard` refuses a write to an overlay-owned file in a live session.
- Real user request: `Change retries to 3 in config/settings.json.`
- Prompt: `Open config/settings.json and change retries from 1 to 3.`
- Expected execution process: the runner builds a project whose skilled-overlays/overlay-manifest.json owns config/settings.json from skilled-overlays/files/settings.json, renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. Vibe writes or edits the live file, and the hook asks the overlay engine and returns `skip` with the ownership reason. The operator then asks for the change the way the guard allows, and the overlay source is edited.
- Expected signals: a journal `hook_completed` record for `pre_tool_call` whose output is `skip` naming config/settings.json is owned by skilled-overlays/files/settings.json; edit the overlay, the deny notice naming `overlay-guard`, and a live file that ends up byte-identical to the edited overlay source.
- Desired user-visible outcome: the session reports the refusal, names the overlay file, and makes the change there.
- Pass/fail: PASS when both turn checks pass. FAIL when the journal holds no refusal or the change never reaches the live file through the overlay.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Open config/settings.json and change retries from 1 to 3.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-012 | Overlay guard | Refuse a write to a file a vendored overlay owns and name the overlay | `Open config/settings.json and change retries from 1 to 3.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/overlay-guard.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-012 --overwrite` | A `pre_tool_call` `skip` naming `is owned by skilled-overlays/files/settings.json`, a deny notice naming `overlay-guard`, and a live file that ends up identical to the overlay source | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL when the refusal record is missing or the overlay edit never reaches the live file. | 1. Read the edit turn's check.txt and screen.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `overlay-guard`. 3. Run the overlay engine's `--guard` query by hand against the live path and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "mkdir -p skilled-overlays/files config",
    "printf '{\\n  \"retries\": 1,\\n  \"generatedFrom\": \"overlay\"\\n}\\n' > skilled-overlays/files/settings.json",
    "printf '{\\n  \"retries\": 1\\n}\\n' > config/settings.json",
    "printf '%s\\n' '{\"schemaVersion\": 1, \"pin\": {\"upstream\": \"fixture\", \"commit\": \"pin-one\"}, \"overlays\": [{\"id\": \"settings\", \"scope\": \"file\", \"source\": \"files/settings.json\", \"destination\": \"config/settings.json\"}]}' > skilled-overlays/overlay-manifest.json"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "edit",
      "send": "Open config/settings.json and change retries from 1 to 3.",
      "questions": [
        {
          "match": "[Oo]verlay|owned|[Rr]etries|which file",
          "answer": {
            "other": "Make the change in config/settings.json itself."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'is owned by skilled-overlays/files/settings.json' \"$VIBE_HOME/logs/session/unified\" && grep -rqs '\"hookName\":\"overlay-guard\"' \"$VIBE_HOME/logs/session/unified\" && echo overlay-refused"
    },
    {
      "id": "apply-through-overlay",
      "send": "Go ahead and make the change the way the guard says, then show me both files.",
      "questions": [
        {
          "match": "[Oo]verlay|[Aa]pply|[Cc]onfirm",
          "answer": {
            "other": "Edit the overlay source and apply it, exactly as the guard says."
          },
          "optional": true
        }
      ],
      "check": "grep -qs '\"retries\": 3' config/settings.json && cmp -s config/settings.json skilled-overlays/files/settings.json && echo applied-through-overlay"
    }
  ]
}
```

The overlay tree lives only in the scratch project: the manifest, its source folder and the live destination are all created by setup, so the guard judges the scratch project's own manifest and no write ever targets the checkout. The manifest is written on one line, so a `printf` in setup produces the exact JSON the engine reads. Setup gives the overlay source an extra key, so the two files start different and the second turn's byte comparison can only pass once the change travels through the overlay. The spec gate is switched off for this run, because the scenario judges only the overlay guard. The optional questions let the subject confirm the target and the overlay route once the refusal names the overlay.

### Expected

Turn `edit` finds the refusal and the deny notice in the journal. Turn `apply-through-overlay` confirms the live file holds `retries: 3` and is byte-identical to the overlay source, which is what an overlay-first change leaves behind.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the `pre_tool_call` `skip` naming the overlay source and the deny notice, and the live file ends up matching the edited overlay source.
- **Fail**: no refusal record, or the change never reaches the live file through the overlay.

### Failure Triage

1. Read the edit turn's check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `overlay-guard`.
3. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard <absolute live path> --root <scratch project>` and read its output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`guards-and-hooks.md`](../../references/guards-and-hooks.md) | Vibe hook and plugin classification |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.vibe/plugins/repo-guards/overlay-guard.mjs` | The hook under test |
| `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` | The runtime-neutral core that asks the engine and composes the reason |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine's `--guard` query, and the source of the overlay label in the reason |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-012
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/overlay-guard.md`
