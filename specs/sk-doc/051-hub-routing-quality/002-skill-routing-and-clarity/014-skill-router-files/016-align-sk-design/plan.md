---
title: "Implementation Plan: Phase 16: align-sk-design"
description: "An alignment pass over sk-design after the router move. An operator-local alignment check found stale router credits and section citations, a fix lane and a router-prose pass corrected them, and a recheck plus the router-file resolver proved that routing did not change."
trigger_phrases:
  - "align sk design plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: align-sk-design

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs and one JSON metadata file under `.skilled/skills/sk-design/`; Node and Python checks |
| **Framework** | None |
| **Storage** | None; run evidence sits in the run folder outside the checkout |
| **Testing** | The check battery, `package_skill.py --check --strict`, `validate_document.py`, `validate_catalog_package.py`, `check-markdown-links.cjs`, the router-file resolver |

### Overview
The change edits sk-design docs so each names `ROUTER.md` where the router now lives and cites the right sections. An operator-local alignment check found the drift, a DeepSeek fix lane and a follow-up prose pass fixed it, and a full battery recheck classified what still fails. The router-file resolver proves that all 54 skill routers parse identically to HEAD.
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
- [x] The recheck battery reads `{"fail":7,"pass":111,"not_applicable":3}` with each failure classified, `validate_catalog_package.py` reports 0 fail, and the resolver shows all 54 routers identical to HEAD
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: review, critic, fix and recheck pipeline.

### Key Components
- **Four read-only review lanes**: code; skill docs; READMEs, changelogs and env; routing. DeepSeek V4.1 Flash workers ran them, and routing probe prompts were scored against the advisor.
- **Critic and fix lane**: the critic overturned weak findings; a DeepSeek fix lane applied the upheld findings that did not change routing, and a later prose pass fixed the router prose the fix lane was barred from.

### Data Flow
The changed-file set feeds the battery and the four lanes. Their findings go to the critic, the upheld ones go to the fix lane, and the recheck reruns the battery over the edited worktree.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup resolves the file set and runs the first battery, implementation runs the lanes, critic, fix lane, prose pass and catalog fix, and verification reruns the battery and the resolver.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The recheck battery must read `{"fail":7,"pass":111,"not_applicable":3}`, with each failure derived or pre-existing. `validate_catalog_package.py` must report 0 fail, and the router-file resolver must show all 54 skill routers parsing identically to HEAD.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator-local alignment check, DeepSeek V4.1 Flash workers and the router-file resolver. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a later run shows an sk-design route that differs from HEAD.
- **Procedure**: restore the edited sk-design files from HEAD with `git checkout -- <path>`, then rerun the resolver.
<!-- /ANCHOR:rollback -->

---
