# Deep Review Report — Packet 056 worktree-goal-carry

- **Lineage**: `vibe` (fan-out child), session `fanout-vibe-1795297959308-ycf8yr`, generation 1, lineage mode `new`
- **Target**: `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry` (spec-folder)
- **Mode**: review, dimensions `correctness, security, traceability, maintainability`
- **Iterations**: 5 of 5 (`stopPolicy: max-iterations`), stop reason `maxIterationsReached`
- **Verdict**: **CONDITIONAL**

## 1. Executive Summary

**Overall verdict: CONDITIONAL.** One active P1 remains and no P0 was found. The change implements the durable directive — a worktree-only packet's goal is carried across a hop without asking the operator — and the worktree search, the `goal_root` note field, the containment check and the two-worktree refusal all behave as packet 056 specifies. The P1 is a bounded-read asymmetry inside the new worktree search that can still lose the goal on a large session log.

- **hasAdvisories**: false (advisories are reported only when the verdict is PASS)
- **Counts the verdict used**: P0 = 0, P1 = 1, P2 = 6. Seven open findings; `R4-P2-001` is folded into `R1-P1-001` by the reducer's refinement rule, so the merged root cause is one registry entry and the six P2 entries below are the remaining distinct findings.
- **Self-check outcomes**: `R1-P1-001` was re-read at `relaunch-core.cjs:906-920` against `:731-757` and confirmed active at P1. `R4-P2-001` was adjudicated P1 because the reducer folds it into `R1-P1-001` and takes the refinement's severity as the merged root cause's severity; the root cause's impact is the lost goal, not the duplication that causes it. No finding was downgraded and none was called a false positive. Both calls are recorded in the ledger at sequences 7 and 8.
- **Review scope summary**: the uncommitted worktree goal carry-over diff — `relaunch-core.cjs`, `session-handover.cjs`, `.skilled/bin/skilled-loop`, `goal-handover.cjs`, their three test files, `goal-carry-over.md`, `troubleshooting.md` — checked against packet 056's `spec.md`, `tasks.md` and `implementation-summary.md`, plus the feature catalog and playbook entries that describe the hand-over.
- **Operator review focus**: The uncommitted goal carry-over change for worktree-only packets, shown by git diff in this worktree: relaunch-core.cjs, session-handover.cjs, .skilled/bin/skilled-loop, their three test files, goal-carry-over.md and troubleshooting.md. Check the code against packet 056's spec, tasks and implementation-summary claims, and check that a goal set in a packet that exists only in a worktree is carried across a hop and never lost or misrouted.

## 2. Planning Trigger

`/speckit:plan` **is required**: the active P1 blocks promotion and needs a code fix, and four of the six P2 findings are documentation corrections that belong in the same plan.

`findingClasses` and `affectedSurfacesSeed` are `UNKNOWN`: the reducer-owned registry carries `findingClass: null` and an empty `affectedSurfaceHints` for every open finding, and the iteration deltas do not carry those fields. They are not inferred from prose here.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 1, "P2": 6, "total": 7 },
  "remediationWorkstreams": [
    "W1: make the worktree search read the session log the way the goal reader does (R1-P1-001, closes R4-P2-001)",
    "W2: correct the refusal count in the two-worktree message (R1-P2-001)",
    "W3: correct troubleshooting.md's account of when a worktree-only goal is carried (R3-P2-001)",
    "W4: add goal_root and the worktree search to the feature catalog entry (R3-P2-002)",
    "W5: correct the three-CLI-tests prose in spec.md and tasks.md (R3-P2-003)",
    "W6: make resolveGoalPacketResult's root contract uniform (R4-P2-002)"
  ],
  "specSeed": [
    "Record the bounded-read rule for the worktree search in spec.md section 3: the search reads the same bytes the goal reader reads, including the head scan",
    "Correct the CLI worktree test count in spec.md section 3 and tasks.md T003 from three to five",
    "State the claimed-note path as a second naming signal in the requirement that describes how a worktree is named"
  ],
  "planSeed": [
    "Replace logTailText with readLogTail plus the widening loop and head scan latestGoalLogEntry already uses, and delete GOAL_LOG_MAX_TAIL_BYTES' second meaning",
    "Add a regression test with a session log larger than the tail cap whose worktree mention sits before the tail",
    "Report the real packet count in the two-worktree refusal message",
    "Update troubleshooting.md, the feature catalog entry, spec.md and tasks.md",
    "Return root on every resolveGoalPacketResult path and drop the empty-string fallback at session-handover.cjs:419"
  ],
  "findingClasses": "UNKNOWN",
  "affectedSurfacesSeed": "UNKNOWN",
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

