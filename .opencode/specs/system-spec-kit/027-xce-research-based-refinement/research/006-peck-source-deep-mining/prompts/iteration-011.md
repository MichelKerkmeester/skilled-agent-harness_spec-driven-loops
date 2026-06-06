DEEP-RESEARCH

# Deep-Research Iteration 011 — AC assertion-format gap (prerequisite for T1?)

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 mined peck's README (2026-06-02) -> T1-T4; T2/T3/T4 adopted; T1 DEFERRED but now re-scoped (iteration 008) as a standalone coverage-gate packet. This focus checks a PREREQUISITE for that T1 packet. Do NOT re-derive T2/T3/T4.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- adopted child: `specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates/`
- spec-kit:    `.opencode/skills/system-spec-kit/`

## FOCUS — answer ONLY this
peck writes ACs as mechanically-checkable assertions; the deferred T1 coverage gate depends on ACs being assertion-shaped. Read:
- peck `external/peck-master/src/assets/templates/story.md` (AC assertion format: precondition + action -> observable outcome; "Each task's ACs must be verifiable by an automated test")
- spec-kit AC structure: `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` (L1/L2 "Acceptance Criteria -> how to verify" columns; L3/L3+ Given/When/Then user-story ACs) and `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl`
- what T3 actually shipped: `001-peck-teachings-adoption/002-self-check-templates/spec.md` and `.../implementation-summary.md`

Determine: Did the T3 adoption (002-self-check-templates) ALSO standardize the AC ASSERTION FORMAT (so every AC is mechanically checkable / test-mappable), or did it only add self-check + failure-mode blocks? Is there a residual gap — AC format is NOT uniformly assertion-shaped across levels — that the T1 coverage-gate packet (008) would DEPEND on? Verdict: is "AC-format normalization" a net-new PREREQUISITE sub-phase the T1 packet needs (ADOPT), can T1 rely on existing AC structure (SKIP prerequisite), or is it a light ADAPT?

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-6 findings. Each: `[F-011-MM] <claim>` with a peck `file:line` AND a spec-kit/002 `file:line`. For each: GAP (real/partial/none + cite); VERDICT ADOPT | ADAPT | SKIP; EFFORT S/M/L; RISK; BLAST-RADIUS; and whether it is a T1 prerequisite.
### RULED_OUT
1-3 bullets: what 002/spec-kit ALREADY provides (so not net-new), cited.
### METRICS
newInfoRatio: <0.0-1.0 vs T1-T4 baseline>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
