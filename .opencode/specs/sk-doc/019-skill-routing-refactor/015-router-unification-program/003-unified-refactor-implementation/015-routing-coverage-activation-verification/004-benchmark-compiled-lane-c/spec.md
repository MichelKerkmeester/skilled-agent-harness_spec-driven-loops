---
title: "Feature Specification: Benchmark — Compiled Lane C Parity"
description: "Build the non-frozen compiled Lane C parity harness that proves the compiled routing decision matches legacy on every scenario: a compiled-routing-parity.cjs sibling plus two orchestrator hooks (verdict attach + render-from-JSON), a qualifiedIdToLeaf shape bridge translating compiled targetQualifiedIds into the frozen evaluator's observedResources vocabulary, a vacuous-parity guard that hard-fails any run where the hub activation manifest's servingAuthority is not compiled, an unset/0/1/invalid flag-state matrix, and exactly one named blocking drift-gate owner. The verdict sub-state that replaces today's OR-collapse is implemented in the non-frozen run-skill-benchmark.cjs orchestrator, never in the frozen score-skill-benchmark.cjs. Implemented and committed in 8532c4b64b (002 landed). The three frozen scorer files stay byte-identical and SHA-256-pinned throughout; compiled stays byte-identical to legacy on every routing field; every gate names a rollback."
trigger_phrases:
  - "compiled lane c parity harness"
  - "benchmark verdict sub-state non-frozen orchestrator"
  - "vacuous parity guard serving authority"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Benchmark — Compiled Lane C Parity

## EXECUTIVE SUMMARY

This phase-local child ships the benchmark side of the compiled-router activation program: a **non-frozen** compiled-routing-parity harness proving the compiled decision matches legacy on every scenario, without ever touching the three frozen scorer files. It is implemented and committed in `8532c4b64b` — the 25-iteration deep-research pass (`015-routing-coverage-activation-verification/001-research/`) established the concrete change list this spec authored from (`synthesis-v1.md` §2.2 CF-BM-1..8, reconciled in `review-v1.md`).

Lane C — the automated skill-benchmark harness — never exercises the compiled routing path today: the live executor never sets `SPECKIT_COMPILED_ROUTING` and scores only the model's declared JSON, not a compiled decision (CF-BM-1). This spec closes that gap with a harness that is safe by construction: it hard-fails "vacuous" parity (flag on but the hub still serving legacy) rather than passing it (CF-BM-2), bridges the compiled and legacy scoring vocabularies (CF-BM-3), and — per the review's highest-priority correction — puts the new verdict sub-state in the non-frozen orchestrator, never the frozen scorer (CF-BM-4, SAFETY).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented — landed in `8532c4b64b`. The non-frozen `compiled-routing-parity.cjs` harness, orchestrator hooks, `qualifiedIdToLeaf` bridge, vacuous-parity guard, and flag-state/verdict-substate matrices are built; the three frozen scorer files stayed byte-identical (SHA-256 unchanged) |
| **Created** | 2026-07-20 |
| **Branch** | `sk-doc/0089-default-routing-cutover` |
| **Migration stage** | P1 — Lane C compiled-parity benchmark harness (diagnostic; not a runtime consumer of the compiled decision) |
| **Blast radius** | Benchmark/CI harness only — additive non-frozen files; the three frozen scorer files are re-hashed, never edited; no routing decision changes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Lane C never exercises the compiled routing path, and it fits in two non-frozen files (CF-BM-1). Even once wired, `SPECKIT_COMPILED_ROUTING=1` alone is insufficient: `resolve.cjs:41-42` also requires the hub's `servingAuthority === 'compiled'`, so a naive lane that checks only the flag would read a legacy-sentinel fallback as a false "parity" pass — the **vacuous-parity trap** (CF-BM-2). Compiled output emits `targetQualifiedIds`; the frozen evaluator reads `observedResources` surface paths — the two vocabularies are incompatible without a translation bridge (CF-BM-3). And the currently-planned verdict logic OR-combines `compiledRouting.gate.failed` with `routeGold.gate.failed`, collapsing three distinct failure causes (compiled-serving violation, drift-fallback, broken resolver) into one `BLOCKED` code — violating 012 REQ-004's three-state readout, and per the orchestrator review's **highest-priority correction**, this cannot be fixed inside the frozen scorer (CF-BM-4, SAFETY). Two further gaps: the harness that will exist (014, Planned) hardcodes `flag=1`, so it cannot prove behavior across the flag's actual state space (F-15-3); and no single owner is named for the resulting drift gate, risking two gates disagreeing or neither blocking (F-25-8).

### Purpose

