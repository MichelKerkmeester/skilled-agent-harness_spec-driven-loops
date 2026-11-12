# Command Surfacing and Chat-Only Workflow Enforcement: Research Synthesis

> Lineage: `opencode-deepseek` | Iterations: 10 | Stop reason: `maxIterationsReached` | Executor: `cli-opencode` / `opencode-go/deepseek-v4.1-flash`

---

## 1. Executive Summary

The repository has two command-routing systems that do not meet. The command tree, the hub metadata and the module registries already describe every command and its owning mode. The advisor, however, scores skills and only renders a runnable command for the 17 `/doctor:*` routers. Every other command either arrives as a raw bridge id, is inactive in the TypeScript scorer, or never reaches the model. A plain-chat planning or research prompt returns zero recommendations at the shipped 0.8 threshold, so the user's request is answered by a hand-rolled workflow even when a command owns it.

The research supports a single recommendation with three parts:

1. Build one command inventory from the command tree and the hub `mode-registry.json` files, with a completeness gate and a `safetyClass` per command.
2. Extend the recommendation payload and brief with `kind`, `command`, `policy` and `ownerSkillId`; keep the existing 80/120 token budget and render the command for every family, not only doctor.
3. Put the enforcement sentence in `AGENTS.md` Gate 2, where every runtime reads it, and keep the command document as the executable workflow body. No runtime exposes a model-callable slash command, so the model either loads and follows the command document or asks the user to type the command.

No change is recommended to how skills are scored against each other. Every finding below cites repository code or measured advisor output; the external prior art is cited to its official documentation.

---

## 2. Method and Scope

The run executed ten iterations, one per research angle in `spec.md` section 3, under `/deep:research` with stop policy `max-iterations`. Each iteration read state, performed focused repository research (and, for angle 9, official public documentation), wrote an iteration narrative and a delta, recorded one canonical iteration record through the append gateway, and let the reducer refresh strategy, registry and dashboard. The artifact root is the lineage directory `specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/opencode-deepseek/`. No file outside that directory was modified.

The measured advisor runs used `node .skilled/bin/skill-advisor.cjs advisor_recommend` and the brief producer `buildSkillAdvisorBrief` on 2026-11-12 in this worktree. Where an angle needed a candidate field the CLI hides, the run used `options.confidenceThreshold: 0` and `includeAttribution: true`; those runs are evidence of the candidate set, not of the shipped behavior. The shipped behavior is the default-threshold run.

---

## 3. Angle 1: Inventory Drift

The live command surface is 45 markdown files: 44 grouped commands (13 `/create:*`, 3 `/deep:*`, 3 `/design:*`, 17 `/doctor:*`, 1 `/prompt:*`, 7 `/speckit:*`) plus the loose `local-skilled-alignment.md`. Only 19 of those commands appear in a `command-metadata.json`, because only three hubs publish metadata: `system-deep-loop` (3), `sk-design` (3) and `sk-doc` (13). [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:1] [SOURCE: .skilled/skills/sk-doc/command-metadata.json:1]

The generated bridge projection holds 62 entries from 19 metadata rows, 8 allow-list rows and 35 doctor routes, collapsing to 43 distinct command spellings. Four live grouped commands have no generated bridge: `/prompt:improve`, `/speckit:handoff`, `/speckit:save` and `/speckit:search`. Three generated bridges name non-live spellings: `/spec_kit` (deprecated), `/memory:save` (legacy key) and `/prompt` (legacy name for `/prompt:improve`). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:35]

Activation is platform-specific and much narrower than the projection: 40 entries are active for TypeScript and 50 for Python. Twenty-two entries are TypeScript-inactive, including every `/deep:*`, every `/design:*`, 11 of 13 `/create:*` commands, and `/speckit:plan`, `/speckit:complete`, `/speckit:implement` and `/speckit:resume`. This is the direct mechanism behind the observation that only doctor commands surface as runnable lines. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:9]

A drift-proof inventory needs one command-tree-derived registry with a completeness gate: every command file must either carry owner metadata or have a written allow-list justification, and a bridge whose command spelling is absent from the tree must fail validation. The current deriver reads three independent inputs and never compares them to the live tree. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:21]

