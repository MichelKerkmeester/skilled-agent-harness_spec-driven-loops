---
title: "Decision Record: what moved after closure, and what was done about each"
description: "Four rulings from the 2026-09-05 re-measurement and its independent review: the scaffold fixed at the wrapper that lost its loader, the parity pin made deterministic at both scorers and re-baselined, the CLI hub's misowned signal retired and the dead sk-doc signal traced to a keyword collision and fixed, and the validator gap that let a boilerplate spec validate strict recorded with its mechanism and owner."
trigger_phrases:
  - "decision record"
  - "drift after closure decisions"
  - "loader path ruling"
  - "parity pin regime"
  - "keyword collision"
  - "placeholder rule gap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/008-drift-after-closure"
    last_updated_at: "2026-09-05T19:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed ADR-002 and ADR-003, added ADR-004"
    next_safe_action: "Hand ADR-004 to system-spec-kit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh"
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/parity/python-ts-parity.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py"
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-052-008-drift-after-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The scaffold is fixed at the wrapper's root resolution, and the same edit landed concurrently in 743e626543."
      - "The parity pin was never reachable from committed inputs. Both scorers now honour the database directory override, the test pins the CI regime, and the pins read 109 and 102."
      - "trigger_phrases died because spec-kit's keyword list gained trigger-phrases, whose variants tie sk-doc's explicit evidence and trip the low-information abstention. The keyword is removed and the signal resolves again."
      - "The strict validator's placeholder rule matches two marker forms only, never bracketed template text, which is why a boilerplate spec validated. Recorded with owner system-spec-kit."
---
# Decision Record: what moved after closure, and what was done about each

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

Three things moved between the packet closing on 2026-09-03 and the review on 2026-09-05,
and an independent review of this phase found a fourth. Each entry names the mechanism
with its evidence, the ruling, and what changed. One rule held throughout: no check was
edited to make a red run green. The one pin that moved was re-baselined only after its
regime was made deterministic and the new number reproduced twice.

The two investigations that closed ADR-002 and ADR-003 were dispatched to a fresh model
each with a frozen scope and no write authority. Every citation they returned that this
record relies on was opened and read before it was repeated here.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fix the scaffold at the wrapper, not at the fallback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, implemented in `743e626543` and completed here |
| **Date** | 2026-09-05 |
| **Deciders** | Operator |

### Context

`b4c2484696` nested the spec-kit CLI workspace from `scripts/` to `runtime/cli/`. The
render wrapper `inline-gate-renderer.sh` resolves its skill root one directory up from
itself and expects `node_modules/tsx/dist/loader.mjs` there. Before the move that was
`scripts/`, which carried its own `node_modules`. After it, that is `runtime/cli`, whose
`node_modules` holds only a vite cache and no tsx. The package is installed once at the
skill root, three levels up.

When the loader test fails the wrapper runs an inline Node fallback. That fallback reads
only the last file argument, ignores `--out-dir`, and prints the rendered text to stdout.
`copy_templates_batch` passes every template and an out-dir in one call, so the batch
wrote nothing, and `create.sh` captured a template's text as its list of created files.
A Level 3 scaffold produced `description.json`, `graph-metadata.json`, and `scratch/`.

The scaffold test caught it only at the add-on assertion, because its default case asserts
that add-ons are absent, which a scaffold that writes nothing satisfies.

One grep over `runtime/` for the loader path finds seven spellings. Four were one level
short: the wrapper, the backfill loader in `create.sh`, which fell to a silent skip, the
TypeScript orchestrator lane in `validate.sh`, which fell to the compiled orchestrator and
never showed a symptom, and the renderer's own test file, which the independent review of
this phase found after the first three had been fixed. Two are absolute and one in
`template-utils.sh` was already three levels up.

### Decision

Point all four at the skill root, three levels up, which is the spelling
`template-utils.sh` already uses beside them. Leave the fallback as it is. The identical
edit to the first three landed concurrently in `743e626543`, from
`specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`, so
this tree carries no diff for them. The fourth, in `runtime/cli/tests/inline-gate-renderer.vitest.ts`,
is this phase's diff.

### Consequences

- The same test that was red proves the fix: 9 of 9, where the pre-fix run had 1 failed on
  `before-after.md`. A scratch Level 3 packet with add-ons renders eleven documents. The
  renderer's own test passes 12 of 12 with its loader path corrected.
- The fallback still cannot honour `--out-dir`. On a tree with no tsx anywhere the batch
  path would fail the same way. That is written here rather than patched, because the
  fallback exists for an environment this repository does not have, and widening it means a
  second renderer to keep in step with the first.

### Alternatives rejected

- Teach the fallback to parse `--out-dir` and loop over its files: a second implementation
  of the renderer's contract, in a language the renderer is not written in, for an
  environment nobody has named.
