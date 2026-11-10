# Deep Review - Iteration 002 (security)

Dimension this iteration: **security (D2)** - the trust boundaries of the new per-doc version machinery: what a staged path, a worktree file mode, a bypass variable, or a pull-request context can make the gate, the engine, or the workflow read, write, or stage.

## Files Reviewed

- .skilled/scripts/git-hooks/pre-commit - the doc-version-bump block (lines 836-916) read in full against the spec-remint block (lines 690-827) it is modeled on: bypass test at 841, staged-doc name-only pre-filter at 845-847, engine call at 875, raised-path re-staging loop at 896-914.
- .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs - path handling: changedDocs NUL parse at 346, realpath roots at 380-381, inScope at 174, applyVersion containment at 268-294, bump partial guard at 428-435, write/report loop at 436-440; bypass wiring at 33 and 502.
- .github/workflows/skill-doc-frontmatter.yml - doc-version-raise job at 48-78, its env indirection at 76-77, and the fail-closed guard pattern of the sibling job at 34-40.
- .skilled/scripts/git-hooks/lib/gates.tsv - the docVersionBump row (line 15) and the persisted-flag semantics in its header (lines 1-6).
- .skilled/hooks/shared/hook-flags.sh and .gitignore lines 347-348 - where a persisted bypass value can come from.
- .skilled/scripts/git-hooks/tests/pre-commit.test.sh - skimmed as consumer evidence for the new gate.

All reads were read-only; this iteration ran no executable probe, so every claim below rests on source lines plus read-only git queries (git ls-files, git rev-parse HEAD = aa89063bcac2915a7ec3a4fa4102df154f5d554d).

## Findings by Severity

### P0

None.

### P1

None.

### P2

1. [P2] A newline in a staged doc path silently skips the raise staging

- File: .skilled/scripts/git-hooks/pre-commit:898 [SOURCE: .skilled/scripts/git-hooks/pre-commit:898]
- Case: A staged in-scope doc whose file name contains a newline has a body change and no version raise. bump rewrites the working-tree file, reports the raised path on stdout one line per path, and the hook stages the split fragments - none of which is the real path - so the commit records the unraised blob.
- Evidence: the engine writes the raise (frontmatter-version.mjs:437 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:437]) and reports it with console.log(r.path) (frontmatter-version.mjs:439 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:439]). The hook captures stdout as text, DOCV_RAISED="$(node ...)" (pre-commit:875 [SOURCE: .skilled/scripts/git-hooks/pre-commit:875]), then iterates "while IFS= read -r DOCV_PATH" (pre-commit:898-904 [SOURCE: .skilled/scripts/git-hooks/pre-commit:904]). Each fragment is staged with "git add -- "$DOCV_PATH" 2>/dev/null || true" (pre-commit:900 [SOURCE: .skilled/scripts/git-hooks/pre-commit:900]) and verified with "git diff --quiet -- "$DOCV_PATH"" (pre-commit:903 [SOURCE: .skilled/scripts/git-hooks/pre-commit:903]); both miss the real path, so DOCV_LEFT stays empty and the gate passes.
- User impact: the pre-commit gate's raise-and-stage contract is bypassed - a commit can carry a changed doc with the old version - and the working tree is left with an uncommitted raise. The PR job catches covered pull requests, but direct pushes to main or skilled/** carry it.
- Finding class: class-of-bug. Scope proof: the stdout report is the only channel from the engine to the hook for raised paths (the only print site is frontmatter-version.mjs:439; the only consumer is the loop at pre-commit:898-904). changedDocs already treats paths as NUL-unsafe on the read side (frontmatter-version.mjs:346), so the report side is the sole deviation.
- Affected surface hints: [pre-commit gate, bump, raised-path report]
- Confidence: high (source-derived). Downgrade trigger: a NUL-delimited report consumed NUL-safe, or a staging verification that diffs the full raised set instead of per-path fragments.
- Recommendation: emit raised paths NUL-delimited and read them with a NUL-safe loop, or verify staging against the complete raised set.

2. [P2] Symlinks defeat the containment checks; the bump write has no containment check at all

- File: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:437 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:437]
- Case: a worktree file at an in-scope doc path is a symlink to a target outside the skills root while the index holds regular doc content that needs a raise. The only containment check compares path.resolve strings (which do not resolve symlinks), and the bump write performs no containment check, so fs.writeFileSync follows the link and rewrites the target.
- Evidence: applyVersion guards with "path.resolve(absFile).startsWith(path.resolve(opts.skillsRoot) + path.sep)" (frontmatter-version.mjs:270 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:270]) and then writes (frontmatter-version.mjs:292 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:292]). bumpDocs builds abs with path.join(root, r.path) for the lexical inScope filter (frontmatter-version.mjs:174, :391 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:174]), reads through the path in the partial guard (frontmatter-version.mjs:428-435 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:429]), and writes with no re-check (frontmatter-version.mjs:437). The roots are realpath'd for comparison (frontmatter-version.mjs:380-381 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:380]); the write targets are not.
- User impact: a write the gate believes is confined to the skills tree can land on an arbitrary file the symlink points at, and the hook then git-adds the same path as if it were the doc.
- Finding class: class-of-bug. Scope proof: every doc-content write in the engine is one of two sites (frontmatter-version.mjs:292 and :437); neither resolves symlinks before writing.
- Counterevidence sought: a staged symlink (mode 120000) carries the link target as its blob, parses as no frontmatter, and is skipped before any write, so the repository index alone cannot trigger it; the hook-trust block skips the whole toolchain for clones that do not share the checkout's git common dir (pre-commit:33-56 [SOURCE: .skilled/scripts/git-hooks/pre-commit:33]), so a hostile clone cannot run this code. The remaining route - index holds doc content while the worktree file is replaced by a symlink - is local worktree tampering.
- Affected surface hints: [bump, apply, write containment]
- Confidence: medium (mechanism high, reachability local-only). Downgrade trigger: a realpath containment check at the write sites, or a documented trust statement that the worktree is trusted input.
- Recommendation: resolve the write target with fs.realpathSync and compare containment on the real path, or skip paths whose lstat says symlink.

