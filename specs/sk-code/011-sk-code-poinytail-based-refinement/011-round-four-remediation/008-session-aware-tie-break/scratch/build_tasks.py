# Planner script: writes tasks.md from dispatch-units.json plus the fixed Phase 1 and Phase 3 text.
# Run from the repository root after build_units.py.
import json

F = "specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break"
FV = f"F={F};"
AU = "specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program"
RT = ".skilled/bin/lib/compiled-routing"
HUB = ".skilled/skills/sk-code"
WF5 = "Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks."
WF13 = "Check a Webflow TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish."
OW = "obsidian plugin webflow implementation"
RV = "pr review webflow implementation opencode typescript"
PROBE = f'node $F/scratch/probe-route.cjs "{WF5}" "{WF13}" "{OW}" "{RV}"'
SCOPE = ("git status --porcelain -- .skilled/bin/compiled-route.cjs .skilled/bin/tests/compiled-route-surface-hint.test.cjs "
         f"{RT}/009-parent-hub-rollout/001-sk-code {RT}/014-runtime-engine {RT}/013-live-activation/activation/sk-code/manifest.json "
         f"{AU}/009-parent-hub-rollout/001-sk-code {AU}/014-runtime-engine/lib {AU}/013-live-activation/activation/sk-code/manifest.json "
         f"{HUB}/SKILL.md {HUB}/ROUTER.md {HUB}/README.md {HUB}/description.json {HUB}/hub-router.json {HUB}/mode-registry.json {HUB}/changelog")
PAIRS = [
    "009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs",
    "009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs",
    "014-runtime-engine/lib/compiled-route.cjs",
    "014-runtime-engine/lib/resolve.cjs",
    "009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json",
]
CMP_ALL = "; ".join(f'cmp {AU}/{p} {RT}/{p}; echo "cmp=$?"' for p in PAIRS)
TESTS3 = ("for t in compiled-route-front-door compiled-route-admission compiled-route-manifest; do "
          "node --test --test-reporter=tap .skilled/bin/tests/$t.test.cjs > $F/scratch/{pfx}-$t.txt 2>&1; "
          "echo \"$t exit=$?\"; grep -E '^# (pass|fail) ' $F/scratch/{pfx}-$t.txt; done")
GUARDS = ("node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs > $F/scratch/{pfx}-router-sync.txt 2>&1; echo \"rs=$?\"; tail -1 $F/scratch/{pfx}-router-sync.txt; "
          "node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs > $F/scratch/{pfx}-doc-claims.txt 2>&1; echo \"dc=$?\"; tail -1 $F/scratch/{pfx}-doc-claims.txt; "
          "node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code | /usr/bin/grep -E '5e:|5i:|13c|^OK|^FAIL'; "
          "node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code; echo \"leaf=$?\"")
DOCS = ("for f in SKILL.md ROUTER.md; do python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/$f | /usr/bin/grep -o 'VALID\\|INVALID\\|Total issues: [0-9]*'; "
        "python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/$f | /usr/bin/grep 'hard blockers'; done; "
        "node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/compiled-routing-lockstep-parity.test.cjs > $F/scratch/{pfx}-lockstep.txt 2>&1; echo \"lockstep=$?\"; tail -3 $F/scratch/{pfx}-lockstep.txt")


def t(text):
    return text


units = json.load(open(f"{F}/scratch/dispatch-units.json"))


