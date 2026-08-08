# Iteration 3 — catalog-to-source contract comparison

## Focus

Compare the two authoritative Cursor catalog entries with the updated shared-core README, core implementation, and adapter call sites.

## Actions Taken

- Read the detailed catalog at `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:18-70` and the root catalog at `feature-catalog.md:63-77`.
- Read the updated shared-core README at `mcp-server/hooks/lib/spec-gate/README.md:23-30`.
- Read the changed core contract at `spec-gate-core.mjs:221-295,342-475`.
- Confirmed the five runtime classifier adapters exist: Claude, Codex, Cursor, Devin, and Pi. The four stdout adapters call `observeGate3QuestionDelivery` in the `process.stdout.write` callback; Pi calls it after constructing output and immediately before return.

## Findings

### P1 — detailed Cursor catalog omits the load-bearing delivery contract (must-fix)

- **File/lines:** `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:28-36,48-60`.
- **Current statement:** the catalog describes confirmed event paths, the generic pre-tool event, Gate-3 prebinding/enforcement, the dormant prompt classifier, and a current hook matrix.
- **Contradicted/incomplete contract:** it omits that `gate3DeliveryConfirmed` requires an object receipt with `hostReceiptStatus: observed`, matching question hash, and `lifecycleEpoch >= 1`; epoch 0 never confirms. It also omits that the stdout adapters observe only after the question has been written, Pi/return-based hooks observe at final pre-return, and `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` is opt-in/default-off and fail-open.
- **Why must-fix:** this is the detailed current-state catalog and names the exact classifier/enforcement adapters. A follow-on maintainer can otherwise infer that registration or a configured receipt is sufficient for delivery confirmation.

### P2 — root Cursor catalog summary omits the same contract (optional)

- **File/lines:** `.opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:69-77`.
- **Current statement:** the root inventory says the Cursor layer maps lifecycle/tool events to policy and that several paths have confirmed delivery, while prompt-submit/pre-compact remain unconfirmed.
- **Inaccuracy/omission:** it does not identify the observed-receipt epoch floor, post-emission observer placement, or the default-off suppression flag.
- **Why optional:** this is a high-level index that explicitly delegates details to the detailed catalog at line 77. It should be aligned for discoverability, but the detailed catalog is the must-fix authority.

### Ruled out as stale

- `cursor-hooks-and-spec-gate.md:28` says the generic `preToolUse` event observes tool calls before execution. That is a different event adapter from the Gate-3 question observer and is accurate.
- `cursor-hooks-and-spec-gate.md:32,55,58` says the Cursor prompt classifier remains registered on an undelivered event. The changed behavior does not claim that Cursor's host event becomes delivered; it only defines post-emission observation for a question that reaches an adapter.
- The shared-core README is already aligned at `README.md:30`; it is not part of the requested target surface and is evidence for the catalog findings, not a stale target.

## Questions Answered

- Q-002: The detailed Cursor catalog is a must-fix P1 omission; the root catalog is a P2 optional omission because it is an index pointing to the detailed entry.
- Q-003: The detailed catalog is authoritative. The root catalog is authoritative as an inventory but intentionally less detailed. Neither is an illustrative example.

## Questions Remaining

- Search all 1,498 catalogs for paraphrased receipt/delivery assertions that do not use the new symbol names.
- Check whether any feature-catalog entry outside the Cursor hub owns activation-matrix or policy-sink language and therefore needs a separate finding.
- Confirm whether the playbook corpus has an optional documentation gap worth recording without mislabeling it as stale.

## Next Focus

Run a paraphrase-oriented catalog sweep and inspect every non-Cursor catalog match that mentions Gate-3, policy delivery, activation matrices, or suppression flags.

