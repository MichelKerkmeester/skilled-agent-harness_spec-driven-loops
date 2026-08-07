---
title: "Verification Checklist: Reconstruct the sk-design shared backbone"
description: "Verification checklist for the Level-2 shared-backbone reconstruction packet. It checks source fidelity, required packet structure, benchmark and catalog caveats, shared proof boundaries, and traceability while leaving runtime and downstream gate execution unclaimed."
trigger_phrases:
  - "shared backbone reconstruction verification"
  - "sk-design proof gate checklist"
  - "design benchmark evidence checks"
  - "shared source packet checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/008-design-shared-backbone"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Draft shared backbone verification checklist"
    next_safe_action: "Verify checklist items against source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/"
      - ".opencode/skills/sk-design/benchmark/"
      - ".opencode/skills/sk-design/feature_catalog/"
      - ".opencode/specs/sk-design/008-design-shared-backbone/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-shared-backbone-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Reconstruct the sk-design shared backbone
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

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All 24 shared files are represented in the source-reading scope.
- [ ] CHK-002 [P0] All 15 benchmark files and all 6 feature-catalog files are represented in the source-reading scope.
- [ ] CHK-003 [P1] The four Level-2 templates and validated Level-2 reference packet were used for structure and depth.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] N/A for runtime code; this packet does not change implementation files or skill source.
- [ ] CHK-011 [P0] No packet statement invents behavior beyond the shared source, benchmark artifacts, and feature catalog.
- [ ] CHK-012 [P1] No validator, generator, benchmark harness, deterministic script, transport, or runtime execution result is claimed.
- [ ] CHK-013 [P1] The packet preserves register-first context, proof gates, dispatch and token boundaries, transport-versus-taste separation, and private-card scope.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All four files contain the required frontmatter keys, exactly four trigger phrases, and the complete continuity block.
- [ ] CHK-021 [P0] spec.md contains the reconstruction banner before section 1 and the exact Spec Folder metadata row.
- [ ] CHK-022 [P1] Every required template anchor is balanced and Markdown tables remain well formed.
- [ ] CHK-023 [P1] Sources / Traceability covers every requested source path and distinguishes recorded benchmark evidence from current verification.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — this is a best-effort reconstruction packet, not a source defect fix with a finding class.
- [ ] CHK-FIX-002 [P0] N/A — no runtime producer inventory is changed; the source files remain untouched.
- [ ] CHK-FIX-003 [P0] N/A — no consumer, schema field, API response, transport, or implementation symbol is changed.
- [ ] CHK-FIX-004 [P0] N/A — no security, path, parser, redaction, or algorithm fix is introduced.
- [ ] CHK-FIX-005 [P1] The plan lists the independent shared-contract, evidence, and downstream-owner axes before packet-use claims are made.
- [ ] CHK-FIX-006 [P1] N/A — no process-wide or global runtime state is read by the packet.
- [ ] CHK-FIX-007 [P1] Evidence is tied to the dated source paths and packet files, not to an unpinned implementation diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials are introduced; the packet is documentation only.
- [ ] CHK-031 [P0] N/A — no input validation surface is implemented.
- [ ] CHK-032 [P1] N/A — no authentication or authorization surface is implemented by this packet.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, and checklist.md describe the same source-faithful scope.
- [ ] CHK-041 [P1] Template markers, anchor comments, metadata tables, and the reconstruction banner are preserved.
- [ ] CHK-042 [P2] No README, source, generated metadata, or runtime skill update is required by this packet.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The target folder contains exactly spec.md, plan.md, tasks.md, and checklist.md.
- [ ] CHK-051 [P1] description.json, graph-metadata.json, implementation-summary.md, scratch files, and unrelated paths are not created by this authoring pass.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (reconstruction packet authored 2026-07-16; runtime and downstream verification are not claimed)
<!-- /ANCHOR:summary -->
