---
title: "Implementation Summary: Remove Routing-Neutral Dead Fields"
description: "Shipped: orphan description.json extras and sk-code derived orphans deleted fleet-wide, tieBreak reconciled to the compiler-derived order, packetSkillName unified as a top-level fleet invariant (deep-loop gained the missing keys), causal_summary documented as prose — corpus byte-identical in both regimes."
trigger_phrases:
  - "dead field deletes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/007-dead-field-deletes"
    last_updated_at: "2026-07-29T19:06:19Z"
    last_updated_by: "claude-code"
    recent_action: "Deleted orphan fields; corpus neutral"
    next_safe_action: "Phase 008 manual-to-edges-migration"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-dead-field-deletes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "advisorRouting.packetSkillName resolved: DELETE fleet-wide, with deep-loop's 7 modes first gaining the missing top-level key so the invariant holds uniformly."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Remove Routing-Neutral Dead Fields

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 2 |
| **Delivered** | 2026-07-29 |
| **Execution model** | Orchestrator (gates/corpus/commits) + GPT-5.6 SOL high implementer + GPT-5.6 LUNA xhigh adversarial reviewer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The routing-neutral half of O5 plus all of O11 from the 029 research, shipped as data/doc surgery across 20 files:

- `trigger_examples` deleted from all 7 carrying `description.json` files; `supported_surfaces` + `opencode_languages` deleted from sk-code and sk-doc; `derived.supported_surfaces` + `derived.peer_resource_categories` deleted from sk-code's graph-metadata — every deletion re-proven zero-reader at implementation time (the only tolerated hit is `init_skill.py`'s description scaffold literal, per this spec's own acceptance wording).
- `sk-doc/hub-router.json`'s `routerPolicy.tieBreak` reordered to the exact order sk-doc's registry compiler derives from `routerSignals` key order (the authored array had silently drifted; runtime behavior never read it).
- `packetSkillName` unified as a fleet invariant: system-deep-loop's 7 modes gained the top-level key they never had (value = each mode's `packet`), the nested `advisorRouting.packetSkillName` was deleted from all 40 modes fleet-wide, the drift-guard now asserts top-level `packetSkillName === packet` everywhere, and the parent-hub scaffold stops writing the nested copy.
- `causal_summary` documented per phase 003's Python-canonical decision: a durable-why comment above the compiler's required-non-empty check (zero logic change) plus a contract-doc note that it is authored prose, not a routing input.
- `skill-root-metadata-contract.md` gained the tieBreak derive-not-copy exception and the spec-folder-vs-skill-root regenerator-collision note (`ci-skill-root-metadata.cjs --fix` is the only skill-root regenerator).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Orchestrator re-verified every 029 citation live before dispatch, captured full gate + both-regime corpus baselines, then dispatched GPT-5.6 SOL (high) with hard allowed-write-path fencing. SOL's first run **halted correctly on a real spec-premise error** — deep-loop's modes had no top-level `packetSkillName`, so the planned test rewrite would have gone red — and changed nothing. The orchestrator verified the finding, pre-validated the uniform-fleet fix against every doctor 3d precondition, amended the operation, and re-dispatched. GPT-5.6 LUNA (xhigh) then ran an adversarial read-only review across seven attack angles: **CLEAN on all seven**. The shared-tree hazard (a live concurrent session's WIP, including one target file carrying an unrelated keyword edit) was fenced in both dispatch prompts; the concurrent edit landed in HEAD independently mid-phase, leaving this phase's diff exactly scoped.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Uniform fleet over special-case (packetSkillName).** With deep-loop as the sole hub whose packet binding hid in the nested advisory block, the options were a conditional drift-guard or fleet uniformity; uniformity won — the invariant (`packetSkillName === packet`, top-level, every mode) is now unconditional, and deep-loop's compiled routing demonstrably never read the key (it served compiled routes without it). **tieBreak note in the contract doc, not the JSON** — JSON carries no comments and an unknown `routerPolicy` key risks the doctor's shape checks. **Annotate, don't weaken, the causal_summary check** — 003 kept the Python compiler canonical, so its required-non-empty check stands, now explained as an identity floor rather than a routing input.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All gates green post-change, compared against captured pre-change baselines:
- Fleet class gate `checked=11 passed=11 failed=0`; leaf-manifest freshness 11/11; derived freshness 11/11.
- Doctors exit 0 for sk-code, sk-doc, **and system-deep-loop** (whose modes gained the new keys — all 3d name/frontmatter checks now active there and passing).
- `skill_graph_compiler.py --validate-only` → "VALIDATION PASSED" (11 roots).
- Four-file routing vitest set (drift-guard with the rewritten assertion, both deep parity suites, golden prompts) → **31/31**.
- **Corpus byte-identical pre/post in BOTH regimes**: warm 0.5692 / 0.9843 / TT108-FT3-FF1; no-sqlite fallback 0.5333 / 0.9843 / TT101-FT3-FF1 — routing-neutral as required.
- All 16 edited JSON files parse clean; LUNA confirmed byte-minimal diffs, no collateral hunks, no whitespace drift.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

`init_skill.py`'s description scaffold still writes `trigger_examples` for newly scaffolded roots — tolerated by this spec's acceptance wording, flagged as a candidate cleanup for the signal-quality phase so new roots stop carrying a fleet-deleted field. `validate.sh --strict` remains blocked repo-wide by a concurrent session's in-flight pi-hook relocation; this phase is verified by the direct gates above (fleet/doctor/compiler/vitest/corpus), with the blocked-deferral recorded here as across the program.
<!-- /ANCHOR:limitations -->
