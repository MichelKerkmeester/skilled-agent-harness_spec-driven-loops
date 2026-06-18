# Iteration 8 — Wave 4 (generate) — seat gpt-4 (openai/gpt-5.5-fast, variant high)

- Lens: ponytail-review-overlap
- Status: complete | exit=0 | duration=80s | findings=3 | newInfoRatio=0.45
- Focus: Which ponytail-review checklist items merge into sk-code-review's existing checklists?
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only); full ponytail-review SKILL.md embedded.

## Seat output

**Overlap**
- `delete:` Already covered. Cite `.opencode/skills/sk-code-review/references/removal_plan.md#2-safe-to-remove-now` rows `Rationale`, `Evidence`, `Impact`, `Deletion Steps`, `Verification`; checklist lines 50-55 and reviewer checklist lines 80-88.
- `stdlib:` Gap. `code_quality_checklist.md` has generic KISS/DRY rows but no explicit “hand-rolled stdlib” check.
- `native:` Gap. No explicit check for custom/dependency code that duplicates platform/runtime features.
- `yagni:` Already covered. Cite `code_quality_checklist.md#7-kiss--dry-enforcement` rows “New abstraction layers…”, “Generic helpers used in only one place”, “future flexibility”, “speculative future use”; also `solid_checklist.md#3-architecture-smells` row “Speculative abstraction” and `solid_checklist.md#4-refactor-guidance` row “Extract interfaces only when multiple implementations are real.”
- `shrink:` Partial gap. Existing coverage catches nested/long/repeated code in `code_quality_checklist.md#6-maintainability-signals` and `#7-kiss--dry-enforcement`, but not ponytail’s concrete “same behavior, fewer lines” check.

**Rows To Add**
- Target: `code_quality_checklist.md#6-maintainability-signals`
- Row: `- Hand-rolled standard-library behavior where the language/runtime already provides a clear, readable primitive; prefer the standard API when behavior and edge cases match.`
- Target: `code_quality_checklist.md#6-maintainability-signals`
- Row: `- Custom code or dependencies duplicating native platform/runtime capabilities without a current requirement that the native feature cannot satisfy.`
- Target: `code_quality_checklist.md#7-kiss--dry-enforcement`
- Row: `- Verbose code that can be replaced by an equally clear shorter built-in expression without changing behavior.`
- Target: `removal_plan.md#2-safe-to-remove-now`
- Row: add table field `Replacement | What replaces the removed code: nothing, a standard-library API, a native platform feature, or a shorter equivalent expression`

**Merge vs Standalone**
Merge into `sk-code-review`, not a separate skill. `SKILL.md` already defines one baseline review model with resource routing for KISS, SOLID, REMOVAL, and findings-first P0/P1/P2 output. Ponytail’s useful parts are checklist rows, not a separate workflow. A standalone skill would split review doctrine and create severity/output drift.

**Negative Knowledge**
- Ponytail’s deletion-first tone is too aggressive for `sk-code-review`: over-engineering should default to `P2`, escalating to `P1` only when it creates concrete behavior/regression risk per `code_quality_checklist.md#7`.
- Do not adopt `net: -N lines` as a gate or score. It incentivizes line-count deletion over correctness/evidence. If used, make it optional supporting evidence in `Removal/Iteration Plan`, never severity.
- Preserve ponytail’s boundary that smoke tests/assert self-checks are not bloat.
- Keep correctness/security/performance findings in normal `sk-code-review` severity lanes; ponytail-style complexity findings should not block merges unless tied to real risk.

```json
{"seat":"gpt-4","lens":"ponytail-review-overlap","findings":[{"id":"F1","title":"Add explicit stdlib/native replacement checks to code quality","ponytail_source":"external/ponytail-main/skills/ponytail-review/SKILL.md","target":"sk-code-review:code_quality_checklist.md#6-maintainability-signals","mechanism":"Turns ponytail stdlib/native tags into baseline maintainability checks without changing review workflow.","recommendation":"Add rows for hand-rolled standard-library behavior and custom/dependency code duplicating native platform/runtime capabilities.","value":"high","effort":"S","integration_risk":"Low; checklist-only addition, severity remains P2 by default.","redundant_with":"Partially overlaps KISS/DRY, but current rows do not name stdlib/native replacement explicitly.","confidence":"high"},{"id":"F2","title":"Add shrink check as a KISS smell, not a deletion mandate","ponytail_source":"external/ponytail-main/skills/ponytail-review/SKILL.md","target":"sk-code-review:code_quality_checklist.md#7-kiss--dry-enforcement","mechanism":"Captures same-behavior-fewer-lines opportunities while requiring equal clarity and unchanged behavior.","recommendation":"Add row: Verbose code that can be replaced by an equally clear shorter built-in expression without changing behavior.","value":"medium","effort":"S","integration_risk":"Medium; could become style churn unless constrained to equal clarity and behavior preservation.","redundant_with":"Existing nested-control-flow, function-length, and DRY rows partially cover it.","confidence":"high"},{"id":"F3","title":"Extend removal plan with replacement target","ponytail_source":"external/ponytail-main/skills/ponytail-review/SKILL.md","target":"sk-code-review:removal_plan.md#2-safe-to-remove-now","mechanism":"Makes deletion recommendations specify what replaces removed code: nothing, stdlib, native feature, or shorter equivalent.","recommendation":"Add table field: Replacement | What replaces the removed code: nothing, a standard-library API, a native platform feature, or a shorter equivalent expression.","value":"medium","effort":"S","integration_risk":"Low; improves actionability without promoting deletion-first severity.","redundant_with":"Current Deletion Steps field implies this but does not require it.","confidence":"high"}],"newInfoRatio":0.45,"negative_knowledge":["Do not create a standalone ponytail-review skill; merge useful checks into the existing sk-code-review baseline.","Do not adopt net:-N lines as a severity gate or approval metric; at most use optional supporting evidence.","Do not treat over-engineering as P0/P1 unless it creates concrete correctness, security, performance, or regression risk.","Do not flag minimal smoke tests or assert-based self-checks as bloat."]}
```