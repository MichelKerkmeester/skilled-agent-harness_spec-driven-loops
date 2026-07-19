---
title: "CC-024 -- Markdown agent spec folder scaffolding"
description: "This scenario validates markdown agent spec folder scaffolding for `CC-024`. It focuses on confirming `--agent markdown` produces a Level 1 spec folder scaffolding plan using the current tracked-packet path convention."
version: 1.1.0.7
---

# CC-024 -- Markdown agent spec folder scaffolding

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-024`.

---

## 1. OVERVIEW

This scenario validates markdown agent spec-folder scaffolding for `CC-024`. It focuses on confirming `--agent markdown` produces a Level 1 spec folder scaffolding plan that names the canonical files (spec.md, plan.md, tasks.md, implementation-summary.md) and the documentation level appropriate for the requested feature scope.

### Why This Matters

There is no `speckit` agent in the current roster. Spec-folder documentation is template-first markdown authoring, which is exactly what the `markdown` agent owns (`references/agent-delegation.md`'s roster entry: "Template-first markdown and documentation execution"), and the agent-delegation.md "Quick Selection" guide already routes "SPEC PACKET WORK" to the main agent plus `/speckit:plan`, not to a dedicated agent slug. When an external orchestrator delegates spec-folder scaffolding to Claude Code, the output must include the canonical Level-N file list, a level recommendation, and the current tracked-packet path shape. If the output omits required files, recommends the wrong level, or teaches the stale untracked path, downstream Gate-3 governance breaks because the spec folder lacks its mandatory artifacts or lands in the wrong location.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent markdown` produces a spec-folder scaffolding plan that names the appropriate documentation level, lists the required canonical files for that level, and cites the current tracked-packet path convention.
- Real user request: `Help me scaffold a spec folder for a tiny CLI flag addition. Less than 100 lines of code change. Pick the right level and tell me which files I need.`
- RCAF Prompt: `As an external-AI conductor preparing a spec folder for a small feature (add a --verbose flag, under 50 LOC), dispatch claude -p --agent markdown and ask for a Level recommendation plus the canonical file list for that level. Verify the response names a documentation level (1, 2, or 3), lists at least 4 canonical files (spec.md, plan.md, tasks.md, implementation-summary.md), explains the level choice in one sentence, and cites the tracked spec-folder path convention (.opencode/specs/[track]/[###-short-name]/). Return a verdict naming the level, the files, and the rationale.`
- Expected execution process: External-AI orchestrator describes a small feature (under 100 LOC), dispatches with `--agent markdown`, captures the recommendation, then validates the level choice, canonical file list, and path convention.
- Expected signals: Response names a documentation level explicitly (Level 1, 2 or 3). Lists at least 4 canonical files (spec.md, plan.md, tasks.md, implementation-summary.md). Provides level rationale tied to LOC or risk. Surfaces the current tracked spec-folder path convention (`.opencode/specs/[track]/[###-short-name]/`), not the untracked-legacy shape.
- Desired user-visible outcome: A scaffolding plan the operator can hand to a follow-up dispatch that creates the actual spec folder.
- Pass/fail: PASS if response names a level, lists >= 4 canonical files, provides rationale, AND cites the tracked-packet path shape. FAIL if level is missing, fewer than 4 files are named, or the path convention is stale.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Define the synthetic feature scope (e.g., "add --verbose flag, under 50 LOC").
3. Dispatch with `--agent markdown` and a prompt asking for level, file list, and path convention.
4. Verify the response names a level, lists required files, provides rationale, and cites the tracked-packet path.
5. Return a verdict naming the level, files, path convention, and rationale.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-024 | Markdown agent spec folder scaffolding | Confirm `--agent markdown` produces a spec-folder scaffolding plan with level, canonical file list, and current path convention | `As an external-AI conductor preparing a spec folder for a small feature (add a --verbose flag, under 50 LOC), dispatch claude -p --agent markdown and ask for a Level recommendation plus the canonical file list for that level. Verify the response names a documentation level (1, 2, or 3), lists at least 4 canonical files (spec.md, plan.md, tasks.md, implementation-summary.md), explains the level choice in one sentence, and cites the tracked spec-folder path convention (.opencode/specs/[track]/[###-short-name]/). Return a verdict naming the level, the files, and the rationale.` | 1. `bash: claude -p "Scaffold a spec folder for a small feature: add a --verbose flag to a CLI tool, under 50 lines of code change. Recommend a documentation level (1, 2, or 3), list the canonical files for that level, state the tracked spec-folder path convention this repo uses, and explain the level choice in one sentence." --agent markdown --output-format text 2>&1 \| tee /tmp/cc-024-output.txt` -> 2. `bash: grep -ciE 'level [123]\|level-1\|level-2\|level-3' /tmp/cc-024-output.txt` -> 3. `bash: grep -ciE '(spec\.md\|plan\.md\|tasks\.md\|implementation-summary\.md)' /tmp/cc-024-output.txt` -> 4. `bash: grep -ciE '(loc\|lines of code\|risk\|complexity)' /tmp/cc-024-output.txt` -> 5. `bash: grep -ciE '\.opencode/specs/\[track\]/\[' /tmp/cc-024-output.txt` | Step 1: response captured; Step 2: count of level mentions >= 1; Step 3: count of canonical-file mentions >= 4; Step 4: count of rationale-keyword mentions >= 1; Step 5: tracked-packet path convention (with the `[track]` segment) cited >= 1 | `/tmp/cc-024-output.txt`, terminal grep counts | PASS if response names a level, lists >= 4 canonical files, provides rationale, AND cites the `[track]`-segmented path convention; FAIL if level is missing, fewer than 4 files are named, rationale is absent, or the path omits the track segment | 1. If the level is missing, refine the prompt to require an explicit "Level: N" line and re-dispatch; 2. If fewer than 4 files are named, prompt for the canonical Level 1 minimum file list; 3. If the response cites the untracked `.opencode/specs/[###-short-name]/` shape without the track segment, the agent is reciting a stale convention — file a documentation bug; 4. If `--agent markdown` is rejected, run `claude agents list` to confirm the agent is registered |

### Optional Supplemental Checks

If the rationale is too thin, ask for an explicit decision table mapping the feature scope (LOC, risk) to the recommended level. The system-spec-kit reference contains the canonical Level-N decision table and `markdown` should be able to reproduce it.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/agent-delegation.md` | Markdown agent role per the documented roster |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Documents the markdown agent in the §3 Agent Routing Table |
| `../../references/agent-delegation.md` | Agent contract for template-first documentation workflows |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-routing/speckit-agent-spec-folder.md`