<!-- MACHINE-OWNED: START -->
| ID | Severity | Dimension | Title | File:line | First seen | Status |
|----|----------|-----------|-------|-----------|------------|--------|
| R1-P1-001 | P1 | correctness | The worktree search reads only the last 16 MB of the session log, so a worktree named earlier is never searched | `.skilled/hooks/session-handover/lib/relaunch-core.cjs:906` | 1 | active |
| R1-P2-001 | P2 | correctness | The two-worktree refusal always reports 2 packets | `.skilled/hooks/session-handover/lib/relaunch-core.cjs:954` | 1 | active |
| R2-P2-001 | P2 | security | The goal_root mitigation narrows the trust base but leaves it at any directory git lists as a worktree | `.skilled/hooks/session-handover/lib/relaunch-core.cjs:547` | 2 | active |
| R3-P2-001 | P2 | traceability | troubleshooting.md says a worktree-only goal is carried only when the log names the worktree, but the claimed note's goal_root also counts | `.skilled/hooks/session-handover/troubleshooting.md:54` | 3 | active |
| R3-P2-002 | P2 | traceability | The feature catalog describes the goal carry-over without goal_root or the worktree search | `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md:98` | 3 | active |
| R3-P2-003 | P2 | traceability | spec.md and tasks.md still say three CLI worktree tests while the change ships five | `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:110` | 3 | active |
| R4-P2-002 | P2 | maintainability | resolveGoalPacketResult returns root only on the worktree path, so every consumer must defend against an empty root | `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1436` | 4 | active |
<!-- MACHINE-OWNED: END -->

### R1-P1-001 — The worktree search reads only the last 16 MB of the session log

- **Severity**: P1 (correctness) · **File:line**: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:906-920`
- **Evidence**: `logTailText` opens the log, seeks to `size - min(size, GOAL_LOG_MAX_TAIL_BYTES)` and returns that slice as text; `GOAL_LOG_MAX_TAIL_BYTES` is `16 * 1024 * 1024` at `:63`. The goal reader beside it, `latestGoalLogEntry` at `:731-757`, starts at `GOAL_LOG_TAIL_BYTES` (256 KB), widens by 4x up to the same 16 MB cap, and when the cap still holds no entry scans the bytes before the tail in 64 KB chunks through `latestGoalLogEntryBefore`, joining the straddling line. The two reads therefore disagree about what the log says.
- **Impact**: the worktree search only walks worktrees the log names. A worktree path recorded before the last 16 MB is judged unnamed, the worktree is never searched, and the hop ends with `the active goal names no packet this hand-over can find` (`:900`) — the exact loss the durable directive forbids. The packet's Known Limitation 2 covers a missing session log, not a bounded read of a present one.
- **Case**: a session log larger than 16 MB whose worktree mention sits before the last 16 MB, with the goal entry itself inside the tail so the goal reader answers without widening.
- **Fix**: reuse `readLogTail` and the widening-plus-head-scan loop in the worktree search, or derive the named worktrees from the same scan that produced the goal entry, so one read answers both questions.
- **Disposition**: open, blocks promotion.
- **Finding class**: UNKNOWN · **Scope proof**: UNKNOWN · **Affected surface hints**: UNKNOWN

### R1-P2-001 — The two-worktree refusal always reports 2 packets

- **Severity**: P2 (correctness) · **File:line**: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:954-957`
- **Evidence**: `worktreeHeadlinePackets` stops collecting once the list reaches two, and the refusal message interpolates that list's length.
- **Impact**: the operator is told two worktrees carry the packet when three or more do, which misdirects the manual resolution the refusal asks for.
- **Case**: three linked worktrees each holding a copy of the same packet headline.
- **Fix**: count the matches without early return, or word the message as "at least 2".
- **Disposition**: open, advisory.
- **Finding class**: UNKNOWN · **Scope proof**: UNKNOWN · **Affected surface hints**: UNKNOWN

