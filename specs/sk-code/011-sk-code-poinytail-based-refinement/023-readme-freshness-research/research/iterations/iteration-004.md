# Iteration 4: Root README skills, hubs, advisor, hooks and CI checks vs v4.0.0.4 (Q3 part 2)

## Focus

Q3 part 2: the root README's statements on skills and hubs, skill routing and the advisor (Python and Node advisors agreeing in CI, paths no longer pulling routes), hooks (stdin deadline, Pi guard), and CI and commit/PR checks, checked against v4.0.0.4 and the repository. Q3's remaining parts (code review output, unknown-option refusal, per-doc versions, playbook and catalog checks) stay open for a later iteration.

## Actions Taken

1. Read state first: `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, and the prior iteration files. Focus = strategy §11 Next Focus (Q3 part 2); no exhausted approach blocks it.
2. Re-opened `.skilled/changelog/skilled/v4.0.0.4.md` first-hand: Commit and Pull Request Checks (109-133), Tooling Changes (233-281), Hooks and Dispatch Guards (333-341), Skill Routing (345-361), Skill Authoring (365-393).
3. Read `README.md` §2 (29-84), §4 Git Hooks / First Use / Adapting (195-248), §7 Skill Advisor (659-770), §8 Skill Library (774-930), §10 Plugin & Extension Library (1000-1071).
4. Counted the repository side in read-only commands: `.skilled/skills/*/` → 14 skill dirs; `.skilled/agents/*.md` → 11; command entry points create 13 + deep 3 + design 3 + doctor 8 + prompt 1 + speckit 6 = 34 across the six groups, plus 3 root utilities = 37; `.skilled/plugins/*.js` → 16.
5. Read the two hub mode registries with `node -e`: sk-doc `modes` length 15 over 14 distinct `packet` values; mcp-tooling `modes` length 9 with the exact ids the README names.
6. Read `.github/workflows/routing-registry-drift.yml` (both jobs) and the advisor CLI fallback code; checked `route-validate.{sh,py}`, `message-contract.yml`, `install-git-hooks.sh`, and the shared hook files `hook-stdin-deadline.test.mjs` plus `task-dispatch/pi`.
7. Located the changelog's `spec/` restore README (carry-over from iterations 1-2): `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:258-261` holds the `restore.mjs` instructions the changelog names at lines 425 and 427.

## Findings

| README path:line | Claim as written | Evidence | Class | Severity | Smallest proposed fix |
|---|---|---|---|---|---|
| README.md:66 | "Twelve specialized agents own focused roles, and seven CLI bridges let a runtime dispatch other AI CLIs as sub-tools." | `ls -1 .skilled/agents/*.md \| wc -l` → 11 in this iteration; same defect already recorded at README:933 (iteration 3) | STALE | P1 | "Eleven specialized agents own focused roles, ..." |
| README.md:80 | "Behind them: 14 on-demand skills, 39 command entry points and the Code Mode MCP server, each detailed in its own section below." | 14 skill dirs ✓; commands: 13+3+3+8+1+6 = 34 entry points across six groups + 3 root utilities = 37, not 39; same defect already recorded at README:1074 (iteration 3) | STALE | P1 | "Behind them: 14 on-demand skills, 37 command entry points and the Code Mode MCP server, ..." |
| README.md:776 | "14 skills in `.skilled/skills/`." | `ls -1d .skilled/skills/*/` → 14 | OK-VERIFIED | P2 | none |
| README.md:776 | "By default, no skills are excluded from advisor routing." | `.skilled/skills/system-skill-advisor/runtime/config/route-exclusions.json` → `{"excludedSkillIds": []}` | OK-VERIFIED | P2 | none |
| README.md:241 | "The other 13 shipped skills, such as `system-spec-kit`, `sk-doc`, `sk-git` and `system-deep-loop`, are codebase-agnostic out of the box" | 14 skill dirs total = `sk-code` + 13 | OK-VERIFIED | P2 | none |
| README.md:669 | "Daemon unreachable → the CLI answers from the Python scorer at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` and marks the response degraded, so the prompt-time brief reports `Advisor: stale` rather than claiming live" | `skill-advisor-cli.ts:40` "The CLI's own last resort when no daemon answers: the checked-in Python scorer"; `:1476` `degradedRecommendations`; `:1531` `degraded: true`; the scorer file exists | OK-VERIFIED | P2 | none |
| README.md:902 | sk-doc "routed via `mode-registry.json` to fifteen workflow modes across fourteen packets" | `node` read of `.skilled/skills/sk-doc/mode-registry.json`: `modes` length 15, 14 distinct `packet` values | OK-VERIFIED | P2 | none |
| README.md:878 | mcp-tooling "One advisor identity routing to nine modes through `mode-registry.json`: five workflow modes ... and four design transports ..." | `node` read of `.skilled/skills/mcp-tooling/mode-registry.json`: `modes` length 9, ids exactly mcp-chrome-devtools, mcp-click-up, mcp-aside-devtools, mcp-figma, mcp-refero, mcp-mobbin, mcp-obsidian, mcp-notion, mcp-magicpath | OK-VERIFIED | P2 | none |
| README.md:1025 | "Thirteen plugins honor a per-concern kill-switch via `hook-flags.cjs` plus the master `SYSTEM_HOOKS_DISABLED`. The Spec Kit completion and sk-vision plugins carry their own switch, and the git message gate has none." | `ls -1 .skilled/plugins/*.js \| wc -l` → 16 = the 13 + `system-speckit-completion` + `sk-vision` + `sk-git-message-gate` the README's own list accounts for; `.skilled/hooks/shared/hook-flags.cjs` exists | OK-VERIFIED | P2 | none |
| README.md:205 | "...and the `message-contract` CI check" | `.github/workflows/message-contract.yml` exists in the workflow listing | OK-VERIFIED | P2 | none |
| README.md:1278 | "The `route-validate.{sh,py}` CI script enforces internal consistency on the route manifest." | `.skilled/commands/doctor/scripts/route-validate.sh` and `route-validate.py` both exist (plus `scripts/tests/route-validate.test.sh`) | OK-VERIFIED | P2 | none |
| README.md:210 | `bash .skilled/scripts/install-git-hooks.sh --uninstall` | Script exists (executable, 9,576 bytes); `--uninstall` branch at line 152 | OK-VERIFIED | P2 | none |

