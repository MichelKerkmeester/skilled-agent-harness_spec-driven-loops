---
title: "CO-037 -- MiniMax design dispatch carries context manifest and proof cards"
description: "Verifies that MiniMax-M3 design/UI dispatches use the profiled small-model prompt shape and carry the sk-design context manifest, required files, Context Loaded card, and Proof Of Application card instead of thin generic design context."
version: 1.0.0.0
---

# CO-037 -- MiniMax design dispatch carries context manifest and proof cards

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-037`.

---

## 1. OVERVIEW

MiniMax-M3 design work needs two contracts at once: the MiniMax-specific prompt shape from `sk-prompt-models` and the shared `sk-design` context-loading contract. This scenario validates that `cli-opencode` dispatch does not send a generic design-review prompt. The composed prompt must include a dense pre-plan, a Design Manifest, the Context Loaded card, required proof fields, and the Proof Of Application card.

### Why This Matters

Small-model dispatch fails quietly when the parent prompt only says "review this design" and assumes the child will infer the skill context. MiniMax-M3 has a profiled TIDD-EC plus dense pre-plan shape, and design work has explicit context gates. The manual test catches a thin dispatch before the child returns attractive but unsupported design claims.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-037` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a MiniMax-M3 dispatch for design/UI work carries the model profile, sk-design context manifest, Context Loaded card, and Proof Of Application card.
- Real user request: `Use MiniMax to review this SaaS onboarding redesign direction before I hand it to implementation.`
- Prompt: `Use MiniMax-M3 to review a SaaS onboarding redesign direction. Dispatch it with the sk-design context manifest, register/dials, contrast-pair, pre-flight, and audit-evidence proof requirements.`
- Expected execution process: Consult `sk-prompt-models` for MiniMax-M3, read `../../../sk-prompt-models/references/models/minimax-m3.md`, read `../../assets/prompt_quality_card.md`, read `../../../sk-design/shared/context_loading_contract.md`, compose a MiniMax prompt with `<pre-plan>`, Design Manifest, Context Loaded card, proof-field requirements, `## Verification`, and Proof Of Application card, then dispatch or dry-run the exact packet depending on provider availability.
- Expected signals: The prompt names the required sk-design files, sets register/dials first, requires contrast-pair inventory when color pairs change, requires interface pre-flight before ready language, requires audit evidence before accessibility or release claims, and tells the child not to claim ready/accessibility/release unless proof fields are complete.
- Desired user-visible outcome: A MiniMax dispatch packet and child-output check that prove the design context was loaded and applied, with missing proof fields returning NOT READY rather than design advice from memory.
- Pass/fail: PASS if the dispatch packet contains the MiniMax profile shape plus sk-design context manifest and proof cards; FAIL if the prompt is generic, omits the context manifest, omits the cards, uses `--agent` for the small-model dispatch, or permits readiness/accessibility claims without complete proof fields.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the operator is allowed to dispatch OpenCode from the active runtime and that MiniMax credentials are available. If credentials are unavailable, run the prompt-packet composition check and mark live dispatch SKIP with the provider blocker.
2. Read `../../../sk-prompt-models/references/models/minimax-m3.md` and confirm the design-task scaffold section is used.
3. Read `../../../sk-design/shared/context_loading_contract.md` and copy the manifest and proof-field requirements into the dispatch packet.
4. Compose `/tmp/co-037-minimax-design-prompt.md` with TIDD-EC plus dense pre-plan, Design Manifest, Context Loaded card, loaded-file checklist, required proof fields, verification, and Proof Of Application card.
5. Dispatch with MiniMax-M3 without `--agent`, or validate the packet only when provider credentials are missing.
6. Inspect the output or packet for the child echo of Context Loaded and Proof Of Application sections.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-037 | MiniMax design dispatch carries context manifest and proof cards | Verify MiniMax-M3 design/UI dispatch carries the profiled prompt shape and sk-design context manifest instead of thin generic context | `Use MiniMax-M3 to review a SaaS onboarding redesign direction. Dispatch it with the sk-design context manifest, register/dials, contrast-pair, pre-flight, and audit-evidence proof requirements.` | 1. `bash: rg -n "design-task scaffold|Context Loaded card|Proof Of Application" .opencode/skills/sk-prompt-models/references/models/minimax-m3.md` -> 2. `bash: rg -n "CONTEXT MANIFEST|REQUIRED PROOF FIELDS|HARD GATES" .opencode/skills/sk-design/shared/context_loading_contract.md` -> 3. compose `/tmp/co-037-minimax-design-prompt.md` with `<pre-plan>`, Design Manifest, Context Loaded card, proof fields, `## Verification`, and Proof Of Application card -> 4. `bash: rg -n "REGISTER / DIALS|CONTRAST PAIRS|INTERFACE PREFLIGHT|AUDIT EVIDENCE|Do not claim" /tmp/co-037-minimax-design-prompt.md` -> 5. `bash: opencode run --model minimax-coding-plan/MiniMax-M3 --format json --dir "$(git rev-parse --show-toplevel)" "$(cat /tmp/co-037-minimax-design-prompt.md)" > /tmp/co-037-output.json 2>&1 </dev/null; echo "Exit: $?"` | Step 1: MiniMax design scaffold found; Step 2: shared manifest and proof fields found; Step 3: prompt has pre-plan, Design Manifest, Context Loaded, Verification, and Proof Of Application sections; Step 4: all proof fields and claim block are present; Step 5: live dispatch exits 0 when provider is configured, or SKIP records missing MiniMax credentials only | Source grep output, composed prompt packet, optional dispatch JSON, exit code or provider SKIP note, and child output echo if dispatched | PASS if the packet includes the MiniMax profile shape, no `--agent`, context manifest, proof fields, cards, and claim block; FAIL if any required manifest/card is missing or the child is allowed to make unsupported readiness/accessibility claims | (1) If MiniMax model id fails, confirm live id with `opencode models minimax`; (2) if provider auth is missing, validate packet structure and mark live dispatch SKIP; (3) if proof fields are missing, re-read context_loading_contract.md Section 4 and minimax-m3.md design scaffold |

### Optional Supplemental Checks

- Repeat the packet check with Direct API model `minimax/MiniMax-M3` and confirm the prompt contract stays identical.
- Add a negative control by composing a generic RCAF design-review prompt and verifying it fails the `rg` proof-field check.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../sk-prompt-models/references/models/minimax-m3.md` | MiniMax-M3 profiled prompt contract and design-task scaffold |
| `../../../sk-design/shared/context_loading_contract.md` | Shared sk-design manifest, proof fields, and hard gates |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | cli-opencode provider and dispatch workflow |
| `../../assets/prompt_quality_card.md` | Small-model prompt-quality override table and executor notes |
| `../../../sk-design/shared/assets/context_loaded_card.md` | Required pre-work card for design decisions and dispatch |
| `../../../sk-design/shared/assets/proof_of_application_card.md` | Required end-of-work proof card before ready or release claims |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-037
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/minimax-design-context-manifest.md`
