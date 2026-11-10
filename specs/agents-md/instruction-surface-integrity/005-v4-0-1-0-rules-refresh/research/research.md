---
title: "Research: does v4.0.1.0 mean AGENTS.md or the repo rules need updating"
description: "Five-iteration deep-research synthesis. One edit is worth making: name ROUTER.md in AGENTS.md Gate 2, in an 89-byte form that fits the delivery-prefix budget. Everything else the release shipped is already carried by its owner or is a path the rules never cite."
trigger_phrases:
  - "v4.0.1.0 rules refresh research"
  - "agents md router md gate 2"
importance_tier: "normal"
contextType: "research"
---
# Research: does v4.0.1.0 mean AGENTS.md or the repo rules need updating

<!-- ANCHOR:research-v4-0-1-0-rules-refresh -->

## 1. Run Provenance

| Field | Value |
|-------|-------|
| Command | `/deep:research:auto`, single executor |
| Executor | `cli-pi`, model `deepseek-v4.1-flash-1017` (llmgateway / DevPass route), `--thinking max`, `--offline` |
| Iterations | 5 of 5 (stop policy `max-iterations`; convergence recorded as telemetry only) |
| Session | `2026-11-05T20:09:09Z`, generation 1 |
| Range audited | `v4.0.0.16..v4.0.1.0` (458 commits), the range `.skilled/changelog/skilled/v4.0.1.0.md` covers. `v4.0.0.0..v4.0.1.0` spans 3,365 commits across seventeen releases and is not what this release note describes |
| Targets | `AGENTS.md` (302 lines), `REPO RULES.md` (114 lines), the 13 files under `.skilled/repo-rules/` |
| Orchestrator check | Every finding in section 3 was re-read against its cited lines by the orchestrator. Section 4 lists the leaf claims that check overturned |

## 2. Executive Summary

**Answer: one edit is worth making, and nothing else needs to change.**

v4.0.1.0 moved every skill's routing tables out of `SKILL.md` into a sibling `ROUTER.md`. `AGENTS.md` Gate 2 still says "Routing means loading what the router resolves" without naming the file, so it is now vague at exactly the place an agent acts on it. The fix is a three-byte wording change that fits the 16,384-byte delivery prefix `AGENTS.md` now carries.

Everything else checks out. Every path, command, section anchor and relative link that `AGENTS.md`, `REPO RULES.md` and the 13 rule files cite still exists, and the scripts the gates invoke are untouched in the range. Each addition in the release (doctor commands, decision capture, render checks, the doc rewrite guard, conversation playbooks, the frontend surface) is already carried by the skill or command that owns it. No rule became redundant with a new gate.

## 3. Findings, ranked by impact

### F1 (P2, confirmed): `AGENTS.md:70` Gate 2 never names `ROUTER.md`

- **Where:** `AGENTS.md:70`, third sentence of the artifact-trigger bullet: "Routing means loading what the router resolves, under the same loading rule as Gate 5." `grep -c ROUTER.md AGENTS.md` returns 0.
- **Cause:** "The intent tables, resource maps and pseudocode that scripts read now sit in a `ROUTER.md` beside each `SKILL.md`, and `SKILL.md` links to it in one line" [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:56]. Strict packaging now fails a skill without one [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60]. Commits `60a82db603` (require a sibling ROUTER.md for every skill and mode) and `ca10a236d2` (move every packet and standalone router into its ROUTER.md). The repo-rules layer absorbed the move [SOURCE: .skilled/repo-rules/skill-hub-routing.md:61] in `6a3ecd37f5`. The only `AGENTS.md` commit in the range is `e0fb2624dd` (section manifest and repository block).
- **Impact:** an agent that follows Gate 2 literally loads `SKILL.md` and stops, while the release shrank `SKILL.md` by moving the router out of it.
- **Proposed one-line edit (`AGENTS.md:70`):** replace `Routing means loading what the router resolves, under the same loading rule as Gate 5.` with `Routing means loading what its ROUTER.md resolves, under the same loading rule as Gate 5.`
- **Why this wording:** it is 89 bytes against the current 86. `/doctor:agents-md check` row A6 reports "16368 of 16384 bytes to the last anchor", so +3 bytes leaves 13 bytes of headroom. Iteration 1's longer wording (141 to 150 bytes) and the "skill's sibling ROUTER.md" form (105 bytes, +19) both push the last pinned anchor past the prefix, and A6 would turn FINDING. Every first-party skill root has a sibling `ROUTER.md`. The three `SKILL.md` roots without one are vendored under `node_modules/playwright-core` (iteration 4).
- **Caveat (inferred):** `AGENTS.md`'s shipped sections are now tracked by base digests in `.skilled/commands/doctor/assets/agents-md-manifest.json`. A hand edit to the Gate 2 section shows as `edited` in rows A4 and A9 until the manifest records the new body. Confirm that by running `/doctor:agents-md check` after the edit, and land the manifest update in the same change.

