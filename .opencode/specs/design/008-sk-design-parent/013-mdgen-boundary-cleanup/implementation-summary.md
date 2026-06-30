---
title: "Implementation Summary: sk-design md-generator authoring boundary and family cleanup"
description: "Executed. Added the md-generator authoring-boundary reference and source-of-truth router card, fixed the stale design-audit changelog pointer, and ran the family-wide closeout. The family package_skill --check passes (exit 0) and validate.sh passes across the family. The advisor rebuild is deferred on purpose."
trigger_phrases:
  - "sk-design md-generator boundary status"
  - "design family cleanup phase outcome"
importance_tier: "important"
contextType: "implementation"
status: executed
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/013-mdgen-boundary-cleanup"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the two md-gen docs, fixed the changelog pointer, family --check passes clean"
    next_safe_action: "Family build complete pending commit, advisor rebuild deferred and run anytime"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-013-mdgen-boundary-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three-dials ownership resolved in earlier phases: VISUAL_DENSITY to foundations, DESIGN_VARIANCE and the dials intake to interface in brief_to_dials.md reading the shared register, MOTION_INTENSITY to motion"
      - "N1/N2 owning home resolved in earlier phases: interface-owned and authored once, audit references the gates by path"
---
# Implementation Summary: sk-design md-generator authoring boundary and family cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-sk-design-parent/013-mdgen-boundary-cleanup |
| **Completed** | Executed: two md-generator docs built and wired, changelog pointer fixed, family closeout passes |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The final phase of the 009 deliverable is executed: two md-generator documentation files, one surgical changelog-pointer fix, and the family-wide validation closeout.

### design-md-generator (2 files)
- `references/authoring_boundary.md` (121 lines) documents the source-of-truth boundary: values MEASURED from a real site vs BRIEF-PROVIDED vs INFERRED vs ABSENT. It protects the cardinal fidelity rule and states forward-authoring as explicitly OUT OF SCOPE, so the reference is boundary documentation only and adds no forward-authoring capability. It is wired into the md-generator SKILL.md router.
- `assets/source_of_truth_router_card.md` (82 lines) is the quick routing card asking measured / brief-provided / inferred / missing at the point of use, routing a missing backing to ABSENT rather than a fabricated value. It is wired into the md-generator SKILL.md router.

The md-generator cardinal fidelity rule is byte-unchanged: these two files document and operationalize the existing rule without altering it.

### Cleanup fix
- `design-audit/SKILL.md` section 8 cited the removed `changelog/v1.0.0.1.md`. The pointer was repointed to `changelog/v1.0.0.0.md`, the only changelog file that exists, and zero stale `v1.0.0.1` references remain.

### Family closeout
- `package_skill --check` passes (exit 0) on the hub and ALL FIVE modes: design-interface, design-foundations, design-motion, design-audit, and design-md-generator. All design content across phases 010-013 is HVR-clean.
- `validate.sh` passes across the family.
- The skill-advisor rebuild was deferred on purpose, not skipped silently (see the Verification section for the rationale).

All files are HVR-clean (no em dashes, no semicolons, no Oxford commas).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A documentation-and-cleanup pass grounded in `../009-reference-asset-expansion/research/research.md` (section 3.6 "design-md-generator", section 7 "Open Questions / Divergences"). The two md-generator docs were authored and wired into the md-generator SKILL.md router, the one surgical changelog-pointer fix was applied in `design-audit/SKILL.md`, then the family-wide packaging and validation closeout was carried. As the final phase, it follows the earlier 009 phases and the predecessor `../012-foundations-motion-audit` (planned). The grounding source is the 009 research deliverable, and each artifact traces back to section 3.6 and section 7.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document the source-of-truth boundary, do not build forward-authoring | The 009 research reconciled the one md-generator divergence. The measured-vs-authored boundary documentation is in scope and low-risk, and the forward-authoring capability stays out of scope and routes to a separate future `design-spec` decision |
| Treat md-generator as otherwise done | The research found md-generator the leanest target (essentially complete), so this phase added only the boundary reference and the router card, not a broader expansion |
| Keep the cardinal fidelity rule byte-unchanged | The two new files document and operationalize the existing rule. Editing the rule itself was out of scope, so it was left intact |
| Fold the changelog fix into this phase | The research flagged the dangling `v1.0.0.1.md` pointer in `design-audit/SKILL.md` as a pre-existing defect to fix alongside, so this final phase carries it with the family closeout |
| Carry the family-wide validation closeout here | As the last phase, it is the natural home for the package-check and `validate.sh` across the family |
| Defer the advisor rebuild on purpose | Phases 010-013 added references and assets and wired routers but changed no mode advisor-routable identity (name, description, keywords), so the advisor index does not need rebuilding. A rebuild was also avoided to not collide with concurrent advisor work on this branch. The operator can run `advisor_rebuild` anytime |
| Record how the upstream build-time decisions resolved | The three-dials ownership and N1/N2 owning home were settled across 010-012. N1/N2 were authored once in interface and referenced by audit, and the dials intake lives in interface's `brief_to_dials.md` reading the shared register |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `references/authoring_boundary.md` created (documentation only, excludes forward-authoring) | PASS (121 lines, forward-authoring explicitly out of scope, wired into the router) |
| `assets/source_of_truth_router_card.md` created (four-question card) | PASS (82 lines, routes a missing backing to ABSENT, wired into the router) |
| md-generator cardinal fidelity rule unchanged | PASS (byte-unchanged) |
| `design-audit/SKILL.md` changelog pointer resolves to an existing file | PASS (repointed to `changelog/v1.0.0.0.md`, zero stale `v1.0.0.1` refs) |
| `package_skill --check` on the hub and all five mode packets | PASS (exit 0, design content across 010-013 HVR-clean) |
| `validate.sh` across the family | PASS |
| Skill-advisor rebuild | DEFERRED ON PURPOSE (no advisor-routable identity changed across 010-013, and a rebuild was avoided to not collide with concurrent advisor work on this branch, operator can run `advisor_rebuild` anytime) |
| `validate.sh --strict` on this packet | PASS (0 errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **These are knowledge files, not enforcement.** The boundary reference and router card document and operationalize the cardinal fidelity rule, but the md-generator workflow must read and apply them. This phase wires no automatic gate into a runtime.
2. **The advisor index was not rebuilt.** The rebuild was deferred on purpose because no mode advisor-routable identity changed across 010-013, and to avoid colliding with concurrent advisor work on this branch. If the operator wants the index refreshed, they can run `advisor_rebuild` at any time.
3. **The boundary stays documentation.** This phase introduced no forward-authoring capability. That remains a separate future `design-spec` decision.
4. **Predecessor ordering.** The predecessor `../012-foundations-motion-audit` is still marked planned. This phase carried the family-wide closeout as the final phase, and the family build is complete pending commit.
<!-- /ANCHOR:limitations -->
