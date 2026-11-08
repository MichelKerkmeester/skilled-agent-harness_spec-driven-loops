# Iteration 019 — Goal Hook: Contract vs Code vs Release Claims

## Focus

The goal hook, which eighteen prior iterations had touched only through the relaunch child
predicate (`AI_SESSION_CHILD`). Read `.skilled/hooks/goal/lib/goal-core.cjs` (1778 lines),
`lib/goal-slice.cjs` (504), `bin/goal.cjs` (458), the per-runtime adapters, and the goal
claims in the v4.0.2.0 release notes; ran the hook's own suites read-only.

The prompt pack named v4.0.0.16 as a source of goal claims. That premise is wrong: `grep -i goal`
over `.skilled/changelog/skilled/v4.0.0.16.md` returns nothing. All live goal claims are in
v4.0.2.0 and v4.0.0.2/.13/.14. Recorded below rather than silently substituted.

## Actions Taken

1. Enumerated every file under `.skilled/hooks/goal/` — 23 files across `lib/`, `bin/`,
   `cursor/`, `devin/`, `dsh/`, `opencode/`, `pi/`, `tests/`.
2. Read the packet-report path end to end: `runPacket` → `describePacketGoal` →
   `readPacketGoal` → `resolveGoalBudget` / `budgetState` / `renderChatSlice`.
3. Read the budget manifest `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`
   and confirmed `goalDurableBudget.errorChars = 4000`, with `measure` stating "after the
   frontmatter closing fence up to the log anchor, anchors and comments included".
4. Ran the goal hook's own suites read-only:
   `node --test .skilled/hooks/goal/lib/*.test.cjs .skilled/hooks/goal/bin/goal.test.cjs`
   → **133 tests, 133 pass, 0 fail**. This cluster is green, in contrast to the OpenCode plugin
   suite's earlier 27-failure state.
5. Exercised the two slice renderers directly in memory (no files written) to test the
   `renderChatSlice` scrubbing claim against a prose template instruction.
6. Diffed runtime goal wiring: `ls` of `.claude/hooks`, `.codex/hooks`, `.cursor/hooks`,
   `.devin/hooks`, `.opencode/plugins`, `.pi/extensions`, `.dsh/plugins`.

## Findings

### f-iter019-001 — `packet_budget=unknown` is a permanent, silent send-block (P2, bug + UX)

`resolveGoalBudget` returns `null` on **any** error — missing manifest, unreadable manifest,
absent `goalDurableBudget` block, non-integer `errorChars` — and `budgetState` maps `null` to
the string `'unknown'` rather than to "no limit applies".

`[SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:316]` — the `try` wraps `JSON.parse(readFileSync(...))` and the `catch` returns `null`.
`[SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:428]` — `if (!budget) return 'unknown';`
`[SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:468]` — `const budget = budgetApplies(dir.absolute) ? resolveGoalBudget(workspace) : null;`

Verified directly: `resolveGoalBudget('/tmp/nonexistent-repo')` → `null`. In a workspace where
`.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` is absent — a vendored install
that skipped the spec-kit templates, or any repo using the goal hook without spec-kit — every
packet reports `packet_budget=unknown` forever.

The framework's GOAL POSTURE RULE says: *"send only at `packet_budget=ok`"*. Under `unknown`
that gate can never be satisfied, so the model is instructed to withhold the goal slice
permanently, with no signal that the cause is a missing manifest rather than an oversized file.
`unknown` conflates "no known limit" with "limit exceeded".

The distinction the code already has and does not use: `budgetApplies()` returns `false` for a
phase child, and that path yields `null` → `'unknown'` as well, so an unbudgeted phase child and
a manifest-less repo are indistinguishable in the report. A fourth state (`'unbounded'`) or a
`budget_source=` line would separate them.

Verify: `node -e "console.log(require('./.skilled/hooks/goal/lib/goal-slice.cjs').resolveGoalBudget('/tmp/x'))"` → `null`, then read `budgetState`.

