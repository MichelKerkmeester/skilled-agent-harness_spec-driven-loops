---
title: "Implementation Summary"
description: "Four doctor bridges that were derived, listed and unreachable now route: the helper answers a which-command question and the three root-instruction targets answer a check, embed or restore request, with every advertised phrase proven and no skill score moved."
trigger_phrases:
  - "advisor bridge activation implementation summary"
  - "doctor bridges route"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/003-advisor-bridge-activation"
    last_updated_at: "2026-10-30T18:30:00Z"
    last_updated_by: "code-agent"
    recent_action: "Activated four doctor bridges in both lanes and closed every gate"
    next_safe_action: "None: the packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl"
      - ".skilled/skills/system-skill-advisor/changelog/v0.17.30.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-300-doctor-bridge-activation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which wordings still reach no doctor route after activation, and whose change is that"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-advisor-bridge-activation |
| **Completed** | 2026-10-30 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ask the advisor which doctor command fits a problem and it now answers with `/doctor:helper`, because that bridge was derived for two releases and admitted in none. The same release admits the three `/doctor:agents-md` targets, so a request to fold `CLAUDE.md` into `AGENTS.md`, to check the shipped instruction sections or to undo one embed run reaches the command that does it.

### The four entries, and the three copies they feed

Deriving a bridge and activating it are separate acts, and only the activation list makes an entry routable. Four ids were missing from it in both lanes. Adding them and rerunning the deriver rewrote the bridge inventory, the TypeScript projection and the Python markers, and the deriver's `--check` mode then reported the three copies fresh at 28 doctor routes, 55 generated bridges, and 33 TypeScript against 43 Python active entries, up from 29 and 39.

### The proof, not the edit

The reach probe recomputes the admitted set from the route manifest and the activation list rather than from the generated copy, so it reads the contract instead of the output. It now scores 164 declared phrases and runnable strings across 28 bridges, and every one reaches its own bridge as the top pick or as the first doctor line behind a passing skill. The four new bridges contribute 22 of those rows. Nothing in the manifest needed a phrase change: the wording these routes already declared was servable, and only the admission was missing.

### The slice waves, so a half-shipped bridge cannot pass

