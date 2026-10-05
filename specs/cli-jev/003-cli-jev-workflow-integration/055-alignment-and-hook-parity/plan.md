---
title: "Implementation Plan: Phase 55: alignment-and-hook-parity"
description: "Read each runtime's real fetch tool and hook payload, put the screen's runtime-neutral half in one library, add a thin adapter per runtime that can carry it, wire the live-sync hooks where they were missing, then bring the docs to the code."
trigger_phrases:
  - "hook parity plan"
  - "injection screen adapters plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 55: alignment-and-hook-parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM and CommonJS, TypeScript, Python |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, vitest and pytest |

### Overview
Each runtime's fetch tool and hook payload are read from the runtime itself before any adapter is written. The screen's runtime-neutral half (text extraction, the feature gate, the advisory line) moves into one library, and each runtime gets a thin adapter that owns only its event, its tool name and its delivery channel. The live-sync hooks are wired where a runtime can carry them, and every runtime that still skips a hook gets a reason checked against the code.
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
Shared core with thin per-runtime adapters.

### Key Components
- **`classifier-injection-advisory.mjs`**: pulls fetched text from any known payload shape, checks the feature gate, screens and words the advisory.
- **Adapters**: Claude Code and Devin PostToolUse scripts, an OpenCode plugin, a Pi extension and a Hermes bridge that runs the Devin adapter.
- **Hook registry**: the single source for bindings; the sync script writes each runtime's hook file and the mirror sync links the scripts.

### Data Flow
Fetch result, then the adapter's kill switch, then text extraction, then the gate and the screen, then one advisory line on the runtime's own channel, or nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Claude adapter | The only screen today | Uses the shared library | Its spawn tests |
| Hook registry and sync script | Bindings for four runtimes | New bindings, Pi entries, Cursor background form | Registration sync test and `--check` |
| Hermes repo-guards plugin | Bridges hooks to Hermes | `web_extract` screen, live-follow guard | Its unittest harness |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Unit | Library and each adapter, with a stub `jev` or a screen seam | `node --test`, vitest, unittest |
| Integration | Hook registration and mirrors | vitest, `--check` modes |
| Live | Devin payload captured from a real run, replayed through real Jev | Manual |
| Static | Alignment verifier | `verify_alignment_drift.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 54 | Internal | Green | None |
| Installed runtime CLIs | External | Green | A payload shape stays unread |
| ChatGPT quota for Luna and Codex | External | Reset at 13:03 | Review and the Codex probe wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite drops below baseline or an adapter disturbs a runtime's tool result.
- **Procedure**: Revert the phase commits.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Payload research ──► Shared library ──► Adapters (parallel) ──► Registry and mirrors ──► Docs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Payload research | None | Adapters |
| Shared library | None | Adapters |
| Adapters | Research, library | Registry |
| Registry and mirrors | Adapters | Docs |
| Docs | Registry | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Payload research | Med | 1 hour |
| Adapters and wiring | Med | 2 hours |
| Docs and verification | Med | 2 hours |
| **Total** | | **5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes
- [x] No feature flag needed
- [x] No monitoring needed

### Rollback Procedure
1. Revert the phase commits.
2. Rerun `sync-hook-registrations.cjs` and `sync-runtime-mirrors.cjs`, then the suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

