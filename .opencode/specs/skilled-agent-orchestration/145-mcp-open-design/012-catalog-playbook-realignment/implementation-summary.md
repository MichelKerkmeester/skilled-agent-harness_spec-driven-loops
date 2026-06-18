---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE. mcp-open-design's grounding feature now states the sk-interface-design coupling as MANDATORY (was 'optional and on-demand'), and a new GATE-001 manual-testing scenario verifies the hard gate (design work blocked without sk-interface-design; transport exempt)."
trigger_phrases:
  - "mcp-open-design catalog realignment done"
  - "mandatory grounding feature"
  - "gate-001 scenario"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/012-catalog-playbook-realignment"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Aligned grounding feature to MANDATORY + added GATE-001 scenario"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/feature_catalog/03--grounding/design-system-grounding.md"
      - ".opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-150-012-catalog-playbook-realignment"
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
| **Spec Folder** | 012-catalog-playbook-realignment |
| **Status** | DONE - grounding feature now MANDATORY; GATE-001 scenario added |
| **Created** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE.** Phase 011 made the `sk-interface-design` coupling a hard precondition, but the grounding feature catalog still called it "optional and on-demand" and no scenario tested the gate. Both are now fixed.

### Grounding feature rewritten to MANDATORY
`feature_catalog/03--grounding/design-system-grounding.md` was reworded from optional/on-demand to a hard precondition across its frontmatter description, §1 OVERVIEW, the §2 "Apply the judgment layer" line ("MUST load first ... blocked, not merely flagged"), and the §2 guardrails line, with the pure-transport exemption stated. The split-doc references (`design_parity_transport.md`, `real_ui_loop.md`) were left intact. The root `feature_catalog.md` §4 line that still read "applied whenever" was corrected to the hard-precondition wording.

### GATE-001 scenario added
A new `manual_testing_playbook/05--design-gate/mandatory-design-gate.md` (GATE-001) verifies all three controls: NEGATIVE (a design RUN and a design-feeding READ are refused without `sk-interface-design` loaded, not merely unconfirmed); POSITIVE (with it loaded and ground→token-system→critique applied, the work proceeds); EXEMPTION (pure transport — `od mcp install` wiring, a bare `list_projects` — succeeds without it). The playbook index was updated: scenario count 4→5, the coverage/critical-path/execution-wave tables, and the §10 cross-reference.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `feature_catalog/03--grounding/design-system-grounding.md` | Modified | Optional → MANDATORY framing |
| `feature_catalog/feature_catalog.md` | Modified | §4 "applied whenever" → hard precondition |
| `manual_testing_playbook/05--design-gate/mandatory-design-gate.md` | Created | GATE-001 hard-gate scenario |
| `manual_testing_playbook/manual_testing_playbook.md` | Modified | Index, counts (4→5), waves, cross-reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit found the grounding feature's wording directly contradicted the SKILL.md hard gate, and that the most important new invariant was untested. The fix reworded the feature to match the runtime rule and added a scenario whose negative control is the load-bearing part — it proves a design step without `sk-interface-design` is blocked, not just flagged. The authoring was delegated to a scoped writer constrained to `feature_catalog/` and `manual_testing_playbook/`, gated on the sk-doc validators and a zero-residue grep.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reword the feature, don't just append | The "optional and on-demand" line actively contradicted the gate; it had to be replaced, not supplemented |
| Negative control is the core of GATE-001 | The hard-block invariant is only proven by showing design work is refused without sk-interface-design |
| Keep the transport-exemption explicit in both | Wiring/inventory must stay usable without the design skill, matching SKILL.md |
| Doc-only, no version bump | The skill's behavior did not change in this phase; only the docs caught up |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Grounding feature states MANDATORY (no "optional and on-demand" / "applied whenever") | PASS (`rg` over both dirs → 0 hits) |
| GATE-001 scenario has negative + positive + exemption controls | PASS (scenario present, mirrors gated-verb-confirm.md structure) |
| Playbook index reconciled (4→5, waves, cross-ref) | PASS |
| No dead `claude_design_parity.md` references | PASS (refs are design_parity_transport.md / real_ui_loop.md) |
| sk-doc validators on both indexes + the touched files | PASS (0 issues) |
| `validate.sh <this phase> --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate is contract-level, and so is its test.** GATE-001 verifies the documented hard-block as an operator scenario; like every skill rule, enforcement depends on agent adherence to the SKILL.md contract, not a runtime interceptor.
2. **No skill version bump.** This phase only aligns docs to the v1.3.0.0/v1.4.0.0 behavior; the skill version is unchanged.
<!-- /ANCHOR:limitations -->
