# Scope analysis: the goal chat-send rule and nesting dedupe

Read-only analysis run on 2026-09-26 for phase 012. Every size below comes from `goal-slice.cjs` and was recounted by an independent Python pass. The commands are in section 2.1. Findings are marked OBSERVED (run and read), DERIVED (follows from something observed) or INFERRED (not confirmed, with the check that would confirm it).

The operator's two asks, verbatim:

1. "Make clear that a parent goal sent to the user in chat should never contain: Front matter, Dividers, Anchors, unneeded bloat that could make the parent goal not fit in the max 4000 char limit"
2. "Also make sure that the system-speckit command and skill goal logic (regarding nesting in phases) actively references the new .skilled/skills/sk-doc/sk-create-goal skill instead of having seperate duplicate logic"

Two terms used throughout:

- **Template instruction prose** is fixed template text addressed to the file's author: how to size, fill, resend or cut the file. It does not tell the agent doing the work what to do or what done means.
- **Directive text** is everything the executing agent and the evaluator need: the title, the objective, the decisions line and table, the criteria and the binding table with its Read, Precedence and Stop rules.

---

## 1. SUMMARY

**(a) Canonical home for the chat-send rule.** `sk-create-goal/references/budget-and-handoff.md` section 4, retitled "What a parent goal sent in chat contains". The mode already prints `chat_slice` there, and ask 2 points system-spec-kit toward sk-create-goal. The canonical text covers what the chat slice removes, what it keeps, which text the limit measures, the `packet_budget=ok` precondition and legacy goals. `AGENTS.md` keeps three short sentences of the rule and ends with a pointer. It keeps them because it loads on every turn and overrides the old resend wording inside 227 legacy goal files. Everything else becomes a one-line pointer. That covers system-spec-kit `SKILL.md:485`, playbook section 5, three speckit `resend.payload` values and two resume reminders. The goal hooks reminder string stays one runtime line, reworded to key the send on `packet_budget=ok`. The template's "Operator copy" paragraph is deleted outright.

**(b) The bloat fix.** Remove the instruction prose from `goal.md.tmpl` at the source: the blockquote (lines 34 to 42), the "Operator copy" subsection (59 to 70) and the criteria introduction (99 to 101). Carry the same removal into the three asset templates, and add one pointer comment, `<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->`, after `HVR_REFERENCE`. It costs 72 durable characters and nothing in chat. Keep the decisions line and the three binding paragraphs, because they are directive. Do not move prose into HTML comments, because the budget counts comments, so the prose would still use the 4,000. Do not teach `renderChatSlice` to drop paragraphs. It cannot help the limit, which is measured before the projection. The legacy wording also has at least eight variants, and `specs/sk-design/018-sk-design-parent-v2/goal.md:57-61` keeps authored directive text under an "Operator copy" heading, which a paragraph filter would silently delete. Measured under this recommendation:

| Goal | Durable before | Durable after | Chat before | Chat after |
|---|---|---|---|---|
| Unfilled phase-parent asset template | 3,156 | 1,623 | 2,823 | 1,218 |
| `goal.md.tmpl` rendered at `phase` | 2,843 | 1,310 | 2,510 | 905 |
| 060 parent today (no 012 row) | 3,950 | | 3,617 | |
| 060 parent with the 012 row only | 3,995 | | 3,662 | |
| 060 parent with the 012 row and the new fixed text | | 2,943 | | 2,538 |

The objective slice does not change (906 for 060 before and after), because `buildObjectiveSlice` reads only the binding anchor's presence and the criteria bullets (`goal-slice.cjs:107-119`). The resend hash changes only for files that are edited, so the 302 untouched goal files raise no resend reminder.

**(c) Which text the 4,000 limit governs.** The durable slice, comments and anchors included, which is what the validator, the manifest, `check-goal.cjs` and `goal.cjs packet` already measure. The chat slice is produced from the durable slice by deletion only (`goal-slice.cjs:73-80`), so a parent within the limit can never send more than 4,000 characters. DERIVED. The wording that ends the disagreement, for section 4 and in short form everywhere else:

> The 4,000-character limit is measured on the durable slice, with comments and anchors counted. `validate.sh`, `check-goal.cjs` and `goal.cjs packet` all measure that text. The chat slice only removes text from the durable slice, so a parent at `packet_budget=ok` never sends more than 4,000 characters. When the report shows `over`, cut the file in the section 3 order and measure again. Never truncate the chat slice to fit.

**(d) Duplicates and gaps.** The cut order becomes canonical in `budget-and-handoff.md` section 3, with a new first real cut for legacy instruction prose. The playbook, `validation-rules.md`, the speckit YAMLs, `SKILL.md:485`, the sk-create-goal README and both `/create:goal` workflows point there. The precedence and child-amendment rules become canonical in `parent-and-nested-goals.md` section 6. The speckit YAMLs and the playbook point there, and the parent goal's own binding section still states Precedence as directive. The playbook keeps what only system-spec-kit owns: the set-string shape (the objective slice), why criteria are copied, when to resend and the file-versus-session distinction. The HOOKS keywords at `SKILL.md:160` drop "packet goal", "goal.md" and "nested goal", which sk-doc's `GOAL_AUTHORING` intent already owns (`sk-doc/ROUTER.md:172`). The phase entry points gain a `/create:goal` pointer: speckit `:with-phases`, speckit Option D, `phase-definitions.md` Option D, `phase-system.md` and the `create.sh` next steps. The full table is section 3.1.

