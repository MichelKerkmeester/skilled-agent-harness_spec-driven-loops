---
title: "Tasks: Hub-doc conformance + reality-alignment review of cli-external + mcp-tooling hubs"
description: "Review task ledger for the bounded deep-review of the cli-external + mcp-tooling hub docs: setup, dimension passes with verify-every-claim, verdict + durable artifacts + collision-free handoff to the 002 remediation plan."
trigger_phrases:
  - "hub doc conformance review tasks"
  - "cli-external mcp-tooling doc audit tasks"
importance_tier: "normal"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review"
    last_updated_at: "2026-07-11T09:14:17.440Z"
    last_updated_by: "claude"
    recent_action: "Review task ledger closed; all tasks complete with evidence"
    next_safe_action: "Execute the 002 remediation plan against the flagged hub docs"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-doc-conformance-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Hub-doc conformance + reality-alignment review of cli-external + mcp-tooling hubs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Fix review dimensions (`sk-doc-conformance`, `reality-alignment`) and iteration budget (≤10, stop = max-iterations) — EVIDENCE: `review/deep-review-strategy.json` records both dimensions and the max-iterations stop policy.
- [x] T002 Enumerate the cli-external + mcp-tooling hub-doc surface (READMEs, SKILLs, mode docs, catalogs, playbooks, references, vendored `mcp-servers/**/README.md`) — EVIDENCE: scope enumerated in `spec.md` §3 and exercised across the `review/` iteration deltas.
- [x] T003 [P] Confirm live CLI/MCP reachability for the verify-every-claim rule — EVIDENCE: live probes (`cupt`, `figma-ds-cli`, `bdg`, Code Mode `tool_info()`/`list_tools()`) cited in the `review/` iteration narratives.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the `reality-alignment` dimension passes across the doc slices — EVIDENCE: per-iteration deltas + prompts under `review/`; reality-drift findings recorded in `review/deep-review-findings-registry.json`.
- [x] T005 Run the `sk-doc-conformance` dimension passes against the create-skill templates — EVIDENCE: schema-failing vendored READMEs and template-shape findings recorded in `review/deep-review-findings-registry.json`.
- [x] T006 [P] Verify every reality claim (CLI flag, MCP tool, transport/auth, agent route, meta-count, link/path) against live truth — EVIDENCE: each finding in `review/deep-review-findings-registry.json` carries file:line + live-probe evidence, not the doc's assertion.
- [x] T007 Record ranked P0/P1/P2 findings and dedup into `review/deep-review-findings-registry.json` — EVIDENCE: registry `findingsBySeverity` holds the deduped 67 P0 / 4 P1 / 2 P2 set.
- [x] T008 Persist per-iteration deltas + prompts + dispatch receipts under `review/` — EVIDENCE: `review/` contains the strategy, state, deltas, prompts, and dispatch receipts for the run.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Record the verdict (FAIL) with distinct deduped counts (67 P0 / 4 P1 / 2 P2) — EVIDENCE: verdict + counts in `spec.md` §5 (Success Criteria) and `review/deep-review-findings-registry.json`.
- [x] T010 Confirm the six finding themes are represented (reality-drift, agent-routing, dead links/stale paths, playbook meta-claims, schema-failing vendored READMEs, test-scenario logic bugs) — EVIDENCE: all six themes enumerated in `spec.md` §5 and traceable to registry finding IDs.
- [x] T011 Partition the findings into collision-free work-streams for the downstream 002 plan — EVIDENCE: partition consumed by `../002-hub-doc-conformance-fixes/` (WS-A..WS-D, file-disjoint per its `decision-record.md` ADR-002).
- [x] T012 Verify `review/` artifacts are durable and self-describing — EVIDENCE: `review/` artifacts re-readable on disk and carried into the 002 plan without re-derivation.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verdict recorded and findings handed to `../002-hub-doc-conformance-fixes/`

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Remediation plan**: See `../002-hub-doc-conformance-fixes/`

<!-- /ANCHOR:cross-refs -->
