# Iteration 003 — Continuity Routing and the Goal Budget

## Focus

Key questions 4 and 5: whether continuity save/resume routes content where the v4.0.0.13, v4.0.0.14 and v4.0.1.0 notes say it does, and whether the v4.0.0.2 goal system behaves as documented, including where the 4,000-character durable-slice budget is enforced and whether frontmatter is stripped.

## Actions Taken

- Read the goal writer and its shared slice module: `.skilled/hooks/goal/bin/goal.cjs` (router, bind, packet), `.skilled/hooks/goal/lib/goal-core.cjs` (constants, packet projection), `.skilled/hooks/goal/lib/goal-slice.cjs` (frontmatter split, durable slice, chat slice, budget lookup).
- Read the read-only goal checker `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` and its template budget contract `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`.
- Read the continuity routers `.skilled/commands/speckit/save.md`, `.skilled/commands/speckit/resume.md` and `.skilled/commands/speckit/handoff.md`, plus the resume workflow assets `speckit-resume-auto.yaml` and `speckit-resume-confirm.yaml`.
- Read the writer source `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts`, the implementation in `runtime/cli/core/workflow.ts`, the input normalizer, and the continuity save tests.
- Ran the read-only corpus check `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all` (1263 goals, 633 findings, one read error, exit 2).

## Findings

### F1 — `check-goal.cjs --all` returns success when it has findings

- **Type:** bug
- **Severity:** P1
- **Release:** v4.0.0.2
- **Confidence:** high
- **Evidence:** the corpus branch returns `report.errors.length === 0 ? 0 : 2` and never reads `report.findings` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:703]. The per-packet branch does gate on findings with `result.passed ? 0 : 1` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:715]. The corpus report carries findings separately [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:466].
- **Repro run:** `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all` printed `goals_scanned=1263`, `missing-binding-row_findings=472`, `placeholder_findings=121`, `criteria-count_findings=40`, and one broken-fence error, then `EXIT=2`. The exit 2 came from the single read error; the same 633 findings with no read error would return 0. This is a false green for any CI gate that uses `--all`.
- **Verify:** remove or repair the one `broken-fence/goal.md` named in the error, rerun the command, and observe exit 0 with the same findings.

### F2 — The corpus scan treats review-lineage baselines as active goals

- **Type:** UX
- **Severity:** P2
- **Release:** v4.0.0.2
- **Confidence:** high
- **Evidence:** `walkGoalFiles` excludes only `z_archive` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:456]. The run's 472 missing-binding-row findings include repeated paths under `specs/**/review/lineages/**/containment/baseline/specs/...` and `review-archive/**`, which are frozen copies of packets, not active work.
- **Impact:** the `--all` count is dominated by duplicates, so an operator cannot read it as a work queue.
- **Verify:** `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all | rg 'review/lineages|review-archive' | wc -l`.

### F3 — “Past 4,000 fails” is not true at bind or packet time

- **Type:** drift
- **Severity:** P2
- **Release:** v4.0.0.2
- **Confidence:** high
- **Evidence:** the release note says “up to 4,000 characters passes and past it fails” [SOURCE: .skilled/changelog/skilled/v4.0.0.2.md:110]. `goal.cjs bind` only appends a warning when `packet_budget=over` and still prints `STATUS=OK` [SOURCE: .skilled/hooks/goal/bin/goal.cjs:169]. `goal.cjs packet` prints `chat_slice` and exits 0 regardless of `packet_budget` [SOURCE: .skilled/hooks/goal/bin/goal.cjs:211]. The only hard failure is the per-packet `check-goal` path, whose `parent-budget` finding drives exit 1 [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:345] [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:715].
- **Impact:** the send rule (“send only at packet_budget=ok”) is prose in the AGENTS goal-posture rule and in `renderResendReminderText` [SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:241], not a writer refusal. A caller that reads only the envelope can bind and paste an over-budget goal.
- **Verify:** bind a packet whose durable slice exceeds 4,000 characters; observe `STATUS=OK` plus `warning=...`, then run `packet` and observe exit 0.

### F4 — `goal.cjs packet` emits `chat_slice` even when over budget

- **Type:** extension
- **Severity:** P2
- **Release:** v4.0.0.2
- **Confidence:** high
- **Evidence:** `runPacket` prints `packet_budget` [SOURCE: .skilled/hooks/goal/bin/goal.cjs:215] and then `chat_slice` [SOURCE: .skilled/hooks/goal/bin/goal.cjs:218] with no branch on `budgetState`. The budget state itself is computed in `budgetState` [SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:428] from the manifest limit [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24].
- **Extension:** when `packet_budget=over`, omit `chat_slice` (or exit 2) so the safe path is the only path. This closes the gap F3 describes without changing the budget.
- **Verify:** run `packet` against an over-budget packet and inspect whether `chat_slice` is present and the exit status is 0.

