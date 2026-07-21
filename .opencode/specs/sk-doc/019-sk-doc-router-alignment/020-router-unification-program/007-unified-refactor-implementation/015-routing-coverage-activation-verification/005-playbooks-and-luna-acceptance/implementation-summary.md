---
title: "Implementation Summary: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "Implemented. The 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen content/topology validators, the evidence-gated cutover executor, and the two-plane LUNA-High acceptance stage are built and verified. The full seven-hub follow-up was rerun with real gpt-5.6-luna-high dispatch (a Claude parent runtime, no self-invocation guard) and archived under luna-high-real-20260721-073315: 13/14 live rows PASS, 1 real FAIL (mcp-tooling's holdout routed to mcp-mobbin instead of gold mcp-refero), zero SKIPs."
trigger_phrases:
  - "compiled routing playbook implementation summary"
  - "luna high acceptance build record"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/005-playbooks-and-luna-acceptance"
    last_updated_at: "2026-07-21T07:50:27Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Reran 7-hub LUNA-HIGH sweep with real dispatch: 13/14 PASS, 1 FAIL, 0 SKIP"
    next_safe_action: "Use archived real evidence (luna-high-real-20260721-073315) at next cutover review"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
    completion_pct: 100
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
| **Full-sweep follow-up** | Run label `luna-high-real-20260721-073315`: deterministic scenario admission and compiled-vs-legacy cutover checks PASS for 7/7 hubs; the two-plane LUNA-HIGH acceptance stage was rerun from a Claude parent runtime (no `cli-codex` self-invocation guard applies) — 6/7 hubs PASS both planes, `mcp-tooling` PASS routing / FAIL holdout (stated `mcp-mobbin` instead of gold `mcp-refero`); zero SKIPs, zero transport failures across all 14 rows. |

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
- **Full seven-hub follow-up (real model, superseding the prior SKIP-only archive)** — the exact `luna-acceptance.cjs` scenario map (routing + holdout per hub) was exercised per-stage from a Claude Code parent runtime dispatching `codex exec -m gpt-5.6-luna` directly — not a nested Codex session, so the `cli-codex` self-invocation guard that blocked the prior attempt does not apply. `providerModel=openai/gpt-5.6-luna`, variant `high`, service tier `fast`, transport `stdout`/`stderr` captured separately per row exactly as designed. All 14 dispatches returned a real model response in 21s–129s each, well inside the 480s per-dispatch ceiling — zero timeouts, zero SKIPs. 13/14 rows PASS. The one FAIL is `mcp-tooling`'s holdout (`LUNA-MT-H`): the model stated `mcp-mobbin` (`intents: ["SCREENS"]`) instead of the gold `mcp-refero` for the paraphrase "find how three shipped fintech apps designed their onboarding screens and pull those real product UI references" — a plausible confusion between the hub's two real-app-reference transports, not a transport or scoring defect; it is reported as observed, not re-run to chase a different answer. All seven held-out prompts audited `withheld=true` (route absent from the prompt text); six resolved correctly to gold, one did not. The prior `luna-high-step4-20260721-070659` SKIP-only archive (zero model responses, structurally inconclusive) was removed as superseded.

| Hub | Routing plane | Held-out plane | Held-out route result | Archived report |
|-----|---------------|----------------|-----------------------|-----------------|
| `sk-code` | PASS (`code-webflow`) | PASS (`withheld=true`, generalized) | Resolved correctly; gold `code-webflow` | `.opencode/skills/sk-code/benchmark/compiled-routing/luna-high-real-20260721-073315/skill-benchmark-report.json` |
| `sk-design` | PASS (`md-generator`) | PASS (`withheld=true`, generalized) | Resolved correctly; gold `md-generator` | `.opencode/skills/sk-design/benchmark/compiled-routing/luna-high-real-20260721-073315/skill-benchmark-report.json` |
| `sk-doc` | PASS (`create-skill`) | PASS (`withheld=true`, generalized) | Resolved correctly; gold `create-skill` | `.opencode/skills/sk-doc/benchmark/compiled-routing/luna-high-real-20260721-073315/skill-benchmark-report.json` |
| `sk-prompt` | PASS (`prompt-improve`) | PASS (`withheld=true`, generalized) | Resolved correctly; gold `prompt-improve` | `.opencode/skills/sk-prompt/benchmark/compiled-routing/luna-high-real-20260721-073315/skill-benchmark-report.json` |
| `mcp-tooling` | PASS (`mcp-refero`) | **FAIL** (`withheld=true`; stated `mcp-mobbin`) | Not resolved; gold `mcp-refero`, model said `mcp-mobbin` | `.opencode/skills/mcp-tooling/benchmark/compiled-routing/luna-high-real-20260721-073315/skill-benchmark-report.json` |
| `system-deep-loop` | PASS (`research`) | PASS (`withheld=true`, generalized) | Resolved correctly; gold `research` | `.opencode/skills/system-deep-loop/benchmark/compiled-routing/luna-high-real-20260721-073315/skill-benchmark-report.json` |
| `cli-external-orchestration` | PASS (`cli-opencode`) | PASS (`withheld=true`, generalized) | Resolved correctly; gold `cli-opencode` | `.opencode/skills/cli-external-orchestration/benchmark/compiled-routing/luna-high-real-20260721-073315/skill-benchmark-report.json` |

Each archive also contains the renderer-produced `skill-benchmark-report.md`, schema-valid `serving-snapshot.json`, and `serving-snapshot.md`. Provenance is repo-relative, every snapshot records declared authority `compiled` and flag state `unset`, and every snapshot's `realModelLast` entry identifies this run's real verdict (`PASS` for six hubs, `FAIL` for `mcp-tooling`) rather than a SKIP or a fabricated result. The frozen scorer trio (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) was SHA-256-verified byte-identical before and after this rerun.
- **Root-playbook realignment** — `sk-doc` root no longer names a source-of-record RESOURCE_MAP; `mcp-tooling` primary evidence includes the Figma+Refero bundle row; `sk-prompt` documents `orderedBundle` as unproven. The three hubs still load unchanged (shape sk-doc; counts 14/5/32 = existing + the one new scenario each).
- **Ephemeral-id comment scan** — 0 spec-path / packet-number / REQ-CF-ADR-task-id references in any new or modified code file.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full 7-hub × {routing, holdout} follow-up is now real and conclusive.** Rerun from a Claude Code parent runtime dispatching `codex exec` as a direct child process (the `cli-codex` self-invocation hard guard only blocks a Codex session from launching a *nested* Codex subject, which does not apply here), all 14 rows produced a real model response — zero SKIPs, zero timeouts. 13/14 PASS; `mcp-tooling`'s holdout is a genuine FAIL (model named `mcp-mobbin` instead of gold `mcp-refero`), documented honestly rather than re-run to chase a different answer. This supersedes both the earlier 3-scenario bounded sample and the `luna-high-step4-20260721-070659` SKIP-only archive (removed as superseded). `mcp-tooling`'s holdout miss is worth a look during future routing-corpus refinement, but fixing hub prompts/corpora is out of this packet's scope (this packet builds and proves the measurement, not the routed hubs' own content).
2. **The compiled-parity resource-representation drift is pre-existing** and inherent to the `004` harness for any resource-gold scenario whose compiled engine routes; the cutover executor deliberately gates on the routing decision instead. This is documented, not worked around.
3. **`sk-prompt`'s `orderedBundle` claim is documented as unproven, not removed at source** — the claim lives in `hub-router.json`, an off-limits routing file with empty `bundleRules`.
4. **The two pre-existing modified files** under `specs/mcp-tooling/008-…` and `specs/system-deep-loop/032-…` in `git status` are pre-existing worktree state, not part of this child.

<!-- /ANCHOR:limitations -->
