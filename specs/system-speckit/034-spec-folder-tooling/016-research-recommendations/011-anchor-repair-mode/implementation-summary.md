---
title: "Implementation Summary"
description: "Anchor repair mode is built and its eight acceptance criteria are met. This summary records what was built, how it was verified, the review rounds and the deviations."
trigger_phrases:
  - "anchor repair mode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode"
    last_updated_at: "2026-10-09T00:00:00Z"
    last_updated_by: "closeout"
    recent_action: "Third closeout pass: Opus review recorded, citations re-checked, gate rows on tree5"
    next_safe_action: "Decide task T011, then ship with the combined commit under parent decision D6"
    blockers:
      - "T011: one scratch backup fails validate --strict on generated-metadata drift, not on anchors"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 94
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-anchor-repair-mode |
| **Status** | Complete. All eight acceptance criteria are Met. Task T011 stays open. The changes are in the working tree and not yet committed. |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The anchor repair mode in `heal-spec-docs.cjs` runs with `--anchor-repair`. It is a dry run by default and writes only with `--apply`. It handles three defect classes:

- **Glued overlapping duplicate pairs.** A second anchor pair that sits directly against its twin is removed.
- **Isolated duplicate pairs.** The second pair takes the next free numbered suffix. A rename is refused when that suffix already exists, which is the collision case, and the document stays unchanged.
- **Nested questions layout.** The questions opener moves to the line directly above the `OPEN QUESTIONS` heading. Only marker lines move. A document is refused when the heading already sits inside another wrapper, such as an `open-questions` or `questions-2` anchor, or when the questions anchor does not hold exactly one H2 OPEN QUESTIONS heading.

Anchors inside backtick or tilde fences are never paired across the fence boundary. Each document is written through a temporary file in the same directory, which is renamed over the original, so a failed write leaves the original in place. The file mode is kept.

`upgrade-legacy.mjs` runs the mode as one repair step (`repairPackets`) before the healer, on packets that fail. On archived packets, `repairArchived` runs only the marker-only un-nesting, through the healer's exported `writeFileAtomic`, which keeps the file mode. No other anchor repair touches an archived document, and the module header states that exception.

### Corpus run

The operator chose "Auto + hand-fix, then error" for the corpus. The tool un-nested 929 spec.md files, all marker-only: 600 live, 266 archived and 63 scratch. Hand-fix briefs repaired the documents the tool refused, in two rounds, with a marker-only proof after each round. A census of all 4,642 packets then found zero nesting findings. That census ran after the nesting check was changed to skip inline code spans (phase 013, operator decision of 2026-10-08). The ANCHORS_VALID totals were pass 4,613, warn 0 and error 29. The 29 errors are not nesting errors, and this phase does not clear them. Most sit in sandbox, review and scratch copies kept inside other packets, and the rest in archived packets such as 065, where quoted markers give duplicate id findings.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:files -->
### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Anchor repair mode: fence-aware pairing, collision check, glued-pair removal, questions un-nesting, atomic write |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Anchor repair as a repair step, marker-only un-nesting in `repairArchived`, header comment |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | The upgrade-legacy and heal-spec-docs rows describe archived writes and the anchor repair scope |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts` | Create | Cases for the three defect classes, collisions, wrapper refusals and the atomic write |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-repair-sample.vitest.ts` | Create | Dry run and apply on the frozen 60-document sample |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/` | Create | 60 frozen spec.md copies and an index (seed 20261008, 50 repairable and 10 refused) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Archived un-nesting with prose identity, archived mode under a restrictive umask, nested questions repair step |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts` | Modify | Allows the anchor-repair sample fixture prefix, since that corpus text is replayed verbatim |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Verified

