---
title: "Implementation Summary: Variant Parameter Contract"
description: "A six-column variant-knob contract plus a stdlib gate turn the live-variant knobs into a declared, transport-complete schema: every knob now names its range, owner, and all three transports, and the gate fails a blank cell or a dropped transport, while whether the ranges produce good variants stays rendered review."
trigger_phrases:
  - "variant parameter contract summary"
  - "variant_parameter_check schema gate"
  - "transport variant knob schema implementation"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/012-variant-parameter-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped variant contract + variant_parameter_check gate; verified exit 0/1/1/2"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/variant_parameter_contract.md"
      - ".opencode/skills/sk-design/shared/scripts/variant_parameter_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deterministic bite as a checker vs prose-only resolved to a new stdlib gate mirroring numeric_law_check.py / proof_check.py"
      - "The contract is internal transport schema, not a user-facing pick-a-vibe chooser; the value ranges are transport-facing bounds, not selectable dials"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-variant-parameter-contract |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The live-variant numeric knobs were never a shared contract: density, type-scale, color-amount, structure, and pairing each lived as ad-hoc knobs, so Figma, Open Design, and live could read them independently and a knob could silently drop a transport with nothing to catch it. You can now carry the knobs as one transport-facing schema, and a stdlib gate refuses a contract where any knob leaves a required cell blank or omits a canonical transport. The "every transport reads the knobs its own way" gap closes by a declared, complete, transport-covered table that a deterministic checker grades.

This is additive. Two new files were created and nothing else was touched: no existing mode doc, register, token file, or sibling gate (`numeric_law_check.py`, `proof_check.py`) was edited, and because no routing corpus was touched the hub-route replay baseline (23/5/0) is unaffected.

### The six-column knob-schema table

`variant_parameter_contract.md` carries one table with a fixed column order — `| Knob | Range/Values | Step | Owner Mode | Transports | Caveat |` — and one row per live-variant knob:

- `density` — `0.6-1.4`, step `0.1`, owner `interface`
- `type-scale` — `0.85-1.3`, step `n/a`, owner `foundations`
- `color-amount` — `0-1`, step `0.05`, owner `foundations`
- `structure` — `stack, split, grid, bento, scroll-pinned`, step `n/a`, owner `interface`
- `pairing` — `single-family, display-plus-neutral-body, body-plus-utility, data-legibility`, step `n/a`, owner `foundations`

Each row's Caveat keeps the knob honest (density is an internal calibration, not a chooser; color-amount is visual dosage, not palette quality; structure selects a layout family for transport parity, and so on). Every row declares all three canonical transports — `figma`, `open-design`, `live` — so the contract is the shared schema the three transports read instead of ad-hoc per-transport knobs.

### The three-transport rule

The load-bearing rule is that every knob must name a stance for each canonical transport. Dropping one transport from a row is a contract failure even when the prose otherwise looks complete. The gate enforces this with a word-boundary presence check per transport, so a row that reads fine but quietly omits `live` still fails and names the gap.

### Deterministic schema gate

`variant_parameter_check.py` is a stdlib-only checker mirroring the `numeric_law_check.py` / `proof_check.py` convention (`CANONICAL_TRANSPORTS = ["figma", "open-design", "live"]`, exit 0/1/2, optional `--json`). It locates the `Knob Schema` heading, reads the first table beneath it in the fixed six-column order, and grades each row: a required cell (`Knob`, `Range/Values`, `Owner Mode`, `Transports`, `Caveat`) that is empty, whitespace-only, or a placeholder fails, and a knob that omits any canonical transport fails. `Step` is informational, so an explicit `n/a` for a categorical knob is valid. The exit matrix:

| Case | Exit |
|------|------|
| All five knobs complete, each declaring all three transports | 0 (`PASS - all variant parameter rows are complete and transport-covered`) |
| A knob omits a canonical transport | 1 (`density: missing transport live`) |
| A required cell blanked | 1 (`type-scale: blank range/values`) |
| A table with no knob rows | 1 (`variant-knob rows missing`) |
| Usage: no argument / unreadable file | 2 |

### Enforcement boundary, stated honestly

