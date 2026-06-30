---
title: "Feature Specification: cli-copilot Total Deprecation"
description: "Physically remove the cli-copilot skill and every live-config reference to it from the public repo. Driver: GitHub Copilot price hike makes cli-copilot uneconomic versus cli-codex (gpt-5.5), which is now the default external CLI executor. Historical mentions in z_archive/, prior spec folders, ADRs, decision-records, and other-packet changelogs are preserved."
trigger_phrases:
  - "cli-copilot deprecation"
  - "cli-copilot removal"
  - "delete cli-copilot"
  - "cli-copilot price hike"
  - "remove copilot cli"
  - "skill advisor copilot purge"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/067-cli-copilot-deprecation-due-to-price-hike"
    last_updated_at: "2026-05-06T12:15:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 spec.md"
    next_safe_action: "Author plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/cli-copilot/"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json"
      - ".opencode/changelog/cli-copilot/"
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Are sibling cli-* skill bodies edited too? Yes — cli-claude-code, cli-codex, cli-gemini, cli-opencode all reference cli-copilot in their CLI orchestration prose."
      - "Do we annotate or delete memory/feedback_copilot_concurrency_override.md? Annotate (historical context); deletion outside scope of this packet."
      - "Edit AGENTS_Barter.md? No — symlink to separate Barter repo; out of scope."
---

# Feature Specification: cli-copilot Total Deprecation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (Verification) |
| **Priority** | P0 (cost-driven; blocks economic CLI dispatch parity) |
| **Status** | Draft |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Track** | `skilled-agent-orchestration` |
| **Predecessor** | `080-multi-ai-council-output-protocol` (complete — `implementation-summary.md` exists) |
| **Successor** | None (yet) |
| **Handoff Criteria** | Zero `cli-copilot` hits in live-config surfaces; `validate.sh --strict` exits 0; advisor smoke test returns no cli-copilot recommendation; mirror parity across `.claude/`, `.gemini/`, `.codex/`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

GitHub announced a price increase that pushes `cli-copilot` (the external Copilot CLI executor) above the cost ceiling that justified keeping it as a peer to `cli-codex`, `cli-gemini`, `cli-claude-code`, and `cli-opencode`. The packet `075-cli-copilot-hallucination-caveat` already documented quality concerns; the recent price change tips the cost/benefit balance decisively. Continuing to ship `cli-copilot` as a routable skill creates three problems:

1. **Misleading routing** — the skill advisor still ranks `cli-copilot` highly for prompts like "use copilot cli", "delegate to copilot", "cloud delegation". Users reaching for cloud delegation get pointed to a CLI we no longer want them to use.
2. **Maintenance debt** — the cli-copilot skill, its hooks (`.github/hooks/spec-kit-copilot-hook.sh`, `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/`), its matrix-runner adapter (`adapter-cli-copilot.ts`), its smoke test (`matrix-adapter-copilot.vitest.ts`), and its 50+ manual-testing-playbook scenarios all need to be kept current as `gpt-5.5`/`gpt-codex`/`grok-code-fast-1` model lineups shift. That maintenance is sunk-cost relative to the deprecation decision.
3. **Cross-skill clutter** — every sibling `cli-*` SKILL.md, every cross-CLI orchestration manual, every routing table in `CLAUDE.md` / `AGENTS.md` / `README.md` lists `cli-copilot` as one of the supported executors. Each of those mentions becomes incorrect on deprecation day.

### Purpose

Physically delete `cli-copilot` and every live-config reference. After this packet:

