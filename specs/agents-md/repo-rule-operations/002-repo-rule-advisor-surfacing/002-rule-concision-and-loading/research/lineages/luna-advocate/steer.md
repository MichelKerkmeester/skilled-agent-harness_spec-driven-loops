# STEER: luna-advocate (2 iterations), DEVIL'S ADVOCATE AND FULL LOAD
Scope is fixed here. Do not re-derive it.
Inputs: prep/evidence-pack.md §1 (token load) and §2 (read and re-read counts), AGENTS.md (§2 Gate 5, §8), REPO RULES.md.
Iteration 1 question: is loading every rule affordable? Give the case for and the case against.
Cover: token math per session and per compaction window, prompt caching, realistic compression ratios, what compression loses.
Output: (a) full-load tokens per session and per compaction window, with the derivation, (b) what prompt caching changes, cost versus context occupancy, (c) a compression ratio range with its source and what that compression loses. Cite each figure to the pack or label it ASSUMPTION with its basis.
Iteration 2: attack the strongest claims of the other lineages. The orchestrator will name the claims in this file under "CLAIMS TO ATTACK" before iteration 2. If none are named, write NO CLAIMS NAMED and stop.
Output per claim: the claim with its source lineage, the strongest counter-argument, cited evidence for it, the measurement that would settle it, and a verdict (stands, weakened, refuted).

## CLAIMS TO ATTACK (orchestrator; more may be added before your iteration 2)
1. deepseek-v4-1-flash-max, iteration 4 F24, file lineages/deepseek-v4-1-flash-max/iterations/iteration-004.md: Gate 5 should load rule cards (frontmatter, "Fires when", "The rule", 935-1,784 bytes each) instead of full files, cutting a load by 70-80 percent, and this "needs no new measurement to start because it removes tokens from an existing path".
2. Same file, F23: AGENTS.md should carry binding clauses plus one pointer line per rule family, because the §8 pointer pattern "is already the working design". Counter-evidence to weigh: prep/evidence-pack.md §2 shows answer-the-actual-request.md read in 4 sessions although §8 names it.
3. Same file, F25: no hook should be built now; build only after a measured miss rate.
4. The orchestrator's own claim in prep/evidence-pack.md §3: reading communication.md does not reduce tables in replies. Attack the measurement itself: detection, confounds, and what it cannot show.
5. swe-2-max, iteration 1 §7, lineages/swe-2-max/iterations/iteration-001.md: the prohibition that works after a read is short and concrete (9 words), the one that does not is long and justified (~500 bytes), implying shorter literal statements bind better. Attack the inference from two data points.
6. Conflict to adjudicate, not average: swe-2-max iteration 2 §1 (lineages/swe-2-max/iterations/iteration-002.md) finds a card drops every operative prohibition in 6 of 13 files, including "No semicolon", the one measured-effective sentence. That contradicts claim 1 above. Say which side the evidence supports and what single measurement would decide it.
7. luna-compliance iteration 2 §3 (lineages/luna-compliance/iterations/iteration-002.md): a reply linter or Stop check for objective bans "works whatever cause is ultimately correct". Attack it on what a Stop or completion hook can actually do in these runtimes (.claude/settings.json Stop entries, .skilled/hooks/completion/), and on false positives for requested tables. Note you share a model family with that lineage, so say so if you agree.
