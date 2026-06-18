READ-ONLY deep-context verification seat. Read/Grep only. Return ONLY findings JSON after BINDING lines. Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all ACTIVE references. THIS iteration = GAP RECOVERY — find every ACTIVE cli-devin / devin / DEVIN_ site NOT yet mapped in iters 1-8, with special attention to non-doc surfaces (configs, env, hooks, CI) and a skill-advisor completeness re-sweep (operator explicitly asked to remove cli-devin from the skill advisor).

## shared current_focus — iteration 9 of 10 — GAP RECOVERY + skill-advisor completeness
1. CONFIG / RUNTIME surfaces (highest risk — easy to miss): `opencode.json`, `.utcp_config.json`, `.gitignore`, any `*.json` config at repo root or `.opencode/` naming devin; hook scripts under `.opencode/` (UserPromptSubmit / SessionStart / Stop hooks) that branch on devin; doctor configs / MCP config lists; package.json scripts.
2. ENV / BINARY tokens: grep the WHOLE repo (excluding cli-devin/, **/changelog/**, **/specs/**, **/benchmarks/**/state/**) for `DEVIN_`, `DEVIN_BIN`, `DEVIN_SESSION_ID`, `SPECKIT_DEVIN_STATE_DIR`, `DEVIN_HOME`, `cognition`, ` devin ` (binary) — find any handler not already mapped.
3. SKILL-ADVISOR COMPLETENESS (operator request): re-sweep `.opencode/skills/system-skill-advisor/` for ANY cli-devin/devin reference beyond iter5 (advisor model tables, dispatch matrices, mcp_server scripts, hooks, tests, config JSON, deferred-decisions docs). Confirm the full advisor removal set.
4. The system-spec-kit feature_catalog count self-check: grep `.opencode/skills/system-spec-kit/feature_catalog/manual_testing_playbook.md` and `.opencode/skills/*/feature_catalog/` + `manual_testing_playbook.md` files for a hard-coded `-ne [0-9]+` file-count self-check or playbook entry naming cli-devin (memory: feature-catalog-playbook-count-governance).
5. VERIFY the deep-context/SKILL.md cli-devin discrepancy (iter1 said Pairs-with line ~391; iter8 said clean) — read the relevant section and resolve.

## known-context
Iters 1-8 mapped: skill dir; runtime code (executor-config/audit/fanout-run/dispatch-model/profile-validator); 5 deep-loop YAMLs + 6 command docs; sk-prompt-small-model cluster; skill-graph+advisor+2 CI scripts; agents 3 runtimes; governance; cross-skill docs + constitutional; context-budget sentinel; deep-review constitutional rule. swe-1.6 = cli-devin-exclusive. This iteration finds what's LEFT, especially config/env/hook/CI surfaces.

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path":"...", "symbol":"...", "kind":"integration_point|dependency|gap", "reuse":"remove|leave",
    "evidence":"path:line(s)", "relevance":0.0, "classification":"active-wiring|historical-record", "verified":true,
    "editType":"inline-edit|delete-branch|leave|NEW-not-previously-mapped", "notes":"exact edit; mark NEW if not in iters1-8" } ] }
```
BINDING lines first (slice=gap-recovery). Tool budget ~10-12.