### R2-P2-001 — The goal_root mitigation narrows the trust base but leaves it at any git-listed worktree

- **Severity**: P2 (security) · **File:line**: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:547`
- **Evidence**: `goal_root` is accepted only while `git -C <repoRoot> worktree list` names it, and the worktree search is limited to worktrees the session log names. `spec.md:150` names this residual risk and the mitigation is implemented as specified.
- **Impact**: a model-influenced log line can still point the search at a worktree the operator did not intend, though only inside this repository and only for a packet that carries the headline.
- **Case**: a session log line naming a worktree the operator never used, with a matching packet headline in it.
- **Fix**: none required against the spec; recorded so the residual risk is visible when the trust base is next revisited.
- **Disposition**: open, advisory, accepted by spec.
- **Finding class**: UNKNOWN · **Scope proof**: UNKNOWN · **Affected surface hints**: UNKNOWN

### R3-P2-001 — troubleshooting.md understates when a worktree-only goal is carried

- **Severity**: P2 (traceability) · **File:line**: `.skilled/hooks/session-handover/troubleshooting.md:54`
- **Evidence**: the entry says the goal is carried "only when the session log names that worktree's path", but `worktreeHeadlinePackets:948-951` also accepts the claimed note's `goal_root`, and `session-handover-cli.test.cjs:4082` exercises that path.
- **Impact**: an operator debugging a lost goal rules out the claimed-note path and looks in the wrong place.
- **Case**: a note whose `goal_root` names a worktree the session log never mentions; the goal is carried, contradicting the doc.
- **Fix**: name both signals in the entry.
- **Disposition**: open, advisory.
- **Finding class**: UNKNOWN · **Scope proof**: UNKNOWN · **Affected surface hints**: UNKNOWN

### R3-P2-002 — The feature catalog omits goal_root and the worktree search

- **Severity**: P2 (traceability) · **File:line**: `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md:98`
- **Evidence**: the entry describes the goal carry-over without the `goal_root` note field or the worktree search that reads it.
- **Impact**: the catalog is the discovery surface for this capability; a reader cannot tell that a worktree-only packet is supported.
- **Case**: a reader looking for worktree support in the catalog finds no mention and concludes it is unsupported.
- **Fix**: add `goal_root` and the worktree search to the entry.
- **Disposition**: open, advisory.
- **Finding class**: UNKNOWN · **Scope proof**: UNKNOWN · **Affected surface hints**: UNKNOWN

### R3-P2-003 — spec.md and tasks.md still say three CLI worktree tests

- **Severity**: P2 (traceability) · **File:line**: `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:110`
- **Evidence**: `spec.md:110` and `tasks.md:44` say three CLI worktree tests; five ship at `session-handover-cli.test.cjs:3985`, `:4038`, `:4060`, `:4082` and `:4101`. `spec.md:139` records 1065 to 1073, eight new tests, which is five CLI plus two wrapper plus one core — the arithmetic proves the prose is stale, not the count.
- **Impact**: a reviewer checking the packet against its own test list finds a mismatch and cannot tell which side is wrong.
- **Case**: a reader counting the CLI worktree tests against `spec.md:110` and finding five.
- **Fix**: correct both files to five.
- **Disposition**: open, advisory.
- **Finding class**: UNKNOWN · **Scope proof**: UNKNOWN · **Affected surface hints**: UNKNOWN

### R4-P2-002 — resolveGoalPacketResult returns root only on the worktree path

- **Severity**: P2 (maintainability) · **File:line**: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1436`
- **Evidence**: the result carries `root` only when the packet was found through a worktree; `session-handover.cjs:419` survives by defaulting `root` to the empty string.
- **Impact**: every consumer must know which branch produced the result, and a future consumer that reads `root` without the fallback gets `undefined`.
- **Case**: a caller that reads `result.root` on the usual-roots path without the empty-string fallback.
- **Fix**: return `root` on every path, empty when there is none, and drop the fallback.
- **Disposition**: open, advisory.
- **Finding class**: UNKNOWN · **Scope proof**: UNKNOWN · **Affected surface hints**: UNKNOWN

## 4. Remediation Workstreams

**P1 — required before promotion**

