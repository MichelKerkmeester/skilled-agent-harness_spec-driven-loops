---
title: "Implementation Summary: activate the persistent styles database (build, shadow, prove, flip)"
description: "Built the persistent styles database: first full-corpus generation of 1,290 styles published to a git-ignored install-time/prewarm database, shadow parity 10/10, §9 perf gate measured at ~21x. Default stays legacy; the cutover is human-gated."
trigger_phrases:
  - "persistent styles db activation summary"
  - "first generation shadow parity perf summary"
  - "wire override built cutover human-gated"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/007-persistent-db-activation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "implementer"
    recent_action: "Built + published the first generation; shadow parity 10/10."
    next_safe_action: "Wire install-time prewarm; operator decides the default flip."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/schema.mjs"
      - ".opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/operator.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-dbbuild-impl-session"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: activate the persistent styles database (build, shadow, prove, flip)

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-persistent-db-activation |
| **Status** | IMPLEMENTED — build + parity + perf proven; cutover human-gated |
| **Shipped** | commit `c4bfba4359` on `skilled/v4.0.0.0` |
| **Level** | 2 |
| **Verification** | shadow parity 10/10, DB aggregator 69/69, §9 perf 95.3%/1097 ms MET |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The persistent styles database is now real and wired to the restructured tree — built over all 1,290 styles, published, queryable, parity-proven, and dramatically faster — with the default read path kept `legacy`.

- **First full-corpus generation:** `buildStyleDatabase` over `library/bundles/` produced a **69.75 MB** SQLite generation (4.8 s build, 613 MB RSS), integrity/FK/generation-hash validated, published via the pointer into the git-ignored `database/`. Never committed (install-time/prewarm).
- **Full lifecycle wired:** `operator.mjs {build,status,cutover,rollback}` (prewarm / monitor / flip / kill-switch) + `SK_DESIGN_STYLE_DB_MODE` (`legacy`/`shadow`/`persistent`, default `legacy`).
- **One code fix:** `schema.mjs` `DEFAULT_STYLE_DATABASE_PATH` now resolves from `paths.mjs` `DATABASE_ROOT` (the restructure moved DB source to `lib/database/` but never re-homed the DB data default) — this is what made persistent lookups find the published generation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `styles/lib/database/schema.mjs` | Modified | DB data default → `DATABASE_ROOT` (git-ignored `database/`) |
| `styles/database/` | Populated (git-ignored) | The 69.75 MB generation + pointer — never committed |
| `styles/lib/database/.gitignore` | (guard) | Prevents stray DB artifacts in the source tree |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran `buildStyleDatabase({ corpusRoot: BUNDLE_ROOT })` to publish the first generation, then verified persistent queries + shadow parity + the perf trace directly against the real corpus. A stray DB file created by the pre-fix default (in the source dir) was deleted; the generation lives only in git-ignored `database/`. The `001-foundation` machinery (indexer, operator CLI, generation manifest, oracle) was consumed as-is — this packet activated it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Install-time/prewarm distribution confirmed by the size | The 69.75 MB generation is 12× the retrieval manifest — a regenerating 70 MB binary must never be committed |
| DB data default homed at `DATABASE_ROOT` | The restructure moved DB source but not the data default; persistent lookups need `database/`, not the source dir |
| Default stays `legacy`; the flip is the operator's | The §9 cutover gates require human relevance judgments + a real-trace perf confirmation — no autonomous flip |
| Parity via `compareQueryResults` in shadow | 10/10 identical results proves the persistent DB is a drop-in, faster replacement |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| First full-corpus generation published | PASS — 69.75 MB, `operator.mjs status` → published:true |
| Persistent queries on the real corpus | PASS — 10/10 return results |
| Shadow parity (facade DTO) | PASS — 10/10 identical to legacy |
| DB aggregator incl. 69/69 Phase-0 | PASS — `node --test tests/database/index.mjs` 69/69 |
| §9 perf gate (measured) | MET — p95 1150→53 ms = 95.3% and 1097 ms (≥30% AND ≥25 ms) |
| Regression across the styles + mode suites | PASS — styles 89/89, modes 22/25/21/23 |
| Default read path | `legacy` — unchanged; no flip committed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Cutover is human-gated (by design).** The default flip awaits the operator confirming the §9 perf gate on a real representative trace + authoring relevance judgments (though shadow parity 10/10 means results already match legacy). Flip via `SK_DESIGN_STYLE_DB_MODE=persistent` after `operator.mjs build` prewarms a fresh checkout; revert via `operator.mjs rollback`.
- The perf trace is my 10-query representative set, not the operator's real workload — the ~21× is indicative; the operator confirms materiality on their trace.
- The incremental-watcher half of extraction reconciliation is deferred; a full `operator.mjs build` already reconciles authoritatively.
<!-- /ANCHOR:limitations -->
