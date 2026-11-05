---
title: "Feature Specification: Phase 1: render-checks-and-gate"
description: "The render rules the 066 program enforced by hand have no check, the completion gate runs without --strict and the scan skips SKILL.md, ROUTER.md and hub shared trees. This phase adds the missing checks, one strict gate, a wider scan, a CI sweep and a ledger ratchet."
trigger_phrases:
  - "render checks and gate"
  - "phase 1 render checks and gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 1: render-checks-and-gate

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The shared validator misses the rule classes that produced most of the 066 findings, and the sk-create-skill gate never promotes render findings to errors. This phase adds overview, section-reference and intro checks, fixes four check defects, makes the gate `validate_skill_package.py <path> --strict` everywhere, scans SKILL.md, ROUTER.md and hub `shared/` trees, and runs a fleet sweep and a ledger ratchet in CI. The new codes and the newly scanned paths stay advisory under `--strict` until phase 003 clears the fleet, so `package_skill.py --check --strict` still exits 0 for all 13 skills and the ledger's `debt` stays `{}`.

**Key Decisions**: Advisory until 003: new codes and newly scanned paths sit in staged sets that `--strict` does not promote, and the ledger stays empty (ADR-001, operator decision 2026-11-05), host the sweep and ratchet in `sk-doc-script-tests.yml` (ADR-002)

**Critical Dependencies**: None upstream. Phases 002 and 003 build on this phase's checks.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-exempt-and-rewrite-guard |
| **Handoff Criteria** | New checks ship with fixtures, the ratchet runs in CI and all 13 skills pass `package_skill.py --check --strict` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-create-skill readability refinements: render checks, strict gate, exempt map, rewrite guard and templates specification.

**Scope Boundary**: Validator code, packaging code, their tests, one CI workflow and the gate wording in sk-create-skill docs. Template restructures and fleet fixes belong to phase 003.

**Dependencies**:
- The review report at `../scratch/review-report.md`, items 1, 2, 3, 4, 7, 8, 11, 13 and 14.

**Deliverables**:
- New checks `render_overview_subsections`, `render_section_reference`, `render_intro_missing`, `render_intro_pointer` and a per-sentence restate check.
- Fixes to `render_section_order`, `bold_label_join`, `h2_numbering` and the stale-debt message.
- One strict gate command, a wider packaging scan, a CI fleet sweep and `render-known-debt-ratchet.test.cjs`.
- Staged sets `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES` in `package_skill.py`, the `render advisory` marker and the `RENDER_STAGED_OFF=1` switch.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The largest mechanical finding class in 066, overview without Purpose and When to Use, has no check because `template-rules.json` gives references only `requiredSections ["overview"]`. The completion gate at `sk-create-skill/SKILL.md:93` and `:246` runs `validate_skill_package.py` without `--strict`, so render findings stay warnings, and packaging reads only `references/` and `assets/`. A live finding sits ungated in `system-deep-loop/runtime/references/integration-points.md`, and no workflow runs the validator or a render ledger ratchet.

### Purpose
Every render rule the review names as checkable is a check with a fixture, the gate is strict everywhere, the scan covers SKILL.md, ROUTER.md and hub `shared/` trees, and CI fails on a new finding or a raised ledger count.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n "validate_skill_package" .skilled/skills/sk-doc/sk-create-skill/SKILL.md
93:29. Run `scripts/validate_skill_package.py <path/to/skill-folder>` before claiming the skill is complete.
246:scripts/validate_skill_package.py <path/to/skill-folder>
283:10. Run `scripts/validate_skill_package.py <path>` before calling the scaffold complete.
316:- `scripts/validate_skill_package.py <path>` exits clean, or exact blockers are reported.

$ python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-deep-loop/runtime/references/integration-points.md
✅ VALID: .skilled/skills/system-deep-loop/runtime/references/integration-points.md
Document type: reference
Total issues: 1
⚠️ Warnings (1):
  - [render_h2_numbering] Unnumbered H2 "7.1 ADDITIONAL CONSUMERS" among numbered peers; number every section.
exit=0

