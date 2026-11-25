# Iteration 4: The `--json` envelope convention and its precedent

## Focus
Frontier node F-2-006 (depth 2, scope .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/lib/status.ts): What is the exact JSON envelope convention every bots ... --json verb must follow, and which existing verb sets the precedent?

## Actions Taken
1. Read the `status` verb's JSON branch in `bots.cjs`, which prints `JSON.stringify(report.value, null, 2)` and routes rebuild chatter to stderr when `--json` is set.
2. Read `StatusReport` in `status.ts` — the only `--json` payload the runtime emits today — to establish the precedent's shape.
3. Read the three new verbs' payload requirements in 001 (`activity`, `inbox`), 002 (`routines`) and 010 (`chat`) and compared their envelopes.
4. Checked whether any phase states the stdout/stderr split or the pretty-print rule for a `--json` verb.

## Findings
1. **P1 — The packet has no envelope rule, and the three new verbs disagree: `activity` prints an object, `chat` prints a bare array, and `routines` prints neither by name.** `bots activity --json` prints `{"groups":[]}` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:229], `bots chat --json` prints "the messages as a JSON array" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:158], and `bots routines --json` names its row fields without an envelope [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:178]. Closing artifact: `contracts/json-envelope.md` with one rule and one schema per verb.
2. **P1 — The precedent is unambiguous and it is the object envelope: `bots status --json` prints the whole `StatusReport` object with named keys, never a bare array.** The verb writes `JSON.stringify(report.value, null, 2)` [SOURCE: .skilled/bin/bots.cjs:386-388], and `StatusReport` is `{indexPath, builtAt, stale, staleIdentities, rows, duplicateRoots, notes}` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-114]. So the rule the packet should adopt is "one object with named keys; a collection is a named key", which makes `activity`'s `{groups: []}` correct and `chat`'s bare array the one violation. Closing artifact: the rule stated in `contracts/json-envelope.md` with `status` cited as the precedent.
3. **P1 — `bots chat --json` as a bare array is the one verb that breaks the precedent, and 003's chat pane reads it, so changing it later breaks the screen.** 010 REQ-006 fixes the array [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:158] and REQ-008 makes the chat pane read that payload [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:160], while 003's fixture is the copy of every `--json` contract the screen reads [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/plan.md:122]. Closing artifact: change 010 REQ-006 to `{"messages": [...]}` before 003's fixture is written, and record the change in 010's decision record.
4. **P1 — No phase states the stdout/stderr split for a `--json` verb, though the existing verb already implements it.** `bots status --json` sends rebuild progress to stderr and the document to stdout, so a caller can parse stdout unconditionally [SOURCE: .skilled/bin/bots.cjs:376-388]. The new verbs (`activity`, `inbox`, `routines`, `chat`, `channel list`) state no such rule, so a builder may print a warning to stdout and break every parser. Closing artifact: one rule in `contracts/json-envelope.md` — "with `--json`, stdout carries only the JSON document and every human line goes to stderr" — plus one test per verb.
5. **P2 — Two different `state` vocabularies ship in one packet: an item's `state` is `open|answered|expired` and an activity row's `state` is one of the seven group ids.** 001 REQ-003 fixes the item vocabulary [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] and REQ-002 fixes the row vocabulary as "one of the seven group ids" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152], so a reader that handles both payloads sees one key name with two meanings. Closing artifact: rename the activity row field to `group` in 001 REQ-002, or state both vocabularies side by side in `contracts/json-envelope.md`.

## Ruled Out
- Treating `bots status --json` as a special case because it prints a report rather than a list: the report is the only precedent the packet has, and its shape (object with a named collection key) is exactly what `activity` already follows, so it generalizes.
- Looking for an envelope rule in the parent spec: the phase map names no payload and no verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166].
- Assuming the pretty-print indentation is part of the contract: `status` uses `null, 2` [SOURCE: .skilled/bin/bots.cjs:387], but no test compares exact whitespace, so indentation is a style choice rather than a contract and is not raised as a gap.

## Dead Ends
- The `--json` flag parsing itself is not a gap: `json` is already in `FLAG_OPTIONS` and `STATUS_OPTIONS` [SOURCE: .skilled/bin/bots.cjs:59-62], so a new verb inherits the flag with no parser change. The gap is the payload, not the flag.

## Edge Cases
- Ambiguous input: "the exact JSON envelope convention" could mean the top-level shape only or the whole document contract. Selected interpretation: the top-level shape plus the stdout/stderr split, because both decide whether a caller can parse the output. Deferred: field-level schemas, which iteration 1 already assigned to `contracts/`.
- Contradictory evidence: `activity` and `chat` genuinely disagree; both are cited and the existing `status` verb is used as the tiebreaker rather than a preference.
- Missing dependencies: none.
- Partial success: none.

## Questions Answered
- What is the exact envelope convention? One object with named keys, a collection under a named key, the document alone on stdout and every human line on stderr, with `bots status --json` as the precedent.
- Which existing verb sets the precedent? `bots status --json`, which prints the whole `StatusReport` object.

## Questions Remaining
- Does 010 accept the `{messages: []}` change, or does the chat pane's fixture absorb the bare array as a documented exception?
- Should the activity row's `state` be renamed `group` before 001 lands, or is the collision acceptable because the two payloads never mix?

## Sources Consulted
- .skilled/bin/bots.cjs:59-62, 376-388
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-114
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152-153, 229
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:178
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:158-160
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/plan.md:122
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166

## Assessment
- New information ratio: 0.90
- Questions addressed: the F-2-006 node question (envelope convention and precedent)
- Questions answered: both parts

## Reflection
- What worked and why: reading the one existing `--json` implementation settled the convention in a single call, because the precedent was already in the code and only the packet was silent about it.
- What did not work and why: checking for a pretty-print contract was wasted effort; no test compares whitespace, so indentation cannot be a contract.
- What I would do differently: start from the existing implementation of the verb family rather than from the new phases' prose, because the precedent is always in the code and the prose is where the drift is.

## Recommended Next Focus
Frontier node F-2-007 (the `ITEM_KEYS` single-writer question), then the unreviewed phases 007, 008, 009, 012, 013 and 014. The envelope rule should be ranked with the contracts phase, not separately, because it is one file in the same folder.
