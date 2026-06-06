---
title: "017 launcher startup prefix"
description: "Verify the mk-code-index launcher starts cleanly with the [mk-code-index-launcher] prefix on stderr."
trigger_phrases:
  - "017"
  - "launcher startup prefix"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 017 launcher startup prefix

## 1. OVERVIEW

Verify the mk-code-index launcher starts cleanly with the [mk-code-index-launcher] prefix on stderr, reaches stdio readiness, and documents the shared idle-timeout guardrail.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the mk-code-index launcher starts cleanly with the [mk-code-index-launcher] prefix on stderr, reaches stdio readiness, and exposes the shared idle-timeout documentation.
- Real user request: `Check that the mk-code-index-launcher.cjs starts without error, prints the [mk-code-index-launcher] prefix on stderr, and documents the idle-timeout guardrail.`
- Operator prompt: `Run the launcher with stderr capture. Show startup prefix lines, idle-timeout documentation grep, and exit code, then return PASS/FAIL.`
- Expected execution process: Run `timeout 8 node .opencode/bin/mk-code-index-launcher.cjs </dev/null` and capture stderr. Then grep Code Graph docs for `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`.
- Expected signals: Stderr contains `[mk-code-index-launcher]` prefix. No legacy `[system_code_graph]` or `[system-code-graph]` prefixes. No unhandled exception. Code Graph README or IPC README documents `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`.
- Desired user-visible outcome: A concise verdict confirming clean startup with the renamed prefix.
- Pass/fail: PASS if launcher starts with [mk-code-index-launcher] prefix, no errors, and idle-timeout docs are discoverable. FAIL if launcher crashes, shows legacy name, fails to print the expected prefix, or omits the idle-timeout guardrail from docs.

---

## 3. TEST EXECUTION

### Commands

1. Run `timeout 8 node .opencode/bin/mk-code-index-launcher.cjs </dev/null 2>&1 | head -10`.
2. Check stderr for `[mk-code-index-launcher]` prefix.
3. Verify no legacy `[system_code_graph]` or `[system-code-graph]` prefix.
4. Run `rg -n "SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN" .opencode/skills/system-code-graph/README.md .opencode/skills/system-code-graph/mcp_server/lib/ipc/README.md`.

### Expected Output / Verification

Stderr shows `[mk-code-index-launcher] loaded N env(s) from .env.local` or similar. No legacy name. The grep command finds the shared idle-timeout setting in Code Graph docs.

### Cleanup

None.

### Variant Scenarios

Check launcher file path in .claude/mcp.json points to mk-code-index-launcher.cjs.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |
| `../../mcp_server/lib/ipc/launcher-idle-timeout.ts` | Idle-timeout guardrail implementation |

---

## 5. SOURCE METADATA

- Group: Post-Rename Infrastructure
- Playbook ID: 017
- Canonical root source: `manual_testing_playbook.md`
