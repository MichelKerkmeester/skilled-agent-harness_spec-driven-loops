# Verify: lanes WG5 to WG9 (T022 to T035)

Independent check of the uncommitted lane edits against `HEAD`. No file other than this report was edited.

## Verdicts

- T022 PASS: `manual-testing-playbook.md:40` carries the quoted sentence exactly. `manual-testing-playbook.vitest.ts:56-60` adds the three expectations. The `NNN-` filter runs on `dir/name.md` paths, so it is not vacuous, and the old sentence fails the `toContain`.
- T023 PASS: `manual-testing-playbook.md:30` replaces the paragraph and keeps the marker. `manual-testing-playbook.vitest.ts:69-76` fails on the old text (`recorded into`, `renderer-owned`). `benchmark/` does not exist, which matches "the first recorded run creates that folder".
- T024 PASS: `runtime/tests/README.md:154` row replaced word for word. No semicolon or em dash.
- T025 PASS: `.opencode/plugins/system-skill-advisor.js:1060` jsdoc as quoted. The option feeds only the status field (`:395`, `:1684`), so the new text is true.
- T026 PASS: function, call and spread removed (`system-skill-advisor.js`, old lines 588-604, 657, 669). The plugin's only `response.metadata` reader is `:1522` (freshness). Outside node_modules and dist, `compiledRouteSummary` appears only in `lib/subprocess.ts:55,194,202` (the Python stdout field, unrelated), a local test helper and `skill-advisor-render.js:107` (a differently named export). Four hub catalog docs still describe the field, see finding 4.
- T027 CONCERN: `.opencode/plugins/tests/system-skill-advisor.test.cjs:484-516` is as specified and catches a dropped `command` or `policy`. It cannot catch a dropped `ownerSkillId`, because the owner equals the skill id. See finding 3.
- T028 PASS: `skill-advisor-cli-fallback-envelope.vitest.ts:70-100`. `toMatchObject` covers all three fields, and the file-level `vi.stubEnv('AI_SESSION_CHILD', '')` makes it hold under the child flag.
- T029 PASS: `lib/subprocess.ts:257-266` scans `busyCarry + chunk` before `capOutput` and keeps 64 characters. The longest literal in `SQLITE_BUSY_PATTERN` is 18, so the carry is enough. `sawBusy` is on all three `resolve` calls (`:235`, `:279`, `:296`), and the type makes it required. It is a per-attempt boolean, and the retry stays gated on `attempt === 0` (`:373`), so there is no double count and no second retry. Both tests fail without the change: the cap drops the marker, and in the split case neither write holds it alone. One P2 edge, finding 5.
- T030 PASS: `advisor-recommend.md:31,33,35,37` swap the five line anchors for names as quoted. The named schema fields exist (`advisor-tool-schemas.ts:285,289,305,319,321`), and there are two `includeCompiledRoute === false` checks (`handlers/advisor-recommend.ts:630,705`). Counts are 3 and 2.
- T031 PASS: `doctor-agents-md-embed.yaml:104` appends the sentence. It matches the engine (`agents-md-embed.cjs:1434` prints `ERROR: the restore failed`). The test at `doctor-agents-md-contract.test.cjs:474-480` fails on the old line.
- T032 PASS: `doctor-agents-md-embed.yaml:34` and `_routes.yaml:546` as quoted, matching the engine (`agents-md-embed.cjs:954-955,982`). The test at `doctor-agents-md-contract.test.cjs:485-492` fails on `<timestamp>`. Both YAML files parse. The `;` on `_routes.yaml:546` was there before and is outside the replaced span.
- T033 PASS: `setup.md:82` as quoted. The test at `doctor-setup-contract.test.cjs:85-86` fails on the old text in both directions.
- T034 PASS (with P2 edges): `hook-wiring-check.cjs:115-268` implements the reader as specified. Single quotes are literal, a backslash escapes inside double quotes and outside quotes, and `&&`, `||`, `;`, `|` and newline separate even when stuck to a word. `env` and `/env` are handled with their `NAME=value` and `-` words, as are leading assignments and `node` flags. `bash`, `sh` and `zsh` with a single-dash `c` flag recurse at most two levels (`:264`). The "a mention is not a wired hook" comment is kept (`:103`). The test file only adds cases. The `echo` case would print `ok` under the old reader and each of the seven launches would print `hook-missing`, so all eight are meaningful. Findings 1 and 2 list the edges.
- T035 PASS: `agents-md-check.cjs:651-656` counts `PASS` as expected and non-pointer `INFO` as reported only. The `state` line is unchanged (it is a context line in the diff). No other file reads the `copies as expected` text. `agents-md-check.test.cjs:592` now asserts the exact detail.

