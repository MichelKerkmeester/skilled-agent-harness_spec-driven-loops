---
title: "Feature Specification: catalog enforcement and coverage"
description: "The catalog validator covers 8 of 26 feature-catalog packages (66 of 804 leaves), runs four narrow check families rather than the standard's eight rules, and exits 0 on its default invocation while printing FAIL: 19 violations. This phase settles the four rulings both siblings depend on, switches discovery to feature-catalog presence, adds six unenforced checks with paired fixtures, and wires a gate that actually fails."
trigger_phrases:
  - "catalog validator coverage"
  - "validate_catalog_package discovery"
  - "feature catalog enforcement rulings"
  - "catalog bijection phantom row"
  - "feature leaf definition ruling"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/023-feature-catalog-integrity"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the enforcement-and-coverage phase from the track C synthesis"
    next_safe_action: "Run T001 confirm-against-HEAD before any edit"
    blockers:
      - "Q8 discovery rule, Q3 staged severity, and Q4 gate point are operator decisions"
    key_files:
      - "spec.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "Q1 mcp-code-mode applicability"
      - "Q2 description-parity strictness"
      - "Q3 staged or big-bang severity"
      - "Q4 gate point and severity"
      - "Q6 volatile-value policy"
      - "Q8 discovery rule"
    answered_questions: []
---
# Feature Specification: Catalog Enforcement and Coverage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

> Phase adjacency under the `sk-doc/023-feature-catalog-integrity` parent: no predecessor; successors
> `002-hub-catalog-truth-repair` and `003-large-surface-catalog-reconciliation` both depend on the rulings recorded here.

---

## EXECUTIVE SUMMARY

Catalogs drift because almost nothing checks them. Measured on the working tree at `skilled/v4.0.0.0` on 2026-07-30:
the repo holds 26 `feature-catalog/` packages with 804 leaves, the validator's closed set covers 8 packages and 66
leaves, and the default invocation reports `FAIL: 19 violation(s)` while returning exit code 0. This phase is the
keystone: it settles four rulings, widens coverage, adds the checks that would have caught the sibling findings, and
wires the result to something that fails.

**Key Decisions**: discovery keyed on `feature-catalog/` presence rather than `hub-router.json` (Q8); fail-closed by
default with an explicit report-only escape; staged per-package severity so 104 orphans do not land as one wall (Q3).

