---
title: "Feature Specification: Retire the decommissioned code-index tool from the review agents and their documentation"
description: "The system-code-index MCP server was decommissioned, but two review agents still grant its tool, instruct themselves to call it, and carry a playbook scenario built on it. Remove what depends on a tool that no longer exists."
trigger_phrases:
  - "retire detect_changes references"
  - "code-index tool decommission cleanup"
  - "review agent structural impact removal"
  - "system_code_index retired"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/agents/011-retire-code-index-tool-references"
    last_updated_at: "2026-09-11T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Site inventory complete; packet authored."
    next_safe_action: "Edit the canonical agents first, then regenerate every mirror."
    blockers: []
    key_files:
      - "specs/agents/011-retire-code-index-tool-references/spec.md"
      - ".opencode/agents/review.md"
      - ".opencode/agents/deep-review.md"
      - ".opencode/skills/sk-code/sk-code-review/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agents-011-retire-code-index-tool-references"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retire the decommissioned code-index tool from the review agents and their documentation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Predecessor** | `sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters` (ADR-006 waived this work to here) |
| **Handoff Criteria** | No live file grants, instructs, or documents a tool the decommissioned code-index server used to provide, and every agent mirror stays in sync. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `system_code_index` MCP server was deregistered from every runtime surface. Nothing registers it, and no runtime config names it.

What survived is everything that depended on it. Two review agents still grant `detect_changes` in their permission block and instruct themselves to call it during a review. The review skill documents it as a step. A manual-testing scenario exists solely to validate it. The mirror-sync verifier carries an alias mapping its bare name to the MCP-prefixed form.

None of this breaks a run, because the agents already handle the tool being unavailable: their own prose says to surface "structural-impact analysis unavailable" and continue. That graceful degradation is exactly why it went unnoticed, and it is also why the references are pure cost. Every review agent reads an instruction it can never act on, and a playbook scenario claims to test a capability that cannot exist.

An earlier attempt removed the tool from the Claude mirrors alone. That failed the mirror-sync commit gate, because `.opencode` is the canonical source and still required the tool through its body prose. The lesson is the shape of this packet: the canonical source changes first, and the mirrors are regenerated rather than hand-edited.

### Purpose

Delete what depends on a tool that does not exist, from the canonical source outward, and prove the mirrors still agree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The permission grant and the review-methodology prose in both canonical review agents.
- The two steps naming it in the review skill.
- The manual-testing scenario built on it, and its playbook index entry.
- The tool alias in the mirror-sync verifier and its test.
- Regenerating the Claude, Codex and Pi agent mirrors from the canonical sources.

### Out of Scope

- The review agents' actual review methodology. Removing a preflight they could never run changes no verdict they could reach.
- Historical records: the spec-kit changelog entry describing the server, and the benchmark reports that ran against it. Both are accounts of what was true when written.
- Generated retrieval fixtures, which are regenerated rather than edited.
- The decommissioned server itself, which is already gone.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/review.md` | Update | Drop the permission grant, the review step and the tool-table row |
| `.opencode/agents/deep-review.md` | Update | Drop the permission grant, two review steps and the retrieval-source bullet |
| `.claude/agents/{review,deep-review}.md` | Regenerate | Mirror follows the canonical source |
| `.codex/agents/{review,deep-review}.toml` | Regenerate | Mirror follows the canonical source |
| `.pi/agents/{review,deep-review}.md` | Regenerate | Mirror follows, including its unmapped-key comment |
| `.opencode/skills/sk-code/sk-code-review/SKILL.md` | Update | Drop the two preflight steps and renumber |
| `sk-code-review/manual-testing-playbook/structural-impact-preflight/detect-changes-assisted-review.md` | Delete | Scenario exists only to validate the retired tool |
| `sk-code-review/manual-testing-playbook/manual-testing-playbook.md` | Update | Remove the scenario and its category |
| `system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs` | Update | Drop the alias for a tool no agent declares |
| `system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts` | Update | Drop the assertions on that alias |

### Verification evidence

- The mirror-sync verifier reports both agents in sync after the change.
- A live-tree search for the tool name returns only historical records and generated fixtures.
- The review playbook validator passes with the scenario removed.
- The deep-loop unit tests pass with the alias assertions removed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-001** No live file grants, instructs or documents the retired tool.
- **REQ-002** Both review agents report in sync across every runtime mirror.
- **REQ-003** The review playbook and the deep-loop tests pass with their references removed.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The canonical agents change first and the mirrors are regenerated, never hand-edited.
- A search for the tool name in the live tree returns only historical records.
- Every gate that guards these surfaces passes from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Editing a mirror without its canonical source | The mirror-sync commit gate fails and the tree cannot be committed | Change `.opencode` first, then regenerate. This already happened once and is why the packet exists |
| Removing the alias breaks mirror comparison for another agent | A commit gate fails for an unrelated agent | The alias names one tool. Run the verifier across the affected agents after the change |
| The review agents lose a real capability | Reviews get worse | The capability is already gone. The agents' own prose documents continuing without it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions

- **Is the server really gone?** Yes. No runtime config registers it, confirmed by inspecting every registration surface.
- **Does anything break today?** No. The agents degrade gracefully, which is why this sat unnoticed.

### Open Questions

None.
<!-- /ANCHOR:questions -->
