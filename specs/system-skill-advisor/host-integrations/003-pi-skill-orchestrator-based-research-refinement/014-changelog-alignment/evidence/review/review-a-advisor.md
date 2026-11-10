# Review A: Skill Advisor Changelog Entries

Read-only review of `.skilled/skills/system-skill-advisor/changelog/v0.12.0.0.md`, `v0.11.2.0.md` and the alignment diff on the twelve older entries (`git diff HEAD -M -- .skilled/skills/system-skill-advisor/changelog/`). Sources: the sk-create-changelog `SKILL.md` v1.3.1.0, `references/version-bump-rules.md`, `assets/changelog-template.md`, the 37 packet 030 commits, the seven outside commits, the phase implementation summaries and the current source.

Paths in the evidence column are short forms. `spec-kit shim` is `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`. `advisor hook` is `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`. `cli-fallback` is `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`. `plugin` is `.opencode/plugins/system-skill-advisor.js`. `P030` is `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement`.

## Findings

| ID | file:line | claim quoted | verdict | evidence | proposed replacement |
|----|-----------|--------------|---------|----------|----------------------|
| A-01 | v0.12.0.0.md:20 | "Those runs found a launcher rule that shut the healthy advisor down, a plugin OpenCode refused to load and prompts too long for the advisor to accept." | WRONG | 9ccb4dd416 body lists the 10,000-character clamp under phase 10. `P030/010-review-advisories-and-codex-cleanup/implementation-summary.md:57` says the long-prompt defect was a sibling "found while verifying" the phase 6 review fixes, not a five-CLI run finding. `P030/008-cross-cli-manual-testing/implementation-summary.md` Known Limitations item 1 lists the thirteen run findings, and none is prompt length | Those runs found a launcher rule that shut the healthy advisor down and a plugin OpenCode refused to load. Checking the review's fixes then turned up prompts too long for the advisor to accept. |
| A-02 | v0.12.0.0.md:18 | "The comparison ranked what the advisor should adopt, and the hook changes here are the ones it recommended." | IMPRECISE | `P030/spec.md:126-128` maps R1 to R7, R11 and R12 to phases 2 to 4 only. The long-prompt clamp and the stdin transport in "The Prompt Hook" and "The Advisor Daemon" came from the phase 6 review (9ccb4dd416, `P030/010-.../implementation-summary.md:57`) | The comparison ranked what the advisor should adopt, and the first hook changes here are the ones it recommended. |
| A-03 | v0.12.0.0.md:18 | "Its larger ideas, such as a skill search tool for Pi, wait on replays that have not run." | IMPRECISE | The skill search tool is R9, which waits on an A/B test, not a replay: `P030/001-deep-research/research/research.md:90` and `:100`. `P030/spec.md:140` says R8 to R10 each wait "on a replay or an A/B test" | Its larger ideas, such as a skill search tool for Pi, wait on replays or A/B tests that have not run. |
| A-04 | v0.12.0.0.md:54 | "The shim now leaves the hook 2,200 ms, and system-spec-kit v4.1.4.0 records that change." | IMPRECISE | spec-kit shim:106-112 passes `Math.min(operatorBudgetMs, 2200)`, so an operator value under 2,200 is kept. 9ccb4dd416 body "keeps the operator hook budget under its kill". `.skilled/skills/system-spec-kit/changelog/v4.1.4.0.md:23` states the cap form | The shim now gives the hook at most 2,200 ms, and system-spec-kit v4.1.4.0 records that change. |
| A-05 | v0.12.0.0.md:7 | trigger phrase "advisor prompt hook refinement" | CONTRACT | `SKILL.md:264` requires a topic phrase of words "from the entry's own text". "refinement" appears only in the spec folder path at v0.12.0.0.md:24, never in the prose | `  - "casual prompts skip the advisor"` |
| A-06 | v0.12.0.0.md:8 | trigger phrase "no-suggestion status line" | CONTRACT | Same rule, `SKILL.md:264`. The body never says "no-suggestion". It says "A Turn Without a Suggestion Says Why" (v0.12.0.0.md:76) | `  - "turn without a suggestion"` |
| A-07 | v0.12.0.0.md:122 and :148-151 | "The helpers moved to `.opencode/plugins/lib/skill-advisor-render.js`, and the plugin file exports only its factory." | CONTRACT | cd0df4a38e moved the named exports out of the plugin (`plugin:895` is now the only `export`, `.opencode/plugins/lib/skill-advisor-render.js:26-89` holds them). `SKILL.md:439` keeps "anything the user must do". Code that imported a helper from the plugin file must repoint, and Upgrade Notes do not say so | Add to Upgrade Notes: `- **Repoint.** Code that imported a helper from .opencode/plugins/system-skill-advisor.js now imports it from .opencode/plugins/lib/skill-advisor-render.js.` (keep both paths in backticks) |
| A-08 | v0.11.2.0.md:19 | "**Pi's skill brief is back.** After the move, the fast path looked for its tools under the old root name, so every Pi prompt gave up in about two milliseconds with no suggestion." | IMPRECISE | ad44092f36 body: "every prompt failed in ~2 ms". The probe is `findCliFallbackPaths` in cli-fallback, and the shared advisor hook called it for every runtime (`git show ad44092f36^:...hooks/claude/user-prompt-submit.ts` lines 37 and 277). Pi loads that same hook in-process (`...hooks/pi/prompt-advisor.ts` at ad44092f36^ line 48), and Codex, Cursor and Devin spawn it through the shim (`.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:103-113`). `.opencode/bin` was absent at ad44092f36^ (`git ls-tree`). Inferred, not replayed: a Claude run at ad44092f36^ would confirm | **The skill brief is back.** After the move, the hook's fast path looked for its tools under the old root name, so every prompt in every runtime that runs the hook gave up in about two milliseconds with no suggestion. It now tries `.skilled` first and `.opencode` second, and takes its shim, bridge and database folder from the root it found. |
| A-09 | v0.11.2.0.md:3 | "the fixes after the move bring back Pi's skill brief and stop the OpenCode plugin from calling the advisor on every prompt." | IMPRECISE | Same root cause as A-08 for the brief. For the plugin, 0dde3965d3 body says the bug hit only a plugin "started anywhere below the checkout root", and `plugin:297` now calls `findSourceRoot(findRepoRoot(workspaceRoot))` | The advisor moves with the source root to .skilled, and the fixes after the move bring back the prompt hook's skill brief and let the OpenCode plugin cache its answers below the checkout root. |
| A-10 | v0.11.2.0.md:13 | "Pi gets its skill suggestion on every prompt again" | IMPRECISE | Same evidence as A-08 | This release records the move and the fixes that followed it: every prompt gets its skill suggestion again, and the OpenCode plugin started from a subfolder reuses its answers instead of calling the advisor on every prompt. |
| A-11 | v0.11.2.0.md:8 | trigger phrase "pi skill brief restored" | CONTRACT | `SKILL.md:264` topic-phrase rule. "restored" is not in the entry's prose, which says "is back" (v0.11.2.0.md:19). After A-08 the phrase is also too narrow | `  - "skill brief is back"` |
| A-12 | v0.11.2.0.md:15-21 (absent) | No bullet for the OpenCode status tool's compiled-routing summary | MISSING | 89569a7f81 added `resolveCompiledRouteStatusModule` (`plugin:77-90`), which also tries `.skilled/bin`. Before it the plugin read only `../bin` beside its own folder. `.opencode/bin` was absent from 2026-09-17 until cd0df4a38e restored it, so `compiledRoutingStatusLines` (`plugin:92-95`) failed closed to one "unavailable" line in the status tool | - **The OpenCode status tool reports compiled routing again.** In a checkout without `.opencode/bin` the tool showed compiled routing as unavailable. It now also looks for the routing status under `.skilled/bin`. |

