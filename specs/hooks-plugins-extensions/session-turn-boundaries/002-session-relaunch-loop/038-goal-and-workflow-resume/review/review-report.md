# Deep Review Report: goal and workflow resume

## 1. Executive Summary

- **Verdict: PASS**, `hasAdvisories: true`.
- **Active findings:** P0 = 0, P1 = 0, P2 = 9.
- **Stop reason:** `maxIterationsReached` (three of three iterations, stop policy `max-iterations`).
- **Scope:** the 18 files of commit `ef4b41e69b` against `8b4e1d88bc`, read against the seven child packets of this folder. All four dimensions were covered: correctness in iteration 1, security and traceability in iteration 2, maintainability in iteration 3.
- **Executor:** `cli-opencode`, model `opencode-go/deepseek-v4.1-flash`, variant `max`. Each iteration passed the mechanical output check and wrote nothing outside `review/`.
- **One severity change after the loop:** the reviewer raised and kept `R1-P1-001` at P1 with confidence 0.6. The orchestrator's final check downgraded it to P2. The reason and what would reverse it are in section 3. The reducer-owned registry still lists it as P1, because the registry is rebuilt from the iteration records.
- **Not covered:** `acceptance-criteria.md` rows, `.skilled/commands/speckit/handoff.md` and the goal-hook playbook were not read by any iteration. No suite was run and no hop was run live.

## 2. Planning Trigger

`/speckit:plan` is not required by the verdict. The nine P2 items are advisory. Two of them (`R2-P2-003`, `R3-P2-002`) are one-line fixes that fit a small follow-up phase.

