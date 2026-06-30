---
title: "Changelog: Flag Graduation Benchmark [005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark]"
description: "Chronological changelog for the flag graduation benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Built and ran the Stage 4 before-and-after benchmark that decides which default-OFF packet 028 flags earn graduation. The harness toggles each flag in isolation against the phase 039 migrated tree and reuses three existing measurement paths, the phase 036 integrity validator through the migrate driver verify pass for the migration-gated flags, and the phase 025 off-corpus false-confirm driver plus the envelope-fidelity replay checker for the benchmark-gated flags. It builds no new measurement machinery. The benchmark crowned the earners and named the keep-offs with a measured reason, then the orchestrator applied the flips.

### Added

- `scripts/flag-graduation-benchmark.mjs`, the Stage 4 driver that toggles each flag in isolation, reuses the two harnesses and the migrate verify pass, runs a field census across the migratable tree, and emits a per-flag GRADUATE or STAY-OFF verdict.
- `scripts/benchmark-report.json`, the raw machine report from the canonical run.
- `benchmark-results.md`, the per-flag before-and-after numbers, the migration field census, and the verdict table.
- Discriminating fixtures and benchmark cases for the four keep-off verdict and render flags so each keep-off names the fixture that would exercise it.

### Changed

- Recorded the verdict for thirteen flags. Six earned graduation, one of those by flipping `SPECKIT_GENERATED_METADATA_GRANDFATHER` OFF to enforce, with `SPECKIT_FALSE_CONFIRM_MAX_RATE` set to ceiling 0 conditional on a verdict flag being default-ON. The remaining flags stayed off, several measured neutral and two needing a migration re-run.
- Reproduced the documented 0.833 off-corpus false-confirm baseline exactly, confirming the driver is wired to the live verdict path. `SPECKIT_LEXICAL_GROUNDING_V1` and `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1` each independently drove the rate from 0.833 to 0 in isolation.

### Fixed

- No fixes recorded. This phase measures and records, it does not change behavior.

### Verification

- Migrate driver verify pass, default flags - PASS, 2049 folders checked, 0 violations, clean true, exit 0.
- Migrate driver verify pass, `SPECKIT_GENERATOR_HARDENING`=1 - 2049 violations, all `SOURCE_FINGERPRINT_MISSING`, exit 1, the measured reason this gate stayed off pending a re-run.
- Field census - `source_fingerprint` and `source_doc_hashes` each present in 0 of 2093 folders before the re-run.
- Idempotent-writes determinism - PASS, 61 of 61 deterministic on a double generate, stamp stripped.
- False-confirm baseline - 0.833, matches the documented rate.
- `SPECKIT_LEXICAL_GROUNDING_V1`=true - 0.000.
- `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1`=true - 0.000.
- False-confirm CI ceiling - exit 0 with lexical on, exit 1 with verdict flags off.
- Envelope replay - conforming render passes, dropped render fails.
- Docs gate - PASS, `validate.sh --strict` on this folder exit 0.

### Files Changed

- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/scripts/flag-graduation-benchmark.mjs`: created the Stage 4 graduation driver.
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/scripts/benchmark-report.json`: created the raw machine report.
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/benchmark-results.md`: created the per-flag verdict table and the field census.
- `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`: graduated the six benchmark-earned flags to their new defaults (orchestrator-applied flips).

### Follow-Ups

- The final reckoning of thirteen flags: twelve kept and one deleted. `SPECKIT_GROUNDING_SIGNAL_V1` was deleted as a measured-neutral formatter additive that earned no metric win. Of the kept flags, six graduated to their new defaults in this phase. The drift gate and generator hardening, which stayed off here for a missing field baseline, graduated after the phase 039 migration was re-run with their flags set, which wrote `source_doc_hashes` and `source_fingerprint` tree-wide.
