---
title: "Research Record: Per-Runtime Reference Map for the Skilled Source-Root Move [deepseek-pi lineage]"
description: "The working map someone executing the .opencode -> .skilled move would use: Map A (435 symlinks with both required-target answers), Map B (231 runtime files plus home-level configuration), Map C (4,028 tracked files by area with file:line code citations), each reconciled against the seed inventory, then the UNKNOWNs."
trigger_phrases:
  - "per runtime symlink map"
  - "stale opencode path references"
  - "skilled reference map"
  - "runtime file path inventory"
importance_tier: "important"
contextType: "research"
---

# Per-Runtime Reference Map for the Skilled Source-Root Move — deepseek-pi lineage synthesis

**Scope.** The proposal moves the real files of this repository's shared AI asset library from `.opencode/` to `.skilled/`, and turns every runtime directory, `.opencode/` included, into a consumer linking into `.skilled/`. This synthesis is the working map of what has to change. It does not choose a layout and does not propose a cutover order; where a row's answer depends on whether a `.opencode` compatibility link survives, both answers are given.

**Evidence base.** The deterministic seed inventory (`scratch/seed-inventory/`: 435 links, 4,258 tracked files naming `.opencode` outside `specs/`, home-level counts) is treated as facts without meaning; phase 001's verified findings are treated as verified but incomplete. Every claim below was either read from the live tree or recomputed from the seed; the row-level tables, with long `file:line` citations and truncated constructs, live in `iterations/iteration-001.md` through `iteration-010.md`. Two source disagreements surfaced and were recorded rather than resolved silently (runtime `SYNC.md` manifests against the tree; the seed against the live tree by one file).

**How to read the classifications.** `mechanical` — a scripted retarget or path rewrite handles it; `regenerate` — produced by a named command, so rebuild it rather than edit it; `manual` — someone has to decide something; `freeze` — a historical record that must not be rewritten; `none` — names the path but needs no change, with the reason; `blocker` — cannot be done as proposed, with the reason.

---

## Map A — symlinks, one section per runtime

**How to read this map.** Each row gives the link path, its current raw target, the target it needs once the real files live under `.skilled/`, its origin, and its classification. The brief asks for both answers wherever the required target depends on whether a `.opencode` compatibility link survives, so the two columns are: **with compat** — every raw target that already traverses `.opencode/...` stays unchanged because the compatibility link keeps resolving; **without compat** — the required target is shown. For external-runtime cells the without-compat value is the exact recomputed relative path. Internal `.opencode` links show `unchanged (travels)` because the link object moves with its target tree at the same depth. `specs/` rows are historical and are shown without a rewrite. Labels: M = mechanical, R = regenerate, F = freeze, N = none, U = manual.

Full per-row tables with dangling/absolute columns and long origin citations are in `iterations/iteration-001.md` (`.claude`, `.codex`), `iteration-002.md` (`.cursor`, `.devin`, `.hermes`, `.pi`), and `iteration-003.md` (internal `.opencode`, `specs/`, root-level).

### Map A · `.claude` (57 links) — 57 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.claude/.utcp_config.json` | `../.utcp_config.json` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | hand-made | none |
| `.claude/commands/agent-router.md` | `../../.opencode/commands/agent-router.md` | unchanged | `../../.skilled/commands/agent-router.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/agent.md` | `../../../.opencode/commands/create/agent.md` | unchanged | `../../../.skilled/commands/create/agent.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/benchmark.md` | `../../../.opencode/commands/create/benchmark.md` | unchanged | `../../../.skilled/commands/create/benchmark.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/changelog.md` | `../../../.opencode/commands/create/changelog.md` | unchanged | `../../../.skilled/commands/create/changelog.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/command.md` | `../../../.opencode/commands/create/command.md` | unchanged | `../../../.skilled/commands/create/command.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/diff.md` | `../../../.opencode/commands/create/diff.md` | unchanged | `../../../.skilled/commands/create/diff.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/feature-catalog.md` | `../../../.opencode/commands/create/feature-catalog.md` | unchanged | `../../../.skilled/commands/create/feature-catalog.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/manual-testing-playbook.md` | `../../../.opencode/commands/create/manual-testing-playbook.md` | unchanged | `../../../.skilled/commands/create/manual-testing-playbook.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/readme.md` | `../../../.opencode/commands/create/readme.md` | unchanged | `../../../.skilled/commands/create/readme.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/repo-rule.md` | `../../../.opencode/commands/create/repo-rule.md` | unchanged | `../../../.skilled/commands/create/repo-rule.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/skill-parent.md` | `../../../.opencode/commands/create/skill-parent.md` | unchanged | `../../../.skilled/commands/create/skill-parent.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/skill.md` | `../../../.opencode/commands/create/skill.md` | unchanged | `../../../.skilled/commands/create/skill.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/create/with-human-voice.md` | `../../../.opencode/commands/create/with-human-voice.md` | unchanged | `../../../.skilled/commands/create/with-human-voice.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/deep/agent-improvement.md` | `../../../.opencode/commands/deep/agent-improvement.md` | unchanged | `../../../.skilled/commands/deep/agent-improvement.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/deep/ai-council.md` | `../../../.opencode/commands/deep/ai-council.md` | unchanged | `../../../.skilled/commands/deep/ai-council.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/deep/model-benchmark.md` | `../../../.opencode/commands/deep/model-benchmark.md` | unchanged | `../../../.skilled/commands/deep/model-benchmark.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/deep/research.md` | `../../../.opencode/commands/deep/research.md` | unchanged | `../../../.skilled/commands/deep/research.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/deep/review.md` | `../../../.opencode/commands/deep/review.md` | unchanged | `../../../.skilled/commands/deep/review.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/design/chart.md` | `../../../.opencode/commands/design/chart.md` | unchanged | `../../../.skilled/commands/design/chart.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/design/diagram.md` | `../../../.opencode/commands/design/diagram.md` | unchanged | `../../../.skilled/commands/design/diagram.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/design/extract.md` | `../../../.opencode/commands/design/extract.md` | unchanged | `../../../.skilled/commands/design/extract.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/doctor/mcp.md` | `../../../.opencode/commands/doctor/mcp.md` | unchanged | `../../../.skilled/commands/doctor/mcp.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/doctor/speckit.md` | `../../../.opencode/commands/doctor/speckit.md` | unchanged | `../../../.skilled/commands/doctor/speckit.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/doctor/update.md` | `../../../.opencode/commands/doctor/update.md` | unchanged | `../../../.skilled/commands/doctor/update.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/prompt/improve.md` | `../../../.opencode/commands/prompt/improve.md` | unchanged | `../../../.skilled/commands/prompt/improve.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/rewrite/response-by-external-agent.md` | `../../../.opencode/commands/rewrite/response-by-external-agent.md` | unchanged | `../../../.skilled/commands/rewrite/response-by-external-agent.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/rewrite/response.md` | `../../../.opencode/commands/rewrite/response.md` | unchanged | `../../../.skilled/commands/rewrite/response.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/speckit/complete.md` | `../../../.opencode/commands/speckit/complete.md` | unchanged | `../../../.skilled/commands/speckit/complete.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/speckit/implement.md` | `../../../.opencode/commands/speckit/implement.md` | unchanged | `../../../.skilled/commands/speckit/implement.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/speckit/plan.md` | `../../../.opencode/commands/speckit/plan.md` | unchanged | `../../../.skilled/commands/speckit/plan.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/speckit/resume.md` | `../../../.opencode/commands/speckit/resume.md` | unchanged | `../../../.skilled/commands/speckit/resume.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/speckit/save.md` | `../../../.opencode/commands/speckit/save.md` | unchanged | `../../../.skilled/commands/speckit/save.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/commands/speckit/search.md` | `../../../.opencode/commands/speckit/search.md` | unchanged | `../../../.skilled/commands/speckit/search.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/check-dist-staleness.sh` | `../../.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | unchanged | `../../.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/check-git-hooks.sh` | `../../.opencode/bin/check-git-hooks.sh` | unchanged | `../../.skilled/bin/check-git-hooks.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/claude-posttooluse.cjs` | `../../.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | unchanged | `../../.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/compact-inject.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/completion-evidence-stop.cjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/dispatch-audit-posttooluse.mjs` | `../../.opencode/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs` | unchanged | `../../.skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/dispatch-preflight-lint.mjs` | `../../.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | unchanged | `../../.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/fable-subagent-guard.mjs` | `../../.opencode/hooks/task-dispatch/claude/fable-subagent-guard.mjs` | unchanged | `../../.skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/git-live-follow.sh` | `../../.opencode/bin/git-live-follow.sh` | unchanged | `../../.skilled/bin/git-live-follow.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/git-preflight-advisory.mjs` | `../../.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | unchanged | `../../.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/git-primary-reconcile.sh` | `../../.opencode/bin/git-primary-reconcile.sh` | unchanged | `../../.skilled/bin/git-primary-reconcile.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/install-codex-hooks.mjs` | `../../.opencode/bin/install-codex-hooks.mjs` | unchanged | `../../.skilled/bin/install-codex-hooks.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/mcp-route-guard.cjs` | `../../.opencode/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` | unchanged | `../../.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/session-cleanup.sh` | `../../.opencode/scripts/session-cleanup.sh` | unchanged | `../../.skilled/scripts/session-cleanup.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/session-prime.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/session-stop.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/spec-gate-classify.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/spec-gate-enforce.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/task-dispatch-guard.cjs` | `../../.opencode/hooks/task-dispatch/claude/task-dispatch-guard.cjs` | unchanged | `../../.skilled/hooks/task-dispatch/claude/task-dispatch-guard.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/user-prompt-submit.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/hooks/worktree-guard.sh` | `../../.opencode/bin/worktree-guard.sh` | unchanged | `../../.skilled/bin/worktree-guard.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.claude/manual-testing-playbook` | `../.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook` | unchanged | `../.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook` | hand-made | mechanical |
| `.claude/skills` | `../.opencode/skills` | unchanged | `../.skilled/skills` | hand-made | mechanical |

### Map A · `.codex` (19 links) — 19 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.codex/hooks/check-dist-staleness.sh` | `../../.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | unchanged | `../../.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/check-git-hooks.sh` | `../../.opencode/bin/check-git-hooks.sh` | unchanged | `../../.skilled/bin/check-git-hooks.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/compact-inject.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/codex/compact-inject.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/compact-inject.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/completion-evidence-stop.cjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/dispatch-audit-posttooluse.mjs` | `../../.opencode/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs` | unchanged | `../../.skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/dispatch-preflight-lint.mjs` | `../../.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | unchanged | `../../.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/git-live-follow.sh` | `../../.opencode/bin/git-live-follow.sh` | unchanged | `../../.skilled/bin/git-live-follow.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/git-preflight-advisory.mjs` | `../../.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | unchanged | `../../.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/git-primary-reconcile.sh` | `../../.opencode/bin/git-primary-reconcile.sh` | unchanged | `../../.skilled/bin/git-primary-reconcile.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/mcp-route-guard.cjs` | `../../.opencode/hooks/mcp-route-guard/codex/mcp-route-guard.cjs` | unchanged | `../../.skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/post-edit-quality.cjs` | `../../.opencode/hooks/post-edit-quality/codex/post-edit-quality.cjs` | unchanged | `../../.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/session-cleanup.sh` | `../../.opencode/scripts/session-cleanup.sh` | unchanged | `../../.skilled/scripts/session-cleanup.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/session-start.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/session-stop.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/codex/session-stop.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-stop.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/spec-gate-classify.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/spec-gate-enforce.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/user-prompt-submit.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/hooks/worktree-guard.sh` | `../../.opencode/bin/worktree-guard.sh` | unchanged | `../../.skilled/bin/worktree-guard.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.codex/manual-testing-playbook` | `../.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook` | unchanged | `../.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook` | hand-made | mechanical |

### Map A · `.cursor` (65 links) — 65 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.cursor/agents/ai-council.md` | `../../.claude/agents/ai-council.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/code.md` | `../../.claude/agents/code.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/context.md` | `../../.claude/agents/context.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/debug.md` | `../../.claude/agents/debug.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/deep-improvement.md` | `../../.claude/agents/deep-improvement.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/deep-research.md` | `../../.claude/agents/deep-research.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/deep-review.md` | `../../.claude/agents/deep-review.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/design.md` | `../../.claude/agents/design.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/markdown.md` | `../../.claude/agents/markdown.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/orchestrate.md` | `../../.claude/agents/orchestrate.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/prompt-improver.md` | `../../.claude/agents/prompt-improver.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/agents/review.md` | `../../.claude/agents/review.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.cursor/commands/agent-router.md` | `../../.opencode/commands/agent-router.md` | unchanged | `../../.skilled/commands/agent-router.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-agent.md` | `../../.opencode/commands/create/agent.md` | unchanged | `../../.skilled/commands/create/agent.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-benchmark.md` | `../../.opencode/commands/create/benchmark.md` | unchanged | `../../.skilled/commands/create/benchmark.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-changelog.md` | `../../.opencode/commands/create/changelog.md` | unchanged | `../../.skilled/commands/create/changelog.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-command.md` | `../../.opencode/commands/create/command.md` | unchanged | `../../.skilled/commands/create/command.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-diff.md` | `../../.opencode/commands/create/diff.md` | unchanged | `../../.skilled/commands/create/diff.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-feature-catalog.md` | `../../.opencode/commands/create/feature-catalog.md` | unchanged | `../../.skilled/commands/create/feature-catalog.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-manual-testing-playbook.md` | `../../.opencode/commands/create/manual-testing-playbook.md` | unchanged | `../../.skilled/commands/create/manual-testing-playbook.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-readme.md` | `../../.opencode/commands/create/readme.md` | unchanged | `../../.skilled/commands/create/readme.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-repo-rule.md` | `../../.opencode/commands/create/repo-rule.md` | unchanged | `../../.skilled/commands/create/repo-rule.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-skill-parent.md` | `../../.opencode/commands/create/skill-parent.md` | unchanged | `../../.skilled/commands/create/skill-parent.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-skill.md` | `../../.opencode/commands/create/skill.md` | unchanged | `../../.skilled/commands/create/skill.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/create-with-human-voice.md` | `../../.opencode/commands/create/with-human-voice.md` | unchanged | `../../.skilled/commands/create/with-human-voice.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/deep-agent-improvement.md` | `../../.opencode/commands/deep/agent-improvement.md` | unchanged | `../../.skilled/commands/deep/agent-improvement.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/deep-ai-council.md` | `../../.opencode/commands/deep/ai-council.md` | unchanged | `../../.skilled/commands/deep/ai-council.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/deep-model-benchmark.md` | `../../.opencode/commands/deep/model-benchmark.md` | unchanged | `../../.skilled/commands/deep/model-benchmark.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/deep-research.md` | `../../.opencode/commands/deep/research.md` | unchanged | `../../.skilled/commands/deep/research.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/deep-review.md` | `../../.opencode/commands/deep/review.md` | unchanged | `../../.skilled/commands/deep/review.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/design-chart.md` | `../../.opencode/commands/design/chart.md` | unchanged | `../../.skilled/commands/design/chart.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/design-diagram.md` | `../../.opencode/commands/design/diagram.md` | unchanged | `../../.skilled/commands/design/diagram.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/design-extract.md` | `../../.opencode/commands/design/extract.md` | unchanged | `../../.skilled/commands/design/extract.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/doctor-mcp.md` | `../../.opencode/commands/doctor/mcp.md` | unchanged | `../../.skilled/commands/doctor/mcp.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/doctor-speckit.md` | `../../.opencode/commands/doctor/speckit.md` | unchanged | `../../.skilled/commands/doctor/speckit.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/doctor-update.md` | `../../.opencode/commands/doctor/update.md` | unchanged | `../../.skilled/commands/doctor/update.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/prompt-improve.md` | `../../.opencode/commands/prompt/improve.md` | unchanged | `../../.skilled/commands/prompt/improve.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/rewrite-response-by-external-agent.md` | `../../.opencode/commands/rewrite/response-by-external-agent.md` | unchanged | `../../.skilled/commands/rewrite/response-by-external-agent.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/rewrite-response.md` | `../../.opencode/commands/rewrite/response.md` | unchanged | `../../.skilled/commands/rewrite/response.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/speckit-complete.md` | `../../.opencode/commands/speckit/complete.md` | unchanged | `../../.skilled/commands/speckit/complete.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/speckit-implement.md` | `../../.opencode/commands/speckit/implement.md` | unchanged | `../../.skilled/commands/speckit/implement.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/speckit-plan.md` | `../../.opencode/commands/speckit/plan.md` | unchanged | `../../.skilled/commands/speckit/plan.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/speckit-resume.md` | `../../.opencode/commands/speckit/resume.md` | unchanged | `../../.skilled/commands/speckit/resume.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/speckit-save.md` | `../../.opencode/commands/speckit/save.md` | unchanged | `../../.skilled/commands/speckit/save.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/commands/speckit-search.md` | `../../.opencode/commands/speckit/search.md` | unchanged | `../../.skilled/commands/speckit/search.md` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/check-dist-staleness.sh` | `../../.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | unchanged | `../../.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/check-git-hooks.sh` | `../../.opencode/bin/check-git-hooks.sh` | unchanged | `../../.skilled/bin/check-git-hooks.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/dispatch-preflight-lint.mjs` | `../../.opencode/hooks/dispatch/cursor/dispatch-preflight-lint.mjs` | unchanged | `../../.skilled/hooks/dispatch/cursor/dispatch-preflight-lint.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/git-preflight-advisory.mjs` | `../../.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | unchanged | `../../.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/goal-inject.mjs` | `../../.opencode/hooks/goal/cursor/goal-inject.mjs` | unchanged | `../../.skilled/hooks/goal/cursor/goal-inject.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/install-codex-hooks.mjs` | `../../.opencode/bin/install-codex-hooks.mjs` | unchanged | `../../.skilled/bin/install-codex-hooks.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/mcp-route-guard.mjs` | `../../.opencode/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | unchanged | `../../.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/post-tool-use.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/precompact.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/cursor/precompact.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/precompact.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/session-cleanup.sh` | `../../.opencode/scripts/session-cleanup.sh` | unchanged | `../../.skilled/scripts/session-cleanup.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/session-end.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/cursor/session-end.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-end.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/session-start.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/cursor/session-start.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-start.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/spec-gate-classify.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/spec-gate-enforce.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/spec-gate-prebind.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/task-dispatch-guard.mjs` | `../../.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | unchanged | `../../.skilled/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/user-prompt-submit.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/hooks/worktree-guard.sh` | `../../.opencode/bin/worktree-guard.sh` | unchanged | `../../.skilled/bin/worktree-guard.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.cursor/manual-testing-playbook` | `../.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook` | unchanged | `../.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook` | hand-made | mechanical |
| `.cursor/rules/sk-vision.md` | `../../.opencode/skills/sk-vision/hooks/cursor/vision-rule.md` | unchanged | `../../.skilled/skills/sk-vision/hooks/cursor/vision-rule.md` | hand-made | mechanical |