The split is written into the contract's Overview. The gate is deterministic about declaration: the row-completeness check and the per-transport presence check are mechanical, so a blank cell and a dropped transport are loud and blocking. It stays advisory about judgment: a complete, transport-covered contract is necessary, not sufficient — it never proves the chosen ranges produce good variants, that a live transport honors a range at render time, or that the owner-mode home is the best one. The Overview says so in plain words, and the contract is labeled internal transport schema, not a user-facing pick-a-vibe chooser; the value ranges are transport-facing bounds, never surfaced as selectable dials.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/assets/variant_parameter_contract.md` | Created | The six-column knob-schema table with five fully populated knobs each declaring `figma`/`open-design`/`live`, an Overview stating the not-a-chooser boundary and the declared-vs-runtime split, an Application Notes block, and the gate-invocation hint |
| `.opencode/skills/sk-design/shared/scripts/variant_parameter_check.py` | Created | Stdlib gate that parses the knob table, fails an incomplete required cell, and fails a knob that omits a canonical transport |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) created the two new files: the contract populated from the live owner values (register density/color-dosage gating, the `brief_to_dials.md` not-a-chooser guardrail, and `token_starter.md` type scale / color ramp) and the checker authored against the `numeric_law_check.py` pattern. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking, and this summary re-ran the same matrix on scratch copies (the live file untouched): `python3 ../scripts/variant_parameter_check.py variant_parameter_contract.md` over the complete contract exits 0 with "rows: 5"; a scratch with `live` dropped from the density knob exits 1 ("density: missing transport live"); a scratch with the type-scale Range/Values cell blanked exits 1 ("type-scale: blank range/values"); a no-argument call exits 2. `python3 -m py_compile variant_parameter_check.py` is clean. The change set was grepped to keep both files evergreen, and scope was confirmed clean — `numeric_law_check.py`, `proof_check.py`, the register, and the token files are untouched, and no corpus was touched so the hub-route replay baseline (23/5/0) is unaffected. `validate.sh <folder> --strict` reports the spec-doc rules clean with only the expected generated-metadata fingerprint residual left for orchestrator regeneration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Express the knobs as one shared six-column contract, not per-mode prose | A single table with a fixed column order gives the three transports one schema to read and a checker one shape to grade, instead of each transport interpreting density/scale/color independently |
| Make it bite with a new stdlib checker, not prose alone | The spec acceptance is deterministic; without a checker the contract would be advisory-only, so the gate is the in-scope mechanism, matching the sibling residual-craft pattern (schema doc + new stdlib gate) |
| Gate transport completeness per row, not just cell completeness | The core risk is a knob silently dropping a transport while the row reads complete; a per-transport presence check is the deterministic "tested across Figma / Open Design / live" mechanism |
| Treat `Step` as informational, the other five columns as required | Categorical knobs (`structure`, `pairing`) have no numeric step, so an explicit `n/a` must pass; gating `Step` would force a false value |
| Mirror `numeric_law_check.py` / `proof_check.py` (stdlib, exit 0/1/2, `--json`) | Reuses the established sibling-gate convention with no new dependency to unwind |
| Label the contract internal transport schema, not a user-facing chooser | The `brief_to_dials.md` guardrail keeps the dials an internal calibration; surfacing the ranges as selectable dials would contradict the no-style-preset rule |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `variant_parameter_check.py variant_parameter_contract.md` on the complete contract | PASS, exit 0, "rows: 5", all rows complete and transport-covered |
| Dropped transport: `live` removed from the density knob (scratch copy) | FAIL, exit 1, "density: missing transport live" (the gate bites) |
| Blanked required cell: type-scale Range/Values cleared (scratch copy) | FAIL, exit 1, "type-scale: blank range/values" |
| Usage: no argument | Usage error, exit 2 (no false pass) |
| `python3 -m py_compile variant_parameter_check.py` | PASS, compile OK |
| Five knobs present and fully populated | density / type-scale / color-amount / structure / pairing all filled, each declaring figma/open-design/live |
| Evergreen + scope audit | Both files carry skill-relative paths only, no spec or packet IDs; change set is the two new files; `numeric_law_check.py` / `proof_check.py` / register / token files untouched; no corpus touched so hub-route replay 23/5/0 unaffected |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Declared and complete, not runtime-conformant.** The gate proves every knob row is present, complete, and declares all three canonical transports. It does not prove a live transport honors a knob's range when it renders; runtime conformance stays a rendered/behavioral check. The contract says so in its Overview.
2. **Schema, not taste.** A complete, transport-covered contract is necessary, not sufficient. Whether the chosen ranges produce good variants and whether the owner-mode home is the best one stay human and rendered review; the gate certifies no aesthetics.
3. **Internal schema, not a chooser.** The contract is transport-facing; the value ranges are bounds, never surfaced to the user as selectable dials. Pointed at a half-filled table, the gate surfaces the missing/blank cell as exit 1, which is the intended guard against incomplete contracts.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
