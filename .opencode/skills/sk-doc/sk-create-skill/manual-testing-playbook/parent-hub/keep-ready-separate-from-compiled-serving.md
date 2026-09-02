---
title: "SKL-005 -- Keep ready separate from compiled serving"
description: "This scenario validates the compiled-routing boundary for `SKL-005`. It focuses on fresh onboarding evidence, legacy authority and no runtime claim."
version: 1.2.0.1
---

# SKL-005 -- Keep ready separate from compiled serving

This document captures the operator contract for `SKL-005`.

---

## 1. OVERVIEW

This scenario validates the parent-hub `ready` initialization boundary. It checks the manifest state and separates a fresh hash from a live compiled route.

### Why This Matters

The `ready` flag can mint a fresh manifest. It does not build a shadow child, prove parity, activate compiled serving or add the hub to the default cohort. Treating the manifest as live service gives the user a false runtime claim.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-005` and inspect the manifest fields before answering the runtime question.

- Objective: explain that `--compiled-routing ready` creates inert onboarding evidence rather than live compiled serving
- Realistic user request: `I initialized this parent hub with the ready option. Is compiled routing serving requests now?`
- Prompt: `Initialize this parent hub with compiled-routing ready. Does that make it serve compiled routes now?`
- Expected execution process: read the compiled-routing boundary, inspect the minted manifest, confirm generation one, `servingAuthority: legacy` and `shadowOnly: true`, then state the additional parity and cohort requirements.
- Expected signals: the response distinguishes `compiled-ready (fresh manifest verified)` from compiled serving and names the shadow child, parity, activation and cohort steps as separate work.
- Desired user-visible outcome: a precise runtime answer that does not overstate the initialization result.
- Pass/fail: PASS if the answer says runtime serving remains legacy and cites the manifest fields. FAIL if it calls the new hub compiled-serving or treats freshness as parity proof.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Initialize this parent hub with compiled-routing ready. Does that make it serve compiled routes now?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-005 | Keep ready separate from compiled serving | Explain that ready initialization creates onboarding evidence rather than live compiled serving | `Initialize this parent hub with compiled-routing ready. Does that make it serve compiled routes now?` | 1. `agent: Read the compiled-routing ready boundary in references/parent-skill/compiled-routing-architecture.md` -> 2. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py example-hub --path .opencode/skills --kind parent --compiled-routing ready` -> 3. `bash: node .opencode/bin/compiled-route-manifest.cjs freshness --hub example-hub --skill-root .opencode/skills/example-hub` -> 4. `agent: Inspect servingAuthority, shadowOnly and generation before stating the runtime result` | Step 1: the boundary is named. Step 2: initialization reports fresh manifest verification. Step 3: freshness passes for the named hub. Step 4: the manifest shows legacy authority, shadow-only state and generation one | The exact prompt, boundary text, init transcript, freshness transcript and exit statuses, manifest fields and final runtime answer | PASS if the answer distinguishes fresh onboarding evidence from compiled serving. FAIL if it claims live compiled traffic or omits the legacy authority field | 1. Inspect the manifest values directly. 2. Check whether a shadow child and parity result exist. 3. Check whether the hub is in the default compiled cohort |

### Commands

1. `agent: Read the compiled-routing ready boundary in references/parent-skill/compiled-routing-architecture.md`
2. `bash: python3 .opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py example-hub --path .opencode/skills --kind parent --compiled-routing ready`
3. `bash: node .opencode/bin/compiled-route-manifest.cjs freshness --hub example-hub --skill-root .opencode/skills/example-hub`
4. `agent: Inspect servingAuthority, shadowOnly and generation before stating the runtime result`

### Expected

Step 1 identifies the exact boundary. Step 2 mints a manifest if the hub inputs compile. Step 3 confirms freshness. Step 4 reads the runtime authority fields and explains that freshness is not parity or activation.

### Evidence

Capture the prompt, boundary reference, initialization output, freshness output with exit statuses, manifest fields and final runtime answer.

### Pass / Fail

- **Pass**: the answer reports legacy serving authority and distinguishes onboarding evidence from compiled serving.
- **Fail**: the answer calls the hub compiled-serving, treats generation one as parity proof or omits manifest inspection.

### Failure Triage

1. Read the manifest fields directly from the final file.
2. Check for a shadow-child compiler and parity result.
3. Check cohort and activation state before making a runtime claim.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Parent initialization and validation authority |
| [`references/parent-skill/compiled-routing-architecture.md`](../../references/parent-skill/compiled-routing-architecture.md) | Ready versus compiled-serving boundary |
| [`references/parent-skill/parent-skills-nested-packets.md`](../../references/parent-skill/parent-skills-nested-packets.md) | Parent-hub structure and manifest state |

---

## 5. SOURCE METADATA

- Group: PARENT HUB
- Playbook ID: SKL-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `parent-hub/keep-ready-separate-from-compiled-serving.md`
