# Iteration 1: validate_document.py — is_uppercase_section refinement

> dimension: correctness | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] Arbitrary mixed-case prose bypasses the ALL-CAPS gate**

  [validate_document.py:308](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0097-sk-doc-documentation-quality/.opencode/skills/sk-doc/shared/scripts/validate_document.py:308>)

  Evidence: The internal-capital test accepts any token containing an uppercase character after its first character. Through `validate_h2_headers`, `oVERVIEW`, `tITLE cASE`, and lowercase single-letter `a` all produced zero errors. This violates the requirement to reject non-uppercase prose.

  Fix: Require `word.isupper()` unless the token is an explicitly supported mixed-case product name. Arbitrary identifiers should require backticks. Add table-driven regression tests for malformed mixed case and one-letter prose.

- **[P1] Regex exemptions reject valid nested parentheticals and URL forms**

  [validate_document.py:296](</Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0097-sk-doc-documentation-quality/.opencode/skills/sk-doc/shared/scripts/validate_document.py:296>)

  Evidence: The `[^)]*` patterns stop at the first closing parenthesis rather than matching balanced Markdown. The actual H2 validator incorrectly emitted `h2_not_uppercase` for:

  - `[API](https://example.com/docs_(v2)-guide) OVERVIEW`
  - `API (legacy (v2) only)`
  - `API <https://example.com/docs>`

  The documented baseline cases—code spans, simple signatures, simple annotations, and ordinary inline links—passed.

  Fix: Replace these substitutions with a small balanced-delimiter scanner that removes code spans, parenthetical annotations, function calls, inline-link destinations, and URL autolinks without leaving destination fragments. Cover nested delimiters and autolinks with table-driven tests.

Verification: the exact `python3 -m py_compile` command reached bytecode emission but exited with `PermissionError` because this sandbox forbids writing the `.pyc`. Read-only `compile(...)`, module import, and execution all succeeded, confirming valid Python syntax.

Review status: REQUESTED_CHANGES
