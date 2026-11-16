# Deep Review Report - Vibe Hooks and Plugins (lineage vibe-2)

- Session: `fanout-vibe-2-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Spec folder: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation`
- Artifact directory: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/review/lineages/vibe-2`
- Iterations: 5 of 5 (`stopPolicy: max-iterations`, `stopReason: maxIterationsReached`)
- Executor: cli-mistral-vibe, model deepseek-flash

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: true**
- **Active findings: P0 = 0, P1 = 1, P2 = 15.** These are the counts the verdict used, read from the reducer-owned registry (`deep-review-findings-registry.json`, `openFindingsCount: 16`, `findingsBySeverity: {P0: 0, P1: 1, P2: 15}`).
- **Self-check outcomes:** no finding was downgraded or called a false positive at synthesis. The single active P1 (`R1-P1-001`) was re-read against `.vibe/plugins/repo-guards/spec-gate.mjs:72-78` and confirmed: the advise path builds the notice, returns it, and never calls `result.observe()`, while the four sibling adapters (`claude:52`, `codex:69`, `cursor:50`, `devin:54`) all do. It stays P1. No P0 candidate was raised in any iteration, so no Hunter/Skeptic/Referee pass was required at synthesis.
- **Review scope:** 27 declared target files — `.vibe/hooks.toml`, the 13 repo-guards scripts plus `lib/hook-io.mjs` and `render-home-hooks.cjs`, the five session-lifecycle composers, the goal, hand-over, ask-surface, decision-capture, completion and skill-advisor adapters, and the Vibe session reader. All four dimensions were covered: correctness (iterations 1, 3, 4), security (iteration 2), traceability and maintainability (iteration 5).
- **Prior-finding boundary:** the 29 findings dispositioned in `023-vibe-review-remediation/implementation-summary.md` were checked against every new finding and none is re-reported. The 16 active findings are all new.
- **Operator review focus:** Every Mistral Vibe hook and plugin: the bindings in .vibe/hooks.toml, the repo-guards plugins and lib/hook-io.mjs, render-home-hooks.cjs, the session-lifecycle composers (turn-start, turn-end, session-start, compaction), the goal, hand-over, ask-surface, decision-capture, completion and skill-advisor adapters, and the Vibe session reader. Find correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins. 29 findings from the previous review are dispositioned in specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation/implementation-summary.md: report only new or still-open issues, each with file:line evidence.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is CONDITIONAL on one active P1, and the remediation workstreams below are the plan input.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 1,
    "P2": 15,
    "ids": [
      "R1-P1-001",
      "R1-P2-001",
      "R1-P2-002",
      "R1-P2-003",
      "R2-P2-001",
      "R2-P2-002",
      "R2-P2-003",
      "R3-P2-001",
      "R3-P2-002",
      "R3-P2-003",
      "R4-P2-001",
      "R4-P2-002",
      "R4-P2-003",
      "R5-P2-001",
      "R5-P2-002",
      "R5-P2-003"
    ]
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Acknowledge spec-gate advise delivery",
      "findingIds": ["R1-P1-001"],
      "surfaces": [".vibe/plugins/repo-guards/spec-gate.mjs"]
    },
    {
      "id": "WS-2",
      "priority": "P2",
      "title": "Close the wire-format and payload assumptions",
      "findingIds": ["R1-P2-001", "R2-P2-001", "R5-P2-001"],
      "surfaces": [
        ".vibe/plugins/repo-guards/lib/hook-io.mjs",
        ".vibe/plugins/repo-guards/spec-gate.mjs",
        ".vibe/plugins/repo-guards/post-edit-quality.mjs",
        ".vibe/plugins/repo-guards/dist-freshness.mjs",
        ".vibe/plugins/repo-guards/classifier-injection-screen.mjs"
      ]
    },
    {
      "id": "WS-3",
      "priority": "P2",
      "title": "Restore fail-open and kill-switch coverage",
      "findingIds": ["R1-P2-002", "R2-P2-003", "R4-P2-001"],
      "surfaces": [
        ".vibe/plugins/repo-guards/session-cleanup.mjs",
        ".skilled/hooks/session-lifecycle/vibe/session-start.mjs",
        ".skilled/hooks/session-handover/vibe/handover-parts.mjs"
      ]
    },
    {
      "id": "WS-4",
      "priority": "P2",
      "title": "Unify cwd resolution and the shared session helper",
      "findingIds": ["R1-P2-003", "R3-P2-003", "R5-P2-002"],
      "surfaces": [
        ".vibe/plugins/repo-guards/dispatch-preflight.mjs",
        ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs",
        ".vibe/plugins/repo-guards/dist-freshness.mjs",
        ".vibe/plugins/repo-guards/lib/hook-io.mjs"
      ]
    },
    {
      "id": "WS-5",
      "priority": "P2",
      "title": "Bound the composer budgets and per-call work",
      "findingIds": ["R2-P2-002", "R3-P2-001"],
      "surfaces": [
        ".skilled/hooks/session-lifecycle/vibe/session-start.mjs",
        ".skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs"
      ]
    },
    {
      "id": "WS-6",
      "priority": "P2",
      "title": "Honour the injected env seam and add composer test parity",
      "findingIds": ["R3-P2-002", "R4-P2-002", "R4-P2-003"],
      "surfaces": [
        ".skilled/hooks/session-lifecycle/vibe/session-start.mjs",
        ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs",
        ".skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs",
        ".skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs"
      ]
    },
    {
      "id": "WS-7",
      "priority": "P2",
      "title": "Correct the port map's per-plugin verdicts",
      "findingIds": ["R5-P2-003"],
      "surfaces": [
        ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md"
      ]
    }
  ],
  "specSeed": [
    "Record the `post_tool` payload field set as observed or unobserved, and name the field that carries a call's outcome, so a guard can gate on it without inference.",
    "State the delivery-acknowledgement contract every advise-emitting guard must satisfy, and name `result.observe()` as the mechanism.",
    "State that every guard resolves a relative cwd against the checkout through `sessionDirFor`, and that no guard may re-implement it.",
    "Record the kill-switch table as the complete set of parts a composer may run, and require a switch for every part.",
    "Record the port map's per-plugin verdict as covering both the hook and the tool registrations, and require a loss note whenever a registration cannot port."
  ],
  "planSeed": [
    "Add the `result.observe()` call to the spec-gate advise path and assert the notice is delivered once in a live scenario.",
    "Capture one `post_tool` payload from a `write_file` call and either confirm `tool_status === 'success'` or replace the three gates with the observed field.",
    "Move the `.opencode/plugins/session-cleanup.js` import inside `runGuard` so a missing sibling runtime cannot throw at module load.",
    "Replace the local `sessionDirFor` in `dist-freshness.mjs` with the `hook-io.mjs` import, and route `dispatch-preflight.mjs` and `turn-start.mjs` through the same resolver.",
    "Give the `session-start` outer spawn budget headroom over the inner `PROCESS_TIMEOUT_MS`, and add a kill switch for the goal part.",
    "Add a size gate to the `compaction-post-tool` hand-over part so the journal is not re-parsed on every tool call.",
    "Add the `IS_CLI_ENTRY` guard and a test file to `session-start.mjs`, matching the other three composers.",
    "Thread the injected `env` through `headReceiptDir()` and the two enable checks instead of reading `process.env`.",
    "Add the dropped tool registrations to the `env-secret-guard.js` and `system-skill-advisor.js` rows of the port map."
  ],
  "findingClasses": [
    "algorithmic",
    "instance-only",
    "matrix/evidence",
    "test-isolation"
  ],
  "affectedSurfacesSeed": [
    ".vibe/plugins/repo-guards/spec-gate.mjs",
    ".vibe/plugins/repo-guards/lib/hook-io.mjs",
    ".vibe/plugins/repo-guards/session-cleanup.mjs",
    ".vibe/plugins/repo-guards/dispatch-preflight.mjs",
    ".vibe/plugins/repo-guards/post-edit-quality.mjs",
    ".vibe/plugins/repo-guards/dist-freshness.mjs",
    ".vibe/plugins/repo-guards/classifier-injection-screen.mjs",
    ".skilled/hooks/session-lifecycle/vibe/session-start.mjs",
    ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs",
    ".skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs",
    ".skilled/hooks/session-handover/vibe/handover-parts.mjs",
    ".skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs",
    ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs",
    ".skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1-P1-001 | P1 | The spec-gate advise path never acknowledges delivery, so the notice repeats on every shell call | correctness | `.vibe/plugins/repo-guards/spec-gate.mjs:72-78` | The advise branch builds the notice, returns it, and never calls `result.observe()`; the four sibling adapters call it at `claude:52`, `codex:69`, `cursor:50`, `devin:54` | The delivery marker is never written, so the same advisory is re-emitted on every shell call for the rest of the session | Call `result.observe()` on the advise path before returning, matching the sibling adapters | active | algorithmic | The read is inside the declared target; the sibling adapters are cited as the parity reference | `.vibe/plugins/repo-guards/spec-gate.mjs`, the `pre_tool` advise binding in `.vibe/hooks.toml` |

### P2

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1-P2-001 | P2 | `process_start` is keyed by its bare name while every other map key is qualified | correctness | `.vibe/plugins/repo-guards/lib/hook-io.mjs:32-38` | The tool-name map keys every entry with its namespace except `process_start` | A qualified `process_start` call misses the map and falls through to the unqualified path | Key the entry with its namespace like every other row | active | instance-only | Both the map and its consumers are inside the declared target | `.vibe/plugins/repo-guards/lib/hook-io.mjs` |
| R1-P2-002 | P2 | The session-cleanup hook imports another runtime's plugin outside the fail-open wrapper | correctness | `.vibe/plugins/repo-guards/session-cleanup.mjs:16` | A static import of `.opencode/plugins/session-cleanup.js` sits at module scope, outside `runGuard` | A missing or broken sibling runtime throws at module load, before any fail-open wrapper exists | Move the import inside `runGuard` or resolve it lazily | active | algorithmic | The file is inside the declared target | `.vibe/plugins/repo-guards/session-cleanup.mjs` |
| R1-P2-003 | P2 | The dispatch preflight passes the raw payload cwd to the rule engine | correctness | `.vibe/plugins/repo-guards/dispatch-preflight.mjs:22-25` | The raw `payload.cwd` is passed where the other guards use `sessionDirFor` | A relative cwd resolves against the process directory rather than the checkout | Route the value through `sessionDirFor` | active | instance-only | The file and the shared helper are inside the declared target | `.vibe/plugins/repo-guards/dispatch-preflight.mjs`, `.vibe/plugins/repo-guards/lib/hook-io.mjs` |
| R2-P2-001 | P2 | The advise reply uses a field the recorded `pre_tool` format does not carry, on a strict binding | correctness | `.vibe/plugins/repo-guards/spec-gate.mjs:72-78` | The reply carries `system_message`; the recorded `pre_tool` reply is either empty or `{"decision":"deny","reason":"..."}` | On a `strict = true` binding an unrecognized reply shape is not the documented contract | Use the recorded reply shape, or record the field as supported | active | matrix/evidence | The file and the reference doc are inside the declared target | `.vibe/plugins/repo-guards/spec-gate.mjs`, `.vibe/hooks.toml` |
| R2-P2-002 | P2 | The startup-guard spawn budget equals the inner per-script budget, so the warnings are lost on a slow start | correctness | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:42,82-92` | The outer spawn budget is 8000 ms and the inner `PROCESS_TIMEOUT_MS` is also 8000 ms | The outer budget expires at the same moment the inner one does, so a slow start yields no warnings at all | Give the outer budget headroom over the inner timeout | active | algorithmic | The composer is inside the declared target | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` |
| R2-P2-003 | P2 | The goal part has no kill switch and the switch table does not mention it | correctness | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:68-70` | The goal part runs unconditionally; `README.md:29` lists the switches and omits it | An operator cannot disable the goal injection without editing code | Add a switch and list it in the table | active | instance-only | The composer is inside the declared target; the README is cited as the switch table | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` |
| R3-P2-001 | P2 | The hand-over part runs on every tool call with no size gate, so the journal is re-parsed each time | correctness | `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:66-73` | The hand-over part is invoked on every `post_tool` payload and re-parses the journal | Every tool call pays the journal parse cost, not only a compaction | Gate the part on the compaction signal or a size threshold | active | algorithmic | The composer is inside the declared target | `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` |
| R3-P2-002 | P2 | The session-start composer has no CLI-entry guard and no test, unlike the other three composers | maintainability | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:145-147` | No `IS_CLI_ENTRY` guard and no test file, while `turn-start`, `turn-end` and `compaction-context` have both | Importing the module runs the composer, and no test covers it | Add the guard and a test file | active | instance-only | The composer and its three siblings are inside the declared target | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` |
| R3-P2-003 | P2 | The turn-start composer uses the raw payload cwd as the project root while the guard seam resolves it against the checkout | correctness | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:52,80` | The raw cwd is used where the guard seam uses `sessionDirFor` | A relative cwd resolves against the process directory rather than the checkout | Route the value through the shared resolver | active | instance-only | The composer is inside the declared target | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` |
| R4-P2-001 | P2 | A throwing nudge commit releases the claim and still delivers the nudge | correctness | `.skilled/hooks/session-handover/vibe/handover-parts.mjs:303-313` | The claim is released in the catch path and the nudge is still returned | A failed commit produces a duplicate delivery on the next turn | Release the claim only after a successful commit, or suppress the delivery on a throw | active | algorithmic | The file and the core it calls are inside the declared target | `.skilled/hooks/session-handover/vibe/handover-parts.mjs` |
| R4-P2-002 | P2 | The advisor's head receipt reads `process.env` instead of the `env` the adapter accepts | correctness | `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:64-68` | `headReceiptDir()` reads `process.env` while the adapter takes an injected `env` | A test that injects an env cannot isolate the receipt directory | Thread the injected `env` through | active | test-isolation | The adapter is inside the declared target | `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` |
| R4-P2-003 | P2 | Two adapters accept an `env` seam and then ignore it for the enable check | correctness | `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:86`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:93` | Both read `process.env` for the enable check while accepting an injected `env` | A test that disables the hook through the seam still runs it | Read the enable flag from the injected `env` | active | test-isolation | Both adapters are inside the declared target | `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` |
| R5-P2-001 | P2 | Three hooks gate on a `post_tool` field value the reference doc records as unobserved | traceability | `.vibe/plugins/repo-guards/post-edit-quality.mjs:45`, `.vibe/plugins/repo-guards/dist-freshness.mjs:106`, `.vibe/plugins/repo-guards/classifier-injection-screen.mjs:41` | All three read `payload.tool_status !== 'success'`; `guards-and-hooks.md:196-198` records the `post_tool` payload as documented rather than observed, and no OpenCode original has the gate | If the field carries another value, all three hooks go silent on every write and edit with no error | Capture one `post_tool` payload and confirm or replace the field | active | matrix/evidence | The three files and the reference doc are inside the declared target | `.vibe/plugins/repo-guards/post-edit-quality.mjs`, `.vibe/plugins/repo-guards/dist-freshness.mjs`, `.vibe/plugins/repo-guards/classifier-injection-screen.mjs` |
| R5-P2-002 | P2 | `dist-freshness.mjs` re-implements the shared `sessionDirFor` instead of importing it | maintainability | `.vibe/plugins/repo-guards/dist-freshness.mjs:53-55` | A local `sessionDirFor` duplicates `lib/hook-io.mjs:25-27`, while the file imports other helpers from that module and five other guards import the shared one | A change to the shared rule reaches five guards and not the sixth | Import the shared helper | active | instance-only | Both files are inside the declared target | `.vibe/plugins/repo-guards/dist-freshness.mjs`, `.vibe/plugins/repo-guards/lib/hook-io.mjs` |
| R5-P2-003 | P2 | The port map records a clean hook verdict for two plugins whose tool registrations the port drops | traceability | `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md:122,131` | The `env-secret-guard.js` and `system-skill-advisor.js` rows give the verdict `hook` with no loss note, while the same table records exactly this loss for `system-speckit-completion.js` at line 139 | An operator reading the map concludes the dotenv inspection tools and the advisor status tool are available; they are not | Add the loss note to both rows | active | matrix/evidence | The doc is the traceability surface the review focus names; the OpenCode plugins are read as the parity reference | `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` |

