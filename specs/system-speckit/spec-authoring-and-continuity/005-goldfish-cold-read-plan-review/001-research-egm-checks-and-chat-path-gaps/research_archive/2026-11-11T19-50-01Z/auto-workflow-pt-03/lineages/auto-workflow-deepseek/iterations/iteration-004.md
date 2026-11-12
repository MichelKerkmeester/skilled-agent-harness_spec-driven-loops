# Iteration 4: Mechanism B — one shared step reference both paths read

## Focus

Mechanism B: the skill loading a small shared step reference that both paths read. The question is not whether such a document could exist but whether one already does, what would make both paths actually open it at the same moment, and which of its two load points — the intent router or the always-on list — is the honest one.

## Actions Taken

1. Read `SKILL.md` §1-§2 for the write-path claim and the routing contract.
2. Read `ROUTER.md` §1-§2, its machine `INTENT_SIGNALS`, `RESOURCE_MAP`, `LOADING_LEVELS` and the fallback branch.
3. Read `spec-authoring-card.md`'s section map, its Bounds block, §6 and §11.
4. Grepped every reference to `spec-authoring-card.md` across the skills, agents and command assets to see which paths name it.
5. Measured the card's size and compared it with `quick-reference.md`.

## Findings

1. **The shared write-path reference already exists: `spec-authoring-card.md` is what a chat write is supposed to start with.** `SKILL.md` §2 states "a write starts with `references/workflows/spec-authoring-card.md`" [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:94], and the card is 9,699 bytes across eleven numbered sections, each ending in an `Acceptance:` line and a `Verify:` command [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:39] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:206].

2. **Both paths already name the same document, so mechanism B is half-built rather than new.** The plan router's workflow summary says the workflow "follows `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`" [SOURCE: .skilled/commands/speckit/plan.md:106], the implement router says the same [SOURCE: .skilled/commands/speckit/implement.md:92], and both workflow YAMLs carry the card in a prompt-contract rule [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:312] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:288].

3. **But the card's load is keyword-gated, and the keywords miss ordinary write requests.** The machine signals are `plan`, `design`, `new spec`, `level selection` for PLAN and `implement`, `build`, `execute`, `workflow` for IMPLEMENT [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:161] [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:163], and the router returns `UNKNOWN_FALLBACK` with a disambiguation checklist when the best intent score is under 0.5 [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:373]. A request like "add a `--keep` flag to the archive script" matches none of those words, so the card can be skipped on exactly the ordinary chat write the question is about.

4. **The router's own prose promises the opposite of what its keyword table implements, and the table wins.** The overview says "a create, an add, an update, a fix, a rename or a configure" reaches the skill [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:27], but `add`, `update`, `create` and `fix` appear in no `INTENT_SIGNALS` entry [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:161]. Recorded as contradictory evidence: the machine table governs the load, and the prose sentence is aspiration.

5. **The card's shape makes one added step cheap: it inherits an executable check.** Section 11's pair is `Acceptance: the question is written in goal.md as Open question:` and `Verify: rg -n 'Open question:' <packet folder>/goal.md prints at least one line` [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:206] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:207]. A new step written in that shape costs one section and no new vocabulary.

6. **The card's Bounds block forbids the step from enforcing anything.** It allows writes only to the packet and its `scratch/`, forbids editing `.skilled/`, and forbids running `generate-context.js` or `/speckit:save` [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:36] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:37]. A step there instructs and verifies; it cannot block.

7. **The card is read by the writer, at authoring time, in the same context — so a step in it repeats the evaluator-identity limit the packet already recorded.** The card's own audience is the author ("the short authoring path for a model") [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md:16], which means a comprehension or readiness rule placed there is self-scored.

8. **The measured cost is small and paid only by writing sessions.** The card is 9,699 bytes, roughly 2.4k tokens, and it loads only when an intent selects it or a write reaches the skill [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:94]. `quick-reference.md` at 30,232 bytes is the expensive sibling and loads "first on every invocation" [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:95], which is the comparison that makes the card the cheap carrier.

9. **The smallest change that makes the card load on a write is one line in the machine router, not a new section.** Adding `create`, `add`, `update` and `fix` to the PLAN or IMPLEMENT keyword lists edits two existing `INTENT_SIGNALS` lines [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:161], while moving the card to `LOADING_LEVELS.ALWAYS` would reprice every invocation at 2.4k tokens [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:308].

## Ruled Out

- Creating a new "shared step reference" file: the card already occupies that role for both paths, and a second document would have to be linked from `SKILL.md`, `ROUTER.md`, two routers and two YAMLs to reach the same readers.
- Putting the card in `LOADING_LEVELS.ALWAYS`: it is a one-line change but it charges every invocation, including read-only turns, for a step that only matters when a plan is written.

## Dead Ends

- "The card is already loaded on every write because `SKILL.md` says so": the machine router's score threshold disproves it. The claim is a routing intention, not a load guarantee, and the fallback path carries a checklist instead of the card.
- "A new card section is enough": it is enough to instruct, and not enough to change behavior for a model that never opens the card under the fallback branch.

## Edge Cases

- Contradictory evidence: `ROUTER.md` §1 line 27 says every write request reaches the skill and its keyword table has no write verbs. Both are recorded; the machine table is treated as authoritative because it is the executable projection.
- Ambiguous input: "shared step reference" was read as a document that carries one step both paths execute, not as a template both paths copy.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/SKILL.md:94`, `:95`
- `.skilled/skills/system-spec-kit/ROUTER.md:27`, `:161-183`, `:308`, `:373`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:36-39`, `:206-207`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md:16`
- `.skilled/commands/speckit/plan.md:106`, `.skilled/commands/speckit/implement.md:92`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:312`, `speckit-implement.yaml:288`

## Assessment

- New information ratio: 0.85
- Questions addressed: For each candidate mechanism, what it costs and what it breaks — the shared-step-reference branch.
- Questions answered: none fully; the mechanism branch is established, the cross-mechanism ranking is later.
- Novelty justification: the keyword gap against the router's own prose promise is new and decisive; the card's existence as a shared surface was half-known from the command routers.

## Reflection

- What worked and why: checking the machine `INTENT_SIGNALS` against the prose claim found the load gap in one read. A prose-only reading of `ROUTER.md` would have concluded the card loads on every write and the mechanism was free.
- What did not work and why: assuming the card's role was to carry checks. It carries authoring steps with human-run verifications; its Bounds block rules out enforcement, so it can host a step but never a gate.
- What I would do differently: read the fallback branch before the intent list on any future router question, because the fallback is where a promised load silently becomes a checklist.

## Recommended Next Focus

Mechanism C: hook injection at prompt or tool time — which of the seven runtimes can carry it, what the injection contract says each channel can do ([SYS], [MSG], [BLOCK]), and whether a hook can fire on a write rather than a prompt.
