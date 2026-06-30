# Council Report — Comment Hygiene Enforcement Gap

> Requested artifact. Full rubric scoring, seat artifacts, and deliberation live
> alongside this file: `council-report.md`, `seats/round-001/`, `deliberations/round-001.md`.
> Dispatch mode: sequential inline deliberation in one Opus 4.8 context; all vantages
> are simulated reasoning lenses (no external CLI executed). Every claim is grounded in
> direct reads of the actual implementation.

## TL;DR

The hooks and OpenCode plugin DO fire. They inject the **wrong payload**: a 80-token
skill-routing pointer (`Advisor: live; use <skill> <conf>/<unc> pass.`), never the
hygiene rule. The constitutional entry exists but is **never pushed** into context —
"always surfaces" governs `memory_search` ranking, not prompt-time injection. So
WITHOUT AGENTS.md, the models had zero hygiene signal and wrote the forbidden comment.
**AGENTS.md is currently the only working passive layer; the git pre-commit gate is the
only true enforcement — and its install must be verified.**

---

## 1. Root Cause Per Runtime

| Runtime | Mechanism that fired | What it injected | Why it still wrote the comment |
| --- | --- | --- | --- |
| **OpenCode** | `experimental.chat.system.transform` (plugin) | advisor pointer | Rule came from AGENTS.md, not the plugin. Grep of `.opencode/plugins` for constitutional/hygiene = 0 matches. No write-time hook (ADR-001). |
| **Gemini** | `BeforeAgent` hook → `additionalContext = brief` | advisor pointer | `brief` is the pointer, not the rule. Probe "saw" the rule only because it read AGENTS.md. 429 is a red herring — a clean run still injects only the pointer. |
| **Codex** | `UserPromptSubmit` (`Completed` log) | advisor pointer | WITH-rule refusal cited AGENTS.md; the hook contributed routing, not hygiene. |
| **Devin** | `UserPromptSubmit` shim | advisor pointer | Identical payload + identical AGENTS.md-only dependency. |
| Claude (control) | `PostToolUse` Write\|Edit | real checker output | Works correctly; runs `check-comment-hygiene.sh` with file content in hand, warns inline, exits 0. Not the concern. |

**The unifying fact**: all five prompt-time channels converge on ONE renderer —
`system-skill-advisor/mcp_server/lib/render.ts → renderAdvisorBrief()` — whose only
possible outputs are the two pointer strings at lines 150-159, capped at 80 tokens
(`DEFAULT_TOKEN_CAP = 80`, `MAX_TOKEN_CAP = 120`).

---

## 2. Injection Path Diagnosis — Current vs Needed

**Currently injected** (the entire model-visible payload):
```
Advisor: live; use sk-code 0.83/0.20 pass.
```
- Produced by `renderAdvisorBrief()` (render.ts:112-160). One section in the envelope:
  `advisor-brief` (`skill-advisor-brief.ts:275-282`).
- `skill_advisor.py` references "constitutional" once (line 1565) — a trigger-phrase →
  skill-weight map (`[("system-spec-kit", 1.7)]`), NOT a content injector. A normal
  coding prompt never trips it.
- **No code path reads `constitutional/comment-hygiene.md` and appends its body to the
  brief.** Confirmed by grep across the whole `system-skill-advisor` tree.

**What it needs to inject** (short, derived, imperative — ~25 tokens):
```
Code comments: no spec-path / packet / ADR-/REQ-/CHK-/task ids — keep the WHY,
drop the label. (pre-commit blocks violations.)
```
Source of truth stays the constitutional file; a small extractor pulls this one line so
the rule and the injected reminder never drift.

**Why "constitutional always surfaces" did not help**: that property is about search
result ORDERING in `memory_search`. Nothing in the prompt-time hook calls
`memory_search` and pastes the top hit into the prompt. The entry is retrievable on
demand, never pushed.

### Answers to the five council sub-questions
1. **Does the brief contain the rule verbatim or a pointer?** A pointer — a skill name
   + two scores. Not even a pointer *to* the hygiene file; it is a pointer to a
   *skill*. The hygiene rule content never appears.
