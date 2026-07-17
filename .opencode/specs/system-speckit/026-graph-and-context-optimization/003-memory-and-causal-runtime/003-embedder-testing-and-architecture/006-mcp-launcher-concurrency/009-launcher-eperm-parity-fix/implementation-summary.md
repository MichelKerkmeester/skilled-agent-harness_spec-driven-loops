---
title: "Implementation Summary: Launcher EPERM Parity Fix"
description: "009 propagated skill-advisor's EPERM handler in leaseHeldFromFile to spec-memory + code-index launchers."
trigger_phrases:
  - "009 implementation summary"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/009-launcher-eperm-parity-fix"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 009 shipped"
    next_safe_action: "Arc 006 closed (again)"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "EPERM branch mirrors skill-advisor verbatim — RCA-confirmed pattern"
---
# Implementation Summary: Launcher EPERM Parity Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `009-launcher-eperm-parity-fix` |
| **Completed** | 2026-05-18 |
| **Level** | 1 |
| **Status** | Complete |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Two single-line additions (with one-line context comments) in `leaseHeldFromFile()`:

- `.opencode/bin/mk-spec-memory-launcher.cjs:141` — `if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };`
- `.opencode/bin/mk-code-index-launcher.cjs:175` — identical

Both byte-equivalent to skill-advisor's pattern at `mk-skill-advisor-launcher.cjs:171-180`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

### Patch shape

Before:
```js
} catch (error) {
  if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath };
  throw error;
}
```

After:
```js
} catch (error) {
  if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath };
  // 016/006/009: mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
  if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
  throw error;
}
```

No other changes. No new tests, no new files, no API changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Byte-mirror skill-advisor rather than reinvent**: the RCA explicitly named skill-advisor as the canonical pattern. Mirroring eliminates parity drift risk.
- **No new test in this packet**: the EPERM path requires cross-sandbox-PID setup that vitest can't easily reproduce. The 007 packet's spawn-three regression test already exercises the surrounding code with a known-good `EPERM` handler — the test still passes after this change (no regression). A dedicated `EPERM`-mock test is deferred to a future packet if the cross-launcher parity surface grows.
- **In-line code comment cites packet ID**: `// 016/006/009: mirror skill-advisor parity` — future maintainers grepping for the parity gap will find the rationale immediately.
- **Kept the comment short and informative**: one line, packet ID + reason. Per memory `feedback_skill_docs_no_phase_references` the skill docs themselves stay phase-free, but inline source comments are fine for citing the fixing packet.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `node --check .opencode/bin/mk-spec-memory-launcher.cjs` | exit 0 — SYNTAX OK |
| `node --check .opencode/bin/mk-code-index-launcher.cjs` | exit 0 — SYNTAX OK |
| `grep '016/006/009.*EPERM' .opencode/bin/mk-*-launcher.cjs` | 2 matches (one per launcher) |
| `validate.sh <009> --strict` | RESULT: PASSED (0/0) |
| Live verification | After running daemon restart, `/mcp` no longer reports `-32000` for `mk_code_index` or `mk-spec-memory` when a sandbox-foreign PID owns the lease |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- No new automated test added (see §4 KEY DECISIONS rationale).
- Does NOT address the secondary RCA findings:
  - Artifact freshness asymmetry (`mk-skill-advisor-launcher` checks `latestSourceMtimeMs`; the other two only check artifact existence) — leaves room for stale dist to be served. Track for a future cross-launcher hardening packet.
  - Stale copied shared dist under `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/embeddings/factory.js` (no `ollama` in SUPPORTED_PROVIDERS) — latent bug; not in the active code path today. Track separately.
- The RCA itself (`<arc>/005-cross-cutting-quality/005-cocoindex-install-hygiene/scratch/mcp-disconnect-rca.md`) was written by a parallel cli-codex dispatch — not co-authored on this packet's commit.
<!-- /ANCHOR:limitations -->
