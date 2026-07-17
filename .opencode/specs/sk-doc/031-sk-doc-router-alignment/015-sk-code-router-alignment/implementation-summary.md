---
title: "Implementation Summary: sk-code Router — Typed-Gold Instrumentation + Live Measurement"
description: "What the Wave 2 sk-code pilot actually built and found: recon bug-claims refuted, stale baseline refreshed, a manifest-gated typed-gold derivation added to the shared loader, guard-tested, and a typed-pair surface stood up (mean recall 0.729) — with the fan-out recipe for the four remaining skills."
trigger_phrases:
  - "sk-code router typed-gold summary"
  - "sk-code pilot implementation"
  - "sk-code manifest-gated derivation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built + guard-tested the manifest-gated typed-gold derivation; typed baseline mean recall 0.729"
    next_safe_action: "Run the sk-code live-mode sample (REQ-004), then fan out baseline+live to 016-019"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 70
    open_questions:
      - "REQ-004 live-mode sample not yet run"
    answered_questions:
      - "Typed-pair surface for index-table skills is delivered via a manifest-gated loader derivation, NOT per-scenario frontmatter (which the sk-code loader shape ignores)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: sk-code Router — Typed-Gold Instrumentation + Live Measurement

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-sk-code-router-alignment |
| **Completed** | In Progress (~70%) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: IN PROGRESS (~70%).** The typed-pair pilot is built, guard-tested, and its baseline committed to the worktree. The live-mode sample (REQ-004) is the remaining pilot step; the four sibling skills (016–019) then reuse this recipe.

The load-bearing correction of this packet: **the recon that scoped Wave 2 over-diagnosed sk-code, and every specific bug claim was refuted against the actual tooling.** No map edit was made — the map is correct.

### What Was Verified (recon claims → reality)

| Recon claim | Verification | Verdict |
|-------------|--------------|---------|
| 11 broken RESOURCE_MAP paths | `sk-code-router-sync.vitest.ts` passes 7/7; paths resolve via the `shared/` alias | REFUTED |
| 6 Python syntax defects (missing commas) | `router-replay.cjs` `parseResourceMap` extracts quoted strings by regex `/"([^"]*)"/g` — commas are not load-bearing | REFUTED |
| BLOCKED-BY-STRUCTURE / null aggregate | A fresh router-mode run returns PASS, aggregate 83, d5 100, 0 unreachable; the committed baseline was stale (its unreachable loci are all pre-`code-webflow/`/`code-opencode/`-reorg path forms) | REFUTED — stale baseline |

Skipping these non-fixes was a scope-lock hold: editing a correct map to chase a hypothesized bug would have been a violation.

### What Was Built

1. **Baseline refresh (REQ-001).** Re-ran the router-mode benchmark into `sk-code/benchmark/baseline/`, replacing the stale BLOCKED-BY-STRUCTURE report. The committed baseline is now accurate.
2. **Leaf-manifest (typed-pair prerequisite).** Generated `sk-code/leaf-manifest.json` via the existing `generate-leaf-manifest.cjs --write` (4 modes: code-webflow 116 leaves, code-opencode 65, code-review 10, quality 3). `--check` is byte-stable.
3. **Manifest-gated typed-gold derivation (the mechanism).** The shared loader `load-playbook-scenarios.cjs` gained `loadManifestModeLeaves` + `deriveTypedGoldFromBodyGold`. For an index-table skill whose hub has a leaf-manifest, it types the existing packet-qualified `**Expected references loaded**` body gold into `(workflowMode, leafResourceId)` pairs, narrowed to the dominant surface mode. It is **dormant** for any skill without a manifest (returns null → byte-identical to before), so it activates only for sk-code today.
4. **Guard test.** `tests/load-playbook-typed-derivation.vitest.ts` (5/5) pins the derivation: typing packet-qualified gold, dropping preamble/shared paths, dominant-mode narrowing, null on no-resolvable, and manifest-absent → null.
5. **Typed baseline.** Re-baselined with the typed surface active: **CONDITIONAL, aggregate 83, d5 100**; `typedPairRecall` scored on 14 scenarios, **mean 0.729**.

