# Iteration 3: The Doctor Surface (routes, workflows, presentation, scripts, tests)

## Focus

Inventory every doctor file that references the embedder, Ollama, the semantic lane, vector coverage or the HF model server, with file:line, and state what each must say or do once the lane is gone. The same pass settles three small checks left open by iteration 2.

Selected interpretation of "what must each say or do after removal": the line or block is deleted with no replacement text, unless a count, a numbered list or a menu changes, in which case the new value is named. Deferred: rewording of docs outside `.skilled/commands/doctor/`, which is iteration 4.

All line numbers were read at commit `44251c5befd`.

## Actions Taken

1. Counted lane-related matches per tracked file under `.skilled/commands/doctor/` (267 tracked files), then under the other tracked doctor surfaces.
2. Listed the matching lines of every sparse file, and separately of the four dense files (the embedder workflow, the skill-advisor presentation, the route contract test, the orphan process check and its test).
3. Read the embedder workflow asset whole, and the full text of the long single-line steps in the setup, install, update, overlay and symlink assets.
4. Traced the route outside the doctor folder: the bridge generator and its outputs, the status flag the doctor passes, the cost script, the runtime mirrors.
5. Ran one grep each for the three open checks from iteration 2.

## Findings

### F1. The embedder route is three delete-whole objects

- The route block is `_routes.yaml` 232 to 249: target, asset name, flags, the Gate 3 location text naming "the user's Ollama model store", two CLI commands and six trigger phrases. [SOURCE: .skilled/commands/doctor/_routes.yaml:232]
- The workflow asset `doctor-skill-advisor-embedder.yaml` is 180 lines and has no other purpose. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:1]
- The cost script `measure-embedder-cost.mjs` is named by the asset as `cost_script`, and its only other tracked mentions are the skill-advisor presentation, the advisor INSTALL-GUIDE and the runtime scripts README. It has no caller besides this route. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:44]

After removal `/doctor:skill-advisor` has six targets: tune, rebuild, skill-graph-freshness, router-reach, skill-budget, parent-skill.

### F2. The skill-advisor router doc and presentation carry the route in seven places

- `skill-advisor.md` line 3 (argument-hint lists `embedder`) and line 61 (target table row). [SOURCE: .skilled/commands/doctor/skill-advisor.md:3] [SOURCE: .skilled/commands/doctor/skill-advisor.md:61]
- `doctor-skill-advisor-presentation.txt` line 16 (menu item 5), line 31 (the `5` to `embedder` mapping), line 65 (valid targets), line 87 (route table row), and section 8 "Embedder Setup Presentation" from line 207 to the end of the file at 306. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:16] [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:207]

After removal the menu loses item 5, so any item numbered above 5 and its mapping row renumber. The items after 5 were not read this iteration; the implementer reads lines 10 to 35 before editing.

### F3. `/doctor:setup` runs an embedder leg, and its doc counts seven legs

- `doctor-setup.yaml` line 60 is the whole "Leg embedder" step. It is deleted. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:60]
- `doctor-setup-presentation.txt`: line 40 (target list row), line 55 (the paragraph rendered under the embedder row), line 64 (repair row), line 108 (troubleshooting row). All four are deleted. [SOURCE: .skilled/commands/doctor/assets/doctor-setup-presentation.txt:40] [SOURCE: .skilled/commands/doctor/assets/doctor-setup-presentation.txt:55]
- `setup.md` line 62 says "seven read-only legs" and names "the embedder check, which reads the semantic lane and the command vectors". It becomes six legs: sk-code, sk-git, trigger-index, runtime-mirrors, advisor, delivery. [SOURCE: .skilled/commands/doctor/setup.md:62]

No doctor contract test asserts the leg count or the embedder leg: a grep of `doctor-setup-contract.test.cjs` for embedder, semantic, legs and seven returned nothing. [INFERENCE: based on the empty grep result over the setup contract test in action 4]

### F4. `/doctor:install` step 5, and the test that binds it to the manifest

- `doctor-install.yaml` line 60 holds the checklist as one sentence; its item 5 is the embedder and item 6 is `/doctor:setup`. [SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:60]
- `doctor-install-presentation.txt` lines 122 and 123 are step 5; line 125 is step 6. [SOURCE: .skilled/commands/doctor/assets/doctor-install-presentation.txt:122]
- `doctor-install-contract.test.cjs` lines 87 to 92 are the embedder entry of `CHECKLIST_STEPS`, and `checklistOwner` at 101 to 106 resolves every step to a manifest route by command and target. [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:88] [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:101]

