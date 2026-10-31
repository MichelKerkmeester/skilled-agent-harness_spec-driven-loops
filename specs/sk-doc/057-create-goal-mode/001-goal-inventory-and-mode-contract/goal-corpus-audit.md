---
title: "Goal Corpus Audit: Counts, Defects, and Reproductions"
description: "Measured goal-document census, corpus defect classes, validator boundaries, and reproduced examples."
trigger_phrases:
  - "goal corpus audit"
  - "goal validator coverage"
  - "goal binding gaps"
  - "goal placeholder census"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Goal Corpus Audit: Counts, Defects, and Reproductions

## 1. DENOMINATOR AND ROLE SPLIT

The denominator command was `find specs -type f -name goal.md ! -path '*/z_archive/*' | wc -l`. Its observed output was `296`. The committed scan summary records the same command family, a denominator of 296 and `exitZero: 296`, so every one of the 296 `goal.cjs packet` invocations exited 0. The role split is 9 top-level goals, 17 phase-parent goals and 270 phase-child goals. (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/goal-corpus-scan.json:2-10`; scan method: `scratch/goal-corpus-scan.cjs:37-43,61-79,82-96`.)

The corpus scan emits one row per goal. Its rows retain the packet path, command, exit status, durable character count, budget state, criterion count, placeholder flags, binding style and child coverage fields. (`scratch/goal-corpus-scan.cjs:37-79`; `scratch/goal-corpus-scan.json:23-5510`.) The classifications below report that script's mechanical tests, not a human verdict on the quality or intent of every goal. (`scratch/goal-corpus-scan.cjs:45-78`.)

---

## 2. PARENTS OVER THE 4,000-CHARACTER BUDGET

Four goals measured over budget. The scan recorded `packet_budget=over` and these durable lengths. (`scratch/goal-corpus-scan.json:11,23-5510`; the scanner compares the CLI budget field at `scratch/goal-corpus-scan.cjs:41-42,67-68,87`.)

- `specs/sk-code/007-sk-code-obsidian-surface` — 4,734 characters.
- `specs/sk-design/018-sk-design-parent-v2` — 5,013 characters.
- `specs/sk-design/019-sk-design-diagram-upgrade` — 5,513 characters.
- `specs/sk-git/028-crawlable-commit-history` — 5,758 characters.

The `goal.cjs packet` reproductions returned those same character counts and `packet_budget=over` for all four paths; each command exited 0. (`node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace "$PWD"`; see the recorded runs in section 11.)

---

## 3. OBJECTIVE PLACEHOLDERS

The scan flagged placeholder objectives in 15 goals. Its objective test matches an objective enclosed in square brackets or the template phrase `[One sentence`; this is a text-pattern count. (`scratch/goal-corpus-scan.json:13,23-5510`; `scratch/goal-corpus-scan.cjs:45,57-60,89`.)

- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/026-embedded-style-reference`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/027-evilcharts-style-reference`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/028-closeout`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/029-holding-the-boundaries`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/031-full-family-coverage`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/032-evilcharts-stock`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/033-visual-verification`
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/013-recorded-adjacent-defects`
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/014-post-work-review`
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/015-review-confirmed-findings`
- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission`
- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/010-deep-research-residue`
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/010-repo-wide-goal-research`
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/012-open-items-research`

---

## 4. DECISION AND CRITERION PLACEHOLDERS

The scan flagged placeholder decision text in 17 goals and placeholder criterion text in 17 goals. These are the same 17 packet paths. Its checks look for the literal decision marker `| D1 | [The decision` and bracketed completion bullets. (`scratch/goal-corpus-scan.json:12,23-5510`; `scratch/goal-corpus-scan.cjs:46-47,57-60,88`.)

- `specs/cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin`
- `specs/cli-jev/001-cli-jev-creation/002-cli-jev-skill-packet`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/026-embedded-style-reference`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/027-evilcharts-style-reference`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/028-closeout`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/029-holding-the-boundaries`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/031-full-family-coverage`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/032-evilcharts-stock`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/033-visual-verification`
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/013-recorded-adjacent-defects`
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/014-post-work-review`
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/015-review-confirmed-findings`
- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission`
- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/010-deep-research-residue`
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/010-repo-wide-goal-research`
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/012-open-items-research`

The 15 objective-placeholder paths in section 3 are a subset of these 17; the two additional paths are the two `cli-jev` goals. The scan summary reports 17 goals with any placeholder marker, not 49 distinct goals, because the placeholder categories overlap. (`scratch/goal-corpus-scan.json:11-14,23-5510`; `scratch/goal-corpus-scan.cjs:57-60,81-90`.)

---

## 5. CRITERION COUNTS OUTSIDE THREE TO SEVEN

The scan counted 36 goals with fewer than three or more than seven checked completion bullets. The count is mechanical: it extracts checkbox bullets from the completion anchor and flags counts below 3 or above 7. (`scratch/goal-corpus-scan.json:14,23-5510`; `scratch/goal-corpus-scan.cjs:46-47,69-70,90`.)

- `specs/cli-external-orchestration/071-cli-hermes-creation` — 11.
- `specs/cli-jev/002-cli-jev-hub-migration/005-playbook-reverification-and-closeout` — 10.
- `specs/hooks/011-pi-fast-mode-w-subagent-support` — 0.
- `specs/sk-code/007-sk-code-obsidian-surface` — 0.
- `specs/sk-communication/006-sk-communication-clarity` — 9.
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/038-chart-command-alignment` — 2.
- `specs/sk-design/018-sk-design-parent-v2/003-md-generator-as-mode` — 0.
- `specs/sk-design/018-sk-design-parent-v2/004-chart-and-diagram-cutover` — 0.
- `specs/sk-design/018-sk-design-parent-v2/005-closure-and-routing-proof` — 0.
- `specs/sk-design/018-sk-design-parent-v2/006-design-mode-and-command-rename` — 0.
- `specs/sk-design/018-sk-design-parent-v2/007-close-inherited-failures` — 0.
- `specs/sk-design/018-sk-design-parent-v2/008-fundamentals-beyond-ui` — 0.
- `specs/sk-design/018-sk-design-parent-v2/009-router-conformance` — 0.
- `specs/sk-design/018-sk-design-parent-v2/010-readme-human-voice` — 0.
- `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair` — 0.
- `specs/sk-design/018-sk-design-parent-v2/012-template-screenshots` — 0.
- `specs/sk-design/018-sk-design-parent-v2` — 0.
- `specs/sk-design/019-sk-design-diagram-upgrade` — 11.
- `specs/sk-git/028-crawlable-commit-history` — 10.
- `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening` — 10.
- `specs/system-deep-loop/036-deep-loop-innovation/scratch` — 0.
- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door` — 8.
- `specs/system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria/003-restore-level-upgrade-and-vocabulary-invariance` — 2.
- `specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing` — 8.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/anchor-inject/ws/specs/t/001-fixture` — 1.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/broken-fence` — 0.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/frontmatter-boundary/exact-fence` — 1.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/frontmatter-boundary/no-frontmatter-at-all` — 1.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/frontmatter-boundary/trailing-space-fence` — 1.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/hostile/outside` — 1.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/hostile/ws/specs/t/001-fixture` — 1.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/replay/ws/specs/t/001-alpha` — 1.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/ws/specs/t/001-fixture` — 1.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/009-close-open-decisions` — 8.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification/011-goal-drift-remediation` — 11.
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification` — 8.

The scan includes scratch fixture paths because its scope is every discovered non-archive `goal.md`; it does not limit the count to phase-parent and phase-child roles. (`scratch/goal-corpus-scan.cjs:14-21,37-47,63-70`.)

---

## 6. BINDING TABLES BY STYLE

The scan found 55 goals with a binding anchor: 16 whose rows all match its exact per-child-row pattern and 39 classified as range, glob or prose style. The pattern requires a table row whose second cell is a backticked `NNN-slug/goal.md`; it is the scan's classifier, not a validator result. (`scratch/goal-corpus-scan.json:17-20,23-5510`; `scratch/goal-corpus-scan.cjs:48-52,72-74,93`.)

The 16 exact per-child-row packets are:

- `specs/mcp-tooling/019-official-obsidian-cli`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul`
- `specs/sk-design/019-sk-design-diagram-upgrade`
- `specs/sk-doc/049-sk-create-frontmatter`
- `specs/sk-doc/052-routing-completeness`
- `specs/sk-doc/059-skill-changelog-retrofit`
- `specs/sk-doc/060-create-goal-mode`
- `specs/sk-git/028-crawlable-commit-history`
- `specs/system-skill-advisor/023-semantic-lane-enablement`
- `specs/system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria`
- `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon`
- `specs/system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening`
- `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission`
- `specs/system-speckit/033-system-speckit-v4/032-recorded-findings-closure`
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification`
- `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration`

The 39 range, glob or prose-style packets are:

- `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research`
- `specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin`
- `specs/cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support`
- `specs/cli-external-orchestration/071-cli-hermes-creation/004-cli-hermes-skill-packet`
- `specs/cli-external-orchestration/071-cli-hermes-creation/005-hermes-runtime-folder`
- `specs/cli-external-orchestration/071-cli-hermes-creation/006-hermes-hook-and-plugin-layer`
- `specs/cli-external-orchestration/071-cli-hermes-creation/007-hermes-model-registry-and-routing`
- `specs/cli-external-orchestration/071-cli-hermes-creation/008-hermes-playbook-and-catalog`
- `specs/cli-external-orchestration/071-cli-hermes-creation/009-docs-governance-and-closeout`
- `specs/cli-external-orchestration/071-cli-hermes-creation`
- `specs/cli-jev/001-cli-jev-creation`
- `specs/cli-jev/002-cli-jev-hub-migration`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/001-reclaim-deepseek-direct-ownership`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/002-port-cache-economics`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/003-port-retry-loop-guard`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/004-port-hash-verified-edits`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/005-remove-deep-pi`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/006-reconcile-extension-documentation`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi`
- `specs/sk-communication/006-sk-communication-clarity`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart`
- `specs/sk-design/018-sk-design-parent-v2/003-md-generator-as-mode`
- `specs/sk-design/018-sk-design-parent-v2/004-chart-and-diagram-cutover`
- `specs/sk-design/018-sk-design-parent-v2/005-closure-and-routing-proof`
- `specs/sk-design/018-sk-design-parent-v2/006-design-mode-and-command-rename`
- `specs/sk-design/018-sk-design-parent-v2/007-close-inherited-failures`
- `specs/sk-design/018-sk-design-parent-v2/008-fundamentals-beyond-ui`
- `specs/sk-design/018-sk-design-parent-v2/009-router-conformance`
- `specs/sk-design/018-sk-design-parent-v2/010-readme-human-voice`
- `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair`
- `specs/sk-design/018-sk-design-parent-v2/012-template-screenshots`
- `specs/sk-design/018-sk-design-parent-v2`
- `specs/sk-doc/049-sk-create-frontmatter/009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract`
- `specs/sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing`
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review`
- `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening`
- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door`
- `specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing`
- `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research`

---

## 7. PHASE CHILDREN WITHOUT GOALS

Twelve packets have one or more detected phase children without a `goal.md`. The scan summary's `parentsWithGoallessChildren: 10` counts rows that both have a binding section and missing child goals. Two additional parent packets have missing child goals but no binding section, so the union is 12. Four of the 12 are phase-child packets that themselves contain deeper children; the scan's role field is based on whether the goal's own folder sits inside a packet. (`scratch/goal-corpus-scan.json:15-21,23-5510`; `scratch/goal-corpus-scan.cjs:29-35,44,53-57,63,77,91-95`.)

- `specs/cli-external-orchestration/071-cli-hermes-creation` — 6 child folders lack a goal.
- `specs/hooks/011-pi-fast-mode-w-subagent-support` — 3 lack a goal; this packet also has no binding section.
- `specs/sk-code/007-sk-code-obsidian-surface` — 13 lack a goal; this packet also has no binding section.
- `specs/sk-communication/006-sk-communication-clarity` — 16 lack a goal.
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart` — 14 deeper child folders lack a goal; this row is itself a phase-child goal.
- `specs/sk-design/018-sk-design-parent-v2` — 2 lack a goal.
- `specs/sk-design/019-sk-design-diagram-upgrade` — 1 lacks a goal.
- `specs/sk-doc/049-sk-create-frontmatter` — 7 lack a goal.
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review` — 2 deeper child folders lack a goal; this row is itself a phase-child goal.
- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door` — 3 lack a goal.
- `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission` — 1 lacks a goal; this row is itself a phase-child goal.
- `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration` — 10 deeper child folders lack a goal; this row is itself a phase-child goal.

The scan's `parentsWithUnboundChildren` count is 0, but its algorithm only compares children with goals against paths parsed from exact per-child rows. It leaves `unboundChildren` empty for range, glob or prose tables. Therefore zero is not evidence that the broader binding styles cover every phase. (`scratch/goal-corpus-scan.json:15-21,23-5510`; `scratch/goal-corpus-scan.cjs:50-56,91`.)

---

## 8. PARENTS WITH CHILDREN BUT NO BINDING SECTION

The summary counts two non-child parent packets with detected children and no binding anchor. (`scratch/goal-corpus-scan.json:16,23-5510`; `scratch/goal-corpus-scan.cjs:53,72-78,92`.)

- `specs/hooks/011-pi-fast-mode-w-subagent-support`
- `specs/sk-code/007-sk-code-obsidian-surface`

The count is based on the scan's `parentWithoutBinding` predicate, which excludes rows classified as phase-child. (`scratch/goal-corpus-scan.cjs:44,53,77`.)

---

## 9. CHILDREN THAT CARRY A BINDING SECTION

Forty goals classified as phase children also carry a binding section. This count is derived from the corpus rows' `role` and `hasBinding` fields; the scan classifies a child by the presence of a parent `spec.md`, then records the binding anchor separately. (`scratch/goal-corpus-scan.cjs:44,48,61-78`; `scratch/goal-corpus-scan.json:23-5510`.)

- `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research`
- `specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin`
- `specs/cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support`
- `specs/cli-external-orchestration/071-cli-hermes-creation/004-cli-hermes-skill-packet`
- `specs/cli-external-orchestration/071-cli-hermes-creation/005-hermes-runtime-folder`
- `specs/cli-external-orchestration/071-cli-hermes-creation/006-hermes-hook-and-plugin-layer`
- `specs/cli-external-orchestration/071-cli-hermes-creation/007-hermes-model-registry-and-routing`
- `specs/cli-external-orchestration/071-cli-hermes-creation/008-hermes-playbook-and-catalog`
- `specs/cli-external-orchestration/071-cli-hermes-creation/009-docs-governance-and-closeout`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/001-reclaim-deepseek-direct-ownership`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/002-port-cache-economics`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/003-port-retry-loop-guard`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/004-port-hash-verified-edits`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/005-remove-deep-pi`
- `specs/hooks/016-cache-optimizer-absorbs-deep-pi/006-reconcile-extension-documentation`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul`
- `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart`
- `specs/sk-design/018-sk-design-parent-v2/003-md-generator-as-mode`
- `specs/sk-design/018-sk-design-parent-v2/004-chart-and-diagram-cutover`
- `specs/sk-design/018-sk-design-parent-v2/005-closure-and-routing-proof`
- `specs/sk-design/018-sk-design-parent-v2/006-design-mode-and-command-rename`
- `specs/sk-design/018-sk-design-parent-v2/007-close-inherited-failures`
- `specs/sk-design/018-sk-design-parent-v2/008-fundamentals-beyond-ui`
- `specs/sk-design/018-sk-design-parent-v2/009-router-conformance`
- `specs/sk-design/018-sk-design-parent-v2/010-readme-human-voice`
- `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair`
- `specs/sk-design/018-sk-design-parent-v2/012-template-screenshots`
- `specs/sk-doc/049-sk-create-frontmatter/009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract`
- `specs/sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing`
- `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review`
- `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening`
- `specs/system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria`
- `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon`
- `specs/system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening`
- `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission`
- `specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing`
- `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research`
- `specs/system-speckit/033-system-speckit-v4/032-recorded-findings-closure`
- `specs/system-speckit/033-system-speckit-v4/038-goal-unification`
- `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration`

---

## 10. WHAT THE VALIDATOR CHECKS AND MISSES

The validator extracts the durable slice after frontmatter and before the log anchor. It raises `SPECDOC_SUFFICIENCY_005` when the slice is longer than the configured limit. It then looks for a binding anchor; if the anchor is absent, the goal-specific validator returns without a binding diagnostic. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1030-1067`.)

When a binding anchor exists, the validator only examines targets returned from `bindingRowTarget`. That function reads the second table cell, accepting a Markdown link target, a backticked path or a plain cell containing `/` or `\\`. Blank cells, separator rows and cells without a path-like marker are ignored. For a parsed target it checks literal path existence and that the resolved path remains inside the packet; a missing or escaping target produces `SPECDOC_SUFFICIENCY_006`. It does not parse the phase column, expand ranges or globs, infer omitted phases, require a `goal.md` filename, or verify that every child has a row. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080,1083-1109,1111-1134`.)

Those limits explain why the scan can report 39 range, glob or prose tables and why `parentsWithUnboundChildren: 0` is restricted to the scan's exact-row method. The validator also does not enforce the template's three-to-seven criterion guidance or detect bracketed objective, decision or criterion placeholders. Therefore the scan's 36 criterion-count outliers and 17 placeholder-bearing goals are not implied to be validator failures. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,99-105`; `scratch/goal-corpus-scan.cjs:48-60,69-78`.)

---

## 11. REPRODUCTIONS FROM THE SOURCE AUDIT

Section 4 of `wave1-goal-system-audit.md` cites four defect examples: a child placeholder, a criterion that depends on another file, a stale child count and a missing phase binding. Each was reproduced below with read-only commands. The audit's additional observation that three sample child objectives describe distinct phase work is a positive example, not a defect. (`scratch/wave1-goal-system-audit.md:39-45`.)

**Placeholder objective and criteria.** Command: `node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite --workspace "$PWD"`. Relevant output: `packet_durable_chars=1718`, `packet_budget=unknown`, and the `chat_slice` contains `**Objective:** [One sentence. What this packet is for. Not how, not progress.]`, `| D1 | [The decision, stated so a reader can tell whether work honors it] |` and `[A check whose answer is an exit code, a count, or a named artifact]`. Exit status: 0. (`scratch/wave1-goal-system-audit.md:41`; goal file: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite/goal.md:43`; observed CLI output.)

**Criterion requiring another file to judge.** Command: `node .skilled/hooks/goal/bin/goal.cjs packet specs/system-speckit/033-system-speckit-v4/010-goal-file-addon --workspace "$PWD"`. Relevant output: the `objective_slice` includes `- Every phase reports its acceptance criteria closeable`, while the goal's completion anchor says criteria should be checkable without opening another file. Exit status: 0. Calling that criterion dependent on other files is a human judgment, not a scan count. (`scratch/wave1-goal-system-audit.md:42`; `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md:84-90`; observed CLI output.)

**Criterion says six children while the binding rows name eight.** Command: `node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-git/028-crawlable-commit-history --workspace "$PWD"`. Relevant output: `packet_durable_chars=5758`, `packet_budget=over`, the objective slice includes `all six children`, and the `chat_slice` binding table contains rows 001 through 008. Exit status: 0. (`scratch/wave1-goal-system-audit.md:43`; `specs/sk-git/028-crawlable-commit-history/goal.md:81-90,100-115`; observed CLI output.)

**Phase 007 exists in the phase map but has no child goal or binding row.** Command: `node .skilled/hooks/goal/bin/goal.cjs packet specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission --workspace "$PWD"`. Relevant output: the `chat_slice` binding rows end at `006-legacy-memory-surface-inventory`; the parent criterion text is also printed. Exit status: 0. The phase map names `007-deep-review-remediation` at `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md:164`. Command: `ls -l specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/007-deep-review-remediation/goal.md`. Relevant output: `No such file or directory`. Exit status: 1. Command: `find specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission -mindepth 2 -maxdepth 2 -type f -name goal.md -print | sort`. Relevant output: six child `goal.md` paths for phases 001 through 006, with no phase-007 path. Exit status: 0. (`scratch/wave1-goal-system-audit.md:44`; parent goal: `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md:66-73`; observed command outputs.)

**Phase scaffold does not create the parent goal.** `create.sh` was not run. The parent goal log records the `create.sh --phase --level 2 --with-goal --track sk-doc --number 060` scaffold and states that it wrote child `goal.md` files but no parent goal; it records that this parent was rendered separately with the inline renderer at `--level phase`. (`specs/sk-doc/060-create-goal-mode/goal.md:129,137`.) The script source builds the fresh phase parent spec, then calls `scaffold_contract_docs` inside the loop that creates each child; that contract helper adds `goal.md` when `WITH_GOAL` is true. (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1275-1336,1492-1504,444-464`.)

---

## 12. HUMAN REVIEW: CRITERION QUALITY

Criterion self-checkability is a human-review list, not a corpus count. The scan counts checkbox bullets but does not determine whether another file is needed to judge a criterion. (`scratch/goal-corpus-scan.cjs:46-47,69-70`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:99-105`.)

- In `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md:89`, “Every phase reports its acceptance criteria closeable” depends on knowing the acceptance state of each phase; judging it self-contained requires reviewing the referenced phase evidence. This is a human judgment.
- In `specs/sk-git/028-crawlable-commit-history/goal.md:111`, the criterion says “all six children,” while the same goal lists eight binding rows at `specs/sk-git/028-crawlable-commit-history/goal.md:83-90`. The mismatch is observable in the document; deciding its intended meaning is human review.
- The audit describes child objectives in `specs/sk-git/028-crawlable-commit-history/001-research/goal.md:43`, `specs/sk-git/028-crawlable-commit-history/002-format-decision/goal.md:43` and `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/001-manifest-and-goal-template/goal.md:43` as phase-specific rather than progress reports. That qualitative distinction is judgment, not a measured scan field. (`scratch/wave1-goal-system-audit.md:45`; the three cited goal lines.)
