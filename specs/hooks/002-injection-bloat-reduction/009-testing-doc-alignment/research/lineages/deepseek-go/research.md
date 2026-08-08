# Research Synthesis: Testing-Doc and Feature-Catalog Alignment Sweep

Lineage: `fanout-deepseek-go-1786120169844-ep05xl` · Executor: `cli-opencode` model `opencode-go/deepseek-v4-flash`
Scope: repo-wide sweep of ~41 manual-testing-playbooks and ~1498 feature-catalog files for snippets/entries stale against the changed injection-bloat behavior committed at `2af2feb113` (observed epoch>=1 receipts, post-emission Gate-3 observers, shadow-delivery flags-off/fail-open). FINDINGS ONLY — no playbook or catalog was modified.

---

## 1. VERDICT SUMMARY

**The playbook and catalog surfaces are substantially aligned. Exactly one stale playbook assertion exists, plus two catalog omission classes. No playbook or catalog entry asserts the old confirmation contract.**

- **No document asserts epoch-0 or `configured`-receipt confirmation.** Exhaustive direct and paraphrase-variant grep across every live playbook and catalog file for `lifecycleEpoch`, `observed/configured receipt`, `deliveryConfirmed`, `post-emission`, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `shadow-delivery`, `repeat/re-emit/duplicate question`, etc. returns ZERO matches in playbooks/catalogs (the vocabulary exists only in the spec packet and the READMEs fixed at `2af2feb113`). The changed contract did not contradict any existing doc — it was simply never documented in the playbook/catalog layer.
- **One authoritative-test-contract staleness (P1):** `spec-mutation-gate-enforce.md:57-63` asserts the shared core suite runs `# tests 67`; the shipped suite runs **87** (verified twice, 87/87 pass). The drift is change-derived: the epoch>=1/observer tests added by the shadow-delivery work grew the suite. The same step's invocation also does not neutralize child/env vars, so it fails in a child-dispatched environment.
- **Two catalog omission classes (P2):** (A) the catalogs that inventory the changed adapter surfaces (`cursor-hooks-and-spec-gate.md`, `claude-hook.md`) omit the post-emission observers, the epoch>=1 floor, and `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`; (B) the `feature-flag-reference/` catalog and playbook layers have zero spec-gate env coverage. These are additive documentation gaps, mirroring the README fixes already shipped.

---

## 2. STALE PLAYBOOK SNIPPETS (REQ-001 / SC-001)

**One stale snippet. All other matched playbooks are correct.**

| # | File:line | Stale assertion | Current reality | Severity |
|---|-----------|-----------------|-----------------|----------|
| F2/F6 | `.opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md:57-63` | Step-2 expected signal: `# tests 67`, `# pass 67` for `spec-gate-core.test.mjs` | Live suite reports `ℹ tests 87 / ℹ pass 87 / ℹ fail 0` (verified twice under `env -u AI_SESSION_CHILD -u MK_SPEC_GATE_ENFORCE -u MK_SPEC_GATE_DISABLED`) | **P1 must-fix** |

The step-1 count (`# tests 11` for `mk-spec-gate.test.cjs`) is still arithmetically correct; a WS4 sub-test import path drift (`mk-spec-gate.test.cjs:362-371` pointing at the consolidated-away `runtime/lib/spec-gate/`) is a PRE-EXISTING worktree issue from commit `57c3ed338ca`, out of scope for this change-derived sweep.

The same playbook step-2 should neutralize the three gate env vars (as step 1 already does) so a child-dispatched operator does not observe a false failure.

---

## 3. STALE FEATURE-CATALOG ENTRIES (REQ-002 / SC-002)

**No catalog entry is inaccurate; all staleness is omission.**

