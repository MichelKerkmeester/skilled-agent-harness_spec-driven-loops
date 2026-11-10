## Verdict

Not safe to run write mode as edited. The mandated self-test exited before assertions because the sandbox lacks a usable temporary directory at `rewrite-batch.py:358-363`; the concrete defects below independently block the run.

## Findings

| ID | Severity (P0 blocks the write run, P1 must fix before the write run, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F-011 | P1 | `rewrite-batch.py:275-287` | `run .opencode/skills/x and .opencode/unknown` with a valid `keep` decision for the second token. The automatic first rewrite is not counted, so the computed final column is one too far right and the command refuses. | Compute shifts from every actual rewrite, including automatic R1/R2 occurrences. |
| F-012 | P1 | `rewrite-batch.py:264-288` | The same input with a ledger causes `doc.md` to be written at line 270 before the invalid final-column check raises at line 286, leaving a partial mutation. | Precompute and validate all output and ledger rows before writing any file. |
| F-013 | P1 | `rewrite-batch.py:109-125` | `/.opencode/skills/x` has `path_prefix='/'`, fails the absolute-path test, and rewrites to `/.skilled/skills/x`. `//example.com/.opencode/skills/x` likewise passes as R1 and rewrites an external URL. | Reject root-absolute paths, protocol-relative URLs and all URI schemes before R1 classification. |
| F-014 | P1 | `rewrite-batch.py:63-66,107-108` | `copy .opencode/skills/x and .skilled/skills/xylophone` is kept because `.skilled/skills/x` is found as a substring of the longer path, although the paths differ. | Compare complete path tokens with boundary checks, not substring containment. |
| F-015 | P0 | `build-batch-manifests.py:135-172; rescan-references.py:31-34,81-83` | A tracked file containing only `open .opencode/specs/track/a.md` is placed in `noop` because the builder checks only R1/R3. The rescan then unconditionally labels R2 as kept and reports zero unclassified occurrences despite the canonical specs target. | Include R2 in manifest eligibility and pass the same specs-target policy into the rescan. |
Codex exit 0, 2026-09-17T15:37:08Z to 2026-09-17T15:45:06Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
