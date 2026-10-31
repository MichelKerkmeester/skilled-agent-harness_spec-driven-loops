# Iteration 2: Rule-to-producer map for the failure taxonomy

## Focus

Read the validator registry and the implementations of the top failing rules to map each failure family to the component that produces the value being checked. This is the Q2 entry pass: causes get attributed to producers (templates, generators, archive operations), not to rule names.

## Actions Taken

- Read `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` (42 rules with severity, category, script path).
- Read `rules/check-metadata-disk-consistency.sh` and its helper (path drift check).
- Read `rules/check-files.sh`, `rules/check-template-source.sh`, `rules/check-grep-convention.sh`, `rules/check-frontmatter.sh` headers and logic.
- Read the level contract `templates/spec-kit-docs.json` (document and template-version manifest).
- Located the native rule implementations: `runtime/lib/validation/orchestrator.ts` (ANCHORS_VALID, SPEC_DOC_SUFFICIENCY family) and `validation/generated-metadata-*.ts`.

## Findings

1. The registry defines 42 rules split across three implementation families: shell rules under `runtime/cli/rules/`, TypeScript rules (`ts:spec-doc-structure`, the `validation/*.ts` files), and native orchestrator rules (`native:orchestrator`, `runtime/lib/validation/orchestrator.ts`). Categories separate authored-document rules (`authored_template`) from generated-metadata (`structural`) and save/continuity (`operational_runtime`) rules. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1] CONFIRMED
2. METADATA_DISK_PATH_CONSISTENCY's helper compares three recorded values against the folder's real path under `/specs/`: `description.json` `specFolder`, `graph-metadata.json` `spec_folder`, and the frontmatter `packet_pointer` found in implementation-summary.md/handover.md/spec.md/plan.md/tasks.md/decision-record.md. The check is enforcing by default with a `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE=false` opt-out. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency.sh:9] CONFIRMED
3. FILE_EXISTS derives its required-document set from the level contract `templates/spec-kit-docs.json` through `utils/template-structure.js`; phase parents require a lean trio (spec.md, description.json, graph-metadata.json), and lifecycle documents gate on implementation actually starting (a checked `- [x]` item in tasks.md). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-files.sh:8] CONFIRMED
4. TEMPLATE_SOURCE checks the `SPECKIT_TEMPLATE_SOURCE` marker only on the documents the level contract names, and skips absent files; the contract manifest carries a version per template (for example spec.md.tmpl v2.2), which is the identifiable handle for stale-template detection. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:35] [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:4] CONFIRMED
5. GREP_CONVENTION is a Node-helper classifier (frontmatter presence, trigger-phrase quality, anchor grammar, basename naming); its own header states that ANCHORS_VALID in the orchestrator owns pairing and order while bash owns grammar. The two rules therefore split one document defect across two reporters, which is why anchor defects appear under both rule names in the reports. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention.sh:8] CONFIRMED
6. FRONTMATTER_VALID checks authored top-level fields and consults `lib/frontmatter-grandfather-allowlist.json`: an explicit grandfathering path for documents written before the current frontmatter contract. Any heal tool must extend or respect that allowlist rather than "fixing" grandfathered docs into a different shape. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter.sh:20] CONFIRMED
7. The path-drift family has a clear producer shape: the recorded path values are written by the generators at creation time and are not proven to be re-derived by move/archive operations. The check side exists; whether `archive.sh` re-derives (or calls `repair-derived.cjs`) after moving a folder is the open producer question for iteration 3. [INFERENCE: based on check-metadata-disk-consistency-helper.cjs reading recorded values and the reported 2,898 baseline occurrences concentrated in `z_archive/` paths] 

## Ruled Out

- Treating the rules themselves as the defect source: every rule reads a contract (level manifest, template headers, generated metadata) rather than inventing constraints, so the fix belongs in the producer, not in relaxing the rule.
- Unifying GREP_CONVENTION and ANCHORS_VALID anchor checks during this research: they intentionally split grammar (bash helper) from pairing/order (orchestrator). The split is a design choice; merging them is not justified by evidence gathered so far.

## Dead Ends

- Searching for ANCHORS_VALID in `validate.sh` directly: the pair/order logic is in the TypeScript orchestrator, and the shell file only dispatches rules. Future anchor work must cite `runtime/lib/validation/orchestrator.ts`, not the shell entrypoint.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the GREP_CONVENTION header and the registry agree on the grammar/pairing split.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-files.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter.sh`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`

## Assessment

- New information ratio: 0.75 (4 of 7 findings fully new to this lineage; 3 build on the iteration-1 taxonomy and count as partially new)
- Questions addressed: Q2 at implementation depth, Q1 at producer depth
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-003 | Make every folder move/archive re-derive recorded paths as a post-step (call the canonical generator after the move) so path drift cannot be reintroduced by the very operation that creates it | Q2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` (post-move step) | S | Low if it calls the read-move-repair order; Med if it rewrites metadata before confirming the move succeeded | `archive.sh`, possibly a shared helper | Baseline 2,898 path-drift occurrences, near zero after the phase 013 repair; the check exists but the producer step is unproven | INFERRED; confirm by reading `archive.sh` for a repair/re-derive call after its move | Yes when the generator is deterministic | Reverting the archiving commit | No; metadata paths only |
| R-004 | Detect stale template versions from the level manifest's per-template version map plus each document's `SPECKIT_TEMPLATE_SOURCE` header, and report them as a heal candidate class | Q3 | `.skilled/skills/system-spec-kit/runtime/cli/spec/` (a census/heal report mode) | S | Low, read-only report first | New script only | `spec-kit-docs.json` carries template versions; `check-template-source.sh` already reads the marker | CONFIRMED manifest and marker, INFERRED that old versions can be classified from the pair | Yes (report only) | Delete the script | No |

## Reflection

- What worked and why: reading the registry first turned 19 rule names into three implementation families in one pass; the helper file then gave an exact definition of "path drift" including which three recorded fields count.
- What did not work and why: searching for ANCHORS_VALID in shell files wasted a call because the rule is TypeScript-native; the registry's `script_path` column is the routing key and should be read before searching.
- What I would do differently: go straight from registry `script_path` to implementation for each rule family, and only then look for producers.

## Recommended Next Focus

Iteration 3: read the producers named so far (`create.sh`, `archive.sh`, `repair-derived.cjs`, the template files) to confirm or refute the producer hypotheses for the top failure classes, starting with whether `archive.sh` re-derives recorded paths after moving a packet.
