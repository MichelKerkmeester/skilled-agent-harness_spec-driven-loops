---
title: "Acceptance Criteria: Phase 3: plain-chat-command-reach"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "plain chat command reach acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-plain-chat-command-reach"
    last_updated_at: "2026-11-12T12:27:36Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-plain-chat-command-reach"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: plain-chat-command-reach

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach`
**Level:** 3+
**Status:** In Progress
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the extended harness and an empty `MODE_COMMANDS`, When it re-captures before any scorer change, Then the existing keys are byte-identical to the saved baseline and attached reach is 0 on both splits | The neutral half held: the harness worker's `diff` of `{rows,metrics,commands,unreachable}` against `$S/baseline-before.json` printed nothing (`scratch/logs/w8.out`). The other half did not: attached reach read 7 on tune at that run, not 0, because a parallel worker had already filled `MODE_COMMANDS` | Unmet | - |
| AC-002 | REQ-002 | Given the attach function, When it gets a single-target `route` with a known mode, a `multi` route and an `ask` route, Then it returns the command for the first and nothing for the others, and the handler and the harness both call it | The rule holds when run by hand: single route gives `/create:readme`, `multi` and `ask` give `undefined`. `rg` finds `attachCommand` in the handler and the harness. `tests/command-attach.vitest.ts` covers the route rows, and the final suite passed: 165 files, 1,410 passed, 8 skipped, exit 0 | Met | - |
| AC-003 | REQ-003 | Given the three hub registries, When the deriver runs, Then `MODE_COMMANDS` holds 19 commands and a hand edit makes `--check` print `stale` | `scratch/logs/w7.out`: the block holds 19 commands, a hand edit made `--check` print `stale` and exit 1, and a regenerate brought back `fresh` | Met | - |
| AC-004 | REQ-004 | Given `create a readme for the utils folder`, When `advisor_recommend` runs, Then `sk-doc` carries `command` `/create:readme` and the schema accepts a recommendation with and without the field | `skill-advisor.cjs advisor_recommend` on the prompt returned `sk-doc` with `command` `/create:readme`. The case `accepts a named command on a recommendation and refuses an empty one` in `tests/command-attach.vitest.ts` parses the schema with and without the field, and the final suite passed | Met | - |
| AC-005 | REQ-005 | Given a stubbed CLI result with `command`, When the hook builds its recommendation, Then the field survives, and the hook no longer sends `includeCompiledRoute: false` | The hook sends `includeCompiledRoute: true` with `compiledRouteTopOnly: true` (`skill-advisor-cli-fallback.ts:241`). The case `carries the command a recommendation names through to the hook result` in `tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` passes a stubbed `command` through `resultFromCliData` and drops a blank one. The final suite passed | Met | - |
| AC-006 | REQ-006 | Given the hand-authored phrases, When the deriver regenerates, Then the 8 non-hub commands each have one row active in both scorers | `jq` over the generated file lists the 8 `/speckit` and `/prompt` command rows with `typescript` and `python` both enabled. Both metadata files print `true` for more than one phrase per command | Met | - |
| AC-007 | REQ-007 | Given all changes, When the capture runs, Then plain reach is above 0 of 44 on tune and on holdout, shown as own-row, attached and combined against the ceiling 44 with the doctor rows on their own line | `command-routing-baseline.json` after today's later fixes: combined plain reach on tune 9 of 45 (own 2, attached 7), on holdout 0 of 44, against the ceiling of the split size. Doctor 0 of 17 on tune. The holdout half is waived by ADR-016. Phase 004 carries it and measured 2 of 44 with real embeddings | Waived | ADR-016 |
| AC-008 | REQ-008 | Given all changes, When the capture runs, Then false offers are 0 of 35 and no `d3-plain` row is offered | `$S/after.json`: `false_offer` `{"count":0,"total":35}`, `false_offer_attached` 0 of 35, and no `mns-d3-*` row is offered | Met | - |
| AC-009 | REQ-009 | Given all changes, When the pinned capture runs, Then the four numbers are no worse than 158, 50, 20 and 5 | `capture-scorer-eval-baseline.mjs` printed `[159,50,20,5]` in the final state, against `[158,50,20,5]` at the phase 1 baseline | Met | - |
| AC-010 | REQ-010 | Given every typed row, When it is scored, Then none is ambiguous with its own owner, and `/speckit:plan add a login page` is not ambiguous | `typed_same_owner_ambiguous` in `$S/after.json` lists one row, `cmd-create-agent-typed-01`, whose cluster also holds other floored skills. Eight rows were listed mid-build (`$S/after-w3b-full.json`). `/speckit:plan add a login page` now scores `ambiguous: false` | Unmet | - |
| AC-011 | REQ-011 | Given a metadata command with no compatibility row, When the deriver runs, Then the command is active, and the compatibility file holds no row for the 8 non-hub commands | Activation by construction works for the 8 standalone commands, but `scoring-compatibility.json` still lists `command-spec-kit-plan`, `-complete`, `-implement` and `-resume` in its `python` list, and the planned fixture case does not exist | Unmet | - |
| AC-012 | REQ-012 | Given the regenerated TypeScript block, When it is searched, Then `/speckit:search` alone among non-doctor rows has `readOnly: true`, and the L3 prompt reaches it | `/speckit:search` carries `readOnly: true` in `projection.ts`, and the other 15 rows with the flag are doctor rows. The L3 prompt `show me which packets mention the token cap` returns no recommendation | Unmet | - |
| AC-013 | REQ-013 | Given `save context`, When it is scored in both scorers, Then the top 3 hold at most one id for `/speckit:save` | No two active non-doctor bridge rows share a command (`jq` group-by printed `[]` for both runtimes). The review found the case that check missed, a hub attaching a command whose own row ranks in the same result. It is fixed in the handler and held by `never offers one command through both its own row and the owning hub` in `tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Met | - |
| AC-014 | REQ-014 | Given a deep-loop route, When the prompt has no depth wording, Then no `/deep:*` command attaches, and with depth wording it does | `attachCommand('system-deep-loop', research route, ...)` returned `undefined` for `what is caching` and `/deep:research` for a depth-worded prompt. `council` was replaced by `ask the council` and `convene` in `DEPTH_WORDING`, and a topic-only council question gets no command (`tests/command-attach.vitest.ts`). `/deep` attached reach on tune is 0 of 3 | Met | - |
| AC-015 | REQ-015 | Given the operator's decision of 2026-11-12 to replace the umbrella ids now, When the umbrella ids are retired and the gold lines relabelled, Then no active row and no gold label names them and each relabel is listed | The umbrella ids have no entry in the generated file. `scratch/relabel-list.txt` lists 17 relabels, and the three gold files count 0 umbrella labels. Pinned numbers before the relabel `[159,49,20,5]`, after `[159,50,20,5]` | Met | - |
| AC-016 | REQ-016 | Given the timing script, When it runs before and after, Then both medians and p95 values are in `implementation-summary.md` | One run each over 44 tune prompts on a shared machine: before median 194.35 ms and p95 281.15 ms, three lookups 251.21 and 450.47 ms with the later-reverted doctor phrases in place, top-only lookup 235.04 and 318.96 ms (`scratch/hook-latency-top-only.json`) | Met | - |
| AC-017 | REQ-017 | Given all changes, When the deriver check, the suite and the metadata gate run, Then they print `fresh`, 0 failed and `failed=0` | Final state: `--check` prints `fresh`, the metadata gate prints `checked=14 passed=14 failed=0 fixed=0`, and the orchestrator reports the full suite at 165 files, 1,410 passed, 8 skipped, exit 0, with a clean typecheck | Met | - |
| AC-018 | REQ-018 | Given the new doctor phrases in `_routes.yaml`, When the route validator runs, Then it reports OK and every new phrase has three or more words | 136 phrase lines across 34 entries were added (`diff` of the committed file against `scratch/routes-with-doctor-phrases.yaml`), then reverted. `_routes.yaml` matches its committed state | Unmet | - |
| AC-019 | REQ-019 | Given the regenerated and rebuilt advisor, When the phrase reach probe, the doctor slice and the capture run, Then the probe exits 0, the slice passes and doctor tune recall at 1 is above 0 of 17 | With the phrases in place the probe and the slice passed, but doctor tune recall at 1 stayed 0 of 17 and holdout 0 of 17 (`$S/doctor-after.json`) | Unmet | - |
| AC-020 | REQ-020 | Given the new `/doctor:helper` phrases, When the capture runs, Then the doctor rows of other commands with `command-doctor-helper` on top number 7 or fewer | With the phrases, 11 rows of other commands had `command-doctor-helper` on top, one of them a non-doctor row (`cmd-create-skill-parent-plain-tune-01`), against the guard of 7. Before the doctor work 6, after the revert 7 | Unmet | - |
| AC-021 | REQ-021 | Given all changes, When the scorer diff is searched, Then no lane, boost or penalty changed for a doctor command | The literal check prints matches: the doctor-only phrase gate `requireDoctorPhraseAnchor` was widened to every command row as `requireCommandPhraseAnchor` (`fusion.ts:847`). No doctor weight changed. The operator judges whether that meets the requirement | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
**Closeable:** No

AC-007 is waived by ADR-016. AC-001, AC-010, AC-011, AC-012, AC-018, AC-019, AC-020 and AC-021 are still unmet and no decision record waives them.
<!-- /ANCHOR:closure -->
