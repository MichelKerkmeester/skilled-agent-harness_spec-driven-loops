## Verdict

Not safe to run write mode as edited. The self-test exited 1 before assertions because temporary-directory creation failed at `rewrite-batch.py:402-404`; inspection indicates F-011–F-015 are addressed, but the findings below can leave owed references unchanged or make rescan pass falsely.

## Findings

| ID | Severity | File:line | Scenario | Suggested fix |
|---|---|---|---|---|
| F-016 | P0 | `keep-list.tsv:4,7`; `decision-record.md:309`; `rewrite-batch.py:80-85,116-118` | K6 row 4 matches `.skilled/plugins/README.md:3`, and row 7 matches `cli-opencode/README.md:105`, although K6 records only lines 16, 47 and 214. Both are classified kept and omitted from rewriting. | Anchor patterns to the exact approved lines or remove the extra rows. |
| F-017 | P0 | `keep-list.tsv:14-15`; `decision-record.md:315`; `rewrite-batch.py:80-85,183-193` | K12 row 15 matches `.devin/SYNC.md:39`, while the decision records only line 20. The line remains `.opencode` and is treated as kept. | Remove row 15 or anchor it to line 20. |
| F-018 | P0 | `build-batch-manifests.py:45-47,61-67,81-104,165-170`; `rescan-references.py:62-75` | `.skilled/hooks/git/README.md:16` matches routed pattern `.skilled/hooks/git/**` and is routed to phase 005 before the manual bucket, because it is absent from `ROUTED_EXCEPT`. Rescan then hides all its owed edits as `routed-005`. | Add this README to `ROUTED_EXCEPT` or remove the conflicting manual entry. |
| F-019 | P1 | `build-batch-manifests.py:181-186`; `rewrite-batch.py:68-70,303-305` | A tracked `notes.md` containing `backup lives in .skilled-local; run .opencode/skills/x` is treated as a dual-root judged file because `NEW in text` matches `.skilled-local`; apply then refuses without an unnecessary decision. | Detect `.skilled` as a bounded root token, not a substring. |
| F-020 | P0 | `rewrite-batch.py:73-78,116-120,183-193` | `copy .opencode/skills/x or foo.skilled/skills/x` is classified as a same-path alternative because the new-root match has no leading boundary. The old path is kept and rescan accepts it. | Require a valid path boundary before and after the new-root alternative. |
| F-021 | P1 | `rewrite-batch.py:123-142` | `const p = '(?<=foo)/.opencode/skills/x'` has a regex-group `)` before the slash. The lone-slash guard treats it as a variable closer and auto-rewrites it as R1 instead of sending the fragment matcher to review. | Distinguish regex-group closers from variable or placeholder closers. |
| F-022 | P0 | `rescan-references.py:36-45,80-91`; `rewrite-batch.py:314-318,326-329` | A prior judged file with line 1 `run .opencode/skills/x` and line 2 `.skilled marker` can record a keep ledger. After line 2 is removed, the stale ledger still marks the now-nonjudged R1 occurrence as kept, yielding `unclassified=0`. | Invalidate ledger rows for paths not currently judged, or scope ledgers to the current manifest run. |
Codex exit 0, 2026-09-17T16:19:30Z to 2026-09-17T16:31:17Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
