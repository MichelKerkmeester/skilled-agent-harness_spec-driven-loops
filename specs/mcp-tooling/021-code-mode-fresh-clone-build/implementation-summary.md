---
title: "Implementation Summary"
description: "A fresh clone can now install, build and start the embedded Code Mode server, and the UTCP preflight and doctor report the shipped config truthfully."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/021-code-mode-fresh-clone-build"
    last_updated_at: "2026-10-03T07:00:00Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Built and verified all eighteen tasks"
    next_safe_action: "Parent session stages and commits the manifest and the scoped diff"
    blockers: []
    key_files:
      - ".skilled/skills/mcp-code-mode/mcp-server/package.json"
      - ".skilled/skills/mcp-code-mode/scripts/install.sh"
      - ".skilled/skills/mcp-code-mode/scripts/validate_config.py"
      - ".skilled/commands/doctor/scripts/mcp-doctor-lib.sh"
      - ".skilled/commands/doctor/scripts/mcp-doctor.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-code-mode-fresh-clone-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-code-mode-fresh-clone-build |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: done, pending the parent session's commit. A fresh checkout now carries the Code Mode server manifest, `install.sh` builds `dist/index.js` itself, and the doctor reports zero FAIL rows on a freshly built tree. The UTCP validator now accepts the shipped MagicPath CLI manual without any change to `.utcp_config.json`, and it checks credentials under the manual-name prefix that Code Mode really reads.

### Make Code Mode buildable from a fresh clone and validate its UTCP config

