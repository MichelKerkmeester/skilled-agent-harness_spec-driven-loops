# Iteration 2: Level 1 and trivial-edit lightness, and the one-sentence opt-out

## Focus

Q3 from the strategy: *how do Level 1 and trivial edits stay light under each mechanism, and how does a user opt out in one sentence?* Taken because `## 11. NEXT FOCUS` names it.

The question has two halves and they turned out to be the same mechanism. **Lightness** asks what a typo-fix turn pays for a protection mechanism that exists for a 900-line refactor. **Opt-out** asks what vocabulary lets a user buy the lightness back on demand. Every candidate mechanism answers both with one property: whether it *reads the level* — and, if it does, the user's opt-out and the mechanism's lightness control collapse into the same lever. The evidence below establishes that ladder, prices each mechanism against it, and locates the opt-out vocabulary that already exists.

Scope: `AGENTS.md` gates and the §6 exemption, `recommend-level.sh`, `folder-structure.md` §3, `speckit-implement.yaml`, `speckit-complete.yaml`, `spec-authoring-card.md` §2/§6, `quick-reference.md` §5/§8, the skill-advisor hook doc, and the advisor's prompt-policy data file. Hooks were Q2's territory and were read only for what they say about lightness and opt-out.

## Actions Taken

1. Read `iteration-001.md` and the reducer-owned strategy to inherit findings 9–12 and the BLOCKED list before choosing an angle.
2. Grepped `AGENTS.md` for every lightness and opt-out term (`exempt`, `trivial`, `Bypass phrases`, `Skip:`, `Level 1`) to get an exact line inventory.
3. Read `folder-structure.md` §3 in full and located the Level 1/2/3 required-file blocks.
4. Grepped the three YAMLs for level branching, then read `implement.yaml`'s `documentation_levels`, `prerequisites`, `available_templates` and the `step_4` skip line.
5. Read `spec-authoring-card.md` §2 (level decision) and §6–§7 (plan shape, task lines) to test whether the proposed Q4 fix is level-scoped.
6. Read `quick-reference.md` §5 pre-implementation checklist and §8 small-task definition / §9 Option D.
7. Read `skill-advisor-hook.md` for firing conditions, then the prompt policy implementation and its default JSON — the only data-driven skip list in the repo.
8. Measured the four Level-1 template files and all three YAMLs plus the card and the policy JSON with `wc`.

## Findings

1. **The lightness ladder already exists, on both paths, calibrated to the same numbers.** Four rungs, one owner: exempt-typo (no packet), Level 0 (scorer score ≤ 24), Level 1 (≤ 44), Level 2 (≤ 69), Level 3 (70+). `AGENTS.md` states the exempt rung, the card maps the scorer's Level 0 up to Level 1, and the scorer owns the boundaries. [SOURCE: AGENTS.md:245]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:52]
   [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:107]
   [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:335-339]

2. **No mechanism needs to invent lightness. It needs to read the level that one scorer already prints.** The scorer is already referenced from four chat-path entry points, so a mechanism that consumes its answer inherits the whole ladder for free; a mechanism that does not consume it must restate the ladder, and two statements of one ladder drift. [SOURCE: AGENTS.md:251]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:49]
   [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:118]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:62]
   [INFERENCE: based on finding 1 — one scorer, four call sites, so level-awareness is the cheap path and restatement is the expensive one]

3. **Both paths already say "skip this at Level 1", and they agree — so Level 1 is not where the chat path loses protection.** The chat path skips the acceptance-criteria half of completion verification at Level 1; `implement.yaml`'s step 4 says the same in the same words; `complete.yaml`'s docs check repeats it. The gap iteration 1 found is *sequencing before implementation*, and it sits above Level 1's business. [SOURCE: AGENTS.md:144]
   [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:539]
   [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:849]