After removal the checklist has five steps and `/doctor:setup` becomes step 5. Because the test looks each step up in `_routes.yaml`, the route block (F1), this asset, this presentation and this test entry must change in one commit. Removing the route alone leaves a step with no owner.

### F5. Five workflows print an informational "vector coverage" line

Each makes one read-only `advisor_status --include-semantic-health true` call and prints skill and command vector counts.

| Workflow | Step line | Presentation lines |
|---|---|---|
| update apply | `doctor-update-apply.yaml` 212 (`coverage_report` key) | `doctor-update-presentation.txt` 429, 467, 471 |
| overlay apply | `doctor-overlay-apply.yaml` 124 | `doctor-overlay-presentation.txt` 427, 438, 451, 463 |
| overlay repin | `doctor-overlay-repin.yaml` 114 | `doctor-overlay-presentation.txt` 489, 501 |
| symlink link | `doctor-symlink-link.yaml` 102 | `doctor-symlink-presentation.txt` 217, 252 |

[SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:212] [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-apply.yaml:124] [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:114] [SOURCE: .skilled/commands/doctor/assets/doctor-symlink-link.yaml:102] [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:467] [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:427] [SOURCE: .skilled/commands/doctor/assets/doctor-symlink-presentation.txt:217]

After removal: every step line and every presentation line is deleted. Two lines need an edit instead of a deletion:

- `doctor-update-presentation.txt` 429 keeps its last two sentences (the daemon restart and the dry-run skip) and loses the first three. [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:429]
- `doctor-update-presentation.txt` 471 says "omit the vector coverage and advisor daemon lines"; it becomes "omit the advisor daemon line". [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:471]

The `daemon_restart` key at `doctor-update-apply.yaml` 213 and the result line at 468 mention "lane weights". They stay, because the surviving lanes still have weights. [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:213]

No contract test pins these lines: a grep of the update, overlay, symlink and setup contract tests for `advisor_status`, "Vector coverage", "Advisor vector" and `coverage_report` returned nothing. The engines behind them (`symlink-engine.cjs`, `overlay-engine.cjs`) have zero lane matches, so the lines exist only in workflow prose. [INFERENCE: based on the empty grep over the four contract tests and the zero match counts for the two engines in action 5]

### F6. The status input schema is strict, which fixes the removal order

- `AdvisorStatusInputSchema` is closed with `.strict()` and declares `includeSemanticHealth` at line 385. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:381] [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:393]
- The flag is declared in the CLI manifest at line 87 and the tool definition at line 16, and read by the handler at 538, 562 and 579. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:87] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:579]
- Seven doctor files pass the flag: `_routes.yaml` 240, the embedder asset (3 times), `doctor-setup.yaml` 60, `doctor-update-apply.yaml` 212, `doctor-overlay-apply.yaml` 124, `doctor-overlay-repin.yaml` 114, `doctor-symlink-link.yaml` 102. [SOURCE: .skilled/commands/doctor/_routes.yaml:240]

A doctor step that still passes `--include-semantic-health` after the key is removed is refused by the schema instead of ignored. So the doctor edits (F1, F3, F5) land in the same commit as the flag removal, or before it. [INFERENCE: based on the strict schema at advisor-tool-schemas.ts 381 to 393; the CLI's mapping from the flag to the key was not read, so the exact refusal text is unconfirmed. Running `advisor_status --include-semantic-health true` against a build without the key confirms it.]

A second lane-only diagnostic sits next to it: `includeEmbeddingsHealth`, at schema line 386, manifest line 88, tool line 17 and handler line 583, with its own `embeddingsHealthSchema` starting at 395. It probes the embedding provider and belongs to the removal. No doctor file passes it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:386] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:583]

### F7. The route contract test loses its fourth section and keeps the first three

- Constants at 74 to 81 (`EMBEDDER_TARGET`, `EMBEDDER_ASSET`, `EMBEDDER_APPROVAL_PHASE`, `EMBEDDER_APPROVED_COMMANDS`). [SOURCE: .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:77]
- Helpers `embedderRoute` at 193 and `embedderWorkflow` at 202. [SOURCE: .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:193]
- Section "4. THE EMBEDDER SETUP ROUTE" starts at 326 and holds six tests (329, 368, 412, 447, 465 and the assertions through 493). The file is 496 lines and no fifth section header exists, so the section runs to the end. [SOURCE: .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:326]

