# Iteration 3: Alignment verifier run, ENV-REFERENCE coverage cross-check, must-fix split

## Focus

Run the sk-code opencode-surface drift verifier against the changed surface, confirm the ENV-REFERENCE omission is not covered elsewhere, verify per-directory README file-count claims, and lock the must-fix vs optional split for the follow-on pass.

## Findings

### F15 — All 12 changed files pass the alignment-drift verifier (default gate)

`python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root {system-skill-advisor/mcp-server} --root {system-skill-advisor/hooks} --root {system-spec-kit/mcp-server/hooks} --root {.opencode/plugins}` → `PASS`, scanned 431 files, 0 findings/errors/warnings/violations. All 12 changed files satisfy the language-integrity rules (headers, `'use strict'` for `.js/.cjs`, `.mjs` skip, indentation/quote/semicolon checks).

`--check-exact-headers` (opt-in) flags only pre-existing files OUTSIDE the 12-file changed set: `scripts/*.sh`, `scripts/*.mjs`, `stress-test/*.vitest.ts`, and spec-gate `*.test.mjs` co-located tests. The four `spec-gate-classify.mjs` adapters, both plugins, and all changed lib/hook `.ts` files carry `MODULE:`/`COMPONENT:` markers. No header-format gap in the changed surface.

### F16 — ENV-REFERENCE omission is a genuine, uncovered documentation gap

`MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` appears only in: `spec-gate-core.mjs:71` (definition), the co-located test (`spec-gate-core.test.mjs:59,543,552,565`), and the spec-packet `005-gate3-relay-edge-triggering/implementation-summary.md:57`. It is NOT in `ENV-REFERENCE.md`, NOT in `lib/spec-gate/README.md`, NOT in `hooks/skill-advisor-hook.md`'s control-flag table (§6 lists only `SPECKIT_SKILL_ADVISOR_*` flags), and NOT in `manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` (that playbook documents `MK_SPEC_GATE_ENFORCE`/`MK_SPEC_GATE_DISABLED`/`AI_SESSION_CHILD` only). The suppression switch is the load-bearing env that gates the post-emission observer, and no operator-facing doc names it. This is a must-fix documentation gap (REQ-003-adjacent).

### F17 — In-directory README file counts are accurate

- `system-skill-advisor/hooks/claude/README.md:29` "Code files | 1" matches the folder (only `user-prompt-submit.ts`). [verified `ls`]
- `system-skill-advisor/mcp-server/lib/README.md` flat-module lists match `ls` EXCEPT the missing `policy-plan.ts` (F10). All other listed files exist.
- `system-spec-kit/mcp-server/hooks/README.md` directory tree matches on-disk subfolders (claude/codex/cursor/devin/pi/lib/opencode symlink). No count drift.
- `plugins/README.md` inventory (mk-skill-advisor, mk-spec-gate, etc.) matches `ls .opencode/plugins`. No count drift.

### F18 — Must-fix vs optional split (Q4)

**Must-fix (documentation accuracy / constitutional hygiene):**
1. `lib/README.md` — add `policy-plan.ts` to both directory trees (F10). Stale inventory: the module this commit made load-bearing is unlisted.
2. `ENV-REFERENCE.md` — add a spec-gate section documenting `MK_SPEC_GATE_ENFORCE`, `MK_SPEC_GATE_DISABLED`, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `AI_SESSION_CHILD` (F12/F16). The delivery-suppression switch is undiscoverable from the authoritative env reference.
3. `lib/spec-gate/README.md` — add the delivery-observation entrypoints (`observeGate3QuestionDelivery`, `shouldSuppressGate3Delivery`, `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `advanceGate3LifecycleEpoch`) and the `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` flag to ENTRYPOINTS/CONTENTS (F11).
4. `spec-gate-core.mjs` + `mk-spec-gate.js` — strip the ephemeral `(fix 2)`/`(fix 3)`/`(P1 fix)` labels from comments, keep the durable WHY (F2). Constitutional comment-hygiene gate.

**Optional (alignment polish):**
5. Introduce a named constant for the candidate cell identifiers (`'004'`/`'005'`/`'006'`) shared across render.ts:369, user-prompt-submit.ts:292, mk-skill-advisor.js:673, spec-gate-core.mjs:403, prompt-advisor.ts:313 — replacing the duplicated packet-number magic literals (F1). Behavior-neutral; no activation change.
6. Add a cross-reference note in `lib/shadow/README.md` / `mcp-server/README.md` distinguishing the shadow-delta sink from the shadow-delivery state machine to remove the terminology hazard (F10/F14).
7. Optionally mention the post-emission/pre-return observer timing in the per-runtime spec-gate hook READMEs (claude/codex/devin/pi) and `hooks/skill-advisor-hook.md` (F13). Under-specified today, not false.

## Sources Consulted

- [SOURCE: verify_alignment_drift.py run — PASS, 431 files, 0 findings]
- [SOURCE: verify_alignment_drift.py --check-exact-headers output — changed files all header-ok]
- [SOURCE: grep MK_SPEC_GATE_3_DELIVERY_SUPPRESSION → spec-gate-core.mjs:71 + test + 005 impl-summary only]
- [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/README.md:29]
- [SOURCE: ls .opencode/skills/system-spec-kit/mcp-server/hooks/*]

## Assessment

newInfoRatio: 0.35
noveltyJustification: F15 (verifier PASS) and F17 (counts accurate) confirm prior findings; F16 sharpens the ENV gap to "uncovered by every operator doc"; F18 delivers the Q4 must-fix/optional split. Lower novelty because iterations 1-2 established the surface.

Key questions answered: Q4 (must-fix vs optional), Q5 (comment hygiene + fail-open confirmed). All five key questions now have evidence-backed answers.

## Reflection

What worked: running the actual verifier gave authoritative PASS evidence for the whole changed surface; the coverage grep for the suppression env proved it lives nowhere operator-facing.

What failed / ruled out: Ruled out any header-format gap in the 12 changed files (verifier + direct grep); ruled out ENV-REFERENCE coverage existing in the manual-testing-playbook or hook control-flag tables (checked both).

## Recommended Next Focus

Iteration 4: Broaden review angle per the max-iterations stop policy — since all five key questions are answered, broaden to adversarial/cross-cutting checks instead of synthesizing early: (a) verify the four stdout-write adapters' observer ordering matches the "strictly post-emission" claim by reading the exact `process.stdout.write` callback blocks once more with line numbers; (b) confirm the pi return-based hook observes before `return` (not after a possible throw); (c) check for any OTHER stale README referencing these 12 files that a grep by filename would catch (reverse-reference scan).
