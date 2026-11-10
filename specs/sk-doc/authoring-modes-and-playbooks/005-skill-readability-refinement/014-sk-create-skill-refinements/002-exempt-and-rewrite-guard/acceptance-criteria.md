---
title: "Acceptance Criteria: Phase 2: exempt-and-rewrite-guard"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "exempt and rewrite guard acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard"
    last_updated_at: "2026-11-05T06:39:44Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: exempt-and-rewrite-guard

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard
**Level:** 3
**Status:** Complete
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When `rg -n -e "FORMAT_SPEC_FILES = " -e "def load_render_exempt" .skilled/skills/sk-doc` runs, Then it prints nothing, and `rg -n` for the loader's name in `validate_document.py`, `package_skill.py` and `scope-gate.py` prints a call in each | superseded: the five format-spec files stay by operator decision | Superseded | ADR-003 |
| AC-002 | REQ-002 | Given a ledger copy whose exempt map names a missing doc, and another whose consumer does not contain the doc's name, When the loader runs on each, Then each exits non-zero and names the bad key | `test_render_exempt.py` covers a missing doc key and a consumer that does not name the doc; `--check` exits 1 naming the key; the real ledger first failed on the contract snapshot this way | Met | - |
| AC-003 | REQ-003 | Given the ledger, When `python3 -c "import json;print(sorted(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))['pinned']))"` runs, Then it lists `sk-code/shared/references/universal/code-quality-standards.md` and `sk-code/sk-code-review/references/review-core.md` | the ledger's `pinned` list holds both docs with `check-rule-copies.js` | Met | - |
| AC-004 | REQ-003 | Given a one-line edit to a pinned doc, When `python3 .skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py --base HEAD <that doc>` runs, Then it exits 1 naming the pinned rule, and `validate_document.py` on that doc still runs its render checks | a one-line edit to `review-core.md` made the guard exit 1 with `HARD protected ... pinned doc, pinned by sk-code/sk-code-review/scripts/check-rule-copies.js`, and `validate_document.py` still ran its checks on it with no exempt label; file restored | Met | - |
| AC-005 | REQ-004 | Given one bad and one good pair per hard check, When the guard runs on each pair, Then every bad pair exits 1 naming its rule and every good pair exits 0 | `test_doc_rewrite_guard.py`: a bad and a good case per hard check, plus rename, indented-fence, backticked-name, subdirectory and non-ASCII cases; 24 passed | Met | - |
| AC-006 | REQ-005 | Given the T001 base with `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/013-system-spec-kit/scratch/diff-1.patch` applied, When the guard runs with that base, Then its output names `.skilled/skills/system-spec-kit/shared/parsing/README.md`, and on an unchanged tree it prints no finding and exits 0 | `test_replayed_rewrite_is_reported` passes: `0 hard, 0 advisory` on the unchanged tree, then the rewritten `shared/parsing/README.md` line named after `diff-1.patch` | Met | - |
| AC-007 | REQ-006 | Given the exempt map, When `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md` runs, Then each finding it prints for that doc names the consumer that exempts it | the dashboard prints `Exempt: read by system-deep-loop/deep-research/scripts/reduce-state.cjs` and its finding carries the same label | Met | - |
| AC-008 | REQ-007 | Given the advisory pinned scan, When it runs over `.skilled`, Then it lists both pinned docs and exits 0 | `--scan-pinned` lists both docs as `PINNED-UNSEEN` and exits 0 | Met | - |
| AC-009 | REQ-008 | Given the workflow docs, When `rg -n "doc-rewrite-guard.py" .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` runs, Then it prints at least one line per file | `rg` prints `examples-and-maintenance.md:171` and `creation-workflow.md:406` | Met | - |
| AC-010 | REQ-001 | Given the final state, When `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` runs, Then its last line is `all sk-doc script tests passed`, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0` | `all sk-doc script tests passed`; node suite pass 108, fail 0 | Met | - |
| AC-011 | REQ-001 | Given the final state, When `for s in .skilled/skills/*/; do python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py "$s" --check --strict >/dev/null 2>&1; rc=$?; echo "$(basename "$s") exit=$rc"; done` runs, Then it prints `exit=0` for all 13 skills | 13 of 13 exit 0, matching `scratch/baseline/strict-loop.txt` | Met | - |
| AC-012 | REQ-001 | Given the final state, When `node --test .skilled/bin/tests/compiled-route-*.test.cjs` runs, Then it reports `fail 0` | pass 101, fail 0 | Met | - |
| AC-013 | REQ-004 | Given the packet, When `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard --strict` runs, Then it prints `RESULT: PASSED` | `validate.sh --strict` prints `RESULT: PASSED`, Errors 0 | Met | - |
| AC-014 | REQ-001 | Given the final tree, When `rg -n "def load_render_exempt" .skilled/skills/sk-doc` and `rg -n "render_exempt\\." validate_document.py package_skill.py scope-gate.py` run, Then the first prints nothing, the second prints a call in each file, and `FORMAT_SPEC_FILES` lists only the five format-spec files | `def load_render_exempt` absent; `render_exempt.` calls at `validate_document.py:2911`, `package_skill.py:978`, `scope-gate.py:14`; `FORMAT_SPEC_FILES` holds 5 entries | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met with observed evidence, and the one superseded row is backed by ADR-003.
<!-- /ANCHOR:closure -->
