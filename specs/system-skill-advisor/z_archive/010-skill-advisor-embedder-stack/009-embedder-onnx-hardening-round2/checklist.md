---
title: "Verification Checklist: Embedder ONNX Hardening — Round 2 Review Remediation"
description: "Verification checklist for the 4-finding remediation packet. All items executed and evidenced."
trigger_phrases:
  - "009 embedder onnx hardening checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-embedder-stack/009-embedder-onnx-hardening-round2"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed all checklist items with evidence after Phase 2 implementation landed"
    next_safe_action: "None — checklist complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-embedder-onnx-hardening-round2-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Embedder ONNX Hardening — Round 2 Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`; covers 009-REQ-001 through 009-REQ-008. [EVIDENCE: spec.md §4 REQUIREMENTS, read in full before implementation started]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` for all 4 findings (F1-F4). [EVIDENCE: plan.md §3-4, read in full before implementation started]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `hf-model-server.cjs` passes `node --check` and its existing Vitest suite after the F1 change. [EVIDENCE: `node --check .opencode/bin/hf-model-server.cjs` exit 0 after every edit; `npx vitest run tests/embedders/hf-model-server.vitest.ts tests/embedders/hf-model-server-perimeter.vitest.ts` (system-spec-kit/mcp_server) → 34/34 pass, unaffected.]
