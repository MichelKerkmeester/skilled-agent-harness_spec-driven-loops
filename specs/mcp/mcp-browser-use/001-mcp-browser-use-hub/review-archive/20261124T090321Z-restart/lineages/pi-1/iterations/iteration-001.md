# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `pi-1`), target agent `@deep-review`, resolved route `Resolved route: mode=review target_agent=deep-review`.
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder), 507 scope files from `review-scope-files.txt`.
- Dimension: correctness.
- Operator focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.
- Focus addressed in this iteration: the two commits phase 014 shipped (`ec3ed74ad` hub fixes, `dbea9ff4a` advisor scorer) were read against 014's goal criteria, its acceptance rows, and the code that implements them.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332-335,387-404,1228-1231`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:191-194`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:66-95`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:43-46`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:121-145`
- `.skilled/skills/system-skill-advisor/changelog/v2.0.2.0.md:20-26`
- `.skilled/skills/mcp-browser-use/mode-registry.json:1-140`
- `.skilled/skills/mcp-browser-use/hub-router.json:1-190`
- `.skilled/skills/mcp-browser-use/leaf-manifest.json:1-30`
- `.skilled/skills/mcp-browser-use/leaf-scopes.json:1-10`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:34-120`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:128-190`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:104-120`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh` (byte-identical to `.skilled/skills/mcp-code-mode/scripts/_utils.sh`)
- `.skilled/bin/tests/mcp-installers.test.cjs:1-80`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:20`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/{goal.md,acceptance-criteria.md,implementation-summary.md,decision-record.md}`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/{goal.md,spec.md}`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The id-noun anchor accepts ordinary English nouns, so one shared word still reaches the 0.82 floor** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332` -- `promptNamesIdNoun` returns true for any final id segment of four or more characters that appears at a phrase boundary. Skill ids whose final segment is an ordinary word therefore count as "named" by prompts that name nothing: `mcp-code-mode` on "mode", `sk-code` on "code", `sk-design` on "design", `sk-prompt` on "prompt", `system-deep-loop` on "loop", `command-speckit-save` on "save", `mcp-tooling` on "tooling". The guard's own comment says short segments are excluded "because they occur in ordinary prompts that name nothing", and the shipped changelog promises "A skill reached through one or two shared words keeps the confidence it earned" (`.skilled/skills/system-skill-advisor/changelog/v2.0.2.0.md:22`); a four-letter common noun is the same shared word with a longer spelling. The lexical lane includes `skill.id.replace(/-/g, ' ')` in its candidate text (`lanes/lexical.ts:69`), so a prompt containing "mode" already scores `mcp-code-mode` above zero, and `scoreTokenOverlap` divides by `max(3, tokenCount)` (`text.ts:144`), so one hit on a short prompt yields 0.33, above the 0.18 direct-score floor. The shipped replay shows the class is reachable in production: MBU-N-04, "write a lighthouse keeper short story", recommends `sk-doc` at exactly the 0.82 floor (`benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:20`).
   Finding class: `input_boundary`
   Scope proof: the anchor is computed for every routable skill in `scoreAdvisorPrompt` (`fusion.ts:1228-1231`) and gates the floor branch at `fusion.ts:387-404`; no stoplist narrows it beyond length.
   Affected surface hints: `.skilled/bin/skill-advisor.cjs advisor_recommend` output confidence; hub routing for every hub whose id noun is a common word; the advisor ratchet corpora.
   Case: a short request that uses one of these words in its ordinary sense, such as "switch the mode of this config" or "save the file first", satisfies `hasNamedAnchor` for `mcp-code-mode` or `command-speckit-save`, and with task intent present the candidate is reported at the 0.82 floor it did not earn.

```json
{
  "type": "correctness",
  "claim": "The task-intent floor's fourth anchor, the id noun, treats ordinary four-letter English words as evidence that the prompt names the skill, so the floor still lifts unrelated skills on one shared word.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:390",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:69",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:144",
    ".skilled/skills/system-skill-advisor/changelog/v2.0.2.0.md:22",
    ".skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:20"
  ],
  "counterevidenceSought": "The operator approved the four-signal anchor shape (014 decision-record Q001/Q004), and the accuracy ratchet held after the change (161/196 full, 49/63 holdout), so no measured row regressed. The floor also requires task intent and a minimum direct score or live-normalized share, which a prompt about a config mode may not reach.",
  "alternativeExplanation": "The corpus may contain no prompt whose only anchor is a common noun, so measured accuracy is unchanged; the impact would then be limited to unmeasured free-text prompts rather than production regressions.",
  "finalSeverity": "P1",
  "confidence": 0.7,
  "downgradeTrigger": "Drop to P2 if the operator confirms ordinary-noun anchors are an accepted trade, or if an in-process replay of five such prompts shows the floor never fires because task intent or the direct-score gate is not met."
}
```

