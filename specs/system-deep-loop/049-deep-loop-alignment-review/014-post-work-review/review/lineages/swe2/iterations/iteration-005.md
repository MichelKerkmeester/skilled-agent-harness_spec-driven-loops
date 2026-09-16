# Iteration 5 — Containment-Promise Rewrite Audit

**Focus:** D1 Correctness + D3 Traceability — Angle 5: does the rewritten containment/severity text now describe what the runtime does, and did the rewrite avoid overshoot (promising more than the mechanism) and undershoot (leaving an unremediated site)?
**Phase record audited:** `009-containment-promise-and-severity-scale`

## Method

1. Read every containment promise site the spec names (4 workflow files + the guard docstring) and verified each now describes preserve-by-default and names `write-containment.ts` as remedy authority.
2. Checked the advisory code path actually matches the prose (violations → console.error advisory → exit with dispatch's code, not a containment failure).
3. Verified the verdict-check contract restatement at all three surfaces (verifier comment, SKILL.md, prompt-pack).
4. Verified the out-of-scale severity reporting in fanout-merge: the collector, its dedup, its channel, and its message.
5. Swept the whole deep-loop surface for unremediated revert/restore claims in containment context.
6. Verified the two load-bearing mechanism claims in the prose: `completed_with_containment_advisory` status and the quarantine path layout.

## Evidence

### REQ-001 — all five containment sites corrected, mechanism-accurate

- Both confirm variants carry the identical corrected note: "preserves by default -- bytes stay on disk and a copy is quarantined ... restoring is opt-in per run and nothing here fails the iteration; the authority for both modes is runtime/lib/deep-loop/write-containment.ts" [SOURCE: deep-review-confirm.yaml:1262, deep-research-confirm.yaml:1215].
- Both auto variants carry the corrected comment: "PRESERVES by default -- event recorded, copy quarantined, bytes left on disk -- ... reverting is opt-in per run and is not implied by this call" [SOURCE: deep-review-auto.yaml:1515-1522, deep-research-auto.yaml:1632-1638].
- The guard docstring states preservation-by-default with the shared-checkout attribution rationale and the fails-open contract — no caller obligation remains [SOURCE: write-containment.ts:5-30].
- The code matches the prose: `containment.violations.length > 0` produces a `console.error` advisory and then `process.exit(dispatchExit)` — the dispatch's own exit code, not a containment failure [SOURCE: deep-review-auto.yaml:1534-1541].

### REQ-002 — verdict-check contract restated at all three surfaces

- Verifier comment: "Shape only: this reads the line's format, never whether it agrees with the findings, so a PASS written above active P1 findings passes here. The line is the leaf's own report; the verdict that governs a release is recomputed from the findings registry, and in a fan-out run the cross-lineage merge turns any active P0 into a merged FAIL" [SOURCE: verify-iteration.cjs:243-247].
- SKILL.md:363 carries the same statement verbatim in substance.
- prompt-pack:71 carries it where the rater reads it.

### REQ-003 — out-of-scale severity reporting

`collectUnrankedSeverities` (fanout-merge.cjs:34-48) reports any present-but-unranked severity per (lineage, findingId, severity) with dedup; absent severities correctly defer to registry-shape warnings; the report rides the existing mismatch channel (:865-874) with a message that names the finding, lineage, value, and the collapse remedy. The rank table remains the three-tier `SEVERITY_RANK = {P0:3, P1:2, P2:1}` (:23) — no invented tier.

### REQ-004 — collapse rule written where a rater reads it

SKILL.md:327 ("collapse it to the tier its impact actually matches (a `P3` becomes `P2`) and keep the original rating visible... unconverted out-of-scale severity... sorts below every P2 and cannot raise the merged verdict") and prompt-pack:53 carry the identical rule.

### Mechanism claims in the prose — both real

- `completed_with_containment_advisory` is a real lineage status [SOURCE: fanout-pool.cjs:36 constant; produced by fanout-run per tests].
- The quarantine layout `containment/quarantine/<pass>/containment-out-of-scope|containment-reverted/` exists in the guard [SOURCE: write-containment.ts:1236,1439].

### Undershoot sweep — no unremediated site

Every `revert`/`restore` occurrence across `deep-review/`, `deep-research/`, `commands/deep/` in containment context is either the corrected prose (loop-protocol.md review:295 / research:290 both describe preserve accurately) or an unrelated usage (run-now restore, divergent pivots, changelog history). No surviving revert promise.

## Findings

None. The rewrite is mechanism-accurate at every named site, the two statements (shape-only check + collapse rule) appear at all three surfaces a reader meets them, and no unremediated claim survives. The `NFR-S01` claim — "a blocking finding can no longer disappear from the rollup by carrying a rating outside the scale" — is now mechanically true via the report channel.

## Claims refuted

- "A containment site still promises a revert" — refuted: all 5 sites + both loop-protocol docs describe preserve-by-default; sweep found no survivor.
- "The verdict contract was restated only in code comments" — refuted: it appears in the verifier, SKILL.md, and the rater-facing prompt-pack.
- "The prose overstates the mechanism" — refuted: `completed_with_containment_advisory` and the quarantine layout both exist as described.

## Verdict rationale

Clean pass. The phase's claim "each domain has one authority, and every losing site points at it" is verified at every site.

Review verdict: PASS
