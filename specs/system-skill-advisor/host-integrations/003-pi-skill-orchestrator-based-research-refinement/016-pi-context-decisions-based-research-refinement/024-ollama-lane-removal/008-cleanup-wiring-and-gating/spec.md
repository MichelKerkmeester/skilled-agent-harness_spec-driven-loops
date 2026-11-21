---
title: "Feature Specification: Phase 8: cleanup-wiring-and-gating"
description: "Nothing calls the lane cleanup tool yet, so an update leaves the lane's leftovers on a user's machine and a lane term added to any tracked file passes every gate. This phase hardens the tool, runs its cleanup from /doctor:update apply after the rebuild prompt with the shared-model question asked on every run, and makes the residue check block in CI and in the doctor tests."
trigger_phrases:
  - "cleanup wiring and gating"
  - "phase 8 cleanup wiring and gating"
  - "lane cleanup in doctor update apply"
  - "residue check gating in ci"
  - "shared model question every run"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 8: cleanup-wiring-and-gating

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`sweep-lane-residue.mjs` can find and clean what the retired lane left, but nothing runs it: no file under `.github` or `.skilled/commands` names it, so an update leaves the lane's database tables, backup copies and model cache behind, and a lane term added tomorrow passes every gate. This phase fixes the four weak spots the tool's third review left, runs its cleanup from `/doctor:update apply` right after the rebuild prompt, asks about the pulled shared model on every run through a one-run `--shared-model delete|keep` answer, and makes repo mode block in a new `advisory-checks.yml` job and in a doctor test. The proof is repo mode at exit 0 on the phase commit, the planted-term fixture at exit 1, machine mode at exit 0 on a fixture HOME and checkout, a contract test that pins the cleanup after the rebuild prompt, and two consecutive fixture runs that each ask once and leave no file behind.

**Key Decisions**: the doctor workflow asks the shared-model question on the tool's behalf and passes the answer for that run only, because an agent-run update has no terminal (`plan.md` ADR-001, Proposed); owned deletes run under the one startup approval, disclosed in the plan (ADR-002); M5 moves to the package-local model cache and becomes an owned delete (ADR-003); a checkout that still holds a lane source gets no change from apply (ADR-004); the gate lives in CI and the doctor tests, not in pre-commit (ADR-006); no wiring file names a residue term, so the wiring needs no allowlist row (ADR-008).

