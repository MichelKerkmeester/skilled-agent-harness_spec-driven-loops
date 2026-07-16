DEEP-RESEARCH

# Deep-Research Iteration 005 — anti-verdict-softening + anti-gaming discipline

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined peck's README (2026-06-02) -> teachings T1-T4; T2/T3/T4 adopted (children `001-peck-teachings-adoption/{002,003,004}`); T1 (per-AC coverage gate) DEFERRED. Mine peck-master's ACTUAL SOURCE for NET-NEW mechanisms beyond T1-T4. Do NOT re-derive T2/T3/T4; assess only the DELTA vs spec-kit.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- spec-kit:    `.opencode/skills/system-spec-kit/`
- root docs:   `CLAUDE.md`, `AGENTS.md`

## FOCUS — answer ONLY this
peck has SHARP anti-verdict-softening and anti-gaming rules. Read:
- peck `external/peck-master/src/assets/agents/implementer.md` ("Do not relabel a Fail as conditional or partial"; the `<complete>` "If either verdict is Fail, report the blocker instead of claiming completion")
- peck `external/peck-master/src/assets/agents/acceptance-reviewer.md` `<avoid>` block (counting implementation existence as Tested; marking "Partially tested" to inflate the ratio; "Truncating the report - every report must include the Verdict section")
- spec-kit honesty/completion surfaces: `.opencode/skills/system-spec-kit/constitutional/verify-before-completion-claims.md`; `CLAUDE.md` section 1 (Documentation & Honesty: "Never lie or fabricate", "use UNKNOWN"; "Do not frame partial progress as a good stopping point"); the COMPLETION VERIFICATION RULE; `.opencode/skills/deep-review/SKILL.md` verdict handling

Determine: Does spec-kit already encode, at peck's sharpness, (a) "do NOT downgrade/relabel a failing gate to conditional or partial to claim progress", and (b) "a reviewer must ALWAYS emit an explicit Pass/Fail verdict line, even on long/truncated output"? spec-kit has general honesty rules — but are these two SPECIFIC anti-softening rules present in the completion ritual or deep-review output contract, or net-new? Adopt-worthiness as a completion-ritual / deep-review-output rule.

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-7 findings. Each: `[F-005-MM] <claim>` with BOTH a peck `file:line` and a spec-kit `file:line`. For each: GAP (real/partial/none + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: what is NOT net-new (already shipped honesty rule), cited.
### METRICS
newInfoRatio: <0.0-1.0 vs T1-T4 baseline>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
