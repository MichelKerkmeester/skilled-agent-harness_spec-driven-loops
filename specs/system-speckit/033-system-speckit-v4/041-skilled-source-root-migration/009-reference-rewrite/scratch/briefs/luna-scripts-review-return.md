## Verdict

Not safe to run write mode as edited. `--self-test` passed all 34 cases, but the findings below include a P0 false-negative rescan and multiple unsafe rewrites.

## Findings

| ID | Severity (P0 blocks the write run, P1 must fix before the write run, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F-001 | P0 | `rewrite-batch.py:183-184,341-349`; `rescan-references.py:80-83` | A line containing two R3 occurrences, with only one `keep` decision, gets one line-level ledger key. Rescan marks both occurrences kept, reporting zero unclassified while the undecided occurrence remains. | Key ledger entries by occurrence column and validate each remaining occurrence individually. |
| F-002 | P1 | `rewrite-batch.py:39-43,94-104,145-160` | `https://example.com/.opencode/skills/x` with `skills` as an entry is classified R1 and rewritten to `https://example.com/.skilled/skills/x`. | Detect URI schemes and external authorities before applying path rewrites. |
| F-003 | P1 | `rewrite-batch.py:25-26,83-85,94-104` | `/Users/alice/.opencode/skills/x` is not recognized as home-anchored and is rewritten to `/Users/alice/.skilled/skills/x`. | Detect absolute home-directory paths, or require a repository-relative path boundary. |
| F-004 | P1 | `rewrite-batch.py:25,72-89,94-104` | `foo-.opencode/skills/x` is classified R1 because `-` is not in `WORD`, then becomes `foo-.skilled/skills/x`. | Treat `-` and `.` before the token as longer-name boundaries, or require a path delimiter. |
| F-005 | P1 | `rewrite-batch.py:31-36,59-64,94-104,145-160` | `copy '.opencode/skills' or '.skilled/skills'` misses `DUAL_ROOT`, rewrites the first path, and produces two `.skilled` alternatives. | Extend dual-root matching to quoted path alternatives joined by `or` or `and`. |
| F-006 | P1 | `rewrite-batch.py:125-164,335-339` | A CRLF file such as `run .opencode/skills/x\r\nuntouched\r\n` is written with LF endings throughout, changing bytes beyond the token. | Read and write bytes, or preserve the original newline convention explicitly. |
| F-007 | P1 | `rewrite-batch.py:322-336,147-149` | A decision for `old .opencode/unknown` can apply to a later-edited `new .opencode/other` at the same line and column because validation checks no content hash. | Store and validate a source-line hash or exact occurrence text in each decision. |
| F-008 | P2 | `rewrite-batch.py:107-119,145-160` | With `--specs-target canonical`, `path.join(root, '.opencode', 'specs')` is classified `R2:specs-segment` but is not rewritten because only detail `specs` is applied. | Safely rewrite the quoted segment to `path.join(root, 'specs')`, or classify it as review-required R3. |
| F-009 | P2 | `rewrite-batch.py:16,290-294` | The docstring advertises `--verify`, but `rewrite-batch.py --verify ...` is rejected because the parser defines no such mode. | Implement the mode or remove it from the interface contract. |
| F-010 | P2 | `build-batch-manifests.py:137-139` | A repository with no tracked `.opencode` matches makes `git grep` exit 1, and `check=True` aborts instead of producing empty manifests. | Treat grep exit 1 as an empty candidate set. |
Codex exit 0, 2026-09-17T15:21:02Z to 2026-09-17T15:26:59Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
