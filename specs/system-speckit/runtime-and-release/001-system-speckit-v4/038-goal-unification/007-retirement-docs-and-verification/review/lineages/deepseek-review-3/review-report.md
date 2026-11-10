---
title: "Deep Review Report — Goal Unification Build (third pass)"
trigger_phrases: []
---
# Deep Review Report — Goal Unification Build (third pass)

## Executive Summary

**Verdict: PASS (advisories)**
**Release readiness:** `advisories-open` (no P0 or P1 in this lineage; ten P2 advisories)
**hasAdvisories:** `true`
**Active findings:** P0=0, P1=0, P2=10 (10 total, 0 resolved)

This five-iteration third pass re-reviewed the goal unification build behind the phase-007 packet, after pass 1 (5 P1, 10 P2), pass 2 (7 P2) and the phase-008 hardening round. The scope named what phase 008 touched and the two rows it deferred. Five of the ten advisories are reproduced defects rather than repeats:

- **F301** (P2, correctness) — the packet-log lock keys on the packet real path but its root is `join(workspace, STATE_SUBDIR)` (`.opencode/hooks/goal/lib/goal-core.cjs:902`), which ignores the documented `OPENCODE_GOAL_STATE_DIR` override: with the override set, an append still creates `<workspace>/.opencode/skills/.state/goal/.locks/`. Harmless today (gitignored, `.gitignore:108`) but the override's isolation claim (`.opencode/hooks/goal/README.md:130`) is no longer true.
- **F302** (P2, correctness) — on an unclosed frontmatter opener the validator's goal extractor falls back to the whole document (`.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1030-1031`) while the runtime fails closed (`.opencode/hooks/goal/lib/goal-slice.cjs:42-45`): 4,400 vs 0 characters on one fixture. No false pass, but the quoted budget counts frontmatter.
- **F303** (P2, correctness) — the validator uses a strict frontmatter parser for the continuity-block check but a tolerant one for the budget, so a fence with a trailing space skips `FRONTMATTER_MEMORY_BLOCK` entirely (pass, no diagnostics) where an exact fence warns (`spec-doc-structure.ts:276-278` vs `:1029-1030`).
- **F304** (P2, traceability) — the parity test written for the pass-2 F102 fix (`.opencode/skills/system-spec-kit/runtime/tests/spec-doc-structure.vitest.ts:320`) compares the validator's extractor with itself, and ADR-003's promised golden pin against the runtime slice module still does not exist.
- **F305** (P2, traceability) — three sentences in the hook README (`:29`, `:117`, `:140`) still say the OpenCode plugin imports `goal-slice.cjs` and nothing else, contradicting its new `appendPacketLog` import (`.opencode/plugins/opencode-goal.js:26-27`).
- **F306** (P2, traceability) — the `packet_goal.log` rule's carve-out ("only for a packet no session is bound to") cannot be evaluated from any shipped surface: the session-free packet read reports no bound-ness, `show` needs the session's own record, and Cursor/Devin can never bind, so they are forced onto the carve-out branch.
- **F307** (P2, traceability) — the README says the `packet` action needs only `--workspace` (`.opencode/hooks/goal/README.md:62`), but the CLI requires session identity for every action except four (`.opencode/hooks/goal/bin/goal.cjs:386-393`), so the documented invocation fails `MISSING_SESSION_ID`.
- **F308** (P2, security) — the inline sanitizer neutralizes `[active_goal]` markers and fences but not anchor markup, so a log row containing `<!-- ANCHOR:log -->` is written verbatim and then makes the packet fail its own validator (three `SPECDOC_SUFFICIENCY_001` errors) with the durable slice unchanged.
- **F309** (P2, traceability) — a rebind archives the prior record in the core (`goal-core.cjs:945-949`) but the OpenCode plugin overwrites it in place (`opencode-goal.js:1818-1855` via `mutateGoal`), so the two implementations keep different history.
- **F310** (P2, traceability) — the recorded Devin limitation counts two `UserPromptSubmit` writers of `additionalContext`; the shipped chain has three (`.devin/hooks.v1.json:45,50,55`), so the DV-022 live check it defers to is scoped to the wrong chain.

No P0 or P1 was found, so the packet's success criterion ("deep review reports no open P0 or P1") survives this pass. No reviewed source was changed; every write from this lineage is an artifact inside `review/lineages/deepseek-review-3`.

## Prior-Lineage Verification

The review scope required reading `lineages/deepseek-review/review-report.md` and `lineages/deepseek-review-2/review-report.md` first and not re-reporting a closed finding unless the fix is wrong or incomplete. Verified at the cited lines:

