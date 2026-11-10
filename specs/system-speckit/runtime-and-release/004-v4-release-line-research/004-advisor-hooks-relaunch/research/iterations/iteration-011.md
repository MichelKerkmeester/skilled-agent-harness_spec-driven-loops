# Iteration 11 — v4.0.0.5 / .10 / .11 / .12 cluster claims

## Focus

Read the four unread release notes (`.skilled/changelog/skilled/v4.0.0.5.md`, `.10.md`, `.11.md`, `.12.md`) and check advisor, hook and relaunch claims against the current tree. v4.0.0.12 is the only one of the four with a substantial advisor cluster (doctor-command routing), so it received the behavioural budget; the other three received a claim inventory.

## Actions Taken

1. Read all four release notes end to end. Inventory of cluster claims per release:
   - **v4.0.0.5** — exactly one cluster claim: the pre-commit trigger-phrase check (template-default and editor-fallback classes block, `SPECKIT_SKIP_PHRASE_LINT=1` bypass named, fail-open when node/linter/git is missing, all 18 template kinds). Everything else is spec-repair, upgrade-undo and anchor validation, outside this lineage's cluster.
   - **v4.0.0.10** — two hook claims and one extension claim: untrusted repositories resolve their hook helpers under `/dev/null`; `prepare-commit-msg` falls back to the allocator shipped beside the hooks and `commit-msg`/`pre-push` refuse an id-less commit; the Pi Fast Mode extension is on by default and `/fast off` survives a restart.
   - **v4.0.0.11** — one hook claim: `/doctor:git setup` runs eleven read-only checks across seven AI tools, counts a tool hook only when the script it runs exists, and never runs code from the repository it inspects.
   - **v4.0.0.12** — ten advisor claims (doctor routing, ordering, typed-command precedence, short-prompt matching, setup hint, offline rebuild, `export default plugin;` resolution, drift-guard skips, doctor steps).
   **No release in this batch is cluster-claim-empty**, so no "verified-empty" mark was earned: three of the four carry hook claims I did not open this iteration.
2. Probed the v4.0.0.12 doctor routing live: `"help me set up skilled"`, `"check my environment variables"`, `"list"`, `"allowlist"`, `"run /doctor:setup"`, `"please run /doctor:setup now"`, and `"sk-doc create a new skill and then check my environment variables"` through `.skilled/bin/skill-advisor.cjs advisor_recommend`.
3. Followed the ordering claim into source: `lib/scorer/fusion.ts` and `handlers/advisor-recommend.ts`.

## Findings

### f-iter011-001 — P1 — bug + drift — the doctor-bridge ordering contract is contradicted on the live `advisor_recommend` surface

v4.0.0.12 states, in its own words: "A matching skill stays first. When a skill fits, it keeps first place and the doctor command shows as a second line, even when three skills match." The source encodes that rule. `keepPassingSkillsAboveDoctorBridges` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:898] computes the passing-skill count, then inserts the passing doctor bridges after `min(2, passingSkillCount)` passing skills, and `applyDoctorHelperHandoff` applies it as its last step [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1028].

Live, on the CLI surface, the opposite happens. For `"sk-doc create a new skill and then check my environment variables"` the response is:

```
command-doctor-env   score 0.540     conf 0.82    unc 0.16
system-spec-kit      score 0.759606  conf 0.9283  unc 0.16
sk-doc               score 0.731278  conf 0.9131  unc 0.12
```

The same response prints `effectiveThresholds: {confidenceThreshold: 0.8, uncertaintyThreshold: 0.35}`, so both skills clear both thresholds and both are therefore "passing skills" under the function's own predicate. The doctor bridge should sit at index 2; it sits at index 0, above a skill scoring 0.22 higher. The unit contract that the release note restates also asserts the correct order — `tests/scorer/doctor-ordering.vitest.ts` contains the case "moves a doctor bridge below the passing skill" — so this is not a disagreement about intent; it is a live/source split.

This also promotes the iteration-1 observation (sk-doc ranked above a higher-scoring `system-spec-kit`) from "cannot establish intent" to a contract-backed ordering defect: the release note now supplies the intent that output order alone could not.

What I cannot yet name is the layer, and I record that honestly rather than guess. The handler imports and calls the scorer [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:17], the call is at [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:561], and the handoff is wired at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1368] — so inside source the chain is complete and the divergence must come from whichever process answered or from `passes_threshold` being false for those two skills in that run. The response cannot distinguish those two cases (see f-iter011-003). The response also reports `trustState.generation: 2454` and `freshness: live`, i.e. it claims it is current, which is what makes a stale-build explanation uncomfortable rather than comfortable.

- Type: bug (live behaviour), drift (release note vs code vs served output)
- Introduced by: v4.0.0.12
- Confidence: high on the observation, medium on the mechanism
- Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"sk-doc create a new skill and then check my environment variables"}' --format json` — first `skillId` must be a skill, not `command-doctor-*`

### f-iter011-002 — P2 — drift/UX — no locateable build artifact answers `advisor_recommend`, so "stale build fails loudly" is unverifiable

