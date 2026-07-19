---
title: "Feature Specification: packet-012 deep-review remediation"
description: "Document and plan fixes for all deep-review findings (P0=0, P1=9, P2=1) on the packet-012 style database + interface commands, prioritizing the persistent-path code hardening before the DB can be enabled."
trigger_phrases:
  - "review remediation"
  - "packet 012 findings"
  - "style database hardening"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/005-review-remediation"
    last_updated_at: "2026-07-19T11:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Document all P0-P2 review findings + plan remediation"
    next_safe_action: "Implement REQ-001..REQ-007 (persistent-path hardening first)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: packet-012 deep-review remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-style-database-and-interface-commands` |
| **Predecessor** | `004-interface-commands` |
| **Successor** | None |
| **Phase** | 5 of 5 |
| **Source** | Deep review `955d58f898` — `../review/lineages/sol/iterations/iteration-005.md` (stabilized P0=0, P1=9, P2=1) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The GPT-5.6-SOL deep review over packet 012 stabilized **0 P0, 9 P1, 1 P2**. Four P1s are real code issues in the persistent style-DB path (verified against the shipped code), one P2 is a hash-identity issue, two P1s are process/evidence overclaims, and three P1s are doc-traceability overclaims (already reconciled in `955d58f898`). No production bug exists today — the `styles/_engine` adapter defaults to `legacy` (flat files authoritative), so the code findings are **latent, pre-activation hardening**. They MUST be closed before anyone enables `persistent` mode.

### Purpose

Document every finding and its verification, and plan a remediation that (a) hardens the persistent DB path (crash recovery, generation integrity, input bounds, hash identity), (b) corrects the two open evidence overclaims, and (c) records the three doc overclaims already fixed — so the packet's claims are honest and the DB is safe to enable.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the full finding set

| # | Sev | Finding | File(s) | Status |
|---|-----|---------|---------|--------|
| 1 | P1 | Worker crash strands a vector job in `running` (drain selects only `pending\|failed`; no stale-running lease/reconciliation) | `_db/vectors.mjs:154-176`, `_db/indexer.mjs:773-789` | **Open (verified)** |
| 2 | P1 | Persistent query ignores a caller-requested generation (only cursor generation is checked; request pin neither compared nor fingerprinted) | `_db/retrieval.mjs:338-363`, `_engine/persistent-adapter.mjs:176-201` | **Open (verified)** |
| 3 | P1 | Pointer resolves with no realpath containment; `generationHash` not bound to the opened DB | `_db/schema.mjs:23-48`, `_db/retrieval.mjs:338-347` | **Open (verified)** |
| 4 | P1 | Synchronous query accepts + duplicates an unbounded caller `queryVector` | `_db/retrieval.mjs:81-96,210-230` | **Open (verified)** |
| 5 | P1 | 001 tasks claim a completed 10-iteration run (ran 7 + stall) | `001-.../tasks.md` | **✅ Reconciled `955d58f898`** |
| 6 | P1 | 002 tasks claim SOL+GLM converged (GLM ran 0, out of quota) | `002-.../tasks.md` | **✅ Reconciled `955d58f898`** |
| 7 | P1 | 003 checklist overstates a 20-style relative timing test as proof vs the 1,290-style SLO baseline | `003-.../checklist.md:58-64`, `spec.md:115-131` | **Open** |
| 8 | P1 | Parent `Complete`/verified unsupported while child evidence contradicted | `spec.md:43-55` | **⚠️ Partially reconciled** — closes when 5/6/7 hold |
| 9 | P1 | Persistent build/cutover/rollback/vector-repair are library-only (no operator surface); no generation retention/prune | `_db/indexer.mjs:1047-1174`, `_db/README.md` | **Open** |
| 10 | P2 | Aggregate hash includes the mutable `slug` locator, so a rename-only slug change rotates content/generation identity | `_db/indexer.mjs:181-186,220-258` | **Open (verified)** |

### Out of Scope

- Enabling `persistent` mode by default (a separate go/no-go after this remediation + a full-corpus index run).
- The interface-command surface (004) — the review found no defects there.
- The deep-alignment adapter mismatch (a system-deep-loop concern, not packet 012).

### Files to Change

| File Path | Change Type | Finding |
|-----------|-------------|---------|
| `styles/_db/vectors.mjs` | Modify | #1 stale-running lease/reconciliation |
| `styles/_db/retrieval.mjs` | Modify | #2 generation-pin enforcement, #4 queryVector bounds |
| `styles/_db/schema.mjs` | Modify | #3 realpath containment + generation binding |
| `styles/_db/indexer.mjs` | Modify | #10 exclude slug from aggregate hash |
| `styles/_db/style-library.mjs` (or a new CLI) | Create/Modify | #9 operator surface + generation prune |
| `styles/_db/__tests__/**` | Modify | regression tests for #1–4, #10 |
| `003-style-database/{checklist.md,spec.md,implementation-summary.md}` | Modify | #7 evidence correction; #8 parent reconciliation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Vector-job crash recovery (#1) | A bounded stale-running reconciliation (lease/timeout or startup reset) returns interrupted jobs to selectable state; a process-interruption regression test proves recovery on a normal drain. |
| REQ-002 | Generation-pin integrity (#2) | A caller-supplied generation is compared and either honored (reopen that generation) or fail-closed rejected — never silently served from current; stale-generation test added. |
| REQ-003 | Pointer containment + binding (#3) | Read-side realpath containment rejects a pointer resolving outside the generation dir, and the opened DB's `generationHash` is verified against the pointer; containment/binding tests added. |
| REQ-004 | Bounded query input (#4) | `queryVector` type/dimensions/serialized-size are capped before fingerprinting on every caller path; oversized input is rejected; regression test added. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Stable content identity (#10, P2) | The aggregate hash excludes the mutable `slug` locator (uses stable UUID/relative-role identity), so a slug rename does not rotate content/generation identity; test added. |
| REQ-006 | Honest SLO evidence (#7) | Either a same-full-corpus persistent-vs-legacy measurement is recorded, or the SLO/checklist/completion claims are amended to not assert "proven"; 003 docs reconciled. |
| REQ-007 | Operator surface + retention (#9) | A documented, tested operator entry point for persistent status/build/cutover/rollback/vector-repair exists, plus a keep-current+rollback prune invariant for generation files; `_db/README.md` updated. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- REQ-001..REQ-004 (P0) closed with tests; REQ-005..REQ-007 (P1) closed.
- 003 evidence + parent status reconciled (closes #7, #8); #5/#6 already done.
- Full `node --test` suite green (existing 24 + new regression tests); `validate.sh --strict` 0 errors.
- The persistent path is safe to enable behind an explicit go/no-go (out of scope here).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** the packet-012 `_db` code on `origin/skilled/v4.0.0.0` and the review artifact `../review/...`.
- **Risk:** hardening the generation/pointer path could regress the legacy default — mitigate by keeping `legacy` the default and re-running the full `_db` + legacy-engine suites (baseline 24/24 + 20/20).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- Reconciliation/containment checks must not add unbounded work to the normal query/drain path.

### Security

- #3 (realpath containment) and #4 (input bounds) are the trust-boundary items; fail-closed on violation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- #2: does any current caller actually pass a generation pin, or is the fix simply to remove the pin from the contract? (Resolve at implementation by tracing the adapter callers.)
- #7: run the full-corpus SLO measurement now (heavier), or amend the claim and defer measurement to the persistent-enable go/no-go?
<!-- /ANCHOR:questions -->
