# Iteration 3: traceability and maintainability

## Dimension

Traceability, the assigned dimension, and maintainability in the same pass. This is the last iteration under the cap of 3, and maintainability had no coverage yet.

## Dispatcher

- Prompt pack: `review/prompts/iteration-3.md`. Iteration 3 of 3 matches the state log, which holds two iteration records.
- Executor: native `@deep-review` leaf. Nothing was delegated.
- HEAD is `1d1bfadab67`, the fix commit. The worktree is clean apart from `review/`.

## Files Reviewed

- `025-review-p2-fixes/spec.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md`, read in full.
- The P2 table in `024-ollama-lane-removal/review/review-report.md` (`:34-43`, `:65-74`).
- `sweep-lane-residue.mjs`: header `:28-52`, constants `:190-202`, `nodeScriptOf`, `isFileOnDisk`, `runsModelServer` and `isOwnedModelServer` at `:1244-1328`, the server-file loop at `:1361-1385`, and the `checkDotenv` note at `:1552-1566`.
- `sweep-lane-residue.vitest.ts`: header `:1-30`, plus the case anchors at `:749`, `:771`, `:838`, `:859`, `:875`, `:892-899`, `:905-932`, `:936` and `:957`.
- `.github/workflows/advisory-checks.yml:1-26`, catalog page `lane-residue-gate-and-cleanup.md:10`, `:19` and `:27`, `retrieval/README.md:25`, and the allowlist (47 rows).
- `024/goal.md:86-113` and its diff in `1d1bfadab67`, `024/spec.md:41` and `:118`, 016 `spec.md:159-161`, the CHK counts in `001/tasks.md` and `006/tasks.md`, and a grep of `024/decision-record.md`.

## Operator focus: ten-fix replay and SL4-005

The ten P2 fixes from the 024 report were replayed against HEAD. The 024 ids carry a `024:` prefix here so they cannot be confused with this run's ids.

| 024 finding | Fix at HEAD | Holds? |
|---|---|---|
| 024:R2-P2-001 | `sweep-lane-residue.mjs:1368-1373` lists a name the address adds only when it is a socket, and notes any other file. The regular-file case is at vitest `:936`. | Yes |
| 024:R9-P2-001 | `sweep-lane-residue.mjs:1561-1565` adds the note and leaves the status alone. The case is at vitest `:749`. | Yes |
| 024:R1-P2-001 | `nodeScriptOf` at `sweep-lane-residue.mjs:1259-1284` joins a spaced path. The table is at vitest `:892-899`, and a probe printed `true` for the spaced command. Iteration 1's R1-P2-001 records the remaining gap for unlisted value options. | Yes, with that residual |
| 024:R1-P2-002 | Header decision 3 at `sweep-lane-residue.mjs:34-39` and catalog `:27` state the whole-file limit. | Yes |
| 024:R4-P2-001 | The allowlist has 0 reasons that match `[Ll]ines? [0-9]` and still has 47 rows. | Yes |
| 024:R3-P2-003 | `advisory-checks.yml:24-25` names every pull request and pushes to `main` and `skilled/**`. The trigger at `:2-6` is unchanged. | Yes |
| 024:R7-P2-001 | Catalog `:19` uses the same wording. | Yes |
| 024:R3-P2-001 | `024/goal.md:88-92` ticks the criteria. All five are ticked, against the four the 025 docs claim; see R3-P2-001 below. | Partly |
| 024:R3-P2-002 | `024/spec.md:41` reads Complete, and so does 016 row 24 at `spec.md:160`. 005 AC-014 is closed. | Yes |
| 024:R10-P2-001 | `001/tasks.md` has 34 of 34 checked CHK rows with an Evidence clause, and `006/tasks.md` has 35 of 35. | Yes |

**SL4-005 (`fixture_realism`) is ruled out, and this closes AC-024's disposition question.** Iteration 1 settled it, and the item is in the strategy's exhausted list, so it was not searched again. Iteration 1's citations still match HEAD:

- The one branch that depends on a file being a socket is `sweep-lane-residue.mjs:1371`.
- The case at vitest `:905` binds a real socket with `net.createServer()` (`:914`) and asserts `isSocket()` (`:922`).
- It asserts machine exit 1 at `:926` and exit 0 after apply at `:930`, and closes the server in `finally` at `:931-932`.
- The regular-file counterpart is at vitest `:936`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 025 docs say the 024 goal's criterion 4 stays unticked, but the commit ticks all five criteria and adds two log rows** -- `024-ollama-lane-removal/goal.md:91` -- In `1d1bfadab67`, criterion 4 changes from `[ ]` to `[x]` at `goal.md:91`, and the log gains two rows. Row `:112` says "Criterion 4 open". Row `:113` says "Criterion 4 | Complete", resting on dispositions for C-08 and BAT-01. The 025 docs still describe the pre-commit plan:
   - `tasks.md:64` (T022) says "Criterion 4 stays unticked".
   - `acceptance-criteria.md:71` (AC-018, Met) observes "criteria 1, 2, 3 and 5 are ticked", "the log table gains one row" and "the four ticks are the only changed lines".
   - `implementation-summary.md:64` says "ticks four of its five criteria".
   - `implementation-summary.md:111` and `:142` give the reason criterion 4 cannot hold as written.

   The criterion's text, "fixed and committed", was not amended, and a grep of `024/decision-record.md` for `criterion 4`, `C-08` or `BAT-01` returns nothing.
   Finding class: completion-metadata drift (evidence contradicts the committed state).
   Scope proof: the `git show 1d1bfadab67` diff of `024/goal.md` shows five `+- [x]` lines and two added log rows. The 025 rows cited above were committed in the same commit.
   Affected surface hints: `025-review-p2-fixes/tasks.md:64`, `025-review-p2-fixes/acceptance-criteria.md:71`, `025-review-p2-fixes/implementation-summary.md:64`, `:111`, `:142`, `024-ollama-lane-removal/goal.md:91`, `:112-113`.
   Case: a reader who checks AC-018's Observed cell against `024/goal.md` finds five ticks and two new rows where the cell claims four ticks and one row, and the two log rows disagree on whether criterion 4 is open.

