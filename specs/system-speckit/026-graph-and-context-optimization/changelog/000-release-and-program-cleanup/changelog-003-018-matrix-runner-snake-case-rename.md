---
title: "047 matrix_runners Snake Case Rename"
description: "The CLI matrix runner runtime folder was renamed from kebab-case to snake_case to align with the naming convention of adjacent MCP server directories. Imports, docs, feature catalog entries and prior packet evidence were all updated. Build and smoke tests passed with no semantic code changes."
trigger_phrases:
  - "matrix_runners rename"
  - "kebab-to-snake convention"
  - "mcp_server folder convention"
  - "matrix runner runtime directory rename"
  - "018-matrix-runner-snake-case-rename"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/018-matrix-runner-snake-case-rename` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The CLI matrix runner folder used kebab-case while adjacent MCP server directories (`skill_advisor`, `code_graph`, `stress_test`) use snake_case. That naming mismatch left imports, test files, docs, feature catalog entries and prior packet evidence pointing at an outlier path.

The runtime directory moved to `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/`. All contained adapters, the manifest, the meta-runner, prompt templates and the README were preserved without logic changes. A reference sweep then updated 301 literal path occurrences across 57 text files. `npm run build` and a 10-test matrix adapter smoke suite both passed. Zero old-path references remain in the requested search surfaces.

`git mv` was blocked by `.git/index.lock` in the sandbox, so the directory moved via a filesystem `mv`. Staging was deferred to the orchestrator.

### Added

- `rename-log.md` recording 301 literal replacements across 57 text files.
- Level 2 packet documentation covering spec, plan, tasks, checklist and implementation summary.
- `description.json` and `graph-metadata.json` with dependency pointers to packets 036 and 046.

### Changed

- Runtime folder path from the old kebab-case name to `mcp_server/matrix_runners/`.
- Import paths in `matrix-adapter-*.vitest.ts` test files to point at the renamed directory.
- Evergreen docs and feature catalog entries under `.opencode/skills/system-spec-kit/` to reference `matrix_runners`.
- Prior packet evidence references under `specs/system-spec-kit/026-graph-and-context-optimization/` updated to the new path.
- Root `README.md` reference updated to the renamed folder.

### Fixed

- Inconsistent runtime folder naming that caused the matrix runner tree to stand out from the snake_case convention used by every adjacent MCP server directory.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` from `.opencode/skills/system-spec-kit/mcp_server` | PASS, TypeScript build exit 0 |
| `npx vitest run matrix-adapter` | PASS, 5 files and 10 tests passed |
| `grep -rln` old path over requested surfaces | PASS, no output |
| `validate.sh --strict` for this packet | PASS, exit 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/` | Renamed from kebab-case to snake_case. All internal files preserved without logic changes. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-*.vitest.ts` | Import paths updated to resolve from `matrix_runners`. |
| `.opencode/skills/system-spec-kit/**/*.md` | Evergreen docs and feature catalog entries updated to reference `matrix_runners`. |
| `specs/system-spec-kit/026-graph-and-context-optimization/**` | Prior packet evidence references updated to the new path. |
| `README.md` | Root README folder reference updated. |
| `rename-log.md` (NEW) | Rename ledger recording 301 replacements across 57 files. |

### Follow-Ups

- Stage the filesystem move and all edited files outside the restricted sandbox session so the rename is reflected in the git index.