Ship `compiled-routing-parity.cjs` — a non-frozen sibling in the existing skill-benchmark scripts directory — plus its two orchestrator hooks, so that Lane C can prove compiled == legacy on every scenario; hard-fail vacuous parity instead of passing it; exercise the full `unset/0/1/invalid` flag-state space; report a real three-state verdict from the non-frozen orchestrator; and do all of this while the three frozen scorer files stay byte-identical and a single named owner holds the blocking drift gate.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `compiled-routing-parity.cjs` (new, non-frozen sibling) exporting `compiledParity({scenario, legacyObserved, skillRoot, skillId})` [CF-BM-1]
- Two orchestrator hooks: (a) `run-skill-benchmark.cjs` attaches `row.compiledParity` after `row.routeGold` and adds a `BLOCKED-BY-COMPILED-DRIFT` branch (exit 3); (b) `build-report.cjs` renders the `compiledRouting` JSON block into the Markdown report [CF-BM-1, CF-BM-6]
- `qualifiedIdToLeaf` reverse-lookup bridge, added to the shared `leaf-resource-contract.cjs` (exposed via `selectResourceContract`) rather than duplicated locally, so `008-sk-code-alignment-and-drift-guards` can consume the same primitive without redefining it (CF-BM-3; cf. CF-SC-2, which cites the same file for a related but distinct bijection test)
- Verdict sub-state (`compiled-serving | legacy-fallback-drifted | broken-compiled-path`) implemented in the **non-frozen** `run-skill-benchmark.cjs` (~:300-310, which already maps verdict → exit codes), inspected by the outer switch BEFORE it decides BLOCKED/CONDITIONAL/DEGRADED — **NEVER in the frozen `score-skill-benchmark.cjs`** [CF-BM-4, SAFETY]
- Vacuous-parity guard: pre-flight reads the hub's `010-live-activation/activation/<hub>/manifest.json`; `servingAuthority !== 'compiled'` is a hard-fail status `vacuous`, never counted as a pass [CF-BM-2]
- Flag-state matrix: the harness exercises `unset / '0' / '1' / invalid` `SPECKIT_COMPILED_ROUTING` states instead of a hardcoded `flag=1` [F-15-3]
- `routeGold.summary.compiledEligibility` distinguishing hub-type-eligible (has `hub-router.json`) from compiled-eligible; status enum `{match|drift|vacuous|n/a|resolver-missing}` where only `match` counts as pass and `n/a` is informational [CF-BM-5]
- Frozen-trio SHA-256 re-hash gate before any parity run; hard abort on drift
- Exactly one named blocking drift-gate owner: this Lane C compiled-parity gate is that owner; other consumers (e.g. the `routing-registry-drift.yml` CI workflow, CF-ACT-10) report its classification, never independently block [F-25-8]
- `--compiled-routing-parity` CLI flag threaded through `loop-host.cjs` + command I/O + both skill-benchmark workflow dispatches, OR (if that route proves unreachable) an unconditional resolved `auto` mode recorded in every report [CF-BM-8]

### Out of Scope

- The runtime promotion/status-probe foundation itself - [why] this packet CONSUMES the hub activation manifest (and, once wired, `compiled-route-status.cjs --all`); `002-runtime-promotion-and-status-foundation` builds those, this child does not.
- The 7-hub playbook scenario matrix and the LUNA-High live acceptance stage - [why] owned by the sibling `005-playbooks-and-luna-acceptance`, which depends on this child's report/evidence shape but authors its own scenarios and its own live-model stage.
- Any edit to the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) - [why] frozen, SHA-256-pinned, byte-identical forever; the verdict sub-state goes in the non-frozen orchestrator instead (SAFETY, CF-BM-4).
- Feature catalogs, durable archiving conventions, sk-code alignment, sk-doc template alignment, rollback/audit tooling, and the P4 cutover controller - [why] owned by siblings `006`-`011`, not this child.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs` | Create | Non-frozen parity harness: `compiledParity({scenario, legacyObserved, skillRoot, skillId})` |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | Attach `row.compiledParity`; verdict sub-state (re-anchor near the existing verdict→exit-code map); `BLOCKED-BY-COMPILED-DRIFT` exit 3; flag-state matrix wiring |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | Modify | Render the `compiledRouting` JSON→Markdown block |
| `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` | Modify | Add `qualifiedIdToLeaf` reverse lookup (additive export via `selectResourceContract`) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs` | Modify | Whitelist `--compiled-routing-parity` (or record the resolved `auto` mode unconditionally) |
| `004-benchmark-compiled-lane-c/{spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md}` | Create | Level-2 spec docs (this packet) |

