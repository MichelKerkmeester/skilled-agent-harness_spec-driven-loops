# Review Report - specs/sk-code/014-code-modes-research

**Run:** fan-out `1792944728998-jpqv4b`, synthesis of lineages `deepseek` (cli-pi, deepseek-v4.1-flash-1017) and `luna` (cli-codex, gpt-6-luna)
**Iterations:** 10 (5 per lineage), stop reason `maxIterationsReached` in both lineages
**Target type:** spec-folder (Level 2 phase parent, two Level 2 children)
**Synthesis method:** every lineage finding was re-opened at its cited file and line and marked CONFIRMED, REFUTED or DUPLICATE. Five operator focus areas the lineages did not cover (research drift, sk-code-skilled code alignment, sk-doc docs alignment, commands, the two open decisions) were checked directly and add five findings.

---

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

- `hasAdvisories`: false. The verdict is not PASS, so the advisory flag does not apply.
- Confirmed active findings: **P0 0, P1 2, P2 14** (16 total). Of the 19 merged lineage findings, 11 are confirmed as unique findings, 4 are duplicates folded into them, and 4 are refuted. Five further findings come from the operator focus checks.
- Two lineage P1 findings were downgraded to P2 after re-reading (Luna R2-P1-001, DeepSeek R2-P1-001), and one (DeepSeek R3-P1-002) was refuted.
- Review scope: both children's spec, goal, tasks, acceptance criteria, decision records, summaries and `research/research.md`; the parent spec and goal; and, as reference evidence, `.skilled/skills/sk-code/` (hub files, `sk-code-quality/`, `sk-code-review/`, `sk-code-skilled/`), the sk-doc mode contracts and validators, and `.skilled/commands/` with runtime mirrors.

The research deliverables hold up. Every load-bearing claim spot-checked against the current `sk-code-quality` and `sk-code-review` trees still holds, both mode folders are byte-identical to baseline `f8671e07c2`, all hub routing and doc-claim gates pass, and three live routing replays reproduce the defects the research reported. The two P1 findings sit in the closure layer: the goal files that decide "done" were never reconciled with ADR-002 or the operator-scoped boundary check, and AC-009 in both children closes as Met against a scope its own criterion does not state, with no ADR behind it.

**Lineage depth.** The Luna iterations were shallow but accurate. Each ran inline in about a minute, read only the goal, spec, tasks, acceptance and summary files, and raised one finding. None of the five is refuted, though one P1 is downgraded. Luna never opened `research/research.md`, a skill file or a citation. DeepSeek went deeper: it machine-matched 301 source tags and read the hub playbook. Three of its findings are refuted, because it read the Decision section of ADR-001 and missed the Implementation section, and because two findings judged runtime behaviour this packet does not own.

## 2. Planning Trigger