### F5 — `packet` resolves a repo-relative path against the caller's directory

- **Type:** UX
- **Severity:** P2
- **Release:** v4.0.0.2
- **Confidence:** high
- **Evidence:** `goalOptions` defaults `workspace` to `process.cwd()` [SOURCE: .skilled/hooks/goal/bin/goal.cjs:74], and `packet` is in `actionsWithoutScope`, so the `MISSING_WORKSPACE` guard is skipped [SOURCE: .skilled/hooks/goal/bin/goal.cjs:406]. The packet path is then resolved against that workspace.
- **Impact:** running the documented send-rule command from a subdirectory (for example `specs/`) returns `PACKET_GOAL_NOT_FOUND` unless the caller adds `--workspace <repo root>`, which the goal-posture rule does not mention.
- **Verify:** from `specs/`, run `node ../.skilled/hooks/goal/bin/goal.cjs packet system-speckit/047-v4-release-line-research/001-spec-kit-core`; rerun with `--workspace ..` and compare.

## Questions Answered

### Q4 — Continuity save/resume routing

Yes for the paths the notes name. The handoff command saves the bound packet before writing the note and invokes the continuity writer for non-Claude runtimes [SOURCE: .skilled/commands/speckit/handoff.md:42] [SOURCE: .skilled/commands/speckit/handoff.md:82], matching v4.0.0.13's “saves continuity and ends itself” [SOURCE: .skilled/changelog/skilled/v4.0.0.13.md:53] and v4.0.0.14's opt-in handover framing [SOURCE: .skilled/changelog/skilled/v4.0.0.14.md:32]. The writer mints the writer-owned `session_ref` from `--session-id` and `--runtime` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:90] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:416], ignores a payload-supplied copy [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:1979], and writes `operatorDecisions` into `decision-record.md` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:194] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:696], matching v4.0.1.0's decision capture [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:114]. `/speckit:save` states the same split: every mode refreshes metadata, only `--full-auto` writes continuity and operator decisions [SOURCE: .skilled/commands/speckit/save.md:21] [SOURCE: .skilled/commands/speckit/save.md:26]. The save tests exercise the pointer, the ignored payload copy and the decision rows [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts:474].

`/speckit:resume` itself is a thin router [SOURCE: .skilled/commands/speckit/resume.md:13]; the auto workflow walks handover, then `_memory.continuity`, then supporting spec docs [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:105], and runs the trigger-index lookup with exit 0 = hits, 1 = clean no-hit, 2+ = error [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:75].

### Q5 — Goal system behavior and budget enforcement

The limit is one number, 4,000, declared in the template contract [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24], read by `resolveGoalBudget` [SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:314], and measured on the durable slice only [SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:466]. Frontmatter is stripped before measurement: `splitFrontmatter` returns the body after the closing fence [SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:58], and the chat copy removes comments, anchors, dividers and section numbers [SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:91]. The phase-child exemption matches the note: a phase child that is not itself a parent is unbounded [SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:424].

Enforcement is split, not singular. `check-goal` per packet returns exit 1 on a `parent-budget` finding [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:345] [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:715]; `goal.cjs bind` warns but succeeds [SOURCE: .skilled/hooks/goal/bin/goal.cjs:169]; `goal.cjs packet` reports `packet_budget` and still emits the slice [SOURCE: .skilled/hooks/goal/bin/goal.cjs:215]. The 4,000-character “fail” is therefore a checker result, not a writer refusal, and the send rule is prose.

## Questions Remaining

- Q3 residual: whether the trigger index should expose a freshness signal, and whether `retrieval-conventions.md` should carry the `--check` contract. The resume workflow runs the lookup without a freshness gate [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:75], so a stale index can still return hits; this is recorded as a residual, not a new finding, because it may overlap the Q3 work.
- Q4 residual: v4.0.2.0 says “if anything is missing or stale, the lookup section is left out” [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:98]; the resume YAML handles no-hit and error exits but does not gate on staleness before running the lookup.
- Q5 residual: whether bind and packet should refuse an over-budget goal, or whether the current warn-and-report split is the intended contract.
- Q6–Q12 remain: upgrade preview/rollback, `create.sh` and level templates, v4.0.0.13–v4.0.2.0 doc drift, dead scripts, operator friction, sk-code/sk-doc conformance, and concrete extensions.

## Next Focus

Q6: read `/doctor:update` check, align, apply and rollback end to end, run only in check/preview/dry-run modes, and identify which step has no test. Q7: run `create.sh` for each level and template, then `validate.sh --strict`, and record every hand edit a generated packet needs.

## SCOPE VIOLATIONS

None. All reads were read-only; the only write targets are this narrative, the delta file and the gateway record.
