---
title: "DV-002 -- prompt-file vs positional prompt"
description: "This scenario validates that --prompt-file accepts a prompt from disk and produces equivalent output to a positional prompt for small prompts, demonstrating the documented preference for --prompt-file on prompts >2KB."
---

# DV-002 -- prompt-file vs positional prompt

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-002`.

---

## 1. OVERVIEW

This scenario validates two prompt-delivery shapes for `DV-002`: positional argument and `--prompt-file <path>`. Both should produce equivalent output for small prompts; `--prompt-file` is the documented preference for prompts >2KB and for programmatic dispatch.

### Why This Matters

`--prompt-file` is the load-bearing shape for scripted dispatch from sibling cli-* runtimes. SKILL.md §3 names `--prompt-file` as the preferred dispatch shape and `references/cli_reference.md` §4 documents it. If the file-mode read regressed, every cross-AI dispatch pattern in `integration_patterns.md` would be affected.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm that `--prompt-file <path>` reads a prompt from disk and produces equivalent output to a positional prompt for the same content.
- Real user request: `Run the same small prompt twice — once typed inline, once from a file — and confirm Devin produces equivalent output both ways.`
- Prompt: `Dispatch the same short prompt twice — once positional, once via --prompt-file — and confirm equivalent output and exit codes.`
- Expected execution process: Operator writes a small prompt to `/tmp/dv-002-prompt.md` -> dispatches positionally first, captures output -> dispatches via `--prompt-file` next with identical content, captures output -> compares for semantic equivalence.
- Expected signals: Both invocations exit 0. Both stdouts contain the same coherent response (small wording differences acceptable). The `--prompt-file` invocation reads from a path on disk. Dispatched command lines reflect both shapes.
- Desired user-visible outcome: Confirmation that both prompt-delivery shapes work and that operators can prefer `--prompt-file` for longer prompts or programmatic dispatch.
- Pass/fail: PASS if both invocations exit 0 AND both stdouts contain a semantically equivalent answer. FAIL if either invocation errors or if the outputs are wildly divergent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a small prompt body (e.g. "List 3 advantages of TypeScript over plain JavaScript in 3 bullets").
2. Dispatch positional first; capture stdout to `/tmp/dv-002-positional.txt`.
3. Write the same prompt to `/tmp/dv-002-prompt.md`; dispatch via `--prompt-file`; capture stdout to `/tmp/dv-002-file.txt`.
4. Diff the two outputs at a semantic level (both should list 3 advantages of TypeScript).
5. Return a PASS/FAIL verdict naming both file paths.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-002 | prompt-file vs positional prompt | Confirm both prompt-delivery shapes work and produce equivalent output | `Dispatch the same short prompt twice — once positional, once via --prompt-file — and confirm equivalent output and exit codes.` | 1. `devin "List 3 advantages of TypeScript over plain JavaScript in 3 bullets." --model swe-1.6 --permission-mode auto > /tmp/dv-002-positional.txt 2>&1 </dev/null` -> 2. `bash: echo "Exit-positional: $?"` -> 3. `bash: printf 'List 3 advantages of TypeScript over plain JavaScript in 3 bullets.\n' > /tmp/dv-002-prompt.md` -> 4. `devin --prompt-file /tmp/dv-002-prompt.md --model swe-1.6 --permission-mode auto > /tmp/dv-002-file.txt 2>&1 </dev/null` -> 5. `bash: echo "Exit-file: $?"` -> 6. `bash: diff /tmp/dv-002-positional.txt /tmp/dv-002-file.txt; grep -c 'TypeScript' /tmp/dv-002-positional.txt /tmp/dv-002-file.txt` | Both exit codes 0; both files contain 3 bullets; both reference TypeScript at least 3 times | Both captured stdouts, exit codes, terminal transcript with both dispatched command lines | PASS if both exit 0 AND both files contain a coherent 3-bullet list; FAIL if either invocation errors or if a file is empty | (1) Re-run with foreground (no `</dev/null`) to see stderr; (2) confirm `/tmp/dv-002-prompt.md` is readable; (3) check Devin version with `devin version` and confirm `--prompt-file` is in `devin --help` |

### Optional Supplemental Checks

- Try with a larger prompt (>2KB) to demonstrate why `--prompt-file` is preferred for long content.
- Confirm `--prompt-file` accepts a relative path as well as absolute.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 Flags) | Documents `--prompt-file` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation shows `--prompt-file` as preferred shape |
| `../../references/integration_patterns.md` | Use Case 1 prompt template stored to `/tmp/devin-prompt.md` before dispatch |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/prompt-file-vs-positional.md`
