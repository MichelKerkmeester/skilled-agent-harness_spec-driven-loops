---
title: "cli-devin: Manual Testing Playbook"
description: "Operator-facing split-document playbook for the Devin CLI surface: invocation, permissions, hooks, subagents, skills, rules, MCP, continuity, and cloud handoff."
version: 1.0.0.0
---

# cli-devin: Manual Testing Playbook

> **EXECUTION POLICY**: Every executable scenario MUST run a real `devin` command. Capture the exact command, prompt, stdout/stderr, and exit code. The only valid verdicts are PASS, FAIL, or SKIP with a named blocker. `UNAUTOMATABLE` and `PARTIAL` are not verdicts. Scenarios that inspect a surface without starting a cloud handoff or mutating live configuration may intentionally record SKIP for the unexecuted variant.

> **SELF-INVOCATION GUARD**: Run this playbook from a non-Devin runtime. Do not execute it from inside Devin CLI: `DEVIN_PROJECT_DIR` or Devin process ancestry means the surface under test is already the caller and the `cli-devin` skill must refuse self-dispatch.

This package follows the sibling split-document pattern: the root file is the directory and review protocol, while each scenario has its own runnable contract and source anchors.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `cli-invocation/`
- `permission-modes/`
- `hooks/`
- `subagents/`
- `commands-and-skills/`
- `rules/`
- `mcp-integration/`
- `session-continuity/`
- `cloud-handoff/`


---

## EXECUTION RESULTS

Executed live against `devin 3000.2.17` on 2026-07-27. Config-mutating scenarios ran in disposable temp workspaces; the repository's own `.devin/hooks.v1.json` was never modified.

**19 PASS - 0 FAIL - 1 SKIP (by design)**

| Scenario | Result | Evidence |
|---|---|---|
| `DV-001` | PASS | default devin -p dispatch returned the requested token |
| `DV-002` | PASS | command -v devin resolves: /Users/michelkerkmeester/.local/bin/devin; version devin 3000.2.17 (2c489dfc) |
| `DV-003` | PASS | fabricated --reasoning-effort rejected: error: unexpected argument '--reasoning-effort' found |
| `DV-004` | PASS | help advertises smart=yes but runtime rejects it: error: invalid value 'smart' for '--permission-mode <PERMISSION_MODE>': Invalid permission mode: smart. Valid options: normal (auto), accept-edits, dangerous (yolo, bypass), autonomous (requires --sandbox) |
| `DV-005` | PASS | write-attempt matrix: auto=BLOCKED accept-edits=WROTE bypass=WROTE (auto blocks non-interactively, bypass auto-approves) |
| `DV-006` | PASS | autonomous+sandbox permitted the in-workspace write |
| `DV-007` | PASS | 6 events observed live under bypass: SessionStart UserPromptSubmit PreToolUse PostToolUse Stop SessionEnd. PostCompaction not observed (needs a long session). |
| `DV-008` | PASS | PermissionRequest present under auto [PermissionRequest PreToolUse SessionEnd SessionStart Stop UserPromptSubmit ], absent under bypass [PostToolUse PreToolUse SessionEnd SessionStart Stop UserPromptSubmit ] |
| `DV-009` | PASS | PreToolUse FIRES under --permission-mode bypass (isolated workspace): [PostToolUse PreToolUse SessionEnd SessionStart Stop UserPromptSubmit ] |
| `DV-010` | PASS | subagent_explore dispatched, returned a read-only self-description |
| `DV-011` | PASS | mirrored roster agent dispatched; reply derived from the symlinked agent body (framework selection) |
| `DV-012` | PASS | all 13 roster agents enumerated alongside subagent_explore/subagent_general |
| `DV-013` | PASS | unknown profile did not silently resolve; Devin reported it as unavailable |
| `DV-014` | PASS | 36/36 mirrored commands + 12/12 skills registered |
| `DV-015` | PASS | mirrored command /memory-save resolved; reply derived from the symlinked command body |
| `DV-016` | PASS | all 36 command frontmatters parse as valid YAML (0 invalid) |
| `DV-017` | PASS | paths list .windsurf+.cursor; loaded: 5 rules incl skill-routing[Cursor], CLAUDE, AGENTS |
| `DV-018` | PASS | devin mcp surface reachable: Connect and log in to Model Context Protocol servers |
| `DV-019` | PASS | --continue carried session state; codeword recalled across dispatches |
| `DV-020` | SKIP | cloud handoff surface exists (devin cloud); not executed by design - transfers the session to a cloud VM, not safely reversible in a test run |

