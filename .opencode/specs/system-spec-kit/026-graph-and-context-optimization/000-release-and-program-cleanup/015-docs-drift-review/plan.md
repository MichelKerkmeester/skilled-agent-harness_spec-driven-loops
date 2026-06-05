---
title: "Implementation Plan: Documentation-Drift Review vs Session Changes"
description: "Plan for a read-only documentation-drift deep review: partition docs by area, run bounded gpt-5.5 review passes, adversarially verify every candidate against shipped code, synthesize a P0/P1/P2 findings report."
trigger_phrases:
  - "documentation drift review plan"
  - "docs drift review"
  - "partitioned review passes"
  - "drift findings synthesis"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/015-docs-drift-review"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan for partitioned drift review with code-verification gate"
    next_safe_action: "Owner triages findings into a docs-remediation packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "docs-drift-review-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Documentation-Drift Review vs Session Changes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + repo code (TS/JS) as ground truth |
| **Framework** | cli-opencode dispatch (gpt-5.5-fast high), partitioned by doc area |
| **Storage** | Findings report at `review/review-report.md`; no DB writes |
| **Testing** | `validate.sh --strict` on this packet; per-finding code verification |

### Overview
A read-only review comparing user-facing docs against seven shipped change-areas (packets 013/014/015/016 + release) on `origin/main` HEAD `75cfec1700`. Ten bounded review passes were dispatched (one doc area each) to stay under gpt-5.5-fast's broad-audit timeout; every candidate finding was then adversarially verified by the orchestrator against the real code before inclusion, since the model passes systematically over-applied the advisor-scoped embedder/reranker removal to mk-spec-memory.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (cli-opencode, gpt-5.5-fast, OpenAI auth)

### Definition of Done
- [x] All acceptance criteria met (report exists with verdict + counts + per-finding correction)
- [x] No reviewed doc edited (findings only)
- [x] Docs updated (spec/plan/tasks/impl-summary for this packet)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The review is a one-way comparison: docs (read-only) vs shipped code (ground truth on `origin/main`). No component is modified. The pipeline is: ground-truth extraction (Bash/Grep/Read on code) → partitioned model passes (cli-opencode) → orchestrator verification (Bash/Grep/Read on code) → synthesis (the report). The only writes land inside this packet (`spec/plan/tasks/implementation-summary` + `review/review-report.md` + metadata). The model passes are advisory; the orchestrator's code-verification step is authoritative and overrides any pass finding.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Phase 1 (Setup)**: confirm HEAD, enumerate the 7 change-areas, verify contested facts in code, create the packet skeleton, pre-filter the catalog/playbook trees, compose 10 bounded briefs.
- **Phase 2 (Implementation)**: dispatch ~10 `gpt-5.5-fast high` passes (2-3 concurrent, shared OpenAI quota), each returning strict-format candidate findings.
- **Phase 3 (Verification)**: verify every candidate against the repo, reject false positives, write the report, strict-validate this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Per-finding verification: each surviving P0/P1 must cite a quoted stale doc string AND a verified code fact on `origin/main`.
- Packet integrity: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` exits 0.
- Read-only guarantee: final `git diff` shows only `015-docs-drift-review/` additions.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Notes |
|------------|-------|
| `opencode` CLI + OpenAI auth | gpt-5.5-fast high dispatch; provider pre-flight confirmed |
| `gtimeout` | bounded dispatch (600-1200s per pass) |
| Repo code on `origin/main` `75cfec1700` | ground truth for verification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No rollback needed: the work is additive and read-only on reviewed docs. If the packet must be withdrawn, delete the `015-docs-drift-review/` folder; no other repo state changes.
<!-- /ANCHOR:rollback -->
