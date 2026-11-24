# Review Iteration 008

## Dispatcher

- Mode: review (native deep-review iteration)
- Iteration: 8 of 9, run 8, session `2026-11-23T21:41:17.101Z`, generation 5, lineageMode `completed-continue`
- Agent: `@deep-review` (LEAF, single iteration, no sub-dispatch)
- Scope lock: review target `.skilled/skills/system-skill-advisor`, correctness dimension
- Task type: VERIFICATION PASS. The working tree carries uncommitted fixes for every registry finding. The job is to decide, for each active finding, whether the CURRENT code closes it at the cause, closes it partly, or leaves it open, and to raise a new finding only for a defect the fixes introduced or missed.

## Dimension

correctness (fix verification). Security, traceability and maintainability were covered in iterations 1-7; this pass re-checks the correctness findings at the cause against `git diff HEAD` and the current file bodies, and records one new correctness defect that the metrics/prompt-policy hardening introduced.

Operator focus addressed: every file read is inside `runtime/` or `hooks/` logic; prose docs were consulted only where the code comment asserted a doc-side fact (the shared-payload drift claim), which is the one place the review focus admits.

## Files Reviewed

Fix sites, read at the cause:

- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:755] `deleteMissingNodesUnderRoot` replaces the table-wide delete
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:761] `realpathOfNearestAncestor`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:770] `isPathInside` containment predicate
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1012] the scoped delete call inside the transaction
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1051] edge targets now resolved from the whole node table
- [SOURCE: .skilled/bin/lib/launcher-ipc-bridge.cjs:179] `ownershipProblem` (lstat, symlink, socket, uid, group/world-writable)
- [SOURCE: .skilled/bin/lib/launcher-ipc-bridge.cjs:202] `checkIpcSocketOwnership`
- [SOURCE: .skilled/bin/lib/launcher-ipc-bridge.cjs:471] lease-holder path refuses a foreign socket before bridging
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1368] CLI refuses before `ensureDaemonReady`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1379] CLI re-checks after daemon start, before connect
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:254] bridge contract requires the helper
- [SOURCE: .skilled/bin/lib/launcher-session-proxy.cjs:674] reattach path refuses a foreign socket
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/owned-private-dir.ts:12] shared `isOwnedPrivateDir`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:177] `APPEND_NO_FOLLOW`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:262] `privateDirReady`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:281] `appendPrivateLine` (fstat uid/nlink, fchmod, append)
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:330] bounding keeps the same private-dir gate
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:149] shadow-sink dir hardening
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:183] shadow-sink `appendPrivateLine`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/feedback-calibration.ts:189] calibration dir hardening
- [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:285] receipt store uses the shared check
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:275] `TYPED_SLASH_COMMAND`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:283] `isLowInformationPrompt`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:309] `weightedSumScoreBySkill` in `fuseAdvisorLaneRanks`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:513] `SeedBoundResult.heldBy`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:579] `heldBy` populated for every capped target
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1229] score read from the weighted-sum map
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1296] tie-break keys off the typed command, not any slash
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1398] breadth abstention keys off the typed command
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1497] ambiguity over the doctor-free ranking
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:68] `heldBy` cluster exception
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:152] `heldBy` on the recommendation contract
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:101] `meaningfulTokens` (stop-word filter is the shared semantic)
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4076] Python `TASK_INTENT_RE` gains `review`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4085] Python loads the prompt-policy stop-word set at import
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4106] Python `meaningful_token_count`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5103] low-information abstention delegates to the shared predicate
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5169] breadth abstention delegates to the typed-command predicate
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:14] Gate-question owner candidate list
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:207] load failure now warns with the path and error
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:159] `lockFileMtimeMs`
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:222] corrupt-lock reclaim re-reads token and mtime before delete
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324] trust comment now states the launcher's trusted default
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:6] header now states the descriptor/Zod parity split
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:4] drift claim now matches the repo
- Test surface read to judge expected behaviour only: `runtime/tests/scorer/score-stage-order.vitest.ts`, `runtime/tests/parity/python-ts-constant-parity.vitest.ts`, `runtime/tests/scorer-predicate-cases.vitest.ts`, `runtime/tests/fixtures/scorer-predicate-cases.json`, `runtime/tests/python/test_skill_advisor.py`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. All three active P1s are closed at the cause; see the resolution table below.