Note — three checked-and-clear observations (recorded in the delta, not as rows because no README statement contradicts them):
- The v4.0.0.4 advisor-agreement CI change is real: `.github/workflows/routing-registry-drift.yml` runs the routing-registry drift guard ("asserts the hardcoded Python/TS routing maps equal the registry projection") plus the parity suites and a golden-prompt gate, with the approved-divergence ledger at `runtime/tests/parity/fixtures/local-native-approved-divergences.json`. The root README makes no claim about advisor agreement in CI — nothing stale, and a Q5 candidate for the related-docs pass.
- The hook stdin deadline and the Pi dispatch guard exist (`hook-stdin-deadline.test.mjs`; `.skilled/hooks/task-dispatch/{claude,cursor,devin,lib,opencode,pi}`), and no root README statement describes or contradicts them; README:1045's `task-dispatch-guard.ts` listing is consistent.
- "Paths and doc targets no longer pull routes" and the `surfaceHint` caller input have no counterpart claim in the root README; §7's scoring description does not contradict them.

## Questions Answered

- None fully. Q3 part 2 (skills and hubs, routing and the advisor, hooks, CI and commit/PR checks) is covered; Q3's remaining parts (code review output, unknown-option refusal, per-doc versions, playbook and catalog checks) stay open, so Q3 is not ticked.

## Questions Remaining

- Q3 (part 3): code review output, scripts refusing unknown options, per-doc version model, playbook and catalog checks.
- Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository?
- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate?

## Next Focus

Iteration 5: Q3 part 3 (code review output, unknown-option refusal, per-doc versions, playbook and catalog checks), then Q4 over the related READMEs (`.skilled/skills/*/README.md` hubs, the INSTALL-GUIDE family, `.skilled/hooks/README.md`). Carry-over status: the changelog's `spec/` restore README is resolved (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:258-261`); the iteration-1 ClickUp `cupt` key question (README:1336/1435 vs the release note's OAuth note) remains open for Q4/Q5.