4. **Level 1 costs four documents and ~49.6 KB of template, and that floor is not what "stays light" can cut.** The four core templates measure 17,503 + 15,050 + 11,872 + 5,195 bytes (~12.4k tokens if all are loaded). An apparent conflict resolves cleanly: `implement.yaml` lists three Level-1 prerequisites while the level contract lists four, but the fourth is `implementation-summary.md`, which both sources mark as created *after* implementation and which `complete.yaml` requires at completion. Same end state, different checkpoint. [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:129-137]
   [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:234]
   [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:960]
   [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl]
   [INFERENCE: based on the two required-file lists plus the "created AFTER implementation completes" qualifier both carry]

5. **The opt-out precedent is a scoped phrase list on one existing line — and it covers memory only.** The line's shape is `**Bypass phrases:** "<a>" / "<b>" / "<c>" for <one named scope>`. It is scope-bound by construction, not a global switch, which is exactly the shape a documentation-gate opt-out needs and exactly why the current list cannot already serve it. [SOURCE: AGENTS.md:108]

6. **The only fully data-driven opt-out in the repo is the advisor's prompt policy, and it never costs a prompt token.** `EXACT_SKIP_COMMANDS` is a JSON set (`/help`, `/clear`, `/exit`, `/quit`), alongside `CASUAL_ACKNOWLEDGEMENTS`, `WORK_INTENT_VERBS` (which includes `fix`, `patch`, `edit`), `GOVERNANCE_MARKERS`, and four length/token thresholds. The policy file is 91 lines / 1,486 bytes (~370 tokens) and is read by the CLI, not the model; both the file path and every threshold are environment-overridable, and a master kill switch sits above it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json]
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:42-46]
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:66-70]
   [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:116]

7. **A hook gets automatic lightness for free; a text gate cannot.** The advisor declines short prompts, casual acknowledgements and skip commands before it spawns the CLI, so a typo-class prompt costs the mechanism nothing at all. An `AGENTS.md` gate has no equivalent pre-filter: its text is read on every turn whether it fires or not, so its lightness must be a clause inside the always-read text. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:37]
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json]
   [INFERENCE: based on findings 6 and 7 — prompt-time gating is a property of where the mechanism runs, not of how it is written]

8. **Gate 3's Option D is a session-scoped opt-out in practice, but not a reusable sentence.** The answer holds for the entire session and is re-asked only on "new task", "different feature", a different folder, or an explicit ask. So a user who answers D once already buys lightness for the whole session — the missing piece is a *phrase* they can type, not a new permission model. [SOURCE: AGENTS.md:83]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:276]
   [SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:265]

9. **Level-1 cost per mechanism, on the "does it charge the typo" test.** Enforcement carried by templates and `validate.sh` is the only mechanism with a provably zero *marginal* cost at Level 1: the validator already runs at completion with level-scoped rules (`LEVEL_MATCH`, `LEVEL_DECLARED`) and the level lists are per-level by construction, so a new rule adds neither prompt tokens nor an extra command run. A hook adds zero at Level 1 but only injects text. An `AGENTS.md` gate costs its always-read clause on every turn including the typo. A shared step reference costs a pointer line always plus 250–500 tokens when loaded. Invoking the command costs the whole workflow (finding 10). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json]
   [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:129-137]
   [INFERENCE: based on iteration 1's finding 7 (validator rules include level-scoped shape rules) and finding 4 here (the Level 1 floor is already paid)]

10. **Invoking the command on a typo fix is the heaviest option, and its lightness lever already exists as an argument.** `implement.yaml` is 830 lines / 60,098 bytes (~15k tokens), `complete.yaml` 1,444 / 93,496 (~23k). Default `confirm` mode puts 12 checkpoints in the step list and a step-completion rule that forbids skipping steps or proceeding without approval outside child dispatch. `auto`/`autopilot` skip the confirm blocks and the checkpoint flags but not the steps. So the mechanism is not made light by adding text; it is made light by a mode the user already has to type. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:8]
    [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:9]
    [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:20]
    [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:24]

11. **Under the validator mechanism the opt-out and the lightness control are the same lever, so it needs no new vocabulary.** A packet declares its level and `LEVEL_DECLARED`/`LEVEL_MATCH` already key off it; "keep this light" is `--level 1` at scaffold time and a declared level afterward. Under a text gate or a shared reference the opt-out must be a phrase added to the existing bypass-phrase line, because those carriers read no other input. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:52]
    [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json]
    [SOURCE: AGENTS.md:108]
    [INFERENCE: based on findings 5, 6 and 9 — the carrier determines the only two opt-out shapes that exist: a phrase list or a declared level]

