---
title: "Review Report: the system-skill-advisor logic at HEAD, generation 4"
description: "Five-pass deep review of the advisor runtime and hooks code. FAIL from the scope and coverage gates. One active P1 on the trusted-caller default, 14 active P2s, 4 search-debt rows. Two P2s closed as false positives at synthesis."
trigger_phrases:
  - "advisor logic review report"
  - "skill advisor deep review generation 4"
  - "trusted caller default review"
importance_tier: normal
contextType: review
---

# Review Report: the system-skill-advisor logic at HEAD, generation 4

<!-- ANCHOR:deep-review-advisor-logic-generation-4 -->

## 1. Executive Summary

- **Verdict:** FAIL. This is the output of `review-verdict.cjs`, and it binds.
- **hasAdvisories:** false. The flag is only set on a PASS.
- **Counts the verdict used:** P0 0, P1 1, P2 14. Search debt 4. Failed required gate ids: `coverage`, `scope`. These counts come from the registry after the self-check refresh.
- **What makes this a FAIL.** The verdict script returns FAIL on an active P0 or a failed required gate. It returns CONDITIONAL on an active P1 or open search debt. There is no P0. So FAIL comes only from the two failed gates. The P1 and the search debt would each give CONDITIONAL on their own.
- **Part 1, the P1.** R2-P1-001 is the trusted-caller default. Alone it gives CONDITIONAL. It clears when the code, the launcher and three doc lines agree on one default, and a later pass records the finding resolved.
- **Part 2, the scope gate** (`findings-out-of-scope`). Four active findings carry a file the gate cannot match to `reviewScopeFiles`:
  - R2-P1-001 (`runtime/advisor-server.ts`), R2-P2-001 (`runtime/lib/shadow/shadow-sink.ts`) and R2-P2-002 (`runtime/skill-advisor-cli.ts`) were recorded with skill-relative paths. Their full paths, under `.skilled/skills/system-skill-advisor/`, are all in `reviewScopeFiles`. These three misses are a spelling artifact, not out-of-scope work.
  - R3-P2-002 sits in `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md`. That doc is genuinely outside `reviewScopeFiles`. The defect is real, so it was not closed to pass the gate.
  - To clear it under a `restart`: a restart archives this `review/` tree and starts a fresh registry (`loop-protocol.md`, Lifecycle Branches). The next scope gate then judges only the next generation's findings. It passes when every finding cites its full repo-relative path (`.skilled/skills/system-skill-advisor/...`) and sits inside `reviewScopeFiles`. The gate compares paths literally. R3-P2-002 drops out if its catalog fix lands first, if the next passes do not re-file it, or if the operator widens the scope.
  - To clear it under a `resume` or `--extend`: this registry carries forward. The reducer keys these records on file, line and title, so a re-emit with the full path adds a second record and leaves the bare-path one open. The four records leave `openFindings` only when they are fixed and a pass records them resolved. A tooling fix that normalizes skill-relative paths would also clear the three spelling misses.
- **Part 3, the coverage gate** (`traceability-incomplete`). The registry reports `gatingFailures: 1`. That is the hard `spec_code` protocol at `fail`. It fails on the same contradiction as the P1. No review pass can clear it until the P1 fix lands. A pass must then record `spec_code` as pass.
- **Part 4, the search debt.** Four bug classes were deferred, not covered: `socket_hijack` (pass 2), `python_ts_parity` (pass 3), `duplication` (pass 4) and `lifecycle_and_derived_defect_scan` (pass 5). Each clears when a pass records it covered or ruled out with evidence.
- **Self-check outcomes.** These are already reflected in the counts above.
  - R2-P1-001: confirmed at P1. The anchor moved to `runtime/advisor-server.ts:324-326`. No row appended.
  - R4-P2-001: false positive, recorded as `none`. The export has a reader.
  - R4-P2-005: false positive, recorded as `none`. Its guard is not in a retirement path.
  - R5-P2-001: confirmed at P2. Its stated case was corrected to cross-process reach only.
  - The other 12 P2s were re-read at their cited lines and hold at P2.
- **Review scope.** The target is the skill `.skilled/skills/system-skill-advisor`, limited to 154 source files under `runtime/` and `hooks/`. Tests, fixtures, benches and dist are excluded. HEAD is `4eda64f6c27`. The strategy names `82af76f6754`, but every commit between the two landed before the run started. Dimensions were correctness, security, traceability and maintainability, and all four were covered. The run made 5 of 5 passes and stopped on `maxIterationsReached`. Session `2026-11-23T21:02:32.908Z`, generation 4.
- **Operator review focus (verbatim):**

> The advisor's logic: runtime/ (lib, scorer, handlers, scripts including the Python fallback skill_advisor.py) and hooks/. Prose docs are out of scope unless code contradicts them.

- **Next generation.** A native three-pass generation follows in this packet. It should target these:
  1. The unread modules behind `lifecycle_and_derived_defect_scan`.
  2. Executing the parity suites, plus a disposition for `socket_hijack`.
  3. A traceability pass that re-runs `spec_code` once the P1 fix has landed. It should also record the `skill_agent`, `agent_cross_runtime` and `playbook_capability` overlays.
  - Every pass should cite each finding by its full repo-relative path. That one rule clears three of the four scope misses.