**(e) Factual divergences.**
- `create.sh --phase --with-goal` writes child goals only. Fix the text, not the scaffolder: help at `create.sh:283-284` and `:293-294`, the next steps at `:1649-1652` and `:1884-1885`, `README.md:232`, playbook section 6 and `template-guide.md:187`. Route parent goals to `/create:goal <parent> phase-parent`. Adding parent-goal scaffolding to `create.sh` would grow nesting logic inside system-spec-kit, the opposite of ask 2.
- Two retrofit paths: keep one, `/create:goal <packet> retrofit`, which copies the parity-checked asset template. Delete the inline-renderer recipe from playbook section 6 and `validation-rules.md:722`. Add `/create:goal` to the template-backed routes in `SKILL.md:61`, which today forbids the asset-copy path.
- The circular cut-order ownership: `budget-and-handoff.md` section 3 holds the text and drops its playbook citation at `:39`. Playbook section 4 becomes a pointer.
- The stale 3,735 at `budget-and-handoff.md:78`: delete the live figure, because a live file's count belongs in its own log. State the new fixed-text cost of the three unfilled templates instead.

---

## 2. EVIDENCE

### 2.1 Commands run (all read-only)

| Command | Result |
|---|---|
| `node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-doc/060-create-goal-mode --workspace "$PWD"` | exit 0, `packet_durable_chars=3950`, `packet_budget=ok`, `packet_nested=true` |
| Two session-scratchpad scripts over the `goal-slice.cjs` exports, not kept in the repository. V7 in section 5 reproduces the template figure | the before and after table in section 1 (b) |
| Independent Python recount of durable and chat | 060 now 3,950 / 3,617, 060 after 2,943 / 2,538, template at `phase` after 1,310 / 905: identical |
| `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-doc/060-create-goal-mode` | exit 1, `RESULT: FAILED (3/4 checks)`, the one finding is `no binding-table target row for 012-goal-send-and-dedupe/goal.md` |
| `check-goal.cjs --all` | exit 2 from one pre-existing read error under a review lineage. 304 goals, 30 phase parents, `parent-budget_findings=4` (sk-code/007 4,734, sk-design/018 5,013, sk-design/019 5,513, sk-git/028 5,758) |
| `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` | `pass 15`, `fail 0` (baseline) |
| `node --test .skilled/hooks/goal/lib/goal-slice.test.cjs` | `pass 21`, `fail 0` (baseline) |
| `recommend-level.sh --loc 350 --files 34 --json` | exit 0, `recommended_level: 2`, `recommended_phases: false`. The inputs are my estimates |
| Legacy census over active `goal.md` files | 227 carry `### Operator copy`, 159 carry the criteria introduction and 70 the current blockquote wording. Of about 39 budget-applicable parents, 16 carry an Operator copy section with at least 8 distinct openings |

### 2.2 Citations re-opened

