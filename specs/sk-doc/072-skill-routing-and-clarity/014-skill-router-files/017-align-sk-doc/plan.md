---
title: "Implementation Plan: Phase 17: align-sk-doc"
description: "An alignment pass over sk-doc after the router move. An operator-local alignment check found stale router credits, a fix lane and a router-prose pass corrected them, validate_document.py gained a skill_router type, and a recheck plus the router-file resolver proved that routing did not change."
trigger_phrases:
  - "align sk doc plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: align-sk-doc

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, JSON and Python 3 under `.skilled/skills/sk-doc/`; the repository `.env.example` |
| **Framework** | None |
| **Storage** | None; run evidence sits in the run folder outside the checkout |
| **Testing** | The check battery, `package_skill.py --check --strict`, `validate_document.py`, `test_validator.py`, `check-markdown-links.cjs`, the router-file resolver |

### Overview
The change edits sk-doc docs, templates and catalogs so each names `ROUTER.md` where the router now lives, and gives `validate_document.py` a `skill_router` type for a file named `ROUTER.md`. An operator-local alignment check found the drift, a DeepSeek fix lane and a follow-up prose pass fixed it, and a full battery recheck classified what still fails. The router-file resolver proves that all 54 skill routers parse identically to HEAD.
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
- [x] The recheck battery reads `{"pass":190,"not_applicable":4,"fail":6}` with each failure classified, `test_validator.py` prints `SUMMARY: 15/15 tests passed`, and the resolver shows all 54 routers identical to HEAD
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

Follow the ordered tasks in `tasks.md`. Setup resolves the file set and runs the first battery, implementation runs the lanes, critic, fix lane, prose pass, validator type and env rows, and verification reruns the battery, the validator tests and the resolver.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`/usr/bin/python3 scripts/tests/test_validator.py` must print `SUMMARY: 15/15 tests passed`. The recheck battery must read `{"pass":190,"not_applicable":4,"fail":6}` with each failure classified, and the router-file resolver must show all 54 skill routers parsing identically to HEAD.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator-local alignment check, DeepSeek V4.1 Flash workers, `/usr/bin/python3` and the router-file resolver. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a later run shows an sk-doc route that differs from HEAD, or the `skill_router` type rejects a valid ROUTER.md.
- **Procedure**: restore the edited files from HEAD with `git checkout -- <path>`, then rerun the resolver and `test_validator.py`.
<!-- /ANCHOR:rollback -->

---
