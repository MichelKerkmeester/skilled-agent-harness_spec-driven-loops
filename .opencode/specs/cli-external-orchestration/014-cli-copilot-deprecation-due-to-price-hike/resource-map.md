---
title: "Resource Map: cli-copilot Total Deprecation"
description: "Evidence-based file inventory across 6 buckets: DELETE_LIVE, EDIT_LIVE, MIRROR_SYNC, PRESERVE_HISTORY, ANNOTATE, POST_PROCESS. Built from 6 discovery sweeps; 718 unique files reference of which ~101 are live config requiring deletion or edit; 617 are spec/history paths preserved untouched."
trigger_phrases:
  - "cli-copilot resource map"
  - "deprecation file inventory"
  - "cli-copilot blast radius"
  - "what files touch cli-copilot"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/014-cli-copilot-deprecation-due-to-price-hike"
    last_updated_at: "2026-05-06T12:40:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored resource-map.md"
    next_safe_action: "Dispatch B1"
    blockers: []
    completion_pct: 60
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

This packet's blast radius spans ~101 live-config files plus the entire `.opencode/skills/cli-copilot/` directory (~50+ files). A flat listing in `implementation-summary.md` would be unreadable. The 6-bucket categorization (DELETE_LIVE / EDIT_LIVE / MIRROR_SYNC / PRESERVE_HISTORY / ANNOTATE / POST_PROCESS) is required to keep cli-codex dispatch prompts unambiguous and to ensure no historical content is deleted by accident.

<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

| Bucket | File Count | Action | Batch |
|--------|-----------|--------|-------|
| **DELETE_LIVE** | 1 dir tree (~50+ files) + 9 individual files + 2 dir trees | Physical `rm -rf` / `rm -f` | B1 |
| **EDIT_LIVE — Skill Advisor** | 5 files | Surgical edits | B2 |
| **EDIT_LIVE — Sibling cli-\*** | ~14 files | Scrub cli-copilot from current-state prose | B3 |
| **EDIT_LIVE — Agents + Commands** | 7 files | Scrub cli-copilot from executor lists | B4 |
| **EDIT_LIVE — Routing Docs** | 7 files | Scrub cli-copilot from CLI tables | B5 |
| **EDIT_LIVE — Cross-skill Playbooks + Matrix Runners** | ~50 files | Scrub or trim peer-list mentions | B6 |
| **MIRROR_SYNC** | (folded into B4 + B5) | Identical edits across runtimes | B4/B5 |
| **PRESERVE_HISTORY** | 617 files | NO CHANGE | — |
| **ANNOTATE** | 1 file | Prepend deprecation marker | B7 |
| **POST_PROCESS** | 3 indexes | Re-index advisor + skill graph + code graph | B7 |