| Citation | What it actually says | Verdict |
|---|---|---|
| `goal-slice.cjs:59-63`, `:73-80` | `extractDurableSlice` cuts at the log anchor. `renderChatSlice` removes HTML comments, `\n---\n`, heading numbers and blank runs, then trims. Every step deletes or shortens | Survey correct. Chat never exceeds durable (DERIVED) |
| `goal-slice.cjs:187-193` | The hash covers the durable slice minus comments, whitespace collapsed | Correct |
| `goal-slice.cjs:207-212` | The reminder says "Never send more than 4000 characters: when the slice is longer, cut the file first." | Correct. "The slice" is ambiguous between chat and durable |
| `goal-slice.cjs:413-428` | `durableChars` and `budgetState` use the durable slice, and `chatSlice` has no cap | Correct |
| `goal-core.cjs:507-510` | Injection renders from `packet.objectiveSlice` | Correct. `SKILL.md:485` and `hook-system.md:99` wrongly say the durable slice is injected |
| `.opencode/plugins/opencode-goal.js:22` | `require('../hooks/goal/lib/goal-slice.cjs')`, and `.opencode/hooks` symlinks to `.skilled/hooks` | A projection change would reach every runtime |
| `spec-kit-docs.json:24-28` | `goalDurableBudget.measure`: "characters after the frontmatter closing fence up to the log anchor, anchors and comments included", `errorChars: 4000` | Correct |
| `spec-doc-structure.ts:1030-1042`, `:1050-1062` | Same boundary as the runtime, error past `errorChars`, phase children skipped | Correct |
| `spec-doc-structure.ts:1172-1178` | Any empty anchor is an error | The directive and completion anchors stay non-empty after the cut |
| `template-structure.js:421-436`, `:530-536` | The structure contract is H2 headings plus anchors | "### Operator copy" is H3, so dropping it changes no contract, and legacy files still conform |
| `template-parity.test.cjs:30-83` | Compares non-empty, non-placeholder lines of each asset block to `goal.md.tmpl` resolved at level `2` or `phase` | Comment lines count as fixed. The new pointer must appear in all three assets |
| `check-goal.cjs:36-43`, `:264-286` | Placeholder lists come from `goal.md.tmpl` wording plus each asset's objective, decision and criterion lines | Placeholders do not change, so no checker change |
| `scaffold-golden-snapshots.vitest.ts.snap:247-292` | Holds the rendered blockquote, "Frozen choices", "### Operator copy" and the criteria introduction | Must be regenerated. The survey missed it |
| `goal-slice.test.cjs:198-203` | Asserts the reminder includes `4000 characters` | Must keep that substring. No adapter test pins more of the text |
| `AGENTS.md:185-187` | Defines the chat slice, "Never send a parent goal over 4,000 characters: cut the file first", "Mechanics are `system-spec-kit`'s." | Correct. It never names sk-create-goal |
| `system-spec-kit/SKILL.md:61` | Goal docs MUST use contract-backed templates "through `create.sh` or the inline renderer" | Conflicts with `parent-and-nested-goals.md:26`, which copies the asset block. The survey called it class (a) |
| `system-spec-kit/SKILL.md:160`, `:237-240` | HOOKS keywords include "packet goal", "goal.md" and "nested goal". Its resources are `hook-system.md` and the playbook | Correct. The router refuses resources outside the skill (`SKILL.md:316-322`), so a pointer must live in an in-skill doc |
| `system-spec-kit/SKILL.md:485` | Chat-slice definition plus "cut the file in the order the goal set-string playbook gives" | Correct |
| Playbook `:61-71`, `:80-99`, `:103-115` | Cut order, chat slice with "over 4,000" applied to the chat slice at `:91`, "The template carries this rule in its directive section" at `:98-99` and the renderer recipe | Correct. `:98-99` becomes false after the template change |
| `validation-rules.md:683`, `:722` | Section 12, and the fix line cites the playbook order and the renderer | Correct |
| `create.sh:444-464`, `:1108-1111`, `:1280`, `:1493`, `:1665`, `:1715` | `scaffold_contract_docs` adds `goal.md` under `--with-goal`. Phase mode gives the parent a lean spec, gives children the contract docs and exits at `:1665` before the level copy at `:1715` | Divergence 1 confirmed by reading (DERIVED, not run) |
| `create.sh:98-101` plus the manifest `phase` level | `--level phase-parent` sets `DOC_LEVEL=phase`, and the `phase` level lists `goal.md` as a lazy add-on with a `binding` gate | Only this path writes a parent goal (DERIVED) |
| Speckit YAMLs | `packet_goal` passages at plan `:186-199`, implement `:151-164`, complete `:244-257`. `:with-phases` P3 at plan `:79` and complete `:145` passes no `--with-goal`. Option D note at plan `:133` and complete `:191`. Resume `:47` in both | Correct. Offsets +58 and -35 hold |
| `create-goal-auto.yaml:216`, `:329`, `create-goal-confirm.yaml:233`, `:345` | "Cut in the playbook order" | The survey missed these |
| `budget-and-handoff.md:39`, `:53`, `:78` | Defers to the playbook for the cut order. The chat description omits frontmatter and any cap. States "3,735" | Correct. Today's count is 3,950 |
| `goal-phase-parent-template.md:175` (top-level `:154`, child `:155`) | "The blockquote, the operator-copy paragraph and the criteria and log introductions ... stay word for word" | Correct. These rows must change |
| `specs/sk-design/018-sk-design-parent-v2/goal.md:57-61` | Authored summary text under `### Operator copy` | Evidence against a heading-based strip |
| `git log --diff-filter=A` on `060/goal.md` | Added 2026-09-26. The "167 older goal files" figure is from 038/013, dated 2026-09-16 | 060's parent is not one of the 167 |

Not re-checked, and out of scope here: `.cursor/commands/goal-cursor.md:17,31`, `.skilled/commands/goal-opencode.md:44`, `.pi/prompts/goal-pi.md`, `goal-plugin.md:33`.

### 2.3 Where the surveys were wrong or incomplete

1. `survey-duplicates.md` section 2 says `budget-and-handoff.md:39`, sk-create-goal `SKILL.md:156` and `parent-and-nested-goals.md:133` all cite the playbook for the cut order. Only `:39` does. `:156` and `:133` cite it for the budget and handoff. The other cut-order citations are sk-create-goal `README.md:98` and the four `/create:goal` YAML lines, which the survey missed.
2. `survey-duplicates.md` classes `SKILL.md:61` as mechanics to keep. It is part of divergence 2, because it rules out the asset-copy retrofit path.
3. `survey-chat-slice.md` section 3 counts "Frozen choices", "Read the child goal", "Precedence" and "Stop" as instruction prose (1,524 characters in total). Those lines instruct the executing agent, and the objective slice repeats the binding and precedence sentence (`goal-slice.cjs:111`). I keep them as directive. The removable prose in 060's chat slice is 1,124 characters (3,662 to 2,538 with the 012 row).
4. Both surveys missed four things that must move with the change: the golden snapshot, the `4000 characters` test assertion, the generated Hermes mirror of sk-create-goal (`.hermes/skills/sk-create-goal/SKILL.md`) and the trigger index. The index corpus hash covers every doc's bytes (`corpusHashRecipe` in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json`).
5. The legacy census has grown past 038/013's count of 167. Today 227 active goals carry the Operator copy paragraph.

---

## 3. CHANGE LIST

### 3.1 Dispositions for every duplicate and gap

