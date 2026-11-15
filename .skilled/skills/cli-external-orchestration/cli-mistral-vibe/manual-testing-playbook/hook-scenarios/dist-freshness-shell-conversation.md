---
title: "VIB-HK-018 -- Dist freshness warns when a spec validation command trusts a stale build"
description: "This scenario validates that the Vibe dist-freshness-shell post_tool hook appends a STALE DIST WARNING to a bash result when the command is a spec validation and the checkout's watched builds are behind their sources, judged from the session journal."
version: 1.0.0.0
---

# VIB-HK-018 -- Dist freshness warns when a spec validation command trusts a stale build

This document captures the operator contract for `VIB-HK-018`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to run the spec validator over a small packet. The `dist-freshness-shell` `post_tool` hook must recognise the command as one that trusts the local build and append a `STALE DIST WARNING` to the bash result when a watched package's build is behind its sources.

### Why This Matters

A validation or a headless dispatch reads the compiled build, so a stale build makes the command judge code that is not the code on disk. The hook is the only place that says so before the operator reads the result, and it is non-strict, so a silent hook reads exactly like a fresh build.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `dist-freshness-shell` appends a `STALE DIST WARNING` to a `bash` result whose command runs the spec validator while a watched package's build is stale.
- Real user request: `Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished`
- Prompt: `Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished`
- Expected execution process: the runner creates a scratch project holding a small spec packet and a link to the checkout's spec-kit tree, renders the repository hooks into a fresh `VIBE_HOME`, starts Vibe and types the prompt. The subject runs the validator through `bash`, and the hook matches the command as one that trusts the local build and runs the staleness checker across every watched package.
- Expected signals: a journal `post_tool_call` record for the `bash` call whose tool result carries `Dist freshness after this tool call` and a `STALE DIST WARNING` line naming a watched package and its rebuild command.
- Desired user-visible outcome: the session reports the validator's verdict together with the warning that the build it trusted is behind its sources.
- Pass/fail: PASS when the journal carries the warning on the `bash` result. When every watched package in the checkout is fresh the check reports a skip that names that blocker, and the operator procedure recorded with this scenario's live evidence carries the manual steps.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-018 | Dist freshness on a shell command | Warn when a spec validation command trusts a stale build | `Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished` | `CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/dist-freshness-shell-conversation.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-018` | A `post_tool_call` result on `bash` carrying `Dist freshness after this tool call` and a `STALE DIST WARNING` naming a watched package | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when the warning is on the bash result. A skip naming a fresh checkout build is the recorded blocker, not a pass. | 1. Read the validate turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `dist-freshness-shell` with `match = "re:bash|process_start"`. 3. Run the staleness checker with `--all` by hand and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "mkdir -p .skilled/skills specs/demo/001-greeting",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit\" .skilled/skills/system-spec-kit",
    "printf '# Demo packet\\n\\nA one-file packet the validator can read.\\n' > specs/demo/001-greeting/spec.md"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "validate",
      "send": "Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Cc]onfirm|[Ww]hich packet|[Rr]ebuild",
          "answer": {
            "other": "Use specs/demo/001-greeting and run the command exactly as I wrote it."
          },
          "optional": true
        }
      ],
      "check": "grep -rqs 'validator-finished' \"$VIBE_HOME/logs/session/unified\" || { echo 'the validation command never reached the shell, so the dist hook had nothing to judge'; exit 1; }; if grep -rqs 'STALE DIST WARNING' \"$VIBE_HOME/logs/session/unified\"; then echo warning-recorded; else echo 'no warning: every watched package in the checkout is fresh, so the all-packages check reports nothing and the runner cannot make the checkout stale mid-session'; exit 77; fi"
    },
    {
      "id": "build-state",
      "check": "state=$(node \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs\" check-all --json --no-write); case \"$state\" in *'\"stale\":false'*) echo 'no warning: every watched package in the checkout is fresh, so the all-packages check reports nothing and the runner cannot make the checkout stale mid-session'; exit 77;; esac; grep -rqs 'STALE DIST WARNING' \"$VIBE_HOME/logs/session/unified\" && grep -rqs 'npm run build' \"$VIBE_HOME/logs/session/unified\" && echo warning-names-package"
    }
  ]
}
```

The hook judges the checkout, not the scratch project: its checker runs from the checkout and its all-packages mode resolves every watched package against the checkout's own tree, so the scenario cannot borrow a stale build from the scratch project. The scratch project carries a link to the checkout's spec-kit tree so the validator path in the prompt resolves, and a one-file packet so the command has something to read. The validator's own verdict is not under test, so the command ends with an echo that leaves the shell successful and the hook's post-call seam reachable. The spec gate is switched off for this run, because the scenario judges only the dist hook and a spec-gate refusal would stop the shell call first.

### Expected

Turn `validate` finds the hook's banner and a `STALE DIST WARNING` in the journal's bash result when a watched build is stale; on a checkout whose builds are fresh it reports a skip naming that state instead. Turn `build-state` records the checkout's build state, which is what tells a reviewer whether a skip was the honest outcome or a hook that never fired.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the journal holds the banner with a `STALE DIST WARNING` naming a watched package on the bash result.
- **Fail**: no warning record while a watched package is stale, or a warning attached to a different tool call.

### Failure Triage

1. Read turns/validate/check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `dist-freshness-shell` with `match = "re:bash|process_start"`.
3. Run `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all` by hand and read its output.

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
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The checker the hook runs in its all-packages mode |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | The watched-package registry and the staleness verdict |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | The validation command that makes the shell call risky |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-018
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/dist-freshness-shell-conversation.md`
