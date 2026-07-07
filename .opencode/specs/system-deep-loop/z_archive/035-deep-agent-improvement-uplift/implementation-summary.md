---
title: "Implementation Summary: Phase 4 M-3 mutation signature dedup in mutation-coverage.json"
description: "Adds sha256-based mutation signatures to mutation-coverage.json with dedup and bypass; updates reducer + SKILL.md + playbook per council §10.6"
trigger_phrases:
  - "110 phase 004-dai-uplift summary"
  - "deep-agent-improvement mutation signature dedup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/035-deep-agent-improvement-uplift"
    last_updated_at: "2026-05-16T13:00:00Z"
    last_updated_by: "cli-opencode-deepseek-v4-pro"
    recent_action: "implemented_M3_mutation_signature_dedup_reducer_playbook"
    next_safe_action: "packet_close_out"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-agent-improvement/SKILL.md"
      - ".opencode/skills/deep-agent-improvement/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md"
    session_dedup:
      fingerprint: "sha256:d729473fe6359a4fa409dd2cd25346e03a3c7f363dbfd590d2123120e34c1970"
      session_id: "2026-05-16-110-004-dai-uplift-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "M-3 signature: sha256(dimension + mutationType + targetSection + normalizedBody64)"
      - "Bypass: DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1"
      - "Skip reason format: EXHAUSTED-FROM: iter-NNN"
      - "Backward compat: records without signature fall back to dimension::mutationType"
      - "Reducer updated to prefer signature over dim::type key"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | `110/004-deep-agent-improvement-uplift` |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### mutation-coverage.cjs
- Added `require('node:crypto')` import
- Added `SKIP_DEDUP` constant: `process.env.DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP === '1'`
- Added `computeMutationSignature(mutation)` — sha256-based signature:
  ```
  sha256(dimension + "\u001f" + mutationType + "\u001f" + targetSection + "\u001f" + normalizedBody64)
  ```
  Where `normalizedBody64` = whitespace-collapsed, lowercased, first 64 chars of body
- Updated `recordMutation()` to compute and store `signature` on every entry; returns signature
- Updated `markExhausted()` to accept optional `options.signature` and `options.reason`
- Added `isSignatureSeen(coveragePath, signature)` — scans `mutations[]` and `exhausted[]` for matching signature; respects `SKIP_DEDUP` bypass; returns `{ seen, reason }`
- Exported new symbols: `SKIP_DEDUP`, `computeMutationSignature`, `isSignatureSeen`

### reduce-state.cjs
- Updated `buildMutationCoverageKey()` to prefer `entry.signature` when available (richer dedup)
- Falls back to `dimension::mutationType` for legacy records without signature field
- No other changes; all existing consumer paths continue to work

### SKILL.md
- Extended "Mutation Coverage Graph" section with:
  - Signature computation formula
  - Dedup behavior: `isSignatureSeen()` pre-checks before proposing mutations
  - `EXHAUSTED-FROM: iter-NNN` skip reason format
  - `DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1` bypass documentation
  - Backward compatibility note for legacy records
  - Authoritative storage in `mutation-coverage.json`

### 034-replay-consumer.md (playbook)
- Added **§6 M-3 SIGNATURE DEDUP SMOKE TEST (Packet 110)** with:
  - Smoke test scenario verifying dedup and bypass behavior
  - Exact command sequence for disposable runtime validation
  - Expected signals and pass/fail criteria

### Smoke test results
- `node --check` pass for both .cjs files
- Runtime smoke test:
  - `computeMutationSignature()` produces stable deterministic hashes
  - `isSignatureSeen()` correctly detects duplicate signatures (`seen: true`)
  - `DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1` bypass returns `seen: false`
  - `markExhausted()` accepts `signature` and `reason` options
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- 4 files edited via exact string matching
- Syntax verification: `node --check` on both .cjs files
- Runtime smoke test: `node -e` verifying signature compute, record, dedup, and bypass
- Single commit on `main` branch
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Signature includes `targetSection`**: Per council §10.6 and Skeptic seat — must not erase target-section distinctions when deduplicating
2. **Signature lives in `mutation-coverage.json`**: Per council §10.6 directive to name the correct artifact boundary; this is the authoritative store for mutation tracking
3. **`isSignatureSeen()` scans both arrays**: Mutations can be in `mutations[]` (tried) or `exhausted[]` (exhausted); both must be checked to prevent re-proposal
4. **Bypass at the check level, not the record level**: `SKIP_DEDUP=1` affects `isSignatureSeen()` only — mutations are still recorded with signatures even when bypass is active, ensuring future runs have the full history
5. **Reducer graceful degradation**: When signature is absent (legacy records), `buildMutationCoverageKey()` falls back to `dimension::mutationType` — existing behavior preserved
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/089-auto-review-stretch-config-dedup-gates/004-deep-agent-improvement-uplift --strict` — exit 0
- `node --check mutation-coverage.cjs` — exit 0
- `node --check reduce-state.cjs` — exit 0
- Runtime smoke: `isSignatureSeen` detects duplicates correctly
- Runtime smoke: `SKIP_DEDUP=1` bypass works
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Signature uses first 64 chars of body — very similar mutations with differences beyond 64 chars may collide (mitigated by `targetSection` field uniqueness)
- No signature migration — legacy entries in existing `mutation-coverage.json` files will use the fallback `dimension::mutationType` key until re-recorded
- Playbook smoke test requires a disposable temp file; not run automatically in CI
<!-- /ANCHOR:limitations -->