def unit_line(u):
    path = u["files"][0]
    tid = u["task"]
    if u["kind"] == "create":
        src = u["instruction"].rsplit(" ", 1)[1]
        body = f"Create `{path}` with exactly the content of `{src}` (unit {tid}). Check: `{u['check']}`. Expected: `{u['expect']}`."
    elif u["kind"] == "command":
        body = f"Run `{u['instruction']}` (unit {tid}). Check: `{u['check']}`. Expected: `{u['expect']}`."
    else:
        old, new = u["instruction"].split("<<<OLD\n", 1)[1].split("\nOLD>>> with <<<NEW\n", 1)
        new = new[: -len("\nNEW>>>")]
        if "\n" not in old and "`" not in old and "`" not in new and "\n" not in new:
            body = f"In `{path}`, replace the exact text `{old}` with `{new}` (unit {tid})."
        else:
            first = old.split("\n")[0].strip()
            body = (f"In `{path}`, replace the exact text given as OLD with the text given as NEW in unit {tid} of "
                    f"`{F}/scratch/dispatch-units.json`. OLD is {old.count(chr(10)) + 1} line(s), starts with `{first}` and occurs exactly once. "
                    f"{DESC[tid]}")
        body += f" Check: `{u['check']}`. Expected: `{u['expect']}`."
    return f"- [ ] {tid} {TITLE[tid]} {body} (`{path}`)"


TITLE = {
    "T014": "Add the test file first, so it can fail before the change.",
    "T015": "Negative control for the tests: the hint cases must fail against the unchanged code. The run prints `exit=1`.",
    "T016": "Add the five canary cases after the implementation-phrased collision case.",
    "T017": "Negative control for the canary: the three hinted cases must fail against the unchanged harness. The run prints `exit=1`, and the check prints `cases 18 failures 3` then `3`.",
    "T018": "Add the hint functions to the authored canary router.",
    "T019": "Export `applySurfaceHint` from the authored canary router.",
    "T020": "Copy the authored canary router over its runtime copy.",
    "T021": "Import `applySurfaceHint` in the authored canary harness.",
    "T022": "Apply a case's `surfaceHint` in the authored harness `typedGold`.",
    "T023": "Copy the authored canary harness over its runtime copy.",
    "T024": "Store the hub router's `applySurfaceHint` in the authored engine.",
    "T025": "Accept `options.surfaceHint` in the authored engine `compiledRoute`.",
    "T026": "Copy the authored engine over its runtime copy.",
    "T027": "Pass `options` through the authored resolver `resolveRoute`.",
    "T028": "Copy the authored resolver over its runtime copy.",
    "T029": "Read `--surface-hint` in the front door.",
    "T030": "Name the flag in the front door usage line.",
    "T031": "Pass the hint from the front door to the resolver.",
    "T032": "Copy the live canary fixture over its archive copy.",
    "T033": "Bump the hub SKILL.md version.",
    "T034": "Add the caller step to the hub SKILL.md, after the compiled-routing blockquote and outside it.",
    "T035": "Bump the ROUTER.md version.",
    "T036": "Add the caller sentence to ROUTER.md.",
    "T037": "Bump the hub README version.",
    "T038": "Bump the description.json version.",
    "T039": "Bump the hub-router.json version.",
    "T040": "Bump the mode-registry.json version.",
    "T041": "Create the hub changelog entry.",
}
DESC = {
    "T016": "NEW keeps that text and inserts five case objects before the `single-quality` object: `surface-hint-absent-webflow-testing`, `surface-hint-webflow-testing`, `surface-hint-absent-webflow-language`, `surface-hint-webflow-language` and `surface-hint-webflow-over-obsidian`.",
    "T018": "NEW keeps those lines and inserts the functions `hintedSurface` and `applySurfaceHint` with their comments before `function evaluateCanary(snapshot, input) {`. The file holds two literal NUL bytes elsewhere. Edit with a tool that writes every other byte back unchanged.",
    "T019": "NEW adds the line `  applySurfaceHint,` after `  advisorDisposition,`.",
    "T022": "NEW replaces `evaluated.decision.route.targets.map(` with `applySurfaceHint(snapshot, evaluated.decision.route.targets, entry.surfaceHint).map(`.",
    "T024": "NEW inserts a two-line comment and `const applySurfaceHint = ...` between the two lines and adds `applySurfaceHint` to the frozen engine object.",
    "T025": "NEW adds three comment lines, the `options = {}` parameter, `applySurfaceHint` in the destructuring, `let route` in place of `const route` and the guarded reorder block.",
    "T027": "NEW extends the comment by one line, adds the `options = {}` parameter and passes `options` to `compiledRoute`.",
    "T029": "NEW inserts two comment lines, `const hintIdx = args.indexOf('--surface-hint');` and `const surfaceHint = hintIdx >= 0 ? args[hintIdx + 1] : undefined;` before `  if (!hub) {`.",
    "T034": "NEW keeps that text and inserts the paragraph that starts `**Session surface hint.**` before the `### Surface Router` heading.",
    "T036": "NEW appends the sentence that starts `The detected surface also goes to the compiled front door as` to the Core Principle paragraph.",
}

