---
title: "Tasks: cli-copilot Total Deprecation"
description: "Atomic task decomposition for the 7-batch cli-copilot deprecation. Each task carries a batch ID (B1..B7), a write-surface boundary, and a verification step. Parallelizable tasks are marked [P]."
trigger_phrases:
  - "cli-copilot tasks"
  - "deprecation task list"
  - "cli-codex batch dispatch"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike"
    last_updated_at: "2026-05-06T12:30:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Author checklist.md"
    blockers: []
    completion_pct: 35
---

# Tasks: cli-copilot Total Deprecation

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `T-NNN` = task ID (sequential)
- `[P]` = parallelizable with other `[P]` tasks in the same batch
- `[B1]..[B7]` = batch assignment (see plan.md §4 for batch semantics)
- `[E:path]` = evidence pointer (file path or shell command output)
- `[ ]` = pending, `[x]` = complete

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] **T-001** Verify discovery output captured at `/tmp/cli-copilot-non-skill-hits.txt` (718 file count).
- [ ] **T-002** Confirm git branch is `main`; no uncommitted packet-related work staged.
- [ ] **T-003** Confirm `cli-codex` skill is loadable and the dispatch command pattern is `codex exec --model gpt-5.5 -c reasoning_effort="medium" -c service_tier="fast" '<prompt>'`.
- [ ] **T-004** Confirm `validate.sh --strict` runs cleanly on the existing scaffold (spec.md, plan.md, tasks.md, checklist.md, resource-map.md).
- [ ] **T-005** Lock the resource-map by canonical save before B1 begins (`generate-context.js`).

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Batch B1 — DELETE_LIVE (bash, single agent, sequential)

- [ ] **T-101** [B1] `rm -rf .opencode/skills/cli-copilot/`
- [ ] **T-102** [B1] `rm -rf .opencode/changelog/cli-copilot/`
- [ ] **T-103** [B1] `rm -f .github/hooks/spec-kit-copilot-hook.sh`
- [ ] **T-104** [B1] `rm -rf .opencode/skills/system-spec-kit/mcp_server/hooks/copilot/`
- [ ] **T-105** [B1] `rm -f .opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts`
- [ ] **T-106** [B1] `rm -f .opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts`
- [ ] **T-107** [B1] `rm -f .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/36-copilot-target-authority-helper.md`
- [ ] **T-108** [B1] `rm -f .opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md`
- [ ] **T-109** [B1] `rm -f .opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/274-shared-provenance-and-copilot-compact-cache-parity.md`
- [ ] **T-110** [B1] `rm -f .opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/030-cli-copilot-target-authority-dispatch.md`
- [ ] **T-111** [B1] `rm -f .opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/016-cli-copilot-target-authority-dispatch.md`
- [ ] **T-112** [B1] Verify B1 deletions: `ls -d .opencode/skills/cli-copilot/ 2>&1` returns "No such file or directory" and equivalent for the other deleted paths.

### Batch B2 — Skill advisor scoring (single cli-codex, file-locked)

- [ ] **T-201** [B2] Edit `skill_advisor.py` — remove every `cli-copilot` and `copilot` token from TOKEN_BOOSTS, PHRASE_BOOSTS, command-bridge tiebreaker prose, AMBIGUITY_DELTA fixtures, and the routing tables for `delegate`, `opinion`, `validate` keys.
- [ ] **T-202** [B2] Edit `skill-graph.json` — remove the `cli-copilot` node entry, remove every `cli-copilot` from `related_to` arrays in other nodes, remove the `cli-copilot` block at the dedicated entry, recalculate any normalization scores if needed.
- [ ] **T-203** [B2] Edit `graph-metadata.json` — remove the cli-copilot edge entry on line 13.
- [ ] **T-204** [B2] Edit `check-prompt-quality-card-sync.sh` — drop the cli-copilot path from the SYNC_PATHS array.
- [ ] **T-205** [B2] Edit `fixtures/skill_advisor_regression_cases.jsonl` — delete the P1-CLI-004 line.
- [ ] **T-206** [B2] Verify B2: `grep -n 'cli-copilot\|cli_copilot' .opencode/skills/system-spec-kit/mcp_server/skill_advisor/` returns zero hits.

### Batch B3 — Sibling cli-* skill bodies (4 parallel cli-codex agents) [P]

