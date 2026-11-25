---
title: "Resource Map — Build-readiness review of the eleven planned phases of packet specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels). Each phase has spec.md, plan.md, tasks.md and acceptance-criteria.md. They were written in parallel, each alone, and nobody has checked them against the built runtime or against each other. This is a review of plans, not new design research. Evidence (read-only): the phase docs; the built skilled-bots runtime (.skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/scripts/bot-check.cjs, runtime/tests/); the parity research synthesis specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md; the reference repos under specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main). Four angles: 1. Plan versus runtime: do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here? 2. Cross-phase consistency: do the phases agree on shared records (by: actor, grants, operators.json, conversation JSONL, memory files, state-root layout, HonoredPosture fields, bots --json output read by the terminal screen and the channels), and are the build order and dependencies sound? 3. Parity gaps and overbuild: for a small team, what is still missing after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime? 4. Security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals from terminal and chat, prompt injection through memory, skills or chat, routine until and fatigue edge cases. Every finding names the phase, the doc and line, the evidence with [SOURCE: path:line], a severity (P0 blocks the build, P1 wrong or missing, P2 polish) and the exact spec edit that fixes it. End with findings grouped by phase and ranked, plus a cross-phase conflict list."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 168
- **By category**: READMEs=0, Documents=8, Commands=2, Agents=0, Skills=47, Specs=103, Scripts=2, Tests=0, Config=6, Meta=0
- **Missing on disk**: 75
- **Scope**: research convergence output for 003-openbot-parity-build
- **Generated**: 2026-11-25T14:29:06.285Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/bots-runtime.yml:10-63,96-118 | Cited | MISSING | Citations=1; Iterations=1 |
| .gitignore | Cited | OK | Citations=1; Iterations=1 |
| .opencode/bin | Cited | OK | Citations=4; Iterations=4 |
| .opencode/bin/bots.cjs and .skilled/bin/bots.cjs SHA-1 comparison | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/bots.cjs:31-73,455-462 | Cited | MISSING | Citations=1; Iterations=1 |
| ls THIRD_PARTY_NOTICES.md -> absent | Cited | MISSING | Citations=1; Iterations=1 |
| which cargo rustc -> /Users/michelkerkmeester/.cargo/bin/cargo | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/doctor/bots.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/mcp-doctor-lib.sh | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/mcp-code-mode/mcp-server/dist/index.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | Cited | OK | Citations=8; Iterations=8 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:307-318,1495-1517 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1143-1167,1495-1517 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1147-1160,1494-1497,1508-1516 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1494-1497,1498-1506,1508-1516,1611 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/bots-run/references | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/answer.ts | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:6-13,100 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/definition.ts | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45,135-145 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:75,100-146,233-235 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts | Cited | OK | Citations=8; Iterations=8 |
| .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:19,601-612 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:287,612 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/installer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/runtime/lib/label.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/label.ts:28,99 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:33,100,252-256,287,320-323 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/posture.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts | Cited | OK | Citations=8; Iterations=8 |
| .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128,149-183,196-270 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128,197,239 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/runner.ts | Cited | OK | Citations=10; Iterations=10 |
| .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:535-537,832-846,932 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:832,870 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:942-953,1062 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55,253-258,266,677 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55,253,677 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/status.ts | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-114,417 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/lib/switches.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/runtime/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-bots/scripts/bot-check.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:14-22,74-77 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-bots/scripts/fixtures/clean/bots/nightly-digest/BOT.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:21-95,157 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:95,184 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md | Cited | OK | Citations=7; Iterations=7 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:40,60,76 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md | Cited | OK | Citations=11; Iterations=11 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:114,179 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:130,153 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/ (no notice task) | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md | Cited | OK | Citations=7; Iterations=7 |
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md | Cited | OK | Citations=11; Iterations=11 |
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:106,108,112,118,160,163,165,173 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:109,171 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/acceptance-criteria.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md | Cited | OK | Citations=8; Iterations=8 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:30-60,85 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31,41,46-49,72 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md | Cited | OK | Citations=11; Iterations=11 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:31,85,160-200 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:112,127,140,147,161,162 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:143,146,150,162 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162,171,174 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/tasks.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/tasks.md:43,60,72 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/acceptance-criteria.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:45-49,82 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:49,82 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md | Cited | OK | Citations=7; Iterations=7 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:112,255 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/005-memory/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md | Cited | OK | Citations=11; Iterations=11 |
| specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md | Cited | OK | Citations=12; Iterations=12 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96,103,104,105 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96,104 | Cited | MISSING | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104,145,146,147,148,149,150,156,157,204,216,240 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:107,132 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:62,79,84,129 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:99,116 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:100,104 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:104,108,118,141,142,144,145,165,166,178-182 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md | Cited | OK | Citations=6; Iterations=6 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:64,69,73,101,126 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md | Cited | OK | Citations=9; Iterations=9 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:96,101-108,147,152,154,189,218-220,241,243 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:147-163,187-189 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:154,187 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md | Cited | OK | Citations=6; Iterations=6 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md | Cited | OK | Citations=7; Iterations=7 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:150-175,198,252 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:156,252 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/009-skills/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md | Cited | OK | Citations=11; Iterations=11 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:94,135 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:101-108,117,148,149,150,154,161,163,174 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:115,150,153 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:119,133 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:120,148-177 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/010-conversations/tasks.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:58,63 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md | Cited | OK | Citations=7; Iterations=7 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md | Cited | OK | Citations=13; Iterations=13 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:43-53,137-160,175-182,281 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:45,49,118,133,140,152,177,194,195,221,222,281,282 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:49,61,112-114,135,209 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:53,55,141,174,177,196 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:59,111,122,125,133,146,175-177,210,224,281 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:111-116,177,191,281 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:112,170-200,209,249,283 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:144,157 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/lineages/devin-2/deep-research-state.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/lineages/devin-2/deltas/iter-001.jsonl through iter-012.jsonl | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/lineages/devin-2/findings-registry.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/lineages/devin-2/iterations/iteration-006.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/lineages/devin-2/iterations/iteration-007.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/lineages/devin-2/iterations/iteration-012.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/lineages/vibe-2/findings-registry.json | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skilled-bots/003-openbot-parity-build/spec.md | Cited | OK | Citations=11; Iterations=11 |
| specs/system-skilled-bots/003-openbot-parity-build/spec.md:3,55,78,94,100,104-109,119-131 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/spec.md:78,82,94,109 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/003-openbot-parity-build/spec.md:85-97,114-143 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_tests.rs | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/bin/bots.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/bots.cjs | Cited | OK | Citations=5; Iterations=5 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/mcp.json | Cited | OK | Citations=2; Iterations=2 |
| .codex/config.toml | Cited | OK | Citations=1; Iterations=1 |
| .cursor/mcp.json | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/bots-runtime.yml | Cited | OK | Citations=3; Iterations=3 |
| .utcp_config.json | Cited | OK | Citations=3; Iterations=3 |
| opencode.json | Cited | OK | Citations=1; Iterations=1 |

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
