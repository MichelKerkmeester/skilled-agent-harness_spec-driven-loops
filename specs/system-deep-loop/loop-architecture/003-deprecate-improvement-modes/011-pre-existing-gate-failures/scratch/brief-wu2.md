ROLE: You fix two routing defects in the local Python skill advisor scorer. Work only in this git worktree. Do not commit.

DEFECTS (both predate this branch):
1. Prompt "inspect network waterfall in browser" returns no skill. Expected top skill: mcp-tooling. Case id P0-CHROME-002 in .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl.
2. Prompt "Run a fresh deep-research pass focused on prompt-routing false positives." routes to sk-prompt (0.95) above system-deep-loop (0.89). Gold is system-deep-loop. Case id rr-iter3-156 in runtime/scripts/routing-accuracy/labeled-prompts.jsonl.

REPRODUCE:
python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>"

TASK: find why the local scorer decides each case wrong and fix the cause in the scorer or its skill vocabulary data. Do not special-case these two prompts by id or exact text. Do not edit any test, fixture, ledger, baseline or expected count.

ALLOWED WRITES: files under .skilled/skills/system-skill-advisor/ and the graph-metadata.json or skill vocabulary of mcp-tooling, sk-prompt or system-deep-loop. If you change skill vocabulary, regenerate what derives from it with the repo's own generators and name each command you ran.

BASELINE FIRST, then after your fix rerun every gate below and report both numbers:
A. cd .skilled/skills/system-skill-advisor/runtime && npx vitest run   (baseline: 2 failed, both from defect 2)
B. python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py --dataset .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl   (baseline: only P0-CHROME-002 fails)
C. the advisor pytest suite under .skilled/skills/system-skill-advisor (find how it runs; baseline passes)
D. node .skilled/skills/system-skill-advisor/runtime/scripts/capture-scorer-eval-baseline.mjs   (compare-only, no --write; must not report a regression)

DONE WHEN: A, B, C and D all pass, and no other gate number got worse. If a fix to one defect breaks another case, stop and report the trade-off instead of forcing it.

HANDBACK: files changed, root cause of each defect in one sentence, before/after numbers for A-D with exit codes.