## Ruled Out

- None this iteration.

## Dead Ends

- None this iteration.

## Edge Cases

- Ambiguous input: none material. The focus splits Q3 again; the narrower evidence-backed interpretation (part 2 = the four named areas) was taken and the deferred parts are listed above.
- Contradictory evidence: none. The two STALE rows replicate iteration 3's defects at two new lines; both trace to the same v4.0.0.4 retirements (two deep-loop modes retired; `deep-improvement` agent deleted).
- Missing dependencies: none. All state files present; gateway called after the writes.
- Partial success: none. The advisor fallback claim was verified by reading the CLI source rather than forcing a daemon outage, because killing the resident daemon is a side effect a read-only iteration must not cause.

## Sources Consulted

- [SOURCE: README.md:66], [SOURCE: README.md:80], [SOURCE: README.md:241], [SOURCE: README.md:205], [SOURCE: README.md:210], [SOURCE: README.md:669], [SOURCE: README.md:776], [SOURCE: README.md:878], [SOURCE: README.md:902], [SOURCE: README.md:1025], [SOURCE: README.md:1278]
- [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:109], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:131], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:275], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:279], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:335], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:339], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:347], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:351], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:359], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:389], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:393], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:425]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:40], [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1476], [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1531], [SOURCE: .skilled/skills/system-skill-advisor/runtime/config/route-exclusions.json], [SOURCE: .skilled/skills/sk-doc/mode-registry.json], [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json], [SOURCE: .github/workflows/routing-registry-drift.yml:146], [SOURCE: .github/workflows/routing-registry-drift.yml:230], [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh], [SOURCE: .skilled/commands/doctor/scripts/route-validate.py], [SOURCE: .skilled/scripts/install-git-hooks.sh:152], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:258]
- Command outputs: `ls -1d .skilled/skills/*/` → 14; `ls -1 .skilled/agents/*.md | wc -l` → 11; command groups 13/3/3/8/1/6 + 3 root = 37; `ls -1 .skilled/plugins/*.js | wc -l` → 16; sk-doc registry modes 15 / packets 14; mcp-tooling modes 9; route-exclusions `{"excludedSkillIds": []}`; `.github/workflows/` listing includes message-contract.yml and routing-registry-drift.yml
- specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/deep-research-config.json; deep-research-state.jsonl; deep-research-strategy.md; findings-registry.json; iterations/iteration-001.md; iterations/iteration-002.md; iterations/iteration-003.md

## Assessment

- New information ratio: 0.60 (12 findings rows: 2 stale at new lines of a known defect class and 10 first-time verifications, all at half weight; 3 fully new observations; weighted 9/15)
- Questions addressed: Q3 part 2
- Questions answered: none (Q3 stays open for its remaining parts)

## Reflection

- What worked and why: reading each hub's own mode registry with a one-line `node` probe turned three README hub claims into exact counts (15/14 and the nine mcp-tooling ids) instead of eyeballing directories; counting the repository side first made the two stale rows a simple subtraction; checking the CLI source for the fallback claim beat trying to force a daemon outage, which would have been a side effect; and one compound read-only command per batch kept the evidence count low while still opening every cited file.
- What did not work and why: nothing failed. The state reads and section mapping consumed more calls than the persona's target, so the research calls had to be batched aggressively at the end.
- What I would do differently: open the registry/count evidence in the first research batch rather than after the README section reads, so a late count surprise still leaves room for a second check.

## Recommended Next Focus

Iteration 5: Q3 part 3 — code review output (README §6 Deep Review vs "Review Findings Show Their Case"), unknown-option refusal (README §11 doctor claim and the script-level changelog changes), per-doc version model, and playbook and catalog checks; then Q4 over the related READMEs. Fold in the still-open ClickUp `cupt` key question (README:1336/1435 vs the release note's OAuth note).

## SCOPE VIOLATIONS

None.