## 4. Remediation Workstreams

### P0

None.

### P1

1. **WS-1 - Acknowledge spec-gate advise delivery** (`R1-P1-001`). Add the `result.observe()` call to the advise path in `.vibe/plugins/repo-guards/spec-gate.mjs:72-78`, matching `claude:52`, `codex:69`, `cursor:50` and `devin:54`. Verify with a live scenario that runs two shell calls and asserts the notice appears once.

### P2 advisories

2. **WS-2 - Close the wire-format and payload assumptions** (`R1-P2-001`, `R2-P2-001`, `R5-P2-001`). Capture one `post_tool` payload from a `write_file` call; key `process_start` with its namespace; replace the `system_message` reply with the recorded `pre_tool` shape or record the field as supported.
3. **WS-3 - Restore fail-open and kill-switch coverage** (`R1-P2-002`, `R2-P2-003`, `R4-P2-001`). Move the cross-runtime import inside `runGuard`; add a goal-part kill switch and list it; release the hand-over claim only after a successful commit.
4. **WS-4 - Unify cwd resolution and the shared session helper** (`R1-P2-003`, `R3-P2-003`, `R5-P2-002`). Route `dispatch-preflight` and `turn-start` through `sessionDirFor`, and delete the local copy in `dist-freshness`.
5. **WS-5 - Bound the composer budgets and per-call work** (`R2-P2-002`, `R3-P2-001`). Give the `session-start` outer spawn budget headroom over the inner timeout; gate the `compaction-post-tool` hand-over part on the compaction signal.
6. **WS-6 - Honour the injected env seam and add composer test parity** (`R3-P2-002`, `R4-P2-002`, `R4-P2-003`). Thread the injected `env` through the three reads; add the `IS_CLI_ENTRY` guard and a test file to `session-start.mjs`.
7. **WS-7 - Correct the port map's per-plugin verdicts** (`R5-P2-003`). Add the dropped tool registrations to the two rows, matching the note the table already carries for `system-speckit-completion.js`.

