---
title: "Implementation Summary: Recommendation Ledger Bijective Map"
description: "Execution evidence for the immutable 178-row deep-loop recommendation ledger, its deterministic projections, and its fail-closed validator."
trigger_phrases:
  - "recommendation ledger implementation summary"
  - "178 row ledger evidence"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
    last_updated_at: "2026-07-20T19:16:25Z"
    last_updated_by: "codex"
    recent_action: "Corrected literal locator uniqueness and adopted the counterfactual replay recommendation"
    next_safe_action: "Use the immutable ledger as the downstream phase ownership source"
    blockers: []
    key_files:
      - "recommendation-ledger.json"
      - "recommendation-ledger-validation.json"
      - "validate-ledger.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Recommendation Ledger Bijective Map

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-recommendation-ledger-bijective-map |
| **Completed** | 2026-07-20 |
| **Level** | 2 |
| **Status** | Complete |
| **Base Commit** | `fe6ca3030917073f3b478bc044e10034dcc4394b` |
| **Classification Reviewer** | Codex, acting under the leaf's conservative safety-first triage authority |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The program now has one immutable row for every research recommendation. The canonical JSON keeps the original source
text and evidence alongside a normalized taxonomy target and one disposition, while the CSV and validation report make
the classification reviewable without weakening the source-to-row bijection.

Two independent review findings were amended without changing or renumbering any DLR ID. Every `source_locator` is now
run-qualified (`run-a:...`, `run-b:...`, or `run-c:...`), so the field itself has 178 literal unique values; the raw
per-run rank or JSON pointer remains intact after the qualifier. `DLR-C-087` is now adopted in phase 013 because its
primary counterfactual-replay mechanism belongs to the `agent-improvement` lane; budgeted Shapley attribution remains
an optional escalation inside that adopted recommendation rather than grounds to defer the primary mechanism.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `recommendation-ledger.json` | Created | Canonical 178-row ledger |
| `recommendation-ledger.csv` | Created | Deterministic review projection |
| `recommendation-ledger.schema.json` | Created | Closed structural contract |
| `recommendation-ledger-validation.json` | Created | Counts, row IDs, phase coverage, hashes, fixtures, and verdict |
| `validate-ledger.cjs` | Created | Deterministic extraction, build, and fail-closed verification |
| `implementation-summary.md` | Created | Execution and review evidence |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Completion state and machine-detectable evidence |
| `graph-metadata.json` | Modified | Refreshed generated fingerprint and completion status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The validator reads the frozen inputs, rejects any digest or shape drift, extracts the run-specific source records,
and regenerates all canonical artifacts from one classification map. Each `--write` or `--verify` run performs two
in-memory builds and requires byte-identical ledger, CSV, schema, and validation-report output before accepting the
written artifacts.

The run-a adapter reads the eight ranked entries in research section 17 and treats its findings registry as companion
evidence because that registry intentionally has no `recommendations` array. Run-c preserves four empty optional
`uniqueness` values at source pointers 53, 82, 88, and 94.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Adopt 112 recommendations | Uncertain recommendations stay adopted so later review can reverse scope without losing research signal |
| Merge 58 recommendations | These rows duplicate or substantially overlap a stronger adopted row while retaining their independent provenance |
| Defer 8 recommendations | Their impact is speculative, low priority, or depends on later maturity, and every row carries a concrete rationale |
| Reject 0 recommendations | No source row was clearly out of scope or contradicted by the shipped runtime; the zero bucket remains explicit and reasoned |
| Put 72 adoptions in phase 013 | The mode-specific source corpus is owned by per-mode implementation rather than the shared runtime phases |
| Adopt `DLR-C-087` in phase 013 | Failure-triggered counterfactual replay is a high-impact `agent-improvement` mechanism; optional Shapley escalation does not justify wholesale deferral |

### Borderline for Review

The safety-first default kept five medium-confidence classifications adopted: `DLR-B-040`, `DLR-B-045`,
`DLR-C-023`, `DLR-C-024`, and `DLR-C-111`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Disposition Counts

| Bucket | Count |
|--------|------:|
| Adopted | 112 |
| Merged | 58 |
| Deferred | 8 |
| Rejected | 0 |

### Adopted Per Phase

| Phase | Count | Phase | Count | Phase | Count |
|-------|------:|-------|------:|-------|------:|
| 003 | 0 | 008 | 1 | 013 | 72 |
| 004 | 0 | 009 | 10 | 014 | 2 |
| 005 | 3 | 010 | 4 | 015 | 0 |
| 006 | 5 | 011 | 6 | 016 | 1 |
| 007 | 7 | 012 | 1 | 017 | 0 |

Phase 013 contains 72 adopted rows after adding `DLR-C-087`; every other phase count is unchanged.

### Commands and Results

| Check | Result |
|-------|--------|
| `node validate-ledger.cjs --verify` | PASS, exit 0; 178 rows; 178 literal unique source locators; source counts 8/59/111; disposition counts 112/58/8/0 |
| Standard JSON Schema validation | PASS with Python `jsonschema` Draft 2020-12 validation |
| Negative fixtures | PASS; 11 malformed variants failed closed |
| Two repeated deterministic builds | PASS; ledger, CSV, schema, and validation-report bytes matched before artifact verification |
| `node --check validate-ledger.cjs` | PASS, exit 0 |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS, exit 0; Errors 0; Warnings 0 |

### Frozen Input SHA-256

| Input | SHA-256 |
|-------|---------|
| Run-a ranked research | `86b0e4a7a6702053149a4c06a3f607102edc58cb364d6493be5350bb10f14016` |
| Run-a companion registry | `111d4c67c7e10da127b0df528cc4c19eb682d2aceafaddb79f25456037511e4a` |
| Run-b registry | `3557433baaebceaf53b01f21ca4ca02807c9f093c3f4285e3a6558c451f59912` |
| Run-c registry | `5ff96cbaf7638d2ff8d48199de976b90a118384a89b42a5e126543dd8b9ec30c` |
| Taxonomy spec | `99dbbd9f6156bc0f1e3ce6261ba5e92ca97077ada778d1c8820651b3c1f4d17d` |
| Phase manifest | `363da601d45c5eacd90d4ce02adc2af14f80f21d62df6edaf9afa49f6efda50d` |
| Program phase map | `d5cb19392cfec58a51869de37e1f8c546f9db3669d703ad0174a6fec6923d634` |

### Artifact SHA-256

| Artifact | SHA-256 |
|----------|---------|
| `recommendation-ledger.json` | `d4395069243de8a15689e4d1ffaeceb187be8694ba24dcc1e481516feb2f9d7a` |
| `recommendation-ledger.csv` | `14c67a8bc09e40016453b063f44848354669827445782786ddf5fa0f7c3e6df2` |
| `recommendation-ledger.schema.json` | `c83beec809586d44d4104ab90aea3268d25841b6ed3b1cba3c18218baf1f3211` |
| `recommendation-ledger-validation.json` | `2bee2fc125874a71148d83844d2d3ecf0b6049a1b2c6e795091350d77f542160` |
| `validate-ledger.cjs` | `19646191f7986aa417601aef4a8141a8de7af4e7afa17f11005d5918ceeeff41` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Five borderline adoptions need downstream review.** They remain adopted by design because under-deferral is the reversible failure mode.
2. **The zero rejected count is deliberate.** A future source revision may justify rejection, but the frozen corpus contains no clearly excluded or contradicted recommendation.
3. **The ledger is immutable against these frozen inputs.** Any source, taxonomy, or manifest change must stop the build and receive an explicit reviewed ledger revision that preserves published IDs.
<!-- /ANCHOR:limitations -->
