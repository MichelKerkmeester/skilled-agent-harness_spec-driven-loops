---
title: "Doc Inventory: Phase 10 documentation sweep"
description: "Every doc the OpenCode dual-compat build touched, with its sk-doc mode, validator type, check results before and after the sweep, the review findings and how each one closed."
trigger_phrases:
  - "documentation sweep doc inventory"
  - "opencode dual compat doc findings"
importance_tier: "normal"
contextType: "research"
---
# Doc Inventory: Phase 10

Each row is one doc the build touched. "Before" is the doc at HEAD (`59565c1849`), scored from pre-write copies that matched HEAD byte for byte and were removed at closeout (`scratch/decisions.txt` 17). "After" is the final tree. Each cell reads validator exit / DQI / HVR exit, from `scratch/checks/before.tsv` and `scratch/checks/after.tsv`, produced by the checker the decisions name. A type in brackets is the type the baseline row was run with. Those three READMEs fail `code_folder` on inventories that were already incomplete at HEAD, and pass `readme`, their type of record (decision 4).

## Docs

| # | Doc | sk-doc mode | Validator type | Row | Before | After |
|---|-----|-------------|----------------|-----|--------|-------|
| 1 | `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | skill | `skill` | write | 0 / 95 / 1 | 0 / 95 / 0 |
| 2 | `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | readme | `readme` | write | 0 / 86 / 1 | 0 / 86 / 0 |
| 3 | `.skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | skill (reference) | `reference` | write | 0 / 95 / 1 | 0 / 93 / 0 |
| 4 | `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | skill (reference) | `reference` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 5 | `.skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md` | skill (reference) | `reference` | write | 0 / 94 / 1 | 0 / 91 / 0 |
| 6 | `.skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md` | skill (reference) | `reference` | write | 0 / 95 / 1 | 0 / 95 / 0 |
| 7 | `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md` | skill (reference) | `reference` | write | 0 / 96 / 1 | 0 / 96 / 0 |
| 8 | `.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md` | skill (reference) | `reference` | write | 0 / 94 / 1 | 0 / 96 / 0 |
| 9 | `.skilled/skills/cli-external-orchestration/cli-opencode/references/context-budget.md` | skill (reference) | `reference` | write | 0 / 93 / 1 | 0 / 93 / 0 |
| 10 | `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | skill (reference) | `reference` | review | 0 / 94 / 0 | 0 / 94 / 0 |
| 11 | `.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | skill (asset) | `asset` | write | 0 / 95 / 1 | 0 / 95 / 0 |
| 12 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | playbook | `playbook` | write | 0 / 91 / 1 | 0 / 91 / 0 |
| 13 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/dir-flag-working-directory.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 14 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/pure-and-print-logs.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 15 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 92 / 0 |
| 16 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 17 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/cross-repo-dispatch.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 92 / 0 |
| 18 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/self-invocation-guard-nested.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 19 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/attach-remote-server.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 20 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 21 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 92 / 0 |
| 22 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 92 / 0 |
| 23 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/parallel-detached-session.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 24 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/ablation-suite.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 25 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/worker-farm-loop.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 26 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/intra-routing-recall/cross-repo.md` | playbook | `playbook_feature` | write | 0 / 95 / 1 | 0 / 95 / 0 |
| 27 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-review-agent-audit.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 28 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-research-agent-iterations.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 93 / 0 |
| 29 | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md` | playbook | `playbook_feature` | write | 0 / 91 / 1 | 0 / 92 / 0 |
| 30 | `.skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | skill (reference) | `reference` | write | 0 / 96 / 1 | 0 / 96 / 0 |
| 31 | `.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md` | skill (reference) | `reference` | write | 0 / 93 / 1 | 0 / 93 / 0 |
| 32 | `.opencode/plugins/README.md` | readme (code folder) | `code_folder` | write | 0 / 79 / 1 | 0 / 79 / 0 |
| 33 | `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | readme (code folder) | `code_folder` | write | 0 / 77 / 0 | 0 / 77 / 0 |
| 34 | `.skilled/command-support/deep/assets/compiled/README.md` | readme | `readme` | write | 0 / 91 / 1 | 0 / 91 / 0 |
| 35 | `.skilled/command-support/doctor/scripts/README.md` | readme | `readme` | review | 1 / 91 / 1 (code_folder) | 0 / 91 / 0 |
| 36 | `.opencode/plugins/tests/README.md` | readme | `readme` | write | 1 / 79 / 1 (code_folder) | 0 / 79 / 0 |
| 37 | `.skilled/skills/system-deep-loop/runtime/tests/unit/README.md` | readme | `readme` | write | 1 / 72 / 1 (code_folder) | 0 / 84 / 0 |
| 38 | `.skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` | feature catalog | `feature_catalog` | write | 0 / 88 / 1 | 0 / 88 / 0 |
| 39 | `.skilled/skills/cli-external-orchestration/feature-catalog/opencode-dual-version-dispatch/opencode-dual-version-dispatch.md` | feature catalog | `feature_catalog` | write | new | 0 / 89 / 0 |
| 40 | `.skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` | feature catalog | `feature_catalog` | write | 0 / 91 / 1 | 0 / 91 / 0 |
| 41 | `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.0.0.md` | changelog | `changelog` | write | new | 0 / 89 / 0 |

