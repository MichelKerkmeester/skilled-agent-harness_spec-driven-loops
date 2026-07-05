---
title: "TV-002: should it be Transform Frame Routes Audit"
description: "Verify should-it-be transform questions resolve to audit rather than interface."
version: 1.0.0.0
---

# TV-002: should it be Transform Frame Routes Audit

## 1. OVERVIEW

This scenario verifies the audit side of `transformVerbRouting`: questions framed as `should it be` resolve to `audit` because they ask whether a design move is appropriate.

## 2. SCENARIO CONTRACT

**Realistic user request**: A product designer wants a critique before changing the visual direction.

**Prompt variants**:

| Variant | Exact Prompt | Expected Mode |
|---|---|---|
| V1 | `Should it be bolder, or is the current hierarchy already strong enough?` | `audit` |
| V2 | `Should it be quieter, or would that reduce conversion clarity?` | `audit` |
| V3 | `Should it be distill the interface to fewer elements before launch?` | `audit` |
| V4 | `Should it be delight users more, or would that feel gratuitous?` | `audit` |

**Expected mode resolution**: `audit` for every variant.

**Why**:
- `mode-registry.json` sets `transformVerbRouting.auditFrame` to `should it be`.
- `hub-router.json` maps `audit-transform-question` keywords including `should it be`, `should it be bolder`, `should it be quieter`, `should it be distill`, and `should it be delight` to `audit`.
- `mode-registry.json` note says transform verbs split by framing: audit asks whether the move should happen; interface applies the requested move.

**Expected packet loaded**:
- `design-audit/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md`
- `shared/context_loading_contract.md`

**Expected mode resources loaded or cited**:
- `design-audit/references/corpus_map.md`
- `design-audit/references/audit_contract.md`
- `design-audit/references/critique_hardening.md`
- `design-audit/references/transform_remediation.md`
- `design-audit/assets/audit_report_template.md`

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` contains `auditFrame: should it be`.
2. `hub-router.json` contains the `audit-transform-question` vocabulary class.

### Exact Command Sequence

1. Run an advisor probe for every variant and append to `/tmp/skd-TV002-advisor-results.jsonl`.
2. Invoke the orchestrator for every variant and save responses under `/tmp/skd-TV002/`.
3. Record resolved mode, loaded packet, and whether the response evaluates the move before recommending changes.

### Pass/Fail Criteria

- **PASS** iff all variants resolve `audit`, load `design-audit/SKILL.md`, and answer as critique or evaluation.
- **FAIL** iff any variant resolves `interface` and applies the move without the audit decision step.

### Failure Triage

1. If `interface` wins, inspect whether the router checks `auditFrame` before applying interface aliases.
2. If `transform_remediation.md` is missing, inspect `design-audit/SKILL.md` `RESOURCE_MAP.TRANSFORM_REMEDIATION`.
3. If advisor loses, inspect sk-design advisor signals for design-review and transform-question wording.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-audit/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