Sections 1 to 3 survive. `skill_graph_scan` stays in `REQUIRED_ADVISOR_COMMANDS` (line 54), because two other routes declare it at `_routes.yaml` 125 and 147. [SOURCE: .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:54] [SOURCE: .skilled/commands/doctor/_routes.yaml:125]

Unconfirmed: whether `advisor_status` (line 51 of the same list) is still declared on a skill-advisor route once `_routes.yaml` 240 is gone. If the embedder route was its only declaration, the subset test at 259 fails. `grep -n advisor_status .skilled/commands/doctor/_routes.yaml` settles it.

The tests README row at line 53 describes the file in general terms and needs no edit. [SOURCE: .skilled/commands/doctor/scripts/tests/README.markdown:53]

### F8. The command bridge artifacts are generated from `_routes.yaml`, so they are regenerated, not hand-edited

- `derive-command-bridges.cjs` reads `_routes.yaml` (line 25), writes `command-bridges.generated.json` (path at 27, write at 1385) and rewrites marked blocks in source files (write at 1388). It has a `--check` mode (1312). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:25] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1385]
- The embedder bridge appears in four outputs: `command-bridges.generated.json` from 1634, the `GENERATED COMMAND BRIDGES` block of `projection.ts` (block 81 to 1237, the embedder row at 768), the `GENERATED COMMAND ROWS` block of `command-attach.ts` (block 63 to 188, rows 97 and 166), and `skill_advisor.py` 2737 to 2740. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:768] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:97] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2737]
- `scoring-compatibility.json` names the bridge at 266 and 611. The generator holds its path as `COMPATIBILITY_PATH` (line 26). Whether the generator reads it as an input or writes it was not read; if it is an input, those two entries are a hand edit that must precede the regeneration. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:266] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:26]

Order: delete the route block, run the generator, then run `derive-command-bridges.cjs --check` and `command-bridges-drift-guard.vitest.ts` as the gate. This answers part of iteration 2's open question on generator ownership.

A lane remnant inside the generator output: each generated bridge carries an `embeddingText` field (seen at `command-bridges.generated.json` 1639). Iteration 1 already located its writer in the generator (690 to 693 and 1353) and counted 47 fields. So the regeneration in this step only removes the embedder bridge; the field itself goes when the generator is edited, and its readers still need tracing. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1639]

### F9. The orphan process check classifies the HF model server, and three wordings depend on it

- `orphan-process-check.cjs`: the `MODEL_SERVER_SCRIPT_SUFFIXES` constant at 24 to 27 and the classification branch at 232 to 246, which returns `stale-model-server` or `unsupervised-model-server`. [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:24] [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:245]
- Its test: fixtures at 76 to 101, kind assertions at 197 to 211, the classify test at 224 to 268, a row assertion at 308. [SOURCE: .skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:76] [SOURCE: .skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs:224]
- Wording: the scripts README row at 130 ("helper processes and model servers"), `setup.md` 72, and `doctor-setup-presentation.txt` 87, which names `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0`. [SOURCE: .skilled/commands/doctor/scripts/README.markdown:130] [SOURCE: .skilled/commands/doctor/setup.md:72] [SOURCE: .skilled/commands/doctor/assets/doctor-setup-presentation.txt:87]
- Routing: the `/doctor:setup` trigger phrase "model server or helper process still running after the session closed" at `_routes.yaml` 407, and two helper fixtures: `tune.jsonl` 60 (expects `/doctor:setup`) and `heldout.jsonl` 48 ("which environment variable turns off the model server", expects `/doctor:env list`). The heldout file is pinned by a SHA-256 at `doctor-helper-match.test.cjs` 44 and asserted at 510, so editing that row means recomputing the digest. [SOURCE: .skilled/commands/doctor/_routes.yaml:407] [SOURCE: .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/heldout.jsonl:48] [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs:44]

The script itself survives, since it classifies seven other process kinds. After removal the constant, the branch, the two kinds and their test cases are deleted, the three wordings drop "model servers", the trigger phrase becomes "helper process still running after the session closed", and the two fixture rows are dropped or reworded.

