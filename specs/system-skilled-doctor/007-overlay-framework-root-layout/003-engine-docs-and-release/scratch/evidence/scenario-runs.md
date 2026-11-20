# Overlay playbook scenario runs — six scenarios against the current engine

Engine under test: `.skilled/commands/doctor/scripts/overlay-engine.cjs`, HEAD `5913aebc267`, sha256 `ae3217846079b54c…`, unmodified in the working tree (`git status --porcelain` printed nothing for it). Host: Node v26.13.0, git 2.50.1, `2026-11-20T12:22:33Z`.

Method: every numbered `Run` step was extracted verbatim from the scenario file (so quoting is byte-exact) and run in order, in one shell, from the repository root `node .skilled/commands/doctor/scripts/overlay-engine.cjs` resolves. Each scenario got a fresh `mktemp -d` workspace outside the repository. Steps were evaluated one at a time, so a step that does not parse as bash fails only that step instead of consuming the following lines; `echo $?` steps report the exit code of the step before them.

**Verdict: 3 PASS, 3 FAIL.** SKD-005, SKD-009 and SKD-013 pass as written. SKD-006, SKD-007 and SKD-010 fail as written: their manifest step is not valid bash, so the manifest is never written and every later step runs against an absent manifest (see Mismatch 1). With the two unescaped quotes in that step escaped, all three reproduce every documented signal exactly — the engine side is green, the defect is in the three scenario docs.

## 1. Verdict table (as written)

