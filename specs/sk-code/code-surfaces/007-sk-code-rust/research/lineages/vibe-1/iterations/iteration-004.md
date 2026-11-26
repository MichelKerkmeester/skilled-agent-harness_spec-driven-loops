# Iteration 4: How the rust-anything skill steers a coding agent through a port

## Focus

Key question 4: how `skills/rust-anything/SKILL.md` and `whole-app.md` steer a coding agent through a port.

**Source path note.** The topic names `specs/z_external-repo-library/rust-anything-main`, which does not exist in this worktree. Every rust-anything citation below uses the readable copy at `/Users/michelkerkmeester/.Trash/rust-anything-main`.

## Actions Taken

1. Read `skills/rust-anything/SKILL.md` (258 lines) end to end: the front matter, the operating contract, the `go` shortcut, and steps 0 through 5.
2. Read `skills/rust-anything/whole-app.md` lines 1-70: the map, the claim protocol, and the interview.
3. Read `sk-code-skilled/SKILL.md`'s section headings and grepped the sk-code Rust set for the agent-steering constructs (`ask the user`, `wait for`, `approval`, `go-ahead`).

## Findings

1. **The skill opens with an operating contract in two sentences, and it names the completion test.** "rust-anything gives you ground truth; you write the Rust. Port one unit at a time, even when the goal is the whole app, and call a port done only when `gate` passes." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:9-11] The sk-code `SKILL.md` is a reference map — its six sections are WHEN THE HUB BUNDLES THIS, SMART ROUTING, REFERENCE MAP, SURFACE STANDARDS, SUPPORTING ASSETS and QUALITY CHECKLIST MAP [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:29-164] — with no operating contract and no completion test. **LACKS**.

2. **The skill is a numbered procedure with explicit stop gates.** Step 1 ends "**Wait for the user's approval of the plan and of the first unit.**" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:88] and step 5 ends "**wait for their go-ahead before the next unit**" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:250]. The sk-code Rust set has zero hits for `ask the user`, `wait for`, `approval` or `go-ahead` outside the checklist's P1 "must fix or get explicit approval" severity legend [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:62]. **LACKS** the stop gates.

3. **The skill names the one file the agent may write, and the command that regenerates the rest.** "Write the port in `src/port.rs` only; `src/lib.rs` and the wrappers are generated. After changing a signature in `port.rs`, run `rust-anything refresh <crate>`." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:107-108] The sk-code set has no write-surface rule that separates generated from hand-written files. **LACKS**.

4. **Port rules are read before writing and appended the moment the user corrects behaviour.** "Before writing code, run `rust-anything rules <repo>` and follow every rule it lists: behavior the user already corrected in an earlier unit. Each time the user corrects how the port behaves, add it right away with `rust-anything rules <repo> --add \"<the rule, in one sentence>\"`, so the next unit and the next agent keep it." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:110-113] The sk-code set has zero hits for `RULES.md`. **LACKS** — this is the agent-facing half of iteration 2's finding 9.

5. **The skill carries a per-source-language trap list that a general Rust standard would never contain.** UTF-16 vs UTF-8 string offsets ("JS and Java index UTF-16 code units, Rust UTF-8 bytes: use `src/utf16.rs`"); `char::is_alphanumeric` taking more than Java's `Character.isLetterOrDigit` or Python's `str.isalpha`; Python and Ruby ints that must come back as ints, with `crate::pynum::Num` rather than `serde_json::Value`; C `crash:` inputs as undefined behaviour; C pointer shapes; `indexmap` where order reaches output; `fancy-regex` for lookaround; and `unicode(false)` where the original's `\w` is ASCII-only. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:115-140] The sk-code set covers `-0.0` and sort order [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md:66] but has no per-source-language trap list. **PARTIAL**.

6. **The skill names the two agent failure modes and forbids them in one line each.** "Add Rust unit tests in `port.rs` for the cases you reason about. `cargo test` passing with no tests proves nothing: the recorded cases are the proof." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:141-142] and "A mismatch is a behavior difference: fix the port, never the recording." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:196] The sk-code set has no equivalent. **LACKS**.