$ for s in .skilled/skills/*/; do n=$(basename $s); python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py $s --check --strict >/dev/null 2>&1; echo "$n exit=$?"; done
cli-classifier exit=0 ... system-spec-kit exit=0   (13 lines, all exit=0, middle lines elided)

$ bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh | tail -1
all sk-doc script tests passed   (49 PASS lines)

$ node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs
ℹ tests 103 / ℹ pass 103 / ℹ fail 0   (summary lines joined)

$ node --test .skilled/bin/tests/compiled-route-*.test.cjs
ℹ tests 101 / ℹ pass 101 / ℹ fail 0   (summary lines joined)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `render_overview_subsections` to the validator and its rule data (item 1, validator part).
- Make `validate_skill_package.py <path> --strict` the one gate command in SKILL.md, creation-workflow and README, and drop the stale "frontmatter only" framing (item 2).
- Scan SKILL.md, ROUTER.md and hub `shared/` trees in packaging, and add a CI sweep of `.skilled/skills` that reports staged findings as advisory and fails only on enforced ones (item 3).
- Add the staged sets `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES`, the `render advisory` marker and the `RENDER_STAGED_OFF=1` switch to `package_skill.py` (ADR-001).
- Add `render-known-debt-ratchet.test.cjs` with a frozen fixture (item 4).
- Add `render_section_reference` (item 7) and the three intro checks (item 8, checks only).
- Fix the `related` substring match (item 11), the four small check defects (item 13) and the fence-blind SKILL.md section scan (item 14).

### Out of Scope
- Template OVERVIEW and intro wording - phase 003 owns template edits for items 1 and 8.
- The exempt loader and pinned list - phase 002 owns item 5.
- Fixing fleet docs the new checks flag - phase 003 clears them, and until then they print as advisory warnings.
- README render checks - item 9 waits for the README OVERVIEW decision in phase 003.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | New checks for items 1, 7 and 8, fixes for items 11 and 13 |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modify | Overview subsection rules for reference and asset |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modify | Wider `_render_findings` scan, fence-aware section scan, render-check marker on the stale-debt message, staged sets with the `render advisory` marker and the `RENDER_STAGED_OFF` switch |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs` | Create | Ratchet over debt counts and exempt keys |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/` | Modify | Frozen snapshot of the empty debt, the exempt keys and the staged sets for the ratchet |
| `.skilled/skills/sk-doc/scripts/tests/render/` | Modify | Positive and negative fixtures per new or fixed check |
| `.skilled/skills/sk-doc/scripts/tests/test_*.py` | Modify or Create | Pytest cases that run the fixtures |
| `.github/workflows/sk-doc-script-tests.yml` | Modify | Ratchet step and fleet sweep step |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | Modify | One strict gate command |
| `.skilled/skills/sk-doc/sk-create-skill/README.md` | Modify | One strict gate command |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` | Modify | One strict gate command, stale framing dropped |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md` | Modify | Retire the `\##` escape advice |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Item 1. `validate_document.py` gains `render_overview_subsections`: a reference OVERVIEW needs `### Purpose` then `### When to Use`, an asset OVERVIEW needs `### Purpose` then `### Usage`. Evidence: references get only `requiredSections ["overview"]` in `template-rules.json`, and 80 of 479 references opening with OVERVIEW lack `### Purpose`. A fixture fires and a fixed copy clears |
| REQ-002 | Item 2. One gate command, `validate_skill_package.py <path> --strict`, appears in `sk-create-skill/SKILL.md` Validation, creation-workflow and README, and "The gate reads resource frontmatter only" is gone. Evidence: `SKILL.md:93` and `:246` lack `--strict`, `validate_skill_package.py:264-270` keeps render findings as warnings, `creation-workflow.md:335` is stale since `package_skill.py:280` promoted "render check" |
| REQ-003 | Item 3. `package_skill.py` render scan covers SKILL.md, ROUTER.md and hub `shared/` trees (`sk-code/shared/references`, `sk-doc/shared/references`, `cli-external-orchestration/shared/references`) and `system-deep-loop/runtime/references`. Evidence: `_render_findings` reads only `references/` and `assets/` (`package_skill.py:138`, `941-960`). The sweep reports `integration-points.md` as a `render advisory:` warning until phase 003 fixes it |
| REQ-004 | Item 3. A CI step sweeps every skill under `.skilled/skills` with `package_skill.py --check --strict`. Staged findings print as advisory warnings, and the step fails only on an enforced finding. Evidence: no `.github/workflows` file runs `validate_document` or `package_skill` |
| REQ-005 | Item 4. `render-known-debt-ratchet.test.cjs` compares the live ledger and the staged sets with a frozen fixture. It fails when `debt` gains an entry, an exempt key appears, or a code or scope is added to a staged set. Removing a staged entry is allowed. Evidence: only the routing-shape ledger has a ratchet, run by `routing-registry-drift.yml:198-203`, while `render-known-debt.json:2` says "never raise one" with no test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Item 7. `render_section_reference` flags an in-file `§N` or `Section N` that matches no H2 number and title, and resolves `file.md §N` with the regex from `inbound-anchors.py`. Evidence: 22 findings, mostly P1, such as `system-deep-loop/deep-research/SKILL.md:229` and `deep-review/references/protocol/loop-state-and-gates.md:93` |
| REQ-007 | Item 8, checks only. Add `render_intro_missing`, `render_intro_pointer` with the closed phrase list from `rubric.md:4`, and a per-sentence restate check against Purpose and description. Evidence: `_render_intro_restates_purpose` compares the whole intro (`validate_document.py:1250-1265`), so a two-sentence intro copying Purpose verbatim raised nothing, and 066 found 75 pointer intros and 66 missing intros |
| REQ-008 | Item 11. `render_section_order` matches only a leading `related` token or the alias set. Evidence: `validate_document.py:1117-1121` matches the substring, so RELATED SPECS, UNRELATED CHANGES and CORRELATED SIGNALS match, which pushed a rename in `system-spec-kit/references/templates/level-specifications.md:649` |
| REQ-009 | Item 13. `bold_label_join` ignores a two-space hard break, `h2_numbering` treats `7.1` as a sub-number and not "Unnumbered", gaps and duplicates such as `## 1, ## 3, ## 3` are reported under a new code that joins `RENDER_STAGED_CODES`, and the stale-debt message carries the "render check" marker so strict promotes it |
| REQ-010 | Item 14. The SKILL.md section scan at `package_skill.py:461-462` skips fenced lines with `_fenced_spans` (`validate_document.py:1202`), so a fenced example heading never satisfies a required section, and the `\##` escape advice at `common-pitfalls.md:33` is retired |
| REQ-011 | Advisory until 003, per the operator decision of 2026-11-05. `package_skill.py` lists the widened scan targets in `RENDER_SCAN_SCOPES` (`SKILL.md`, `ROUTER.md`, `shared/references`, `runtime/references`), and each render finding records the scope that selected it, `references` and `assets` being the existing scopes. `RENDER_STAGED_CODES` holds every render code this phase adds. `RENDER_STAGED_SCOPES` holds every scope this phase adds plus `README.md`, which phase 003 adds to the scan for item 9. A finding whose code is in `RENDER_STAGED_CODES` or whose scope is in `RENDER_STAGED_SCOPES` prints as `render advisory:`, which `STRICT_PROMOTED_MARKERS` does not match, so `--strict` leaves it a warning. Every other render finding keeps `render check:` and stays enforced. The `debt` object in `render-known-debt.json` stays `{}` |
| REQ-012 | `RENDER_STAGED_OFF=1` makes both staged sets inert, so every staged finding prints as `render check:` and `--strict` enforces it. Phase 003 uses it to list a skill's findings before fixing them |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new or fixed check has a fixture that fires on the bad form and clears on the good form, and `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`.
- **SC-002**: `rg -n "validate_skill_package.py" .skilled/skills/sk-doc/sk-create-skill/SKILL.md .skilled/skills/sk-doc/sk-create-skill/README.md .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` prints only lines that carry `--strict` or name the script without a command.
- **SC-003**: Adding a debt entry or a staged code to a copy makes `render-known-debt-ratchet.test.cjs` fail, and the 13-skill strict loop exits 0 with staged findings printed as `render advisory:` warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `rubric.md:4` phrase list and `inbound-anchors.py` regex in the 066 scratch tools | The intro and section-reference checks need them | Copy the phrase list and regex into the validator with a test, do not import from a spec folder |
| Risk | New checks raise many fleet hits and turn the strict gate red | High | Stage the new codes and newly scanned paths as advisory (ADR-001), and freeze the staged sets in the ratchet so they can only shrink |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fleet sweep finishes inside the existing 10-minute `sk-doc-script-tests.yml` job timeout.

### Security
- **NFR-S01**: N/A. The checks read markdown under the repository and write nothing outside test temp dirs.

### Reliability
- **NFR-R01**: The checks stay quiet on clean docs. A sweep of a clean skill reports 0 findings for every new check.

---

## 8. EDGE CASES

- Empty input: a reference with no OVERVIEW raises the existing required-section finding, not a subsection finding.
- Maximum input: the sweep covers every doc under `.skilled/skills` that packaging reads, about 8,175 docs per the review.
- Failure path: a new debt entry or a new staged code makes the ratchet test exit non-zero and name the addition.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: about 13, LOC: about 600, Systems: validator, packager, CI |
| Risk | 12/25 | Auth: N, API: N, Breaking: Y for the strict gate wording |
| Research | 6/20 | Evidence already gathered in the review report |
| Multi-Agent | 6/15 | Workstreams: 2, checks and gate |
| Coordination | 9/15 | Dependencies: phases 002 and 003 build on it |
| **Total** | **51/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A staged code hides a real new finding until phase 003 | M | M | Staged findings still print on every run, the ratchet forbids adding to the staged sets, and phase 003 must empty them before close |
| R-002 | The `related` fix changes which section counts as last and flags docs that passed | M | L | Run the fleet sweep before and after the fix and fix the delta in this phase, since `render_section_order` is an existing enforced code |
| R-003 | Fence-aware section scan makes a skill that relied on a fenced heading fail | M | L | The 13-skill strict loop runs after the change, and any failure is fixed in the SKILL.md |

---

## 11. USER STORIES

### US-001: Strict gate catches render findings (Priority: P0)

**As a** skill author, **I want** the one gate command to fail on a render finding, **so that** a skill never ships with a broken overview or section order.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: CI catches a new finding (Priority: P1)

**As a** maintainer, **I want** CI to sweep every skill and ratchet the ledger, **so that** no change raises the render debt unseen.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Is leaving hub `shared/` trees out of packaging deliberate? Nothing found says so. Decision: scan them unless a reason turns up in T001.
- How do the new checks avoid turning the gate red before phase 003? Closed: the operator chose advisory until 003 on 2026-11-05. The staged sets keep them warnings and the ledger stays empty (ADR-001).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Review report**: See `../scratch/review-report.md`

---
