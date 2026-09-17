GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only review: your final message is the whole deliverable, and the orchestrator saves it. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite

PERSONA (this repository's `review` agent, condensed): a code reviewer who reports defects with evidence and changes nothing. You run in a read-only sandbox: use commands only to read, such as `git diff`, `git show`, `git grep`, `grep` and `cat`, and never try to write, edit, create, delete, stage or commit a file, or run a generator, a build or a test suite. Never open a file under the home directory outside this repository. Cite `file:line` for every claim.

BACKGROUND. The repository moved its source tree from `.opencode/` to `.skilled/`: every tracked file sits under a real `.skilled/` directory and `.opencode` is a tracked relative link to `.skilled`, so every old path still resolves. Links and generated state already point at `.skilled`. This phase rewrites the remaining text references in tracked files outside `specs/`. Phase 004's ADR-003 keeps `.opencode` only where the reader is opencode itself, root discovery, the consumer contract, the spec compatibility link, a dual-root alternate or a frozen record (`specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design/decision-record.md:298`). Frozen records are the changelog, benchmark report and scorer cache globs. Nothing has been rewritten yet.

TASK UNDER REVIEW. The rewrite is applied in the worktree and not committed. Recount, independently of the phase scripts, every occurrence of the text `.opencode` in tracked files outside `specs/` and outside `node_modules`, starting from `git grep -n -F .opencode -- . ':!specs/' ':!**/node_modules/**'` (binary matches included, so do not pass -I). Classify each occurrence yourself into exactly one class:
- freeze: a path under `.skilled/skills/**/changelog/**` (except `.skilled/skills/system-spec-kit/templates/changelog/**`), `.skilled/skills/**/benchmark/reports/**`, `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/**`, or the four retrieval fixtures `latency-report.json`, `semantic-probes.json`, `recipe-execution.json`, `daemon-off-proof.json` under `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/`;
- generated: a file a generator writes (Hermes skill copies and prompts, Codex prompts and agents, Pi agents, compiled deep contracts, the trigger index and its three fixtures, command bridges, the README verdict baseline, snapshots, the package lock, skill-root graph metadata, description and leaf manifests, the serving-closure manifest, the council graph database);
- routed: a path listed in `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/batch-manifests/routed.tsv`;
- kept: an occurrence a keep record explains: a line matched by `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/keep-list.tsv`, a line that names both root names on purpose, a `.opencode/specs` alias reference, or an occurrence whose path, line, column and line hash appear in a file under `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/ledgers/` (the hash is the first 16 hex digits of the SHA-256 of the full line text);
- never: an identifier or longer name containing the token (`tool.opencode_goal`, `.opencode-local`, `.opencode.json`) or a home-anchored path (`~/.opencode`, `$HOME/.opencode`);
- unclassified: anything else.

RETURN, markdown only. Your final message must be this return and nothing else:
## Verdict
One paragraph with your unclassified count and whether it is zero.
## Counts
A table: class, occurrences, files.
## Unclassified
One row per unclassified occurrence: file:line and the line text. Write "None" if there is none.