3. [P2] The CI version check executes the pull request's own engine

- File: .github/workflows/skill-doc-frontmatter.yml:78 [SOURCE: .github/workflows/skill-doc-frontmatter.yml:78]
- Case: a pull request edits frontmatter-version.mjs so that bump --check exits 0 while also carrying docs whose versions did not go up. The job checks out the PR merge ref (no base ref override) and runs that edited engine, so the check passes on exactly the change it exists to catch.
- Evidence: the job runs only on pull_request (workflow:52), checks out the PR ref with no ref pin (workflow:56-58), installs and builds from that checkout (workflow:66-71), and runs "node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --check" (workflow:78). The sibling coverage job shows the repository's own fail-closed pattern for guard integrity - it fails when the guard file is missing (workflow:34-40 [SOURCE: .github/workflows/skill-doc-frontmatter.yml:34]) - while the version job has no pin, hash, or base copy of the engine.
- User impact: false assurance. A green result does not prove the version invariant when the PR touches the engine, so that invariant depends on reviewer attention for exactly those PRs.
- Finding class: instance-only. Scope proof: one job runs the check, and nothing else in CI re-runs the engine from a trusted ref.
- Counterevidence sought: checked for a ref or hash pin of the engine (none), a second check from main (none), and whether the pre-commit gate backstops (it runs a committer-controlled engine too, and ordinary commits are its bypass surface).
- Affected surface hints: [pull-request job, engine integrity]
- Confidence: medium. Downgrade trigger: the job pinned to a base-ref copy or hash of the engine, or a separate required check verifying engine integrity against main.
- Recommendation: run the check with the engine loaded from the base ref, or add a required integrity check on the engine file.

## Ruled Out With Evidence

- Workflow branch-name/PR-title shell injection: the job passes github.base_ref into the shell through env: BASE_REF (workflow:76-77), and shell variable expansion inside double quotes does not re-parse metacharacters; the job is pull_request-only with a read-only token, and base_ref names a branch in the base repository (workflow:52, :77-78 [SOURCE: .github/workflows/skill-doc-frontmatter.yml:77]).
- Bypass variable set by commit content: the flag is read from the live environment (pre-commit:841 [SOURCE: .skilled/scripts/git-hooks/pre-commit:841]); its persisted sources are local/global git config, which is never cloned (gates.tsv:1-6 [SOURCE: .skilled/scripts/git-hooks/lib/gates.tsv:1]), and hook-flags.env, which is gitignored (.gitignore:348 [SOURCE: .gitignore:348]), absent on disk, and untracked (git ls-files returns 0 rows).
- Partial-staging data loss on re-stage: the engine returns 3 before writing when a raise target has unstaged edits (frontmatter-version.mjs:428-435 [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:433]) and the hook blocks on rc 3 (pre-commit:880-887 [SOURCE: .skilled/scripts/git-hooks/pre-commit:880]); for files it does raise, the worktree equalled the staged text before the write, so the follow-up git add (pre-commit:900) stages only the version-line rewrite.
- Spaces and leading dashes in staged paths: changedDocs parses git diff --cached --raw -z, NUL-delimited (frontmatter-version.mjs:346), inScope rejects .. and absolute segments (frontmatter-version.mjs:174), and the hook stages via quoted "git add --" (pre-commit:900). Only the newline vector survives, reported above.

## Traceability Checks

- spec_code (core): partial - the security surfaces the findings concern are the enforcement wiring the standard names (hook gate block pre-commit:841-916, gates.tsv row 15, PR job workflow:48-78); requirement-level mapping stays deferred to the traceability iteration.
- checklist_evidence (core): deferred to the traceability iteration, per the strategy's recorded blocked direction.

## Verdict

PASS with advisories (hasAdvisories=true): no P0 and no P1 this iteration; three new P2 findings (R2-P2-001, R2-P2-002, R2-P2-003); the three P2 findings from iteration 1 remain open and are not re-reported. The gate structure held on every other security question: no crafted path can redirect a write or an add outside the skills tree short of a local symlink, no bypass value can arrive from committed content, no partially staged work is lost on re-stage, and the workflow does not splice ref data into shell source.

## Next Dimension

traceability (config order: correctness, security, traceability, maintainability; coverage after this iteration is 2 of 4).

Review verdict: PASS