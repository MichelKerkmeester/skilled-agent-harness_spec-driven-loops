---
title: "059: cli-devin deep-loop alignment across 6 surfaces"
description: "Translate the 056 + 058 SWE 1.6 retrospective (~40 iter dispatched) into actionable updates: extend deep-research + deep-review executor enum to cli-devin; add SWE-1.6 iter contract to 2 agents + cli-devin SKILL; author 2 new cli-devin references + 3 new assets including 2 --agent-config JSONs."
trigger_phrases:
  - "059 spec"
  - "cli-devin deep-loop alignment"
  - "deep-research executor cli-devin"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_055-cli-devin-deep-loop-alignment"
    last_updated_at: "2026-05-15T19:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 059 packet from retrospective"
    next_safe_action: "Phase 2 commands update"
    blockers: []
    key_files:
      - ".opencode/commands/spec_kit/deep-research.md"
      - ".opencode/commands/spec_kit/deep-review.md"
      - ".opencode/agents/deep-research.md"
      - ".opencode/agents/deep-review.md"
      - ".opencode/skills/cli-devin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:de6785c1bd882f2acaa978fa92b18e8775b22af9a6c4e589523a602c31fa6891"
      session_id: "059-spec-scaffolded"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Does devin CLI support an agents directory? No, but --agent-config FILE flag accepts JSON/YAML; --rules takes Windsurf/Cursor formats; --skills auto-discovers .opencode/skills/. The --agent-config path is the closest equivalent and is the basis for the 2 new agent-config recipe JSONs."
      - "Does /spec_kit:deep-research currently support cli-devin? No, executor enum lists native | cli-codex | cli-gemini | cli-claude-code. cli-devin must be added in Phase 2."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 059: cli-devin deep-loop alignment across 6 surfaces

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration` |
| **Depends on** | 058 (shipped), 056 (shipped) |
| **Handoff Criteria** | cli-devin in deep-research + deep-review executor enums; 2 agents + cli-devin SKILL gain SWE-1.6 iter contract section; 2 new cli-devin references + 3 new cli-devin assets; all touched files validate clean; packet strict-validate PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

Packets 056 + 058 dispatched ~40 cli-devin SWE 1.6 iter via custom orchestration because:

1. `/spec_kit:deep-research` and `/spec_kit:deep-review` commands list executor enum as `native | cli-codex | cli-gemini | cli-claude-code` — cli-devin is absent.
2. The `@deep-research` + `@deep-review` LEAF agents (used through those commands) have no SWE-1.6-specific iter contract; iter prompts had to be hand-rolled.
3. cli-devin SKILL.md documents general dispatch patterns but lacks a deep-loop iter contract section explaining how SWE 1.6 behaves under N-iter loops.
4. Lessons learned (stdout-vs-file-write, fence nesting, numeric-count weakness, line-citation drift, no cross-iter awareness, sk-prompt contract drift) are scattered across 056/057/058 edit-evidence files instead of consolidated reference docs.
5. Devin CLI does not support a `.devin/agents/` directory like Claude / Codex / Gemini / Opencode, but it does support `--agent-config FILE` (JSON/YAML) — no agent-config recipes exist for SWE-1.6-locked deep-loop dispatches.

### Purpose

Make cli-devin a first-class deep-loop executor across the codebase. Future packets running deep-research or deep-review iter sweeps with cli-devin should dispatch through the standard command path, not custom orchestration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 2 command updates: `/spec_kit:deep-research` + `/spec_kit:deep-review` executor enum and YAML dispatch switch
- 2 agent updates: `@deep-research` + `@deep-review` iter contract section
- 1 SKILL.md update: `cli-devin` deep-loop iter contract section
- 2 new references in `cli-devin/references/`: deep-loop-iter-contract.md + agent-config-recipes.md
- 3 new assets in `cli-devin/assets/`: deep-loop-iter-template.md + agent-config-deep-research-iter.json + agent-config-deep-review-iter.json
- sonnet @markdown writes everything; cli-codex (gpt-5.5 xhigh fast) reviews the scaffold pre-execution

### Out of Scope

- No deep-research / deep-review iter loop on the codebase (retrospective IS the research)
- No restructure of @deep-research / @deep-review agent LEAF contract
- No changes to the cli-* shared smart-router helper (058 closed that)
- No new cli-* sibling skill creation

### Files to Change/Create

| Action | File |
|---|---|
| Edit | `.opencode/commands/spec_kit/deep-research.md` (executor enum + YAML dispatch) |
| Edit | `.opencode/commands/spec_kit/deep-review.md` (executor enum + YAML dispatch) |
| Edit | `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` (cli-devin dispatch shape) |
| Edit | `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` (cli-devin dispatch shape, if such file exists) |
| Edit | `.opencode/agents/deep-research.md` (SWE-1.6 iter contract subsection) |
| Edit | `.opencode/agents/deep-review.md` (SWE-1.6 iter contract subsection) |
| Edit | `.opencode/skills/cli-devin/SKILL.md` (deep-loop iter contract section) |
| Create | `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md` |
| Create | `.opencode/skills/cli-devin/references/agent-config-recipes.md` |
| Create | `.opencode/skills/cli-devin/assets/deep-loop-iter-template.md` |
| Create | `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` |
| Create | `.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | cli-devin in executor enum | `grep -E "executor.*cli-devin" .opencode/commands/spec_kit/deep-research.md` returns >= 1 hit |
| REQ-002 | cli-devin in deep-review executor enum | Same on deep-review.md |
| REQ-003 | YAML dispatch supports cli-devin | The YAML executor switch handles `cli-devin` and dispatches `devin -p --prompt-file ... --model swe-1.6 --permission-mode auto </dev/null` |
| REQ-004 | 2 agents have iter contract section | Both `@deep-research` and `@deep-review` agent .md files contain an SWE-1.6 iter contract subsection citing the 7 lessons |
| REQ-005 | cli-devin SKILL.md has deep-loop section | New section before §3 HOW IT WORKS describing the deep-loop iter contract |
| REQ-006 | 2 new references pass sk-doc validate | `validate_document.py --type reference` exit 0 |
| REQ-007 | 3 new assets exist + valid | iter-template is markdown (validate); 2 JSON files are valid JSON parseable by `python3 -c "import json; json.load(open(...))"` |
| REQ-008 | Packet strict-validate | exit 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | agent-config JSONs lock SWE 1.6 | Each JSON sets `model: swe-1.6` and a tool-visibility allowlist (Read/Grep/Glob/Bash for research; Read/Grep for review) |
| REQ-010 | Sonnet double-check final pass | 0 P0 from @markdown + @review parallel review |
| REQ-011 | gpt-5.5 xhigh fast scaffold review | One cli-codex pre-execution review; findings incorporated before Phase 2 starts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Next deep-research/review packet using cli-devin dispatches through `/spec_kit:deep-research --executor cli-devin` (or deep-review) without custom orchestration.
- **SC-002**: SWE 1.6 iter prompts can call `--agent-config <recipe>` to lock model + tool surface declaratively.
- **SC-003**: 7 retrospective lessons (fence drop, count smoke-run, structured RQ for numerics, residual-finder checklist, no cross-iter awareness, sk-prompt template upfront, sequential vs parallel) are persisted as reference docs.
- **SC-004**: Single primary commit on main closes 059.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Command YAML schema changes break existing executors | High | Surgical edit: add `cli-devin` alongside existing executors, no removal |
| Risk | Agent iter contract section conflicts with existing LEAF rules | Medium | New subsection inside SMART ROUTING anchor; LEAF rules untouched |
| Risk | agent-config JSON shape unverified against devin runtime | Medium | One smoke-test dispatch per JSON with --print mode + sample iter prompt; rollback flag if rejected |
| Risk | Parallel-session interference (Phase B precedent) | Low | Per-phase immediate commit |
| Dependency | 058 packet shipped | Met | ff27a5050 + 402f0ee55 |
| Dependency | 056 retrospective findings | Met | This packet's `research/retrospective.md` will summarize them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each phase wall-clock < 15 min
- **NFR-P02**: Total packet wall-clock < 60 min