head = open(f"{F}/tasks.md").read().split("<!-- ANCHOR:phase-1 -->")[0]
head = head.rstrip() + "\n\n"
intro = (f"Run every command from the repository root. Shell state does not carry between commands, so every command that uses the folder starts with `{FV}`. "
         "Save outputs in `$F/scratch/` with a `before-` or `after-` prefix. `$F/scratch/dispatch-units.json` holds one unit per Phase 2 edit task with the exact OLD and NEW text, the check and its expected output. "
         "`$F/scratch/units/` holds the full text of the two files this phase creates. `$F/scratch/canary-assert.cjs`, `probe-route.cjs`, `all-canaries.cjs` and `advisor-battery.cjs` are read-only checks copied from child 003. "
         "`build_units.py`, `build_tasks.py`, `check-units.cjs`, `mirror-setup.sh` and `mirror-apply.cjs` are planner tools: do not run them. Do not edit or delete anything under `$F/scratch/` except the outputs you write. "
         "Never edit a file outside the `spec.md` Files to Change table, never run the Hermes generator without `--check`, never re-mint and never run `compiled-route-sync.cjs` without `--verify`. Record a sibling's failure instead of fixing it.\n\n")

p1 = [
    f"- [ ] T001 Save the scope baseline. Run `{FV} {SCOPE} > $F/scratch/status-before.txt; echo \"exit=$?\"; cat $F/scratch/status-before.txt`. Expected: `exit=0` and, once children 001 to 007 are committed, nothing else. Any line printed is the baseline for T059. (`$F/scratch/status-before.txt`)",
    f"- [ ] T002 [P] Reproduce the defect. Run `{FV} {PROBE} > $F/scratch/before-probe.txt; echo \"exit=$?\"; cat $F/scratch/before-probe.txt; grep -c -F -- '--surface-hint' .skilled/bin/compiled-route.cjs`. Expected: `exit=0`, then the four lines `\"{WF5}\" route orderedBundle sk-code-opencode,sk-code-webflow`, `\"{WF13}\" route orderedBundle sk-code-opencode,sk-code-webflow`, `\"{OW}\" route orderedBundle sk-code-obsidian,sk-code-webflow` and `\"{RV}\" route surfaceBundle sk-code-review,sk-code-opencode,sk-code-webflow`, then `0`. If the first line already reads `sk-code-webflow,sk-code-opencode`, stop and report that the item no longer reproduces. (`.skilled/bin/compiled-route.cjs`)",
    f"- [ ] T003 [P] Record the sk-code canary baseline. Run `{FV} node $F/scratch/canary-assert.cjs > $F/scratch/before-canary.txt 2>&1; echo \"exit=$?\"; tail -1 $F/scratch/before-canary.txt; cmp {RT}/{PAIRS[4]} {AU}/{PAIRS[4]}; echo \"cmp=$?\"`. Expected at plan time: `exit=0`, `cases 13 failures 0` and `cmp=0`. If the case count differs, record it as N and read every later `18` as N+5. (`{RT}/{PAIRS[4]}`)",
    f"- [ ] T004 [P] Record every hub canary. Run `{FV} node $F/scratch/all-canaries.cjs > $F/scratch/before-all-canaries.txt 2>&1; echo \"exit=$?\"; cat $F/scratch/before-all-canaries.txt`. Expected at plan time: `exit=1`, seven hub lines, one line `  FAIL 004-cli-external-orchestration jev-transport-single defer - `, `001-sk-code cases 13 failures 0` and `all hubs failures 1`. That failure is outside this phase and is the baseline. (`$F/scratch/before-all-canaries.txt`)",
    f"- [ ] T005 [P] Record that each runtime closure file matches its authored copy. Run `{CMP_ALL}`. Expected: five lines of `cmp=0` and nothing else. (`{RT}/014-runtime-engine/lib/resolve.cjs`)",
    f"- [ ] T006 [P] Record the existing compiled-route tests. Run `{FV} {TESTS3.format(pfx='before')}`. Expected at plan time: `compiled-route-front-door exit=1` with `# pass 0` and `# fail 1` (the committed sk-code manifest is stale), `compiled-route-admission exit=1` with `# pass 28` and `# fail 1`, and `compiled-route-manifest exit=1` with `# pass 26` and `# fail 16`. After the orchestrator re-mints the earlier children these may read better. Record what prints, it is the baseline for T049. (`.skilled/bin/tests/compiled-route-front-door.test.cjs`)",
    f"- [ ] T007 [P] Record the hub guard baselines. Run `{FV} {GUARDS.format(pfx='before')}`. Expected: `rs=0`, `router-sync: 5/5 checks passed`, `dc=0`, `doc-claims: 4/4 checks passed`, `PASS: 5e: routerPolicy.tieBreak covers every registered mode`, `PASS: 5i: tieBreak orders workflow modes before surface/transport modes`, `PASS: 13c-readme-version: README.md carries the SKILL.md version 2.2.6.0`, a line that starts `OK: parent-skill-check` and ends `all hard invariants passed, 0 warnings`, `leaf-manifest.json OK (59ea33fd766514d568f793234145be7aa5ae90d9482669cf383eb3c6f237b441)` and `leaf=0`. Record what prints. (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs`)",
    f"- [ ] T008 [P] Record compiled-routing freshness. Run `{FV} node .skilled/bin/compiled-route-guard.cjs > $F/scratch/before-crg.txt 2>&1; echo \"exit=$?\"; grep -E 'sk-code |All hubs|need attention' $F/scratch/before-crg.txt; node .skilled/bin/compiled-route-sync.cjs --verify; echo \"verify=$?\"`. Expected: either `exit=0`, `  sk-code                     fresh` and `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.` with `move-simulation OK: all 7 hubs resolve; 0 reads under .opencode/specs` and `verify=0`, or, at plan time, `exit=1`, `  sk-code                     stale-manifest`, `1 hub(s) need attention.`, `SYNC FAILED: MOVE-SIMULATION FAILED:` and `verify=1`. Record which. Never run `compiled-route-sync.cjs` without `--verify`. (`.skilled/bin/compiled-route-guard.cjs`)",
    f"- [ ] T009 [P] Record the advisor battery. Run `{FV} node $F/scratch/advisor-battery.cjs > $F/scratch/before-advisor.txt 2>&1; echo \"exit=$?\"; tail -1 $F/scratch/before-advisor.txt`. Expected: `exit=0` and `positives 13/17 negatives-false-positive 2/5`. It takes about 20 seconds. (`.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`)",
    f"- [ ] T010 [P] Record the hub document and lockstep baselines. Run `{FV} {DOCS.format(pfx='before')}`. Expected: `VALID`, `Total issues: 0`, `  hard blockers:          36` for `SKILL.md`, then `VALID`, `Total issues: 1`, `  hard blockers:          32` for `ROUTER.md`, then `lockstep=0` and the three lines ending `[sk-doc] live report: 1 surface(s) diverge from the majority wording (informational, not asserted):` and `  - hub-skill.mcp-tooling: compiled-routing directive wording differs from the other 6 in-sync lockstep surface(s)`. Record what prints. (`.skilled/skills/sk-code/SKILL.md`)",
    f"- [ ] T011 [P] Record the Hermes copy baseline, check form only. Run `{FV} node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check > $F/scratch/before-hermes.txt 2>&1; echo \"exit=$?\"; grep -E 'DRIFT|PASS|FAIL' $F/scratch/before-hermes.txt`. Expected: `exit=0` with `PASS`, or `exit=1` with the DRIFT lines that sibling builds left. Record what prints. Never run the generator without `--check`. (`$F/scratch/before-hermes.txt`)",
]

