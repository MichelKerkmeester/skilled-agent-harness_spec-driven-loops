---
title: "Implementation Summary"
description: "Gate 3 no longer depends on word order, a resume instruction fires next to a read-only word, a save outside any spec-kit repository is refused, the install probe covers the CLI writer, and create.sh finds its own templates."
trigger_phrases:
  - "gate3 and continuity root implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/009-gate3-and-continuity-root"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Closed the phase"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-gate3-and-continuity-root |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gate 3 now decides on what a prompt asks rather than the order of its words, and a save can no longer land in the Skilled checkout by accident. Both fixes sit in code every session runs.

### Phase 9: gate3-and-continuity-root

"Update the README and review the result." now raises the documentation question exactly as "Review the README and update it." does, and "review the packet and resume" fires like "resume the packet". A read-only question that mentions resume, or names a write word as a noun ("Review the build output and explain the failures."), stays quiet, which is what the 195-row labeled corpus says. A save started outside any spec-kit repository now stops with a message naming `--project-root` before it takes a lock or writes. `/doctor:install` checks the continuity writer `/speckit:save` runs, `validate.sh` names the build that produces it, and `create.sh` works from any repository because it reads templates from its own skill.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` | Modified | Instruction-position rule for write-before-read pairs and resume instructions |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/gate-3-classifier.vitest.ts` | Modified | Probe prompts, both orders, read-only negatives |
| `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts` | Modified | `isRuntimeRepositoryFallback()` |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modified | Refuse a fallback root without `--project-root` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/generate-context-cli-authority.vitest.ts` | Modified | Refusal and inside-repository cases |
| `.skilled/commands/doctor/assets/doctor-install.yaml`, `doctor-install-presentation.txt` | Modified | Probe `runtime/cli/dist/continuity/generate-context.js` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modified | Repair lines run the full spec-kit build |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Templates and gate renderer from the script's own skill |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Existing `SPECKIT_TEMPLATES_BASE` row states the new default |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modified | Build instruction that also builds `runtime/cli` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran before the first edit. Three cli-codex `gpt-6-luna` high-fast briefs made the changes; the classifier took three attempts against the labeled corpus, then a DeepSeek V4.1 Flash max review (cli-pi) found two P1 over-triggers and five P2s, which two further Luna briefs fixed after the spec's resume wording was corrected (ADR-002). The orchestrator rebuilt `shared`, `runtime` and `runtime/cli` dist in the worktree and reran every suite from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Instruction position decides Gate 3 | The literal "resume always required" rule cost five labeled corpus rows; see ADR-002 |
| Refuse only in the save path | Read-only tools keep the fallback and its stderr note, so nothing that only reads breaks |
| Full skill build in repair text | The root `tsc --build` covers `shared`, `runtime` and `runtime/cli`, and the orchestrator freshness check stays green after it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli vitest project | Before 2399 passed, 20 skipped, 0 failed. After 2406 passed, 20 skipped, 0 failed |
| `test-validation-system.cjs` | Before 101/0. After 101/0 |
| `test-validation.sh` | Before 31/0. After 31/0 |
| `spec-gate-core.test.mjs` | Before 107 pass, 3 skipped. After 107 pass, 3 skipped |
| `doctor-install-contract.test.cjs` | After 16/0 (no before run) |
| Labeled Gate 3 corpus | Before 191/195. After 191/195, same four disagreements (rr-iter2-018, rr-iter2-059, rr-iter3-085, rr-iter3-183) |
| Probe prompts (18) | All as required, including six adversarial read-only prompts the review supplied |
| create.sh in a scratch repo with no `.skilled` | Exit 0, folder created |
| Save from a non-repository directory | Exit 1, message names `--project-root` |
| Matrix axes | write-before and write-after read-only verb by joiner (and, then, comma, none) by trigger class (file write, resume): 16 rows covered by the probe set and vitest |
| Cross-family review | DeepSeek: FAIL with 2 P1 and 6 P2; both P1 and four P2 fixed, two P2 recorded in ADR-003 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two writers still use the fallback root.** `backfill-frontmatter.ts` and `migrate-trigger-phrase-residual.ts` resolve the root at import; recorded as an adjacent defect in ADR-003.
2. **The committed dist is not tracked.** A checkout must still run `npm --prefix .skilled/skills/system-spec-kit run build`; the probe now says so instead of passing.
<!-- /ANCHOR:limitations -->

---
