---
title: "Implementation Summary: 098/004 - hooks resolver tighten"
description: "Test-only-gated SPECKIT_GENERATE_CONTEXT_SCRIPT env override in Claude Stop hook; deferred resolver realpath containment per P1-005 downgrade rationale."
trigger_phrases:
  - "098/004 implementation"
  - "hooks resolver tighten summary"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/004-hooks-resolver-tighten"
    last_updated_at: "2026-05-07T19:05:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 004 complete: P1-006 hardened; P1-005 deferred per downgrade rationale"
    next_safe_action: "Move to Phase 005 (checklist evidence backfill)"
    blockers:
          - "P1-005 (downgraded P2): resolver realpath containment in review-research-paths.cjs (advisory follow-on; blocked by test-fixture refactor)"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 098/004 - hooks resolver tighten

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/004-hooks-resolver-tighten` |
| **Completed** | 2026-05-07 |
| **Level** | 2 |
| **Findings resolved** | P1-006 (hardened); P1-005 (P2 downgrade — deferred to follow-on, see §Limitations) |
| **Actual Effort** | ~5 minutes wall-clock |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**P1-006 fix (Claude Stop hook env override hardening)**: `mcp_server/hooks/claude/session-stop.ts:38-59` previously accepted `SPECKIT_GENERATE_CONTEXT_SCRIPT` as the first candidate in the autosave script resolution order without any environment gating. A malformed or hostile env var could redirect autosave script execution before workflow path resolution.

Tightened to a test-only override: the env var is now honored ONLY when `NODE_ENV === 'test'` OR `SPECKIT_TEST === 'true'`. In production runtime, the override is silently ignored and the resolver falls through to the canonical relative-path candidates rooted at `HOOK_DIR`.

```typescript
const isTestMode =
  process.env.NODE_ENV === 'test' || process.env.SPECKIT_TEST === 'true';
const explicitPath = isTestMode
  ? process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT
  : undefined;
```

Rebuilt `dist/hooks/claude/session-stop.js` via `npm run build`; dist matches source.

### Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38-50` | Modified | Test-only gate around `SPECKIT_GENERATE_CONTEXT_SCRIPT` env override; production path ignores the env var |
| `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js` | Regenerated | `tsc --build` rebuilt the dist counterpart (gitignored) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The remediation steps for this phase are described in §What Was Built above. The sequence
followed the spec in plan.md (Setup → Implementation → Verification phases). All edits used
direct Edit/Write tooling (see project memory: "prefer direct sed/Edit for mechanical work").
Verification ran `validate.sh --strict` on this packet plus adjacent packets; smoke tests
ran where applicable (see §Verification table).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Gate env var to test-only mode rather than removing it entirely | Preserves the test ergonomics that originally introduced the override (test fixtures can still inject custom scripts); production path is hardened |
| Trust `NODE_ENV='test'` AND `SPECKIT_TEST='true'` (either) | Vitest runs typically set `NODE_ENV=test` automatically; explicit `SPECKIT_TEST` provides an opt-in for ad hoc test scripts |
| Defer P1-005 resolver realpath containment | The deep-review report downgraded P1-005 to P2 in iter-6 after the attack matrix showed no actual exploit (defense-in-depth only). Resolver tightening also risks breaking the existing `/tmp` test fixture pattern in `review-research-paths.vitest.ts` (uses `os.tmpdir()` paths that don't contain `/specs/`). Treated as advisory follow-on |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Source file edit landed | Pass | `grep 'isTestMode' session-stop.ts` returns 2 hits |
| `npm run build` succeeds | Pass | `tsc --build` exit 0; no TS errors |
| dist/ regenerated correctly | Pass | `dist/hooks/claude/session-stop.js` shows the new `isTestMode` gate |
| Production path ignores env | Pass | When `NODE_ENV !== 'test'` and `SPECKIT_TEST !== 'true'`, `explicitPath` is `undefined` → not added to candidates |
| Test path honors env | Pass (by inspection) | When either gate is set, `explicitPath = process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| NFR-P01 | Build < 60s | ~5 s | Pass |
| NFR-S01 | Reduce env-script execution attack surface | Reduced: production path no longer honors arbitrary env-supplied paths | Pass |
| NFR-R01 | Edits idempotent | Re-running `npm run build` produces no further diff | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P1-005 (downgraded P2) deferred**: deep-loop artifact resolver realpath containment in `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`. The deep-review's iter-6 attack matrix showed no actual exploit (downgraded to P2 with defense-in-depth-only rationale). The existing test fixture in `review-research-paths.vitest.ts:59` uses `os.tmpdir()` paths that don't contain a `/specs/` segment, so a strict containment check would break legitimate tests. Defer to a follow-on packet that can rework the test fixture alongside the production hardening.
2. **No new attack-matrix tests added**: P1-006's test coverage relies on the existing `settings-driven-invocation-parity.vitest.ts` regression suite to catch behavioral change in the hook command anchoring. A dedicated `session-stop-env-gate.vitest.ts` adversarial test fixture would close the loop more emphatically; tracked as advisory.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Address both P1-006 and P1-005 in Phase 004 | Addressed P1-006; deferred P1-005 to advisory follow-on | P1-005 downgraded to P2 in deep-review iter-6; resolver tightening risks breaking existing test fixtures; out-of-scope per "allow tests" plan caveat |
<!-- /ANCHOR:deviations -->

---

## Followups

- **P1-005 resolver realpath containment** (advisory; downgraded P2): rework `resolveArtifactRoot()` in `review-research-paths.cjs` to verify resolved `specFolder` resolves under a canonical `/specs/` root. Coordinate with `review-research-paths.vitest.ts` test-fixture refactor (`os.tmpdir()` paths need a `/specs/` segment under the workspace root).
- **Adversarial test fixture for P1-006** (advisory): add `session-stop-env-gate.vitest.ts` proving (a) hostile env vars are ignored without `NODE_ENV=test`, (b) test-mode honors the override, (c) gating cannot be bypassed by partial test mode markers.
