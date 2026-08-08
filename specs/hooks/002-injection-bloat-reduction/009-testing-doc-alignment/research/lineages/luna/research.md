---
title: "Injection-bloat testing and feature-catalog alignment research"
description: "Findings-only sweep of manual-testing-playbooks and feature-catalog entries against the committed Gate-3 observed-delivery contract."
status: complete
severity_model: P0/P1/P2
iterations: 10
session_id: fanout-luna-1786120169844-ep05xl
executor: cli-codex model=gpt-5.6-luna
---

# Verdict

The target surface contains two catalog omissions and no stale manual-testing-playbook assertion.

- Inventory: 41 manual-testing-playbook.md files and 1,498 Markdown files under feature-catalog paths.
- Broad subject sweep: three root playbooks matched; only two catalog entries were relevant after semantic triage.
- P1 must-fix: the detailed Cursor hook/spec-gate catalog omits the observed-receipt, epoch floor, post-emission, and suppression invariants.
- P2 optional: the root cli-external-orchestration catalog omits a concise pointer to the same delivery contract.
- P0: none.
- Playbooks: aligned. No command, expected output, or PASS/FAIL scenario asserts epoch-0/configured-receipt confirmation or pre-emission observation.

This is a documentation-only result. It does not propose changing the frozen shadow-delivery or Gate-3 runtime behavior.

## Authoritative changed contract

The updated shared-core README at mcp-server/hooks/lib/spec-gate/README.md:30 states that:

- a Gate-3 question is confirmable only from an observed receipt whose lifecycleEpoch is at least 1 and matches the question hash;
- epoch 0 never confirms;
- observation is strictly post-emission for the runtime adapters;
- suppression is opt-in through MK_SPEC_GATE_3_DELIVERY_SUPPRESSION, default-off, and fail-open for unknown or unobserved state.

The implementation and tests provide the stronger evidence:

- spec-gate-core.mjs:287-295 requires an object receipt with hostReceiptStatus observed, a valid epoch at least 1, matching question hash, and matching receipt epoch.
- spec-gate-core.mjs:273-275 makes suppression enabled only when MK_SPEC_GATE_3_DELIVERY_SUPPRESSION equals 1.
- spec-gate-core.mjs:342-363 keeps the suppression predicate false for disabled, child, wrong-kind, wrong-question, missing-state, or error cases.
- spec-gate-core.mjs:416-469 observes without changing the returned relay; it records the observed emission and only seeds delivery state after confirmed delivery.
- spec-gate-core.test.mjs:297-315 proves flag-off output remains byte-identical and suppression is not consumed.
- spec-gate-core.test.mjs:380-390 proves an observed receipt is required before suppression state can seed.
- spec-gate-core.test.mjs:586-623 proves epoch 0 is rejected at the policy sink and confirmation boundary while epoch 1 is accepted.
- spec-gate-core.test.mjs:625-647 proves the four stdout adapters observe after stdout emission and Pi observes after output construction.

## Findings

### P1 — detailed Cursor catalog omits the load-bearing delivery contract (must-fix)

File: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:28-36,48-70

Current statement:

The entry describes live-confirmed session/tool events, Gate-3 prebinding and enforcement, the prompt classifier's unconfirmed Cursor host delivery, the current hook matrix, the exact classifier/enforcer source files, and the linked manual/automated tests.

Missing or inaccurate contract:

- It does not say that delivery confirmation requires hostReceiptStatus observed, not a configured or bare receipt.
- It does not say that lifecycleEpoch must be at least 1 and equal the receipt epoch; epoch 0 never confirms.
- It does not say that the Claude, Codex, Cursor, and Devin stdout adapters observe strictly after stdout emission, or that Pi/return-based hooks observe as the final pre-return step.
- It does not say that MK_SPEC_GATE_3_DELIVERY_SUPPRESSION is default-off, opt-in, fail-open, and must preserve byte-identical baseline output.
- It does not expose the now load-bearing shared-core exports observeGate3QuestionDelivery, buildGate3ObservedReceipt, currentGate3LifecycleEpoch, and shouldSuppressGate3Delivery.

Why this is P1:

The entry calls itself a current-state reference and names the exact adapter and validation surfaces. A maintainer can therefore use it as an integration authority while missing the condition that turns an emitted question into a confirmable delivery. The omission does not currently assert a bad runtime behavior, so it is not P0; it is still more than optional polish.

