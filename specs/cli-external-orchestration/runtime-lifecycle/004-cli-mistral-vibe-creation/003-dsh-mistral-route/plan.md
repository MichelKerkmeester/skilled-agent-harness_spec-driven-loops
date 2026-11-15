---
title: "Implementation Plan: Phase 3: dsh-mistral-route"
description: "Add a third dsh route patch for Mistral's DeepSeek V4.1 Flash 1017, admit it in the roster and dispatch guard, and prove it with a keyed run."
trigger_phrases:
  - "dsh mistral route plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: dsh-mistral-route

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML patch, JSON rules, TypeScript dispatch hook |
| **Framework** | DeepSeek Harness 0.2.2-rc.3 |
| **Storage** | None |
| **Testing** | `dsh --dump-config`, keyed headless dispatch, dispatch hook tests |

### Overview
Promote the scratch draft to `.dsh/patches/`, then update the three places that name the roster together, as `cli-deepseek-harness/references/providers-and-models.md` §5 requires. A keyed harmless dispatch decides whether the route works.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The draft patch composes offline (`spec.md` Measured Behavior)
- [ ] `MISTRAL_API_KEY` is exported in dispatched shells

### Definition of Done
- [ ] A keyed dispatch exits 0 with `final.reason.kind` `completed`
- [ ] The dispatch hook tests pass with the third patch admitted
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Route patch layer.

### Key Components
- **Route patch**: replaces the `llm-pi-ai` provider row and `agent-default-model`.
- **Dispatch preflight**: refuses any `--patch` outside the roster before launch.

### Data Flow
The preflight checks the literal patch path, dsh composes the patches, and the `mistral` provider calls `https://api.mistral.ai/v1/chat/completions` with the key from the environment.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup locates the preflight's roster list and confirms the key is exported. Implementation adds the patch and updates the roster, the rule message and the preflight together. Verification runs `--dump-config`, two keyed dispatches and the dispatch hook tests. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A keyed dispatch is read by its `final` event and stderr, never by exit code alone. An unlisted patch must still be refused after the change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`dsh` 0.2.2-rc.3 on PATH and `MISTRAL_API_KEY`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the keyed run fails for a reason the patch cannot fix. Remove the patch file and revert the roster, rule and preflight edits in one commit.
<!-- /ANCHOR:rollback -->

---
