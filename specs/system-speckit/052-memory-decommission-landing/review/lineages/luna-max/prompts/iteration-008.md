---
title: "Deep Review Iteration 8 Prompt"
loop_type: review
iteration: 8
---

# Iteration 8 review prompt

Audit command, doctor, hook, plugin-catalog, and registration surfaces for decommission residue and successor routing. Read the exact bounded scope entries, trace the surviving `/memory:save`, `/memory:search`, `/doctor memory`, and `/speckit:resume` paths, and compare the authoritative current hook/plugin inventories with configuration and test documentation. Distinguish intentional negative-control references used by residue scanners and tests from stale operator-facing contracts. Recheck F001-F009 without duplicating them.

Required evidence:

- Use only the bounded paths in `scratch/review-scope.txt` as review targets.
- Cite exact source paths and line numbers for every finding.
- Separate live registration, intentional historical/negative-control evidence, and stale documentation.
- Check P0, P1, and P2 severity; a documentation-only residue without a live registration path is at most P2 unless it changes enforcement behavior.
- Do not run tests, validators, generators, graph writes, continuity writers, or repository writes. Keep all output under the bound lineage directory.
- Convergence is telemetry only; continue the max-iterations loop.

Review verdict must be the final line of the iteration narrative and must be `PASS`, `CONDITIONAL`, or `FAIL`.
