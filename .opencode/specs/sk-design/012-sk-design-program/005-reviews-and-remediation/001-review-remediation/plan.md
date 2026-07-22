---
title: "Implementation Plan: packet-012 deep-review remediation"
description: "Remediation approach for the packet-012 review findings, persistent-path hardening first."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/005-reviews-and-remediation/001-review-remediation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author remediation plan"
    next_safe_action: "Implement REQ-001..REQ-004 (P0) first"
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

# Implementation Plan: packet-012 deep-review remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

All fixes are in the packet-012 `styles/_db/` modules (Node `node:sqlite`, ESM `.mjs`) plus scoped 003-doc corrections. The `styles/_engine` adapter stays `legacy` by default throughout, so no fix changes production behavior — this is pre-activation hardening of the persistent path.

### Overview

Fix in severity order: P0 code hardening (crash recovery, generation integrity, containment, input bounds) with regression tests, then the P2 hash-identity fix, then the process/evidence corrections. Keep the legacy path untouched; prove no regression against the 24/24 + 20/20 baselines.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The `_db` code + review artifact are readable; the 4 code findings are verified against source (done in this spec).

### Definition of Done

- REQ-001..REQ-007 met with tests; legacy baseline unregressed (24/24 db, 20/20 legacy); 003 evidence + parent status reconciled; `validate.sh --strict` 0 errors.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical hardening of the existing published-generation design — no architectural change. Each fix adds a fail-closed check or a bounded recovery path plus a regression test; identity fixes preserve the generation-atomicity model.

### Key Components

- `vectors.mjs` (job lifecycle), `retrieval.mjs` (query contract + input bounds), `schema.mjs` (pointer resolution), `indexer.mjs` (aggregate hash), `_db/__tests__/` (regression), 003 docs (evidence).

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 code hardening (REQ-001..004)
- [ ] #1 add stale-running reconciliation (startup/lease reset of orphaned `running` jobs) to the drain path; process-interruption test.
- [ ] #2 compare the request generation; honor (reopen) or fail-closed reject; stale-generation test.
- [ ] #3 realpath-contain the resolved pointer + bind opened-DB `generationHash`; containment/binding tests.
- [ ] #4 cap `queryVector` type/dims/size before fingerprinting; oversized-input test.

### Phase 2: P2 + process (REQ-005..007)
- [ ] #10 exclude the mutable slug from the aggregate hash (stable identity); rename-stability test.
- [ ] #7 measure full-corpus SLO or amend the 003 claim (per OPEN QUESTION); reconcile 003 docs.
- [ ] #9 add operator surface (status/build/cutover/rollback/repair) + generation keep/prune; README.

### Phase 3: Verify + close
- [ ] Full `node --test` green (24 + new); legacy 20/20; `validate.sh --strict`. Reconcile parent status (#8) once #5/#6/#7 hold.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Per-finding regression tests in `_db/__tests__/`: process-interruption recovery (#1), stale-generation rejection (#2), pointer containment + generation binding (#3), oversized `queryVector` rejection (#4), slug-rename hash stability (#10). Re-run the full `_db` suite + the legacy `_engine` suite to prove no regression.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- packet-012 `_db` code + review artifact; Node `node:sqlite`; no new dependencies (consistent with 003).

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- All fixes are additive/defensive and the adapter stays `legacy`; rollback is reverting the `_db` changes. No generation is published to readers by default, so no live-data risk.

<!-- /ANCHOR:rollback -->