**Recommendation R1.** Build the inventory from `.skilled/commands` plus each hub's `mode-registry.json`, and make the deriver fail when a live command is missing from both. Keep `allow-list.json` only for commands whose owner hub genuinely has no metadata, and make every entry expire with the command file.

---

## 4. Angle 2: Scoring

The shipped confidence threshold is 0.8 with a 0.35 uncertainty ceiling. For `plan a new feature for the login page` the complete candidate set is `sk-doc` 0.6202, `sk-code` 0.5923 and `system-spec-kit` 0.5887, so every candidate fails and the recommendation list is empty. For `research how our retrieval scoring works in depth` the candidates are `system-spec-kit` 0.5874, `cli-external-orchestration` 0.5759 and `sk-prompt` 0.5747; `command-deep-research` never enters the race because it is projected with `routingEnabled: false` and empty keywords, domains and intent signals. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:9] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1061]

A typed `/speckit:plan` prompt returns `command-spec-kit` and `system-spec-kit` at 0.82, but the bridge's entire keyword set is four slash markers (`/speckit:plan`, `/speckit:resume`, `/deep:research`, `/deep:review`). It has no plain-language planning phrase. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:3]

The no-slash penalty is a rank-only `-0.08` on command-kind candidates when the prompt contains no `/`. It cannot create a recommendation from a failing candidate; its effect is to push commands below skills when both are already close. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1197]

The mutating-command gate lives in `readOnlyRouteAllowed`: a command is lifted off the read-only explainer floor only when `skill.readOnly === true` and a keyword matches. The deriver sets that flag only for routes whose manifest value is `mutating === 'read-only'`, so add-only and mutating commands stay gated. The gate's recall cost is measurable: `show me the plan for the login page` returns zero; its precision gain is also visible: `run the planning workflow for a new login feature` returns `sk-doc`, `cli-external-orchestration` and `sk-code` at 0.82 instead of the planning command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:686] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:305]

**Recommendation R2.** Do not lower the threshold. Give every command a small set of plain-language intent phrases derived from its metadata `userIntent.ownedSignals` and `discriminator.whenToUse`, and score commands in the same lanes as skills. Keep the no-slash penalty as a tie-breaker only, and add a command-vs-owner-skill precedence rule (see R6).

---

## 5. Angle 3: Output Contract

The brief budget is 80 tokens by default and 120 when ambiguous, hard-capped at 120, with a 4-characters-per-token estimate; the fixed comment-hygiene block is appended after the capped head. The actionable brief has one shape: `Advisor: live; use <label> <confidence>/<uncertainty> pass.` plus an optional `Also: <doctor runnable>`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:541]

Doctor bridges render through a generated 35-entry id-to-runnable map; measured briefs rendered `/doctor:env list` and `/doctor:git hooks`. For every non-doctor command the label falls back to `metadataSkillLabel(result) ?? top.skill`, so a literal `/speckit:plan` prompt produced `Advisor: live; ambiguous: command-spec-kit 0.82/0.20 vs system-spec-kit 0.82/0.18 pass.` The model sees a bridge id, not a runnable command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:109] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:511]

The recommendation payload has `skillId`, `score`, `confidence`, `uncertainty`, `dominantLane` and `status`, plus optional `workflowMode` and diagnostics, but no `kind`, no `runnable` and no `argumentHint`. A renderer cannot ask the payload whether a recommendation is a command or whether starting it is safe. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:295]

A model needs four facts to act on a command: a runnable invocation string (command plus mode and required arguments), a discriminator against the skill that also passed, a run-or-ask verdict, and a one-line consequence or undo note. The current brief supplies only the label and two scores. The budget is not the blocker: the measured ambiguous head is about 86 characters, the directive block about 205, and a generic `Also: /speckit:plan <feature>` line is under 40, all inside the 480-character ambiguous budget. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:185]

**Recommendation R3.** Add `kind`, `command`, `policy` and `ownerSkillId` to the recommendation payload. Render `use <skill> → <command> (<policy>)` as the top line when a command wins, and `Also: <command> (<policy>)` beside a passing skill. Keep the consequence note optional and last so the line fits the cap.

