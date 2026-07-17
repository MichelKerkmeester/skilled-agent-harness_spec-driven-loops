---
title: "Implementation Summary: sk-doc Routing Foundation Research"
description: "Research outcome for the sk-doc routing diagnosis: the alias-gap premise was falsified, the real defect is a three-part path-contract problem, and the dependency-ordered fix plan hands off to 012-sk-doc-routing-fixes."
trigger_phrases:
  - "sk-doc routing research outcome"
  - "sk-doc benchmark root cause"
  - "path contract handoff sk-doc"
  - "sk-doc routing fix plan handoff"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/010-sk-doc-routing-research"
    last_updated_at: "2026-07-16T08:08:19Z"
    last_updated_by: "claude"
    recent_action: "Documented research outcome and fix-plan handoff"
    next_safe_action: "Plan 012-sk-doc-routing-fixes against research.md Section 8"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260716-052950-sk-doc-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: alias coverage gap falsified, 113/113 match"
      - "Q2: two coordinate systems, no handoff contract"
      - "Q3: 19-row failure classification complete"
      - "Q4: drift guard scoped to deep-loop only"
      - "Q5: 9-item dependency-ordered fix plan delivered"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-sk-doc-routing-research |
| **Completed** | 2026-07-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A 10-iteration deep-research loop traced sk-doc's 20/100 skill-benchmark score to its real cause, and that cause turned out to be different from what the packet was chartered to check. The alleged ~34-alias coverage gap does not exist. The actual defect is an undefined handoff between two coordinate systems that sk-doc's own authoring stack teaches side by side. All five original research questions got answered, and the packet closes with a dependency-ordered, implementable fix plan handed to a sibling packet for the build.

### sk-doc Routing Foundation Diagnosis

The research session (`dr-20260716-052950-sk-doc-routing`, cli-codex / gpt-5.6-sol, reasoning=high) started by testing whether ~34 `mode-registry.json` aliases lacked a `hub-router.json` `vocabularyClass` counterpart and were therefore invisible to the scorer. Iteration 1 diffed the full alias set against vocabularyClasses and found 113 of 113 matching, zero gaps. The ~34 figure came from a stale sentence in create-skill canon describing a state the tree no longer has.