`/speckit:plan` **is required**. Both P1 findings are documentation repairs inside this packet, so the plan is small. One of them, S-P1-01, needs an operator decision on whether to amend the goal's durable directive.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "CONDITIONAL",
    "hasAdvisories": false,
    "activeFindings": {
      "P0": 0,
      "P1": 2,
      "P2": 14,
      "ids": [
        "S-P1-01", "S-P1-02",
        "S-P2-01", "S-P2-02", "S-P2-03", "S-P2-04", "S-P2-05", "S-P2-06", "S-P2-07",
        "S-P2-08", "S-P2-09", "S-P2-10", "S-P2-11", "S-P2-12", "S-P2-13", "S-P2-14"
      ]
    },
    "remediationWorkstreams": [
      "W1 (P1) reconcile parent and child goal.md directives and completion criteria with ADR-002 and the boundary scope: S-P1-01",
      "W2 (P1) record the operator-scoped .skilled boundary check as ADR-003 and re-close AC-009 and CHK-032 against it: S-P1-02",
      "W3 (P2) packet closure-document refresh: S-P2-01, S-P2-02, S-P2-03, S-P2-04, S-P2-05, S-P2-06, S-P2-09",
      "W4 (P2) research evidence upkeep: S-P2-07, S-P2-08",
      "W5 (P2, skill side) sk-code mode docs and scripts per sk-doc and sk-code-skilled contracts: S-P2-10, S-P2-11, S-P2-12",
      "W6 (P2, skill side) hub routing integration: S-P2-13, S-P2-14"
    ],
    "specSeed": [
      "Goal completion criteria must name the same counts and the same boundary command the acceptance rows close against.",
      "An acceptance row whose verification is narrowed by the operator closes as Superseded with an ADR, never as Met against an unstated scope.",
      "The quality-to-review evidence envelope premise is restated: deep-review is a documented consumer, sk-code-review is not.",
      "Hub routing contract and compiled routing behaviour agree on whether a surface packet may be selected alone."
    ],
    "planSeed": [
      "Add ADR-003 to both children and re-close AC-009 and CHK-032 against it.",
      "Amend or supersede goal.md D3, D4 and the completion criteria in the parent and both children, then tick each criterion with fresh evidence.",
      "Refresh acceptance metadata Status, AC-003 to AC-005 criterion text, CHK-031 wording, stale limitations, completion_pct and the parent handoff row.",
      "Re-anchor the ten drifted ROUTER.md source tags and correct the envelope premise in 002/spec.md:71 and 001/research/research.md:21.",
      "Hand S-P2-10 to S-P2-14 to a skill-side packet; they change files under .skilled/ and are outside this packet's D1."
    ],
    "findingClasses": [
      "spec-contract-drift", "closure-gate-integrity", "checklist-wording", "lifecycle-metadata-drift",
      "criterion-staleness", "stale-record", "metadata-inconsistency", "duplicated-rule-drift",
      "citation-drift", "premise-overstatement", "workspace-hygiene", "doc-contract-nonconformance",
      "census-drift", "code-header-nonconformance", "routing-integration-defect", "contract-behaviour-mismatch"
    ],
    "affectedSurfacesSeed": [
      "specs/sk-code/014-code-modes-research/goal.md",
      "specs/sk-code/014-code-modes-research/spec.md",
      "specs/sk-code/014-code-modes-research/00{1,2}-*/goal.md",
      "specs/sk-code/014-code-modes-research/00{1,2}-*/acceptance-criteria.md",
      "specs/sk-code/014-code-modes-research/00{1,2}-*/decision-record.md",
      "specs/sk-code/014-code-modes-research/00{1,2}-*/tasks.md",
      "specs/sk-code/014-code-modes-research/00{1,2}-*/implementation-summary.md",
      "specs/sk-code/014-code-modes-research/00{1,2}-*/research/research.md",
      "specs/sk-code/014-code-modes-research/scratch/",
      ".skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/",
      ".skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md",
      ".skilled/skills/sk-code/sk-code-quality/scripts/",
      ".skilled/skills/sk-code/hub-router.json",
      ".skilled/skills/sk-code/ROUTER.md",
      ".skilled/skills/sk-code/SKILL.md"
    ],
    "fixCompletenessRequired": true
  }
}
```

## 3. Active Finding Registry

Each finding lists its source lineage findings, the evidence observed in this synthesis and a remediation a separate worker can apply without re-investigating. "Operator decision" marks a fix that needs one.

### P1 - Required

#### S-P1-01 - Goal directives and completion criteria were never reconciled with the executed contract

- **Severity:** P1 · **Dimension:** traceability · **Class:** spec-contract-drift
- **Sources:** Luna R1-P1-001 (CONFIRMED), DeepSeek R3-P1-001 goal half (CONFIRMED), DeepSeek R5-P2-001 and Luna R5-P2-001 (DUPLICATE, folded in)
- **Location:** `specs/sk-code/014-code-modes-research/goal.md:42,52,53,84-87`; `001-quality-mode-research/goal.md:38,58,59,62,95`; `002-review-mode-research/goal.md:38,58,59,62`
- **Evidence:** Parent D3 (goal.md:52) still says "exactly ten iterations" and D4 (goal.md:53) still says odd/even alternation through cli-pi. All four parent criteria and all six criteria in each child are unchecked `[ ]`. Three are false as written: the state logs hold 15 iteration records and two `synthesis_complete` records, not 10 and one; `iteration-015.md` exists beyond the criterion's 001 to 010 range; and `git -c core.fsmonitor=false diff --stat f8671e07c2 -- .skilled` prints `131 files changed` at HEAD, while the criterion wants no `.skilled/` path. The 001 child log (goal.md:95) says "the first two criteria read 15 records and `iteration-015.md`", but lines 58 and 59 still read 10. The parent log (goal.md:113) says "The directive text is left as written." Under the repo's goal-posture rule the goal file is the only source of goal state, and goal.md:75 says "Only the criteria below decide done", so the packet's own stop condition reads not done.
- **Impact:** A resume, or a goal evaluator, reads the packet as incomplete or re-runs the ten-iteration plan on the refused executor.
- **Remediation:** Edit through `sk-create-goal`. (1) Parent `goal.md`: amend line 42 "ten-iteration" to "fifteen-iteration (ten, then a five-iteration second-model pass per ADR-002)". Amend D3 to fifteen, citing ADR-002, and D4 to "iterations 1 to 10 on Luna via cli-codex, 11 to 15 on DeepSeek V4.1 Flash Max via cli-devin, per ADR-002". Amend criterion 2 to "15 records of type iteration and a latest synthesis_complete record with stopReason and totalIterations 15". Amend criterion 3 to the ADR-003 scoped command from S-P1-02. Re-run each criterion and tick it with the observed output in the log. Delete "The directive text is left as written" from line 113. (2) In both child `goal.md` files, make the same change to the objective (line 38) and criteria 58, 59 and 62, then tick all six with evidence. In 001 `goal.md:95`, record what was actually amended. (3) Run `goal.cjs packet` and confirm `packet_budget=ok` before the slice is resent.
- **Operator decision:** the goal file says "Changing one is an amendment". Choose between (A) amending D3, D4 and the objective text, which changes the durable slice that must be resent, and (B) keeping the directive as historical, adding a row that marks D3 and D4 superseded by ADR-002, and amending only the completion criteria.

#### S-P1-02 - AC-009 closes as Met against a narrowed scope its criterion does not state, with no ADR

- **Severity:** P1 · **Dimension:** traceability · **Class:** closure-gate-integrity
- **Sources:** DeepSeek R3-P1-001 acceptance half (CONFIRMED)
- **Location:** `001-quality-mode-research/acceptance-criteria.md:65`; `002-review-mode-research/acceptance-criteria.md:65`; `00{1,2}-*/tasks.md:167` (CHK-032)
- **Evidence:** Both rows state "Then no path under `.skilled/` changed" with the command `git diff --stat $BASE_SHA -- ':/.skilled'`, then record "Met" against a different command scoped to `sk-code-quality` and `sk-code-review`. The scoped command does print nothing today; this synthesis re-ran it and it printed no output. The literal command prints 131 files at HEAD, against the 120 (001) and 45 (002) recorded. The only record of the operator's direction is a Key Decisions row (`002-review-mode-research/implementation-summary.md:101`). `decision-record.md` holds only ADR-001 (AC-011) and ADR-002 (second pass) in each child. The file's own contract (acceptance-criteria.md:31-33, 80-84) requires a Waived or Superseded row to name an ADR, and treats an unbacked waiver as Unmet.
- **Impact:** The only boundary gate on D1 ("No file under `.skilled/` changes") closes without the record the closure contract requires.
- **Remediation:** In each child's `decision-record.md`, add `ADR-003: Scope the .skilled boundary check to the two subject mode folders`. Context: concurrent CI wiring edited other `.skilled/` paths during the runs. Decision: the check becomes `git diff --stat f8671e07c2 -- .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/sk-code-review` printing nothing, plus `git status --short --untracked-files=all` on the same paths printing 0 lines. Deciders: the operator, as `implementation-summary.md:101` records. Then, in both `acceptance-criteria.md` AC-009 rows, either set Status `Superseded` and Waiver `ADR-003`, or rewrite the Then clause to name the two folders and keep `Met` with ADR-003 cited. Replace the stale whole-folder counts with "131 at HEAD, all outside the two folders". Point the CHK-032 evidence in both `tasks.md` files at ADR-003, and use the same command in goal criterion 3 (S-P1-01).

### P2 - Advisory

#### S-P2-01 - CHK-031 says no file outside research/ was written while its evidence records authorized spec.md edits

- **Sources:** Luna R2-P1-001 (CONFIRMED, downgraded P1 to P2)
- **Location:** `002-review-mode-research/tasks.md:166`, `001-quality-mode-research/tasks.md:166`
- **Evidence:** CHK-031 [P0] reads "No file outside `research/` is written by the run". The 002 evidence cell adds "The workflow made its bounded `spec.md` edits." Parent D1 (`spec.md:112`) and NFR-S01 (`002-review-mode-research/spec.md:163`) authorize those edits, so no unauthorized write is shown. Luna's own downgrade trigger, an authorizing source decision, is met. The defect is the criterion's wording.
- **Remediation:** In both `tasks.md` files, change CHK-031 to "No file outside `research/` is written by the run, apart from the bounded `spec.md` edits D1 and NFR-S01 allow", with evidence naming the `spec.md` anchors the workflow edited.

#### S-P2-02 - Acceptance metadata reads In Progress on closed phases

- **Sources:** DeepSeek R1-P2-001 (CONFIRMED), Luna R3-P2-001 (DUPLICATE)
- **Location:** `001-quality-mode-research/acceptance-criteria.md:42`, `002-review-mode-research/acceptance-criteria.md:42`
- **Evidence:** `**Status:** In Progress`, while line 92 says `Closeable: Yes`, frontmatter `completion_pct: 100`, and both summaries and the parent map say Complete.
- **Remediation:** Set line 42 in both files to `**Status:** Complete`, after W1 and W2 land.

#### S-P2-03 - AC-003 to AC-005 still assert ten iterations

- **Sources:** DeepSeek R3-P2-001 (CONFIRMED)
- **Location:** `00{1,2}-*/acceptance-criteria.md:59-61`
- **Evidence:** The Then clauses say "ten record files", "there are ten" and `totalIterations` equal to 10. The observed output is 15 paths, 15 records and a latest record with `totalIterations` 15. The rows are Met against text that no longer matches their evidence.
- **Remediation:** In both files, amend the AC-003 to AC-005 Given/When/Then and Verification commands to fifteen (`iteration-001.md` to `iteration-015.md`, `grep -c` prints 15, the latest `synthesis_complete` has `totalIterations` 15), citing ADR-002, and keep the first-pass observation as history.

#### S-P2-04 - Known Limitations describe stray files that were deleted

- **Sources:** DeepSeek R1-P2-002 (CONFIRMED), Luna R4-P2-001 (DUPLICATE); the 001 half is new in this synthesis
- **Location:** `002-review-mode-research/implementation-summary.md:128`; `001-quality-mode-research/implementation-summary.md:131`; `001-quality-mode-research/tasks.md:185`
- **Evidence:** 002 limitation 4 names `research/.tmp-iter-012-event.json`, and 001 limitation 2 names `research/.iter-014-event.json` plus "a ledger, a state projection and lock folders under `research/deltas/`". `ls -a` of both `research/` folders shows neither event file. The only leftover is `001-.../research/deltas/.legacy-projection-watermarks/research-state.json`, which is gitignored (`.gitignore:423`). That also makes 001 CHK-050's "`ls -A research/deltas` lists only the fifteen iteration files" slightly inaccurate.
- **Remediation:** Replace both limitations with the disposition: deleted with the operator's approval, and one gitignored watermark file remains under `001-.../research/deltas/`. Reword 001 CHK-050 evidence to "lists the fifteen iteration files and one gitignored `.legacy-projection-watermarks/` folder".

#### S-P2-05 - completion_pct and open questions disagree across the packet

- **Sources:** DeepSeek R1-P2-003 (CONFIRMED)
- **Location:** `spec.md:30` (95), `goal.md:26` (0), `00{1,2}-*/goal.md:23` (0), every other child doc (100); `spec.md:31-32` and `goal.md:27-28`
- **Evidence:** One closed packet reports 95, 0 and 100. Both parent frontmatters still list "Does the executor alternation run per iteration or per child?" as open, though ADR-002 made it moot.
- **Remediation:** Set `completion_pct: 100` in `spec.md` and all three `goal.md` files after W1 and W2. Move the alternation question to `answered_questions`, citing ADR-002, in `spec.md` and `goal.md`, and mark the matching bullet in `spec.md` section 4 answered.

#### S-P2-06 - The parent handoff row publishes the pre-ADR-001 command

- **Sources:** DeepSeek R5-P2-003 (CONFIRMED)
- **Location:** `spec.md:151`
- **Evidence:** The row's verification is the whole-folder `grep -rc "001-quality-mode-research/research" 002-review-mode-research/research`, which prompts and receipts make non-zero by design (ADR-001 context). The row's prose says "Narrowed ... by ADR-001" but shows neither the narrowed paths nor the skip clause in `decision-record.md:128`.
- **Remediation:** Replace the command cell with the amended check from `002-review-mode-research/decision-record.md:128`: the four research-content paths, piped through `grep -vE '(was not read|Nothing under .* was read)'`, printing nothing.

#### S-P2-07 - Ten ROUTER.md source tags no longer land on their quoted text

- **Sources:** DeepSeek R2-P2-001 (CONFIRMED)
- **Location:** `001-quality-mode-research/research/research.md:213` and the other `ROUTER.md` tags (001: lines 3, 54, 177, 181, 243 three times, 274, 283, 390; 002: lines 171, 283)
- **Evidence:** `ROUTER.md:243` is now the `DEBUGGING` keyword row. The quoted `"CODE_QUALITY" ... "code smell"` row is at line 242. Lines 171 and 177 are blank. Hub commits after the runs (for example `00cbd93cc9`, `af103fcda4`) shifted the file. The quoted text survives, so each claim can still be found by search.
- **Remediation:** In both `research/research.md` files, re-anchor each `[SOURCE: .skilled/skills/sk-code/ROUTER.md:N]` to the line holding its quoted fragment (for example 243 to 242), or add one sentence to each References section saying that hub line anchors are read against baseline `f8671e07c2`.

#### S-P2-08 - The envelope premise says no reader is documented, but the hub playbook documents one

- **Sources:** DeepSeek R2-P1-001 (CONFIRMED, downgraded P1 to P2); the 001 extension is new in this synthesis
- **Location:** `002-review-mode-research/spec.md:71`; `001-quality-mode-research/research/research.md:21` ("its result envelope has no documented reader") and rank 9 (line 210)
- **Evidence:** `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:153-155` documents what `sk-code-quality` hands forward and says "`deep-review` consumes it" in its traceability dimension. That text was present at baseline (`git show f8671e07c2:...` matches). The narrower claim still holds: `sk-code-review/SKILL.md` names `sk-code-quality` only as the author-side owner (lines 43, 474) and never reads the envelope, and no machine parser exists. That is why this is downgraded: review rank 6 and quality rank 9 stand, but their premise is overstated.
- **Remediation:** In `002-review-mode-research/spec.md:71`, replace "No other file under `.skilled/skills/sk-code/` mentions the quality gate's advisory envelope" with "Only the hub playbook (`manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:153`) documents a reader of the quality gate's advisory envelope, and that reader is deep-review, so `sk-code-review` has no documented way to read it". In `001-.../research/research.md:21` and the rank 9 Why cell, change "no documented reader" to "no parser and no reader in `sk-code-review`; the hub playbook documents deep-review as its consumer", citing the playbook line.

#### S-P2-09 - Used commit-message drafts are left in the packet scratch folder

- **Sources:** DeepSeek R5-P2-004 (CONFIRMED, corrected)
- **Location:** `specs/sk-code/014-code-modes-research/scratch/`
- **Evidence:** `git status` shows `commit-message-001.txt`, `commit-message-002.txt` and `commit-message-parent.txt` untracked, and `commit-message.txt` tracked (committed in `251a60f3d6`). That is three untracked, not four as the lineage title says. Each draft matches a commit that has already landed, for example `f901d94499`.
- **Remediation:** Delete the three untracked drafts, and either delete the tracked `commit-message.txt` in the next packet commit or record why it is kept. The operator approves deleting untracked files.

#### S-P2-10 - The sk-code-quality playbook root does not follow the playbook mode and uses retired names

- **Sources:** new (operator focus c)
- **Location:** `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:2-31`; `quality-gate/quality-checklist.md:5,28,58`
- **Evidence:** `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type playbook` prints `INVALID`, with 4 blocking errors: the required sections `overview`, `global_preconditions`, `global_evidence_requirements` and `deterministic_command_notation` are missing. The `sk-code-review` and hub playbooks pass the same check. The file has no numbered sections, unlike `sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md`. It uses the retired name "code-quality" in its title, description and lines 7, 9 and 10. Lines 28 and 58 of the scenario name a "Webflow-only standard", but the hub has exactly two surfaces (`SKILL.md:39`). Line 10 says target-path routing is "verified by its own unit test", which the research could not find (`001-.../research/research.md` open question 3). The package validator passes it, because it checks scenario structure, not the root sections.
- **Remediation:** Rewrite the root file from `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` with numbered sections `1. OVERVIEW`, `GLOBAL PRECONDITIONS`, `GLOBAL EVIDENCE REQUIREMENTS` and `DETERMINISTIC COMMAND NOTATION`, keeping the CQ-001 table and the result-persistence contract. Rename "code-quality" to `sk-code-quality`. Delete "verified by its own unit test", or cite the test if one exists. In `quality-gate/quality-checklist.md:28,58`, replace "Webflow-only standard" with "a surface-owned standard". Re-run `validate_document.py --type playbook` until it prints `VALID`.

#### S-P2-11 - The sk-code-review playbook states 30 and 31 scenarios

- **Sources:** new (operator focus c); confirms the research's untested rank 10 sub-claim
- **Location:** `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md:37` against `:138,167,183`
- **Evidence:** Line 37 says 30 scenarios across 8 categories. Lines 138, 167 and 183 say 31. `validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-review/manual-testing-playbook` derives 30 scenarios and 8 categories and warns `HAND_TYPED_CENSUS`.
- **Remediation:** Change "31" to "30" at lines 138, 167 and 183, or replace each hand-typed count with wording that refers to the root index, which clears the census warning.

#### S-P2-12 - sk-code-quality Python entrypoints lack the COMPONENT header the skilled surface marks P0

- **Sources:** new (operator focus b)
- **Location:** `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1`, `check-dist-staleness.sh:1`, `ceiling-report.sh:1`, `hooks/claude-posttooluse.sh:1`
- **Evidence:** All four are Python behind a `.sh` name (`#!/usr/bin/env python3`), as `scripts/README.md:21-24` records. `sk-code-skilled/assets/checklists/python-checklist.md` P0 "File Header" requires a `COMPONENT:` block after the shebang, and none carries one. `verify_alignment_drift.py --root <mode> --check-exact-headers` reports 8 EXACT-HEADER errors in quality and 4 in review. The default gate (`verify_alignment_drift.py --check-router`) passes both modes with 0 findings, and every test suite passes (`check-comment-hygiene.test.sh`, `ceiling-report.test.sh`, `typo-flags.test.sh`, `hooks/claude-posttooluse.test.sh`, `check-rule-copies.test.sh`, all exit 0). The three review `.js` files carry the older box header, which `javascript-checklist.md` keeps until a rewrite, so they are not counted here. The `.test.sh` hits suggest the opt-in check's test exemption does not match `*.test.sh`, which is a verifier issue rather than a script defect.
- **Remediation:** Add the python-checklist header (`# ───...`, `# COMPONENT: <NAME>`, `# ───...`) directly after the shebang in the four files, above the existing docstring, then re-run `verify_alignment_drift.py --root .skilled/skills/sk-code/sk-code-quality --check-exact-headers` and the four quality test suites. Track the `.test.sh` exemption in the verifier separately.

