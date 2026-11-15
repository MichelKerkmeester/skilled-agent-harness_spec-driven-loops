# VIB-HK-013 -- manual probe evidence

This file records the hand-run that supports `procedure.md`. It is not a runner verdict: the
conversation runner cannot build a home with an MCP server row, so the scenario stays OPERATOR-ONLY.

---

## 1. ENVIRONMENT

- Vibe 3.1.2, headless, `--model deepseek-flash`.
- `VIBE_HOME` a fresh temp directory holding the checkout's `config.toml` plus one appended row:

  ```toml
  [[mcp_servers]]
  name = "github"
  transport = "stdio"
  command = "node"
  args = ["<absolute path to a local stdio MCP server exposing one get_file tool>"]
  ```

- The repository hooks rendered into the same home with
  `node .vibe/plugins/repo-guards/render-home-hooks.cjs "$VIBE_HOME"`.
- Scratch project holding only `README.md`, so the call target cannot be confused with the
  checkout.
- Command:

  ```bash
  cd "$SCRATCH/project" && VIBE_HOME="$VIBE_HOME" vibe \
    -p "Use the github MCP server's get_file tool to read README.md, then reply with the first line it returned." \
    --model deepseek-flash --output-dir "$VIBE_HOME/out" --max-turns 3 --auto-approve </dev/null
  ```

- The run stopped at `turn_limit` (exit 3) because the model kept working after the refusal; the
  hook records below are the evidence this probe exists for.

## 2. OBSERVED RECORDS

The pre_tool_call payload named the call the way the hook expects:

```json
"call": {"arguments": {"path": "README.md"}, "group_name": "mcp_github", "tool_name": "get_file", "type": "provided"}
```

The hook returned the routing advisory as a skip:

```json
{"hook":"pre_tool_call","output":{"reason":[{"text":"native call to \"github\" -- Code Mode can route this family via the \"github\" manual (call_tool_chain); route through Code Mode for the ~98% context reduction the mcp-code-mode SKILL mandates.","type":"text"}],"type":"skip"}}
```

The bound hooks the record lists include `{"id":"user:mcp-route-guard","order":7,"point":"pre_tool_call"}`.

Vibe recorded the deny notice:

```text
Denied tool 'get_file'
```

`$VIBE_HOME/out/export.json` reported the server row under `config.mcp_servers`, so the home — not
the scratch project — is what made the tool exist.

## 3. WHAT THIS SETTLES

- Vibe's route for the call is `mcp_github.get_file`, the shape `mcp-route-guard` repacks.
- The hook denies that call and Vibe records the denial.
- What blocks a runner verdict is only the home construction: the runner copies the checkout's
  config and adds nothing, and it launches Vibe without a trust flag.
