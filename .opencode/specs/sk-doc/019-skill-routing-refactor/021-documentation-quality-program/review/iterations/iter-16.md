# Iteration 16: spec folder — phases 009-010 + context-index

> dimension: spec-conformance | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P0] Phase 009’s “exempt-preserving” transform corrupts an inline code token**

  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/009-titlecase-config-and-closeout/implementation-summary.md:52`  
  `.opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md:36`

  Evidence: The summary claims code spans were preserved. The base-to-HEAD diff instead changes ``opencode `--file` `` to `opencode \0 0\0`, leaving literal NUL bytes (`00 30 00`) in the heading. `git diff --text` confirms this corruption was introduced by commit `a09f3f050e7`.

  Fix: Restore `` `--file` ``, remove the NUL bytes, and harden the transform so protected spans use collision-safe reversible placeholders. Re-scan every transformed heading before retaining the exempt-preservation completion claim.

- **[P1] Phase 009’s 270-header/58-file completion count does not match the committed diff**

  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/context-index.md:15`

  Evidence: Phase 009 repeatedly claims 270 headers across 58 files. For implementation commit `a09f3f050e7`, `git diff-tree` lists 57 changed Markdown files. Its textual diff contains 251 changed H2s across 56 files; forcing the NUL-containing benchmark file through `--text` adds four H2s, producing 255 changed headers across 57 files—not 270/58.

  Fix: Recompute the authoritative count from the commit diff and replace 270/58 throughout phase 009’s `spec.md`, `checklist.md`, `implementation-summary.md`, and the parent `context-index.md`.

- **[P1] Phase 010 combines incompatible populations in its HVR scale evidence**

  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/010-deferred-code-and-checker-fixes/implementation-summary.md:65`

  Evidence: The docs claim roughly 167,000 em dashes “across 4,601 files.” The 4,601 figure is reproduced by Markdown files containing em dashes under skills and commands. Counting occurrences across that same Markdown population yields 79,101. The approximately 168,000 result—167,964—appears only when the Markdown filter is removed and JSON/benchmark data and other file types are included.

  Fix: Use one population consistently. For the documentation HVR scope, record “4,601 Markdown files containing 79,101 occurrences,” and update `spec.md`, `checklist.md`, `implementation-summary.md`, and `context-index.md`.

- **[P1] Phase 010 reverses the fixed versus not-fixed follow-up count**

  `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/010-deferred-code-and-checker-fixes/implementation-summary.md:53`

  Evidence: This line says five follow-ups were resolved “three by fixing, two” by not editing. The phase specification at line 51 defines two fix items and three investigation items, while the same summary at lines 65 and 74 explicitly enumerates three not-fixed findings: `RIG_ROOT`, `dispatch-swe16`, and the HVR sweep.

  Fix: Change the accounting to “two by fixing, three by evidence-based non-action,” treating the two checker-surfaced data corrections as part of the 10a fix rather than additional deferred follow-ups.
