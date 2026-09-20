---
title: "Implementation Plan: Remove the openrouter provider from the cli-pi and cli-opencode skills"
description: "Classify all 25 OpenRouter mentions across the two skills into live wiring, historical record and generated artifact, then edit only the first class with exact-match assertions and prove the result with a residue sweep."
trigger_phrases:
  - "openrouter removal plan"
  - "classify live wiring versus historical record"
  - "residue sweep proof"
  - "closed roster narrowing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Remove the openrouter provider from the cli-pi and cli-opencode skills

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation packets under `.opencode/skills/cli-external-orchestration/` |
| **Framework** | system-spec-kit packet validation; sk-create-skill CI checkers |
| **Storage** | None |
| **Testing** | `validate.sh --strict`; `ci-leaf-manifest-freshness`, `ci-skill-derived-freshness`, `ci-router-vocabulary-reach`; deep-loop vitest as a negative control |

### Overview

The unit of work is a classification, not a substitution. Every OpenRouter mention was read in context and sorted into one of three classes before a single character changed: **live wiring** that tells a reader or a dispatcher that the route exists, **historical record** that states what was true on a past date, and **generated artifact** that must be regenerated rather than hand-edited. Only the first class was edited. The third class turned out to be empty inside both skills, which is a finding in itself and is recorded as such.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every mention enumerated with a case-insensitive, binary-safe grep over both skill trees
- [x] Every mention read in surrounding context and assigned a class
- [x] Checked that no documented default, fallback or example depends on OpenRouter
- [x] Pre-change baselines captured for all three CI checkers

### Definition of Done
- [x] Zero live OpenRouter references remain in either skill
- [x] The three changelog mentions are untouched
- [x] Each CI checker returns the same verdict for `cli-external-orchestration` as its baseline
- [x] `validate.sh <packet> --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation-only narrowing of a closed roster. Neither skill enforces its roster in code at this layer: `cli-opencode` has no allowlist at all and says so, and `cli-pi`'s allowlist lives in `system-deep-loop`. The catalog *is* the enforcement, which is exactly why an incomplete removal is dangerous and a residue sweep is the real gate.

### Key Components

- **`references/providers-and-models.md` (both skills)**: the roster, and the only place model ids live. Each carried a `### openrouter` section of eleven lines including its table.
- **`SKILL.md` (both skills)**: names the providers and their count but deliberately does not restate models, so exactly one sentence per skill needed changing, plus the cli-opencode advisor keyword line and its id-shape footgun.
- **`references/cli-reference.md` (cli-opencode)**: the all-providers-missing pre-flight tree offers a login command per provider. An off-roster login option is an invitation to an off-roster dispatch.
- **Cross-references**: the `cline-pass` and `llmgateway` sections explained their own thinking-tier ceilings and fan-out slots by comparing against OpenRouter. These are the mentions a naive sweep leaves dangling.

### Data Flow

A reader resolves "which model" from `providers-and-models.md`, and a fan-out resolves a literal through `PI_MODEL_PROVIDERS` in the deep-loop runtime. This packet narrows the first and leaves the second, so the two now disagree by two literals. That divergence is deliberate, bounded, and reported rather than silently closed.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three layers, because a doc change has no unit test of its own.

1. **Residue sweep.** `grep -rani openrouter` over both skill trees. The pass condition is not "no errors", it is a specific expected set: exactly three hits, all under `changelog/`.
2. **CI checkers, baseline and after.** `ci-leaf-manifest-freshness`, `ci-skill-derived-freshness` and `ci-router-vocabulary-reach` were run before any edit and again after. The comparison that matters is the `cli-external-orchestration` row, since the tree carries unrelated dirty state from other sessions.
3. **Negative control on the runtime.** `tests/unit/executor-config.vitest.ts` and `tests/unit/fanout-run.vitest.ts` assert the OpenRouter literals are still in the fan-out roster. They must keep passing, because this packet must not have touched code. A pass here proves the divergence is real and intentional rather than half-applied.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `system-deep-loop/runtime` for the negative-control test run. No file in it was modified.
- The `sk-create-skill` CI scripts under `.opencode/skills/sk-doc/sk-create-skill/scripts/`. Read-only use.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

To undo this: `git checkout -- .opencode/skills/cli-external-orchestration/cli-pi .opencode/skills/cli-external-orchestration/cli-opencode`, then delete the two new changelog files and this packet folder. Every edit is a working-tree change to a tracked markdown file, so nothing here is irreversible and no migration exists to reverse. The changes were left uncommitted deliberately: the tree carries roughly a hundred dirty files from concurrent sessions in unrelated trees, so staging is the operator's call.
<!-- /ANCHOR:rollback -->

---
