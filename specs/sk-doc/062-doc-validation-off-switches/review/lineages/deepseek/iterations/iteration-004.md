---
title: "Deep Review Iteration 004 — maintainability"
trigger_phrases: []
---

# Iteration 4: D4 Maintainability — overlay protocols, docs coherence, follow-up ledger

## Focus

Dimension: maintainability. Protocols executed: `feature_catalog_code` (overlay, advisory), `playbook_capability` (overlay, advisory). Files read and assessed: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md`, `.skilled/skills/sk-doc/feature-catalog/document-validation/changelog-entry-frontmatter-check.md`, `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/search-metadata/write-global-entry-metadata.md` (CHG-011), `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/nested-changelog-generator.md` (scenario 458), `.skilled/hooks/README.md`, `.skilled/hooks/shared/README.md`, `.skilled/skills/sk-doc/shared/scripts/README.md`, `.skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md`, plus the follow-up ledger items.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 8 + follow-up sweeps
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F004**: `.skilled/hooks/README.md` states the comment rule as "A comment can follow a value after a space" (`.skilled/hooks/README.md:71`) while the implemented rule and every other description say "after a space or tab" (`.skilled/hooks/shared/README.md:25`, `.skilled/hooks/hook-flags.env.example:9`, `hook-flags.cjs:99-101`). Evidence: the three cited lines; the hooks README is the operator-facing index for the flags file, so a tab-terminated value is undocumented there. Impact is documentation precision only; the behavior is correct in all four readers. Downgrade/close trigger: close as sufficient if the sentence is judged an explanation of the example's own spacing rather than the rule.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | pass | advisory | `spec-validation-rule-engine.md:29-31` vs `validate.sh:404-410`; `changelog-entry-frontmatter-check.md:22,28,30,32` vs `validate_document.py:253-258,1467,1513-1590,1666-1667` and `template-rules.json` (`documentTypes.changelog.frontmatterFields.required` = the five keys) | Catalog claims match implementation: typing by folder, entry-name regex `^(?:v\d+(?:\.\d+){1,3}|changelog-.+)\.md$`, five required keys, empty-phrase and version-phrase blocks, fixture-folder skip with the numbered-folder exemption. |
| playbook_capability | pass | advisory | CHG-011 contract vs `validate_document.py --type changelog` (accepted in `:1702`) and `grep -m1 '^name:' .skilled/skills/sk-doc/SKILL.md` → `name: sk-doc`; scenario 458 vs `nested-changelog.ts:83-84,119-123` and the existing `dist/spec-folder/nested-changelog.js` | Both scenarios' command sequences are executable as written; the playbooks are intentionally stricter than the validator floor (contract requires both identity phrases, the validator requires at least one version-naming phrase) and the two agree on the floor. |
| spec_code | pass (carried) | hard | Iteration 3 | No new contradictions in iteration 4. |
| checklist_evidence | partial (carried) | hard | Iteration 3 | Unchanged. |
| skill_agent | notApplicable | advisory | - | Spec-folder target. |
| agent_cross_runtime | notApplicable | advisory | - | Spec-folder target. |

## Claim Adjudication

No new P0 or P1 findings in this iteration — no typed packets required. F004 is P2 and does not gate convergence.

## Assessment

- New findings ratio: 1.0 (one fully-new P2)
- Dimensions addressed: maintainability
- Novelty justification: the overlay protocols were executed against real artifacts, and the docs set was read for coherence:
  - **Catalog entries** (feature_catalog_code): the two catalog files touched by this work make claims that all resolve in code — the rule-engine entry's entry-point paragraph matches the skip ordering and JSON report; the changelog-frontmatter entry's typing, regex, five-key, fixture-skip and version-phrase claims each map to specific lines (see table). No stale or missing claims found.
  - **Playbooks** (playbook_capability): CHG-011's five commands run as written (the `--type changelog` choice exists; the component-name grep prints `name: sk-doc`); scenario 458's commands reference flags the generator implements (`--json`, `--write`) and a dist build that exists (`.skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js`, present).
  - **Docs coherence**: `validation-and-enforcement.md:87-104` is a complete, accurate account (switch, sources, truthy set, notice, JSON line, precedence, coverage list, exemptions, CI, suite warning). `hooks/shared/README.md:25,75` names the four readers and the shared test. `shared/scripts/README.md:33` documents both helpers. The only imprecision found is F004.
  - **Comment hygiene** (spot check): the five changed code files carry no spec paths, packet numbers or REQ/ADR ids in comments (pattern sweep over `062-|REQ-00|ADR-|specs/sk-doc` returns nothing).
  - **Follow-up ledger accuracy**: the recorded dead `SPECKIT_SKIP_DOC_MODEL_VALIDATE` mentions are real and dead — the installer script (`install-git-hooks.sh:18,180`), the hooks README (`:103`) and the pre-commit test (`:31`) still name it, while the current `.skilled/scripts/git-hooks/pre-commit` does not read it (it states the doc-model validator moved to CI at `:6,:52`). The BOM asymmetry limitation is accurate: `hook-flags.cjs` (JS `trim()` strips U+FEFF) and `validation_switch.py` (`utf-8-sig`) drop it, while `hook-flags.sh` (grep) and `check-dist-staleness.sh` (`encoding="utf-8"`) keep it on the first name. Both are explicitly recorded as follow-ups, so neither is re-filed as a new finding.

## Ruled Out

- "A catalog claim is stale": ruled out — every claim in the two touched entries resolves in code.
- "A playbook command is impossible": ruled out — both sampled scenarios' commands are executable as written, and their referenced artifacts exist.
- "The dead-mention follow-up is inaccurate": ruled out — the mentions exist and nothing reads the variable in the current hook.
- "The BOM limitation is inaccurate": ruled out — each reader's behavior matches the limitation's description.

## Dead Ends

- Running the playbook commands end-to-end (they write a scratch draft): not attempted; the command surfaces were verified by reading the implementations and checking the artifacts exist.

## Recommended Next Focus

Iteration 5 (broadening): re-verify the carried P2 findings against their evidence, sweep the remaining unreviewed manifest areas (061 child docs, retrieval docs, remaining guarded validators), and check for anything the four dimensions did not touch (cross-cutting risks, resource-map absence note, AC-coverage exemption).

Review verdict: PASS