> All writes stay inside this phase folder plus the explicitly named shared-script paths above. The three frozen scorer files and all seven `010-live-activation/activation/<hub>/manifest.json` files are read-only inputs.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author `compiled-routing-parity.cjs` as a non-frozen sibling exporting `compiledParity({scenario, legacyObserved, skillRoot, skillId})`. | The function is pure given its inputs plus on-disk manifest/compiled artifacts; it never re-implements frozen scoring logic, only translates and delegates to it. |
| REQ-002 | Vacuous-parity guard: pre-flight reads the hub's `activation/<hub>/manifest.json`; `servingAuthority !== 'compiled'` is a hard-fail `vacuous`. | A fixture sweep across all 7 current manifests plus one synthetic `servingAuthority: legacy` fixture shows the legacy fixture hard-fails `vacuous`, never `match`. |
| REQ-003 | Shape bridge: `qualifiedIdToLeaf` translates `targetQualifiedIds` to legacy `observedResources` via the shared `leaf-resource-contract.cjs`, then calls the frozen `evaluateRouteGold` unmodified. | A Vitest bijection test asserts every hub's `route-gold.typed.json` `targetQualifiedIds` resolves against that hub's `leaf-manifest.json`; the frozen evaluator function is called, not re-implemented. |
| REQ-004 | **[SAFETY]** Verdict sub-state (`compiled-serving \| legacy-fallback-drifted \| broken-compiled-path`) lives ONLY in the non-frozen `run-skill-benchmark.cjs`; the frozen `score-skill-benchmark.cjs` is never edited. | SHA-256 of the three frozen files is identical before and after this child ships; a Vitest asserts 3 distinct outer verdicts are reachable (no OR-collapse into a single `BLOCKED`). |
| REQ-005 | Frozen-trio SHA-256 re-hash gate: re-hash `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs` before every parity run; abort on any drift from the pinned digests. | A seeded-drift fixture (one byte changed in a scratch copy) aborts before any comparison runs; the real three files' digests match the values recorded in `010-live-activation/implementation-summary.md`. |
| REQ-006 | Flag-state matrix: the harness exercises `unset / '0' / '1' / invalid` `SPECKIT_COMPILED_ROUTING` states rather than a hardcoded `flag=1`. | A Vitest table drives all four states and asserts four distinct, correct outcomes (no state silently coerced into another). |
| REQ-007 | Exactly one blocking drift-gate owner is named: this Lane C compiled-parity gate. | The spec, plan, and checklist all state that other consumers (e.g. the `routing-registry-drift.yml` CI workflow) report this gate's classification and never independently block. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | `routeGold.summary.compiledEligibility` distinguishes hub-type-eligible from compiled-eligible; status enum `{match\|drift\|vacuous\|n/a\|resolver-missing}` where only `match` is a pass and `n/a` is informational. | A hub that is route-gold ENFORCED but not in the 7-hub compiled allowlist reports `n/a`, never `drift`. |
| REQ-009 | Render-from-JSON: `build-report.cjs` renders a `compiledRouting` Markdown block from the report JSON; no hand-authored per-run report is produced or accepted. | A rendered-report fixture test shows the block populated (not empty/placeholder) whenever `row.compiledParity` is present. |
| REQ-010 | `--compiled-routing-parity` reaches the orchestrator through `loop-host.cjs` + command I/O + both skill-benchmark workflow dispatches, OR the unconditional-`auto`-mode fallback is recorded in every report. | An integration run from each dispatch surface shows the flag (or the fallback `auto` mode marker) present in the resulting report JSON. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `compiled-routing-parity.cjs` ships and is called by `run-skill-benchmark.cjs`; `row.compiledParity` is present on every scenario row once the harness runs.
- **SC-002**: The vacuous-parity guard hard-fails every current `servingAuthority !== 'compiled'` case; zero false "parity" passes in the fixture sweep.
- **SC-003**: The `qualifiedIdToLeaf` bijection holds for every eligible hub's `leaf-manifest.json`; no `targetQualifiedIds` entry is left unresolved.
- **SC-004**: The verdict sub-state produces 3 distinct outer verdicts with zero OR-collapse, implemented entirely in the non-frozen orchestrator; the frozen trio's SHA-256 digests are unchanged before and after.
- **SC-005**: The flag-state matrix (`unset/0/1/invalid`) is exercised and each state's outcome is distinct and correct.
- **SC-006**: Exactly one blocking drift-gate owner is documented; no second gate independently blocks on the same signal.
- **SC-007**: The rendered report's `compiledRouting` block is populated from JSON, never hand-authored.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-runtime-promotion-and-status-foundation` (implemented in `4153cbebd8`) | Provides the promoted runtime closure and stable activation manifests | Vacuous-parity guard reads the promoted hub manifest directly; `004` landed afterward in `8532c4b64b` and does not read the mutable spec tree |
| Dependency | Frozen benchmark scorer trio | Any accidental edit invalidates the safety pin for the whole program | Re-hash before every run; SAFETY: the verdict sub-state lives in the non-frozen orchestrator only (REQ-004) |
| Risk | Vacuous-parity trap (CF-BM-2) | A lane checking flag=1 alone would report false parity even when the hub is still serving legacy | Hard guard reads `servingAuthority` from the hub's activation manifest; anything other than `compiled` is a hard fail, never a pass |
| Risk | Shape impedance (CF-BM-3) | Direct compiled-vs-legacy comparison is vocabulary-incompatible and could silently produce wrong verdicts | `qualifiedIdToLeaf` bridge translates before comparison; a Vitest bijection test guards drift |
| Risk | Two consumers of one drift signal (F-25-8) | Ambiguous ownership could let two gates disagree, or let neither block | This packet is named the single blocking owner; other consumers report its classification only |
| Risk | CLI flag unreachable (CF-BM-8) | A built harness nobody can invoke from the loop/workflow surface | `--compiled-routing-parity` threaded through `loop-host.cjs` + both workflow dispatches, or the unconditional-`auto`-mode fallback recorded in every report |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: `compiledParity()` is a pure function of `{scenario, legacyObserved, skillRoot, skillId}` plus the on-disk manifest/compiled artifacts — no network calls, no clock-dependent branching.
- **NFR-D02**: The flag-state matrix (`unset/0/1/invalid`) produces the same sub-verdict for the same inputs on every run.