**Total live edits + deletions:** ~101 unique files (excluding the cli-copilot skill self-tree which is bulk-deleted). **Total preserved:** 617 spec-history files.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Bucket | Batch | Action |
|------|--------|-------|--------|
| `README.md` (root) | EDIT_LIVE | B5 | Scrub cli-copilot from quick-start + executor list |
| `.opencode/skills/README.md` | EDIT_LIVE | B5 | Drop cli-copilot from skill catalog |
| `.opencode/install_guides/README.md` | EDIT_LIVE | B5 | Drop cli-copilot from install index |
| `.opencode/skills/cli-claude-code/README.md` | EDIT_LIVE | B3a | Scrub cli-copilot peer references |
| `.opencode/skills/cli-codex/README.md` | EDIT_LIVE | B3b | Scrub cli-copilot peer references |
| `.opencode/skills/cli-gemini/README.md` | EDIT_LIVE | B3c | Scrub cli-copilot peer references |
| `.opencode/skills/cli-opencode/README.md` | EDIT_LIVE | B3d | Scrub cli-copilot peer references |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md` | EDIT_LIVE | B6a | Drop cli-copilot adapter from runner README |
| `.opencode/skills/cli-copilot/README.md` | DELETE_LIVE | B1 | Deleted with skill tree |

<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

### Routing docs (B5)

| Path | Action |
|------|--------|
| `CLAUDE.md` | Scrub cli-copilot from CLI routing tables/examples |
| `AGENTS.md` | Scrub cli-copilot from CLI routing tables |
| `DEPLOYMENT.md` | Scrub cli-copilot from deployment-environment CLI list |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Drop cli-copilot setup steps |

### Cross-skill playbooks + feature catalogs (B6)

Files (sample, full list captured in `/tmp/cli-copilot-non-skill-hits.txt`):

| Cluster | Files | Action |
|---------|-------|--------|
| Matrix runner cluster | `feature_catalog/16/37-cli-matrix-adapter-runners.md`, `manual_testing_playbook/16/280-cli-matrix-adapter-runner-smoke.md` | Drop cli-copilot adapter wiring |
| sk-doc playbooks | `.opencode/skills/sk-doc/manual_testing_playbook/...` (19 files) | Scrub current-state peer list mentions |
| sk-code playbooks | `.opencode/skills/sk-code/manual_testing_playbook/...` (2 files) | Scrub peer list mentions |
| sk-improve-prompt playbooks | `.opencode/skills/sk-improve-prompt/manual_testing_playbook/...` (2 files) | Scrub peer list mentions |
| deep-agent-improvement playbooks | `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/{013..018}*.md` (6 files) | Scrub peer list mentions |
| deep-research SKILL + loop_protocol | `.opencode/skills/deep-research/SKILL.md`, `references/loop_protocol.md` | Scrub current-state peer list mentions |
| deep-review SKILL + loop_protocol + manual_testing_playbook | `.opencode/skills/deep-review/SKILL.md`, `references/loop_protocol.md`, `manual_testing_playbook/manual_testing_playbook.md` | Scrub current-state peer list mentions |
| system-spec-kit feature_catalog (other) | `.opencode/skills/system-spec-kit/feature_catalog/...` (~10 remaining files) | Scrub peer list mentions |
| system-spec-kit manual_testing_playbook (other) | `.opencode/skills/system-spec-kit/manual_testing_playbook/...` (~10 remaining files) | Scrub peer list mentions |

### Other-packet changelog (PRESERVE_HISTORY)

| Path | Bucket | Reason |
|------|--------|--------|
| `.opencode/changelog/agent-orchestration/v2.4.0.0.md` | PRESERVE_HISTORY | Past-state changelog of an UNRELATED packet |

<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Bucket | Batch | Action |
|------|--------|-------|--------|
| `.opencode/commands/speckit/deep-research.md` | EDIT_LIVE | B4e | Scrub cli-copilot from executor list |
| `.opencode/commands/speckit/deep-review.md` | EDIT_LIVE | B4e | Scrub cli-copilot from executor list |
| `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` | EDIT_LIVE | B4e | Drop cli-copilot from YAML config |

Note: Commands are NOT mirrored to `.claude/commands/`, `.gemini/commands/`, `.codex/commands/` for cli-copilot routing. The Gemini commands dir does carry a `deep-research.toml` (status: M in current git status), but discovery shows it does NOT contain `cli-copilot` references. No mirror sync needed for commands.

<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:agents -->
## 4. Agents

| Path | Bucket | Batch | Action |
|------|--------|-------|--------|
| `.opencode/agents/multi-ai-council.md` | EDIT_LIVE | B4a | Scrub cli-copilot from executor list |
| `.claude/agents/multi-ai-council.md` | MIRROR_SYNC | B4b | Apply identical edits |
| `.gemini/agents/multi-ai-council.md` | MIRROR_SYNC | B4c | Apply identical edits |
| `.codex/agents/multi-ai-council.toml` | MIRROR_SYNC | B4d | Apply identical edits in TOML format |

Other agents (e.g., `@orchestrate`, `@deep-research`, `@deep-review`, `@code`, `@improve-agent`, `@improve-prompt`) — discovery shows they do NOT contain `cli-copilot` references in their bodies (any references would be in the dispatch YAML/MD command files at B4e). No edit needed.

<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

### DELETE_LIVE — Skill self (B1)

| Path | Files | Action |
|------|-------|--------|
| `.opencode/skills/cli-copilot/` | ~50+ (SKILL.md, README.md, graph-metadata.json, references/, assets/, scripts/, manual_testing_playbook/{01..08}__*/, changelog/v1.0..v1.3.7.md) | `rm -rf` entire tree |
| `.opencode/changelog/cli-copilot/` | global skill changelog | `rm -rf` entire tree |

### EDIT_LIVE — Skill advisor (B2)

| Path | Hit Lines | Action |
|------|-----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | ~12 lines (1398, 1468-1470, 1672-1681, 1708-1709, 2806-2808) | Remove TOKEN_BOOSTS["copilot"]; remove cli-copilot from PHRASE_BOOSTS keys; remove from delegate/opinion/validate routing tables; rewrite command-bridge tiebreaker prose to drop cli-copilot example |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | lines 9, 41, 49, 54, 66, 74, 157, 171, 206, 378 | Remove cli-copilot node entry, every related_to/coupling array entry, and the dedicated cli-copilot block at line 54 |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | line 13 | Remove the `{ "target": "cli-copilot", ... }` edge entry |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/check-prompt-quality-card-sync.sh` | line 16 | Drop the `$ROOT/.opencode/skills/cli-copilot/assets/prompt_quality_card.md` path from SYNC_PATHS |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | line 36 | Delete the P1-CLI-004 line entirely |

