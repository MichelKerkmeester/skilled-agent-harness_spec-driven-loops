---
title: "VIB-HK-018 -- Dist freshness warns when a spec validation command trusts a stale build"
description: "This scenario validates that the Vibe dist-freshness-shell post_tool hook appends a STALE DIST WARNING to a bash result when the command is a spec validation and the checkout's watched builds are behind their sources, judged from the session journal."
version: 1.0.2.0
---

# VIB-HK-018 -- Dist freshness warns when a spec validation command trusts a stale build

This document captures the operator contract for `VIB-HK-018`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session to run the spec validator over a small packet while a watched package in the scratch workspace has a stale build, then to run a read-only command. The `dist-freshness-shell` `post_tool` hook must recognise the command as one that trusts the local build and append a `STALE DIST WARNING` to the bash result when a watched package's build is behind its sources, and leave the read-only command alone.

### Why This Matters

A validation or a headless dispatch reads the compiled build, so a stale build makes the command judge code that is not the code on disk. The hook is the only place that says so before the operator reads the result, and it is non-strict, so a silent hook reads exactly like a fresh build.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the journal evidence.

- Objective: verify that `dist-freshness-shell` appends a `STALE DIST WARNING` to a `bash` result whose command runs the spec validator while a watched package's build is stale.
- Real user request: `Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished`, then `Now list the files in specs/demo/001-greeting with ls and tell me what is there.`
- Prompt: `Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished`
- Expected execution process: the runner creates the scratch project at `/private/tmp/vib-hk-018/vibe`, holding a small spec packet, a link to the checkout's spec-kit tree and a stale copy of the watched `@utcp/code-mode-mcp` package. `SPECKIT_DIST_WORKSPACE_ROOT` names that project, so the checker's all-packages mode judges the scratch workspace, and `SPECKIT_DIST_AUTO_REBUILD=0` keeps the session-start self-heal from rebuilding it. The subject runs the validator through `bash`, and the hook matches the command as one that trusts the local build and runs the staleness checker across every watched package. The second turn runs `ls`, which the hook must not judge.
- Expected signals: the `post_tool_call` result of the validator's `bash` call, the one that prints `validator-finished`, carries `STALE DIST WARNING: @utcp/code-mode-mcp`, and the `ls` call's result, which lists `spec.md`, carries no warning.
- Desired user-visible outcome: the session reports the validator's verdict together with the warning that the build it trusted is behind its sources.
- Pass/fail: PASS when both turn checks pass. FAIL when the validator never reached the shell, no `post_tool_call` result carries the warning, or the read-only call earned one too. A setup skip means the run did not use `--scratch /private/tmp/vib-hk-018`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished`
- Follow-up: `Now list the files in specs/demo/001-greeting with ls and tell me what is there.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-018 | Dist freshness on a shell command | Warn when a spec validation command trusts a stale build | `Run the spec validator over specs/demo/001-greeting and tell me what it reports: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/demo/001-greeting --strict; echo validator-finished` | `chmod -R u+w /private/tmp/vib-hk-018 2>/dev/null; rm -rf /private/tmp/vib-hk-018; mkdir -p /private/tmp/vib-hk-018; CONVERSATION_REPO_ROOT="$(git rev-parse --show-toplevel)" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/dist-freshness-shell.md --runtime vibe --scratch /private/tmp/vib-hk-018 --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-018` | The validator call's `post_tool_call` result carrying `STALE DIST WARNING: @utcp/code-mode-mcp`, then an `ls` result with no warning | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt` | PASS when both checks pass. FAIL on any other outcome. | 1. Read the validate turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `dist-freshness-shell` with `match = "re:bash|process_start"`. 3. Run the staleness checker with `--all` and the same `SPECKIT_DIST_WORKSPACE_ROOT` by hand and read its output. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "mkdir -p .skilled/skills specs/demo/001-greeting",
    "ln -s \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit\" .skilled/skills/system-spec-kit",
    "printf '# Demo packet\\n\\nA one-file packet the validator can read.\\n' > specs/demo/001-greeting/spec.md",
    "mkdir -p .skilled/skills/mcp-code-mode/mcp-server/dist .skilled/skills/mcp-code-mode/mcp-server/node_modules",
    "printf '{\"name\":\"@utcp/code-mode-mcp\",\"version\":\"0.0.0\"}\\n' > .skilled/skills/mcp-code-mode/mcp-server/package.json",
    "printf '{\"compilerOptions\":{}}\\n' > .skilled/skills/mcp-code-mode/mcp-server/tsconfig.json",
    "printf 'export const ready = true;\\n' > .skilled/skills/mcp-code-mode/mcp-server/index.ts",
    "printf 'export const ready = true;\\n' > .skilled/skills/mcp-code-mode/mcp-server/dist/index.js",
    "touch -t 202001010000 .skilled/skills/mcp-code-mode/mcp-server/dist/index.js",
    "test \"$(pwd -P)\" = /private/tmp/vib-hk-018/vibe || { echo 'run with --scratch /private/tmp/vib-hk-018 so SPECKIT_DIST_WORKSPACE_ROOT names this project'; exit 77; }"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1",
    "SPECKIT_DIST_WORKSPACE_ROOT": "/private/tmp/vib-hk-018/vibe",
    "SPECKIT_DIST_AUTO_REBUILD": "0"
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
      "check": "grep -rqs 'validator-finished' \"$VIBE_HOME/logs/session/unified\" || { echo 'the validation command never reached the shell'; exit 1; }; for i in $(seq 1 20); do node \"$CONVERSATION_REPO_ROOT/.vibe/plugins/repo-guards/fixtures/journal-check.cjs\" \"$VIBE_HOME/logs/session/unified\" post-tool-has 'validator-finished' 'STALE DIST WARNING: @utcp/code-mode-mcp' && echo validator-result-warned && exit 0; sleep 1; done; exit 1"
    },
    {
      "id": "read-only-shell",
      "send": "Now list the files in specs/demo/001-greeting with ls and tell me what is there.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Cc]onfirm|[Ww]hich",
          "answer": {
            "other": "Just run ls on that folder."
          },
          "optional": true
        }
      ],
      "check": "for i in $(seq 1 20); do node \"$CONVERSATION_REPO_ROOT/.vibe/plugins/repo-guards/fixtures/journal-check.cjs\" \"$VIBE_HOME/logs/session/unified\" post-tool-lacks 'spec.md' 'STALE DIST WARNING' && echo read-only-call-earned-no-warning && exit 0; sleep 1; done; exit 1"
    }
  ]
}
```

The hook's checker runs from the checkout, and its all-packages mode resolves every watched package against `SPECKIT_DIST_WORKSPACE_ROOT` when that is set, so the scenario points it at the scratch project and plants a stale build there. The checkout itself is never made stale. The variable is a fixed path, so the run needs `--scratch /private/tmp/vib-hk-018`, and setup skips with that reason otherwise. Clear that folder before each run: the runner leaves the Vibe home it made beside the project, Vibe extracts its bundled plugins there read-only, and the runner refuses a non-empty scratch root, so the command first makes the folder writable and removes it. The scratch project carries a link to the checkout's spec-kit tree so the validator path in the prompt resolves, and a one-file packet so the command has something to read. The validator's own verdict is not under test, so the command ends with an echo that leaves the shell successful and the hook's post-call seam reachable. The checks read one tool call's own `post_tool_call` result through `.vibe/plugins/repo-guards/fixtures/journal-check.cjs`, because the session-start hook prints the same warning at launch, the journal repeats the text in later model inputs, a model may run the validator twice, and Vibe moves older records into a snapshot generation as the session grows. The spec gate is switched off for this run, because the scenario judges only the dist hook and a spec-gate refusal would stop the shell call first.

### Expected

Turn `validate` finds the warning `STALE DIST WARNING: @utcp/code-mode-mcp` in the `post_tool_call` result that prints `validator-finished`. Turn `read-only-shell` finds the `ls` call's `post_tool_call` result, which lists `spec.md`, with no warning in it.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`.

### Pass / Fail

- **Pass**: the validator call's `post_tool_call` result carries the warning for the stale package, and the read-only call's result carries none.
- **Fail**: no warning on the validator's result, or a warning on the read-only call.

### Failure Triage

1. Read turns/validate/check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `dist-freshness-shell` with `match = "re:bash|process_start"`.
3. Run `SPECKIT_DIST_WORKSPACE_ROOT=/private/tmp/vib-hk-018/vibe .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all` by hand and read its output.

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
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | The checker the hook runs in its all-packages mode, honoring `SPECKIT_DIST_WORKSPACE_ROOT` |
| `.vibe/plugins/repo-guards/fixtures/journal-check.cjs` | The journal check that reads one tool call's `post_tool_call` result |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | The watched-package registry and the staleness verdict |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | The validation command that makes the shell call risky |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-018
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/dist-freshness-shell.md`