### Map A · `.devin` (34 links) — 34 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.devin/agents/ai-council/AGENT.md` | `../../../.claude/agents/ai-council.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/code/AGENT.md` | `../../../.claude/agents/code.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/context/AGENT.md` | `../../../.claude/agents/context.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/debug/AGENT.md` | `../../../.claude/agents/debug.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/deep-improvement/AGENT.md` | `../../../.claude/agents/deep-improvement.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/deep-research/AGENT.md` | `../../../.claude/agents/deep-research.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/deep-review/AGENT.md` | `../../../.claude/agents/deep-review.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/design/AGENT.md` | `../../../.claude/agents/design.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/markdown/AGENT.md` | `../../../.claude/agents/markdown.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/orchestrate/AGENT.md` | `../../../.claude/agents/orchestrate.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/prompt-improver/AGENT.md` | `../../../.claude/agents/prompt-improver.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/agents/review/AGENT.md` | `../../../.claude/agents/review.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | generated: sync-runtime-mirrors.cjs | none |
| `.devin/hooks/check-dist-staleness.sh` | `../../.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | unchanged | `../../.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/check-git-hooks.sh` | `../../.opencode/bin/check-git-hooks.sh` | unchanged | `../../.skilled/bin/check-git-hooks.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/completion-evidence-stop.cjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/dispatch-audit-posttooluse.mjs` | `../../.opencode/hooks/dispatch/devin/dispatch-audit-posttooluse.mjs` | unchanged | `../../.skilled/hooks/dispatch/devin/dispatch-audit-posttooluse.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/dispatch-preflight-lint.mjs` | `../../.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | unchanged | `../../.skilled/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/git-preflight-advisory.mjs` | `../../.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | unchanged | `../../.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/goal-inject.mjs` | `../../.opencode/hooks/goal/devin/goal-inject.mjs` | unchanged | `../../.skilled/hooks/goal/devin/goal-inject.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/install-codex-hooks.mjs` | `../../.opencode/bin/install-codex-hooks.mjs` | unchanged | `../../.skilled/bin/install-codex-hooks.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/mcp-route-guard.cjs` | `../../.opencode/hooks/mcp-route-guard/devin/mcp-route-guard.cjs` | unchanged | `../../.skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/permission-request-policy.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/post-compaction.cjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/post-edit-quality.cjs` | `../../.opencode/hooks/post-edit-quality/devin/post-edit-quality.cjs` | unchanged | `../../.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/session-cleanup.sh` | `../../.opencode/scripts/session-cleanup.sh` | unchanged | `../../.skilled/scripts/session-cleanup.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/session-start.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/devin/session-start.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-start.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/session-stop.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/devin/session-stop.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-stop.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/sk-vision.mjs` | `../../.opencode/hooks/sk-vision/devin/sk-vision.mjs` | unchanged | `../../.skilled/skills/sk-vision/hooks/devin/sk-vision.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/spec-gate-classify.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/spec-gate-enforce.mjs` | `../../.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/task-dispatch-guard.cjs` | `../../.opencode/hooks/task-dispatch/devin/task-dispatch-guard.cjs` | unchanged | `../../.skilled/hooks/task-dispatch/devin/task-dispatch-guard.cjs` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/user-prompt-submit.js` | `../../.opencode/skills/system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/hooks/worktree-guard.sh` | `../../.opencode/bin/worktree-guard.sh` | unchanged | `../../.skilled/bin/worktree-guard.sh` | generated: sync-runtime-mirrors.cjs | regenerate |
| `.devin/manual-testing-playbook` | `../.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook` | unchanged | `../.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook` | hand-made | mechanical |

### Map A · `.hermes` (2 links) — 2 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.hermes/agents` | `../.opencode/agents` | unchanged | `../.skilled/agents` | hand-made | mechanical |
| `.hermes/manual-testing-playbook` | `../.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook` | unchanged | `../.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook` | hand-made | mechanical |

### Map A · `.pi` (19 links) — 19 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.pi/extensions/completion-evidence.ts` | `../../.opencode/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts` | hand-made | mechanical |
| `.pi/extensions/dispatch-audit.ts` | `../../.opencode/hooks/dispatch/pi/dispatch-audit.ts` | unchanged | `../../.skilled/hooks/dispatch/pi/dispatch-audit.ts` | hand-made | mechanical |
| `.pi/extensions/dispatch-preflight-lint.ts` | `../../.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | unchanged | `../../.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | hand-made | mechanical |
| `.pi/extensions/git-preflight-advisory.ts` | `../../.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | unchanged | `../../.skilled/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | hand-made | mechanical |
| `.pi/extensions/goal-context.ts` | `../../.opencode/hooks/goal/pi/goal-context.ts` | unchanged | `../../.skilled/hooks/goal/pi/goal-context.ts` | hand-made | mechanical |
| `.pi/extensions/lib/claude-hook-adapter.ts` | `../../../.opencode/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts` | unchanged | `../../../.skilled/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts` | hand-made | mechanical |
| `.pi/extensions/mcp-route-guard.ts` | `../../.opencode/hooks/mcp-route-guard/pi/mcp-route-guard.ts` | unchanged | `../../.skilled/hooks/mcp-route-guard/pi/mcp-route-guard.ts` | hand-made | mechanical |
| `.pi/extensions/post-edit-quality.ts` | `../../.opencode/hooks/post-edit-quality/pi/post-edit-quality.ts` | unchanged | `../../.skilled/hooks/post-edit-quality/pi/post-edit-quality.ts` | hand-made | mechanical |
| `.pi/extensions/prompt-advisor.ts` | `../../.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | unchanged | `../../.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | hand-made | mechanical |
| `.pi/extensions/session-compact-context.ts` | `../../.opencode/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | hand-made | mechanical |
| `.pi/extensions/session-start-advisories.ts` | `../../.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | hand-made | mechanical |
| `.pi/extensions/session-start-context.ts` | `../../.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts` | hand-made | mechanical |
| `.pi/extensions/session-stop-context.ts` | `../../.opencode/skills/system-spec-kit/runtime/hooks/pi/session-stop-context.ts` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/pi/session-stop-context.ts` | hand-made | mechanical |
| `.pi/extensions/sk-vision.ts` | `../../.opencode/skills/sk-vision/hooks/pi/sk-vision.ts` | unchanged | `../../.skilled/skills/sk-vision/hooks/pi/sk-vision.ts` | hand-made | mechanical |
| `.pi/extensions/spec-gate-classify.ts` | `../../.opencode/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts` | hand-made | mechanical |
| `.pi/extensions/spec-gate-enforce.ts` | `../../.opencode/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts` | unchanged | `../../.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts` | hand-made | mechanical |
| `.pi/extensions/task-dispatch-guard.ts` | `../../.opencode/hooks/task-dispatch/pi/task-dispatch-guard.ts` | unchanged | `../../.skilled/hooks/task-dispatch/pi/task-dispatch-guard.ts` | hand-made | mechanical |
| `.pi/manual-testing-playbook` | `../.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook` | unchanged | `../.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook` | hand-made | mechanical |
| `.pi/skills` | `../.opencode/skills` | unchanged | `../.skilled/skills` | hand-made | mechanical |

### Map A · internal `.opencode` — hooks index (101 links) — 101 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.opencode/hooks/codex-watchdog/opencode/codex-hooks-watchdog.js` | `../../../plugins/codex-hooks-watchdog.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/completion/claude/completion-evidence-stop.cjs` | `../../../skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/completion/codex/completion-evidence-stop.cjs` | `../../../skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/completion/cursor/completion-evidence-response.mjs` | `../../../skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/completion/devin/completion-evidence-stop.cjs` | `../../../skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/completion/opencode/system-completion-sentinel.js` | `../../../plugins/system-completion-sentinel.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/completion/opencode/system-speckit-completion.js` | `../../../plugins/system-speckit-completion.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/completion/pi/completion-evidence.ts` | `../../../skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/directive-lifecycle/claude/directive-lifecycle-boundary.ts` | `../../../skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/directive-lifecycle/claude/speckit-directive-lifecycle-boundary.ts` | `../../../skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/dispatch/cursor/post-tool-use.mjs` | `../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/dispatch/opencode/cli-dispatch-audit.js` | `../../../plugins/cli-dispatch-audit.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/dist-freshness/claude/check-dist-staleness.sh` | `../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/dist-freshness/codex/check-dist-staleness.sh` | `../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/dist-freshness/cursor/check-dist-staleness.sh` | `../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/dist-freshness/devin/check-dist-staleness.sh` | `../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/dist-freshness/opencode/system-dist-freshness-guard.js` | `../../../plugins/system-dist-freshness-guard.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-hooks-check/claude/check-git-hooks.sh` | `../../../bin/check-git-hooks.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-hooks-check/codex/check-git-hooks.sh` | `../../../bin/check-git-hooks.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-hooks-check/cursor/check-git-hooks.sh` | `../../../bin/check-git-hooks.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-hooks-check/devin/check-git-hooks.sh` | `../../../bin/check-git-hooks.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-preflight/README.md` | `../../skills/sk-git/scripts/hooks/README.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-preflight/opencode/sk-git-preflight-advisory.js` | `../../../plugins/sk-git-preflight-advisory.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-preflight/pi/git-preflight-advisory.ts` | `../../../skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-preflight/shared/git-preflight-advisory.mjs` | `../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-primary-reconcile/claude/git-primary-reconcile.sh` | `../../../bin/git-primary-reconcile.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-primary-reconcile/codex/git-primary-reconcile.sh` | `../../../bin/git-primary-reconcile.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-primary-reconcile/pi/git-primary-reconcile.sh` | `../../../bin/git-primary-reconcile.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-worktree-guard/claude/worktree-guard.sh` | `../../../bin/worktree-guard.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-worktree-guard/codex/worktree-guard.sh` | `../../../bin/worktree-guard.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-worktree-guard/cursor/worktree-guard.sh` | `../../../bin/worktree-guard.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/git-worktree-guard/devin/worktree-guard.sh` | `../../../bin/worktree-guard.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/goal/opencode/opencode-goal.js` | `../../../plugins/opencode-goal.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/hook-install/claude/install-codex-hooks.mjs` | `../../../bin/install-codex-hooks.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/hook-install/cursor/install-codex-hooks.mjs` | `../../../bin/install-codex-hooks.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/hook-install/devin/install-codex-hooks.mjs` | `../../../bin/install-codex-hooks.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/mcp-route-guard/opencode/mcp-route-guard.js` | `../../../plugins/mcp-route-guard.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/permission-policy/devin/permission-request-policy.mjs` | `../../../skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/post-edit-quality/cursor/post-tool-use.mjs` | `../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/post-edit-quality/opencode/sk-code-post-edit-quality.js` | `../../../plugins/sk-code-post-edit-quality.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-cleanup/claude/session-cleanup.sh` | `../../../scripts/session-cleanup.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-cleanup/codex/session-cleanup.sh` | `../../../scripts/session-cleanup.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-cleanup/cursor/session-cleanup.sh` | `../../../scripts/session-cleanup.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-cleanup/devin/session-cleanup.sh` | `../../../scripts/session-cleanup.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-cleanup/opencode/session-cleanup.js` | `../../../plugins/session-cleanup.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/claude/compact-inject.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/claude/compact-inject.ts` | `../../../skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/claude/session-prime.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/claude/session-prime.ts` | `../../../skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/claude/session-stop.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/claude/session-stop.ts` | `../../../skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/codex/compact-inject.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/codex/compact-inject.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/codex/compact-inject.ts` | `../../../skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/codex/session-start.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/codex/session-start.ts` | `../../../skills/system-spec-kit/runtime/hooks/codex/session-start.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/codex/session-stop.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/codex/session-stop.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/codex/session-stop.ts` | `../../../skills/system-spec-kit/runtime/hooks/codex/session-stop.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/cursor/precompact.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/cursor/precompact.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/cursor/precompact.ts` | `../../../skills/system-spec-kit/runtime/hooks/cursor/precompact.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/cursor/session-end.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/cursor/session-end.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/cursor/session-end.ts` | `../../../skills/system-spec-kit/runtime/hooks/cursor/session-end.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/cursor/session-start.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/cursor/session-start.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/cursor/session-start.ts` | `../../../skills/system-spec-kit/runtime/hooks/cursor/session-start.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/devin/post-compaction.cjs` | `../../../skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/devin/session-start.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/devin/session-start.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/devin/session-start.ts` | `../../../skills/system-spec-kit/runtime/hooks/devin/session-start.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/devin/session-stop.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/devin/session-stop.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/devin/session-stop.ts` | `../../../skills/system-spec-kit/runtime/hooks/devin/session-stop.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/pi/session-compact-context.ts` | `../../../skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/pi/session-start-advisories.ts` | `../../../skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/pi/session-start-context.ts` | `../../../skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/session-lifecycle/pi/session-stop-context.ts` | `../../../skills/system-spec-kit/runtime/hooks/pi/session-stop-context.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/sk-vision/devin/sk-vision.mjs` | `../../../skills/sk-vision/hooks/devin/sk-vision.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/sk-vision/opencode/sk-vision.ts` | `../../../skills/sk-vision/hooks/opencode/sk-vision.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/sk-vision/pi/sk-vision.ts` | `../../../skills/sk-vision/hooks/pi/sk-vision.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/README.md` | `../../skills/system-skill-advisor/hooks/skill-advisor-hook.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/claude/speckit-user-prompt-submit.ts` | `../../../skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/claude/user-prompt-submit.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/claude/user-prompt-submit.ts` | `../../../skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/codex/user-prompt-submit.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/codex/user-prompt-submit.ts` | `../../../skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/cursor/user-prompt-submit.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/cursor/user-prompt-submit.ts` | `../../../skills/system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/devin/user-prompt-submit.js` | `../../../skills/system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/devin/user-prompt-submit.ts` | `../../../skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/opencode/system-skill-advisor.js` | `../../../plugins/system-skill-advisor.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/skill-advisor/pi/prompt-advisor.ts` | `../../../skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/README.md` | `../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/claude/spec-gate-classify.mjs` | `../../../skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/claude/spec-gate-enforce.mjs` | `../../../skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/codex/spec-gate-classify.mjs` | `../../../skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/codex/spec-gate-enforce.mjs` | `../../../skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/cursor/spec-gate-classify.mjs` | `../../../skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/cursor/spec-gate-enforce.mjs` | `../../../skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/cursor/spec-gate-prebind.mjs` | `../../../skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/devin/spec-gate-classify.mjs` | `../../../skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/devin/spec-gate-enforce.mjs` | `../../../skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/opencode/system-spec-gate.js` | `../../../plugins/system-spec-gate.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/pi/spec-gate-classify.ts` | `../../../skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/spec-gate/pi/spec-gate-enforce.ts` | `../../../skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/hooks/task-dispatch/opencode/system-deep-loop-guard.js` | `../../../plugins/system-deep-loop-guard.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |

### Map A · internal `.opencode` — changelog index (49 links) — 49 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.opencode/changelog/cli-external-orchestration/cli-claude-code` | `../../skills/cli-external-orchestration/cli-claude-code/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/cli-external-orchestration/cli-codex` | `../../skills/cli-external-orchestration/cli-codex/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/cli-external-orchestration/cli-opencode` | `../../skills/cli-external-orchestration/cli-opencode/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/cli-external-orchestration/parent` | `../../skills/cli-external-orchestration/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-code-mode` | `../skills/mcp-code-mode/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-aside-devtools` | `../../skills/mcp-tooling/mcp-aside-devtools/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-chrome-devtools` | `../../skills/mcp-tooling/mcp-chrome-devtools/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-click-up` | `../../skills/mcp-tooling/mcp-click-up/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-figma` | `../../skills/mcp-tooling/mcp-figma/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-magicpath` | `../../skills/mcp-tooling/mcp-magicpath/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-mobbin` | `../../skills/mcp-tooling/mcp-mobbin/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-notion` | `../../skills/mcp-tooling/mcp-notion/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-obsidian` | `../../skills/mcp-tooling/mcp-obsidian/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/mcp-refero` | `../../skills/mcp-tooling/mcp-refero/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/mcp-tooling/parent` | `../../skills/mcp-tooling/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-code/code-mobile-cli` | `../../skills/sk-code/sk-code-mobile-cli/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-code/code-obsidian` | `../../skills/sk-code/sk-code-obsidian/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-code/code-opencode` | `../../skills/sk-code/sk-code-opencode/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-code/code-quality` | `../../skills/sk-code/sk-code-quality/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-code/code-review` | `../../skills/sk-code/sk-code-review/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-code/code-webflow` | `../../skills/sk-code/sk-code-webflow/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-code/parent` | `../../skills/sk-code/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-communication` | `../skills/sk-communication/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-design` | `../skills/sk-design/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-design-md-generator` | `../skills/sk-design-md-generator/changelog` | `unchanged (resolves through .opencode compatibility link)` | already dangling today: unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-agent` | `../../skills/sk-doc/sk-create-agent/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-benchmark` | `../../skills/sk-doc/sk-create-benchmark/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-changelog` | `../../skills/sk-doc/sk-create-changelog/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-command` | `../../skills/sk-doc/sk-create-command/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-diagram` | `../../skills/sk-doc/sk-create-diagram/changelog` | `unchanged (resolves through .opencode compatibility link)` | already dangling today: unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-diff` | `../../skills/sk-doc/sk-create-diff/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-feature-catalog` | `../../skills/sk-doc/sk-create-feature-catalog/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-manual-testing-playbook` | `../../skills/sk-doc/sk-create-manual-testing-playbook/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-quality-control` | `../../skills/sk-doc/sk-create-quality-control/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-readme` | `../../skills/sk-doc/sk-create-readme/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-repo-rule` | `../../skills/sk-doc/sk-create-repo-rule/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/create-skill` | `../../skills/sk-doc/sk-create-skill/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-doc/parent` | `../../skills/sk-doc/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-git` | `../skills/sk-git/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-prompt` | `../skills/sk-prompt/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/sk-vision` | `../skills/sk-vision/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/system-deep-loop/deep-ai-council` | `../../skills/system-deep-loop/deep-ai-council/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/system-deep-loop/deep-improvement` | `../../skills/system-deep-loop/deep-improvement/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/system-deep-loop/deep-research` | `../../skills/system-deep-loop/deep-research/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/system-deep-loop/deep-review` | `../../skills/system-deep-loop/deep-review/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/system-deep-loop/parent` | `../../skills/system-deep-loop/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/system-deep-loop/runtime` | `../../skills/system-deep-loop/runtime/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/system-skill-advisor` | `../skills/system-skill-advisor/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/changelog/system-spec-kit` | `../skills/system-spec-kit/changelog` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |

