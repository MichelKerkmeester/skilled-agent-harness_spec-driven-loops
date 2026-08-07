---
title: "Research: Goal-OpenCode-Plugin Documentation Staleness Audit (Post Phases 010-014)"
description: "10-iteration deep-research audit of related-skill docs, READMEs, ENV_REFERENCE.md, and stale-claim sweeps for the /goal OpenCode plugin after the 010-014 remediation and the goal_opencode.md filename correction."
trigger_phrases:
  - "goal plugin documentation staleness"
  - "goal opencode plugin doc audit"
  - "mk-goal.js documentation gaps"
  - "goal_opencode.md filename references"
importance_tier: important
contextType: research
---

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-output | v1.0 -->

# Research: Goal-OpenCode-Plugin Documentation Staleness Audit (Post Phases 010-014)

## 1. Executive Summary

`.opencode/commands/goal_opencode.md` is confirmed as the live command filename (`.opencode/commands/goal.md` does not exist). Across 10 forced iterations (`minIterations = maxIterations = 10`, per explicit operator instruction to not converge early), the audit found the primary remediation code (`.opencode/plugins/mk-goal.js`) is correctly wired for `usage_limited`, `store_health`, `mutation=`, and the new `MK_GOAL_STATE_*` cleanup/archive behavior, but **documentation coverage of that new surface is incomplete in several places that were NOT already updated this session**, and — notably — **one of the already-updated docs (`references/hooks/goal_plugin.md`) is itself still missing the three new env vars and the new status/mutation output fields**, despite being on the "already-updated" exclusion list. No live doc anywhere in the repo still claims `usage_limited` is dead/unimplemented, and no live doc claims goal-state is never cleaned up — both of those specific stale-claim classes are fully resolved.

**Highest-priority open items (P1):**
1. `ENV_REFERENCE.md` omits all three new env vars.
2. `.opencode/plugins/README.md` is too thin to be the "plugin contract" the root README delegates to it as.
3. `references/hooks/goal_plugin.md` (already updated this session) still lacks the 3 env vars, `store_health`, and `mutation=` coverage.
4. `system-skill-advisor/README.md:85` contradicts its own updated feature catalog on live OpenCode-tool verification status.

## 2. Research Charter

**Topic:** Investigate whether related skill documentation (`SKILL.md`, `references/`, `assets/`) and README files (skill READMEs, code READMEs) across the repo describe now-stale behavior for the `/goal` OpenCode plugin, following the phases 010-014 remediation and the `goal_opencode.md` filename correction.

**In scope:**
- Confirming the live command filename at execution time.
- Other skills' own `SKILL.md`/`references/`/`assets/` mentions of the plugin.
- Repo-level and skill-level `README.md` staleness on env vars, status fields, command filename.
- `ENV_REFERENCE.md` completeness for the 3 new env vars.
- Any doc still claiming `usage_limited` is dead/unimplemented, or goal-state is never cleaned up.
- Re-verifying (not re-flagging as "not yet updated") the docs the operator listed as already updated this session.

**Explicitly out of scope (non-goals):**
- Modifying `.opencode/plugins/mk-goal.js` or any implementation code.
- Re-litigating phase 009 (owned by a separate in-flight session).
- Fixing findings — this packet reports; a follow-up implementation pass applies fixes.

**Anti-convergence directive honored:** the operator explicitly required exactly 10 iterations (`minIterations = maxIterations = 10` in `deep-research-config.json`) and instructed the loop not to stop early even if signal looked exhausted before iteration 10 — instead rotate to an unexamined doc class. All 10 iterations ran to completion; iterations 8-10 rotated into README-contract-routing, manual-playbook validation coverage, and the `feature_catalog`/`manual_testing_playbook`/`constitutional/` sweep specifically to satisfy this.

## 3. Methodology

