---
title: "Implementation Summary: Program-Surface Leftovers"
description: "The four in-scope findings no sibling phase owned were closed: a least-privilege token grant on the routing workflow, the feature catalog corrected to distinguish twelve modes from eleven packets, a deprecation banner on the off-serving-path derived-sync writer, and the parent-spec baseline-ordering wording aligned to the phase map."
trigger_phrases:
  - "program surface leftovers summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/019-program-surface-leftovers"
    last_updated_at: "2026-07-30T15:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed four program-surface leftovers"
    next_safe_action: "Proceed to phase 018"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/019-program-surface-leftovers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The routing workflow's live CI run under the narrowed grant is operator-gated (no push in this program)"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Program-Surface Leftovers

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Level** | 2 |
| **Completion** | 100% — four leftover findings closed by decision, each verified by its own check |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The four findings that touch surfaces this program built or edited, and that no sibling phase owned, closed by decision rather than by omission.

### Least-privilege token grant (REQ-001)

`routing-registry-drift.yml` declared no `permissions:` block, so its jobs inherited whatever the repository default token grant is — wider than read-only test runners need. A top-level `permissions: { contents: read }` now declares the least privilege the jobs actually use (checkout plus read-only gates). The live CI run confirming the jobs still pass under the narrowed grant is operator-gated (this program does not push); the change is landed and correct.

### Feature catalog — modes versus packets (REQ-002)

`sk-doc/feature-catalog/feature-catalog.md` described the hub as resolving "one of twelve packets", implying a one-to-one mode↔packet mapping. Read against the live `mode-registry.json`, the hub has **twelve workflow modes across eleven packets**: the `sk-create-skill` packet backs two modes (`sk-create-skill` and `sk-create-skill-parent`). Three statements in the catalog were corrected to state that relationship, so a reader routing by it reaches the right target.

### Deprecated derived-sync writer (REQ-003)

`system-skill-advisor/mcp-server/lib/derived/sync.ts`'s `syncDerivedMetadata` still advertised a full-object `SkillDerivedV2` write path though it is off the serving path. A caller search found **no production importer** — only two test files. Rather than remove it and ripple into those tests, an accurate `@deprecated` banner now states it is not the authoritative derived producer, is off the serving path, and is retained only for its existing tests, so no caller depends on a shape it will not honour.

### Baseline-ordering wording (REQ-004)

The parent spec's REQ-001 acceptance criteria read that the baseline is "recorded before Phase 1 begins", while the phase map places baseline capture at Phase 2 (Phase 1 is the non-routing derived-authority decision). The wording now reads consistently with the map — captured at Phase 2, ahead of every gate/delete/migration/rewire — and a re-read of the parent spec found no other requirement contradicting the map.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/routing-registry-drift.yml` | Modified | Explicit `permissions: contents: read` |
| `sk-doc/feature-catalog/feature-catalog.md` | Modified | Twelve modes over eleven packets, not twelve packets |
| `system-skill-advisor/mcp-server/lib/derived/sync.ts` | Modified | `@deprecated` banner on the off-serving-path writer |
| `033.../spec.md` (parent) | Modified | REQ-001 baseline-ordering wording aligned to the map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix was verified by its own check, not by inspection (REQ-005): the catalog was corrected against the live `mode-registry.json` (12 modes / 11 packets confirmed by count), the writer against a caller search (no production importer), the workflow by a YAML parse confirming the `permissions` block, and the wording by re-reading the parent spec for remaining contradictions (none). The workflow edit sequences after phase 014's edit to the same file, so it lands cleanly on top.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document the derived-sync writer rather than delete it | No production caller reaches it, but two tests import it; a `@deprecated` banner is lower-blast than removing the module and rewriting the tests, and still stops a caller depending on it |
| Correct the catalog against the live registry, not the prose | The registry is ground truth: 12 modes over 11 packets, one packet backing two modes |
| Declare `contents: read` as the least grant | The jobs only check out and run read-only gates; a narrower grant than the repo default is the right default |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Workflow permissions declared | `yaml.safe_load` shows `permissions: {contents: read}` |
| Catalog matches the live registry | `mode-registry.json` has 12 modes / 11 packets; `sk-create-skill` backs 2 modes; no "twelve packets" text remains |
| Writer has no production caller | a repo search finds only two test importers of `derived/sync` |
| Parent-spec wording consistent | REQ-001 now names Phase 2; no other requirement contradicts the map |
| `validate.sh <this-folder> --strict` | Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The workflow's live CI run under the narrowed grant is operator-gated.** REQ-001 asks a CI run to confirm the jobs still pass under `contents: read`; a GitHub Actions run needs a push this program forbids. The grant is landed and correct, and the jobs only read, so the narrowing is safe by inspection — the live confirmation is left for the operator after the branch is pushed.
2. **The derived-sync writer is documented, not removed.** Removing it and its two test importers is a larger change deferred as an operator preference; the deprecation banner closes the misleading-advertisement finding in the meantime.
<!-- /ANCHOR:limitations -->
