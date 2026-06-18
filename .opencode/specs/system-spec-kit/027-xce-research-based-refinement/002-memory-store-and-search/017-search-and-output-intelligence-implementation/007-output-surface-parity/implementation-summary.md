---
title: "Implementation Summary: Phase 7 output-surface-parity [template:level_1/implementation-summary.md]"
description: "Made /memory:search output comparable across models and surfaces: one score, one scale, one name, mandated on every surface."
trigger_phrases:
  - "output surface parity"
  - "similarity score mandate"
  - "memory search contract"
  - "cross-model render consistency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-017/007-output-surface-parity"
    last_updated_at: "2026-06-17T08:40:00Z"
    last_updated_by: "contract-engineer"
    recent_action: "Mandated similarity-only render + surface-parity clause"
    next_safe_action: "Run live cross-model A/B render-consistency probe"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit/027-017/007-output-surface-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which single metric governs rendered output? similarity, 0–1, two decimals, on every surface."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-output-surface-parity |
| **Completed** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The same retrieval result used to render differently depending on which model answered: DeepSeek showed `confidence 0.36` while Kimi showed `similarity 0.68` for the identical row, so two surfaces could not be compared or diffed. This phase closes that gap by making the `/memory:search` contract mandate one score, one scale, and one name on every surface, and by naming the slots and optional fields that may appear so their presence is never left to model latitude.

### One score, one scale, one name

The contract now mandates `similarity`, on a 0–1 scale, rendered to two decimals, as the sole ranking metric per row. `confidence` and any percentage score are explicitly banned in rendered output; a percentage-scaled value must be divided by 100 before it is emitted (`79.44` → `0.79`). This turns the previous soft "render as 0–1 two decimals" hint into a hard mandate plus an explicit ban, so a row like DeepSeek's `confidence 0.36` is now contract-violating rather than tolerated.

### Five mandatory core slots

The five core slots — query echo, similarity, id, title, and the STATUS footer carrying RESULTS and INTENT — are now non-optional and individually named in both the router and the presentation asset. The only omission path is the empty-result fallback. The render self-check was extended to confirm all five are present and that no row carries `confidence` or a percentage.

### Surface-parity clause

A new clause states that the five core slots and the 0–1 / two-decimal scale are mandatory regardless of invocation: `--command` dispatch, a direct prompt, or natural conversation. Conversational answers may wrap the block in prose, but the field set, names, and scale never change — so any two surfaces return comparable, diffable rows for the same result. This is the named home for what the research called the surface-parity clause.

### Named optional trailing fields

`requestQuality` and `citationPolicy` are promoted from ad-hoc model latitude to the only two sanctioned extras, rendered as named trailing fields between the scored block and the STATUS footer (keeping STATUS terminal and parseable). Their absence is valid; their presence must use these exact names and must never fold into the score slot.

### COSTAR register note

Both files carry a short framing note that the contract is written objective-first for an automated-pipeline audience — fixed response shape, no preamble, no conversational framing inside the rendered block. The note is explicit that this is the contract's own wording register (the framing the two weak followers, Kimi and MiMo, tolerate best), not a single global prompt framework imposed on callers (RCAF is Kimi's objectively weakest framework, so a global framework was rejected).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/memory/search.md` | Modified | COSTAR register note; §3 score mandate + ban, core-slot mandate, surface-parity clause, named optional fields, extended self-check; §7 boundary entry for optional-field placement |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modified | COSTAR register note; §2 core-slot mandate, score mandate + ban, surface-parity clause, named optional-field rendering with placement example |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Markdown/contract edits only, layered on top of the prior committed phase (O1) without touching its structural layer. Verified by a cross-file consistency grep (mandate, ban, core slots, surface-parity, named optional, constitutional-exclusion, register) and `validate.sh --strict`, which returned PASSED with 0 errors and 0 warnings.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strengthen the existing 0–1 hint into a hard mandate plus an explicit ban rather than rewrite the field-mapping table | The table already mapped the right fields; the failure was that compliance was optional, so the fix is making it mandatory and naming what is forbidden |
| Render `requestQuality`/`citationPolicy` between the scored block and the STATUS footer | Keeps STATUS the terminal, machine-parseable line while still giving the extras an unambiguous named home |
| Frame the register note as the contract's own wording, not a global framework | The research is explicit that one global framework is wrong (RCAF is Kimi's worst); COSTAR is applied as the shared register the weak followers tolerate |
| Leave O1's §0 header, salience inversion, and startup gating untouched | A prior committed phase owns the structural arg-resolution layer; this phase builds on it and only edits the contract/render layer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Cross-file grep: similarity / 0–1 / 2dp mandated | PASS (search.md:70, search_presentation.txt:94) |
| Cross-file grep: `confidence` + percentage banned in rendered output | PASS (search.md:70, search_presentation.txt:95-96) |
| Cross-file grep: five core slots named mandatory | PASS (search.md:68, search_presentation.txt:84) |
| Cross-file grep: `requestQuality`/`citationPolicy` named optional | PASS (search.md:76, search_presentation.txt:102-104) |
| Cross-file grep: surface-parity clause present | PASS (search.md:74, search_presentation.txt:98-99) |
| Constitutional-rows-excluded preserved | PASS (search_presentation.txt:130-132, unchanged) |
| O1 §0 header + salience inversion + startup gating untouched | PASS (search.md:13,17,21-22,116-120 unchanged) |
| `validate.sh <spec-folder> --strict` | PASS (Errors: 0, Warnings: 0, RESULT: PASSED) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live cross-model A/B is the documented follow-up.** The contract is verified for internal consistency and strict validation, but render-consistency under the new contract has NOT been re-tested live against DeepSeek / Kimi / MiMo via `--command`. That A/B (measuring whether all three now emit `similarity` 0–1 two-decimal rows with the five core slots) is the next step and is not part of this contract-only phase.
2. **Enforcement is contract-level, not mechanical.** Nothing in code rejects a `confidence` or percentage render; the ban relies on the model honoring the contract and the render self-check. A downstream lint/guard would be a separate change.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
