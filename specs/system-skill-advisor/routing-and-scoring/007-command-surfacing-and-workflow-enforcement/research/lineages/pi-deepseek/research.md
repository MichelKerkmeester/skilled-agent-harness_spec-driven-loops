# Research: Command Surfacing and Workflow Enforcement (pi-deepseek lineage)

Lineage `pi-deepseek` of the `/deep:research:auto` three-lineage fan-out for packet `007-command-surfacing-and-workflow-enforcement`. Ten iterations, `stopPolicy: max-iterations`, executor `cli-pi` / `deepseek-v4.1-flash-1017`. Every claim below is grounded in a repository citation carried from the iteration files; where a claim is a judgement it is marked as one.

---

## 1. EXECUTIVE SUMMARY

The advisor can already name commands. What it cannot do is *mean* them. Four independent gaps stack:

1. **Inventory.** `.skilled/commands` ships 45 commands, but the bridge inventory is a sum of three hand-maintained sources plus a fourth activation list, yielding 62 entries over 43 command strings, 5 unbridged commands, 3 dead bridge ids, and 22 commands with no TypeScript-enabled bridge.
2. **Scoring.** Command projections key on slash strings only; plain prose reaches a command id through 8 hand-written phrase rows covering 3 command families. A typed slash command is *programmed* to rank its owner skill above its own bridge (`.deep:research` → skill 1.6, bridge 0.45).
3. **Contract.** The public `advisor_recommend` object is strict and carries no `kind`, no runnable string, and no policy; the brief has two sentence forms, both saying "use {label}"; runnable strings exist only for doctor bridges.
4. **Enforcement.** The brief is contractually advisory and fail-open, so it can surface but not bind; the binding surface is a single always-loaded document (`AGENTS.md`), whose only command sentence today is a tiebreaker, and at least one runtime documents its dynamic delivery as dormant.

The recommended design is deliberately small: extend the existing bridge inventory with a risk field and an owner skill, extend the strict response with `kind`, `command`, `policy` and `ownerSkillId`, render one command clause inside the existing brief, and add one sentence to Gate 2 that works even when no brief arrives. Measurement extends the doctor corpus shape to all commands and ratchets four metrics, two of which are new names on existing patterns.

---

## 2. PROBLEM AND CONTEXT

The spec records two measured failures: a planning prompt and a research prompt each returned an empty recommendation list [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md:43]. The packet's premise is that the advisor informs the model about skills but not commands, that only `/doctor:*` reaches the model as a runnable line, and that no rule says whether a surfaced command should be run or asked about.

This lineage confirms the premise and adds mechanism: the zero-recommendation result is not a threshold accident but the interaction of (a) disabled bridges for the `/speckit:*` and `/deep:*` families, (b) slash-only keywords on command projections, and (c) a brief with no command syntax.

---

## 3. METHOD AND SOURCES

Ten focused iterations, each writing `iterations/iteration-NNN.md` plus a delta, recorded through the append gateway and reduced by `reduce-state.cjs`. No runtime was executed: the advisor CLI writes cache and database state outside this lineage's write surface, so every claim comes from source, fixtures, corpora and shipped documentation. That is a deliberate containment choice and it is the source of the two carry-forward uncertainties in §14.

Primary sources: `.skilled/skills/system-skill-advisor/runtime` (projection, fusion, lanes, render, schemas, handlers), `runtime/scripts/command-bridges`, `.skilled/commands` (45 files and `doctor/_routes.yaml`), three `command-metadata.json` hubs, `runtime/scripts/routing-accuracy` corpora and baseline, `AGENTS.md`, `.skilled/repo-rules/blast-radius.md`, `.skilled/skills/system-skill-advisor/hooks`, the seven runtime mirrors, and `.cursor/rules/skill-routing.md`.

---

## 4. COMMAND INVENTORY (angle 1)

