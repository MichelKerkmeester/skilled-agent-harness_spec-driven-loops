ROLE: Remove the leftover agent-improvement routing vocabulary from the skill advisor. Work only in this git worktree. Do not commit.

FACT: the agent-improvement and model-benchmark modes are gone from system-deep-loop (research, review, ai-council remain). The advisor still boosts phrases that only described agent improvement toward system-deep-loop, so such prompts now route to a hub that cannot serve them.

TASK, in .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:
1. In PHRASE_INTENT_BOOSTERS delete every entry whose phrase describes agent improvement or proposal/candidate promotion: "recursive agent", "improvement loop", "proposal-only improvement", "proposal only improvement", "proposal only", "candidate scoring", "promotion gate", "handover target", the "5-dimension"/"5d" family, "integration scanning", "integration scan", "dynamic profiling", "dynamic profile", "evaluate agent quality", "score agent dimensions", "agent integration surface", "improve agent", "score agent", "evaluate agent", "agent evaluation", plus any other entry in that block you can show serves only agent improvement. Delete the comment lines that only explain removed entries. Keep everything for research, review, ai-council and other skills.
2. Line ~1669: the "improvement" synonym group. Remove it if it only feeds the retired mode; if something live reads it, keep it and say what.
In .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts: delete the matching entries ('5d scoring', '5-dimension agent scoring', 'integration scan', 'dynamic profile', and any other agent-improvement-only phrase).
If a generated hash or projection inside these files must be refreshed, use the repo's own generator and name it.

ALLOWED WRITES: files under .skilled/skills/system-skill-advisor/ only. Do not edit labeled corpora, holdout files, ledgers or baselines.

BASELINE FIRST, then after the edit rerun and report both:
A. cd .skilled/skills/system-skill-advisor/runtime && npx vitest run   (baseline 0 failed)
B. python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py --dataset .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl   (baseline 84/84)
C. python3 -m pytest .skilled/skills/system-skill-advisor/runtime/tests/python -q   (or the suite's own runner; baseline pass)
D. node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs and compare its metrics with routing-accuracy/scorer-eval-baseline.json (baseline identical: corpus 153/195, holdout 49/66)
E. cd .skilled/skills/system-skill-advisor/runtime && npx tsc --noEmit -p .   (or the package typecheck script)

DONE WHEN: A, B, C and E pass and D is identical. If D or a pinned parity count changes, do not edit any expectation: stop and report which prompts moved and why.

HANDBACK: entries removed (list), files changed, before/after for A-E with exit codes.
