---
title: "READ-001 -- Read A Design System"
description: "This scenario validates read-only content access for `READ-001`. It focuses on reading a registered design system's DESIGN.md and tokens.css with nothing written."
version: 1.4.0.2
---

# READ-001 -- Read A Design System

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `READ-001`.

---

## 1. OVERVIEW

This scenario validates read-only content access for `READ-001`. It focuses on reading a registered design system's `DESIGN.md` and `tokens.css` read-only, confirming nothing is written and the read is usable as grounding input.

### Why This Matters

Reading local content is the safe default direction and the input to design work. The read must stay read-only and must not vendor Open Design files into the repo, because their per-source licenses would attach. This scenario proves the safe path works and respects the live-read rule.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `READ-001` and confirm the expected signals without contradictory evidence.

- Objective: read a design system's DESIGN.md and tokens.css read-only with nothing written
- Real user request: `Read the DESIGN.md and tokens for one of Open Design's design systems.`
- Prompt: `Show me one design system's DESIGN.md and its tokens, read-only.`
- Expected execution process: confirm the app is open, list or resolve one system, read its manifest files, and treat the result as grounding input
- Expected signals: the 9-section DESIGN.md returns, a :root tokens.css returns, no repo files are created or modified
- Desired user-visible outcome: the agent shows the system's prose and tokens and notes they are read live, not cached
- Pass/fail: PASS if DESIGN.md and tokens.css are returned AND no repo write occurs. FAIL if the read writes files OR returns nothing for a valid system path

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. The read stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Confirm the desktop app is open so the daemon socket exists.

1. `open-design.list_projects({})`  # -> projects returned, including the active context
2. Read one system. The built-in systems (~150) live in the app bundle at `/Applications/Open Design.app/Contents/Resources/open-design/design-systems/<name>/` (each with DESIGN.md, tokens.css, components.html). Read via the wired Code Mode MCP (it receives the daemon-injected token), via `node "$OD_BIN" tools design-systems read --path <manifest-path>` when `OD_TOOL_TOKEN` is present, or directly from the bundle path. Standalone `od tools design-systems read` without the token fails with "OD_TOOL_TOKEN is required".  # -> 9-section DESIGN.md plus :root tokens.css
3. `bash: git status --short`  # -> no new or modified repo files from the read

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| READ-001 | Read-only content access | Verify a design system reads read-only with nothing written | `Show me one design system's DESIGN.md and its tokens, read-only.` | 1. `open-design.list_projects({})` -> 2. `node "$OD_BIN" tools design-systems read --path <manifest-path>` -> 3. `bash: git status --short` | Step 1: projects returned. Step 2: 9-section DESIGN.md plus :root tokens.css. Step 3: no repo writes | Tool output for the read and the clean git status | PASS if DESIGN.md and tokens.css returned AND no repo write. FAIL if files were written OR a valid system path returned nothing | 1. Confirm the app is open and the socket exists. 2. Confirm the manifest path is correct. 3. Confirm the read tool was used, not a write verb. |

### Optional Supplemental Checks

Read `components.html` for the same system when present, and confirm it is treated as reuse-at-build-time input rather than copied into the repo.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/reading/read-only-content.md` | Feature-catalog source describing the read contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The read-only tools and the surface policy |
| `../../references/od-cli-reference.md` | CLI verb surface with read-only classification |

---

## 5. SOURCE METADATA

- Group: Reading
- Playbook ID: READ-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `reading/read-design-system.md`
