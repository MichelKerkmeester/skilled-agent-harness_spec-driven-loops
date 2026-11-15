# VIB-HK-013 -- OPERATOR-ONLY procedure

The scenario `hook-scenarios/mcp-route-guard-conversation.md` cannot be driven by the conversation
runner: the runner builds the subject's `VIBE_HOME` itself and never registers an MCP server, and
Vibe only reads a native server row from a trusted home. This file names that limitation with the
code and the observation behind it, then gives the manual procedure an operator runs instead.

Verdict: OPERATOR-ONLY. No runner matrix row can turn this scenario PASS.

---

## 1. THE RUNNER LIMITATION

1. The `vibe` adapter creates a fresh home at launch and copies only the checkout's own config into
   it. `run-conversation-scenario.cjs` line 1268 makes the home with `mkdtempSync`, line 1271
   copies `<repoRoot>/.vibe/config.toml` into it, and line 1276 renders the repository hooks into
   it. Nothing in the scenario schema can add a file to that home, and `setup` runs before the home
   exists.
2. The launch line names no trust flag. Line 1546 is
   `['vibe', '--output-dir', path.join(home, 'output'), '--auto-approve']`.
3. A scratch project's own `.vibe/config.toml` is therefore ignored. Observed on Vibe 3.1.2 with a
   project holding an `[[mcp_servers]]` row and the adapter's exact launch flags:

   ```text
   Warning: <scratch project> is not trusted; project configuration (.vibe/) will be ignored.
   Re-run with --trust to trust this folder temporarily.
   ```

   The run's `export.json` reported `"mcp_servers": []` under `config`, so the subject had no native
   MCP tool to call and no journal record for `mcp-route-guard` could exist.

A subject also cannot repair this itself: Vibe registers MCP tools once, when the tool registry is
built at startup, and `vibe mcp add` writes to the user configuration, not to the running session.

---

## 2. WHAT WAS VERIFIED BY HAND

The hook and the route name are not in doubt. A headless Vibe session was started against a home
that held this row, with the repository hooks rendered into the same home:

```toml
[[mcp_servers]]
name = "github"
transport = "stdio"
command = "node"
args = ["<absolute path to a local stdio MCP server exposing one get_file tool>"]
```

The prompt was `Use the github MCP server's get_file tool to read README.md, then reply with the
first line it returned.` The session journal then held:

```text
"hook":"pre_tool_call","hook_binding_ids":[... "user:mcp-route-guard" ...]
"output":{"reason":[{"text":"native call to \"github\" -- Code Mode can route this family via the
\"github\" manual (call_tool_chain); route through Code Mode for the ~98% context reduction the
mcp-code-mode SKILL mandates.","type":"text"}
Denied tool 'get_file'
```

So Vibe names the call `mcp_github.get_file`, which is the shape the hook repacks, the hook denies
it, and Vibe records the deny notice. Only the home construction stands between this scenario and a
runner PASS.

---

## 3. MANUAL PROCEDURE

Run each step from the repository root and replace `<scratch>` with a temp folder you own.

1. Build the scratch project and a README:

   ```bash
   SCRATCH=$(mktemp -d)
   mkdir -p "$SCRATCH/project"
   printf '# demo project\nhello from the readme\n' > "$SCRATCH/project/README.md"
   ```

2. Write a minimal stdio MCP server that exposes one `get_file` tool. Any MCP server works; a
   hand-rolled node script that answers `initialize`, `tools/list` and `tools/call` over stdin and
   stdout is enough, and it keeps the scenario free of installs.

3. Build the home, copy the checkout's config, append the server row, and render the hooks into the
   same home:

   ```bash
   export VIBE_HOME=$(mktemp -d)
   cp .vibe/config.toml "$VIBE_HOME/config.toml"
   cat >> "$VIBE_HOME/config.toml" <<EOF

   [[mcp_servers]]
   name = "github"
   transport = "stdio"
   command = "node"
   args = ["<absolute path to the MCP server script>"]
   EOF
   node .vibe/plugins/repo-guards/render-home-hooks.cjs "$VIBE_HOME"
   ```

4. Start Vibe in the scratch project and type the scenario's first turn exactly:

   ```bash
   cd "$SCRATCH/project"
   vibe --output-dir "$VIBE_HOME/output" --auto-approve
   ```

   ```text
   Use the github MCP server to read this project's README and summarize it in one line.
   ```

5. Read the result from the journal, never from the reply:

   ```bash
   grep -rqs 'Code Mode can route this family via the "github" manual' "$VIBE_HOME/logs/session/unified" \
     && grep -rqs '"hookName":"mcp-route-guard"' "$VIBE_HOME/logs/session/unified" \
     && echo mcp-route-refused
   grep -rqs '"content":"Denied tool' "$VIBE_HOME/logs/session/unified" && echo deny-notice-recorded
   ```

   Both lines must print. The second turn's check is the same deny-notice grep the scenario carries.

6. Repeat the prompt with `MCP_ROUTE_GUARD_DISABLED=1` in the environment when you want the negative
   control: the native call is then allowed and no `mcp-route-guard` record appears.

---

## 4. WHAT WOULD MAKE THIS A RUNNER SCENARIO

One of two changes, both outside this phase's scope:

- A scenario key that seeds files into the launch home before the subject starts, so a scenario can
  ship the `[[mcp_servers]]` row.
- A `vibe` launch flag that trusts the scratch project, which would also make the project's own
  `.vibe/config.toml` the subject's config source.
