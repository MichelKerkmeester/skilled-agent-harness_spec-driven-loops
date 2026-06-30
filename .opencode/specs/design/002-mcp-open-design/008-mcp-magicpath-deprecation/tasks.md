---
title: "Tasks: mcp-magicpath deprecation"
description: "Task breakdown for deprecating the mcp-magicpath skill, re-centering the shared design protocol on mcp-open-design, sweeping live references, dropping graph sibling edges, marking the 147 packet superseded, and validating."
trigger_phrases:
  - "mcp-magicpath deprecation tasks"
  - "deprecate magicpath tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/008-mcp-magicpath-deprecation"
    last_updated_at: "2026-06-14T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All deprecation tasks complete and validated"
    next_safe_action: "Operator reviews the deprecation and the four skill version bumps"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-008-mcp-magicpath-deprecation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-magicpath deprecation

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

- [x] Confirm mcp-open-design is the live-verified, corrected design transport to re-center onto
- [x] Grep every magicpath reference across `.opencode/skills/` and the skills index README
- [x] Classify each reference live or historical so historical records are preserved
- [x] Capture the baseline `package_skill.py --check` result for the three skills to bump
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Rewrite `sk-design-interface/references/claude_design_parity.md`: two-member parity (sk-design-interface and mcp-open-design), fidelity check on the real `previewUrl` and `get_artifact`
- [x] Rewrite `sk-prompt/references/design_generation_patterns.md` to the `mcp-open-design` start_run usecase, dropping the MagicPath canvas-authoring usecase
- [x] Delete the `mcp-magicpath` skill folder, all 16 files
- [x] [P] Sweep sk-design-interface (SKILL.md, README, feature_catalog, manual_testing_playbook, design_inventory.md, graph-metadata sibling edge) and bump to v1.3.0 with `changelog/v1.3.0.0.md`
- [x] [P] Sweep sk-prompt (SKILL.md, README) and bump to v2.3.0 with `changelog/v2.3.0.0.md`
- [x] [P] Sweep mcp-open-design (SKILL/README mentions, graph-metadata sibling edge dropped) and bump to v1.2.0 with `changelog/v1.2.0.0.md`
- [x] [P] Sweep mcp-figma: SKILL/README/graph-metadata, drop the dead magicpath sibling edge and repoint the sibling language to mcp-open-design
- [x] Drop the mcp-magicpath entry from the skills index `.opencode/skills/README.md`
- [x] Mark `147-mcp-magicpath/spec.md` superseded by spec 150
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `package_skill.py --check` PASS on sk-design-interface, sk-prompt, and mcp-open-design
- [x] Grep sweep: no live magicpath reference remains, only historical changelog and spec-142 mentions
- [x] Voice sweep: no em dashes, no prose semicolons in new prose
- [x] `validate.sh --strict` on this packet reports zero errors
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The mcp-magicpath skill folder is deleted and no live reference remains
- [x] The parity protocol and the prompt design usecase are re-centered on mcp-open-design
- [x] The reciprocal graph sibling edges are dropped and mcp-figma repoints to mcp-open-design
- [x] Three version bumps with matching changelogs and the 147 packet marked superseded
- [x] Historical records (spec 142, historical changelog entries) preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Superseding transport: `.opencode/skills/mcp-open-design/`
- Original install packet: `.opencode/specs/skilled-agent-orchestration/147-mcp-magicpath/`
- Sibling design skill: `.opencode/skills/sk-design-interface/`
- Parent: `../spec.md` (150 phase map)
<!-- /ANCHOR:cross-refs -->
