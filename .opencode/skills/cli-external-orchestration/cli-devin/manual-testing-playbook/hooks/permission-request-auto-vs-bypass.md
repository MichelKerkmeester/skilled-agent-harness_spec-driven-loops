---
title: "DV-008 -- PermissionRequest auto versus bypass"
description: "Compare the approval-event path under auto with the bypass path while keeping the hook configuration isolated."
version: 1.0.0.0
---

# DV-008 -- PermissionRequest auto versus bypass

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-008`.

## 1. OVERVIEW

Verify the narrow distinction between approval prompting and other hook delivery: `PermissionRequest` fires under `auto` for an approval-needing write, but is not consulted under `bypass`.

### Why This Matters

The bypass mode skips the approval event, not the entire hook system. Treating the two as equivalent would hide the safety boundary this playbook is meant to expose.

## 2. SCENARIO CONTRACT

- Objective: Compare `PermissionRequest` evidence for the same write request under `auto` and `bypass`.
- Real user request: `Show whether Devin asks for approval in auto mode and what changes when the repository dispatch uses bypass.`
- Prompt: `Create permission-request-marker.txt containing permission-test in this isolated workspace and report whether approval was requested.`
- Expected execution process: Run the prompt twice with the same isolated `.devin/hooks.v1.json` probe, first with `--permission-mode auto`, then with `--permission-mode bypass`; inspect event logs separately.
- Expected signals: `PermissionRequest` is observed in the auto run for the approval-needing operation; it is absent from the bypass run. The absence is not evidence that all hooks are disabled.
- Desired user-visible outcome: A precise approval-event comparison with no mutation of the repository's real hook file.
- Pass/fail: PASS when the two event traces differ exactly at the approval event; FAIL when bypass is reported as disabling all hooks; SKIP when auth or a required interactive approval prevents the controlled comparison.

## 3. TEST EXECUTION

1. `DV008_DIR=$(mktemp -d /tmp/cli-devin-dv008.XXXXXX); mkdir -p "$DV008_DIR/.devin"`
2. Install an isolated probe configuration using the verified top-level event-key schema; keep the repo config untouched.
3. `cd "$DV008_DIR" && devin -p "Create permission-request-marker.txt containing permission-test in this isolated workspace and report whether approval was requested." --model adaptive --permission-mode auto </dev/null > auto.txt 2>&1; echo "exit=$?" >> auto.txt`
4. Repeat with `--permission-mode bypass`, then compare `auto.log` and `bypass.log`.

| Feature ID | Exact commands | Expected signal | Verdict |
|---|---|---|---|
| DV-008 | Same isolated write with `auto` and `bypass` | PermissionRequest only on auto path | PASS/FAIL/SKIP |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Permission and isolation policy |
| `../../feature-catalog/hooks/` | No catalog entry yet; phase 010 is not present in this packet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../specs/cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler/implementation-summary.md` | PermissionRequest adapter and bypass limitation |
| `../../../../specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md` | Live event matrix |

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: DV-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/permission-request-auto-vs-bypass.md`