### Map A · internal `.opencode` — skill trees (50 links) — 50 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/mcp-server/README.md` | `../README.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/references/workflow-debug.md` | `../../shared/references/workflow-debug.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/references/workflow-implement.md` | `../../shared/references/workflow-implement.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-mobile-cli/references/workflow-verify.md` | `../../shared/references/workflow-verify.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/references/workflow-debug.md` | `../../shared/references/workflow-debug.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/references/workflow-implement.md` | `../../shared/references/workflow-implement.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-obsidian/references/workflow-verify.md` | `../../shared/references/workflow-verify.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/workflow-debug.md` | `../../shared/references/workflow-debug.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/workflow-implement.md` | `../../shared/references/workflow-implement.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-opencode/references/workflow-verify.md` | `../../shared/references/workflow-verify.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/workflow-debug.md` | `../../shared/references/workflow-debug.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/workflow-implement.md` | `../../shared/references/workflow-implement.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-code/sk-code-webflow/references/workflow-verify.md` | `../../shared/references/workflow-verify.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/audit_readmes.py` | `../sk-create-readme/scripts/audit_readmes.py` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/check-frontmatter-versions.sh` | `../shared/scripts/check-frontmatter-versions.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/check_no_numbered_categories.py` | `../shared/scripts/check_no_numbered_categories.py` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/extract_structure.py` | `../shared/scripts/extract_structure.py` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/frontmatter-version.mjs` | `../shared/scripts/frontmatter-version.mjs` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/init_skill.py` | `../sk-create-skill/scripts/init_skill.py` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/package_skill.py` | `../sk-create-skill/scripts/package_skill.py` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/quick_validate.py` | `../shared/scripts/quick_validate.py` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/validate-flowchart.sh` | `../sk-create-diagram/scripts/validate-flowchart.sh` | `unchanged (resolves through .opencode compatibility link)` | already dangling today: unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | `../shared/scripts/validate_document.py` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-doc/scripts/validate_skill_package.py` | `../sk-create-skill/scripts/validate_skill_package.py` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/sk-git/scripts/hooks/opencode/sk-git-preflight-advisory.js` | `../../../../../plugins/sk-git-preflight-advisory.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/.cursor/agents/cp-improve-target.md` | `../../.claude/agents/cp-improve-target.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/.devin/agents/cp-improve-target/AGENT.md` | `../../../.claude/agents/cp-improve-target.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-skill-advisor/runtime/lib/shared/embeddings` | `../../../../system-spec-kit/shared/embeddings` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/runtime` | `../dist` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | build artifact (dist) | regenerate |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/054-template-extra-header/implementation-summary.md` | `../053-template-compliant-level2/implementation-summary.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/054-template-extra-header/plan.md` | `../053-template-compliant-level2/plan.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/054-template-extra-header/tasks.md` | `../053-template-compliant-level2/tasks.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/055-template-missing-header/implementation-summary.md` | `../053-template-compliant-level2/implementation-summary.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/055-template-missing-header/plan.md` | `../053-template-compliant-level2/plan.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/055-template-missing-header/tasks.md` | `../053-template-compliant-level2/tasks.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/056-template-reordered-header/implementation-summary.md` | `../053-template-compliant-level2/implementation-summary.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/056-template-reordered-header/plan.md` | `../053-template-compliant-level2/plan.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/056-template-reordered-header/tasks.md` | `../053-template-compliant-level2/tasks.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/057-template-missing-anchor/implementation-summary.md` | `../053-template-compliant-level2/implementation-summary.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/057-template-missing-anchor/plan.md` | `../053-template-compliant-level2/plan.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/057-template-missing-anchor/tasks.md` | `../053-template-compliant-level2/tasks.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/058-template-reordered-anchor/implementation-summary.md` | `../053-template-compliant-level2/implementation-summary.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/058-template-reordered-anchor/plan.md` | `../053-template-compliant-level2/plan.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/058-template-reordered-anchor/tasks.md` | `../053-template-compliant-level2/tasks.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/061-template-optional-absent/implementation-summary.md` | `../053-template-compliant-level2/implementation-summary.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/061-template-optional-absent/plan.md` | `../053-template-compliant-level2/plan.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/061-template-optional-absent/tasks.md` | `../053-template-compliant-level2/tasks.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/test-fixtures` | `../test-fixtures` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/hooks/opencode/system-spec-gate.js` | `../../../../../plugins/system-spec-gate.js` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/skills/system-spec-kit/runtime/shared` | `../shared/dist` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | build artifact (dist) | regenerate |

### Map A · internal `.opencode` — install guides (5 links) — 5 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.opencode/install-guides/MCP - Chrome Dev Tools.md` | `../skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/install-guides/MCP - Code Mode.md` | `../skills/mcp-code-mode/INSTALL-GUIDE.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/install-guides/MCP - Skill Advisor.md` | `../skills/system-skill-advisor/INSTALL-GUIDE.md` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/install-guides/install-scripts/install-chrome-devtools.sh` | `../../skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/install-guides/install-scripts/install-code-mode.sh` | `../../skills/mcp-code-mode/scripts/install.sh` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |

### Map A · internal `.opencode` — other (2 links) — 2 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.opencode/manual-testing-playbook` | `skills/cli-external-orchestration/cli-opencode/manual-testing-playbook` | `unchanged (resolves through .opencode compatibility link)` | unchanged (link and target travel together into .skilled/) | hand-made | mechanical |
| `.opencode/specs` | `../specs` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | hand-made | none |

### Map A · internal `.opencode` — plugins (1 link) — 1 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.opencode/plugins/sk-vision.js` | `../skills/sk-vision/vision-runtime/dist/plugin.js` | `unchanged (resolves through .opencode compatibility link)` | already dangling today: unchanged (link and target travel together into .skilled/) | build artifact (dist) | regenerate |

### Map A · `specs/` (29 links) — 29 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/.reducer-spec/research` | `..` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/accessibility` | `../../.agents/skills/accessibility` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/animation-vocabulary` | `../../.agents/skills/animation-vocabulary` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/composition-patterns` | `../../.agents/skills/composition-patterns` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/copywriting` | `../../.agents/skills/copywriting` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/emil-design-eng` | `../../.agents/skills/emil-design-eng` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/frontend-design` | `../../.agents/skills/frontend-design` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/hallmark` | `../../.agents/skills/hallmark` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/improve` | `../../.agents/skills/improve` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/nodejs-backend-patterns` | `../../.agents/skills/nodejs-backend-patterns` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/nodejs-best-practices` | `../../.agents/skills/nodejs-best-practices` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/react-best-practices` | `../../.agents/skills/react-best-practices` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/review-animations` | `../../.agents/skills/review-animations` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/seo` | `../../.agents/skills/seo` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/seo-audit` | `../../.agents/skills/seo-audit` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/setup-matt-pocock-skills` | `../../.agents/skills/setup-matt-pocock-skills` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/shadcn` | `../../.agents/skills/shadcn` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/tailwind-css-patterns` | `../../.agents/skills/tailwind-css-patterns` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/tailwind-v4-shadcn` | `../../.agents/skills/tailwind-v4-shadcn` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/typescript-advanced-types` | `../../.agents/skills/typescript-advanced-types` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/.claude/skills/zod` | `../../.agents/skills/zod` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-worktree-global-hooks/global-hooks/pre-commit` | `/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-worktree-global-hooks/installer-repo/.opencode/scripts/git-hooks/pre-commit` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/system-deep-loop/036-deep-loop-innovation/changelog.md` | `changelog/changelog-036-root.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/hostile/ws/specs/t/002-escape` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/hostile/outside` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/hostile/ws/specs/t/003-file` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/hostile/outside/goal.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/ws-alias` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/ws` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/system-speckit/z_archive/022-hybrid-rag-fusion/feature_catalog` | `../../../../.opencode/skills/system-spec-kit/feature-catalog` | unchanged | `../../../../.skilled/skills/system-spec-kit/feature-catalog` | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/system-speckit/z_archive/022-hybrid-rag-fusion/manual_testing_playbook` | `../../../../.opencode/skills/system-spec-kit/manual-testing-playbook` | unchanged | `../../../../.skilled/skills/system-spec-kit/manual-testing-playbook` | historical run artifact inside specs/ (frozen record) | freeze |
| `specs/system-speckit/z_archive/022-hybrid-rag-fusion/system-spec-kit` | `../../../../.opencode/skills/system-spec-kit` | unchanged | `../../../../.skilled/skills/system-spec-kit` | historical run artifact inside specs/ (frozen record) | freeze |

### Map A · root-level (2 links) — 2 links

| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |
|---|---|---|---|---|---|
| `.mcp.json` | `.claude/mcp.json` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | hand-made | none |
| `CLAUDE.md` | `AGENTS.md` | `unchanged (target outside .opencode does not move)` | unchanged (target outside .opencode does not move) | hand-made | none |


### Map A reconciliation against the seed

| Root | Seed links | Rows mapped | Into `.opencode` | Unmapped |
|---|---:|---:|---:|---|
| `.claude` | 57 | 57 | 56 | none |
| `.codex` | 19 | 19 | 19 | none |
| `.cursor` | 65 | 65 | 53 | none |
| `.devin` | 34 | 34 | 22 | none |
| `.hermes` | 2 | 2 | 2 | none |
| `.pi` | 19 | 19 | 19 | none |
| internal `.opencode` (non-`node_modules`) | 208 | 208 | 208 | none |
| `specs/` | 29 | 29 | 3 | none |
| root-level (`.mcp.json`, `CLAUDE.md`) | 2 | 2 | 0 | none |
| **Total** | **435** | **435** | **382** | **none** |

Live re-measurement in iteration 9 reproduced every root count exactly, and the `.opencode` path list diffed to empty against the seed (the 258 live internal links include 50 dependency-vendored links under `node_modules` that the seed deliberately excludes).

**Ownership.** 168 of the 435 links are produced by one generator, `sync-runtime-mirrors.cjs`: `.claude` commands 33 and hooks 21, `.codex` hooks 18, `.cursor` agents 12 + commands 33 + hooks 18, `.devin` agents 12 + hooks 21. Of those, 24 (the Cursor and Devin agent mirrors) target `.claude/agents`, which does not move, so their class is `none`. Three more rows are build-artifact links (`sk-vision` plugin, spec-kit `runtime` and `shared` dist links) and the remaining 264 are hand-made index/whole-directory/reference links.

**Classification totals.** `regenerate` 147 (144 mirror-generated + 3 build links), `mechanical` 231, `none` 28 (24 agent mirrors + `.utcp_config.json` + `.opencode/specs` + both root-level links), `freeze` 29 (`specs/` history). Sum 435.

**The four already-broken links are named, not counted as migration breakage:** `.opencode/changelog/sk-design-md-generator`, `.opencode/changelog/sk-doc/create-diagram`, `.opencode/skills/sk-doc/scripts/validate-flowchart.sh`, `.opencode/plugins/sk-vision.js` (dist unbuilt). All four are in the seed's `dangling=yes` column and are classed `manual` (retire or restore; a decision, not a retarget), except the plugin link, which is `regenerate`.

## Map B — runtime files that reference outdated paths, one section per runtime

**How to read this map.** One row per non-symlink file under a runtime root that names `.opencode`, with the first actual matching line (verified by reading the file), the seed's matching-line count, what the reference does, whether a generator owns it, and the change it needs. The four generated families share one generator each; the authored files carry the change individually. Home-level configuration follows at the end — counts only, no contents, per the brief.

### Map B · `.claude` — 17 files

