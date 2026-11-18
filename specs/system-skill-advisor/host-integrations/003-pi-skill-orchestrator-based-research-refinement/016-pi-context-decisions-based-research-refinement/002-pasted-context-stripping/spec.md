---
title: "Feature Specification: Pasted-Context Stripping Before Scoring"
description: "A pasted earlier reply in front of a task flips the advisor's top skill. One short design step picks the smallest stripping rule that fixes the confirmed probe, and the scorer applies it so every runtime gets it."
trigger_phrases:
  - "pasted context stripping"
  - "phase 2 pasted context stripping"
  - "advisor pasted reply flips route"
  - "strip reported speech before scoring"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Pasted-Context Stripping Before Scoring

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 005-plan-validation-research |
| **Successor** | 004-crash-path-fallback |
| **Handoff Criteria** | The probe pair in Measured Behavior routes sk-code first for both prompts, the new corpus row passes and every routing gate named in `plan.md` is green after a re-baseline whose only delta is that row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the pi-context-decisions refinement packet. It implements N3 from `../001-deep-research/research/review-fable-5-2.md` section 3, in the form the orchestrator's verification in `review-overengineering-opus-high.md` requires.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

**Scope Boundary**: One stripping rule, applied once where every runtime and every corpus runner meets the scorer. No change to the hooks, the OpenCode plugin or the Python local scorer.

**Dependencies**:
- The built advisor runtime under `runtime/dist/`, rebuilt after the change, so the CLI probe reaches the new code.
- The re-baseline scripts named in `plan.md` for the corpus pins one new row moves.

**Deliverables**:
- One exported stripping function and its two call sites. Phase 003 imports the same function.
- One new corpus row that fails today and passes after the change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a user pastes an earlier reply in front of a task, the advisor scores the pasted text as if it were the task. A reply that names sk-doc and sk-git moves a plain refactor request from sk-code to sk-doc, and the hook then routes the model to the wrong skill. Nothing strips such text today. The only cleanup in the Claude hook is a 64 KB byte cap (`hooks/claude/user-prompt-submit.ts:174-193`), and the policy canonicalizer only folds Unicode and collapses whitespace (`runtime/lib/prompt-policy.ts:91-93`).

### Purpose
A task that follows a pasted earlier reply routes the same as the task alone, on every runtime.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 from the repository root. The first line is the task alone, the second is the same task after the pasted reply.

```text
$ for p in 'Refactor the session store module to remove duplicated locking code' 'Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code'; do node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "$p" --format json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const d=JSON.parse(s).data;console.log(d.recommendations.map(r=>r.skillId+" "+r.confidence).join(", "))})'; done
sk-code 0.82, sk-doc 0.82, cli-external-orchestration 0.82
sk-doc 0.9268, sk-git 0.82, sk-code 0.82
```

The in-process policy also changes its reason for the pasted prompt, from `work_intent_with_meaningful_tokens` to `explicit_skill_or_governance_marker`, because the pasted text names skills.

These outputs came from the build in place before a merge at 12:27 the same day changed the scorer source. After that merge the CLI refuses the stale build with exit 69 until `npm run build` runs in the advisor runtime folder. Scoring the merged source in-process under the runtime's vitest gives the same top skills and floor flags, with `sk-doc` at 0.9364 for the pasted prompt.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Choose, in one short design step, the smallest rule that drops a leading reported-speech or quoted span before a task marker, tested against the probe pair and the existing corpora.
- Add that rule as one exported function in `runtime/lib/prompt-policy.ts`, exported so phase 003's guard and bench can call it. Call it in the recommend handler before the semantic embedding and the cache key are built, and at the entry of `scoreAdvisorPrompt` (`runtime/lib/scorer/fusion.ts:1274`) so the corpus runners get it too.
- Add one corpus row with the pasted-reply prompt and gold label `sk-code`.
- Re-baseline the pins that the new row moves, so the only delta in each baseline is that row.

