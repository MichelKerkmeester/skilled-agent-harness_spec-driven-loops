---
title: "Implementation Summary: Code Graph — Generation Watermark (Q6-C2 → Q6-C1)"
description: "Forward-looking implementation summary for the staged code-graph generation watermark. Planning is complete; no code is implemented yet — Q6-C2 is ready-to-implement and Q6-C1 is DEFER-speculative."
trigger_phrases:
  - "code graph generation watermark implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/003-generation-watermark"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 spec/plan/tasks/checklist; implementation not started"
    next_safe_action: "Implement Q6-C2 (T006-T010): bump at handlers/scan.ts scanPromotable block"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-003-generation-watermark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Code Graph — Generation Watermark (Q6-C2 → Q6-C1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/002-code-graph/003-generation-watermark |
| **Completed** | Not started (planning only — 2026-06-19) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet — this phase is a re-plan. The planning resolved the two staged generation-watermark candidates and corrected a refuted bump-site claim from the research sketch, so an implementer can land Q6-C2 directly and revisit Q6-C1 only once a consumer exists.

### Q6-C2 — Soft generation watermark (ready-to-implement, PENDING)

Once built, every promoted scan will advance a monotonic `generation` counter stored in the existing `code_graph_metadata` KV table, and that integer will ride the freshness envelope returned by `code_graph_context`. Callers gain an as-of-generation key they can compare across reads, while the read path stays byte-identical — no filter change, no error gate, no schema migration. The bump lives in the `scanPromotable` finalize block in `handlers/scan.ts` so it fires for both full and selective reindexes, unlike the originally-sketched `ensure-ready.ts:497` site.

### Q6-C1 — Hard as-of-generation gate (DEFER-speculative, PENDING)

The hard gate would turn a stale read into an explicit ERROR rather than silently-stale edges ("a successful call is itself proof of freshness"). It is deferred: no named consumer wants as-of/time-travel reads today, and its safety is largely redundant with the shipped binary readiness gate. It is kept on the books because the monotonic counter Q6-C2 introduces is the close-out key the Q1-C1 bi-temporal cluster needs (today's close-outs would key on a non-monotonic timestamp).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-code-graph/mcp_server/lib/code-graph-db.ts` | Modify (planned) | Add `getCodeGraphGeneration()` / `bumpCodeGraphGeneration()` over `code_graph_metadata` |
| `system-code-graph/mcp_server/handlers/scan.ts` | Modify (planned) | Bump generation in the `scanPromotable` finalize block |
| `system-code-graph/mcp_server/lib/code-graph-context.ts` | Modify (planned) | Add `generation` to the freshness envelope + stamp it in `computeFreshness()` |
| `system-code-graph/mcp_server/lib/*.vitest.ts` | Create (planned) | Increment / unset / non-promoting / envelope-carries-counter tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Delivery plan: implement Q6-C2 behind no flag (additive and reversible), prove a byte-identical node/edge result set against a captured baseline, and verify the counter advances across two scans and stays put on a non-promoting scan. Q6-C1 ships only with the Q1-C1 cluster decision.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bump at the `handlers/scan.ts` `scanPromotable` block, not `ensure-ready.ts:497` | The `:497` site is `setLastGitHead` inside the out-of-scope-HEAD return-fresh branch — it never fires on a real `full_scan`/`selective_reindex`. The finalize block is the one site that fires for both (research iter-23/24). |
| Store the counter in `code_graph_metadata`, not a new column | The KV table already exists with an int-as-string precedent, so Q6-C2 stays off the schema migration chokepoint and ships independently of Q1-C1. |
| Defer Q6-C1 rather than build it now | No named consumer wants as-of-generation reads, and the hard gate's safety is redundant with the shipped readiness gate (synthesis `01`/`04`). |
| Keep Q6-C1 on the books | Its counter is the monotonic close-out key the Q1-C1 bi-temporal cluster needs; dropping it would orphan that dependency. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this folder | PENDING (run after authoring) |
| Q6-C2 unit/integration tests | NOT RUN (not implemented) |
| Byte-identical node/edge result set | NOT VERIFIED (baseline to capture at implementation) |
| PENDING-status cross-check vs 030 §14 + `git log 1ecc531431..ab5459fb6d` | PASS — only code-graph Wave-0 commit is `e21caf5de6` (Q4-C1); Q6 pair absent |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Q6-C2 not implemented.** This is a planning artifact; the counter, bump, and envelope field do not exist yet (grep for `graph_generation` returns zero hits).
2. **Q6-C1 deferred indefinitely.** The hard as-of-generation error gate is DEFER-speculative — it ships only on a named-consumer decision plus the Q1-C1 bi-temporal cluster (`SCHEMA_VERSION` 5→6).
3. **Live line numbers drift.** The cited seams (`handlers/scan.ts` ~`:666-679`, `code-graph-context.ts:52`/~`:320`) must be re-confirmed at implementation time; they were verified against the source on 2026-06-19.
<!-- /ANCHOR:limitations -->
