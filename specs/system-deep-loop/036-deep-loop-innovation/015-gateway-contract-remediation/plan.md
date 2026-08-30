---
title: "Implementation Plan: Gateway [system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation/plan]"
description: "Sequenced remediation plan for the ten 014-review findings plus the merge-tool bug: reconcile the state-write contract to the append gateway across prompt-packs, runtime, validator, SKILLs, YAMLs, and the guard, WS1-first behind a real-dispatch negative-control gate."
trigger_phrases:
  - "implementation"
  - "plan"
  - "gateway"
  - "015"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation"
    last_updated_at: "2026-08-25T14:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the sequenced remediation plan"
    next_safe_action: "Await operator approval, then build WS1 first"
    blockers: []
    key_files:
      - "tasks.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Gateway State-Write Contract Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Reconcile the deep-loop state-write contract to a single canonical path — the append gateway — across the six surfaces the `014` review found still carrying the pre-gateway contract, then close the remaining P1/P2 findings and the merge-tool bug. The plan is **WS1-first, gated on a real one-iteration dispatch**: because WS1 changes live runtime every deep-loop run executes, no other workstream starts until a negative-control dispatch proves the gateway-clean leaf both writes and passes validation. The pivotal runtime decision (ADR-002 A vs B) is resolved by a build-time intent check inside WS1, not pre-committed.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Condition | Blocks |
|------|-----------|--------|
| G1 — Intent check | ADR-002 direction (A/B) chosen from a confirmed answer to "does review/alignment have a legacy-projection consumer?" | WS1 runtime edit |
| G2 — Negative control | The gateway-only-leaf deadlock is reproduced BEFORE the fix and absent AFTER, in a real one-iteration dispatch | All post-WS1 work |
| G3 — Grep-clean contract | Zero `>> *-state.jsonl` / `>> {state_log}` write instructions remain across prompt-packs, agents, SKILLs, YAMLs | Completion |
| G4 — Guard fail-closed | Hardened guard exits non-zero on missing count / unresolvable target; scans prompt-packs | Completion |
| G5 — Merge fixture | `fanout-merge.cjs` yields a non-empty, non-PASS merge on a fixture with one active finding | Completion |
| G6 — Whole gate | `validate.sh --strict` exit 0; deep-loop runtime tests pass at baseline+delta; scoped diff clean | Completion |

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The state-write path has four artifact layers a dispatched leaf crosses, which must agree:

1. **Instruction layer** — the prompt-pack template the leaf executes (`prompt-pack-iteration.md.tmpl`, `alignment-prompt-pack.md.tmpl`). Today: raw `>> {state_log}`. Target: `append-mode-event.cjs --mode <m> --run-directory <d> --event-json <record>`.
2. **Persona layer** — the agent file (`.opencode/agents/*.md` etc.). Already gateway per `013`. Unchanged except WS3 injection-guard.
3. **Runtime layer** — the gateway (`append-mode-event.ts`) and its projection refresh. Today: refresh wired for research only. Target (ADR-002): gateway append satisfies the validator for review/alignment too.
4. **Validation layer** — `verify-iteration.cjs` (`state_record_missing`). Today: requires the record in the state-log projection. Target: passes for a gateway-only write once layer 3 is reconciled.

The remediation makes all four agree on the gateway. WS4 (SKILLs) and WS6 (guard) keep the *documentation* and *enforcement* of that agreement honest; WS2/WS3/WS5/WS7 close the adjacent findings.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract core (WS1)
Intent check (G1) → choose ADR-002 direction → fix the 3 prompt-packs → apply the runtime/validator change → negative-control dispatch (G2). Nothing else starts until G2 passes.

### Phase 2: P1 closure (WS2–WS6)
Parallelizable after G2: ai-council MCP, injection-guard parity, SKILL doctrine, confirm-YAML containment, guard hardening. Each closes with file:line/command evidence; the security-adjacent three (WS3/WS5/WS6) require closed-gate replay.

