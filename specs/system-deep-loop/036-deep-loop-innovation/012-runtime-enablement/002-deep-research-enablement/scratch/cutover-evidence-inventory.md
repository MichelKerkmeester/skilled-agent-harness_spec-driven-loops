# What a real flip needs, and what can actually produce it

The authority edge now exists, so the flip is no longer blocked by a missing state. It is
blocked by evidence. `buildCutoverCertificate` refuses unless a full bundle verifies, and the
certificate is what the preflight consumes. This is the inventory of what can supply each
piece from a production path rather than a fixture.

## Method

For each producer, search for a caller outside its own module and outside `tests/`. A library
that exists but is only ever reached from a fixture is not a producer for this purpose — that
distinction is the whole point, because a certificate assembled from fixture-shaped evidence
would look exactly like one assembled from real evidence.

## Result

| Evidence | Production path | Status |
|---|---|---|
| `shadowParity` | `deep-research-shadow-parity/harness-adapter.ts` → `issueParityCertificate` | **Producible** |
| `migrationReceipts` | `receipts-and-effect-recovery/index.ts` → boundary receipts | **Producible** |
| `modeGateCertificate` | `deep-research-rollback-gate/mode-gate.ts` | Present; needs wiring |
| `classificationManifest` | `compileClassificationManifest` | **No production caller** |
| `rollbackDrillCertificate` | `runRollbackDrill` / `buildRollbackCertificate` | **No production caller** |
| `mixedVersionReplay` | — | **No production caller** |
| the certificate itself | `buildCutoverCertificate` | **No production caller** |

Every per-mode shadow-parity adapter exists, for all eight modes, so parity is the one piece
of the safety margin that is genuinely ready to run for real.

## The rollback drill is mandatory evidence

`certificate.ts` rejects with `ROLLBACK_DRILL_NOT_PASSED` unless
`rollbackDrillCertificate.facts.passed === true`, bound to this mode and this candidate SHA.

This looks at first like a contradiction with the ratified decision that there is no rollback
window and no restoration drill. It is not. The two describe different things:

- The certificate wants a **pre-flip rehearsal**: evidence that rollback *would* work if it
  were ever needed. It is a proof about the system's condition before authority moves.
- The operator's decision removes the **post-flip window**: no dual-authority period, no
  reversal path kept open afterwards, forward fixes only.

Running the drill as pre-flip evidence is compatible with never intending to use it. Recording
this because the surface reading suggests a conflict, and a future reader who assumes one might
be tempted to weaken the certificate rather than run the drill.

## Consequence

Three production paths have to be built before `deep-research` can be flipped on real
evidence: a drill runner bound to the candidate SHA, a classification-manifest compiler, and
the assembly that ties the bundle into a certificate. The libraries all exist; what is missing
is a caller that is not a test.

The shortcut — assembling the bundle from fixture-shaped or default-shaped objects — is
available and must not be taken. It would produce a certificate that verifies, a preflight
that returns ready, and an authority move backed by nothing. For an irreversible transition
whose entire safety margin is this evidence, a fabricated bundle is the worst possible
outcome, and it would be indistinguishable from a real one after the fact.