This creates an ordering constraint for iteration 5. The orphan check is today the only doctor tool that finds a model server left running on a user machine. Once its classifier is deleted, a server started by an older checkout is invisible to the doctor. So the user-machine cleanup must carry its own process match for `hf-model-server.cjs`, or it must run before the classifier is removed. [INFERENCE: based on the classifier at orphan-process-check.cjs 232 to 246 being the only doctor match for the server script]

### F10. `doctor-phrase-reach.cjs` writes the env var that has no reader

Line 169 sets `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1'`, and the comment at 163 says "semantic embeddings are disabled". Iteration 1 found no reader for this variable. With the lane gone the assignment and the comment clause are both remnants, so the variable is in scope: delete line 169 and the clause at 163. [SOURCE: .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:169] [SOURCE: .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:163]

This answers the carried-forward question "Is `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` in scope": yes. The no-reader claim is iteration 1's and was not rechecked here.

### F11. The runtime mirrors need no hand edit

- `.claude/commands/doctor/` (17 files) and `.cursor/commands/` (17 doctor files) are tracked symlinks (git mode 120000) into `.skilled/commands/doctor/`, and `.opencode/commands/doctor` is one symlink. Their matches are the source files' matches. [INFERENCE: based on `git ls-files -s` reporting mode 120000 for all 17 doctor entries in each of the two folders and for the single `.opencode` entry]
- `.codex/prompts/`, `.pi/prompts/` and `.vibe/prompts/` hold 17 real doctor files each, and none matches the lane pattern (embedder, ollama, semantic lane, vector, model server). [INFERENCE: based on the zero-match result for those three folders in actions 1 and 2]

The gate after the source edits is the existing mirror check, `sync-runtime-mirrors.cjs --check`, which `/doctor:setup` already runs as its runtime-mirrors leg. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:58]

### F12. What the route can have left on a user's machine

Read from the workflow's own mutation list and steps:

- One pulled copy of `nomic-embed-text:v1.5` in the user's Ollama model store. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:71]
- A background `ollama serve` process, started with `OLLAMA_HOST` set and "a readable log". The workflow tells the agent to "record the pid this run started" but names no file for the pid or the log, so neither is recoverable later. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:131]
- Vectors in `skill-graph.sqlite`, written by `skill_graph_scan`. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:73]
- The route never installs Ollama (rule at 166) and refuses to start or pull against a non-local host (step at 130). So an Ollama install and any remote server are the user's own and out of the cleanup. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:130] [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:166]

Design consequence for iteration 5: the model store is shared with whatever else the user runs on Ollama, and nothing records that this route did the pull. The cleanup can detect the model (`/api/tags`, the same probe as step 91) but cannot prove ownership. A silent `ollama rm` could delete a model the user pulled for another tool; an ask-first removal cannot. The same holds for a running `ollama serve`. [INFERENCE: based on the absent marker and the shared model store named at lines 71 and 91 of the workflow]

### F13. References to the route outside the doctor folder

Input for iteration 4, found by tracing the route name and its six trigger phrases:

- `INSTALL-SKILLED.md` 86 to 98 (section), 157 (step table row 5), 342 (`semantic_lane_off` troubleshooting row). [SOURCE: INSTALL-SKILLED.md:86] [SOURCE: INSTALL-SKILLED.md:157] [SOURCE: INSTALL-SKILLED.md:342]
- Advisor `INSTALL-GUIDE.md` 54 and 362. [SOURCE: .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:54]
- Changelogs: `.skilled/changelog/skilled/v4.1.0.0.md` 210 and 770, `v4.2.0.0.md` 77, `system-skilled-doctor/changelog/v1.1.7.0.md` 47 to 49, `system-skill-advisor/changelog/v1.2.0.0.md` 3. [SOURCE: .skilled/changelog/skilled/v4.1.0.0.md:210] [SOURCE: .skilled/skills/system-skilled-doctor/changelog/v1.1.7.0.md:47]
- Feature catalog `scorer-fusion/doctor-command-routing.md` 31, which links to `command-meaning-matching.md`. [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:31]
- The spec-kit trigger index and its fixture carry "embedder setup and cost" as keys: `runtime/data/trigger-index.json` 70806 to 70818 and 113488, `fixtures/phrase-variants.json` 47375 to 47388 and 86846. These index spec packet trigger phrases, so they are regenerated from `specs/` and persist for as long as the historical packets do. [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:70806] [INFERENCE: the keys carry spec document suffixes such as "plan", "tasks" and "implementation summary", which is the shape of packet-derived entries, so they come from packets under specs/ and not from the lane]

