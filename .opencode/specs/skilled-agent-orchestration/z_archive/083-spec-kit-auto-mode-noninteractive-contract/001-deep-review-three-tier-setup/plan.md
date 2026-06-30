---
title: "Implementation Plan: deep-review :auto non-interactive setup bypass"
description: "Add non-interactive setup-resolution branch to /deep:start-review-loop entrypoint so :auto truly doesn't hang on stdin."
trigger_phrases:
  - "deep-review setup hang"
  - "F-Stage-E-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/001-deep-review-three-tier-setup"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Author tasks + checklist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-001-deep-review-three-tier-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: deep-review :auto non-interactive setup bypass

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command + YAML workflow + spec-kit runtime |
| **Framework** | system-spec-kit deep-loop infrastructure |
| **Storage** | Filesystem; review/ dir per packet |
| **Testing** | Live dispatch via codex exec + opencode run; existing strict-validate |

### Overview
Audit `.opencode/commands/deep/start-review-loop.md` §0 UNIFIED SETUP PHASE. Implement a three-tier setup-resolution contract under `:auto`:
- **Tier 1 (resolve)**: when every required input resolves from `$ARGUMENTS`, `PRE-BOUND SETUP ANSWERS:` block, or documented defaults → skip the question block, load YAML.
- **Tier 2 (targeted ask)**: when 1-2 fields are genuinely ambiguous AND no sensible default exists → emit ONE narrow question naming only the ambiguous field. Wait briefly; fall through to Tier 3 on stdin EOF.
- **Tier 3 (fail fast)**: when truly unresolvable → exit non-zero with a clear named-missing-inputs error.

Verification scenarios cover all three tiers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Existing deep-review setup flow audited (`.opencode/commands/deep/start-review-loop.md` + YAML asset).
- [ ] Pre-binding marker schema decided (field names + types match existing Q0..Q-Exec).
- [ ] Test target spec folder selected (a small Level 1 or Level 2 packet that can take a 3-iter deep-review fast).

### Definition of Done
- [ ] All P0 checklist items marked `[x]` with evidence.
- [ ] All P1 checklist items marked `[x]` or carry user-approved deferral.
- [ ] `bash validate.sh --strict 028` exits 0.
- [ ] Verification scenario passes via both codex exec AND opencode run non-interactive dispatches.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-tier setup resolution under `:auto`, with `:confirm` keeping its existing single-branch behavior. Implemented inside the command markdown's §0:

- **`:confirm` (unchanged)**: emit consolidated question block + wait for user.
- **`:auto` Tier 1 (resolve)**: every required input resolves from `$ARGUMENTS` + pre-binding markers + defaults → persist to `deep-review-config.json` → load YAML directly.
- **`:auto` Tier 2 (targeted ask)**: 1-2 fields ambiguous AND no default → emit ONE narrow question naming only the ambiguous field → wait briefly → on answer, merge into resolved map and proceed to Tier 1's persistence step; on stdin EOF, fall through to Tier 3.
- **`:auto` Tier 3 (fail fast)**: truly unresolvable → exit non-zero with a named-missing-inputs error.

### Key Components
- **`.opencode/commands/deep/start-review-loop.md` §0**: tier selector; documents the pre-binding marker schema + per-field default-resolution rules.
- **Pre-binding marker block** (`PRE-BOUND SETUP ANSWERS:`): structured block in the dispatched prompt the setup phase parses for setup field values.
- **Per-field default-resolution rules**: for each setup field (target, mode, dims, maxIter, convergence, executor), document whether it has a sensible default, an inferable value, or requires a user choice.
- **Ambiguity detector**: logic that flags a field as Tier-2-eligible only when (a) no flag, (b) no marker, (c) no default, but (d) the field is genuinely required.
- **Fail-fast error emitter**: clear named-missing-inputs message when Tier 3 fires.
- **YAML init step**: unchanged consumer; reads resolved `deep-review-config.json` regardless of which tier produced it.

### Data Flow
1. Command receives `$ARGUMENTS` with target + flags + `:auto` suffix.
2. Setup phase parses `$ARGUMENTS` → resolved inputs map (target, mode, dims, maxIter, convergence, executor).
3. Setup phase scans the prompt body for a `PRE-BOUND SETUP ANSWERS:` block → merges values into the resolved map.
4. Setup phase applies documented defaults to any unresolved field that has one.
5. Setup phase classifies remaining unresolved fields:
   - **Zero unresolved required fields** → Tier 1: persist config, load YAML, continue.
   - **1-2 unresolved required fields, all ambiguity-detectable** → Tier 2: emit one targeted question per field; on answer, merge and go to step 4 again.
   - **More than 2 unresolved, OR Tier 2 produced no answer (stdin EOF)** → Tier 3: emit fail-fast error, exit non-zero.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Audit `.opencode/commands/deep/start-review-loop.md` §0 — identify all required inputs and their default-resolution paths.
