# Iteration 002 — sk-doc compliance sweep of every hub and packet doc

- **Focus:** Axis 1. Validate every markdown doc under the hub with the repo's own validator; check frontmatter, naming, structure and changelog/playbook/catalog conventions against sk-doc rules.
- **Read first:** no `steer.md` exists in this lineage (checked at iteration start, absent).
- **Method:** ran `validate_document.py` over every `*.md` under `.skilled/skills/cli-classifier/` (auto-detected type first, then explicit `--type` for every non-clean file), and compared each failure class against sibling skills to separate hub defects from repo-wide patterns.

## Findings

### F-003 — Five packet docs miss the required Overview section (axis 1, P1)

The validator fails five files with a blocking `missing_required_section: overview` error:

| File | Validator verdict |
|---|---|
| `cli-jev/references/cli-reference.md` | INVALID, 1 blocking error |
| `cli-jev/references/integration-patterns.md` | INVALID, 1 blocking error |
| `cli-jev/references/mcp-server.md` | INVALID, 1 blocking error |
| `cli-jev/references/providers-and-models.md` | INVALID, 1 blocking error |
| `cli-jev/assets/question-shaping-card.md` | INVALID, 1 blocking error |

The sk-doc reference template makes `## 1. OVERVIEW` the first numbered section and lists "Overview and 'When to Use' sections" as required content (`sk-create-skill/assets/skill/skill-reference-template.md:49,79`). The hub's `cli-reference.md` instead opens at `## 1. INVOCATION` (`cli-jev/references/cli-reference.md:25`).

This is hub-specific, not a repo-wide convention: four sibling references sampled from `system-deep-loop`, `system-spec-kit`, `sk-doc` and `cli-orca` all pass with 0 issues, and the sampled `cli-orca` reference carries `## 1. OVERVIEW` as its first section (`cli-orca/references/orca-cli-reference.md:21`). Two sibling assets (`sk-prompt/assets/*`) also pass under `--type asset`.

- **Confirmed by:** the repo's own validator run per file with explicit types; sibling-skill comparison runs.
- **Impact:** five shipped docs fail the repo's blocking doc validation; the authoring commands (`/create` family, e.g. `create-skill-confirm.yaml`) treat `validate_document.py` as their gate, so these files would be rejected by the flow that owns them. `parent-skill-check.cjs` does not cover reference/asset structure, which is why the gap shipped.

### F-004 — The transport-integration measurement doc claims a route record that one caller does not write (axis 5, P2; extends F-002)

`feature-catalog/measurements/pi-transport-integration.md:90-91` says: "Six callers route their calls through the transport. The five scorers record the answering route as `transport` in their call records:" followed by five bullets covering six files. The SOURCE FILES table then claims per file that `score-clarify-default.cjs` "Routes its choice calls and its auth test through the transport and **records the answering route as `transport`**" (`:117`).

The code disagrees for exactly that file: it writes `backend: 'jev'` as a literal in all three record sites and never writes `transport` (`sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1271`, `:1315`, `:1368`), while the other five callers do record it (F-002 table in iteration 1). The same sentence appears in `feature-catalog.md:63`.

- **Confirmed by:** per-file grep and record-block reads across all six callers (iteration 1), now matched line-by-line against the measurement doc's table.
- **Impact:** a reader auditing provenance (which backend answered a recorded run) is told this caller records the route when it does not; a Pi-answered run of that scorer is stored as `backend: 'jev'`.

## Checked and cleared (with evidence)

- **Everything else passes.** Every remaining markdown doc under the hub — root SKILL.md, README.md, ROUTER.md (as readme-fallback), all 13 changelog entries, hub and packet feature-catalogs (explicit `--type feature_catalog`: 0 issues), hub and packet manual-testing-playbook indexes (explicit `--type playbook`: 0 issues), all 22 packet playbook scenarios, the 3 hub and 3 packet measurement docs, the benchmark READMEs and the shared READMEs — validates clean with 0 issues.
- **ROUTER.md / catalog / playbook "1 issue" lines in the auto-detect sweep are fallback warnings only** (`document_type_fallback`), not defects; explicit types resolve them to VALID.
- **`skill-benchmark-report.md` files failing the README-fallback check is repo-wide** — `sk-prompt/benchmark/reports/**/skill-benchmark-report.md` files fail identically (missing overview under README fallback, same warning). Benchmark reports have no doc-type rule anywhere; not a hub defect.
- **Frontmatter completeness:** hub SKILL.md/README.md/ROUTER.md and packet SKILL.md/README.md all carry the fields their templates require; `parent-skill-check` rule 13a validates routing-artifact versions and passes.

## Ruled-out directions

- Reporting benchmark-report validation failures as a hub defect — sibling skills fail identically; the doc type is ungoverned repo-wide.
- Reporting the auto-detect fallback warnings on ROUTER.md/catalogs/playbooks — resolved by explicit types.

## Key-question progress

- Q1 (axes 1+5): axis 1 sweep complete (F-003); axis 5 accuracy pass continued (F-004).
- Q2 (axes 2+6), Q3, Q4: next.
- Q5: metadata/mirror checks continue in iterations 4-5.

## Next focus

Iteration 3 — sk-code-opencode compliance and bugs across the hub's scripts and tests: `shared/scripts/*.mjs`, `benchmark/*.mjs`, the shared tests, and the six live callers; syntax checks, error-path reads, and test-quality review.
