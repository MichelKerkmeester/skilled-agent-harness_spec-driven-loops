---
title: "Verification Checklist: Reconstruct the sk-design interface mode"
description: "Verification checklist for the Level-2 interface reconstruction packet. It checks source fidelity, direction, voice, information architecture, composition, required packet structure, routing boundaries, and traceability while leaving runtime design and downstream implementation unclaimed."
trigger_phrases:
  - "interface reconstruction verification"
  - "design-interface checklist"
  - "interface source fidelity checks"
  - "interface packet structure checks"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/002-design-interface"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Reconstructed interface source contract"
    next_safe_action: "Review packet against source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/references/"
      - ".opencode/skills/sk-design/design-interface/assets/"
      - ".opencode/skills/sk-design/design-interface/procedures/"
      - ".opencode/specs/sk-design/002-design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-interface-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Reconstruct the sk-design interface mode
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

- [ ] CHK-001 [P0] The complete design-interface SKILL.md is represented as the source of truth.
- [ ] CHK-002 [P0] The Level-2 templates and validated Level-2 reference packet were used for structure and depth.
- [ ] CHK-003 [P1] Every file under the interface references/, procedures/, and assets/ folders is included in the source-reading scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] N/A for runtime code; this packet does not change implementation files or skill source.
- [ ] CHK-011 [P0] No packet statement invents behavior beyond SKILL.md and the cited references, procedures, and asset.
- [ ] CHK-012 [P1] No validator, generator, Node/npm command, external reference lookup, runtime execution, or downstream implementation result is claimed.
- [ ] CHK-013 [P1] The packet preserves the source's Read/Glob/Grep direct fallback, context/proof bar, one-procedure-card rule, and no-preset boundary.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All four files contain the required frontmatter keys, exactly four trigger phrases, and the complete continuity block.
- [ ] CHK-021 [P0] spec.md contains the exact reconstruction banner before section 1 and the exact Spec Folder metadata row.
- [ ] CHK-022 [P1] Every required template anchor is balanced and Markdown tables remain well formed.
- [ ] CHK-023 [P1] Source traceability covers SKILL.md, all 19 references, six procedures, and the interface pre-flight asset.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — this is a best-effort reconstruction packet, not a source defect fix with a finding class.
- [ ] CHK-FIX-002 [P0] N/A — no runtime producer inventory is changed; the source files remain untouched.
- [ ] CHK-FIX-003 [P0] N/A — no consumer, schema field, API response, component, token, or implementation symbol is changed.
- [ ] CHK-FIX-004 [P0] N/A — no security, path, parser, redaction, or algorithm fix is introduced.
- [ ] CHK-FIX-005 [P1] The plan lists the independent contract axes before packet-use claims are made.
- [ ] CHK-FIX-006 [P1] N/A — no process-wide or global runtime state is read by the packet.
- [ ] CHK-FIX-007 [P1] Evidence is tied to the dated source paths and packet files, not to an unpinned implementation diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials are introduced; the packet is documentation only.
- [ ] CHK-031 [P0] N/A — no input validation surface is implemented.
- [ ] CHK-032 [P1] N/A — no authentication or authorization surface is implemented.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, and checklist.md describe the same source-faithful scope.
- [ ] CHK-041 [P1] Template markers, anchor comments, metadata tables, the reconstruction banner, and source traceability are preserved.
- [ ] CHK-042 [P2] No README, runtime skill source, shared schema, or generated metadata update is required by this packet.
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

**Verification Date**: TBD (reconstruction packet authored 2026-07-16; runtime, validator, generator, and downstream verification are not claimed)
<!-- /ANCHOR:summary -->