| Scenario | Steps run | Expected signal | Observed | Match | Final exit |
|---|---|---|---|---|---|
| SKD-005 | 1–13 (13) | step 6 `refuse: .skilled/skills/brand/new.md is a new file in the vendored tree…` | same line, verbatim | yes | — |
| SKD-005 | | step 7 prints `1` | `1` | yes | — |
| SKD-005 | | step 8 `refuse: .skilled/skills/hub/help.md is a vendored file no overlay owns…` | same line, verbatim | yes | — |
| SKD-005 | | step 9 prints `1` | `1` | yes | — |
| SKD-005 | | steps 10, 12 print `allow` | `allow`, `allow` | yes | — |
| SKD-005 | | steps 11, 13 print `0` | `0`, `0` | yes | **0** |
| SKD-006 | 1–15 (15) | step 11 (not a printed signal: the manifest the rest needs) | bash syntax error, exit 2 under `bash -n`; no manifest written | **no** | — |
| SKD-006 | | step 12 `adopted … as skilled-overlays/framework/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)` + `1 changed`, exit 0 | `[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json…`, exit 2 | **no** | — |
| SKD-006 | | step 13 prints `1` | `grep: …/tree/skilled-overlays/overlay-manifest.json: No such file or directory`, exit 2 | **no** | — |
| SKD-006 | | step 14 prints `help v1 edited in place` | `cat: …/tree/skilled-overlays/framework/skills/hub/help.md: No such file or directory`, exit 1 | **no** | — |
| SKD-006 | | step 15 count line + `checked=3 ok=3 miss=0` + `RESULT: PASSED`, exit 0 | `[overlay-engine] no overlay manifest…`, exit 2 | **no** | **2** |
| SKD-007 | 1–22 (22) | step 11 (manifest prerequisite) | bash syntax error, exit 2 under `bash -n`; no manifest written | **no** | — |
| SKD-007 | | step 17 `refuse: staged change to .skilled/skills/hub/help.md is under a vendored root and no overlay owns it` + the `bring each path under an overlay with …` line, exit 1 | `[overlay-engine] no overlay manifest…`, exit 2 | **no** | — |
| SKD-007 | | step 19 `adopted … (file entry adopted-skilled-skills-hub-help-md)` + `1 changed`, exit 0 | `[overlay-engine] no overlay manifest…`, exit 2 | **no** | — |
| SKD-007 | | step 21 prints `allow`, exit 0 | `[overlay-engine] no overlay manifest…`, exit 2 | **no** | — |
| SKD-007 | | step 22 prints `0` | `2` | **no** | **2** |
| SKD-009 | 1–15 (15) | step 7 count line + `LAYOUT   hub-bundle: source custom/bundle belongs at framework/skills/hub/bundle; run … apply --relayout` + `checked=3 ok=3 miss=0` + `RESULT: PASSED`, exit 0 | all present, verbatim (`cannot-apply=0` appended to the count line) | yes | — |
| SKD-009 | | step 9 `backup skilled-overlays/relayout-runs/<stamp>` + `moved custom/bundle -> framework/skills/hub/bundle` + `relinked .skilled/links/hub -> ../../skilled-overlays/framework/skills/hub/bundle` + `1 moved` + `run … apply`, exit 0 | all present, verbatim | yes | — |
| SKD-009 | | step 11 prints `../../skilled-overlays/framework/skills/hub/bundle` | same | yes | — |
| SKD-009 | | step 12 prints `1` | `1` | yes | — |
| SKD-009 | | step 13 prints `0 changed`, exit 0 | `0 changed`, exit 0 | yes | — |
| SKD-009 | | step 14 count lines + `RESULT: PASSED`, no `LAYOUT` line; step 15 prints `0` | as expected, zero `LAYOUT` lines, `0` | yes | **0** |
| SKD-010 | 1–25 (25) | step 16 (manifest prerequisite) | bash syntax error, exit 2 under `bash -n`; no manifest written | **no** | — |
| SKD-010 | | step 17 prints `1 changed`, exit 0 | `[overlay-engine] no overlay manifest…`, exit 2 | **no** | — |
| SKD-010 | | step 22 count line + `checked=2 ok=2 miss=0` + `RESULT: PASSED`, and step 23 prints `0` | `[overlay-engine] no overlay manifest…`, exit 2; step 23 printed `2` | **no** | — |
| SKD-010 | | step 24 `AUDIT    differs .skilled/skills/hub/b.md` + `AUDIT    extra .skilled/skills/hub/stray.md` + `audit=2` + `RESULT: FAILED`, and step 25 prints `1` | `[overlay-engine] no overlay manifest…`, exit 2; step 25 printed `2` | **no** | **2** |
| SKD-013 | 1–19 (19) | step 7 `0 changed`, step 8 `0` | `0 changed`, `0` | yes | — |
| SKD-013 | | step 9 `in-sync=21 … upstream-moved=0` count line, exactly 20 `LAYOUT   s01…`–`s20…` lines, overflow line `LAYOUT   … 1 more; run … apply --relayout`, `checked=22 ok=22 miss=0`, `RESULT: PASSED`, step 10 `0` | all present; 20 `LAYOUT   s…` lines counted, 1 overflow line, `PASSED`; `cannot-apply=0` appended to the count line | yes | — |
| SKD-013 | | step 11 `status --json` exits 0 (step 12 `0`) | exit 0, `0` | yes | — |
| SKD-013 | | step 13 prints `21` (`"field": "source"` matches in `offLayout`) | `21` | yes | — |
| SKD-013 | | step 14 `backup ../overlays/relayout-runs/<stamp>` + 21 `moved skilled/skills/s<nn>/SKILL.md -> framework/skills/s<nn>/SKILL.md` lines + `21 moved` + `run … apply`, step 15 `0` | all present, 21 `moved` lines, `backup ../overlays/relayout-runs/…` | yes | — |
| SKD-013 | | step 16 `0 changed`, step 17 `0` | `0 changed`, `0` | yes | — |
| SKD-013 | | step 18 count line + `checked=22 ok=22 miss=0` + `RESULT: PASSED`, no line starting `LAYOUT`, step 19 `0` | as expected, 0 `LAYOUT` lines, `PASSED`, `0` | yes | **0** |

Notes on the allowed extras: the count line in SKD-009, SKD-010 and SKD-013 carries a trailing ` cannot-apply=0` the scenario text does not name. It is an extra trailing counter after `upstream-moved=0`, not a differing value.

## 2. Mismatch 1 — the manifest step in SKD-006, SKD-007 and SKD-010 is not valid bash

| Where | Fragment as written |
|---|---|
| `overlays/adopt-an-unowned-file.md:50` (and again in the table row at `:58`) | `,\"scope\":\"directory\","source":"framework/skills/own\",` |
| `overlays/pre-commit-refuses-unowned-change.md:50` (and `:65`) | `,\"scope\":\"directory\","source":"framework/skills/own\",` |
| `overlays/status-audit-lists-unowned-drift.md:55` (and `:68`) | `,\"scope\":\"file\","source":"framework/skills/hub/owned.md\",` |

