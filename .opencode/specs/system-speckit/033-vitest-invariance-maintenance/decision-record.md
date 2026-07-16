---
title: "Decision Record: vitest-invariance maintenance — supersede the sk-doc/026 ADR-006 exclusion assumption and repair honestly"
description: "ADR-007 records that system-spec-kit WAS de-numbered by commit 5149f3abe5 (superseding sk-doc/026 ADR-006's exclusion claim), corrects ADR-007's understatement of the systemic workflow-invariance breakage, and establishes the anti-false-green repair principle."
trigger_phrases:
  - "adr-006 exclusion assumption superseded"
  - "system-spec-kit de-numbered 5149f3abe5"
  - "workflow-invariance anti-false-green"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-vitest-invariance-maintenance"
    last_updated_at: "2026-07-11T20:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded ADR-007 reconciling the ADR-006 exclusion logic-sync gap"
    next_safe_action: "Implement the three-suite repair under the anti-false-green principle"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/031-vitest-invariance-maintenance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: vitest-invariance maintenance — supersede the ADR-006 exclusion assumption and repair honestly

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: system-spec-kit WAS de-numbered — supersede the ADR-006 exclusion assumption and repair honestly

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (scaffolded — implementation pending) |
| **Date** | 2026-07-11 |
| **Deciders** | Operator + Claude (this session) |
| **Supersedes** | `sk-doc/026` ADR-006 (exclusion assumption); clarifies `sk-doc/026` ADR-007 (breakage-scope understatement) |

---

<!-- ANCHOR:adr-007-context -->
### Context

Two prior assertions in `sk-doc/026` are contradicted by the actual commit history and test state, creating a logic-sync gap that this packet must reconcile before any repair:

1. **ADR-006 exclusion claim.** `sk-doc/026` ADR-006 asserted that system-spec-kit was **EXCLUDED** from the snippet-filename de-numbering. That is false. Commit `5149f3abe5` ("refactor(system-spec-kit): de-number 699 catalog+playbook snippet files") de-numbered **699 system-spec-kit catalog/playbook files**. system-spec-kit was in scope, not excluded.

2. **ADR-007 breakage understatement.** `sk-doc/026` ADR-007 booked the fallout but characterized the `workflow-invariance` breakage as roughly "7 dead entries." The real breakage is **systemic**: ~120 hits on the private-taxonomy-leak invariant, splitting into ~3 genuine de-numbering-caused stale allowlist entries, ~11 spurious hits from a local `node_modules/` tree the scanner walks, and ~40 legitimate technical-vocab uses of `preset`/`capability`/`kind`/`manifest` that predate the de-numbering and were never leaks.

Because the exclusion assumption was wrong, the deferred maintenance is larger and shaped differently than `sk-doc/026` recorded, and the three RED suites (`outsourced-agent-handback-docs`, `feature-flag-reference-docs`, `workflow-invariance`) are all downstream of the same reorg.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We record the true state and repair honestly:**

1. **system-spec-kit WAS de-numbered** by `5149f3abe5`. This ADR-007 supersedes `sk-doc/026` ADR-006's exclusion assumption. All downstream reasoning must treat system-spec-kit catalog/playbook filenames as de-numbered.

2. **The `workflow-invariance` breakage is systemic, not "7 dead entries."** The corrected triage (~3 stale / ~11 spurious-`node_modules` / ~40 legitimate-vocab) is the authoritative characterization for this repair.

3. **Anti-false-green principle governs the repair.** Fix the real docs and relocate assertions to the content's true new location; add a `node_modules/` scan guard and per-use justified allowlist entries. Do **NOT** gut assertions, broad-brush allowlist tokens, or disable the invariant. After the repair, the `workflow-invariance` test MUST still fail on a genuine NEW private-taxonomy leak (proven by an injected-leak run that is then reverted).
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Repair honestly (fix docs, relocate assertions, guard + justify allowlist)** | Suites go green while the invariant stays strong; the ADR-006 gap is reconciled | More work: ~40 entries need per-use justification | CHOSEN |
| **Silence the failures (delete/skip assertions, disable the invariant, blanket-allowlist the tokens)** | Fast green | False green — the invariant would no longer catch a real leak; violates the completion honesty mandate | Rejected |
| **Leave the suites RED and re-defer** | No work now | Perpetuates the ADR-006 logic-sync gap and a persistently red gate; the maintenance is already booked | Rejected |
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

- `sk-doc/026` ADR-006's exclusion assumption is formally superseded; anyone reasoning from it must read this ADR-007 instead.
- The `workflow-invariance` invariant remains a real gate — the `node_modules/` guard and justified allowlist make it deterministic and checkout-independent without lowering its sensitivity.
- The `vitest-recovery-followup`-owned `it.fails.skip` at `outsourced-agent-handback-docs.vitest.ts:~26` is a foreign-lane constraint: it stays byte-identical.
- Future de-numbering / reorg work must check invariance-scanner allowlists and content-parity assertions as part of the same change, not defer them.
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three suites are RED and the ADR-006 exclusion assumption is factually wrong (`5149f3abe5` de-numbered 699 system-spec-kit files) |
| 2 | **Beyond Local Maxima?** | PASS | Repair-honestly, silence-the-failures, and re-defer are all framed with a decision criterion |
| 3 | **Sufficient?** | PASS | The corrected triage + anti-false-green principle + injected-leak proof fully resolve the gate without weakening it |
| 4 | **Fits Goal?** | PASS | Restores green while preserving the invariant's power to catch a real leak; reconciles the logic-sync gap |
| 5 | **Open Horizons?** | PASS | Keeps the invariant enforceable for future reorgs; documents the de-numbering reality for downstream work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- Suite (a): stale `149-` literal → current de-numbered name; `recentContext` example added to `cli-opencode` `prompt_templates.md`.
- Suite (b): 7 env-var mapping-row assertions relocated to the aggregate `feature_catalog.md`; 6 numbered-doc content assertions repointed. The 8th mapping (`MEMORY_DB_DIR`) was a genuinely dead flag — read by zero source files repo-wide (dropped by an earlier DB-path-resolver refactor) — so it was resolved as **OPTION A (removed flag)** rather than **OPTION B (restore code)**: the unsatisfiable assertion was deleted and the stale `feature_catalog.md` rows claiming a source reads it were corrected to the real precedence chain (`SPEC_KIT_DB_DIR` > `SPECKIT_DB_DIR`). This aligns docs + test to code reality, matching the catalog's own "superseded" framing; restoring runtime behavior was out of scope for a test-repair packet.
- Suite (c): `node_modules/` scan guard added; ~3 stale allowlist entries refreshed; ~40 legitimate technical-vocab uses justified-allowlisted; injected-leak proof confirms the invariant is intact.
- The `vitest-recovery-followup` `it.fails.skip` line is not touched.

**How to roll back**: Each suite/doc edit is independent — `git checkout -- <path>` reverts a bad fix without affecting the others. If the injected-leak proof shows the invariant no longer catches leaks, revert the suite (c) allowlist/guard edits and re-triage before re-attempting.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->
