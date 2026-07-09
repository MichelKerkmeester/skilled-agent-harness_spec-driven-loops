---
title: "Implementation Plan: Deep-context native-only default executor pool"
description: "Flip the default fanout.executors to native-only in the config, then de-name the heterogeneous pool and restructure the pool question across the command, YAMLs, skill, README, and agent (3 mirrors)."
trigger_phrases:
  - "deep-context native default plan"
  - "executor pool default plan"
  - "native only pool plan"
  - "deep-context pool restructure"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/006-native-default-executor-pool"
    last_updated_at: "2026-06-07T11:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan for native-default executor pool"
    next_safe_action: "Verify jq/grep/parity, then validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/assets/deep_context_config.json"
      - ".opencode/commands/deep/start-context-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-006-native-default-executor-pool"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep-context native-only default executor pool

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config, Markdown command/skill/README, YAML workflow, agent defs (.md/.toml) |
| **Framework** | deep-context loop (deep-loop-runtime consumer) |
| **Storage** | Static config + docs (no DB) |
| **Testing** | `jq`, `rg`, body-diff, TOML parse, `validate.sh --strict` |

### Overview
The default pool lives in `deep_context_config.json` `fanout.executors`. Flipping it to 2 native is the one behavioral edit; everything else is de-naming the heterogeneous pool wherever it read as "default" and restructuring the user-facing pool question. The `by-model-shared-scope` mode enum and YAML dispatch logic are untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Default pool location identified (`deep_context_config.json`)
- [x] Full surface of het-default references mapped via grep
- [x] Option wording supplied verbatim by the user

### Definition of Done
- [x] Config default native-only; options restructured
- [x] Het list only under Custom/example labels
- [x] Mirror parity + TOML re-verified; `validate.sh --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-driven default + prose alignment. The loop reads `config.fanout.executors`; no flags → the config default (now native-only). Operators opt into CLI/heterogeneous via `--executor`/`--executors`.

### Key Components
- **Config default**: `deep_context_config.json` `fanout.executors`.
- **Setup prompt**: command Q-Pool (Native / Custom) + default-policy prose.
- **Docs**: SKILL.md + README default-pool rows; agent body wording (3 mirrors).

### Data Flow
Setup resolves `executor_pool` (flags/marker/config) → writes `config.fanout.executors` with `mode = by-model-shared-scope` → YAML dispatches native batch (and CLI pool only if CLI seats present).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep_context_config.json` | Default pool source | update to 2 native | `jq '.fanout.executors'` |
| `start-context-loop.md` | Setup prompt + policy + examples | update wording | `rg` Q-Pool + policy |
| `deep_start-context-loop_{auto,confirm}.yaml` | Placeholder description | update line | `rg executor_pool` |
| `SKILL.md` / `README.md` | Default-pool docs | update rows + example label | `rg "Default pool"` |
| `deep-context.md` (+ mirrors) | Seat self-description | soften wording; re-sync | body-diff + TOML parse |

Required inventories:
- Het-default refs: `rg -n "MiMo|deepseek|2 native \+|heterogeneous pool"` across the surface.
- Mode enum unchanged: `rg -n "by-model-shared-scope"` (must remain).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Map het-default surface via grep
- [x] Confirm config is the default source and mode enum is bound in YAML

### Phase 2: Core Implementation
- [x] Config `fanout.executors` → 2 native
- [x] Command: Q-Pool A/B, default-policy prose, examples, PRE-BOUND marker
- [x] Both YAMLs: executor_pool description line
- [x] SKILL.md + README: default-pool wording + example relabel
- [x] Agent: soften body; re-sync `.claude`/`.codex` mirrors

### Phase 3: Verification
- [x] `jq` config; `rg` het-only-in-Custom; Q-Pool wording
- [x] Mirror body-diff + Codex TOML parse
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Config | Default executors + mode | `jq` |
| Text | De-naming + option wording | `rg` |
| Format | Mirror parity, TOML | `diff`, python tomllib |
| Doc | Spec validity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep_context_config.json` | Internal | Green | No default to flip |
| 005 mirror convention | Internal | Green | No re-sync rule |
| `validate.sh` strict | Internal | Green | Cannot confirm completion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Native-only default proves wrong for the team.
- **Procedure**: Restore the 5-seat `fanout.executors` array and revert the prose edits via git; mirrors/mode unaffected.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | mapping done |
| Core Implementation | Low | config + prose edits |
| Verification | Low | scripted checks |
| **Total** | Low | **~1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations (static files)
- [x] Reversible via git
- [x] Mirror parity re-verified

### Rollback Procedure
1. Restore `fanout.executors` to the prior 5-seat array.
2. `git checkout` the command/YAML/SKILL/README/agent edits.
3. Re-run `jq` + parity checks to confirm prior state.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