## Claims Checked

### v0.12.0.0

- Title, H1 and `version: 0.12.0.0` agree, and `SKILL.md:5` is `version: 0.12.0.0`. Minor bump from v0.11.2.0 fits "significant new feature" (`SKILL.md:203`).
- Description is one sentence of 172 characters (limit 250, `SKILL.md:259`).
- Identity phrases come first, in the two contract forms (`SKILL.md:264`).
- Expanded format is correct for 11 at-a-glance changes (`SKILL.md:250`). All five required parts are present: opening narrative of 3 paragraphs (cap 5), Why This Release as 3 gain bullets, 11 glance bullets (cap 12), four domain H2s with H4 items, and Upgrade Notes.
- Headings follow the rules: H4 only, the longest is 8 words, `&nbsp;` sits between H4s and `---` sits between H2s only.
- `validate_document.py` printed "VALID ... Total issues: 0". `hvr_scan.py` printed "hard blockers: 0". All 19 oxford-comma candidates were checked by hand, and each is a clause join, not a list comma.
- The "Part of Skilled v4.0.0.2" link resolves to `.skilled/changelog/skilled/v4.0.0.2.md`. Packet 030 is Level 2 (`P030/spec.md:60`).
- Shim kill at 2,500 ms, hook default 2,500 ms: bc111f2af5, spec-kit shim:22 and :118, advisor hook:115.
- The shim wraps the hook for Codex, Cursor and Devin: bc111f2af5, `system-spec-kit/runtime/hooks/codex/shared.ts:103-113` (cursor:152, devin:117 set the same env).
- 100 ms wait for pending log writes: bc111f2af5, advisor hook:226 and :480.
- Pi races the call against budget plus margin, then falls back: bc111f2af5, `hooks/pi/prompt-advisor.ts:12` and :263-284.
- Pi now parses the budget the way the hook does, so a negative value no longer kills a live brief: a6ef03bae7, `hooks/pi/prompt-advisor.ts:16-21`.
- The casual-prompt gate had lost its caller and now runs first: 3a33a5ea47, advisor hook:319-325, `runtime/lib/skill-advisor-brief.ts:402-405`.
- A gold replay found no routable prompt skipped: 3a33a5ea47 body, test file `runtime/tests/prompt-policy-gold-replay.vitest.ts`.
- `options.includeCompiledRoute` defaults to true, the hook sends false, median 65 ms: 3a33a5ea47, `runtime/schemas/advisor-tool-schemas.ts:232`, `runtime/handlers/advisor-recommend.ts:528` and :597, cli-fallback:221.
- A daemon from before the option gets one retry without it: 3a33a5ea47, `runtime/skill-advisor-cli.ts:1444-1455`.
- Status head texts for outage, no-match and skip: e18d6073b8, `runtime/lib/render.ts:482-485`.
- A repeat shrinks to the head, 244 then 26 bytes, and unknown sessions, the kill switch and errors still get the whole text: e18d6073b8 body.
- Pi's debug line names each case: e18d6073b8, `hooks/pi/prompt-advisor.ts:197-200`.
- 10,000-character cap with 64 KiB before: 9ccb4dd416, `runtime/schemas/advisor-tool-schemas.ts:220`, cli-fallback:214, `plugin:53` and :690, old cap at advisor hook:116.
- The Python CLI counts UTF-16 units: 9ccb4dd416, `runtime/scripts/skill_advisor.py:49-50`.
- Prompts go over stdin (`--json -` and `--prompt-stdin`), and the typed forms still work: 9ccb4dd416, `runtime/skill-advisor-cli.ts:477`, `.skilled/bin/compiled-route.cjs:30-35`, cli-fallback:236-237 and :253-256, `runtime/handlers/advisor-recommend.ts:364`.
- The parent-pid lease rule is dropped, and the healthy owner shut itself down at its next heartbeat: cd0df4a38e, `.skilled/bin/system-skill-advisor-launcher.cjs:567`, `P030/009-test-findings-remediation/implementation-summary.md:65`.
- `SYSTEM_SKILL_ADVISOR_DB_DIR` now contains the four state files and gives the child its model-server address: cd0df4a38e, `runtime/lib/freshness/generation.ts:38`, `runtime/lib/daemon/watcher.ts:300`, `P030/009-.../implementation-summary.md:63`.
- Diagnostics carry the runtime and bytes, where Codex, Cursor and Devin were recorded as Claude before: bc111f2af5, advisor hook:256-258, `system-spec-kit/runtime/hooks/codex/shared.ts:108`.
- Metrics folder 0700 and logs 0600, with older files tightened: 9ccb4dd416, `runtime/lib/metrics.ts:184-185`, :285 and :293.
- `advisor_validate` accepts all seven runtimes, where three were accepted before: 9ccb4dd416 diff (old enum `['claude','copilot','opencode']`), `runtime/lib/advisor-runtime-values.ts:10-18`, `runtime/tools/advisor-validate.ts:23`.
- The disabled status names its flag: cd0df4a38e, `runtime/handlers/advisor-recommend.ts:147-163`.
- OpenCode refused the plugin, which now exports only its factory: cd0df4a38e, `plugin:895`, `P030/009-.../implementation-summary.md:61`.
- The status tool exists: `plugin:1408`.
- Transform dedup compares the full block first: e1e4b1227a, `plugin:808`.
- The plugin fallback opens with the same head, and a parity test holds the two together: e18d6073b8, `.opencode/plugins/lib/skill-advisor-render.js:54-57`.
- Docs describe the status line, gate, option, retry and runtime label, and there is a new Pi catalog leaf: 6b0a01f72b, fa4f76d881, `feature-catalog/hooks-and-plugin/pi-prompt-advisor.md` exists.
- The catalog states the 2,200 ms cap: 4aafbde035, `feature-catalog/hooks-and-plugin/claude-hook.md:38`.
- The hook starts the daemon within a bounded window: 6b0a01f72b, cli-fallback:246 (`--no-warm-only`).
- `/create:goal` is in the command inventory: 3fce512201, `runtime/scripts/command-bridges/command-bridges.generated.json:152`.
- Six advisor scenarios re-scoped (CL-001, CL-005, CL-006, CP-003, CP-004, NC-004), and 433 and 457 belong to system-spec-kit: cd0df4a38e, `P030/009-.../implementation-summary.md:71`.
- Two sandbox scenarios tear down without a signal after a 12-second idle exit: 5a37ff619b, 06272727c3, `manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md:36` and :68-90.
- The five CLIs are Pi, OpenCode, Devin, Cursor and Codex: 06272727c3 body.
- The research origin, pi-skill-orchestrator comparison: 5eb9a33763, 4d5721e32f, `P030/spec.md:36`.

