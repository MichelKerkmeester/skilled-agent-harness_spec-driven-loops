# Iteration 5: The cover/contradict/lack table and the app-style gap

## Focus

Key question 5: for each finding so far, whether the sk-code Rust set covers, contradicts or lacks it, by file and section, and what an app-style Rust project such as a CLI or a ratatui terminal screen needs that the set lacks.

**Source path note.** The topic names `specs/z_external-repo-library/rust-anything-main`, which does not exist in this worktree. Every rust-anything citation below uses the readable copy at `/Users/michelkerkmeester/.Trash/rust-anything-main`.

## Actions Taken

1. Assembled the verdict table from iterations 1-4 (41 findings) and counted the verdicts.
2. Read `docs/whole-apps.md` §Port a whole app and §Servers (lines 90-145) for the app frame: `app record`, `app replay`, `app front-door`, `app wire`.
3. Grepped the sk-code Rust set for the app-style concerns: `exit code`/`ExitCode`, `signal`, `SIGINT`, `Ctrl-C`, `stdout`, `stderr`, `terminal`, `is_terminal`, `NO_COLOR`, `progress`, `ratatui`, `crossterm`, `clap`.
4. Read `src/main.rs`'s `say!` macro and the sk-code boundary template's section headings to confirm the binding-only shape.

## Findings

1. **The verdict table across iterations 1-4 is 41 findings: 0 covered, 6 partial, 3 contradictions, 32 lacks.** Per iteration: iteration 1 gave 9 findings (0 covered, 3 partial, 1 contradiction, 5 lacks), iteration 2 gave 12 (0, 1, 0, 11), iteration 3 gave 10 (0, 1, 2, 7), iteration 4 gave 10 (0, 1, 0, 9). [INFERENCE: derived by re-reading the verdict sentence of each finding in `iterations/iteration-001.md` through `iteration-004.md` and summing] The shape of the result is the finding: the sk-code Rust set is not wrong about ports, it is silent about them. **LACKS** dominates 32 to 6.

2. **The sk-code Rust set has no CLI argument design at all.** Zero hits for `clap` across `references/rust/` and `assets/checklists/rust-checklist/`. rust-anything supplies both halves: its own CLI is derive-first with `#[derive(Parser)]`, `#[command(name, version, about, after_help)]`, a `Subcommand` enum whose variant doc comments are the help text, and `ValueEnum` for closed sets [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:25-107], and `app front-door` scaffolds "a clap parser for the commands and flags in the recorded cases" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:134-136]. **LACKS** — the single largest app-style gap.

3. **The sk-code Rust set has no terminal rendering, and rust-anything does not supply it either.** Zero hits for `ratatui` and `crossterm` in the sk-code set; the only `terminal` matches are "terminal key" in sort-comparator prose [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md:253]. rust-anything's own output is plain `writeln!` through a `say!` macro whose comment reads "`println!` that stops quietly when stdout is closed (`rust-anything ... | head`)" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:6-11]. **LACKS** — and this is the one app-style gap rust-anything cannot fill, so the edit must be sourced from the ratatui/crossterm documentation rather than from a rust-anything line.

4. **The sk-code Rust set has no exit-code contract for a binary.** Its only mention is inside a sidecar-protocol rule: "Sidecar protocols must define framing, encoding, field order, newline behavior, exit codes, and stderr behavior." [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md:363] rust-anything treats the exit code as part of the recorded contract: the front door "passes its output and exit code through" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:136] and `app replay` "exits non-zero on any mismatch" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:108-109]. **LACKS** for a CLI; **COVERED** only for a sidecar.

5. **The sk-code Rust set has no signal handling, and rust-anything does not supply it either.** Zero hits for `signal`, `SIGINT` or `Ctrl-C`. rust-anything's nearest rule is about child processes, not signals: "Run every outside program through `crate::process`, which closes stdin and stops it at a time limit" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:77-79]. **LACKS** in both, so the edit must be sourced elsewhere.

6. **The sk-code Rust set has no stdout/stderr split rule.** Zero hits for `stdout` or `stderr` outside the sidecar line. rust-anything has a hard-won rule: "A test command's output corrupted the MCP stream. The child wrote to the server's stdout. Send every child's stdout to stderr or a pipe, never to the MCP server's stdout." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:65-67] **LACKS** — and the rule generalises to any program that owns a protocol stream.

7. **The sk-code Rust set has no `is_terminal` or `NO_COLOR` rule, and rust-anything does not supply it either.** Zero hits for both. **LACKS** in both.

