# Scenario 022 — blast_radius Transitive Re-verify (deep subject)

**Executor:** cli-opencode → `deepseek/deepseek-v4-pro` (parser fix live, no `--pure`)
**Subject:** `lib/code-graph-db.ts` (foundational module, 3-hop reverse-dependency depth)
**Evidence:** `scratch/evidence-022-rerun-stdout.json`

## Result: **PARTIAL** — verdict unchanged, but root cause clarified

| Mode | Count |
|------|-------|
| single-subject (non-blocked) | 35 |
| non-transitive | 35 |
| transitive (`includeTransitive:true, maxDepth:3`) | 35 |
| union (multi-subject) | 38 |
| minConfidence 0.7 | 32 |
| unfiltered | 35 |

- ✅ single-subject non-blocked
- ✅ union (38) ≥ single (35)
- ✅ minConfidence (32) ≤ unfiltered (35)
- ❌ transitive (35) **==** non-transitive (35) — `transitive_gt_nontransitive: false`

## Finding F-022-1 — `includeTransitive` is effectively a no-op (default traversal is already full-depth)

The first re-attempt (phase 006) left this as a suspected *shallow-topology* artifact. This deep-subject run disproves that: `code-graph-db.ts` has a genuine 3-hop reverse-dependency chain (depth-1=27, depth-2=7, depth-3=1, total 35). Yet the **default (non-transitive) blast_radius already returned all 35 across all three depth levels**, so `includeTransitive:true` added nothing.

**Conclusion:** the blast_radius default already computes the full reverse-dependency closure, so `transitive > nontransitive` is unachievable by construction — the `includeTransitive` / `maxDepth` parameters do not change results. This is a **tool-semantics / playbook-expectation mismatch**, NOT a topology limitation and NOT a core defect (the tool correctly returns affected files, union, and confidence-filtered sets).

**Recommendation (follow-on):** decide whether (a) the default should be depth-1 and `includeTransitive` should expand (current behavior would then be a bug — flag ignored), or (b) the default is intentionally full-closure and `includeTransitive`/`maxDepth` are vestigial.

> **RESOLVED in phase 008 (2026-05-27):** option (a) was chosen. A consumer audit found no programmatic caller relied on the implicit full-closure default, so `blast_radius` was fixed to honor `includeTransitive` (default depth-1; flag → multi-hop to `maxDepth`). Scenario 022 is now satisfiable. See [`../008-blast-radius-transitive-flag/`](../008-blast-radius-transitive-flag/).

## Safety
- Disposable workspace `tmp/cgwork-022.*` only; no tracked-file mutation; no staleness markers (0); workspace swept; graph-metadata churn reverted at packet close.