The rest of that JSON is escaped `\"` inside a double-quoted shell string; these two quotes are not. The `"` before `source` closes the shell string, so the line has an odd number of unescaped quotes and bash cannot parse it.

Expected vs observed:

```
expected: a runnable command that writes the escaped JSON to overlay-manifest.json, step exit 0
observed: /tmp/steps/006/11.cmd: line 1: unexpected EOF while looking for matching `"'
          /tmp/steps/006/11.cmd: line 2: syntax error: unexpected end of file
          exit 2   (bash -n on the verbatim step text, `/tmp/steps/006/11.cmd`)
observed: [exit=1] in session (eval reports 1, `bash -n` reports 2; same parse failure)
```

Consequence, SKD-006 as written:

```
=== STEP 12 ===
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: with no .skilled-overlays.json at the tree root the engine looks in skilled-overlays/; if the overlays live elsewhere, add .skilled-overlays.json at the tree root naming that folder
[exit=2]
=== STEP 13 ===
grep: /var/folders/…/tree/skilled-overlays/overlay-manifest.json: No such file or directory
[exit=2]
=== STEP 14 ===
cat: /var/folders/…/tree/skilled-overlays/framework/skills/hub/help.md: No such file or directory
[exit=1]
=== STEP 15 ===
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: …
[exit=2]
```

Consequence, SKD-007 as written:

```
=== STEP 17 ===
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: …
[exit=2]     (step 18 then printed `2`, the scenario expects `1`)
=== STEP 19 ===
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: …
[exit=2]
=== STEP 21 ===
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: …
[exit=2]     (step 22 then printed `2`, the scenario expects `0`)
```

Consequence, SKD-010 as written:

```
=== STEP 17 ===
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: …   [exit=2]
=== STEP 22 ===
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: …   [exit=2]   (step 23 printed `2`, expects `0`)
=== STEP 24 ===
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: …   [exit=2]   (step 25 printed `2`, expects `1`)
```

The fix is the one the three docs already use everywhere else: escape those two quotes, `,\"source\":\"framework/skills/own\",` and `,\"source\":\"framework/skills/hub/owned.md\",`. No engine change is implied.

## 3. Diagnostic reruns — the engine side of the three failures

Run for diagnosis only, with the two quotes escaped and nothing else changed (`/tmp/steps/006d`, `/tmp/steps/007d`, `/tmp/steps/010d`); every other step byte-identical to the doc. All three then reproduce every documented signal.

SKD-006 (diagnostic):

```
adopted .skilled/skills/hub/help.md as skilled-overlays/framework/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)
1 changed
help v1 edited in place
in-sync=2 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
checked=3 ok=3 miss=0
RESULT: PASSED
```

SKD-007 (diagnostic):

```
refuse: staged change to .skilled/skills/hub/help.md is under a vendored root and no overlay owns it
  bring each path under an overlay with node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt <path>, add a generator's output to the manifest's generated list, or unstage it
[exit=1] (step 18 printed `1`)
adopted .skilled/skills/hub/help.md as skilled-overlays/framework/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)
1 changed
allow
0
```

SKD-010 (diagnostic):

```
1 changed
in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
checked=2 ok=2 miss=0
RESULT: PASSED
0
in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
AUDIT    differs .skilled/skills/hub/b.md
AUDIT    extra .skilled/skills/hub/stray.md
audit=2
checked=2 ok=2 miss=0
RESULT: FAILED
1
```

## 4. Verbatim key lines from the as-written runs

SKD-005 (`overlays/strict-guard-refuses-unowned-write.md`, 13 steps, exit 0):

```
refuse: .skilled/skills/brand/new.md is a new file in the vendored tree, which a re-pin would not carry; create it as skilled-overlays/framework/skills/brand/new.md, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/brand
1
refuse: .skilled/skills/hub/help.md is a vendored file no overlay owns, so a re-pin would overwrite this edit; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/hub/help.md, then edit skilled-overlays/framework/skills/hub/help.md
1
allow
0
allow
0
```

SKD-009 (`overlays/relayout-moves-sources.md`, 15 steps, exit 0):

```
in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
LAYOUT   hub-bundle: source custom/bundle belongs at framework/skills/hub/bundle; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout
checked=3 ok=3 miss=0
RESULT: PASSED
backup skilled-overlays/relayout-runs/2026-11-20T12-22-01.527Z
moved custom/bundle -> framework/skills/hub/bundle
relinked .skilled/links/hub -> ../../skilled-overlays/framework/skills/hub/bundle
1 moved
run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply
../../skilled-overlays/framework/skills/hub/bundle
1
0 changed
in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
checked=3 ok=3 miss=0
RESULT: PASSED
0
```

