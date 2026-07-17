---
title: "449 -- CLI compact list-tools and completion generation"
description: "Manual check that all three daemon-backed CLIs expose compact and names-only list-tools output without schemas, and generate parseable bash/zsh completion scripts."
version: 3.6.0.1
id: tooling-and-scripts-cli-compact-and-completion
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 449 -- CLI compact list-tools and completion generation

## 1. OVERVIEW

This scenario verifies the automation-focused discovery forms added to the three daemon-backed CLIs. `list-tools --compact` and `list-tools --names-only` must preserve each system's expected count while omitting every `inputSchema` field. `completion bash|zsh` must generate shell scripts that parse under the target shell for `spec-memory`, `code-index`, and `skill-advisor`.

The scenario is daemon-free: list output and completion scripts are generated from local registries and do not contact the daemon socket.

## 2. SCENARIO CONTRACT

- Objective: Confirm compact/names-only CLI discovery and generated shell completion work for all three daemon-backed CLIs.
- Real user request: `I want a small automation payload for tool names and generated shell completion for every daemon CLI. Can I validate those without starting daemons?`
- Prompt: `Validate compact list-tools, names-only list-tools, and bash/zsh completion generation for spec-memory, code-index, and skill-advisor.`
- Expected execution process: Run the documented command sequence from the repository root, capture JSON counts and schema-field counts, generate bash and zsh completion snippets into temporary files, and parse those files with `bash -n` and `zsh -n`.
- Expected signals: Compact and names-only counts are `39`, `8`, and `9`; compact and names-only outputs contain zero `inputSchema` fields; generated bash and zsh completion scripts parse successfully for all three CLIs.
- Desired user-visible outcome: The operator can state that all three CLIs expose compact automation output and parseable shell completion without daemon contact.
- Pass/fail: PASS only when all counts match, schema-field counts are zero, and every generated completion script parses under its target shell.

## 3. TEST EXECUTION

### Prompt

```text
Validate compact list-tools, names-only list-tools, and bash/zsh completion generation for spec-memory, code-index, and skill-advisor.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-compact-completion.XXXXXX)

for cli in spec-memory code-index skill-advisor; do
  node .opencode/bin/$cli.cjs list-tools --compact --format json > "$SANDBOX/$cli.compact.json"
  node .opencode/bin/$cli.cjs list-tools --names-only --format json > "$SANDBOX/$cli.names.json"
  node .opencode/bin/$cli.cjs completion bash > "$SANDBOX/$cli.bash"
  node .opencode/bin/$cli.cjs completion zsh > "$SANDBOX/$cli.zsh"
done

python3 - "$SANDBOX" <<'PY'
import json
import pathlib
import sys

root = pathlib.Path(sys.argv[1])
expected = {"spec-memory": 39, "code-index": 8, "skill-advisor": 9}
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

for cli in spec-memory code-index skill-advisor; do
  bash -n "$SANDBOX/$cli.bash"
  zsh -n "$SANDBOX/$cli.zsh"
done

rm -rf "$SANDBOX"
```

### Expected

- `spec-memory compact count=37 inputSchema=0` and `spec-memory names-only count=37 inputSchema=0`.
- `code-index compact count=8 inputSchema=0` and `code-index names-only count=8 inputSchema=0`.
- `skill-advisor compact count=9 inputSchema=0` and `skill-advisor names-only count=9 inputSchema=0`.
- `bash -n` and `zsh -n` succeed for every generated completion file.

### Evidence

Shell transcript from running the Commands block exactly as written:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
Traceback (most recent call last):
  File "<stdin>", line 8, in <module>
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py", line 346, in loads
    return _default_decoder.decode(s)
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py", line 337, in decode
    obj, end = self.raw_decode(s, idx=_w(s, 0).end())
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py", line 355, in raw_decode
    raise JSONDecodeError("Expecting value", s, err.value) from None
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
```

No count/schema lines were produced because the first JSON parse failed before the expected `print(...)` lines could run. The shell parse commands did not emit output.

### Pass / Fail

- **BLOCKED**: the local `@spec-kit/mcp-server` build output is stale, so the daemon-backed CLI command output was not parseable JSON and the scenario could not verify the expected counts, schema absence, or completion parsing evidence.

### Failure Triage

If counts drift, rerun the list-tools parity scenario first. If schemas appear in compact output, inspect the list renderer for that CLI. If completion parsing fails, inspect the completion generator for shell quoting and command-name normalization.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md` | Feature-catalog source for the daemon-backed CLI surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/spec-memory.cjs` | spec-memory shim |
| `.opencode/bin/code-index.cjs` | code-index shim |
| `.opencode/bin/skill-advisor.cjs` | skill-advisor shim |
| `mcp_server/spec-memory-cli.ts` | spec-memory compact/names-only and completion implementation |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | code-index compact/names-only and completion implementation |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | skill-advisor compact/names-only and completion implementation |
| `mcp_server/tests/spec-memory-cli-help-aliases-errors.vitest.ts` | spec-memory compact/names-only and completion tests |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-help-aliases-errors.vitest.ts` | code-index compact/names-only and completion tests |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-help-aliases-errors.vitest.ts` | skill-advisor compact/names-only and completion tests |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 449
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/cli_compact_and_completion.md`
