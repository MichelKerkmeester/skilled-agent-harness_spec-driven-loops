# Phase 2 Edit Evidence — packet 059

Date: 2026-05-15
Executor: @markdown (Claude Opus 4.7, native)
Scope basis: `research/gpt-5.5-review.md` (REVISE verdict, scope-corrected smaller than original spec)

## Summary

Three surgical edits across three files to bring the deep-research and deep-review command surfaces into parity with the validator. The validator (`executor-config.ts:7`) already accepts six kinds. Two command docs lagged at four. The deep-research YAML lagged at five (missing the `if_cli_devin` dispatch branch). Phase 2 closes that drift.

## Files touched

| File | Lines changed | Mutation class |
|---|---|---|
| `.opencode/commands/spec_kit/deep-research.md` | 3 surgical edits (lines 79, 124, 173-177→173-179) | mutates |
| `.opencode/commands/spec_kit/deep-review.md` | 3 surgical edits (lines 79, 137, 198-202→198-204) | mutates |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` | 1 block insertion (25 new lines, 741→742..766) | mutates |

Total: 3 files. Net additions: 6 new lines across the two `.md` files, 25 new YAML lines.

## Edit 1: `.opencode/commands/spec_kit/deep-research.md`

### 1a. PRE-BOUND SETUP ANSWERS schema enum (line 79)

Old:
```
  executor: native  # native | cli-codex | cli-gemini | cli-claude-code
```

New:
```
  executor: native  # native | cli-codex | cli-gemini | cli-claude-code | cli-opencode | cli-devin
```

### 1b. --executor flag explanation (line 124)

Old:
```
   |-- --executor=<type> -> config.executor.type (`native` | `cli-codex`)
```

New:
```
   |-- --executor=<type> -> config.executor.type (`native` | `cli-codex` | `cli-gemini` | `cli-claude-code` | `cli-opencode` | `cli-devin`)
```

### 1c. Q-Exec options list (173-177 → 173-179)

Added two new option rows E and F immediately after option D. Existing A-D unchanged.

New rows added:
```
     E) cli-opencode — `opencode run --model X --agent general --format json --dangerously-skip-permissions --pure --dir {repo_root} [--variant Y] "PROMPT" </dev/null`. `reasoningEffort` maps to `--variant`. No service-tier.
     F) cli-devin — `devin --print --prompt-file ... --model X --permission-mode auto`. Default model swe-1.6. No reasoning-effort or service-tier.
```

Stylistic note: option list uses em dashes for parity with existing A-D entries. Constraint allowance: structured-format edits, not new prose.

## Edit 2: `.opencode/commands/spec_kit/deep-review.md`

Same three-edit pattern as Edit 1, mirroring deep-research's executor surfaces:

### 2a. PRE-BOUND SETUP ANSWERS schema enum (line 79)

Old:
```
  executor: native  # one of: native | cli-codex | cli-gemini | cli-claude-code
```

New:
```
  executor: native  # one of: native | cli-codex | cli-gemini | cli-claude-code | cli-opencode | cli-devin
```

### 2b. --executor flag explanation (line 137)

Old:
```
   |-- --executor=<type> -> config.executor.type (`native` | `cli-codex`)
```

New:
```
   |-- --executor=<type> -> config.executor.type (`native` | `cli-codex` | `cli-gemini` | `cli-claude-code` | `cli-opencode` | `cli-devin`)