## 5. Spec Seed

- Record the `post_tool` payload field set as observed or unobserved, and name the field that carries a call's outcome, so a guard can gate on it without inference.
- State the delivery-acknowledgement contract every advise-emitting guard must satisfy, and name `result.observe()` as the mechanism.
- State that every guard resolves a relative cwd against the checkout through `sessionDirFor`, and that no guard may re-implement it.
- Record the kill-switch table as the complete set of parts a composer may run, and require a switch for every part.
- Record the port map's per-plugin verdict as covering both the hook and the tool registrations, and require a loss note whenever a registration cannot port.

## 6. Plan Seed

- Add the `result.observe()` call to the spec-gate advise path and assert the notice is delivered once in a live scenario.
- Capture one `post_tool` payload from a `write_file` call and either confirm `tool_status === 'success'` or replace the three gates with the observed field.
- Move the `.opencode/plugins/session-cleanup.js` import inside `runGuard` so a missing sibling runtime cannot throw at module load.
- Replace the local `sessionDirFor` in `dist-freshness.mjs` with the `hook-io.mjs` import, and route `dispatch-preflight.mjs` and `turn-start.mjs` through the same resolver.
- Give the `session-start` outer spawn budget headroom over the inner `PROCESS_TIMEOUT_MS`, and add a kill switch for the goal part.
- Add a size gate to the `compaction-post-tool` hand-over part so the journal is not re-parsed on every tool call.
- Add the `IS_CLI_ENTRY` guard and a test file to `session-start.mjs`, matching the other three composers.
- Thread the injected `env` through `headReceiptDir()` and the two enable checks instead of reading `process.env`.
- Add the dropped tool registrations to the `env-secret-guard.js` and `system-skill-advisor.js` rows of the port map.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | partial | The binding count matches the doc exactly: 18 `[[hooks]]` entries in `.vibe/hooks.toml` and the same event split at `guards-and-hooks.md:37`. The `post_tool` field assumption (`guards-and-hooks.md:196-198`) and the two dropped tool registrations do not match. | The `post_tool` outcome field is documented rather than observed (`R5-P2-001`); the port map omits two losses (`R5-P2-003`); the `pre_tool` advise reply carries a field the recorded format does not (`R2-P2-001`). |
| `checklist_evidence` | notApplicable | No checklist document on a hook and plugin surface. | None. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `agent_cross_runtime` | partial | All 21 OpenCode plugins are classified at `guards-and-hooks.md:116-139`, and each `not needed` verdict names a reason. Two `hook` rows omit the tool registrations the port drops (`env-secret-guard.js:121-140`, `system-skill-advisor.js:24`). | `R5-P2-003`. |
| `playbook_capability` | partial | The playbook's verdict table is the live evidence for each binding, and the doc's own rule is that a row counts only when its run postdates the last change to that hook (`guards-and-hooks.md:37`). VIB-HK-018 covers `tool_status` for a shell call only. | No row covers a `write_file` or `edit` result (`R5-P2-001`). |
| `skill_agent` | pending | Not exercised by this lineage; no skill or agent surface is in the declared target. | None. |
| `feature_catalog_code` | pending | Not exercised by this lineage; no feature catalog entry is in the declared target. | None. |

