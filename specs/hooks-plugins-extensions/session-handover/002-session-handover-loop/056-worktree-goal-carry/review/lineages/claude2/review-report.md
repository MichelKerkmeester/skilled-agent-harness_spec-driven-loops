# Deep Review Report - Packet 056 worktree-goal-carry (lineage claude2)

## 1. Executive Summary
- Overall verdict: PASS
- hasAdvisories: true
- P0/P1/P2 counts: 0, 0, 9. These are the active counts the verdict used, from deep-review-findings-registry.json.
- Self-check outcomes: no P0 or P1 candidate was raised, so the Hunter/Skeptic/Referee pass did not run. One refinement: R3-P2-003's case line was corrected in iteration 4 (the T003 pattern matches three tests, not four), and its severity is unchanged.
- Review scope summary: the uncommitted diff in relaunch-core.cjs, session-handover.cjs, .skilled/bin/skilled-loop, the three test files, goal-carry-over.md and troubleshooting.md, checked against packet 056's spec, plan, tasks, implementation-summary and goal, plus the parent 002 spec rows. 5 iterations covered correctness, security, traceability, maintainability and a hop-chain cross-check. Stop reason: maxIterationsReached.
- Operator review focus: The uncommitted goal carry-over change for worktree-only packets, shown by git diff in this worktree: relaunch-core.cjs, session-handover.cjs, .skilled/bin/skilled-loop, their three test files, goal-carry-over.md and troubleshooting.md. Check the code against packet 056's spec, tasks and implementation-summary claims, and check that a goal set in a packet that exists only in a worktree is carried across a hop and never lost or misrouted.
- Focus answer: the plain case works. A goal set in a worktree-only packet is carried on hop 1 (log-named worktree), and on hops 2 and 3 through the claimed note's `goal_root`. Every reader refuses to fall back to another checkout. Three narrower cases lose or misroute the goal: a worktree path older than the 16 MiB log tail (R1-P2-001), a primary copy that appears between hops (R1-P2-002), and a second log-mentioned worktree outvoting the claimed root (R5-P2-001). A stale git worktree entry can also be trusted as a root (R2-P2-001).

