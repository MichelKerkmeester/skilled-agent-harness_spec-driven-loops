---
title: "Acceptance Criteria: Phase 4: hook-readme-fold-and-rewrite"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hook readme fold and rewrite acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite"
    last_updated_at: "2026-11-15T14:58:53Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-hook-readme-fold-and-rewrite"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: hook-readme-fold-and-rewrite

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks-plugins-extensions/hook-platform/007-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite
**Level:** 3
**Status:** In Progress
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the worktree at its final state, When the link-only command of REQ-001 runs (`LINKONLY` in `tasks.md`), Then it prints `[]` | T081: `LINKONLY` prints `[]`. | Met | - |
| AC-002 | REQ-002 | Given the final state, When `ls` runs on `.skilled/hooks/ask-surface-guard/README.md` and `.skilled/hooks/decision-capture/README.md`, Then it exits 0 | `ls` on both files prints both paths, exit 0. T070 staged both. | Met | - |
| AC-003 | REQ-003 | Given the final state, When `validate_document.py` and `hvr_scan.py` run over every `README.md` under `.skilled/hooks/`, Then the first prints `VALID` for each file and the second reports `hard blockers: 0` for each file | T080 and T084: `VD` passes 104 and fails 0, `HVR` reports `hard blockers: 0` for 104 and fails 0. This checks structure and voice only; the unsigned `env-secret-guard/README.md` content stays with T021. | Met | - |
| AC-004 | REQ-004 | Given the final state, When `readme-gates.py fold` runs, Then it prints `FOLD missing=0` | T081: `FOLD missing=0 links=122 folders=83`. | Met | - |
| AC-005 | REQ-005 | Given the final state, When `readme-metrics.py` runs over `.skilled/hooks` and the five session-handover documents, Then it prints `FAIL` for no file except `.skilled/hooks/skill-advisor/README.md` | T080: `METRICS $H` prints `SUMMARY files=104 pass=103 fail=1`, the one `skill-advisor/README.md`. G6 is `ok` for each of the five session-handover documents. | Met | - |
| AC-006 | REQ-006 | Given the final state, When the hook Vitest tree, the hook `node --test` suites, the OpenCode plugin tests and `completion-evidence-sentinel.vitest.ts` run, Then each prints the counts T001 recorded | T084: hook Vitest 501 of 501, `node --test` 1838 of 1839 with the same failing case as T001, OpenCode plugin tests 591 of 591, `SENTINEL` 33 of 33. All match T001. | Met | - |
| AC-007 | REQ-007 | Given the final state, When `validate_document.py --type code_folder --json` runs over every `README.md` under `.skilled/hooks/` except `skill-advisor/README.md`, Then it reports no blocking rule other than `code_folder_inline_path` | T080: `scratch/gates-after.tsv` shows G2 `ok` for all 103 READMEs other than `skill-advisor/README.md`, and G2 waives only `code_folder_inline_path`. | Met | - |
| AC-008 | REQ-008 | Given the final state, When `check_readme_references.py` and `check_derived_readme_counts.py` run over every `README.md` under `.skilled/hooks/` and the five session-handover documents, Then each prints `fail=0` | T080: `REFS` and `COUNTS` each print `SUMMARY files=109 pass=109 fail=0`. | Met | - |
| AC-009 | REQ-009 | Given the split session-handover README, When `wc -w` runs on it and `ls` runs on the five sibling documents, Then `wc -w` prints fewer than 3,000 words, `ls` exits 0 and the README links each of the five | T041: `wc -w` prints 2785, the five documents exist and the README links all five. | Met | - |
| AC-010 | REQ-010 | Given the final state, When the search for a Markdown link into `specs/` runs over `.skilled/hooks` (T082 in `tasks.md`), Then it prints nothing | T082: the `specs/` link search prints nothing, exit 1. | Met | - |
| AC-011 | REQ-011 | Given the saved copy in `scratch/before/`, When `readme-gates.py triggers` runs, Then it prints `TRIGGERS lost=0`, with the phrase "git hooks" of the root hooks README as the one recorded exception | T081: `TRIGGERS lost=0 phrases=570`, "git hooks" of the root README held in `DROPPED_PHRASES` as the one exception. | Met | - |
| AC-012 | REQ-012 | Given the rebased pinned lists, When `test_readme_manifest.py`, `test_readme_verdict_parity.py` and `generate-trigger-index.mjs --check` run, Then they print `manifest=reproducible`, `PARITY PASS` and `trigger index matches the corpus` | T071 to T073: `manifest=reproducible` with `gaps=21`, `PARITY PASS` at 1062 files, `trigger index matches the corpus` over 27493 documents. | Met | - |
| AC-013 | REQ-013 | Given the path list T003 saved, When the path list of `git status --short` is filtered to leave out Markdown files, the pinned lists and this packet, Then it equals the saved list filtered the same way | T083: `diff` of the two filtered path lists prints nothing, exit 0. | Met | - |
| AC-014 | REQ-014 | Given the rewritten root hooks README, When its concern-key table, its H2 headings and its frontmatter are read, Then each of the eight concern keys that differ from their folder stands next to its folder, the last H2 is RELATED and no trigger phrase reads "git hooks" | T043: the concern-key table holds the eight keys each next to its folder, the last H2 is `## 8. RELATED` and `git hooks` appears nowhere. | Met | - |
| AC-015 | REQ-015 | Given the final state, When the `LEAFREF` search in `tasks.md` runs, Then it lists no file outside `specs/` that names a deleted README | T073 and T082: `LEAFREF` prints nothing. | Met | - |

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

**Closeable:** No

All 15 criteria are Met. The phase still cannot close, because T021 in `tasks.md` is `[B]`: `.skilled/hooks/env-secret-guard/README.md` holds an unsigned draft with one wrong diagram line, and only the operator can change that file.
<!-- /ANCHOR:closure -->