p2 = [
    "- [ ] T012 Read the authoring contracts before the first edit of each kind, and follow them in every task below. Code (`.cjs` files and the JSON fixture): `.skilled/skills/sk-code/SKILL.md`, then `.skilled/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md` for the module header of the new test file. Markdown outside spec folders: `.skilled/skills/sk-doc/SKILL.md`, then `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` with its `assets/changelog-template.md` (T041) and `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` (no em dash and no semicolon in new prose). Expected: nothing is written. (`.skilled/skills/sk-code/SKILL.md`)",
    f"- [ ] T013 Unit order. Apply T014 to T041 one at a time, in order, each as the unit with the same id in `$F/scratch/dispatch-units.json`. Run each unit's check and compare it with its `expect` before the next unit. Stop on the first mismatch. Every edit unit's OLD text occurs exactly once in its file at plan time (`node $F/scratch/check-units.cjs` printed `units 28, edit units 19, OLD not unique 0`). (`$F/scratch/dispatch-units.json`)",
]
p2 += [unit_line(u) for u in units]
p2 += [
    "- [ ] T042 For the orchestrator, not the builder: re-mint the compiled sk-code manifest after every build, because `SKILL.md`, `hub-router.json` and `mode-registry.json` feed its policy hash. The orchestrator runs `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`, then `node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code '` prints `fresh`. The builder leaves this unticked. (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`) PENDING-ORCHESTRATOR",
    f"- [ ] T043 For the orchestrator, not the builder: copy the re-minted manifest over its archive copy. The orchestrator runs `cp {RT}/013-live-activation/activation/sk-code/manifest.json {AU}/013-live-activation/activation/sk-code/manifest.json`, then `cmp` of the two files prints nothing and exits 0. The builder leaves this unticked. (`{AU}/013-live-activation/activation/sk-code/manifest.json`) PENDING-ORCHESTRATOR",
    "- [ ] T044 For the orchestrator, not the builder: regenerate the Hermes skill copies once after every sibling build. The orchestrator runs `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, then `--check` prints `PASS`. The builder marks this `[x]` with `deferred: orchestrator runs this generator after all builds`. (`.hermes/skills/sk-code/SKILL.md`) PENDING-ORCHESTRATOR",
    "- [ ] T045 For the orchestrator, not the builder: rebuild the spec-kit trigger index after every build, because the hub `SKILL.md`, `ROUTER.md` and the new changelog entry are indexed docs. The orchestrator runs `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, then its `--check` exits 0. The builder marks this `[x]` with `deferred: orchestrator`. (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`) PENDING-ORCHESTRATOR",
]

