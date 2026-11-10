---
title: "Implementation Plan: Phase 60: v4-0-0-13-changelog-rewrite"
description: "Three DeepSeek v4.1 flash writers ran in parallel through cli-pi to rewrite the unreleased v4.0.0.13 changelog, one for the top matter, one for the two headline sections and one for the rest. The parts were assembled, polished once and then checked by three separate read-only DeepSeek sessions, two of which failed before the third passed. Both content validators gate the result."
trigger_phrases:
  - "v4 0 0 13 changelog rewrite plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 60: v4-0-0-13-changelog-rewrite

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, edited under the `sk-create-changelog` contract |
| **Framework** | DeepSeek v4.1 flash at max thinking through cli-pi on llmgateway for the three writers, and separate read-only DeepSeek sessions for the review rounds |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py` and three read-only review rounds |

### Overview
The file is rebuilt in three parts at once: the top matter, the two headline sections and everything after them. Each writer was told to use only facts already in the previous changelog, so the rewrite cannot invent a claim. The parts are assembled into one file and given a single polish pass for voice and joins, then a separate read-only DeepSeek session checks every sentence against that previous changelog. Round 1 and round 2 failed, round 3 passed, and each round's findings went back as fixes. The validators run last, over the finished file.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
- [ ] Commit and push to main
- [ ] Confirm CI green at the pushed commit and the index rebuild after it
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a single-file editorial rewrite split across three parallel writers, with one assembly pass, one polish pass, a read-only review loop and two content validators as the gate.

### Key Components
- **`.skilled/changelog/skilled/v4.0.0.13.md`**: the only file edited. The title, the top matter, both headline sections and the remaining sections are what the phase rewrites.
- **The three writers**: one each for the top matter, the two headline sections and the remaining sections. Their parts overlap only at the joins, which the assembly pass owns.
- **The v4.0.0.0 changelog**: the operator's style exemplar, which supplies the voice rather than the facts.
- **The read-only reviewers**: separate DeepSeek sessions that see the previous changelog and the rewrite, and return findings instead of edits.
- **`validate_document.py` and `hvr_scan.py`**: the content gate, run over the finished file.

### Data Flow
Operator request, then three parallel briefs to DeepSeek v4.1 flash at max thinking through cli-pi on llmgateway, then the three parts, then one assembly and one polish pass, then three read-only review rounds whose findings feed back as fixes, then the validators.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The changelog cannot be executed, so its gate is content: `validate_document.py` for structure and required content, `hvr_scan.py` for human-voice rules and a read-only reviewer that checks every sentence against the previous changelog. The reviewer ran three times because the first two rounds found real errors. Round 1 found two P1s, a title that claimed sessions never run out and an interrupted-hop sentence that had lost its condition, plus many P2s about dropped detail. Round 2 found one P1, the live-test and side-by-side claims attached to agents, commands and config, plus four P2s. Round 3 passed with two P2s. Every P1 was fixed before the next round, ten round-1 P2s were restored and three round-2 P2s were fixed. The rest of the shortening is recorded as deliberate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The facts come from the changelog as 057 left it, and no writer was allowed to reach past it. The `sk-create-changelog` contract supplies the section grammar, the 12-bullet glance ceiling and the voice rules. The v4.0.0.0 changelog supplies the style the operator asked for. The writers and the reviewers are separate DeepSeek sessions run through cli-pi on llmgateway, and the reviewers are read-only by instruction. The new default model stays out of the rewrite because phase 058 owns that switch and had not landed on main, so `llmgateway/deepseek-v4.1-flash` remains the stated default on both versions.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

One file changed, so `git checkout -- .skilled/changelog/skilled/v4.0.0.13.md` restores the previous changelog, and this folder's docs and the parent's phase rows can be removed with it. Nothing in the release notes describes behaviour that a rollback would alter, because the release itself is unchanged.
<!-- /ANCHOR:rollback -->

---
