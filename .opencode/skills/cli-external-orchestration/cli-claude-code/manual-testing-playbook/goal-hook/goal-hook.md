---
title: "CC-029 -- Claude Code repository goal discovery boundary"
description: "Validates that Claude Code cannot discover the OpenCode-only goal command through this repository."
version: 2.0.0.1
---

# CC-029 -- Claude Code repository goal discovery boundary

## 1. OVERVIEW

The runtime-neutral goal core does not register a Claude Code adapter or command. Claude's repository command tree is a filtered per-file mirror that excludes the OpenCode-only goal router. OpenCode's `mk_goal` tools and the Pi/Cursor sibling core are different systems and must not be invoked as substitutes. This repository boundary does not prove whether a live Claude product version exposes a separate native goal feature.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the filtered Claude command tree, tracked adapter tree, registrations, and runtime matrix exclude the OpenCode-only goal surface.
- Real user request: `Set a goal for this Claude Code session.`
- Prompt: `Verify that this repository does not expose the OpenCode-only goal command to Claude Code, registers no Claude goal adapter, and makes no unproven claim about a separate live Claude goal feature.`
- Expected execution process: inspect the goal adapter tree -> verify `.claude/commands` is a real filtered directory -> verify the OpenCode goal command is absent while a shared command is symlinked -> run the mirror check -> read the runtime matrix and routing rule.
- Exact command sequence: run `test ! -e .opencode/hooks/goal/claude`; `test -d .claude/commands && test ! -L .claude/commands`; `test ! -e .claude/commands/goal-opencode.md`; `test -L .claude/commands/agent-router.md`; then run `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check` and scan `.claude/settings.json` for goal registrations.
- Expected signals: no `goal/claude` adapter or Claude goal registration; the Claude command root is not a whole-directory symlink; `goal-opencode.md` is absent; a shared command is linked; the mirror check passes.
- Evidence requirements: capture every path-check and mirror-check exit status, the registration scan, and the exact README and constitutional routing lines.
- Desired user-visible outcome: Repository-discovery PASS plus an explicit statement that live product-native behavior remains unverified.
- Pass/fail: PASS when the filter, generator, source, config, and docs agree. FAIL if the OpenCode command enters Claude discovery, a Claude adapter/registration appears, or docs claim unverified live support.
- Failure triage: treat a new adapter or registration as a goal-contract change; treat prose-only disagreement as documentation drift and update it only after source and registration checks.

---

## 3. TEST EXECUTION

### Exact Command Sequence

Run the exact path and mirror checks from the scenario contract, scan `.claude/settings.json` for goal adapter registrations, then read `.opencode/hooks/goal/README.md` and `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CC-029 | Claude Code repository goal discovery boundary | Repository support-truth audit | `Verify that this repository does not expose the OpenCode-only goal command to Claude Code, registers no Claude goal adapter, and makes no unproven claim about a separate live Claude goal feature.` | `test ! -e .opencode/hooks/goal/claude`; `test -d .claude/commands && test ! -L .claude/commands`; `test ! -e .claude/commands/goal-opencode.md`; `test -L .claude/commands/agent-router.md`; run `sync-runtime-mirrors.cjs --check`; scan `.claude/settings.json` | No adapter/registration; filtered real root; OpenCode goal absent; shared link present; mirror check green | Path and mirror exit statuses plus exact matrix/policy lines | PASS when filter, generator, source, config, and docs agree | Treat a leaked command or new adapter as a contract change requiring native identity, management, and tests before updating prose |

This scenario proves repository discovery only. It does not assert that a specific Claude product version exposes native goal state, where such state would live, or whether a headless invocation can use it.

---

## 4. SOURCE FILES

|| File | Role |
||---|---|
|| `../../../../../skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | Runtime routing authority. |
|| `../../../../../hooks/goal/README.md` | Current support matrix and sibling-core boundary. |
|| `../../../../../hooks/goal/lib/goal-core.cjs` | Scoped core that has no Claude caller. |
|| `../../../../../commands/goal-opencode.md` | OpenCode-only command, not a Claude Code fallback. |
|| `../../../../../skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs` | Filtered Claude command mirror authority. |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: CC-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt equals the table Exact Prompt cell.
