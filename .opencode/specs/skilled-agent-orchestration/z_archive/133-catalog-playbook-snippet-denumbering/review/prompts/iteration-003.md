When done, your ENTIRE response must be the single JSON block specified below — it is parsed by a script, not read by a human. Do not write any files. Do not modify anything; this is a READ-ONLY audit. Spec folder for this work: .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering (pre-approved, skip Gate 3) — but you only READ, you do not write. After producing JSON, the orchestrator writes .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/review/deltas/iter-003.jsonl.

# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES in feature catalogs and manual testing playbooks
(`NN--category/NNN-name.md` → `NN--category/name.md`); category FOLDERS kept their
`NN--` numbers. Link conventions in this repo: a relative link may be resolved against
the source file's own directory OR against the repo root (both are valid).

A deterministic markdown-link checker already ran over the whole active surface. For your
slice — **other sk-* skills + deep-* skills** — it flagged these 8 broken markdown links (target
resolves under NEITHER base):

1. [skill:deep] .opencode/skills/deep-loop-runtime/tests/fixtures/council-value/README.md
     link target: ../README.md
2. [skill:sk] .opencode/skills/sk-git/assets/pr_template.md
     link target: ./screenshots/login.png
3. [skill:sk] .opencode/skills/sk-git/assets/pr_template.md
     link target: ./screenshots/dashboard.png
4. [skill:sk] .opencode/skills/sk-git/assets/pr_template.md
     link target: ./screenshots/before.png
5. [skill:sk] .opencode/skills/sk-git/assets/pr_template.md
     link target: ./screenshots/after.png
6. [skill:sk] .opencode/skills/sk-git/assets/pr_template.md
     link target: ./screenshots/mobile.png
7. [skill:sk] .opencode/skills/sk-git/assets/pr_template.md
     link target: ./docs/migration.md
8. [skill:sk] .opencode/skills/sk-prompt-small-model/references/pattern-index.md
     link target: ../models/_index.md

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
  "iteration": 3,
  "slice": "other sk-* skills + deep-* skills",
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