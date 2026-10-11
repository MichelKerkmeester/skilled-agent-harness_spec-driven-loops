---
title: "Review Report: post-merge deep review of the sk-code Ponytail epic"
description: "Ten DeepSeek V4.1 Flash review iterations over ba56b03412..5d9c970447 on main, with every kept finding confirmed by an orchestrator rerun or read."
---

# Review Report: post-merge deep review of the sk-code Ponytail epic

## 1. Executive Summary

- **Verdict:** PASS, hasAdvisories true. Active findings: P0 0, P1 0, P2 18 in the reducer registry. After orchestrator adjudication, 12 are CONFIRMED and attributable to the epic, 6 are CONFIRMED but pre-existing or accepted as no-action.
- **Scope:** the 40 commits `ba56b03412..5d9c970447` on main: 37 epic commits from merge base `2a1554bc4a`, the merge `144b1d339e`, then `9a74576ccc` and `5d9c970447`. 275 files in `review/scope-files.txt`.
- **Executor:** cli-pi `llmgateway/deepseek-v4.1-flash` at `--thinking max` for all ten iterations. The DevPass route never hit its limit, so no switch to `cline-pass/deepseek-v4.1-flash` happened.
- **Epic intact on main:** CONFIRMED. Every guard the epic's parent goal names exits 0 on main: `check-rule-copies.js` 0, `check-rule-copies.test.sh` 0, `run-all-drift-guards.sh` "all 4 guards PASSED", `check-agent-mirror-sync.cjs --all` "all mirrors in sync", `sync-runtime-mirrors.cjs --check` "187 mirrors ... in sync", `compiled-route-guard.cjs` all seven hubs fresh, `sync-skills-hermes.cjs --check` "70 Hermes skill copies in sync", hook stdin suite 39 pass 0 fail, surface-hint suite 6 pass 0 fail, leaf manifest suites 4 files pass.

## 2. Merge Resolution (144b1d339e)

Checked by `git diff 144b1d339e^1 144b1d339e` and `git diff 144b1d339e^2 144b1d339e` per file, and independently by iteration 1. All CONFIRMED intact.

| File | Result | Evidence |
|------|--------|----------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Both sides kept | Against the epic side the merge adds upstream's `isSymbolicLink`, `assertStartInsideSkill`, dot-directory skip, `writeFileAtomic` and the symlink refusal in `runWrite`; against upstream it adds the epic's `dropGitIgnoredLeaves` (line 112) called from `walkLeafFiles` (line 197). Leaf manifest tests 4 of 4 pass |
| `.skilled/skills/system-spec-kit/SKILL.md` | Upstream content, version 2.7.2.0 | Only diff against `^2` is `version: 2.7.1.0` to `2.7.2.0` |
| `changelog/v2.7.1.0.md` | Upstream kept | `git diff --quiet 144b1d339e^2 5d9c970447 -- .../v2.7.1.0.md` exits 0 |
| `changelog/v2.7.2.0.md` | Both hook-deadline rounds folded in | Line 18 says the first round lost the 2.7.1.0 number; spec folders 010/007 and 011/007 cited |
| Trigger index, 3 retrieval fixtures | Fresh | `generate-trigger-index.mjs --check` lists only this packet's new docs as stale |
| `.hermes/skills/system-spec-kit/SKILL.md` | Regenerated | Hermes check PASS |
| `AGENTS.md` (auto-merged, not a conflict) | Both sides kept | Upstream's `AI_SESSION_CHILD=1`-only exemption and the epic's close-out pointer both present |

## 3. Planning Trigger

