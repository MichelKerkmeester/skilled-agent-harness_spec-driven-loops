# Iteration 008 — Scoped-Lookup Neutralization, WS1–WS4 Reconciliation, Index-Drift Refresh

## Focus

Broaden (iteration 8 of 10, max-iterations policy). From iteration 7's next focus: (1) test whether `--spec-folder` scoping neutralizes the `acceptance criteria` and template-placeholder containment clusters, since Gate 1's default invocation is unscoped and per-packet work might already scope; (2) reconcile the phase-006 review's WS1–WS4 remediation list with this run's hardening shortlist so the two loops do not propose conflicting fixes; secondary: (3) refresh the index-freshness drift measurement.

## Actions Taken

1. Read the parallel review's remediation sections: planning trigger and workstream seeds [SOURCE: specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/review/review-report.md:26], the 12-row finding registry [SOURCE: specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/review/review-report.md:43], and the WS1–WS4 list [SOURCE: specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/review/review-report.md:62].
2. Ran five live lookups against the committed index: unscoped and packet-scoped and track-scoped for `review the acceptance criteria before closeout`; packet-scoped for `update the feature specification for the auth work`; and a self-scope run against the first `specs/**/spec.md` still carrying the template phrase.
3. Inspected the scope implementation and all callers: `specFolderMatches` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:107], the in-scope filter [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:179] and the `--spec-folder` parse [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:267]; searched every documented invocation for scope usage.
4. Spot-checked the review's R1-P1-001 against the tooling: `PHASE_COUNT=3` default [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:62], the `phase-parent` level branch [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:98], the recipe text [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:78], and the seeder guard literal [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:401].
5. Re-measured drift: phrase posting array lengths inside the committed index, the artifact's size/mtime, and the current carrier count for the template phrase across `specs/**/spec.md`.

## Findings

**f-iter008-001 (P2). Scoping neutralizes cross-packet scaffold contamination, but it is opt-in, unengaged by any default invocation, and cannot suppress in-scope self-matches.** Observed runs against the committed index:

- Unscoped `review the acceptance criteria before closeout` → **20 documents, rc 0**, top hits at 0.88 including the three `templates/examples/level-*/acceptance-criteria.md` fixtures and packet AC files across unrelated tracks.
- The same prompt scoped to the backfilled packet `007-series-parent-review-and-hardening-research` → **0 documents, rc 1** (clean no-hit).
- The same prompt scoped to the whole track `specs/system-speckit/034-spec-folder-tooling` → **2 documents, rc 0**, both in-track AC files (`003-track-root-children`, `006-series-parent-rule-and-sibling-listing`) at 0.88.
- `update the feature specification for the auth work` scoped to packet 007 → 0 documents, rc 1.
- Self-scope run against the first unbackfilled carrier found (`specs/sk-communication/006-sk-communication-clarity/012-reply-rule-delegation-repair`) → **1 document, rc 0**: that packet's own `spec.md` at 0.88.

The filter is a document-folder prefix test, so scoping can only exclude documents outside the scope [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:107] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:179]. The flag exists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:267], but every documented default invocation is unscoped, including the canonical Gate 1 line [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:462] and the agent runtimes' [SOURCE: .skilled/agents/deep-research.md:352], and no lookup caller in the repo passes `--spec-folder`. Net: scoping would cut the cross-packet exposure f-iter007-002 measured, at the cost of one flag, but it does not remove the unbackfilled-corpus problem — an unbackfilled packet scoped to itself still answers with its own placeholder-bearing document. The mitigation is a caller-side scope adoption question, not an artifact change; the residue is the backfill.

**f-iter008-002 (P2). WS1–WS4 and this run's hardening shortlist are additive, not conflicting; WS1 is now independently verified; the one integration constraint is that "fail loudly" must not abort a scaffold.** Mapping:

