# Iteration 5: Root README spec-kit statements, script options, versions, catalog/playbook checks and review output vs v4.0.0.4 (Q3 part 3)

## Focus

Q3 part 3: the root README's statements on the Spec Kit (validation rules, `create.sh` options, Gate 3 option C, `/doctor:update` and the upgrades), scripts refusing unknown options, per-doc versions and changelog numbering, playbook and catalog path checks and their counts, and code review output, checked against v4.0.0.4 and the repository, including every count the README quotes. Parts 1 (deep-loop modes, commands, agents) and 2 (hubs, routing and the advisor, hooks, CI checks) were covered in iterations 3-4, so this iteration completes Q3's feature areas.

## Actions Taken

1. Read state first: `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, and the iteration-003/004 narratives. Focus = strategy §11 Next Focus (Q3 part 3); no exhausted approach blocks it.
2. Re-opened `.skilled/changelog/skilled/v4.0.0.4.md` first-hand and read it whole (all 452 lines): Spec Upgrades (53-91), Spec Validation (95-105), Commit and Pull Request Checks (109-133), Spec Folder Questions (139-141), Deep Loop Modes (147-167), Follow-Up Fixes (173-229), Tooling Changes (233-281), Code Skill (285-317), Agents and Repo Rules (321-329), Hooks and Dispatch Guards (333-341), Skill Routing (345-361), Skill Authoring (365-397), Install and First Use (401-413), Upgrade Notes (417-452).
3. Located the README's claims with read-only greps (`gate 3|create\.sh|doctor:update|upgrade|validation`, `unknown|playbook|catalog`, `version|changelog`, `review`, `v[0-9]+\.[0-9]+`) and read the claim lines: 245-258, 400-450, 556-660, 1160-1185, 1260-1280, 1328-1342, 1428-1462, 1440-1462.
4. Counted the repository side with read-only commands: `validator-registry.json` parse → `RULES: 41` with severities; `.skilled/commands/doctor/assets/` → 21 YAML files, 20 containing `operating_mode`; `create.sh` token scan (`--phases` 9, `--phase-names` 13, `--with-goal` 3, `--with-lazy-addons` 3, `--path` 7, `unknown option` 1, `SPECKIT_POST_VALIDATE` 3); click-up catalog `###` headings → 111; playbook scenario `.md` files → 42 across 10 groups; chart catalog first table → 31 rows (29 data rows); `check-corpus.cjs` `FAMILY_NAMES` → 49 entries.
5. Read the command and workflow sources: `doctor/update.md`, `doctor/mcp.md`, `doctor/assets/doctor-update-compat-action.yaml`, `create/changelog.md`, `spec/validate.sh`, `validation/orchestrator.ts` (severity handling), `mcp-click-up/INSTALL-GUIDE.md`, `mcp-click-up/references/mcp-tools.md`, `cupt-lifecycle/session-auth.md`.

## Findings

