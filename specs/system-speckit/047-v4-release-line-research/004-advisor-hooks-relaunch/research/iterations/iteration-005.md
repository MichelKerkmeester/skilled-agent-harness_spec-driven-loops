# Iteration 005 — Question-tool decision capture (ask-surface guard + decision capture)

## FOCUS

Release v4.0.2.0 claims: "Option menus go to the question tool. A reply ending in a typed menu is sent back once to ask through the tool." [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:55], expanded at [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:189] ("A reply that ends in a typed A/B/C or 1/2/3 menu, with no call to the question tool, is sent back once ... Claude Code, OpenCode, Pi and DSH send the turn back. Codex and Devin cannot stop a finished turn, so they print a warning instead.").

This iteration asked three things: does the detector behave as its ten fixtures claim, where does it false-positive or false-negative, and is the "sent back once" promise actually enforced per runtime.

## ACTIONS TAKEN

1. Read the runtime-neutral detector [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:39] and its normalizer [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:59], the per-turn marker [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:174] and the fire log [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:203].
2. Ran every fixture in `.skilled/hooks/ask-surface-guard/fixtures/` (10 files) through `evaluateTurn()` directly. **Result: 0 mismatches** — the fixture set is honest.
3. Crafted five edge cases and ran them against `detectProseMenu()` / `evaluateTurn()` in the same process (read-only, no marker or fire writes):
   - `E1` how-to list, `1)`/`2)`/`3)`, closing "Does that match what you saw?" → **fire** (labels 1,2,3)
   - `E2` menu inside a 4-space indented code block → **fire** (labels A,B)
   - `E3` A/B pair with no question mark → pass (`no-menu`)
   - `E4` question four non-blank lines above the menu → pass (`no-menu`)
   - `E5` `1)` install steps closing "Which flag do you want enabled?" → **fire** (labels 1,2,3)
4. Read the four re-prompt paths (Claude, OpenCode, Pi, DSH), the shared advisory path for Codex/Devin [SOURCE: .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs:26], and the wiring in each runtime's hook config.
5. Read the decision-capture writer and queue contract [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:40].

## FINDINGS

### f-iter005-001 — Numbered instruction lists written `1)` fire as menus (P1, bug, v4.0.2.0)

`OPTION_LINE` accepts `1)`–`9)` as option labels and the file's own comment justifies that by excluding `1.` only: "A number label takes only `)`, because `1.` is how ordinary step lists and summaries are numbered" [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:35]. That premise is false for this repo's own prose style — `1)`/`2)`/`3)` is an equally ordinary step list, and any `?` within three non-blank lines above the list (or anywhere after it) completes a "menu" [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:118]. Both E1 and E5 fired. The consequence is a wasted re-prompt turn on Claude/OpenCode/Pi/DSH, a spurious stderr warning on Codex/Devin, and a false line in `fires.jsonl` that inflates any fire-rate metric read from [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:206].

Verify: `node -e 'const c=require("./.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs");console.log(c.evaluateTurn({lastMessage:"To reproduce:\n\n1) Start the daemon\n2) Send the prompt\n3) Read stderr\n\nDoes that match what you saw?",askToolCalled:false}))'` → `{verdict:"fire"}`.

The fixture that should have caught this, `numbered-steps.json`, uses only the `1.` form, so it passes for the wrong reason.

### f-iter005-002 — The commonest numbered-menu form, `1.`, is never detected (P1, bug/drift, v4.0.2.0)

Because a number label must be followed by `)` [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:39], a reply that closes with "1. Fix the root cause / 2. Allow a bypass / 3. Wait" is invisible to the guard. The release note promises detection of "a typed A/B/C or 1/2/3 menu" without qualifying the separator [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:189], and `1.` is what models emit most often. `numbered-steps.json` encodes this as intended behaviour, and the comment states the trade explicitly [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:37] — but taken together with f-iter005-001 the discriminator is punctuation-shaped, not semantic: it rejects real `1.` menus and accepts `1)` instructions. Neither the note nor the guard's README-level description tells the operator that a `1.` menu is out of scope.

Verify: `node -e 'const c=require("./.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs");console.log(c.detectProseMenu("Which route?\n\n1. opencode-go\n2. dsh\n3. wait"))'` → `null`.

### f-iter005-003 — A menu inside an indented code block fires (P2, bug, v4.0.2.0)

Normalization strips fenced blocks, blockquotes, tables and headings, but not 4-space indented code blocks [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:61]. E2 fired on exactly the shape `code-block-menu.json` proves safe in its fenced form. So a reply that documents a menu, or pastes a config whose lines read `A) ...` / `B) ...`, is sent back. This is the same class the fenced-block handler was written to kill, closed for one fence syntax only.

