---
title: "Implementation Plan: Ox Alpha via OpenRouter roster"
description: "Remove the opencode-go ox route, add openrouter/stealth/ox-alpha to the cli-pi roster (two synced points) and both CLI docs, and relax the cli-pi OpenRouter=Flash-only policy."
trigger_phrases:
  - "ox-alpha roster plan"
  - "openrouter stealth ox-alpha"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the openrouter-route plan (opencode-go dropped)"
    next_safe_action: "Commit when operator approves"
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
# Implementation Plan: Ox Alpha via OpenRouter roster

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
Route Ox Alpha through OpenRouter (`openrouter/stealth/ox-alpha`) on both CLIs: swap it into cli-pi's two synced enforcement points (mapped to `openrouter`), remove the earlier opencode-go/ox-alpha-free entries, relax the cli-pi "OpenRouter = Flash only" policy to "Flash + Ox Alpha", and document the route. cli-opencode has no code-level allowlist — its change is docs only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] OpenRouter offers the model (`opencode models` lists `openrouter/stealth/ox-alpha`)
- [x] Zen provider ruled out (two `Model not found` dispatch errors)
- [x] Enforcement points + OpenRouter policy sites identified

### Definition of Done
- [x] cli-pi roster carries `stealth/ox-alpha → openrouter`; opencode-go ox removed
- [x] OpenRouter policy relaxed to exactly Flash + Ox Alpha
- [x] Guard tests green; both CLIs live-verified (real `PONG`)
- [x] Packet validates `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed roster mirrored in two files. `executor-config.ts` `PI_SUPPORTED_MODELS` is source of truth; `fanout-run.cjs` mirrors it as `PI_ALLOWED_MODELS` plus a `PI_MODEL_PROVIDERS` map. OpenRouter literals keep their upstream path so `${provider}/${model}` composes a three-segment selector.

### Key Components
- **`PI_SUPPORTED_MODELS`** (executor-config.ts): the enforced allowlist.
- **`PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS`** (fanout-run.cjs): mirror + model→provider routing.

### Data Flow
Fan-out reads model id → checks `PI_ALLOWED_MODELS` → looks up `PI_MODEL_PROVIDERS` → builds `pi -p --offline --model openrouter/stealth/ox-alpha`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` `PI_SUPPORTED_MODELS` | Source-of-truth allowlist | −`ox-alpha-free`, +`stealth/ox-alpha` | roster assertion |
| `fanout-run.cjs` mirror + map | Sync mirror + routing | swap ox entry; map → openrouter | `node --check` + fanout vitest |
| OpenRouter policy (2 comments, 2 blockquotes) | "Flash only" guard text | relax to "Flash + Ox Alpha" | grep + read |
| cli-pi / cli-opencode docs | Operator roster docs | drop opencode-go ox row; add OpenRouter row | grep + read |
| `*.vitest.ts` guards | Pin roster/provider | swap expectations | `npx vitest run` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Live-probe zen (no ox) + OpenRouter (ox works) on both CLIs; locate enforcement + policy sites

### Phase 2: Core Implementation
- [x] Swap roster/provider entries in executor-config.ts + fanout-run.cjs; relax policy comments
- [x] Drop opencode-go ox rows, add OpenRouter rows, relax blockquotes in both docs
- [x] Swap guard test expectations

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
| Wiring | builder emits 3-segment selector | `node -e` builder probe |
| Live | real dispatch completes a turn | `opencode run`, `pi` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenRouter provider (stealth channel) | External | Green | Model unavailable; live-verified 2026-08-22 |
| OpenRouter auth on the machine | External | Green | Cannot dispatch (confirmed working) |
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
- [x] Enforcement points + OpenRouter policy sites identified
- [x] Guard tests located

### Rollback Procedure
1. `git checkout -- <the two runtime files, two docs, two test files>`
2. `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts`
3. No data reversal (config/docs only)
<!-- /ANCHOR:enhanced-rollback -->
