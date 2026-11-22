# Iteration 4: traceability, replay of the seven P2 findings at `dfdaee3a064`

## Dimension

Traceability. This is a one-iteration extension of the completed run, so it raises the cap to 4. The operator focus is covered in full: each of the seven active P2 findings from iterations 1 to 3 was replayed against HEAD `dfdaee3a064` and against its delta in `git show dfdaee3a064`. The core protocols `spec_code` and `checklist_evidence` were then rerun over the 025 packet docs.

## Dispatcher

- Prompt pack: `review/prompts/iteration-4.md`. Iteration 4 matches the state log, which holds three iteration records.
- Executor: native `@deep-review` leaf. Nothing was delegated.
- HEAD is `dfdaee3a064`, the follow-up fix commit. The worktree is clean apart from `review/` run state.
- Lineage: `sessionId` `2026-11-21T14:41:59Z`, generation 1, `lineageMode` `completed-continue`, continued from run 3.

## Files Reviewed

- `git show dfdaee3a064` for `sweep-lane-residue.mjs`, `sweep-lane-residue.vitest.ts`, 005 `goal.md` and `tasks.md`, and 025 `spec.md` and `acceptance-criteria.md`.
- `025-review-p2-fixes/tasks.md:40-200`, `implementation-summary.md:55-158`, the AC-018 row, `spec.md:39`, `:83`, `:99`, `:119-135`, `:172` and `:199-202`.
- `sweep-lane-residue.mjs:206`, `:1272-1279`, `:1303`, `:1319-1341`, `:1711` and `:2011`. `sweep-lane-residue.vitest.ts:901-902` and `:1136`.
- `024-ollama-lane-removal/goal.md:86-93` and `:108-113`. `005-shared-embeddings-package/goal.md:57-62` and `:80`, and `005/tasks.md:103`.
- `.github/workflows/advisory-checks.yml:1-8` and `:21-26`, and `retrieval/README.md:25`.

## Operator focus: replay at `dfdaee3a064`

Each row was checked against the current file, not against the fix commit's message or the packet's own claims.

| Finding | What HEAD shows | Status |
|---|---|---|
| R1-P2-001 | `NODE_VALUE_OPTIONS` at `sweep-lane-residue.mjs:206` now lists `--env-file`, `--inspect-port` and 37 other value options, and `nodeScriptOf` skips their value at `:1279`. A probe printed `/x/.skilled/bin/hf-model-server.cjs true` for the finding's own case, `node --env-file cfg.vars /x/.skilled/bin/hf-model-server.cjs`, and the same for `--inspect-port 9230`. Both are rows of the table at vitest `:901-902`. An option left off the list still misreads (`node --test-reporter spec ...` printed `spec false`). The constant's comment and Known Limitation 4 both say so, so the residual is documented, not hidden. | Resolved |
| R1-P2-002 | `005/goal.md:57-62` ticks all six criteria, and the log gains a `Completion criteria \| Complete` row at `:80`. Criterion 4 was narrowed to exclude the residue check and its test. `git grep -l "@huggingface/transformers" -- ':!specs'` lists exactly those two files, so the narrowed criterion holds. `005/tasks.md:103` T054 names phase commit `1f85a9dd6dd`. | Resolved |
| R2-P2-001 | The case `refuses to delete a model server file through a linked IPC folder` (vitest `:1136`) sets `SPECKIT_IPC_SOCKET_DIR` to a link. It asserts that the file survives and that a `refused` action carries `its directory is a symlink`. That reason string is produced in one place only, the `isSymlink(dir)` guard at `sweep-lane-residue.mjs:2011`, so the case cannot pass with that guard removed. The `resolveContainedTarget` comment (`:1711`) now says a linked root passes. The file ran 106 of 106, exit 0. | Resolved |
| R3-P2-001 | T022 (`tasks.md:64`), AC-018's Observed cell, What Was Built (`implementation-summary.md:64`), Files Changed (`:78`), Key Decisions (`:123`) and Known Limitation 2 (`:154`) all say five ticks and two log rows, with criterion 4 resting on dispositions. That matches `024/goal.md:91` and log rows `:112-113`. A grep for `stays unticked` and `four of its five` prints nothing. The criterion's unamended text is recorded as the operator's call in Known Limitation 2. | Resolved |
| R3-P2-002 | `implementation-summary.md:75` and `spec.md:99` hold a README row, and `:94` names `1d1bfadab67` and the README rewording. The README Known Limitation is gone. CHK-FIX-007 (`tasks.md:174`) no longer says the commit does not exist, and it is honestly left open until the final pin. A grep for `Nothing is committed`, `does not exist yet` and `is reported, not changed` prints nothing. `README.md:25` names the push filter. | Resolved |
| R3-P2-003 | Known Limitation 4 (`implementation-summary.md:156`) now cites `node --test-reporter spec ...`, which the probe confirms still reads `spec`, in place of the `-r` example the code handles. NFR-P01 (`spec.md:172`) names the `fs.statSync` in `isFileOnDisk` (`sweep-lane-residue.mjs:1303`). Its count, one read by `checkModelServer` and two more in `isOwnedModelServer` (`:1336-1338`, through `runsModelServer` then directly), matches the code. | Resolved |
| R3-P2-004 | `rg -n '\b[TV]:[0-9]+'` over the five packet docs prints nothing. The checklist now cites test titles and function names. Spot checks at HEAD: CHK-031 (`tasks.md:183`) names the regular-file case by title, CHK-FIX-003 (`:170`) names `checkDotenv` and its caller rather than a line, and the remaining prose line references hold. Catalog `:27` and tool `:36` hold the `whole file` sentence, and 016 `spec.md:161` holds row 25. | Resolved |

