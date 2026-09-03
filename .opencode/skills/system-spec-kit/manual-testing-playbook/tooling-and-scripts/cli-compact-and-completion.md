---
title: "449 -- CLI compact list-tools and completion generation"
description: "Manual check that the skill-advisor CLI exposes compact and names-only list-tools output without schemas, and generates parseable bash/zsh completion scripts."
version: 4.0.0.0
id: tooling-and-scripts-cli-compact-and-completion
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 449 -- CLI compact list-tools and completion generation

## 1. OVERVIEW

This scenario verifies the automation-focused discovery forms on the one daemon-backed CLI that survives the memory decommission. `list-tools --compact` and `list-tools --names-only` must preserve the advisor's expected count while omitting every `inputSchema` field, and `completion bash|zsh` must generate shell scripts that parse under the target shell. The `spec-memory` and `code-index` CLIs this scenario used to cover were removed with their servers.

The scenario is daemon-free: list output and completion scripts are generated from local registries and do not contact the daemon socket.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm compact/names-only CLI discovery and generated shell completion work for the skill-advisor CLI.
- Real user request: `I want a small automation payload for tool names and generated shell completion for the advisor CLI. Can I validate those without starting daemons?`
- Prompt: `Validate compact list-tools, names-only list-tools, and bash/zsh completion generation for skill-advisor.`
- Expected execution process: Run the documented command sequence from the repository root, capture JSON counts and schema-field counts, generate bash and zsh completion snippets into temporary files, and parse those files with `bash -n` and `zsh -n`.
- Expected signals: Compact and names-only counts both equal the advisor's declared tool count; compact and names-only outputs contain zero `inputSchema` fields; the generated bash and zsh completion scripts parse successfully.
- Desired user-visible outcome: The operator can state that the advisor CLI exposes compact automation output and parseable shell completion without daemon contact.
- Pass/fail: PASS only when both counts match, schema-field counts are zero, and both generated completion scripts parse under their target shell.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate compact list-tools, names-only list-tools, and bash/zsh completion generation for skill-advisor.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-compact-completion.XXXXXX)

cli=skill-advisor
node .opencode/bin/$cli.cjs list-tools --compact --format json > "$SANDBOX/$cli.compact.json"
node .opencode/bin/$cli.cjs list-tools --names-only --format json > "$SANDBOX/$cli.names.json"
node .opencode/bin/$cli.cjs completion bash > "$SANDBOX/$cli.bash"
node .opencode/bin/$cli.cjs completion zsh > "$SANDBOX/$cli.zsh"

python3 - "$SANDBOX" <<'PY'
import json
import pathlib
import sys

root = pathlib.Path(sys.argv[1])
expected = {"skill-advisor": 9}
for cli, count in expected.items():
    compact = json.loads((root / f"{cli}.compact.json").read_text())
    names = json.loads((root / f"{cli}.names.json").read_text())
    compact_schemas = sum(1 for tool in compact["data"].get("tools", []) if "inputSchema" in tool)
    names_schemas = "inputSchema" in json.dumps(names)
    print(f"{cli} compact count={compact['data']['count']} inputSchema={compact_schemas}")
    print(f"{cli} names-only count={names['data']['count']} inputSchema={int(names_schemas)}")
    assert compact["data"]["count"] == count
    assert names["data"]["count"] == count
    assert compact_schemas == 0
    assert not names_schemas
PY

bash -n "$SANDBOX/skill-advisor.bash"
zsh -n "$SANDBOX/skill-advisor.zsh"

rm -rf "$SANDBOX"
```

### Expected

- `skill-advisor compact count=9 inputSchema=0` and `skill-advisor names-only count=9 inputSchema=0`.
- `bash -n` and `zsh -n` succeed for both generated completion files.

### Evidence

The recorded transcript for this scenario predates the memory decommission: it ran the
`spec-memory` shim, hit a stale-dist refusal, and never produced count lines. It was removed
rather than reinterpreted, because it describes a CLI that no longer exists. Re-execute the
Commands block against the advisor CLI and capture the transcript here before this scenario
carries a verdict again.

### Pass / Fail

- **Pass**: All counts match, schema-field counts are zero, and every generated completion script parses under its target shell.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If counts drift, rerun the list-tools parity scenario first. If schemas appear in compact output, inspect the list renderer for that CLI. If completion parsing fails, inspect the completion generator for shell quoting and command-name normalization.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/skill-advisor-cli-daemon-backed-surface.md` | Feature-catalog source for the daemon-backed CLI surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/skill-advisor.cjs` | skill-advisor shim |
| `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` | skill-advisor compact/names-only and completion implementation |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-help-aliases-errors.vitest.ts` | skill-advisor compact/names-only and completion tests |

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 449
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/cli-compact-and-completion.md`