| README path:line | Claim as written | Evidence | Class | Severity | Smallest proposed fix |
|---|---|---|---|---|---|
| README.md:421 | "`validate.sh` runs 42 rules against a spec folder and reports what passes and what needs fixing." | `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` parsed → `RULES: 41`; `validate.sh` reads that registry and its `list_registry_rules` prints "RULES BY CATEGORY" from it; v4.0.0.4 removed the improvement-folder check [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:151] | STALE | P2 | "runs 41 rules against a spec folder" |
| README.md:426 | "**`validate.sh`** - run 42 validation rules. Use `--recursive` for phase folders" | Same registry: 41 rules | STALE | P2 | "run 41 validation rules" |
| README.md:421 | "Two of them only warn and never fail a run: `FRONTMATTER_VALUES` ... and `SOURCE_TAGS` ..." | Registry severities: seven rules carry `warn` (`FRONTMATTER_VALUES`, `SOURCE_TAGS`, `GRAPH_METADATA_PRESENT`, `GRAPH_METADATA_CHILD_DRIFT`, `GRAPH_METADATA_SHAPE`, `DESCRIPTION_SHAPE`, `LINKS_VALID`) and two carry `info` (`LEVEL_DECLARED`, `AC_COVERAGE`); the orchestrator maps `warn`→`warn` and `info`→`info` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:304-305] | STALE | P2 | "Seven of them only warn and never fail a run: `FRONTMATTER_VALUES` ..., `SOURCE_TAGS` ..., `GRAPH_METADATA_PRESENT`, `GRAPH_METADATA_CHILD_DRIFT`, `GRAPH_METADATA_SHAPE`, `DESCRIPTION_SHAPE` and `LINKS_VALID`" |
| README.md:1278 | "The 19 underlying YAML workflows in `.skilled/commands/doctor/assets/` are self-sufficient. Each declares its own `role/purpose/action/operating_mode` block ..." | The directory holds 21 `.yaml` files; 20 contain the `operating_mode` block this same sentence uses to define a workflow (only `mcp-mutation-class-manifest.yaml` lacks it) | STALE | P2 | "The 20 underlying YAML workflows ..." |
| README.md:881 | "... 96-feature catalog + 37-scenario playbook included" | Playbook index description: "Covers all 111 features across cupt CLI and the official ClickUp MCP"; catalog holds 111 `###` cards (50 cupt features + 61 MCP cards per its own overview); playbook holds 42 scenario `.md` files across 10 groups | STALE | P2 | "111-feature catalog + 42-scenario playbook included" |
| README.md:881 | "Routes between `cupt` CLI (daily task ops) and the official ClickUp MCP (documents, goals, bulk ops, webhooks)" | FEATURE-CATALOG.md overview: "The server has no tools for goals, bulk create, webhooks, checklist edits, spaces, views, space tags, task templates, guests, user groups or audit logs." Its covered list is "task creation, documents and pages, search, lists and folders, task relations, chat and reminders" | STALE | P1 | "(task creation, documents, search, chat and reminders)" |
| README.md:1435 | "**`mcp-tooling`** ... `mcp-click-up` (ClickUp task management via cupt CLI + official MCP, requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`)" | cupt signs in with `cupt auth` or `cupt config --api-token pk_...` (INSTALL-GUIDE.md:117-126; session-auth.md:25-28); mcp-tools.md:52 "`CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` play no part in this route"; those keys appear nowhere else in the skill (full walk); v4.0.0.4: "The old ClickUp key lines in your own `.env` are unused and safe to delete" [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:421] | STALE | P1 | "cupt CLI + official MCP; cupt signs in once with `cupt auth` or a `pk_` API token" |
| README.md:893 | "... one of 29 catalog forms ..." | `.skilled/skills/sk-design/sk-design-chart/references/catalog.md` first table (line 42): 31 rows = header + separator + 29 data rows | OK-VERIFIED | P2 | none |
| README.md:893 | "A corpus checker holds the visual contract across 49 named check families, five of them browser-backed." | `check-corpus.cjs:100-150` `FAMILY_NAMES` = 49 entries; `checkRenders` (3096-3174) runs `card-readout`, `pointer-reach`, `render`, `settled-render` and `dark-render` through the browser = five | OK-VERIFIED | P2 | none |
| README.md:1266 | "**`/doctor:update [check\|align\|apply\|rollback\|record-base\|compat]`** - release-aware spec-kit updater ..." | `.skilled/commands/doctor/update.md` frontmatter and §3 mode routing list exactly those six actions; `doctor/assets/` holds one workflow YAML per action | OK-VERIFIED | P2 | none |
| README.md:1269 | "`compat` moves a v3 checkout to the v4 `specs/` layout and then upgrades its legacy packets, with a separate approval for each. A dirty spec root stops the move, and `--dry-run` previews it without writing." | `doctor-update-compat-action.yaml`:12 `approvals: move_approval_plus_separate_upgrade_approval`; :17 "Nothing is written before the move approval."; :107-108 dirty check runs `git status --porcelain=v1 --untracked-files=all -- specs .opencode/specs` and stops with STATUS=BLOCKED before any write | OK-VERIFIED | P2 | none |
| README.md:1264 | "A flag the chosen sub-action does not accept is refused before any workflow loads, with the flag it does accept" | `doctor/mcp.md`:60-63 "Before YAML load, reject a flag that belongs to the other sub-action ... and a flag neither sub-action accepts with its unknown-flag error"; :74 names the error set | OK-VERIFIED | P2 | none |
| README.md:414 | "`create.sh --phase` creates a parent with three child phases in one step. `--phases <N>` or `--phase-names` sets the children" | `create.sh` token scan: `--phase` present, `--phases` ×9, `--phase-names` ×13 | OK-VERIFIED | P2 | none |
| README.md:425 | "**`create.sh`** - create spec folders with level-appropriate templates. Use `--phase` for a parent with child phases" | `create.sh` exists at the README's own path and carries `--phase`; `--help` present | OK-VERIFIED | P2 | none |
| README.md:325 | "Render with `--with-lazy-addons` or `--with-goal` on `create.sh` ..." | `create.sh` token scan: `--with-lazy-addons` ×3, `--with-goal` ×3 | OK-VERIFIED | P2 | none |
| README.md:445 | "The default scaffold path skips post-create validation. Set `SPECKIT_POST_VALIDATE=1` to enable it for strict CI workflows" | `create.sh` token scan: `SPECKIT_POST_VALIDATE` ×3 | OK-VERIFIED | P2 | none |
| README.md:1167-1168 | "Resolves the correct component folder, calculates the next version number" / "Modes: `:auto`, `:confirm`" | `.skilled/commands/create/changelog.md` frontmatter ":auto/:confirm" and §3 resolves `:auto`/`:confirm`; the router exposes `--bump <major\|minor\|patch\|build>`; v4.0.0.4's upstream-aware numbering [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:377] adds no contradiction | OK-VERIFIED | P2 | none |
| README.md:1336 | "**`clickup_official`** (MCP/stdio) - official hosted ClickUp MCP via `mcp-remote`. No env var needed, the first launch asks for one OAuth approval in the browser." | `references/mcp-tools.md`:52 "OAuth 2.1 with PKCE, through the hosted server, with one browser approval on the first launch"; INSTALL-GUIDE.md:143 "The first launch opens a browser window for one OAuth approval. No API key is needed."; changelog:38 describes the same switch | OK-VERIFIED | P2 | none |
| README.md:1598 | "**[→ Release Notes](.skilled/changelog/skilled/)** - every Skilled release, one entry per version" | `.skilled/changelog/skilled/` holds 9 entries, tail v4.0.0.1-v4.0.0.4 | OK-VERIFIED | P2 | none |

