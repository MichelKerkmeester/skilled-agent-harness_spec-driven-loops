---
title: "Goal: Phase 43: label-finding-fixes"
description: "Fix the tool defects phase 042's labels found: the 027 stop-rater gold and lineage filter, the 003 goal-core evidence clamp, and the 006 lint's missing model arm."
trigger_phrases:
  - "label finding fixes"
  - "stop rater gold fix"
  - "goal verifier clamp fix"
  - "goal lint model arm"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/043-label-finding-fixes"
    last_updated_at: "2026-10-01T18:41:50Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-043-label-finding-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 43: label-finding-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the tool defects phase 042's labels found: the 027 stop-rater gold and lineage filter, the 003 goal-core evidence clamp, and the 006 lint's missing model arm.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Scope is the operator's picks of 2026-10-01: both 027 fixes, the clamp fix in goal-core only, and 006's model arm. The OpenCode plugin's copy of the clamp and 035's lexical screen stay unchanged |
| D2 | Luna 6 max on cli-codex or SWE 2 max on cli-devin writes the code. The session verifies, documents and commits. One DeepSeek V4.1 Flash review on cli-pi covers all three fixes: fix P0 and P1, record P2 |
| D3 | 006's arm follows 006 `spec.md` REQ-012 and REQ-013: Jev first, then Deem, each behind its own switch, kept per rule only on an F1 gain of at least 0.2 over the lint, precision of at least 0.8 and, for Jev, flips of at most 0.10 |
| D4 | A live 006 run needs the operator's separate yes. Path-scoped commits, main only on the operator's go, no key in a file, no `.env` opened |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npx vitest run tests/unit/score-stop-rater.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime`, passes more than 36 tests, with cases for `sources` and `evidence` arrays, two line ranges of one file and `antiConvergence.convergenceMode: "off"`
- [x] `node --test .skilled/hooks/goal/lib/goal-core.test.cjs` passes at least 78 tests with 0 failing, and every other `*.test.cjs` and `*.test.mjs` file under `.skilled/hooks/goal/` passes with 0 failing
- [x] `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` passes with stub-`jev` cases for each `jev arm skipped:` line, a keep verdict and a flips kill verdict, and a stub `jev` first on `PATH` logs no call on a run without `--jev`
- [x] The DeepSeek V4.1 Flash review of the 027, 003 and 006 changes leaves no open P0 or P1
- [x] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this phase and on `specs/cli-jev/003-cli-jev-workflow-integration`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| 027 stop-rater fixes | Done | `55c33b363e`, Luna 6 max. Suite 41 pass (36 before), 0 failing. Census: `forced 242 no gold 72 sampled 25` (before 235, 106, 16). The two read lineages still sampled agree with their reads, and three new sampled lineages have no read |
| 003 clamp fix | Done | `5543f6861e`. goal-core 78 passing (74 before), goal-slice 24, labeled-set 12, fixture builder 5, nudge counter 3, goal-pi 22, 0 failing |
| 006 Jev arm | Done | `a5b3c462f3`, Luna 6 max. score-goal-lint 14 pass (8 before), lint-goal-criteria 12, check-goal 16, template-parity 4, 0 failing. The default run is byte-identical to HEAD (`cmp`), `--jev` without `--out` exits 2, and with no `jev` on `PATH` it prints `jev arm skipped: jev not on PATH` and exits 0 | Brief `build/fix/006a.md`, after 027. Suite baselines: score-goal-lint 8, lint-goal-criteria 12, check-goal 16, template-parity 4 |
| 006 Deem arm | Done | Luna 6 max (brief `006b.md`), then SWE 2 max added a coverage stop for both backends (brief `006c.md`): a rule with 10*M < 9*K prints `stop (coverage) M=<m> K=<k>` and no keep or kill. score-goal-lint 21 pass (8 before the arm), lint-goal-criteria 12, check-goal 16, template-parity 4, 0 failing. Default run byte-identical to HEAD |
| Cross-family review | Pending | One DeepSeek V4.1 Flash run over all three changes |

### Deviations and findings

| Item | Note |
|------|------|
| Operator choices (2026-10-01) | 027 "Both fixes", 006 "Build 006's model arm", 003 "Fix it in goal-core", 041 "Mark done, record the deviation" (041 closed in `da15a6b0e7`, outside this phase). The 027 `isMovable` change departs from 027 REQ-002, which names the `antiConvergence` fallback only for `stopPolicy` |
| Clamp on the real set (2026-10-01) | goal-core's parity arm answers `met` on 0 of the 50 labeled rows, so the fix adds no false met against the 47 `not_met` labels. `clamp_defects` still prints 11 because it measures the OpenCode plugin's copy (`.opencode/plugins/opencode-goal.js:2215`), out of scope by D1 |
| Unplanned local Deem run (2026-10-01) | Checking the skip path, the session ran `score-goal-lint.cjs --deem --out <scratchpad>` with `PATH=/usr/bin:/bin`, expecting `deem arm skipped: not reachable`. The scorer falls back to the repository's `cli-deem.mjs` when `cli-deem` is not on `PATH` (the same rule as 032's scanner), found the local server healthy (`backend=torch model=deem-0.8-v1`) and ran the arm. Nothing left the machine and no Jev call was made, but D4 asks for the operator's yes before a live 006 run, so this is recorded as a deviation. The output stayed in the session scratchpad |
| Deem server answers noul with no number (2026-10-01) | All 196 calls of that run exited 1 with `{"ok":false,"error":"unexpected response: noul value is not a number"}`, and a direct `cli-deem.mjs noul -q ...` gives the same. The call shape matches 032's Deem arm, so the fault is in the local server's response, outside this phase's three fixes. Recorded, not chased |
| Verdict on unmeasured rows (2026-10-01) | That run printed `verdict deem rule4: kill` and `rule5: kill` on 0 measured rows. SWE 2 max added a coverage stop before the keep rule for both backends (brief `build/fix/006c.md`), with stub cases where every call fails on Jev and on Deem |
| 006 docs (2026-10-01) | `eb4eb71881`. SWE 2 max updated the sk-create-goal README, its scripts README, the catalog entry and changelog v1.4.0.0, bumped `SKILL.md` to 1.4.0.0, synced the Hermes copy and re-minted sk-doc's stale activation manifest. The session then fixed three lines it missed: the coverage stop in the changelog, README and catalog, and the README's suite count, 40 to 53 |
| Cross-family review (2026-10-01) | DeepSeek V4.1 Flash on cli-pi (Cline), 1,731 s, read-only, `VERDICT: FAIL` on 2 P0, 4 P1 and 6 P2. The session reproduced every P0 and P1 before fixing. P0, 027 `findingSources`: `file:.devin/SYNC.md:20` returns no source, and free text such as `iteration 4 F10; iteration 1` counts as one. P1, 006: a run with K=0 still prints kill, Jev exits 4 and 130 do not follow 002 REQ-010, and no requalify line follows a changed model identity. P1, 003: Pi's `extractTurnEndText` puts tool output after the message, so the tail window can hold only tool output. Fixes went out as briefs `r027.md` (Luna), `r006.md` (SWE) and `r003.md` (DeepSeek). The review found no model call reachable without a switch, no credential read or printed, and no change to the no-switch output |
| Recorded P2 (2026-10-01) | Not chased (parent D5). 027: the old line-reference strip missed `AGENTS.md:59-86, 175-196` (the `r027.md` rule now covers it). 027 `spec.md` REQ-002 still names only the `source` field, while the code counts `sources` and `evidence` too. 003: the verifier's doc comment overstated that mixed evidence always stays open (`r003.md` adds the tail caveat). 006: `flipRate` divides by every planned question, so unmeasured ones dilute the flips gate. A stopped Jev arm keeps no partial-row count where the Deem stop does. Pre-existing in `score-verifier-labeled-set.cjs:366`: with 0 labeled met rows the rate reads 0, so `stop: no headroom` fires on an undefined rate |
| Review fixes (2026-10-01) | 003: `5a7db2f019`, Pi's adapter returns tool output before the message. 006: `0cd052bf47`, SWE 2 max, score-goal-lint 25 pass, default output byte-identical. 027: Luna 6 max on the second try, `findingSources` now keeps only file tokens. The reviewer's four inputs give `.devin/SYNC.md`, nothing, `AGENTS.md` and `a/b.md`. Vitest 50 pass, census `no gold 73` (72 before), `sampled 25`. Luna reported BLOCKED only on the workspace-wide drift guard, whose 56 errors name neither file. New P2: a URL such as `https://example.com/x` still counts as a source |
| Second review (2026-10-01) | DeepSeek V4.1 Flash, 1,524 s, read-only, over `5a7db2f019`, `0cd052bf47` and `9bb1781175`: `VERDICT: FAIL` on 1 P0, 1 P1 and 5 P2. Suites, default output, no unswitched call and no credential all confirmed. The session reproduced both before fixing. P0: goal-core's blocking pattern lacks the bare word `fail`, so `1 P0 fail ... Marking the 5 passing items ... done` answers `met`. Pi's reorder exposed it, so the fix goes in goal-core (brief `r2-003.md`, SWE). P1, 027: a path with a space, such as `REPO RULES.md`, and a dotfile such as `.gitignore` are dropped, and a path with a space is cut to a directory. Fix: a tracked-path set and an extension that needs a letter (brief `r2-027.md`, Luna). Recorded P2: `p=0.05` counts as a source (closed by the letter rule). A stored column that was only skipped fires `requalify` against undefined fields. No test covers Jev exit 2 or the jev identity requalify. `build-verifier-fixture.cjs:139` still joins the message first, so 1 of 46 matched rows flips `not-met` to `unclear` and none becomes `met`. `JEV_TIMEOUT_MS` is 120 s against 002's 90 s cap, which predates this phase |
| Second-round fixes (2026-10-01) | 003: `2825bd105b`, SWE 2 max. The review's turn now answers `not-met`, `fail 0`, `fail: 0` and `0 fail` still pass, goal-core 81 and the eight other goal suites 0 failing, parity arm `met` on 0 labeled rows. 027: Luna 6 max, vitest 59. Its tracked-path list overflowed `spawnSync`'s 1 MB buffer on the real tree (`ENOBUFS`, census exit 2, 16 MB list), which its temporary-repo tests could not show, so the session added `maxBuffer`. The session also removed the `://` rule its own brief had asked for: web-research lineages cite URLs as their sources, and the rule dropped the read lineage `013-mcp-obsidian/.../codex` from the sample. That withdraws the URL P2 logged above. The census then matches `9bb1781175` line for line, `no gold 73`, `sampled 25`, the same five reads |
| Third review (2026-10-01) | DeepSeek V4.1 Flash, 1,117 s, read-only, over `2825bd105b` and `1093a8520c`: `VERDICT: FAIL` on 1 P1 and 5 P2. It confirmed the second review's P0 and P1 closed, the census byte-identical to `9bb1781175` and no unswitched call. P1: the plural `failures` still missed the pattern, so `2 failures ... done` answered `met`. The session reproduced it and made the one-word fix itself, `failures` under the same zero-count guard as `fail`: goal-core 82, all nine goal suites 0 failing, the parity arm `met` on 0 labeled rows. No fourth review ran. Recorded P2: a zero before a real count unblocks it (`iteration 0 fail 2`), as does `fail 0.5`. The `:<digit>` cut drops a URL's path after a port (`https://localhost:5173/x/p.ts` gives `https://localhost`), and the only port URL on the tree ends at its port. A tracked path holding `,;()[]` is cut before the tracked check, and none of the 1,073 tracked paths with a space holds one. The letter rule moves the unsampled lineage `004-deep-research-expansion/research/lineages/swe` from gold 5 to 4, because `swe-01..04` is a label, not a file. The OpenCode plugin's verifier copy still answers `met` on the P0 input, out of scope as the operator chose |
<!-- /ANCHOR:log -->
