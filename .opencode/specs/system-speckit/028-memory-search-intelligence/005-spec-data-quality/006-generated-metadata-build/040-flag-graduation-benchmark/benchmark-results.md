---
title: "Benchmark Results: Flag Graduation Benchmark"
description: "Measured before-and-after data for every default-OFF packet 028 flag after the phase 039 full-repo migration. Migration-gated flags are verified against the phase 036 integrity validator run through the migrate driver verify pass, benchmark-gated flags are measured through the phase 025 off-corpus false-confirm driver and the envelope-fidelity replay checker. Records the per-flag verdict and the two flags that need a migration re-run before they can graduate."
trigger_phrases:
  - "flag graduation benchmark results"
  - "false confirm before and after"
  - "migration field census source fingerprint hashes"
  - "flag graduation verdict table"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Flag Graduation Benchmark

## 1. RUN METADATA

| Field | Value |
|-------|-------|
| Run date | 2026-06-22 |
| Corpus | the migrated live tree, 2049 migratable spec folders checked by the verify pass |
| Active embedder | nomic-embed-text-v1.5, ollama, 768-dim |
| Search limit | 20 |
| Harness | `scripts/flag-graduation-benchmark.mjs` |
| Raw report | `scripts/benchmark-report.json` |
| Migration validator | the migrate driver verify pass, `scripts/dist/graph/migrate-generated-json.js --dry-run --verify` |
| Safety driver | `mcp_server/scripts/evals/run-false-confirm-eval.mjs` |
| Render checker | `mcp_server/scripts/evals/check-envelope-fidelity.mjs` |

No flag default was changed by this run. The benchmark measures and records, the orchestrator owns the flips.

---

## 2. MIGRATION-GATED EVIDENCE

The migration driver restamped the tree under `SPECKIT_IDENTITY_MERGE_SAFETY` and `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` only. It never set the drift-gate or generator-hardening flags, so the fields those two gates read were never written. This is measured below, not assumed.

### 2.1 Verify pass under the default flag state

| Metric | Value |
|--------|-------|
| Folders enumerated | 2106 |
| Folders checked | 2049 |
| Failed migrations (dry-run) | 0 |
| Integrity violations | 0 |
| Verify clean | true |
| Driver exit | 0 |

The migrated tree passes the phase 036 integrity validator with zero violations across 2049 folders. There are zero `SPEC_FOLDER_PREFIXED` violations, so the specs-root-relative identity is restamped tree-wide.

### 2.2 Verify pass with `SPECKIT_GENERATOR_HARDENING` forced on

| Metric | Value |
|--------|-------|
| Folders checked | 2049 |
| Integrity violations | 2049 |
| Violation code | `SOURCE_FINGERPRINT_MISSING` (2049 of 2049) |
| Verify clean | false |
| Driver exit | 1 |

Every checked folder mass-fails the fingerprint assertion when the hardening flag is on, because no fingerprint was ever written.

### 2.3 Field census across the migratable tree

| Field | Folders carrying it | Of total |
|-------|---------------------|----------|
| `derived.source_fingerprint` (generator hardening) | 0 | 2093 |
| `source_doc_hashes` (drift gate) | 0 | 2093 |

Both fields are absent everywhere. A gate that reads a field the migration never wrote has no baseline to enforce against.

### 2.4 Idempotent-writes determinism

| Metric | Value |
|--------|-------|
| Sample folders checked | 61 |
| Descriptions deterministic on a double generate, stamp stripped | 61 of 61 |
| Stored description already matches a fresh derive | 26 of 61 |

The per-folder description generator is deterministic, so a re-save whose only delta is the volatile stamp is skipped rather than rewriting. The 35 stored files that differ from a fresh derive are content drift from spec docs edited after their stamp, which is the flag writing a real delta correctly, not a flag failure.

---

## 3. BENCHMARK-GATED EVIDENCE

### 3.1 Off-corpus false-confirm rate, one flag toggled per run

The driver scores 6 off-corpus hard-negative queries (`kubernetes`, `oauth`, `kafka`, `terraform`, `graphql`, `webpack`) through the production verdict path. A `good` verdict on an absent term is a false confirm. Each row toggles exactly one flag against the same corpus and query set.

| Run | False-confirm rate | False good / hard negatives | Per-query verdicts |
|-----|--------------------|-----------------------------|--------------------|
| baseline, all verdict flags off | 0.833 | 5 / 6 | kubernetes=good oauth=gap kafka=good terraform=good graphql=good webpack=good |
| `SPECKIT_LEXICAL_GROUNDING_V1`=true | 0.000 | 0 / 6 | all weak except oauth=gap |
| `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1`=true | 0.000 | 0 / 6 | all weak except oauth=gap |
| `SPECKIT_EVIDENCE_GAP_VERDICT_V1`=true | 0.833 | 5 / 6 | unchanged from baseline |
| `SPECKIT_CITE_WITH_CAVEAT_V1`=true | 0.833 | 5 / 6 | unchanged from baseline |
| `SPECKIT_GROUNDING_SIGNAL_V1`=true | 0.833 | 5 / 6 | unchanged from baseline |

Lexical grounding and noise-floor subtraction each independently drive the rate from 0.833 to 0. Both are verdict-only flags that read the lexical and relevance signals already on the result rows, so they change the label without reordering any result.

The three flags that show no movement are inert on this fixture for a measured reason. Evidence-gap reads a Stage 4 `evidenceGapDetected` signal the off-corpus driver never threads in, so the flag has no input on this path. Cite-with-caveat is a formatter citation tier that never promotes a fully ungrounded off-corpus hit, so the off-corpus class cannot exercise it. Grounding-signal is a formatter additive field that does not touch the verdict label.

