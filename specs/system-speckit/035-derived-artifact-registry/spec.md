---
title: "Feature Specification: One registry for every derived artifact, so no artifact owns a private staleness check"
description: "Seven blocking gates each police one derived artifact, so every new artifact repeats the same stale-far-from-the-edit cycle. One registry mapping sources to generator to target, walked by one checker, replaces the per-artifact pattern."
trigger_phrases:
  - "derived artifact registry"
  - "stale fingerprint sweep"
  - "per artifact gate"
  - "derived staleness walker"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-derived-artifact-registry"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: One registry for every derived artifact, so no artifact owns a private staleness check

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/035-derived-artifact-registry |
| **Predecessor** | hooks/020-spec-metadata-auto-remint |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A packet stores derived data beside a fingerprint of the documents it came from, and the same shape repeats for routing manifests and the retrieval index. Each got its own blocking gate as its staleness was discovered, and the gates were added one failure at a time: a stale routing manifest surfaced only at push time and cost two amends, and 450 of 2,826 packets carried a stale fingerprint that nothing reported because the failure only appeared when someone validated that exact folder. Three independent reviews reached the same verdict. This is hand-rolled cache invalidation, and a gate per artifact guarantees the next artifact stales silently under a name nobody has written a gate for yet.

### Purpose
One registry names every derived artifact, its sources and its generator, and one walker answers whether any target is out of date. Freshness becomes a property of the registry rather than something each artifact defends for itself, and the gates that remain are proven to fail on a stale input rather than assumed to.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A registry mapping source globs to generator to target, and a walker that checks or regenerates from it
- Tests that prove each gate fails on a deliberately staled artifact, rather than passing on a fresh one
- A read-only corpus-wide drift sweep, so staleness is visible without someone guessing which folder to validate
- Making the spec re-mint gate transactional, so a partial failure leaves the index exactly as it found it
- Reducing the documents that cannot be auto-repaired to a declared list, each with a reason

### Out of Scope
- **Deleting the stored fingerprint in favour of read-time computation.** Two reviews floated it. It is a larger question than this packet, and the fingerprint is genuinely consumed: it hashes all five documents plus a combined digest and a hard-error rule fires on mismatch.
- **Guessing the 73 anchorless documents' templates.** An unprovable repair writes a silent wrong value into the retrieval index.
- **A second registry format.** The validator registry already exists and this one sits beside it.
- **Loosening any gate that cites a real regression.** Comment hygiene, mirror parity and the MCP mutation class each do.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `runtime/cli/lib/derived-artifacts.json` | Create | 001 | The registry, beside the existing validator registry |
| `runtime/cli/spec/derive-artifacts.mjs` | Create | 001 | The walker: `--check` reports, `--write` regenerates |
| `runtime/tests/derive-artifacts.vitest.ts` | Create | 001 | One staling case per registry entry |

| `.github/workflows/strict-pass-freshness-report.yml` | Modify | 003 | Extend the weekly sweep that already runs `repair-derived --roots specs` |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | 002 | Transactional re-mint, and document the commit widening |
| `runtime/cli/spec/heal-spec-docs.cjs` | Modify | 003 | A JSON output mode, so the declared list and the sweep can be compared |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-registry-walker-and-proof/ | The registry, the walker that reads it, and a proof per entry that its gate fails on a staled artifact | Planned |
| 2 | 002-transactional-remint/ | A partial failure restores worktree and index together, so a retry sees what the first attempt saw | Planned |
| 3 | 003-measure-and-declare/ | Extend the weekly sweep that already exists, and turn the unrepairable residue into a declared list | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | The walker exists and each gate is proven to fail on a staled input | In a regenerated scratch worktree, staling one source per registry entry turns the suite red with the expected rule id |
| 002 | 003 | The gate is transactional | Inject a mid-batch failure; `git status --porcelain` is byte-identical to the pre-run capture |
| 003 | None | The residue is declared and the sweep agrees with it | The extended weekly job reports a count equal to the declared list, and every entry carries a reason |

### Sequencing Rule

The order is load-bearing, not a preference.

- **001 before everything.** Nothing else has a manifest to walk, and its proofs are what make it safe to touch a gate at all.
- **001 before 002.** Do not alter a gate that no test proves. The batching episode that motivated this packet shipped a test which passed against the implementation it replaced, so covered was not the same as proven.
- **002 before 003.** The declared residue moves once the gate stops leaving remnants, so measuring first would measure a state about to change.
- **Never edit `pre-commit` or the healer while another session holds uncommitted changes to them.** One has been committing to this repository throughout.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether the stored fingerprint should survive at all, or derived data should be computed at read time keyed by content hash. Deferred rather than settled: it is the larger architectural question underneath this packet, and answering it needs the sweep in phase 003 to show how often the stored copy is actually read versus recomputed.
- Whether the walker should adopt `make` rather than a bespoke checker. One review named `make -q` as the existing solution to exactly this problem. Phase 001 should test that claim before writing a checker that reinvents it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