| file | line/key | matching lines | what the reference does | generated (owner) or authored | change needed | class |
|---|---|---:|---|---|---|---|
| `.claude/SYNC.md` | `.claude/SYNC.md:3` | 21 | documents the sync surface: names sources, generators and .opencode paths | authored manifest (some claims already stale, see iteration 1-2 findings) | manual rewrite as part of the migration | manual |
| `.claude/agents/README.txt` | `.claude/agents/README.txt:8` | 2 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/ai-council.md` | `.claude/agents/ai-council.md:21` | 18 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/code.md` | `.claude/agents/code.md:28` | 7 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/context.md` | `.claude/agents/context.md:57` | 7 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/debug.md` | `.claude/agents/debug.md:342` | 3 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/deep-improvement.md` | `.claude/agents/deep-improvement.md:70` | 6 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/deep-research.md` | `.claude/agents/deep-research.md:95` | 7 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/deep-review.md` | `.claude/agents/deep-review.md:175` | 13 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/design.md` | `.claude/agents/design.md:80` | 13 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/markdown.md` | `.claude/agents/markdown.md:124` | 23 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/orchestrate.md` | `.claude/agents/orchestrate.md:21` | 9 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/prompt-improver.md` | `.claude/agents/prompt-improver.md:86` | 8 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/agents/review.md` | `.claude/agents/review.md:84` | 3 | authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode | authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`) | mechanical path rewrite inside the fork, plus the twin update in .opencode/agents | mechanical |
| `.claude/hooks/README.md` | `.claude/hooks/README.md:3` | 5 | documents the hook discovery mirror and its .opencode sources | authored doc | mechanical path rewrite | mechanical |
| `.claude/mcp.json` | `.claude/mcp.json:6` | 1 | registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs; canonical file the root .mcp.json links to | authored (`.claude/SYNC.md:24-41`) | mechanical path edit, or keep .opencode compatibility | mechanical |
| `.claude/settings.json` | `.claude/settings.json:23` | 22 | registers and executes hooks: every hook command string targets a .opencode path | generated (hooks key): sync-hook-registrations.cjs (L144-148) from hook-registry.json | regenerate after hook-registry.json paths are retargeted | regenerate |

### Map B · `.codex` — 50 files

| file | line/key | matching lines | what the reference does | generated (owner) or authored | change needed | class |
|---|---|---:|---|---|---|---|
| `.codex/AGENTS.md` | `.codex/AGENTS.md:127` | 3 | documents + drives discovery: authored global voice doc plus a generated Gate 1 pointer block that runs a .opencode command | mixed: authored + generated block by sync-gate1-pointers.cjs (L131 provenance) | manual doc update; regenerate the Gate 1 block from root AGENTS.md | manual |
| `.codex/SYNC.md` | `.codex/SYNC.md:3` | 24 | documents the sync surface: names sources, generators and .opencode paths | authored manifest (some claims already stale, see iteration 1-2 findings) | manual rewrite as part of the migration | manual |
| `.codex/agents/ai-council.toml` | `.codex/agents/ai-council.toml:2` | 22 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/code.toml` | `.codex/agents/code.toml:2` | 15 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/context.toml` | `.codex/agents/context.toml:2` | 10 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/debug.toml` | `.codex/agents/debug.toml:2` | 7 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/deep-improvement.toml` | `.codex/agents/deep-improvement.toml:2` | 8 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/deep-research.toml` | `.codex/agents/deep-research.toml:2` | 9 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/deep-review.toml` | `.codex/agents/deep-review.toml:2` | 17 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/design.toml` | `.codex/agents/design.toml:2` | 15 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/markdown.toml` | `.codex/agents/markdown.toml:2` | 25 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/orchestrate.toml` | `.codex/agents/orchestrate.toml:2` | 29 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/prompt-improver.toml` | `.codex/agents/prompt-improver.toml:2` | 10 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/agents/review.toml` | `.codex/agents/review.toml:2` | 8 | generated agent definition: source comment plus path-convention text name .opencode paths | generated: sync-agents.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/config.toml` | `.codex/config.toml:13` | 1 | registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs; also carries the project trust entry | authored (`.codex/SYNC.md:24-36`) | mechanical path edit | mechanical |
| `.codex/hooks.json` | `.codex/hooks.json:8` | 18 | registers and executes hooks: outbound-installed to ~/.codex/hooks.json | generated: sync-hook-registrations.cjs (L151-153) from hook-registry.json | regenerate after hook-registry.json paths are retargeted, then re-run install-codex-hooks.mjs | regenerate |
| `.codex/hooks/README.md` | `.codex/hooks/README.md:3` | 6 | documents the hook discovery mirror and its .opencode sources | authored doc | mechanical path rewrite | mechanical |
| `.codex/prompts/agent-router.md` | `.codex/prompts/agent-router.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-agent.md` | `.codex/prompts/create-agent.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-benchmark.md` | `.codex/prompts/create-benchmark.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-changelog.md` | `.codex/prompts/create-changelog.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-command.md` | `.codex/prompts/create-command.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-diff.md` | `.codex/prompts/create-diff.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-feature-catalog.md` | `.codex/prompts/create-feature-catalog.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-manual-testing-playbook.md` | `.codex/prompts/create-manual-testing-playbook.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-readme.md` | `.codex/prompts/create-readme.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-repo-rule.md` | `.codex/prompts/create-repo-rule.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-skill-parent.md` | `.codex/prompts/create-skill-parent.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-skill.md` | `.codex/prompts/create-skill.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/create-with-human-voice.md` | `.codex/prompts/create-with-human-voice.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/deep-agent-improvement.md` | `.codex/prompts/deep-agent-improvement.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/deep-ai-council.md` | `.codex/prompts/deep-ai-council.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/deep-model-benchmark.md` | `.codex/prompts/deep-model-benchmark.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/deep-research.md` | `.codex/prompts/deep-research.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/deep-review.md` | `.codex/prompts/deep-review.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/design-chart.md` | `.codex/prompts/design-chart.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/design-diagram.md` | `.codex/prompts/design-diagram.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/design-extract.md` | `.codex/prompts/design-extract.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/doctor-mcp.md` | `.codex/prompts/doctor-mcp.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/doctor-speckit.md` | `.codex/prompts/doctor-speckit.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/doctor-update.md` | `.codex/prompts/doctor-update.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/prompt-improve.md` | `.codex/prompts/prompt-improve.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/rewrite-response-by-external-agent.md` | `.codex/prompts/rewrite-response-by-external-agent.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/rewrite-response.md` | `.codex/prompts/rewrite-response.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/speckit-complete.md` | `.codex/prompts/speckit-complete.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/speckit-implement.md` | `.codex/prompts/speckit-implement.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/speckit-plan.md` | `.codex/prompts/speckit-plan.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/speckit-resume.md` | `.codex/prompts/speckit-resume.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/speckit-save.md` | `.codex/prompts/speckit-save.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.codex/prompts/speckit-search.md` | `.codex/prompts/speckit-search.md:1` | 2 | drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path | generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |

### Map B · `.cursor` — 7 files

| file | line/key | matching lines | what the reference does | generated (owner) or authored | change needed | class |
|---|---|---:|---|---|---|---|
| `.cursor/SYNC.md` | `.cursor/SYNC.md:3` | 12 | documents the sync surface: names sources, generators and .opencode paths | authored manifest (some claims already stale, see iteration 1-2 findings) | manual rewrite as part of the migration | manual |
| `.cursor/commands/goal-cursor.md` | `.cursor/commands/goal-cursor.md:28` | 2 | authored native Cursor command: runnable command lines target .opencode scripts | authored native command, exempt from mirror generator (command-scope.cjs) | mechanical path edit | mechanical |
| `.cursor/commands/vision.md` | `.cursor/commands/vision.md:32` | 1 | authored native Cursor command: runnable command lines target .opencode scripts | authored native command, exempt from mirror generator (command-scope.cjs) | mechanical path edit | mechanical |
| `.cursor/hooks.json` | `.cursor/hooks.json:6` | 18 | registers and executes hooks: every command string targets a .opencode path | generated: sync-hook-registrations.cjs (L159-172) from hook-registry.json | regenerate after hook-registry.json paths are retargeted | regenerate |
| `.cursor/hooks/README.md` | `.cursor/hooks/README.md:3` | 6 | documents the hook discovery mirror and its .opencode sources | authored doc | mechanical path rewrite | mechanical |
| `.cursor/mcp.json` | `.cursor/mcp.json:6` | 1 | registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs; SYNC.md claims this is a symlink to ../.mcp.json, the tree shows a real file | authored real file (`.cursor/SYNC.md:24-41` disagrees; verified real file on disk) | mechanical path edit; correct the manifest | mechanical |
| `.cursor/rules/skill-routing.md` | `.cursor/rules/skill-routing.md:9` | 10 | drives discovery and routing: authored prose routing table plus a generated Gate 1 pointer block that runs a .opencode command | mixed: authored prose + generated block by sync-gate1-pointers.cjs (L27 provenance) | mechanical prose rewrite; regenerate the Gate 1 block from root AGENTS.md | regenerate |

### Map B · `.devin` — 4 files

| file | line/key | matching lines | what the reference does | generated (owner) or authored | change needed | class |
|---|---|---:|---|---|---|---|
| `.devin/SYNC.md` | `.devin/SYNC.md:3` | 12 | documents the sync surface: names sources, generators and .opencode paths | authored manifest (some claims already stale, see iteration 1-2 findings) | manual rewrite as part of the migration | manual |
| `.devin/hooks.v1.json` | `.devin/hooks.v1.json:8` | 23 | registers and executes hooks: every command string targets a .opencode path | generated: sync-hook-registrations.cjs (L155-157) from hook-registry.json | regenerate after hook-registry.json paths are retargeted | regenerate |
| `.devin/hooks/README.md` | `.devin/hooks/README.md:3` | 5 | documents the hook discovery mirror and its .opencode sources | authored doc | mechanical path rewrite | mechanical |
| `.devin/mcp_config.json` | `.devin/mcp_config.json:6` | 1 | registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs | authored, Devin-owned (`.devin/SYNC.md:22-31`) | mechanical path edit | mechanical |

### Map B · `.hermes` — 103 files

| file | line/key | matching lines | what the reference does | generated (owner) or authored | change needed | class |
|---|---|---:|---|---|---|---|
| `.hermes/SYNC.md` | `.hermes/SYNC.md:3` | 14 | documents the sync surface: names sources, generators and .opencode paths | authored manifest (some claims already stale, see iteration 1-2 findings) | manual rewrite as part of the migration | manual |
| `.hermes/plugins/repo-guards/__init__.py` | `.hermes/plugins/repo-guards/__init__.py:6` | 18 | executes guard cores: hardcoded path constants shell out to .opencode hook scripts | authored project plugin (`.hermes/SYNC.md:29-34`) | mechanical path-constant rewrite (10 constants) | mechanical |
| `.hermes/prompts/agent-router.md` | `.hermes/prompts/agent-router.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-agent.md` | `.hermes/prompts/create-agent.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-benchmark.md` | `.hermes/prompts/create-benchmark.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-changelog.md` | `.hermes/prompts/create-changelog.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-command.md` | `.hermes/prompts/create-command.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-diff.md` | `.hermes/prompts/create-diff.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-feature-catalog.md` | `.hermes/prompts/create-feature-catalog.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-manual-testing-playbook.md` | `.hermes/prompts/create-manual-testing-playbook.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-readme.md` | `.hermes/prompts/create-readme.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-repo-rule.md` | `.hermes/prompts/create-repo-rule.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-skill-parent.md` | `.hermes/prompts/create-skill-parent.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-skill.md` | `.hermes/prompts/create-skill.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/create-with-human-voice.md` | `.hermes/prompts/create-with-human-voice.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/deep-agent-improvement.md` | `.hermes/prompts/deep-agent-improvement.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/deep-ai-council.md` | `.hermes/prompts/deep-ai-council.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/deep-model-benchmark.md` | `.hermes/prompts/deep-model-benchmark.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/deep-research.md` | `.hermes/prompts/deep-research.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/deep-review.md` | `.hermes/prompts/deep-review.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/design-chart.md` | `.hermes/prompts/design-chart.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/design-diagram.md` | `.hermes/prompts/design-diagram.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/design-extract.md` | `.hermes/prompts/design-extract.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/doctor-mcp.md` | `.hermes/prompts/doctor-mcp.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/doctor-speckit.md` | `.hermes/prompts/doctor-speckit.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/doctor-update.md` | `.hermes/prompts/doctor-update.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/prompt-improve.md` | `.hermes/prompts/prompt-improve.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/rewrite-response-by-external-agent.md` | `.hermes/prompts/rewrite-response-by-external-agent.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/rewrite-response.md` | `.hermes/prompts/rewrite-response.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/speckit-complete.md` | `.hermes/prompts/speckit-complete.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/speckit-implement.md` | `.hermes/prompts/speckit-implement.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/speckit-plan.md` | `.hermes/prompts/speckit-plan.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/speckit-resume.md` | `.hermes/prompts/speckit-resume.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/speckit-save.md` | `.hermes/prompts/speckit-save.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/prompts/speckit-search.md` | `.hermes/prompts/speckit-search.md:1` | 2 | drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path | generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-ai-council/SKILL.md` | `.hermes/skills/agent-ai-council/SKILL.md:14` | 21 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-code/SKILL.md` | `.hermes/skills/agent-code/SKILL.md:14` | 14 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-context/SKILL.md` | `.hermes/skills/agent-context/SKILL.md:16` | 9 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-debug/SKILL.md` | `.hermes/skills/agent-debug/SKILL.md:14` | 6 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-deep-improvement/SKILL.md` | `.hermes/skills/agent-deep-improvement/SKILL.md:16` | 7 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-deep-research/SKILL.md` | `.hermes/skills/agent-deep-research/SKILL.md:14` | 8 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-deep-review/SKILL.md` | `.hermes/skills/agent-deep-review/SKILL.md:14` | 16 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-design/SKILL.md` | `.hermes/skills/agent-design/SKILL.md:14` | 14 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-markdown/SKILL.md` | `.hermes/skills/agent-markdown/SKILL.md:14` | 24 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-orchestrate/SKILL.md` | `.hermes/skills/agent-orchestrate/SKILL.md:22` | 28 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-prompt-improver/SKILL.md` | `.hermes/skills/agent-prompt-improver/SKILL.md:18` | 9 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/agent-review/SKILL.md` | `.hermes/skills/agent-review/SKILL.md:14` | 7 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/cli-claude-code/SKILL.md` | `.hermes/skills/cli-claude-code/SKILL.md:18` | 4 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/cli-codex/SKILL.md` | `.hermes/skills/cli-codex/SKILL.md:18` | 4 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/cli-cursor/SKILL.md` | `.hermes/skills/cli-cursor/SKILL.md:18` | 6 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/cli-devin/SKILL.md` | `.hermes/skills/cli-devin/SKILL.md:18` | 16 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/cli-external-orchestration/SKILL.md` | `.hermes/skills/cli-external-orchestration/SKILL.md:12` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/cli-hermes/SKILL.md` | `.hermes/skills/cli-hermes/SKILL.md:42` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/cli-opencode/SKILL.md` | `.hermes/skills/cli-opencode/SKILL.md:30` | 11 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/cli-pi/SKILL.md` | `.hermes/skills/cli-pi/SKILL.md:26` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/deep-ai-council/SKILL.md` | `.hermes/skills/deep-ai-council/SKILL.md:9` | 5 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/deep-improvement/SKILL.md` | `.hermes/skills/deep-improvement/SKILL.md:18` | 4 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/deep-research/SKILL.md` | `.hermes/skills/deep-research/SKILL.md:10` | 3 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/deep-review/SKILL.md` | `.hermes/skills/deep-review/SKILL.md:10` | 5 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-aside-devtools/SKILL.md` | `.hermes/skills/mcp-aside-devtools/SKILL.md:9` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-chrome-devtools/SKILL.md` | `.hermes/skills/mcp-chrome-devtools/SKILL.md:9` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-click-up/SKILL.md` | `.hermes/skills/mcp-click-up/SKILL.md:9` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-code-mode/SKILL.md` | `.hermes/skills/mcp-code-mode/SKILL.md:9` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-figma/SKILL.md` | `.hermes/skills/mcp-figma/SKILL.md:11` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-magicpath/SKILL.md` | `.hermes/skills/mcp-magicpath/SKILL.md:11` | 5 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-mobbin/SKILL.md` | `.hermes/skills/mcp-mobbin/SKILL.md:11` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-notion/SKILL.md` | `.hermes/skills/mcp-notion/SKILL.md:9` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-obsidian/SKILL.md` | `.hermes/skills/mcp-obsidian/SKILL.md:9` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-refero/SKILL.md` | `.hermes/skills/mcp-refero/SKILL.md:11` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/mcp-tooling/SKILL.md` | `.hermes/skills/mcp-tooling/SKILL.md:12` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-code-mobile-cli/SKILL.md` | `.hermes/skills/sk-code-mobile-cli/SKILL.md:13` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-code-obsidian/SKILL.md` | `.hermes/skills/sk-code-obsidian/SKILL.md:13` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-code-opencode/SKILL.md` | `.hermes/skills/sk-code-opencode/SKILL.md:13` | 6 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-code-quality/SKILL.md` | `.hermes/skills/sk-code-quality/SKILL.md:12` | 13 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-code-review/SKILL.md` | `.hermes/skills/sk-code-review/SKILL.md:12` | 5 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-code-webflow/SKILL.md` | `.hermes/skills/sk-code-webflow/SKILL.md:13` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-code/SKILL.md` | `.hermes/skills/sk-code/SKILL.md:12` | 4 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-communication/SKILL.md` | `.hermes/skills/sk-communication/SKILL.md:9` | 8 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-agent/SKILL.md` | `.hermes/skills/sk-create-agent/SKILL.md:9` | 15 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-benchmark/SKILL.md` | `.hermes/skills/sk-create-benchmark/SKILL.md:9` | 3 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-changelog/SKILL.md` | `.hermes/skills/sk-create-changelog/SKILL.md:9` | 24 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-command/SKILL.md` | `.hermes/skills/sk-create-command/SKILL.md:9` | 14 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-diff/SKILL.md` | `.hermes/skills/sk-create-diff/SKILL.md:9` | 3 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-feature-catalog/SKILL.md` | `.hermes/skills/sk-create-feature-catalog/SKILL.md:9` | 7 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-frontmatter/SKILL.md` | `.hermes/skills/sk-create-frontmatter/SKILL.md:9` | 3 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-manual-testing-playbook/SKILL.md` | `.hermes/skills/sk-create-manual-testing-playbook/SKILL.md:9` | 10 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-quality-control/SKILL.md` | `.hermes/skills/sk-create-quality-control/SKILL.md:9` | 18 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-readme/SKILL.md` | `.hermes/skills/sk-create-readme/SKILL.md:9` | 7 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-repo-rule/SKILL.md` | `.hermes/skills/sk-create-repo-rule/SKILL.md:9` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-skill/SKILL.md` | `.hermes/skills/sk-create-skill/SKILL.md:9` | 6 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-create-with-human-voice/SKILL.md` | `.hermes/skills/sk-create-with-human-voice/SKILL.md:9` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-design-chart/SKILL.md` | `.hermes/skills/sk-design-chart/SKILL.md:11` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-design-diagram/SKILL.md` | `.hermes/skills/sk-design-diagram/SKILL.md:9` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-design-fundamentals/SKILL.md` | `.hermes/skills/sk-design-fundamentals/SKILL.md:9` | 1 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-design-md-generator/SKILL.md` | `.hermes/skills/sk-design-md-generator/SKILL.md:9` | 6 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-design/SKILL.md` | `.hermes/skills/sk-design/SKILL.md:12` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-doc/SKILL.md` | `.hermes/skills/sk-doc/SKILL.md:12` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-git/SKILL.md` | `.hermes/skills/sk-git/SKILL.md:79` | 11 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-prompt/SKILL.md` | `.hermes/skills/sk-prompt/SKILL.md:9` | 2 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/sk-vision/SKILL.md` | `.hermes/skills/sk-vision/SKILL.md:9` | 6 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/system-deep-loop/SKILL.md` | `.hermes/skills/system-deep-loop/SKILL.md:9` | 6 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/system-skill-advisor/SKILL.md` | `.hermes/skills/system-skill-advisor/SKILL.md:30` | 10 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.hermes/skills/system-spec-kit/SKILL.md` | `.hermes/skills/system-spec-kit/SKILL.md:9` | 19 | drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts | generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |

### Map B · `.pi` — 50 files

| file | line/key | matching lines | what the reference does | generated (owner) or authored | change needed | class |
|---|---|---:|---|---|---|---|
| `.pi/SYNC.md` | `.pi/SYNC.md:3` | 20 | documents the sync surface: names sources, generators and .opencode paths | authored manifest (some claims already stale, see iteration 1-2 findings) | manual rewrite as part of the migration | manual |
| `.pi/agents/ai-council.md` | `.pi/agents/ai-council.md:18` | 21 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/code.md` | `.pi/agents/code.md:19` | 14 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/context.md` | `.pi/agents/context.md:18` | 9 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/debug.md` | `.pi/agents/debug.md:19` | 6 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/deep-improvement.md` | `.pi/agents/deep-improvement.md:21` | 7 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/deep-research.md` | `.pi/agents/deep-research.md:19` | 8 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/deep-review.md` | `.pi/agents/deep-review.md:18` | 16 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/design.md` | `.pi/agents/design.md:19` | 14 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/markdown.md` | `.pi/agents/markdown.md:19` | 24 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/orchestrate.md` | `.pi/agents/orchestrate.md:24` | 28 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/prompt-improver.md` | `.pi/agents/prompt-improver.md:20` | 9 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/agents/review.md` | `.pi/agents/review.md:17` | 7 | generated agent definition: path-convention text and dispatch gates name .opencode paths | generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/extensions/README.md` | `.pi/extensions/README.md:20` | 20 | documents the Pi extension bridge and its .opencode sources | authored doc | mechanical path rewrite | mechanical |
| `.pi/extensions/lib/README.md` | `.pi/extensions/lib/README.md:16` | 1 | documents the Pi extension bridge and its .opencode sources | authored doc | mechanical path rewrite | mechanical |
| `.pi/mcp.json` | `.pi/mcp.json:5` | 1 | registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs | authored (`.pi/SYNC.md:24-35`) | mechanical path edit | mechanical |
| `.pi/prompts/agent-router.md` | `.pi/prompts/agent-router.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-agent.md` | `.pi/prompts/create-agent.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-benchmark.md` | `.pi/prompts/create-benchmark.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-changelog.md` | `.pi/prompts/create-changelog.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-command.md` | `.pi/prompts/create-command.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-diff.md` | `.pi/prompts/create-diff.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-feature-catalog.md` | `.pi/prompts/create-feature-catalog.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-manual-testing-playbook.md` | `.pi/prompts/create-manual-testing-playbook.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-readme.md` | `.pi/prompts/create-readme.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-repo-rule.md` | `.pi/prompts/create-repo-rule.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-skill-parent.md` | `.pi/prompts/create-skill-parent.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-skill.md` | `.pi/prompts/create-skill.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/create-with-human-voice.md` | `.pi/prompts/create-with-human-voice.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/deep-agent-improvement.md` | `.pi/prompts/deep-agent-improvement.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/deep-ai-council.md` | `.pi/prompts/deep-ai-council.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/deep-model-benchmark.md` | `.pi/prompts/deep-model-benchmark.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/deep-research.md` | `.pi/prompts/deep-research.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/deep-review.md` | `.pi/prompts/deep-review.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/design-chart.md` | `.pi/prompts/design-chart.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/design-diagram.md` | `.pi/prompts/design-diagram.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/design-extract.md` | `.pi/prompts/design-extract.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/doctor-mcp.md` | `.pi/prompts/doctor-mcp.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/doctor-speckit.md` | `.pi/prompts/doctor-speckit.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/doctor-update.md` | `.pi/prompts/doctor-update.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/goal-pi.md` | `.pi/prompts/goal-pi.md:33` | 1 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/prompt-improve.md` | `.pi/prompts/prompt-improve.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/rewrite-response-by-external-agent.md` | `.pi/prompts/rewrite-response-by-external-agent.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/rewrite-response.md` | `.pi/prompts/rewrite-response.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/speckit-complete.md` | `.pi/prompts/speckit-complete.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/speckit-implement.md` | `.pi/prompts/speckit-implement.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/speckit-plan.md` | `.pi/prompts/speckit-plan.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/speckit-resume.md` | `.pi/prompts/speckit-resume.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/speckit-save.md` | `.pi/prompts/speckit-save.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |
| `.pi/prompts/speckit-search.md` | `.pi/prompts/speckit-search.md:1` | 2 | drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path | generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`) | regenerate after the generator's .opencode source constant is retargeted | regenerate |

### Map B · home-level configuration (counts only)

| home path | key / role | occurrences | class | change needed |
|---|---|---:|---|---|
| `~/.config/git/hooks/` (7 links) | absolute symlinks into the main checkout `.opencode/scripts/git-hooks/` | 7 | blocker | reinstall against the new source root; breaks every repository on the machine at the move moment |
| `~/.codex/hooks.json` | outbound hook command strings | 18 | manual | re-run `install-codex-hooks.mjs` after `.codex/hooks.json` regenerates |
| `~/.codex/config.toml` | project trust entry | 1 | manual | update the trust key |
| `~/.codex/AGENTS.md` | symlink to repo `.codex/AGENTS.md` | is symlink | none | follows the repository |
| `~/.hermes/config.yaml` | MCP launcher reference | 1 | manual | update launcher path, or keep `.opencode/bin` compatibility |
| `~/.claude.json` | project entries | 1 | manual | inspect and update (no secrets copied) |
| `~/.claude/settings.json` | user settings | 0 | none | no `.opencode` reference |
| `~/.claude/CLAUDE.md` | user doc | 0 | none | no `.opencode` reference |
| `~/.zshrc` | shell wrappers/aliases | 2 | manual | update by hand |
| `~/.pi/agent/SYNC.md` | operator sync notes | 2 | manual | doc update |
| `~/.pi/agent/trust.json` | trust entry | 1 | manual | update the trust key |
| `~/.pi/agent/{settings.json,models.json,modes.json,statusline.sh,pi-cache-optimizer-config.json}` | symlinks to repo `.pi/*` | 0 | none | follow the repository |
| `~/.pi/agent/pi-crash.log` | crash log (not configuration) | 989 | none | log content only |
| `~/.config/devin/*` | Devin user config and MCP config | 0 | none | no `.opencode` reference found |
| `~/.config/git/config` | absent on this machine | — | none | path does not exist |


### Map B reconciliation against the seed

| Runtime area | Seed files | Rows mapped | Unmapped |
|---|---:|---:|---|
| `runtime:claude` | 17 | 17 | none |
| `runtime:codex` | 50 | 50 | none |
| `runtime:cursor` | 7 | 7 | none |
| `runtime:devin` | 4 | 4 | none |
| `runtime:hermes` | 103 | 103 | none |
| `runtime:pi` | 50 | 50 | none |
| **Total** | **231** | **231** | **none** |

Live re-measurement (iteration 9) reproduced 17/50/7/4/103/50 non-symlink files exactly.

**Ownership.** 197 of the 231 files are generator output: Codex prompts 33 (`sync-prompts.cjs`) and agents 12 (`sync-agents.cjs`); Pi prompts 34 (`sync-prompts-pi.cjs`) and agents 12 (`sync-agents-pi.cjs`); Hermes prompts 33 (`sync-prompts-hermes.cjs`) and skills 68 (`sync-skills-hermes.cjs`); and the four hook-registration files rendered from `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` by `sync-hook-registrations.cjs` plus the generated Gate 1 block in `.cursor/rules/skill-routing.md`. The 34 remaining files are authored: the 12-file `.claude/agents` fork and its README, five MCP/server registrations (`.claude`, `.cursor`, `.devin`, `.pi`, `.codex/config.toml`), `.hermes/plugins/repo-guards/__init__.py` (ten path constants), `.cursor/commands/{goal-cursor,vision}.md`, `.cursor/rules/sk-vision.md`, `.codex/AGENTS.md`, and six `SYNC.md` manifests.

**Classification totals.** `regenerate` 197, `mechanical` 27, `manual` 7. Sum 231. Home-level: 7 `blocker` (the global git-hook symlinks), 8 `manual` (codex hooks/trust, hermes launcher, claude.json, zshrc, pi trust/SYNC docs), and the rest `none` because they are symlinks that follow the repository or contain no reference.

## Map C — everything else, by area

**How to read this map.** Areas are grouped as the brief lists them: first the skills (iterations 5-7), then the `.opencode` runtime areas, then the root documents/configuration and CI (iteration 8). For code, the compact rows below list **every file that constructs, matches or hardcodes the path, with its first matching line** and its class; the truncated first construct and the full origin label live in the iteration tables (`iterations/iteration-005.md` through `iteration-008.md`). For documentation, each area's table aggregates the markdown files into artifact classes with files, fenced (runnable-ish) and inline (prose) line counts, and the freeze/mechanical/manual classification.

### Map C · skill `system-spec-kit`

