# Iteration 010 — Reflection bounded-cap / promotion residue (T2 delta)

**Focus:** peck reflect SKILL.md (<15 cap, 5/session, twice→promote, prune-stale) vs what 004-constitutional-rule-review actually shipped + the live constitutional tier.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.72.

## Findings (residue)
- **[F-010-01]** peck hard bounded-log (≤5/session; learnings <15) (`external/peck-master/src/assets/skills/reflect/SKILL.md:42,61`); 004 only scoped `last_confirmed` metadata + a read-only staleness diagnostic, NOT a total standing-guidance cap (`004-constitutional-rule-review/spec.md:93-94`). SHIPPED? no. **ADAPT** · S · low · blast: constitutional README/diagnostic policy.
- **[F-010-02]** live spec-kit has a per-rule visibility budget (`maxTokens:2000`) + 12 constitutional files, but not peck's total-entry/per-session cap (`constitutional/README.md:22,137`, `importance-tiers.ts:33`). SHIPPED? partial (per-record token bound only). **ADAPT** · S · low.
- **[F-010-03]** peck promotes after "happened twice" + removes from learnings; spec-kit's live promotion is validation-confidence-based, excludes constitutional/critical tiers, promotes to critical only (`reflect/SKILL.md:50`, `confidence-tracker.ts:71,89,236`). SHIPPED? no. **ADAPT** · M · med · blast: save dedup/reconsolidation/confidence telemetry.
- **[F-010-04]** save-quality gate detects near-dups (≥0.92) but doesn't count "twice" recurrence or propose promotion (`save-quality-gate.ts:687,721,729`). SHIPPED? no. **ADAPT** · M · med.
- **[F-010-05]** peck prunes stale/no-longer-true learnings; 004 covered only a read-only human review surface + explicitly EXCLUDED auto-expiry/decay/deletion (`reflect/SKILL.md:60`, `004/spec.md:84,97,100`). SHIPPED? partial. **ADAPT** · M · high · blast: constitutional lifecycle, indexing, audit.
- **[F-010-06]** live constitutional rules are intentionally permanent/no-decay/always-surface → a prune/demote lifecycle is net-new operational behavior even if human-gated (`constitutional/README.md:24-25`, `fsrs-scheduler.ts:291,298`). SHIPPED? no. **ADAPT** · M · high.

## Ruled out
- read-only last-confirmed/staleness review — 004 already specified the surface (impl pending per its summary).
- decay/search-boost changes — 004 explicitly rejected.
- automatic deletion — 004 requires human-in-loop retirement (not low-risk).

## Verdict contribution
T2's adoption (004) left REAL residue: (a) total standing-guidance CAP, (b) recurrence→promotion signal, (c) human-gated prune/demote lifecycle. All ADAPT, but (c) is HIGH risk (constitutional lifecycle). Candidate: a SMALL 006-bundle sub-item for (a)+(b) [low-risk: a bounded curated guidance surface + a recurrence flag]; DEFER (c) to its own future review. NOTE: 004's own impl-summary says the phase is still pending — coordinate so 006 doesn't pre-empt 004.
