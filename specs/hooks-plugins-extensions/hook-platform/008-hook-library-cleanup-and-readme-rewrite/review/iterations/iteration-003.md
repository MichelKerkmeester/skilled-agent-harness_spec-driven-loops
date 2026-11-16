# Review Iteration 003

## Dispatcher

- Route: mode=review, target_agent=deep-review, single iteration, externalized state.
- Target: `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite`.
- Iteration: 3 of 5, generation 2, dimension `traceability`.
- Budget used: 22 tool calls of 24; no sub-agents; review target read-only.

## Dimension

Traceability. This iteration runs the two unfinished core protocols, `spec_code` and `checklist_evidence`, across all seven phases and compares every live completion record (parent `spec.md`, parent `goal.md`, child specs, tasks and summaries) with the state on disk. It also checks the phase 7 claim that it fixed the generation 1 findings archived under `review-archive/2026-11-16T11-20-15Z/review-report.md`.

## Files Reviewed

- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md:52,59,91,127`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/goal.md:66,91,108,109,111`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/spec.md:25,32,99,133,151`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/tasks.md:62,70,71,72`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/implementation-summary.md:50,61,70,81,92,101`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/spec.md:184`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite/implementation-summary.md:59`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/005-closeout-follow-up-fixes/spec.md:97`
- `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/006-codex-check-and-advisory-fixes/implementation-summary.md:65`
- `.skilled/hooks/README.md:45,261`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Parent spec reports Complete while phase 7 is Draft and its review rerun is unfinished** -- `spec.md:52` -- The parent metadata sets `Status | Complete` and `spec.md:59` asserts "All seven children are Complete", but the same file's phase map says phase 7 is `In Progress` (`spec.md:127`). The child agrees with the map, not the metadata: `007-review-doc-reconciliation/spec.md:25` is `Status | Draft`, `007-review-doc-reconciliation/tasks.md:62` leaves T011 (the deep review rerun) unticked, and `007-review-doc-reconciliation/implementation-summary.md:50` is still a template placeholder. All six other children are Complete, so phase 7 is the sole and live counterexample. `goal.md:111` separately records "packet closed" and "all four phases Complete", which compounds the false completion signal.
   - Finding class: cross-consumer
   - Scope proof: `rg -n '^\| \*\*Status\*\*' 00*/spec.md` returns six Complete rows and one Draft row (`007`); the parent phase map at `spec.md:127` independently labels row 7 In Progress; only phase 7 has unticked verification boxes.
   - Affected surface hints: ["parent spec metadata row", "parent phase map row 7", "parent handoff criteria", "phase 7 tasks T011", "phase 7 implementation summary", "goal progress log"]
   - Case: an operator or resume flow reads `Status | Complete` and the handoff criteria, closes or merges the packet, and never runs phase 7's deep review rerun; the goal's final criterion, recursive strict validation for all seven children, is then never proven.

```json
{"type":"claim","claim":"The parent packet's completion record says Complete while phase 7 is Draft and its required review rerun is unfinished.","evidenceRefs":["specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md:52","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md:59","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md:127","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/spec.md:25","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/tasks.md:62","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/implementation-summary.md:50"],"counterevidenceSought":"Checked whether Complete could mean only that the parent spec document is authored, and whether phase 7 was deliberately left open because this review iteration is its T011. The same metadata row's Handoff Criteria names all seven children as the completion condition, and the phase map still says In Progress, so neither reading resolves the contradiction.","alternativeExplanation":"The Status row was set when the packet had four phases and was not reverted when phases 5-7 were added; the phase 7 rerun is this generation's review.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"If the Status field is documented as spec-authored rather than packet completion, or phase 7 becomes Complete with recorded evidence and T011 is closed, this is P2 record drift."}
```

### P2 Findings

2. **Phase 7's implementation summary is still an unfilled template** -- `007-review-doc-reconciliation/implementation-summary.md:50` -- The summary contains six `[YOUR_VALUE_HERE: ...]` placeholders at lines 50, 61, 70, 81, 92 and 101: no opening account, no files-changed rows, no decisions and no verification rows. The phase's own handoff criteria (`007-review-doc-reconciliation/spec.md:32`) require every requirement's command output to be recorded there, and `007-review-doc-reconciliation/tasks.md` marks T001 to T010 done. No phase 7 requirement (REQ-001 to REQ-005) has its output recorded in the required artifact, so the checklist points at evidence that does not exist.
   - Finding class: matrix/evidence
   - Scope proof: `rg -n 'YOUR_VALUE_HERE' 007-review-doc-reconciliation/implementation-summary.md` returns the six placeholder lines; the six other phase summaries contain none.
   - Affected surface hints: ["phase 7 implementation summary", "phase 7 handoff criteria", "phase 7 tasks T001-T010"]
   - Case: a reviewer follows the phase 7 checklist to its `implementation-summary.md` for the REQ evidence and finds template text, so `checklist_evidence` cannot be passed for the phase.