Verify: `node -e 'const c=require("./.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs");console.log(c.detectProseMenu("The shape is:\n\n    Which one?\n    A) First\n    B) Second\n\nUse it verbatim."))'` → `{labels:["A","B"],...}`.

### f-iter005-004 — A question more than three non-blank lines above the menu escapes (P2, bug, v4.0.2.0)

The question scan starts at `firstOption - QUESTION_LOOKBACK` and runs forward only [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:50], [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:118]. A reply that states the question, adds two or three sentences of context, then lists A/B/C is a passthrough (E4). Long reasoning immediately above the menu is the normal shape for a considered recommendation, so this gap likely dominates the real miss rate on Claude Opus-class output rather than being an edge case.

Verify: append two filler lines between the question and the `A)` line in `fixtures/prose-menu-bold.json` and rerun `evaluateTurn()` → `{verdict:"pass",reason:"no-menu"}`.

### f-iter005-005 — "Sent back once" is enforced per message on OpenCode, per turn on DSH (P1, bug/parity, v4.0.2.0)

The promise in the module header is "sent back once" [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:6] and the marker exists so "the guard never re-prompts it twice" [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:167]. Enforcement differs by runtime:

- Claude: `stop_hook_active` only [SOURCE: .claude/hooks/ask-surface-stop.cjs:92] / [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:92] — one block per Stop, no marker write.
- Pi: marker keyed on `pi:<session>:<operatorKey>` [SOURCE: .pi/extensions/ask-surface-guard.ts:107] — one send-back per operator turn. Correct.
- DSH: marker keyed on `dsh:<session>:<turn>` [SOURCE: .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:108] then `agent.steer` [SOURCE: .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:111] — one per turn counter, so a repeated menu in the next turn is sent back again.
- OpenCode: marker keyed on `opencode:<session>:<messageId || lastMessage>` [SOURCE: .opencode/plugins/ask-surface-guard.js:102]. The plugin's send-back is `promptAsync`, which starts a *new* assistant message with a *new* id [SOURCE: .opencode/plugins/ask-surface-guard.js:105]. If the agent answers the re-prompt with the same menu again, the key differs and the guard fires again — an unbounded ping-pong guarded only by the agent's compliance. The code comment claims the opposite ("the same reply is never sent back twice", [SOURCE: .opencode/plugins/ask-surface-guard.js:101]) — it is keyed on the message, so the same *text* in a new message is not protected.

Severity is P1 rather than P2 because the failure mode is not a missed nudge but a loop that consumes turns unattended (deep-loop fan-out, `AI_SESSION_CHILD`), which is exactly where nobody is watching.

Verify: `grep -n "markTurn(" .opencode/plugins/ask-surface-guard.js .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs .pi/extensions/ask-surface-guard.ts` and compare each key with its send-back mechanism.

### f-iter005-006 — The Claude adapter never tells the core whether a question tool exists (P2, bug/parity, v4.0.2.0)

`surfaceAvailable` defaults to true [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:137], and every other adapter passes it (DSH derives it from headless/leaf state [SOURCE: .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:103]) — Claude does not [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:104]. The file argues this is safe because "Subagents never fire Stop" [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:7]. That covers subagents only. A session launched with `AskUserQuestion` absent from the allowed tool set would be blocked with an instruction naming a tool it cannot call, and the operator sees a stalled turn plus a `fires.jsonl` line attributing it to the agent. Confidence: medium — the code path is plain, the runtime condition is untested here.

Verify: `grep -n "evaluateTurn(" .claude/hooks/ask-surface-stop.cjs .skilled/hooks/ask-surface-guard/*/*.cjs .skilled/hooks/ask-surface-guard/*/*.mjs .pi/extensions/ask-surface-guard.ts` and check which call sites pass `surfaceAvailable`.

### f-iter005-007 — An untracked `.skilled/logs` tree was created inside a hook source folder (P2, bug/artifact hygiene)

`ls -la .skilled/hooks/decision-capture/.skilled/logs/` shows `cli-dispatch-audit.log` dated Nov 2, containing a `cli-pi` dispatch record [SOURCE: .skilled/hooks/decision-capture/.skilled/logs/cli-dispatch-audit.log:1]. `git ls-files` returns nothing for that tree, so it is untracked state parked inside source. A writer resolved `.skilled/logs` against a cwd inside the hook folder instead of against the project root — the same cwd-relative-path defect class the state writers elsewhere avoid by joining an explicit root [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:276]. Low blast radius, but it pollutes `find .skilled` output and would be copied by any future mirror/sync of the hooks tree.

Verify: `git ls-files .skilled/hooks/decision-capture/.skilled` (empty) and `find .skilled -type d -name .skilled -mindepth 2`.