Canonical homes after the change:
- BH3 means `sk-create-goal/references/budget-and-handoff.md` section 3, the cut order.
- BH4 means `budget-and-handoff.md` section 4, the send rule.
- PN6 means `sk-create-goal/references/parent-and-nested-goals.md` section 6, precedence and amendments.
- AS4 means `sk-create-goal/references/authoring-standards.md` section 4, the criteria rules.
- CG means the `/create:goal` operations.

| Survey item | Disposition | Canonical home after |
|---|---|---|
| `SKILL.md:61` template-backed docs | Keep, and add `/create:goal` as an allowed route for `goal.md` | system-spec-kit |
| `SKILL.md:160` HOOKS keywords | Remove "packet goal", "goal.md" and "nested goal" | sk-doc `ROUTER.md:172` `GOAL_AUTHORING` |
| `SKILL.md:237-240` HOOKS resources | Keep | system-spec-kit |
| `SKILL.md:485` chat definition and cut clause | Replace with a pointer to BH4 and CG, and fix the injection clause to "objective slice" | BH4, CG |
| `README.md:62`, `:234-238` | Keep | system-spec-kit |
| `README.md:232` "valid at every level and on phase parents" | Correct the fact and point to CG | system-spec-kit, CG |
| Playbook section 2, the set-string shape | Keep. It is the objective slice | Playbook |
| Playbook section 3, why criteria are copied | Keep the rationale. The last clause becomes a pointer to AS4 | Playbook, AS4 |
| Playbook section 4, the cut order | Replace with a pointer | BH3 |
| Playbook section 5 items 1 and 2, the payload and the cap | Keep the resend timing. Point the payload and the limit to BH4. Rename the section heading to "Resending the parent goal" | BH4 |
| Playbook section 5 item 3, child amendment | Pointer | PN6 |
| Playbook section 5, `:98-99` "The template carries this rule" | Delete. It is false after the change | none |
| Playbook section 6, creating the file | Keep the `create.sh --with-goal` fact, corrected. Delete the renderer recipe and point to CG | CG |
| `validation-rules.md:687-717` | Keep | system-spec-kit |
| `validation-rules.md:722` How to Fix | Pointer to BH3 and CG | BH3, CG |
| `hook-system.md:97-99`, `quick-reference.md:16-17`, `template-guide.md:187`, `template-style-guide.md:42-43`, `folder-structure.md:37`, `retrieval-conventions.md:278` | Keep. Add a CG pointer to `quick-reference.md`, because it loads on every use of the skill. Correct `template-guide.md:187` and point it to CG | system-spec-kit |
| Gap `phase-definitions.md:204` (Option D) | Add a CG `phase-add` sentence | CG |
| Gap `phase-system.md:84` | Add a CG table row | CG |
| Gap `phase-checklists.md` | Leave. P2 | none |
| `goal.md.tmpl` blockquote, Operator copy and criteria introduction | Delete, and add the `GOAL_AUTHORING` pointer comment | BH4, BH3, AS4 |
| `goal.md.tmpl` binding paragraphs and decisions line | Keep. They are directive | system-spec-kit template |
| `create.sh` `--with-goal` flag lines | Keep | system-spec-kit |
| `create.sh:283-284` help | Correct the fact | system-spec-kit |
| Gap `create.sh:1649-1652`, `:1884-1885`, `:293-294` | Add CG pointers | CG |
| Validator and template-structure files | Keep | system-spec-kit |
| Speckit `packet_goal.nesting.parent_is_the_directive`, `read_order` | Keep | speckit |
| Speckit `nesting.precedence` | Pointer to the parent goal's binding section and PN6 | PN6 |
| Speckit `nesting.budget` | Keep "parent at most 4,000, children unbounded". Point the cut to BH3 | BH3 |
| Speckit `resend.payload` | Keep "the parent `chat_slice` from `goal.cjs packet`". Point the rule to BH4 | BH4 |
| Speckit `resend.child_rule` | Pointer | PN6, CG `amend` |
| Speckit `packet_goal` header comment | Add the authoring owner | CG |
| Gap speckit `:with-phases` P3 and P4 | Add a P4 activity naming `/create:goal {parent_folder} phase-parent` | CG |
| Gap speckit Option D (`phase_folder_awareness`) | Add a line naming `/create:goal <parent> phase-add` | CG |
| Speckit resume `:47` | Keep the posture. Point the payload to BH4 | BH4 |
| `save.md:61`, presentation Q6 and Q9 | Keep | speckit |
| `hooks/goal/README.md:65`, `:81`, `goal-plugin.md` | Keep. Hooks own them | goal hooks |
| `hooks/goal/README.md:147` | Leave. P2 | goal hooks |
| `AGENTS.md:187` | Three sentences of the rule plus a pointer, and name sk-create-goal as the authoring owner | BH4 |
| sk-create-goal `README.md:96-98`, "Cutting" | Pointer | BH3 |
| `create-goal-auto.yaml:216`, `:329`, `create-goal-confirm.yaml:233`, `:345` | "Cut in the budget-and-handoff section 3 order" | BH3 |
| sk-create-goal `SKILL.md:156` | Describe the playbook as the set-string and resend-timing doc | playbook |
| `parent-and-nested-goals.md:133` | Point to BH4 | BH4 |

### 3.2 File-by-file

