# Verdict and fix proposal: `/doctor:speckit speckit-retrieval`

## Verdict

**fix**

Not `retire`: every script, fixture, path and command this target depends on exists, and the doctor's central lane works end to end on this checkout. Not `keep`: six of the things it says no longer match the system it inspects, and one of them (the `--incremental` recommendation) promises a capability that the command it recommends does not have.

## Evidence for the verdict

Ran read-only or dry-run forms of every step the workflow names. Full command lines, outputs and exit codes: `doctor-run.log`. Item-by-item status: `reality-check.md`.

**What still works, so the target is worth repairing rather than retiring**

| Check | Result |
|---|---|
| Index present, readable, schema current | `test -f` exit 0; `schemaVersion 2` == `TRIGGER_INDEX_SCHEMA_VERSION` (`runtime/cli/retrieval/lib/artifact.mjs:146`), enforced by the lookup through `assertTriggerIndexShape` (`lookup-trigger-index.mjs:84`) |
| Lookup exit contract (0 hit / 1 clean no-hit / 2+ error) | 23 prompts from `fixtures/prompt-set.json` exited 0 or 1; a missing index exited 2 with `ENOENT` on stderr — a no-hit and a broken invocation are distinguishable |
| Committed pair consistency | `trigger-index.json`, `fixtures/corpus-manifest.json`, `fixtures/generation-diagnostics.json` and `fixtures/phrase-variants.json` all carry `manifestHash 6c0344fd…` |
| ripgrep recipe, flags verbatim from conventions §2.2 | exit 0, 15 paths; with a nonexistent root, exit 2 with stderr |
| Ambient config | `RIPGREP_CONFIG_PATH` unset, `~/.ripgreprc` absent; the recipe with and without `--no-config` returned the same 15 paths |
| Cold-lookup budget (200 ms) | fresh measurement `p95Ms 104.256`, exit 0, `withinBudget true`; committed fixture untouched |
| Gate 1 reach | `grep -c lookup-trigger-index.mjs AGENTS.md` → 1; `sync-gate1-pointers.cjs --check` → exit 0, `PASS: 2 instruction files carry the root Gate 1 lookup`; Pi's loader still lists `AGENTS.md` (`resource-loader.js:116`) |
| Router integrity | `route-validate.sh` → exit 0, `OK: route-validate — 10 routes validated, 2 warnings` |
| Sampled drift checks | 0 anchor-marker imbalances and 0 phrase-drift files across all 29 staleness candidates |

**What no longer matches**

| # | Claim in the doctor | Reality | Evidence |
|---|---|---|---|
| 1 | "Claude reads the root AGENTS.md through the CLAUDE.md symlink" (`doctor-speckit-retrieval.yaml:144`) | `CLAUDE.md` does not exist, here or in the main checkout; it was deleted as a one-line symlink on 2026-09-24. `README.md:1396` states the repository ships none and that Claude reads `AGENTS.md` directly, which is what `sync-gate1-pointers.cjs:7` says too | `ls -la CLAUDE.md` → `No such file or directory`; `git show --stat 0c40639821` |
| 2 | The pollution signal reads `folder-token-fallback` from the committed diagnostics (`:136`) | The class exists in the judge but is unreachable at generation, so the bucket can never be non-zero: `generate-trigger-index.mjs:260` calls `judgeTriggerPhrase(normalized)` with no context, and `lib/phrase-judge.mjs:62,100-103` returns that class only when `context.folderTokens` contains the token. The committed `phraseQuality` carries six classes, not seven | `node -e` over `fixtures/generation-diagnostics.json`; direct read of both call sites |
| 3 | "the five exclusion globs" (`:159`) | Section 2.2 lists one include glob (`*.md`) and **four** exclusions (`z_archive`, `node_modules`, `.git`, `scratch`) — `retrieval-conventions.md:95-98` | read of `retrieval-conventions.md` §2.2 |
| 4 | Forbidden target `.skilled/commands/doctor/assets/doctor_*.yaml` (`:78`) | Matches zero files; all 14 workflow assets use a hyphen. The same underscore form appears in the router (`speckit.md:86`) and in the manifest's own removal instructions (`_routes.yaml:29`), so the guard silently protects nothing | `ls …/assets/doctor_*.yaml \| wc -l` → 0; `ls …/assets/doctor-*.yaml \| wc -l` → 14 |
| 5 | `--incremental` is an accepted flag, the setup prompt offers "Incremental — only changed files (default)", and phase 2 recommends "an incremental regeneration via /doctor:update" (`_routes.yaml:36`, `:209`, presentation `:112-120`) | No consumer exists anywhere in the repository, and the command it names has no incremental mode: `.skilled/commands/doctor/assets/doctor-update.yaml:369` documents a "full regeneration … with no daemon and no incremental mode" | `rg -n -- "--incremental" .skilled` → only the route and the validator's own copy; direct read of the update asset |
| 6 | The shared presentation carries a `--scope` setup prompt (`stale / missed / bloat / all / excludes`) sitting directly under the speckit-retrieval prompt | No target accepts those values (`--scope` is `research\|review\|council\|both\|all` for deep-loop and `all\|explicit\|derived\|lexical` for parent-skill), and this target does not accept `--scope` at all. The block has no target heading, so it reads as this target's | `doctor-speckit-presentation.txt:123-133`; `_routes.yaml:66,83`; `route-validate.sh` H1 warning names only deep-loop and skill-advisor as `--scope` owners |