**Critical Dependencies**: phase 007 committed with repo mode at exit 0 and its four index-output rows in place; phase 006's removal changelog entry, whose upgrade step this phase checks against the wiring; the conductor's reading of decision D5 and goal criterion 2 (open questions 1 and 2).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/497-ollama-lane-removal` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-generated-surfaces |
| **Successor** | None |
| **Handoff Criteria** | Repo mode 0, machine mode 0 on a fixture, the planted-term fixture 1, the cleanup wired after the rebuild prompt, and two fixture runs that each ask |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Ollama lane removal specification.

**Scope Boundary**: Wire the cleanup tool into `/doctor:update apply` after its rebuild prompt, and flip the residue check from report-only to gating in CI and the doctor tests. The cleanup asks before removing the pulled shared model on every run and remembers no answer. The tool's own changes are limited to the four hardening items, the one-run answer flag, the `askFirst` report field and the trigger index check that the gating needs.

**Dependencies**:
- 007-generated-surfaces: repo mode exits 0, with four exact-path rows for the index outputs that this phase replaces (`../007-generated-surfaces/decision-record.md` ADR-002 and `../007-generated-surfaces/spec.md` open question 2)
- Decisions Q005, Q006 and Q008 in `../../023-ollama-deprecation-research/decision-record.md`, and research sections 5.3 to 5.5 and 5.2 step 7 in `../../023-ollama-deprecation-research/research/research.md`
- `../001-residue-check-and-cleanup-tool/implementation-summary.md` Known Limitations items 1, 3 and 4

**Deliverables**:
- `/doctor:update apply` runs the cleanup after the rebuild prompt
- Repo mode 0, machine mode 0 on a fixture and the planted-term fixture 1
- The four hardening items phase 001's third review left for this phase: probe the exact socket path a custom `HF_EMBED_SERVER_URL` names; match model-server ownership on the process's first script argument; skip the compiled lane deletes while lane sources exist; retarget M5 from the HuggingFace hub cache to the package-local model cache
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 built `sweep-lane-residue.mjs` report-only and unwired, and nothing calls it today. A user who updates keeps the lane's vector tables, the rebuild's `.bak` copy, compiled output and a 132 MB model cache, and a lane term added to any tracked file passes every CI gate. The tool's third review left four weak spots that matter once apply runs for real: a custom socket address is probed by the wrong file name, a process counts as this checkout's model server when its last argument merely ends with the script path, compiled output is deleted even in a checkout that still builds it, and M5 looks in the HuggingFace hub cache although the lane's model sat in the package folder. And `/doctor:update apply` runs through an agent's shell, which has no terminal, so the tool's own question about the pulled shared model never appears there: the run keeps the model silently, which is the "only print the command" outcome decision Q006 rejected.

### Purpose
Every update removes what the lane left on the machine it runs on, asks about the pulled shared model each time, and any lane term that comes back fails CI and the doctor tests.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on 2026-11-21 at `1f85a9dd6dd` (phase 005's commit) with phase 006 half applied in this worktree: 88 tracked files changed and not committed, and the allowlist's 46 rows include 006's uncommitted rows. Repo-mode counts therefore show 006's in-flight state; phase 008 starts only after 007 commits, and 007 plans four more rows for the index outputs (its `decision-record.md` ADR-002). The commands ran from the repository root through one script, with `T=.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`, `E=.skilled/skills/system-spec-kit/node_modules/@huggingface/transformers`, `P=~/MEGA/Development/Skilled/$E/.cache` (the primary checkout) and `S` a scratch folder outside the repository holding the read-only helpers: `summ.cjs` prints each finding's id, status and item count, the M2, M3 and M6 items as `path | detail` cut to 160 characters, and the notes; `wt.cjs` groups M8 items by worktree root and checks each worktree for the four lane-source paths; `ci.cjs` prints the `advisory-checks.yml` row; `ti.mjs` follows the index's lane phrases to their targets; `drive.py` is an `os.openpty` driver that answers at `[y/N]`, and `ask.mjs` a readline prompt. Home paths print as `~`, and each fixture folder as `<fx>`.

```text
$ git rev-parse --short=11 HEAD; git status --short | grep -vc '^??'
1f85a9dd6dd
88
$ node $T repo > $S/repo.txt; echo "exit=$?"; grep -E '^(allowlist|files|allowlisted|live) ' $S/repo.txt | sed 's#: /.*/#: .../#'; grep '^  \.' $S/repo.txt | awk '{print $1}'
exit=1
allowlist   : .../lane-residue-allowlist.json (46 row(s), 46 matched)
files       : 51 (identifier 42, prose 17, path 0, symlink 0)
allowlisted : 46
live        : 5
live files (5 of 5):
.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json
.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json
.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json
.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json
.skilled/skills/system-spec-kit/runtime/data/trigger-index.json
$ node $T machine --json > $S/m.json; echo "exit=$?"; node $S/summ.cjs $S/m.json
exit=1
M1 absent items=0
M2 found items=4
   ~/worktrees/public/497-ollama-lane-removal/.skilled/skills/system-skill-advisor/runtime/node_modules/@huggingface | installed model mo
   ~/worktrees/public/497-ollama-lane-removal/.skilled/skills/system-skill-advisor/runtime/node_modules/onnxruntime-node | installed mode
   ~/worktrees/public/497-ollama-lane-removal/.skilled/skills/system-spec-kit/node_modules/@huggingface | installed model module
   ~/worktrees/public/497-ollama-lane-removal/.skilled/skills/system-spec-kit/node_modules/onnxruntime-node | installed model module
M3 absent items=0
M4 absent items=0
M5 absent items=0
M6 found items=1
   ~/.ollama/models/manifests/registry.ollama.ai/library/nomic-embed-text/v1.5 | manifest in the model store
  notes ["http://127.0.0.1:11434 did not answer (fetch failed); read the model store instead"]
M7 absent items=0
M8 found items=549
  notes ["25 worktree(s) listed, this checkout excluded"]
info absent items=0
$ node $S/wt.cjs $S/m.json
worktrees 25, in M8 24
other worktrees holding a lane source 24 of 24; this checkout 0 of 4
$ /usr/bin/time -p node $T machine --json >/dev/null; /usr/bin/time -p node $T repo --json >/dev/null
real 0.46
user 0.29
sys 0.17
real 8.15
user 56.80
sys 3.08
$ FX=$(mktemp -d $S/fx.XXXX); mkdir -p $FX/root $FX/home $FX/db; git -C $FX/root init -q; env -u HF_HOME -u HF_HUB_CACHE -u XDG_CACHE_HOME -u OLLAMA_MODELS -u OLLAMA_HOST -u SYSTEM_SKILL_ADVISOR_DB_DIR -u HF_EMBED_SERVER_URL HOME=$FX/home OLLAMA_MODELS=$FX/home/ollama node $T machine --root $FX/root --db-dir $FX/db --hf-home $FX/home/hf --ollama-host http://127.0.0.1:9 --socket-dir $FX/sock > $FX/out.txt; echo "exit=$?"; tail -1 $FX/out.txt; mkdir $FX/sock; env -u HF_HOME -u HF_HUB_CACHE -u XDG_CACHE_HOME -u OLLAMA_MODELS -u OLLAMA_HOST -u SYSTEM_SKILL_ADVISOR_DB_DIR -u HF_EMBED_SERVER_URL HOME=$FX/home OLLAMA_MODELS=$FX/home/ollama node $T machine --root $FX/root --db-dir $FX/db --hf-home $FX/home/hf --ollama-host http://127.0.0.1:9 --socket-dir $FX/sock > $FX/out.txt; echo "exit=$?"; grep -A1 '^M4' $FX/out.txt; tail -1 $FX/out.txt; rm -rf $FX
exit=0
result      : exit 0 (nothing left)
exit=1
M4   model server process and socket directory        found
       <fx>/sock  (model server socket directory)
