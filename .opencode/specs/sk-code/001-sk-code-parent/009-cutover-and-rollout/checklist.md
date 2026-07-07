---
title: "QA Checklist: Phase 9 — cutover and rollout"
description: "Verification checklist for the branch-side cutover prep and the main-side rollout runbook."
trigger_phrases:
  - "sk-code cutover checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/009-cutover-and-rollout"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the phase 009 QA checklist with evidence"
    next_safe_action: "Merge, then run the main-side rollout runbook"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# QA Checklist: Phase 9 — cutover and rollout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:correctness -->
## Correctness
- [x] Harness migrations preserve intent (no `.skip`, no coverage-removing deletions) — evidence: companion assertions added, only stale literals/paths updated.
- [x] CS-003 fix is narrow (word-boundary only for `review`) — evidence: `2_javascript` substring match preserved; genuine-review control routes `[review]`.
- [x] vocab-sync derivation is registry-driven and hub-agnostic — evidence: sk-design byte-identical output.
- [x] smart_routing paths point at real files — evidence: `0` dead of 96.
<!-- /ANCHOR:correctness -->

---

<!-- ANCHOR:completeness -->
## Completeness
- [x] All 3 cleanup items landed — evidence: harness `1 failed | 98 passed`, vocab + CS-003 replay-verified.
- [x] The 29 drifted RESOURCE_MAP paths repointed — evidence: rescan `0` dead.
- [x] Both fold-broken live refs fixed — evidence: sandbox script + README link.
- [x] Main-side rollout runbook is complete + ordered — evidence: 8 steps, per-step verification, dependency-sequenced.
<!-- /ANCHOR:completeness -->

---

<!-- ANCHOR:safety -->
## Safety / Scope
- [x] No blind edits to the un-runnable TS advisor scorer — evidence: staged in the runbook, not made in the branch.
- [x] Alias deletion sequenced after scorer removal and before the one-pass graph regen — evidence: runbook step order 2 (scorer) → 3 (alias sites) → 5 (regen) + coupling note.
- [x] TS/Python scorer parity preserved in the branch (both untouched, both retain the alias) — evidence: no `system-skill-advisor/` scorer edits in the branch diff.
- [x] sk-design-owned failure left untouched — evidence: `design-dispatch-boundary-proof` unchanged.
- [x] No package.json/lock leak staged — evidence: `git checkout` before commit; explicit path staging.
<!-- /ANCHOR:safety -->

---

<!-- ANCHOR:load-bearing -->
## Load-Bearing Verification
- [x] Harness suite verified independently (re-run) — `1 failed | 98 passed (99)`.
- [x] `setup-cp-sandbox.sh` parses (`bash -n`) and its paths resolve.
- [x] smart_routing `0` dead paths confirmed via router-replay existence scan.
- [x] Worktree un-runnability of the load-bearing steps confirmed empirically (17 graph-validation errors; TS scorer 16/18 files fail to load) — justifies the branch/main split.
- [x] `parent-skill-check.cjs` green for all three hubs after canonical-scoping 3d — evidence: deep-loop default unchanged all-pass; sk-design and sk-code both "all invariants passed" (both failed 10× before the fix).
- [x] CI drift gate green at HEAD — evidence: `routing-registry-drift.yml`'s three vitest suites 21/21 locally + the check; this is the gate the main-side rollout PR triggers.
- [x] `reviewer` false-negative closed — evidence: reviewer task routes `[review]`, CS-003 stays `[implement]`, vocab-sync findings 18→18, benchmark 71 with zero scenario diffs.
<!-- /ANCHOR:load-bearing -->

---

<!-- ANCHOR:deferred -->
## Deferred (main-side rollout — tracked, blocked on post-merge dist)
- [ ] Advisor scorer identity removal (TS + Python mirror) + coupled corpora rebaseline.
- [ ] `skill-graph.json` regen (node 19→18) + SQLite/native + memory reindex.
- [ ] Delete the 4 alias-definition sites (after regen).
- [ ] Repoint ~350 alias-covered NAME refs (bucket map in plan.md).
- [ ] Version release: hub bump, code-review anchor reconcile, 4 missing changelogs, hub changelog symlinks.
- [ ] Full verification: advisor vitest/parity, pytest, benchmark re-run, `parent-skill-check.cjs`, `validate.sh --recursive`, `0` live sk-code-review refs.
<!-- /ANCHOR:deferred -->
