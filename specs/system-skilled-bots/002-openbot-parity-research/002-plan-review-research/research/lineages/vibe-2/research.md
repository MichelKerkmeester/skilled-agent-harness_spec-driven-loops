---
title: Build-Readiness Review of the Eleven Planned Phases of 003-openbot-parity-build
description: A review of the eleven phase plans against the built skilled-bots runtime, against each other, against the 002 parity synthesis, and against the failure modes a small team will meet. Findings only; no implementation.
trigger_phrases:
  - "openbot parity build readiness"
  - "eleven phase review"
  - "build readiness verdict"
importance_tier: normal
contextType: research
version: 1.0.0.0
---

# Build-Readiness Review of the Eleven Planned Phases

## 1. The Verdict

**The packet is not build-ready as written. It is build-ready after three P0 fixes and nine one-line edits.**

The build order is sound. Every real dependency edge points backwards — 008 before 011, 005 before 009, 007 before 008 — so building 001 through 011 in numeric order satisfies all of them. What blocks the build is not the order but three defects that make a phase's own Definition of Done unreachable or its central mechanism unsafe, plus nine requirement rows a builder would have to guess at.

The review recorded **52 findings: 3 P0, 31 P1, 17 P2**. Two of the three P0s are invisible to a single-phase review, which is why eleven phases written alone each passed their own.

## 2. The Three P0s

| P0 | Phase | Why it blocks | Fix |
|---|---|---|---|
| `until` is prose in the OpenBot reference and a shell command in the plan | 002 | The routine layer's central mechanism cannot work as specified, and a BOT.md can put a command in the field that the runner executes after every completed run | Split into `until` (prose) and `until_check` (command); refuse a routine with no check; add a checker invariant refusing shell metacharacters |
| The DoD requires `SCHEMA_VERSION = '2'` after 001 bumps it to `'3'` | 004 | The phase can never be marked done | Change `'2'` to `'3'` in REQ-006 and the DoD |
| The parent forbids any child from building `operators.json`; 011 builds it and REQ-005 depends on it | parent / 011 | 011's approval path depends on a file no phase may create | Give it an owner and amend the parent's Out of Scope |

## 3. The Ranked Findings

Worst first. Each row names the phase, the finding and what it blocks.

| Rank | Sev | Phase | Finding | Blocks |
|---|---|---|---|---|
| 1 | P0 | 002 | `until` prose executed as a shell command | The routine layer, and it is an injection surface |
| 2 | P0 | 004 | DoD requires `SCHEMA_VERSION = '2'` after 001 bumps to `'3'` | Phase 004 can never be done |
| 3 | P0 | parent/011 | `operators.json` is forbidden to children and built by 011 | Phase 011's approval path |
| 4 | P1 | 006 | Three of the four ladder rungs can never fire | The ladder is one rung |
| 5 | P1 | 007 | `apps:` is not an allowlist; the child's MCP config pins `UTCP_CONFIG_FILE` | The per-bot app boundary |
| 6 | P1 | 002 | The fatigue rule counts a parked run as a failure | A bot that asks questions disables itself |
| 7 | P1 | 001 | `bots answer` never checks who may answer | The small-team authority model |
| 8 | P1 | 011 | Five transports where two suffice | The largest single overbuild |
| 9 | P1 | 011 | No row in the 002 ranked build order | The phase is unsized net-new scope |
| 10 | P1 | 005/009/010 | No phase addresses prompt injection | Every prompt that carries loaded text |
| 11 | P1 | 003 | `activity.rs` re-derives a status vocabulary 001 already emits | The activity pane's correctness |
| 12 | P1 | 003 | The DoR is circular: it requires a build of the crate the phase creates | Phase 003 cannot start |
| 13 | P1 | 009 | 009 depends on 005's proposal item but names only 001 | The declared dependency graph |
| 14 | P1 | 007/008 | Two phases widen the deep-loop's `assertDispatchEnvAllowed` with no refusal test | The environment filter's security |
| 15 | P1 | 010/011 | The two message shapes disagree on every field | The terminal transport's reuse |
| 16 | P1 | 006/011 | A channel approval records no grant scope | One item, two records |
| 17 | P1 | 005/006 | Two phases add a field called `kind` to a closed `ITEM_KEYS` | The needs-you item's shape |
| 18 | P1 | 005 | A memory proposal shows no provenance | The confirmation screen's safety |
| 19 | P1 | parent | Six phases edit `.skilled/bin/bots.cjs` without its `.opencode` mirror | The mirror's byte-identity gate |
| 20 | P1 | parent | Three phases assume a two-word verb grammar `VERB_SPECS` lacks | Three verbs' parsing |
| 21 | P1 | parent | Nine phases modify `runner.ts`, `bots.cjs` and `README.md` with no serial-order rule | Any parallel build |
| 22 | P1 | parent | `buildBotPrompt` gains a positional input from three phases | Four phases' prompt tests |
| 23 | P1 | parent | `HonoredPosture` gains fields with no schema bump | A reader cannot tell absent from old |
| 24 | P1 | parent | The shared-host mode is deferred by every phase | A two-person team's queue |
| 25 | P1 | 002/007/009 | Three plans have no runnable Definition of Ready | A builder cannot check the pre-state |
| 26-40 | P2 | 001, 002, 003, 008, 009, 011, parent | Pure cost (the `secret-matcher` lift, three rakazo files, three checker invariants, `channel-queue`, `channel.ts`'s record, the CI job, the second toolchain), unstated contract (`seen/`, the four `--json` shapes, `FRONTMATTER_KEYS`, the six `state-root` folders) and stale prose (the dependency table, the parent's "ten phases") | Nothing blocks; the unstated contracts can become P1 if a builder guesses |

