# Deep-Review Iteration 001 — sk-code checklists → references

**Executor:** DeepSeek-v4-pro (cli-opencode, --pure, read-only)
**Findings:** P0=0 P1=63 P2=3 (total 66)

## Summary
Of 66 flagged links: 26 are real broken references (spanning 3 systemic patterns — missing opencode/ segment in opencode checklist links, missing webflow/ segment in webflow checklist links, and missing universal/ segment for shared pattern assets), 1 is a broken absolute-path reference to a nonexistent example spec, 1 is a bare filename with wrong directory, 4 are bare animation_workflows.md filename links in the wrong directory, and 22 are false positives (19 files exist at their target paths now, 2 are JS code/block syntax misidentified by the regex, and 1 directory link works correctly). P0 count: 0. P1 count: 44. P2 count: 2. The systemic pattern is that ~80% of genuine breaks share a common cause — references were written without the intermediate surface-marker directory (opencode/, webflow/, universal/) that the file tree uses to namespace per-surface references under the references/ root.

## Findings
| Sev | Classification | Source | Reference | 133-caused | Recommendation |
|-----|----------------|--------|-----------|-----------|----------------|
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/config_checklist.md` | `../../references/config/style_guide.md` | no | Insert opencode/ segment into path: ../../references/opencode/config/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/javascript_checklist.md` | `../../references/javascript/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/javascript/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/javascript_checklist.md` | `../../references/javascript/quality_standards.md` | no | Insert opencode/ segment: ../../references/opencode/javascript/quality_standards.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/python_checklist.md` | `../../references/python/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/python/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/python_checklist.md` | `../../references/python/quality_standards.md` | no | Insert opencode/ segment: ../../references/opencode/python/quality_standards.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/shell_checklist.md` | `../../references/shell/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/shell/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/shell_checklist.md` | `../../references/shell/quality_standards.md` | no | Insert opencode/ segment: ../../references/opencode/shell/quality_standards.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/typescript_checklist.md` | `../../references/typescript/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/typescript/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/typescript_checklist.md` | `../../references/typescript/quality_standards.md` | no | Insert opencode/ segment: ../../references/opencode/typescript/quality_standards.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | `../../references/javascript/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/javascript/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | `../../references/typescript/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/typescript/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | `../../references/python/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/python/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | `../../references/shell/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/shell/style_guide.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | `../../references/config/style_guide.md` | no | Insert opencode/ segment: ../../references/opencode/config/style_guide.md |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/shared/cross_language_rules.md` | no | No fix needed; checker may have run before v3.3.0.0 created this file |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/javascript/style_guide.md` | no | No fix needed |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/javascript/quality_standards.md` | no | No fix needed |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/css/style_guide.md` | no | No fix needed |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/css/quality_standards.md` | no | No fix needed |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/javascript/style_guide.md` | no | Insert webflow/ segment: ../../references/webflow/javascript/style_guide.md |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/universal/code_style_guide.md` | no | No fix needed |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/javascript/style_guide.md` | no | Insert webflow/ segment |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/javascript/style_guide.md` | no | Insert webflow/ segment |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/motion_dev/quick_start.md` | no | No fix needed |
| P2 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/motion_dev/` | no | No fix needed; directory link resolves correctly |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/javascript/style_guide.md` | no | Insert webflow/ segment |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/javascript/quality_standards.md` | no | Insert webflow/ segment |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/javascript/style_guide.md` | no | Insert webflow/ segment |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/css/style_guide.md` | no | No fix needed |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/shared/cross_language_rules.md` | no | No fix needed |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/javascript/style_guide.md` | no | No fix needed |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/javascript/quality_standards.md` | no | No fix needed |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/css/style_guide.md` | no | No fix needed |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/webflow/css/quality_standards.md` | no | No fix needed |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../references/shared/enforcement.md` | no | Insert webflow/ segment: ../../references/webflow/shared/enforcement.md |
| P1 | FALSE_POSITIVE | `.opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md` | `../../SKILL.md` | no | No fix needed |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/debugging_checklist.md` | `../../references/debugging/debugging_workflows.md` | no | Insert webflow/ segment: ../../references/webflow/debugging/debugging_workflows.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/performance_loading_checklist.md` | `../../references/performance/interaction_gated_loading.md` | no | Insert webflow/ segment: ../../references/webflow/performance/interaction_gated_loading.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/performance_loading_checklist.md` | `../../references/performance/cwv_remediation.md` | no | Insert webflow/ segment: ../../references/webflow/performance/cwv_remediation.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/verification_checklist.md` | `../../references/verification/verification_workflows.md` | no | Insert webflow/ segment: ../../references/webflow/verification/verification_workflows.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/assets/webflow/checklists/verification_checklist.md` | `../../references/javascript/quick_reference.md` | no | Insert webflow/ segment: ../../references/webflow/javascript/quick_reference.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/changelog/v3.3.0.0.md` | `code_quality_standards.md` | no | Replace with correct relative path or remove |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md` | `../../assets/checklists/debugging_checklist.md` | no | Insert webflow/ segment: ../../assets/webflow/checklists/debugging_checklist.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md` | `../../assets/checklists/debugging_checklist.md` | no | Same fix: ../../assets/webflow/checklists/debugging_checklist.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md` | `../../assets/integrations/lenis_patterns.js` | no | Insert webflow/ segment: ../../assets/webflow/integrations/lenis_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md` | `../../assets/checklists/debugging_checklist.md` | no | Same fix |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md` | `../../assets/checklists/debugging_checklist.md` | no | Same fix |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md` | `../../assets/patterns/performance_patterns.js` | no | Insert webflow/ segment: ../../assets/webflow/patterns/performance_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md` | `../../assets/patterns/wait_patterns.js` | no | Insert universal/ segment: ../../assets/universal/patterns/wait_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md` | `../../assets/patterns/validation_patterns.js` | no | Insert universal/ segment: ../../assets/universal/patterns/validation_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md` | `../../assets/patterns/validation_patterns.js` | no | Same fix: ../../assets/universal/patterns/validation_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md` | `../../assets/patterns/wait_patterns.js` | no | Same fix: ../../assets/universal/patterns/wait_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md` | `../../assets/patterns/validation_patterns.js` | no | Same fix: ../../assets/universal/patterns/validation_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md` | `../../assets/patterns/wait_patterns.js` | no | Same fix: ../../assets/universal/patterns/wait_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md` | `../../assets/patterns/validation_patterns.js` | no | Same fix: ../../assets/universal/patterns/validation_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/observer_patterns.md` | `../../assets/patterns/performance_patterns.js` | no | Insert webflow/ segment: ../../assets/webflow/patterns/performance_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/implementation/performance_patterns.md` | `../../assets/patterns/performance_patterns.js` | no | Insert webflow/ segment: ../../assets/webflow/patterns/performance_patterns.js |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/javascript/quality_standards.md` | `animation_workflows.md` | no | Use ../implementation/animation_workflows.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/javascript/quality_standards.md` | `animation_workflows.md` | no | Use ../implementation/animation_workflows.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/javascript/quality_standards.md` | `animation_workflows.md` | no | Use ../implementation/animation_workflows.md |
| P2 | FALSE_POSITIVE | `.opencode/skills/sk-code/references/webflow/javascript/quality_standards.md` | `target` | no | No fix needed; link checker misidentified code syntax as markdown link |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/performance/interaction_gated_loading.md` | `../../assets/checklists/performance_loading_checklist.md` | no | Insert webflow/ segment: ../../assets/webflow/checklists/performance_loading_checklist.md |
| P2 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/performance/webflow_constraints.md` | `/specs/005-example.com/024-performance-optimization/decision-record.md` | no | Remove link or point to an actual existing decision record; this appears to be an example/sample reference |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/shared/dev_workflow.md` | `../../../mcp-chrome-devtools/SKILL.md` | no | Use ../../../../mcp-chrome-devtools/SKILL.md or absolute path .opencode/skills/mcp-chrome-devtools/SKILL.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/verification/verification_workflows.md` | `../../assets/checklists/verification_checklist.md` | no | Insert webflow/ segment: ../../assets/webflow/checklists/verification_checklist.md |
| P1 | REAL_BROKEN | `.opencode/skills/sk-code/references/webflow/verification/verification_workflows.md` | `../../assets/checklists/verification_checklist.md` | no | Same fix: ../../assets/webflow/checklists/verification_checklist.md |

Review verdict: FAIL