### Phase 3: Tooling, advisories, close (WS7 + P2)
Merge-tool fix with a regression fixture (G5); P2 advisories batched with their touched files; whole gate (G6); metadata reconcile; validate --strict.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Negative control (WS1):** dispatch one real review/alignment iteration with a gateway-only leaf; observe `state_record_missing` + redispatch BEFORE the fix; observe clean pass AFTER. This is the load-bearing proof.
- **Grep gates:** the hardened guard, run over the tree, is itself the regression test for G3/G4.
- **Merge fixture (WS7):** a synthetic lineage registry with one `active`/`disposition:active` finding; assert `fanout-merge.cjs` returns it (non-empty, verdict ≠ silent PASS).
- **Runtime tests:** re-run the deep-loop runtime vitest suite; capture baseline before WS1, report delta.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `014/review/review-report.md` + findings registry — the evidence base (shipped, re-verified).
- 012 runtime contracts (ledger, projection, gateway) — the model WS1 extends.
- A working dispatch path (cli-pi or native) for the negative-control run.
- No new external dependency; all edits are in-repo.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing lands at plan time. During build, each workstream is an independent scoped diff: pre-merge rollback is `git restore <files>`; post-merge is a scoped revert. WS1's runtime change (ADR-002) must be revertible without leaving the projection/validator half-wired — the single chosen file returns to its research-only shape on revert. The negative-control run is the tripwire: if G2 fails after the WS1 edit, revert WS1 and re-open ADR-002 rather than patching forward.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Workstream | Layer | Risk |
|---------|-----------|-------|------|
| 3× prompt-pack templates | WS1/T002 | instruction | High — live dispatch |
| `append-mode-event.ts` OR `verify-iteration.cjs` | WS1/T003 (ADR-002) | runtime/validation | High — live runtime |
| ai-council prompts + `.pi/mcp.json` (all runtimes) | WS2 | persona/config | Low |
| research/review leaves + packs (injection guard) | WS3 | instruction/persona | Med — security-adjacent |
| 4× mode SKILLs | WS4 | doc | Low |
| 2× confirm YAMLs | WS5 | dispatch config | Med — security-adjacent |
| `check-agent-gateway.sh` | WS6 | enforcement | Low |
| `fanout-merge.cjs` | WS7 | tooling | Med — gate integrity |

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
G1 intent-check -> WS1/T002 prompt-packs -> WS1/T003 runtime (ADR-002) -> G2 negative-control
                                                                             |
                        (all gated on G2)
                     WS2 council-MCP   WS3 injection-guard   WS4 SKILL-doctrine
                     WS5 confirm-containment   WS6 guard-fail-closed
                                            |
                                   WS7 merge-tool + P2 advisories -> G6 whole gate
```

WS7 is independent of WS1 (different subsystem) and MAY run in parallel from the start; it is placed in Phase 3 only for review batching.

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

`G1 -> WS1/T002 -> WS1/T003 -> G2`. Everything else is off the critical path and parallelizable once G2 clears. The single longest-pole risk is the ADR-002 intent check (G1): if the answer is ambiguous, escalate via Logic-Sync before touching runtime rather than guessing a direction.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition of done |
|-----------|--------------------|
| M1 | ADR-002 direction chosen from a confirmed intent answer (G1) |
| M2 | Gateway-clean leaf passes a real dispatch; deadlock reproduced-then-cleared (G2) |
| M3 | All five P1 closed with cited evidence; security-adjacent three replayed closed-gate |
| M4 | Merge fixture proves WS7; P2 advisories batched |
| M5 | Whole gate green (G6); metadata reconciled; validate --strict exit 0 |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the ADR-002 intent question is answered (does review/alignment have a legacy-projection consumer?) before any runtime edit.
- [ ] Confirm the negative-control dispatch reproduces the deadlock on the PRE-fix tree before changing WS1.
- [ ] Confirm no surface outside the `spec.md` "Files to Change" table is touched.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Do WS1 (T001→T002→T003→G2) before any Phase-2 workstream; do not start WS2–WS6 until G2 passes. |
| TASK-SCOPE | Edits stay inside the named target surfaces + this packet; no commit/push without operator go-ahead; `013` stays immutable except the guard script it hosts (WS6). |

### Status Reporting Format
Report as: `015 remediation — <Planned|WS1|Phase2|Phase3|Done> — findings closed N/10 — gate: <G-id or none> — blocking on: <operator approval | intent check | none>`.

### Blocked Task Protocol
If the ADR-002 intent check is ambiguous, or a negative-control dispatch cannot be run, mark the task BLOCKED, do not touch runtime, and escalate via Logic-Sync with the conflicting evidence and the decision needed. Do not guess a direction to keep moving.

<!-- /ANCHOR:ai-execution-protocol -->
