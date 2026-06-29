---
title: "D6-R10 — READABILITY/DENSITY + LOCALE STRESS proof"
description: "Append two conditional proof fields to the shared context loading contract — Readability And Density (measure / ch-unit max-width / line-height / decision count) for content-heavy UI, and Locale Stress (~130% expansion proxy / RTL logical properties / mirrored directional icons) for global UI — plus a §5 documented RTL physical-direction lint stated as a deterministic ripgrep rule that flags physical margin/padding/text-align and exempts logical equivalents; no new wired script."
trigger_phrases:
  - "d6-r10 readability density locale proof"
  - "locale stress design build"
  - "readability density rtl lint contract"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/010-readability-density-locale-proof"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record readability/locale fields and the RTL-lint fork"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D6-R10 — READABILITY/DENSITY + LOCALE STRESS proof

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Enforcement class** | hybrid |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D1 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Readability comfort and localization survival lived in the design contract only as prose scattered across audit references. A content-heavy surface — an article, documentation page, or dense dashboard — could ship without ever stating its line measure, container width, or line-height, so reading comfort was a claim with no fillable shape. A global or localized surface could ship with hard-coded `margin-left` and `text-align: left` that break the moment the layout flips to a right-to-left locale, with nothing flagging the physical-direction CSS. The external corpus already defines measured readability rows (chars-per-line, `ch`-unit max-width, line-height) and a localization/RTL shape (expansion proxy, logical properties, mirrored icons), but sk-design carried neither as a checkable field.

### Purpose
Port the measured *shape* of those two concerns into the shared `context_loading_contract.md`, append-only, as two conditional proof fields. Add a `READABILITY AND DENSITY` field that fires on content-heavy UI and carries the measured rows (measure 45-75 near 66, `ch`-unit max-width, line-height, decision count), with display type and short UI strings exempt. Add a `LOCALE STRESS` field that fires on global/localized UI and carries the locale rows (~130% expansion proxy, RTL logical properties, mirrored directional icons). Back the localization half with the one machine-checkable piece this phase ships: a §5 HARD GATES "Locale Stress / RTL" row and a documented RTL physical-direction lint stated as an exact deterministic `rg` rule. The fields make the claims fillable; the RTL rule makes the physical-direction half checkable. No new wired script ships — the lint is documented and deterministic-when-run, faithful to the single named target.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append a `### Readability And Density` conditional proof field under §4 REQUIRED PROOF FIELDS — measure (target 45-75, near 66 for sustained reading) with observed value and method, text container `max-width` in the `ch` unit, explicit `line-height`, decision count, and a `COMPLETE | GAPS | N/A` verdict; the field triggers on content-heavy UI (articles, documentation, dashboards, sustained-reading forms, dense settings) and exempts display type, logos, badges, counters, nav labels, and short UI strings
- Append a `### Locale Stress` conditional proof field under §4 — text-expansion proxy (validate at ~130% source-string length, German/Finnish worst case), RTL layout row (logical properties `margin-inline-start` / `padding-inline-start` / `text-align: start`; physical-direction CSS exceptions recorded), mirrored directional-icon row (arrows/chevrons mirror; logos/clocks/media-play do not), and a `COMPLETE | GAPS | N/A` verdict; the field triggers on global/localized/multilingual/RTL-reused UI
- Append a §5 HARD GATES "Locale Stress / RTL" row plus a documented RTL physical-direction lint — an exact `rg --pcre2` rule that flags physical `margin-left` / `margin-right` / `padding-left` / `padding-right` / `text-align: left` / `text-align: right` and exempts logical `margin-inline-start` / `margin-inline-end` / `padding-inline-start` / `padding-inline-end` / `text-align: start` / `text-align: end`; a hit blocks global/localized ready claims unless replaced with a logical equivalent or documented as an exception

