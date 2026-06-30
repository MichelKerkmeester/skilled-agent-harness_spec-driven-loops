---
title: "Implementation Plan: cli-copilot Total Deprecation"
description: "Seven-batch dispatch plan: rm -rf the cli-copilot skill + global changelog + hooks + adapter; surgical edit advisor scoring; parallel sibling-cli scrub; agent + command + routing-doc edits; mirror sync; cross-skill playbook scrub; re-index + verify. Executor: cli-codex (gpt-5.5 medium, fast mode); up to 5 parallel agents respecting safe write boundaries."
trigger_phrases:
  - "cli-copilot deprecation plan"
  - "cli-codex deletion batches"
  - "skill advisor purge plan"
  - "cli-copilot resource map"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/067-cli-copilot-deprecation-due-to-price-hike"
    last_updated_at: "2026-05-06T12:25:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 plan.md"
    next_safe_action: "Author tasks.md"
    blockers: []
    completion_pct: 25
    open_questions: []
    answered_questions: []
---

# Implementation Plan: cli-copilot Total Deprecation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The cli-copilot skill is a self-contained directory under `.opencode/skills/cli-copilot/` with ~50+ playbook scenarios, references, scripts, and assets. It is wired into the repository through six surfaces:

1. **Skill self** — the directory.
2. **Skill advisor scoring** — `skill_advisor.py` (TOKEN_BOOSTS, PHRASE_BOOSTS, command-bridge prose), `skill-graph.json` (node + edges), `graph-metadata.json` (one edge entry), `check-prompt-quality-card-sync.sh` (path list), `fixtures/skill_advisor_regression_cases.jsonl` (one regression case).
3. **Cross-CLI orchestration prose** — every sibling `cli-*` skill (cli-claude-code, cli-codex, cli-gemini, cli-opencode) carries multi-paragraph cross-CLI integration sections naming cli-copilot as a peer executor.
4. **Agents + commands** — `multi-ai-council` agent (4 runtimes), `deep-research` command + YAML, `deep-review` command — these list cli-copilot as a dispatchable executor for parallel/distributed work.
5. **Routing docs** — `CLAUDE.md`, `AGENTS.md`, root `README.md`, `DEPLOYMENT.md`, `.opencode/skills/README.md`, `install_guides/`.
6. **Hooks + adapters + matrix runners** — `.github/hooks/spec-kit-copilot-hook.sh`, `mcp_server/hooks/copilot/`, `mcp_server/matrix_runners/adapter-cli-copilot.ts`, `mcp_server/tests/matrix-adapter-copilot.vitest.ts`, `feature_catalog/16/36-copilot-target-authority-helper.md` and the matching playbook + the copilot-compact-cache-parity pair.

A discovery sweep counted 718 unique files containing `cli-copilot` (excluding `node_modules/`, `dist/`, `.git/`, `z_archive/`, `memory/`, `.venv/`). Of those, 617 are inside `specs/` (prior packets — PRESERVE_HISTORY) and ~101 are live config requiring deletion or edit. The cli-copilot skill itself accounts for ~25 of those live hits; the rest are the surfaces above.

### Overview

Seven-batch parallel dispatch model. Each batch has a defined write-surface boundary so no two agents collide on the same file. Batches B1, B2, B7 are sequential single-agent. Batches B3, B4, B6 fan out to 3-5 parallel cli-codex agents. Batch B5 is sequential because the routing-doc edits share read-context. After B7 completes, the verification gates in `checklist.md` are exercised.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- spec.md complete and committed.
- resource-map.md enumerates every target file by bucket.
- tasks.md decomposes the 7 batches into atomic T### tasks.
- checklist.md defines P0/P1/P2 verification items.
- cli-codex skill loaded and dispatcher mechanics confirmed.
- On `main` branch with the discovery output captured.

### Definition of Done

- All 9 success criteria from `spec.md §5` met.
- All P0 + P1 checklist items marked `[x]` with evidence.
- `validate.sh --strict` exits 0.
- `implementation-summary.md` populated with diff stats and batch outcomes.
- `/memory:save` invoked; canonical continuity refreshed.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Parallel-batch deletion** — fan-out work into independent units; each unit has an isolated write surface; verification is centralized at the end.

