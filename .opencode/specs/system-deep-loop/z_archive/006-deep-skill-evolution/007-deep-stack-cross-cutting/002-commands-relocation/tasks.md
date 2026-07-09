---
title: "Tasks: 131/007 — Deep-* Commands Relocation"
description: "Level 3 task list for 6-wave deep-* command asset relocation."
trigger_phrases:
  - "131/007 tasks"
  - "deep commands relocation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/007-deep-stack-cross-cutting/002-commands-relocation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Authored tasks with per-wave checklists."
    next_safe_action: "Proceed to WAVE 1: asset relocation."
---
# Tasks: 131/007 — Deep-* Commands Relocation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T012 | WAVE 0 exit |
| M2 | T020-T029 | WAVE 1 exit |
| M3 | T030-T039 | WAVE 2 exit |
| M4 | T040-T044 | WAVE 3 exit |
| M5 | T050-T054 | WAVE 4 exit |
| M6 | T060-T065 | WAVE 5 exit |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*WAVE 0 — Scaffold the 131/007 Level 3 packet and update parent metadata.*

### Spec Docs
- [x] T001 Author `spec.md` — executive-summary, metadata, problem, scope, requirements (REQ-001..REQ-006), success-criteria (SC-001..SC-005), risks (R-001..R-003), nfr (NFR-P01, NFR-R01, NFR-T01), edge-cases, complexity (65/100), risk-matrix, user-stories (US-001), questions (none)
- [x] T002 Author `plan.md` — summary, quality-gates, architecture, phases (6), testing, dependencies, rollback, phase-deps, effort, enhanced-rollback, dependency-graph, critical-path, milestones, adr
- [x] T003 Author `tasks.md` — this file
- [x] T004 Author `checklist.md` — CHK-001..CHK-N with P0/P1/P2, all categories
- [x] T005 Author `decision-record.md` — ADR-001 (asset strategy + naming convention) with context, decision, alternatives, consequences, five-checks
- [x] T006 Author `implementation-summary.md` — placeholder structure; content at WAVE 5

### Metadata
- [x] T007 [P] Author `description.json` — specFolder, keywords, parentChain
- [x] T008 [P] Author `graph-metadata.json` — packet_id, parent_id, children_ids[], derived fields

### Parent Updates
- [x] T009 Update `131/spec.md` phase-map anchor — add row for 007-deep-commands-relocation (Level 3, status Active)
- [x] T010 Update `131/graph-metadata.json` children_ids — append `007-deep-commands-relocation`

### Validation
- [x] T011 Run `validate.sh --strict` on 131/007 — must PASS with 0 errors + 0 warnings
- [x] T012 Write `/tmp/wave0-commit-handoff.md` — commit message + explicit git add paths
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*WAVE 1 + 2 — Asset relocation and live operator-facing reference updates.*

### YAML Asset Moves
- [ ] T020 Create `commands/deep/assets/` directory
- [ ] T021 `mv` 6 YAMLs: `commands/speckit/assets/speckit_deep-{review,research,council}_{auto,confirm}.yaml` → `commands/deep/assets/deep_{review,research,ai-council}_{auto,confirm}.yaml`
- [ ] T022 Rename: `spec_kit_deep-council_*` filenames → `deep_ai-council_*`

### Command MD Internal Updates
- [ ] T023 Update `commands/deep/start-review-loop.md` asset-path block → `deep/assets/deep_start-review-loop_*`
- [ ] T024 Update `commands/deep/start-research-loop.md` asset-path block → `deep/assets/deep_start-research-loop_*`
- [ ] T025 Update `commands/deep/ask-ai-council.md` asset-path block → `deep/assets/deep_ask-ai-council_*`

### Gemini TOML Migrations
- [ ] T026 [P] `mv` `.gemini/commands/speckit/deep-review.toml` → `.gemini/commands/deep/review.toml`
- [ ] T027 [P] `mv` `.gemini/commands/speckit/deep-research.toml` → `.gemini/commands/deep/research.toml`
- [ ] T028 Author `.gemini/commands/deep/ai-council.toml` (use `review.toml` as template)

### Verification Gate
- [ ] T029 Gate: `ls commands/deep/assets/` shows 6 `deep_*.yaml`; `ls commands/speckit/assets/speckit_deep-*` returns 0 hits
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

*WAVE 3 + 4 — Skill-graph recompile, advisor smoke, vitest sweep, and historical bulk-sed.*

### Skill SKILL.md Files
- [ ] T030 Update `deep-review/SKILL.md` — asset path + slash syntax refs
- [ ] T031 Update `deep-research/SKILL.md` — asset path + slash syntax refs
- [ ] T032 Update `deep-ai-council/SKILL.md` — asset path + slash syntax refs

### skill_advisor.py (Semantic Review — NOT bulk sed)
- [ ] T033 Update routing tables (lines 250-265) — edit deep-* dispatch references
- [ ] T034 Update trigger-phrase scoring (lines 1313-1657) — replace `/speckit:deep-*` → `/deep:*`

