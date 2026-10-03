---
title: "Feature Specification: Make Code Mode buildable from a fresh clone and validate its UTCP config"
description: "Track the never-committed Code Mode server manifest, make install.sh build dist/index.js, correct validate_config.py's per-type shape and credential-prefix checks, and make the doctor's Codex and build-currentness checks truthful."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Make Code Mode buildable from a fresh clone and validate its UTCP config

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/021-code-mode-fresh-clone-build` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A fresh clone or worktree cannot build Code Mode, and the config preflight reports the shipped UTCP configuration wrongly. The embedded server manifest `.skilled/skills/mcp-code-mode/mcp-server/package.json` is not tracked by git, so a clone receives the lockfile, the TypeScript source and the launcher but no manifest for the resolver, `npm` or `tsc`; the launcher hard-codes that manifest as its engine-range source (`.skilled/bin/mcp-code-mode-launcher.cjs:30,138-142`) and the doctor reports `package_json` as a FAIL with `node_engine` skipped (`.skilled/commands/doctor/scripts/mcp-doctor.sh:147-179`). The installer that exists to set this up installs dependencies but never builds: when `dist/index.js` is absent it logs that the server "may need to be built first" and fails without running the build (`.skilled/skills/mcp-code-mode/scripts/install.sh:384-398`).

The UTCP preflight has two defects of its own. `validate_config.py` requires a `config` field on every manual (`.skilled/skills/mcp-code-mode/scripts/validate_config.py:217`), so it reports the shipped MagicPath CLI manual as broken (`.utcp_config.json:143-151`), which correctly carries the `commands` array required by the pinned `@utcp/cli` transport (`package-lock.json:121-125`), and it compares `${VAR}` references against bare `.env` keys instead of the manual-name prefix Code Mode applies (`.skilled/skills/mcp-code-mode/scripts/validate_config.py:314-345`; contract at `.skilled/skills/mcp-code-mode/references/configuration.md:307-353`). Separately, the doctor's Codex TOML check degrades to a WARN on this machine because it runs the host `python3` (3.9.6, no `tomllib`) without looking for a newer interpreter (`.skilled/commands/doctor/scripts/mcp-doctor-lib.sh:222-260`).

### Purpose

A fresh checkout of this repository must be able to install, build and start the embedded Code Mode server, and the config preflight must accept the shipped UTCP manuals and check credential keys exactly the way Code Mode resolves them.

### Findings Re-Check

- **Finding 1 - manifest not committed. Holds, with a citation correction.** The audit cited `.skilled/.gitignore` line 2. That file exists only in the primary checkout as an untracked local file: `git check-ignore -v` exits 0 there against `.skilled/.gitignore:2:package.json`, but the worktree has no such file and `git check-ignore -v` exits 1. The durable defect is that `.skilled/skills/mcp-code-mode/mcp-server/package.json` is untracked while `package-lock.json`, `index.ts` and `tsconfig.json` are tracked (`git ls-files .skilled/skills/mcp-code-mode`), and the primary checkout holds the manifest only as an ignored local file.
- **Finding 2 - installer never builds. Holds.** `install.sh:384-398` runs `npm install` when `node_modules` is missing, then fails on a missing `dist/index.js` with no build invocation anywhere in the script.
- **Finding 3 - validator shape and prefix gaps. Holds.** `validate_config.py:217` requires `config` for every type and `:314-345` compares raw `${VAR}` names against `.env` keys without the manual-name prefix that `configuration.md:307-353` and `.skilled/skills/mcp-code-mode/SKILL.md:330-348` document and that the doctor already applies (`.skilled/commands/doctor/scripts/mcp-doctor-lib.sh:399-409`).
- **Finding 4 - MagicPath manual "missing its required config field". Does not hold as stated; no fix to `.utcp_config.json` is planned.** The manual's `commands: [{command, append_to_final_output}]` shape (`.utcp_config.json:143-151`) is exactly what the pinned transport requires: `@utcp/cli@1.1.1` (`package-lock.json:121-125`) declares `interface CliCallTemplate { call_template_type: 'cli'; commands: CommandStep[]; ... }` and carries no `config` member. The false report comes from the validator's type-agnostic required-fields list: `python3 .skilled/skills/mcp-code-mode/scripts/validate_config.py .utcp_config.json` currently exits 1 with `manual_call_templates[7]: missing required field 'config'`. The corrective work is in `validate_config.py` and the stale CLI example at `configuration.md:233-242`.
- **Finding 5 - Codex TOML check under Python 3.9. Holds.** `mcp-doctor-lib.sh:222-260` runs `python3` and prints `unvalidated` when `tomllib` is missing; the doctor's current run reports WARN on `.codex/config.toml:code_mode`. This host has `python3` 3.9.6 and `python3.11` through `python3.14` available with `tomllib`.
- **Adjacent defect observed while re-checking. The doctor's build-input list names a path that does not exist.** `mcp-doctor.sh:196` reads `$server_dir/mcp-server/index.ts`, which expands to `.../mcp-code-mode/mcp-server/mcp-server/index.ts`. The real source is `$server_dir/index.ts`, so `dist_currentness` would report `missing inputs: mcp-server/index.ts` even after a correct build. The packet fixes this one-line path so the post-build health report is truthful.

### Purpose Note

Every requirement below traces to a finding in `specs/system-speckit/048-doctor-command-audit/001-mcp-install-code-mode/implementation-summary.md` or `specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/implementation-summary.md` "Known Limitations" sections, or to the observed adjacent defect above.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Track `.skilled/skills/mcp-code-mode/mcp-server/package.json` in git, and align the two skill docs that describe it (`mcp-server/scripts/README.md`, `INSTALL-GUIDE.md`).
- Make `.skilled/skills/mcp-code-mode/scripts/install.sh` run the embedded server build when `dist/index.js` is missing or older than its build inputs, using the Node interpreter the resolver already selects.
- Correct `.skilled/skills/mcp-code-mode/scripts/validate_config.py`: per-type required fields for `mcp`, `cli`, `http` and `file` manuals, and credential keys under `--check-env` built the way the SDK builds them (manual name with each `_` doubled, then `_VAR`).
- Correct the call-template examples in `.skilled/skills/mcp-code-mode/references/configuration.md` to the schemas of the installed packages.
- Make the doctor prefer a `tomllib`-capable Python for the Codex TOML check (`.skilled/commands/doctor/scripts/mcp-doctor-lib.sh`) and fix the `dist_currentness` build-input path (`.skilled/commands/doctor/scripts/mcp-doctor.sh:196`).

### Out of Scope

- The nine missing credential values - operator-managed; the doctor must keep reporting them by name and stay WARN, never FAIL.
- Changing `.utcp_config.json` - the MagicPath CLI manual already matches the pinned transport; the defect is in the validator and its documentation.
- The remaining 048 audit findings (mutation-class gate coverage, live tool probing, Hermes user-level handling) - they belong to other follow-ups, not this defect set.
- Changing `doctor-mcp-install.yaml` and `doctor-mcp-debug.yaml` - their existing guidance already says to run `npm install` and `npm run build` and not to call `install.sh` as the sole build step.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-code-mode/mcp-server/package.json` | Create (track) | Commit the embedded server manifest: name, version 1.0.9, `scripts.build: tsc`, `postinstall`, `engines.node` `>=24.0.0 <25.0.0`, devDependencies, overrides and dependencies. |
| `.skilled/skills/mcp-code-mode/mcp-server/scripts/README.md` | Modify | Remove the claim that `mcp-server/` has no `package.json`; state that the manifest's `postinstall` runs the ABI check. |
| `.skilled/skills/mcp-code-mode/scripts/install.sh` | Modify | Build `dist/index.js` when it is missing or older than the manifest, lockfile, `tsconfig.json` or `index.ts`, under the resolver-selected Node interpreter. |
| `.skilled/skills/mcp-code-mode/scripts/validate_config.py` | Modify | Validate required fields per `call_template_type` and prefix credential keys with the manual name before comparing against `.env`. |
| `.skilled/skills/mcp-code-mode/references/configuration.md` | Modify | Correct the CLI example to the `commands` shape and align the HTTP and file examples with the installed packages. |
| `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md` | Modify | Change the embedded-server instruction from `npm install` to `npm install` followed by `npm run build`. |
| `.skilled/commands/doctor/scripts/mcp-doctor-lib.sh` | Modify | Select the first `python3`/`python3.11`+ interpreter that imports `tomllib` for the Codex TOML check; keep the WARN when none exists. |
| `.skilled/commands/doctor/scripts/mcp-doctor.sh` | Modify | Fix the `dist_currentness` source input from `mcp-server/mcp-server/index.ts` to `index.ts`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Track `.skilled/skills/mcp-code-mode/mcp-server/package.json` so a fresh clone or worktree carries the manifest the launcher, installer and doctor all read. | A fresh worktree passes `git ls-files --error-unmatch .skilled/skills/mcp-code-mode/mcp-server/package.json`; the file's `name`, `version` and `engines.node` match `package-lock.json`'s root entry; the launcher's resolver returns a Node 24 path for it. |
| REQ-002 | `.skilled/skills/mcp-code-mode/scripts/install.sh` builds the embedded server when `dist/index.js` is missing or older than its build inputs. | With `dist/` deleted, `bash .skilled/skills/mcp-code-mode/scripts/install.sh` exits 0 and recreates `dist/index.js`; the doctor reports `dist_exists` and `dist_currentness` as PASS. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `validate_config.py` validates the required fields of each `call_template_type` against the installed transports (MCP `config.mcpServers`, CLI `commands`, HTTP `url`/`http_method`/`content_type`, file `file_path`) instead of requiring `config` everywhere. | `python3 .skilled/skills/mcp-code-mode/scripts/validate_config.py .utcp_config.json` exits 0 with `VALIDATION PASSED`, and the shipped MagicPath CLI manual passes without any change to `.utcp_config.json`. |
| REQ-004 | `validate_config.py --check-env` and the doctor's credential scan compare each `${VAR}` reference against the manual name with every `_` doubled, then `_`, then the variable (manual `clickup_official` and `${CLICKUP_API_KEY}` give `clickup__official_CLICKUP_API_KEY`; `webflow` gives `webflow_WEBFLOW_TOKEN`). The installed `@utcp/sdk` is the source of truth for this rule (`namespace.replace(/_/g, "__")`, `sdk/dist/index.js:1311-1312`), by operator decision. | With a `.env` holding only the doubled-form keys, `--check-env` exits 0; with one removed, it exits non-zero and names the doubled key; the doctor reports the credential row by the doubled names. |
| REQ-005 | The doctor's Codex TOML check uses a `tomllib`-capable Python interpreter when one is installed, and keeps a clear WARN when none is. | On a host where `python3` is 3.9 and `python3.11` exists, the `.codex/config.toml:code_mode` result is PASS instead of WARN. |
| REQ-006 | The doctor's `dist_currentness` check compares `dist/index.js` against the real source file. | After a correct build, `dist_currentness` is PASS and never reports `missing inputs: mcp-server/index.ts`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In a fresh worktree of the build branch, building the embedded server with Node 24 (`npm ci` then `npm run build` in `.skilled/skills/mcp-code-mode/mcp-server/`) produces `dist/index.js`, and `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json --root /tmp/021-code-mode-fresh` reports zero FAIL rows.
- **SC-002**: `python3 .skilled/skills/mcp-code-mode/scripts/validate_config.py .utcp_config.json` exits 0 on the unchanged shipped config, and `--check-env` checks prefixed credential names.
- **SC-003**: The packet's own docs pass `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/mcp-tooling/021-code-mode-fresh-clone-build --strict` with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node.js 24 interpreter | Install and build cannot run on an unsupported ABI | The resolver already finds `~/.nvm/versions/node/v24.9.0`; `install.sh` prepends that interpreter's bin directory to `PATH` for `npm` |
| Dependency | npm registry access | `npm ci` cannot fetch packages offline | The primary checkout's `node_modules` is a fallback; the plan names `npm ci` first and `npm install` second |
| Risk | Tracking the manifest starts running its `postinstall` ABI check on every install | Low - `scripts/check-node.cjs` warns only, never fails | The README change documents the hook; the warning is the intended signal |
| Risk | The primary checkout's local `.skilled/.gitignore` matches `package.json` | A plain `git add` there fails while the manifest is untracked | The ignore file is untracked and absent in clones; force-add once, after which the rule no longer applies to a tracked file |
| Risk | A future lock refresh changes the CLI call-template schema | The validator's `commands` check could go stale | The validator follows the installed package; re-verify against `@utcp/cli` whenever `package-lock.json` changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the doctor's `utcp_manuals` check delegate shape validation to `validate_config.py` instead of checking only name and `call_template_type`? Deferred: the doctor stays read-only and self-contained, while the validator owns per-type shapes.
- Should `install.sh` finish by running `validate_config.py`? Deferred: the doctor is the single health surface, and install stays focused on build and wiring.
- Should the local `.skilled/.gitignore` be corrected or tracked? Deferred: the manifest is tracked after this packet, so the rule no longer applies to it, and the file does not exist in a clone.
<!-- /ANCHOR:questions -->

---


