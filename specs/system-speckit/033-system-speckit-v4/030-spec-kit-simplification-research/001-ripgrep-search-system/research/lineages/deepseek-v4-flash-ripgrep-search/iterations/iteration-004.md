# Iteration 004 — Enforcement-stack gap: judge classes, doctor screening, generator diagnostics

**Focus:** Given the pollution census (iteration 3), map the three enforcement points and name exactly which pollution classes each misses: (a) `judgeTriggerPhrase` + `filterTriggerPhrases` (validator + retrofit gate), (b) the doctor's `corpus_pollution` signal, (c) the generator's fail-closed policy and diagnostics. Round one verified the generator's fail-closed behavior for malformed frontmatter and the doctor's staleness signals, but never walked the pollution class matrix.

**Method:** Read `grep-convention.mjs` §7 (allowlist), `check-grep-convention-helper.mjs` §5-6 (judgement wiring + severity), `CATEGORY_SEVERITY`, the doctor YAML staleness signals + phase_1 activities, and the generator's diagnostics emission (`generate-trigger-index.mjs:167-190`).

## Findings

### N4 — JUDGE ADMITS THE ENTIRE FRAGMENT/NUMERIC CLASS (P1, new)

- **Path:line:** `runtime/cli/retrieval/lib/grep-convention.mjs:742-781` (judgeTriggerPhrase negative classes: normalizes-to-nothing, editor-fallback, generic-workflow-word, stop-word-only, prose-sentence, folder-token-fallback); `:88-100` (CATEGORY_SEVERITY — 'generic-trigger' is WARN; no category exists for single-token/numeric/fragment)
- **Claimed vs actual:** The convention's §8 rule "Declare phrases of two or more tokens" (retrieval-conventions.md:260) is a convention with no class, no category, no severity in the one shared judge that both the retrofit (gate on write) and the validator (rule per fold) use. A single-token phrase that is NOT a generic word, NOT stopword-only, NOT a folder-token echo is admissible: 'ation', 'claude', 'parity', '000' all pass. The judge and the rule share the module (helper imports judgeTriggerPhrase at check-grep-convention-helper.mjs:21-26 with the comment "so the two enforcers reject the same phrases for the same stated reason") — the gap is therefore in the shared vocabulary, not in drift.
- **Severity:** P1 — this is the enforcement-side counterpart of N3: a documented rule with no detection class.
- **Recommendation:** Add `single-token` (warn) and `numeric-only` / `path-fragment` (warn) negatives to judgeTriggerPhrase; both the retrofit and the validator then enforce them for free. Consider `tokens.length === 1 && !GENERIC.has(...)` → single-token warn — this also flags the legitimate author choices ('claude', 'hook') as warnings, which is consistent with the existing folder-token-echo warn philosophy ("a warning that reports the resemblance rather than an error that claims to know where the phrase came from", :733-741).

### N5 — DOCTOR'S POLLUTION SCREEN IS SAMPLING-COUPLED: HIGH-SEVERITY SIGNAL, NEAR-ZERO DETECTION POWER (P1, new)

- **Path:line:** `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml:138-139` (`corpus_pollution` severity: high) vs `:180-182` (phase_1 activities: "Sample up to 5 packets flagged as staleness candidates", "Screen the sampled phrases against the … section 8 warn list")
- **Claimed vs actual:** The signal's detection path only screens phrases in ≤5 packets that were ALREADY flagged as staleness candidates (via `index_older_than_corpus` mtime comparison). In the steady state the committed pair is fresh (as it is in this tree — V5), no packets are flagged, and NOTHING is ever screened — so a high-severity signal with a documented fire condition never evaluates the one condition it exists for. The 826 single-token and 175 generic-word documents are invisible to `/doctor speckit-retrieval` today.
- **Severity:** P1 — the doctor's headline pollution claim (severity high) has detection power only in the stale state, which is precisely when one would NOT expect pollution to be newly introduced. The fix round one shipped for L1/L6 (committed-pair check) is index-freshness-oriented; phrase quality remains unobserved by design.
- **Recommendation:** Decouple: replace the sampled screen with a full-phrase screening pass over the committed index (the index itself already IS the phrase census — the doctor can count generic/single-token/fragment keys in one JSON read with no corpus walk and no generator run), and report the counts even when stale. Mitigation: add the same counts to `generation-diagnostics.json` at generation time (one map over parsed phrases) so even without the doctor, the number is committed with every regeneration.

### N6 — GENERATOR DIAGNOSTICS CARRY STRUCTURE COUNTS ONLY, NOT QUALITY COUNTS (P2, new)

- **Path:line:** `generate-trigger-index.mjs:179-186` (diagnostics: counts by category, malformedDocuments, ignored, rows, skippedPaths) — the `counts` object is keyed by frontmatter CATEGORY only; the phrase loop at :130-138 has `phraseDeclarations`/`uniquePhrases` in stats but no quality breakdown
- **Claimed vs actual:** The generator's own "diagnostics" — the natural owner of a quality signal — has no slot for single-token/generic/fragment phrase counts. A pollution regression between two regenerations is only observable by a third-party census (round two's own pass), not by the committed diagnostics.
- **Severity:** P2 — with N4/N5 fixed this becomes the telemetry the doctor needs; alone it is a gap, not breakage.
- **Recommendation:** In the phrase loop, bucket by `latestJudged = judgeTriggerPhrase(raw, {folderTokens})` and emit `phraseQuality` counts in diagnostics. This reuses the shared judge, so diagnostics and validator can never disagree on classes.

## Ruled out this pass

- Generator fail-closed expansion to quality: the generator's refusal policy is scoped to trust (malformed declarations) and the 006 remediation kept it that way; expanding refusal to pollution would fail publication on the 826 owning docs and is a policy decision, not a correctness fix — recommend diagnostics + warning, NOT refusal.
- Retrofit-side enforcement: the retrofit gates writes (grep-convention.mjs:794-817 filterTriggerPhrases), so NEW docs are screened; the 826 are legacy corpus rows the retrofit only reports. The fix belongs in the judge classes + diagnostics, then a one-time retrofit run.

## Open questions

1. Should `corpus_pollution` severity stay high once detection power is real — or is "high" justified only for a future enforcement mode?
2. Is the doctor allowed (by its own read-only contract and the `forbidden_targets`) to read the committed index and count phrases? (Yes — reading is unrestricted; the restriction is on writes. The screening activity would be a read; confirm the YAML's fail_fast doesn't forbid new activities on a fresh pair.)