The last item matters for the residue check: a repo-wide grep for "embedder" can never reach zero while the trigger index mirrors historical spec packets. The check needs a stated exclusion for `specs/` and for the two index files derived from it, or the operator must decide that historical packets are rewritten.

### F14. The three small checks from iteration 2

1. **`shared/chunking.ts` and `shared/utils/retry.ts`** have no production importer outside the package. The outside importers are tests only: `runtime/tests/chunking-semantic.vitest.ts` 13, `shared/tests/chunking.test.ts` 7, `shared/tests/retry.test.ts` 7. The advisor test `shared-import-specifier-extension.vitest.ts` 57 and 64 names `@spec-kit/shared/utils/retry` only as a string in a specifier-rewrite fixture. So both helpers lose their last production consumer with the package. They are not lane-named, so deleting them is a scope decision, not a remnant fix. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/chunking-semantic.vitest.ts:13] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/shared-import-specifier-extension.vitest.ts:57]
2. **`MEMORY_DB_PATH`** has no reader outside the package in the 25 lines the grep returned. Its setters are the launcher (allowlist entry `SYSTEM_SKILL_ADVISOR_MEMORY_DB_PATH` at 197, the assignment at 344, and a comment at 332 that says it exists for `shared/embeddings/factory.ts`), `.env.example` 96 and a deep-loop test helper at `spawn-cjs.ts` 157. The launcher block 332 to 344 goes with the package. `SPEC_KIT_DB_DIR` is a different case: `worktree-session.sh` exports it at 495 and deep-loop tests set it, so it has setters whose reader was not identified. It stays open. The grep output was capped at 25 lines, so the setter list may be incomplete. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:332] [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:344] [SOURCE: .skilled/bin/worktree-session.sh:495]
3. **The sk-doc validator on a missing registry**: `loadCanonicalModels` guards the read with `existsSync` (line 31), so a deleted `registry.ts` yields an empty canonical set without an error. The file's own comment at 41 and 42 records what an empty set does: "false-positive DRIFT on every cited name". So deleting the registry while keeping the validator turns every cited model name in the docs into a drift finding. The validator is deleted, or given another source, in the same commit as the package. [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:31] [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:41] [INFERENCE: the drift outcome is taken from the comment at lines 41 and 42; the code after line 70 that consumes the set was not read. Running the validator with the registry path absent confirms it.]

## What Each Doctor File Says Or Does After Removal

| File | Lines | After removal |
|---|---|---|
| `_routes.yaml` | 232 to 249 | Block deleted |
| `_routes.yaml` | 407 | Phrase loses "model server or" |
| `assets/doctor-skill-advisor-embedder.yaml` | whole file | Deleted |
| `skill-advisor.md` | 3, 61 | `embedder` dropped from the hint; table row deleted |
| `assets/doctor-skill-advisor-presentation.txt` | 16, 31, 65, 87, 207 to 306 | Menu item, mapping, target name and table row deleted; section 8 deleted; later menu items renumber |
| `assets/doctor-setup.yaml` | 60 | Leg deleted |
| `assets/doctor-setup-presentation.txt` | 40, 55, 64, 108 | Deleted |
| `assets/doctor-setup-presentation.txt` | 87 | Sentence about `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP` deleted |
| `setup.md` | 62, 72 | "six read-only legs", embedder clause dropped; "and model servers" dropped |
| `assets/doctor-install.yaml` | 60 | Item 5 dropped; `/doctor:setup` becomes item 5 |
| `assets/doctor-install-presentation.txt` | 122, 123, 125 | Step 5 dropped; step 6 renumbered to 5 |
| `assets/doctor-update-apply.yaml` | 212 | `coverage_report` key deleted |
| `assets/doctor-update-presentation.txt` | 429, 467, 471 | First three sentences of 429 dropped; 467 deleted; 471 reworded |
| `assets/doctor-overlay-apply.yaml` | 124 | Step deleted |
| `assets/doctor-overlay-repin.yaml` | 114 | Step deleted |
| `assets/doctor-overlay-presentation.txt` | 427, 438, 451, 463, 489, 501 | Deleted |
| `assets/doctor-symlink-link.yaml` | 102 | Step deleted |
| `assets/doctor-symlink-presentation.txt` | 217, 252 | Deleted |
| `scripts/orphan-process-check.cjs` | 24 to 27, 232 to 246 | Constant and branch deleted |
| `scripts/doctor-phrase-reach.cjs` | 163, 169 | Comment clause and assignment deleted |
| `scripts/README.markdown` | 130 | "and model servers" dropped |
| `scripts/tests/skill-advisor-route-contract.test.cjs` | 74 to 81, 193 to about 228, 326 to 496 | Constants, two helpers and section 4 deleted |
| `scripts/tests/doctor-install-contract.test.cjs` | 87 to 92 | Entry deleted |
| `scripts/tests/orphan-process-check.test.cjs` | 76 to 101, 197 to 211, 224 to 268, 308 | Model-server cases deleted |
| `scripts/tests/fixtures/doctor-helper/tune.jsonl` | 60 | Row dropped or reworded |
| `scripts/tests/fixtures/doctor-helper/heldout.jsonl` | 48 | Row dropped or reworded; digest at `doctor-helper-match.test.cjs` 44 recomputed |

