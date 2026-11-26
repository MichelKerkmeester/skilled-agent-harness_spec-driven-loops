---
title: "Tasks: Phase 14: deep-review"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep review tasks"
  - "phase 14 deep review tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: deep-review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Two shell variables keep the commands short. Export them once from the repository root, then run any `Verify:` command as written:

```bash
P=specs/system-skilled-bots/003-openbot-parity-build; R=$P/014-deep-review/review
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 013 is clean and phases 001 to 013 are committed before the review reads anything (`$P/013-skilled-and-doc-alignment/acceptance-criteria.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P/013-skilled-and-doc-alignment --strict` prints `RESULT: PASSED`, `rg -c '\| Met \| - \|$' $P/013-skilled-and-doc-alignment/acceptance-criteria.md` prints the same number as `rg -c '^\| AC-' $P/013-skilled-and-doc-alignment/acceptance-criteria.md`, and `git status --porcelain` prints nothing. The commit `HEAD` names is recorded in `$R/preflight.json` as `baseCommit`, so the fix pass diffs against a fixed point rather than a moving branch.
- [ ] T002 Capture the runtime suite baseline the fix pass must not regress, recording the `Test Files` and `Tests` counts the run prints into `$R/preflight.json` as `suiteBaseline` with the shape `design/records.md` section 11.3 fixes (`.skilled/skills/system-skilled-bots/runtime/package.json`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0, and `node -e "const p=require('./$R/preflight.json'); console.log(p.suiteBaseline.tests > 0, p.suiteBaseline.testFiles > 0)"` prints `true true`. The task records the number it measured and asserts no number of its own, because a count written before phase 001 landed passes a build that deleted a phase's tests.
- [ ] T003 Probe the five executor binaries and their versions before any lineage spawns, and record which are present in `$R/preflight.json` with the shape `design/records.md` section 11 fixes (`.skilled/commands/assets/local-skilled-alignment/executors.json`). Verify: `node -e "const p=require('./$R/preflight.json'); console.log(p.binaries.length, p.presentCount, p.fallbackUsed)"` prints `5 4 true` on the golden and `5 5 false` on a host with all five, and `node -e "const p=require('./$R/preflight.json'); console.log(p.binaries.filter(b=>b.present).length >= 1)"` prints `true`. At least one binary must be present. An absent one, or one outside the pin its mode names, drops that lineage before spawn and the run re-runs the matrix with `--count=2` on the next executor in `plan.md` §8.3, so T005 still reads five lineages. A host with none refuses `review-no-executor` and writes no lineage folder.
- [ ] T004 Preview the fan-out matrix without spawning a lineage (`$R`). Verify: the `--dry-run` run prints five lineage lines and one `dry_run_halt` line naming `step_fanout_spawn`, and `ls $R 2>/dev/null | wc -l` prints `0`.
- [ ] T019 Build the review scope as a file list and prove it reaches the built code (`$R/fanout-review-scope.txt`). Verify: `rg -c 'runtime/lib/(memory|skills|conversation|channel)\.ts' $R/fanout-review-scope.txt` prints at least `1`, and `wc -l < $R/fanout-review-scope.txt` prints at least `1`. The list is built from `contracts/runtime-architecture.md` section 1 plus `crates/bots-tui/` and `.skilled/bin/bots.cjs`, per `plan.md` §8.4, because a spec-folder walk reaches no module phases 001 to 011 add. A list that holds none of them refuses `review-scope-stale` before any lineage spawns.
- [ ] T017 Read the three review inputs and write one seeded finding per row before any lineage spawns, at the severity `design/records.md` section 7.4 assigns, recording each source with its row count and each missing source with its reason (`$R/seeded-findings.json`). Verify: `node -e "const s=require('./$R/seeded-findings.json'); console.log(s.sources.length, s.seededCount, s.rows.length)"` prints `3 2 2` on the golden, and `node -e "const s=require('./$R/seeded-findings.json'); console.log(s.rows.every(r=>r.source&&r.phase&&r.severity))"` prints `true`. The three inputs are `012-manual-testing-scenarios/scratch/failures.md`, `013-skilled-and-doc-alignment/scratch/rebuttals.md` and `013-skilled-and-doc-alignment/evidence/`. A missing input is recorded in `missingSources` and does not stop the run. A row that exists and cannot be read refuses `review-seed-unreadable`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Run the five-lineage expanded review over the code and docs phases 001 to 013 built (`$R`). Verify: `ls $R/lineages | wc -l` prints `5`.
- [ ] T006 Confirm the run recorded expansive depth and the four canonical dimension ids (`$R/deep-review-config.json`). Verify: `node -e "const c=require('./$R/deep-review-config.json'); console.log(c.antiConvergence.depthMode, c.reviewDimensions.join(','))"` prints `expansive correctness,security,traceability,maintainability`.
- [ ] T007 Confirm the merge kept all five lineages and orphaned none (`$R/orchestration-summary.json`). Verify: `node -e "const s=require('./$R/orchestration-summary.json'); console.log(s.total_cli_lineages, s.orphaned_lineages.length)"` prints `5 0`.
- [ ] T008 Confirm the synthesized report carries its nine core sections and exactly one verdict line (`$R/review-report.md`). Verify: `rg -c '^## (Executive Summary|Planning Trigger|Active Finding Registry|Remediation Workstreams|Spec Seed|Plan Seed|Traceability Status|Deferred Items|Audit Appendix)$' $R/review-report.md` prints `9` and `rg -c '^Review verdict: ' $R/review-report.md` prints `1`.
- [ ] T009 Triage the merged registry into one file group per worker and write the fix ledger with the header `| Finding | File | Fix | Verify | Status |` (`$R/fix-ledger.md`). Verify: `rg -c '^\| Finding \| File \| Fix \| Verify \| Status \|$' $R/fix-ledger.md` prints `1`, and `rg -c '^\| F[0-9]' $R/fix-ledger.md` prints the same number as `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.openFindings.length)"`.
- [ ] T010 Fix every P0 finding, one worker per file group, each fix naming its finding id and its proving command (`$R/fix-ledger.md`). Verify: `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P0)"` prints `0`.
- [ ] T011 Fix every P1 finding, or record its deferral with the reason that blocks it (`$R/fix-ledger.md`). Verify: `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P1)"` prints `0`.
- [ ] T012 Re-run the suite covering each fixed module and mark its ledger row `pass` or `deferred` (`$R/fix-ledger.md`). Verify: `rg -c '^\| F[0-9].*\| (pass|deferred) \|$' $R/fix-ledger.md` prints the same number as `rg -c '^\| F[0-9]' $R/fix-ledger.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the whole runtime suite once, from the final state (`.skilled/skills/system-skilled-bots/runtime/package.json`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and prints at least the `suiteBaseline.tests` count `node -e "const p=require('./$R/preflight.json'); console.log(p.suiteBaseline.tests)"` prints.
- [ ] T018 Re-run every 012 scenario whose owning phase a fix touched, resolving the owning phase from the failure row first and from the category folder second per `design/records.md` section 8.3, and record each result with its evidence path (`$R/scenario-rerun.json`). This is an orchestrator-run plain-shell step with no executor, because the playbook's own rule forbids a scenario run from inside an AI runtime session, where the recursion guard would refuse the runs. Verify: `node -e "const s=require('./$R/scenario-rerun.json'); console.log(s.rerunCount===s.scenarios.length, s.failedCount===s.scenarios.filter(x=>x.result==='FAIL').length)"` prints `true true`, and `node -e "const s=require('./$R/scenario-rerun.json'); console.log(s.scenarios.every(x=>x.result&&x.evidencePath))"` prints `true`. A `FAIL` becomes a new finding with `source` `review` and blocks the close. A `SKIP` whose reason names a missing verb or a missing field makes the verdict `CONDITIONAL` under `design/state-machines.md` section 5, because phases 001 to 011 are closed before the corpus runs. A fix pass that touches no phase owning a scenario records `rerunCount` `0` and still closes.
- [ ] T014 Confirm the fix pass changed no file outside the surfaces the review named (`$R/fix-ledger.md`). Verify: `git status --porcelain | rg -v '^.. (\.skilled/bin/bots\.cjs|\.skilled/skills/system-skilled-bots/|crates/bots-tui/|specs/system-skilled-bots/003-openbot-parity-build/)' | wc -l` prints `0`, and `git diff --stat $(node -e "const p=require('./$R/preflight.json'); console.log(p.baseCommit)") -- . | tail -1` names the recorded base commit rather than a branch tip. The filter covers the crate, the bot template, the skill docs and the playbook, because a P0 in any of them has to be fixable without failing the gate.
- [ ] T015 Validate this packet from its final state (`$P/014-deep-review/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P/014-deep-review --strict` prints `RESULT: PASSED`.
- [ ] T016 Record the review outcome, the finding count by severity and the fix list (`$P/014-deep-review/implementation-summary.md`). Verify: `rg -c 'P0|P1' $P/014-deep-review/implementation-summary.md` prints at least `1`.
<!-- /ANCHOR:phase-3 -->

---

## Waves

A wave is one dispatch round. The hard constraint is the file: no two workers in a wave touch the same file, so a wave's worker count is the number of disjoint file groups its findings fall into, capped by how many fixes one orchestrator can read between waves. A finding that needs a file another worker owns waits for the next wave.

The file groups the fix waves partition by:

| Group | Files |
|---|---|
| A | Contracts and state: `runtime/lib/repo-config.ts`, `definition.ts`, `identity.ts`, `state-root.ts`, `approval.ts`, `run-record.ts`, `switches.ts`, `needs-you.ts`, `actor.ts`, `routine.ts`, `routine-state.ts`, `memory.ts`, `action-kind.ts`, `approval-ladder.ts`, `secrets.ts`, `secret-matcher.ts`, `secrets-guard.ts`, `skills.ts` and their suites |
| B | Schedule: `runtime/lib/cron-translator.ts`, `slot-lister.ts`, `slot-accounting.ts` and their suites |
| C | Runner and dispatch: `runtime/lib/runner.ts`, `dispatch.ts`, `posture.ts`, `result-ledger.ts`, `apps.ts` and their suites |
| D | Isolation and delivery: `runtime/lib/isolation.ts`, `delivery.ts` and their suites |
| E | Request pipeline: `runtime/lib/request-record.ts`, `request-queue.ts`, `request-drain.ts`, `answer.ts`, `skill-proposal.ts`, `conversation.ts` and their suites |
| F | launchd installer: `runtime/lib/installer.ts`, `plist-render.ts`, `label.ts`, `launchctl-print.ts` and their suites |
| G | Status index: `runtime/lib/status-index.ts`, `status.ts`, `better-sqlite3.d.ts`, `activity.ts` and their suites |
| H | Channels: `runtime/lib/channel.ts`, `channel-link.ts`, `channel-approval.ts`, `channel-queue.ts`, `channel-telegram.ts`, `channel-slack.ts`, `channel-signal.ts`, `channel-whatsapp.ts`, `channel-terminal.ts` and their suites |
| I | The CLI and the checker: `.skilled/bin/bots.cjs`, `scripts/bot-check.cjs`, `cli-run.vitest.ts`, `bot-check.vitest.ts` |
| J | The crate: `crates/bots-tui/` |
| K | The bot template and the skill docs: `.skilled/skills/system-skilled-bots/assets/bot-template.txt`, `SKILL.md`, `README.md`, `runtime/lib/README.md` and the four mode folders |
| L | The playbook: `.skilled/skills/system-skilled-bots/manual-testing-playbook/` |
| M | The packet contracts: `$P/contracts/` |
| N | The phase docs: `$P/0[01][0-9]-*/` |

Groups A to H are `contracts/runtime-architecture.md` section 1.1's own groups, so a finding lands in the group the architecture already puts its module in and no builder chooses a partition. Groups J to N are the surfaces the review reads that are not a runtime module: the crate phase 003 builds, the template and the skill docs, the playbook 012 extends, the packet contracts and the phase documents.

A contract-changing fix is one worker across group M, the golden under `contracts/fixtures/`, the code group and the owning phase document, because a contract that moves under three of the four leaves the fourth describing a shape nobody has. That worker is the one exception to the one-file-per-worker rule, and the ledger records one row per file it changed.

### Wave 0 - Preflight

| Field | Value |
|---|---|
| Task ids | T001, T002, T003, T004, T017, T019 |
| Executor | None. The orchestrator runs the probes, the seeded intake and the preview itself |
| Model | Not applicable |
| Effort | Not applicable |
| Parallel workers | 0 |
| Orchestrator verify | `node -e "const p=require('./$R/preflight.json'); console.log(p.binaries.length, p.presentCount)"` prints `5` and at least `1`, `node -e "const p=require('./$R/preflight.json'); console.log(p.suiteBaseline.tests > 0, p.baseCommit.length > 0)"` prints `true true`, `rg -c 'runtime/lib/(memory|skills|conversation|channel)\.ts' $R/fanout-review-scope.txt` prints at least `1`, `node -e "const s=require('./$R/seeded-findings.json'); console.log(s.seededCount===s.rows.length)"` prints `true`, the `--dry-run` preview prints five lineage commands and halts at `step_fanout_spawn`, and `ls $R/lineages 2>/dev/null \| wc -l` prints `0` |
| Fallback order | None needed. A binary that fails its probe drops its lineage before spawn, and Wave 1 re-runs the matrix with `--count=2` on the next executor in the order Wave 1 names. A host with no binary at all refuses `review-no-executor` and stops here |

### Wave 1 - Review fan-out

| Field | Value |
|---|---|
| Task ids | T005, T006, T007 |
| Executor | All five, one lineage each: `cli-mistral-vibe`, `cli-pi`, `cli-opencode`, `cli-devin`, `cli-codex` |
| Model | `deepseek-flash`, `deepseek-v4.1-flash-1017`, `opencode-go/deepseek-v4.1-flash`, `deepseek-v4-1-flash-max`, `gpt-6-luna` |
| Effort | `max` on the four DeepSeek lineages, `xhigh` on `gpt-6-luna` with `service_tier="fast"` |
| Parallel workers | 5, one per lineage. Each lineage writes only `$R/lineages/<label>/`, so no two workers share a file |
| Orchestrator verify | `node -e "const s=require('./$R/orchestration-summary.json'); console.log(s.total_cli_lineages, s.orphaned_lineages.length)"` prints `5 0`, and `node -e "const c=require('./$R/deep-review-config.json'); console.log(c.antiConvergence.depthMode)"` prints `expansive` |
| Fallback order | `pi` then `opencode` then `vibe` then `devin` then `codex`. A dropped lineage is replaced by `--count=2` on the next executor in that order, so the fan-out keeps five lineages and five independent reads |

### Wave 2 - Synthesis and triage

| Field | Value |
|---|---|
| Task ids | T008, T009 |
| Executor | None. The loop's synthesis step and the orchestrator own this wave |
| Model | Not applicable |
| Effort | Not applicable |
| Parallel workers | 0 |
| Orchestrator verify | `rg -c '^## (Executive Summary\|Planning Trigger\|Active Finding Registry\|Remediation Workstreams\|Spec Seed\|Plan Seed\|Traceability Status\|Deferred Items\|Audit Appendix)$' $R/review-report.md` prints `9`, `rg -c '^Review verdict: ' $R/review-report.md` prints `1`, and every row in `$R/fix-ledger.md` names a finding id, a file and a verify command |
| Fallback order | None. A report missing a section or a verdict line is a synthesis failure, so the run resumes with `--lineage-mode=resume` rather than dispatching a worker |

### Wave 3 - P0 fixes

| Field | Value |
|---|---|
| Task ids | T010, T012. T012 re-runs each fixed module's suite before Wave 4 starts, so no unverified fix stacks under the next wave |
| Executor | `cli-pi` |
| Model | `deepseek-v4.1-flash-1017` (provider `llmgateway`) |
| Effort | `max`, because a P0 fix reconciles two contracts and is the design case, not the mechanical one |
| Parallel workers | At most 3, one per disjoint file group from the table above. A P0 that needs a file another worker owns waits for Wave 4 |
| Orchestrator verify | `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P0)"` prints `0`, and each fix row in `$R/fix-ledger.md` carries the command whose output proved it |
| Fallback order | `pi` then `opencode` then `vibe` then `devin` then `codex`. A P0 that two DeepSeek attempts failed goes to `codex` at `gpt-6-luna` `xhigh` `fast`, which is the hardest-task tier and the last fallback |