- 45 command files: 13 `create`, 3 `deep`, 3 `design`, 17 `doctor`, 1 `local-skilled-alignment`, 1 `prompt`, 7 `speckit`. A recursive count reports 90 because `doctor/scripts/tests/fixtures/**` mimics command folders [SOURCE: .skilled/commands/speckit/plan.md:1].
- The bridge inventory = 19 metadata entries (from three hubs) + 8 allow-list entries + 35 doctor routes = 62 entries over 43 command strings [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1].
- 5 shipped commands have no bridge under their own name: `/local-skilled-alignment`, `/prompt:improve`, `/speckit:handoff`, `/speckit:save`, `/speckit:search` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:51].
- 3 bridge ids have no command: `/memory:save`, `/prompt`, `/spec_kit`, the last kept "for one-release compatibility" [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:37].
- 22 commands have no TypeScript-enabled bridge — 11 `/create:*`, all 3 `/deep:*`, all 3 `/design:*`, `/prompt`, and 4 `/speckit:*` (`plan`, `implement`, `complete`, `resume`). Activation is a fourth hand-maintained file, `scoring-compatibility.json` (40 TS / 50 Python) [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:1].
- Ten command strings carry multiple bridge ids, all doctor routes: `/doctor:skill-advisor` has six. Bridge ids are finer than commands, so a per-id recommendation cannot become a per-command contract without a grouping key [SOURCE: .skilled/commands/doctor/_routes.yaml:1].

**Drift-proof inventory requirement.** One generated source, one activation list, and generated fences everywhere a copy exists. `_routes.yaml` already demonstrates the pattern: the deriver turns routes into bridges, validates `lead_phrases` against `trigger_phrases`, and the Cursor rule shows a generated fence for Gate 1 pointers [SOURCE: .skilled/commands/doctor/_routes.yaml:27].

---

## 5. SCORING MECHANICS (angle 2)

- The TS scorer holds 5 hand-authored plus 62 generated command projections: 40 `routingEnabled: true`, 22 `false` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:78].
- Command keywords are slash strings: `command-spec-kit` declares exactly `/speckit:plan`, `/speckit:resume`, `/deep:research`, `/deep:review` as keywords and intent signals, so prose has nothing to match [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:87].
- Prose reaches a command id only via 8 `PHRASE_BOOSTS` rows covering `create:agent`, `create:manual-testing-playbook` and `memory:save` — 3 of 45 commands [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:169].
- Typed slashes rank the skill first: `/deep:research` → `system-deep-loop 1.6` + `command-spec-kit 0.45`; `/speckit:resume` → `system-spec-kit 0.9` + `command-spec-kit 0.75`; and `/speckit:resume` penalises the bridge at -1.0 [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:97].
- The read-only/mutating gate is a 0.57 confidence cliff on one boolean: a gated command sits at 0.25 and an allowed read-only command at 0.82 [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:183].
- Only 15 of 62 projections are `readOnly`, all doctor; lane weights make prose command recall ride a 0.28 lane against a 0.42 explicit lane [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:10].

There is no "no-slash penalty" constant. The effect the spec describes is an absent plain-language key plus a slash-only boost table.

---

## 6. OUTPUT CONTRACT (angle 3)

- The public recommendation schema is strict and closed: `skillId`, `score`, `confidence`, `uncertainty`, `dominantLane`, optional `laneBreakdown`, `why_recommended`, `matchedDocs`, `redirectFrom`, `redirectTo`, `heldBelow`, `status`, `workflowMode`, `compiledRoute`. No `kind`, no runnable command [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:294].
- The brief has two forms and a fallback: `Advisor: {freshness}; use {label} c/u pass.` and `Advisor: {freshness}; ambiguous: {label} c/u vs {label} c/u pass.` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:567]. Neither says run, and neither asks.
- Runnable strings exist only for `command-doctor-*` ids, from a 35-entry generated map; the `Also:` companion line is doctor-only [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:228].
- Caps are 80 tokens (120 ambiguous, 120 max) at 4 chars/token, but the 218-character directive rides *outside* the cap, so the emitted brief can reach ~134 tokens (174 ambiguous) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:99]. A typical head is 50 characters (~13 tokens), so one command clause fits without a cap change.

