---
title: "SR-002: Reference-Base Backend Modes"
description: "Verify interface mode uses backendKind reference-base and cites shared resources for both its static-system and temporal/motion vocabulary, now that motion and foundations no longer exist as separate modes."
version: 1.2.0.0
id: SR-002
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# SR-002: Reference-Base Backend Modes

---

## 1. OVERVIEW

This scenario verifies that the one non-md-generator design mode, `interface`, uses `backendKind: reference-base` for every static-system, temporal/motion, and quality-review request and cites shared references rather than owning duplicated family vocabulary.

---

## 2. SCENARIO CONTRACT

**Probe set**:

| Probe | Exact Prompt | Expected Mode | Expected Shared Resource |
|---|---|---|---|
| P1 | `Create a responsive spacing system and token starter for this product dashboard.` | `sk-design-interface` | `shared/register.md` |
| P2 | `Design the motion budget and reduced-motion alternative for this onboarding flow.` | `sk-design-interface` | `shared/register.md` |
| P3 | `Audit this page for design slop and give severity-ranked findings.` | `sk-design-interface` | `shared/register.md` |

**Expected mode resolution**:
- P1: `interface`
- P2: `interface`
- P3: `interface`

**Why**:
- `mode-registry.json` sets `backendKind: reference-base` for `interface`, the only remaining doc-guidance mode after `foundations`, `audit`, and `motion` were retired as separate registry entries.
- `mode-registry.json` sets `backendKind: playwright-extract` only for `md-generator`.
- `hub-router.json` routes the `foundations-*` vocabulary classes (token/spacing/color/type/layout signals) and the `motion-*` vocabulary classes (animation/transition/reduced-motion signals) into `interface`'s `routerSignals`, and the retired `audit` capability's anti-slop/severity-ranked findings now run through `interface`'s own pre-delivery gate (`sk-design-interface/assets/interface-preflight-card.md`).
- The mode packet cites `../shared/register.md` for family-level posture or severity calibration.

**Expected packets loaded**:
- P1: `sk-design-interface/SKILL.md`
- P2: `sk-design-interface/SKILL.md`
- P3: `sk-design-interface/SKILL.md`

**Expected shared resources loaded or cited**:
- `shared/register.md` for all probes
- `shared/context-loading-contract.md` for any probe when build or readiness claims are discussed
- `shared/sk-code-handoff.md` only when handoff to implementation is discussed

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80` for all probes.

---

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` lists `backendKind: reference-base` for `interface`.
2. The `interface` mode packet still cites `../shared/register.md`.

### Exact Command Sequence

1. Run advisor probes and append output to `/tmp/skd-SR002-advisor-results.jsonl`.
2. Invoke the orchestrator for every prompt and save responses under `/tmp/skd-SR002/`.
3. Record mode, backendKind, packet, and shared resources per probe.

### Pass/Fail Criteria

- **PASS** iff every probe resolves `interface`, identifies `backendKind: reference-base`, loads `sk-design-interface/SKILL.md`, and cites `shared/register.md`.
- **FAIL** iff `md-generator` handles a reference-base prompt, the tested mode omits `shared/register.md`, or the tested read-only mode uses Write/Edit/Bash.

### Failure Triage

1. If md-generator wins, inspect whether the prompt was changed to include `DESIGN.md`, extraction, or a URL.
2. If shared register is missing, inspect `sk-design-interface/SKILL.md`'s Resource Loading Levels.
3. If mutating tools are used, compare the run with the registry `toolSurface` for the resolved mode.

---

## 4. SOURCE FILES

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design/shared/register.md`

---

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