---

## 6. Angle 4: Run or Ask

The doctor route manifest is the only command set with an explicit mutation class: 16 `read-only`, 3 `add-only` and 22 `mutates`, each with a `gate3_location` naming what it writes. [SOURCE: .skilled/commands/doctor/_routes.yaml:69]

The 19 command-metadata entries carry no mutation or safety field; their schema is command, ownerMode, description, argumentHint, userIntent, choreography and discriminator. Every create command ships `:auto` (no approval prompts) and `:confirm` (pause at each step); deep-research uses `approvals: none` versus `multi_gate`; speckit-plan has both a `step_by_step` branch and an autonomous `approvals: none` branch. [SOURCE: .skilled/skills/sk-doc/command-metadata.json:3] [SOURCE: .skilled/commands/create/README.txt:28] [SOURCE: .skilled/commands/deep/assets/deep-research-confirm.yaml:11]

Gate 3 already implements ask-before-write at framework level: it fires on file writes and excludes read-only review, audit, inspect, explain or analysis, but it acts after the workflow is chosen, not at recommendation time. [SOURCE: AGENTS.md:72]

**Recommendation R4.** Carry a three-class safety map in each command's metadata: `read-only`, `add-only` or `mutating`, plus the write root. Run read-only immediately; run add-only when the target path is explicit and bounded; ask for mutating commands or an unclear target. A typed `:auto` or `:confirm` suffix and an explicit user instruction override the default. Keep Gate 3 as the backstop.

---

## 7. Angle 5: Invocation Mechanics

Six of seven runtimes mirror the command tree into a user-facing slash surface: `.claude/commands` (45 files), `.opencode/commands` (symlinked groups), `.cursor/commands` (46 flat files), `.codex/prompts` (45), `.pi/prompts` (46), `.dsh/prompts` (45). Devin contains agents, hooks, skills and repo-rules but no commands or prompts directory. [SOURCE: .claude/commands:1] [SOURCE: .opencode/commands:1] [SOURCE: .devin/SYNC.md:1]

The command tree defines commands as user-invoked slash commands, each a markdown file with YAML frontmatter and allowed tools. Gate 2 tells the model to use the brief or the advisor CLI and emit `SKILL ROUTING`; Gate 4 names `command-spec-kit` only as a tiebreak. No model-facing rule instructs the model to type a slash command. [SOURCE: .skilled/commands/README.txt:19] [SOURCE: AGENTS.md:63] [SOURCE: AGENTS.md:90]

The one model-executable precedent is the advisor outage fallback, which prints a shell command for the model to run. The precedent covers a shell entry point, not a slash command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:590]

A command file is a thin router over repository markdown and YAML, so a model that can read files and run tools can execute its workflow without runtime slash expansion. [SOURCE: .skilled/commands/doctor/skill-advisor.md:12]

**Recommendation R5.** Treat invocation as two fallbacks, chosen by intent rather than runtime: (a) name the command and ask the user to type it; (b) load the command document and follow its workflow. (b) works on all seven runtimes including Devin; (a) requires a slash surface. The brief must carry the command string for either, and the command document must remain a self-contained entry point.

---

## 8. Angle 6: Chat-Only Reach

The hook is advisory and fails open; it never replaces explicit skill loading and never blocks the prompt on an advisor failure. The brief names recommended skills, and only a doctor command appears as a runnable `/doctor:` string. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:43]

Gate 2 tells the model to use the brief or the advisor CLI and emit `SKILL ROUTING`, never to run a command workflow. The ruleset forbids hand-rolling a plan-named workflow but says nothing about discovering that an unnamed command owns the request. [SOURCE: AGENTS.md:69] [SOURCE: AGENTS.md:27]

The brief is silent exactly when a chat-only user needs it: the measured planning and research prompts return zero recommendations. A runner refusal exists only as normative prose in the deep-research skill, which loads after the skill has already been chosen. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md:43] [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:84]

The hub mode registries already bind modes to commands. `sk-doc` records a command for every mode (for example `/create:skill`) and states that a command-bridge mode is "reached only via its command, never advisor-scored"; `system-deep-loop` records `/deep:research` with lexical routing. [SOURCE: .skilled/skills/sk-doc/mode-registry.json:13] [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:45]