12. **Q4's proposed fix is not level-scoped as written, and would charge Level 1 too.** The plan-shape section states its three-phase requirement and its heading-grep verify unconditionally; the level table two sections earlier is the only level gate in the card, and nothing says the plan-shape section is Level 2+. As drafted, the fix that closes the cold-read hole would add a phase-anchoring edit and a verify grep to every Level 1 packet as well. The one-word repair is a level qualifier on that section's acceptance line. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:111-124]
    [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:56]
    [INFERENCE: based on iteration 1 findings 9–10 plus the absence of any qualifier in section 6]

## Questions Answered

- **Q3** — How do Level 1 and trivial edits stay light under each mechanism, and how does a user opt out in one sentence. Answered by findings 1–11: lightness is inherited from the single level scorer, and only mechanisms that read the level avoid restating the ladder; the marginal-cost ranking is validator < hook < AGENTS.md gate < shared reference < command invocation; and the opt-out has exactly two shapes in this repo — a scoped phrase on `AGENTS.md:108`, or a declared level.

## Questions Remaining

- **Q2** — per-mechanism cost, breakage and cross-runtime / child-dispatch behaviour for all five mechanisms. Still open. This iteration touched the hook's firing conditions, its data-driven skip list and the no-user checkpoint fallback, which is a partial contribution: the hook has a kill switch and an automatic pre-filter, and the command path has a `child_dispatch` record-and-continue rule. Neither has been checked against the seven runtime adapters.
- **Q4** — closer. Finding 12 closes the Level 1–3 half of the check: the fix must carry a level qualifier or it raises Level 1 cost. The child-dispatch half (does a dispatched child with no user present run the card at all) is still untested.
- **Q5** — per-turn token cost per mechanism and the single recommendation. Findings 4, 6, 9 and 10 supply four measurements (templates 49,620 bytes; policy 1,486 bytes; implement 60,098 / complete 93,496 bytes; card 9,699 / 208 lines). The ranking is now constrained from the lightness side but not yet decided.

## Ruled Out

- **Treating "Level 1 is cheap" as a premise to measure.** The four Level-1 templates total ~49.6 KB. Level 1 is a *bounded* cost, not a small one, so the lightness question is only ever about marginal cost per mechanism. Measuring absolute Level-1 weight would have produced a number that answers nothing.
- **Reading `recommend-level.sh` end to end to understand Level 0.** The boundary constants and the mapping branch are contiguous; a 20-line read produced the whole ladder. The scorer's weighting arithmetic is not in scope for a lightness answer.
- **Treating the email-style "exempt (typo fix)" checklist line as a separate exemption.** It is the same rung as `AGENTS.md:245`, restated in a checklist. Counting it twice would have over-stated the number of opt-out surfaces.

## Dead Ends

- **Looking for a hook that gates a write at tool time.** The advisor hook is a `UserPromptSubmit` / system-transform hook: it injects text and returns `{}` on failure, so it informs a turn and never blocks one. Any mechanism claiming tool-time enforcement would need a different hook family, which is a new hook concern — the frozen preference order's last resort. Not re-investigating the advisor hook for enforcement capability.

## Edge Cases

- **Ambiguous input:** "stay light" can mean (a) fewer documents, (b) fewer gate checks, or (c) fewer tokens read per turn. Chose (c) plus (b), because (a) is fixed at four documents by finding 4 and cannot vary by mechanism. Deferred: a document-count reading, which would have made the validator mechanism look heaviest when it is in fact cheapest.
- **Contradictory evidence:** one apparent conflict recorded and resolved rather than left open — the three-vs-four Level-1 required-file lists (finding 4). `implement.yaml`'s `level_1_required` is a *pre-implementation* prerequisite; `complete.yaml:960` and the level contract both require `implementation-summary.md` at completion, and both say it is created after implementation. Resolution is by qualifier, not by choice of truth, so no LOGIC-SYNC decision is needed and no operator is asked (consistent with the run's no-operator instruction).
- **Missing dependencies:** `resource-map.md` still absent, so the coverage gate is skipped and source selection is mine. The advisor policy file is authoritative for the values but the resolver can override every one of them at run time via environment variables, so the quoted thresholds are defaults rather than guarantees. Noted, not blocking.
- **Partial success:** none. Every planned read succeeded; `wc` gave the sizes the cost findings rest on.

