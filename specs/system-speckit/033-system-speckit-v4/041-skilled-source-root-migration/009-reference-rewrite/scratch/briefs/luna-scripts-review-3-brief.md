GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only review: your final message is the whole deliverable, and the orchestrator saves it. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite

PERSONA (this repository's `review` agent, condensed): a code reviewer who reports defects with evidence and changes nothing. You run in a read-only sandbox: use commands only to read, such as `git diff`, `git show`, `git grep`, `grep` and `cat`, and never try to write, edit, create, delete, stage or commit a file, or run a generator, a build or a test suite. Never open a file under the home directory outside this repository. Cite `file:line` for every claim.

BACKGROUND. The repository moved its source tree from `.opencode/` to `.skilled/`: every tracked file sits under a real `.skilled/` directory and `.opencode` is a tracked relative link to `.skilled`, so every old path still resolves. Links and generated state already point at `.skilled`. This phase rewrites the remaining text references in tracked files outside `specs/`. Phase 004's ADR-003 keeps `.opencode` only where the reader is opencode itself, root discovery, the consumer contract, the spec compatibility link, a dual-root alternate or a frozen record (`specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design/decision-record.md:298`). Frozen records are the changelog, benchmark report and scorer cache globs. Nothing has been rewritten yet.

CONTRACT UNDER REVIEW. Two earlier reviews of the scripts under `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/` reported findings F-001 to F-015, recorded in `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/briefs/luna-scripts-review-return.md` and `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/briefs/luna-scripts-rereview-return.md`. Since the second review the scripts:
- compute each kept token's final column by replaying every edit on its line, and validate every decision before any file is written;
- send a protocol-relative URL (`//host/...`) to review, and match a same-path alternative only on a whole path;
- pass the specs target and a keep-list to the manifest builder and the rescan, so a file holding only specs references is batched when the target is canonical, and the rescan counts those references as kept only while the target is keep;
- send a lone-slash path such as `'/.opencode/x'` (a fragment matcher or a root-absolute path) to review, unless a `}`, `)` or `>` closes a variable or placeholder right before the slash;
- load `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/keep-list.tsv`, the rows of the layout decision's keep-list that sit inside the rewrite set (`specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design/decision-record.md:302-316`);
- treat a batched file whose text already names `.skilled` as judged: it joins a dual-root batch listed in `judged.txt`, and each R1 and R3 occurrence in it changes only by decision;
- refuse to apply when any occurrence that needs a decision has none, or when two decision rows name one occurrence;
- accept repeated `--manifest` arguments and write `census-before.tsv` beside the manifests.

TASK. Read the three scripts and the keep-list whole, run only `python3 specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/rewrite-batch.py --self-test`, and check F-011 to F-015 against the current code. Then look for defects the new behavior introduced: a judged-file flow that changes an occurrence without its decision or leaves one undecided, a completeness check that refuses a valid decision set or accepts an incomplete one, a lone-slash test that sends a variable-rooted repository path to review or lets a fragment matcher through, a keep-list row that matches a line the decision record does not keep or misses one it keeps (rows K6, K8, K12 and K13), a builder rule that puts a file in the wrong bucket, and a rescan rule that hides an owed edit. Report a defect only with the concrete input that reproduces it.

RETURN, markdown only. Your final message must be this return and nothing else, with no narration of what you read:
## Verdict
One paragraph: safe to run the write mode as edited, or not.
## Findings
A table with columns: ID (continue from F-016), Severity (P0 blocks the write run, P1 must fix before the write run, P2 should fix), File:line, Scenario (the inputs and the wrong outcome), Suggested fix. Write "No finding" if there is none.
