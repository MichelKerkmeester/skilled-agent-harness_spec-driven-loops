---
title: "Implementation Plan: Phase 6: deep-loop-single-executor-dispatch"
description: "Route the single-executor cli-opencode branches through the fan-out command builder, refuse single-executor dsh honestly, fix the research YAML field and generation drift, inline CLI personas and render the tool-call cap, then lock the branch contract with a static test."
trigger_phrases:
  - "deep loop single executor dispatch plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: deep-loop-single-executor-dispatch

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets with embedded Node ESM heredocs, CommonJS runtime script, TypeScript tests |
| **Framework** | system-deep-loop runtime (`fanout-run.cjs`, `executor-audit.ts`, `executor-config.ts`) |
| **Storage** | None |
| **Testing** | vitest 4.1.12 in `.skilled/skills/system-deep-loop/runtime`; spec-kit cli vitest project for the YAML contract tests |

### Overview
The cursor, devin and pi single-executor branches already call `buildLineageCommand`; the opencode branch is the copy that drifted, so it adopts the same pattern and loses `--pure` and the hardcoded binary. The remaining fixes are field renames, a refusal branch, a persona block shared by fan-out and single-executor prompts, and one template variable. A static test reads the four YAMLs and fails on the drift classes this phase closes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run --no-coverage` in the deep-loop runtime passes at least the baseline count plus the new contract test, and the four spec-kit deep YAML contract tests pass 24 of 24
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared command builder.

### Key Components
- **`buildLineageCommand` (`fanout-run.cjs`)**: the one place that turns an executor kind, model and sandbox into a command, argv and stdin, with binary preflight and model allowlists.
- **Single-executor YAML branches**: per-kind heredocs that render the iteration prompt, call the builder and hand the result to `runAuditedExecutorCommand`.

### Data Flow
The YAML renders the iteration prompt pack, prepends the persona block for a CLI kind, calls `buildLineageCommand` with the executor fields, and passes the returned command to `runAuditedExecutorCommand`, which writes the dispatch receipts and the executor audit row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-{research,review}-{auto,confirm}.yaml` opencode branches | Producer of the failing argv | update | `rg -n -- "--pure" .skilled/commands/deep/assets/*.yaml` prints nothing |
| `fanout-run.cjs` `buildOpencodeLineageCommand` | Owns the version-aware opencode argv | unchanged, now also consumed by the YAMLs | contract test asserts the opencode branch calls `buildLineageCommand` |
| `fanout-run.cjs` prompt composition | Points CLI leaves at the persona by path | update | `rg -n "BEGIN AGENT PERSONA" fanout-run.cjs` |
| `deep-research/assets/prompt-pack-iteration.md.tmpl` | Hardcodes the tool cap | update | `rg -n "Max 12" <tmpl>` prints nothing |
| `compiled/*.contract.markdown` | Digest of the YAML sources | regenerate | dry print diffs clean against the written file |
| `deep-ai-council-*.yaml` | Has no executor branches | not a consumer | `rg -n "if_cli_" deep-ai-council-*.yaml` prints nothing |

Required inventories:
- Same-class producers: `rg -n "'--pure'|config\.executor\.type|g\{generation\}|if_cli_copilot" .skilled/commands/deep/assets/`.
- Consumers of changed symbols: `rg -n "buildLineageCommand|prompt-pack-iteration|max_tool_calls" .skilled --glob '*.{ts,cjs,mjs,yaml}'`.
- Matrix axes: YAML (4) by executor kind (8 admitted kinds); every non-native kind either has a builder-backed branch or a refusal branch in the auto YAMLs.
- Algorithm invariant: a single-executor branch never constructs argv for a CLI by hand when the builder supports the kind.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup baselines the deep-loop runtime suite, the four spec-kit YAML contract tests and contract freshness. Implementation runs one Luna dispatch per finding class in the order of `tasks.md`. Verification reruns the baselines, the opencode flag probe and the cross-family review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New `executor-branch-contract.vitest.ts`; existing fan-out and YAML parity suites | vitest |
| Integration | `buildLineageCommand` for `cli-opencode` returns an argv `opencode run --help` style parsing accepts | node one-liner from a temp dir |
| Manual | N/A: no billable live dispatch; the flag parser probe is the observable proof | shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-6-luna` high fast | External | Green (`codex login status` reports ChatGPT login) | Fall back to DeepSeek V4.1 Flash max and log it |
| OpenCode v2.2.5 on PATH | External | Green | The flag probe cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A single-executor deep loop on any kind stops dispatching after this change.
- **Procedure**: `git revert` the phase commit; the YAMLs and the runtime script return together.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baselines recorded | Verification |
| Verification | Implementation and the cross-family review | Phase 007, which edits the same YAMLs |
<!-- /ANCHOR:phase-deps -->

---
