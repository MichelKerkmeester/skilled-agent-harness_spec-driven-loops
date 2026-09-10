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
    last_updated_at: "2026-09-10T22:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Every criterion verified from the final state"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-llmgateway-deepseek-v41"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
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
| AC-008 | REQ-003 | Given the roster's effort claim, When every tier is probed, Then the roster says what the probe supports and no more | All five probed strings returned `200`, `medium` and `xhigh` included, so both rosters state that the ladder cannot be read off this API and record only that `max` does not error | Met | - |
| AC-009 | REQ-003 | Given the roster's cost and size claims, When the gateway listing is read, Then they match | Listing gives context 1,050,000, max output 393,216, $0.15 in, $0.60 out, $0.003 cached read per million tokens; `.pi/models.json` and both rosters carry these | Met | - |
| AC-010 | REQ-004 | Given the final state, When both deep-loop suites run, Then they pass | `fanout-run.vitest.ts` and `executor-config.vitest.ts` together: 213 tests, 213 pass, 0 fail | Met | - |
| AC-011 | REQ-004 | Given the whole repository, When the frontmatter gate runs, Then it exits zero | `check-frontmatter-versions.sh` over 2,961 files: `ok=2949 skip-no-frontmatter=12`, exit 0 | Met | - |
| AC-012 | REQ-005 | Given each skill, When its changelog is listed, Then a new entry describes the break and the replacement | `cli-pi/changelog/v1.5.2.0.md:1` and `cli-opencode/changelog/v1.4.5.0.md:1`, with `cli-pi/SKILL.md:5` and `cli-opencode/SKILL.md:5` carrying the matching anchors | Met | - |
| AC-013 | REQ-001 | Given the sibling routes, When they are read after the change, Then they are untouched | `cli-pi/references/providers-and-models.md:80` still names the opencode-go route, and `fanout-run.cjs:2295` still maps the OpenRouter literal; neither moved | Met | - |

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

**Closeable:** Yes

AC-006 and AC-013 carried the packet. The first is the only reason this work exists: a listing would have shown the retired id missing, but only a call returns the `410` that proves every defaulted fan-out was reaching a dead route. The second is the constraint that made it delicate, because four routes name almost the same model and only one was in scope.

Three rows sit below the evidence floor on purpose. AC-001, AC-006 and AC-007 are proved by a live HTTP status code, and no line in this tree shows a gateway answering `410`. Pointing them at a file would satisfy the counter without adding proof.

AC-008 is worth reading before trusting any future roster row here. The gateway answers `200` to every effort string, so the sparse ladder the old row described was never measurable from this API. Both rosters now say so rather than replacing one unverifiable claim with another.

One thing is left open rather than closed. The fan-out still maps two OpenRouter literals to a provider the operator says is not in use. An earlier packet left them deliberately, calling them the deep-loop runtime's contract rather than either skill's, and that judgment is not this packet's to overturn.
<!-- /ANCHOR:closure -->
