---
title: "CC-029 -- Claude Code native goal boundary"
description: "Validates that Claude Code is outside the runtime-neutral adapter and routes to its native goal surface."
version: 2.0.0.0
---

# CC-029 -- Claude Code native goal boundary

## 1. OVERVIEW

The runtime-neutral goal core does not register a Claude Code adapter or command. Repository policy routes Claude Code goal requests to the runtime's native feature where available. OpenCode's `mk_goal` tools and the Pi/Cursor sibling core are different systems and must not be invoked as substitutes.

## 2. SCENARIO CONTRACT

- Objective: Confirm the runtime matrix, tracked adapter tree, registrations, and constitutional routing rule all exclude Claude Code from the sibling core without claiming unsupported management.
- Real user request: `Set a goal for this Claude Code session.`
- Prompt: `Verify that Claude Code uses its native goal surface, that this repository registers no Claude goal adapter or shared-CLI command, and that OpenCode, Pi, Cursor, and Codex support claims match current source.`
- Expected execution process: inspect the goal adapter tree -> scan Claude registrations and commands -> read the constitutional routing rule and goal README -> verify no document tells Claude Code to call `mk_goal` or the unbound CLI.
- Exact command sequence: run `test ! -e .opencode/hooks/goal/claude`, scan `.claude` for goal adapter registrations, then read `.opencode/hooks/goal/README.md` and `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`.
- Expected signals: no `goal/claude` adapter, no Claude goal registration, README matrix says no sibling-core adapter, and policy directs native goal routing.
- Evidence requirements: capture the path-check exit status, registration scan, and exact README and constitutional routing lines.
- Desired user-visible outcome: Documentation-boundary PASS plus an explicit statement that this scenario does not validate product-internal native storage or model delivery.
- Pass/fail: PASS when all repository surfaces agree. FAIL if a Claude adapter/registration appears or docs claim shared-core support without matching code and tests.
- Failure triage: treat a new adapter or registration as a goal-contract change; treat prose-only disagreement as documentation drift and update it only after source and registration checks.

## 3. TEST EXECUTION

### Exact Command Sequence

Run `test ! -e .opencode/hooks/goal/claude`, scan `.claude` for goal adapter registrations, then read `.opencode/hooks/goal/README.md` and `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CC-029 | Claude Code native goal boundary | Repository support-truth audit | `Verify that Claude Code uses its native goal surface, that this repository registers no Claude goal adapter or shared-CLI command, and that OpenCode, Pi, Cursor, and Codex support claims match current source.` | `test ! -e .opencode/hooks/goal/claude`; scan `.claude` for goal adapter registrations; read `.opencode/hooks/goal/README.md` and `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | No adapter/registration; both docs route Claude Code outside the sibling core | Path checks and exact matrix/policy lines | PASS when source, config, and docs agree | Treat any new adapter as a contract change requiring native identity, management, and tests before updating prose |

This scenario is documentation-only for Claude Code's native product behavior. It does not assert where the product stores native goal state or whether a specific headless invocation exposes that feature.

## 4. SOURCE FILES

|| File | Role |
||---|---|
|| `../../../../../skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | Runtime routing authority. |
|| `../../../../../hooks/goal/README.md` | Current support matrix and sibling-core boundary. |
|| `../../../../../hooks/goal/lib/goal-core.cjs` | Scoped core that has no Claude caller. |
|| `../../../../../commands/goal-opencode.md` | OpenCode-only command, not a Claude Code fallback. |

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: CC-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt equals the table Exact Prompt cell.
