---
title: "Checklist: 016/002/020 Embedder Default Drift Fix"
description: "8 P0 verification checks (all complete)."
trigger_phrases:
  - "020 checklist verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix"
    last_updated_at: "2026-05-23T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "All checklist items verified"
    next_safe_action: "n/a"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000020a4"
      session_id: "016-002-020-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 9 sections complete with evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Checklist: 016/002/020 Embedder Default Drift Fix

<!-- ANCHOR:protocol -->
## 1. VERIFICATION PROTOCOL

Each check below references a task from `tasks.md` (T###) and a requirement from `spec.md` (R##). Evidence is either a command + exit code, a file:line citation, or a test assertion outcome.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## 2. PRE-IMPLEMENTATION

- [x] CHK-001 [P0] 5 hardcoded-default sites confirmed via grep before edits. Evidence: T001 — `rg "DEFAULT.*['\"]BAAI/bge-base|DEFAULT.*['\"]jina-embeddings-v3"` returned 5 hits across the listed files.
- [x] CHK-002 [P0] Registry MANIFESTS[0] is `nomic-embed-text-v1.5` per ADR-013/014. Evidence: T001 — `registry.ts:24-33` shows MANIFESTS opens with this entry.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## 3. CODE QUALITY

- [x] CHK-003 [P0] `getCanonicalFallback()` exported from `shared/embeddings/registry.ts`. Evidence: T003/T004 — `rg "export function getCanonicalFallback" .../registry.ts` returns the helper signature.
- [x] CHK-004 [P0] All 5 sites refactored — call `getCanonicalFallback` and import it. Evidence: T005–T009 — 5 file edits visible in git diff; `rg "getCanonicalFallback" .opencode/skills/system-spec-kit/` returns 7 matches (1 export + 5 callers + 1 test).
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## 4. TESTING

- [x] CHK-005 [P0] `npm run typecheck:root` exit code = 0. Evidence: T011 — clean stdout, no compile errors.
- [x] CHK-006 [P0] `registry.test.ts` 23/23 invariant assertions pass. Evidence: T010/T012 — stdout shows 23 `ok:` lines, 0 `FAIL:` lines, exit code 0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## 5. FIX COMPLETENESS

- [x] CHK-007 [P0] `rg "DEFAULT.*['\"]BAAI/bge-base"` in `.opencode/skills/system-spec-kit/` returns 0 hits. Evidence: T013 — command post-edit returns exit code 1 (rg signals "no matches").
- [x] CHK-008 [P0] `rg "DEFAULT.*['\"]jina-embeddings-v3"` in `.opencode/skills/system-spec-kit/` returns 0 hits. Evidence: T014 — ollama.ts:14 bug cleared.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## 6. SECURITY

- [x] CHK-009 [P0] No new external surface introduced (helper is internal to spec-memory). No new credentials, no new network paths. Evidence: helper signature is `(provider: CanonicalProvider) => string` — pure function over compile-time constants.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## 7. DOCUMENTATION

- [x] CHK-010 [P0] spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, decision-record.md all present with canonical anchors. Evidence: this packet's directory listing.
- [x] CHK-011 [P0] ADR-001/002/003 captured in decision-record.md. Evidence: file present + anchored.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## 8. FILE ORGANIZATION

- [x] CHK-012 [P0] Helper lives in `registry.ts` alongside the MANIFESTS it derives from. Test lives in the same directory.
- [x] CHK-013 [P0] No new dependencies added (no Vitest, no JSON config files). Test uses existing standalone-assertion pattern.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## 9. VERIFICATION SUMMARY

13 of 13 P0 checks pass. Packet ready for parent-arc strict-validate + commit.
<!-- /ANCHOR:summary -->