- Resolve the loader with `require.resolve('tsx/dist/loader.mjs')`: the package's exports
  map does not expose that subpath, so the call throws.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Make the parity pin deterministic at both scorers, then re-baseline

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, implemented |
| **Date** | 2026-09-05 |
| **Deciders** | Operator |

### Context

`python-ts-parity.vitest.ts` pinned the Python reference at 112 gold-correct top-1 calls,
the native scorer preserving 107 of them, and an accepted regression list of five ids. The
pin was last set on 2026-09-01 in `35721a4db7`. The suite is in no workflow under
`.github/`.

On 2026-09-05 two identical local runs returned 113 and 108 with 5 regressions, then 114
and 108 with 6. With `SYSTEM_SKILL_ADVISOR_DB_DIR` pointed at an empty directory the native
scorer changed regime but the Python reference still printed `Skill graph: loaded from
SQLite`.

The investigation traced both leaks. The test disabled only the built-in semantic lane for
the Python spawn and imported the native scorer statically, so
`lib/scorer/projection.ts:58` had already read the database directory before any test code
ran. The sibling suites pin all three regime variables before a dynamic import. This one
did not. The Python reference resolved its database off its own file location at
`scripts/skill_advisor.py:246` and never read the override, while the native resolver at
`lib/skill-graph/skill-graph-db.ts:270` honours it. One scorer could be isolated from the
local graph and its reference could not.

Under a fully isolated run the numbers were stable across four runs: 109 and 102 with seven
regressions. The investigation also measured the Python reference against the skill
metadata as committed at the pin commit and at HEAD and reported 107 at both, with the two
extra rows coming from this packet's uncommitted hub metadata edits. That figure is the
investigation's, not re-run here. What was verified here is that 112 is not produced by any
isolated run, and that the isolated number reproduces.

The two rows that join the accepted list are `rr-iter2-020`, a request to audit how
`memory_save` prompts are documented across packet docs, and `rr-iter3-146`, a read-only
review of the routing taxonomy. Both carry gold `sk-code`, both are won by the Python
reference, and both are lost by the native scorer to `sk-doc` by under 0.04.
`sk-code`'s metadata declares the phrase `review packet docs`. `sk-doc`'s nearest mode acts
on an existing document rather than assessing one. That the gold labels are right and the
scorer bleeds vocabulary is a judgment, and it is recorded as one.

### Decision

Fix both producers. `skill_advisor.py` resolves its database through the same directory
override the native resolver honours. The test pins the three regime variables before a
dynamic import of the scorer, the way its sibling suites do, so the spawned reference
inherits the same directory. Then re-pin to what the isolated regime reads: 109, 102, and
the seven-row accepted list with the two new ids in corpus order and the reason written
beside them.

### Consequences

- The suite passes twice in a row from the final tree, and the six sibling advisor suites
  still pass. A local skill-graph rebuild can no longer move the number, which is how it
  reached 112 in the first place.
- The old pin's comment said the graph could shift the number with no diff to show for it.
  That sentence is gone, because it is no longer true.
- The two knife-edge rows are recorded as accepted divergence with their margins, not
  hidden by a graph boost, so the next scorer change can be measured against them.

### Alternatives rejected

- Re-pin to 113 and 108: the next run said 114, so the pin would have been wrong within
  minutes.
- Override the database path inside the spawned Python script only: a special case for
  one caller, leaving the reference implementation ignoring a variable its counterpart
  honours, which is the seam that produced the drift.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Retire the signal the CLI hub never owned, and remove the keyword that killed sk-doc's

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, implemented |
| **Date** | 2026-09-05 |
| **Deciders** | Operator |

### Context

The Gate A re-run differs from the 2026-09-04 recording in two of 388 rows.

`spec kit runtime`, declared by `cli-external-orchestration` since the hub was renamed in
July, went from RESOLVED to WRONG_HUB: `system-spec-kit` now wins it at 0.93 against the CLI
hub at 0.467. Between the two dates spec-kit's engine was moved under `runtime/` and its
vocabulary curated, so the word is spec-kit's. The CLI hub's own boundary is dispatch to an
external executor, and a phrase naming another skill's runtime was never inside it.

