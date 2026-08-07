---
title: "Implementation Plan: Command Metadata as a Hub Standard"
description: "Schema-first plan: pure core validator, fleet-gate integration, contract flip, cross-model authoring of six hub command surfaces, scaffolder and doctrine updates, fixture-first verification."
trigger_phrases:
  - "command metadata plan"
  - "hub command surface plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/022-command-metadata-generalization"
    last_updated_at: "2026-07-28T13:08:48Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the executed plan"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-command-metadata-generalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Command Metadata as a Hub Standard

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Build the consumer before widening the file: a pure core-schema library first, wired into the already-root-enumerating fleet gate, so the moment the contract flips every hub's file has a reader. Then author the six missing surfaces (cross-model: LUNA xhigh writes the two large files, orchestrator writes the trivial ones, SOL high adversarially verifies), teach the scaffolder, and update doctrine.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Bar |
|------|---------|-----|
| Fleet class gate | `node .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` | 11/11, all hubs command-validated |
| Contract tests | `node .../tests/skill-root-metadata-contract.test.cjs` | pass |
| Doctor fixture suite | `node .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs` | pass |
| Freshness | `node .../ci-leaf-manifest-freshness.cjs` | 11/11 fresh |
| sk-code surface | `bash .opencode/skills/sk-code/code-opencode/scripts/run-all-drift-guards.sh` | 3/3 |
| Mutation probe | seeded unknown-owner-mode + missing-resource | gate FAILs, restore, gate passes |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three layers, mirroring the predecessor's split: a pure library (`command-metadata-schema.cjs`) that never touches disk, the fleet gate as the single impure caller injecting existence probes, and authored data at each hub root. The core schema is a strict subset of sk-design's shape so the richest file needs no migration and per-hub extension fields remain legal above the core.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core schema library

Pure validator authored first; sk-design's existing file is the compatibility bar and seeded mutations are the rejection proof.

### Phase 2: Contract flip and gate wiring

Move the file into the H-required set, forbid it on S, empty the overlay map, and wire per-hub validation into the fleet gate. The baseline run itself is the proof: six hubs fail on the new requirement while sk-design passes.

### Phase 3: Author the surfaces

Orchestrator writes the three empty declarations and the one-entry sk-prompt file; LUNA xhigh authors sk-doc (11 entries) and system-deep-loop (8 entries) and self-validates against the live gate until 11/11.

### Phase 4: Scaffolder, doctrine, tests

Parent scaffold writes the empty declaration; canonical doc, SKILL.md workflow step and READMEs updated; contract and doctor suites extended and green; scaffold proof for both classes.

### Phase 5: Adversarial verification and landing

SOL high reviews the full diff findings-first; unrefuted P0/P1 block landing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixture-first: contract unit cases for H-required/S-forbidden/uniformity; live-fleet conformance as a pinned expectation; a seeded-mutation probe against a real hub file proving the validator is load-bearing; end-to-end scaffold proof (`init_skill.py` both kinds → gate `--fix` → clean re-run).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The predecessor packet's contract library, fleet gate, and test harness; mode registries as owner-mode authority; `.opencode/commands/` as the definition-file authority.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the packet's commits: the contract returns to overlay form and the six new files disappear with it. No generated artifacts or databases depend on the new data yet, so rollback is a pure git operation.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

Phase 2 depends on 1 (the gate imports the schema lib); 3 depends on 2 (authors iterate against live gate output); 4 and 5 depend on 3.

## L2: EFFORT ESTIMATION

Single session: ~300 lines of code/tests, ~900 lines of authored JSON (19 entries), doc surface edits.

## L2: ENHANCED ROLLBACK

If only the authored data proves wrong, fix entries in place — the schema and gate stand alone. If the schema proves wrong, sk-design's file is the compatibility bar any change must keep passing.
