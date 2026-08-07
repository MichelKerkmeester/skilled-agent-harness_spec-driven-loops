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
- [x] T-06 Re-mint the three repaired hubs through the same tooling [evidence: `compiled-route-sync.cjs` rebuilt the promoted mirror (62 closure files) from the fixed authored tree after the seven serving manifests were synced to the regenerated policy identities (the precedent lane from `e215751429c`, not the shadow-era 013 activate-hub driver, whose CAS correctly refused already-graduated hubs); `--verify` reports all 7 hubs resolve with 0 reads under .opencode/specs; `--finalize` completed and removed the rollback]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-07 Confirm `compiled-route-guard.cjs` exits 0 locally with all seven hubs fresh [evidence: guard reports "All hubs fresh or excused" with all seven rows `fresh` — both failure classes (4× authored-drift, 3× inputs-do-not-compile) cleared. Precursors all landed: the two never-committed shared governance modules reconstructed from their call-site contracts (frozen-scorer digest contract with a committed pin registry + `--refreeze` CLI; per-hub lockfile wrapper with stale-pid reclamation); the seven rollout-child canaries re-baselined to 7/7 GREEN by exit code with every behavioral delta adjudicated in `009-parent-hub-rollout/ceremony-deltas.md` (9 ACCEPT as authored evolution, 1 resolved as a stale pre-rename prompt) — including two committed-red defects the re-baseline surfaced: 001's validator demanded the certificate-gated selective controller its own router deliberately dropped (gate repointed at certificate-inertness + advisor non-authority), and 001's document replay hard-coded `surfaceBundle` instead of the composition rule's own kind]
- [x] T-08 Re-run the full routing gate set and confirm zero movement against the T-02 baseline [evidence: capture pins EXACT — full 151/195, unknown 13, gold_none_false_fire 5, holdout 53/72, ambiguity 17/24, review 24/31, memory_save 27/32, delegation 10/11; corpus gate at CI floors `overall_pass: true`; golden prompts + registry drift-guard + command-bridges drift-guard + parity deep-skills/deep-council + scorer-eval ratchet all green (6 files, 42 tests); parent-skill-check ×7, root-metadata, leaf-manifest, derived-freshness, skill-graph compiler all pass. One legal re-pin: the golden fixture's `expectedMode` for sk-prompt carried the pre-rename `prompt-improve` token, surfaced by the first re-mint since the hub rename exactly as the suite's own re-mint note predicts]
- [x] T-09 Push and confirm the previously-red CI step passes on a live run [evidence: Routing Registry Drift Guard run 30565734894 on `6580653517` — both jobs success (`gh run view` conclusion: success), the first fully-green run in this workflow's history. Two additional pre-existing repo defects surfaced and were fixed en route, each on its own commit: a case-duplicate install-guide entry in the git index that only case-sensitive CI runners materialize (`17c4092ddc`), and skill graph metadata referencing a gitignored dist build product absent from every clean checkout (`6580653517`)]
- [x] T-10 Run `validate.sh <folder> --strict` to Errors:0 and close the packet docs [evidence: final strict run reports Errors:0 after metadata regeneration; all packet docs flipped to Complete with the ceremony evidence recorded]
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
