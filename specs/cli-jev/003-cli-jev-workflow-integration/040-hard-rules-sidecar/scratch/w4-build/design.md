# Build design: hard rules in a `hard-rules.json` sidecar

Written 2026-09-30 from this worktree. Every path, line and count below was read here. `(proposed)` marks a choice this note fixes for the build.

Move summary: each of the nine skills gets `hard-rules.json` beside its `SKILL.md`, `readHardRules(skillMdPath)` reads that sibling, the frontmatter parse is deleted in the same change, and the move is proved by a recorded before-and-after verdict run over a fixed per-skill command corpus.

## 1. Readers

Twelve files reach `readHardRules`. Every one passes a SKILL.md path and expects a rule array back. Keeping the parameter means no call site changes its argument, so the edits below are the engine, its suite, and wording where a file names the old mechanism. Rows the context file missed are marked **missed**.

| File | Line | What it passes | Expects | Move |
|------|------|----------------|---------|------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | `parseHardRules` :29, `readHardRules` :61, `CHECKS` :164, `evaluate` :318 | a SKILL.md path, text to the parse | rule array | engine change |
| `.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | :69-71 | `path.join(projectDir, '.skilled', 'skills', match.packetPath, 'SKILL.md')` | rule array | comment :10, :24, :31 |
| `.skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | :62-64 | the same join, codex root | rule array | comment :10-11 |
| `.skilled/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | :61-67 | the same join, devin root | rule array | comment :11-12 |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` **missed** | :264-265 | `join(ctx.cwd, ".skilled", "skills", shape.packetPath, "SKILL.md")` | rule array | none |
| `.opencode/plugins/cli-dispatch-audit.js` **missed** | :85 (import :32) | `readHardRules(join(sourceRoot, 'skills', match.packetPath, 'SKILL.md'))` | rule array | none |
| `.opencode/plugins/sk-git-preflight-advisory.js` **missed** | :109 (import :18) | the sk-git SKILL.md path under the discovered source root | rule array | none |
| `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | :112 | `path.join(projectDir, '.skilled', 'skills', 'sk-git', 'SKILL.md')` | rule array, filtered by `GIT_CHECKS` | comment :10 |
| `.skilled/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` **missed** | :65-66 | the same sk-git path on `ctx.cwd` | rule array | none |
| `.skilled/skills/sk-git/scripts/lib/advisory-noise-audit.mjs` | :105 | the sk-git SKILL.md path under `repo` | rule array, non-empty or exit 2 | message :113 |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` **missed** | :136, path at :51-54 | `DISPATCH_SKILL_PATH`, the cli-opencode SKILL.md | rule array | none |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | `DISPATCH_SHAPES` :27-47 | not a reader: holds each `packetPath`. Its cli-classifier row already reads `cli-classifier/cli-jev` in this tree, so phase 039 has landed here | n/a | none |

Test files. **missed** marks a row absent from the context file.

| File | Line | What it does | Move |
|------|------|--------------|------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | import :7, reads :34, :42, :57, :96, :105, :144, :157, :182, :490, :503, parse cases :217-220 | asserts rule ids of four skills, the fail-open cases and the check bijection | edit |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | :128, :133-134 | asserts the cli-classifier `packetPath` and that every shape resolves to an existing SKILL.md | none |
| `.skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` **missed** | import :24, `SKILL_MD` :30, read :345, message :346 | the 17 sk-git rules through `readHardRules(SKILL_MD)` | message :346 |
| `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs` | :32, :67, :85 | copies the real SKILL.md into a fixture tree | comment :67, copy :85 |
| `.opencode/plugins/tests/source-root-consumers.test.cjs` **missed** | :26-37, :75-76 | an inline `hard_rules:` fixture packet, then the real sk-git SKILL.md | fixture moves to the sidecar |

Recorded non-readers: `sync-skills-hermes.cjs` matches only `entry.name === 'SKILL.md'` at :61 and copies the frontmatter verbatim through `renderSkill` :139-158 (so the nine `.hermes/skills/<name>/SKILL.md` copies are generated from it, section 5 batch 7). `.hermes/` holds no `readHardRules` caller, so no Hermes runtime reads a rule (grep in `.hermes` returns nothing). The `hardRules` field in `sk-design/sk-design-md-generator/backend/scripts/schema-v3.ts` is a different field on a different schema and stays untouched.

