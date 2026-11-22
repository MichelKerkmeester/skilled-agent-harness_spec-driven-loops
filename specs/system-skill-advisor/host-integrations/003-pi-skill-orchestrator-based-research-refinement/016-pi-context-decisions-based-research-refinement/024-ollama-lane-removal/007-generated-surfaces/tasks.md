---
title: "Tasks: Phase 7: generated-surfaces"
description: "Ordered tasks to regenerate the scorer eval baseline and the trigger index with its three fixtures, add four exact-path allowlist rows after proving the index carries only specs/ history, apply the conductor's answer on the cite-drift labels, and prove every check mode from the final tree."
trigger_phrases:
  - "generated surfaces tasks"
  - "trigger index regeneration tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 7: generated-surfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Commands run from the repository root with `A=.skilled/skills/system-skill-advisor`, `R=$A/runtime`, `K=.skilled/skills/system-spec-kit`, `RT=$K/runtime/cli/retrieval`, `SD=.skilled/skills/sk-doc`, `F=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces`, `T=$(mktemp -d)` made once per session outside the repository, and `S` and `N0` set to the start commit and the allowlist row count T001 records. Five helpers, each tested at planning time:

```bash
# Each line matching the residue check's own patterns, case-insensitive, then lines=N.
hits() { node --input-type=module -e "import { IDENTIFIER_PATTERN as I, PROSE_PATTERN as P } from './$K/runtime/cli/retrieval/sweep-lane-residue.mjs'; import fs from 'node:fs'; const re = new RegExp(I + '|' + P, 'i'); let n = 0; for (const f of process.argv.slice(1)) fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (re.test(l)) { n++; console.log(f + ':' + (i + 1)); } }); console.log('lines=' + n);" "$@"; }
# Every lane-term path or phrase in the four index outputs in DIR that resolves outside specs/ and to no allowlisted file; exits 1 when outside is not 0.
derived() { node --input-type=module -e "import { IDENTIFIER_PATTERN as I, PROSE_PATTERN as P, DEFAULT_ALLOWLIST_PATH as L, loadAllowlist } from './$K/runtime/cli/retrieval/sweep-lane-residue.mjs'; import fs from 'node:fs'; const re = new RegExp(I + '|' + P, 'i'); const ok = new Set(loadAllowlist(L).map((r) => r.path)); const d = process.argv[1]; const j = (n) => JSON.parse(fs.readFileSync(d + '/' + n, 'utf8')); const idx = j('trigger-index.json'); const pv = j('phrase-variants.json'); const out = new Map(); let paths = 0, keys = 0; const chk = (p, why) => { if (!p.startsWith('specs/') && !ok.has(p)) out.set(p, why); }; idx.paths.forEach((p) => { if (re.test(p)) { paths++; chk(p, 'index path'); } }); for (const [k, ids] of Object.entries(idx.phrases)) { if (re.test(k) || (pv.variants[k] ?? []).some((s) => re.test(s))) { keys++; ids.forEach((i) => chk(idx.paths[i], 'phrase: ' + k)); } } for (const n of ['corpus-manifest.json', 'generation-diagnostics.json']) { const walk = (x) => { if (typeof x === 'string') { if (re.test(x)) chk(x, n); } else if (x && typeof x === 'object') Object.values(x).forEach(walk); }; walk(j(n)); } for (const [p, why] of out) console.log(p + '  [' + why + ']'); console.log('lane paths=' + paths + ' lane phrase keys=' + keys + ' outside=' + out.size); process.exitCode = out.size ? 1 : 0;" "$1"; }
# Index and manifest paths outside specs/ that carry an old name, and the renamed fusion leaves.
oldnames() { node -e 'const fs=require("fs"); const i=JSON.parse(fs.readFileSync(process.argv[1]+"/trigger-index.json","utf8")); const m=JSON.parse(fs.readFileSync(process.argv[1]+"/corpus-manifest.json","utf8")); const all=[...i.paths, ...m.includedPaths].filter((p)=>!p.startsWith("specs/")); console.log("old="+all.filter((p)=>/five-lane-fusion|background-vector-refresh|command-meaning-matching/.test(p)).length+" lane-fusion="+new Set(all.filter((p)=>/scorer-fusion\/lane-fusion\.md$/.test(p))).size);' "$1"; }
# The baseline at REF against FILE (default: the working copy), field by field.
scorecheck() { node -e 'const fs=require("fs"); const a=JSON.parse(require("child_process").execFileSync("git",["show",process.argv[1]+":"+process.argv[2]],{encoding:"utf8"})); const b=JSON.parse(fs.readFileSync(process.argv[3],"utf8")); const flat=(o,p="",r={})=>{for(const[k,v]of Object.entries(o)){const q=p?p+"."+k:k; if(v&&typeof v==="object")flat(v,q,r); else r[q]=v;} return r;}; const fa=flat(a),fb=flat(b); const keys=[...new Set([...Object.keys(fa),...Object.keys(fb)])].sort(); const d=keys.filter(k=>fa[k]!==fb[k]); const m=keys.filter(k=>k.startsWith("metrics.")); console.log("fields="+keys.length+" differing="+d.length+" ["+d.join(", ")+"]"); console.log("score fields="+m.length+" differing="+m.filter(k=>fa[k]!==fb[k]).length);' "$1" "$2" "${3:-$2}"; }
# The four committed index outputs against copies in DIR, with manifestHash and corpusHash removed; exits 1 unless equal=4.
samecontent() { node -e 'const fs=require("fs"); const strip=(o)=>{ if(Array.isArray(o)) return o.map(strip); if(o&&typeof o==="object"){ const c={}; for(const [k,v] of Object.entries(o)) if(k!=="manifestHash"&&k!=="corpusHash") c[k]=strip(v); return c;} return o; }; const [d,k,rt]=process.argv.slice(1); const pairs=[[k+"/runtime/data/trigger-index.json","trigger-index.json"],[rt+"/fixtures/corpus-manifest.json","corpus-manifest.json"],[rt+"/fixtures/generation-diagnostics.json","generation-diagnostics.json"],[rt+"/fixtures/phrase-variants.json","phrase-variants.json"]]; let eq=0; for (const [a,b] of pairs){ const x=JSON.stringify(strip(JSON.parse(fs.readFileSync(a,"utf8")))); const y=JSON.stringify(strip(JSON.parse(fs.readFileSync(d+"/"+b,"utf8")))); if(x===y) eq++; else console.log("differs: "+a); } console.log("equal="+eq); process.exitCode = eq===4?0:1;' "$1" "$K" "$RT"; }
```