Two claims that look stale but are **not** defects, recorded so they are not re-opened:

- `fixtures/latency-report.json` pins a different `manifestHash` (`c0806077…`) and an `indexPath` in a worktree and layout that no longer exist. `runtime/cli/retrieval/README.md:79` states that the five frozen acceptance fixtures pin their snapshot hash, that regeneration does not refresh the pin, and that a mismatch is expected and is not a staleness signal. The doctor's four-way compare correctly excludes them (`:157,180`).
- `pass_policy.index_regenerates_byte_identical` (`:40`) is not verifiable inside this workflow's own write boundary (report and state log only). The generator's scratch-build contract (`--out` beside a non-committed path leaves `fixtures/` untouched) would allow the check; the doctor does not name it. Optional edit below.

## Minimal edits

Each edit is the smallest change that removes the mismatch. Line numbers are from this checkout. Re-run `bash .skilled/commands/doctor/scripts/route-validate.sh` after applying: it enforces parity between the manifest, the router table and the presentation displays.

### 1. `_routes.yaml`, route `speckit-retrieval` (lines 35–36) — remove the dead flag

Old:

```yaml
    setup_vars: [execution_mode, intent, incremental]
    allowed_flags: ["--incremental=true|false"]
```

New:

```yaml
    setup_vars: [execution_mode, intent]
    allowed_flags: []   # no per-target flag: regeneration is a full pass owned by /doctor:update
```

### 2. `doctor-speckit-retrieval.yaml` (lines 51–53) — drop the setup input

Old:

```yaml
  execution_mode: "[EXECUTION_MODE] - INTERACTIVE (this YAML)"
  intent: "[INTENT] - DIAGNOSE (this YAML)"
  incremental: "[INCREMENTAL] - true|false (informational; no regeneration in this command)"
```

New:

```yaml
  execution_mode: "[EXECUTION_MODE] - INTERACTIVE (this YAML)"
  intent: "[INTENT] - DIAGNOSE (this YAML)"
```

### 3. `doctor-speckit-retrieval.yaml` (lines 59–64) — drop the field-handling block it fed

Old:

```yaml
field_handling:
  defaults:
    incremental_empty: "false"
  incremental_policy:
    true: "diagnostic input only; recommend an incremental regeneration when medium staleness is detected"
    false: "diagnostic input only; recommend a full regeneration when high-severity staleness is detected"
```

New: delete the block. Nothing else references `incremental_policy`, and the recommendation is already driven by `severity_max` in phase 2.

### 4. `doctor-speckit-retrieval.yaml` (line 209) — stop recommending a mode that does not exist

Old:

```yaml
      - "If severity_max == medium (index older than corpus, manifest hash mismatch, or corpus pollution) → recommend an incremental regeneration via /doctor:update, or a corpus fix first when the signal is pollution: the phrases never rank, so the cost is precision and parse time, not a wrong answer"
```

New:

```yaml
      - "If severity_max == medium (index older than corpus, manifest hash mismatch, or corpus pollution) → recommend a regeneration via /doctor:update, or a corpus fix first when the signal is pollution: the phrases never rank, so the cost is precision and parse time, not a wrong answer; the generator publishes the whole corpus in one pass, so there is no incremental variant to offer"
```