## 2. Sidecar contract

**Name.** `hard-rules.json`, beside each of the nine SKILL.md files. Fixed here, and the build records the name in `goal.md`'s log.

**Top-level shape: a bare JSON array (proposed).** Chosen over `{ "version": 1, "rules": [...] }`. The reader then stays one `JSON.parse` plus one `Array.isArray` check, with no schema surface and no version consumer, because nothing today reads a version and the packet forbids a validator. A version field would be a value with no reader.

**Elements, field for field against today's YAML.** Each element carries exactly the four keys every one of the 50 rules uses: `id`, `check`, `message`, `severity`, all strings. A read of all nine frontmatter blocks found no other key. `severity` is one of `error`, `warn`, `block`, and the nine declare only `error` and `warn`. Order is the declared order. Indentation is two spaces, one object per rule, so a rule's text is a readable diff.

```json
[
  {
    "id": "stdin-redirect-required",
    "check": "stdin-redirect-required",
    "message": "Ad-hoc `opencode run` MUST close/redirect stdin (`</dev/null`).",
    "severity": "error"
  }
]
```

**How the engine finds it.** `readHardRules(skillMdPath)` keeps its parameter and reads `path.join(path.dirname(skillMdPath), 'hard-rules.json')`. All twelve call sites in section 1 pass `<packetPath>/SKILL.md`, so no reader changes its argument. The signature stays as it is because no reader needs the folder for any other purpose, and a folder parameter would buy twelve call-site edits plus a second path convention (proposed).

**Folder guard (proposed).** The reader returns `[]` when `path.basename(skillMdPath) !== 'SKILL.md'`, so a caller that hands in a folder cannot read a parent directory's sidecar. This is one line and it keeps today's out-of-contract behavior fail-open.

**Fail-open.** Any read, parse or shape error returns `[]`, never a throw. Cases: missing file, unreadable file, malformed JSON, empty file, `null`, an object instead of an array, a directory named `hard-rules.json`, a non-string argument. Entries that are not objects or lack `id` or `check` are dropped, which mirrors today's `parseHardRules` filter and keeps a malformed entry out of `evaluate`.

**The engine after the change (proposed sketch).**

```js
const HARD_RULES_FILENAME = 'hard-rules.json';

/** Read the sibling sidecar beside a SKILL.md; [] on any read, parse or shape error (fail-open). */
export function readHardRules(skillMdPath) {
  try {
    if (typeof skillMdPath !== 'string' || path.basename(skillMdPath) !== 'SKILL.md') return [];
    const parsed = JSON.parse(fs.readFileSync(path.join(path.dirname(skillMdPath), HARD_RULES_FILENAME), 'utf8'));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((rule) => rule && typeof rule === 'object' && rule.id && rule.check);
  } catch {
    return [];
  }
}
```

**Frontmatter parsing is removed, not kept.** `stripQuotes` :14-20 and `parseHardRules` :22-58 are deleted, and `parseHardRules` is not kept as an export: a repo-wide `rg -n 'parseHardRules'` finds the engine and its own suite only, no consumer outside this repo. Exports stay `readHardRules`, `evaluate`, `CHECKS`, `KNOWN_CHECKS`. The file header comment is rewritten to describe the sidecar and the dependency-free reason (JSON parses without a YAML or markdown parser), with no spec path, phase number or requirement id.

## 3. Equivalence proof

**Runner (proposed).** `scratch/verify/record-verdicts.mjs` plus `scratch/verify/corpus.json`, both phase scratch, neither in the skill tree. Three modes:

1. `--before`, run from the pre-change state. For each skill it reads the SKILL.md, calls the engine's `parseHardRules(text)`, writes `scratch/verify/before/<skill>.rules.json`, evaluates the corpus and writes `scratch/verify/before/<skill>.verdicts.json`.
2. `--after`, run from the final state. For each skill it `JSON.parse`s the sidecar, writes `scratch/verify/after/<skill>.rules.json`, requires that snapshot to byte-equal the before one, evaluates the same corpus and writes `after/<skill>.verdicts.json`.
3. `--compare` prints one line per skill, `equal <skill> <n> rows`, and exits 1 on any byte difference.

**Canonical form, so byte-equality is meaningful.** Rules are written with their four keys in the fixed order `id, check, message, severity`. Violations are written in engine order with the engine's own key order (`id, severity, message, check, passed`). Each recording is `JSON.stringify(value, null, 2) + '\n'`. Non-ASCII characters stay raw UTF-8, which is what `JSON.stringify` emits.

