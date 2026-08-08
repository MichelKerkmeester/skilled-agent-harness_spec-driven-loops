# Iteration 1: Enumerate the matched playbook/catalog surface and verify the changed contract against the real code

## Focus

Enumerate every manual-testing-playbook and feature-catalog file that references the changed subjects (spec-gate, Gate-3, shadow-delivery, MK_SPEC_GATE, delivery observation), verify the changed contract against the real code, and establish which matched docs are authoritative test contracts versus benign references.

## Findings

### F1 — The live matched playbook surface is small and concentrated in cli-external-orchestration

Of ~41 manual-testing-playbooks, exactly three match the changed-subject regex at the root file, and their sub-scenario files:
- `cli-codex/manual-testing-playbook/manual-testing-playbook.md:39` — a single cross-reference note pointing Gate-3 guard-hook parity validation to the hub's shared `plugins-and-hooks/codex-hook-parity.md`. No assertion of delivery-confirmation semantics.
- `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` + four hook scenarios (CU-013 confirmed-fires-smoke-test, CU-014 confirmed-non-delivery-documentation, CU-020 spec-gate-prebind-session-start, task-dispatch-guard-live-fire) — these assert cursor event-DELIVERY status (which events fire under `cursor-agent -p`), NOT the epoch/confirmation contract.
- `cli-opencode/manual-testing-playbook/manual-testing-playbook.md:280` — a `memory_health` dispatch test with "(pre-approved, skip Gate 3)" — a benign Gate-3 skip reference, no delivery semantics.

The skill-owned playbooks for the changed code surfaces (`system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md`, `system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md`, `native-mcp-tools/shadow-delta-sink.md`) are the authoritative test contracts for the changed surfaces. Their sub-scenarios matched the broader gate/spec-gate grep (devin DV-009, pi PI-014/PI-016, codex CX-016).

### F2 — `spec-mutation-gate-enforce.md` (the authoritative Gate-3 playbook) asserts classify/enforce behavior that the change did NOT alter

Verified against the real code:
- The playbook's classify assertions (`classifyIntent()` returns `{status:"open", question}` on mutation-shaped prompts; child session `{status:"closed", question:null}`) match `spec-gate-core.mjs` behavior exactly — unchanged.
- The enforce assertions (`evaluateMutation()` returns advise/deny/allow, child no-op) match the unchanged enforce path.
- The playbook's expected test counts: `mk-spec-gate.test.cjs` 11/11 and `spec-gate-core.test.mjs` 67/67. The commit `78ef96ae6b` message claims `spec-gate-core 84/0` and `plugin dedup 46/46` — the core suite count moved from 67 to 84 after the epoch-floor fix. **The playbook's step-2 expected signal (`# tests 67`, `# pass 67`) is now stale**: the shipped suite reports 84 tests. This is a verifiable count drift on an authoritative test contract.
- `[SOURCE: .opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:57-63]`

### F3 — `cursor-hooks-and-spec-gate.md` (feature-catalog) is accurate about the cursor classify adapter's delivery status

The catalog says `spec-gate-classify.mjs` "remains registered on the undelivered prompt event for forward compatibility" and "Registered advisory classifier whose `beforeSubmitPrompt` delivery remains unconfirmed." This matches the real file header at `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:5` ("STATUS: dormant, not wired"). The change added a post-emission observer to this dormant adapter (lines 63-80) but the adapter is still never fired, so the catalog's "unconfirmed delivery" claim remains TRUE. Not stale.

### F4 — No playbook or catalog asserts the old confirmation contract (epoch-0 or `configured`-receipt confirmation)

Exhaustive grep across every live playbook and catalog file for `lifecycleEpoch`, `observed receipt`, `configured receipt`, `deliveryConfirmed`, `SUPPRESSED_SAME`, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `post-emission`, `shadow-delivery`, `gate3DeliveryConfirmed`, `observeGate3QuestionDelivery` returns ZERO matches outside the spec packet and the already-updated READMEs (lib/README.md:75, ENV-REFERENCE.md:479, lib/spec-gate/README.md:30). The delivery-observation API and suppression flag are documented in READMEs (fixed at 2af2feb113) but in NO playbook and NO feature-catalog. This is a coverage gap for the authoritative test-contract surface, not a contradiction.

### F5 — The changed exports are absent from the system-spec-kit feature-catalog surface

No feature-catalog entry under `.opencode/skills/system-spec-kit/feature-catalog/` describes `observeGate3QuestionDelivery`, `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `shouldSuppressGate3Delivery`, or the suppression env. The catalog files that mention Gate-3 (governance/constitutional-gate-enforcement-rule-pack.md, governance/session-resume-caller-binding-and-unicode-sanitization.md, doctor-commands/category-overview.md, maintenance/doctor-router-and-manifest-dispatch.md) describe classification/enforcement policy, not the delivery-observation layer. The cursor-hooks-and-spec-gate.md catalog entry (which DOES describe the spec-gate adapter surface) does not mention the post-emission observer on the four stdout-write adapters or the suppression flag — an omission on the most relevant catalog entry.

## Sources Consulted

- [SOURCE: grep across all live playbook + catalog files for epoch/confirmation/observer vocabulary — zero matches]
- [SOURCE: .opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:57-63]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs:5,63-80]
- [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:32,55]
- [SOURCE: commit 78ef96ae6b message (spec-gate-core 84/0)]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:222-359, 393-489]
- [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/{confirmed-fires-smoke-test,confirmed-non-delivery-documentation,spec-gate-prebind-session-start}.md]

## Assessment

newInfoRatio: 0.85
noveltyJustification: F1-F3 establish the matched surface precisely and verify the real-code contract; F4 is the key negative result (zero playbook/catalog assertions of the old contract); F2 finds the first concrete stale count. The surface is mapped; iteration 2 broadens to spot-check non-matched playbooks and catalogs.

Key questions answered: Q1 (partial), Q2 (partial), Q4 (partial).

## Reflection

What worked: targeted grep on the two surface types only (not the whole repo) kept the surface tractable; reading the real `spec-gate-core.mjs` exports verified the contract before judging any snippet stale.

What failed / ruled out: Ruled out the three root playbook matches as delivery-contract references (they are event-delivery status + cross-references). Ruled out the shadow-delta-sink playbook (NC-010) — it covers the shadow-DELTA sink, a separate feature from shadow-DELIVERY; its assertions remain accurate.

## Recommended Next Focus

Iteration 2: Spot-check a sample of non-matched playbooks (system-spec-kit tooling-and-scripts, cli-executor gate references, sk-code skill-advisor-integration) and the full matched catalog set (cli-dispatch-authorization, feature-catalog.md, launch-wrapper-session-isolation, session-resume-caller-binding) to confirm none assert the changed contract, then verify the F2 test-count drift against the actual test file.
