# Iteration 014 — Advisor / hooks / relaunch cluster

## Focus

Release-claim audit of four changelogs named by the focus — v4.0.0.1, v4.0.0.6, v4.0.0.9, v4.0.0.10 — checking up to three advisor, hook or relaunch claims each against the current tree with `path:line`. Doctor and git-hook files are another cluster and were skipped. Read-only throughout.

## Actions Taken

1. Read the four changelogs and extracted only in-cluster claims:
   - v4.0.0.1: "The advisor brief is back on Pi. Every prompt carries its skill suggestion again and a recommendation that rotates mid-session reaches you." Also "the question that binds a session to a spec folder now arrives once at your first save".
   - v4.0.0.6: "`advisor_recommend` accepts a `surfaceHint` of 1 to 64 characters and passes it to the compiled route. The OpenCode plugin sends the surface that its workspace markers name, and it sends OpenCode only for a workspace inside this repository's `.skilled` folder. The Claude and Codex hooks send no hint."
   - v4.0.0.9: "every mode alias is lowercase and listed among its router keywords."
   - v4.0.0.10: only git-hook trust (`/dev/null` helper resolution), Commit-Id allocation and `/doctor:sk-code setup`. No advisor, hook-brief or relaunch claim → verified-empty for this cluster.
2. Grepped `surfaceHint` / `surface-hint` across `.skilled`, `.opencode`, `.claude`, `.codex`, `.pi`, `.cursor`, `.devin`, `.dsh` (dist excluded). Hits exist only in the advisor runtime and the OpenCode plugin tree; `.pi/extensions`, `.claude/hooks` and `.codex` have none.
3. Traced the v4.0.0.6 surface path end to end: zod schema, CLI manifest schema, handler argument forwarding, OpenCode plugin wiring, the workspace detector and its hub-root resolver.
4. Ran a read-only node check over every hub's `mode-registry.json` + `hub-router.json` (7 hubs, no writes) to test v4.0.0.9's alias claim. My first pass keyed on `alias` / `id` / `mode` / `name` and reported `aliasesChecked=0 violations=0`; inspection of the registry shape (`workflowMode`, `aliases[]`) showed the check was vacuous, so I re-ran it over the real fields.
5. Inspected the Pi advisor extension's directive-dedup gate.

## Findings

### f-iter014-001 — P2 — drift / AI-user UX — the Pi brief is silently suppressed on a repeat prompt (v4.0.0.1 claim)

v4.0.0.1 says "every prompt carries its skill suggestion again". At HEAD that is no longer literally true. The Pi extension suppresses the **whole** advisor contribution — route line *and* the `Directives:` block — when a contribution is a proven same-content repeat. The comment states the contract plainly: "a proven same-content repeat suppresses that brief", with first turn, changed contribution, resume/compact, unknown sessions and the kill-switch failing open to the full contribution. The switch is the exported `SPECKIT_PI_DIRECTIVE_DEDUP` flag, which defaults to enabled (only `0`/`false`/`off`/`no` disable it).

[SOURCE: .pi/extensions/prompt-advisor.ts:84] [SOURCE: .pi/extensions/prompt-advisor.ts:91]

Severity is P2, not P1: the suppression needs an identical contribution, so it cannot hide a *changed* route. The reason it still matters as a UX finding is that it is invisible — nothing on screen or in the `[advisor-debug]` line says "suppressed as a repeat". An AI user who asks the same question twice, or an operator re-sending an unchanged prompt, reads a missing brief as "the advisor has nothing for this" rather than "this was deduplicated". That is the exact confusion the v4.0.0.1 note was written to end.

Confidence: high on the code path, medium on user-visible effect — the suppression only reaches the screen because Pi renders the whole extension contribution, which I took from the source comment and did not observe live.

Verify: `sed -n '84,95p' .pi/extensions/prompt-advisor.ts` and send one prompt twice with the flag unset.

### f-iter014-002 — P2 — drift — v4.0.0.9's alias claim has no field to be true about, and the natural checker passes vacuously

v4.0.0.9 closes with "every mode alias is lowercase and listed among its router keywords". `mode-registry.json` mode objects carry `workflowMode` (a string) and `aliases` (an array of strings). Across the 7 hubs the check finds 518 values in those two fields and **411 violations** — every one I inspected came from the `aliases` array and looks like a human trigger phrase, not an alias: `"nested goal"`, `"add a goal file"`, `"research loop"`, `"ai council deliberation"`, `"planning council"`. These are multi-word, are not lowercase single tokens, and none appear among `hub-router.json` keyword tokens. The phrase-style values are legitimate trigger phrases; the claim is what does not fit them.

