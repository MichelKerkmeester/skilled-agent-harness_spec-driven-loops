TASK: close the phase docs in `specs/sk-design/021-deprecate-fundamentals/004-review-remediation/`. The nine fixes are DONE and verified. You are recording them, not doing them.
READ FIRST: scratch/facts.md, especially the "Results" block. It is the only evidence source. Do not run the fixes again and do not invent results.
EDITS:
1. implementation-summary.md: fill every section from facts.md. Name DeepSeek Flash as the editor and the three orchestrator corrections. The files-changed table lists every file the fixes touched, including the authored twins, the reminted sk-code manifest, `$SC/graph-metadata.json` and the regenerated `.hermes` mirrors.
2. tasks.md: mark every task `[x]` with its evidence from facts.md. Leave unchecked only the final packet-gate task, which the orchestrator runs.
3. acceptance-criteria.md: set every row AC-001 to AC-009 to Met with its evidence.
4. spec.md metadata: Status Complete.
5. Parent `specs/sk-design/021-deprecate-fundamentals/spec.md`: in the Phase Documentation Map, give phase 4 a one-line focus and Status Complete, and add a handoff row in the same style as the others.
RULES: plain declarative sentences. No em dash, no semicolon, no serial comma. Keep frontmatter keys and HTML comments.
ALLOWED WRITE PATHS: the four docs directly inside 004-review-remediation/ and the parent spec.md.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
VERIFY BEFORE YOU FINISH and paste the last 15 lines:
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/004-review-remediation --strict
Fix every error in your files. If it reports derived metadata drift, run the repair-derived command it prints, then validate again.
