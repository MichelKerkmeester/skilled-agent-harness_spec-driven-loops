---
title: "Verification Checklist: Reconstruct the sk-design audit mode"
description: "Verification checklist for the Level-2 audit reconstruction packet. It checks source fidelity, evidence-backed scoring, required packet structure, read-only boundaries, downstream script boundaries, and traceability while leaving runtime and downstream verification unclaimed."
trigger_phrases:
  - "audit reconstruction verification"
  - "design QA checklist"
  - "audit score checks"
  - "source faithful audit packet checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/004-design-audit"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted unchecked audit verification checklist"
    next_safe_action: "Verify checklist items against source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/SKILL.md"
      - ".opencode/skills/sk-design/design-audit/references/"
      - ".opencode/skills/sk-design/design-audit/assets/"
      - ".opencode/skills/sk-design/design-audit/procedures/"
      - ".opencode/skills/sk-design/design-audit/scripts/"
      - ".opencode/specs/sk-design/004-design-audit/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-audit-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Reconstruct the sk-design audit mode
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] The complete design-audit SKILL.md is represented as the source of truth.
- [ ] CHK-002 [P0] The Level-2 templates and validated Level-2 reference packet were used for structure and depth.
- [ ] CHK-003 [P0] Every file under the audit references/, assets/, procedures/, and scripts/ folders is included in the source-reading scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] N/A for runtime code; this packet does not change implementation files or skill source.
- [ ] CHK-011 [P0] No packet statement invents behavior beyond SKILL.md and the cited references, procedures, assets, scripts, or supporting material.
- [ ] CHK-012 [P1] No audit, browser, overlay, fixture, deterministic script, validator, generator, or runtime execution result is claimed.
- [ ] CHK-013 [P1] The packet records the Read/Glob/Grep-only read-only contract, direct fallback without subagent dispatch, and no silent fix application.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All four files contain the required frontmatter keys, exactly four trigger phrases, and the complete continuity block.
- [ ] CHK-021 [P0] spec.md contains the reconstruction banner before section 1 and the exact Spec Folder metadata row.
- [ ] CHK-022 [P1] Every required template anchor is balanced and Markdown tables remain well formed.
- [ ] CHK-023 [P1] Source traceability covers the intact skill, ten references, two private procedures, twenty-seven assets, two scripts, and supporting paths without claiming execution.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — this is a best-effort reconstruction packet, not a source defect fix with a finding class.
- [ ] CHK-FIX-002 [P0] N/A — no runtime producer inventory is changed; the shipped audit source remains untouched.
- [ ] CHK-FIX-003 [P0] N/A — no consumer, schema field, API response, or implementation symbol is changed.
- [ ] CHK-FIX-004 [P0] N/A — no security, path, parser, redaction, scoring, evidence, or hardening fix is introduced.
- [ ] CHK-FIX-005 [P1] The independent axes for intent, target, evidence, register, resource loading, procedure selection, score, severity, owner, and downstream checks are listed before packet-use claims.
- [ ] CHK-FIX-006 [P1] N/A — no process-wide or global runtime state is read by the packet.
- [ ] CHK-FIX-007 [P1] Evidence is tied to the dated source paths and packet files, not to an unpinned implementation diff or unrun audit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials are introduced; the packet is documentation only.
- [ ] CHK-031 [P0] N/A — no input validation or runtime target processing is implemented.
- [ ] CHK-032 [P1] N/A — no authentication or authorization surface is implemented.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md, and checklist.md describe the same source-faithful audit scope.
- [ ] CHK-041 [P1] Template markers, anchor comments, metadata tables, the reconstruction banner, and evidence-limit language are preserved.
- [ ] CHK-042 [P2] No README, skill-source, feature-catalog, manual-playbook, or runtime update is required by this packet.
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
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (reconstruction packet authored 2026-07-16; audit runtime, deterministic scripts, and downstream playbook verification are not claimed)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
