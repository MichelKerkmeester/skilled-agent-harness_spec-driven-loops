---
title: "Implementation Summary: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants"
description: "Removed the dead maintainer-mode code-graph-index flag mechanism: the git filter, its config file, its reference doc, and the dead env-var fallback path it fed."
trigger_phrases:
  - "code graph index flag deprecation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/004-code-graph-index-flag-deprecation"
    last_updated_at: "2026-08-08T10:52:13Z"
    last_updated_by: "claude-code"
    recent_action: "All 5 plan.md steps executed and verified"
    next_safe_action: "Commit and push"
    blockers: []
    key_files:
      - ".gitattributes"
      - ".opencode/skills/sk-git/references/config-content-filters.md"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/utils/index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-code-graph-index-flag-deprecation |
| **Completed** | 2026-08-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repo no longer carries filter/config/doc plumbing for a maintainer-mode toggle nothing uses anymore. `scripts/setup-maintainer-filters.sh`, removed during the specs-root migration's cleanup step, installed a git clean/smudge filter that kept five `SPECKIT_CODE_GRAPH_INDEX_*` flags `"true"` in a maintainer's working tree while committing `"false"`. None of the four config files it targeted have carried those keys for a while — the filter, its `.gitattributes` declaration, the reference doc describing it, and a dead env-var read path in `index-scope.ts` were all infrastructure for a mechanism with nothing left to act on.

### Dead-file removal

`.gitattributes` (21 lines, entirely this filter's mapping and rationale comment) and `.opencode/skills/sk-git/references/config-content-filters.md` (entirely a description of the same filter) are both deleted. Deleting the reference doc surfaced a dependency the initial scoping grep missed: `sk-git`'s own `leaf-manifest.json`/`leaf-aliases.json` still listed it as a hub resource. Fixed with the hub's own regeneration tooling (`generate-leaf-manifest.cjs --write`, `ci-skill-root-metadata.cjs --fix`) rather than hand-editing the JSON.

### `index-scope.ts` simplification

`resolveIncludedSkillsList` and `resolveIndexScopePolicy` no longer read `env.SPECKIT_CODE_GRAPH_INDEX_*` at all — every fallback now goes straight to its safe default (`'none'` / `false`) instead of consulting an env var no config file ever set. The now-unreachable `'env'` value was dropped from `IndexScopePolicySource`, and the `env` field was dropped from `ResolveIndexScopePolicyInput` — confirmed unused by any caller across the codebase before removing it. The per-call override machinery (`includeSkills`, `includeAgents`, `includeCommands`, `includeSpecs`, `includePlugins`, `includeGlobs`, `excludeGlobs`) is byte-for-byte unchanged; that's the still-live mechanism this cleanup was careful not to touch.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gitattributes` | Deleted | Entire content was the dead filter's mapping |
| `.opencode/skills/sk-git/references/config-content-filters.md` | Deleted | Entirely described the dead filter |
| `.opencode/skills/sk-git/leaf-manifest.json` | Modified (regenerated) | Dropped the deleted doc's manifest entry |
| `.opencode/skills/sk-git/leaf-aliases.json` | Modified (regenerated) | Dropped the deleted doc's alias entry |
| `.opencode/skills/system-spec-kit/mcp-server/lib/utils/index-scope.ts` | Modified | Removed 5 dead env-var reads, the now-unreachable `'env'` source value, and the `env` input field |
| Local git config (this machine only) | Unregistered | `filter.maintainer-flags.{clean,smudge,required}` unset — not tracked, not part of any commit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Scoped by a repo-wide `git grep` for every `SPECKIT_CODE_GRAPH_INDEX_*` and `maintainer-flags` reference, confirmed the generic sk-git advisory rule (`staged-path-rewritten-by-filter`) is not specific to this flag and left it untouched, then executed the 5-step plan in order. Verified with `tsc --noEmit` (0 errors), the existing `index-scope.vitest.ts` suite (8/8 passed, unchanged assertions), and a final repo-wide grep confirming zero live references remain outside historical spec docs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regenerate `leaf-manifest.json`/`leaf-aliases.json` via the hub's own tooling instead of hand-editing | Keeps the hash-verified manifest contract intact; hand-editing risks drifting from what `ci-skill-root-metadata.cjs` expects |
| Reverted the fleet-wide `--fix` run's incidental touch to `system-skill-advisor/leaf-aliases.json` | That staleness (`hooks/skill-advisor-hook.md`) predates this change and is out of scope — Scope Lock means fixing it belongs to a separate change, not a side effect of this one |
| Dropped the `env` field and `'env'` source value entirely rather than leaving them as unused dead code | Nothing in the codebase ever read or referenced them once the 5 fallback reads were removed — keeping them would just be new dead code replacing old dead code |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` (mcp-server package) | PASS, exit 0, no output |
| `npm run build` (mcp-server package) | PASS, dist rebuilt clean |
| `npx vitest run tests/index-scope.vitest.ts` | PASS, 8/8 tests, unchanged assertions |
| `git grep -l "SPECKIT_CODE_GRAPH_INDEX" -- . ':!specs' ':!.opencode/specs'` | PASS, empty (no live references) |
| `git config --get filter.maintainer-flags.required` | PASS, returns nothing (was `true` before) |
| `ci-skill-root-metadata.cjs` fleet check | PASS, 11/11 OK after fix + scope-lock revert |
<!-- /ANCHOR:verification -->

---

### Current Fleet-Check Addendum (2026-08-08)

A fresh run of `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports `checked=11 passed=10 failed=1 fixed=0`. `system-skill-advisor` is the sole failure because `leaf-aliases.json` is stale against the projection of `leaf-manifest.json`; the other 10 skill roots pass. The original `11/11 OK` row above is retained as historical evidence. This staleness remains deliberately scope-locked. The phase task record states:

> "That fleet-wide `--fix` run also touched `system-skill-advisor/leaf-aliases.json` for an unrelated pre-existing staleness (`hooks/skill-advisor-hook.md`, confirmed via `git diff` to have nothing to do with this change) — reverted via `git checkout --` to stay scope-locked."

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other clones still carry the filter locally.** This unregisters the git filter config only on this machine. Any other maintainer clone that ran the old `setup-maintainer-filters.sh` still has `filter.maintainer-flags.*` registered locally — harmless (the `.gitattributes` mapping that invoked it is gone, so the filter is simply never triggered), but not proactively cleaned up on their behalf.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