**Recommendation R6.** Make the brief carry `command`, `policy` and `ownerSkillId` from the hub registry, and add one sentence to `AGENTS.md` Gate 2: when the brief names a command whose policy is run, load that command document and execute its workflow; when the policy is ask, offer the command and wait. If no brief arrived, ask the advisor CLI before hand-rolling. Reject the hook-only, runner-refusal-only and static-45-command-list alternatives.

---

## 9. Angle 7: Skill and Command Linkage

All 19 metadata-backed commands declare a choreography that loads a mode `SKILL.md`, and every named mode file exists. The executing command routers, however, do not load that mode skill: `/create:skill` and `/deep:research` load a presentation contract and auto or confirm YAML only, and the workflow YAML does not close the gap. [SOURCE: .skilled/commands/create/skill.md:28] [SOURCE: .skilled/commands/deep/research.md:84] [SOURCE: .skilled/commands/create/assets/create-skill-auto.yaml:29]

The 17 doctor commands have no command-metadata and do not load a mode skill; 11 carry a `skill_agent` owner tag, but the routers resolve a target from `_routes.yaml` and load a target YAML. `/prompt:improve` is the exception and explicitly loads the `sk-prompt` skill. [SOURCE: .skilled/commands/doctor/skill-advisor.md:6] [SOURCE: .skilled/commands/prompt/improve.md:83]

