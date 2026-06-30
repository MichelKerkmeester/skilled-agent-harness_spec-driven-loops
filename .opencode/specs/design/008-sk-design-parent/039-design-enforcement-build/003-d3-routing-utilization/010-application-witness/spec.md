---
title: "D3-R10 — Application-witness (loaded-determinative)"
description: "Add an APPLICATION WITNESS section to the application proof card and an additive proof_check.py --require-application-witness flag that classifies each witness row not-loaded/loaded-inert/loaded-determinative and blocks a ready-claim lacking a well-formed loaded-determinative witness, raising the floor from loaded to loaded-had-an-observable-effect while keeping taste advisory."
trigger_phrases:
  - "d3-r10 application witness"
  - "loaded determinative witness design build"
  - "proof_check require application witness"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/010-application-witness"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the application-witness build complete"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D3-R10 — Application-witness (loaded-determinative)

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
| **Enforcement class** | hybrid |
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Loading a file proves nothing about use. The application proof card could claim a rule was loaded with no evidence that the rule actually shaped the output, and `proof_check.py` would pass the card on field presence alone. A mode could open every reference, change nothing in response, and still earn a ready-claim — the loaded-but-inert gap.

### Purpose
Raise the floor from "loaded" to "loaded had an observable effect on one named output choice". Add an `APPLICATION WITNESS` section to `proof_of_application_card.md` — a row naming a concrete output choice (a value/decision in the produced UI) and the specific loaded mode rule that drove it — and an additive `proof_check.py --require-application-witness` flag that classifies each row as `not-loaded`, `loaded-inert`, or `loaded-determinative` and **fails a ready-claim that has no well-formed `loaded-determinative` witness**. The flag mirrors `--require-source-proof`: it parses a heading-scoped table, skips header/separator/placeholder rows, and folds into the verdict only when set. The gate enforces presence of a load-bearing link; it never claims the design is tasteful.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An `## 7. APPLICATION WITNESS` section on `proof_of_application_card.md` (4-column table `[Output choice, Loaded rule source, Classification, Counterfactual]` + the three-way classifier line + the observable-effect-not-taste framing), placed after `SOURCE PROOF`
- A footer gate hint documenting the stricter `--require-application-witness` mode
- An additive `--require-application-witness` token in `proof_check.py`, mirroring `--require-source-proof`
- `_find_application_witness_rows` (heading-scoped table parse with header/separator/placeholder skip), `_application_classification` (checked-`[x]` detection), and `_validate_application_witness` (well-formedness + aggregate verdict)
- The `application_witness` key folded into `missing`/`ok` ONLY when the flag is set

### Out of Scope
- Any edit to a third file beyond `proof_of_application_card.md` + `proof_check.py` (`context_loaded_card.md` is untouched — the witness lives only on the application card)
- Changing the `--require-source-proof` path or any existing `check()` key
- Gating the `Counterfactual` column (it is a reader-only falsifiability anchor, not a checked field)
- Certifying design quality (taste stays advisory — see RISKS and OPEN QUESTIONS)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Modify | Add the `## 7. APPLICATION WITNESS` section + the footer `--require-application-witness` hint |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modify | Add the additive `--require-application-witness` flag, the witness parser/classifier/validator, and the `application_witness` key |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The card carries an `APPLICATION WITNESS` section | `## 7. APPLICATION WITNESS` present with the 4-column `[Output choice, Loaded rule source, Classification, Counterfactual]` table and the `not-loaded` / `loaded-inert` / `loaded-determinative` classifier line, after `SOURCE PROOF` |
| REQ-002 | A well-formed determinative witness passes | A card naming a real output choice + the loaded rule that drove it, marked `[x] loaded-determinative` → `application_witness.ok` `True`, exit 0 |
| REQ-003 | An inert-only / no-witness / malformed card fails | `loaded-inert`-only → `no loaded-determinative witness`; placeholder-only → `application-witness rows missing`; a determinative row missing output choice or rule source → `witness not well-formed`; each exit 1 |
| REQ-004 | The flag is additive and opt-in | With no flag (or `--json` / `--require-cards` / `--require-source-proof`), `proof_check.py` behaves byte-for-byte as before; the witness contributes to `missing`/`ok` only when `--require-application-witness` is set |
| REQ-005 | No regression to the existing gate | A no-flag run keeps the original result shape (NEITHER `source_proof` NOR `application_witness` key); `--require-source-proof` still emits `source_proof` only; `python3 -m py_compile` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Anti-self-attestation | A ticked load checkbox alone does not satisfy the gate; a `loaded-determinative` mark is well-formed only when it names BOTH the output choice and the loaded rule source |
| REQ-007 | Honest scope recorded | The "observable effect on one choice, not taste" framing appears in both the card section and the spec; the gate enforces the load-bearing link only, never quality |
| REQ-008 | Evergreen body | The card and the script carry no spec/packet/phase IDs or `specs/` paths |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `proof_of_application_card.md` carries an `## 7. APPLICATION WITNESS` section with the 4-column table, the three-way classifier line, and the observable-effect-not-taste framing, plus a footer `--require-application-witness` hint.
- **SC-002**: `proof_check.py --require-application-witness` passes a card with a well-formed `loaded-determinative` witness (`application_witness.ok` `True`, exit 0).
- **SC-003**: The same flag fails a `loaded-inert`-only card (`no loaded-determinative witness`), a placeholder-only card (`application-witness rows missing`), and a malformed determinative row (`witness not well-formed`) — each exit 1.
- **SC-004**: A no-flag run keeps the original result shape (NEITHER `source_proof` NOR `application_witness`); `--require-source-proof` still emits `source_proof` only; the existing `0/1/2` exit contract is preserved.
- **SC-005**: `python3 -m py_compile proof_check.py` exits 0 and the evergreen scan over both edits is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The witness could be read as a quality certificate | A reader might treat a passing witness as "the design is good" | HONEST framing recorded in the card and the spec: the witness proves a cited loaded rule changed ONE named output choice (loaded is not applied — it closes the loaded-but-inert gap); it does NOT certify quality, and taste stays advisory |
| Risk | A new flag could change existing gate behavior | Any drift would break current CI/build callers | The flag is additive/opt-in: with no flag the result shape is byte-stable (NEITHER `source_proof` NOR `application_witness`); `--require-source-proof` is untouched; verified by a no-regression run |
| Risk | A self-attested checkbox could pass on "loaded" alone | A ticked box without a real link would be hollow | A `loaded-determinative` mark is well-formed only when it names both the output choice and the loaded rule source; a malformed determinative row fails `witness not well-formed` |
| Dependency | `proof_check.py` `check()` entry + `--require-source-proof` scaffolding | The additive integration point and the pattern to mirror | Internal, green |
| Dependency | `proof_of_application_card.md` SOURCE PROOF section | The structural precedent for the new witness block | Internal, green |
| Dependency | Python 3 stdlib (`re`) | The parser/classifier | External, green |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Additivity
- **NFR-A01**: `--require-application-witness` is a new opt-in `argv` token; absence yields zero new behavior. The witness adds a single new `check()` key (`application_witness`) and contributes to `missing`/`ok` only when the flag is set; every prior key (`fields`, `cards`, `ready`, `not_ready_flag`, `missing`, `ok`, `source_proof`) stays present and unchanged.