#### S-P2-13 - A path-only workflow review still routes without the CI surface

- **Sources:** new (operator focus a); confirms review rank 12, refreshed order item 3
- **Location:** `.skilled/skills/sk-code/hub-router.json:76-77` (`code-ci-aliases`); `ROUTER.md` CI_WORKFLOW intent keywords
- **Evidence:** `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review .github/workflows/ci.yml"` returns `single` `[sk-code-review]`, while "review this GitHub Actions workflow" returns `surfaceBundle` `[sk-code-review, sk-code-ci]`. `sk-code-ci/SKILL.md:22` triggers on "reviews a file under `.github/workflows/`", but no vocabulary class holds a path keyword.
- **Remediation:** Add `".github/workflows/"`, `".github/workflows"` and `"workflow file"` to `vocabularyClasses.code-ci-aliases.keywords` in `hub-router.json`, add the same terms to the CI_WORKFLOW intent keywords in `ROUTER.md` section 11, refresh the compiled manifest (`node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`), and confirm that the replay above returns `surfaceBundle` with `sk-code-ci`.

#### S-P2-14 - The router selects a read-only surface alone, which the hub contract says never happens

- **Sources:** new (operator focus a); generalizes quality rank 3, refreshed order item 1
- **Location:** `.skilled/skills/sk-code/SKILL.md:32`; `hub-router.json:9`
- **Evidence:** `SKILL.md:32` says the surface axis is evidence "the hub bundles alongside the primary mode, never a primary itself", and `routerPolicy.outcomes.single` says "one dominant code intent routes to one workflow mode". Replays: "fix the GitHub Actions workflow timeout" and "add a timeout-minutes to the ci job" return `single` `[sk-code-ci]`, and "fix this typescript type error" returns `single` `[sk-code-skilled]`. Both are read-only packets whose registry entries forbid Write and Edit (`mode-registry.json`). `sk-code-skilled/SKILL.md:16` says that surface "owns the implement -> debug -> verify phases", so routing to it alone may be intended, and the contract text may be what is wrong.
- **Remediation (operator decision, Logic-Sync):** `SKILL.md:32` and `outcomes.single` contradict compiled routing behaviour. Choose (A) the contract is right: change the compiled resolver so that a surface-only score attaches a workflow mode (sk-code-quality for author or fix intents, sk-code-review for review intents) and returns `surfaceBundle`; or (B) the behaviour is right: amend `SKILL.md:32` to "never a primary for review or quality work; an implementation prompt may select a surface alone, whose shared doctrine hands off to `sk-code-quality` before completion", and amend `outcomes.single` to match. In both cases, add the three replays above to the hub's compiled-routing playbook.