Advisor-side files the doctor depends on, changed in the same commit: `runtime/scripts/measure-embedder-cost.mjs` (deleted) and the four generated bridge outputs in F8 (regenerated).

## Questions Answered

- Which doctor routes, YAML workflows, presentation files, scripts and their tests reference the embedder (install, setup, update apply, overlay apply and repin, symlink link, skill-advisor embedder), and what must each say or do after removal?

Answered with three stated gaps: the menu items after item 5 in the skill-advisor presentation (F2), whether `advisor_status` stays declared on a skill-advisor route (F7), and the one unread match in `release-update.cjs` (see Dead Ends).

Also settled from the carried-forward list:

- `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` is in scope (F10).
- `shared/chunking.ts` and `shared/utils/retry.ts` have no production consumer outside the package (F14).
- The validator fails loudly in the wrong direction on an empty canonical set (F14).
- The generator that owns the command bridge outputs (F8).

## Questions Remaining

- Which docs, changelogs, feature catalogs, manual testing playbooks, READMEs, env references, graph-metadata trigger phrases and generated or compiled routing artifacts carry Ollama or semantic-lane remnants?
- What removal order keeps every gate green, how are repo users machines cleaned (pulled model, vector tables, background server, env vars) without a backup, and what residue check proves nothing is left?

Open sub-items:

- Is `scoring-compatibility.json` an input or an output of `derive-command-bridges.cjs`?
- Who reads the `embeddingText` field of each generated bridge? Iteration 1 located its writer.
- Does `SPEC_KIT_DB_DIR` (and its alias) have a reader outside the package?
- Does the residue check exclude `specs/` and the trigger index derived from it, or are historical packets rewritten?
- Does the cleanup remove a pulled model it cannot prove it pulled, silently or after asking?
- Still open from iteration 1: shadow weight renormalization, and the command "meaning" path and its baselines.

## Ruled Out

- Hand-editing the runtime mirrors: the `.claude`, `.cursor` and `.opencode` doctor entries are symlinks into `.skilled`, and the `.codex`, `.pi` and `.vibe` prompt files carry no lane text.
- Looking for a contract test that pins the informational vector coverage lines: the update, overlay, symlink and setup contract tests assert none of them.
- Hand-editing `projection.ts`, `command-attach.ts`, `skill_advisor.py` and `command-bridges.generated.json` for the embedder bridge: `derive-command-bridges.cjs` regenerates them from `_routes.yaml`.

## Dead Ends

- The wide first pattern included "coverage", "embedding" and "vector", which matched 53 doctor files. Most are unrelated: test coverage, the deep-loop coverage graph, `/doctor:agents-md embed`. Files with only those matches are not remnants: `doctor-deep-loop.yaml`, `doctor-skill-advisor-tune.yaml`, `sk-skill-check.cjs` (zero matches on the strict pattern), `doctor-speckit-retrieval.yaml` 48 (describes the retired continuity database, not the advisor lane).
- `release-update.cjs` has one match on the loose pattern (semantic, vector, ollama or embed). The line was not read. It is most likely the word "embed", but that is a guess until the line is read.

## Edge Cases

- Ambiguous input: "what must each say or do after removal" was read as delete-without-replacement unless a count or a numbered list changes. Rewording of surrounding prose for style was left to the implementer.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none. Three items were left unread by budget and are named in Questions Answered.

