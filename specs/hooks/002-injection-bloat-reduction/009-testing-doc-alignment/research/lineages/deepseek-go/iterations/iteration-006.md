# Iteration 6: Repo-wide paraphrase net + severity ranking groundwork

## Focus

Run a final paraphrase-variant net over every live playbook and catalog file to catch indirect assertions of the old delivery contract, then lay the severity-ranking and must-fix/optional groundwork for synthesis.

## Findings

### F21 — Paraphrase net: zero indirect assertions of the changed contract

Grep across all live feature-catalog + manual-testing-playbook files for indirect delivery-contract language (`repeat.*question`, `already.*asked`, `re-emit`, `duplicate.*question`, `re-relay`, `suppress.*question`, `question.*twice`, `observed.*delivery`, `emitted.*delivery`) returned ~50 files; every one inspected (ambiguous-defer, mixed-marker-ambiguity, context-first-intake, continue-last-session, graph-events-emission, pre-push-naming-enforcement, search-exec-mode, question-conflict-ownership, query-decomposition, research-agent-investigation, hallucination-fixture, worktree scenarios) uses "question" for routing disambiguation, intake questions, graph-event question nodes, or session-continuity follow-ups — NONE reference Gate-3 delivery, receipt, epoch, or suppression. Zero false positives converted to findings.

### F22 — The changed-contract surface in playbooks/catalogs is confirmed clean except for one count + two omission classes

Consolidated verdict across 6 iterations:
1. **One stale playbook assertion (authoritative test contract):** `spec-mutation-gate-enforce.md:57-63` — `# tests 67` → the shipped suite reports **87** (verified run), plus the step-2 core-suite invocation does not neutralize child/env vars so it fails in a child-dispatched env (F2/F6).
2. **Catalog omission class A (changed-surface catalogs):** `cursor-hooks-and-spec-gate.md` (root + detailed) and `hooks-and-plugin/claude-hook.md` describe the spec-gate/advisor adapter surfaces without the post-emission observers, the epoch>=1 floor, or `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` (F9/F11). Luna lineage independently flags the two Cursor catalogs.
3. **Catalog omission class B (flag-reference layer):** `feature-flag-reference/` catalog + playbook sets have zero spec-gate env coverage (F15). `ENV-REFERENCE.md` now documents these (fixed at 2af2feb113) but the feature-catalog/playbook flag layers were not swept.

### F23 — No frozen-behavior documentation error exists (Q4 answered affirmatively)

No playbook or catalog mislabels the frozen shadow-delivery behavior. The flags-off/byte-identical/fail-open behavior is documented as intended in the READMEs updated at 2af2feb113 (`ENV-REFERENCE.md:479`, `lib/spec-gate/README.md:30`) and in the code headers — and NO playbook/catalog entry describes suppression as active, which means none of the frozen-behavior guarantees is contradicted anywhere. The "deliberately-frozen, do not flag" constraint produced zero flags by design.

### F24 — Severity framing for synthesis

- **P0 (blocking, must-fix before release):** none — no playbook/catalog asserts a false contract about the changed behavior.
- **P1 (must-fix, authoritative test contract):** the `spec-mutation-gate-enforce.md` test-count drift (67→87) — an operator running the authoritative Gate-3 playbook would see a FAIL against a green suite and misdiagnose a regression. The child-env neutrality note on step-2 is part of the same must-fix.
- **P2 (optional, omission-stale catalogs):** class A (cursor + claude-hook catalogs add delivery-observation/epoch/suppression entries), class B (feature-flag-reference adds spec-gate env rows). These are additive documentation, matching the README fixes already shipped.

## Sources Consulted

- [SOURCE: ~50-file paraphrase grep over live playbook + catalog surface, spot-checked all plausible hits]
- [SOURCE: iterations 1-5 consolidated findings F1-F20]
- [SOURCE: sibling luna lineage reconciliation (F20)]

## Assessment

newInfoRatio: 0.1
noveltyJustification: F21 clears the final indirect-language surface; F22/F23/F24 consolidate the full sweep into severity framing. Confirmatory capstone of the review angle; max-iterations policy keeps the loop running but the finding set is closed.

Key questions answered: Q1-Q5 all answered with evidence.

## Reflection

What worked: the paraphrase net closed the last conceivable gap (indirect suppression language); consolidating across iterations produced a clean severity framing.

What failed / ruled out: Ruled out every paraphrase-sweep hit as unrelated. Ruled out frozen-behavior mislabeling (none exists).

## Recommended Next Focus

Iteration 7: Broaden the review angle per the max-iterations stop policy — verify the mk-spec-gate plugin's own catalog/README references are complete, check the `.opencode/plugins/README.md` and the plugins-hooks completion/session playbooks for delivery vocabulary, and confirm no catalog entry references the shadow-delivery shadow id (`shadow.gate3-delivery-suppression.v1`) or its receipts API.
