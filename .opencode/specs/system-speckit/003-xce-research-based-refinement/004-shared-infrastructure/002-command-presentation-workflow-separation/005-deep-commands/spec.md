---
title: "Feature Specification: Deep Commands Presentation Workflow Separation"
description: "Extend the 011 presentation/router split to the deep command family: extract inline presentation into per-command _presentation.md assets and thin each fat command router, completing the half-split deep family."
trigger_phrases:
  - "deep command presentation separation"
  - "deep commands thin router"
  - "deep presentation contract extraction"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands"
    last_updated_at: "2026-06-11T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed 6-command split + sk-doc alignment; Fable parity PASS, P2s remediated"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/commands/deep/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-005-deep-commands-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator locked presentation extraction format to Markdown (inherited from 011)."
      - "Extend phase 011 with a deep-commands child rather than a new top-level packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Deep Commands Presentation Workflow Separation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation |
| **Predecessor** | 004-doctor-commands |
| **Successor** | None |
| **Handoff Criteria** | Each split deep command renders startup, dashboard, and results from its `_presentation.md`; routers carry no inline presentation; behavior preserved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 011 separated workflow routing from Markdown presentation contracts across four command families — memory, speckit, create, and doctor. Each command in those families became a thin router that resolves mode and loads three owned assets: `_auto.yaml` (auto workflow), `_confirm.yaml` (confirm workflow), and `_presentation.md` (startup questions, dashboards, results display).

The deep command family was left half-split. The six mode-based deep commands already have `_auto.yaml` and `_confirm.yaml` workflow assets and reference them for execution, but their command `.md` files still carry all presentation content inline (consolidated setup prompts, output formats, dashboards, next-step suggestions) and remain 429 to 573 lines long rather than thin routers. No `_presentation.md` asset exists for any deep command. This phase completes the split for the deep family, matching the four siblings.

This leaf executes the same four-aspect model the sibling families used — inventory and extract, author presentation Markdown, router rewire, verify and UX — as plan phases within a single spec folder rather than nested child folders, because the deep family is uniform.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep command routers own presentation instructions inline with routing and workflow-reference instructions. The files are long (429 to 573 lines), which makes the display contract hard for assistants to find and follow, and inconsistent with the four sibling command families that already extracted presentation into dedicated Markdown.

### Purpose
Extract the inline presentation contract from each mode-based deep command into a dedicated `deep_<command>_presentation.md` asset, and rewrite each command `.md` as a thin router that resolves mode and loads its three owned assets, preserving behavior and leaving no presentation contract inline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Six mode-based deep commands: `ask-ai-council`, `start-agent-improvement-loop`, `start-context-loop`, `start-model-benchmark-loop`, `start-research-loop`, `start-review-loop`.
- For each: author `deep_<command>_presentation.md` (startup presentation, dashboard layout, results display, next-step suggestions) and rewrite `<command>.md` as a thin router.
- Verify the non-mode-based deep command (`start-skill-benchmark-loop`, ~95 lines) is already thin and document it as out of split scope.
- Align the sk-doc command-creation standard (`command_template.md`) to document the presentation/router split as the canonical pattern for mode-based workflow command families, and add a presentation-contract template asset.

### Out of Scope
- Changing workflow behavior, routing semantics, agent dispatch, or the existing `_auto.yaml` / `_confirm.yaml` workflow assets (beyond confirming they own the workflow).
- The thin non-mode `start-skill-benchmark-loop` command beyond verification.
- Other command families (already split in 011).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_<command>_presentation.md` (×6) | Create | Extracted presentation contract per mode-based command |
| `.opencode/commands/deep/<command>.md` (×6) | Modify | Rewrite as thin router referencing the three owned assets |
| `.opencode/skills/sk-doc/assets/command_template.md` | Modify | Document the presentation/router split standard |
| `.opencode/skills/sk-doc/assets/command_presentation_template.md` | Create | Presentation-contract template asset |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- **REQ-001 Behavior preserved.** No presentation content is lost or altered in meaning. Every startup question, mode-resolution rule, dashboard, output format, and next-step suggestion that lived inline is present in the `_presentation.md` asset.
- **REQ-002 Thin router contract.** Each rewritten `<command>.md` resolves mode and references its `_auto.yaml`, `_confirm.yaml`, and `_presentation.md`, and contains no inline presentation contract, matching the speckit router shape.

### P1 - Required (complete OR user-approved deferral)
- **REQ-003 sk-doc alignment.** `command_template.md` documents the split pattern, and a presentation-contract template asset exists, so future mode-based workflow commands follow the convention.
- **REQ-004 Frontmatter and routing intact.** Each command keeps its existing frontmatter (`description`, `argument-hint`, `allowed-tools`) and Phase 0 / mandatory-gate behavior.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All six mode-based deep commands have a `deep_<command>_presentation.md` asset and a thin-router `.md`.
- A diff-level check confirms no presentation content was dropped (only relocated).
- The two thin commands are verified and documented as out of scope.
- sk-doc `command_template.md` documents the split, and the presentation template asset exists.
- `validate.sh --strict` on this spec folder passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Content loss during extraction.** Mitigation: diff each command's pre-split content against router + presentation.md, asserting every presentation block is accounted for.
- **Router under-thinning or over-thinning.** Mitigation: hold each router to the speckit router contract (mode routing, owned-assets table, presentation boundary, workflow summary).
- **Deep commands are more complex than speckit (Phase 0 gates, fan-out examples).** Mitigation: keep Phase 0 / mandatory-gate and command-chain content in the router where it governs routing, move only display/presentation content to the asset.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for scaffold. Implementation may surface per-command presentation blocks that are ambiguous between router-governing and display-only; resolve toward keeping routing logic in the router and display content in the asset.
<!-- /ANCHOR:questions -->
