# Iteration 14: adversarial pass - attacking the top recommendations against the code

## Focus

Try to refute the strongest recommendations: R8.3 (rollback precondition), R10.4 (App token), R13.2 (pre-commit validate), R7.2 (reconstruct skeleton), R6.1 (specFolder repair), and hunt for recommendations the research MISSED.

## Actions Taken

1. Re-read `steer.md`.
2. Verified `specFolder` consumers: `completion-state.cjs` resolves it (with `.opencode/specs` fallback).
3. Verified the anchor rule mechanics in `spec-doc-structure.ts:616-654`: same-id nested open is illegal; close must match stack top (orphaned otherwise); leftover stack = unclosed.
4. Re-verified the template's `questions` anchor structure at spec.md.tmpl:184/399/425.
5. Cross-checked the App-token claim against commit 01b0773d067's stated refusal.

## Findings

1. REFINEMENT (self-correction on iteration 3): the validator does NOT reject nested anchors per se - it rejects a same-id re-open while that id is open (`nested anchor ... not legal`, :622), a close that does not match the stack top (`orphaned closing anchor`, :635), and leftover opens (`unclosed anchor`, :654). The template bug is precise: `questions` opens at :184 and closes at :399 AND again at :425 behind a different level gate, so renders that emit both closers produce an orphaned closing on a fresh scaffold - the Level 2 questions block is legal nesting, the double-close is the defect. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:616-654; templates/core/spec.md.tmpl:184,190-258,399,425]
2. MISSED RECOMMENDATION FOUND: no prior iteration recommended fixing the ANCHORS_VALID SOURCE - the template's conditional double-close. Every recommendation healed downstream; the generator still emits the defect. R14.1 below. CONFIRMED gap in own coverage [SOURCE: spec.md.tmpl:399+425 pair; spec-doc-structure.ts:634-635]
3. REFUTED (partially) R8.3: a mandatory clean-tree precondition would have blocked phase 013's own repair - the corpus was being edited by concurrent workers during healing. And every constituent tool already writes atomically; a rollback manifest mostly duplicates git. SURVIVING FORM: document "run on a committed tree; reversal = git" plus optional `--record <dir>` manifest mode for `--include-archive` runs where per-file intent differs from git's. [SOURCE: upgrade-legacy.mjs:491-565; repair-derived.cjs:214-235 writeAtomic; steer.md concurrency note]
4. REFUTED (partially) R10.4: commit 01b0773d067 documents that GitHub refused THE ACTIONS APP as bypass actor on a personal-account repo - but a custom GitHub App CAN be a bypass actor; the real cost is app registration + installation + a token-minting step inside the job, making it M-effort not S. SURVIVING FORM: keep PAT but document required scope (Contents rw this-repo-only, bypass-actor owner) and rotation in the workflow README; App token as the upgrade path if PAT governance becomes a problem. [SOURCE: git show 01b0773d067 message; trigger-index-rebuild.yml:27-32]
5. REFUTED (as drafted) R13.2: validate.sh requires the runtime's built dist - the changed-packet CI builds three packages first. On a contributor machine with stale/missing dist, a fail-closed pre-commit validate would block ALL spec commits - worse than the drift. SURVIVING FORM: run the structural check only when the validator's dist is present and fresh; otherwise warn-and-pass, matching the hook's existing "toolchain present -> gate, absent -> pass" contract. [SOURCE: changed-packet-validation.yml:30-39 build steps; install-git-hooks.sh source-root fallback pattern]
6. REFUTED (as drafted) R7.2: a skeleton doc of "Not recorded" rows may itself fail SPEC_DOC_SUFFICIENCY, creating a file that still fails - noise plus a file that did not exist. SURVIVING FORM: reconstruct only when the result passes validation (verify before write, keep on pass, discard on fail); default alternative = record in upgrade-baseline.json. [SOURCE: batch-01.task rule 3; validator-registry SPEC_DOC_SUFFICIENCY]
7. STRENGTHENED R6.1: `specFolder` is not cosmetic metadata - `completion-state.cjs` resolves it to a real path (including an `.opencode/specs` fallback for legacy records), so a stale value breaks runtime resolution, not just a validator rule. The repair is load-bearing. CONFIRMED [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/completion-state.cjs:67-76]
8. ATTACK PASSED on the advisory pair: continue-on-error advisory + report-only weekly sweep means a tooling commit that introduces a NEW failure class on untouched packets is visible only inside a weekly artifact nobody must read. The baseline wire (R13.4) and issue cadence (R13.5) are the minimal fix; the attack confirms them rather than defeating them. CONFIRMED [SOURCE: advisory-checks.yml:8-13; strict-pass-freshness-report.yml:5-11]

