---
title: "Resource Map — Reference evidence for the OpenBot parity build of skilled bots. Inputs, all read-only. Do not edit any of them. - The ten reference repos under specs/system-skilled-bots/context/: OpenBot-main (the primary reference), OpenMausBot-main, rakazo-main, openhuman-main, openhuman-full, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main and tinychannels-main. - The build plan: the fourteen phase folders and the contracts/ folder of specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 013-manual-testing-scenarios, 014-skilled-and-doc-alignment, 015-deep-review). - The three earlier syntheses: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md, .../002-plan-review-research/research/research.md and .../003-plan-depth-research/research/research.md. - The built runtime: .skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs and .skilled/skills/system-skilled-bots/scripts/bot-check.cjs. Answer two things. 1. Evidence per planned phase. For each of the fourteen phases: which reference files and lines implement the same thing; what a builder should lift or mirror, with the licence of the source; where the plan differs from how the references do it, and which side the evidence supports; and which failures, tests and fixes in those repos the plan does not yet guard against. 2. Net-new. What do the ten repos have that neither the build plan nor the skip list in section 13 of the parity synthesis covers? Rank each by its value to a small team and give its size. Read openhuman-full first: no earlier run studied it, and it carries five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and a built openhuman-tui crate that openhuman-main lacks. Rules. - Do not repeat a finding one of the three earlier syntheses already carries. Cite the earlier finding and add only what is new. - Cite every claim as [SOURCE: path:line]. A claim with no resolving citation is not a finding. - Mark each claim observed (you read the line) or inferred (you reason from it). - Name the 003 phase every finding belongs to. A finding that fits no phase goes under net-new. - Write only inside your own lineage folder."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 47
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=0, Specs=46, Scripts=0, Tests=0, Config=0, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 004-reference-evidence-research
- **Generated**: 2026-11-27T07:35:08.328Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/deltas/iter-001.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/deltas/iter-009.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/queries.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/attachments.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/audit-words.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/connect-prompt.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/recorder-masking.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/routine-checklist.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/shared/what-if.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenGhost-main/memory.js | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/Cargo.toml | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/app.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/terminal.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/theme.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/FINDINGS-gemini-live.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/llms.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/tests/cli_sigpipe.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/tests/composio_list_tools_stack_overflow_regression.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/tests/cost_cap_removed.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-api/src/namespace/mod.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/reply.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-bus/src/policy.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/command_shell.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/docs/channel-providers.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/docs/memory.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/tests/data/memory_description_parity.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/context/openhuman-full/LICENSE | Cited | OK | Citations=1; Iterations=1 |

---
