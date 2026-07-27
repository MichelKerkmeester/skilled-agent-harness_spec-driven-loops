# Deep Review Report — Benchmark Naming and Playbook Results

## 1. Executive Summary

- Verdict: **CONDITIONAL**
- Stop reason: `maxIterationsReached`
- Active findings: P0=0, P1=2, P2=0
- hasAdvisories: false
- Scope: the target packet, its named benchmark-storage surfaces, the Lane C writer/index, and the compiled-routing archive and snapshot paths.

All five required iterations ran. `max-iterations` makes convergence telemetry only before the hard ceiling. Security review found no actionable vulnerability; the final replay confirmed two P1s.

## 2. Planning Trigger

`/speckit:plan` is required before release readiness because the default writer can lose concurrent evidence and the governing packet still certifies an obsolete report layout.

## 3. Active Finding Registry

### P1-001 — Default output allocation is not concurrency-safe

- Evidence: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:151-155`, then report writes at `:411-415`.
- Impact: concurrent default runs can select the same dated folder and overwrite each other's evidence.
- Fix: atomically reserve the candidate folder before writes and test concurrent allocation.

### P1-002 — Packet acceptance evidence still describes the obsolete six-file layout

- Evidence: `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:128`; writer emission at `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:552-575`.
- Impact: the target's governing acceptance criteria, plan, tasks, checklist, and storage guide disagree with the seven files actually emitted.
- Fix: reconcile the normative layout and add a single contract test across documentation and writer output.

## 4. Remediation Workstreams

1. Add an atomic output-reservation primitive and a concurrent-run regression.
2. Align the packet's normative layout and all completion evidence with the seven-file writer output.

## 5. Spec Seed

- Define the concurrent same-day allocation guarantee and collision-exhaustion behavior.
- Name the full emitted report-folder shape once, including the machine record and five companions.

## 6. Plan Seed

- Replace check-then-create output allocation with atomic reservation and add a two-process test.
- Update the target spec, plan, tasks, checklist, and storage guide; assert their file list against the writer.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | P1-001 and P1-002 remain active. |
| `checklist_evidence` | fail | CHK-035 is sequential-only; CHK-033 retains six files. |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `playbook_capability` | partial | The writer produces durable output, but the storage authority remains stale. |
| `feature_catalog_code` | notApplicable | No feature catalog is in scope. |
| `skill_agent` | notApplicable | Target is a spec folder. |
| `agent_cross_runtime` | notApplicable | Target is a spec folder. |

AC_COVERAGE: advisory-exempt; the required lifecycle predicate is not active for this detached lineage.

## 8. Deferred Items

- No P2 advisories.
- The target's explicitly deferred plural-root and uppercase-source questions remain out of scope.

## 9. Dimension Expansion Map

- Covered: correctness, security, traceability, maintainability.
- Final expansion: adversarial replay of both active P1 findings.
- Completed pivots: 0. Remaining frontier: remediation verification.

## 10. Search Ledger

No search-depth state captured. The code graph was unavailable, so direct source reads and exact searches supplied the cited evidence. `hasSearchDebt: false`.

## 11. Audit Appendix

- Iterations: 5 of 5.
- Finding trajectory: one P1 in correctness, no security finding, one P1 in traceability, then two clean-but-confirming passes.
- Focused verification: `npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts` exited 0.
- Reducer: JSONL parses cleanly; registry has P0=0, P1=2, P2=0.
- Resource-map coverage gate: skipped at initialization because the target lacked `resource-map.md`; the lineage resource map is a reducer-generated evidence artifact only.
