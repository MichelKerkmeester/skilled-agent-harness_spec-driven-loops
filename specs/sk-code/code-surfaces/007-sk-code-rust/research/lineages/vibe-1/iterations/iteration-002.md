# Iteration 2: The record, bridge, diff, bench, shadow and gate method

## Focus

Key question 2: what rust-anything's record, bridge, diff, bench, shadow and gate method is, per `docs/how-it-works.md`, `docs/pitfalls.md` and `DECISIONS.md`, and which of those methods apply to any Rust port checked against an original.

**Source path note.** The topic names `specs/z_external-repo-library/rust-anything-main`, which does not exist in this worktree. Every rust-anything citation below uses the readable copy at `/Users/michelkerkmeester/.Trash/rust-anything-main`.

## Actions Taken

1. Read `docs/how-it-works.md` (338 lines) — the pipeline diagram, the loop table, the gate list, the cheat guard, the port rules, the limits, and the two closing sections.
2. Read `docs/pitfalls.md` §Recording (lines 59-117) for the failure catalogue.
3. Read `DECISIONS.md` §Product, §`analyze` and §The loop (lines 1-60) for the reasons behind each stage.
4. Grepped the sk-code Rust set for each method name to classify cover / contradict / lack.

## Findings

1. **The method is a nine-stage pipeline with the original as the source of truth.** `profile → analyze → bridge → record → port.rs → diff → bench → shadow → gate`, and the doc states the invariant plainly: "The original stays the source of truth: `record` runs it on edge cases (and your own inputs) and saves what it returns or throws; `diff` replays every case against the Rust; nothing ships until they all match and `gate` passes." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:7-14] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:16-18] The sk-code set states the parity *standard* — "Rust output must be byte-for-byte identical to the pinned TypeScript oracle" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:38] — but has no ordered stage sequence that produces the evidence. **LACKS** the pipeline.

2. **`record` generates deterministic edge-case inputs from parameter types plus per-parameter semantic traps, and can also record the original's own test suite.** The traps named are "string length and case, signed division, overflow edges, float printing, map and sort order", saved to `cases.jsonl`, with `--from-tests -- npx jest` to capture every call the original's suite makes and `--float-tolerance` for numeric code. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:38] The sk-code set requires golden fixtures and forbids auto-accepting changed goldens [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:236] but never says what inputs the recording must contain. **LACKS** the input-generation rule.

3. **`diff` reports where the first difference is, not just that one exists.** Each mismatch carries `return`, `throw` or `call N`, the JSON path such as `$.items[2].name`, the kind of difference, and for text the character with context; distinct differences are grouped under a short stable id "so 40 failing cases from one bug read as one line", and `--redact` prints shapes only. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:40] The sk-code set has no mismatch-reporting rule. **LACKS**.

4. **`gate` is a composite pass/fail, and two of its clauses have no sk-code equivalent.** The gate covers fmt, clippy `-D warnings`, tests, an `unsafe` audit, nothing unported, a recorded failing case for every error path of the original, no `unwrap`/`expect`/`panic!` where the original returns an error unless marked `// INFALLIBLE: <why>`, build, API, behavior, recording freshness, size ("no more than 3x the original's lines plus 50"), and the cheat guard. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:42] The sk-code set covers fmt, clippy and tests [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:78] and denies `unwrap_used`/`expect_used`/`panic` through clippy [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:171] — **COVERED** — but has zero hits for `INFALLIBLE`, so the marked escape and the "where the original returns an error" scoping are **LACKED**, as is the 3x-plus-50 size budget.

5. **The cheat guard is the most transferable rule in the repository: three named checks that stop a port passing without porting.** `literals` fails a port whose own files carry three or more string literals of 8+ characters or numbers of 5+ significant digits that equal a recorded argument or result while the original never spells them out, with `// recorded-literal: <reason>` as the escape; `tests` fails when `#[test]` functions, assertions or `#[ignore]`s drop below the last passing gate; `recording` fails when a recorded line was edited or removed. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:225-241] The reason is stated as a decision: "Agents told to make every case pass sometimes hard-code results, delete failing tests or edit the recording; `diff` alone cannot tell." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:49] The sk-code set has zero hits for `cheat`, `recorded-literal` or `known-diffs`. **LACKS** — and this is the gap with the highest value for an agent-driven port.

6. **`shadow` runs both implementations in production, returns the original's result, and never lets a Rust error reach a caller.** `RUST_ANYTHING_MODE=old|shadow|new` selects the mode, and the decision records the reason: "Shipping shadow code must not change behavior; only the report sees Rust." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:44] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:44] The sk-code set has zero hits for `shadow`. **LACKS** the staged-rollout method entirely.

