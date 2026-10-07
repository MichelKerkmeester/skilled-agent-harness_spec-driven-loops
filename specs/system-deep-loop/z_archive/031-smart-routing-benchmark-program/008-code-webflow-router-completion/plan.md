---
title: "Implementation Plan: Complete code-webflow Inline Router + Fix LANGUAGE_STANDARDS Keywords"
description: "Reconstructed Level 1 implementation plan for the code-webflow router completion phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "code-webflow router completion plan"
  - "webflow language keyword fix plan"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Complete code-webflow Inline Router + Fix LANGUAGE_STANDARDS Keywords

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded |
| **Framework** | sk-code surface child router (`code-webflow`) plus the parent `smart_routing.md` projection |
| **Storage** | Inline `INTENT_SIGNALS`/`RESOURCE_MAP` router block in `code-webflow/SKILL.md`; parent projection in `smart_routing.md` |
| **Testing** | `sk-code-router-sync`, `surface-slice-sync`, `parent-hub-vocab-sync` drift guards; standalone code-webflow router-replay on WF-013 |

### Overview
Land code-webflow's inline router block on the target branch (the parent already declares the webflow surface) so the drift guard stops failing on the webflow side, and correct its `LANGUAGE_STANDARDS` keywords from ts/py/shell to css/html/js in the three copy-paste sites, co-rewriting the WF-013 gold prompt.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Inline child router within a hub-and-satellite surface layout: the child `SKILL.md` owns the inline `INTENT_SIGNALS`/`RESOURCE_MAP` block, and the parent `smart_routing.md` holds a flat projection that must equal the union of the surface children plus a parent-owned tier.

### Key Components
- `code-webflow/SKILL.md` inline router block (absent on the target branch; present natively on 028 and in the working tree)
- Parent `smart_routing.md` machine block and prose reference
- `LANGUAGE_STANDARDS` keyword fix in the child and the two parent sites
- WF-013 scenario prompt (its `expected_resources` are already correct)

### Data Flow
The webflow surface does not sub-slice by language — a frontend task spans css+html+js — so the files stay lumped and only the `LANGUAGE_STANDARDS` keywords change. The child router is compared against the parent projection by `sk-code-router-sync`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Land the inline router
- [ ] Copy the code-webflow inline router content (equal to 028 and the working tree) onto the target branch

### Phase 2: Keyword and prompt fix
- [ ] Fix `LANGUAGE_STANDARDS` keywords to css/html/js in the child and the two parent sites
- [ ] Co-rewrite the WF-013 scenario prompt

### Phase 3: Verification
- [ ] Three drift guards green
- [ ] WF-013 routes exactly its gold under the new keywords and prompt
- [ ] No bare `js` token
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A for unit-level scope — record testing beyond the verification tasks in `tasks.md` here. The spec names the three drift-guard vitests (`sk-code-router-sync`, `surface-slice-sync`, `parent-hub-vocab-sync`) and the standalone code-webflow router-replay run on WF-013.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 (parent webflow projection + opencode split, already landed) | Internal | Landed per spec | The child router has no parent projection to match |
| The target branch's `code-webflow/SKILL.md` and parent `smart_routing.md` | Internal | Available | No site to land the router or fix the keywords |

The change is low blast radius and single surface.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded. The spec scopes any revert to webflow only, excluding the broader operator-sweep working-tree changes, opencode files and the 028 to v4 migration.
<!-- /ANCHOR:rollback -->
