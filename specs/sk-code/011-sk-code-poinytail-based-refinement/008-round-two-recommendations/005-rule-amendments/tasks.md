---
title: "Tasks: Phase 5: rule-amendments"
description: "Task list for six round-two amendments to two repo rule files. It covers before captures, one task per edit, one verification task per requirement and the folder closeout."
trigger_phrases:
  - "rule amendments tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: rule-amendments

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

Run every command from the repository root. `FOLDER` stands for `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/005-rule-amendments`. `PREVENT` stands for `.skilled/repo-rules/prevent-overengineering.md`, and `EVIDENCE` stands for `.skilled/repo-rules/evidence-and-proof.md`. Line numbers are the pre-edit numbers read on 2026-10-10. Phase 2 finds each edit by its quoted text, and before each edit the quoted text must sit on the stated line. A mismatch stops the task (Law 4), because the expected line numbers in Phase 3 depend on the pre-edit numbers.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the before copies of both rule files for diffs and rollback: `mkdir -p FOLDER/scratch/before && cp PREVENT EVIDENCE FOLDER/scratch/before/`. Expected: exit 0, with both files present in `FOLDER/scratch/before/`. (`FOLDER/scratch/before/`) Evidence: `mkdir -p scratch/before && cp <both rule files> scratch/before/; echo exit=$?` -> `exit=0`; `wc -l scratch/before/*.md` -> 164 and 236 lines
- [x] T002 Save the scope baseline for the touched and guarded paths: `git status --porcelain -- PREVENT EVIDENCE AGENTS.md "REPO RULES.md" .skilled/skills/system-spec-kit/runtime/data/trigger-index.json > FOLDER/scratch/status-before.txt; echo "exit=$?"; wc -l < FOLDER/scratch/status-before.txt`. Expected: `exit=0` and `0`. If a line appears, another session has changed a guarded file, so stop and report it. (`FOLDER/scratch/status-before.txt`) Evidence: `git status --porcelain -- <guarded paths> > scratch/status-before.txt; echo exit=$?; wc -l <` -> `exit=0` and `0`
- [x] T003 [P] Capture the checker baseline: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs > FOLDER/scratch/check-before.txt 2>&1; echo "exit=$?"; tail -1 FOLDER/scratch/check-before.txt`. Expected: `exit=0`, the line `[repo-rules-check] RESULT: PASSED (11/11 checks)`, and check 4 reading `max=236`. (`FOLDER/scratch/check-before.txt`) Evidence: `check-repo-rules.cjs > scratch/check-before.txt; echo exit=$?` -> `exit=0`, `[repo-rules-check] RESULT: PASSED (11/11 checks)`, `max=236`
- [x] T004 [P] Capture the size baseline: `wc -l -c PREVENT EVIDENCE`. Expected: 164 and 236 lines. Record the byte counts in `implementation-summary.md`. (`.skilled/repo-rules/`) Evidence: `wc -l -c` on both rule files -> `164 7095 .skilled/repo-rules/prevent-overengineering.md`, `236 10796 .skilled/repo-rules/evidence-and-proof.md`
- [x] T005 [P] Confirm the pre-edit anchors: `rg -n -e 'past the move you can justify\.' -e '^2\. \*\*What does it touch' -e '^`blast-radius\.md` pass' -e '^  speculative\.$' -e 'Named the move and wrote' -e 'Where the change touches a caller' -e 'Every performance claim carries' -e '^version: ' PREVENT`, then `rg -n -e 'Four things, briefly' -e '^4\. \*\*The state of the work' -e 'The close-out says what failed' -e '^version: ' EVIDENCE`. Expected: PREVENT lines 28, 84, 94, 140, 151, 157, 162 and 164; EVIDENCE lines 29, 187, 192 and 229. (`.skilled/repo-rules/prevent-overengineering.md`) Evidence: `rg -n` on the pre-edit anchors -> PREVENT lines 28, 84, 94, 140, 151, 157, 162, 164 and EVIDENCE lines 29, 187, 192, 229, exit 0
- [x] T006 [P] Confirm the cited source lines: `rg -n -e 'shortest working diff wins' -e 'Code you move or merge keeps' -e 'correct on edge cases' specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md`, then `rg -n 'callers, tests, fixtures, config and exports' .skilled/skills/sk-code/shared/references/workflow-implement.md`, then `rg -n -e 'Restraint never cuts a P0 item' -e '\*\*Accessibility\*\*' .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`. Expected: Ponytail lines 36, 39 and 40; workflow line 51; standards lines 54 and 85. (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`) Evidence: `rg -n` on the cited sources -> `36:- The shortest working diff wins`, `51:2. List every place`, `85:8. **Accessibility**`
- [x] T007 [P] Record the close-out count dependents before the change: `rg -n -i 'four things' .skilled/repo-rules .skilled/skills/sk-doc "REPO RULES.md" AGENTS.md`, then `rg -n 'what only the operator can verify' AGENTS.md`. Expected: two hits for "four things", at `.skilled/repo-rules/evidence-and-proof.md:187` (the target) and `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:8` (unrelated), and one hit at `AGENTS.md:296`. (`AGENTS.md`) Evidence: `rg -n -i 'four things'` -> `evidence-and-proof.md:187` and `validate_catalog_package.py:8`; `rg -n 'what only the operator can verify' AGENTS.md` -> `296:`
- [x] T008 [P] Confirm the trigger index does not carry the rule files: `rg -c -F '.skilled/repo-rules/' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json; echo "exit=$?"`, then `rg -n 'CORPUS_ROOTS = ' .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`. Expected: the first command prints nothing and `exit=1`. The second prints line 31 with the four roots `specs`, `.skilled/skills`, `.skilled/hooks` and `.skilled/changelog/skilled`. (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`) Evidence: `rg -c -F '.skilled/repo-rules/' trigger-index.json; echo exit=$?` -> nothing, `exit=1`; `rg -n 'CORPUS_ROOTS = '` -> `31:export const CORPUS_ROOTS`
- [x] T009 [P] Record the informational validator result: `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py PREVENT; echo "exit=$?"`. Expected: `INVALID` and `exit=1`, because README rules apply to a repo rule. This is not a gate, so do not edit the file to satisfy it. (`.skilled/repo-rules/prevent-overengineering.md`) Evidence: `python3 -I validate_document.py PREVENT; echo exit=$?` -> `INVALID: .skilled/repo-rules/prevent-overengineering.md`, `exit=1`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Read the authoring contract before the first edit. Read `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` §3 (the Revise path), `references/rule-anatomy.md` §1, §5 and §7, `references/agents-md-integration.md` §4 (the version rule) and `references/decision-tests.md`, and read `.skilled/repo-rules/communication-prose.md` §3 (the house prose rule). Expected: the Revise path reads as run the decision tests, edit, bump the version, then re-verify links and counts. (`.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md`) Evidence: `sed -n '173,186p' SKILL.md` -> `Run the decision tests again first ... Then edit ... Bump version`; version rule read in agents-md-integration.md section 4
- [x] T011 Run the decision tests on the six amendments, the Revise path in `SKILL.md` §3. For each amendment, answer `decision-tests.md` §1 to §4. Each is a section, item, bullet or self-check line inside a rule that already owns the subject (test 3, part 2, so no new file). None is routing (test 2). Each names a failure that happens today, the six round-two gaps (test 4). Record the six verdicts under Key Decisions in `implementation-summary.md`. Expected: six verdicts, none refused. (`FOLDER/implementation-summary.md`) Evidence: Six verdicts recorded under Key Decisions in implementation-summary.md; `rg -n '^\| [1-6]\. '` -> lines 103 to 108
- [x] T012 Amendment 1, the decode floor and tiebreak, in section 1 of PREVENT. Find the line `past the move you can justify.` (line 84). Insert the paragraph below and one blank line directly after the blank line that follows line 84, so the `---` divider still follows a blank line. Expected: the paragraph sits at line 86 and the divider at line 88. Evidence: `rg -n 'A short diff is not a cheaper move'` -> `86:**A short diff is not a cheaper move when the next reader has to decode it.**`
  ```markdown
  **A short diff is not a cheaper move when the next reader has to decode it.** A one-liner that packs two decisions into one expression moves the cost to every later reader, who must rebuild the intent before they can check it. When two moves cost the same, the one that handles the edge cases correctly wins.
  ```
  (`.skilled/repo-rules/prevent-overengineering.md`)
- [x] T013 Amendment 2, the reach list, in item 2 of section 2 of PREVENT. Find the four lines that start at line 94 with `2. **What does it touch?**` and end at line 97 with `should not exist either.`. Replace all four lines with the block below. Expected: `list the tests, fixtures, config and exports` at line 98. Evidence: `rg -n 'list the tests, fixtures, config and exports'` -> `98:   break. Then list the tests, fixtures, config and exports the change must reach.`
  ```markdown
  2. **What does it touch?** If the change can break a caller or a shared contract, name
     the owning module, one real caller (`file:line`) and the contract that must not
     break. Then list the tests, fixtures, config and exports the change must reach. No
     real caller means the change is smaller than you think, or the code should not exist
     either.
  ```
  (`.skilled/repo-rules/prevent-overengineering.md`)
- [x] T014 Amendment 3, the bold-led "Moves and merges." paragraph, at the end of section 4 of PREVENT. Find the line `` `blast-radius.md` pass, because installing mutates the environment. `` (line 140 before the edits, line 143 after T012 and T013). After the blank line that follows it, insert the paragraph below and one blank line, so the `---` divider before `## 5. WHAT THIS RULE IS NOT` still follows a blank line. Expected: `Moves and merges.` at line 145. Evidence: `rg -n 'Moves and merges\.'` -> `145:**Moves and merges.** Moved or merged code keeps its error handling and validation.`
  ```markdown
  **Moves and merges.** Moved or merged code keeps its error handling and validation. Dropping a check during a move is a behavior change that needs its own reason.
  ```
  (`.skilled/repo-rules/prevent-overengineering.md`)
- [x] T015 Amendment 4, the accessibility bullet, in section 5 of PREVENT. Find the line `  speculative.` (line 151 before the edits), the last line of the bullet `Not a reason to skip real error handling.`. Insert one blank line and the bullet below directly after it. The blank line before the `---` divider already exists and stays. Expected: the bullet sits at line 158. Evidence: `rg -n 'Not a reason to cut accessibility\.'` -> `158:- **Not a reason to cut accessibility.** Restraint never cuts accessibility on user-facing UI`
  ```markdown
  - **Not a reason to cut accessibility.** Restraint never cuts accessibility on user-facing UI: interactive elements stay keyboard-operable, carry an accessible name and keep a visible focus state.
  ```
  (`.skilled/repo-rules/prevent-overengineering.md`)
- [x] T016 Self-check line for amendment 1, in section 6 of PREVENT. Find the line `- [ ] Named the move and wrote the climbing sentence for every move past "build nothing".` (line 157 before the edits). Insert the line below directly after it. Expected: the new line sits at line 165. Evidence: `rg -n 'When two moves cost the same, I took'` -> `165:- [ ] When two moves cost the same, I took the one that handles the edge cases correctly.`
  ```markdown
  - [ ] When two moves cost the same, I took the one that handles the edge cases correctly. A shorter diff that the next reader must decode did not count as cheaper.
  ```
  (`.skilled/repo-rules/prevent-overengineering.md`)
- [x] T017 Self-check line change for amendment 2, in section 6 of PREVENT. Find the line `- [ ] Where the change touches a caller or a shared contract, I named the owner, one real caller and the contract before editing.` (line 162 before the edits). Replace the whole line with the single line below. This amends the existing obligation, so the checklist keeps one line per obligation (`rule-anatomy.md` §7). Expected: `I listed the tests, fixtures, config and exports` at line 170. Evidence: `rg -n 'I listed the tests, fixtures, config and exports'` -> `170:- [ ] Where the change touches a caller or a shared contract`
  ```markdown
  - [ ] Where the change touches a caller or a shared contract, I named the owner, one real caller and the contract before editing. I listed the tests, fixtures, config and exports it must reach.
  ```
  (`.skilled/repo-rules/prevent-overengineering.md`)
- [x] T018 Self-check lines for amendments 3 and 4, at the end of section 6 of PREVENT. Find the last line `- [ ] Every performance claim carries a measurement, and every new dependency names what the project's own tools could not do.` (line 164 before the edits). Insert the two lines below directly after it. Expected: the lines sit at 173 and 174. Evidence: `rg -n 'Moved or merged code kept'` and `rg -n 'Restraint did not cut accessibility'` -> `173:` and `174:`
  ```markdown
  - [ ] Moved or merged code kept its error handling and validation. Every check dropped during a move has its own stated reason.
  - [ ] Restraint did not cut accessibility on user-facing UI, where interactive elements stay keyboard-operable, carry an accessible name and keep a visible focus state.
  ```
  (`.skilled/repo-rules/prevent-overengineering.md`)
- [x] T019 Bump the version of PREVENT. Find `version: 1.0.1.2` (line 28, in the frontmatter) and replace it with `version: 1.0.1.3`. Only the fourth segment changes, for a content change (`agents-md-integration.md` §4). (`.skilled/repo-rules/prevent-overengineering.md`) Evidence: `rg -n '^version: '` -> `28:version: 1.0.1.3` in prevent-overengineering.md
- [x] T020 Amendment 5, the count word, in section 10 of EVIDENCE. Find the line `Every substantive turn ends with an honest status. Four things, briefly:` (line 187). Replace it with `Every substantive turn ends with an honest status. Five things, briefly:`. Expected: the line reads "Five things, briefly:" at line 187. (`.skilled/repo-rules/evidence-and-proof.md`) Evidence: `rg -n 'Five things, briefly'` -> `187:Every substantive turn ends with an honest status. Five things, briefly:`
- [x] T021 Amendment 5, the fifth item, in section 10 of EVIDENCE. Find the item `4. **The state of the work:** edited / committed / pushed / dirty, and which branch.` (line 192). Insert the item below directly after it, with no blank line, because the items form one list. Expected: the new item sits at line 193, and the "And plainly" paragraph still follows after a blank line. Evidence: `rg -n 'Known residual risk\.'` -> `193:5. **Known residual risk.** Any risk the operator must weigh`
  ```markdown
  5. **Known residual risk.** Any risk the operator must weigh before relying on the work, such as an untested path or a state that could not be checked. Write "none known" when there is none.
  ```
  (`.skilled/repo-rules/evidence-and-proof.md`)
- [x] T022 Self-check line for amendment 5, in section 12 of EVIDENCE. Find the line `- [ ] The close-out says what failed and what is inferred, not only what worked.` (line 229 before the edits, line 230 after T021). Insert the line below directly after it. Expected: the new line sits at line 231. Evidence: `rg -n 'names any known residual risk'` -> `231:- [ ] The close-out names any known residual risk the operator must weigh.`
  ```markdown
  - [ ] The close-out names any known residual risk the operator must weigh. It says "none known" when there is none.
  ```
  (`.skilled/repo-rules/evidence-and-proof.md`)
- [x] T023 Bump the version of EVIDENCE. Find `version: 1.1.1.2` (line 29, in the frontmatter) and replace it with `version: 1.1.1.3`. (`.skilled/repo-rules/evidence-and-proof.md`) Evidence: `rg -n '^version: '` -> `29:version: 1.1.1.3` in evidence-and-proof.md
- [x] T024 Record the known differences and the moves-and-merges gap under Known Limitations in `implementation-summary.md`. Write three numbered limitations. Item 1: the "Moves and merges." paragraph has no Fires-when bullet, so it loads only when the rule fires for another reason (open question 1 in `spec.md`). Item 2: `AGENTS.md` section 10 keeps four close-out items while EVIDENCE section 10 lists five. Parent decision D3 leaves `AGENTS.md` unchanged, so the difference stays and is recorded. Item 3: `validate.sh --strict` printed `RESULT: PASSED` on the unfilled scaffold, so that pass does not prove the documents are filled. Expected: three numbered limitations. (`FOLDER/implementation-summary.md`) Evidence: `rg -n '^[0-9]\. \*\*' implementation-summary.md` -> three numbered limitations, lines 137 to 139
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T025 REQ-001 (P0), the decode floor and the tiebreak: `rg -n -e 'A short diff is not a cheaper move' -e 'When two moves cost the same, I took' PREVENT`. Expected: two lines, `86:` and `165:`, the first holding "A short diff is not a cheaper move" and the second "When two moves cost the same, I took". (`.skilled/repo-rules/prevent-overengineering.md`) Evidence: `rg -n 'A short diff is not a cheaper move' 'When two moves cost the same, I took'` -> `86:` and `165:`
- [x] T026 REQ-002 (P0), the reach list: `rg -n -e 'list the tests, fixtures, config and exports' -e 'I listed the tests, fixtures, config and exports' PREVENT`. Expected: two lines, `98:` and `170:`. (`.skilled/repo-rules/prevent-overengineering.md`) Evidence: `rg -n 'list the tests, fixtures, config and exports' 'I listed the tests, fixtures, config and exports'` -> `98:` and `170:`
- [x] T027 REQ-003 (P0), moves and merges: `rg -n -e 'Moves and merges\.' -e 'Moved or merged code kept' PREVENT`. Expected: two lines, `145:` and `173:`. (`.skilled/repo-rules/prevent-overengineering.md`) Evidence: `rg -n 'Moves and merges\.' 'Moved or merged code kept'` -> `145:` and `173:`
- [x] T028 REQ-004 (P0), the accessibility bullet: `rg -n -e 'Not a reason to cut accessibility\.' -e 'Restraint did not cut accessibility' PREVENT`. Expected: two lines, `158:` and `174:`. Then `rg -c 'keyboard-operable, carry an accessible name and keep a visible focus state' PREVENT .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`. Expected: 2 for PREVENT (lines 158 and 174) and 1 for the standard (line 85), so the bullet reuses the standard's wording. (`.skilled/repo-rules/prevent-overengineering.md`) Evidence: `rg -n` for the two accessibility phrases -> `158:` and `174:`; `rg -c 'keyboard-operable, carry an accessible name and keep a visible focus state'` -> 2 for PREVENT and 1 for the standard
- [x] T029 REQ-005 (P0), the fifth close-out item: `rg -n -e 'Five things, briefly' -e 'Known residual risk\.' -e 'names any known residual risk' -e 'Four things' EVIDENCE`. Expected: exactly three lines, `187:`, `193:` and `231:`, and no line for "Four things". (`.skilled/repo-rules/evidence-and-proof.md`) Evidence: `rg -n` for the close-out phrases on EVIDENCE -> `187:`, `193:` and `231:`, and no `Four things` line
- [x] T030 REQ-006 (P0), the versions and line counts: `rg -n '^version: ' PREVENT EVIDENCE`, then `wc -l PREVENT EVIDENCE`. Expected: the version lines read `version: 1.0.1.3` (line 28) and `version: 1.1.1.3` (line 29), and the line counts are 174 and 238. (`.skilled/repo-rules/prevent-overengineering.md`) Evidence: `rg -n '^version: '` -> `28:version: 1.0.1.3` and `29:version: 1.1.1.3`; `wc -l` -> `174` and `238`
- [x] T031 REQ-007 (P0), the contract validator: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs > FOLDER/scratch/check-after.txt 2>&1; echo "exit=$?"; tail -1 FOLDER/scratch/check-after.txt; diff FOLDER/scratch/check-before.txt FOLDER/scratch/check-after.txt`. Expected: `exit=0`, the line `RESULT: PASSED (11/11 checks)`, and a diff that changes only check 4, from `max=236` to `max=238`. (`FOLDER/scratch/check-after.txt`) Evidence: `check-repo-rules.cjs > scratch/check-after.txt; echo exit=$?` -> `exit=0`, `RESULT: PASSED (11/11 checks)`; diff against baseline changes only check 4 (`max=236` to `max=238`)
- [x] T032 REQ-008 (P0), the house prose rule: for each file, run `diff FOLDER/scratch/before/prevent-overengineering.md PREVENT | rg '^>' | rg -e "$(printf '\342\200\224')" -e ';' -e ', [^,.;]+, (and|or) '; echo "exit=$?"`, then the same with `FOLDER/scratch/before/evidence-and-proof.md` and `EVIDENCE`. Expected: nothing but `exit=1` for each file. Known instance: `diff FOLDER/scratch/before/prevent-overengineering.md PREVENT | rg '^<' | rg ', [^,.;]+, (and|or) '` prints the removed line `   the owning module, one real caller (`file:line`), and the contract that must not`, which proves the detector is live. (`.skilled/repo-rules/prevent-overengineering.md`, `.skilled/repo-rules/evidence-and-proof.md`) Evidence: `diff` against scratch/before with `rg` for em dash, semicolon and serial comma -> `exit=1` for both files; control matched the removed serial-comma line
- [x] T033 REQ-009 (P0), the scope: `git status --porcelain -- PREVENT EVIDENCE AGENTS.md "REPO RULES.md" .skilled/skills/system-spec-kit/runtime/data/trigger-index.json`. Expected: exactly two lines, ` M .skilled/repo-rules/evidence-and-proof.md` and ` M .skilled/repo-rules/prevent-overengineering.md`. No line appears for `AGENTS.md`, `REPO RULES.md` or the trigger index. (`.skilled/repo-rules/prevent-overengineering.md`, `.skilled/repo-rules/evidence-and-proof.md`) Evidence: `git status --porcelain -- <paths>` -> ` M .skilled/repo-rules/evidence-and-proof.md` and ` M .skilled/repo-rules/prevent-overengineering.md`, no other line
- [x] T034 SC-003, the Fires-when sections are unchanged: `diff <(sed -n '/^## Fires when/,/^## The rule/p' FOLDER/scratch/before/prevent-overengineering.md) <(sed -n '/^## Fires when/,/^## The rule/p' PREVENT)`, then the same comparison for EVIDENCE with `FOLDER/scratch/before/evidence-and-proof.md`. Expected: no output and exit 0 for each. (`.skilled/repo-rules/prevent-overengineering.md`, `.skilled/repo-rules/evidence-and-proof.md`) Evidence: `diff` of the Fires-when sections against scratch/before -> no output, exit 0 for both files
- [x] T035 REQ-010 (P1), the close-out dependents after the change: `rg -n -i 'four things' .skilled/repo-rules .skilled/skills/sk-doc "REPO RULES.md" AGENTS.md`. Expected: only `validate_catalog_package.py:8`. Then `rg -n 'what only the operator can verify' AGENTS.md`. Expected: line 296, unchanged. Do not edit `AGENTS.md`. (`AGENTS.md`) Evidence: `rg -n -i 'four things'` -> only `validate_catalog_package.py:8`; `rg -n 'what only the operator can verify' AGENTS.md` -> `296:` unchanged
- [x] T036 REQ-011 (P1), no index rebuild: `rg -c -F '.skilled/repo-rules/' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json; echo "exit=$?"`. Expected: nothing printed and `exit=1`, the same result as T008. No `generate-trigger-index.mjs` run is needed. (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`) Evidence: `rg -c -F '.skilled/repo-rules/' trigger-index.json; echo exit=$?` -> nothing, `exit=1`; no `generate-trigger-index` run
- [x] T037 Fill `implementation-summary.md`: replace every scaffold line in brackets, such as `[Opening hook`, `[Created/Modified/Deleted]`, `[Validation, lint, tests, manual check]` and `[Limitation]`, with the receipts from T025 to T036, the Files Changed table (the two rule files and the four documents), and the three limitations from T024. Expected: the grep in T038 prints nothing. (`FOLDER/implementation-summary.md`) Evidence: implementation-summary.md rewritten with the build record, verification table and three limitations; placeholder grep (T038) prints nothing
- [x] T038 SC-004 and the placeholder gate: `grep -rn 'YOUR_VALUE''_HERE\|[[]Phase\|T''BD' FOLDER/*.md` (the shell joins the split quotes, so this task does not match itself), then `rg -n -e '\[What is broken' -e '\[Requirement description' -e '\[Deliverable' -e '\[To be defined' -e '\[One sentence' -e '\[2-3 sentences' -e '\[Task' -e '\[A check whose' -e '\[Item\]' -e '\[Opening hook' -e '\[Created/Modified' -e '\[Validation, lint' -e '\[Limitation\]' FOLDER/spec.md FOLDER/plan.md FOLDER/goal.md FOLDER/implementation-summary.md`. This second search skips `tasks.md`, which quotes those strings in this very task. Expected: both print nothing and exit 1. (`FOLDER/*.md`) Evidence: `grep -rn` for the placeholder strings over the folder `*.md` -> nothing, `grep-exit=1`; `rg` over spec, plan, goal, summary -> nothing, `rg-exit=1`; control: tasks.md matches 2
- [x] T039 SC-002, the folder validator: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder FOLDER --apply`, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh FOLDER --strict > FOLDER/scratch/validate-after.txt 2>&1; echo "exit=$?"; rg -n 'RESULT:|Errors:' FOLDER/scratch/validate-after.txt`. Expected: `exit=0`, and the file holds `RESULT: PASSED`. Read the output and the exit status together. (`FOLDER/scratch/validate-after.txt`) Evidence: `validate.sh <folder> --strict > scratch/validate-after.txt; echo exit=$?` -> `exit=0`, `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`
- [x] T040 Check the goal file: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs FOLDER`. Expected: `RESULT: PASSED`. If it fails, fix `goal.md` and rerun until it passes. (`FOLDER/goal.md`) Evidence: `check-goal.cjs <folder>` -> `[check-goal] RESULT: PASSED (5/5 checks)`, exit 0
- [x] T041 Final scope check: `git status --porcelain -- PREVENT EVIDENCE AGENTS.md "REPO RULES.md" .skilled/skills/system-spec-kit/runtime/data/trigger-index.json > FOLDER/scratch/status-after.txt; diff FOLDER/scratch/status-before.txt FOLDER/scratch/status-after.txt; echo "exit=$?"`. Expected: the diff adds exactly the two ` M` lines of the rule files and nothing else, and `exit=1` because the status changed. Expected: no other path in the repository changed for this child. (`FOLDER/scratch/status-after.txt`) Evidence: `git status --porcelain -- <paths> > scratch/status-after.txt; diff ... ; echo exit=$?` -> adds exactly the two ` M` rule-file lines, `exit=1`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