`trigger_phrases`, declared by `sk-doc`, went from RESOLVED at 0.488 to NO_RECOMMENDATION
with both scorers returning nothing and no rejection reason. The investigation found the
mechanism in four steps. `system-spec-kit/SKILL.md:8` gained the keyword `trigger-phrases`
in `cf6a635703` on 2026-09-03, which reached this branch through the merge `144897ba5d`
after the sweep tree `726af58b4c` was measured. `lib/scorer/text.ts:40` expands a keyword
into its hyphen, space and underscore variants, so spec-kit acquired the explicit evidence
`author:trigger_phrases`, byte-identical to sk-doc's. Identical evidence gives identical
confidence, 0.82 each, which `lib/scorer/ambiguity.ts:33` clusters on a zero confidence gap
even though the scores differ by 0.06. `lib/scorer/fusion.ts:796` then treats a one-token
prompt as low information and, at line 808, looks for a multi-word anchor by testing
whether any evidence string contains a space. `author:trigger_phrases` has none, so both
members are floored to uncertainty 0.42, above the 0.35 gate, and the reply is empty.
Relaxing the gate to 0.45 on the live daemon shows the tied pair. `importance_tier`
survived only because spec-kit's neighbouring keyword is the plural `importance-tiers`,
whose variants do not collide.

### Decision

Retire `spec kit runtime` from both of the CLI hub's intent-signal lists. Remove
`trigger-phrases` from spec-kit's keyword line: spec-kit's own declared signal is
`trigger index`, and the field name belongs to the frontmatter mode sk-doc routes it to, so
by the phase 004 rule the losing hub's keyword goes. Rebuild the daemon, replay, and re-run
Gate A in full.

### Consequences

- After the rebuild `trigger_phrases` resolves to `sk-doc` at 0.487, `trigger phrases` is
  no longer ambiguous between the two hubs, and `trigger index` still resolves to spec-kit at
  0.70. The six advisor CI suites pass.
- Gate A after both changes reads 344 of 388. The only row still differing from the
  2026-09-04 recording is `spec kit runtime`, which is the retirement itself. The full
  before-and-after runs are `research/gate-a-rerun-2026-09-05.tsv` and
  `research/gate-a-rerun-2026-09-05-after-keyword-fix.tsv`.
- The CLI hub's mint reported `already-exists` and the guard reports it fresh, so intent
  signals are not among the manifest's hashed inputs. The doctor check passes and derived
  freshness reports all fourteen roots fresh.
- The space-keyed anchor test at `fusion.ts:808` is a scorer rule that will trip again the
  next time two hubs declare the same underscored token. Phase 002's
  `unresolved-signal-decisions.md` already recorded it for `deep-review`. Changing that
  test is a scoring change, which D2 forbids inside this packet, and it is left as it is
  with this second instance now recorded beside the first.

### Alternatives rejected

- Add a stronger CLI-hub phrasing so the hub wins the runtime phrase back: deciding a
  collision by preference rather than by the losing hub's written boundary.
- Make the anchor test count tokens instead of looking for a space: a scorer change with a
  blast radius across every abstention, and D2 forbids it here.
- Redeclare `trigger_phrases` as `trigger phrases` only: the spaced form already resolved,
  and dropping the declared form would have hidden the collision instead of finding it.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The strict validator does not read bracketed template text

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, recorded with owner `system-spec-kit` |
| **Date** | 2026-09-05 |
| **Deciders** | Operator |

### Context

The parent `spec.md` of this packet validated strict with 69 bracket placeholders in it,
and phase 007's with 50. `check-placeholders.sh` counted them. `validate.sh --strict`
reported `PLACEHOLDER_FILLED` as passing.

The mechanism is at `runtime/lib/validation/orchestrator.ts:631`. The rule's pattern
matches exactly four marker forms, `<YOUR_VALUE_HERE:`, `[YOUR_VALUE_HERE:`,
`[NEEDS_CLARIFICATION:` and `[NEEDS CLARIFICATION:`, and its comment says it mirrors the
shell checker. It does not: the shell checker also counts the bracketed template text a
scaffold seeds, such as `[Requirement description]`, and that is what the parent carried.
Two more rules compound it. `AC_CLOSURE` reports itself inactive below Level 2 on a Level
3 phase parent, and `AC_COVERAGE` is advisory, so acceptance rows with no `file:line`
citation reduce the run to a warning rather than a failure.

### Decision

Record it here with the mechanism, and fill the documents by hand, which this phase did.
Widening the validator's pattern to what the shell checker counts is a fleet gate change:
every packet in `specs/` that still carries scaffold text would start failing strict
validation on the next run. That blast radius is the operator's to accept, not this
packet's, and the change belongs to `system-spec-kit`. Register row 44 carries it as
Planned with that owner.

### Consequences

- Until the rule reads what the checker reads, a completion claim on any packet should
  run `check-placeholders.sh` beside `validate.sh`. The parent roadmap says so under its
  dependencies.
- The acceptance rows of this phase now carry `file:line` citations in the form the
  coverage rule parses, so the advisory reads at floor for this folder.

### Alternatives rejected

- Widen the pattern in this phase: a change to a gate every packet passes through, made
  from inside a routing packet, with no measurement of how many packets it would fail.
<!-- /ANCHOR:adr-004 -->