All 41 rows end at validator exit 0, DQI 77 or more, and HVR exit 0.

The docs phase 004 changed are reviewed separately (`scratch/inventory-review.tsv`, 32 docs). Each has the same validator and HVR exit before and after 004, so the sweep leaves them alone (decision 3, `scratch/checks/review-docs-note.txt`, rechecked at the end in `scratch/checks/review-docs-final.tsv`).

## Package checks

| Check | Result |
|-------|--------|
| `validate_skill_package.py .skilled/skills/cli-external-orchestration/cli-opencode` | Exit 0, 4,899 words. It failed at 5,363 words after the first wave and was cut (decision 11) |
| `validate_skill_package.py .skilled/skills/cli-external-orchestration` (hub) | Exit 0 after the manifest re-mint. Compiled routing readiness had failed `stale-manifest` (decision 14) |
| `validate_skill_package.py` on `cli-devin` and `cli-claude-code` | Exit 0 each |
| `validate-playbook-package.cjs --package .../cli-opencode/manual-testing-playbook` | Exit 0, 55 scenarios, 0 violations. One warning, HAND_TYPED_CENSUS on the root page, with the derived census equal to the typed one |
| `validate_catalog_package.py --package cli-external-orchestration` | Exit 0, 0 violations |
| `compiled-route-sync.cjs --check` | Exit 0, 55 served copies match |
| `sync-skills-hermes.cjs --check` | PASS, 68 copies in sync |

## Version checks

The v1-only search (`--command`, `--dir`, `--share`, `--port`, `--pure`, `--attach`, `--variant`, `1.3.17`) over the 41 inventory docs finds 384 hits. A context pass (`scratch/checks/tagctx.py`) reads each hit's own line, heading, table header, the text before its code fence and the doc's version note. Of the 100 hits whose own line names no version, 56 sit under a tagged heading, 26 beside tagged text and 18 under the doc's version note only, and none is untagged. The 18 note-only hits are listed in `scratch/checks/v1-hits-context.txt`, and each review read them. `rg -n "Verified against OpenCode"` over the touched docs returns no hit.

## Human voice

`hvr_scan.py` exits 0 with no hard finding on every row. The manual pass is the reviews' check 6 (human voice and sk-doc mode), run by Luna over every written doc. It raised one human-voice item, the prompt-templates ceiling of 75 of 100 from soft deductions, which is not taken (decision 12). The orchestrator's own read covered the diffs of SKILL.md, the README, the facts-bearing references and the four reworked scenarios.

## Findings

Reviews: `scratch/reviews/review-playbook-luna.txt`, `review-other-luna.txt` and `review-skill-luna.txt`, then verifies 1 to 4. The fix rounds are `scratch/reviews/fix.diff` to `fix5.diff`.