- **Limits of the next generation.**
  - It can clear the search debt without any code change.
  - It cannot clear the coverage gate or the P1 unless the trust-default fix lands first. If the fix has not landed, the next pass will re-find the P1, and `spec_code` will fail again.
  - Under a restart, it clears the scope gate by citing repo-relative paths and keeping its findings inside `reviewScopeFiles`. Under a resume, it clears the scope gate only by recording the four findings resolved after their fixes land.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL with one active P1, and two required gates failed. The P1 fix comes first because the coverage gate depends on it. The 14 P2s are advisories. They are grouped into workstreams so a plan can take them in one pass. `fixCompletenessRequired` is true for the P1 because its contradiction lives in four places: one code comment, the launcher, one playbook and one reference. Fixing one place and missing the others leaves `spec_code` failing.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "failedRequiredGateIds": ["coverage", "scope"],
  "searchDebtCount": 4,
  "activeFindings": [
    {"id": "R2-P1-001", "severity": "P1", "dimension": "security", "file": "runtime/advisor-server.ts:247", "title": "The trusted-caller gate is trusted-by-default in the shipped launcher, so the daemon side never fails closed"},
    {"id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1189-1192", "title": "RRF-fused scores are normalised, thresholded and bonus-adjusted as if they were weighted sums"},
    {"id": "R1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254-1255", "title": "The skill-versus-command tie-break is disabled by any slash, including a file path"},
    {"id": "R1-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1462", "title": "The ambiguous flag is recomputed on the doctor-inclusive list, contradicting the doctor-free invariant"},
    {"id": "R1-P2-004", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1304-1306", "title": "Low-information abstention counts stop words, drifting from the policy's own meaningful-token measure"},
    {"id": "R1-P2-005", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545-558", "title": "heldBelow names a single holder, so the ambiguity exception misses a cap set by another holder"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": "runtime/lib/shadow/shadow-sink.ts:135", "title": "The shadow delta log writes the raw prompt with default file and directory modes and no owner or symlink guard"},
    {"id": "R2-P2-002", "severity": "P2", "dimension": "security", "file": "runtime/skill-advisor-cli.ts:747", "title": "The prompt-time mutation refusal lives only in the CLI front door, not in the daemon that every client shares"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:5-11", "title": "The advisor contract-key module names two consumers that do not exist"},
    {"id": "R3-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:3", "title": "The feature-catalog CLI entry cites its parity suite at a path that does not exist"},
    {"id": "R4-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1104", "title": "scoreAdvisorPrompt is a 368-line sequential pipeline with no stage seam"},
    {"id": "R4-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:22", "title": "Pi adapter hard-copies the Claude hook budget and re-implements its parse rule"},
    {"id": "R4-P2-004", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52", "title": "Prompt cap and confidence floors are hard-coded once per language with no shared source"},
    {"id": "R4-P2-006", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:203", "title": "Gate-3 question lookup converts a load failure into no-question with no diagnostic"},
    {"id": "R5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:186", "title": "The corrupt-lock reclaim deletes a lock another publisher is still acquiring"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": "P1", "findings": ["R2-P1-001"], "goal": "One trust default, stated the same way in the daemon comment, the launcher, the playbook and the graph reference, pinned by a test"},
    {"id": "WS-2", "priority": "P2", "findings": ["R1-P2-001", "R1-P2-002", "R1-P2-003", "R1-P2-004", "R1-P2-005"], "goal": "Scorer correctness in fusion.ts"},
    {"id": "WS-3", "priority": "P2", "findings": ["R2-P2-001", "R2-P2-002"], "goal": "Daemon-side hardening: shadow log modes and the prompt-time refusal"},
    {"id": "WS-4", "priority": "P2", "findings": ["R3-P2-001", "R3-P2-002"], "goal": "Contract and catalog path drift"},
    {"id": "WS-5", "priority": "P2", "findings": ["R4-P2-002", "R4-P2-003", "R4-P2-004", "R4-P2-006", "R5-P2-001"], "goal": "Maintainability guards and the generation-lock reclaim"}
  ],
  "specSeed": [
    "Decide whether the shipped daemon admits a caller with no _meta block, and state that decision in one place the other surfaces cite",
    "Describe _meta.trusted as a cooperative flag, not authentication",
    "Move the prompt-time mutation refusal into the daemon so both doors share one rule",
    "Single-source the numeric constants the Python fallback mirrors"
  ],
  "planSeed": [
    "Correct runtime/advisor-server.ts:324-326, cli-trusted-gate-refusal.md:16 and references/graph/propagate-enhances.md:76, or drop the launcher default",
    "Add a test that pins the daemon's answer to a _meta-less advisor.call under the shipped launcher env",
    "Fix the five fusion.ts findings with one regression case each",
    "Replace the open-then-write lock publication in generation.ts and add an empty-lock test",
    "Re-run spec_code after WS-1 lands"
  ],
  "findingClasses": {
    "R2-P1-001": "cross-consumer",
    "R1-P2-001": "logic-defect / unit-mismatch",
    "R1-P2-002": "logic-defect / wrong predicate",
    "R1-P2-003": "invariant-violation",
    "R1-P2-004": "measurement-drift",
    "R1-P2-005": "boundary-defect",
    "R2-P2-001": "class-of-bug",
    "R2-P2-002": "cross-consumer",
    "R3-P2-001": "documentation-contract drift / phantom consumer",
    "R3-P2-002": "documentation-contract drift / stale path",
    "R4-P2-002": "oversized function / implicit ordering invariant",
    "R4-P2-003": "hand-kept duplicate with no guard",
    "R4-P2-004": "cross-language duplicated constant",
    "R4-P2-006": "swallowed failure / absent-versus-broken conflation",
    "R5-P2-001": "class-of-bug"
  },
  "affectedSurfacesSeed": {
    "R2-P1-001": "UNKNOWN",
    "R1-P2-001": ["fusion.ts:1189", "fusion.ts:1208", "fusion.ts:1260-1265", "handlers/advisor-recommend.ts:586"],
    "R1-P2-002": ["fusion.ts:1254-1255", "command-attach.ts:222", "command-attach.ts:767"],
    "R1-P2-003": ["fusion.ts:1272-1273", "fusion.ts:1407-1411", "fusion.ts:1462", "render.ts:599-607"],
    "R1-P2-004": ["prompt-policy.ts:130-141", "fusion.ts:1304-1306", "fusion.ts:1333"],
    "R1-P2-005": ["fusion.ts:545-558", "ambiguity.ts:68", "ambiguity.ts:70"],
    "R2-P2-001": "UNKNOWN",
    "R2-P2-002": "UNKNOWN",
    "R3-P2-001": ["runtime/tools/advisor-contract-keys.ts:5-11", "runtime/tools/advisor-recommend.ts:12", "runtime/schemas/advisor-tool-schemas.ts:259-277"],
    "R3-P2-002": ["feature-catalog/cli-surface/skill-advisor-cli.md:3", "feature-catalog/cli-surface/skill-advisor-cli.md:17"],
    "R4-P2-002": ["runtime/lib/scorer/fusion.ts:1104-1471", "runtime/lib/scorer/fusion.ts:1010", "runtime/lib/command-attach.ts:257-373"],
    "R4-P2-003": ["hooks/pi/prompt-advisor.ts:23", "hooks/pi/prompt-advisor.ts:30-38", "hooks/claude/user-prompt-submit.ts:182"],
    "R4-P2-004": ["runtime/scripts/skill_advisor.py:52", "runtime/schemas/advisor-tool-schemas.ts:257", "runtime/scripts/skill_advisor.py:4147"],
    "R4-P2-006": ["runtime/lib/policy-plan.ts:203-211", "runtime/lib/policy-plan.ts:228"],
    "R5-P2-001": ["runtime/lib/freshness/generation.ts:154-158", "runtime/lib/freshness/generation.ts:139-146", "runtime/lib/freshness/generation.ts:186-191"]
  },
  "fixCompletenessRequired": true
}
```

The iteration-2 JSONL rows carry no `affectedSurfaceHints` for R2-P1-001, R2-P2-001 or R2-P2-002, so the packet marks them `UNKNOWN`. Section 3 gives the surfaces that `iteration-002.md` names in prose.

## 3. Active Finding Registry

Dimension is the reducer's value. The reducer records the pass 4 findings as correctness, although pass 4 ran the maintainability dimension.

### R2-P1-001. The trusted-caller gate is trusted-by-default in the shipped launcher

- **Severity:** P1, confirmed by the synthesis Referee. **Dimension:** security. **Disposition:** active, fix before merge.
- **File:line:** recorded as `runtime/advisor-server.ts:247`. The full path is `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts`. The failing promise is at `:324-326`.
- **Evidence:**
  - `resolveTrustedCaller` returns `process.env.SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT === 'trusted'` when `_meta` is silent (`advisor-server.ts:248`).
  - The shipped launcher sets that variable to `trusted` (`.skilled/bin/system-skill-advisor-launcher.cjs:74`).
  - The dispatch comment says: "Without it the tools see an untrusted caller, so mutations stay refused" (`advisor-server.ts:324-326`). Under the shipped launcher that is false.
  - The playbook says "a hand-rolled IPC client cannot skip the check" (`.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-trusted-gate-refusal.md:16`).
  - The reference says "Untrusted callers receive an authentication error" (`references/graph/propagate-enhances.md:76`).
- **Impact:** a same-user socket client that sends no `_meta` can run `advisor_rebuild`, `skill_graph_scan` or a propagate apply. That client could already assert `_meta.trusted: true` (`advisor-server.ts:240-241`), so it gains no capability. The defect is a guard comment and two docs that promise a refusal that does not happen.
- **Fix:** do one of two things. Either correct the three lines to say the shipped default is trusted and that `_meta.trusted` is a cooperative flag. Or drop the launcher default and give every caller that needs it an explicit `_meta`. In both cases, add a test that pins a `_meta`-less call under the launcher env.
- **findingClass:** cross-consumer. **scopeProof:** absent from the JSONL. `iteration-002.md` reports `rg -n "SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT"` with one writer and one reader.
- **affectedSurfaceHints (iteration-002.md prose):**
  - `advisor-server.ts:236-258`
  - `skill-advisor-cli.ts:1115-1121`
  - `system-skill-advisor-launcher.cjs:70-79`
  - `handlers/advisor-rebuild.ts:123`
  - `handlers/skill-graph/scan.ts:35`
  - `handlers/skill-graph/propagate-enhances.ts:46`

### R1-P2-001. RRF-fused scores are treated as weighted sums

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1189-1192`.
- **Evidence:** with RRF on, `score` is `rrfScore` (`:1190-1192`). It is then divided by `liveTotal` (`:1208`) and meets the same thresholds as the weighted path.
- **Impact:** with `SPECKIT_ADVISOR_RRF_FUSION=1`, a four-lane rank-1 match scores at most about 0.106. Its confidence then drops well below the weighted path. The flag is off by default (`fusion.ts:166-168`).
- **Fix:** rescale the RRF score into the weighted range, or give the RRF path its own thresholds.
- **findingClass:** logic-defect / unit-mismatch. **scopeProof:** the file is in `reviewScopeFiles`. **affectedSurfaceHints:** `fusion.ts:1189`, `:1208`, `:1260-1265`, `handlers/advisor-recommend.ts:586`.

### R1-P2-002. Any slash disables the skill-versus-command tie-break

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254-1255`.
- **Evidence:** the `-0.08` command penalty applies only when `!promptLower.includes('/')`.
- **Impact:** `review src/lib/fusion.ts for bugs` loses the penalty, so a command bridge can tie or overtake a skill.
- **Fix:** use the typed-command predicate that already exists at `command-attach.ts:222` and `:767`.
- **findingClass:** logic-defect / wrong predicate. **scopeProof:** the file is in `reviewScopeFiles`. **affectedSurfaceHints:** `fusion.ts:1254-1255`, `command-attach.ts:222`, `command-attach.ts:767`.

### R1-P2-003. The ambiguous flag uses the doctor-inclusive list

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1462`.
- **Evidence:** the comment at `:1272-1273` says doctor bridges must not shape ambiguity. Even so, `ambiguous: isAmbiguousTopTwo(ranked)` at `:1462` runs on the list that still holds them.
- **Impact:** a passing `/doctor:` bridge within 0.05 of the top skill prints an `ambiguous: X vs Y` line in the brief.
- **Fix:** compute the flag on the doctor-free slots.
- **findingClass:** invariant-violation. **scopeProof:** both files are in `reviewScopeFiles`. **affectedSurfaceHints:** `fusion.ts:1272-1273`, `:1407-1411`, `:1462`, `render.ts:599-607`.

### R1-P2-004. Low-information abstention counts stop words

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1304-1306`.
- **Evidence:** the token count is `split(/\s+/)` filtered by `length > 1`. The exported `promptPolicyTokens` at `prompt-policy.ts:130-141` is the measure the policy itself uses.
- **Impact:** `do it now` turns the abstention floor on, but `please do it now` turns it off.
- **Fix:** count `promptPolicyTokens(prompt).meaningful`.
- **findingClass:** measurement-drift. **scopeProof:** both files are in `reviewScopeFiles`. **affectedSurfaceHints:** `prompt-policy.ts:130-141`, `fusion.ts:1304-1306`, `fusion.ts:1333`.

### R1-P2-005. heldBelow names a single holder

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545-558`.
- **Evidence:** only the lowest-scoring seed is recorded as the binding holder. `ambiguity.ts:68` checks only that one.
- **Impact:** the reach is narrow. When a higher seed is the top, the capped target can join the top's ambiguity cluster. The lower seed usually clusters with the top anyway, so the flag rarely changes. The extra cluster member is the visible effect.
- **Fix:** record every holder that bounded the target, or check `heldBelow` against any seed.
- **findingClass:** boundary-defect. **scopeProof:** both files are in `reviewScopeFiles`. **affectedSurfaceHints:** `fusion.ts:545-558`, `ambiguity.ts:68`, `ambiguity.ts:70`.

### R2-P2-001. The shadow delta log writes raw prompts with default modes

- **Severity:** P2. **Dimension:** security. **Disposition:** active.
- **File:line:** recorded as `runtime/lib/shadow/shadow-sink.ts:135`. The full path is under `.skilled/skills/system-skill-advisor/`.
- **Evidence:** `mkdirSync(dirname(logPath), { recursive: true })` and `appendFileSync(logPath, ...)` at `:135-136` set no mode and run no owner check. `ShadowDeltaRecord` carries `prompt` (`:23-31`).
- **Impact:** with shadow mode on, a second local account can read every prompt under a common umask. The sink is opt-in (`runtime/data/README.md:21`).
- **Fix:** apply the 0700 directory, 0600 file and lstat owner contract that `hooks/lib/route-receipt.ts:245-250` already uses.
- **findingClass:** class-of-bug. **scopeProof:** absent from the JSONL. **affectedSurfaceHints (iteration-002.md prose):** `shadow-sink.ts:23-31`, `shadow-sink.ts:135-141`, `hooks/lib/route-receipt.ts:245-250`.

### R2-P2-002. The prompt-time refusal lives only in the CLI

- **Severity:** P2. **Dimension:** security. **Disposition:** active.
- **File:line:** recorded as `runtime/skill-advisor-cli.ts:747`. The full path is under `.skilled/skills/system-skill-advisor/`.
- **Evidence:** `assertTrustedForMutation` refuses at prompt time (`:747-761`). Its only call site is `:779`. The daemon has no prompt-time concept.
- **Impact:** a future hook that calls the socket directly would skip the rule. No hook does this today.
- **Fix:** carry a prompt-time marker in `_meta` and refuse it in the daemon.
- **findingClass:** cross-consumer. **scopeProof:** absent from the JSONL. **affectedSurfaceHints (iteration-002.md prose):** `skill-advisor-cli.ts:747-761`, `:779`, `hooks/lib/skill-advisor-cli-fallback.ts:207-212`, `advisor-server.ts:317-341`.

### R3-P2-001. The contract-key header names consumers that do not exist

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:5-11`.
- **Evidence:** the header names `skill_advisor/tools/...` and `schemas/tool-input-schemas.ts`. Neither exists. `ls runtime/schemas` shows no such file, and no `ALLOWED_PARAMETERS` symbol exists.
- **Impact:** a new key added to the tuple does not reach the Zod schema, so the handler at `handlers/advisor-recommend.ts:641` rejects it.
- **Fix:** correct the header, or import the tuple into `AdvisorRecommendInputSchema`.
- **findingClass:** documentation-contract drift / phantom consumer. **scopeProof:** an `rg` over `.skilled` for the tuples returns only the descriptors. **affectedSurfaceHints:** `advisor-contract-keys.ts:5-11`, `tools/advisor-recommend.ts:12`, `schemas/advisor-tool-schemas.ts:259-277`.

### R3-P2-002. The catalog cites the parity suite at a wrong path

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. The file is outside `reviewScopeFiles`.
- **File:line:** `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:3`, and the inline citation at `:16`.
- **Evidence:** the doc cites `tests/skill-advisor-cli-manifest-parity.vitest.ts`. The suite lives at `runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts`.
- **Impact:** a reader who follows the path finds nothing. The suite itself exists and runs.
- **Fix:** add the `runtime/` prefix.
- **findingClass:** documentation-contract drift / stale path. **scopeProof:** a probe of 230 catalog paths found 229 that resolve. **affectedSurfaceHints:** `skill-advisor-cli.md:3`, `skill-advisor-cli.md:17`.

### R4-P2-002. scoreAdvisorPrompt is a 368-line pipeline with no stage seam

- **Severity:** P2. **Dimension:** correctness (pass 4, maintainability). **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1104`.
- **Evidence:** the body spans `:1104-1471`. Its order-dependent withhold and handoff steps run at `:1439-1443`.
- **Impact:** a new step inserted in the wrong place changes the ranking, and no test or type flags it.
- **Fix:** add a stage table or an ordering test. Splitting the function is optional.
- **findingClass:** oversized function / implicit ordering invariant. **scopeProof:** line spans were measured over the declaration list. **affectedSurfaceHints:** `fusion.ts:1104-1471`, `fusion.ts:1010`, `command-attach.ts:257-373`.

### R4-P2-003. The Pi adapter hard-copies the Claude hook budget

- **Severity:** P2. **Dimension:** correctness (pass 4, maintainability). **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:22`.
- **Evidence:** `PI_ADVISOR_DEFAULT_BUDGET_MS = 2500` (`:22`) and a copied parser (`:30-33`) mirror `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500` at `hooks/claude/user-prompt-submit.ts:182`.
- **Impact:** if the Claude budget is raised and Pi's copy is not, Pi silently loses briefs.
- **Fix:** add a test that compares the two constants and the two parse rules.
- **findingClass:** hand-kept duplicate with no guard. **affectedSurfaceHints:** `hooks/pi/prompt-advisor.ts:23`, `:30-38`, `hooks/claude/user-prompt-submit.ts:182`.

### R4-P2-004. The prompt cap and confidence floors are hard-coded per language

- **Severity:** P2. **Dimension:** correctness (pass 4, maintainability). **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52`.
- **Evidence:** `ADVISOR_PROMPT_MAX_CHARS = 10_000` appears at `skill_advisor.py:52` and `advisor-tool-schemas.ts:257`. `_LOOP_OWNER_CONFIDENCE_FLOOR = 0.82` at `skill_advisor.py:4147` mirrors `scoring-constants.ts:185-192`.
- **Impact:** a cap change in one language lets the same paste route differently through the daemon and the fallback.
- **Fix:** move these values into the shared data file the prompt policy already uses, or add a parity test.
- **findingClass:** cross-language duplicated constant. **affectedSurfaceHints:** `skill_advisor.py:52`, `advisor-tool-schemas.ts:257`, `skill_advisor.py:4147`.

### R4-P2-006. The Gate-3 question lookup swallows a load failure

- **Severity:** P2. **Dimension:** correctness (pass 4, maintainability). **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:203`.
- **Evidence:** a bare catch returns `undefined` (`:209-211`). The only consumer is `:228`.
- **Impact:** if the owner module is moved or renamed, every policy plan silently drops the Gate-3 question.
- **Fix:** log or record the miss, so a broken lookup can be told apart from an empty one.
- **findingClass:** swallowed failure / absent-versus-broken conflation. **affectedSurfaceHints:** `policy-plan.ts:203-211`, `policy-plan.ts:228`.

### R5-P2-001. The corrupt-lock reclaim deletes a lock that is still being acquired

- **Severity:** P2, confirmed with a corrected case. **Dimension:** correctness. **Disposition:** active.
- **File:line:** `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:186`.
- **Evidence:** the lock is created with `openSync(lockPath, 'wx')` and its token is written in a second call (`:154-155`). An empty file reads as `token: null` (`:132-135`). The null branch then removes the lock with no second read (`:186-188`).
- **Impact:** two publishers can both bump to generation N+1 for different states. Pass 5 named the watcher and `advisor_rebuild` as the racing pair. That case cannot happen: all publishers run in the daemon process, and the open, write and close calls are synchronous. The reach is cross-process only, for example two daemons overlapping during a lease handover.
- **Fix:** write the token to a temp file and link or rename it into place. Alternatively, re-read before reclaiming. Add an empty-lock test.
- **findingClass:** class-of-bug. **affectedSurfaceHints:** `generation.ts:154-158`, `:139-146`, `:186-191`.

## 4. Remediation Workstreams

1. **WS-1 (P1). Trust default, R2-P1-001.**
   - Pick one default.
   - Correct `advisor-server.ts:324-326`, `cli-trusted-gate-refusal.md:16` and `propagate-enhances.md:76`, or drop the launcher default at `system-skill-advisor-launcher.cjs:74`.
   - Add a test for a `_meta`-less call under the launcher env.
   - This clears the P1, and it unblocks `spec_code` and the coverage gate.
2. **WS-2 (P2). Scorer correctness in fusion.ts:** R1-P2-001 to R1-P2-005. Each fix gets one regression prompt.
3. **WS-3 (P2). Daemon-side hardening:** R2-P2-001 (shadow log modes) and R2-P2-002 (prompt-time refusal in the daemon).
4. **WS-4 (P2). Contract and catalog drift:** R3-P2-001 (contract-key header) and R3-P2-002 (catalog path prefix).
5. **WS-5 (P2). Maintainability guards and the lock reclaim:**
   - R4-P2-002: stage-order test.
   - R4-P2-003: Pi budget parity test.
   - R4-P2-004: shared constants.
   - R4-P2-006: a diagnostic on the failed lookup.
   - R5-P2-001: atomic token publication.

WS-1 comes first because two gates depend on it. WS-2 to WS-5 are advisories and can run in any order.

## 5. Spec Seed

- State the daemon's trust default once. Name the launcher as the place that sets it for this repository.
- Describe `_meta.trusted` as a cooperative caller flag. It is not an authentication boundary. Cross-user reach is blocked by the 0700 socket directory and the 0600 socket node.
- Require the prompt-time mutation refusal at the daemon, not only at the CLI.
- Require one source for numeric constants shared by the TypeScript scorer and the Python fallback.
- Require the generation lock to publish its token atomically.

## 6. Plan Seed

1. Read `advisor-server.ts:236-260` and `:317-330`, and the launcher at `:68-80`. Decide whether the trusted default stays.
2. Edit the three contradicting lines, or remove the launcher default. Add a vitest case for a `_meta`-less `advisor.call`.
3. Fix `fusion.ts` at `:1190`, `:1254`, `:1304`, `:1462` and `:545-558`. Add one prompt per fix to the routing tests.
4. Add owner and mode handling to `shadow-sink.ts:135-140`.
5. Add the prompt-time marker to `callerMeta` (`skill-advisor-cli.ts:1282-1288`), and refuse it in `handleAdvisorCallFrame`.
6. Correct the `advisor-contract-keys.ts` header and the catalog path at `skill-advisor-cli.md:16`.
7. Make the token write in `generation.ts:154-156` atomic, and add an empty-lock stress case.
8. Re-run `spec_code` in a review pass and confirm it records `pass`.

## 7. Traceability Status

### Core protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `spec_code` | hard | fail | `references/graph/propagate-enhances.md:76` promises an authentication error. `advisor-server.ts:240-248` accepts caller-declared trust and the launcher default (pass 3 and pass 5). | R2-P1-001. This is the one gating failure. |
| `checklist_evidence` | hard | notApplicable | The packet has no `checklist.md` or `acceptance-criteria.md` (pass 3). | None. |

### Overlay protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `feature_catalog_code` | warn | partial | 229 of 230 catalog paths resolve. A dist probe found 9 of 9 manifest entries identical to `TOOL_DEFINITIONS` (pass 3). | R3-P2-002. |
| `skill_agent` | advisory | not run | No pass recorded it. | Owed by a later pass. |
| `agent_cross_runtime` | advisory | not run | No pass recorded it. | Owed by a later pass. |
| `playbook_capability` | advisory | not run | No pass recorded it. Synthesis read `cli-trusted-gate-refusal.md:16` for the P1 only. | The playbook's daemon claim is false under the launcher default. |

The registry summary reads required 2, executed 2, pass 0, partial 1, fail 1, notApplicable 1, gatingFailures 1.

### AC_COVERAGE

Exempt. The target type is `skill`. The AC_COVERAGE signal applies to spec-folder targets only (`.skilled/skills/system-deep-loop/deep-review/SKILL.md:169`).

### Resource map

`config.resource_map_present` is false. The spec folder has no `resource-map.md`, so the Resource Map Coverage Gate was skipped. `step_emit_resource_map` wrote `review/resource-map.md`, which lists 27 references. 19 of those are marked missing:
- 16 are graph node ids that the map reads as paths, such as `bugclass-dead-export`, `file-fusion` and `R5-P2-001`.
- The other 3 are the skill-relative paths of R2-P1-001, R2-P2-001 and R2-P2-002, which do not resolve from the repository root.

Neither group points to a missing file.

## 8. Deferred Items

- **AdvisorToolInputSchemas coupling.** R4-P2-001 was closed because the export has a reader. That reader is `.skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:112`, which regex-parses the map as the live advisor command set. The server routes by `TOOL_DEFINITIONS` instead (`runtime/tools/index.ts:39-46`). Whether that test should read the real registry is a follow-up. Do not delete the export.
- **Pasted-reply strip parity.** R4-P2-005 was closed. The shared fixture `pasted-reply-strip-cases.json` is read by both suites, and `tests/legacy/` runs in the default suite (`runtime/vitest.config.ts` includes `tests/**/*.vitest.ts`). Executing the parity suite is still owed under `python_ts_parity`.
- **FIFO eviction named "oldest"** in `prompt-cache.ts:186-196`. The name is accurate, so it was not filed (pass 5).
- **source-cache TTL freeze** at `source-cache.ts:66-80`. It is latent, with one caller (pass 5).
- **Equal-generation notifications** at `cache-invalidation.ts:45`. These are benign unless R5-P2-001's race happens (pass 5).
- **Unread modules:** `runtime/lib/lifecycle/*`, `runtime/lib/derived/*`, three `cross-skill-edges/` files and four `skill-graph/` files (pass 5). These are the `lifecycle_and_derived_defect_scan` debt.
- **Frontier.** The registry carries no `frontier` object, so no frontier node is listed.

## Dimension Expansion Map

- **Saturated directions:** none recorded. `divergence.saturatedDirections` is empty.
- **Completed and failed pivots:** none. `divergence.completed` and `divergence.failed` are empty.
- **Audited overrides:** none. **Council artifacts:** none.
- **Selected review directions, one per pass:**
  1. Scoring core.
  2. Trust boundaries.
  3. Contracts against the catalog and reference.
  4. Maintainability of hooks and the Python fallback.
  5. Closing recheck plus the cache and lifecycle slice.
- **Remaining frontier:** the reducer's `remainingFrontier` is empty. The unread modules in section 8 are the practical frontier.

## 9. Search Ledger

- **hasSearchDebt:** true. The verdict already counts it. On its own it gives CONDITIONAL. FAIL here comes from the gates.
- **searchCoverage.requiredBugClasses:** `stale_cache`, `missing_invalidation`, `race_condition`, `atomicity`, `auth_gate_promise` and `path_drift`. All six are covered. Mode: `graphless_fallback`.
- **candidateCoverage:** 21 classes covered, 18 ruled out, 4 deferred, 0 blocked.

| Id | Pass | Bug class | Disposition | Reason |
|---|---|---|---|---|
| SL-007 | 2 | socket_hijack | deferred | The client transport is in `.skilled/bin/lib/launcher-ipc-bridge.cjs`, outside the target. |
| SL-012 | 3 | python_ts_parity | deferred | The fixture wiring is clean. The suite was not executed. |
| SL-412 | 4 | duplication | deferred | The parity suite was not executed. |
| SL-507 | 5 | lifecycle_and_derived_defect_scan | deferred | The budget ran out. `lifecycle/` and `derived/` were never read. |

**ruledOutCandidates and cleanSearchProof:**

| Id | Pass | Bug class | Proof |
|---|---|---|---|
| SL-003 | 2 | symlink_or_traversal | Both stores enforce ownership, mode and no-follow. |
| SL-004 | 2 | injection | The prompt travels on stdin to an argv array. |
| SL-005 | 2 | signal_or_pid_redirect | Lease state sends only signal 0. |
| SL-006 | 2 | secret_exposure | stderr is discarded. No env value reaches the brief. |
| SL-011 | 3 | contract_drift | 9 of 9 manifest entries match, and the source suite asserts it. |
| SL-014 | 3 | socket_reach | The socket directory is 0700 and the node is 0600, both owner-checked at bind. |
| SL-407 | 4 | comment_hygiene | No artifact ids appear in code comments. |
| SL-408 | 4 | embedding_lane_leftovers | No embedding module, flag or branch survives. |
| SL-409 | 4 | duplication | The directive store is one Python helper behind a TS wrapper. |
| SL-410 | 4 | duplication | The prompt-policy sets come from one JSON file. |
| SL-411 | 4 | dead_code | `ablation.ts` is test support. |
| SL-501 | 5 | stale_cache | The source-cache key carries the signature and the generation. |
| SL-502 | 5 | missing_invalidation | Both doors invalidate on a signature change. |
| SL-504 | 5 | atomicity | No generation publish comes before a complete harvest. |
| SL-505 | 5 | auth_gate_promise | The downgrade hypothesis for the P1 was rejected. |
| SL-506 | 5 | path_drift | R3-P2-002 was narrowed to a missing prefix. |

## 10. Audit Appendix

### Convergence summary

- Stop reason: `maxIterationsReached`. The stop policy is `max-iterations`, so convergence is telemetry only.
- Convergence score 0.925. Graph decision `STOP_ALLOWED` at the end.
- New-findings ratio by pass: 1.0, 0.58, 0.321, 0.3, 0.075.
- Terminal gates (state log, run 6): `evidence` passed with `all-findings-cited`. `scope` failed with `findings-out-of-scope`. `coverage` failed with `traceability-incomplete`.

### Coverage summary

- All four dimensions were covered.
- Files read per pass: 14, 20, 27, 15, 29.
- The four core gaps are the SL-507 modules, the unexecuted parity suites, three unrun overlays, and the client-side socket bridge.

### Ruled-out claims

- `dominantLane` reordering, the conflict lane's `Math.min` seed, and a stale `ambiguousWith` partner (pass 1).
- Prompt injection reaching a mutation through a hook, and a lease redirecting a signal (pass 2).
- Cross-user socket reach, manifest drift, and catalog-wide path loss (pass 3).
- At synthesis: R4-P2-001 and R4-P2-005 were closed as false positives, with the evidence in sections 1 and 8.

### Sources reviewed

- Iterations `iteration-001.md` to `iteration-005.md` and deltas `iter-001.jsonl` to `iter-005.jsonl`.
- `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-config.json` and `deep-review-state.jsonl`.
- Re-read at synthesis:
  - `runtime/advisor-server.ts:225-330`
  - `.skilled/bin/system-skill-advisor-launcher.cjs:55-130`
  - `runtime/lib/auth/trusted-caller.ts`
  - `runtime/skill-advisor-cli.ts:205-235, 740-782, 1278-1292`
  - every cited line of the 16 P2s
  - `runtime/tests/legacy/README.md` and `runtime/vitest.config.ts`
  - the doctor route-contract test
  - `.mcp.json` and `opencode.json`, which register no advisor server

### Executor note

- The run was configured for `cli-devin` with `deepseek-v4-1-flash-max`.
- Devin refused iteration 1 because its daily quota was exhausted. The state log holds a `dispatch_failure` row at 21:04:00Z with `executorUnavailable: true`, `matchedMarker: resource_exhausted` and `reason: crash`.
- The operator switched the executor to `cli-pi` with `deepseek-v4.1-flash-1017` at max reasoning, then resumed the same run (`resumed` event at 21:06:53Z).
- All five passes ran on cli-pi. `iteration-001.out` is the leftover from the failed Devin dispatch.

### Containment note

- The state log holds six `containment_violation` rows, for iterations 1 to 5 with two for iteration 1.
- Every violation path is an untracked `dispatch-review-i{n}-g4` intent or completion JSON under the spec folder's `dispatch-receipts/`.
- Each file was preserved and copied to `review/containment/quarantine/`.
- No path under the review target appears. This is consistent with the "SCOPE VIOLATIONS: None" lines in passes 4 and 5.

### Lineage note

Config declares `lineageMode: restart`. The state log holds a `restarted` event and then a `resumed` event for the executor switch. All five passes recorded this disagreement. This report copies config.

### Self-check tooling note

The `step_adversarial_selfcheck` command in `.skilled/commands/deep/assets/deep-review.yaml` runs `node "$GATEWAY"` inside a `while read` loop over a heredoc. Node reads stdin and swallows the remaining pairs. On this run only the first pair was appended. The second was appended by a separate call, so the registry refresh ran twice instead of once. The fix is to append `</dev/null` to the gateway call inside that loop.

### Core Protocols

- `spec_code`: fail, tied to R2-P1-001.
- `checklist_evidence`: notApplicable, because the packet has no checklist or acceptance file.

### Overlay Protocols

- `feature_catalog_code`: partial, tied to R3-P2-002.
- `skill_agent`, `agent_cross_runtime` and `playbook_capability`: not run in this generation.

<!-- /ANCHOR:deep-review-advisor-logic-generation-4 -->
