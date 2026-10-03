---
title: "Tasks: Make Code Mode buildable from a fresh clone and validate its UTCP config"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Make Code Mode buildable from a fresh clone and validate its UTCP config

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the primary checkout's server manifest as the canonical copy: capture its sha256 and confirm `name`, `version`, `engines.node` and `scripts.build` against the root entry of `.skilled/skills/mcp-code-mode/mcp-server/package-lock.json` Evidence: primary manifest sha256 `92dd828c...ea893`; `name` @utcp/code-mode-mcp, `version` 1.0.9, `engines.node` `>=24.0.0 <25.0.0`, dependencies and devDependencies match the lockfile root entry; `scripts.build` is `tsc`.
- [x] T002 Author `.skilled/skills/mcp-code-mode/mcp-server/package.json` from that copy, preserving `scripts`, `engines`, `overrides`, `devDependencies`, `dependencies` and `bin` (.skilled/skills/mcp-code-mode/mcp-server/package.json) Evidence: copied verbatim, worktree sha256 identical to the primary copy.
- [x] T003 Stage and commit the manifest so a fresh clone or worktree receives it; force-add where the primary checkout's local ignore file matches `package.json` (.skilled/skills/mcp-code-mode/mcp-server/package.json) Superseded for this build: the parent session owns staging and commits. The file is present and trackable (`git check-ignore -v` exits 1; `git status` shows `?? .skilled/skills/mcp-code-mode/mcp-server/package.json`). No force-add is needed in this worktree.
- [x] T004 [P] Remove the "no package.json" claim and document the `postinstall` ABI check (.skilled/skills/mcp-code-mode/mcp-server/scripts/README.md) Evidence: the README now says npm runs `check-node.cjs` through the manifest's `postinstall` hook and that it only warns; grep for "has no package.json" exits 1.
- [x] T005 [P] Add `npm run build` to the embedded-server instruction so the guide matches a working checkout (.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md) Evidence: INSTALL-GUIDE.md line 379 now names `npm install` followed by `npm run build`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add a build step to `verify_installation` that runs `npm run build` when `dist/index.js` is missing or older than `index.ts`, `package.json`, `package-lock.json` or `tsconfig.json` (.skilled/skills/mcp-code-mode/scripts/install.sh) Evidence: `verify_installation` builds when `dist/index.js` is missing or any of the four inputs is `-nt` it; the fresh-copy install log shows `[OK] Embedded MCP server built`.
- [x] T007 Run the install and build with the resolver-selected Node interpreter first on `PATH`, and update the script's step list and verification messages (.skilled/skills/mcp-code-mode/scripts/install.sh) Evidence: `check_server_engine_range` stores the resolved interpreter in `SERVER_NODE_BIN` and `run_in_mcp_server` puts its directory first on PATH; help step 5 and the DRY-RUN lines mention the build.
- [x] T008 Replace the type-agnostic required-fields list with per-type checks: MCP `config.mcpServers`, CLI `commands`, HTTP `url`/`http_method`/`content_type`, file `file_path` (.skilled/skills/mcp-code-mode/scripts/validate_config.py) Evidence: per-type checks for mcp `config`, cli `commands`, http `url` (method and content type validated only when present, because the schema defaults them), file `file_path`.
- [x] T009 Prefix every `${VAR}` reference with its manual name before comparing against `.env` under `--check-env`, and report the prefixed key name (.skilled/skills/mcp-code-mode/scripts/validate_config.py) Evidence: every `${VAR}` in a manual is tracked under the SDK's key (see T020); the missing-key run lists `webflow_WEBFLOW_TOKEN (referenced in manual_call_templates[13])`.
- [x] T010 Correct the call-template examples: CLI to the `commands` array, HTTP to `url`/`http_method`/`content_type`, file to a top-level `file_path` (.skilled/skills/mcp-code-mode/references/configuration.md) Evidence: the http, cli and file examples now use top-level `url`/`http_method`/`content_type`, `commands`, and `file_path`.
- [x] T011 Select the first `python3` or `python3.11`-through-`python3.14` interpreter that imports `tomllib` for the Codex TOML check, keeping the WARN detail accurate when none exists (.skilled/commands/doctor/scripts/mcp-doctor-lib.sh) Evidence: `_doctor_toml_python` tries python3, then 3.14 down to 3.11; the doctor's Codex row is PASS on this host.
- [x] T012 Fix the `dist_currentness` source input path from `mcp-server/mcp-server/index.ts` to `index.ts` (.skilled/commands/doctor/scripts/mcp-doctor.sh) Evidence: `source_inputs` now lists `$server_dir/index.ts`; `dist_currentness` is PASS after a build.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `bash -n` on `install.sh`, `mcp-doctor.sh` and `mcp-doctor-lib.sh`, and `python3 -m py_compile` on `validate_config.py` Evidence: `bash -n` exit 0 on all three scripts; `py_compile` exit 0.
- [x] T014 Run `python3 .skilled/skills/mcp-code-mode/scripts/validate_config.py .utcp_config.json` and require exit 0 with `VALIDATION PASSED` on the unchanged shipped config Evidence: exit 0, `VALIDATION PASSED`, with `.utcp_config.json` unchanged.
- [x] T015 Run `--check-env` against a temporary prefixed `.env` and require exit 0, then remove one prefixed key and require a non-zero exit naming that key Evidence: nine prefixed keys pass with exit 0; with `webflow_WEBFLOW_TOKEN` removed it exits 1 and names that key.
- [x] T016 Run `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` and require zero FAIL rows plus a PASS on `.codex/config.toml:code_mode` Evidence: after `npm ci` and `npm run build` under Node 24.9.0, the doctor summary is pass 18, warn 1, fail 0. The one WARN is the operator-managed credentials row. The Codex row is PASS.
- [x] T017 Create a scratch worktree at `/tmp/021-code-mode-fresh`, build with Node 24 (`npm ci` then `npm run build`), and run `mcp-doctor.sh --json --root /tmp/021-code-mode-fresh` requiring zero FAIL rows Evidence: the fresh tree was a `git archive HEAD` subset plus this packet's files, placed in the session scratch dir instead of `/tmp/021-code-mode-fresh` (a git worktree is outside this build's rules). `install.sh` exited 0 and built `dist/index.js`, and `mcp-doctor.sh --json --root <fresh>` reported fail 0.
- [x] T018 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/mcp-tooling/021-code-mode-fresh-clone-build --strict` and require `RESULT: PASSED` Evidence: see the RESULT line in implementation-summary.md.
- [x] T019 Make the `.env.example` section check match both header forms, so the shipped file is no longer appended to on every run (.skilled/skills/mcp-code-mode/scripts/install.sh) Evidence: the check is now `grep -qE "CODE MODE[^[:alnum:]]*MCP"`. On a scratch copy of the shipped `.env.example`, two runs left one section and a byte-identical file. A file without the section got it added once, and a second run left it at one. `bash -n` exits 0. The old check exited 1 against the shipped file.
- [x] T020 Apply the SDK's credential key rule (manual name with each `_` doubled, then `_VAR`) in the validator, the doctor's credential scan, six skill docs and the spec requirement (validate_config.py, mcp-doctor-lib.sh, SKILL.md, README.md, INSTALL-GUIDE.md, references/configuration.md, assets/config-template.md, assets/env-template.md, spec.md) Evidence: fixture config with `${DEVTOOLS_TOKEN}` added to both chrome_devtools manuals; with only doubled keys set, `--check-env` exits 0 ("All 11 required environment variables are defined"). Removing `chrome__devtools__2_DEVTOOLS_TOKEN` or `clickup__official_CLICKUP_API_KEY` exits 1 and names that key, and the single-underscore clickup form fails. `webflow_WEBFLOW_TOKEN` is unchanged. The doctor's credential row lists `clickup__official_CLICKUP_API_KEY=missing`; with that key in the process env it reports `present`, and the single-underscore TEAM_ID stays `missing`. `grep -rn clickup_official_CLICKUP` over the skill's markdown exits 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---


