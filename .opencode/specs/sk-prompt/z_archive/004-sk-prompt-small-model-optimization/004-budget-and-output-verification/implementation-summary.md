---
title: "Implementation Summary: cli-devin quality optimization"
description: "Phase 004 shipped cli-devin context-budget defaults and opt-in output verification."
trigger_phrases:
  - "cli-devin quality summary"
  - "phase 004 implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/004-budget-and-output-verification"
    last_updated_at: "2026-05-18T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 004 budget and verification pipeline"
    next_safe_action: "Review diffs and commit the Phase 004 path list"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/assets/per-model-budgets.json"
      - ".opencode/skills/cli-devin/references/context-budget.md"
      - ".opencode/skills/cli-devin/references/output-verification.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000044"
      session_id: "114-004-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Tokenizer-accurate counting remains future work; Phase 004 uses the smallcode 4 chars/token heuristic."
      - "Sandboxed real compile/run/test execution remains future work; Phase 004 validator uses static scoring and documents command recipes."
    answered_questions:
      - "Verification remains OFF by default in all three recipes."
      - "Slim model scope excludes GLM-5.1, gpt-5.5, Opus, and Sonnet from per-model-budgets.json."
---

# Implementation Summary: cli-devin quality optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status**: Implemented. Verification is opt-in and backward compatible; budget defaults are data-only.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-prompt/004-sk-prompt-small-model-optimization/004-budget-and-output-verification |
| **Level** | 3 |
| **Status** | Implemented |
| **Effort** | ~28 hours planned; implemented in focused pass |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Built

- Created `cli-devin/assets/per-model-budgets.json` with the required slim scope: `swe-1.6`, `deepseek-v4-pro`, `kimi-k2.6`, `qwen3.6`, plus unverified optional stubs for `claude-haiku` and `gemini-flash`.
- Created `cli-devin/references/context-budget.md` covering budget allocation, fit-to-budget truncation, eviction priority, working memory, summary threshold, per-model defaults, prompt-pack integration, and the sk-prompt insertion hint.
- Updated `cli-devin/assets/prompt_templates.md` §2 so SWE-1.6 recognizes `[... truncated N tokens]` markers as intentional context-budget boundaries.
- Created `cli-devin/references/output-verification.md` covering the opt-in compile/execute/smoke/lint pipeline, research-output adaptation, confidence scoring, hard-fail template, validator handshake, and enablement guidance.
- Created `cli-devin/assets/confidence-scoring-rubric.md` with the scoring formula, thresholds, per-language verifier commands, and research-iteration renormalization.
- Extended `system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` with `runOptionalVerificationPass`, optional recipe config, static fenced-code scoring, and JSONL `verification_degraded` event append.
- Updated `system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts` with verification-on bad output, verification-on good output, and verification-off backward-compat tests.
- Updated the three cli-devin agent-config recipes with `verification_enabled: false`, `verification_languages: []`, and conditional verification contract instructions.
- Updated `cli-devin/SKILL.md` §3 with tight cross-references to the budget asset and two new references.
- Updated `sk-small-model/references/pattern-index.md` to mark context budget, output verification, confidence rubric, and per-model defaults as shipped via 004.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Actual sequence

1. Re-read the Phase 004 packet docs, ADR-001, RQ1/RQ2 research, iter-006/iter-007 deepening notes, preflight context card, smallcode `budget.ms`, `verifier.ms`, and `hard_fail.ms`.
2. Read the current cli-devin skill docs, three agent-config recipes, prompt templates, pattern index, post-dispatch validator, and its vitest coverage.
3. Added the budget data asset and reference docs first, keeping the model scope to the 2026-05-18 user direction.
4. Added the verification reference/rubric and the opt-in recipe fields with default false.
5. Extended the validator as a sibling optional pass after existing structural validation; existing callers are unchanged unless `recipeConfig.verification_enabled === true`.
6. Added unit coverage and ran focused typecheck/test loops.
7. Ran the requested empirical, integration, backward-compat, and strict spec validation commands.

### Deviations

- Phase 004 does not execute untrusted code; the validator uses static scoring. The real compile/run/test/lint commands are documented for future sandboxed execution.
- `CHK-121` is satisfied by packet continuity updates and final validation; a canonical memory DB save was not requested as `/memory:save`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- ADR-001 accepted: verification remains OFF by default; opt-in per recipe through `verification_enabled`.
- Per-model budget scope follows user direction: four required small models plus two optional stubs; GLM-5.1, gpt-5.5, Opus, and Sonnet are excluded.
- Truncation marker syntax uses compact `[... truncated %d tokens]`, while docs cite the longer smallcode source marker.
- `post-dispatch-validate.ts` appends a `verification_degraded` event instead of mutating prior JSONL records.
- Static scoring avoids executing arbitrary model output outside a sandbox.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Commands run

| Check | Command / Log | Result |
| --- | --- | --- |
| JSON validity | `jq empty .opencode/skills/cli-devin/assets/per-model-budgets.json ...agent-config*.json` | PASS |
| TypeScript strict check | `npx tsc --noEmit --composite false -p tsconfig.json` from `mcp_server` | PASS |
| Focused validator unit tests | `npx vitest run tests/deep-loop/post-dispatch-validate.vitest.ts` | PASS, 14/14 |
| Budget smoke | `node /tmp/budget-smoke-004.js > /tmp/budget-smoke-004.log` | PASS, SWE-1.6 budget 89,600 and marker `[... truncated 1234 tokens]` |
| Verification integration | `/tmp/verification-integ-004.log` | PASS, bad TypeScript output marked degraded |
| Backward compat | `/tmp/backward-compat-004.log` | PASS, iteration-020/019/018 pass with verification absent |
| Spec validation | `/tmp/validate-004.log` | PASS |

### Empirical numbers

- SWE-1.6 context length: 128,000 tokens.
- SWE-1.6 max budget at 70%: 89,600 tokens.
- Simulated tool-result tokens: 90,834.
- Truncation deficit: 1,234 tokens.
- Marker emitted: `[... truncated 1234 tokens]`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

### Current limitations

- Token counts use the smallcode-derived 4 chars/token heuristic; tokenizer-accurate counts are future work.
- The validator does not execute generated code. It provides a safe static confidence gate and documents real verifier commands for later sandboxed execution.
- Optional Haiku and Gemini Flash entries remain unverified stubs and should not be routed until adopted.
- The reference docs land in the requested target range: `context-budget.md` is 453 LOC and `output-verification.md` is 531 LOC.

### Next safe action

Main agent can review the explicit file list, commit the Phase 004 paths, and carry the shipped budget/verification references into downstream 005/006 work.
<!-- /ANCHOR:limitations -->