1. **W1 — one log read for both questions** (`R1-P1-001`, closes `R4-P2-001`). Replace `logTailText` with `readLogTail` plus the widening loop and head scan `latestGoalLogEntry` already uses, so the worktree search sees every byte the goal reader sees. Delete `GOAL_LOG_MAX_TAIL_BYTES`' second meaning. Add a regression test with a log larger than the tail cap whose worktree mention sits before the tail.

**P2 — advisories, same plan**

2. **W2 — refusal count** (`R1-P2-001`): report the real number of matching worktrees, or say "at least 2".
3. **W3 — troubleshooting** (`R3-P2-001`): name both naming signals.
4. **W4 — feature catalog** (`R3-P2-002`): add `goal_root` and the worktree search.
5. **W5 — packet prose** (`R3-P2-003`): three becomes five in `spec.md:110` and `tasks.md:44`.
6. **W6 — root contract** (`R4-P2-002`): return `root` on every path and drop the fallback at `session-handover.cjs:419`.

`R2-P2-001` needs no work: the mitigation is implemented as `spec.md:150` specifies, and the entry exists so the residual risk stays visible.

## 5. Spec Seed

- Record the bounded-read rule for the worktree search in `spec.md` section 3: the search reads the same bytes the goal reader reads, including the head scan, so the two cannot disagree.
- Correct the CLI worktree test count in `spec.md` section 3 and `tasks.md` T003 from three to five.
- State the claimed note's `goal_root` as a second naming signal beside the session log in the requirement that describes how a worktree is named.
- Keep Known Limitation 2 scoped to a missing session log and add the bounded-read case to the limitations list until W1 lands.

## 6. Plan Seed

- Replace `logTailText` with `readLogTail` plus the widening loop and head scan; delete the duplicated constant meaning.
- Add the large-log regression test described in W1.
- Report the real packet count in the two-worktree refusal.
- Update `troubleshooting.md`, the feature catalog entry, `spec.md` and `tasks.md`.
- Return `root` on every `resolveGoalPacketResult` path and drop the empty-string fallback.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | REQ-001..REQ-004 implemented; `spec.md:150`'s mitigation matches `relaunch-core.cjs:547`; the worktree search at `:906-920` narrows REQ-001 | The bounded read can lose the goal (R1-P1-001); the three-CLI-tests prose is stale (R3-P2-003) |
| `checklist_evidence` | partial | T003 names three tests where five exist; T005 and T010 are claims without artifacts in this lineage | T003's count; T005 and T010 unverifiable here |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `feature_catalog_code` | fail | `session-handover-loop.md:98` omits `goal_root` and the worktree search | R3-P2-002 |
| `playbook_capability` | partial | `session-handover-claude.md:758` has no worktree-only case | Out of the declared change scope; recorded as follow-up |
| `skill_agent` | notApplicable | No `SKILL.md` or agent definition is in the diff or the scope | None |
| `agent_cross_runtime` | notApplicable | No `.claude/agents` or `.opencode/agents` file is in the diff or the scope | None |

**AC_COVERAGE**: exempt. The packet carries no `acceptance-criteria.md`, so the advisory signal has nothing to measure.

## 8. Deferred Items

- **`playbook_capability`** — `session-handover-claude.md:758` has no worktree-only case. Out of the declared change scope; a follow-up review should cover the playbook once W1 lands.
- **`R2-P2-001`** — the residual trust-base risk is accepted by `spec.md:150`; revisit only if the trust base changes.
- **Packet verification claims** — SC-001 and the 14-second walk over 26 worktrees are packet evidence, not reproduced here: the real session log and that repository are absent from this worktree. The completion criteria in the packet's own table are therefore taken as claims, not verified facts.
- **No frontier nodes** — the registry carries no `frontier` object, so this run adds no follow-up review nodes.

## Dimension Expansion Map

- **Saturated directions**: none recorded (`divergence.saturatedDirections` is empty).
- **Completed pivots**: none (`divergence.completed` is empty).
- **Failed pivots**: none (`divergence.failed` is empty).
- **Audited overrides**: none (`divergence.overrides` is empty).
- **Council artifacts**: none.
- **Selected review directions**: the four configured dimensions plus the cross-reference pass, in the order correctness, security, traceability, maintainability, cross-reference.
- **Remaining frontier**: none (`divergence.remainingFrontier` is empty); the run stopped at `maxIterationsReached`, not at an exhausted frontier.