JS = [".skilled/bin/compiled-route.cjs", ".skilled/bin/tests/compiled-route-surface-hint.test.cjs"] + [f"{RT}/{p}" for p in PAIRS[:4]] + [f"{AU}/{p}" for p in PAIRS[:4]]
JSON_FILES = [f"{RT}/{PAIRS[4]}", f"{HUB}/description.json", f"{HUB}/hub-router.json", f"{HUB}/mode-registry.json"]
p3 = [
    f"- [ ] T046 Syntax. Run `for f in {' '.join(JS)}; do node --check \"$f\"; echo \"syntax=$?\"; done; for f in {' '.join(JSON_FILES)}; do node -e 'JSON.parse(require(\"fs\").readFileSync(process.argv[1],\"utf8\"))' \"$f\"; echo \"parse=$?\"; done`. Expected: ten lines of `syntax=0`, four lines of `parse=0` and no other output. (`.skilled/bin/compiled-route.cjs`)",
    f"- [ ] T047 REQ-001 and SC-001, SC-002: the hinted surface leads. Run `{FV} node --test --test-reporter=tap .skilled/bin/tests/compiled-route-surface-hint.test.cjs > $F/scratch/after-tests.txt 2>&1; echo \"exit=$?\"; grep -E '^(ok|not ok) |^# (tests|pass|fail) ' $F/scratch/after-tests.txt; grep -E '^# fail ' $F/scratch/neg-tests.txt`. Expected: `exit=0`, six `ok` lines, `# tests 6`, `# pass 6`, `# fail 0`, then `# fail 3` from the T015 negative control. (`.skilled/bin/tests/compiled-route-surface-hint.test.cjs`)",
    f"- [ ] T048 REQ-002 and SC-001: the canary pins the hint in both fixture copies. Run `{FV} node $F/scratch/canary-assert.cjs > $F/scratch/after-canary.txt 2>&1; echo \"exit=$?\"; grep -E 'surface-hint|^cases' $F/scratch/after-canary.txt; tail -1 $F/scratch/neg-canary.txt; cmp {RT}/{PAIRS[4]} {AU}/{PAIRS[4]}; echo \"cmp=$?\"`. Expected: `exit=0`, then `OK surface-hint-absent-webflow-testing route orderedBundle sk-code-opencode,sk-code-webflow`, `OK surface-hint-webflow-testing route orderedBundle sk-code-webflow,sk-code-opencode`, `OK surface-hint-absent-webflow-language route orderedBundle sk-code-opencode,sk-code-webflow`, `OK surface-hint-webflow-language route orderedBundle sk-code-webflow,sk-code-opencode`, `OK surface-hint-webflow-over-obsidian route orderedBundle sk-code-webflow,sk-code-obsidian`, `cases 18 failures 0`, `cases 18 failures 3` from T017 and `cmp=0`. (`{RT}/{PAIRS[4]}`)",
    f"- [ ] T049 REQ-003 and SC-003: no hint means no change. Run `{FV} {PROBE} > $F/scratch/after-probe.txt; diff $F/scratch/before-probe.txt $F/scratch/after-probe.txt; echo \"probe-diff=$?\"; node $F/scratch/all-canaries.cjs > $F/scratch/after-all-canaries.txt 2>&1; echo \"exit=$?\"; diff $F/scratch/before-all-canaries.txt $F/scratch/after-all-canaries.txt; echo \"canary-diff=$?\"; {TESTS3.format(pfx='after')}`. Expected: `probe-diff=0` with nothing printed before it, the T004 exit status, a diff of exactly `1c1`, `< 001-sk-code cases 13 failures 0`, `---`, `> 001-sk-code cases 18 failures 0`, then `canary-diff=1`, then the same exit, `# pass` and `# fail` lines that T006 printed for each of the three test files. (`$F/scratch/after-probe.txt`)",
    f"- [ ] T050 REQ-004: the runtime matches its authored source. Run `{CMP_ALL}; for f in {RT}/{PAIRS[0]} {AU}/{PAIRS[0]}; do tr -cd '\\000' < \"$f\" | wc -c; done`. Expected: five lines of `cmp=0`, then two lines that each read `2` (with leading spaces from `wc`), the two NUL bytes the router held before the edit. (`{RT}/{PAIRS[0]}`)",
    f"- [ ] T051 REQ-005: the hub tells the caller to pass the hint, and the directive block is unchanged. Run `{FV} grep -c -F -- '--surface-hint' .skilled/skills/sk-code/SKILL.md; grep -c -F -- '--surface-hint' .skilled/skills/sk-code/ROUTER.md; {DOCS.format(pfx='after')}; diff $F/scratch/before-lockstep.txt $F/scratch/after-lockstep.txt; echo \"lockstep-diff=$?\"`. Expected: `1`, `1`, then the T010 lines (`SKILL.md` `Total issues: 0` and 36 hard blockers, `ROUTER.md` `Total issues: 1` and 32 hard blockers), `lockstep=0`, the T010 live-report lines, and `lockstep-diff=0` with nothing printed before it. (`.skilled/skills/sk-code/SKILL.md`)",
    f"- [ ] T052 REQ-006: hub guards stay green. Run `{FV} {GUARDS.format(pfx='after')}`. Expected: `rs=0`, `router-sync: 5/5 checks passed`, `dc=0`, `doc-claims: 4/4 checks passed`, `PASS: 5e: routerPolicy.tieBreak covers every registered mode`, `PASS: 5i: tieBreak orders workflow modes before surface/transport modes`, `PASS: 13c-readme-version: README.md carries the SKILL.md version 2.2.7.0`, a line that starts `OK: parent-skill-check` and ends `all hard invariants passed, 0 warnings`, the T007 leaf-manifest line and `leaf=0`. A sibling's failure line is recorded, not fixed. (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs`)",
    f"- [ ] T053 REQ-007: advisor routing is not worse. Run `{FV} node $F/scratch/advisor-battery.cjs > $F/scratch/after-advisor.txt 2>&1; echo \"exit=$?\"; tail -1 $F/scratch/after-advisor.txt; diff $F/scratch/before-advisor.txt $F/scratch/after-advisor.txt; echo \"diff=$?\"`. Expected: `exit=0`, `positives 13/17 negatives-false-positive 2/5` (the T009 line) and `diff=0`. If only confidence values differ and both totals match, record the lines and pass. (`$F/scratch/after-advisor.txt`)",
    f"- [ ] T054 REQ-008: one hub release. Run `grep -l -e '^version: 2.2.7.0' -e '\"version\": \"2.2.7.0\"' {HUB}/SKILL.md {HUB}/ROUTER.md {HUB}/README.md {HUB}/description.json {HUB}/hub-router.json {HUB}/mode-registry.json | wc -l; python3 -I .skilled/skills/sk-doc/scripts/validate_document.py {HUB}/changelog/v2.2.7.0.md | /usr/bin/grep -o 'VALID\\|Total issues: [0-9]*'; python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py {HUB}/changelog/v2.2.7.0.md | /usr/bin/grep 'hard blockers'`. Expected: `6` (with leading spaces from `wc`), `VALID`, `Total issues: 0` and `  hard blockers:          0`. (`{HUB}/changelog/v2.2.7.0.md`)",
    f"- [ ] T055 REQ-009: compiled routing serves the hint. Run `node .skilled/bin/compiled-route-guard.cjs | grep -E 'sk-code |All hubs'; env -u SPECKIT_COMPILED_ROUTING node .skilled/bin/compiled-route.cjs --hub sk-code --prompt \"{WF5}\" --surface-hint WEBFLOW | grep -o '\"workflowMode\":\"[^\"]*\"'; node --test --test-reporter=tap .skilled/bin/tests/compiled-route-front-door.test.cjs 2>&1 | grep -E '^# (pass|fail) '; node .skilled/bin/compiled-route-sync.cjs --verify; echo \"verify=$?\"; cmp {RT}/013-live-activation/activation/sk-code/manifest.json {AU}/013-live-activation/activation/sk-code/manifest.json; echo \"cmp=$?\"`. Expected before the orchestrator's T042 and T043: `  sk-code                     stale-manifest`, no `workflowMode` line because the front door prints `{{\"servingAuthority\":\"legacy\",\"hubId\":\"sk-code\"}}`, `# pass 0`, `# fail 1`, `SYNC FAILED: MOVE-SIMULATION FAILED:`, `verify=1` and `cmp=0`. Record that as `PENDING-ORCHESTRATOR` and do not re-mint. Expected after them: `  sk-code                     fresh`, `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.`, `\"workflowMode\":\"sk-code-webflow\"` then `\"workflowMode\":\"sk-code-opencode\"`, `# pass 1`, `# fail 0`, `move-simulation OK: all 7 hubs resolve; 0 reads under .opencode/specs`, `verify=0` and `cmp=0`. (`.skilled/bin/compiled-route-guard.cjs`)",
    f"- [ ] T056 Hermes copies drift only where expected, check form only. Run `{FV} node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check > $F/scratch/after-hermes.txt 2>&1; echo \"exit=$?\"; grep -E 'DRIFT|PASS|FAIL' $F/scratch/after-hermes.txt`. Expected before the orchestrator's T044: the T011 lines plus a `DRIFT sk-code` line, and `exit=1`. After T044 the same command prints `PASS` and `exit=0`. (`$F/scratch/after-hermes.txt`)",
    f"- [ ] T057 Fill `$F/implementation-summary.md` from the evidence above. Replace every bracketed placeholder, record the before and after numbers of T047 to T056, and list T042 to T045 as orchestrator-owned. Check: `{FV} grep -n -e '\\[Opening' -e '\\[What' -e '\\[path\\]' -e '\\[How was' -e '\\[Validation' -e '\\[Limitation\\]' -e '\\[PASS/FAIL' $F/implementation-summary.md; echo \"exit=$?\"`. Expected: nothing printed before `exit=1`. (`$F/implementation-summary.md`)",
    f"- [ ] T058 Validate this folder. Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh {F} --strict`. Expected: `RESULT: PASSED`. (`{F}`)",
    f"- [ ] T059 Scope check, last. Rerun the T001 command with `status-after.txt` in place of `status-before.txt`, then run `{FV} diff $F/scratch/status-before.txt $F/scratch/status-after.txt; echo \"diff=$?\"`. Expected against an empty baseline: only added lines and `diff=1`. The added lines are ` M` for `.skilled/bin/compiled-route.cjs`, `{RT}/{PAIRS[4]}`, `{RT}/{PAIRS[1]}`, `{RT}/{PAIRS[0]}`, `{RT}/{PAIRS[2]}`, `{RT}/{PAIRS[3]}`, `{HUB}/README.md`, `{HUB}/ROUTER.md`, `{HUB}/SKILL.md`, `{HUB}/description.json`, `{HUB}/hub-router.json`, `{HUB}/mode-registry.json` and the five authored copies under `{AU}/`, plus `?? .skilled/bin/tests/compiled-route-surface-hint.test.cjs` and `?? {HUB}/changelog/v2.2.7.0.md`. After the orchestrator's T042 and T043, the two `manifest.json` paths add ` M` lines too. Any other line stops the build: report it. (`$F/scratch/status-after.txt`)",
]

tail = """<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
"""

out = (head + intro + "<!-- ANCHOR:phase-1 -->\n## Phase 1: Setup\n\n" + "\n".join(p1) + "\n<!-- /ANCHOR:phase-1 -->\n\n---\n\n"
       + "<!-- ANCHOR:phase-2 -->\n## Phase 2: Implementation\n\n" + "\n".join(p2) + "\n<!-- /ANCHOR:phase-2 -->\n\n---\n\n"
       + "<!-- ANCHOR:phase-3 -->\n## Phase 3: Verification\n\n" + "\n".join(p3) + "\n<!-- /ANCHOR:phase-3 -->\n\n---\n\n" + tail)
open(f"{F}/tasks.md", "w").write(out)
print("tasks written", len(p1) + len(p2) + len(p3))