## 4. Remediation Workstreams

**W1 (P1) - Goal reconciliation, S-P1-01.** Needs the operator's A or B choice first. Edit the parent and both child `goal.md` files through `sk-create-goal`, tick every criterion with fresh output, and check the slice budget.

**W2 (P1) - Boundary ADR, S-P1-02.** Add ADR-003 in both children, then re-close AC-009 and CHK-032 against it. W1's criterion 3 cites the same command, so land W2 first.

**W3 (P2) - Closure-document refresh.** S-P2-01 (CHK-031 wording), S-P2-02 (Status Complete), S-P2-03 (AC-003 to AC-005 to fifteen), S-P2-04 (limitations), S-P2-05 (completion_pct, open questions), S-P2-06 (handoff row), S-P2-09 (scratch drafts). All of these are inside this packet.

**W4 (P2) - Research evidence upkeep.** S-P2-07 (re-anchor ten tags) and S-P2-08 (correct the envelope premise in the spec and the quality synthesis). Both are inside this packet.

**W5 (P2, skill side) - Mode docs and scripts.** S-P2-10, S-P2-11 and S-P2-12 change files under `.skilled/`. This packet's D1 forbids that, so they belong to the later implementation packet the spec anticipates.

**W6 (P2, skill side) - Hub routing integration.** S-P2-13 is Ready. S-P2-14 waits on the operator's Logic-Sync ruling. Both match research rows already ranked in the top three of each refreshed order.

