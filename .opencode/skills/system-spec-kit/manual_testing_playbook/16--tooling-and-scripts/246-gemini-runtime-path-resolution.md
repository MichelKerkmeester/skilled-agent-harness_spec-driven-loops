---
title: "M-011 -- Gemini Runtime Path Resolution"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-011`."
---

# M-011 -- Gemini Runtime Path Resolution

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-011`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-011`.
- Real user request: `` Please validate Gemini Runtime Path Resolution against the documented validation surface and tell me whether the expected signal is present: `test ! -e .gemini` passes. ``
- Prompt: `Validate Gemini Runtime Path Resolution against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `test ! -e .gemini` exits 0.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: project Gemini runtime directory is absent.

---

## 3. TEST EXECUTION

### Prompt

`Validate Gemini Runtime Path Resolution against the documented validation surface and report cited pass/fail evidence.`
### Commands

```bash
  test ! -e .gemini
  ```
### Expected

Project Gemini runtime directory is absent.
### Evidence

shell exit status and repository listing evidence.
### Pass/Fail

project Gemini runtime directory is absent.
### Failure Triage

directory exists unexpectedly; collect evidence and identify root cause.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/217-source-dist-alignment-enforcement.md](../../feature_catalog/16--tooling-and-scripts/217-source-dist-alignment-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/246-gemini-runtime-path-resolution.md`
