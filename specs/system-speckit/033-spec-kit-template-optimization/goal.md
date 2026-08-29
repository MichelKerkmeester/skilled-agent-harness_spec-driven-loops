---
title: "Operator Goal: 033 Spec-Kit Template Optimization"
description: "The operator-issued goal prompt governing packet 033, its decisions, constraints and proof plan, kept current as the phases execute."
trigger_phrases:
  - "033 goal prompt"
  - "spec kit template optimization goal"
  - "acceptance criteria goal"
importance_tier: "important"
contextType: "planning"
---

# Operator Goal: 033 Spec-Kit Template Optimization

> Issued 2026-08-29. This document is the directive the packet executes against.
> It is kept current: the Progress section below is updated as phases land.

---

## 1. OBJECTIVE

Restructure `system-speckit/033` into a phase parent, then add a canonical,
closure-blocking `acceptance-criteria.md` to the Level 2 / 3 / 3+ doc contract.
A packet cannot close until every AC row is met, waived, or superseded by an ADR.

---

## 2. GATE 3

`specs/system-speckit/033-spec-kit-template-optimization/` — phase parent.
Confirmed 2026-08-29; do not re-ask.

---

## 3. DECISIONS (operator-confirmed — do not re-litigate)

| ID | Decision |
|----|----------|
| **D1** | Restructure the existing `033-spec-template-context-optimization` in place: keep number 033, rename to `033-spec-kit-template-optimization`, demote its current docs into child `001-`. Do not absorb packet 036. |
| **D2** | `acceptance-criteria.md` is the CANONICAL AC home. `spec.md` keeps REQ IDs and drops its AC column; user-story AC blocks move out. `check-ac-coverage.sh` counts from the new doc. |
| **D3** | Forward-only rollout. Packets at/after a dated cutoff must carry the doc; older packets stay advisory. No backfill of the 2,588 existing Level 2/3/3+ packets. |

---

## 4. PHASE MAP

| Phase | Folder | Role |
|-------|--------|------|
| 001 | `001-spec-template-context-optimization` | Existing complete packet, moved verbatim. Content frozen; only its path self-references change. |
| 002 | `002-acceptance-criteria-template` | New. All build work below. |
| 003 | `003-restore-level-upgrade-and-vocabulary-invariance` | Added after review: restores the level-upgrade path the template restructure broke, and clears the public-surface vocabulary invariance. |

---

## 5. PHASE 002 — BUILD

1. **Template** `templates/addons/acceptance-criteria.md.tmpl`, gated for levels 2/3/3+. Row shape: `AC-ID | REQ | Given/When/Then | Verification | Status | Waiver`.
2. **Contract** `templates/spec-kit-docs.json`: add the `documents` entry, a `versions` entry, `sectionGates`, and list it in `requiredAddonDocs` for `2`, `3`, `3+`. `check-files.sh` picks it up through `scripts/utils/template-structure.js` — no new file-presence rule needed.
3. **Closure gate**: a new rule blocks completion under `--strict` on any unmet, unwaived AC row. Register it in `scripts/lib/validator-registry.json`.
4. **Waiver path**: an AC row may only be scrapped or superseded by a decision record. The rule requires a `Waiver: ADR-NNN` cell AND that `decision-record.md` actually contains that ADR. A waiver naming a missing ADR is an error, not a pass.
5. **Repoint** `check-ac-coverage.sh` to count ACs from `acceptance-criteria.md`, falling back to `spec.md` for pre-cutoff packets.
6. **Grandfathering**: dated cutoff, mirroring the existing `LEGACY_GRANDFATHERED` (`validate.sh:175-182`) and `CANONICAL_SAVE_CUTOFF` patterns. Do not invent a third mechanism.
7. **References**: `CLAUDE.md` §3 level table, system-spec-kit `SKILL.md`, `templates/README.md`, `templates/CONTRACT.md`, `examples/level-2|3|3+`, feature-catalog, `references/validation/validation-rules.md`, `mcp-server/ENV-REFERENCE.md`, **the system-spec-kit skill `README.md`, and the public root `README.md`**.

---

## 6. RESTRUCTURE — PARENT

- `git mv` the existing docs into `001-`; author the parent lean trio from `packet-types/phase-parent.spec.md.tmpl` (root purpose + phase list only — no merge/migration narrative).
- Regenerate `description.json` + `graph-metadata.json` for parent and both children.
- Rewrite the 19 old-slug sites: `specs/descriptions.json`, `000-release` fragments/coverage/changelog-by-skill/graph-metadata, spec-kit `changelog/v3.9.0.0.md`, playbook `scope-adherence-advisory-rule.md`, one 036 research iteration, plus 033's own docs. Historical changelog prose keeps the old name where it records what shipped under it.

---

## 7. CONSTRAINTS

- SCOPE LOCK: no cleanup of packet 036 or adjacent packets.
- Parent stays lean trio; heavy docs live in children.
- No completion claim without `validate.sh <folder> --strict` exit 0.

---

## 8. PROOF

