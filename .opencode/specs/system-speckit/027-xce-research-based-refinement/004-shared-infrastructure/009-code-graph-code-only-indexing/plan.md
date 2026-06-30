---
title: "Implementation Plan: Code Graph Code-Only Indexing and Selectable Maintainer Mode"
description: "Drop markdown from the code graph's default include globs and make maintainer-mode select which .opencode categories to force-index."
trigger_phrases:
  - "code only indexing plan"
  - "exclude markdown code graph plan"
  - "selectable maintainer mode plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/009-code-graph-code-only-indexing"
    last_updated_at: "2026-06-14T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan executed in full"
    next_safe_action: "Recycle code-index daemon + full rescan"
---
# Implementation Plan: Code Graph Code-Only Indexing and Selectable Maintainer Mode

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surfaces** | One indexer glob list, one launcher resolver, two tests, two docs, one gitignored env |
| **File-type gate** | `indexer-types.ts` `defaultIncludeGlobs` drives the walk; removing `**/*.md` stops markdown enumeration |
| **Maintainer gate** | `mk-code-index-launcher.cjs` forces `INDEX_*` from `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` (the only `.env.local` knob that beats config, since config wins over file) |
| **Adoption** | Dist rebuild + daemon reload, then a full rescan drops existing `.md` nodes |

### Overview
The walk enumerates files matching `defaultIncludeGlobs` minus the scope excludes; markdown reached the graph as `language='doc'` rows. Dropping `**/*.md` removes it from the walk while keeping code and structured config. Maintainer-mode is the one override that can beat the committed `INDEX_*=false` (the launcher force-assigns `process.env`); extracting a pure `resolveMaintainerModeCategories` lets it force a chosen subset instead of all five.
<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed the walk gates on `defaultIncludeGlobs` (indexer test proved `.md` drops, `.json` stays)
- [x] Confirmed `.env.local` per-`INDEX_*` is inert (config wins over file); only `MAINTAINER_MODE` beats it

### Definition of Done
- [x] `**/*.md` removed; indexer test asserts markdown excluded even in opted-in folders
- [x] `MAINTAINER_MODE` selectable via a pure exported resolver with unit tests
- [x] Dist builds; parser test green; hygiene clean; docs updated
<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Separate the two gates: file-type (include globs) decides *what kinds of files* are graphed; category scope (`INDEX_*` / maintainer mode) decides *which `.opencode` folders* are in range. Markdown is removed at the file-type gate, so it is excluded regardless of category opt-in.

### Key Components
- `indexer-types.ts` `defaultIncludeGlobs` — the file-type allowlist (now code + structured config, no markdown)
- `mk-code-index-launcher.cjs` `resolveMaintainerModeCategories` — pure resolver mapping the env value to forced categories
- `.env.local` (gitignored) — the maintainer's local opt-in (`skills,plugins`)

### Data Flow
1. Launcher loads `.env.local`, resolves `MAINTAINER_MODE` to a category set, force-sets those `INDEX_*` to `true`.
2. The scan walks files matching `defaultIncludeGlobs` minus excludes; markdown never matches.
3. Matched code + config files are parsed/registered; config as `language='doc'`, code by tree-sitter.
<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Trace the file-type vs category gates; confirm `.env.local` precedence

### Phase 2: Core Implementation
- [x] Remove `**/*.md` from `defaultIncludeGlobs`
- [x] Extract `resolveMaintainerModeCategories` (pure, exported) + selectable force in the launcher
- [x] Set `.env.local` to `skills,plugins`

### Phase 3: Verification
- [x] Update indexer test expectations; add resolver unit test; `tsc --build`
- [x] Run indexer + resolver + parser tests; node --check launcher; hygiene; docs
<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | markdown excluded / config kept across the doc matrix | `code-graph-indexer.vitest.ts` |
| Unit | maintainer resolver (true / subset / unknown / empty) | `launcher-maintainer-mode.vitest.ts` |
| Regression | parser `'doc'` language still works | `tree-sitter-parser.vitest.ts` |
| Build | TS compiles | `tsc --build` |
<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Dist rebuild | Internal | Green | Daemon would run the old globs |
| Code-index daemon reload + rescan | Internal | Deferred | Existing `.md` nodes linger until the rescan |
<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: dropping markdown removes graph context something relied on.
- **Procedure**: re-add `'**/*.md'` to `defaultIncludeGlobs` and rebuild; the maintainer-mode resolver is independently revertible (restore the `=== 'true'` check). A rescan repopulates doc rows.
<!-- /ANCHOR:rollback -->