### 5. `doctor-speckit-presentation.txt` (lines 110–120) — delete the incremental prompt

Old: the whole `### Trigger-Index Regeneration Preference` block, from that heading through "Accept `1`, `I`, or Enter as `incremental=true`. Accept `2`, `F`, or `full` as `incremental=false`."

New: a heading-less single sentence replacing it, so §3 keeps its shape for targets that do have setup prompts:

```text
The `speckit-retrieval` target never regenerates the index itself and asks for no regeneration mode; it names the command that does, `/doctor:update`, which republishes the whole corpus in one pass.
```

### 6. `doctor-speckit-presentation.txt` (lines 123–133) — delete the orphaned `--scope` prompt

Old: the line "Ask this only when `--scope` was not passed and the operation needs a scope." plus its five-option code block and the line "Accept `1-5`; empty defaults to `all`."

New: delete. The block belongs to no target; if a graph-scoped doctor needs it, it should carry that target's heading and accept that target's documented values. Removing it also stops it reading as this target's prompt.

### 7. `doctor-speckit-retrieval.yaml` (line 144) — describe Claude's path as it is now

Old:

```yaml
    note: "Claude reads the root AGENTS.md through the CLAUDE.md symlink and Pi loads it from the working directory, so those two inherit; Codex and the Cursor rule that Cursor and Devin share carry generated pointer blocks. Reach is per runtime: a pointer, a verified inheritance or a session-start injection each count as a path."
```

New:

```yaml
    note: "Claude reads the root AGENTS.md directly and Pi loads it from the working directory, so those two inherit; Codex and the Cursor rule that Cursor and Devin share carry generated pointer blocks. Reach is per runtime: a pointer, a verified inheritance or a session-start injection each count as a path."
```

### 8. `doctor-speckit-retrieval.yaml` (line 136) — name only the classes the artifact can carry

Old:

```yaml
    detection: "The phraseQuality bucket of the committed generation-diagnostics.json counts every negative class the phrase judge reports (single-token, numeric-only, generic-workflow-word, stop-word-only, prose-sentence, editor-fallback and folder-token-fallback) per retrieval-conventions.md section 8; any non-zero bucket is the signal, read from the committed artifact rather than sampled from stale packets"
```

New:

```yaml
    detection: "The phraseQuality bucket of the committed generation-diagnostics.json counts every negative class the generator can attribute to a committed phrase (single-token, numeric-only, generic-workflow-word, stop-word-only, prose-sentence and editor-fallback) per retrieval-conventions.md section 8; any non-zero bucket is the signal, read from the committed artifact rather than sampled from stale packets. The judge's folder-token-fallback class needs the owning packet's folder tokens, which the generator does not pass, so it is reported by the per-document validator and never appears in this bucket"
```

### 9. `doctor-speckit-retrieval.yaml` (line 159) — count the globs correctly

Old:

```yaml
      - "Run the path-only recipe from retrieval-conventions.md section 2.2 for a known phrase, with the exact flags that section lists (--no-config --hidden and the five exclusion globs); record exit status and path count"
```

New:

```yaml
      - "Run the path-only recipe from retrieval-conventions.md section 2.2 for a known phrase, with the exact flags that section lists (--no-config --hidden, the include glob '*.md' and the four exclusion globs z_archive, node_modules, .git and scratch); record exit status and path count"
```

### 10. Three files, one naming defect — the workflow-asset glob

| File and line | Old | New |
|---|---|---|
| `doctor-speckit-retrieval.yaml:78` | `- ".skilled/commands/doctor/assets/doctor_*.yaml"` | `- ".skilled/commands/doctor/assets/doctor-*.yaml"` |
| `speckit.md:86` | `the resolved \`doctor_<target>.yaml\`` | `the resolved \`doctor-<target>.yaml\`` |
| `_routes.yaml:29` | `delete the route AND its corresponding assets/doctor_<target>.yaml` | `delete the route AND its corresponding assets/doctor-<target>.yaml` |

### 11. Optional: make the staleness verdict evidence-backed