Follow-on implementation boundary:

Add the behavioral paragraph and source/test anchors to this catalog entry. Preserve the existing dormant Cursor host-event statement and do not enable suppression or alter adapter ordering.

### P2 — root Cursor catalog omits the delivery-contract summary (optional)

File: .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:69-77

Current statement:

The root inventory says the Cursor layer maps lifecycle and tool events to policy, lists the registered adapters, distinguishes confirmed paths from unconfirmed prompt-submit/pre-compact paths, and links readers to the detailed catalog.

Missing contract:

It does not identify the observed-receipt epoch floor, post-emission observer placement, default-off/fail-open suppression, or byte-identical baseline behavior.

Why this is P2:

This is a high-level index and line 77 explicitly delegates event behavior and durable validation anchors to the detailed entry. Updating it improves discoverability and prevents the summary from aging, but the detailed catalog is the must-fix authority.

Follow-on implementation boundary:

Add a concise summary or a direct pointer to the observed-delivery contract. Keep the root entry high-level and leave runtime behavior unchanged.

## Playbook alignment review

The three root playbooks returned by the requested broad grep were reviewed, along with the linked Cursor hook scenarios:

- cli-cursor/manual-testing-playbook/manual-testing-playbook.md:444 describes confirmed host events sessionStart, preToolUse, and sessionEnd. This is host-event delivery, not Gate-3 question confirmation.
- cli-cursor/manual-testing-playbook/manual-testing-playbook.md:456-464 and hooks/confirmed-non-delivery-documentation.md:15-33,41-49 assert that Cursor beforeSubmitPrompt and stop do not fire and that spec-gate-classify is dormant. The changed observer behavior does not make those host events fire, so the scenario remains correct.
- hooks/confirmed-fires-smoke-test.md:15-33,41-49 tests sessionStart, preToolUse, and sessionEnd only.
- hooks/spec-gate-prebind-session-start.md:15-33,41-48 tests startup state and exemption rows, not delivery receipts or lifecycle confirmation.
- hooks/task-dispatch-guard-live-fire.md:15-33,41-49 tests a Task matcher alongside an unmatched preToolUse entry, not Gate-3 question delivery.
- cli-codex/manual-testing-playbook/manual-testing-playbook.md:39,502-504 covers cross-runtime hook parity and generic stdout shape; it does not assert a configured receipt or epoch.
- cli-opencode/manual-testing-playbook/manual-testing-playbook.md:280-281 uses Gate 3 only as a pre-approved spec-folder setup condition.

The exact old-contract search returned no target hits for configured receipt, hostReceiptStatus, lifecycleEpoch, epoch 0, observed receipt, post-emission, activation-matrix, policy sink, or question suppression. Generic uses of “emission,” “observed,” and “confirmed delivery” were scoped to deep-loop reports, approvals, generated output, or host events.

## Catalog triage and ruled-out matches

The initial catalog grep returned generic Gate-3/spec-gate matches in 17 files. Only the two Cursor entries above describe the changed hook/spec-gate delivery surface. The remaining matches describe:

- doctor route mutation classes;
- Unicode normalization and session-resume governance;
- constitutional Gate-3 rule indexing;
- maintainability trigger categorization;
- dispatch authorization input handling;
- child-session Gate-3 bypass.

None contains delivery receipt, lifecycle epoch, post-emission, activation-matrix, policy-sink, or suppression language. They are not stale for this change and must not be modified in the follow-on pass.

## Must-fix versus optional

Must-fix:

- P1 detailed Cursor catalog omission at cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:28-36,48-70.

Optional:

- P2 root catalog summary at feature-catalog/feature-catalog.md:69-77.
- Adding a cross-reference from the Cursor playbook to the shared-core delivery contract. This is coverage hardening, not repair of a stale snippet.

No action:

- All manual-testing-playbook snippets reviewed.
- All non-Cursor catalog matches.
- Frozen shadow-delivery and Gate-3 code behavior.

## Research receipts

- Ten iterations were run under max-iterations; early convergence was treated as telemetry only.
- State records and per-iteration delta JSONL were validated through iteration 10.
- Artifact writes were confined to this detached lineage after cleanup of task-created temporary inventory residue.
- Memory context was unavailable in the detached run; repository files, commit 2af2feb113, and executable test/source anchors were used as the evidence base.
- Graph convergence writeback was skipped because this detached lineage was packet-scoped; the state log records that telemetry decision.