`/speckit:plan` is not required: no P0 or P1. The P2 items below are small doc and checker edits.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": {"P0": 0, "P1": 0, "P2": 18},
  "remediationWorkstreams": ["hook-stdin-coverage-gap", "stale-docs-and-claims", "checker-observability", "pre-existing-test-pins"],
  "specSeed": "Close the confirmed P2 items from the post-merge review of the sk-code Ponytail epic",
  "planSeed": "One child per workstream; each fix is a single file edit with its rerun command",
  "findingClasses": ["coverage-gap", "stale-doc", "observability", "test-pin"],
  "affectedSurfacesSeed": [".skilled/skills/sk-git/scripts/hooks/", ".skilled/skills/sk-vision/hooks/devin/", ".skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/", ".skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs", ".skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh", ".skilled/bin/tests/compiled-route-admission.test.cjs"],
  "fixCompletenessRequired": false
}
```

## 4. Active Finding Registry

Ranked. Every row was rerun or read by the orchestrator. Each recommendation names the cheapest move that fixes a failure that exists today, per `.skilled/repo-rules/prevent-overengineering.md`.

### Epic errors and open ends (CONFIRMED)

1. **R2-COR-001, P2. Three registered hooks still read stdin with no deadline.** CONFIRMED. `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:364-366` and `git-preflight-advisory.mjs:57` and `.skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:46` use `for await (const chunk of process.stdin)`. `.claude/settings.json:64` registers the message gate directly. Commit `c33f9d1984` says "give every hook stdin reader a deadline", but its search missed readers reached through symlinks under `.skilled/hooks`. Rerun: `rg --no-config -l -F "of process.stdin)" .skilled -g '!**/node_modules/**' -g '!**/*test*' -g '!**/dist/**'`. Fix: replace each loop with the existing shared reader `readStdin` from `.skilled/hooks/shared/hook-adapter-shared.cjs`, the move that extends existing code in place.
2. **R9-MNT-001, P2. Playbook scenarios test a hook no runtime registers.** CONFIRMED. `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:11` (and `check-dist-staleness-hook.md:11`) call `sk-code-quality/scripts/hooks/claude-posttooluse.sh` the live PostToolUse hook. `sk-code-quality/SKILL.md:97`, rewritten by `f3377faef9`, says that script is registered in no runtime, and `.claude/settings.json:206` runs `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`. Fix: point both scenarios at the `.cjs` adapter.
3. **R5-SEC-003, P2. The Webflow runtime check drops errors past callback depth 20.** CONFIRMED. `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:42` returns silently at `MAX_SYNC_CALLBACK_DEPTH`, which `82d297a374` added. A throw past the cap never reaches `callback_errors`, so the file can print PASS. Fix: push one `callback_errors` entry naming the cap when it is hit.
4. **R8-TRA-001, P2, narrowed. The parent goal's criterion 3 cannot pass after the merge.** CONFIRMED for criterion 3 only: `git rev-list --count main..HEAD` prints 0 on main, not 37. The executor's other two failures came from this packet's in-flight edits (durable slice 4054 characters, stale `graph-metadata.json`) and were fixed here: the slice is now 3997. Fix: the operator amends criterion 3 to a post-merge check, for example `git merge-base --is-ancestor 5cf062b021 main`.
5. **R7-MNT-001, P2. The drift-guard umbrella prints PASS over 272 warnings.** CONFIRMED. `run-all-drift-guards.sh:48` runs the alignment leg without `--fail-on-warn`; `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh | grep -c '\[WARN\]'` prints 272 while the last line reads "all 4 guards PASSED". Fix: print the warning count in the summary line. Turning on `--fail-on-warn` would turn the gate red on 272 existing warnings, so it fails the restraint test.
6. **R10-TRA-001, P2. The recorded `markers=0` no longer reproduces.** CONFIRMED. `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` prints `markers=3 no-trigger=1 no-signal=1`, all from the committed fixture `008-round-two-recommendations/004-debt-report-and-hermes-gate/scratch/after/probe.py:1-3`, against the summary's line 115. Fix: correct the recorded value in that summary.
7. **R8-TRA-002, P2. A summary undercounts its tests.** CONFIRMED. `011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md:61` says "10 in total"; `grep -c '^test(' .../verify_doc_claims.test.cjs` prints 12. Fix: correct the count.
8. **R10-TRA-002, P2. The mirror checker's banner names only Claude.** CONFIRMED. `check-agent-mirror-sync.cjs:6-7` say agents mirror to `.claude/agents/`; `40fc64d9cd` added the Codex leg below it. Fix: one comment line.
9. **R9-MNT-002, P2. `stack-detection.md:145` cites a file that does not exist.** CONFIRMED. `test -e .skilled/skills/sk-doc/scripts/preview-server.js` fails. The path predates the epic (`330427cf30`), but `ceb8ff216c` claimed to ground these docs in the tree. Fix: name a real file or drop the path.
10. **R9-MNT-003, P2. Two Webflow evidence pointers do not resolve.** CONFIRMED. `scroll-interceptor-and-related.md:375-376` cite spec paths that exist nowhere; `16641fcf05` edited this list. Fix: remove the two bullets.
11. **R4-COR-001, P2. The reducer keeps an asymmetry the epic left in place.** CONFIRMED by read of `reduce-state.cjs:1001-1006` at `5d9c970447`: a numbered narrative finding yields to any structured run, while an F### finding yields only to a matching id. The code comment at lines 971-975 records this as deliberate. Recommendation: build nothing until a review folder shows a lost numbered finding.
12. **R6-COR-002, P2. The rule canary pins four of eight P0 labels.** CONFIRMED: `check-rule-copies.js:83-88` pins four, section 3 of `code-quality-standards.md` lists eight. The four match the examples in the sentence the canary protects. Recommendation: build nothing; no removal has happened.

### Known items, rerun by the orchestrator

| Known item | Status | Evidence |
|------------|--------|----------|
| Canary `jev-transport-single` defers | CONFIRMED, pre-existing (R6-COR-001) | `all-canaries.cjs` prints `FAIL 004-cli-external-orchestration jev-transport-single defer`, `all hubs failures 1`. Fixture last changed `01829ed9e4` (2026-09-20), before the epic; cli-jev now lives in the cli-classifier hub. Fix: update the fixture case to the hub's current answer |
| Admission test pins 80 against 86 | CONFIRMED, pre-existing (R3-COR-001) | `86 !== 80` at `compiled-route-admission.test.cjs:241`. The same loader counts 86 at merge base `2a1554bc4a` and at upstream `ba56b03412`, so the epic did not cause it. Fix: change the constant at line 32 to 86 |
| Manifest test 26 pass 16 fail | CONFIRMED, pre-existing | `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` prints `# pass 26 # fail 16`: "authored closure failed to resolve hubs: cli-classifier" and `7 !== 6` at line 1127. Iteration 7 "refuted" this by running the leaf-manifest suites, which are the wrong files. The test and `compiled-route-sync.cjs` are untouched in the range |
| Advisor battery 13/17, 2/5 | CONFIRMED | `advisor-battery.cjs` prints `positives 13/17 negatives-false-positive 2/5`; below SA-001's own pass bar, held to "no worse" by the epic |
| 36 HVR hard blockers in sk-code `SKILL.md` | CONFIRMED, not epic-caused | `hvr_scan.py` prints 36 (27 semicolons, 9 em dashes); the merge base copy prints 37 |
| 500 ms stdin deadline on 3 s hosts | CONFIRMED as designed | `SHORT_HOST_STDIN_TIMEOUT_MS = 500` at `shared-stdin.ts:23` and `hook-adapter-shared.mjs:17`; no test writes after the deadline (R2-COR-002), and a probe showed the late write is ignored. Recommendation: build nothing |
| Reducer open findings 1906 to 1207 in 146 folders | NOT RERUN | The 006 summary attributes the drop to F### findings that a same-id structured row also carries; one folder keeps 3 duplicates. The orchestrator did not recount the 146 folders |
| `advisor_recommend` never passes `--surface-hint` | CONFIRMED (R3-COR-002) | `system-skill-advisor/runtime/handlers/advisor-recommend.ts:372-377` spawns `[frontDoor, --hub, skillId, --prompt-stdin]`. It matches 008's Known Limitation 1. Recommendation: build nothing until a consumer selects a surface from the advisor's compiled route; the hooks pass `includeCompiledRoute:false` |

