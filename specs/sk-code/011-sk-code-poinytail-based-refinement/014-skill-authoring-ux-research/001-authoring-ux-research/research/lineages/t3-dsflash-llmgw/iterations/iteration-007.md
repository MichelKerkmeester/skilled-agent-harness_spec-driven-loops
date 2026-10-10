# Iteration 7: E5 — the third check plane and the smallest move to the edit loop

## Focus
E5: doctor rules 5e, 5i, 13c, 13d and the router-sync checks catch drift only after the fact, in a separate command the author does not run while editing. This iteration locates where each rule runs, what severity it carries, and the smallest change that moves detection to where the author is.

## Actions Taken
- Read the 5e/5i implementations and the severity machinery (pass/warn/info/softFail) in parent-skill-check.
- Found every invoker of parent-skill-check and of the router-sync guard/umbrella.
- Measured the checker's cost for one hub.
- Read the umbrella's contract and the orphan-doc child's history as the cost evidence.

## Findings
1. [VERIFIED] 5e and 5i are structural router-policy checks: tieBreak must be an exact permutation of registered modes, and workflow modes must sort before surface/transport modes. Both report through softFail, which is FAIL by default and WARN only under PARENT_HUB_CHECK_STRICT=0 — so in the gate they are hard. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1087,1142-1156,186-190]
2. [VERIFIED] 13c is the one live advisory: README version drift warns on the four hubs in README_VERSION_WARN_ONLY and never fails the checker; 13d is hard. The earlier run showed exit 0 with 13c WARN live on sk-doc. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1804-1821]
3. [VERIFIED] parent-skill-check runs in exactly two places: the doctor route (interactive, read-only audit) and the routing-drift CI job's per-hub loop. Neither is the author's edit surface. [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:5,32] [SOURCE: .github/workflows/routing-registry-drift.yml:180-186]
4. [VERIFIED] The checker costs ~1.96s for one hub (measured), which is cheap enough for a scoped commit-time call and too slow to run fleet-wide on every commit. (ran: `time node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`)
5. [VERIFIED] The router-sync guard and its umbrella exist with full leg coverage and a single non-zero exit on any failure, offline and deterministic — and no workflow or hook invokes them. A repo-wide search for the umbrella finds only the skill's own docs, README and reports. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:1-33]
6. [VERIFIED] The commit-time plane already gates sibling artifact families: the pre-commit auto-remints route manifests for staged hub inputs, byte-checks Hermes copies and spec docs, and blocks with fix instructions. The pattern E5's rules would use already exists in the hook. [SOURCE: .skilled/scripts/git-hooks/pre-commit:259-267,352-549]
7. [VERIFIED] The orphan-doc history is the cost of an unwired leg: nine orphan docs passed every gate while leg 1b was held back, and a tenth unrouted doc passed every gate; the fix wired the leg and allowlisted only the three symlinked workflow docs with a stated reason. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/implementation-summary.md]
8. [INFERRED] Root cause: the E5 rule families sit on a third plane — the per-hub doctor command and the skill-local umbrella — because that is where their ownership lives; nothing in the edit loop triggers that plane. The two planes that do run per commit cover generated artifacts and mirrors, so the author's edits to router policy and router prose pass the commit gate and wait for a doctor run or CI. The author would have to know the per-hub command by name and remember to run it before every commit.
9. [INFERRED] Smallest fix by reversal cost: (a) build nothing fails — 13c is live advise-only drift and leg 1b shipped nine orphans; (b) change values first — empty README_VERSION_WARN_ONLY and the 5k warn legs once those four hubs are repaired, so the rules are strict everywhere; (c) extend the existing pre-commit staged-hub dispatch in place: when a hub file is staged, call the scoped parent-skill-check on that hub dir (1.96s) and the sk-code umbrella for staged sk-code files, blocking on hard failures only, with the failure message naming the command — the route-remint block already computes exactly this hub-from-staged-path set; (d) a new unified authoring-gate script is unearned while the hook block exists; (e) wiring the umbrella only into CI is a one-line change but leaves the author paying an amend; keep it as the second step, not the first. Proof: run the checker and the umbrella by hand today; after the change, stage a deliberately broken tieBreak (a duplicate mode) on a scratch branch and confirm the commit blocks the way the route-remint gate does.

## Ruled Out
- A new "authoring gate" script aggregating all cheap checks: the pre-commit file already owns staged-file dispatch; a second dispatcher duplicates it.
- Running the fleet-wide checker on every commit: 1.96s per hub times seven hubs, for changes that usually touch one hub; scoping to the staged hub is the cheap direction.
- Auto-running the expensive reach prober at commit time: it probes the advisor per phrase and belongs in CI.

## Dead Ends
- No caller of the umbrella outside the skill was found; the conclusion rests on repo-wide search plus the 006 and 007 packet records that call it operator-run.

## Edge Cases
- Contradictory evidence: none; severity semantics and the live 13c warn agree.
- Missing dependencies: none.
- Partial success: none; E5 is answered as a placement problem with a scoped fix.

## Sources Consulted
- .skilled/commands/doctor/scripts/parent-skill-check.cjs
- .skilled/commands/doctor/assets/doctor-parent-skill.yaml
- .github/workflows/routing-registry-drift.yml
- .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
- .skilled/scripts/git-hooks/pre-commit
- specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/implementation-summary.md

## Assessment
- New information ratio: 0.90
- Questions addressed: Q5 (complete)
- Questions answered: Q5

## Reflection
- What worked and why: measuring one hub's checker cost made the fix recommendation quantitative; the scoped-call recommendation follows from 1.96s, not taste.
- What did not work and why: none; the umbrella search was decisive because it found no caller at all.
- What I would do differently: read the severity helpers before the rules — softFail versus warn decided which rules actually gate today.

## Recommended Next Focus
Iteration 8: the external-author surface — init_skill.py, validate_skill_package.py and the scaffolded package — to determine which of the E1-E5 fixes ship with a skill package an outside user creates, and to consolidate the fix inventory per audience before synthesis.