### F2 (P3, confirmed, no edit): no citation in the rule layer is stale

- `AGENTS.md`: 20 filesystem probes and 11 section-anchor probes all resolve (iteration 1). The four retirements (`sk-vision` / `/vision`, `mcp-magicpath`, `sk-design-fundamentals`) and the removed `.skilled/release` appear nowhere in `AGENTS.md`, `REPO RULES.md` or the 13 rule files (iteration 1).
- `REPO RULES.md` and the 13 rule files: 0 broken relative links, 23 of 23 cross-file `§N` citations resolve, every `AGENTS.md` section a rule cites exists, and the `parent-skills-nested-packets.md` §1, §2 and §7 references hold. 13 trigger rows map to 13 index rows and 13 real files (iteration 2).
- Gate scripts: `lookup-trigger-index.mjs`, `.skilled/bin/skill-advisor.cjs`, `gate-3-classifier.ts`, `validate.sh` and `recommend-level.sh` have 0 commits in the range, and the orchestrator reran the count. `goal.cjs` lives at `.skilled/hooks/goal/bin/goal.cjs`, with 0 commits. So the flags and output lines the gates quote (`--json --scoring-only`, `advisor_recommend ... --format json`, `RESULT: PASSED`, `packet_budget=ok`) are unchanged.
- `generate-context.ts` changed in two commits (`23b4f3d2e7` decision capture, `6f42c7b169` project-root resolution). `AGENTS.md:147-151` delegates save composition to `save-workflow.md`, which now documents decision capture [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:261], so the delegation stays true.
- `communication-handoff.md:155` describes the Codex `default_mode_request_user_input` feature. The range's `.codex/config.toml` change (`fa2f8321f8`) implements that sentence; it does not make it stale.

### F3 (P3, confirmed, no edit): every v4.0.1.0 addition is already carried by its owner

| Addition | Owner that carries it | Why no rule |
|---|---|---|
| Decision capture of operator answers | `save-workflow.md:261-277`, `/speckit:save` | `AGENTS.md`'s MEMORY SAVE RULE already delegates to it |
| Render checks, doc rewrite guard | `sk-doc` ROUTER `RENDER_LEDGER` intent [SOURCE: .skilled/skills/sk-doc/ROUTER.md:174] | Gate 2 already sends every first `.md` write through `sk-doc`; restating it would break "Go to the owner rather than a summary here" |
| Conversation playbook scenarios | `sk-doc` ROUTER `playbook-conversation` intent [SOURCE: .skilled/skills/sk-doc/ROUTER.md:103] | Same route |
| `/doctor:sk-skill`, `/doctor:install`, `/doctor:symlink`, `/doctor:agents-md` | `.skilled/commands/doctor/*.md`, mirrored under `.opencode/commands/doctor/` | `AGENTS.md:289` delegates command inventories to the runtime; existing `REPO RULES.md` rows (install at line 44, diagnose at line 45) already fire on these actions |
| `sk-code` web frontend surface | `sk-code` ROUTER bundles `sk-code-frontend` [SOURCE: .skilled/skills/sk-code/ROUTER.md:153] | Gate 2's code-write trigger already routes through `sk-code` |
| Worker-session nudge removal | spec-kit hooks | No rule mentions a nudge, so there is nothing to delete |

### F4 (P3, confirmed, no edit): nothing became redundant with a new gate

- `skill-hub-routing.md` against `parent-skill-check.cjs` checks `12a-router-contract` and `12b-routing-shape` (codes `RS-002`, `RS-004`, `RS-005`) [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1795] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:2233]: the checks prove shape. The rule's subject is reachability, which no check tests, and `skill-hub-routing.md:78` ("asserts only presence, never reachability") stays accurate. Iteration 2 first proposed adding the check codes to line 78. Iteration 4 withdrew that, because `REPO RULES.md` says this rule keeps mechanics in the skills [SOURCE: REPO RULES.md:96-100]. The real gap, a missing routing-shape row in `parent-skills-nested-packets.md` §7's surface table, sits in an `sk-doc` reference outside this packet's targets.
- Comment hygiene: the pre-commit hook can be bypassed and reads only staged code, while `AGENTS.md:32-34` binds every code write, so the rule is not redundant.

### F5 (P3, inferred, observation only): the delivery-prefix budget is stated in no rule

`/doctor:agents-md` measures `AGENTS.md` against `prefix_bytes: 16384` and `max_bytes: 32768` [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:13]. The canary in `check-rule-copies.js` and row A6 both enforce it, and today's headroom is 16 bytes. No rule file names the budget. A gate already catches an overrun, so this is an observation rather than a required edit: anyone editing `AGENTS.md` above the last anchor should run `/doctor:agents-md check` before and after.

## 4. Leaf claims the orchestrator overturned