Planning Packet:

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P2", "previousSeverity": "P1", "file": ".skilled/hooks/session-relaunch/claude/compact-pointer.mjs", "findingClass": "class-of-bug"},
    {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", "findingClass": "class-of-bug"},
    {"id": "R1-P2-003", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", "findingClass": "instance-only"},
    {"id": "R1-P2-004", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", "findingClass": "cross-consumer"},
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/nudge.cjs", "findingClass": "class-of-bug"},
    {"id": "R2-P2-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/nudge.cjs", "findingClass": "class-of-bug"},
    {"id": "R2-P2-003", "severity": "P2", "file": ".opencode/plugins/opencode-goal.js", "findingClass": "cross-consumer"},
    {"id": "R3-P2-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/nudge.cjs", "findingClass": "cross-consumer"},
    {"id": "R3-P2-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/README.md", "findingClass": "instance-only"}
  ],
  "remediationWorkstreams": ["event-name inference", "note mutation guards", "goal carry diagnostics", "note and command text hardening", "docs"],
  "specSeed": "See section 5.",
  "planSeed": "See section 6.",
  "findingClasses": ["class-of-bug", "cross-consumer", "instance-only"],
  "affectedSurfacesSeed": ["compact-pointer startup claim", "payloadEventName", "recordGoalPacket", "claudeGoalPacketResult", "goalRecordFor", "handoffText", "commandPrefix", "opencode-goal session.created", "nudge.hopLimitReached", "README trigger matrix"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Line numbers are the reviewer's. The orchestrator opened the code for `R1-P1-001`, `R1-P2-002`, `R2-P2-003` and `R3-P2-002`. The other five rest on the reviewer's read alone.

| ID | Severity | Dimension | Location | Finding | Fix | Class |
|----|----------|-----------|----------|---------|-----|-------|
| R1-P1-001 | P2 (was P1) | correctness | `claude/compact-pointer.mjs`, `lib/relaunch-core.cjs` `payloadEventName` | The startup claim takes its event name from `payloadEventName`. A Claude payload with no `hook_event_name` and no `prompt` is named `PostToolUse`, so a `SessionStart` claim would go out under the wrong name. No test covers the no-name case. | Pass `expected: 'SessionStart'` on the startup path, or name the event from `payload.source`, and add the no-name test. | class-of-bug |
| R1-P2-002 | P2 | correctness | `lib/relaunch-core.cjs` `recordGoalPacket` | It rewrites a note's frontmatter under the lock without checking the note is still `open`. The other three mutators check. Confirmed by reading the function. | Re-check `frontmatter.status === 'open'` inside the lock and return false otherwise. | class-of-bug |
| R1-P2-003 | P2 | correctness | `lib/relaunch-core.cjs` `claudeGoalPacketResult` | An active goal with no condition text is reported as "names no packet this hand-over can find". The real cause is that there is no goal text to match. | Give the empty-headline case its own reason. | instance-only |
| R1-P2-004 | P2 | correctness | `lib/relaunch-core.cjs` `goalRecordFor` | The OpenCode branch rebuilds the plugin's per-session file path by hand and skips the legacy filename the plugin still reads. A layout change resolves to "no goal" with no log line. | Read through one shared path helper, or log the miss. | cross-consumer |
| R2-P2-001 | P2 | security | `lib/nudge.cjs` `handoffText` | `session_id` and `cwd` go into the note frontmatter unescaped. A value with a newline adds a frontmatter line that `prepare` then trusts as a goal root. Both values come from the operator's own environment. | Reject a session id outside `[A-Za-z0-9._-]` and a `cwd` with a line break. | class-of-bug |
| R2-P2-002 | P2 | security | `lib/nudge.cjs` `commandPrefix` | A `cliPath` that starts with `node ` is returned unquoted. No caller in the repository passes untrusted text today. | Quote every caller-supplied value, or accept only the two known constants. | class-of-bug |
| R2-P2-003 | P2 | traceability | `.opencode/plugins/opencode-goal.js` `session.created` | The packet variable is deleted after the bind with no `finally`, unlike Pi. Child 005 states the variable is unset after the one attempt. Confirmed by reading the code. `bindRelaunchGoal` is documented as never throwing, so the reach is small. | Wrap the bind in `try`/`finally`. | cross-consumer |
| R3-P2-001 | P2 | maintainability | `lib/nudge.cjs` and `bin/session-relaunch.cjs` | Switch parsing and the hop cap exist twice. On an invalid `SKILLED_LOOP_HOPS` the nudge falls back to 0 and asks for a handoff, while `prepare` exits 2. | Share one resolver, or make the nudge stay quiet on an invalid count. | cross-consumer |
| R3-P2-002 | P2 | maintainability | `.skilled/hooks/session-relaunch/README.md` line 19 | The trigger summary says Claude uses `SessionStart` after a compaction only. The same README later documents the startup claim. Confirmed by reading the line. | Name the startup source in the summary. | instance-only |

### Final check on R1-P1-001

- **Hunter:** the code path is as described. `payloadEventName` returns the payload's `hook_event_name` when present and infers a name only when it is absent.
- **Skeptic:** the inference rule and its `claude: 'infer'` policy were not added by this change. The reviewer's own downgrade trigger is a contract showing `SessionStart` always carries `hook_event_name`. Claude Code's documented hook input carries `hook_event_name` on every event, and every fixture in the suite does too.
- **Referee:** downgraded to P2 hardening. This is the orchestrator's judgment from the documented hook input, not from a captured payload. A recorded Claude `SessionStart` payload with no `hook_event_name` would restore P1.

## 4. Remediation Workstreams

No P0 or P1 workstream. Advisory work, in the order suggested:

1. **Event-name inference** (`R1-P1-001`): pin the startup path to `SessionStart` and add the no-name test.
2. **OpenCode cleanup and README line** (`R2-P2-003`, `R3-P2-002`): two small edits.
3. **Note mutation guard** (`R1-P2-002`).
4. **Goal carry diagnostics** (`R1-P2-003`, `R1-P2-004`).
5. **Note and command text hardening** (`R2-P2-001`, `R2-P2-002`).
6. **One switch resolver** (`R3-P2-001`).

## 5. Spec Seed

- The Claude startup claim names its event without relying on payload inference.
- `recordGoalPacket` changes only an open note.
- A goal that cannot be carried says whether the goal text or the packet was missing.
- The OpenCode receiver unsets the packet variable on every exit of the bind.
- The nudge and `prepare` agree on an invalid hop count.

## 6. Plan Seed

- Add a failing test for a `source: 'startup'` payload with no `hook_event_name`, then pin the event.
- Add a failing test for `recordGoalPacket` on a claimed note, then add the guard.
- Add a failing test for a throwing bind in the OpenCode plugin, then add `finally`.
- Correct README line 19.
- Decide whether the session id and `cwd` checks belong in `handoffText` or in `sessionIdFor`.

## 7. Traceability Status

Core protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Children 002, 005 and 006 were compared with the code in iteration 2. Child 005 SC-002 has the error-path gap in `R2-P2-003`. Children 001, 003, 004 and 007 were compared only in part. |
| `checklist_evidence` | deferred | No `acceptance-criteria.md` was opened in any iteration. |

Overlay protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | deferred | `.skilled/commands/speckit/handoff.md` was not read. |
| `agent_cross_runtime` | not applicable | No agent definition is in scope. |
| `feature_catalog_code` | deferred | Not reached. |
| `playbook_capability` | deferred | The goal-hook playbook was not read. |

`AC_COVERAGE`: exempt. The target is a phase parent, and its closure gate is each child's own `acceptance-criteria.md`.

## 8. Deferred Items

- Read the seven `acceptance-criteria.md` files against the code.
- Read `handoff.md` and the goal-hook playbook against the new behaviour.
- The required bug classes `data_loss` and `race_condition` were deferred by the reviewer. `R1-P2-002` touches the second.
- `claim` repeats the session-id selection of `sessionIdFor`. The reviewer ruled it out as a finding and noted it as cleanup.

## Dimension Expansion Map

No pivot ran. Saturated directions: none. Completed, failed and overridden pivots: none. Remaining frontier: none recorded.

## 9. Search Ledger

- `searchCoverage.requiredBugClasses`: injection, error_handling, contract_drift, data_loss, race_condition.
- Covered: injection, error_handling, contract_drift. Ruled out: injection.
- Deferred: data_loss, race_condition.
- `graphCoverageMode`: `graphless_fallback`.
- `searchDebt`: empty. `hasSearchDebt: false`.

## 10. Audit Appendix

**Convergence:** new-findings ratio 1.00, 0.27, 0.15 across the three iterations. The loop stopped on the iteration ceiling, not on convergence. The coverage graph reported `STOP_BLOCKED` before iterations 1 and 2 on uncovered dimensions.

**Coverage:** four of four dimensions. Iteration 1 read `relaunch-core.cjs` and `compact-pointer.mjs` in full. Iterations 2 and 3 added `nudge.cjs`, `session-relaunch.cjs`, the shell shim, the Pi and OpenCode goal code, the README and parts of the suites.

**Ruled out by the reviewer:** the claim seed deleted by `dropNestedLoop`, the goal switch default, a hop-cap off-by-one, step numbering in `handoffText`, the nudge re-arm floor, `recordGoalPacket` before a shell-child refusal, and `parseArgs` on a value starting with `--`.

**Confirmed clean by the reviewer:** `parseClaimSeed`, `goalPacketProblem`, `shouldRelaunch`, `armLocked`, the state directory checks and `manualClaimCommand` escaping.

**Sources:** `iterations/iteration-001.md` to `iteration-003.md`, `deltas/`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `resource-map.md`.

Cross-reference appendix:

- **Core Protocols:** `spec_code` partial, `checklist_evidence` deferred.
- **Overlay Protocols:** `skill_agent` deferred, `agent_cross_runtime` not applicable, `feature_catalog_code` deferred, `playbook_capability` deferred.