- [ ] Audit `assets/deep_start-review-loop_auto.yaml` setup steps — note which fields it reads from `deep-review-config.json`.
- [ ] Decide pre-binding marker schema (block name + field syntax + ordering).

### Phase 2: Core Implementation
- [ ] Add the non-interactive branch to deep-review.md §0.
- [ ] Document the pre-binding marker schema in the same file.
- [ ] Add the fail-fast error emitter.
- [ ] If YAML init step needs adjustment, update it.

### Phase 3: Verification
- [ ] Author the verification scenario (file + Setup block dispatching non-interactively).
- [ ] Run the scenario via codex exec — must succeed.
- [ ] Run the scenario via opencode run --pure — must succeed.
- [ ] Run a fail-case dispatch (`:auto` with empty args) — must exit non-zero with named-missing-inputs error.
- [ ] Confirm `:confirm` mode untouched: run a `:confirm` dispatch and verify it still asks the question block.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live dispatch | Non-interactive `:auto` end-to-end | codex exec + opencode run --pure |
| Fail-fast | `:auto` with empty args | codex exec </dev/null |
| Regression | `:confirm` mode unchanged | manual interactive run |
| Strict validate | Spec folder | `validate.sh --strict 028` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/commands/deep/start-review-loop.md` | Internal | Green | Cannot edit setup phase. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Internal | Green | May need consumer-side adjustment. |
| cli-codex + cli-opencode binaries | External | Green | Verification scenario needs both. |
| Test target spec folder (a small Level 1 or 2 packet for fast iteration) | Internal | Green | Pick one; revert any changes after testing. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Existing `:confirm` flow regresses, or `:auto` no longer loads YAML after the change.
- **Procedure**: `git restore .opencode/commands/deep/start-review-loop.md` + (if touched) `git restore assets/deep_start-review-loop_auto.yaml`. Verification scenario remains for retry.
- **State preserved**: 028 spec folder, audit notes in scratch/, any partial scenario edits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Provides | Notes |
|-------|-----------|----------|-------|
| Phase 1: Setup | command + YAML files exist | Audit notes + schema decision | No writes. |
| Phase 2: Implementation | Phase 1 | Non-interactive branch in deep-review.md | Single-file edit primarily. |
| Phase 3: Verification | Phase 2 | Test scenario + 3 dispatch verdicts | Closes packet. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATION

| Activity | Estimate | Drivers |
|----------|----------|---------|
| Setup audit | 15 min | Read command md + YAML; map resolution paths. |
| Schema decision | 10 min | Match Q0..Q-Exec field names exactly. |
| Implementation | 30-45 min | Markdown edits + fail-fast error + possibly YAML consumer update. |
| Verification | 20 min | 3 dispatches (codex pass / opencode pass / codex fail) + strict-validate. |
| **Total** | **~90 min** | Single-session execution feasible. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

### Failure Modes

| Failure Mode | Trigger | Rollback Action |
|--------------|---------|-----------------|
| `:confirm` regression | Manual confirm dispatch loses its question block | `git restore` deep-review.md; re-audit branch-selector logic |
| YAML init step fails to read resolved config | YAML expects an existing field shape that the new branch doesn't populate | Trace `step_resolve_setup` consumer; ensure both branches produce identical `deep-review-config.json` shape |
| Pre-binding marker parser collides with existing convention | Markdown emits unexpected output during setup | Tighten the marker regex; rename block if needed |
| Fail-fast error swallowed | `:auto` with empty args still hangs | Add an early-exit check at the top of §0 before any other logic |

### State Preserved Across Rollback
- 028 spec folder intact.
- Pre-existing 102/004 prompt-side workaround still works (we don't depend on this fix for 102 to keep passing).
- All other spec-kit commands unaffected.

### Recovery Procedure
1. Identify which dispatch failed (codex / opencode / fail-case / confirm-regression).
2. Inspect transcript for the failure mode.
3. Targeted `git restore` of touched files.
4. Re-implement with the failure-mode fix applied.
5. Re-run all 4 verification dispatches before claiming completion.
<!-- /ANCHOR:enhanced-rollback -->