Nine skills have no dedicated command front door: `cli-classifier`, `cli-external-orchestration`, `cli-orca`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-git`, `system-skill-advisor` and `system-skilled-doctor`. Four appear only as `skill_agent` owners on doctor diagnostic routers. [SOURCE: .skilled/commands/doctor/git.md:6]

**Recommendation R7.** A skill recommendation should imply a command only when the selected mode's registry entry records a `command`, as `sk-doc` and `system-deep-loop` do. Do not fabricate commands for the nine skills without a front door. Surface the command beside the skill; never replace the skill with it, because `sk-doc` routes its modes by hub membership and treats the command as an alternative surface.

---

## 10. Angle 8: Measurement

The labeled corpus has 195 rows across `true_write` 32, `true_read_only` 31, `memory_save_resume` 32, `mixed_ambiguous` 32, `deep_loop_prompts` 36 and `skill_routing_prompts` 32. None is keyed to the six command groups. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1]

The calibration baseline covers 200 rows with Brier 0.204829 and expected calibration error 0.138314; it measures skill confidence quality, not command surfacing. The release gate is skill-level: `holdoutTop1`, per-skill accuracy and UNKNOWN counts. [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:496]

The existing command tests are inventory tests: `command-metadata-e2e` asserts projection and file existence, and `command-bridge-resolution-guard` asserts bridge slash ids resolve. Neither measures what a prompt returns. The doctor family alone has a behavior proof, `doctor-phrase-reach.cjs`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts:52] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts:1]

**Recommendation R8.** Add a separate command-routing harness (not the calibration corpus). For each of the six groups, add three rows: a plain-chat recall row, a near-miss discrimination row, and a read-only or refusal row that must not start a mutating command. Add chat-only, partial-slash, quoted-slash and child-session variants. Report `commandRecall@1`, `commandPrecision`, `unsafeRunRate`, `askRecall`, `askPrecision`, `skillCommandAgreement` and `childAutoStartRate`.

---

## 11. Angle 9: Prior Art

Claude Code presents one skill surface with two invocation paths: "Claude uses skills when relevant, or you can invoke one directly with `/skill-name`." The model-invoked path is the default. [SOURCE: https://code.claude.com/docs/en/skills]

Claude Code exposes run-or-ask as skill frontmatter: `disable-model-invocation: true` prevents automatic loading for side-effect workflows, and `user-invocable: false` hides a skill from the user while keeping it model-invocable. The Agent SDK documentation states the distinction directly: skills are model-invoked, and the same skill is user-invoked when dispatched with `/<name>`. [SOURCE: https://code.claude.com/docs/en/agent-sdk/skills]

Claude Code has merged custom commands into skills; existing `.claude/commands` files keep working. Codex has deprecated custom prompts in favor of skills: "Custom prompts are deprecated. Use skills for reusable instructions that Codex can invoke explicitly or implicitly." Custom prompts required explicit invocation and were not repository-shared. [SOURCE: https://developers.openai.com/codex/custom-prompts]

Codex's durable instruction layer is `AGENTS.md`, described as persistent project guidance for every session. The ChatGPT desktop app lists skills in the slash menu and exposes custom prompts as `/prompts:<name>`. [SOURCE: https://developers.openai.com/codex/guides/agents-md] [SOURCE: https://developers.openai.com/codex/reference/slash-commands]

**Recommendation R9.** Mirror the platform pattern: command metadata carries an invocation policy equivalent to `disable-model-invocation`, the command document is the workflow body, and the brief only names the command and its policy. Host frontmatter cannot be the mechanism because only one of seven runtimes reads it.

---

## 12. Angle 10: Failure Modes

Command-versus-skill ambiguity is by construction for non-doctor commands: `/speckit:plan` returns `command-spec-kit` 0.82/0.20 and `system-spec-kit` 0.82/0.18, inside the 0.05 ambiguity margins. Doctor bridges have a precedence rule (typed first, passing bridges after skills, excluded from ambiguity); non-doctor bridges do not. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:914]

A dispatched child session is the highest unsafe-run risk: `AI_SESSION_CHILD=1` pre-resolves Gate 3 and turns stop-for-yes into record-and-continue, so a child with a run brief can start a mutating command with no user to answer. [SOURCE: AGENTS.md:84]

The routing loop risk is partly controlled: Gate 2 fires before every code or Markdown write and command workflows write, while directive dedup suppresses repeated briefs but not repeated routing decisions. The only anti-self-recommendation control is a `-0.25` penalty against the advisor's own ids on audit or explainer prompts. [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:237]

Over-triggering is partly controlled by the `-0.08` no-slash penalty and the read-only gate; the highest over-trigger surface is doctor `lead_phrases`, measured as `disable comment hygiene gate` leading with `/doctor:git hooks`. The brief budget tolerates one command line and one policy marker; a third consequence line competes with the fixed directive block and the ambiguity head inside 120 tokens. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1197] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:48]

**Recommendation R10.** Add a same-owner command-versus-skill precedence rule; limit child authority to read-only or add-only commands and require an explicit parent directive for mutating commands; add a route-once guard per turn and command; keep `lead_phrases` diagnostic-only; order brief lines command, policy, consequence.

---

## 13. The 45-Command Surface and Run-or-Ask Table

Every command below should be surfaced by the advisor when its intent matches. `Run` means the model may load and follow the command document without asking; `Ask` means it offers the command and waits. `:auto` and `:confirm` remain user-selectable overrides. Safety classes for `/doctor:*` come from `_routes.yaml`; classes for the other groups are recommendations from the command's write surface because no metadata field exists yet. [SOURCE: .skilled/commands/doctor/_routes.yaml:69]

| # | Command | Surface | Model action | Basis |
|---|---------|---------|--------------|-------|
| 1 | `/create:agent` | Yes | Ask | scaffolds agent files |
| 2 | `/create:benchmark` | Yes | Ask | writes benchmark package |
| 3 | `/create:changelog` | Yes | Ask | writes global changelog |
| 4 | `/create:command` | Yes | Ask | scaffolds command set |
| 5 | `/create:diff` | Yes | Run | report-only add-only |
| 6 | `/create:feature-catalog` | Yes | Ask | writes catalog package |
| 7 | `/create:goal` | Yes | Ask | writes goal.md |
| 8 | `/create:manual-testing-playbook` | Yes | Ask | writes playbook package |
| 9 | `/create:readme` | Yes | Ask | writes README |
| 10 | `/create:repo-rule` | Yes | Ask | writes repo rule |
| 11 | `/create:skill` | Yes | Ask | writes skill package |
| 12 | `/create:skill-parent` | Yes | Ask | writes parent hub |
| 13 | `/create:with-human-voice` | Yes | Ask | edits prose |
| 14 | `/deep:ai-council` | Yes | Ask | multi-seat cost |
| 15 | `/deep:research` | Yes | Ask | new research packet, executors |
| 16 | `/deep:review` | Yes | Run | bounded review packet |
| 17 | `/design:chart` | Yes | Run | add-only artifact, explicit output |
| 18 | `/design:diagram` | Yes | Run | add-only artifact, explicit output |
| 19 | `/design:extract` | Yes | Run | add-only artifact, explicit output |
| 20 | `/doctor:agents-md` | Yes | Ask | check reads; embed/restore mutate |
| 21 | `/doctor:ci` | Yes | Ask | report reads; scaffold/toggle mutate |
| 22 | `/doctor:deep-loop` | Yes | Run | add-only report |
| 23 | `/doctor:env` | Yes | Ask | mutates environment switch |
| 24 | `/doctor:git` | Yes | Ask | hooks/setup/standards mutate |
| 25 | `/doctor:helper` | Yes | Run | read-only diagnostic |
| 26 | `/doctor:install` | Yes | Ask | install mutates |
| 27 | `/doctor:mcp` | Yes | Ask | install mutates |
| 28 | `/doctor:overlay` | Yes | Ask | apply/repin mutate; status reads |
| 29 | `/doctor:runtime-mirrors` | Yes | Run | read-only diagnostic |
| 30 | `/doctor:setup` | Yes | Run | read-only overview |
| 31 | `/doctor:sk-code` | Yes | Ask | quality mutates; setup reads |
| 32 | `/doctor:sk-skill` | Yes | Ask | convert mutates; check reads |
| 33 | `/doctor:skill-advisor` | Yes | Ask | tune/rebuild mutate; budget reads |
| 34 | `/doctor:speckit` | Yes | Run | add-only report |
| 35 | `/doctor:symlink` | Yes | Ask | link/unlink mutate; check reads |
| 36 | `/doctor:update` | Yes | Ask | update mutates |
| 37 | `/prompt:improve` | Yes | Ask | writes prompt file |
| 38 | `/speckit:complete` | Yes | Ask | writes packet status/docs |
| 39 | `/speckit:handoff` | Yes | Ask | writes handover |
| 40 | `/speckit:implement` | Yes | Ask | writes code |
| 41 | `/speckit:plan` | Yes | Ask | writes spec docs |
| 42 | `/speckit:resume` | Yes | Ask | reads and may write continuity |
| 43 | `/speckit:save` | Yes | Ask | writes continuity |
| 44 | `/speckit:search` | Yes | Run | read-only lexical search |
| 45 | `/local-skilled-alignment` | Yes | Ask | alignment may write |

---

## 14. Consolidated Recommendations

| ID | Recommendation | Primary evidence |
|----|----------------|------------------|
| R1 | Derive one command inventory from the command tree plus hub `mode-registry.json`; fail on missing or retired spellings | `derive-command-bridges.cjs:21`, `command-bridges.generated.json:4` |
| R2 | Add plain-language intent phrases for every command; keep the 0.8 threshold and the no-slash penalty as a tie-breaker | `fusion.ts:1197`, `projection.ts:1061` |
| R3 | Extend the payload and brief with `kind`, `command`, `policy`, `ownerSkillId`; render the command for every family | `advisor-tool-schemas.ts:295`, `render.ts:541` |
| R4 | Carry a three-class safety map and write root; run read-only, run bounded add-only, ask for mutating | `_routes.yaml:69`, `AGENTS.md:72` |
| R5 | Use two invocation fallbacks: ask the user to type the command, or load and follow the command document | `.skilled/commands/README.txt:19`, `render.ts:590` |
| R6 | Make the brief carry the command and add the enforcement sentence to Gate 2, with a no-brief backstop | `mode-registry.json:40`, `AGENTS.md:69` |
| R7 | Imply a command only when the mode registry records one; never fabricate a front door | `mode-registry.json:13`, `command-metadata.json:3` |
| R8 | Add a separate command-routing harness with per-group recall, precision, ask and unsafe-run metrics | `labeled-prompts.jsonl:1`, `advisor-tool-schemas.ts:496` |
| R9 | Mirror the platform pattern: metadata invocation policy, command document as workflow body, brief names the command | `https://code.claude.com/docs/en/skills`, `https://developers.openai.com/codex/custom-prompts` |
| R10 | Add same-owner precedence, child authority scope, route-once guard, diagnostic-only lead phrases, and the command-policy-consequence line order | `fusion.ts:914`, `AGENTS.md:84` |