- **Iteration 3 (`f-iter003-001`) said a line containing "delivery prefix" in the repository block silences A6, and proposed adding a note line to `AGENTS.md:301`.** This is false. The `own` array at `.skilled/commands/doctor/scripts/agents-md-check.cjs:461-463` is filtered from the canary's output (lines naming `AGENTS.md` that start with `MISSING:` or `BLOCKED:`), never from the document. The guard at line 480 only de-duplicates. The orchestrator re-read lines 445-485, and iteration 4 confirmed it independently. Both the "escape hatch" warning and the `:301` edit are dropped.
- **Iteration 3 said no wording that names `ROUTER.md` fits the budget.** It never measured the short form. The 89-byte form fits (F1).
- **Iteration 5 cited `runtime/cli/spec/generate-context.js` and `runtime/cli/spec/goal.cjs` as unchanged.** Neither path exists, so a zero commit count on them proves nothing. The real `goal.cjs` (`.skilled/hooks/goal/bin/goal.cjs`) has 0 commits in the range. The real `generate-context.ts` has 2 commits, and both are covered in F2.

## 5. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Add `AGENTS.md` rules for decision capture, render checks or the doc rewrite guard | Owners already carry them; a restatement duplicates an owner | `save-workflow.md:261`, `sk-doc/ROUTER.md:174` | 1 |
| Append the `12a`/`12b`/`RS-*` codes to `skill-hub-routing.md:78` | Mechanics belong in the skills per `REPO RULES.md`; the line stays accurate | `REPO RULES.md:96-100`, `skill-hub-routing.md:78` | 2, 4 |
| Add a "delivery prefix" acknowledgment note at `AGENTS.md:301` | Based on a misread of `agents-md-check.cjs`; no acknowledgment path exists | `agents-md-check.cjs:461-480` | 3, 4 |
| Iteration 1's 141-byte `:70` wording | Pushes the last anchor 39 bytes past the prefix | A6 measurement | 3, 4 |
| Add `REPO RULES.md` rows for the new doctor commands | The Load column names rule files only; existing rows already fire | `REPO RULES.md:5-6,44-45` | 4 |
| Delete rules that mention retired surfaces | No rule mentions them | grep across all targets | 1 |
| Treat `CLAUDE.md` as a mirror to update | No root `CLAUDE.md` exists; `/doctor:agents-md embed` folds and removes it by default | `.skilled/commands/doctor/agents-md.md` | 3 |
| Fix the §4-before-§3 section order | It predates the range (same at `v4.0.0.16`), and the manifest now owns the order | `git show v4.0.0.16:AGENTS.md` | 3 |

## 6. Divergence Map

- Saturated directions: none recorded. Divergent mode was not active (`convergenceMode: default`).
- Pivots taken: none.
- Remaining frontier: the `parent-skills-nested-packets.md` §7 surface table (no routing-shape row) is an `sk-doc` gap outside this packet's targets.

## 7. Open Questions

- Does a shipped-section edit in the source repository need a matching `agents-md-manifest.json` base-digest update in the same commit? Running `/doctor:agents-md check` after applying F1 answers it.
- Should `parent-skills-nested-packets.md` §7 gain a routing-shape row? That is for the `sk-doc` owner, not for this packet.

## 8. Run Notes

- Write containment: iteration 1 flagged `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`, and iteration 2 flagged 36 `ROUTER.md` files plus `sk-create-skill/assets/skill/skill-router-template.md` (a version bump and one prose line each, 72+/72-). None of these paths appears in the leaf's output, and a concurrent `sk-doc` session was editing `sk-create-skill` and the `sk-doc` hub during the run. Who wrote them is UNKNOWN, but the pattern matches that session. Nothing was reverted or staged.
- The 13-byte headroom after F1 is thin. Any later edit above the last anchor must re-measure.

## 9. References

- `.skilled/changelog/skilled/v4.0.1.0.md`
- `research/iterations/iteration-001.md` through `iteration-005.md`
- `research/resource-map.md`
- `.skilled/commands/doctor/agents-md.md`, `.skilled/commands/doctor/assets/agents-md-manifest.json`, `.skilled/commands/doctor/scripts/agents-md-check.cjs`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs`

## 10. Convergence Report

- Stop reason: maxIterationsReached (stop policy max-iterations; convergence was telemetry only)
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Newinfo ratios by iteration: 0.75, 0.77, 0.72, 0.7, 0.8
- Last 3 iteration summaries: run 3 (0.72); run 4 (0.7); run 5 (0.8)
- Convergence threshold: 0.05
- Graph convergence at the final snapshot: STOP_BLOCKED (source_diversity_guard, evidence_depth_guard, unverified_claims), score 0.188. The run stopped at its iteration cap, not on convergence
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

<!-- /ANCHOR:research-v4-0-1-0-rules-refresh -->