| Class | Catalog entry | Omitted load-bearing behavior | Severity |
|-------|---------------|-------------------------------|----------|
| A | `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:53-55` (+ root `feature-catalog.md:63-77`) | Post-emission `observeGate3QuestionDelivery` on the cursor classify adapter; `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`; new core exports (`buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, `shouldSuppressGate3Delivery`). Its "`beforeSubmitPrompt` delivery remains unconfirmed" claim stays TRUE (adapter still dormant). | **P2 optional** |
| A | `.opencode/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md:22` | Post-emission policy-delivery observer on `user-prompt-submit.ts` and the epoch>=1 confirmation floor. | **P2 optional** |
| B | `.opencode/skills/system-spec-kit/feature-catalog/feature-flag-reference/*` (12 files) and `.opencode/skills/system-spec-kit/manual-testing-playbook/feature-flag-reference/*` (16 files) | Zero rows for `MK_SPEC_GATE_ENFORCE`, `MK_SPEC_GATE_DISABLED`, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `AI_SESSION_CHILD` (all documented in `ENV-REFERENCE.md` since `2af2feb113`). | **P2 optional** |

Matched-but-accurate catalog entries (verified, NOT stale): `cli-dispatch-authorization.md:40` (dispatch authorization reads the user's original request, not injected gate content — true), `sk-git/.../launch-wrapper-session-isolation.md:29` (child `MK_SPEC_GATE_ENFORCE=0` neutralization — true), `governance/session-resume-caller-binding-and-unicode-sanitization.md` (classifier NFKC sanitization — different layer, true).

---

## 4. AUTHORITATIVE TEST CONTRACT VS ILLUSTRATIVE EXAMPLES (REQ-003 / Q3)

- **Authoritative test contracts** (assert real executed behavior): `spec-mutation-gate-enforce.md` (Gate-3 classify/enforce), `codex-hook-parity.md` (emitted envelopes — unaffected by the post-emission observer), `claude-user-prompt-submit.md` CL-001, `shadow-delta-sink.md` NC-010 (shadow-DELTA sink — separate feature, accurate), the cli-cursor CU-013/014/020 hook scenarios (host-event delivery status — accurate).
- **Illustrative / benign references** (no change needed): "pre-approved, skip Gate 3" dispatch prompts (CX-008/014/016/017/018, CO-017/032/033, memory_health test), sk-git advisory-suppression scenarios (SKGIT_ADVISORY — different suppression), sk-code advisor-probe-battery (classifier routing probes), devin DV-009/DV-021, pi PI-014/PI-016 (fail-open extension bridges — still true).

---

## 5. FROZEN-BEHAVIOR VERIFICATION (Q4 / CONSTRAINT)

**No snippet documents deliberately-frozen behavior incorrectly.** The flags-off/byte-identical/fail-open shadow-delivery and the post-emission observer timing are documented as intended in the READMEs updated at `2af2feb113` (`lib/spec-gate/README.md:30`, `ENV-REFERENCE.md:479`) and in code headers — and no playbook/catalog entry describes suppression as active or the observers as pre-emission, so the frozen guarantees are contradicted nowhere. Zero flags were produced against frozen behavior by design.

---

## 6. MUST-FIX VS OPTIONAL SPLIT (REQ-004 / SC-003)

### Must-fix (P1) — one item, change-derived, verified
1. `spec-mutation-gate-enforce.md:57-63` — update the step-2 expected signal `# tests 67` → `# tests 87` (and pass 87), and add the three `env -u` neutralizations to the step-2 invocation (matching step-1's hermetic pattern) so the authoritative Gate-3 contract playbook passes in both interactive and child-dispatched environments.

### Optional (P2) — additive catalog documentation
2. `cursor-hooks-and-spec-gate.md` + root `feature-catalog.md` §4 — add a delivery-observation paragraph (post-emission observer, epoch>=1 floor, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` default-off/fail-open), preserving the dormant-cursor statement. (Luna lineage independently rates this P1 for the detailed entry.)
3. `claude-hook.md` — add the post-emission policy-delivery observer + confirmation floor.
4. `feature-flag-reference/` catalog + playbook layers — add the four spec-gate env rows (mirroring `ENV-REFERENCE.md`).

### Out of scope (pre-existing, NOT change-derived)
- `mk-spec-gate.test.cjs:362-371` WS4 import path (`runtime/lib/spec-gate/spec-gate-core.mjs`) — consolidated away by `57c3ed338ca`; a pre-existing test-path drift unrelated to the injection-bloat change.

---

## 7. ELIMINATED ALTERNATIVES / NEGATIVE KNOWLEDGE

| Approach | Reason eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| "README X contradicts the changed contract" | No playbook/catalog ever documented confirmation/epoch/observer semantics, so nothing became false | exhaustive direct + paraphrase grep → zero matches | 1-6 |
| Flag the cli-cursor CU-014 dormant-adapter claim | The adapter is still dormant (`spec-gate-classify.mjs:5`); the post-emission observer code does not change delivery status | read of adapter + catalog | 1 |
| Flag `codex-hook-parity.md` classify/enforce envelopes | Post-emission observer fires after stdout write and does not alter the emitted envelope | read of codex adapter + playbook | 3 |
| Flag the shadow-delta-sink playbook (NC-010) | shadow-DELTA sink is a separate feature from shadow-DELIVERY; assertions accurate | read of NC-010 + advisor-recommend catalog | 3 |
| Treat the WS4 import-path failure as injection-bloat-caused | Introduced by hooks consolidation `57c3ed338ca`, an ancestor of HEAD; not the changed behavior | git ancestry + test read | 8 |
| Flag suppression as active anywhere | No catalog/playbook describes suppression as active | grep for suppression + shadow id → zero | 6-7 |

---

## 8. SOURCES

- Iteration files: `iterations/iteration-001.md` through `iteration-010.md` (this packet).
- Changed code (read in full): `spec-gate-core.mjs` (incl. `:287-295` epoch floor, `:342-359` suppression predicate, `:393-489` observer), the five `spec-gate-classify` adapters (claude/codex/cursor/devin/pi), `mk-spec-gate.js`, `mk-skill-advisor.js`, `policy-plan.ts`, `render.ts`.
- Verification runs: `spec-gate-core.test.mjs` → 87/87 under `env -u AI_SESSION_CHILD -u MK_SPEC_GATE_ENFORCE -u MK_SPEC_GATE_DISABLED` (twice); `mk-spec-gate.test.cjs` → 11 tests (WS4 path drift pre-existing).
- Spec context: `.opencode/specs/hooks/002-injection-bloat-reduction/009-testing-doc-alignment/spec.md`, commit `2af2feb113`.
- Sibling lineage: `.opencode/specs/hooks/002-injection-bloat-reduction/009-testing-doc-alignment/research/lineages/luna/research.md` + state (reconciled, F32).

## 9. OPEN QUESTIONS / UNVERIFIED

- Whether the follow-on implementation pass should also add the observer-timing + suppression paragraph to the per-runtime spec-gate hook READMEs (recommended as part of must-fix scope for the catalog work, but the READMEs are out of this spec's "non-playbook, non-catalog" scope per `spec.md`).
- Whether luna's P1 rating for the detailed Cursor catalog entry should override this lineage's P2 rating — recommendation: treat the detailed entry as P1 (it is the authoritative Cursor adapter inventory) and the root summary + claude-hook + flag-reference as P2.
