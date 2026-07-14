When done, your ENTIRE response must be the single JSON block specified below — it is parsed by a script, not read by a human. Do not write any files. Do not modify anything; this is a READ-ONLY audit. Spec folder for this work: .opencode/specs/skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering (pre-approved, skip Gate 3) — but you only READ, you do not write. After producing JSON, the orchestrator writes .opencode/specs/skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/review/deltas/iter-002.jsonl.

# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES in feature catalogs and manual testing playbooks
(`NN--category/NNN-name.md` → `NN--category/name.md`); category FOLDERS kept their
`NN--` numbers. Link conventions in this repo: a relative link may be resolved against
the source file's own directory OR against the repo root (both are valid).

A deterministic markdown-link checker already ran over the whole active surface. For your
slice — **sk-doc assets & templates** — it flagged these 85 broken markdown links (target
resolves under NEITHER base):

1. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ./SOURCE.md
2. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ./results.csv
3. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ./per-probe.jsonl
4. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ./runtime-measurements.md
5. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ./SOURCE.md
6. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ./results.csv
7. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ./per-probe.jsonl
8. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ./runtime-measurements.md
9. [skill:sk] .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md
     link target: ../README.md
10. [skill:sk] .opencode/skills/sk-doc/assets/changelog_template.md
     link target: ./readme_template.md
11. [skill:sk] .opencode/skills/sk-doc/assets/changelog_template.md
     link target: ./install_guide_template.md
12. [skill:sk] .opencode/skills/sk-doc/assets/changelog_template.md
     link target: ../../references/global/hvr_rules.md
13. [skill:sk] .opencode/skills/sk-doc/assets/changelog_template.md
     link target: ../../references/global/core_standards.md
14. [skill:sk] .opencode/skills/sk-doc/assets/changelog_template.md
     link target: ../../../../command/create/changelog.md
15. [skill:sk] .opencode/skills/sk-doc/assets/changelog_template.md
     link target: ../../../system-spec-kit/references/workflows/nested_changelog.md
16. [skill:sk] .opencode/skills/sk-doc/assets/command_template.md
     link target: ./skill_md_template.md
17. [skill:sk] .opencode/skills/sk-doc/assets/command_template.md
     link target: ../../references/global/core_standards.md
18. [skill:sk] .opencode/skills/sk-doc/assets/command_template.md
     link target: ../../references/global/validation.md
19. [skill:sk] .opencode/skills/sk-doc/assets/frontmatter_templates.md
     link target: ../skill/skill_md_template.md
20. [skill:sk] .opencode/skills/sk-doc/assets/frontmatter_templates.md
     link target: ../command_template.md
21. [skill:sk] .opencode/skills/sk-doc/assets/frontmatter_templates.md
     link target: ../../references/global/core_standards.md
22. [skill:sk] .opencode/skills/sk-doc/assets/frontmatter_templates.md
     link target: ../../references/global/validation.md
23. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
24. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
25. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
26. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
27. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
28. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
29. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
30. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
31. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
32. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
33. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
34. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
35. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
36. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
37. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
38. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
39. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
40. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
41. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
42. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
43. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
44. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
45. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
46. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
47. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: ../docs/guide.md
48. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: /docs/guide.md
49. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: url
50. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: ../skill/skill_md_template.md
51. [skill:sk] .opencode/skills/sk-doc/assets/llmstxt_templates.md
     link target: ../../references/global/core_standards.md
52. [skill:sk] .opencode/skills/sk-doc/assets/readme/install_guide_template.md
     link target: ./MCP%20-%20New%20Tool.md
53. [skill:sk] .opencode/skills/sk-doc/assets/readme/install_guide_template.md
     link target: ./frontmatter_templates.md
54. [skill:sk] .opencode/skills/sk-doc/assets/readme/install_guide_template.md
     link target: ../../../../install_guides/MCP%20-%20Spec%20Kit%20Memory.md
55. [skill:sk] .opencode/skills/sk-doc/assets/readme/install_guide_template.md
     link target: ../../../../install_guides/MCP%20-%20Code%20Mode.md
56. [skill:sk] .opencode/skills/sk-doc/assets/readme/readme_code_template.md
     link target: ../README.md
57. [skill:sk] .opencode/skills/sk-doc/assets/readme/readme_code_template.md
     link target: ../../ARCHITECTURE.md
58. [skill:sk] .opencode/skills/sk-doc/assets/readme/readme_code_template.md
     link target: ../sibling/README.md
59. [skill:sk] .opencode/skills/sk-doc/assets/readme/readme_template.md
     link target: ../skill-name/SKILL.md
60. [skill:sk] .opencode/skills/sk-doc/assets/readme/readme_template.md
     link target: ./path/to/doc.md
61. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: frontmatter_templates.md
62. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: ./references/workflow-details.md
63. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: ./references/reference-name.md
64. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: ./references/workflow-name.md
65. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: ./assets/template-name.md
66. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: ./assets/checklist-name.md
67. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: INSTALL_GUIDE.md
68. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: ./references/reference-name.md
69. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_md_template.md
     link target: ./assets/template-name.md
70. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_readme_template.md
     link target: ./SKILL.md
71. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_readme_template.md
     link target: ./references/[name].md
72. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_readme_template.md
     link target: ./assets/[name].md
73. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ./standard_file.md
74. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ../scripts/script_name.js
75. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ../assets/template_name.md
76. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ../scripts/workflow_name.py
77. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ../assets/workflow_config.yaml
78. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ../scripts/script_name.py
79. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ../assets/config.yaml
80. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ./scripts/workflow_router.py
81. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ../scripts/
82. [skill:sk] .opencode/skills/sk-doc/assets/skill/skill_reference_template.md
     link target: ../assets/
83. [skill:sk] .opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md
     link target: ../../template_rules.json
84. [skill:sk] .opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md
     link target: ../../../references/global/core_standards.md
85. [skill:sk] .opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md
     link target: ../../../SKILL.md

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
  "iteration": 2,
  "slice": "sk-doc assets & templates",
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