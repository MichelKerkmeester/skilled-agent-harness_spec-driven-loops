---
description: Install or repair MCP servers via /doctor:mcp <install|debug> sub-action routing.
argument-hint: "<install|debug> [--server <name>] [--runtime <name>] [--fix]"
allowed-tools: Read, Bash, Grep, Glob, Edit, Write
---
<!-- skill_agent: system-spec-kit -->

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command is a small router for MCP infrastructure repair. It resolves a positional sub-action (`install` or `debug`) from `$ARGUMENTS` and hands off to the matching YAML workflow asset.
>
> **MODE POLICY:** Standalone MCP infra command. The sub-action is positional. No mode suffix is supported.
>
> **YOUR FIRST ACTION:**
> 1. Parse the FIRST positional argument from `$ARGUMENTS` as `sub_action`. If missing → run the sub-action menu and wait. If unknown → reject with "valid: install, debug".
> 2. Bind `yaml_asset`:
>    - `install` → `doctor_mcp_install.yaml`
>    - `debug`   → `doctor_mcp_debug.yaml`
> 3. Parse the REMAINING `$ARGUMENTS` (everything after the sub-action) per the sub-action's flag schema.
> 4. Load `assets/<yaml_asset>` and execute its phased workflow.
>
> All reference content below is context for the sub-action YAML.

## CONSTRAINTS

- **SUB-ACTION FIRST PARSING**: parse the positional sub-action BEFORE any `--flag`. The two sub-actions have overlapping flag namespaces (`--server`), but `--fix` only exists for `debug`.
- **DO NOT** dispatch any agent from this document.
- **ALL** workflow execution happens through the chosen YAML asset.
- **STANDALONE COMMAND**: this is not part of `/doctor`'s subsystem-diagnostic family. It handles MCP infrastructure repair, which is upstream of every subsystem's database.

> **Format:** `/doctor:mcp <install|debug> [flags]`
> Examples: `/doctor:mcp install --server mk-spec-memory`, `/doctor:mcp debug --fix`

## GATE 3 STATUS

| Aspect      | Value                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Location    | MCP server install dirs + runtime config files (`.opencode.json`, `.claude/settings.json`, `.codex/config.toml`, `.gemini/settings.json`)   |
| Reason      | MCP infrastructure repair; not authored spec packet docs                                                                                    |
| Alternative | Per-server install guides + `mcp-doctor.sh` health probes; rollback by deleting the offending dir and reinstalling from canonical guide     |

---

## 0. SUB-ACTION RESOLUTION

**FIRST MESSAGE PROTOCOL:** this prompt MUST be your FIRST response when `$ARGUMENTS` lacks a positional sub-action.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. PARSE $ARGUMENTS:
   - Extract the FIRST positional token (everything before the first --flag).
   - If empty / whitespace → unresolved; go to step 2.
   - Otherwise → bind `sub_action` to the token.

2. IF sub_action IS UNRESOLVED:
   - ASK (print VERBATIM):

     ```
     What do you want to do with MCP servers?
        1) Install fresh    (all 5 MCP servers from install guides)
        2) Debug + repair   (diagnose failures, apply guided fixes)
        X) Cancel
     ```

   - WAIT. Map 1/I/install → install; 2/D/debug → debug; X/empty/cancel → STATUS=CANCEL.

3. VALIDATE sub_action:
   - If sub_action NOT in {install, debug}:
     EMIT "Unknown sub-action '<sub_action>'. Valid: install, debug. Try `/doctor:mcp install` or `/doctor:mcp debug`."
     EXIT with STATUS=FAIL ERROR=unknown_sub_action.

4. BIND yaml_asset:
   case "$sub_action" in
     install) yaml_asset = "doctor_mcp_install.yaml" ;;
     debug)   yaml_asset = "doctor_mcp_debug.yaml"   ;;
   esac

5. PARSE remaining $ARGUMENTS using the sub-action's flag schema:

   case "$sub_action" in
     install)
       # allowed: --server <name>, --runtime <name>
       --server <name>   → server_filter = <name>   (default: all 5 servers)
       --runtime <name>  → runtime_filter = <name>  (default: detected runtime)
       ;;
     debug)
       # allowed: --fix, --server <name>
       --fix             → fix = true               (default: false; debug-only by default)
       --server <name>   → server_filter = <name>   (default: all 5 servers)
       ;;
   esac