---

## 15. Eliminated Alternatives

| Alternative | Why eliminated |
|-------------|----------------|
| Lower the confidence threshold | At threshold 0 the planning prompt surfaces `sk-doc`, `sk-code` and `system-spec-kit`, not a command; it amplifies wrong-skill routing. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:9] |
| Raise the brief token cap | The measured briefs fit; the omission is a data-contract gap. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:185] |
| Count generated bridge entries as the inventory | 62 entries include 35 doctor routes and three retired aliases; the live grouped command set is 44 plus one loose file. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4] |
| Treat `allow-list.json` as the fallback inventory | It covers 8 commands, misses four live commands and adds three retired aliases. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:52] |
| A hook-only chat mechanism | The hook is advisory and fails open; it cannot dispatch a command. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21] |
| A runner-refusal-only mechanism | The refusal prose loads after the skill is chosen, too late to prevent the hand-roll. [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:84] |
| A static command list in `AGENTS.md` | 45 commands with modes and arguments would drift and consume the rule budget. [SOURCE: AGENTS.md:69] |
| A blanket command-first tiebreak | The measured `/speckit:plan` skill has lower uncertainty; the rule must be scoped to a command and its owner skill. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:5] |
| Share Claude Code frontmatter as the policy | Only one of seven runtimes reads it; the repository needs its own metadata field. [SOURCE: https://code.claude.com/docs/en/skills] |

---

## 16. Divergence Map

No divergent pivots were taken in this lineage. The investigation stayed on the ten prescribed angles and did not broaden into implementation. Saturated directions: none. Remaining frontier: the measured child-session command start and a command-recall baseline, both listed in Open Questions.

---

## 17. Open Questions and Remaining Uncertainty

- There is no measured command-recall baseline. R8 specifies the harness but this run did not execute it.
- No child session was observed starting a command. The child-authority risk in R10 is derived from `AGENTS.md:84`, not from a transcript.
- The safety class for the 26 non-doctor commands is a recommendation, not a metadata fact; only the doctor manifest carries `mutating` today.
- The per-runtime brief delivery was read from the hook reference and the mirrors, not exercised on Cursor, Devin, Pi or DSH in this run.
- The prior-art review covered Claude Code and Codex official docs; Cursor and Devin docs were not fetched, so the convergence claim is scoped to those two vendors.

---

## 18. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 10
- Questions answered: 10 / 10
- Remaining questions: 0
- Last 3 iteration summaries: run 8: Measurement for command surfacing (0.8); run 9: Prior art from public agent-harness documentation (0.85); run 10: Failure modes and their controls (0.85)
- Convergence threshold: 0.05 (telemetry only; stopPolicy `max-iterations`)
- Divergence summary: no divergent pivots recorded
- Average newInfoRatio: 0.805
- Evidence sources: 78 findings, 55 code citations, 5 external documentation citations, 10 reducer passes, 0 corruption events

---

## References

- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`
- `.skilled/skills/sk-doc/mode-registry.json`
- `.skilled/skills/system-deep-loop/mode-registry.json`
- `.skilled/skills/system-deep-loop/command-metadata.json`
- `.skilled/skills/sk-design/command-metadata.json`
- `.skilled/skills/sk-doc/command-metadata.json`
- `.skilled/commands/README.txt`
- `.skilled/commands/doctor/_routes.yaml`
- `.skilled/commands/create/skill.md`
- `.skilled/commands/deep/research.md`
- `.skilled/commands/doctor/skill-advisor.md`
- `.skilled/commands/prompt/improve.md`
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md`
- `AGENTS.md`
- `specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md`
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/agent-sdk/skills
- https://developers.openai.com/codex/custom-prompts
- https://developers.openai.com/codex/guides/agents-md
- https://developers.openai.com/codex/reference/slash-commands
