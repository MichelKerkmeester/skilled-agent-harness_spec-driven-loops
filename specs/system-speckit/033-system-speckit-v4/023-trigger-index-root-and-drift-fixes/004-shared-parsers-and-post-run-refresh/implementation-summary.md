---
title: "Implementation Summary"
description: "The spec-kit shared package now owns one frontmatter parser and one containment primitive used across spec-kit and the skill advisor, and fan-out runs refresh their packet's generated metadata when they end."
trigger_phrases:
  - "shared frontmatter parser"
  - "parse-frontmatter fence split"
  - "path containment primitive shared"
  - "post run metadata refresh fanout"
  - "--no-metadata-refresh flag"
  - "advisor build better-sqlite3 declaration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/023-trigger-index-root-and-drift-fixes/004-shared-parsers-and-post-run-refresh"
    last_updated_at: "2026-09-05T21:16:57Z"
    last_updated_by: "template-author"
    recent_action: "Shared helpers adopted, refresh added"
    next_safe_action: "None; phase complete, packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:262c127297df8df59198be640eacb28ef9b4b03d06cedada87c80ef87e4f913c"
      session_id: "scaffold-004-shared-parsers-and-post-run-refresh"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-shared-parsers-and-post-run-refresh |
| **Status** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`shared/frontmatter/parse-frontmatter.ts` splits a leading fence and parses it with the `js-yaml` the workspace already carries, handling no fence, CRLF fences, a fence that is not on line one, and `---` lines inside the body. Seven spec-kit CLI modules, the runtime validation orchestrator and two skill-advisor modules parse through it now. The write-boundary primitive moved verbatim to `shared/utils/path-containment.ts` and is re-exported by the CLI so callers keep their imports. The fan-out runner runs the spec folder's description and graph-metadata generators after every run, skips with a warning when the CLI dist is absent, records ledger events, and honors `--no-metadata-refresh`. The skill advisor, whose build had been broken since the decommission removed the sqlite types package it borrowed, builds again on a local declaration.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/frontmatter/parse-frontmatter.ts`, `.test.ts`, `shared/index.ts`, `shared/package.json` | Add, Modify | The parser, its test, its export, the `js-yaml` dependency declaration |
| `shared/utils/path-containment.ts`, `runtime/cli/utils/path-utils.ts` | Add, Modify | Primitive moved; CLI re-exports |
| `runtime/cli/core/{find-predecessor-memory,frontmatter-editor,title-builder,workflow}.ts`, `runtime/cli/extractors/spec-folder-extractor.ts`, `runtime/cli/lib/validate-memory-quality.ts`, `runtime/cli/utils/spec-affinity.ts`, `runtime/lib/validation/orchestrator.ts` | Modify | Parse through the shared function |
| `system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts`, `lib/utils/skill-markdown.ts` | Modify | Parse through the shared function |
| `system-skill-advisor/mcp-server/types/better-sqlite3.d.ts`, `tsconfig.json` | Add, Modify | Local sqlite declaration |
| `system-deep-loop/runtime/scripts/fanout-run.cjs`, `tests/unit/fanout-run.vitest.ts` | Modify | Post-run refresh and its tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A GLM 5.3 Flash lane through OpenRouter did the inventory, the shared modules, the adoptions and the runner step from a prompt that named each finding and its verification; the advisor's sqlite declaration was added here when its build turned out to have been broken since the decommission; every claim was rerun before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| The shared home is the spec-kit shared package, not a new repo-wide library | Every adopter with an import edge already reaches it; a new package is a later decision |
| Deep-loop keeps its own containment | Its `canonicalPath` reads through a dangling symlink on purpose; the shared primitive does not, so unifying would weaken the guard |
| Record blocked adoptions instead of adding relative imports | A cross-skill relative path is the kind of edge the audit exists to find |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsx shared/frontmatter/parse-frontmatter.test.ts` | all assertions pass |
| Spec-kit typecheck; shared, runtime, CLI builds; advisor build; freshness | exit 0; built; built; fresh |
| Adopter suites | eleven CLI files green; three runtime files 40 of 40 after rebuild; advisor harvest 12 of 12 and scorer suites green |
| Containment | `path-containment` and `nested-changelog` 7 of 7; deep-loop `write-containment` 47 of 47 |
| Runner | `fanout-run.vitest.ts` 121 of 121; flag parses to off |
| Deep-loop typecheck | 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Ten hand-rolled parsers remain: four spec-kit `.cjs` helpers that cannot import the ESM shared package, three deep-loop `.cjs` files and the sk-doc scripts with no `@spec-kit/shared` edge, five Python parsers, and one advisor `.mjs` checker that is dependency-free by design.
- Deep-loop's containment stays separate for the dangling-symlink reason above.
<!-- /ANCHOR:limitations -->