**Determinism rules.** Every row declares its expected violation ids, and the runner asserts them during both runs, so a corpus that stopped firing fails instead of comparing two empty sets. The runner builds a stub bin directory holding empty executable files named `codex`, `cursor-agent`, `devin`, `pi`, `hermes` and `jev`, and runs every row with that directory first on `PATH`, so the availability checks pass deterministically on any host. A row flagged `path: "poisoned"` runs with `PATH=/nonexistent-dir-for-this-corpus`, which is the only value that makes a `command-v-*-required` check refuse (an empty or missing `PATH` passes by design). The sk-git corpus runs in a throwaway repo built by the runner exactly like `git-preflight-advisory.test.mjs:69-87` (seed commit, one modified tracked file, one untracked file in `src/`), and no absolute path enters a recording.

**Corpus, per skill. `pass` is a clean command, one `refuse` row per `error` rule, `none` a command that triggers no rule.**

**cli-opencode** (3 error rules: stdin, explicit-model, command-flag-for-slash-prompt)
- pass `opencode run -m p/m "task" </dev/null` yields `[]`
- stdin `opencode run -m p/m "task"` yields `stdin-redirect-required`
- model `opencode run "task" </dev/null` yields `explicit-model-required`
- slash `opencode run -m p/m "/memory:search q" </dev/null` yields `command-flag-for-slash-prompt`
- none `git status` yields `[]`

**cli-claude-code** (1 error rule: stdin)
- pass `claude -p "task" --dangerously-skip-permissions </dev/null` yields `[]`
- stdin `claude -p "task" --dangerously-skip-permissions` yields `stdin-redirect-required`
- warn path `claude -p "task" </dev/null` yields `non-interactive-permission-mode-risk`
- none `git status` yields `[]`

**cli-codex** (2 error rules: stdin, availability)
- pass `codex exec -m gpt-5.5 "task" </dev/null` yields `[]`
- stdin `codex exec -m gpt-5.5 "task"` yields `stdin-redirect-required`
- availability `codex exec -m gpt-5.5 "task" </dev/null` with poisoned `PATH` yields `command-v-codex-required`
- none `git status` yields `[]`

**cli-cursor** (2 error rules: stdin, availability)
- pass `cursor-agent -p "task" </dev/null` yields `[]`
- stdin `cursor-agent -p "task"` yields `stdin-redirect-required`
- availability `cursor-agent -p "task" </dev/null`, poisoned `PATH`, yields `command-v-cursor-agent-required`
- none `git status` yields `[]`

**cli-devin** (2 error rules: stdin, availability)
- pass `devin -p "task" </dev/null` yields `[]`
- stdin `devin -p "task"` yields `stdin-redirect-required`
- availability `devin -p "task" </dev/null`, poisoned `PATH`, yields `command-v-devin-required`
- none `git status` yields `[]`

**cli-pi** (4 error rules: stdin, availability, offline, provider-qualified model)
- pass `pi -p --offline --model llmgateway/glm-5.3-flash "task" </dev/null` yields `[]`
- stdin `pi -p --offline --model llmgateway/glm-5.3-flash "task"` yields `stdin-redirect-required`
- availability the pass command, poisoned `PATH`, yields `command-v-pi-required`
- offline `pi -p --model llmgateway/glm-5.3-flash "task" </dev/null` yields `pi-offline-required`
- model `pi -p --offline --model glm-5.3-flash "task" </dev/null` yields `pi-provider-qualified-model`
- none `git status` yields `[]`

**cli-hermes** (6 error rules: stdin, availability, yolo, ignore-rules, explicit-toolsets, worktree)
- pass `hermes chat -Q --oneshot --query-file p.md --provider llmgateway --model deepseek-v4.1-flash --ignore-rules --source tool -t terminal,file,skills,todo,web --yolo` yields `[]`
- stdin `hermes chat -Q --oneshot -q "task"` yields `stdin-redirect-required`
- availability the pass command, poisoned `PATH`, yields `command-v-hermes-required`
- yolo the pass command without `--yolo` yields `hermes-yolo-required-for-writes`
- rules the pass command without `--ignore-rules` yields `hermes-ignore-rules-required`
- toolsets the pass command with `-t search,todo` yields `hermes-explicit-toolsets-required`
- worktree the pass command plus ` --worktree` yields `hermes-no-worktree-flag`
- none `git status` yields `[]`