8. **The sk-code Rust set has no progress-reporting rule, and rust-anything does not supply it either.** Zero hits for `progress`. **LACKS** in both.

9. **The sk-code Rust set has no size budget for a port, which matters more for an app than for a binding.** rust-anything's gate fails a port "at most 3x the original's lines plus 50 for imports and signatures (over that, use the crates `analyze` lists and fold repeated code)" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:243-245]. **LACKS**.

10. **The sk-code Rust set has no CLI golden-case format, and rust-anything's is directly reusable.** rust-anything's app cases are trycmd files in `rust/app-cases/`: "`<case>.toml` (argv, env, exit code), `.stdin`, `.stdout`, `.stderr`, `.in/` (files in) and `.out/` (files written). Read and edit them by hand; a Rust test can run them with `trycmd` once the port has a binary." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:98-100] The sk-code set has zero hits for `tests/fixtures` and no CLI case format. **LACKS**.

11. **The sk-code Rust set has no rule that a replay report is a committed CI artifact.** rust-anything commits `replay-report.md` and runs `git diff --exit-code rust/app-cases/replay-report.md` in CI, so "a half-ported app fails CI on any change in what passes, better or worse, until the report is updated with it" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:120-123]. **LACKS** — and this is the app-scale version of the cheat guard, because it makes a silent regression impossible to merge.

12. **The sk-code Rust set has no fallback-rate metric, which is the only progress signal a half-ported app has.** rust-anything's front door counts each fallback to the original and reports the rate, and `app replay` reports it for any build that appends to `RUST_ANYTHING_FALLBACK_LOG` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:110-112] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:136-138]. **LACKS**.

## Ruled Out

- Reading `docs/whole-apps.md` §Servers and §Libraries in full: the CLI frame in §Port a whole app already supplies the app-style findings, and the server and library frames repeat the same replay and fallback machinery.
- Claiming rust-anything supplies a ratatui or signal standard: it does not, and saying so would have produced a false edit target. Both are recorded as gaps in both surfaces.

## Dead Ends

- Grepping the sk-code Rust set for `ratatui`, `crossterm`, `clap`, `signal`, `SIGINT`, `Ctrl-C`, `is_terminal`, `NO_COLOR`, `progress`: all zero. Confirmed absences.
- Grepping the sk-code Rust set for `tty`: 21 files matched, but every hit is the substring inside "pretty". Recorded so a later iteration does not mistake it for terminal coverage.

## Edge Cases

- Ambiguous input: "an app-style Rust project such as a CLI or a ratatui terminal screen" names two shapes. Selected interpretation: treat CLI as the shape rust-anything can inform and ratatui as the shape it cannot, and say which is which per finding. Deferred alternative: a single app-style verdict, which would have hidden that split.
- Contradictory evidence: none new. The three contradictions from iterations 1 and 3 stand as recorded.
- Missing dependencies: the topic's rust-anything path is absent; the Trash copy is used and named in every citation.
- Partial success: none. All twelve findings are backed by a read or a counted grep.

## Sources Consulted

- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md
- specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-1/iterations/iteration-001.md through iteration-004.md

## Assessment

- New information ratio: 0.75
- Questions addressed: key question 5
- Questions answered: key question 5

## Reflection

- What worked and why: counting the verdicts instead of listing them turned 41 findings into one number, and the 32-to-6 lack ratio is what justifies a large edit rather than a patch. Grepping the app-style concerns as a batch also separated the gaps rust-anything can fill (clap, exit codes, trycmd cases, replay report, fallback rate) from the gaps it cannot (ratatui, signals, `is_terminal`, `NO_COLOR`, progress).
- What did not work and why: the `tty` grep returned 21 files and looked like terminal coverage until the hits were read; every one was the substring inside "pretty". A substring grep on a short token is not evidence.
- What I would do differently: grep with word boundaries (`\btty\b`) when the token is short enough to appear inside an unrelated word.

## Recommended Next Focus

Iteration 6 should assemble the ranked edit list the topic requires: each row naming the target sk-code Rust part (file and section), the change, and the rust-anything source line. Rank by the verdict — the three contradictions first, then the P0 lacks (cheat guard, refused verdict, executable mapping table, C ABI pointers, stop gates), then the P1 app-style gaps (clap, exit codes, trycmd cases, replay report, fallback rate), then the P2 polish. Name the ratatui, signal, `is_terminal`, `NO_COLOR` and progress gaps as out-of-source, to be filled from the ratatui and crossterm documentation rather than from a rust-anything line.