All seven are resolved. The one residual that survives, an option left off `NODE_VALUE_OPTIONS`, is documented in code and in the summary, so it is not a new finding.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 025 spec's complexity table still says repo mode gates every push, the claim REQ-005 removes from the three named sites** -- `025-review-p2-fixes/spec.md:201` -- The Risk row reads "repo mode gates every push and pull request". The workflow trigger is `push: branches: [main, 'skilled/**']` plus `pull_request` (`.github/workflows/advisory-checks.yml:2-6`), and the workflow comment (`:25`), `retrieval/README.md:25` and catalog `:19` now say so. REQ-005 (`spec.md:128`) scopes its fix to three sites, so it is met. This line sits outside those sites and still carries the old claim. `spec.md:39` also says "every push", but it describes what the 024 review found, so it is not drift.
   Finding class: doc-to-config drift (the packet's own risk rationale).
   Scope proof: a grep for `every push` over the five 025 docs matches `spec.md:39` and `:201`, plus `plan.md:83` and `:88`, `tasks.md:57-59` and AC-015 (`acceptance-criteria.md:68`). Those other matches name the sites to reword or quote the old claim. Only `spec.md:201` states the trigger as a present fact.
   Affected surface hints: `025-review-p2-fixes/spec.md:201`.
   Case: a reader of the complexity table expects a push to a feature branch outside `skilled/**` to run the lane-residue gate, and it does not.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `sweep-lane-residue.mjs:206`, `:1279`, `:1303`, `:2011`; vitest `:901`, `:1136`; `spec.md:119-135`, `:172`; `advisory-checks.yml:2-6`; `README.md:25` | Every REQ row from REQ-001 to REQ-011 holds at HEAD. REQ-012 is the follow-up review's own outcome, which this run supplies. NFR-P01 now matches the code, and the drift that made iteration 3 partial is gone. R4-P2-001 sits in the complexity table, not in a requirement. |
| `checklist_evidence` | pass | `tasks.md:64`, `:87-94`, `:170`, `:174`, `:183`; AC-018 row; `005/goal.md:57-62`; `024/goal.md:91`, `:112-113` | Each checked row's evidence was matched to HEAD. The Vitest file printed `Tests 106 passed (106)`, exit 0, against the claim in T027, T042 and CHK-011. The probes match T035 and T040. No T: or V: pin is left. The open rows, T034, CHK-020 and CHK-FIX-007, are honestly open and wait on this review and the final pin. T036's negative control is marked as not rerun by the recorder. This iteration did not run it, but the single producer of the asserted reason string proves the dependency. |

The overlay protocols were not run this iteration. `feature_catalog_code` passed in iteration 3, and the catalog was not changed by `dfdaee3a064`.

## Integration Evidence

- Workflow `.github/workflows/advisory-checks.yml`: trigger `:2-6`, comment `:21-26`.
- `system-spec-kit/runtime/cli/retrieval/README.md:25`.
- Vitest run: `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts` from `runtime/cli`, exit 0, `Tests 106 passed (106)`.

## Edge Cases

- **Partial verification:** T036's negative control was not rerun. Its conclusion rests on a grep showing one producer of `its directory is a symlink`, which is a deduction from the code rather than an observed failure.
- **Self-referential pin:** CHK-FIX-007 cannot name `dfdaee3a064` from inside that commit, so leaving it open is correct, not drift.
- **Lineage:** the config's `maxIterations` is 4 and the state log's config row still reads 3. The prompt and the config agree on 4, and that is what this iteration used.

## Confirmed-Clean Surfaces

- Comment hygiene in the new code: the added `NODE_VALUE_OPTIONS` comment and the new test comment hold no finding ids or packet numbers.
- 005 criterion 4 as narrowed matches `git grep` exactly.

## Ruled Out

- `spec.md:39` "every push": it describes what the 024 review found, not the current trigger.
- The unlisted-option residual of R1-P2-001: it is documented in the constant's comment and in Known Limitation 4, and no known launcher passes such an option, so it is not refiled.
- SL4-005 `fixture_realism`: exhausted, not searched again.

## Next Focus

- Dimension: none. The extended cap of 4 is reached, and all four dimensions are covered.
- Focus area: synthesis.
- Reason: last iteration.
- Rotation status: correctness, security, traceability and maintainability are complete.
- Blocked/productive carry-forward: replaying each finding against `git show <fix>` plus a probe of the current file was productive. `fixture_realism` stays exhausted.
- Required evidence: synthesis should record all seven prior P2 findings as resolved at `dfdaee3a064`, carry R4-P2-001 as the one active P2, and state SL4-005 as ruled out for AC-024.

Review verdict: PASS
