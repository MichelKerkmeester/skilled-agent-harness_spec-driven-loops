VERDICT: PASS

All findings in `scratch/findings.md` are applied, and every LOST line in the mechanical evidence is accounted for:

- The README ten-step paragraph is now an ordered list with the same sentences. The two trigger corrections (`benchmark/README.md` → `mcp-server/benchmarks/README.md` and the SKILL.md keyword → `benchmarks/README.md`) are the findings' prescribed current-state fixes.
- The `ROUTER.md` `### Family Boundary` block moved before `### Smart Router Pseudocode`, matching the section lead-in and the sibling routers. No H2 was renumbered or moved.
- The index-template EXECUTION paragraph became a lead paragraph plus three bullets; runner ownership, result schema, evidence location, and the citation rule all survive verbatim in meaning.
- Guide step 6 is repaired with `conformance families` from the scenario template, and the `### When to Use` block was added; the link labels gained the missing `../` while every target stayed unchanged.
- `references/shared/README.md`, `case-studies.md`, `pitfalls.md`, and `worked-example.md` labels were corrected and `### When to Use` blocks added. The "now lives" → "lived" tense fix is the finding's prescribed stale-status correction.
- No intro after an H1 was rewritten; no code block, block count, frontmatter value, or citation changed.

The one deviation is justified: the README `allow-ref` entry was retargeted rather than deleted. `check_readme_references.py` matches allow-ref tokens exactly (`allowed.get(reference.raw)`), so deletion leaves `mcp-server/benchmarks/README.md` unresolved and fails the check. The retarget keeps the retired `benchmark/README.md` token out and the checker passes.

Verification from the final state: all 13 scope files return `valid True`, 0 issues, 0 render warnings; `check_readme_references.py` reports `PASS ... unresolved=0 allowed=11`; `validate_skill_package.py` reports PASS; `scope-gate.py` reports `files=13 render_warnings=0 invalid=0`; `git diff --check` is clean. Inbound anchors hold: `ROUTER.md` section 3 and `behavior-benchmark-guide.md` section 2 remain at their cited numbers, and every cited H2 keeps its number and order.
