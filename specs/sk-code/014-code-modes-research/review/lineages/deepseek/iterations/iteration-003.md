# Review Iteration 3 — Traceability (`checklist_evidence`)

## Dimension

Traceability, core protocol `checklist_evidence`: whether the rows of `acceptance-criteria.md` and the completion criteria in `goal.md` are closed by the checks they name, and whether every narrowing of a check is recorded in the place the packet's own contract requires. Each row was read against the command it publishes and, where the command is read-only, executed from the phase folder.

## Files Reviewed

- `specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:53-67`
- `specs/sk-code/014-code-modes-research/002-review-mode-research/decision-record.md:37-135`
- `specs/sk-code/014-code-modes-research/001-quality-mode-research/acceptance-criteria.md:53-67`
- `specs/sk-code/014-code-modes-research/goal.md:96-104,113-116`
- `specs/sk-code/014-code-modes-research/spec.md:147-152`
- Working-tree commands: `git diff --stat f8671e07c2 -- ':/.skilled'`, `git diff --stat f8671e07c2 -- .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/sk-code-review`, and AC-011's published grep.

## Findings

### P0 Findings

None. No security boundary and no destructive path is involved; the defects are in how a closed packet's own gates are recorded.

### P1 Findings

1. **The `.skilled/` boundary gate was narrowed in the acceptance criteria and left unmet in the goal, with no decision record** -- `specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:65` -- The goal's completion criterion 3 reads "`git diff --stat` from the sha logged as Baseline ... to HEAD prints no path under `.skilled/`" (`goal.md:100`) and is unchecked (`- [ ]`). That command prints 131 changed files today, so the criterion is not satisfied. AC-009 is the row that owns it, and instead of the criterion's command it publishes two different commands scoped to the two mode folders, both of which print nothing, and records `Met` with the prose "Met with the operator-directed scope". No ADR names AC-009: the only two decision records in either child are ADR-001 (AC-011 narrowing) and ADR-002 (second-model pass), so the substitution has no recorded authorization while the goal's criterion of the same substance stays unmet and unchecked. The scoped result itself is true and reproducible; what is missing is the record that replaces a whole-tree gate with a two-folder gate.
   Finding class: closure-gate-integrity
   Scope proof: the criterion, the row and both decision records are inside the declared review target; the two diff commands were run read-only against the recorded baseline sha.
   Affected surface hints: `goal.md` completion criteria; `acceptance-criteria.md` AC-009 in both children; the parent handoff criterion "no file under `.skilled/` changed" (`spec.md:66`), which repeats the same unmet clause.
   Case: a later packet re-runs the goal's criterion to check whether the boundary held, sees 131 changed files, and cannot tell from any ADR whether that is expected.
   Claim adjudication:
   ```json
   {"type":"finding","claim":"AC-009 is Met against a command that is not the criterion's command, and no ADR authorizes the substitution while goal.md criterion 3 stays unchecked and false at HEAD","evidenceRefs":["specs/sk-code/014-code-modes-research/goal.md:100","specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:65","specs/sk-code/014-code-modes-research/002-review-mode-research/decision-record.md:37","specs/sk-code/014-code-modes-research/002-review-mode-research/decision-record.md:137","specs/sk-code/014-code-modes-research/spec.md:66"],"counterevidenceSought":"searched both decision records and both implementation summaries for any record naming AC-009 or the two-folder scope; the only scope prose is in the AC row and in a Key Decisions table row with no ADR number","alternativeExplanation":"the operator authorized the scope verbally and the AC row records it, so the narrowing is real but unrecorded","finalSeverity":"P1","confidence":"high","downgradeTrigger":"downgrade to P2 if an ADR recording the two-folder boundary scope is added to either child"}
   ```

2. **AC-011 was closed against a weaker command than its own ADR records** -- `specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:67` -- ADR-001 decides that AC-011's grep runs over the research content "with every count required to be 0" (`decision-record.md:69`). The row that closes the criterion runs that grep and then pipes it through `grep -vE '(was not read|Nothing under .* was read)'`, excluding the lines that would otherwise fail it. Two lines match before the exclusion, both in iteration narratives, and the row's own text says the operator amended the check to skip "a line that only states the sibling folder was not read". That amendment appears only in the row's prose and in the implementation summary's answered questions; ADR-001 still states the stricter rule, so the recorded decision and the executed check disagree on exactly the two matches that separate pass from fail.
   Finding class: gate-command-drift
   Scope proof: ADR-001 text and the AC row read in place; the published command executed from the phase folder, printing 2 matches before the exclusion and 0 after.
   Affected surface hints: `acceptance-criteria.md` AC-011 in both children; ADR-001 in both decision records; the parent phase-handoff verification for 001 → 002, which uses the same sibling-path grep.
   Case: an auditor re-runs ADR-001's stated command, sees 2 non-zero files, and reads the criterion as unmet despite its `Met` status.
   Claim adjudication:
   ```json
   {"type":"finding","claim":"the executed AC-011 command excludes two matching lines that ADR-001's recorded rule would count, and that exclusion is recorded only in prose","evidenceRefs":["specs/sk-code/014-code-modes-research/002-review-mode-research/decision-record.md:69","specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:67"],"counterevidenceSought":"read ADR-001 in full for a skip clause or a second decision record; the ADR records the scope narrowing and requires every count to be 0","alternativeExplanation":"the operator ruled the skip verbally and the row records the ruling, so the check matches an authorized intent that was never written into the ADR","finalSeverity":"P1","confidence":"medium","downgradeTrigger":"downgrade to P2 when ADR-001 (or a new ADR) records the skip clause alongside the scope narrowing"}
   ```

### P2 Findings

1. **Three acceptance rows still assert ten iterations after the count became fifteen** -- `specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:59` -- AC-003's criterion says "Then ten record files exist", AC-004's says "Then there are ten" (`:60`), and AC-005's says `totalIterations` "equal to 10" (`:61`). ADR-002 raised the count to fifteen and every one of the three evidence cells documents the fifteen-file re-run, so each row now states a criterion its own evidence no longer answers. The same pattern sits in `goal.md`'s completion criterion 2, which still reads "10 records of type iteration" (`goal.md:99`).
   Finding class: criterion-staleness
   Scope proof: three rows and one goal criterion inside the declared review target; the count itself verified in iteration 1.
   Affected surface hints: `acceptance-criteria.md` AC-003 to AC-005 in both children; `goal.md` completion criterion 2.
   Case: a validator or reader comparing criterion text with the state log sees 15 records where the criterion asks for 10 and cannot tell whether the extra five are in or out of scope.

### Confirmed clean

- AC-001, AC-002, AC-006, AC-007 and AC-008 name commands whose results are reproducible and whose cited evidence exists: `research/research.md` is present, its Ranked Recommendations section carries 14 and 12 labelled rows, and the named sections and source files are all present.
- AC-010's claim could not be re-run from this lineage, because `validate.sh` writes derived artifacts outside the write surface this review is confined to. It is recorded as not re-verified, not as passed or failed.
- ADR-001 and ADR-002 exist in both children with distinct scope, so the packet's waiver mechanism is present and used, not absent.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Carried from iteration 2: 291/301 citations resolve; one absolute-absence claim contradicted. |
| `checklist_evidence` | core | fail | Two acceptance rows close on commands that differ from the criteria they answer (AC-009, AC-011), and three rows still assert a superseded iteration count. |

## Verdict

Two P1 findings and one P2. Both P1s are about a gate that reports `Met` on a check weaker than the one it publishes, which is the failure mode the acceptance-criteria contract exists to prevent.

Review verdict: CONDITIONAL
