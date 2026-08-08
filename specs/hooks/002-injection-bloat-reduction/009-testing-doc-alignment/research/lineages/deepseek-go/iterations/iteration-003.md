# Iteration 3: Codex hook-parity sub-playbooks, advisor catalogs, and the plugin surface

## Focus

Check the cli-codex hook-parity playbook's classify/enforce assertions against the post-emission observer change, audit the advisor mcp-surface and hooks-and-plugin catalogs for policy-delivery/epoch vocabulary, and confirm whether any plugin catalog entry describes the delivery-observation layer of mk-spec-gate / mk-skill-advisor.

## Findings

### F10 — `codex-hook-parity.md` classify/enforce assertions remain accurate under the post-emission observer change

The shared plugins-and-hooks playbook (`codex-hook-parity.md:49,74-79,110-113`) asserts:
- `spec-gate-classify` emits the Gate-3 `additionalContext` on a mutation-intent prompt (steps 2, 4) — TRUE. The post-emission observer (`observeGate3QuestionDelivery` in the stdout.write callback at `spec-gate-classify.mjs:77-79`) fires AFTER the stdout write and does not alter the emitted envelope. The playbook checks emitted output only.
- `spec-gate-enforce` emits `permissionDecision:"deny"` when gate open + enforce set — TRUE; enforce path unchanged.
- Step 1's deny fixture plants a minimal open gate state (`{"status":"open","askedAtMs":1}`) and expects deny — TRUE; the deny predicate does not require any delivery receipt.

No codex-hook-parity assertion depends on confirmation semantics, so nothing is contradicted. The playbook is a test contract for emitted envelopes, which the shadow-delivery change explicitly keeps byte-identical.

### F11 — Advisor mcp-surface catalogs document the shadow-DELTA sink but not the shadow-DELIVERY machine

- `advisor-recommend.md:25` and `shadow-delta-sink.md` (NC-010 playbook) describe the shadow-**delta** sink (`SPECKIT_ADVISOR_SHADOW_DELTA_PATH`/`ENABLED`), an opt-in durable recording of shadow recommendations. This is a separate feature from the shadow-**delivery** state machine in `policy-plan.ts` (delivery confirmation receipts, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`). Accurate as far as it goes; the naming overlap is a terminology hazard but neither file makes a false statement about delivery.
- `advisor-status.md:25,38` and `attribution.md:23` describe the semantic-shadow lane (scoring), unrelated to delivery. Accurate.
- The `hooks-and-plugin/claude-hook.md` catalog (`:22`) documents the Claude prompt hook's fail-open behavior and env flags but not the post-emission policy-delivery observer added at commit 78ef96ae6b to `user-prompt-submit.ts` (final pre-return `observeEmittedAdvisorPolicy`/`recordObservedPolicyDelivery`). Omission-stale on the most relevant advisor catalog entry for the changed behavior.

### F12 — No plugin feature-catalog entry documents the delivery-observation layer

No feature-catalog entry inventories `mk-spec-gate.js` or `mk-skill-advisor.js` delivery observation at all. The plugins are covered in `cli-external-orchestration/feature-catalog/feature-catalog.md` and `system-skill-advisor/feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md` as inventory/registration references without delivery semantics. `system-spec-kit/feature-catalog/feature-catalog.md` and `system-skill-advisor/feature-catalog/feature-catalog.md` index the spec-gate/advisor surfaces without the new exports. This confirms F9: the catalog layer has a wholesale omission of the delivery-observation layer, not any contradiction.

### F13 — System-spec-kit feature-catalog entries referencing "gate" are classification/enforcement policy, not delivery

`governance/constitutional-gate-enforcement-rule-pack.md`, `governance/session-resume-caller-binding-and-unicode-sanitization.md`, `maintenance/doctor-router-and-manifest-dispatch.md`, `pipeline-architecture/phase-017-maintainability-extracts.md`, and the ux-hooks/goal-opencode-plugin entries all reference Gate-3 as the spec-folder classification gate (classifier, enforce, rule pack). None describes the delivery-observation layer or the suppression flag. Accurate; omission-stale only for the new layer.

## Sources Consulted

- [SOURCE: .opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md:49,74-79,110-113]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-classify.mjs (post-emission observer, read in full)]
- [SOURCE: .opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/{advisor-recommend,advisor-status}.md; scorer-fusion/attribution.md]
- [SOURCE: .opencode/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md:22]
- [SOURCE: .opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/shadow-delta-sink.md]
- [SOURCE: grep across system-spec-kit feature-catalog for gate references]

## Assessment

newInfoRatio: 0.3
noveltyJustification: F10/F12 confirm the codex hook-parity contract is unaffected (post-emission observer preserves emitted output); F11/F13 sharpen the catalog omission from "no contradiction" to a specific, concrete list of omission-stale entries. Decreasing novelty — the surface is largely cleared; remaining work is the authoritative-contract split and must-fix/optional boundary.

Key questions answered: Q1 (converged — one stale playbook assertion: the 67→87 count), Q2 (converged — catalog omissions only, no inaccuracy), Q4 (partial).

## Reflection

What worked: reading the real codex classify adapter confirmed the emitted-envelope contract is invariant under the observer change; the shadow-delta vs shadow-delivery distinction cleanly separates the NC-010 playbook from the changed machine.

What failed / ruled out: Ruled out codex-hook-parity as stale. Ruled out advisor mcp-surface and plugin catalogs as contradictions (all true; omission only).

## Recommended Next Focus

Iteration 4: Broaden to the remaining cli-executor playbook root files (claude/codex/cursor/devin/pi/open-code main playbook bodies) for any Gate-3 delivery or suppression references not yet inspected, and check the sk-git/sk-code root playbooks and system-deep-loop runtime playbook for the delivery vocabulary. Then verify whether the `hooks/README.md` and spec-gate README (updated at 2af2feb113) are reflected anywhere in a catalog that should reference them.
