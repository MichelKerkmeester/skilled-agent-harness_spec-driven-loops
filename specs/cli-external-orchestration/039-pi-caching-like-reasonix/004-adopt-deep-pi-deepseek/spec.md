---
title: "Feature Specification: Adopt deep-pi as Exclusive DeepSeek Extension"
description: "Install deep-pi (christopherarter, Apache-2.0) as the DeepSeek-side cache/storm-breaker/hashline-edit stack, now that phase 003 has cleared pi-cache-optimizer out of DeepSeek's way."
trigger_phrases:
  - "adopt deep-pi"
  - "deep-pi deepseek install"
  - "deepseek cache stack adoption"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/004-adopt-deep-pi-deepseek"
    last_updated_at: "2026-08-07T11:19:49Z"
    last_updated_by: "spec-author"
    recent_action: "Installed, integrity-verified byte-identical to source, activation confirmed"
    next_safe_action: "Proceed to phase 005"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-004"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Is @arter/deep-pi still the right choice over jrimmer/pi-deepseek-optimized if the all-or-nothing module bundle proves too coarse in practice? (unchanged since planning — not resolved by installation, only by real usage)"
    answered_questions:
      - "npm tarball gitHead (0f1cbd8124b4fb35df97f85aa943d730f4aae549) verified reachable in github.com/christopherarter/deep-pi's real history; installed extensions/deeppi.ts is byte-identical to that commit's content."
      - "deep-pi keeps no persistent telemetry file (in-memory only, surfaced via slash commands) unlike pi-cache-optimizer's JSON stats file — a stricter privacy posture, and the reason live activation is confirmed via source-level eligibility matching rather than a stats-file diff (deferred to phase 005's payload-diff verification)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Adopt deep-pi as Exclusive DeepSeek Extension

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-fork-and-guard-cache-optimizer |
| **Successor** | 005-verification-and-decision-reconciliation |
| **Handoff Criteria** | `deep-pi` installed at pinned `@arter/deep-pi@1.0.0`, integrity-verified byte-identical against its claimed GitHub commit, eligibility confirmed via source (`isDeepPiModel`) to match exactly the models `pi-cache-optimizer`'s phase-003 guard excludes; the accepted all-or-nothing module trade-off is documented — met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the "Split DeepSeek vs. non-DeepSeek Pi cache-optimization ownership" work.

**Scope Boundary**: Installs and configures `deep-pi` only. Does not touch `pi-cache-optimizer` (phase 003 already handled that) and does not run the cross-extension verification or supersede ADR-001 (phase 005 does both).

**Dependencies**:
- `003-fork-and-guard-cache-optimizer` complete — the patched `pi-cache-optimizer` must already be installed and active, or deep-pi and the unpatched optimizer would both mutate DeepSeek requests
- `@arter/deep-pi` (npm), Apache-2.0, "derived from jrimmer/pi-deepseek-optimized" per its license note

**Deliverables**:
- `deep-pi` installed via `pi install npm:@arter/deep-pi@1.0.0`
- Confirmation that all three of its hook groups (stability, storm-breaker, telemetry) fire only on DeepSeek-matched models
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator intends to route more work through DeepSeek going forward. Today, no DeepSeek-specific optimization exists in the Pi setup beyond `pi-cache-optimizer`'s generic, provider-agnostic prefix stability (which phase 003 is removing for DeepSeek specifically, to prevent double-mutation). Without a DeepSeek-side replacement, increased DeepSeek usage would run with no cache-prefix stability, no retry-loop guard, and no hash-verified edit checking at all.

