---
title: "Implementation Summary: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "Planning-stage placeholder summary for C4-B. The candidate is PENDING behind the schema-migration gate; nothing is implemented yet. This file records the not-started status, the shipped dependency, and what completion will look like, and is replaced with the real delivery narrative once the build lands."
trigger_phrases:
  - "C4-B implementation summary"
  - "derived_id status"
  - "content-addressed causal edge summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/009-009-derived-id-provenance"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning-stage placeholder; C4-B not yet implemented"
    next_safe_action: "Begin T002-T003 (read seams, freeze the recipe)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-c4b-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/001-speckit-memory/009-009-derived-id-provenance` |
| **Completed** | NOT STARTED (planning-stage) |
| **Level** | 3 |
| **Candidate status** | PENDING — gate: schema-migration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This is the planning re-plan for candidate **C4-B** (content-addressed `derived_id` for derived causal artifacts). The candidate is PENDING behind a schema-migration gate; this file is a placeholder that will be replaced with the real delivery narrative once the build lands. It exists now only because a Level-3 packet requires it.

When implemented, C4-B will give derived (generated) causal edges a content-addressed `derived_id = sha256(canonical-triple + source + rule_version)` — an additive `TEXT UNIQUE` rowid-alias key, anchors included — so a crash-replay or tombstone-restore reconstructs the identical artifact id, and a `rule_version` change becomes visible to identity instead of silently re-using the prior row.

### Planned scope (not yet delivered)
- A derived-artifact id helper in `lib/content-id.ts` that reuses the shipped `hashCanonicalJson` primitive.
- An additive `derived_id TEXT UNIQUE` column + unique index + migration + `SCHEMA_VERSION` bump on `causal_edges`, with an anchor-safe backfill.
- Derived-edge write-path wiring in `lib/storage/causal-edges.ts`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Pending | No production code has been modified; planning docs only |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The plan is one additive, reversible schema slice: freeze the canonical-field recipe (anchor-inclusive triple + source + rule_version + kind-tag), reuse the shipped content-id module, land the additive column + index + anchor-safe backfill behind one `SCHEMA_VERSION` bump, wire the derived-edge write path, and prove identity stability + a clean migration on a real DB copy before strict validation. The single shipped dependency — the two-primitive content-id module — is already in place (030 commit `18c8582e33`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `hashCanonicalJson` from `lib/content-id.ts`, not a new hash | The module exists to centralize the formula; a third hash is the anti-pattern it prevents (ADR-005) |
| `derived_id` input includes anchors | The legacy anchor-inclusive UNIQUE rejects an anchor-less backfill — the single most-cited C4-B caveat (ADR-002) |
| `TEXT UNIQUE` rowid alias, not `AUTOINCREMENT` | A monotonic counter cannot be content-addressed; restore must reproduce the same id (ADR-004) |
| Keep C4-B independent of the bi-temporal C3-B cluster | The add is confirmed clean-additive; C3-B additivity is unverified (ADR-001) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Planning docs strict validation | PASS target — `validate.sh --strict` on this packet (planning stage) |
| Implementation (helper, migration, write-path) | NOT RUN — pending build |
| Identity stability + rule_version distinctness tests | NOT RUN — pending (T008/T009) |
| Real-DB-copy migration / backfill-no-reject test | NOT RUN — pending (T010) |
| Memory MCP typecheck + build + focused suite | NOT RUN — pending (T011) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** C4-B is PENDING behind the schema-migration gate; this summary is a planning placeholder and will be rewritten at completion.
2. **Recipe not yet frozen.** The canonical-field order, kind-tag, `source` definition, and legacy `rule_version` sentinel are Proposed (ADR-002/ADR-003), not finalized.
3. **No measured benefit number.** Per the 028 research, all leverage/effort are structural inference; C4-B ships for correctness (crash-replay idempotency + rule-version provenance), not a benchmarked delta.
4. **Causal edges only.** Other derived artifact stores are explicitly out of scope ("causal edges first").
<!-- /ANCHOR:limitations -->
