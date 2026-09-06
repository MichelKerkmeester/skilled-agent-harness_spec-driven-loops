# Iteration 7: README/index files listing files or sections that do not exist (F7)

## Focus

Hold focus F7: find index/README files that list files, directories, or sections that no longer exist. This pass validated the system-spec-kit README.md directory tree and a module-count table against the on-disk tree.

## Findings

### F7-01 — README.md directory tree lists two directories that do not exist (P1)

**Doc claim (quoted):** `README.md:413` — "`│   ├── memory/  # Continuity scripts`" (under `runtime/cli/`); `README.md:434` — "`├── constitutional/  # Always-surface rules (never decay)`" (at skill root).

**Actual behavior:** `runtime/cli/memory` does not exist; the continuity scripts live at `runtime/cli/continuity/` (after the scripts/ -> runtime/cli/ rename). `constitutional` does not exist at the skill root either; the constitutional rule tier is retired (`references/memory/memory-system.md:8` "CONSTITUTIONAL RULES (RETIRED)"). Both dirs verified missing on disk.

- Doc: [SOURCE: README.md:413]; [SOURCE: README.md:434]
- Actual: [SOURCE: runtime/cli/] (no `memory/`; continuity is `runtime/cli/continuity/`); [SOURCE: references/memory/memory-system.md:8]
- Severity: P1
- One-line fix: replace `runtime/cli/memory/` with `runtime/cli/continuity/`, and delete the `constitutional/` line (tier retired).

### F7-02 — README.md tree carries stale module/file counts (P2 cosmetic)

**Doc claim (quoted):** `README.md:415` — `core/ # Core library (17 modules)`; `:416` — `extractors/ # Session data extractors (12 extractors)`; `:417` — `utils/ # Utility modules (20 utilities)`; `:432` — `references/ # Reference documentation (27 files)`.

**Actual behavior:** `runtime/cli/core/*.ts` = 29 files, `runtime/cli/extractors/*.ts` = 13, `runtime/cli/utils/*.ts` = 19, and `references/**/*.md` = 41 `.md` files. The counts are stale against disk (module/utility counts can be defensible as "public API" counts, but the `references/` 27→41 is concrete).

- Doc: [SOURCE: README.md:415,416,417,432]
- Actual: [SOURCE: runtime/cli/core/, runtime/cli/extractors/, runtime/cli/utils/, references/]
- Severity: P2
- One-line fix: refresh the four counts (e.g. references/ has 41 `.md`, core/ 29 `.ts`), or drop the parentheticals.

## Sources Consulted

- README.md:409-435 (directory tree), :53,70-71,94,284-285,338-357,405-435,612-614
- ARCHITECTURE.md:28,57,112
- runtime/cli/ (dir listing; no memory/), runtime/cli/continuity/
- references/memory/memory-system.md:8
- feature-catalog/feature-catalog.md; manual-testing-playbook/manual-testing-playbook.md (markdown-link checker: clean)
- runtime/README.md (no memory/database/vector claims)

## Assessment

- newInfoRatio: 0.9
- Novelty justification: F7-01/F7-02 are new README-tree phantom-entry findings; the markdown-link checker across the top index docs was clean (no broken relative `.md` links), so the phantom content is structural (dirs/counts) rather than broken links.
- Confidence notes: Both findings confirmed by direct filesystem listing. The markdown-link checker is a small bespoke script and only covers `.md` targets — kept scoped.

## Reflection

- What worked: verifying a tree diagram against the on-disk tree is unambiguous and read-only; no link-resolver needed.
- What failed: the top index `.md` link graphs (feature-catalog.md, manual-testing-playbook.md, README.md, ARCHITECTURE.md, SKILL.md) had zero broken relative links, so F7 yields are structural phantom entries rather than link rot.
- Ruled out: the module-count parentheticals could be intentionally "public API" counts rather than raw file counts, so F7-02 is flagged P2 with that caveat rather than P1.

## Recommended Next Focus

[Broaden] Begin the widen pass (iterations 8-10): rotate across the remaining under-audited reference groups — `references/templates/**`, `references/structure/**`, `references/workflows/**`, `references/debugging/**` — and reconcile the F2-adjacent retired-capability framing in those groups against the runtime (also de-dup any earlier near-miss findings).
