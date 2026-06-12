---
title: "Implementation Summary: Deep-Research Remediation Program [template:level_1/implementation-summary.md]"
description: "Progressive summary of the 029 remediation program: L1 security (single-writer DB lock, fail-closed CLI scrubbing, fingerprint redaction, truthful catalog) and L8 adherence (probe-harness artifact resolved, --command protocol codified) are shipped and Fable-verified; L2–L9 remain."
trigger_phrases:
  - "029 implementation summary"
  - "remediation program summary"
  - "single writer lock summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation"
    last_updated_at: "2026-06-12T21:15:00Z"
    last_updated_by: "claude-fable-orchestrator"
    recent_action: "Waves 4-6 committed+pushed (~178 closed); wave 7 in Fable verify"
    next_safe_action: "Wave-7 verdicts then commit; queue: L7 clusters, L2 four, L5 carefuls"
    blockers: []
    key_files:
      - "L5-advisor-correctness/disposition.md"
      - "L6-save-continuity-truth/disposition.md"
      - "L9-pxx-sweep/disposition.md"
    session_dedup:
      fingerprint: "sha256:2003d4aca44bb943b1eae69b36f1d9ebe8fe3f8a5e907a323dbee96013ac03b3"
      session_id: "029-remediation-resume-2026-06-12"
      parent_session_id: null
    completion_pct: 73
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-deep-research-remediation |
| **Completed** | In progress (L1 + L8 lanes complete 2026-06-12) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two highest-risk lanes of the 198-finding backlog are closed, and the database can no longer be corrupted by a second writer — the failure that destroyed it three times.

### Single-writer kernel lock at DB-open (live-237)

Every writer of `context-index.sqlite` now acquires a kernel fcntl lock (a sidecar SQLite opened EXCLUSIVE and written once inside BEGIN IMMEDIATE) before better-sqlite3 opens the main database. The lock self-releases on any process death including SIGKILL, can never be released by a non-holder, and never depends on file presence — the stale-lock and ABA failure modes of file leases are structurally impossible. A losing cold-spawned daemon exits with code 86 and its launcher bridges to the live owner instead of crash-looping; six standalone maintenance scripts (including the checkpoint copy/swap windows) adopt the same lock through a new public api surface.

### Fail-closed CLI save-lane scrubbing (tri-016)

The secret scrubber now lives in `@spec-kit/shared` as the single source of truth (promoted byte-identical), and the standalone generate-context save lane scrubs every composed payload field — slug, filename, title, description, and the full session/collected-data trees — before anything persists. A scrubber failure aborts the save.

### Telemetry and documentation truth (tri-050, tri-005)

Query fingerprints are hash-only (the old format persisted raw 8-char query prefixes; 204 legacy rows purged at daemon init), and the write-ingress protection claims are reconciled across the feature catalog and both 022 packet docs, including an honest note naming the prediction-error and reconsolidation paths that do not yet consult `source_kind`.

### Dashboard render-contract true solution (L8)

A fresh investigation proved the celebrated 3/3 envelope "failure" was a measurement artifact: `opencode run "/memory:search …"` never invokes the command runtime, so the contract never reached the model. Dispatched correctly (`opencode run --command memory/search`), gpt-5.5 medium emits the exact envelope 3/3 — independently re-verified by the host with a fresh gauntlet plus a negative control. The dispatch rule is codified in the cli-opencode skill, a canonical probe script guards against regression, and ten routers lost a stale `{{args}}` placeholder that was being injected literally.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/db-instance-lock.ts` (+ api/db-lock.ts, store/types/context-server wiring) | Created/Modified | Single-writer kernel lock + exit-86 contract |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Exit-86 bridge/retry decision (self-lease guard) |
| `shared/parsing/secret-scrubber.ts` (+ mcp_server re-export, `scripts/core/workflow.ts`) | Created/Modified | Fail-closed CLI save-lane scrubbing |
| `mcp_server/lib/telemetry/consumption-logger.ts` | Modified | Hash-only fingerprints + legacy purge |
| `feature_catalog.md`, 022 `spec.md` + `implementation-summary.md` | Modified | Truthful write-ingress claims |
| `cli-opencode/SKILL.md`, `references/cli_reference.md`, `commands/**` | Modified | `--command` dispatch rule, score slot, placeholder sweep |
| 6 standalone DB-opener scripts | Modified | Lock adoption |
| `tests/db-instance-lock.vitest.ts`, `tests/launcher-db-lock-exit.vitest.ts` + 3 updated suites | Created/Modified | Lock semantics, exit-86 decisions, purge + hash-only assertions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every fix passed an adversarial Fable verification against its original proof before its scoped commit — two verdicts came back INCOMPLETE (a launcher self-bridge defect; an unpurged legacy-row leak plus a doc contradiction) and both gaps were closed exactly as prescribed before landing. Deployment used transparent daemon recycles; live verification confirmed the lock refuses a real second daemon (exit 86 naming the holder), the legacy fingerprint rows are gone, and the DB serves healthy.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| SQLite sidecar EXCLUSIVE connection as the lock primitive | Kernel releases it at process death — no stale state, no ABA reclaim race, no new dependency; the failure modes that burned the file-lease design cannot recur. |
| Lock default-ON with `SPECKIT_DB_LOCK_DISABLE=1` kill switch | Three real corruptions outweigh wedge risk the primitive already eliminates by construction. |
| Scrubber promoted to `@spec-kit/shared` instead of exporting mcp_server internals | scripts/ cannot resolve mcp_server lib paths at runtime and the import-policy guard forbids them; shared resolves everywhere. |
| L8 winner is a protocol fix, not R7/R8 | The contract was never delivered by the probe harness; both "real levers" lint artifacts or add prose and would have shipped into a fourth false failure. |
| Hash-only fingerprints with legacy purge | Any retained query substring IS retained query content; rows are disposable telemetry per the module's own precedent. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| db-instance-lock + launcher exit-86 suites | PASS 13/13 (cross-process refusal, SIGKILL self-release, lease-wipe guard, store integration, decision matrix) |
| Affected regression suites (checkpoints, consumption, scrubber, launcher lifecycle) | PASS 96/96 + 97/97 after purge |
| Live second-daemon refusal | PASS — exit 86, message names live holder pid |
| Live legacy-fingerprint purge | PASS — 0 prefix rows post-recycle |
| Planted-secret CLI smoke | PASS — anthropic key, github token, credential assignment all redacted with warnings |
| L8 envelope gauntlet (gpt-5.5 medium, bare args) | PASS 3/3 + negative control fails as expected |
| Fable adversarial verdicts | tri-016 CLOSED; live-237 INCOMPLETE→fixed-as-prescribed; tri-050/tri-005 INCOMPLETE→gaps closed in-commit |
| Packet strict validation | PASS after this docs backfill (was missing Level-1 required files from packet creation) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Launcher `.cjs` changes activate only in fresh launchers.** Warm pre-commit launchers treat exit 86 as a crash and back off — bounded and self-healing on session restart.
2. **Five tier-mutation paths still bypass `source_kind`** (PE supersede/update, reconsolidation merge, create-record carry discard, confidence-tracker promote) — recorded in `L1-security-safety/disposition.md` follow-ons; catalog wording hedged honestly.
3. **mk-code-index carries the identical dual-writer hazard** (`code-graph-db.ts:502`) — L4 lane candidate; the lock module is reusable.
4. **Lanes L2–L9 (~190 findings) remain open** — this summary updates progressively as lanes close.
<!-- /ANCHOR:limitations -->