With that premise gone, iteration 3 classified all 19 benchmark rows individually instead of sampling, because averages hide waste: 6 rows return a wrong path root (the model serializes packet-local leaves with hub-coordinate prefixes like `create-*/references/...`, and the scorer applies exact string equality against root-relative gold), 6 rows return the wrong or a missing leaf resource (sk-doc has no second-layer leaf router, so deterministic replay stops at the packet's `SKILL.md`), 5 rows over-bundle (one scenario alone routed 65 resources and wasted every one, plus four rows that "pass" while hiding the same D3 loss), and 2 rows already come back clean. Iteration 4 traced the wrong-root class to its root cause: packet routers emit packet-root-relative leaf IDs while the parent-hub schema declares hub-root-relative, packet-qualified addresses, and no contract in the authoring stack says which coordinate frame the public answer uses. Iteration 5 checked the guard layer and found `routing-registry-drift-guard` scoped only to system-deep-loop's own advisor projections. It never inspects sk-doc, and no current guard checks output namespace semantics, recursive packet-leaf coverage, fixture-to-topology validity, or execution-time provenance.

### Dependency-Ordered Fix Plan

Iterations 6 through 10 turned the diagnosis into something buildable instead of stopping at "here's what's wrong." The settled design fixes the public identity as the typed pair `(workflowMode, leafResourceId)`, adds an authored `leaf-aliases.json` plus a generated, byte-stable `leaf-manifest.json`, extends `parent-skill-check.cjs` with ordered guard codes, migrates all 19 fixtures to typed gold with a pre-dispatch topology gate, and updates `router-replay.cjs`/`executor-dispatch.cjs` to emit canonical pairs under a dual-read, single-write migration. Nine of sk-doc's eleven packets need their maps corrected. `create-benchmark` and `create-diff` have no failing row and stay untouched. `research/research.md` Section 8 carries the full nine-item Layer A plan plus two Layer B doctrine-propagation items. Section 9 lists six verification commands. Section 10 is the 19-row acceptance matrix. This packet does not build any of it. That work is scoped to sibling packet `012-sk-doc-routing-fixes`, which does not exist yet and needs a `/speckit:plan` pass against Section 8 before implementation starts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | Replaced the auto-seeded stub with a research-charter spec that records the falsified premise, the three-part failure classification, and the handoff to 012 |
| `implementation-summary.md` | Created | Documents the research outcome so anyone resuming this packet doesn't have to re-read all 10 iterations first |

The research deliverables themselves (`research/research.md`, `research/deep-research-dashboard.md`, `research/findings-registry.json`, `research/iterations/`, `research/deltas/`) already existed going into this documentation pass and are unchanged.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran as an autonomous deep-research loop against 10 of 10 planned iterations, with iterations 7-10 spent hardening edge cases (namespace collisions, manifest reproducibility, implementability review, a terminal consistency audit) rather than closing early once the five key questions had answers. The loop never hit its 0.05 convergence threshold: new-finding ratios declined monotonically from 0.95 to 0.24 and were still producing hardening value at the iteration cap, so it stopped on `maxIterationsReached` rather than saturation. No code changed during research. The only proof of model-facing repair, a fresh 19-scenario Mode-B live benchmark run, is deferred to the implementation packet by design.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Falsify the ~34-alias premise with a direct diff instead of trusting create-skill canon | The canon sentence at `parent_skills_nested_packets.md:208-209` described a configuration state that no longer exists. The 113/113 diff settled it in iterations 1-2 and redirected the entire investigation |
| Classify every one of the 19 benchmark rows instead of sampling | Four of the five over-bundle rows "pass" on the surface while hiding the same D3 waste. Sampling would have missed them and understated the real failure count |
| Freeze the public identity as the typed pair `(workflowMode, leafResourceId)` instead of a single string | Composite uniqueness is what makes `references/README.md` legal in ten different packets at once, and it preserves the N-to-1 fan-out between `create-skill` and `create-skill-parent` |
| Hand the fix plan to a new sibling packet instead of building it here | This packet's charter was diagnosis. Section 8's Layer A is the smallest safe file set for a separate, independently verifiable build-and-verify cycle |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Research question coverage | PASS. 5/5 key questions answered with file:line evidence (research.md Section 15, Iteration Trail) |
| Convergence | Did not reach the 0.05 stop-ratio. Stopped at `maxIterationsReached` after 10/10 iterations. Ratios declined monotonically from 0.95 to 0.24, still yielding value at the cutoff |
| Divergence audit | 0 completed pivots, 0 failed pivots, 0 audited overrides (research.md Section 12) |
| Implementability review | PASS. Iteration 9 confirmed one owner and one test layer per guard, and the smallest safe file set |
| Fresh live benchmark re-run | NOT RUN. Deferred to implementation packet 012 as the only valid proof of model-facing repair (research.md Section 9 item 8) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical grounding only.** The 20/100 report predates today's configs and carries no config fingerprints, so it supports the failure profile without proving today's exact number. A fresh Mode-B run after the 012 fixes ship is the only way to confirm repair.
2. **SD-016 stays provenance-inconclusive.** The benchmark report truncates responses at 300 characters, so SD-016's contradiction between two gold candidates can't be reconstructed after the fact. It becomes attributable only in future provenance-carrying runs.
3. **Two operator-policy calls remain open.** Legacy dual-read telemetry cutoff timing and whether manifest `--check` runs path-filtered pre-commit or unconditional CI-only are deferred to whoever plans 012. Research recommends unconditional CI.
4. **Guard hardening is designed, not built.** The ordered guard codes for manifest source validation, byte drift, target and collision checks, and bidirectional reachability (research.md Section 8 item 3) are specified but not yet added to `parent-skill-check.cjs`. `routing-registry-drift-guard` stays scoped to system-deep-loop only until 012 ships them.
<!-- /ANCHOR:limitations -->
