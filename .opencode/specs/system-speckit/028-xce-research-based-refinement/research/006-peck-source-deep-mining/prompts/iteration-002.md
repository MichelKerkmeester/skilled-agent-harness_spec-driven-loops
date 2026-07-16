DEEP-RESEARCH

# Deep-Research Iteration 002 — verdict-freshness binding (code change invalidates green)

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined peck's README (2026-06-02) -> teachings T1-T4; T2/T3/T4 adopted (children `001-peck-teachings-adoption/{002,003,004}`); T1 (per-AC coverage gate) DEFERRED. Mine peck-master's ACTUAL SOURCE for NET-NEW mechanisms beyond T1-T4. Do NOT re-derive T2/T3/T4; assess only the DELTA vs what spec-kit already has.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- spec-kit:    `.opencode/skills/system-spec-kit/`
- root docs:   `CLAUDE.md`, `AGENTS.md`

## FOCUS — answer ONLY this
peck binds reviewer verdicts to the CURRENT commit and treats any later code change as invalidating the verdict. Read:
- peck `external/peck-master/src/assets/agents/implementer.md` (the rule "Code changes after a reviewer run invalidate prior verdicts - commit and re-run both"; the `<complete>` block "Report only when all required verdicts are from the current HEAD commit and the tree is clean")
- spec-kit completion gate: `CLAUDE.md` section 2 COMPLETION VERIFICATION RULE; `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (what it actually checks — skim, don't exhaustively trace); `.opencode/skills/system-spec-kit/constitutional/verify-before-completion-claims.md`
- continuity fingerprint surface: search `spec.md` `_memory.continuity.session_dedup.fingerprint` semantics in `.opencode/skills/system-spec-kit/` (e.g. memory/save validation or FRONTMATTER_MEMORY_BLOCK rule) — is the fingerprint bound to file content, and is it checked on completion?

Determine: After spec-kit marks `checklist.md` items `[x]` "with evidence" and `validate.sh --strict` passes, is there ANY mechanism that INVALIDATES that completion state if the in-scope files are subsequently edited (i.e., a content-hash / HEAD binding)? Is "verdict freshness bound to a content fingerprint or HEAD" a real gap vs peck? Could spec-kit's existing `session_dedup.fingerprint` be repurposed for this, or is a new check needed?

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-7 findings. Each: `[F-002-MM] <claim>` with BOTH a peck `file:line` and a spec-kit `file:line`. For each candidate mechanism: GAP (real/partial/none + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS (which spec-kit files/rules change).
### RULED_OUT
1-3 bullets: what you checked that is NOT net-new (already shipped), each cited.
### METRICS
newInfoRatio: <0.0-1.0 vs T1-T4 baseline>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
