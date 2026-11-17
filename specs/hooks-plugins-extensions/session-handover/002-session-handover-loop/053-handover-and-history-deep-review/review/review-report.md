---
title: "Deep Review Report: session handover and history search"
description: "Five-iteration deep review of session handover logic and session history search across all runtimes. Verdict FAIL from the coverage gate, with no P0 or P1 and four P2 advisories."
trigger_phrases:
  - "handover deep review report"
  - "session history search review"
importance_tier: normal
contextType: review
---
# Deep Review Report: session handover and history search

## 1. Executive Summary

- **Verdict: FAIL.** No defect drives it. `review-verdict.cjs` returned FAIL because the terminal coverage gate failed with `traceability-incomplete`: the hard `spec_code` protocol stayed `partial` in all five iterations. The docs that state the handover contract match the code except where three of the four findings below say they do not, and the `claude/`, `pi/` and `lib/` READMEs were not reached.
- **hasAdvisories:** false, because the verdict is not PASS. Four P2 advisories are active.
- **Counts the verdict used:** P0 = 0, P1 = 0, P2 = 4. Search debt 0. Failed required gates: `coverage`. The evidence and scope gates passed.
- **Self-check outcomes:** none. The adversarial self-check runs only on P0 and P1 findings, and there were none. The orchestrator re-read the cited source for all four P2 findings: R1, R3 and R5 are confirmed as written; R4 is confirmed for the OpenCode copy (`catch { return false; }`), and the Pi copy was not re-read.
- **Scope:** 49 source and doc files under `.skilled/hooks/session-handover/` (Claude, Codex, OpenCode, Pi and Vibe adapters, `lib/`, `bin/`, `history/`) plus `.skilled/bin/skilled-loop`. Tests were cross-references only.
- **Operator review focus:** Session handover logic and session history search across every runtime: the Claude, Codex, OpenCode, Pi and Vibe adapters, the shared lib, bin and the skilled-loop wrapper, and the history readers and search.
- **Stop reason:** `maxIterationsReached` after 5 iterations, stop policy `max-iterations`. Executor: cli-claude-code, `claude-opus-5-5`, effort medium.

## 2. Planning Trigger

