---
title: "Implementation Plan: Phase 4: compiled-fleet-onboarding"
description: "Build the hub's compiled rollout, wire it into every surface the six-hub fleet enumerates, mint and record its activation in both the runtime and authored trees, and prove serving, fail-closed and rollback with the fleet's own tools before the hub's own doc pass and re-gates."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
  - "compiled fleet onboarding"
  - "activation manifest"
  - "serving closure"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/004-compiled-fleet-onboarding"
    last_updated_at: "2026-09-20T15:55:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan authored at closeout, mirroring the executed onboarding"
    next_safe_action: "Run phase 005: re-run the hub and transport playbooks from the new home"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-004-compiled-fleet-onboarding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: compiled-fleet-onboarding

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON artifacts; Node.js for the engine, the rollout harness, the resolver, the guard, admission and status, and for the two fleet test suites |
| **Framework** | The compiled-routing closure: `HUB_CHILD`, the default-on cohort in four copies, the activation manifest contract, the serving closure record, and the per-hub shadow child the engine loads |
| **Storage** | Repository filesystem; two activation trees that must agree byte-for-byte (the runtime `013-live-activation` tree and its authored mirror under the router-unification program); the advisor's built twin is gitignored and rebuilt, not edited |
| **Testing** | The rollout harness build, a canary replay against the authored expectations, manifest validation plus freshness plus refresh idempotence, route probes under an unset flag and under the kill-switch, a rollback rehearsal, the admission, status and guard tools, the two fleet suites, and the hub's own doctor gates |

### Overview
Order is the whole risk here. Hub prose and version move first, because a hub's `SKILL.md`, `hub-router.json` and `mode-registry.json` are the inputs its policy is compiled from; then the rollout child is cloned and repointed and its policy is built once against those frozen bytes; then all six fleet surfaces move in a single pass, because a half-wired cohort makes the lockstep suite report a diverging hub; then the activation is minted and its authored mirror written; then the fleet's own gates are run, not a bespoke check. The hub doc pass that a serving hub needs — the version bump, the removed scaffold paragraph and the changelog entry — closes the phase, followed by re-running the hub's gates because those edits moved routing inputs again.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Freeze, compile once, mint against the frozen bytes, then prove with the fleet's own gates. Every consumer in this fleet reads the same three authored files per hub, so any edit after a mint silently invalidates it: the plan therefore batches the hub's prose and version into one step, builds the policy from the result, mints once, and re-verifies freshness at the end of the phase.

### Key Components
- **The rollout child** — a per-hub copy of the fleet's compiled harness: `harness/build-artifacts.cjs` compiles the hub's authored files into a policy, `lib/registry-compiler.cjs` is the hub's own compiler (the only place in the fleet where the `transport` packet kind is a first-class role), `lib/router.cjs` replays a request against the compiled contract, and `lib/policy-card.cjs` projects the same snapshot into a document.
- **The six surfaces** — the engine's dispatch map, the resolver's default-on cohort, the advisor flag source and its built twin, the guard's hub list and the sync tool's hub list. They are four cohort copies in the lockstep suite's language because two of them are one source and its build output.
- **The activation pair** — the runtime manifest and fence state that the resolver reads, and the authored mirror the guard byte-compares against it. The mirror additionally carries the pre-activation manifest, the rollback copy, and the activation and flip records.
- **The serving closure record** — the manifest listing the runtime root's code closure and activation state; it is a record of what serves, not a gate, and it is updated by hand because the tool that would regenerate it requires the archived authored closure.

### Data Flow
`.skilled/skills/cli-jev/{SKILL.md,hub-router.json,mode-registry.json,cli-usage/SKILL.md}` → the rollout child's compiler → `effectivePolicyHash` → the live manifest's `selectedPolicy` → the resolver's identity binding → a compiled route, or the legacy sentinel when the manifest is missing, stale, inert or the flag is off.

The reverse direction matters as much: the engine caches a compiled snapshot per hub keyed by the manifest's bytes, so re-minting after a prose edit is what makes the next call serve the new policy rather than a cached one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The harness is the first proof: `node .../008-cli-jev/harness/build-artifacts.cjs` must report `status: built` with six compiled and five activation artifacts, and the policy it reports is the hash every later artifact must carry. The canary corpus is replayed through the child's own router and compared case by case against the fixture's authored expectations — four judgment requests that must route to `cli-usage` and three that must not route — because a compiled policy that cannot reproduce its own gold is not admissible.

The serving proof is the fleet's front door, not the harness: `compiled-route.cjs --hub cli-jev` must return a compiled route with the flag unset, a compiled defer for an out-of-domain prompt, and the `{"servingAuthority":"legacy","hubId":"cli-jev"}` sentinel under `SPECKIT_COMPILED_ROUTING=0`. `compiled-route-manifest.cjs freshness` must report `fresh: true` with a matching `currentPolicyHash`, and the sanctioned `refresh` verb must re-derive the identical bytes, which is what makes the pre-commit remint a no-op for this hub rather than a rewrite.

The rollback is rehearsed rather than asserted: the recorded rollback copy is written over the live manifest, status must report `legacy-authority` and the front door the sentinel, and then the recorded bytes are restored and checked for byte-identity before the front door is probed again. Admission, status and the guard are then run over the whole fleet, and the two fleet suites are compared against the failure sets measured before the change so that a pre-existing red is never claimed as a pass or blamed on this phase.

Finally the hub's own gates re-run because its version and prose moved: `parent-skill-check.cjs` for the invariants and the version rules, and `validate_skill_package.py --strict` for the package contract, whose compiled-routing readiness sub-check is the one that reports `compiled-ready` only once a manifest exists.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 002, because the hub's registry, router and transport packet are the inputs the compiled policy is built from.
- Phase 003, because the cohort admits a hub whose packet resolves, and the dispatch chain had to stop reading the retired path first.
- The engine's layout selector and the hub's shadow child, because freshness for a graduated hub is computed from the child's own compiler rather than the generic one.
- The operator's decision that this hub joins the default-on cohort in this program, which is what makes an unset flag serve it.
- Phase 005, which consumes this phase's output by re-running the hub and transport playbooks against a hub that answers from compiled policy.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove `cli-jev` from the six surfaces — the engine dispatch map, the resolver cohort, the advisor source, the guard and sync hub lists, and the closure record — which returns the hub to `unknown hub` and the fleet to five members; delete the rollout child and the two activation directories, and restore the hub's own artifacts to `0.1.0.0` with the scaffold paragraph and the pre-onboarding changelog link. Restoring only the serving half is cheaper and is already rehearsed: writing the recorded rollback copy over the live manifest puts the hub back on legacy serving without touching a single line of code, and restoring the recorded manifest bytes brings compiled serving back exactly.
<!-- /ANCHOR:rollback -->

---
