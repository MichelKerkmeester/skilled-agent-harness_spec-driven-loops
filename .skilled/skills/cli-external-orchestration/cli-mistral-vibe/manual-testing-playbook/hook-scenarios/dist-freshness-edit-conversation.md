---
title: "VIB-HK-017 -- Dist freshness warns when an edit leaves a watched package's build behind"
description: "This scenario validates that the Vibe dist-freshness-edit post_tool hook appends a STALE DIST WARNING to the tool result when an edit lands in a watched package's source while its build entry is older, judged from the session journal."
version: 1.0.0.0
---

# VIB-HK-017 -- Dist freshness warns when an edit leaves a watched package's build behind

This document captures the operator contract for `VIB-HK-017`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to add an export to a watched package's source file in a scratch project whose build entry is older than that source. The `dist-freshness-edit` `post_tool` hook must append a `STALE DIST WARNING` to the tool result.

### Why This Matters

The warning is the only signal that the build a later command will trust is behind the source an edit just changed. The hook is non-strict, so a broken binding or a checker that cannot map the file leaves the tool result looking complete, and only the journal shows whether the warning was ever produced.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `dist-freshness-edit` appends a `STALE DIST WARNING` naming the watched package after an edit to that package's source.
- Real user request: `Add an exported farewell constant to .skilled/skills/system-spec-kit/shared/src/greeting.ts.`
- Prompt: `Add an exported farewell constant to .skilled/skills/system-spec-kit/shared/src/greeting.ts.`
- Expected execution process: the runner builds a scratch project containing the `@spec-kit/shared` package skeleton, with a `dist/tsconfig.tsbuildinfo` build entry dated before the source, renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. The subject edits the source file, and the hook runs the checkout's staleness checker on that file with the scratch project named as the workspace root.
- Expected signals: a journal `post_tool_call` record whose tool result carries `Dist freshness after this tool call` and a `STALE DIST WARNING: @spec-kit/shared` line naming the rebuild command.
- Desired user-visible outcome: the session reports the warning and the rebuild command, and the edit itself still lands.
- Pass/fail: PASS when both turn checks pass. FAIL when the journal holds no warning, or the warning names no watched package.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add an exported farewell constant to .skilled/skills/system-spec-kit/shared/src/greeting.ts.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-017 | Dist freshness on edit | Warn when an edit leaves a watched package's build behind its source | `Add an exported farewell constant to .skilled/skills/system-spec-kit/shared/src/greeting.ts.` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/dist-freshness-edit-conversation.md --runtime vibe --scratch /private/tmp/vib-hk-017 --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-017` | A `post_tool_call` result carrying `Dist freshness after this tool call` and `STALE DIST WARNING: @spec-kit/shared` with its rebuild command | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL when the warning or the package name is missing. | 1. Read the edit turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `dist-freshness-edit` with `match = "re:write_file|edit"`. 3. Run the staleness checker on the edited file with the same workspace root by hand. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "mkdir -p .skilled/skills/system-spec-kit/shared/src .skilled/skills/system-spec-kit/shared/dist .skilled/skills/system-spec-kit/shared/node_modules",
    "printf '{\"name\":\"@spec-kit/shared\",\"version\":\"0.0.0\"}\\n' > .skilled/skills/system-spec-kit/shared/package.json",
    "printf '{\"compilerOptions\":{}}\\n' > .skilled/skills/system-spec-kit/shared/tsconfig.json",
    "printf 'export const greeting = \"hello\";\\n' > .skilled/skills/system-spec-kit/shared/src/greeting.ts",
    "printf '{\"program\":{}}\\n' > .skilled/skills/system-spec-kit/shared/dist/tsconfig.tsbuildinfo",
    "touch -t 202001010000 .skilled/skills/system-spec-kit/shared/dist/tsconfig.tsbuildinfo"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1",
    "SPECKIT_DIST_WORKSPACE_ROOT": "/private/tmp/vib-hk-017/vibe"
  },
  "turns": [
    {
      "id": "edit",
      "send": "Add an exported farewell constant to .skilled/skills/system-spec-kit/shared/src/greeting.ts.",
      "questions": [
        {
          "match": "[Rr]ebuild|[Ss]pec folder|[Dd]ocumentation|[Cc]onfirm|[Ww]hich file",
          "answer": {
            "other": "Leave the build alone and just add the export."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'Dist freshness after this tool call' \"$VIBE_HOME/logs/session/unified\" && grep -rqs 'STALE DIST WARNING' \"$VIBE_HOME/logs/session/unified\" && echo stale-warned"
    },
    {
      "id": "package",
      "check": "grep -rqs 'STALE DIST WARNING: @spec-kit/shared' \"$VIBE_HOME/logs/session/unified\" && grep -rqs 'npm run build' \"$VIBE_HOME/logs/session/unified\" && echo package-named"
    }
  ]
}
```

The checker resolves watched packages from a workspace root, and the hook hands it the checkout's own copy of the checker, so the scenario names the scratch project as that root through `SPECKIT_DIST_WORKSPACE_ROOT`. The scratch path is fixed rather than freshly made, because that variable has to name the project before the runner creates it; a fresh temporary path would differ from the value the subject inherits. Setup gives the package a manifest and a `node_modules` folder so the checker treats it as provisioned, and dates the build entry before the source so the comparison is a real staleness verdict rather than a missing build. The spec gate is switched off for this run, because the scenario judges only the dist hook and a spec-gate refusal would stop the edit first. The optional question lets the subject ask about a rebuild before it edits.

### Expected

Turn `edit` finds the hook's banner and the warning in the journal's tool result. Turn `package` finds the warning naming `@spec-kit/shared` and its rebuild command, which is what tells an operator the checker mapped the edited file to a watched package rather than reporting an unmatched path.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the banner with a `STALE DIST WARNING: @spec-kit/shared` line and its rebuild command.
- **Fail**: no warning record, or a warning that names no watched package.

### Failure Triage

1. Read turns/edit/check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `dist-freshness-edit` with `match = "re:write_file|edit"`.
3. Run `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` on the edited file with `SPECKIT_DIST_WORKSPACE_ROOT` naming the scratch project and read its output.

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
| `.vibe/plugins/repo-guards/dist-freshness.mjs` | The hook under test |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The checker the hook runs |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | The watched-package registry and the staleness verdict |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-017
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/dist-freshness-edit-conversation.md`
