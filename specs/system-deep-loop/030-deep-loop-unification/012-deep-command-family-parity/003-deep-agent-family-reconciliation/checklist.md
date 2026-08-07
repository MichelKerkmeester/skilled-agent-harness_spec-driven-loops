---
title: "Verification Checklist: reconcile the deep-* agents to create-agent (bless-the-dialect)"
description: "Level 2 checklist with concrete agent-conformance, packaging, and no-diff evidence."
trigger_phrases:
  - "deep agent create-agent reconciliation"
  - "bless the deep-loop agent dialect"
  - "create-agent sanctioned section vocabulary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/012-deep-command-family-parity/003-deep-agent-family-reconciliation"
    last_updated_at: "2026-07-13T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Roll up the 064 parent"
---
# Verification Checklist: reconcile the deep-* agents to create-agent (bless-the-dialect)

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md]
  - **Evidence**: `spec.md` REQ-001 through REQ-007 define the bless-the-dialect sanction requirements.
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
  - **Evidence**: `plan.md` architecture describes the descriptive-sanction pattern mirrored from `create-command`.
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependencies]
  - **Evidence**: `plan.md` lists the `create-command` variant mechanism and the `validate_document.py` agent rules as green internal dependencies.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] SKILL.md §3 names the dialect as sanctioned [EVIDENCE: SKILL.md]
  - **Evidence**: `create-agent/SKILL.md` §3 carries the "Sanctioned Section-Vocabulary Dialects" subsection.
- [x] CHK-011 [P0] Template §9 gives the full + lean section orders [EVIDENCE: agent_template.md]
  - **Evidence**: `agent_template.md` §9 lists both the full (`deep-alignment`/`deep-review`) and lean (`deep-research`) orders plus real-file pointers.
- [x] CHK-012 [P1] Template §2 sanctions the MCP-tool-scoped permission keys [EVIDENCE: permission note]
  - **Evidence**: `agent_template.md` §2 documents `code_graph_query` / `code_graph_context` / `detect_changes` as sanctioned extensions.
- [x] CHK-013 [P1] Sanction states only CORE WORKFLOW is validator-required [EVIDENCE: required section]
  - **Evidence**: the §3 note states `## 1. CORE WORKFLOW` is the only `--type agent` requirement.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: REQ-001 through REQ-007]
  - **Evidence**: every REQ has a passing gate recorded in `implementation-summary.md`.
- [x] CHK-021 [P0] All six deep-* agents pass conformance [EVIDENCE: validate_document.py]
  - **Evidence**: `validate_document.py --type agent` reported `6 pass / 0 fail`.
- [x] CHK-022 [P0] The six agent files are unchanged by this phase [EVIDENCE: no-diff]
  - **Evidence**: `git status` shows no `.opencode/agents` or `.claude/agents` file modified in this phase.
- [x] CHK-023 [P1] create-agent packaging check introduces no new warning [EVIDENCE: package_skill.py]
  - **Evidence**: `package_skill.py --check` returned `PASS`; the 4 warnings are pre-existing and unrelated to these edits.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] The sanction mirrors create-command's variant mechanism [EVIDENCE: mirror]
  - **Evidence**: a named shape plus the `agent_template.md` §9 enumeration and real-file pointers mirror `command_router_template.md` §3.
- [x] CHK-025 [P1] Least-authority guidance preserved in the permission note [EVIDENCE: least-authority]
  - **Evidence**: the `agent_template.md` §2 note says "grant only the scoped keys the role uses" and gives the `.claude` `tools:` mirror.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in changed files [EVIDENCE: doc diff]
  - **Evidence**: the changed files are the `SKILL.md` and `agent_template.md` authoring docs; no credential-shaped values.
- [x] CHK-031 [P1] No agent authority widened [EVIDENCE: agents untouched]
  - **Evidence**: no agent `permission:` / `tools:` block was changed; the `agent_template.md` note is descriptive only.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec-plan-task sync]
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` all describe the same bless-the-dialect scope.
- [x] CHK-041 [P1] Sanction discourages inventing a fresh one-off dialect [EVIDENCE: guardrail]
  - **Evidence**: the `SKILL.md` §3 note says to reach for the dialect only for another deep-loop family member.
- [x] CHK-042 [P2] Comment hygiene preserved
  - **Evidence**: no ephemeral artifact ids in code; the `*.md` changes are authoring-doc prose only.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files committed [EVIDENCE: scratchpad only]
  - **Evidence**: the discovery report and any working notes stayed in the session `scratchpad` directory, not the `003-deep-agent-family-reconciliation` packet.
- [x] CHK-051 [P1] Edits live in the canonical create-agent locations [EVIDENCE: skill path]
  - **Evidence**: both edits are under `.opencode/skills/sk-doc/create-agent/`.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-13
**Verified By**: Claude (agent-conformance + packaging gates)

<!-- /ANCHOR:summary -->
