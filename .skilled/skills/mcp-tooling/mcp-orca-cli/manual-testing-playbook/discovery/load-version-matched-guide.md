---
title: "ORCA-002 -- Load the version-matched guide"
description: "This scenario validates loading the version-matched orca-cli guide and confirming the conditional browser, automation and publishing references resolve."
stage: discovery
version: 0.1.0.0
---

# ORCA-002 -- Load the version-matched guide

## 1. OVERVIEW

This scenario loads `orca skills get orca-cli` and confirms the three conditional references resolve, so no later scenario guesses a flag.

### Why This Matters

The public `orca-cli` skill is a discovery stub. Command flags live in the installed binary and its versioned guide, so a scenario that relies on remembered flags can drift between Orca versions without noticing.

---

## 2. SCENARIO CONTRACT

- Feature ID: `ORCA-002`
- Feature Name: Load the version-matched guide and confirm conditional references
- Scenario Objective: Retrieve the full guide and confirm the browser, automation and publishing references are available for their action gates.
- Exact Prompt: `Load the Orca version-matched guide and confirm the browser, automation and publishing references are available. Read-only only.`
- Exact Command Sequence: `1. bash: orca skills get orca-cli --full -> 2. bash: orca skills get orca-cli --reference references/browser.md -> 3. bash: orca skills get orca-cli --reference references/automations.md -> 4. bash: orca skills get orca-cli --reference references/publishing.md`
- Expected Signals: The full guide returns local and deterministic content; each reference flag returns its reference document; unknown reference flags are handled by falling back to the full guide or command help, never by guessing.
- Evidence: Guide length or head, each reference retrieval result and exit status, and the recorded fallback behavior if a flag is unsupported.
- Pass/Fail Criteria: PASS when the guide or its documented fallback completes; FAIL when a flag is guessed or a retrieval error is disguised as success; SKIP when the executable predates the guide option and the operator declines the fallback path (blocker: missing version-matched guide).
- Failure Triage: 1. Re-check `orca skills get orca-cli --full`. 2. Compare the installed version with the guide's documented version. 3. Use the command's own help for the unsupported flag.

---

## 3. TEST EXECUTION

### Prerequisites

ORCA-001 completed with a resolved executable and captured version.

### Prompt

`Load the Orca version-matched guide and confirm the browser, automation and publishing references are available. Read-only only.`

### Commands

1. `orca skills get orca-cli --full`
2. `orca skills get orca-cli --reference references/browser.md`
3. `orca skills get orca-cli --reference references/automations.md`
4. `orca skills get orca-cli --reference references/publishing.md`

### Expected

The guide and all three references return content locally without contacting the runtime, with exit 0.

### Evidence

Guide retrieval mode, reference retrieval results, exit statuses, any fallback used.

### Pass / Fail

- **Pass:** the guide or documented fallback completes and references resolve.
- **Skip:** the installed CLI predates the reference flags and no fallback is authorized.
- **Fail:** a flag is guessed or a retrieval error is reported as success.

### Failure Triage

1. Re-run the full guide retrieval.
2. Compare installed version against the guide's own version note.
3. Fall back to the command's own help and record the drift.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-002 | Load the version-matched guide | Retrieve guide plus three conditional references | `Load the Orca version-matched guide and confirm the browser, automation and publishing references are available. Read-only only.` | `orca skills get orca-cli --full` -> three `--reference` retrievals | Guide text; reference documents; local deterministic retrieval | Guide head, reference results, exit statuses, fallback notes | PASS on guide or documented fallback; SKIP on unsupported flags without fallback; FAIL on guessed flags | Re-run guide, compare versions, use command help |

---

## 4. SOURCE FILES

### Playbook Sources

| Source | Location |
|---|---|
| Packet runtime contract | `SKILL.md` |
| Reference gate | `references/orca-cli-reference.md` Section 6 |

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: `ORCA-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery/load-version-matched-guide.md`
