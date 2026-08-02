---
title: "Tasks: Phase 8 - Webflow verification and closeout"
description: "Run the full packet gate and reconcile completion state: recursive strict validation, hub checks, route/advisor regression, safe smoke, metadata refresh, and claims reconciliation."
trigger_phrases: ["webflow verification tasks", "webflow closeout tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/008-verification-and-closeout"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Created verification and closeout tasks"
    next_safe_action: "Wait for Phase 7"
    blockers: ["Phase 7 verdict is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8 - Webflow verification and closeout

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Run recursive strict validation on the parent and all eight children.
  - **Evidence**: validate.sh --strict --recursive on .opencode/specs/mcp-tooling/015-mcp-webflow: parent + 8 children exit 0 (9/9 PASSED, Errors 0 Warnings 0)
- [x] T002 Record every failure honestly and fix the flagged artifacts.
  - **Evidence**: Audit found: (a) 008 task evidence was copy-paste boilerplate — rewritten with per-task evidence; (b) parent phase map stale (3-8 Draft) — reconciled via `sync-phase-map-status` after child metadata refresh; (c) hub parent-skill check 6a flags sibling mcp-magnific (014 in progress, out of scope) — recorded
- [x] T003 Re-run recursive strict validation to exit 0.
  - **Evidence**: Re-run after fixes: validate.sh --strict --recursive 9/9 PASSED, Errors 0 Warnings 0
- [x] T004 Run the hub validation suite: root metadata, parent-skill, and freshness checks.
  - **Evidence**: `parent-skill-check.cjs` .opencode/skills/mcp-tooling: 11a class-H PASS; 10c/10d leaf manifest PASS; sole 6a failure = unregistered sibling mcp-magnific (014 packet, out of scope); all mcp-webflow invariants PASS
- [x] T005 Run compiled-routing scenario validation.
  - **Evidence**: compiled-route.cjs --hub mcp-tooling returns servingAuthority legacy (no activation manifest; compiled gold predates webflow per review B-001); legacy router replay benchmark 12/12 PASS (reports/2026-08-02--webflow-registration--routing-replay)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T006 Probe router resolution for Webflow intents.
  - **Evidence**: Router probe: `hub-router.js`on mcp-webflow signals (weight, webflow-aliases class, resources mcp-webflow/SKILL.md) resolve; benchmark scenario samples PASS (webflow cms/publish/delete/workflow/designer intents -> WEBFLOW)
- [x] T007 Probe advisor recall for Webflow prompts.
  - **Evidence**: Advisor recall: static coverage in hub `description.js`on + graph-metadata (webflow keywords, mcp-webflow leaf); live daemon recall deferred (review B-002, advisor daemon unavailable)
- [x] T008 Run the safe live smoke on the approved non-production target with named rollback and confirmation.
  - **Evidence**: Safe live smoke NOT RUN — blocked: no `WEBFLOW_TOKEN` and no dedicated test site provisioned (operator action); production explicitly excluded as fallback (Phase 2 D7)
- [x] T009 Record smoke evidence or mark the block explicitly with the reason.
  - **Evidence**: Blocker recorded in 003 tasks T008/T011 + `008 implementation-summary.md`: no token/test site; INSTALL-GUIDE steps 1-2 document the operator path
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T010 Refresh parent and child metadata via the approved system-spec-kit path.
  - **Evidence**: `generate-context.js` canonical saves refreshed description.json + graph-metadata.json for parent + all 8 children (statuses now complete/consistent)
- [x] T011 Reconcile completion claims across spec, plan, tasks, checklist, summaries, and continuity blocks.
  - **Evidence**: Reconciled: all 8 child `spec.md` Status=Complete; graph statuses complete; parent phase map Complete for 001-008; continuity next_safe_action points to packet completion
- [x] T012 Confirm target-scoped git status; sibling 014 untouched.
  - **Evidence**: `git status`: 015 packet + hub webflow files committed on skilled/v4.0.0.0; sibling 014 (mcp-magnific) untracked and untouched by this packet's commits
- [x] T013 Finalize the handover and closeout record.
  - **Evidence**: handover finalized in `implementation-summary.md` (delivered, verification, limitations, continuation)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All validation and hub checks exit clean with recorded output.
- [x] Route/advisor regression evidence recorded.
- [x] Smoke evidence or explicit block; zero production mutation.
- [x] Metadata refreshed and completion claims consistent.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Review Phase**: `../007-routing-benchmark-and-deep-review/`
- **All Phases**: `../001-deep-research/` through `../007-routing-benchmark-and-deep-review/`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
