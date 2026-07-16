---
title: "Verification Checklist: Reconstruct the sk-design md-generator mode"
description: "Verification checklist for the Level-2 md-generator reconstruction packet. It checks source fidelity, deterministic token provenance, v3 document structure, runtime boundary language, safe backend paths, and traceability while leaving extraction and downstream verification unclaimed."
trigger_phrases:
  - "md-generator reconstruction verification"
  - "design token extraction checklist"
  - "DESIGN.md fidelity checks"
  - "source faithful md-generator packet checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/005-design-md-generator"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted source faithful md-generator packet"
    next_safe_action: "Review packet against shipped source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/SKILL.md"
      - ".opencode/skills/sk-design/design-md-generator/references/"
      - ".opencode/skills/sk-design/design-md-generator/assets/"
      - ".opencode/skills/sk-design/design-md-generator/backend/"
      - ".opencode/specs/sk-design/005-design-md-generator/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-md-generator-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Reconstruct the sk-design md-generator mode
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

| Priority | Meaning |
|----------|---------|
| **[P0]** | Blocking; must be satisfied for the packet to be structurally acceptable |
| **[P1]** | Required; must complete or receive explicit user-approved deferral |
| **[P2]** | Optional; may defer with a documented reason |

This checklist verifies the reconstruction packet and source traceability. It does not substitute for a live extraction, backend test run, validator run, report, preview, or proof artifact.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The source `.opencode/skills/sk-design/design-md-generator/SKILL.md` was read as the primary contract.
- [ ] CHK-002 [P0] The Level-2 templates and validated Level-2 sibling packet were used for structure and depth.
- [ ] CHK-003 [P0] Every non-vendored file under the source references/, assets/, procedure, and backend/ scope is included in the reading inventory.
- [ ] CHK-004 [P0] The reconstruction banner appears at the top of the spec body and explicitly limits authority to the intact source.
- [ ] CHK-005 [P1] The packet distinguishes measured, brief-provided, inferred, and absent data origins.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The four files preserve the sibling’s exact `##` and `###` header names and order.
- [ ] CHK-011 [P0] Required template markers, Level-2 markers, and balanced named anchors are preserved.
- [ ] CHK-012 [P1] No extraction, write-prompt, validator, report, preview, proof, or test execution result is claimed.
- [ ] CHK-013 [P1] The packet records the deterministic value-section boundary, lowercase six-digit hex rule, stability layers, and L4 exclusion.
- [ ] CHK-014 [P1] The packet records the backend output allowlist, overwrite guard, prompt fencing, and render-safety boundary.
- [ ] CHK-015 [P1] Source-faithful prose avoids fabricated benchmarks, runtime outcomes, and unsupported design-system claims.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The packet documents the validator’s structural, value, Quick Start, provenance, and claims-score gates.
- [ ] CHK-021 [P1] The packet documents unit and integration test surfaces from the backend without claiming that they ran.
- [ ] CHK-022 [P1] Every required template anchor is balanced and Markdown tables remain well formed.
- [ ] CHK-023 [P1] Source traceability covers the intact skill, twenty-three references, one procedure, three assets, backend scripts, and tests without claiming execution.
- [ ] CHK-024 [P1] The checklist explicitly distinguishes future runtime verification from this documentation-only reconstruction.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The extraction -> tokens -> deterministic write -> prose -> validation sequence is represented across spec, plan, and tasks.
- [ ] CHK-FIX-002 [P0] The five viewport widths, source readiness, interaction defaults, dark-mode condition, and output artifacts are recorded.
- [ ] CHK-FIX-003 [P1] Component states, accessibility signals, motion, icons, frameworks, responsive layout, and design boundaries are covered.
- [ ] CHK-FIX-004 [P1] Optional report, preview, proof, and guided-run behavior is documented as downstream of the core gates.
- [ ] CHK-FIX-005 [P1] Error scenarios cover unreachable sources, missing CSS, blocked pages, ambiguous themes, malformed values, and unsafe paths.
- [ ] CHK-FIX-006 [P1] N/A — no application runtime state or database migration is changed by this packet.
- [ ] CHK-FIX-007 [P1] Evidence is tied to dated source paths and packet files, not to an unpinned implementation diff or unrun extraction.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Scraped values and prose are treated as inert prompt data and cannot silently change the requested authoring contract.
- [ ] CHK-031 [P0] N/A — this packet does not process a live target or implement input validation; the backend boundary is documented instead.
- [ ] CHK-032 [P1] N/A — no authentication or authorization surface is implemented.
- [ ] CHK-033 [P1] Output path allowlisting, overwrite controls, and CSS render-safety constraints are recorded.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] The metadata table contains `| **Spec Folder** | 005-design-md-generator |` exactly.
- [ ] CHK-041 [P0] Frontmatter in all four files contains title, description, four trigger phrases, importance tier, contextType, and the required continuity fields.
- [ ] CHK-042 [P1] The continuity block is compact, uses the required date, author, fingerprint, session fields, and non-narrative actions.
- [ ] CHK-043 [P1] Sources cite real skill, references, assets, procedure, backend, and sibling paths.
- [ ] CHK-044 [P2] No README, skill-source, feature-catalog, manual-playbook, or runtime update is required by this packet.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Only `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are written under `005-design-md-generator`.
- [ ] CHK-051 [P0] `description.json` and `graph-metadata.json` are not created by this reconstruction request.
- [ ] CHK-052 [P1] No vendored `node_modules` path is treated as source material.
- [ ] CHK-053 [P1] Line counts are reported for the four packet files after writing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Status | Evidence |
|----------|--------|----------|
| Source fidelity | Pending checklist verification | Intact md-generator skill and non-vendored source tree |
| Template structure | Pending checklist verification | `004-design-audit` sibling headings, markers, and anchors |
| Runtime extraction | Not run | Explicitly outside this reconstruction handoff |
| Validator and tests | Not run | Explicitly outside this reconstruction handoff |
| Scope | Pending final file and line-count check | Four requested files only |
<!-- /ANCHOR:summary -->
