---
title: "Iteration 1: Command assets versus the scripts they invoke"
trigger_phrases: []
---
# Iteration 1: Command assets versus the scripts they invoke

## Focus

Read the four named command assets under `.opencode/commands/speckit/` (complete.md, validate.md, resume.md, save.md) and, for each script they invoke, the script's argument parser only. A flag the asset names that the script does not parse, an exit code the asset describes that the script does not return, or an output the asset promises that the script does not print, is a finding.

## Actions Taken

1. Census read (one call): `research/confirmed-findings.md` — round-one 54 rows (remediated 007/008) and round-two 21 rows (remediated 014) reviewed; no row touched by this angle was re-reported.
2. Read all four assets. `validate.md` **does not exist**: `.opencode/commands/speckit/` holds `README.txt`, `assets/`, `complete.md`, `implement.md`, `plan.md`, `resume.md`, `save.md`, `search.md` (verified by `ls`; also a `find .opencode/commands -iname '*validat*'` returns only `doctor/scripts/route-validate.*` and `commands/scripts/validate-command-references.cjs`). `rg "speckit:validate|commands/speckit/validate.md"` over `.opencode` returns zero hits; the command-group README.txt command table (plan, implement, deep-research, deep-review, resume, plan --intake-only, complete, search, save) and structure diagram also list no validate command.
3. Script claims in the three existing assets: `complete.md` names only YAML/presentation assets (lines 21-25) — no scripts. `resume.md` names only YAML/presentation assets (lines 21-25) — no scripts. `save.md` names exactly two scripts: `generate-context.js` (lines 19, 68) and `generate-trigger-index.mjs` (lines 20, 69).
4. Read `generate-context.ts` (checked-in source of the writer; 1,014 lines) parser block: HELP_TEXT options are `--help/-h`, `--stdin`, `--json <string>`, `--session-id <uuid>`, `--planner-mode <mode>`, `--full-auto`, plus positional `<input>` file mode with optional `[spec-folder]` (lines 70-102). Entry: `import { runWorkflow, releaseFilesystemLock } from '../core/workflow.js'` (line 29), so the writer routes through `core/workflow.ts`.
5. Read `core/workflow.ts` around the post-save review claim: lines 1646-1651 (`shouldRunExplicitSaveFollowUps = true` with the comment explaining graph-metadata refresh and the review now run unconditionally) and lines 1740-1754 (Step 11.75: `reviewPostSaveQuality` / `printPostSaveReview` from `./post-save-review.js`; `post-save-review.ts` exists in `core/`).
6. Read `generate-trigger-index.mjs` usage header (line 27): `[--repo-root <path>] [--allow-malformed] [--json] [--quiet]` and an alternate `--out/--manifest/--diagnostics` mode; no-arg invocation is valid.
7. Route-category check: `save.md:47-48` lists eight route categories. Grep of the runtime for the category vocabulary: the only runtime consumer of `routeCategory` is `lib/validation/spec-doc-structure.ts:156-169` (`ROUTE_CATEGORY_ALIASES`) fed by the cross-anchor contamination rule (`validateCrossAnchorContamination`, lines 1128-1172; option parsed at line 1318). `narrative_delivery` appears nowhere in runtime source; `handover_state` appears nowhere outside a vitest; `decision` (bare) and `research_finding` (singular) are not in the alias map (it maps `decisions`/`decision_log` → `decision_log`, `research`/`research_findings` → `research_findings`). `save-presentation.txt:26` renders `Route <route_category>` so the category is display-consumed, but the saved vocabulary does not match the canonical set.

## Findings

| # | Severity | Claim side | Actual side | Verdict |
|---|----------|-----------|-------------|---------|
| F1 | P2 | `commands/speckit/save.md:47-48` — route category enum: `narrative_progress, narrative_delivery, decision, handover_state, research_finding, task_update, metadata_only, drop` | `runtime/lib/validation/spec-doc-structure.ts:156-169` — the only runtime routeCategory vocabulary maps what_built/how_delivered/narrative_progress→narrative_progress, decisions/decision_log→decision_log, research/research_findings→research_findings, metadata/metadata_only→metadata_only, drop; unlisted values pass through raw (line 1139). `narrative_delivery` and `handover_state` do not exist in any runtime source file; bare `decision` and singular `research_finding` are likewise not aliases (4 of 8 names diverge) | Taxonomy drift, display-only today, but a payload authored to save.md's list would silently pass through the contamination rule unaliased. Recommend: align the eight to the canonical six, or mark the block presentation-only and use the canonical names |
| F2 | P2 | `runtime/cli/core/workflow.ts:1740` — comment "Step 11.75: Post-save quality review — wire into production pipeline" | The code directly below (1742-1754) already runs `reviewPostSaveQuality`/`printPostSaveReview` unconditionally (`shouldRunExplicitSaveFollowUps = true`, lines 1646-1651): the wiring the comment announces is done | Stale comment contradicts the executed state. Recommend: fix the comment wording |
| F3 | note | Audit premise: `validate.md` is a command asset to audit | No such file exists: directory listing (README.txt, assets/, complete.md, implement.md, plan.md, resume.md, save.md, search.md), zero `speckit:validate` references, README.txt command table omits it; validation surface is script-level (`validate.sh` via workflow YAMLs and CI) | Premise correction, not a repo defect. Recommend: treat validation as script-level; drop the asset premise for future passes |

## Verified Correct (no finding)

- `save.md:19,68` writer invocation shape is real: `--full-auto`/`--planner-mode`/`--json`/`--stdin`/positional JSON file are all parsed (generate-context.ts:70-102).
- `save.md:21,61` post-save quality review promise is implemented: writer → `runWorkflow` (generate-context.ts:29) → core/workflow.ts:1740-1754 → `core/post-save-review.ts` (`reviewPostSaveQuality`, `printPostSaveReview`); non-blocking failure path matches the asset's "when practical" hedge.
- `save.md:69-70` trigger-index regeneration invocation is valid: `generate-trigger-index.mjs` usage (line 27) has all-optional flags in the primary mode; bare invocation per README.txt.

## Questions Answered

- Does the writer parse every flag save.md names? Yes for --full-auto/--json; no flag in the asset is unparsed.
- Does any asset promise an exit code? No — none of the three assets describes script exit codes. Nothing to contradict.

## Open Questions

1. Who owns the route-category vocabulary if a future save payload's `routeCategory` ever feeds `validateCrossAnchorContamination` — the command asset or the validator? Today the mismatch is display-only (save-presentation.txt:26 renders the category; no code path feeds it to the validator).
2. Was the audit's `validate.md` premise sourced from an upstream/community command this tree intentionally omitted? No in-tree evidence of intent either way.

## Ruled Out

- `dist/continuity/generate-context.js` staleness as a finding: the asset names the dist path, which is the documented canonical invocation; dist content is excluded by the invocation contract.
- complete.md / resume.md: they name no scripts, so no parser mismatch can exist at the .md level; their script invocations live in the YAML assets, out of this angle's stated scope (deferred to the synthesis's open questions).