### Backward Compatibility
- **NFR-B01**: A no-flag run keeps the original result shape with NEITHER a `source_proof` NOR an `application_witness` key; `--require-source-proof` still emits `source_proof` and only that. The `0 = pass, 1 = fail, 2 = usage` exit contract is preserved.

### Honesty
- **NFR-H01**: The gate enforces a load-bearing link (a cited loaded rule changed a named output choice), never the quality of the choice. The card and the spec both state that taste stays advisory; the witness raises the floor above "loaded" without claiming the design is good.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Parsing Boundaries
- **No witness rows**: placeholder-only rows (underscore/whitespace/empty cells with an unchecked classification) are skipped → zero real rows → `application-witness rows missing`.
- **Header / separator skip**: the `[Output choice, Loaded rule source, Classification, Counterfactual]` header row and the `|---|` separator are skipped; parsing stops at the next markdown heading.

### Classification Boundaries
- **Determinative pass**: a `[x] loaded-determinative` row naming both the output choice and the loaded rule source → well-formed → the witness passes.
- **Inert only**: rows present but none `loaded-determinative` (all `loaded-inert` / `not-loaded`) → `no loaded-determinative witness`.
- **Malformed determinative**: a `[x] loaded-determinative` row whose output choice OR loaded rule source is placeholder → `witness not well-formed`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One card section (`proof_of_application_card.md`) plus one additive flag path in `proof_check.py` (heading regex, classification tuple, row parser, classifier, validator); nothing else is edited.
- **Risk concentration**: The load-bearing piece is keeping the flag additive — the witness must fold into the verdict only when set, so existing callers and the `--require-source-proof` path stay byte-stable. The no-op (no flag) and the well-formedness check contain the regression and self-attestation risks.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does a passing witness mean the design is good? **RESOLVED: No. The witness proves a cited LOADED rule changed ONE named output choice — loaded is not the same as applied, so it closes the loaded-but-inert gap. It does NOT certify the design is tasteful; taste stays advisory. The gate enforces presence of a load-bearing link only.**
- Should the stricter check be on by default? **RESOLVED: No — it ships opt-in. `--require-application-witness` is additive: with no flag (or `--json` / `--require-cards` / `--require-source-proof`) `proof_check.py` behaves byte-for-byte as before, so existing callers are unaffected until they opt in. Verified: a no-flag run carries NEITHER `source_proof` NOR `application_witness`; `--require-source-proof` still emits `source_proof` only.**
- Must every output choice be witnessed? **RESOLVED: No. The gate requires at least one well-formed `loaded-determinative` row, not exhaustive per-choice attribution. It raises the floor from "loaded" to "at least one named choice is provably rule-driven".**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: APPLICATION WITNESS section on proof_of_application_card.md + the additive --require-application-witness flag in proof_check.py; determinative → ok True (exit 0); inert-only / placeholder-only / malformed → exit 1
- Findings: additive/opt-in (source-proof + no-flag byte-stable); proves loaded had an observable effect on one named choice, not that the design is good (taste stays advisory)
-->