### EDIT_LIVE — Sibling cli-* skills (B3, 4 parallel agents)

| Skill | Files | Action |
|-------|-------|--------|
| cli-claude-code (B3a) | `SKILL.md`, `README.md`, `graph-metadata.json`, `manual_testing_playbook/manual_testing_playbook.md` | Scrub cli-copilot peer references |
| cli-codex (B3b) | `SKILL.md`, `README.md`, `graph-metadata.json` | Scrub cli-copilot peer references |
| cli-gemini (B3c) | `SKILL.md`, `README.md`, `graph-metadata.json` | Scrub cli-copilot peer references |
| cli-opencode (B3d) | `SKILL.md`, `README.md`, `graph-metadata.json`, `manual_testing_playbook/manual_testing_playbook.md`, `references/integration_patterns.md`, `references/opencode_tools.md`, `assets/prompt_templates.md`, `changelog/v1.0.0.0.md`, `changelog/v1.2.0.0.md`, `changelog/v1.3.0.0.md` | Scrub current-state peer list mentions; PRESERVE historical changelog mentions |

### EDIT_LIVE — Hooks + adapters + matrix runners (B1 deletes; B6a edits remaining)

| Path | Bucket | Action |
|------|--------|--------|
| `.github/hooks/spec-kit-copilot-hook.sh` | DELETE_LIVE | rm -f |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/` | DELETE_LIVE | rm -rf |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts` | DELETE_LIVE | rm -f |
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts` | DELETE_LIVE | rm -f |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` | EDIT_LIVE (B6a) | Remove import + dispatch wiring for cli-copilot adapter |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json` | EDIT_LIVE (B6a) | Remove cli-copilot adapter manifest entry |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/36-copilot-target-authority-helper.md` | DELETE_LIVE | rm -f (copilot-only feature) |
| `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md` | DELETE_LIVE | rm -f (copilot-only feature) |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/274-shared-provenance-and-copilot-compact-cache-parity.md` | DELETE_LIVE | rm -f (matches deleted feature_catalog entry) |
| `.opencode/skills/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/030-cli-copilot-target-authority-dispatch.md` | DELETE_LIVE | rm -f (cli-copilot-specific test scenario) |
| `.opencode/skills/deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/016-cli-copilot-target-authority-dispatch.md` | DELETE_LIVE | rm -f (cli-copilot-specific test scenario) |

<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

### PRESERVE_HISTORY (617 files — NO CHANGE)

These directories contain prior packets, ADRs, decision-records, deep-research/deep-review iteration archives, and other historical material. Each file documents past state and is NOT live config. Per project memory: "Legacy code/docs must be DELETED, not archived or commented out" applies to LIVE config; spec-folder history is record, not config.

| Directory | File Count |
|-----------|-----------|
| `.opencode/specs/system-spec-kit/` (all subpaths) | 401 |
| `.opencode/specs/skilled-agent-orchestration/` (excluding 081 itself) | 201 (incl. 075-cli-copilot-hallucination-caveat which documents prior cli-copilot quality concerns) |
| `.opencode/specs/z_future/` | 15 |
| **TOTAL PRESERVED** | **617** |

### ACTIVE — This packet

| Path | Status |
|------|--------|
| `.opencode/specs/cli-external-orchestration/014-cli-copilot-deprecation-due-to-price-hike/spec.md` | Authored |
| `.opencode/specs/skilled-agent-orchestration/081-.../plan.md` | Authored |
| `.opencode/specs/skilled-agent-orchestration/081-.../tasks.md` | Authored |
| `.opencode/specs/skilled-agent-orchestration/081-.../checklist.md` | Authored |
| `.opencode/specs/skilled-agent-orchestration/081-.../resource-map.md` | This file |
| `.opencode/specs/skilled-agent-orchestration/081-.../implementation-summary.md` | Created post-execution |
| `.opencode/specs/skilled-agent-orchestration/081-.../description.json` | Auto-generated by `generate-context.js` |
| `.opencode/specs/skilled-agent-orchestration/081-.../graph-metadata.json` | Auto-generated by `generate-context.js` |

### Phase parent metadata

| Path | Action |
|------|--------|
| `.opencode/specs/skilled-agent-orchestration/description.json` | Auto-refreshed by `/memory:save` (recently shows it contains a cli-copilot reference at line ~? — discovery shows `.opencode/specs/descriptions.json` has 1 hit; if any other top-level descriptions reference edit on `/memory:save` |
| `.opencode/specs/skilled-agent-orchestration/graph-metadata.json` | Auto-refreshed by `/memory:save` |

<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Bucket | Batch | Action |
|------|--------|-------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | EDIT_LIVE | B2 | (see Skills/Skill advisor) |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/check-prompt-quality-card-sync.sh` | EDIT_LIVE | B2 | (see Skills/Skill advisor) |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` | EDIT_LIVE | B6a | Drop cli-copilot adapter import + dispatch |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts` | DELETE_LIVE | B1 | rm -f |

