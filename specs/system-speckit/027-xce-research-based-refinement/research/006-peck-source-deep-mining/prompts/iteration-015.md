DEEP-RESEARCH — CROSS-MODEL VERIFY (MiniMax M3)

# Iteration 015 — Adversarially verify T1 adoptability + the AC-format prerequisite

## Task
Independently stress-test two prior gpt-5.5-fast findings: (iter 008) "the deferred T1 per-AC ≥90% coverage gate is NOW adoptable as a reuse-heavy staged packet"; and (iter 011) "T1 needs an AC-assertion-format-normalization prerequisite because 002/T3 never standardized AC shape and 002 is still pending." Try to find blockers or overstatements.

## Instructions
1. Read (spec-kit root `.opencode/skills/system-spec-kit/`): `templates/manifest/checklist.md.tmpl` (~69-76), `references/validation/validation_rules.md` (EVIDENCE_CITED ~424-453; section rules), `templates/manifest/spec.md.tmpl` (AC columns ~89-97; Given/When/Then ~526-543), `deep-review/SKILL.md` (~310-367 verdict + traceability). peck: `external/peck-master/src/assets/agents/acceptance-reviewer.md:36-42`, `external/peck-master/src/assets/templates/story.md:21-35`. Prereq evidence: `027.../001-peck-teachings-adoption/002-self-check-templates/{spec.md,implementation-summary.md}`.
2. Reach a verdict on each:
   - C1: T1 is "reuse-heavy" — AC location, evidence tokens, and a fresh-context reviewer already exist (so the packet adds a table + a coverage rule + a binding, not new infra).
   - C2: a deterministic `AC_COVERAGE` rule (covered/total ≥ floor 0.9) is feasible given current AC structure — OR is the AC text too unstructured to parse reliably (making it harder than "reuse-heavy")?
   - C3: AC-format normalization is a REAL prerequisite (002 did not ship it AND 002 is still pending).
3. Identify any blocker the prior run understated (parser difficulty, deep-review binding cost, false-block risk, level-opt-in conflicts).

## Do's
- READ-ONLY. Cite every claim as `file:line`. Max ~12 tool calls.
- Reach INDEPENDENT verdicts {CONFIRMED | REFUTED | PARTIAL | UNKNOWN}.
- If T1 is harder/easier than "reuse-heavy", say so with evidence.

## Don'ts
- Do NOT modify, create, or write any file.
- Do NOT assume the prior verdict is correct — verify against the live templates/rules.
- Do NOT dispatch sub-agents; do NOT exceed 12 tool calls.

## Examples
Output exactly:
### VERDICTS
`[V-015-C1..C3] CONFIRMED|REFUTED|PARTIAL|UNKNOWN — claim — evidence `file:line` — reasoning`
### NEW_CONSIDERATIONS
Blockers/risks the prior run understated, or a simpler adoption path. 0-3 bullets with cites.
### METRICS
agreement: AGREE | DISAGREE | MIXED (vs prior ADOPT-AS-PACKET + AC-format-prereq)
newInfoRatio: <0.0-1.0>
status: complete
sources: <file:line list>

## Context
- Cross-model verification (MiniMax M3) over a gpt-5.5-fast run on peck-master. Prior docs: `research/006-peck-source-deep-mining/iterations/iteration-008.md`, `iteration-011.md`.
- Spec folder `specs/system-spec-kit/027-xce-research-based-refinement` pre-approved; skip Gate 3 — you write NOTHING.