No rule breach in these lanes. Added lines name no spec path, task, phase or finding id, no test names `/create:skill` or `/create:sk-skill`, added doc text has no em dash or semicolon, and every changed file belongs to its lane. Nothing here reads holdout prompt text.

## Findings

1. P2. `hook-wiring-check.cjs:131-178,237-257`: these launches read as wired, but none of them runs the script.
   - An unterminated quote, `node "hooks/claude/user-prompt-submit.js`. The loop runs to the end of the input and keeps the word, while bash refuses to parse the line.
   - `node --check <marker>`. Every `-` word is skipped, and a check-only run counts as a launch. The old reader returned false here.
   - `true # ; node <marker>`. The reader does not know about comments.
   - `bash ./x.sh -c "node <marker>"`. `scriptWord` takes a `-c` that appears after the script operand.

   All of these are exotic and none is shipped here. Smallest fix: return no words when a quote is left open, and stop `scriptWord` at the first word that is not a flag and does not follow `-o` or `-O`. The comment and `--check` cases can stay as known limits.
2. P2. `hook-wiring-check.cjs:224-243`: these working launches read as `hook-missing`.
   - `env -u NAME node <marker>`. `-u` is dropped but its argument is not. This repository uses `env -u AI_SESSION_CHILD` often.
   - `{ node <marker>; }`, `(node <marker>)` and `exec node <marker>`.
   - `cd x & node <marker>`, because a lone `&` is not a separator.
   - `node -r mod <marker>`.
   - A backslash-newline continuation.

   This follows the task's own rule, and every hook command the repository ships passes. Smallest fix if wanted: in `commandWords`, also drop the word after `env -u`, `-C` and `-S`, and treat a lone `&`, `{`, `(` and `exec` as command starts.
3. P2. `.opencode/plugins/tests/system-skill-advisor.test.cjs:496,508`: `ownerSkillId: 'sk-doc'` equals `skillId: 'sk-doc'`. `render.ts:228` falls back to the skill id, so the plugin could drop `ownerSkillId` and the case would still pass. The task's claim that it "fails when the plugin drops a field" holds for `command` and `policy` only. Smallest fix: also assert the parsed recommendation before rendering, or use a row whose owner differs from its skill id.
4. P2, outside these lanes. `.skilled/skills/{sk-code,sk-doc,system-deep-loop,cli-external-orchestration}/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:34` still say the decision is "threaded into brief rendering as `metadata.compiledRouteSummary`". T026 removed that field, and nothing ever rendered it. Smallest fix: drop that clause in the four leaves in a follow-up owned by those skills.
5. P2. `lib/subprocess.ts:261`: the trailing `\b` in `\bSQLITE_BUSY\b` matches at the end of a scan buffer. A chunk that ends `SQLITE_BUSY` and continues `_SNAPSHOT` in the next write now counts as busy, which the old whole-string test would not do. These extended codes are busy variants, so a retry there is arguably correct. No fix needed beyond knowing it.

## What was run and what was read

Confirmed by running, all from the worktree, with exit status read:
- `node --test` on `doctor-agents-md-contract`, `doctor-setup-contract`, `hook-wiring-check` and `agents-md-check`: 103 pass, 0 fail.
- `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/system-skill-advisor.test.cjs`: 43 pass, 0 fail.
- `vitest run` on `subprocess-output-cap`, `legacy/advisor-subprocess`, `manual-testing-playbook` and `hooks/skill-advisor-cli-fallback-envelope`: 4 files, 18 tests passed. The fallback envelope file under `AI_SESSION_CHILD=1`: 4 passed.
- `npm run typecheck`: exit 0.
- `node --check` on the three changed JS files: ok.
- `route-validate.sh`: exit 0. `sync-runtime-mirrors --check`: exit 0. `derive-command-bridges --check`: `{"status":"fresh","changed":[]}`.
- PyYAML `safe_load` of both YAML files: ok.
- `hook-wiring-check.cjs --root .`: `ok claude`, `ok codex`, `ok cursor`, `ok devin`, exit 0. I listed every shipped hook command with jq.
- Planning probes `probe-hook-shapes.cjs`, `probe-busy-cap.mts`, `probe-plugin-fields.mts`, `probe-embed-contract.sh`, `probe-catalog-lines.sh`, `probe-playbook-notes.sh` and `probe-a10-count.sh`: each printed its fixed line.
- The findings 1 and 2 shapes: I ran 27 odd inputs through `runsMarker`, loaded from the real file in a scratchpad harness. This included an empty string, a lone backslash, an unterminated quote, a 200 KB input that finished in 14 ms, and depth 2 and depth 3 `-c` nesting. Nothing threw or hung.

From reading only:
- Whether each test fails with its fix reverted. This comes from the code paths, not from a revert.
- Finding 3, from `render.ts:228`.
- Finding 5, from the regex.
- Finding 4, a catalog text read.