Worse than the false claim is the failure mode. A checker written from the release note keys on `alias`, and **no mode object in any hub has an `alias`, `id`, `mode` or `name` key**. My first script therefore inspected zero aliases across all 7 hubs and printed `aliasesChecked=0 violations=0` — a clean PASS from a run that checked nothing. Any operator or AI user verifying this claim the obvious way gets the same false green.

If the note means `workflowMode` only, it should say so and name the field; the field it *is* named after fails 411 times.

Confidence: high on the registry shape, the 411 count and the zero-key observation — I ran all three. Medium on intent: whether the author meant `workflowMode`, `aliases`, or the router's own keyword list.

Verify: `node -e 'const r=require("./.skilled/skills/sk-doc/mode-registry.json"); console.log(Object.keys((r.modes||[])[0]||{}))'` then repeat over all hubs and compare `workflowMode` + `aliases` against `hub-router.json` tokens.

### f-iter014-003 — P2 — improvement / UX — the surface hint is cached per directory for the life of the plugin process

The OpenCode plugin sends its surface hint as `detectWorkspaceSurface(projectDir)`. That function memoizes into `workspaceSurfaceCache` before returning, and reads the cache first.

[SOURCE: .opencode/plugins/system-skill-advisor.js:841] [SOURCE: .opencode/plugins/system-skill-advisor.js:856]

No invalidation is visible in the function body I read. The consequence bites exactly where v4.0.0.10 aimed its work: that release taught users to *add a surface* (`/create:skill-parent update --surfaces`) and to remove an example. A user who follows the guide mid-session creates or deletes a surface marker, and the running plugin keeps serving the surface it detected at first call, so the hint stays wrong until the process restarts — with no message saying a restart is needed.

Confidence: medium. The cache read/write pair is directly observed; "no invalidation anywhere else" is a scoped claim about this function, not a repo-wide sweep for `workspaceSurfaceCache`.

Verify: `rg -n "workspaceSurfaceCache" .opencode/plugins/system-skill-advisor.js` — every hit outside this function would falsify the finding.

### Claims that held

- **v4.0.0.6 `surfaceHint` — verified end to end.** The schema bounds it 1..64 in three places (`z.string().min(1).max(64).optional()` plus both CLI manifests' `minLength: 1, maxLength: 64`); the handler forwards it as `--surface-hint`; the OpenCode plugin sends it from `detectWorkspaceSurface(projectDir)`. The "OpenCode only inside `.skilled`" half is exact: the fallback surface is selected only when `insideHub`, and `insideHub` is computed against `resolveHubSkilledRoot()`, which resolves to `<repo>/.skilled`.
  [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:290] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:385] [SOURCE: .opencode/plugins/system-skill-advisor.js:1252] [SOURCE: .opencode/plugins/system-skill-advisor.js:846] [SOURCE: .opencode/plugins/system-skill-advisor.js:719]
- **"The Claude and Codex hooks send no hint" — verified by absence**: no `surfaceHint` occurrence anywhere under `.claude/` or `.codex/`. The note omits that the Pi extension also sends none, even though Pi routes through the same shared advisor hook module — a one-word doc gap, not a defect.
- **v4.0.0.10 — verified-empty for this cluster**: its hook claims are all git-hook trust and Commit-Id, which belong to the skipped cluster.

## Questions Answered

None in full. The v4.0.0.1 "rotates mid-session" half of the advisor-brief claim was not resolved: no rotation logic exists in `prompt-advisor.ts`, so rotation must live in the advisor CLI's own selection, which this iteration did not open.

Partial on the UX question: f-iter014-001 and f-iter014-003 are two concrete blocks on *reading the brief* and on *using a surface you just added*. History recovery was not reached.

## Questions Remaining

- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon lease/race remain unexercised. **Nine** iterations carried; still the largest untested claim in the run.
- Where does "a recommendation that rotates mid-session" actually rotate? Not in `prompt-advisor.ts`.
- Does `SPECKIT_PI_DIRECTIVE_DEDUP` appear in `hook-flags.env` / `hook-flags.env.example`, and does any doc describe the suppression? Unchecked.
- **`hook-flags.sh` vs `hook-flags.cjs` one-shot differential** — still unrun.
- **Advisor follow-ups from generation 1** — sk-doc's `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Untouched, fourteenth iteration; oldest open item.
- Carried unchanged: which layer drops the advisor redirect (CLI handler vs shim); the hook git-call time limit; which non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction.

## Next Focus

Read `v4.0.0.14`, `v4.0.0.15`, `v4.0.0.16` and `v4.0.1.0` for advisor, hook and relaunch claims and check up to three of them against the tree with `path:line`. Settle the rotation question by grepping the advisor CLI's selection path for the tie-break that could rotate. Do not re-open v4.0.0.6 `surfaceHint` (verified) or v4.0.0.10 git-hook trust (other cluster). Read-only.
