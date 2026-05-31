---
title: "DV-011 -- devin rules list"
description: "This scenario validates that devin rules list enumerates the rules installed on the operator's Devin profile so the calling AI can reference rule names in dispatch prompts."
---

# DV-011 -- devin rules list

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-011`.

---

## 1. OVERVIEW

This scenario validates `devin rules list` for `DV-011`. Devin rules are profile-scoped behavioral constraints loaded automatically per session. The calling AI uses `devin rules list` to discover available rules so it can reference them by name in dispatch prompts.

### Why This Matters

Rules are one of cli-devin's three profile-scoped surfaces (alongside skills and MCP servers). Without an inventory command, the calling AI cannot confidently reference rules in prompts. The list subcommand is the operator-visible discovery surface.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin rules list` enumerates profile-scoped rules and that the output is parseable.
- Real user request: `Show me what behavioral rules are installed on my Devin profile so I can reference them by name in my prompts.`
- Prompt: `Run devin rules list and capture the rule names. Confirm the output enumerates profile-scoped rules and that the list is parseable.`
- Expected execution process: Operator runs `devin rules list` -> captures stdout -> parses for rule names -> confirms each rule has a name the calling AI can reference.
- Expected signals: `devin rules list` exits 0. Output enumerates zero or more rules with names. Empty output with a clear message is acceptable for an empty profile.
- Desired user-visible outcome: An operator-visible inventory of installed rules so the calling AI can route prompts through specific rules by name.
- Pass/fail: PASS if `devin rules list` exits 0 AND output is parseable (either a list of named rules OR an empty-state message). FAIL if exit non-zero OR output is unparseable.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run `devin rules list`; capture stdout.
2. Parse the output for rule names.
3. If non-empty, note one rule's name for later use in a dispatch prompt.
4. Return a PASS/FAIL verdict naming the rule count observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-011 | `devin rules list` | Verify rules-list subcommand returns parseable rule inventory | `Run devin rules list and capture the rule names. Confirm the output enumerates profile-scoped rules and that the list is parseable.` | 1. `bash: devin rules list > /tmp/dv-011-rules.txt 2>&1; echo "Exit: $?"` -> 2. `bash: cat /tmp/dv-011-rules.txt` -> 3. `bash: wc -l /tmp/dv-011-rules.txt` | Step 1: exit 0; Step 2: parseable text — either named rule entries or a clear empty-state message; Step 3: line count is non-negative | Captured stdout, exit code, terminal transcript | PASS if exit 0 AND output is parseable; FAIL if exit non-zero OR output is unparseable | (1) Confirm `devin rules` is in `devin --help`; (2) try `devin rules --help` for subcommand options; (3) check `~/.config/devin/config.json` for profile rules config |

### Optional Supplemental Checks

- If rules are listed, dispatch a small task referencing one by name (e.g. "Use the `no-rm-without-confirm` rule from this profile") and verify Devin honors it in the output.
- Compare rule discovery to the analog patterns in cli-codex (`-p <profile>`), cli-opencode (`--agent <slug>`), and cli-claude-code (skills).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§3 Subcommand Map) | Documents `devin rules list` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Devin Agent Delegation (rules row) |
| `../../references/agent_delegation.md` (§1 Overview) | Rules as a profile-scoped routing surface |

---

## 5. SOURCE METADATA

- Group: Devin Surfaces
- Playbook ID: DV-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--devin-surfaces/014-devin-rules-list.md`