### Key Components

| Component | Role |
|-----------|------|
| `cli-codex` skill | Dispatcher (fast mode, gpt-5.5 medium reasoning) |
| `resource-map.md` | Source of truth for all target files |
| `tasks.md` | Per-task atoms with batch assignment |
| `checklist.md` | Verification gates (P0/P1/P2) |
| `validate.sh --strict` | Spec-doc structural validator |
| `skill_advisor.py --rebuild` | Re-index advisor scoring after edits |
| `code_graph_scan`, `skill_graph_scan` MCP tools | Re-index graph state after deletions |

### Data Flow

```
Discovery (Phase B, complete)
    ↓
resource-map.md (6 buckets)
    ↓
tasks.md (B1..B7 with T-IDs)
    ↓
B1: rm -rf (skill self + global changelog + hooks + adapter + 4 specific docs)  [single agent, bash]
    ↓
B2: skill_advisor scoring  [single cli-codex, file-locked on skill_advisor.py]
    ↓
B3: 4 sibling cli-* skills  [4 parallel cli-codex, one per skill]
    ↓
B4: agent + command files  [up to 5 parallel cli-codex]
    ↓
B5: routing docs  [single cli-codex, sequential read-context]
    ↓
B6: cross-skill playbooks + runtime mirrors  [3 parallel cli-codex]
    ↓
B7: re-index sweep + memory annotation  [sequential]
    ↓
Verification (checklist.md walk)
    ↓
implementation-summary.md + /memory:save
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- T-001..T-005: Verify discovery output, scaffold spec docs (already done by main agent), confirm git state on main, confirm cli-codex availability, lock the resource-map by canonical save.

### Phase 2: Core Implementation

**Batch B1 — DELETE_LIVE (bash, single agent, ~30s wall-clock)**

- `rm -rf .opencode/skills/cli-copilot/`
- `rm -rf .opencode/changelog/cli-copilot/`
- `rm -f .github/hooks/spec-kit-copilot-hook.sh`
- `rm -rf .opencode/skills/system-spec-kit/mcp_server/hooks/copilot/`
- `rm -f .opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts`
- `rm -f .opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts`
- `rm -f .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/36-copilot-target-authority-helper.md`
- `rm -f .opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md`
- `rm -f .opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/274-shared-provenance-and-copilot-compact-cache-parity.md`
- `rm -f .opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/030-cli-copilot-target-authority-dispatch.md`
- `rm -f .opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/016-cli-copilot-target-authority-dispatch.md`

**Batch B2 — Skill advisor scoring (single cli-codex agent, file-locked)**

Edit (precision required):
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` (~12 lines: TOKEN_BOOSTS["copilot"], PHRASE_BOOSTS keys ending in "copilot"/"cli-copilot", routing-table entries listing cli-copilot among delegate/opinion/validate options, command-bridge tiebreaker prose, AMBIGUITY_DELTA fixtures)
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` (cli-copilot node at line 9 + every related_to edge listing cli-copilot at lines 41/49/66/74/157/171/206/378 + the cli-copilot block at line 54)
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` (one edge entry on line 13)
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/check-prompt-quality-card-sync.sh` (drop the cli-copilot path from the SYNC_PATHS array)
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` (delete the P1-CLI-004 line)

**Batch B3 — Sibling cli-* skill bodies (4 parallel cli-codex agents)**

- Agent B3a: `cli-claude-code/{SKILL.md,README.md,graph-metadata.json,manual_testing_playbook/manual_testing_playbook.md}`
- Agent B3b: `cli-codex/{SKILL.md,README.md,graph-metadata.json}`
- Agent B3c: `cli-gemini/{SKILL.md,README.md,graph-metadata.json}`
- Agent B3d: `cli-opencode/{SKILL.md,README.md,graph-metadata.json,manual_testing_playbook/manual_testing_playbook.md,references/integration_patterns.md,references/opencode_tools.md,assets/prompt_templates.md}` — and edit `cli-opencode/changelog/v1.*.md` ONLY if the changelog entries reference cli-copilot as a current peer (vs historical).

