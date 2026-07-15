---
title: "Code Graph Phase 001: MCP Shared Dependency Startup Fix"
description: "Fixed ERR_MODULE_NOT_FOUND crashes that prevented mk_skill_advisor and mk_code_index from starting. Both servers now declare @spec-kit/shared as a local file dependency. Doctor checks and install guides cover detection and repair."
trigger_phrases:
  - "mcp shared dependency startup fix"
  - "ERR_MODULE_NOT_FOUND spec-kit shared"
  - "mk_skill_advisor startup crash"
  - "mk_code_index startup crash"
  - "mcp server module resolution fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-16

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/001-mcp-shared-dependency-startup-fix` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph`

### Summary

Codex startup logs showed `mk_skill_advisor` and `mk_code_index` failing during MCP initialization with `ERR_MODULE_NOT_FOUND: Cannot find package '@spec-kit/shared'`. Both packages compiled TypeScript path aliases into bare runtime imports, but neither declared `@spec-kit/shared` as an installed local dependency. The result was a clean TypeScript build path paired with a broken Node runtime path that prevented both advisory and code-graph MCP servers from starting.

The fix adds `@spec-kit/shared` as a local `file:` dependency in both affected package manifests. Lockfiles were refreshed. Each `node_modules/@spec-kit/shared` path now resolves via symlink to the shared package. A follow-on pass excluded a legacy `lib/shared/embeddings` symlink from the TypeScript build inputs after typecheck exposed it as a stale source reference. The `/doctor:mcp` command plus install YAML assets plus both install guides were extended to detect and repair this class of missing shared dependency before startup.

### Added

- `@spec-kit/shared` declared as `file:../../system-spec-kit/shared` in `system-skill-advisor/mcp_server/package.json`
- `@spec-kit/shared` declared as `file:../system-spec-kit/shared` in `system-code-graph/package.json`
- `shared_dependency` and `shared_import` checks in `/doctor:mcp` for both `mk_skill_advisor` and `mk_code_index`
- Shared dependency verification and `ERR_MODULE_NOT_FOUND` recovery section in `system-skill-advisor/INSTALL_GUIDE.md`
- Standalone runtime semantics and shared dependency recovery section in `system-code-graph/INSTALL_GUIDE.md`

### Changed

- `system-skill-advisor/mcp_server/package-lock.json` now records `@spec-kit/shared` as a root dependency rather than an extraneous package
- `system-code-graph/package-lock.json` updated to lock the new local dependency link
- `system-skill-advisor/mcp_server/tsconfig.build.json` excludes the legacy `lib/shared/embeddings` symlink from package builds
- `system-code-graph/tsconfig.json` routes `@spec-kit/shared/*` type resolution through `shared/dist/*` declarations instead of shared source internals
- `doctor_mcp_install.yaml` and `doctor_mcp_debug.yaml` include shared dependency health checks and repair actions

### Fixed

- `mk_skill_advisor` crashed at startup with `ERR_MODULE_NOT_FOUND` because `@spec-kit/shared` was not installed in its package root. Now resolves via local file link.
- `mk_code_index` crashed at startup with the same error. Now resolves via its own local file link.
- TypeScript build included the legacy `lib/shared/embeddings` symlink as a source directory, causing stale relative import resolution. Excluded from build inputs.

### Verification

| Check | Result |
|-------|--------|
| `npm install` in `system-skill-advisor/mcp_server` | PASS, added 1 package, 0 vulnerabilities |
| `npm install` in `system-code-graph` | PASS, added 1 package, changed 2 packages, 0 vulnerabilities |
| `node_modules/@spec-kit/shared` symlink in `system-skill-advisor/mcp_server` | PASS, resolves to `../../../../system-spec-kit/shared` |
| `node_modules/@spec-kit/shared` symlink in `system-code-graph` | PASS, resolves to `../../../system-spec-kit/shared` |
| Skill advisor crash-site import smoke | PASS, `skill-advisor import ok` |
| Code graph crash-site import smoke | PASS, `code-graph import ok` |
| `npm run typecheck` in `system-skill-advisor/mcp_server` | PASS |
| `npm run build` in `system-skill-advisor/mcp_server` | PASS |
| `npm run typecheck` in `system-code-graph` | PASS |
| `npm run build` in `system-code-graph` | PASS |
| `mk-skill-advisor-launcher.cjs` startup smoke | PASS, exited 0 after DB and skill graph startup |
| `mk-code-index-launcher.cjs` startup smoke | PASS, exited 0 after env and maintainer-mode startup |
| `mcp-doctor.sh --server mk_skill_advisor` | PASS, `shared_dependency` and `shared_import` both passed |
| `mcp-doctor.sh --server mk_code_index` | PASS, `shared_dependency` and `shared_import` both passed |
| `bash -n mcp-doctor.sh` syntax check | PASS |
| Ruby YAML load for install and debug assets | PASS |
| `validate.sh --strict` on packet folder | PASS, 0 errors and 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/package.json` | Declares `@spec-kit/shared` as `file:../../system-spec-kit/shared`. |
| `.opencode/skills/system-skill-advisor/mcp_server/package-lock.json` | Locks `node_modules/@spec-kit/shared` as a root local link. |
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json` | Excludes the legacy `lib/shared/embeddings` symlink from package builds. |
| `.opencode/skills/system-code-graph/package.json` | Declares `@spec-kit/shared` as `file:../system-spec-kit/shared`. |
| `.opencode/skills/system-code-graph/package-lock.json` | Locks `node_modules/@spec-kit/shared` as a root local link. |
| `.opencode/skills/system-code-graph/tsconfig.json` | Routes `@spec-kit/shared/*` types through `shared/dist/*` declarations. Excludes the stale advisor embeddings symlink. |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Adds `shared_dependency` and `shared_import` checks for both affected MCP servers. |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Adds shared dependency health checks to install workflow metadata. |
| `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` | Adds shared dependency repair actions and failure triage guidance. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Documents shared dependency verification and `ERR_MODULE_NOT_FOUND` recovery. |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Clarifies standalone runtime semantics and documents shared dependency recovery. |

### Follow-Ups

- The broken `.mcp.json` symlink remains separate config hygiene. The active Codex startup crash came from `@spec-kit/shared` package resolution in `opencode.json`-launched MCP servers. Confirm whether the symlink is an active launcher path before addressing.
- Package manifests (`package.json`) are git-ignored in this repo. The runtime fix updates the local ignored files and the tracked lockfiles. A future packaging pass should decide whether these manifests should become tracked artifacts.
