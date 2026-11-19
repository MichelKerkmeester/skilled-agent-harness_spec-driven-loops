---
title: "CO-031 -- Self-invocation guard fires on nested cross-repo dispatch"
description: "This scenario validates the self-invocation guard contract for nested dispatches in `CO-031`. It focuses on confirming the layered detection (env + ancestry + lockfile) refuses a nested opencode dispatch from inside an existing OpenCode session, even when the nested target is a different repo."
version: 1.4.7.0
---

# CO-031 -- Self-invocation guard fires on nested cross-repo dispatch

**Version note.** This scenario targets OpenCode 2 (2.3.2). A cross-repo dispatch starts in the other repo's directory, and the guard contract is the same either way.

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-031`.

---

## 1. OVERVIEW

This scenario validates Self-invocation guard fires on nested cross-repo dispatch for `CO-031`. It focuses on confirming the documented self-invocation guard (ADR-001 layered detection: env var + process ancestry + state lock-file) correctly refuses a nested cli-opencode dispatch even when the nested target is a different repo. Cross-repo does NOT bypass the guard. Only the explicit parallel-session keywords do.

### Why This Matters

A subtle failure mode is for an in-OpenCode operator to assume cross-repo dispatch automatically bypasses the self-invocation guard ("I'm targeting a different repo, so it's not really self-invocation"). The skill documentation is explicit that ONLY parallel-session keywords (parallel detached / ablation / worker farm / share URL) provide the documented exception. Cross-repo dispatch from inside OpenCode without those keywords MUST still trip the guard. This test validates the guard fires correctly even when the dispatch starts in a different path.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-031` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the documented self-invocation guard refuses a nested cross-repo dispatch from inside an OpenCode session when no parallel-session keywords are present, regardless of the target directory.
- Real user request: `Simulate being inside OpenCode (export OPENCODE_CONFIG_DIR), then attempt a cross-repo dispatch started in a different repo. Confirm the self-invocation guard still refuses, because cross-repo alone does not bypass the guard.`
- RCAF Prompt: `As an in-OpenCode operator (simulated by exporting OPENCODE_CONFIG_DIR=/tmp/co-031-fake) attempting a nested cross-repo dispatch, restate the request as a generic cross-repo cli-opencode invocation started in a different path but WITHOUT any parallel-session keywords. Verify the smart router refuses with the documented self-invocation message AND the refusal message includes the parallel-session keyword option among the three remediation paths. Return a concise pass/fail verdict naming the tripped detection layer and confirming cross-repo alone did not bypass the guard.`
- Expected execution process: The external-AI orchestrator simulates being inside OpenCode by exporting `OPENCODE_CONFIG_DIR`, attempts to construct a cli-opencode dispatch started in a different path with a generic non-parallel-session prompt and validates the documented refusal message would appear (without actually dispatching `opencode run`). The validation is that the refusal logic in ROUTER.md §3 + integration-patterns.md §5 covers this case, AND the parallel-session keyword option is one of the three remediation paths.
- Expected signals: Layer 1 detection trips on `OPENCODE_CONFIG_DIR`. ROUTER.md §3 Self-Invocation Guard section shows that the layered detections run before the parallel-session exception (i.e., cross-repo alone is not a bypass). Integration_patterns.md §5 refusal message lists "parallel detached" as remediation option 3.
- Desired user-visible outcome: Verdict naming the tripped layer and confirming the parallel-session keyword path is the only documented bypass.
- Pass/fail: PASS if layer 1 trips AND ROUTER.md §3 shows parallel-session keyword check is the only bypass AND integration-patterns.md §5 refusal lists "parallel detached" as remediation. FAIL if cross-repo dispatch silently bypasses the guard or the documentation is missing the contract.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Export `OPENCODE_CONFIG_DIR=/tmp/co-031-fake` to trip layer 1 detection.
3. Confirm ROUTER.md §3 documents the parallel-session keyword check as the only bypass.
4. Confirm integration-patterns.md §5 lists "parallel detached" in the refusal remediation options.
5. Confirm no actual `opencode run` is dispatched.
6. Return a verdict naming the tripped layer and confirming the contract.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-031 | Self-invocation guard fires on nested cross-repo dispatch | Confirm that the self-invocation guard refuses a nested cross-repo dispatch when no parallel-session keywords are present | `As an in-OpenCode operator (simulated by exporting OPENCODE_CONFIG_DIR=/tmp/co-031-fake) attempting a nested cross-repo dispatch, restate the request as a generic cross-repo cli-opencode invocation started in a different path but WITHOUT any parallel-session keywords. Verify the smart router refuses with the documented self-invocation message AND the refusal message includes the parallel-session keyword option among the three remediation paths. Return a concise pass/fail verdict naming the tripped detection layer and confirming cross-repo alone did not bypass the guard.` | 1. `bash: (export OPENCODE_CONFIG_DIR=/tmp/co-031-fake; env \| grep -v '^OPENCODE_API_KEY=' \| grep -q '^OPENCODE_' && echo "LAYER_1_TRIPPED" \|\| echo "LAYER_1_OK")` -> 2. `bash: grep -nE 'parallel-session keywords' .skilled/skills/cli-external-orchestration/cli-opencode/ROUTER.md \| head -3` -> 3. `bash: grep -nE 'self-invocation refused' .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md \| head -3` -> 4. `bash: grep -nE '(parallel detached\|ablation\|worker farm\|share URL)' .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md \| head -5` -> 5. `bash: grep -cnE 'cross-repo' .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md \| head -3 && echo "Note: cross-repo is NOT a bypass, only parallel-session keywords are"` -> 6. `bash: ls /tmp/co-031-fake 2>&1 \| head -1; echo "no actual opencode run was attempted"` | Step 1: layer 1 trips on `OPENCODE_CONFIG_DIR`. Step 2: ROUTER.md's `## 3. MACHINE ROUTER` section shows the `parallel-session keywords` check is the bypass guard, NOT a directory-based bypass. Step 3: integration-patterns.md §5 has the refusal message. Step 4: refusal message lists parallel detached / ablation / worker farm / share URL as remediation options. Step 5: cross-repo is NOT listed as a bypass. Step 6: confirms no real dispatch occurred | Terminal output of greps and echoes | PASS if layer 1 trips AND ROUTER.md's `## 3. MACHINE ROUTER` section shows parallel-session-keyword bypass only AND integration-patterns.md §5 lists parallel detached as remediation AND cross-repo is NOT a bypass AND no real dispatch occurred. FAIL if any documentation surface treats cross-repo as a bypass | 1. If layer 1 does not trip, verify env var export scope. 2. If ROUTER.md or integration-patterns.md treat cross-repo as a bypass, file a P0 documentation regression, because the cross-repo path MUST still trip the guard. 3. If parallel-session keywords are missing from the refusal remediation, file a P0 documentation bug. 4. NEVER actually dispatch `opencode run` from a real in-OpenCode session in this test, because that would create the exact safety regression the guard exists to prevent. |

### Optional Supplemental Checks

For documentation completeness, also confirm `opencode-tools.md` §6 (cross-repo dispatch) does NOT contradict the guard contract. The cross-repo capability is for external runtimes targeting different repos, not for in-OpenCode self-dispatch. If `opencode-tools.md` ever frames cross-repo as a bypass, file a documentation bug.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/integration-patterns.md` (§5 SMART-ROUTER DECISION TREE + REFUSAL MESSAGE) | Refusal message and remediation options |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 "When NOT to Use" parallel-session-only exception |
| `../../ROUTER.md` | §3 Self-Invocation Guard pseudocode (the layered detection and the parallel-session bypass) |
| `../../references/self-invocation-guard.md` | Full bash + python detection, including the `has_parallel_session_keywords` check |
| `../../references/integration-patterns.md` | §5 decision tree (cross-repo is NOT a bypass) |
| `../../references/opencode-tools.md` (§6 CROSS-REPO DISPATCH) | Cross-repo capability scope (external runtime, not in-OpenCode bypass) |

---

## 5. SOURCE METADATA

- Group: Cross-Repo and Cross-Server
- Playbook ID: CO-031
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cross-repo-cross-server/self-invocation-guard-nested.md`