## 5. Spec Seed

- The goal completion criteria, the acceptance rows and the parent handoff table must name the same counts and the same commands. An amendment updates all three, or names the one place that is authoritative.
- An operator-narrowed verification closes as `Superseded` with an ADR. `Met` is reserved for the criterion as written.
- A universal negative ("no other file mentions ...") states the tree it searched. The envelope premise is restated as "no reader in sk-code-review", which is what the runs established.
- A follow-on implementation packet takes the refreshed top five of each child and W5 and W6, after the two open decisions in section 7a are made.

## 6. Plan Seed

1. Ask the operator for the S-P1-01 choice (amend the directive, or supersede it) and the S-P2-14 Logic-Sync ruling.
2. Write ADR-003 in `001-.../decision-record.md` and `002-.../decision-record.md`, then edit AC-009 in both `acceptance-criteria.md` files and CHK-032 in both `tasks.md` files.
3. Edit the three `goal.md` files per S-P1-01, run every criterion, tick it with the output, and run `goal.cjs packet` for the budget.
4. Apply W3: CHK-031, Status, AC-003 to AC-005, the limitations, CHK-050 evidence, completion_pct, open questions, the `spec.md:151` row and the scratch drafts.
5. Apply W4: re-anchor the `ROUTER.md` tags and correct `002/spec.md:71` and `001/research/research.md:21` plus the rank 9 Why cell.
6. Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/014-code-modes-research --recursive --strict` and require `RESULT: PASSED`.
7. Open a skill-side packet for W5 and W6, plus the decisions in section 7a.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Spot-checks of `sk-code-quality/SKILL.md` lines 100, 105, 119, 130, 131, 171, 185, 214, 216 and 296, and `sk-code-review/SKILL.md` lines 108, 223, 233, 350, 472, 503 and 530, all resolve to the quoted text. `git log f8671e07c2..HEAD -- sk-code-quality sk-code-review` is empty. Drift: ten `ROUTER.md` anchors (S-P2-07), and one overstated premise (S-P2-08). |
| `checklist_evidence` | fail | AC-009 closes without an ADR (S-P1-02). The goal criteria are unchecked and false as written (S-P1-01). AC-003 to AC-005 and CHK-031 wording are stale (S-P2-01, S-P2-03). AC-011 is sound: ADR-001's Implementation section records the skip clause (`decision-record.md:128` in both children). |

**AC_COVERAGE:** exempt. Neither child carries `checklist.md`, so the Level 2 acceptance-coverage predicate is not active. The closure gate is `acceptance-criteria.md`, covered under `checklist_evidence`.

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | `mode-registry.json` lists both subject modes as `packetKind: workflow`. `validate_skill_package.py --strict` passes on the hub, `sk-code-quality` and `sk-code-review`. `generate-leaf-manifest.cjs --check` reports leaf-manifest OK. `verify-router-sync.cjs` passes 5/5. `verify-doc-claims.cjs` passes 4/4. |
| `agent_cross_runtime` | pass | `/doctor:sk-code`, the only command bound to the sk-code hub, is mirrored to `.claude/commands/doctor/sk-code.md` (symlink), `.opencode/commands/doctor/sk-code.md`, `.codex/prompts/doctor-sk-code.md`, `.cursor/commands/doctor-sk-code.md`, `.pi/prompts/doctor-sk-code.md` and `.hermes/prompts/doctor-sk-code.md`. |
| `feature_catalog_code` | pass | `validate_document.py --type feature_catalog` is VALID with 0 issues. `validate_catalog_package.py --package sk-code` passes with 0 violations. `feature-catalog.md:35` matches the registry's workflow and surface axes. The modes have no catalogs of their own, and the sk-doc contract does not require one per nested packet. |
| `playbook_capability` | partial | The hub and review playbooks are VALID. The quality playbook root is INVALID, with 4 missing sections (S-P2-10). The review census is inconsistent (S-P2-11). The package validator passes all three. |

### Operator Focus Checks

**a. Research claims against the current skills.** Neither mode changed after baseline, so no research claim was overtaken by an edit to either mode. No recommendation has been applied, which matches D1. Three research defects reproduce live: quality rank 3 / review rank 12 (S-P2-13, S-P2-14), and quality rank 12, where "simplify this, yagni" selects `sk-code-quality` while the stage-two `CODE_QUALITY` keywords at `ROUTER.md:242` still hold no restraint word. The hub's later CI wiring added the `quality-restraint` class (`hub-router.json:52-53`) and restraint words to the prose table (`ROUTER.md:54`), but not to the machine map. Review rank 7 is confirmed against the hub's current two surfaces: `SKILL.md:350` can still only say `SKILLED | UNKNOWN`, so it cannot name `sk-code-ci`. The spec's Complete and Met claims fail only where S-P1-01, S-P1-02 and S-P2-01 to S-P2-06 say.

**b. Code alignment with sk-code-skilled.** The default alignment verifier reports 0 findings in both modes, and all five script test suites pass. The only gap is the P0 header rule (S-P2-12). The Python-behind-`.sh` pattern is documented (`scripts/README.md:21-24`), and the verifier handles it (`verify_alignment_drift.py:598`). The review `.js` files use `'use strict'` inside an ESM package (`.skilled/package.json` `"type": "module"`), which is redundant but harmless.

**c. Docs alignment with the sk-doc modes.** `validate_document.py` passes the hub README and SKILL.md, both mode READMEs and SKILL.md files, both scripts READMEs and the feature catalog. The quality playbook fails (S-P2-10), and the review playbook has census drift (S-P2-11). `check_readme_references.py` fails all seven READMEs, but every hit sampled is a bare filename in prose or an example path, resolved from the README directory. The archived spec paths it flagged exist (`specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`). These are checker false positives, not findings. Every markdown link in both modes and the hub resolves (0 broken).

**d. Commands.** No command under `.skilled/commands/` routes to `sk-code-quality` or `sk-code-review` directly. `/deep:review` is deep-review, and `speckit-implement.yaml:361` and `speckit-complete.yaml:462` reach review through the `@review` agent and the hub. `/doctor:sk-code` follows `sk-create-command`: a thin router, an owned `doctor-sk-code-presentation.txt`, `argument-hint` and least-privilege `allowed-tools: Read, Bash, Grep, Glob`. `validate_document.py --type command` is VALID, and `validate-command-references.cjs` reports all references resolve across 73 asset files. `doctor-runtime-mirrors.yaml:69,81,99` probes `sk-code-quality/scripts/check-dist-staleness.sh`, which exists.

### 7a. Open Research Decisions

**Quality P0 floor.** The research recommends (quality rank 1, refreshed item 4, `001-.../research/research.md:15,36,62`) splitting the always-loaded checklist into a surface-neutral baseline and an opt-in JavaScript and CSS overlay. The P0-blocks-completion rule stays, but fewer P0 items bind a `.js` or `.css` file by default. The second model narrowed the false block to `.js` and `.css`, and noted that the universal baseline already exists, so the split is mostly a pointer swap. **Not reflected:** `sk-code-quality/SKILL.md:100` (ALWAYS), `:146-147` (`DEFAULT_RESOURCE`), `:157` (`RESOURCE_MAP.QUALITY`), `:181`, `:232` and `:265` all still load `assets/code-quality-checklist/overview-header-and-comments.md`, whose P0 items include CHK-HDR-03 (67-character header, line 60) and CHK-SEC-01 (IIFE wrapping, line 100). This synthesis adds one fact: CHK-SEC-01 conflicts with `sk-code-skilled/assets/checklists/javascript-checklist.md:137` ("Module export style matches the file path and package boundary") for this repository's own ESM `.js` under `.skilled/`. **Decision:** should the house-style P0 items stay P0 for `.js` and `.css` files that no surface opts into? **Exact remediation once decided:** in `sk-code-quality/SKILL.md`, replace `assets/code-quality-checklist/overview-header-and-comments.md` in the line 100 ALWAYS row with `../sk-code-skilled/assets/checklists/universal-checklist.md`. Add a row `CONDITIONAL | .js or .css target | assets/code-quality-checklist/overview-header-and-comments.md, assets/code-quality-checklist/naming-init-formatting-and-css.md`. Make the same swap in `DEFAULT_RESOURCE` (line 147) and in workflow steps 181, 232 and 265. Keep `RESOURCE_MAP.QUALITY`. Then regenerate `leaf-manifest.json` with `generate-leaf-manifest.cjs --write .skilled/skills/sk-code`, run `verify-router-sync.cjs`, and update CQ-001's `expected_resources` (`quality-gate/quality-checklist.md:8-10`). If the operator keeps the current floor, record that as a decision and close rank 1. Decided: split the floor (operator, 2026-10-25), applied in phase 3 as its ADR-001, and quality rank 1 is closed.

**Review profile schema.** The research recommends writing the extension-floors list first (review rank 2, refreshed item 1, Ready), then one repo-owned review profile at a framework-neutral, configurable path (a repo-root dot-file, not under `.skilled/`). The profile would carry raise-only `severityOverrides`, additive `mandatoryChecks`, additive `sensitivePaths` and `ignorePaths` that filter optional checks only (rank 1, refreshed item 2, `002-.../research/research.md:90,128-129`). Rank 3's surface-evidence declaration and rank 5's additive never-skip list share that schema. **Not reflected:** `sk-code-review/SKILL.md` has no floors section (the floors are scattered, for example line 108 "never relaxed by surface guidance" and line 558), no profile loader, and a detector that never calls its `read_text` callback (line 233). A repo-wide search for `severityOverrides` or a review profile finds nothing. **Decisions:** the profile's file name and path, its schema, its precedence against environment variables such as `SK_CODE_REVIEW_DEPTH` (`SKILL.md:552`), and who owns the schema: the review packet, or `sk-code/shared/references/` (open question, `002-.../research/research.md:159`). **Exact remediation, Ready now:** add a section `### Extension Floors` to `sk-code-review/SKILL.md` section 4 RULES, listing the baseline security and correctness minimums, no approval with an open P0, the P0 to P2 meanings, the `CODE-REVIEW` marker, the three-value final status line and the cache-only Write scope. Add a pinned-copy assertion for that list in `scripts/check-rule-copies.js`. **After the decisions:** add a schema file and a validating checker under `sk-code-review/scripts/`, wire the loader in `SKILL.md` sections 2 and 9, and document it in `references/review-core.md`.

