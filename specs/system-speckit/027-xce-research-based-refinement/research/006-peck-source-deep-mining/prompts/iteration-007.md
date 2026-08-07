DEEP-RESEARCH

# Deep-Research Iteration 007 — CLI command mechanics (story-load FILES manifest, verdict ledger)

You are a LEAF deep-research analyst running READ-ONLY. Do NOT dispatch sub-agents. Do NOT modify, create, or write ANY file — the orchestrator writes all artifacts. Max ~12 tool calls. Cite EVERY claim as `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only analysis, you write NOTHING).

## MISSION (shared across this run)
027 already mined peck's README (2026-06-02) -> teachings T1-T4; T2/T3/T4 adopted; T1 DEFERRED. Mine peck-master's ACTUAL SOURCE (the .ts command implementations — never read before) for NET-NEW mechanisms beyond T1-T4. Do NOT re-derive T2/T3/T4.

Repo roots (relative to --dir):
- peck source: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`
- spec-kit:    `.opencode/skills/system-spec-kit/`

## FOCUS — answer ONLY this
peck's CLI commands implement context-loading and audit mechanics. Read:
- peck `external/peck-master/src/commands/story.ts`, `external/peck-master/src/commands/review.ts`, `external/peck-master/src/commands/init.ts`, `external/peck-master/src/lib/git.ts`, `external/peck-master/src/lib/config.ts`
- spec-kit resume/audit mechanics: `.opencode/skills/system-spec-kit/SKILL.md` (resume ladder), `.opencode/commands/speckit/resume.md`, the `graph-metadata.json` `derived.last_active_child_id` pointer, and how `/speckit:resume` enumerates a packet's files

Determine which peck mechanics are NET-NEW and separable from peck's rejected philosophy:
(a) `peck story load <id>` emits JSON with `GIT_BRANCH_NAME` + `FILES` (paths to EVERY file in the story dir) so the implementer reads all context in ONE shot — is a "packet load -> FILES manifest" useful for spec-kit `/speckit:resume` (vs the current ladder of reads)?
(b) branch-per-story checkout on load;
(c) every agent output committed as an EMPTY git commit -> `git log` is the audit trail; `peck <role>-review commit` writes the verdict to git.
NOTE: the 2026-06-02 analysis REJECTED "git-as-sole-audit via empty commits" as an anti-teaching for spec-kit (spec-kit's audit is richer + not git-coupled). RE-CONFIRM that rejection, but separately assess whether the FILES-manifest-on-load idea (a) is net-new and adoptable independent of the git-audit idea. Verdict per mechanic.

## DELIVER (plain text only — orchestrator writes artifacts)
### FINDINGS
3-7 findings. Each: `[F-007-MM] <claim>` with a peck `file:line` and a spec-kit `file:line`. For each: GAP (real/partial/none + cite); VERDICT ADOPT | ADAPT | DEFER | SKIP; EFFORT S/M/L; RISK low/med/high; BLAST-RADIUS.
### RULED_OUT
1-3 bullets: what is NOT net-new or was already rejected as anti-teaching, cited.
### METRICS
newInfoRatio: <0.0-1.0 vs T1-T4 baseline>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line>

Be terse and evidence-dense. No preamble.
