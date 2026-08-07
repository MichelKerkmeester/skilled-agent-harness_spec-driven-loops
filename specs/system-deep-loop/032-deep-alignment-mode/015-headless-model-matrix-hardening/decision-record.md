---
title: "Decision Record: headless model-matrix hardening for the deep-alignment loop"
description: "Architecture decisions for the deep-alignment hardening packet: where the execution-forcing fix lives, codex-as-leaf-only, adding the ultra reasoning-effort, no single-executor cli-opencode branch, and extending the shared fanout-run rather than forking a dispatcher."
trigger_phrases:
  - "deep-alignment hardening decisions"
  - "deep-alignment executor ADR"
  - "codex leaf-only decision"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/015-headless-model-matrix-hardening"
    last_updated_at: "2026-07-14T08:35:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded 5 ADRs grounding the hardening plan"
    next_safe_action: "On approval, execute per ADR-001/005 implementation notes"
---
# Decision Record: headless model-matrix hardening for the deep-alignment loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Apply the execution-forcing fix to the live per-command surface, not the shared compiled-contract template

<!-- ANCHOR:adr-001-context -->
### Context
The four deep routers are hand-authored copies. A shared template (`compile-command-contracts.cjs` `buildContractBody`) generates compiled contracts, but no live plugin injects them — the injection layer is dormant, so `opencode run --command deep/alignment` reads `alignment.md` directly. The fix could target the shared template (DRY, all four loops) or the per-command file (alignment only).
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
Apply the forcing function directly to `alignment.md` and `deep_alignment_auto.yaml`.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
- **Edit the shared `buildContractBody` template**: higher blast (regenerates all four compiled contracts) AND inert (compiled contracts are not the live path today) — changes nothing live while risking all loops. Rejected.
- **Port the wording to the shared template later**: kept as a documented future option once an injection plugin makes compiled contracts live.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
- Positive: minimal blast radius (alignment-only), fixes the live path, independently shippable.
- Negative: the three sibling loops keep the same latent risk; acceptable because they are not the current failure and can be hardened later via the shared template.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks
- CLARITY: simplest change that fixes the observed live failure.
- SYSTEMS: touches only the live router + its YAML; no dormant/shared coupling.
- BIAS: avoids the wrong-problem trap of editing an inert template.
- SUSTAINABILITY: future DRY port is documented, not blocked.
- SCOPE: matches the low-blast size of the driver-stall problem.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes
Edit `alignment.md` directive (~lines 72-84) and add a side-effecting step-0 to `deep_alignment_auto.yaml`. Do not touch `compile-command-contracts.cjs`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Codex GPT models are per-iteration leaf executors only, never loop drivers

<!-- ANCHOR:adr-002-context -->
### Context
cli-codex has no `codex exec --command` path; its SKILL mandates deep-loop dispatch through `fanout-run.cjs` as executor-kind `cli-codex`. A codex process cannot read the command markdown or run the YAML loop.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
Codex models participate solely as per-iteration leaf executors. The driver axis of the matrix is opencode-only.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered
- **Author a codex command-runner**: forbidden by cli-codex ("do not add a packet-local wrapper/command builder/spawn path"). Rejected.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences
- Positive: matches the single-Codex-adapter mandate; no new spawn path.
- Negative: "works with all codex GPT models" means leaf-executor coverage, not driver coverage — scoped explicitly in the matrix.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks
- CLARITY: one clear participation model per runtime.
- SYSTEMS: reuses the shared executor adapter.
- BIAS: prevents the false expectation of a codex driver.
- SUSTAINABILITY: no bespoke codex spawn path to maintain.
- SCOPE: bounds the matrix correctly.
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation Notes
Codex enters via the `if_cli_codex` dispatch branch and `fanout-run.cjs` cli-codex lineages; document the leaf-only model in the command surface.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Add `ultra` to the reasoning-effort enum so gpt-5.6-sol's ceiling is expressible

