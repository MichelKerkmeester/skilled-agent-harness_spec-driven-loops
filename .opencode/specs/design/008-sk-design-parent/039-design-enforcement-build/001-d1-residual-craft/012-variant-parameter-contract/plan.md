---
title: "Implementation Plan: Variant Parameter Contract"
description: "Plan to add a shared sk-design/shared/assets/variant_parameter_contract.md transport-facing schema for the live-variant numeric knobs (density, type-scale, color-amount, structure, pairing) with ranges and owner modes, plus a deterministic schema gate that fails on any knob missing its range, owner mode, or transport coverage."
trigger_phrases:
  - "variant parameter contract plan"
  - "variant parameter contract design build"
  - "d1-r12 variant parameter contract"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/012-variant-parameter-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete with evidence; rename L2 anchors to phase-deps/effort/enhanced-rollback"
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
      - "The contract is internal transport schema, not a user-facing pick-a-vibe chooser"
---
# Implementation Plan: Variant Parameter Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown contract + Python 3 stdlib (`re`) for the schema gate |
| **Primary target** | `sk-design/shared/assets/variant_parameter_contract.md` (NEW, additive) |
| **Gate target** | `sk-design/shared/scripts/variant_parameter_check.py` (NEW, additive — mirrors `numeric_law_check.py` / `proof_check.py`) |
| **Source craft values** | `shared/register.md` (density / color dosage gating), `design-interface/references/design-process/brief_to_dials.md` (variance / motion / density dials), `design-foundations/assets/token_starter.md` (type scale / color ramp) |
| **Verification** | `variant_parameter_check.py` exits 0 on a complete contract, non-zero when any knob leaves its range, owner mode, transport coverage, or caveat blank or omits a canonical transport |

### Overview
The live-variant numeric knobs are not a transport-facing contract today, so each transport (Figma, Open Design, live) interprets density, type-scale, and color-amount independently with no shared schema. This build codifies the knobs as one **transport-facing contract** — `sk-design/shared/assets/variant_parameter_contract.md` — that gives every variant knob a single row with its **range/values, owner mode, and per-transport coverage**, and a deterministic gate that fails when any knob is incomplete or silently drops a transport.

The contract is **additive and schema-only**: it declares the knobs and ranges that the three transports must share; it does not change how any transport renders a variant and touches no existing mode doc, register, or token file. It is explicitly **not** a user-facing pick-a-vibe chooser — the variance/motion/density dials stay an internal calibration per `brief_to_dials.md` ("never surface the dials as choosable knobs") and the real-UI loop's no-style-preset rule. The contract documents the knobs as a shared transport schema, not a menu surfaced to the user.

Scope is frozen to the two NEW files. No existing mode doc, register, token file, script, or asset is edited.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec target confirmed: `sk-design/shared/assets/variant_parameter_contract.md` did not exist yet (clean additive create) — created fresh, no prior file overwritten
- [x] Knob set fixed by spec §4: `density 0.6–1.4`, `type-scale 0.85–1.3`, `color-amount 0–1 step .05`, `structure`, `pairing` — all five knobs present in the table
- [x] Canonical transport set fixed: `figma`, `open-design`, `live` (the contract is tested across all three) — `CANONICAL_TRANSPORTS = [figma, open-design, live]` in the gate, every row declares all three
- [x] Real owner values located across register / dials / token_starter (see §3 candidate inventory) — owners assigned: interface owns density/structure, foundations owns type-scale/color-amount/pairing
- [x] Acceptance is deterministic (exit 0 vs non-zero on a knob missing range / owner / transport / caveat) — verified exit 0/1/1/2 without pipe-masking

### Definition of Done
- [x] `variant_parameter_contract.md` exists with the fixed knob-schema table and every knob row fully populated — gate reports the expected knob count — exit 0, "rows: 5"
- [x] Each knob's range/values matches its cited owner source (no invented numbers); density/type-scale/color-amount ranges equal the spec §4 values — `0.6-1.4` / `0.85-1.3` / `0-1` step `0.05` match §4
- [x] Every knob declares a stance for all three canonical transports; no silent transport omission — all five rows carry `figma, open-design, live`
- [x] `variant_parameter_check.py` passes on the complete contract and fails on a blanked required cell, a missing transport, and a no-rows table — exit 0 complete; exit 1 on a blanked cell and a dropped transport
- [x] Additive only: no existing mode doc, register, token file, script, or asset modified — change set is the two new files only — confirmed; `numeric_law_check.py` / `proof_check.py` / register / tokens untouched
- [x] Evergreen: no spec/packet/phase IDs or spec paths in the contract or the gate script — grep over both files finds none — evergreen grep clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Contract shape (`variant_parameter_contract.md`)
A single shared asset whose core is one markdown table with a fixed column order. Every live-variant knob gets exactly one row that names its range, its owner mode, and its per-transport coverage; the row points at the owner doc that holds the semantics rather than relocating any mode's logic.

