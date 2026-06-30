# Iteration 39 — kimi

**Angle:** Audit 005 child phases (all 44) for duplicate or stale doc artifacts mirrored from the parent heavy-doc stack — many may have stale copies of the same plan/tasks/checklist

**Findings:** 5

- **[P1] contradiction** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/checklist.md:3` — Completed child checklist still declares 'Pending (scaffold, not yet verified)'
  - evidence: Line 3: description: "Verification Date: Pending (scaffold, not yet verified)"; line 29: completion_pct: 100; line 143: **Verification Date**: 2026-06-22.
  - fix: Update the YAML description to the actual verification date and remove the scaffold text.
- **[P1] contradiction** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert/checklist.md:3` — Completed child checklist still declares 'Pending (scaffold, not yet verified)'
  - evidence: Line 3: description: "Verification Date: Pending (scaffold, not yet verified)"; line 28: completion_pct: 100; line 142: **Verification Date**: 2026-06-22, REQ-007 grandfather reporter deferred with rationale.
  - fix: Update the YAML description to the actual verification date and remove the scaffold text.
- **[P1] contradiction** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/checklist.md:3` — Completed child checklist still declares 'Pending (scaffold, not yet verified)'
  - evidence: Line 3: description: "Verification Date: Pending (scaffold, not yet verified)"; line 29: completion_pct: 100; line 143: **Verification Date**: 2026-06-22, verified by the 9-case vitest and validate.sh --strict exit 0.
  - fix: Update the YAML description to the actual verification date and remove the scaffold text.
- **[P1] contradiction** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/029-vague-query-model-benchmark/checklist.md:3` — Completed child checklist still declares 'Pending (run in progress)'
  - evidence: Line 3: description: "Verification Date: Pending (run in progress)"; line 17: recent_action: "Authored QA checklist, matrix dispatch in progress"; line 28: completion_pct: 100; line 133: **Verification Date**: 2026-06-22.
  - fix: Update the YAML description and recent_action to reflect that the benchmark run and verification are complete.
- **[P2] drift** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/plan.md:103` — Parent plan FIX ADDENDUM template instruction duplicated verbatim across 39 child plans
  - evidence: Line 103: 'Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.' The identical sentence appears in 39 of the 44 phase plan.md files, mirrored from the parent plan.md.
  - fix: Remove or child-customize the template instruction in each phase plan; keep only the actual affected-surfaces table and child-specific notes.