| ID | Source | Doc | Finding | Ruling | Closed by |
|----|--------|-----|---------|--------|-----------|
| PB-1 | Playbook review P1 | 11 scenarios and the root page | v2 twins check v1 event names | Taken | Round 1, verify 1 |
| PB-2 | Playbook review P1 | 11 scenarios and the root page | v2 twins use a provider v2 does not list | Taken: default id plus the provider check | Rounds 1 and 2, verify 2 |
| PB-3 | Playbook review P1 | `pure-and-print-logs.md` | A v1-only scenario has a v2 step | Taken | Round 1, verify 1 |
| PB-4 | Playbook review P1 | `manual-testing-playbook.md` | CO-032 v2 twin selects an agent directly | Taken: twin removed | Round 1, verify 1 |
| PB-5 | Playbook review P1 | `manual-testing-playbook.md` | CO-034 v2 twin lacks `--standalone` | Taken | Round 1, verify 1 |
| OT-1 | Other review P1 | changelog v1.5.0.0 | "Always selects OpenCode 2" | Taken: PATH order decides | Round 1, verify 1 |
| OT-2 | Other review P1 | catalog dual-version entry | Working directory set through the environment | Taken: spawn `cwd` | Round 1, verify 1 |
| OT-3 | Other review P2 | deep-loop scripts README | Resolver summary omits PATH order | Taken | Round 1, verify 1 |
| OT-4 | Other review P2 | plugins README | Description says default factory | Taken (rule 7 amended, decision 7) | Round 1, verify 1 |
| OT-5 | Other review P2 | plugins README | Audit names only `opencode` | Taken | Round 1, verify 1 |
| OT-6 | Other review P2 | changelog v1.5.0.0 | Housekeeping bullet | Taken: removed | Round 1, verify 1 |
| SK-1 | Skill review P1 | 7 skill docs | v2 twins use `deepseek-v4-flash` | Taken | Round 1, verify 1 |
| SK-2 | Skill review P1 | SKILL.md | Version check names a different binary than the resolver | Taken | Rounds 1 to 3, verify 2 |
| SK-3 | Skill review P1 | SKILL.md, 3 references | v2 `--agent` behaviour stated without a run | Taken: marked unverified | Rounds 1 and 2, verify 2 |
| SK-4 | Skill review P1 | prompt-templates, opencode-tools | v2 twins select `markdown` and `deep-review` directly | Not taken: they mirror pre-existing v1 examples (decision 12) | - |
| SK-5 | Skill review P1 | opencode-tools | v2 loading stated as fact | Taken | Round 1, verify 1 |
| SK-6 | Skill review P1 | integration-patterns | `--auto` called an alias | Taken | Round 1, verify 1 |
| SK-7 | Skill review P2 | SKILL.md, README, cli-reference, prompt-templates | `</dev/null` rule stated for v2 | Taken in part: redirect kept on both, hang scoped to v1 | Round 1, verify 1 |
| SK-8 | Skill review P2 | SKILL.md, README, cli-reference | No v2 provider preflight | Taken | Round 1, verify 1 |
| SK-9 | Skill review P2 | prompt-templates | HVR ceiling 75 of 100 | Not taken: exit 0, soft deductions only | - |
| VF-1 | Verify 1 | base scenario, prompt-templates, README, 4 references | Prompt names v1 events, a twin lacks the check, v2 stream end, v2 route omitted, `--pure` untagged | Taken | Round 2, verify 2 |
| VF-2 | Verify 2 P1 | 4 scenarios | Pass lines name only v1 events | Taken | Rounds 3 and 4, verify 4 |
| VF-3 | Verify 2 P2 | SKILL.md | `-x` accepts a directory | Taken | Round 3, verify 3 |
| VF-4 | Verify 3 P2 | SKILL.md | Empty `OPENCODE_BIN` falls through to PATH | Not taken (decision 15) | - |
| OR-1 | Orchestrator | SKILL.md | Over the 5,000-word limit | Taken | Trim, package check exit 0 |
| OR-2 | Orchestrator | doctor scripts README | "harness" three times (phase 008 text) | Taken | Round 1, HVR exit 0 |
| OR-3 | Orchestrator | cli-reference | Description "Pinned to v1.3.17" | Taken (decision 7) | Round 1 |
| OR-4 | Orchestrator | variant-levels-comparison | PROMPT_UNSYNCED, new with the sweep | Taken | Round 1, package warning gone |
| OR-5 | Orchestrator | two test READMEs | HVR and DQI below the bar on touched docs | Taken | HVR and DQI rounds, exit 0 and DQI 79, 84 |
| OR-6 | Orchestrator | hub routing manifest | Stale after the SKILL.md edits | Taken: re-minted (decision 14) | Sync and package checks exit 0 |
| OR-7 | Orchestrator | Hermes mirror | Drifted from SKILL.md | Taken: regenerated | `--check` PASS |
| OR-8 | Orchestrator | integration-patterns, prompt-templates, playbook root, orchestrate scenario | v2 `--agent` examples with no unverified note in the doc (the same class as SK-3, found by a per-doc scan at closeout) | Taken: one sentence per doc | Round 5 (`scratch/reviews/fix5.diff`), checked by the orchestrator's scan |

## Pre-existing, left alone

The reviews also listed these. None was introduced by this build, and each sits outside a version sweep:

- `manual-testing-playbook.md:433` CO-032 summary describes a direct `--agent deep-research` invocation.
- `parallel-detached/ablation-suite.md:57` labels a worker "variant high" that runs `--variant max`.
- `.opencode/plugins/README.md:20` names `sk-vision` under the shared kill switch it does not read.
- `cli-claude-code/references/claude-tools.md:182` and `:281` give OpenCode a `--sandbox read-only` and a `--search` flag that neither help lists.
- The OpenCode 1 examples that select subagents or loop agents directly (`prompt-templates.md:512`, `integration-patterns.md:156`, `opencode-tools.md:182`).
- The OpenCode 1 default lines that still say `deepseek-v4-flash` (`scratch/checks/model-id-counts.txt`).
- SKILL.md:158 says the runner resolves the model id, while fanout-run.cjs uses a fixed constant.
