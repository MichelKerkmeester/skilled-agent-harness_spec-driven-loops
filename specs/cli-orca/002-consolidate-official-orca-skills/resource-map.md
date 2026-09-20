---
title: "Resource Map: cli-orca Review Audit Surfaces"
description: "Lean path catalog of the surfaces the cli-orca deep review declares in scope: the skill package, its advisor identity and routing metadata, the mcp-tooling hub boundary, the authoring contracts it conforms to, and the review's own required artifacts."
trigger_phrases:
  - "cli-orca audit surfaces"
  - "orca review resource map"
  - "cli-orca path catalog"
importance_tier: "normal"
contextType: "general"
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 54 rows (glob rows each cover one uniform set)
- **By category**: READMEs=2, Skills=32, Specs=10, Scripts=9, Tests=1
- **Missing on disk**: 0
- **Scope**: Declared audit surfaces for the cli-orca deep review, written before review init so the coverage gate arms. One packet-level map for a root target, aggregating the skill package, the surfaces it integrates with, the contract validators it answers to, and the artifacts the review itself must produce.
- **Generated**: 2026-09-20T16:30:56+02:00 (re-derived after the remediation pass)

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.skilled/skills/cli-orca/README.md` | Analyzed | OK | Package inventory, routing summary, and the local gate list it claims |
| `.skilled/skills/mcp-tooling/README.md` | Cited | OK | Hub context for the mode boundary this skill joins |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `runtime/cli/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.skilled/skills/cli-orca/SKILL.md` | Analyzed | OK | Routing contract: lane table, phase workflow, rules, escalation taxonomy |
| `.skilled/skills/cli-orca/graph-metadata.json` | Analyzed | OK | Advisor identity: category, family, domains, edges, intent signals |
| `.skilled/skills/cli-orca/leaf-manifest.json` | Analyzed | OK | Declared leaves the metadata gate derives its projection from |
| `.skilled/skills/cli-orca/leaf-manifest.config.json` | Analyzed | OK | Leaf roots that drive manifest and alias derivation |
| `.skilled/skills/cli-orca/leaf-aliases.json` | Analyzed | OK | Derived alias projection the metadata gate emits |
| `.skilled/skills/cli-orca/references/orca-cli-reference.md` | Analyzed | OK | CLI surface reference named by the SKILL.md reference table |
| `.skilled/skills/cli-orca/references/session-and-runtime.md` | Analyzed | OK | Session, runtime and version-matching reference |
| `.skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md` | Analyzed | OK | Mutation and browser ownership boundary reference |
| `.skilled/skills/cli-orca/references/troubleshooting.md` | Analyzed | OK | Failure-mode and recovery reference |
| `.skilled/skills/cli-orca/references/orca-skills/**` | Analyzed | OK | Official-skills layer: overview plus one reference per official skill (9 files) |
| `.skilled/skills/cli-orca/assets/*.txt` | Analyzed | OK | Eight byte-for-byte upstream snapshots the version check compares |
| `.skilled/skills/cli-orca/assets/PROVENANCE.md` | Analyzed | OK | Snapshot source, per-skill revisions and digests, refresh procedure |
| `.skilled/skills/cli-orca/feature-catalog/**` | Analyzed | OK | Feature inventory plus its four per-feature documents: official-skill layer, routing vocabulary, runtime preflight, safety bounds (5 files) |
| `.skilled/skills/cli-orca/manual-testing-playbook/**` | Analyzed | OK | Safety matrix, routing fixtures and negative holdouts plus the eight scenario contracts (9 files) |
| `.skilled/skills/cli-orca/changelog/v0.1.0.0.md` | Analyzed | OK | Extraction release note; claims no gate result of its own |
| `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--playbook-post-remediation/**` | Created | OK | Playbook verdicts, transcripts, exit status and per-scenario reasons |
| `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/**` | Analyzed | OK | Captured routing evidence: report plus replay JSON |
| `.skilled/skills/mcp-tooling/SKILL.md` | Analyzed | OK | Hub skill surface whose aligned mode set the parent check proves |
| `.skilled/skills/mcp-tooling/hub-router.json` | Analyzed | OK | Compiled-route manifest that must stay fresh for the hub to serve compiled |
| `.skilled/skills/mcp-tooling/ROUTER.md` | Analyzed | OK | Authored routing copy that must agree with the manifest |
| `.skilled/skills/mcp-tooling/mode-registry.json` | Analyzed | OK | Registry the hub's modes are declared in |
| `.skilled/skills/mcp-tooling/graph-metadata.json` | Analyzed | OK | Hub advisor identity read at routing stage one |
| `.skilled/skills/mcp-tooling/leaf-manifest.json` | Analyzed | OK | Hub leaf declarations |
| `.skilled/skills/system-skill-advisor/graph-metadata.json` | Analyzed | OK | Advisor identity read before any recommendation is scored |
| `.skilled/skills/system-skill-advisor/runtime/config/route-exclusions.json` | Analyzed | OK | Route exclusions the Orca probes and holdouts must respect |
| `.skilled/skills/system-skill-advisor/runtime/lib/routing/route-exclusions.ts` | Analyzed | OK | Lexical-lane and exclusion logic behind the long-prompt recall hole |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts` | Analyzed | OK | Ingest handler that seeds the index from skill metadata |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Analyzed | OK | Recommend handler exercised by the positive and holdout replays |
| `.skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json` | Analyzed | OK | Prompt policy behind long mixed-prompt handling |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Cited | OK | Metadata contract this package answers to |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md` | Cited | OK | Packaging and validation contract |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md` | Cited | OK | Advisor index handoff contract |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `specs/**` — spec folders, phase children, packet docs, research, review, scratch. **Takes precedence over `Config`** for spec-folder JSON metadata (`description.json`, `graph-metadata.json`).

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/cli-orca/002-consolidate-official-orca-skills/spec.md` | Updated | OK | Requirements and the coverage promise the review measures against |
| `specs/cli-orca/002-consolidate-official-orca-skills/tasks.md` | Updated | OK | Task ledger including the review-cycle rows |
| `specs/cli-orca/002-consolidate-official-orca-skills/acceptance-criteria.md` | Updated | OK | Acceptance rows the findings must eventually satisfy |
| `specs/cli-orca/002-consolidate-official-orca-skills/decision-record.md` | Updated | OK | Decision record carrying the redaction and review-cycle decisions |
| `specs/cli-orca/002-consolidate-official-orca-skills/implementation-summary.md` | Updated | OK | Close-out narrative amended by remediation |
| `specs/cli-orca/002-consolidate-official-orca-skills/graph-metadata.json` | Updated | OK | Derived packet metadata regenerated alongside the documents |
| `specs/cli-orca/002-consolidate-official-orca-skills/scratch/**` | Updated | OK | Gate suite and captured gate evidence, excluded from spec validation |
| `specs/cli-orca/002-consolidate-official-orca-skills/review/review-report.md` | Created | OK | Compiled by the loop: nine core sections plus the coverage gate |
| `specs/cli-orca/002-consolidate-official-orca-skills/review/synthesis-remediation-plan.md` | Created | OK | Fresh-context synthesis fix list with file:line citations |
| `specs/cli-orca/002-consolidate-official-orca-skills/review/resource-map.md` | Created | PLANNED | Reducer-generated evidence index, distinct from this packet-level catalog; not emitted by design, because the loop ran without `--emit-resource-map`, so no file is expected here |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Validated | OK | Root metadata gate: class-S conformance and generated-freshness |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Validated | OK | Per-document template and prose conformance |
| `.skilled/skills/sk-doc/scripts/validate_skill_package.py` | Validated | OK | Package shape and required documents |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | Validated | OK | Catalog package contract |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Validated | OK | Playbook package contract |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Validated | OK | Hub parent check proving the aligned mode set |
| `.skilled/bin/skill-advisor.cjs` | Analyzed | OK | Advisor CLI: rebuild, recommend, status, validate |
| `.skilled/bin/compiled-route-status.cjs` | Analyzed | OK | Compiled-route freshness reporter behind the hub gate |
| `.skilled/bin/compiled-route-sync.cjs` | Analyzed | OK | Manifest resync tool named in the packet's open follow-up |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

> Test files, fixtures, snapshots. Group unit, integration, and vitest/pytest paths here.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py` | Validated | OK | README manifest test proving the published inventory |
<!-- /ANCHOR:tests -->