`doctor-speckit-retrieval.yaml` phase 0 (`:152-162`) and phase 1 (`:185`) detect `index_older_than_corpus` by mtime only. On this checkout that fired on 29 files whose mtimes are all within 24 ms of the index write (checkout noise), while the real drift is 86 documents and only `generate-trigger-index.mjs --check` saw it. Adding one read-only activity to phase 0 would replace the heuristic with the authoritative answer:

```yaml
      - "Bash: node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json; exit 0 = the index matches the corpus, 1 = at least one document is stale or an index path is obsolete, 2 = bad invocation or unreadable index. It writes nothing and costs one corpus walk"
```

and one line in phase 1, so the mtime sample is reported as supporting evidence rather than as the verdict. This is an addition, not a mismatch repair — the six defects above are what the verdict rests on.

### Optional: state who proves byte-identical regeneration

`doctor-speckit-retrieval.yaml:40` — old comment `# two generator runs must hash the same`; new comment `# two generator runs must hash the same; /doctor:update owns the proof, since only a build writes the index`. Alternative, if the doctor should own it: keep the policy and let it direct two `--out` builds at packet scratch, which the generator's scratch-build contract says leaves the tracked fixtures alone.

## FINDINGS — defects in the subsystem the doctor inspects

Recorded, not fixed. None of these is caused by the doctor; all were read or run directly.

| # | Finding | Evidence |
|---|---|---|
| 1 | **The committed trigger index is stale.** 86 documents differ from the committed index and the corpus hash has moved on, so the doctor's medium-severity verdict for this checkout is correct on content, not just on mtime | `generate-trigger-index.mjs --check --json` → exit 1, `fresh: false`, `staleDocuments` 86, `missingDocuments` 86, `obsoletePaths` [], `corpusManifestHash 4a2e8774…` vs `indexManifestHash 6c0344fd…`, `documentsScanned 22938`, 17.9 s |
| 2 | **`folder-token-fallback` is unreachable at generation, so one phrase gets two labels depending on which reader looks.** The generator judges every unique normalized phrase without folder context (`generate-trigger-index.mjs:260`), while the per-document validator passes it (`runtime/cli/rules/check-grep-convention-helper.mjs:187`). The same phrase is `single-token` in the committed diagnostics and `folder-token-fallback` in a validator warning | the two call sites; committed `phraseQuality` has no key for the class; `runtime/cli/retrieval/README.md:93` promises the bucket "counts every phrase the convention rejects, by class" |
| 3 | **Staleness detection can only be mtime-based, because the index stores paths without per-path content hashes.** `trigger-index.json.paths` is an array of path strings; the only content-level artifact is `corpusHash`, which is computed by a corpus walk. 29 files looked "newer" here, all within 24 ms of the index write | `node -e` over `Object.keys`/entries of `paths`; the 29-entry mtime delta table |
| 4 | **`retrieval-conventions.md` §9 root coverage names a symlink that does not exist.** The table's second row describes `.opencode/specs` as "a symlink to `specs`" and reasons about the walker canonicalizing that alias; the path is absent. `.opencode/skills` does exist and points at `../.skilled/skills` | `ls -ld .opencode/specs` → `No such file or directory`; `ls -ld .opencode/skills` → `../.skilled/skills`; `retrieval-conventions.md:277` |
| 5 | **`runtime/cli/retrieval/README.md:94` repeats the deleted-symlink claim**: "`CLAUDE.md` is a symlink to it". It has not existed since 2026-09-24, and the same file's own sync script says Claude reads the source directly | `ls -la CLAUDE.md`; `git show --stat 0c40639821`; `runtime-mirrors/sync-gate1-pointers.cjs:7` |
| 6 | **The acceptance packet the doctor names as its bar points at paths that no longer exist.** Its continuity block lists `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` and `.opencode/skills/system-spec-kit/data/trigger-index.json`; the tree is now `runtime/cli/retrieval/` and `runtime/data/`. The document still describes the accepted behaviour correctly | `head -50` of that file; `ls .opencode/skills/system-spec-kit/data` and `…/scripts` → both absent |
| 7 | Informational: the conventions document pins its behavioural observations to ripgrep 14.1.1 (`§2.5` note, `§4` worked example) while this host runs 15.2.0. I re-tested the §2.5 hazard at 15.2.0 and it still holds — `rg --json --count` prints count lines, `rg --count --json` prints JSONL, both exit 0 — so the claim stands; only the version pin is behind | `rg --version`; the two-order test |