SKD-013 (`overlays/sibling-folder-relayout.md`, 19 steps, exit 0). 20 `LAYOUT` s-lines, then the overflow line:

```
in-sync=21 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
LAYOUT   s01: source skilled/skills/s01/SKILL.md belongs at framework/skills/s01/SKILL.md; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout
… (s02 through s19 identical in shape) …
LAYOUT   s20: source skilled/skills/s20/SKILL.md belongs at framework/skills/s20/SKILL.md; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout
LAYOUT   … 1 more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout
checked=22 ok=22 miss=0
RESULT: PASSED
21
backup ../overlays/relayout-runs/2026-11-20T12-22-08.117Z
moved skilled/skills/s01/SKILL.md -> framework/skills/s01/SKILL.md
… (s02 through s20 identical in shape) …
moved skilled/skills/s21/SKILL.md -> framework/skills/s21/SKILL.md
21 moved
run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply
0 changed
in-sync=21 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
checked=22 ok=22 miss=0
RESULT: PASSED
0
```

Counts measured on the SKD-013 log: `grep -c '^LAYOUT   s[0-9]'` inside step 9 = `20`; `… 1 more` lines = `1`; `grep -c '^LAYOUT'` inside step 18 = `0`.

SKD-005, SKD-009 and SKD-013 were each run twice (two independent workspaces, two independent pins for the git-backed runs) with identical results.

## 5. Cleanup

Sixteen `mktemp -d` workspaces were created across the as-written runs, the repeat runs and the three diagnostic reruns; all sixteen were deleted. `ls -d <path>` exits `1` for every one of them:

```
ls-d-status path
1 tmp.JMX6xmn9RA
1 tmp.dkUdrvJ33F
1 tmp.w5DXLIGHQ1
1 tmp.pQ5AoLvfbx
1 tmp.VH6HJeVl44
1 tmp.w7EQqAUpOL
1 tmp.4cw2A1NZHc
1 tmp.Nj3USiTAJq
1 tmp.OQrTzPLKCu
1 tmp.AvvBolM0hh
1 tmp.uSvXBSzWnJ
1 tmp.Qhvf1ezg87
1 tmp.sbrHMkytSp
1 tmp.p7xRHIKNrz
1 tmp.7zq8UbqaIB
1 tmp.kEcClnTrZW
```

The paths were under `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/`. No repository file was modified by any run: each run wrote only under its own temp workspace, and the engine file is unmodified in the working tree.
## Rerun after the quoting fix

The manifest step in these three scenarios has since been re-escaped, so this rerun takes each file as it now reads and changes nothing in it. Method is the header's: every numbered `Run` step was extracted verbatim from the file, checked with `bash -n`, and run in order in one shell from the repository root, each scenario in a fresh `mktemp -d` workspace outside the repository. Engine under test is the same build as section 1: `.skilled/commands/doctor/scripts/overlay-engine.cjs` sha256 `ae3217846079b54c…`, HEAD `5913aebc267`, absent from `git status --porcelain`. Host: Node v26.13.0, git 2.50.1, `2026-11-20T12:24:27Z`. The `echo $?` steps report the exit of the step before them.

`bash -n` on every extracted step exits `0`: 15 of 15 steps in SKD-006, 22 of 22 in SKD-007, 25 of 25 in SKD-010. The manifest step parses now, where Mismatch 1 recorded `bash -n` exit `2`.

**Verdict: 3 PASS, 0 FAIL.** SKD-006, SKD-007 and SKD-010 each reproduce every signal their "Expected signals" line names, with the same trailing ` cannot-apply=0` extra on the count line that SKD-009, SKD-010 and SKD-013 carry and the scenario text does not name. The cause of the earlier three failures was the scenario docs and not the engine: the engine is the same unmodified build that passed in the diagnostic reruns of section 3, and the docs now produce those same lines as written.