### f-iter019-002 — Prose template instructions survive `renderChatSlice`, contradicting the stated contract (P2, drift)

`renderChatSlice` scrubs exactly four things: HTML comments, `\n---\n` dividers, heading section
numbers, and runs of 3+ newlines.

`[SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:91]` — the four `.replace()` calls, nothing else.
`[SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:241]` — the reminder promises the slice arrives "with no frontmatter, comments, anchors, dividers or section numbers".

The framework's GOAL POSTURE RULE tells every session to send "only the `chat_slice` … and no
comments, anchors, dividers, section numbers **or template instructions**". Template
instructions are not one of the four scrub rules. Any authoring guidance written as prose — a
`> **Note:**` blockquote, a bolded "replace this section" line — is pasted into chat as if it
were goal state.

Measured in memory: a document carrying `> **Note:** replace every heading below with your own
words.` produced `chatSlice` = `"> **Note:** replace every heading below with your own words.\n\n## Objective\nShip it."` — the instruction intact. Durable slice 87 chars, chat slice 83.

This is only exploitable if a template writes its instructions in prose rather than HTML
comments. Whether sk-create-goal's template does so is the next read; either the scrubber needs a
fifth rule or the framework rule needs to stop promising it.

### f-iter019-003 — "4000 characters" is hardcoded prose while the limit is data-driven (P2, drift)

`resolveGoalBudget` reads `errorChars` from the manifest, so the limit is a configurable number.
The reminder text that steers the model hardcodes the number as a literal:

`[SOURCE: .skilled/hooks/goal/lib/goal-slice.cjs:241]` — `"...which keeps it within 4000 characters..."`, a template literal with no interpolation of `budget.errorChars`.

`[SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24]` — `"errorChars": 4000`.

The two agree today, so this is latent rather than live. It becomes a live bug the moment the
manifest changes — an operator raising the cap for a large packet would get a steering line
telling the model to cut to 4000, i.e. the injected text would contradict the validator. The
docs carry the same hardcoded number (`[SOURCE: .skilled/hooks/goal/goal-plugin.md:97]`).

Note the code's own comment at `:308` argues for quoting the validator's limit: *"read from its
contract manifest so this module quotes the same limit as the validator."* The reminder string is
the one place that breaks that stated intent.

### f-iter019-004 — The Claude Code goal rule is unenforceable: no Claude goal adapter exists (P1, drift/misalignment)

The framework's GOAL POSTURE RULE carries a Claude-specific delivery clause: *"On Claude Code,
send it alone in one fenced block."*

Goal adapters present: `bin/`, `cursor/`, `devin/`, `dsh/`, `opencode/`, `pi/`, `lib/`, `tests/`.
There is **no** `.skilled/hooks/goal/claude/`.

Verified across the runtime surfaces: `ls .claude/hooks | grep -i goal` → empty;
`.codex/hooks` → empty; `.dsh/plugins` → empty. By contrast `.cursor/hooks` and `.devin/hooks`
carry `goal-inject.mjs`, `.opencode/plugins` carries `opencode-goal.js`, `.pi/extensions` carries
`goal-context.ts`.

So on Claude Code and Codex — two of the three most-used runtimes — nothing injects the goal
slice, nothing evaluates `resendPending`, and nothing appends `renderResendReminderText`. The rule
that instructs Claude to send the slice in a fenced block describes a delivery mechanism that does
not exist on that runtime. Two of the seven runtimes are silently unbound while four are wired.

This also means f-iter019-001 and f-iter019-003 cannot reach a Claude session at all: the steering
text they corrupt is never injected there. Severity is P1 because a rule the framework states as
always-on is inert on the primary runtime, and no test would catch it — the suites cover the five
adapters that exist.

### f-iter019-005 — v4.0.2.0 claims dsh goal support, but `.dsh/plugins` carries no goal entry (P2, drift)

The release note states: *"`/goal-dsh` and the `dsh_goal` tool run the shared goal command. A goal
set here is the same goal every other runtime reads."*
`[SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:132]`
`[SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:52]` — *"`dsh` sessions match Pi and OpenCode. They get the advisor brief, goals and every guard."*

