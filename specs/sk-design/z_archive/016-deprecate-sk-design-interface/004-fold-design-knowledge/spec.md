---
title: "Feature Specification: Fold a condensed design-knowledge layer into the standalone skill"
description: "Phase 004 distills a condensed general design-knowledge layer (Brand-vs-Product register, anti-slop principles, cognitive and numeric design laws, design-token vocabulary, and a design-principles digest) from the soon-to-be-deleted sk-design hub into references/design-knowledge/ of the standalone md-generator, and repoints the 3 dangling ../shared/* links to the local copies."
trigger_phrases:
  - "fold design knowledge"
  - "condensed design layer md-generator"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/004-fold-design-knowledge"
    last_updated_at: "2026-08-19T06:07:13Z"
    last_updated_by: "spec-author"
    recent_action: "Authored 8 design-knowledge files, repointed 3 links, verified zero ../shared refs"
    next_safe_action: "Phase 005: delete hub + interface commands (operator-gated hard stop)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/references/design-knowledge/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Fold a condensed design-knowledge layer into the standalone skill

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
| **Mutation Class** | mutates (new reference files + 3 link repoints) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The extraction skill graduated out of a hub that also owned a shared design-knowledge base (`sk-design/shared/`) and a broader interface-direction mode. That hub is deleted in 005, which would strand three `../shared/*` register links and leave the standalone skill able to extract CSS but carrying no design judgment of its own.

**Purpose (Q3):** give the standalone skill a *condensed* general design-knowledge layer — less expanded than the hub originals — so it "knows design, not only extraction," and repoint the dangling links to local copies. The layer makes the advisor identity authored in 003 (which advertises register / anti-slop / cognitive-laws / numeric-laws / token-vocabulary / design-principles) honest.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Create `.opencode/skills/sk-design-md-generator/references/design-knowledge/` with a condensed layer: `register.md`, `register-card.md`, `anti-slop-principles.md`, `cognitive-laws.md`, `numeric-design-laws.md`, `design-token-vocabulary.md`, a new `design-principles-digest.md`, and a `README.md` index.
- Adapt the folded copies to the extraction skill's posture: the register is *recorded from the extracted surface*, never authored from a brief; drop cross-references to the sibling hub modes being deleted (interface/foundations/motion/audit).
- Repoint the 3 dangling links (`SKILL.md`, `references/authoring-boundary.md`, `assets/source-of-truth-router-card.md`) to the local copies.

**Out of scope**

- Copying the full interface references verbatim — the point is a *condensed* layer, not re-homing the deprecated mode.
- Deleting the hub (005) or reconciling external/repo-wide references (006).
- Any styles-corpus or backend change.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — The 8 design-knowledge files exist and are self-contained (no link escapes `references/design-knowledge/` to a deleted hub path).
- **REQ-002** — Folded copies are faithful to their sources on the design substance, and trimmed to the md-generator posture (register recorded not authored; no sibling-mode handoff).
- **REQ-003** — The 3 previously-dangling links resolve to the new local copies.
- **REQ-004** — No `../shared/` or `../../shared/` reference remains anywhere in the standalone skill's markdown.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `grep -rn '\.\./shared' .opencode/skills/sk-design-md-generator --include=*.md` returns nothing.
- The 3 repointed links resolve to existing files under `references/design-knowledge/`.
- `design-principles-digest.md` carries the reusable design judgment (subject-grounding, thesis hero, earned deviation, restraint, writing-as-material) without the hub's build-time process machinery.
- Executor: cli-devin `gemini-3-7-flash-high` (plan-named), output verified against sources by the main agent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk: a fast model over-condenses or drops substance / mis-trims the mode handoff** — mitigated by main-agent verification of every folded file against its source, with in-place repair.
- **Risk: writes do not persist / dispatch dies** — mitigated by the plan's fallback ladder (GLM 5.2 high, then in-context authoring), documented if used.
- **Dependency:** 003 (standalone identity). Downstream: 005 can safely delete `shared/` only after this fold lands; 006 reconciles the remaining external references.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The digest's exact length is a judgment call bounded by "condensed" (target 70-90 lines); the main agent trims if the model overshoots.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-navigation -->
## PHASE NAVIGATION

- **Parent:** `../spec.md`
- **Predecessor:** `../003-standalone-rewire-and-metadata/spec.md`
- **Successor:** `../005-delete-hub-and-interface-commands/spec.md`
<!-- /ANCHOR:phase-navigation -->
