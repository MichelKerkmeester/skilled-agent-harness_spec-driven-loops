# Review Iteration 001

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: correctness
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- Artifact dir: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-2`
- Session: `fanout-vibe-2-1795504079797-ay97sx`, generation 1, lineageMode new
- Sources read this iteration: `steer.md` (absent), `review-scope-files.txt`, `deep-review-config.json`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`

## How this iteration addressed the operator focus

The focus binds every iteration. This one took the correctness dimension and applied it to the two
surfaces the focus names explicitly: the phase 014 fixes and the advisor scorer change that phase
made. It verified the phase 014 completion criteria that are mechanically checkable (stale
`mcp-tooling/mcp-*` ids absent, parent-skill checker green on the hub) and then read the scorer
change itself at the line level, because that change is the one piece of shipped work whose
correctness claim is a behavioural promise rather than a file state.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332-335,386-404,1222-1240`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:41-51,190-194`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:86-92,121-145`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:27-45,60-100`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:43-46`
- `.skilled/skills/mcp-browser-use/mode-registry.json:1-140`
- `.skilled/skills/mcp-browser-use/hub-router.json:1-90`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:1-50`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md:1-80`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/implementation-summary.md:1-120`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The id-noun anchor's length filter does not exclude ordinary prompt words, so the task-intent floor still lifts skills whose id noun is a common four-letter word** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332-335` -- `promptNamesIdNoun` keeps the last id segment when `noun.length >= 4` and matches it at a phrase boundary. Its own comment says short segments are dropped "because they occur in ordinary prompts that name nothing", but the filter is length, not ordinariness: `sk-code` ends in `code`, `mcp-code-mode` in `mode`, `system-deep-loop` in `loop`, `sk-prompt` in `prompt`, `sk-design` in `design`. Each of those is exactly the class of word the comment claims to exclude, and each still satisfies `hasNamedAnchor` at `fusion.ts:1230`, which re-opens the `taskIntentFloor` branch at `fusion.ts:386-404`.
   Finding class: correctness
   Scope proof: the finding is inside the declared target's advisor scorer surface, one of the two surfaces the operator focus names; the anchor, the floor branch and the constants it reads are all cited at line level.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts`, the advisor CLI `advisor_recommend` output, and every hub whose skill id ends in a common English word.
   Case: the prompt `change the mode to plan` tokenizes to five tokens; `mode` is a candidate token for `mcp-code-mode` because the lexical lane scores against `skill.id.replace(/-/g, ' ')` (`lanes/lexical.ts:68`), so `scoreTokenOverlap` returns `1 / max(3, 5) = 0.20` (`text.ts:144`), which clears `taskIntentDirectScoreFloor` 0.18 (`scoring-constants.ts:191`); `TASK_INTENT` matches `change` (`fusion.ts:85`); `promptNamesIdNoun` matches `mode` at a phrase boundary (`text.ts:86-92`); the floor therefore returns `max(base, 0.82)` (`fusion.ts:403`), which clears the 0.8 advisor threshold and recommends `mcp-code-mode` for a plan-mode request that names no MCP tool.

```json
{
  "type": "correctness",
  "claim": "The task-intent floor's id-noun anchor uses a length filter as a proxy for 'ordinary word', so four-letter ordinary words still anchor the floor and out-of-domain prompts are still lifted to 0.82 for skills whose id ends in one.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332-335",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1230",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:386-404",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:191",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:193",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:144",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:68"
  ],
  "counterevidenceSought": "Checked whether the anchor is unreachable because the lexical lane never scores a bare id-noun token (it does: the candidate set includes skill.id with hyphens replaced by spaces), whether the floor needs a stronger direct score than 0.18 (it does not: 0.18 is the floor), whether the dispersion guard blocks it (it needs liveNormalized >= 0.95, which a five-token prompt does not reach), and whether the change introduced the defect (it did not: the floor was unconditional before, so this is an incomplete fix rather than a regression).",
  "alternativeExplanation": "The length filter may be a deliberate cheap heuristic that accepts four-letter false anchors because the lexical-score floor of 0.18 already requires real overlap. That reading is consistent with the code but not with the comment, which claims the exclusion is about ordinary prompts rather than about length.",
  "finalSeverity": "P1",
  "confidence": "medium-high",
  "downgradeTrigger": "Downgrade to P2 if a surfacing gate drops a 0.82 recommendation that carries only a token-overlap evidence row, or if the advisor's own ratchet shows no out-of-domain lift for any four-letter id noun."
}
```

### P2 Findings

