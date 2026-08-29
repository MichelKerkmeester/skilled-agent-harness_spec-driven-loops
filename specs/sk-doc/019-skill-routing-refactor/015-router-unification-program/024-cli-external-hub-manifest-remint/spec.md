---
title: "Feature Specification: cli-external-orchestration Activation Manifest Re-Mint"
description: "Editing a cli-* packet SKILL.md changes a compiled-routing policy input, so a skill edit that ships without re-minting the activation manifest silently drops the hub to legacy prose routing; re-mint the manifest to the current source hash and record the coupling that made the edit unsafe."
trigger_phrases:
  - "cli external orchestration stale manifest"
  - "compiled routing fell back to legacy"
  - "skill edit broke compiled routing"
  - "activation manifest re-mint"
  - "compiled route guard exit 1"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/024-cli-external-hub-manifest-remint"
    last_updated_at: "2026-08-29T22:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Reproduced the legacy fallback and verified the re-mint that repairs it"
    next_safe_action: "None; the repair is live on main and v4 and this packet is its record"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-cli-external-hub-manifest-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The two live activation manifests are the whole fix; the 009-parent-hub-rollout compiled/ artifacts are a frozen rollout record already divergent at 78723d28 before this change, so they are left alone"
      - "generation stays 5 because refresh selects the generation the compiled policy itself carries, not newGeneration"
      - "The repair shipped in 3a61fa96ac on both main and skilled/v4.0.0.0 while this diagnosis ran; that commit's manifests are byte-identical to the re-mint verified here, so this packet is the record and the evidence rather than the delivery"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: cli-external-orchestration Activation Manifest Re-Mint

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Parent** | `015-router-unification-program` |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Scope** | The `cli-external-orchestration` live activation manifest, in both its promoted and authored copies |
| **Constraint** | Serving state only. No skill source, no compiler, and no frozen rollout artifact is touched |
| **Evidence** | The failure reproduced on pristine `origin/main` before the fix and gone after it, by the same command |
| **Delivered by** | `3a61fa96ac`, on `main` and `skilled/v4.0.0.0`; byte-identical to the re-mint verified here |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Commit `790c3dfc1c5` added a machine-checkable stdin-redirect rule to five `cli-*` packet
`SKILL.md` files. Those files are not documentation to the routing engine: the hub's build harness
reads all seven `cli-external-orchestration` `SKILL.md` files as `sourceBytes` and folds them into the
compiled policy, so editing any one of them changes the hub's `effectivePolicyHash`. The commit
shipped the edits without re-minting the activation manifest.

The result is a silent downgrade rather than an error. `resolveRoute` binds serve-time identity: it
compares the routed snapshot's hash and generation against the manifest's selected policy and returns
`null` on any divergence, by design, so a drifted rollout artifact fails safe to legacy instead of
serving an unselected policy. On `origin/main` the manifest still selected
`84e253d55d85a85ed04decee2bca7fa2776617bcff58c79cc2a804d5af2052b3` while the sources compiled to
`d307e097bd02cf8ebd52c23a7b30c3047ea7499fb69804414e496da7aa82f9eb`, so every prompt to this hub
resolved `{"servingAuthority":"legacy"}` and the compiled route stopped serving entirely.

### Purpose
Restore compiled serving for the hub by re-minting its activation manifest to the hash its current
sources actually compile to, and record the input coupling — a `cli-*` packet `SKILL.md` is a policy
input — so the next skill edit is not shipped the same way.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` — the promoted runtime copy the resolver reads.
- The authored copy of the same manifest under `013-live-activation/` in this program.

### Out of Scope
- Any `cli-*` `SKILL.md`; the source edits themselves are correct and already merged.
- The `009-parent-hub-rollout/004-cli-external-orchestration/` `compiled/` and `activation/` artifacts. Those are the original rollout's frozen record, already carrying `78723d28…` before this change, and the serving path provably never reads them.
- The other four hubs, which were fresh throughout.
- The compiler, the resolver, and the freshness contract; none of them misbehaved.

### Files to Change
- Two `manifest.json` files, one line each. Both already carry the repaired hash on `main` and
  `skilled/v4.0.0.0`, so this packet adds no code change — it adds the diagnosis, the reproduction and
  the verification that the shipped repair is the right one.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
- REQ-001 The hub resolves compiled again, returning a route rather than the legacy sentinel.
- REQ-002 `compiled-route-guard.cjs` exits 0 with all five hubs fresh.
- REQ-003 The failure is reproduced on pristine `origin/main` before the fix, so the same check proves the repair.
- REQ-004 `servingAuthority` and `shadowOnly` are preserved; the re-mint changes identity only.

### P1 - Required (complete OR user-approved deferral)
- REQ-005 The promoted and authored manifest copies stay byte-identical.
- REQ-006 The compiled-routing suites stay green from the final state.
- REQ-007 No frozen rollout artifact and no skill source is modified.
- REQ-008 The same fix reaches both `main` and `skilled/v4.0.0.0`, since v4 must first receive the source edits that cause the hash. Both branches carry the source edits in all six `cli-*` packets and the repaired manifest, at the same commit.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `resolve.cjs --hub cli-external-orchestration` returns an `action: "route"` decision carrying `d307e097…`, where pristine `main` returned `{"servingAuthority":"legacy"}`.
- `compiled-route-guard.cjs` exits 0; `compiled-route-manifest.cjs freshness` reports `fresh` with selected and current hashes equal.
- `compiled-route-sync.cjs --verify` passes its move simulation for all five hubs.
- The bin vitest suite and the manifest test suite pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- The guard prints `stale-manifest` on stdout and still returns a non-zero code; a caller that pipes it and reads the pipeline's status sees `0` and concludes the fleet is healthy. The status was read directly here for that reason.
- `compiled-route-status.cjs --all` reported this hub `fresh` in a checkout whose sources predate the edits. Freshness is relative to the tree it runs in, so it cannot detect that another branch ships a mismatched pair.
- Re-minting through the generic canonical compiler rather than the hub's own shadow-child snapshot would produce a hash the resolver's identity binding rejects. The `refresh` verb already prefers the shadow-child path; a hand-written manifest would not.
- The hub's canary asserts source digests against a baseline frozen at the original rollout, so it fails on any later skill edit. It failed identically on pristine `main` and is not a signal for this change.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a pre-push hook run `compiled-route-guard.cjs` when a commit touches a hub's policy inputs? That is what would have caught this at authoring time rather than after it shipped.
- Should the guard's `Re-mint:` line name the exact `compiled-route-manifest.cjs refresh` invocation, including the `--skill-root` shape that is easy to get wrong?
<!-- /ANCHOR:questions -->
