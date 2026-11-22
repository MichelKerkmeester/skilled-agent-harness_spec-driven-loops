# Deep Review Report - Packet 056 worktree-goal-carry (fan-out root)

Two lineages, five iterations each: `vibe` (cli-mistral-vibe, deepseek-flash) and `claude2` (cli-claude-code, claude-opus-5-5, effort medium). Stop policy `max-iterations`; both lineages stopped at `maxIterationsReached` (5 of 5). The per-lineage reports are `lineages/vibe/review-report.md` and `lineages/claude2/review-report.md`.

## 1. Executive Summary

- **Overall verdict: FAIL.** No P0. The verdict comes from two required gates that fail at the terminal stop, `coverage` and `scope`, not from finding severity.
- **hasAdvisories**: false (advisories are reported only on PASS).
- **P0/P1/P2: 0 / 1 / 15.** These are the counts the verdict used, bound from `fanout-merge.cjs` (lineage registries vibe 0/1/6 plus claude2 0/0/9; all 16 entries survived the merge although both lineages are marked untrusted, `runner_failed:exit`). The merge does not collapse cross-lineage duplicates when `contentHash` is null, so the 16 entries describe 12 distinct issues (grouped in section 3).
- **How the gates were computed.** Neither lineage appended the `deep_review.terminal_gates_recorded` row that `record_terminal_gates` requires before synthesis: neither lineage log shows a `terminal-gates.cjs` call or a gateway refusal, so the step was skipped, not refused. `fanout-run.cjs` therefore marked both lineages failed ("the state log holds no terminal stop row") and `fanout-merge.cjs` bound `failed_required_gate_ids: []`. The orchestrator ran `terminal-gates.cjs` read-only on each lineage's own config, registry and state log: vibe fails `scope` (findings-out-of-scope) and `coverage` (traceability-incomplete); claude2 passes `scope` and fails `coverage` (traceability-incomplete). The union `["coverage","scope"]` was passed to `review-verdict.cjs`, which returned FAIL. claude2's own PASS skipped this step.
- **Coverage gate cause.** `coverage` fails because `traceability.summary.gatingFailures` is 2 in both lineages: the hard protocols `spec_code` and `checklist_evidence` are both `partial`. Part of `checklist_evidence` is a limit of the review setup, not of the packet: the lineages could not rerun the suites or `validate.sh` inside containment, so the packet's test-count and RESULT claims were unverifiable. A re-review stays red on this gate until the remediation evidence is recorded in the packet docs where a reviewer can cite it.
- **Scope gate cause.** vibe's R3-P2-002--faaae6c19fc7 cites `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md:98`, a file outside the 14-file review scope.
- **Self-check outcomes (fan-out root: pairs recorded for reference, counts unchanged):** `R1-P1-001 P1` confirmed. The code at `relaunch-core.cjs:905-920` reads only the last `GOAL_LOG_MAX_TAIL_BYTES` (16 MiB), while `latestGoalLogEntry` at `:731-757` widens and then head-scans the whole log. The lineages disagreed on severity (vibe P1, claude2 P2 under R4-P2-001 and R1-P2-001--3dad17829f8e). The Referee kept P1: losing the goal is the failure this packet exists to prevent, even though the miss fails closed with an explicit reason and later hops are covered by `goal_root`.
- **Review scope summary:** the uncommitted diff in `relaunch-core.cjs`, `session-handover.cjs`, `.skilled/bin/skilled-loop`, the three test files, `goal-carry-over.md` and `troubleshooting.md`, checked against packet 056's spec, plan, tasks, implementation-summary and goal, plus the parent 002 spec.
- **Operator review focus:** The uncommitted goal carry-over change for worktree-only packets, shown by git diff in this worktree: relaunch-core.cjs, session-handover.cjs, .skilled/bin/skilled-loop, their three test files, goal-carry-over.md and troubleshooting.md. Check the code against packet 056's spec, tasks and implementation-summary claims, and check that a goal set in a packet that exists only in a worktree is carried across a hop and never lost or misrouted.
- **Focus answer:** the plain case works on every hop. Four narrower cases lose or misroute the goal: a worktree named only before the 16 MiB log tail (P1), a primary copy appearing between hops, a second log-mentioned worktree outvoting the claimed root, and a stale prunable worktree entry trusted as a root.

## 2. Planning Trigger