### Out of Scope
- Stripping only the advisor's own output lines - the orchestrator's probe shows plain prose flips the route without any advisor line, so that rule fixes nothing here.
- The Claude hook's `normalizePrompt` - it covers only the runtimes that load that handler and never reaches the OpenCode plugin.
- `runtime/lib/skill-advisor-brief.ts` - no runtime hook calls `buildSkillAdvisorBrief`, so a change there leaves the probe unchanged (see `plan.md` section 3).
- The Python local scorer used when the daemon is unreachable (`runtime/skill-advisor-cli.ts:1456-1468`) - a degraded path, named as a known limit.
- Discounting skill names inside every quoted span - without a reliable paste delimiter in the hook input that rule is a guess.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/prompt-policy.ts` | Modify | Add one exported stripping function |
| `runtime/handlers/advisor-recommend.ts` | Modify | Strip once before the embedding (`:569`) and the cache key (`:535-536`), and pass the result on |
| `runtime/lib/scorer/fusion.ts` | Modify | Call the function at the entry of `scoreAdvisorPrompt`, for callers that skip the handler |
| `runtime/scripts/routing-accuracy/labeled-prompts.jsonl` | Modify | Add one row, gold `sk-code` |
| `runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Recapture for the new corpus hash and counts |
| `runtime/bench/scorer-calibration-baseline.json` | Modify | Rewrite for the new corpus hash and row count |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Recapture only if the new row diverges between the Python and TypeScript scorers |
| `runtime/tests/legacy/advisor-corpus-parity.vitest.ts` | Modify | Amended 2026-11-18 by the operator: the corpus size pin at `:114` and the size named in the describe title and two comments move from 195 to 196. The pin was missed in planning |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The probe pair routes sk-code first for both prompts | After the rebuild, the Measured Behavior command prints `sk-code` as the first skill on both lines |
| REQ-002 | Existing routing corpora and the scorer ratchet stay green | `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts` from `runtime/` exits 0, and each recaptured baseline differs from the old one only by the new row |
| REQ-003 | One new corpus row covers the case | The new row in `labeled-prompts.jsonl` routes `sk-code` through `scoreAdvisorPrompt` after the change and `sk-doc` before it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The rule changes no existing corpus prompt | The design step's match count over every `runtime/scripts/routing-accuracy/*.jsonl` and `runtime/scripts/fixtures/*.jsonl` prompt is 0, or each match is listed and reviewed in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both probe prompts route `sk-code` first through the CLI, which is the path the Claude, Pi, DSH, Vibe and OpenCode hooks all use.
- **SC-002**: The named corpus gates pass, and the full corpus top-1 count in `scorer-eval-baseline.json` rises by exactly one.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The CLI answers from a running daemon, which loads code when it starts | The probe shows the old route until a daemon from the new build answers | Rebuild, then confirm the daemon serving the probe started after the build before reading REQ-001 |
| Risk | The rule strips real task text, for example a prompt that legitimately starts with a quoted line | Med | Require both a reported-speech or quote cue at the start and a task marker after it, and run REQ-004's match count before the code change |
| Risk | The semantic lane looks up the prompt embedding by exact prompt text (`runtime/lib/scorer/lanes/semantic-shadow.ts:249`, `:328`). A strip inside the scorer alone would make that lookup miss, and the lane would score nothing for a stripped prompt | Med | Strip in the handler before `withSemanticShadowPromptEmbedding` (`runtime/handlers/advisor-recommend.ts:569`), so the embedding, the cache key and the scorer all see the same text. The scorer-entry call then changes nothing for handler traffic |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact cue words and task markers form the rule? Decided in task T002 against the probe pair, a `You said:` variant of the same prefix and REQ-004's match count.
- How does the implementer confirm the daemon serving the probe started after the rebuild? The CLI help names no stop or restart command. Decided in task T013.
<!-- /ANCHOR:questions -->

---