| Scenario | Steps run | Expected signal | Observed | Match | Final exit |
|---|---|---|---|---|---|
| SKD-006 | 1–15 (15) | step 12 `adopted .skilled/skills/hub/help.md as skilled-overlays/framework/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)` + `1 changed`, exit 0 | same two lines, verbatim, exit 0 | yes | — |
| SKD-006 | | step 13 prints `1` | `1` | yes | — |
| SKD-006 | | step 14 prints `help v1 edited in place` | `help v1 edited in place` | yes | — |
| SKD-006 | | step 15 count line, then `checked=3 ok=3 miss=0`, then `RESULT: PASSED`, exit 0, no `LAYOUT` line | `in-sync=2 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0`, then `checked=3 ok=3 miss=0`, then `RESULT: PASSED`, exit 0, zero `LAYOUT` lines | yes | **0** |
| SKD-007 | 1–22 (22) | step 17 `refuse: staged change to .skilled/skills/hub/help.md is under a vendored root and no overlay owns it`, then the `  bring each path under an overlay with node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt <path>, add a generator's output to the manifest's generated list, or unstage it` line, exit 1 | both lines verbatim, exit 1 | yes | — |
| SKD-007 | | step 18 prints `1` | `1` | yes | — |
| SKD-007 | | step 19 prints the adopt line + `1 changed`, exit 0 | both lines verbatim, exit 0 | yes | — |
| SKD-007 | | step 21 prints `allow`, exit 0 | `allow`, exit 0 | yes | — |
| SKD-007 | | step 22 prints `0` | `0` | yes | **0** |
| SKD-010 | 1–25 (25) | step 17 prints `1 changed`, exit 0 | `1 changed`, exit 0 | yes | — |
| SKD-010 | | step 22 count line, `checked=2 ok=2 miss=0`, `RESULT: PASSED`, exit 0, no `AUDIT` and no `audit=` line | `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0`, `checked=2 ok=2 miss=0`, `RESULT: PASSED`, exit 0, zero `AUDIT` and zero `audit=` lines | yes | — |
| SKD-010 | | step 23 prints `0` | `0` | yes | — |
| SKD-010 | | step 24 count line, `AUDIT    differs .skilled/skills/hub/b.md`, `AUDIT    extra .skilled/skills/hub/stray.md`, `audit=2`, `checked=2 ok=2 miss=0`, `RESULT: FAILED`, exit 1 | all six lines, verbatim in that order, exit 1, and no `AUDIT` line for `owned.md` or for `gen/out.json` | yes | — |
| SKD-010 | | step 25 prints `1` | `1` | yes | **1** |

SKD-006 (`overlays/adopt-an-unowned-file.md`, 15 steps, exit 0). Key lines verbatim:

```
adopted .skilled/skills/hub/help.md as skilled-overlays/framework/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)
1 changed
1
help v1 edited in place
in-sync=2 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
checked=3 ok=3 miss=0
RESULT: PASSED
```

`grep -c '^LAYOUT'` over that run's step-15 output is `0`.

SKD-007 (`overlays/pre-commit-refuses-unowned-change.md`, 22 steps, exit 0). Key lines verbatim:

```
refuse: staged change to .skilled/skills/hub/help.md is under a vendored root and no overlay owns it
  bring each path under an overlay with node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt <path>, add a generator's output to the manifest's generated list, or unstage it
1
adopted .skilled/skills/hub/help.md as skilled-overlays/framework/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)
1 changed
allow
0
```

Step 17 exited `1` and step 21 exited `0`; steps 18 and 22 printed those statuses.

SKD-010 (`overlays/status-audit-lists-unowned-drift.md`, 25 steps, step 24 exit 1). Key lines verbatim:

```
1 changed
in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
checked=2 ok=2 miss=0
RESULT: PASSED
0
in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
AUDIT    differs .skilled/skills/hub/b.md
AUDIT    extra .skilled/skills/hub/stray.md
audit=2
checked=2 ok=2 miss=0
RESULT: FAILED
1
```

Plain status (step 22) carried no `AUDIT` and no `audit=` line, and the audit named neither `.skilled/skills/hub/owned.md` nor `.skilled/gen/out.json`.

Cleanup: three workspaces were created, `tmp.XuWwOGwBcF` (SKD-006), `tmp.dev1oLCcCJ` (SKD-007) and `tmp.HgQZk0g9Bo` (SKD-010), plus the throwaway runner directory `tmp.37OTN2Sb8c`; all four were deleted, and `ls -d <path>` exits `1` for every one of them. No repository file was written by any run, and the engine file is still unmodified.
