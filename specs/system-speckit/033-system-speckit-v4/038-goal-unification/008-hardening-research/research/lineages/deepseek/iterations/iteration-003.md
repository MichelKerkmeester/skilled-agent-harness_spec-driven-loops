---
title: "Iteration 3: Operator UX — Walking the Operator's Day"
trigger_phrases: []
---
# Iteration 3: Operator UX — Walking the Operator's Day

## Focus

Charter angle 3. Walk six moments in an operator's day against the shipped surfaces: set a goal, edit a criterion, get reminded, set again, switch packets, finish. At each moment, name the friction, the smallest change that removes it, and the exact wording the operator or the agent should see. The measuring stick is the one the charter gives: a step manual that could be automatic, a message that misleads, an envelope field nobody reads, a 4000-character paste a tool could do.

## Actions Taken

1. Read the CLI's operator-facing output: `goalLines`, `runShow`, `runBind`, `runResent`, `runPacket`, `runSet` and the failure envelope (`bin/goal.cjs:105–242`).
2. Read both renderers' injection assembly and the flattening that precedes it (`goal-core.cjs:273–290, 389–448`; `opencode-goal.js:2707–2759`).
3. Read the reminder text and its callers (`goal-slice.cjs:130–139`; `opencode-goal.js:2820–2823`; pi/cursor/devin call sites).
4. Walked the six moments against the decision record's ADR-004 and the two render paths' handling of a changed durable slice.

## Moment-by-moment findings

### U3-1 (moment: edit a criterion → set again) — The resync is a three-step paste job that the record can do itself

The reminder the agent receives is [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:138]:

> `[goal_resend_pending] The bound packet goal.md (<path>) changed above its log. Resend its durable slice in chat, frontmatter excluded, ask the operator to set it, then record it with the goal command's resent action. Keep working meanwhile.`

Three manual steps: render the slice in chat, have the operator paste it back into the goal surface, then record the resend. On the four runtimes with an adapter, the paste is unnecessary: `bindGoal` re-derives the record's objective and prompt from the packet file on every call [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:932–933], and `noteResent` records the slice hash so the reminder stops [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1018–1028]. The operator's copy *is* the stored objective (ADR-002), so a `bind` immediately followed by `resent` updates exactly the fields the reminder asks a human to update by hand — up to the 4,000-character durable budget, pasted without a typo check.

**Smallest change**: make the reminder capability-aware. Two wordings, same length:

- Adapted runtimes (opencode, pi, cursor, devin): `[goal_resend_pending] The bound packet goal.md (<path>) changed above its log. Render its durable slice in chat, frontmatter excluded, refresh the stored copy with the goal command's bind, then record the send with resent. Keep working meanwhile.`
- Native runtimes without an adapter (Claude Code, Codex): keep today's wording, because there the operator really does hold the copy.

Optional one-action variant if the two-call version proves clumsy: a `resync` action that binds and records the hash in one locked mutation. Cost: one new action on the core, CLI and plugin surfaces versus zero code for the wording split.

### U3-2 (moment: switch packets or lose one) — `show` keeps saying `packet_bound=true` after the document is gone

`packet_bound` is computed from the record's pointer, not from resolution [SOURCE: file:.opencode/hooks/goal/bin/goal.cjs:139], while the render path returns an empty block when the document is missing [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:396–398]. After a rename, a move, or a deleted packet, the operator asking `show` reads `packet_bound=true` beside no injection and no explanation; the only trace is an empty block. **Smallest change**: derive the field from `resolvePacketGoal(goal, workspace)` and add one line:

- `packet_state=bound|missing|unbound` where `missing` means the pointer exists and the document does not.
- When `missing`, one `hint=` line: `hint='the bound packet goal.md is missing; this session injects nothing until it is rebound'`.

### U3-3 (moment: read the injected goal) — The criteria arrive as a run-on sentence

