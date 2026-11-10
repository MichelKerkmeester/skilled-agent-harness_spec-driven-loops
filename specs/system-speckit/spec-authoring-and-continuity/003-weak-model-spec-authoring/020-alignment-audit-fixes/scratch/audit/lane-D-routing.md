# Lane D: routing, advisor, commands, agents, AGENTS.md and REPO RULES

Read-only audit of worktree `217-weak-model-spec-authoring`. No repository file edited, no git write, no build or suite run.

## Coverage note for the orchestrator (read first)

The scope list was built from `git log -E --grep='^Spec: system-speckit/054'`. That grep catches 43 commits, and most of them belong to the OTHER 054 packet (`054-decommission-debt-fixes`, e.g. `d6a5df774ab` "move the save and search commands into the speckit family"). Most weak-model packet commits carry no `Spec:` trailer: `d0d9d596c5` (phase 006), `6df0a21a0d` (phase 013) and `0046fc7ae2` (the card) have an empty Spec trailer. `git log -- specs/system-speckit/054-weak-model-spec-authoring` lists 46 commits, and the files they touched outside `specs/` include 38 lane-D files missing from scope.txt, among them:

- `.skilled/commands/speckit/{plan,implement,complete}.md` and `assets/speckit-{plan,implement,complete}.yaml`, `speckit-resume-{auto,confirm}.yaml`
- `.skilled/agents/{code,context,markdown}.md` plus their `.claude`, `.codex`, `.pi`, `.hermes` mirrors
- 10 `.skilled/commands/create/assets/*.yaml`, 3 `.skilled/commands/deep/assets/compiled/*.contract.markdown`

I audited those too (finding F3 is in one of them). Other lanes that rely on scope.txt may have the same blind spot. The full list is at `scratchpad/align/d-weak-touched.txt`.

## Findings

### F1 (P1, literal) orchestrate agent accepts exit code 1 as a validation pass

- `.skilled/agents/orchestrate.md:403`: `   - Confirm validation passed (exit code 0 or 1, NOT 2)`
- Standard: `system-spec-kit/references/validation/validation-rules.md:44`: "CLI taxonomy: `0` = success, `1` = user error, `2` = validation error, and `3` = system error". Also AGENTS.md:142: "Require an explicit `RESULT: PASSED`". Since 054 a warning keeps exit 0, so exit 1 can only mean a bad invocation, which this line counts as a pass.
- The same line appears in the generated mirrors: `.claude/agents/orchestrate.md:391`, `.codex/agents/orchestrate.toml:395`, `.pi/agents/orchestrate.md:396`, `.hermes/skills/agent-orchestrate/SKILL.md:394`.
- Fix: edit `.skilled/agents/orchestrate.md` and `.claude/agents/orchestrate.md` (Claude copy is authored), then regenerate `.codex`, `.pi` and `.hermes` with `sync-agents.cjs`, `sync-agents-pi.cjs` and `sync-skills-hermes.cjs`.
  - old: `   - Confirm validation passed (exit code 0 or 1, NOT 2)`
  - new: `   - Confirm validation printed RESULT: PASSED (exit code 0; 1 is a bad invocation, 2 a validation error, 3 a system error)`

### F2 (P2, literal) orchestrate agent cites a template file that does not exist

- `.skilled/agents/orchestrate.md:461`: `   - Verify template source cited (e.g., "copied from level_contract_spec.md")`
- `find .skilled -name 'level_contract*'` returns nothing. The real templates are `templates/core/spec.md.tmpl` and others. Since 054 (`agents/markdown.md:208`), writers are told to start from the authoring card plus a filled example under `templates/examples/`. The `.tmpl` file is the section contract.
- Mirrors carry the same text: `.claude/agents/orchestrate.md:449`, `.codex/agents/orchestrate.toml:453`, `.pi/agents/orchestrate.md:454`, `.hermes/skills/agent-orchestrate/SKILL.md:452`.
- Fix (same propagation as F1):
  - old: `(e.g., "copied from level_contract_spec.md")`
  - new: `(e.g., "scaffolded from templates/core/spec.md.tmpl")`

### F3 (P2, literal) speckit commands list two new warn-only rules but skip MEASURED_BEHAVIOR

