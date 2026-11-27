---
title: "Resource Map — Reference evidence for the OpenBot parity build of skilled bots. Inputs, all read-only. Do not edit any of them. - The ten reference repos under specs/system-skilled-bots/context/: OpenBot-main (the primary reference), OpenMausBot-main, rakazo-main, openhuman-main, openhuman-full, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main and tinychannels-main. - The build plan: the fourteen phase folders and the contracts/ folder of specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment, 014-deep-review). - The three earlier syntheses: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md, .../002-plan-review-research/research/research.md and .../003-plan-depth-research/research/research.md. - The built runtime: .skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs and .skilled/skills/system-skilled-bots/scripts/bot-check.cjs. Answer two things. 1. Evidence per planned phase. For each of the fourteen phases: which reference files and lines implement the same thing; what a builder should lift or mirror, with the licence of the source; where the plan differs from how the references do it, and which side the evidence supports; and which failures, tests and fixes in those repos the plan does not yet guard against. 2. Net-new. What do the ten repos have that neither the build plan nor the skip list in section 13 of the parity synthesis covers? Rank each by its value to a small team and give its size. Read openhuman-full first: no earlier run studied it, and it carries five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and a built openhuman-tui crate that openhuman-main lacks. Rules. - Do not repeat a finding one of the three earlier syntheses already carries. Cite the earlier finding and add only what is new. - Cite every claim as [SOURCE: path:line]. A claim with no resolving citation is not a finding. - Mark each claim observed (you read the line) or inferred (you reason from it). - Name the 003 phase every finding belongs to. A finding that fits no phase goes under net-new. - Write only inside your own lineage folder."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 263
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=3, Specs=243, Scripts=0, Tests=0, Config=0, Meta=17
- **Missing on disk**: 28
- **Scope**: research convergence output for 004-reference-evidence-research
- **Generated**: 2026-11-27T07:37:00.138Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-skilled-bots/bots-run/references | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md | Cited | OK | Citations=7; Iterations=7 |
| specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/deltas/iter-001.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/deltas/iter-009.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-001.md through iteration-009.md | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-007.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md (absent) | Cited | MISSING | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/data-model.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/fable-review-1.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:104,115,229 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:30,40,50,63 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/fixtures.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/refusals.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/state-machines.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md | Cited | OK | Citations=6; Iterations=6 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:41-46,160-173 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:164,173 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:156-157,200,230 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:56,138,172-174 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/message-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/reply-grammar.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:103,163-192,220 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:63-66,194,229,255 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:31,41,50,75,188,226,239,288 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/contracts/verification.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/spec.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/spec.md:84,88-95 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/ARCHITECTURE.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/buzz-main/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/CONTEXT.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/CONTEXT.md:1-3,19 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/crates/buzz-conformance/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/crates/buzz-db/TESTING.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/crates/ifc-core/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/deny.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/PLANS/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/scripts/check-postgres-test-discovery.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/TESTING.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/buzz-main/TESTING.md:19-36,55,231-260,344-345,405,439 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/TESTING.md:405,439 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/dashboard/plugin_api.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/health_entry.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/hermes-muse-main/plugin.yaml | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/hermes-muse-main/scripts/check_callers.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/queries.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/merged.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/tasks/queries.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/routines.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenBot-main/shared/agent-authorisation.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/approval-outcomes.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/attachments.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/audit-words.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/computer-control.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/connect-prompt.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/shared/decision-tools.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/shared/harness-own-tools.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/learning.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/shared/recorder-masking.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/routine-checklist.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/tool-name-words.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/shared/what-if.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/ (top level) | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/memory.js | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/OpenGhost-main/rules.js | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenGhost-main/skills.js | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full.build.log | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/Cargo.toml | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity_tests.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity.rs | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/app.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/state.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/terminal.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/theme.rs | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/ui_state.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/FINDINGS-gemini-live.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/llms.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/tests/cli_sigpipe.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/tests/composio_list_tools_stack_overflow_regression.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/tests/cost_cap_removed.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/*/Cargo.toml | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinybus/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinychannels/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyconnectors/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/crates/tinydocs/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/README.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/crates/tinyeventqueues/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/crates/tinyjuice-module/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/crates/tinyjuice/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-api/src/namespace/mod.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-api/src/provenance/mod.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-tools/src/context/compile/mod.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-tools/src/recall/render.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysearch/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/Cargo.toml | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/reply.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-bus/src/approval.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-bus/src/policy.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/privacy.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-egress/src/url_guard.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/command_shell.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-subject-policies.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/src/lib.rs | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyvoice/crates/tinyvoice-module/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyvoice/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinywallet/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/ (module listing) | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/crash_reporting.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render_tests.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/terminal.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/vendor | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/ (top level) | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenMausBot-main/evals/scenarios/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/evals/scorers/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/evals/turn-routing/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.test.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenMausBot-main/server/hosted-slack.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/ (top level) | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/contracts/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/adapter.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/intent.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/docs/channel-capabilities.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/docs/channel-providers.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/src/delivery/queue.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/delivery/types.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/src/delivery/types.rs:11,134-137 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops_tests.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_send.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/docs/memory.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/eval_attachments.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/turnstone-main/HYPOTHESIS.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/tests.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/tests/data/memory_description_parity.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/tests/test_scoring.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/compaction.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/config.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/session.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/core/tools.py | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/*/LICENSE | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/CHANGELOG.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/CLAUDE.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/buzz-main/LICENSE | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/hermes-muse-main/LICENSE | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/OpenBot-main/LICENSE | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/OpenGhost-main/LICENSE | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/AGENTS.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/LICENSE | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tiny-artifacts/LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/LICENSE | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/LICENSE | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/context/OpenMausBot-main/LICENSE | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/rakazo-main/LICENSE | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/tinychannels-main/LICENSE | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/context/turnstone-main/LICENSE | Cited | OK | Citations=2; Iterations=2 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| pi-1 | lineages/pi-1/deltas/iter-001.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-002.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-003.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-004.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-005.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-006.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-007.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-008.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-009.jsonl |
| pi-1 | lineages/pi-1/deltas/iter-010.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-001.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-002.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-003.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-004.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-005.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-006.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-007.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-008.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-009.jsonl |
| pi-2 | lineages/pi-2/deltas/iter-010.jsonl |
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
