---
title: "Operator Goal: 033 Spec-Kit Template Optimization"
description: "The operator directive governing packet 033: a canonical, closure-blocking acceptance-criteria document for Levels 2, 3 and 3+, with the decisions that are not to be re-litigated."
trigger_phrases:
  - "033 goal prompt"
  - "spec kit template optimization goal"
  - "acceptance criteria goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Restructured this document to the goal template shape shipped by packet 042"
    next_safe_action: "Run the deep review over phase 004 and packet 042"
    blockers: []
    key_files:
      - "004-checklist-deprecation-closure/spec.md"
    session_dedup:
      fingerprint: "sha256:3cf1d45bcbaaca91ebc9b4e659e23ed8037ccf2fed0a4878a3da730e67a1f2a1"
      session_id: "2026-08-29-033-spec-kit-template-optimization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "D1, D2 and D3 were operator-confirmed on 2026-08-29 and are not re-litigated"
---

# Operator Goal: 033 Spec-Kit Template Optimization

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Restructure `system-speckit/033` into a phase parent, then make
`acceptance-criteria.md` a canonical, closure-blocking document at Levels 2, 3
and 3+. A packet cannot close until every criterion is met, waived or superseded
by a decision record that exists.

**Decisions — operator-confirmed 2026-08-29, do not re-litigate:**

| ID | Decision |
|----|----------|
| **D1** | Restructure `033` in place: keep the number, rename to `033-spec-kit-template-optimization`, demote its existing documents into child `001-`. Do not absorb packet 036. |
| **D2** | `acceptance-criteria.md` is the canonical home. `spec.md` keeps requirement ids and drops its criteria column; the coverage advisory counts from the new document. |
| **D3** | Forward-only rollout behind a dated cutoff. Packets created after it must carry the document; older packets stay advisory. No backfill of the existing tree. |

**Constraints:** scope lock — no cleanup of packet 036 or adjacent packets. The
parent stays a lean trio; heavy documents live in the children. No completion
claim without `validate.sh <folder> --strict` at exit 0.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

Read each phase's goal document before working that phase; its criteria bind as
if written here. Parent decisions outrank child detail; child detail outranks
any summary of it.

| Phase | Goal document |
|-------|---------------|
| 001-spec-template-context-optimization | `001-spec-template-context-optimization/goal.md` |
| 002-acceptance-criteria-template | `002-acceptance-criteria-template/goal.md` |
| 003-restore-level-upgrade-and-vocabulary-invariance | `003-restore-level-upgrade-and-vocabulary-invariance/goal.md` |
| 004-checklist-deprecation-closure | `004-checklist-deprecation-closure/goal.md` |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Recursive `validate.sh --strict` over the 033 tree reports zero errors.
- [x] The renderer emits `acceptance-criteria.md` at 2/3/3+ and never at Level 1.
- [x] A post-cutoff packet missing the document fails; adding it passes.
- [x] A criterion waived against a real decision record passes; one naming a
      missing record fails.
- [x] `rg '033-spec-template-context-optimization'` returns only the intended
      historical mentions.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is volatile: it records what happened, not what was directed.

### Deviation from the directive as issued

The directive above said the contract entry would go in `requiredAddonDocs`.
It shipped in `optionalAddonDocs` instead, because a required entry hard-errors
on every packet in the existing tree, which D3 forbids. Presence is enforced
by the closure rule against the dated cutoff, which reaches the same outcome
without breaking the packets D3 protects.

### Phase 002 build steps as directed

1. Template `templates/addons/acceptance-criteria.md.tmpl`, gated for 2/3/3+.
2. Contract entry in `templates/spec-kit-docs.json` with version and section gates.
3. A closure rule blocking completion under `--strict` on an unmet criterion.
4. A waiver path requiring a decision record that actually contains the named ADR.
5. The coverage advisory repointed at the canonical document.
6. Grandfathering by dated cutoff, reusing the existing cutoff-constant pattern.
7. Every reference surface that publishes the level contract, both READMEs included.

### Parent restructure as directed

`git mv` the existing documents into `001-`; author the parent lean trio; regenerate
the generated metadata pair for parent and children; rewrite the old-slug sites,
leaving historical changelog prose naming what shipped under the old name.

### Progress

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

<!-- /ANCHOR:log -->
