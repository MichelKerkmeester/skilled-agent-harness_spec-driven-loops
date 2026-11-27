# Iteration 4: Phases 003-terminal-screen and 004-computer-exposure

## Focus
Per-phase evidence for `003-terminal-screen` (a six-child phase parent that builds `crates/bots-tui/`) and `004-computer-exposure` (the working-place prompt line, `evidence.branch`, and the two `bots status` fields). The pair is taken together because 004 is the phase whose reference evidence was least certain before this pass: its name suggests a remote-desktop surface, and its actual scope is the working place a run is dispatched into.

Interpretation chosen: "computer exposure" means what a dispatched bot is told and what it records about the host directory, branch and run folder it works in, not a browser or container computer, which 004's own out-of-scope list excludes with a citation.

## Actions Taken
1. Read 003's parent scope, the six child folders, and the requirements that carry the terminal guard.
2. Read the openhuman-tui render tests and the width handling in `render.rs`.
3. Read 004's problem statement, measured behaviour and requirement table, and checked which prompt surfaces already exist in the runtime.
4. Searched OpenBot-main for any prompt line naming a working directory.
5. Read turnstone's working-directory injection to see whether an Apache-2.0 reference offers the same thing.

## Findings

1. **The plan fixes three frame sizes but asserts no no-panic property for a degenerate width or a wide glyph, and the reference's own test list shows that is where a renderer breaks.** `design/mockups.md` must draw twenty-six states at 80x24 and 120x40 plus a too-small screen at 30x7, and REQ-002 asserts each block's line count and width. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md:151] The reference's render tests include `small_terminal_and_unicode_do_not_panic`, and `render.rs` measures every string with `unicode_width::UnicodeWidthStr` rather than `.len()`. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render_tests.rs:57] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:15] **Observed (both sides) / inferred (the gap).** The plan's sizes are all comfortable, and its too-small frame is a *drawn* screen rather than a property. A needs-you question is model-written text, so a CJK or emoji character in a 30-column pane is reachable on the first day, and nothing in 003's acceptance criteria covers a width of one column or a string whose display width exceeds its byte length. The fix is cheap and belongs in 003's child 006: one test that drives `TestBackend` at 1x1, 2x2 and 30x7 with a wide-character question and asserts no panic, mirroring the reference's property.

2. **The reference masks a secret in the render path; the plan guards only the answer path, so a token a bot writes into a question is drawn verbatim.** The plan's security requirement is one-sided: the answer text reaches the runtime only through `bots answer`, which refuses a secret literal before storing it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md:255] The reference tests the render path directly with `masked_login_does_not_render_a_secret`. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render_tests.rs:38] **Observed (both sides) / inferred (the consequence).** A bot that hits an API key while diagnosing a failure can put it in a question, and the screen draws the question. The phase already has a reusable answer — `redactToken` exists on the channel side for the same reason [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md] — so the gap is one call in the pane renderer plus a test, not a new module.

3. **The reference's covered-control rule has no keyboard analogue in the plan, because the plan's overlay is key-driven rather than click-driven.** The reference tests `overlay_removes_covered_controls`, so a click cannot land on a control the overlay hides. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render_tests.rs:47] The plan's screen has no mouse support at all — it is out of scope — and its key map is organised by context. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:110] **Observed / inferred.** This is a genuine difference where the evidence supports the plan: a key map with an overlay context cannot leak a key to a covered pane the way an unscoped hit rectangle can. Recorded so a later reviewer does not read the missing rule as an oversight. What the plan should still borrow is the reference's *assertion shape*: a test that enumerates the keys the overlay covers and proves none of them reaches the pane beneath.

4. **No reference tells the model its working directory in a prompt line; the closest is turnstone, which injects it into the tool descriptions at session build time.** A repository-wide search of OpenBot-main for `working directory is` and `Your working` returns no file, and its own explanation of a Bot's work describes conversations, routines and conversations' four parts without naming a directory. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:30-50] Turnstone renders the working directory into the filesystem and shell tool descriptions through `apply_cwd_context(tools, working_dir, workspace_dir)`, applied when the session's tool list is built. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/tools.py:208] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/session.py:5147] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/config.py:259] **Observed.** So 004 is net-new against both references, and its one-line design is the only surface this runtime has: the executor owns the tool list, so the working place can only reach the model through the prompt. That is the plan's answer and the evidence supports it, with one consequence worth recording — turnstone's placement survives a mid-run directory change because it is re-rendered with the tools, while a prompt line is static text, so a child that `cd`s away sees a stale sentence and nothing corrects it. **Inferred.** The plan's `evidence.branch` at least keeps the record honest about where the run started.

5. **The plan's resume rule is stricter than either reference, and correctly so.** 004 refuses a resumed run whose parked prompt names another working place with `resume-item-invalid`, and corrects a shared run whose branch changed between park and answer. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:149] Neither OpenBot nor turnstone has a resume path that validates a parked working place, because neither parks a run against a tree. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/session.py:5147] **Observed.** No change needed; recorded because the deliverable asks which side the evidence supports, and here the plan is ahead of both references.

## Ruled Out
- **Reading OpenBot for a worktree or per-run directory model.** It is a server whose conversations share one deployment; there is no per-run tree to mirror, which is why 004 has no reference implementation.
- **Treating the missing mouse hit-target rule as a gap.** The plan has no mouse support, so the reference's rule does not apply.
- **Re-deriving the 24-column and 8-row floor.** The plan already lifts it from `openhuman-tui/src/render.rs:26` and draws the 30x7 frame from it.

## Dead Ends
- A repository-wide grep of `openhuman-tui` for a panic-free resize property beyond the one test name found no second guard; the test name is the evidence.
- OpenBot's `agent-langgraph-ts` prompt modules were not opened in depth: the two prompt-line searches returned nothing, and reading the whole prompt builder would not have changed the negative.

## Edge Cases
- Ambiguous input: "computer exposure" reads as a remote-desktop surface until 004's scope is read. Recorded the selected interpretation above; the alternative reading is already excluded by 004's own out-of-scope list, citing the parity synthesis.
- Contradictory evidence: none.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render_tests.rs:38,47,57
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/terminal.rs
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md
- specs/system-skilled-bots/context/turnstone-main/turnstone/core/tools.py
- specs/system-skilled-bots/context/turnstone-main/turnstone/core/session.py
- specs/system-skilled-bots/context/turnstone-main/turnstone/core/config.py

## Assessment
- New information ratio: 0.90
- Questions addressed: 003-terminal-screen evidence and unguarded failures; 004-computer-exposure reference evidence (negative) and plan-versus-reference differences.
- Questions answered: both phases' evidence questions. 004 is answered negatively — no reference implements it — which is itself the answer the deliverable needs.

## Reflection
- What worked and why: reading the reference's *test list* rather than its source. Six test names in `render_tests.rs` told me which six failures a real TUI had to fix, and two of them do not appear anywhere in a 26-state mockup set.
- What did not work and why: searching OpenBot for a working-directory prompt line by phrase. Two literal phrases found nothing, which is weak evidence on its own; reading the document that explains what a Bot is told made the negative defensible.
- What I would do differently: for a TUI phase, open the reference's test file before its renderer. The property tests are the design rationale, and the renderer is 1,400 lines of drawing code that mirrors poorly.

## Recommended Next Focus
Phase 005-memory and 006-approval-grants: the reference's memory-file model (what is written, when it is rewritten, what bounds it) and the approval and grant ladder (what a grant names, how precedence resolves, what a refusal looks like), with the failures their tests name.