### 3.2 False-confirm CI ceiling enforceability

| Run | Driver exit | Meaning |
|-----|-------------|---------|
| `SPECKIT_LEXICAL_GROUNDING_V1`=true with `SPECKIT_FALSE_CONFIRM_MAX_RATE`=0 | 0 | gate passes, rate 0 within bar 0 |
| verdict flags off with `SPECKIT_FALSE_CONFIRM_MAX_RATE`=0 | 1 | gate fails, rate 0.833 exceeds bar 0 |

The ceiling enforces cleanly only once a verdict flag has driven the rate to zero. With the raw default-off corpus it fails. Setting the ceiling to 0 is therefore safe only when a verdict flag graduates to default-ON in the same change.

### 3.3 Envelope-fidelity replay

| Render | Checker status | Exit |
|--------|----------------|------|
| a conforming render that keeps both verdict fields | conforming | 0 |
| a weak render that drops the verdict pair | non_conforming | 1 |

The replay checker mechanics work in both directions. There is no captured render corpus committed in the repo, so a real grandfather before-and-after over live renders cannot be measured here. The flag's own graduation gate requires that clean grandfather report over real renders.

---

## 4. PER-FLAG VERDICT TABLE

| Flag | Class | Verdict | Evidence |
|------|-------|---------|----------|
| `SPECKIT_IDENTITY_MERGE_SAFETY` | migration-gated | GRADUATE | verify clean across 2049 folders, zero `SPEC_FOLDER_PREFIXED`, migration restamped under this flag |
| `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` | migration-gated | GRADUATE | generator deterministic 61 of 61 stamp-stripped, migration ran under this flag, verify clean, no mass rewrite of unchanged content |
| `SPECKIT_GENERATED_METADATA_GRANDFATHER` | migration-gated | GRADUATE by flipping OFF | verify under the default flag set reports 0 violations, so enforcing the integrity rule is clean. Hold the flip-off decoupled from any hardening flip until fingerprints are backfilled |
| `SPECKIT_GENERATED_METADATA_DRIFT_GATE` | migration-gated | STAY-OFF, needs migration re-run | 0 of 2093 folders carry `source_doc_hashes`, the migration never set this flag so no freshness baseline exists |
| `SPECKIT_GENERATOR_HARDENING` | migration-gated | STAY-OFF, needs migration re-run | 0 of 2093 folders carry `source_fingerprint`, verify with the flag on mass-fails 2049 of 2049 on `SOURCE_FINGERPRINT_MISSING` |
| `SPECKIT_LEXICAL_GROUNDING_V1` | benchmark-gated | GRADUATE | false-confirm 0.833 to 0, measured in isolation, verdict-only so no reorder |
| `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1` | benchmark-gated | GRADUATE | false-confirm 0.833 to 0, measured in isolation, nomic carries a real measured floor, verdict-only so no reorder |
| `SPECKIT_FALSE_CONFIRM_MAX_RATE` | benchmark-gated | GRADUATE, set ceiling 0, conditional on a verdict flag being default-ON | gate exit 0 with lexical on, gate exit 1 with verdict flags off |
| `SPECKIT_ENVELOPE_FIDELITY_V1` | benchmark-gated | STAY-OFF | replay mechanics proven both ways, no captured render corpus exists for a real grandfather before-and-after |
| `SPECKIT_GROUNDING_SIGNAL_V1` | benchmark-gated | STAY-OFF, neutral | formatter additive field, false-confirm unchanged at 0.833, no measured metric win |
| `SPECKIT_CITE_WITH_CAVEAT_V1` | benchmark-gated | STAY-OFF, neutral | formatter citation tier, false-confirm unchanged at 0.833, off-corpus never exercises the caveat tier, needs a borderline-grounded weak fixture |
| `SPECKIT_EVIDENCE_GAP_VERDICT_V1` | benchmark-gated | STAY-OFF, neutral | verdict-path flag but the off-corpus driver never threads the gap signal, false-confirm unchanged at 0.833, needs a gap-bearing fixture |
| `SPECKIT_GENERATED_METADATA_Z_EXCLUSION` | already default-ON | STAY default-ON | safe by construction, excludes `z_*` from the descriptions cache, no benchmark required |

---

## 5. FLAGS THAT NEED A MIGRATION RE-RUN BEFORE GRADUATION

Two flags cannot graduate yet because the phase 039 migration ran without them, so the fields they enforce against were never written.

1. `SPECKIT_GENERATED_METADATA_DRIFT_GATE` needs `source_doc_hashes` on every folder. Re-run the migration with `SPECKIT_GENERATED_METADATA_DRIFT_GATE=1` set, then re-measure.
2. `SPECKIT_GENERATOR_HARDENING` needs `derived.source_fingerprint` on every folder. Re-run the migration with `SPECKIT_GENERATOR_HARDENING=1` set, then re-measure. The verify pass with the flag on currently mass-fails 2049 of 2049 folders.

The migrate driver flag set lives in `scripts/graph/migrate-generated-json.ts` at the `MIGRATION_FLAGS` constant, which today sets only identity-merge-safety and idempotent-writes. Adding the two flags above to that set, or running the migration with them exported, is the prerequisite for graduating either gate.

---

## 6. REPRODUCTION

```bash
node .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/scripts/flag-graduation-benchmark.mjs --sample 60
```

The migration section reuses the migrate driver verify pass and the per-folder description generator. The benchmark section shells out to the false-confirm driver and the envelope checker. The full run writes `scripts/benchmark-report.json`. Pass `--no-eval` to run the migration section alone without the embedder-backed false-confirm runs.
