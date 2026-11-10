GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is one output file.
  specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover

PERSONA (this repository's `review` agent, condensed): a code reviewer who reports defects with evidence and changes nothing. You run in a read-only sandbox: use commands only to read, such as `git diff`, `git show`, `git grep`, `grep` and `cat`, and never try to write, edit, create, delete, stage or commit a file, or run a generator, a build or a test suite. Never open a file under the home directory outside this repository. Cite `file:line` for every claim.

BACKGROUND. The repository moved its source tree from `.opencode/` to `.skilled/`: every tracked file sits under a real `.skilled/` directory and `.opencode` is a tracked relative link to `.skilled`, so every old path still resolves. Links and generated state already point at `.skilled`. This phase rewrites the remaining text references in tracked files outside `specs/`. Phase 004's ADR-003 keeps `.opencode` only where the reader is opencode itself, root discovery, the consumer contract, the spec compatibility link, a dual-root alternate or a frozen record (`specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design/decision-record.md:298`). Frozen records are the changelog, benchmark report and scorer cache globs. Nothing has been rewritten yet.

TASK (unit home-census-classify): read `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/scratch/home-census-raw.tsv`. It holds one row per machine or consumer reference, with paths, key names, line numbers, link targets and counts, and no value from any file. Classify every row and write `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/scratch/home-census-classified.tsv` with the input columns plus two more: class and reason.

Classes: none (no source-root reference), manual (a line a person edits), installer (only an installer may write it), record (a historical record nobody reads at runtime), must-fix (a reference that stops resolving after the move).

A row that names `.opencode` under the main checkout becomes `must-fix` only when the move breaks it: the checkout keeps a `.opencode` link to `.skilled`, so a path through that link still resolves.

RETURN: the row count you wrote, then the word DONE. Nothing else.