2. **A real browser request written in the hub's own playbook vocabulary reaches the compiled front door but never reaches the advisor** -- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:38` -- row `MBU-PB-04` records `advisor_top` empty, `advisor_top_confidence` 0, `stage1` false, `stage2` true, verdict FAIL for the request "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause." The row is disclosed in the phase 014 goal log and implementation summary, so it is a known limitation rather than a hidden defect; it is recorded here because the parent goal's completion criterion "One real browser request per mode returns mcp-browser-use from the advisor" is existential and is satisfied by other rows, which leaves this miss with no tracked owner.
   Finding class: correctness
   Scope proof: the row is inside the pre-bound scope list and inside the hub's own benchmark report; the finding is scoped to the observable replay outcome, not to a mechanism this iteration did not establish.
   Affected surface hints: `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv`, the advisor lexical hints for `mcp-browser-use` at `lanes/lexical.ts:34`, and the hub's manual-testing playbook.
   Case: a user pastes a staging-site runtime-error request that names no browser tool and no task-intent verb; the advisor returns nothing, so the hub is unreachable from stage one and only the compiled front door can route it.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` completion criteria vs the tree | The stale-id criterion and the parent-skill-checker criterion both hold on the current tree |
| `checklist_evidence` | partial | `014-fix-deep-review-findings/goal.md:60-70`, `results.csv:1-50` | Phase 014's mechanically checkable criteria pass; the replay criterion is met only under a kind-scoped reading of "original, paraphrase and out-of-domain" |

## Integration Evidence

- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` run against `.skilled/skills/mcp-browser-use` printed `OK: parent-skill-check — all hard invariants passed, 0 warnings` and named the hub as its subject, including `13a-version` and `13b-version` at 1.1.2.0.
- `rg "mcp-tooling/mcp-chrome-devtools|mcp-tooling/mcp-aside-devtools" .skilled --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'` printed no match, and the same two ids are absent from `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md}`.
- `.skilled/skills/mcp-browser-use/mode-registry.json` lists exactly three modes and `.skilled/skills/mcp-tooling/mode-registry.json` lists six.

## Edge Cases

- **Ambiguity resolved, not a finding.** Phase 014's completion criterion reads "the 2026-11-24 two-stage replay ... passes every original, paraphrase and out-of-domain row" and is checked `[x]`, while the replay records 48 PASS and 1 FAIL. The failing row `MBU-PB-04` has `kind=playbook`, which is outside the three kinds the criterion names, so the checked box is accurate under the criterion's literal scope. Recorded so a later iteration does not re-litigate it as a contradiction.
- **Path drift in the goal text.** The phase 014 goal names `parent-skill-check.cjs` without a path; the real entry point is `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, not `.skilled/bin/parent-skill-check.cjs`. Not raised as a finding because the goal does not assert a path.
- **Scope breadth.** The pre-bound scope is 507 files. This iteration read 10 of them at line level and used the packet's own completion criteria to choose them; later iterations carry the remaining coverage.

## Confirmed-Clean Surfaces

- `.skilled/skills/mcp-browser-use/mode-registry.json`: three modes, every `command` null as the contract states, every `grandfatheredFolderMismatch` false, every `advisorRouting.routingClass` `metadata`.
- `.skilled/skills/mcp-browser-use/hub-router.json`: `defaultMode` null, `defaultResourceSemantics` `fallback-only`, and the two discovery classes are unreferenced by `routerSignals`, so a hub-identity-only prompt scores zero modes and defers.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`: the `har` token boost is gone, so a bare `har` no longer anchors the browser hub.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`: `har` is gone from the `mcp-browser-use` category hints, and the `performance trace` lift is now gated on a preceding `chrome` or `browser` word at `fusion.ts:638`.

## Ruled Out

- **The browser hub is still lifted on out-of-domain prompts.** Ruled out for the hub itself: `mcp-browser-use` ends in `use`, which is three characters, so `promptNamesIdNoun` returns false and the anchor cannot fire for it. The residual defect is the same class for other skills, recorded as P1 finding 1.
- **The `har` removal is incomplete.** Ruled out: both the explicit token boost and the lexical category hint were removed in the same change.
- **The mode registry and hub router disagree on mode count.** Ruled out: both carry three modes and the parent-skill checker's `10d-reachability` and `12b-routing-shape` checks pass.

## Next Focus

- Dimension: security
- Focus area: the Bladebro install gate and the Aside capture path, plus the compiled-routing policy card and fence state, against the operator focus on shipped phase work
- Reason: correctness is covered; security is next in risk order and the phase 014 fixes touched an install gate and a shell capture script
- Rotation status: correctness complete, security not started
- Blocked/productive carry-forward: nothing blocked; the advisor scorer surface is productive and may be revisited under security for the trust boundary at the prompt
- Required evidence: file:line citations from the pre-bound scope list

Review verdict: CONDITIONAL
