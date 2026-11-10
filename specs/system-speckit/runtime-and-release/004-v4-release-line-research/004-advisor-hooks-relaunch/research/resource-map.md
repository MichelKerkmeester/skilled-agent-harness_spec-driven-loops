---
title: "Resource Map — Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the advisor, hooks and relaunch cluster: .skilled/skills/system-skill-advisor/**, compiled routing (each skill's hub-router.json, ROUTER.md, mode-registry.json), .skilled/hooks/** with the runtime adapters in .claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions and .dsh/plugins, session relaunch, history after compaction and question-tool decision capture. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 166
- **By category**: READMEs=9, Documents=23, Commands=9, Agents=0, Skills=49, Specs=2, Scripts=42, Tests=22, Config=9, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 004-advisor-hooks-relaunch
- **Generated**: 2026-11-08T22:33:32.359Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/decision-capture/bin/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/dsh/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/git-worktree-guard/claude/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/git-worktree-guard/codex/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/session-relaunch/README.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/skill-advisor/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/logs/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows | Cited | OK | Citations=1; Iterations=1 |
| .gitignore | Cited | OK | Citations=3; Iterations=3 |
| .skilled/bin/skilled-loop | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.2.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.5.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.7.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.12.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.13.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.14.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.15.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.16.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/changelog/skilled/v4.0.1.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.2.0.md | Cited | OK | Citations=8; Iterations=8 |
| .skilled/hooks | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ask-surface-guard/fixtures | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/.skilled/logs/cli-dispatch-audit.log | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/goal/goal-plugin.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/hook-flags.env | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/injection-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/speckit/handoff.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/assets/create-skill-parent-auto.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/agents-md-manifest.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-env.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/agents-md-embed.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/agents-md-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/git-setup-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-classifier/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/feature-catalog/python-compat/cli-shim.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/leaf-manifest.config.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/leaf-scopes.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/spec-kit-docs.json | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-speckit/runtime-and-release/004-v4-release-line-research/004-advisor-hooks-relaunch/research/deep-research-state.jsonl | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/runtime-and-release/004-v4-release-line-research/004-advisor-hooks-relaunch/research/deltas/iter-015.jsonl | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/hooks/ask-surface-stop.cjs | Cited | OK | Citations=2; Iterations=2 |
| .dsh/plugins/repo-guards/index.mjs | Cited | OK | Citations=3; Iterations=3 |
| .opencode/plugins/ask-surface-guard.js | Cited | OK | Citations=4; Iterations=4 |
| .opencode/plugins/cli-dispatch-audit.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/lib/v2-bridge.js | Cited | OK | Citations=2; Iterations=2 |
| .opencode/plugins/session-history-lookup.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/system-skill-advisor.js | Cited | OK | Citations=5; Iterations=5 |
| .pi/extensions/ask-surface-guard.ts | Cited | OK | Citations=2; Iterations=2 |
| .pi/extensions/prompt-advisor.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/bin/system-skill-advisor-launcher.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/cursor/dispatch-preflight-lint.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/devin/dispatch-audit-posttooluse.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/dsh/dispatch-audit.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/lib/dispatch-audit.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/dispatch/pi/dispatch-audit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/goal/bin/goal.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/goal/dsh/goal-context.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/goal/lib/goal-core.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/hooks/goal/lib/goal-slice.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-lifecycle/claude/compact-inject.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-lifecycle/claude/compact-inject.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/lib/context-usage.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/lib/nudge.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/shared/hook-adapter-shared.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/shared/hook-flags.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/hooks/shared/hook-flags.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/hook-flags.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/git-hooks/lib/bounded-git.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/tests/session-history-lookup.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/tests/session-relaunch.test.cjs | Cited | OK | Citations=4; Iterations=4 |
| .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ask-surface-guard/tests/dsh-ask-surface-guard.test.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/goal/bin/goal.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/goal/lib/goal-core.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/goal/lib/goal-slice.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/goal/pi/goal-pi.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/goal/tests/dsh-goal.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/post-edit-quality/tests/codex-post-edit-quality.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/post-edit-quality/tests/devin-post-edit-quality.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/post-edit-quality/tests/post-edit-router.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/tests/fixtures/relaunch-env.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/tests/killer.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/hook-stdin-deadline.test.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/shared/tests/session-readers/ | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json | Cited | OK | Citations=1; Iterations=1 |
| .codex/hooks.json | Cited | OK | Citations=1; Iterations=1 |
| .dsh/patches/guards.patch.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/comment-hygiene.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/routing-registry-drift.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/skill-advisor-stress.yml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ask-surface-guard/fixtures/code-block-menu.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ask-surface-guard/fixtures/numbered-steps.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/hook-flags.env.example | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=1; Iterations=1 |

---
