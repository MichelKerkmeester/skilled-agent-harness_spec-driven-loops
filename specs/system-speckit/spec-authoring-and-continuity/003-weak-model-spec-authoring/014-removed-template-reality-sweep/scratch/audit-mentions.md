# Audit: mentions of the removed add-on templates

Read-only sweep after the deletion of `addons/before-after.md.tmpl`, `addons/roadmap.md.tmpl` and `addons/resource-map.md.tmpl`. Ground truth checked on disk: `templates/addons/` holds 7 files (acceptance-criteria, debug-delegation, decision-record, goal, handover, research, timeline); 4 core plus 7 add-ons plus 4 packet-types make 15 templates. `create.sh --with-lazy-addons` scaffolds `timeline.md` and `decision-record.md` (create.sh:281, :693).

Renderer check: `runtime/cli/resource-map/extract-from-evidence.cjs` reads no template file. Its ten categories are the hard-coded `CATEGORY_ORDER` array (line 22) and it stamps `SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1` itself (line 135). So "ten-category template skeleton" can be read as the renderer's own skeleton, but any phrase built on "the template" (definite article) or "template-shaped" now points at a file that no longer exists.

Test counts checked by running them: `template-fill-guidance.vitest.ts` prints `Tests  24 passed (24)` (16 level/doc pairs + 7 add-on checks + 1 negative case); `scaffold-golden-snapshots.vitest.ts` prints `Tests  12 passed (12)`.

Result: 19 stale hits (S), 3 adjacent hits (A, outside the three-template scope but wrong about the template set), the rest judged fine.