3. **goal.md still records four child phases and omits phases 5-7 from the binding table** -- `goal.md:109` -- The BINDING table lists only 001 to 004 (`goal.md:66-71`). The Progress table says "four binding rows matched to four folders on disk" (`:108`), "Four child phases | Pending" (`:109`) and "all four phases Complete" (`:111`). The same file's completion criterion was updated to "the parent and all seven children" (`:91`), and decisions D2 and D5 name phases 5 and 6, so the file contradicts itself. Phase 7's own in-scope requirement is to correct `goal.md` to name seven children (`007-review-doc-reconciliation/spec.md:99`), and its T003 checked only the one criterion line (`007-review-doc-reconciliation/tasks.md:46`).
   - Finding class: doc_code_drift
   - Scope proof: four binding rows at `goal.md:66-71`; three stale count claims at `:108-111`; only one "seven children" occurrence at `:91`; D2/D5 amendments at `:49` and `:52`.
   - Affected surface hints: ["goal BINDING table", "goal progress log", "phase 7 T003 verification", "resume phase discovery"]
   - Case: a resume or evaluator reads the BINDING table, never looks for phases 5-7, and treats the phase 5 and 6 code changes as outside the directive; the goal's progress log still says the packet closed with four phases.

4. **Parent spec still lists the Pi fallbacks and Vitest alias as out of scope after phases 5 and 6 fixed them** -- `spec.md:91` -- The Out of Scope list places "The dead legacy import fallbacks in four Pi adapters and the Vitest alias that exists only for them" outside the packet and says they were reported at close. Goal decision D5 was amended so phases 5 and 6 fix exactly those two things (`goal.md:52`), and the phases record doing so (`005-closeout-follow-up-fixes/spec.md:97`, `006-codex-check-and-advisory-fixes/implementation-summary.md:65`). No live `hook-flags.ts` reference remains under `.skilled/hooks/`. Only the second D5 half, the OpenCode plugin prefixes, is still correctly out of scope.
   - Finding class: doc_code_drift
   - Scope proof: `spec.md:91` is the only surviving out-of-scope claim that D5 amended; `006/implementation-summary.md:65` records the alias removal and the phase 5 spec line 97 records the fallback removal; `rg -n "hook-flags\\.ts" .skilled/hooks -g '*.ts' -g '*.mjs' -g '*.cjs'` returns no live hits.
   - Affected surface hints: ["parent spec out-of-scope list", "goal decision D5", "phase 5 and 6 scope records"]
   - Case: an auditor compares executed changes with the parent scope list, concludes phases 5 and 6 exceeded the frozen scope, and reverts or re-reports work the operator already approved through D5.

## Traceability Checks

### Core protocols

- **`spec_code` -- partial.** Phases 1 to 6 match observable state and their cited evidence: the six doomed paths are missing, `git ls-files .skilled/hooks/shared/hook-flags.ts` prints nothing, `codex-global-hooks-check/` exists, phase 4's summary and SC-001 are corrected, and the hooks README now holds the kill-switch heading and the `history/` tree line. Phase 7 is the exception: REQ-001's "no completion record contradicts its evidence" is not met because `goal.md:108-111` and `spec.md:52` still claim a four-phase or Complete packet, and SC-002 (a review rerun with no failed coverage gate) is this in-progress generation. Evidence: `spec.md:52,59,127`, `goal.md:108-111`, `007-review-doc-reconciliation/spec.md:25,32`, `007-review-doc-reconciliation/tasks.md:62`.
- **`checklist_evidence` -- partial.** Every implementation task in phases 1 to 6 is ticked; phase 1's single unticked box is the documented CHK-042 deferral at `001-dead-hook-file-removal/tasks.md:165`, and phase 4's two previously unticked boxes are now ticked. Phase 7 has four unticked boxes (`007-review-doc-reconciliation/tasks.md:62,70,71,72`) and no recorded verification in its summary, so the checklist gate cannot pass for the packet.
- **Overlay protocols** were not run this iteration. The focus bound the pass to the two unfinished core protocols; iteration 4 owns the overlay pass.

### Gate outcomes

