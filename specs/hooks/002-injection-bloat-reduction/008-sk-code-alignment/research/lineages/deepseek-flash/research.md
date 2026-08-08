# Research Synthesis: sk-code Alignment and README Freshness Audit

Lineage: `fanout-deepseek-flash-1786111571873-6f2oyc` · Executor: `cli-opencode` model `deepseek/deepseek-v4-flash`
Scope: 12 code files changed at commit `78ef96ae6b` (shadow-delivery epoch>=1 confirmation fix) audited against sk-code opencode-surface standards; README freshness for in-directory and adjacent READMEs. FINDINGS ONLY — no code or README was modified.

---

## 1. VERDICT SUMMARY

**Code alignment: substantially aligned.** 11 of 12 files fully conform to the sk-code opencode-surface standards (headers, `'use strict'` discipline, fail-open error handling, type discipline, no-TUI plugin rule, observer ordering). The changed behavior itself — epoch>=1 receipt floor, post-emission stdout observers, pre-return Pi/Claude observers, byte-identical shadow delivery — matches the frozen contract exactly (verified with line numbers). The alignment verifier passes the entire changed surface (0 findings).

Two concrete gaps remain: (1) ephemeral packet-number magic literals for the observation `candidate` (5 files, optional fix), and (2) four ephemeral `(fix 2)`/`(fix 3)`/`(P1 fix)` labels in code comments (2 files, must-fix per constitutional comment hygiene).

**README freshness: no README is directly contradicted, but three are stale-by-omission.** No README ever documented the delivery-confirmation/epoch/observer contract, so nothing became false; instead the READMEs that should carry the new load-bearing behavior are silent, and one module inventory (`lib/README.md`) is now missing the exact module this commit made load-bearing (`policy-plan.ts`).

---

## 2. PER-FILE ALIGNMENT VERDICTS (REQ-001 / SC-001)

| # | File | Verdict | Gap evidence |
|---|------|---------|--------------|
| 1 | `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | **ALIGNED** | Module header, explicit public return types, `readonly`+`Object.freeze`, epoch>=1 floor at `:427`, fail-open sink at `:842-907`. `observeRenderedAdvisorPolicy` no-op stub intentional and correctly documented (`:984-988`). |
| 2 | `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | **ALIGNED except F1** | `:369` `candidate: deliveryState.candidate ?? '004'` — magic packet-number fallback literal (optional). Fail-open observers `:276-384`. |
| 3 | `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | **ALIGNED except F1** | `:292` `candidate: '004'`; post-emission observer before `return` at `:289-294`; fail-open `:295-306`; diagnostics to stderr only. |
| 4 | `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | **ALIGNED except F1** | `:313` `candidate: "006"`; `observeEmittedPiDispatch` as final pre-return step `:485-490`; bounded stores; fail-open. Double-quote style consistent with Pi-extension surface. |
| 5 | `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/spec-gate-classify.mjs` | **ALIGNED** | Post-emission observer in `process.stdout.write` callback `:70-78`; fail-open `main().catch(() => approve())`. |
| 6 | `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/spec-gate-classify.mjs` | **ALIGNED** | Post-emission observer `:67-75`; fail-open. |
| 7 | `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/spec-gate-classify.mjs` | **ALIGNED** | Post-emission observer `:74-81`; `permission:'allow'` envelope; fail-open. |
| 8 | `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/spec-gate-classify.mjs` | **ALIGNED** | Post-emission observer `:73-80`; fail-open. |
| 9 | `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts` | **ALIGNED** | Pre-return observer `:51-56`; fail-open `catch → continue`. |
| 10 | `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` | **ALIGNED except F2** | `(fix 2)`/`(fix 3)` comment labels `:984,1256,1387` (must-fix); `gate3DeliveryConfirmed` epoch floor `:287-295`; fail-open everywhere. |
| 11 | `.opencode/plugins/mk-skill-advisor.js` | **ALIGNED except F1** | `:673` `candidate: '004'`; boxed COMPONENT header; `'use strict'`; no TUI writes; fail-open. |
| 12 | `.opencode/plugins/mk-spec-gate.js` | **ALIGNED except F2** | `:59` `(P1 fix)` comment label (must-fix); post-push observer `:223-232`; `'use strict'`; no TUI writes; fail-open. |

All 12 pass `verify_alignment_drift.py` (PASS, 0 findings) and the `--check-exact-headers` marker check.

---

## 3. STALE READMES — IN-DIRECTORY (REQ-002 / SC-002)

**Directly contradicted statements: none.** No README described the delivery-confirmation/epoch/observer semantics before this change, so nothing became false. The staleness is omission + inventory drift:

| README | Exact statement now inaccurate | Why |
|--------|--------------------------------|-----|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/README.md` | Directory Tree (`:58-79`, `:101-122`) enumerates the flat lib modules and omits `policy-plan.ts` | `policy-plan.ts` is the module this commit modified (+210 lines) and carries the delivery state machine + epoch-floored confirmation predicate; a reader following the README cannot find it. `shadow/` is described only as the shadow-delta sink, not the shadow-delivery machine. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/README.md` | ENTRYPOINTS (`:23-29`) lists only `classifyIntent`/`evaluateMutation`/`isChildSession`/`resolveGuardPaths`/`sweepStaleGateStates`; documents `MK_SPEC_GATE_ENFORCE` but not the delivery-observation API or `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION` | The post-emission observer (`observeGate3QuestionDelivery`, `buildGate3ObservedReceipt`, `currentGate3LifecycleEpoch`, etc.) is now load-bearing behavior the README does not surface. |
| `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md` | No spec-gate section exists (grep for `MK_SPEC_GATE|GATE_3_DELIVERY|SPEC_GATE` → 0 rows across 799 lines) | `MK_SPEC_GATE_ENFORCE`, `MK_SPEC_GATE_DISABLED`, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `AI_SESSION_CHILD` are load-bearing gate envs; the authoritative env reference cannot discover the delivery-suppression switch. |

