# Iteration 5: Observer-timing line-level verification, negative-control fixtures, and cross-lineage reconciliation

## Focus

Verify the post-emission/pre-return observer timing at line level in all five gate adapters, confirm the shadow-delivery flags-off/byte-identical/fail-open contract against the negative-control fixtures, and reconcile with the sibling luna lineage to avoid duplication.

## Findings

### F18 — Post-emission observer timing verified at line level in all five adapters

- `claude/spec-gate-classify.mjs:70-77`: `process.stdout.write(JSON.stringify({...}), () => { guardCore.observeGate3QuestionDelivery(observeArgs); process.exit(0); })` — observer fires strictly post-emission in the write callback. ✓ matches the changed contract.
- `codex/spec-gate-classify.mjs:67-74`: same post-emission write-callback pattern. ✓
- `cursor/spec-gate-classify.mjs:74-80`: same post-emission write-callback pattern (adapter dormant, but code present). ✓
- `devin/spec-gate-classify.mjs:73-80`: same post-emission write-callback pattern. ✓
- `pi/spec-gate-classify.ts:55-56`: `guard.observeGate3QuestionDelivery(observeArgs); return output;` — observer runs as the final pre-return step. ✓ matches the "Pi and return-based hooks observe as final pre-return step" claim.
- `claude/user-prompt-submit.ts` and `pi/prompt-advisor.ts` (advisor side) follow the same discipline per the phase-008 audit (post-emission stdout-write callback / pre-return final step).

The changed-contract claim is TRUE in the code. No playbook or catalog asserts anything contradicting this timing (they don't describe observer timing at all).

### F19 — Shadow-delivery flags-off / byte-identical / fail-open contract is enforced by the shipped negative-control fixtures

- `spec-gate-core.test.mjs:297-315` ("Gate-3 delivery flag off preserves byte-identical baseline output"): asserts `suppressionEligible=false`, `suppressionConsumed=false`, and that turning the flag back off clears delivery state — flags remain off, output baseline preserved. ✓
- `spec-gate-core.test.mjs:317+` ("Gate-3 shadow receipt records the planned and emitted full relay"): asserts the shadow receipt is recorded without changing the relay. ✓
- The `gate3DeliveryConfirmed` predicate (`spec-gate-core.mjs:287-295`) requires `hostReceiptStatus === 'observed'`, epoch >= 1, and matching hashes — epoch 0 fails closed. ✓
- The negative-control fixtures (policy-plan-negative-controls.vitest.ts, 7 byte-parity fixtures) are test code, not playbook/catalog docs — in scope only as the contract authority they encode. No playbook or catalog contradicts them.

### F20 — Cross-lineage reconciliation: luna (gpt-5.6) converges on the same two conclusions; this lineage adds the unique test-count finding

Reading the sibling `luna` lineage state (5 iterations so far):
- luna claim `playbooks-no-contradiction` (iteration 5): "No playbook asserts the old configured-receipt or epoch-zero contract" — matches my F4/F14.
- luna findings `f-cursor-catalog-omission` / `f-detailed-cursor-catalog` / `f-root-cursor-catalog` (iterations 1-3): the Cursor catalogs omit the epoch/post-emission/suppression contract — matches my F3/F9/F11 on the cursor and spec-gate catalogs. luna scopes the catalog omission specifically to the two Cursor catalogs; I found the same pattern extends to claude-hook.md (F11), feature-flag-reference (F15), and the system-spec-kit catalog surface (F9) — complementary, not conflicting.
- luna has NOT found the `spec-mutation-gate-enforce.md` test-count drift (67→87) or the step-2 child-env neutrality gap (my F2/F6). These are this lineage's unique contributions. No contradictory findings between lineages.

## Sources Consulted

- [SOURCE: claude/codex/cursor/devin/spec-gate-classify.mjs and pi/spec-gate-classify.ts observer call sites (line-level, read in full)]
- [SOURCE: spec-gate-core.test.mjs:297-330, spec-gate-core.mjs:287-295]
- [SOURCE: sibling lineage luna deep-research-state.jsonl + findings-registry.json]

## Assessment

newInfoRatio: 0.25
noveltyJustification: F18/F19 confirm the changed contract in code and fixtures; F20 reconciles the two independent lineages and isolates this lineage's unique finding (the test-count drift). Confirmatory with one new reconciliation insight.

Key questions answered: Q1-Q5 all have evidence-backed answers at this point; must-fix/optional split is next.

## Reflection

What worked: line-level verification of all five adapters proved the observer-timing contract without ambiguity; reading the sibling lineage prevented duplicate findings and highlighted the unique test-count contribution.

What failed / ruled out: Ruled out any playbook assertion of observer timing (none exist). Ruled out the negative-control fixtures as docs needing changes (they are test code and already encode the contract).

## Recommended Next Focus

Iteration 6: Run a final repo-wide net: grep ALL live feature-catalog + playbook files for any remaining Gate-3/delivery/epoch/suppression terms NOT yet inspected (including paraphrase variants like "repeat", "re-emit", "already asked", "duplicate question"), then formalize the P0/P1/P2 severity ranking and the must-fix vs optional split in preparation for synthesis.