2. **The implementation summary describes the tree before the commit: it says README.md:25 was left unchanged and that nothing is committed** -- `025-review-p2-fixes/implementation-summary.md:145` -- The summary and checklist contradict `1d1bfadab67` in three places:
   - Known Limitation 5 says `retrieval/README.md:25` still says "every push" and "is reported, not changed". The commit's stat shows `README.md | 2 +-`, and `README.md:25` now reads "runs `repo` on every pull request and on pushes to `main` and `skilled/**`".
   - The Files Changed table (`:68-83`) has no README row, and neither does spec.md's Files to Change.
   - `:93` says "Nothing is committed; the conductor commits after review", and CHK-FIX-007 (`tasks.md:163`) says "the implementation commit does not exist yet". The code, the tests and the 025 docs are all in `1d1bfadab67`.

   Finding class: doc-to-commit drift in the packet's own record.
   Scope proof: `git show --stat 1d1bfadab67` lists `retrieval/README.md` and the 025 documents, and `README.md:25` holds the new wording.
   Affected surface hints: `025-review-p2-fixes/implementation-summary.md:68-83`, `:93`, `:145`, `025-review-p2-fixes/tasks.md:163`, `025-review-p2-fixes/spec.md:92-105`.
   Case: an operator who reads Known Limitation 5 opens a follow-up to reword `README.md:25`, a line the same commit already reworded.

3. **The 025 docs did not follow the independent review fix: Known Limitation 4 cites an example the code now handles, and NFR-P01 names a single lstat as the only new filesystem call** -- `025-review-p2-fixes/implementation-summary.md:144` -- The summary and the spec disagree with the code:
   - Known Limitation 4 says `node -r foo /p/hf-model-server.cjs` "is now listed as a model server but never owned". After the review fix, `-r` is in `NODE_VALUE_OPTIONS` (`sweep-lane-residue.mjs:202`), and its value is skipped at `:1266-1268`. A probe of `nodeScriptOf` returned `/p/hf-model-server.cjs`, and `runsModelServer` returned `true`. `isOwnedModelServer` (`:1323-1327`) owns the same command when its path is this checkout's script, so "never owned" no longer holds.
   - The shape that is still misread is an option the code does not list, such as `node --env-file x /p/hf-model-server.cjs`, which returns `x`. Iteration 1's R1-P2-001 already records that code gap.
   - `spec.md:171` (NFR-P01) says the one new filesystem call is an `lstat` on each extra server name. The review fix added `fs.statSync` through `isFileOnDisk` (`sweep-lane-residue.mjs:1276`, `:1290-1296`). It runs for every node process whose first word is an absolute path with no extension, and twice for an ownership candidate, because `isOwnedModelServer` calls `nodeScriptOf` directly and again through `runsModelServer`.

   This finding is about the documentation only, so it does not refine R1-P2-001.
   Finding class: doc-code drift (the limitation text and the NFR predate the review fix).
   Scope proof: `nodeScriptOf` is the only caller of `isFileOnDisk`, and `NODE_VALUE_OPTIONS` is defined once, at `:202`.
   Affected surface hints: `025-review-p2-fixes/implementation-summary.md:144`, `025-review-p2-fixes/spec.md:171`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:202`, `:1276`, `:1290`.
   Case: a maintainer who reads Limitation 4 adds a test that expects `node -r foo <this checkout's script>` to be unowned, and that test fails against HEAD.