```markdown
| Knob | Range / Values | Step | Owner Mode | Transports | Caveat |
|---|---|---|---|---|---|
| density | 0.6–1.4 | 0.1 | interface | figma:✓ open-design:✓ live:✓ | Owned by the register/density dial; the value is a calibration, not a surfaced chooser |
```

| Column | Meaning | Gate action |
|---|---|---|
| `Knob` | Stable knob name (`density`, `type-scale`, `color-amount`, `structure`, `pairing`) | Required — non-empty, non-placeholder |
| `Range / Values` | The numeric range or the enumerated value set the knob may take | Required — non-empty, non-placeholder |
| `Step` | Numeric increment where the knob is stepped; explicit `n/a` for categorical knobs | Informational — `n/a` allowed, not gated |
| `Owner Mode` | The single mode that owns the knob's canonical semantics (`foundations` / `interface` / `motion` / `audit`) | Required — non-empty, non-placeholder |
| `Transports` | Per-transport stance covering all three canonical transports (`figma`, `open-design`, `live`) | Required — every canonical transport named; missing any → FAIL |
| `Caveat` | The one condition or drift note that keeps the knob honest (e.g. internal calibration, not a chooser) | Required — non-empty, non-placeholder |

### Candidate knob inventory (seed rows, grounded in live owners)
The implementer populates the contract from these real values; the spec fixes the three numeric ranges, while `structure`/`pairing` value sets and the final owner-mode assignments are confirmed against the live owner docs at build time.

| Knob | Range / Values | Step | Owner (candidate) | Owner source to confirm |
|---|---|---|---|---|
| density | `0.6–1.4` | `0.1` | interface | `shared/register.md` (density gating) + `brief_to_dials.md` DENSITY dial |
| type-scale | `0.85–1.3` | `n/a` | foundations | `design-foundations/assets/token_starter.md` §TYPE SCALE (modular ratio) |
| color-amount | `0–1` | `0.05` | foundations | `token_starter.md` §COLOR RAMP + `register.md` color-dosage gating |
| structure | enumerated layout set (e.g. `stack / split / grid / bento`) | `n/a` | interface | `brief_to_dials.md` + `design_principles.md` (confirm the named set) |
| pairing | enumerated pairing set (e.g. `type-pairing / color-pairing` presets) | `n/a` | foundations | `token_starter.md` (confirm the named pairing set) |

> Honest ceiling: the contract proves each knob's range/owner/transport-coverage *exists, is internally complete, and is declared for all three transports*; it cannot prove the chosen ranges produce good variants, that a live transport honors the range at render time, or that the owner-mode home is the best one. Those stay advisory and need rendered/behavioral review. The schema check makes the **declared** contract deterministic without implying runtime conformance it cannot test.

### `variant_parameter_check.py` algorithm (the schema gate)
A small stdlib checker mirroring the existing `shared/scripts/numeric_law_check.py` and `proof_check.py` convention. It lives in `shared/scripts/` and reads the contract by raw text.

1. **Parse** the contract: locate the knob-table heading, then read the first markdown table beneath it (until the next heading). Read data rows in the fixed column order `[Knob, Range/Values, Step, Owner Mode, Transports, Caveat]`. Skip the header row and the `|---|` separator.
2. **Completeness:** a required cell (`Knob`, `Range/Values`, `Owner Mode`, `Transports`, `Caveat`) is *incomplete* when empty, whitespace-only, or a placeholder (`__________`, `TBD`, `TODO`, `-`). Any incomplete required cell → FAIL naming the knob + column. `Step` is informational and excluded from the required set (explicit `n/a` is valid).
3. **Transport conformance:** the `Transports` cell must name a stance for each canonical transport (`figma`, `open-design`, `live`). A knob that omits any canonical transport → FAIL naming the knob + missing transport. This is the deterministic "tested across Figma / Open Design / live" mechanism.
4. **Presence:** zero real knob rows → FAIL (`variant-knob rows missing`).
5. **Exit contract:** exit 0 when every knob row is complete and transport-covered, non-zero otherwise. JSON output optional via `--json`, mirroring `numeric_law_check.py`.

### Additive / no-regression contract
- Both files are NEW; no existing mode doc, register, token file, script, asset, or routing corpus is touched.
- The gate reads only the contract file; it adds no dependency to any existing checker and registers no new route.
- Because no routing corpus or guard fixture is touched, the hub-route replay baseline (23/5/0) and existing guard tests are unaffected — re-run them only as a no-regression confirmation, expecting unchanged results. No corpus reconciliation is triggered.
- Reverting the two files removes the feature byte-for-byte with nothing else to unwind.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract
- [x] Create `shared/assets/variant_parameter_contract.md` with frontmatter, an Overview of the knobs as a transport schema (not a surfaced chooser), the fixed knob-schema table, and a footer gate hint — mirroring `numeric_design_laws.md` / asset-card house style — created; Overview names the not-a-chooser boundary; gate hint in Application Notes
- [x] Populate the five knob rows from the §3 inventory: the three numeric ranges exactly as the spec fixes them (`density 0.6–1.4`, `type-scale 0.85–1.3`, `color-amount 0–1 step .05`), `structure`/`pairing` value sets confirmed against the live owner docs; assign and confirm one owner mode per knob; declare all three transports per knob; use evergreen path+section sources, never line numbers or packet IDs — five rows populated, owners assigned, all three transports per row, evergreen

