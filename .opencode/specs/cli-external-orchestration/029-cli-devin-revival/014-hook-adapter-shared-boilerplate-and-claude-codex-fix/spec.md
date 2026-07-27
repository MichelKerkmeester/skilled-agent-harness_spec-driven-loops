---
title: "Feature Specification: Hook adapter shared boilerplate and Claude/Codex fix"
description: "Extract the byte-identical readStdin()/JSON-parse-fail-open boilerplate into shared helpers, and apply the already-shipped firstNonBlankString() alias-chain fix to Claude's and Codex's spec-gate-enforce.mjs, which carry the identical masking bug independently."
trigger_phrases:
  - "hook adapter shared boilerplate"
  - "claude codex spec gate alias fix"
  - "firstNonBlankString claude codex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/014-hook-adapter-shared-boilerplate-and-claude-codex-fix"
    last_updated_at: "2026-07-27T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented (GPT-5.6-LUNA xhigh) and verified."
    next_safe_action: "None; phase complete."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-adapter-shared-boilerplate-and-claude-codex-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The Q6 dedup finding confirmed only readStdin() + JSON.parse-fail-open boilerplate is safely extractable across all sampled adapters; tool-name maps, field-extraction, and envelope-emit blocks are irreducibly runtime-specific or not worth the indirection cost."
      - "Cursor's task-dispatch-guard.mjs delegates to Claude's task-dispatch-guard.cjs by spawnSync-ing it as a subprocess -- fixing 'Cursor's' alias-masking bug for that adapter already meant fixing Claude's file, which the devin-revival packet's phase 012/013 hardening pass already did."
      - "Claude's and Codex's own spec-gate-enforce.mjs carry the identical || -chain alias-masking bug independently -- they were never touched by the Devin/Cursor fix because they are different files, not shared ones."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hook adapter shared boilerplate and Claude/Codex fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../012-devin-hook-hardening/spec.md` (dependency — established the trim-and-fallback and firstNonBlankString alias-fix precedent this phase generalizes); `../013-devin-permission-request-handler/spec.md` (sibling — independent, no shared files) |
| **Successor** | `../015-devin-agents-skills-rules-parity/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two independent findings from the 5-iteration deep-research pass (GPT-5.6-SOL, high effort) on the cli-devin and cli-cursor hook adapter layers:

1. **Q6 (dedup)**: sampling across the Devin, Cursor, Claude, and Codex adapter families found that only the `readStdin()` + `JSON.parse`-fail-open boilerplate is byte-identical everywhere and safely extractable into a shared helper. Tool-name maps, field-extraction logic, and envelope-emit blocks are irreducibly runtime-specific (different event names, different payload shapes, different output envelopes) — extracting those would trade a small line-count win for a real indirection cost.
2. **Alias-chain masking bug, Claude/Codex scope**: the `||`-chain masking bug fixed in `spec-gate-enforce.mjs` for Devin and Cursor (`firstNonBlankString()`, phase 012/013 hardening) exists identically in Claude's and Codex's own `spec-gate-enforce.mjs` files. These were never touched by the earlier fix because they are separate files, not shared ones — the fix needs to be applied a second and third time, not inherited.

### Purpose
Create `hook-adapter-shared.mjs` (and a `.cjs` twin for CommonJS consumers) exporting `readStdin()` and a fail-open JSON-parse helper, migrate the adapters the Q6 sample actually covered (spec-gate-enforce, task-dispatch-guard, mcp-route-guard across all 4 runtimes) to import it instead of repeating the boilerplate inline, and apply `firstNonBlankString()` to Claude's and Codex's `spec-gate-enforce.mjs` — preserving Codex's `apply_patch` path-parsing, which has no Claude/Devin/Cursor equivalent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `system-spec-kit/runtime/lib/hook-adapter-shared.mjs` exporting `readStdin()` and `parseJsonFailOpen()`.
- Create a CommonJS twin (`hook-adapter-shared.cjs`) for the `.cjs` adapters (`task-dispatch-guard.cjs`, `mcp-route-guard.cjs`) that cannot `import` an ESM module directly.
- Migrate the Q6-sampled adapter families (`spec-gate-enforce.mjs`/`.cjs`, `task-dispatch-guard.cjs`, `mcp-route-guard.cjs`) across all 4 runtimes (Claude, Codex, Devin, Cursor) to import the shared helper instead of repeating the boilerplate inline.
- Apply `firstNonBlankString()` to Claude's `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` and Codex's `system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs`.
- Preserve Codex's `apply_patch` path-parsing exactly as-is — it has no equivalent in the other three runtimes and is out of the alias-fix's scope.

