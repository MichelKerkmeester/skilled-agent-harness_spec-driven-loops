---
title: "Resource Map — OpenBot parity for skilled bots, scoped to a small team. Goal: get as close to OpenBot as possible with only the parts a small team needs, no extras, preferring a terminal or CLI experience over a desktop app when it can match OpenBot's. Inputs (read-only): eight reference repos under specs/system-skilled-bots/context/ (OpenBot-main is the primary reference; also OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main), and the built skilled-bots runtime under .skilled/skills/system-skilled-bots/ (BOT.md definitions, bots CLI at .skilled/bin/bots.cjs, manual/queue/git-hook/launchd triggers, needs-you items, worktree isolation, desktop delivery, status index). OpenBot frames a bot as eight parts in four pairs (OpenBot-main/docs/how-openbot-works.md): conversations and routines, memory and skills, apps and computer, approvals and activity. For each of the eight parts answer: what OpenBot does and how it is built; what the other seven repos do better or more simply; what skilled bots has today; and the smallest change that closes the gap, with its size and risk. Also answer: 1. Terminal versus desktop: can a CLI or TUI give the OpenBot app experience (conversations with a bot, an approvals inbox, an activity feed, a routine list)? Which repos ship a terminal UI or a desktop shell worth copying, and what would a desktop shell (OpenBot uses Tauri) add that a terminal cannot? 2. Conversations: interactive chat with a bot and its memory from the terminal, including several bots in one conversation. 3. Routines: routines written as sentences, event starts (new mail, a pull request) and \"until\" outcomes, mapped onto our cron, queue and git-hook triggers. 4. Memory and skills: per-bot and shared memory, skills recorded or proposed from use, and how they map onto Skilled skills and the spec-kit. 5. Apps and computer: connectors and a secret vault against our MCP and Code Mode, and a bot's computer against our worktrees. 6. Approvals and activity against our needs-you items, run records and bots status. 7. Small team: who can talk to, approve for and change a bot; shared versus per-person memory; the smallest sign-in and roles model that works for a few people on one machine or a shared host. 8. A skip list: enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts we do not need, each with its reason. 9. Reuse: code we can lift directly, with repo, path and license. Cite every claim with [SOURCE: path:line]. End with a ranked build order a first build packet can start from."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 82
- **By category**: READMEs=0, Documents=1, Commands=0, Agents=0, Skills=25, Specs=48, Scripts=1, Tests=0, Config=0, Meta=7
- **Missing on disk**: 0
- **Scope**: research convergence output for 002-openbot-parity-research
- **Generated**: 2026-11-24T19:17:06.309Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .devin/skills/mcp-code-mode/SKILL.md | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/answer.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/approval.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/definition.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/identity.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/installer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/posture.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skilled-bots/runtime/lib/status.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/memory/save-workflow.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/context/buzz-main/desktop/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/desktop/plugin.js | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/inline-approval.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/question-notice.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/waiting.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/bot-profile/activity.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/channels/group-chat.tsx | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/components/needs-you/board.tsx | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/auth/roles.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/src/main.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md | Cited | OK | Citations=8; Iterations=8 |
| specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md | Cited | OK | Citations=6; Iterations=6 |
| specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docs/routines.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/views.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/docs/gitbooks/en/developing/architecture.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/src/state/team-chats.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/docs/console.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/docs/governance.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/turnstone-main/docs/memory.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/memory_index.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/memory.py | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/bots.cjs | Cited | OK | Citations=3; Iterations=3 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/context/buzz-main/LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/LICENSE | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/mobile/AGENTS.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/LICENSE | Cited | OK | Citations=1; Iterations=1 |

---
