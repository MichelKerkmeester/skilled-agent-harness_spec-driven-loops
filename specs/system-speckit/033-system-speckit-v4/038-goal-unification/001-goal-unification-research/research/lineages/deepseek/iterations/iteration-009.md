# Iteration 9: A1 + A3 second pass — Binding and store fate as one mechanism (D1, D2)

## Focus

Re-run the binding and store-fate angles as a single mechanism: one per-session record that carries the
packet pointer, the operator's copy, and the liveness/telemetry that must stay per-session; then state what
happens to the records that already exist. Angle A1+A3 (charter `../../deep-research-strategy.md`:58).

## Actions Taken

1. Re-read the two first-pass option sets and the isolation constraints that bound them.
2. Read the legacy migration surface in the core and the CLI to size the migration note.
3. Worked the three failure scenarios the charter names: two sessions in one packet, one session switching
   packets, concurrent pointer writes.

## Findings

### F1. The first pass conflated two different strings; the second pass separates them

Iteration 3 proposed deriving `objective` *and* `goalPrompt` from `goal.md`. That is wrong for `objective`:
the playbook states the objective an operator sets is the string "the runtime holds for the current session
and judges completion against", and it is a *copy* of the durable slice, not the slice
(`[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:104]`,
`[SOURCE: .../goal-set-string-playbook.md:105]`). Refined design:

| Field | Source of truth | Why |
|-------|-----------------|-----|
| `objective` (operator copy) | the record; updated by the resend paste | it is what the runtime judges, and the resend exists to keep it current |
| `goalPrompt` / brief text | read from `goal.md` at render time (durable slice) | the file is the source; a stored duplicate drifts |
| packet pointer | the record | per-session selection (ADR-001) |
| status/usage/verifier telemetry | the record | per-session facts (iteration 3, F3) |

This split is what makes "single source of goal state" compatible with the operator-copy rule: there is one
source for *content*, and exactly one place that remembers *what this session was told*.

### F2. The unified per-session record

| Field group | Fields | Notes |
|-------------|--------|-------|
| identity | scope key (existing `sha256([workspace, runtime, sessionId])`, `goal-core.cjs:191`), `runtime` | unchanged; raw ids still never appear in filenames (ADR-001 constraint) |
| binding | `packetPath` (null until bound), `boundAt`, `boundBy` (`command` \| `operator`) | new; explicit only, never inferred (`decision-record.md:41`) |
| operator copy | `objective`, `setAt` | existing field, semantics narrowed to "the copy" |
| integration | `lastResentSliceHash`, `lastResentAt` | new; D4's dedup state |
| liveness | `status`, `revision`, timestamps | existing; stays per-session |
| telemetry | `turnsUsed`, `tokenBudget`, `lastVerifier*`, `usageSource` | existing; stays per-session |
| machinery | `.locks/`, `.archive/`, retention | unchanged |

The status values already known to the core (`active`, `paused`, `completed`, `cleared`, and the
`unbound` concept the CLI prints for malformed legacy state) mean the new "bound/unbound" distinction has
precedent vocabulary rather than inventing a parallel state machine.

### F3. Failure scenario: two concurrent sessions in one packet

- **Read side:** both sessions read the same `goal.md`; there is no replacement, which is exactly the
  property the removed singleton lacked.
- **Write side:** each session mutates its own record (locks, status, telemetry) — no cross-session lock
  contention, because the lock lives in the per-session store, not on the shared file
  (`goal-core.cjs:524`).
- **Resend:** each session computes the same durable-slice hash and may resend in its own chat. If one
  operator drives both sessions, they receive the same resend twice — a duplicate cost, not a correctness
  failure; the per-session dedup (D4) keeps it to one per change per session.
- **Directive edits:** a durable edit by session A is a *change* for session B (its hash differs) and B will
  resend on its next turn. Two simultaneous durable edits are a git conflict, not a goal-engine conflict —
  which is the correct layering (iteration 6, F6).

### F4. Failure scenario: one session switching packets

The pointer is rewritten only by an explicit bind (command or operator statement), and the *dedup key must
be packet-scoped*: `hash(packetPath + durableSliceHash)`. A bare slice hash would let packet A's text
suppress packet B's resend when the two happen to hash equal (rare but possible) — and, more importantly,
would silently drop the resend when a session returns to a packet it left. Rebinding also keeps the previous
record's status: the record is per session, so switching packets must archive or pause the old objective
rather than silently overwrite, matching `setGoal`'s existing `replaced` + archive semantics
(`[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:929]`).

