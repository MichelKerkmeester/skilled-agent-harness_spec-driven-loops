---
title: "Implementation Plan: Close every open goal decision"
description: "How the four operator decisions, the last advisories and the Devin unknown were built, verified and rolled back if needed."
trigger_phrases:
  - "goal open decisions plan"
  - "goal criteria field plan"
  - "goal closure plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Close every open goal decision

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Nine requirements, built in one pass against the shared slice module first so both renderers could
move together. The operator answered four decisions before any code was written; the Devin unknown was
settled by a live run before deciding whether it needed a fix at all, and it did not.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command |
|------|---------|
| Goal hook suites | `node --test .opencode/hooks/goal/` |
| OpenCode plugin suites | `node --test .opencode/plugins/tests/opencode-goal-*.test.cjs .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` |
| Spec-doc validator | `npx vitest run tests/spec-doc-structure.vitest.ts` in the spec-kit runtime |
| Retrieval coverage | `npx vitest run cli/tests/retrieval-coverage-parity.vitest.ts cli/tests/retrieval-repo-root.vitest.ts --config ../vitest.config.ts` |
| Packet | `validate.sh <packet> --strict` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The split between the packet sentence and the criteria belongs in the shared slice module, beside the
frontmatter boundary it already owns, because that is the one place both implementations already
agree. Each renderer keeps its own sanitiser and its own budget arithmetic and calls the shared split
and the shared whole-item selector, so a future change to what counts as a criterion moves once.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Objective split and whole-item criteria selection |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Criteria field in both block shapes, headline-only prompt, non-UTF-8 refusal |
| `.opencode/plugins/opencode-goal.js` | The same two renderer changes |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Link notation and real-path containment in the binding-row rule |
| `.opencode/commands/speckit/assets/speckit-{plan,implement,complete}.yaml` | Nesting rules and the session-free resend signal |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | The hooks corpus root |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | The coverage table row that justifies it |
| `.opencode/hooks/goal/README.md` | What a text set does to a binding |
| cli-devin goal-hook playbook | The host merge rule, recorded from a live run |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. PHASES

One phase. The shared module first, then the two renderers, then the validator, then the workflow
assets and retrieval, then the documents, then the live Devin probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING

Each change gets one test that fails when the behaviour is removed. Two were negative-controlled by
breaking the behaviour and watching the test fail: renaming the criteria label failed the parity test,
and altering one workflow file failed the drift check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

The compiled validation orchestrator must be rebuilt after the validator change, or the packet gate
refuses to run and prints nothing, which reads as a clean pass.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK

Every change is additive and confined to the files above. Reverting the commit restores the previous
block shape, the previous append behaviour and the previous corpus roots; the trigger index would then
need one regeneration to match.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

Depends on 008 for the ranked list and on 007 for the review advisories. Nothing depends on this phase.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. EFFORT

One session. Fourteen files, roughly 260 changed lines, eleven new tests.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK

If the criteria field turns out to break a runtime that parses the block, the smallest reversal is to
return an empty array from the criteria renderer in both implementations. The parity test still passes
and the block returns to its previous shape without touching the shared module.
<!-- /ANCHOR:enhanced-rollback -->
