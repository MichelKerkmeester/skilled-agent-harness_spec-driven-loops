# Second review of the 003 plans and fixes

Fresh Opus high review, read-only, after the first fix pass. Operator decision: the `--scope` flag on `bots answer` (once and deny) moves into phase 001, so the screen (003) can use it without waiting for 006. 006 keeps grants and the ladder. Build order stays 001 to 011.

## P0, blocks the build
- R2-P0-1 001 (spec.md:133, T033) and 002 (AC-007, T028) edit and grep `crates/bots-tui/tests/fixtures/bots`, which only 003 creates. Fix: 003 creates the fixture with the 001 and 002 payloads; 001 and 002 assert their payloads through `bots ... --json` output instead.
- R2-P0-2 003 says it starts after 006 closes (003 spec.md:224) because it passes `--scope`, refused by bots.cjs:64 until then. Fix per the operator decision: 001 adds `--scope once|deny` to `bots answer`, 003 depends on 001 and 002 only, 006 extends scope with grants.
- R2-P0-3 005 writes `grants: null` (REQ-007, AC-007) before 006 adds the key, and validateNeedsYouItem refuses unknown keys (needs-you.ts:97-98). 005 REQ-013 and AC-014 also assert a scope. Fix: 006 adds `grants` to 005's writer, 005 writes no grants field.
- R2-P0-4 004 AC-001 and CHK-014 place its line "before the memory block", which 005 adds later. Fix: assert relative to the decision marker.
- R2-P0-5 P0-1 fix is ambiguous: 001 spec.md:115 says "Add the actor column" and T014 expects the insert and the select. A real column with SCHEMA_VERSION '2' makes an old index open then fail on its first INSERT (status-index.ts:165-175,309). Fix: actor is a field inside the summary JSON, no DDL change, and a test writes into an index built by the old DDL.

## P1, wrong or missing
- R2-P1-1 006 REQ-012 `[ACTION: <kind>]` override prefers the bot's declaration, reopening P1-006-1. Fix: take the stricter of declared and classified kind.
- R2-P1-2 001 REQ-008 tty rule for `--as` breaks checks run without a tty: 001 T021, 005 T022, 011 SC-007 and plan.md:99, and 011 REQ-005 daemon answers with --as. Fix: tty check only in bots.cjs, the channel passes the actor to answerItem directly, and tests call answerItem or set the actor explicitly.
- R2-P1-3 011 maps a chat NO to `--scope deny` but 006 REQ-005 records once. Fix: a NO records deny on every surface.
- R2-P1-4 002 fatigue item: the sentinel botId names no real bot, so `bots enable <bot>` cannot find it, AC-006 "exactly one item for that bot" contradicts it, and "closes" is not a runtime state (needs-you.ts:135). Fix: name the bot in a field the item schema has, use the runtime's answered state.
- R2-P1-5 P1-008-3 not closed: fixture `env | sed 's/=.*//'` strips the =, yet AC-007, T035 and CHK-021 expect `SKILLED_BOT_SECRET_DEMO=`. Fix: align the expectation with the fixture.
- R2-P1-6 010 REQ-012 adds a conversation id to the needs-you item and the resume request, both closed schemas (needs-you.ts:97, request-record.ts:190), and neither file is in 010's Files to Change. Fix: add both files and the key changes.
- R2-P1-7 010 REQ-009 caps the prompt at 32,000 chars cutting only the conversation, while 009 admits up to 65,536 bytes of skill bodies. Fix: one overflow rule across 005, 009 and 010.
- R2-P1-8 007 is fail-closed only for worktree runs; a shared run with no apps still reaches every server (spec.md:108,142). Fix: no apps means zero servers for every run, or state the shared-run exception as a named risk.
- R2-P1-9 008 REQ-001 reads piped stdin while REQ-002 has `security -w` prompt on the terminal. Fix: one reader, for example `security -i` with the command on stdin.
- R2-P1-10 The injection criteria (005 AC-015, 009 SC-007, 010 REQ-013, 011 REQ-022) say the run records the attempt as data, with no field or detector. Fix: name the field and how it is detected, or drop the claim.
- R2-P1-11 009 spec claims RESERVED_BOT_IDS already refuses the sentinel; label.ts:28 holds only the drain suffix. Fix: 009 adds the sentinel to RESERVED_BOT_IDS.
- R2-P1-12 Partly closed: P1-006-4 (an answer with no --as resolves to the OS user, child reach to the state root unverified), P1-011-6 (a plan test row with no requirement), P1-002-3 (the fatigue item, see R2-P1-4).
- R2-P1-13 Synthesis research.md swaps lineages in its Divergence Map (vibe-1 reports 0 P0 and pivoted depth to breadth, vibe-1 research.md:9,230; vibe-2 reports 3 P0 including the schema conflict and the roster, vibe-2 research.md:17,37-39) and misses vibe-2 findings #16 (NO press records once), #17 (two phases add kind to the closed ITEM_KEYS), #12 (003 Definition of Ready is circular), #6 (whether fatigue counts parked runs), #13 (009 depends on 005 but names only 001).

## P2, polish
- R2-P2-1 001 and 005 both add item kind; only 005 defines its values. One phase owns kind.
- R2-P2-2 Parent lists six inbox keys, 001 REQ-003 lists ten. Align.
- R2-P2-3 The fixed prompt order omits the existing checkoutLine (dispatch.ts:325).
- R2-P2-4 007's child can commit the tracked worktree .utcp_config.json before the runner restores it.
- R2-P2-5 002 expects 9 routine- fixtures but routine-clean makes 10, and T031 needs a met untilMetAt on a static fixture.
- R2-P2-6 `tsc --noEmit` survives at 004 plan.md:28 though no tsc is installed.
- R2-P2-7 008 T009's regex `-w$` will not match an args array.
- R2-P2-8 Two names for one scan: 010 secret-in-answer and 008 secret-in-output. One name.
- R2-P2-9 P2-006-1 worse: REQ-009 says four rungs, REQ-003 names three for rungs 2 to 5, the enum has five values. P2-011-1 and P2-011-2: five transports and channel-terminal.ts remain with no recorded decision.