### AC_COVERAGE

`exempt` - the target is a hook and plugin file set, not a lifecycle-active spec folder with an `acceptance-criteria.md` in scope.

## 8. Deferred Items

- **The `process_start` key upgrade trigger** (`R1-P2-001`). The finding stays P2 until one live payload shows a qualified `process_start` call missing the map. Capturing that payload is the trigger.
- **The `system_message` reply upgrade trigger** (`R2-P2-001`). The finding stays P2 until a live `pre_tool` reply shows the field is rejected or ignored. The recorded format is the only evidence either way.
- **The `post_tool` field upgrade trigger** (`R5-P2-001`). If a captured `post_tool` payload reports a successful call as anything other than `'success'`, this becomes P1, because three hooks go silent.
- **Live re-execution of the manual-testing playbook.** Out of scope for this lineage by the strategy's non-goals; the recorded verdicts are read as evidence.
- **The runtime-neutral guard cores** under `.skilled/hooks/*/lib/`. Out of scope except where a Vibe adapter's use of a core contract is the defect.

## Dimension Expansion Map

- Saturated directions: none.
- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Council artifact references: none.
- Selected review directions: correctness (guard seam, iteration 1), security (iteration 2), correctness (composers and reader, iteration 3), correctness (adapters, iteration 4), traceability and maintainability (iteration 5).
- Remaining frontier: none recorded. All four dimensions are complete and `maxIterations` is reached.

