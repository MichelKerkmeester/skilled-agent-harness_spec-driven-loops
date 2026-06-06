# Deep-Review Dashboard — Path-Reference Integrity

Iterations: 10/10 | Method: deterministic baseline + DeepSeek (cross-checked)

## Deterministic (authoritative)
- Broken markdown links: **210** / 24509 checked
- De-number-caused (#133): **0**
- Fixable: 19 unique + 3 ranked = **22** | ambiguous 38 | truly-missing 150
- Severity: P0=0 P1=114 P2=96

## Model (advisory, cross-checked)
- Findings emitted: 270
- Confirmed NEW (regex-missed, broken on disk): **102**
- Anchor advisories (file ok, anchor unverified): 0
- Model false-positives rejected by cross-check: 5

## Per-iteration
- iter 01 — sk-code checklists → references: FAIL (P0=0 P1=63 P2=3, 66 findings)
- iter 02 — sk-doc assets & templates: CONDITIONAL (P0=0 P1=20 P2=39, 59 findings)
- iter 03 — other sk-* skills + deep-* skills: CONDITIONAL (P0=0 P1=2 P2=6, 8 findings)
- iter 04 — system-spec-kit manual_testing_playbook: CONDITIONAL (P0=0 P1=67 P2=5, 72 findings)
- iter 05 — cli-* + remaining catalog/playbook roots: CONDITIONAL (P0=0 P1=23 P2=0, 23 findings)
- iter 06 — skill:system non-playbook refs: CONDITIONAL (P0=0 P1=9 P2=13, 22 findings)
- iter 07 — agents frontmatter + body path refs: CONDITIONAL (P0=0 P1=4 P2=0, 4 findings)
- iter 08 — commands frontmatter + body path refs: FAIL (P0=2 P1=6 P2=1, 9 findings)
- iter 09 — SKILL.md structured paths (scripts/assets/refs): PASS (P0=0 P1=0 P2=0, 0 findings)
- iter 10 — cross-skill references (skill A → skill B): FAIL (P0=1 P1=5 P2=1, 7 findings)
