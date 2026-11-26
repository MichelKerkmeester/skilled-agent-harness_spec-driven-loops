# Iteration 6: The ranked edit list

## Focus

Assemble the ranked edit list the topic requires: each row names the target sk-code Rust part (file and section), the change, and the rust-anything source line. Ranked by verdict — the three contradictions first, then the P0 lacks, then the P1 app-style gaps, then the P2 polish, with the out-of-source gaps named last.

**Source path note.** The topic names `specs/z_external-repo-library/rust-anything-main`, which does not exist in this worktree. Every rust-anything citation below uses the readable copy at `/Users/michelkerkmeester/.Trash/rust-anything-main`.

## Actions Taken

1. Read the section headings of every target file so each row names a section that exists: `build-and-organization.md`, `determinism-and-parity.md`, `docs-errors-and-async.md`, `interop-model.md`, `p1-required.md`, `p2-evidence-validation-and-resources.md`, `overview-and-boundary-template.md`, `naming-ordering-and-signatures.md`, and `SKILL.md`.
2. Ranked the 41 findings from iterations 1-5 into 25 edit rows by verdict and value.
3. Emitted the five key questions as QUESTION graph nodes so the coverage graph is no longer empty and the stop decision can be assessed.

## Findings

1. **Rank 1 — scope the typed-error rule.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md` §Typed Core Errors (line 126). Change: add a scope clause saying the typed-error rule governs a shipped public API consumed by adapters, and that a generated or scaffolded port module may use `anyhow` or `Result<T, String>` internally provided the exported function maps to the typed error. Source: `docs/types.md:10` ("A port function returns `Result<T, String>`") and `Cargo.toml:15` (`anyhow = "1"`). [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:10] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:15] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:126]

2. **Rank 2 — add the cheat guard.** Target: `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md` §Complete Rust Quality Gate (line 158). Change: add three named checks — `literals` (three or more 8+ character strings or 5+ significant-digit numbers equal to a recorded value the original never spells out, with `// recorded-literal: <reason>` as the escape), `tests` (fewer `#[test]` functions or assertions, or more `#[ignore]`s, than at the last passing gate), and `recording` (a recorded line edited or removed). Source: `docs/how-it-works.md:225-241` and `DECISIONS.md:49`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:225] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:49] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:158]

3. **Rank 3 — add the "refused" verdict.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` §Acceptance Standard (line 36). Change: add that a function whose types cannot be faithfully bridged stays in the original language, with the reason recorded, and list the refusal classes (functions, `RegExp`, iterators, `*args`/`**kwargs`, decorators). Source: `docs/types.md:13` and `docs/types.md:44-46`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:13] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:44] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:36]

4. **Rank 4 — add an executable source-type mapping table.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md` §2 (line 59). Change: add a source-type → Rust-type table with the `serde_json::Value` fallback and the `Option<T>` default rule, and require a test that reads the document and checks every row against the implementation. Source: `docs/types.md:3-5`, `docs/types.md:12`, `docs/types.md:16`, and `tests/types_doc.rs:1-5`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:16] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/tests/types_doc.rs:1] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md:59]

5. **Rank 5 — add the C ABI value mapping.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md` §2 (line 35). Change: add the `std::ffi` width-and-sign table, the pointer-by-neighbour rule, and the two refusal wordings ("ownership must be designed", "who frees it must be designed"). Source: `docs/types.md:123-152` and `docs/types.md:154-168`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:123] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:154] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md:35]

6. **Rank 6 — add the operating contract and stop gates.** Target: `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` §4 SURFACE STANDARDS (line 125). Change: add a two-sentence operating contract naming the completion test, and the two stop gates (approve the plan and the first unit; wait for the go-ahead before the next unit). Source: `skills/rust-anything/SKILL.md:9-11`, `:88`, `:250`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:9] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:88] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:125]

7. **Rank 7 — add the single-crate lint block and the MSRV single-source pattern.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Edition, Toolchain, and MSRV (line 36). Change: add the `[lints.rust] unsafe_code = "forbid"` and `[lints.clippy] all = { level = "warn", priority = -1 }` block for a single crate, and the `env!("CARGO_PKG_RUST_VERSION")` constant so the declared MSRV is the only copy. Source: `Cargo.toml:42-46` and `src/lib.rs:8`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:42] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs:8] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:36]

8. **Rank 8 — add a single-crate lib+bin layout.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Workspace Layout (line 228). Change: add a single-crate layout with `src/lib.rs` as the library and `src/main.rs` as a thin front end, beside the existing five-crate workspace. Source: `src/lib.rs:10-78` and `src/main.rs:21-23`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs:10] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:21] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:228]

9. **Rank 9 — add the serde parity settings and attribute convention.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` §Serialized Output (line 190). Change: add `serde_json` with `float_roundtrip`, `preserve_order` and `unbounded_depth`, plus `rename_all = "kebab-case"`, `skip_serializing_if`, `serde(default)` and `deny_unknown_fields`. Source: `Cargo.toml:28-29`, `src/analyze.rs:25`, `src/app.rs:152`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml:28] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/app.rs:152] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:190]