## 9. Search Ledger

- `searchCoverage`: `{requiredBugClasses: [], covered: [], ruledOut: [], deferred: [], blocked: [], graphCoverageMode: null}`
- `candidateCoverage`: `{covered: [], ruledOut: [], deferred: [], blocked: [], byBugClass: {}}`
- `searchDebt`: `[]` - hasSearchDebt: false.
- `ruledOutCandidates`: `[]`
- `cleanSearchProof`: `[]`

*No search-depth state captured (legacy v1 record).*

## 10. Audit Appendix

### Convergence summary

| Iteration | Dimension | New findings | P0 | P1 | P2 | newFindingsRatio |
|---|---|---|---|---|---|---|
| 1 | correctness (guard seam) | 4 | 0 | 1 | 3 | 1.0 |
| 2 | security | 3 | 0 | 0 | 3 | 1.0 |
| 3 | correctness (composers and reader) | 3 | 0 | 0 | 3 | 1.0 |
| 4 | correctness (adapters) | 3 | 0 | 0 | 3 | 1.0 |
| 5 | traceability and maintainability | 3 | 0 | 0 | 3 | 1.0 |

- Convergence score: 0. The run stopped on `maxIterationsReached`, not on convergence; convergence is telemetry only for this lineage by the strategy's stop conditions.
- Open findings: 16. Resolved: 0. Corruption warnings: 0. Field warnings: 0.
- Dimension coverage: 4 of 4 (`correctness`, `security`, `traceability`, `maintainability`).

