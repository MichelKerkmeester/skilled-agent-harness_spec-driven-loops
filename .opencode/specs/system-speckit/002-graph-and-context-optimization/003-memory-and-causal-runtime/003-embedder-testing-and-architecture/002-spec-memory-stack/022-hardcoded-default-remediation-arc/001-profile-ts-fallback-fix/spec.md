---
title: "Spec: 016/002/022/001 profile.ts Fallback Fix — eliminate inline `||` model fallbacks + delete embeddings.ts:774 dead code"
description: "3 P0 audit findings (f-iter001-001, f-iter001-002, f-iter001-003) from packet 021. profile.ts has 4 inline `||` fallbacks in resolveActiveProfileModel (voyage/openai/ollama/hf-local) — 2 of them contradict ADR-014 (hf-local BAAI is CONFIRMED ACTIVE for CLI scripts; ollama jina is LATENT). embeddings.ts:774 has a parallel `|| 'jina-embeddings-v3'` shadowed by upstream config (DEAD CODE per audit). Phase 001 replaces all 4 profile.ts inline fallbacks with getCanonicalFallback(provider) calls + removes the dead-code fallback in embeddings.ts + ships profile.test.ts ban-list invariant."
trigger_phrases:
  - "profile.ts fallback fix"
  - "022/001 inline pipe-pipe cleanup"
  - "BAAI hf-local CONFIRMED ACTIVE fix"
  - "embeddings.ts:774 dead code removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix"
    last_updated_at: "2026-05-23T15:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase scaffolded; awaiting cli-devin SWE-1.6 dispatch"
    next_safe_action: "Dispatch cli-devin with RCAF + medium pre-planning prompt"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.test.ts"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022b1"
      session_id: "016-002-022-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope confirmed: all 4 profile.ts inline fallbacks (voyage/openai/ollama/hf-local), not just the 2 P0s, since getCanonicalFallback covers all 4 providers"
      - "Executor: cli-devin SWE-1.6 with RCAF + medium pre-planning per the parent arc executor table"
      - "Test convention: shared/predicates/boolean-expr.test.ts standalone-assertion pattern (no Vitest in shared/)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/002/022/001 profile.ts Fallback Fix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | Mechanical TS refactor + new invariant test |
| Owner | cli-devin SWE-1.6 executor (RCAF + medium pre-planning) |
| Parent | `../spec.md` (022-hardcoded-default-remediation-arc) |
| Predecessor | `../020-embedder-default-drift-fix/` (shipped getCanonicalFallback() helper); `../021-hardcoded-default-audit-deep-research/` (audit finding 3 P0s here) |
| Estimated wall-clock | 15–30 min |
| Risk class | LOW |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`profile.ts:resolveActiveProfileModel` is a switch returning inline `process.env.X || 'literal'` per provider. 2 of those literals are stale:

- Line 195 hf-local fallback `'BAAI/bge-base-en-v1.5'` — **CONFIRMED ACTIVE**: fires in common no-config scenarios where no `EMBEDDINGS_PROVIDER` env var is set. CLI scripts (checkpoint, ablation, eval) consume `resolveActiveProfile` and write vector DB filenames using whatever this returns. Result: even though spec-memory daemon switched to nomic on 2026-05-19, CLI script paths have been targeting BAAI vector tables.
- Line 192 ollama fallback `'jina-embeddings-v3'` — **LATENT**: fires only with explicit `EMBEDDINGS_PROVIDER=ollama` env var. Pre-ADR-013 default (the bake-off winner that operator override demoted).
- Lines 188 + 190 (voyage + openai) — coincidentally match canonical values from `CLOUD_CANONICAL`, but still inline literals; should derive from `getCanonicalFallback` for consistency.

`embeddings.ts:774` is a parallel chain: `providerInfo.config.OLLAMA_EMBEDDINGS_MODEL || 'jina-embeddings-v3'`. The `providerInfo.config` upstream comes from `getProviderInfoForResolution` → `DEFAULT_PROVIDER_MODELS.ollama` (registry-derived since packet 020). So the inline `'jina-embeddings-v3'` is **DEAD CODE** — shadowed by the registry-derived upstream value. Still needs removal for code hygiene + ban-list verification.

Purpose: thread all 4 profile.ts inline `||` returns through `getCanonicalFallback(provider)`, and remove the dead-code fallback at `embeddings.ts:774`. Ship `profile.test.ts` with 6 standalone-assertion invariants locking the contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Modify `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts` `resolveActiveProfileModel` (lines 185–197): replace each `process.env.X || 'literal'` with `process.env.X || getCanonicalFallback(provider)` (note: switch on provider; `getCanonicalFallback(provider)` returns the right canonical for each)
- Modify `.opencode/skills/system-spec-kit/shared/embeddings.ts:774`: replace `|| 'jina-embeddings-v3'` with `|| getCanonicalFallback('ollama')` (or `|| ''` if upstream guarantees populated config — per registry.ts comment, `'ollama'` returns canonical name; safe choice)
- Add `import { getCanonicalFallback } from './registry.js'` to `profile.ts` (already imported in `embeddings.ts`)
- Create `.opencode/skills/system-spec-kit/shared/embeddings/profile.test.ts` with 6 invariants:
  1. `resolveActiveProfileModel('voyage')` with no env returns `'voyage-code-3'`
  2. `resolveActiveProfileModel('openai')` with no env returns `'text-embedding-3-small'`
  3. `resolveActiveProfileModel('ollama')` with no env returns `'nomic-embed-text-v1.5'` (canonical)
  4. `resolveActiveProfileModel('hf-local')` with no env returns `'nomic-ai/nomic-embed-text-v1.5'`
  5. Env override works: `process.env.HF_EMBEDDINGS_MODEL = 'custom-model'`; resolveActiveProfileModel returns `'custom-model'`
  6. Ban-list: `rg` against profile.ts source returns 0 hits for `'BAAI/bge-base-en'` and `'jina-embeddings-v3'`