10. **Rank 10 — add the fixture tree and the CLI case format.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136). Change: add `tests/fixtures/` as the fixture-tree convention and the trycmd case format (`<case>.toml` with argv, env and exit code, plus `.stdin`, `.stdout`, `.stderr`, `.in/`, `.out/`). Source: the `tests/` listing and `docs/whole-apps.md:98-100`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:98] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:136]

11. **Rank 11 — add a CLI and app-shape reference.** Target: a new file `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/cli-and-app-shape.md`. Change: cover clap derive conventions, the exit-code contract, the stdout/stderr split, `is_terminal`/`NO_COLOR`, and progress reporting. Source: `src/main.rs:25-107`, `docs/whole-apps.md:134-136`, `docs/pitfalls.md:65-67`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs:25] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:134] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:65]

12. **Rank 12 — add the `INFALLIBLE` escape and the size budget.** Target: `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md` §Complete Rust Quality Gate (line 158). Change: scope the `unwrap`/`expect`/`panic!` denial to "where the original returns an error" and add the `// INFALLIBLE: <why>` marker, plus the 3x-plus-50 line budget. Source: `docs/how-it-works.md:42` and `skills/rust-anything/SKILL.md:243-245`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:42] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:243] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:158]

13. **Rank 13 — add recording freshness and the replay-report artifact.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` §Required Parity Test Inventory (line 238). Change: add the recording fingerprint that fails the gate when the original changed, and the committed replay report checked with `git diff --exit-code` in CI. Source: `docs/how-it-works.md:318-322` and `docs/whole-apps.md:120-123`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:318] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md:120] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:238]

14. **Rank 14 — add the bench-before-ship rule.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Benchmarking (line 214). Change: add that a port is timed against the original before it ships, and that speed is not correctness so the timing is a separate gate. Source: `DECISIONS.md:60`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:60] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:214]

15. **Rank 15 — add "keep the original's shape".** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md`. Change: add that a port keeps the original's units, names and public API, and that design changes wait until after the port matches. Source: `docs/how-it-works.md:310-316`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:310] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md:1]

16. **Rank 16 — add the status-doc update to the finish gate.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Required Verification (line 119). Change: add that a change which alters observable behaviour must update the status document in the same change. Source: `CLAUDE.md:6-7`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/CLAUDE.md:6] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:119]

17. **Rank 17 — add the float-tolerance rule.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` §Numeric Contracts (line 51). Change: add that a tolerance forgives rounding only, never formatting, and that widening it to make a mismatch disappear is a bug in the port. Source: `skills/rust-anything/SKILL.md:214`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:214] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:51]

18. **Rank 18 — add "prove the check can fail" and the fixture-staleness rule.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` §Required Parity Test Inventory (line 238). Change: add that a new fixture is verified by breaking the port once to see the check fail, and that a CLI fixture must hold stale generated files so a port that writes nothing cannot pass. Source: `docs/pitfalls.md:112-117` and `docs/pitfalls.md:88-93`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:112] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:88] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:238]

19. **Rank 19 — add the shadow-mode staged rollout.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` §Acceptance Standard (line 36). Change: add that a port may ship in shadow mode, returning the original's result and never letting a Rust error reach a caller, before it is switched on. Source: `docs/how-it-works.md:44` and `DECISIONS.md:44`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:44] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:44] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:36]

20. **Rank 20 — add the per-source-language trap list.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` §Numeric Contracts (line 51). Change: add the UTF-16 vs UTF-8 offset trap, the `is_alphanumeric` vs `isLetterOrDigit` vs `isalpha` trap, the int-vs-float round-trip trap, and the regex `\w` ASCII trap. Source: `skills/rust-anything/SKILL.md:115-140`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:115] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:51]