### F5. Failure scenario: concurrent pointer writes, and packet disappearances

The pointer lives in a per-session file (`<tmpdir>/speckit-claude-hooks/<projectHash>/<sessionHash>.json`
today, `[SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts:43]`, or the
per-session goal record), so two sessions cannot collide on it. Two collision paths remain: (a) a packet
directory renamed/moved/deleted — the pointer dangles; the read must return "unbound" and inject nothing,
never fall back to a nearby packet; (b) tmpdir purge — the session state file vanishes; the goal record in
the repo-local store is the durable half, so the pointer should live in the *store record*, and the tmpdir
field at most mirrors it.

### F6. Migration of existing records is progressive and needs no rekey

The migration machinery already present in the core is the right precedent:

| Existing artifact | Handling |
|-------------------|----------|
| Scoped records (`<scopeKey>.json`, core `:203`; plugin sha256/hex keys, plugin `:358`, `:362`) | read unchanged; new fields absent → `packetPath: null`, so no packet content is injected until an explicit bind. Keys do not change |
| Records with an `objective` but no pointer | remain valid operator copies; the next `bind` attaches a packet and the next resend/render reads the file. No silent adoption — mirrors REQ-006 (`spec.md:141`) |
| Legacy singleton `active-goal.json` | unchanged path: `inspectLegacyGoal` (`goal-core.cjs:672`), `quarantineLegacySnapshot` (`:746`), `migrateLegacyGoal` (`:774`) requires a live scope, `archiveLegacyGoal` (`:839`) preserves bytes |
| CLI surface | `legacy-inspect` and `legacy-archive` are already scope-free while `legacy-migrate` is scope-bound (`goal-cli` `:311`) — the boundary the design should keep |
| Archived snapshots (`.archive/<scopeKey>/`, `.archive/.legacy/`) | untouched; they are history, not state |

Note the legacy path constants: `LEGACY_STATE_FILENAME = 'active-goal.json'` (`goal-core.cjs:45`),
`LEGACY_ARCHIVE_SUBDIR = '.legacy'` (`:47`), and the adoption shim `adoptLegacyScopedState` (`:568`).

### F7. The two-implementation drift is the one thing this design cannot fix from the core

Iteration 5 (F7) established that the OpenCode plugin does not import the core
(`[SOURCE: .opencode/hooks/goal/README.md:31]`). A per-session record with a pointer and a dedup hash must
therefore be implemented twice, or the plugin must be reduced to a thin adapter over the core. The choice is
a D5/D7 decision, not a D1/D2 one; the finding is recorded here because the store-fate decision is what
makes it visible (one store, two writers).

## Assessment

- `newInfoRatio`: 0.55 — the objective-versus-prompt separation, the packet-scoped dedup key, and the
  pointer-lives-in-the-store refinement are new; the option sets and migration machinery were established in
  iterations 1 and 3.
- Confidence: high on F2/F6 (fields and machinery read); F3-F5 are scenario analyses grounded in the code
  paths cited, and F7 restates iteration 5.
- One sentence: one per-session record can hold the pointer, the operator's copy, and the liveness that must
  stay per-session, while all goal *content* is read from `goal.md` — and existing records migrate by simply
  lacking the new pointer field.

## Reflection

- What worked: forcing the two angles into one record immediately exposed the objective/prompt conflation
  from iteration 3 — a second pass that only re-listed options would have missed it.
- What failed: nothing blocked. The plugin-drift question could not be resolved here and is consciously
  handed to the synthesis as a D5/D7 item rather than guessed at.
- Ruled out: a bare slice hash as the dedup key (packet-scoped instead), and rewriting the pointer into the
  tmpdir session state only (the durable half belongs in the store).

## Sources Consulted

- `.opencode/hooks/goal/lib/goal-core.cjs` (45, 47, 191, 203, 524, 568, 672, 746, 774, 839, 897, 929)
- `.opencode/hooks/goal/README.md` (31)
- `.opencode/hooks/goal/bin/goal.cjs` (311)
- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` (104, 105)
- `.opencode/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts` (43)
- `specs/hooks/009-goal-isolation/decision-record.md` (41, 43)
- `specs/hooks/009-goal-isolation/spec.md` (141)

## Recommended Next Focus

Iteration 10 (A2 + A4 second pass): strip and resend as one pipeline, end to end, including the chat path
and the frontmatter-leak test.