Note — checked and clear (no README statement contradicts the change; recorded as observations in the delta, not rows):
- Code review output: README:37, 641-644, 802 and 955-957 make no claim about the pre-v4 review output shape; v4.0.0.4's "Case" line, status-line ending and `Not checked` line [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:161-163], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:287-289] have no counterpart claim to update.
- Gate 3 option C: README:252 and the FAQ (1519, 1522) name no Gate 3 options; the option-C wording change [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:139-141] has no README claim to fix.
- Nested anchors: README:421 says rules check "anchor markers"; the nested-anchor error change [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:95-97] has no README claim.
- Unknown-option refusal: the README makes no general claim that scripts refuse unknown options; `create.sh` carries the refusal (`unknown option` ×1) and the doctor routers reject unknown flags. Q5 candidate.
- Per-doc versions: no README statement on the per-doc version model; shipped docs carry 4-part versions (chart catalog `version: 0.23.0.16`, click-up catalog `version: 1.1.0.0`) per [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:387-389].
- The root README quotes no dotted version numbers (`v[0-9]+\.[0-9]+` → no matches).

## Questions Answered

- Q3 is answered (its three parts were covered across iterations 3-5). Most root README feature statements match the repository; the stale claims found are the rows recorded in iterations 3-5 (agent count 12→11, command count 39→37, rule count 42→41 at two lines, warn-rule count, doctor workflow count 19→20, click-up counts 96/37→111/42, ClickUp MCP capability list, `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` requirement). The exact strategy question text is reported in the iteration record's `answeredQuestions` so the reducer can tick it.

## Questions Remaining

- Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository?
- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate?

## Next Focus