result      : exit 1 (remnants remain)
$ git grep -n sweep-lane-residue -- .github .skilled/commands | wc -l
       0
$ grep -n '^action:\|^  phase_' .skilled/commands/doctor/assets/doctor-update-apply.yaml
6:action: preflight -> release.apply.dry_run -> startup.approval -> release.apply -> post_apply.battery -> rebuild.prompt -> state.log
101:  phase_1_preflight:
112:  phase_2_engine_dry_run:
124:  phase_3_startup_approval:
131:  phase_4_engine_apply:
146:  phase_5_post_apply_battery:
205:  phase_6_rebuild_prompt:
214:  phase_7_state_log:
$ (cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts 2>&1) | grep -E 'Test Files|Tests '; echo "exit=${pipestatus[1]}"
 Test Files  1 passed (1)
      Tests  51 passed (51)
exit=0
$ bash .skilled/commands/doctor/scripts/tests/run-all.sh > $S/runall.txt 2>&1; echo "exit=$?"; grep -E 'PASS: node:test|suite\(s\)' $S/runall.txt
exit=0
[run-all] PASS: node:test (55 files)
[run-all] 7 suite(s) passed, 0 failed
$ bash .skilled/commands/doctor/scripts/route-validate.sh 2>/dev/null | tail -1 | cut -d' ' -f4-; echo "exit=${pipestatus[1]}"
31 routes validated, 11 warnings
exit=0
$ node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | grep -E 'links checked'; echo "exit=${pipestatus[1]}"
check-markdown-links: 7676 files, 15231 links checked, 0 broken
exit=0
$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check | tail -1; echo "exit=${pipestatus[1]}"
[runtime-mirror-sync] PASS: 260 mirrors across 10 trees are in sync.
exit=0
$ actionlint .github/workflows/advisory-checks.yml; echo "actionlint exit=$?"; bash .github/scripts/check-gate-inputs.sh | tail -2; echo "exit=${pipestatus[1]}"
actionlint exit=0
files=47 inputs_resolved=327 dynamic_inputs=39 twin_pairs=392 failures=0
RESULT: PASSED
exit=0
$ node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh > $S/ci.json; echo "exit=$?"; node $S/ci.cjs $S/ci.json
exit=0
jobs=2 pathFilterCount=0 groups=["SKILLED_CI_FRESHNESS"] flags=[]
workflows with flags 0 of 35
$ ls $P/nomic-ai/; du -sh $P
nomic-embed-text-v1.5
132M	~/MEGA/Development/Skilled/.skilled/skills/system-spec-kit/node_modules/@huggingface/transformers/.cache
$ ls -d ~/.cache/huggingface/hub/models--nomic-ai*
~/.cache/huggingface/hub/models--nomic-ai--CodeRankEmbed
$ node -p "require('./$E/package.json').version"; grep -n -A2 'const DEFAULT_CACHE_DIR' $E/src/env.js; grep -n 'cacheDir:' $E/src/env.js
3.8.1
96:const DEFAULT_CACHE_DIR = RUNNING_LOCALLY
97-    ? path.join(dirname__, '/.cache/')
98-    : null;
153:    cacheDir: DEFAULT_CACHE_DIR,
$ git grep -n -i -E 'cache_dir|cacheDir|localModelPath|HF_HOME|HF_HUB_CACHE|TRANSFORMERS_CACHE' cf702d3fb9e -- .skilled/bin .skilled/skills/system-spec-kit/shared .skilled/skills/system-skill-advisor/runtime/lib .skilled/skills/system-spec-kit/runtime/lib | wc -l
       0
