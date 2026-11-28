---
title: "Resource Map — Reference evidence for the OpenBot parity build of skilled bots. Inputs, all read-only. Do not edit any of them. - The ten reference repos under specs/system-skilled-bots/context/: OpenBot-main (the primary reference), OpenMausBot-main, rakazo-main, openhuman-main, openhuman-full, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main and tinychannels-main. - The build plan: the fourteen phase folders and the contracts/ folder of specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 013-manual-testing-scenarios, 014-skilled-and-doc-alignment, 015-deep-review). - The three earlier syntheses: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md, .../002-plan-review-research/research/research.md and .../003-plan-depth-research/research/research.md. - The built runtime: .skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs and .skilled/skills/system-skilled-bots/scripts/bot-check.cjs. Answer two things. 1. Evidence per planned phase. For each of the fourteen phases: which reference files and lines implement the same thing; what a builder should lift or mirror, with the licence of the source; where the plan differs from how the references do it, and which side the evidence supports; and which failures, tests and fixes in those repos the plan does not yet guard against. 2. Net-new. What do the ten repos have that neither the build plan nor the skip list in section 13 of the parity synthesis covers? Rank each by its value to a small team and give its size. Read openhuman-full first: no earlier run studied it, and it carries five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and a built openhuman-tui crate that openhuman-main lacks. Rules. - Do not repeat a finding one of the three earlier syntheses already carries. Cite the earlier finding and add only what is new. - Cite every claim as [SOURCE: path:line]. A claim with no resolving citation is not a finding. - Mark each claim observed (you read the line) or inferred (you reason from it). - Name the 003 phase every finding belongs to. A finding that fits no phase goes under net-new. - Write only inside your own lineage folder."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 72
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=2, Specs=67, Scripts=0, Tests=0, Config=0, Meta=3
- **Missing on disk**: 3
- **Scope**: research convergence output for 004-reference-evidence-research
- **Generated**: 2026-11-27T07:33:42.299Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/message-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/crates/buzz-conformance/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/crates/ifc-core/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/health_entry.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/plugin.yaml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/routines.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/memory.js | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/rules.js | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenGhost-main/skills.js | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render_tests.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.test.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/hosted-slack.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/contracts/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/delivery/queue.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/delivery/types.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops_tests.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_send.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/tests/test_scoring.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/config.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/session.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/tools.py | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/LICENSE | Cited | OK | Citations=1; Iterations=1 |

---