## Sources Consulted

- `AGENTS.md` (55–61 confidence, 63–70 Gate 2, 83 Gate 3 session scope, 99 Gate 5 skip, 108 bypass phrases, 144 completion skip, 245 §6 exemption, 251 level row)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` (100–109 thresholds, 335–345 mapping)
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` (129–137 Level 1, 145–175 Levels 2–3)
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` (40–60 level, 111–150 plan shape and task lines)
- `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` (175–190 checklist, 255–285 small-task and Option D)
- `.skilled/commands/speckit/assets/speckit-implement.yaml` (1–24 execution modes and checkpoints, 225–285 documentation levels, 530–545 step 4)
- `.skilled/commands/speckit/assets/speckit-complete.yaml` (840–855 docs level, 960 level file set)
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` (35–39 firing, 116 kill switch)
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts` (42–70 config and thresholds)
- `.skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json` (all sets and thresholds)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` (level-scoped rules)
- `wc -c` over `templates/core/{spec,plan,tasks,implementation-summary}.md.tmpl` (17,503 / 15,050 / 11,872 / 5,195 bytes)

## Assessment

- New information ratio: 0.87
- Questions addressed: Q3, Q4 (partial), Q2 (partial), Q5 (measurements only)
- Questions answered: Q3

## Reflection

- **What worked and why:** searching for the *vocabulary of lightness* (`exempt`, `trivial`, `bypass`, `Skip:`, `Level 1`) across four files at once instead of reading any file whole. These docs are written in rule prose, so every exemption announces itself with one of about six words; the grep produced the complete opt-out and skip inventory in two calls. The same technique found the hook's skip list: `shouldFireAdvisor` was the only lead needed, and the policy JSON behind it is 1,486 bytes.
- **What did not work and why:** the first attempt to print the policy JSON with `rg` was mangled, because the file is minified onto few long lines and `rg` prints the whole line for every match. A three-line `python3 -c json.load` dump fixed it. Root cause: assuming a config file is pretty-printed. Cost one call, and it would have corrupted the thresholds finding had I quoted the mangled output.
- **What I would do differently:** verify "is this section level-scoped?" *before* drafting a finding about a proposed fix. Finding 12 is only reachable by noticing that the card's plan-shape section carries no qualifier, and that check is one grep — but it was done after the other eleven findings were framed, so it arrived as an amendment rather than as a design constraint. On a question about lightness, "does the proposed change carry a level clause?" is the first question, not the twelfth.

## Next Focus

**Recommended next focus: Q2 — per-mechanism cost, breakage and portability**, now narrowable to one question the lightness pass made sharp: *which carriers can honour a declared level, and which must restate it?* Findings 2, 9 and 11 partition the five mechanisms by that property, so the next iteration should test it against the seven runtime adapters in `skill-advisor-hook.md` §53–58 and against `AI_SESSION_CHILD=1`. The specific risks to check: whether an `AGENTS.md` gate's text survives in a child that has no user to ask, whether the advisor's `GOVERNANCE_MARKERS` set already forces routing on the words "spec kit" (which would make mechanism 1 partly redundant), and whether any runtime adapter drops the human-visible rule text while keeping the hook brief.

The `spec_no_clarification` contradiction from iteration 1 stays open — it needs an operator decision about whether the marker is still live.

## SCOPE VIOLATIONS

None. Two writes plus one gateway invocation, all inside the resolved packet root. `research/research.md` was **not** created even though `progressiveSynthesis` is true, because the dispatch's write allowlist enumerates only the iteration narrative and the delta file; progressive synthesis is deferred to the workflow rather than performed out of scope.
