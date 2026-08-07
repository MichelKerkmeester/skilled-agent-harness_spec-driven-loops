---
title: "Verification Checklist: Reconstruct the sk-design hub routing layer"
description: "Verification checklist for the Level-2 hub routing reconstruction packet. It checks source fidelity, required packet structure, the single advisor identity, six-mode registry coverage, routing vocabulary, and explicit non-runtime boundaries."
trigger_phrases:
  - "hub routing reconstruction verification"
  - "mode registry routing checks"
  - "router vocabulary checklist"
  - "single advisor identity checks"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/007-design-hub-routing"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted unchecked hub routing checklist"
    next_safe_action: "Verify checklist items against hub sources"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/specs/sk-design/007-design-hub-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-hub-routing-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Reconstruct the sk-design hub routing layer
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The complete `.opencode/skills/sk-design/SKILL.md` is represented as the source of truth for hub behavior.
- [ ] CHK-002 [P0] The complete `mode-registry.json` and `hub-router.json` are represented as the routing sources of truth.
- [ ] CHK-003 [P1] The Level-2 templates and validated Level-2 reference packet were used for structure and depth.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] N/A for runtime code; this packet does not change skill implementation or router code.
- [ ] CHK-011 [P0] No packet statement invents child-mode behavior beyond the three intact hub sources and cited paths.
- [ ] CHK-012 [P1] No validator, generator, advisor, router, transport, extraction, or child-mode execution result is claimed.
- [ ] CHK-013 [P1] The packet records the six source-defined tool surfaces, workspace mutation flags, packet kinds, backends, and metadata routing without adding permissions.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All four files contain the required frontmatter keys, exactly four trigger phrases, and the complete continuity block.
- [ ] CHK-021 [P0] spec.md contains the reconstruction banner before section 1 and the exact `Spec Folder` metadata row.
- [ ] CHK-022 [P1] Every required template anchor is balanced and markdown tables remain well formed.
- [ ] CHK-023 [P0] The packet covers all six registry modes, router policy values, six signal groups, vocabulary classes, default resources, and the UI build bundle.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — this is a best-effort reconstruction packet, not a source defect fix with a finding class.
- [ ] CHK-FIX-002 [P0] N/A — no routing producer inventory is changed; the hub source, registry, and router remain untouched.
- [ ] CHK-FIX-003 [P0] N/A — no consumer, schema field, API response, or implementation symbol is changed.
- [ ] CHK-FIX-004 [P0] N/A — no security, path, parser, redaction, or algorithm fix is introduced.
- [ ] CHK-FIX-005 [P1] The plan lists the independent hub contract axes before packet-use claims are made.
- [ ] CHK-FIX-006 [P1] N/A — no process-wide or global runtime state is read by the packet.
- [ ] CHK-FIX-007 [P1] Evidence is tied to the dated source paths and packet files, not to an unpinned implementation diff.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials are introduced; the packet is documentation only.
- [ ] CHK-031 [P0] N/A — no input validation surface is implemented.
- [ ] CHK-032 [P1] N/A — no authentication or authorization surface is implemented.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, and checklist.md describe the same source-faithful hub scope.
- [ ] CHK-041 [P1] Template markers, anchor comments, metadata tables, the reconstruction banner, and the traceability section are preserved.
- [ ] CHK-042 [P2] No README or runtime skill source update is required by this packet.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The target folder contains exactly spec.md, plan.md, tasks.md, and checklist.md.
- [ ] CHK-051 [P1] description.json, graph-metadata.json, implementation-summary.md, scratch files, and unrelated paths are not created by this authoring pass.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (reconstruction packet authored 2026-07-16; runtime and downstream verification are not claimed)
<!-- /ANCHOR:summary -->
