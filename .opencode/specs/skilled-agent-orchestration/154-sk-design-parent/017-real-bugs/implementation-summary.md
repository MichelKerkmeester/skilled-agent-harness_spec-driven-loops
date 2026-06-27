---
title: "Implementation Summary: sk-design two real bugs"
description: "Done. The md-generator backend package.json was reconstructed from the lockfile so npm install works and the backend suite passes 68 of 68, and the audit router scoring loop was fixed to weight keyword hits correctly. The audit, foundations and motion pseudocode was also aligned with the 016 register loading."
trigger_phrases:
  - "sk-design real bugs status"
  - "audit router loop outcome"
importance_tier: "important"
contextType: "implementation"
status: complete
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/017-real-bugs"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Restored the backend manifest and fixed the audit scoring loop, verified"
    next_safe_action: "Move to 018 routing wiring"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-017-real-bugs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-design two real bugs

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-sk-design-parent/017-real-bugs |
| **Completed** | 2026-06-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two real bugs fixed, plus a 016 spillover closed.

The md-generator backend shipped a `package-lock.json` with no `package.json`, so the documented `cd backend && npm install` was broken. The root cause is that `.opencode/.gitignore` blanket-ignores `package.json`, so the manifest was never trackable and was lost on a clean checkout while the lockfile (not ignored) survived. The manifest was reconstructed from the lockfile (name `design-system-extractor`, version 0.0.4, the five runtime dependencies and four devDependencies) plus build, typecheck, test and the three ts-node pipeline scripts the README documents, marked private as an internal skill backend. It is force-tracked with `git add -f`, matching how the deep-loop-runtime and system-spec-kit backends track their own manifests past the same ignore rule.

The audit router scoring loop iterated a plain keyword list as if each entry were a `(keyword, weight)` tuple, so it ignored the configured weight and crashed on any keyword longer than two characters. It now reads `cfg["weight"]` once and iterates the keyword strings, matching the correct foundations and motion template.

While fixing the audit router, the audit, foundations and motion prose pseudocode was aligned with the 016 register loading. The path guard now sanctions the sibling `shared/` dir, the default-load iterates the `DEFAULT_RESOURCE` list, the loader accepts an on-disk shared file, and the resource bases no longer glob the shared dir (the register is a named default, not a discovered resource).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The bug shapes are grounded in `../015-per-skill-improvement-research/005-md-generator/research/lineages/gpt55fast/research.md` (the missing backend manifest) and `../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md` (the keyword-loop defect). The manifest was reconciled from the lockfile root metadata, which carries the dependency truth, rather than guessed. The audit register load reuses the 016 `DEFAULT_RESOURCE` slot rather than a second path. The pseudocode alignment was added because the 016 register loading left the elaborate prose functions self-contradictory, and shipping a SKILL.md whose own guard rejects its declared default is a real honesty gap.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reconstruct `package.json` from the lockfile plus the README scripts | The lockfile and README carry the dependency and invocation truth, so the manifest is faithful not guessed |
| Mark the backend package private | It is an internal skill backend run via ts-node, not a registry package, so private prevents accidental publish |
| Fix the audit loop to match the foundations and motion template | Those modes already weight correctly, so the fix converges the divergent one rather than inventing a new shape |
| Close the 016 pseudocode spillover here | The audit fix touched the same router blocks, and leaving the guard contradicting the declared register default would be dishonest documentation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm install` against the regenerated manifest | PASS. dry-run reports up to date, `npm ls` shows a clean tree of all nine dependencies |
| Backend vitest suite | PASS. 7 test files, 68 tests |
| Audit scoring loop, functional | PASS. four representative prompts route to the expected intent with positive weighted scores (12, 20, 12, 12) |
| All four mode router blocks compile | PASS. py_compile clean for interface, foundations, motion, audit |
| D5 connectivity gate, all five modes | PASS. score 100, 0 escapes each |
| Audit replay loads the register | PASS. `../shared/register.md` in routed resources, 0 missing |
| `package_skill.py --check` on the three edited modes | PASS on foundations, motion, audit |
| `validate.sh --strict` on this packet | PASSED. 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The backend `main` points at `dist/cli.js`.** `dist/` is git-ignored and built on demand via `npm run build`, so `main` resolves only after a build. This matches the README, which states normal use runs through ts-node with no build step.
2. **The pseudocode is illustrative.** The machine router that the benchmark executes is `router-replay.cjs`, not these prose blocks. The blocks were corrected for honesty and now compile, but they are documentation, not the executed path.
<!-- /ANCHOR:limitations -->
