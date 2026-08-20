---
title: "CO-037 -- MiniMax design build dispatch carries a measured Style Reference"
description: "Verifies that MiniMax-M3 design/UI build dispatches use the profiled small-model prompt shape and carry a measured Style Reference (extracted via sk-design-md-generator), required files, measured-token manifest, and fidelity proof instead of thin generic design context."
version: 1.1.0.0
---

# CO-037 -- MiniMax design build dispatch carries a measured Style Reference

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-037`.

---

## 1. OVERVIEW

MiniMax-M3 design/UI build work needs two contracts at once: the MiniMax-specific prompt shape from `sk-prompt/sk-prompt-models` and a measured Style Reference from `sk-design-md-generator`. This scenario validates that `cli-opencode` dispatch does not send a generic design prompt. The composed prompt must include a dense pre-plan, a Style Reference Manifest (measured DESIGN.md tokens), the build-against-measured requirements, a validate step, and the sk-code handoff card.

### Why This Matters

Small-model dispatch fails quietly when the parent prompt only says "build this UI" and assumes the child will infer or invent colors, type, and spacing. MiniMax-M3 has a profiled TIDD-EC plus dense pre-plan shape, and design builds have an explicit measured-ground-truth gate: the child must build against tokens extracted verbatim from a live source, not from memory. `sk-design-md-generator` measures real CSS; it does not judge design or invent direction. The manual test catches a thin dispatch before the child returns attractive but unmeasured design values.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-037` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a MiniMax-M3 dispatch for design/UI build work carries the model profile, the measured Style Reference manifest, the build-against-measured requirements, and the validate + sk-code handoff proof.
- Real user request: `Use MiniMax to build this SaaS onboarding UI so it matches the live source before I hand it to implementation.`
- Prompt: `Use MiniMax-M3 to build a SaaS onboarding UI against a measured Style Reference. Dispatch it with the sk-design-md-generator Style Reference manifest (measured DESIGN.md tokens), the build-against-measured requirements, and the validate + sk-code-handoff proof requirements.`
- Expected execution process: Consult `sk-prompt/sk-prompt-models` for MiniMax-M3, read `../../../../sk-prompt/sk-prompt-models/references/models/minimax-m3.md`, read `../../assets/prompt-quality-card.md`, read `../../../../sk-design-md-generator/references/creation-contract.md`, compose a MiniMax prompt with `<pre-plan>`, Style Reference Manifest, measured-token load step, `## Verification`, and the sk-code handoff card, then dispatch or dry-run the exact packet depending on provider availability.
- Expected signals: The prompt names the required sk-design-md-generator files, loads the measured tokens first, requires every built value to trace to a measured token, flags any inferred value as an OPEN RISK, requires the validate step (hex accuracy, section completeness) before ready language, and tells the child not to claim ready/fidelity/handoff unless the validate result and locked-value trace are complete.
- Desired user-visible outcome: A MiniMax dispatch packet and child-output check that prove the measured Style Reference was loaded and built against, with missing validate/locked-value proof returning NOT READY rather than design values from memory.
- Pass/fail: PASS if the dispatch packet contains the MiniMax profile shape plus the measured Style Reference manifest and fidelity proof; FAIL if the prompt is generic, omits the measured-token manifest, omits the validate/handoff proof, uses `--agent` for the small-model dispatch, invites the child to invent new visual direction, or permits readiness/fidelity claims without complete proof.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the operator is allowed to dispatch OpenCode from the active runtime and that MiniMax credentials are available. If credentials are unavailable, run the prompt-packet composition check and mark live dispatch SKIP with the provider blocker.
2. Read `../../../../sk-prompt/sk-prompt-models/references/models/minimax-m3.md` and confirm the design-task scaffold section is used.
3. Read `../../../../sk-design-md-generator/references/creation-contract.md` and copy the typed context envelope and typed proof requirements into the dispatch packet.
4. Compose `/tmp/co-037-minimax-design-prompt.md` with TIDD-EC plus dense pre-plan, Style Reference Manifest, measured-token load step, loaded-file checklist, required fidelity-proof fields, verification, and the sk-code handoff card.
5. Dispatch with MiniMax-M3 without `--agent`, or validate the packet only when provider credentials are missing.
6. Inspect the output or packet for the child echo of loaded measured tokens and the validate/handoff proof sections.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-037 | MiniMax design build dispatch carries a measured Style Reference | Verify MiniMax-M3 design/UI build dispatch carries the profiled prompt shape and a measured Style Reference manifest instead of thin generic context | `Use MiniMax-M3 to build a SaaS onboarding UI against a measured Style Reference. Dispatch it with the sk-design-md-generator Style Reference manifest (measured DESIGN.md tokens), the build-against-measured requirements, and the validate + sk-code-handoff proof requirements.` | 1. `bash: rg -n "design-task scaffold" .opencode/skills/sk-prompt/sk-prompt-models/references/models/minimax-m3.md` -> 2. `bash: rg -n "TYPED CONTEXT ENVELOPE|TYPED PROOF|FAILURE SEMANTICS" .opencode/skills/sk-design-md-generator/references/creation-contract.md` -> 3. compose `/tmp/co-037-minimax-design-prompt.md` with `<pre-plan>`, Style Reference Manifest, measured-token load step, `## Verification`, and the sk-code handoff card -> 4. `bash: rg -n "LOCKED VALUES|INFERRED VS MEASURED|VALIDATION|Do not claim" /tmp/co-037-minimax-design-prompt.md` -> 5. `bash: opencode run --model minimax-coding-plan/MiniMax-M3 --format json --dir "$(git rev-parse --show-toplevel)" "$(cat /tmp/co-037-minimax-design-prompt.md)" > /tmp/co-037-output.json 2>&1 </dev/null; echo "Exit: $?"` | Step 1: MiniMax design scaffold found; Step 2: typed context envelope and typed proof headings found; Step 3: prompt has pre-plan, Style Reference Manifest, measured-token load, Verification, and sk-code handoff sections; Step 4: all fidelity-proof fields and claim block are present; Step 5: live dispatch exits 0 when provider is configured, or SKIP records missing MiniMax credentials only | Source grep output, composed prompt packet, optional dispatch JSON, exit code or provider SKIP note, and child output echo if dispatched | PASS if the packet includes the MiniMax profile shape, no `--agent`, measured-token manifest, fidelity-proof fields, handoff card, and claim block; FAIL if any required manifest/proof is missing or the child is allowed to make unsupported readiness/fidelity claims or invent new direction | (1) If MiniMax model id fails, confirm live id with `opencode models minimax`; (2) if provider auth is missing, validate packet structure and mark live dispatch SKIP; (3) if fidelity-proof fields are missing, re-read creation-contract.md typed-proof section and minimax-m3.md design scaffold |

### Optional Supplemental Checks

- Repeat the packet check with Direct API model `minimax/MiniMax-M3` and confirm the prompt contract stays identical.
- Add a negative control by composing a generic RCAF design-build prompt and verifying it fails the `rg` fidelity-proof-field check.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../../../sk-prompt/sk-prompt-models/references/models/minimax-m3.md` | MiniMax-M3 profiled prompt contract and design-task scaffold |
| `../../../../sk-design-md-generator/references/creation-contract.md` | Design-reference creation contract: typed context envelope, typed proof, and failure semantics |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | cli-opencode provider and dispatch workflow |
| `../../assets/prompt-quality-card.md` | Small-model prompt-quality override table and executor notes |
| `../../../../sk-design-md-generator/references/quality-checklist.md` | Numerical-accuracy and completeness gates for the extracted Style Reference |
| `../../../../sk-design-md-generator/references/sk-code-handoff.md` | Handoff card (LOCKED VALUES, OPEN RISKS, NEVER-CHANGE) before ready or handoff claims |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-037
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `prompt-templates/minimax-design-context-manifest.md`
