# Iteration 004 — Ring 4: everything else that touches a goal

**Focus:** the root instruction surfaces (`AGENTS.md`, `README.md`, `REPO RULES.md`,
`repo-rules/*`), the hook hub and its shared flag layer, the env rosters, the
feature catalogues and manual-testing playbooks across `system-spec-kit`,
`system-skill-advisor` and `cli-external-orchestration`, the per-CLI goal-hook
playbooks, template/scaffold metadata, retrieval conventions, and the
dist-vs-src question left by ring 3.

**Method:** targeted vocabulary sweep over the live tree (excluding `specs/`,
`barter/`, `.worktrees/` and other checkouts) for goal-system terms
(`goal.md|OPENCODE_GOAL|opencode_goal|/goal-*|goal-slice|goalDurableBudget|active_goal|...`),
then reading every hit that is actually about the goal system, plus the paths
named by the four questions ring 3 handed over. Every claim below was read in
the file named at the cited line.

**Prior rings kept:** rings 1–3 in full, including the R1-F7 correction in ring 2
and ring 3's six-way budget contradiction. Ring 4 widens to every remaining
surface and resolves ring 3's four open questions; it narrows nothing.

**Deviation, unchanged:** the append gateway (`append-mode-event.cjs`) writes
under the spec folder, outside this lineage's bound write surface, so state
records are appended to the in-lineage `deep-research-state.jsonl` in the shape
the gateway would produce (recorded in `deep-research-config.json` `deviations`
and in the state log).

---

## 1. What exists in this ring, by path

Swept and confirmed *not* about the goal system (generic use of the word "goal",
recorded so ring 5 can exclude them honestly): `sk-prompt/SKILL.md:330`,
`sk-prompt/README.md:195`, `sk-prompt/references/patterns-evaluation.md:310`,
`:379`, `:549-555`, `sk-git/SKILL.md:330`, `.opencode/commands/deep/assets/deep-research-presentation.txt:387`
("non-goals"), `.opencode/commands/prompt/assets/prompt_improve_presentation.txt:47`,
`sk-doc/shared/scripts/quick_validate.py:115` (cites `opencode_goal` only as an
example of a non-namespaced tool name), `sk-code/.../security-testing-and-exemptions.md:286`
(cites `OPENCODE_GOAL_DEBUG` as the exemplar of a default-off debug flag — correct,
`.env.example:293`), `mcp-tooling/mcp-click-up/**` (ClickUp's own product
"goals", see R4-F10).

Actually about the goal system, newly read in this ring:

| Surface | Path | Role |
|---|---|---|
| Root posture | `AGENTS.md:291-297`, `:468` | GOAL POSTURE RULE + workflow row |
| Root summary | `README.md:854-866` | public Goal Plugin section |
| Repo rules | `REPO RULES.md`, `repo-rules/*.md` (11 files) | router + rule docs |
| Hook hub | `.opencode/hooks/README.md:24`, `:50`, `:135-142`, `:159`, `:230-240` | concern table + cross-runtime matrix |
| Shared flags | `.opencode/hooks/shared/README.md:23`, `:47`, `:73`, `:88` | resolver + alias bridge |
| Flag test | `.opencode/hooks/shared/hook-flags.test.cjs:38`, `:42` | canonical + alias pins |
| Flag config | `.opencode/hooks/hook-flags.env:25`, `hook-flags.env.example:25` | live vs committed example |
| Env rosters | `.env.example:224`, `:286-306`; `system-spec-kit/runtime/ENV-REFERENCE.md:66-88`, `:328-348` | two rosters |
| Hub rationale | `.opencode/hooks/coverage-rationale.md:80-82` | goal folder rationale |
| Coverage note | `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:52-55`, `:420` | mirrors the plugin's sweep pattern |
| Injection contract | `.opencode/hooks/injection-contract.md` (ring 2) | cadence per runtime |
| Plugins | `.opencode/plugins/README.md:31`, `:82`, `:96-98` | plugin inventory + flag rule |
| State dir | `.opencode/skills/.state/goal/README.md` | state layout contract |
| Commands index | `.opencode/commands/README.txt:51`, `:78`, `:196` | root command roster |
| Deep/prompt assets | `deep-review-auto.yaml:373-376`; `prompt_improve...` | `goal-file-manifest.txt` collision |
| spec-kit refs | `references/config/hook-system.md:97-99`, `references/workflows/quick-reference.md:16-17`, `references/retrieval/retrieval-conventions.md:280-283`, `references/templates/template-guide.md:187`, `references/structure/folder-structure.md:37`, `templates/README.md:108`, `:146`, `templates/EXTENSION-GUIDE.md:46-52` | contract restatements |
| spec-kit code | `create.sh:54`, `:153`, `:283`, `:461`, `:1808`; `utils/template-structure.js:64`, `:202`; `lib/graph/graph-metadata-parser.ts:58`, `:745`; `spec/check-template-staleness.sh:177` | goal.md as scaffold doc |
| spec-kit tests | `scaffold-golden-snapshots.vitest.ts:82`, `:122-141`; `template-version-parity.vitest.ts:78-80`; `spec-doc-structure.vitest.ts:315-365` | goal template + budget coverage |
| Catalogues | `system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md`, `.../feature-catalog.md:780-792`; `system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md` | feature cards |
| Playbooks | `system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md` (454); `system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` (CL-007); `cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md` (CE-P03); `cli-external-orchestration/cli-{claude-code,codex,cursor,devin,opencode,pi}/manual-testing-playbook/goal-hook/goal-hook.md` (CC-029, CU-027, DV-022, CO-039, PI-021) | operator scenarios |
| Advisor metadata | `system-skill-advisor/leaf-aliases.json:129`, `:269`; `leaf-manifest.json:30`, `:58`; `system-spec-kit/leaf-manifest.json:42` | hub-leaf registrations |
| Deep-loop | `system-deep-loop/deep-research/SKILL.md` + playbooks (this lineage's own contract) | harness |

---

## 2. What it actually does

### 2.1 The flag pair has three agreeing authoritative rosters, and two places that teach something else

Three rosters state the same pair — canonical `OPENCODE_GOAL_DISABLED`, alias
`OPENCODE_GOAL_PLUGIN_DISABLED`:

- `.opencode/hooks/README.md:50` — hub concern table, canonical first, state `enabled`, activity `inject / tool`, `wired`.
- `.opencode/hooks/shared/README.md:88` — "Canonical name for `goal` (non-default shape)".
- `system-spec-kit/runtime/ENV-REFERENCE.md:83` — flag with its alias and both source surfaces.

The resolver itself is test-pinned: `hook-flags.test.cjs:38` asserts
`concernFlag("goal") === "OPENCODE_GOAL_DISABLED"`, and the alias-bridge test at
`:42` disables the concern through the legacy name. The hub also enriches the
same concern with the hand-set-name list (`shared/README.md:23`, 21 concerns at
`:47`), so the "derived name" trap is documented — ENV-REFERENCE.md:68 spells it
out: derived names are not written down anywhere and grepping for one finds
nothing by design.

Against that, see R4-F6 (plugins README) and the local-file drift below.

### 2.2 Ring 3's four questions, answered

**Q1 — hub row ownership.** The row is hand-maintained inside
`.opencode/hooks/README.md` (concern table at `:50`, cross-runtime matrix at
`:230-240`, tree at `:135-142`, sibling description at `:24`) and restated
independently in `shared/README.md:88` and `ENV-REFERENCE.md:83`. The three
agree. Nothing generates the hub table from `hook-flags.cjs` — the
`hook-flags.test.cjs` pins are the only mechanical guard, and they guard the
resolver, not the prose. So the same fact exists in three hand-written places;
today they are consistent (answering the drift question negatively), but the
plugins README (R4-F6) shows the shape of the failure when one prose site
invents the rule instead of quoting the pair.

**Q2 — dist vs src.** In step, and freshness-gated. The shipped validator
(`runtime/dist/lib/validation/spec-doc-structure.js:853`, `:858`, `:863`)
contains `isPhaseChildFolder` and `budgetApplies` exactly as the hand-written
`.ts` does, and the dist resolver carries the same `goalDurableBudget`
validation (`dist/lib/templates/level-contract-resolver.js:192-199`).
`validate.sh:26` runs the orchestrator from `dist/`, and `validate.sh:29`
consults `cli/lib/dist-freshness.cjs`, which compares source hashes against
`dist/tsconfig.tsbuildinfo` and reports `STALE_EXIT_CODE = 69`
(`dist-freshness.cjs:clean-room constants`). So ring 3's finding describes what
actually ships, not a source-only state.

**Q3 — root instructions and repo rules.** `REPO RULES.md` and all eleven
`repo-rules/*.md` contain zero goal mentions (verified by sweep). `AGENTS.md`
restates the *posture* in five lines (`:291-297`) and delegates the mechanics
explicitly: "Mechanics (binding, the strip, the budget, the log) are
`system-spec-kit`'s and the goal hook's, not this document's" (`:297`). No
number, flag or channel appears in the rule layer — the budget numbers and the
runtime list live only in `README.md:861-866`. The posture lines are consistent
with the engine contract: "never send its frontmatter to chat, to an objective,
or to an injection path" (`:293`) matches the slice module's boundary, and
"resend the stripped slice in chat unprompted … keep reminding while the goal is
unset" (`:294`) matches `resendPending`'s hash comparison. The single imprecision
is the budget phrasing (R4-F8).

**Q4 — catalogues and playbooks.** Mostly accurate and unusually specific
(verbatim envelopes, field lists, test counts), but this ring found six defects
in them: a wrong resume rule in two catalogues (R4-F1), a stale citation path in
CL-007 (R4-F4), stale suite/test counts in CO-039 (R4-F5), a dead constitutional
citation behind CC-029 and its benchmark evidence (R4-F3), a wrong fresh-state
filename in PI-021 (R4-F9), and an imprecise "why injection-only" reason in
CE-P03 (R4-F11). On the phase-child budget question specifically: the catalogues
and playbooks do **not** describe the budget at all — neither correctly nor
incorrectly — so ring 3's contradiction remains confined to
`validation-rules.md`/`goal-set-string-playbook.md` on one side and the hook on
the other. Both playbooks that exercise the disable path (DV-022, CU-027
"Rollback") teach the alias `OPENCODE_GOAL_PLUGIN_DISABLED=1`.

### 2.3 The playbook fleet is a real, maintained surface — with pinned numbers that already moved

The goal-hook playbooks are specific enough to be executed mechanically:
CO-039 ships a scratch script that imports the shipped plugin and asserts exact
envelopes; PI-021 gives a runnable `pi --extension` invocation; DV-022 gives a
full pipe sequence including the fail-open cases. Running the plugin suites the
CO-039 playbook names reproduces green but not its numbers (R4-F5). The
spec-kit side is better anchored: the goal template is covered by
`scaffold-golden-snapshots.vitest.ts:82` (section markers), `:122-141`
(`--with-goal` scaffold, "not part of the lazy four"), and
`template-version-parity.vitest.ts:78-80` (review/research packets drop
`goal.md`), while `spec-doc-structure.vitest.ts:315-365` tests the budget
measure, the fence variants, the runtime-slice parity, and the tier boundaries.

### 2.4 Two independent flag configs exist per concern, and only one is corrected in the repo

`hook-flags.env.example:25` (committed) carries
`OPENCODE_GOAL_DISABLED=1` — the canonical name. The live
`hook-flags.env:25` carries `SYSTEM_GOAL_DISABLED=1`, a derived-shape name that
matches no concern; `git check-ignore -v` confirms the live file is ignored
(`.gitignore:287`). This downgrades R1-F1: the dead name is **not** shipped,
it is local drift, and the committed example is right. See R4-F6 for the doc
that would still lead an operator to type the dead name.

---

## 3. Where it disagrees with another surface, or with a document

### R4-F1 — `/goal resume` reactivates three statuses in code and two in both catalogues, while the core refuses two of them

- Plugin: `resumeGoal` passes `allowedFrom: ['paused', 'usage_limited', 'budget_limited']`
  (`opencode-goal.js:1952`), and the transition map independently grants
  `usage_limited → active` and `budget_limited → active` (`:165`, `:166`).
- Both catalogues: "`/goal resume` reactivates only `paused` or `usage_limited`
  goals" — `system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md`
  §2 and `system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md`
  §"Tools And Lifecycle".
- Core (`bin/goal.cjs` on Pi/Cursor/Devin): `resumeGoal` throws
  `INVALID_STATUS_TRANSITION` unless `status === 'paused'`
  (`goal-core.cjs:1327`).

So the same verb has three documented/implemented behaviours. The catalogues
under-describe the plugin (a `budget_limited` goal **can** be resumed on
OpenCode), and no document states the core's stricter rule. The core can never
*reach* the two extra statuses (`goal-core.cjs:73` `VALID_STATUSES` is
`active|paused|completed|cleared`), which is why this is a documentation defect
rather than a staged failure — see R4-F2 for why a reader cannot tell that from
the docs.

### R4-F2 — two engines, two incompatible status vocabularies, no mapping anywhere

- Core: `['active', 'paused', 'completed', 'cleared']` (`goal-core.cjs:73`), and
  the engine README documents exactly that set — "Only `active` records inject;
  paused, completed, cleared, missing, malformed, unbound, or legacy-only state
  produces no block" (`README.md:37`).
- Plugin: `['active', 'paused', 'blocked', 'usage_limited', 'budget_limited', 'complete']`
  (`opencode-goal.js:153-160`), and the plugin docs document that set
  (`goal-opencode.md` argument-hint lists the actions; the catalogs and 454's
  expected signals use `complete`, `blocked`, `usage_limited`).

`completed` (core) and `complete` (plugin) name the same operator concept with
different strings, and `cleared`, `blocked`, `usage_limited` and `budget_limited`
are each surface-specific with no cross-reference. `bin/goal.cjs show` therefore
prints `status=completed` where `/goal show` prints `status=complete`, and
nothing in either doc says the other vocabulary exists. This is the class of
divergence a unification pass must decide on (one vocabulary, or a documented
mapping); ring 5 should carry it as such.

### R4-F3 — CC-029 and its benchmark evidence rest on a file that no longer exists

`cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md:34` instructs
the operator to read `.opencode/hooks/goal/README.md` and the `goal_prompting`
block of `speckit-plan.yaml`
(`.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`)
— a sentence whose parenthetical path is dangling and unclosed. That path is
also the declared "Constitutional routing rule" of the benchmark record:
`benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/source.md:13`,
`skill-benchmark-report.md:36`, `skill-benchmark-report.json:34`
(`constitutionalRuleRel`), and `findings-and-recommendations.md:7`.

The file does not exist: `system-spec-kit/` has no `constitutional/` directory
at all, and a name search across the live tree finds only the citations above.
**INFERRED** provenance (not evidence of current behaviour): a
`.git/lost-found/other/` object, dropped by an old `git fsck`, contains the
file's text once — a runtime-specific routing rule about the
`/goal` → `/opencode_goal` rename — so the citation predates a removal.
**What would settle it:** restore the file, or repoint the four citations at
what the sentence actually names, the `goal_prompting` block of
`speckit-plan.yaml` (ring 3 read it at `:141-174`).

### R4-F4 — CL-007's evidence cites a command filename that does not exist

`system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`
cites `.opencode/commands/goal_opencode.md` (underscore) four times — `:123`
(§4 SOURCE FILES), `:185` ("Command file read confirmed … exists"), `:197`,
`:201` — and greps evidence against it. The real file is
`.opencode/commands/goal-opencode.md` (hyphen). Every quoted line **matches the
real file exactly** — `4: allowed-tools`, `15: Manage the passive session goal…`,
`37: This command is state-free…`, `39: - Empty arguments or show…` — so the
evidence is genuine and only the citation path is stale. The playbook's own
sibling feature catalog uses the correct hyphen path in its SOURCE FILES table,
so the two documents in one skill disagree about the filename. The old
underscore spelling survives in benchmark fixtures
(`specs/system-deep-loop/035-command-surface-benchmark/.../goal_opencode.md`),
consistent with a rename that left citations behind.

### R4-F5 — CO-039 pins "seven suites / 125 tests"; the glob matches eight and the suites report 137/137

`cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` §2 says
"[confirm] the 7 `.opencode/plugins/tests/opencode-goal-*.test.cjs` suites
exist" and "the focused suite passes 125/125"; §3 repeats "all seven committed
unit suites". Observed: the glob matches **8** files
(`opencode-goal-{capabilities,continuation,export-contract,lifecycle,render-parity,state,supervisor,tool-path}.test.cjs`)
and `node --test .opencode/plugins/tests/opencode-goal-*.test.cjs` reports
`tests 137 / pass 137 / fail 0` (run in this iteration, 3.7 s). The playbook's
pass criteria ("focused suite passes 125/125") cannot be satisfied as written.
The numbers were presumably correct when written; nothing regenerates them.

### R4-F6 — the plugins README states a kill-switch rule that computes to a dead flag for `goal`

`.opencode/plugins/README.md:96-98` documents the switch model as
"`SYSTEM_HOOKS_DISABLED=1` master; per-concern `SYSTEM_<CONCERN>_DISABLED=1`"
with `SYSTEM_SPEC_GATE_DISABLED` and `SYSTEM_SKILL_ADVISOR_DISABLED` as the
examples, then lists "Legacy / plugin-specific aliases … e.g. …
`OPENCODE_GOAL_PLUGIN_DISABLED`". Applying the stated rule to the goal concern
yields `SYSTEM_GOAL_DISABLED` — the exact dead name sitting in the local
`hook-flags.env:25` (R1-F1, now downgraded). The true model is the inverse:
`goal` is one of the six `CONCERN_CANONICAL` concerns whose canonical name is
hand-set (`shared/README.md:23`, `:88`; `hook-flags.test.cjs:38`), and
`OPENCODE_GOAL_PLUGIN_DISABLED` is the alias, not the legacy curiosity. Three
other rosters state it correctly; this one is the outlier and the one an
operator reads when opening `.opencode/plugins/`.

### R4-F7 — the root README promises injection "on every turn"; Cursor's only delivery is sessionStart

`README.md:861`: "the runtime injects that file's durable slice on every turn
with its frontmatter stripped". True for OpenCode (transform), Pi (`input`), and
Devin (`SessionStart` + `UserPromptSubmit`) — but Cursor registers exactly one
delivery point, `sessionStart` (`.cursor/hooks.json`, generated from
`hook-registry.json:506-547`), and the injection contract states the reason
plainly: "Cursor sessionStart-only (beforeSubmitPrompt never delivers, stop
never fires)" (`injection-contract.md:139-140`). CU-027 describes it correctly
("`sessionStart` payload supplies `session_id`"). The root README is the
public-facing summary and `retrieval-conventions.md:282` deliberately excludes
it from both retrieval lanes, so nothing downstream corrects a reader who takes
"every turn" literally on Cursor.