**Code: 323 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--claude-adapter/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--claude-registered-path-final/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--claude-registered-path-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--codex-adapter/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--codex-registered-path-final/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--codex-registered-path-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--cursor-adapter/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--cursor-native-host-final/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--cursor-native-host-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--cursor-native-host/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--cursor-registered-path-final/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--cursor-registered-path-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--devin-adapter/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--devin-registered-path-final/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--devin-registered-path-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--directive-unit-final/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--directive-unit-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--opencode-adapter-driven-final/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--opencode-adapter-driven-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--opencode-test-seam/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--pi-adapter-driven-final/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--pi-adapter-driven-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--pi-adapter-suite/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--pi-repeat-suppression-verified/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--pi/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--ux-hooks-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--ux-hooks-3/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--ux-hooks-4/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--ux-hooks-5/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--ux-hooks/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/system-spec-kit/benchmark/reports/supersession-manifest.json:5` — freeze
- `.opencode/skills/system-spec-kit/graph-metadata.json:94` — regenerate
- `.opencode/skills/system-spec-kit/runtime/api/graph-refresh.ts:44` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:24` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs:52` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs:21` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:21` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/common.sh:21` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:91` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:87` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/migrate-trigger-phrase-residual.ts:119` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/core/config.ts:324` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-canonical-resolver.ts:17` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts:140` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-migration-manifest.ts:106` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-migration.ts:221` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-write-guard.ts:25` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts:310` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/deploy-mcp.sh:45` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/extractors/collect-session-data.ts:1210` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts:172` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs:21` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/hermes/tests/sync-skills-hermes.test.mjs:59` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/lib/completion-state.cjs:75` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:28` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/lib/validate-memory-quality.ts:636` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/loaders/data-loader.ts:91` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/metrics/fable-baseline.json:2` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:42` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement-results.jsonl:198` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:134` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/observability/smart-router-telemetry.ts:151` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/ops/process-memory-harness.ts:111` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/optimizer/replay-corpus.cjs:61` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs:21` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs:21` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs:28` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:22` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/daemon-off-proof.json:5` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json:44` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/latency-report.json:6` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:23603` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/recipe-execution.json:10` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/residue-allowlist.json:5` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json:48` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:71` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:30` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:67` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:305` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-shared.cjs:41` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/rules/check-folder-naming.sh:35` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:74` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-identity.sh:26` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh:24` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:22` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs:19` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:80` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs:31` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:38` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:382` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:142` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:89` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec/archive.sh:22` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:121` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh:56` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:545` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:39` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh:7` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:23` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:285` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:100` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/test-council-matrix.sh:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/graph-metadata.json:3` — regenerate
- `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/graph-metadata.json:3` — regenerate
- `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/graph-metadata.json:3` — regenerate
- `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/053-template-compliant-level2/graph-metadata.json:23` — regenerate
- `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/063-template-compliant-level3/graph-metadata.json:32` — regenerate
- `.opencode/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap:18` — regenerate
- `.opencode/skills/system-spec-kit/runtime/cli/tests/alignment-drift-fixture-preservation.vitest.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/auto-detection-fixes.vitest.ts:75` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/backfill-prune-report-gate.vitest.ts:41` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/backfill-research-metadata.vitest.ts:47` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/canonical-save-validation.vitest.ts:40` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/check-graph-metadata-child-drift.sh:197` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/check-source-dist-alignment-orphans.vitest.ts:145` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/continuity-freshness.vitest.ts:28` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/deep-research-reducer.vitest.ts:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/deep-review-contract-parity.vitest.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/deep-review-reducer-schema.vitest.ts:18` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fingerprint-docset-generation.sh:23` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/manual-playbook-fixture.js:15` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/manual-playbook-fixture.ts:50` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC1-truncation.json:6` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-happy-path.json:11` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-path-fragment.json:11` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-standalone-stopwords.json:15` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-suspicious-prefix.json:12` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC3-synthetic-bigrams.json:12` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC4-importance-tier.json:7` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-AC6-provenance.json:13` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-001-trigger-cluster.json:15` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-002a-blank-observation-titles.json:16` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:16` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-003-canonical-trigger.json:23` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/memory-quality/F-DUP-004b-last-clipping.json:9` — manual
- `.opencode/skills/system-spec-kit/runtime/cli/tests/gate-3-classifier.vitest.ts:551` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/gate1-pointer-sync.vitest.ts:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/generate-context-cli-authority.vitest.ts:214` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/generate-description-identity-safety.vitest.ts:17` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/graph-key-file-declarations.vitest.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/graph-metadata-backfill.vitest.ts:57` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/graph-metadata-refresh.vitest.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/graph-metadata-write-containment.sh:27` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/grep-convention.vitest.ts:36` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.js:8` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/manual-playbook-runner.ts:106` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/memory-quality-phase2-pr3.test.ts:95` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/migrate-generated-json.vitest.ts:51` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/multi-ai-council-advise-completion.vitest.ts:13` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/multi-ai-council-mirror-parity.vitest.ts:11` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/multi-ai-council-persist-artifacts.vitest.ts:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/multi-ai-council-validator.vitest.ts:10` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/optimizer-promote.vitest.ts:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/optimizer-replay-corpus.vitest.ts:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/optimizer-replay-runner.vitest.ts:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/optimizer-rubric.vitest.ts:13` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/optimizer-search.vitest.ts:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/outsourced-agent-handback-docs.vitest.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts:19` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/process-memory-harness.vitest.ts:22` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/process-sweep.vitest.ts:13` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts:103` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/retrieval-repo-root.vitest.ts:28` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/retrofit-convention-pipeline.vitest.ts:33` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/review-research-paths.vitest.ts:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts:65` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/scoped-backfill-boundary.vitest.ts:40` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/session-enrichment.vitest.ts:151` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-affinity.vitest.ts:85` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-canonical-resolver.vitest.ts:37` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-config-precedence.vitest.ts:35` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-fault-injection.vitest.ts:53` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-independent-readers.vitest.ts:26` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-migration-manifest.vitest.ts:81` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-migration.vitest.ts:34` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-phase-pointer.vitest.ts:60` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-validation-matrix.vitest.ts:53` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-write-guard.vitest.ts:60` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-writer-autosave.vitest.ts:65` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/strict-pass-freshness.vitest.ts:33` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts:54` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/task-enrichment.vitest.ts:859` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-dist-freshness.sh:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-five-checks.js:763` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js:301` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js:19` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh:50` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-subfolder-resolution.js:940` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:296` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/trigger-phrase-no-prose-bigrams.vitest.ts:40` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/validate-memory-quality-v8-overreach.vitest.ts:95` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/validation-gate-hardening.vitest.ts:46` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/workflow-canonical-save-metadata.vitest.ts:173` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts:52` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/workflow-trigger-index-freshness.vitest.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts:2` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/tests/yaml-intake-event-payloads.vitest.ts:27` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/utils/path-utils.ts:58` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/utils/spec-affinity.ts:166` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/utils/tool-sanitizer.ts:34` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts:9` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs:26` — mechanical
- `.opencode/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts:475` — mechanical
- `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json:13` — regenerate
- `.opencode/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts:111` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:40` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:39` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:33` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:31` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-claude.test.mjs:29` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:31` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts:22` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs:35` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/codex/session-start.ts:23` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/codex/session-stop.ts:21` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-codex.test.mjs:29` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs:13` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs:34` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/cursor/precompact.ts:41` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/cursor/session-end.ts:26` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/cursor/session-start.ts:22` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs:43` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs:32` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:29` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:39` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/session-start.ts:22` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/session-stop.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs:23` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:60` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs:23` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts:12` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts:43` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:16` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:6` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:6` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-stop-context.ts:6` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts:11` — mechanical
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/config/spec-doc-paths.ts:304` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:55` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:512` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:870` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:75` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:253` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/search/folder-discovery.ts:1389` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/utils/canonical-path.ts:47` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/utils/index-scope.ts:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts:71` — mechanical
- `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:739` — mechanical
- `.opencode/skills/system-spec-kit/runtime/stress-test/substrate/v-rule-save-flood-stress.vitest.ts:67` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts:106` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/continuity-freshness.vitest.ts:17` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/copilot-compact-cycle.vitest.ts:48` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/council-helpers-smoke.vitest.ts:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/council-playbook-anchor-integrity.vitest.ts:10` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/description/description-merge.vitest.ts:82` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/description/fixtures/017-002-cluster-consumers.description.json:69` — manual
- `.opencode/skills/system-spec-kit/runtime/tests/directive-lifecycle-boundary-bridge.vitest.ts:80` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/dist-freshness.vitest.ts:69` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts:24` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/embedders/hf-model-server-perimeter.vitest.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/embedders/hf-model-server.vitest.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-live-two-launcher.vitest.ts:4` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-single-writer-cluster.vitest.ts:215` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/exclusion-ssot-unification.vitest.ts:51` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/fixtures/golden-queries.json:39` — manual
- `.opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/session-stop-replay.jsonl:1` — manual
- `.opencode/skills/system-spec-kit/runtime/tests/folder-discovery-integration.vitest.ts:141` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/folder-discovery.vitest.ts:751` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/generated-metadata-integrity.vitest.ts:35` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/generator-hardening.vitest.ts:47` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/graph-metadata-schema.vitest.ts:44` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/graph/graph-metadata-lineage.vitest.ts:25` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts:23` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/hook-completion-evidence-stop.vitest.ts:5` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts:121` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts:29` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/identity-resolver-merge-safety.vitest.ts:33` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/index-scope.vitest.ts:50` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/launcher-ipc-bridge-probe.vitest.ts:13` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/launcher-session-proxy.vitest.ts:10` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/launcher-stop-hook-orphan-sweep.vitest.ts:12` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/memory-drift-full-tree-discovery.vitest.ts:40` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/model-server-demand-probe.vitest.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/multi-ai-council-audit-trail.vitest.ts:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/multi-ai-council-permission-scope.vitest.ts:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/multi-ai-council-rollback.vitest.ts:14` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts:11` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts:10` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/orphan-sweeper-ipc-preserve.vitest.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/path-boundary.vitest.ts:68` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/remediation-008-docs.vitest.ts:18` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/resource-map-extractor.vitest.ts:44` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/resume-ladder.vitest.ts:15` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/shared-payload-advisor.vitest.ts:34` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/smart-router-analyze.vitest.ts:108` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/smart-router-measurement.vitest.ts:42` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/smart-router-telemetry.vitest.ts:279` — mechanical
- `.opencode/skills/system-spec-kit/runtime/tests/thin-continuity-record.vitest.ts:150` — mechanical
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:41` — mechanical
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:127` — mechanical
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.test.ts:24` — mechanical
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:20` — mechanical
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:70` — mechanical
- `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:6` — mechanical
- `.opencode/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:32` — mechanical
- `.opencode/skills/system-spec-kit/templates/addons/before-after.md.tmpl:15` — mechanical
- `.opencode/skills/system-spec-kit/templates/addons/decision-record.md.tmpl:32` — mechanical
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:32` — mechanical
- `.opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:78` — mechanical
- `.opencode/skills/system-spec-kit/templates/addons/roadmap.md.tmpl:15` — mechanical
- `.opencode/skills/system-spec-kit/templates/addons/timeline.md.tmpl:15` — mechanical
- `.opencode/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:80` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 79 | 291 | 417 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/system-spec-kit/manual-testing-playbook/context-preservation/resource-map-template.md`; `.opencode/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md`; `.opencode/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-deep-loop-convergence.md` |
| historical record (changelog) | 69 | 2 | 373 | freeze | may keep historical paths | `.opencode/skills/system-spec-kit/changelog/v1+/v1.2.5.0.md`; `.opencode/skills/system-spec-kit/changelog/v2+/v2.2.10.0.md`; `.opencode/skills/system-spec-kit/changelog/v2+/v2.2.14.0.md` |
| top-level skill doc | 67 | 142 | 97 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/system-spec-kit/ARCHITECTURE.md`; `.opencode/skills/system-spec-kit/README.md`; `.opencode/skills/system-spec-kit/SKILL.md` |
| test documentation/fixtures | 59 | 41 | 149 | mechanical | test-owned content; rewrite or regenerate | `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md`; `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/plan.md`; `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md` |
| benchmark material | 47 | 0 | 47 | freeze | recorded measurements from past runs | `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--claude-adapter/source.md`; `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--claude-registered-path-final/skill-benchmark-report.md`; `.opencode/skills/system-spec-kit/benchmark/reports/2026-08-11--manual-testing-playbook--claude-registered-path-final/source.md` |
| feature catalog | 35 | 1 | 256 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`; `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md`; `.opencode/skills/system-spec-kit/feature-catalog/feature-flag-reference/filter-config-contract.md` |
| references | 35 | 171 | 112 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md`; `.opencode/skills/system-spec-kit/references/cli/memory-handback.md`; `.opencode/skills/system-spec-kit/references/config/environment-variables.md` |
| templates | 9 | 6 | 4 | mechanical | emitted into packets; rewrite paths | `.opencode/skills/system-spec-kit/runtime/cli/templates/README.md`; `.opencode/skills/system-spec-kit/runtime/lib/templates/README.md`; `.opencode/skills/system-spec-kit/templates/CONTRACT.md` |
| assets | 3 | 18 | 4 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/system-spec-kit/assets/complexity-decision-matrix.md`; `.opencode/skills/system-spec-kit/assets/level-decision-matrix.md`; `.opencode/skills/system-spec-kit/assets/template-mapping.md` |
| other documentation | 3 | 1 | 85 | manual | classify by hand | `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md`; `.opencode/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement-report.md`; `.opencode/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md` |

### Map C · skill `system-deep-loop`

