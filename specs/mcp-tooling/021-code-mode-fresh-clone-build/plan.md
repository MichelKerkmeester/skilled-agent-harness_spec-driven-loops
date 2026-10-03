---
title: "Implementation Plan: Make Code Mode buildable from a fresh clone and validate its UTCP config"
description: "Track the embedded Code Mode server manifest, teach install.sh to build dist, correct validate_config.py's per-type and credential-prefix checks, and make the doctor's Codex and build-currentness checks truthful."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Make Code Mode buildable from a fresh clone and validate its UTCP config

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Python 3 (3.11+ preferred for TOML), Node.js 24, TypeScript, npm |
| **Framework** | Embedded `@utcp/code-mode-mcp` 1.0.9 server; `@utcp/cli` 1.1.1 transport pinned by the lockfile |
| **Storage** | None; repo files only (`.utcp_config.json`, optional `.env` for credentials) |
| **Testing** | Shell syntax checks, `validate_config.py`, the read-only `mcp-doctor.sh --json`, and a fresh-worktree `npm ci && npm run build` |

### Overview

The work has three strands that share one subject - the embedded Code Mode server and its UTCP config. First, commit the server manifest that the launcher, installer and doctor all read, and make `install.sh` actually build `dist/index.js`. Second, teach `validate_config.py` the real per-type call-template shapes and Code Mode's manual-name credential prefix. Third, close two doctor gaps: prefer a `tomllib`-capable Python for the Codex TOML row and point the build-currentness check at the real source file. The observable end state is a fresh worktree that builds Code Mode and produces a doctor report with zero FAIL rows.
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

Not applicable - a set of scoped fixes to one skill's install/validation scripts and one doctor script, with no framework or runtime architecture change.

### Key Components

- **Embedded server manifest** (`.skilled/skills/mcp-code-mode/mcp-server/package.json`): the single source for the Node engine range, the `build: tsc` script, devDependencies and the `postinstall` ABI check.
- **Launcher** (`.skilled/bin/mcp-code-mode-launcher.cjs`): resolves a Node 24 interpreter from that manifest and starts `dist/index.js`; every runtime config registers this path.
- **Installer** (`.skilled/skills/mcp-code-mode/scripts/install.sh`): prerequisite checks, config wiring, dependency install, and - after this change - the build that produces `dist/index.js`.
- **Config validator** (`.skilled/skills/mcp-code-mode/scripts/validate_config.py`): structural checks over `.utcp_config.json` and optional `.env` credential presence.
- **Doctor** (`.skilled/commands/doctor/scripts/mcp-doctor.sh` plus `mcp-doctor-lib.sh`): the read-only health report that reads all of the above and must stop reporting these defects.

### Data Flow

`install.sh` reads the manifest, asks the resolver for a satisfying Node interpreter, installs dependencies with that interpreter first on `PATH`, runs `npm run build`, and verifies `dist/index.js`. At start time the launcher performs the same resolution and hands off to `dist/index.js`. The doctor reads the manifest, `dist` mtimes, `.utcp_config.json` and the seven runtime registrations and reports PASS/WARN/FAIL; `validate_config.py` independently checks the same config for shape and credential names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Static checks: `bash -n` for `install.sh`, `mcp-doctor.sh` and `mcp-doctor-lib.sh`; `python3 -m py_compile` for `validate_config.py`; `node --check` for `dist/index.js`.

Behavioral checks: `python3 .skilled/skills/mcp-code-mode/scripts/validate_config.py .utcp_config.json` must exit 0 on the unchanged shipped config; a temporary `.env` with prefixed keys must pass `--check-env` while a removed prefixed key must fail with its name in the output; `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` must report zero FAIL rows in this worktree and on a fresh worktree built with Node 24; the Codex row must be PASS on this host.

The fresh-clone proof creates a scratch worktree of the build branch at `/tmp/021-code-mode-fresh`, runs `npm ci` and `npm run build` with the resolver-selected Node 24 interpreter, then runs the doctor with `--root /tmp/021-code-mode-fresh` and reads the JSON summary.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js 24 interpreter (`~/.nvm/versions/node/v24.9.0` on this host), found by `.skilled/bin/lib/node-engine-resolver.cjs`.
- npm registry access for `npm ci`; the primary checkout's installed `node_modules` is the fallback.
- A `tomllib`-capable Python (3.11+) for the Codex row; `python3.11` through `python3.14` exist on this host.
- `@utcp/cli@1.1.1` and the other `@utcp/*` packages pinned by `package-lock.json`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped diff. The manifest is an additive file, the validator and doctor changes are local edits with no state, and no data migration or runtime registration changes are involved. A `git checkout --` on each modified path restores it; deleting the tracked manifest restores the previous (broken) clone behavior.
<!-- /ANCHOR:rollback -->

---