Decided: no review profile (operator, 2026-10-25). Repository-specific risk comes in through sk-code surface or stack evidence. Barter's coder repository already covers its terraform and backend risk that way without forking review. The Extension Floors in `SKILL.md` say what no extension may weaken. Reopen trigger: a repository edits its own copy of sk-code-review's checklists, its severity table or the section 9.2 never-skip taxonomy. Pattern to copy if it reopens: sk-git's repo-root `.sk-git/` folder plus a git config key, managed by a doctor command (here `/doctor:sk-code`), with the environment over the file and the floors over both. Ranks 1, 3 and 5 close as decided. The Extension Floors item was applied in phase 3.

## 8. Deferred Items

- **`validate.sh --recursive --strict` was not re-run.** It reports generated-metadata and graph checks, and this synthesis could not confirm it writes nothing outside `review/`. `git status` already shows `description.json` and `graph-metadata.json` modified in sibling packets. The AC-010 `RESULT: PASSED` claim stays as recorded, not re-verified. Owner: the W3 worker, as plan seed step 6.
- **The research's untested sub-claims stay untested:** the stage-two runtime match for quality rank 12, the user-surface leg of quality rank 8, the `origin` fallback for review rank 4, and the live quality-then-review scenario for review rank 6.
- **Verifier exemption:** `verify_alignment_drift.py --check-exact-headers` flags `*.test.sh` files although its help says tests are skipped. This is a verifier issue for whoever owns `sk-code-skilled/assets/scripts/`.

