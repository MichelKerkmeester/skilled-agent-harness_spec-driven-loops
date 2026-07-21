---
title: "Implementation Plan: Brand-First Authoring Lane"
description: "Plan for building the brand-first authoring lane: distinct artifact + provenance schema, lane authoring + overwrite policy, then the reviewed-conversion gate and adversarial verification, gated on Phase 3 completion (planned; not implemented)."
_memory:
  continuity:
    packet_pointer: "sk-design/016-hallmark-adoption/004-brand-first-lane"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 4 implementation plan (planned)"
    next_safe_action: "Await Phase 3 (003-authored-cards) completion, then begin Phase 4 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Brand-First Authoring Lane

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The lane builds inside the existing `sk-design` skill (mode registry, command surface, shared assets) and must not touch the measured DESIGN.md/tokens.json/styles corpus produced by packet `012-style-database-and-interface-commands`. Hallmark's `ROADMAP.md`/`study.md` are external, read-only, MIT-licensed reference material — no Hallmark code or assets are imported.

### Overview

This plan sequences the design and build of the brand-first authoring lane strictly after Phase 3 (`003-authored-cards`) lands, following the packet's blast-radius ordering (surgical fixes -> evidence envelopes -> authored cards -> brand-first lane). It treats the hard boundary — authored values never silently reach the measured corpus — as the primary architectural constraint driving every phase below.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Phase 3 (`003-authored-cards`) is complete and its authored-vs-measured card precedent is available for reuse.
- The 014 research syntheses' acceptance gate 8 (distinct name/schema, no ingestion without reviewed conversion) is confirmed as this phase's binding constraint.
- `spec.md` REQ-001..REQ-006 and the HARD BOUNDARY invariant are approved.

### Definition of Done

- The distinct authored artifact, origin-label/provenance schema, overwrite policy, and reviewed-conversion gate all exist and are tested.
- Adversarial tests prove no code path writes an authored value into the measured corpus outside the gate.
- `validate.sh --strict` on this spec folder reports 0 errors; `checklist.md` is fully evidenced.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Distinct-artifact isolation: the authored brand lives in its own namespace/schema (e.g. `AUTHORED-DESIGN.md` + authored tokens) that is structurally never read by the measured-corpus ingestion path; promotion is a separate, explicit, reviewed step, mirroring the packet's existing authored-vs-measured precedent from Phase 3.

### Data Flow

1. A short product description enters the brand-first lane, which authors palette/type/voice values, each tagged with an origin label (authored/invented) and provenance (source description, date, confidence note).
2. Values are written only into the distinct authored artifact — never into DESIGN.md, tokens.json, or the styles corpus.
3. Re-running the lane refreshes only the authored artifact's own exports section; measured artifacts are never touched.
4. If and only if a human explicitly runs the reviewed-conversion gate, a reviewed subset of authored values may be promoted into the measured corpus, at which point they lose their "authored" origin label and become measured, evidence-backed values.
5. No automated code path connects step 2 directly to step 4.

### Key Components

- Distinct authored artifact template (name/schema that cannot collide with measured artifacts).
- Shared origin-label/provenance schema (reusable by other authored surfaces, e.g. Phase 3's cards).
- Overwrite-policy logic (refresh authored exports only; never touch measured files).
- Reviewed-conversion gate (the sole authored-to-measured promotion mechanism).
- Adversarial boundary test suite (proves the invariant holds).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Distinct Artifact + Provenance Schema

Design and scaffold the distinct authored artifact (template + schema) and the shared origin-label/provenance schema. No lane authoring logic yet.

### Phase 2: Lane Authoring + Overwrite Policy

Implement the authoring step (palette/type/voice generation from a short product description into the distinct artifact) and the overwrite/refresh-only policy protecting measured artifacts.

### Phase 3: Reviewed-Conversion Gate + Adversarial Verification

Implement the reviewed-conversion gate as the sole promotion path and the adversarial test suite proving no other path exists; run full verification and record evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Static tests confirming the distinct artifact's name/schema cannot collide with measured artifact names/schemas.
- Adversarial tests attempting to write an authored value directly into DESIGN.md/tokens.json/styles without the gate, expecting rejection.
- Overwrite-policy tests confirming re-running the lane never mutates measured artifacts and only refreshes the authored artifact's exports.
- A manual-review-flow test confirming the reviewed-conversion gate requires an explicit human action, not an automated `verified=true`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 3 (`003-authored-cards`) completion and its authored-vs-measured precedent.
- The `sk-design` mode registry, command surface, and the measured DESIGN.md/tokens.json/styles corpus from packet `012-style-database-and-interface-commands`.
- Hallmark `ROADMAP.md`/`study.md` as external, read-only, MIT-licensed reference material.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The lane and its artifact are additive and isolated: if the reviewed-conversion gate or overwrite policy proves unsafe during build, delete the distinct authored-artifact template, provenance schema, and lane wiring. No measured artifact is ever modified by this phase, so no measured-corpus rollback is required.
<!-- /ANCHOR:rollback -->