Both renderers flatten the objective slice with `sanitizeInlineText`, which collapses every newline to a space [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:273–278], [SOURCE: file:.opencode/plugins/opencode-goal.js:2722]. The slice the flattening consumes is pointer, then `BINDING: …`, then `DONE WHEN:` followed by one bullet per criterion [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:100–112]. After flattening, the `objective:` line reads as: `objective: Execute specs/…. BINDING: read each phase's goal.md … DONE WHEN: - first check - second check - third check`, truncated near 576 characters (ADR-003's measured preview), which can cut a criterion mid-phrase. The model can still recover the list from `goal_prompt:`, which preserves newlines [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:281–290], but the field a human reads is the mangled one.

**Smallest change**: keep `sanitizeInlineText` for the pointer and the BINDING sentence, and render the criteria as their own list field: `criteria: 1) …; 2) …` or a `criteria:` newline block. **Wording**: `objective: Execute <path>/goal.md.` / `criteria: 1) <first> 2) <second> 3) <third>` — the same information, addressable and cuttable at an item boundary instead of mid-phrase.

### U3-4 (moment: read the usage envelope) — `tokens 0/none` and the turn-count footnote are noise on every injection

The core's block prints `usage: tokens n/a/none; time 0s; iteration 0 (source: turn-count-estimate)` [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:429] and the plugin prints `usage: tokens 0/none; time 0s; iteration 0/12` [SOURCE: file:.opencode/plugins/opencode-goal.js:2740]. With no budget set, "0/none" states a ratio that does not exist; the parenthetical provenance belongs to a debug surface, not to every system prompt. **Smallest change**: omit the tokens segment entirely when `tokenBudget` is null, and move `(source: …)` out of the injected block into `show`. **Wording**: `usage: time 12s; turn 3` (or nothing at all when every field is zero).

### U3-5 (moment: get reminded, on cursor and devin) — The reminder names an action those runtimes cannot perform

The reminder says "record it with the goal command's resent action" [SOURCE: file:.opencode/hooks/goal/lib/goal-slice.cjs:138], but the bind table marks cursor and devin as "injection-only; no management surface" [SOURCE: file:.opencode/commands/speckit/assets/speckit-plan.yaml:181–182]. The adapters inject the reminder without knowing the agent can act on it [SOURCE: file:.opencode/hooks/goal/cursor/goal-inject.mjs:84] [SOURCE: file:.opencode/hooks/goal/devin/goal-inject.mjs:70], so on those runtimes the pending bit can stay set indefinitely and the reminder repeats every turn. This is the same class as the phase-007 review's F015 (the Cursor command hint advertising actions the contract refuses). **Smallest change**: the adapter already knows runtime, session and workspace at injection time; have it append the exact command to the reminder, e.g. `record with: node .opencode/hooks/goal/bin/goal.cjs resent --runtime Cursor --session <sid> --workspace <root>`, or suppress the "record" clause where no surface exists and say `ask the agent to re-render the slice next turn until the operator copy is refreshed`.

### U3-6 (moment: set a goal for the first time) — `show` answers a machine, not an operator

`show` prints seventeen `KEY=VALUE` lines, two of which embed entire multi-line documents inside quotes (`goal_prompt`, `injection_preview`) [SOURCE: file:.opencode/hooks/goal/bin/goal.cjs:118–141]. Fields an operator never acts on (`usage_source`, `created_at_ms`, `updated_at_ms`, `turns_used`) sit at the same weight as `packet_path`. The shape is right for the pi adapter, which parses it [SOURCE: file:.opencode/hooks/goal/pi/goal-context.ts:106–107]; it is wrong as the human answer to "what is my goal". **Smallest change**: keep the machine envelope byte-identical and add a first-line summary plus a `--human` mode that prints the packet path, the budget state, the resend state, and the injection block unquoted. **Wording**: `goal: bound to <path> | durable 1,842/3,000 chars | resend pending | status active`.

### U3-7 (moment: switch packets) — Rebinding silently drops the previous record

`bindGoal` intends to archive a replaced record [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:934–937], but the guard compares `base === current` where `base` is a fresh spread copy [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:934–936], so the archive branch is unreachable (also filed as F009 in the phase-007 review). The operator who switches packets gets no `history` entry for the abandoned goal. **Smallest change**: archive whenever a rebind replaces an active record with a different `packetPath`. This is two lines; the archive path already exists and is best-effort [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:661–671].

## Questions Answered

- **Q3** (operator UX): answered. Seven friction points, each with a smallest change and wording: the three-step resync whose paste the record can do itself (U3-1), a `show` that reports bound after the document is gone (U3-2), a flattened criteria list (U3-3), a usage line that states a ratio that does not exist (U3-4), a reminder naming an action two runtimes cannot perform (U3-5), a machine envelope as the human answer (U3-6), and a rebind that drops history (U3-7).

## Ruled Out

- **The reminder is too long to be useful**: at one line and roughly 250 characters it is proportionate for a pending state; the defect is not length but what it asks for (U3-1) and who can comply (U3-5). Length is reconsidered in the overengineering angle only as trailing boilerplate ("Keep working meanwhile" is load-bearing: it encodes never-halts).
- **The operator must paste because the record cannot be written by tooling**: false on the four adapted runtimes — `bind` writes objective and prompt from the file [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:932–933] and `resent` writes the hash [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1018–1028].
- **`show`'s machine envelope must change to become usable**: false; adding a human mode keeps the pi adapter's parser intact [SOURCE: file:.opencode/hooks/goal/pi/goal-context.ts:106–107].

## Dead Ends

- Looking for an operator-facing success message after `bind` found only `STATUS=OK ACTION=bind` plus the envelope [SOURCE: file:.opencode/hooks/goal/bin/goal.cjs:105–110]. There is no "you are now bound to X; injection starts next turn" line; folded into U3-6 rather than filed separately because the summary line fixes both.

## Edge Cases

- **Text-only goal**: has no packet path and no reminder; every U3 item above is about the bound path and leaves the text path exactly as ADR-001 describes it.
- **`resent` on an unbound record**: throws `PACKET_GOAL_NOT_FOUND` [SOURCE: file:.opencode/hooks/goal/lib/goal-core.cjs:1021–1023]; the operator sees an error where the honest message is "this session is not bound".
- **Budget warning at set time**: the CLI reports the warn/over tier with both numbers on `bind` [SOURCE: file:.opencode/hooks/goal/bin/goal.cjs:164–167], which is the wording U3-1's flow should reuse when the resync crosses a tier.

## Sources Consulted

- `.opencode/hooks/goal/bin/goal.cjs` (:105–242)
- `.opencode/hooks/goal/lib/goal-core.cjs` (:273–290, :389–448, :661–671, :932–937, :1018–1028)
- `.opencode/hooks/goal/lib/goal-slice.cjs` (:100–112, :130–139)
- `.opencode/plugins/opencode-goal.js` (:2701–2759, :2820–2823)
- `.opencode/hooks/goal/pi/goal-context.ts` (:106–107), `cursor/goal-inject.mjs` (:84), `devin/goal-inject.mjs` (:70)
- `.opencode/commands/speckit/assets/speckit-plan.yaml` (:181–184)
- `specs/system-speckit/033-system-speckit-v4/036-goal-unification/002-decisions-and-contract-freeze/decision-record.md` (ADR-002, ADR-004)

## Assessment

- New information ratio: 0.85
- Novelty justification: the operator-day walk is a new angle; six of seven friction points are new, and U3-7 confirms the phase-007 review's F009 with the operator-visible consequence attached.
- Confidence: high for U3-1 to U3-4 and U3-7 (read directly from the cited lines); medium for U3-5 (the adapter knows the values, but the exact injection contract there was not re-verified this iteration) and U3-6 (a proposal, not a defect).
- Marked inferred: U3-5's "reminder repeats forever" assumes no operator-side record path on cursor and devin; the CLI remains reachable by shell, so the practical failure is a repeated instruction the agent cannot complete without guessing scope flags.

## Reflection

- What worked and why: walking the six moments in sequence surfaced that two of them (set again, edit a criterion) share one root — the resync flow was designed for a world where the copy lives only in the operator's hands.
- What did not work and why: looking for operator-facing success or error copy beyond the envelope found none, which is why U3-6 is framed as an addition rather than a replacement.
- What I would do differently: measure the injection block against a real long parent goal earlier; the flattening defect (U3-3) only became visible once the criteria list was read beside the flattened rendering.

## Recommended Next Focus

Iteration 4 — Overengineering: what shipped that no current caller needs. Candidates carried forward: the machine envelope fields (U3-6), the two-slice projection, the `packet` action on three surfaces, envelope lines, the reminder's trailing text, and the doc paragraphs that restate each other. For each, name the caller that would justify it or recommend removal.
