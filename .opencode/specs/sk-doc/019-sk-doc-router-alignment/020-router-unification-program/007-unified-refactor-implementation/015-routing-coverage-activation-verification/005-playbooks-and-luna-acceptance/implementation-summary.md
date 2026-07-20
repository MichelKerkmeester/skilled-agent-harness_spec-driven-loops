---
title: "Implementation Summary: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "Planned, not yet implemented. Forward-looking build record for the 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen validators/executor, and the two-plane LUNA-High acceptance stage."
trigger_phrases:
  - "compiled routing playbook implementation summary"
  - "luna high acceptance planned build record"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned — not yet implemented. Depends on `002-runtime-promotion-and-status-foundation` and `004-benchmark-compiled-lane-c`, both Planned/Not-started |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Serving authority** | Not applicable — this child never changes serving authority; it authors scenarios and a live acceptance stage that read it |
| **Strict validation** | `validate.sh --strict` reports Errors: 0 for this doc set (spec-doc structure only; the scenarios, validators, executor, and LUNA stage described below have not been built or run) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Nothing yet — this section describes what is planned, not what exists.** A 7-hub compiled-routing scenario matrix will give each eligible hub exactly one scenario, selected for a distinct route shape rather than duplicated routing semantics (CF-PB-2), each carrying a full evidence contract (`compiledRoute`, serving-status, flag, fallback-cause, manifest-digest, model, reasoning-effort — CF-PB-3). A non-frozen content validator will reject the gold-less scenarios the frozen loader currently admits (CF-PB-1); the existing topology validator will be extended to recurse into per-feature files with one unified verdict enum (CF-PB-5). A non-frozen cutover executor will run each scenario's command sequence and gate on captured evidence rather than a manual assertion (CF-PB-5). Separately, a two-plane LUNA-HIGH live acceptance stage will classify transport timeouts as `SKIP` — never a false PASS or FAIL — and will require at least one gold-bearing held-out paraphrase per hub to prove generalization rather than fitted-prompt success (CF-BM-7).

### Files To Be Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Scenarios | 7 hub-local `manual-testing-playbook/compiled-routing/` files | The minimal compiled-routing scenario matrix |
| Validators | `validate-compiled-routing-scenarios.cjs` (new), `validate-playbook-topology.cjs` (modified) | Content + topology gates, non-frozen |
| Execution | `cutover-playbook-executor.cjs`, `luna-acceptance.cjs` | Evidence-gated executor + live LUNA-High stage |
| Root-playbook realignment | `sk-doc`, `mcp-tooling`, `sk-prompt` root `manual-testing-playbook.md` | CF-PB-4 fixes |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this doc set) | Planning record — authored now, ahead of implementation |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

**Not yet delivered — this section describes the planned delivery mechanics.** Per the plan, the static layer (scenarios + content/topology validators + cutover executor) will be built first and is fully deterministic: every scenario's evidence contract is captured against the hub's actual activation manifest, and the executor's PASS/FAIL/SKIP outcome is a pure function of that captured evidence. The live layer (the LUNA-HIGH acceptance stage) will be architecturally separate, because it is the one nondeterministic external dependency in this child — it gets its own orchestrator-owned scenario map, captures stdout/stderr separately, and classifies a transport timeout as `SKIP` rather than coercing it into a pass or fail. The gold-bearing holdout scenarios will be authored so each holdout's correct route is present in the scenario's own gold record but never appears verbatim in the prompt text sent to the model.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| The live LUNA-HIGH stage will be a separate script (`luna-acceptance.cjs`) from the deterministic validators/executor | Isolates the one nondeterministic external dependency so its fail-closed handling (timeout = SKIP) cannot be diluted by, or accidentally coupled to, the deterministic content/topology gates |
| Scenario selection is one per hub by distinct route shape, not full routing-semantics duplication per hub | CF-PB-2 — legacy/holdout/disambiguation are behavior-identical once a hub serves compiled; testing serving authority itself is the actual coverage gap |
| Secondary-authority checks move to an Optional Supplemental section | Keeps the primary 7-scenario matrix minimal and centralizes flag/fallback/status mechanics consumption under `system-skill-advisor` instead of re-deriving them per hub |
| This child's evidence-contract schema will be reconciled with `004`'s planned `row.compiledParity` shape before either implements | Both children are Planned; settling field names now avoids a mismatch adapter later |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet executed. The verification plan (`tasks.md` Phase 3, `checklist.md` Testing) defines: a content-validator fixture sweep, a topology recursion fixture, a cutover-executor dry run, a seeded LUNA-HIGH timeout fixture, a holdout audit across all 7 hubs, and a root-playbook realignment check. None of these has run. This section will be replaced with real results and evidence citations once this child is implemented — it must not be read as a completion record until then.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning-only packet.** Zero lines of the scenarios, validators, executor, or LUNA stage exist yet. Every CF-ID citation is grounded in `../001-research/review-v1.md` and `../001-research/synthesis-v1.md`; none has been re-verified against a running harness.
2. **Depends on two still-Planned siblings.** `002-runtime-promotion-and-status-foundation` and `004-benchmark-compiled-lane-c` are both Planned/Not-started; this child's evidence-contract schema is authored to anticipate `004`'s shape but cannot be confirmed correct until `004` implements.
3. **The LUNA-HIGH sample bound is not yet fixed.** `010`'s T9 precedent used 2 prompts/hub; this child adds a mandatory gold-bearing holdout that T9 did not have, so the exact per-hub sample size is an open question (`spec.md` §7), not yet a locked number.
4. **Full-corpus LUNA verification is explicitly out of scope**, mirroring `010`'s own honestly-bounded T9 sample — this remains a sample, never claimed as exhaustive.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: planned
    current_focus: "Level-2 planning docs authored for the compiled-routing playbook scenario matrix + LUNA-High acceptance stage (CF-PB-1..5, CF-BM-7); zero implementation yet"
    next_steps:
      - "Reconcile evidence-contract field names with 004's planned row.compiledParity shape"
      - "Author the 7 hub-local scenario files once the manifest-read stopgap pattern is confirmed"
      - "Fix the LUNA-HIGH per-hub sample bound explicitly before the live stage is built"
    blockers:
      - "002-runtime-promotion-and-status-foundation not yet built (soft dependency via the manifest-read stopgap)"
      - "004-benchmark-compiled-lane-c not yet built (evidence-contract schema reconciliation pending)"
-->
