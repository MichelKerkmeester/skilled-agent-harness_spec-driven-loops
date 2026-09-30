# Iteration 002 — Security

## Focus
Reviewed user-controlled switch names and config-file parsing boundaries, plus the guard placement on check versus write/self-test paths. This was a read-only source review; tests were not rerun.

## Files reviewed
- `.skilled/hooks/shared/hook-flags.sh`
- `.skilled/hooks/shared/hook-flags.cjs`
- `.skilled/hooks/shared/hook-flags.test.cjs`
- `.skilled/skills/sk-doc/shared/scripts/validation_switch.py`
- `.skilled/skills/sk-doc/shared/scripts/validation-switch.cjs`
- `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py`
- `.skilled/skills/sk-doc/scripts/validate_document.py`
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`

## Result
No security finding in this pass. The shell public API rejects empty, digit-leading, or non-identifier names before invoking the resolver's `eval`; its marker-file test checks that an injection-shaped name creates no file. [SOURCE: .skilled/hooks/shared/hook-flags.sh:51-59] [SOURCE: .skilled/hooks/shared/hook-flags.test.cjs:183-187]

The config file is opened and parsed as text by the Node and Python readers; no file contents are sourced as shell code. The shell reader extracts a matching key/value line and applies string normalization. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:107-132] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation_switch.py:57-84] [SOURCE: .skilled/hooks/shared/hook-flags.sh:43-48]

Guard placement matches the declared exception boundary: CLI arguments are parsed first, then check mode exits early, while `validate_document.py --fix` remains live. [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:1695-1715] The sk-doc sweep test also encodes the writer/self-test exemptions. [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py:187-211]

The correctness finding from iteration 1 remains a value-precedence edge case, not an injection path.

## Convergence telemetry
No new findings; weighted novelty ratio 0.0. Continue through the configured five-iteration cap.

Review verdict: PASS
