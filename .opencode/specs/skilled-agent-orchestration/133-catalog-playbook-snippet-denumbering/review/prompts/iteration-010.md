When done, your ENTIRE response must be the single JSON block specified below — it is parsed by a script, not read by a human. Do not write any files. Do not modify anything; this is a READ-ONLY audit. Spec folder for this work: .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering (pre-approved, skip Gate 3) — but you only READ, you do not write. After producing JSON, the orchestrator writes .opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/review/deltas/iter-010.jsonl.

# CONTEXT

Repository: a docs/skills monorepo. A recent migration (#133) de-numbered per-feature
snippet FILENAMES (category folders kept `NN--` numbers). A deterministic markdown-link
checker already covered ordinary `](target.md)` links across the surface and found 295
broken (mostly pre-existing). Your job is the references that regex CANNOT see.

Link conventions: a relative path may resolve against the source file's directory OR the
repo root. Both are valid — only flag a reference if it resolves under NEITHER.

# ROLE

You are a meticulous path-reference auditor. Verify against real files on disk — never guess.

# ACTION — HUNT SCOPE

Cross-skill references only: a doc inside one skill that points into a DIFFERENT skill's files (e.g. cli-opencode referencing ../sk-prompt-small-model/..., or an agent/command referencing .opencode/skills/<other>/...). For each, confirm the target file exists AND is the intended file (not just any file with that basename). Report broken targets and wrong-file (slug-drift) targets. Concentrate on the cli-*, deep-*, and system-* skills plus .opencode/agents and .opencode/commands, which have the densest cross-skill wiring.

Use Grep/Glob/Read. Be systematic: enumerate the files in scope, extract the path-like
references, resolve each against both bases, and report only the ones that resolve to nothing
(or to the wrong file). Prefer precision over volume — every finding must cite file:line and
name the missing/wrong target.

TIME-BOX (critical): finish within ~9 minutes. A grep-driven sweep beats reading every file
end-to-end — use Grep to extract candidate path strings, then Read only to confirm. If the
scope is larger than you can finish, examine a representative set and report the count in
"files_examined". ALWAYS emit the final JSON block before you stop — partial findings inside
valid JSON are far more useful than exhaustive work with no parseable output.

# OUTPUT FORMAT

Return ONLY a single fenced ```json block, no prose before or after:

```json
{
  "iteration": 10,
  "slice": "cross-skill references (skill A → skill B)",
  "verdict": "PASS | CONDITIONAL | FAIL",
  "findings": [
    {"ref":"<path referenced>","source_file":"<path>","severity":"P0|P1|P2",
     "classification":"REAL_BROKEN|WRONG_SLUG_TARGET_EXISTS|TARGET_DELETED|BROKEN_ANCHOR",
     "is_133_caused":false,"correct_target":"<path or null>","evidence":"<file:line>",
     "recommendation":"<one line>"}
  ],
  "files_examined": <integer>,
  "summary": "<2-3 sentences: coverage + any systemic pattern>"
}
```

verdict mapping: FAIL if any P0; CONDITIONAL if any P1 (no P0); PASS otherwise.