### Dropped or accepted without action

- **R5-SEC-001** (no byte cap in `hook-adapter-shared.cjs` `readStdin`): CONFIRMED by read, but the merge-base reader had no cap either and the host is the only writer. No failure today, so no recommendation.
- **R5-SEC-002** (alias `diskPath` check skips backslash forms): the check dates from `6428cb13d5`, before the epic, and `diskPath` never reaches the filesystem. Dropped as out of scope.

## 5. Remediation Workstreams

1. Hook stdin coverage gap: item 1.
2. Stale docs and claims: items 2, 6, 7, 8, 9, 10.
3. Checker observability: items 3 and 5.
4. Pre-existing test pins: the admission constant, the jev canary fixture and the manifest test's cli-classifier closure.
5. Parent goal criterion 3: item 4, the operator's call.

## 6. Spec Seed

- Close R2-COR-001 by moving the sk-git and sk-vision readers onto the shared deadline reader.
- Correct the five stale doc claims named in items 2, 6, 7, 9 and 10.

## 7. Plan Seed

- T1: swap the three stdin loops; rerun `hook-stdin-deadline.test.mjs` and the `rg` command in item 1 (expect no sk-git or sk-vision hit).
- T2: edit the two playbook scenarios; rerun `validate_document.py` on both.
- T3: record the depth-cap hit in `test-minified-runtime.mjs`; rerun both fixture families.
- T4: add the warning count to the drift-guard summary; rerun the umbrella.