## Sources Consulted

- `.skilled/commands/doctor/_routes.yaml` (215 to 256, 398 to 410, scan declarations)
- `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml` (whole file)
- `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt` (match listing)
- `.skilled/commands/doctor/assets/doctor-setup.yaml` (52 to 66), `doctor-setup-presentation.txt` (30 to 66, 86 to 88, 104 to 110)
- `.skilled/commands/doctor/assets/doctor-install.yaml` (60), `doctor-install-presentation.txt` (100 to 135)
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` (208 to 214), `doctor-update-presentation.txt` (427 to 431, 460 to 472)
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml`, `doctor-overlay-repin.yaml`, `doctor-overlay-presentation.txt`, `doctor-symlink-link.yaml`, `doctor-symlink-presentation.txt` (match listing and full step lines)
- `.skilled/commands/doctor/setup.md` (60 to 73), `skill-advisor.md`
- `.skilled/commands/doctor/scripts/orphan-process-check.cjs` (15 to 32, 226 to 248), `doctor-phrase-reach.cjs` (155 to 170), `README.markdown` (130)
- `.skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` (40 to 82, 318 to 330, test titles), `doctor-install-contract.test.cjs` (60 to 112), `orphan-process-check.test.cjs`, `doctor-helper-match.test.cjs`, the two helper fixtures, `README.markdown`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` (1 to 40, path and write lines), `command-bridges.generated.json`, `scoring-compatibility.json`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` (764 to 782, block markers), `lib/command-attach.ts` (96 to 98, 165 to 167, block markers), `scripts/skill_advisor.py`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` (378 to 400), `handlers/advisor-status.ts`, `skill-advisor-cli-manifest.ts`, `tools/advisor-status.ts`
- `.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js` (22 to 70)
- `.skilled/bin/system-skill-advisor-launcher.cjs` (192 to 197, 332 to 344), `.skilled/bin/worktree-session.sh`, `.env.example`
- `git ls-files -s` for the runtime mirror folders
- `INSTALL-SKILLED.md`, the advisor `INSTALL-GUIDE.md`, four changelog files, one feature catalog file, the spec-kit trigger index and its fixture (match listing only)

## Assessment

- New information ratio: 0.71
- Basis: 14 findings. F2, F6, F7, F8, F11 and F14 are fully new. F1, F3, F4, F5, F9, F10, F12 and F13 extend items the strategy's Known Context or an earlier iteration already named: iteration 1 listed the cost script, the two status flags and the fact that `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` has writers, and iteration 2 named the orphan check. (6 + 0.5 x 8) / 14.
- Questions addressed: the doctor surface question; four carried-forward sub-questions.
- Questions answered: the doctor surface question, with the three gaps named above.

## Reflection

- What worked and why: reading the full text of the long single-line workflow steps instead of their 300-character grep previews. The steps are one YAML string each, so the preview cut off the part that says whether the line is informational, which decides between "delete" and "reword".
- What worked and why: tracing the route by its trigger phrases, not only by its name. The phrases are what the generator copies, so that grep found the four generated outputs and the generator in one pass.
- What did not work and why: the first count used a loose pattern with "coverage" and "embedding". It ranked unrelated files (deep-loop, agents-md) above real ones and cost a second listing with a stricter pattern.
- What I would do differently: start from the status fields the doctor reads (`semanticLaneHealth`, `coverageComplete`) and the flag it passes. Every real doctor remnant outside the embedder route itself goes through that one flag, so it is the most precise anchor.

## Recommended Next Focus

Sweep the documentation and generated surface outside the doctor folder: the advisor's INSTALL-GUIDE, README, SKILL.md, references, feature catalog and manual testing playbook, `INSTALL-SKILLED.md`, `.env.example` and the ENV references, the changelog files, graph-metadata trigger phrases, and the generated routing artifacts. Start from the 16 files that pass or document `--include-semantic-health` and the files F13 lists. In the same pass, settle three checks with one grep each: whether `scoring-compatibility.json` is a generator input, who reads `embeddingText`, and whether `advisor_status` stays declared on a skill-advisor route. Decide and state the residue check's exclusion rule for `specs/` and the trigger index. Iteration 5 then builds the removal order, the user-machine cleanup and the residue check from the three inventories.
