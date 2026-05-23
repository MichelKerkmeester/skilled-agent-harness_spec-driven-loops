---
title: "Implementation Plan: Rerank reaper env knobs and operator docs [template:level_2/plan.md]"
description: "Extend the rerank sidecar launcher allowlist and update operator-facing docs for the completed reaper lifecycle."
trigger_phrases:
  - "rerank reaper env plan"
  - "sidecar docs plan"
  - "env allowlist plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "planned-launcher-env-and-doc-updates"
    next_safe_action: "patch-start-skill-readme"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/scripts/start.sh"
      - ".opencode/skills/system-rerank-sidecar/SKILL.md"
      - ".opencode/skills/system-rerank-sidecar/README.md"
    session_dedup:
      fingerprint: "sha256:0100050040000000000000000000000000000000000000000000000000000000"
      session_id: "010-005-004-rerank-reaper-env-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Use Level 2 packet at user-specified path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rerank reaper env knobs and operator docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Markdown |
| **Framework** | OpenCode skill docs and shell launcher |
| **Storage** | Filesystem docs and env process boundary |
| **Testing** | Shell smoke, static grep, SpecKit validation |

### Overview
Patch `scripts/start.sh` to forward exactly four approved reaper env knobs through the existing scrubbed env boundary. Update `SKILL.md` and `README.md` so operators and future agents understand owner-death cleanup, idle cleanup, pre-flight reap, lifecycle telemetry, and the manual debug opt-out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Predecessor defaults and env names reviewed.
- [x] Target files read before modification.

### Definition of Done
- [x] Approved reaper env knobs are explicitly allowlisted in `start.sh`.
- [x] `SKILL.md` and `README.md` document the lifecycle without phase references.
- [x] `SKILL.md` remains under 500 LOC.
- [x] Requested smoke and strict validation commands pass or are documented with exact result.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical launcher configuration plus operator documentation.

### Key Components
- **Launcher env boundary**: `start.sh` builds `env_args` and execs uvicorn through `env -i`.
- **Skill guidance**: `SKILL.md` gives AI-agent routing, lifecycle rules, and env defaults.
- **Operator README**: `README.md` gives human quickstart, config, troubleshooting, and debug guidance.
- **Packet docs**: Level 2 docs capture scope, validation, and post-merge integration smoke.

### Data Flow
Parent shell and dotenv values enter `start.sh`; only explicitly allowlisted keys are copied into `env_args`; uvicorn receives that scrubbed env. Docs describe the runtime reaper behavior already implemented in the app and launcher layers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `start.sh` allowlist | Defines env passed to uvicorn after `env -i`. | Add four explicit reaper keys and comments. | `rg` env names and unrelated-env static check. |
| `SKILL.md` | Agent-facing sidecar contract. | Add lifecycle/env docs and remove stale phase references. | `wc -l`, `rg` for phase references, strict packet validation. |
| `README.md` | Operator-facing docs. | Add lifecycle/env/debug/telemetry guidance and remove phase references. | `rg` for required phrases and phase references. |
| Source code under `scripts/` other than `start.sh` | Owns implemented behavior. | Unchanged. | `git diff --name-only` confirms no extra source edits. |

Required inventories:
- Same-class producers: `rg -n 'RERANK_SIDECAR_REAPER|RERANK_SIDECAR_IDLE_TIMEOUT' .opencode/skills/system-rerank-sidecar .opencode/bin`.
- Consumers of changed env names: README/SKILL/start docs only in this packet.
- Matrix axes: approved knob vs unrelated env; operator docs vs agent docs; normal cleanup vs manual debug.
- Algorithm invariant: no broad parent-shell env pass-through may replace the explicit `env_args` model.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 packet at the pre-approved path.
- [x] Strict-validate scaffold before target edits.
- [x] Read predecessor ADR and completed sibling packet evidence.

### Phase 2: Core Implementation
- [x] Add four reaper keys to `start.sh` explicit allowlist.
- [x] Add concise reaper lifecycle and env docs to `SKILL.md`.
- [x] Add operator lifecycle, env table, telemetry, and manual debug docs to `README.md`.
- [x] Fill packet docs and include integration smoke runbook.

### Phase 3: Verification
- [x] Run bounded `start.sh --help` smoke command.
- [x] Run packet strict validation.
- [x] Run parent strict validation.
- [x] Verify SKILL LOC cap and absence of phase references in public docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Env allowlist and required docs strings | `rg`, `wc -l` |
| Smoke | Launcher entrypoint | `bash scripts/start.sh --help 2>&1 || true` with bounded execution |
| Spec validation | Packet and parent docs | `validate.sh --strict` |
| Manual integration | Owner death and telemetry after launch | Runbook in `implementation-summary.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Predecessor reaper ADRs | Internal docs | Green | Env/default mismatch risk if not read. |
| Completed sibling implementation packets | Internal docs/code contract | Green | Docs must follow implemented telemetry name and defaults. |
| Existing `start.sh` allowlist pattern | Shell launcher | Green | Required to preserve env scrubbing. |
| SpecKit validator | Local script | Green | Completion claims require strict validation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Env allowlist forwards unintended keys, docs exceed caps, or validation fails.
- **Procedure**: Revert this packet's changes to `start.sh`, `SKILL.md`, `README.md`, and packet docs; rerun the same strict validations.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read contracts -> Patch launcher/docs -> Verify and fill completion docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Completion handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Medium | 45 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations.
- [x] No feature flags changed.
- [x] Scope limited to launcher allowlist, docs, and packet docs.

### Rollback Procedure
1. Revert edited lines in `start.sh`, `SKILL.md`, and `README.md`.
2. Revert this packet folder if the docs are no longer useful.
3. Run packet and parent strict validations.
4. Re-run launcher smoke if `start.sh` changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
