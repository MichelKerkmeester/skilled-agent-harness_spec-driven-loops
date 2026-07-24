---
title: "Tasks: Post-019 routing drift remediation"
description: "Task breakdown for the six remediation items, all complete, each with the verification that confirmed it."
trigger_phrases:
  - "routing drift remediation tasks"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/019-routing-drift-remediation"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed all eighteen tasks across the three phases"
    next_safe_action: "Repair the stale sync path"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Post-019 Routing Drift Remediation

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete · `[ ]` open · `[P]` parallel-safe. All tasks below are complete; each carries the check that
confirmed it rather than a self-report.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the pre-change baseline: manifest suite result and per-hub status output. Baseline was 16 pass / 1 fail, with all seven hubs reporting `compiled-serving`.
- [x] T002 Confirm the reported drift is real by comparing each hub's manifest-selected identity against the identity the engine computes via `selectedPolicy` versus `compiledRoute`. One hub matched on generation but not on hash.
- [x] T003 Gate the probe's compiled-serving claim on manifest freshness through `manifestFreshness`, so the no-engine-probe path cannot report a false green either.
- [x] T004 Mirror the resolver's serve-time identity binding in the probe, as implemented in `resolve.cjs`: capture the routed result and compare its hash and generation to the selected policy.
- [x] T005 Document the two new drift cause codes `stale-manifest` and `identity-mismatch` in the probe's stated contract.
- [x] T006 Verify the new report against resolver ground truth using `resolveRoute`: the drifted hub reports non-serving and the resolver returns legacy; a healthy hub reports serving and the resolver returns a compiled route.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Back up the activation manifest before any write of `manifest.json`, and record the restore command.
- [x] T008 Attempt the re-mint; it failed closed with a compile error (`compile-error`), leaving the manifest untouched.
- [x] T009 Diagnose the failure: the refresher called the generic canonical compiler `compileCanonicalParent`, which throws on a graduated hub's packet kinds, instead of preferring the shadow-child snapshot the freshness check already uses.
- [x] T010 Prefer the shadow-child snapshot in the refresher via `shadowChildPolicyFor`, falling back to the generic compiler so non-graduated hubs keep prior behaviour.
- [x] T011 Select the generation the compiled policy actually carries, normalizing the field name with `normalizeCurrentPolicy`, after an initial attempt wrote a bumped generation the engine never routes.
- [x] T012 Re-mint the two stale manifests with `refreshCanonicalManifest` and confirm all seven hubs resolve compiled with the probe agreeing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P] Correct the seven hub feature catalogs (`feature-catalog.md`) to describe compiled routing as default-on with the documented kill-switch.
- [x] T014 [P] Regenerate the leaf manifest that omitted a live model profile via `generate-leaf-manifest.cjs --write`; sweep every skill that ships one.
- [x] T015 [P] Align the hub `description.json` version with its authoritative `SKILL.md`.
- [x] T016 [P] Condense the oversized `SKILL.md` under the documented word cap without dropping any distinct instruction or resource pointer.
- [x] T017 [P] Add the required resource frontmatter to the two fixtures under `create-diff/assets/fixtures`, leaving their bodies unchanged.
- [x] T018 Verify the delegated work against a pre-dispatch snapshot of `git status --short` to confirm no out-of-scope file was touched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Status output agrees with resolver ground truth for all seven activated hubs.
- [x] A hub that drifts after minting reports a stale manifest rather than a false green.
- [x] The refresher succeeds for a graduated hub and selects the routed generation.
- [x] Every committed leaf manifest passes its freshness check.
- [x] Strict packaging passes for both touched packets, and the condensed document is under the cap.
- [x] Manifest suite result unchanged from the captured baseline.
- [x] Only in-scope files staged; the co-active session's working tree untouched.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Verification: `checklist.md`, `implementation-summary.md`
- Survey findings: `../research/post-019-angles/`
<!-- /ANCHOR:cross-refs -->
