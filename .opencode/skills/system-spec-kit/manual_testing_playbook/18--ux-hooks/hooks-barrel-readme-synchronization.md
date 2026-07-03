---
title: "106 -- Hooks barrel + README synchronization"
description: "This scenario validates Hooks barrel + README synchronization for `106`. It focuses on Confirm hooks index exports and docs cover the finalized modules and contract fields."
version: 3.6.0.18
---

# 106 -- Hooks barrel + README synchronization

## 1. OVERVIEW

This scenario validates Hooks barrel + README synchronization for `106`. It focuses on Confirm hooks index exports and docs cover the finalized modules and contract fields.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm hooks index exports and docs cover the finalized modules and contract fields.
- Real user request: `` Please validate Hooks barrel + README synchronization against the documented validation surface and tell me whether the expected signals are present: Both barrel (`hooks/index.ts`) and README (`hooks/README.md`) reference `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks`. ``
- Prompt: `Validate hooks barrel and README synchronization for mutation-feedback, response-hints, MutationHookResult, and postMutationHooks.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Both barrel (`hooks/index.ts`) and README (`hooks/README.md`) reference `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if both files reference the new modules and contract fields

---

## 3. TEST EXECUTION

### Prompt

```
Validate hook barrel and README coverage for the finalized UX-hook surface. Capture the evidence needed to prove Both barrel and README reference mutation-feedback, response-hints, MutationHookResult, and postMutationHooks. Return a concise user-facing pass/fail verdict with the main reason.
```

### Commands

1. `rg "mutation-feedback" .opencode/skills/system-spec-kit/mcp_server/hooks/index.ts`
2. `rg "response-hints" .opencode/skills/system-spec-kit/mcp_server/hooks/index.ts`
3. `rg "mutation-feedback\|response-hints\|MutationHookResult\|postMutationHooks" .opencode/skills/system-spec-kit/mcp_server/hooks/README.md`

### Expected

Both barrel and README reference `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks`

### Evidence

Command 1:

```bash
rg "mutation-feedback" .opencode/skills/system-spec-kit/mcp_server/hooks/index.ts
```

Output:

```text
export { buildMutationHookFeedback } from './mutation-feedback.js';
```

Command 2:

```bash
rg "response-hints" .opencode/skills/system-spec-kit/mcp_server/hooks/index.ts
```

Output:

```text
} from './response-hints.js';
```

Command 3:

```bash
rg "mutation-feedback\|response-hints\|MutationHookResult\|postMutationHooks" .opencode/skills/system-spec-kit/mcp_server/hooks/README.md
```

Output:

```text
(no output)
```

Additional file-read observations used to compare the observed repo state against the Expected section:

```text
.opencode/skills/system-spec-kit/mcp_server/hooks/index.ts:19: export { buildMutationHookFeedback } from './mutation-feedback.js';
.opencode/skills/system-spec-kit/mcp_server/hooks/index.ts:20: export {
.opencode/skills/system-spec-kit/mcp_server/hooks/index.ts:21:   appendAutoSurfaceHints,
.opencode/skills/system-spec-kit/mcp_server/hooks/index.ts:22:   syncEnvelopeTokenCount,
.opencode/skills/system-spec-kit/mcp_server/hooks/index.ts:23:   serializeEnvelopeWithTokenCount,
.opencode/skills/system-spec-kit/mcp_server/hooks/index.ts:24: } from './response-hints.js';
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:67: ├── mutation-feedback.ts           # Post-mutation feedback payloads
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:68: ├── response-hints.ts              # Auto-surface hints and token count sync
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:86: | `mutation-feedback.ts` | Maps `MutationHookResult` values into public `postMutationHooks` response payloads. |
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:87: | `response-hints.ts` | Adds auto-surface hints and token counts to MCP JSON envelopes. |
.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:103: | Response contract | Expose post-mutation UX state through the `postMutationHooks` field, preserving the `MutationHookResult` cache-clearing and error fields. |
```

The barrel references `mutation-feedback` and `response-hints`, but it does not reference `MutationHookResult` or `postMutationHooks`. The README file content references all four expected terms, but the documented README `rg` command returned no output as executed.

### Pass / Fail

- **FAIL**: The pass condition is not met because both files do not reference all four expected terms; `hooks/index.ts` references `mutation-feedback` and `response-hints` but not `MutationHookResult` or `postMutationHooks`, and the documented README command returned no output.

### Failure Triage

Inspect hooks/index.ts exports and hooks/README.md for missing entries

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/hooks-readme-and-export-alignment.md](../../feature_catalog/18--ux-hooks/hooks-readme-and-export-alignment.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 106
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/hooks-barrel-readme-synchronization.md`
- audited_post_018: true