**Contract addition (4 fields):** `kind: 'command' | 'skill'`, `command` (runnable string), `policy: 'run' | 'ask'`, `ownerSkillId`. Brief form: `use {skill} → {command} ({policy})`.

---

## 7. RUN-OR-ASK POLICY (angle 4)

- Frontmatter cannot discriminate risk: all 45 commands declare `Bash`; 33 declare `Write`/`Edit`; the 12 that declare neither still mutate through shell [SOURCE: .skilled/commands/doctor/install.md:1].
- 25 of 45 already accept `[:auto|:confirm]` in `argument-hint`; the 20 that do not are the 17 doctor commands plus `/speckit:handoff`, `/speckit:save`, `/speckit:search`.
- `doctor/_routes.yaml` declares `mutating: read-only | add-only | mutates` plus `gate3_location` per route: 15 read-only, 2 add-only, 18 mutates across 33 routes and 2 mcp subroutes [SOURCE: .skilled/commands/doctor/_routes.yaml:41].
- Those 15 read-only routes are exactly the 15 `readOnly: true` projections, so `mutating === 'read-only' → readOnly` is verified end to end [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:305].
- No non-doctor metadata declares risk, so the flag is starved for 28 commands.
- Names invert the truth: `/doctor:install` is `guide:read-only`; `/doctor:env` is `mutates`.
- The repository already owns the vocabulary: a three-tier reversibility ladder where only irreversible steps need a written rollback and a yes, and an install still waits [SOURCE: .skilled/repo-rules/blast-radius.md:47].

**Policy location:** in command metadata (`mutating` + write target), mapped onto the ladder: `read-only`/`add-only` → run, `mutates` → ask, plus ask for out-of-repo effects and multi-hour model budgets.

---

## 8. INVOCATION MECHANICS (angle 5)

- Every runtime except Devin mirrors the commands: `.claude/commands` 45, `.opencode/commands` symlinked groups, `.cursor/commands` 46, `.codex/prompts` 45, `.pi/prompts` 46, `.dsh/prompts` 45; `.devin` has no command surface [SOURCE: .opencode/commands/create:1].
- Seven brief adapters exist (claude, codex, cursor, devin, dsh, opencode, pi) across four transports, all fed by one renderer; the hook reference documents six and omits DSH [SOURCE: .skilled/hooks/skill-advisor/dsh/README.md:19].
- No rule instructs a model to *type* a slash command; the only command sentence in `AGENTS.md` makes `command-spec-kit` win a tie [SOURCE: AGENTS.md:90].
- The repository does expect the model to execute a printed entry point — the advisor outage line prints a `node … advisor_recommend` command for the model to run [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:590].

**Answer:** no runtime gives the model a slash-command tool. Two fallbacks: *name it and ask*, or *load the command doc and follow it* (works everywhere, including Devin, because the command and its workflow are repository files).

---

## 9. CHAT-ONLY MECHANISM (angle 6)

- The brief fires on every prompt but is advisory by contract and returns `{}` on failure; it cannot bind [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21].
- `AGENTS.md` is the single always-loaded policy document (root_file, 16 KiB prefix budget, 21 anchors) and there is no per-runtime copy [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:1].
- Skill-to-command pointers exist in exactly one `SKILL.md`; skills load only after routing, so pointers cannot cause discovery [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:294].
- Runner refusal is prose that only fires once the runner is loaded.
- The ruleset already forbids hand-rolling a named workflow (`PLAN-WORKFLOW LOCK`, sk-git rule 16); what it lacks is the discovery step.

**Mechanism (three layers):** the brief surfaces the command and policy; one `AGENTS.md` sentence binds the behaviour to the brief and to a no-brief branch; the command file is the executable body. Rejected: hook enforcement, a new gate, a fifth registry, skill-pointer-only.

---

## 10. SKILL AND COMMAND LINKAGE (angle 7)