| Check | Command or source | Result (2026-10-09) |
|-------|-------------------|---------------------|
| Focused anchor-repair tests | `npx vitest run --config ../../vitest.config.ts --project cli tests/heal-anchor-repair.vitest.ts tests/anchor-repair-sample.vitest.ts tests/upgrade-legacy.vitest.ts tests/workflow-invariance.vitest.ts`, run from the `runtime/cli` folder | 4 files, 52 tests passed, exit 0 |
| Literal AC-007 command | `npx vitest run runtime/cli/tests`, run from the system-spec-kit skill root | Exit 0. Test Files 171 passed and 3 skipped (174). Tests 1752 passed and 19 skipped (1771). |
| Whole-tree CLI gate | `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` | Exit 0. Same counts as above. The baseline before wave 1 was 161 files and 1639 passed. |
| Lint, boundaries and AST checks | `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` | Exit 0 |
| Build and typecheck | `build`, `build-cli`, `typecheck`, `typecheck-cli` | Exit 0 each. `typecheck-tests` exits 2 with the same 95 errors as the prior run, and that step reports without enforcing. |
| Hook tests | `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail, 3 skipped |
| Doctor scripts | `run-all.sh` | 7 suites, 0 failed |
| Dry-run budget | The sample test | The 60-document dry run finishes inside its 60 second budget and leaves the sandbox byte-identical |
| Phase validation | `validate.sh` on this folder with `--strict` | See the third pass below |
| Goal conformance | `check-goal.cjs` on this folder | 5 of 5 checks PASSED, exit 0 |
| 50 source packets | `validate.sh <folder> --strict --no-recursive` on each of the 50 packets the sample was drawn from | 49 PASSED. 1 FAILED on generated-metadata drift in a scratch backup, not on anchors. ANCHORS_VALID passes on all 50. |
| Corpus census | `validate.sh --strict --no-recursive` on all 4,642 spec folders | Nesting findings 0. ANCHORS_VALID pass 4,613, error 29. |

The sample is a frozen, seeded set of 60 copies. Its index records the commit it was drawn from, `02cc1fb94824`. The sample test reads only those committed copies, so the live tree can change without breaking it.

### Second pass, tree4 (2026-10-09)

The whole-tree gate in `gates/tree4/` ran after the second round of test additions. Its `delta.txt` compares each step with tree3.

| Check | Source | Result |
|-------|--------|--------|
| Build and build-cli | gates/tree4/build.rc, build-cli.rc | rc 0 each |
| Lint, boundary, allowlist, alignment and AST checks | gates/tree4/cli-check.rc | rc 0 |
| Typecheck and typecheck-cli | gates/tree4/typecheck.rc, typecheck-cli.rc | rc 0 each |
| typecheck:tests | gates/tree4/typecheck-tests.rc | rc 2, report-only, 95 `error TS` lines, the same count as tree3 |
| CLI test (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`) | gates/tree4/cli-test.rc and cli-test.log | rc 0. Test Files 171 passed, 3 skipped (174). Tests 1775 passed, 19 skipped (1794). Tree3 had 1752 passed. |
| workflow-invariance | gates/tree4/workflow-invariance-isolated.rc | rc 0, 2 of 2 |
| Focused run of the four anchor-repair files, verbose | gates/closeout2-011/focused-verbose-3.out | rc 0. 4 files, 62 tests passed: 20 in heal-anchor-repair.vitest.ts, 1 in anchor-repair-sample.vitest.ts, 39 in upgrade-legacy.vitest.ts and 2 in workflow-invariance.vitest.ts |
| Hook tests | gates/tree4/hooks.rc | rc 0. 184 run, 181 pass, 0 fail, 3 skipped |
| Doctor scripts | gates/tree4/doctor.rc | rc 0. 7 suites passed, 0 failed |
| test-validation | gates/tree4/test-validation.rc | rc 0. 31 of 31 passed, RESULT: PASSED |
| doctor-update compatibility tests | gates/tree4/doctor-update.rc | rc 0. 22 of 22 passed |
| Root package test (`npm --prefix .skilled/skills/system-spec-kit test`) | gates/tree4/root-test.rc and root-test.log | rc 124. The run hit the 600 s harness bound inside the runtime workspace suite, with no failure marker. The cli sub-step never started. This is no verdict. The parent criteria name the cli test. |

Two focused runs in the same window failed seven `upgrade-legacy` cases with exit 3 from `validate.sh`, which returns that code when it cannot confirm the compiled validator. Another session's `npm run test` (pid 149, started 08:35:31) was active in this worktree during those attempts. A third run passed while another session's upgrade-legacy vitest run was also active. The cause of the exit 3 was not captured. The passing run is the record, and the concurrency is listed in Known Limitations.

