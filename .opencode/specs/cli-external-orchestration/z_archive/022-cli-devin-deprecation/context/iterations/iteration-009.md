# Iteration 009

**Pool:** native-a + native-b (sonnet) · **Focus:** GAP RECOVERY: .devin/hooks.v1.json + hooks/devin source + advisor-runtime 'devin' enum; configs CLEAN; SKILL.md:391 resolved

## Findings (15)
- `.devin/hooks.v1.json` — UserPromptSubmit + SessionStart hooks (8,20) → delete-file — [NEW/CRITICAL] tracked Devin-only runtime hook config; whole file dead post-deprecation; NOT gitignored -> commit deletion. Devin analog of 132's .gemini/ removal
- `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` — handleDevinUserPromptSubmit (whole file ~246L) (1-246) → delete-file — [NEW/CRITICAL] entire Devin hook source; delete hooks/devin/ dir + dist mcp_server/dist/hooks/devin/user-prompt-submit.js
- `.opencode/skills/system-skill-advisor/mcp_server/lib/advisor-runtime-values.ts` — ADVISOR_RUNTIME_VALUES 'devin' (16) → inline-edit — [NEW/HARD] canonical runtime enum tuple incl 'devin'; drives AdvisorRuntime type+guards; remove entry
- `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/runtime-parity.vitest.ts` — RUNTIMES + devin test (25,97) → inline-edit — [NEW] remove 'devin' from RUNTIMES + delete devin test block
- `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` — Devin CLI in hook roster (139) → inline-edit — [NEW] remove 'and Devin CLI'
- `.opencode/skills/system-skill-advisor/README.md` — Devin hook FAQ + Q&A (160,184) → inline-edit — [NEW] remove Devin gotcha row + hooks/devin Q&A
- `.opencode/skills/system-skill-advisor/references/runtime/freshness_contract.md` — Devin hook adapter row (104) → inline-edit — [NEW] remove Devin from adapter enumeration
- `.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md` — Devin in hook list (20) → inline-edit — [NEW] remove 'Devin'
- `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` — F4 .devin migration (DONE) (40-73) → leave — marked DONE; historical; leave or close-by-deprecation (no active-wiring risk)
- `.opencode/skills/deep-context/SKILL.md` — Pairs-with cli-devin (RESOLVED) (391) → inline-edit — RESOLVED iter8 false-negative; line 391 DOES have cli-devin; remove / cli-devin
- `.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-run.md` — cli-devin executor list (3,25,42) → inline-edit — [NEW] desc(3) + 'devin --print' stdin note(25) + executor mention(42)
- `opencode.json` — (clean) (1-104) → leave — CONFIRMED CLEAN - no devin
- `.utcp_config.json` — (clean) (header) → leave — CONFIRMED CLEAN
- `.gitignore` — (clean; .devin NOT ignored) (grep) → leave — CONFIRMED CLEAN; .devin/ is tracked not ignored -> deletion commits
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — -ne 391 count check (166) → leave — count is system-spec-kit's, does NOT track cli-devin; no bump needed (no cli-devin feature_catalog files under system-spec-kit)

See `../seats/iter-009/` for the full per-seat finding sets.
