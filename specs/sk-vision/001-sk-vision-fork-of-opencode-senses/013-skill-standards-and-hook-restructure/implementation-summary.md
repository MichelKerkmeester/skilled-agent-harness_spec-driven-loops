---
title: "Implementation Summary: sk-vision standards + hook restructure"
description: "Closeout for the sk-vision docs-to-standard rebuild and the Pi/OpenCode hooks consolidation, with the OpenCode-adapter design decisions."
trigger_phrases:
  - "sk-vision restructure summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure"
    last_updated_at: "2026-08-17T10:28:40.000Z"
    last_updated_by: "claude"
    recent_action: "Rebuilt sk-vision docs and consolidated host adapters under hooks/."
    next_safe_action: "Commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure/implementation-summary.md"
      - ".opencode/skills/sk-vision/hooks/opencode/sk-vision.ts"
      - ".opencode/skills/sk-vision/vision-runtime/scripts/build.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-013-skill-standards-and-hook-restructure"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-skill-standards-and-hook-restructure |
| **Status** | In Progress |
| **Level** | 2 |

Docs, adapters, and build are done and verified; the sk-vision-scoped commit on v4 is the one remaining step.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three workstreams landed in the main checkout:

1. **Docs** — SKILL.md was rebuilt to the `sk-create-skill` standalone-skill template and made self-contained: the JSON-RPC protocol, runtime methods, tool→method map, environment variables, and troubleshooting from the old `references/runtime-reference.md` are folded in. The reference doc and its directory were deleted, `leafRoots` moved to `feature-catalog`, and the Class-S manifests were regenerated. README.md was rebuilt to the README template.
2. **Pi adapter** — moved from `pi/sk-vision.ts` to `hooks/pi/sk-vision.ts`; `.pi/extensions/sk-vision.ts` was re-pointed (repairing a dangling symlink left by a parallel attempt) and the `.opencode/hooks/sk-vision/pi` mirror added.
3. **OpenCode adapter** — a standalone `hooks/opencode/sk-vision.ts` that imports the shared vision-runtime core from source and owns the host glue. The runtime build gained an entry that bundles it to a loadable `hooks/opencode/sk-vision.js`; `.opencode/plugins/sk-vision.js` now symlinks to that artifact, and the `.opencode/hooks/sk-vision/opencode` mirror was added. The artifact is gitignored, matching `dist`.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| Self-contained SKILL.md | `.opencode/skills/sk-vision/SKILL.md` | 1,949 words; `package_skill.py --check: PASS` |
| Reference folded | `leafRoots: ["feature-catalog"]` | `ci-skill-root-metadata.cjs` `OK [S] sk-vision` |
| Pi adapter under hooks | `.pi/extensions/sk-vision.ts` -> `hooks/pi/sk-vision.ts` | resolves to the 20KB source |
| OpenCode adapter | `hooks/opencode/sk-vision.ts` + `build.ts` entry | build emits `hooks/opencode/sk-vision.js`; default export type `function` |
| Host load paths | `.opencode/plugins/sk-vision.js`, both `.opencode/hooks/sk-vision/*` | all four symlinks resolve |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The docs were rebuilt against the `sk-create-skill` templates and validated with `validate_skill_package.py`. The Pi move reused the parallel attempt's clean file move and only repaired the wiring. The OpenCode adapter was authored to import `vision-runtime/src/*` (the same core the Pi adapter uses) and added as a second `Bun.build` entrypoint whose output lands beside its source; the host load path became a symlink to that built `.js`. Every symlink was checked with a portable resolution test, and the runtime `bun test` suite was re-run to confirm the build change was additive.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fold the runtime reference into SKILL.md | The combined doc is 1,949 words — under the 5k cap — so a self-contained SKILL.md is cleaner than a split reference for a skill this size |
| Route `leafRoots` to `feature-catalog` after removing `references/` | `feature-catalog/` is the real per-tool deep corpus; a Class-S skill needs a routed leaf root |
| OpenCode adapter = `.ts` source + build step | OpenCode loads `.js` and cannot import the `.ts` source, and `dist` is a single bundle with no separable core modules — so a `.js`-importing-dist plugin was infeasible; a built `.ts` that imports `src` is the only truly-standalone shape |
| Adapter imports the shared core, not a copy | The vision itself lives in the runtime core; only the thin host glue is per-adapter, so both hosts import one core |
| Gitignore the OpenCode build artifact | Consistent with the gitignored `dist`; the host symlink resolves after `bun run build`, the same contract the skill already had |
| Per-file symlinks for the `.opencode/hooks` mirrors | Matches the `system-skill-advisor` exemplar |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_skill_package.py --check` | PASS |
| `ci-skill-root-metadata.cjs` | `OK [S] sk-vision` |
| SKILL.md word count | 1,949 (< 5k cap) |
| `bun run build` | emits `dist/plugin.js` + `hooks/opencode/sk-vision.js` |
| OpenCode adapter load | default export type `function` |
| `bun test` | 8 pass / 0 fail |
| Pi tool parity | 13 `registerTool` in `hooks/pi/sk-vision.ts` |
| Host symlinks | all four resolve |
| Build artifact ignored | `git check-ignore` confirms `hooks/opencode/sk-vision.js` |
| Scope isolation | only sk-vision paths changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- `hooks/opencode/sk-vision.ts` and `vision-runtime/src/plugin.ts` both hold the OpenCode plugin glue (each imports the same shared core). The duplication is thin host orchestration, not vision logic; if it drifts, the source of truth is the core the two share. Collapsing to one is a possible follow-up.
- The OpenCode adapter and `dist` are gitignored build artifacts, so a fresh checkout must run `bun run build` before the OpenCode plugin symlink resolves — the same contract the skill already had.
- The changes live in the main checkout only; the commit on `v4` is pending. The parallel `pi-fast-mode` work in the same checkout is untouched.
- `description.json` and `graph-metadata.json` are conductor-generated, not hand-authored.
<!-- /ANCHOR:limitations -->
