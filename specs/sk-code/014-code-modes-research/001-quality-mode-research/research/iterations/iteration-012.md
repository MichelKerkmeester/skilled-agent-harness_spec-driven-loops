# Iteration 12: Second-model re-check 2 of 5 — ranks 3, 4 and 5

## Focus

Re-check, on current disk, the three claims that section 6 of `research/research.md` ranks 3, 4 and 5 rest on. Iterations 1 to 10 ran on one model family (`gpt-6-luna`); this pass is a second family testing the same anchors rather than repeating the first pass. Rank 3 was replayed because `git log --oneline -4 -- .skilled/skills/sk-code` shows the hub and CI surface changed today. Rank 4 was replayed by running the comment checker against a tracked workflow file. Rank 5 was replayed by testing whether each named enforcement-layer path exists, then by testing whether the layer is actually installed.

Verdict summary: rank 3 **CONFIRMED**, rank 4 **REFUTED in part** and extended with a new hazard, rank 5 **CONFIRMED but under-stated** — path existence does not prove installation.

## Actions Taken

1. `git log --oneline -4 -- .skilled/skills/sk-code` — four commits, the top three dated today: `0781e81da2 fix(sk-code): align the hub docs and routing with its current surfaces`, `bce45aa297 docs(sk-code): bring the CI job shape rules to the current workflows`, `028bd0f5cd feat(sk-code): add the read-only CI surface to the sk-code hub`. The surface the rank-3 claim depends on is therefore live and freshly edited.
2. Scanned `sk-code-quality/SKILL.md` for every `sk-code-ci` or `.github` occurrence: exactly one hit, line 131. Read the Target-Path Checklist Map (lines 112-121) to see whether any `.github/workflows/` row exists: none.
3. Read `sk-code-ci/SKILL.md` lines 100-118 to replay the claim that the CI packet still assigns workflow authoring to quality.
4. Ran the checker the way the dispatch prompt prescribed, `bash .../check-comment-hygiene.sh .github/workflows/comment-hygiene.yml`: bash failed to parse the file and exited 2.
5. Re-ran it correctly, `python3 .../check-comment-hygiene.sh .github/workflows/comment-hygiene.yml`: exit 2, no output.
6. Read the script head, its `main()` and its unit test's exit assertions to separate "skipped" from "never executed".
7. Tested each named enforcement-layer path, then read `core.hooksPath` and the `.claude/settings.json` `PostToolUse` wiring to test installation rather than existence.

## Findings

### Rank 3 — CONFIRMED

**OBSERVED.** The CI packet still assigns workflow authoring to quality, unchanged by today's CI commits: `sk-code-review` applies the rules to a workflow diff and `sk-code-quality` applies them to a workflow being authored. [SOURCE: .skilled/skills/sk-code/sk-code-ci/SKILL.md:109] ``- `sk-code-review` applies the rules to a workflow diff and `sk-code-quality` applies them to a workflow being authored.``

**OBSERVED.** Quality names no CI surface and no `.github/` target other than its own hygiene workflow. A scan of every `sk-code-ci`/`.github` occurrence in `SKILL.md` returns one line — the enforcement-gate row — and the Target-Path Checklist Map ends at the language/config row with no `.github/workflows/` entry. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:131] `| CI block | `.github/workflows/comment-hygiene.yml` | Blocks pull requests with forbidden comment patterns. |` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:121] `| OpenCode language/config files | language/config checklist in `../sk-code-skilled/assets/checklists/` |`

**DERIVED.** Rank 3's asymmetry survives the hub rewrite: the contract is stated from the CI side only. A quality run over a `.github/workflows/` target has no map row to reach CI's rule references, so the sentence at `sk-code-ci/SKILL.md:109` is unenforceable from the quality end. Rank 3 stands as written.

### Rank 4 — REFUTED in part, and a new hazard

**REFUTED.** The claim "no test expects exit 2" is false on current disk. The checker's own unit test builds a `.txt` input, runs the checker twice on it, and asserts the skip exit explicitly. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh:74] `if [[ "$multi_exit" -eq 1 && "$multi_output" == *"multi_bad.js:1:"* && "$clean_exit" -eq 0 && "$skip_exit" -eq 2 ]]; then`

What remains true is narrower: exit 2 is unit-tested, but the *workflow* never reads it. The quality workflow demands only zero violations, so a run in which every file was skipped satisfies the stated gate. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:135] `Run `scripts/check-comment-hygiene.sh <file>` on each modified file that can contain comments. Zero violations are required before a quality pass.`

**OBSERVED.** The skip exit is real and it is silent. Run correctly against a tracked workflow file, the checker prints nothing and returns 2 — the same code the unit test asserts for a skipped `.txt`. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:224] `sys.exit(0 if 0 in codes else 2)` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:10] `  2 — every file was skipped (binary, unknown extension, or in excluded dir)`

