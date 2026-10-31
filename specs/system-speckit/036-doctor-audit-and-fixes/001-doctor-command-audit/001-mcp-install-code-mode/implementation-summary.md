---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "mcp install code mode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/001-mcp-install-code-mode"
    last_updated_at: "2026-10-02T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Narrowed /doctor:mcp install and debug to Code Mode and .utcp_config.json"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/doctor-mcp-install.yaml"
      - ".skilled/commands/doctor/assets/doctor-mcp-debug.yaml"
      - ".skilled/commands/doctor/mcp.md"
      - ".skilled/commands/doctor/scripts/mcp-doctor.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-mcp-install-code-mode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-mcp-install-code-mode |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Verdict: fix.** `/doctor:mcp` is kept and narrowed to MCP Code Mode and its `.utcp_config.json`: the install and debug assets no longer set up any other MCP server, and the health script now checks the system that actually exists.

### Phase 1: mcp-install-code-mode

Before the fix, the install YAML carried a `cli_skill_diagnostics` block for `mcp-figma`, `mcp-chrome-devtools` and `mcp-click-up`; the presentation named Skill Advisor and System Code Graph rows and an invalid `--server system_skill_advisor` example; the debug YAML said "all 5" servers. The read-only health run exited 2 on 8 passes and 3 failures: an unreadable Node engine manifest, a missing `mcp-server/dist/index.js` and a missing `node_modules`. That run checked only `opencode.json`, `.claude/mcp.json` and the absent `.vscode/mcp.json`, while seven project runtime configs register Code Mode: `opencode.json`, `.mcp.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json` and `.devin/mcp_config.json`; Hermes is user-level in `~/.hermes/config.yaml`.