### R4-F8 — README's "a parent goal" narrows the manifest's scope

`README.md:865`: "a parent goal warns past 3,000 characters and fails past
4,000". The manifest's own scope sentence is "phase parents and top-level
packets; phase children are unbounded" (`spec-kit-docs.json:26`), and the
validator implements it as `level === 'phase' || !isPhaseChildFolder(folder)`
(`spec-doc-structure.ts:1051`). A plain top-level packet is not a "parent goal"
in the phase-parent sense, so the README sentence can read as excluding it. Low
severity (the validator is right regardless), but it is the only budget sentence
in the public README and the only one a reader outside the skill is likely to
meet.

### R4-F9 — PI-021 expects a legacy filename shape for fresh state

PI-021's expected signals: "two opaque `pi-<sha256>.json` files". A fresh scoped
write is `<sha256-of-[workspace,runtime,sessionId]>.json` —
`resolveGoalScope` builds `statePath: join(stateDir, `${scopeKey}.json`)` from
the composite digest (`goal-core.cjs:198-210`). `pi-<sessionDigest>.json` is the
**legacy** adoption name (`legacyScopeKey`, `goal-core.cjs:197`; consumed at
`:212` only when the state dir is the workspace default). An operator validating
PI-021 by looking for `pi-*.json` files after a fresh `set` finds none and could
record a false FAIL; the correct observation is two bare 64-hex filenames.

