# Iteration 6: Q4 — Claim Audit of the Root README

## Focus

Q4: which statements in the 1,773-line root `README.md` are stale, wrong, missing or over-detailed versus the code, with README line numbers and the contradicting source.

Q5 supplied the order this audit walks: verify the highest-read claims first (front matter, install, first task), then the catalog claims only where they survive the proposed shrink. Q5 also flagged two specific claims to settle rather than re-discover: the six-versus-eight runtime enumeration (`README.md:16` against `README.md:184`) and the 45-command count at `README.md:1174`.

Not in scope this iteration: Q3 (per-runtime hook/plugin adapter mapping), which remains open and independent.

## Actions Taken

1. Read the run config, strategy and state projection to fix the iteration number, the focus, the exhausted-approach list and the lifecycle branch (`new`).
2. Read the root `README.md` in six spans covering lines 1-260, 260-560, 560-780, 780-1020, 1150-1468 and 1468-1667, so every H2 section was read at least once.
3. Counted the on-disk inventory the README makes claims about: skill directories and `SKILL.md` files, per-skill top-level `README.md`, command files by namespace, doctor commands, hook core directories, template files, repo-rule files and runtime directories.
4. Checked git tracking for the ambiguous entries: `local-webflow` (a symlink) and the two root-level `local-*` command files.
5. Read the Node engine range from the two built packages and the self-dispatch rules from the CLI bridge `hard-rules.json` files.
6. Read the two mode registries the README gives counts for (`sk-doc`, `mcp-tooling`) and counted the dsh bridge rules.

## Findings

### P1 — claims that are wrong against the code

1. **The runtime enumeration is split 6-versus-8, and the six-name line is the stale one.** `README.md:16` says "Built for Claude Code, Codex, OpenCode, Pi Agent, Devin and Cursor CLI" while `README.md:184` says "any of the eight runtimes: OpenCode, Claude Code, Codex, Cursor, Devin, Pi, DeepSeek Harness (DSH) or Mistral Vibe". Disk carries eight runtime directories: `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe`. The eight-name claim is correct; the six-name claim is missing DeepSeek Harness and Mistral Vibe. `README.md:69` ("Eight CLI bridges") and `README.md:642` already name the same eight, so `README.md:16` is the only holdout. [SOURCE: README.md:16] [SOURCE: README.md:184]

2. **The bridge self-dispatch rule is stated two incompatible ways, and the later statement is the wrong one.** `README.md:73` says "Six bridges refuse to dispatch the runtime they run in. `cli-pi` and `cli-deepseek-harness` do not." `README.md:873` says "Every bridge but `cli-pi` refuses to dispatch the runtime it runs in". `cli-pi`'s own skill states the exemption explicitly — "being inside Pi is not a reason to refuse" — which both lines agree on. For dsh, the bridge's 13 `hard-rules.json` entries contain no self-dispatch refusal (they cover headless profile, stdin, route patch, closed roster and approval policy), and the only "refuse" in its `SKILL.md` is a version-pin check. So two independent sources put dsh in the exempt set: `README.md:73` is correct and `README.md:873` overstates by one bridge. [SOURCE: README.md:73] [SOURCE: README.md:873] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:11] [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json]

3. **The Node requirement is stated as a single version when the packages declare a three-branch range.** `README.md:164` says "You need Node.js 24". Both built packages declare `"node": "^22.23.4 || ^24.22.1 || >=26.12.1"`, so Node 22 and Node 26 are supported and a 24.x below 24.22.1 is not. The claim is both too narrow (it excludes two supported majors) and too loose (it admits unsupported 24.x patch levels). [SOURCE: README.md:164] [SOURCE: .skilled/skills/system-spec-kit/package.json]

### P2 — missing, over-detailed or misleading

4. **`.dsh/` is absent from both runtime-folder enumerations.** `README.md:871` links six runtime READMEs and `README.md:1618` lists six runtime folders plus `.vibe/` as a separate run surface. Neither names `.dsh/`, even though DeepSeek Harness is one of the eight supported runtimes and the directory exists. A reader following the configuration table cannot find the dsh surface at all. [SOURCE: README.md:871] [SOURCE: README.md:1618]