- Linkage is carried three incompatible ways: `skill_agent:` (17 doctor commands), metadata `ownerMode` + `choreography` (19), or nothing.
- All 19 choreographies declare a 3-step load through two `SKILL.md` files; 18 of 19 `ownerMode` values resolve. `/create:skill-parent` → `sk-create-skill-parent` has no directory and no `SKILL.md` yet remains in `mode-registry.json`; `/design:extract` → `sk-design-md-generator` names a generator, not an extract mode [SOURCE: .skilled/skills/sk-doc/mode-registry.json:1].
- The command files often bypass the declared path: `create/agent.md` names neither skill, only a presentation contract and a YAML [SOURCE: .skilled/commands/create/agent.md:12]; `/speckit:plan` names two reference cards and two scripts, never `system-spec-kit/SKILL.md` [SOURCE: .skilled/commands/speckit/plan.md:106].
- 27 of 45 command files reference no skill path at all.

**Answer:** a skill recommendation must not imply its command. The sound direction is command-first: the command declares `ownerSkillId` and the advisor surfaces both.

---

## 11. RECOMMENDATIONS

### 11.1 The design, in five changes

1. **Inventory (one source, generated).** Add `mutating: read-only | add-only | mutates` and a write target to every command's metadata; make `derive-command-bridges.cjs` the only writer of the bridge inventory and of the runnable-string map; generate the map for all bridges, not `command-doctor-*` only. Retire `allow-list.json` entries by fixing their sources, and delete the three dead ids.
2. **Scoring.** Give every command projection at least one plain-language intent signal derived from its metadata `userIntent.ownedSignals` (which already exist), so prose can reach a command without a hand-written phrase row. Keep the read-only gate as the only confidence cliff and drive it from `mutating`.
3. **Contract.** Add `kind`, `command`, `policy`, `ownerSkillId` to the response schema and render `use {skill} → {command} ({policy})` inside the existing head cap. Keep the directive outside the cap; do not raise the cap.
4. **Policy.** Derive `policy` from `mutating` mapped onto the reversibility ladder: `read-only`/`add-only` → run; `mutates` → ask; plus ask for out-of-repo effects and long model budgets. No new registry.
5. **Binding.** One `AGENTS.md` Gate 2 sentence: when the brief names a command with policy `run`, execute that command's workflow (load the command doc); when `ask`, offer it and wait; when no brief arrived, ask the advisor first. Generate the pointer block into static rules where they exist (Cursor, inherited by Devin).

### 11.2 Per-command verdict (SC-001)

"Surface" = the advisor should name this command. "Policy" = run without asking, or ask first. `declared` means the route manifest states the risk; `ladder` means the verdict is inferred from the reversibility ladder because no risk data exists, and is therefore a judgement to confirm during planning.

