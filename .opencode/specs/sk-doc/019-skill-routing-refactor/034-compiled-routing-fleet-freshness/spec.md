---
title: "Feature Specification: Compiled-Routing Fleet Freshness Repair"
description: "Restore every activated hub's compiled-routing manifest to fresh: re-mint the four hubs whose manifests went stale, diagnose and fix the three hubs whose routing inputs no longer compile, and turn the one remaining red step in the routing CI workflow green."
trigger_phrases:
  - "compiled routing stale manifest"
  - "hub inputs do not compile"
  - "compiled-route-guard red"
  - "re-mint hub manifests"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/034-compiled-routing-fleet-freshness"
    last_updated_at: "2026-07-30T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ceremony blocked: activation layer never committed"
    next_safe_action: "Reconstruct activation modules in a dedicated phase"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-compiled-routing-fleet-freshness"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "Reconstruction first: the activation driver's shared governance modules were never committed and are unrecoverable, so the re-activation ceremony is unrunnable until they are rebuilt and the seven canaries re-baselined"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Compiled-Routing Fleet Freshness Repair

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`compiled-route-guard.cjs` reports all seven activated hubs unhealthy, identically in the main tree, the worktree, and live CI — where it is now the only red step in the routing workflow (every earlier step in that job, and the entire full-install job, pass since the workflow was made executable).

Four hubs carry a **stale manifest** — their routing inputs changed after the last mint, so the serving manifest no longer matches and those hubs silently fall back to legacy routing: `mcp-tooling`, `sk-code`, `sk-design`, `system-deep-loop`. Three hubs are worse: their routing **inputs do not compile**, so they cannot even be re-minted until the compile failure is fixed: `cli-external-orchestration`, `sk-doc`, `sk-prompt`. The freshness probe surfaces only a `compile-error` cause code — the underlying exception is swallowed at the tool boundary — so the first diagnostic step is surfacing each hub's real error.

This drift is exactly the failure mode the guard documents: "editing a hub's routing inputs without re-minting silently drops that hub to legacy routing — nothing errors and nothing logs." It predates the remediation program (the guard step had never executed in CI before that program repaired the workflow) and is unrelated to command bridges, which live in a different system and are green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — re-minting the four stale-manifest hubs via the shipped manifest tooling; surfacing the real compile error for each of the three non-compiling hubs and fixing the routing *inputs* (registry/router/vocabulary data) so they compile; re-minting those three once they compile; confirming `compiled-route-guard.cjs` exits clean locally; and confirming the previously-red CI step goes green on a live run.

Out of scope — changing the compiled-routing engine, compiler, resolver, or guard code themselves (the tooling is treated as authority; if a compile failure turns out to be an engine defect rather than an input defect, that is escalated with evidence, not patched here); any change to advisor scoring, command bridges, or the mode registries' routing *semantics* beyond what compiling requires; the serving-authority flip policy (hubs already declare their serving mode).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every compile failure is surfaced with its real error before anything is fixed | For each of the three non-compiling hubs, the underlying exception (not the swallowed `compile-error` cause code) is captured and recorded, so the fix targets the actual defect rather than a guess |
| REQ-002 | The four stale hubs are re-minted through the shipped tooling | `compiled-route-manifest.cjs refresh` (or the tool's documented re-mint verb) regenerates each manifest; no manifest is hand-edited |
| REQ-003 | The three non-compiling hubs compile and are re-minted | The input defect for each is fixed at the authored source, the hub compiles, and its manifest is regenerated through the same tooling |
| REQ-004 | The guard passes everywhere it runs | `node .opencode/bin/compiled-route-guard.cjs` exits 0 locally, and the previously-red CI step passes on a live run of the routing workflow |
| REQ-005 | Routing behavior is proven unchanged where it was already correct | The full routing gate set (capture pins, corpus gate, golden prompts, ratchet) is re-run after the re-mints and shows zero movement — a re-mint refreshes serving manifests and must not alter advisor scoring outcomes |
| REQ-006 | Any engine-defect finding is escalated, not absorbed | If a hub's inputs are genuinely valid and the compiler itself is at fault, the evidence is recorded and the hub is left excused-with-reason rather than its inputs contorted to fit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

All seven hubs report fresh; the guard exits 0 locally and the CI step is green on a live run; each of the three compile failures has its real error recorded alongside the fix that resolved it; the routing gate set shows zero movement post-re-mint; and no manifest was hand-edited and no engine/compiler code changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | A re-mint changes serving behavior for a hub whose stale manifest happened to serve correct decisions | REQ-005 re-runs the full routing gate set after every re-mint; any movement is a stop-and-diagnose, not a shrug |
| Risk | Fixing a compile failure by editing routing inputs quietly changes that hub's routing vocabulary | Input fixes are held to the minimum that restores compilability, reviewed against the hub's authored intent, and covered by the same gate re-run |
| Risk | The compile failures are engine defects misattributed to inputs | REQ-001 requires the real exception first; REQ-006 escalates engine defects instead of contorting inputs |
| Dependency | The routing workflow's executability fix (already landed) | Without it the CI step never runs, and REQ-004's live confirmation is impossible |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Answered: three independent defects of one shared class — authored shadow-child artifacts stale against fleet evolution (a missing fixture entry for the later-added cli-pi executor, pre-rename sk-prompt packet paths, pre-rename sk-doc mode ids in supplemental bundle rules). All are fixed at the authored source. Newly opened and held for the operator: propagating the fixes requires the promoted-mirror rebuild, which is gated on re-running the fenced-CAS activation ceremony to re-bind the authored activation manifests (currently pinned to superseded policy generations) — a fence-epoch advance on the live serving authority that this packet does not take unilaterally.
<!-- /ANCHOR:questions -->