### Third pass, tree5 (closeout 3, 2026-10-09)

The whole-tree gate in `gates/tree5/` ran after the Opus alignment fixes. Its `delta.txt` compares it with tree4. Git HEAD moved from `02cc1fb94824` to `c2a0a667e9` at 10:37, inside the root-test window, because another session committed the working tree. That commit does not touch this folder. The steps before 10:31 ran on the tree before the commit.

- Focused run of eight files, including `heal-anchor-repair.vitest.ts`, `anchor-repair-sample.vitest.ts` and `upgrade-legacy.vitest.ts`: exit 0, 152 tests passed (`gates/tree5/focused-vitest.log`).
- CLI test (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`): exit 0, Test Files 171 passed, 3 skipped (174), Tests 1775 passed, 19 skipped (1794). Same as tree4 (`gates/tree5/cli-test.log`).
- Workflow invariance, run alone: exit 0, 2 of 2.
- Build, build-cli, cli-check (lint, boundary and AST checks), typecheck and typecheck-cli: exit 0 each.
- typecheck:tests: exit 2, report only, 95 `error TS` lines, the same count as tree4.
- Hooks: 184 run, 181 pass, 0 fail, 3 skipped. Doctor suites: 7 passed, 0 failed. Doctor-update compatibility: 22 of 22.
- Drift guards: exit 0, all 2 guards PASSED. Tree4 did not run this step.
- Root test (`npm --prefix .skilled/skills/system-spec-kit test`): exit 0. This is the first tree5 verdict for it, since tree4 hit the harness bound. Its runtime core suite reports 4180 passed and 21 skipped, its spec-validation and legacy steps print RESULT: PASSED, and its cli sub-step reports the counts above (`gates/tree5/root-test.log`).

Caveat for the root-test row: it ran from 10:31 to 11:15, across the commit at 10:37, so its runtime steps may not match one tree. The cli-test and focused runs finished before the commit.

Gate rows that cite tree4 now cite tree5 as well. `T011` stays open, and so do CHK-031 and CHK-FIX-004 to CHK-FIX-007. The `validate.sh --strict` and `check-goal.cjs` runs on this folder were repeated after these edits, and their logs are in `gates/closeout3-011/`.

### Producer and consumer inventory (closeout, 2026-10-09)

Method: ripgrep over `.skilled/` for anchor marker writers and readers, excluding tests and fixtures, then a read of each hit that touches packet documents.

**Producers of packet document anchors (code that writes marker lines):**
- `create.sh` renders the templates in `templates/core`, `templates/addons` and `templates/packet-types`. It also appends anchor blocks to the parent spec.md (lines 1100-1104), writes the phase-map (1808-1836) and the phase-context (1943-1962).
- `heal-spec-docs.cjs` `anchorWrap` (lane mode `anchor-wrap`, lines 859 and 878) wraps a heading that the template anchors but the document lost. Phase 015 owns that mode.
- `scaffold-debug-delegation.sh` writes the anchors of `debug-delegation.md` (lines 278-346).
- This phase adds no marker lines. It moves the questions opener, removes glued duplicate pairs, and renames an isolated duplicate pair to the next free numbered suffix (`repairDuplicateAnchors`).
- The plan named `create.sh` as the only producer. This inventory corrects that.

**Producers outside packet documents (outside this check):** `cli/lib/anchor-generator.ts` for memory save output, called from `extractors/file-extractor.ts` (lines 412-418) and `extractors/decision-extractor.ts`. `deep-research/scripts/reduce-state.cjs` writes research and review state documents.

**Consumers that read anchors:**
- Validator: `ANCHORS_VALID` in `runtime/lib/validation/orchestrator.ts` (`validateAnchorIntegrity`, lines 784-854). Its nesting rule, `anchorNestingFindings` (lines 729-776), is the rule the un-nesting satisfies. Closeout 3 removed the severity constant `ANCHOR_NESTING_SEVERITY` (OC-O4), so nesting findings now join the `ANCHORS_VALID` error entry directly, and phase 013 made nesting an error. `spec-doc-health.ts` (lines 233-244) reports unclosed and orphan anchors.
- Template contract and retrieval: `parseAnchoredSections` in `runtime/cli/utils/template-structure.js` (line 462). Its callers are heal-spec-docs.cjs (imported at line 44, the findable check at line 469) and the template contract loader (template-structure.js line 566). `template-structure.js` line 372 checks anchor presence.
- Named-anchor readers, none of which reads `questions`: `check-completion.sh` (lines 131-139 and 490), `check-ac-coverage.sh` (lines 185 and 374), `graph-metadata-parser.ts` (lines 1340-1344), `completion-evidence-sentinel.cjs` (line 573), `upgrade-level.sh` (lines 113 and 126), `goal-slice.cjs` (lines 19 and 37) and `spec-doc-structure.ts` (line 1042).
- The plan's "spec merger" is not a module name in the tree. The nearest merge code is create.sh's phase-map and phase-context merge (lines 1732-1962), and that code writes anchors.

**Changed helpers and their callers:**
- `parseAnchorPairs` and `fencedLines`: heal-spec-docs.cjs only (`repairDuplicateAnchors`, `unnestQuestionsAnchors`, `anchorWrap`).
- `unnestQuestionsAnchors`: upgrade-legacy.mjs line 934 (archived packets, `repairArchived`) and line 976 (the dry-run preview), plus the healer's exports.
- `repairAnchorFile`: upgrade-legacy.mjs line 835 (active packets, `repairPackets`). `repairAnchors`: upgrade-legacy.mjs line 976 (the dry-run preview).
- `writeFileAtomic`: heal-spec-docs.cjs line 639 (`repairAnchorFile`), line 1354 (lane modes), and upgrade-legacy.mjs line 936 (`repairArchived`).
- `writeDocumentAtomic`: deleted in closeout 3 (OC-O2). Its one caller, `repairArchived`, now calls `writeFileAtomic` (upgrade-legacy.mjs line 936).
- `runAnchorRepair`: the `--anchor-repair` command line only.

**Response fields:** the stdout lines `would repair`, `repaired`, `left unchanged` and `anchor repair: documents=...`, and the upgrade-legacy step lines `step anchor-repair: ok` and `FAILED`. The only code that parses them is `anchor-repair-sample.vitest.ts` (lines 176 and 231-256). No production code reads them.

**Policies and docs:** the ANCHORS_VALID entry in `runtime/cli/lib/validator-registry.json` (line 100), the rule text in `references/validation/validation-rules.md` (line 58) and `references/validation/path-scoped-rules.md` (line 82). This phase did not change those three. The spec/README.md rows at lines 113-114 and 224 describe this phase and were checked against the code.

**Tests:** heal-anchor-repair.vitest.ts, anchor-repair-sample.vitest.ts (reads the committed fixture set), the three anchor cases in upgrade-legacy.vitest.ts, and the allowance at workflow-invariance.vitest.ts line 93.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:review-rounds -->
## Review Rounds and Findings

- **Round 1, read-only DeepSeek reviewer on opencode-go.** Three findings, all fixed.
  - P1: the un-nesting changed wrapper-hybrid documents that the sample test skipped, and nothing reported the change. Fixed: the tool refuses those layouts and names the wrapper, and the sample test asserts that refused documents stay byte-identical.
  - P2: the archived write path did not re-apply the document mode after the rename, so a restrictive umask could strip its bits. Fixed: the mode is re-applied, and a test reproduced the loss before the fix.
  - P2: a closing fence in a test was a literal word, not the fence. Fixed: the fence is interpolated.
- **Found while building, not by review.** A case-insensitive count of `### Open Questions` subheadings refused documents that were already flat. Fixed: only the H2 OPEN QUESTIONS heading counts. The sample test also read the live tree, so later un-nesting could break it. Fixed: it reads the committed fixture set.
- **Round 2, read-only DeepSeek reviewer on cli-devin.** One finding, P2: the acceptance criteria, tasks, plan and summary cited `heal-spec-docs.vitest.ts`, which does not exist. Fixed at closeout: the citations name `heal-anchor-repair.vitest.ts`, and the archived test is named by its title instead of a line number.
- **Final review, fresh Opus high, read-only, across the batch.** No P0. One P2 for this phase: the upgrade-legacy README rows misdescribed archived writes and the anchor-repair scope. Fixed.
- **Fresh Opus high alignment and overengineering review (closeout 3, 2026-10-09, requested by the operator).** The verdict was aligned with `sk-code-opencode`, with overengineering to simplify first, and every finding was P2. The findings that touched this phase's code, each confirmed by its builder before the fix:
  - OC-F1: the healer's sections are numbered 1 to 6, and its constants sit in section 2.
  - OC-O1: the two per-tool caches in upgrade-legacy (`anchorToolsFor` and `laneToolsFor`) became one healer loader, `healerFor`.
  - OC-O2 and OC-O3: one atomic writer. The healer's `writeFileAtomic` is exported and makes one exclusive create, with no `EEXIST` retry loop. Upgrade-legacy's `writeDocumentAtomic` was deleted.
  - OC-O4 (its constant sits in phase 013's code): `ANCHOR_NESTING_SEVERITY` was removed from `orchestrator.ts`, and this summary's citations to it were corrected.
  The other findings sit in code that other phases own: F2 (a `planLayoutMove` JSDoc) and O5 (an unreachable refusal-order fallback) in upgrade-legacy, and O6 (two exports) in phase 012's frontmatter code. The reviewer reported its own checks as passing: comment hygiene, drift guards, the alignment drift check, `node --check` and the mirror sync.
- **Luna test review (TR-R1, read-only, closeout 3).** The review's changed-file list names no file from this phase, and it reported no finding on this phase. Its three findings sit in phases 015, 012 and 009. It could not start Vitest, because the sandbox denied Vite's cache write, so it read the tests and did not run them. This phase's tests were checked by the focused run and the gates in the third pass below.

### Finding classes

The second closeout pass (2026-10-09) classed each finding that touches this phase, using the CHK-FIX-001 list. The Opus final review also raised F1, F2, F3, F5, F6 and F7 on other phases' code (015, 003, 009 and 013). Those belong to their own packets and are not classed here.

| Source | Finding | Class | Fix and where it sits |
|--------|---------|-------|-----------------------|
| Round 1 | F1 (P1): the un-nesting changed 37 wrapper-hybrid documents that the sample test skipped, and nothing reported it | `algorithmic`: the move never checked whether the moved opener would overlap a second wrapper | `unnestQuestionsAnchors` refuses the layout and names the wrapper (heal-spec-docs.cjs, after the move). Test: "refuses the un-nesting when the OPEN QUESTIONS heading is already wrapped". The sample asserts that refused documents stay byte-identical. |
| Round 1 | F2 (P2): the archived writer did not re-apply the mode after the rename, so a restrictive umask removed its bits | `instance-only`: upgrade-legacy's `writeDocumentAtomic` was the only packet-document writer without the re-apply. The other document writers keep the mode: heal-spec-docs.cjs:589 at round 1, now :612 (`fchmodSync`), template-phrase-cleanup.mjs:237 (`fchmodSync`) and repair-derived.cjs:226 (`chmodSync`, which sets the exact mode) | Closeout 3 deleted upgrade-legacy's `writeDocumentAtomic` (OC-O2). The re-apply now sits in the healer's `writeFileAtomic` (heal-spec-docs.cjs:612, `fchmodSync`), which both the archived and the active write call. Test: "keeps an archived document mode under a restrictive umask". |
| Round 1 | F3 (P2): a closing fence in a test was the literal word "fence" | `instance-only`: one test fixture | The fence is interpolated in heal-anchor-repair.vitest.ts. |
| Found while building | A case-insensitive count of `### Open Questions` subheadings refused documents that were already flat | `algorithmic`: the heading match rule | `OPEN_QUESTIONS_RE` accepts only the H2 section heading (heal-spec-docs.cjs:135). Test: "treats a flat questions anchor with a deeper Open Questions subheading as needing nothing". |
| Found while building | The sample test read the live `specs/` tree, so later corpus un-nesting could change its result | `test-isolation` | The sample reads the committed fixture set in `tests/fixtures/anchor-repair-sample/`. |
| Round 2 | F1 (P2): four documents cite `heal-spec-docs.vitest.ts`, which does not exist. The first attempt on the auto route produced no review, so the rerun used the approved route. | `matrix/evidence`: a wrong test name in the evidence cells | Citations name `heal-anchor-repair.vitest.ts`. The closeout grep finds the old name in this folder only in the correction notes, in the rows that describe them, and in limitation 11. |
| Final review, fresh Opus high | F4 (P2): the upgrade-legacy README rows misdescribed archived writes and the anchor-repair scope | `instance-only`: one README section | spec/README.md rows at lines 113-114 and the refusals note at line 224. Closeout read the rows against the code. |
| Whole-tree gate tree1 (not a review) | `workflow-invariance` flagged 155 hits in the new sample fixtures | `cross-consumer`: the invariance test replays spec text from the corpus, so the fixture set is a new consumer | workflow-invariance.vitest.ts:93 allows the `anchor-repair-sample/` prefix. The test passes 2 of 2 in tree4. |

<!-- /ANCHOR:review-rounds -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fence-aware pairing | Code fences delimit their own content, so anchors inside a fence must never pair with anchors outside it. |
| Collision check before numbering | A suffix that already exists would make two anchors share a name, which breaks retrieval later. The check refuses the rename instead. |
| Dry run writes nothing | Dry run is a contract. The mode prints its findings to stdout and writes no leftovers file. |
| Un-nesting moves markers only | Prose is what the packet says, so only the opener line moves. Every prose line stays as written. |
| Archived documents get the un-nesting only | Archived records must not change beyond the marker move the operator approved on 2026-10-08. No other anchor repair runs on them. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

- **Builders and reviewers ran on other routes.** The phase goal named GPT-6 Luna through cli-codex in D6 and DeepSeek on the LLM Gateway route in D7. Builders and reviewers instead ran on DeepSeek V4.1 Flash max through cli-pi on opencode-go and through cli-devin, per parent decision D1 and the operator. opencode-go ran out of quota and llmgateway returned reasoning_content errors, so later work ran on Devin under D7.
- **Corpus handling.** The operator chose "Auto + hand-fix, then error". The tool un-nested every scope marker-only. DeepSeek briefs moved the markers by hand in the documents the tool refused, and the error step waited for a census with zero nesting.
- **Re-derive in scratch.** An un-nesting re-derive wrote into scratch packets. Those writes were reverted, and the marker move was re-applied without a re-derive.
- **Tool-inserted duplicates in merged-030.** One scratch packet, merged-030, had duplicate anchor pairs inserted by a tool. They were removed by hand.
- **Test file names.** The plan named `heal-spec-docs.vitest.ts`, which does not exist. The tests are `heal-anchor-repair.vitest.ts` and `anchor-repair-sample.vitest.ts`. The archived test the plan cited at line 208 is now the un-nesting test in `upgrade-legacy.vitest.ts`.
- **The 50-document sample.** The check runs on a frozen, seeded set of 60 copies drawn from the corpus at commit `02cc1fb94824`, not on 50 random live documents.
- **Heading match narrowed.** Found while building: a case-insensitive count of `### Open Questions` subheadings refused documents that were already flat. Only the H2 OPEN QUESTIONS heading counts now.
- **Sample fixtures and invariance allowance.** The sample test reads the committed fixture set. The workflow-invariance test allows that folder prefix (workflow-invariance.vitest.ts line 93), because the corpus text is replayed verbatim.
- **Producer list corrected.** The plan named `create.sh` as the only anchor producer. The closeout inventory found more writers. See Producer and consumer inventory.
- **Atomic writer moved.** The summary before closeout 3 named an upgrade-legacy `writeDocumentAtomic` for archived writes. The fresh Opus alignment review found that it duplicated the healer's writer, so closeout 3 deleted it (OC-O2).

<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Task T011 is open.** The corpus apply un-nested the 50 source packets. `validate.sh --strict` passes 49 of them and fails one, a scratch backup at `specs/system-speckit/028-memory-search-intelligence/scratch/topology-migration-backup/identity-backups/004-dark-flag-graduation/001-multihop-tail-appends`. That packet's graph-metadata.json and description.json are unchanged from HEAD, and their metadata names a non-scratch folder with a missing source fingerprint docset. Its spec.md changed only marker lines, and its ANCHORS_VALID check passes. The fix sits outside this phase, so an operator decision is needed. Second pass (2026-10-09): the failing rules name only the metadata fields and the folder path, and both metadata files equal HEAD, so the drift predates this build. That is inferred from the history and the messages, since no run at HEAD was made. Evidence: gates/closeout2-011/t011-scratch-validate.out.
2. **Two rules have no test.** An unclosed code fence extends to the end of the file in the code, and no test covers that. The case where the old and new questions anchors both exist, which the code reports as ambiguous, has no test either. Second pass (2026-10-09): both cases now have rows in the adversarial table, and both pass in gates/closeout2-011/focused-verbose-3.out.
3. **Wrapper-hybrid documents need a hand fix.** The tool refuses the layouts where the OPEN QUESTIONS heading already sits inside another wrapper. Those documents were fixed by hand, and the tool still refuses them.
4. **Not committed.** The changes are in the working tree. Under parent decision D6 they ship in one combined commit with phases 003, 009, 012 and 015. The commit SHA is needed to close the fix-completeness row that pins evidence to a fix SHA.
5. **Ordering with phase 013.** The corpus un-nesting must land before or with the change that makes nesting an error. A probe on a committed, pre-un-nesting spec.md (007-orchestrator-inline-authority) gave three "is opened inside" errors, which the new check reports.
6. **Checklist items left open.** In tasks.md these stay open: CHK-011 (console output not audited), CHK-013 (project pattern review), CHK-022 (the edge cases in limitation 2), CHK-031 (input validation), CHK-041 (comment adequacy) and the seven CHK-FIX rows, which need finding classes, consumer inventories and a fix SHA.
Second pass (2026-10-09): CHK-011, CHK-013, CHK-022, CHK-041 and CHK-FIX-001 to CHK-FIX-003 are now closed. The open list is CHK-031, CHK-FIX-004, CHK-FIX-005, CHK-FIX-006 and CHK-FIX-007.
7. **Argument handling (CHK-031).** `heal-spec-docs.cjs --anchor-repair --folder` with no value throws a TypeError and exits 1. An unknown flag is ignored, so `--bogus` runs the dry run over the whole `specs` tree. A `--folder` that does not exist exits 0 and prints `documents=0`. upgrade-legacy's parser rejects these cases with exit 2. The healer's default mode parses its arguments the same way at HEAD (heal-spec-docs.cjs lines 296-298 at HEAD), so the convention predates this phase.
8. **Symlinked spec.md (outside-root, CHK-FIX-004).** A probe in a scratch folder outside the repository used a packet whose spec.md is a symlink to a file outside the packet. `--anchor-repair --folder <packet> --apply` replaced the link with a regular file holding the repaired text, and the link target kept its unrepaired content. The healer's `writeFileAtomic` does this. Closeout 3 later deleted upgrade-legacy's separate writer, which renamed the same way and was not probed. Both upgrade-legacy paths now call the healer's `writeFileAtomic`, the writer the probe exercised. No test covers this case, and closeout made no code change.
9. **SC-003 wording.** spec.md SC-003 says that applying the repair to 50 documents "leaves all documents valid after repair". The result is 49 of 50, and the failing one is the T011 scratch backup. The acceptance rows do not include SC-003, so Status Complete stands under the acceptance rule. The operator should read SC-003 against T011.
10. **Concurrent runs.** Two focused runs in this worktree failed seven upgrade-legacy cases with exit 3 while another session's test run was active. A later run passed. The cause was not captured. Parallel test or build runs in one worktree can make the validator refuse to run.
11. **Same missing test name in other packets.** The 015 packet and the 033/037 packet also cite `heal-spec-docs.vitest`. Those packets are outside this phase and were not edited.

<!-- /ANCHOR:limitations -->
