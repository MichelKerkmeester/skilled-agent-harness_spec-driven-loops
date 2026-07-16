# Iteration 011 — AC assertion-format gap (T1 prerequisite)

**Focus:** peck story.md AC assertion format vs spec-kit AC columns/Given-When-Then + what 002-self-check-templates shipped — is AC-format normalization a T1 prerequisite?
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.72.

## Findings
- **[F-011-01]** 002 did NOT standardize peck's AC assertion format (`[precondition]+[action]→[outcome]`, each AC automated-test verifiable) — 002 scoped ONLY self-check/failure-mode blocks + excluded AC-coverage/T1 (peck `story.md:21-27` vs `002/spec.md:63,99-103`). GAP real. **ADAPT** · M · **T1 prerequisite: yes** · blast: spec.md.tmpl + checklist wording.
- **[F-011-02]** L1/L2 requirement ACs are verification PLACEHOLDERS (`[How to verify it's done]`), not assertion-shaped (`spec.md.tmpl:89-97,227-235`). **ADOPT** for L1/L2 normalization · S/M · **T1 prerequisite: yes** (non-mechanical ACs block deterministic coverage).
- **[F-011-03]** L3/L3+ already have Given/When/Then user-story ACs, so the gap isn't total — but their main requirements TABLE still uses the non-assertion placeholder (`spec.md.tmpl:445-453,532-542,771-772`). GAP partial. **ADAPT** · S · **T1 prerequisite: yes** (mixed formats make the coverage parser level-dependent).
- **[F-011-04]** checklist confirms completion but doesn't require AC→test mapping; peck moves non-automatable requirements to Notes (`checklist.md.tmpl:69-76,427-434`). GAP partial. **ADAPT** · S/M · **T1 prerequisite: yes**.
- **[F-011-05]** 002 itself is NOT shipped — its impl-summary says planned/pending; manifest grep shows AC headings only, no self-check text (`002/implementation-summary.md:51-58,94-98`). GAP real. **ADAPT** · M · relying on 002 as "shipped" would skip a needed prerequisite.

## Ruled out
- spec-kit already has an AC column across levels — T1 needn't invent an AC location.
- L3/L3+ already model Given/When/Then — the direction is format TIGHTENING, not replacement.
- checklist already has a verification home — the missing part is automated-test mappability.

## Verdict contribution
**AC-format normalization IS a real prerequisite for the T1 coverage gate.** The T1 packet (008) must include a light AC-assertion-format sub-phase (ADAPT L1/L2 placeholders → mechanical precondition+action→outcome; tighten L3 requirement tables) BEFORE the AC_COVERAGE rule can deterministically parse coverage. Also flags that 002 is NOT yet implemented (coordination note for the proposal).
