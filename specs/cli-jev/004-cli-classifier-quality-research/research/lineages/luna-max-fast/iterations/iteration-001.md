# Iteration 1: Documentation compliance and inventory

## Focus

Audit the cli-classifier hub and cli-jev documentation against the applicable sk-doc structures, with attention to READMEs, catalogs, playbooks, changelogs, benchmarks, and measurement notes.

## Actions Taken

- Read the sk-doc hub, quality-control workflow, core standards, code-folder README template, and README/catalog/playbook workflow contracts.
- Enumerated 79 Markdown files under `.skilled/skills/cli-classifier/` and reviewed the hub/child skill and router documents, key catalog and playbook entrypoints, benchmark README surfaces, and shared-tier READMEs.
- Compared `.skilled/skills/cli-classifier/shared/README.md` with the actual direct-child inventory and the code-folder README template.
- Did not run repository validators or tests; this was a static, read-only audit.

## Findings

### LUNA-F001 — Shared-tier README omits the required directory overview

- **Severity:** P2
- **Axis:** 1 — sk-doc compliance
- **Evidence:** The code-folder README template requires a directory tree whenever the target folder has any immediate subdirectories (`.skilled/skills/sk-doc/sk-create-readme/assets/readme-code-template.md:52`). The shared-tier README has only a short overview and no tree or contents section (`.skilled/skills/cli-classifier/shared/README.md:1-9`); a direct inventory shows `shared/scripts/` is an immediate child and contains the shipped modules and test folders.
- **How confirmed:** Compared the template condition with the README lines and `find` output for `shared/`.
- **Impact:** A maintainer entering the shared tier is not shown its only child folder or the reusable helper files.

### LUNA-F002 — Shared-tier README describes an obsolete empty state

- **Severity:** P2
- **Axis:** 5 — documentation accuracy
- **Evidence:** `.skilled/skills/cli-classifier/shared/README.md:8-9` says the hub currently ships no shared helpers and speaks of shared helpers as future additions. The current directory contains `shared/scripts/jev-transport.mjs` and `shared/scripts/scorer-report.mjs`; the scripts README describes both at `.skilled/skills/cli-classifier/shared/scripts/README.md:16-20` and inventories them at lines 28-30.
- **How confirmed:** Cross-checked the claim against the direct file inventory and the scripts README contents table.
- **Impact:** The shared-tier entrypoint gives maintainers a false account of the code currently shipped under it.

## Questions Answered

- The shared-tier README does not accurately describe the current shared helper inventory.
- The shared-tier README has one confirmed code-folder structural omission under the cited sk-doc template.
- The reviewed samples use the expected technical, numbered-section structure; this sample does not establish compliance for all 79 Markdown files.

## Questions Remaining

- Full document-by-document sk-doc compliance, including the generated or historical benchmark reports and every playbook leaf.
- Script and test quality under sk-code-opencode.
- Advisor routing, leaf manifests, graph metadata, and prompt-to-hub reachability.
- External-install and benchmark-operator UX, and visibility of with-and-without measurements.
- Cross-surface accuracy and drift beyond the shared-tier README.

## Assessment

- **New-information ratio:** 0.30 (telemetry only; below the required early-stop relevance).
- **Novelty:** The README inventory/structure mismatch was directly confirmed in this lineage and is distinct from later code, advisor, UX, and broad drift checks.
- **Negative knowledge:** No validator result is claimed. The inspection found no basis to declare the complete 79-file documentation set compliant or noncompliant beyond the two cited shared-tier issues.

## Reflection

The visible code-folder README is a high-signal entrypoint because its claim can be checked directly against the directory and the specialized template. The rest of the documentation set needs wider, type-aware checks before any global compliance conclusion.

## Dead Ends

- Generic sk-doc references are not under a top-level `sk-doc/references/` directory; the relevant contracts are packet-local references under `sk-create-readme`, `sk-create-feature-catalog`, `sk-create-manual-testing-playbook`, and shared references. No source conclusion depended on the failed path lookup.

## Next Focus

Inspect the shared transport and scorer-report implementations, tests, benchmark scripts, and every live caller for code-contract and correctness risks without executing them.

## Sources

- `.skilled/skills/sk-doc/sk-create-readme/assets/readme-code-template.md:41-58` — code-folder README content model and mandatory directory-tree condition.
- `.skilled/skills/cli-classifier/shared/README.md:1-9` — shared-tier README.
- `.skilled/skills/cli-classifier/shared/scripts/README.md:14-30` — current shared-script responsibilities and inventory.
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` — file exists in the direct inventory.
- `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs` — file exists in the direct inventory.
