# Iteration 10: Final cross-check and de-duplication (broaden/final)

## Focus

Final pass: a systematic whole-doc scan for phantom validator rule-script references, plus de-duplication reconciliation across the inventory. The systematic `check-*.sh` existence scan (which a single grep missed) surfaced a cluster of phantom rule scripts.

## Findings

### F10-01 — Docs reference four validator shell scripts that do not exist (P1 misleading)

**Doc claims (quoted), the phantom rule scripts:**
- `references/structure/phase-definitions.md:119` — "The validator's phase-parent branches in `check-files.sh`, `check-level-match.sh`, `check-anchors.sh`, `check-section-counts.sh`, and `check-template-headers.sh` skip Level-N expectations when this returns true."
- `references/validation/template-compliance-contract.md:236` — same `check-anchors.sh` / `check-section-counts.sh` / `check-template-headers.sh` list.
- `feature-catalog/tooling-and-scripts/template-composition-system.md:51` — "`runtime/cli/rules/check-sections.sh` | Validator | Verifies Level-gated sections after rendering."
- `manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:153,161` — "Individual Rule: SECTION_COUNTS (check-section-counts.sh)."
- `references/templates/level-selection-guide.md:167,191` — "### check-section-counts.sh".

**Actual behavior:** None of `check-anchors.sh`, `check-section-counts.sh`, `check-sections.sh`, `check-template-headers.sh` exist under `runtime/cli/rules/` (all verified MISSING). The corresponding validations are enforced elsewhere: `ANCHORS_VALID` is a **native orchestrator rule** (`validator-registry.json` → `native:orchestrator`; enforcement at `runtime/lib/validation/orchestrator.ts:685,724-725`), not a shell script; the section-count/content checks are folded into the COMPLEXITY/FILE_EXISTS native rules. The docs describe the validator as invoking non-existent scripts.

- Doc: [SOURCE: references/structure/phase-definitions.md:119,236]; [SOURCE: feature-catalog/tooling-and-scripts/template-composition-system.md:51]; [SOURCE: manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:153,161]; [SOURCE: references/templates/level-selection-guide.md:167,191]
- Actual: [SOURCE: runtime/cli/rules/] (four scripts missing); [SOURCE: runtime/cli/lib/validator-registry.json] (ANCHORS_VALID → native:orchestrator); [SOURCE: runtime/lib/validation/orchestrator.ts:685,724]
- Severity: P1
- One-line fix: replace the four phantom script names with the actual enforcement (native `ANCHORS_VALID` / `CROSS_ANCHOR_CONTAMINATION` node rules + the complexize/file-exists rule scripts), or point at `validator-registry.json`.

## De-duplication reconciliation (this pass)

- **F4-01 / F6-02** (both about the `/doctor` route set) — deliberately kept BOTH: F4-01 is doc-vs-code (routes absent from `_routes.yaml`), F6-02 is doc-vs-doc count/membership disagreement. They cite different doc pairs; folding them would lose one dimension.
- **F7-01** `constitutional/` phantom — overlaps F2's retired-capability framing but is a structural README-tree listing, kept as its own finding.
- **F8-02 / F10-01** — F8-02 (level-selection-guide `check-section-counts.sh`) is now subsumed as one instance of the broader F10-01 cluster; F10-01 generalizes it across five docs and adds three more phantom scripts. F8-02 is retained as the narrowly-scoped record.

## Sources Consulted

- references/structure/phase-definitions.md:119; references/validation/template-compliance-contract.md:236
- feature-catalog/tooling-and-scripts/template-composition-system.md:51
- manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:153,161
- references/templates/level-selection-guide.md:167,191
- runtime/cli/rules/ (dir listing); runtime/cli/lib/validator-registry.json; runtime/lib/validation/orchestrator.ts:685,724
- references/cli/daemon-cli-reference.md, shared-smart-router.md; references/config/environment-variables.md (references/cli + config groups — decommission-aware, no new finding)

## Assessment

- newInfoRatio: 0.9
- Novelty justification: F10-01 is a new systematic-scan discovery (four phantom rule scripts across five docs) that the earlier one-off greps missed; the consolidate/reconcile notes are not findings.
- Confidence notes: F10-01 confirmed by a systematic existence scan over every `runtime/cli/rules/check-*.sh` cited in docs, plus registry and orchestrator evidence that ANCHORS_VALID is native, not a shell script.

## Reflection

- What worked: running an exhaustive existence scan over ALL doc-referenced rule scripts (rather than relying on one-off greps) surfaced a multi-doc cluster that single-query passes missed — the strongest per-tool-call yield of any iteration.
- What failed: the earlier F8-02 caught only one instance of the cluster; the systematic scan revealed three more phantom scripts and four more doc locations.
- Ruled out: references/cli and references/config groups — correctly decommission-aware; daemon-cli-reference.md correctly scopes the skill-advisor daemon (still live) vs spec-folder retrieval (no daemon, no CLI page).

## Recommended Next Focus

Synthesis — consolidate all 14 findings into `research.md`, deduplicate, and record `stopReason=maxIterationsReached`.
