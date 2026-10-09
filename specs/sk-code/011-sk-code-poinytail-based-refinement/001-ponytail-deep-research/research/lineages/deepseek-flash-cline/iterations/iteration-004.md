---
title: "Iteration 4: Ponytail runtime portability and rule-copy guards vs sk-code runtime surfaces and drift guards"
trigger_phrases: []
---
# Iteration 4: Ponytail runtime portability and rule-copy guards vs sk-code runtime surfaces and drift guards

## Focus

Q4 — portability across agent runtimes and rule-file copies: how Ponytail's ~30 host adapters, copy guard, and version guard compare with sk-code's runtime surfaces, rule-copy canary, delivery-prefix invariant, and drift-guard umbrella. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST`.

## What was read

- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:1-59` — adapter table, adapter rule, portable behavior.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:1-74` — byte-equality copies plus invariant canary.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js:1-60` — version-consistency guard and its failure narrative.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/build-openclaw-skills.js:1-45` — generated transformed copies.
- `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:1-140` — exact per-file invariants, Iron Law concept pair, delivery-prefix anchors.
- `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:1-60` — the two live guards and the retired third.
- `.skilled/bin/compiled-route-sync.cjs:1-55` and `.skilled/bin/lib/compiled-route-layout.cjs:45-70` — compiled-routing promotion and authored-program location.

## Findings

1. **[NEW] Ponytail's copy guard has a byte-equality tier over pure-copy rule files that sk-code's canary does not need but whose invariant list is directly portable.** `check-rule-copies.js` normalizes host frontmatter, then requires exact equality with the canonical `AGENTS.md` body for seven host copies (`.cursor/rules/ponytail.mdc`, `.windsurf/rules/ponytail.md`, `.clinerules/ponytail.md`, `.agents/rules/ponytail.md`, `.qoder/rules/ponytail.md`, `.github/copilot-instructions.md`, `.kiro/steering/ponytail.md`), and separately requires ten verbatim phrases in *both* `skills/ponytail/SKILL.md` and `AGENTS.md`. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:18-27,44-67] The invariant list pins the never-cut carve-outs individually — `validation at trust boundaries`, `prevents data loss`, `security`, `accessibility` — with the comment "pin each so a reword in either file can't silently drop one". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:51-56] This is the concrete mechanism for iteration 1's finding that sk-code's ladder does not locally enumerate never-cut safeguards. sk-code's canary already uses the same scoped-exact-string design for the review-status triplet and a concept-level pair check for the Iron Law. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:30-60]

2. **[ALREADY-ADOPTED, stronger] sk-code's delivery-prefix invariant has no Ponytail equivalent.** The canary asserts that every binding clause in `AGENTS.md` ENDS inside the smaller runtime prefix (16,384 bytes for Devin, 32,768 for Codex), with byte offsets and per-anchor scope, because "a clause a runtime truncates away is a copy that silently does not exist there". [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:60-100] Ponytail's guard checks copies and phrases but never checks where a clause sits relative to a truncating host. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:1-74]

3. **[NEW] Ponytail's version guard encodes a guard-design lesson: cross-file agreement checks need an external anchor.** The guard pins one `X.Y.Z` across seven version-bearing files and, on a release-tag CI run, requires that shared version to equal the tag. Its comment records the failure it closes: in v4.8.0 every manifest stayed stale at 4.7.0 *together*, so they "agreed" and the existing agreement test passed while the release moved on (#260, #262). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js:1-11,21-29,51-60] Any sk-code guard that proves two artifacts agree — including mirror-sync verification between `.claude/agents` and `.codex/agents` — inherits this lesson and needs a truth source outside the pair.

4. **[NEW] Ponytail's portability table carries support tier and verification evidence per host; sk-code's runtime surfaces carry capability but not a verified-state record.** Each row names the adapter files, the tier (plugin / hooks / instruction-only), and the verified host version, e.g. "Verified with Goose 1.53.0", "Verified with CodeBuddy CLI 2.161.2", "Verified with Muse Code 1.4.2", and marks the unverified case plainly: Junie "not automatic yet". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:11-43] sk-code ships per-runtime surface packets and a manual-testing-playbook tree [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/] but no row that states which runtime version was verified against that surface. This is the portability analogue of the framework's confirmed-versus-inferred standard, applied to host claims.

5. **[NEW, small] The drift-guard umbrella still records its retired router-sync check as missing and does not point at the lane that now covers part of it.** `run-all-drift-guards.sh` runs the alignment-drift verifier (language integrity + dead-route check) and the stack-folder verifier, then states that the third guard "checked that this surface's router stayed in step with the compiled routing snapshot, which nothing here measures now", recorded "as missing rather than quietly dropped". [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:10-16,47-52] The compiled-routing lane that postdates this note names the same artifacts as its inputs and activation coverage: `hub-router.json`, `ROUTER.md`, `leaf-manifest.json`. [SOURCE: specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/activation-record.json] Whether the compiled lane fully replaces the retired check, or the check should be reinstated as a guard, is open; the defect this iteration can state is that the retirement note no longer describes current coverage. Recorded rather than resolved, per the dispatcher's stop-and-ask rule. [SOURCE: .skilled/bin/compiled-route-sync.cjs:8-30]

6. **[ALREADY-ADOPTED] Ponytail's thin-adapter rule matches sk-code's consume-don't-copy doctrine and sk-code enforces it with a router-aware verifier.** "Keep adapters thin. When a host supports skills or hooks, point it at the existing `skills/` and `hooks/` files. When a host only supports project instructions, keep its copied rule text aligned with `AGENTS.md`." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:45-49] sk-code surfaces consume shared references and validate with `verify_alignment_drift.py --check-router` (language integrity + dead-route check) plus the stack-folder verifier, run together as one gate. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:20-45]

7. **[NEW] Ponytail generates its one transformed copy set and proves it fresh, where sk-code's cross-runtime mirrors are hand-maintained.** `build-openclaw-skills.js` copies each skill body verbatim and rewrites only the host-constrained frontmatter, with the reason stated — "The body is copied verbatim from skills/<name>/SKILL.md so the ruleset never drifts" — and a test that fails when the committed copies are stale; the canary records generation as its documented upgrade path. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/build-openclaw-skills.js:1-11,30-45] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:43] sk-code's agent mirrors are maintained as separate runtime copies, with the prior refinement already proposing a mirror-sync verification (rec #12); generation is the stronger mechanism where the copy is pure transformation.

8. **[ALREADY-ADOPTED] Canary-not-generator discipline is declared in both systems.** sk-code: "It is a canary, not a generator: it asserts the load-bearing substrings still exist; it never rewrites anything." [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:15-17] Ponytail: "canary, not full equality" for the source-of-truth SKILL.md comparison. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:39-43]

### Classification roll-up (iteration 4)

| Classification | Findings |
|---|---|
| NEW | 1 (copy-guard invariant list, directly portable), 3 (external-anchor guard lesson), 4 (support tier + verified-version record), 7 (generate transformed copies), 5 (small: stale retirement note) |
| ALREADY-ADOPTED | 2 (delivery-prefix, stronger), 6 (thin adapters + drift verifier), 8 (canary discipline) |
| LOST | none |

## Ruled Out

- Adopting byte-equality comparison for sk-code's runtime surfaces: their files are consumers of shared doctrine, not copies of it, so byte equality would freeze the wrong artifact. Only the invariant-list half transfers.
- Adopting a full 30-row host matrix as a goal: the value is the per-row verified state, not the row count.

## Dead Ends

- Searching for a Ponytail equivalent of the delivery-prefix check: none exists; the mechanism is sk-code's alone.
- Treating `compiled-route-sync.cjs` as the retired router-sync replacement: its stated purpose is promoting the runtime closure and proving the serving graph never reads the spec tree, not verifying surface-router/snapshot agreement.

## Edge Cases

- Ambiguous input: the portability table's "Verified with <host> <version>" claims cannot be re-verified inside this lineage; recorded as the host's own claim, not as independently confirmed. [SOURCE: verification standard, confirmed-vs-inferred]
- Contradictory evidence: the drift-guard note says nothing measures router/snapshot agreement now, while the compiled-routing activation records name the same router artifacts as inputs. Both are cited in finding 5; the conflict is recorded, not resolved.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:1-59
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:1-74
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js:1-60
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/build-openclaw-skills.js:1-45
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/INSTALL.md:1-3
- .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:1-140
- .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:1-60
- .skilled/skills/sk-code/manual-testing-playbook/
- .skilled/bin/compiled-route-sync.cjs:1-55
- .skilled/bin/lib/compiled-route-layout.cjs:45-70
- specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/activation-record.json

## Assessment

- New information ratio: 0.56 (4 fully new, 1 small new, 3 already-adopted among 8 findings)
- Questions addressed: Q4
- Questions answered: Q4

## Reflection

- What worked and why: reading both copy guards side by side turned a vague "portability" question into a precise mechanism comparison — byte-equality tiers, invariant lists, delivery prefixes, external anchors.
- What did not work and why: my first pass assumed sk-code had no guard over its runtime mirrors and Ponytail had only hand copies; both assumptions were wrong and the reads corrected them.
- What I would do differently: check `run-all-drift-guards.sh` against the compiled-routing lane before treating the retirement note as current coverage.

## Recommended Next Focus

Q5 — verification and test-suite mechanisms: which Ponytail verification patterns (benchmark harness honesty, host-quirk hook tests, proof artifacts) are absent, adopted, or rejected in sk-code's verification doctrine and test surfaces.
