---
title: "Findings Register"
description: "Every finding this packet inherits, with the phase that owns it and its state. A finding is fixed, planned against a phase, or closed as a recorded decision. Nothing sits unowned."
trigger_phrases:
  - "findings register"
  - "who owns this finding"
  - "routing findings status"
importance_tier: "important"
contextType: "implementation"
---

# Findings Register

Forty-five findings, numbered 1 to 45. Each is fixed, owned by a phase, closed as a decision, or
superseded by another packet.

---

## 1. OVERVIEW

The session that produced these findings measured each one rather than suspecting it. This
register exists so none of them is lost between the measuring and the fixing, and so a reader
can tell at a glance which are already closed.

State means one of three things. **Fixed** was repaired and verified. **Planned** has a phase in
this packet that owns it and has not closed it. **Decision** is closed by a recorded judgment
rather than by a change, which includes a finding recorded as superseded because another packet
deletes the code it lives in.

The Evidence column carries the commit that closed a row and, where a check could be re-run
from the current tree, the date it was re-run. A dash means the row was not re-derived here:
rows 1 to 11 and 31 to 37 belong to phases 001, 002, 003 and 007, and their evidence stays
with those phases rather than being asserted from this document.

---

## 2. ROUTING

| # | Finding | Phase | State | Evidence |
|---|---|---|---|---|
| 1 | Two scorers disagree on roughly a third of prompts, and nobody had established which one routes | 001 | Fixed | - |
| 2 | A confidence of 0.8200 is a floor rather than a score | 001 | Fixed | - |
| 3 | Ranking is not by the score field, and re-sorting by it inflated one hub from 7 to 44 | 001, 002 | Fixed | - |
| 4 | Gate A stands at 234 of 444 declared signals across five hubs | 002 | Planned | - |
| 5 | One hub resolves 7 of its 115 signals and had never been measured | 002 | Planned | - |
| 6 | Seventy-three signals reach their hub and are then dropped | 002 | Planned | - |
| 7 | Fifty-nine signals surface no recommendation at all | 002 | Planned | - |
| 8 | Six signals name several modes at once | 002 | Planned | - |
| 9 | Gate B stands at 8 of 180 realistic phrasings | 003 | Planned | - |
| 10 | The semantic lane is weighted 0.05 and has five of fourteen skill nodes without a vector | 003 | Decision | Out of scope here by D2 and planned in `specs/system-skill-advisor/023-semantic-lane-enablement` (`c0ab5103fd`), which corrected the premise: the lane is live rather than shadow-only and nine nodes already carry a vector. |
| 11 | Two modes route by command surface and cannot be reached through a prompt | 003 | Fixed | - |
| 12 | Duplicate uncompiled entries under bare executor names outrank their compiled routes | 004 | Fixed | `08eb67a0de` changed the run-time override to lift the hub. Re-verified 2026-09-02: six bare executor names return `cli-external-orchestration` at rank one with a compiled route, and no routeless bare-name entry appears |
| 13 | One hub takes fourteen rows it does not own, from outside the measured five | 004 | Planned | Not attempted, per `004-cross-hub-vocabulary/implementation-summary.md` |
| 14 | Surface vocabulary bundling takes rows belonging to three other hubs | 004 | Planned | Not attempted, per `004-cross-hub-vocabulary/implementation-summary.md` |
| 15 | The skill-creation intent loses to the code hub when phrased with a product name | 004 | Planned | Not attempted, per `004-cross-hub-vocabulary/implementation-summary.md` |
| 16 | Bare single-word tokens let one hub swallow another hub's core purpose | 004 | Fixed | `f8c2595ce0` qualified the three tokens |
| 17 | Stage-one signals existed with no stage-two class to resolve to | 004 | Fixed | `461ef9261f` gave four of the five a class |
| 18 | The benchmark mode reached its hub and resolved to nothing | 004 | Fixed | `461ef9261f` |
| 41 | `spec kit runtime` declared by the CLI hub is won by `system-spec-kit` at 0.93 once the spec-kit engine moved under `runtime/` | 008 | Fixed | Retired from both intent-signal lists on 2026-09-05; mint `already-exists`, guard fresh, live replay `system-spec-kit` first and `delegate to opencode` still on the CLI hub. `008-drift-after-closure/decision-record.md` ADR-003 |
| 42 | `trigger_phrases`, declared by `sk-doc` and resolved at 0.488 on 2026-09-04, returns nothing from both scorers on 2026-09-05 with no rejection reason and no change to the hub's metadata | 008 | Planned | Owner `system-skill-advisor`. `importance_tier` and `contextType` beside it still resolve. ADR-003 in phase 008 holds the evidence; a sweep of every underscored declared signal is the first step |
| 43 | The Python and TypeScript parity pin reads three different numbers in one session, 113/108, 114/108 and 114/107 with two added regressions under an empty database directory, because the Python reference loads the daemon's local skill graph | 008 | Planned | Owner `system-skill-advisor`. Not in CI. Left unedited by D2; ADR-002 in phase 008 records all three readings and the two row ids |