`/speckit:plan` is required by the verdict routing, since the verdict is FAIL. The remediation is small: three doc corrections, one contract note and one shared helper. Every finding is P2.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/hooks/session-handover/history/lib/navigator.ts", "line": 559},
    {"id": "R3-P2-001", "severity": "P2", "file": ".skilled/hooks/session-handover/state-files.md", "line": 43},
    {"id": "R4-P2-001", "severity": "P2", "file": ".skilled/hooks/session-handover/opencode/session-handover.js", "line": 306},
    {"id": "R5-P2-001", "severity": "P2", "file": ".skilled/hooks/session-handover/troubleshooting.md", "line": 67}
  ],
  "remediationWorkstreams": ["doc-code alignment (R1, R3, R5)", "shared withdraw-on-prompt helper (R4)", "finish spec_code traceability over the claude/, pi/ and lib/ READMEs"],
  "specSeed": ["Name the history search files filter format and its exact-match rule", "List Vibe among the runtimes whose prompt withdraws a record", "State that an alive owner with an expired lock is also stale", "One withdraw-on-prompt helper used by every adapter"],
  "planSeed": ["Edit history/README.md", "Edit state-files.md:43", "Edit troubleshooting.md:67", "Extract the withdraw wrapper into lib/ and call it from the five adapters", "Rerun /deep:review for spec_code over the unread READMEs"],
  "findingClasses": ["contract-gap", "doc-code drift", "cross-adapter duplication"],
  "affectedSurfacesSeed": [".skilled/hooks/session-handover/history/", ".skilled/hooks/session-handover/state-files.md", ".skilled/hooks/session-handover/troubleshooting.md", ".skilled/hooks/session-handover/{claude,codex,opencode,pi,vibe}/"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:line | Evidence | Impact | Fix | Disposition |
|---|---|---|---|---|---|---|---|---|
| R1-P2-001 | P2 | History search `files` filter is exact string equality, with an undocumented format | correctness | `history/lib/navigator.ts:559` | `input.files.every((file) => metadata.files.includes(file))`; `history/README.md:87` lists `files` without its format | A caller passing a relative or differently spelled path gets no match and no error | Document the expected path form, or normalize both sides | active, verified |
| R3-P2-001 | P2 | `state-files.md` leaves Vibe out of the runtimes whose prompt withdraws a record | traceability | `state-files.md:43` | Line 43 names Pi, OpenCode, Claude and Codex; `vibe/handover-parts.mjs:102-117` withdraws with reason `user-message` | A reader concludes a Vibe prompt does not withdraw an armed hop | Add Vibe to the sentence | active, verified |
| R4-P2-001 | P2 | Withdraw-on-prompt wrapper hand-copied into five adapters; OpenCode and Pi copies drop error reporting | maintainability | `opencode/session-handover.js:306` | OpenCode's copy ends `catch { return false; }`; Codex logs `stop-arm-error` with the message | A failed withdraw on OpenCode leaves no trace in the relaunch log; five copies drift | One helper in `lib/` that logs failures, called by every adapter | active, OpenCode verified, Pi not re-read |
| R5-P2-001 | P2 | `troubleshooting.md` gives an incomplete cause for `killer-lock-stale` | traceability | `troubleshooting.md:67` | Doc: owner gone or unreadable lock older than five seconds. Code: `killer.cjs:487` treats an alive owner with an expired lock as stale too, then logs at `:576` | An operator seeing the event with a live owner finds no matching cause | Add the expired-lock case to the row | active, verified |

## 4. Remediation Workstreams

1. **P0:** none.
2. **P1:** none.
3. **P2 advisories:**
   - Doc and code alignment: R1, R3, R5.
   - Shared withdraw helper: R4.
   - Traceability completion: read the `claude/`, `pi/` and `lib/` READMEs against code so `spec_code` can pass.

## 5. Spec Seed

- The history search contract names the path form `files` expects and that matching is exact.
- `state-files.md` lists every runtime whose operator prompt withdraws a record, Vibe included.
- `troubleshooting.md` names both stale-lock causes the killer acts on.
- Withdraw-on-prompt behaviour lives in one shared helper that logs its failures.

## 6. Plan Seed

- T1: Edit `history/README.md` search row and the `files` description.
- T2: Edit `state-files.md:43`.
- T3: Edit `troubleshooting.md:67`.
- T4: Move the withdraw wrapper into `lib/`, call it from the Claude, Codex, OpenCode, Pi and Vibe adapters, and add a test that a failed withdraw is logged.
- T5: Rerun `/deep:review` over the three unread READMEs to finish `spec_code`.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial (hard, gating) | `goal-carry-over.md` lock contract, `bin/README.md` CLI surface and `troubleshooting.md` killer events match code except one drift; `claude/`, `pi/`, `lib/` READMEs not reached (`killer.cjs:487`, `bin/session-handover.cjs:922`) |
| `checklist_evidence` | core | notApplicable | The target is source and hook docs, not a spec packet with a checklist |
| `agent_cross_runtime` | overlay | partial | All five adapters withdraw through the same shared call with reason `user-message`; the log event names differ (`withdrawn` against `arm-cancelled`) and no doc pins them |
| `skill_agent`, `feature_catalog_code`, `playbook_capability` | overlay | not run | Not applicable to a files target |

AC_COVERAGE: exempt, the target is not a spec folder.

## 8. Deferred Items

- The relaunch-log event names for a withdrawal differ by runtime (`withdrawn` on Vibe, `arm-cancelled` on OpenCode and Pi). Not a finding; worth pinning in `handoff-protocol.md` with T4.
- Devin and DSH handover were outside this folder's scope.

## Dimension Expansion Map

No divergent pivots ran. Saturated directions: none. Remaining frontier: the `claude/`, `pi/` and `lib/` READMEs for `spec_code`.

## 9. Search Ledger

- **searchCoverage:** required bug classes `cross_adapter_duplication` (covered) and `doc_code_drift` (ruled out by the reducer, though R3 and R5 are doc drift raised under traceability); graph coverage mode `graphless_fallback`.
- **candidateCoverage:** covered `contract_gap`, `cross_adapter_duplication`; ruled out `boundary_value`, `command_injection`, `doc_code_drift`, `input_escaping`, `path_traversal`, `privilege_escalation`, `signal_targeting`, `state_transition`.
- **searchDebt:** none. hasSearchDebt: false.
- **Ruled out, with evidence:**
  - Shell injection through adapter spawns: every spawn is array-form, none uses `shell: true`.
  - Permission escalation through a forged record's `permissionMode`: refused unless the operator's own launch line unlocked bypass (`skilled-loop:261`).
  - AppleScript injection through the hop notice (`hop-history.cjs:134-137`): `JSON.stringify` escapes as an AppleScript literal reads it.
  - Seed note path bypassing the handoffs-dir gate: `claim` gates the path (`session-handover.cjs:713`).
  - Codex fill counting cached tokens twice: `cached_input_tokens` is not read (`context-usage.cjs:372`).
  - Killer lock constants and the `bin/README.md` subcommand list match code (`killer.cjs:26-38`, `session-handover.cjs:991-1002`).
  - First receiver numbered `(2)`: intended, documented at `runtime-behavior.md:73`.

## 10. Audit Appendix

### Convergence

| Iteration | Dimension | New findings | newFindingsRatio | Status |
|---|---|---|---|---|
| 1 | correctness | R1-P2-001 | 1.0 | complete |
| 2 | security | none | 0 | complete |
| 3 | traceability | R3-P2-001 | 0.5 | complete |
| 4 | maintainability | R4-P2-001 | 0.33 | complete |
| 5 | traceability (last-iteration rule for unfinished core protocols) | R5-P2-001 | 0.25 | complete |

Dimension coverage 4 of 4. Terminal gates: evidence pass, scope pass, coverage fail (`traceability-incomplete`).

### How this run differed from the workflow

- **Two archived generations.** Generation 1 stopped when the cli-claude-code recursion guard refused `claude -p` inside the orchestrating Claude Code session. Generation 2 logged three error iterations while the bypass still left `CLAUDE_CODE_SESSION_ID` set. Both are in `../review-archive/`; generation 3 is this report. The operator authorized the bypass, which ran the iterations from a detached process with no Claude session variables.
- **Records relayed through the gateway.** The cli-claude-code executor launches the leaf with `--permission-mode acceptEdits`, which refuses its Bash calls in `-p` mode, so the leaf wrote each iteration file and its record to `deltas/iter-NNN.jsonl` but could not run `append-mode-event.cjs`. The orchestrator handed each record, unedited, to that gateway. Iteration 1 also carries an `iteration_error` row from the first verify; the relayed complete record follows it. This executor gap affects any cli-claude-code review run and is a follow-up for the deep-loop runtime.

### Core Protocols

`spec_code` partial, `checklist_evidence` notApplicable.

### Overlay Protocols

`agent_cross_runtime` partial; the other overlays not applicable.

### Sources Reviewed

The 49 files listed in `deep-review-strategy.md` section 15, with the iteration narratives in `iterations/` and deltas in `deltas/`. Resource map: `resource-map.md`.