**Code: 118 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/system-deep-loop/benchmark/reports/baseline/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json:8` — freeze
- `.opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/system-deep-loop/command-metadata.json:19` — regenerate
- `.opencode/skills/system-deep-loop/deep-ai-council/assets/runtime-capabilities.json:14` — mechanical
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:554` — mechanical
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:22` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json:34` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/target-manifest.jsonc:16` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-stale-verdict.json:10` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v2.json:7` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json:7` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo.json:7` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:6` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/framework-bakeoff.json:7` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/glm-5.2-frameworks.json:8` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/kimi-k2.7-discriminating.json:8` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/kimi-k2.7-frameworks.json:7` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/model-vs-model.json:7` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json:7` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/system-deep-loop/deep-improvement/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh:9` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:62` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs:17` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:433` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts:16` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/candidate-lineage.vitest.ts:18` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/rollback-candidate-containment.vitest.ts:26` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-cache.vitest.ts:12` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/score-candidate-security.vitest.ts:12` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/trade-off-detector.vitest.ts:14` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:6` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs:19` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs:33` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:357` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/bundle-gate-exec-gate.vitest.ts:28` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/dispatch-envelope.vitest.ts:10` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/grader-harness-hardening.vitest.ts:14` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/optin-scorer.vitest.ts:10` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts:11` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts:19` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts:14` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-acceptance.vitest.ts:12` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-foundation.vitest.ts:11` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts:12` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-runtime.vitest.ts:11` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/sweep-stats-ci.vitest.ts:10` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:43` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:122` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:90` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-dispatch-cap.vitest.ts:15` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts:14` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:16` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/materialize-fixture-id.vitest.ts:21` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mirror-sync-verify.vitest.ts:15` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/mutation-coverage.vitest.ts:14` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts:19` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts:20` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-dashboard.vitest.ts:12` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/reduce-state-mode-mix.vitest.ts:12` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/rollback-candidate-hash-guard.vitest.ts:30` — mechanical
- `.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/.codex/agents/cp-improve-target.toml:2` — manual
- `.opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json:60` — mechanical
- `.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:69` — mechanical
- `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json:4` — mechanical
- `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh:87` — mechanical
- `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3121` — mechanical
- `.opencode/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh:8` — mechanical
- `.opencode/skills/system-deep-loop/deep-review/assets/deep-review-config.json:57` — mechanical
- `.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:32` — mechanical
- `.opencode/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:11` — mechanical
- `.opencode/skills/system-deep-loop/deep-review/assets/runtime-capabilities.json:4` — mechanical
- `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh:87` — mechanical
- `.opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:34` — mechanical
- `.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-config.json:15` — manual
- `.opencode/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-state.jsonl:1` — manual
- `.opencode/skills/system-deep-loop/graph-metadata.json:129` — regenerate
- `.opencode/skills/system-deep-loop/mode-registry.json:17` — regenerate
- `.opencode/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts:70` — mechanical
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:107` — mechanical
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts:178` — mechanical
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:957` — mechanical
- `.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:453` — mechanical
- `.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:613` — mechanical
- `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:171` — mechanical
- `.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:45` — mechanical
- `.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:19` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:43` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs:25` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/check-protocol-append-sites.cjs:35` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:14` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:537` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:44` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2282` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:15` — mechanical
- `.opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs:47` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/council/session-state-hierarchy.vitest.ts:22` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts:59` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/fixtures/council-value/seed-helpers.ts:139` — manual
- `.opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts:118` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/validate-playbook-package.cjs:23` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts:543` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts:51` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts:18` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts:46` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:119` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts:278` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:589` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1001` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/mode-append-gateway.vitest.ts:972` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts:124` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:165` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1011` — mechanical
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:264` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 261 | 73 | 1368 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md`; `.opencode/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md`; `.opencode/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/artifact-persistence-and-state-format/state-jsonl-records-council-complete-event.md` |
| feature catalog | 139 | 0 | 558 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/system-deep-loop/deep-ai-council/feature-catalog/artifact-persistence-and-state-format/output-schema-strict-required-sections-fail-closed.md`; `.opencode/skills/system-deep-loop/deep-ai-council/feature-catalog/artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md`; `.opencode/skills/system-deep-loop/deep-ai-council/feature-catalog/artifact-persistence-and-state-format/state-jsonl-records-council-complete-event.md` |
| top-level skill doc | 76 | 56 | 124 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/system-deep-loop/README.md`; `.opencode/skills/system-deep-loop/SKILL.md`; `.opencode/skills/system-deep-loop/deep-ai-council/README.md` |
| historical record (changelog) | 76 | 2 | 501 | freeze | may keep historical paths | `.opencode/skills/system-deep-loop/changelog/v1.0.0.0.md`; `.opencode/skills/system-deep-loop/changelog/v1.1.0.0.md`; `.opencode/skills/system-deep-loop/changelog/v2.0.0.0.md` |
| references | 43 | 58 | 130 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md`; `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md`; `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/failure-handling.md` |
| benchmark material | 41 | 49 | 19 | freeze | recorded measurements from past runs | `.opencode/skills/system-deep-loop/benchmark/reports/baseline/source.md`; `.opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md`; `.opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.md` |
| test documentation/fixtures | 18 | 19 | 5 | mechanical | test-owned content; rewrite or regenerate | `.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/README.md`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/tests/README.md`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md` |
| assets | 8 | 8 | 7 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/README.md`; `.opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/improvement-charter.md`; `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/README.md` |
| other documentation | 7 | 6 | 6 | manual | classify by hand | `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/MODES.md`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/5036729e69ce24c3ba32d9bf748e6152.out.md`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8429f8a8a9d13c87e2176d57a49648c5.out.md` |

### Map C · skill `cli-external-orchestration`

**Code: 200 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json:16` — freeze
- `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/2026-08-08--manual-testing-playbook--claude/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--agent-routing-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--agent-routing-3/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--agent-routing-4/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--agent-routing/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--built-in-tools/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--cli-invocation/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-10/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-11/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-12/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-13/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-14/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-15/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-16/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-17/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-18/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-19/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-20/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-21/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-22/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-23/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-24/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-25/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-26/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-27/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-28/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-29/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-3/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-4/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-5/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-6/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-7/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-8/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-9/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex-cloud/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--codex/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--integration-patterns/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--prompt-templates-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--prompt-templates/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--sandbox-modes-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--sandbox-modes/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--session-continuity-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--session-continuity/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--agents-skills-rules/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-10/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-11/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-12/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-13/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-14/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-15/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-16/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-17/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-18/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-19/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-20/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-21/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-22/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-23/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-24/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-25/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-26/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-27/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-28/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-3/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-4/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-5/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-6/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-7/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-8/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor-9/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--cursor/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--execution-modes/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--git-preflight-advisory/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-08-08--manual-testing-playbook--mcp-integration/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--commands-and-skills-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--commands-and-skills/results.csv:2` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--commands-and-skills/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-10/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-11/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-12/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-13/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-14/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-15/results.csv:2` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-15/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-16/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-17/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-18/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-19/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-2/results.csv:2` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-20/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-21/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-22/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-3/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-4/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-5/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-6/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-7/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-8/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin-9/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--devin/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--hooks-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--hooks/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-08--manual-testing-playbook--subagents/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-09--manual-testing-playbook--commands-and-skills/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-09--manual-testing-playbook--hooks/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-devin/benchmark/reports/2026-08-09--manual-testing-playbook--subagents/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-hermes/benchmark/reports/2026-09-14-phase-008-first-pass/results.csv:10` — freeze
- `.opencode/skills/cli-external-orchestration/cli-hermes/benchmark/reports/2026-09-14-phase-008-first-pass/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/cli-external-orchestration/cli-hermes/benchmark/reports/2026-09-14-phase-008-second-pass/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/cli-external-orchestration/cli-hermes/benchmark/reports/2026-09-15-phase-008-third-pass/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/assets/permissions-matrix.example-packet-local.json:13` — mechanical
- `.opencode/skills/cli-external-orchestration/cli-opencode/assets/permissions-matrix.example-repo-wide.json:3` — mechanical
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--cli-invocation/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-10/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-11/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-12/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-13/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-14/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-15/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-16/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-17/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-18/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-19/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-20/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-21/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-22/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-23/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-24/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-25/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-26/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-27/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-28/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-29/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-3/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-30/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-31/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-32/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-33/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-34/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-35/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-36/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-37/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-38/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-39/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-4/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-40/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-41/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-42/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-43/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-44/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-45/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-5/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-6/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-7/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-8/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode-9/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--opencode/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-opencode/benchmark/reports/2026-08-08--manual-testing-playbook--prompt-templates/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--agent-bridge/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--cli-invocation/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--git-preflight-advisory/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--mcp-host-integration-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--mcp-host-integration/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-10/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-11/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-12/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-13/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-14/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-15/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-16/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-17/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-18/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-19/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-20/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-21/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-22/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-23/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-3/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-4/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-5/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-6/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-7/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-8/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-9/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/cli-external-orchestration/graph-metadata.json:323` — regenerate

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 227 | 189 | 334 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/agent-routing/context-agent-codebase-exploration.md`; `.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/agent-routing/handover-agent-context-transfer.md`; `.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/agent-routing/orchestrate-agent-multi-step.md` |
| benchmark material | 211 | 0 | 237 | freeze | recorded measurements from past runs | `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md`; `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.md`; `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.md` |
| historical record (changelog) | 63 | 0 | 255 | freeze | may keep historical paths | `.opencode/skills/cli-external-orchestration/changelog/v1.0.0.0.md`; `.opencode/skills/cli-external-orchestration/cli-claude-code/changelog/v1.0.0.0.md`; `.opencode/skills/cli-external-orchestration/cli-claude-code/changelog/v1.1.1.0.md` |
| references | 21 | 13 | 57 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md`; `.opencode/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md`; `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md` |
| feature catalog | 16 | 0 | 102 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/cli-external-orchestration/cli-hermes/feature-catalog/dispatch-guards/dispatch-shape-recognition.md`; `.opencode/skills/cli-external-orchestration/cli-hermes/feature-catalog/dispatch-guards/hard-rule-preflight-checks.md`; `.opencode/skills/cli-external-orchestration/cli-hermes/feature-catalog/fanout-dispatch/closed-model-roster.md` |
| top-level skill doc | 14 | 17 | 43 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/cli-external-orchestration/README.md`; `.opencode/skills/cli-external-orchestration/SKILL.md`; `.opencode/skills/cli-external-orchestration/cli-claude-code/README.md` |
| assets | 4 | 8 | 0 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/cli-external-orchestration/cli-claude-code/assets/prompt-templates.md`; `.opencode/skills/cli-external-orchestration/cli-codex/assets/prompt-templates.md`; `.opencode/skills/cli-external-orchestration/cli-devin/assets/prompt-templates.md` |

### Map C · skill `system-skill-advisor`

**Code: 138 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/system-skill-advisor/graph-metadata.json:104` — regenerate
- `.opencode/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts:18` — mechanical
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:47` — mechanical
- `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:173` — mechanical
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:48` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/advisor-server.ts:50` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/bench/scorer-bench.ts:26` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:70` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/bench/watcher-benchmark.ts:44` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts:88` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:337` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:33` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:214` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/handlers/skill-graph/propagate-enhances.ts:53` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:44` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:25` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/corpus/df-idf.ts:79` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/daemon/lease.ts:56` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:129` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/embedders/adapter.ts:7` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/freshness.ts:85` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:13` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/policy-plan.ts:125` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:75` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:61` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:42` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:248` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/skill-graph/metadata-sanitizer.ts:17` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:277` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/subprocess.ts:273` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts:20` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:21` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:19` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:147` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:9` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:17` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:12` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh:16` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:30` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:52` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs:59` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:18` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:21` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:42` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:8` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh:13` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:103` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:193` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/advisor-recommend-handler-stress.vitest.ts:89` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts:54` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/chokidar-narrow-scope-stress.vitest.ts:27` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/daemon-lifecycle-stress.vitest.ts:32` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/df-idf-corpus-stress.vitest.ts:27` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/hooks-parity-stress.vitest.ts:11` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts:44` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts:15` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-bench-runner-stress.vitest.ts:27` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-compat-stress.vitest.ts:22` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/skill-projection-stress.vitest.ts:44` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/trust-state-stress.vitest.ts:65` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/advisor-rebuild.vitest.ts:87` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/affordance-normalizer.test.ts:53` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/cache/df-idf-cache.vitest.ts:30` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/cli-exit-taxonomy.vitest.ts:4` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/command-binding-existence.vitest.ts:5` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts:6` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:40` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts:30` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts:15` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts:13` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/daemon-freshness-foundation.vitest.ts:52` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts:60` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/daemon-watcher-resource-leaks-049-005.vitest.ts:55` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/discovery-pipeline-parity.vitest.ts:28` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/fixtures/lifecycle/index.ts:22` — manual
- `.opencode/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:16` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/handlers/skill-graph-corrupt-honesty.vitest.ts:22` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/handlers/skill-graph-dispatch.vitest.ts:50` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/handlers/skill-graph-scan-auth.vitest.ts:60` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/hooks/settings-driven-invocation-parity.vitest.ts:53` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/lane-attribution.test.ts:24` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:494` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/launcher-lease.vitest.ts:25` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/launcher-reap-pid-reuse.vitest.ts:117` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts:51` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-freshness.vitest.ts:31` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-graph-evidence-calibration.vitest.ts:15` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/legacy/advisor-graph-health.vitest.ts:15` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts:59` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts:15` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/metadata-sanitizer-entities-guard.vitest.ts:18` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/migration-lineage-identity.vitest.ts:11` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/parent-skill-check-fixtures.vitest.ts:27` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:43` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:82` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:72` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:75` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/policy-plan.vitest.ts:63` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:8` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/rename-invariants.vitest.ts:31` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/route-exclusions.vitest.ts:65` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/routing-fixtures.affordance.test.ts:24` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/routing-golden-prompts.vitest.ts:30` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/routing-parity-deep-council.vitest.ts:22` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/routing-parity-deep-skills.vitest.ts:24` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts:24` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts:36` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/advisor-feedback-calibration.vitest.ts:53` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/advisor-quality-049-003.vitest.ts:37` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/advisor-self-recommendation-penalty-contract.vitest.ts:41` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/ambiguity-slice.vitest.ts:41` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/bm25-lexical-shadow.vitest.ts:34` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts:40` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation-cache.vitest.ts:26` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts:47` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/graph-causal-visited-order.vitest.ts:26` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:34` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts:41` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/projection-embedding-staleness.vitest.ts:18` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/projection-fallback-049-005.vitest.ts:20` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/projection-freshness.vitest.ts:37` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/provenance-self-boost-guard.vitest.ts:20` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/rrf-determinism-spine.vitest.ts:59` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/runtime-lane-health.vitest.ts:24` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts:64` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-job-semantics.vitest.ts:117` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:35` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:33` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts:110` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts:305` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/skill-graph-handlers.vitest.ts:92` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-roundtrip.vitest.ts:87` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/state-containment.vitest.ts:21` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/tri-daemon-drill.vitest.ts:55` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts:5` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tests/vocabulary-agreement.vitest.ts:20` — mechanical
- `.opencode/skills/system-skill-advisor/runtime/tools/skill-graph-tools.ts:23` — mechanical
- `.opencode/skills/system-skill-advisor/scripts/doctor.sh:10` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 48 | 268 | 128 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/anti-stuffing.md`; `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md`; `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/derived-extraction.md` |
| top-level skill doc | 42 | 55 | 48 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/system-skill-advisor/ARCHITECTURE.md`; `.opencode/skills/system-skill-advisor/README.md`; `.opencode/skills/system-skill-advisor/SKILL.md` |
| feature catalog | 39 | 0 | 193 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/anti-stuffing.md`; `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/derived-extraction.md`; `.opencode/skills/system-skill-advisor/feature-catalog/auto-indexing/df-idf-corpus.md` |
| test documentation/fixtures | 16 | 20 | 1 | mechanical | test-owned content; rewrite or regenerate | `.opencode/skills/system-skill-advisor/runtime/tests/README.md`; `.opencode/skills/system-skill-advisor/runtime/tests/__fixtures__/README.md`; `.opencode/skills/system-skill-advisor/runtime/tests/cache/README.md` |
| historical record (changelog) | 10 | 0 | 37 | freeze | may keep historical paths | `.opencode/skills/system-skill-advisor/changelog/v0.1.0.md`; `.opencode/skills/system-skill-advisor/changelog/v0.10.0.md`; `.opencode/skills/system-skill-advisor/changelog/v0.2.0.md` |
| references | 10 | 23 | 31 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/system-skill-advisor/references/config/db-path-policy.md`; `.opencode/skills/system-skill-advisor/references/decisions/deferred-decisions.md`; `.opencode/skills/system-skill-advisor/references/graph/skill-graph-drift.md` |
| other documentation | 3 | 64 | 40 | manual | classify by hand | `.opencode/skills/system-skill-advisor/INSTALL-GUIDE.md`; `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md`; `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md` |

### Map C · skill `sk-code`

**Code: 37 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/sk-code/benchmark/reports/2026-06-01--after--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/2026-06-01--full--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live-final--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live-remediated--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/2026-06-01--router-final--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/2026-06-02--d4r-live--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/2026-07-10--router-baseline--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/baseline/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json:7` — freeze
- `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/sk-code/graph-metadata.json:254` — regenerate
- `.opencode/skills/sk-code/mode-registry.json:50` — regenerate
- `.opencode/skills/sk-code/sk-code-mobile-cli/scripts/run-source-gates.sh:26` — mechanical
- `.opencode/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh:27` — mechanical
- `.opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py:106` — mechanical
- `.opencode/skills/sk-code/sk-code-opencode/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/sk-code-opencode/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:14` — mechanical
- `.opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:32` — mechanical
- `.opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh:6` — mechanical
- `.opencode/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:35` — mechanical
- `.opencode/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh:8` — mechanical
- `.opencode/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs:7` — mechanical
- `.opencode/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:7` — mechanical
- `.opencode/skills/sk-code/sk-code-webflow/assets/scripts/verify-minification.mjs:7` — mechanical
- `.opencode/skills/sk-code/sk-code-webflow/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-code/sk-code-webflow/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:9` — freeze

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 118 | 61 | 478 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md`; `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/cwv-gates-animation-heavy.md`; `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/decision-matrix-routing.md` |
| references | 51 | 49 | 217 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/sk-code/shared/references/stack-detection.md`; `.opencode/skills/sk-code/shared/references/universal-debugging-checklist.md`; `.opencode/skills/sk-code/shared/references/universal-verification-checklist.md` |
| benchmark material | 28 | 2 | 45 | freeze | recorded measurements from past runs | `.opencode/skills/sk-code/benchmark/reports/2026-06-01--after--router/source.md`; `.opencode/skills/sk-code/benchmark/reports/2026-06-01--full--router/source.md`; `.opencode/skills/sk-code/benchmark/reports/2026-06-01--live--live/source.md` |
| top-level skill doc | 17 | 9 | 71 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-code/README.md`; `.opencode/skills/sk-code/ROUTER.md`; `.opencode/skills/sk-code/SKILL.md` |
| historical record (changelog) | 14 | 0 | 74 | freeze | may keep historical paths | `.opencode/skills/sk-code/changelog/v3.1.0.0.md`; `.opencode/skills/sk-code/changelog/v3.2.0.0.md`; `.opencode/skills/sk-code/changelog/v3.2.1.0.md` |
| assets | 13 | 15 | 68 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/sk-code/shared/assets/patterns/README.md`; `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/agent-authoring.md`; `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/command-authoring.md` |
| feature catalog | 3 | 0 | 15 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-code/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`; `.opencode/skills/sk-code/feature-catalog/feature-catalog.md`; `.opencode/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` |
| templates | 1 | 2 | 3 | mechanical | emitted into packets; rewrite paths | `.opencode/skills/sk-code/sk-code-webflow/assets/templates/README.md` |

### Map C · skill `sk-doc`

**Code: 73 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/cli-external-orchestration.json:9` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/mcp-tooling.json:9` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-code.json:9` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-design.json:9` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-doc.json:9` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-prompt.json:9` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/system-deep-loop.json:9` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/report.json:27` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json:9` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/sk-doc/command-metadata.json:19` — regenerate
- `.opencode/skills/sk-doc/graph-metadata.json:344` — regenerate
- `.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json:59` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:10` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:11` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_category_classification_denumbered.py:23` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_changelog_validator.py:18` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_code_folder_readme.py:14` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py:44` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_naming_root_resolver.py:46` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py:115` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_quick_validate_086.py:6` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_readme_manifest.py:13` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py:19` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_root_name_consumer_matrix.py:15` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_structure_validation.py:11` — mechanical
- `.opencode/skills/sk-doc/scripts/tests/test_validate_catalog_package.py:4` — mechanical
- `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js:338` — mechanical
- `.opencode/skills/sk-doc/shared/assets/template-rules.json:139` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:5` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/check_install_entries.py:91` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py:52` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:188` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/check_no_numbered_categories.py:13` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/check_no_numbered_snippet_files.py:11` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs:8` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py:26` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/reference_checker_core.py:77` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/reference_checker_extractors.py:84` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/resolve_skill_markdown_links.py:65` — mechanical
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py:238` — mechanical
- `.opencode/skills/sk-doc/sk-create-benchmark/scripts/archive-compiled-routing.cjs:36` — mechanical
- `.opencode/skills/sk-doc/sk-create-benchmark/scripts/render-serving-snapshot.cjs:28` — mechanical
- `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json:15` — mechanical
- `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py:36` — mechanical
- `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:107` — mechanical
- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json:6` — mechanical
- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt:15` — mechanical
- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:45` — mechanical
- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:44` — mechanical
- `.opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py:16` — mechanical
- `.opencode/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py:7` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-command-metadata-template.json:2` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json:88` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-graph-metadata-template.json:31` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-lockstep-surfaces.json:11` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:23` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:29` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:27` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py:130` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/command-metadata-schema.cjs:118` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py:20` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:33` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/advisor-index-handoff-contract.test.cjs:18` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/compiled-routing-lockstep-parity.test.cjs:124` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs:18` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs:36` — mechanical
- `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py:18` — mechanical
- `.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:9` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 76 | 2 | 211 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-doc/manual-testing-playbook/agent-dispatch/markdown-agent-cli-claude-code.md`; `.opencode/skills/sk-doc/manual-testing-playbook/agent-dispatch/markdown-agent-cli-opencode.md`; `.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` |
| top-level skill doc | 35 | 86 | 108 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-doc/README.md`; `.opencode/skills/sk-doc/SKILL.md`; `.opencode/skills/sk-doc/scripts/README.md` |
| references | 34 | 66 | 72 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/sk-doc/shared/references/core-standards.md`; `.opencode/skills/sk-doc/shared/references/quick-reference.md`; `.opencode/skills/sk-doc/shared/references/validation.md` |
| assets | 24 | 43 | 80 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md`; `.opencode/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md`; `.opencode/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md` |
| historical record (changelog) | 15 | 0 | 30 | freeze | may keep historical paths | `.opencode/skills/sk-doc/changelog/v1.5.0.0.md`; `.opencode/skills/sk-doc/changelog/v1.6.0.0.md`; `.opencode/skills/sk-doc/changelog/v1.7.0.0.md` |
| benchmark material | 14 | 5 | 26 | freeze | recorded measurements from past runs | `.opencode/skills/sk-doc/benchmark/README.md`; `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.md`; `.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/source.md` |
| feature catalog | 3 | 0 | 14 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`; `.opencode/skills/sk-doc/feature-catalog/feature-catalog.md`; `.opencode/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md` |
| test documentation/fixtures | 3 | 3 | 5 | mechanical | test-owned content; rewrite or regenerate | `.opencode/skills/sk-doc/scripts/tests/README.md`; `.opencode/skills/sk-doc/scripts/tests/code-folder/negative/durability-leak/README.md`; `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/README.md` |
| other documentation | 3 | 0 | 3 | manual | classify by hand | `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/fixtures/prose-path/negative/leaf.md`; `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/fixtures/prose-path/positive/leaf.md`; `.opencode/skills/sk-doc/sk-create-feature-catalog/scripts/fixtures/shipped-label/positive/leaf.md` |

### Map C · skill `mcp-tooling`

**Code: 16 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--live/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/mcp-tooling/benchmark/reports/baseline/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--unspecified/report.json:4` — freeze
- `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/mcp-tooling/graph-metadata.json:351` — regenerate
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh:394` — mechanical
- `.opencode/skills/mcp-tooling/mcp-click-up/examples/task-queue-workflow.sh:41` — mechanical
- `.opencode/skills/mcp-tooling/mcp-click-up/examples/time-tracking-workflow.sh:44` — mechanical
- `.opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh:222` — mechanical
- `.opencode/skills/mcp-tooling/mcp-figma/examples/safe-connect-daemon-health.sh:43` — mechanical
- `.opencode/skills/mcp-tooling/mcp-notion/scripts/install.sh:183` — mechanical
- `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh:237` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 97 | 0 | 242 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md`; `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/direct-task.md`; `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md` |
| top-level skill doc | 25 | 25 | 37 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/mcp-tooling/README.md`; `.opencode/skills/mcp-tooling/SKILL.md`; `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` |
| historical record (changelog) | 13 | 0 | 37 | freeze | may keep historical paths | `.opencode/skills/mcp-tooling/changelog/v1.0.0.0.md`; `.opencode/skills/mcp-tooling/changelog/v1.5.0.0.md`; `.opencode/skills/mcp-tooling/changelog/v1.6.1.0.md` |
| benchmark material | 12 | 2 | 19 | freeze | recorded measurements from past runs | `.opencode/skills/mcp-tooling/benchmark/README.md`; `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--live/source.md`; `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--router/source.md` |
| other documentation | 12 | 19 | 23 | manual | classify by hand | `.opencode/skills/mcp-tooling/mcp-aside-devtools/INSTALL-GUIDE.md`; `.opencode/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md`; `.opencode/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md` |
| references | 5 | 1 | 5 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md`; `.opencode/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md`; `.opencode/skills/mcp-tooling/mcp-magicpath/references/credential-setup.md` |
| feature catalog | 4 | 0 | 15 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/mcp-tooling/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`; `.opencode/skills/mcp-tooling/feature-catalog/feature-catalog.md`; `.opencode/skills/mcp-tooling/feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md` |
| assets | 1 | 1 | 2 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/mcp-tooling/mcp-magicpath/assets/utcp-magicpath-manual.md` |

