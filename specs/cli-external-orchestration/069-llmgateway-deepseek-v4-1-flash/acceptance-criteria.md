---
title: "Acceptance Criteria: The DevPass DeepSeek route moves to V4.1 Flash"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash"
    last_updated_at: "2026-09-11T09:00:00Z"
    last_updated_by: "implementer"
    recent_action: "Reopened by operator instruction; opencode-go verified and moved, cline-pass recorded listing-only"
    next_safe_action: "Operator: one pi turn on opencode-go/deepseek-v4.1-flash, then re-run the cline-pass round-trips after the monthly quota window resets"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-llmgateway-deepseek-v41"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: The DevPass DeepSeek route moves to V4.1 Flash

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the repository, When it is scanned for the retired gateway id outside changelogs, Then nothing matches | Scan over `.opencode` and `.pi` returned no hit; the only surviving instance is the OpenRouter-prefixed literal, a different route | Met | - |
| AC-002 | REQ-002 | Given the fan-out script, When its cli-pi default is read, Then it names the live gateway id | `fanout-run.cjs:2099` reads `const PI_DEFAULT_MODEL = 'deepseek-v4.1-flash';` | Met | - |
| AC-003 | REQ-002 | Given the provider map, When the bare literal is looked up, Then it maps to the gateway | `fanout-run.cjs:2285` reads `['deepseek-v4.1-flash', 'llmgateway']` | Met | - |
| AC-004 | REQ-002 | Given the effort pin, When the new literal is tested, Then it matches | `lib/deep-loop/executor-config.ts:243` carries the widened pattern, and `tests/unit/executor-config.vitest.ts:861` asserts the new literal pins; the suite passes | Met | - |
| AC-005 | REQ-002 | Given the source of record, When its allowlist and default are read, Then they agree with the script | `lib/deep-loop/executor-config.ts:189` allowlist and `:214` default, with the pin pattern at `:243` | Met | - |
| AC-006 | REQ-003 | Given the roster's route claim, When the gateway is called, Then the bare id returns `200` and the retired id returns `410` | Live calls: `deepseek-v4.1-flash` → `200` with upstream `deepseek/deepseek-v4.1-flash`; `deepseek-v4-flash-vision-exp` → `410 "has been deactivated and is no longer available"` | Met | - |
| AC-007 | REQ-003 | Given the roster's id-shape claim, When a prefixed id is sent, Then it returns `400` naming the id | Live call: `400 "Provider llmgateway does not support model deepseek-v4.1-flash"` | Met | - |
| AC-008 | REQ-003 | Given the roster's effort claim, When the provider documentation is read, Then the roster carries the documented ladder | DeepSeek's thinking-mode guide gives the mapping: `none` off, `minimal`/`low` to low, `medium`/`high`/`xhigh` to high, `max` to max, default `high`. Both rosters carry it. This route additionally refuses `ultra` and every integer, each `Invalid request parameters` | Met | - |
| AC-009 | REQ-003 | Given the roster's cost and size claims, When the gateway listing is read, Then they match | Listing gives context 1,050,000, max output 393,216, $0.15 in, $0.60 out, $0.003 cached read per million tokens; `.pi/models.json` and both rosters carry these | Met | - |
| AC-010 | REQ-004 | Given the final state, When both deep-loop suites run, Then they pass | `fanout-run.vitest.ts` and `executor-config.vitest.ts` together: 213 tests, 213 pass, 0 fail | Met | - |
| AC-011 | REQ-004 | Given the whole repository, When the frontmatter gate runs, Then it exits zero | `check-frontmatter-versions.sh` over 2,961 files: `ok=2949 skip-no-frontmatter=12`, exit 0 | Met | - |
| AC-012 | REQ-005 | Given each skill, When its changelog is listed, Then a new entry describes the break and the replacement | `cli-pi/changelog/v1.5.2.0.md:1` and `cli-opencode/changelog/v1.4.5.0.md:1`, with `cli-pi/SKILL.md:5` and `cli-opencode/SKILL.md:5` carrying the matching anchors | Met | - |
| AC-013 | REQ-001 | Given the sibling routes, When they are read after the change, Then they are untouched | **Superseded 2026-09-11.** It held for the first pass, and the file references below are still accurate for that pass — but the operator then reopened both DeepSeek sibling routes, so the current state deliberately contradicts this row | Superseded | ADR-001 |
| AC-014 | REQ-006 | Given the `opencode-go` route, When a live turn is dispatched at the pinned effort, Then it returns a reply | `opencode run --model opencode-go/deepseek-v4.1-flash --variant max` returned its token, exit 0, cost $0.0012, on 2026-09-11 | Met | - |
| AC-015 | REQ-006 | Given the id it replaces, When the catalog records are compared, Then cost, context, output ceiling, image input and effort variants all match | Both record $0.15 in / $0.60 out per 1M with $0.003 cached reads, 1M context, 384K output, `images: yes` and variants `low`/`high`/`max`. Nothing is traded by the move | Met | - |
| AC-016 | REQ-008 | Given the refreshed Pi catalog, When the model list is read, Then the new id appears with its image support | `pi update --models`, then `pi --list-models`: `opencode-go  deepseek-v4.1-flash  1M  384K  thinking yes  images yes` | Met | - |
| AC-017 | REQ-007 | Given the `cline-pass` row, When it is read, Then it claims no dispatch verification and names both its blocker and its fallback | The row reads "Listing-only — no dispatch has been recorded for this id", names the `429 "You have reached your monthly Clinepass limit"` block, and names `cline-pass/cline-pass/deepseek-v4-flash` as the fallback | Met | - |
| AC-018 | REQ-007 | Given the Cline block, When the failure is attributed, Then the previously verified id fails identically, so the block is the account and not the new id | Every attempt on 2026-09-11 returned the same `429`, including the V4-Flash id live-verified 2026-08-18. The V4.1 attempts additionally produced no stream entry at all, which is what separates a catalog miss from the quota block rather than conflating them | Met | - |
| AC-019 | REQ-009 | Given each skill, When its second changelog entry is read, Then it states which route was verified and which was not | `cli-pi/changelog/v1.5.3.0.md` and `cli-opencode/changelog/v1.4.6.0.md` each carry a verification section that separates the dispatch-verified `opencode-go` route from the listing-only `cline-pass` one | Met | - |
| AC-020 | REQ-004, REQ-009 | Given the final state, When both suites and the frontmatter gate run, Then they pass | `fanout-run.vitest.ts` + `executor-config.vitest.ts`: 213 tests, 213 pass, 0 fail. `check-frontmatter-versions.sh`: 2,894 files, ok=2,880, skip-no-frontmatter=14, exit 0 | Met | - |
| AC-021 | REQ-007 | Given the two deferred live gates, When their status is read, Then they are named with an owner rather than silently passed | The pi-side turn on the new id is owned by the operator, because the dispatch-authorization hook denies a cli-pi self-dispatch from inside a pi session; the `cline-pass` turn waits on the quota window. Both are recorded in `tasks.md` and in the changelogs | Met | - |

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