| Prior finding | Status in this pass | Evidence |
|---|---|---|
| F101 lock scope | **fixed** | Positive control: two sessions with divergent state dirs landed 40/40 rows; a symlinked-alias race lost none (20/20). |
| F102 measurement drift | fixed for closed fences | Both extractors measure the same slice once the fence closes; residuals on the broken opener (F302) and the strict frontmatter parser (F303). |
| F103 workspace resolution | **fixed** | Plugin bind from a subdirectory resolves against the repo root; the tool-path test pins it. |
| F104 direct table append | narrowed | The rule now requires the locked append and carves out unbound packets only; the carve-out is undecidable (F306). |
| F105 packet budget field | **fixed** | The plugin packet read prints the budget tier; test-pinned. |
| F106 text-set truncation | **fixed** | A 4,500-char text set reports the truncation to 4,000 through the shipped CLI. |
| F107 Devin merge rule | still open | Carried in every pass; its recorded scope undercounts the chain (F310). |

The scope's own sentence that "every P1 and six of seven pass-2 P2s were fixed in phase 008" is optimistic in two rows: F102 holds only for closed fences and F104 survives as an undecidable carve-out. F101, F103, F105 and F106 are fixed as claimed.

## Planning Trigger

Verdict PASS routes to changelog creation (`/create:changelog`), not to remediation planning: no P0 or P1 is active, so no merge-blocking workstream exists. The ten P2 advisories are optional follow-ups. The four documentation and instruction items (F305-F307, F310) are cheap and independent; the measurement items (F302-F304) need one decision before code; F308 is a small sanitizer change; F309 and F301 ride with any change to the plugin record lifecycle or the lock root.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "nextCommand": "/create:changelog",
  "activeFindings": [
    {"id":"F301","severity":"P2","findingClass":"doc-behavior-drift","title":"Packet-log lock root escapes the documented OPENCODE_GOAL_STATE_DIR override"},
    {"id":"F302","severity":"P2","findingClass":"measurement-drift","title":"Validator measures frontmatter as part of the durable slice on an unclosed opener where the runtime fails closed"},
    {"id":"F303","severity":"P2","findingClass":"boundary-drift","title":"A trailing-whitespace fence skips the goal.md continuity-block check while an exact fence warns"},
    {"id":"F304","severity":"P2","findingClass":"missing-validation","title":"The parity test compares the validator extractor with itself and ADR-003's golden pin is still absent"},
    {"id":"F305","severity":"P2","findingClass":"doc-code-contradiction","title":"The hook README denies the plugin's shared appendPacketLog import"},
    {"id":"F306","severity":"P2","findingClass":"undecidable-contract","title":"The packet_goal log carve-out cannot be evaluated from any shipped surface"},
    {"id":"F307","severity":"P2","findingClass":"doc-code-contradiction","title":"The documented packet invocation fails because the CLI requires session identity"},
    {"id":"F308","severity":"P2","findingClass":"input-hardening-gap","title":"Anchor markup in a log row passes the sanitizer and breaks the packet's own validator"},
    {"id":"F309","severity":"P2","findingClass":"runtime-parity-gap","title":"Rebind archives in the core but overwrites in place in the OpenCode plugin"},
    {"id":"F310","severity":"P2","findingClass":"stale-scope-claim","title":"The recorded Devin limitation undercounts the same-field writers (three, not two)"}
  ]
}
```

## Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | First seen | Status |
|----|-----|-----------|-------|----------|-----------|--------|
| F301 | P2 | correctness | The packet-log lock root escapes the documented `OPENCODE_GOAL_STATE_DIR` override | `.opencode/hooks/goal/lib/goal-core.cjs:902` | 1 | active |
| F302 | P2 | correctness | The validator measures frontmatter as part of the durable slice on an unclosed opener where the runtime fails closed | `spec-doc-structure.ts:1030` | 2 | active |
| F303 | P2 | correctness | A trailing-whitespace fence skips the goal.md continuity-block check while an exact fence warns | `spec-doc-structure.ts:277` | 2 | active |
| F304 | P2 | traceability | The parity test compares the validator extractor with itself and ADR-003's golden pin is still absent | `spec-doc-structure.vitest.ts:320` | 2 | active |
| F305 | P2 | traceability | The hook README still denies the plugin's shared `appendPacketLog` import | `.opencode/hooks/goal/README.md:29` | 3 | active |
| F306 | P2 | traceability | The `packet_goal` log carve-out is undecidable from any shipped surface | `speckit-plan.yaml:200` | 3 | active |
| F307 | P2 | traceability | The documented `packet` invocation fails because the CLI requires session identity | `.opencode/hooks/goal/README.md:62` | 3 | active |
| F308 | P2 | security | Anchor markup in a log row passes the sanitizer and breaks the packet's own validator | `goal-core.cjs:1063` | 4 | active |
| F309 | P2 | traceability | A rebind archives in the core but overwrites in place in the OpenCode plugin | `opencode-goal.js:1818` | 4 | active |
| F310 | P2 | traceability | The recorded Devin limitation undercounts the same-field writers | `008-hardening-research/implementation-summary.md:119` | 5 | active |

Full evidence, scope proofs and affected surface hints are in `deep-review-findings-registry.json` and the per-iteration files.

## Remediation Workstreams

1. **WS1 — Measurement boundary (F302, F303, F304).** One decision first: a single frontmatter boundary for `goal.md` across validator rules (make the continuity check tolerant, or make the budget check strict), and make the broken-opener fallback agree with the runtime's fail-closed read. Then wire the parity test to both extractors so ADR-003's pin exists. Order: decision → extractor change → pin.
2. **WS2 — Command-surface decidability (F306, F307).** F307 is doc-only and independent: correct the `packet` example to the flag set the CLI enforces. F306 needs a signal decision (expose bound-ness on the session-free packet read, or replace the carve-out with a rule the runtime enforces) before any text change.
3. **WS3 — Documentation truth (F305, F310).** Correct the three README import-boundary sentences and the plugins README action list; restate the Devin limitation as three writers and widen DV-022's assertions. Independent, doc-only.
4. **WS4 — Runtime parity (F309).** Archive in the plugin's bind when the packet path changes (mirroring `archiveGoalRecord`), or document rebind archiving as core-only. Small plugin change with an existing test seam.
5. **WS5 — Input hardening (F308).** Neutralize or escape anchor markup in the inline sanitizer path, as `[active_goal]` markers and fences already are.
6. **WS6 — Environment isolation (F301).** Either lock under the resolved state dir (as the override's documentation promises) or state that the lock root is deliberately per-workspace. Harmless today; ride along with any change to the lock path.

## Spec Seed

- State the single frontmatter boundary for `goal.md` across validator rules, and require the runtime and validator to agree on a broken opener (F302, F303).
- Require the ADR-003 golden pin to import both extractors, so parity cannot regress silently (F304).
- Make the unbound-packet carve-out in the log rule evaluable from a shipped surface, or remove it (F306).
- Fix the documented `packet` invocation to the full flag set the CLI enforces (F307).
- Correct the README import-boundary sentences and the plugins README action list to match the shared append (F305).
- Record the Devin `UserPromptSubmit` chain as three same-field writers and scope DV-022 to all three (F310).
- Decide whether the packet lock is per-workspace or per-resolved-state-dir, and document the outcome (F301).
- Archive on rebind in the plugin, or document rebind archiving as core-only (F309).
- Neutralize anchor markup in log items (F308).

## Plan Seed

- Step A (independent, cheap): F305, F307, F310 doc corrections; F308 sanitizer hardening — both have existing test seams.
- Step B (decision first): F302/F303/F304 measurement boundary — one strict-vs-tolerant decision, then the extractor change, then the pin.
- Step C (small code): F309 plugin archive on rebind; F301 lock-root decision (doc-only if recorded as deliberate).
- Step D (contract): F306 carve-out — needs a bound-ness signal or a rule change; do not fix by restating the condition.
- Gate after any remediation: the packet's own sweep — `validate.sh --strict` on 036, the six hook suites, the eight plugin suites, the vitest spec-doc-structure suite, the drift check and the hygiene gate.

## Traceability Status

| Protocol | Level | Status | Evidence | Finding refs |
|----------|-------|--------|----------|--------------|
| `spec_code` | core | partial | ADR-003's promised pin absent (`decision-record.md:265`); the validator's two frontmatter boundaries disagree (`spec-doc-structure.ts:276-278` vs `:1029-1030`) | F302, F303, F304 |
| `checklist_evidence` | core | pass | T001-T009 and the three success criteria hold against disk state and the parent goal log (`tasks.md:37-59`, `036-goal-unification/goal.md` log rows 004-008) | — |
| `skill_agent` | overlay | notApplicable | Spec-folder target | — |
| `agent_cross_runtime` | overlay | partial | Core archives on rebind (`goal-core.cjs:945-949`); the plugin overwrites in place (`opencode-goal.js:1818-1855`) | F309 |
| `feature_catalog_code` | overlay | partial | `goal-plugin.md` is current, but the hook README denies the second import (`.opencode/hooks/goal/README.md:29,117,140`) and `.opencode/plugins/README.md:31` omits `unbind`/`log` | F305 |
| `playbook_capability` | overlay | partial | The log carve-out is undecidable (F306); the `packet` example fails as written (F307); the recorded Devin chain undercounts its writers (F310) | F306, F307, F310 |

No required (hard) gate failed: `spec_code` is partial, not failed, and `checklist_evidence` passes. `gatingFailures: 0`.

## Deferred Items

- **F107** (carried from pass 2, still open): Devin's host merge rule for the same-field writers cannot be settled from this repository; DV-022 remains the live check, now scoped by F310.
- **The 008 backlog rows** (research do-next) remain as recorded there: canonical workspace precedence, list-field criteria cuts, renderer label parity, a CI comparison of the three `packet_goal` YAML blocks, non-UTF8 append policy, brief cache keyed on the slice hash, and a resend signal for Claude Code and Codex.
- **The two deferred rows are judged in this pass.** Deferring the envelope aliases (`budget_tokens_used`, `budget_usage_source`) was right: they are a documented compatibility contract with a current test (`.opencode/plugins/tests/opencode-goal-supervisor.test.cjs:124,126`). Deferring `lastCheckAtMs` is defensible but leaves a dead field — the honest trigger is the next record-schema change, where it should be removed rather than carried.
- All advisories are P2; none blocks release, and none requires a planning round on its own.

## Audit Appendix

**Resource Map Coverage Gate:** skipped — `resource_map_present` was false (the target packet carried no `resource-map.md` at init). A review-generated map stands in at `review/lineages/deepseek-review-3/resource-map.md`.

**Iteration table:**

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness — the packet-log lock after the workspace-root rewiring | correctness/traceability | 1.00 | 0/0/1 | complete |
| 2 | correctness — the two frontmatter boundaries behind the goal slice | correctness/maintainability | 1.00 | 0/0/3 | complete |
| 3 | traceability — the plugin's shared append against its documentation, and the log rule's own condition | traceability/maintainability | 1.00 | 0/0/3 | complete |
| 4 | security — the log row as an input surface, and rebind history across the two implementations | security/correctness | 1.00 | 0/0/2 | complete |
| 5 | traceability — the review target's own claims, and the two deferred rows | traceability/maintainability | 1.00 | 0/0/1 | complete |

**Replay validation (from `deep-review-state.jsonl` + deltas):** per-iteration finding counts 1/3/3/2/1 sum to 10, matching the registry; every iteration's `findingsNew` equals `findingsCount` (ratio 1.00 each, no repeats and no dedup merges needed); stop reason `maxIterationsReached` matches the recorded terminal state and the configured cap of 5. Replay passes.

**Convergence evidence:** the composite stop never fired before the cap; the 0.05 threshold was treated as telemetry per the run instruction, and each iteration broadened to a surface not yet swept (lock wiring → extractor boundaries → plugin docs/rules → input surface/parity → packet claims), which is why every iteration's new-findings ratio stayed 1.00 rather than decaying.

**File coverage matrix:** `.opencode/hooks/goal/lib/goal-core.cjs` (iterations 1, 3, 4); `.opencode/hooks/goal/lib/goal-slice.cjs` (1, 2, 4); `.opencode/hooks/goal/bin/goal.cjs` (1, 3, 4); `.opencode/hooks/goal/README.md` (1, 3) and `goal-plugin.md` (3, 5); the pi/cursor/devin adapters (4) and `.devin/hooks.v1.json` (5); `.opencode/plugins/opencode-goal.js` and its plugin tests (3, 4); `spec-doc-structure.ts` and `orchestrator.ts` plus the vitest suite (2, 4); the three speckit workflow YAMLs and `save.md` (3); `/goal-cursor` (3) and `/goal-opencode` (read at synthesis; its routes match the plugin action surface, including the new `unbind` and `log`); the 007 and 008 packets plus the parent goal log (5).

**Dimension breakdown:** correctness 3 findings (F301-F303); security 1 (F308); traceability 6 (F304-F307, F309-F310); maintainability covered with 0 findings (the deferred-row judgement and claim reconciliation produced none of their own).

**Write surface:** every artifact of this pass lives under `review/lineages/deepseek-review-3/` — `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `deep-review-findings-registry.json`, `review-report.md`, `resource-map.md`, `iterations/iteration-00{1..5}.md`, `deltas/iter-00{1..5}.jsonl` and the `scratch/` probes. No file outside that directory was modified; `generate-context.js`, `validate.sh` and git write commands were not run, by instruction.

Review verdict: PASS
