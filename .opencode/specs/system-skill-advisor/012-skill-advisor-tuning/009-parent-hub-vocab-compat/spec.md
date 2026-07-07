---
title: "Feature Specification: Parent-Hub Vocabulary Compatibility Measurement"
description: "Three read-only measurement assets that map the cross-hub routing-vocabulary collision surface (sk-code vs sk-design vs deep-loop-workflows on audit/review/code-audit), validate the advisor projection-surface coverage, and provide a labeled cross-hub ambiguity fixture dataset — grounding the later gated vocab-migration patch. Assets-first: no vocab, metadata, or scorer code is changed here."
trigger_phrases:
  - "parent hub vocab compatibility"
  - "cross-hub collision report"
  - "advisor projection coverage"
  - "cross-hub ambiguity fixture"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/009-parent-hub-vocab-compat"
    last_updated_at: "2026-07-07T18:33:59.000Z"
    last_updated_by: "claude-opus"
    recent_action: "009 complete: 3 read-only vocab-compat assets delivered + validated"
    next_safe_action: "Commit WU-2; gated WU-3 patches the 4 stale surfaces after reindex"
---
# Feature Specification: Parent-Hub Vocabulary Compatibility Measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `system-skill-advisor/012-skill-advisor-tuning` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor scorer's parent-hub confusion — routing "audit" / "review" / "code audit" prompts among `sk-code`, `sk-design`, and `deep-loop-workflows` — is a **half-landed vocabulary migration**, not a missing scorer feature. `deep-loop-workflows` metadata still advertises single-pass code-audit vocabulary (`code audit`, `iterative code audit`, `code-review`) that `sk-code` already owns, and the scorer carries a compensating hardcoded `codeAuditDeepReviewPenalty` propping the routing up. Two independent problems block a safe fix: (1) there is **no cross-hub collision guard** — the existing `parent-hub-vocab-sync` guard sees one hub's internal drift, never collisions *between* hubs; and (2) the guard validates only graph *trigger phrases*, while the scorer scores a much larger projected surface, so an alias can be typed in a registry yet be invisible to routing ("typed-but-unprojected"). The one measured ambiguity slice sits at **15/25 = 0.60**, the weakest area, and it measures synthetic *stability*, not empirical correctness.

### Purpose
Produce three **read-only measurement assets** that make the collision surface, the projection-coverage gap, and the empirical ambiguity baseline legible — so the later **gated** vocabulary-migration patch (WU-3) is precisely targeted and its before/after delta is measurable. This packet changes no vocabulary, no metadata, and no scorer code; it measures and recommends only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Asset 1 — `collision-report.md`**: a workspace-level cross-hub vocabulary collision matrix over `sk-code`, `sk-design`, `deep-loop-workflows`, `deep-loop-runtime`, with the classification taxonomy `allowed-shared | needs-owner | collision | demotion-candidate` and a demotion-candidate shortlist for WU-3.
- **Asset 2 — `projection-coverage.md`**: a per-mode advisor projection-surface coverage check proving whether each registry alias reaches ≥1 scorer-consumed projected field, with surface-appropriate strictness (alias strict; keyword/entity overmatch-only).
- **Asset 3 — `ambiguity-fixture.md`**: a labeled cross-hub ambiguity fixture **as a dataset** (not wired to tests), baselined at today's 15/25 = 0.60, folding in the three gold-`none` abstain prompts.
- Read-only inventory of hub vocabulary surfaces (graph-metadata.json, mode-registry.json, hub-router.json) and the advisor projection logic.

### Out of Scope
- Any edit to hub vocabulary or metadata (the gated WU-3 Layer-1b patch on `graph-metadata.json` + `mode-registry.json`).
- Any edit to advisor scorer code, including the `codeAuditDeepReviewPenalty` (gated WU-4/WU-5). `mcp_server/lib/scorer` is a live gated lane — read-only here.
- Wiring the ambiguity fixture into the test harness or recapturing the 007 ratchet baseline (gated; requires the atomic reindex).
- The coordinated advisor reindex + skill-graph recompile.

