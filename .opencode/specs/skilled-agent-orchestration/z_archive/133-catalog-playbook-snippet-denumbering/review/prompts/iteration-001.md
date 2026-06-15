When done, your ENTIRE response must be the single JSON block specified below — it is parsed by a script, not read by a human. Do not write any files. Do not modify anything; this is a READ-ONLY audit. Spec folder for this work: .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering (pre-approved, skip Gate 3) — but you only READ, you do not write. After producing JSON, the orchestrator writes .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/review/deltas/iter-001.jsonl.

# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES in feature catalogs and manual testing playbooks
(`NN--category/NNN-name.md` → `NN--category/name.md`); category FOLDERS kept their
`NN--` numbers. Link conventions in this repo: a relative link may be resolved against
the source file's own directory OR against the repo root (both are valid).

A deterministic markdown-link checker already ran over the whole active surface. For your
slice — **sk-code checklists → references** — it flagged these 66 broken markdown links (target
resolves under NEITHER base):

1. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/config_checklist.md
     link target: ../../references/config/style_guide.md
2. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/javascript_checklist.md
     link target: ../../references/javascript/style_guide.md
3. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/javascript_checklist.md
     link target: ../../references/javascript/quality_standards.md
4. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/python_checklist.md
     link target: ../../references/python/style_guide.md
5. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/python_checklist.md
     link target: ../../references/python/quality_standards.md
6. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/shell_checklist.md
     link target: ../../references/shell/style_guide.md
7. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/shell_checklist.md
     link target: ../../references/shell/quality_standards.md
8. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/typescript_checklist.md
     link target: ../../references/typescript/style_guide.md
9. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/typescript_checklist.md
     link target: ../../references/typescript/quality_standards.md
10. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md
     link target: ../../references/javascript/style_guide.md
11. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md
     link target: ../../references/typescript/style_guide.md
12. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md
     link target: ../../references/python/style_guide.md
13. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md
     link target: ../../references/shell/style_guide.md
14. [skill:sk] .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md
     link target: ../../references/config/style_guide.md
15. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/shared/cross_language_rules.md
16. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/javascript/style_guide.md
17. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/javascript/quality_standards.md
18. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/css/style_guide.md
19. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/css/quality_standards.md
20. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/javascript/style_guide.md
21. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/universal/code_style_guide.md
22. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/javascript/style_guide.md
23. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/javascript/style_guide.md
24. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/motion_dev/quick_start.md
25. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/motion_dev/
26. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/javascript/style_guide.md
27. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/javascript/quality_standards.md
28. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/javascript/style_guide.md
29. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/css/style_guide.md
30. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/shared/cross_language_rules.md
31. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/javascript/style_guide.md
32. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/javascript/quality_standards.md
33. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/css/style_guide.md
34. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/webflow/css/quality_standards.md
35. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../references/shared/enforcement.md
36. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/code_quality_checklist.md
     link target: ../../SKILL.md
37. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/debugging_checklist.md
     link target: ../../references/debugging/debugging_workflows.md
38. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/performance_loading_checklist.md
     link target: ../../references/performance/interaction_gated_loading.md
39. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/performance_loading_checklist.md
     link target: ../../references/performance/cwv_remediation.md
40. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/verification_checklist.md
     link target: ../../references/verification/verification_workflows.md
41. [skill:sk] .opencode/skills/sk-code/assets/webflow/checklists/verification_checklist.md
     link target: ../../references/javascript/quick_reference.md
42. [skill:sk] .opencode/skills/sk-code/changelog/v3.3.0.0.md
     link target: code_quality_standards.md
43. [skill:sk] .opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md
     link target: ../../assets/checklists/debugging_checklist.md
44. [skill:sk] .opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md
     link target: ../../assets/checklists/debugging_checklist.md
45. [skill:sk] .opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md
     link target: ../../assets/integrations/lenis_patterns.js
46. [skill:sk] .opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md
     link target: ../../assets/checklists/debugging_checklist.md
47. [skill:sk] .opencode/skills/sk-code/references/webflow/debugging/debugging_workflows.md
     link target: ../../assets/checklists/debugging_checklist.md
48. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md
     link target: ../../assets/patterns/performance_patterns.js
49. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md
     link target: ../../assets/patterns/wait_patterns.js
50. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md
     link target: ../../assets/patterns/validation_patterns.js
51. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md
     link target: ../../assets/patterns/validation_patterns.js
52. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md
     link target: ../../assets/patterns/wait_patterns.js
53. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md
     link target: ../../assets/patterns/validation_patterns.js
54. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md
     link target: ../../assets/patterns/wait_patterns.js
55. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/implementation_workflows.md
     link target: ../../assets/patterns/validation_patterns.js
56. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/observer_patterns.md
     link target: ../../assets/patterns/performance_patterns.js
57. [skill:sk] .opencode/skills/sk-code/references/webflow/implementation/performance_patterns.md
     link target: ../../assets/patterns/performance_patterns.js
58. [skill:sk] .opencode/skills/sk-code/references/webflow/javascript/quality_standards.md
     link target: animation_workflows.md
59. [skill:sk] .opencode/skills/sk-code/references/webflow/javascript/quality_standards.md
     link target: animation_workflows.md
60. [skill:sk] .opencode/skills/sk-code/references/webflow/javascript/quality_standards.md
     link target: animation_workflows.md
61. [skill:sk] .opencode/skills/sk-code/references/webflow/javascript/quality_standards.md
     link target: target
62. [skill:sk] .opencode/skills/sk-code/references/webflow/performance/interaction_gated_loading.md
     link target: ../../assets/checklists/performance_loading_checklist.md
63. [skill:sk] .opencode/skills/sk-code/references/webflow/performance/webflow_constraints.md
     link target: /specs/005-example.com/024-performance-optimization/decision-record.md
64. [skill:sk] .opencode/skills/sk-code/references/webflow/shared/dev_workflow.md
     link target: ../../../mcp-chrome-devtools/SKILL.md
65. [skill:sk] .opencode/skills/sk-code/references/webflow/verification/verification_workflows.md
     link target: ../../assets/checklists/verification_checklist.md
66. [skill:sk] .opencode/skills/sk-code/references/webflow/verification/verification_workflows.md
     link target: ../../assets/checklists/verification_checklist.md

# ROLE

You are a meticulous path-reference auditor. You verify against the real files on disk —
never guess. You distinguish a genuine broken reference from an intentional template
placeholder or example.

# ACTION

For EACH flagged link above:
1. Read the source file around the link to understand intent.
2. Check the target tree (Grep/Glob/Read) for the real file — it may exist under a slightly
   different slug, a different directory, or not at all.
3. Classify it:
   - severity: P0 (a command/agent/loadable path that breaks runtime), P1 (a real broken
     doc cross-reference a human or tool would follow), or P2 (cosmetic / template example /
     intentional placeholder).
   - classification: REAL_BROKEN | TEMPLATE_EXAMPLE | WRONG_SLUG_TARGET_EXISTS | TARGET_DELETED | FALSE_POSITIVE
   - is_133_caused: true only if the breakage was introduced by the de-numbering migration
     (e.g. the link still points at a numbered path and the de-numbered file exists).
   - if WRONG_SLUG_TARGET_EXISTS, give the correct target path.
4. Then briefly hunt the SAME files for any broken reference the markdown-link regex would
   miss (frontmatter paths, real backtick paths, links that resolve to the WRONG file).

# OUTPUT FORMAT

Return ONLY a single fenced ```json block, no prose before or after, with this shape:

```json
{
  "iteration": 1,
  "slice": "sk-code checklists → references",
  "verdict": "PASS | CONDITIONAL | FAIL",
  "findings": [
    {"ref":"<link target>","source_file":"<path>","severity":"P0|P1|P2",
     "classification":"REAL_BROKEN|TEMPLATE_EXAMPLE|WRONG_SLUG_TARGET_EXISTS|TARGET_DELETED|FALSE_POSITIVE",
     "is_133_caused":false,"correct_target":"<path or null>","evidence":"<file:line or grep result>",
     "recommendation":"<one line>"}
  ],
  "missed_by_regex": [
    {"ref":"<path>","source_file":"<path>","severity":"P0|P1|P2","evidence":"<file:line>","recommendation":"<one line>"}
  ],
  "summary": "<2-3 sentences: how many real vs noise, any systemic pattern>"
}
```

verdict mapping: FAIL if any P0; CONDITIONAL if any P1 (no P0); PASS otherwise.