---
title: "Implementation Summary: Parent-Hub Vocabulary Compatibility Measurement"
description: "Summary of the three read-only measurement assets delivered — cross-hub collision report (4 stale surfaces, 4 demotion candidates, 0 symmetric collisions), advisor projection-surface coverage (38 typed-but-unprojected aliases, guard checks 0), and a labeled cross-hub ambiguity fixture dataset (baseline 15/25 = 0.60). Read-only; grounds the gated WU-3 vocab patch."
trigger_phrases:
  - "parent hub vocab compat summary"
  - "cross-hub measurement assets summary"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/009-parent-hub-vocab-compat"
    last_updated_at: "2026-07-07T18:33:59.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Delivered 3 assets + scaffold; validated Errors 0; registered under parent"
    next_safe_action: "Commit WU-2; then gated WU-3 vocab patch on the 4 source surfaces"
---
# Implementation Summary: Parent-Hub Vocabulary Compatibility Measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Type** | Read-only measurement assets (no code, no vocab change) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Three read-only measurement assets that make the parent-hub vocabulary problem legible, plus the Level-2 scaffold. No vocabulary, metadata, or scorer code was changed.

**Asset 1 — `collision-report.md`** (cross-hub collision matrix over sk-code / sk-design / deep-loop-workflows / deep-loop-runtime):
- Classifications: `needs-owner` = 2 (bare `audit`, bare `review`); `demotion-candidate` = 4 (`code review`, `code audit`, `iterative code audit`, `code review loop`); `allowed-shared` ≈ 6 phrases; **`collision` = 0**.
- The zero-collision result is itself the finding: every disputed code phrase flows **unidirectionally** `deep-loop → sk-code` — the signature of a half-landed migration, not a symmetric collision. Corroborated by deep-loop's own doctrine, which already defers single-pass review to sk-code (`deep-review/SKILL.md:37`, `:447`) while its routing aliases still grab `code audit`.
- **Scope expansion for WU-3:** the stale vocabulary lives on **four** source surfaces, not two — `mode-registry.json:70`, `hub-router.json:60`, `graph-metadata.json` authored `domains`/`intent_signals` (`:50`/`:64`), **and** the SKILL.md keyword blocks that *derive* `trigger_phrases`. Editing the derived `graph-metadata.json:79/82` alone is futile; a reindex re-derives the stale phrases. All source surfaces must move in one change.

**Asset 2 — `projection-coverage.md`** (per-mode alias→projected-field coverage over the scorer surface):
- Consumed projected fields re-pinned: `intentSignals` (`projection.ts:232`), `keywords` (`:230`), `derivedTriggers` (`:213`), `derivedKeywords = key_topics ∪ key_files ∪ source_docs` (`:216`) — consumed by `explicit.ts:327` / `derived.ts:62`.
- Structural finding: `derived.entities` are typed as objects and filtered to strings-only by `sanitizeDerivedMetadata` (`metadata-sanitizer.ts:60-67`), so the entity surface is effectively empty.
- **Typed-but-unprojected gap:** of 155 aliases, **38 reach no projection phrase anchor** (10 rescued only by a hardcoded `explicit.ts` boost table; 28 genuinely dark, e.g. `comment hygiene check`, `container queries`, `hover state`, `benchmark a skill`). The existing guard checks **0 of 38** against the scorer surface (`parent-hub-vocab-sync.cjs:130-137`, `:397-403`), because it reads only trigger phrases.

**Asset 3 — `ambiguity-fixture.md`** (labeled cross-hub ambiguity dataset):
- 25 labeled cross-hub rows across 7 families (single-pass code audit → sk-code; iterative review loop → deep-loop; design/accessibility audit → sk-design; quality gate → sk-code; runtime internals vs workflow invocation; under-specified abstain; eval-of-recommendation → review), each with `gold_hub` + `ambiguousWith`.
- A gold-`none` abstain slice (3 representative rows, flagged for reconciliation with 008's `mcp-chrome-devtools` flip-ids at wiring).
- Baselined at today's 15/25 = 0.60; metrics defined (top-1, top-2 margin, `ambiguousWith`, strict-abstain). Test-wiring is gated (WU-3).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

- The two inventory-heavy assets (collision report, projection-coverage) were built by two **parallel read-only sub-agents** with pre-verified anchors; each wrote exactly one asset file and touched no code or vocabulary. Scope was verified post-hoc: no `mcp_server` or hub-vocabulary file changed.
- The fixture and the Level-2 scaffold were authored directly from the 3×10 deep-research + 10-angle deep-review synthesis.
- All anchors were re-verified live against the working tree; both agents corrected minor line pins (e.g. `intentSignals` at `:232` not `:231`; runtime `executor-audit` at `:104`) and found surfaces the original anchors omitted (`hub-router.json:60`; the SKILL.md derivation blocks).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Assets-first, code-last.** Measure the collision + coverage + ambiguity baseline before any vocabulary edit, so WU-3's before/after delta is real.
- **Read-only.** No vocabulary, metadata, or scorer change here; `mcp_server/lib/scorer` is a live gated lane.
- **Fixture ships as a dataset.** Its harness wiring + the 007 ratchet recapture require the atomic reindex, so this packet ships labels only.
- **Report is the authoritative surface list.** The spec defers to `collision-report.md` for the demotion shortlist rather than duplicating it, after the report found more surfaces than originally assumed.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- Both agent assets verified for scope discipline: `git status` shows no change to `mcp_server` or any of the four hubs' vocabulary files.
- Both asset files well-formed (H1, evidence-anchored, coverage notes present).
- `validate.sh <folder> --strict` → **Errors: 0** (3 non-blocking warnings inherent to a lean docs/data packet); metadata generated + registered under the 012 parent (`children_ids` + `last_active_child_id`).
- Internal consistency: all three assets share one hub-ownership basis (sk-code = single-pass code review/quality; sk-design = design/accessibility audit; deep-loop = iterative review loop).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **Source-truth, not runtime-truth.** Anchors point at `.ts`/`.json`/`.md` source; the advisor runs a compiled `dist`. All pins must be re-verified at gated-patch time.
- **Baseline will move.** Correcting the vocabulary will shift the 193-row and 15/25 baselines; WU-3 recaptures explicitly and intentionally.
- **Fixture gold-`none` rows are representative.** The exact three 008 flip-ids must be imported at wiring time.
- **No runtime measurement here.** No prompt was scored; accuracy numbers are established at gated wiring against a healthy (non-degraded) reindex.
<!-- /ANCHOR:limitations -->