### P2 Findings

1. **AC-002's closure evidence overstates what its own `rg` prints** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:103` -- The row and the closure statement say every `npx -y bladebro` hit "names `bladebro@4.8.2` and the operator yes". The search prints a fourth line, `.skilled/skills/mcp-browser-use/mcp-bladebro/changelog/v1.2.1.0.md:21`, which records the removed offer ("The lane rule no longer offers `npx -y bladebro mcp` when the binary is missing") and names neither the pin nor the operator yes. The offer is genuinely gone, so the criterion holds in intent while the evidence sentence does not hold as written.
   Finding class: `evidence_integrity`
   Scope proof: the AC row's verification command names the whole Bladebro packet, which includes `changelog/`; only one line in that scope lacks both qualifiers.
   Affected surface hints: 014 `acceptance-criteria.md` closure statement; the parent goal criterion that reads the same search.
   Case: a reader re-runs the recorded `rg -n 'npx -y bladebro'` command and finds a hit the row says cannot exist.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | 014 goal criteria 1 and 3 hold by direct inspection: the two `_utils.sh` copies are byte-identical and the parity test asserts it (`mcp-installers.test.cjs:53-62`), and no live Chrome DevTools file names `browser-debugger-cli@alpha` while every install line pins `@0.6.10`. Criterion 2 holds in intent but not literally (P2-001). |
| `checklist_evidence` | notApplicable this iteration | Checklist rows are audited in the traceability iteration; this pass read the acceptance rows only as correctness claims. |

## Integration Evidence

- Compiled serving surface: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:34-120` lists `mcp-browser-use` in `DEFAULT_ON_HUBS` and requires the activation manifest's `servingAuthority: compiled` plus a matching `effectivePolicyHash`; `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1` carries `servingAuthority: compiled` with generation 1, and the replay report records the same policy hash `be9b1fe7`.
- Hub routing surface: `.skilled/skills/mcp-browser-use/hub-router.json` declares `defaultMode: null` and a defer outcome for discovery-only vocabulary, and `mode-registry.json` lists exactly the three modes the parent goal names.
- Advisor surface: the scorer change is live in source (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`), and the shipped changelog records version 2.0.2.0.

## Edge Cases

- A prompt that names a skill by its full id (`mcp-code-mode`) is not affected; the finding is about the bare noun path.
- MBU-N-04's 0.82 `sk-doc` recommendation may come from the lexical-anchor branch or the direct-score floor rather than the noun path; it is cited as evidence that the floor value is reachable on an out-of-domain prompt, not as proof that the noun path fired.
- The 014 record notes the fix was measured only on the advisor corpora; no free-text replay of common-noun prompts exists, so the P1's impact is bounded by measurement, not by reach.

## Confirmed-Clean Surfaces

- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh` and `.skilled/skills/mcp-code-mode/scripts/_utils.sh` are identical; the parity test fails loudly on a missing helper.
- `install.sh` installs with `--ignore-scripts`, verifies `bin.js`, `binary.cjs` and the native binary before the first `--version` call, and removes the install on a mismatch (`.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:148-175`).
- `doctor.sh` derives the version from `package.json` instead of executing the installed code before the digest check (`.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:104-120`).
- The hub registry lists three modes and `mcp-tooling` keeps its own registry; the six-mode claim is audited in the traceability iteration.

## Ruled Out

- **"A bare `har` still anchors the hub."** Ruled out: `har` was removed from `TOKEN_BOOSTS` (`lanes/explicit.ts:43-46`) and from the `mcp-browser-use` category hints (`lanes/lexical.ts:30`), and the replay row MBU-T-03 still routes on the hub's own phrase "export a HAR".
- **"The browser read-only lift still accepts a bare performance trace."** Ruled out: `readOnlyRouteAllowed` now requires `chrome performance trace` or `browser performance trace` (`fusion.ts:635-641`).
- **"The 014 hub commit broke serving authority."** Ruled out: the activation manifest and the resolver's policy-hash binding agree with the replay's recorded policy.

## Next Focus

- Dimension: security
- Focus area: trust boundaries in the hub's routing and install surfaces, including prompt-injection exposure in the packet's own docs, path handling in the Aside/Bladebro scripts, and the `.utcp_config.json` manuals.
- Reason: correctness is swept; the hub ships scripts and MCP wiring where inputs cross a trust boundary.
- Rotation status: correctness complete, security next.
- Blocked/productive carry-forward: productive — direct source reads with exact line citations found a real anchor defect; keep that method.
- Required evidence: exact `file:line` for every finding, plus the packet surfaces each one reaches.

Review verdict: CONDITIONAL