## 4. The Cross-Phase Conflict List

Fourteen conflicts. Three are P0, eight P1, three P2.

| # | Conflict | Documents | Resolution | Sev |
|---|---|---|---|---|
| 1 | `SCHEMA_VERSION` | 001 `spec.md:114` vs 004 `spec.md:147` | 004 says `'3'` | P0 |
| 2 | `operators.json` | parent `spec.md:94` vs 011 `spec.md:281` | Give it an owner | P0 |
| 3 | `until` | 002 `spec.md:164` vs `how-openbot-works.md:41-44` | Split prose from command | P0 |
| 4 | `ITEM_KEYS` | 001 `:146`, 005 `:116`, 006 `:94` | One transition rule; rename 005's `kind` to `itemKind` | P1 |
| 5 | `FRONTMATTER_KEYS` | 002, 005, 007, 008, 009 | One row in the parent listing the five keys | P2 |
| 6 | `state-root.ts` folders | 002, 005, 008, 009, 010, 011 | One row naming the six folders and 0700 | P2 |
| 7 | `HonoredPosture` | 001, 007, 008 | One bump, `null` default for the other | P1 |
| 8 | The actor's name | 001 `:146`, 011 `:174` | Rename 011's `sender` to `actor` | P2 |
| 9 | Message shape | 010 `:150` vs 011 `:174` | 011's shape becomes a transport envelope; one adapter | P1 |
| 10 | Status vocabulary | 001 `:143` vs 003 `:165` | 003 keys its markers by 001's group id | P1 |
| 11 | Grant scope | 006 vs 011 | 011's approval path records the scope | P1 |
| 12 | `buildBotPrompt` | 004, 005, 008, 009 | Every added input optional with a default | P1 |
| 13 | `executor-audit.ts` | 007 `plan.md:62`, 008 `plan.md:70` | One refusal acceptance row each | P1 |
| 14 | `.opencode/bin/bots.cjs` | nine phases vs three | Every phase that edits `bots.cjs` copies it | P1 |

Three of the fourteen cannot be fixed by a spec edit and need an owner decision: who owns `operators.json`, whether a routine carries a command at all, and whether a two-person shared host is in scope.

Five are one shared record with three or more writers — an accumulation rather than a disagreement, and no phase can see the final shape because each sees only its own addition. The fix for all five is one target list in the parent.

Two are an output-to-input mismatch where the consumer declares the dependency and the shapes still disagree (010→011, 001→003). These fail at the first integration run rather than at review.

Two live outside the packet, in the deep-loop's `assertDispatchEnvAllowed` and in the `.opencode` mirror, and both fail silently.

