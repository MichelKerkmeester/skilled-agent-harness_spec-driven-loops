---
title: "Feature Specification: Phase 3: applicator-and-sentinels"
description: "A sentinel palette block per file and an applicator that themes the diagram corpus from its own token source, reproducing the stock bytes with `--default`."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: applicator-and-sentinels

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 3 gives `sk-design-diagram` what `sk-design-chart` already has: one sentinel-marked palette
block per file, and a third hand-run script that themes the corpus from its own token source. The
four templates each gain a `DIAGRAM_PALETTE:BEGIN skin=light|dark|terminal … :END` block wrapping
only their `--color-*` custom properties, and `apply-diagram-tokens.cjs` ports the chart's
four-function contrast module rather than importing it, since D12 freezes the chart skill. The
phase's own gate is mechanical: `apply-diagram-tokens.cjs --default` run over the four templates
must reproduce their stock bytes exactly, verified by an empty diff.

**Key Decisions**: one sentinel block per file, not the chart's begin/end pair (D1); the applicator
writes copies to `--out` and never edits `assets/templates/` in place (D3).

**Critical Dependencies**: 002's signed derivation record — its gate table and its three-list/
four-kind token-source shape — must exist before this phase can compute a real gate value rather
than a structural placeholder.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-skin-contract |
| **Successor** | 004-corpus-and-catalog |
| **Handoff Criteria** | `--default` reproduces the stock bytes over the four templates. Verified by: byte diff empty. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams specification.

**Scope Boundary**: the sentinel contract, the applicator script, the ported gate module, and the
token source's shape — nothing that repaints the 34 examples (004), nothing that checks the corpus
(005), and no new contract decision (002 signs those; this phase consumes them).

**Dependencies**:
- 002's signed derivation record (three lists, four kinds, gate table with `ungated`/`departs` rows).
- `sk-design-chart/scripts/apply-design-md.cjs` and `color-gates.cjs`, read-only porting sources.

**Deliverables**:
- `.opencode/skills/sk-design/sk-design-diagram/assets/color/diagram-palette.json` (token source).
- `.opencode/skills/sk-design/sk-design-diagram/scripts/color-gates.cjs` (ported gate module).
- `.opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs` (the applicator).
- One `DIAGRAM_PALETTE` sentinel block inserted into each of the four templates.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`DIAGRAM_PALETTE:BEGIN skin=light|dark|terminal … :END` blocks, one per file, in the four templates. The applicator as a third hand-run script: input the token source, gates computed at apply against three grounds through the ported four-function module, copies to `--out`, the shipped-default detection mechanized as a diff.

### Purpose
**Gate this phase ends on:** `--default` over the four templates reproduces the stock bytes; below-threshold outputs are refused; departs rows honored.

Named by phase 1's synthesis (`../001-upgrade-research/research/research.md`); the order is forced by the standard's own doctrines and is not a preference.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `DIAGRAM_PALETTE:BEGIN skin=light|dark|terminal … :END` sentinel contract: one block per
  file, placed inside the existing `:root` rule, wrapping only that file's `--color-*` custom
  properties.
- `apply-diagram-tokens.cjs`: its CLI surface, the token-source read path, gate computation via the
  ported module against the three grounds, the copy-out write model, and `--default`'s
  byte-identical reproduction of the stock templates.
- Porting `color-gates.cjs`'s four exports (`channel`, `luminance`, `contrast`, `round2`) into the
  diagram skill's own `scripts/` as a new, independently owned file — not a cross-skill import.
- The token source's shape: the corrected 25-value census across three grounds, and how a
  treatment role (`#ffffff`) and a type-scoped role (`#3d4460`) are represented distinctly from a
  global chrome value.
- Inserting the sentinel blocks into the four templates themselves (`template.html`,
  `template-dark.html`, `template-full.html`, `template-terminal.html`), so the committed template
  state matches what `--default` reproduces.

### Out of Scope
- Repainting the 34 examples' 1,577 literals — that is 004's job, driven by this phase's
  applicator once it exists.
- The corpus checker and its mutation suite — that is 005's job; D4 forbids a checker before the
  corpus passes it.
- Signing the seven contract decisions or the derivation record's content — that is 002's job;
  this phase consumes what 002 signs, it does not re-open it.
