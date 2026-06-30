---
title: "Tasks: Variant Parameter Contract"
description: "Ordered implementer items to create shared/assets/variant_parameter_contract.md (the transport-facing variant-knob schema) and shared/scripts/variant_parameter_check.py (the row-completeness + transport-conformance gate), with consistency, tamper, transport, and evergreen verification."
trigger_phrases:
  - "variant parameter contract tasks"
  - "variant parameter contract design build"
  - "variant_parameter_check schema gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/012-variant-parameter-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete with evidence; set canonical phase headers"
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
# Tasks: Variant Parameter Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Contract]

- [x] T001 Re-read the live owner values to confirm each knob's range and owner mode: `shared/register.md` (density / color-dosage gating), `design-interface/references/design-process/brief_to_dials.md` (variance/motion/density dials + the "not a chooser" guardrail), `design-foundations/assets/token_starter.md` §TYPE SCALE / §COLOR RAMP (type-scale / color-amount / pairing) [15m] — owners confirmed: interface owns density/structure, foundations owns type-scale/color-amount/pairing
- [x] T002 Create `shared/assets/variant_parameter_contract.md`: frontmatter (title/description/trigger_phrases/importance_tier/contextType/version) + an Overview stating the knobs are a shared transport schema, never a surfaced pick-a-vibe chooser (cite `brief_to_dials.md` dials-are-not-a-menu) (`.opencode/skills/sk-design/shared/assets/variant_parameter_contract.md`) [20m] — created; Overview names the not-a-chooser boundary and the declared-vs-runtime split
- [x] T003 Author the knob-schema table with fixed column order `[Knob, Range/Values, Step, Owner Mode, Transports, Caveat]`; populate the five knob rows — `density 0.6–1.4`, `type-scale 0.85–1.3`, `color-amount 0–1 step .05`, plus `structure` and `pairing` value sets confirmed against the live owners; assign one owner mode per knob; declare all three canonical transports (`figma`, `open-design`, `live`) per knob; use evergreen path+section sources, never line numbers or packet IDs (`variant_parameter_contract.md`) [40m] — five rows populated, owners assigned, all three transports per row, evergreen
- [x] T004 Add an Application Notes block (which mode owns which knob; the contract is transport-facing, not user-facing) + a footer gate hint `python3 ../scripts/variant_parameter_check.py variant_parameter_contract.md` (`variant_parameter_contract.md`) [10m] — Application Notes present with owner map and the gate-invocation hint

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Schema Gate]

- [x] T005 [P] Create `shared/scripts/variant_parameter_check.py` (Python 3 stdlib only) with a `main()` arg parser accepting a target path and an optional `--json`, mirroring `numeric_law_check.py` / `proof_check.py` (`.opencode/skills/sk-design/shared/scripts/variant_parameter_check.py`) [15m] — created; stdlib only; `main()` takes a path + `--json`; `py_compile` OK
- [x] T006 Implement the table parser: locate the knob-table heading, read the first markdown table beneath it (until next heading), extract 6-cell rows in fixed order, skip the header row and the `|---|` separator (`variant_parameter_check.py`) [25m] — `_find_rows` locates the `Knob Schema` heading and reads 6-cell rows, skipping header + separator
- [x] T007 Implement completeness validation: a required cell (`Knob`, `Range/Values`, `Owner Mode`, `Transports`, `Caveat`) is incomplete when empty/whitespace-only/placeholder (`__________`, `TBD`, `TODO`, `-`); any incomplete required cell → fail naming the knob + column; `Step` is informational (explicit `n/a` allowed, not gated); zero real rows → fail (`rows missing`) (`variant_parameter_check.py`) [25m] — `REQUIRED_COLUMNS` excludes Step; placeholder regex covers `_+`/TBD/TODO/-/N/A; empty table fails "variant-knob rows missing"
- [x] T008 Implement transport conformance: the `Transports` cell must name a stance for each canonical transport (`figma`, `open-design`, `live`); a knob omitting any canonical transport → fail naming the knob + missing transport (`variant_parameter_check.py`) [20m] — `_transport_present` word-boundary check over `CANONICAL_TRANSPORTS`; verified "density: missing transport live"
- [x] T009 Wire the exit contract: exit 0 when every knob row is complete and transport-covered, non-zero otherwise; emit a human summary and an optional `--json` payload (`variant_parameter_check.py`) [10m] — exit 0/1 wired off `result["ok"]`, usage exit 2; human summary + `--json` payload emitted

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T010 Run `variant_parameter_check.py variant_parameter_contract.md` on the fully populated contract; confirm exit 0 [10m] — exit 0, "rows: 5", all rows complete and transport-covered
- [x] T011 Tamper test: blank one required cell; confirm non-zero exit naming the offending knob + column; restore the cell (work on a scratch copy, owner untouched) [10m] — scratch copy with type-scale Range/Values blanked → exit 1, "type-scale: blank range/values"; live file untouched
- [x] T012 Transport test: drop one canonical transport from a knob; confirm non-zero exit naming the knob + missing transport; restore (scratch copy) [10m] — scratch copy with `live` dropped from density → exit 1, "density: missing transport live"; live file untouched
- [x] T013 Presence test: point the checker at a table with no knob rows; confirm non-zero (`rows missing`) [5m] — gate emits "variant-knob rows missing" on an empty table, exit 1

### Consistency
- [x] T014 Diff the three numeric ranges against the spec §4 values (`density 0.6–1.4`, `type-scale 0.85–1.3`, `color-amount 0–1 step .05`) and against their cited owner sources; confirm no invented or contradictory numbers [20m] — `0.6-1.4` / `0.85-1.3` / `0-1` step `0.05` match §4 and the owner docs

### Audits
- [x] T015 Evergreen audit: grep the contract + gate script for spec/packet/phase IDs and `specs/` paths; confirm none present [5m] — evergreen grep over both returns clean, skill-relative paths only
- [x] T016 Scope-lock + no-regression audit: confirm only `variant_parameter_contract.md` and `variant_parameter_check.py` are added, no existing mode doc/register/token/script/asset/registry is modified, and the hub-route replay baseline (23/5/0) + guard tests are unchanged (additive — no corpus touched) [5m] — change set is the two new files; `numeric_law_check.py` / `proof_check.py` / register / tokens untouched; no corpus touched so 23/5/0 unaffected

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T016 complete
- [x] No `[B]` blocked tasks remaining — none
- [x] Complete contract passes; an incomplete row, a dropped transport, and a no-rows table all fail — exit 0 complete; exit 1 on blank cell / dropped transport / no rows
- [x] The three numeric ranges equal the spec §4 values and their owner sources — `0.6-1.4` / `0.85-1.3` / `0-1` step `0.05` match
- [x] Additive only — no existing craft file modified; hub-route replay 23/5/0 + guard tests unchanged — change set is the two new files; no corpus touched
- [x] Evergreen + scope-lock audits pass — evergreen grep clean; only the two new files added
- [x] `checklist.md` fully verified — all P0/P1 items marked with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **House-style reference**: `.opencode/skills/sk-design/shared/numeric_design_laws.md` (shared schema-doc structure)
- **Gate convention**: `.opencode/skills/sk-design/shared/scripts/numeric_law_check.py` + `proof_check.py` (stdlib checker pattern)
- **Not-a-chooser guardrail**: `.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md` (dials are internal calibration, never a surfaced menu)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit verification + tamper + transport + consistency tasks)
-->
