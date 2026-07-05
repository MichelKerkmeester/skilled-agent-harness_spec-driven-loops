---
title: "Implementation Plan: Fanout-Merge Schema Tolerance"
description: "Plan for making mergeResearchRegistries (and mergeReviewRegistries if needed) schema-tolerant, with loud schema_mismatch warnings and a sum-invariant regression test."
trigger_phrases:
  - "fanout merge schema tolerance plan"
  - "keyFindings alias findings plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance"
    last_updated_at: "2026-07-01T07:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by MiMo v2.5 ultraspeed, verified by Claude Sonnet 5"
    next_safe_action: "Phase complete; move to child 002-fanout-timeout-override"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fanout-Merge Schema Tolerance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Add a small normalization step at the top of `mergeResearchRegistries` (and, if the audit finds the same defect, `mergeReviewRegistries`): before the existing dedup loop runs, coerce each incoming `registry` into the canonical shape by aliasing `registry.findings` to `registry.keyFindings` when `keyFindings` is absent but `findings` is a present array. Do this via a small pure helper (`normalizeRegistrySchema(registry, expectedSchema)`) rather than inlining the alias check, so the same helper covers both merge functions and is independently testable.

Whenever normalization is applied (alias used) or a registry is still unusable after normalization (neither key present, or present but not an array), emit a structured warning event to whatever the merge function's existing log/return-object convention is (mirroring the `jsonl_wrong_type` pattern already in this runtime for shape consistency) — include the lineage label and, for the drop case, the count of entries that would have been silently lost.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- New regression test(s) must fail on pre-fix code (true RED) and pass post-fix (GREEN).
- Full `deep-loop-runtime` Vitest suite must stay green with the new tests included.
- Re-running the merge against the real 2026-07-01 fan-out's raw per-lineage registries must produce the true combined finding count, not the buggy subset.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Alias, don't reject.** A `findings` array is real, well-formed data the operator's research still wants — reject-and-warn would throw away useful information the merge tool could have used. Tolerate the alias, but never silently.
- **Warn on every non-canonical hit, even when tolerated.** So operators watching merge output can still see "this lineage used the non-canonical schema" even though the fix means it no longer loses data — keeps the drift visible for a future decision about standardizing the writer side.
- **Audit review-mode separately, don't assume parity.** `mergeReviewRegistries` has different field names (`openFindings` etc.) — the audit reads its actual code path rather than assuming the same `keyFindings` check exists there.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Read both merge functions in full.
2. Write a RED test proving the current bug.
3. Add the `normalizeRegistrySchema` helper.
4. Wire it into `mergeResearchRegistries`.
5. Emit the `schema_mismatch` warning.
6. Audit and fix `mergeReviewRegistries`.
7. Add the sum-invariant regression test.
8. Confirm RED→GREEN; run the full suite; re-verify against real data.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. New unit test: build two synthetic lineage registries — one canonical (`keyFindings`), one using `findings` with the observed alternate per-finding shape (`category`/`disposition` instead of `iterations`/`_lineages`) — assert the merged output includes findings from both, and the merge result carries a `schema_mismatch` marker for the `findings`-schema lineage.
2. Sum-invariant regression test: assert `merged.keyFindings.length` equals the sum of both lineages' finding counts.
3. Re-run the real fixture: point the merge function at the actual `research/lineages/{glm,gpt}/deep-research-findings-registry.json` files from the 2026-07-01 run and confirm the merged count is now the true combined total, not gpt-only.
4. Full `deep-loop-runtime` Vitest suite must stay green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None — this is a self-contained fix to a single shared runtime file and its test file.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single commit touching `fanout-merge.cjs` + its test file. No state migration, no data written by this fix (it only changes in-memory merge logic), so rollback is a pure code revert with no cleanup required.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | `normalizeRegistrySchema` helper; wired into `mergeResearchRegistries` and `mergeReviewRegistries` |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | New regression tests |
<!-- /ANCHOR:affected-surfaces -->
