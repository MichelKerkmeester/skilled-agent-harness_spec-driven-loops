# Deep Review Report — Vibe hooks and plugins (lineage `vibe-1`)

- Spec folder: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation`
- Artifact directory: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/review/lineages/vibe-1`
- Session: `fanout-vibe-1-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model `deepseek-flash`
- Iterations: 5 of 5 (`config.maxIterations` = 5, stopPolicy `max-iterations`)
- Stop reason: `maxIterationsReached`

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: false** — the verdict is CONDITIONAL because an active P1 remains, not because of advisories.
- **P0/P1/P2 counts: 0 / 1 / 15.** These are the counts the verdict used, read from `deep-review-findings-registry.json` by `review-verdict.cjs` (`active_p0: 0`, `active_p1: 1`, `active_p2: 15`, `search_debt: 0`, `failed_required_gate_ids: []`).
- **Review scope:** 27 files — `.vibe/hooks.toml` (18 bindings), the 13 `.vibe/plugins/repo-guards/*.mjs` scripts, `render-home-hooks.cjs`, `lib/hook-io.mjs`, the five `.skilled/hooks/session-lifecycle/vibe/` modules, the ask-surface, decision-capture, goal and session-handover Vibe adapters, the Vibe session reader, the skill-advisor Vibe part and the completion-evidence Vibe part. Four dimensions ran one full iteration each, and a fifth pass swept the residual cross-references.
- **Operator review focus:** Every Mistral Vibe hook and plugin: the bindings in `.vibe/hooks.toml`, the repo-guards plugins and lib/hook-io.mjs, render-home-hooks.cjs, the session-lifecycle composers (turn-start, turn-end, session-start, compaction), the goal, hand-over, ask-surface, decision-capture, completion and skill-advisor adapters, and the Vibe session reader. Find correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins. 29 findings from the previous review are dispositioned in `023-vibe-review-remediation/implementation-summary.md`: report only new or still-open issues, each with file:line evidence.

### Self-check outcomes

Listed apart from the counts, as the adversarial self-check recorded them.

| Finding | Self-check outcome |
|---|---|
| `R1-P1-001` | **Confirmed at P1, confidence medium.** Hunter found the unverified `process_start` key; Skeptic could not find a capture or a documented key anywhere under `fixtures/`; Referee held P1 because six shell guards fail open on the same assumption. Downgrade trigger recorded and still unfired. |
| `R1-P2-001` | **Downgraded from a candidate P1 to P2 in iteration 5.** The Skeptic found `spec-gate.mjs:73-75`, which documents that `additional_context` is ignored on `pre_tool` and that `system_message` was chosen deliberately. The finding survives only as the undocumented field on a strict hook plus the missing `advise`-path scenario. |
| `R2-P2-001` | **Held at P2 against a P1 candidate.** The Referee weighed the still-open class against the runtime-set `payload.cwd` and the fixed relative path, and kept P2 with the class named. |
| `R3-P2-002` | **Confirmed at P2, not raised to P1.** VIB-HK-016's live pass proves the reply field works, so the defect is the table's completeness rather than a runtime break. |
| `R4-P2-003` | **Narrowed in iteration 5.** The verdict table shows all three adapters have a live scenario, so the finding is an automated-test gap rather than a verification gap. Severity unchanged at P2. |
| `R5-P2-001` | **Confirmed at P2.** The scenario census against the binding census leaves exactly one uncovered binding, and the same adapter is the one with no test and no import guard. |
| `R1-P2-004`, `R1-P2-005` | **Confirmed at P2 as parity defects, not runtime breaks.** Both have live scenarios that pass (VIB-HK-021, VIB-HK-012). |
| `R2-P2-003` | **Held at P2 with a stated limit.** The check is complete for the current single-line `hooks.toml`; the finding is about coverage of a form the file does not use. |

## 2. Planning Trigger

`/speckit:plan` **is required**. The verdict is CONDITIONAL with one active P1, and the P1 is a fail-open seam that six shell guards depend on.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": 16,
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Verify or hedge the process_start payload contract",
      "findingIds": ["R1-P1-001", "R3-P2-003"],
      "surfaces": [
        ".vibe/plugins/repo-guards/lib/hook-io.mjs",
        ".vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md"
      ],
      "exitCriterion": "A captured process_start payload is checked in and CORE_TOOL_NAMES plus toCoreCall are keyed on the spelling and the tool_input key it records, or both spellings are hedged as deep-loop-guard.mjs:32 already does."
    },
    {
      "id": "WS-2",
      "priority": "P2",
      "title": "Close the payload-path and kill-switch gaps",
      "findingIds": ["R2-P2-001", "R2-P2-002", "R2-P2-003"],
      "surfaces": [
        ".skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs",
        ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs",
        ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs",
        ".vibe/plugins/repo-guards/render-home-hooks.cjs"
      ],
      "exitCriterion": "Every adapter that derives a filesystem root from payload.cwd applies the compaction-context.mjs:76-88 guard, buildPostToolPart consults isHookEnabled, and the renderer's leftover-substitution check covers multi-line strings."
    },
    {
      "id": "WS-3",
      "priority": "P2",
      "title": "Correct the reference document and the reply contract",
      "findingIds": ["R3-P2-001", "R3-P2-002", "R4-P2-002"],
      "surfaces": [
        ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md",
        ".vibe/plugins/repo-guards/lib/hook-io.mjs"
      ],
      "exitCriterion": "guards-and-hooks.md:37 states the post_tool strictness correctly, the reply table lists hook_specific_output.additional_context, and one shared reply writer replaces the eight hand-rolled sites."
    },
    {
      "id": "WS-4",
      "priority": "P2",
      "title": "Close the verification gaps",
      "findingIds": ["R4-P2-001", "R4-P2-003", "R5-P2-001"],
      "surfaces": [
        ".skilled/hooks/session-lifecycle/vibe/session-start.mjs",
        ".vibe/plugins/repo-guards/deep-loop-guard.mjs",
        ".skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs",
        ".skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs"
      ],
      "exitCriterion": "session-start.mjs guards its main() call and exports its composer, and the four adapters with no automated test each gain one."
    },
    {
      "id": "WS-5",
      "priority": "P2",
      "title": "Resolve the remaining correctness and parity items",
      "findingIds": ["R1-P2-001", "R1-P2-002", "R1-P2-003", "R1-P2-004", "R1-P2-005"],
      "surfaces": [
        ".vibe/plugins/repo-guards/spec-gate.mjs",
        ".vibe/hooks.toml",
        ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs",
        ".vibe/plugins/repo-guards/session-cleanup.mjs",
        ".vibe/plugins/repo-guards/overlay-guard.mjs"
      ],
      "exitCriterion": "Each item is either fixed or recorded as an accepted trade-off with the reason in the file, as git-message-gate.mjs:9 already does for its missing kill switch."
    }
  ],
  "specSeed": [
    "Record the process_start wire contract: its tool_name spelling and its tool_input key, captured from a live run, as the fixture table's sixth row.",
    "State the reply contract once: which fields each hook type accepts, with hook_specific_output.additional_context listed for the types that use it.",
    "State the payload-path rule once, as compaction-context.mjs:72-77 already words it, and name every adapter that must apply it.",
    "State the kill-switch rule: every bound hook consults isHookEnabled or isGuardEnabled, or documents in the file why it does not.",
    "State the verification rule: every binding has either an adapter-level test or a playbook scenario with a recorded PASS."
  ],
  "planSeed": [
    "Capture a process_start payload with a record-only pre_tool hook and check the capture in under fixtures/wire-format/.",
    "Key CORE_TOOL_NAMES and toCoreCall on the captured spelling and key, hedging both spellings the way deep-loop-guard.mjs:32 does.",
    "Extract the payload-path guard from compaction-context.mjs:76-88 into a shared helper and apply it in completion-evidence-post-agent.cjs, turn-start.mjs, ask-capture-post-tool.mjs and ask-surface-core.cjs recordFire.",
    "Add an isHookEnabled check to buildPostToolPart and a match selector or a documented reason to the compaction-post-tool binding.",
    "Add a shared reply writer to hook-io.mjs and route the eight hook_specific_output sites through it.",
    "Correct guards-and-hooks.md:37 and extend the reply table at :203-212.",
    "Guard session-start.mjs's main() call behind IS_CLI_ENTRY, export its composer, and add a test.",
    "Add adapter-level tests for deep-loop-guard.mjs, ask-surface-post-agent.mjs and completion-evidence-post-agent.cjs.",
    "Add a playbook scenario for the session_start binding and record its verdict row."
  ],
  "findingClasses": [
    "fail-open-on-unverified-payload",
    "unverified-reply-channel",
    "inconsistent-subagent-scope",
    "inconsistent-path-resolution",
    "cross-runtime-coupling",
    "dead-binding",
    "unguarded-payload-path",
    "kill-switch-gap",
    "incomplete-refusal-check",
    "stale-document-claim",
    "incomplete-reply-contract",
    "unhedged-name-mapping",
    "untestable-entry-point",
    "duplicated-contract",
    "untested-adapter-layer",
    "unverified-binding"
  ],
  "affectedSurfacesSeed": [
    ".vibe/hooks.toml",
    ".vibe/plugins/repo-guards/lib/hook-io.mjs",
    ".vibe/plugins/repo-guards/spec-gate.mjs",
    ".vibe/plugins/repo-guards/session-cleanup.mjs",
    ".vibe/plugins/repo-guards/overlay-guard.mjs",
    ".vibe/plugins/repo-guards/render-home-hooks.cjs",
    ".vibe/plugins/repo-guards/deep-loop-guard.mjs",
    ".vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md",
    ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs",
    ".skilled/hooks/session-lifecycle/vibe/session-start.mjs",
    ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs",
    ".skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs",
    ".skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs",
    ".skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs",
    ".skilled/hooks/decision-capture/lib/capture-core.mjs",
    ".skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md",
    ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

16 active findings, 0 resolved. Every one carries `file:line` evidence, a `findingClass`, a `scopeProof` and `affectedSurfaceHints` in the iteration deltas.

### P0 — Blockers

None.

### P1 — Required

**`R1-P1-001` — `process_start` is mapped onto the shell shape without a recorded `tool_input` key, so every shell guard fails open on a background command**
- Dimension: correctness · Confidence: medium · Class: `fail-open-on-unverified-payload`
- Evidence: `.vibe/plugins/repo-guards/lib/hook-io.mjs:37` maps `process_start` to `bash`; `toCoreCall` at `:82` builds the core call from `input.command` alone. No capture and no reference records which key a `process_start` payload carries: `fixtures/wire-format/tool-names.md:13` names the tool but lists `tool_input` keys only for the five captured tools, and `guards-and-hooks.md:234` pins only the `re:bash|process_start` selector.
- Impact: if the key is anything other than `command`, `spec-gate.mjs:59`, `env-secret-guard.mjs:23`, `dispatch-preflight.mjs:46`, `overlay-guard.mjs:42`, `git-message-gate.mjs:42` and `dist-freshness.mjs:93` each take their empty-command allow branch. A background shell command would reach the shell with no dotenv guard, no dispatch hard-rule check, no git-message check and no spec gate.
- Fix: capture a `process_start` payload, check the capture in, and key the map and `toCoreCall` on what it records.
- Scope proof: the mapping is the single seam every shell-shaped guard reads; the six call sites are the complete set of consumers of `call.input.command`.
- Affected surfaces: `hook-io.mjs`, `spec-gate.mjs`, `env-secret-guard.mjs`, `dispatch-preflight.mjs`, `overlay-guard.mjs`, `git-message-gate.mjs`, `dist-freshness.mjs`, `fixtures/wire-format/`
- Disposition: open · Downgrade trigger: a captured payload showing `tool_input.command`

### P2 — Suggestions

| ID | Title | Dimension | File:line | Class | Confidence |
|---|---|---|---|---|---|
| `R1-P2-001` | The spec gate's advisory reply uses a field the reference documents only for `session_start`, on a hook declared `strict` | correctness | `.vibe/plugins/repo-guards/spec-gate.mjs:76` | `unverified-reply-channel` | low |
| `R1-P2-002` | `compaction-post-tool` has no `match`, so the goal slice reaches subagent sessions while the hand-over part in the same hook excludes them | correctness | `.vibe/hooks.toml:124` | `inconsistent-subagent-scope` | medium |
| `R1-P2-003` | Two cwd conventions: `sessionDirFor` resolves against `REPO_ROOT`, five adapters read `payload.cwd` raw | correctness | `.vibe/plugins/repo-guards/lib/hook-io.mjs:25` | `inconsistent-path-resolution` | medium |
| `R1-P2-004` | `session-cleanup.mjs` imports `.opencode/plugins/session-cleanup.js` directly, contradicting the reference's "Vibe never imports OpenCode's plugins" | correctness | `.vibe/plugins/repo-guards/session-cleanup.mjs:16` | `cross-runtime-coupling` | high |
| `R1-P2-005` | `overlay-guard` is registered for `bash\|process_start` but allows both | correctness | `.vibe/hooks.toml:61` | `dead-binding` | high |
| `R2-P2-001` | Three adapters create a directory tree at a payload-named path, and one then deletes a file there | security | `completion-evidence-post-agent.cjs:62-66` | `unguarded-payload-path` | high |
| `R2-P2-002` | `compaction-post-tool` fires on every tool call and its compaction half consults no kill switch, while the hand-over half does | security | `compaction-context.mjs:350-380` | `kill-switch-gap` | high |
| `R2-P2-003` | The home renderer's leftover-substitution check inspects only `command =` lines, so a multi-line TOML string hides a substitution | security | `render-home-hooks.cjs:94-99` | `incomplete-refusal-check` | medium |
| `R3-P2-001` | The reference calls all six `post_tool` bindings non-strict while one is declared strict, and says a strict `post_tool` failure clears the tool result | traceability | `guards-and-hooks.md:37` | `stale-document-claim` | high |
| `R3-P2-002` | The reply table names only `decision`/`reason` and calls every other shape a schema mismatch, while eight hooks reply with `hook_specific_output.additional_context` | traceability | `guards-and-hooks.md:203-212` | `incomplete-reply-contract` | high |
| `R3-P2-003` | The shared tool-name seam keys `process_start` on the bare spelling only, while the fixture says names are always qualified and one guard hedges both | traceability | `hook-io.mjs:33-39` | `unhedged-name-mapping` | medium |
| `R4-P2-001` | `session-start.mjs` calls `main()` at module scope with no `IS_CLI_ENTRY` guard and exports nothing, so it cannot be imported, and it is the only one of the five with no test | maintainability | `session-start.mjs:145` | `untestable-entry-point` | high |
| `R4-P2-002` | Eight adapters hand-roll the same reply write and four hand-roll the same stdin read, while the shared seam exports a reader for one tree and no writer for either | maintainability | `hook-io.mjs:44-56` | `duplicated-contract` | high |
| `R4-P2-003` | Three Vibe adapters have no test reference anywhere, and they are exactly the three that carry this lineage's findings | maintainability | `deep-loop-guard.mjs:1-122` | `untested-adapter-layer` | high |
| `R5-P2-001` | `session-start` is the only one of the 18 bindings with no playbook scenario, and its adapter is also the only one with no unit test and no import guard | cross-reference | `session-start.mjs:1-147` | `unverified-binding` | high |

## 4. Remediation Workstreams

**P1 first.**

1. **WS-1 — Verify or hedge the `process_start` payload contract** (`R1-P1-001`, `R3-P2-003`). One capture closes both: the `tool_input` key and the `tool_name` spelling. Until then six shell guards rest on an assumption and the shared map is the only place in the bundle that does not hedge a spelling `deep-loop-guard.mjs:32` already hedges.

**Then the P2 advisories, grouped by the surface they touch.**

2. **WS-2 — Payload paths and kill switches** (`R2-P2-001`, `R2-P2-002`, `R2-P2-003`). The guard already exists at `compaction-context.mjs:76-88`; the work is applying it in three more adapters, adding one `isHookEnabled` call, and widening one line filter.
3. **WS-3 — The reference document and the reply contract** (`R3-P2-001`, `R3-P2-002`, `R4-P2-002`). Two document corrections and one shared writer. Doing the writer first makes the document correction a description of the code rather than a second convention.
4. **WS-4 — Verification gaps** (`R4-P2-001`, `R4-P2-003`, `R5-P2-001`). One import guard unblocks the `session-start` test, which closes the last uncovered binding.
5. **WS-5 — Remaining correctness and parity items** (`R1-P2-001` to `R1-P2-005`). Each is either a fix or an accepted trade-off recorded in the file, the way `git-message-gate.mjs:9` records its missing kill switch.

## 5. Spec Seed

- Record the `process_start` wire contract — its `tool_name` spelling and its `tool_input` key — as the fixture table's sixth row, captured from a live run.
- State the reply contract once: which fields each hook type accepts, with `hook_specific_output.additional_context` listed for the types that use it.
- State the payload-path rule once, in the words `compaction-context.mjs:72-77` already uses, and name every adapter that must apply it.
- State the kill-switch rule: every bound hook consults `isHookEnabled` or `isGuardEnabled`, or documents in the file why it does not.
- State the verification rule: every binding has either an adapter-level test or a playbook scenario with a recorded PASS.
- Correct the binding census at `guards-and-hooks.md:37` to match `hooks.toml:91`.

## 6. Plan Seed

1. Capture a `process_start` payload with a record-only `pre_tool` hook and check the capture in under `fixtures/wire-format/`.
2. Key `CORE_TOOL_NAMES` and `toCoreCall` on the captured spelling and key, hedging both spellings the way `deep-loop-guard.mjs:32` does.
3. Extract the payload-path guard from `compaction-context.mjs:76-88` into a shared helper and apply it in `completion-evidence-post-agent.cjs`, `turn-start.mjs`, `ask-capture-post-tool.mjs` and `ask-surface-core.cjs` `recordFire`.
4. Add an `isHookEnabled` check to `buildPostToolPart`, and either a `match` selector or a documented reason to the `compaction-post-tool` binding.
5. Add a shared reply writer to `hook-io.mjs` and route the eight `hook_specific_output` sites through it.
6. Correct `guards-and-hooks.md:37` and extend the reply table at `:203-212`.
7. Guard `session-start.mjs`'s `main()` call behind `IS_CLI_ENTRY`, export its composer, and add a test.
8. Add adapter-level tests for `deep-loop-guard.mjs`, `ask-surface-post-agent.mjs` and `completion-evidence-post-agent.cjs`.
9. Add a playbook scenario for the `session_start` binding and record its verdict row.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | pass | `.vibe/hooks.toml:7-150` against `guards-and-hooks.md:37`; the 18-binding census matches on every count and the 21-row classification names only bindings that exist | Two claims fail and are raised as findings: the `post_tool` strictness adjective (`R3-P2-001`) and the fixture's always-qualified statement against the bare `process_start` key (`R3-P2-003`) |
| `checklist_evidence` | notApplicable | `023-vibe-review-remediation/implementation-summary.md` | The declared target is a file set, not a spec folder with a checklist; the disposition table is an exclusion list |

### Overlay Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `skill_agent` | pass | `guards-and-hooks.md:131,155` against `turn-start.mjs:160-172` and `prompt-advisor.mjs`; VIB-HK-003 and VIB-HK-028 passed live | None |
| `agent_cross_runtime` | pass | `.opencode/plugins/overlay-guard.js:80-125`, `.opencode/plugins/session-cleanup.js:112-375`; VIB-HK-012 and VIB-HK-021 passed live | The two parity defects are `R1-P2-004` and `R1-P2-005`; both are coupling defects, not runtime breaks |
| `feature_catalog_code` | notApplicable | `.vibe/hooks.toml:1-150` | No feature catalogue covers this file set |
| `playbook_capability` | pass, one gap | `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md` — 27 PASS, 0 FAIL, 0 OPERATOR-ONLY; 26 runner rows and 1 hand-driven hop, every runner row dated 2026-11-15 after the hand-over hardening merge | `session-start` is the only binding with no scenario, raised as `R5-P2-001` |

**`AC_COVERAGE`: exempt.** The declared target is a file set, not a lifecycle-active spec folder, so no acceptance-criteria coverage applies.

**Resource Map Coverage Gate: skipped.** No `resource-map.md` exists for this packet, so the gate does not apply.

## 8. Deferred Items

- **`R1-P2-001`'s `advise` path has no live scenario.** VIB-HK-002 exercises the deny path only. A scenario that drives a `bash` call while the gate is open would settle whether a strict `pre_tool` hook may return `system_message`. Deferred because it needs a live keyed run, not a code change.
- **`R2-P2-003` depends on a `hooks.toml` form the file does not use.** Every entry today is a single-line `command = "..."`, so the check is complete for the current file. Worth fixing when the renderer next changes, not before.
- **The `post_tool` payload shape remains documented rather than observed.** `guards-and-hooks.md:196` states that only the `pre_tool` and `post_agent` payloads were captured. A `post_tool` capture would let a future review verify the field list instead of citing it.
- **`prompt-advisor.mjs`'s `headReceiptDir` reads `process.env` rather than the injected `env`.** Ruled out as a production defect in iteration 1 and left as a test-isolation note.
- **The `.skilled/hooks/*/vibe/` symlink farm.** Eleven entries are symlinks into `.vibe/plugins/repo-guards/`. It works because Node resolves `./lib/hook-io.mjs` against the realpath, but it is a packaging surface worth a note in the spec rather than a finding.

## Dimension Expansion Map

- **Dimensions completed:** correctness (iteration 1), security (iteration 2), traceability (iteration 3), maintainability (iteration 4), cross-reference sweep (iteration 5). Coverage 4/4 declared, plus the sweep.
- **Completed pivots:** 0. **Failed pivots:** 0. **Audited overrides:** 0.
- **Saturated directions:** none. Each dimension produced new findings on its first pass, so no direction was retried.
- **Selected review directions:** the payload seam and the binding census (1), the trust boundaries and the kill-switch census (2), the reference document as a claim set (3), testability and the reply contract (4), the scenario census against the binding census (5).
- **Remaining frontier:** none recorded. The cap was reached with all four dimensions and the sweep complete.

## 9. Search Ledger

- **`searchCoverage`:** five bug-class sets were required and covered across the run — `fail_open`, `payload_mismatch`, `path_resolution`, `cross_runtime_coupling`, `dead_binding` (iteration 1); `unguarded_payload_path`, `kill_switch_gap`, `incomplete_refusal_check`, `self_injection`, `tool_coverage_gap` (2); `stale_document_claim`, `incomplete_reply_contract`, `unhedged_name_mapping`, `missing_port`, `parity_gap` (3); `untestable_entry_point`, `duplicated_contract`, `untested_adapter_layer`, `god_module`, `duplicated_tree` (4); `unverified_binding`, `stale_finding`, `stale_verdict`, `misdeclared_binding`, `uncovered_dimension` (5).
- **`searchDebt`:** empty. `search_debt: 0` in the verdict input, and the reducer reported `searchDebtCount: 0` after every iteration.
- **`ruledOutCandidates`:** 24 candidates were searched and ruled out with evidence, recorded in the iteration `Ruled Out` sections and the strategy's `RULED OUT DIRECTIONS`. The load-bearing ones: `payload.tool_status` absence, the strict `post_tool` reply shape, `env-secret-guard`'s kill switch and tool coverage, `overlay-guard`'s bash filter as a parity defect, `session-cleanup`'s partial context, `readVibeUsage`'s journal read, `mcp-route-guard`'s missing `match`, `deep-loop-guard`'s `config_name` read, the classification table's three `not needed` rows, the `.skilled/hooks/*/vibe/` tree as a duplicate, `compaction-context.mjs` as a god module, and the verdict table as stale evidence.
- **`cleanSearchProof`:** every required bug class has at least one search action with `file:line` evidence in the iteration deltas, and no class was left unsearched. `corruptionCount: 0` and `searchDebtCount: 0` after all five reducer runs.

## 10. Audit Appendix

### Convergence summary

| Iteration | Dimension | Findings | New ratio | Open after | Convergence |
|---|---|---|---|---|---|
| 1 | correctness | 6 (1 P1, 5 P2) | 1.0 | 6 | — |
| 2 | security | 3 (3 P2) | 0.2308 | 9 | 0.7692 |
| 3 | traceability | 3 (3 P2) | 0.1875 | 12 | 0.8125 |
| 4 | maintainability | 3 (3 P2) | 0.1579 | 15 | 0.8421 |
| 5 | cross-reference | 1 (1 P2) + 3 refinements | 0.125 | 16 | 0.875 |

The lineage stopped on `maxIterationsReached`, not on convergence. `config.convergenceThreshold` is 0.1 and the new-findings ratio fell from 1.0 to 0.125 across the run, but the stop policy is `max-iterations`, so convergence is telemetry only.

### Coverage summary

- 27 target files, all read at least once; 18 bindings, all traced to a script.
- 4 declared dimensions, all covered; 1 cross-reference sweep, complete.
- 6 core and overlay protocols: 4 pass, 2 notApplicable, 0 fail.
- 16 active findings, 0 resolved, 0 P0.

### Ruled-out claims

24 candidates were ruled out with evidence; the full list is in the strategy's `RULED OUT DIRECTIONS` and each iteration's `Ruled Out` section. The three that most change how the result should be read:

- **The bundle is not unverified.** 17 of 18 bindings have a live playbook scenario with a recorded PASS on 2026-11-15, and the verdict table records its own rerun history. The one gap is `session-start`.
- **The reply field works.** VIB-HK-016 passed with `post-edit-quality` returning `hook_specific_output.additional_context` and the tool output intact, so `R3-P2-002` is a documentation defect and not a runtime one.
- **The `.skilled/hooks/*/vibe/` tree is not a duplicate.** Eleven entries are symlinks into `.vibe/plugins/repo-guards/`, so there is no second copy to drift.

### Sources reviewed

- `.vibe/hooks.toml` — all 18 bindings.
- `.vibe/plugins/repo-guards/` — 13 scripts, `lib/hook-io.mjs`, `render-home-hooks.cjs`, `fixtures/wire-format/tool-names.md`, `tests/`.
- `.skilled/hooks/session-lifecycle/vibe/` — `turn-start.mjs`, `turn-end.mjs`, `session-start.mjs`, `compaction-context.mjs`, `compaction-post-tool.mjs`.
- `.skilled/hooks/{ask-surface-guard,decision-capture,goal,session-handover}/vibe/` and their `lib/` cores where an adapter's call into them was the defect.
- `.skilled/hooks/shared/session-readers/vibe.mjs`.
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`.
- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`.
- Context evidence: `guards-and-hooks.md` sections 1-5, `manual-testing-playbook.md`, the 28 `hook-scenarios/*.md` files, `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`, `023-vibe-review-remediation/implementation-summary.md`, `.opencode/plugins/overlay-guard.js`, `.opencode/plugins/session-cleanup.js`, `.opencode/plugins/lib/v2-bridge.js`.

### Cross-reference appendix

**Core Protocols:** `spec_code` pass, `checklist_evidence` notApplicable.
**Overlay Protocols:** `skill_agent` pass, `agent_cross_runtime` pass, `feature_catalog_code` notApplicable, `playbook_capability` pass with one gap.

### State integrity

- `deep-review-state.jsonl`: 6 lines — 1 config row and 5 iteration records, each carrying `"iteration":N`, `"mode":"review"`, `"target_agent":"deep-review"`, `"agent_definition_loaded":true` and `"resolved_route":"Resolved route: mode=review target_agent=deep-review"`.
- Gateway receipts: run-open sequence 1, iterations 2 through 6, all `ok:true` with `projectionRefreshed:true`.
- Deltas: `iter-001.jsonl` (16 lines), `iter-002.jsonl` (24), `iter-003.jsonl` (25), `iter-004.jsonl` (27), `iter-005.jsonl` (19). Every line parses as JSON.
- Reducer: run after every iteration with `--create-missing-anchors`; `corruptionCount: 0` and `searchDebtCount: 0` on every run.
- No review target, config, registry, dashboard, command, skill, canonical agent or runtime mirror was modified. Every write landed inside the lineage directory.

Review verdict: CONDITIONAL
