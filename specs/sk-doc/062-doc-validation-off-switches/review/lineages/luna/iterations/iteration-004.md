# Iteration 004 — Maintainability

## Focus
Compared all four `hook-flags.env` readers and their shared parity tests, then checked whether documented parser edge cases are represented by the contract and regression table. This was a source-only pass; no tests were run.

## Files reviewed
- `.skilled/hooks/shared/hook-flags.sh`
- `.skilled/hooks/shared/hook-flags.cjs`
- `.skilled/hooks/shared/hook-flags.test.cjs`
- `.skilled/skills/sk-doc/shared/scripts/validation_switch.py`
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`
- `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py`
- `specs/sk-doc/062-doc-validation-off-switches/spec.md`
- `specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md`

## Findings
### P2-LUNA-004 — Shell truthiness removes internal whitespace
The shell reader removes every whitespace character before comparing values. `t r u e` therefore resolves as on in shell, while CJS and Python trim only at the ends and resolve it as off. The fixed truthy-token contract does not authorize internal whitespace removal. [SOURCE: .skilled/hooks/shared/hook-flags.sh:25-29] [SOURCE: .skilled/hooks/shared/hook-flags.cjs:93-96] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation_switch.py:43-45] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:129-130]

**Recommendation:** Match surrounding-whitespace normalization and add an internal-whitespace row to the parity test.

### P2-LUNA-005 — A BOM-prefixed first-line switch is not recognized by two readers
Node's `trim()` and Python's `utf-8-sig` remove a leading BOM. The shell key match and dist reader keep it, so a switch on the first line of a BOM-encoded file is ignored by those two readers. This conflicts with REQ-008's all-four-reader parity wording. The packet records the limitation, but the four-reader comment test contains no BOM-prefixed switch; the BOM test compares only Node and the sk-doc Python reader. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:107-122] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation_switch.py:65-80] [SOURCE: .skilled/hooks/shared/hook-flags.sh:43-48] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:35-50] [SOURCE: .skilled/hooks/shared/hook-flags.test.cjs:193-245] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py:63-76] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:141] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md:141]

**Recommendation:** Align BOM handling or narrow the contract, then test the chosen behavior in all four readers. Severity remains P2 because it affects the uncommon BOM-prefixed first key and is disclosed in the summary.

## Ruled out in this pass
- The comment-after-value parser table covers bare values, quoted values, tabs, `a#b`, and an empty value before a comment across all four readers. [SOURCE: .skilled/hooks/shared/hook-flags.test.cjs:193-245]
- The Python parser's BOM case is present, but only in a two-reader comparison and with a comment as the first BOM-prefixed line. [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py:63-76]

## Convergence telemetry
Two new P2 findings; weighted novelty ratio 0.222. The session remains below its five-iteration cap, so synthesis is deferred.

Review verdict: PASS