- Documenting the fallback-chain prose gap in `style-guide.md` §2 — already 002's T013 (F3.2); not
  repeated here.
- A capture-review pass or a CI gate — 006 and 005 respectively.
- Any change to `sk-design-chart`'s own files — D12 is a hard block; the port is a new file inside
  the diagram skill, not an edit to a chart-owned path.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-diagram/assets/color/diagram-palette.json` | Create | The token source: 25 distinct values across three grounds, four kinds |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/color-gates.cjs` | Create | Ported four-function contrast module (`channel`, `luminance`, `contrast`, `round2`) |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs` | Create | The applicator: CLI, gate checks, copy-out write model, `--default` |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/template.html` | Modify | One `DIAGRAM_PALETTE:BEGIN skin=light … :END` block inserted in `:root` |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/template-dark.html` | Modify | One `skin=dark` block inserted |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/template-full.html` | Modify | One `skin=light` block inserted, wrapping its larger 10-property color set |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/template-terminal.html` | Modify | One `skin=terminal` block inserted |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The sentinel contract MUST be `DIAGRAM_PALETTE:BEGIN skin=light\|dark\|terminal … :END`, exactly one block per file, wrapping only that file's `--color-*` custom properties inside its existing `:root` rule (D1; F2.3). |
| REQ-002 | `apply-diagram-tokens.cjs` MUST read the diagram's own token source, compute gates against the three grounds through the ported four-function module, and write themed copies to `--out`, never editing `assets/templates/` in place (D3; F3.4). |
| REQ-003 | `apply-diagram-tokens.cjs --default` run over the four templates MUST reproduce their stock bytes exactly — the phase's own handoff gate to 004 (F3.4). |
| REQ-004 | `color-gates.cjs`'s four exports (`channel`, `luminance`, `contrast`, `round2`) MUST be ported verbatim into a new diagram-owned module; the applicator MUST NOT require a chart-skill path at runtime (D12). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The token source's shape MUST hold the 25-value census across three grounds (light, dark, terminal), with a treatment role (`#ffffff`) and a type-scoped role (`#3d4460`) represented distinctly from a global chrome value (D1; F2.1). |
| REQ-006 | A computed ratio below the derivation record's signed gate MUST refuse the applicator's run, except a row the derivation record marks as a recorded departure (the accent at 2.863:1), which MUST be honored rather than refused (D8). |
| REQ-007 | The chart's second `_DARK` sentinel pair MUST NOT transfer to the diagram; the contract MUST state why (0/38 files use `prefers-color-scheme`) (D1). |

### P2 - Nice to have

| ID | Requirement |
|----|-------------|
| REQ-008 | Font custom properties inside `:root` MUST stay outside the sentinel and untouched by the applicator, since D2 already ships their fallback chains. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `apply-diagram-tokens.cjs --default --out <dir>` followed by `diff -rq <dir> assets/templates` reports no differences.
- **SC-002**: Each of the four templates carries exactly one `DIAGRAM_PALETTE:BEGIN` block (`grep -c` reports `1` per file).
- **SC-003**: Zero templates carry a `DIAGRAM_PALETTE_DARK` marker.
- **SC-004**: `color-gates.cjs` exists in the diagram skill's own `scripts/` and exports exactly `channel`, `luminance`, `contrast`, `round2`.
- **SC-005**: An applicator run painting the accent does not fail on its signed 2.863:1 departure, while any other sub-gate ratio below its gate still fails the run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002's signed derivation record (gate table, three-list/four-kind shape) | Without it, the applicator cannot compute a real gate value, only a structural placeholder | T001's operator ratification gates T002 onward |
| Dependency | `sk-design-chart/scripts/color-gates.cjs`, `apply-design-md.cjs` (read-only porting source) | A chart-skill change mid-phase would break the porting reference | D12 freezes the chart skill; `git diff` over it stays empty for this phase |
| Risk | Sentinel wrap boundary ambiguity (color-only vs. whole `:root`) | Inconsistent application across the four templates | ADR-003 states the exact boundary; T008/T009 grep-verify the shape |
| Risk | `--default`'s byte diff is not truly empty (whitespace or line-ending drift) | Blocks the phase's own handoff gate to 004 | T007 runs the actual diff, not a visual read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies. The applicator is a hand-run local script processing four HTML files under ~500 lines each, not a service.

