# Fix plan

Target: worktrees/474-advisor-pasted-context-and-crash-fallback; head: 4d65eced09eff82336f470b8b18aa22935f84295

## In scope

### spec:specs/system-skill-advisor/host-integrations

- [ ] BAT-02 P0 specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement:- S14-packet-validate failed for specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement (exit 1).
- [ ] X-02 P2 specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/description.json:3 Pre-existing at the merge base, not introduced by this change, but it is the only reason the S14 parent row is red. The packet's `description.json` says 'Mine the pi-context-decisions extension for id

### skill:.skilled/skills/system-skill-advisor

- [ ] C-01 P1 .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:67 The Claude row of the runtime table still says the handler shows `{}` 'on error'. The catch block now returns `renderAdvisorTimeoutFallback` for a valid prompt whose processing throws (user-prompt-sub
  fix: or `{}` when disabled or on error. | -> or `{}` when disabled; a crash returns the outage fallback. |
- [ ] D-01 P1 .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:580 The hook's skip gate still reads the raw prompt, so a pasted earlier reply that names a skill makes `skippedAdvisorResultFor` fire and the stripped weak task is scored. Case: `Earlier you replied: I u
  fix: skippedResult = injectedBrief ? null : skippedAdvisorResultFor(prompt); -> skippedResult = injectedBrief ? null : skippedAdvisorResultFor(stripLeadingPastedReply(prompt));
- [ ] C-05 P2 .skilled/skills/system-skill-advisor/runtime/tests/fixtures/README.md:49 The new fixture row names `legacy/advisor-prompt-policy.vitest.ts` and `python/test_skill_advisor.py`, which do not exist under tests/fixtures/; the repo's reference checker reports both on line 49. T
  fix: Read by `legacy/advisor-prompt-policy.vitest.ts` and `python/test_skill_advisor.py`. -> Read by `../legacy/advisor-prompt-policy.vitest.ts` and `../python/test_skill_advisor.py`.
- [ ] A1 P1 .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:196 The change appends row rr-paste-208 to the hash-pinned routing corpus (195 -> 196 rows, sha 4146b002802d010e -> 18bc5977180a722e) but does not recapture the corpus pin in specs/system-deep-loop/loop-a
- [ ] B-01 P1 .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55 The branch ships two user-visible capabilities and this reference describes neither. `stripLeadingPastedReply` (feat 6c4af5fb5e) rewrites the prompt in `hooks/lib/skill-advisor-cli-fallback.ts` and ag
- [ ] A3 P2 .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:411 Every briefed turn now pays one extra durable-clock read on the user's prompt path: recordRouteReceipt calls directiveLifecycleStore.clock(sessionId) here, and applyDirectiveLifecycle (line 607) then 
- [ ] A4 P2 .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:441 The confirmed-session rule this change depends on is now written three times in one file: deliveryStateOptionsFor at line 267 (input.session_identity_confirmed ?? hasSessionId), the new receiptSession

### unowned

- [ ] PRB-01 P1 -:- Probe P02 "add a regression test for the route receipt that holds a weak follow-up to the session route" expected system-skill-advisor; top-1 was sk-code.
- [ ] PRB-02 P1 -:- Probe P03 "make the prompt hook print the outage line instead of nothing when it crashes" expected system-skill-advisor; top-1 was sk-prompt.
- [ ] PRB-03 P1 -:- Probe P04 "rotate the session lifecycle clock when dsh starts an agent or finishes compaction" expected system-skill-advisor; top-1 was cli-external-orchestration/cli-deepseek-harness.
- [ ] PRB-04 P1 -:- Probe P05 "strip the pasted reply in the python scorer so it matches the native scorer" expected system-skill-advisor; top-1 was sk-code/sk-code-skilled.
- [ ] PRB-05 P1 -:- Probe P06 "measure how many top-1 advisor routes pass only on the confidence floor" expected system-skill-advisor; top-1 was nothing.
- [ ] BAT-01 P2 -:- S5-derived-counts failed (exit 1).

### env-doc:.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md

- [ ] X-01 P2 .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:159 The change adds a second consumer of `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` without naming it in the variable's docs. `routeReceiptBaseDir` (`hooks/lib/route-receipt.ts:97-100`) resolves the new rout

## Pre-existing or outside the scope

### skill:.skilled/skills/system-skill-advisor

- [ ] B-02 P2 .skilled/skills/system-skill-advisor/runtime/bench/README.md:48 The bench README still presents `scorer-calibration.bench.ts` as calibration-only. The branch adds `logFollowUpRouting` and `logFollowUpReceipts` over `FOLLOW_UP_PAIRS` and `FALSE_CARRY_PAIR` (scorer- (unchanged in range)
  fix: | `scorer-calibration.bench.ts` | Measures scorer calibration against baseline expectations. | -> | `scorer-calibration.bench.ts` | Measures scorer calibration against baseline expectations, plus floored follow-up rout
- [ ] B-03 P2 .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:20 The catalog is the skill's canonical current-state inventory, yet it still declares 46 features across 7 groups with `hooks-and-plugin` at 4, and no entry describes either new capability. The Claude h (unchanged in range)
- [ ] B-04 P2 .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md:87 The only Claude-hook scenario still treats `{}` as a shim failure and a leading `Advisor: outage (` as an acceptable no-brief signal, so it would not distinguish a handler crash from a real outage; it (unchanged in range)
- [ ] C-02 P2 .skilled/skills/system-skill-advisor/README.md:84 How It Works describes the hook-to-CLI path without either new routing behavior: the hook strips a leading pasted reply (a cue needs an attribution header such as 'You said:') before the 10,000-charac (unchanged in range)
- [ ] C-07 P2 .skilled/skills/system-skill-advisor/SKILL.md:5 The skill's behavior changed, but SKILL.md stays at 1.1.0.0 and no component changelog entry was added; the newest entry, v1.1.0.0, covers the earlier hook-health work. The established pattern for pos (unchanged in range)
- [ ] D-02 P2 .skilled/skills/system-skill-advisor/graph-metadata.json:66 The change adds five feature names — pasted reply, route receipt, outage line, lifecycle clock, confidence floor — but none appears in the skill's stage-one routing metadata: `graph-metadata.json` `in (unchanged in range)

### unowned

- [ ] C-04 P2 README.md:674 The S5 derived-count row fails on `Claude Code (two files)`: the checker reads `two files` as a count of files in the repo root, which holds 16 or 17, and the root inventory is incomplete. The sentenc (pre-existing (critic))
  fix: - **[Spec Kit Feature Catalog](.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md)** - the Spec Kit's sh -> - **[Spec Kit Feature Catalog](.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md)** - the Spec Kit's sh
- [ ] C-03 P2 README.md:201 The Skill Routing section states the 0.8 rule unconditionally and describes only the daemon and local-scorer path. The hook now withholds a confidence-floored route (the task-intent floor is 0.82) on  (unchanged in range)
- [ ] C-06 P2 .skilled/changelog/skilled/v4.1.0.0.md:186 No release entry describes the three user-visible advisor changes. v4.1.0.0.md is the newest framework entry, and its Skill Advisor section and Smaller fixes list name none of them; the v4.1.0.0 tag p (unchanged in range)

