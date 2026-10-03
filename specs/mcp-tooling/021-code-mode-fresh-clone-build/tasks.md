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

- [ ] T001 Record the primary checkout's server manifest as the canonical copy: capture its sha256 and confirm `name`, `version`, `engines.node` and `scripts.build` against the root entry of `.skilled/skills/mcp-code-mode/mcp-server/package-lock.json`
- [ ] T002 Author `.skilled/skills/mcp-code-mode/mcp-server/package.json` from that copy, preserving `scripts`, `engines`, `overrides`, `devDependencies`, `dependencies` and `bin` (.skilled/skills/mcp-code-mode/mcp-server/package.json)
- [ ] T003 Stage and commit the manifest so a fresh clone or worktree receives it; force-add where the primary checkout's local ignore file matches `package.json` (.skilled/skills/mcp-code-mode/mcp-server/package.json)
- [ ] T004 [P] Remove the "no package.json" claim and document the `postinstall` ABI check (.skilled/skills/mcp-code-mode/mcp-server/scripts/README.md)
- [ ] T005 [P] Add `npm run build` to the embedded-server instruction so the guide matches a working checkout (.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add a build step to `verify_installation` that runs `npm run build` when `dist/index.js` is missing or older than `index.ts`, `package.json`, `package-lock.json` or `tsconfig.json` (.skilled/skills/mcp-code-mode/scripts/install.sh)
- [ ] T007 Run the install and build with the resolver-selected Node interpreter first on `PATH`, and update the script's step list and verification messages (.skilled/skills/mcp-code-mode/scripts/install.sh)
- [ ] T008 Replace the type-agnostic required-fields list with per-type checks: MCP `config.mcpServers`, CLI `commands`, HTTP `url`/`http_method`/`content_type`, file `file_path` (.skilled/skills/mcp-code-mode/scripts/validate_config.py)
- [ ] T009 Prefix every `${VAR}` reference with its manual name before comparing against `.env` under `--check-env`, and report the prefixed key name (.skilled/skills/mcp-code-mode/scripts/validate_config.py)
- [ ] T010 Correct the call-template examples: CLI to the `commands` array, HTTP to `url`/`http_method`/`content_type`, file to a top-level `file_path` (.skilled/skills/mcp-code-mode/references/configuration.md)
- [ ] T011 Select the first `python3` or `python3.11`-through-`python3.14` interpreter that imports `tomllib` for the Codex TOML check, keeping the WARN detail accurate when none exists (.skilled/commands/doctor/scripts/mcp-doctor-lib.sh)
- [ ] T012 Fix the `dist_currentness` source input path from `mcp-server/mcp-server/index.ts` to `index.ts` (.skilled/commands/doctor/scripts/mcp-doctor.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run `bash -n` on `install.sh`, `mcp-doctor.sh` and `mcp-doctor-lib.sh`, and `python3 -m py_compile` on `validate_config.py`
- [ ] T014 Run `python3 .skilled/skills/mcp-code-mode/scripts/validate_config.py .utcp_config.json` and require exit 0 with `VALIDATION PASSED` on the unchanged shipped config
- [ ] T015 Run `--check-env` against a temporary prefixed `.env` and require exit 0, then remove one prefixed key and require a non-zero exit naming that key
- [ ] T016 Run `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` and require zero FAIL rows plus a PASS on `.codex/config.toml:code_mode`
- [ ] T017 Create a scratch worktree at `/tmp/021-code-mode-fresh`, build with Node 24 (`npm ci` then `npm run build`), and run `mcp-doctor.sh --json --root /tmp/021-code-mode-fresh` requiring zero FAIL rows
- [ ] T018 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/mcp-tooling/021-code-mode-fresh-clone-build --strict` and require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---