**Closeable:** No — two live gates are deferred by design.

AC-006 carried the first pass, and AC-014 carries the second. Between them they are the only reason this
work exists: a listing would have shown the retired gateway id missing, but only a call returns the `410`
that proves every defaulted fan-out was reaching a dead route — and on the sibling route only a call proves
the replacement actually answers.

AC-013 is superseded rather than deleted, and the distinction matters. It was true when it was written: the
first pass moved exactly one literal and left three lookalikes alone, which is what the one-literal-one-provider
rule demanded. The operator then reversed that scope, so the row is now a record of a decision that was
correctly made and correctly overturned, not of an error. ADR-001 carries the reversal.

The second pass produced the sharper lesson. The operator's premise — "cline and opencode go both support it
already" — was half right, and the two halves failed in different ways. `opencode-go` was straightforwardly
verified and is a like-for-like swap. `cline-pass` had a *listing* from Cline's own API and nothing else: the
id is not in models.dev, so it dies at resolution, and the account's quota answers `429` for every Cline model,
including the one that worked in August. Calling that verified because the upstream catalog lists it would
have been the same mistake as trusting a listing for the gateway. AC-018 exists specifically because a single
failing id cannot be attributed; the known-good control is what makes the `429` the account's fault rather than
the new id's.

AC-020's gate counts differ from AC-011's, and the reason is benign: the repository grew and changed between
the two runs, so the totals moved. The exit code is the criterion, and it is still zero.

One thing is left open rather than closed. The fan-out still maps two OpenRouter literals to a provider the
operator says is not in use. An earlier packet left them deliberately, calling them the deep-loop runtime's
contract rather than either skill's, and that judgment is not this packet's to overturn — the same judgment
that governed the sibling routes until the operator overrode it.

Three rows sit below the evidence floor on purpose. AC-001, AC-006 and AC-007 are proved by a live HTTP status code, and no line in this tree shows a gateway answering `410`. Pointing them at a file would satisfy the counter without adding proof.

AC-008 was first closed on a wrong finding and is worth reading for that reason. A status-code probe of five effort strings returned `200` for all of them, and that was written up as proof that the route accepts anything and therefore has no readable ladder. It proved no such thing: every string probed happened to be valid. A later probe of `banana` and of `ultra` returned `Invalid request parameters`, so the route validates, and the provider documentation carries a real three-level ladder. Generalising from a sample that contained no negative case is the error to avoid here, and a single deliberately-invalid probe would have caught it immediately.

One thing is left open rather than closed. The fan-out still maps two OpenRouter literals to a provider the operator says is not in use. An earlier packet left them deliberately, calling them the deep-loop runtime's contract rather than either skill's, and that judgment is not this packet's to overturn.
<!-- /ANCHOR:closure -->