- [ ] **T-301** [B3] [P] Edit `.opencode/skills/cli-claude-code/{SKILL.md,README.md,graph-metadata.json,manual_testing_playbook/manual_testing_playbook.md}` — scrub every `cli-copilot` mention.
- [ ] **T-302** [B3] [P] Edit `.opencode/skills/cli-codex/{SKILL.md,README.md,graph-metadata.json}` — scrub every `cli-copilot` mention.
- [ ] **T-303** [B3] [P] Edit `.opencode/skills/cli-gemini/{SKILL.md,README.md,graph-metadata.json}` — scrub every `cli-copilot` mention.
- [ ] **T-304** [B3] [P] Edit `.opencode/skills/cli-opencode/{SKILL.md,README.md,graph-metadata.json,manual_testing_playbook/manual_testing_playbook.md,references/integration_patterns.md,references/opencode_tools.md,assets/prompt_templates.md}` — scrub every `cli-copilot` mention. NOTE: `cli-opencode/changelog/v1.*.md` files are PRESERVE_HISTORY (changelog history records past peer relationships); only edit those files if a current peer-list section names and even then prefer leaving the historical "shipped with cli-copilot peer support" note intact.
- [ ] **T-305** [B3] Verify B3: `grep -rln 'cli-copilot' .opencode/skills/cli-*/` (excluding any cli-copilot/ directory which no longer exists) returns hits ONLY in changelog/ files where the mention is historical.

### Batch B4 — Agent + command files (up to 5 parallel cli-codex agents) [P]

- [ ] **T-401** [B4] [P] Edit `.opencode/agents/multi-ai-council.md` — scrub every `cli-copilot` mention from the executor list, remove cli-copilot from "available external CLIs" sections, leave `cli-codex`, `cli-claude-code`, `cli-gemini`, `cli-opencode` intact.
- [ ] **T-402** [B4] [P] Edit `.claude/agents/multi-ai-council.md` — apply identical edits as T-401 in the Claude runtime variant.
- [ ] **T-403** [B4] [P] Edit `.gemini/agents/multi-ai-council.md` — apply identical edits as T-401 in the Gemini runtime variant.
- [ ] **T-404** [B4] [P] Edit `.codex/agents/multi-ai-council.toml` — apply identical edits as T-401 in the Codex TOML format.
- [ ] **T-405** [B4] [P] Edit `.opencode/commands/spec_kit/{deep-research.md,deep-review.md,assets/spec_kit_deep-research_auto.yaml}` — scrub `cli-copilot` from executor lists in these command bodies and YAML config.
- [ ] **T-406** [B4] Verify B4: `grep -rln 'cli-copilot' .opencode/agents/ .claude/agents/ .gemini/agents/ .codex/agents/ .opencode/commands/spec_kit/` returns zero hits.

### Batch B5 — Routing docs (single cli-codex, sequential read-context)

- [ ] **T-501** [B5] Edit `CLAUDE.md` — scrub `cli-copilot` from any CLI routing tables or examples (one cumulative pass).
- [ ] **T-502** [B5] Edit `AGENTS.md` — scrub `cli-copilot` from CLI routing tables; preserve any historical "supported runtimes" tables that document past state.
- [ ] **T-503** [B5] Edit root `README.md` — scrub `cli-copilot` from quick-start, CLI executor list, examples.
- [ ] **T-504** [B5] Edit `DEPLOYMENT.md` — scrub `cli-copilot` if present in deployment-environment CLI list.
- [ ] **T-505** [B5] Edit `.opencode/skills/README.md` — drop `cli-copilot` from the skill catalog.
- [ ] **T-506** [B5] Edit `.opencode/install_guides/README.md` — drop `cli-copilot` from the install index.
- [ ] **T-507** [B5] Edit `.opencode/install_guides/SET-UP - AGENTS.md` — drop `cli-copilot` setup steps.
- [ ] **T-508** [B5] Verify B5: `grep -ln 'cli-copilot' CLAUDE.md AGENTS.md README.md DEPLOYMENT.md .opencode/skills/README.md .opencode/install_guides/` returns zero hits.

### Batch B6 — Cross-skill playbooks + matrix runners (3 parallel cli-codex agents) [P]

