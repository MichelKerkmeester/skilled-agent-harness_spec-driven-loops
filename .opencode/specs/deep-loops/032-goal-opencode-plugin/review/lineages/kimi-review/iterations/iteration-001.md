# Iteration 001: Correctness — Spec-vs-Code Claims

## Focus
- Dimension: correctness
- Files reviewed: `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md`, `.opencode/commands/goal_opencode.md`, `.opencode/plugins/mk-goal.js`
- Scope: Compare normative scope/verb claims in the parent spec against the shipped command and plugin implementation.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F001**: Command surface expanded beyond original spec verbs, `.opencode/commands/goal_opencode.md:3,30-33`. The parent spec (`.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:89-92`) scoped the `/goal` command to `set <objective> | show | clear | complete | pause`. The shipped command additionally supports `history`, `doctor`, `health`, and `resume`. The extra verbs are traceable to later planned phases (e.g., phase 020), but the original scope claim is now understated.
- **F002**: Parent phase map omits the `009-diagnostic-review` sibling folder, `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:166-193`. The directory listing shows both `009-diagnostic-review` and `009-speckit-command-goal-prompt-offer`, yet only the latter appears in the phase map and status narrative. This creates an orphan phase whose status and deliverables are undocumented.
- **F003**: Goal-state directory is resolved relative to the plugin file rather than as the exact literal path named in the spec, `.opencode/plugins/mk-goal.js:25`. The spec says `.opencode/skills/.goal-state/`; the plugin computes `fileURLToPath(new URL('../skills/.goal-state/', import.meta.url))`. The effective path matches under the standard layout, but the implementation couples the store location to plugin-file location rather than to the documented path.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:89-92 vs goal_opencode.md:3,30-33 | Command verbs drift beyond original scope; later phases cover additions |
| checklist_evidence | pass | hard | - | No checklist item checked in this iteration |
| feature_catalog_code | pass | advisory | goal_plugin.md:28-31 | Catalog verbs align with shipped command surface |
| playbook_capability | pending | advisory | - | Not exercised this iteration |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: [correctness]
- Novelty justification: All three findings are new. They identify spec/code drift and an undocumented sibling phase.

## Ruled Out
- Core plugin logic claims (state keying, atomic writes, injection hook) were verified against spec and found consistent.

## Dead Ends
- Searching for contradictions in success criteria SC-001/SC-002 yielded no actionable defect.

## Recommended Next Focus
Move to security: inspect input validation, secrets redaction, and trust boundaries in `mk-goal.js` and the command router.

Review verdict: PASS
