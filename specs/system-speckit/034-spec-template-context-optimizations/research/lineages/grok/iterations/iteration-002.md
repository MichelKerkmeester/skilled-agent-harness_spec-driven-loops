# Iteration 2: Agent Engineering harness vs Gate 3 / Levels / validate.sh / Iron Law

## Focus

Map Agent Engineering harness patterns (Default-FAIL, fresh-context evaluator, self-authored handoff, complexity-matches-task) onto documentation logic — Gate 3 classifier, Documentation Levels 1–3+, `validate.sh`, doc workflow — and classify plan-adherence gaps. Broaden angle (max-iterations stopPolicy; convergence telemetry only).

Route proof: `mode=research`, `target_agent=deep-research`, executor `cli-cursor`/`cursor-grok-4.5-high`. Write authority: lineage artifact_dir only.

## Actions Taken

1. Read Gate 3 classifier contracts (`classifyPrompt`, writeBoundary, SPEC_ROOTS).
2. Inspect `validate.sh` header + grep for scope/plan-adherence rules (none).
3. Map harness patterns to AGENTS Iron Law, deep-review LEAF read-only, handover tmpl, recommend-level / Levels rules.
4. Cross-check SKILL.md ALWAYS/NEVER for completion and scaffold discipline.

## Findings

1. **Default-FAIL ≈ Iron Law + Completion Verification — already exists.** “NO completion claims without running stack-appropriate verification”; VERIFY law; Completion Verification Rule requires `validate.sh --strict` + checklist evidence before done. [SOURCE: `AGENTS.md:11`] [SOURCE: `AGENTS.md:23`] [SOURCE: `AGENTS.md:182-193`] [SOURCE: `system-spec-kit/SKILL.md:462,480,502`]
   - **Classification:** `already-exists` / axis: **plan-adherence** / surface: **doc-logic**
   - **Refute:** Re-implementing Default-FAIL as a new framework concept.