### Key Machinery Findings (why the recipe is what it is)

- **Two loader shapes.** The benchmark loader dispatches on the presence of a root index table: index-table skills (sk-code, sk-design, system-code-graph, system-deep-loop) read body-section gold and **ignore** `expected_leaf_resources` frontmatter; frontmatter skills (sk-prompt, sk-doc) read it. So the recon's "add typed frontmatter to every scenario" would have been inert for 4 of 5 Wave 2 skills.
- **Typed-pair scoring is gated on a leaf-manifest.** `classifyTypedGoldFixture` returns null unless the skill has `leaf-manifest.json`; only sk-doc had one. A typed surface therefore requires generating the manifest first — it is infrastructure, not annotation.
- **The gold is not circular.** The typed pairs are derived from the hand-authored `**Expected references loaded**` body gold (independent of router output), then typed — not transcribed from what the router emits.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Fan-Out Recipe (for 016–019)

Per skill: (a) refresh the stale baseline (cheap; fixes misleading committed reports); (b) run a live-mode sample for the meaningful routing number; (c) OPTIONAL typed surface only if wanted — generate a leaf-manifest, then the loader derivation lights up automatically (no per-scenario authoring). Guardrails: derive typed gold from body gold, never from router output; command/negative scenarios self-exclude (no packet-qualified body gold); keep the skill's drift-guard green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Made no "correctness" edit to the RESOURCE_MAP or INTENT_SIGNALS | The map is verified correct (drift-guard 7/7); editing it to chase a recon-hypothesized bug would have been a scope-lock violation |
| Derived typed gold from the independent `**Expected references loaded**` body gold, not from router output | Transcribing router output would make gold ≡ output and measure nothing |
| Gated the typed-gold derivation on a `leaf-manifest.json`, dormant without one | Keeps propagation opt-in per skill and byte-identical for any skill lacking a manifest |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Drift-guard `sk-code-router-sync.vitest.ts`: 7/7 (map untouched).
- `generate-leaf-manifest.cjs --check .opencode/skills/sk-code`: byte-stable OK.
- Derivation guard `load-playbook-typed-derivation.vitest.ts`: 5/5.
- Router-mode run: verdict CONDITIONAL, aggregate 83, d5 100, typedPairRecall on 14 scenarios (mean 0.729).
- Regression: 19 pre-existing failures unchanged (stash-baseline confirmed); 0 new.

### Remaining

- REQ-004: sk-code live-mode sample.
- CHK-013/014: `validate.sh --strict` on this folder + completion-metadata reconcile (run from main tree — worktree dist is stale).
- Fan out 016–019 (baseline refresh + live-mode).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **CONDITIONAL is artifact-driven, not a regression.** The verdict dropped PASS→CONDITIONAL because the router's always-loaded `DEFAULT_RESOURCE` preamble (flat `references/stack_detection.md`, `references/universal/...`) does not type-resolve to manifest pairs, so `typedPairRecall` flags a `routing_contract_error` (unresolved raw resources). Flat routing is unchanged (still 83). Clearing this requires packet-qualifying the preamble into a shared manifest mode (REQ-006 follow-up) or excluding always-loaded preamble from the typed contract — deliberately deferred as beyond a proof-of-concept.
- **Redundancy with flat recall.** For sk-code the typed surface is close to the flat surface (no path-root mismatch like sk-doc had), so its marginal deterministic value is modest. The meaningful routing-quality metric remains **live-mode** (REQ-004, pending).
- **Pre-existing test failures.** The `skill-benchmark/tests/` suite shows 19 failures | 145 passed **both with and without** this change (confirmed by stash-baseline). The 4 failing files (`surface-slice-sync`, `design-dispatch-boundary-proof`, `design-token-lint`, `playbook-mode`) were last modified by other sessions' commits (e.g. the sk-code rust-reference topic-split `a063d1a6526`); they are stale-path failures from concurrent doc-split churn, outside Wave 2 scope. This change adds **zero** new failures.
<!-- /ANCHOR:limitations -->
