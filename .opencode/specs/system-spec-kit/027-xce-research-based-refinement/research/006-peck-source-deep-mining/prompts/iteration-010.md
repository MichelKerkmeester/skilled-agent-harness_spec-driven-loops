DEEP-RESEARCH

# Deep-Research Iteration 010 — reflection bounded-cap / promotion residue (T2 delta)

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined peck's README (2026-06-02) -> teachings T1-T4; T2 (bounded reflection) was "ADOPTED" via child `001-peck-teachings-adoption/004-constitutional-rule-review`. This focus revisits T2 to find what the ADOPTION actually shipped vs what peck's reflect mechanism contains — the RESIDUE. Justify net-new carefully (this is the riskiest "is it really new?" focus).

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- adopted child: `specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/004-constitutional-rule-review/`
- spec-kit:    `.opencode/skills/system-spec-kit/`

## FOCUS — answer ONLY this
Compare peck's reflect mechanism against what spec-kit's 004 child actually shipped. Read:
- peck `external/peck-master/src/assets/skills/reflect/SKILL.md` (the THREE mechanics: (i) a HARD SIZE CAP "Keep total entries in docs/learnings.md under 15" + "Log at most 5 items per session"; (ii) auto-PROMOTION on recurrence "Has it already happened twice? -> It's a pattern now. Promote to AGENTS.md and remove from learnings"; (iii) PRUNE-when-no-longer-true "If an existing learning is no longer true... remove it")
- what shipped: `001-peck-teachings-adoption/004-constitutional-rule-review/{spec.md,implementation-summary.md,plan.md}` — determine whether 004 shipped (i) a bounded size cap on standing guidance, (ii) the twice->promote auto-recurrence signal, (iii) the prune-when-stale lifecycle, OR only a read-only "last-confirmed review surface"
- live spec-kit: `.opencode/skills/system-spec-kit/constitutional/` (the static rule tier), the save-quality-gate (`mcp_server/lib/validation/save-quality-gate.ts`) and FSRS decay exemption for constitutional rules

Determine the RESIDUE: which of peck's three reflect mechanics is NOT yet in spec-kit after the 004 adoption? For each residue piece, is it net-new and worth ADOPT/ADAPT/DEFER (e.g., a bounded size cap on a curated guidance surface; an auto-promotion-on-recurrence signal in the dedup/reconsolidation path; a constitutional prune/demote lifecycle)? Be honest if 004 already covered it (then SKIP).

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-6 findings. Each: `[F-010-MM] <claim>` with a peck `file:line` and a spec-kit/004 `file:line`. For each residue piece: SHIPPED-ALREADY? (yes/partial/no + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: which reflect mechanics 004 ALREADY shipped (so not net-new), cited.
### METRICS
newInfoRatio: <0.0-1.0 — novelty is the RESIDUE delta, not T2 itself>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
