---
title: "Implementation Plan: Deep Commands Presentation Workflow Separation"
description: "Four-aspect plan to extract presentation contracts from the six mode-based deep commands into _presentation.md assets, thin each router, and align the sk-doc command standard."
trigger_phrases:
  - "deep commands split plan"
  - "deep presentation extraction plan"
  - "deep router rewire plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands"
    last_updated_at: "2026-06-11T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan executed: 6 splits done, parity-verified, remediated"
    next_safe_action: "None; phase complete"
---
# Implementation Plan: Deep Commands Presentation Workflow Separation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode slash commands (`.opencode/commands/deep/`) and assets |
| **Pattern reference** | `commands/speckit/plan.md` (thin router) + `assets/speckit_plan_presentation.md` |
| **Change kind** | Behavior-preserving presentation extraction + router thinning |
| **Verification** | Content-parity diff, `validate.sh --strict`, Fable parity, deep review |

### Overview
Complete the 011 presentation/router split for the deep command family. Each of the six mode-based deep commands keeps its `_auto.yaml` / `_confirm.yaml` workflow assets and gains a new `deep_<command>_presentation.md` carrying the display contract, while its `.md` is rewritten as a thin router. Content is relocated, never rewritten, so behavior is preserved.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Reference shape identified (speckit router + presentation asset)
- [x] Six in-scope commands enumerated; two thin commands flagged out of scope

### Definition of Done
- [x] All six commands split (router + presentation asset), behavior preserved
- [x] Content-parity diff confirms no presentation content dropped
- [x] sk-doc command standard documents the split + presentation template asset added
- [x] Docs updated (spec/plan/tasks/implementation-summary)

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin router + owned assets. The command `.md` resolves mode and loads three owned assets; the workflow YAML owns execution and agent dispatch; the presentation Markdown owns visible prompts, dashboards, and result displays.

### Key Components
- **Router** (`<command>.md`): frontmatter, Phase 0 / mandatory gate where it governs routing, Router Contract, Owned Assets table, Mode Routing, Execution Targets, Presentation Boundary, Workflow Summary.
- **Presentation asset** (`deep_<command>_presentation.md`): Startup Presentation, Dashboard/Checkpoint Layout, Results Display, Next-Step Suggestions.
- **Workflow assets** (`deep_<command>_auto.yaml`, `deep_<command>_confirm.yaml`): unchanged.

### Data Flow
1. User invokes `/deep:<command>` with optional `:auto` / `:confirm`.
2. Router resolves mode; for display it loads the presentation asset; for execution it loads the matching workflow YAML.
3. Presentation asset supplies every visible prompt, dashboard, and result template.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory and Extract
- [x] Enumerate inline presentation blocks per command, marking router-governing vs display-only

### Phase 2: Author Presentation and Rewire Routers
- [x] Author `deep_<command>_presentation.md` per command (display content verbatim in meaning)
- [x] Rewrite each `<command>.md` as a thin router referencing its three owned assets

### Phase 3: Verify and Align
- [x] Content-parity diff per command (no presentation content dropped)
- [x] Verify and document the two thin commands as out of split scope
- [x] Align `command_template.md` + add `command_presentation_template.md`

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Content parity | Pre-split `.md` vs router + presentation asset | grep/diff per command |
| Structural | Router references all three assets; no inline presentation contract | grep |
| Spec validation | This spec folder | `validate.sh --strict` |
| Accuracy | No behavior or display content lost | Fable 5 parity pass + deep review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 011 sibling split pattern | Internal | Green | Reference shape unavailable |
| Existing deep `_auto`/`_confirm` YAMLs | Internal | Green | Workflow ownership already in place |
| speckit router + presentation reference | Internal | Green | No canonical shape to mirror |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A router or presentation asset regresses display or routing behavior.
- **Procedure**:
  1. Revert the affected command's `.md` and `_presentation.md` to the pre-split `.md`.
  2. The `_auto.yaml` / `_confirm.yaml` workflow assets are untouched, so execution is unaffected by a router revert.
  3. Each command split is independent, so a single revert does not affect the others.

<!-- /ANCHOR:rollback -->
