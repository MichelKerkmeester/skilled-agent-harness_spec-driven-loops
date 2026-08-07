---
title: "Implementation Summary: sk-design styles library restructure + kebab rename"
description: "Shipped the styles-library restructure: 17 modules + 1,290 bundles relocated into a shallow ownership tree across three green mixed states, byte-parity manifests, database/ git-ignored. Two restructure regressions caught + fixed. Checkpoint B deferred."
trigger_phrases:
  - "styles library restructure summary"
  - "g1 g2 g3 shipped byte parity summary"
  - "database git-ignored restructure summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/006-library-restructure"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "implementer"
    recent_action: "Restructure complete: G1-G3 + fixed 2 md-generator consumers."
    next_safe_action: "Checkpoint B (manifest v2) deferred; not needed for Packet A."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/paths.mjs"
      - ".opencode/skills/sk-design/styles/lib/engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/schema.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-restructure-impl-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: sk-design styles library restructure + kebab rename

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-library-restructure |
| **Status** | COMPLETE (restructure G1-G3; Checkpoint B deferred) |
| **Completed** | 2026-07-21 — commits `02481e1ec3`, `b8732ba436`, `cee62570e4`, `3cd7d67fb8` |
| **Level** | 2 |
| **Verification** | styles aggregators 89/89 + four mode suites 22/25/21/23 green; manifests byte-identical |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The flat, underscore-prefixed styles library was moved into a shallow ownership tree — `library/` (committed data), `lib/engine` + `lib/database` (source), `scripts/` (extractor), `tests/`, `docs/`, and the git-ignored `database/` — through three green mixed states with byte-identical retrieval throughout.

- **G1 (MIXED A):** added `lib/paths.mjs` as the single path seam (roots + manifest paths/filenames + DATABASE_ROOT) and sourced the engine + indexer defaults from it.
- **G2 (MIXED B):** `git mv` of the 17 modules (`_engine`→`lib/engine`, `_db` core→`lib/database`), tests/oracle→`tests/`, extractor→`scripts/`; rewired every cross-directory import including the four `design-*/corpus` consumers.
- **G3:** `git mv` of the 1,290 bundles→`library/bundles/`, crawl manifest co-located, retrieval manifest→`library/manifests/`; kebab renames; `database/*` git-ignored; the default retrieval load decoupled to the manifest's own dir.

### Files Changed

| Area | Action | Purpose |
|------|--------|---------|
| `styles/lib/paths.mjs` | Created | The one new source module — the path seam |
| `styles/lib/{engine,database}/**` | Moved | 17 modules relocated 1:1 (filenames + exports preserved) |
| `styles/{tests,scripts,docs}/**` | Moved | Tests, oracle, extractor, docs |
| `styles/library/{bundles,manifests}/**` | Moved | 1,290 bundles + both manifests (byte-parity) |
| `styles/database/` | Created | Git-ignored mutable DB state (README + .gitignore tracked) |
| four `design-*/corpus/**` + md-generator backend | Modified | External consumer imports + hardcoded styles paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Executed in the `0093-sk-design-012-gap-research` worktree, one commit per mixed state, each gated on both styles aggregators + the four mode-corpus suites staying green. G2 and G3's bulk moves were run by focused subagents against a precise map, then independently re-verified (all six suites + byte-parity sha) before commit. Two restructure regressions were caught by the gates and fixed as follow-on commits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| RESTRUCTURE layout governs (`lib/database/` source, `database/` mutable) | Clean source/state split; the naming map's `_db→database` folds in as the mutable-dir home |
| Crawl manifest co-located with bundles at `library/bundles/` | Preserves `scanCorpus`'s corpus-root invariant — no engine refactor for the crawl read |
| Retrieval-manifest containment resolves against its own dir | The retrieval manifest now lives outside the bundle corpus; the three default loads drop `corpusRoot` so the guard checks its real home |
| Checkpoint B deferred | Manifest v2 + projector is a schema-evolution enhancement, deferrable per the completion criteria, and not needed by Packet A |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both styles aggregators at G1/G2/G3 | PASS — 89/89 at each mixed state |
| Four mode-corpus suites | PASS — 22/25/21/23 (identical to pre-move baseline) |
| Manifest byte-parity at Checkpoint A | PASS — `sha256` MATCH for both manifests |
| Production default path on the real corpus | PASS — `runBuild --check` OK, `runQuery` default → 5 cards |
| `database/*` git-ignored except README | PASS — `git check-ignore` on `*.sqlite`; README + .gitignore tracked |
| `validate.sh --strict` on this packet | PASS — Errors:0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Checkpoint B deferred** (manifest v2 + shared projector, then drop `retrieval-manifest.json`) — a follow-on enhancement; the retrieval + crawl manifests remain distinct files, which is fully functional.
- The md-generator backend `tsc`/test run is env-limited (backend `node_modules` absent); the two consumer path fixes are verified against on-disk targets and a clean repo-wide stale-ref sweep, but a full backend typecheck awaits an install.
- Two restructure regressions were introduced-and-fixed within this session (the DB data default; the two md-generator consumers) — both caught by the correctness gates, a reminder the external-consumer surface was wider than first scoped.
<!-- /ANCHOR:limitations -->
