---
title: "150 -- Source-dist alignment validation"
description: "This scenario validates the check-source-dist-alignment.ts script detects no orphaned dist files. It focuses on verifying every dist/lib/*.js maps to a source .ts file."
version: 3.6.0.16
---

# 150 -- Source-dist alignment validation

## 1. OVERVIEW

This scenario validates the check-source-dist-alignment.ts script for `150`. It focuses on verifying every `.js` file in `mcp_server/dist/lib/` has a corresponding `.ts` source file.

---

## 2. SCENARIO CONTRACT

- Objective: Verify source-dist alignment passes with 0 violations.
- Real user request: `Please validate Source-dist alignment validation against cd .opencode/skills/system-spec-kit and tell me whether the expected signals are present: 0 violations, all dist files aligned.`
- Prompt: `Validate Source-dist alignment validation against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: 0 violations, all dist files aligned
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if 0 violations reported and exit code is 0

---

## 3. TEST EXECUTION

### Prompt

```
Validate Source-dist alignment validation against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit`
2. `npx ts-node --transpile-only scripts/evals/check-source-dist-alignment.ts`
3. Check exit code is 0
4. Verify "violations: 0" in output

### Expected

0 violations, all dist files aligned, exit code 0

### Evidence

Script summary output showing scanned count, aligned count, violations count

### Pass / Fail

- **Pass**: 0 violations and exit 0
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Identify orphaned dist file -> check if source was deleted/renamed -> either restore source, remove dist artifact, or add time-bounded allowlist entry

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/source_dist_alignment_enforcement.md](../../feature_catalog/tooling_and_scripts/source_dist_alignment_enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 150
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/source_dist_alignment_validation.md`
