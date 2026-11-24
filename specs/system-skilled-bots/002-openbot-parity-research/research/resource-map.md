---
title: "Resource Map — OpenBot parity for skilled bots, scoped to a small team. Goal: get as close to OpenBot as possible with only the parts a small team needs, no extras, preferring a terminal or CLI experience over a desktop app when it can match OpenBot's. Inputs (read-only): eight reference repos under specs/system-skilled-bots/context/ (OpenBot-main is the primary reference; also OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main), and the built skilled-bots runtime under .skilled/skills/system-skilled-bots/ (BOT.md definitions, bots CLI at .skilled/bin/bots.cjs, manual/queue/git-hook/launchd triggers, needs-you items, worktree isolation, desktop delivery, status index). OpenBot frames a bot as eight parts in four pairs (OpenBot-main/docs/how-openbot-works.md): conversations and routines, memory and skills, apps and computer, approvals and activity. For each of the eight parts answer: what OpenBot does and how it is built; what the other seven repos do better or more simply; what skilled bots has today; and the smallest change that closes the gap, with its size and risk. Also answer: 1. Terminal versus desktop: can a CLI or TUI give the OpenBot app experience (conversations with a bot, an approvals inbox, an activity feed, a routine list)? Which repos ship a terminal UI or a desktop shell worth copying, and what would a desktop shell (OpenBot uses Tauri) add that a terminal cannot? 2. Conversations: interactive chat with a bot and its memory from the terminal, including several bots in one conversation. 3. Routines: routines written as sentences, event starts (new mail, a pull request) and \"until\" outcomes, mapped onto our cron, queue and git-hook triggers. 4. Memory and skills: per-bot and shared memory, skills recorded or proposed from use, and how they map onto Skilled skills and the spec-kit. 5. Apps and computer: connectors and a secret vault against our MCP and Code Mode, and a bot's computer against our worktrees. 6. Approvals and activity against our needs-you items, run records and bots status. 7. Small team: who can talk to, approve for and change a bot; shared versus per-person memory; the smallest sign-in and roles model that works for a few people on one machine or a shared host. 8. A skip list: enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts we do not need, each with its reason. 9. Reuse: code we can lift directly, with repo, path and license. Cite every claim with [SOURCE: path:line]. End with a ranked build order a first build packet can start from."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 174
- **By category**: READMEs=0, Documents=6, Commands=0, Agents=0, Skills=42, Specs=113, Scripts=2, Tests=0, Config=2, Meta=9
- **Missing on disk**: 5
- **Scope**: research convergence output for 002-openbot-parity-research
- **Generated**: 2026-11-24T19:21:24.651Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .devin/skills/mcp-code-mode/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| iterations/iteration-006.md | Cited | MISSING | Citations=1; Iterations=1 |
| iterations/iteration-007.md | Cited | MISSING | Citations=1; Iterations=1 |
| iterations/iteration-008.md | Cited | MISSING | Citations=1; Iterations=1 |
| iterations/iteration-009.md | Cited | MISSING | Citations=1; Iterations=1 |
| iterations/iteration-012.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-code-mode/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/README.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/assets/bot-template.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/bots-author/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/ | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/answer.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skilled-bots/runtime/lib/approval.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-skilled-bots/runtime/lib/definition.ts | Cited | OK | Citations=9; Iterations=9 |
| .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-skilled-bots/runtime/lib/identity.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/installer.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts | Cited | OK | Citations=8; Iterations=8 |
| .skilled/skills/system-skilled-bots/runtime/lib/posture.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts | Cited | OK | Citations=9; Iterations=9 |
| .skilled/skills/system-skilled-bots/runtime/lib/runner.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts | Cited | OK | Citations=8; Iterations=8 |
| .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts | Cited | OK | Citations=10; Iterations=10 |
| .skilled/skills/system-skilled-bots/runtime/lib/status.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/switches.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/memory/memory-system.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/memory/save-workflow.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/context/buzz-main/ARCHITECTURE.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/buzz-main/desktop/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/desktop/plugin.js | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/docs/DESIGN.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/hooks.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/hermes-muse-main/skills/companion/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/interface.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/hermes-muse-main/skills/companion/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml | Cited | OK | Citations=7; Iterations=7 |
| specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/api/openapi/learning.yaml | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/context/OpenBot-main/api/openapi/skills.yaml | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/inline-approval.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/question-notice.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/waiting.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/bot-profile/activity.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/channels/group-chat.tsx | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/needs-you/board.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/team-grants/team-grants-row.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/vault/saved-logins.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/vault/vault-page.tsx | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/auth/roles.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/computers/secret.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/context/OpenBot-main/desktop/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/Cargo.toml | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/src/main.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docker-compose.yml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md | Cited | OK | Citations=8; Iterations=8 |
| specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docs/desktop-updates.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md | Cited | OK | Citations=9; Iterations=9 |
| specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/OpenBot-main/docs/plugins/composio.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/docs/routines.md | Cited | OK | Citations=9; Iterations=9 |
| specs/system-skilled-bots/context/OpenBot-main/mobile/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/bot-prompt.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenGhost-main/desktop/skills.js | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/fact-keeper.js | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenGhost-main/memory.js | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/OpenGhost-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/rules.js | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenGhost-main/skills.js | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/openhuman-main/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/mod.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/scope.rs | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/tools.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md | Cited | OK | Citations=6; Iterations=6 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/actions.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/views.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/ui_state.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/docs/gitbooks/en/developing/architecture.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/connector/profiles/omb-home-narrow.apparmor | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/docs/bitwarden.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/docs/computer-use-integration.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenMausBot-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/packages/phone-protocol/src/cron-label.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/routine-catch-up.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/routine-cron-text.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/routine-schedules.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/routine-wake-retry.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/src/state/team-chats.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/rakazo-main/docs/computer-runtime.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/adapters/src/index.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.test.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/turnstone-main/docs/console.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/docs/governance.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/turnstone-main/docs/mcp-oauth.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/turnstone-main/docs/memory.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/docs/oauth-storage.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/turnstone-main/docs/openshell.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/tests/test_mcp_crypto.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/memory_index.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/memory.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/output_guard_judge.py | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/bots.cjs | Cited | OK | Citations=9; Iterations=9 |
| .skilled/bin/mcp-code-mode-launcher.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .mcp.json | Cited | OK | Citations=1; Iterations=1 |
| .utcp_config.json | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/context/buzz-main/LICENSE | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/hermes-muse-main/LICENSE | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/context/OpenBot-main/LICENSE | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/OpenBot-main/mobile/AGENTS.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/LICENSE | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/context/openhuman-main/LICENSE | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/context/OpenMausBot-main/LICENSE | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/rakazo-main/LICENSE | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/turnstone-main/LICENSE | Cited | OK | Citations=4; Iterations=4 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| devin-1 | lineages/devin-1/deltas/iter-001.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-002.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-003.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-004.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-005.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-006.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-007.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-008.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-009.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-010.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-011.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-012.jsonl |
| devin-1 | lineages/devin-1/deltas/iter-013.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-001.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-002.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-003.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-004.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-005.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-006.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-007.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-008.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-009.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-010.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-011.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-012.jsonl |
| devin-2 | lineages/devin-2/deltas/iter-013.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-001.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-002.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-003.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-004.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-005.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-006.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-007.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-008.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-009.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-010.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-011.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-012.jsonl |
| vibe-1 | lineages/vibe-1/deltas/iter-013.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-001.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-002.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-003.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-004.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-005.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-006.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-007.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-008.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-009.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-010.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-011.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-012.jsonl |
| vibe-2 | lineages/vibe-2/deltas/iter-013.jsonl |
