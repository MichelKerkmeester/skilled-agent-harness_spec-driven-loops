---
title: "Implementation Plan: Phase 3: design-handoffs"
description: "Add one sk-design-fundamentals hand-off line to sk-code and mcp-figma, a library-free reduced-motion section to the fundamentals motion reference and an optional project-profile slot with its precedence, without adding any routing phrase."
trigger_phrases:
  - "design handoffs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: design-handoffs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs |
| **Framework** | sk-code and sk-design hubs; mcp-tooling mcp-figma packet |
| **Storage** | None |
| **Testing** | `ci-router-vocabulary-reach.cjs`, the fundamentals playbook validator, `git diff --stat` |

### Overview
Five doc files change by a few lines each. The hand-off line is worded once and reused in all three files. Reach on sk-design and sk-code before and after proves no routing moved, and a diff check proves no router or metadata file changed.
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
- [ ] `rg -n "sk-design-fundamentals"` hits all three hand-off files and reach on sk-design and sk-code matches the phase 002 final numbers
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc-only pointers.

### Key Components
- **Hand-off line**: sends a value the frame or task leaves open to `sk-design-fundamentals` before it is built
- **Reduced-motion section**: web `prefers-reduced-motion` and the native platform setting, no library named
- **Profile slot**: optional `references/<project>-profile.md`, loaded only for a named project, last in precedence

### Data Flow
An implementer reading sk-code or mcp-figma meets an open value, follows the line to fundamentals, and fundamentals applies repository mode, installed tokens, design scales and then any named project's profile, in that order.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code/SKILL.md`, `README.md` | Name only the extractor | update | `rg -n "sk-design-fundamentals"` |
| `mcp-figma/SKILL.md` | Pairs only with the extractor | update | `rg -n "sk-design-fundamentals"` |
| Fundamentals `SKILL.md` | Outranks its defaults by tokens or a Style Reference | update | `rg -n -i "profile"` |
| Fundamentals `ROUTER.md` and sk-design `graph-metadata.json` | Route fundamentals requests | unchanged | `git diff --stat` lists neither |

Required inventories:
- Same-class producers: `rg -n "sk-design-md-generator" .skilled/skills/sk-code .skilled/skills/mcp-tooling/mcp-figma` lists every place that names only the extractor.
- Consumers of changed symbols: none; no symbol changes.
- Matrix axes: two hubs probed for reach, before and after.
- Algorithm invariant: no phrase is added to any router or metadata file.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the reach numbers phase 002 left. Implementation edits the five files. Verification diffs, greps and reruns reach.

**Executors.** Research and verification dispatches go to DeepSeek V4.1 Flash 1017 through opencode-go, with the model literal confirmed from `cli-pi/SKILL.md` and `cli-opencode/references/providers-and-models.md` before the first dispatch. Builds dispatch to `cli-codex --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"`, never through a gateway.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fundamentals playbook validator | The playbook validator |
| Integration | Reach on sk-design and sk-code | `ci-router-vocabulary-reach.cjs --concurrency 2` |
| Manual | Read the three hand-off lines in place | Reader check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 final reach numbers | Internal | Yellow | No baseline to compare against; capture a fresh one |
| Advisor daemon | Internal | Green | No reach proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reach on sk-design or sk-code moves after the edits.
- **Procedure**: Revert the phase commit with `git revert` and reword the line that moved routing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline) ──► Implementation (five files) ──► Verification (diff, grep, reach)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002 closed | Implementation |
| Implementation | The reach baseline | Verification |
| Verification | All five edits | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---