<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Bucket | Batch | Action |
|------|--------|-------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts` | DELETE_LIVE | B1 | rm -f (its only adapter is being deleted) |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | EDIT_LIVE | B2 | Delete P1-CLI-004 line |

Workflow-invariance test (`workflow-invariance.vitest.ts`) — no edit anticipated; covered by P2 CHK-504.

<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Bucket | Batch | Action |
|------|--------|-------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | EDIT_LIVE | B2 | Remove cli-copilot edge |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | EDIT_LIVE | B2 | Remove cli-copilot node + edges |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json` | EDIT_LIVE | B6a | Remove cli-copilot adapter manifest entry |
| `.opencode/skills/cli-claude-code/graph-metadata.json` | EDIT_LIVE | B3a | Scrub cli-copilot peer entries |
| `.opencode/skills/cli-codex/graph-metadata.json` | EDIT_LIVE | B3b | Scrub cli-copilot peer entries |
| `.opencode/skills/cli-gemini/graph-metadata.json` | EDIT_LIVE | B3c | Scrub cli-copilot peer entries |
| `.opencode/skills/cli-opencode/graph-metadata.json` | EDIT_LIVE | B3d | Scrub cli-copilot peer entries |

### MIRROR_SYNC entries

Not separate config files — folded into B4 (multi-ai-council mirrors) and into runtime-specific paths under each runtime dir.

### ANNOTATE entry

| Path | Bucket | Batch | Action |
|------|--------|-------|--------|
| `memory/feedback_copilot_concurrency_override.md` | ANNOTATE | B7 | Prepend `# DEPRECATED 2026-05-06 — cli-copilot removed in packet 081-cli-copilot-deprecation-due-to-price-hike; rule kept for historical context only.` (single-line marker; do NOT delete the file) |

### POST_PROCESS entries

| Operation | Path | Batch |
|-----------|------|-------|
| `skill_advisor` rebuild | re-runs `skill_advisor.py` to refresh in-memory advisor scoring tables | B7 |
| `skill_graph_scan` | refreshes skill-graph index via MCP | B7 |
| `code_graph_scan` | refreshes code-graph index via MCP | B7 |

<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## Meta

- **Discovery captured:** `/tmp/cli-copilot-non-skill-hits.txt` (718 unique files; 617 PRESERVE_HISTORY in `specs/`; ~101 live config requiring action).
- **Discovery commands run:** 6 sweeps (4 grep × varying scopes, 1 find for filenames, 1 advisor-targeted grep).
- **Out-of-scope:** `node_modules/`, `dist/`, `.git/`, `z_archive/`, `memory/` (except for the single ANNOTATE entry), `.venv/`, `AGENTS_Barter.md` (symlink to separate Barter repo).
- **Vendor-code confirmation:** `mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/litellm/llms/github_copilot/` and `system-spec-kit/mcp_server/node_modules/@github/copilot-sdk/` are third-party packages — NOT touched.

<!-- /ANCHOR:meta -->