6. CROSS-SUB-ACTION FLAG INJECTION CHECK:
   - If `--fix` is passed but sub_action == "install":
     EMIT "Flag '--fix' is only valid for `debug`. Did you mean `/doctor:mcp debug --fix`?"
     EXIT with STATUS=FAIL ERROR=cross_sub_action_flag_injection.
   - If `--runtime` is passed but sub_action == "debug":
     EMIT "Flag '--runtime' is only valid for `install`. Did you mean `/doctor:mcp install --runtime <name>`?"
     EXIT with STATUS=FAIL ERROR=cross_sub_action_flag_injection.

7. STORE: sub_action, yaml_asset, (server_filter | runtime_filter | fix as resolved).

8. HAND OFF to .opencode/commands/doctor/assets/<yaml_asset>.
```

**Phase Output:** `sub_action` | `yaml_asset` | resolved flags

---

## 1. PURPOSE

`/doctor:mcp` bundles two MCP infrastructure operations:

- **`debug`** — Diagnose and repair broken MCP servers. Runs `mcp-doctor.sh --json`, cross-references each failure with its install guide, offers targeted repair (`--fix`), re-verifies, and reports a final status.

These are the only two operations on MCP infrastructure itself. Every other `/doctor*` workflow runs INSIDE the working MCP layer; if MCP is broken, run `/doctor:mcp debug --fix` first.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — `<install|debug>` (positional) plus sub-action-specific flags.

**Outputs:**
- `STATUS=OK` — install or debug completed (final state in mcp-doctor.sh report)
- `STATUS=CANCEL` — user picked X
- `STATUS=FAIL ERROR="unknown_sub_action"` — sub-action not in {install, debug}
- `STATUS=FAIL ERROR="cross_sub_action_flag_injection"` — flag from wrong sub-action

**YAML assets:**
- `install` → `.opencode/commands/doctor/assets/doctor_mcp_install.yaml`
- `debug` → `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml`

**Helper scripts** (called by YAML):
- `.opencode/commands/doctor/scripts/mcp-doctor.sh` — JSON diagnostic
- `.opencode/commands/doctor/scripts/mcp-doctor-lib.sh` — shared lib

---

## 3. EXAMPLES

```
# Install (fresh / reinstall)
/doctor:mcp install                                  # Install all 5 MCP servers from scratch
/doctor:mcp install --server mk-spec-memory         # Install just mk-spec-memory
/doctor:mcp install --server mk_code_index           # Install just System Code Graph
/doctor:mcp install --server mk_skill_advisor        # Install just Skill Advisor
/doctor:mcp install --runtime claude                 # Install for a specific runtime

# Debug (diagnose + optional repair)
/doctor:mcp debug                                    # Run diagnostics, report findings, propose repairs
/doctor:mcp debug --fix                              # Run diagnostics + apply guided repairs
/doctor:mcp debug --server mk_code_index --fix       # Repair just System Code Graph
/doctor:mcp debug --server mk_skill_advisor --fix    # Repair just Skill Advisor

# Interactive menu (no sub-action)
/doctor:mcp                                          # Asks: install or debug?
```

---

## 4. TROUBLESHOOTING / NEXT STEPS

| Situation                                                                                  | Suggested action                                                                                |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| MCP server install just finished; verify connectivity                                      | The `install` YAML runs `mcp-doctor.sh --json` post-install automatically                       |
| `STATUS=FAIL` from `install` — prerequisites missing                                       | Install Node ≥ 20.11.0, Python ≥ 3.11, npm, npx; rerun `/doctor:mcp install`                   |
| `STATUS=FAIL` from `debug --fix` — repair didn't take                                      | Read the per-server install guide cited in the report; manual install often clears edge cases   |
| All MCP servers report OK but `/doctor <subsystem>` still fails                            | Issue is in subsystem databases, not MCP infra. Use `/doctor <subsystem>` (e.g. `/doctor memory`) |
| You want a full spec-kit rebuild (MCP infra + subsystem databases + advisor)               | Run `/doctor:mcp debug --fix` first; once MCP is OK, run `/doctor:update`                       |
