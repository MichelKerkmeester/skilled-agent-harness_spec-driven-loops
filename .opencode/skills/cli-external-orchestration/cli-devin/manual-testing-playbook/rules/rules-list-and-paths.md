---
title: "DV-017 -- Rules paths and loaded inheritance"
description: "Verify Devin's own Windsurf rules path and its loaded Cursor, Claude, Standard, and Windsurf rule entries."
version: 1.0.0.0
---

# DV-017 -- Rules paths and loaded inheritance

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-017`.

## 1. OVERVIEW

Inspect both `devin rules paths` and `devin rules list` to confirm the cross-runtime rule inheritance currently observed in this repository.

### Why This Matters

Rules are context inputs, not slash commands. The path report proves where Devin looks; the list proves which Cursor, Claude, Standard, and Windsurf sources are actually loaded.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the rule roots and loaded inheritance classes.
- Real user request: `Which repository rules does Devin load, and where does it look for them?`
- Prompt: `Do not edit files. Report the rule roots and loaded rule sources visible to this Devin session.`
- Expected execution process: Run `devin rules paths`, `devin rules list`, and a read-only print request; compare the outputs with `.cursor/rules/`, root `CLAUDE.md`, and `AGENTS.md`.
- Expected signals: Devin reports its own `.windsurf/rules/*.md` directory as always-on, also reads `.cursor/rules/*.md` conditionally, and lists `skill-routing [Cursor]`, `CLAUDE [Claude]`, `AGENTS [Standard]`, and `global_rules [Windsurf]`.
- Desired user-visible outcome: A concrete rule-inheritance matrix, not a claim that Devin has `.devin/rules/`.
- Pass/fail: PASS when paths and entries match; FAIL when a source is missing or a nonexistent `.devin/rules/` path is reported as authoritative; SKIP on auth/availability blockers.

---

## 3. TEST EXECUTION

1. `devin rules paths > /tmp/cli-devin-dv017-paths.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv017-paths.txt`
2. `devin rules list > /tmp/cli-devin-dv017-list.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv017-list.txt`
3. `devin -p "Do not edit files. Report the rule roots and loaded rule sources visible to this Devin session." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv017-prompt.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv017-prompt.txt`
4. Compare all three outputs with the repository files.

| Feature ID | Exact commands | Expected signal | Verdict |
|---|---|---|---|
| DV-017 | `devin rules paths` and `devin rules list` | Cursor + Claude + Standard + Windsurf inheritance | PASS/FAIL/SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Rules category scope |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Verified rules paths and loaded list |
| `../../../../.cursor/rules/` | Cursor conditional rules |
| `../../../../AGENTS.md` | Standard repository rules |
| `../../../../CLAUDE.md` | Claude repository rules |

---

## 5. SOURCE METADATA

- Group: Rules
- Playbook ID: DV-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `rules/rules-list-and-paths.md`
