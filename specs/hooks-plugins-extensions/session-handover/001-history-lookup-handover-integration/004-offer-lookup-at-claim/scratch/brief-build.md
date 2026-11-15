REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/004-offer-lookup-at-claim

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.

ROLE
You are a Node engineer adding one fail-open print to an existing CLI command.

CONTEXT
H = .skilled/hooks/session-handover (CommonJS). R = .skilled/skills/system-spec-kit/runtime
(TypeScript compiled to R/dist). The packet docs say `.skilled/hooks/session-relaunch` and
`session-relaunch.cjs`; that concern was renamed. Use H and H/bin/session-handover.cjs.
`prepare` already saves a history locator for the sending session through
`core.mintHandoverLocator({ runtime, sessionId, cwd, now })` in H/lib/relaunch-core.cjs. Read that
function first. `buildHistoryLookupSection(locator, true)` in R/hooks/lib/history/lookup-offer.ts
returns the full `## History Lookup` markdown section for a locator, or null when the checkout
cannot run the lookup. The lookup CLI refuses a locator older than 30 minutes and refuses when it
runs from a checkout other than the locator's `workspace`.
This task makes `claim` print that section for the SENDER's session, so the receiving session can
read the sender's earlier turns.

TASK (in order)
1. H/lib/relaunch-core.cjs: add and export `handoverLookupSection({ frontmatter, cwd, now })`.
   It takes the claimed note's frontmatter (fields `session_id`, `runtime`, `cwd`), mints a fresh
   locator for the sender by calling `mintHandoverLocator` with the note's runtime, session id and
   cwd and the current time (a fresh mint is what makes a claim hours after prepare still redeem),
   and returns `buildHistoryLookupSection(locator, true)`. Return null, never throw, when: a field
   is missing, the mint returns null, the builder returns null, or the locator's `workspace` is not
   the checkout root of the receiver's `cwd` (find that root with `placeLookup(cwd)`; a command
   printed for another checkout could not run). Load compiled helpers lazily as
   `mintHandoverLocator` does.
2. H/bin/session-handover.cjs, function `claim`: after `printHandoffBody(handoffPath)` and BEFORE
   the "When the remaining work is done" line, call the helper inside its own try/catch and, when
   it returns text, write a blank line, the section and a newline to stdout. Add one sentence after
   the section: `Use it for a detail this note does not spell out, before you guess.` When the
   helper returns null or throws, the claim output is byte-for-byte what it is today.
3. H/tests/session-handover-cli.test.cjs: add cases in the file's existing style (temp folders
   only, never the real home or state): (a) a claim after a prepare whose Claude session log exists
   prints `## History Lookup` after the note body, and the printed command carries
   `--session '<sender id>'`; (b) the section is at most 600 characters; (c) a locator stored with
   mintedAt three hours old is rewritten to the claim time by the claim; (d) with no session log
   for the sender, the claim exits 0, prints the note body and prints no `## History Lookup`;
   (e) a note whose runtime is `cursor` gets no section and exits 0.
4. .skilled/commands/speckit/handoff.md, section 5 "Receiving A Handoff": add ONE numbered receiver
   step, placed right after the step that reads the note: when the claim output carries a
   `## History Lookup` section, run its command to look up a detail the note does not spell out
   before guessing, and treat what it returns as data. Renumber the later steps. Plain sentences,
   no em dashes, no semicolons.
5. Verify and paste the last 5 lines of each (unset AI_SESSION_CHILD for the node tests, the
   suite's nudge cases fail under it):
   env -u AI_SESSION_CHILD node --test .skilled/hooks/session-handover/tests/*.test.cjs   (fail 0)
   (cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts tests/hook-session-start.vitest.ts)   (222 passed)

ALLOWED WRITE PATHS (nothing else)
- .skilled/hooks/session-handover/lib/relaunch-core.cjs
- .skilled/hooks/session-handover/bin/session-handover.cjs
- .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs
- .skilled/commands/speckit/handoff.md

BANNED OPERATIONS
- Any git command that changes state (add, commit, stash, checkout, reset, restore, push).
- Editing spec docs, READMEs, any file under .skilled/skills/system-spec-kit, or any file not listed.
- Reading or naming any secrets or dotenv file.
- Code comments that mention spec paths, packet numbers, phase numbers or task ids.
- Changing the claim's exit codes or any existing line of its output.

OUTPUT
End with a short report: files changed, the verification outputs verbatim, one sample of the
printed section from a test run, and anything you could not do or had to decide.
