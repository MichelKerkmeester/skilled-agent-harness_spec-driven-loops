---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Added z_future to the backfill walk exclusion set so a default run unconditionally skips the staging area, corrected the header comment, and rebuilt the dist. collectSpecFolders now returns zero z_future folders where it previously crashed, z_archive parity is preserved at 858 folders by default and zero under --active-only, and a default dry-run exits clean. A z_future-exclusion test is recorded as a follow-up."
trigger_phrases:
  - "z future always ignored"
  - "backfill graph metadata exclusion"
  - "excluded dirs z future"
  - "z archive parity preserved"
  - "backfill dist rebuild"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/032-z-future-always-ignored"
    last_updated_at: "2026-07-06T18:49:40.532Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added z_future to EXCLUDED_DIRS, rebuilt dist, verified parity"
    next_safe_action: "Add a z_future-exclusion case to the backfill test"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
      - ".opencode/skills/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-22 |
| **Branch** | `system-speckit/029-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A scoped fix to the graph-metadata backfill generator. The generator walks the specs tree and refreshes each packet folder. Its walk pruned `z_future` only under the `--active-only` flag, so a default run descended into the staging area and the parser threw `Spec folder is not under a supported specs root` at the refresh site. The descent also let the walk over-reach into a tree the generator was never meant to touch.

The fix adds `z_future` to the `EXCLUDED_DIRS` set the walk already consults at every directory boundary. With `z_future` in that set the walk prunes the staging area unconditionally, before any folder inside it reaches the refresh path, so the parser is never handed a non-specs-root folder. The header comment was corrected to state that `z_future` is always skipped while `z_archive` stays included by default and skippable via `--active-only`. The dist was rebuilt via tsc so the compiled output carries the same exclusion as the source.

`z_archive` was deliberately left out of the unconditional set. It stays included by default and skippable via `--active-only`, exactly as before, because `z_archive` holds real archived packets that the backfill is meant to refresh while `z_future` is a staging area that is not a supported specs root.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change is one entry added to a set and one corrected comment in `backfill-graph-metadata.ts`, followed by a tsc rebuild of `backfill-graph-metadata.js`. No new conditional was threaded through the walk, since the walk already prunes on `EXCLUDED_DIRS` at each directory boundary, so naming `z_future` in that one set is enough to make the skip unconditional and to keep every always-skipped directory listed in a single place.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Exclude at the set, not with a new flag check.** Adding `z_future` to `EXCLUDED_DIRS` makes the skip unconditional and keeps all always-skipped names in one place, rather than threading another `--active-only`-style conditional through the walk.
- **Leave z_archive untouched.** `z_archive` holds real archived packets the backfill should refresh, so it stays included by default and skippable via `--active-only`. Only `z_future`, a staging area, becomes unconditional.
- **Rebuild the dist in the same change.** The runtime loads the compiled dist, so a source-only edit would leave the crash live. The tsc rebuild ships the fix where it runs.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `collectSpecFolders('.opencode/specs')` now returns zero `z_future` folders and raises no error, where it previously threw the not-a-supported-specs-root error.
- `z_archive` parity is preserved, 858 folders included by default and zero under `--active-only`.
- A default `backfill --dry-run` exits 0 with no `z_future` or supported-specs-root mention in its output.
- The rebuilt dist carries `z_future` in the exclusion set, matching the corrected source.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No dedicated z_future-exclusion test.** The existing test `.opencode/skills/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts` covers `z_archive` inclusion but has no `z_future`-exclusion case. A follow-up should add one so a regression that re-admits `z_future` is caught by the suite, not only by a manual run.
- **The fix targets the default walk over a real specs root.** A caller pointing the root directly at `z_future` is out of scope, since that is not how the backfill is invoked.
<!-- /ANCHOR:limitations -->