### Out of Scope
- Any new or extended wired script — **no new `.py` or `.mjs` is added, and `proof_check.py` is not extended.** The RTL lint ships as a documented deterministic rule, deterministic-when-run, not an always-on wired gate. A `shared/scripts/rtl_lint.py` fork or a `proof_check.py --require-rtl-logical` flag is the declined fork (see §7), recorded for a separate amendment decision
- Any machine grading of measured-value quality — no script grades whether 66ch is the right measure or whether 130% expansion was truly validated; that stays author judgment (hybrid)
- `proof_check.py`, `audit_contract.md`, `audit_report_template.md`, `mode-registry.json`, and the proof/pre-flight cards — not touched by this phase
- R4's INTERACTION STATE MATRIX lane, R5's DECISION RATIONALE lane, and R6's AUDIT EVIDENCE accessibility coverage matrix in the shared contract — preserved, not edited
- The router, scorer, and benchmark fixtures — untouched; `hubRoute 34/29/5/0` is unaffected

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Modify | Append the `### Readability And Density` and `### Locale Stress` conditional proof fields under §4, the "Locale Stress / RTL" HARD GATES row under §5, and the documented RTL physical-direction lint (deterministic `rg` rule) under §5; append-only, every prior field/gate/calculator reference and the R4/R5/R6 lanes preserved |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Unchanged | No new or extended checker; the RTL lint is documented and deterministic-when-run, not wired into this script |
| `.opencode/skills/sk-design/design-audit/references/audit_contract.md` | Unchanged | Out of scope; not edited by this phase |
| `.opencode/skills/sk-design/mode-registry.json` | Unchanged | Out of scope; not edited; `hubRoute 34/29/5/0` unaffected |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Append the Readability And Density field under §4 | `context_loading_contract.md` §4 carries a `### Readability And Density` subsection with measure (45-75, near 66), `ch`-unit max-width, line-height, decision count, display/short-UI exemptions, and a `COMPLETE | GAPS | N/A` verdict; triggers on content-heavy UI |
| REQ-002 | Append the Locale Stress field under §4 | `context_loading_contract.md` §4 carries a `### Locale Stress` subsection with the ~130% expansion proxy (German/Finnish), RTL logical-property row, mirrored directional-icon row, and a `COMPLETE | GAPS | N/A` verdict; triggers on global/localized UI |
| REQ-003 | Append the documented RTL lint + HARD GATES row under §5 | §5 carries a "Locale Stress / RTL" HARD GATES row and an exact `rg --pcre2` rule that flags physical `margin-left/right`, `padding-left/right`, `text-align: left/right` and exempts the logical equivalents; the rule bites when run on a physical-property sample and passes on a logical-property sample |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Append-only; R4/R5/R6 lanes preserved | The contract diff is `+57 / -0` (zero existing non-blank lines removed); R4 Interaction State Matrix, R5 Decision Rationale, and R6 Audit Evidence accessibility coverage lanes are each present and intact at their §4 field plus their HARD GATES row |
| REQ-005 | Honest enforcement split recorded; scope clean | The hybrid presence-enforceable vs measured-quality-advisory split and the documented-rule vs declined-wired-script fork are recorded; no new `.py`/`.mjs`; `proof_check.py` / `audit_contract.md` / `audit_report_template.md` / `mode-registry.json` / cards untouched; `hubRoute 34/29/5/0` unaffected; no spec/packet/phase IDs in shipped text |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: §4 carries both new conditional proof fields — `### Readability And Density` (measure 45-75 near 66, `ch`-unit max-width, line-height, decision count, display/short-UI exempt) and `### Locale Stress` (~130% expansion proxy, RTL logical properties, mirrored directional icons) — each with a clear trigger and a `COMPLETE | GAPS | N/A` verdict.
- **SC-002**: §5 carries the "Locale Stress / RTL" HARD GATES row and the documented RTL physical-direction lint as an exact deterministic `rg` rule. The rule bites when run: it flags `margin-left: 8px;` and `text-align: left;` (physical) and does not match `margin-inline-start: 8px;` or `text-align: start;` (logical). The lint is the enforceable half but is documented-deterministic-when-run, not an always-on wired gate; the measured-value quality of the two fields stays advisory (hybrid).
- **SC-003**: Append-only and scope clean — the contract diff is `+57 / -0` (zero existing non-blank lines removed); R4's INTERACTION STATE MATRIX, R5's DECISION RATIONALE lane, and R6's AUDIT EVIDENCE accessibility coverage matrix are preserved; no new `.py`/`.mjs` added; `proof_check.py`, `audit_contract.md`, `audit_report_template.md`, `mode-registry.json`, and the cards untouched; `hubRoute 34/29/5/0` unaffected; the evergreen scan is clean; scope held to `context_loading_contract.md` only.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Whether the chosen measure / line-height / expansion proxy is RIGHT for the surface is not machine-checkable | A field can be filled with a poor 40ch measure and still pass presence | **Recorded as advisory (hybrid).** Field presence is convention-enforced for content-heavy/global surfaces; the measured-value quality stays author judgment — no script grades 66ch or 130% expansion |
| Risk | An always-on wired RTL lint would expand the spec's single named target | A new `rtl_lint.py` or a `proof_check.py --require-rtl-logical` flag touches files the spec does not name | **Declined fork.** The lint ships as a documented deterministic `rg` rule (deterministic-when-run), faithful to scope. The wired-script option is recorded for a separate amendment decision, not silently widened (see §7) |
| Risk | The append edits a file shared with R4/R5/R6 on §4 | An overwrite could drop a preserved lane | **Append-only and serialized last.** This R10 rebased on the latest contract and appended distinct §4 subsections; the diff is `+57 / -0` and the R4/R5/R6 lanes are intact |
| Dependency | §4 REQUIRED PROOF FIELDS + §5 HARD GATES structure | Green | The new fields follow the existing `###` + fenced `text` block convention; the lint follows the §5 deterministic-enforcement convention |
| Dependency | `rg` / ripgrep with `--pcre2` | Green | Lint runtime; the rule is stated inline so it is reproducible by any operator or CI step |
| Dependency | Sibling phases 004 / 005 / 006 (same file, §4 lane) | Green | Serialize: R4 → R5 → R6 → R10 (R10 last). Rebase on latest before appending; 006's in-place accessibility reshape accounted for |
| Dependency | readable-measure / localization-design corpus (read-only) | Green | Source of the measured readability and locale shapes; read, not edited |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The change is append-only to one file — two §4 conditional proof fields plus one §5 HARD GATES row and one documented lint block. No other proof field, gate row, calculator reference, or anchor is altered; the contract diff is `+57 / -0`.
- **NFR-I02**: No new code ships. The RTL lint is a documented deterministic rule, not a wired script; `proof_check.py` is byte-unchanged and is not extended to parse the new fields.

