---
title: "Implementation Summary: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "Implemented. The 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen content/topology validators, the evidence-gated cutover executor, and the two-plane LUNA-High acceptance stage are built and verified; the frozen scorer trio is byte-identical."
trigger_phrases:
  - "compiled routing playbook implementation summary"
  - "luna high acceptance build record"
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
| **Status** | Implemented and verified. The consumed siblings `002` (status probe), `003` (flag mechanics), `004` (compiled-parity harness), and `007` (durable archiver) exist on disk and were consumed live |
| **Date** | 2026-07-21 |
| **Level** | 2 |
| **Serving authority** | Unchanged by this child. No routing file, engine, or manifest was edited; the scenarios and the live stage only read serving authority. The activation manifests declare `servingAuthority: compiled`; the flag defaults off, so the fleet-effective authority (via the `002` probe) is still `legacy` (causeCode `flag-off`) — both planes are captured |
| **Frozen scorer trio** | Byte-identical before and after (`router-replay.cjs` `d5e13daf…af47`, `score-skill-benchmark.cjs` `d5a9cc72…780c`, `load-playbook-scenarios.cjs` `5029f22d…d029`); never opened for write |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A 7-hub compiled-routing scenario matrix, two non-frozen validators, an evidence-gated cutover executor, and a two-plane LUNA-HIGH live acceptance stage — all additive, no routing decision changed.