**cli-jev** (6 error rules: availability, stdin, choice cardinality, score cardinality, value-with-run, custom endpoint)
- pass `jev noul -q "Is it urgent?" -s @state.txt </dev/null` yields `[]`
- availability the pass command, poisoned `PATH`, yields `command-v-jev-required`
- stdin `jev noul -q "Is it urgent?" -s -` yields `jev-stdin-bounded`
- choice `jev choice -q "Which queue?" -s @state.txt -o only=the only option` yields `jev-choice-option-cardinality`
- score `jev score -q "How severe?" -s @state.txt -l only` yields `jev-score-level-cardinality`
- value `jev run @request.json --value` yields `jev-value-not-with-run`
- endpoint `jev noul -q "Is it urgent?" -s @state.txt --provider custom` yields `jev-custom-endpoint-required`
- none `git status` yields `[]`

**sk-git** (0 error rules, all 17 warn, checked with `GIT_CHECKS` and `createGitContext`)
- pass `git status` yields `[]`
- warn `git commit --only src -m x` yields `commit-scope-drops-untracked`
- warn `git reset --hard HEAD` yields `reset-hard-discards-changes`
- none `npm install` yields `[]`
- The remaining 14 ids stay covered by `git-rule-checks.test.mjs`, which exercises every `GIT_CHECKS` entry against real temporary repositories.

**Trap for the executor.** Sixteen messages contain non-ASCII (em dash U+2014, ellipsis U+2026) and several contain apostrophes inside double-quoted YAML scalars. The sidecars are emitted from the before rule snapshots with `JSON.stringify(rules, null, 2)`, never retyped, so the parsed values match field for field. A hand-written `it's` or a normalized dash is a difference the proof plan rejects.

## 4. Test cases

One line per case, `name | input | expected`.

Engine, in `dispatch-rule-checks.test.mjs`:
- sidecar present | a fixture SKILL.md beside a `hard-rules.json` with two rules | both rules, in file order
- sidecar missing | the SKILL.md alone | `[]`
- sidecar empty | `hard-rules.json` holding `[]` | `[]`
- sidecar null | `null` | `[]`
- sidecar object not array | `{"rules":[...]}` | `[]`
- sidecar malformed | `{` | `[]`, no throw
- sidecar entry missing id or check | `[{"message":"x","severity":"warn"}]` | `[]`
- sidecar is a directory | `hard-rules.json/` | `[]`
- folder argument | the skill folder instead of its SKILL.md | `[]`
- real rules by id | `cli-opencode`, `cli-claude-code`, `cli-pi`, `cli-hermes` SKILL.md paths | the same ids :34-45, :144, :182 assert today
- check bijection | every packet's sidecar | every declared `check` is in `KNOWN_CHECKS`, and every `KNOWN_CHECKS` id is declared (both keep working through the sidecar)

Adapters and sk-git readers, all unchanged code: their suites stay green, `dispatch-audit.test.mjs` keeps asserting every shape resolves to a SKILL.md, `git-rule-checks.test.mjs` keeps `rules.length >= 10` through the sidecar, `git-preflight-advisory.test.mjs` keeps advising from a fixture tree once the fixture copies the sidecar beside the SKILL.md.

OpenCode plugin test: the inline `BLOCKING_PACKET` SKILL.md loses its `hard_rules:` key and a `hard-rules.json` sibling is written instead, so `source-root-consumers.test.cjs:59-72` still blocks by the packet's rules. The sk-git test at :74-86 copies the real SKILL.md and now also copies the real `hard-rules.json`. `dispatch-rule-checks.test.mjs` `ENFORCEMENT GUARD` tests keep passing because `readHardRules` now reads the sibling for the packets they enumerate.

## 5. Build steps

One executor. Batches run in this order, and batches 2, 4 and 5 land inside one change.

**Batch 1, record the before verdicts (no production file touched).**
1. Author `scratch/verify/corpus.json` and `scratch/verify/record-verdicts.mjs` (section 3).
2. Run `node specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/scratch/verify/record-verdicts.mjs --before` from the repo root. Check: nine `before/<skill>.rules.json` snapshots with counts 17, 8, 8, 5, 4, 2, 2, 2 and 2, nine verdict files, and every row's `expect` matched.
3. Capture the five suites' baseline pass and fail counts in the same run log.

