When done, your ENTIRE response must be the single JSON block specified below — it is parsed by a script, not read by a human. Do not write any files. Do not modify anything; this is a READ-ONLY audit. Spec folder for this work: .opencode/specs/skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering (pre-approved, skip Gate 3) — but you only READ, you do not write. After producing JSON, the orchestrator writes .opencode/specs/skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/review/deltas/iter-006.jsonl.

# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES in feature catalogs and manual testing playbooks
(`NN--category/NNN-name.md` → `NN--category/name.md`); category FOLDERS kept their
`NN--` numbers. Link conventions in this repo: a relative link may be resolved against
the source file's own directory OR against the repo root (both are valid).

A deterministic markdown-link checker already ran over the whole active surface. For your
slice — **skill:system non-playbook refs** — it flagged these 21 broken markdown links (target
resolves under NEITHER base):

1. [skill:system] .opencode/skills/system-code-graph/INSTALL_GUIDE.md
     link target: ../../install_guides/SET-UP%20-%20Code%20Graph.md
2. [skill:system] .opencode/skills/system-skill-advisor/INSTALL_GUIDE.md
     link target: ../../<spec-folder>
3. [skill:system] .opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md
     link target: ../../skill_advisor/tests/README.md
4. [skill:system] .opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/README.md
     link target: ../../skill_advisor/lib/README.md
5. [skill:system] .opencode/skills/system-skill-advisor/references/runtime/freshness_contract.md
     link target: ../feature_catalog/01--daemon-and-freshness/
6. [skill:system] .opencode/skills/system-skill-advisor/references/runtime/freshness_contract.md
     link target: ../manual_testing_playbook/05--auto-update-daemon/
7. [skill:system] .opencode/skills/system-spec-kit/ARCHITECTURE.md
     link target: ./INSTALL_GUIDE.md
8. [skill:system] .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md
     link target: ../FORMAT.md
9. [skill:system] .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/README.md
     link target: ../README.md
10. [skill:system] .opencode/skills/system-spec-kit/mcp_server/lib/enrichment/README.md
     link target: ../../code_graph/README.md
11. [skill:system] .opencode/skills/system-spec-kit/mcp_server/lib/providers/README.md
     link target: ../contracts/README.md
12. [skill:system] .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md
     link target: ../skill_advisor/README.md
13. [skill:system] .opencode/skills/system-spec-kit/mcp_server/stress_test/matrix/README.md
     link target: ../skill-advisor/README.md
14. [skill:system] .opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/README.md
     link target: ../code-graph/README.md
15. [skill:system] .opencode/skills/system-spec-kit/references/templates/template_guide.md
     link target: plan.md
16. [skill:system] .opencode/skills/system-spec-kit/references/templates/template_guide.md
     link target: spec.md
17. [skill:system] .opencode/skills/system-spec-kit/references/templates/template_guide.md
     link target: ../spec.md
18. [skill:system] .opencode/skills/system-spec-kit/references/templates/template_guide.md
     link target: ../template-marker-system/
19. [skill:system] .opencode/skills/system-spec-kit/references/templates/template_guide.md
     link target: ../hybrid-validation/
20. [skill:system] .opencode/skills/system-spec-kit/scripts/resource-map/README.md
     link target: ../../templates/level_contract_optional_resource-map.md
21. [skill:system] .opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/broken-links/spec.md
     link target: 003-missing/

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
  "iteration": 6,
  "slice": "skill:system non-playbook refs",
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