v4.0.0.12 promises "A stale advisor build fails with the build command instead of passing quietly". I tried to test the stronger version of that promise — compare the answering build against source — and could not: `.skilled/skills/system-skill-advisor/runtime/dist/lib/scorer/fusion.js` does not exist. The source file is present and current [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:898], so either the build root is elsewhere, or the daemon serves from another layout, or nothing is built at all and the CLI runs TypeScript directly.

Whichever is true, the consequence for an operator is the same: when output contradicts source, there is no artifact to diff and no path printed in the response that names where the answering code lives. That removes the only cheap diagnosis for f-iter011-001.

- Type: drift (release note vs observable tree), operator UX
- Introduced by: v4.0.0.12 (the promise), compounded by the layout
- Confidence: medium — absence at one guessed path is not proof of absence everywhere, which is the finding
- Verify: `ls .skilled/skills/system-skill-advisor/runtime/dist/lib/scorer/ 2>&1` and `ls .skilled/skills/system-skill-advisor/runtime/dist | head`

### f-iter011-003 — P2 — improvement/UX — the response omits `passes_threshold`, the one field that makes the ordering claim checkable

`keepPassingSkillsAboveDoctorBridges` decides everything from `recommendation.passes_threshold` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:898], a field that exists on the scorer's recommendation type. The `advisor_recommend` payload exposes `skillId`, `score`, `confidence`, `uncertainty`, `dominantLane`, `status` and, for compiled routes, `compiledRoute` — but never `passes_threshold`.

The effect is that a reviewer who sees a low-scoring bridge above two high-scoring skills cannot tell whether the contract was violated or whether both skills failed a threshold the response hides. Exposing `passes_threshold` (or a `orderingRule` note on the response) would have turned f-iter011-001 from a two-hour read into a one-line check, and would let an operator answer "why is this first?" without reading fusion.

- Type: improvement / AI-user and operator UX
- Introduced by: v4.0.0.12 (same ordering work), pre-existing in the payload shape
- Confidence: high on the absence (observed in two separate responses)
- Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"help me set up skilled"}' --format json | grep -c passes_threshold` → 0

## What Verified Clean

- **Doctor routing fires.** `"help me set up skilled"` → `command-doctor-setup` (0.7 / 0.8962), `"check my environment variables"` → `command-doctor-env` (0.7) with `system-spec-kit` second (0.668667). Matches the release note.
- **Typed-command precedence fires.** `"run /doctor:setup"` and `"please run /doctor:setup now"` both put `command-doctor-setup` first (0.6496), above `mcp-code-mode` (0.1165). Matches "asking to run a command puts it first".
- **Short-word boundary.** `"list"` and `"allowlist"` both return zero recommendations, so the note's "a short word no longer matches inside a longer one" cannot be falsified from output — but it also cannot be confirmed, because `"allowlist"` reaches nothing at all. Recorded as desirable-but-unproven, not a finding.
- **The helper handoff is wired, not dead.** `applyDoctorHelperHandoff` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:980] is called from the scoring pipeline [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1368]. This answers the iteration-8 worry that the handoff might never run.

## Questions Answered

None of the strategy's key questions was answered exactly this iteration, so the record carries an empty `answeredQuestions` array. The transport question, the UX/extension question and the generation-1 advisor follow-ups all remain open.

## Questions Remaining

- **Which process answered?** The response reports `trustState.generation` and `freshness: live`, but no build path. Locate the build root, then re-run the f-iter011-001 probe against the built artifact and against `tsx`-style direct source execution — the differential names the layer and closes f-iter011-001's mechanism half.
- **Was `passes_threshold` true in that run?** Cheapest closure: temporarily surface it, or run the fusion function in a vitest harness with the same prompt. This is now the single fact that decides whether f-iter011-001 is a bug or a documented predicate doing something surprising.
- **v4.0.0.10 hook claims** — untrusted repositories resolving helpers under `/dev/null`, and the Commit-Id allocator fallback. Both are security-shaped and unopened; the `/dev/null` claim in particular deserves a read against the hook helper resolver.
- **v4.0.0.5 pre-commit phrase check** — fail-open when node, the linter, its YAML library or git is missing. A gate that silently passes on a missing dependency is worth one read.
- **v4.0.0.11 `/doctor:git setup`** — eleven checks, seven tools, and the claim that a hook counts only when the script it runs exists.
- Carried, unchanged: advisor transport degraded path and the shared-daemon lease/race (**nine** iterations now); the hook git-call time limit; which non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction; `hook-flags.sh` vs `hook-flags.cjs` differential; history recovery as an operator path; the advisor brief reader path.
- **Generation-1 advisor follow-ups** — the sk-doc `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Eleventh iteration untouched.

## Next Focus

Locate the build root behind `advisor_recommend` and run the f-iter011-001 probe against both the built artifact and the source path — that single differential converts this iteration's strongest finding from "live differs from source" into "layer X differs from source". Then open the v4.0.0.10 hook-trust claim, which is the highest-severity unread claim in this batch.

## SCOPE VIOLATIONS

None. All reads were against the researched tree; the only writes were this narrative, the delta file and the append-gateway record.
