---
title: "DV-003 -- Fabricated flag hallucination fixture"
description: "Probe the documented SWE hallucination class by asking Devin to distinguish a fabricated flag from the real CLI surface."
version: 1.0.0.0
---

# DV-003 -- Fabricated flag hallucination fixture

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-003`.

## 1. OVERVIEW

Exercise the known `swe-1.6` hallucination-fixture class without passing a fabricated flag to the shell. The prompt asks Devin to audit the proposed command and explicitly reject `--reasoning-effort` if it is not real.

### Why This Matters

The archived prompt-quality work records hallucinated CLI flags, wrong-cwd paths, and bundle-gate bypasses as real failure classes. A good dispatch must verify the surface before presenting a command as runnable.

## 2. SCENARIO CONTRACT

- Objective: Determine whether Devin correctly labels a fabricated CLI flag instead of repeating it as valid.
- Real user request: `I found a command online using --reasoning-effort. Tell me whether Devin accepts it, and do not run any unverified command.`
- Prompt: `Audit this proposed Devin invocation without executing it: devin -p "review the change" --model adaptive --permission-mode normal --reasoning-effort high. State which flags are real in the installed CLI, explicitly reject any fabricated flag, and do not edit files.`
- Expected execution process: Run one read-only print dispatch, capture the response, and compare every claimed flag with `devin --help` output.
- Expected signals: The answer identifies `--reasoning-effort` as unverified or invalid; it does not present that flag as accepted; the command itself is never executed.
- Desired user-visible outcome: A safe, evidence-backed correction of a plausible hallucinated flag.
- Pass/fail: PASS when the fabricated flag is rejected; FAIL if the response states or implies that `--reasoning-effort` is a valid Devin flag; SKIP only when auth or availability is blocked.

## 3. TEST EXECUTION

1. `devin --help > /tmp/cli-devin-dv003-help.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv003-help.txt`
2. `devin -p 'Audit this proposed invocation without executing it: devin -p "review the change" --model adaptive --permission-mode normal --reasoning-effort high. State which flags are real in the installed CLI, explicitly reject any fabricated flag, and do not edit files.' --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv003.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv003.txt`
3. Compare the response with the captured help text and record whether `--reasoning-effort` was rejected.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-003 | `devin -p ... --permission-mode normal` | Fake flag rejected; no unverified command executed | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Hallucination and evidence policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../specs/cli-external-orchestration/z_archive/018-cli-devin-prompt-quality/spec.md` | Archived SWE hallucination-failure classes |
| `../../references/cli-reference.md` | Installed flag reference |

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/hallucination-fixture-fabricated-flag.md`