**OBSERVED (new — not in the first pass).** The checker is Python behind a `.sh` name, and the skill's own instruction names only the path, not the interpreter: `Run `scripts/check-comment-hygiene.sh <file>``. Invoked the obvious way — `bash scripts/check-comment-hygiene.sh <file>` — bash parses the Python body as shell, emits `syntax error near unexpected token '('` at the `def` line and exits 2. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1] `#!/usr/bin/env python3` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:21] `def check_file(filepath):`

**DERIVED.** Exit 2 therefore conflates two states a caller must distinguish: "every input was skipped" and "the checker never ran". Under the workflow's zero-violations rule both read as a pass. This makes rank 4 stronger, not weaker — the recommendation should also require the checker to be invoked through its shebang or `python3`, and exit 2 to be reported as `skipped`, never as clean. The unit test cannot catch this because it already calls `python3 "$CHECKER"` directly. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh:67] `multi_output="$(python3 "$CHECKER" "$TMP_DIR/multi_good.js" "$TMP_DIR/multi_bad.js" "$TMP_DIR/multi_skip.txt" 2>&1)"`

### Rank 5 — CONFIRMED, but existence is not installation

**OBSERVED.** Every path the skill names resolves: `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/install-git-hooks.sh`, `.github/workflows/comment-hygiene.yml` and the dist helper all exist. The write-time layer is genuinely wired for Claude: [SOURCE: .claude/settings.json:227] `"command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && node .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs || {`

**OBSERVED (new — extends the rank).** In this checkout `core.hooksPath` does **not** point at the repository's hooks directory: it resolves to `/Users/michelkerkmeester/.config/git/hooks`. The pre-commit block is described as installed through `core.hooksPath` by the repository's installer, yet the active hooks path is a user-level directory outside the repo. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:130] `| Pre-commit block | `.skilled/scripts/git-hooks/pre-commit`, installed through `core.hooksPath` by `.skilled/scripts/install-git-hooks.sh` | Blocks commits with forbidden comment patterns across runtimes. |`

**DERIVED.** A probe that only tests `test -e` would report this layer as present while the commit path is not governed by it. Rank 5's probe must therefore check three things per layer — the file exists, the host wires it (a settings key, `core.hooksPath`), and the wired target resolves — and report the layer as `not installed` when either of the last two fails. This is the same failure class the changelog already records once: [SOURCE: .skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md:16] `The quality mode told readers that two legacy files were its pre-commit and write-time gates. Neither is installed.`

**INFERRED.** The write-time layer is host-specific by construction: it fires under Claude's `PostToolUse` only. A run under another host gets no warning, which is the same absent-layer problem rank 5 addresses, one level up from file existence. No counter-evidence was sought this iteration.

### Cross-rank

**OBSERVED.** Rank 3 would route `.github/workflows/` targets into quality, but the only executable checker quality owns skips YAML entirely — the `.yml` run returned exit 2 with no output. So the surface rank 3 adds is exactly the surface rank 4's fix must report as `skipped, not checked`, or the new routing would manufacture false passes.

## Questions Answered

None newly. All five strategy key questions are already ticked; this iteration tested the evidence behind ranks 3-5 rather than answering a new question.

## Questions Remaining

- The checklist boundary between quality and review remains open, as recorded in iterations 5 and 11.
- Rank 4's envelope half — whether `checker_outputs` still admits `N/A` — was **NOT TESTED** this iteration; only the workflow sentence at `SKILL.md:135` was opened.

## Ruled Out

- Re-deriving the rankings from scratch — out of scope, and already recorded as blocked in iteration 11.
- Treating the single `.github` hit as proof quality names no workflow target at all: the enforcement-gate row does name one file, so the claim was narrowed to "no `.github/` *checklist* target and no CI surface" rather than "no mention".
- Testing installation by file existence alone: the `core.hooksPath` result shows it is not sufficient.

## Dead Ends

None. Every probe returned usable evidence.

## Edge Cases

- **Ambiguous input:** the dispatch prescribed `bash ...check-comment-hygiene.sh`, which is the wrong interpreter for a Python file. Resolved by running both forms and reporting the difference; the wrong form's exit 2 became a finding instead of being discarded.
- **Contradictory evidence:** the rank-4 claim "no test expects exit 2" contradicts the test at line 74. Recorded as REFUTED with the quote; the surviving half of the claim is stated separately.
- **Missing dependencies:** none. No network fetch was attempted.
- **Partial success:** none. All seven probes completed.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-ci/SKILL.md:109`
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md:121`, `:129`, `:130`, `:131`, `:135`
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1`, `:10`, `:21`, `:224`
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh:67`, `:74`
- `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md:16`
- `.claude/settings.json:227`
- `git log --oneline -4 -- .skilled/skills/sk-code` (four commits, top three from today)
- `git config --get core.hooksPath` → `/Users/michelkerkmeester/.config/git/hooks`

## Assessment

- New information ratio: 0.50
- Questions addressed: rank 3, rank 4 and rank 5 of section 6
- Questions answered: none newly; three ranked claims re-classified

## Reflection

- **What worked:** replaying each claim against the exact line it cites, then testing one step past it. The step past is where the new evidence came from — the `core.hooksPath` read and the `bash` invocation both falsified an assumption the first pass never exercised.
- **What did not work:** the prescribed `bash` invocation. It produced a plausible exit code for the wrong reason, which is precisely the failure mode rank 4 is about; running it as written would have recorded a false confirmation.
- **What I would do differently:** for any checker claim, run the checker the way a stranger would from the skill text before running it the way the test does. The gap between those two is the portability finding.

## Recommended Next Focus

Continue the second-model pass with the remaining ranks. The highest-value remaining probe is rank 1's P0-floor claim — confirm the always-loaded checklist really is the JavaScript/CSS house style and that the shared phase doctrine still names the universal checklist — because rank 1 is the only row whose readiness depends on an operator decision.