The four index outputs are `$K/runtime/data/trigger-index.json` and `$RT/fixtures/corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. The five generated paths are those four plus `$R/scripts/routing-accuracy/scorer-eval-baseline.json`, written one per line, sorted with `LC_ALL=C sort`, to `$F/scratch/expected-5.txt` by T001.

**Order rule.** The fixtures hash every corpus byte, so after T008 no task adds a markdown file or edits a `trigger_phrases` list anywhere in the tree. Body edits and other frontmatter fields move only `manifestHash` and `corpusHash`, which `samecontent` ignores and `--check` reports only as a note, so ticking boxes and filling the summary after T008 stay safe. T019 proves it from the final tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 006 is committed, and record its SHA as `S` and the allowlist row count as `N0` (`implementation-summary.md`). Verify: `git status --short | grep -vc '^??'` prints 0; `node $RT/sweep-lane-residue.mjs repo --json | node -e 'const r=JSON.parse(require("fs").readFileSync(0,"utf8")); r.live.map((x)=>x.path).sort().forEach((p)=>console.log(p)); console.error("allowlistRows="+r.counts.allowlistRows)' | LC_ALL=C comm -3 - $F/scratch/expected-5.txt` prints nothing and stderr prints `allowlistRows=` followed by `N0` (30 at phase 005's commit `1f85a9dd6dd`, plus the rows 006 adds, 15 in its plan). Any other live path halts the phase and goes back to the phase that owns it; this phase never allowlists it. At `1f85a9dd6dd`, `$SD/scripts/tests/code-folder/baseline-readme-verdicts.json` is still live on a spec folder path, so this task halts unless phase 006 gives it a row. Evidence: `git status --short | grep -vc '^??'` printed `0`; the live paths of `sweep-lane-residue.mjs repo --json` through `comm -3` against `scratch/expected-5.txt` printed nothing (exit 0) and stderr printed `allowlistRows=46` (46 rows, 46 matched). `S` = `29ae0d13c59`, `N0` = 46. Phase 006 had already given `baseline-readme-verdicts.json` its row, so no extra live path halted the task. [DEVIATION: `S` and `N0` are recorded here, not in `implementation-summary.md`, which the conductor reserved for itself.]
- [x] T002 [P] Record the generator and label baselines at `S` (`$F/scratch/baseline.txt`, `implementation-summary.md`). Verify: the file holds `generate-trigger-index.mjs --check`'s exit and its stale, obsolete and untrusted counts; `oldnames` and `derived` on a fresh `--out "$T/s"` generation; `skill-graph-freshness.cjs --strict`'s exit and its `STALE COMPILED` and `SIGNAL DRIFT` lines; `skill_graph_compiler.py --validate-only`'s last line; `hits $R/scripts/skill-graph.json` (`lines=0` expected after 006); `cite-drift-scan.mjs`'s exit and stderr (exit 2 and `[cite-drift-scan] labels row live-03: claim hash mismatch` expected); `cite-drift-gate.mjs`'s report-only line; and the `ℹ tests` and `ℹ pass` lines of `node --test $SD/scripts/tests/test-cite-drift-scan.mjs` (67 and 67 at planning) and `test-cite-drift-gate.mjs`. Evidence: `scratch/baseline.txt` (copied to the session scratchpad before `scratch/` was cleaned) holds: `--check` exit 1 with `stale documents   : 75 (68 missing from the index)`, `obsolete paths    : 13`, `untrusted docs    : 0` (planning measured 65 and 9; the 4 extra obsolete paths are the fusion, vector-refresh and meaning-matching docs phase 006 renamed or deleted). On a fresh `--out "$T/s"` generation, `oldnames` printed `old=0 lane-fusion=2` and `derived` printed `lane paths=1069 lane phrase keys=389 outside=0`, exit 0 (planning: 1070, 394 and `outside=7` before 006). `skill-graph-freshness.cjs --strict` exit 0 with `STALE COMPILED: none` and `SIGNAL DRIFT compiled vs disk: none`; `--validate-only` printed `VALIDATION PASSED: all metadata files are valid`; `hits` on the export printed `lines=0`; `cite-drift-scan.mjs` exit 2 with `[cite-drift-scan] labels row live-03: claim hash mismatch`; `cite-drift-gate.mjs` printed `278 unresolved or past-end citations, report only` (planning: 277); `test-cite-drift-scan.mjs` printed `ℹ tests 67` and `ℹ pass 67`, `test-cite-drift-gate.mjs` printed `ℹ tests 5` and `ℹ pass 5`, both `ℹ fail 0`.
- [x] T003 [P] Record the routing and gate baselines at `S` (`implementation-summary.md`). Verify: the summary holds the passed count per file of `(cd $R && npx vitest run --reporter=json tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts)` (7, 9 and 6 at planning); `tests/parity/scorer-eval-baseline-capture-date.vitest.ts` (2 passed); the routing corpus command in `spec.md` Measured Behavior with exit 0, `overall_pass: true` and its `rows`, `accuracy`, `f1`, `TT`, `FT` and `FF`; `derive-command-bridges.cjs --check` exit 0 with `"changed": []`; `generate-leaf-manifest.cjs --check` for `$A` and `$K`; and the link check's `0 broken` line. Evidence: Ratchets exit 0: `holdout-independent.vitest.ts 6 passed`, `local-native-divergence-ratchet.vitest.ts 9 passed`, `scorer-eval-baseline-ratchet.vitest.ts 7 passed`, `total passed=22 failed=0`; capture-date `Tests  2 passed (2)`; routing corpus exit 0 with `rows` 196, `accuracy` 0.602, `f1` 0.9844, `TT` 115, `FT` 3, `FF` 1, `overall_pass: true`; bridges exit 0 with `"changed": []`; `leaf-manifest.json OK (e0bbdbb30bed...)` for the advisor and `leaf-manifest.json OK (57c1a3d3f585...)` for spec-kit, each exit 0; links `check-markdown-links: 7676 files, 15231 links checked, 0 broken`. Also baselined because this phase edits fixtures they read: the spec-kit suites `sweep-lane-residue`, `sweep-memory-residue`, `trigger-index`, `host-trigger-index` and `trigger-index-rebuild-workflow` printed `Tests  256 passed | 1 skipped (257)`; the advisor baseline readers `doctor-routing-slice`, `ambiguity-slice`, `doctor-bridge-isolation` and `doctor-handoff-command` printed `Tests  73 passed (73)`; `doctor-phrase-reach.test.cjs` printed `ℹ pass 3`; `sweep-memory-residue.mjs --json` exit 1 with `live` 5 on 2 paths, both in sk-doc and outside this phase. [DEVIATION: recorded here and in `scratch/baseline.txt`, not in `implementation-summary.md`.]
- [x] T004 Rebuild the advisor clean so the capture scores current code (`$R/dist/`). Verify: `(cd $R && npm run clean && npm run build)` exits 0, and `ls $R/dist/runtime/lib/scorer/fusion.js` prints the path. Evidence: `npm run clean && npm run build` exit 0, ending `dist build attestation recorded` twice; `ls` printed the path of the scorer's built `fusion.js`; `git status --short` afterwards listed only the two untracked phase folders.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Regenerate the scorer baseline through its generator, with the scoring date replayed from the file (`$R/scripts/routing-accuracy/scorer-eval-baseline.json`): `env -u SPECKIT_EVAL_BASELINE_SCORING_DATE -u SPECKIT_PRIVATE_SKILL_ROOTS TMPDIR="$T" node $R/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs --write`. Verify: `scorecheck "$S" $R/scripts/routing-accuracy/scorer-eval-baseline.json` prints `fields=30 differing=2 [capturedAtSha, env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC]` and `score fields=21 differing=0`; `git diff --numstat "$S" -- $R/scripts/routing-accuracy/scorer-eval-baseline.json` prints `1` and `2`; `node -p 'require("./'$R'/scripts/routing-accuracy/scorer-eval-baseline.json").capturedAt'` prints `2026-10-11`; `hits` on the file prints `lines=0`. Any `metrics.*` difference halts the phase: restore the file from `S`, recapture nothing, and take ADR-003's fallback row instead. Evidence: A stdout capture at HEAD first reproduced the planned diff (`capturedAtSha` and the dropped key only). The `--write` run exit 0; `scorecheck "$S"` printed `fields=30 differing=2 [capturedAtSha, env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC]` and `score fields=21 differing=0`, and a per-field listing of all 30 flattened keys printed `EQUAL` for the other 28; numstat printed `1` and `2`; `capturedAt` printed `2026-10-11`; `hits` printed `lines=0`. No metric moved, so ADR-003's fallback row was not needed. In the same change the memory sweep's reason for this file in `$RT/fixtures/residue-allowlist.json` was reworded to "Captured scorer baseline: dated evidence that only capture-scorer-eval-baseline.mjs writes, replaying the recorded capture date. Never edited by hand." (`spec.md` open questions, conductor resolution); `hits` on that file printed `lines=0`, and the memory sweep's counts equal S (exit 1, `live` 5, `livePaths` 2), its record for the baseline moving from line 42 to 41 under the new reason.
- [x] T006 Only after T002's `derived` at `S` printed `outside=0`, add four exact-path rows, one per index output, each with the reason in `decision-record.md` ADR-002 (`$RT/fixtures/lane-residue-allowlist.json`); any other `derived` result halts here, so no missed doc is allowlisted. Verify: `grep -c 'outside=0' $F/scratch/baseline.txt` prints 1; `node --input-type=module -e "import { loadAllowlist, DEFAULT_ALLOWLIST_PATH as L } from './$RT/sweep-lane-residue.mjs'; console.log(loadAllowlist(L).length)"` prints `N0` plus 4; `git diff -U0 "$S" -- $RT/fixtures/lane-residue-allowlist.json | grep -c '"path"'` prints 4; and `git ls-files --error-unmatch` exits 0 on each of the four paths the rows name. Evidence: `grep -c 'outside=0' $F/scratch/baseline.txt` printed `1`; `loadAllowlist(L).length` printed `50` (N0 46 plus 4); `git diff -U0 "$S" -- $RT/fixtures/lane-residue-allowlist.json | grep -c '"path"'` printed `4`; `git ls-files --error-unmatch` exit 0 on each of the four paths; each reason is ADR-002's text verbatim; the file parses.
- [x] T007 Apply the conductor's answer to `spec.md` open question 1 (`$SD/shared/scripts/cite-drift-labels.jsonl`). Option A: change the `doc` field of rows `live-03`, `live-10`, `live-17`, `constructed-06` and `constructed-17` from `.skilled/skills/sk-code/sk-code-skilled/` to `.skilled/skills/sk-code/sk-code-opencode/`, the path their pinned commit `ebcc68e8edb` holds, and nothing else. Option B: no edit, and record the answer in `decision-record.md` ADR-004. Verify: under option A, `git diff --numstat "$S" -- $SD/shared/scripts/cite-drift-labels.jsonl` prints `5` and `5`, and `node $SD/shared/scripts/cite-drift-scan.mjs > $F/scratch/cds.txt 2> $F/scratch/cds-err.txt` exits 0 with `cds-err.txt` empty; under option B, `git diff "$S" -- $SD/shared/scripts/cite-drift-labels.jsonl` prints nothing, and the scan's stderr equals T002's line. Evidence: Option A, the conductor's answer (ADR-004). numstat printed `5` and `5`; `cmp` of the file against `git show 1ea8730ddb7:$SD/shared/scripts/cite-drift-labels.jsonl` exit 0, so the file is byte-identical to the last commit before the rename; `cite-drift-scan.mjs` exit 0 and `cds-err.txt` was 0 bytes.
- [x] T008 Regenerate the trigger index and its three fixtures, after the last markdown file added and the last `trigger_phrases` edit (the four index outputs): `node $RT/generate-trigger-index.mjs`. Verify: it exits 0, and `node $RT/generate-trigger-index.mjs --check` exits 0 and prints `stale documents   : 0`, `obsolete paths    : 0` and `untrusted docs    : 0`. Evidence: Generator exit 0; `--check` exit 0 with `trigger index matches the corpus`, `documents scanned : 28971`, `stale documents   : 0 (0 missing from the index)`, `obsolete paths    : 0` and `untrusted docs    : 0`. The generator also read the untracked 008 phase folder: `corpus-manifest.json` holds 7 of its docs, so phase 008 must regenerate the index after its own doc edits.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Compare the four outputs byte for byte with a fresh generation, CI's method, before any later doc edit (the four index outputs). Verify: `node $RT/generate-trigger-index.mjs --quiet --out "$T/fresh/trigger-index.json"` exits 0, and `cmp $K/runtime/data/trigger-index.json "$T/fresh/trigger-index.json"` and the same `cmp` for each fixture against `"$T/fresh/<name>"` print nothing. Evidence: Fresh `--quiet --out "$T/fresh/trigger-index.json"` exit 0; `cmp` printed nothing and exit 0 for `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`, run before any doc edit.
- [x] T010 Prove the allowlisted outputs carry only `specs/` history and that 006's renames reached the index (`$T/fresh/`). Verify: `derived "$T/fresh"` exits 0 and its last line ends `outside=0`; `oldnames "$T/fresh"` prints `old=0 lane-fusion=2`. A path `derived` prints is a doc its owning phase missed: halt and send it back, never add a row for it. Evidence: `derived "$T/fresh"` printed `lane paths=1069 lane phrase keys=389 outside=0`, exit 0; `oldnames "$T/fresh"` printed `old=0 lane-fusion=2`.
- [x] T011 Run the residue check in repo mode (`$RT/sweep-lane-residue.mjs`). Verify: `node $RT/sweep-lane-residue.mjs repo > $F/scratch/residue.txt; echo "exit=$?"` prints `exit=0`, `grep '^live ' $F/scratch/residue.txt` prints `live        : 0`, and its `--json` shows `counts.allowlistRows` equal to `N0` plus 4 and `unusedAllowlistRows` as `[]`. Evidence: `exit=0`; `scratch/residue.txt` held `allowlist ... (50 row(s), 50 matched)`, `files       : 50`, `allowlisted : 50` and `live        : 0`; `--json` exit 0 with `counts.allowlistRows` 50 (N0 plus 4), `unusedAllowlistRows` `[]` and `live` `[]`.
- [x] T012 Rerun the routing gate (`$R/tests/parity/`, `$R/scripts/routing-accuracy/`). Verify: the three ratchet files print T003's passed counts (7, 9 and 6), the capture-date test prints `Tests  2 passed (2)`, the routing corpus command exits 0 with `overall_pass: true` and T003's six numbers, and `git diff --stat "$S" -- $R/scripts/routing-accuracy $R/tests/parity/fixtures` lists only `scorer-eval-baseline.json`. A move halts the phase; nothing is recaptured. Evidence: Ratchets exit 0 with 6, 9 and 7 passed, `total passed=22 failed=0`, as at T003; capture-date `Tests  2 passed (2)`; routing corpus exit 0 with `rows` 196, `accuracy` 0.602, `f1` 0.9844, `TT` 115, `FT` 3, `FF` 1 and `overall_pass: true`, all equal to T003; `git diff --stat "$S" -- $R/scripts/routing-accuracy $R/tests/parity/fixtures` listed only `scorer-eval-baseline.json` (1 insertion, 2 deletions).
- [x] T013 [P] Run the skill-graph export's check set, writing nothing to the export (`$R/scripts/skill-graph.json`). Verify: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exits 0 and prints `SIGNAL DRIFT compiled vs disk: none`; `python3 $R/scripts/skill_graph_compiler.py --validate-only | tail -1` prints `VALIDATION PASSED: all metadata files are valid`; after `python3 $R/scripts/skill_graph_compiler.py --export-json --output "$T/skill-graph.json"`, `node -e 'const f=(p)=>{const o=JSON.parse(require("fs").readFileSync(p,"utf8")); delete o.generated_at; return JSON.stringify(o);}; console.log(f(process.argv[1])===f(process.argv[2]))' $R/scripts/skill-graph.json "$T/skill-graph.json"` prints `true`; `hits $R/scripts/skill-graph.json` prints `lines=0`; `git diff --name-only "$S" -- $R/scripts/skill-graph.json` prints nothing. Evidence: Freshness exit 0 with `SIGNAL DRIFT compiled vs disk: none`; `--validate-only` printed `VALIDATION PASSED: all metadata files are valid`; the scratch `--export-json` copy compare printed `true`; `hits` printed `lines=0`; `git diff --name-only "$S" -- $R/scripts/skill-graph.json` printed nothing.
- [x] T014 [P] Run the cite-drift checks (`$SD/shared/scripts/`). Verify: `node $SD/shared/scripts/cite-drift-scan.mjs` exits as T007 recorded; `git diff "$S" -- $SD/shared/scripts/cite-drift-labels.jsonl | grep -c -E 'live-14|constructed-16'` prints 0; `node $SD/shared/scripts/cite-drift-gate.mjs` prints T002's report-only line; `node --test $SD/scripts/tests/test-cite-drift-scan.mjs` and `node --test $SD/scripts/tests/test-cite-drift-gate.mjs` print T002's `ℹ tests` and `ℹ pass` counts with `ℹ fail 0`. Evidence: `cite-drift-scan.mjs` exit 0 with 0 bytes of stderr, as T007 recorded; `cite-drift-gate.mjs` printed `278 unresolved or past-end citations, report only`, as at T002; `test-cite-drift-scan.mjs` `ℹ tests 67`, `ℹ pass 67`, `ℹ fail 0`, and `test-cite-drift-gate.mjs` `ℹ tests 5`, `ℹ pass 5`, `ℹ fail 0`, as at T002. Rows `live-14` and `constructed-16` are byte-identical to S. [DEVIATION: the task's `git diff "$S" ... | grep -c -E 'live-14|constructed-16'` printed `2`, because both rows sit in the diff's unchanged context lines next to `live-17` and `constructed-17`. Counting changed lines only (`git diff -U0`, lines starting `+` or `-`) printed `0`, and a per-row compare against S printed byte-identical for both.]
- [x] T015 [P] Rerun the other named gates (`$R/scripts/command-bridges/`, the two leaf manifests, the link check). Verify: `node $R/scripts/command-bridges/derive-command-bridges.cjs --check` exits 0 with `"changed": []`; `node $SD/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $A` and `--check $K` each print `leaf-manifest.json OK`; `node $K/runtime/cli/check-markdown-links.cjs` prints `0 broken`. Evidence: Bridges exit 0 with `"changed": []`; both `generate-leaf-manifest.cjs --check` runs exit 0 with the T003 hashes; links `check-markdown-links: 7676 files, 15231 links checked, 0 broken`. The extra suites equal T003: spec-kit `Tests  256 passed | 1 skipped (257)`, advisor baseline readers `Tests  73 passed (73)`, `doctor-phrase-reach` `ℹ pass 3`. The sk-code quality runner on the three hand-edited files printed `NO_BLOCKER_FOUND` with 0 findings.
- [x] T016 Check the boundary (`git status`). Verify: `git status --short | grep -v '^?? specs/'` lists only the four index outputs, `scorer-eval-baseline.json`, `lane-residue-allowlist.json` and, under option A, `cite-drift-labels.jsonl`; `git status --short -- specs/ | grep -v '^??'` prints nothing, so no tracked spec doc changed and only the untracked 007 and 008 phase folders remain. Evidence: `git status --short | grep -v '^?? specs/'` listed the four index outputs, `scorer-eval-baseline.json`, `lane-residue-allowlist.json`, `cite-drift-labels.jsonl` and `residue-allowlist.json`; `git status --short -- specs/ | grep -v '^??'` printed nothing, and only the untracked 007 and 008 phase folders remain. [DEVIATION: `residue-allowlist.json` is an eighth file. The conductor's resolution in `spec.md` open questions moved the memory sweep's reason reword into this phase after the task list was written.]
- [x] T017 Write the packet docs: tick T001 to T016, set each acceptance row with its evidence, fill `implementation-summary.md` and the goal log, adding no markdown file and editing no `trigger_phrases` list (`$F/*.md`). Verify: `node $RT/generate-trigger-index.mjs --check` still exits 0 and prints `stale documents   : 0`, which it would not if a doc gained a phrase or a new markdown file appeared. Evidence: `tasks.md` and `acceptance-criteria.md` were filled as body edits only: no markdown file added, no `trigger_phrases` list touched. After those edits `--check` exit 0 with `stale documents   : 0 (0 missing from the index)`, `obsolete paths    : 0` and `untrusted docs    : 0`. [DEVIATION: `implementation-summary.md` and the `goal.md` log were not written. The conductor reserved the summary, and the goal log was left to it as well.]
- [x] T018 Validate the packet (`$F`). Verify: `bash $K/runtime/cli/spec/validate.sh $F --strict` prints `RESULT: PASSED`. Evidence: `validate.sh $F --strict` exit 0 with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, including `AC_CLOSURE: 9/9 criteria met, waived or superseded; packet is closeable`. The run refreshed the derived `graph-metadata.json` in this folder.
- [x] T019 Prove the final tree, after every doc edit, and save the output (`$F/scratch/final-check.txt`). Verify: `node $RT/generate-trigger-index.mjs --check` exits 0 with 0 stale, 0 obsolete and 0 untrusted; `node $RT/generate-trigger-index.mjs --quiet --out "$T/final/trigger-index.json"` then `samecontent "$T/final"` prints `equal=4`; `derived "$T/final"` prints `outside=0`; `node $RT/sweep-lane-residue.mjs repo` exits 0; all four lines are in `final-check.txt`, and `rm -rf "$T"` leaves no scratch directory outside the repository. Evidence: From the tree after the `tasks.md` and acceptance edits: `--check` exit 0 with 0 stale, 0 obsolete and 0 untrusted, plus the expected note that the manifest hash differs; a fresh `--out "$T/final/trigger-index.json"` exit 0; strict `cmp` against it now exits 1 for all four outputs, because the body edits moved only `manifestHash` and `corpusHash`, and `samecontent "$T/final"` printed `equal=4`; `derived "$T/final"` printed `lane paths=1069 lane phrase keys=389 outside=0`, exit 0, and `oldnames` `old=0 lane-fusion=2`; `sweep-lane-residue.mjs repo` exit 0 with `live        : 0`, 50 rows, all matched, `unused=[]`. All of it was written to `final-check.txt`. [DEVIATION: the conductor asked for `scratch/` to end at `.gitkeep`, so `final-check.txt`, `baseline.txt`, `expected-5.txt`, `residue.txt`, `cds.txt` and `cds-err.txt` were copied to the session scratchpad and removed from `scratch/`. `$T` is that conductor-named scratchpad, so it keeps those copies and only its bulky generations and exports were removed.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: T001 to T019 are ticked, each with its observed output.
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries `[B]`.
- [x] `final-check.txt` holds T019's four results, and `$F/scratch/` holds only `.gitkeep`, `expected-5.txt`, `baseline.txt` and the files T007, T011 and T019 wrote. Evidence: `final-check.txt` held all four T019 results. [DEVIATION: the conductor asked for `scratch/` to end at `.gitkeep`, so these files were copied to the session scratchpad and removed (T019).]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A moved score, ratchet or routing corpus number is a P0 halt, never a recapture. A blocked task stays `[ ]` with its reason in `implementation-summary.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `S` and `N0` are in `implementation-summary.md`, and the live residue list at `S` equals `expected-5.txt` (T001) Evidence: T001: `S` = `29ae0d13c59`, `N0` = 46, live list equal to `expected-5.txt`. [DEVIATION: recorded in this file, not `implementation-summary.md`.]
- [x] CHK-002 [P0] Every start result T002 and T003 name is recorded Evidence: T002 and T003 evidence above, plus the extra suites and the memory sweep baselined at S.
- [x] CHK-003 [P1] The conductor's answer to open question 1 is recorded in `decision-record.md` ADR-004 before T007 Evidence: `decision-record.md` ADR-004 is titled "conductor chose option A", with Status Accepted and the conductor as decider, before T007 ran. Its Decision paragraph still reads in the pre-answer voice; not edited here.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each generated file equals its generator's output: T009's `cmp` prints nothing and T005's `scorecheck` prints only the two expected fields Evidence: T009's four `cmp` runs printed nothing; T005's `scorecheck` printed only `capturedAtSha` and the dropped env key.
- [x] CHK-011 [P0] `node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))' $RT/fixtures/lane-residue-allowlist.json` exits 0 and `loadAllowlist` accepts every row (T006) Evidence: The parse command exit 0; `loadAllowlist` returned 50 rows without error (T006).
- [x] CHK-012 [P1] Each new allowlist reason says why the file's matches are not the advisor lane, as the file's description asks (T006) Evidence: Each of the four reasons says the file is generator output whose lane terms are spec packet history or phrases of already-exempted files (ADR-002 text).
- [x] CHK-013 [P1] No allowlist reason or label row carries a phase, task or requirement id (`git diff "$S" -- $RT/fixtures/lane-residue-allowlist.json $SD/shared/scripts/cite-drift-labels.jsonl | grep '^+' | grep -c -E 'phase [0-9]|T0[0-9][0-9]|REQ-[0-9]'` prints 0) Evidence: The command printed `0`; the same grep extended to `ADR-[0-9]` and to `residue-allowlist.json` also printed `0`, and no added line holds an em dash.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, or `Waived` with ADR-004 for AC-006 under option B Evidence: All nine rows in `acceptance-criteria.md` are `Met`; AC-009 carries the `residue-allowlist.json` deviation in its evidence.
- [x] CHK-021 [P0] The trigger index `--check`, the byte compare, `derived` and the residue check pass right after T008 and again from the final tree (T009 to T011, T019) Evidence: Right after T008: `--check` exit 0 with 0 stale, 0 obsolete and 0 untrusted, four silent `cmp` runs, `derived` `outside=0`, residue exit 0. From the final tree: T019.
- [x] CHK-022 [P1] The three ratchets, the capture-date test and the routing corpus print their `S` results (T012) Evidence: T012 printed T003's numbers for all three ratchets, the capture-date test and the six corpus numbers.
- [x] CHK-023 [P1] The halt branches are written down: an extra live path in T001, a metric difference in T005, a non-zero `outside` in T010 Evidence: T001's halt (extra live path) did not fire; T005's halt (metric difference) did not fire, 21 of 21 equal; T010's halt (non-zero `outside`) did not fire. Each branch stays written in its task.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: the live index outputs `class-of-bug` (generated from `specs/`), the baseline `instance-only`, the labels `instance-only` (five rows of one rename) Evidence: Index outputs `class-of-bug` (built from `specs/`, held by four rows); baseline `instance-only` (one dead key, regenerated); labels `instance-only` (five rows of one rename, restored).
- [x] CHK-FIX-002 [P0] Same-class producers inventoried: T001's live list is exactly the five generated paths Evidence: T001's live list was exactly the five generated paths.
- [x] CHK-FIX-003 [P0] Consumer inventory done: the baseline's readers use `capturedAt` and score fields only (`plan.md` affected surfaces) Evidence: `git grep -n capturedAtSha -- ':!specs'` names no reader of this file: `command-routing-slice.vitest.ts` reads the command-routing baseline's field and says it is not compared. The other readers of `scorer-eval-baseline.json` passed at T012 and T015.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction code changes Evidence: N/A, no security, path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Matrix listed: five generated files by three proofs (generator output, check mode, residue state) Evidence: Five generated files by generator output (T005, T008, T009), check mode (T005, T008, T013, T014) and residue state (T011).
- [x] CHK-FIX-006 [P1] The capture runs with `SPECKIT_EVAL_BASELINE_SCORING_DATE` and `SPECKIT_PRIVATE_SKILL_ROOTS` unset, so no process-wide value moves a score (T005) Evidence: T005 ran `env -u SPECKIT_EVAL_BASELINE_SCORING_DATE -u SPECKIT_PRIVATE_SKILL_ROOTS TMPDIR=<session scratchpad>`; the script also deletes `SPECKIT_PRIVATE_SKILL_ROOTS` itself (line 61).
- [x] CHK-FIX-007 [P1] Evidence is pinned to `S` and to the phase commit, never a moving branch range Evidence: Every diff and `scorecheck` is pinned to `S` = `29ae0d13c59`. The phase commit is the conductor's, so nothing here cites it.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No step reads a dotenv value or prints a credential; the capture scores against an empty temporary database directory Evidence: No command read a dotenv value; the capture script holds no dotenv read and points its database directory at a fresh `mkdtemp` (line 53).
- [x] CHK-031 [P0] N/A: no input parsing changes; the allowlist loader already refuses a folder, a glob and a duplicate row Evidence: N/A, no input parsing changed; `loadAllowlist` accepted all 50 rows.
- [x] CHK-032 [P1] N/A: no auth surface Evidence: N/A, no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `decision-record.md` name the same five generated files and the same four rows Evidence: All five docs name the same five generated files and the same four rows. `spec.md` Out of Scope and the `plan.md` affected-surfaces row still call the memory sweep's baseline reason unchanged, which the conductor's resolution in `spec.md` open questions overrides; not edited here.
- [x] CHK-041 [P1] N/A: no code comment changes Evidence: N/A, no code comment changed.
- [x] CHK-042 [P2] N/A: no README describes these files' contents Evidence: N/A, no README describes these files' contents.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Bulky copies live in `$T`, outside the repository and outside the corpus; logs live in `$F/scratch/`, which the generator excludes Evidence: Fresh generations, exports and the capture's database directory went to the session scratchpad outside the repository; logs went to `$F/scratch/`.
- [x] CHK-051 [P1] `$T` is removed and `$F/scratch/` holds only the files the Completion Criteria name (T019) Evidence: [DEVIATION: `$F/scratch/` holds only `.gitkeep`, as the conductor asked, rather than the files the Completion Criteria name; their copies and the bulky-copy cleanup are described at T019.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->
