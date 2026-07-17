---
title: "430 -- code-index CLI Blocked-Read Rendering"
description: "Manual check that the code-index CLI preserves status:blocked readiness refusals as actionable exit-0 answers, lifting requiredAction into both JSON and the fixed two-line text rendering."
version: 3.6.0.1
id: tooling-and-scripts-cli-blocked-read-rendering
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 430 -- code-index CLI Blocked-Read Rendering

## 1. OVERVIEW

This scenario verifies blocked-read rendering in the code-index CLI. The code-graph read tools refuse stale, empty, or failed-verification graphs with `status:"blocked"` plus a `requiredAction` (typically `code_graph_scan`) instead of a false-safe empty answer. The CLI deliberately treats that refusal as an actionable answer, not a failure: blocked reads exit 0, JSON output carries `status`, `requiredAction`, and `data.requiredAction`, and text output renders the fixed two-line form `blocked: <reason>` / `requiredAction: <action>`.

The check is suite-driven so it never touches host daemons: the blocked-read vitest builds nine stale-readiness cases inside a sandboxed harness with its own socket and DB directories.

## 2. SCENARIO CONTRACT

- Objective: Confirm blocked readiness refusals exit 0 and surface `requiredAction` in JSON and text renderings.
- Real user request: `When the code graph is stale and I query it through the CLI, do I get told what to run instead of a confusing failure?`
- Prompt: `Validate code-index CLI blocked-read rendering: exit 0, status blocked, requiredAction surfaced in JSON and text.`
- Expected execution process: Run the sandboxed blocked-read suite, then grep the CLI source for the deliberate exit-0 policy and the text rendering.
- Expected signals: Suite passes all stale cases; source shows the `status:"blocked"` exit-0 policy comment and the `blocked:` / `requiredAction:` text lines.
- Desired user-visible outcome: A blocked read always tells the operator the exact repair action.
- Pass/fail: PASS only when the suite is green and the rendering anchors are present.

## 3. TEST EXECUTION

### Prompt

```text
Validate code-index CLI blocked-read rendering: exit 0, status blocked, requiredAction surfaced in JSON and text.
```

### Commands

```bash
(cd .opencode/skills/system-code-graph/mcp_server && npx vitest run tests/code-index-cli-blocked-read.vitest.ts)
rg -n "blocked is an|requiredAction" .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts | head -10
```

### Expected

- The blocked-read suite passes (9 stale-readiness cases asserting `status:blocked` plus `requiredAction` in the envelope and `data`).
- The grep shows the deliberate policy (`status:"blocked" readiness refusals exit 0 deliberately`) and the `requiredAction` lifting/rendering sites.

### Evidence

Command: `(cd .opencode/skills/system-code-graph/mcp_server && npx vitest run tests/code-index-cli-blocked-read.vitest.ts)`

```text
 RUN  v4.1.7 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  22:39:33
   Duration  5.76s (transform 23ms, setup 0ms, import 31ms, tests 5.65s, environment 0ms)
```

Command: `rg -n "blocked is an|requiredAction" .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts | head -10`

```text
260:  status:"blocked" readiness refusals exit 0 deliberately: blocked is an
261:  actionable answer (run the surfaced requiredAction), not a CLI failure.`;
790:  return stringField(payload, 'requiredAction')
791:    ?? (data ? stringField(data, 'requiredAction') : undefined)
803:  const requiredAction = inferRequiredAction(payload);
804:  if (!requiredAction) return payload;
809:    requiredAction,
810:    data: data ? { ...data, requiredAction } : { requiredAction },
821:  const requiredAction = inferRequiredAction(payload) ?? 'UNKNOWN';
822:  return `blocked: ${reason}\nrequiredAction: ${requiredAction}`;
```

### Pass / Fail

- **PASS**: suite green with 9 stale-readiness cases passing, and the grep output shows the exit-0 blocked policy plus `requiredAction` lifting and `blocked:` / `requiredAction:` text rendering anchors.

- **Pass**: suite green and both anchors present.
- **Fail**: any stale case returns an empty-impact answer, a blocked read exits non-zero, or `requiredAction` is missing from either rendering.

### Failure Triage

A missing `requiredAction` in `data` points at the normalization step that mirrors the action into the payload. A non-zero exit on blocked means the error classifier started treating blocked envelopes as failures — check the blocked-envelope branch before the generic error mapping.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../system-code-graph/feature_catalog/mcp_tool_surface/code_index_cli.md` | Feature-catalog source for the code-index CLI |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | Blocked-envelope normalization, exit-0 policy, two-line text rendering |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-blocked-read.vitest.ts` | Nine stale-readiness blocked cases |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts` | Sandboxed harness (fresh socket dir, temp DB dirs, re-election off) |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 430
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/cli_blocked_read_rendering.md`
