# Deep Review Iteration 006

## Dimension

Correctness + traceability, focused on companion research Finding #6: lower-priority stale `goal.md` filename references in packet-history docs.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28`
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:122`
- `.opencode/commands/goal_opencode.md` via glob discovery
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md:95`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:53`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:66`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:109`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:26`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:56`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/README.md:12`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/README.md:17`
- `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:33`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/spec.md:75`
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/implementation-summary.md:117`

## Finding #6 Per-Location Classification

| Location | Exact `goal.md` evidence | Classification | Rationale |
| --- | --- | --- | --- |
| Phase 009 `handover.md` | `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md:95` says the cold-read order ends with `.opencode/commands/goal.md`. | Current-and-wrong | This is a current next-session operational instruction. Fresh glob found only `.opencode/commands/goal_opencode.md`, so this would send the next operator to an absent file. |
| Phase 011 `tasks.md` | `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:53` says the live file was confirmed before moving it to `.opencode/commands/goal.md`; line 66 says final canonical name is plain `goal.md`; line 109 says repo-wide stale-reference grep returns zero hits. | Current-and-wrong, with historical context mixed in | T001/T004 read as completed task bodies, but T004 still states the canonical target as plain `goal.md` even though the same frontmatter says `goal_opencode.md` is final at line 14. The completion criterion at line 109 is directly contradicted by the current sweep, which still returns literal `goal.md` hits. |
| Phase 003 changelog | `.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/changelog-032-003-goal-command.md:26` says `Create .opencode/commands/goal.md`; line 56 lists that file in Files Changed. | Historical narrative | This is a dated 2026-06-29 changelog entry recording what Phase 003 claimed at the time. It is not a current instruction or current filename assertion. |
| Archived review README | `.opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/README.md:12` lists the command surface as `.opencode/commands/goal.md`; line 17 says the native review configuration originally included the same path. | Current-and-wrong for line 12; historical for line 17 | The line 12 table is present-tense scope metadata for the archive extraction and can misdirect archive readers to an absent command file. Line 17 is explicitly historical because it says `originally included`. |

## Additional Sweep Classification

Fresh command discovery found exactly one live command file: `.opencode/commands/goal_opencode.md`. No `.opencode/commands/goal.md` file exists.

Targeted `.opencode` markdown sweeps found additional literal `goal.md` hits, but no additional active plugin/command-context finding beyond the current-and-wrong class above:

- `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md:33-50` is explicit rename history and already says the current operator-confirmed final name is `goal_opencode.md`.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/spec.md:75` and related spec/plan lines are historical problem/scope narrative for the phase that fixed command-surface churn.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/implementation-summary.md:117-128` explicitly explains that remaining `goal.md` hits are historical narrative, not current filename claims.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/research_archive/2026-06-28-goal-design-synthesis/deep-research-strategy.md:11` is archived design-topic setup, not current operation.
- Review prompts, prior iteration narratives, review reports, and registry/state files are review history or already-covered command-surface drift context; they were not re-emitted as new findings.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### DR-006-P2-001: Packet-history docs still contain current stale `goal.md` operational claims

- Claim: A small number of packet-history docs still present `.opencode/commands/goal.md` as a current operational target or assert stale-reference cleanliness that is no longer literally true.
- Evidence refs: `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md:95`; `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:53`; `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:66`; `.opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md:109`; `.opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/README.md:12`.
- Counterevidence: Phase 003 changelog references are historical and appropriate; Phase 011 implementation-summary explicitly documents remaining historical hits; the constitutional note is historical rename narrative and names `goal_opencode.md` as current.
- Scope proof: `Glob .opencode/commands/*goal*.md` returned only `.opencode/commands/goal_opencode.md`; a narrowed `rg -n "goal\.md" .opencode -g "*.md"` sweep excluding review/research/changelog/archive folders still returned active packet hits in phase 009 and phase 011 plus historical explanatory hits.
- Final severity: P2.
- Confidence: 0.88.
- Recommendation: Annotate or leave per operator preference; if edited later, update the current operational lines only and preserve historical narrative.

## Traceability Checks

| Check | Result |
| --- | --- |
| Required review doctrine loaded | PASS - `review_core.md` loaded before final severity call. |
| Live command filename re-verified | PASS - only `.opencode/commands/goal_opencode.md` matched `*goal*.md`. |
| Four assigned locations checked | PASS - all four assigned locations still contain literal `goal.md` references. |
| Historical vs current classification applied | PASS - Phase 003 changelog and explicit rename histories were not treated as stale-current findings. |
| Independent sweep | PASS - additional hits were classified as historical/review-state/already-covered, with no extra active plugin/command-context finding beyond DR-006-P2-001. |

## Verdict

P2-only advisory drift found. No P0 or P1 finding was introduced in this iteration.

## Next Dimension

Continue the orchestrator-owned batch merge. If another pass is needed, focus on whether the two existing P1 documentation gaps from iterations 1-3 have complete remediation evidence after the env/output docs are updated.

Review verdict: PASS
