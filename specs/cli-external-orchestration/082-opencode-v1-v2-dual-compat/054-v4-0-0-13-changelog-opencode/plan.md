---
title: "Implementation Plan: Phase 54: v4-0-0-13-changelog-opencode"
description: "Five one-change briefs move the OpenCode section of the unreleased v4.0.0.13 changelog up to sit after In-Session Handover, fill it with eight items, name the work in the description, intro, Why This Release, glance list and Upgrade Notes, and carry the live two-version testing with its suite table. Two read-only DeepSeek review rounds then checked every claim, and both content validators gate the result."
trigger_phrases:
  - "v4 0 0 13 changelog opencode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 54: v4-0-0-13-changelog-opencode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, edited under the `sk-create-changelog` contract |
| **Framework** | DeepSeek v4.1 flash, thinking max, dispatched through `cli-pi` on llmgateway |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py` and two read-only review rounds |

### Overview
The file is edited over five briefs, each changing one thing: promote the OpenCode section and give it eight items, name the work in the surrounding sections while merging the glance list to 12 bullets, carry the testing with its suite table, correct the plugin count to 17, and add three OpenCode upgrade notes. A separate read-only DeepSeek session reviews each round, every P1 is fixed, and the round 3 verdict is left as `PENDING_R3` for the orchestrator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a single-file editorial revision, with a read-only review loop and two content validators as the gate.

### Key Components
- **`.skilled/changelog/skilled/v4.0.0.13.md`**: the only file edited. Its section order, glance list, Upgrade Notes and frontmatter are what the phase rearranges.
- **The `sk-create-changelog` contract**: owns the section grammar, the 12-bullet glance ceiling and the rule that test counts are dropped by default, which this phase deviates from on purpose.
- **The release tree**: the source of every number in the file, including the 17 plugin files under `.opencode/plugins/` and the five suite counts.
- **`validate_document.py` and `hvr_scan.py`**: the content gate, run over the finished file.

### Data Flow
Operator request, then five one-change briefs to DeepSeek v4.1 flash through `cli-pi`, then the edited changelog, then two read-only review rounds whose findings feed back as briefs, then the validators, then the round 3 verdict the orchestrator records.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The changelog cannot be executed, so its gate is content: `validate_document.py` for structure and required content, `hvr_scan.py` for human-voice rules, and a read-only reviewer that checks each factual claim against the release tree. The suite counts in the testing item were rerun on the release tree rather than copied from an earlier phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The live two-version result comes from `../053-final-commit-live-proof/`, which ran all 17 plugins on OpenCode 1.19.3 and 2.0.32 at `dfdc523af5`. The five suite counts come from a rerun on the release tree: plugins 516, hook node 886 over 30 files, hook vitest 452, battery unit 51 and dispatch audit 124. The reviewers are separate read-only DeepSeek sessions, and Luna was not used because the operator moved review to DeepSeek.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here. One file changed, so `git checkout -- .skilled/changelog/skilled/v4.0.0.13.md` restores the previous draft, and this folder's docs can be removed with it. Nothing in the release notes describes behaviour that the rollback would alter.
<!-- /ANCHOR:rollback -->

---
