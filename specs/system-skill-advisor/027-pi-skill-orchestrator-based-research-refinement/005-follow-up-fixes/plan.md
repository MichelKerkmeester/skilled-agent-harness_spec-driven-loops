---
title: "Implementation Plan: Follow-up Fixes"
description: "Carry the research workflows' fan-out dashboard rule to the review workflows, make edit_lines explain a trailing-newline count, decide the plugin's transform dedup before lifecycle reduction, and rebuild the trigger index from committed content."
trigger_phrases:
  - "follow-up fixes plan"
  - "edit_lines fix plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Follow-up Fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML-embedded Node scripts, TypeScript on Node, the plain-JS OpenCode plugin, and a Node `.mjs` generator |
| **Framework** | Deep-loop review workflows, the Pi cache-optimizer extension, the OpenCode advisor plugin, the spec-kit trigger index |
| **Storage** | None changed |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` and `.skilled/skills/system-skill-advisor/runtime`; `npm test` and `npm run typecheck` in `.pi/extensions/pi-cache-optimizer`; `node --test .skilled/plugins/tests/system-skill-advisor.test.cjs` |

### Overview
Four independent fixes on disjoint files, each built by GPT-6 Luna at max effort from a one-change brief, two at a time. The orchestrator reruns each named test, reverts each source change to watch its new test fail, and rebuilds the trigger index itself once the fixes are committed.
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
Fix each defect where it is produced. No workaround in a caller.

### Key Components
- **Review convergence step** (`deep-review-auto.yaml:2389`, `deep-review-confirm.yaml:1872`): find lineage state logs under `lineages/*/deep-review-state.jsonl` the way the research step does, and list the dashboard as required only when there are none. Which state records the invariants read does not change.
- **`edit_lines`** (`.pi/extensions/pi-cache-optimizer/index.ts`): in `validateEdits` at `:8161-8167`, when the claim is exactly one short and the last split element is empty, return a refusal that names that final empty line. The `line_count` description at `:7953-7958` and one prompt guideline at `:8426-8435` say the line counts. The count check itself stays exact.
- **Plugin** (`.skilled/plugins/system-skill-advisor.js:1352-1382`): compute the transform decision on the full block, run `decideOpenCodeDirectiveLifecycle` only when that decision delivers, and push the reduced or full block.
- **Trigger index**: `git archive HEAD` of the markdown corpus into scratch, `generate-trigger-index.mjs --repo-root <export>` with `--out`, `--manifest`, `--diagnostics` and `--variants` pointed at the repository's own files.

### Data Flow
Unchanged for every default path. A fan-out review close now passes the artifact check with the root registry and report present; a refused `edit_lines` call returns a message the model can act on; a duplicate same-message transform is suppressed before lifecycle state is touched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baseline first: the nine deep-loop test files that read the research and review workflows, the Pi extension's `npm test` and typecheck, the advisor runtime suite and the plugin `.cjs` suite. Each fix gets a test written before its change and seen failing on the unchanged code. Rerun each whole suite at the end and report the delta.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 001-deep-research: the research workflows' rule and its tests, which the review change mirrors.
- 004-headless-fallback-status-and-dedup: the isolated same-message suppression test this phase restores.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commits; the four fixes touch disjoint files, so any one can be reverted alone. The review contract must be regenerated after a YAML revert, and the trigger index rebuilt the same way it was built.
<!-- /ANCHOR:rollback -->

---
