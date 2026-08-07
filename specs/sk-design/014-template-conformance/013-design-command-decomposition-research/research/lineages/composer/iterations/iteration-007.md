# Iteration 7: Word-Cap and Naming Drift

## Focus
SKILL.md size harm and lane naming.

## Findings (confirmed)
1. **4991 words** — package_skill PASS with warning (hard cap 5000). [SOURCE: package_skill.py --check; package_skill.py:95]
2. **5235 → 4991** via uncommitted motion prose dedup after merge commit c1981d2b91. [SOURCE: git diff SKILL.md]
3. **Split does not shrink SKILL.md** — mode packet unchanged.
4. **handoff vs build:** design.md uses `--mode handoff`; command-metadata tasks[] says `--mode build`. [SOURCE: design.md:3; command-metadata.json:167]

## Assessment
- newInfoRatio: 0.91