One pair that looks like a conflict is not: 003 consumes 002's `bots routines --json` unchanged and waits for 001's `inbox --json`, declared on both sides. It is the packet's only producer-consumer pair written to agree.

## 5. Parity

All eight 002 parts are covered by the eleven phases. The three gaps that remain are inside parts, not missing parts:

- **The small-team authority check.** After all eleven phases, `bots answer` still never checks who may answer.
- **The shared-host mode.** Deferred by every phase, so a two-person team cannot read the queue.
- **Prompt injection.** No phase addresses it, although memory, skill bodies and chat text all enter the prompt unfenced.

Each is a requirement inside a part the packet already builds, so closing them is three edits rather than a twelfth phase.

## 6. Overbuild

Phase 011 is the only phase whose scope can be cut by more than a third without losing a 002 item. The ranked cut list, largest saving first:

| Rank | Cut | Phase | Work removed |
|---|---|---|---|
| 1 | Four of the five transports | 011 | 4 modules, a test file's wire cases, 4 credential sets |
| 2 | `activity.rs`'s exit-code status table | 003 | 1 module, 1 test table, and the two-vocabulary mismatch |
| 3 | `channel.ts`'s message model | 011 | 1 record shape, its validator and its tests |
| 4 | `secret-matcher.ts` and REQ-013 | 008 | 1 module, 1 lifted test file, 1 notice entry |
| 5 | The `bots-tui` CI job | 003 | 1 workflow job, its toolchain cache |
| 6 | `channel-queue.ts` | 011 | 1 module and its backoff table |

Every other phase's overbuild is a single module or a single lift, and each is P2.

## 7. The Spec-Edit List

47 edits across twelve documents, grouped by the document that carries them. Three are P0 and must land first; two must land before any other because the rest are applied against them — the parent's Phase Transition Rules and 004's schema version.

Nine of the 47 are a one-line change to a requirement row and are the cheapest and highest-value: 004's version, 002's `until` split and streak exclusion, 003's marker table, 005's `itemKind` rename, 009's dependency cell, the parent's `:94` and `:100`, and 011's `seen/` sentence.

Three edits are deletions and they are the only ones that reduce work: `008-vault/spec.md:115,128,164` remove a module, its test file and its requirement. Every other edit adds a sentence, a row or a requirement.

## 8. What This Review Could Not See

- The eleven phases' `tasks.md` and `acceptance-criteria.md` were read only where a finding needed them, so a defect that lives only in a task list is missing.
- The reference repos beyond OpenBot's docs were read only where a phase cited them.
- The runtime's `tests/` were read for the shapes a plan assumes, not for coverage.
- **No phase was built.** Every "cannot pass" claim rests on reading the requirement against the runtime, not on running it.

## 9. What Was Verified Correct

- All eight "unknown verb" probes in the phase docs exit 2 as claimed.
- All `rg` pre-state probes pass against the runtime as written.
- `answer.ts` refuses a second, different answer with `item-answered-differently`, so concurrent approvals from terminal and chat are already serialized.
- `request-queue.ts`'s seen-key marker makes a redelivered chat message a duplicate rather than a second run.
- Secret-literal coverage is complete across every phase that writes text (005, 009, 010, 011).
- The build-order dependency column is sound for the ten research slices.
- `cargo 1.92.0` and `rustc 1.92.0` are installed, so phase 003's DoD is runnable here.
- `runPrecheck` signals the whole process group with SIGTERM then SIGKILL, so a hung `until` check cannot outlive the run.
- Spoofed chat users are denied by default, with a file-backed 300 s lockout that survives a restart.
- A restart loses no approval prompt: the action id, item id, channel, conversation and choices are written before the send.

## 10. Method

Thirteen iterations across four angles: plan versus runtime, cross-phase consistency, parity gaps and overbuild, and security and failure modes. Every finding names the phase, the document and line, the evidence with `[SOURCE: path:line]`, a severity and the exact spec edit. Evidence was read-only throughout: the phase docs, the built runtime under `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`, `bot-check.cjs`, the 002 parity synthesis, and the reference repos under `specs/system-skilled-bots/context/`.
