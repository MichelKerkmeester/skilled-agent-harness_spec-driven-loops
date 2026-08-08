# Iteration 1 — surface enumeration and matched-document triage

## Focus

Enumerate the requested manual-testing-playbook and feature-catalog surfaces, run the changed-subject grep, and separate authoritative Gate-3 documents from unrelated keyword matches.

## Actions Taken

- Counted `41` `manual-testing-playbook.md` files and `1,498` Markdown files under `*feature-catalog*`.
- Ran the requested subject sweep. It matched three root playbooks: the cli-codex, cli-cursor, and cli-opencode playbooks. It matched a wider catalog set because generic `Gate-3` and `MK_SPEC_GATE` references occur in unrelated governance, doctor, dispatch, and session-isolation entries.
- Ran a second high-signal sweep for `lifecycleEpoch`, `observeGate3QuestionDelivery`, `buildGate3ObservedReceipt`, `shouldSuppressGate3Delivery`, `gate3DeliveryConfirmed`, epoch-floor language, post-emission language, observed receipts, and suppression flag language. It returned no hits in the target playbook/catalog surfaces.
- Read the matched Cursor scenarios and the two current-state Cursor catalog entries. The playbook scenarios describe event firing, prompt-event non-delivery, and session-start prebinding; they do not assert the changed receipt or observer contract.

## Findings

### Provisional P1 — authoritative Cursor catalogs omit the changed delivery contract (must-fix candidate)

- `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:28-36` describes confirmed event paths, Gate-3 prebinding, `spec-gate-enforce.mjs`, and the still-unconfirmed prompt-submit classifier, but does not state that delivery confirmation requires an observed receipt with `lifecycleEpoch >= 1`, that epoch 0 cannot confirm, that stdout adapters observe strictly after emission, or that `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` is default-off/fail-open.
- `.opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:69-73` gives the root catalog's current-reality summary for the same Cursor surface and likewise omits those load-bearing constraints.

This is an omission rather than a contradicted assertion. It remains provisional until the later iterations confirm that these entries are authoritative catalog contracts rather than deliberately high-level summaries.

### No stale playbook assertion found in this pass

- `cli-cursor/manual-testing-playbook/manual-testing-playbook.md:456-464` and its linked CU-014 scenario document `beforeSubmitPrompt`/`stop` host non-delivery and a dormant classifier. That remains compatible with the changed behavior; it does not claim that an emitted question is observed before stdout or that an epoch-0 receipt confirms delivery.
- CU-013 (`hooks/confirmed-fires-smoke-test.md:15-33`) tests `sessionStart`, `preToolUse`, and `sessionEnd` delivery only.
- CU-020 (`hooks/spec-gate-prebind-session-start.md:15-33,46-48`) tests startup state and exemption rows only.
- The Codex and OpenCode matches are generic Gate-3/guard references or scenario metadata, not assertions about the changed delivery state machine.

## Questions Answered

- Q-004: The first-pass surface counts and broad triage are complete. No direct stale assertion was found in the matched playbooks; the broad catalog matches require semantic filtering.

## Questions Remaining

- Confirm whether the two Cursor catalog omissions should be a single consolidated P1 finding or separate entries.
- Check all linked Cursor hook scenarios and root catalog validation tables for a hidden expectation about observer timing or receipt status.
- Spot-check the remaining matched catalog entries and search for paraphrases such as “confirmed delivery,” “configured receipt,” and activation-matrix evidence.

## Next Focus

Audit every matched playbook scenario and its source/validation tables, then classify any omission as authoritative, illustrative, must-fix, or optional.

