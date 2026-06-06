---
title: "232 -- Adaptive-fusion mode flag"
description: "This scenario validates Adaptive-fusion mode flag for `232`. It focuses on confirming live hybrid search honors `SPECKIT_ADAPTIVE_FUSION` while the install guide documents the operator-facing disable switch."
audited_post_018: true
phase_018_change: "Validated against phase-018 canonical continuity refactor; adaptive fusion stays live and the install-guide disable switch remains aligned with the runtime flag gate."
---

# 232 -- Adaptive-fusion mode flag

## 1. OVERVIEW

This scenario validates Adaptive-fusion mode flag for `232`. It focuses on confirming live hybrid search honors `SPECKIT_ADAPTIVE_FUSION` while the install guide documents the operator-facing disable switch.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm live hybrid search honors `SPECKIT_ADAPTIVE_FUSION` while the install guide documents the operator-facing disable switch.
- Real user request: `` Please validate Adaptive-fusion mode flag against cd .opencode/skills/system-spec-kit/mcp_server and tell me whether the expected signals are present: The targeted adaptive-fusion and hybrid-search tests pass, the live fusion path checks `isAdaptiveFusionEnabled()` before choosing adaptive weights vs fixed `fuseResultsMulti(...)`, and `INSTALL_GUIDE.md` documents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing disable switch. ``
- Prompt: `Validate adaptive-fusion mode flag against the targeted adaptive-fusion and hybrid-search checks.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: The targeted adaptive-fusion and hybrid-search tests pass, the live fusion path checks `isAdaptiveFusionEnabled()` before choosing adaptive weights vs fixed `fuseResultsMulti(...)`, and `INSTALL_GUIDE.md` documents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing disable switch
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted checks prove adaptive fusion stays flag-gated in the live runtime path and the install guide reflects the same flag-toggle guidance

---

## 3. TEST EXECUTION

### Prompt

```
As a canonical-continuity validation operator, confirm live hybrid search honors SPECKIT_ADAPTIVE_FUSION while the install guide documents the disable switch against cd .opencode/skills/system-spec-kit/mcp_server. Verify the targeted adaptive-fusion and hybrid-search tests pass, the live fusion path checks isAdaptiveFusionEnabled() before choosing adaptive weights vs fixed fuseResultsMulti(...), and INSTALL_GUIDE.md documents SPECKIT_ADAPTIVE_FUSION as an operator-facing disable switch. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server`
2. `npx vitest run tests/adaptive-fusion.vitest.ts tests/hybrid-search.vitest.ts`
3. `sed -n '1248,1312p' lib/search/hybrid-search.ts`
4. `rg -n "SPECKIT_ADAPTIVE_FUSION" INSTALL_GUIDE.md`
5. `rg -n "isAdaptiveFusionEnabled|adaptiveEnabled|adaptiveFuse|fuseResultsMulti" lib/search/hybrid-search.ts tests/adaptive-fusion.vitest.ts tests/hybrid-search.vitest.ts`

### Expected

The targeted adaptive-fusion and hybrid-search tests pass, the live fusion path checks `isAdaptiveFusionEnabled()` before choosing adaptive weights vs fixed `fuseResultsMulti(...)`, and `INSTALL_GUIDE.md` documents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing disable switch

### Evidence

Vitest transcript plus the runtime-source excerpt and the install-guide lines that still advertise the stale flag behavior

### Pass / Fail

- **Pass**: the targeted checks prove adaptive fusion stays flag-gated in the live runtime path while the install guide reflects matching flag-toggle guidance
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `lib/search/hybrid-search.ts`, `shared/algorithms/adaptive-fusion.ts`, and `INSTALL_GUIDE.md`; confirm the checked-in docs match the tested source tree and that the live pipeline still falls back to fixed fusion when `SPECKIT_ADAPTIVE_FUSION=false`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [21--implement-and-remove-deprecated-features/292-adaptive-fusion-flag-drift.md](../../feature_catalog/21--implement-and-remove-deprecated-features/292-adaptive-fusion-flag-drift.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 232
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `21--implement-and-remove-deprecated-features/adaptive-fusion-flag-drift.md`
