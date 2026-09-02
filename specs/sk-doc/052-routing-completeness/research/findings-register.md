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

Thirty-two findings. Each is fixed, owned by a phase, or closed as a decision.

---

## 1. OVERVIEW

The session that produced these findings measured each one rather than suspecting it. This
register exists so none of them is lost between the measuring and the fixing, and so a reader
can tell at a glance which are already closed.

State means one of three things. **Fixed** was repaired and verified during the session that
found it. **Planned** has a phase in this packet that owns it. **Decision** is closed by a
recorded judgment rather than by a change.

---

## 2. ROUTING

| # | Finding | Phase | State |
|---|---|---|---|
| 1 | Two scorers disagree on roughly a third of prompts, and nobody had established which one routes | 001 | Fixed |
| 2 | A confidence of 0.8200 is a floor rather than a score | 001 | Fixed |
| 3 | Ranking is not by the score field, and re-sorting by it inflated one hub from 7 to 44 | 001, 002 | Fixed |
| 4 | Gate A stands at 234 of 444 declared signals across five hubs | 002 | Planned |
| 5 | One hub resolves 7 of its 115 signals and had never been measured | 002 | Planned |
| 6 | Seventy-three signals reach their hub and are then dropped | 002 | Planned |
| 7 | Fifty-nine signals surface no recommendation at all | 002 | Planned |
| 8 | Six signals name several modes at once | 002 | Planned |
| 9 | Gate B stands at 8 of 180 realistic phrasings | 003 | Planned |
| 10 | The semantic lane is weighted 0.05, shadow-only, and has zero embeddings | 003 | Decision |
| 11 | Two modes route by command surface and cannot be reached through a prompt | 003 | Planned |
| 12 | Duplicate uncompiled entries under bare executor names outrank their compiled routes | 004 | Planned |
| 13 | One hub takes fourteen rows it does not own, from outside the measured five | 004 | Planned |
| 14 | Surface vocabulary bundling takes rows belonging to three other hubs | 004 | Planned |
| 15 | The skill-creation intent loses to the code hub when phrased with a product name | 004 | Planned |
| 16 | Bare single-word tokens let one hub swallow another hub's core purpose | 004 | Fixed |
| 17 | Stage-one signals existed with no stage-two class to resolve to | 004 | Fixed |
| 18 | The benchmark mode reached its hub and resolved to nothing | 004 | Fixed |

---

## 3. HUB SURFACES

| # | Finding | Phase | State |
|---|---|---|---|
| 19 | The inventory intent claims completeness and lists 128 of 252 leaves | 005 | Planned |
| 20 | The hub manifest reports a mode as commandless while its command ships in five runtimes | 005 | Planned |
| 21 | The readme summary and its frontmatter describe a smaller hub than the one shipping | 005 | Planned |
| 22 | Five modes were absent from the hub readme while present in every registry | 005 | Fixed |
| 23 | Twelve link labels named paths they did not point at | 005 | Fixed |
| 24 | A hub leaf manifest had gone stale, leaving a new reference unreachable | 005 | Fixed |
| 25 | A contract in the hub manifest is not honoured by two packets | 005 | Planned |

---

## 4. VALIDATORS AND TEMPLATES

| # | Finding | Phase | State |
|---|---|---|---|
| 26 | Twenty-four of forty templates hide voice blockers inside their own fenced payload | 006 | Planned |
| 27 | The document validator blocks on scanner fixtures the packaging gate already exempts | 006 | Planned |
| 28 | Forty-eight planning documents carry boilerplate from a template since corrected | 006 | Planned |
| 29 | A rule template emitted a banned character on the line its contract called verbatim | 006 | Fixed |
| 30 | Sixteen documents lacked the overview section the validator requires | 006 | Fixed |

---

## 5. SPEC KIT

| # | Finding | Phase | State |
|---|---|---|---|
| 31 | The suite cannot complete: a reused worker spins and a bound kills the run | 007 | Planned |
| 32 | Roughly one hundred and fifteen failures have a signature and no mechanism | 007 | Planned |
| 33 | Twenty-five references to names that do not exist sit in never-typechecked tests | 007 | Planned |
| 34 | Five contract questions have the test and the code asserting opposite things | 007 | Planned |
| 35 | Twelve test files collected no tests at all while reporting as failures | 007 | Fixed |
| 36 | A launcher killed itself on a redirected stdin, under the repository's own rule | 007 | Fixed |
| 37 | A daemon socket path exceeded the platform limit and could never bind | 007 | Fixed |

---

## 6. CLOSED BY DECISION

| # | Finding | Reason |
|---|---|---|
| 10 | The semantic lane is off and unpopulated | Enabling it is a scoring change that would invalidate every measurement in this packet, so it needs its own decision rather than absorption here |
| 38 | The ledger lock-archival race | Closing it needs archiving to be mutually exclusive, and a mutex there inherits the staleness problem it exists to solve. Documented at the site, deliberately unfixed |
| 39 | Fleet-wide frontmatter drift of 3,542 files | The enforced gate is presence and format and it passes. The drifting command gates nothing, and a sweep would rewrite every in-scope document to quiet it |
| 40 | Voice backlogs in the thousands | A writing job rather than a substitution. Measured and left, since folding it in would bury the routing work |