### Map C · skill `sk-design`

**Code: 21 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/sk-design/command-metadata.json:24` — regenerate
- `.opencode/skills/sk-design/graph-metadata.json:340` — regenerate
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--create-diagram-command/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--drawio-import/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--editorial-style-and-connectors/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--export-guidance/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--hub-registration/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--mermaid-import/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--onboarding-flow/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--primitive-variants/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--type-selection-and-routing/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-3/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-4/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/design-md-sample.html:10` — manual
- `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs:46` — mechanical
- `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/cli.ts:15` — mechanical
- `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts:213` — mechanical
- `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/output-policy.ts:30` — mechanical
- `.opencode/skills/sk-design/sk-design-md-generator/backend/tests/guided-run.test.ts:10` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 46 | 2 | 158 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-design/manual-testing-playbook/holdout/flowchart-natural.md`; `.opencode/skills/sk-design/manual-testing-playbook/holdout/ind-flowchart.md`; `.opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md` |
| benchmark material | 18 | 1 | 17 | freeze | recorded measurements from past runs | `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--create-diagram-command/source.md`; `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--drawio-import/source.md`; `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--editorial-style-and-connectors/source.md` |
| top-level skill doc | 10 | 34 | 13 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-design/SKILL.md`; `.opencode/skills/sk-design/sk-design-chart/README.md`; `.opencode/skills/sk-design/sk-design-chart/scripts/README.md` |
| references | 7 | 6 | 6 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md`; `.opencode/skills/sk-design/sk-design-diagram/references/design-md-theming.md`; `.opencode/skills/sk-design/sk-design-diagram/references/foundations/onboarding.md` |
| feature catalog | 4 | 0 | 13 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/command-and-hub-integration/design-diagram-command.md`; `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/command-and-hub-integration/hub-registration.md`; `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/diagram-generation/type-selection-and-routing.md` |
| historical record (changelog) | 1 | 0 | 1 | freeze | may keep historical paths | `.opencode/skills/sk-design/sk-design-chart/changelog/v0.23.0.0.md` |
| other documentation | 1 | 5 | 0 | manual | classify by hand | `.opencode/skills/sk-design/sk-design-md-generator/INSTALL-GUIDE.md` |

### Map C · skill `sk-vision`

**Code: 14 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--status-live-run/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-017-standalone/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-018-cursor-status/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status-pass/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind-pass/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind-pass/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind/skill-benchmark-report.json:7` — freeze
- `.opencode/skills/sk-vision/benchmark/reports/supersession-manifest.json:5` — freeze
- `.opencode/skills/sk-vision/graph-metadata.json:57` — regenerate
- `.opencode/skills/sk-vision/hooks/pi/sk-vision.ts:20` — mechanical
- `.opencode/skills/sk-vision/vision-runtime/scripts/build.ts:55` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 23 | 1 | 51 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-vision/manual-testing-playbook/guaranteed-vision/auto-inspect-guarantee.md`; `.opencode/skills/sk-vision/manual-testing-playbook/guaranteed-vision/classifier-and-env.md`; `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/devin-hook.md` |
| benchmark material | 21 | 3 | 21 | freeze | recorded measurements from past runs | `.opencode/skills/sk-vision/benchmark/README.md`; `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/skill-benchmark-report.md`; `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/source.md` |
| top-level skill doc | 3 | 3 | 11 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-vision/README.md`; `.opencode/skills/sk-vision/SKILL.md`; `.opencode/skills/sk-vision/hooks/README.md` |
| feature catalog | 3 | 0 | 4 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-vision/feature-catalog/feature-catalog.md`; `.opencode/skills/sk-vision/feature-catalog/host-adapters/devin-hook.md`; `.opencode/skills/sk-vision/feature-catalog/host-adapters/opencode-plugin.md` |
| historical record (changelog) | 2 | 0 | 31 | freeze | may keep historical paths | `.opencode/skills/sk-vision/changelog/v0.2.0.0.md`; `.opencode/skills/sk-vision/changelog/v0.3.0.0.md` |
| other documentation | 2 | 1 | 1 | manual | classify by hand | `.opencode/skills/sk-vision/hooks/cursor/vision-rule.md`; `.opencode/skills/sk-vision/hooks/devin/vision-rule.md` |

### Map C · skill `sk-git`

**Code: 9 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--glm-5-2-high/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--kimi-2-7/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-git/graph-metadata.json:156` — regenerate
- `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:112` — mechanical
- `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs:83` — mechanical
- `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts:7` — mechanical
- `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs:105` — mechanical
- `.opencode/skills/sk-git/scripts/worktree-naming.sh:145` — mechanical
- `.opencode/skills/sk-git/scripts/worktree-provision-paths.txt:16` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 14 | 0 | 22 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md`; `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/scope-inference-skill-folder.md`; `.opencode/skills/sk-git/manual-testing-playbook/git-preflight-advisory/advisory-fires-on-silent-scope-drop.md` |
| feature catalog | 11 | 0 | 44 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-git/feature-catalog/feature-catalog.md`; `.opencode/skills/sk-git/feature-catalog/remote-platform-integration/github-mcp-integration.md`; `.opencode/skills/sk-git/feature-catalog/remote-platform-integration/gitkraken-mcp-integration.md` |
| references | 8 | 40 | 13 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/sk-git/references/continuous-integration.md`; `.opencode/skills/sk-git/references/finish-workflows.md`; `.opencode/skills/sk-git/references/large-reorg-playbook.md` |
| historical record (changelog) | 7 | 0 | 16 | freeze | may keep historical paths | `.opencode/skills/sk-git/changelog/v1.0.2.1.md`; `.opencode/skills/sk-git/changelog/v1.0.8.0.md`; `.opencode/skills/sk-git/changelog/v1.0.9.0.md` |
| top-level skill doc | 6 | 21 | 22 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-git/README.md`; `.opencode/skills/sk-git/SKILL.md`; `.opencode/skills/sk-git/scripts/README.md` |
| assets | 2 | 6 | 0 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/sk-git/assets/commit-message-template.md`; `.opencode/skills/sk-git/assets/worktree-checklist.md` |
| benchmark material | 2 | 0 | 2 | freeze | recorded measurements from past runs | `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--glm-5-2-high/source.md`; `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--kimi-2-7/source.md` |
| test documentation/fixtures | 1 | 1 | 0 | mechanical | test-owned content; rewrite or regenerate | `.opencode/skills/sk-git/scripts/tests/README.md` |

### Map C · skill `sk-prompt`

**Code: 7 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json:9` — freeze
- `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json:7` — freeze
- `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json:25` — freeze
- `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json:4` — freeze
- `.opencode/skills/sk-prompt/graph-metadata.json:102` — regenerate

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 29 | 0 | 33 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/clear-five-dimensions.md`; `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/dimension-drilldown-rationale.md`; `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/dimension-floors-block.md` |
| historical record (changelog) | 9 | 0 | 22 | freeze | may keep historical paths | `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md`; `.opencode/skills/sk-prompt/changelog/v1.2.0.0.md`; `.opencode/skills/sk-prompt/changelog/v1.4.0.0.md` |
| benchmark material | 7 | 0 | 11 | freeze | recorded measurements from past runs | `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-mode-a--router/source.md`; `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.md`; `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.md` |
| top-level skill doc | 2 | 1 | 2 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-prompt/README.md`; `.opencode/skills/sk-prompt/SKILL.md` |
| assets | 1 | 1 | 1 | mechanical | templates and prompt assets; rewrite paths | `.opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md` |

### Map C · skill `mcp-code-mode`

**Code: 4 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/mcp-code-mode/graph-metadata.json:76` — regenerate
- `.opencode/skills/mcp-code-mode/scripts/doctor.sh:9` — mechanical
- `.opencode/skills/mcp-code-mode/scripts/install.sh:58` — mechanical
- `.opencode/skills/mcp-code-mode/scripts/update.sh:110` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| manual testing playbook | 25 | 12 | 41 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/chrome-navigate-screenshot.md`; `.opencode/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/sibling-pair-handover.md`; `.opencode/skills/mcp-code-mode/manual-testing-playbook/core-tools/call-tool-chain-execution.md` |
| historical record (changelog) | 9 | 0 | 31 | freeze | may keep historical paths | `.opencode/skills/mcp-code-mode/changelog/v1.0.0.0.md`; `.opencode/skills/mcp-code-mode/changelog/v1.0.0.31.md`; `.opencode/skills/mcp-code-mode/changelog/v1.0.1.0.md` |
| top-level skill doc | 3 | 2 | 7 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/mcp-code-mode/README.md`; `.opencode/skills/mcp-code-mode/SKILL.md`; `.opencode/skills/mcp-code-mode/scripts/README.md` |
| other documentation | 1 | 2 | 2 | manual | classify by hand | `.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md` |
| references | 1 | 2 | 0 | mechanical | mixed prose and runnable snippets; rewrite paths | `.opencode/skills/mcp-code-mode/references/tool-catalog.md` |

### Map C · skill `sk-communication`

**Code: 3 non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.

- `.opencode/skills/sk-communication/benchmark/reply-harness/cases.json:18` — freeze
- `.opencode/skills/sk-communication/benchmark/reports/advisor-routing-smoke-2026-08-12.json:5` — freeze
- `.opencode/skills/sk-communication/graph-metadata.json:92` — regenerate

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| feature catalog | 13 | 0 | 89 | mechanical | prose describing current behavior; rewrite paths | `.opencode/skills/sk-communication/feature-catalog/assembly-and-context/bounded-context-selection.md`; `.opencode/skills/sk-communication/feature-catalog/assembly-and-context/generation-keyed-message-assembly.md`; `.opencode/skills/sk-communication/feature-catalog/evaluation-and-observability/blind-non-inferiority-evaluation.md` |
| manual testing playbook | 11 | 0 | 57 | mechanical | runnable steps; rewrite paths, review by hand | `.opencode/skills/sk-communication/manual-testing-playbook/advisor-routing/advisor-routes-projection-request.md`; `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/claim-omission-and-no-op.md`; `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/exact-original-fidelity-fallback.md` |
| top-level skill doc | 2 | 4 | 9 | mechanical | load-bearing doc; rewrite paths | `.opencode/skills/sk-communication/README.md`; `.opencode/skills/sk-communication/SKILL.md` |
| other documentation | 2 | 0 | 4 | manual | classify by hand | `.opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md`; `.opencode/skills/sk-communication/cli-communication-projection/docs/rollback.md` |
| benchmark material | 1 | 1 | 1 | freeze | recorded measurements from past runs | `.opencode/skills/sk-communication/benchmark/README.md` |
| historical record (changelog) | 1 | 0 | 3 | freeze | may keep historical paths | `.opencode/skills/sk-communication/changelog/v1.0.0.0.md` |

### Map C · `.opencode/skills` root files (area `opencode:skills`, 3 files)

- `.opencode/skills/README.txt:31` — mechanical (7 matching lines; runnable commands)
- `.opencode/skills/.state/advisor/README.md:21` — mechanical (1 matching line)
- `.opencode/skills/.state/smart-router-telemetry/README.md:75` — mechanical (3 matching lines; the L88 bug record is `none`)

### Map C · `.opencode/commands`

**Code: 103 files.**

- `.opencode/commands/README.txt:246` — mechanical
- `.opencode/commands/create/README.txt:136` — mechanical
- `.opencode/commands/create/assets/create-agent-auto.yaml:45` — mechanical
- `.opencode/commands/create/assets/create-agent-confirm.yaml:46` — mechanical
- `.opencode/commands/create/assets/create-agent-presentation.txt:60` — mechanical
- `.opencode/commands/create/assets/create-benchmark-auto.yaml:139` — mechanical
- `.opencode/commands/create/assets/create-benchmark-confirm.yaml:114` — mechanical
- `.opencode/commands/create/assets/create-benchmark-presentation.txt:45` — mechanical
- `.opencode/commands/create/assets/create-changelog-auto.yaml:44` — mechanical
- `.opencode/commands/create/assets/create-changelog-confirm.yaml:44` — mechanical
- `.opencode/commands/create/assets/create-command-auto.yaml:46` — mechanical
- `.opencode/commands/create/assets/create-command-confirm.yaml:47` — mechanical
- `.opencode/commands/create/assets/create-command-presentation.txt:13` — mechanical
- `.opencode/commands/create/assets/create-diff-auto.yaml:157` — mechanical
- `.opencode/commands/create/assets/create-diff-confirm.yaml:157` — mechanical
- `.opencode/commands/create/assets/create-diff-presentation.txt:13` — mechanical
- `.opencode/commands/create/assets/create-feature-catalog-auto.yaml:45` — mechanical
- `.opencode/commands/create/assets/create-feature-catalog-confirm.yaml:45` — mechanical
- `.opencode/commands/create/assets/create-feature-catalog-presentation.txt:46` — mechanical
- `.opencode/commands/create/assets/create-manual-testing-playbook-auto.yaml:45` — mechanical
- `.opencode/commands/create/assets/create-manual-testing-playbook-confirm.yaml:45` — mechanical
- `.opencode/commands/create/assets/create-manual-testing-playbook-presentation.txt:46` — mechanical
- `.opencode/commands/create/assets/create-readme-auto.yaml:37` — mechanical
- `.opencode/commands/create/assets/create-readme-confirm.yaml:9` — mechanical
- `.opencode/commands/create/assets/create-readme-presentation.txt:52` — mechanical
- `.opencode/commands/create/assets/create-repo-rule-auto.yaml:23` — mechanical
- `.opencode/commands/create/assets/create-repo-rule-confirm.yaml:36` — mechanical
- `.opencode/commands/create/assets/create-skill-auto.yaml:48` — mechanical
- `.opencode/commands/create/assets/create-skill-confirm.yaml:48` — mechanical
- `.opencode/commands/create/assets/create-skill-parent-auto.yaml:45` — mechanical
- `.opencode/commands/create/assets/create-skill-parent-confirm.yaml:45` — mechanical
- `.opencode/commands/create/assets/create-skill-parent-presentation.txt:46` — mechanical
- `.opencode/commands/create/assets/create-skill-presentation.txt:44` — mechanical
- `.opencode/commands/create/assets/create-with-human-voice-auto.yaml:23` — mechanical
- `.opencode/commands/create/assets/create-with-human-voice-confirm.yaml:36` — mechanical
- `.opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json:62` — manual
- `.opencode/commands/create/assets/tests/test_emitted_name_contract.py:8` — mechanical
- `.opencode/commands/create/assets/tests/test_skill_parent_router_parity.py:15` — mechanical
- `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml:37` — mechanical
- `.opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml:38` — mechanical
- `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt:17` — mechanical
- `.opencode/commands/deep/assets/deep-ai-council-auto.yaml:40` — mechanical
- `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml:40` — mechanical
- `.opencode/commands/deep/assets/deep-ai-council-presentation.txt:15` — mechanical
- `.opencode/commands/deep/assets/deep-model-benchmark-auto.yaml:38` — mechanical
- `.opencode/commands/deep/assets/deep-model-benchmark-confirm.yaml:38` — mechanical
- `.opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:15` — mechanical
- `.opencode/commands/deep/assets/deep-research-auto.yaml:11` — mechanical
- `.opencode/commands/deep/assets/deep-research-confirm.yaml:79` — mechanical
- `.opencode/commands/deep/assets/deep-research-presentation.txt:15` — mechanical
- `.opencode/commands/deep/assets/deep-review-auto.yaml:54` — mechanical
- `.opencode/commands/deep/assets/deep-review-confirm.yaml:53` — mechanical
- `.opencode/commands/deep/assets/deep-review-presentation.txt:15` — mechanical
- `.opencode/commands/design/assets/chart-auto.yaml:24` — mechanical
- `.opencode/commands/design/assets/chart-confirm.yaml:37` — mechanical
- `.opencode/commands/design/assets/chart-presentation.txt:12` — mechanical
- `.opencode/commands/design/assets/diagram-auto.yaml:182` — mechanical
- `.opencode/commands/design/assets/diagram-confirm.yaml:150` — mechanical
- `.opencode/commands/design/assets/diagram-presentation.txt:13` — mechanical
- `.opencode/commands/design/assets/extract-auto.yaml:149` — mechanical
- `.opencode/commands/design/assets/extract-confirm.yaml:29` — mechanical
- `.opencode/commands/design/assets/extract-presentation.txt:38` — mechanical
- `.opencode/commands/doctor/_routes.yaml:5` — mechanical
- `.opencode/commands/doctor/assets/doctor-deep-loop.yaml:83` — mechanical
- `.opencode/commands/doctor/assets/doctor-embeddings.yaml:21` — mechanical
- `.opencode/commands/doctor/assets/doctor-fable-mode.yaml:7` — mechanical
- `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml:42` — mechanical
- `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:43` — mechanical
- `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt:50` — mechanical
- `.opencode/commands/doctor/assets/doctor-parent-skill.yaml:59` — mechanical
- `.opencode/commands/doctor/assets/doctor-router-reach.yaml:52` — mechanical
- `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:5` — mechanical
- `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml:35` — mechanical
- `.opencode/commands/doctor/assets/doctor-skill-budget.yaml:36` — mechanical
- `.opencode/commands/doctor/assets/doctor-skill-graph-freshness.yaml:43` — mechanical
- `.opencode/commands/doctor/assets/doctor-speckit-presentation.txt:104` — mechanical
- `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml:23` — mechanical
- `.opencode/commands/doctor/assets/doctor-update-presentation.txt:104` — mechanical
- `.opencode/commands/doctor/assets/doctor-update.yaml:21` — mechanical
- `.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:37` — mechanical
- `.opencode/commands/doctor/scripts/audit_descriptions.py:11` — mechanical
- `.opencode/commands/doctor/scripts/check-mcp-mutation-class.sh:14` — mechanical
- `.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs:8` — mechanical
- `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh:24` — mechanical
- `.opencode/commands/doctor/scripts/mcp-doctor-lib.sh:158` — mechanical
- `.opencode/commands/doctor/scripts/mcp-doctor.sh:9` — mechanical
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:43` — mechanical
- `.opencode/commands/doctor/scripts/route-validate.py:8` — mechanical
- `.opencode/commands/doctor/scripts/route-validate.sh:5` — mechanical
- `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs:28` — mechanical
- `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:31` — mechanical
- `.opencode/commands/prompt/assets/prompt_improve_auto.yaml:7` — mechanical
- `.opencode/commands/prompt/assets/prompt_improve_confirm.yaml:7` — mechanical
- `.opencode/commands/prompt/assets/prompt_improve_presentation.txt:59` — mechanical
- `.opencode/commands/scripts/fixtures/broken-command-refs.yaml:17` — manual
- `.opencode/commands/scripts/validate-command-references.cjs:13` — mechanical
- `.opencode/commands/speckit/README.txt:53` — mechanical
- `.opencode/commands/speckit/assets/speckit-complete.yaml:7` — mechanical
- `.opencode/commands/speckit/assets/speckit-implement.yaml:31` — mechanical
- `.opencode/commands/speckit/assets/speckit-plan.yaml:7` — mechanical
- `.opencode/commands/speckit/assets/speckit-resume-auto.yaml:57` — mechanical
- `.opencode/commands/speckit/assets/speckit-resume-confirm.yaml:57` — mechanical
- `.opencode/commands/speckit/assets/speckit-save-context-tail.yaml:12` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| other documentation | 33 | 5 | 223 | manual | classify by hand | `.opencode/commands/agent-router.md`; `.opencode/commands/create/agent.md`; `.opencode/commands/create/benchmark.md` |
| assets | 8 | 33 | 172 | mechanical | templates and prompt assets; rewrite paths | `.opencode/commands/deep/assets/compiled/README.md`; `.opencode/commands/deep/assets/compiled/deep-ai-council.contract.md`; `.opencode/commands/deep/assets/compiled/deep-research.contract.md` |
| top-level skill doc | 3 | 19 | 11 | mechanical | load-bearing doc; rewrite paths | `.opencode/commands/doctor/scripts/README.md`; `.opencode/commands/scripts/README.md`; `.opencode/commands/scripts/fixtures/README.md` |
| historical record (changelog) | 1 | 0 | 7 | freeze | may keep historical paths | `.opencode/commands/create/changelog.md` |

### Map C · `.opencode/agents`

**Code: 1 files.**

- `.opencode/agents/README.txt:11` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| other documentation | 12 | 8 | 155 | manual | classify by hand | `.opencode/agents/ai-council.md`; `.opencode/agents/code.md`; `.opencode/agents/context.md` |

### Map C · `.opencode/hooks`

**Code: 33 files.**

- `.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs:26` — mechanical
- `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs:63` — mechanical
- `.opencode/hooks/dispatch/cursor/dispatch-preflight-lint.mjs:26` — mechanical
- `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs:66` — mechanical
- `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:574` — mechanical
- `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:110` — mechanical
- `.opencode/hooks/dispatch/pi/dispatch-audit.ts:7` — mechanical
- `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:7` — mechanical
- `.opencode/hooks/git/install-hooks.sh:7` — mechanical
- `.opencode/hooks/git/pre-commit:3` — mechanical
- `.opencode/hooks/goal/cursor/goal-cursor.test.mjs:7` — mechanical
- `.opencode/hooks/goal/cursor/goal-inject.mjs:87` — mechanical
- `.opencode/hooks/goal/devin/goal-inject.mjs:73` — mechanical
- `.opencode/hooks/goal/lib/goal-core.cjs:43` — mechanical
- `.opencode/hooks/goal/lib/goal-core.test.cjs:8` — mechanical
- `.opencode/hooks/goal/lib/goal-slice.cjs:26` — mechanical
- `.opencode/hooks/goal/lib/goal-slice.test.cjs:201` — mechanical
- `.opencode/hooks/goal/pi/goal-context.ts:20` — mechanical
- `.opencode/hooks/goal/pi/goal-pi.test.mjs:411` — mechanical
- `.opencode/hooks/hook-flags.env.example:3` — mechanical
- `.opencode/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:37` — mechanical
- `.opencode/hooks/mcp-route-guard/pi/mcp-route-guard.ts:6` — mechanical
- `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs:23` — mechanical
- `.opencode/hooks/post-edit-quality/codex/post-edit-quality.cjs:78` — mechanical
- `.opencode/hooks/post-edit-quality/devin/post-edit-quality.cjs:63` — mechanical
- `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:36` — mechanical
- `.opencode/hooks/post-edit-quality/pi/post-edit-quality.ts:8` — mechanical
- `.opencode/hooks/shared/hook-adapter-shared.cjs:5` — mechanical
- `.opencode/hooks/shared/hook-flags.sh:3` — mechanical
- `.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs:42` — mechanical
- `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:41` — mechanical
- `.opencode/hooks/task-dispatch/pi/task-dispatch-guard.ts:8` — mechanical
- `.opencode/hooks/vitest.config.ts:10` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 19 | 69 | 128 | mechanical | load-bearing doc; rewrite paths | `.opencode/hooks/README.md`; `.opencode/hooks/codex-watchdog/README.md`; `.opencode/hooks/completion/README.md` |
| other documentation | 2 | 9 | 24 | manual | classify by hand | `.opencode/hooks/goal/goal-plugin.md`; `.opencode/hooks/injection-contract.md` |

### Map C · `.opencode/plugins`

**Code: 27 files.**

- `.opencode/plugins/cli-dispatch-audit.js:27` — mechanical
- `.opencode/plugins/codex-hooks-watchdog.js:23` — mechanical
- `.opencode/plugins/lib/opencode-message-identity.js:23` — mechanical
- `.opencode/plugins/mcp-route-guard.js:33` — mechanical
- `.opencode/plugins/session-cleanup.js:31` — mechanical
- `.opencode/plugins/sk-code-post-edit-quality.js:33` — mechanical
- `.opencode/plugins/sk-git-preflight-advisory.js:88` — mechanical
- `.opencode/plugins/system-completion-sentinel.js:23` — mechanical
- `.opencode/plugins/system-deep-loop-guard.js:25` — mechanical
- `.opencode/plugins/system-dist-freshness-guard.js:35` — mechanical
- `.opencode/plugins/system-skill-advisor.js:184` — mechanical
- `.opencode/plugins/system-spec-gate.js:24` — mechanical
- `.opencode/plugins/system-speckit-completion.js:23` — mechanical
- `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:25` — mechanical
- `.opencode/plugins/tests/goal-doc-contract.test.cjs:25` — mechanical
- `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs:52` — mechanical
- `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs:925` — mechanical
- `.opencode/plugins/tests/opencode-goal-state.test.cjs:71` — mechanical
- `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs:123` — mechanical
- `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs:77` — mechanical
- `.opencode/plugins/tests/session-cleanup.test.cjs:23` — mechanical
- `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs:30` — mechanical
- `.opencode/plugins/tests/sk-communication-projection.test.cjs:36` — mechanical
- `.opencode/plugins/tests/system-deep-loop-guard.test.cjs:23` — mechanical
- `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs:18` — mechanical
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:19` — mechanical
- `.opencode/plugins/tests/system-spec-gate.test.cjs:294` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| test documentation/fixtures | 2 | 7 | 2 | mechanical | test-owned content; rewrite or regenerate | `.opencode/plugins/tests/README.md`; `.opencode/plugins/tests/helpers/README.md` |
| top-level skill doc | 1 | 2 | 3 | mechanical | load-bearing doc; rewrite paths | `.opencode/plugins/README.md` |

