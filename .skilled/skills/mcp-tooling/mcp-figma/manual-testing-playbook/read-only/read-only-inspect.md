---
title: "INSPECT-001 -- Read-Only Inspect"
description: "This scenario validates read-only inspect for `INSPECT-001`. It focuses on returning structure or properties from the open Figma file without changing the document."
version: 1.0.0.1
---

# INSPECT-001 -- Read-Only Inspect

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `INSPECT-001`.

---

## 1. OVERVIEW

This scenario validates read-only inspect for `INSPECT-001`. It focuses on confirming a read-only inspect (for example `figma-ds-cli get` / `find` / `node tree` / `inspect`) returns structure or properties from the open Figma file without changing the document.

### Why This Matters

Inspect is the safe default and the input to design work and any later gated verb. The failure mode this guards against is a read verb that quietly mutates, or an agent that reaches for a mutating verb when a read-only one was asked for. The document must be provably unchanged after the run.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `INSPECT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm a read-only inspect returns document structure and writes nothing to Figma
- Real user request: `List the top-level nodes in my open Figma file.`
- Prompt: `List the top-level nodes in my open Figma file.`
- Expected execution process: with Figma open and connected (CONNECT-001 PASS), run a read-only verb and report the result; run no mutating or destructive verb
- Expected signals: the read verb returns nodes/properties; the Figma document is unchanged; no mutating verb ran
- Desired user-visible outcome: the agent shows the requested structure and the Figma file is provably unmodified
- Pass/fail: PASS if a read-only verb returned structure AND no mutating/destructive verb ran AND the document is unchanged; FAIL if any mutating verb ran OR the document changed

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Inspect stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires CONNECT-001 PASS and Figma Desktop open with a file. Use only a read-only verb from the SKILL.md READ-ONLY class.

1. confirm connected (`figma-ds-cli daemon status`)  # -> daemon healthy
2. `figma-ds-cli find` / `node tree` / `get` (read-only)  # -> nodes/properties returned, exit 0
3. agent reports the structure  # -> structure shown, no mutation

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INSPECT-001 | Read-only inspect | Verify an inspect verb returns structure without changing the Figma document | `List the top-level nodes in my open Figma file.` | 1. confirm connected (`daemon status`) -> 2. `figma-ds-cli find` / `node tree` / `get` (read-only) -> 3. agent reports the structure | Step 1: daemon healthy. Step 2: nodes/properties returned, exit 0. Step 3: structure shown, no mutation reported | Transcript of the read verb and its output snippet | PASS if a read-only verb returned structure AND no mutating/destructive verb ran AND the document is unchanged. FAIL if any mutating verb ran OR the document changed | 1. Confirm only a read-only verb from the SKILL.md READ-ONLY class ran. 2. Confirm no `create`/`set`/`bind`/`delete` verb appeared. 3. Confirm the document was unchanged (no version-history entry from this run). |

### Optional Supplemental Checks

Verify the exact read verb and flags against `figma-ds-cli --help` before grading; the inspect surface includes `find`, `get`, `inspect`, `node tree`, `node bindings`, `spec`, and `files`, all READ-ONLY.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/inspect/inspect.md` | Feature-catalog source describing the read-only inspect surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/figma-cli-reference.md` | Inspect verb surface and read-only classification |
| `../../references/tool-surface.md` | READ-ONLY gating taxonomy |

---

## 5. SOURCE METADATA

- Group: Read-Only Access
- Playbook ID: INSPECT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `read-only/read-only-inspect.md`