Two results corrected assumptions carried in the authored scenarios:

- `accept-edits` also completes a write non-interactively, so the practical split is `auto` blocks while `accept-edits`/`bypass` proceed - not bypass alone.
- `autonomous --sandbox` **permitted** an in-workspace write. An earlier probe in this packet saw it blocked, but that target was `/tmp`, outside the granted write scope; the sandbox was enforcing scope correctly rather than refusing all writes.

`PostToolUse` is absent from the `auto` run because the write never completed there - the event matrix differs by outcome, not only by mode.

## 1. OVERVIEW

This playbook contains 20 deterministic scenarios across 9 categories. The count is deliberate: six confirmed lifecycle events are covered by one event-matrix scenario, while approval delivery and the bypass safety invariant have dedicated scenarios. The result covers every requested Devin-native surface without duplicating one file per event where the evidence is the same.

Coverage note (2026-07-27): The scenarios are grounded in Devin 3000.2.17, with `devin` installed and authenticated during the live contract work. They cover the default `devin -p` dispatch, availability and hallucination probes, the `smart` help/runtime mismatch, `normal`/`auto`, `accept-edits`, `dangerous`/`bypass`, and `autonomous`/`--sandbox` permission behavior, six live hook events, the PermissionRequest difference, PreToolUse under bypass, built-in and mirrored subagents, all 13 mirrored agents, the 36 slash-command roster, the unquoted-colon parser defect, Cursor/Claude/Standard rule inheritance, the `devin mcp` surface, session continuation, and document-only `/handoff` coverage. No live result is asserted beyond the verified facts supplied with this phase.

---

## 2. GLOBAL PRECONDITIONS

1. Run from the repository root and confirm `command -v devin` succeeds.
2. Confirm `devin --version` reports `3000.2.17` or record the installed version before execution.
3. Scenario execution requires the operator to have completed `devin auth login`; this interactive OAuth step is not automated by the playbook and does not block authoring or packet validation.
4. Run outside Devin: `env | grep -E '(^|_)DEVIN_'` must not show `DEVIN_PROJECT_DIR`, and the process ancestry must not be a Devin session.
5. The repo dispatch convention is `devin --permission-mode bypass`; use `--permission-mode dangerous` only when the scenario explicitly requires the canonical value rather than the alias.
6. Valid permission values are `normal` (alias `auto`, default), `accept-edits`, `dangerous` (aliases `yolo`, `bypass`), and `autonomous` only with `--sandbox`. The help text's `smart` entry is intentionally tested as a documentation/runtime mismatch; do not treat `smart` as valid.
7. Any scenario that changes `.devin/hooks.v1.json`, `.devin/skills/`, or another live config MUST create and use an isolated temporary workspace. The repository's real configuration and symlinks are never test fixtures.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Exact `devin` command, including model, permission mode, sandbox flag, working directory, and `</dev/null` where non-interactive.
- The realistic user request and the exact prompt sent to Devin.
- Captured stdout and stderr, exit code, and relevant filesystem/config evidence.
- A verdict of PASS, FAIL, or SKIP with the named blocker when skipped.
- For isolated-config scenarios, the temporary workspace path and proof that the repository's live files were not changed.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Commands are shown as `devin ...` and should be captured with `2>&1`.
- Non-interactive prompts use `-p`/`--print`, an explicit `--model`, an explicit permission mode, and `</dev/null`.
- `->` separates sequential commands.
- Destructive or cloud-affecting variants are opt-in and require explicit operator approval before execution.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

Each scenario passes only when its preconditions, exact command, expected signal, and evidence are present. PASS means the expected behavior was observed. FAIL means the command or behavior contradicted the contract. SKIP means a named blocker prevented execution; authentication, cloud side effects, and an unavailable binary are valid blockers when recorded.

Release is READY only when all 20 scenario files are represented in this index, no required scenario is FAIL, every SKIP has a still-valid blocker, and the critical baseline scenarios DV-001, DV-002, DV-005, DV-007, and DV-009 are PASS or explicitly blocked by the global authentication precondition.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

