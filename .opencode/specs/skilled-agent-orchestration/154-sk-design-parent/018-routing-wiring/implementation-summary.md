---
title: "Implementation Summary: sk-design routing and resource-loading wiring"
description: "Not started. Scaffold for the routing wiring: split the interface grounding loader, add the preflight dial input, add the foundations registry aliases and cross-axis TOKENS load, and add precise md-generator aliases, then rerun the routing benchmark. A later subagent implements and verifies."
trigger_phrases:
  - "sk-design routing wiring status"
  - "foundations aliases outcome"
importance_tier: "important"
contextType: "implementation"
status: not-started
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/018-routing-wiring"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the not-started status stub"
    next_safe_action: "Split the interface grounding loader, then add the foundations aliases"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-018-routing-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-design routing and resource-loading wiring

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-sk-design-parent/018-routing-wiring |
| **Completed** | Not started (scaffold only) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is scaffolded and not started. The planned work tightens router precision and resource loading across three modes: split the overloaded interface grounding loader into own-system grounding versus one surface-chosen real-world reference catalog, add the dial-calibration file to the interface preflight branch, add the foundations parent registry aliases the child owns in `.opencode/skills/sk-design/mode-registry.json`, make the foundations TOKENS branch load its cross-axis references in `design-foundations/SKILL.md`, and add precise md-generator aliases for the validate, report, preview, and study intents.

A later subagent will record the implemented wiring and the benchmark evidence here.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The wiring gaps are grounded in the interface lineage (the grounding split and the preflight dial input), the foundations lineage (P1-1 aliases and P1-2 TOKENS cross-axis), and the md-generator lineage (precise aliases). The routing economy cost is measured in `../014-routing-benchmark/implementation-summary.md`, which found audit and md-generator carrying the heaviest RESOURCE_MAP fan-out.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep new aliases precise | Broad aliases collide across foundations, interface, and md-generator, so each alias routes only to the owning mode |
| Split grounding rather than trim it | Resource recall is strong, so the fix is branch precision, not removing knowledge |
| Measure economy on the benchmark | The 014 baseline lets the wasted-load improvement for audit and md-generator be confirmed, not assumed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Interface grounding split and preflight dial input land | PENDING |
| Foundations and precise md-generator aliases added with no collisions | PENDING |
| Foundations TOKENS branch loads cross-axis context | PENDING |
| Benchmark rerun confirms recall holds and economy improves for audit and md-generator | PENDING |
| `validate.sh --strict` on this packet | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** This is a scaffold. The routers and registry still carry the wiring gaps in the live family.
2. **Economy claim needs the benchmark.** The wasted-load improvement for audit and md-generator must be measured against the 014 baseline before it can be claimed.
<!-- /ANCHOR:limitations -->
