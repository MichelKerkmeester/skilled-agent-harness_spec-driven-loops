---
title: "Implementation Plan: Hook adapter shared boilerplate and Claude/Codex fix"
description: "Extract the byte-identical stdin/parse boilerplate into a shared ESM/CJS helper pair, migrate the Q6-sampled adapter families, and apply the firstNonBlankString alias fix to Claude's and Codex's spec-gate-enforce.mjs."
trigger_phrases:
  - "hook adapter shared boilerplate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/014-hook-adapter-shared-boilerplate-and-claude-codex-fix"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Implement Phase 1: shared helper files."
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-adapter-shared-boilerplate-and-claude-codex-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hook adapter shared boilerplate and Claude/Codex fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM + CommonJS |
| **Framework** | Claude/Codex/Devin/Cursor hook transports |
| **Testing** | Node test runner plus strict spec validation |

### Overview
Create `hook-adapter-shared.mjs`/`.cjs`, migrate the Q6-sampled adapter families (spec-gate-enforce, task-dispatch-guard, mcp-route-guard) across all 4 runtimes to import it, and apply the already-shipped `firstNonBlankString()` alias-chain fix to Claude's and Codex's own `spec-gate-enforce.mjs`, preserving Codex's `apply_patch` path-parsing untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [EVIDENCE: `spec.md` cites the Q6 dedup finding and the Claude/Codex alias-masking gap.]
- [x] Success criteria measurable. [EVIDENCE: `spec.md` defines five command-backed outcomes.]
- [x] Dependencies identified. [EVIDENCE: phase 012 established the precedent pattern; the Q6 synthesis scopes the extraction.]

### Definition of Done
- [ ] All acceptance criteria met. [EVIDENCE: pending implementation.]
- [ ] Migrated adapters' existing test suites pass unchanged. [EVIDENCE: pending implementation.]
- [ ] Claude/Codex discriminating masking-regression test added and green. [EVIDENCE: pending implementation.]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical boilerplate extraction into a small shared helper pair, plus a precedented alias-fix generalization — no shared-core changes.

### Key Components
- **`hook-adapter-shared.mjs`**: exports `readStdin()` and `parseJsonFailOpen(raw)`; consumed via `import` by ESM adapters.
- **`hook-adapter-shared.cjs`**: CommonJS twin with identical behavior for `.cjs` adapters that use `require`.
- **`firstNonBlankString()`**: already proven in phase 012/013 for Devin and Cursor; applied here to Claude's and Codex's `spec-gate-enforce.mjs` `filePathFrom()` resolution.

### Data Flow
Unchanged for every migrated adapter: stdin JSON in, shared-core decision, runtime-specific envelope out. Only the stdin-reading/parsing and alias-resolution lines change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hook-adapter-shared.mjs` | Does not exist | Create | Consumed by migrated ESM adapters |
| `hook-adapter-shared.cjs` | Does not exist | Create | Consumed by migrated CJS adapters |
| `claude/spec-gate-enforce.mjs` | `\|\|`-chain alias resolution | Apply `firstNonBlankString()`; migrate boilerplate | Existing suite + new masking-regression row |
| `codex/spec-gate-enforce.mjs` | `\|\|`-chain alias resolution + `apply_patch` parsing | Apply `firstNonBlankString()` (preserve `apply_patch`); migrate boilerplate | Existing suite + new masking-regression row |
| `devin/spec-gate-enforce.mjs` | Already fixed (phase 012) | Migrate boilerplate only | Existing 15/15 suite unchanged |
| `cursor/spec-gate-enforce.mjs` | Already fixed | Migrate boilerplate only | Existing 16/16 suite unchanged |
| `*/task-dispatch-guard.cjs` (claude, devin) | Inline boilerplate | Migrate boilerplate only | Existing suites unchanged |
| `*/mcp-route-guard.cjs` (per-runtime) | Inline boilerplate | Migrate boilerplate only | Existing suites unchanged |

Matrix axes: runtime (claude/codex/devin/cursor), fix status (already-fixed/needs-fix), module system (ESM/CJS).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shared helper files
- [ ] Create `hook-adapter-shared.mjs` exporting `readStdin()`/`parseJsonFailOpen()`.
- [ ] Create `hook-adapter-shared.cjs` as its CommonJS twin.
- [ ] Confirm both are byte-behavior-identical to the boilerplate they replace via a shared micro-test.

### Phase 2: Claude/Codex alias fix
- [ ] Apply `firstNonBlankString()` to Claude's `spec-gate-enforce.mjs` `filePathFrom()`.
- [ ] Apply `firstNonBlankString()` to Codex's `spec-gate-enforce.mjs` `filePathFrom()`, diff-reviewing to confirm `apply_patch` parsing is untouched.
- [ ] Add a discriminating masking-regression test row to each runtime's existing spec-gate test suite.

### Phase 3: Boilerplate migration and closeout
- [ ] Migrate all Q6-sampled adapters (spec-gate-enforce ×4, task-dispatch-guard ×2, mcp-route-guard ×N) to import the shared helper.
- [ ] Run every migrated adapter's existing test suite; confirm unchanged pass counts.
- [ ] Grep-confirm no remaining inline boilerplate duplication in migrated files.
- [ ] Run phase 014 strict and recursive parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Shared helper behavior vs. the boilerplate it replaces | `node --test` |
| Regression | Claude/Codex masking-fix discriminating row | `node --test` |
| Regression | Every migrated adapter's existing suite unchanged | `node --test` |
| Packet | Phase and parent consistency | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 012 (devin-hook-hardening) | Internal | Complete | Provides the `firstNonBlankString()` precedent and trim-and-fallback pattern. |
| Q6 dedup synthesis (5-iteration deep-research) | Internal | Complete | Scopes exactly which boilerplate is safely extractable. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any migrated adapter's existing test suite regresses, or the Codex `apply_patch` path is accidentally altered.
- **Procedure**: Revert the affected adapter's migration/fix individually — each adapter is migrated and verified independently, so a single-file revert does not affect the others.
<!-- /ANCHOR:rollback -->

---

## Related Documents
- `spec.md`, `tasks.md`, `checklist.md`
