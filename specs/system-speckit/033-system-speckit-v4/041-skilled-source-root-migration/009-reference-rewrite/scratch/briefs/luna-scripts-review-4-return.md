## Verdict

Not safe to run write mode as edited. F-016–F-022’s stated dispositions are supported by the keep-list, routing, boundary and ledger logic, but the remaining defects can preserve invalid references, rewrite non-repository paths, or write outside a manifest (`rewrite-batch.py:39-46,83-161,327-345`).

## Findings

| ID | Severity | File:line | Scenario | Suggested fix |
|---|---|---|---|---|
| F-023 | P1 | `rewrite-batch.py:83-88,146-161,194-205` | `echo >/.opencode/skills/x` treats shell redirection `>` as a valid placeholder closer, classifies the path as R1 and rewrites it to `>/.skilled/skills/x`. | Validate balanced `${...}` and `<...>` delimiters before accepting `}` or `>` as rooters. |
| F-024 | P1 | `rewrite-batch.py:127-161` | `const p = '(?<=foo)\\/\\.opencode\\/skills\\/x'` has an escaped lone slash, but `path_prefix` is `\/`, so the root-fragment guard is skipped and the regex fragment is rewritten. | Distinguish escaped literal root slashes from valid repository-relative paths. |
| F-025 | P0 | `rewrite-batch.py:39-44,100-105`; `rescan-references.py:84-94` | `run .opencode or .skilled-local` matches the prose dual-root regex because `\b` accepts the hyphen, so the old root is classified K and rescan accepts it. | Require a trailing name boundary such as `(?![A-Za-z0-9_.-])` after the second root. |
| F-026 | P1 | `rewrite-batch.py:45-46,70-72,323-325`; `build-batch-manifests.py:181-186` | `backup is .skilled.json; run .opencode/skills/x` makes `NEW_ROOT` match `.skilled`, incorrectly marks the file judged and requires an unnecessary decision for the R1 path. | Reject dot-extension names or detect the new root with the same contextual classifier used for paths. |
| F-027 | P1 | `rewrite-batch.py:300-329,344-345` | A manifest containing only `listed.md`, a judged file `extra.md`, and a valid rewrite decision for `extra.md` causes `extra.md` to be rewritten because decision paths are added to the output set. | Reject decision rows whose paths are absent from the supplied manifests. |
| F-028 | P0 | `rewrite-batch.py:75-80,136-145`; `rescan-references.py:84-94` | `copy .opencode/skills/x or https://example.com/.skilled/skills/x` passes the new leading-boundary check, is classified as a same-path alternative and keeps the old reference. | Restrict same-path alternatives to equivalent non-URL path contexts before applying K. |
Codex exit 0, 2026-09-17T16:34:09Z to 2026-09-17T16:44:48Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