## Dimension Expansion Map

| Field | Value |
|-------|-------|
| Saturated directions | packet closure-document consistency (both lineages converged on it, 13 of 19 findings) |
| Completed pivots | 5 synthesis pivots to the operator focus areas a to e |
| Failed pivots | 0 |
| Audited overrides | 0 |
| Council artifact references | none |
| Selected review directions | lineage re-verification, research versus skills, sk-code-skilled code alignment, sk-doc docs alignment, commands and mirrors, the two open decisions |
| Remaining frontier | a full row-by-row read of both `plan.md` files, the 30 research iteration narratives, and a live run of any playbook scenario |

This section records breadth only. It does not change the verdict, the registry or the self-check results.

## 9. Search Ledger

| Field | Value |
|-------|-------|
| `searchCoverage.requiredBugClasses` | closure-gate substitution, criterion staleness, citation drift, premise overstatement, doc-contract nonconformance, code-header nonconformance, routing integration, command contract |
| `covered` | all eight |
| `ruledOut` | broken markdown links in both modes and the hub (0 of all links); stale leaf manifest (OK); router-sync drift (5/5); doc-claims drift (4/4); command reference breakage (73 assets OK); runtime-mirror absence (6 runtimes present); skill-package contract (strict PASS on three packages); script regressions (5 suites exit 0); mode edits since baseline (empty log) |
| `deferred` | `validate.sh` re-run; the research's own untested sub-claims |
| `blocked` | none |
| `graphCoverageMode` | `graphless_fallback` |
| `candidateCoverage` | 8 of 8 classes |
| `searchDebt` | empty |
| `cleanSearchProof` | each ruled-out class names the command or read that would have shown the defect, run during this synthesis with its exit status read |

