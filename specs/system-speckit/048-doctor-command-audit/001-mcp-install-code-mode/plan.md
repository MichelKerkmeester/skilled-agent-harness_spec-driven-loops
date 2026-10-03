---
title: "Implementation Plan: Phase 1: mcp-install-code-mode"
description: "Audit `/doctor:mcp install` against this checkout, then apply the evidence-backed verdict: keep the route and narrow it to MCP Code Mode and `.utcp_config.json`."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: mcp-install-code-mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command assets, YAML workflows, Bash doctor scripts |
| **Framework** | The OpenCode `/doctor:mcp` route over `.skilled/commands/doctor/` |
| **Storage** | Files only — runtime MCP configs and `.utcp_config.json`; no database |
| **Testing** | `bash -n`, `mcp-doctor.sh --json`, `python3 yaml.safe_load`, `validate_document.py`, `route-validate.sh`, the command catalog mirror check |

### Overview

Audit first, then apply. The read-only health run and a line-numbered source inventory establish what `/doctor:mcp install` actually names on this checkout; the verdict that evidence supports is `fix`, and the fix narrows the install workflow, its router text and its presentation to MCP Code Mode and its `.utcp_config.json` setup.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Other: audit → verdict → apply, over the command's own asset set. The doctor has no runtime of its own, so the change is confined to the text (two workflow YAMLs, a presentation, the router) and the read-only health scripts it invokes.

### Key Components

- **`mcp.md`**: the `/doctor:mcp` route; holds the install/debug split, the argument schema and the operator-facing menu.
- **`doctor-mcp-install.yaml`**: the install workflow; the asset the verdict rewrites to Code Mode only.
- **`mcp-doctor.sh` and `mcp-doctor-lib.sh`**: the read-only health checks the install workflow ends with; also the evidence source for the audit.
- **`doctor-mcp-presentation.txt`**: the install, debug and report text the workflow renders.

### Data Flow

The route dispatches install to the install YAML; the YAML ends with the health script and reports its JSON summary. The audit ran that health script directly, read the route, YAML and presentation with line-numbered reads, and recorded both in `scratch/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/scripts/mcp-doctor.sh` (producer) | Owns the health checks and the JSON summary the install workflow ends with | update — seven-config wiring, dist staleness by mtime plus `node --check`, UTCP manual name/type check, credential presence by name, Hermes INFO row, stale self-paths | `bash -n` → `SYNTAX_OK`; `mcp-doctor.sh --json` → exit 2, pass 11 / warn 2 / fail 3 |
| `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh` (producer) | Supplies the format-aware readers for the checks above | update — readers for the seven config formats and the credential-name scan | same run; the seven config rows report "Code Mode launcher and UTCP path verified" except Codex, which warns when `tomllib` is unavailable |
| `.skilled/commands/doctor/assets/doctor-mcp-install.yaml` (consumer) | Defines the install sequence, server scope, runtime targets and final verification | update — rewritten to Code Mode and `.utcp_config.json` only; `cli_skill_diagnostics` deleted; seven config targets plus a user-level Hermes row; `.vscode/mcp.json` removed | `python3 yaml.safe_load` → `YAML_OK`; removed-name scan → no output, exit 1 |
| `.skilled/commands/doctor/assets/doctor-mcp-debug.yaml` (consumer) | Defines the debug sequence and repair scope | update — rewritten to Code Mode only; the "all 5" wording and the System Code Graph row removed | `python3 yaml.safe_load` → `YAML_OK`; removed-name scan → no output, exit 1 |
| `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt` (consumer) | Renders the install, debug and report text | update — Code Mode-only rows; Skill Advisor and System Code Graph rows and the invalid `--server system_skill_advisor` example removed | removed-name scan → no output, exit 1 |
| `.skilled/commands/doctor/mcp.md` (consumer) | Route text, argument hint and menu | update — description, argument hint `<install [--runtime <name>]|debug [--fix]>`, `--server` removed | `validate_document.py mcp.md --type command` → `VALID`, 0 issues |
| `.skilled/commands/README.txt` and `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` (consumers) | Catalog rows and the command contract | update — two `/doctor:mcp` rows; `doctor mcp` argument hint and operation text | catalog mirror check → `STATUS=OK`, exit 0; `route-validate.sh` → exit 0 |

Required inventories:
- Same-class producers: `scratch/reality-check.md` inventories every path, command, flag and environment variable the route and install YAML name. After the rewrite, `grep -niE 'figma|chrome|click.?up|skill.?advisor|code.?graph|\.venv|vscode'` over both YAMLs returns no rows, exit 1.
- Consumers of changed symbols: `mcp.md`, `doctor-mcp-presentation.txt`, `.skilled/commands/README.txt` and `command-contract.json`. `route-validate.sh` (10 routes, exit 0) and the catalog mirror check (`STATUS=OK`) confirm the router, catalog and contract consumers agree.
- Matrix axes: server scope (Code Mode / the other servers named before) × runtime target (the seven project configs, user-level Hermes, the absent VS Code config) × check status (pass / warn / fail). The post-fix health run covers every axis row: seven config passes, one Codex warn, one Hermes info, three Code Mode fails.
- Algorithm invariant: a Code Mode input that is absent is reported as a failure, never as a pass. The health run's fail rows (`package_json`, `dist_exists`, `node_modules`) are the adversarial evidence, and the Codex row warns rather than passes when no TOML parser is available.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Both doctor scripts | `bash -n` → `SYNTAX_OK` |
| Asset parse | Both doctor YAMLs; the router document | `python3 -c 'import yaml; yaml.safe_load(...)'` → `YAML_OK`; `validate_document.py mcp.md --type command` → `VALID` |
| Integration | One read-only health run against this checkout | `mcp-doctor.sh --json` → exit 2, pass 11 / warn 2 / fail 3 |
| Route and catalog | Router manifest, router table, presentations, command catalog and contract | `route-validate.sh` → exit 0; catalog mirror check → `STATUS=OK` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A provisioned worktree | Internal | Green | The doctor scripts cannot run |
| `.skilled/commands/doctor/_routes.yaml` and its validator | Internal | Green | The route change cannot be validated |
| Node and npm | External | Green — v26.8.2 / 11.19.1 | The doctor's prerequisite checks fail |
| Embedded Code Mode build inputs (`package.json`, `dist/index.js`, `node_modules`) | Internal | Red — all three absent in this worktree | The health run cannot pass; recorded as findings, not fixed here |
| Python 3.11 `tomllib` for TOML validation | External | Yellow — Python 3.9.6 present | The Codex config row reports `unvalidated` instead of a false pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The narrowed install workflow or script wiring proves wrong for the operator's runtime set.
- **Procedure**: Restore the changed files under `.skilled/commands/doctor/` (both YAMLs, the presentation, `mcp.md`, both scripts), `.skilled/commands/README.txt` and `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`. No runtime state was written, so no data reversal is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──► Phase 2 (Apply) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory and verdict | None | Apply |
| Apply the verdict | Inventory | Verify |
| Verify | Apply | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory and verdict | Low | Source reads plus one read-only run |
| Apply the verdict | Med | Rewrite two YAMLs, the presentation, the router and the script wiring |
| Verification | Low | Rerun the health check and the route, catalog and document gates |
| **Total** | | **One focused session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A; every changed file is tracked in git
- [x] Feature flag configured — N/A
- [x] Monitoring alerts set — N/A

### Rollback Procedure
1. `git restore` the changed asset and script files listed in the rollback plan.
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and confirm exit 0.
3. Rerun `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` and compare against the recorded pre-fix baseline (pass 8 / warn 0 / fail 3).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

