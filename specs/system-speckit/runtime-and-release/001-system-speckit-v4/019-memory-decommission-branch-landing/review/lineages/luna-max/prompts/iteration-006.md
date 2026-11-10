---
title: "Deep Review Iteration 6 Prompt"
loop_type: review
iteration: 6
---

# Iteration 6 review prompt

Review the preserved System Skill Advisor, shared embedder, IPC, launcher, and trust-boundary surfaces. Read the scoped sources before making any finding. Recheck the remote model-server perimeter and advisor child-process isolation, then follow the opt-in doc-frontmatter harvest from parser to documented consumer behavior. Treat malformed configuration and parser-boundary inputs as adversarial cases, while distinguishing harmless duplication or documentation-only drift from actionable defects.

Required evidence:

- Use only the bounded paths in `scratch/review-scope.txt` as review targets.
- Cite exact source paths and line numbers for every finding.
- Distinguish confirmed source behavior from inferred boundary cases and state what would confirm an inference.
- Check P0, P1, and P2 severity; do not duplicate F001-F007 unless new evidence changes their disposition.
- Do not run tests, validators, generators, graph writes, continuity writers, or repository writes. Keep all output under the bound lineage directory.

Review verdict must be the final line of the iteration narrative and must be `PASS`, `CONDITIONAL`, or `FAIL`.