- `.skilled/commands/speckit/plan.md:107`, `implement.md:93` and `complete.md:102` (same sentence in all three, md5 identical): "Its `validate.sh --strict` calls now include two warn-only rules, and neither fails the run: `FRONTMATTER_VALUES` ... and `SOURCE_TAGS` resolves the `[SOURCE: path:line]` tags in research and review artifacts of packets created after 2026-10-04."
- Phase 017 shipped `MEASURED_BEHAVIOR`, a warn rule (`runtime/cli/rules/check-measured-behavior.sh`, `validator-registry.json`) that fires on the `spec.md` these commands scaffold. `templates/core/spec.md.tmpl:36` is stamped v2.4 and has the `measured-behavior` anchor at line 109. SKILL.md:483 documents the rule, but the three command docs do not.
- Fix, in all three files:
  - old: `now include two warn-only rules, and neither fails the run:`
  - new: `now include three warn-only rules, and none fails the run:`
  - old: `of packets created after 2026-10-04.`
  - new: `of packets created after 2026-10-04, and `MEASURED_BEHAVIOR` warns when a `spec.md` stamped v2.4 or later has a `measured-behavior` anchor holding neither command output nor a reasoned `N/A:`.`

### F4 (P2, judgment) advisor metadata for system-spec-kit predates every 054 feature, and three of six probes miss

- `.skilled/skills/system-spec-kit/graph-metadata.json`: `derived.last_updated_at` is `2026-09-04T00:00:00Z`. The 14 top-level `intent_signals` and 12 `derived.trigger_phrases` name none of: the authoring card, repair-derived, measured behavior, template add-ons, quiet validation or Draft auto-repair.
- Probes (`node .skilled/bin/skill-advisor.cjs advisor_recommend ... --format json`, top 3 with confidence):

| Prompt | Top | Others | Verdict |
|---|---|---|---|
| validate my spec folder quietly | system-spec-kit 0.95 | sk-doc 0.82, mcp-tooling 0.82 | correct |
| repair derived metadata after editing docs | sk-doc 0.8545 | (none) | miss: `repair-derived.cjs` is spec-kit's `runtime/cli/spec/` tool. Partly ambiguous, because sk-doc owns the skill-root derived regenerator |
| add a measured behavior block to the spec | sk-doc 0.82 | sk-code 0.82, system-spec-kit 0.82 (score 0.207 vs 0.285) | miss |
| which template add-ons exist | sk-doc 0.82 (score 0.168) | sk-code, system-spec-kit 0.82 (0.088) | miss |
| scaffold a level 2 spec packet | system-spec-kit 0.8513 | (none) | correct |
| resource map for deep research | system-deep-loop 0.907 | mcp-tooling 0.82 | correct (deep loops own their resource map) |

- The standard is `sk-create-skill/references/shared/skill-root-metadata-contract.md`. For a standalone root, `graph-metadata.json` is authored and the advisor's only input (line 77). `regenerate-skill-derived.cjs` preserves trigger_phrases as hand-curated, so nothing will add them automatically.
- Fix: hand-add spec-kit phrases to `intent_signals` and `derived.trigger_phrases`, such as "spec authoring card", "repair derived metadata", "measured behavior", "spec template add-ons" and "spec packet add-on templates". Update `last_updated_at`, run `/doctor:skill-advisor rebuild`, then rerun the three missed probes. Choosing the phrases and checking that they do not steal sk-doc's own "derived metadata" prompts takes judgment.

## Checked and aligned

1. **system-spec-kit SKILL.md routing.**
   - All 46 `references/` and `assets/` markdown files are in `RESOURCE_MAP` or `ON_DEMAND`, and every map path exists.
   - `leaf-manifest.json` lists the same 46, with no diff against the disk inventory.
   - `spec-authoring-card.md` is routed under PLAN, IMPLEMENT, INTAKE and TEMPLATE_AUTHORING, and its section 9 VALIDATE exists, matching SKILL.md:61.
   - `--quiet` is a real `validate.sh` flag (line 101).
   - SKILL.md:65 states that the deep loops write their own `resource-map.md`, and :483 documents Draft auto-repair, `SPECKIT_DRAFT_AUTO_REPAIR` and MEASURED_BEHAVIOR.
   - `templates/addons/` holds 7 templates, with no before-after, roadmap or resource-map.
