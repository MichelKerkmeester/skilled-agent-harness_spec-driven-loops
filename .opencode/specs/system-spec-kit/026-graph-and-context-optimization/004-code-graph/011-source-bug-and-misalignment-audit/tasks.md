---
title: "Tasks: Code Graph Source Audit [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/tasks]"
description: "Task breakdown for the system-code-graph source audit: audit-execution tasks (complete) and remediation tasks (one per P1 finding, grouped P2), keyed to review-report.md finding IDs."
trigger_phrases:
  - "code graph audit tasks"
  - "system-code-graph remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit"
    last_updated_at: "2026-05-29T08:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded audit tasks complete; remediation tasks enumerated"
    next_safe_action: "Pull P1 remediation tasks into scoped fix packets"
    blockers: []
    key_files:
      - "review-report.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code Graph Source Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` done · `[ ]` pending (deferred to follow-on fix packets)
- Remediation tasks are keyed to `review-report.md` finding IDs (CG-NNN).
- The **audit** is the deliverable of this packet; **remediation** tasks are deferred by design (read-only audit scope).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Confirm gates: read `cli-opencode` SKILL.md; provider auth pre-flight (OpenAI oauth present); self-invocation guard passed.
- [x] T002 — Scope target: `.opencode/skills/system-code-graph/mcp_server/**` (~17.5k LOC) + docs; exclude `node_modules/`, `dist/`.
- [x] T003 — Compose TIDD-EC read-only audit prompt; dispatch `openai/gpt-5.5-fast --variant xhigh` via `cli-opencode`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 — Capture gpt-5.5 findings (3): SCG-001/002/003 → CG-001/002/003.
- [x] T011 — Direct-verify all gpt-5.5 findings against source; add 3 DB-path findings (CG-004/005/006 of the direct-verify set).
- [x] T012 — Run 43-agent completeness-expansion workflow over 7 under-covered clusters with adversarial verification (36 candidates → 32 confirmed, 4 refuted).
- [x] T013 — Dedupe (playbook-023 apply-mode), assign IDs, write `review-report.md` (37 findings: 10 P1, 27 P2).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 — Spot-verify P1 quotes match real source at cited lines.
- [x] T021 — Author spec/plan/tasks/checklist/implementation-summary + metadata.
- [x] T022 — Run `validate.sh --strict` for this phase folder.

### Remediation (deferred — open as scoped follow-on packets)

P1 batch (one task each):
- [ ] R-CG003 — Wrap `removeFile()` edge+file delete in a single transaction (`code-graph-db.ts`).
- [ ] R-CG005 — `tree.delete()` in finally around parse (`tree-sitter-parser.ts`) — WASM leak.
- [ ] R-CG006 — Gate scan `freshness` on `scanPromotable`, not `MAX(indexed_at)` (`scan.ts`).
- [ ] R-CG007 — Feed candidate-manifest drift the on-disk candidate set, not DB rows (`ensure-ready.ts`).
- [ ] R-CG008 — Move `setLastGitHead` mutation out of the read-only readiness snapshot path (`ensure-ready.ts`).
- [ ] R-CG001 — Resolve status read-only vs marker-write contract (gate write to scan, or amend ADR-003) (`status.ts`).
- [ ] R-CG002 — Enforce per-tool inputSchema before dispatch (`tools/`), or soften the doc claim.
- [ ] R-CG009 — Gate destructive recovery ops on `confirm` regardless of staleness (`apply-orchestrator.ts`).
- [ ] R-CG010 — Surface a distinct `rollback-failed` status on failed rollback (`apply-orchestrator.ts`).
- [ ] R-CG004 — Fix feature-catalog "11 tools"/mk-spec-memory dispatch claim → 8 tools (`feature_catalog.md`).

P2 batch (grouped):
- [ ] R-P2-CONCURRENCY — owner-lease reclaim CAS + refresh TOCTOU + shutdown re-entrancy + working-set serialize round-trip (+ tests).
- [ ] R-P2-DIFF — diff-parser/detect-changes comment accuracy + pre/post-image attribution.
- [ ] R-P2-PARSER — B2 quarantine de-gated from skip-list flag, parse metric `recovered` label, dead `recordSuccess`.
- [ ] R-P2-DB — remove per-file global orphan sweep in `replaceEdges`; scan git timeout.
- [ ] R-P2-DOCS — single source-of-truth pass for tool counts (8 vs 11 family), stale file/line refs, version sync, group-count fixes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 37 findings recorded with evidence in `review-report.md`.
- [x] P1 findings have a named remediation task.
- [x] `validate.sh --strict` passes for this folder.
- [ ] Remediation applied — **deferred** to follow-on packets (out of this packet's read-only scope).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Findings detail: `review-report.md`
- Remediation sequencing: `plan.md`
- Audited skill: `.opencode/skills/system-code-graph/`
<!-- /ANCHOR:cross-refs -->