### R4-F10 — "goal" names four unrelated things in this repository, and no document says so

1. The session-goal system (rings 1–3).
2. Ordinary English/prose: the README "Goal" feature bullet (`README.md:854`),
   `sk-git`'s "Goal" table column (`SKILL.md:330`), prompt templates.
3. `goal-file-manifest.txt` — a deep-review scope manifest parsed as
   repo-relative paths
   (`.opencode/commands/deep/assets/deep-review-auto.yaml:373-376`), also known
   to `recursive-child-manifest.vitest.ts`; documented nowhere else in the live
   tree and unrelated to `goal.md`.
4. ClickUp's product goals
   (`mcp-tooling/mcp-click-up/feature-catalog/mcp-medium-priority/manage-goals.md`,
   which additionally self-declares `Capability status: UNSUPPORTED`).

A reader who greps "goal" gets all four interleaved; nothing in the repo
disambiguates the artifact name from the session-goal vocabulary. Ring 5 should
carry this as a naming hazard for any consolidation pass (e.g. a rename or a
one-line note in the deep-review reference).

### R4-F11 — CE-P03's reason for "injection-only" is wrong about the hooks

`cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md`
§1 says Cursor and Devin "are injection-only because their prompt surfaces do
not receive the hook's native session id". The hooks **do** receive native
identity — `cursor/goal-inject.mjs` uses `payload.session_id` or
`conversation_id` and `devin/goal-inject.mjs` uses `payload.session_id` — and
both write a turn touch (R1-F5). What lacks identity is the *command* surface:
`.cursor/commands/goal-cursor.md` fails closed with
`UNSUPPORTED_SESSION_BINDING` by design, as CU-027 states correctly ("The prompt
command does not receive the hook's current-session identity"). So CE-P03's
causal clause is imprecise in the same direction as the README's
"injection-only" label: it hides that the hook writes and misplaces the reason
from the command to the payload.

---

## 4. What is unreachable, unused, or reads as live but is not

- **`hook-flags.sh` cannot resolve `goal`.** `shared/README.md:72` states the
  POSIX mirror carries no canonical-name overrides or legacy aliases, so
  `hook_enabled goal` would consult the derived `SYSTEM_GOAL_DISABLED`. Live
  consumers (`git-live-follow.sh:161-162`, `check-git-hooks.sh:42`, `:117`,
  `git-primary-reconcile.sh:177`, `worktree-guard.sh`, `session-cleanup.sh`,
  pre-commit) all ask about git/session concerns, so no goal surface is
  affected — latent, not a live defect. Recorded so ring 5 does not re-derive
  it as a bug.
- **`OPENCODE_GOAL_STATE_DIR` and `OPENCODE_GOAL_RUNTIME_LABEL` are absent from
  ENV-REFERENCE.md.** `ENV-REFERENCE.md:328-346` scopes its plugin section to
  plugin-consumed vars, which is why the omission is defensible for the plugin
  (`opencode-goal.js` ignores the state-dir override — R2-F2) — but the roster
  has no home for either live variable: the core reads `OPENCODE_GOAL_STATE_DIR`
  (`goal-core.cjs` `STATE_DIR_ENV`/`resolveStateDir`), and `bin/goal.cjs:394`
  reads `OPENCODE_GOAL_RUNTIME_LABEL`. Both are documented only in
  `.env.example:304-305` and, for the state dir, the engine README. Not a
  contradiction, a roster gap.
- **The dead `SYSTEM_GOAL_DISABLED` line is local-only.** `git check-ignore -v`
  confirms `.opencode/hooks/hook-flags.env` is ignored (`.gitignore:287`), and
  the committed `hook-flags.env.example:25` carries the canonical name. So no
  shipped artifact is wrong; the repo's own guidance explains the trap
  (`ENV-REFERENCE.md:68`), and this is what R1-F1 now reduces to.
- **`coverage-rationale.md:82` and `hooks/README.md:234`** restate the
  Claude/Codex "native host goal command" as the coverage justification; the
  only falsifiable part of that claim in-repo remains ring 2's finding (R2-F8):
  the packet-goal handoff is real and documented
  (`speckit-plan.yaml:200`), the native host command itself is not verifiable
  here — and CC-029 exists precisely to say so, which is why R4-F3 matters.

---

## 5. What a new reader would get wrong

1. **The flag name.** Reading `.opencode/plugins/README.md` yields
   `SYSTEM_GOAL_DISABLED`; reading the env file on disk yields the same dead
   name; the correct pair sits one directory over (R4-F6, R1-F1 downgraded).
2. **What "resume" resumes.** Two catalogues say paused/usage_limited; the
   plugin also resumes budget_limited; the core resumes only paused (R4-F1).
3. **The status vocabulary.** `complete` vs `completed`, plus three
   surface-specific statuses, with no mapping (R4-F2).
4. **Cursor's cadence.** "On every turn" (R4-F7) — it is once per session.
5. **Which command file to read.** CL-007 sends the reader to a filename that
   does not exist (R4-F4).
6. **The Claude boundary's authority.** CC-029 cites a constitutional rule that
   is gone (R4-F3).
7. **Fresh Pi filenames.** The playbook's `pi-<sha256>.json` is the legacy shape
   (R4-F9).
8. **"Injection-only".** Still implies read-only; the playbooks contradict each
   other about whether it means no writes or no command surface (R4-F11, R1-F5).

---

## 6. Ruled out in this iteration

- **`hook-flags.sh` as a live goal defect** — no goal consumer (see §4).
- **The hub matrix `| goal |, by-design:` comma** — the same
  comment-folded rendering appears in every by-design cell of every row
  (`codex-watchdog`, `dist-freshness`, `permission-policy`, `session-lifecycle`),
  so it is the table's convention, not a goal-specific defect.
- **`dispatch-guard.cjs` referencing `opencode-goal.js`** — both mentions are
  explicit "mirroring the goal plugin's pattern" comments about
  sweep/archive/prune tuning (`:52-55`, `:420`); a textual inspiration, not a
  coupling defect.
- **The hook README's "injection-only" vs CU-027's "records a turn touch" as a
  hard contradiction** — CU-027 documents the write, the README omits it; that
  is R1-F5's precision gap, not a second finding.
- **`goal.md` scaffold/metadata surfaces** — `template-structure.js:64`, `:202`,
  `graph-metadata-parser.ts:58`, `check-template-staleness.sh:177`,
  `create.sh` and the template README/EXTENSION-GUIDE rows are all consistent
  with ring 3's lazy-addon finding; no new defect.
- **`goal-file-manifest.txt` as a goal-system artifact** — it is a review-scope
  manifest (R4-F10 item 3), not part of the session-goal system.
- **`repo-rules/*` restating the contract** — zero goal mentions; nothing to
  drift.
- **dist drift** — in step and freshness-gated (Q2).

---

## 7. Open questions handed to ring 5

1. Of the divergences now accumulated (flag naming three ways, resume three
   ways, status vocabularies two ways, "injection-only" three ways, budget scope
   six ways), which are *defects to fix* versus deliberate surface differences
   that need a mapping note? Ring 5 must sort them, not just list them.
2. Which single surface should own each fact after unification — the flag pair
   (currently hub row + shared README + ENV-REFERENCE), the budget numbers
   (manifest + validator + reference + playbook + template banner), the status
   vocabulary (two engines), the runtime support matrix (goal README + hub
   matrix + coverage-rationale + README + PLAN yaml + dev `dispatch_by_runtime`)?
3. The playbook numbers (suites/tests) and citations (goal_opencode.md,
   constitutional rule) rot silently because nothing regenerates or validates
   them. Is a machine check warranted (e.g. extend the offer-contract test to
   assert paths and counts), and which surfaces should it cover?
4. Does the top-level `goal.md` budget sentence in the public README belong in
   the README at all, given both retrieval lanes exclude it (R4-F8,
   `retrieval-conventions.md:282-283`)?
5. Is the "goal" vocabulary collision (R4-F10) worth a naming note in the
   deep-review reference, or is it out of scope for goal unification?

Recorded `newInfoRatio`: **0.80**. Ring 4 opened eleven new surfaces (root
instructions, repo rules, hub, shared flags, rosters, catalogues, seven
playbook families, advisor metadata, deep-review asset, scaffold metadata,
retrieval conventions), resolved all four inherited questions with positive and
negative results, produced eight confirmed defects plus three precision gaps,
and downgraded R1-F1 from "shipped dead flag" to local drift plus a misleading
rule statement. Its confirmations (catalogues accurate in the large, dist in
step, rules silent by design) are what keep the ratio below ring 4's breadth.

---

## Evidence index

| Claim | Source |
|---|---|
| Hub concern row, canonical-first | `.opencode/hooks/README.md:50` |
| Hub cross-runtime matrix row | `.opencode/hooks/README.md:230-240` |
| Coverage rationale for goal | `.opencode/hooks/coverage-rationale.md:80-82` |
| Resolver canonical/derived model | `.opencode/hooks/shared/README.md:23`, `:47` |
| Canonical name for goal + alias bridge | `.opencode/hooks/shared/README.md:88`, `:73` |
| Canonical name test-pinned | `.opencode/hooks/shared/hook-flags.test.cjs:38`, `:42` |
| Derived-name warning | `system-spec-kit/runtime/ENV-REFERENCE.md:68` |
| Canonical flag row | `system-spec-kit/runtime/ENV-REFERENCE.md:83` |
| Plugin env roster | `system-spec-kit/runtime/ENV-REFERENCE.md:328-346` |
| Env vars incl. state dir + runtime label | `.env.example:304-305` |
| Runtime label read | `.opencode/hooks/goal/bin/goal.cjs:394` |
| Live vs example flag line | `.opencode/hooks/hook-flags.env:25`; `hook-flags.env.example:25` |
| Live file ignored | `.gitignore:287` (via `git check-ignore -v`) |
| Plugins README flag rule | `.opencode/plugins/README.md:96-98` |
| Plugin inventory rows | `.opencode/plugins/README.md:31`, `:82` |
| Resume allowed statuses (plugin) | `.opencode/plugins/opencode-goal.js:1952`, `:165-166` |
| Resume rule (core) | `.opencode/hooks/goal/lib/goal-core.cjs:1327` |
| Core status vocabulary | `.opencode/hooks/goal/lib/goal-core.cjs:73` |
| Plugin status vocabulary | `.opencode/plugins/opencode-goal.js:153-160` |
| Core vocabulary documented | `.opencode/hooks/goal/README.md:37` |
| Catalog resume claim (spec-kit) | `system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md` §2 |
| Catalog resume claim (advisor) | `system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md` "Tools And Lifecycle" |
| CL-007 stale path (4 sites) | `system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md:123`, `:185`, `:197`, `:201` |
| CL-007 quoted lines match real file | `.opencode/commands/goal-opencode.md:4`, `:15`, `:37`, `:39` |
| Constitutional citation | `cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md:34`; benchmark `source.md:13`, `skill-benchmark-report.md:36`, `skill-benchmark-report.json:34`, `findings-and-recommendations.md:7` |
| Constitutional dir absent | `ls system-spec-kit/`; name search across live tree |
| CO-039 suite/test counts | `cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` §2–§3 |
| Observed 8 suites / 137 pass | `node --test .opencode/plugins/tests/opencode-goal-*.test.cjs` (this iteration) |
| PI-021 filename expectation | `cli-pi/manual-testing-playbook/goal-hook/goal-hook.md` expected signals |
| Fresh state path is the composite digest | `.opencode/hooks/goal/lib/goal-core.cjs:198-210` |
| Legacy scoped path | `.opencode/hooks/goal/lib/goal-core.cjs:197`, `:212` |
| CE-P03 injection-only reason | `cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md` §1 |
| CU-027 accurate reason | `cli-cursor/manual-testing-playbook/goal-hook/goal-hook.md` §1 |
| DV-022 rollback alias | `cli-devin/manual-testing-playbook/goal-hook/goal-hook.md` §3 Rollback |
| README "every turn" | `README.md:861` |
| Cursor sessionStart-only reason | `.opencode/hooks/injection-contract.md:139-140` |
| Cursor registration | `.cursor/hooks.json` (generated from `hook-registry.json:506-547`) |
| README budget phrasing | `README.md:865` |
| Manifest scope sentence | `system-spec-kit/templates/spec-kit-docs.json:26` |
| Validator scope computation | `system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1051` |
| dist carries the same logic | `runtime/dist/lib/validation/spec-doc-structure.js:853-863`; `dist/lib/templates/level-contract-resolver.js:192-199` |
| dist freshness gate | `runtime/cli/spec/validate.sh:26`, `:29`; `runtime/cli/lib/dist-freshness.cjs` |
| AGENTS.md posture lines | `AGENTS.md:291-297`, `:468` |
| Rules contain no goal text | sweep over `REPO RULES.md`, `repo-rules/*.md` |
| README goal section | `README.md:854-866` |
| `goal-file-manifest.txt` handling | `.opencode/commands/deep/assets/deep-review-auto.yaml:373-376` |
| ClickUp goals card (unsupported) | `mcp-tooling/mcp-click-up/feature-catalog/mcp-medium-priority/manage-goals.md:20` |
| Hook flags POSIX mirror limitation | `.opencode/hooks/shared/README.md:72` |
| POSIX mirror consumers | `.opencode/bin/git-live-follow.sh:158-162`, `check-git-hooks.sh:38-42`, `git-primary-reconcile.sh:168-177` |
| goal.md scaffold metadata | `utils/template-structure.js:64`, `:202`; `create.sh:54`, `:153`, `:283`, `:461`, `:1808` |
| goal template tests | `scaffold-golden-snapshots.vitest.ts:82`, `:122-141`; `template-version-parity.vitest.ts:78-80` |
| Budget tests in spec-kit | `spec-doc-structure.vitest.ts:315-365` |
| Goal transport summary | `references/config/hook-system.md:97-99` |
| Playbook index row | `cli-external-orchestration/manual-testing-playbook/manual-testing-playbook.md:66` |
| Advisor leaf registrations | `leaf-aliases.json:129`, `:269`; `leaf-manifest.json:30`, `:58` |
| spec-kit leaf playbook reference | `system-spec-kit/leaf-manifest.json:42` |