2. **Hermes skill mirror.** It differs from SKILL.md only by its generated header and rewritten links, and `sync-skills-hermes.cjs --check` reports "PASS: 67 Hermes skill copies in sync".
3. **description.json.** It is absent for system-spec-kit, which is correct because the contract forbids one on a standalone root (contract line 65).
4. **Deleted add-ons.**
   - No command, agent or runtime mirror references `before-after`, `roadmap` or `resource-map` as a spec-kit template. The only hits are `/create:diff` before/after wording and the readme template's `before_after_patterns`, both unrelated.
   - Deep research and review YAMLs still detect `{spec_folder}/resource-map.md` and emit `{artifact_dir}/resource-map.md`. That is the deliberate scope boundary in 013 `spec.md:81` and 014 `spec.md:82`.
5. **Validate flags in commands and agents.** They use only `--strict` (27), `--recursive` (2) and `--quiet` (2), all supported. The card and the guard scripts `check-example-drift.sh` and `check-card-sync.sh` exist and are named correctly in plan/implement/complete.md, `speckit-complete.yaml:471` and `agents/markdown.md:208`. No agent or command asset mentions the retired `checklist.md`.
6. **Runtime mirrors (the /doctor:runtime-mirrors checks, all read-only).** I did not run the codex hooks installer check because it reads user-global state outside 054.

| Check | Result | rc |
|---|---|---|
| `sync-runtime-mirrors.cjs --check` | PASS, 194 mirrors across 8 trees | 0 |
| `codex/sync-agents.cjs --check` | 11 in sync | 0 |
| `codex/sync-prompts.cjs --check` | 38 in sync | 0 |
| `pi/sync-agents-pi.cjs --check` | 11 in sync | 0 |
| `pi/sync-prompts-pi.cjs --check` | 38 in sync | 0 |
| `agent-roster-mirror-check.cjs` | STATUS=OK | 0 |
| `command-catalog-mirror-check.cjs` | STATUS=OK | 0 |
| `check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3` | 0 |

7. **Claude agent siblings.** The bodies of orchestrate, markdown, code, context, deep-research and deep-review match `.skilled/agents` except the intended `.claude/agents` path-convention lines.
8. **sk-create-agent standard.** `validate_document.py --type agent` on orchestrate.md and markdown.md exits 0, with one pre-existing warning (section numbering starts at 0).
9. **Command rename (054-decommission).**
   - No live `/memory:save` or `/memory:search` remains in commands, agents, cli hubs, AGENTS.md, README.md or the repo rules.
   - The remaining hits are advisor regression fixtures and explicit-lane compatibility aliases, which are intentional, and a `route-validate.sh` self-test fixture.
   - Probe `/speckit:save this context` goes to system-spec-kit at 0.947.
10. **AGENTS.md.**
    - The 054 edit (`/memory:save` to `/speckit:save`) survives at lines 148 and 151, and `.skilled/commands/speckit/save.md` exists.
    - Every path it cites exists, and `validation-rules.md` §1 (exit taxonomy at :44) and §14 ("FOUR WAYS A RUN LIES") match the citation.
    - `~/.claude/CLAUDE.md` is a symlink to the main checkout's AGENTS.md, and the worktree copy is byte-identical. README.md:1467 says the repo ships no CLAUDE.md, so no copy can drift.
11. **REPO RULES.md and `.skilled/repo-rules/*.md`.** There is no statement about add-ons, validation flags, rule counts, the card or `/memory:` commands.
12. **Root README.md.** "42 rules" (lines 148, 373, 378) matches `validator-registry.json`, which has 42 entries. The exit-code table (385-390) matches the taxonomy, and line 258 says resource-map.md is not a packet add-on.
13. **cli hubs and sk-create-command.** The cli-opencode, cli-claude-code, cli-codex, cli-cursor and cli-devin edits were the rename only, and every `.skilled/` path they cite resolves. Unresolved hits were placeholders (`cli-X`, `my-skill`), path prefixes or the gitignored `hook-flags.env`.

## Not completed

- `ci-skill-root-metadata.cjs --format text` (no `--fix`, read-only) was started but had not finished after more than 4 minutes while the full suites were running. It produced no output before this report was written, so its verdict on system-spec-kit's metadata is UNKNOWN.

## Out of lane, noted only

- `system-spec-kit/feature-catalog/tooling-and-scripts/json-primary-deprecation-posture.md:63` still says "The save command (`/memory:save`)". The file is in scope, and this belongs to the catalog lane.