### Wave 4 - P1 fixes

| Field | Value |
|---|---|
| Task ids | T011, T012 |
| Executor | `cli-pi` |
| Model | `deepseek-v4.1-flash-1017` (provider `llmgateway`) |
| Effort | `high` for a mechanical fix such as a one-line doc correction or a test that mirrors an existing one. `max` for a fix that crosses modules or touches a shared record |
| Parallel workers | At most 4, one per disjoint file group. Group G is one worker, because every doc fix is a line edit and two workers on one doc would collide |
| Orchestrator verify | `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P1)"` prints `0`, and every deferred P1 names its finding id and the reason that blocks it |
| Fallback order | `pi` then `opencode` then `vibe` then `devin` then `codex`, at the same effort tier. A P1 that no DeepSeek route can fix is recorded as deferred rather than escalated to `codex`, because `codex` is reserved for a P0 |

### Wave 5 - Verification

| Field | Value |
|---|---|
| Task ids | T013, T014, T015, T016, T018 |
| Executor | None for the gates, and none for T018, which is an orchestrator-run plain-shell step because the playbook forbids a scenario run from inside an AI runtime session. One `cli-codex` worker only if a residual finding needs the hardest tier |
| Model | `gpt-6-luna` for that one worker, and no model for the gates |
| Effort | `xhigh` with `service_tier="fast"` for that one worker |
| Parallel workers | 0 for the gates, 1 for a residual fix. The gates run in sequence because each reads the state the one before it left, and T018 runs after T013 because a scenario re-run on a suite that does not pass proves nothing |
| Orchestrator verify | `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 with at least the `suiteBaseline.tests` count `preflight.json` recorded, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P/014-deep-review --strict` prints `RESULT: PASSED`, the scoped-diff check in T014 prints `0`, and `node -e "const s=require('./$R/scenario-rerun.json'); console.log(s.failedCount)"` prints `0` |
| Fallback order | `codex` is already last, so a residual finding it cannot fix is recorded as deferred with the reason, and the packet closes on a CONDITIONAL verdict rather than a false PASS |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$R/review-report.md` carries one verdict line and the merged registry holds zero active P0 and zero active P1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, and §8 for the executor roster, the effort policy and the fallback order
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the finding id that blocks it. A P0 blocks the close outright. A P1 needs a recorded deferral naming its finding id and the reason.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' $P/014-deep-review/spec.md` prints `12`.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -c '^## 8\. External orchestration' $P/014-deep-review/plan.md` prints `1`.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `node -e "const p=require('./$R/preflight.json'); console.log(p.binaries.length, p.binaries.filter(b=>b.present).length >= 1)"` prints `5 true`, because at least one of the five binaries must be present and the fallback covers the rest.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime typechecks. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] CHK-011 [P0] No fix leaves a console error or an unhandled rejection in a suite. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0.
- [ ] CHK-012 [P1] Every fixed defect has a regression test that fails without the fix. Verify: `rg -c 'regression' $R/fix-ledger.md` prints at least `1`.
- [ ] CHK-013 [P1] Every fix follows the module's existing refusal-with-a-named-reason pattern rather than throwing. Verify: `rg -n 'throw new Error' .skilled/skills/system-skilled-bots/runtime/lib` prints no line a fix added.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \| - \|$' $P/014-deep-review/acceptance-criteria.md` prints `12`, which is one `Met` row per criterion. It prints `0` today, because no row is observed passing yet.
- [ ] CHK-021 [P0] The whole runtime suite passes from the final state. Verify: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and prints at least the `suiteBaseline.tests` count `node -e "const p=require('./$R/preflight.json'); console.log(p.suiteBaseline.tests)"` prints.
- [ ] CHK-022 [P1] The post-commit hook harness still passes. Verify: `bash .skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh` exits 0.
- [ ] CHK-023 [P1] Every deferred finding names its reason. Verify: `rg -c '\| deferred \|$' $R/fix-ledger.md` prints the same number as `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.openFindings.filter(f=>f.status==='deferred').length)"`. The pattern anchors on the Status cell, because the word also appears in the ledger's own intro and in a `Fix` cell that carries a reason.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Verify: `rg -n '<field|string|helper|literal|error-pattern>' .skilled/skills/system-skilled-bots/runtime/lib` was run and its hits are listed in the ledger.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Verify: `rg -n '<changedSymbol>' .skilled --glob '*.ts' --glob '*.cjs' --glob '*.md'` was run and its hits are listed in the ledger.
- [ ] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -c '^\| (A|B|C|D|E|F|G|H|I|J|K|L|M|N) \|' $P/014-deep-review/tasks.md` prints `14`, which is one row per file group the fix waves partition by.
- [ ] CHK-FIX-006 [P1] Hostile env and global-state variants were executed when a fix reads process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range. Verify: `rg -n '^Reviewed commit: ' $R/review-report.md` prints one line.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret in a fix or in a review artifact. Verify: `rg -n 'sk-[A-Za-z0-9]{20,}|xox[baprs]-' $R .skilled/skills/system-skilled-bots/runtime/lib` prints no line.
- [ ] CHK-031 [P0] Every security finding is fixed or deferred with a reason, never silently dropped. Verify: `node -e "const r=require('./$R/deep-review-findings-registry.json'); console.log(r.openFindings.filter(f=>f.dimension==='security').length)"` prints `0`.
- [ ] CHK-032 [P1] A review lineage ran read-only, so the review could not edit the surface it audited. Verify: `node -e "const s=require('./$R/orchestration-summary.json'); console.log(s.lineages.every(l=>l.sandboxMode!=='danger-full-access'))"` prints `true`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on the requirement ids. Verify: `rg -o 'REQ-0[0-9][0-9]' $P/014-deep-review/spec.md $P/014-deep-review/acceptance-criteria.md | sort -u | wc -l` prints `24`, which is twelve requirement ids named in each of the two files.
- [ ] CHK-041 [P1] Every doc line a docs-truth finding named is corrected. Verify: `rg -c 'docs-truth' $R/fix-ledger.md` prints at least `1`.
- [ ] CHK-042 [P2] The skill README and the runtime README still describe the modules a fix changed. Verify: `rg -n '<changedModule>' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints one line per changed module.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `$P/014-deep-review/scratch/` only. Verify: `ls $P/014-deep-review/scratch | rg -v '^\.gitkeep$' | wc -l` prints `0`.
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion. Verify: `ls -A $P/014-deep-review/scratch` prints `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---