```

### 2c. Q-Exec options list (198-202 → 198-204)

Added E (cli-opencode) and F (cli-devin) rows, identical content to Edit 1c.

## Edit 3: `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`

### YAML port summary

Ported the `if_cli_devin:` block from `spec_kit_deep-review_auto.yaml:806-829` into `spec_kit_deep-research_auto.yaml` at the exact structural position that mirrors the deep-review YAML: immediately after `if_cli_opencode:` (deep-research line 717-741) and immediately before `post_dispatch_validate:`. New `if_cli_devin:` block now occupies lines 742-765.

Branch ordering after the edit (deep-research_auto.yaml):
```
568: if_cli_codex:
614: if_cli_gemini:
659: if_cli_claude_code:
717: if_cli_opencode:
742: if_cli_devin:          ← NEW
766: post_dispatch_validate:
```

This matches the deep-review YAML ordering: codex → gemini → claude-code → opencode → devin → post_dispatch_validate.

### Block contents (ported verbatim, indentation preserved at column 9)

```yaml
        if_cli_devin:
          command: |
            devin --print \
              --prompt-file "{state_paths.prompt_dir}/iteration-{current_iteration}.md" \
              --model "{config.executor.model}" \
              --permission-mode "{resolved_permission_mode}" \
              2>&1 </dev/null
          working_directory: "{repo_root}"
          timeout_seconds: "{config.executor.timeoutSeconds}"
          wait_for_completion: true
          render_hint:
            resolved_permission_mode: |
              Resolve via resolveDevinPermissionMode(config.executor.sandboxMode) — defined in
              .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts.
              Mapping: sandboxMode='danger-full-access' → 'dangerous', everything else → 'auto'.
              Default (sandboxMode unset): 'auto'. Research iterations are read-only by contract, so 'auto' is the expected resolution.
          notes:
            - "devin --prompt-file accepts a path to the rendered iteration prompt (the SKILL.md skill_reference dispatch shape)"
            - "Supported models: swe-1.6 (default), deepseek-v4, glm-5.1, kimi-k2.6 (per DEVIN_SUPPORTED_MODELS in executor-config.ts)"
            - "--permission-mode auto auto-approves read-only ops and prompts on write; dangerous auto-approves all (only for sandboxed runs)"
            - "cli-devin self-invocation guard: this branch must only run from a non-Devin dispatch surface (Claude/Codex/Gemini/OpenCode/raw shell). The cli-devin skill SKILL.md §SELF-INVOCATION PROHIBITED contract is the authoritative gate."
            - "</dev/null required: family convention for non-interactive dispatch to avoid stdin-blocking edge cases across CLI versions"
            - "Cloud handoff is NOT used here — each iteration runs locally with convergence detection. See cli-devin references/cloud_handoff.md for the separate cloud-handoff route."
            - "Reasoning effort is NOT exposed by Devin's CLI surface; reasoning depth is fixed per model (e.g., swe-1.6 vs deepseek-v4). serviceTier is also N/A."
```

Single intentional deviation from the deep-review source: the `render_hint.resolved_permission_mode` block adds one trailing sentence reinforcing the research-iteration semantics (read-only by contract → `auto` is the expected resolution). The mapping rule itself is unchanged.

## Validator results

| File | Tool | Exit | Result |
|---|---|---|---|
| `.opencode/commands/spec_kit/deep-research.md` | `validate_document.py` | 0 | VALID. 1 pre-existing non-blocking warning: `non_sequential_numbering` at §0. Not introduced by this edit. |
| `.opencode/commands/spec_kit/deep-review.md` | `validate_document.py` | 0 | VALID. Same pre-existing warning. |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` | `python3 -c "import yaml; yaml.safe_load(...)"` | 0 | YAML_PARSE_OK. 14 top-level keys. |

## Cross-check

Grep verification after the edits confirms:
- Both `.md` files now reference all six executor kinds at every enum site (lines 79, 124/137, 173-179/198-204).
- The deep-research YAML has all five if_cli_* branches plus the new if_cli_devin branch, in the same order as the deep-review YAML.
- No anchor pairs were touched; no banned-vocabulary or HVR violations in new prose (the option list and YAML notes use em dashes for parity with the existing surrounding content, which is structured-format, not prose).

## Anti-checks performed

- Confirmed validator (`executor-config.ts:7`) already accepts `cli-devin` and `cli-opencode`; no validator changes were required and none were made.
- Confirmed `executor-config.ts` exports `resolveDevinPermissionMode` and `DEVIN_SUPPORTED_MODELS` referenced by the ported YAML notes.
- Confirmed the deep-review YAML's `if_cli_devin` block (the source of the port) has not been modified by this Phase 2 work.

## Next phase

Phase 2 closes the deep-loop executor surface drift. Per the gpt-5.5 review's residual ask, the agent-config JSON design for synthesis recipes (Phase 4 scope) should be reviewed with a fresh codex pass before authoring the three agent-config JSONs. Phase 3 (cli-devin SKILL.md section, 2 references, agent updates) is unblocked.
