---
title: "Implementation Summary: MCP shared dependency startup fix"
description: "Tracks the final implementation and verification evidence for the MCP shared dependency startup fix."
trigger_phrases:
  - "mcp shared dependency implementation summary"
  - "030 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-mcp-shared-dependency-startup-fix"
    last_updated_at: "2026-05-16T10:18:19Z"
    last_updated_by: "main_agent"
    recent_action: "Patched dependencies and prevention docs"
    next_safe_action: "Packet complete; monitor next Codex startup for unrelated MCP failures"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0300000000000000000000000000000000000000000000000000000000000005"
      session_id: "030-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/015-mcp-shared-dependency-startup-fix` |
| **Completed** | 2026-05-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two MCP servers that were crashing at Codex startup can now resolve `@spec-kit/shared` from their own package roots. `mk_skill_advisor` and `mk_code_index` both start past the previous `ERR_MODULE_NOT_FOUND` failure, and the exact compiled modules named in the logs import cleanly.

### Runtime Dependency Repair

`system-skill-advisor/mcp_server` and `system-code-graph` now install `@spec-kit/shared` as a local file dependency. Their package locks now record the dependency as a real linked package instead of an extraneous package, and each local `node_modules/@spec-kit/shared` path resolves to the shared package.

### Prevention Coverage

`/doctor:mcp` now checks the local `@spec-kit/shared` package link and runs a compiled import probe for both affected MCP servers. The install and debug assets also know the shared dependency health checks and repair commands, so fresh installs and guided repairs catch the issue before the runtime startup path does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/package.json` | Modified | Declares `@spec-kit/shared` as `file:../../system-spec-kit/shared`. |
| `.opencode/skills/system-skill-advisor/mcp_server/package-lock.json` | Modified | Locks `node_modules/@spec-kit/shared` as a local link. |
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json` | Modified | Excludes the legacy `lib/shared/embeddings` symlink from package builds. |
| `.opencode/skills/system-code-graph/package.json` | Modified | Declares `@spec-kit/shared` as `file:../system-spec-kit/shared`. |
| `.opencode/skills/system-code-graph/package-lock.json` | Modified | Locks `node_modules/@spec-kit/shared` as a local link. |
| `.opencode/skills/system-code-graph/tsconfig.json` | Modified | Resolves `@spec-kit/shared/*` types through built shared declarations and excludes the stale advisor embeddings symlink. |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modified | Adds `shared_dependency` and `shared_import` checks for `mk_skill_advisor` and `mk_code_index`. |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Modified | Adds shared dependency health checks to install workflow metadata. |
| `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` | Modified | Adds shared dependency repair actions and failure triage guidance. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modified | Documents shared dependency verification and `ERR_MODULE_NOT_FOUND` recovery. |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modified | Clarifies standalone runtime semantics and documents shared dependency recovery. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-mcp-shared-dependency-startup-fix/*` | Created | Tracks scope and verification evidence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first pass fixed runtime resolution, then package-level TypeScript checks exposed the old advisor `lib/shared/embeddings` symlink being compiled as source. That symlink is only a visible dependency marker; the runtime and source imports use `@spec-kit/shared`. Excluding it from build inputs and using built shared declarations in code-graph made the package checks match the runtime package boundary.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use local `file:` dependencies instead of rewriting imports | The compiled JS already imports `@spec-kit/shared` as a package, and the shared package already exposes the needed subpaths. The missing piece is runtime package installation in each consumer. |
| Exclude the legacy embeddings symlink from TypeScript package builds | The symlink points into a subdirectory, so relative imports inside shared embeddings resolve incorrectly when compiled through the advisor tree. Runtime imports use the package boundary instead. |
| Point code-graph `@spec-kit/shared/*` type paths at `shared/dist/*` | Code-graph should type against the shared package API, not pull shared source internals into its composite project. |
| Leave `.mcp.json` symlink untouched | Current Codex startup logs show `opencode.json` MCP launchers and direct package-resolution failures. The broken symlink is separate config hygiene unless another launcher path proves otherwise. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm install` in `.opencode/skills/system-skill-advisor/mcp_server` | PASS, added 1 package, 0 vulnerabilities |
| `npm install` in `.opencode/skills/system-code-graph` | PASS, added 1 package, changed 2 packages, 0 vulnerabilities |
| `test -e .../system-skill-advisor/mcp_server/node_modules/@spec-kit/shared` | PASS, symlink resolves to `../../../../system-spec-kit/shared` |
| `test -e .../system-code-graph/node_modules/@spec-kit/shared` | PASS, symlink resolves to `../../../system-spec-kit/shared` |
| Skill advisor crash-site import | PASS, `skill-advisor import ok` |
| Code graph crash-site import | PASS, `code-graph import ok` |
| `npm run typecheck` in `system-skill-advisor/mcp_server` | PASS |
| `npm run build` in `system-skill-advisor/mcp_server` | PASS |
| `npm run typecheck` in `system-code-graph` | PASS |
| `npm run build` in `system-code-graph` | PASS |
| `node .opencode/bin/mk-skill-advisor-launcher.cjs </dev/null` | PASS, exited 0 after DB and skill graph startup |
| `node .opencode/bin/mk-code-index-launcher.cjs </dev/null` | PASS, exited 0 after env and maintainer-mode startup |
| `bash .opencode/commands/doctor/scripts/mcp-doctor.sh --server mk_skill_advisor --json` | PASS, `shared_dependency` and `shared_import` both passed |
| `bash .opencode/commands/doctor/scripts/mcp-doctor.sh --server mk_code_index --json` | PASS, `shared_dependency` and `shared_import` both passed |
| `bash -n .opencode/commands/doctor/scripts/mcp-doctor.sh` | PASS |
| Ruby YAML load for `doctor_mcp_install.yaml` and `doctor_mcp_debug.yaml` | PASS |
| Spec validation | PASS, `validate.sh ... --strict` passed with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Broken `.mcp.json` symlink remains separate.** The active Codex startup crash comes from `@spec-kit/shared` package resolution in `opencode.json`-launched MCP servers, not from `.mcp.json`.
2. **Package manifests are ignored by the repo.** The runtime fix updates the local ignored `package.json` files and the tracked lockfiles. The current workspace is fixed; a future packaging pass should decide whether these manifests should become tracked.
<!-- /ANCHOR:limitations -->
