---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "The sk-design family architecture is locked: an umbrella-router over a flat sibling family with 5 core children, flat-name backward-compat, and a fixed 003-006 migration order, converting the 001 corpus research into a binding decision."
trigger_phrases:
  - "sk-design architecture decision summary"
  - "umbrella router decision locked"
  - "5 core design children"
  - "sk-design migration order summary"
  - "impl summary core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/002-architecture-decision"
    last_updated_at: "2026-06-25T12:41:14Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the locked umbrella + 5-core-children architecture decision as complete"
    next_safe_action: "Hand off to 003-scaffold-parent to scaffold the umbrella skill and registry"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../001-corpus-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/002-architecture-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Foundations grain (color/layout split) deferred to 005"
      - "Optional sk-design-output child revisit deferred"
    answered_questions:
      - "Structural model: umbrella-router over a sibling family"
      - "Taxonomy: 5 core children, output deferred"
      - "Naming/compat: keep flat sk-design-* names, preserve legacy triggers"
      - "Migration order: 003 scaffold, 004 onboard, 005 build, 006 integrate"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-architecture-decision |
| **Completed** | 2026-06-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase turns the 4-model corpus research in `../001-corpus-research/research/research.md` into the binding architecture for the sk-design family. The research recommended a direction but stopped short of committing; the decision is now locked. `sk-design` becomes a thin umbrella-router over a flat family of independent sibling skills, with 5 core children, flat names kept so existing references need zero rewrites, and a fixed 003-006 migration order. The recorded decision lives in this folder's `spec.md` (scope and requirements) and `plan.md` (architecture), and is the input every downstream build phase consumes.

### The structural model decision

You now have one structural model instead of an open question. The family is an umbrella-router: `sk-design` routes generic design entry to the right child, but the children stay independent top-level skills the advisor reaches directly. Hub-style structure (a once-per-session shared base, à la `impeccable`) is used only inside the `sk-design-interface` child, not across the family. The decision was made on coupling, not corpus fashion: the runtimes are heterogeneous (`sk-design-spec` carries a Playwright extraction backend while `sk-design-interface` is pure judgment), the children are independently invokable, and keeping flat `sk-design-*` names means the mcp-open-design co-load, mcp-figma, sk-code, and CLAUDE.md gates keep resolving unchanged. The single-hub alternative (kimi27's dissent, argued on single-advisor-identity grounds) is recorded and deferred, not deleted: if future advisor/usage telemetry shows mostly-generic entry, the call can be revisited.

### The taxonomy decision

You now have a fixed set of 5 core children. `sk-design-interface` keeps its name and folds the existing interface skill (direction and build). `sk-design-spec` folds `sk-design-md-generator` (keeping that name as an alias) and owns the DESIGN.md extract-and-author contract. Three children are net-new: `sk-design-foundations` (the static visual system - OKLCH color, type, layout, tokens), `sk-design-motion` (animation, micro-interactions, transitions), and `sk-design-audit` (cross-cutting a11y/perf/critique/harden with a P0-P3 severity and 5-dimension `/20` contract). `sk-design-output` is deferred for v1; its sources become a references library under the interface child.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | Records the problem, scope, requirements, and risks of the locked decision |
| `plan.md` | Modified | Records the decision approach and the umbrella architecture |
| `tasks.md` | Modified | Records the decision-locking steps as completed |
| `implementation-summary.md` | Modified | Records the locked decision as the completed deliverable |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The decision was delivered by synthesizing the consolidated research, confirming each finding against the operator's locked calls, and recording the result across this phase's Level 1 docs; it is documentation-only, with no code shipped.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Chose an umbrella-router over a single hub | The family's runtimes are heterogeneous and its children are independently invokable, so a hub would co-load a Playwright backend on every design request; flat sibling names also keep all existing references resolving with zero rewrites. |
| Locked 5 core children and deferred `sk-design-output` | Five clusters are each deep, independently invokable, and corpus-backed; the output cluster is thin enough for v1 to live as interface references and be revisited later. |
| Kept flat `sk-design-*` names and the `sk-design-md-generator` alias | Preserving the names avoids rewriting the mcp-open-design co-load, mcp-figma, sk-code, and CLAUDE.md gate references, and keeps legacy trigger phrases working. |
| Recorded the rejected hub alternative instead of deleting it | The advisor/usage-telemetry signal is missing, so keeping kimi27's hub case documented makes a future flip cheap if generic entry dominates. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-spec-folder> --strict` | Deferred to the orchestrator, which runs validation centrally; this phase did not run scripts |
| Decision completeness review against `../001-corpus-research/research/research.md` | PASS - all four calls (structural model, taxonomy, naming/compat, migration order) recorded with no either/or remaining |
| Rejected-alternative and consequences captured | PASS - hub alternative, single-advisor-identity rationale, telemetry gap, and shared-base coupling recorded in `spec.md` and `plan.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The structural call rests on a missing signal.** No advisor/usage telemetry was available, so the umbrella-vs-hub decision is made on coupling evidence; if real usage is mostly generic ("make this look good"), the documented hub alternative may warrant a revisit.
2. **Foundations grain is unresolved.** Whether `sk-design-foundations` stays one child or splits into color/layout is deferred to 005; structure its internals as `color/`, `type/`, `layout/` so a later split is mechanical.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