7. **The skill has a stall detector and a prescribed response.** "When `diff` says the port is stalled (its `trend.stalled`: three changes to `port.rs` in a row gained no matching case), stop editing. Show the user the remaining mismatches and ask: they may know the rule you are missing, or decide to keep those functions in the original for now." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:205-208] The sk-code set has no stall rule. **LACKS**.

8. **The skill forbids widening a tolerance to make a mismatch disappear.** "Never widen a tolerance to make a mismatch go away: a difference beyond it is a bug in the port." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md:214] The sk-code set has no float-tolerance rule at all. **LACKS**.

9. **`whole-app.md` is a session-spanning protocol built on a claimable map.** "A whole-app port outlasts one session, so `rust/MAP.md` carries it between sessions: the goal, an index of the ADRs in `DECISIONS.md`, every unit of the plan with its state (`open`, `claimed by <session> <date>`, `done`), open questions, and what is out of scope. … A session **claims** one unit in the map before it starts, ports that unit, and marks it `done` with its gate and replay results. A claimed unit belongs to its session: pick another. A new session starts by reading `MAP.md`, then `HANDOFF.md` when there is one." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md:17-25] The sk-code set has no multi-session protocol. **LACKS**.

10. **`whole-app.md` opens with a structured interview whose shape is a design tree asked in rounds.** "Interview the user until every decision the port depends on is settled. Map them as a **design tree**: each decision branches into the ones that hang off it. Ask in **rounds**: a round is the whole **frontier**, every decision whose prerequisites are already settled. Number each question, give your recommended answer, and word it so \"yes\" accepts the recommendation." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md:37-46] The seed branches are shape, scope, equivalence bar, compatibility, dependencies, targets, checkpoints and cutover [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md:58-66]. The sk-code set has no interview protocol. **LACKS**.

## Ruled Out

- Reading `docs/whole-apps.md` (347 lines) in this iteration: `skills/rust-anything/whole-app.md` is the agent-facing steering document the question names, and it already carries the map, the claim protocol and the interview. The longer doc is the human-facing frame and belongs to key question 5's app-style gap.
- Treating the stop gates as a conflict with sk-code's autonomous workflow doctrine: sk-code's doctrine governs its own implement/debug/verify loop, not a port against an external original, so the gates are recorded as a missing construct rather than a contradiction.

## Dead Ends

- Grepping the sk-code Rust set for `ask the user`, `wait for`, `approval` and `go-ahead`: only the checklist severity legend matched. Confirmed absence of stop gates; later iterations need not re-run it.

## Edge Cases

- Ambiguous input: none. Key question 4 names its two files.
- Contradictory evidence: none. The stop gates are a scope difference, not a conflict.
- Missing dependencies: the topic's rust-anything path is absent; the Trash copy is used and named in every citation.
- Partial success: none. All ten findings are backed by a read.

## Sources Consulted

- /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/SKILL.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/skills/rust-anything/whole-app.md
- .skilled/skills/sk-code/sk-code-skilled/SKILL.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md

## Assessment

- New information ratio: 1.0
- Questions addressed: key question 4
- Questions answered: key question 4

## Reflection

- What worked and why: reading the skill as a procedure rather than as a reference list made the difference. The stop gates, the write-surface rule and the stall detector are all *sequencing* constructs, and they only become visible when you read the file in order and notice where it tells the agent to stop.
- What did not work and why: nothing failed. The one judgement call was deferring `docs/whole-apps.md`; the skill's own `whole-app.md` answered the question the topic asked, so the longer doc would have been redundant here.
- What I would do differently: compare the two skills' *shape* first (procedure vs index) before comparing their content, because that shape difference is what makes the content gaps predictable.

## Recommended Next Focus

Key question 5: for each finding so far, whether the sk-code Rust set covers, contradicts or lacks it, by file and section, and what an app-style Rust project such as a CLI or a ratatui terminal screen needs that the set lacks. This is the synthesis iteration: assemble the cover/contradict/lack table from iterations 1-4 and read the app-style gap directly (CLI argument design, terminal rendering, signal handling, exit codes).
