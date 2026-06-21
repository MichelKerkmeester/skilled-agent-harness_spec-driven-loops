---
title: "Feature Specification: Doc Accuracy Remediation"
description: "Remediation scope for P1-6 changelog shipped-vs-Planned mislabel plus the iteration-9 doc staleness cluster."
trigger_phrases:
  - "028 doc accuracy remediation"
  - "changelog shipped vs planned mislabel fix"
  - "028 doc staleness cluster fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/003-doc-accuracy"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING doc-accuracy remediation scaffold"
    next_safe_action: "Confirm each doc contradiction against committed code before editing"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-006-003-doc-accuracy"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase defines remediation scope only."
      - "The doc fixes are executed by a separate seat."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Doc Accuracy Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | PENDING |
| **Created** | 2026-06-19 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/006-review-remediation` |
| **Phase** | 003 of 004 |
| **Predecessor** | ../002-memory-schema-and-concurrency/spec.md |
| **Successor** | ../004-p2-triage/spec.md |
| **Source Review** | `../../review-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doc-accuracy iteration (iteration 9) was the largest confirmed-P1 spike in the review, landing in the second-to-last deep-dive iteration. It confirmed one shipped-code mislabel as P1 (the Memory rollup marks shipped phases as Planned) plus a 12-strong staleness cluster where the packet narrative docs disagree with committed code and with each other. A reader using these docs as the authoritative narrative would wrongly conclude the schema work and release-cleanup track made no progress. The mislabel misrepresents shipped scope at the canonical subsystem rollup; the cluster freezes the timeline and before-vs-after at commit 30 of 57 and understates the gated-but-shipped schema cluster.

### Purpose
Correct the changelog rollup so it reflects committed code, and refresh the staleness cluster across `timeline.md`, `before-vs-after.md`, and `benchmark-status.md` (plus the tightly-coupled sibling docs) so the packet narrative matches the landed work. This phase defines that remediation scope, the per-doc contradiction, and the verification only; a separate seat executes the edits. Default-off gating is not the same as no code shipped, and the docs must stop conflating the two.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P1-6: the Memory rollup marks shipped phases as `Planned / No production code shipped`.
- The 12-strong doc-staleness cluster centered on `timeline.md`, `before-vs-after.md`, and `benchmark-status.md`, plus the coupled sibling docs the same iteration surfaced.

### Out of Scope
- Any code fix (phases 001 and 002 own those).
- The non-doc P2 findings (phase 004 triages those).
- The concurrent session's files (`shared/algorithms/rrf-fusion.ts`, deep-research assets, `.opencode/commands/*`, `.gitignore`) and packet 030.

### Cited Findings

| ID | Location | Finding (quoted from review-report.md) |
|----|----------|----------------------------------------|
| P1-6 | `001-speckit-memory/changelog/changelog-001-root.md:36` | "The Memory rollup marks shipped phases as `Planned / No production code shipped`. Rows 009/011/017/018/020 say Planned or no code shipped, but each child implementation-summary says Implemented and the branch commits `ed53661043`, `5308401d95`, `8f8776e329` shipped tested `lib/` code ... default-off gating is not the same as no code shipped, so the rollup is factually wrong against committed code." |

### Doc Staleness Cluster (iteration 9, fix-now)

