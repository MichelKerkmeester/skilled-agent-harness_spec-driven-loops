# Iteration A2 - EARS plus Constraint Template Diffs and the Cross-Artifact Gate (mimo, adherence)

## TITLE

Cohort A2 adherence and logic. Model mimo-v2.5-pro. Angle turns the wave-1 EARS and constraint findings into exact template diffs across all spec template levels and designs the cross-artifact consistency gate that catches orphaned requirements and phantom tasks.

## FINDINGS

The templates ship prose requirement tables with zero EARS guidance and no constraint tier block. All four spec template levels share one requirements format that tells the author to fill a free-prose Requirement column (`spec.md.tmpl:96-105`). EARS prescribes five sentence patterns that make requirements machine-parseable, and no template file mentions them. Osmani prescribes an always, ask-first, never constraint system, and no template file contains the concept. So today the templates produce requirements like system should handle errors rather than a state-driven SHALL clause.

The checklist has no requirement traceability. The checklist template carries generic items but none trace to a specific requirement id from the spec (`checklist.md.tmpl:58-61`). One item asserts spec, plan, and tasks are synchronized but gives no mechanism to verify it. The checklist cannot catch a requirement present in the spec but absent from tasks, nor a task present in tasks but absent from the spec.

The cross-artifact gap is real in code. The structural validator runs five rules and none parse requirement ids from the spec and cross-reference them against tasks or checklist (`spec-doc-structure.ts:11-16`). There is no rule that extracts requirement ids, extracts task ids, and checks that every requirement has at least one task and every task maps to at least one requirement.

The zod schema is present but unwired here too. The graph schema is imported by the context generator but the shell shape rule does its own ad-hoc Node validation, so wiring the zod schema in would catch field and type violations the hand-rolled check misses. That is a separate lower-risk change from the EARS and constraint work and can ship independently.

## CONCRETE CHANGE

Five changes. First, an EARS hint comment immediately before the requirements heading in all four template levels, listing the five patterns and recommending one pattern per row. The existing table format stays unchanged, the hint only shapes how the Requirement column is filled. Second, a new constraints section after success criteria with an always, ask-first, never table, full three tiers for level 2 and up and a minimal two-row always-plus-never table for level 1 to keep it lean. Third, a requirement-coverage table near the top of the level-2 checklist that maps each requirement to its task ids and a checklist item, with orphaned requirements and phantom tasks called out as blockers. Fourth, a soft EARS linter rule at info severity that flags requirement rows not starting with one of the EARS keywords, registered as an authored-template check, non-blocking. Fifth, a cross-artifact consistency rule in the structural validator that parses requirement ids from the spec table and task ids from tasks, checks two-way coverage, and verifies the constraints section carries at least one always row and one never row when present, at warn for missing coverage and info for orphaned tasks.

## EVIDENCE

- Templates use prose requirement tables with no EARS: `spec.md.tmpl:96-105`.
- Checklist has no requirement traceability: `checklist.md.tmpl:58-61`.
- validate.sh checks only legacy_grandfathered: `validate.sh:177-180`.
- Graph zod schema exists but is unwired into the validator: `graph-metadata-schema.ts:61`, imported by the context generator at write only.
- No cross-artifact rule exists in the structural validator: `spec-doc-structure.ts:11-16`.
- EARS five patterns and the spec-kit proposal: `stage-0-external-findings.md:20`. Osmani three-tier constraints: `:23`. Adherence ceiling: `:25`.

## READER

Adherence for the EARS hint, the traceability table, and the EARS linter, since all three shape how the author writes at write time and are read directly not retrieved. Adherence plus logic for the constraint tiers, which give explicit constraint categories in the spec itself. Logic for the cross-artifact gate, which verifies no orphaned requirements and no phantom tasks by reading the spec and tasks directly. All five bypass the 028 truncation floor because none is a retrieval result.

## ON-WRITE OR RETROACTIVE

On-write is preferred for all five. The three template diffs take effect when new docs are authored or when existing docs are next updated. The two validation rules run on every validate.sh invocation against existing folders. Retroactive is possible without rewriting existing docs. The EARS linter can flag existing non-EARS requirements at info immediately, and the cross-artifact gate can run against any existing folder that already has both a spec and a tasks file, because the new checks are additive.

## RISK

EARS reduces ambiguity but no format guarantees agent adherence, so the linter sits at info as a quality lever not a gate. The cross-artifact regex is brittle if authors use a non-standard id format, mitigated by the template enforcing the canonical id format and the gate firing only on files that exist. The constraints section adds roughly ten lines per level, meaningful for the lean level 1, mitigated by the two-row level-1 variant. No measured improvement yet. This iteration produces the diffs and gate design but does not prove EARS-shaped requirements improve adherence, which needs an A/B authoring comparison and stays a hypothesis.