---

## 4. STALE READMES — ADJACENT (REQ-003 / SC-003)

- **`.opencode/hooks/injection-contract.md`** (`:69-83`): documents the Gate-3 question channel per runtime accurately; does not cover the confirmation/epoch contract. Not contradicted — no change strictly required, optional note.
- **`.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md`**: runtime matrix and control flags accurate; control-flag table (§6) does not list `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`. Under-specified, optional.
- **`.opencode/skills/system-spec-kit/mcp-server/hooks/{claude,codex,cursor,devin,pi}/README.md`**: describe `spec-gate-classify` as "surfaces the question"; do not mention the post-emission/pre-return observer timing. Under-specified, optional (none false).
- **`.opencode/skills/system-skill-advisor/mcp-server/README.md`** + **`lib/shadow/README.md`**: describe the shadow-**delta** sink; the naming overlap with the shadow-**delivery** machine is a terminology hazard — optional cross-reference note.

---

## 5. MUST-FIX VS OPTIONAL SPLIT (REQ-004 / SC-004)

### Must-fix (documentation accuracy / constitutional hygiene)
1. `lib/README.md` — add `policy-plan.ts` to both directory trees (F10).
2. `ENV-REFERENCE.md` — add a spec-gate section documenting `MK_SPEC_GATE_ENFORCE`, `MK_SPEC_GATE_DISABLED`, `MK_SPEC_GATE_3_DELIVERY_SUPPRESSION`, `AI_SESSION_CHILD` (F12/F16).
3. `lib/spec-gate/README.md` — add the delivery-observation entrypoints and the suppression env flag to ENTRYPOINTS/CONTENTS (F11).
4. `spec-gate-core.mjs:984,1256,1387` and `mk-spec-gate.js:59` — strip the ephemeral `(fix 2)`/`(fix 3)`/`(P1 fix)` labels, keep the durable WHY (F2; constitutional comment-hygiene gate).

### Optional (alignment polish; behavior-neutral)
5. Replace the duplicated packet-number candidate literals (`'004'`/`'005'`/`'006'`) with a shared named constant across `render.ts:369`, `user-prompt-submit.ts:292`, `mk-skill-advisor.js:673`, `spec-gate-core.mjs:403`, `prompt-advisor.ts:313` (F1).
6. Add a cross-reference note distinguishing shadow-delta sink from shadow-delivery state machine in `lib/shadow/README.md` / `mcp-server/README.md` (F10/F14).
7. Mention the post-emission/pre-return observer timing in the per-runtime spec-gate hook READMEs and `hooks/skill-advisor-hook.md` (F13).

---

## 6. ELIMINATED ALTERNATIVES / NEGATIVE KNOWLEDGE

| Approach | Reason eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treat the `'004'` fallback as a behavior defect | Behavior is frozen and verified; it is an alignment/durability gap only | commit 78ef96ae6b, frozen-scope constraint | 1 |
| Report "README X contradicts behavior Y" | No README makes a confirmable false statement about the epoch/observer contract | exhaustive term grep → zero README matches | 2 |
| Flag `injection-contract.md` as stale | Its channel statements remain true | read of `:69-83` | 2 |
| Suspect a plugin stdout violation | Only the `.mjs`/`.ts` hook adapters write (their CLI transport), plugins have zero stdout/stderr | rg across 12 files + javascript-checklist:157 | 5 |
| Suspect the `observeRenderedAdvisorPolicy` stub is dead code | It is called by `render.ts` for pre-emission shadow measurement, deliberately separate from the activation sink | `policy-plan.ts:984-988`, `render.ts` import | 5 |

---

## 7. SOURCES

- Iteration files: `iterations/iteration-001.md` through `iteration-005.md` (this packet).
- sk-code opencode-surface evidence: `.opencode/skills/sk-code/sk-code-opencode/SKILL.md`, `references/shared/universal-patterns/naming-and-commenting.md`, `references/typescript/quality-standards/overview-and-type-system.md`, `references/javascript/style-guide.md`, `assets/checklists/{universal,typescript,javascript}-checklist.md`, `assets/scripts/verify_alignment_drift.py`.
- Constitutional rule: `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md`.
- Changed code: the 12 files listed in §2 (all read in full).
- Spec context: `.opencode/specs/hooks/002-injection-bloat-reduction/spec.md`, `007-guardrail-controls-and-activation/risk-register.md`, `005-gate3-relay-edge-triggering/implementation-summary.md`.
- Verification evidence: `verify_alignment_drift.py` PASS (431 files, 0 findings) over the changed surface; `--check-exact-headers` all 12 header-ok.

## 8. OPEN QUESTIONS / UNVERIFIED

- Whether a future cursor-agent build delivers `beforeSubmitPrompt` (READMEs already mark this delivery as unconfirmed — unchanged).
- Whether the follow-on implementation pass should also add the observer-timing note to `skill-advisor-hook.md` §4 SHARED BEHAVIOR (recommended as part of must-fix #3's README set).