---

## 3. HUB SURFACES

| # | Finding | Phase | State | Evidence |
|---|---|---|---|---|
| 19 | The inventory intent claims completeness and lists 128 of 252 leaves | 005 | Fixed | `98a327edf9` completed `ROUTER.md` FULL_INVENTORY to 252 leaves |
| 20 | The hub manifest reports a mode as commandless while its command ships in five runtimes | 005 | Fixed | `08eb67a0de` restored the row. Re-verified 2026-09-02: `.opencode/skills/sk-doc/SKILL.md:35` carries `/create:diff` rather than a dash |
| 21 | The readme summary and its frontmatter describe a smaller hub than the one shipping | 005 | Fixed | `98a327edf9` rewrote the description inside its budget |
| 22 | Five modes were absent from the hub readme while present in every registry | 005 | Fixed | `98a327edf9` |
| 23 | Twelve link labels named paths they did not point at | 005 | Fixed | `98a327edf9` |
| 24 | A hub leaf manifest had gone stale, leaving a new reference unreachable | 005 | Fixed | `98a327edf9` |
| 25 | A contract in the hub manifest is not honoured by two packets | 005 | Fixed | `08eb67a0de` added the keyword-triggers line to both packets. Re-verified 2026-09-02: `sk-create-frontmatter/SKILL.md:36` and `sk-create-repo-rule/SKILL.md:36` each carry one. The phase summary still records this row as Planned, which this entry supersedes |

---

## 4. VALIDATORS AND TEMPLATES

| # | Finding | Phase | State | Evidence |
|---|---|---|---|---|
| 26 | Twenty-four of forty templates hide voice blockers inside their own fenced payload | 006 | Planned | Re-measured at 45 of 53 across the fleet once the payload is scanned (`d229b0a24d`). Rewriting a payload changes what a template emits, so the backlog is a decision per template and sits on the packet roadmap |
| 27 | The document validator blocks on scanner fixtures the packaging gate already exempts | 006 | Fixed | `d229b0a24d` moved the packaging gate's exemption into the validator. Re-verified 2026-09-02: `validate_document.py` exits 0 on both voice fixtures |
| 28 | Forty-eight planning documents carry boilerplate from a template since corrected | 006 | Fixed | `d229b0a24d` rewrote fifty-six documents, not forty-eight. Re-verified 2026-09-02: one match remains across `specs/`, the acceptance criterion that quotes the retired sentence |
| 29 | A rule template emitted a banned character on the line its contract called verbatim | 006 | Fixed | `c1b3b780c3` corrected the template, and all nine shipped rules already used the other form |
| 30 | Sixteen documents lacked the overview section the validator requires | 006 | Fixed | `d87e8dd162` fixed fourteen and left two scanner fixtures under the exemption |
| 44 | The spec validator reported `PLACEHOLDER_FILLED` passing on a parent `spec.md` carrying 69 bracket placeholders, and `AC_CLOSURE` inactive below Level 2 on a Level 3 phase parent, so a closed packet with template boilerplate validated strict | 008 | Planned | Owner `system-spec-kit`. `check-placeholders.sh` counted 69 on the parent and 50 on phase 007 while `validate.sh --strict` printed `RESULT: PASSED`. The documents were filled by hand in phase 008; the rule gap is the finding |