| # | Check |
|---|-------|
| 1 | Recursive `validate.sh --strict` over the 033 tree: 0 errors. |
| 2 | Renderer emits `acceptance-criteria.md` for 2/3/3+, never for Level 1. |
| 3 | Negative control: post-cutoff packet missing the doc → exit 2; add it → 0. |
| 4 | AC waived with a real ADR → pass; waived naming a missing ADR → fail. |
| 5 | `rg '033-spec-template-context-optimization'` returns only the intended historical mentions. |

---

## 9. PROGRESS

Updated as phases land. Last updated 2026-08-29.

| Item | State | Evidence |
|------|-------|----------|
| Parent restructure (rename + demote to `001-`) | Done | `git mv`; parent holds the lean trio plus two children |
| Parent lean spec authored | Done | `spec.md` with the phase map; PHASE_PARENT_CONTENT passes |
| Phase `002-` scaffolded at Level 3 | Done | `create.sh --phase --parent`, then contract templates rendered at level 3 |
| Phase 002 planning docs | Done | spec, plan, tasks, checklist, decision-record, implementation-summary, acceptance-criteria |
| Build item 1 - gated template | Done | `templates/addons/acceptance-criteria.md.tmpl`; L1 = 0 lines, L2/L3/L3+ = 53 |
| Build item 2 - Level contract | Done | `spec-kit-docs.json`: document, version, section gates, listed at 2/3/3+ |
| Build item 3 - closure gate | Done | `scripts/rules/check-ac-closure.sh` registered as `AC_CLOSURE` (ERROR) |
| Build item 4 - waiver path | Done | Waiver must cite an ADR present in `decision-record.md`; three waiver cases proven |
| Build item 5 - coverage repoint | Done | `_ac_count_canonical_rows` takes precedence in `_ac_count_total` |
| Build item 6 - grandfathering | Done | `SPECKIT_AC_CLOSURE_CUTOFF`, mirroring the `CANONICAL_SAVE_CUTOFF` pattern |
| Build item 7 - references | Done | Both READMEs, `AGENTS.md`, `SKILL.md`, templates README + CONTRACT, validation-rules, ENV-REFERENCE, examples 2/3/3+ |
| Reference rewrite (old slug) | Done | Live indexes repointed; historical records intentionally keep the old name |
| Metadata regeneration | Done | `description.json` + `graph-metadata.json` for parent and both children |
| Proof run | Done | Recursive `validate.sh --strict` exit 0: 3/3 folders, 0 errors, 0 warnings |

### Proof results

| # | Check | Result |
|---|-------|--------|
| 1 | Recursive `validate.sh --strict` over the 033 tree | PASS - exit 0, three folders, 0 errors and 0 warnings |
| 2 | Renderer emits the document for 2/3/3+, never Level 1 | PASS - L1 = 0 lines; L2, L3, L3+ = 53 lines |
| 3 | Post-cutoff packet missing the document blocks | PASS - fails; a pre-cutoff packet reports advisory instead |
| 4 | Waiver with a real ADR passes; a missing ADR fails | PASS - real ADR closeable, missing ADR and no-ADR both fail |
| 5 | Old-slug references | PASS - only historical records retain the old name |
| 6 | Existing-packet regression | PASS - 12 sampled Level 2/3 packets, zero failures (PASS or grandfathered INFO) |

### Deviations and findings

| Item | Note |
|------|------|
| Build item 2 wording vs D3 | The goal said `requiredAddonDocs`. Reading the resolver showed `docs()` returns core plus required addons and `FILE_EXISTS` hard-errors with no cutoff awareness, so that placement would have failed all 2,588 existing Level 2/3/3+ packets and broken D3. The document is listed under `optionalAddonDocs` and `AC_CLOSURE`, which is cutoff-aware, owns presence. Recorded as ADR-002. |
| Level 1 acceptance criteria | The goal said `spec.md` drops its AC column. Applied at Levels 2/3/3+ only: Level 1 has no acceptance-criteria document, so dropping the column there would delete criteria rather than relocate them. |
| Scope addition | The operator added the system-spec-kit skill `README.md` and the public root `README.md` to the reference set mid-session; both are updated. |
| `scripts/spec/upgrade-level.sh` | Broken independently of this work: it resolves `templates/addendum/level2-verify/checklist.md`, a path that no longer exists after the template folder restructure, so every L1 to L2 upgrade fails and rolls back. Reported, not fixed - outside this packet's scope lock. |
| Child 001 pre-existing errors | The packet failed validation with 4 errors before this work (`TEMPLATE_HEADERS`, `ANCHORS_VALID`, `FRONTMATTER_VALID`, `GENERATED_METADATA_INTEGRITY`), measured at commit `4a6901096a`. Repaired structurally: real trigger phrases, path self-references, and ADR-001 anchors wrapped around prose that already existed. The two subsections the original never recorded (five-checks, implementation) are marked unrecorded rather than reconstructed. 001 now passes with 0 errors and 0 warnings. |
| Two defects found by the negative controls | The criteria-table header `\| AC-ID \|` matched the AC-ID pattern and was counted as an unmet criterion, inflating totals and producing false failures in both the closure rule and the coverage advisory. Fixed by requiring a digit in the id before the fixture was accepted. |
| Auto-commit during the session | The repository's sk-git live-sync committed this work as it was written (for example `e5a96897bf`), rather than leaving it staged for review. Flagged, not altered. |