### Out of Scope

- Modifying `resolveActiveProfileDim` (separate function; not in audit findings)
- Refactoring the switch statement structure (only the return values change)
- Touching cli-script callers of resolveActiveProfile (out of scope; the fix is at the resolver)
- Other phases' work (each phase ships independently)

### Files Changed

| File | Change |
|---|---|
| `shared/embeddings/profile.ts:185-197` | Modify (4 inline `||` fallbacks → `getCanonicalFallback(provider)`) |
| `shared/embeddings.ts:774` | Modify (delete dead-code `'jina-embeddings-v3'` literal) |
| `shared/embeddings/profile.test.ts` | Create (6-assertion invariant test) |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | All 4 inline `||` fallbacks in profile.ts:188-195 replaced with `getCanonicalFallback(provider)` |
| R2 | embeddings.ts:774 inline `'jina-embeddings-v3'` removed (replaced with `getCanonicalFallback('ollama')`) |
| R3 | New `import { getCanonicalFallback } from './registry.js'` in profile.ts |
| R4 | New `profile.test.ts` with 6 standalone assertions (matching shared/predicates/boolean-expr.test.ts convention) |
| R5 | `npm run typecheck:root` exit 0 |
| R6 | `node --experimental-vm-modules shared/dist/embeddings/profile.test.js` reports 6/6 ok, exit 0 |
| R7 | `rg -n "BAAI/bge-base|jina-embeddings-v3" shared/embeddings/profile.ts shared/embeddings.ts` returns 0 hits |
| R8 | Strict-validate this phase exits 0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1–R8 all pass.
- Re-running packet 021's audit (or equivalent grep) finds 0 of the 3 P0 sites remaining.
- ADR-014's intent (hf-local fallback = nomic) is now reflected in `profile.ts` as well as the main resolution chain.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

1. Read `profile.ts:185-200` + `embeddings.ts:770-780` to confirm context.
2. Apply 4 edits to `profile.ts` (replace each inline literal with `getCanonicalFallback(provider)`).
3. Apply 1 edit to `embeddings.ts:774`.
4. Add `import { getCanonicalFallback } from './registry.js'` to `profile.ts`.
5. Author `profile.test.ts` with 6 assertions.
6. Run typecheck + test + ban-list grep.
7. Strict-validate this phase.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Behavior change for CLI scripts**: Phase intentionally fixes the CONFIRMED ACTIVE bug — callers (checkpoint, ablation, eval) will now target nomic vector tables. This is the desired effect.
- **getCanonicalFallback dependency**: requires registry.ts shipped by packet 020. Verified present.
- **Test convention**: must match `shared/predicates/boolean-expr.test.ts` (no Vitest in `shared/`). Verified.

Dependencies:
- Packet 020 (`getCanonicalFallback` helper).
- ADR-014 (canonical hf-local fallback = nomic).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

(none — scope locked)
<!-- /ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 9. NON-FUNCTIONAL REQUIREMENTS

- **Performance**: `getCanonicalFallback` is O(1); zero runtime cost vs inline literal.
- **Reliability**: registry-derived; future ADR changes auto-propagate.
- **Observability**: existing callers continue to work; behavior change visible in CLI script output paths.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 10. EDGE CASES

- `getCanonicalFallback` throws `EmbedderNotConfiguredError` if MANIFESTS empty — protected by registry.test.ts invariants.
- env-var override (HF_EMBEDDINGS_MODEL etc.) still takes precedence over fallback — invariant R6 covers.
- ts-node / esm interop for the new test file — uses same `node --experimental-vm-modules` runner as sibling tests.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 11. COMPLEXITY

| Dimension | Score | Justification |
|---|---|---|
| LOC | ~10 lines modified + ~80 lines new test | Mechanical |
| Files | 2 modified + 1 new | Bounded |
| Behavior risk | Low (only fallback path; fix is intentional) | Tests prove |
| Total | **Low** | Bench-diff not required |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:cross-links -->
## 12. CROSS-LINKS

- **Parent arc**: `../spec.md`
- **Audit finding**: `../../021-hardcoded-default-audit-deep-research/research/research.md` § f-iter001-001 / 002 / 003
- **Helper**: `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` `getCanonicalFallback`
- **Test convention**: `.opencode/skills/system-spec-kit/shared/predicates/boolean-expr.test.ts`
- **Sibling test pattern**: `.opencode/skills/system-spec-kit/shared/embeddings/registry.test.ts` (shipped by packet 020)
<!-- /ANCHOR:cross-links -->
