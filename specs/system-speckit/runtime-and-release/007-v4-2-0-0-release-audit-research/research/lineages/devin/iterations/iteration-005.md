# Iteration 5: Remaining Numeric Claims

## Focus

Finish Q3 by verifying the concrete test-result and count claims that earlier iterations deferred. Selected interpretation: a claim is confirmed only when a command or a file count at HEAD settles it; a claim that needs a suite run outside the write boundary is marked UNKNOWN with the evidence that would settle it. Deferred: the fix-commit sweep for Q1.

## Actions Taken

1. Counted the OpenCode plugin files, the advisor test files at HEAD and at the notes' pinned commit, the deep-loop offer fixture cases, and the deep-loop tree's file count.
2. Ran the overlay guard suite at HEAD, which is a read-only unit test writing only to a temp fixture tree.
3. Checked the overlay guard test's history to date the count change.

## Findings

1. **DRIFT (P2) — "Overlay guard suite | 20 of 20" no longer matches HEAD, and was already stale when written.** Running `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` at HEAD reports `tests 21`, `pass 21`, `fail 0`. The twenty-first test, `the status remedy quotes a tree root with a space so it runs as pasted`, landed in `3bfd5e111fc` on 2026-11-21, four days before the notes' last edit (`98b712cd248`, 2026-11-25), so the row was wrong at writing time rather than outrun by later work. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:412] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:817]

## Verified Claims (not findings)

- **"all 20 plugin files active"** matches 20 top-level `*.js` files in `.opencode/plugins/`.
- **"187 files"** for the advisor runtime suite matches 187 `*.vitest.ts` files at `46465394d97`; HEAD holds 193, so the row is correctly pinned to that commit rather than to HEAD.
- **"368 shared cases"** matches 368 entries in `deep-loop-offer-cases.json`.
- **"595 deep-loop files"** cannot be reproduced as a plain file count (the tree holds 1,354 files including tests, docs and fixtures); it is a quality-gate scope count, not a tree count, so it is UNKNOWN rather than contradicted.

## Ruled Out

- **Plugin-count drift.** The plugin count is exactly 20.
- **Pinned-file-count drift.** The 187-file figure is explicitly pinned to `46465394d97` and matches that commit.
- **Shared-case drift.** 368 matches.
- **The 595-file figure as a tree count.** It does not describe the whole tree, but the notes present it as a quality-gate scope, which the gate computes over a selected file set; calling it drift would be unsupported.

## Dead Ends

- **Running the advisor, deep-loop or doctor suites to settle their totals.** Each writes test artifacts or coverage databases outside the lineage directory, which the dispatch forbids. Those totals stay UNKNOWN with the exact command that would settle them.
- **Finding the README-check script behind "79 of 79".** No script in the deep-loop tree reports that count, so the figure stays UNKNOWN.

## Edge Cases

- Ambiguous input: "test number" was read as the number of tests the suite runs at HEAD. A figure pinned to a commit is not drift when it matches that commit.
- Contradictory evidence: none.
- Missing dependencies: the suite-run evidence for the large totals is unavailable inside the write boundary.
- Partial success: none.

## Sources Consulted

- `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:412`
- `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` output at HEAD
- `git log -1 -S "the status remedy quotes a tree root with a space" -- .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs`
- `.opencode/plugins/` file list
- `.skilled/skills/system-skill-advisor/runtime/tests` file count at HEAD and at `46465394d97`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json`
- `.skilled/skills/system-deep-loop` file count
- `.skilled/changelog/skilled/v4.2.0.0.md:799-825`

## Assessment

- New information ratio: 1.00
- Questions addressed: Q3 (substantially: one more confirmed drift, three claims confirmed, two marked UNKNOWN)
- Questions answered: none in full

## Reflection

- What worked and why: running the one suite that writes only to a temp fixture turned a "20 of 20" claim into an observed 21-test result, which is stronger evidence than any file count. Dating the twenty-first test through `git log -S` showed the row was stale at writing time, not merely outrun.
- What did not work and why: the larger totals need full suite runs, and the notes' 595-file figure has no reproducible file-set definition, so both stayed UNKNOWN. Guessing a file set to make the number match would have produced a false confirmation.
- What I would do differently: pick the smallest runnable suite in the table first, since a confirmed count drift there is worth more than ten unverifiable large totals.

## Recommended Next Focus

Complete Q1 with a fix-commit sweep: list the window's `fix` commits whose subjects name a user-visible surface (a flag, command, default, exit code, path or removal) and check each against the notes' sections and folded "Smaller fixes" blocks, so the MISSING list is not limited to `feat` commits.
