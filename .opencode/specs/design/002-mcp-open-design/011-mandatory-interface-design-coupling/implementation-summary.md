---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE. mcp-open-design now treats sk-design-interface as an absolute hard precondition for all design work, across the SKILL.md banner, routing gate, rules, and success criteria, plus README, version 1.3.0.0, and a changelog. Pure transport stays exempt."
trigger_phrases:
  - "open design mandatory coupling status"
  - "sk-design-interface hard precondition done"
  - "mcp-open-design v1.3.0.0"
  - "impl summary core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/011-mandatory-interface-design-coupling"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped the mandatory sk-design-interface coupling (v1.3.0.0)"
    next_safe_action: "Phase complete; optionally rescan the advisor and commit"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/SKILL.md"
      - ".opencode/skills/mcp-open-design/README.md"
      - ".opencode/skills/mcp-open-design/changelog/v1.3.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-011-mandatory-interface-design-coupling"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 011-mandatory-interface-design-coupling |
| **Status** | DONE - hard precondition shipped across SKILL.md, README, version 1.3.0.0, changelog |
| **Created** | 2026-06-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE.** `mcp-open-design` already referenced `sk-design-interface`, but only conditionally ("apply it when a read or run feeds a design decision"), with no NEVER rule and nothing that blocked a generation run that skipped the design judgment. This phase made the coupling absolute: for any design work, `sk-design-interface` is a hard precondition. Open Design is the transport; the design judgment is non-negotiable. Pure transport (wiring, bare inventory) stays exempt.

### SKILL.md — hard block at every reading path
- **MANDATORY PAIRING banner** before Section 1: the mandate is the first thing a reader sees, with the transport-vs-taste framing and the pure-transport exemption.
- **Section 2 routing**: a phase-detection HARD GATE (STEP 2) before any RUN or design-feeding READ; the two design-work resource rows marked ⛔ MANDATORY; a `design_gate` precondition added to the router pseudocode that blocks a design step composed without `sk-design-interface`.
- **Section 3 Run Direction**: a MANDATORY-before-turn-1 step requiring `sk-design-interface` to shape the `start_run` brief and every `od ui respond` answer.
- **Section 4 RULES**: ALWAYS #5 rewritten as a hard precondition; new NEVER #6 forbidding producing or shaping UI from Open Design without `sk-design-interface`.
- **Section 6 success criteria**: a design step is incomplete without `sk-design-interface` evidence.
- **Sections 7/8**: reworded to "MANDATORY partner for all design work".
- **Frontmatter**: `version` 1.2.0.0 → 1.3.0.0; `description` states the mandatory pairing.

### README + changelog
- README: a MANDATORY callout under the lead, and the Design Grounding, Related Skills, and FAQ sections reworded from conditional to hard precondition.
- `changelog/v1.3.0.0.md` records the upgrade.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-open-design/SKILL.md` | Modified | Banner, routing gate, mandatory resource rows, router precondition, Run pre-step, ALWAYS+NEVER, success-criteria gate, integration wording, version bump |
| `mcp-open-design/README.md` | Modified | Mandate banner + grounding/related-skills/FAQ reworded to hard precondition |
| `mcp-open-design/changelog/v1.3.0.0.md` | Created | Changelog for the mandatory-coupling upgrade |
| `150/spec.md`, `150/graph-metadata.json` | Modified | Phase-11 map row + `children_ids` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The existing coupling was located in five places in SKILL.md (When-NOT-to-Use, resource rows, router comment, ALWAYS #5, integration), all conditional. The upgrade restates the rule as a hard precondition at every reading path so it cannot be missed whether the agent reads top-down or jumps to RULES: a banner first, a routing gate the router follows, a rule it must obey, and a success criterion it is held to. The one genuine ambiguity in the request — whether "ALWAYS" meant literally every call or every design step — was resolved with the user: all design work is the hard block, pure transport (wiring, bare inventory) is exempt, and that exemption is stated everywhere the block is. README and the changelog mirror the SKILL.md intent so the runtime surface and the human-facing doc agree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the coupling a hard precondition, not a recommendation | The conditional wording let an agent fire `start_run` and produce UI without ever invoking the design skill — the exact failure to foreclose |
| Scope the block to design work; exempt pure transport | Forcing the design skill before `od mcp install` or a bare `list_projects` would be absurd; the user confirmed the design-work reading |
| Restate the rule at banner + router + rules + success criteria | Defense in depth: no single reading path can miss it |
| Do NOT edit `sk-design-interface` | The asymmetry is correct — interface design does not require Open Design, but Open Design design-work requires interface design |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| MANDATORY banner present before Section 1 | PASS (grep `MANDATORY PAIRING` in SKILL.md) |
| Routing hard gate + router `design_gate` precondition present | PASS (grep `HARD GATE`, `design_gate` in SKILL.md) |
| ALWAYS hard precondition + NEVER #6 present | PASS (grep `NEVER produce or shape UI` in SKILL.md) |
| Pure-transport exemption stated | PASS (grep `exempt` in SKILL.md banner/gate/rules) |
| README mandate + version 1.3.0.0 + changelog | PASS (README callout; `version: 1.3.0.0`; `changelog/v1.3.0.0.md` exists) |
| `validate.sh <this phase> --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Enforcement is contract-level, not mechanical.** SKILL.md is instructions an agent follows; the `design_gate` is illustrative pseudocode, not an interpreter that physically blocks a tool call. The hard-block is as strong as the agent's adherence to the skill contract — which is the same enforcement model as every other rule in the skill.
2. **Feature catalog and manual testing playbook were not rewritten.** The SKILL.md and README are the authoritative runtime surfaces; deeper doc propagation can follow if the mandate needs to appear there too.
3. **The advisor index still holds the previous description text until a rescan.** The SKILL.md frontmatter description was updated; refreshing the skill-advisor graph is a separate maintenance step.
<!-- /ANCHOR:limitations -->
