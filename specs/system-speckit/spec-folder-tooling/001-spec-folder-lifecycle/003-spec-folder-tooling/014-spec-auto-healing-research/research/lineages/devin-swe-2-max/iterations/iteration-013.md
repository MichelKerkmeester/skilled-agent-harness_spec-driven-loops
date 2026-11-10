# Iteration 13: Q5 - the failure-class to gate placement table

## Focus

Map every phase-013 failure class to the earliest gate that can catch a new instance, verify the changed-packet gate's verdict-only comparison, and produce the definitive check-placement answer.

## Actions Taken

1. Re-read `steer.md`.
2. Re-verified `changed-packet-validation.yml:139-146` - base comparison is verdict-only.
3. Grepped pre-commit for phrase-convention coverage (none).
4. Confirmed GREP_CONVENTION exists in `validator-registry.json`.

## Findings

1. The coverage map, earliest gate first. Metadata classes (GENERATED_METADATA_INTEGRITY/DRIFT, METADATA_DISK_PATH_CONSISTENCY): pre-commit remint auto-fixes staged packets, changed-packet CI catches the rest - COVERED at commit time. Track/parent identity (GRAPH_METADATA_CHILD_IDENTITY): pre-push `sweep-track-roots --rev` on the pushed tip - COVERED at push. Generated index drift: advisory `--check` + rebuild job - COVERED post-merge. Every authored-content class (ANCHORS_VALID, SPEC_DOC_INTEGRITY, SPEC_DOC_SUFFICIENCY, FRONTMATTER_VALID, LEVEL_MATCH, FILE_EXISTS, TEMPLATE_SOURCE, GREP_CONVENTION): first gate = the PR's changed-packet regression check, and only for packets the PR touched; otherwise the weekly sweep. CONFIRMED [SOURCES: pre-commit:536-590; pre-push:17-20; changed-packet-validation.yml:56-157; strict-pass-freshness-report.yml; advisory-checks.yml:55-68]
2. GAP inside the regression gate: the base comparison is verdict-only (`RESULT: PASSED`). A packet failing one rule at base but three at head reads "pre-existing" and passes - silent worsening inside the gate that exists to catch it. CONFIRMED [SOURCE: changed-packet-validation.yml:139-146]
3. GAP at commit time: no structural check at all. Anchors, missing sections, frontmatter fields, level declarations, template headers all ship on `git commit` and surface at PR time at the earliest - the whole phase-013 authored-failure taxonomy has no local gate. The pre-commit already computes the staged-packet set for the remint, so the placement slot exists. CONFIRMED [SOURCE: install-git-hooks.sh gate list (no validator entry); pre-commit:536-590]
4. GREP_CONVENTION specifically could be gated cheaply without the validator: phrase-judge.mjs is importable standalone ("depends on nothing but the normalizer"), so a staged-frontmatter scan against GENERIC_TRIGGER_WORDS/TEMPLATE_DEFAULT_PHRASES is a regex-class check inside the quarter-second budget the always-on gates honor. CONFIRMED [SOURCE: phrase-judge.mjs:8-13 (dependency note); validator-registry.json:239; pre-commit:180 (budget comment)]
5. The weekly sweep's missing piece is not a new check but a wire: `--baseline <previous report>` turns today's artifact into tomorrow's ratchet. The tool's status vocabulary (regression/new-failure/first-run/known-failure) was built for exactly this and is unused. CONFIRMED [SOURCE: strict-pass-freshness.ts:20-32,90-96; strict-pass-freshness-report.yml:50-85]
6. Pre-existing corpus debt is structurally permanent under the current gates: changed-packet exempts it by design ("pre-existing"), weekly reports it, nothing schedules its reduction - which is why phase 013 existed at all. The `upgrade-baseline.json` mechanism is the standing answer: record debt per packet, let new mistakes fail. CONFIRMED [SOURCE: changed-packet-validation.yml:144-146; upgrade-legacy.mjs:421-458]

## Ruled Out

- Rule-level diff gating on every changed packet: heavier than verdict compare but the right fix is only "compare failing-rule sets, block growth" - cheap since both verdicts are already computed. Not ruled out; promoted to R13.2.
- Gating anchors/frontmatter via template-structure lint instead of the full validator: fragmentary reimplementation of rules the validator already owns; validate --no-recursive on staged packets reuses one verdict source.

## Dead Ends

None.

## Edge Cases

- New-packet hard-fail at :123-127 covers "authored bad packet enters repo" - the strictest case is already gated; the residual gap is worsening inside already-failing packets.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R13.1 | Compare failing-RULE sets, not verdicts: capture `x RULE` names at base and head; block only when head's set adds rules the base lacked (worsening), keep verdict-pass for base-passed regressions | Q5 | changed-packet-validation.yml regression block | S | Low: same validator calls, finer compare | workflow yml | finding 2 | CONFIRMED |
| R13.2 | Pre-commit structural check: run `validate.sh --strict --no-recursive` on the staged-packet set when <= ~20 packets; larger sets warn. Uses the packet set remint already computes. SPECKIT_SKIP_* bypass | Q5 | git-hooks/pre-commit after remint block | M | Med: ~2s/packet latency; cap + bypass keep it bounded | pre-commit | findings 3-4 | CONFIRMED gap |
| R13.3 | Cheap phrase lint at commit: scan staged docs' trigger_phrases against phrase-judge sets - catches GREP_CONVENTION-class debt at quarter-second cost | Q5 | git-hooks/pre-commit + phrase-judge import | S | Low: pure read+regex | pre-commit | finding 4 | CONFIRMED feasibility |
| R13.4 | Activate `--baseline` in the weekly sweep: download previous artifact (actions/download-artifact or committed baseline), pass it, surface regression/new-failure in summary; optionally file an issue on growth | Q5 | strict-pass-freshness-report.yml | S | Low: still report-only | workflow yml | finding 5 | CONFIRMED |
| R13.5 | Debt drawdown cadence: on weekly report, when failing-count rises vs baseline for 2 consecutive runs, open an issue assigning upgrade-legacy dry-run + owner review - turns report-only into an owned queue without gating merges | Q5 | workflow + issue template | M | Low-Med: issue noise if baseline bounces; hysteresis fixes | workflow yml | findings 5-6 | INFERRED cadence value |

Idempotency/reversal/meaning: all gate changes; none touches corpus content. R13.1 makes an existing check stricter (reversible by revert). R13.5 is automation-into-issues, still no auto-merge of repairs.

## Sources Consulted

- `steer.md`
- `.github/workflows/changed-packet-validation.yml` (:139-146 re-verified)
- `.github/workflows/strict-pass-freshness-report.yml`, `sweep/strict-pass-freshness.ts`
- `.skilled/scripts/install-git-hooks.sh`, `git-hooks/pre-commit`, `git-hooks/pre-push`
- `phrase-judge.mjs`, `validator-registry.json`
- Prior reads: upgrade-legacy.mjs, advisory-checks.yml

## Assessment

- New information ratio: 0.85
- Questions addressed: Q5 fully - coverage map + four named gaps + placement table
- Questions answered: all five (Q1-Q5) now carry evidence-backed answers

## Reflection

- What worked: the verdict-vs-ruleset read of the regression block; it's the one real correctness gap inside an otherwise well-built gate.
- What did not: nothing.
- Do differently: none; Q5 saturated.

## Recommended Next Focus

Iteration 14 (adversarial): attack the top recommendations - especially R8.3 (clean-tree precondition), R10.4 (App token), R13.1-13.2 (gate changes) - against the code for hidden costs or wrong assumptions.
