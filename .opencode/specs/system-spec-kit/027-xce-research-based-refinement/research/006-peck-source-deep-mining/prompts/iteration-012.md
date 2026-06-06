DEEP-RESEARCH

# Deep-Research Iteration 012 — T4 current-state generalization residue + product.md analog

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 mined peck's README (2026-06-02) -> T1-T4; T4 (current-state discipline) was "ADOPTED" via child `001-peck-teachings-adoption/003-current-state-discipline`. This focus revisits T4 to find the RESIDUE between peck-as-implemented and what 003 shipped. Justify net-new carefully. Do NOT re-derive T1/T2/T3.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- adopted child: `specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/003-current-state-discipline/`
- spec-kit:    `.opencode/skills/system-spec-kit/`

## FOCUS — answer ONLY this
Compare peck's current-state discipline against what 003 shipped. Read:
- peck `external/peck-master/src/assets/templates/product.md` and `external/peck-master/README.md:44-58` (product.md "only ever describes what currently exists, so it's always accurate"; the planner reads it before each story; "Known Limitations - Honest, not aspirational")
- what shipped: `001-peck-teachings-adoption/003-current-state-discipline/{spec.md,implementation-summary.md}` — did 003 generalize current-state-only discipline BEYOND phase-parents (to implementation-summary.md and non-parent spec.md), or stay narrow/advisory?
- live spec-kit: the `PHASE_PARENT_CONTENT` rule in `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` + `scripts/rules/check-phase-parent-content.sh`; and `description.json` (metadata, not a narrative current-state doc)

Determine the RESIDUE: (a) is current-state-only discipline now generalized to all long-lived docs, or still phase-parent-scoped? (b) does spec-kit have a CURATED "what the system is NOW" narrative surface analogous to peck's product.md (distinct from description.json metadata and from the per-packet spec.md)? For each residue piece: SHIPPED-ALREADY (yes/partial/no + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; effort/risk/blast-radius. Be honest if 003 already covered it (SKIP).

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-6 findings. Each: `[F-012-MM] <claim>` with a peck `file:line` AND a spec-kit/003 `file:line`. For each: SHIPPED-ALREADY?; VERDICT; EFFORT; RISK; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: which T4 mechanics 003 ALREADY shipped (not net-new), cited.
### METRICS
newInfoRatio: <0.0-1.0 — novelty is the RESIDUE delta, not T4 itself>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