**Batch B4 — Agent + command files (up to 5 parallel cli-codex agents)**

- Agent B4a: `.opencode/agents/multi-ai-council.md`
- Agent B4b: `.claude/agents/multi-ai-council.md`
- Agent B4c: `.gemini/agents/multi-ai-council.md`
- Agent B4d: `.codex/agents/multi-ai-council.toml`
- Agent B4e: `.opencode/commands/speckit/{deep-research.md,deep-review.md,assets/spec_kit_deep-research_auto.yaml}` (single agent, three files in same skill area)

Mirror-sync constraint: B4a..B4d edit the SAME multi-ai-council content in 4 runtime variants. The 4 agents run in parallel because they touch DIFFERENT files; each is given identical edit semantics so output stays in sync.

**Batch B5 — Routing docs (single cli-codex, sequential read-context)**

- `CLAUDE.md`, `AGENTS.md`, `README.md`, `DEPLOYMENT.md`, `.opencode/skills/README.md`, `.opencode/install_guides/README.md`, `.opencode/install_guides/SET-UP - AGENTS.md`.

These docs reference cli-copilot in routing tables, executor lists, and example dispatches. The agent reads each, scrubs leaves remaining peers intact.

**Batch B6 — Cross-skill playbooks + matrix-runner edits (3 parallel cli-codex agents)**

- Agent B6a: `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md` + `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md` + `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/{run-matrix.ts,matrix-manifest.json,README.md}` (matrix-runner cluster).
- Agent B6b: cross-skill playbook references — `sk-doc/`, `sk-code/`, `sk-improve-prompt/`, `deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/{013,014,015,016,017,018}*.md`, `deep-research/SKILL.md`, `deep-research/references/loop_protocol.md`, `deep-review/SKILL.md`, `deep-review/references/loop_protocol.md`, `deep-review/manual_testing_playbook/manual_testing_playbook.md`.
- Agent B6c: remaining `system-spec-kit/feature_catalog/` + `system-spec-kit/manual_testing_playbook/` references that don't fall under matrix-runner cluster.

**Batch B7 — Re-index + memory annotation (sequential)**

- Annotate `memory/feedback_copilot_concurrency_override.md` with deprecation marker (single Edit).
- Run `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py --rebuild` (or equivalent MCP tool).
- Run `mcp__spec_kit_memory__skill_graph_scan` MCP tool.
- Run `mcp__spec_kit_memory__code_graph_scan` MCP tool.
- Smoke test: `python3 skill_advisor.py "use copilot cli"` — assert no cli-copilot in top-N.

### Phase 3: Verification

- Run `validate.sh <spec-folder> --strict` — must exit 0.
- Run live-config grep — must return only this packet's docs.
- Walk `checklist.md` — every P0 + P1 marked `[x]` with evidence.
- Confirm `git branch --show-current` returns `main`.
- Author `implementation-summary.md`.
- Run `/memory:save` to refresh canonical continuity.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Type | Command |
|------|------|---------|
| Strict spec validation | Static | `validate.sh <spec-folder> --strict` |
| Live-config grep gate | Static | `grep -rln 'cli-copilot' . [excludes]` |
| Skill advisor smoke | Functional | `python3 skill_advisor.py "use copilot cli"` and `... "delegate to copilot for cloud delegation"` |
| Skill advisor regression | Functional | Run regression battery; ensure deleted P1-CLI-004 case doesn't re-appear; ensure no other case false-positives on cli-copilot |
| Code graph scan | Static | `mcp__spec_kit_memory__code_graph_scan` — assert file count drops |
| Skill graph scan | Static | `mcp__spec_kit_memory__skill_graph_scan` — assert no cli-copilot node |
| Mirror parity | Static | Compare `multi-ai-council.md` content across `.opencode/`, `.claude/`, `.gemini/`, `.codex/` after edits |
| Matrix runner unit test | Skipped | `matrix-adapter-copilot.vitest.ts` deleted; `run-matrix.ts` no longer references the adapter |