---

## 5. SPEC KIT

| # | Finding | Phase | State | Evidence |
|---|---|---|---|---|
| 31 | The suite cannot complete: a reused worker spins and a bound kills the run | 007 | Fixed | `59a597e37d` fixed the save-path loop. Verified 2026-09-03 by a completed run: `npm run test:sharded`, 12 of 12 shards, 34m00s wall, 989 modules, no shard exited 124 |
| 32 | Roughly one hundred and fifteen failures have a signature and no mechanism | 007 | Decision | Measured at 181 rather than 115 and split by ADR-009. The 31 in surviving trees are grouped into 15 named mechanisms in `007-spec-kit-residue/implementation-summary.md`. The 150 under `mcp-server/`, plus 3 files that fail at load, are counted and attributed and left undiagnosed, because 049 deletes their subject |
| 33 | Twenty-five references to names that do not exist sit in never-typechecked tests | 007 | Decision | Measured at 48 rather than 25 and split by ADR-009. The 27 in `scripts/tests/` are fixed, 27 to 0 with total errors 496 to 469. The 21 under `mcp-server/` are recorded, along with the only lane that sees them. The absent lane over the surviving trees stays open as adjacent finding A4 |
| 34 | Five contract questions have the test and the code asserting opposite things | 007 | Decision | Recorded superseded in `007-spec-kit-residue/decision-record.md` at `82938b3e1c`: ADR-001 to ADR-004 and ADR-007 name paths under `.opencode/skills/system-spec-kit/mcp-server/`, which `specs/system-speckit/049-memory-decommission` phase 003 lists as Delete, so each carries the operator's decision text and no edit. |
| 35 | Twelve test files collected no tests at all while reporting as failures | 007 | Fixed | Owned by phase 007 |
| 36 | A launcher killed itself on a redirected stdin, under the repository's own rule | 007 | Fixed | Owned by phase 007 |
| 37 | A daemon socket path exceeded the platform limit and could never bind | 007 | Fixed | Owned by phase 007 |
| 45 | After `b4c2484696` nested the CLI workspace, the render wrapper resolved its skill root one level up, found no tsx loader, and fell into an inline renderer that writes to stdout, so every Level 3 scaffold produced no documents | 008 | Fixed | Three loader literals repointed to the skill root, landed in `743e626543` from `specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` concurrently with this phase's identical edit. `scaffold-golden-snapshots.vitest.ts` 9 of 9 from 1 failed; a scratch Level 3 packet renders eleven documents. ADR-001 in phase 008 |

---

## 6. CLOSED BY DECISION

| # | Finding | Reason |
|---|---|---|
| 10 | The semantic lane is live at 0.05 with five of fourteen nodes unembedded | Enabling it is a scoring change that would invalidate every measurement in this packet, so it needs its own decision rather than absorption here |
| 38 | The ledger lock-archival race | Closing it needs archiving to be mutually exclusive, and a mutex there inherits the staleness problem it exists to solve. Documented at the site, deliberately unfixed |
| 39 | Fleet-wide frontmatter drift of 3,542 files | The enforced gate is presence and format and it passes. The drifting command gates nothing, and a sweep would rewrite every in-scope document to quiet it |
| 40 | Voice backlogs in the thousands | A writing job rather than a substitution. Measured and left, since folding it in would bury the routing work |

---

## 7. CHECKS ADDED

A finding is only closed for good once something notices its return. These are the checks
this packet added, each shown to fail before it was trusted.

| Check | Catches | Proven to fail on |
|-------|---------|-------------------|
| Command column, invariant 6c in the hub parent check | A mode whose declared command is hidden in the hub table | The dash form, a wrong command string, and a deleted row |
| Template payload scanning in the voice scanner | A banned character inside the fenced block a template emits | A probe template carrying a seeded character, which passes once the character is removed |
| Fixture-tree exemption in the document validator | A gate that blocks on bytes another gate already exempts | Both voice fixtures, which now exit 0 under the same reason the packaging gate gives |