---

## 10. POST-REVIEW REMEDIATION

Two fresh reviews (correctness, integration) ran against this work with no
inherited context. They found 18 and 9 findings respectively. Everything
confirmed is fixed and re-proven below.

### Defects the reviews found and this packet fixed

| Finding | Defect | Fix |
|---|---|---|
| F1 | Cutoff compared with strict `<` against a default of the current day, so packets created on the boundary were treated as post-cutoff | Boundary day is now grandfathered and the default moved to the day after landing; 2 real packets were failing and now pass |
| F2 | Grandfathering was consulted only on the presence branch; waiver and completion branches blocked pre-cutoff packets | A single verdict variable now governs every branch, matching the documented contract |
| F3 | Rows whose id was bold, backticked or lowercase silently vanished, emptying the table and closing the packet | Ids are normalized; a row that looks like a criterion but will not parse is reported, never skipped |
| F4 | An unbalanced code fence hid the remainder of the table | Fence balance is tracked and reported |
| F5 | Completion detection substring-matched the whole status line, so `Not Complete` and `Blocked - nothing done yet` read as completion claims | The status cell is extracted and matched exactly |
| F6 | `IGNORECASE` is a no-op on this platform's awk | Case handling is explicit |
| F7 | Status was read by column position, so an escaped pipe or an extra column shifted it | Columns are bound by header name |
| F8 | The waiver check was not fence-aware, so a fenced example ADR satisfied a waiver | The declaration scan skips fenced blocks |
| F9 | Only heading-style ADRs counted, failing 76 of 621 real decision records | Heading, bold list and table declarations all count; `ADR-1` and `ADR-001` are the same record |
| F10 | `create.sh` never scaffolded the document, so new packets failed the gate on creation | The scaffolder emits it for every level whose contract lists it |
| F11 | A malformed flag disabled the gate; a malformed cutoff grandfathered the whole repository | Both fail closed, with the fallback reported |
| F12 | Only the first ADR in a waiver cell was verified | Every cited record must exist |
| F13 | Duplicate ids were counted twice and never flagged | Duplicates are reported |
| F14 | This packet's own evidence citations pointed at a stale line count, a bare `return`, and a blank line | Citations re-derived against the current files |
| F15 | The rule had no tests | 29-case unit suite covering every finding above |
| Integration | The fixture corpus predated the cutoff, so the gate was dormant in every suite | The unit suite drives the rule directly and is unaffected by fixture dates |
| Integration | 12 Level 2/3/3+ fixtures still carried the retired 3-column table | Converted, fingerprints refreshed |
| Integration | Registry additions were unguarded by a hardcoded 13-rule list, itself already failing | The assertion now derives from the registry; 33 rules verified |

### Verification after remediation

| Check | Result |
|---|---|
| Rule unit suite | 29/29 pass; proven to catch a reintroduced defect |
| Deep regression sweep | 3,808 spec folders, 0 failing |
| `test-validation-system.cjs` | 117 passed, 0 failed (previously red on a stale rule list) |
| `test-validation.sh` | PASSED |
| Contract + snapshot suites | 17/18 pass; the 1 failure is a pre-existing vocabulary scan over unrelated feature-catalog docs |
| Recursive `validate.sh --strict` on this tree | exit 0, three folders, 0 errors, 0 warnings |
| Scaffolder | Level 1 excludes the document; Levels 2 and 3+ emit it |

### Known, out of scope

`scripts/spec/upgrade-level.sh` resolves a template path that no longer exists,
so every Level 1 to Level 2 upgrade fails and rolls back. Unrelated to this
work and left untouched under the scope lock.

`workflow-invariance` fails a private-taxonomy scan over five feature-catalog
and playbook documents this packet never edited. Both reviews independently
confirmed it predates this work.

---

## 11. FOLLOW-ON FIXES (phase 003)

The two defects reported as out of scope at the end of the remediation were
subsequently fixed on operator instruction.

| Defect | Fix | Proof |
|---|---|---|
| `upgrade-level.sh` resolved per-level fragments under a directory the template restructure deleted, so every Level 1 to Level 2 upgrade failed and rolled back | Each level's addendum is derived by rendering one gated template at two levels and taking what the higher level adds; sections the document already carries are filtered out so a heading renumbering cannot duplicate them | A throwaway Level 1 packet upgrades through Level 2, 3 and 3+ with every step exiting 0 and no duplicated headings |
| An upgrade to Level 2 did not create the document the closure gate requires | The upgrade now renders it alongside `checklist.md` | `Created: checklist.md, acceptance-criteria.md` |
| The vocabulary invariance failed on nine lines across five documents | Real identifiers are exempted by token; four lines that used a reserved word as ordinary English were reworded instead | The suite passes 2/2 and its sentinel test still reports a planted leak |

Full suite moved from 28 files / 50 tests failing to 27 / 49; no new failures.