| Command | Surface | Policy | Basis |
|---|---|---|---|
| /create:agent | yes | run | ladder (tracked write) |
| /create:benchmark | yes | run | ladder |
| /create:changelog | yes | run | ladder |
| /create:command | yes | run | ladder |
| /create:diff | yes | run | ladder |
| /create:feature-catalog | yes | run | ladder |
| /create:goal | yes | run | ladder |
| /create:manual-testing-playbook | yes | run | ladder |
| /create:readme | yes | run | ladder |
| /create:repo-rule | yes | run | ladder |
| /create:skill | yes | run | ladder |
| /create:skill-parent | yes | run | ladder (ownerMode dangling) |
| /create:with-human-voice | yes | run | ladder |
| /deep:ai-council | yes | ask | ladder (multi-model budget) |
| /deep:research | yes | ask | ladder (spawns CLIs, up to 120 min) |
| /deep:review | yes | ask | ladder (multi-iteration budget) |
| /design:chart | yes | run | ladder |
| /design:diagram | yes | run | ladder |
| /design:extract | yes | ask | ladder (live URL, out-of-repo writes) |
| /doctor:agents-md | yes | ask | declared (embed/restore mutate) |
| /doctor:ci | yes | ask | declared (scaffold/toggle mutate) |
| /doctor:deep-loop | yes | run | declared (add-only, scratch) |
| /doctor:env | yes | ask | declared (mutates) |
| /doctor:git | yes | ask | declared (hooks/standards mutate) |
| /doctor:helper | yes | run | declared (read-only) |
| /doctor:install | yes | run | declared (guide read-only) |
| /doctor:mcp | yes | ask | declared (install/debug mutate) |
| /doctor:overlay | yes | ask | declared (apply/repin mutate) |
| /doctor:runtime-mirrors | yes | run | declared (read-only) |
| /doctor:setup | yes | run | declared (read-only) |
| /doctor:sk-code | yes | ask | declared (quality mutates) |
| /doctor:sk-skill | yes | ask | declared (convert mutates) |
| /doctor:skill-advisor | yes | ask | declared (tune/rebuild mutate) |
| /doctor:speckit | yes | run | declared (add-only, scratch) |
| /doctor:symlink | yes | ask | declared (link/unlink mutate) |
| /doctor:update | yes | ask | declared (mutates) |
| /local-skilled-alignment | yes | run | ladder |
| /prompt:improve | yes | run | ladder |
| /speckit:complete | yes | run | ladder (tracked writes) |
| /speckit:handoff | yes | run | ladder |
| /speckit:implement | yes | run | ladder (tracked writes) |
| /speckit:plan | yes | run | ladder (tracked writes) |
| /speckit:resume | yes | run | ladder |
| /speckit:save | yes | run | ladder |
| /speckit:search | yes | run | ladder (read-only) |

Tally: 45 surfaced, 30 run, 15 ask (11 declared, 4 inferred). Five of the 45 need a bridge entry before they can surface at all, and 22 need TypeScript activation.

### 11.3 Sequencing

Inventory and metadata first (it unblocks scoring, contract and policy), then the schema and renderer, then the `AGENTS.md` sentence, then the corpus extension. Doing the contract before the inventory would ship a field with no data behind 28 of 45 commands.

---

## 12. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Raise the brief token cap to fit command lines | The routing head uses ~13 of 80 tokens; the only overrun is a 218-character directive appended outside the cap | render.ts:99, :569 | 3 |
| Emit a command only for command-owner skills (doctor companion path) | The companion path exists only for doctor strings; 28 commands have none | render.ts:507 | 3, 5 |
| Derive risk from `allowed-tools` | `Bash` is declared by all 45 commands, so the signal is constant | all 45 frontmatters | 4 |
| Derive risk from the command name | `/doctor:install` is read-only; `/doctor:env` mutates | _routes.yaml:707 | 4 |
| Enforce commands at the hook layer | The brief contract is advisory, fail-open, `{}` on failure | skill-advisor-hook.md:21 | 6 |
| Add a fifth command registry or a new gate | Four hand-maintained sources already drift; Gate 2 already occupies the per-turn slot | generated.json counts, AGENTS.md:63 | 4, 6 |
| Rely on skill-to-command pointers for discovery | One `SKILL.md` has a pointer; skills load after routing | deep-research SKILL.md:294 | 6, 7 |
| Search for a "no-slash penalty" constant | None exists; the effect is an absent prose key plus a slash-only boost table | explicit.ts:87-101 | 2 |
| Count commands with a recursive find | Fixture folders double the count to 90 | commands/doctor/scripts/tests/fixtures | 1 |
| Treat the 62 bridge entries as 62 commands | Over-counts doctor subcommands, under-counts 5 unbridged commands | generated.json | 1 |
| Infer a command from a skill recommendation | 13 skills have no pointer; 27 commands have no skill pointer; one ownerMode dangles | mode-registry.json | 7 |
| Depend on hook delivery for parity | Cursor documents its dynamic adapter as dormant under the tested build | .cursor/rules/skill-routing.md:18 | 9 |
| A separate command loop-breaker subsystem | The cycle is one command calling the advisor; a depth counter at the brief boundary suffices | _routes.yaml:110 | 10 |

