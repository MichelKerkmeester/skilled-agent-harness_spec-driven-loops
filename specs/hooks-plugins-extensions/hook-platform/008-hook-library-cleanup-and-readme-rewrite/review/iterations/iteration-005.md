# Deep Review Iteration 005

## Dispatcher

- Mode: review
- Target agent: deep-review
- Iteration: 5 of 5
- Generation: 2, lineage mode restart
- Dimension: stabilization (all four dimensions covered)
- Target: `specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite`
- Focus: re-verify every active finding, adjudicate `R3-P1-001`, finish `checklist_evidence` for phases 001 to 006, and re-run the read-only objective proofs.

## Files Reviewed

- Parent `spec.md:52,59,91,127`; `goal.md:91,108-111`
- `007-review-doc-reconciliation/spec.md:25`, `tasks.md:52,62`, `implementation-summary.md:50`
- Ticked task rows across `001-006/tasks.md` (165 lines read through the packet scan), plus `007/tasks.md:37-61`
- `.skilled/hooks/cli-dispatch/README.md:115,166-200,257`
- `.skilled/hooks/subagent-dispatch-guard/README.md:92,102-130`
- `.skilled/hooks/subagent-dispatch-guard/pi/README.md:21`
- `.skilled/hooks/decision-capture/README.md:57,74-86`
- `.skilled/hooks/session-lifecycle/README.md:188-209`
- `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs:1106-1135,1230-1248`
- Live tree: the six removed folders, `codex-global-hooks-check/`, the three tree-omitted entries, 105 READMEs, both sync checks and two README validators.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R3-P1-001` is re-adjudicated below and stays active at P1.

### P2 Findings

1. **The subagent-dispatch-guard Pi leaf README repeats the removed fallback and test alias** -- `.skilled/hooks/subagent-dispatch-guard/pi/README.md:21` -- line 21 still says "A longer fallback specifier sits beside that import. It resolves only through the test alias." Phase 5 reduced the six Pi adapters to one import each and removed the alias; the live adapter imports only the extension type and the shared kill-switch resolver. [SOURCE: .skilled/hooks/subagent-dispatch-guard/pi/task-dispatch-guard.ts:7] [SOURCE: specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/005-closeout-follow-up-fixes/implementation-summary.md:120]
   - Case: a reader of the Pi folder README trusts the sentence, keeps a dead Vitest alias in a config, or copies the fallback form into a new Pi adapter, reintroducing the load-path ambiguity phase 5 removed.
   - Finding class: instance-only
   - Scope proof: every hook README was scanned for the removed fallback and alias vocabulary. Besides the already-recorded `subagent-dispatch-guard/README.md:92` and the two `cli-dispatch/README.md` lines, this leaf is the only additional instance; the feature-level scope proof in iteration 4 read only the five feature READMEs.
   - Affected surface hints: ["subagent-dispatch-guard/pi/README.md section 3", "subagent-dispatch-guard/pi/task-dispatch-guard.ts"]
   - Recommendation: replace line 21 with the single `../../shared/hook-flags.mjs` import the adapter now keeps.

## Re-verification of Active Findings

| Finding | Current evidence | Holds | Severity |
|---|---|---|---|
| `R3-P1-001` parent Complete while phase 7 open | Parent `spec.md:52` says Complete and `:59` says all seven children are Complete; the same file's map at `:127` says phase 7 In Progress; phase 7 `spec.md:25` says Draft, `tasks.md:62` leaves T011 unticked, `implementation-summary.md:50` is a template. | Yes | P1 |
| `R1-P2-001` cli-dispatch README keeps the removed fallback and alias | `cli-dispatch/README.md:115` and `:257` still describe the long specifier and the hooks Vitest alias. | Yes | P2 |
| `R1-P2-002` cli-dispatch tree omits Vibe | Tree ends at `opencode/` and `tests/` (`:197-200`); `.skilled/hooks/cli-dispatch/vibe` exists. | Yes | P2 |
| `R2-P2-001` credential-bearing URLs pass the scrubber | `SECRET_PATTERNS` at `dispatch-audit.mjs:1106-1135` has flags, assignments, headers, provider prefixes, PEM and JWT forms, but no URL-userinfo pattern. | Yes | P2 |
| `R2-P2-002` audit log uses default permissions | `appendAuditLog` calls `appendFileSync` at `dispatch-audit.mjs:1243` with no explicit mode or chmod. | Yes | P2 |
| `R3-P2-001` phase 7 summary is a template | `007-review-doc-reconciliation/implementation-summary.md:50` is still `[YOUR_VALUE_HERE: ...]`; the other rows are template rows. | Yes | P2 |
| `R3-P2-002` goal still counts four phases | `goal.md:108-111` says four binding rows, "Four child phases" and "all four phases Complete"; only completion criterion 6 at `:91` says seven. | Yes | P2 |
| `R3-P2-003` parent still lists Pi fallbacks as out of scope | Parent `spec.md:91` still reads "The dead legacy import fallbacks in four Pi adapters and the Vitest alias that exists only for them." | Yes | P2 |
| `R4-P2-001` three feature trees omit live entries | decision-capture tree (`:74-83`) omits `opencode/`; subagent tree (`:105-130`) omits `vibe/`; session-lifecycle `vibe/` line (`:203-206`) omits `session-start.test.mjs`; all three entries exist. | Yes | P2 |
| `R4-P2-002` subagent feature README keeps the fallback | `subagent-dispatch-guard/README.md:92` still says the longer fallback specifier resolves only through the test alias. | Yes | P2, extended by `R5-P2-001` |

## `R3-P1-001` Severity Adjudication

The parent's completion record and its own phase map still disagree: `spec.md:52` and `:59` present the packet as Complete while `spec.md:127` says phase 7 is In Progress, and phase 7's own metadata (`007/spec.md:25`), its unticked T011 (`007/tasks.md:62`) and its empty implementation summary (`007/implementation-summary.md:50`) agree with the map, not the parent. The handoff criteria in the same metadata row make all seven children the completion condition, so Complete cannot be read as "the parent document is authored." The deep review rerun that T011 names is this run, and its terminal gate has not been recorded yet. The finding therefore keeps P1: an operator or resume flow that trusts `Status | Complete` can close or merge the packet with the phase 7 deliverable still open.

```json
{"type":"claim","claim":"The parent packet reports Complete while phase 7 is Draft and its required review rerun is unfinished.","evidenceRefs":["specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md:52","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md:59","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/spec.md:127","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/spec.md:25","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/tasks.md:62","specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/007-review-doc-reconciliation/implementation-summary.md:50"],"counterevidenceSought":"Read the parent metadata row, the phase map, the child metadata, the child task list and the child summary together. Considered whether Complete describes only the authored parent spec, or whether this review run itself closes T011; the row's own handoff criteria rule out the first, and the missing terminal-gate record rules out the second.","alternativeExplanation":"The Status row was set when the packet had fewer phases and was not revisited when phase 7 was added; the child and the map were updated, the parent row was not.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"If the parent Status field is documented as a document-authoring state rather than packet completion, or phase 7 becomes Complete with T011 ticked and the rerun's terminal gate recorded, this becomes P2 record drift."}
```

## Traceability Checks

| Protocol | Status | Evidence | Note |
|---|---|---|---|
| `spec_code` | pass | `spec.md:52,127`, `007/spec.md:25`, `.skilled/hooks/cli-dispatch/README.md:115`, `.skilled/hooks/subagent-dispatch-guard/pi/README.md:21` | Parent completion state, phase 7 state and the README/code drift re-read against the current files. |
| `checklist_evidence` | pass | `001/tasks.md:46`, `002/tasks.md:48`, `003/tasks.md:47`, `006/tasks.md:62`, `007/tasks.md:62` | 165 ticked task rows across phases 001-006 read. Completion artifacts re-checked against the current tree: six removed folders absent, `hook-flags.ts` untracked, `codex-global-hooks-check/` present, both syncs PASS, 105 READMEs, the root and 105th README VALID. Test-count rows are accepted from the phase records and were not re-executed. |

## Integration Evidence

- `sync-hook-registrations.cjs --check`: `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` Exit 0.
- `sync-runtime-mirrors.cjs --check`: `PASS: 257 mirrors across 10 trees are in sync.` Exit 0.
- `validate_document.py` on `.skilled/hooks/README.md` and `.skilled/hooks/session-handover/history/README.md`: `VALID`, 0 issues each; `hvr_scan.py` reports `hard blockers: 0` for both.
- The six removed folders (`git`, `codex-watchdog`, `hook-install`, `dispatch`, `task-dispatch`, `completion`) are absent, `git ls-files .skilled/hooks/shared/hook-flags.ts` prints nothing and `ls -d .skilled/hooks/codex-global-hooks-check` exits 0.

## Edge Cases

- The full hook Vitest tree, the OpenCode plugin tests, the hook `node --test` suites and `validate.sh --recursive --strict` were not re-run in this iteration. The leaf budget and the containment rule against repo-wide scripts limited this pass to the path, sync and README proofs. The packet's test rows are therefore not proven again by this iteration; they remain recorded phase evidence.
- The 105th README, `.skilled/hooks/session-handover/history/README.md`, postdates phase 4's 104-file validator gate. I ran both validators on it: `VALID` and 0 hard blockers, so it is clean and is not a finding.
- The security findings' line anchors moved: `dispatch-audit.mjs:1106` is now the start of `SECRET_PATTERNS` and `:1243` is the `appendFileSync` call. Both constructs still hold, so the registry's line numbers resolve to the right evidence.
- The deferred phase-6 test-isolation question is still not answered from the test bodies. The phase 6 verification table records the old/new adapter runs and the suite counts, but this iteration did not read the test files or re-run them. It stays unverified rather than passing.
- The new leaf-README instance was outside iteration 4's five-feature scope. The prior scope proof for `R4-P2-002` was too narrow, not wrong about the feature README it cited.

## Confirmed-Clean Surfaces

- All six removed hook folders are gone and `codex-global-hooks-check/` is live.
- Both registration and runtime-mirror sync checks pass from the final state.
- The hook README set is 105 files; the root README and the post-merge history README both pass the document and human-voice validators.
- The three live entries omitted by the feature trees (`decision-capture/opencode/decision-capture.js`, `subagent-dispatch-guard/vibe/deep-loop-guard.mjs`, `session-lifecycle/vibe/session-start.test.mjs`) exist, so the omissions are documentation drift, not dead links.
- The parent phase map and all six completed children agree; phase 7 is the only open child, and the P1 records that.

## Ruled Out

- The 105th README lacks validator evidence: ruled out; both validators pass on `session-handover/history/README.md`.
- The parent `_memory.continuity` 0% is a false completion signal: writer-owned and excluded by the packet's non-goals, so not reported.
- The tree omissions are broken symlinks: ruled out; all three named entries exist and all 44 sampled symlinks resolve.
- Kill-switch or concern-key drift after the renames: ruled out; both sync checks pass and the six old folders are absent.
- The full test trees hide a new failure introduced by this review's doc edits: not established; the working tree changes only `.skilled/hooks/README.md`, whose validators pass, and no test was re-run.

## Next Focus

No further iteration remains: this is iteration 5 of 5 and all four dimensions are covered. The run ends CONDITIONAL on the active P1. Recommended handoff: close phase 7 (fill its summary, tick T011 with the rerun's terminal gate), correct the parent status, then run the full objective proof set.

Review verdict: CONDITIONAL