This section records breadth only. It does not alter the verdict, the finding registry or the self-check results.

## 9. Search Ledger

- **searchCoverage**: no required bug classes were configured for this run (`requiredBugClasses: []`), so covered, ruledOut, deferred and blocked are all empty.
- **candidateCoverage**: empty; no candidate set was bound.
- **searchDebt**: empty. `hasSearchDebt: false`.
- **ruledOutCandidates**: empty.
- **cleanSearchProof**: empty.

*No search-depth state captured (legacy v1 record).*

## 10. Audit Appendix

### Convergence summary

| Iteration | Focus | Findings | P0/P1/P2 | newFindingsRatio |
|-----------|-------|----------|----------|------------------|
| 1 | correctness | 2 | 0/1/1 | 1.00 |
| 2 | security | 1 | 0/0/1 | 0.14 |
| 3 | traceability | 3 | 0/0/3 | 0.30 |
| 4 | maintainability | 2 | 0/0/2 | 0.13 |
| 5 | cross-reference | 0 | 0/0/0 | 0.00 |

Reducer `convergenceScore`: 1. The last iteration produced no new findings, and the run stopped because it reached `maxIterations`, not because the threshold was met. `corruptionCount`: 0. `strategyWarning`: null.

### Coverage summary

- Dimensions: 4 of 4 configured dimensions reviewed, plus the cross-reference pass. Coverage 1.0.
- Files reviewed: 22, 18, 11, 16 and 13 across the five iterations, drawn from the pre-bound scope file.
- Every iteration addressed the operator review focus: iteration 1 traced the worktree-only hop end to end, iteration 2 probed the trust base the focus's "never misrouted" clause depends on, iteration 3 checked the packet's own claims, iteration 4 checked the new helpers against the file's conventions, and iteration 5 traced both goal paths together.

### Ruled-out claims

Fourteen candidate findings were examined and ruled out with evidence; the full list with file:line citations is in `deep-review-strategy.md` section 11. The load-bearing ones: `goal_root` written unquoted into the frontmatter (`parseHandoff:338-343` splits on the first colon), `GIT_CONFIG_*` redirecting the worktree list (probed, no effect; `GIT_DIR` does redirect it and is stripped at `:74-77`), a symlinked `goal.md` escaping the worktree (`goalPacketProblem:457-459` realpaths and contains), shell injection through `goal_root` (every hop passes a quoted argument or a separate argv element), and a `noteCwd` match being misrouted (`prepare` writes `cwd` from the sender's directory and the wrapper runs there).

### State-integrity note

The iteration-4 delta recorded `R4-P2-001` with `refines: "R1-P1-001"`. The reducer folds a refinement into its target and takes the refinement's severity as the target's, so the fold downgraded the P1 to P2 in the registry while every iteration narrative, the strategy and the ledger still carried P1. The adversarial self-check re-read the code and restored the merged root cause to P1 through two `deep_review.claim_adjudication` rows (ledger sequences 7 and 8). The registry entry keeps the refinement's title, which frames the root cause as duplication; the impact is the lost goal described under `R1-P1-001`. A future run should record a refinement as its own finding id rather than through `refines` when the refinement's severity differs from the target's.

### Sources reviewed

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs`
- `.skilled/hooks/session-handover/lib/goal-handover.cjs`
- `.skilled/hooks/session-handover/bin/session-handover.cjs`
- `.skilled/bin/skilled-loop`
- `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs`
- `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs`
- `.skilled/hooks/session-handover/tests/relaunch-core.test.cjs`
- `.skilled/hooks/session-handover/goal-carry-over.md`
- `.skilled/hooks/session-handover/troubleshooting.md`
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md`
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/tasks.md`
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/implementation-summary.md`
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-claude.md`
- `.skilled/skills/sk-code/sk-code-review/SKILL.md` (review doctrine)

### Cross-reference appendix

**Core Protocols**: `spec_code` partial, `checklist_evidence` partial. Both are hard-gated and both remain partial at the terminal stop; neither is a failed gate, because each has a named finding that carries the drift.

**Overlay Protocols**: `feature_catalog_code` fail (R3-P2-002), `playbook_capability` partial (out of scope, deferred), `skill_agent` notApplicable, `agent_cross_runtime` notApplicable.

Review verdict: CONDITIONAL