$ git grep -n HF_EMBED_SERVER_URL cf702d3fb9e -- .skilled/bin/hf-model-server.cjs | head -1; git grep -n 'spawnFn(process.execPath' cf702d3fb9e -- .skilled/bin/lib/model-server-supervision.cjs; ls .skilled/bin/hf-model-server.cjs
cf702d3fb9e:.skilled/bin/hf-model-server.cjs:122:  const explicitTarget = normalizeListenTarget(options.listenTarget ?? env.HF_EMBED_SERVER_URL);
cf702d3fb9e:.skilled/bin/lib/model-server-supervision.cjs:991:    state.child = spawnFn(process.execPath, [modelServerPath], {
ls: .skilled/bin/hf-model-server.cjs: No such file or directory
$ node $S/ti.mjs .skilled/skills/system-spec-kit/runtime/data/trigger-index.json $PWD/$T .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json
lane phrases 334, references outside specs/ 30, distinct paths 13 (still on disk 3, allowlist rows 1)
  on disk: .skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md
  on disk: .skilled/skills/sk-doc/sk-create-benchmark/references/shared/case-studies.md (allowlist row)
  on disk: .skilled/skills/system-skill-advisor/changelog/v1.2.0.0.md
$ ps -axo command= | grep -c '[h]f-model-server.cjs'; ps -axo command= | grep -c '[o]llama serve'
0
0
$ for i in 1 2; do python3 $S/drive.py n node $S/ask.mjs 2>/dev/null | tr '\n' ' '; echo "exit=${pipestatus[1]}"; done; python3 --version
isTTY=true answer="n" exit=0
isTTY=true answer="n" exit=0
Python 3.9.6
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 700 --files 13 | grep -E '^(Recommended Level|Score)'
Recommended Level: 2 (Verification)
Score: 45/100 | Confidence: 80%
```

Three readings matter beyond the counts. First, M3 was found earlier the same day (this worktree's `skill-graph.sqlite` with `vec_metadata`, `vec_768`, `vec_1024`, `vec_cmd_768`, two embedding indexes and embedding columns) and is absent here: the database file's modification time is 05:28, after phase 005's commit, and no vector object is left in it. A daemon rescan under the new schema is the likely writer; that is inferred from the time, not observed. Second, one run of the same script, started from a shell whose command line contained the script's text, listed that shell under M4 as `pid 74161 (another checkout): /bin/zsh -c ...` and turned the clean fixture to exit 1: M4 lists any process whose command line mentions the server script, owned or not. Third, an existing `--socket-dir` folder counts under M4 even when empty, so a clean fixture passes a socket path it never creates.

The tool loads no module that phase 005 deleted: besides Node built-ins it imports `lib/artifact.mjs`, `lib/normalize.mjs` and `../lib/esm-entry.mjs`, spawns `.skilled/hooks/env-secret-guard/cli/env-secret.cjs` and requires `.skilled/bin/lib/launcher-ipc-bridge.cjs` only when `SYSTEM_SKILL_ADVISOR_DB_DIR` is set. At `1f85a9dd6dd` the bridge requires only Node built-ins and still exports `resolveIpcSocketDir` as a function. `hf-model-server.cjs` appears in the tool only as a path string, which M4 still needs now that the file is gone, because a server started before the update keeps running from that path. The trigger index is the pre-removal build: 10 of its 13 lane targets outside `specs/` no longer exist, and phase 006 is rewriting the two changelog entries; phase 007 regenerates it. Earlier in this planning run, the same prompt under `python3 -c 'pty.spawn(...)'` with stdin piped never returned after the child exited and was killed by pid, which is why the driver uses `os.openpty`. The run-all suite count stays 7 when a new `*.test.cjs` lands, because node:test counts files inside one suite.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the four hardening items in `sweep-lane-residue.mjs`: the exact socket file a custom `HF_EMBED_SERVER_URL` names (H1); ownership by the process's first script argument, compared through the real path of the script's folder because the script itself is deleted after the update, with the same parse deciding what M4 lists, since a shell that only mentions the script was listed during planning (H2); no change at all from apply in a checkout that still holds a lane source (H3); M5 moved to the package-local model cache under both packages, as an owned delete, with the hub-cache check, its prompt and `--hf-home` removed (H4).
- Add the apply-only `--shared-model delete|keep` answer and an `askFirst` list in the machine and apply reports, so a caller without a terminal can ask the question the tool would ask and pass the answer for that run only.
- Add the index check to repo mode: the four outputs of the trigger index generator (the index, its corpus manifest, its generation diagnostics and its phrase variants) are read by structure instead of by plain text, and a lane phrase, path or string in them is live only when it points outside `specs/` and outside the allowlist. This is the rule phase 007's `derived` helper runs by hand, which 007's open question 2 proposed this phase build in, so 007's four whole-file rows for those outputs can go (research 5.5).
- Wire the cleanup into `doctor-update-apply.yaml` after `phase_6_rebuild_prompt`, with a presentation section, a startup-plan disclosure line, a `lane_cleanup` state-log field and contract-test coverage.
- Make repo mode block: a new job in `advisory-checks.yml` and a node:test in the doctor tests, each proven green on the phase commit before it lands.
- Bring the retrieval README, the workflows README, the two `/doctor:update apply` playbook entries and, if it disagrees, the advisor's removal changelog upgrade step in line with the wiring.

### Out of Scope
- Running `sweep-lane-residue.mjs apply`, `/doctor:update apply` or any delete against the operator's HOME or this checkout - parent decision D6. Every apply in this phase runs against fixtures; machine mode on the operator's Mac runs read-only and stays at exit 1 (open question 2).
- Running `npm ci` or a build from the cleanup - M2 and stale compiled output stay report-only with the command named, because an install needs its own yes and the update's rollback cannot undo it (`plan.md` ADR-009).
- Cleaning linked worktrees - M8 reports them; apply never touches another checkout, as phase 001 decided.
- A pre-commit gate - repo mode takes 8.15 s and 57 s of CPU, and the hook's own header sends checks that cost more than they catch to CI (ADR-006).
- Renaming the advisory job's `name:` at `advisory-checks.yml` 30, which phase 005 routed here - open question 3; this phase adds a job and leaves that name alone.
- Allowlist rows for matches phases 006 and 007 already decided - the conductor put those rows in 006. This phase adds a row only for a path its T001 finds live with a non-lane match those phases left, and expects none.
- Changing the trigger index generator or keeping `specs/` out of its corpus - phase 007's ADR-002 rejected that, because retrieval over spec packets needs them.
- Pushing or merging - parent decision D2, so the new CI job first runs when the operator pushes.

### Files to Change

`K/` is `.skilled/skills/system-spec-kit/`, `D/` is `.skilled/commands/doctor/` and `W/` is `.github/workflows/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `K/runtime/cli/retrieval/sweep-lane-residue.mjs` | Modify | H1 to H4; `--shared-model delete\|keep` (apply only); `askFirst` in machine and apply reports; the trigger index check in repo mode; `SCHEMA_VERSION` 2, because the report drops `hubRoot` and gains two fields; usage lines without `--hf-home` |
| `K/runtime/cli/tests/sweep-lane-residue.vitest.ts` | Modify | Cases for each change above; the two-run case for goal criterion 5; the end-to-end fixture case and the spawned-binary case for criterion 2; a terminal case through a pseudo-terminal, skipped when `python3` is absent; `HF_EMBED_SERVER_URL` added to the scrubbed variables; the hub-cache fixture replaced by the package-local one |
| `K/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Modify | Delete the four whole-file rows phase 007 adds for the index outputs, which the index check replaces; add a row only for a path T001 classifies as a non-lane match left by 006 or 007, and expect none |
| `K/runtime/cli/retrieval/README.md` | Modify | Lines 25, 71 and 99: wired into `/doctor:update apply` and CI, `--shared-model`, no `--hf-home`, the package-local cache |
| `D/assets/doctor-update-apply.yaml` | Modify | `action` line; a `phase_7_lane_cleanup` after `phase_6_rebuild_prompt`, with `phase_7_state_log` renamed `phase_8_state_log`; the cleanup tool in `upstream_assets`; its owned targets in `mutation_boundaries`; `lane_cleanup` in `state_log_schema` and the terminal rule |
| `D/assets/doctor-update-presentation.txt` | Modify | One disclosure line in the section 4 plan; a new `## 9. Lane Cleanup` section with the question and report templates, after which Result Templates and Compatibility Action become 10 and 11; a `Lane cleanup:` line in the Apply result |
| `D/scripts/tests/doctor-update-contract.test.cjs` | Modify | The cleanup phase sits after the rebuild prompt and before the state log, runs `apply` with `</dev/null`, passes the answer only on that command, never reads a previous answer, and the state log holds an outcome and no answer |
| `D/scripts/tests/lane-residue-gate.test.cjs` | Create | node:test: repo mode on this checkout exits 0; a planted-term fixture repository exits 1, with the term read from the tool's own export so the test names none |
| `W/advisory-checks.yml` | Modify | A blocking `lane-residue` job: the file's switch condition, checkout and Node only, repo mode, no `continue-on-error`; the header comment counts three jobs |
| `W/README.md` | Modify | The `advisory-checks.yml` row names the blocking residue job |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md` | Modify | Expected signals: the cleanup after the rebuild outcome, the question only when a local model server lists the model, `lane_cleanup` in the state log |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md` | Modify | The possible shared-model question in the scripted conversation, answered no |
| `.skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md` | Modify (conditional) | Only if its upgrade step disagrees with the wiring, as phase 006's open question asked this phase to check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On the phase commit, `node T repo` exits 0 and prints `live        : 0` with no `allowlist rows that matched nothing` block; `counts.allowlistRows` differs from T001's only by the rows this phase names (the four index-output rows removed, and a row for each path T001 classified); and no file this phase writes outside the tool, its test and its allowlist matches either residue pattern. |
| REQ-002 | The planted-term fixture exits 1 in both gates: the vitest case for a planted term passes, and `lane-residue-gate.test.cjs` builds a fixture repository whose one tracked file holds a term from the tool's own `IDENTIFIER_TERMS` and asserts exit 1, while the same test's run over this checkout asserts exit 0. |
| REQ-003 | Machine mode exits 0 on a fixture HOME and checkout, proven twice: in-process, a fixture with M1, M3, M4, M5 and M6 leftovers planted and a fake model server, cleaned by apply with `--shared-model delete`, returns exit 1 with M2 as the only found check, then exit 0 once the test removes the planted module folders the way `npm ci` with the new lockfiles removes them; and the spawned binary, `node T machine` with every location flag, `HOME` and `OLLAMA_MODELS` pointed at a clean fixture, a socket path it never creates and the location variables unset, exits 0 as read from the process. |
| REQ-004 | `doctor-update-apply.yaml` runs the cleanup after the rebuild prompt: `grep -n '^  phase_'` lists `phase_6_rebuild_prompt`, `phase_7_lane_cleanup` and `phase_8_state_log` in that order; the cleanup phase runs `node T machine --json`, asks when `askFirst` is not empty, then runs `node T apply --json` with `--shared-model <answer>` only when it asked, and `</dev/null`; it runs on every path that reached the rebuild prompt and on no other; and the contract test asserts each of these. |
| REQ-005 | Two consecutive fixture runs each ask and remember nothing: with a fake model server that lists the model and an injected confirm that answers no, two apply runs on one fixture call confirm once each with the same question, send no DELETE, leave the model listed, and leave the sorted file list of the fixture HOME and checkout the same after run 2 as before run 1. |
| REQ-006 | The one-run answer works and is bounded: `--shared-model delete` sends exactly one DELETE and calls confirm 0 times; `--shared-model keep` with a terminal calls confirm 0 times and sends no DELETE; no flag and no terminal keeps the model with a `kept` action; `machine --shared-model keep` and `apply --shared-model maybe` each exit 2; `askFirst` holds the question exactly when the server listed the model and the checkout holds no lane source. |
| REQ-007 | H1: with `HF_EMBED_SERVER_URL=unix://<fixture>/custom.sock`, machine mode reports `custom.sock` as a model-server file and apply deletes it by name, keeps the folder and its other files, and still deletes the four fixed names there. |
| REQ-008 | H2: ownership follows the first script argument: `node <script>`, `node <script> --flag` and `node --inspect <script>` are owned; `node /other.js <script>`, `less <script>` and node running another checkout's script are not; a script path reached through a symlinked folder is owned; and a script deleted from disk is still owned through its folder's real path. The same parse decides what M4 lists at all: node running any checkout's server script as its first argument is listed, while a process whose command line only mentions the script, such as `/bin/zsh -c '... hf-model-server.cjs ...'` or `less <script>`, is not listed and leaves machine mode at exit 0. |
| REQ-009 | H3: in a fixture checkout that holds any of `semantic-shadow.ts`, `lib/embedders/`, `shared/embeddings/` or `.skilled/bin/hf-model-server.cjs`, apply deletes nothing, stops nothing, asks nothing, records each item as `kept` with a reason naming the source, and exits 1; the same fixture without the source is cleaned. |
| REQ-010 | H4: M5 reports `node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5` under the advisor runtime and the spec-kit package; apply deletes it without asking; nothing reads the hub cache; `machine --hf-home x` exits 2 as an unknown argument. |
| REQ-011 | CI gates repo mode: `advisory-checks.yml` holds a `lane-residue` job with the file's switch condition, no `continue-on-error`, checkout and setup-node only, running `node T repo`; `actionlint` on the file exits 0; `check-gate-inputs.sh` prints `RESULT: PASSED`; `ci-report.cjs --json --no-gh` shows the file with 3 jobs and no flags; and the job's run block, executed locally on the phase commit, exits 0. |
| REQ-012 | The doctor tests gate repo mode: `run-all.sh` prints `node:test (56 files)` and `7 suite(s) passed, 0 failed`, and `node --test D/scripts/tests/lane-residue-gate.test.cjs` passes both cases. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-013 | The index check: a fixture whose tracked index maps a lane phrase, or a lane spelling in its phrase variants, to a path outside `specs/` that is not an allowlist row exits 1 and names the phrase and the path; a lane path outside `specs/` in the corpus manifest or the generation diagnostics exits 1; a fixture whose lane entries point only under `specs/` or at allowlisted paths exits 0, with no row for any of the four outputs; and on the phase commit no allowlist row names any of the four outputs. |
| REQ-014 | The generator check modes and behavior probes deferred from phase 001 pass once on the final tree, each recorded with where it already gates: `generate-trigger-index.mjs --check` exits 0; `generate-leaf-manifest.cjs --check` prints `OK` for the advisor and spec-kit; `skill-graph-freshness.cjs --strict` exits 0; `derive-command-bridges.cjs --check` exits 0; `cli-exit-taxonomy.vitest.ts` and `handlers/advisor-status.vitest.ts` pass, pinning exit 64 for the removed flag and exactly four lane weights; `_routes.yaml` holds six `/doctor:skill-advisor` targets. |
| REQ-015 | Machine mode loads no deleted module after phase 005: `node --check T` exits 0, every path the tool imports, spawns or requires exists, and a fixture run with `SYSTEM_SKILL_ADVISOR_DB_DIR` set derives the pinned folder without a "could not be derived" note. |
| REQ-016 | The wiring stays consistent: each edited file outside the tool, its test and its allowlist prints 0 residue lines; the retrieval README no longer says the tool is not wired; both playbooks name the cleanup step and `lane_cleanup`; and the removal changelog's upgrade step says what the wired cleanup does, or is corrected so that it does. |
| REQ-017 | The operator's machine is never changed (parent decision D6): every apply in this phase runs against a fixture root, HOME, database folder, socket folder and model server; the Ollama manifest listing, the absence of `/tmp/system-hf-embed` and the per-check machine-mode statuses read at T003 read the same at the end. |
| REQ-018 | Gates are no worse than at the start commit: the sweep suite passes with 51 plus the new cases; route-validate prints `OK`; the mirror check prints `PASS`; the link check prints `0 broken`; and no added line names a spec, phase, task, requirement or decision id. |
| REQ-019 | The state log and presentation carry the outcome and never an answer: `state_log_schema` gains `lane_cleanup: "clean\|cleaned\|remaining\|failed\|not_run\|not_applicable"` and no field holds the shared-model answer; the presentation's plan shows the disclosure line, section 9 holds the question and report templates, and the Apply result shows `Lane cleanup:`; a cleanup exit 1 renders as `remaining`, never as `STATUS=FAILED`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Repo mode exits 0 on the phase commit, and both gates turn red on a planted term: the CI job's command and the doctor test each exit 1 on the fixture.
- **SC-002**: An agent-run `/doctor:update apply` shows the shared-model question on every run where a local model server lists the model, and the tool keeps the model on every run that has neither a terminal nor an answer.
- **SC-003**: On a fixture, machine mode goes from exit 1 with every check M1 to M6 found to exit 0, and two consecutive runs each ask once with no file left behind.
- **SC-004**: The sweep suite, run-all, route-validate, the mirror check, the link check, actionlint and the gate-input check print their start-commit results or better.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007's commit with repo mode at exit 0 | A gate that fails at merge blocks every unrelated commit | T001 halts while any path is live that is not a non-lane match 006 or 007 left; the CI job lands only after T025 shows exit 0 on the same tree |
| Dependency | Phase 006's removal changelog entry | Its upgrade step may promise what the wiring does not do | T024 compares the two and fixes the entry's step if they disagree |
| Risk | The one-run answer lets an agent delete the shared model without asking | High | The flag names no default, is refused outside apply, and is read only from that command line; the contract test pins the ask-then-pass order and that no answer is stored or read; open question 1 puts the D5 reading to the conductor |
| Risk | The cleanup deletes a live database under a running old daemon | Med | It runs after the rebuild prompt, so after a rebuild only the `.bak` copy is left to delete; the daemon recreates and rescans a missing database at start, as phase 001 recorded; the result names a daemon restart |
| Risk | A wiring file names a residue term and the new gate fails on its own commit | Med | ADR-008 keeps every term inside the tool; T017 to T024 each run the patterns on their file and T025 runs repo mode before T026 writes the job |
| Risk | The pseudo-terminal case hangs CI | Med | Its driver kills the child at a deadline, it is skipped without `python3`, and T016 runs the suite three times |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The CI job finishes inside its `timeout-minutes: 10`; repo mode itself took 8.15 s on this machine. The cleanup adds one `machine` run (0.46 s here, plus at most the tool's 1.5 s model-server timeout) and at most one `apply` run to an update.

### Security
- **NFR-S01**: `--shared-model` accepts only `delete` or `keep`, only in apply mode, and only from the command line of the run it answers; no answer is written to any file, including the doctor state log. Apply still deletes only fixed names under resolved roots and refuses symlinks, and the doctor workflow never reads a dotenv value.

### Reliability
- **NFR-R01**: The cleanup never turns an applied update into a failure: its exit 1 renders as `lane_cleanup=remaining` with the kept and reported items, its exit 2 as `failed` with the tool's notes, and a missing tool as `not_applicable`; the update's `STATUS` is decided by the release write and its battery alone.

---

## 8. EDGE CASES

- Empty input: on a machine with nothing left, `machine --json` exits 0, the workflow records `lane_cleanup=clean`, runs no apply and asks nothing.
- Maximum input: the operator's Mac lists 549 M8 items across the 24 other worktrees; apply only reports them, and the cleanup section shows a count per worktree with the `--json` report as the full list, not 549 lines.
- Failure path: with the local model server down, M6 is found through the model store's manifest and `askFirst` is empty, so no question is asked and the report names `ollama rm` or a restart and rerun; a tool exit 2 with nothing found records `failed` and the tool's notes, and apply does not run.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 13 (1 created, 12 modified, the changelog entry only if it disagrees); LOC: about 700, half of it tests; Systems: the residue tool, the doctor update workflow, CI |
| Risk | 13/25 | Auth: N, API: N, Breaking: Y (the report schema and `--hf-home`, with no consumer yet); deletes on user machines, guarded by fixed names and fixtures |
| Research | 7/20 | Research 5.3 to 5.5 and phase 001's review findings; this plan measured both modes, the model cache location, the trigger index and a pseudo-terminal driver |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 10/15 | Dependencies: phase 007's commit, phase 006's changelog entry, the conductor's two readings, the operator's job-name answer |
| **Total** | **47/100** | **Level 3** |

The level helper printed Level 2 for 700 lines and 13 files; the conductor scaffolded this phase at Level 3 like its siblings, and the plan keeps it (`plan.md` ADR-011).

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An agent passes `--shared-model delete` without asking | H | L | Contract test pins ask-then-pass on one command and no stored answer; open question 1 |
| R-002 | The new CI job fails on its own commit | H | L | T025 runs repo mode on the final tree before T026 writes the job |
| R-003 | H2 stops a process it does not own | H | L | Only the first script argument counts, compared through real paths; a parse it cannot read means not owned; REQ-008's table |
| R-004 | H3 blocks cleanup on a checkout that has taken the removal | M | L | The four sentinel paths are deleted by phases 004 and 005; the guard reads only those paths |
| R-005 | The index check fails after a lane doc is deleted until the index is rebuilt | M | M | Only lane entries pointing outside `specs/` and the allowlist count, and after 007's regeneration there are none; the error names the regenerate command |
| R-006 | Removing `--hf-home` breaks a caller | L | L | `git grep -n -E 'hf-home\|HF_MODEL_FOLDER\|resolveHfHubRoot' -- ':!specs'` lists only lines inside the tool itself |

---

## 11. USER STORIES

### US-001: An update cleans what the lane left (Priority: P0)

**As a** user running `/doctor:update apply`, **I want** the lane's database copy, compiled output, model cache and server files gone after the update, and a question about the shared model each time, **so that** nothing of a removed feature stays on my machine without my say.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A returning lane term fails the build (Priority: P0)

**As a** maintainer, **I want** CI and the doctor tests to fail when a tracked file outside `specs/` names the lane again, **so that** the removal stays proven without anyone rereading every tracked file.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: The conductor can close the removal on evidence (Priority: P1)

**As** the conductor, **I want** repo mode at 0, machine mode at 0 on a fixture and the two-run proof recorded with their commands, **so that** the parent's handoff criteria close without running apply on the operator's machine.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

These sit here rather than in `goal.md`, because this run may not edit `goal.md`.

- **Resolved by the conductor: decision D5 in an agent-run update.** An agent's shell has no terminal, so the workflow asks the shared-model question the tool reports in `askFirst` and passes the answer to that one apply run; nothing stores or reads it back, so every run asks and none remembers (`plan.md` ADR-001, Accepted).
- **Resolved by the conductor: goal criterion 2 is evidenced on fixtures, not reworded.** Machine mode exits 0 on a fixture HOME and checkout after the cleanup; the operator's machine is only read (decision D6) and stays at exit 1 until the operator removes the pulled model, runs phase 005's `npm ci` and retires the older worktrees. The run reports that state as unmet on the operator's machine rather than claiming it (`plan.md` ADR-010, Accepted).
- **Operator, open: the advisory job's name.** Phase 005 routed the `name:` at `advisory-checks.yml` 30, which still mentions doc-model references, here. The workflows README says `message-contract.yml` holds the only context the branch ruleset requires, so a rename looks safe, but this phase adds a job and leaves the name alone until the operator says.
- **Resolved by the conductor: M8 stays gating.** A linked worktree that still holds lane sources really does hold the lane, so machine mode reports it.
- **Resolved: an empty database is rescanned.** Phase 001 found that the daemon scans at every start and creates a missing database (`../001-residue-check-and-cleanup-tool/spec.md` section 12), so discarding the database needs no extra step.
- **Resolved by the conductor: this phase replaces phase 007's four index-output rows with the index check.** Phase 001's spec deferred the trigger-index assertions (research R4) to this phase, and a structural check that every lane phrase in the index traces to `specs/` or an allowlisted file is stronger than whole-file rows, which would hide a future lane term in those outputs (`plan.md` ADR-007, Accepted).
- **Resolved: no wiring file needs an allowlist row.** The question text and the model name live in the tool and reach the workflow through `askFirst` (`plan.md` ADR-008).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Design source**: See `../../023-ollama-deprecation-research/research/research.md` sections 5.2 to 5.5, `../../023-ollama-deprecation-research/decision-record.md` Q005, Q006 and Q008, and `../001-residue-check-and-cleanup-tool/implementation-summary.md` Known Limitations
