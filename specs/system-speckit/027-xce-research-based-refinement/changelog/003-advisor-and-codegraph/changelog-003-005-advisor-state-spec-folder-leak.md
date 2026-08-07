---
title: "Advisor State No Longer Leaks Into Spec Folders: Workspace-Root Fallback Hardening + Stray Cleanup"
description: "The skill-advisor workspace-root resolver fell back to its start directory when the canonical SKILL.md sentinel was unreachable, so advisor-bearing processes dispatched with a cwd inside a specs/ packet wrote a stray .opencode/skills/.advisor-state/ tree into that packet — 23 such strays had accumulated. A pure hoist guard now lifts the fallback above any specs/ boundary, the schema's detectRepoRoot twin matches it in lockstep, a 5-case regression test covers it, and the 23 existing strays were removed."
trigger_phrases:
  - "003/005 advisor state spec folder leak changelog"
  - "stray advisor-state directories shipped"
  - "workspace root hoist above specs"
  - "skill-graph-generation.json in spec folders"
  - "027 003/005 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/005-advisor-state-spec-folder-leak` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The skill-advisor resolves where to write its runtime state via `findAdvisorWorkspaceRoot(start)`, which walks up looking for the canonical sentinel `.opencode/skills/system-spec-kit/SKILL.md` and, on a miss, fell back to returning `start`. Advisor-bearing processes dispatched with a cwd inside a `specs/` packet subtree — deep-loop fan-out seats, deep-research iteration dirs, prompt/asset working dirs — therefore materialized a stray `.opencode/skills/.advisor-state/skill-graph-generation.json` inside that packet on every run. A sweep of `.opencode/specs/` found 23 such stray directories; they are gitignored and harmless but clutter the tree and appear with no commit trail. (`specs/` at the repo root is a symlink to `.opencode/specs`, so both spellings point at the same on-disk location.) This packet makes the fallback structurally incapable of returning a spec-subtree path, mirrors the guard in the schema's `detectRepoRoot` twin, proves it with a regression test, and removes the 23 strays.

### Added

- `hoistAboveSpecsTree(dir)` in `lib/utils/workspace-root.ts` — a pure path-math helper that returns the directory above the deepest `.opencode/specs` boundary (or a bare `specs` alias), else `null`.
- `tests/utils/workspace-root.vitest.ts` — a 5-case regression test: happy path (sentinel found), canonical `.opencode/specs` hoist, bare `specs` alias hoist, a no-`specs`-segment property assertion, and the preserved non-specs fallback.

### Changed

- `lib/utils/workspace-root.ts` — the sentinel-not-found fallback now returns `hoistAboveSpecsTree(start) ?? resolve(start)` instead of `resolve(start)`. The hot path is unchanged: the walk-up still returns immediately on a sentinel hit.
- `schemas/advisor-tool-schemas.ts` — `detectRepoRoot` received an inlined twin of the same guard (kept local to avoid a circular `schemas/` → `lib/` import) so the workspaceRoot allowlist is anchored on the true root, not a spec subdir.

### Fixed

- The resolver can no longer hand back a path inside a `specs/` packet, closing the vector that wrote stray `.opencode/skills/.advisor-state/` trees into spec folders.
- The 23 existing stray `.advisor-state` directories under `.opencode/specs/` were removed with a snapshot-driven deletion that left real vendored `external/` `.opencode` clones intact.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (exit 0) |
| New `tests/utils/workspace-root.vitest.ts` | PASS: 5/5 |
| Regression baseline (my two source edits stashed) | The 2 failing parity suites (`python-ts-parity` `rr-iter2-060`, `local-native-divergence-ratchet`) fail identically WITHOUT the edits → pre-existing, not caused here |
| `npm run build` | PASS; `hoistAboveSpecsTree` present in `dist` |
| Stray re-sweep | 0 `.advisor-state` dirs under `.opencode/specs/`; `external/` clones intact |
| Checklist (Level 2) | 6/6 P0, 9/9 P1, 4/4 P2 verified |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/utils/workspace-root.vitest.ts` | Created |
| `.opencode/skills/system-skill-advisor/mcp_server/dist/**` | Rebuilt |
| `.opencode/specs/**/.opencode/skills/.advisor-state/` (×23) | Deleted |

### Follow-Ups

- Live activation: the running advisor daemon picks up the rebuilt `dist` only after a fresh session or `/mcp` reconnect; its launcher does not transparently recycle on child SIGTERM.
- A heavier, related artifact class remains: two research dirs still hold a full `.opencode/node_modules` opencode-plugin install (zod, effect, `@opencode-ai`). It is gitignored and out of scope here; a separate cleanup can remove it.
- The exact reason post-fix-era dispatched `opencode run` seats still reached the fallback was not reproduced; the hoist makes it moot for this leak regardless of dispatch path.
