# Iteration 1: Level contract for goal.md

## Focus

How `goal.md` should enter the Level contract in `templates/spec-kit-docs.json`: `optionalAddonDocs` vs `lazyAddonDocs`, which levels, phase-parent vs child semantics, and what a `goal.md.tmpl` should contain at each level.

## Actions Taken

1. Read `spec-kit-docs.json` Level rows 1, 2, 3, 3+, `phase`, and `review` for the three addon lists.
2. Read `EXTENSION-GUIDE.md` classification rules and `level-contract-resolver.vitest.ts` frozen expectations.
3. Read `spec-doc-structure.ts` `collectDocuments` vs `orchestrator.ts` `validationDocsForLevel` to see which list actually validates a new basename.
4. Read `template-structure.js` `DOC_TEMPLATE_NAMES` and `resolveTemplatePath`, plus phase-parent lean-trio policy in `phase-definitions.md` and `phase-parent.spec.md.tmpl`.
5. Compared `acceptance-criteria.md.tmpl` (optional addon + closure gate) with `handover.md.tmpl` (lazy, command-owned).

## Findings

### F1. Three lists, three absences — goal.md fits none today

`spec-kit-docs.json` has no `goal.md` document entry, no `goal.md.tmpl` version, and no Level-row mention. Templates on disk are `core/`, `addons/` (checklist, acceptance-criteria, handover, debug-delegation, research, before-after, timeline, roadmap, decision-record, resource-map), and `packet-types/` (phase-parent spec, review spec, context-index). There is no `goal.md.tmpl`. [SOURCE: file:.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:61-163] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:94-108]

### F2. `optionalAddonDocs` is the rollout-aware QA/closure bucket, not a generic "nice to have"

EXTENSION-GUIDE: `optionalAddonDocs` is for documents a level recognises without the file-presence rule hard-erroring; presence is owned by a rollout-aware rule because file-presence has no packet-age notion. The live members are only `checklist.md` and `acceptance-criteria.md` at Levels 2, 3, and 3+. Level 1, phase-parent, and review keep `optionalAddonDocs: []`. Tests freeze that split. [SOURCE: file:.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md:34-39] [SOURCE: file:.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:180-189] [SOURCE: file:.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:537-540] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:29-35]

`acceptance-criteria.md.tmpl` is gated `<!-- IF level:2,3,3+ -->` and states it decides whether the packet may close. [SOURCE: file:.opencode/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:1-36]

**Decision:** do not put `goal.md` in `optionalAddonDocs`. A nested goal is an operator/runtime directive, not a QA closure artefact. Mixing it with AC/checklist would invite a second closure-shaped rule and would fight the frozen tests.

### F3. `lazyAddonDocs` is the command-owned / explicit-option bucket — and it is the one `collectDocuments` actually walks

EXTENSION-GUIDE: `lazyAddonDocs` is for command-owned or explicit-option files. Live members at Levels 1–3+ are handover, debug-delegation, `research/research.md`, before-after, timeline, roadmap, decision-record. Phase-parent and review drop debug-delegation and `research/research.md`. [SOURCE: file:.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md:39] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:17-25] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:52-64]

`collectDocuments` builds its set from required core/addon, lifecycle-after-implementation, **lazyAddonDocs**, plus hardcoded `resource-map.md` / `context-index.md`. It does **not** spread `optionalAddonDocs`. Checklist and acceptance-criteria are added only via `existsSync` special cases. A new basename in `optionalAddonDocs` would be invisible to spec-doc-structure unless that hardcoded pair is extended. [SOURCE: file:.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts:204-220]

`validationDocsForLevel` does include present optional+lazy files (minus `FREEFORM_WORKFLOW_DOCS` = review-report and research.md). Header/template checks can see a present optional addon; spec-doc-structure cannot unless special-cased. [SOURCE: file:.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts:493-506] [SOURCE: file:.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts:187]

**Decision:** put `goal.md` on `lazyAddonDocs` at the levels that should recognise it. That is the only list that both (a) matches command-owned semantics and (b) is collected for structure validation when the file exists, without a new hardcoded exists-check.

### F4. Do not put `goal.md` in required lists

`requiredCoreDocs` / `requiredAddonDocs` feed `docsForLevel` and therefore file-presence hard-errors. Adding `goal.md` there would fail every existing packet that lacks it. `requiredAddonDocs` is empty at every live level. [SOURCE: file:.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts:464-467] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:15-16]

### F5. Levels: all implementation levels plus phase-parent; not review

| Level | Recommendation | Why |
|-------|----------------|-----|
| 1 | `lazyAddonDocs` | Same lazy list as 2/3/3+ today; a small packet can still set a goal. Absence stays silent. |
| 2, 3, 3+ | `lazyAddonDocs` | Keep the current identical lazy list; add `goal.md` once across all four. |
| phase (parent) | `lazyAddonDocs` | Nested-goal *is* the phase-parent use case: one small parent pointer, children hold overflow. Lean trio stays (`spec.md` only required). Parent `goal.md` is opt-in, not a fourth required file. |
| review | omit | Review packets are records (`spec.md` + `review/review-report.md`). A session goal does not belong on a review record. |