| # | Path | Change | Owner | Priority |
|---|---|---|---|---|
| 1 | `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` | Section 3 becomes canonical: drop the playbook citation at `:39`, add the legacy-instruction cut after the frontmatter and log checks and re-cite the criterion step to AS4. Rewrite section 4 as the canonical send rule (text in section 5). Delete the live 3,735 figure in section 6 and state the new unfilled-template costs (1,623, 1,003 and 955 durable). Bump the version | sk-create-goal | P0 |
| 2 | `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Delete lines 34 to 42, 59 to 70 (with the blank line before the heading) and 99 to 101. Add the `GOAL_AUTHORING` comment after `HVR_REFERENCE`. Leave the anchors, H2 headings, placeholders and the `v2.2` marker alone | system-spec-kit | P0 |
| 3 | `.skilled/skills/sk-doc/sk-create-goal/assets/goal-top-level-template.md`, `goal-phase-parent-template.md`, `goal-phase-child-template.md` | Same removal and comment inside each template block. Rewrite the "Fixed prose" row: the decisions line, the binding paragraphs and the log introduction stay word for word, and nothing above the log addresses the author | sk-create-goal | P0 |
| 4 | `.skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Regenerate, then read the diff | system-spec-kit | P0 |
| 5 | `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Add an owner line at the top of section 1. Section 3 last clause points to AS4. Section 4 becomes a pointer to BH3. In section 5, point the payload and limit to BH4, point item 3 to PN6, delete `:98-99` and rename the heading. Section 6 gets the corrected `create.sh` fact and CG. Add sk-create-goal to section 8. Bump the version | system-spec-kit | P0 |
| 6 | `.skilled/skills/system-spec-kit/SKILL.md` | `:61` admits `/create:goal`. `:160` drops the three authoring keywords. `:485` points to BH4 and CG and says the objective slice is injected | system-spec-kit | P0 |
| 7 | `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | `:722` points to BH3 and to `/create:goal` `child` or `phase-add` | system-spec-kit | P0 |
| 8 | `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | `packet_goal` header comment, `precedence`, `budget`, `resend.payload`, `resend.child_rule`. Plan and complete also get the `:with-phases` P4 activity and the Option D line | system-spec-kit (speckit commands) | P0 |
| 9 | `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml` | `:47` payload clause points to BH4 | system-spec-kit (speckit commands) | P0 |
| 10 | `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md` | `:204` adds the `phase-add` sentence | system-spec-kit | P0 |
| 11 | `AGENTS.md` | `:187` send-rule sentences and owner sentence (text in section 5) | repository root | P0 |
| 12 | `specs/sk-doc/060-create-goal-mode/goal.md` | Add the `012` binding row and the pointer comment. Drop its 2-line blockquote, Operator copy and criteria introduction. Then print and resend `chat_slice` | this packet | P0 |
| 13 | `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` | `:156` description of the playbook. Bump the version | sk-create-goal | P1 |
| 14 | `.skilled/skills/sk-doc/sk-create-goal/README.md` | `:96-98` becomes a pointer to BH3. Bump the version | sk-create-goal | P1 |
| 15 | `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md` | `:133` points to BH4 | sk-create-goal | P1 |
| 16 | `.skilled/commands/create/assets/create-goal-auto.yaml`, `create-goal-confirm.yaml` | The four "playbook order" lines | sk-create-goal (`/create:goal`) | P1 |
| 17 | `.skilled/skills/system-spec-kit/README.md` | `:232` corrected fact and CG | system-spec-kit | P1 |
| 18 | `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Add a CG line under the existing goal note at `:16-17` | system-spec-kit | P1 |
| 19 | `.skilled/skills/system-spec-kit/references/structure/phase-system.md` | `:84` table row for CG | system-spec-kit | P1 |
| 20 | `.skilled/skills/system-spec-kit/references/templates/template-guide.md` | `:187` corrected fact and CG | system-spec-kit | P1 |
| 21 | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Echo text only: `:283-284`, `:293-294`, `:1649-1652`, `:1884-1885` | system-spec-kit | P1 |
| 22 | `.skilled/hooks/goal/lib/goal-slice.cjs`, `goal-slice.test.cjs` | Reminder at `:211` keys the send on `packet_budget=ok` and keeps `4000 characters`. Update the assertion at `:198-203` | goal hooks | P1 |
| 23 | `.hermes/skills/system-spec-kit/SKILL.md`, `.hermes/skills/sk-create-goal/SKILL.md` | Regenerate with `sync-skills-hermes.cjs` | generated | P1 |
| 24 | `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and its fixtures | Regenerate with `generate-trigger-index.mjs`, as 038/013 did | generated | P1 |
| 25 | sk-create-goal `changelog/` and system-spec-kit changelog | One entry each, following each skill's existing convention | each skill | P1 |
| 26 | `specs/sk-doc/060-create-goal-mode/spec.md`, `012-goal-send-and-dedupe/*` | Phase map row 12 scope and status, and this phase's own docs and child goal | this packet | P0 |

P2, named and not in this phase: `hook-system.md:99` says the durable slice is injected. `hooks/goal/README.md:147` could name `/create:goal`. `phase-checklists.md` has no goal line. `create.sh:1652` and `phase-system.md:82` still say `/spec_kit:plan`. The `detect-unbound-phase.md` scenario fixture keeps the old goal shape, which stays valid. The four over-budget parents need their own cuts, because the legacy-prose cut alone would leave all four over: sk-code/007 at 4,674, sk-design/018 at 4,699, sk-design/019 at 5,269 and sk-git/028 at 5,005.

---

## 4. REQUIREMENTS

### P0

| ID | Requirement |
|---|---|
| REQ-001 | `budget-and-handoff.md` section 4 is the one full statement of the send rule. It names each removed element (frontmatter, HTML comments including anchors, `---` dividers, heading section numbers, template instruction prose), says the 4,000 limit is measured on the durable slice, makes `packet_budget=ok` the send precondition and covers legacy goals |
| REQ-002 | `goal.md.tmpl` and the three asset templates carry no template instruction prose above the log anchor. Their anchors, H2 headings and placeholders are unchanged, and the parity test and golden snapshot pass |
| REQ-003 | `budget-and-handoff.md` section 3 is the only full cut order in the repository, and it cites no other document for it |
| REQ-004 | No system-spec-kit or speckit file restates the chat-slice definition, the cut order, the precedence rule or the child-amendment rule. Each names sk-create-goal or `/create:goal` at that point instead |
| REQ-005 | Every phase-nesting entry point names `/create:goal`: speckit `:with-phases` and Option D in plan and complete, `phase-definitions.md` Option D and the `create.sh` phase next steps |
| REQ-006 | Every instruction surface that states the send limit says it is measured on the durable slice, and none caps the chat slice as a separate figure. That covers `AGENTS.md`, `SKILL.md`, the playbook and the speckit YAMLs |
| REQ-007 | 060's parent goal binds `012-goal-send-and-dedupe/goal.md`, passes the goal checker 4 of 4 and measures at most 3,000 durable characters |

### P1

| ID | Requirement |
|---|---|
| REQ-008 | `create.sh` help, `README.md:232`, playbook section 6 and `template-guide.md:187` state that `--phase --with-goal` writes child goals only and that `--level phase-parent --with-goal` writes a parent goal |
| REQ-009 | One retrofit path is documented, `/create:goal <packet> retrofit`. The inline-renderer recipe is gone from the playbook and `validation-rules.md`, and `SKILL.md:61` admits `/create:goal` |
| REQ-010 | The HOOKS keywords at `SKILL.md:160` no longer contain "packet goal", "goal.md" or "nested goal" |
| REQ-011 | `budget-and-handoff.md` carries no live count of a packet goal |
| REQ-012 | The resend reminder keys the send on `packet_budget=ok` and still names 4000 characters. The hook tests pass |
| REQ-013 | Hermes mirrors and the trigger index are regenerated, and no other `goal.md` in `specs/` changes |

---

## 5. ACCEPTANCE CRITERIA

The canonical section 4 text the implementer writes, in full:

```markdown
## 4. WHAT A PARENT GOAL SENT IN CHAT CONTAINS

Send a parent goal in chat only as the `chat_slice` that `goal.cjs packet` prints, and only when the same report shows `packet_budget=ok`. Never paste the file, a summary of it or any other text.

The chat slice is the durable slice with four things removed: the frontmatter, every HTML comment (anchor markers and template markers included), every `---` divider and every heading section number. It keeps the title, the objective, the decision table, the binding table with its rules and the completion criteria. The current template puts no authoring instructions above the log, so a goal filled from it sends none.

The 4,000-character limit is measured on the durable slice, with comments and anchors counted. `validate.sh`, `check-goal.cjs` and `goal.cjs packet` all measure that text. The chat slice only removes text from the durable slice, so a parent at `packet_budget=ok` never sends more than 4,000 characters. When the report shows `over`, cut the file in the section 3 order and measure again. Never truncate the chat slice to fit. When a top-level goal or phase parent shows `unknown`, fix the manifest first.

A goal filled from an older template can still carry a blockquote under its title, an `Operator copy` paragraph or a criteria introduction. `AGENTS.md` overrides any resend wording in them. Remove them the next time the parent is amended or cut, and first move any packet-specific sentence an author wrote under those headings into the directive.

The `objective_slice` is a different projection: what a runtime stores when it binds the packet. It is never pasted in chat.
```

The `AGENTS.md:187` replacement for "The chat slice is the durable slice without ... Never send a parent goal over 4,000 characters: cut the file first." and for "Mechanics are `system-spec-kit`'s.":

```text
Send only the `chat_slice` that `goal.cjs packet` prints: no frontmatter, comments, anchors, dividers, section numbers or template instructions. The 4,000-character limit is measured on the durable slice, so send only at `packet_budget=ok` and cut the file first when it is over. The full rule is `sk-create-goal`'s `references/budget-and-handoff.md` §4. ... Goal authoring is `sk-create-goal`'s, and the template and validator are `system-spec-kit`'s.
```

| AC-ID | REQ | Given / When / Then | Verification |
|---|---|---|---|
| AC-001 | REQ-001 | Given the edited reference, When section 4 is read, Then it names all five removed elements, the durable-slice measure and `packet_budget=ok` | V1 shows a hit inside section 4, and V2 prints a section 4 that names the five elements |
| AC-002 | REQ-002 | Given the four template files, When searched for the removed prose, Then nothing matches | V3 prints 0 (baseline 12) |
| AC-003 | REQ-002 | Given the new templates, When the parity and checker tests run, Then all pass | V4 prints `pass 15` and `fail 0` (baseline the same) |
| AC-004 | REQ-002 | Given the regenerated snapshot, When the scaffold snapshot test runs, Then it passes and the snapshot has no Operator copy | V5 passes and V6 prints 0 (baseline 1). V5 follows the `test:task-enrichment` pattern in `runtime/package.json` and was not run here |
| AC-005 | REQ-002 | Given the unfilled phase-parent asset block, When measured, Then durable is at most 1,700 and chat at most 1,300 | V7 prints `1623 1218` (baseline `3156 2823`) |
| AC-006 | REQ-003 | Given the repository, When searched for cut-order citations of the playbook, Then none remain | V8 prints 0 (baseline 11) |
| AC-007 | REQ-004 | Given system-spec-kit and speckit, When searched for sk-create-goal, Then every pointer surface names it | V9 lists at least 14 files (baseline 0 outside generated data) |
| AC-008 | REQ-004 | Given the speckit YAMLs, When searched for restated nesting rules, Then none remain | V10 prints 0 (baseline 9) |
| AC-009 | REQ-005 | Given the phase entry points, When searched, Then each names `/create:goal` | V11 shows at least 2 per YAML and 1 in the reference. V12 prints at least 2 (baseline 0) |
| AC-010 | REQ-006 | Given the instruction surfaces, When searched for a chat-only cap, Then none remain | V13 prints 0 (baseline 2) and V14 prints 1 (baseline 0) |
| AC-011 | REQ-007 | Given 060's parent goal, When the checker and packet report run, Then 4 of 4 pass within 3,000 | V15 prints `RESULT: PASSED (4/4 checks)` (baseline `FAILED (3/4 checks)`). V16 prints `packet_budget=ok` and `packet_durable_chars` at most 3000, expected 2943 |
| AC-012 | REQ-007 | Given the edited packet, When validated, Then strict validation passes | V17 prints `RESULT: PASSED` |
| AC-013 | REQ-008 | Given the help and README, When read, Then the child-only behavior is stated | V18 shows `--with-goal` help naming `--phase` as child-only. V19 names `--level phase-parent` |
| AC-014 | REQ-009 | Given the playbook and validation rules, When searched for the renderer recipe, Then it is gone | V20 prints 0 and V21 prints 1 (baseline 0) |
| AC-015 | REQ-010 | Given `SKILL.md:160`, When read, Then the authoring keywords are gone | V22 prints 0 (baseline 1) |
| AC-016 | REQ-011 | Given the reference, When searched for the live figure, Then none remains | V23 prints 0 (baseline 1) |
| AC-017 | REQ-012 | Given the new reminder, When the hook tests run, Then they pass and the reminder names the budget state and 4000 | V24 prints `fail 0` with at least 21 passing (baseline 21). The updated assertion checks `packet_budget=ok` and `4000 characters` |
| AC-018 | REQ-013 | Given the generated copies, When checked, Then they match and no other goal changed | V25 exits 0. V26 lists no goal file beyond 060's parent, 012's child and any already listed when the phase opened. Other packets share this working tree, so take that opening list first |

Verification commands, run from the repository root unless noted. Counts use `wc -l` or `grep -c` so a clean result prints 0 rather than nothing.

```bash
# V1, V2
rg -n "packet_budget=ok" .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md
sed -n '/^## 4\./,/^## 5\./p' .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md
# V3
rg -n "^### Operator copy|^Three to seven bullets|DURABLE SLICE: it is" .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl .skilled/skills/sk-doc/sk-create-goal/assets/goal-*-template.md | wc -l
# V4
node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/
# V5, run from .skilled/skills/system-spec-kit/runtime
npx vitest run cli/tests/scaffold-golden-snapshots.vitest.ts --config ../vitest.config.ts
# V6
grep -c "### Operator copy" .skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap
# V7
node -e 'const gs=require("./.skilled/hooks/goal/lib/goal-slice.cjs");const t=require("fs").readFileSync(".skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-parent-template.md","utf8");const b=t.match(/<!-- BEGIN TEMPLATE -->\n`{3}markdown\n([\s\S]*?)\n`{3}\n<!-- END TEMPLATE -->/)[1]+"\n";console.log(gs.extractDurableSlice(b).length, gs.renderChatSlice(b).length)'
# V8
rg -n "playbook order|playbook, section 4|order the goal set-string playbook|set-string playbook's order|order the \[set-string playbook\]" .skilled AGENTS.md | wc -l
# V9
rg -l "sk-create-goal|create:goal" .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/README.md .skilled/skills/system-spec-kit/references .skilled/skills/system-spec-kit/templates/addons .skilled/commands/speckit/assets
# V10
rg -n "child detail outranks any summary of either|is applied to the parent first, then the parent is resent|bounded so it fits one chat message" .skilled/commands/speckit | wc -l
# V11, V12
grep -c "create:goal" .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/skills/system-spec-kit/references/structure/phase-definitions.md
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --help | grep -c "create:goal"
# V13, V14
rg -n "chat slice is over 4,000|when the slice is longer" .skilled AGENTS.md | wc -l
grep -c "budget-and-handoff.md" AGENTS.md
# V15, V16
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-doc/060-create-goal-mode
node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-doc/060-create-goal-mode --workspace "$PWD" | grep -E "packet_durable_chars|packet_budget"
# V17
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict
# V18, V19
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --help | grep -A2 -- "--with-goal"
sed -n 232p .skilled/skills/system-spec-kit/README.md
# V20, V21
rg -n "inline-gate-renderer" .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md .skilled/skills/system-spec-kit/references/validation/validation-rules.md | wc -l
sed -n 61p .skilled/skills/system-spec-kit/SKILL.md | grep -c "create:goal"
# V22
grep '"HOOKS": {' .skilled/skills/system-spec-kit/SKILL.md | grep -cE '"packet goal"|"goal.md"|"nested goal"'
# V23
rg -n "3,735" .skilled/skills/sk-doc/sk-create-goal | wc -l
# V24
node --test .skilled/hooks/goal/lib/goal-slice.test.cjs
# V25, V26
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
git status --short -uall -- 'specs/*goal.md'
```

---

## 6. RISKS AND MITIGATIONS

| Risk | Impact | Mitigation |
|---|---|---|
| 060's parent goal is at 3,950 of 4,000 before its 012 binding row. The row costs 45 characters, which leaves 3,995 and a 5-character margin. Any second edit, or a second phase row, fails `SPECDOC_SUFFICIENCY_005` | High | Add the row and the new fixed text in one edit (2,943, margin 1,057). Measure with `goal.cjs packet` before the resend |
| `AGENTS.md` loads on every runtime, and `~/.claude/CLAUDE.md` symlinks to it for every project on this machine | High | Sentence-level edit only. Keep "never send its frontmatter anywhere" and the override clause. The three rule sentences stand on their own where sk-create-goal does not exist. Review the diff line by line |
| Legacy parents keep the old prose in their chat slices until amended. 16 of about 39 parents carry an Operator copy section | Medium | The `AGENTS.md` override neutralizes their resend wording, and section 4 schedules removal at the next amendment. See open question 1 |
| A heading-based strip would delete authored text at `specs/sk-design/018-sk-design-parent-v2/goal.md:57-61` | Medium | No renderer strip. The legacy cut step says to move packet-specific sentences first |
| The template changes without a snapshot regeneration, or an asset drifts | Medium | Order: `goal.md.tmpl`, then the three assets, then the parity tests, then the snapshot regeneration with its diff read |
| Removing "goal.md" from HOOKS changes system-spec-kit's internal routing for goal prompts | Low | `quick-reference.md` loads on every use of the skill and gains the CG line. INFERRED: the skill advisor is unaffected, because these keywords live only in `SKILL.md` (no test or benchmark references `HOOKS`, and system-spec-kit is not in compiled routing). Confirm with `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"author a nested goal.md for phase 3"}' --format json` before and after |
| 060's decision D4 says gaps in system-spec-kit "go to that skill as amendments", and this phase edits system-spec-kit files | Low | Record in 012's own goal that the operator's two asks are that amendment, and that every edit follows system-spec-kit's template-first order |
| `--level phase-parent --with-goal` probably scaffolds a parent goal whose placeholder binding row fails `SPECDOC_SUFFICIENCY_006` | Low | INFERRED from `goal.md.tmpl:84` and `spec-doc-structure.ts:1065-1080`. Not run here. The phase routes parent goals through CG instead. Confirm in a temp directory and record it as a system-spec-kit follow-up if it holds |
| The pointer comment adds 72 durable characters to every new goal | Low | Net saving for a parent is 1,533 durable characters |
| Doc edits change the trigger-index corpus hash | Low | Regenerate at close, as 038/013 did |
| Three large speckit YAMLs are edited | Low | Change only the named keys, parse each file after editing and diff each key |

---

## 7. PHASE SHAPE

One phase, Level 2. There are three reasons.

First, the rule text, the template and the pointers have to land together. A split leaves an intermediate state where the playbook still says "the template carries this rule", or where pointers name a section 4 that does not yet say the new thing.

Second, 060's parent has room for exactly one more binding row (3,995 of 4,000). A second child's row pushes it over unless the first child also cuts 060's fixed text, which moves half the work into the first child anyway.

Third, `recommend-level.sh` returns Level 2 with no phase split for the estimated size. The inputs, about 350 changed lines across about 34 files, are my estimate.

Suggested task order inside the phase:
1. The canonical text in `budget-and-handoff.md` sections 3, 4 and 6.
2. `goal.md.tmpl`, the three assets, the parity tests and the snapshot.
3. The system-spec-kit pointers and fixes.
4. The speckit and `/create:goal` YAMLs.
5. `AGENTS.md`, the reminder and its test.
6. The `create.sh` echo text.
7. 060's parent row and fixed text, then the `chat_slice` resend.
8. Regenerate the mirrors and the index, then run strict validation.

---

## 8. OPEN QUESTIONS

1. Legacy parents: should their chat slices drop the old instruction paragraphs now through a `renderChatSlice` change, or only when each parent is next amended? Recommendation: at the next amendment. A renderer change cannot help the 4,000 limit, which is measured before the projection. It would need to match at least eight wordings, and it would delete the authored lines at `specs/sk-design/018-sk-design-parent-v2/goal.md:57-61`.
