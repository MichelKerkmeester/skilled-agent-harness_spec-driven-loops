---
title: "CU-001 -- cupt Version Check"
description: "This scenario validates cupt Version Check for `CU-001`. It focuses on Verify `cupt --version` exits 0 and prints a version string matching semver patt."
---

# CU-001 -- cupt Version Check

---

## 1. OVERVIEW

Validates that cupt is accessible in PATH and reports a version. This is the most fundamental check — if `cupt --version` fails, no other scenario can proceed.

### Why This Matters

cupt --version is the installation smoke test. A failure here blocks the entire playbook. The version string also confirms the minimum required version (0.7.1+).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-001` and confirm the expected signals without contradictory evidence.

- **Objective:** Verify `cupt --version` exits 0 and prints a version string matching semver pattern X.Y.Z
- **Real user request:** `Confirm cupt is installed and report its version.`
- **Prompt:** `Confirm cupt is installed and report its path and version.`
- **Expected execution process:** 1. Run `which cupt` → should print path. 2. Run `cupt --version` → should print version string.
- **Expected signals:** Step 1: `which cupt` returns non-empty path; exit 0. Step 2: `cupt --version` prints 'cupt X.Y.Z' matching semver; exit 0.
- **Desired user-visible outcome:** Agent reports: cupt is installed at /path/to/cupt, version X.Y.Z.
- **Pass/fail:** PASS if both `which cupt` returns path AND `cupt --version` prints semver; FAIL if `which cupt` returns nothing (not in PATH) OR `--version` exits non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `which cupt`  # → /Users/you/.local/bin/cupt
2. `cupt --version`  # → cupt 0.7.1

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-001 | cupt Version Check | Verify `cupt --version` exits 0 and prints a version string  | `Confirm cupt is installed and report its path and version.` | 1. `which cupt`  # → /Users/you/.local/bin/cupt | Step 1: `which cupt` returns non-empty path; exit 0. Step 2: `cupt --version` pr | Terminal output + ClickUp UI | PASS if both `which cupt` returns path AND `cupt --version` prints s; FAIL if `which cupt` returns nothing (not in PATH) OR `--version` ex | Check prerequisites and auth status |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/10--cupt-global-flags/version-flag.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/mcp_tools.md` | MCP tool reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Lifecycle
- Playbook ID: CU-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cupt-lifecycle/install-version.md`