### Security
- **NFR-S01**: No auth surface. The applicator reads only local paths — it rejects a URL argument, mirroring the chart applicator's own `isUrl` refusal — and refuses to write inside `assets/templates/` in place.

### Reliability
- **NFR-R01**: No uptime target applies. Determinism target: given the same token source and the same script version, `--default`'s output is byte-identical across runs — no timestamp, no non-deterministic ordering inside a sentinel block.

---

## 8. EDGE CASES

### Data Boundaries
- A file with no sentinel block: the applicator's run over that file fails closed rather than silently skipping it — there is no block to replace.
- A file with two sentinel blocks: the applicator refuses (D1 — a file carries exactly one skin); T008's grep count catches this class before a second block could ship.
- A `skin=` value outside `light|dark|terminal`: refused at parse time, mirroring the chart's `--scheme` validation (`fail('--scheme must be light, dark, or both')`).

### Error Scenarios
- A template's `:root` was hand-edited after generation (a `--color-*` declaration added or removed outside a sentinel-tracked run): the region-replace either fails to find its expected declaration set or overwrites an untracked line; T007's byte diff is the safety net that catches this before 004 builds on it.
- A computed ratio falls below its signed gate: the run fails, naming the gate, the ratio, and the nearest clearing value (mirroring `nearestClearing()`'s message shape) — except a `departs` row (the accent at 2.863:1), which is honored, not refused.
- The `untokenized` kind (a fixed skin, e.g. `example-sequence-oauth-dark.html` — out of this phase's four-template scope): the token source's classification must let the applicator skip it rather than force a themed value; 004 enforces this against the examples, this phase only states the contract.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 7 create/modify (3 new scripts/data, 4 template edits); LOC: ~150-250 new script code; Systems: 1 (diagram skill) |
| Risk | 8/25 | Auth: N, API: N, Breaking: N for shipped diagrams — but the sentinel wraps a file every future diagram copies from |
| Research | 6/20 | Reads two existing chart files in full plus 002's signed derivation record; no external research |
| Multi-Agent | 5/15 | Three executor roles: operator (T001), GLM (T002-T009), human review (T010) |
| Coordination | 8/15 | Blocks 004's repaint entirely (D4's forced order); depends on 002's derivation record landing first |
| **Total** | **37/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | 002's derivation record's gate table is not operator-ratified before this phase starts building | H | M | T001 requires ratification before T002-T006 begin |
| R-002 | Sentinel wrap boundary implemented inconsistently across the four templates | M | L | ADR-003 states the exact boundary; T008/T009 grep-verify count and shape |
| R-003 | `--default`'s byte diff is not truly empty due to serialization drift between the token source and the hand-authored template | M | M | T007 runs the actual diff before the gate is claimed met, not a visual read |

---

## 11. USER STORIES

### US-001: The repaint has a working applicator to drive (Priority: P0)

**As** 004's repaint, **I want** `apply-diagram-tokens.cjs` and its token source to already exist and pass their own byte-diff gate, **so that** 004 has a working applicator to drive the corpus repaint instead of hand-editing 1,577 literals.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001 through AC-003).

---

### US-002: The checker has a stable marker to key off (Priority: P1)

**As** the 005 checker, **I want** a `DIAGRAM_PALETTE` sentinel contract it can grep for, **so that** its two-directional palette-vs-source comparison (mirroring the chart's `check-corpus.cjs`) has a stable marker to key off.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-007).

---

## 12. OPEN QUESTIONS

- Whether `apply-diagram-tokens.cjs` needs a `--forms`/`--all` selector like the chart's (to later theme the 34 examples in 004), or whether 004 adds that flag itself when it extends the applicator beyond the four templates — left to 004 to decide against its own actual repaint needs, since this phase's own gate only requires the four templates.
- Whether `template-full.html`'s `--color-rule` and `--color-rule-solid` (rgba spellings of `--color-ink` and `--color-muted`) need their own token-source kind, since they are derived from two other tokens rather than independently measured — flagged for T001's ratification against 002's four-kind model.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md`'s `L3: ARCHITECTURE DECISION RECORD` section — this packet carries no separate `decision-record.md` file

---
