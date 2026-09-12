# Iteration 6: A6 — Isolation regression: what must stay per-session (D7)

## Focus

Read the isolation packet and name exactly what shared state it removed and why, so that a packet-shared
`goal.md` does not re-introduce it. Angle A6 / decision D7 (charter `../../deep-research-strategy.md`:56).

## Actions Taken

1. Read `specs/hooks/009-goal-isolation/spec.md` (problem, requirements, success criteria).
2. Read its `decision-record.md` ADR-001 in full.
3. Read the phase-6 child that removed the Devin goal remnants.

## Findings

### F1. What was removed was a *process-global pointer*, not shared documentation

The removed state was a repository-wide singleton,
`.opencode/skills/.goal-state/active-goal.json`: "the last session to set a goal replaces the prior
session's record and every Pi input hook injects that replacement"
(`[SOURCE: specs/hooks/009-goal-isolation/spec.md:48]`). The three coupled failures are named as: a second
goal replaces and archives the first while another session still uses it; every Pi and Cursor reader
selects the same last-written record because selection has no identity input; and any session can
"increment, pause, complete, clear, or verify the shared record"
(`[SOURCE: specs/hooks/009-goal-isolation/spec.md:77]`). An isolated negative control recorded
`GOAL_A` created → `GOAL_B` replaced, with `GOAL_A` archived `status=active`
(`[SOURCE: specs/hooks/009-goal-isolation/spec.md:79]`).

None of that is about sharing *content*. It is about implicit selection and shared mutable liveness.

### F2. The accepted decision, verbatim

ADR-001 (Accepted, 2026-08-10) requires "an explicit goal scope composed from normalized workspace root,
runtime namespace, and native session id for every runtime-neutral goal operation", hashing
`JSON.stringify([repositoryRoot, runtime, sessionId])` into one opaque 64-hex scope key with scoped JSON at
`.goal-state/<scope-hash>.json` and archives at `.goal-state/.archive/<scope-key>/`
(`[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:47]`). Two rules matter most for this packet:

- "No reader or injection hook falls back to `active-goal.json`"
  (`[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:51]`).
- "Runtime hooks must fail open to the user's turn, but goal selection must never guess"
  (`[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:41]`).

There is also a constraint with design weight: "Raw session identifiers should not appear in filenames or
diagnostics by default" (`[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:43]`) — any
session→packet pointer record must be keyed opaquely.

### F3. The "management and injection must cut over together" rule binds D1

ADR-001 states the management path is "the harder half of the correction": injection hooks already receive
native session ids, but `/goal-pi` and `/goal-cursor` run a shell CLI that receives only user arguments, so
"a session-scoped reader paired with a global writer would be incomplete and confusing, and management and
injection must cut over together"
(`[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:36]`). Applied to D1: a binding record written
by a *command* and read by a *hook* must use one key derivation on both sides, or the same class of split
reappears.

### F4. Requirements that constrain any inbound design

| Requirement | Statement | Consequence for this packet |
|-------------|-----------|-----------------------------|
| REQ-001 | Missing/blank session identity produces no injection; mutations return `MISSING_SESSION_ID` and write nothing (`[SOURCE: specs/hooks/009-goal-isolation/spec.md:136]`) | A packet goal without a session identity may still be *read for chat*, but must not inject |
| REQ-006 | With only legacy state present, injection returns no goal until an explicit migration or set (`[SOURCE: specs/hooks/009-goal-isolation/spec.md:141]`) | The store may be demoted (iteration 3, O3-B) but never auto-claimed |
| SC-004 | A legacy-only state test proves the singleton is never passively injected (`[SOURCE: specs/hooks/009-goal-isolation/spec.md:164]`) | Same rule must hold for a legacy record that names no packet |
| REQ-010 | Devin goal adapters stay decommissioned (`[SOURCE: specs/hooks/009-goal-isolation/spec.md:150]`) | Charter's frozen "commands ship for devin" must not be read as reviving the removed adapter; the phase-6 child preserved unrelated Devin runtime support byte-unchanged (`[SOURCE: specs/hooks/009-goal-isolation/006-opencode-goal-optimization-and-devin-removal/spec.md:156]`) |

### F5. The reconciliation: shared *directive* is safe; shared *liveness and selection* is not

A packet `goal.md` is shared content by design — the same directive binds every session working the packet,
and the template's own binding section assumes child goals are read by whichever session works the phase
(`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:71]`). What ADR-001 forbids is
(a) implicit selection and (b) per-session mutable facts living in shared storage. Split accordingly:

| Fact | Where it belongs | Why |
|------|------------------|-----|
| Durable directive, decisions, criteria, phase binding | packet `goal.md` (shared, committed) | same content for every session; reviewable; the resend rule already treats it as the source |
| Which packet this session is on | per-session pointer record, opaque key | ADR-001's selection rule; must be explicit, never inferred |
| Status (active/paused/completed/cleared), usage, verifier verdicts | per-session record (iteration 3) | the exact class that was corrupted by sharing |
| Locks, archive, retention | per-session store | physical impossibility for a git-tracked file (iteration 3, F3) |
| Injection cadence/dedup (`lastSupersededHash`) | per-session record | iteration 4, F5 |

### F6. Residual regression risks this design must still answer

1. **Two sessions, one packet, both editing the directive** — nobody "replaces" anybody, but a concurrent
   `goal.md` write can conflict in git. Editing the directive stays a command-mediated, reviewable act;
   the log section is the only append-heavy area and the resend rule already excludes it.
2. **A legacy record with an objective but no packet** — must not be injected merely because a packet
   exists nearby (REQ-006 by analogy). Migration stays explicit.
3. **`lastSpecFolder`-style implicit binding** (iteration 1, F1) — using it as a *fallback* would violate
   "never guess". It may inform a *suggestion* the operator confirms, never an automatic bind.

## Assessment

- `newInfoRatio`: 0.6 — the ADR's exact wording, the "management and injection cut over together" rule, the
  opaque-filename constraint, and the REQ-010/dev-in boundary are new; the singleton story was known.
- Confidence: high on F1-F4 and F6 (packet docs read directly). F5 is the design synthesis and is therefore
  a claim, not a reading.
- One sentence: the isolation packet removed implicit selection plus shared per-session state; a shared
  packet directive violates neither, provided selection stays explicit, liveness stays per-session, and
  legacy records are never auto-claimed.

## Reflection

- What worked: reading the ADR rather than the spec alone — the ADR carries the constraints
  (opaque filenames, fail open but never guess, cut over together) that the spec only implies.
- What failed: nothing blocked; the packet's phase-6 child was needed to resolve the apparent conflict
  between the charter's frozen "devin ships" line and the decommissioned adapter, and it resolves it
  cleanly (claims removed, unrelated Devin support preserved).
- Ruled out: per-session copies of the directive (re-creates drift), and inference-based binding
  (ADR-001 forbids guessing).

## Sources Consulted

- `specs/hooks/009-goal-isolation/spec.md` (48, 50, 52, 77, 79, 136, 141, 150, 164, 268)
- `specs/hooks/009-goal-isolation/decision-record.md` (ADR-001: 36, 41, 43, 47, 51)
- `specs/hooks/009-goal-isolation/006-opencode-goal-optimization-and-devin-removal/spec.md` (110, 156)
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (71)

## Recommended Next Focus

Iteration 7 (A7 / KQ7): the authority ladder for parent-goal mutation and the child-to-parent amendment
path.