| # | file:line | current text (short) | stale? yes/no | why | proposed replacement text |
|---|---|---|---|---|---|
| 1 | .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:486 | "resource-map.md is the addon the spec-doc set does not hold and no template maps" | yes (S) | resource-map.md is no longer an add-on; it is a legacy packet-root file | `// resource-map.md is a legacy packet-root document that the spec-doc set does not hold and no template maps,` |
| 2 | .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:722 | "four core templates and the ten addon templates ... prints `16 passed`" | yes (S) | 7 add-ons now; test prints 24 passed | `Every content section of the four core templates and the seven add-on templates carries one <!-- FILL: ... --> line, and the fill guidance test prints 24 passed.` |
| 3 | .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md:18 | "four core templates and the ten addon templates" | yes (S) | 7 add-ons now | `The guidance covers every content section of the four core templates and the seven add-on templates.` |
| 4 | .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md:24 | "fill guidance test prints `16 passed`" | yes (S) | real run prints 24 passed | `...and the fill guidance test prints 24 passed without a snapshot update.` |
| 5 | .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md:30 | "The fill run prints `Tests  16 passed (16)`" | yes (S) | same | `The fill run prints Tests  24 passed (24).` |
| 6 | .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md:63 | `grep -E '^ *Tests +16 passed'` | yes (S) | grep would fail on the real output | `grep -E '^ *Tests +24 passed' "$OUT/fill.txt"` |
| 7 | .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md:76 | "the `Tests  16 passed (16)` line" | yes (S) | same | `...then the Tests  24 passed (24) line, then 0.` |
| 8 | .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md:86 | "the fill run prints `16 passed`" | yes (S) | same | `...the fill run prints 24 passed...` |
| 9 | .skilled/skills/system-spec-kit/templates/README.md:220 | "Expected: `Tests  12 passed (12)`, `Tests  16 passed (16)`" | yes (S) | same | `Expected: Tests  12 passed (12), Tests  24 passed (24) and EXAMPLE_DRIFT_OK.` |
| 10 | .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:686 | "the map preserves the template category structure" | yes (S) | "the template" now has no file behind it; categories come from the renderer | `...that the map keeps the renderer's ten-category structure...` |
| 11 | .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:688 | "category sections matching the template" | yes (S) | same | `...with the ten category sections the renderer emits;` |
| 12 | .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:15 | "the map preserves the template category structure" | yes (S) | same | `...that the map keeps the renderer's ten-category structure...` |
| 13 | .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:32 | "the shared extractor renders template categories with citation counts" | yes (S) | implies a template file supplies the categories | `...the shared extractor renders its ten built-in categories with citation counts...` |
| 14 | .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:15 | "the map preserves the template category structure" | yes (S) | same as 10 | `...that the map keeps the renderer's ten-category structure...` |
| 15 | .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:32 | "renders template categories with finding counts" | yes (S) | same as 13 | `...the shared extractor renders its ten built-in categories with finding counts...` |
| 16 | .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:48 | "per-file P0/P1/P2 counts in a template-shaped output" | yes (S) | "template-shaped" points at the deleted template | `...per-file P0/P1/P2 counts in the renderer's ten-category output...` |
| 17 | .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/resource-map-emission.md:19 | "into a template-shaped `resource-map.md`" | yes (S) | same | `...into a ten-category resource-map.md, grouped by category...` |
| 18 | .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/resource-map-emission.md:19 | "synthesis writes a template-shaped `resource-map.md`" | yes (S) | same | `...synthesis writes a ten-category resource-map.md grouped by category...` |
| 19 | .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:190 | "into a template-shaped `resource-map.md`" | yes (S) | same | `...into a ten-category resource-map.md, grouped by category...` |
| 20 | .skilled/skills/system-spec-kit/templates/README.md:141-144 | add-on rows list only acceptance-criteria, decision-record, handover, goal | yes (A) | key-files table omits debug-delegation, research and timeline of the 7 add-ons | add rows: `addons/debug-delegation.md.tmpl` (Renders the debug escalation record), `addons/research.md.tmpl` (Renders research/research.md), `addons/timeline.md.tmpl` (Renders the chronological event log) |
| 21 | .skilled/skills/system-spec-kit/references/structure/folder-structure.md:41-44 | packet-types tree shows only phase-parent.spec and review.spec | yes (A) | 4 packet-types ship; tree omits research.spec.md.tmpl and review-report.md.tmpl, so the 15-template picture is incomplete | add `│   ├── research.spec.md.tmpl` and `│   └── review-report.md.tmpl` under packet-types |
| 22 | .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md:62-64 | captured broken links `../templates/addons/checklist.md.tmpl` | yes (A) | template-mapping.md no longer links checklist.md.tmpl (rg finds none), so the recorded baseline of 6 broken links is out of date; not one of the three templates | rerun `check-markdown-links.cjs` and paste the current output and broken-link count |
| 23 | .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:58 | "the ten-category template skeleton" | no | reads as the renderer's own built-in skeleton (CATEGORY_ORDER); optional reword | optional: `the renderer's ten-category skeleton` |
| 24 | .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:59 | "the ten-category template skeleton" | no | same as 23 | optional: `the renderer's ten-category skeleton` |
| 25 | .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:91 | "Shared template renderer and research-shape adapter" | no | describes the script, which does render a fixed skeleton; no file implied | optional: `Shared resource-map renderer and research-shape adapter` |
| 26 | .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:92 | "Shared template renderer and review-shape adapter" | no | same as 25 | optional: `Shared resource-map renderer and review-shape adapter` |
| 27 | .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/resource-map-emission.md:37 | "renders the ten-category resource map" | no | loop output, accurate | none |
| 28 | .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/resource-map-emission.md:37 | "renders the ten-category resource map" | no | loop output, accurate | none |
| 29 | .skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs:135 | stamps `SPECKIT_TEMPLATE_SOURCE: resource-map \| v1.1` | no (note) | code output, not a comment; repo-era.vitest.ts:258 documents that every loop map now counts as legacy. Behavior change is out of this docs sweep | none in this sweep; candidate for a code follow-up |
| 30 | .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:258-259 | "No resource-map template ships ... counts every loop map as legacy" | no | already current | none |
| 31 | .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:86-87 | `'resource-map@v1.1': 'resource-map'` header aliases | no | recognizes stamps in existing packets and loop maps | none |
| 32 | .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:228 | "resource-map.md is here because older packet-root copies and the deep loops' own maps carry no continuity block" | no | already current | none |
| 33 | .skilled/skills/system-spec-kit/runtime/handlers/spec-doc-discovery.ts:143 | discovery list includes resource-map.md | no | existing packets keep the file; matches spec-doc-paths.ts:25 | none |
| 34 | .skilled/skills/system-spec-kit/runtime/README.md:154 | canonical discovery includes `resource-map.md` | no | same as 33 | none |
| 35 | .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:941 | "The template map also names the addon documents the spec-doc set never held" | no | generic, no deleted name | none |
| 36 | .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:467 | "The addon docs arrive in different states" | no | refers to acceptance-criteria/goal, which are add-ons | none |
| 37 | .skilled/skills/system-spec-kit/templates/packet-types/review-report.md.tmpl:19-20 | "added only when the packet carried a resource-map.md when the review began" | no | old packets keep the file; conditional is correct | none |
| 38 | .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap:3551-3552 | same text as 37 | no | snapshot of 37 | none |
| 39 | README.md:252, :258, :263, :287-289 | lazy add-on tree, "resource-map.md is not a packet add-on", "Fifteen templates", lazy add-ons section | no | already current | none |
| 40 | README.md:1326 | "14 templates are registered" | no | Code Mode manuals, unrelated | none |
| 41 | .skilled/skills/system-spec-kit/SKILL.md:65 and .hermes/skills/system-spec-kit/SKILL.md:70 | "it is not a packet add-on" | no | already current | none |
| 42 | .skilled/skills/system-spec-kit/templates/EXTENSION-GUIDE.md:45-52 | `--with-lazy-addons` scaffolds two of them | no | matches create.sh | none |
| 43 | .skilled/skills/system-spec-kit/templates/MIGRATION.md:37 | add-on docs when present: decision-record.md and timeline.md | no | matches the author-scaffolded set | none |
| 44 | .skilled/skills/system-spec-kit/references/templates/template-style-guide.md:42 | lazy add-ons list | no | matches spec-kit-docs.json lazyAddonDocs | none |
| 45 | .skilled/skills/system-spec-kit/references/templates/template-guide.md:187 | `--with-lazy-addons` scaffolds timeline.md and decision-record.md | no | matches create.sh | none |
| 46 | .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:281, :2259 | help text lists timeline.md, decision-record.md | no | current | none |
| 47 | .skilled/skills/system-spec-kit/templates/README.md:95-115 and references/structure/folder-structure.md:34-41 | addons tree lists the 7 files | no | current | none |
| 48 | .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md:32, :56 | "renders all 16 level and document pairs" / "Renders 16 documents" | no | still 16 pairs; the add-on checks are separate | none |
| 49 | .skilled/commands/speckit/assets/speckit-resume-auto.yaml:92, :110, :164 and speckit-resume-confirm.yaml:93, :114 | resume reads resource-map.md among canonical spec docs | no | read-if-present for older packets; matches SPEC_DOCUMENT_FILENAMES | none |
| 50 | .skilled/commands/speckit/assets/speckit-plan.yaml:770 | "docs/resource maps" in a scoring factor | no | generic phrase | none |
| 51 | .skilled/commands/deep/research.md:157, deep-research-presentation.txt:236, deep-review-presentation.txt:283, legacy/deep-research.body.markdown:112 | "optionally emits {artifact_dir}/resource-map.md" | no | loop output | none |
| 52 | .skilled/skills/system-deep-loop/deep-research/SKILL.md:295, :407; deep-review/SKILL.md:282, :296; deep-review/references/protocol/loop-protocol.md:135-341; deep-research/references/state/state-outputs.md:102-145; deep-review/references/state/state-format.md:131, :361; deep-research/references/state/state-format.md:53 | packet-root resource-map.md read at init, loop map emitted | no | loop output or legacy packet input | none |
| 53 | .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/resource-map-coverage-gate.md:3, :17, :25 and the matching playbook scenario | coverage gate on the spec folder's resource-map.md | no | conditional on an existing file; old packets keep it | none |
| 54 | .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook (resource-map-toggle, intra-routing-recall/resource-map.md) and all `RESOURCE_MAP` router keys across skills | smart-router intent keys and loop toggles | no | unrelated to spec-kit templates | none |
| 55 | .skilled/skills/system-spec-kit/references/workflows/rename-pattern.md:62, :137 | `scratch/resource-map.md` | no | ad-hoc scratch file, not a template | none |
| 56 | .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:62 and .skilled/commands/speckit/README.txt:317 | "Resource maps: a static generated path catalog" | no | generic, not a template claim | none |
| 57 | .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:2514-2521, :3132-3133, :2611 | historical spec paths with resource-map/roadmap in names | no | redirect history | none |
| 58 | .skilled/commands/create/assets/create-readme-{auto,confirm}.yaml:393/:387 | `before_after_patterns` | no | README template section, unrelated | none |
| 59 | .skilled/skills/sk-doc/sk-create-diff/** and /create:diff docs, agents markdown.md | "before/after document diff" | no | create-diff feature, unrelated | none |
| 60 | all other "roadmap" hits (ai-council agents and mirrors, feature-catalog authoring docs, mcp-obsidian/notion examples, sk-design diagram types, capability-flags.ts:53, workflow-invariance.vitest.ts:109-111, skill-graph-extraction-plan.md) | generic "roadmap" | no | none refers to a spec-kit template | none |
| 61 | .skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/*.md | "before-after", "resource-map.md" in captured spec text | no | frozen test fixtures copied from historical packets | none |

## Commands run

All from the worktree root. Shared exclusions, written once as `$EX`:

```
EX="-g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/dist/**' -g '!**/trigger-index.json' -g '!**/retrieval/fixtures/**' -g '!*.jsonl' -g '!.git/**' -g '!**/benchmark*/**' -g '!.worktrees/**' -g '!.skilled/skills/.state/**'"

rg -n -i --hidden $EX 'before-after|before_after|roadmap\.md|roadmap\.md\.tmpl|resource-map\.md\.tmpl|before-after\.md' .
rg -n -i --hidden $EX 'roadmap' .
rg -n -i --hidden $EX 'resource[- _]?map|resourceMap' .
  # then filtered: rg -v 'RESOURCE_MAP|RESOURCE MAP|ResourceMap|resource_map' | rg -i 'templat|add-?on|lazy|optional|level|spec[- ]kit|tmpl|skeleton|create\.sh|scaffold'
rg -n -i --hidden $EX '(\b(ten|eleven|twelve|nine|seven|eight|six|\d+)[- ](lazy[- ])?add-?ons?\b)|(\b(eighteen|seventeen|sixteen|fifteen|\d+) (spec[- ]kit |spec-doc |packet )?templates\b)|with-lazy-addons|lazyAddon|lazy[- ]add-?on' .
rg -n -i --hidden $EX '(add-?on|addon)s? (templates?|docs?|files?)|\b(ten|eleven|twelve|10|11|12|eighteen|18|seventeen|17|nineteen|19|twenty|20)\b[^.\n]{0,25}\b(templates|add-?ons|addons)\b|templates/addons' .
rg -n -i --hidden $EX 'before ?(/|&|and) ?after|before_after|beforeAfter' .skilled/skills/system-spec-kit .hermes/skills/system-spec-kit .skilled/commands .skilled/agents .claude .codex .pi .cursor .devin .hermes/prompts README.md .skilled/skills/system-deep-loop
rg -n -i 'templat|skeleton|spec[- ]kit (add-?on|template)|add-?on' <every deep-loop, deep command and agent file that mentions resource map>
rg -n -i 'timeline' .skilled/skills/system-spec-kit .hermes/skills/system-spec-kit .skilled/commands .skilled/agents .claude .codex .pi/agents .pi/prompts .cursor .devin .hermes/prompts README.md AGENTS.md
rg -n -i 'add-?ons?\b' .skilled/skills/system-spec-kit/{feature-catalog,manual-testing-playbook,references,assets,SKILL.md,README.md} .hermes/skills/system-spec-kit
rg -n -i --hidden -g 'README*' $EX '(lazy|spec|packet|template)[^.\n]{0,40}add-?ons?|add-?ons?[^.\n]{0,40}(template|packet|level)' .
rg -n 'four core templates|16 passed|16 documents|all 16' .skilled .hermes README.md -g '!**/changelog/**' -g '!**/node_modules/**'
rg -n -i 'templat|tmpl|addons|readFile|CATEGOR' .skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs
```

Test runs (from `.skilled/skills/system-spec-kit`):

```
npx vitest run --config vitest.config.ts runtime/cli/tests/template-fill-guidance.vitest.ts      # Tests  24 passed (24)
npx vitest run --config vitest.config.ts runtime/cli/tests/scaffold-golden-snapshots.vitest.ts  # Tests  12 passed (12)
```

Mirror coverage: `.opencode/{agents,commands,skills}`, `.claude/skills`, `.pi/skills`, `.devin/skills` and `.hermes/agents` are symlinks into `.skilled/`, so the `.skilled/` search covers them; the real directories `.claude/{agents,commands}`, `.codex/{agents,prompts}`, `.pi/{agents,prompts}`, `.cursor/{agents,commands}`, `.devin/agents`, `.hermes/{skills,prompts}` were searched directly.