## Audit Appendix

**Convergence summary.** DeepSeek: 5 iterations, newFindingsRatio 1.0, 0.667, 0.55, 0.09, 0.154, final convergence 0.846. Luna: 5 iterations, one finding each, final convergence 0.923. Both stopped on `maxIterationsReached`.

**Adversarial self-check (P0 and P1).**
- S-P1-01. Hunter: re-read all three goal files; every box is unchecked, and the counts and the boundary are false at HEAD. Skeptic: the volatile log records the deviation, so is this P2? Referee: P1. The goal file says only its criteria decide done, and the 001 log claims an amendment that was never made.
- S-P1-02. Hunter: re-ran the literal and the scoped commands (131 files, then empty). Skeptic: the operator directed the scope. Referee: P1. The file's own contract requires an ADR for a non-literal close, and none exists.
- Luna R2-P1-001. Downgraded to P2 (S-P2-01): D1 and NFR-S01 authorize the edits.
- DeepSeek R2-P1-001. Downgraded to P2 (S-P2-08): the recommendations stand on the narrower, true claim.
- DeepSeek R3-P1-002. Refuted, see below.

**Refuted lineage findings (4).**
- DeepSeek R3-P1-002, "AC-011 closed against a weaker command than its ADR": ADR-001's Implementation section records the operator's amendment and the exact `grep -vE` skip (`001-.../decision-record.md:128`, `002-.../decision-record.md:128`). The lineage read only the Decision section (line 69).
- DeepSeek R4-P2-001, "sandboxing disabled while the control had failed": the devin flags come from the workflow's own `if_cli_devin` branch, which builds them from `sandboxMode: 'workspace-write'` through `buildLineageCommand` and wraps the dispatch in `enforceWriteContainment` (`deep-research-auto.yaml:1365-1400`). The guard defect concerned sibling quarantine copies, which ADR-002 avoided by running the children one after the other. No fix lies in this packet.
- DeepSeek R4-P2-002, "the containment artifact was deleted": the operator approved the deletion, ADR-001 context records the count and nature of the files (47 quarantine copies of the sibling run's files), and the originals remain in the sibling's `research/`. NFR-S01 concerns the run's own writes, which the iteration logs record.
- DeepSeek R5-P2-002, "the parent change list does not describe the change": `spec.md` Files to Change lists the deliverables. D1 allows the bounded lifecycle-document edits, and both child summaries list them (`002-.../implementation-summary.md:66-73`).

**Duplicates (4).** Luna R3-P2-001 into S-P2-02; Luna R4-P2-001 into S-P2-04; DeepSeek R5-P2-001 and Luna R5-P2-001 into S-P1-01.

**Sources reviewed.** Both lineage iteration sets (10 files), both lineage reports and registries, the merged registry and fan-out attribution; the parent `spec.md` and `goal.md`; in each child `spec.md`, `goal.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md` and `research/research.md`; `.skilled/skills/sk-code/` `SKILL.md`, `README.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `leaf-manifest.json`, the feature catalog, the playbooks, and both modes' `SKILL.md`, `README.md`, scripts and playbooks; `sk-code-skilled/SKILL.md` and its shell, python and javascript checklists; the sk-doc `sk-create-manual-testing-playbook` template and the `sk-create-command` contract; `.skilled/commands/doctor/sk-code.md`; and `deep-research-auto.yaml` and `deep-review-auto.yaml`.

**Commands run, all read-only against tracked files.** `git diff --stat` and `git log` against the baseline; `compiled-route.cjs` (6 replays); `validate_skill_package.py --strict` (3 packages); `validate_document.py` (12 docs, plus typed catalog, playbook and command runs); `validate-playbook-package.cjs` (3 packages); `validate_catalog_package.py --package sk-code`; `check_readme_references.py`; `verify_alignment_drift.py` (default and `--check-exact-headers`); `verify-doc-claims.cjs`; `verify-router-sync.cjs`; `generate-leaf-manifest.cjs --check`; `ci-leaf-manifest-freshness.cjs` (14 fresh); `validate-command-references.cjs`; and the five script test suites. After the runs, `git status --short .skilled` showed only the two untracked files present at session start.

**Cross-reference appendix: Core Protocols.** `spec_code` partial, `checklist_evidence` fail. See section 7.

**Cross-reference appendix: Overlay Protocols.** `skill_agent` pass, `agent_cross_runtime` pass, `feature_catalog_code` pass, `playbook_capability` partial. See section 7.

Review verdict: CONDITIONAL
