---
title: "225 -- Runtime remediation, revalidation, and auto-repair workflows"
description: "This scenario validates Runtime remediation, revalidation, and auto-repair workflows for `225`. It focuses on Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals."
audited_post_018: true
phase_018_change: "Post-018 audit kept the scenario aligned to the live remediation surface, including save-time guards, confirmation-gated repair, and rollback-aware revalidation."
version: 3.6.0.15
id: remediation-revalidation-remediation-runtime-surface
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 225 -- Runtime remediation, revalidation, and auto-repair workflows

## 1. OVERVIEW

This scenario validates Runtime remediation, revalidation, and auto-repair workflows for `225`. It focuses on Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals.
- Real user request: `Please validate Runtime remediation, revalidation, and auto-repair workflows against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts and tell me whether the expected signals are present: Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence.`
- Prompt: `Validate runtime remediation, revalidation, and auto-repair against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the evidence confirms the remediation surface enforces save-time guards, bounded operator repair, and rollback-aware revalidation behavior end to end

---

## 3. TEST EXECUTION

### Prompt

```
Validate runtime remediation, revalidation, and auto-repair against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts`
2. `cd .opencode/skills/system-spec-kit && npm run build && node -e "import('./mcp-server/dist/handlers/v-rule-bridge.js').then((m)=>{ const available=m.isVRuleBridgeAvailable(); console.log(available ? 'v-rule-bridge:available' : 'v-rule-bridge:missing'); process.exit(available ? 0 : 1); }).catch((error)=>{ console.error(error); process.exit(1); })"`
3. inspect assertions covering `memory_save` preflight, V-rule disposition handling, quality-loop rejection or repair, and downstream save-quality-gate outcomes
4. inspect assertions covering `memory_health` confirmation-required auto-repair and bounded repair metadata
5. inspect assertions covering `memory_validate` and checkpoint pathways that preserve revalidation or rollback signals

### Expected

Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **PASS**: the targeted suites passed, the compiled validator path resolved as `v-rule-bridge:available`, and inspected assertions confirm save-time guard coverage, confirmation-gated bounded repair, repair metadata, checkpoint restore/delete hints, and validation feedback signals without contradictory evidence.

### Failure Triage

Inspect `mcp-server/handlers/memory-save.ts`, `mcp-server/lib/validation/preflight.ts`, `mcp-server/handlers/v-rule-bridge.ts`, `mcp-server/handlers/quality-loop.ts`, `mcp-server/lib/validation/save-quality-gate.ts`, `mcp-server/handlers/checkpoints.ts`, and `mcp-server/handlers/memory-crud-health.ts` if any remediation-stage signal is missing or contradictory

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [remediation-revalidation/category-stub.md](../../feature-catalog/remediation-revalidation/category-stub.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 225
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `remediation-revalidation/remediation-runtime-surface.md`