- **WS1 (recipe fix, R1-P1-001)** — verified independently this iteration. The recipe says "scaffold the parent with `create.sh --phase`" [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:78]; that mode defaults to three placeholder children (`PHASE_COUNT=3` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:62]), the `phase-parent` level exists as its own branch [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:98], and the final step ("add the new work as child 002 with `create.sh --phase --parent`") carries neither path nor phase names [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:78]. The review's defect stands; this run had only imported it via f-iter007-006. WS1 is a pre-condition for any runnable-recipe claim.
- **WS2 (same-class doc sweep)** — aligns with this run's canon-drift and class-visibility findings (f-iter003-001, f-iter006-003, f-iter007-003); R1-P2-002 names the same `template-default` class gap this run reported. Two pre-conditions carry: WS2 edits cannot press on the byte-pinned Gate 3 question (f-iter001-006), and doc edits alone cannot add dynamic sibling evidence to the frozen runtime string arrays (f-iter003-002).
- **WS3 (listing and seeding hardening)** — R2-P2-004 is the same three-literal coupling this run found (judge set [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:25], shell guard [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:401]); R2-P2-001 (control-byte sanitization) and R2-P2-003 (sub-folder listing test) are net-new adds. This run adds the registry's hardening items (independent reads, `max(created_at, last_save_at)`, widened candidate set, token-overlap ranking, cap reporting, `recent_packets` JSON, advisory-only invariant). Union is a superset. The one wording-level constraint: the review's "guard that fails loudly on drift" [SOURCE: specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/review/review-report.md:57] must be satisfied by a test-time or warning channel, because the listing and seeding paths are scaffold-coupled and this run's inv-iter002-001 pins the advisory-only "return 0 on every failure, never fail a scaffold" behavior.
- **WS4 (packet record reconciliation)** — no overlap with this run; no conflict.
- **Stance difference, not a conflict:** the review defers backfilling the ~195 template-phrase carriers [SOURCE: specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/review/review-report.md:101], while this run recommends an operator-run dry-run-first backfill (f-iter006-004). f-iter008-001 narrows the disagreement without resolving it: scoping removes cross-packet noise but cannot fix self-matches, so the backfill retains its remaining justification.

**f-iter008-003 (P3). The index artifact is frozen while the corpus keeps growing: posting counts unchanged, carriers up from 200 to 207.** The committed index still holds `phrases["feature specification"]` length 199 and `phrases["acceptance criteria"]` length 360, matching iteration 7 exactly, at 3,795,532 bytes with mtime 2026-10-06 23:27 (`ls -la`; node read of the artifact). The current `specs/**/spec.md` carrier count for the template phrase is **207**, against 200 measured at iteration 7 [SOURCE: specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/research/deltas/iter-007.jsonl:9]. With the postings unchanged, the absent-carrier count is now roughly 12 (upper bound; the generator's exclusion set was not re-read this iteration) and grew by ~7 files in one iteration's interval. The defect is not a one-off gap but the absence of a regeneration cadence relative to packet creation.

**inv-iter008-001.** The lookup's scope filter is a folder-prefix membership test, so scoping can only exclude documents whose folders fall outside the scope; it can never neutralize an in-scope document whose indexed phrases match, and cross-packet noise reduction is therefore the ceiling of any scoping-based fix [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:107].

**obs-iter008-001 (real).** WS1 spot-check reproduced the defect exactly as the review described: default `PHASE_COUNT=3` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:62], bare `create.sh --phase` in the recipe, `git mv` into child `001`, and a final `create.sh --phase --parent` with no path [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:78].

## Questions Answered

- None. Q1–Q7 remain answered; this iteration broadened with a live neutralization test, a remediation reconciliation and a telemetry refresh, per the max-iterations stop policy.

## Questions Remaining

- None tracked. Candidate probes for iteration 9: (a) challenge f-iter008-001's implication that a Gate 1 scope can simply be adopted — find whether any Gate 1 path can carry a scope without violating the byte-pinned delivery receipts (f-iter001-006) or the frozen runtime arrays (f-iter003-002); (b) verify the ~12 absent-carrier bound by reading the generator's exclusion and purge rules; (c) test f-iter008-002's "no conflict" verdict against the fail-loud-versus-advisory-only wording at the seeder call site.

## Next Focus

Iteration 9 (broaden): adversarial pass on the two conclusions this iteration rests on — that scope adoption is cheap (probe the Gate 1 hook and receipt contract) and that the reconciliation has no conflict (probe the fail-loud guard against the advisory-only invariant); secondary: turn the drift bound from an rg-count estimate into the generator's documented exclusion semantics.

## Contradictions / Scope

- No logic-sync items requiring a halt; the only integration constraint recorded is the fail-loud-versus-advisory-only boundary in f-iter008-002.
- No scope violations: every researched path was read-only, and every write stayed inside the two allowed artifact paths.
