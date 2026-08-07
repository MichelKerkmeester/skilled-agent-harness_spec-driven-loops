# Deep-Review Iteration 005 — cli-* + remaining catalog/playbook roots

**Executor:** DeepSeek-v4-pro (cli-opencode, --pure, read-only)
**Findings:** P0=0 P1=23 P2=0 (total 23)

## Summary
22 flagged links break down as: 6 true REAL_BROKEN (no target file exists at any slug), 7 TARGET_DELETED (_deprecated/ directories removed post-migration), 9 WRONG_SLUG_TARGET_EXISTS (de-numbered files exist but under different base slugs than the link expects). 13 of the 22 are #133-caused (links still carry numbered prefixes while de-numbered files exist). One additional instance of the broken 18--ux-hooks/21-shared-provenance... link was found in session-start-priming.md line 16 outside the flagged set. Systemic pattern: per-feature files were renamed beyond simple de-numbering (slugs shifted from 'ai-council' to 'multi-ai-council', 'deepseek-v4' to 'deepseek-v4-pro', 'per-record' to 'per-memory') without corresponding link updates in the root playbooks and feature catalog.

## Findings
| Sev | Classification | Source | Reference | 133-caused | Recommendation |
|-----|----------------|--------|-----------|-----------|----------------|
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/004-ai-council-multi-strategy-planning.md` | yes | Update link to 04--agent-routing/multi-ai-council-multi-strategy-planning.md |
| P1 | REAL_BROKEN | `.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/009-write-agent-doc-generation.md` | no | Create the missing feature file or remove the dead reference |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/004-ai-council-multi-strategy-planning.md` | yes | Update link to 04--agent-routing/multi-ai-council-multi-strategy-planning.md |
| P1 | REAL_BROKEN | `.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/009-write-agent-doc-generation.md` | no | Create the missing feature file or remove the dead reference |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/004-ai-council-profile.md` | yes | Update link to 04--agent-routing/multi-ai-council-profile.md |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/cli-codex/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/004-ai-council-profile.md` | yes | Update link to 04--agent-routing/multi-ai-council-profile.md |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md` | `03--model-presets/002-deepseek-v4-complex.md` | yes | Update link to 03--model-presets/deepseek-v4-pro-complex.md |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md` | `03--model-presets/002-deepseek-v4-complex.md` | yes | Update link to 03--model-presets/deepseek-v4-pro-complex.md |
| P1 | REAL_BROKEN | `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/004-write-agent-doc-generation.md` | no | Create the missing feature file or remove the dead reference |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/005-ai-council-multi-strategy.md` | yes | Update link to 04--agent-routing/multi-ai-council-multi-strategy.md |
| P1 | REAL_BROKEN | `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/004-write-agent-doc-generation.md` | no | Create the missing feature file or remove the dead reference |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | `04--agent-routing/005-ai-council-multi-strategy.md` | yes | Update link to 04--agent-routing/multi-ai-council-multi-strategy.md |
| P1 | REAL_BROKEN | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md` | no | Create the missing feature file or remove the dead reference |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `02--mutation/10-per-record-history-log.md` | yes | Update link to 02--mutation/per-memory-history-log.md |
| P1 | REAL_BROKEN | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `04--maintenance/035-embedding-status-reconciliation.md` | no | Create the missing feature file or remove the dead reference |
| P1 | TARGET_DELETED | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `10--graph-signal-activation/_deprecated/09-anchor-tags-as-graph-nodes.md` | no | Remove the dead reference or restore the deprecated archive file |
| P1 | TARGET_DELETED | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md` | no | Remove the dead reference or restore the deprecated archive file |
| P1 | TARGET_DELETED | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `12--query-intelligence/_deprecated/02-relative-score-fusion-in-shadow-mode.md` | no | Remove the dead reference or restore the deprecated archive file |
| P1 | TARGET_DELETED | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `13--memory-quality-and-indexing/_deprecated/22-implicit-feedback-log.md` | no | Remove the dead reference or restore the deprecated archive file |
| P1 | TARGET_DELETED | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `13--memory-quality-and-indexing/_deprecated/20-weekly-batch-feedback-learning.md` | no | Remove the dead reference or restore the deprecated archive file |
| P1 | TARGET_DELETED | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `14--pipeline-architecture/_deprecated/09-activation-window-persistence.md` | no | Remove the dead reference or restore the deprecated archive file |
| P1 | TARGET_DELETED | `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | `14--pipeline-architecture/_deprecated/15-warm-server-daemon-mode.md` | no | Remove the dead reference or restore the deprecated archive file |
| P1 | - | `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/session-start-priming.md` | `18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md` | no | Same root cause as finding 13 - target file does not exist; remove reference or create the file |

Review verdict: CONDITIONAL