---
title: "DV-009 -- PreToolUse still fires under bypass"
description: "Prove in an isolated workspace that PreToolUse remains active when Devin runs with the repository's bypass permission alias."
version: 1.0.0.0
---

# DV-009 -- PreToolUse still fires under bypass

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-009`.

## 1. OVERVIEW

Exercise the critical safety invariant directly: `PreToolUse` fires under `--permission-mode bypass`, even though `PermissionRequest` is not consulted there.

### Why This Matters

The naive assumption that bypass disables every hook is false. The spec-gate and dispatch guards remain active in the mode this repository dispatches with; losing this event would create a silent enforcement gap.

---

## 2. SCENARIO CONTRACT

- Objective: Observe a `PreToolUse` event for a real tool call under bypass.
- Real user request: `Run the normal Devin dispatch mode but prove the pre-tool safety guard still receives a tool event.`
- Prompt: `In this isolated workspace, create bypass-pretool-marker.txt containing bypass-test. Report the tool action and completion.`
- Expected execution process: Configure an isolated `PreToolUse` probe, run `devin -p` with `--permission-mode bypass`, and inspect the event log for the write tool call.
- Expected signals: The probe records `PreToolUse` with the same session/tool correlation as the write; `PermissionRequest` may be absent, but `PreToolUse` is present.
- Desired user-visible outcome: Direct evidence that bypass skips approval prompting without disabling guard delivery.
- Pass/fail: PASS when `PreToolUse` is logged under bypass; FAIL when the write succeeds with no `PreToolUse` event or when the result treats bypass as hook-free; SKIP only on auth/availability blockers.

---

## 3. TEST EXECUTION

1. `DV009_DIR=$(mktemp -d /tmp/cli-devin-dv009.XXXXXX); mkdir -p "$DV009_DIR/.devin"`
2. Populate only the temporary `.devin/hooks.v1.json` with a `PreToolUse` logging probe.
3. `cd "$DV009_DIR" && devin -p "In this isolated workspace, create bypass-pretool-marker.txt containing bypass-test. Report the tool action and completion." --model adaptive --permission-mode bypass </dev/null > stdout.txt 2>&1; echo "exit=$?" >> stdout.txt`
4. Inspect `probe.log` and verify the repository's `.devin/hooks.v1.json` has no diff.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-009 | Isolated `devin -p ... --permission-mode bypass` | PreToolUse event present; approval event may be absent | PASS/FAIL/SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Critical bypass invariant and isolation policy |
| `../../feature-catalog/hooks/` | No catalog entry yet; phase 010 is not present in this packet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../specs/cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler/implementation-summary.md` | Explicit statement that PreToolUse remains active under bypass |
| `../../../../skills/system-spec-kit/mcp-server/hooks/devin/spec-gate-enforce.mjs` | Guard adapter under test |
| `../../../../../hooks/task-dispatch/claude/task-dispatch-guard.cjs` | Shared dispatch-guard core |

---

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: DV-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/pretooluse-still-fires-under-bypass.md`