## 8. Traceability Status

- **Core `spec_code`:** partial. Phases 010 and 011 match the code on main except items 6 and 7.
- **Core `checklist_evidence`:** not applicable; every child is Level 1 with no checklist.
- **Overlay `skill_agent`, `agent_cross_runtime`:** pass. Mirror and runtime-mirror checks exit 0.
- **Overlay `playbook_capability`:** partial (item 2).
- **Overlay `feature_catalog_code`:** not exercised.
- **AC_COVERAGE:** exempt (Level 1).

## 9. Deferred Items

- The 011 children's Known Limitations still open on main: label pins catch renames only (001), one `document_type_fallback` warning (002), the archived `route-gold.typed.json` not rebuilt (003), no Obsidian scenario in the quality playbook (004), GitHub-only heading slugs (005), F### restatements under another id (006), held-open stdin plus a child at its kill timeout passing 3 s (007), and the hint reaching the router only when a caller passes it (008).
- Resolved since round three, checked on main: a missing `--root` now prints usage and exits 2; the Webflow playbook root validates.

## Dimension Expansion Map

Ten fixed foci from the strategy plan, one per iteration: merge resolution, hook deadlines, compiled routing, reducer, security, review checkers, drift guards, phase traceability, sk-code docs, agents and mirrors. No pivots and no Council.

## 10. Search Ledger

hasSearchDebt: true. The reducer reports search debt, and the dashboard carries CONDITIONAL. The orchestrator's adjudication above supersedes it for the verdict because no P0 or P1 exists.

## 11. Audit Appendix

- **Convergence:** stopPolicy max-iterations; all ten iterations ran; every iteration verdict PASS; reducer registry P0 0, P1 0, P2 18.
- **Coverage:** correctness, security, traceability and maintainability all covered.
- **Core Protocols:** `spec_code` partial, `checklist_evidence` not applicable.
- **Overlay Protocols:** `skill_agent` pass, `agent_cross_runtime` pass, `playbook_capability` partial, `feature_catalog_code` not exercised.
- **Ruled out:** shell injection in checker scripts (argv arrays only), write-through-symlink in the manifest writer, deadline-truncated payloads reaching a gate as valid JSON.
- **Sources:** `review/iterations/iteration-001.md` to `iteration-010.md`, `review/deltas/`, `review/dispatch-receipts/`.
