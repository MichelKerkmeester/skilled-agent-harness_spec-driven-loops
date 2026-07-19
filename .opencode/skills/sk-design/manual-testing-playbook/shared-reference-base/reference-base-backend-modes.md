---
title: "SR-002: Reference-Base Backend Modes"
description: "Verify foundations, motion, and audit modes use backendKind reference-base and cite shared resources."
version: 1.0.0.0
id: SR-002
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# SR-002: Reference-Base Backend Modes

## 1. OVERVIEW

This scenario verifies that non-md-generator design modes use `backendKind: reference-base` and cite shared references rather than owning duplicated family vocabulary.

## 2. SCENARIO CONTRACT

**Probe set**:

| Probe | Exact Prompt | Expected Mode | Expected Shared Resource |
|---|---|---|---|
| P1 | `Create a responsive spacing system and token starter for this product dashboard.` | `foundations` | `shared/register.md` |
| P2 | `Design the motion budget and reduced-motion alternative for this onboarding flow.` | `motion` | `shared/register.md` |
| P3 | `Audit this page for design slop and give severity-ranked findings.` | `audit` | `shared/register.md` |

**Expected mode resolution**:
- P1: `foundations`
- P2: `motion`
- P3: `audit`

**Why**:
- `mode-registry.json` sets `backendKind: reference-base` for `interface`, `foundations`, `motion`, and `audit`.
- `mode-registry.json` sets `backendKind: playwright-extract` only for `md-generator`.
- The mode packets each cite `../shared/register.md` for family-level posture or severity calibration.

**Expected packets loaded**:
- P1: `design-foundations/SKILL.md`
- P2: `design-motion/SKILL.md`
- P3: `design-audit/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md` for all probes
- `shared/context-loading-contract.md` for P1 when build or UI handoff is discussed
- `shared/context-loading-contract.md` for P3 when audit/readiness claims are made
- `shared/sk-code-handoff.md` only when handoff to implementation is discussed

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80` for all probes.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` lists `backendKind: reference-base` for the three tested modes.
2. The three mode packets still cite `../shared/register.md`.

### Exact Command Sequence

1. Run advisor probes and append output to `/tmp/skd-SR002-advisor-results.jsonl`.
2. Invoke the orchestrator for every prompt and save responses under `/tmp/skd-SR002/`.
3. Record mode, backendKind, packet, and shared resources per probe.

### Pass/Fail Criteria

- **PASS** iff every probe resolves the expected mode, identifies `backendKind: reference-base`, loads the expected packet, and cites `shared/register.md`.
- **FAIL** iff md-generator handles a reference-base prompt, a tested mode omits `shared/register.md`, or any tested read-only mode uses Write/Edit/Bash.

### Failure Triage

1. If md-generator wins, inspect whether the prompt was changed to include `DESIGN.md`, extraction, or a URL.
2. If shared register is missing, inspect each mode packet's Resource Loading Levels.
3. If mutating tools are used, compare the run with the registry `toolSurface` for the resolved mode.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/shared/register.md`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
