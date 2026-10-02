---
title: "Implementation Summary"
description: "The /doctor:mcp debug target now checks only Code Mode: the launcher, the embedded server build, the root UTCP config and the seven runtime registrations that wire it, with credentials reported by name and presence only."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode"
    last_updated_at: "2026-10-02T20:17:35Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Closed the phase docs from the verified fix evidence; verdict fix, all five criteria Met"
    next_safe_action: "Review and commit the doctor change with its phase docs"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/doctor-mcp-debug.yaml"
      - ".skilled/commands/doctor/scripts/mcp-doctor.sh"
      - ".skilled/commands/doctor/scripts/mcp-doctor-lib.sh"
      - ".skilled/commands/doctor/mcp.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-mcp-debug-code-mode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Build currentness is decided by an mtime comparison inside the doctor, not a build-fingerprint file"
      - "Credentials are reported by name and presence only; values are never requested or written"
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
| **Spec Folder** | 002-mcp-debug-code-mode |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: fix.

Code Mode's debug target now checks what actually decides whether Code Mode starts: the launcher, the embedded server build, the root UTCP config and the seven runtime registrations that wire it. Before the fix, `/doctor:mcp debug` read as if it covered five servers, checked only three config files and accepted a key or raw credential name as proof; the recorded run showed the gap, with an unreadable engine manifest, a missing `dist/index.js` and missing `node_modules`.

### Phase 2: mcp-debug-code-mode

An operator running `/doctor:mcp debug` now gets one Code Mode row per check and a report that maps to this checkout. The workflow runs the read-only health command, presents build, registration, UTCP manual and credential findings, and with `--fix` offers repairs one at a time. The shared doctor script checks the launcher, reads the Node engine from the embedded server's manifest through the launcher's resolver, syntax-checks `dist/index.js` and compares it by mtime against its build inputs, validates `.utcp_config.json` manuals by name and call template type, and reports credential references by name and presence. It inspects all seven project registrations present in this repository — `opencode.json`, `.mcp.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json` and `.devin/mcp_config.json` — requiring the launcher path and `UTCP_CONFIG_FILE=.utcp_config.json`, and reports Hermes as user-level and not checked.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-mcp-debug.yaml` | Rewritten | Code Mode-only diagnosis and approval-gated repairs |
| `.skilled/commands/doctor/scripts/mcp-doctor.sh` | Modified | Seven-config wiring check with launcher and UTCP path values; manifest-derived Node engine; dist syntax and mtime staleness; UTCP manual and type checks; credentials by name; Hermes INFO row; stale self-paths fixed |
| `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh` | Modified | Format-aware JSON and TOML registration parsing, UTCP manual name and type inspection, prefixed credential presence, INFO result helper |
| `.skilled/commands/doctor/mcp.md` | Modified | Description, argument hint `<install [--runtime <name>]|debug [--fix]>`, `--server` removed |
| `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt` | Modified | Debug rows narrowed to Code Mode; invalid `--server system_skill_advisor` example removed; Node guidance aligned |
| `.skilled/commands/README.txt` | Modified | Two `/doctor:mcp` rows |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Doctor mcp argument hint and operation text |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna (cli-codex, max, fast) applied the audit-then-apply change as one executor run. The run reached the ChatGPT usage limit after finishing all edits, so the orchestrator ran the verification itself. Before the fix the read-only run exited 2 with 8 pass and 3 fail; after it the run exits 2 with 11 pass, 2 warn and 3 fail, and the three failures are this worktree's unbuilt Code Mode server rather than a doctor defect. `bash -n` passed on both scripts, both MCP YAML assets parse, the grep for retired server names comes back empty, `mcp.md` validates as a command, the catalog mirror check reports STATUS=OK, and `route-validate.sh` exits 0. Nothing is committed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `/doctor:mcp`, verdict fix, narrow both sub-actions to Code Mode and `.utcp_config.json` | The recorded run showed the debug workflow named more servers than the doctor checked, and the repository routes external tools through Code Mode |
| Build currentness by mtime comparison, computed inside the doctor | The orchestrator rejected the proposal's build-fingerprint file: it would change the inspected Code Mode subsystem, and a `dist/index.js` present without `node_modules` also cannot run |
| No changes to the Code Mode skill | A doctor must not repair the subsystem it inspects in the same phase; `validate_config.py` shape and prefix gaps become findings instead |
| Remove `--server` from both sub-actions | Code Mode is the only server after narrowing, so the flag has no target |
| Credentials by name and presence only | No secret value is printed, read into the report or written; the run lists nine prefixed key names as missing |
| The routed `--fix` offers repairs one at a time and is never passed to `mcp-doctor.sh` | The script's own `--fix` invokes install/build unguarded; the workflow keeps diagnosis read-only and each write behind explicit approval |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on `mcp-doctor.sh` and `mcp-doctor-lib.sh` | SYNTAX_OK |
| `mcp-doctor.sh --json` after the fix (expected exit 2 in this worktree) | pass 11, warn 2, fail 3. FAIL rows: `package_json` missing, `dist_exists` missing, `node_modules` missing. Seven `config` rows checked; `utcp_manuals` PASS "14 manuals have a valid name and call_template_type"; `utcp_credentials` WARN listing nine prefixed names as missing, names only; `hermes_registration` INFO |
| `python3 yaml.safe_load` on both MCP YAML assets | YAML_OK |
| `grep -niE 'figma|chrome|click.?up|skill.?advisor|code.?graph|\.venv|vscode'` on both MCP YAML assets | No output, exit 1 (clean) |
| `validate_document.py mcp.md --type command` | VALID, 0 issues |
| `command-catalog-mirror-check.cjs` | STATUS=OK, exit 0 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | exit 0, "OK: route-validate — 10 routes validated, 2 warnings" |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The three FAIL rows describe this worktree, not the doctor.** `.skilled/skills/mcp-code-mode/mcp-server/package.json` is missing, so `node_engine` cannot resolve, and `dist/index.js` and `node_modules` are not built. The doctor reports each by name and never as a pass.
2. **Finding, not fixed: `.skilled/.gitignore` line 2 ignores `package.json`.** The Code Mode server manifest is never committed, so a fresh clone or worktree cannot build Code Mode. The main checkout has it only as an untracked local file.
3. **Finding, not fixed: `scripts/install.sh` never runs a build.** It can install dependencies but cannot produce `dist/index.js` by itself.
4. **Finding, not fixed: `validate_config.py` validates only the MCP-specific nested shape.** It does not apply the Code Mode manual-name prefix when checking credential keys.
5. **Finding, not fixed: the `magicpath` manual in `.utcp_config.json` is a CLI manual without its required `config` field.**
6. **Codex registration is WARN where `tomllib` is unavailable.** This machine runs Python 3.9, so `.codex/config.toml` is reported "unvalidated" and never as PASS.
7. **Live tool discovery is only probed from an already-connected Code Mode session.** This phase ran the script directly, so no live tool probe was executed; the workflow reports it as not probed.
<!-- /ANCHOR:limitations -->

---