### v0.11.2.0

- The title has the no-editorial form `<component> v<version>` (`SKILL.md:258`). Description is one sentence of 179 characters. Identity phrases come first.
- Compact format is correct for 5 changes, a patch and no break. The summary is 2 sentences, 5 glance bullets carry bold lead-ins, and the Upgrade section is present. No H3 appears and the file is well under 40 prose lines.
- `validate_document.py` printed "VALID ... Total issues: 0". `hvr_scan.py` printed "hard blockers: 0", and the 3 comma candidates are clause joins.
- No spec-folder blockquote. That is acceptable, because the entry draws on three packets (041, 028, 029) and the contract asks for the line only when the source is one spec folder (`SKILL.md:482`).
- The files moved to `.skilled/skills/system-skill-advisor/`: ec33385ae5e (the move), a8be338ea6 (paths and documents name `.skilled`).
- The skill graph accepts either root name: a8be338ea6 body, `runtime/lib/skill-graph/metadata-sanitizer.ts:17`.
- The hooks find their flags under their own source root: a099d0c93c diff of `hooks/claude/directive-lifecycle-boundary.ts` and `hooks/claude/user-prompt-submit.ts`, now advisor hook:51.
- The probe tries `.skilled` then `.opencode` and takes shim, bridge and database folder from one root: ad44092f36, cli-fallback:164-167.
- Pi dedup compares the whole delivery: ad44092f36 and 89569a7f81 (restored return), `hooks/pi/prompt-advisor.ts:66-69` and :97.
- The OpenCode plugin below the checkout root now finds the repository root first: 0dde3965d3, `plugin:32` and :297.
- The Repoint upgrade note matches the move in ec33385ae5e.

