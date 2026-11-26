# Iteration 8: the convergence position

## Focus

The last available iteration, and it opens no new research. Its job is to state what this lineage established, what it verified, and what it could not establish, so the synthesis can be written from one document instead of six. Every claim below restates a finding already recorded and cited in iterations 1 to 7; the only new content is the convergence position itself.

## Findings

1. **All five key questions are answered, and the reducer now agrees: 5 resolved, 0 open, 0 uncovered.** Question 1 (rust-anything's own Rust style) was answered in iterations 1 and 5; question 2 (the record, bridge, diff, bench, shadow and gate method) in iteration 2; question 3 (the `docs/types.md` cross-bridge mapping) in iteration 3; question 4 (how the two skill files steer an agent) in iteration 4; question 5 (coverage and the ranked edit list) in iterations 5 and 6, verified in iteration 7. [SOURCE: specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/findings-registry.json] **The lineage is complete on its own terms.**

2. **The single most consequential finding is a scope statement, not a missing rule.** `overview-and-p0-parity.md:42` assigns "daemon and CLI wiring" to TypeScript by name, and that sentence is why `clap`, `ratatui` and `crossterm` are absent from a 6,642-line Rust set. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:42] Every other app-style gap follows from it: the eight-row contract table has no app row, the twenty validation commands are all workspace-shaped, and the router's twelve keywords name nine binding technologies. **A rule added under that scope would be a rule the checklist's own scope says does not apply.**

3. **The app rules exist in rust-anything; they are in `whole-app.md`, not in the per-function skill.** `whole-app.md:136` gives the app its own entry point, argument parser, config loading and server setup; `whole-app.md:148` scaffolds a clap parser or an axum app; `whole-app.md:152` makes the fallback rate a contract that only goes down; `whole-app.md:232-238` is the replay-and-drift proof loop with "a mismatch is a bug in the port, never in the cases"; `whole-app.md:247` shadows live traffic before a server cutover. [SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136] [SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:148] [SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:152] [SOURCE: specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:238] **This reframing is what makes the edit list traceable rather than inventive**, and it is the correction iteration 5 needed.

4. **The seventeen-row edit list is verified and ranked in four tiers.** Rank 1 unblocks the app case: the scope statement, the `SKILL.md:139` framing, the router keywords, and three app rows in the contract table. Rank 2 is correctness risk: the recorded-literal guard, the regex trap, the UTF-16 code-unit rule, the C ABI mapping, the three `serde_json` features, the `INFALLIBLE:` marker, `#[expect]` over `#[allow]`, and the no-tests-proves-nothing rule. Rank 3 is app mechanics: the `CARGO_BIN_EXE` test pattern, the `ExitCode` entry point, the broken-pipe macro, and the app proof loop. Rank 4 is the one unsourced row. [SOURCE: specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/iterations/iteration-006.md] **Every rank 1 to 3 row names a target section that exists and a rust-anything line that says what the row claims.**

5. **Three rows were sharpened by verification, and the sharpening matters because a rule has to be assertable.** The error exit code is specifically 2 with the `{e:#}` context chain on stderr, not "a documented non-zero code" [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:829]; broken pipe is handled by a `say!` macro that discards the write error rather than by a signal handler [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:7]; and clap's derive set is three — `Parser`, `Subcommand` and `ValueEnum` — with `after_help` carrying the loop [SOURCE: specs/z_external-repo-library/rust-anything-main/src/main.rs:21]. **A rule that cannot be asserted by a test is a preference, and these three were preferences until the source lines were read.**

6. **One row cannot be traced to rust-anything, and the honest position is to say so.** The five ratatui and crossterm rules — the rendering and terminal-control pair, terminal restore on panic and early return, a `TestBackend` render loop, resize tolerance, and a cell-grid-after-events oracle — have no source in rust-anything: `grep -rl "ratatui\|crossterm"` over the whole repository returns zero files, and its dependency list is `anyhow`, `clap`, `ignore`, `json5`, the `oxc_*` family, `percent-encoding`, `regex`, `serde`, `serde_json`, `toml_edit` and the `tree-sitter` grammars. [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:15] [SOURCE: specs/z_external-repo-library/rust-anything-main/Cargo.toml:29] **The packet's objective says every new rule is traced to a rust-anything line; a TUI rule has no such line.** The completion criterion's "or research.md names why one is absent" clause is the route, and the synthesis should use it rather than stretch a citation.