## Ruled Out

- Recommending mandatory clean-tree gating (refuted in finding 3's original form).
- Recommending App-token migration as THE fix (refuted to upgrade-path status).
- Fail-closed pre-commit validate regardless of toolchain state (refuted; gated on dist freshness instead).
- Unconditional skeleton reconstruction (refuted; verify-or-record instead).

## Dead Ends

None.

## Edge Cases

- The dual close at template :399/:425 fires only when a render includes both gated regions - so the defect is level-conditional, which is why fresh-scaffold testing per level is the right test shape.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R14.1 | Fix the ANCHORS_VALID source: correct spec.md.tmpl's questions-anchor close so exactly one closer emits per level, and add a vitest that renders each level's scaffold and asserts the validator's anchor-stack contract passes | Q2, Q4 | templates/core/spec.md.tmpl + tests | S | Low: template structure fix; verify no level's docs break | template, vitest | findings 1-2 | CONFIRMED |
| R14.2 | Downgrade R8.3 to: document the reversal contract (commit first; reversal = git) in upgrade-legacy's README row, plus OPTIONAL `--record <dir>` rollback-manifest mode scoped to `--include-archive` runs | Q3 | upgrade-legacy.mjs + README | S-M | Low: docs + opt-in artifact | README, upgrade-legacy.mjs | finding 3 | REVISED after attack |
| R14.3 | Downgrade R10.4 to: document PAT scope/rotation in workflows README; note GitHub App as upgrade path | Q4 | .github/workflows/README.md | S | Low: docs | README | finding 4 | REVISED |
| R14.4 | Revise R13.2: pre-commit structural check runs only when validator dist exists and is fresh (mtime check); else warn-and-pass | Q5 | git-hooks/pre-commit | M | Med: freshness check adds complexity; skip must stay honest | pre-commit | finding 5 | REVISED |
| R14.5 | Revise R7.2: `--reconstruct` writes only when the new doc validates (verify-then-keep); otherwise records the FILE_EXISTS in upgrade-baseline.json | Q1, Q3 | healer + upgrade-legacy | M | Med: verify-then-write needs a validate pass per doc | healer, upgrade-legacy | finding 6 | REVISED |

Idempotency/reversal/meaning: all revisions reduce blast radius - docs, opt-ins, or verify-gated writes.

## Sources Consulted

- `steer.md`
- `spec-doc-structure.ts:616-654` (anchor rule mechanics)
- `spec.md.tmpl:184-425` (anchor layout)
- `completion-state.cjs:67-76` (specFolder consumer)
- `git show 01b0773d067` (Actions-app refusal rationale)
- `changed-packet-validation.yml:30-39` (build requirement)
- `advisory-checks.yml`, `strict-pass-freshness-report.yml` (non-blocking pair)

## Assessment

- New information ratio: 0.7 (the iteration's purpose is refutation, not discovery; two confirmed new facts: precise anchor mechanism + specFolder consumer)
- Questions addressed: all - the attack hardened the recommendation set
- Questions answered: all five stand after adversarial review, with four recommendations revised

## Reflection

- What worked: reading the anchor rule's exact predicates corrected an over-broad claim from iteration 3 and surfaced the real mechanism (double-close, not nesting).
- What did not: my earlier framing of "questions wraps unrelated sections" as THE bug - the validator cares about pairing, not semantic containment. Worth correcting explicitly.
- Do differently: adversarial passes earn their slot; two recommendations materially changed shape.

## Recommended Next Focus

Iteration 15: the ranked recommendation table - one table across Q1-Q5 ordered by value, folding in every revision from this pass.