### Coverage summary

- 27 declared target files, all read at least once across the five iterations.
- 18 `[[hooks]]` bindings in `.vibe/hooks.toml`, matching the reference doc's count and event split.
- 21 OpenCode plugins classified in the port map; 4 `not needed` verdicts, each with a reason.

### Ruled-out claims

- Journal segment ordering in the session reader: the live journal names are zero-padded to 16 digits, so the lexicographic sort equals numeric order.
- `deep-loop-guard.mjs` reading `tool_input.config_name`: confirmed as the real Vibe field by `guards-and-hooks.md:126` and live scenario VIB-HK-024.
- `toCoreCall` reading the wrong write path field: `tool_input.file_path` is confirmed for `file_system.write_file` and `file_system.edit` by `fixtures/wire-format/tool-names.md:8-9`.
- `spec-gate.mjs` and `spec-gate-classify.mjs` keying different state files: both resolve to the same key.
- `git-message-gate.mjs` having no kill switch: documented as deliberate at lines 8-9.
- `session-cleanup.mjs` not disposing the plugin at session start: `dispose()` runs the cleanup script, which is the session-end work.
- `spec-gate-classify` opening the gate for a subagent: `classifyIntent` returns before any state read when `isChildSession` is true.
- `mcp-route-guard` running on every `pre_tool` call: `coreToolNameFor` returns null for a non-MCP name.
- `post-edit-quality` command injection through an edited file's path: the router spawns without a shell.
- `compaction-post-tool` judging a non-`post_tool` payload: `buildPostToolPart` checks `hook_event_name` itself.
- `turn-end` requiring the completion part by an absolute path: `createRequire` accepts it and the path resolves correctly.
- A wrong relative root in any composer: each climbs the correct number of levels to the checkout.
- `appendAdvisoryLog` throwing and losing the pending advisory: the sentinel wraps its whole body and returns `false`.
- `claimNudge` throwing: it returns a no-op claim on any error.
- `earlyWithdrawn` growing without bound: each hook invocation is a fresh process and the entry is deleted in the same turn.
- `goal-inject` defaulting `workspace` to `process.cwd()`: both callers pass `REPO_ROOT` explicitly.
- A missing binding in `.vibe/hooks.toml`: the count is 18 and the event split matches the doc.
- An unclassified OpenCode plugin: all 21 rows are present.
- `post-edit-quality` running on a failed write: the `tool_status` gate covers it and a file that does not exist is skipped.
- `dist-freshness` throwing on a missing `python3`: `runChecker` returns `String(result.stdout ?? '')`, so a spawn error yields an empty banner.

