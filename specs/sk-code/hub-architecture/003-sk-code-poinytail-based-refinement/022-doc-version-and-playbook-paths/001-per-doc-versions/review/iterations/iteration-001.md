# Deep Review - Iteration 001 (correctness)

Dimension this iteration: **correctness (D1)** - the per-doc version engine's scope, verify and bump behavior and its two test suites, with the pre-commit gate, the gates.tsv row and the pull-request job read as consumer evidence.

## Files Reviewed

- .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs - full read (parsing, scope discovery, apply/verify, bump, git plumbing); bump path exercised by adversarial probes
- .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version-bump.mjs - executed, PASS 24/24
- .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs - executed, PASS 26/26
- .skilled/skills/system-spec-kit/shared/frontmatter/parse-frontmatter.ts - raw/closeIdx contract cross-checked against the engine's line math
- .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md - the bump table and enforcement contract (sections 1-7)
- .skilled/scripts/git-hooks/pre-commit - the doc-version-bump gate region and its staging/index verification
- .github/workflows/skill-doc-frontmatter.yml - the doc-version-raise job
- .skilled/scripts/git-hooks/lib/gates.tsv - the docVersionBump row

Adversarial probes ran in throwaway git repositories (the review target stayed read-only): first-body-line edit, rename with body edit, clean rename, raise-then-rerun, CRLF body edit, malformed 3-part version, valueless version key, unborn HEAD, leading-zero version, below-threshold rename rewrite.

## Findings by Severity

### P0

None.

### P1

None.

### P2

1. [P2] verify rejects a leading-zero 4-part version that gate, apply and VERSION_RE accept
- File: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:305 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:305]
- Case: a doc carries version: 01.2.0.0. verify exits 1 with mismatch:1.2.0.0!=01.2.0.0 (expected 01.2.0.0); gate exits 0 (ok=1); apply exits 0 and leaves the value untouched.
- Evidence: VERSION_RE at line 52 permits leading zeros; normalize4 parses 01 as 1; verifyVersion compares the normalized tuple string against the raw derived string; applyVersion short-circuits on raw equality at lines 277-278, so it reports skip-equal and never normalizes.
- User impact: a hand-run verify fails a doc every other mode accepts, and no mode repairs it; the message contradicts itself.
- Finding class: instance-only. Scope proof: verifyVersion is the single tuple-vs-raw comparison site; its counterpart is the apply raw-equality check.
- Affected surface hints: [verify, apply, gate]
- Recommendation: compare tupleStr(existing) against tupleStr(normalize4(derivedStr)); let apply rewrite a non-canonical but tuple-equal value.

2. [P2] A valueless version key is treated as missing; bump writes a duplicate version line
- File: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:110 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:110]
- Case: a doc has version: with no value. bump --check reports NOT RAISED (next 1.0.0.0) instead of malformed; bump then inserts version: 1.0.0.0 ahead of the closing fence while the empty version: key remains, leaving [version:, version: 1.0.0.0].
- Evidence: the version-line regex requires a non-empty value, so versionLineIdx stays -1; the malformed guard at line 401 only fires when versionLineIdx !== -1; withEdition (lines 360-369) inserts. The line-based gate accepts the result via the first non-empty match.
- User impact: a duplicate YAML mapping key reaches the commit; the shared parser catches YAML parse errors and returns an empty mapping, so parsed-frontmatter consumers can lose the whole block while version gates still pass.
- Finding class: class-of-bug. Scope proof: every empty-valued version key reaches the same insert path; other malformed shapes are already blocked at line 401.
- Affected surface hints: [bump, withEdition, gate, shared frontmatter parser]
- Recommendation: treat ^version:\s*$ as present-but-malformed (same error as 1.2), or replace the existing line instead of inserting a second key.

3. [P2] A rename below git's similarity threshold is treated as an add; a rewritten body raises nothing
- File: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:346]
- Case: a doc is moved with git mv and its body fully rewritten in one commit. git pairs it as delete+add (below the default rename threshold); the add path sees a valid head version with no base blob and continues at line 410; bump --check exits 0 with no raise.
- Evidence: changedDocs runs git diff --cached --raw -z -M with default similarity; probe with a 40-line rewrite produced an unpaired change and check exit 0. When pairing succeeds the R path is correct: clean rename raises nothing, rename plus body edit raises on the new path.
- User impact: a moved-and-rewritten doc commits a body change without an edition raise; the pre-commit gate and the PR check both accept it silently.
- Finding class: class-of-bug. Scope proof: the add path also covers copies and any move git declines to pair; changedDocs and the bump loop are the only diff consumers.
- Affected surface hints: [bump, changedDocs, pre-commit gate, PR check]
- Recommendation: state the threshold behavior in the standard, or pair an add with a deletion by basename or carried version when similarity misses.

## Ruled Out With Evidence

- First body line after the closing fence is detected: a change confined to the line immediately after --- still exits check 1 with NOT RAISED. The engine's closeIdx derived from the shared parser's raw contract (parse-frontmatter.ts lines 44-101) is correct.
- No double raise in one commit: after a raise is staged, a second bump run prints nothing and exits 0; the head-version-above-base guard at line 410 skips it.
- CRLF: a CRLF doc's body change raises 1.0.0.0 to 1.0.1.0, the file keeps every LF preceded by CR, and the check passes once restaged. Quoted values keep their quoting (suite case 4); a new doc seeds version 1.0.0.0 as the last key (suite case 5); a malformed 3-part version blocks with exit 1 (suite case 8 and probe).
- --check contract: exits non-zero and prints the single Fix command; partial staging exits 3 writing nothing (suite cases 1 and 7); the hook blocks exit 1 and 3 and re-verifies that every raised path reached the index (pre-commit lines 880-912).
- Unborn HEAD does not block the first commit: the hook guards the gate with git rev-parse --verify HEAD (pre-commit lines 841-842), so a repo with no commits skips it; the engine's own cannot find the merge base message is only reachable when run by hand.
- No CI bypass via the validation switch: bump --check honors SKDOC_SKIP_VALIDATION (line 502), but .skilled/hooks/hook-flags.env is untracked (.gitignore line 348) and empty, and CI sets no such environment variable.
- No autocrlf false positive in partial staging: no .gitattributes in the repo normalizes .md line endings, so the byte compare of working tree against staged blob (lines 428-431) cannot misfire for that reason.

## Traceability Checks

- spec_code: partial (correctness rules only). The standard's section 4 table matches observed behavior for every row: new doc without a version seeds 1.0.0.0; body change raises third segment and resets fourth (1.2.0.0 to 1.2.1.0, 1.0.0.0 to 1.0.1.0); a hand raise is left alone; frontmatter-only edits raise nothing; clean renames raise nothing; malformed values are never guessed at. Section 7 enforcement wiring verified: hook gate, gates.tsv row 15, PR job (workflow lines 65-78). The three findings are deviations from the table's intent at its edges.
- checklist_evidence: pending - deferred to the traceability iteration.

## Verdict

Three P2 advisories, no P0 and no P1. The bump rule, rename, new-file, quoted-value, CRLF, missing-frontmatter, malformed-version and double-raise questions all resolved as specified; the advisories cover three edges (leading-zero normalization disagreement, an empty version key producing a duplicate line, and below-threshold renames losing the raise).

## Next Dimension

Security (D2): full read of .skilled/scripts/git-hooks/pre-commit beyond the bump region, the workflow's shell interpolation of github.base_ref, path handling in the engine's git invocations and hook staging, and the validation-switch bypass surface.

Review verdict: PASS