7. **The set's strengths are real and the edit list does not touch them.** Byte-for-byte parity with a forbidden semantic shortcut, the eight-row protected-contract table, the six-lint clippy deny list, `--locked` on every dependency-resolving command, `cargo deny`/`audit`/`vet` as a supply-chain gate, `SAFETY:` on every `unsafe`, the golden-provenance record, and the `CI=true INSTA_UPDATE=no` snapshot guard. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:171] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:196] **In four places the set is better than rust-anything** — the lint deny list, `--locked`, the supply-chain gate and the golden-provenance record — so the work is additive, which is why the list is seventeen rows and not a rewrite.

8. **The convergence position: seven productive iterations, a ratio trend of 1.00, 1.00, 1.00, 1.00, 0.85, 0.75, 0.30, and this analytical iteration at 0.05.** One hundred findings, zero open questions, zero corruption warnings, zero rejected patterns. [SOURCE: specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/deep-research-dashboard.md] **The trend is the shape a research run should have**: four iterations of genuinely new material, then a coverage pass that corrected three of its own claims, then an edit list, then verification that found only refinements. The ratio fell because the questions ran out, not because the search narrowed.

9. **Two recording defects are worth carrying to the synthesis because they affect how this lineage's numbers should be read.** First, the reducer resolves a key question only on an exact text match, so questions 1, 2 and 5 looked unanswered for five iterations after they were answered; the convergence score was understated for that reason alone. [INFERENCE: based on questions 3 and 4 resolving at iteration 6 where their exact text was copied, and 1, 2 and 5 resolving at iteration 7 for the same reason] Second, three of iteration 1's findings were overstated because they came from lowercase crate-name greps and from reading an `rg` probe as a policy — `indexmap` versus `IndexMap`, and the probe versus the clippy deny list. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:171] **Both are recorded rather than smoothed**, because a synthesis that inherits an overstated finding produces an edit list that cannot be applied.

## Ruled Out

- **Opening new research in the final iteration.** The five questions are answered and the list is verified; a new thread would leave the synthesis with an unverified claim.
- **Stretching a rust-anything citation for the ratatui row.** Zero hits. Recorded as finding 6.

## Dead Ends

- **Looking for a rust-anything TUI, terminal or signal-handling module.** None exists. Do not re-search.
- **Expecting the reducer to declare convergence on its own before maxIterations.** It reports a score, not a stop; the loop's legal end here is maxIterations, and the score's trend is the evidence that the run converged in substance.

## Edge Cases

- **Missing dependency: the canonical rust-anything path is absent.** Same fallback as iterations 1 to 7: read from `~/.Trash/rust-anything-main`, cite the canonical path. This is the one condition that touches every iteration and it did not prevent any finding.
- **Ambiguous input: "convergence position" has no defined form.** Selected interpretation: state what was established, what was verified, and what could not be established, in that order, with the ratio trend as the evidence for the third.
- **Contradictory evidence: none new.** The two corrections from iteration 5 and the three refinements from iteration 7 are carried, not reopened.
- **Partial success: one row of seventeen is unsourced.** Stated as finding 6 and ranked last in the list. The status is `thought` because this iteration is analytical and adds no external evidence.

## Sources Consulted

- specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/findings-registry.json
- specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/deep-research-dashboard.md
- specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3/iterations/iteration-006.md
- specs/z_external-repo-library/rust-anything-main/skills/rust-anything/whole-app.md:136, 148, 152, 238
- specs/z_external-repo-library/rust-anything-main/src/main.rs:7, 21, 829
- specs/z_external-repo-library/rust-anything-main/Cargo.toml:15, 29
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:42
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:171
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:196

## Assessment

- New information ratio: 0.05
- Questions addressed: all five, restated as the convergence position.
- Questions answered: all five.

## Reflection

- What worked and why: reading the target's own scope statement before grepping for terms. It converted a list of forty apparent omissions into one scope decision plus a short edit list, and it is the reason the list is seventeen rows rather than a rewrite proposal.
- What did not work and why: the first four iterations read `skills/rust-anything/SKILL.md` and `whole-app.md` as one document. They have different units — per-function rules versus per-app phases — and reading them together hid the app rules behind the function rules, which cost iteration 5 a correction.
- What I would do differently: read the whole-project workflow before the per-unit skill, and copy key-question text verbatim into every record. The first would have saved an iteration; the second would have made the convergence score honest from iteration 1.

## Recommended Next Focus

None. The research is complete and the synthesis should be written from this document plus the verified list in iteration 6. The synthesis must carry three things unchanged: the scope statement as the root cause, the seventeen-row list with its four tiers, and row 17 marked unsourced with the reason named rather than cited.