### Map C · `.opencode/bin`

**Code: 27 files.**

- `.opencode/bin/check-git-hooks.sh:9` — mechanical
- `.opencode/bin/check-no-spec-imports.cjs:4` — mechanical
- `.opencode/bin/compiled-route-guard.cjs:38` — mechanical
- `.opencode/bin/compiled-route-status.cjs:47` — mechanical
- `.opencode/bin/compiled-route-sync.cjs:21` — mechanical
- `.opencode/bin/compiled-routing-foundation.vitest.ts:8` — mechanical
- `.opencode/bin/git-live-follow.sh:34` — mechanical
- `.opencode/bin/git-primary-reconcile.sh:125` — mechanical
- `.opencode/bin/git-sync.sh:84` — mechanical
- `.opencode/bin/hf-model-server.cjs:75` — mechanical
- `.opencode/bin/install-codex-hooks.mjs:9` — mechanical
- `.opencode/bin/lib/compiled-route-manifest.cjs:503` — mechanical
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:36` — mechanical
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs:44` — mechanical
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/harness/build-artifacts.cjs:30` — mechanical
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:41` — mechanical
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/harness/build-artifacts.cjs:34` — mechanical
- `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json:4` — mechanical
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:98` — mechanical
- `.opencode/bin/lib/model-server-supervision.cjs:23` — mechanical
- `.opencode/bin/mcp-code-mode-launcher.cjs:22` — mechanical
- `.opencode/bin/relink-local-specs.sh:17` — mechanical
- `.opencode/bin/system-skill-advisor-launcher.cjs:24` — mechanical
- `.opencode/bin/tests/compiled-route-manifest.test.cjs:41` — mechanical
- `.opencode/bin/tests/fixtures/no-spec-import/negative/clean-runtime.cjs:5` — manual
- `.opencode/bin/worktree-guard.sh:13` — mechanical
- `.opencode/bin/worktree-session.sh:82` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 2 | 19 | 17 | mechanical | load-bearing doc; rewrite paths | `.opencode/bin/README.md`; `.opencode/bin/lib/README.md` |

### Map C · `.opencode/scripts`

**Code: 20 files.**

- `.opencode/scripts/check-vendored-fork-provenance.mjs:7` — mechanical
- `.opencode/scripts/copy-skill-advisor-dist-data.sh:10` — mechanical
- `.opencode/scripts/git-hooks/commit-msg:5` — mechanical
- `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh:34` — mechanical
- `.opencode/scripts/git-hooks/post-commit:7` — mechanical
- `.opencode/scripts/git-hooks/post-merge:8` — mechanical
- `.opencode/scripts/git-hooks/post-rewrite:9` — mechanical
- `.opencode/scripts/git-hooks/pre-commit:9` — mechanical
- `.opencode/scripts/git-hooks/pre-push:23` — mechanical
- `.opencode/scripts/git-hooks/prepare-commit-msg:16` — mechanical
- `.opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh:43` — mechanical
- `.opencode/scripts/git-hooks/tests/commit-msg.test.sh:20` — mechanical
- `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh:15` — mechanical
- `.opencode/scripts/git-hooks/tests/pre-commit.test.sh:24` — mechanical
- `.opencode/scripts/git-hooks/tests/pre-push.test.sh:19` — mechanical
- `.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh:24` — mechanical
- `.opencode/scripts/install-git-hooks.sh:2` — mechanical
- `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist:12` — mechanical
- `.opencode/scripts/run-node-tests.mjs:11` — mechanical
- `.opencode/scripts/session-cleanup.sh:33` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 4 | 27 | 6 | mechanical | load-bearing doc; rewrite paths | `.opencode/scripts/README.md`; `.opencode/scripts/git-hooks/README.md`; `.opencode/scripts/git-hooks/lib/README.md` |
| test documentation/fixtures | 1 | 7 | 0 | mechanical | test-owned content; rewrite or regenerate | `.opencode/scripts/git-hooks/tests/README.md` |

### Map C · `.opencode/install-guides`

**Code: 0 files.**


**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 2 | 43 | 41 | mechanical | load-bearing doc; rewrite paths | `.opencode/install-guides/README.md`; `.opencode/install-guides/install-scripts/README.md` |

### Map C · `.opencode/logs`

**Code: 0 files.**


**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 1 | 2 | 5 | mechanical | load-bearing doc; rewrite paths | `.opencode/logs/README.md` |

### Map C · `.opencode/package-lock.json`

**Code: 1 files.**

- `.opencode/package-lock.json:2` — regenerate

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|

### Map C · root documents and configuration

**Code: 4 files.**

- `.env.example:19` — mechanical
- `.gitignore:7` — mechanical
- `.utcp_config.json:147` — mechanical
- `opencode.json:15` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| other documentation | 4 | 22 | 75 | manual | classify by hand | `AGENTS.md`; `CONTRIBUTING.md`; `PUBLIC-RELEASE.md` |

### Map C · CI under `.github/`

**Code: 20 files.**

- `.github/dependabot.yml:13` — mechanical
- `.github/workflows/advisory-checks.yml:30` — mechanical
- `.github/workflows/agent-mirror-sync.yml:17` — mechanical
- `.github/workflows/changed-packet-validation.yml:37` — mechanical
- `.github/workflows/chart-corpus.yml:7` — mechanical
- `.github/workflows/command-tree-parity.yml:29` — mechanical
- `.github/workflows/comment-hygiene.yml:17` — mechanical
- `.github/workflows/diagram-corpus.yml:7` — mechanical
- `.github/workflows/dispatch-enforcement-guard.yml:31` — mechanical
- `.github/workflows/markdown-link-integrity.yml:7` — mechanical
- `.github/workflows/naming-standard-guard.yml:45` — mechanical
- `.github/workflows/playbook-operator-contract.yml:28` — mechanical
- `.github/workflows/prompt-card-sync.yml:15` — mechanical
- `.github/workflows/repo-rules-corpus.yml:8` — mechanical
- `.github/workflows/routing-registry-drift.yml:17` — mechanical
- `.github/workflows/rule-canary-sync.yml:17` — mechanical
- `.github/workflows/runtime-no-spec-import.yml:7` — mechanical
- `.github/workflows/skill-doc-frontmatter.yml:8` — mechanical
- `.github/workflows/spec-kit-check.yml:7` — mechanical
- `.github/workflows/strict-pass-freshness-report.yml:43` — mechanical

**Documentation classes:**

| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |
|---|---:|---:|---:|---|---|---|
| top-level skill doc | 1 | 0 | 1 | mechanical | load-bearing doc; rewrite paths | `.github/workflows/README.md` |


### Map C reconciliation against the seed

| Group | Seed files | Post-seed | Rows mapped | Unmapped |
|---|---:|---:|---:|---|
| Skills (`skill:*`, iterations 5-7) | 3,692 | 0 | 3,692 | none |
| Skills root (`opencode:skills`) | 3 | 0 | 3 | none |
| `.opencode` runtime areas (commands, agents, hooks, plugins, bin, scripts, install-guides, logs, package-lock) | 303 | 0 | 303 | none |
| Root documents and configuration | 8 | 0 | 8 | none |
| CI under `.github/` | 21 | 0 | 21 | none |
| Post-seed addition (iteration 9) | 0 | 1 | 1 | none |
| **Total** | **4,027** | **1** | **4,028** | **none** |

The seed's 31 areas sum to 4,258 files (231 of them are Map B's runtime rows, already reconciled above). Map C covers the other 4,027 plus the one file added after the seed was generated, `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` (first construct `path.join(REPO_ROOT, '.opencode', 'skills')` at line 48; `mechanical`). Combined tracked-file universe: 4,259, all classified.

**Classification totals (Map C).** Code: `mechanical` 824, `freeze` 316, `manual` 35, `regenerate` 26. Documentation: `mechanical` 2,050, `freeze` 692, `manual` 85. Sum 4,028. The `freeze` class (1,008 files) is the changelog, benchmark and recorded-run material across the skills plus `specs/` history; it is the single largest reason the move cannot be a blanket `sed`.

**Generated-state owners named in Map C:** `generate-trigger-index.mjs` (trigger index), `regenerate-skill-derived.cjs` (graph metadata), `generate-leaf-manifest.cjs` and siblings (leaf manifests), `compile-command-contracts.cjs` (compiled deep-loop contracts), `sync-runtime-mirrors.cjs` (five runtime mirror trees), `sync-hook-registrations.cjs` (four hook registrations), `sync-prompts*.cjs` (three prompt trees), `sync-agents*.cjs` (two agent trees), `sync-skills-hermes.cjs` (Hermes copies), `sync-gate1-pointers.cjs` (Gate 1 pointer blocks), plus the skill runtime builds that emit the gitignored `dist/` trees.

### Cross-map totals

| Population | Rows | mechanical | regenerate | manual | freeze | none | blocker |
|---|---:|---:|---:|---:|---:|---:|---:|
| Map A (links) | 435 | 231 | 147 | 0 | 29 | 28 | — |
| Map B (runtime files) | 231 | 27 | 197 | 7 | 0 | 0 | 0 in-file; 7 home-level |
| Map C (all other tracked files) | 4,028 | 2,874 | 26 | 120 | 1,008 | — | — |
| **Total rows** | **4,694** | **3,132** | **370** | **127** | **1,037** | **28** | **7 (home-level)** |

The `blocker` classification attaches to the composition of rows, not to a file: the root sentinel (`shared/workspace/repo-root.mjs:26-45`), the MCP launcher (`bin/mcp-code-mode-launcher.cjs:22` plus its five runtime registrations and `~/.hermes/config.yaml`), the published consumer contract (`PUBLIC-RELEASE.md:10-36`), the seven machine-level git hooks, and the loader-shape unknowns (`plugins` glob, Devin skill scan). Phase 001's blocker inventory is corroborated file by file; nothing here contradicts it.

## UNKNOWNs

Each UNKNOWN names what would settle it. None was silently dropped.

1. **Can each runtime be pointed at a root other than its own directory name?** UNKNOWN. Settles with version-specific loader documentation or source for each installed CLI. Affects whether the `.opencode` compatibility surface is avoidable at all.
2. **Does OpenCode's flat plugin glob follow a symlinked `.opencode/plugins`?** UNKNOWN. Settles with a probe in a scratch checkout; decides whether `.opencode/plugins` can be a link or must stay real.
3. **Does Devin's native `.opencode/skills` scan follow a symlink?** UNKNOWN. Same probe shape.
4. **Does a dangling hook under `core.hooksPath` make git fail or skip silently?** UNKNOWN. Settles with a one-line probe in a scratch repository; decides whether the seven global hooks degrade loudly or silently.
5. **With `.opencode` as a consumer, do gate scripts run while their staged-path filters miss `.skilled` changes?** UNKNOWN. Settles with a probe commit in a disposable checkout. Phase 001's orchestrator analysis predicts scripts run, filters miss.
6. **Which `.opencode` subpaths will the compatibility surface cover?** UNKNOWN (phase 003's layout decision). The rows carry both answers for every link; Maps B and C name the compat dependency per row.
7. **Is there an external bootstrap owner for the hand-made whole-directory links** (`.claude/skills`, `.pi/skills`, `.hermes/agents`, the `manual-testing-playbook` links)? UNKNOWN beyond this machine. Settles with a machine-level search of shell profiles and bootstrap repositories, excluding secrets.
8. **Do the 129 `system-spec-kit` test files assert absolute repository paths or path fragments?** UNKNOWN. Settles by reading the assertions; decides whether the test class is a pure segment rewrite.
9. **Are the benchmark artifacts consumed by live tooling or only read by humans?** UNKNOWN. Settles by reading the benchmark scripts' inputs.
10. **Is the `.opencode/skill` matcher bug recorded in `.opencode/skills/.state/smart-router-telemetry/README.md:88` still live?** UNKNOWN. Settles with a one-command probe; it is recorded as evidence and deliberately not corrected.
11. **Does the `.pi/extensions` import base survive a relocated symlink?** UNKNOWN. Settles with a Pi probe; the README states imports resolve against the symlink path, which was verified for the current location only.

## Convergence

- Iterations 1-4 produced Map A (435 links) and Map B (231 files + home-level).
- Iterations 5-8 produced Map C (4,028 files) and closed every seed area.
- Iteration 9 found exactly one post-seed file by live diff and verified every synthesis-critical citation; newInfoRatio 0.15.
- Iteration 10 was the completeness audit and added no rows; newInfoRatio 0.05.
- Stop reason: `converged` (no-new-rows at the cap; iteration depth 10 of 10 also completed).

## References

- Seed inventory: `../scratch/seed-inventory/{summary.md,symlinks.tsv,tracked-refs.tsv,home-refs.tsv}`
- Phase 001 findings: `../../001-deep-research/research/research.md`
- Row tables: `iterations/iteration-001.md` … `iterations/iteration-010.md`
- Generator sources cited throughout: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `sync-hook-registrations.cjs`, `hook-registry.json`; `.opencode/skills/system-spec-kit/runtime/cli/{codex,pi,hermes}/sync-*.cjs`; `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`; `.opencode/skills/sk-doc/sk-create-skill/scripts/{generate-leaf-manifest,regenerate-skill-derived}.cjs`; `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`
- Runtime manifests: `.claude/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.hermes/SYNC.md`, `.pi/SYNC.md` (recorded disagreements named inline)
- Convergence evidence: `iterations/iteration-009.md`, `iterations/iteration-010.md`
