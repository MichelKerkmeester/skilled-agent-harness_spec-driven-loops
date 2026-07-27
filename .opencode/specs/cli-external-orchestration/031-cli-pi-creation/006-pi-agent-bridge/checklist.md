---
title: "Verification Checklist: Pi agent bridge (pi-subagents third-party translation)"
description: "Evidence gate for the 13-agent inventory, 17-field schema mapping, 5-behavior disposition table, and 4-tier translation order in plan.md."
trigger_phrases:
  - "pi agent bridge checklist"
  - "pi-subagents translation verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/006-pi-agent-bridge"
    last_updated_at: "2026-07-27T08:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md gating this phase's own doc completeness, all Pending"
    next_safe_action: "Phase 006 authoring complete; awaiting the parent packet's metadata backfill pass"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi agent bridge (pi-subagents third-party translation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: spec.md §4 defines REQ-001 through REQ-006.]
- [ ] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: plan.md §3 Architecture contains the inventory, mapping, disposition, and tier tables.]
- [ ] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: plan.md §6 names `001`/`004`/`007` as internal dependencies and the `pi-subagents` page as external, all Planned or already-fetched.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `.claude/agents/*.md` (13 files) are read-only for this phase — zero modifications. [EVIDENCE: `git status` / `git diff --stat` on `.claude/agents/` shows no changes.]
- [ ] CHK-011 [P0] No file is created or modified under `.pi/` by this phase. [EVIDENCE: `git status` shows no `.pi/` paths touched.]
- [ ] CHK-012 [P1] No `pi install` or other system-mutating command was run by this phase. [EVIDENCE: phase folder contains only markdown; no new global packages.]
- [ ] CHK-013 [P1] Every mapping-table cell is marked confirmed, inferred, or unknown — none asserted bare. [EVIDENCE: plan.md §3 Frontmatter Field Mapping table, 17/17 rows carry a status.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 13 real `.claude/agents/*.md` agents appear in the per-agent inventory table with a verbatim `tools:` line and an assigned tier (1-4). [EVIDENCE: plan.md §3 inventory table row count = 13; 2+5+4+2 tier split confirmed.]
- [ ] CHK-021 [P0] Every one of the 5 identified Claude-only runtime behaviors has an explicit disposition (preserve-as-prose / open-question / routed-to-a-named-phase). [EVIDENCE: plan.md §3 disposition table, 5/5 rows populated.]
- [ ] CHK-022 [P1] No `model:` or `thinking:` value is hardcoded anywhere in plan.md or tasks.md. [EVIDENCE: `grep -n 'model:\|thinking:' plan.md tasks.md` returns only the schema-mapping-table rows describing the field as deferred, never a concrete value assignment.]
- [ ] CHK-023 [P1] The 13-vs-14-vs-12 agent-count question and the MCP-dependent-count delta (spec.md's "10 of 13" vs. this phase's grepped "11 of 13") are both explicitly reconciled with cited evidence, not silently dropped. [EVIDENCE: spec.md §2 for the first; plan.md §3 inventory-table footnote for the second.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Repurposed for this planning phase: verifies plan.md's deliverables satisfy every spec.md requirement, not a bug fix.

| REQ | plan.md location |
|---|---|
| REQ-001 (mapping table, all 13 agents, every cell cited) | §3 Frontmatter Field Mapping + Per-Agent Inventory tables |
| REQ-002 (count discrepancy documented — owned by spec.md, cross-referenced here) | spec.md §2 (already authored); plan.md §3 inventory-table footnote adds the MCP-count delta |
| REQ-003 (every Claude-only behavior dispositioned) | §3 Claude-Only Behavior Disposition table |
| REQ-004 (4-tier translation order with rationale) | §3 Per-Agent Inventory & Tier Assignment + Tier rationale paragraph |
| REQ-005 (precise, mechanically-checkable 006→007 handoff bar) | spec.md §1 Metadata (echoed in this phase's own docs); tasks.md T009 |
| REQ-006 (no hardcoded `model:`/`thinking:` value) | §3 Frontmatter Field Mapping table rows for `model`/`thinking`/`fallbackModels` |

- [ ] CHK-FIX-001 [P0] Every REQ-001 through REQ-006 in spec.md has a corresponding, locatable section in plan.md per the table above.
- [ ] CHK-FIX-002 [P0] The 006→007 handoff criterion ("parses/loads without schema errors") is defined precisely enough for a later execution phase to check it mechanically, not just "looks right." [EVIDENCE: tasks.md T009 names the exact `pi-subagents` discovery/list surface as the check.]
- [ ] CHK-FIX-003 [P1] The 4-tier translation order's rationale cites the real `tools:` frontmatter driving each tier's grouping (MCP-server count, cross-agent-dispatch presence), not an arbitrary ordering. [EVIDENCE: plan.md §3 Tier rationale paragraph.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, tokens, or credentials introduced. [EVIDENCE: content review of plan.md/tasks.md/checklist.md — all content is markdown planning prose and public `pi.dev` URLs only.]
- [ ] CHK-031 [P1] No MCP server capability is silently claimed as translated while phase 007's stdio-transport support remains UNCONFIRMED. [EVIDENCE: plan.md §3 disposition table explicitly marks all 11 MCP-dependent agents "capability blocked pending phase 007," none silently shipping an unverified `tools:` MCP entry.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized (Predecessor/Successor/Handoff Criteria match across all four). [EVIDENCE: spec.md §1 metadata table vs. plan.md/tasks.md continuity `packet_pointer` and phase references.]
- [ ] CHK-041 [P1] Every ANCHOR / SPECKIT_TEMPLATE_SOURCE / SPECKIT_LEVEL marker from the original scaffolded templates is preserved verbatim in plan.md, tasks.md, and checklist.md. [EVIDENCE: anchor-marker lines unchanged from the pre-authoring scaffold.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No file outside this phase folder (`006-pi-agent-bridge/`) was created or modified by this authoring pass. [EVIDENCE: `git status` scoped to `031-cli-pi-creation/006-pi-agent-bridge/` only.]
- [ ] CHK-051 [P1] `description.json` and `graph-metadata.json` were not touched by this authoring pass (owned by the separate metadata backfill). [EVIDENCE: `git status` shows no changes to those two files.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 11 | 0/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending (Planned)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

