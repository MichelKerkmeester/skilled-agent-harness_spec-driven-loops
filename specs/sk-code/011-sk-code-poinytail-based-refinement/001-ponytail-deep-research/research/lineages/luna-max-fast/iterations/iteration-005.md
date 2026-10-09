# Deep Research — Iteration 5

- Run: fanout-luna-max-fast-1791552201492-cjjo4q
- Focus: Audit the older Ponytail refinement against the current two-axis hub, nested modes, and related tooling
- Status: complete
- New information ratio: 0.6

## Focus

Which older Ponytail recommendations are already adopted, lost, or still new after checking the current hub, nested modes, and tooling?

## Actions Taken

- Cross-checked all 17 recommendations in the older refinement report against current hub, code-review, workflow, benchmark, validator, and mirror-sync sources.
- Compared the current surface detector with older surface-precedence text retained in the hub and universal quality standard.
- Compared the documented orphan-folder scenario with the validator implementation and CI agent-path filtering with the mirror checker.
- Recorded contract conflicts without editing source files, as directed by the dispatcher.

## Findings

1. **ALREADY-ADOPTED:** The core design-restraint transfer is present: ask whether code is needed, prefer existing and standard/platform facilities, then choose a small implementation only after reading the task and its surrounding code. The earlier placement after surface and intent routing remains present; the six-rung order is in sk-code's universal quality standard. Sources: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:16-34; specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:45-50; .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-51.
2. **ALREADY-ADOPTED:** The old review additions are present across the quality checklist, removal plan, review-depth contract, and implementer rule: stdlib/native checks, bounded ceiling comments, neededness/removal, Replacement, review depth, and anti-stall while preserving scope. Sources: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:49-57; specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:55-61,67-70; .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:108-153; .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:46-54; .skilled/skills/sk-code/sk-code-review/SKILL.md:530-538; .skilled/skills/sk-code/shared/references/workflow-implement.md:66.
3. **LOST (surface-contract wording):** The restraint ladder remains, but the old single-axis surface precedence was not reconciled after the hub gained an Obsidian surface. The universal standard still says OPENCODE > WEBFLOW > UNKNOWN, and the hub SKILL still lists MOTION_DEV as a surface; the shared detector now defines OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN and treats Motion.dev as a peer resource category. LOGIC-SYNC REQUIRED: .skilled/skills/sk-code/SKILL.md:136 conflicts with .skilled/skills/sk-code/shared/references/stack-detection.md:28-40; .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:53 also retains the old precedence. This is recorded for synthesis; no source rule is selected here. Sources: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:27-34; specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:45-50; .skilled/skills/sk-code/SKILL.md:134-138; .skilled/skills/sk-code/shared/references/stack-detection.md:28-40; .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:44-53.
4. **NEW (remaining validator gap):** The earlier stack-folder validator recommendation is only partly implemented. The manual-testing contract says adding assets/zzz_fake_surface should fail, while verify_stack_folders.py scans known and orphan language directories only under references/; it does not check assets/. LOGIC-SYNC REQUIRED: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:286-293 conflicts with .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py:13-43. The references check is adopted; the documented assets assertion is not observed in the implementation. Sources: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:18-20; specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:64; .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:286-293; .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py:13-43.
5. **NEW (Codex-only mirror-check gap):** The repo-wide mirror gate exists, but a Codex-only agent edit can bypass its checker. CI forwards .codex/agents/ changes, yet the checker path matcher recognizes .opencode, .skilled, and .claude only; if no path matches, it exits successfully with “nothing to check.” LOGIC-SYNC REQUIRED: .github/workflows/agent-mirror-sync.yml:24-35 conflicts with .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:30-32,66-74; the verifier lists Codex as an optional mirror at .skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs:18-22. This is a partial implementation of the earlier repo-wide mirror recommendation, not evidence that the parity check has no value. Sources: specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:13-25; specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:67-70; .github/workflows/agent-mirror-sync.yml:24-35; .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:30-32,66-74; .skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs:18-22.

## Prior Recommendation Crosswalk