No new tests needed — existing test infrastructure verifies the deletion.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Where | Purpose |
|------------|-------|---------|
| `cli-codex` skill | `.opencode/skills/cli-codex/` | Dispatcher for B2..B6 |
| `validate.sh` | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Strict spec validation |
| Skill advisor | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/` | Re-index target |
| `skill_graph_scan` MCP | spec_kit_memory MCP server | Graph re-index |
| `code_graph_scan` MCP | spec_kit_memory MCP server | Code graph re-index |
| `generate-context.js` | `.opencode/skills/system-spec-kit/scripts/dist/memory/` | Canonical save |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Deletion is permanent (per project memory: DELETE not archive). Rollback path is via git history:

1. If a deletion or edit goes wrong before commit, `git restore <path>` recovers from working-tree.
2. After commit, recovery is via `git revert <commit-sha>` (creates a new commit reverting the change) or `git checkout <previous-sha> -- <path>` (restores the file at a prior point and re-stages).
3. The cli-copilot skill content remains accessible in git history forever; re-creation is `git checkout HEAD~ -- .opencode/skills/cli-copilot/`.
4. The skill advisor scoring tables (skill_advisor.py, skill-graph.json) are textually well-bounded; re-applying the cli-copilot entries from the prior version takes minutes if needed.

No external rollback (no deployments, no published packages, no infra) — this is a repo-internal cleanup.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T-001..T-005) ─► B1 ─► B2 ─► B3 (4 parallel) ─┐
                                                     ├─► B4 (5 parallel) ─► B5 ─► B6 (3 parallel) ─► B7 ─► Verification
                                                     │
                                                  (B3 completes before B4 because cli-codex's own SKILL.md gets edited in B3 and we don't want stale skill state during dispatch)
```

| Phase | Depends On | Blocks | Parallelism |
|-------|-----------|--------|-------------|
| Setup | None | B1 | sequential |
| B1 (DELETE) | Setup | B2 | sequential bash |
| B2 (advisor scoring) | B1 | B3 | single agent (file-locked) |
| B3 (sibling cli-*) | B2 | B4 | 4 parallel cli-codex |
| B4 (agents + cmds) | B3 | B5 | up to 5 parallel cli-codex |
| B5 (routing docs) | B4 | B6 | sequential single agent |
| B6 (playbooks + matrix) | B5 | B7 | 3 parallel cli-codex |
| B7 (re-index) | B6 | Verification | sequential |
| Verification | B7 | Completion | sequential |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|-----------|------------------|
| Setup | Low | 5-10 min (already largely done) |
| B1 DELETE | Low | 1-2 min (pure rm) |
| B2 Advisor scoring | Medium | 5-10 min cli-codex single agent |
| B3 Sibling cli-* (4 parallel) | Medium | 5-10 min wall-clock for slowest agent |
| B4 Agent + commands (up to 5 parallel) | Medium | 5-10 min wall-clock |
| B5 Routing docs (sequential) | Medium | 10-15 min single agent |
| B6 Playbooks + matrix (3 parallel) | Medium | 10-20 min wall-clock |
| B7 Re-index + memory annotation | Low | 5 min |
| Verification | Low | 5 min |
| **Total wall-clock** | | **~45-75 min** with 5 parallel agents at peak |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Discovery output captured at `/tmp/cli-copilot-non-skill-hits.txt`
- [ ] Predecessor packet 080 confirmed complete
- [ ] Git is on `main`, no leftover packet branch
- [ ] cli-codex skill loadable; advisor smoke baseline captured

### Rollback Procedure (if a batch goes wrong)

1. **Mid-batch failure (B1 or B2)**: STOP further batches. `git status` to inspect; `git restore <path>` for unwanted changes. Re-run the batch with corrected prompt.
2. **B3..B6 partial completion**: identify which agent's surface is incomplete via grep; re-dispatch only that surface. The grep gate at end of each batch is the verification.
3. **B7 re-index failure**: edits remain on disk; re-run the failing re-index step (advisor rebuild / skill_graph_scan / code_graph_scan).
4. **Catastrophic — full revert wanted**: `git revert <packet-commit-range>` creates new commits undoing the deletion. Re-creation of cli-copilot skill content from `git checkout HEAD~ -- .opencode/skills/cli-copilot/`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: pure git history; no DB, no infra, no external services involved.
<!-- /ANCHOR:enhanced-rollback -->