5. **`sk-design` is the one skill in the library with no top-level `README.md`, which breaks the shrink map Q5 proposed.** `README.md:913` documents `sk-design` as a hub over three modes, and `README.md:1562` gives it a full row in the §15 agnostic-skill table, but `.skilled/skills/sk-design/` holds only nested mode READMEs (`sk-design-chart`, `sk-design-diagram`, `sk-design-md-generator`, `benchmark`) and no `README.md` of its own. Q5's shrink map sends §9 to "the 14 skill READMEs (3,179 combined)"; the §9 `sk-design` row has no README to link to until one is written. [SOURCE: README.md:913] [SOURCE: README.md:1562] [SOURCE: .skilled/skills/sk-design/]

6. **§4's doctor list reads as complete but omits six of the seventeen.** `README.md:234` introduces the list with "The rest each cover one area", then lists nine commands at `README.md:236-243`. `/doctor:speckit`, `/doctor:mcp`, `/doctor:git`, `/doctor:sk-code`, `/doctor:deep-loop` and `/doctor:env` are all missing, and §12 confirms the total is seventeen. The list is a useful digest, but the framing promises coverage it does not deliver. [SOURCE: README.md:234] [SOURCE: README.md:1316]

### Corrections to prior iterations (verified this pass)

7. **The "45 commands" claim at `README.md:1174` is correct — do not "fix" it.** Its arithmetic reconciles exactly: 43 in six groups (SPEC KIT 5 + CONTINUITY 3 + CREATE 13 + DEEP 2 + DESIGN 3 + DOCTOR 17) plus 2 utilities (`/prompt:improve` at `.skilled/commands/prompt/improve.md` and `/goal-opencode` at `.opencode/commands/goal-opencode.md`, both tracked). The disk holds 44 grouped files because two of them are untracked operator-local commands (`local-doc-alignment.md`, `local-skilled-alignment.md`, both empty under `git ls-files`), which correctly stay out of a shipped count. The only soft spot is presentational: `/prompt:improve` has its own namespace directory yet is presented as a utility, so a reader who counts directories sees seven namespaces. Q5 flagged this count as suspect; the audit clears it. [SOURCE: README.md:1174] [SOURCE: .skilled/commands/prompt/improve.md] [SOURCE: .opencode/commands/goal-opencode.md]

8. **"14 skills" is correct for the shipped repository, and Q5's README count needs one correction.** `.skilled/skills/` lists fifteen entries, but the fifteenth is `local-webflow`, a symlink to an external private checkout (`/Users/.../A. Nobel & Zn./local-skills/local-webflow`) with no tracked files — a private surface skill of exactly the kind `README.md:835` and `README.md:1588` describe. Fourteen shipped skills each carry a `SKILL.md`. Q5's "14 skill READMEs" therefore comprises 13 shipped top-level READMEs plus that untracked symlink's README, and excludes `sk-design` (finding 5). The 14-count claims at `README.md:25`, `README.md:86`, `README.md:131`, `README.md:226` and `README.md:801` all stand. [SOURCE: README.md:801] [SOURCE: .skilled/skills/local-webflow]

### Claims verified as accurate

9. **Every other numeric claim this pass checked reconciles.** Fifteen templates ship under `templates/` (`README.md:310`) — 15 `.tmpl` files. The gate system loads 10 rule files (`README.md:452`) — 10 files in `.skilled/repo-rules/`. The 27 hook cores named at `README.md:1166` are 12 + 6 + 8 + `shared` = 27, matching 27 directories under `.skilled/hooks/`. Doctor commands are 17 (`README.md:1316`), split 11 (`README.md:817`) + 6 (`README.md:1316`). `sk-doc` has 15 modes (`README.md:929`), `mcp-tooling` has 8 (`README.md:899`), there are 8 bridges and the dsh bridge carries 13 hard rules (`README.md:877`). Code Mode registers 14 manuals, 7 of them described in the table (`README.md:1487`). The advisor's nine commands are 4 `advisor_*` + 5 `skill_graph_*` (`README.md:678`). [SOURCE: README.md:310] [SOURCE: README.md:452] [SOURCE: README.md:1166] [SOURCE: .skilled/skills/sk-doc/mode-registry.json]

10. **The §15 "every other shipped skill is codebase-agnostic" table is the most accurate skill list in the document.** Its 13 rows plus `sk-code` reconcile to 14, it names `sk-design` in full, and it is the only place that states the private `local-<name>` surface convention (`README.md:1588`). It is a better canonical source for a rewrite than §9. [SOURCE: README.md:1556] [SOURCE: README.md:1588]

