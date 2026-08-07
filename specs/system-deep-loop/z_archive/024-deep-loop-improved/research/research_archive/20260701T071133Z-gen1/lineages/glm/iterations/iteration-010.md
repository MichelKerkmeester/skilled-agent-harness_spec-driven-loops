# Iteration 010: Empty Scaffolds + Weak-Evidence Phases

## Focus
- Scope: Template-default plan.md/tasks.md under Complete folders; implementation summaries with no verification evidence
- Question: Are there empty scaffolds masquerading as completed deliverables?

## Findings

### F-010: Template-default scaffolds under Complete-status folders + implementation summaries lacking test evidence

**Severity: High (completion claims not backed by verification)**

**Part A: Empty/template-default scaffolds under Complete-status folders**

Three folders carry template-default `plan.md` (170 lines, unchanged from template) under phases claimed Complete:

| Folder | plan.md lines | completion_pct | Phase Status |
|--------|--------------|----------------|--------------|
| `001-reference-research` | 170 (4 TODO/TBD markers) | 0 | Complete |
| `004-system-spec-kit/001-speckit-autopilot-lifecycle` | 170 | 0 | Complete (parent) |
| `005-skill-interconnection/001-advisor-routing-projection` | 170 | 0 | Complete (parent) |

[SOURCE: `001-reference-research/plan.md` (170 lines, 4 TODO markers, completion_pct:0)]
[SOURCE: `004-system-spec-kit/001-speckit-autopilot-lifecycle/plan.md` (170 lines)]
[SOURCE: `005-skill-interconnection/001-advisor-routing-projection/plan.md` (170 lines)]

These plan.md files are the exact template size (170 lines) with template-default content, meaning they were never customized for the actual phase work. The `001-reference-research/tasks.md` (106 lines) has 14 TODO/unchecked markers, confirming it was never finalized.

Additionally, `001-reference-research/implementation-summary.md` and `008-loop-systems-remediation/{plan,tasks,implementation-summary}.md` all carry `completion_pct: 0` despite their parents claiming Complete/100%.

**Part B: Weak-evidence phases — implementation summaries with no test verification**

Three phases have implementation summaries that claim completion but lack test-run evidence:

**008/003 (model-benchmark-reducer-ledger):**
- `implementation-summary.md` says: "The autonomous model-benchmark workflow now passes the improvement state log to the runner..."
- `next_safe_action: "Run the Vitest suites when a local runner is available"`
- **No test was ever run.** The completion claim is "code written, not test-verified."
[SOURCE: `008-loop-systems-remediation/003-model-benchmark-reducer-ledger/implementation-summary.md`]

**006/005 (per-iteration-memory-upsert):**
- `implementation-summary.md` says YAML parses and is additive
- `next_safe_action: "Proceed to the next phase in the dependency order"` (generic)
- No test evidence cited; only references a test FILE that should exist
[SOURCE: `006-ux-observability-automation/005-per-iteration-memory-upsert/implementation-summary.md`]

**006/006 (loop-wide-dry-run):**
- Same pattern: "YAML parses; additive" with no actual test-run output
- Generic next_safe_action
[SOURCE: `006-ux-observability-automation/006-loop-wide-dry-run/implementation-summary.md`]

**Part C: Root spec completion_pct contradiction**

The root `spec.md` frontmatter says `completion_pct: 50` [SOURCE: `spec.md:24`] while 7 of 8 phases are marked Complete. 50% completion for a packet where 7/8 phases are done (87.5%) suggests the root was never updated after the phases shipped.

**Root cause:**
- Template scaffolds: The `speckit:plan` workflow creates plan.md/tasks.md from templates, but `speckit:complete` doesn't verify they were customized. A phase can be marked Complete with template-default plan/tasks.
- Weak evidence: The Iron Law ("NO completion claims without running stack-appropriate verification") is not enforced by the workflow. `speckit:complete` doesn't require a test-run log or checklist evidence.
- Root completion_pct: Never updated as phases completed.

**Recommendation:**
1. **Scaffolds:** Add a validate.sh check that flags plan.md/tasks.md matching the template's exact line count (170) or containing >N TODO/TBD markers under a Complete-status folder
2. **Weak evidence:** Add a `step_verify_test_evidence` to `speckit:complete` that requires either a checklist.md with checked items OR a test-run log reference
3. **Root completion_pct:** Add a `step_update_parent_completion` that computes the parent's completion_pct from the weighted average of child phases
4. **Backfill:** Customize the three template-default plan.md files with actual phase-specific content

## Novelty Justification
Confirmed the template-size pattern (170 lines = unchanged template) across 3 folders. New finding: 008/003's own implementation-summary admits tests were never run ("Run the Vitest suites when a local runner is available"). New finding: root spec completion_pct:50 despite 87.5% phase completion.

## What Was Tried and Failed
- Checked if the test files referenced in implementation summaries actually exist (they may exist as files but were never executed)

## Ruled-Out Directions
- The scaffolds are NOT acceptable as-is under Complete status (Iron Law requires verification)