**Batch 2, the engine and its suite.**
4. Edit `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`: rewrite the header :1-7, delete `stripQuotes` :14-20 and `parseHardRules` :22-58, replace `readHardRules` :60-67 with the sidecar reader of section 2.
5. Edit `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`: drop `parseHardRules` from the import :7, retitle the :33 test, replace :217-220 with the sidecar cases of section 4.
6. Check: `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` exits 0 with 0 failed, and `rg -n 'parseHardRules' .skilled .opencode .pi .claude .codex .devin` returns no hit.

**Batch 3, adapters and readers.**
7. Comment-only edits: `claude/dispatch-preflight-lint.mjs` :10, :24, :31; `codex/dispatch-preflight-lint.mjs` :10-11; `devin/dispatch-preflight-lint.mjs` :11-12; `sk-git/scripts/hooks/git-preflight-advisory.mjs` :10. Each says the rules come from the sidecar beside the SKILL.md.
8. Message edit: `advisory-noise-audit.mjs` :113 loses the frontmatter wording and names `hard-rules.json`.
9. Record the readers left byte-identical with their lines from section 1: the pi adapter, the pi twin, both OpenCode plugin copies, the devin permission policy, `dispatch-audit.mjs`.

**Batch 4, move the nine rule sets.**
10. Emit each `hard-rules.json` from the matching `before/<skill>.rules.json` snapshot, in the skill folder beside its SKILL.md. Never retype a message (section 3 trap).
11. Remove the `hard_rules` block from each of the nine SKILL.md files. It is the last frontmatter key in all nine, so the edit deletes the `hard_rules:` line through the last rule line and leaves `version:` as the last key. Every other byte stays.
12. Edit `.skilled/skills/sk-git/SKILL.md:313`, the one body line that says the block at the top of the file is executed, to point at the sidecar. This is the single body edit among the nine (section 7 Q5).
13. Check: `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` prints nothing, and the nine sidecars hold 17, 8, 8, 5, 4, 2, 2, 2 and 2 rules.

**Batch 5, tests that read a SKILL.md.**
14. `git-rule-checks.test.mjs` :346 message wording.
15. `git-preflight-advisory.test.mjs`: comment :67 and copy the real sidecar at :83-85.
16. `source-root-consumers.test.cjs`: fixture at :26-37, sk-git copy at :74-86 (section 4).
17. Check: `node --test` on all five suite files exits 0 with 0 failed, at or above the batch 1 baseline.

**Batch 6, docs.**
18. `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md`: the field summary :182-194 and the SKILL.md template :394-406 say required fields are `name`, `description`, `allowed-tools` and that hard rules live in `hard-rules.json` beside the skill, never as a frontmatter key.
19. `.skilled/skills/sk-doc/sk-create-frontmatter/SKILL.md`: the NEVER list :194-201 gains one line, no `hard_rules` frontmatter key, hard rules live in the sidecar (a contract change recorded in the contract itself).
20. `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md`: required-fields table :78-86 and Key Rules :100-104 point at the sidecar.
21. Wording sweep, one line each, in the files where a reader is described as parsing frontmatter: `.skilled/hooks/dispatch/README.md` :16, :26, :86, :104, :163; `.skilled/hooks/permission-policy/README.md` :46, :86; `.skilled/skills/sk-git/scripts/lib/README.md` :17, :39; `.skilled/skills/sk-git/scripts/hooks/README.md` :17, :31, :72, :116, :184, :186; `.skilled/skills/sk-git/manual-testing-playbook/git-preflight-advisory/advisory-fires-on-silent-scope-drop.md` :76; the six `git-preflight-advisory.md` files under `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin` and `cli-pi` at the line that names the frontmatter; `cli-hermes/feature-catalog/dispatch-guards/hard-rule-preflight-checks.md` :49; `cli-classifier/cli-jev/feature-catalog/dispatch-guards/dispatch-guards.md` :43; `sk-code/sk-code-opencode/references/shared/hooks.md` :83. `.pi/extensions/README.md` :64 names `readHardRules` only and needs no change.
22. Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 and prints VALID on every changed doc of steps 18-20, and the same on the swept docs whose class the validator covers.