After the fix, the health run exits 2 only because this worktree has no `package.json`, `dist/index.js` or `node_modules` — three real absences, each reported by name. Its other rows cover the seven config wirings, check 14 UTCP manuals for a valid name and call-template type, list nine missing credential names without values, and report the Hermes registration as user-level INFO. `--server` is gone from both sub-actions because Code Mode is the only server.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-mcp-install.yaml` | Modified (rewritten) | Code Mode only; `cli_skill_diagnostics` removed; seven project config targets plus a user-level Hermes row; `.vscode/mcp.json` removed |
| `.skilled/commands/doctor/assets/doctor-mcp-debug.yaml` | Modified (rewritten) | Code Mode only; the "all 5" wording and the System Code Graph row removed |
| `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt` | Modified | Code Mode-only display text; Skill Advisor and System Code Graph rows and the invalid `--server` example removed |
| `.skilled/commands/doctor/mcp.md` | Modified | Description narrowed to Code Mode; argument hint `<install [--runtime <name>]|debug [--fix]>`; `--server` removed |
| `.skilled/commands/doctor/scripts/mcp-doctor.sh` | Modified | Seven-config wiring check with launcher and `UTCP_CONFIG_FILE` values; dist staleness by mtime plus `node --check`; UTCP manual name/type check; credential presence by name; Hermes INFO row; stale self-paths fixed |
| `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh` | Modified | Format-aware readers and the credential-name scan used by the checks above |
| `.skilled/commands/README.txt` | Modified | Two `/doctor:mcp` catalog rows |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | `doctor mcp` argument hint and operation text |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Audited first: read the router, the install YAML and the presentation in full with line-numbered
reads, probed every named path, and kept one read-only health run in `scratch/doctor-run.log`.
Wrote the verdict and target behavior in `scratch/proposal.md`, then applied it in one pass across
the two workflow YAMLs, the presentation, the router, the two doctor scripts and the two
catalog/contract consumers. The edit run was executed by GPT-6 Luna through `cli-codex` (max,
fast); it finished all edits and then hit the ChatGPT usage limit, so the orchestrator ran the
post-change verification itself: `bash -n`, the JSON health run, YAML parsing, the removed-name
scan, the router document check, the catalog mirror check and `route-validate.sh`. No runtime
state was written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `/doctor:mcp` and narrow it instead of retiring it | The route is the operator's health entry point; the defect was scope, not the command itself |
| Rewrite both workflow YAMLs to Code Mode only | Seven project configs register Code Mode and it is the only server this repository routes through |
| Remove `--server` from both sub-actions | Code Mode is the only server, so a server selector has nothing to select |
| Use an mtime comparison for build currentness instead of a build-state file | The orchestrator rejected the debug proposal's build-fingerprint file and `validate_config.py` change because both modify the inspected Code Mode subsystem; the doctor compares `dist` mtime against its build inputs instead |
| Report credentials by name and presence only | No secret value is printed to the run log or the report, and the doctor never asks for or writes one |
| Record subsystem defects as findings, not fixes | The phase changes the doctor; defects in the subsystem it inspects are reported for a later decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on `mcp-doctor.sh` and `mcp-doctor-lib.sh` | `SYNTAX_OK` for both |
| `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` | Exit 2 — summary pass 11 / warn 2 / fail 3. FAIL rows: `package_json`, `dist_exists`, `node_modules` (expected in this worktree). PASS includes all seven config wiring checks except Codex, which WARNs "unvalidated: Python tomllib unavailable" (Python 3.9). `utcp_manuals` PASS "14 manuals have a valid name and call_template_type"; `utcp_credentials` WARN lists nine prefixed credential names as missing, names only; `hermes_registration` INFO |
| `python3 -c 'import yaml; yaml.safe_load(...)'` on both YAMLs | `YAML_OK` for both |
| `grep -niE 'figma\|chrome\|click.?up\|skill.?advisor\|code.?graph\|\.venv\|vscode'` on both YAMLs | No output, exit 1 |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/mcp.md --type command` | `VALID`, 0 issues |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK`, exit 0 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0 — "OK: route-validate — 10 routes validated, 2 warnings" |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/001-mcp-install-code-mode --strict` | `RESULT: PASSED` — see the validation run recorded in `tasks.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The embedded server manifest is not committed.** `.skilled/.gitignore` line 2 ignores `package.json`, so `.skilled/skills/mcp-code-mode/mcp-server/package.json` is never committed and a fresh clone or worktree cannot build Code Mode. The main checkout has it only as an untracked local file. The doctor now reports the missing manifest by name instead of assuming health.
2. **`scripts/install.sh` never runs a build.** It installs dependencies and writes runtime wiring, but it cannot produce `dist/index.js` by itself, so a check that asks only whether `dist` exists can pass on stale output. The health script now compares `dist`'s mtime against its build inputs and runs `node --check`.
3. **`validate_config.py` under-validates credential keys.** It checks only the MCP-specific nested shape and does not apply the manual-name prefix to credential keys. The proposed change to it was rejected because it modifies the subsystem the doctor inspects; the doctor performs its own prefixed-name presence check.
4. **One UTCP manual is malformed.** The `magicpath` manual in `.utcp_config.json` is a CLI manual without the required `config` field. `utcp_manuals` validates only the name and call-template type across the 14 entries.
5. **The health run stays red on this worktree by design.** `package.json`, `node_modules` and `dist/index.js` are absent, so the run exits 2 and reports three FAIL rows. Codex TOML validation also reports WARN under Python 3.9 because `tomllib` is unavailable; a Python 3.11 interpreter clears that row.
6. **The mutation-class commit gate no longer covers the mcp-tooling CLI scripts.** `scripts/check-mcp-mutation-class.sh` reads its manifest from the `servers:` block of `doctor-mcp-install.yaml`. That block now declares only `code_mode`, because the workflow covers only Code Mode. The Figma, Chrome DevTools and ClickUp entries are gone, and they declared their installers as `mutating` and their doctor scripts as `read-only`. The gate no longer checks that line for `mcp-figma`, `mcp-chrome-devtools` or `mcp-click-up`. Restoring that coverage needs a manifest the guard can read outside this workflow, which is a change to the guard itself and was left out of this phase.

**Follow-up status.** Items 1, 2, 3 and 5 are resolved by `specs/mcp-tooling/021-code-mode-fresh-clone-build`: the server manifest is tracked, `install.sh` builds `dist`, the validator checks each manual type's own fields and the doubled-underscore credential key, and the health run reports 18 PASS, 1 WARN (credential values absent), 0 FAIL. Item 4 turned out to be a validator defect, not a config defect: a CLI manual needs `commands`, which MagicPath has. Item 6 is resolved by `specs/system-speckit/049-doctor-audit-followups` phase 003: the guard reads its own manifest.
<!-- /ANCHOR:limitations -->

---