### Quality
- **NFR-Q01**: HVR score >= 85 on new prose
- **NFR-Q02**: No em dashes, semicolons, oxford commas in prose of new files
- **NFR-Q03**: Anchor balance verified per file
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **EC-001**: gpt-5.5 review surfaces design flaw → halt Phase 2; refine spec; re-run review
- **EC-002**: agent-config JSON smoke-test fails → fix shape, re-test
- **EC-003**: Command YAML edit breaks existing cli-codex dispatch path → revert, redo with tighter scope
- **EC-004**: cli-devin SKILL gains > 50 lines and breaches the 500-LOC cap → split deep-loop contract into reference-only doc
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should agent-config JSONs be packaged inside cli-devin/assets/ (per current plan) or elevated to a top-level recipes folder? Currently planning cli-devin/assets/ to keep the recipes adjacent to the SKILL.md that documents them.
- Should the iter-template asset be one file with template variables OR multiple (one per loop type: research-survey, review-critique, synthesis)? Currently planning one file with named sections for each loop type.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Resource Map**: See `resource-map.md`
- **Predecessors**: `../058-skill-md-realignment/`, `../054-root-readme-deep-research/`
- **Retrospective source**: this conversation's 056 + 058 retrospective (to be captured in `research/retrospective.md` Phase 1)
<!-- /ANCHOR:related-docs -->
