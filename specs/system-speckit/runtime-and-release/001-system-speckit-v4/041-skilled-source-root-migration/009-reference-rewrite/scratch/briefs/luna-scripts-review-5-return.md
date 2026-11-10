## Verdict

Safe to run on the current tracked tree. The remaining defects are P2 because their triggering inputs do not occur outside `specs/`; the relevant logic is at `rewrite-batch.py:39-169`.

## Findings

| ID | Severity | File:line | Scenario | Suggested fix |
|---|---|---|---|---|
| F-029 | P2 | `rewrite-batch.py:75-87,142-148` | No tracked occurrence. Synthetic input `copy https://example.com/.opencode/skills/x or .skilled/skills/x` is classified as a same-path alternative because only the new path’s owner is checked, preserving the external URL. | Reject same-path alternatives when either side is a URL or absolute path before applying the alternative rule. |
| F-030 | P2 | `rewrite-batch.py:39-44,106-108` | No tracked occurrence. `run .opencode or foo.opencode` and `run .opencode or .opencode` match the dual-root keep rule because the second root has no leading boundary and need not differ from the first. | Require a boundary before the second root and require the two root names to differ. |
| F-031 | P2 | `rewrite-batch.py:89-104,149-169` | No tracked occurrence. `cat < input >/.opencode/skills/x` treats the unrelated shell `<` as the opener for `>`, classifying the absolute redirection target as rooted and rewriting it automatically. | Require a syntactically valid, adjacent opener/closer pair before treating `>` as a rooted placeholder. |
| F-032 | P2 | `rewrite-batch.py:89-104` | No tracked occurrence. `echo \$(pwd)/.opencode/skills/x` is treated as an active `$()` root despite the escaped `$`, causing automatic rewriting. | Reject `$()` rooting when the `$` is escaped by an odd number of preceding backslashes. |
Codex exit 0, 2026-09-17T16:52:45Z to 2026-09-17T17:01:28Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