### P2 Findings

1. **Python fallback hard-fails at import when the shared prompt-policy file is missing or malformed** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4085 -- The stop-word parity fix moved the stop-word set from an inline literal into a module-level `open(PROMPT_POLICY_PATH)` executed while `skill_advisor.py` is being imported, with no `try`/`except` and no fallback set. A missing, unreadable or schema-drifting `runtime/data/prompt-policy.default.json`, or a `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` pointing at a bad file, raises `FileNotFoundError`/`JSONDecodeError`/`KeyError` during import, so the whole Python fallback becomes unimportable. Before the fix the module had no external data dependency at all, and every other failure inside this file is handled fail-open, so this converts one degraded predicate into a total loss of the fallback path the CLI reaches when the daemon cannot answer.
   Finding class: `introduced_defect`
   Scope proof: the added read is at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4078-4093`; the only other `PROMPT_POLICY_STOP_WORDS` consumer is `meaningful_token_count` at `:4106`, so the dependency is unconditional, not lazy. The TypeScript twin reads the same file through `runtime/lib/prompt-policy.ts:43` and is therefore no worse, but the Python module is the documented fallback when the daemon and the native scorer are unavailable.
   Affected surface hints: `runtime/scripts/skill_advisor.py` module import; `hooks/lib/skill-advisor-cli-fallback.ts` (spawns the CLI, which falls back to this script); `runtime/data/prompt-policy.default.json`; `SPECKIT_ADVISOR_PROMPT_POLICY_PATH`; the Python tests at `runtime/tests/python/test_skill_advisor.py` that import the module with the file present.
   Case: a vendored install (or a symlinked data dir) ships the skill without `runtime/data/prompt-policy.default.json`, or ships a `data` folder whose `sets.STOP_WORDS` entry is renamed. `python3 runtime/scripts/skill_advisor.py recommend ...` then exits with a traceback at import instead of routing with the built-in predicates, and `advisor_recommend` loses its last non-daemon answer.

```json
{
  "type": "introduced_defect",
  "claim": "The Python fallback gained an unguarded module-level file dependency, so a missing or malformed prompt-policy data file makes the entire fallback unimportable instead of degrading one predicate.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4078-4093",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4106",
    ".skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:43",
    ".skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py"
  ],
  "counterevidenceSought": "Searched for a guard, lazy load, or fallback set around the read: none exists; the open/json.load pair is at module scope. Checked whether the file is a required sibling of the TypeScript runtime (it is, at runtime/lib/prompt-policy.ts:43), which lowers the chance of absence in a correctly packaged install and is why this stays P2 rather than P1.",
  "alternativeExplanation": "The file ships with every packaged copy of the skill, so absence is only reachable through manual tampering or an env override, and a tampered env var is operator error rather than a defect.",
  "finalSeverity": "P2",
  "confidence": 0.6,
  "downgradeTrigger": "Downgrade to advisory-only (close) if packaging is shown to emit runtime/data/prompt-policy.default.json for every install channel, including the doctor-vendored and linked-worktree forms, because then only deliberate tampering reaches the failure."
}
```

### Carried (still open)

1. **Shadow sink still writes to a path outside any gitignore rule** -- .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:149 -- Partly fixed. The write path now refuses a symlinked, multiply linked or foreign-owner file and tightens a loose directory to `0700` before appending, which closes the mode and symlink halves of G5-I2-P2-002. The remaining half is unchanged: the default sink path is still a working-tree path with no gitignore rule, so an opt-in run can stage raw prompts into a commit. Not re-verified against the repo's ignore rules this iteration, so it stays open rather than resolved.
   Finding class: `unfixed_half`
   Scope proof: the diff at `shadow-sink.ts:149-180` touches only directory/file permission and link handling; no path-selection code changed, and the finding's path half names the same default.
   Affected surface hints: `runtime/lib/shadow/shadow-sink.ts` default log path, the repo `.gitignore`, the operator playbook step that enables the sink.
   Case: an operator sets the shadow-sink env flag, the daemon appends prompt text under the working tree, and `git add -A` stages it.

## Verification Resolution Table

| Finding | Verdict | Closing evidence |
| --- | --- | --- |
| G5-I1-P1-001 | Fixed at cause | `skill-graph-db.ts:755-787` deletes only rows whose stored path is inside the scanned root; `:1012` passes the resolved root; empty scans preserve the graph at `:959`; edge targets read from the whole node table at `:1051`. The nested-root edge remains: a skill physically inside the scanned root is deleted with the root, which is the intended meaning of the root. |
| G5-I2-P1-001 | Fixed at cause | `launcher-ipc-bridge.cjs:202-226` rejects a symlinked, foreign-owner, group/world-writable socket dir; `skill-advisor-cli.ts:1368` refuses before any daemon start and `:1379` re-checks before connect; `launcher-session-proxy.cjs:674` refuses on reattach; hooks reach the socket only through the CLI (`skill-advisor-cli-fallback.ts` spawns `bin/skill-advisor.cjs`). |
| G5-I6-P1-001 | Fixed at cause | `metrics.ts:262-277` requires an owned `0700` dir (skipping the write otherwise), `:281-313` opens with `O_NOFOLLOW`, requires a single-link owned regular file and forces `0600`; `shadow-sink.ts:183` and `feedback-calibration.ts:189` apply the same rules through `owned-private-dir.ts:12`. |
| G5-I1-P2-001 | Fixed at cause | `fusion.ts:309-330` now returns both the RRF score and a weighted sum normalised by `K+1`; the scorer consumes the weighted sum at `:1229`, so confidence and the command penalty compare like-for-like. |
| G5-I1-P2-002 | Fixed at cause | `fusion.ts:275-283` requires a typed `/cmd:sub` or `/doctor` shape; used at `:1296` and `:1398`, so an ordinary path no longer disables the tie-break or breadth abstention. |
| G5-I1-P2-003 | Fixed at cause | `fusion.ts:1497-1503` recomputes ambiguity over the ranking with the doctor bridge excluded. |
| G5-I1-P2-004 | Fixed at cause | `fusion.ts:283-289` delegates to `promptPolicyTokens(...).meaningful`, which drops stop words (`prompt-policy.ts:101-103`). |
| G5-I1-P2-005 | Fixed at cause | `fusion.ts:579-594` records every capping seed in `heldBy`, `types.ts:152` carries it, `ambiguity.ts:68-72` exempts a member held by the top. |
| G5-I2-P2-001 | Fixed at cause | `advisor-server.ts:324-330` now states that a caller-less frame takes the environment default, which the launcher sets to trusted. |
| G5-I2-P2-002 | Partly fixed | Mode and symlink guard added; the non-gitignored default path is unchanged. Carried. |
| G5-I3-P2-001 | Fixed at cause | `skill_advisor.py:4085-4130` shares the policy set and typed-command regex; `:5103`/`:5169` call the shared predicates; `tests/fixtures/scorer-predicate-cases.json` is read by both `tests/scorer-predicate-cases.vitest.ts` and `tests/python/test_skill_advisor.py`. |
| G5-I3-P2-002 | Fixed at cause | `runtime/lib/lifecycle/supersession.ts` and `schema-migration.ts` are deleted, and the catalog/playbook leaves that presented them (`feature-catalog/lifecycle-routing/{supersession,schema-migration,rollback}.md` and the playbook twins) are deleted too. `rollback.ts` survives; its remaining exported surface was not re-read line by line, noted under Edge Cases. |
| G5-I4-P2-001 | Fixed at cause | `tools/advisor-contract-keys.ts:6-13` now names the descriptor/Zod parity test and the workspaceRoot asymmetry instead of phantom consumers. |
| G5-I4-P2-002 | Fixed at cause | `tests/scorer/score-stage-order.vitest.ts` exists as the ordering seam. |
| G5-I4-P2-003 | Fixed at cause | `tests/parity/python-ts-constant-parity.vitest.ts` exists; `hooks/pi/prompt-advisor.ts` is covered by it per the parity suite's scope. |
| G5-I4-P2-004 | Fixed at cause | Both constants now carry a pointer to the parity test (`skill_advisor.py:53`, `:4211`), and the test pins them. |
| G5-I4-P2-005 | Fixed at cause | `policy-plan.ts:207-221` tries both owner locations and warns with the failing path and error. |
| G5-I4-P2-006 | Fixed at cause | `generation.ts:222-234` re-reads the token and the mtime before deleting, so a lock that gained a token between observations is not removed. |
| G5-I5-P2-001 | Fixed at cause | As G5-I1-P2-005: `heldBy` plus the ambiguity exception. |
| G5-I7-P2-001 | Fixed at cause | `shared-payload.ts:4-9` now states the fork, the absence of a comparing job and the existing drift, which matches the removed watcher found in iteration 7. |

## Traceability Checks

- `spec_code` -- pass. Every fix now matches what its finding asked for, at the cause, in the file the finding names. Evidence: `.skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:4-9` (the contradiction that held this protocol at `partial` from iteration 7 is gone), `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:755-787`, `.skilled/bin/lib/launcher-ipc-bridge.cjs:202-226`, `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:262-313`.
- `checklist_evidence` -- notApplicable. The target is a skill, not a packet with a tasks/checklist contract; nothing in the reviewed change claims checklist closure.

## Integration Evidence

- `.skilled/bin/lib/launcher-ipc-bridge.cjs` is the shared IPC helper required by `runtime/skill-advisor-cli.ts:254` and imported by `.skilled/bin/lib/launcher-session-proxy.cjs:15`; both refuse on a failed ownership check, so the new helper is reachable from every client path in this repository.
- `hooks/lib/skill-advisor-cli-fallback.ts` spawns `bin/skill-advisor.cjs` rather than connecting to the socket itself, so the CLI's refusal covers the hook path; this is the reason the finding closes without a hook-local check.
- `runtime/lib/owned-private-dir.ts` is now the single ownership predicate behind `metrics.ts`, `shadow-sink.ts`, `feedback-calibration.ts` and `hooks/lib/route-receipt.ts:285`; a future change to one writer's rules has to change this module, which is the property the finding asked for.
- `runtime/tests/scorer-predicate-cases.vitest.ts` and `runtime/tests/python/test_skill_advisor.py` both read `tests/fixtures/scorer-predicate-cases.json`, so the TypeScript and Python predicates are pinned by one fixture rather than by two hand-copied literals.

## Edge Cases

- `deleteMissingNodesUnderRoot` calls `realpathSync(scanRoot)` unconditionally, which throws when the root does not exist. Unreachable on the live path: `indexSkillMetadata` returns before the transaction when no skill metadata was discovered (`skill-graph-db.ts:956-977`), and a non-existent root discovers nothing. A permission error on the root would now fail the scan where the old table-wide delete could not, which is a fail-closed change, not a regression.
- The RRF fix recomputes `scoreBySkill` from the per-list contributions instead of reading the fused list's own `rrfScore`, while `rankBySkill` still comes from the fused result. If `fuseRankedLists` applies any channel bonus not expressible as `weight/(K+rank+1)`, the score order could disagree with the rank order. `bonusOverChannels: 'configured'` is passed at `fusion.ts:309` and its implementation lives outside the scorer files read this iteration, so this is recorded as an unresolved risk rather than a finding. What would settle it: one read of the fusion primitive's score construction, or a fixture asserting `rankBySkill` order equals descending `scoreBySkill`.
- `metrics.ts` caches directory readiness in the module-level `dirReady` flag, so a directory replaced after the first successful write is not re-checked for the life of the process. Deliberate, and the per-file `O_NOFOLLOW`/`fstat` check still runs on every append.
- `shadow-sink.ts` tightens a pre-existing loose directory with `chmod 0700` and then re-verifies; a directory owned by this user but actively shared with another process of the same user will be narrowed, which changes that other process's access. Intended by the finding's "only that user may read" rule.
- `rollback.ts` still exists after the dead-code removal. Its exported surface was not re-read line by line this iteration, so the catalog-side deletion is the only evidence that the dead-feature presentation is gone.
- Python `meaningful_token_count` uses `[a-z0-9][a-z0-9_-]*` over a folded prompt while the TypeScript `tokenize`/`meaningfulTokens` pair may segment differently; the shared fixture pins only the listed cases, so an unlisted prompt could count differently. This is the pre-existing fixture-coverage limit, not a new divergence.
- A run that sets `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` to a missing file now breaks the Python fallback at import (the new P2 above) while the TypeScript path degrades inside its own read.

## Confirmed-Clean Surfaces

- The three P1 fixes are closed at the cause, each in the file its finding names, with the call sites that reach them verified.
- Empty-scan preservation plus root-scoped deletion together mean a narrow scan can no longer shrink the published graph, which was the harm in G5-I1-P1-001.
- The private-write rules are centralised in `owned-private-dir.ts` and applied by all four writers, so the "one writer hardened, another not" pattern that produced G5-I6-P1-001 cannot recur silently.
- No added comment carries a finding id, spec path or packet reference; a diff sweep for `G5-I`, `specs/`, `ADR-`, `REQ-` and `CHK-` over the added lines returned nothing.

## Ruled Out

- The P1 fixes are not cosmetic: each removes the reachable path, not just the reported one. The owned-dir module replaces four copies; the IPC check is required by the CLI's bridge contract; the root scope is computed from the scan argument rather than a global.
- The tiny-skill deletion edge (a skill nested inside the scanned root) is the intended semantics of a root-scoped scan, not a regression.
- The `heldBelow`/`heldBy` pair does not double-count the ambiguity exception: `clustersWithTop` returns early on a holder match before the score-gap test, so a held member is never clustered by score.
- `policy-plan.ts`'s two-candidate require list does not mask a load failure: both candidates are tried, and the failure is reported with the last path and message; a module that loads without `GATE_3_QUESTION` legitimately returns `undefined`.
- `generation.ts`'s corrupt-lock reclaim does not introduce a delete-before-read race: the mtime and the token are both re-read immediately before `rmSync`, and a lock that gained a token between observations fails both re-reads.
- `isOwnedPrivateDir` throwing on `ENOENT` is not reachable from the four callers: each calls it after `mkdirSync` on the same path.

## Next Focus

- Dimension: synthesis. The max-iterations stop is reached (8 of 9, with the ninth reserved for the synthesis step in this run's contract).
- Focus area: carry list. Resolved this pass: 19 findings (3 P1, 16 P2). Growing: 1 new P2 (G5-I8-P2-001, the Python import-time data read). Carried: 1 P2 (G5-I2-P2-002, the shadow-sink ignore half).
- Reason: verification is complete and no active P1 remains, so the verdict no longer depends on more reading.
- Rotation status: all four dimensions remain covered; this pass added no new dimension.
- Blocked/productive carry-forward: do not reopen the RRF weighted-sum transform (settled by reading the consumed map), the IPC ownership check, the owned-dir unification, or the parity suites. A future pass could read the fusion primitive that owns `fuseRankedLists`' score construction to settle the rank-versus-score ordering risk, and `rollback.ts`'s surviving exports.
- Required evidence: none for this run.

## Verdict

No active P0 and no active P1 remain. One new P2 was raised and one P2 was carried, so the iteration is a pass with advisories.

Review verdict: PASS