| # | Location | Contradiction (quoted / paraphrased from review-report.md) |
|---|----------|------------------------------------------------------------|
| 1 | `timeline.md:41` | "`timeline.md` is frozen at commit 30/57: the two epochs literal-sequence diagram (L41-77) ends at `b1d6ab80cd`, omitting 27 later commits including the entire shipped schema cluster." |
| 2 | `timeline.md:203` | "Section E classifies bitemporal/derived-id/semantic-edge/code-edge-bitemporal/edge-governance as gated/`held`, but all shipped as code on this branch." |
| 3 | `before-vs-after.md:137` | "says all nine release-cleanup phases are PENDING with no surface cleaned yet, but `changelog-005-root` marks three Complete with evidence." |
| 4 | `before-vs-after.md:151` | "CURRENT STATE stops at commit 30: it describes 23 phases ending at `b1d6ab80cd` ... omitting 26 commits that landed after its last refresh." |
| 5 | `before-vs-after.md:155` | "carries the same false `wait rather than shipped` framing" as the timeline Section E classification. |
| 6 | `benchmark-status.md:41` | "Default-off flag inventory omits `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` ... The gating inventory is incomplete, understating the set of flags that must stay default-off until benchmarked." |
| 7 | `changelog/changelog-028-root.md:46` | "Packet root changelog records zero verification, files-changed, and follow-up evidence for the whole 028 program." |
| 8 | `000-release-cleanup/spec.md:103` | "phase-map lists all nine phases PENDING while the track changelog records three Complete (stale canonical status table)." |
| 9 | `000-release-cleanup/spec.md:23` | "`session_dedup.fingerprint` is an all-zeros placeholder hash ... a real-content recompute is never all-zeros." |
| 10 | `mcp_server/ENV_REFERENCE.md:296` | "All 17 new 028 `SPECKIT_*` opt-in flags are absent from `ENV_REFERENCE.md`, the canonical flag/schema baseline AGENTS.md cites." |
| 11 | `before-vs-after.md` Section 6 | "Section 6 states `All nine are PENDING and define cleanup scope only`" while `changelog-005-root.md` marks 005/007/008 Complete. |
| 12 | `001-speckit-memory/changelog/changelog-001-root.md` rows 009/011/017/018/020 | The same rollup rows that drive P1-6, treated here as the doc-staleness rows to reconcile against each child implementation-summary. |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-speckit-memory/changelog/changelog-001-root.md` | Modify later | Reclassify shipped rows; stop conflating default-off with no code shipped (P1-6) |
| `timeline.md` (028 root) | Modify later | Refresh the epochs diagram and Section E shipped-vs-held classification |
| `before-vs-after.md` (028 root) | Modify later | Advance CURRENT STATE past commit 30; correct release-cleanup PENDING claims |
| `benchmark-status.md` (028 root) | Modify later | Complete the default-off flag inventory; layer on top of the phase-001 re-run update |
| `changelog/changelog-028-root.md` (028 root) | Modify later | Populate verification, files-changed and follow-up evidence |
| `000-release-cleanup/spec.md` | Modify later | Reconcile the phase-map status table; replace the zero-hash fingerprint |
| `mcp_server/ENV_REFERENCE.md` | Modify later | Add the 17 new 028 opt-in flags with defaults and gating rationale |
| `spec.md` | Create | Defines remediation scope and acceptance criteria |
| `plan.md` | Create | Defines fix approach and verification route |
| `tasks.md` | Create | Keeps all remediation work PENDING |
| `checklist.md` | Create | Keeps all verification items PENDING |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Memory rollup matches committed code | Rows 009/011/017/018/020 reflect shipped status, traceable to the named commits |
| REQ-002 | Timeline reflects the full commit range | The epochs diagram and Section E cover the shipped schema cluster, not just commit 30 |
| REQ-003 | Before-vs-after reflects current state | CURRENT STATE advances past commit 30; release-cleanup progress is accurate |
| REQ-004 | Flag inventories are complete | `benchmark-status.md` and `ENV_REFERENCE.md` list every default-off flag they should |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Sibling status tables reconciled | `000-release-cleanup/spec.md` phase-map and root changelog agree with the track changelog |
| REQ-006 | Real fingerprint replaces placeholder | The `000-release-cleanup/spec.md` `session_dedup.fingerprint` is content-derived, not all-zeros |
| REQ-007 | No false completion claims introduced | Every status edit is traceable to a commit or implementation-summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The Memory rollup, timeline, and before-vs-after narrative agree with committed code and with each other.
- The default-off flag inventories in `benchmark-status.md` and `ENV_REFERENCE.md` are complete.
- The release-cleanup phase-map and changelogs no longer contradict the track changelog.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/003-doc-accuracy --strict` exits 0 after the fixes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | benchmark-status.md double-edited | Phase 001 also updates this file | Sequence phase 003 after phase 001; layer the inventory fix on the re-run update |
| Risk | Status reconciliation overstates progress | A doc could flip to Complete without evidence | Trace every status change to a commit or implementation-summary |
| Risk | Editing the 005 sibling spec.md changes its validation | The phase-map and fingerprint edits touch a validated child | Re-run `validate.sh 000-release-cleanup --strict` after the edit |
| Dependency | Branch commit history | Status claims must trace to commits | Use `git log` evidence during execution |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- Every status edit must be traceable to a commit hash or an implementation-summary.
- Doc edits follow the existing house voice of each surface.
- No status is marked Complete without evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Phase 008 of release-cleanup: its own child says no code shipped, so the rollup matches there; do not force it to Complete (the review flagged this as the lone overreach).
- benchmark-status.md is also touched by phase 001; the inventory fix must not revert the re-run deltas.
- Replacing the zero-hash fingerprint may re-trigger `CONTINUITY_FRESHNESS` under `SPECKIT_COMPLETION_FRESHNESS`; recompute it correctly so it does not become a new stale value.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Medium | One changelog plus three narrative docs plus three coupled sibling docs |
| Risk | Medium | Status reconciliation can overstate progress if not traced to commits |
| Verification | Medium | Requires git-log tracing and a sibling re-validation |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the timeline and before-vs-after be refreshed to the current branch HEAD, or to a fixed release commit? The choice sets the cut-off the narrative documents and is decided during execution.
<!-- /ANCHOR:questions -->
