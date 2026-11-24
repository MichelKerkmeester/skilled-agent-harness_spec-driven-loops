# Iteration 2 - Security

## Dispatcher

Dimension: security. Operator focus: check every REQ against the code or decision that records it. This iteration reads the prompt-to-brief trust boundary that the gate feeds -- the renderer, the subprocess boundary, the degraded CLI path and the child-session downgrade -- and it keeps the REQ sweep open (REQ-038 and REQ-058 are checked here; the rest are iteration 4). No active security finding is raised.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:163` (`sanitizeSkillLabel`), `:189` (`doctorCommandString`), `:207` (`policyWord`), `:227` (`commandLabel`), `:512` (`renderAdvisorBrief` prompt-boundary comment)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:189` (`ownedCommandRecommendation`), `:580` (map over subprocess rows)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283` (`spawn`), `:310` (`child.stdin?.write`), `:383` (`runAdvisorSubprocess`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1490` (`degradedRecommendations`), `:1555` (typed row derivation)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313` (`trackedCommandForOwner`), `:1623` (`asRecord`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:312` (`compiledRouteForRecommendation`), `:363` (`enrichCompiledRoutes`)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:618` (hook renders through the same `renderAdvisorBrief`)

## Findings

### P0 Findings

(none)

### P1 Findings

(none)

### P2 Findings

(none)

## Traceability Checks

- `spec_code` (core): `partial`, carried from iteration 1. REQ-038 and REQ-058 checked this iteration and hold: `trackedCommandForOwner` (`command-attach.ts:313`) rejects a command the tracked table does not name for the row's skill, the CLI reads it where a supplied string reaches the row (`skill-advisor-cli.ts:1558`), and the hook brief maps every subprocess row through the same check (`skill-advisor-brief.ts:580`). The remaining REQs are iteration 4.
- `checklist_evidence` (core): not run this iteration; iteration 5 owns it.

## Integration Evidence

- Claude hook path: `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:618` renders through `renderAdvisorBrief`, so the fallback and the CLI brief pass the same prompt-boundary guard.
- CLI degraded path: `skill-advisor-cli.ts:1490` builds its rows from the child's JSON and strips `command`, `policy`, `ownerSkillId` and `typed` when `trackedCommandForOwner` returns undefined.
- Subprocess boundary: `subprocess.ts:283` spawns with an argv array and no shell; the prompt is written to stdin at `:310`, never into argv.

## Edge Cases

- `subprocess.ts:285` passes `env: process.env` to the Python child. That is the workspace's own environment and the script path is fixed from `workspaceRoot` (`:388`), so no prompt-controlled path or binary reaches the spawn; recorded as a boundary note, not a finding.
- `.skilled/skills/system-skill-advisor/runtime/dist/` is gitignored and outside `review-scope-files.txt`; whether the shipped bundle mirrors this source is verified only by the freshness probe recorded in the closure docs, not by this review.
- `renderAdvisorBrief` was not executed directly (its module graph pulls the native `better-sqlite3` binding under the review runner); the boundary claims rest on the source reads cited above, not on a rendered sample.

## Confirmed-Clean Surfaces

- **Prompt cannot forge a brief line.** `renderAdvisorBrief` is documented and implemented as the prompt-boundary guard (`render.ts:512`): it renders typed advisor output only and ignores free-form reasons, descriptions, stdout/stderr and prompt text. `reason` appears only in a diagnostics object (`render.ts:294`), never in the rendered lines.
- **Labels cannot carry newlines or instructions.** `sanitizeSkillLabel` (`render.ts:163`) refuses a label that folds to more than one line and refuses an instruction-shaped label; `command`, `policy` and `owner` all pass through it (`render.ts:232`).
- **A child-supplied command is vetted twice.** `ownedCommandRecommendation` (`skill-advisor-brief.ts:189`) strips the command, policy and owner from a subprocess row the tracked table does not vouch for, and `degradedRecommendations` (`skill-advisor-cli.ts:1555`) does the same on the CLI path; both call the one `trackedCommandForOwner`.
- **A dispatched child cannot start an ask-policy run.** `policyWord` (`render.ts:207`) replaces the policy word with the parent-named marker for a child session when the policy is `start` or `ask`, or `run` with a mutating class that is not `read-only` (`render.ts:196`), and the offer text is only rendered when the word is exactly `ask` (`render.ts:250`), so the downgrade cannot be bypassed by a command row.
- **Own-key lookups close the prototype surface.** The generated command tables are read with `hasOwnProperty` (`command-attach.ts:1681`, `:1683`) and `Object.hasOwn` (`:314`), so an inherited name such as `constructor` resolves to nothing.
- **Compiled routes are narrowed before use.** `asRecord` (`command-attach.ts:1623`) rejects arrays and non-objects, `enrichCompiledRoutes` requires an own-key command row, and `compiledRouteForRecommendation` passes the prompt to the front door on stdin (`advisor-recommend.ts:337`), never as an argv element.
- **No secret or dynamic-code surface in the reviewed files.** No credential literal, `eval`, `new Function` or shell string appears in `command-attach.ts`, `render.ts`, `subprocess.ts`, `skill-advisor-brief.ts`, `skill-advisor-cli.ts` or `reduce-state.cjs`.
- **The reducer writes only inside its artifact directory.** `reduce-state.cjs` resolves every output from the artifact root it is given; no reviewed file writes to a prompt-controlled path.

## Ruled Out

- "A prompt can inject a line into the brief by carrying a newline and a command": ruled out; the brief is built from typed fields and the label sanitizer refuses multi-line labels (`render.ts:163`).
- "The Python fallback can attach an arbitrary command string": ruled out for REQ-038's cases; an unknown string or another skill's string loses the command, policy, owner and typed marker in both the CLI and the brief path.
- "A `run`-policy doctor can be started from a dispatched child": ruled out; `parentNamedOnly` treats `run` plus a non-`read-only` class as parent-named (`render.ts:196`).
- "The compiled-route subprocess is prompt-injectable through argv": ruled out; the prompt is stdin only and the hub id and surface hint are fixed tokens.

## Next Focus

Dimension: maintainability
Focus area: whether the in-scope documentation still describes the gate as built -- `runtime/lib/README.md`, `feature-catalog/cli-surface/advisor-recommend.md` and `manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md` against `routedLoopMode` and the no-edit exception.
Reason: the ninth and thirteenth rounds changed the routed-mode rule and the no-edit rule; the docs are the next thing a maintainer reads.
Required evidence: a read of each doc sentence against the code path it names, cited at `path:line`.

Review verdict: CONDITIONAL
