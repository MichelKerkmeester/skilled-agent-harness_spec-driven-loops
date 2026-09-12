---
title: "Deep Review Report — Goal Unification Build (second pass)"
trigger_phrases: []
---
# Deep Review Report — Goal Unification Build (second pass)

## Executive Summary

**Verdict: PASS (advisories)**
**Release readiness:** `advisories-open` (no P0 or P1 in this lineage; seven P2 advisories)
**hasAdvisories:** `true`
**Active findings:** P0=0, P1=0, P2=7 (7 total, 0 resolved)

This five-iteration second pass re-reviewed the goal unification build behind the phase-007 packet, after the first lineage's three iterations and its remediation round. The scope named six axes to go deeper on; two of them produced reproduced defects rather than repeats:

- **F101** (P2, correctness) — the per-packet log lock is scoped to the *state directory*, not the packet. Two sessions that do not share a state directory never contend: 20 concurrent pairs against one packet left 9 of 20 and 11 of 20 rows in the table, every process reporting `STATUS=OK ACTION=log`. The same experiment with a shared state directory landed every row, so the loss is the scope, not the algorithm.
- **F102** (P2, correctness) — the runtime extractor and the validator's goal rule now measure *different durable slices* of the same document. The pass-1 fix widened the runtime fence to tolerate trailing whitespace (`.opencode/hooks/goal/lib/goal-slice.cjs:24`) and the validator's copy was not widened with it (`spec-doc-structure.ts:1028`), so a tolerant fence makes the validator count the frontmatter: 3903 characters (runtime, warn) against 4008 (validator, over) on one fixture, with the delta exactly the frontmatter. ADR-003's promised golden pin against `continuity-freshness.ts:17` still does not exist.
- **F103** (P2, traceability) — the plugin's bind still resolves the packet against the directory it was handed. The core walks up to the repo root (`goal-core.cjs:135-144`); the plugin does not (`opencode-goal.js:1817`). Reproduced: core binds from a subdirectory, plugin raises `PACKET_GOAL_NOT_FOUND`. Pass-1 F013 was closed by deleting a dead ternary without adding the walk, so the claimed fix is incomplete.
- **F104** (P2, traceability) — three speckit command contracts still tell an executor that a *direct table-row append* is an acceptable alternative to the log action — the one write path the core serializes and guards — and on OpenCode (whose plugin exposes no `log`) it is the only path.
- **F105** (P2, traceability) — the plugin's session-free `packet` read omits `packet_budget`, which its own CLI twin prints.
- **F106** (P2, traceability) — the "set-time budget report" the packet lists among its fixed P1s exists for a *packet bind* only; a plain-text `set` still truncates at 4,000 characters with an ellipsis and no warning (reproduced: 5,000 characters in, 4,000 ending in `...` out, `STATUS=OK`).
- **F107** (P2, traceability) — two Devin `UserPromptSubmit` hooks write the same `hookSpecificOutput.additionalContext` field, and nothing in the repository records which one the host keeps.

No P0 or P1 was found, so the packet's success criterion ("deep review reports no open P0 or P1") survives this pass, and this lineage adds no merge-blocking restriction. The three reproduced advisories are the ones worth scheduling: a data-loss scope, a false-fail measurement, and an incomplete parity fix.

No reviewed source was changed. Every write from this lineage is an artifact inside `review/lineages/deepseek-review-2`.

## Prior-Lineage Verification

The review scope required reading `lineages/deepseek-review/review-report.md` first and not re-reporting a closed finding unless the fix is wrong. Verified at the cited lines:

| Prior finding | Status in this pass | Evidence |
|---|---|---|
| F001 extractor boundary | fixed in the runtime | tolerant fence strips frontmatter; slice suite pins it; the validator half is new as F102 |
| F002 pointer-less render | reconciled | ADR-001/ADR-002 now carry the plain-text exception (`decision-record.md:69`, `:164`) |
| F003 set-time budget check | partial | bound path reports the tier; text path still silent → F106 |
| F005 symlink escape | fixed | realpath containment in `resolvePacketDir` (`goal-slice.cjs:155-168`), pinned by the slice suite |
| F010 OpenCode reminder | fixed | `appendGoalBrief` appends it; plugin tool-path test pins present-then-cleared |
| F011 changelog Devin | fixed | `CHANGELOG-v4.0.0.0.md:305` now agrees with `:303` |
| F012 009 REQ-010 | fixed | `specs/hooks/009-goal-isolation/spec.md:150` carries the superseding note |
| F013 workspace resolution | **incomplete** | dead ternary removed; repo-root walk absent → F103 |
| F015 Cursor hint | fixed | `.cursor/commands/goal-cursor.md:2-3` lists `packet` only |
| F004, F006, F007, F009, F014 | still open (recorded) | unchanged from the packet's Known Limitations; F006 is now reproduced as F101 |