### Purpose
Install `deep-pi` as the exclusive DeepSeek-side extension: full-stack cache-prefix stability + storm-breaker retry-loop guard + hashline hash-verified edits + cost/telemetry, purpose-built for `deepseek-v4-flash`/`deepseek-v4-pro`. Confirmed by source (`extensions/deeppi.ts`): all three hook groups (`registerStabilityHooks`, `registerStormBreaker`, `registerTelemetryHooks`) are gated behind one shared `isDeepPiModel(model)` check, so leaving it installed is harmless for every non-DeepSeek session — it simply never fires.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Install `deep-pi` (`pi install npm:@arter/deep-pi@1.0.0`)
- Confirm it self-restricts to DeepSeek-matched models (no manual gating needed — verified from source)
- Document the accepted trade-off: its three modules share one activation gate with no per-module env-var toggles (confirmed: no `process.env` references anywhere in `extensions/deeppi.ts`), unlike `jrimmer/pi-deepseek-optimized` (the base it's derived from), which exposes `PI_HARNESS_CACHE_ENABLED`/`PI_HARNESS_HASHLINES_ENABLED`/etc.

### Out of Scope
- Patching or forking `deep-pi` itself to add module-level toggles — not attempted unless the all-or-nothing bundle proves to be a real problem in practice
- Verifying zero overlap with the patched `pi-cache-optimizer` — that cross-extension check belongs to phase 005
- Superseding ADR-001 — phase 005

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Pi extension/package manifest | Modify | Add `@arter/deep-pi@1.0.0` as an installed extension |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `deep-pi` installed and loadable by Pi | `pi install npm:@arter/deep-pi@1.0.0` succeeds; `/deeppi` command is available in a Pi session |
| REQ-002 | `deep-pi`'s hooks fire ONLY on DeepSeek-matched models | A live non-DeepSeek session (e.g. `openai-codex/gpt-5.6-luna`) shows no `deep-pi` telemetry/behavior; a live DeepSeek session shows it active |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | All-or-nothing module trade-off explicitly recorded | This spec + `plan.md` document the trade-off and the `jrimmer/pi-deepseek-optimized` fallback option, so the choice is legible, not silent |
| REQ-004 | Installation does not touch `pi-cache-optimizer` (patched or otherwise) | `git status`/diff on the `pi-cache-optimizer` fork shows no changes originating from this phase |
| REQ-005 | Pinned version installed, not a floating tag | `pi install npm:@arter/deep-pi@1.0.0` used verbatim, not `@latest` or unpinned |
| REQ-006 | Installed npm tarball verified to match the reviewed GitHub source, not just trusted by name | Compare the installed package's `gitHead`/npm integrity metadata against `github.com/christopherarter/deep-pi`'s `v1.0.0` tag/commit before relying on the source-level review this packet already did |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: DeepSeek sessions get cache-prefix stability, storm-breaker retry guard, and hashline edit verification with zero additional configuration
- **SC-002**: Non-DeepSeek sessions show zero behavioral change from installing `deep-pi` (it never activates for them)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 completing first | If `deep-pi` goes live before the `pi-cache-optimizer` fork is active, both extensions mutate the same DeepSeek request | Sequence enforced via `Predecessor`/`Successor` fields; phase 005 verifies the actual ordering held |
| Risk | `deep-pi` is a low-commit-count fork (its own upstream lineage, `jrimmer/pi-deepseek-optimized`, has only 8 commits) | Less battle-tested than `pi-cache-optimizer` (189 commits) | Its README explicitly claims fixes over the base (removed the risky rewind module, added telemetry); phase 005's smoke test is the real check, not the commit count alone |
| Risk | No per-module toggles | Cannot disable just the cache module while keeping storm-breaker/hashline-edits if one module misbehaves | Documented fallback: `jrimmer/pi-deepseek-optimized` has granular `PI_HARNESS_*_ENABLED` env vars; revisit only if the bundle proves to be a real problem |
| Risk | Ownership boundary mismatch with phase 003's guard | A fresh review confirmed `deep-pi` only activates for direct-API `deepseek-v4-flash`/`deepseek-v4-pro` (`isDeepPiModel`); phase 003's guard was corrected to the same narrow boundary (`provider === "deepseek"` + those two ids) specifically so the two extensions agree on ownership — see `003-fork-and-guard-cache-optimizer/spec.md` Problem Statement for the confirmed real gap this closes (`opencode/deepseek-v4-flash-free` belongs to neither extension's DeepSeek-direct scope and correctly stays with `pi-cache-optimizer`) | Cross-referenced, not duplicated, in both phases' docs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is `@arter/deep-pi` still the right choice over `jrimmer/pi-deepseek-optimized` if the all-or-nothing bundle proves too coarse once real DeepSeek usage ramps up?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../003-fork-and-guard-cache-optimizer/spec.md`
- **Successor**: `../005-verification-and-decision-reconciliation/spec.md`