The adapter source exists — `.skilled/hooks/goal/dsh/goal-context.mjs`, `goal-manage.mjs`, with a
suite at `.skilled/hooks/goal/tests/dsh-goal.test.mjs` — but `ls .dsh/plugins | grep -i goal`
returns nothing, while the peer runtime registers its plugin file by name
(`.opencode/plugins/opencode-goal.js`).

Confidence medium, not high: dsh may register plugins through a route/patch manifest rather than a
directory listing (the release notes elsewhere describe `.dsh/patches/guards.patch.yml`), and I did
not open that manifest. The claim is therefore *unverified*, and the cheap closure is one read of
the dsh plugin registry. Flagged because the release note is written as an accomplished fact and
this iteration could not confirm the installation half.

Verify: `ls .dsh/plugins; grep -rn "goal" .dsh/ --include="*.yml" --include="*.yaml" | head`.

### f-iter019-006 — The `packet` report omits the number the operator needs to act (P2, operator UX, improvement)

`runPacket` prints `packet_path`, `packet_nested`, `packet_durable_chars`, `packet_budget`,
`packet_slice_hash`, `objective_slice`, `chat_slice`.
`[SOURCE: .skilled/hooks/goal/bin/goal.cjs:213]`

When `packet_budget=over`, the model is told to "cut the file first". What it is not told is by
how much, and — the sharper gap — what the chat slice actually measures. `chatSlice` is a
monotone reduction of `durableSlice` (comments, dividers and section numbers only ever removed),
so a goal.md can measure `over` on the durable slice while the message that would be sent fits
comfortably. The report makes the operator cut a file whose chat rendering was already within
budget, and gives no way to see that.

Two fields close it: `chat_chars` and `over_by` (`durableChars - errorChars` or `0`). Both are
already computed inside `readPacketGoal` or trivially derived from it.

## Questions Answered

None of the three strategy key questions. All three concern the advisor transport, the
UX/extension cluster (relaunch, brief, history), or generation-1 advisor follow-ups; this
iteration audited the goal hook instead. Recorded honestly as an empty set rather than
claiming partial credit.

## Questions Remaining

- **New:** does sk-create-goal's goal.md template put its authoring instructions in HTML comments
  (scrubbed) or in prose (sent)? That single read decides whether f-iter019-002 is a live defect
  or a contract overstatement.
- **New:** does dsh register its goal plugin through a manifest rather than `.dsh/plugins`? One
  read settles f-iter019-005's medium confidence.
- **New:** is the absence of a Claude/Codex goal adapter deliberate (the native goal tools named in
  the framework rule may be the intended surface there, per `v4.0.2.0.md:150`) or an installation
  gap? The framework's Claude fenced-block clause suggests something was expected to inject.
- **New:** should `budgetState` gain a fourth state separating "no manifest" from "phase child, no
  budget applies"? f-iter019-001's fix depends on the answer.
- Carried and untouched: the advisor degraded-daemon path and the two-launcher race (now the
  run's oldest unexercised claim); which layer drops the advisor redirect; `hook-flags.sh` vs
  `hook-flags.cjs` differential; `leaf-scopes.json` optionality; the live Claude turn-end hang;
  the live Codex compaction; the generation-1 advisor follow-ups (`sk-create-skill-parent`
  shared-packet entry, duplicate `package_skill.py`).

## Next Focus

Iteration 20 should open sk-create-goal's `references/budget-and-handoff.md` and its goal.md
template — the same file the framework rule names for the budget clause — and close f-iter019-002
and f-iter019-003 together, then read the dsh plugin registry to settle f-iter019-005. The
advisor transport question is the run's oldest unexercised claim and should not be attempted with
one iteration left unless the goal cluster is fully closed first.

## SCOPE VIOLATIONS

None. All reads targeted in-repo files; the two renderer probes ran in memory with no filesystem
writes. No test, build, install or generator was run beyond the hook's own `node --test` suites
read-only.