- **7 hub-local scenario files**, one per eligible hub, each keyed to a distinct route shape: `sk-code` surfaceBundle; `mcp-tooling` / `system-deep-loop` / `cli-external-orchestration` ordered-bundle (distinct rationales — design-transport pairing, deep-loop mode, CLI transport); `sk-prompt` default (the only hub with a non-null `defaultMode`); `sk-design` / `sk-doc` bundle-rules (distinct rationales — live-site extraction vs documentation-authoring). Every scenario carries the full seven-field evidence contract (`evidence_compiled_route`, `evidence_serving_authority`, `evidence_flag_state`, `evidence_fallback_cause`, `evidence_manifest_digest`, `evidence_model`, `evidence_reasoning_effort`) plus typed gold. Gold was derived from the real router output per hub, so the scenarios pass route-gold as clean corpus members with no perturbation.
- **`validate-compiled-routing-scenarios.cjs`** (new, non-frozen): rejects an id-only or missing-evidence-field scenario the frozen loader would admit, requires all seven evidence fields non-null, requires a parseable prompt and a non-null pass/fail-criteria block, and flags a holdout whose prompt leaks its own route. Never opens the frozen loader for write.
- **`validate-playbook-topology.cjs`** (modified, non-frozen): added the unified `PASS`/`FAIL`/`SKIP` verdict enum (reconciling the template's PARTIAL/READY) additively — the pre-existing `valid`/`blocked` fields and the quote-tolerance test are untouched. Recursion into nested per-feature files is made explicit and proven by a fixture.
- **`cutover-playbook-executor.cjs`** (new, non-frozen): runs each scenario's routing decision through both the legacy router and the compiled engine and derives PASS/FAIL/SKIP purely from captured evidence — the routing DECISION (workflow-mode intents), the manifest serving authority, and a conservative compiled defer (which serves the legacy decision unchanged). Every scenario is `critical: true`; a non-PASS critical scenario blocks the join-gate feed and stays legible. Consumes `004`'s flag classifier + eligibility set and `002`'s status probe; never re-derives them.
- **`luna-acceptance.cjs`** (new, non-frozen): the two-plane LUNA-HIGH live stage — `openai/gpt-5.6-luna`, variant `high`, service tier `fast`, over the runtime-owned codex adapter. stdout and stderr are two distinct captured fields; a transport timeout or unavailable binary classifies `SKIP`, never PASS/FAIL. The orchestrator-owned scenario map carries one gold-bearing held-out paraphrase per hub whose gold route is withheld from the prompt.
- **Root-playbook realignment (CF-PB-4)**: `sk-doc` root re-anchored off the retired flat RESOURCE_MAP onto `mode-registry.json`/`hub-router.json`; `mcp-tooling` Figma+Refero design-transport bundle promoted to a primary evidence row; `sk-prompt` `orderedBundle` documented as unproven (empty `bundleRules`) rather than presented as passing evidence — the claim lives in the off-limits `hub-router.json`, so it is documented, not silently advertised.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The static layer is fully deterministic: each scenario's evidence contract is captured against the hub's actual activation manifest, and the cutover executor's verdict is a pure function of captured evidence with every external seam injectable. The live LUNA layer is architecturally separate because it is the one nondeterministic dependency: its own orchestrator-owned scenario map, separate stdout/stderr capture, and fail-closed timeout handling.

A key delivery finding: the `004` compiled-parity status compares the frozen route-gold evaluator's verdict on the compiled translation (which returns ALL of a mode's leaves) against the legacy router (which returns a scored subset), so any resource-gold scenario shows a resource-representation "drift" that the existing corpus already exhibits (mcp-tooling's own corpus: 9 match / 4 drift). Because that drift is a pre-existing scorer-representation artifact and not a routing-decision change, the cutover executor gates on the routing DECISION (do compiled and legacy select the same workflow modes) — the honest compiled==legacy signal — and records the `004` status as a diagnostic.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Scenario gold derived from real router output per hub | Guarantees route-gold passes as a clean corpus member with zero perturbation; 6 of 7 hubs auto-join their corpus (sk-code is index-shape and does not) |
| Cutover gate keys on the routing DECISION (intents) + manifest serving authority, not the `004` resource-representation status | The resource-representation drift is a pre-existing artifact of the harness (present in the existing corpus); the routing decision is the honest compiled==legacy signal, and no routing logic was changed |
| Gold-bearing holdouts live in the LUNA orchestrator scenario map, not as extra hub-local files | Keeps REQ-001's "exactly one scenario file per hub" while satisfying REQ-007's holdout-per-hub; the holdouts are the nondeterministic plane |
| The LUNA stage is a separate script from the deterministic validators/executor | Isolates the one nondeterministic external dependency so its timeout=SKIP fail-closed handling cannot be diluted |
| `sk-prompt` `orderedBundle` documented as unproven rather than "proven or removed" in code | The claim lives in `hub-router.json` (an off-limits routing file) with empty `bundleRules`; the playbook realignment documents its unproven status honestly |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All commands run from the worktree; frozen files never edited.

- **Frozen scorer trio byte-identical** — `shasum -a 256` before and after equal for all three files (digests in Metadata). Not present in `git status`.
- **Content validator** — 7/7 hub scenarios PASS `validate-compiled-routing-scenarios.cjs --strict`. Fixture sweep PASS: id-only rejected, missing-evidence-field rejected, route-leaking holdout flagged, complete scenario accepted.
- **Topology validator** — 7/7 hub compiled-routing dirs `valid`, run verdict `PASS`. The pre-existing quote-tolerance test still passes. Recursion fixture PASS: a defect in a deeply-nested per-feature file blocks the run verdict (`FAIL`) while the clean root leaf passes.
- **Route-gold non-regression** — the 6 sk-doc-shape hubs (whose corpus auto-loads the new scenario) each report `verdict=PASS`, route-gold 1/1 match, 0 violations.
- **Cutover executor dry run** — 7/7 hubs `join-gate: PASS`; 6 via `compiled-decision-matches-legacy`, `sk-code` via `compiled-defers-to-legacy`. Injected-dependency fixtures cover every branch: match→PASS, drift→FAIL, vacuous→FAIL, defer→PASS, not-eligible→SKIP, engine-throw→FAIL.
- **LUNA timeout → SKIP** — proven by a seeded-timeout fixture (deterministic): a timed-out dispatch yields `SKIP` with `stdout` and `stderr` captured as distinct fields; no real timeout occurred in the bounded live run, so the SKIP path is fixture-proven rather than incidentally observed.
- **LUNA holdout generalization (live)** — bounded LUNA-HIGH run (`gpt-5.6-luna`, high, fast; run-label `luna-high-acceptance-1784596615522`): `sk-code` routing PASS (routed-to-gold `code-webflow`), `sk-code` holdout PASS (withheld=true, generalized), `sk-doc` holdout PASS (withheld=true, stated `create-skill`). Every hub in the scenario map carries a holdout whose route audits as withheld (fixture-asserted for all 7). Evidence archived via `007`'s `archive-compiled-routing.cjs` under `sk-code/benchmark/compiled-routing/…` and `sk-doc/benchmark/compiled-routing/…`.
- **Root-playbook realignment** — `sk-doc` root no longer names a source-of-record RESOURCE_MAP; `mcp-tooling` primary evidence includes the Figma+Refero bundle row; `sk-prompt` documents `orderedBundle` as unproven. The three hubs still load unchanged (shape sk-doc; counts 14/5/32 = existing + the one new scenario each).
- **Ephemeral-id comment scan** — 0 spec-path / packet-number / REQ-CF-ADR-task-id references in any new or modified code file.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The bounded LUNA-HIGH live run is a 3-scenario sample** (`sk-code` routing + holdout, `sk-doc` holdout) proving the two-plane mechanism end to end. The full 7-hub × {routing, holdout} live run is a documented follow-up — LUNA is expensive and nondeterministic; the harness runs it via `luna-acceptance.cjs --hubs <list> --stages routing,holdout`.
2. **The compiled-parity resource-representation drift is pre-existing** and inherent to the `004` harness for any resource-gold scenario whose compiled engine routes; the cutover executor deliberately gates on the routing decision instead. This is documented, not worked around.
3. **`sk-prompt`'s `orderedBundle` claim is documented as unproven, not removed at source** — the claim lives in `hub-router.json`, an off-limits routing file with empty `bundleRules`.
4. **The two pre-existing modified files** under `specs/mcp-tooling/008-…` and `specs/system-deep-loop/032-…` in `git status` are pre-existing worktree state, not part of this child.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: complete
    current_focus: "Compiled-routing 7-hub scenario matrix + content/topology validators + evidence-gated cutover executor + two-plane LUNA-High acceptance stage built and verified; frozen scorer trio byte-identical; bounded LUNA-High live run passed (sk-code routing+holdout, sk-doc holdout) and archived via 007"
    next_steps:
      - "Optional: run the full 7-hub x {routing,holdout} LUNA-High sweep as the documented bounded follow-up"
      - "Feed the cutover executor join-gate output into 011's P3 coverage-closure gate"
    blockers: []
-->
