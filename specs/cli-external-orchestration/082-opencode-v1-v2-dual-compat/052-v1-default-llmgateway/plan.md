---
title: "Implementation Plan: Phase 52: v1-default-llmgateway"
description: "One default instead of two: the runner stops splitting by OpenCode version, so both binaries fall back to llmgateway/deepseek-v4.1-flash, and every doc that stated the split is brought onto the single default in each version's syntax. The tests pin the new value, a live unpinned dispatch on each version proves it, and the change is reverted cleanly by restoring one constant."
trigger_phrases:
  - "v1 default llmgateway plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 52: v1-default-llmgateway

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS) for the fan-out runner and the script test, TypeScript for the runner tests, Markdown for the docs |
| **Framework** | Vitest for the deep-loop runtime, `node:test` for the cli-opencode script test |
| **Storage** | None |
| **Testing** | `opencode-dual-dispatch.vitest.ts`, `fanout-run.vitest.ts`, `scripts/tests/default-model-id.test.cjs`, the playbook validator and the Hermes sync check |

### Overview
The runner chose the fallback model from `opencode.version`, which made an unpinned lineage depend on which binary PATH resolved. With the opencode-go Go quota spent, the OpenCode 1 branch no longer returns a reply, so the split has no remaining value: `OPENCODE_DEFAULT_MODEL` becomes `llmgateway/deepseek-v4.1-flash` and the second constant goes away. The tests that pinned two defaults now pin one, and every doc that stated the split states the single default in each version's own syntax.
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
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One fallback, resolved once. The default is a single constant, and the version only decides the syntax the flag is written in.

### Key Components
- **`fanout-run.cjs` `buildOpencodeLineageCommand`**: still prefers `lineage.model`, and falls back to the one constant. The version no longer participates in the choice, so an unpinned lineage behaves the same on either binary.
- **`OPENCODE_DEFAULT_MODEL`**: `llmgateway/deepseek-v4.1-flash`, the same model the OpenCode 2 branch used since 043. `OPENCODE_V2_DEFAULT_MODEL` is removed, along with its export.
- **`pinReasoningEffortForModel`**: unchanged, and it still supplies `max` for this model, which is what makes the v1 `--variant max` and the v2 `#max` forms agree.
- **The default-model script test**: reads each table's default marker and the syntax `SKILL.md` pins, so a doc that drifts from the runtime fails there.

### Data Flow
A lineage with no `lineage.model` reaches `buildOpencodeLineageCommand`, which takes the one constant, derives the effort, and emits `--model <id> --variant max` on version 1 or `-m <id>#max` on version 2. A lineage that pins a model never reaches the constant, and the provider map only matters when a caller names a provider itself.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three layers, each answering a different question. The runner tests answer whether the builder produces the right argv for each version, including a test that fails if the OpenCode 1 branch goes back to opencode-go. The default-model script test answers whether the docs agree with the runtime, since it reads `SKILL.md`'s pinned syntax and each provider table's default marker. The live unpinned dispatches answer whether the real binaries honour that argv: one run per version, no model pinned, under a 180 second alarm, each required to exit 0 and reply OK. The suites that already covered the touched trees are rerun at their full counts, so a regression in a neighbour shows up here rather than at the next phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`llmgateway` must serve `deepseek-v4.1-flash` on both installed versions, which the runs prove. The `opencode-go` provider must keep its docs entry, because it stays selectable even though nothing defaults to it. The Hermes copy is generated from `SKILL.md`, so it is regenerated after the skill text settles and checked as a set of 68, not as a single file.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Restore the two constants and the version split in `fanout-run.cjs`, then run the deep-loop vitest suite: the OpenCode 1 unpinned test fails, which is the same check that proves the change. The docs revert with the same commit, the Hermes copy regenerates from the reverted `SKILL.md`, and the 043, 006 and 036 notes return to their recorded-blocked state. Nothing outside those files holds state, so no migration or cleanup follows.
<!-- /ANCHOR:rollback -->

---
