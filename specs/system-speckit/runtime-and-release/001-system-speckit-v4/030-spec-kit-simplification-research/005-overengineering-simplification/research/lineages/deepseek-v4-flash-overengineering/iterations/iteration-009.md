# Iteration 009 — KQ-R2e: adherence scan inside specs/ — full-corpus fingerprints (recounted)

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 9 | focus: broad statistical adherence scan of the specs/ corpus in THIS tree — fingerprint stamp shapes, placeholder residue, acceptance-criteria closure state. Round one sampled 1 packet + 6 fingerprints (its positive control was the healthiest packet); this pass censuses the corpus.
Evidence reads: python census over 3,250 `implementation-summary.md` files under `specs/` (shape classification with manual regex verification of the anomalous bucket), 157 `acceptance-criteria.md` files, placeholder-region review of the 9 marked docs. Reads cost: 5 bash calls. No node/validate/git.

## Fingerprint census (the corpus fact that changes the duty-cycle math)

| Bucket | Count | Share |
|---|---|---|
| well-formed `sha256:` + 64 hex | **412** | 12.7% |
| all-zero placeholder (`sha256:000…0`, 64) | 1,888 | 58.1% |
| **pseudo-hash (`sha256:` + human mnemonic)** | **27** | 0.8% |
| `null` | 2 | 0.1% |
| no `session_dedup.fingerprint` field at all | 921 | 28.3% |

- The zero share = 58.1% — matches the census's main-checkout re-measure (1,890/3,247 = 58%); round one's in-tree 62.2% was measured on its own (earlier) tree state. **The census's 58% figure is confirmed in this tree.**
- **The "never recorded" share is 87.3% (2,838/3,250): zero + absent + pseudo + null.** Round one's "1,084 packets (37.8%) have real fingerprints" is an overcount: its count accepted any `sha256:` prefix; the strict well-formed count is 412 (12.7%). The freshness covenant's actually-exercised population is ~1 in 8 packets, not ~1 in 3.

## The fabricated-stamp class (angle 7's exact target)

27 packets carry `session_dedup.fingerprint: "sha256:<mnemonic>"` — e.g. `sha256:045-007-deep-loop-workflow-integrity-audit`, `sha256:001-fix-skill-advisor-fail-open-fallback-2026-04-28`, `sha256:030-full-matrix-implementation-summary`, `sha256:045009documentationtruthsummary000000000000000000000000000` (padded to look mechanical), 2 more carry `fingerprint: null`. Verified these sit in the `_memory.continuity.session_dedup.fingerprint` slot — the exact field `continuity-freshness.ts:339-356` binds the attestation to. No legacy note anywhere (references/memory, validation-rules.md) documents a semantic-label format; the contract has always been SHA-256. **The stamp is fabricated — the field is filled with a label, not a hash.** The checker's `/^sha256:[a-f0-9]{64}$/` test (continuity-freshness.ts:345) REJECTS them → `missing_fingerprint` → a completion claim behind a fake stamp is never staleness-checked, exactly like a packet with no stamp — the class is invisible unless someone looks at the values.
- Era: z_archive tracks (deep-loop, skill-advisor) + the 026 release-readiness/stress-test era — pre-covenant packets where the field was evidently filled by hand with session labels.

## Acceptance-criteria closure (positive)

157 packets carry acceptance-criteria.md; 19 (12%) have no row marked Met/Waived/Superseded — and **0 of those carry a completion claim** (cross-checked against each packet's implementation-summary status/closure fields). The closure machinery's adherence holds at corpus scale: no packet claims done with an unmarked AC table.

## Placeholder residue (positive)

9 docs matched marker patterns; on review all 9 are benign: 6-7 in `z_archive` (archived, historical), the `026-…/005-orchestrator-placeholder-parity` trio + `052-routing-completeness/008-drift-after-closure` are documents DISCUSSING placeholder patterns (quoted pattern lists), not containing live placeholders. Zero real residue.

## Findings

**F2-14 [P1 — faked attestation field + silent classification] 27 packets carry mnemonic "sha256:label" values (2 more `null`) in the session_dedup.fingerprint slot; the freshness checker folds them into `missing_fingerprint`, so a fake stamp both hides and counts as never-recorded.**
- Where: `specs/**/implementation-summary.md` `_memory.continuity.session_dedup.fingerprint` (27 pseudo + 2 null; representative: `specs/system-deep-loop/z_archive/029-deep-loop-runtime/013-deep-loop-workflow-integrity-audit/implementation-summary.md`, `specs/system-skill-advisor/z_archive/007-skill-advisor-production-hardening/005-fail-open-fallback/implementation-summary.md`, `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/030-clean-infrastructure-full-matrix-stress-design/implementation-summary.md`); checker branch `runtime/cli/validation/continuity-freshness.ts:345-356`.
- Cost: (a) any audit counting `sha256:` prefixes records these as attested (round one's 1,084-real count is inflated by this class — verifiable cause of the count divergence); (b) completion claims behind fake stamps are never staleness-checked (the covenant's one job, silently skipped for 29 packets); (c) the class is only discoverable by value inspection, not by the machinery that exists to attest it.
- Protects: nothing — it IS the failure mode the covenant exists to prevent, in its attested field.
- Severity: P1 — the angle-7 "agents faked a surface" class, corpus-proven, and the checker's classification hides it.
- Recommendation: **merge** — one extra branch in the checker: values starting `sha256:` that fail the 64-hex regex report a distinct `invalid_fingerprint_format` warn (visible class, no behavior change for conforming packets); then migrate the 29 stamps to the zero placeholder (they are semantically never-recorded). This improves adherence (fake stamps become visible) without dropping a capability.

**F2-15 [P2 — corrected adoption figure] The freshness covenant's exercised population is 412/3,250 (12.7%), never-recorded 87.3% (1,888 zero + 921 absent + 27 pseudo + 2 null); the round-one "37.8% real" and census "58% zero" figures stand only with the absent and pseudo classes separated out.**
- Where: corpus census above vs round-one F27 (62.2% zero / 1,084 real) and census F27 re-measure (58% zero / 1,890 real — confirmed); the classification rule is `validation-rules.md:113` (zero placeholder = never recorded) + the checker's missing_fingerprint skip.
- Cost: any future duty-cycle claim quotes 58% or 38% — the right "the covenant actually exercised" number is 12.7%; the rounded figures are the ones the simplification plan's keep-list carries.
- Protects: nothing; it is a measurement correction.
- Severity: P2.
- Recommendation: **keep** (adoption fact, per the census's own F27 disposition), with the corrected 12.7% recorded as the measured number and the 29-stamp correction (F2-14) applied first so the future census is clean.

## Ruled out / corrections

- "The 19 unmarked AC tables are faked closures" — FALSE: 0 of them carry a completion claim (they're open/active packets).
- "The 9 placeholder docs are residue" — FALSE: archived + pattern-discussion contexts only.
- "The 2 `null` fingerprints are a separate class" — merged into F2-14 (same slot, same invisibility).

## Provisional counts

- Corpus: 3,250 impl-summaries (this tree; census main-checkout: 3,247 — 3 more here).
- Fingerprint shapes: 412 well-formed / 1,888 zero / 27 pseudo / 2 null / 921 absent.
- AC packets: 157; unmarked 19 (12%), 0 claimed-complete.