You can clone the repository, run `install.sh`, and get a server the launcher can start. The installer resolves a Node 24 interpreter, installs dependencies with it first on PATH, and rebuilds whenever the entry point is missing or older than `index.ts`, `package.json`, `package-lock.json` or `tsconfig.json`. `validate_config.py` now checks each `call_template_type` against the installed transports instead of demanding `config` everywhere. On this host the doctor picks a `tomllib`-capable Python for the Codex row, and its build-currentness check now reads the real source file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/mcp-code-mode/mcp-server/package.json` | Created (untracked, ready to stage) | The server manifest, copied byte for byte from the primary checkout (sha256 `92dd828c...ea893`) |
| `.skilled/skills/mcp-code-mode/scripts/install.sh` | Modified | Installs and builds under the resolved Node interpreter, and recognizes the shipped `.env.example` section header |
| `.skilled/skills/mcp-code-mode/scripts/validate_config.py` | Modified | Per-type required fields and credential keys built the SDK's way (underscores in the manual name doubled) |
| `.skilled/skills/mcp-code-mode/references/configuration.md` | Modified | http, cli and file examples now match the installed schemas; credential rule states the doubling |
| `.skilled/skills/mcp-code-mode/SKILL.md`, `README.md`, `assets/config-template.md`, `assets/env-template.md` | Modified | Credential rule states the doubling, with a `clickup_official` example |
| `.skilled/skills/mcp-code-mode/mcp-server/scripts/README.md` | Modified | Documents the `postinstall` ABI check |
| `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` | Modified | Embedded setup is `npm install` then `npm run build`; credential rule states the doubling |
| `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh` | Modified | Selects a Python 3.11+ for the Codex TOML check; the credential scan doubles underscores in the manual name |
| `.skilled/commands/doctor/scripts/mcp-doctor.sh` | Modified | `dist_currentness` reads `index.ts` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The manifest was copied by the orchestrator. Four executor dispatches ran in parallel on disjoint files: GPT-6 Luna for the validator, and DeepSeek V4.1 Flash on opencode-go for the installer, the doctor scripts and the three docs. Each diff was read before acceptance, and every check below was rerun by the orchestrator. The fresh-clone proof used a `git archive HEAD` subset (root runtime configs, `.skilled/bin`, `mcp-code-mode`, the doctor command) with this packet's files laid over it. `install.sh` ran there end to end with network access. The worktree itself was then built with `npm ci` and `npm run build` under Node 24.9.0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| HTTP requires only `url`; `http_method` and `content_type` are checked only when present | The installed `@utcp/http` zod schema defaults them to `GET` and `application/json`, so requiring them would reject valid manuals. This narrows the spec's wording to match the transport, which is the intent of REQ-003 |
| Credential keys use the manual name with each `_` doubled, then `_VAR` | Operator decision: the installed `@utcp/sdk` 1.1.2 is the source of truth (`namespace.replace(/_/g, "__")`, `sdk/dist/index.js:1311-1312`). The shipped `.env.example` already uses that form, so the validator, the doctor, six skill docs and REQ-004 now follow it |
| The validator scans every string in a manual for `${VAR}`, not only MCP `env` | The doctor's credential scan and Code Mode both resolve references anywhere in the manual, so the two surfaces now agree |
| The fresh-clone proof used an archive subset in the scratch dir, not a git worktree at `/tmp/021-code-mode-fresh` | Creating a worktree is outside this build's rules, and the full archive is 1.6 GB. The subset holds every path the installer and the doctor read |
| The `.env.example` check matches `CODE MODE[^[:alnum:]]*MCP` | The shipped header separates the words with a dash and the template with a space; the pattern accepts both without writing a dash character into the script |
| `.utcp_config.json` was left untouched | The MagicPath CLI manual already matches `@utcp/cli`; the defect was in the validator |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on install.sh, mcp-doctor.sh, mcp-doctor-lib.sh | PASS, exit 0 each |
| `python3 -m py_compile validate_config.py` | PASS, exit 0 |
| `validate_config.py .utcp_config.json` | PASS, exit 0, `VALIDATION PASSED`, config unchanged |
| `--check-env` with nine prefixed keys | PASS, exit 0, "All 9 required environment variables are defined" |
| `--check-env` with `webflow_WEBFLOW_TOKEN` removed | PASS (expected failure), exit 1, names `webflow_WEBFLOW_TOKEN` |
| Fresh tree: `bash install.sh` (no dist, no node_modules) | PASS, exit 0, `[OK] Embedded MCP server built` |
| Fresh tree: `mcp-doctor.sh --json --root <fresh>` | PASS, summary pass 18 / warn 1 / fail 0; `dist_exists`, `dist_currentness`, `node_engine` (v24.9.0) PASS |
| Worktree: `npm ci` then `npm run build` under Node 24.9.0, `node --check dist/index.js` | PASS, exit 0 each |
| Worktree: `mcp-doctor.sh --json` | pass 18 / warn 1 / fail 0, exit 1 (warnings only). Baseline before the build: pass 13 / warn 2 / fail 2. The remaining WARN is the operator-managed credentials row. The Codex row went from WARN to PASS |
| `.env.example` section check, scratch copies (shipped copy run twice; a file without the section run twice) | PASS: shipped copy stays at 1 section and byte-identical; the file without it goes 0, 1, 1. `bash -n` exit 0. The old check exited 1 against the shipped file |
| Doubled-key rule, fixture with `${DEVTOOLS_TOKEN}` on both chrome_devtools manuals | Only doubled keys set: exit 0, all 11 defined. Removing `chrome__devtools__2_DEVTOOLS_TOKEN` or `clickup__official_CLICKUP_API_KEY`: exit 1, names that key. Single-underscore clickup keys: exit 1. `webflow_WEBFLOW_TOKEN` unchanged |
| Doctor credential row after the rule change | WARN listing `clickup__official_CLICKUP_API_KEY=missing`, names only. With that key in the process env: `present`. Summary still pass 18 / warn 1 / fail 0 |
| `route-validate.sh` | PASS, exit 0, "9 routes validated, 2 warnings" (both are informational H1 flag-overlap notes unrelated to this packet) |
| `validate.sh --recursive --strict` | PASS, `Errors: 0  Warnings: 0`, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Resolved at commit: the manifest is tracked.** Commit `4626ffdfbc` added `.skilled/skills/mcp-code-mode/mcp-server/package.json`. A tracked file is unaffected by the primary checkout's local `.skilled/.gitignore` rule for `package.json`.
2. **By design: credential values are the operator's.** The doctor reports missing values as one WARN, by name only, and never asks for or writes a value.
3. **No acceptance-criteria.md.** This is a Level 1 packet, so tasks.md and the spec requirements table are the closure record.
<!-- /ANCHOR:limitations -->
