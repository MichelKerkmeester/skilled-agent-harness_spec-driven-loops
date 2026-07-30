---
title: "Task Breakdown: Compiled-Routing Fleet Freshness Repair"
description: "Tasks for the compiled-routing fleet freshness repair."
trigger_phrases:
  - "fleet freshness task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/034-compiled-routing-fleet-freshness"
    last_updated_at: "2026-07-30T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored packet from live guard evidence"
    next_safe_action: "Re-mint the four stale hubs first"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-compiled-routing-fleet-freshness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Compiled-Routing Fleet Freshness Repair

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Record the pre-change guard verdict (which hubs, which cause codes) and confirm it is identical in worktree, main tree, and the live CI step [evidence: 4x stale-manifest (mcp-tooling, sk-code, sk-design, system-deep-loop) + 3x inputs-do-not-compile (cli-external-orchestration, sk-doc, sk-prompt), byte-identical verdict in worktree, main, and the CI step log]
- [x] T-02 Capture the full routing-gate baseline (scorer-eval capture pins, corpus gate, golden prompts, ratchet) so post-mint zero-movement is provable [evidence: baseline = the post-cutover green set — capture pins exact, corpus gate pass at floors, 53/53 suites — recorded in the sibling ingestion phase within the hour before this packet]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-03 Re-mint the four stale-manifest hubs (`mcp-tooling`, `sk-code`, `sk-design`, `system-deep-loop`) through the shipped refresh verb [evidence: all four refreshed fresh:true via compiled-route-manifest refresh; the guard then surfaced the next layer — authored-drift (promoted runtime differs from authored source)]
- [x] T-04 Surface the real compile exception for each non-compiling hub (`cli-external-orchestration`, `sk-doc`, `sk-prompt`) beneath the swallowed cause code [evidence: loaded each hub through the authored engine directly — cli: undefined read of cli-pi/SKILL.md missing from the harness fixture map; sk-prompt: ENOENT on the pre-rename prompt-improve/SKILL.md path; sk-doc: bundleRules[1] references pre-rename mode create-quality-control]
- [x] T-05 Fix each hub's routing inputs to the minimum that restores compilability, or record an engine-defect escalation with evidence [evidence: three minimal authored-source fixes — cli-pi entry added to the cli harness fixture map; sk-prompt harness paths renamed to the sk-prefixed packet dirs; the sk-doc supplemental bundle rules re-keyed to the live sk-create-* mode ids. All seven hubs now load through the authored engine (7/7 OK)]
- [ ] T-06 Re-mint the three repaired hubs through the same tooling [BLOCKED: the manifest tooling compiles through the promoted runtime mirror, which still carries the pre-fix harness code — the mirror rebuild (compiled-route-sync) must propagate the authored fixes first, and that rebuild is itself gated on the re-activation below]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-07 Confirm `compiled-route-guard.cjs` exits 0 locally with all seven hubs fresh [BLOCKED on T-06 and the authored re-activation: the authored activation manifests pin superseded policy hashes (e.g. sk-code generation 2), so the authored resolver fails closed and the sync closure trace rejects all hubs; re-binding them is the fenced-CAS ceremony in the router-unification program's activate-hub driver — a fence-epoch advance on the serving authority, held for the operator]
- [ ] T-08 Re-run the full routing gate set and confirm zero movement against the T-02 baseline
- [ ] T-09 Push and confirm the previously-red CI step passes on a live run
- [ ] T-10 Run `validate.sh <folder> --strict` to Errors:0 and close the packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All seven hubs fresh; guard exit 0 locally and green in live CI; every compile failure's real error recorded beside its fix; routing gates unmoved; no manifest hand-edited and no engine code changed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