## Remediation Trigger

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id":"F101","severity":"P2","findingClass":"lock-scope","title":"Per-packet log lock is scoped to the state directory, so two sessions with different state directories silently lose log rows"},
    {"id":"F102","severity":"P2","findingClass":"measurement-drift","title":"Runtime extractor and validator measure different durable slices once a fence carries trailing whitespace"},
    {"id":"F103","severity":"P2","findingClass":"runtime-parity-gap","title":"Plugin still resolves a packet against the directory it was handed, so a bind from a subdirectory fails where the core succeeds"},
    {"id":"F104","severity":"P2","findingClass":"instruction-vs-contract","title":"Speckit YAML sanctions a direct table-row append, the one write path the core serializes and guards"},
    {"id":"F105","severity":"P2","findingClass":"surface-parity-gap","title":"Plugin packet action omits the budget field its CLI twin prints"},
    {"id":"F106","severity":"P2","findingClass":"stale-completion-claim","title":"Set-time budget report exists only for a packet bind; a plain-text objective still truncates at 4000 characters with no signal"},
    {"id":"F107","severity":"P2","findingClass":"integration-risk","title":"Two Devin UserPromptSubmit hooks write the same additionalContext field and the host merge rule is unrecorded"}
  ],
  "remediationWorkstreams": [
    "WS1 lock scope: make the packet lock live where the packet does, or document the state-dir precondition (F101)",
    "WS2 extractor parity: one fence matcher for the runtime and the validator plus the golden test ADR-003 promises (F102)",
    "WS3 runtime parity: repo-root resolution and the packet-read field set on the plugin (F103, F105)",
    "WS4 instruction and claim hygiene: the YAML log rule, the set-time report claim, the Devin hook chain (F104, F106, F107)"
  ],
  "specSeed": [
    "Define one fence matcher both surfaces import or test against, and add the tolerant-fence fixture the vitest suite lacks.",
    "Resolve every packet path through the repo-root walk on all runtimes, and emit the same packet-read field set on both management surfaces.",
    "Either implement the consumer-side set check ADR-006 promises or amend the ADR and the packet log to scope it to a packet bind."
  ],
  "planSeed": [
    "WS1 and WS2 are code-only and test-pinned; WS3 is plugin work with an existing test seam; WS4 is document and host-verification work.",
    "The packet's own sweep (validate.sh --strict on 036, the hook and plugin suites, the vitest rule suite, the drift check, the hygiene scan) is the gate after any remediation."
  ]
}
```

## Findings

### P0 — Blockers

- None.

### P1 — Required

- None.

### P2 — Suggestions

- **F101** — Per-packet log lock is scoped to the state directory, so two sessions with different state directories silently lose log rows — `.opencode/hooks/goal/lib/goal-core.cjs:1050` (ADR-004; README `:60`). The lock name carries workspace plus packet path (`:894-896`) but the directory comes from `resolveStateDir` (`:151-162`), which honors `OPENCODE_GOAL_STATE_DIR`; writers that never meet both pass the durable-slice guard (`:1069-1073`) and the second rename discards the first row. Reproduced: same state dir landed both rows; divergent dirs left 9 of 20 and 11 of 20 rows.
- **F102** — Runtime extractor and validator measure different durable slices once a fence carries trailing whitespace — `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1028` (ADR-003, ADR-006). The runtime tolerates `[ \t]*` on both fences (`goal-slice.cjs:24`); the validator's copy does not, so the frontmatter is measured as part of the slice and can flip a warn into an error (3903 vs 4008 on one fixture). ADR-003's promised golden pin against `continuity-freshness.ts:17` is absent and the vitest fixture writes exact fences only.
- **F103** — Plugin still resolves a packet against the directory it was handed — `.opencode/plugins/opencode-goal.js:1817` (ADR-005). The core walks to the repo root (`goal-core.cjs:135-144`); the plugin stores and re-resolves against the raw directory (`:1838`, `:2701-2704`). Reproduced: core binds from a subdirectory, plugin raises `PACKET_GOAL_NOT_FOUND`; pass-1 F013's fix is incomplete.
- **F104** — Speckit YAML sanctions a direct table-row append — `.opencode/commands/speckit/assets/speckit-plan.yaml:195` (also `speckit-implement.yaml:160`, `speckit-complete.yaml:253`). The unsynchronized append bypasses the per-packet lock (`goal-core.cjs:1050`) and the durable-slice guard (`:1069-1073`), and the plugin exposes no `log` action (`opencode-goal.js:168`), so on the primary runtime it is the only path.
- **F105** — Plugin `packet` action omits the budget field its CLI twin prints — `.opencode/plugins/opencode-goal.js:2992`. The CLI emits `packet_budget` (`bin/goal.cjs:211`); the plugin's own `bind` emits it (`:2974-2977`); the shared reader computes it for both (`goal-slice.cjs:224-226`).
- **F106** — Set-time budget report exists only for a packet bind — `.opencode/hooks/goal/lib/goal-core.cjs:1115` (ADR-006 `:559`; packet log `007/goal.md:97`). `sanitizeInlineText` plus `clampText` (`:236-243`) truncate a plain-text objective at 4,000 characters with an ellipsis and no signal; reproduced through the shipped CLI (5,000 in, 4,000 ending in `...` out, `STATUS=OK`).
- **F107** — Two Devin `UserPromptSubmit` hooks write the same `additionalContext` field — `.devin/hooks.v1.json:50` (ADR-005). `spec-gate-classify.mjs:19-21` and `devin/goal-inject.mjs:70-74` both write `hookSpecificOutput.additionalContext` in one event chain; each is tested alone and the host's merge rule is unrecorded.

## Dimension Coverage

| Dimension | Status | Findings |
|-----------|--------|----------|
| correctness | covered | F101, F102, F104, F105 |
| security | covered | F101 (state-scope data loss), F103 (unresolvable path; no escape found) |
| traceability | covered | F103, F104, F105, F106, F107 |
| maintainability | covered | F102, F104, F107 |

## Traceability Checks

- `spec_code` (core): **partial** — ADR-003's one-extractor claim is unmet (F102); every other frozen decision checked in this pass is implemented.
- `checklist_evidence` (core): **partial** — all nine tasks are checked and the evidence table exists; two of the claimed fixes are incomplete or unpinned (F103, F106).
- `skill_agent` (overlay): **notApplicable** — spec-folder target.
- `agent_cross_runtime` (overlay): **partial** — Pi, Cursor and Devin inherit the core's repo-root walk and reminder; the OpenCode plugin does not (F103) and its packet read omits the budget field (F105).
- `feature_catalog_code` (overlay): **pass** — changelog `:301-305` and 009 REQ-010 now agree with the shipped adapter and the packet-bound model.
- `playbook_capability` (overlay): **partial** — the command contracts instruct an append path the core serializes only through the log action (F104).

## Ruled Out

- Frontmatter leaking through the runtime extractor on a tolerant fence: stripped, fail-closed on an unclosed opener, pinned by the slice suite.
- Symlinked packet escaping the workspace: refused on real paths, in-workspace aliases still resolve; pinned by the slice suite.
- OpenCode injection carrying no resend reminder: appended while the copy is behind and cleared after `resent`; plugin test pins both states.
- Pointer-less records contradicting ADR-001/ADR-002: both ADRs now carry the plain-text exception, and a bound record whose document is gone renders nothing.
- Nested phase parent exempt from the durable budget: `detectLevel` returns `phase` for a phase parent, which always applies the budget.
- `--runtime Pi` capitalization rejected by the namespace validator: lowercased before the pattern is applied.
- Resume surfaces binding or mutating a packet: both YAMLs are read-only and carry `never_halts`.
- Cursor command advertising unsupported actions: the hint now lists `packet` only, matching the fail-closed contract.
- Stale Devin claims in tracked requirement rows: the changelog paragraphs and 009 REQ-010 agree.
- Lock deadlock or stale-lock reaping releasing a live writer: no nested acquisition, and the stale window is far longer than the operation.
- Scope lock and packet lock deadlocking: neither path nests lock acquisition.

## Sources Reviewed

- Slice and core: `lib/goal-slice.cjs`, `lib/goal-core.cjs`, `bin/goal.cjs`, `README.md`, `goal-plugin.md`, plus the fixture runs under `scratch/`.
- Plugin: `.opencode/plugins/opencode-goal.js` through its pinned `__test` seam, and `plugins/tests/opencode-goal-tool-path.test.cjs`.
- Adapters and wiring: `pi/goal-context.ts`, `cursor/goal-inject.mjs`, `devin/goal-inject.mjs`, `.devin/hooks.v1.json`, `hooks/devin/spec-gate-classify.mjs`.
- Validator: `spec-doc-structure.ts` (via its dist export), `orchestrator.ts`, `continuity-freshness.ts`, `spec-kit-docs.json`, `spec-doc-structure.vitest.ts`.
- Commands: speckit plan/implement/complete/resume-auto/resume-confirm, `/goal-opencode`, `/goal-cursor`.
- Claims: `002-decisions-and-contract-freeze/decision-record.md`, 007 `spec.md`/`goal.md`/`tasks.md`/`implementation-summary.md`, `CHANGELOG-v4.0.0.0.md`, 009 `spec.md`, `AGENTS.md`.

## Stop Summary

- Stop reason: `maxIterationsReached` (5 of 5 iterations; stop policy `max-iterations`, convergence threshold 0.05 treated as telemetry only).
- Lineage: `sessionId=fanout-deepseek-review-2-1789123936134-6zq196`, `generation=1`, `lineageMode=auto`, executor `cli-pi` / `deepseek-v4.1-flash`.
- Artifacts: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `resource-map.md`, `iterations/iteration-00{1..5}.md`, `deltas/iter-00{1..5}.jsonl`.
- Resource Map Coverage Gate: skipped — the target packet carried no `resource-map.md` at init; this lineage emits a review-generated map instead.
- Every iteration file ends with its verdict line; this report's verdict is the final synthesis verdict.

Review verdict: PASS
