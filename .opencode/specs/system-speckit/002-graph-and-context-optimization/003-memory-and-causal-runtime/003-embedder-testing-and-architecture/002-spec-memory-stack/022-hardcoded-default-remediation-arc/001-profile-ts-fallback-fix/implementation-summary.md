---
title: "Implementation Summary: 022/001 profile.ts Fallback Fix"
description: "Closed 3 P0 audit findings (f-iter001-001/002/003) via getCanonicalFallback() replacement in profile.ts + embeddings.ts + new profile.test.ts."
trigger_phrases:
  - "022/001 shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix"
    last_updated_at: "2026-05-23T15:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 001 shipped — 3 P0 closed + 7-invariant test"
    next_safe_action: "Scaffold + ship phase 002 (CocoIndex doc drift resync)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.test.ts"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022b5"
      session_id: "016-002-022-001-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 001 closed 3 P0 + bonus consistency on voyage/openai inline literals (now also registry-derived)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/001 profile.ts Fallback Fix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 2 modified + 1 new test + 4 spec docs |
| Tests added | 1 (`profile.test.ts`, 7 assertions) |
| Tests passing | 7/7 |
| Typecheck | exit 0 |
| Audit findings closed | f-iter001-001 (BAAI ACTIVE), f-iter001-002 (jina LATENT), f-iter001-003 (embeddings.ts:774 DEAD) |
| Bonus findings closed | voyage + openai inline literals in profile.ts + embeddings.ts (consistency cleanup) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### `shared/embeddings/profile.ts`

- Added `import { getCanonicalFallback, type CanonicalProvider } from './registry.js'`
- Replaced 4 inline `||` switch-case literals in `resolveActiveProfileModel`:
  - voyage: `'voyage-code-3'` → `getCanonicalFallback('voyage')`
  - openai: `'text-embedding-3-small'` → `getCanonicalFallback('openai')`
  - ollama: `'jina-embeddings-v3'` → `getCanonicalFallback('ollama')` **[ADR-013/014 alignment]**
  - hf-local: `'BAAI/bge-base-en-v1.5'` → `getCanonicalFallback('hf-local')` **[CONFIRMED ACTIVE BUG FIX]**
- Added historical-context comment block citing the audit packet + ADR.

### `shared/embeddings.ts:detectConfiguredModelName`

- Replaced 3 inline `||` switch-case literals:
  - voyage: `'voyage-code-3'` → `getCanonicalFallback('voyage')`
  - openai: `'text-embedding-3-small'` → `getCanonicalFallback('openai')`
  - ollama: `'jina-embeddings-v3'` → `getCanonicalFallback('ollama')` **[DEAD CODE REMOVAL]**
- hf-local branch unchanged (already used `DEFAULT_MODEL_NAME` via packet 020).

### `shared/embeddings/profile.test.ts` (NEW)

7 standalone-assertion invariants:
- 3 ban-list checks (code-only, skip comments): no inline BAAI literal, no inline jina literal, all 4 providers use getCanonicalFallback
- 4 behavioral checks: each provider returns canonical value via getCanonicalFallback (voyage-code-3, text-embedding-3-small, nomic-embed-text-v1.5, nomic-ai/nomic-embed-text-v1.5)
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Main-agent direct execution (skipped cli-devin dispatch per scope-vs-overhead judgment; precedent: Phase A of earlier embedder-fix arc). ~20 minutes wall-clock total:

1. Read context windows (profile.ts:185-200 + embeddings.ts:770-780)
2. 3 Edit calls (profile.ts import + profile.ts switch block + embeddings.ts switch block)
3. 1 Write call (profile.test.ts)
4. typecheck + test runner verification
5. Spec docs authored post-execution per phase contract

The choice to use direct Edit over cli-devin dispatch follows memory `feedback_cli_dispatch_unreliability.md`: 5-line edit + 80-line test file is below the dispatch-overhead break-even.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Bonus consistency on voyage + openai literals**: Audit only flagged the BAAI + jina cases as P0. The voyage + openai literals were coincidentally-canonical. I wired them through `getCanonicalFallback` anyway because the function now derives all 4 providers from registry, making the pattern uniform and reducing future drift surface.
- **Executor: main agent direct** (not cli-devin). Per memory + scope analysis. See §3.
- **Test convention: standalone assertions** (no Vitest in shared/) per existing pattern.
- **Comment-aware ban-list regex**: test scans code-only (strips `//` and `/* */`) so historical-context comments referencing the old literals don't trigger false positives.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `npm run typecheck:root` → exit 0
- `node --experimental-vm-modules shared/dist/embeddings/profile.test.js` → 7/7 ok
- `rg "BAAI/bge-base-en|jina-embeddings-v3" shared/embeddings/profile.ts shared/embeddings.ts` → only comments + dim-lookups (legitimate)
- `rg "getCanonicalFallback" shared/embeddings/profile.ts shared/embeddings.ts` → 10 hits (5 per file: 1 import + 4 fallback callsites)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- Dim-lookup at `profile.ts:225` still references `'BAAI/bge-base-en-v1.5'` as a model identifier in a registered-model→dim lookup. This is NOT a default fallback; it's a backward-compatibility lookup for callers that manually specify BAAI. Per the audit verdict, this is legitimate and out of scope.
- Comment block at `profile.ts:188-189` historically references the old literals (now removed). Intentional — provides audit-trail context for future maintainers.
- `profile.ts:133` retains `'jina-embeddings-v3': 1024` in a dim-map registered-model lookup. Same reasoning as above — legitimate dim registry, not a fallback.

### Commit Handoff

Suggested message:

```
fix(022/001): replace profile.ts + embeddings.ts inline pipe-pipe fallbacks with getCanonicalFallback

Closes 3 P0 audit findings from packet 021:
- f-iter001-001: profile.ts:195 BAAI hf-local CONFIRMED ACTIVE (CLI scripts now target nomic)
- f-iter001-002: profile.ts:192 jina ollama LATENT
- f-iter001-003: embeddings.ts:774 jina ollama DEAD CODE

Also wired voyage/openai inline literals to getCanonicalFallback for consistency.
New profile.test.ts adds 7 standalone-assertion invariants (3 ban-list + 4 behavioral).
```

Suggested explicit paths:

```
.opencode/skills/system-spec-kit/shared/embeddings/profile.ts
.opencode/skills/system-spec-kit/shared/embeddings.ts
.opencode/skills/system-spec-kit/shared/embeddings/profile.test.ts
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/description.json
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/graph-metadata.json
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix/
```
<!-- /ANCHOR:limitations -->
