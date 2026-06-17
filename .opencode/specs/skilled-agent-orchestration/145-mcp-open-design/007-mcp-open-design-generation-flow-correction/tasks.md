---
title: "Tasks: mcp-open-design generation-flow correction"
description: "Task breakdown for correcting the mcp-open-design skill to the live-verified multi-turn generation reality, adding od run verbs and the HTTP API surface, and validating."
trigger_phrases:
  - "mcp-open-design correction tasks"
  - "open design generation flow tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/007-mcp-open-design-generation-flow-correction"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All correction tasks complete and validated"
    next_safe_action: "Operator reviews the corrected skill and v1.1.0.0 changelog"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:288a85fff29e3e11ab326fe3077970145a5dc4f05ec38f632439992d7c34750d"
      session_id: "session-150-007-mcp-open-design-generation-flow-correction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-open-design generation-flow correction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending
- `[P]` parallelizable
- Evidence in parentheses where applicable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Read the whole skill: SKILL.md, the three references, feature catalog, manual testing playbook, README, changelog
- [x] Grep and locate every one-shot generation claim and every `od artifacts create` mention
- [x] Confirm the Level 2 template anchors and the continuity fingerprint algorithm
- [x] Capture the baseline `package_skill.py --check` result (PASS, no warnings)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] SKILL.md: multi-turn Run Direction, artifacts callout, four-surface and HTTP note, ALWAYS rule 8, NEVER rule 5, version 1.1.0
- [x] [P] references/tool_surface.md: corrected start_run, multi-turn generation flow, artifacts separation
- [x] [P] references/od_cli_reference.md: od run verbs, multi-turn section, HTTP API surface, resolved command[0] uncertainty
- [x] [P] references/mcp_wiring.md: install-info canonical, command[0] is the Helper binary, shape confirmed
- [x] feature_catalog (root and 04--runs) and manual_testing_playbook (root and 03--gated-runs) to the multi-turn flow
- [x] README run narrative, troubleshooting rows, FAQ; add changelog/v1.1.0.0.md; update graph-metadata.json
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `package_skill.py --check` PASS and SKILL.md under the 3000-word cap
- [x] Grep sweep: no remaining one-shot finished-design claim; every start_run mention is qualified
- [x] Voice sweep: no em dashes, no prose semicolons in new prose
- [x] `validate.sh --strict` on this packet reports zero errors
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Generation is documented as multi-turn in every doc, with `od ui respond` as the build trigger
- [x] `od artifacts create` is separated from creating a visible design everywhere it appears
- [x] `od run` verbs and the HTTP API surface are documented
- [x] Confirmed facts (wiring shape, gating, daemon-running, node invocation, roughly 18 tools) preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Corrected skill: `.opencode/skills/mcp-open-design/`
- Changelog: `.opencode/skills/mcp-open-design/changelog/v1.1.0.0.md`
- Parent: `../spec.md` (150 phase map)
<!-- /ANCHOR:cross-refs -->