21. **Rank 21 — add the stall detector.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136). Change: add that three consecutive edits to the port with no newly matching case means stop editing and surface the remaining mismatches. Source: `skills/rust-anything/SKILL.md:205-208`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:205] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:136]

22. **Rank 22 — add the port-rules file.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136). Change: add that a correction the user makes during a port is committed as one bullet in a port-rules file and read before the next unit. Source: `docs/how-it-works.md:244-248` and `skills/rust-anything/SKILL.md:110-113`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:244] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:110] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:136]

23. **Rank 23 — add the session map and claim protocol.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136). Change: add that a multi-session port carries a map with per-unit state (`open`, `claimed by <session> <date>`, `done`) and that a session claims a unit before starting it. Source: `skills/rust-anything/whole-app.md:17-25`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md:17] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:136]

24. **Rank 24 — add the design-tree interview.** Target: `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` §Testing Layout (line 136). Change: add that a whole-app port opens with a design-tree interview asked in rounds, each question numbered with a recommended answer. Source: `skills/rust-anything/whole-app.md:37-46`. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md:37] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:136]

25. **Rank 25 — the out-of-source gaps, which no rust-anything line can fill.** Terminal rendering (ratatui, crossterm), signal handling, `is_terminal`/`NO_COLOR`, and progress reporting are absent from both surfaces. The edit must be sourced from the ratatui and crossterm documentation, and the research must say so rather than inventing a rust-anything citation. [INFERENCE: derived from the zero-hit greps in iteration 5 findings 3, 5, 7 and 8, and from rust-anything's own `say!` macro being plain `writeln!`]

## Ruled Out

- Ranking by file instead of by verdict: the topic asks for a ranked list, and a file-ordered list would bury the three contradictions under the 32 lacks.
- Inventing a rust-anything source line for ratatui, signals, `is_terminal` or progress: none exists, so rank 25 names them as out-of-source instead.

## Dead Ends

- None this iteration. Every row resolves to a section that exists in the target file, checked against the heading listing.

## Edge Cases

- Ambiguous input: "ranked" could mean by severity or by edit order. Selected interpretation: rank by verdict severity first (contradictions, then P0, then P1, then P2), because that is the order in which a wrong rule does damage. Deferred alternative: rank by file so one editing pass touches each file once.
- Contradictory evidence: none new. Rank 1 is the resolution of the iteration 1 and iteration 3 contradictions, expressed as a scope clause rather than a deletion.
- Missing dependencies: the topic's rust-anything path is absent; the Trash copy is used and named in every citation.
- Partial success: none. All 25 rows name a real target section and a real source line, except rank 25 which is explicitly out-of-source.

## Sources Consulted

- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/whole-apps.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/CLAUDE.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/Cargo.toml
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/lib.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/main.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/app.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/src/analyze.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/tests/types_doc.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md
- .skilled/skills/sk-code/sk-code-skilled/SKILL.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md

## Assessment

- New information ratio: 0.5
- Questions addressed: the ranked edit list the topic requires
- Questions answered: none new; the five key questions were answered in iterations 1-5

## Reflection

- What worked and why: reading the target files' heading listings before writing any row meant every target names a section that exists, which is what makes the list applicable rather than aspirational. Ranking by verdict rather than by file put the three contradictions at the top, where a wrong rule does the most damage.
- What did not work and why: nothing failed. The one discipline that mattered was refusing to invent a rust-anything line for ratatui, signals, `is_terminal` and progress; rank 25 names them as out-of-source instead, which is the honest form.
- What I would do differently: build the heading index once, at the start of the run, rather than at the ranking iteration, because every earlier iteration would have cited sections more precisely.

## Recommended Next Focus

Iteration 7 should verify the ranked list against the target files: for each of ranks 1-24, confirm the named section exists at the named line and that the change does not duplicate a rule already present elsewhere in the same file. Then check the two completion criteria the parent run must satisfy — that `grep -rl` over `references/rust` finds `clap`, `ratatui` and `crossterm` after the edits, and that the SKILL.md version bump and changelog entry are named in the list.