7. **`bench` is deliberately outside `gate`, because speed decides shipping but is not correctness.** The decision reads: "`bench` is a separate step, not part of `gate`. Speed is not correctness, but it decides whether a port should ship: every x18n core port was correct and slower." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:60] The sk-code set mentions benchmarks only as build hygiene — "Run `cargo test --benches` on pull requests to verify benchmark compilation" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md:218] — and as a precondition for Rayon [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:287]. **LACKS** the rule that a port must be timed against the original before it ships.

8. **A stale recording fails the gate, so an upstream change cannot pass silently.** `record` saves a fingerprint of the unit's files in `recorded-from.json`; when the original changes, `diff` reports a stale recording and exits non-zero, and `gate` fails until the unit is recorded again. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:318-322] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:262-264] The sk-code set has zero hits for `stale` or `fingerprint`. **LACKS** recording freshness.

9. **Corrections the user makes during a port are committed as port rules and injected into every later prompt.** They live in `rust/RULES.md`, one bullet each, added with `rules --add`, and "`go` puts them in `TASK.md`, and the MCP server's prompts and instructions carry them, so every later unit and every agent keeps them." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:244-248] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md:49] The sk-code set has zero hits for `RULES.md`. **LACKS** the durable-correction mechanism.

10. **"Keep the original's shape" is an explicit port rule.** "A port keeps the original's units, names and public API: one crate per unit, the same exported functions and classes, the same arguments and errors. The front door keeps the original's commands and flags. … Change the design after the port matches, not during it." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md:310-316] The sk-code naming reference never mentions the original at all. **LACKS** the shape-preservation rule.

11. **A pitfall records that a broken port passed because its case was never recorded, and the remedy is to prove the test can fail.** Recording silently drops a case whose result JSON cannot hold; the only input exercising `&#39;` also decoded `&nbsp;`, so a port that wrongly decoded `&#39;` passed. The remedy: "After writing inputs for a behavior, check that `cases.jsonl` holds them, and break the port once to see `diff` fail." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:112-117] The sk-code set has no "prove the check can fail" rule. **LACKS**.

12. **A pitfall records that a CLI's recorded writes were invisible because the fixture already held them.** "A CLI that regenerates project files was recorded on a project it had just generated, so every case rewrote files with the bytes they already had, and a front door that wrote nothing passed. Record such CLIs from a fixture whose generated files are stale (overwrite them with a marker first), and check that the `*.out` folders are not empty." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md:88-93] The sk-code set has no fixture-staleness rule. **LACKS** — and this is the one finding that speaks directly to a CLI-shaped app, which is what the topic asks about.

## Ruled Out

- Reading `docs/whole-apps.md` in this iteration: it is the whole-app frame, which belongs to key question 4's steering question and to the app-style gap in key question 5. Deferred rather than read shallowly here.
- Treating the `// INFALLIBLE:` marker as a contradiction of sk-code's clippy denial: the two are compatible (deny by default, mark the exception), so it is recorded as a missing escape hatch, not a conflict.

## Dead Ends

- Grepping the sk-code Rust set for `shadow`, `stale`, `RULES.md`, `known-diffs`, `recorded-literal` and `fingerprint`: all zero. Confirmed absences; later iterations need not re-run them.

## Edge Cases

- Ambiguous input: none. Key question 2 names its three documents.
- Contradictory evidence: none. The `INFALLIBLE` marker refines rather than contradicts sk-code's clippy denial, and is recorded as a gap.
- Missing dependencies: the topic's rust-anything path is absent; the Trash copy is used and named in every citation.
- Partial success: none. All twelve findings are backed by a read.

## Sources Consulted

- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/how-it-works.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/pitfalls.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/DECISIONS.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md

## Assessment

- New information ratio: 1.0
- Questions addressed: key question 2
- Questions answered: key question 2

## Reflection

- What worked and why: reading the pipeline diagram and the loop table before the prose gave the six stage names as a checklist, so each later grep tested a named thing. Reading `DECISIONS.md` after `how-it-works.md` supplied the *reason* for each stage, which is what makes a rule portable to sk-code rather than a copied command name.
- What did not work and why: nothing failed this iteration. The one judgement call was deferring `docs/whole-apps.md`; reading it here would have blurred key question 2 into key question 4.
- What I would do differently: grep the sk-code set for the *concept* (`stale`, `cheat`, `fingerprint`) rather than the command name, because sk-code would never spell a rust-anything command. That is what surfaced findings 5, 8 and 9.

## Recommended Next Focus

Key question 3: how `docs/types.md` maps values across napi-rs, PyO3, the C ABI and the other bridges. Read `docs/types.md` for the mapping table, then check the sk-code interop references (`style-guide/interop-model.md`, `style-guide/interop-errors-and-parity.md`, `quick-reference/overview-and-boundary-template.md`) for whether the same value classes are covered.