- [ ] **T-601** [B6] [P] Edit matrix-runner cluster: `feature_catalog/16/37-cli-matrix-adapter-runners.md`, `manual_testing_playbook/16/280-cli-matrix-adapter-runner-smoke.md`, `mcp_server/matrix_runners/{run-matrix.ts,matrix-manifest.json,README.md}` — drop the cli-copilot adapter wiring and update peer-CLI lists.
- [ ] **T-602** [B6] [P] Edit cross-skill playbook references in `sk-doc/`, `sk-code/`, `sk-improve-prompt/`, `deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/{013..018}*.md`, `deep-research/SKILL.md`, `deep-research/references/loop_protocol.md`, `deep-review/SKILL.md`, `deep-review/references/loop_protocol.md`, `deep-review/manual_testing_playbook/manual_testing_playbook.md` — scrub `cli-copilot` from current-state peer lists; preserve historical references.
- [ ] **T-603** [B6] [P] Edit remaining `system-spec-kit/feature_catalog/` + `system-spec-kit/manual_testing_playbook/` references that don't fall under matrix-runner cluster — scrub `cli-copilot` from current-state peer lists; preserve historical references.
- [ ] **T-604** [B6] Verify B6: `grep -rln 'cli-copilot' .opencode/skills/ --exclude-dir=cli-copilot` excludes results in changelog/ and historical references; remaining hits are evaluated case-by-case and either edited or marked PRESERVE_HISTORY in resource-map.md.

### Batch B7 — Re-index sweep + memory annotation (sequential)

- [ ] **T-701** [B7] Annotate `memory/feedback_copilot_concurrency_override.md` — prepend `# DEPRECATED 2026-05-06 — cli-copilot removed in packet 081-cli-copilot-deprecation-due-to-price-hike; rule kept for historical context only.` (one Edit).
- [ ] **T-702** [B7] Run `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --rebuild` (or equivalent advisor rebuild MCP path).
- [ ] **T-703** [B7] Run `mcp__spec_kit_memory__skill_graph_scan` — assert no cli-copilot node in result.
- [ ] **T-704** [B7] Run `mcp__spec_kit_memory__code_graph_scan` — capture pre/post file count and edge count for implementation-summary.md.
- [ ] **T-705** [B7] Smoke test the advisor: invoke `python3 skill_advisor.py "use copilot cli"` and `python3 skill_advisor.py "delegate to copilot for cloud delegation"`. Both should return zero cli-copilot recommendations.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-801** Run live-config grep gate: `grep -rln 'cli-copilot' . --include='*.md' --include='*.json' --include='*.jsonc' --include='*.yaml' --include='*.yml' --include='*.toml' --include='*.ts' --include='*.js' --include='*.py' --include='*.sh' --exclude-dir='node_modules' --exclude-dir='dist' --exclude-dir='.git' --exclude-dir='z_archive' --exclude-dir='memory' --exclude-dir='specs' --exclude-dir='.venv'`. Expected: zero hits OR hits ONLY in `.opencode/specs/skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike/` (this packet's docs).
- [ ] **T-802** Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike --strict`. Expected: exit 0.
- [ ] **T-803** Walk `checklist.md` — mark every P0 + P1 item `[x]` with evidence citation (`[E:file:lines]` or `[E:cmd output]`).
- [ ] **T-804** Confirm git state: `git branch --show-current` returns `main`; `git status` shows expected modified/deleted files; no `081-*` packet branch lingering.
- [ ] **T-805** Author `implementation-summary.md` from the populated template; include diff stats (files added / modified / deleted), per-batch outcomes, deviations from plan, advisor smoke-test output, code-graph delta.
- [ ] **T-806** Run `/memory:save` to refresh canonical continuity for this packet (uses `generate-context.js` with structured JSON; refreshes `description.json` + `graph-metadata.json`).
- [ ] **T-807** Final state check: `grep` gate passes, `validate.sh --strict` passes, all checklist items `[x]`, `implementation-summary.md` exists, memory saved.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All tasks T-001..T-807 marked `[x]` with evidence. All P0 + P1 checklist items marked `[x]`. `validate.sh --strict` exits 0. Live-config grep returns zero hits outside this packet's docs. Git branch is `main`. Memory saved.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md §3 SCOPE` — defines what's in/out of scope.
- `spec.md §4 REQUIREMENTS` — R-001..R-202 mapped to T-IDs in Phase 2.
- `plan.md §4 IMPLEMENTATION PHASES` — batch semantics and parallelism rules.
- `checklist.md` — P0/P1/P2 verification gates.
- `resource-map.md` — full file inventory by bucket.

<!-- /ANCHOR:cross-refs -->