Iteration 6: Q4 — walk the related READMEs (the root README's linked set: `.skilled/README.md`, the hub READMEs for sk-doc/sk-code/sk-git/system-spec-kit/system-skill-advisor/cli-pi, the INSTALL-GUIDE family, `.skilled/hooks/README.md`, the system-spec-kit runtime README), checking the v4.0.0.4-touched surfaces (hub version lines per changelog:199, INSTALL-GUIDE frontmatter per changelog:389) and the same claim classes. Fold in the Q5 candidates collected so far (the unknown-option refusal and the advisor-agreement CI check are absent from the root README; the ClickUp OAuth note is present at README:1336).

## Ruled Out

- Running `check-corpus.cjs --families` to list the check families: unnecessary; reading `FAMILY_NAMES` (lines 100-150) yields the same list without executing a script.
- Running `create.sh` with an unknown option to observe the refusal: not executed; a scaffolder run risks writes, so the refusal was evidenced from the source token scan and the changelog instead.

## Dead Ends

- None this iteration.

## Edge Cases

- Ambiguous input: none material. The focus split Q3 once more; the narrower evidence-backed interpretation (part 3 = the named areas plus every quoted count) was taken, and Q3 is now fully covered.
- Contradictory evidence: none unresolved. The one candidate was README:893's "five of them browser-backed" against scripts/README.md:119's "three more run"; `checkRenders` resolves it — `card-readout`, `pointer-reach` and the three render families all open a browser under `--render`, five in total.
- Missing dependencies: none. All state files present; gateway called after the writes.
- Partial success: none. All planned checks completed; nothing was executed against the researched surface (all evidence is read-only).

## Sources Consulted

- [SOURCE: README.md:325], [SOURCE: README.md:414], [SOURCE: README.md:421], [SOURCE: README.md:425], [SOURCE: README.md:426], [SOURCE: README.md:445], [SOURCE: README.md:881], [SOURCE: README.md:893], [SOURCE: README.md:1167], [SOURCE: README.md:1168], [SOURCE: README.md:1264], [SOURCE: README.md:1266], [SOURCE: README.md:1269], [SOURCE: README.md:1278], [SOURCE: README.md:1336], [SOURCE: README.md:1435], [SOURCE: README.md:1598]
- [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:38], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:81], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:95], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:139], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:151], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:161], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:275], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:279], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:281], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:287], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:377], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:387], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:389], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:395], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:421], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:429]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json], [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:304], [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:305], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh]
- [SOURCE: .skilled/commands/doctor/update.md], [SOURCE: .skilled/commands/doctor/mcp.md:60], [SOURCE: .skilled/commands/doctor/mcp.md:63], [SOURCE: .skilled/commands/doctor/mcp.md:74], [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:12], [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:17], [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:107], [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:108], [SOURCE: .skilled/commands/create/changelog.md]
- [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/FEATURE-CATALOG.md], [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md], [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:52], [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md:143], [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/cupt-lifecycle/session-auth.md:28]
- [SOURCE: .skilled/skills/sk-design/sk-design-chart/references/catalog.md:42], [SOURCE: .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:100], [SOURCE: .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:3096], [SOURCE: .skilled/skills/sk-design/sk-design-chart/scripts/README.md:119]
- Command outputs: validator-registry parse → `RULES: 41`; doctor assets → 21 YAML files / 20 with `operating_mode`; create.sh tokens `--phases` 9 / `--phase-names` 13 / `--with-goal` 3 / `--with-lazy-addons` 3 / `--path` 7 / `unknown option` 1 / `SPECKIT_POST_VALIDATE` 3; click-up catalog `###` headings 111; click-up playbook scenario files 42; chart tables `[{start:42,rows:31},{start:78,rows:8},{start:112,rows:8},{start:129,rows:9},{start:165,rows:5},{start:189,rows:5}]`; `FAMILY_NAMES` 49 entries; grep `v[0-9]+\.[0-9]+` over README.md → no matches
- specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/deep-research-config.json; deep-research-state.jsonl; deep-research-strategy.md; findings-registry.json; iterations/iteration-003.md; iterations/iteration-004.md

## Assessment

- New information ratio: 0.74 (6 fully new stale-claim findings plus 1 duplicate line at half weight, 12 first-time verifications at half weight, 6 fully new observations; weighted 18.5/25)
- Questions addressed: Q3 part 3 (completes Q3)
- Questions answered: Q3

## Reflection

- What worked and why: parsing the validator registry directly turned three claims into exact numbers (41 rules, 7 warn + 2 info) instead of prose guesses, and the orchestrator's severity mapping confirmed what "warn" means at runtime; counting the doctor assets by the README's own `operating_mode` definition made the 19-vs-20 verdict self-contained; reading the shipped catalog and playbook gave both the 111/42 counts and the ClickUp capability contradiction in one pass; reading the routers (`update.md`, `mcp.md`, `compat-action.yaml`) verified four claims from their own contracts; the INSTALL-GUIDE plus session-auth scenario settled the two-iteration-old `CLICKUP_API_KEY` carry-over.
- What did not work and why: nothing failed. The state reads and claim mapping again consumed more calls than the persona's target, so the evidence probes had to be batched into compound read-only commands.
- What I would do differently: open the registry and the click-up catalog in the first research batch, since both carried the highest-probability defects and both were cheap to count.

## Recommended Next Focus

Iteration 6: Q4 over the related READMEs, starting from the root README's own link list; then Q5 synthesis with the checked-and-clear set collected across iterations 3-5.

## SCOPE VIOLATIONS

None.