### Alignment of the twelve older entries (Q3)

- The ten renames are from three-part to four-part names, and the diff shows similarity 83 to 97 percent. The only content changes are in the title, trigger phrases, H1 and advisor versions named in body text. This matches D1 in `goal.md` and `spec.md` section 3.
- Body-text version edits are v0.2.0.0 (three references), v0.3.0.0:21 (`v0.2.0.0`) and v0.8.0.0:19 (`v0.7.0.0`). Each names an advisor version, which D1 allows.
- In v0.11.0.0 and v0.11.1.0 the title took the existing H1's editorial title and the identity phrases moved first. The frontmatter changed and the prose did not.
- v0.5.0.0 has the H1 in `# v0.5.0.0, <title>` form. Its 8-word topic phrase became "prompt-knowledge drift guard" and "drift guard wired into CI", each 6 words or fewer and taken from its H1.
- `grep` for three-part advisor versions (`0.N.N` not followed by `.N`) across the folder found no match. No three-part advisor version is left.
- No SCOPE finding. Outside the folder, `system-spec-kit/runtime/data/trigger-index.json:1964-1975` and `runtime/cli/retrieval/fixtures/corpus-manifest.json:7515-7525` still list the old names. `spec.md` section 6 already plans the post-commit index rebuild for that.

### Considered and not raised (Q4)

- The `.opencode/bin` symlink restored in cd0df4a38e is a repository link, not an advisor file (goal D2).
- f09c000537 and the Codex half of 9ccb4dd416 belong to cli-codex. a8e92f05ca and ed22403e09 belong to deep-review and deep-research. 852e7cb6c2 and the pi-cache-optimizer half of 9ccb4dd416 are outside any changelog component. ac156a7112 belongs to cli-cursor.
- Test-only, internal and trigger-index commits add no user-visible advisor behavior: the log-trim rename in bc111f2af5, the unused import in 8036425eaa, the env read-once in 89569a7f81 (its body says "behavior is unchanged") and every `chore(system-spec-kit)` rebuild.
- In 3fce512201 and 4aafbde035, the orchestrator listed both under v0.11.2.0, but the entries record them in v0.12.0.0 (lines 138 and 136). That placement fits their dates, 2026-09-26 and 2026-09-28.

Counts: WRONG 1, UNSUPPORTED 0, IMPRECISE 6, CONTRACT 4, SCOPE 0, MISSING 1
