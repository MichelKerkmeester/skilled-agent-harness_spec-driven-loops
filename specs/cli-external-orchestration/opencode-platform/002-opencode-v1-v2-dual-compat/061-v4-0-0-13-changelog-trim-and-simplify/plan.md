---
title: "Implementation Plan: Phase 61: v4-0-0-13-changelog-trim-and-simplify"
description: "Trim and simplify the v4.0.0.13 changelog by removing two unwanted topics, replacing internal jargon with plain words, applying the framing rule that OpenCode 2 is expected and recommended with OpenCode 1 as temporary backwards compatibility, reordering every section by user impact and cutting the file to 2961 words with 11 glance bullets. Four parallel section drafts plus one assembly pass produce the file, then both content validators and three read-only review rounds check it."
trigger_phrases:
  - "v4 0 0 13 changelog trim and simplify plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 61: v4-0-0-13-changelog-trim-and-simplify

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown release note |
| **Framework** | `sk-create-changelog` section grammar and voice rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, read-only DeepSeek review |

### Overview
The work removes the Resident Memory and MCP Tooling topics and their four spec-folder line entries, then rewrites the remaining story in plain words and impact order. Four DeepSeek v4.1 flash writers draft one section each at max thinking, and one assembly pass joins them into a single file at 2961 words with an 11-bullet glance list. A mid-task operator rule frames OpenCode 2 as the version the framework expects and recommends, with OpenCode 1 as temporary backwards compatibility and no removal date; a DeepSeek fix pass applied it to the title, the trigger phrase, the H2 heading, the prose order and the upgrade notes. Both content validators then pass, and three read-only review rounds close the content: round 1 returned FAIL with four P1 findings, all fixed by a DeepSeek fix pass that also restored two lost facts as the `Saved State and Test Suites Hold Up` Reliability Fixes item; round 2 returned PASS with four P2 findings, three fixed by hand and the fourth carried by the records update; round 3 returned FAIL with one P1, fixed by hand, and one P2, with two further P2s recorded rather than fixed.
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
- [x] Read-only review findings fixed or recorded (round 1 FAIL, four P1 fixed; round 2 PASS, four P2, three fixed by hand and the fourth carried by the records update; round 3 FAIL, one P1 and one P2 fixed by hand, two P2s recorded)
- [ ] Commit pushed to main with CI green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file documentation edit with a parallel draft and assembly pass.

### Key Components
- **Section drafts**: Four parallel writers each own one part of the file under `scratch/draft-a.md` to `scratch/draft-d.md`.
- **Assembly pass**: One writer joins the four drafts, applies the impact order and settles the file at 2961 words with 11 glance bullets.
- **Content validators**: `validate_document.py` checks document structure and `hvr_scan.py` checks the human-voice rules.
- **Read-only review**: Three separate read-only DeepSeek v4.1 flash sessions at max thinking read the finished file and return PASS or findings. Round 1 found four P1 and returned FAIL; round 2 found four P2 and returned PASS; round 3 found one P1 and one P2 and returned FAIL.

### Data Flow
The previous changelog is the single fact source. Each draft restates one part of it without the two removed topics and in plain words. The assembly pass orders the parts by user impact and writes the glance list. The validators and the review read the assembled file and report on it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---