- **Executor:** `cli-opencode`, model `openai/gpt-5.5-fast`, reasoning effort `high` (`--variant high`), `--format json --dangerously-skip-permissions --pure --dir <repo-root>`, one iteration per dispatch.
- Each iteration read `deep-research-strategy.md` + `deep-research-state.jsonl` first, then ran targeted `Glob`/`Grep` sweeps plus direct reads, then wrote three required artifacts (iteration narrative, canonical JSONL record, delta file) validated by the real `validateIterationOutputs` post-dispatch gate (all 10 iterations passed cleanly, 0 retries).
- A reducer pass (`reduce-state.cjs`) ran after every iteration to refresh the findings registry, dashboard, and strategy's machine-owned sections (Key Questions / Next Focus / Carried-Forward Open Questions).
- A coverage-graph upsert ran after every iteration where the leaf emitted `graphEvents` (9 of 10 iterations produced graph nodes/edges; iteration 3 was a re-verification pass with no new graph nodes it didn't already have).
- Scope was hardened per-iteration with an explicit BANNED OPERATIONS / ALLOWED WRITE PATHS block (read-mostly audit; no implementation file writes) as a proportionate blast-radius mitigation for the non-interactive `--dangerously-skip-permissions` dispatch.

## 4. Confirmed Facts

| # | Fact | Evidence |
|---|------|----------|
| 1 | `.opencode/commands/goal_opencode.md` is the only live command file matching `.opencode/commands/*goal*.md`. `.opencode/commands/goal.md` does not exist. | Re-confirmed independently in iterations 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 via direct `Glob`. |
| 2 | The user-facing command surface remains `/goal` (the *filename* changed, not the invoked command text). | `.opencode/commands/goal_opencode.md:1-15` (iteration 8 correction of an earlier framing in iteration 5/7). |
| 3 | `mk-goal.js` defines `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS` with defaults 90 days / 30 days / 1 hour. | `.opencode/plugins/mk-goal.js:30-42` (iteration 8/9). |
| 4 | `archiveGoalStateFile()`, `pruneArchive()`, `sweepOrphanedActiveStates()` are wired and used on `session.deleted` / `session.created` lifecycle events. | `.opencode/plugins/mk-goal.js:825-899`, `:1758-1761`, `:1824-1828`. |
| 5 | `recordProviderUsageLimit()` sets `status: 'usage_limited'` and `continuationSuppressedReason: 'usage_limited'` on a matching active goal. | `.opencode/plugins/mk-goal.js:1354-1368`. |
| 6 | `goalStateLines()` emits `store_health=no_active_goal` (empty) or `store_health=state_age_ms:<n>` (active), and `/goal set` emits `mutation=<created|refreshed|replaced>`. | `.opencode/plugins/mk-goal.js:1602-1647`, `:1668-1675`. |

## 5. Findings — Central Env Reference (`ENV_REFERENCE.md`)

**[P1]** `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` (goal-plugin section, ~lines 646-660) lists only the older `MK_GOAL_PLUGIN_DISABLED`, `MK_GOAL_AUTONOMY`, `MK_GOAL_DEBUG`, and the max-char caps. It has **no rows for the three new cleanup/archive env vars**: `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS`. Confirmed independently in iterations 1, 4, 5, 6, 7, 9, 10 (highest-repeat finding of the session — genuinely exhausted, not a fluke).

## 6. Findings — Plugin & Root READMEs

**[P1]** `.opencode/plugins/README.md` is the target the root README explicitly delegates to ("See `.opencode/plugins/README.md` for the plugin contract", `README.md:1230-1233`), but its `mk-goal.js` coverage is a single inventory row (owns per-session state, injects active goal, exposes `mk_goal`/`mk_goal_status`, usage accounting, default-off continuation — `.opencode/plugins/README.md:42-50`) with **no config/contract subsection** for `mk-goal` (its config tables cover only `mk-skill-advisor` and `mk-code-graph`, `:77-124`). It omits the 3 cleanup env vars, archive/sweep behavior, `store_health`, and `mutation=`. Two remediation paths were surfaced (not adjudicated — implementation decision): (a) expand `.opencode/plugins/README.md` with a `mk-goal` contract subsection, or (b) retarget the root README pointer to `references/hooks/goal_plugin.md` (the more detailed operator contract doc) and keep the plugin README as inventory-only.

**[P3]** `.opencode/plugins/README.md:~70` says "Both plugins support" a 4-tier env precedence model immediately after an entrypoint table that now lists **five** plugins (including `mk-goal.js`) — a small internal wording mismatch independent of the P1 above (iterations 9, 10).

**[P2, refined across the session]** Root `README.md:1230-1233` documents bare `/goal <condition>`. Iteration 5/7 initially flagged this as likely-stale; iteration 8 refined the finding: the bare `/goal` user-facing wording is **not wrong** (it's still the invoked command text in the live `goal_opencode.md` router), but the README gives no runtime-specific caveat that Claude Code has its own native `/goal` while OpenCode's physical command file is `goal_opencode.md` — exactly the distinction `constitutional/goal-prompting-runtime-specific.md` already makes correctly. Net recommendation: add a short caveat/pointer, do not rename the documented command text.

**[P2]** `.opencode/skills/system-skill-advisor/README.md:85` still says the `/goal` plugin's "live OpenCode-run tool invocation still under investigation." This directly contradicts the same skill's own already-updated feature catalog entry (`feature_catalog/hooks-and-plugin/goal-opencode-plugin.md:41`), which states a real `opencode serve` run listed `mk_goal`/`mk_goal_status` and a live model turn called `mk_goal` and persisted state. Confirmed in iterations 4, 5, 6, 7, 8, 10 — the single most consistently-reconfirmed live contradiction in the session.

**[Ruled out — accurate]** `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md` correctly states `mk-goal.js` is intentionally absent from `plugin_bridges/` (standalone local plugin, not a daemon bridge) and points to `references/hooks/goal_plugin.md`. `.opencode/skills/system-spec-kit/ARCHITECTURE.md:160` correctly describes standalone local plugins the same way. Neither needs changes.

## 7. Findings — Already-Updated Docs Re-Verification (operator explicitly asked to verify, not re-flag)

**[P1 — the standout finding of this session]** `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, despite being on the operator's "already updated this session" list, **still lacks the three new cleanup env vars and the new `store_health`/`mutation=` output fields** in its environment/contract tables (its env table stops at the older 7 variables). This is a genuine gap in work already believed complete, discovered specifically because the operator asked this session to verify accuracy rather than skip re-checking. (Iteration 7, reconfirmed structurally by the same env-var gap pattern in iterations 9-10.)

**[Verified accurate]** `.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-spec-kit/references/config/hook_system.md`, `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` + `feature_catalog/ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md` (content-wise; see §8 for a validation-coverage gap), `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`, and `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` all reference the correct live filename (`goal_opencode.md`) and were not found to make any false claims. `constitutional/goal-prompting-runtime-specific.md` in particular correctly narrates the rename history AND states the final/current filename, and correctly distinguishes Claude Code's native `/goal` from OpenCode's plugin command.

## 8. Findings — Manual Testing Playbooks (validation-coverage gap, not a factual error)

**[P2]** Both goal-plugin manual playbooks (`system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md` and `system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`) are factually correct about command routing and tool names, but their pass criteria predate the new output fields: neither playbook instructs the operator to verify `store_health=` or `/goal set`'s `mutation=<created|refreshed|replaced>` output. A manual test run can currently pass without ever exercising these newly-shipped status surfaces (iteration 10).

## 9. Findings — Other Skills' `SKILL.md`/`references/`/`assets/` (targeted negative + positive sweep)

**[Ruled out — negative confirmation]** Exact goal-plugin-term sweeps (`mk-goal.js`, `mk_goal`, `goal_opencode`, `/goal`, `usage_limited`, cleanup/archive function names) across `cli-opencode`, `cli-claude-code`, `sk-code`, `sk-prompt-models`, and `deep-loop-workflows` own `SKILL.md`/`references/`/`assets/` returned **no goal-plugin mentions** in any of those five skills (iteration 5, reconfirmed iteration 6). `sk-prompt/SKILL.md` matched only generic prompt-goal wording unrelated to the OpenCode plugin (ruled out, iteration 4).

**[Ruled out — feature_catalog / manual_testing_playbook / constitutional, repo-wide]** A path-scoped sweep of every `.opencode/skills/**/feature_catalog/**/*.md`, `.opencode/skills/**/manual_testing_playbook/**/*.md`, and `.opencode/skills/system-spec-kit/constitutional/**/*.md` found goal-plugin entries **only** under `system-spec-kit` and `system-skill-advisor` (the already-updated ones) — no other skill anywhere in the repo has a stray/outdated goal-plugin catalog, playbook, or constitutional entry (iteration 10, the session's final closing sweep).

## 10. Findings — Stale-Claim Negative Sweeps (`usage_limited` dead / goal-state never cleaned up)

**[Ruled out — fully resolved]** No live/current doc anywhere in the repo (skills, READMEs, catalogs, playbooks, constitutional rules) claims `usage_limited` is unimplemented/dead, or that goal-state is never cleaned up. Both claims were confirmed false in **every** iteration that ran a negative sweep for them (4, 5, 6, 7, 9, 10). The only places these old claims still exist are the **original problem-statement prose in the phase 013/014 `spec.md` files themselves** (`013-design-fidelity-and-polish/spec.md:76`, `014-goal-state-cleanup-and-archive/spec.md:74`) and **archived research** (`research_archive/2026-07-01-plugin-implementation-audit/iterations/iteration-006.md:16-64`). These are the phases' own historical "here was the bug we're fixing" narrative and archived research evidence — expected and appropriate content for a spec/archive to retain, not live operator-facing documentation making a false current claim. No action needed unless the operator wants a "(historical, resolved in this phase)" annotation added.

## 11. Recommendations (priority order; this packet reports, does not implement)

1. **P1** — Add the three env vars to `ENV_REFERENCE.md`'s goal-plugin table: `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS` (defaults 90d / 30d / 1h).
2. **P1** — Update `references/hooks/goal_plugin.md` (yes, the "already updated" doc) to add the same 3 env vars plus `store_health` and `mutation=` output documentation.
3. **P1** — Decide and implement one of: expand `.opencode/plugins/README.md` with a real `mk-goal` contract/config subsection, OR retarget `README.md`'s "See `.opencode/plugins/README.md` for the plugin contract" pointer to `references/hooks/goal_plugin.md`.
4. **P2** — Fix `system-skill-advisor/README.md:85` — remove/replace "still under investigation" now that live verification is confirmed in that skill's own feature catalog.
5. **P2** — Add a runtime-specific caveat near root `README.md`'s `/goal <condition>` line clarifying the OpenCode plugin's physical command file is `goal_opencode.md` (keep the `/goal` invocation text as-is).
6. **P2** — Add `store_health=` and `mutation=` verification steps to both goal-plugin manual testing playbooks.
7. **P3** — Fix `.opencode/plugins/README.md`'s "Both plugins support" wording to match the current five-entrypoint table (or scope it explicitly to the two plugins it actually describes).
8. **P3 (optional, operator's call)** — Decide whether to correct or annotate old-filename (`goal.md`) references in packet-local operational docs: phase 009 `handover.md:95` (cold-read order still points at absent `goal.md`), phase 011 `tasks.md` (T001/T004 body text + a completion-criteria claim of "zero stale-reference hits" that is itself now inaccurate), and phase 003 `changelog-032-003-goal-command.md:26,56`. Lower priority than items 1-6 because these are packet-history artifacts, not the "related skill documentation and README files" the research topic centered on, but they were surfaced repeatedly (iterations 2, 3) as current-not-purely-historical drift.
9. **P3 (optional)** — `review_archive/2026-07-01-plugin-implementation-review/README.md:11-12` still names `goal.md`; archive context, lowest priority, annotate-or-leave is an operator call.

## 12. Eliminated Alternatives / Ruled Out

| Approach / Claim | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Root README's bare `/goal <condition>` wording is itself wrong and should be renamed | User-facing command text is still `/goal`; only the physical filename changed | `.opencode/commands/goal_opencode.md:7,15` | 8 |
| `plugin_bridges/README.md` misclassifies `mk-goal.js` | It correctly excludes it as a standalone local plugin, not a bridge | `plugin_bridges/README.md:31-36,62-90` | 4, 6 |
| `system-spec-kit/ARCHITECTURE.md` is stale on plugin architecture | Correctly describes standalone local plugins owning their own state/hooks | `ARCHITECTURE.md:160` | 4 |
| `cli-opencode`/`cli-claude-code`/`sk-code`/`sk-prompt-models`/`deep-loop-workflows` `SKILL.md` mention the goal plugin inaccurately | No goal-plugin mentions found in any of the five at all (negative confirmation) | targeted `SKILL.md` grep sweep | 5, 6 |
| Other skills have stray/outdated `feature_catalog`/`manual_testing_playbook`/`constitutional` goal-plugin entries | Repo-wide path-scoped sweep found entries only under the two already-updated skills | full-repo catalog/playbook/constitutional sweep | 10 |
| Live docs still claim `usage_limited` is dead/unimplemented | No current doc makes this claim; only phase spec problem-statements and archived research retain the old framing (expected historical content) | negative sweep | 4, 5, 6, 7, 9, 10 |
| Live docs still claim goal-state is never cleaned up | Same as above — fully resolved in live docs | negative sweep | 4, 5, 6, 7, 9, 10 |

## 13. Open Questions (for the operator / a follow-up implementation pass)

- Should `.opencode/plugins/README.md` be expanded, or should the root README's contract pointer be retargeted to `references/hooks/goal_plugin.md`? (Recommendation §11.3 offers both paths; not adjudicated here.)
- Should packet-local historical artifacts (phase 009 handover, phase 011 tasks, phase 003 changelog, the review-archive README) be corrected in place, annotated as historical, or left untouched? (§11.8-9)
- Should the phase 013/014 `spec.md` problem statements get a "(historical, resolved)" annotation, or is the current historical framing acceptable as-is? (§10)

## 14. Convergence Report

- Stop reason: `maxIterationsReached` (10 of 10; `minIterations = maxIterations = 10` was set specifically per the operator's explicit "target exactly 10 iterations; do not converge early" instruction, so the inline 3-signal convergence vote never got a chance to fire early — this is intended, not a runtime failure).
- Total iterations: 10 (all validated `ok:true` on the first post-dispatch validation attempt; zero retries, zero `dispatch_failure` events).
- `newInfoRatio` per iteration: 0.68, 0.57, 0.46, 0.54, 0.61, 0.52, 0.58, 0.49, 0.37, 0.34 — a gentle downward trend consistent with the same core P1/P2 findings being independently reconfirmed rather than newly discovered from iteration ~6 onward, while iteration 10's forced rotation into `feature_catalog`/`manual_testing_playbook`/`constitutional/` still produced genuinely new negative-confirmation coverage (not previously swept path classes).
- Questions answered: the four research-charter questions (filename, other-skills mentions, README staleness, ENV_REFERENCE completeness) plus the two negative-claim questions were all answered with direct evidence; 3 operator-facing implementation-decision questions remain open (§13) by design — this packet reports, it does not adjudicate documentation-ownership decisions.
- Convergence threshold: 0.05 (not the controlling stop condition this run; superseded by the operator-set `minIterations` floor).

## 15. Session Metrics

- Coverage-graph: 8 of 10 iterations emitted `graphEvents` (iteration 3 was a same-topic re-verification with no new graph nodes); all upserts succeeded (0 rejected edges).
- Resource map: emitted at `research/resource-map.md` (14 references catalogued: 1 README, 2 documents, 1 command glob, 5 skills, 3 specs, 1 script, 1 meta; 2 marked `MISSING` — the two command-filename globs themselves, expected since one glob pattern intentionally has no match).
- Executor: `cli-opencode` / `openai/gpt-5.5-fast` / reasoning effort `high`, single-executor (no fan-out), all 10 dispatches completed within the 900s per-iteration timeout with no retries.

## 16. References

- `.opencode/plugins/mk-goal.js` (source of truth for all confirmed facts in §4)
- `.opencode/commands/goal_opencode.md`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`
- `.opencode/plugins/README.md`
- `README.md` (root)
- `.opencode/skills/system-skill-advisor/README.md`
- `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`
- `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md`
- `.opencode/skills/system-spec-kit/ARCHITECTURE.md`
- `research/resource-map.md` (this packet)
- `research/iterations/iteration-001.md` through `iteration-010.md` (full evidentiary trail; all file:line citations in this synthesis trace back to specific iteration narratives)

## 17. Appendix — Iteration-by-Iteration Focus Log

| Iter | Focus | newInfoRatio | Status |
|------|-------|---------------|--------|
| 1 | Confirm live filename; build first candidate list | 0.68 | insight |
| 2 | Confirm filename; locate current old-name references | 0.57 | insight |
| 3 | Re-verify filename (phase 009/011/003 packet-local drift) | 0.46 | insight |
| 4 | Other skills' SKILL.md/references/assets sweep | 0.54 | insight |
| 5 | Other skills' sweep continued + README classification | 0.61 | insight |
| 6 | Other skills' sweep reconfirmation + output-shape check | 0.52 | insight |
| 7 | Related-skill + README staleness consolidation | 0.58 | insight |
| 8 | `.opencode/plugins/README.md` contract-adequacy question | 0.49 | insight |
| 9 | Plugin README contract ownership continued | 0.37 | insight |
| 10 | Final sweep: `feature_catalog`/`manual_testing_playbook`/`constitutional/`; session summary of open items | 0.34 | insight |
