---
title: "Implementation Summary: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery"
description: "Directive-lifecycle correctness, hardened storage, registered-boundary wiring, evidence provenance, adapter parity, and Pi repeat suppression are implemented and verified; fresh deep review and final metadata reconciliation remain."
status: "in_progress"
completion_pct: 95
trigger_phrases:
  - "directive lifecycle remediation status"
  - "phase 018 implementation summary"
  - "review findings current state"
importance_tier: "high"
contextType: "implementation"
parent: "../spec.md"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
    last_updated_at: "2026-08-11T19:57:46Z"
    last_updated_by: "codex"
    recent_action: "Closed the Pi repeat defect and completed the identical whole-gate comparison"
    next_safe_action: "Run fresh deep review, then regenerate metadata and execute final strict validation"
    blockers:
      - "Fresh post-implementation deep review remains"
      - "Final parent/phase metadata and strict validation remain"
    key_files:
      - "handover.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:1d6f6f9c87a64187f4772ffb7594dc2dab82976dcda90cc08ff28eedb32b27ce"
      session_id: "019fef75-b9e5-79f1-9889-be8dad41a4bf"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Create phase 018 rather than expand phase 017"
      - "Cover P0 through user-requested P3 residuals"
---
# Implementation Summary: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery |
| **Status** | In progress |
| **Delivery State** | Runtime and evidence remediation implemented; fresh review and metadata closeout pending |
| **Completion** | 95% |
| **Level** | 3 |
| **Parent** | `../spec.md` |
| **Predecessor** | `017-adapter-live-delivery-verification` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Lifecycle correctness and delivery

The canonical contract now uses transactional record evaluation, trusted per-session epochs, store-wide invalidation for unidentified boundaries, transcript high-water updates on eligible repeat turns, and deferred full-delivery receipt commits. Unknown stats, missing or conflicting identities, stale clocks, IO ambiguity, and failed boundary mutations all fail open to full delivery. Registered Claude, Codex, Cursor, and Devin boundary owners use the canonical bridge; OpenCode applies conflict-aware identity and lifecycle handling.

Pi now follows its surface-specific cadence: first turn and compact/resume boundaries contribute the full advisor-and-dispatch block, while a proven repeat returns no transform, preserves the raw user turn byte-for-byte, and writes no receipt. The independent tool-call preflight remains active on every turn.

### Hardened storage

The file-backed state boundary is split between the TypeScript wrapper and a directory-descriptor-anchored Python helper. It enforces no-follow/exclusive operations, verified ownership/mode/type/link-count/size/schema, transactional clock/record updates, bounded cleanup and eviction, failure poisoning, and always-full fallback when the platform or helper cannot prove safety.

### Evidence and repository truth

Scenario 457 and the benchmark wrapper enforce `unit`, `adapter-driven`, `registered-path`, and `native-host-delivered` evidence classes, repository-relative verified artifacts, SHA-256 hashes, runtime/version/command/fixture metadata, and valid model provenance. Historical reports remain immutable and are superseded externally. Cursor native delivery remains an honest SKIP/unconfirmed result. All four discovery symlinks are preserved; phase 017 remains superseded.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The source review was hashed into `evidence/review/source-review-registry.json`, and the frozen whole-gate manifest captured a pre-change baseline before runtime edits. Safe negative controls reproduced the growth/shrink, unknown-stat, generation-reset, and symlink-escape failures. The implementation then proceeded through canonical state, boundary coupling, store hardening, consumer parity, evidence persistence, and test isolation.

A first post-change fresh review found six P1 correctness/security gaps and an evidence review found seven P1 provenance/traceability gaps. Those hypotheses were confirmed against the responsible code and remediated with transactional clock/record handling, post-handoff receipts, boundary failure poisoning, root-walking Devin coupling, full adapter matrices, strict evidence taxonomy, symlink-safe evidence verification, and external supersession. The later user-visible Pi repeat defect was reproduced as a failing end-to-end transform test before the proven-repeat contribution was suppressed completely.

Focused gates were rerun after remediation. The frozen manifest then completed under the append-only `final-pi-repeat-4` label, and the normalized comparator recorded the same manifest hash and zero blockers against baseline. Three earlier diagnostic runs are retained and explicitly classified as infrastructure failures with no product verdict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Create phase 018 and supersede phase 017 | Phase 017 excludes core fixes and contains a false symlink-deletion diagnosis; expanding it would erase the review boundary. |
| Choose explicit epoch + high-water + hardened store | A heuristic-only patch does not fix lifecycle coupling, identity, security, evidence, or metadata findings. |
| Preserve all discovery symlinks | They are intentional mode-120000 inventory links whose no-output direct-entry behavior is documented. |
| Keep historical reports immutable | Corrections need append-only evidence and explicit supersession, not history rewriting. |
| Treat P3 as a residual-risk register | The user requested P0-P3 coverage, while repository completion gates formally recognize P0/P1/P2. |
| Retain always-full delivery as rollback | It safely restores every directive while remediation or proof is incomplete. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Source review registry | P0=0, P1=7, P2=3 with source SHA-256 in `evidence/review/source-review-registry.json` |
| Focused advisor suite | PASS, 87/87 |
| Registered adapter suite | PASS, 23/23 |
| Pi suite | PASS, 55/55; includes byte-identical proven-repeat E2E coverage |
| Persistence suite | PASS, 9/9 |
| Negative controls | PASS, 5/5 in `evidence/negative-controls/final.json` |
| Performance/race probe | PASS; in-memory p99 0.005 ms, file-store p99 65.706 ms under 100 ms, 16/16 writes preserved, no residue |
| Runtime evidence matrix | Claude/Codex/Cursor/Devin adapter and registered-path cadence PASS; Cursor native host remains SKIP/unconfirmed |
| Whole-gate comparison | PASS; identical manifest hash, zero blockers, no new failure identity, no lost test file; Pi 54→55 and negative controls exit 1→0 |
| Stable baseline limitations | Advisor retained the same 64 normalized failures; spec-kit retained the same timeout class and 154 normalized failures; parent recursive validation retained the same two failures |
| Fresh deep review | PENDING; required before final acceptance |
| Final phase metadata/strict validation | PENDING until fresh review is dispositioned |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fresh review is pending.** The post-remediation state has not yet received the mandatory command-driven deep review; final acceptance remains blocked until that verdict is dispositioned.
2. **Native-host evidence is incomplete.** Current proof is unit, adapter-driven, or registered-path; Cursor is dormant/unconfirmed and no adapter result is promoted to native-host delivery.
3. **Two implementations remain.** The TypeScript canonical core and OpenCode JavaScript mirror agree through contract vectors, but compiled-core unification remains RR-001.
4. **The whole suites are not globally green.** The authoritative claim is zero regression against a frozen baseline, not that all repository tests pass. Advisor failures, spec-kit timeout/failures, and parent recursive errors are unchanged.
5. **The working tree is broad and dirty.** Evidence uses explicit task-owned paths and source hashes; nothing is staged, committed, or pushed by this task.
6. **Final metadata is intentionally stale until review.** Description, graph, continuity fingerprints, checklist closeout, and strict validation will be regenerated only after the fresh review cannot invalidate them.
<!-- /ANCHOR:limitations -->