### Reversibility
- **NFR-R01**: The harness and its two hooks are purely additive and diagnostic; disabling `--compiled-routing-parity` (or reverting the hook diffs) returns Lane C to its exact current legacy-only behavior — zero existing code path removed.
- **NFR-R02**: A frozen-trio digest mismatch aborts the run before any report is written — no partial or corrupted parity evidence is ever persisted.

### Authority
- **NFR-A01**: The three frozen scorer files remain the sole authority for legacy route-gold scoring; `compiled-routing-parity.cjs` only compares against their verdicts, it never overrides one.
- **NFR-A02**: Exactly one blocking drift-gate owner exists (this packet); every other consumer reports the classification, never independently blocks (F-25-8).

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Precondition failures
- Frozen-trio digest drift: abort before any comparison runs; no partial parity report is written.
- Hub manifest missing or unreadable: status `vacuous` (hard fail), never `n/a`.

### Flag-state boundary
- `SPECKIT_COMPILED_ROUTING` unset: the matrix runs the legacy-only branch and records it explicitly, never as an implicit silent pass.
- Invalid value (e.g. `"yes"`, `"2"`): the matrix records a defined `invalid` outcome, never silently coerced to `0` or `1`.

### Shape-bridge boundary
- A `targetQualifiedIds` entry with no `leaf-manifest.json` match: `qualifiedIdToLeaf` fails closed (test failure), never a silent skip.
- Hub is route-gold ENFORCED but not compiled-eligible (CF-BM-5): status `n/a`, informational only, never scored as `drift`.

### Idempotency
- Re-running parity for an unchanged scenario set and unchanged manifest state reproduces an identical sub-verdict and identical report bytes (aside from timestamp fields).

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | One new non-frozen file + 2 orchestrator hooks + one additive shared-lib export + a CLI wiring change; no new plane |
| Risk | 15/25 | Sits directly beside the frozen-scorer boundary — must never edit it; a vacuous-parity or shape-bridge mistake would silently corrupt benchmark evidence |
| Research | 7/20 | Mechanism fully specified across CF-BM-1..8; residual work is precise file:line wiring, re-anchored on the named symbol at build time (review-v1 §2 line-drift note) |
| **Total** | **33/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the frozen-trio digest pin be centralized (CF-ACT-10's proposed `compiled-routing-scorer-pins.json`) before this child ships, or does it pin its own copy of the same 3 digests and reconcile later? Not assigned to any child in `review-v1.md` §4 — flag for the 002 foundation owner or a follow-up child.
- Does the `--compiled-routing-parity` CLI flag ship, or does this child take the simpler unconditional-`auto`-mode fallback (CF-BM-8 offers both)? Affects `loop-host.cjs` and both workflow dispatch surfaces.
- What is the exact reporting contract for the "other consumers" of the drift-gate classification (F-25-8) — is `routing-registry-drift.yml` (CF-ACT-10) one of them, and if so, does this child or that CI workflow's owner define the shared schema?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream research**: `../001-research/{review-v1.md, synthesis-v1.md}` §2.2 (CF-BM-1..8), §3 (F-15-3, F-25-8)
