When done, your ENTIRE response must be the single JSON block specified below — it is parsed by a script, not read by a human. Do not write any files. Do not modify anything; this is a READ-ONLY audit. Spec folder for this work: .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering (pre-approved, skip Gate 3) — but you only READ, you do not write. After producing JSON, the orchestrator writes .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/review/deltas/iter-005.jsonl.

# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES in feature catalogs and manual testing playbooks
(`NN--category/NNN-name.md` → `NN--category/name.md`); category FOLDERS kept their
`NN--` numbers. Link conventions in this repo: a relative link may be resolved against
the source file's own directory OR against the repo root (both are valid).

A deterministic markdown-link checker already ran over the whole active surface. For your
slice — **cli-* + remaining catalog/playbook roots** — it flagged these 22 broken markdown links (target
resolves under NEITHER base):

1. [catalog-playbook] .opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/004-ai-council-multi-strategy-planning.md
2. [catalog-playbook] .opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/009-write-agent-doc-generation.md
3. [catalog-playbook] .opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/004-ai-council-multi-strategy-planning.md
4. [catalog-playbook] .opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/009-write-agent-doc-generation.md
5. [catalog-playbook] .opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/004-ai-council-profile.md
6. [catalog-playbook] .opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/004-ai-council-profile.md
7. [catalog-playbook] .opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md
     link target: 03--model-presets/002-deepseek-v4-complex.md
8. [catalog-playbook] .opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md
     link target: 03--model-presets/002-deepseek-v4-complex.md
9. [catalog-playbook] .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/004-write-agent-doc-generation.md
10. [catalog-playbook] .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/005-ai-council-multi-strategy.md
11. [catalog-playbook] .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/004-write-agent-doc-generation.md
12. [catalog-playbook] .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md
     link target: 04--agent-routing/005-ai-council-multi-strategy.md
13. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md
14. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 02--mutation/10-per-record-history-log.md
15. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 04--maintenance/035-embedding-status-reconciliation.md
16. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 10--graph-signal-activation/_deprecated/09-anchor-tags-as-graph-nodes.md
17. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md
18. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md
19. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 13--memory-quality-and-indexing/_deprecated/22-implicit-feedback-log.md
20. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 13--memory-quality-and-indexing/_deprecated/20-weekly-batch-feedback-learning.md
21. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 14--pipeline-architecture/_deprecated/09-activation-window-persistence.md
22. [catalog-playbook] .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md
     link target: 14--pipeline-architecture/_deprecated/15-warm-server-daemon-mode.md

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
  "iteration": 5,
  "slice": "cli-* + remaining catalog/playbook roots",
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