2. **Gemini: hook fires but model writes — why?** Because the hook injects the pointer,
   not the rule. The 429/timeout only matters as a second failure mode (render.ts ships
   `renderAdvisorTimeoutFallback()` for exactly that), but even the happy path injects
   nothing about comments. The BeforeAgent hook does re-run per prompt, but each run
   produces the same pointer.
3. **Codex: hooks fire but no hygiene refusal — what is injected?** The pointer. Codex's
   WITH-rule refusal came from AGENTS.md (`context.fileName` loads it), not the hook.
4. **OpenCode plugin: what would a working plugin need to inject?** The short directive
   above, appended to the transformed system message — not the skill pointer, and not
   the full markdown.
5. **Fix design: verbatim list vs checker-call vs hard system rule?** Inject a SHORT
   imperative directive (derived from the forbidden list), naming the gate. Do NOT paste
   the full list/markdown (token budget + banner blindness). Do NOT rely on it as a hard
   guarantee (it is fail-open advisory transport). The hard guarantee is the gate.

---

## 3. Concrete Fix Per Runtime / Layer

| Fix | Files | Change | Priority |
| --- | --- | --- | --- |
| A1 Verify gate fires in each runtime's commit path | `.opencode/hooks/pre-commit`, `install-hooks.sh` | Stage `// ADR-007: x`, attempt a real commit per runtime, confirm block. Add install assertion to onboarding. | **P0** |
| A2 Bypass-proof the gate | CI config (create if absent) | Re-run `check-comment-hygiene.sh` server-side so `--no-verify` cannot merge a violation. | **P0/P1** |
| B1 Constitutional directive producer | new module in `system-skill-advisor/mcp_server/lib/` + `skill-advisor-brief.ts buildSharedPayload` | Emit a second `sections[]` entry from a one-line extract of the constitutional file; fail-open; cache via `advisorPromptCache`. | P1 |
| B2 Wire directive into all prompt hooks | `hooks/{gemini,codex,devin}/user-prompt-submit.ts` + OpenCode plugin transform | Append directive to `additionalContext` / transformed system message; ~25-token cap. | P1 |
| C Claude PostToolUse | `claude-posttooluse.sh` | No change — already the gold layer. | done |

---

## 4. Priority Ranking — Coverage Per Effort

| Rank | Fix | Effort | Coverage | Determinism |
| --- | --- | --- | --- | --- |
| 1 | A1 verify gate install (all runtimes) | XS | 100% at commit | Deterministic |
| 2 | A2 CI server-side re-check | S | 100% at merge | Deterministic |
| 3 | B1+B2 inject hygiene directive on the shared seam | S | partial, early write-time | Probabilistic |
| 4 | per-runtime hard system rule | M | partial | Probabilistic |
| — | write-time hooks on the 4 runtimes | XL | n/a | BLOCKED — runtime APIs lack post-file-write events (ADR-001..004) |

---

## 5. Council Verdict — Do the Hooks Provide Meaningful Protection?

**No.** The prompt-time hooks/plugin provide effectively zero comment-hygiene
protection today, and by design can only NUDGE, not ENFORCE — they are a fail-open,
80-token advisory channel built to answer "which skill?". They inject a routing pointer,
never the rule.

- **AGENTS.md is currently the only working passive hygiene layer**, and it is weak:
  even when present, compliance was inconsistent (Gemini *stripped* the label, Codex's
  refusal was incidental to Gate 3). It is not a guarantee.
- **The git pre-commit gate is the only true enforcement** (it blocks; everything else
  nudges or warns-and-exits-0). BUT: the WITHOUT test appears to have measured the
  WRITE, not a commit attempt — so the gate's actual firing in the four non-Claude
  runtimes is **UNVERIFIED**. Confirm it (P0) before trusting the stack.

**Recommended path**: (1) verify + bypass-proof the gate — the guarantee; (2) add a
short shared-seam directive for cheap write-time feedback — explicitly NOT as an
enforcement layer. You cannot bolt a fail-closed guarantee onto a fail-open advisory
transport; keep the two concerns separate.

---

*Scoped-write boundary: this council modified only `ai-council/**`. No code or config
was changed. Findings are a recommendation for a follow-on implementation packet.*