The routing slice grew thirteen rows in four waves, one wave per bridge. A wave asserts only when every doctor id it names is active, which is what the wave mechanism was built for. A typed `/doctor:agents-md embed` puts that bridge first, a natural "fold claude md into agents md" keeps `sk-doc` first with the bridge as the second line, and the same shape holds for `check`, `restore` and the helper.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modified | The four activation entries in both lanes |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerated | The inventory copy of the four bridges |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Regenerated | The generated TypeScript projection entries |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Regenerated | The generated Python projection entries |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Modified | Thirteen rows in four new waves |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modified | Version 0.17.30.0 |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.30.0.md` | Created | The release note |
| `.hermes/skills/system-skill-advisor/SKILL.md` | Regenerated | Mirror of the versioned skill file |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modified | Says every derived bridge is active |
| `specs/agents/021-doctor-agents-md/spec.md` | Modified | The phase 3 row and its handoff row |
| `specs/agents/021-doctor-agents-md/graph-metadata.json` | Regenerated | The parent's child pointer |
| `specs/agents/021-doctor-agents-md/003-advisor-bridge-activation/` | Created | This packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The order matters, because each gate can only run on the output of the one before it. Activation first, then the deriver, then the advisor build, because the probe refuses a `dist/runtime` older than its source. The probe ran before the slice rows were written, so the rows were authored against a scorer already known to serve those phrases rather than against a hope.

The slice rows came from the manifest, never from invention: each bridge contributes its runnable command plus two or three of its own declared phrases. Every one of the thirteen was measured through the scorer before it was written down, which is why the second-line rows name the skill that actually stays first (`sk-doc`, in all four cases) instead of a guess.

One measured prompt was left out on purpose. "Something is broken, which doctor fixes it" is a natural way to ask for the helper, and it reaches no doctor route in either lane. The helper's own matcher answers it `NO_MATCH` as well, with `/doctor:setup` as its fallback, so the gap is the matcher's tuned vocabulary and not the activation. A slice row for it would have pinned an abstention inside an activation packet.

### Measurements

Read before and after on the same branch, with the same commands.

| Command | Before | After |
|---------|--------|-------|
| `derive-command-bridges.cjs --check` | `typescriptActive` 29, `pythonActive` 39, `doctorRoutes` 28, `generated` 55 | `typescriptActive` 33, `pythonActive` 43, `doctorRoutes` 28, `generated` 55, `"status": "fresh"` |
| `doctor-phrase-reach.cjs` | `STATUS=OK phrases=142 bridges=24` | `STATUS=OK phrases=164 bridges=28` |
| `capture-scorer-eval-baseline.mjs` | full corpus 155/195, holdout 49/66, ambiguity 19/24, unknown 13, false fire 5 | identical to the committed baseline |
| `vitest run tests/parity tests/scorer` | 42 files, 381 passed, 4 skipped | 42 files, 381 passed, 4 skipped |
| `npm --prefix …/runtime test` | 158 files, 1353 passed, 8 skipped | 158 files, 1353 passed, 8 skipped |
| `doctor/scripts/tests/run-all.sh` | 41 files, 931 tests | 41 files, 931 passed, 0 failed, 7 suites |
| `route-validate.sh` | 24 routes, 5 warnings | 24 routes, 5 warnings, no route edited |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Activate in both lanes in one change | A bridge admitted in one scorer and not the other routes by runtime rather than by wording, and the probe reads the TypeScript lane while the Python fallback reads its own markers |
| No manifest phrase changed | Every declared phrase reached its bridge as soon as it was admitted, so a phrase edit would have been tuning a route that was not broken and would have moved the helper's own measured vocabulary |
| Slice rows measured before they were written | A fixture row is an assertion about the scorer; writing one from the manifest text alone would have discovered a wrong second line at suite time instead of at authoring time |
| One wave per bridge | A shared wave would stop asserting three bridges the moment any one of them left the activation list, which hides the regression it exists to catch |
| No re-capture of the accuracy baseline | Every metric came back identical, so moving the pin would have recorded a change that did not happen and lost the date the fixture hashes were captured under |
| The helper example wording left out of the slice | It reaches no doctor route in either scorer and no entry in the helper's own matcher, so pinning it would assert an abstention in a packet about activation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | `STATUS=OK phrases=164 bridges=28`, exit 0, every one of the four new bridges at `PASS` on all 22 of its rows |
| `node .skilled/…/derive-command-bridges.cjs --check` | `"status": "fresh"`, `changed: []`, `typescriptActive` 33, `pythonActive` 43, exit 0 |
| `vitest run tests/doctor-routing-slice.vitest.ts` | 2 tests passed, exit 0 |
| `capture-scorer-eval-baseline.mjs` | metrics block identical to `scorer-eval-baseline.json`; no metric dropped |
| `vitest run tests/parity tests/scorer` | 42 files, 381 passed, 4 skipped, 0 failed, exit 0 |
| `npm --prefix .skilled/skills/system-skill-advisor/runtime test` | 158 files, 1353 passed, 8 skipped, 0 failed, exit 0 |
| `pytest tests/python` | 8 passed, exit 0 |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | `tests 931`, `pass 931`, `fail 0` over 41 files; `7 suite(s) passed, 0 failed`, exit 0 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | `OK: route-validate — 24 routes validated, 5 warnings`, exit 0 |
| `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS: 65 Hermes skill copies in sync`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` | `RESULT: PASSED` for the parent and both earlier phases plus this child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A problem statement the manifest does not carry still reaches nothing.** "Something is broken, which doctor fixes it" is the clearest example, and `/doctor:helper`'s own matcher answers it `NO_MATCH` too. Fixing it means adding a phrase to the helper's vocabulary, which its held-out measurement governs, so it belongs to a packet that owns that set.
2. **A natural phrasing usually leaves the doctor command second.** The skill-first ordering rule is deliberate and unchanged, so a bridge shows as the `Also:` line unless its own phrase anchors it or the prompt types the command. That is the contract, not a shortfall of this change.
3. **The Python lane only matches a typed slash command.** A natural phrasing reaches these bridges through the TypeScript scorer; the Python fallback keeps its slash-marker rule.
<!-- /ANCHOR:limitations -->

---
