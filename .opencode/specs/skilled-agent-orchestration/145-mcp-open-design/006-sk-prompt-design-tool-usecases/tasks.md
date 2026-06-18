---
title: "Tasks: sk-prompt design-tool usecases"
description: "Task breakdown for assessing sk-prompt against the design-generation usecases and adding the confirmed design-generation prompt reference plus router wiring. All tasks complete."
trigger_phrases:
  - "sk-prompt design tool tasks"
  - "design generation prompt tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/006-sk-prompt-design-tool-usecases"
    last_updated_at: "2026-06-14T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete across the three phases"
    next_safe_action: "Orchestrator registers the 006 child in the 150 parent"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/references/design_generation_patterns.md"
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-006-sk-prompt-design-tool-usecases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-prompt design-tool usecases

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

- [x] Read `sk-prompt` SKILL.md, depth_framework.md, patterns_evaluation.md, README
- [x] [P] Read `mcp-magicpath` and `mcp-open-design` SKILL.md
- [x] [P] Read `sk-interface-design/references/claude_design_parity.md`
- [x] Ground the multi-turn discovery flow in the `mcp-open-design` references (`od ui respond`, `start_run`)
- [x] Baseline `package_skill.py --check` (PASS, 1 pre-existing naming warning)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Reach the assessment verdict per need (a) to (d) with reasons
- [x] Author `references/design_generation_patterns.md` (5-field frontmatter, house voice)
- [x] Wire the `DESIGN_GEN` intent into `INTENT_MODEL` and `RESOURCE_MAP`
- [x] Update resource domains, loading-levels table, §1 use case, §5 and §9 references
- [x] Update README §9, bump SKILL.md to 2.2.0.0, add `changelog/v2.2.0.0.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `package_skill.py --check` PASS (1 pre-existing warning, no new errors)
- [x] README structure check 0 issues
- [x] Confirm the seed-of-thought honors the no-preset guardrail (`claude_design_parity.md` §8)
- [x] `validate.sh --strict` on this packet 0 errors
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Assessment verdict recorded with reasons (yes for the brief, variation, and discovery-form needs, plus a pointer for handoff)
- [x] One new reference plus router wiring, no new pipeline or scoring change
- [x] `sk-interface-design` untouched (read-only)
- [x] Both validators pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable: `.opencode/skills/sk-prompt/references/design_generation_patterns.md`
- Router: `.opencode/skills/sk-prompt/SKILL.md` (`DESIGN_GEN` intent)
- Parent: `../spec.md` (phase map, registered by the orchestrator)
<!-- /ANCHOR:cross-refs -->
