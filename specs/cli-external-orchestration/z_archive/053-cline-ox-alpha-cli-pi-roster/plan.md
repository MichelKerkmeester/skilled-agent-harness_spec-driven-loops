---
title: "Implementation Plan: Ox Alpha via the Cline provider for cli-pi"
description: "Add a x-ai/ox-alpha model to .pi/models.json + enabledModels, document it on both pi doc surfaces, and wire it into the deep-loop cli-pi fan-out roster (two synced points + provider map), mirroring the Cline DeepSeek Flash treatment."
trigger_phrases:
  - "cline ox-alpha plan"
  - "cline-pass ox-alpha cli-pi"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/053-cline-ox-alpha-cli-pi-roster"
    last_updated_at: "2026-08-24T10:18:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the Cline-route plan (config + docs + fan-out)"
    next_safe_action: "Implement Phase 2"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-053-cline-ox-alpha-cli-pi"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Ox Alpha via the Cline provider for cli-pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config (`.pi`) + TypeScript/CommonJS (deep-loop runtime) + Markdown skill docs |
| **Framework** | vitest |
| **Storage** | None (config + docs) |
| **Testing** | `npx vitest run` + fanout builder probe + live pi/Cline dispatch |

### Overview
Register Ox Alpha on the Cline provider (`cline-pass`) for cli-pi. Add the model to `.pi/models.json` and enable its three-segment picker id, document it on both pi doc surfaces, and add it to the deep-loop cli-pi fan-out roster's two synced points plus the provider map. The whole change mirrors the existing Cline DeepSeek Flash entry; the only Ox-Alpha-specific facts are the model id (`x-ai/ox-alpha`), context/output (1M / 131,072), and the `xhigh`-topped tier map.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The Cline provider block (`cline-pass`) already exists in `.pi/models.json` (packet 049)
- [x] pi holds a stored `cline-pass` credential (the DeepSeek entries dispatch with it)
- [x] Fan-out enforcement points + guard-test assertions located
- [x] Ox Alpha context/output confirmed from pi's model store (1M / 131,072)

### Definition of Done
- [ ] `.pi` config carries `x-ai/ox-alpha` (models.json) and `cline-pass/x-ai/ox-alpha` (enabledModels)
- [ ] Fan-out roster carries the new id in both synced points; provider map resolves it
- [ ] Both pi doc surfaces show the Ox Alpha entry
- [ ] `node --check` + the three guard vitest files green; a live Cline dispatch returns a real reply
- [ ] Packet validates `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-declared custom provider (pi) plus a fail-closed roster mirrored in two runtime files. `.pi/models.json` declares the `cline-pass` provider and its models; `.pi/settings.json` `enabledModels` exposes them in the picker as three-segment ids. For fan-out, `executor-config.ts` `PI_SUPPORTED_MODELS` is source of truth and `fanout-run.cjs` mirrors it as `PI_ALLOWED_MODELS` plus a `PI_MODEL_PROVIDERS` map. The Cline model id keeps its `modelType/` prefix (Ox Alpha's is `x-ai/`, unlike the DeepSeek entries' `cline-pass/`) so `${provider}/${model}` composes the three-segment selector Cline requires.

### Key Components
- **`providers["cline-pass"].models`** (`.pi/models.json`): the config declaration + `thinkingLevelMap`.
- **`enabledModels`** (`.pi/settings.json`): the picker/headless three-segment id.
- **`PI_SUPPORTED_MODELS`** (executor-config.ts): the enforced fan-out allowlist.
- **`PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS`** (fanout-run.cjs): mirror + model→provider routing.

### Data Flow
Fan-out reads model id `x-ai/ox-alpha` → checks `PI_ALLOWED_MODELS` → looks up `PI_MODEL_PROVIDERS` (`cline-pass`) → builds `pi -p --offline --model cline-pass/x-ai/ox-alpha` → pi resolves the `cline-pass` provider from `.pi/models.json` → sends the slashed model id to the Cline API.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.pi/models.json` `cline-pass` block | 2 DeepSeek models | +`x-ai/ox-alpha` model | `pi --list-models \| grep ox` |
| `.pi/settings.json` `enabledModels` | picker id list | +`cline-pass/x-ai/ox-alpha` | grep + list-models |
| `executor-config.ts` `PI_SUPPORTED_MODELS` | Source-of-truth allowlist | +`x-ai/ox-alpha` | roster assertion |
| `fanout-run.cjs` mirror + map | Sync mirror + routing | +id; map → `cline-pass` | `node --check` + fanout vitest |
| cli-pi roster + `.pi/custom-providers.md` | Operator docs | +Ox Alpha row/section | grep + read |
| `*.vitest.ts` guards | Pin roster/provider | swap expectations | `npx vitest run` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (done during authoring)
- [x] Confirm the Cline provider block, the DeepSeek treatment, and Ox Alpha's context/output; locate fan-out enforcement + guard sites

### Phase 2: Core Implementation
- [ ] Add the `x-ai/ox-alpha` model to `.pi/models.json`; add `cline-pass/x-ai/ox-alpha` to `enabledModels`
- [ ] Add the id to `PI_SUPPORTED_MODELS` (executor-config.ts) and `PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS` (fanout-run.cjs)
- [ ] Document Ox Alpha in `.pi/custom-providers.md` §2 and the cli-pi `### cline-pass` roster section
- [ ] Swap the guard-test expectations (executor-config + fanout-run)

### Phase 3: Verification
- [ ] `node --check`, run the three guard vitest files, fanout builder probe, live Cline dispatch, `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | roster + provider map | `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` (auto-derived) |
| Syntax | fanout module | `node --check` |
| Wiring | builder emits 3-segment selector | `node -e` builder probe |
| Live | real dispatch completes a turn | `pi -p --provider cline-pass --model cline-pass/x-ai/ox-alpha --thinking xhigh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Cline (ClinePass) provider auth | External | Green | Cannot dispatch; pi holds a stored `cline-pass` credential |
| Ox Alpha upstream availability | External | Green (free tier, limited usage) | Model unavailable; it is the operator's active interactive model today |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: fan-out mis-routes, a guard test regresses, or the live dispatch fails.
- **Procedure**: `git checkout` the two runtime files, two test files, two docs, and revert the two `.pi` config edits. No persistent state to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] Enforcement points + guard tests located
- [x] `.pi` config edit points identified (models.json block, settings enabledModels)

### Rollback Procedure
1. `git checkout -- <the two runtime files, two test files, two docs>` and revert the `.pi/models.json` + `.pi/settings.json` edits
2. `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/combo-matrix.vitest.ts`
3. No data reversal (config/docs only)
<!-- /ANCHOR:enhanced-rollback -->