- Evidence gate: pass. Every new P1 has file:line evidence and a counterevidence review; the P2 rows cite exact lines.
- Scope gate: pass. Every finding is in the declared spec-folder target and touches only completion records.
- Coverage gate: partial. Two of four core/overlay protocol families were exercised; the core pair is now adjudicated `partial` rather than `pending`.

## Integration Evidence

Command output read directly this iteration:

- Six removed paths: `.skilled/hooks/git`, `codex-watchdog`, `hook-install`, `dispatch`, `task-dispatch` and `completion` all report MISSING; `git ls-files .skilled/hooks/shared/hook-flags.ts` prints nothing.
- `.skilled/hooks/codex-global-hooks-check` exists.
- `sync-hook-registrations.cjs --check`: `[hook-registration-sync] PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` (exit 0).
- `sync-runtime-mirrors.cjs --check`: `[runtime-mirror-sync] PASS: 257 mirrors across 10 trees are in sync.` (exit 0).
- `validate_document.py .skilled/hooks/README.md`: `VALID`, 0 issues.
- `hvr_scan.py .skilled/hooks/README.md`: `hard blockers: 0`.
- `.skilled/hooks/README.md:45` defines `### Kill-switch index` directly above the switch table at line 49, so `README.md#kill-switch-index` resolves.
- `.skilled/hooks/README.md:261` adds the `history/` tree line; the two stale Pi specifier claims are gone (`rg` returns no match).

The recursive strict validation is recorded as ticked at `007-review-doc-reconciliation/tasks.md:61`; this read-only iteration did not rerun it, and no pass is claimed from that tick alone.

## Edge Cases

- **"Complete" may mean spec authored, not packet closed.** Adjudicated against the same metadata row's Handoff Criteria and the phase map. The mismatch survives; the downgrade trigger records what would resolve it.
- **Phase 7 is the phase that reruns this review.** Its open state is expected while T011 runs. That does not excuse the parent's `Status | Complete`; the finding targets the record, not the in-progress work.
- **Phase 7 carries no `goal.md` or `acceptance-criteria.md`.** It is a Level 1 operator-added phase and its `spec.md` owns its requirements; this packet shape was recorded as a deviation in `goal.md:119`, so it is not counted as a missing artifact.
- **Phase 1's CHK-042 box is unticked on purpose.** `001-dead-hook-file-removal/tasks.md:165` records the line-count deviation and why every changed line still names a removed file.
- **Parent `_memory.continuity` reports 0% and a creation action.** Phase 7 out-scoped this as writer-owned (`007-review-doc-reconciliation/spec.md:107`); it is noted, not raised.
- **Generation 1's four-phase prose inside the archived report is historical.** Decision D3 keeps historical documents as written; only the live `goal.md` and `spec.md` were counted.

## Confirmed-Clean Surfaces

- Phase 4's completion record now matches its evidence: `004-hook-readme-fold-and-rewrite/implementation-summary.md:59` records the operator sign-off and the 105 count after the later merge, SC-001 at `004-hook-readme-fold-and-rewrite/spec.md:184` states the 104/105 basis, and `004-hook-readme-fold-and-rewrite/tasks.md` has no unticked box.
- The two README navigation fixes are present: `### Kill-switch index` at `.skilled/hooks/README.md:45` and the `history/` tree line at `:261`.
- The two stale Pi specifier claims were removed from the hooks README, and no live adapter imports `hook-flags.ts`.
- Registration and mirror parity are clean: both sync checks PASS over 35 hooks, 22 Pi extensions and 257 mirrors.
- The six dead paths are gone and the merged Codex check folder exists.

## Ruled Out

- **Phase 7's text fixes were never applied.** Ruled out: each of the six fixes has a live line (parent `spec.md:3,59`, phase 4 summary `:59`, phase 4 tasks with 0 unticked boxes, phase 4 SC-001 `:184`, hooks README `:45,261`).
- **The renames left registration or mirror drift.** Ruled out: both sync checks PASS and the six old paths are absent.
- **The hooks README regressed in structure or voice.** Ruled out: `validate_document.py` prints VALID with 0 issues and `hvr_scan.py` reports 0 hard blockers.
- **Phase 1's one unticked box is an unrecorded checklist gap.** Ruled out: `001-dead-hook-file-removal/tasks.md:165` records CHK-042 as met in substance and deferred on its line-count wording.

## Next Focus

Iteration 4, maintainability: audit naming and comment hygiene across the renamed hook tree and the 349 changed live files, then run the overlay protocols `agent_cross_runtime` and `feature_catalog_code` where they apply. Carry forward the open P1 (parent completion state versus a Draft phase 7) and recheck it if phase 7 closes before the final stabilization pass.

Review verdict: CONDITIONAL