### Agent Definitions (4 Runtimes × 3 Skills)
- [ ] T035 [P] Update `.opencode/agents/{ai-council,deep-research,deep-review}.md`
- [ ] T036 [P] Update `.claude/agents/{ai-council,deep-research,deep-review}.md`
- [ ] T037 [P] Update `.codex/agents/{ai-council,deep-research,deep-review}.toml`
- [ ] T038 [P] Update `.gemini/agents/{ai-council,deep-research,deep-review}.md`

### Root Docs + Install Guides
- [ ] T039 [P] Update `CLAUDE.md`, `AGENTS.md`, `README.md`
- [ ] T040 [P] Update `.opencode/install_guides/SET-UP - AGENTS.md`, `install_guides/README.md`

### Graph Metadata
- [ ] T041 Update 9 `graph-metadata.json` files — skill edges + asset_path arrays in `deep-review`, `deep-research`, `deep-ai-council`, `deep-loop-runtime`, `deep-agent-improvement`, `system-skill-advisor`, `system-spec-kit`, `cli-opencode`, `sk-code-review`

### Verification Gate
- [ ] T042 Gate: `rg "/speckit:deep-(review|research|council|ai-council)" .opencode/agents/ .claude/agents/ .codex/agents/ .gemini/agents/ CLAUDE.md AGENTS.md README.md` returns 0 hits
- [ ] T043 Gate: `rg "spec_kit/assets/spec_kit_deep-" .opencode/commands/deep/ .opencode/skills/deep-*/SKILL.md` returns 0 hits
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: WAVE 3 — Skill-Graph Recompile + Advisor Smoke + Vitest

### Recompile
- [ ] T050 Run `skill_graph_compiler.py --export-json --pretty` — exit 0

### Advisor Smoke
- [ ] T051 Smoke: `skill_advisor.py "deep review packet" --threshold 0.6` — surfaces deep-review
- [ ] T052 Smoke: `skill_advisor.py "deep research investigation" --threshold 0.6` — surfaces deep-research
- [ ] T053 Smoke: `skill_advisor.py "deep ai council multi-topic" --threshold 0.6` — surfaces deep-ai-council

### Vitest Sweep
- [ ] T054 Run vitest on 4 suites — 100% PASS

### Verification Gate
- [ ] T055 Gate: all vitest suites PASS; advisor surfaces correct skill for all 3 prompts
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: WAVE 4 — Historical Spec-Doc Bulk-Sed

### Sed Operations (apply in order)
- [ ] T060 `spec_kit_deep-council_` → `deep_ai-council_` (must come first)
- [ ] T061 `spec_kit_deep-review_` → `deep_review_`
- [ ] T062 `spec_kit_deep-research_` → `deep_research_`
- [ ] T063 `spec_kit/assets/spec_kit_deep-` → `deep/assets/deep_` (path refs)
- [ ] T064 `/speckit:deep-review` → `/deep:start-review-loop`
- [ ] T065 `/speckit:deep-research` → `/deep:start-research-loop`
- [ ] T066 `/speckit:deep-council` → `/deep:ask-ai-council`

### Scope Control
- [ ] T067 Include: `.opencode/specs/**/*.md`, `.opencode/specs/**/*.json`, `.opencode/skills/**/*.md` (changelog + feature_catalog + playbook)
- [ ] T068 Exclude: `.git/**`, `z_archive/**`, `changelog/v1.0.0.0.md` and earlier

### Verification Gate
- [ ] T069 Gate: residual old-path hits ≤ 10 (excluding exclusions)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: WAVE 5 — Closure

- [ ] T080 Fill `implementation-summary.md` — what shipped, gate evidence, deviations, file table
- [ ] T081 Run `validate.sh --strict` on 131/007 — must PASS
- [ ] T082 Update `131/graph-metadata.json` `derived.last_active_child_id`
- [ ] T083 Write final commit handoff to `/tmp/wave5-commit-handoff.md`
- [ ] T084 Commit: `feat(131/007): relocate deep-* command assets + cross-repo references — deep:* command family complete`
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] WAVE 0: strict-validate PASS on 131/007
- [ ] WAVE 1: assets at new paths; old paths empty
- [ ] WAVE 2: 0 live old-path refs on operator surfaces
- [ ] WAVE 3: graph compiles; advisor correct; vitest 100% PASS
- [ ] WAVE 4: ≤ 10 residual historical refs
- [ ] WAVE 5: validate re-PASS; implementation-summary filled; final commit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Canonical Wave Plan**: `~/.claude/plans/fix-minor-drift-afterwards-twinkly-melody.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Verification Tasks

- [ ] T090 Verify `.claude/commands/deep/` symlinks auto-resolve to new asset paths after WAVE 1
- [ ] T091 Verify `.codex/commands/` symlink auto-resolves (no direct edits needed)
- [ ] T092 Verify no stale `spec_kit_deep-*` YAMLs remain in `spec_kit/assets/`
- [ ] T093 Verify Gemini TOMLs point to correct `.opencode/commands/deep/*.md` paths
- [ ] T094 Verify WAVE 2 edited `skill_advisor.py` still parses correctly (`python3 -c "import ast; ast.parse(open('skill_advisor.py').read())"`)
<!-- /ANCHOR:architecture-tasks -->