### Files to Change
Only files created **inside this packet folder**: the three asset docs plus the standard Level-2 spec docs and generated metadata. No file outside `009-parent-hub-vocab-compat/` is created or modified.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| R1 | The collision report maps every cross-hub phrase to `phrase → owning hub(s) → owner mode(s) → intent class → source surface(s) (file:line) → projected fields → classification`, using exactly the four-class taxonomy, and classifies shared-infra terms as `allowed-shared` to suppress noise. |
| R2 | The collision report names the demotion-candidate shortlist — the exact stale phrases + every authored source surface (`file:line`) WU-3 must rewrite/remove — and flags that all source surfaces must move in one change, or a reindex re-derives the stale phrases from whichever surface was missed. (The report is the authoritative surface enumeration; it found more than the two originally assumed.) |
| R3 | The projection-coverage check inventories every scorer-consumed projected field (with `file:line`) and, per mode, asserts each registry alias reaches ≥1 consumed field or carries a documented exemption; it flags any typed-but-unprojected alias. |
| R4 | The ambiguity fixture is a labeled dataset with the research's cross-hub families, each row carrying `prompt`, `gold hub`, and `ambiguousWith`; it records the 15/25 = 0.60 baseline anchor and folds in the three gold-`none` abstain prompts. Its test-wiring is explicitly deferred (gated). |
| R5 | Every load-bearing anchor is source-truth (`file:line`) and carries the caveat that the advisor runs a compiled `dist`; pins are re-verified at authoring time and must be re-verified again at gated-patch time. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All three asset docs exist, are evidence-anchored, and internally consistent.
- The collision report identifies the stale deep-loop surfaces and a demotion shortlist WU-3 can act on directly.
- The projection-coverage check states the concrete per-mode guard assertions a future (gated) coverage guard would add.
- The ambiguity fixture is usable as-is as a labeled dataset once its harness wiring is unblocked.
- `validate.sh <folder> --strict` → Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Source-truth ≠ runtime-truth (advisor runs stale `dist`). | Every asset states the caveat; WU-3 re-verifies pins before patching. |
| Mutable-JSON line drift across sessions. | Phrase content is the invariant; pins are re-verified live and marked approximate. |
| Collision report goes noisy without shared-infra classification. | The `allowed-shared` class is mandatory for compatible shared terms. |
| Flagging deep-loop's legitimate review-loop vocab as stale. | Only bare/single-pass code-audit phrases are demotion-candidates; `deep-review`, `review loop`, `convergence review` are preserved. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Read-only**: no writes outside this packet folder; no `mcp_server` writes; no indexing/daemon mutation.
- **Deterministic**: assets are derived from static source inspection, reproducible from the cited anchors.
- **Auditable**: each asset ends with a coverage note listing what was actually read.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Shared-infra collisions** (`workflowmode`, `backendkind`, `mode-registry`) — must be classified `allowed-shared`, never reported as real collisions.
- **Legitimate deep-loop review vocab** — `deep-review` / `review loop` / `convergence review` are the iteration workflow's own terms and must survive the demotion shortlist.
- **Degraded projection fallback** — the coverage check must note that a healthy projection source (not the SQLite-failure filesystem fallback) is a precondition for trusting recaptured numbers.
- **Entity-shaped surfaces** — file paths and doc names would over-match as user aliases; keyword/entity surfaces get overmatch checks only, not mandatory alias-typing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

**Level 2.** Documentation and data artifacts only; no code, no new TypeScript, no test wiring. Complexity is in the cross-hub inventory accuracy and the classification judgment, not in implementation.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Fixture test-wiring** — RESOLVED: deferred to the gated window; wiring the labeled fixture into the harness requires the atomic reindex + 007 ratchet recapture (WU-3), so this packet ships the dataset only.
- **Which demotion-candidates actually get patched** — deferred to WU-3, where the shortlist is re-verified live and applied to both source surfaces together.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../` (`system-skill-advisor/012-skill-advisor-tuning`)
- **Assets**: `collision-report.md`, `projection-coverage.md`, `ambiguity-fixture.md`
- **Downstream (gated)**: WU-3 Layer-1b vocab patch on `deep-loop-workflows/{graph-metadata.json,mode-registry.json}`
- **Scorer projection source**: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`
