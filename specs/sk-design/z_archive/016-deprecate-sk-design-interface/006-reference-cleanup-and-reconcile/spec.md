---
title: "Feature Specification: Repo-wide reference cleanup and reconcile after the sk-design delete"
description: "Phase 006 reconciles every live cross-skill contract that named the deleted sk-design hub — advisor graph identity + edges, command bridges, advisor/contract tests, and cross-skill docs — reframing the retired judgment capability as out-of-scope rather than falsely repointing it at the surviving extraction leaf, and records the documented-residual set left to main-side regeneration."
trigger_phrases:
  - "reconcile sk-design references"
  - "sk-design reference cleanup"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/006-reference-cleanup-and-reconcile"
    last_updated_at: "2026-08-19T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Reconciled live advisor graph + command bridges + tests + docs; recorded residuals"
    next_safe_action: "validate.sh --strict on the packet + skill root; operator-gated scoped commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/command-bridges.generated.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Repo-wide reference cleanup and reconcile after the sk-design delete

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Structure** | Phase child of `016-deprecate-sk-design-interface` |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/016-deprecate-sk-design-interface` |
| **Parent Spec** | ../spec.md |
| **Mutation Class** | mutates (live-contract edits + generated-artifact regeneration) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 005 deleted the `sk-design` judgment hub and the `interface` command namespace. `sk-design` was not just a folder — it was an advisor-routed identity, a set of graph edges other skills declared toward it, a command-bridge projection, an assertion target in advisor/contract tests, and a named boundary in cross-skill docs. Deleting the folder alone leaves those references dangling.

**Purpose:** reconcile every *live* reference to the deleted hub so nothing routes, tests against, or documents a hub that no longer exists — while being honest about what the survivor is. The survivor (`sk-design-md-generator`) is a measured-CSS *extraction* leaf; it is **not** a design-judgment authority. So where the hub appeared as a judgment hub in an enumeration, the reference is **removed** (a leaf cannot replace a hub), and where a doc drew a boundary against design *taste*, that capability is reframed as **out of scope** — never falsely repointed at the extraction leaf.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope — live contracts reconciled**

- **Advisor graph identity + edges:** the survivor's `graph-metadata.json` `family` corrected to `sk-util`; the `depends_on` (mcp-tooling) and `siblings` (sk-code) edges that targeted the survivor removed so the graph is symmetric and hub-free.
- **Command bridges:** `command-bridges.generated.json` (+ `projection.ts` + `skill_advisor.py`) regenerated from `derive-command-bridges.cjs` so the sk-design hub node and the two `interface:` command nodes are gone.
- **Advisor / contract tests:** hub removed from `command-binding-existence` HUBS + namespaces; `skill-root-metadata-contract` expected-classes updated (hub removed, survivor added as standalone); command-bridge count guards retuned (drift-guard, metadata-e2e); the single benign routing-graph parity ripple recorded in both parity suites + the approved-divergences fixture (operator-authorized).
- **Cross-skill docs:** the retired design-*judgment* boundary reframed as "out of scope" in `sk-create-diff` / `sk-create-diagram` docs; the sk-design design-task variant removed from the minimax model card; sk-design dropped from the manual-testing-playbook package manifest + its validator.
- **Leaf manifests:** `system-deep-loop` and the survivor leaf-manifests/aliases regenerated (`--fix`) to drop the deleted adapters and re-key the survivor.

**Out of scope — documented residual (left as-is by decision)**

- **Generated routing artifacts:** the compiled-routing `006-sk-design/` cohort, `compiled-route-*.cjs`, `serving-closure.manifest.json`, and the advisor diagnostic `skill-graph.json` are rebuilt by their own tooling on `main` (they were already stale/broken in this checkout); regenerating them here would fight a main-side rebuild.
- **Frozen evidence:** benchmark reports, deep-improvement `fixtures/sk-design*`, historical model-benchmark records, and prior `specs/**` stay as dated record.
- **Illustrative examples:** skill-creation templates, the command-contract worked-example, and manual-testing-playbook scenarios that use `sk-design` as a teaching example are left; they document a pattern, not a live route.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — No live runtime contract routes to, depends on, or asserts the existence of the deleted `sk-design` hub: README/AGENTS/opencode.json/README.txt, all six runtimes' agent defs, and `cli-*/SKILL.md` return zero live hub references.
- **REQ-002** — The advisor graph is hub-free and symmetric: the survivor's `family` is a valid allowed value (`sk-util`), and no skill declares a dangling edge toward the deleted hub or an asymmetric edge toward the survivor.
- **REQ-003** — Generated command-bridge artifacts are regenerated from tooling (not hand-edited) and contain zero `sk-design` references.
- **REQ-004** — Every retired *judgment* capability is reframed as out-of-scope or removed from enumerations; none is falsely repointed at the extraction leaf.
- **REQ-005** — The single benign parity divergence introduced by removing the hub nodes is reviewed, confirmed not a genuine regression, and recorded in every baseline it touches (operator-authorized).
- **REQ-006** — The documented-residual set (generated artifacts + frozen evidence + illustrative examples) is enumerated so the deferral is explicit, not a silent gap.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Live-surface sweep: `rg -P 'sk-design(?!-md-generator)'` over README/AGENTS/opencode.json/README.txt/agent-defs/`cli-*` SKILL surfaces returns zero live hub references (frozen `benchmark/reports/**` excluded).
- Advisor graph: survivor `family` = `sk-util`; graph-health asymmetry count is no worse than the pre-existing HEAD baseline; no edge targets the deleted hub.
- Command bridges: `command-bridges.generated.json` has zero `sk-design`; the drift-guard and metadata-e2e count guards pass at their retuned values.
- Parity: both parity suites and the approved-divergences fixture carry the recorded benign divergence and re-run green.
- `validate.sh --strict` on the 005 + 006 children and the packet returns Errors: 0; Class-S PASS on the survivor skill root.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk: false repoint** — mechanically repointing a hub reference at the survivor would misrepresent an extraction leaf as a judgment authority. Mitigated by the remove-or-reframe rule (REQ-004): enumerations drop the hub, boundaries become "out of scope".
- **Risk: hand-editing generated artifacts** — command bridges are regenerated from `derive-command-bridges.cjs`, not hand-patched, so the projection stays a faithful function of the metadata (REQ-003).
- **Risk: masking a real regression as "benign drift"** — mitigated by confirming the divergence was green at the pre-delete HEAD baseline before recording it, and by keeping it a single reviewed row, not a blanket allowance (REQ-005).
- **Dependency:** 005 (delete). The generated-artifact regeneration depends on a main-side rebuild pass (documented residual), not on this phase.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Generated-artifact regen timing (deferred, not blocking):** the compiled-routing cohort and advisor `skill-graph.json` are regenerated by their own tooling on `main`; this packet records them as documented residual rather than fighting a main-side rebuild inside a feature checkout.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-navigation -->
## PHASE NAVIGATION

- **Parent:** `../spec.md`
- **Predecessor:** `../005-delete-hub-and-interface-commands/spec.md`
- **Successor:** `../007-rename-design-reference-to-extract/spec.md`
<!-- /ANCHOR:phase-navigation -->