---

## 13. DIVERGENCE MAP

No divergent-mode pivots were recorded: `convergenceMode: default`, `stopPolicy: max-iterations`, and each iteration opened a distinct angle rather than a competing hypothesis.

- Saturated directions: none. Ten angles, ten distinct evidence surfaces.
- Pivots taken: one implicit pivot — the "no-slash penalty" hypothesis was abandoned in iteration 2 for an absent-key explanation, after two greps found no such constant.
- Pivot failures: none.
- Audited overrides: none.
- Remaining frontier: the two carry-forward uncertainties in §14, and the 28 command policies that are ladder-inferred rather than declared.

---

## 14. OPEN QUESTIONS

1. **Do the 17 doctor YAML workflows load the `skill_agent` skill their router names?** Not verified; the router files and the `_routes.yaml` manifest were read, the YAML assets were not.
2. **Is the advisor brief actually delivered in dispatched child sessions on each runtime?** The advisor path has no `isChildSession` gate while the spec gate does, but no runtime was executed here, so delivery is inferred from source.
3. **Which command should own `/prompt:improve` and `/speckit:save`?** The allow-list reasons name `system-spec-kit` for memory save and `sk-prompt` for `/prompt`; the command files themselves carry no owner metadata.
4. **Should `workflowMode` be the carrier for command identity?** It is the only command-adjacent public field, but it names hub modes; the recommendation adds a separate `command` field instead.

## 15. CARRY-FORWARD UNCERTAINTIES

- **Q1's strategy tick.** The inventory question is answered in §4, but the reducer-managed box in `deep-research-strategy.md` remains unticked: its three clauses were answered across iterations 1, 4 and 8 rather than in a single record, and the lineage reached its 10-iteration cap before a record could carry the exact question text. Treat §4 as the answer and reconcile the box during the merge.
- **Policy inference.** 28 of 45 run-or-ask verdicts are ladder inferences; they need confirmation when the metadata field is authored, not before.
- **Spec writeback skipped.** `step_writeback_spec_findings` would edit the packet's `spec.md`, which lies outside this lineage's write surface. The synthesis is delivered here instead and the writeback belongs to the merged run.

## 16. CONVERGENCE REPORT

- Stop reason: `maxIterationsReached`
- Total iterations: 10 of 10
- Questions answered: 8 of 9 ticked; Q1 answered in §4 with the tick reconciliation noted in §15
- Remaining questions: 0 of the ten research angles unaddressed; 4 open questions recorded in §14
- New-information ratio: 1.00 per iteration (mean 1.00), threshold 0.05 never approached — every iteration opened a distinct evidence surface, so the low threshold was telemetry only as the dispatch instructed
- Last 3 iteration summaries: iteration 8 measurement (1.00), iteration 9 prior art (1.00), iteration 10 failure modes (1.00)
- Divergence summary: no pivots recorded; one hypothesis abandoned (no-slash penalty)

## 17. REFERENCES

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/{projection,fusion,lane-registry,scoring-constants,lanes/explicit}.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/{command-bridges.generated.json,allow-list.json,scoring-compatibility.json,derive-command-bridges.cjs}`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`, `runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/{doctor,labeled,holdout,ambiguity}-prompts.jsonl`, `scorer-eval-baseline.json`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, `.skilled/hooks/skill-advisor/dsh/README.md`
- `.skilled/commands` (45 files, `doctor/_routes.yaml`), `.skilled/skills/{sk-doc,sk-design,system-deep-loop}/command-metadata.json`
- `AGENTS.md`, `.skilled/repo-rules/blast-radius.md`, `.cursor/rules/skill-routing.md`, `.skilled/commands/doctor/assets/agents-md-manifest.json`
- Runtime mirrors: `.claude`, `.opencode`, `.codex`, `.pi`, `.cursor`, `.devin`, `.dsh`
- Packet: `specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md`
- Iteration files: `research/lineages/pi-deepseek/iterations/iteration-001.md` … `iteration-010.md`