### Sources reviewed

- `.vibe/hooks.toml`
- `.vibe/plugins/repo-guards/`: `spec-gate.mjs`, `spec-gate-classify.mjs`, `session-cleanup.mjs`, `dispatch-preflight.mjs`, `env-secret-guard.mjs`, `overlay-guard.mjs`, `git-message-gate.mjs`, `mcp-route-guard.mjs`, `deep-loop-guard.mjs`, `post-edit-quality.mjs`, `dist-freshness.mjs`, `classifier-injection-screen.mjs`, `render-home-hooks.cjs`, `lib/hook-io.mjs`, `fixtures/wire-format/tool-names.md`
- `.skilled/hooks/session-lifecycle/vibe/`: `session-start.mjs`, `turn-start.mjs`, `turn-end.mjs`, `compaction-post-tool.mjs`, `compaction-context.mjs`
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/session-handover/lib/nudge.cjs`
- `.skilled/hooks/goal/vibe/goal-inject.mjs`, `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`, `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs`
- `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/hooks/shared/hook-flags.cjs`
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`
- `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`
- Parity reference (read, not reviewed): `.opencode/plugins/env-secret-guard.js`, `system-skill-advisor.js`, `sk-code-post-edit-quality.js`, `system-dist-freshness-guard.js`, `classifier-injection-screen.js`
- Prior dispositions: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/023-vibe-review-remediation/implementation-summary.md`

### Cross-reference appendix

**Core Protocols**

- `spec_code` - partial. Binding set and event split match; the `post_tool` field assumption and the two dropped tool registrations do not.
- `checklist_evidence` - notApplicable. No checklist document on a hook and plugin surface.

**Overlay Protocols**

- `agent_cross_runtime` - partial. All 21 OpenCode plugins classified; two `hook` rows omit the tool registrations the port drops.
- `playbook_capability` - partial. VIB-HK-018 covers `tool_status` for a shell call only; no row covers a `write_file` or `edit` result.
- `skill_agent` - pending. Not exercised; no skill or agent surface in the declared target.
- `feature_catalog_code` - pending. Not exercised; no feature catalog entry in the declared target.

Review verdict: CONDITIONAL