Phase-parent policy forbids heavy docs at the parent: plan, tasks, checklist, decision-record, implementation-summary live in children. A thin parent `goal.md` does not violate that if it stays a pointer + self-contained stop criteria, not a log. [SOURCE: file:.opencode/skills/system-spec-kit/references/structure/phase-definitions.md:97-99] [SOURCE: file:.opencode/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:30-71]

Child packets are ordinary Level-N folders. They inherit the Level-N lazy list; no separate "child" Level row exists. `template-structure.js` adds a `child` addendum when the parent's `spec.md` has a `phase-map` anchor — that is section-addendum detection, not a fourth document list. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:400-406]

### F6. Scaffold will not emit `goal.md` until `DOC_TEMPLATE_NAMES` and the documents map grow

`resolveTemplatePath` returns null unless the basename is on the Level contract lists **and** `DOC_TEMPLATE_NAMES` (or the phase/review spec special-case). Adding only the Level-row string is not enough. Required companion edits: `documents.goal.md` (template, owner, creationTrigger, absenceBehavior), `versions["goal.md.tmpl"]`, `DOC_TEMPLATE_NAMES['goal.md']`, `templates/addons/goal.md.tmpl`, and `sectionGates['goal.md']` per level. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:409-434] [SOURCE: file:.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md:20-42]

Recommended manifest fields:

- `owner`: `author` (operator-maintained file) with `creationTrigger`: `explicit-option` (not scaffold-by-default). Matches handover's explicit-option / silent-skip pattern more than AC's scaffold-at-L2.
- `absenceBehavior`: `silent-skip` — packets without a goal must not warn.
- Do **not** add `goal.md` to `FREEFORM_WORKFLOW_DOCS`. If a size-cap or child-ref validator is wanted, the file must remain structurally gated.

Handover's template IF-gate is `level:1,2,3,3+,phase` and omits review — the same level set recommended here. [SOURCE: file:.opencode/skills/system-spec-kit/templates/addons/handover.md.tmpl:1]

### F7. What `goal.md.tmpl` should contain (shape, not prose)

Shared skeleton (all implementation levels + phase-parent):

1. Frontmatter + `SPECKIT_TEMPLATE_SOURCE: goal | v2.2`
2. Durable directive (frozen-capable): one-sentence objective, in-scope outcome, **self-contained completion criteria** that a Stop-hook evaluator can check without reading children
3. Binding block: relative paths to child `goal.md` files (phase-parent / phased children only); empty or omitted on a standalone Level-N packet
4. Precedence rule (verbatim, not implied): parent decisions win; child files supply procedure and local detail only
5. Volatile log (optional, clearly marked): session notes that must not be copied into the runtime goal string

Phase-parent variant: IF `level:phase` — Binding block required; durable section capped; forbid restating child plans (same CONTENT DISCIPLINE spirit as phase-parent spec). Child variant: IF not phase — Binding block optional; durable section is the phase-local directive; must not contradict parent criteria.

Level 1 standalone: skip Binding; keep Durable + Precedence ("this file is the whole goal").

Exact size cap and wording are Q4/Q6; this iteration only locks the contract bucket and the section set.

## Questions Answered

- Q1 (contract bucket, levels, parent vs child, template skeleton): answered. Remaining: exact validator for child-path existence and parent size cap (Q4/Q6).

## Questions Remaining

- Q2 runtime goal systems
- Q3 speckit `goal_prompting` runtime-neutrality
- Q4 binding wording / precedence / path validation
- Q5 AC closure gate vs stop-evaluator
- Q6 durable vs log split and parent size cap (packet 033)

## Dead Ends

- **requiredAddonDocs / requiredCoreDocs for goal.md:** would fail every current packet. Ruled out. Evidence: `docsForLevel` = core + required addons only; tests show requiredAddonDocs empty.
- **optionalAddonDocs for goal.md:** wrong semantic (QA/closure), and `collectDocuments` would miss the new basename without a hardcoded exists-check. Ruled out as the primary bucket.
- **A distinct Level row for "child":** no such row exists; children are Level-N packets. Ruled out.

## Assessment

- newInfoRatio: 1.0
- noveltyJustification: First pass; Level contract, collectors, and template map were unread in this lineage.
- confidence: high on bucket and levels; medium on exact template IF-gates until Q4/Q6 size/wording is grounded.

## Reflection

Reading the two collectors (`collectDocuments` vs `validationDocsForLevel`) mattered more than reading the JSON lists. The lists look symmetric; the collectors are not. Optional addons are a special case of two filenames, not a generic extension point.

## Recommended Next Focus

Q2: Claude Code native Stop-hook goal vs `.opencode/plugins/opencode-goal.js` / `goal-core.cjs` 4000-char cap, and the cli-claude-code playbook's "no Claude adapter" claim.

## SCOPE VIOLATIONS

None. No writes outside this lineage directory.