`/speckit:plan` is not required as a separate packet: the work is a remediation pass inside packet 056 (one P1 code fix, four P2 code fixes, doc corrections). It is done in place under this packet.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 1, "P2": 15, "distinctIssues": 12 },
  "failedRequiredGateIds": ["coverage", "scope"],
  "remediationWorkstreams": [
    "WS-1 one log read for the worktree search (R1-P1-001, R4-P2-001, R1-P2-001--3dad17829f8e)",
    "WS-2 claimed-root precedence (R1-P2-002, R5-P2-001)",
    "WS-3 trust only live worktree entries (R2-P2-001--6b837fba703d; R2-P2-001--fce084875d07 accepted residual)",
    "WS-4 refusal count and result shape (R1-P2-001--904fe20e2c53, R4-P2-002--ca40399c5041)",
    "WS-5 doc and spec alignment (R3-P2-001--76d877ea112f, R3-P2-003--729bc6ee0606, R3-P2-003--855e61a5717f, R3-P2-002--59ef32cc9487, R3-P2-001--66ed77365be9, R3-P2-002--faaae6c19fc7)",
    "WS-6 test robustness (R4-P2-002--4e56a93b2d0f)"
  ],
  "specSeed": [
    "The worktree search reads the same log bytes the goal reader reads",
    "A later hop keeps the claimed note's goal_root ahead of primary copies and other log-mentioned worktrees",
    "A worktree entry git marks prunable is not a trusted root",
    "Correct the tampered-root Handoff Criteria sentence and the three-versus-five CLI test count"
  ],
  "planSeed": [
    "Replace logTailText with a whole-log scan that reuses readLogTail",
    "Prefer the claimed root's match in claudeGoalPacketResult and worktreeHeadlinePackets",
    "Skip prunable porcelain entries",
    "Count every match in the refusal message; return root on every resolveGoalPacketResult path",
    "Replace the claim-line regex with a substring check",
    "Update troubleshooting.md, the feature catalog entry, spec.md and tasks.md"
  ],
  "findingClasses": "UNKNOWN",
  "affectedSurfacesSeed": [
    ".skilled/hooks/session-handover/lib/relaunch-core.cjs",
    ".skilled/hooks/session-handover/bin/session-handover.cjs",
    ".skilled/hooks/session-handover/tests/session-handover-cli.test.cjs",
    ".skilled/hooks/session-handover/troubleshooting.md",
    ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md",
    "specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md",
    "specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/tasks.md"
  ],
  "fixCompletenessRequired": true
}
```

`findingClasses` is UNKNOWN: the merged registry carries `findingClass: null` for every entry.

## 3. Active Finding Registry

Grouped by distinct issue. Every registry entry is listed; lineage in brackets.

| # | IDs | Sev | Dimension | File:line | Issue | Fix |
|---|-----|-----|-----------|-----------|-------|-----|
| 1 | R1-P1-001 [vibe], R4-P2-001 [claude2], R1-P2-001--3dad17829f8e [claude2] | P1 | correctness | relaunch-core.cjs:905-920 | `logTailText` duplicates `readLogTail` and reads only the last 16 MiB; the goal reader head-scans the whole log. A worktree named only before the tail is never searched, and the hop refuses with `the active goal names no packet this hand-over can find` | One read: reuse `readLogTail` and scan the whole log for the worktree paths |
| 2 | R1-P2-002 [claude2] | P2 | correctness | relaunch-core.cjs:888 | The primary-checkout headline search runs before the claimed `goal_root`, so a same-headline primary copy wins on a later hop | Try the claimed root first |
| 3 | R5-P2-001 [claude2] | P2 | correctness | relaunch-core.cjs:958 | A second log-mentioned worktree outvotes the claimed root and the hop refuses | Return the claimed root's match when it is unique in that root |
| 4 | R2-P2-001--6b837fba703d [claude2] | P2 | security | relaunch-core.cjs:533 | `prunable` porcelain lines are ignored, so a stale worktree path is trusted | Drop prunable entries |
| 5 | R2-P2-001--fce084875d07 [vibe] | P2 | security | relaunch-core.cjs:547 | The trust base is any git-listed worktree and the log signal is model-influenced; accepted as residual risk by spec.md | None required; keep visible |
| 6 | R1-P2-001--904fe20e2c53 [vibe] | P2 | correctness | relaunch-core.cjs:954 | The refusal always says 2 packets because collection stops at two | Count every match |
| 7 | R4-P2-002--ca40399c5041 [vibe] | P2 | maintainability | relaunch-core.cjs:1436 | `resolveGoalPacketResult` returns `root` only on the worktree path | Return `root` on every path |
| 8 | R4-P2-002--4e56a93b2d0f [claude2] | P2 | maintainability | session-handover-cli.test.cjs:4019 | A regex is built from an unescaped temp path | Use a substring check |
| 9 | R3-P2-001--76d877ea112f [claude2] | P2 | traceability | 056 spec.md:33 | Handoff Criteria says the tampered-root test passes on the old code; it fails there | Rewrite the sentence |
| 10 | R3-P2-003--729bc6ee0606 [claude2], R3-P2-003--855e61a5717f [vibe] | P2 | traceability | 056 spec.md:89, :110 | Spec and tasks lack the three behaviors added after the second-account review and say three CLI tests where five ship | Add REQ rows; correct the count |
| 11 | R3-P2-002--59ef32cc9487 [claude2], R3-P2-001--66ed77365be9 [vibe] | P2 | traceability | troubleshooting.md:54 | Says a worktree goal is carried only when the log names the worktree; the claimed note's `goal_root` also carries it | Name both signals |
| 12 | R3-P2-002--faaae6c19fc7 [vibe, out of scope] | P2 | traceability | feature-catalog/context-preservation/session-handover-loop.md:98 | The catalog omits `goal_root` and the worktree search | Add both |

Evidence, impact and case lines for every entry are in the lineage iteration files (`lineages/*/iterations/`).

## 4. Remediation Workstreams

- **P0:** none.
- **P1:** WS-1 (issue 1).
- **P2 advisories:** WS-2 (issues 2, 3), WS-3 (issue 4; issue 5 accepted), WS-4 (issues 6, 7), WS-5 (issues 9 to 12), WS-6 (issue 8).

## 5. Spec Seed

- REQ: the worktree search sees every log byte the goal reader sees.
- REQ: a later hop keeps the claimed note's `goal_root` while it still holds the packet with the headline, ahead of primary copies and other log-mentioned worktrees.
- REQ: a worktree entry git marks prunable is not a trusted root.
- Correct the Handoff Criteria tampered-root sentence and the CLI test count.

## 6. Plan Seed

See `planSeed` in the Planning Packet. Each code fix carries one regression test that fails on the current code.

## 7. Traceability Status

### Core Protocols

| Protocol | vibe | claude2 | Drift |
|----------|------|---------|-------|
| `spec_code` (hard) | partial | partial | Bounded log read narrows REQ-001 (issue 1); claimed-root case unaddressed by D3 (issue 3); stale test-count prose (issue 10) |
| `checklist_evidence` (hard) | partial | partial | T003/T004 verify text stale; T005, T010 and the `validate.sh --strict` criterion unverifiable inside lineage containment |

**AC_COVERAGE**: exempt (Level 1 packet, no acceptance-criteria.md).

### Overlay Protocols

`feature_catalog_code` fail (vibe, issue 12; advisory gate class), `playbook_capability` partial (vibe, no worktree-only case, deferred), `skill_agent` and `agent_cross_runtime` notApplicable.

## 8. Deferred Items

- `session-handover-claude.md:758` (manual testing playbook) has no worktree-only case.
- A worktree removed between hops drops the goal at consume with no warning line (claude2 iteration 5).
- Porcelain is read without `-z`, so a path holding a newline would mis-split (theoretical).
- No registry carries a `frontier` object, so there are no follow-up review nodes.

### Workflow defect (outside this packet)

Both lineages, run by unrelated models, skipped `record_terminal_gates` in the shared `/deep:review` workflow, so a completed 5+5 run reports as two failed lineages and the merge binds no failed gates. A verdict taken from the merge output alone would have read CONDITIONAL instead of FAIL. Reported to the operator; not fixed here.

## Dimension Expansion Map

No saturated directions, pivots, overrides or council artifacts in either lineage. Both lineages covered correctness, security, traceability and maintainability, then a cross-dimension pass in iteration 5. Remaining frontier: none.

## 9. Search Ledger

`searchDebt` 0 in both lineages; no required bug classes, candidate coverage or clean-search proof were configured.

*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix

- **Convergence:** vibe newFindingsRatio 1.00, 0.14, 0.30, 0.13, 0.00 (convergenceScore 1); claude2 1.0, 0.33, 0.5, 0.25, 0.1 (convergenceScore 0.9). Stop reason `maxIterationsReached` in both. The workflow's fan-out stop-reason rule reads only succeeded lineages and would fall back to `converged`; neither lineage succeeded, so the closeout records `maxIterationsReached` from both registries' `terminalStop` instead.
- **Coverage:** 4 of 4 dimensions in both lineages (dimension coverage 1).
- **Cost:** claude2 USD 5.09; vibe unknown.
- **Ruled out (both lineages):** a Claude hook binding `SESSION_HANDOVER_GOAL_PACKET`, off-by-one in uniqueness, `GIT_CONFIG_*` redirection, shell or option injection through `goal_root`, an unquoted `goal_root` in frontmatter, hop-2 loss without a log mention, a missing parent spec row.
- **Core Protocols:** `spec_code` partial, `checklist_evidence` partial.
- **Overlay Protocols:** `feature_catalog_code` fail, `playbook_capability` partial, `skill_agent` notApplicable, `agent_cross_runtime` notApplicable.
- **Integrity:** the worktree's tracked diff, status and packet file hashes outside `review/` match the pre-run baseline.

## 11. Remediation Outcome (after the review)

The verdict above is the review's and stays FAIL; this section records what was done with it afterwards, without a re-review.

- **Fixed:** issue 1 (whole-log chunked scan replaces `logTailText`), issues 2 and 3 (the claimed note's `goal_root` is asked first), issue 4 (`prunable` porcelain blocks skipped), issue 6 (both refusals read `the active goal headline appears in more than one packet`), issue 8 (substring check), issues 9 to 12 (spec, tasks, `troubleshooting.md`, `goal-carry-over.md`, feature catalog entry).
- **Declined:** issue 7. `root` is a documented optional key, and a uniform shape would change seven `deepEqual` assertions, the OpenCode plugin test among them, for no change in behavior.
- **Accepted residual:** issue 5, recorded in the packet's risk table.
- **Evidence:** `scratch/remediation-red.txt` (pass 2, fail 5 on the code before the fixes) and `scratch/remediation-green.txt` (pass 7); node suite 1077 of 1077, OpenCode plugin 75 of 75, hooks vitest 509 of 509. Details are in the packet's `implementation-summary.md`.

Review verdict: FAIL
