---
title: "Feature Specification: Repo-Wide validate.sh Remediation Sweep"
description: "Triage and fix the repo-wide validate.sh --strict --recursive failures (257 folders across 43 packet roots) exposed once dist freshness was restored, excluding system-speckit/028-* which is owned by a concurrently active session."
trigger_phrases:
  - "repo wide validate.sh remediation"
  - "validate.sh backlog sweep"
  - "scaffold content bucket triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/016-validate-sh-dist-freshness-and-repo-remediation/002-repo-wide-remediation-sweep"
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
    open_questions:
      - "Should a formal template-compliance grandfather mechanism be built for the 54 pre-contract bucket-3 folders?"
    answered_questions:
      - "User confirmed: fix everything reachable now via a parallel agent swarm, excluding packet 028."
      - "Discovered mid-sweep and also excluded: system-speckit/004-memory-search-intelligence/000-release-cleanup/015-manual-playbook-execution-sweep (live concurrent session)."
---
# Feature Specification: Repo-Wide validate.sh Remediation Sweep

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 |
| **Predecessor** | 001-dist-freshness-enforcement |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict --recursive` returns 0 errors on every non-028 packet root except explicitly-enumerated bucket-3 folders |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`validate.sh --strict --recursive` currently fails on all 43 packet roots repo-wide (257 folders, 0 passing), spanning `ai-systems` (9), `anobel.com` (5), `barter` (6), `deep-loops` (4), `design` (8), `skilled-agent-orchestration` (7), `system-speckit` (4). Roughly half the failures are mechanical (native metadata-integrity checks that were simply never exercised due to stale dist); the rest range from genuine content-authoring debt (scaffold markers with a real, grounded `spec.md`) to structurally incomplete packets that may predate the current template-compliance contract entirely.

### Purpose
Fix everything that can be fixed safely and accurately -- mechanical metadata regen and grounded content backfill -- via a parallel `cli-opencode` (`openai/gpt-5.5-fast --variant xhigh`) swarm. Do not fabricate content for packets with no reliable grounding; report those back with a recommendation instead.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Triage every failing folder in the 41 packet roots outside `deep-loops/030-agent-loops-improved` (owned by the sibling packet's own remediation) and `system-speckit/028-*` (excluded) into 3 buckets.
- Fix bucket 1 (mechanical metadata regen via `generate-description.js`/`backfill-graph-metadata.js`) and bucket 2 (grounded content backfill, same pattern as `deep-loops/030-agent-loops-improved/011-followup-remediation` children 003-005).
- Report bucket 3 (no reliable grounding) with a recommendation.

### Out of Scope
- `system-speckit/028-*` -- read-only triage at most, never written to.
- `deep-loops/030-agent-loops-improved` -- owned by phase 011 child 006's own remediation.
- Any validator rule-logic change (that is child 001's / phase 011 child 006's domain).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:acceptance -->
## 4. ACCEPTANCE CRITERIA

- [x] Every failing folder across the 41 in-scope packet roots is classified into bucket 1, 2, or 3. Evidence: 165 folders classified, 106 bucket 1, 7 bucket 2, 52 bucket 3 (+2 from `design/008-sk-design-parent`).
- [x] All bucket 1 + bucket 2 folders pass `validate.sh --strict --recursive` after the fix wave, independently re-verified (not trusting dispatch self-reports).
- [x] Bucket 3 folders are explicitly enumerated in `implementation-summary.md` with a grandfather-mechanism recommendation, not silently left failing.
- [x] `system-speckit/028-*` shows zero file modifications throughout. Also excluded `system-speckit/004-memory-search-intelligence/000-release-cleanup/015-manual-playbook-execution-sweep`, discovered live mid-sweep.
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every failing folder across the 41 in-scope packet roots is triaged | Triage output names a bucket (1/2/3) for every folder currently failing `validate.sh --strict --recursive` |
| REQ-002 | Bucket 1 + 2 fixes are independently re-verified | Orchestrating session re-runs `validate.sh --strict --recursive` per packet root after each fix dispatch, never trusting the dispatch's self-report |
| REQ-003 | `system-speckit/028-*` is never modified | `git status`/`git diff` on that path shows zero changes at the end of this child |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bucket 3 is reported with a concrete recommendation | `implementation-summary.md` lists every bucket-3 folder and proposes extending the `SPECKIT_GENERATED_METADATA_GRANDFATHER` pattern |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict --recursive` returns 0 errors on every non-028, non-030 packet root, except the folders explicitly named in the bucket-3 report.
- **SC-002**: No fabricated content is introduced into any packet -- every bucket-2 fix is traceable to that packet's own real `spec.md`.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A triage dispatch misclassifies a bucket-3 folder as bucket-2 and a fix dispatch fabricates content | Inaccurate documentation ships as if real | Independent re-verification step re-reads the fixed content against the packet's own spec.md before accepting |
| Risk | A fix dispatch accidentally touches `system-speckit/028-*` while working an adjacent packet | Collides with the other active session's in-progress work | Hard-exclude 028 from both wave's dispatch scopes at the prompt level; verify via git status after every wave |
| Dependency | `001-dist-freshness-enforcement` | This child's fix-wave verification depends on a trustworthy `validate.sh` | Sequenced as this child's Predecessor |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should the bucket-3 grandfather mechanism be implemented as part of this child, or only recommended for a future decision? Current plan: recommend only, since it's a policy call outside this child's scope.

<!-- /ANCHOR:questions -->