- `cli-codex` is the cost-optimized default external executor.
- `cli-gemini`, `cli-claude-code`, and `cli-opencode` remain available; their bodies are scrubbed of `cli-copilot` cross-references but otherwise unchanged.
- Skill advisor never recommends `cli-copilot`; advisor scoring tables, fixtures, and skill-graph all remove the entry.
- Historical mentions in prior spec folders, ADRs, decision-records, other-packet changelogs, `memory/`, and `z_archive/` remain untouched — they document past state and are not config.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Skill self-delete.** `rm -rf .opencode/skills/cli-copilot/` (entire directory tree including 50+ manual-testing-playbook scenarios, references, assets, scripts, changelog/, graph-metadata.json).
- **Global skill changelog directory.** `rm -rf .opencode/changelog/cli-copilot/` (the cli-copilot global changelog folder).
- **Hooks.** `.github/hooks/spec-kit-copilot-hook.sh` (file), `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/` (directory).
- **Matrix runner adapter.** `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts` (file), `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts` (file). Plus edits to `run-matrix.ts`, `matrix-manifest.json`, `matrix_runners/README.md` to drop the cli-copilot adapter wiring.
- **Skill advisor scoring tables.** `skill_advisor.py` (TOKEN_BOOSTS, PHRASE_BOOSTS, command-bridge tiebreaker prose, AMBIGUITY_DELTA fixtures), `skill-graph.json` (every `cli-copilot` node + edge), `graph-metadata.json` (the cli-copilot edge entry), `check-prompt-quality-card-sync.sh` (path list), `fixtures/skill_advisor_regression_cases.jsonl` (P1-CLI-004 line).
- **Sibling cli-\* skill bodies.** `cli-claude-code/{SKILL.md,README.md,graph-metadata.json,manual_testing_playbook/}`, `cli-codex/{SKILL.md,README.md,graph-metadata.json}`, `cli-gemini/{SKILL.md,README.md,graph-metadata.json}`, `cli-opencode/{SKILL.md,README.md,graph-metadata.json,manual_testing_playbook/,references/integration_patterns.md,references/opencode_tools.md,assets/prompt_templates.md}`. Scrub every `cli-copilot` mention — usually replaced with the surviving cli-* peer list, or removed cleanly when it documents a cli-copilot-specific dispatch.
- **Agents.** `.opencode/agents/multi-ai-council.md` plus its 3 runtime mirrors (`.claude/agents/multi-ai-council.md`, `.codex/agents/multi-ai-council.toml`, `.gemini/agents/multi-ai-council.md`).
- **Commands.** `.opencode/commands/speckit/deep-research.md`, `.opencode/commands/speckit/deep-review.md`, `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml`. (Note: command-mirroring to runtime dirs is targeted only where existing routing references exist; many command files don't have runtime mirrors.)
- **Routing docs.** `CLAUDE.md`, `AGENTS.md`, `README.md`, `DEPLOYMENT.md`, `.opencode/skills/README.md`, `.opencode/install_guides/README.md`, `.opencode/install_guides/SET-UP - AGENTS.md`.
- **Cross-skill manual-testing-playbook + feature-catalog references** that name `cli-copilot` as a supported CLI executor — `sk-doc/`, `sk-code/`, `sk-improve-prompt/`, `deep-research/`, `deep-review/`, `deep-agent-improvement/`, `system-spec-kit/feature_catalog/16--tooling-and-scripts/`, `system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/`. Two specific files are deleted as cli-copilot-specific (`feature_catalog/16/36-copilot-target-authority-helper.md`, `feature_catalog/18/21-shared-provenance-and-copilot-compact-cache-parity.md` and the matching playbook files); the rest are edited.
- **Re-index.** Run `skill_advisor` rebuild → `skill_graph_scan` → `code_graph_scan` after edits to refresh in-memory tables and graph indexes.
- **Memory annotation.** Add a deprecation marker line to `memory/feedback_copilot_concurrency_override.md` indicating the rule is historical (do NOT delete).

### Out of Scope

- **Prior spec folders, ADRs, decision-records, other-packet changelogs** — historical record, preserved.
- **`z_archive/`, `z_future/`, `memory/` directories** — historical; out of scope.
- **`AGENTS_Barter.md`** — symlink to a separate Barter repo; never edit through the symlink.
- **Vendor code** — `node_modules/@github/copilot-sdk/`, `mcp-coco-index/mcp_server/.venv/lib/.../litellm/llms/github_copilot/`, anything inside `dist/`, `node_modules/`, `.git/`. These are third-party packages or build artifacts, not our code.
- **Git history rewrites** — history is record, not config.
- **Workflow-invariance test allowlist** — only updated if a remaining live-config edit legitimately retains `cli-copilot` vocabulary in a maintainer-doc path. Default expectation: no allowlist update needed.

### Files to Change

See `resource-map.md` for the full enumerated inventory across 6 buckets (DELETE_LIVE, EDIT_LIVE, MIRROR_SYNC, PRESERVE_HISTORY, ANNOTATE, POST_PROCESS).

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **R-001** Skill folder `.opencode/skills/cli-copilot/` is physically deleted (no `z_archive/`, no `.bak`, no commented-out tombstone).
- **R-002** Global skill changelog `.opencode/changelog/cli-copilot/` is physically deleted.
- **R-003** Skill advisor scoring tables (`skill_advisor.py`, `skill-graph.json`, `graph-metadata.json`, `check-prompt-quality-card-sync.sh`, `fixtures/skill_advisor_regression_cases.jsonl`) contain zero `cli-copilot` references after edits.
- **R-004** Skill advisor smoke test: invoking `python3 skill_advisor.py "use copilot cli"` and `python3 skill_advisor.py "delegate to copilot for cloud delegation"` returns no `cli-copilot` recommendation in the top results.
- **R-005** Sibling `cli-*` skill bodies (cli-claude-code, cli-codex, cli-gemini, cli-opencode — SKILL.md + README.md + graph-metadata.json + manual_testing_playbook + references + assets) contain zero `cli-copilot` references after edits.
- **R-006** Agent + command files (`multi-ai-council.md` ×4 runtimes, `deep-research.md`, `deep-review.md`, `spec_kit_deep-research_auto.yaml`) contain zero `cli-copilot` references after edits.
- **R-007** Routing docs (`CLAUDE.md`, `AGENTS.md`, `README.md`, `DEPLOYMENT.md`, `.opencode/skills/README.md`, both `install_guides/`) contain zero `cli-copilot` references after edits.
- **R-008** Live-config grep gate: `grep -rln 'cli-copilot' . --include='*.md' --include='*.json' --include='*.jsonc' --include='*.yaml' --include='*.yml' --include='*.toml' --include='*.ts' --include='*.js' --include='*.py' --include='*.sh' --exclude-dir='node_modules' --exclude-dir='dist' --exclude-dir='.git' --exclude-dir='z_archive' --exclude-dir='memory' --exclude-dir='specs' --exclude-dir='.venv'` returns hits ONLY in this packet's own spec docs.
- **R-009** `validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/067-cli-copilot-deprecation-due-to-price-hike --strict` exits 0.
- **R-010** All P0 checklist items in `checklist.md` marked `[x]` with evidence citations.
- **R-011** Stay on `main`. If `create.sh` (or any tool) auto-branches, immediately switch back to main and delete the packet branch.

### P1 - Required (complete OR user-approved deferral)

- **R-101** Mirror parity: `.claude/`, `.gemini/`, `.codex/` runtime dirs reflect canonical edits where they previously carried `cli-copilot` references.
- **R-102** Hook + adapter deletion: `.github/hooks/spec-kit-copilot-hook.sh`, `mcp_server/hooks/copilot/`, `mcp_server/matrix_runners/adapter-cli-copilot.ts`, `mcp_server/tests/matrix-adapter-copilot.vitest.ts` are physically deleted; companion files (`run-matrix.ts`, `matrix-manifest.json`, `matrix_runners/README.md`) are edited to drop the wiring.
- **R-103** Cross-skill manual-testing-playbook + feature-catalog references in `sk-doc/`, `sk-code/`, `sk-improve-prompt/`, `deep-research/`, `deep-review/`, `deep-agent-improvement/`, `system-spec-kit/feature_catalog/`, `system-spec-kit/manual_testing_playbook/` contain zero `cli-copilot` references after edits.
- **R-104** Re-index sweep complete: `skill_advisor` rebuild + `skill_graph_scan` + `code_graph_scan` all rerun; new state reflects deletion.
- **R-105** Memory annotation: `memory/feedback_copilot_concurrency_override.md` carries a one-line deprecation marker (e.g., `# DEPRECATED 2026-05-06 — cli-copilot removed in packet 081; rule kept for historical context only.`).

### P2 - Nice-to-have

- **R-201** `code_graph_scan` rerun shows file-count and edge-count drop reflecting the deletion.
- **R-202** Workflow-invariance allowlist update — only if a kept live-config edit uses `cli-copilot` vocabulary in a path that triggers `workflow-invariance.vitest.ts`.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Verification |
|----|-----------|--------------|
| SC-1 | Zero `cli-copilot` hits in live config | `grep -rln 'cli-copilot' . [excludes]` shows only this packet's docs |
| SC-2 | Skill folder gone | `[ ! -d .opencode/skills/cli-copilot ]` |
| SC-3 | Global changelog dir gone | `[ ! -d .opencode/changelog/cli-copilot ]` |
| SC-4 | Hook + adapter files gone | `[ ! -f .github/hooks/spec-kit-copilot-hook.sh ] && [ ! -f .opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts ]` |
| SC-5 | Advisor never recommends cli-copilot | `python3 skill_advisor.py "use copilot cli" --threshold 0` shows no cli-copilot in top-N |
| SC-6 | Strict spec validation passes | `validate.sh <spec-folder> --strict` exits 0 |
| SC-7 | Mirror parity | `.claude/`, `.gemini/`, `.codex/` reflect canonical edits |
| SC-8 | Re-index complete | `skill_advisor` rebuild logs success; `skill_graph_scan` and `code_graph_scan` reflect deletion |
| SC-9 | On main with no leftover packet branch | `git branch --show-current` returns `main`; no `081-*` branch exists |

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Accidental deletion of historical content (z_archive, prior packets, memory) | Low | High | Excludes hard-coded in every grep + cli-codex prompt; resource-map enumerates `PRESERVE_HISTORY` explicitly |
| Edit-through-symlink corrupts Barter repo | Low | High | `AGENTS_Barter.md` flagged as out-of-scope; canonical `AGENTS.md` is the only edit target |
| Two parallel cli-codex agents collide on `skill_advisor.py` | Medium | Medium | Batch B2 is single-agent (file-locked); skill_advisor.py never assigned to two agents |
| Mirror dirs drift from canonical | Medium | Medium | Batch B6 is dedicated mirror sync; verification gate compares hits |
| `create.sh` auto-creates a packet branch | High | Low | Skipped — using existing folder + manual scaffold; staying on `main` per project memory |
| Workflow-invariance test fails on legitimate retained vocabulary | Low | Low | Default expectation: no retained vocabulary; only update allowlist if discovered |
| Advisor in-memory cache stale after edit | Medium | Low | Re-index sweep at B7 |

### Dependencies

- `cli-codex` skill (`.opencode/skills/cli-codex/`) — required as the dispatcher for parallel batches; this packet does NOT modify cli-codex's own contents in a way that breaks dispatch.
- Skill advisor MCP service — runs locally; rebuild via `skill_advisor` MCP tool or `python3 skill_advisor.py --rebuild` after edits.
- Code graph MCP service — `code_graph_scan` MCP tool to refresh after edits.
- `validate.sh` script — strict mode is the gate.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at spec time. The plan resolves all ambiguity. Outstanding decisions (recorded as ANSWERED in continuity frontmatter):

- Sibling cli-* skill bodies are EDITED, not deleted. ✓
- Memory entry `feedback_copilot_concurrency_override.md` is ANNOTATED, not deleted. ✓
- `AGENTS_Barter.md` symlink is OUT OF SCOPE. ✓
- Two specific feature-catalog/playbook docs about copilot-specific features (target-authority-helper, copilot-compact-cache-parity) are DELETED, not edited, because the feature itself is copilot-only. ✓

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Deletion + edit + re-index sweep completes in under 30 minutes wall-clock with 5 parallel cli-codex agents.
- **NFR-P02**: Skill advisor smoke test (post-rebuild) returns top-N recommendations in under 200ms — no degradation versus pre-deletion baseline.

### Security
- **NFR-S01**: No edits applied through the `AGENTS_Barter.md` symlink; canonical `AGENTS.md` only.
- **NFR-S02**: No deletions inside `node_modules/`, `dist/`, `.git/`, `.venv/`, or `z_archive/`.

### Reliability
- **NFR-R01**: Deletion is atomic per file (`rm -f` / `rm -rf`); no half-edited intermediate states left behind.
- **NFR-R02**: If a cli-codex batch fails partway, the remaining batches are re-runnable idempotently (each batch's prompt re-checks the current state before editing).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **A file mentions cli-copilot only in a code comment or example** — scrub the mention and verify surrounding context still parses (especially for skill_advisor.py and JSON files).
- **A graph-metadata.json entry has cli-copilot as the SOLE peer of a node** — remove the entry but ensure the node still has a non-empty peer set; if not, leave a note in the implementation summary about the topology change.

### Error Scenarios
- **Two cli-codex agents accidentally write the same file** — should never happen (batches are file-locked) but if it does, last-writer-wins; verify the result with grep gate before claiming completion.
- **Re-index step fails after edits** — the edits remain on disk; re-run the re-index command; advisor in-memory cache may be stale until rebuild succeeds.
- **`validate.sh --strict` fails after edits** — diagnose anchor/header/frontmatter drift; fix the offending file; do NOT claim completion until exit 0.

### State Transitions
- **Partial completion (some batches complete, others not)** — implementation-summary.md must list which batches passed; resume by re-running unfinished batches; idempotency is enforced by each batch's "current state check" prelude.
- **Mirror dir drift after partial B4 completion** — verify with grep across all 4 runtime dirs; re-edit the lagging mirror.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | ~101 live-config files + 1 skill tree (~50 files) + 4 runtime mirrors + 7 batches |
| Risk | 14/25 | Mostly textual edits; advisor scoring tables are precision-sensitive but well-bounded; no production deployment risk |
| Research | 6/20 | Discovery already complete; resource-map enumerates targets concretely |
| **Total** | **42/70** | **Level 2 confirmed** (would be Level 3 if scope crossed 500 LOC of new code; here it's all subtractive) |
<!-- /ANCHOR:complexity -->
