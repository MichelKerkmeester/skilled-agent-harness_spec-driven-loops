# Iter 009 — Track 3: banned HVR phrases scan

## RQ
Read `.opencode/skills/sk-doc/references/global/hvr_rules.md` Section 7 (Phrase Hard Blockers). For each banned phrase, grep `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md` and report every occurrence with line number + 1-line context.

## Method
- Extracted all banned phrases from HVR rules Section 7
- Grep-searched README.md for each phrase with 1-line context

## Banned Phrases Searched
1. "It's important to" / "It's worth noting"
2. "It goes without saying" / "At the end of the day"
3. "Moving forward" / "In today's world"
4. "In today's digital landscape"
5. "When it comes to" / "Dive into"
6. "I'd love to" / "Navigating the [X]"
7. "That being said" / "Having said that"
8. "Let me be clear" / "The reality is"
9. "Here's the thing" / "In a world where"
10. "You're not alone"
11. "The real question is" / "The truth is"
12. "Here's what you need to know" / "What most people don't realise is"

## Findings
None. No banned HVR phrases found in README.md.

ITER_009_COMPLETE: 0 findings, newInfoRatio=0.00
