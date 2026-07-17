---
title: "Implementation Plan: sk-code Router — Typed-Gold Instrumentation + Live Measurement"
description: "Dependency-ordered plan for the Wave 2 sk-code pilot: verify-no-map-bug, refresh stale baseline, partition routing vs command scenarios, add a manifest-gated typed-gold derivation to the shared loader, re-baseline, live-mode sample, capture the fan-out recipe."
trigger_phrases:
  - "sk-code router typed gold plan"
  - "wave 2 sk-code pilot phases"
  - "manifest-gated typed-gold derivation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Conformed plan to the strict template; added section anchors and continuity block"
    next_safe_action: "Execute Phase 5 (live-mode sample), then capture the fan-out recipe"
    blockers: []
    key_files:
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-sk-code-router-alignment-authoring"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: sk-code Router — Typed-Gold Instrumentation + Live Measurement

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Measurement-only propagation of the Wave 1 typed-pair standard to sk-code. The map is verified correct, so no map-correctness work is done; the effort is refreshing the stale baseline, generating a leaf-manifest, adding a manifest-gated derivation that types the existing independent body gold, and obtaining a live-mode number. The pilot doubles as the recipe proof for children 016–019.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Drift-guard `sk-code-router-sync.vitest.ts` stays 7/7 after any change (proves the map is untouched).
- `node --check` passes on the changed loader.
- The derivation guard test passes and the full `skill-benchmark/tests/` suite shows zero new failures vs the captured pre-change baseline.
- `generate-leaf-manifest.cjs --check` is byte-stable.
- `validate.sh --strict` on this folder exits 0 (run from the main tree — worktree dist is stale).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The shared loader `load-playbook-scenarios.cjs` dispatches on playbook shape: index-table skills (sk-code) read body-section gold; frontmatter skills read typed frontmatter. Typed-pair scoring is gated on a `leaf-manifest.json`. The mechanism therefore adds, in the index-table branch, a derivation that (a) loads the hub's manifest modes when present and (b) types the packet-qualified body gold into `(workflowMode, leafResourceId)` pairs narrowed to the dominant mode. It is dormant for any skill lacking a manifest.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Ground truth & baseline refresh
Confirm the map is correct (drift-guard 7/7, regex parser, fresh PASS 83). Replace the stale committed baseline with the fresh accurate run.

### Phase 2 — Partition routing vs command scenarios
Classify each loaded scenario as ROUTING or COMMAND; only routing scenarios yield typed gold (command/negative scenarios self-exclude via absent packet-qualified body gold).

### Phase 3 — Leaf-manifest + typed-gold derivation
Generate `sk-code/leaf-manifest.json`. Add `loadManifestModeLeaves` + `deriveTypedGoldFromBodyGold` to the loader's index-table branch; derive typed pairs from the independent body gold.

### Phase 4 — Re-baseline & confirm typed dims score
Re-run router mode; confirm `typedPairRecall` + mode-routing become non-null for annotated scenarios. Commit the refreshed typed baseline.

### Phase 5 — Live-mode sample
Run a representative routing sample through the live-mode executor; record the number, transport, and model/effort.

### Phase 6 — Capture the fan-out recipe
Document steps, guardrails, and machinery gaps for 016–019.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit-test the pure derivation with a synthetic manifest and synthetic body gold (robust against concurrent playbook churn): typing packet-qualified gold, dropping preamble/shared paths, dominant-mode narrowing, null on no-resolvable, and manifest-absent → null. Capture a pre-change suite baseline by stash; require zero new failures. Keep the drift-guard green as the map-untouched proof.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Wave 1 typed-pair machinery (loader/scorer/dispatch/oracle) — shipped on origin/v4.
- `generate-leaf-manifest.cjs` + the contract library — reused as-is to generate sk-code's manifest.
- Live-mode executor (cli-opencode transport) — for the live sample.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The baseline refresh, the leaf-manifest, and the loader derivation are additive/replaceable; `git checkout` of the touched files restores the prior state. No router or map code is changed, so there is no runtime routing behavior to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (baseline) is independent. Phase 3 (derivation) depends on Phase 2's partition understanding and the generated manifest. Phase 4 depends on Phase 3. Phase 5 (live) depends only on the corrected scenarios, not on the typed surface. Phase 6 depends on 1–5 completing.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small. One shared loader function (~40 LOC) + a generated manifest + a ~60-LOC guard test + two benchmark re-runs + a bounded live-mode sample. No router or map surgery.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If the typed surface proves undesirable, revert by deleting `sk-code/leaf-manifest.json` — the derivation goes dormant automatically (manifest-gated) and the loader returns to byte-identical untyped behavior, with no need to revert the loader code itself.
<!-- /ANCHOR:enhanced-rollback -->
