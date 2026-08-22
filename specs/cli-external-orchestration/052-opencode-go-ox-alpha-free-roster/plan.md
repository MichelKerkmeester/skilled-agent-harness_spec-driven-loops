---
title: "Implementation Plan: opencode-go Ox Alpha Free roster"
description: "Add ox-alpha-free to the cli-pi fan-out roster (two synced enforcement points) mapped to opencode-go, plus opencode-go doc rows in both skills."
trigger_phrases:
  - "ox-alpha-free roster plan"
  - "ox-alpha-free fanout"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T10:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the roster + provider-map + docs plan"
    next_safe_action: "Packet complete pending operator review"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-052-opencode-go-ox-alpha-free"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: opencode-go Ox Alpha Free roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + CommonJS (deep-loop runtime) + Markdown skill docs |
| **Framework** | vitest |
| **Storage** | None |
| **Testing** | `npx vitest run` + fanout builder probe + live CLI dispatch |

### Overview
Add `ox-alpha-free` to cli-pi's enforced fan-out roster (two synced places) mapped to the `opencode-go` provider, then document the route under the existing `### opencode-go` section in each skill's roster doc. cli-opencode enforces no code-level allowlist — its roster change is docs only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] opencode-go offers the model (live `opencode models opencode-go` lists `opencode-go/ox-alpha-free`)
- [x] Enforcement points and their sync invariant identified (from 034 prior art + direct read)
- [x] Operator directive to add both rosters confirmed (screenshot)

### Definition of Done
- [x] Both cli-pi enforcement points carry `ox-alpha-free`; provider map routes it via opencode-go
- [x] Guard tests green; fanout builder emits the correct provider-prefixed command
- [x] Routing live-confirmed on both CLIs (full turn deferred by opencode-go monthly quota)
- [x] Packet validates `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed roster mirrored in two files. `executor-config.ts` `PI_SUPPORTED_MODELS` is the source of truth; `fanout-run.cjs` hand-duplicates it as `PI_ALLOWED_MODELS` (synchronous, no TS import) plus a `PI_MODEL_PROVIDERS` map so every model dispatches as `<provider>/<id>`.

### Key Components
- **`PI_SUPPORTED_MODELS`** (executor-config.ts): the enforced allowlist.
- **`PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS`** (fanout-run.cjs): the mirror + model→provider routing.

### Data Flow
Fan-out reads model id → checks `PI_ALLOWED_MODELS` → looks up `PI_MODEL_PROVIDERS` → builds `pi -p --offline --model opencode-go/ox-alpha-free`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` `PI_SUPPORTED_MODELS` | Source-of-truth allowlist | add `ox-alpha-free` | `executor-config.vitest.ts` roster assertion |
| `fanout-run.cjs` `PI_ALLOWED_MODELS` | Synchronous mirror | add `ox-alpha-free` | `node --check` + fanout vitest mirror-sync test |
| `fanout-run.cjs` `PI_MODEL_PROVIDERS` | model→provider map | add `ox-alpha-free → opencode-go` | fanout builder probe (provider-prefixed command) |
| cli-pi / cli-opencode `providers-and-models.md` | Operator roster docs | add `### opencode-go` row | grep + read |
| `*.vitest.ts` guards | Pin roster/provider | extend expectations | `npx vitest run` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Live-probe opencode-go + pi for the model; read both enforcement points + docs

### Phase 2: Core Implementation
- [x] Edit executor-config.ts + fanout-run.cjs (roster + provider map)
- [x] Add `ox-alpha-free` rows to both skills' `### opencode-go` sections
- [x] Extend guard test expectations (after watching the roster guard fail)

### Phase 3: Verification
- [x] `node --check`, run both vitest files, fanout builder probe, live CLI dispatch, `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | roster + provider map | `executor-config.vitest.ts`, `fanout-run.vitest.ts` |
| Syntax | fanout module | `node --check` |
| Wiring | builder emits provider-prefixed command | `node -e` fanout builder probe |
| Live | real dispatch routes to the gateway | `opencode run`, `pi --model opencode-go/ox-alpha-free` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode-go provider (model catalog) | External | Green | Model unavailable (confirmed listed live) |
| opencode-go monthly free-tier quota | External | Amber | A completed turn is deferred until quota resets (~16 days); routing confirmed regardless |
| pi `models-store.json` opencode-go block | Internal | Amber | Store lacks the model; pi's custom-model-id fallback still routes it (benign warning) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: fan-out mis-routes or a guard test regresses.
- **Procedure**: `git checkout` the two runtime files + two docs + two test files. No persistent state to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] Both enforcement points identified and their sync invariant understood
- [x] Guard tests located

### Rollback Procedure
1. `git checkout -- <the two runtime files, two docs, two test files>`
2. `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts`
3. No data reversal (config/docs only)
<!-- /ANCHOR:enhanced-rollback -->
