---
title: "System Skill Advisor: Manual Testing Playbook"
description: "Initial scaffold for standalone System Skill Advisor manual testing scenarios. Full population moves in child 003."
trigger_phrases:
  - "system skill advisor playbook"
  - "advisor manual testing"
  - "native advisor_recommend scenario"
---

# System Skill Advisor: Manual Testing Playbook

This is the initial scaffold for the standalone `system-skill-advisor` manual testing playbook. Full population happens in child 003 when the legacy advisor playbook moves from `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/`.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. NATIVE MCP TOOLS](#4--native-mcp-tools)
- [5. FUTURE POPULATION](#5--future-population)

---

## 1. OVERVIEW

Initial scaffold, full population in child 003.

This playbook currently carries one real native-tool scenario so the package has a concrete manual validation anchor. The complete legacy corpus contains native MCP tools, CLI hooks and plugin, compatibility flags, operator states, daemon behavior, auto-indexing, lifecycle routing, scorer fusion, and Python compatibility.

---

## 2. GLOBAL PRECONDITIONS

For child 002, scenarios are documentation-only because runtime still lives in the legacy source tree.

When child 003 and child 004 land, the standalone preconditions become:

1. Working directory is the repository root.
2. The `system_skill_advisor` MCP server is registered and built.
3. The advisor database exists at `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`.
4. `advisor_status` reports `live` or `stale`, not `absent`.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Scenario ID and file path.
- Exact MCP call payload or command transcript.
- Captured JSON response or focused excerpt.
- Exit code for shell commands.
- Final verdict with rationale.
- Triage notes for `FAIL`, `PARTIAL`, or `SKIP`.

---

## 4. NATIVE MCP TOOLS

| ID | Scenario | File | Current state |
|---|---|---|---|
| NC-001 | Native `advisor_recommend` happy path | [01--native-mcp-tools/001-native-recommend-happy-path.md](./01--native-mcp-tools/001-native-recommend-happy-path.md) | Mirrored scaffold entry |

---

## 5. FUTURE POPULATION

Child 003 moves or rehomes the complete legacy playbook from:

```text
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/
```

Expected groups after full population:

- `01--native-mcp-tools`
- `02--cli-hooks-and-plugin`
- `03--compat-and-disable`
- `04--operator-h5`
- `05--auto-update-daemon`
- `06--auto-indexing`
- `07--lifecycle-routing`
- `08--scorer-fusion`
- `10--python-compat`