| Earlier recommendation | Current classification |
|---|---|
| 1–2. Add restraint ladder after routing in the always-loaded quality standard | **ALREADY-ADOPTED**; content and placement remain at code-quality-standards.md:42-51. Old precedence is stale (Finding 3). |
| 3. Add stdlib/native review rows | **ALREADY-ADOPTED** at code-quality-checklist.md:108-125. |
| 4. Canary review-status copies | **ALREADY-ADOPTED** by check-rule-copies.js:35-60; current README documents the exact-copy contract at scripts/README.md:20. |
| 5–8. Neutral ceiling comments, bounded P2 treatment, neededness/removal prompt, and Replacement field | **ALREADY-ADOPTED** at code-quality-checklist.md:137-153 and removal-plan.md:46-54. |
| 9. Canonicalize and canary a stable Iron Law substring | **PARTIAL / STILL OPEN**: the canary checks Iron Law concepts, not the proposed stable exact substring (check-rule-copies.js:62-71; scripts/README.md:20). |
| 10. Add a constrained shrink row | **DEFERRED** in the older report; no current recommendation to revive it. |
| 11. Add code size and over-engineering evidence after correctness gating | **DEFERRED**: Lane B still reports correctness, format, and output length (code-task-scorer.cjs:6-16; sweep-reporter.cjs:167-191). |
| 12. Promote mirror parity to repo-wide pre-commit and CI | **PARTIAL / GAP FOUND**: the gate exists, but Codex-only paths are not recognized (Finding 5). |
| 13. Check declared surfaces against both references and assets | **PARTIAL / GAP FOUND**: references are checked; the documented assets case is not (Finding 4). |
| 14. Name the existing review-depth setting with SK_CODE_REVIEW_DEPTH | **ALREADY-ADOPTED** at sk-code-review/SKILL.md:530-538. |
| 15. Add always-on SessionStart and prompt-injection hooks | **NOT ADOPTED; global form remains rejected.** The hub loads selected resources on demand (sk-code/SKILL.md:54-71). |
| 16. Add cross-runtime review-agent canary | **PARTIAL**: mirror verification exists, with the Codex-only path gap in Finding 5; agent and skill status vocabularies remain separate (research.md:67-70; mirror-sync-verify.cjs:18-22). |
| 17. Add implementer anti-stall while preserving scope | **ALREADY-ADOPTED** in workflow-implement.md:66. |

## Questions Answered

- Which older recommendations are already adopted, lost, or still new? **Answered:** The restraint ladder and most review additions are adopted; surface-precedence wording is lost in two stale descriptions; folder validation and mirror synchronization are partial with uncovered contract gaps; some benchmark or exact-wording proposals remain deferred; global injection remains rejected.

## Conflicts Recorded

- LOGIC-SYNC REQUIRED: the hub SKILL surface list and precedence at .skilled/skills/sk-code/SKILL.md:136 contradict the shared detector at .skilled/skills/sk-code/shared/references/stack-detection.md:28-40; the universal quality standard at :53 repeats the old order.
- LOGIC-SYNC REQUIRED: the manual-testing scenario at .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:293 expects an orphan under assets/ to fail, while verify_stack_folders.py:13-43 scans references/ only.
- LOGIC-SYNC REQUIRED: CI includes Codex agent paths at .github/workflows/agent-mirror-sync.yml:29-35, while check-agent-mirror-sync.cjs:30-32 omits .codex and :66-74 exits successfully when it finds no agent path.
- The dispatcher directed this lineage to record conflicts and continue; no source was edited and no truth was selected.

## Rejected Transfers

- Do not restore the earlier global intensity slider or always-on prompt injection. The current on-demand hub route keeps workflow and surface selection explicit; global injection would duplicate shared prompt rules and bring back state and portability costs. Sources: specs/sk-code/011-sk-code-poinytail-based-refinement/context/commands/ponytail-help.toml:2; specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:74-84; .skilled/skills/sk-code/SKILL.md:54-71.
- Do not treat either the asset-folder mismatch or Codex-only checker path as permission to broaden this lineage into a source fix; both contracts remain unresolved.

## Assessment

The earlier refinement substantially made it into current sk-code. The audit found two unclosed implementation promises and one CI path gap, plus stale surface language after the two-axis hub evolved. These are concrete documentation-to-code or router-to-detector disagreements, not reasons to revive the rejected global mode. The findings are bounded and should be resolved by the owning implementation packet after selecting authoritative contracts.

## Reflection

A recommendation marked adopted in the archive still needs a present-day check. One matching helper or one green CI job does not prove the declared coverage: the assets test case and Codex-only file route each expose a specific unchecked edge.

## Recommended Next Focus

Inspect the remaining surface-specific quality and validation contracts, especially Webflow minification/runtime checks and Obsidian plugin checks. Separate missing safeguards from stale manual-test descriptions, then measure whether new information is falling below the convergence threshold.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:16-34
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:49-57
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:13-25
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/commands/ponytail-help.toml:2
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:45-84
- .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-53
- .skilled/skills/sk-code/SKILL.md:54-71,134-138
- .skilled/skills/sk-code/shared/references/stack-detection.md:28-54
- .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:108-153
- .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:46-54
- .skilled/skills/sk-code/sk-code-review/SKILL.md:530-538
- .skilled/skills/sk-code/shared/references/workflow-implement.md:66
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:286-293
- .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_stack_folders.py:13-43
- .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:35-71
- .skilled/skills/sk-code/sk-code-review/scripts/README.md:20
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs:6-16
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs:167-191
- .github/workflows/agent-mirror-sync.yml:24-35
- .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:30-32,66-74
- .skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs:18-22

## Assessment Notes

- No source implementation or external files were changed.
- The unresolved conflicts are preserved for later reconciliation.
