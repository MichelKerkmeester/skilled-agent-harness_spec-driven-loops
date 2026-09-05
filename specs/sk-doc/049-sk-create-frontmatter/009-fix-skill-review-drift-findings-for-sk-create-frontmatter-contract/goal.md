---
title: "Goal: Fix the skill-review drift findings in the sk-create-frontmatter contract"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "phase 009 goal"
  - "contract drift directive"
  - "frontmatter remediation criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Closed every criterion from the working tree at the end of the session"
    next_safe_action: "Commit the phase, then run the two-pass version apply the standard describes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-049-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Fix the skill-review drift findings in the sk-create-frontmatter contract

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short, because
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every enforcement claim in the frontmatter contract true of the code that enforces it, make every declared trigger the advisor can score reach the mode, and bring the hub that hosts the mode inside the budget the mode itself documents.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The contract is corrected to the code. No validator is changed to match the contract |
| D2 | A trigger the scorer cannot score is not re-added in another spelling until the spelling is proved to route. The unscoreable form is recorded against the scorer with the command that shows it |
| D3 | The hub description is trimmed by the contract's own drop list and keep list, and held to a baseline of hub-shaped prompts plus the canary's route-gold rows |
| D4 | A hub `SKILL.md` edit carries its compiled-routing refresh and canary re-pin in the same pass, with the guard read stale before and fresh after |
| D5 | Packet documents that contradict the closed state are reconciled. Phase 008's unauthored plan body is left as it validated, and recorded |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

This is a leaf phase and binds no child goal. The parent directive in `../goal.md`
outranks it, and its decision D4, remeasure rather than soften, is the one this
phase leans on most.

**Precedence.** Decisions above outrank the detail in `spec.md`, and that detail
outranks any summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `rg -n '20 lines|10-200|max_length|suggest_removal' .opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` returns nothing but the sentence that says blocks over 20 lines exist and pass
- [x] `node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs --help` lists `gate`, and the engine tests pass
- [x] `package_skill.py --check --strict` on the mode reports `Result: PASS` with zero warnings, and `validate_document.py` exits 0 on every mode document
- [x] The advisor routes `version field` and `trigger phrases` to `sk-create-frontmatter` above the 0.82 floor on their own signal, and `trigger_phrases` is recorded as scoring zero with the advisor generation
- [x] The sk-doc hub description is at most 130 characters, the description audit's project total has more than 400 characters of headroom under 8,000, and the eight hub-shaped baseline prompts route identically before and after
- [x] `compiled-route-guard.cjs` reports sk-doc fresh, `compiled-route-sync.cjs --verify` reports the move simulation OK, and the authored canary reports `REAL-GREEN`
- [x] `validate.sh --strict` prints `RESULT: PASSED` for the parent, phase 008 and this phase, and the parent `goal.md` progress table names phase 009 as done
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Baselines | Done | 26 prompts at advisor generation 593, all `live`, recorded in `implementation-summary.md` section 4. Audit total 7,885. Guard all five hubs fresh |
| Contract corrected | Done | Nine sites in the field reference. The residue grep returns only the new sentence that names the over-20-line blocks |
| Engine usage text | Done | `--help` lists `gate`. Tests 23 passed, 0 failed |
| Mode shape | Done | Sections 7 and 8 added to `SKILL.md`, overview added to `references/README.md` |
| Routing vocabulary | Done | `trigger phrases` in the registry, the hub router, `ROUTER.md`, the keyword list and stage one. `version field` in stage one. Replay at generation 596: `version field` 0.8917, `trigger phrases` 0.9034 with the compiled target, `trigger_phrases` still nothing |
| Hub description | Done | 639 to 130 characters. Audit total 7,376, headroom 624. Eight baseline hub prompts identical after |
| Compiled routing | Done | Guard `stale-manifest` after the edit, runtime manifest re-minted to `fbd5b481...`, authored copy matched, guard fresh, sync verify OK |
| Packet reconciliation | Done | Parent `goal.md` and `spec.md`, phase 008 titles, session id and 44 checklist lines |

### Deviations and findings

| Item | Note |
|------|------|
| The scaffolder emitted empty child bodies with a success banner | `create.sh --phase --parent` twice, and the standard `--level 3` path once, produced one-line or absent markdown at exit 0 with `Created Successfully`. Phase 009's documents were authored against phase 008's validated shape instead. Recorded for `system-spec-kit`, not fixed here |
| The canary tooling exists in two copies | The runtime copy under `.opencode/bin/lib/compiled-routing/` lacks the `activation/` inputs and fails on `manifest.prior.json`. The authored copy under `specs/sk-doc/019-skill-routing-refactor/.../009-parent-hub-rollout/007-sk-doc/` is the one that re-pins. A first run against the wrong copy left a `compiled/` directory that was removed before anything else ran |
| The advisor scores one alias at zero | `trigger_phrases` returns no recommendation even at a 0.5 confidence threshold, while `importance_tier` scores 0.485 on the explicit-author lane from the same three files. The normalizer at `lib/scorer/text.ts` folds underscores to spaces, so the vocabulary is present. The mechanism is inside the scorer and is recorded, not patched |
| Phase 008's plan body was never authored | It carries the template's placeholders and validated that way. Left as is, because writing a plan for closed work after the fact would be fabrication |
<!-- /ANCHOR:log -->