### Out of Scope
- Extracting tool-name maps, field-extraction, or envelope-emit logic — Q6 confirmed these are irreducibly runtime-specific.
- Modifying `spec-gate-core.mjs`, `dispatch-guard.cjs`, or `mcp-route-guard.mjs`'s shared cores — this phase touches only the thin adapter layer.
- Any adapter family outside the Q6 sample (e.g. `post-edit-quality.cjs`, `code-graph-freshness.cjs`) — those were not shown to share the same boilerplate pattern in the sample and are out of scope for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/runtime/lib/hook-adapter-shared.mjs` | Create | Shared `readStdin()`/`parseJsonFailOpen()` for ESM adapters. |
| `system-spec-kit/runtime/lib/hook-adapter-shared.cjs` | Create | CommonJS twin for `.cjs` adapters. |
| `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | Modify | Apply `firstNonBlankString()` alias fix; migrate to shared boilerplate. |
| `system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | Modify | Apply `firstNonBlankString()` alias fix (preserving `apply_patch` parsing); migrate to shared boilerplate. |
| `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Modify | Migrate to shared boilerplate (fix already applied in phase 012). |
| `system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Modify | Migrate to shared boilerplate (fix already applied in phase 012/hardening). |
| `system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` | Modify | Migrate to shared boilerplate. |
| `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` | Modify | Migrate to shared boilerplate. |
| `mcp-code-mode/runtime/hooks/*/mcp-route-guard.cjs` (per-runtime) | Modify | Migrate to shared boilerplate. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Claude's `spec-gate-enforce.mjs` uses `firstNonBlankString()` for its `filePathFrom()` alias resolution. | Grep confirms the function is present and used; the existing Claude spec-gate test suite still passes. |
| REQ-002 | Codex's `spec-gate-enforce.mjs` uses `firstNonBlankString()` for its alias resolution, with `apply_patch` path-parsing preserved unchanged. | Grep confirms the function is present; a diff shows the `apply_patch` branch is untouched; the existing Codex spec-gate test suite still passes. |
| REQ-003 | The shared `hook-adapter-shared.mjs`/`.cjs` helpers are byte-behavior-identical to the boilerplate they replace. | Every migrated adapter's test suite passes unchanged after migration. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | All Q6-sampled adapter families (spec-gate-enforce, task-dispatch-guard, mcp-route-guard) across all 4 runtimes import the shared helper instead of repeating the boilerplate inline. | Grep finds no remaining inline `readStdin()`/`JSON.parse`-fail-open duplication in the migrated files. |
| REQ-005 | A regression test confirms the pre-fix Claude/Codex adapters would have masked a real alias (mirroring the Devin/Cursor regression test from phase 012/013). | A discriminating test row fails against the un-migrated `||`-chain version and passes after the fix. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Claude's and Codex's spec-gate test suites pass with the alias fix applied and a discriminating masking-regression row added.
- **SC-002**: Every migrated adapter's existing test suite passes unchanged (no behavior drift from the boilerplate extraction).
- **SC-003**: Grep confirms no remaining inline boilerplate duplication in the migrated files.
- **SC-004**: Phase 014 strict validation passes with 0 errors and 0 warnings.
- **SC-005**: Recursive parent strict validation (029-cli-devin-revival) passes with 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Extracting boilerplate introduces a subtle behavior difference (e.g. encoding, chunking) for one runtime's stdin delivery | Low | Migrate one family at a time, running that family's full test suite before moving to the next. |
| Risk | The Codex `apply_patch` path-parsing is accidentally touched during the alias fix | Medium — Codex's path-parsing has no equivalent elsewhere and is easy to conflate with the alias-chain fix | Diff review isolating the `firstNonBlankString()` change from the `apply_patch` branch before committing. |
| Dependency | Phase 012 (devin-hook-hardening) | Established the trim-and-fallback and `firstNonBlankString()` precedent this phase generalizes to Claude/Codex | Complete. |
| Dependency | The Q6 dedup finding (5-iteration deep-research synthesis) | Scopes exactly which boilerplate is safely extractable | Already synthesized; re-verify against current on-disk state before migrating, not re-derived from scratch. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every migrated adapter continues to fail open on malformed input, missing identity, or internal error — the shared helper preserves this behavior, it does not change it.
- **NFR-R02**: The alias fix is purely additive — it only changes behavior when an earlier field is a truthy non-string masking a valid later string, which is the exact bug being fixed.

### Maintainability
- **NFR-M01**: The shared helper file lives under a path reachable from both ESM (`import`) and CommonJS (`require`) adapters without a build step.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A truthy non-string value in an earlier alias field (e.g. a stray object) no longer masks a valid string in a later field, in all 4 runtimes' `spec-gate-enforce.mjs`.
- Codex's `apply_patch` heredoc path-parsing continues to take precedence over the generic `file_path`/`filePath`/`path` alias chain, unchanged.

### State Transitions
- No state transition changes — the adapters delegate to shared cores, which own state; this phase only changes stdin-reading and alias-resolution boilerplate.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 2 new shared-helper files + ~9 adapter migrations + 2 alias fixes. |
| Risk | 8/25 | Boilerplate extraction is mechanical; the Codex `apply_patch` preservation needs careful diff review. |
| Research | 3/20 | Pattern and scope already established by phase 012 and the Q6 deep-research finding. |
| **Total** | **21/70** | **Level 2 — bounded dedup + a precedented alias-fix generalization.** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- None currently blocking.
<!-- /ANCHOR:questions -->

---

## Related Documents
- `plan.md`, `tasks.md`, `checklist.md`
- `../012-devin-hook-hardening/spec.md` (predecessor — trim-and-fallback and `firstNonBlankString()` precedent)
- `../013-devin-permission-request-handler/spec.md` (sibling phase — no shared files)
- `../hook-testing-results.md` §7a/§7f (the alias-masking fix and Q6 dedup findings this phase generalizes)