<!-- ANCHOR:adr-003-context -->
### Context
`executor-config.ts` `REASONING_EFFORTS` stops at `max`; codex `gpt-5.6-sol` supports `ultra`. Without it, sol cannot run at its documented ceiling as a leaf executor.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
Add `ultra` as an additive enum value in `executor-config.ts`.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered
- **Cap sol at `max` in-loop**: silently under-drives sol; a "works with all GPT models" claim would be inaccurate for sol's top tier. Rejected (overridable per spec Q1).
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences
- Positive: full sol expressiveness; additive change is low-risk.
- Negative: touches a shared file used by review/research — mitigated by additive-only + regression baseline.
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks
- CLARITY: one new enum value.
- SYSTEMS: additive; existing values unchanged.
- BIAS: avoids under-claiming sol coverage.
- SUSTAINABILITY: keeps the effort ladder complete.
- SCOPE: minimal.
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation Notes
Append `ultra` to the `REASONING_EFFORTS` list; add a unit assertion; confirm codex flag-support mapping accepts it.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: No single-executor cli-opencode leaf branch; opencode-leaf only via parallel-detached fan-out

<!-- ANCHOR:adr-004-context -->
### Context
The cli-opencode self-invocation guard bars a single-executor `if_cli_opencode` leaf from running inside an opencode driver session; deep-review routes opencode leaves only through parallel-detached fan-out lineages.
<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision
Support `native` + `cli-codex` single-executor branches and opencode leaves via fan-out only; do not add a single-executor `cli-opencode` branch.
<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered
- **Add a single-executor cli-opencode branch**: would trip the self-invocation guard when the driver is also opencode. Rejected.
<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences
- Positive: mirrors deep-review's proven topology; avoids the guard.
- Negative: opencode-leaf coverage requires the fan-out path — acceptable, that path is being wired anyway.
<!-- /ANCHOR:adr-004-consequences -->

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks
- CLARITY: matches the sibling's established branches.
- SYSTEMS: respects the self-invocation guard.
- BIAS: avoids a branch that looks useful but self-conflicts.
- SUSTAINABILITY: one fewer bespoke branch.
- SCOPE: leaf coverage still complete via fan-out.
<!-- /ANCHOR:adr-004-five-checks -->

<!-- ANCHOR:adr-004-impl -->
### Implementation Notes
Implement `if_native` + `if_cli_codex` dispatch branches; route opencode leaves through the fan-out spawn path.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Extend the shared fanout-run for loop-type alignment rather than fork a dispatcher

<!-- ANCHOR:adr-005-context -->
### Context
`fanout-run.cjs` hard-rejects any loop-type outside `{research, review}`. Leaf-executor fan-out for alignment needs an alignment branch. The deep-alignment SKILL forbids a custom parallel dispatcher.
<!-- /ANCHOR:adr-005-context -->

<!-- ANCHOR:adr-005-decision -->
### Decision
Additively extend the shared `fanout-run.cjs` to recognize `loop-type alignment` (active set, state-log map, lineage paths, prompt builder, alignment convergence flags).
<!-- /ANCHOR:adr-005-decision -->

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered
- **Fork an alignment-local dispatcher**: violates the single-runtime-adapter mandate and the SKILL's forbidden-pattern rule. Rejected.
<!-- /ANCHOR:adr-005-alternatives -->

<!-- ANCHOR:adr-005-consequences -->
### Consequences
- Positive: one runtime, reused convergence + lineage machinery.
- Negative: edits a file shared with research/review — mitigated by additive-only branches + a before/after regression baseline.
<!-- /ANCHOR:adr-005-consequences -->

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks
- CLARITY: one new branch in a known dispatcher.
- SYSTEMS: additive; sibling loop-types untouched.
- BIAS: avoids duplicate-dispatcher tech debt.
- SUSTAINABILITY: alignment rides the maintained runtime.
- SCOPE: exactly the plumbing leaf fan-out needs.
<!-- /ANCHOR:adr-005-five-checks -->

<!-- ANCHOR:adr-005-impl -->
### Implementation Notes
Add `alignment` to `ACTIVE_FANOUT_LOOP_TYPES`, `STATE_LOG_BY_LOOP_TYPE`, `expectedLineageArtifactPaths`, `buildLoopPrompt`; add `--coverage-threshold`/`--stability-window` parsing; guard research/review paths with regression tests.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
