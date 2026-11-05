TASK: update the phase docs in `specs/sk-design/021-deprecate-fundamentals/004-review-remediation/` with the alignment pass that ran after the nine fixes.
READ FIRST: scratch/facts.md, the "Alignment pass" block. It is the only evidence source.
EDITS:
1. implementation-summary.md: add the alignment pass to what was built, how it was verified and the known limitations. The open operator items go under limitations. Add the new files to the files table.
2. tasks.md: add one completed task per alignment fix group with its evidence. Keep every existing task.
3. spec.md: if the scope section lists files, add the alignment-pass files. Status stays Complete.
RULES: plain declarative sentences. No em dash, no semicolon, no Oxford comma. Keep frontmatter keys and HTML comments.
ALLOWED WRITE PATHS: spec.md, tasks.md and implementation-summary.md directly inside 004-review-remediation/.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
VERIFY BEFORE YOU FINISH and paste the last 15 lines:
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/004-review-remediation --strict
If it reports derived metadata drift, run the repair-derived command it prints, then validate again.
