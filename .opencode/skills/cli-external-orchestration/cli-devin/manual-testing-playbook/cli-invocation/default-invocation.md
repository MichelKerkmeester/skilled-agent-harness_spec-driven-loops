---
title: "DV-001 -- Devin default print dispatch"
description: "Verify a default model-explicit Devin print dispatch returns a usable read-only answer with the repository's non-interactive command discipline."
version: 1.0.0.0
---

# DV-001 -- Devin default print dispatch

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-001`.

## 1. OVERVIEW

Verify the baseline `devin -p` path from a non-Devin runtime. The scenario is read-only and uses the adaptive model with explicit `normal` permission.

### Why This Matters

Every higher-level route depends on the binary being available, authenticated, non-interactive, and capable of returning a useful response without inheriting stdin or caller defaults.

## 2. SCENARIO CONTRACT

- Objective: Produce a concise answer to a bounded repository question through `devin -p`.
- Real user request: `Tell me which top-level directory contains the repository's CLI orchestration skills. Do not edit files.`
- Prompt: `Identify the top-level directory that contains the repository's CLI orchestration skills. Do not edit files; answer with the path and one sentence of reasoning.`
- Expected execution process: Run the command from the repository root with an explicit model and `normal` permission, capture combined output and the exit code, and inspect the response for the path.
- Expected signals: Exit code 0; output names `.opencode/skills/cli-external-orchestration`; no repository mutation.
- Desired user-visible outcome: A usable, bounded answer from the default print dispatch.
- Pass/fail: PASS when all signals are present; FAIL on a non-zero exit, missing path, or unexpected mutation; SKIP only when the global auth or availability precondition is blocked.

## 3. TEST EXECUTION

1. `command -v devin`
2. `git status --porcelain`
3. `devin -p "Identify the top-level directory that contains the repository's CLI orchestration skills. Do not edit files; answer with the path and one sentence of reasoning." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv001.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv001.txt`
4. `sed -n '1,120p' /tmp/cli-devin-dv001.txt`
5. `git status --porcelain`

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-001 | `devin -p ... --model adaptive --permission-mode normal </dev/null` | Exit 0, correct path, unchanged status | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Global command and evidence policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | `-p`, model, permission, and output contract |
| `../../SKILL.md` | Availability, stdin, and explicit-flag rules |

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/default-invocation.md`
