---
title: "Deep Review Report: session relaunch loop"
description: "Seven-iteration deep review of the session relaunch loop packet on cli-pi DeepSeek V4.1 Flash at max thinking. Verdict PASS with twelve P2 advisories."
importance_tier: normal
contextType: review
---

# Deep Review Report: Session Relaunch Loop

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 12
- **Scope:** `specs/hooks/023-session-relaunch-loop` (spec-folder). Every one of the 89 implementation, test, registration and documentation paths that commit `b830fd0276` adds or changes outside `specs/`, plus the packet's spec docs and interface contract.
- **Run:** 7 of 10 iterations, stop reason `converged`. Executor cli-pi, model `deepseek-v4.1-flash` through the DevPass `llmgateway` route at `--thinking max`. Dimensions covered: correctness, security, traceability and maintainability (4/4).

No finding blocks release. The twelve advisories cluster into four themes: concurrency and process safety in the killer and log, duplicated adapter logic, user-facing text, and documentation or evidence drift.

## 2. Planning Trigger

`/speckit:plan` is not required by the verdict, which is PASS. The operator asked for every finding to be fixed in this run, so the packet below seeds that remediation.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:554", "findingClass": "concurrency"},
    {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:526", "findingClass": "output-text-defect"},
    {"id": "R1-P2-003", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/killer.cjs:113", "findingClass": "io-error-handling"},
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/killer.cjs:250", "findingClass": "instance-only"},
    {"id": "R2-P2-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:143", "findingClass": "instance-only"},
    {"id": "T3-P2-001", "severity": "P2", "file": "specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:144", "findingClass": "documentation-evidence-defect"},
    {"id": "T3-P2-002", "severity": "P2", "file": "specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:97", "findingClass": "contract-self-contradiction"},
    {"id": "M4-P2-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/codex/shared.mjs:65", "findingClass": "cross-consumer"},
    {"id": "M4-P2-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/pi/session-relaunch.ts:140", "findingClass": "algorithmic"},
    {"id": "M4-P2-003", "severity": "P2", "file": ".skilled/hooks/session-relaunch/hermes/context-nudge.mjs:80", "findingClass": "cross-consumer"},
    {"id": "M5-P2-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/claude/stop-arm.mjs:90", "findingClass": "cross-consumer"},
    {"id": "F7-P2-001", "severity": "P2", "file": ".skilled/bin/README.md:177", "findingClass": "documentation_drift"}
  ],
  "remediationWorkstreams": [
    "WS1 killer and log safety: R1-P2-001, R1-P2-003, R2-P2-001, R2-P2-002",
    "WS2 shared adapter helpers: M4-P2-001, M4-P2-002, M4-P2-003, M5-P2-001",
    "WS3 user-facing text: R1-P2-002",
    "WS4 documentation and evidence drift: F7-P2-001, T3-P2-001, T3-P2-002"
  ],
  "specSeed": "A remediation phase under the packet that fixes the twelve P2 advisories with tests first and re-runs the full gate.",
  "planSeed": "One lane per workstream on disjoint files; confirm each finding against the code before its fix.",
  "findingClasses": ["concurrency", "io-error-handling", "instance-only", "cross-consumer", "algorithmic", "output-text-defect", "documentation-evidence-defect", "contract-self-contradiction", "documentation_drift"],
  "affectedSurfacesSeed": [".skilled/hooks/session-relaunch/lib/", ".skilled/hooks/session-relaunch/claude/", ".skilled/hooks/session-relaunch/codex/", ".skilled/hooks/session-relaunch/hermes/", ".skilled/hooks/session-relaunch/pi/", ".skilled/hooks/session-relaunch/opencode/", ".skilled/bin/skilled-loop", ".skilled/bin/README.md", ".skilled/hooks/session-relaunch/README.md", "manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md", "003-command-trigger-runtimes/tasks.md", "scratch/contracts/interface-contract.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Finding | Fix recommendation |
|----|-----|-----------|-----------|---------|--------------------|
| R1-P2-001 | P2 | correctness | `lib/relaunch-core.cjs:554` | `appendLog` reads the log, appends and rewrites it, so two processes writing at once can drop a line. | Append with `fs.appendFileSync` (O_APPEND), which keeps whole lines from concurrent writers. |
| R1-P2-002 | P2 | correctness | `lib/relaunch-core.cjs:526`, `.skilled/bin/skilled-loop:98` | The Skip seed suffix `(Gate 3 answered D) Skip in the sending session)` has one more closing parenthesis than opening. The same text is in the contract, README and tests. | Rewrite the suffix with balanced parentheses in both printers, the docs and the tests together. |
| R1-P2-003 | P2 | correctness | `lib/killer.cjs:113` | An unreadable transcript makes the killer abort instead of treating the session as idle-unknown and giving up cleanly. | Catch the read error and fall through to the give-up path with its notice and un-arm. |
| R2-P2-001 | P2 | security | `lib/killer.cjs:250` | Stale-lock takeover is read, unlink, create. Two killers that both see a stale lock can both take it and both signal. | Take over with an atomic rename or an exclusive create of a fresh lock name, then re-read to confirm ownership. |
| R2-P2-002 | P2 | security | `lib/relaunch-core.cjs:143` | When `XDG_RUNTIME_DIR` is unset the state dir falls back to shared temp. The killer's `mkdir` at `killer.cjs:368` does not set mode 0700 or check ownership, unlike `ensureStateDir`. | Route the killer through `ensureStateDir` so the directory is 0700 and owned by the user. |
| T3-P2-001 | P2 | traceability | `003-command-trigger-runtimes/tasks.md:53`, `:144` | Two checklist evidence pointers name locations that do not exist or stop short of the content they claim. | Repoint each to the line that holds the evidence. |
| T3-P2-002 | P2 | traceability | `scratch/contracts/interface-contract.md:97`, `:103` | Section 7 states two opposite relaunch orders and does not mark the superseded sentence. The code follows the later amendment. | Mark the earlier sentence superseded and point to the amendment. |
| M4-P2-001 | P2 | maintainability | `codex/shared.mjs:65` | `plannedNotePath` exists in five adapters (claude, codex, hermes, pi, opencode) and the copies drifted on path resolution. | Export one helper from the core and use it in every adapter. |
| M4-P2-002 | P2 | maintainability | `pi/session-relaunch.ts:140` | The Pi adapter re-reads hook config on every event and keeps a fourth copy of the threshold resolution. | Resolve the threshold once through one shared helper. |
| M4-P2-003 | P2 | maintainability | `hermes/context-nudge.mjs:80` | `notePathFromSeed` has three divergent parsers (hermes, pi, opencode). The seed prefix literal is duplicated too. | Parse the seed in one core helper next to `specFolderFromSeed`. |
| M5-P2-001 | P2 | correctness | `claude/stop-arm.mjs:90` | Claude stop-arm re-arms a record that is already armed and spawns a second killer. The other adapters guard against this. | Skip arming when the record is already armed for the same handoff, as the other adapters do. |
| F7-P2-001 | P2 | maintainability | `.skilled/bin/README.md:177` | The README and the command-runtimes playbook state the wrapper exit contract inverted against `skilled-loop`. | Restate the exit codes from the wrapper code in both docs. |

## 4. Remediation Workstreams

There are no P0 or P1 workstreams. The P2 advisories group by shared files:

1. **WS1 killer and log safety:** R1-P2-001, R1-P2-003, R2-P2-001, R2-P2-002. Files: `lib/relaunch-core.cjs`, `lib/killer.cjs` and their tests.
2. **WS2 shared adapter helpers:** M4-P2-001, M4-P2-002, M4-P2-003, M5-P2-001. Files: the five adapters, a core helper and the adapter tests.
3. **WS3 user-facing text:** R1-P2-002. Files: both printers, the concern README, the contract and the tests.
4. **WS4 documentation and evidence drift:** F7-P2-001, T3-P2-001, T3-P2-002. Files: `.skilled/bin/README.md`, the playbook, phase 003 `tasks.md` and the contract.

## 5. Spec Seed

- Add a remediation phase under the packet. It fixes the twelve advisories, adds a test for each code fix, and re-runs the full gate at baseline or better.
- Record the review as its input and keep the frozen decisions (D2 80% trigger, D3 seed carry, D4 command-only runtimes) unchanged.

## 6. Plan Seed

- Confirm each finding against its file:line before dispatch.
- Order WS1 first, because it touches process signalling. Run WS2 to WS4 in parallel on disjoint files.
- Tests first for WS1, WS2 and WS3. Docs through the sk-doc modes for WS4.
- Re-run node, pytest, Pi vitest, tsc, shellcheck, the sync checks and the drift guards after the last lane.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Code matches the spec and contract except where the contract contradicts itself (T3-P2-002). |
| `checklist_evidence` | partial | Two phase 003 checklist pointers are stale (T3-P2-001). |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass | Iteration 7 checked the catalog's numeric claims against the code (SL-208) and found them correct. |
| `playbook_capability` | partial | The command-runtimes playbook inverts the wrapper exit contract (F7-P2-001). |
| `skill_agent` | pass | The handoff command and its mirrors match (iterations 3 and 6). |
| `agent_cross_runtime` | pass | The mirrors match the generator (iteration 6). |

`AC_COVERAGE`: exempt. The phases close through `acceptance-criteria.md` and have no `checklist.md`.

resource-map.md was not present at init, so the Resource Map Coverage Gate was skipped. The reducer emitted `review/resource-map.md` at synthesis.

## 8. Deferred Items

None. Iteration 7 discharged every deferred search obligation: SL-208 and SL-209 were ruled out or folded, SL-405 produced F7-P2-001, SL-406 was ruled out with the OpenCode test inventory, and SL-502 was folded into M4-P2-001 and M4-P2-003.

## Dimension Expansion Map

- Saturated directions: none recorded.
- Pivots: none completed, none failed, no audited overrides.
- Remaining frontier: none.

## 9. Search Ledger

- `searchCoverage.requiredBugClasses`: state_transition, duplicated_logic, io_error_handling, user_facing_text, mirror_link_shape, adapter_payload_handling.
- Covered: state_transition, duplicated_logic, io_error_handling, user_facing_text, adapter_payload_handling. Ruled out: mirror_link_shape.
- `searchDebt`: empty after iteration 7. hasSearchDebt: false.

## 10. Audit Appendix

**Convergence:** newFindingsRatio per iteration was 1.00, 1.00, 0.29, 0.30, 0.09, 0.00 and 0.08. At the iteration-8 check, the rolling average of the last two ratios (0.04) was below 0.08 and the latest ratio was below the noise floor. Coverage was 4/4 with coverage age 2, so the weighted stop score was 1.0. All legal-stop gates passed, graph convergence was STOP_ALLOWED with every signal at 1.0, and the loop stopped as converged.

**Run deviations, recorded here so the trail is complete:**

1. **Pi startup conflict.** Pi could not start from the worktree: the global `~/.pi/agent/extensions/pi-fast-mode-w-subagent-support` symlink to the main checkout's copy clashes with the worktree's own copy on the `--fast` flag. Every dispatch therefore ran through a session-scratchpad shim that adds `-ne`. Iteration 1's first dispatch failed on the conflict and was redispatched once, as the workflow allows.
2. **Persona appended.** The deep-review persona was appended after each rendered prompt pack, because cli-pi requires an inline persona and the prompt pack carries none. The first line stayed `DEEP-REVIEW`.
3. **Iteration 4 verdict line.** The narrative carried its verdict line before a "Next Dimension" section. The orchestrator moved that section above the verdict without changing any line, so the verdict is the last line; the original is kept in the session scratchpad.
4. **Graph projection repairs.** The orchestrator's projection mapped leaf-declared dimension and finding aliases onto the canonical nodes, and accepted `source`/`target` edge keys. These were orchestrator-side defects, not review findings.
5. **Phantom registry rows.** Iteration 7's record put running totals into `findingsSummary` while listing one new finding. The reducer then created eleven placeholder rows `SUMMARY-P2-002` to `SUMMARY-P2-012` in the registry. They duplicate no real finding and are excluded from every count in this report; the real set is the twelve rows above.
6. **One iteration past a legal stop.** STOP was legal after iteration 6, but five search obligations were deferred for budget. One more iteration discharged them because the operator asked for nothing deferred.

**Sources reviewed:** the 89 scope paths listed in `deep-review-config.json`, the four phase spec folders and `scratch/contracts/interface-contract.md`.