4. **The evidence line references in the 025 tasks, checklist and criteria do not match HEAD, and some land on a different test or function** -- `025-review-p2-fixes/tasks.md:172` -- The references were taken before the review fix added five test rows and about 31 tool lines. At HEAD:
   - CHK-031 (`tasks.md:172`) and AC-002 (`acceptance-criteria.md:55`) cite V:931 for the regular-file case. V:931 is now the `finally` of the socket test, and the regular-file case is at V:936.
   - CHK-FIX-003 (`tasks.md:159`) puts `checkDotenv` "only at T:1637". T:1637 is `machineExitCode`. `checkDotenv` is defined at T:1531 and called at T:1668.
   - `spec.md:83` cites `machineExitCode` at T:1579. It is at T:1637.
   - Other references are off by the same shift. T:1340 should be T:1371, T:1533 should be T:1564, and T:1251 should be T:1259. CHK-FIX-002's T:1332 should be T:1363. V:900, V:909, V:921, V:927 and V:952 should be V:905, V:914, V:926, V:931 and V:957. V:891-897 should be V:892-899.
   - V:749, V:771, T:36, T:48 and T:198 still match.

   CHK-FIX-007 plans to pin the evidence to the implementation commit at closure. Pinning these numbers to `1d1bfadab67` would make the pin false. This iteration checked the references against HEAD only, not against `bf3bca7a8b1`.
   Finding class: stale evidence pins (checklist_evidence).
   Scope proof: a grep of the test and tool definitions at HEAD put each anchor at the line listed above.
   Affected surface hints: `025-review-p2-fixes/tasks.md:47-53`, `:157-172`, `025-review-p2-fixes/acceptance-criteria.md:54-58`, `:63`, `025-review-p2-fixes/implementation-summary.md:70`, `025-review-p2-fixes/spec.md:83`.
   Case: a reviewer who follows CHK-031's V:931 to confirm that a regular file survives apply reads the socket test's server close instead.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | partial | `sweep-lane-residue.mjs:1371`, `:1564`, `:1259`, `:36`, `:48`; `advisory-checks.yml:24`; `spec.md:171` | The code meets REQ-001, REQ-002, REQ-003, REQ-006 and REQ-007, and the workflow and catalog wording meets REQ-005. NFR-P01's filesystem-call claim no longer holds (R3-P2-003). |
| `checklist_evidence` | partial | `tasks.md:64`, `:159`, `:172`; `acceptance-criteria.md:55`, `:71`; `024/goal.md:91` | Every AC row through AC-023 is Met with an Observed cell. AC-018's observation contradicts the commit (R3-P2-001), and several line pins miss HEAD (R3-P2-004). AC-024 is honestly Unmet. |
| `feature_catalog_code` | pass | `lane-residue-gate-and-cleanup.md:19`, `:27`; `advisory-checks.yml:2-6`, `:24-25` | The catalog states the real trigger and the whole-file limit, and its version is `1.0.1.0` (`:10`). |

The `skill_agent`, `agent_cross_runtime` and `playbook_capability` overlays were not run this iteration, so they are left out.

## Integration Evidence

- Workflow `.github/workflows/advisory-checks.yml`: the trigger at `:2-6` and the `lane-residue` comment at `:21-26`.
- Feature catalog `system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md`.
- `system-spec-kit/runtime/cli/retrieval/README.md:25`.

## Edge Cases

- **Ambiguity:** it is unclear whether criterion 4 "holds". Log row `:113` rests the tick on dispositions in the 008 implementation summary, which this iteration did not read. The lower supported severity, P2, is kept, and `downgradeTrigger` names the condition for raising it.
- **Contradiction:** inside `024/goal.md`, row `:112` says "Criterion 4 open" and row `:113` says Complete. Both were added in the same commit. The log is append-only, so `:113` is the later row, but it is not backed by an amendment of the criterion.
- **Coverage:** three iterations had to cover four dimensions, so this one carries two.

## Confirmed-Clean Surfaces

- **Comment hygiene:** a grep for `R[0-9]+-P2-`, `SL4-00`, `025-review`, `REQ-0` and `CHK-` in the tool and the test prints nothing.
- **Tool doc comments:** the comments match the code. This covers `nodeScriptOf` (`:1244-1258`), `isFileOnDisk` (`:1286-1289`), `isOwnedModelServer` (`:1311-1322`), the socket-rule comment (`:1368-1370`), the dotenv-note comment (`:1561-1562`), and header decisions 3 and 7 (`:34-39`, `:47-49`).
- **Test header:** the coverage matrix (`vitest:4-29`) still describes the mode axes truthfully. It does not list the new regular-file and rejected-dotenv-line cells, but those cases have descriptive test names (`:749`, `:936`). That is too small to file.
- **016 phase map:** rows 24 and 25 (`spec.md:160-161`) read Complete and name this packet.

## Ruled Out

- SL4-005 `fixture_realism`: ruled out in iteration 1 and exhausted. It was not searched again; the citations above were rechecked at HEAD.
- The 005 `acceptance-criteria.md` Draft status is a convention, and old goal-log rows are superseded. Both are exhausted per the strategy.
- 024:R1-P2-001's residual (an unlisted value option): already active as this run's R1-P2-001, so it is not filed again.

## Next Focus

- Dimension: none. All four dimensions are covered, and the iteration cap is reached.
- Focus area: synthesis.
- Reason: this is the last iteration under the cap.
- Rotation status: correctness, security, traceability and maintainability are complete.
- Blocked/productive carry-forward: diffing a commit with `git show` against the packet's Observed cells was productive. `fixture_realism` stays exhausted.
- Required evidence: synthesis should state that SL4-005 is ruled out for AC-024 and list the seven active P2 findings.

Review verdict: PASS
