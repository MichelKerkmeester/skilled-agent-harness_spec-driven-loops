---
title: "Implementation Plan: Phase 2: mcp-debug-code-mode"
description: "Audits the /doctor:mcp debug target and applies a fix verdict: the debug workflow now covers only MCP Code Mode and .utcp_config.json, backed by shared doctor checks for build state, seven runtime registrations, UTCP manuals and credential presence."
trigger_phrases:
  - "mcp debug code mode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: mcp-debug-code-mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (diagnostic script and library), YAML workflow assets, Markdown router |
| **Framework** | Doctor command layout: router + workflow YAML + presentation contract |
| **Storage** | `.utcp_config.json` and seven runtime registration files |
| **Testing** | `bash -n`, read-only doctor run with `--json`, YAML parse, route validation, document and catalog checks |

### Overview
Audit first, then apply. The phase inventoried every path, command, flag and environment variable the debug target named, ran the read-only health command once, and set the verdict to fix. The fix rewrote the debug workflow for Code Mode only and extended the shared doctor script and library so each check it describes — build state, seven runtime registrations, UTCP manuals and credential presence — is a real check with observed output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2-3; inventory in `scratch/reality-check.md`)
- [x] Success criteria measurable (`acceptance-criteria.md`, AC-001 to AC-005)
- [x] Dependencies identified (provisioned worktree; `_routes.yaml` and its validator)

### Definition of Done
- [x] All acceptance criteria met (`acceptance-criteria.md`, 5 of 5 Met)
- [x] Tests passing (if applicable) (`bash -n`, post-fix doctor run, YAML parse, route validation)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-then-apply: a thin Markdown router binds a workflow YAML that drives one Bash diagnostic script.

### Key Components
- **`mcp.md`**: router that parses `debug [--fix]` and binds the matching workflow asset.
- **`doctor-mcp-debug.yaml`**: the five-step debug workflow — diagnose, present, investigate and repair with approval, verify, summarize.
- **`mcp-doctor.sh`**: read-only Code Mode diagnostics over build state, `.utcp_config.json` and seven runtime registrations.
- **`mcp-doctor-lib.sh`**: format-aware config parsing and UTCP manual and credential inspection shared by both sub-actions.
- **`doctor-mcp-presentation.txt`**: user-visible wording and layout for debug findings and reports.

### Data Flow
`/doctor:mcp debug` parses the sub-action, loads `doctor-mcp-debug.yaml`, and runs `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` once. The workflow reads `status`, `exitCode`, `summary` and `checks[]`, presents findings, and when `--fix` is set offers one repair at a time. After each approved repair it reruns the same read-only command and compares every check. The router's `--fix` is never passed to the script.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/scripts/mcp-doctor.sh` | Produces the health JSON the debug workflow renders | update | post-fix run: pass 11, warn 2, fail 3; seven `config` rows present |
| `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh` | Parses runtime registrations and the UTCP config for both sub-actions | update | post-fix `utcp_manuals` PASS: 14 manuals have a valid name and call_template_type |
| `.skilled/commands/doctor/assets/doctor-mcp-debug.yaml` | Debug workflow contract | update | `grep -niE 'figma|chrome|click.?up|skill.?advisor|code.?graph|\.venv|vscode'` clean; `python3 yaml.safe_load` YAML_OK |
| `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt` | Debug wording and layout | update | debug rows narrowed to Code Mode; grep clean |
| `.skilled/commands/doctor/mcp.md` | Routes `debug [--fix]` | update | `validate_document.py mcp.md --type command` VALID, 0 issues |
| `.skilled/commands/README.txt`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Catalog and contract consumers | update | `command-catalog-mirror-check.cjs` STATUS=OK, exit 0 |
| Code Mode skill (the inspected subsystem) | The doctor's subject | unchanged | two proposed skill changes were rejected; the four findings are recorded in `implementation-summary.md` |

Required inventories:
- Same-class producers: the two workflow assets (`doctor-mcp-install.yaml`, `doctor-mcp-debug.yaml`) call the same `mcp-doctor.sh`; the sibling install phase owns the install asset, this phase owns debug.
- Consumers of changed symbols: `mcp.md`, `doctor-mcp-presentation.txt`, `.skilled/commands/README.txt` and `command-contract.json`; checked with the catalog mirror check and `route-validate.sh`.
- Matrix axes: seven runtime registration files and two formats (JSON, TOML); UTCP manual name and call_template_type; credential key presence; dist states (missing, present, stale).
- Algorithm invariant: a registration is PASS only when the parsed file names the launcher and `UTCP_CONFIG_FILE=.utcp_config.json`; credential presence is looked up under `manual name + "_" + reference` and only names are emitted.
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
| Unit | Not applicable: the checks are shell and inline Node parsers inside the doctor | `bash -n` on both scripts |
| Integration | Read-only doctor run against this worktree, before and after the fix | `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` |
| Manual | Router wording, catalog rows and route registration reviewed against the workflow | `validate_document.py`, catalog mirror check, `route-validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Provisioned worktree | Internal | Green | The path and build checks need a checkout; missing build outputs are expected and reported by name |
| `_routes.yaml` and its validator | Internal | Green | The route stays valid; `route-validate.sh` exits 0 with 2 warnings |
| Python 3.11+ `tomllib` | External | Yellow | Unavailable on this machine's Python 3.9, so Codex registration stays WARN "unvalidated" |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the rewritten debug workflow or the shared checks misreport Code Mode health, or `route-validate.sh` stops exiting 0.
- **Procedure**: `git checkout --` the changed doctor assets, scripts, router and catalog files, or revert the commit that carries this phase; nothing is committed yet.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours: inventory and one read-only run |
| Core Implementation | Med | 3-4 hours: debug YAML rewrite plus shared script and library changes |
| Verification | Low | 1-2 hours: syntax, run comparison, grep and route checks |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — no data changes; every edit is uncommitted in this worktree
- [x] Feature flag configured — not applicable; `/doctor:mcp` is invoked directly
- [x] Monitoring alerts set — not applicable; failures surface in the doctor's own JSON rows

### Rollback Procedure
1. Stop invoking the changed workflow; read the previous assets from `git show 83616db9ba:` if a comparison is needed.
2. `git checkout --` the changed doctor assets, scripts, router and catalog files, or revert the phase commit.
3. Run `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` and `bash .skilled/commands/doctor/scripts/route-validate.sh` to confirm the restored state.
4. Tell the operator which checks changed so the audit verdict can be revisited.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — the phase ships no data migration. `--fix` repairs are build and config changes applied one at a time after approval.
<!-- /ANCHOR:enhanced-rollback -->

---