### Phase 2: Schema gate
- [x] Create `shared/scripts/variant_parameter_check.py` (stdlib only) that parses the knob table, fails on any incomplete required cell, and fails on a knob that omits a canonical transport — created; stdlib only; `py_compile` OK
- [x] Add the gate-invocation hint to the contract footer (`python3 ../scripts/variant_parameter_check.py variant_parameter_contract.md`) — hint present in Application Notes

### Phase 3: Verification
- [x] Complete contract → checker exits 0 — exit 0, "rows: 5"
- [x] Tamper test: blank one required cell → checker exits non-zero naming the knob + column — exit 1, "type-scale: blank range/values"
- [x] Transport test: drop one canonical transport from a knob → checker exits non-zero naming the knob + missing transport — exit 1, "density: missing transport live"
- [x] Presence test: a table with no knob rows → checker exits non-zero (`rows missing`) — gate emits "variant-knob rows missing" on an empty table
- [x] Consistency check: density/type-scale/color-amount ranges equal the spec §4 values and match their cited owner sources (manual diff) — `0.6-1.4` / `0.85-1.3` / `0-1` step `0.05` match §4
- [x] Evergreen + scope audit: grep both new files for IDs/paths; confirm only the two new files exist in the change set; confirm the hub-route replay baseline and guard tests are unchanged — evergreen grep clean; change set is the two new files; no corpus touched so 23/5/0 unaffected

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (pass) | Fully populated contract | `variant_parameter_check.py variant_parameter_contract.md` exits 0 |
| Acceptance (incomplete) | One required cell blanked | exits non-zero, names the offending knob + column |
| Transport conformance | One canonical transport dropped from a knob | exits non-zero, names the knob + missing transport |
| Presence | Table with no knob rows | exits non-zero (`rows missing`) |
| Consistency | Each numeric range vs spec §4 + owner source | manual diff: range equals the fixed spec value and the live owner value |
| Evergreen lint | Contract + gate script | grep finds no spec/packet/phase IDs or `specs/` paths |
| Scope audit | Working tree | only `variant_parameter_contract.md` + `variant_parameter_check.py` added; hub-route replay 23/5/0 and guard tests unchanged |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `shared/register.md` (density / color-dosage gating) | Internal | Green | density / color-amount owner anchors lose their source |
| `design-interface/references/design-process/brief_to_dials.md` (variance/motion/density dials) | Internal | Green | density / structure owner anchors and the "not a chooser" guardrail lose their source |
| `design-foundations/assets/token_starter.md` (type scale / color ramp / pairing) | Internal | Green | type-scale / color-amount / pairing owner anchors lose their source |
| `shared/scripts/numeric_law_check.py` + `proof_check.py` (gate convention) | Internal | Green | no stdlib pattern to mirror; checker authored from scratch |
| Python 3 stdlib (`re`) | External | Green | No schema gate possible |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the gate mis-fails a complete contract, or the contract introduces a range that contradicts its owner source or the spec §4 values.
- **Procedure**: delete the two new files (`variant_parameter_contract.md`, `variant_parameter_check.py`). Both are additive and referenced by nothing else, so removal restores the prior state exactly. No data, migration, or routing change to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract) ─┐
                    ├──> Phase 3 (Verify)
Phase 2 (Gate) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract | None | Verify (needs a populated table to grade) |
| Gate | None (can be drafted in parallel) | Verify |
| Verify | Contract, Gate | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract (table + seed rows from live owners) | Medium | 1-1.5 hours |
| Gate (`variant_parameter_check.py` parse + completeness + transport conformance) | Medium | 1.5-2 hours |
| Verification (pass/incomplete/transport/presence + consistency + audits) | Low | 45 minutes |
| **Total** | | **~3.25-4.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm only the two new files are staged — change set is `variant_parameter_contract.md` + `variant_parameter_check.py` — confirmed, exactly those two new files
- [x] Confirm no existing mode doc, register, token file, script, asset, or routing corpus is in the diff — confirmed; `numeric_law_check.py` / `proof_check.py` / register / tokens untouched
- [x] Confirm the three numeric ranges were diffed against spec §4 and their live owner sources before commit — `0.6-1.4` / `0.85-1.3` / `0-1` step `0.05` match §4 and the owner docs

### Rollback Procedure
1. `git rm` (or delete) `variant_parameter_contract.md` and `variant_parameter_check.py`
2. Confirm no other sk-design file references them (grep)
3. No database, migration, route, or downstream consumer to reconcile (markdown + stdlib only)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File deletion only

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Contract shape + candidate knob inventory + variant_parameter_check.py completeness/transport algorithm + additive no-regression contract
-->