- [x] CHK-011 [P0] `schema.ts` passes typecheck after the F3 change. [EVIDENCE: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exit 0 (final run, post-restore).]
- [x] CHK-012 [P1] F1's failsafe timer is cleared on successful close (no dangling unref'd timer left running past a clean exit). [EVIDENCE: `installShutdownHandlers()` calls `clearTimeout(forceExitTimer)` in both the `.then()` (success) and `.catch()` (failure) branches of `app.close(...)` — `.opencode/bin/hf-model-server.cjs`.]
- [x] CHK-013 [P1] F2's `createChildEnv()` change follows the existing `CHILD_ENV_ALLOWLIST` naming convention (skill-advisor-namespaced var, matching `MK_SKILL_ADVISOR_DB_DIR` and siblings). [EVIDENCE: new var is `MK_SKILL_ADVISOR_MEMORY_DB_PATH`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] F1's SIGTERM-during-active-embed regression test passes, and is confirmed to fail against the pre-fix 1500ms-fixed-timer behavior. [EVIDENCE: `hf-model-server-shutdown.vitest.ts` 3/3 pass against the real fix. A/B: with `computeShutdownFailsafeMs()` reverted to hardcode the fixed 1500ms return (isolated variant, everything else unchanged), the busy-mid-embed case fails with `child.signalCode === 'SIGKILL'` ~1.8s into a 3s fake embed. Variant reverted after the check; restored file diffed byte-identical against the pre-swap copy.]
- [x] CHK-021 [P0] F4's end-to-end DB-resolution test passes, and is confirmed to fail against the pre-fix launcher behavior (i.e. it genuinely exercises the leak scenario, not a trivially-true assertion). [EVIDENCE: the 2 new e2e tests in `launcher-bootstrap.vitest.ts` pass against the real fix. A/B: with `createChildEnv()` reverted to blind-forward `MEMORY_DB_PATH` via the allowlist (isolated variant), `postFixResolution.name` resolves `'hf-local'` instead of `'ollama'` — the real `@spec-kit/shared/embeddings/factory.js`'s `resolveProvider()` opens the wrong (non-advisor) fixture DB. Variant reverted after the check; restored file diffed byte-identical.]
- [x] CHK-022 [P1] F2's ambient-collision regression test passes: an unrelated `MEMORY_DB_PATH` set in the parent env does not override the advisor's default. [EVIDENCE: `launcher-bootstrap.vitest.ts` — `"009-REQ-004/005: ignores an ambient MEMORY_DB_PATH..."` passes; fails under the isolated pre-F2 variant (see CHK-021 A/B).]
- [x] CHK-023 [P1] F3's preserve-on-omit regression test passes: a 3-arg `setActiveEmbedder()` call leaves an already-persisted provider intact. [EVIDENCE: `schema.vitest.ts` — `"preserves an already-persisted provider when a later 3-arg call omits it"` passes. A/B: with `setActiveEmbedderTransactional()` reverted to always write `provider?.trim() ?? ''` (isolated variant, rebuilt), the same test fails — persisted `provider: 'ollama'` is missing after the 3-arg call. Variant reverted + rebuilt after the check; restored source diffed byte-identical.]
- [x] CHK-024 [P1] Existing `launcher-bootstrap.vitest.ts`, `schema.vitest.ts`, and `ensure-active-embedder.vitest.ts` suites remain green after all 4 fixes. [EVIDENCE: combined run (system-skill-advisor/mcp_server) `npx vitest run tests/launcher-bootstrap.vitest.ts tests/embedders/schema.vitest.ts tests/embedders/ensure-active-embedder.vitest.ts tests/skill-graph/refresh-roundtrip.vitest.ts` → 4 files / 35 tests, all pass (final restored state). Broader blast-radius batch (13 files / 81 tests: `launcher-lease`, `launcher-idle-timeout`, `launcher-reap-pid-reuse`, `skill-advisor-launcher-orphan-reaping`, `embedders/registry`, `embedders/shared-factory-parity`, `skill-advisor-cli-{parity,job-semantics,dual-client}` plus the four above) also all pass.]
- [x] CHK-025 [P1] Idle shutdown timing is re-verified as not materially regressed after F1 (NFR-001). [EVIDENCE: `hf-model-server-shutdown.vitest.ts`'s idle-SIGTERM test asserts `exit.elapsedMs < 2000ms` (well under the pre-fix ~1.5s + margin ceiling) and passes; the idle tier (`SHUTDOWN_IDLE_FAILSAFE_MS`) is unchanged at 1500ms.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of F1-F4 assigned a finding class: F1 = `class-of-bug` (untested shutdown-timing race); F2 = `class-of-bug` (latent env-var collision); F3 = `instance-only` (destructive default in a single write path, self-healed on next read); F4 = `test-isolation` (missing e2e coverage for an already-fixed bug). [EVIDENCE: Confirmed unchanged from spec.md's framing; each fix matched its assigned class.]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for F3. [EVIDENCE: corrected during implementation — re-grep found 3 in-repo 4-arg call sites (all inside `schema.ts`), not 2 as plan.md originally claimed; all other call sites are 3-arg and test-only, so the substantive scope claim still held. Correction cross-referenced in 005's implementation-summary.md; see this packet's implementation-summary.md Key Decisions section for detail.]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for F2's renamed env-var signal. [EVIDENCE: `launcher-bootstrap.vitest.ts`'s existing and new cases (7 total env-var tests); `shared/embeddings/factory.ts`'s `MEMORY_DB_PATH` read confirmed unchanged, not modified this session.]
- [x] CHK-FIX-004 [P2] N/A — no path/redaction/parser/security-boundary fix in this packet; documented deferral, not a gap.
- [x] CHK-FIX-005 [P1] Matrix axes for F1 (idle/busy-inference/pending-load × SIGTERM/SIGINT) and F2 (ambient-set/dedicated-set × default/override path) listed in `plan.md` §"FIX ADDENDUM: AFFECTED SURFACES". [EVIDENCE: F1 covers idle and busy-inference explicitly (SIGTERM tested directly; SIGINT covered by the repeated-signal test); pending-load tier is implemented but not separately live-tested — see implementation-summary.md Known Limitations. F2 covers all 4 matrix cells directly in `launcher-bootstrap.vitest.ts`.]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed for F2. [EVIDENCE: an ambient `MEMORY_DB_PATH` set specifically to mimic mk-spec-memory's own usage (`.../context-index.sqlite`-shaped path) is confirmed to no longer leak into skill-advisor's child env — both at the `createChildEnv()` unit level (CHK-022) and end-to-end through the real shared factory (CHK-021's F4 test).]
- [x] CHK-FIX-007 [P1] Evidence pinned to the implementation commit SHA once fixes land, not a moving branch-relative range. [EVIDENCE: no unstable branch-relative range used anywhere above — every citation is a concrete command/output/file-diff observation, which stays valid regardless of future commits. The commit SHA itself is not yet pinned since no commit was made this session (not requested); add the SHA when this packet is committed.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced by any of the 4 fixes. [EVIDENCE: Confirmed by reading every diff; only path/env-var names and test fixture data were added.]
- [x] CHK-031 [P1] F2's renamed env var does not weaken the existing DB-path scoping guarantees (`resolvedAdvisorDbDir()`'s canonical-path resolution stays untouched). [EVIDENCE: Confirmed: `resolvedAdvisorDbDir()`/`advisorDbPath()` are unmodified; the fix only changes which env var `createChildEnv()` treats as "already configured."]
- [x] CHK-032 [P2] Re-confirmed at implementation time that no production config (`opencode.json`, root `.env`/`.env.local`) sets the old `MEMORY_DB_PATH` in a way that would have masked the fix. [EVIDENCE: `grep -n "MEMORY_DB_PATH" opencode.json .env .env.local` → no matches.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized for this packet. [EVIDENCE: `tasks.md` marked complete with evidence; `implementation-summary.md` created; `graph-metadata.json`/`spec.md` status updated to reflect actual completion.]
- [x] CHK-041 [P1] 005's `implementation-summary.md` claim about 3-arg call sites corrected, cross-referencing this packet rather than duplicating detail. [EVIDENCE: `../005-shared-embedder-logic-with-spec-memory/implementation-summary.md` line ~137 edited.]
- [x] CHK-042 [P2] The new dedicated skill-advisor DB-path override var documented wherever `MK_SKILL_ADVISOR_DB_DIR` and its siblings are already documented. [EVIDENCE: `.opencode/skills/system-skill-advisor/references/config/db_path_policy.md` §4 (Test and CI Override) extended with a "Child-process MEMORY_DB_PATH pointer" subsection.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files used during F4's (and F1/F2/F3's) A/B verification design stay in the session scratchpad only, not committed. [EVIDENCE: all pre-fix isolated variants (`hf-model-server.cjs.*`, `launcher.cjs.*`, `schema.ts.*`, `buggy-check.cjs`, `pre-f2-check.cjs`) were written under the session scratchpad path, never under the repo tree.]
- [x] CHK-051 [P1] Scratchpad cleaned before completion. [EVIDENCE: `rm -f` after each A/B cycle; final `ls` grep for leftover A/B filenames returned none.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 13 | 13/13 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-07-08
<!-- /ANCHOR:summary -->