### Observation (not a finding) — where decisions are actually written

- Answer queue: `<project root>/.skilled/skills/.state/decision-capture/<projectToken>/<sessionToken>.jsonl`, plus a `.nudge` sibling and a `<sessionToken>.lock` under a lock subdir [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:40], [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:284], [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:288], [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:302]. A legacy directory is still read at save time [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:379].
- Fire log: `<project>/.skilled/skills/.state/ask-surface/fires.jsonl` [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:206].
- Both sit under `.skilled/skills/.state/`, the gitignored runtime state Gate 3 exempts — consistent, no canon breach.

### Observation (not a finding) — the Codex/Devin advisory path is a documented ceiling, not drift

`adviseFor` hardcodes `askToolCalled: false` [SOURCE: .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs:29] and logs `mode: 'advise'` [SOURCE: .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs:31], with the limitation stated in the module header [SOURCE: .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs:7]. The release note matches ("Codex and Devin ... print a warning instead", [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:189]). No drift. It does mean `fires.jsonl` mixes two incomparable modes under one counter.

### Parity summary (wiring + mechanism)

| Runtime | Wired | Mechanism | Once-cap |
| --- | --- | --- | --- |
| Claude | [SOURCE: .claude/settings.json:218] | `decision:block` re-prompt [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:107] | `stop_hook_active` |
| Codex | [SOURCE: .codex/hooks.json:174] | stderr advisory only | n/a (no re-entry) |
| Devin | [SOURCE: .devin/hooks.v1.json:203] | stderr advisory only | n/a |
| OpenCode | plugin file present | `promptAsync` [SOURCE: .opencode/plugins/ask-surface-guard.js:105] | per message id — leaks (f-iter005-005) |
| Pi | extension file present | `sendMessage` followUp [SOURCE: .pi/extensions/ask-surface-guard.ts:110] | per operator key |
| DSH | [SOURCE: .dsh/plugins/repo-guards/index.mjs:5] | `agent.steer` [SOURCE: .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:111] | per turn counter |

Test-suite reality: all `.test.mjs` suites in this area are `node:test` files, which the hooks vitest config deliberately skips ("a directory run skips every JavaScript test file that does not import vitest") [SOURCE: .skilled/hooks/vitest.config.ts:14], [SOURCE: .skilled/hooks/vitest.config.ts:38]. I did not run them; I ran the fixtures directly. Where those suites execute in CI is unconfirmed and carried forward.

## QUESTIONS ANSWERED

- **Question-tool capture (v4.0.2.0)** — yes for the fixture claim: all 10 fixtures reproduce their expected verdict through `evaluateTurn()` (0 mismatches), and the false-positive/false-negative loci are named: `1)` instruction lists (f-iter005-001), indented code blocks (f-iter005-003), questions >3 lines above the menu (f-iter005-004), `1.` menus (f-iter005-002), plus the asymmetric once-cap (f-iter005-005).

## QUESTIONS REMAINING

- Advisor transport (v4.0.0.0, v4.0.0.16): degraded local scoring + shared daemon still unexercised (carried, 3 iterations).
- Hermes removal (v4.0.2.0): untouched.
- Hook safety (v4.0.0.8, v4.0.0.16): the three-second stdin deadline and git-call time limit are still unexamined — note the Claude ask-surface adapter reads stdin with a plain blocking `readFileSync(0)` and no deadline.
- Over-engineering: six runtime copies of one detector call; four different send-back mechanisms.
- UX and extension: not reached.
- Advisor follow-ups from generation 1: not reached.
- New: where do the `node:test` hook suites run in CI, if anywhere?
- New: does `hook-flags.env` (live) actually carry `SYSTEM_ASK_SURFACE_DISABLED`, or only `hook-flags.env.example` [SOURCE: .skilled/hooks/hook-flags.env.example:26]? Killed-switch reachability is unverified.
- Carried: which layer drops the advisor redirect (CLI handler vs shim).

## NEXT FOCUS

Hermes removal sweep (v4.0.2.0), read-only: `rg -n -i "hermes" .skilled/hooks .skilled/skills/system-skill-advisor .claude/hooks .codex .cursor .devin .opencode/plugins .pi/extensions .dsh/plugins` plus each `mode-registry.json`, then `git diff 7980001709..51f70a0317 -- .skilled/hooks` to see what the removal actually touched. This closes the cheapest remaining P1-or-nothing question and finally clears one of the two questions carried since generation 1.

## SCOPE VIOLATIONS

None. No file outside `specs/system-speckit/047-v4-release-line-research/004-advisor-hooks-relaunch/research/` was written, renamed or deleted. The detector was exercised only through its exported pure functions; `markTurn` and `recordFire` were deliberately not invoked so no marker or fire line was created.