### Consistency
- **NFR-C01**: The new field names, shapes, and verdict vocabulary (`COMPLETE | GAPS | N/A`) follow the existing §4 proof-field convention, and the lint follows the §5 deterministic-enforcement convention, so the additions read the same as the established lanes.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Field triggering
- **Content-heavy surface**: the Readability And Density field fires; the author fills the measured rows.
- **Display type / short UI string**: exempt; the readability field marks N/A.
- **Global / localized / RTL-reused surface**: the Locale Stress field fires; the author fills the expansion, RTL, and icon rows.
- **Local-only surface**: the locale field marks N/A.

### RTL lint behaviour
- **Physical-direction CSS** (`margin-left`, `padding-right`, `text-align: left`): the documented rule flags it; a hit blocks a global/localized ready claim unless replaced or documented.
- **Logical-property CSS** (`margin-inline-start`, `padding-inline-end`, `text-align: start`): the rule does not match; the sample passes with no false positive.
- **Rule not run**: the lint is deterministic-when-run, not always-on; a surface that never runs it is not flagged by machine — the gate row requires it to be run or explicitly marked N/A.

### No-regression
- **R4/R5/R6 lanes**: the Interaction State Matrix, Decision Rationale, and Audit Evidence coverage lanes behave exactly as before; the additions sit beneath them.
- **Existing calculators**: `contrast_check.py` and `proof_check.py` references are untouched and still resolve.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One documentation contract — `context_loading_contract.md` — gaining two appended §4 fields and one appended §5 gate/lint block. No script, no schema, no new file.
- **Risk concentration**: The only judgment-bearing surfaces are whether the chosen measure / line-height / expansion proxy is right (advisory) and whether the RTL lint is actually run (deterministic-when-run, not always-on). Everything structural — both fields present with their trigger and verdict, the gate row present, the documented rule biting on physical CSS and passing on logical — is checkable. The blast radius is the shared design context contract only; the router, scorer, and benchmark fixtures stay untouched, so `hubRoute 34/29/5/0` is unaffected.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Are the two fields present and correctly shaped? **RESOLVED: Yes.** `### Readability And Density` (§4 line 216) carries measure 45-75 near 66, `ch`-unit max-width, line-height, decision count, and the display/short-UI exemptions; `### Locale Stress` (§4 line 241) carries the ~130% expansion proxy, RTL logical-property row, and mirrored directional-icon row. Both carry a `COMPLETE | GAPS | N/A` verdict.
- Does the RTL lint bite deterministically? **RESOLVED: Yes — when run.** The documented `rg --pcre2` rule (§5 lines 283-289) flagged `margin-left: 8px;` and `text-align: left;` (physical) and did not match `margin-inline-start: 8px;` or `text-align: start;` (logical) on a CSS sample. It is deterministic-when-run, gated by the §5 "Locale Stress / RTL" row, not an always-on wired gate.
- Was a new wired script added? **RESOLVED: No — declined fork.** No new `.py`/`.mjs` ships and `proof_check.py` is byte-unchanged. An always-on wired lint (a new `shared/scripts/rtl_lint.py` or a `proof_check.py --require-rtl-logical` flag) would expand the spec's single named target; it is recorded as a fork for a separate amendment decision, not silently built. Shipping the documented deterministic rule keeps this phase faithful to scope.
- Is the enforcement code-backed or advisory? **RESOLVED: Hybrid.** Field presence is convention-enforced (a content-heavy/global surface must fill the field), and the RTL rule is the deterministic-when-run half. The measured-value quality — is 66ch right here, was 130% expansion truly validated — stays advisory; no script grades it.
- Was the edit append-only and the R4/R5/R6 work preserved? **RESOLVED: Yes.** The contract diff is `+57 / -0` (zero existing non-blank lines removed). R4's INTERACTION STATE MATRIX, R5's DECISION RATIONALE lane, and R6's AUDIT EVIDENCE accessibility coverage matrix are each present and intact at their §4 field plus their HARD GATES row. This phase is the last writer in the §4 shared-file lane (R4 → R5 → R6 → R10).
- Was scope held to one file with `hubRoute` unaffected? **RESOLVED: Yes.** This phase touches `context_loading_contract.md` only; `proof_check.py`, `audit_contract.md`, `audit_report_template.md`, `mode-registry.json`, and the cards carry no change from it, so `hubRoute 34/29/5/0` is unaffected (no router, scorer, or fixture edited).

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
- Append-only addition of two §4 conditional proof fields (Readability And Density for content-heavy UI; Locale Stress for global UI) plus a §5 HARD GATES "Locale Stress / RTL" row and a documented RTL physical-direction lint (deterministic rg rule) to context_loading_contract.md
- Hybrid honest split: field presence convention-enforced; measured-value quality (66ch, 130% expansion) advisory. RTL lint is the enforceable half but documented-deterministic-when-run, NOT an always-on wired gate
- Documented-rule vs declined-wired-script fork: a new shared/scripts/rtl_lint.py or proof_check.py --require-rtl-logical would expand the single named target and needs an amendment; declined and recorded
- Append-only (+57/-0); R4 + R5 + R6 lanes preserved; R10 last in the §4 shared-file lane; hubRoute 34/29/5/0 unaffected; scope = context_loading_contract.md only; GENERATED_METADATA regenerated by the orchestrator
-->
</content>
