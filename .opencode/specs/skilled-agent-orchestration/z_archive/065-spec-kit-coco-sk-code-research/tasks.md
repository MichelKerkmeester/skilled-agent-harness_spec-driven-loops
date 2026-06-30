---
title: "Tasks: 077 Deep Research"
description: "Task list for the 077 deep-research packet: init, loop, synthesis, validation, commit, memory save."
trigger_phrases: ["077 tasks"]
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research"
    last_updated_at: "2026-05-05T17:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "10-iter loop complete; research.md synthesized"
    next_safe_action: "Validate + commit + memory save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "077-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 077 Deep Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete |
| `[~]` | In progress |
| `[!]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold 077 spec folder via create.sh (Level 1, --skip-branch)
- [x] T002 Move 077 from `.opencode/specs/077-*` to `.opencode/specs/skilled-agent-orchestration/077-*`
- [x] T003 Create research/ packet directories (prompts/, iterations/, deltas/, research_archive/)
- [x] T004 Author deep-research-config.json (cli-codex executor block, 10 iters, 0.10 convergence)
- [x] T005 Author deep-research-state.jsonl (config + initialized event)
- [x] T006 Author deep-research-strategy.md (topic + 7 key questions + non-goals + stop conditions)
- [x] T007 Author findings-registry.json (7 open questions seeded)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Author dispatch-iter.sh (per-iteration prompt builder + codex exec via stdin)
- [x] T009 Author run-loop.sh (10-iter loop with convergence streak detection)
- [x] T010 Make scripts executable + verify codex CLI present (codex-cli 0.128.0)
- [x] T011 Dispatch iter 1 in background; verify 3-artifact contract (iteration-001.md + state-log + delta)
- [x] T012 Fix run-loop.sh `grep -c` arithmetic bug (multiline 0\n0 → use head -1 + parameter expansion)
- [x] T013 Resume loop from iter 2 (START_ITER=2); run all 10 iterations
- [x] T014 Verify all 10 iterations exit_code 0 + 10 narratives present
- [x] T015 Author research/research.md (executive summary + per-surface + cross-cutting + 4-phase remediation roadmap)
- [x] T016 Author research/resource-map.md (10-section inventory; 43 paths)
- [x] T017 Append loop_complete + synthesized events to state log
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Author 077 Level 1 spec docs (spec.md, plan.md, tasks.md, implementation-summary.md)
- [ ] T019 `bash validate.sh 077-spec-kit-coco-sk-code-research --strict` → exit 0
- [ ] T020 Refresh description.json + graph-metadata.json
- [ ] T021 `git add 077/` + commit "feat(077): deep-research on system-spec-kit + mcp-coco-index + sk-code OpenCode"
- [ ] T022 `git push origin main` → exit 0
- [ ] T023 /memory:save via generate-context.js with structured 077 context JSON
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 23 tasks complete
- [ ] validate.sh --strict on 077 exits 0
- [ ] Two commits on main: feat (research artifacts + spec docs) + chore (memory save side-effects if any)
- [ ] origin/main 0/0 ahead/behind
- [ ] research.md self-contained as planning input for 078+ remediation decision
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: `069-sk-code-motion-dev-and-playbook` (just shipped sk-code v3.1.0.0)
- Workflow command: `/speckit:deep-research:auto`
- Skill: `.opencode/skills/deep-research/SKILL.md`
- Synthesis output: `077/research/research.md`
- Resource inventory: `077/research/resource-map.md`
- 10 iteration narratives: `077/research/iterations/iteration-{001..010}.md`
- Proposed remediation parent: `078-opencode-authoring-recipe` (not yet scaffolded; user decision)
<!-- /ANCHOR:cross-refs -->
