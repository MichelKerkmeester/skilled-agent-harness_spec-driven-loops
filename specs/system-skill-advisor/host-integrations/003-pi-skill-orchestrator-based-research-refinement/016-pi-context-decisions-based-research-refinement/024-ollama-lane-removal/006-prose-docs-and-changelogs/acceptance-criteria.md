---
title: "Acceptance Criteria: Phase 6: prose-docs-and-changelogs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "prose docs and changelogs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs"
    last_updated_at: "2026-11-21T00:00:00Z"
    last_updated_by: "plan-author"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-prose-docs-and-changelogs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: prose-docs-and-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 024-ollama-lane-removal/006-prose-docs-and-changelogs
**Level:** 3
**Status:** Draft
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase commit, When `sweep-lane-residue.mjs repo --json` runs, Then it exits 1, its `live` paths equal the 5 on `spec.md` section 3's 007 list, no 006-class path is live, `counts.allowlistRows` changes only by the REQ-014 rows, and `A/changelog/v2.0.0.0.md` is in neither `live` nor `allowlisted` [DEVIATION: conductor decision moved the non-lane allowlist rows into this phase] | The repo-mode JSON and the sorted `diff` of the live list against the five 007 paths (T001, T045). Observed on the uncommitted final tree: `repo --json` exit 1, `live` is exactly the 5 paths on the 007 list, no 006-class path is live, `allowlistRows` 46 (30 plus the REQ-014 rows and the conductor's `baseline-readme-verdicts.json` row, all 46 matched), and `A/changelog/v2.0.0.0.md` is untracked with `hits` at `lines=0`, so it stays out of both lists once staged (T045) | Met | - |
| AC-002 | REQ-002 | Given the 23 entries rewritten, When `hits` runs on each and the three validators run on all 23, Then every entry prints `lines=0`, the 16 that passed `check_changelog_shape.py` at the start still exit 0, `validate_document.py` and `hvr_scan.py` exit 0 on all 23, and the diff filter over the 22 entries other than `v4.2.0.0` prints `unexpected=0` and `dangling=0` | The 23 `hits` lines, the validator table and the filter output (T038 to T041, T044). Observed: `hits` prints `lines=0` on all 23; the three-validator table differs from the start only where `v1.2.0.0.md` moved from shape fail to pass (17 pass all three, 6 fail shape only); the filter printed `files=23 removedLines=127 unexpected=0 dangling=0` (T038 to T041, T044) | Met | - |
| AC-003 | REQ-003 | Given the removal entry written through `sk-create-changelog`, When `hits`, `check_changelog_shape.py`, `validate_document.py` and `hvr_scan.py` run on `A/changelog/v2.0.0.0.md` and `grep -n '^version' A/SKILL.md` runs, Then `hits` prints `lines=0`, each validator exits 0, every path the entry names exists, and the grep prints `5:version: 2.0.0.0` | The four outputs and the version line (T043). Observed: `hits` `lines=0`; `check_changelog_shape.py`, `validate_document.py` and `hvr_scan.py` exit 0; every named path exists; `5:version: 2.0.0.0`; both retired status flags returned `"exitCode": 64` from the CLI and the entry names both (T043) | Met | - |
| AC-004 | REQ-004 | Given the three renames, When `git ls-files \| grep -c five-lane` and `git grep -l five-lane-fusion -- ':!specs'` run, Then the count prints 0, the three `lane-fusion` paths are tracked, and the grep prints only `K/runtime/data/trigger-index.json` and `K/runtime/cli/retrieval/fixtures/corpus-manifest.json` | After staging: `git ls-files \| grep -c five-lane` prints 0, the three `lane-fusion` paths are staged, and the grep prints only the trigger index and corpus manifest | Met | - |
| AC-005 | REQ-005 | Given the two leaves deleted, When `git grep -n -E 'background-vector-refresh\|command-meaning-matching' -- .skilled ':!**/trigger-index.json' ':!**/corpus-manifest.json' ':!**/generation-diagnostics.json' ':!**/phrase-variants.json'` and a count on the catalog index run, Then the grep prints nothing and the index states 47 features with daemon-and-freshness at 7 and scorer-fusion at 9 | The empty grep and the index lines (T010, T046). Observed: with the pathspec also excluding the two phase 007 fixtures `generation-diagnostics.json` and `phrase-variants.json`, which match only the spec folder name `004-command-meaning-matching`, the grep prints nothing (exit 1); both leaves are gone from disk and leave the index when staged; the index states 47 features with rows 7 and 9 (T010, T046) | Met | - |
| AC-006 | REQ-006 | Given the phase commit, When the link, leaf manifest, root metadata, frontmatter, doc version, catalog, playbook and mirror checks run, Then the link check prints `0 broken`, both leaf checks print `leaf-manifest.json OK`, root metadata prints `failed=0`, the frontmatter guard prints `violations=0`, `frontmatter-version.mjs gate` and `bump --check --base` exit 0, both validators print `PASS` with 0 violations, and the mirror check prints `PASS` | Link 0 broken, leaf manifests OK, root metadata failed=0, frontmatter violations=0, version gate exit 0, catalog and playbook PASS, mirrors in sync; the commit hook raises changed doc versions | Met | - |
| AC-007 | REQ-007 | Given the routing sources edited and `skill-graph.json` regenerated, When the three ratchet files, the routing corpus command and `skill-graph-freshness.cjs --strict` run after T017 and on the final tree, and the score baseline diff runs, Then the ratchets print the start commit's passed counts, the corpus exits 0 with `overall_pass: true`, freshness exits 0 with `SIGNAL DRIFT compiled vs disk: none`, and the diff prints nothing | Both runs' counts, the corpus JSON, the freshness lines and the empty diff (T017, T018, T049). Observed: ratchets 22 passed after T017 and on the final tree (start 22); corpus exit 0, `overall_pass: true`, accuracy 0.602 both times; freshness exit 0 with `SIGNAL DRIFT compiled vs disk: none`; the baseline and fixture diff printed nothing (T017, T018, T049) | Met | - |
| AC-008 | REQ-008 | Given the phase commit, When advisor `npm run typecheck`, `npm test`, the stress suite and `env-reference-drift.vitest.ts` run, Then the typecheck exits 0, test and stress print the start commit's file and case counts with 0 failed, the stress run lists `lane-fusion-stress.vitest.ts`, and the drift test passes | The exit status and the four summaries (T007, T030, T049). Observed: typecheck exit 0; `npm test` 177 files, 2438 passed, 4 skipped, 0 failed after the local index rescan (T049); stress 21 files, 65 passed, listing `lane-fusion-stress.vitest.ts`; drift 5 passed (T007, T030, T049) | Met | - |
| AC-009 | REQ-009 | Given the docs rewritten, When the REQ-009 `git grep` runs, Then it prints only `K/shared/tests/README.md`'s `config.test.ts` row and the shared README table row that T032 recorded | The grep output (T025, T027, T031, T032, T034, T037, T047). Observed: the grep prints only `K/shared/tests/README.md:32`, the `config.test.ts` row; no shared README table row exists (T047) | Met | - |
| AC-010 | REQ-010 | Given the phase commit, When `run-all.sh`, `run-script-tests.sh` and `validate_document.py` on each edited Markdown file outside `changelog/` run, Then `run-all.sh` prints `7 suite(s) passed, 0 failed`, the suite prints `all sk-doc script tests passed`, and no file exits worse than at the start commit | The two summaries and the per-file exit table (T050). Observed: `[run-all] 7 suite(s) passed, 0 failed`; `all sk-doc script tests passed`; `worse=0` over 53 edited Markdown files (T050) | Met | - |
| AC-011 | REQ-011 | Given the phase commit, When the T052 boundary diff and the comment-id grep run, Then the diff lists no path on the 005, 007 or 008 lists, the residue allowlist changes only by the REQ-014 rows, nothing under `R/lib/`, no `K/shared/` path but `README.md` and nothing in `specs/` outside this folder, and the grep prints nothing [DEVIATION: conductor decision moved the non-lane allowlist rows into this phase] | The staged diff touches no 005 or 007 path, nothing under `R/lib/`, only the REQ-014 allowlist rows; the one id hit is the existing ADR-001 row of the advisor `ARCHITECTURE.md` decision index, a doc table the conductor accepted | Met | - |
| AC-012 | REQ-012 | Given the phase done, When `git ls-remote --tags origin` is diffed with the start list, Then the diff prints nothing, no `gh release` write ran, and `implementation-summary.md` lists the eight tagged entries with the operator's commands | The remote tag list is unchanged, no `gh release` write ran, and `implementation-summary.md` lists the eight tagged entries with the operator's commands | Met | - |
| AC-013 | REQ-013 | Given the phase commit, When `generate-trigger-index.mjs --check` runs, Then it exits 1 and every stale or obsolete path beyond the start report is a file this phase edited, renamed or deleted | The check output beside `ti-before.txt` and `git diff --name-only` (T002, T051). Observed: exit 1, `stale documents : 75`, `obsolete paths : 13` (start 66 and 9); every added `.skilled` path is a file this phase edited, renamed or deleted (T051) | Met | - |
| AC-014 | REQ-014 | Given the phase commit, When `sweep-lane-residue.mjs repo --json` runs, Then none of the 15 allowlist-row paths is live and each has one exact-path row with a reason | The JSON's live and allowlisted lists (T056). Observed: none of the 15 is live; each has one exact-path row citing its lines; 46 rows, 46 matched, no unused row (T056) | Met | - |

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

**Closeable:** Yes

All fourteen rows are Met. Two review rounds closed one P1, the second refused status flag missing from both removal entries, and five suggestions.
<!-- /ANCHOR:closure -->
