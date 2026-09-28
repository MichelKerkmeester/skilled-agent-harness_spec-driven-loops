# Iteration 005 — Cross-dimensional adversarial replay

## Focus
Rechecked every active finding against the source and counterevidence, then widened the pass to the packet's direct doc consumers, the adjacent changelog phase, CI workflow variable names, and the 20-validator guard contract. This is still a read-only review; no tests, validators, or repository write tooling were run.

## Files reviewed
- `.skilled/hooks/shared/hook-flags.sh` and `.skilled/hooks/shared/hook-flags.cjs`
- `.skilled/skills/sk-doc/shared/scripts/validation_switch.py` and `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`, `progressive-validate.sh`, and `quality-audit.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts`
- `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py` and `.skilled/hooks/shared/hook-flags.test.cjs`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md`
- `specs/sk-doc/062-doc-validation-off-switches/spec.md`, `plan.md`, `acceptance-criteria.md`, `implementation-summary.md`, and `tasks.md`
- `specs/sk-doc/061-skilled-release-changelog/spec.md` and `003-adjacent-alignment/implementation-summary.md`
- `.github` workflow tree (targeted read-only search for all four switch/config names; no matches, command exit 1)

## Adversarial replay of active findings
1. **P2-LUNA-001, environment sentinel:** retained. The literal is a set value but collides with the shell's absence marker; the file fallback remains reachable. [SOURCE: .skilled/hooks/shared/hook-flags.sh:37-44] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:129-130]
2. **P1-LUNA-002, progressive JSON:** retained. The CLI accepts `--level 1` and `--json`; its JSON branch captures `validate.sh` with `2>&1`, then prints the combined output. The producer emits the notice on stderr and JSON on stdout. This is a reproducible control-flow proof from source, and the packet's plan lists this wrapper as a direct affected surface. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:16-18] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:255-274] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:168-172] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/plan.md:78-82]
3. **P2-LUNA-003, audit pass status:** retained as an advisory. The plan explicitly leaves those local consumers unchanged, but the env reference and summary say a skip is no evidence; the status remains ambiguous in quality-audit and strict-pass-freshness. [SOURCE: specs/sk-doc/062-doc-validation-off-switches/plan.md:78-82] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:172] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh:125-150] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:253-272]
4. **P2-LUNA-004, whitespace truthiness:** retained. Shell removes internal whitespace, unlike the two trim-only resolvers; the mismatch follows directly from the implementations. [SOURCE: .skilled/hooks/shared/hook-flags.sh:25-29] [SOURCE: .skilled/hooks/shared/hook-flags.cjs:93-96] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation_switch.py:43-45]
5. **P2-LUNA-005, BOM parity:** retained. The summary discloses the gap, but REQ-008 still claims four-reader parity; current shared tests do not compare a BOM-prefixed switch across all four. [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:141] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md:141] [SOURCE: .skilled/hooks/shared/hook-flags.test.cjs:193-245] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py:63-76]

## Cross-scope and protocol notes
The manifest enumerates 127 paths across the current validation packet and adjacent changelog work. This pass sampled the 061 parent spec and its phase-3 summary, which describe changelog findability/type detection and nested generator changes; no interaction with the validation switch was found. The `validate_document.py` change is at type detection and remains separate from the main-entry switch guard. [SOURCE: specs/sk-doc/061-skilled-release-changelog/spec.md:82-109] [SOURCE: specs/sk-doc/061-skilled-release-changelog/003-adjacent-alignment/implementation-summary.md:55-65] [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:1695-1715]

The 20-validator test enumerates guarded check paths, while separate evidence covers writer/self-test exemptions. Those are source and test-definition checks only; this review did not rerun the suites. [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py:138-153] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py:187-211]

Core traceability remains partial: `spec_code` has the progressive wrapper gap; `checklist_evidence` has documented AC/task evidence that was not replayed. `checklist.md` is absent, so the workflow's AC_COVERAGE signal is exempt. The targeted `.github` search for `SPECKIT_SKIP_VALIDATION`, `SKDOC_SKIP_VALIDATION`, `HOOK_FLAGS_CONFIG`, and `SPECKIT_VALIDATION` returned no matches (exit 1).

## New findings
None. The cross-dimensional replay confirmed the five active findings above.

## Convergence telemetry
No new findings; weighted novelty ratio 0.0. The configured max-iterations policy governs the stop, so synthesis proceeds only after this fifth pass.

Review verdict: CONDITIONAL
