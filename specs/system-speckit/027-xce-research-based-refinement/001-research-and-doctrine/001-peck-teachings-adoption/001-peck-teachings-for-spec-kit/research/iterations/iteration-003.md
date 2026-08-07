# Iteration 003 - T2 constitutional review

## Focus

Q3 (T2): choose the mechanism for a read-only constitutional-rule review surface, decide whether lifecycle metadata should be `last_confirmed` or `review_by`, and compare how always-on rule systems surface stale/deprecated rules without automatically deleting them.

## Actions Taken

1. Read the deep-research state log and strategy to confirm iteration 3 is focused on T2 constitutional review. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-state.jsonl:1-3] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-strategy.md:20-25]
2. Read the phase 004 spec and sibling T2 analysis to ground scope, acceptance criteria, risks, and open questions. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:62-70] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md:158-176]
3. Reviewed constitutional-rule docs and memory decay references to confirm the tier is fixed-visibility and exempt from normal decay. [SOURCE: .opencode/skills/system-spec-kit/constitutional/README.md:20-25] [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory_system.md:370-381] [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory_system.md:471-477]
4. Compared diagnostic host candidates under `.opencode/commands/doctor/`, `.opencode/commands/memory/`, and system-spec-kit references. [SOURCE: .opencode/commands/memory/manage.md:60-71] [SOURCE: .opencode/commands/memory/learn.md:43-55] [SOURCE: .opencode/commands/doctor/_routes.yaml:27-33] [SOURCE: .opencode/commands/doctor/speckit.md:38-50]
5. Surveyed external prior art for stale/deprecated rule metadata and review surfaces, focusing on ESLint rule deprecation metadata and MADR ADR metadata/revisit guidance. [SOURCE: https://eslint.org/docs/latest/extend/rule-deprecation] [SOURCE: https://eslint.org/docs/latest/extend/custom-rules#rule-structure] [SOURCE: https://adr.github.io/madr/]

## Findings

1. T2 should not alter decay, search boost, FSRS, or automatic deletion behavior. The phase spec explicitly says no auto-expiry, no decay-behavior change, and no deletion, while the memory docs say constitutional, critical, important, and deprecated tiers have decay rate 1.0 and constitutional records are not affected by decay scoring. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:97-100] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:136-137] [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory_system.md:370-381] [SOURCE: .opencode/skills/system-spec-kit/references/memory/memory_system.md:471-477]

2. Among the phase's listed host candidates, a small standalone read-only script is the safest implementation mechanism. `/memory:manage` is a lifecycle/admin surface that includes cleanup, bulk-delete, tier changes, trigger edits, validation, deletion, checkpoints, and ingest; existing `/doctor memory` is marked `mutates` against the active SQLite profile DB. A standalone script can be proven read-only with before/after diff checks and can later be called by a command. [SOURCE: .opencode/commands/memory/manage.md:60-71] [SOURCE: .opencode/commands/memory/manage.md:82-104] [SOURCE: .opencode/commands/doctor/_routes.yaml:27-33] [SOURCE: .opencode/commands/doctor/speckit.md:42-50]

3. If command integration is desired, `/memory:learn` is a better semantic home than `/memory:manage` because it already owns constitutional-rule lifecycle, list, edit, remove, and budget operations. However, destructive modes exist there too, so the implementation should remain a read-only script and the command should only wrap its report mode. [SOURCE: .opencode/commands/memory/learn.md:43-55] [SOURCE: .opencode/commands/memory/learn.md:87-95] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/quick_reference.md:103-107]

4. Metadata should be `last_confirmed` plus explicit provenance, with `review_by` computed by the diagnostic from a documented cadence. `last_confirmed` is a factual anchor that can be backfilled from git history, while a stored `review_by` deadline is policy-derived and risks pretending a human reviewed the rule on a specific schedule. The phase spec already flags guessed backfill dates as a risk and says to backfill with file git-history dates, not invented values. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:147-148] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:157-158]

5. Add a provenance field for honest backfills. Recommended shape: `last_confirmed: YYYY-MM-DD`, `last_confirmed_source: git-last-commit` for initial backfills, and optionally `last_confirmed_by: human` only after a real review. This avoids conflating file modification time with human confirmation while still giving the diagnostic a stable date for age computation. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:147-148]

6. External prior art supports surfacing stale/deprecated status without deleting rules. ESLint rule metadata supports `deprecated`, `deprecatedSince`, `availableUntil`, and replacement metadata; `availableUntil: null` explicitly represents a rule that will be kept available even though it is deprecated. MADR uses status/date metadata and has optional Confirmation and More Information sections for checking whether a decision remains valid or should be revisited. [SOURCE: https://eslint.org/docs/latest/extend/rule-deprecation] [SOURCE: https://eslint.org/docs/latest/extend/custom-rules#rule-structure] [SOURCE: https://adr.github.io/madr/]

7. The diagnostic should enumerate rule files dynamically instead of hard-coding 14. Local docs already show count drift risk: the constitutional README says the folder contains two active rule files, while the phase spec describes 14 always-surface rules and acceptance criteria that print all 14. A reliable diagnostic should scan `constitutional/*.md`, exclude `README.md`, require `importanceTier: constitutional`, and report the observed count plus missing lifecycle metadata. [SOURCE: .opencode/skills/system-spec-kit/constitutional/README.md:20-25] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:80-84] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:118-128]

8. Current constitutional-rule frontmatter has no lifecycle field in the documented rule shape, so the review surface must treat missing metadata as an expected initial state, not as corruption. The README's rule-file shape lists title, `importanceTier`, `contextType`, and trigger phrases only. [SOURCE: .opencode/skills/system-spec-kit/constitutional/README.md:39-56]

9. OPA/conftest metadata prior art remained inconclusive in this bounded pass. The OPA policy-language page was reachable, but the fetched section did not provide enough targeted lifecycle/staleness detail within the iteration budget to support a recommendation. This does not weaken the recommendation because local command contracts plus ESLint and MADR provide enough evidence for metadata-plus-reporting without automatic deletion. [SOURCE: https://www.openpolicyagent.org/docs/policy-language/#metadata]

## Questions Answered

Q3 is mostly answered.

Best mechanism: implement a standalone read-only diagnostic first; if a command wrapper is added, prefer `/memory:learn` report/list integration or a new read-only `/doctor` target over existing `/memory:manage` or `/doctor memory` mutation surfaces.

Best metadata field: use `last_confirmed` as the stored factual date, add explicit backfill provenance, and compute `review_by` from cadence at report time.

Staleness handling: report stale, unconfirmed, deprecated, or replacement-needed rules; never auto-delete, auto-demote, or change decay/search behavior.

## Questions Remaining

Q3 residual: choose the exact cadence threshold, likely 180 or 365 days, and decide whether the command wrapper should be `/memory:learn list --staleness`, a separate `/memory:learn review`, or a new read-only `/doctor constitutional-rules` route.

Q4 remains: prior art for mechanical acceptance-criteria to test coverage mapping and blocking threshold.

Q5 remains: rollout and sequencing risks across T3/T4/T2 plus deferred T1.

## Next Focus

Iteration 4 should move to Q4 (T1 deferred): acceptance-criteria to test coverage mapping, blocking threshold prior art, and feasibility risks for adding a per-criterion completion gate.