**Batch 7, Hermes sync.**
23. Run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` once. `renderSkill` copies the frontmatter verbatim, so removing the key drifts all nine `.hermes/skills/<name>/SKILL.md` copies and the sync regenerates them.
24. Check: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS: <n> Hermes skill copies in sync` with the same `n` as before the change, exit 0.
25. No sidecar is copied into `.hermes/skills/`: no Hermes runtime reads a rule (section 1), and `listSkillFiles` matches `SKILL.md` only at :61. Record this finding for REQ-007.

**Batch 8, record the after verdicts and compare.**
26. Run `record-verdicts.mjs --after`, then `--compare`. Check: one `equal <skill> <n> rows` line per skill, exit 0, and the rule snapshots byte-equal.
27. Record every gate result, the per-skill counts and the comparison in `implementation-summary.md` and `goal.md`'s log.

## 6. Proof plan

One row per criterion in `goal.md`, all commands from the repo root. `S` is a skill folder, `V` is `specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/scratch/verify`.

| Criterion | Command | Expected |
|-----------|---------|----------|
| 1. Nine sidecars, no `hard_rules:` in any SKILL.md | `for s in <the nine skill folders>; do test -f "$s/hard-rules.json" \|\| echo "MISSING $s"; done` and `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills` | no `MISSING` line, and the grep prints nothing and exits 1. Counts from `V/before/*.rules.json`: 17, 8, 8, 5, 4, 2, 2, 2, 2 |
| 2. Engine, four adapters and both sk-git scripts read the sidecar, suites pass | `rg -n 'readHardRules\|parseHardRules' --glob '*.mjs' --glob '*.ts' --glob '*.js' --glob '*.cjs' .` reviewed against section 1, then `node --test` on the five test files | every section 1 row reaches the sidecar through the engine, `parseHardRules` absent, each suite exits 0 with 0 failed at or above the baseline |
| 3. Before and after verdicts identical | `node <V>/record-verdicts.mjs --compare` | one `equal <skill> <n> rows` line per skill, exit 0, the empty-verdict rows included |
| 4. sk-doc contract names the sidecar, validate_document VALID | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <each changed doc>` | `VALID` and exit 0 on every changed doc, `hard-rules.json` named in the contract and the template |
| 5. Hermes in sync and the phase passes strict validation | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar --strict` | `PASS: <n> Hermes skill copies in sync` with the pre-change `n`, then `RESULT: PASSED` |

The orchestrator runs the suites, the spec validation and every commit after the executor returns.

## 7. Open questions

1. **Does `parseHardRules` survive as an export?** No (proposed). A repo-wide grep finds the engine and its own suite only, and the packet requires no dual read. The suite's parse cases become sidecar cases.
2. **Array or object with a version field?** Bare array (proposed). It keeps the parse at `JSON.parse` plus `Array.isArray`, and a version field would carry no consumer today, which the packet's no-schema-validator rule forbids.
3. **Does a Hermes copy need the sidecar?** No (proposed). No `.hermes` file calls `readHardRules`, and the sync copies `SKILL.md` only. The nine generated copies must still be regenerated, because `renderSkill` copies the frontmatter verbatim and `--check` compares the whole text.
4. **SKILL.md path or folder parameter?** SKILL.md path (proposed). All twelve readers pass a SKILL.md path, and the sibling read keeps every call site byte-identical. The `path.basename` guard closes the folder case.
5. **`sk-git/SKILL.md:313` says the block at the top of the file is executed.** It becomes false when the key leaves. Proposed: edit that one sentence to point at `hard-rules.json`. This is the single deviation from "every other byte kept" and the orchestrator sees it here before the build.
6. **The wording sweep beyond `spec.md`'s Files to Change table.** The 20-odd README and feature-catalog lines that say rules live in frontmatter were found with `rg -n 'hard_rules' --glob '*.md' .skilled`. Proposed: fix each one-line claim in batch 6, because a doc that describes the old mechanism is a defect the moment the move lands, and the packet's operator brief says to document where hard rules live. If the orchestrator prefers the narrower file list, only steps 18-20 are required and step 21 is skipped and recorded.
7. **Does the scratch runner stay or go at closure?** Proposed: keep `scratch/verify/` with both recordings and the runner for review, since REQ-004's proof lives there, and scratch is excluded from the Hermes sync (`EXCLUDED_DIRECTORIES` holds `scratch`) and from `validate.sh`'s doc checks. It is not part of the skill tree.
