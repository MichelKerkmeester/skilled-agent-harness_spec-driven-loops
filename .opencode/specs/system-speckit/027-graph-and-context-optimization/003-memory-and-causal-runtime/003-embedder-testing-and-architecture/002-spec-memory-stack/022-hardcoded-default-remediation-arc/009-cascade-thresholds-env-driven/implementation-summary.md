---
title: "Implementation Summary: 022/009"
description: "Cascade-probe constants now env-driven. 1 P1 closed."
trigger_phrases: ["022/009 shipped"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/009-cascade-thresholds-env-driven"
    last_updated_at: "2026-05-23T17:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped"
    next_safe_action: "Phase 005 dispatch"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002295"
      session_id: "016-002-022-009-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["1 P1 multi-site closed via 3-env-var wiring"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/009

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 1 |
| Typecheck | exit 0 |
| Findings closed | 1 P1 multi-site |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

`auto-select.ts:96-115` — replaced 3 inline `const DEFAULT_*_MS = NNNN` declarations with `parsePositiveInt(process.env.SPECKIT_CASCADE_*_MS, NNNN)` initializers. New `parsePositiveInt(value, fallback)` helper guards against non-numeric / negative / unset env values.

Env vars added:
- `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` (default 2500)
- `SPECKIT_CASCADE_LOCK_STALE_MS` (default 30000)
- `SPECKIT_CASCADE_SLEEP_MS` (default 25)
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Main-agent direct in parallel with 004b cli-opencode dispatch (background — which completed during this phase). ~5 min.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **3 not 6 thresholds.** Council estimated 6 based on plan text referencing "wait_ms/retry_count/hf_timeout" patterns that don't exist in current auto-select.ts. Investigation found 3 actual inline timing constants.
- **ENV_REFERENCE.md update deferred to arc convergence** — batch with SPECKIT_ADVISOR_* from 004b.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `npm run typecheck:root` → exit 0
- `grep SPECKIT_CASCADE_ auto-select.ts` → 3 hits
- Strict-validate phase 009 → exit 0
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- ENV_REFERENCE.md doesn't yet document the new vars (deferred to arc convergence).
- `parsePositiveInt` is duplicated with subprocess.ts:69 (similar helper); consolidation deferred.

### Commit Handoff

```
fix(022/009): wire 3 cascade-probe constants to env-var overrides

Closes 1 P1 multi-site audit finding. auto-select.ts:96-98 inline timing
constants (2500ms probe timeout, 30000ms lock stale, 25ms sleep) now accept
SPECKIT_CASCADE_PROBE_TIMEOUT_MS / SPECKIT_CASCADE_LOCK_STALE_MS /
SPECKIT_CASCADE_SLEEP_MS overrides. Defaults preserved; parsePositiveInt
helper guards against malformed env values.
```

Paths:

```
.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts
.opencode/specs/system-spec-kit/.../022-.../009-cascade-thresholds-env-driven/
```
<!-- /ANCHOR:limitations -->
