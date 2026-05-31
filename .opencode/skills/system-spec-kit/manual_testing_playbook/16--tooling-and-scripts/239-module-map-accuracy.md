---
title: "151 -- MODULE_MAP.md accuracy validation"
description: "This scenario validates MODULE_MAP.md content accuracy by spot-checking module entries against actual code structure. It focuses on verifying listed files exist and consumers are correct."
---

# 151 -- MODULE_MAP.md accuracy validation

## 1. OVERVIEW

This scenario validates MODULE_MAP.md content accuracy for `151`. It focuses on verifying that the module inventory, file listings, and consumer mappings match the actual codebase.

---

## 2. SCENARIO CONTRACT

- Objective: Verify MODULE_MAP.md entries match actual code structure for 5 sampled modules.
- Real user request: `Please validate MODULE_MAP.md accuracy validation against cd .opencode/skills/system-spec-kit and tell me whether the expected signals are present: All 5 sampled modules have accurate file lists and consumer mappings.`
- Prompt: `Validate MODULE_MAP.md accuracy validation against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All 5 sampled modules have accurate file lists and consumer mappings
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 5 sampled modules are accurate

---

## 3. TEST EXECUTION

### Prompt

```
Validate MODULE_MAP.md accuracy validation against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit`
2. Read MODULE_MAP.md entries for config, cognitive, search, storage, scoring
3. For each module: `ls mcp_server/lib/{module}/` to verify key files exist
4. For each module: `grep -r "from.*/{module}/" mcp_server/ --include="*.ts" -l` to verify consumers
5. Compare against MODULE_MAP.md listings

### Expected

All 5 modules have accurate file lists and consumer mappings

### Evidence

ls output + grep output per module vs MODULE_MAP.md entries

### Pass / Fail

- **Pass**: all 5 sampled modules are accurate
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Identify stale entry -> update MODULE_MAP.md -> re-verify

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/218-module-boundary-map.md](../../feature_catalog/16--tooling-and-scripts/218-module-boundary-map.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 151
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/239-module-map-accuracy.md`