## 2. Planning Trigger
`/speckit:plan` is not required: there is no active P0 or P1. The P2 advisories can be folded into a follow-up phase.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/session-handover/lib/relaunch-core.cjs:910"},
    {"id": "R1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/session-handover/lib/relaunch-core.cjs:888"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/hooks/session-handover/lib/relaunch-core.cjs:533"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:33"},
    {"id": "R3-P2-002", "severity": "P2", "dimension": "traceability", "file": ".skilled/hooks/session-handover/troubleshooting.md:54"},
    {"id": "R3-P2-003", "severity": "P2", "dimension": "traceability", "file": "specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:89"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/session-handover/lib/relaunch-core.cjs:905"},
    {"id": "R4-P2-002", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:4019"},
    {"id": "R5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/session-handover/lib/relaunch-core.cjs:958"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "title": "Worktree resolution precedence and window", "findings": ["R1-P2-001", "R1-P2-002", "R5-P2-001", "R4-P2-001"]},
    {"id": "WS-2", "title": "Trust only live worktree entries", "findings": ["R2-P2-001"]},
    {"id": "WS-3", "title": "Doc and spec alignment", "findings": ["R3-P2-001", "R3-P2-002", "R3-P2-003"]},
    {"id": "WS-4", "title": "Test robustness", "findings": ["R4-P2-002"]}
  ],
  "specSeed": ["Add a REQ for the claimed-note goal_root carry and its precedence over log mentions and primary copies", "Add a REQ for skipping prunable worktree entries", "Correct the Handoff Criteria tampered-root sentence"],
  "planSeed": ["Prefer the claimed root when it matches before primary and other-worktree searches", "Reuse readLogTail in the worktree naming", "Skip porcelain entries followed by a prunable line", "Replace the claim regex with a substring check"],
  "findingClasses": ["correctness/goal-loss", "correctness/root-precedence", "security/trust-over-acceptance", "traceability/doc-drift", "maintainability/duplication", "maintainability/brittle-test"],
  "affectedSurfacesSeed": [".skilled/hooks/session-handover/lib/relaunch-core.cjs", ".skilled/hooks/session-handover/troubleshooting.md", ".skilled/hooks/session-handover/goal-carry-over.md", ".skilled/hooks/session-handover/tests/session-handover-cli.test.cjs", "specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md", "specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/tasks.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry
| ID | Sev | Dimension | File:line | Title | Evidence / impact | Fix recommendation | Disposition |
|----|-----|-----------|-----------|-------|-------------------|--------------------|-------------|
| R1-P2-001 | P2 | correctness | relaunch-core.cjs:910 | Worktree naming reads only the last 16 MiB of the log | `logTailText` caps at GOAL_LOG_MAX_TAIL_BYTES. A long session whose worktree paths are older than the tail loses the goal, and the docs do not say only the tail counts | Document the tail window, or record the worktree when the goal is first proven | active |
| R1-P2-002 | P2 | correctness | relaunch-core.cjs:888 | Claimed goal_root loses to a primary copy on a later hop | The primary searches run before claimedRoot (:895), which contradicts usableGoal's no-fallback rule (:576) | Check the claimed root first when the claimed note's goal_packet matches | active |
| R2-P2-001 | P2 | security | relaunch-core.cjs:533 | Stale (prunable) worktree entries trusted | Porcelain `prunable` lines are ignored, so a directory re-occupied at a stale path counts as this repository's worktree | Drop entries followed by a `prunable` attribute, or require `<root>/.git` to point back to this repository's common dir | active |
| R3-P2-001 | P2 | traceability | 056 spec.md:33 | Handoff Criteria says the tampered-root test passes on the old code | The test plants a repo copy (cli.test:4036-4054), so the old code fails it. plan.md:29 and summary:93 say otherwise | Rewrite the sentence | active |
| R3-P2-002 | P2 | traceability | troubleshooting.md:54 | "Carried only when the log names the worktree" | The claimed-note root also carries (relaunch-core.cjs:895, :950), as goal-carry-over.md:104 documents | Add the claimed-note case | active |
| R3-P2-003 | P2 | traceability | 056 spec.md:89 | Spec and tasks lag the three review-fix behaviors | There is no REQ for the claimed-root carry, the GIT_* strip or the no-fallback rule. Files to Change lists 3 of the 5 CLI tests | Add REQ rows and test rows | active (case corrected in iteration 4) |
| R4-P2-001 | P2 | maintainability | relaunch-core.cjs:905 | logTailText duplicates readLogTail | Two tail readers with separate arithmetic can drift apart | Call readLogTail(logPath, GOAL_LOG_MAX_TAIL_BYTES).text | active |
| R4-P2-002 | P2 | maintainability | session-handover-cli.test.cjs:4019 | Regex built from an unescaped temp path | A metacharacter in TMPDIR breaks the test | Use `includes` | active |
| R5-P2-001 | P2 | correctness | relaunch-core.cjs:958 | Claimed root outvoted by a second log-mentioned worktree | Two matches refuse even though the claimed note proves which copy was used | Return the claimed root's match when it is unique within that root | active |

Every finding carries a Finding class, a Scope proof, Affected surface hints and a Case line in its iteration file (iterations 001-005).

## 4. Remediation Workstreams
- P0: none. P1: none.
- P2 advisories: WS-1 (R1-P2-001, R1-P2-002, R5-P2-001, R4-P2-001), WS-2 (R2-P2-001), WS-3 (R3-P2-001..003), WS-4 (R4-P2-002).

## 5. Spec Seed
- REQ: a later hop keeps the claimed note's `goal_root` when it still holds the packet with the headline, ahead of primary-checkout copies and other log-mentioned worktrees.
- REQ: a worktree entry that git marks prunable is not a trusted root.
- REQ: git repository variables are stripped before listing worktrees, and a stale `goal_root` never falls back.
- Fix the Handoff Criteria sentence about the tampered-root test.

## 6. Plan Seed
- Reorder `claudeGoalPacketResult` so it tries the claimed root first, with a test that plants a same-headline copy in the primary checkout.
- Make `worktreeHeadlinePackets` prefer the claimed root's match, with a test that names a second worktree in the log.
- Parse the porcelain blocks and skip `prunable` entries, with a test that deletes a worktree and recreates a plain directory at its path.
- Replace `logTailText` with `readLogTail`.
- Update troubleshooting.md, spec.md and tasks.md.

## 7. Traceability Status
### Core Protocols
- spec_code: partial. REQ-001..REQ-004 map to code and to tests with the stated names. The behaviors from the second-account fixes have no REQ (R3-P2-003), the Handoff Criteria sentence is stale (R3-P2-001), and D3 does not address the claimed-root case (R5-P2-001).
- checklist_evidence: partial. T001-T010 are all ticked, and the count arithmetic 1065 + 8 = 1073 holds. The suites were not re-run, because they write outside the lineage. goal.md's `validate.sh --strict RESULT: PASSED` criterion is UNVERIFIED here.
- AC_COVERAGE: exempt (Level 1 packet, no acceptance-criteria.md).
### Overlay Protocols
- skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability: notApplicable. No such surface is in scope.

## 8. Deferred Items
- A worktree removed between hops drops the goal at consume with no warning line (iteration 5). This matches the existing handling of a packet that lost its goal.md.
- Porcelain is read without `-z`, so a path holding a newline would mis-split (theoretical).
- `GIT_CEILING_DIRECTORIES` removal widens discovery only for a non-repository repoRoot.
- The registry carries no `frontier` object (default depth mode).

## Dimension Expansion Map
- Saturated directions: none. Completed pivots: 0. Failed pivots: 0. Audited overrides: 0. Remaining frontier: none recorded.
- Iteration 5 was a cross-dimension hop-chain pass after D1-D4 completed.

## 9. Search Ledger
*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix
- Convergence: newFindingsRatio by iteration was 1.0, 0.33, 0.5, 0.25, 0.1, and the registry convergenceScore is 0.9. Stop: maxIterationsReached (5 of 5).
- Coverage: correctness (1, 5), security (2), traceability (3), maintainability (4). All four are covered.
- Ruled out: a Claude hook binding SESSION_HANDOVER_GOAL_PACKET (only cursor, devin and pi call bindRelaunchGoal); an off-by-one in uniqueness; GIT_CONFIG_* redirection; shell or option injection through goal_root; the seeded split on a one-line answer; hop 2 loss without a log mention; a missing parent spec row.
- Sources reviewed: the git diff of all eight scoped code and doc files; relaunch-core.cjs, session-handover.cjs, skilled-loop and goal-handover.cjs at the cited lines; goal-core.cjs:1257; packet 056 spec, plan, tasks, implementation-summary and goal; parent 002 spec.md.