2. **Fresh-context evaluator ≈ deep-review LEAF (read-only, fresh window) — already exists.** Deep-review: fresh context per pass; target files read-only; LEAF cannot modify config or dispatch nested agents. [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:3,298,372,379,384`]
   - **Classification:** `already-exists` / axis: **plan-adherence** + **general-opt** / surface: **doc-logic** (via deep-loop integration) — **not-applicable** to reinventing a second evaluator inside templates.

3. **Self-authored handoff ≈ `handover.md` + continuity ladder — already exists.** Handover template includes next safe action, in-progress checklist, notes for next session; SKILL ALWAYS #11 suggests handover on session-end keywords; resume ladder is documentation-owned. [SOURCE: `templates/manifest/handover.md.tmpl:86,107,119`] [SOURCE: `SKILL.md:461`] [SOURCE: `AGENTS.md` §6 continuity ladder]
   - **Classification:** `already-exists` / axis: **plan-adherence** / surface: **templates** + **doc-logic**

4. **Complexity-matches-task ≈ Documentation Levels 1–3+ + recommend-level — already exists.** ALWAYS #1 determine level before changes; examples map task size→level; `recommend-level.sh` referenced; phase qualification requires complexity≥25 AND level≥3. [SOURCE: `SKILL.md:43-45,111,451,466`]
   - **Classification:** `already-exists` / axis: **general-opt** / surface: **doc-logic**
   - Matches Agentless counterargument in source doc: simple tasks stay Level 1.

5. **Gate 3 is a write-boundary classifier, not a context reducer — already exists for plan adherence, N/A as token reducer.** `classifyPrompt` returns `triggersGate3`, `writeBoundary`, SPEC_ROOTS `['specs','.opencode/specs']`; file-write vs read-only override. [SOURCE: `shared/gate-3-classifier.ts:106-121,136,838-844`]
   - **Classification:** `already-exists` (adherence) / `not-applicable` (as Reducer Engineering substitute) / axis: **plan-adherence** / surface: **doc-logic**

6. **Genuine gap: `validate.sh` does not enforce plan/scope adherence against the working tree.** Orchestrator validates structure, placeholders, continuity freshness, metadata integrity — no rule comparing git diff paths to `### In Scope` / Files to Change. Grep of `validate.sh` for scope/plan-adherence tokens returned no matches. [SOURCE: `scripts/spec/validate.sh:1-50` (rule inventory: structure/placeholders/continuity/metadata)] [SOURCE: negative grep]
   - **Classification:** `genuine-gap` / axis: **plan-adherence** / surface: **doc-logic**
   - **Implementable idea:** Optional `validate.sh` / CI gate: parse `spec.md` In Scope / Files to Change anchors → fail if staged/unstaged paths fall outside allowlist (with explicit exemption list). Blast-radius: medium; does not replace SCOPE LOCK prose.

7. **Genuine gap: plan adherence remains prompt-enforced (SCOPE LOCK / PLAN-WORKFLOW LOCK) without a machine check at iteration boundaries.** Deep-loop write-containment exists for research packets, but ordinary `/speckit:implement` sessions rely on AGENTS.md SCOPE LOCK text. [SOURCE: `AGENTS.md` SCOPE LOCK / PLAN-WORKFLOW LOCK sections] [SOURCE: deep-loop `write-containment.ts` is research/review scoped, not general implement]
   - **Classification:** `genuine-gap` / axis: **plan-adherence** / surface: **doc-logic**
   - Related to finding 6; may share one implementation.

8. **Partial: Gate 3 / AGENTS framework text is large (~887 LOC classifier + multi-kLOC root docs) — optimization is general context, not missing harness.** Classifier itself is not injected wholesale each turn; AGENTS/CLAUDE are. Reducing root-doc bloat is adjacent (agents/004 track exists) and outside primary templates surface — classify carefully. [SOURCE: `gate-3-classifier.ts` wc 887] [SOURCE: charter Out of Scope: non-speckit surfaces except as cited evidence]
   - **Classification:** `already-exists` as a known bloat concern elsewhere / `not-applicable` as a new “Reducer Engineering” fix inside templates / axis: **context-reduction** / surface: **doc-logic** (cite only)

## Ruled Out

- Adding a second Default-FAIL layer into templates — Iron Law + validate.sh already embody it.
- Building a fresh-context evaluator inside system-speckit templates — deep-review already provides it.
- Using Gate 3 as a synthesis-token reducer — wrong abstraction.

## Dead Ends

- Searching validate.sh for automatic In Scope enforcement: no hits; confirms gap rather than buried feature.

## Edge Cases

- Level 1 skips checklist completion verification — intentional complexity match; not a Default-FAIL hole for L1.
- Fan-out write containment already enforces artifact_dir for this lineage — stronger than prompt SCOPE LOCK, but scoped to deep-loop.

## Convergence telemetry (not a stop)

- Rolling novelty still high (harness→doc-logic mapping new). Under `stopPolicy:max-iterations`, continue to memory surface rather than synthesize.

## Sources Consulted

- `AGENTS.md:11,23,182-193`
- `SKILL.md:43-45,111,451-466,480,502`
- `gate-3-classifier.ts:106-121,136,838-844`
- `validate.sh:1-50`
- `deep-review/SKILL.md:3,298,372,379,384`
- `handover.md.tmpl:86,107,119`

## Assessment

- New information ratio: 0.85
- Novelty justification: Six of seven load-bearing classifications are new to this lineage; one (Iron Law) partially foreshadowed by charter hypothesis.
- Questions addressed: Q3 primarily; Q2 extended on doc-logic.
- Questions answered: Harness patterns largely already-exists on doc-logic; primary genuine gap is machine-checked scope/plan adherence.

## Reflection

- What worked: Negative evidence on validate.sh scope checks is as important as positive prior-art hits.
- What failed: None.
- Ruled out: Re-skinning Agent Engineering patterns that already map 1:1 onto Iron Law / deep-review / Levels / handover.

## Recommended Next Focus

Probe `memory_context` / `memory_search` token-budget + dedup paths; finish Q4/Q5 with a ranked implementable shortlist and explicit refutation list across axes (a)/(b)/(c).
