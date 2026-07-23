---
title: "Implementation Summary: system-spec-kit Non-Hub Router Rollout"
description: "system-spec-kit now has an isolated compiled-policy candidate with deterministic projections, real-scorer compatibility, zero-authority legacy parity, and byte-exact fenced rollback evidence."
trigger_phrases:
  - "system spec kit rollout summary"
  - "system spec kit compiled policy evidence"
  - "non hub real green result"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/004-system-spec-kit"
    last_updated_at: "2026-07-19T10:39:28Z"
    last_updated_by: "codex"
    recent_action: "Delivered the real-green system-spec-kit shadow rollout"
    next_safe_action: "Review evidence before any separately authorized activation"
    blockers: []
    key_files:
      - "harness/run-rollout.cjs"
      - "compiled/system-spec-kit/policy.json"
      - "compiled/system-spec-kit/policy-card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-spec-kit-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: system-spec-kit Non-Hub Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-system-spec-kit |
| **Completed** | 2026-07-19 |
| **Level** | 2 |
| **Status** | Complete — real-green shadow rollout; no live authority |
| **Git** | No commit or push |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`system-spec-kit` now has a content-addressed N=1 policy candidate generated from its real authored router and leaf contracts. The rollout preserves 17 intent classes, all 48 routable leaves, the authored quick-reference default, negative admission, and one-turn ambiguity handling while keeping composition, authority, handoff, and learning collections empty.

### Target-Local Gate

The gate imports the frozen compiler, canonical schemas, activation fence, parity runner, and real scorer. It builds artifacts only when called with `--write`; the default invocation regenerates everything in memory, byte-compares checked artifacts, and proves the child tree is unchanged.

### Files Changed

| File Group | Action | Purpose |
|------------|--------|---------|
| `harness/*.cjs` | Created | Source adaptation, protected replay, isolated fingerprints, artifact generation, and validation |
| `activation/*` | Created | Frozen fence re-export plus prior/current/candidate manifest bytes and fence state |
| `parity/shadow-parity.cjs` | Created | Frozen zero-authority parity re-export |
| `compiled/system-spec-kit/*` | Created | Policy, advisor projection, typed gold, policy card, and five fixtures |
| Canonical docs and metadata | Created | Level-2 contract, evidence, and memory discovery |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The real scorer parser reads the multiline router dictionaries, then a deterministic projection feeds the frozen normalized source builder. Provenance is reset to the actual `SKILL.md`, leaf manifest, and leaf-alias bytes. The frozen compiler emits the policy; a narrow target adapter adds the explicit default to positive routes and emits a schema-native `bounded-default` only after zero selector evidence. The same semantics feed typed gold, real scorer projection, legacy parity, and document-only replay.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the real scorer parser for the multiline authored block | It avoids a second router grammar and makes compilation consume the same intent/resource parse as the frozen oracle |
| Keep parser projection out of provenance | The policy must identify actual authored bytes, not an adapter representation or sentinel |
| Model the explicit default as `bounded-default` | The frozen decision schema supports it, and the user explicitly required authored fallback semantics to survive |
| Add the default to every positive route | The authored router and real scorer both treat the undeclared default semantics as always-union |
| Derive forbidden admissions from the authored NEVER headings | Negative precedence remains based on published skill rules rather than invented fixture vocabulary |
| Run the scorer in a child process | The protected oracle stays read-only and isolated from target artifact generation |
| Use the in-memory frozen fence state machine | It proves generation pinning, stale-epoch rejection, and byte-exact rollback without mutating serving state |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deterministic build | PASS: 13 artifacts, two full rebuild maps, three policy compiles, and two isolated fingerprints; body `3cd7c7161c06826e543829435c2349feb63cff286e631ee180168c207ec5b2c6`; effective policy `64f24e05b897bad2be29d86b13e87c8feca179e3bc6e31641ddab11e8b01964d` |
| Closed algebra | PASS: 1 candidate, single selection, 48 leaves, 17 intents, bounded default, one clarify, forbidden reject, zero rank calls, target-free non-routes, no effects |
| Frozen schemas | PASS: policy, advisor, five decisions, five typed rows, and policy-card frontmatter plus all content hashes |
| Real scorer | PASS: 5/5 rows; extra-resource and fabricated-oracle falsifiers rejected |
| Shadow parity | PASS: 3 matches, 0 mismatches, 0 effects, legacy authoritative |
| Fenced rollback | PASS: active generation 1, fence 2, pre/restored `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23` |
| Protected scorer trio | PASS: `router-replay` `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`; `score-skill-benchmark` `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`; `load-playbook-scenarios` `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` |
| Syntax | PASS: `node --check` on all 6 child-local CommonJS files |
| Packet validation | PASS: strict Level-2 validation after metadata generation |
| Scope | PASS: no scorer, compiler, live skill, routing config, parent, commit, push, install, or network mutation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This is a shadow candidate only. It does not prove behavior in a deployed serving process and grants no live authority.
2. The target adapter is necessary because the frozen normalized source builder accepts single-line resource arrays and the base evaluator had no explicit-default case. Common compilation, schema, projection, parity, and fencing behavior remains imported.
3. Forbidden admissions come from bold headings in the authored NEVER section. If that section changes format, the gate fails its required negative-admission assertion instead of silently weakening rejection.
4. Parity covers representative exact, explicit-default, and singular-route cases. Ambiguity and forbidden behavior are verified against the closed typed algebra because the legacy router expresses them as multi-route/resource observations rather than typed control decisions.
<!-- /ANCHOR:limitations -->
