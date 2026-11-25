---
title: "Resource Map — Planning-depth review of packet specs/system-skilled-bots/003-openbot-parity-build, the OpenBot parity build for skilled bots: fourteen phases (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment, 014-deep-review). The operator wants to build all of it in one shot to perfection, so every phase must be planned and architected deeply enough that a builder needs no design decision while building. Phase 003-terminal-screen was just expanded into a Level 3 phase parent with six children (UX and component map with a design/ folder of mockups, key map, glyph table and component inventory; architecture and contracts; shell and navigation; panes; answer flow; hardening). Use it as the benchmark for depth. Do not review 003's children themselves. For every other phase answer: is it planned deeply enough to one-shot? What is missing: module and file design, data contracts and record schemas with every field, state machines and lifecycles, error and refusal catalogue, concurrency and restart behavior, migration and rollback, test strategy with fixtures, the interfaces it offers to and takes from other phases, security boundaries, operator prerequisites, and design artifacts (diagrams, schema files, sequence flows, mockups for anything user-facing such as chat and channel messages)? Should it become a phase parent with children like 003, and which children? What reference code in specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main) should it study first? Evidence (read-only): the phase docs; the built runtime under .skilled/skills/system-skilled-bots/runtime/lib/ and .skilled/bin/bots.cjs; the earlier research in specs/system-skilled-bots/002-openbot-parity-research/. Every finding names the phase, the gap, the evidence as [SOURCE: path:line], a severity (P0 the build cannot be one-shot without it, P1 a builder would have to decide, P2 polish) and the exact planning artifact or child phase that closes it. End with a ranked per-phase expansion plan."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 16
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=0, Specs=16, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 003-plan-depth-research
- **Generated**: 2026-11-25T22:18:21.170Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/tasks.md | Cited | OK | Citations=1; Iterations=1 |

---