Run read-only probes first: DV-001..004, DV-007, DV-012, DV-014, DV-017, DV-018, and DV-020. Run write-capable permission and subagent scenarios serially in isolated directories. Run hook mutation scenarios only in their own temporary workspace. The `/handoff` scenario is document-only by default and must not create a cloud session without explicit approval.

---

## 7. CLI INVOCATION (`DV-001..DV-004`)

- [DV-001 -- Default print dispatch](cli-invocation/default-invocation.md)
- [DV-002 -- Availability probe](cli-invocation/availability-probe.md)
- [DV-003 -- Fabricated-flag hallucination fixture](cli-invocation/hallucination-fixture-fabricated-flag.md)
- [DV-004 -- `smart` help/runtime mismatch](cli-invocation/smart-permission-doc-runtime-mismatch.md)

---

## 8. PERMISSION MODES (`DV-005..DV-006`)

This category replaces a Codex-shaped sandbox matrix. Devin permission approval and the OS-level `--sandbox` switch are separate axes; `autonomous` is selected by `--sandbox`, not a fifth ordinary approval mode.

- [DV-005 -- Normal/accept-edits/bypass write matrix](permission-modes/write-attempt-mode-matrix.md)
- [DV-006 -- Autonomous sandbox write attempt](permission-modes/autonomous-sandbox-write-attempt.md)

---

## 9. HOOKS (`DV-007..DV-009`)

- [DV-007 -- Six confirmed lifecycle events](hooks/confirmed-events-smoke-matrix.md)
- [DV-008 -- PermissionRequest auto versus bypass](hooks/permission-request-auto-vs-bypass.md)
- [DV-009 -- PreToolUse still fires under bypass](hooks/pretooluse-still-fires-under-bypass.md)

---

## 10. SUBAGENTS (`DV-010..DV-013`)

This category replaces a Codex `config.toml` profile-routing test with Devin's real `run_subagent` surface.

- [DV-010 -- Built-in profile](subagents/builtin-profile.md)
- [DV-011 -- Mirrored roster agent](subagents/mirrored-roster-agent.md)
- [DV-012 -- Full roster enumeration](subagents/roster-enumeration.md)
- [DV-013 -- Missing-profile negative case](subagents/missing-profile-negative.md)

---

## 11. COMMANDS AND SKILLS (`DV-014..DV-016`)

Devin's `skills` subcommand is the slash-command surface. These scenarios verify the 36 registered mirrored commands and the strict-parser regression without inventing a separate `devin commands` system.

- [DV-014 -- Skills/command roster](commands-and-skills/skills-roster.md)
- [DV-015 -- Invoke a mirrored command](commands-and-skills/mirrored-command-invocation.md)
- [DV-016 -- Unquoted-colon YAML regression](commands-and-skills/unquoted-colon-frontmatter-regression.md)

---

## 12. RULES (`DV-017`)

- [DV-017 -- Rule paths and loaded inheritance](rules/rules-list-and-paths.md)

---

## 13. MCP INTEGRATION (`DV-018`)

- [DV-018 -- `devin mcp` surface](mcp-integration/mcp-surface.md)

---

## 14. SESSION CONTINUITY (`DV-019`)

- [DV-019 -- Continue and resume](session-continuity/resume-continue.md)

---

## 15. CLOUD HANDOFF (`DV-020`)

- [DV-020 -- `/handoff` document-and-SKIP surface](cloud-handoff/handoff-surface-skip.md)

---

## 16. AUTOMATED TEST CROSS-REFERENCE

The playbook is manual by design. It has no replacement automated suite for the authenticated CLI, hook delivery, interactive slash commands, or cloud handoff. Structural evidence can be checked locally with `rg`, `find`, and the phase's Spec Kit validator; those checks do not replace executing the scenario commands.

---

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

The root index and per-scenario files are the canonical manual-testing catalog for `cli-devin`. The skill packet's source anchors are:

| Surface | Source |
|---|---|
| Invocation, permissions, continuity, subcommands | [`references/cli-reference.md`](../references/cli-reference.md) |
| Subagents | [`references/agent-delegation.md`](../references/agent-delegation.md) |
| Built-in tools and MCP | [`references/devin-tools.md`](../references/devin-tools.md) |
| Cloud handoff | [`references/cloud-handoff.md`](../references/cloud-handoff.md) |
| Skill packet contract | [`../SKILL.md`](../SKILL.md) |

Scenario files carry the exact source anchors and validation criteria for their own category; this index intentionally does not duplicate those contracts.
