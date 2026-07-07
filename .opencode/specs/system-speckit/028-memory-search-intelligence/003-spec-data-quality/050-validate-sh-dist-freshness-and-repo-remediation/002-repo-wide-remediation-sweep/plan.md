---
title: "Implementation Plan: Repo-Wide validate.sh Remediation Sweep"
description: "Plan for a triage-then-fix parallel agent swarm across 41 non-028, non-030 packet roots."
trigger_phrases:
  - "repo wide remediation sweep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/050-validate-sh-dist-freshness-and-repo-remediation/002-repo-wide-remediation-sweep"
    last_updated_at: "2026-07-04T17:11:53.344Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed triage, fix wave, and bucket-3 report"
    next_safe_action: "No implementation action remaining"
    blockers: []
    key_files:
      - ".opencode/specs/ai-systems/002-skill-port-quality-audit"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-030-dist-freshness-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Repo-Wide validate.sh Remediation Sweep

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit docs across 7 tracks |
| **Framework** | cli-opencode dispatch (`openai/gpt-5.5-fast --variant xhigh`), parallel swarm |
| **Testing** | `validate.sh --strict --recursive` per packet root |

### Overview
Two-wave swarm: a read-only triage wave classifies every failing folder into 3 buckets, then a write wave fixes buckets 1 (mechanical) and 2 (grounded content) only. Bucket 3 is reported, not auto-authored. `system-speckit/028-*` is hard-excluded from both waves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root-cause data gathered: 43 packet roots, 257 failing folders, rule-frequency breakdown across native vs registry-bridge checks.
- [x] `001-dist-freshness-enforcement` complete and verified (this child's fix wave was measured against a trustworthy `validate.sh`).

### Definition of Done
- [x] All 41 in-scope packet roots triaged into buckets 1/2/3 (script-based, not dispatched -- the classification is deterministic).
- [x] Bucket 1 + 2 folders pass `validate.sh --strict --recursive`, independently re-verified.
- [x] Bucket 3 report written with a grandfather-mechanism recommendation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Triage-then-fix, matching the proven pattern from `deep-loops/030-agent-loops-improved/011-followup-remediation` children 003-005 (grounded content authoring) generalized to unfamiliar packets via an explicit read-only classification pass first, since (unlike packet 030) this session has no prior context on most of these 41 packets.

### Key Components
- **Triage dispatch** (per packet root, ~6-8 concurrent `cli-opencode` calls): reads the packet's own `spec.md` chain and every failing folder's validate output; classifies each failing folder.
- **Fix dispatch** (per packet root, same concurrency): only for packets with bucket 1/2 folders; reuses `generate-description.js`/`backfill-graph-metadata.js` for bucket 1, the children-003-005 grounded-authoring pattern for bucket 2.
- **Bucket-3 aggregation**: a final compilation step (done directly, not dispatched) merging every packet's bucket-3 list into this child's `implementation-summary.md`.

### Data Flow
Packet root list (41, excl. 028 and 030) → triage wave (parallel, read-only) → per-packet bucket classification → fix wave (parallel, write, buckets 1+2 only) → independent re-verification (`validate.sh --strict --recursive` per packet root, run by the orchestrating session, not trusted from dispatch self-reports) → bucket-3 aggregation and report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Triage
- [x] Enumerate the 41 in-scope packet roots.
- [x] Run a script-based triage classifying every failing folder (deterministic classification, no LLM dispatch needed for this step).
- [x] Aggregate triage results into bucket 1 / 2 / 3 lists.

### Phase 2: Fix
- [x] Fix bucket 1 folders directly via scripted metadata regen and Spec Folder field correction.
- [x] Dispatch fix wave for the 7 bucket-2 folders (3 parallel `cli-opencode` calls).
- [x] Independently re-verify each fixed packet root with `validate.sh --strict --recursive`.

### Phase 3: Report
- [x] Compile the bucket-3 list and write the grandfather-mechanism recommendation.
- [x] Run a final full sweep across all 41 in-scope packet roots confirming only bucket-3 folders remain failing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Per-packet-root full recursive validation | `validate.sh --strict --recursive` |
| Regression | Confirm `system-speckit/028-*` shows zero diffs throughout | `git status`/`git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-dist-freshness-enforcement` | Predecessor | Complete | Fix wave verification was measured against a trustworthy `validate.sh` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix-wave dispatch produces inaccurate/fabricated content, or accidentally touches `system-speckit/028-*`.
- **Procedure**: `git checkout --` the specific affected files (per-packet, per-dispatch scoping keeps blast radius contained); re-triage that packet manually before re-dispatching.
<!-- /ANCHOR:rollback -->
