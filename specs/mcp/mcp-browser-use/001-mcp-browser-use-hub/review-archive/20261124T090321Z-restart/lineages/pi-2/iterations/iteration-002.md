# Iteration 002: Correctness of the phase 014 fixes and the advisor scorer change

## Dimension

correctness (D1). Operator review focus: the phase 014 fixes and the advisor scorer change it made, read as behaviour rather than as documentation. Installer behaviour, the Bladebro gate, and the narrowed task-intent confidence gate were all read at their source.

## Sources

- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh` (pin, verify step, `bdg cdp --list`)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh` (pinned install, `--ignore-scripts`, digest checks)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh` (digest check, MCP probe)
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` (syntax only)
- `.skilled/bin/tests/mcp-installers.test.cjs` (the five parity assertions)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (task-intent floor, `hasNamedAnchor`, `promptNamesIdNoun`, `readOnlyRouteAllowed`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts` (confidence constants)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` (category hints)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl`, `command-prompts.jsonl`, `behaviour-fresh-prompts.jsonl` (corpus rows that contain `staging`)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/spec.md`, `acceptance-criteria.md`, `goal.md`
- `.skilled/skills/mcp-browser-use/SKILL.md`, `ROUTER.md` (own-Chrome rule)

## Scorecard

- Dimensions covered: correctness (partial: the installer half closed, the scorer half carries the open P1)
- Files reviewed: 13 read or grepped
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=1 (`PI2-I1-P2-002` strengthened with the AC-002 evidence, same file:line and root cause, so no new id)
- New findings ratio: 1.0 (6 of 6 weighted units are new)

## Findings

### P0 Findings

None.

### P1 Findings

1. **A bare `staging` category hint still lifts `mcp-browser-use` to the 0.82 task-intent floor on non-browser prompts** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:30 -- The scorer change in 014 is described as making the task-intent floor require the prompt to name the skill. A category hint counts as that naming, because `hasNamedAnchor` is true whenever any lexical evidence entry starts with `hint:`; `mcp-browser-use` still declares the bare word `staging` as a hint, worth `+0.38` on any prompt that contains it. A prompt with a task-intent verb and that word alone therefore clears the anchor test, the direct-score floor (`0.18`) and the recommendation threshold (`0.8`), which is the same mechanism the change removed for a bare `har`.
   Case: an agent sends "fix the env loader that reads the wrong .env file in staging". `TASK_INTENT` matches `fix`, the lexical lane adds the `staging` hint, `hasNamedAnchor` reads true, `directScore` is at least 0.38, and `mcp-browser-use` is recommended at 0.82 for a configuration bug that has no browser in it.
   Finding class: class-of-bug
   Scope proof: `rg -n "staging" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` shows the word is used across the corpus as a deploy-environment word, and the existing decline rows that carry it (`fit-decline-app-problem-05`, `fresh-decline-app-problem-02`) avoid every task-intent verb, which is why the corpus does not expose the path. The same hint map's other two `mcp-browser-use` entries are phrases (`chrome devtools`, `console errors`); `staging` is the only bare word left in that row after the change.
   Affected surface hints: ["advisor lexical lane", "advisor task-intent confidence floor", "mcp-browser-use routing", "labeled-prompts corpus"]
   ```json
   {
     "findingId": "PI2-I2-P1-001",
     "claim": "A bare `staging` category hint is treated as the prompt naming `mcp-browser-use`, so a task-intent prompt that mentions only staging reaches the 0.82 confidence floor.",
     "evidenceRefs": [
       ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:30",
       ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1226-1233",
       ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:380-405",
       ".skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:191-194"
     ],
     "counterevidenceSought": "Read the whole confidence chain for a demotion of hint-only candidates: `readOnlyRouteAllowed`, the derived-dominant branch, the dispersion guard, the direct-score lift and the `base + directBonus` fallback. None of them ignores a hint as an anchor, and `primaryIntentBonus` only adds. Grepped the routing corpora for decline rows that pair `staging` with a task-intent verb and found none, so no recorded row contradicts the path.",
     "alternativeExplanation": "The word could be kept deliberately because the hub's playbooks talk about staging sites, and 014's spec only promised to drop `har`. But the branch comment states the intent as needing the prompt to name the skill and calls out shared words as the out-of-domain signature, so keeping a bare deploy word contradicts the stated contract rather than extending it.",
     "finalSeverity": "P1",
     "confidence": 0.74,
     "downgradeTrigger": "If a replay row using a task-intent verb plus `staging` and nothing browser-specific shows `mcp-browser-use` below 0.8, or if a later gate drops hint-only candidates before surfacing, downgrade to P2 hardening.",
     "transitions": [
       { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
     ]
   }
   ```
   Skeptic pass: the candidate was challenged on three grounds. (a) Is `staging` reachable only in corpus prompts that are already browser tasks? No: the word is a general deploy-environment word, and the corpus decline rows show it used that way. (b) Does the surfacing gate drop a candidate whose only strong evidence is a hint? No, the evidence array is non-empty and the no-evidence default is keyed on an empty array. (c) Is this a re-raise of a finding 014 already closed? No, 014 closed the `har` token and the browser read-only lift; this is a different hint with the same mechanism. Referee: kept at P1 with confidence 0.74, because the reach is a normal English prompt and the wrong result is a non-browser task routed to a browser hub.

### P2 Findings

1. **`promptNamesIdNoun` accepts any generic noun as the skill's name** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332-335 -- The fourth anchor in `hasNamedAnchor` is "the noun the skill id ends in", implemented as the last dash-separated segment when it is at least four characters. That admits `mode`, `loop`, `code`, `prompt`, `plan` and `catalog`, which are routing vocabulary rather than names, so a prompt that says "loop" or "mode" satisfies the naming test for `system-deep-loop` or `mcp-code-mode` in the same way that "aside" satisfied it for the hub before the change.
   Case: a prompt such as "update the plan for the mode rollout" carries task intent and two generic nouns, so the floor can lift more than one skill that the prompt never named.
   Finding class: instance-only
   Scope proof: `rg -n "promptNamesIdNoun"` shows one definition and one call site, so a restrict-list or a distinctiveness test is a single-file change; the three-character floor already blocks `doc`, `git` and `use`, which shows the mechanism the fix would extend.
   Affected surface hints: ["advisor task-intent confidence floor", "skill id vocabulary"]

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| checklist_evidence | partial | hard | specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:84 | AC-002 is marked Met although its stated verification greps a file whose hit is ungated in place; the closure statement discloses the amendment instead. Finding `PI2-I1-P2-002` is refined by this evidence. |
| spec_code | partial | hard | .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:30 | 014's stated contract for the scorer change is not fully met: a bare hint still satisfies the naming test. |
| skill_agent | pass | advisory | .skilled/skills/mcp-browser-use/SKILL.md:60 | The hub SKILL.md and ROUTER.md both state the own-Chrome attach rule that `hub-router.json` applies. |

Criteria re-checked this iteration and holding:

- AC-001 / REQ-001: the two `_utils.sh` copies are byte-identical, and `mcp-installers.test.cjs:49-55` asserts exactly that, so the parity test's assertion matches the tree.
- AC-009 / REQ-009: `install.sh:30` pins `browser-debugger-cli@0.6.10`; `install.sh:265` verifies the install by running `bdg cdp --list`, and `install.sh:368-369` makes verification the default.
- AC-010 / REQ-010: `mcp-bladebro/scripts/install.sh:50-53,148-152,166-173` installs with `--ignore-scripts` and checks `bin.js`, `binary.cjs` and the native binary against recorded digests before first use; `doctor.sh:26-27,120-124` checks the same digests.
- AC-013: `bash -n` exits 0 on `repl-evidence-capture.sh`.
- AC-017 / REQ-017: `SKILL.md:60` and `ROUTER.md:36` both state the own-Chrome rule, and `ROUTER.md:53` carries `my own chrome` and `signed-in chrome` as Chrome DevTools keywords.
- Syntax: `bash -n` exits 0 on the Chrome DevTools installer, the Bladebro installer and the Bladebro doctor.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` and its lane module are the shared scorer that every advisor caller uses; the finding above is a shared-surface defect, not a hub-local one.
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv` is the only recorded evidence for the fix. It shows `mcp-browser-use` at 0 on all out-of-domain rows it carries, so it does not exercise the `staging` + task-intent path.

## Edge Cases

- The scorer change cannot be executed inside this lineage: running the advisor would write daemon, cache and metrics state outside the write surface. The path is therefore proven by source reading, which is why the P1 carries confidence 0.74 rather than a higher figure, and why the downgrade trigger names the observation that would settle it.
- MBU-PB-04 failing at stage one while stage two routes correctly is not reported as a finding: 014's criterion is scoped to original, paraphrase and out-of-domain rows, the replay report states the failure plainly, and the parent criterion 5 is satisfied by the three mode rows. It is left as a follow-up in the report's deferred items.
- `readOnlyRouteAllowed` returns before the naming test for the browser read-only lift; 014 narrowed that lift to `chrome performance trace` or `browser performance trace`, so a bare "performance trace" prompt no longer takes that branch. Read and confirmed, not carried as a finding.

## Ruled Out

- Installer parity, pin and lifecycle-script gating: read at source, syntax-checked, and consistent with their acceptance criteria. No finding.
- Removing the bare `har` token: no `har` entry remains in the scorer modules, and the two replay rows that mention a HAR still pass through other evidence, so the removal did not strand them.

## Recommended Next Focus

Security (D2): trust boundaries in the same shipped surfaces. The Bladebro installer's digest gate and `npx` refusal, the pinned package install path, and whether the hub's own-Chrome attach rule leaks a data path. Then maintainability (D4) for the packet-state drift that iteration 1 opened.

Review verdict: CONDITIONAL