## Ruled Out

- **Re-deriving the six-versus-eight runtime question from the release notes.** The disk directory listing settles it in one call and is the authoritative source; the release narrative only explains when dsh and Vibe were added, which the rewrite does not need.
- **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** The directory holds `check-*.sh` entry points plus `.cjs` helpers, and the grep returned 36 loose matches rather than a registry. The "42 rules" claim is therefore recorded as unverified rather than wrong.

## Dead Ends

- None. Every action produced usable evidence.

## Edge Cases

- Ambiguous input: none. Q4 named the deliverable and Q5 named the walk order.
- Contradictory evidence: one internal contradiction, the self-dispatch rule (finding 2). Resolved in favour of `README.md:73` on two independent sources; recorded rather than smoothed over.
- Missing dependencies: none. `resource-map.md` is absent by config (`resource_map_present: false`), so the coverage gate is skipped rather than failed.
- Partial success: the "42 validation rules" and "29 chart forms / 27 diagram types" claims were not independently counted. They are marked unverified, not wrong.

## Sources Consulted

- `README.md:16`, `:25`, `:69`, `:73`, `:86`, `:131`, `:164`, `:184`, `:226`, `:234`, `:236`, `:310`, `:403`, `:452`, `:642`, `:678`, `:801`, `:817`, `:871`, `:873`, `:899`, `:913`, `:929`, `:1166`, `:1174`, `:1316`, `:1487`, `:1556`, `:1562`, `:1588`, `:1618`
- `.skilled/skills/system-spec-kit/package.json` (`engines.node`)
- `.skilled/skills/system-skill-advisor/runtime/package.json` (`engines.node`)
- `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:11`
- `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json`
- `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md:75`
- `.skilled/skills/sk-doc/mode-registry.json`, `.skilled/skills/mcp-tooling/mode-registry.json`
- `.skilled/commands/prompt/improve.md`, `.opencode/commands/goal-opencode.md`
- `git ls-files` over `.skilled/skills/local-webflow`, `.skilled/commands/local-*.md`
- Directory counts: `.skilled/skills/*/`, `.skilled/commands/*/`, `.skilled/commands/doctor/`, `.skilled/hooks/`, `.skilled/repo-rules/`, `templates/**/*.tmpl`, runtime folders

## Assessment

- New information ratio: 0.78
- Questions addressed: Q4
- Questions answered: Q4

## Reflection

- What worked and why: counting the inventory before reading the claims inverted the audit. Instead of reading 1,773 lines and guessing what might be stale, the counts (skills, commands, doctor commands, templates, hooks, runtimes) became the test set, and every mismatch surfaced by arithmetic rather than by judgement. The command count is the clearest case: 43 + 2 reconciles to 45 exactly, and the apparent 46 came from two untracked operator files that a `git ls-files` check separated in one call. Without that check the audit would have "corrected" a correct number.
- What did not work and why: the first verification batch used an `&&` chain that aborted on the intentionally missing root `package.json`, so four later checks never ran and had to be repeated. This is the second iteration to lose a batch to that pattern; it is now recorded in strategy §8 for the second time.
- What I would do differently: resolve the identity of every ambiguous directory entry (symlink, untracked, generated) before counting it. Both corrections to Q5 came from that one habit, and both would otherwise have entered the rewrite as false defects.

## Questions Answered

- **Q4** — Claim audit of the current root README.md (1,773 lines): which statements are stale, wrong, missing or over-detailed versus the code. Cite README line numbers and the contradicting source.

## Questions Remaining

- **Q3** — every dedicated hook, plugin and extension per runtime, one README subsection each. The 27 hook cores are named and verified; the per-runtime adapter mapping is still unmeasured.

## Recommended Next Focus

**Q3** — the per-runtime hook, plugin and extension mapping. Q4 closed the claim audit, so the only open question is the adapter inventory. It should be measured by listing each runtime folder's hook, plugin and extension entries and pairing each with the shared core it calls into, which is the inverse of the core-first list already verified at `README.md:1166`.

Two Q4 outputs should carry into the rewrite rather than be re-derived: the 45-command count is correct and must not be changed, and `sk-design` needs a top-level README before §9 can link to it.