**Critical Dependencies**: operator answers to Q1, Q2, Q3, Q4, Q6, Q8; the shared count-derivation helper coordinated
with `036/032`; the manifest walker coordinated with `sk-doc/022/001`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc/023-feature-catalog-integrity` |
| **Findings** | 5 (0 P1, 5 P2) — gates every P1 in `002` and `003` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`validate_catalog_package.py` builds its covered set from `expected_root_packages()`, which returns
`system-skill-advisor` plus every skill directory carrying a `hub-router.json`. That is **8 packages, 66 leaves**
against a corpus of **26 packages, 804 leaves** — 8.2% coverage. The catalogs with the worst confirmed drift are
outside it by construction: `system-spec-kit` (348 leaves) and `sk-git` (11 leaves) are hub-root catalogs excluded
purely because they are single skills rather than mode hubs, and every `sk-git` finding in this track lives in an
ungated catalog. Inside the covered set the validator runs four check families (sk-doc workflow-mode parity, root-to-leaf
bijection, SOURCE FILES path existence, taxonomy), which leaves the standard's title parity, description parity,
dark-vs-shipped labeling, packet-history rejection, prose-path checking, and volatile-count freshness unchecked. And
the default invocation exits 0, so it is a report nobody is required to read.

Two blind spots are load-bearing and were measured, not inferred. First, the bijection check only reads markdown links,
so a root table row naming a `.md` in **plain text** passes silently — which is exactly how the advisor's
`hooks-and-plugin/opencode-hook.md (not yet authored)` row survived and produced a 42-vs-41 feature count. Second, the
source-path check only reads `File`-column table cells, so a retired path in **prose** is invisible — which is why the
research inherited the validator's blind spot and counted seven mirrored compiled-routing files when there are eight.

### Purpose
Make the standard enforceable before the siblings repair anything, so the repairs land on a corpus that cannot silently
re-rot. Three deliverables: four rulings recorded in a decision record both siblings cite; a widened, deepened,
fail-closed validator; and a real gate.

### Non-Goals
- Repairing any catalog content. Every content repair belongs to `002` or `003`.
- Authoring an `mcp-code-mode` catalog. This phase owns only the Q1 ruling and the two README corrections.
- Changing advisor routing. Catalogs do not feed it today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four rulings, recorded in `decision-record.md` and cited by both siblings: covered set (Q8), feature-leaf definition,
  description-parity strictness (Q2), `mcp-code-mode` applicability (Q1).
- Validator discovery, check roster, exit-code contract, and gate wiring.
- Six new checks, each shipping a positive and a negative fixture.
- The two `mcp-code-mode` README corrections, which are wrong today under either Q1 answer.
- A shared count-derivation helper in `.opencode/skills/sk-doc/shared/scripts/`, coordinated so `036/032` and
  `sk-doc/022/001` consume one definition rather than three.

### Out of Scope
- Any catalog content edit. `002` and `003` own those.
- Authoring an `mcp-code-mode` catalog if Q1 answers yes — that becomes child `004`.
- Turning `fail` severity on for packages that are not yet clean. Q3's staged ladder governs promotion.

### Findings in Scope

| ID | Sev | Disposition in this phase |
|----|-----|---------------------------|
| `RC-001-01` | P2 | Not a defect. The 425-leaf hub-catalog baseline becomes the validator's expected-inventory fixture. Reproduced exactly (3+2+2+12+2+11+2+2+41+348 = 425). |
| `RC-001-02` | P2 | Census correction: eleven skill roots, not twelve. `system-code-graph` holds only `mcp-server/` (no `SKILL.md`, no metadata) and is runtime data. It must stay excluded from the covered set, and the coverage assertion must not flag it. |
| `RC-001-03` | P2 | `mcp-code-mode` applicability ruling. **OPERATOR-DECISION (Q1).** |
| `RC-003-03` | P2 | Feature-leaf definition ruling: what counts as a feature leaf versus a category overview or a retirement record. Unblocks the 94 `system-spec-kit` orphans for `003`. |
| `RC-007-07` | P2 | `mcp-code-mode` ruling evidence from the README angle. **OPERATOR-DECISION (Q1)** for the catalog question; the two README inaccuracies are fixed here regardless. |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | Modify | Discovery, six checks, exit-code contract, coverage assertion |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` | Modify | Feature-leaf definition; volatile-value policy per Q6 |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` | Modify | Description-parity strictness per Q2 |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/SKILL.md` | Modify | Document the covered set and the enforced rule roster |
| `.opencode/skills/sk-doc/shared/scripts/` | Create | Count-derivation helper shared with `036/032` and `sk-doc/022/001` |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/` fixtures tree | Create | Paired positive/negative fixtures, one pair per new check |
| `.opencode/skills/mcp-code-mode/README.md` and its scripts README | Modify | Two confirmed inaccuracies |
| CI workflow on `skilled/v*` and a `/doctor` route | Modify | **OPERATOR-DECISION (Q4)** |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Discovery is presence-based, not a named list | `expected_root_packages()` derives its set from directories containing `feature-catalog/`; running it on the working tree returns the ruled set, and a unit test fails if a new `feature-catalog/` directory appears outside that set. **OPERATOR-DECISION (Q8).** |
| REQ-002 | Non-zero exit on FAIL is the default | Invoking the validator with no flags on a tree with at least one violation returns a non-zero exit code. A `--report-only` flag preserves today's advisory behavior for humans. Baseline to beat: today the default prints `FAIL: 19 violation(s)` and returns 0; `--strict` already returns 1. |
| REQ-003 | Phantom-row detection | A root-table row naming a `*.md` target that is plain text rather than a markdown link is reported as a violation. The negative fixture is the advisor's literal `hooks-and-plugin/opencode-hook.md (not yet authored)` row, which must go from pass to fail. |
| REQ-004 | Prose-path checking | A retired or nonexistent repo path cited in leaf or root **prose**, not only in a `File` column cell, is reported. The negative fixture is `system-spec-kit/feature-catalog/governance/feature-flag-governance.md`, which cites a retired compiled-routing directory in prose and passes today. |
| REQ-005 | Root-H3-to-leaf-title parity | A leaf whose frontmatter `title` differs from its root catalog H3 is reported. This is literal in the standard already. |
| REQ-006 | Description-parity check at the ruled strictness | The check implements whichever strictness Q2 rules, and the snippet template is amended to state the rule. **OPERATOR-DECISION (Q2).** |
| REQ-007 | Packet-history metadata rejection | `Source phase:` and feature-ID history fields in leaf metadata are reported. The standard is verbatim "Packet-history free". |
| REQ-008 | Dark-vs-shipped labeling check | A feature with a populated SOURCE FILES table described as unshipped, or a feature labeled shipped with an empty or stub SOURCE FILES table, is reported. |
| REQ-009 | Four rulings recorded and citable | `decision-record.md` carries a decision for the covered set, the feature-leaf definition, description-parity strictness, and `mcp-code-mode` applicability, each with status and evidence, and both siblings cite it by path. |
| REQ-010 | Every new check ships paired fixtures | Each of REQ-003 through REQ-008 has one fixture that must pass and one that must fail; a test asserts both outcomes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Volatile-value policy implemented | Structural rosters are derived and freshness-checked; measurement snapshots are rejected from catalog prose. **OPERATOR-DECISION (Q6).** |
| REQ-012 | Staged per-package severity | Each package carries a severity of `warn` or `fail`; a package promotes to `fail` only when clean. The ladder is recorded so a reader can tell why a package is at `warn`. **OPERATOR-DECISION (Q3).** |
| REQ-013 | Gate wired to a real caller | The validator runs from CI on `skilled/v*` and from a `/doctor` route, at the ruled severity. **OPERATOR-DECISION (Q4).** |
| REQ-014 | Count-derivation helper has one definition site | A test asserts the helper is imported by the catalog validator rather than redefined, and the same module is the one `036/032` and `sk-doc/022/001` consume. |
| REQ-015 | `mcp-code-mode` README corrections | The "170+ tools across seven servers" inventory and the "no `package.json` exists" claim are corrected against the real configured manuals and the real `package.json` that runs the ABI check in `postinstall`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Coverage goes from 8 packages / 66 leaves to the ruled set, and a test proves coverage cannot silently
  narrow again.
- **SC-002**: The default invocation returns non-zero on a tree with violations; a seeded violation fails and a clean
  tree passes.
- **SC-003**: All six new checks have paired fixtures and both fixture outcomes are asserted by tests.
- **SC-004**: The measured blast radius is the acceptance baseline and is reproduced before and after: **104 orphan
  leaves and 0 dangling links across all 26 packages** (94 in `system-spec-kit`, 8 in `mcp-tooling/mcp-refero`, 1 in
  `mcp-click-up`, 1 in `deep-research`). No new dangling links appear.
- **SC-005**: `decision-record.md` records all four rulings, and `002` and `003` cite it rather than re-deciding.
- **SC-006**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator answers to Q1, Q2, Q3, Q4, Q6, Q8 | Six requirements cannot be finalized | Each is tagged `OPERATOR-DECISION`; the synthesis recommendation is recorded so the answer is a yes/no |
| Dependency | Shared count-derivation helper with `036/032` | Three copies of the same logic | Build once in `sk-doc/shared/scripts/`; REQ-014 asserts a single definition site |
| Dependency | Manifest walker with `sk-doc/022/001` | Duplicated manifest traversal | Share the walker; coordinate before either lands |
| Risk | Widening coverage produces a red wall | The gate cannot be turned on until `003` finishes, serializing the whole program | Staged per-package severity (REQ-012, Q3) |
| Risk | A new check is too strict and churns clean catalogs | Wasted edits across 804 leaves | Every check ships a positive fixture proving a conforming catalog still passes |
| Risk | The 14 unaudited nested catalogs fail unexpectedly | Surprise findings outside the researched set | Measured exposure is 10 orphans and 0 dangling links; they enter at `warn` |
| Risk | Validator runtime over 804 leaves is too slow for a push hook | A pre-push gate becomes a developer tax | Measure runtime before choosing pre-push; CI first (Q4) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full run over all 26 packages and 804 leaves completes within a budget measured during T002 and
  recorded before any pre-push wiring is proposed.

### Security
- **NFR-S01**: The validator reads only repository files and writes nothing outside its own report. No network access.
- **NFR-S02**: No fixture embeds a credential, token, or absolute machine-local path.

### Reliability
- **NFR-R01**: The validator is deterministic — two runs on an unchanged tree produce byte-identical JSON output.
- **NFR-R02**: A malformed or unreadable catalog file is reported as a violation, never a crash or a silent skip.

---

## 8. EDGE CASES

### Data Boundaries
- **A `feature-catalog/` directory with no `feature-catalog.md`**: reported as `missing_root_catalog`, already the
  current behavior, and must survive the discovery change.
- **A nested catalog inside another package** (for example `system-deep-loop/runtime/feature-catalog`): presence-based
  discovery finds it; the ruling decides whether it joins the same tier or a lower one.
- **A category overview file that is not a feature**: must not be counted as an orphan leaf once the feature-leaf
  definition lands.
- **`system-code-graph`**: holds only `mcp-server/` and is not a skill root. Presence-based discovery must not pick it
  up, because it has no `feature-catalog/`.

### Error Scenarios
- **A root table row pointing at a leaf that exists but is not linked**: this is the orphan case; it counts toward the
  104 baseline and is governed by staged severity.
- **A relative path that resolves outside the repo root**: rejected, never followed.
- **A leaf with no frontmatter**: reported against the parity checks rather than skipped.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | One Python validator, two asset templates, one SKILL.md, one shared helper, a fixtures tree, CI wiring |
| Risk | 7/25 | No runtime behavior; the risk is a gate that blocks CI or churns clean docs |
| Research | 8/20 | Four rulings, two of which are genuine standard ambiguities |
| Multi-Agent | 3/15 | Single workstream |
| Coordination | 8/15 | Six operator decisions plus two cross-track shared helpers |
| **Total** | **38/100** | **Level 3** |

Level 3 is earned by the decision record both siblings cite, not by LOC.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fail-closed default breaks an unrelated CI job that shells the validator | M | L | Grep for existing callers during T001; `--report-only` preserves old behavior |
| R-002 | Q3 answered big-bang, blocking the gate until `003` lands | M | M | Recommend staged; if big-bang is chosen, sequence the gate wiring after `003` |
| R-003 | Description-parity ruled literal, churning every catalog | M | L | Q2 recommendation is normalized; the template's own "do not repeat the root verbatim" instruction is the argument |
| R-004 | The shared helper lands in three places anyway | L | M | REQ-014 asserts a single definition site |
| R-005 | A new check has a false positive rate that erodes trust in the gate | H | L | Paired fixtures per check plus a full-corpus dry run before promotion |

---

## 11. USER STORIES

### US-001: An agent trusts what a catalog says (Priority: P0)

**As an** agent reading a hub's feature catalog, **I want** the inventory to be checked against the code, **so that**
I do not act on a capability that does not exist or miss one that does.

**Acceptance Criteria**:
1. Given a root catalog row that names a `.md` in plain text with no file behind it, When the validator runs, Then it
   reports a phantom-row violation.
2. Given a leaf citing a retired directory in prose, When the validator runs, Then it reports a missing path.

### US-002: A maintainer cannot silently narrow coverage (Priority: P1)

**As a** maintainer adding a new `feature-catalog/` directory, **I want** the covered set to include it automatically,
**so that** the enforcement surface tracks the corpus instead of drifting from it.

**Acceptance Criteria**:
1. Given a new `feature-catalog/` directory outside the ruled set, When the coverage test runs, Then it fails until the
   package is ruled in or explicitly ruled out with a recorded reason.

---

## 12. OPEN QUESTIONS

- **OPERATOR-DECISION (Q1)** — Does `mcp-code-mode` owe a feature catalog, or does a repaired README remain canonical?
  Recommendation: README stays canonical, repair it. If yes, the authoring becomes child `004`.
- **OPERATOR-DECISION (Q2)** — Leaf frontmatter `description`: literal equality or normalized? Recommendation:
  normalized, with the template amended to say so. The template requires `title` equality and semantic OVERVIEW
  correspondence, not frontmatter equality; adopting literal equality is an amendment, not a repair.
- **OPERATOR-DECISION (Q3)** — Staged per-package severity or big-bang? Recommendation: staged.
- **OPERATOR-DECISION (Q4)** — Gate point and severity? Recommendation: CI on `skilled/v*` at `fail` for promoted
  packages, plus a `/doctor` route. Not pre-push until runtime is measured.
- **OPERATOR-DECISION (Q6)** — Volatile values: ban or generate-plus-freshness-check? Recommendation: generate for
  structural rosters, ban for measurement snapshots.
- **OPERATOR-DECISION (Q8)** — Presence-based discovery or named additions? Recommendation: presence-based.
- Do the 14 unaudited nested packet catalogs join the same tier as hub roots, or a lower one? This is part of the
  covered-set ruling and has no recommendation until T001 measures them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent**: See `../spec.md`
