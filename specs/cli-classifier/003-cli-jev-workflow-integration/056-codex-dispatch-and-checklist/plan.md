---
title: "Implementation Plan: Phase 56: codex-dispatch-and-checklist"
description: "Capture the Codex spawn_agent payload with a throwaway CODEX_HOME, record the verdict it supports, widen every Codex shell matcher and adapter to the Bash name, then bring the JavaScript checklist header rule to the style guide."
trigger_phrases:
  - "codex payload probe plan"
  - "codex bash matcher plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 56: codex-dispatch-and-checklist

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM, JSON, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` and vitest |

### Overview
A probe hook in a throwaway `CODEX_HOME` writes each PreToolUse and PostToolUse payload to a file while codex-cli 0.160 runs a spawn, a shell call and a patch. The payloads decide the task-dispatch verdict and show the shell tool rename. The adapters and registry matchers then accept both names, tests pin the `Bash` path, and the docs and checklists are brought to what the probe and the style guide show.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin per-runtime adapters over shared cores, bound through one hook registry.

### Key Components
- **Codex adapters**: dispatch lint, dispatch audit and spec-gate enforce each own a tool-name check that now accepts `exec` and `Bash`.
- **Hook registry**: the Codex shell matchers, written into `.codex/hooks.json` by the registration sync.
- **Coverage docs**: the matrix, rationale, task-dispatch README and cli-codex hook contract.

### Data Flow
Codex tool call, then the matcher in `.codex/hooks.json`, then the adapter's tool-name check, then the shared core.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Codex registry bindings bound to `exec` | Five hooks: dispatch lint, dispatch audit, git preflight, git message gate, spec-gate enforce | Matchers widened to `Bash` | `.codex/hooks.json` diff and `--check` |
| Codex adapters with a tool-name check | Dispatch lint, dispatch audit, spec-gate enforce | Accept `Bash` | New tests |
| sk-git shell hooks | Already accept `bash`, `exec` and `shell` | Comment only | Existing tests |

Required inventories:
- Same-class producers: `rg -n "'exec'" .skilled/hooks .skilled/skills/system-spec-kit/runtime/hooks .skilled/skills/sk-git/scripts/hooks`.
- Consumers of changed symbols: `rg -n '"matcher": "exec' .codex/hooks.json`.
- Matrix axes: tool name (`exec`, `Bash`, other) by response shape (object, string).
- Algorithm invariant: a tool name outside the shell set approves with no output.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each Codex adapter under `exec` and `Bash` payloads | `node --test`, vitest |
| Integration | Hook registration and mirrors | vitest, `--check` modes |
| Live | Payload capture under codex-cli 0.160 | Probe hook in a throwaway `CODEX_HOME` |
| Static | Alignment verifier | `verify_alignment_drift.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| codex-cli 0.160 | External | Green | No payload to read |
| Phase 55 coverage docs | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite drops below baseline or a Codex hook misfires.
- **Procedure**: Revert the phase commits, then rerun `sync-hook-registrations.cjs`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Payload probe ──► Adapters and matchers ──► Tests ──► Docs and checklists ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Payload probe | None | Adapters, docs |
| Adapters and matchers | Probe | Tests |
| Tests | Adapters | Verify |
| Docs and checklists | Probe | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Payload probe | High | 2 hours |
| Adapters, tests and docs | Low | 1 hour |
| Verification | Low | 30 minutes |
| **Total** | | **3.5 hours** |
<!-- /ANCHOR:effort -->

---
