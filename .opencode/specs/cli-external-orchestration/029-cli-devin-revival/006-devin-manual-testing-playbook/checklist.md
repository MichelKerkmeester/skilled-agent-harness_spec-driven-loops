---
title: "Verification Checklist: Devin manual-testing playbook"
description: "Verification checklist for authoring the Devin-native manual-testing playbook: structural completeness, category reframing correctness, security, and file-organization checks. All items unchecked - phase is Planned, not yet executed."
trigger_phrases: ["devin manual testing playbook checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/006-devin-manual-testing-playbook"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for phase 006 (Planned): 24 items across 8 categories, all unchecked."
    next_safe_action: "Wait for phases 003-005, then verify each item with real evidence"
    blockers: ["devin auth login requires an interactive OAuth browser flow only the operator can complete - blocks scenario EXECUTION, not this phase's authoring work"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Devin manual-testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`.
- [ ] CHK-003 [P1] Predecessor phases (003 skill packet, 004 hook adapter layer, 005 model registry) confirmed complete before authoring cross-references that depend on them.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All playbook markdown files pass sk-doc's `validate_document.py` structural checks (0 errors).
- [ ] CHK-011 [P0] No broken cross-reference links between the root file and any per-category scenario file.
- [ ] CHK-012 [P1] Every scenario file's frontmatter includes title/description/version, matching the confirmed cli-codex per-feature template.
- [ ] CHK-013 [P1] `DV-NNN` scenario IDs are globally unique and sequential with no gaps across all 8 categories.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 8 categories present (`cli-invocation`, `permission-modes`, `subagents`, `hooks`, `session-continuity`, `cloud-handoff`, `prompt-templates`, `mcp-integration`), each with `>=1` scenario.
- [ ] CHK-021 [P0] Total scenario file count falls within the 15-20 target range.
- [ ] CHK-022 [P1] The hallucination-fixture scenario exists and its Pass/Fail criteria explicitly name the FAIL condition (a referenced non-existent flag).
- [ ] CHK-023 [P1] Root file's 17 numbered sections are all present, in the confirmed order, including both banners.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] `permission-modes` category documents why it replaces Codex's `sandbox-modes` category rather than porting it verbatim.
- [ ] CHK-FIX-002 [P0] `subagents` category documents why it replaces Codex's `agent-routing`/`-p profile` category rather than porting it verbatim.
- [ ] CHK-FIX-003 [P0] No content from Codex's `config.toml` profile-routing or local-sandbox-flag categories is ported verbatim into any Devin category.
- [ ] CHK-FIX-004 [P1] `cloud-handoff` and `mcp-integration` categories exist as dedicated categories (not folded into an existing Codex-shaped category), since they have no direct Codex analog.
- [ ] CHK-FIX-005 [P2] The matrix-axis/adversarial-table requirements from the fix-completeness template are not applicable to this docs-authoring phase (no code path, no security/path/parser fix) - documented as N/A rather than silently skipped.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No scenario file embeds a real credential, token, or the operator's actual `COGNITION_API_KEY` value - placeholders only.
- [ ] CHK-031 [P0] Any scenario touching `bypass`/`autonomous` permission mode or `--sandbox` requires documented operator approval evidence, mirroring the `CX-007` danger-full-access precedent.
- [ ] CHK-032 [P1] No scenario scripts or automates `devin auth login` - it remains an operator-only interactive step in every command sequence.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` predecessor/successor pointers match the packet `spec.md`'s Phase Documentation Map.
- [ ] CHK-041 [P1] Playbook is cross-referenced from `cli-devin/SKILL.md`.
- [ ] CHK-042 [P2] Packet-level `spec.md` Phase Documentation Map status for phase 006 is updated once the playbook is actually authored - deferred to implementation time, since this authoring pass only produces the spec-kit docs.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Playbook files live under `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/`, not under `.opencode/specs/`.
- [ ] CHK-051 [P1] No stray temp files remain in `scratch/` after authoring.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 11 | 0/11 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not yet verified - phase is Planned.
<!-- /ANCHOR:summary -->
