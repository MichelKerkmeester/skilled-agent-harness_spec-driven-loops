---
round: 1
seat: seat-001
executor: simulated-critical-lens
lens: Critical (Security / Correctness)
status: ok
timestamp: 2026-05-30T00:00:00Z
simulated: true
---

# Seat 001 — Critical / Security-Correctness

## Proposed Plan

Treat this as a content-delivery defect, not a wiring defect. The hooks fire; they
deliver the wrong payload. Fix = make the prompt-time injection carry the hygiene
rule TEXT (or a hard imperative), not a skill-name pointer. Verify by asserting the
injected string contains the forbidden-pattern tokens.

## Reasoning (through the correctness lens, grounded in code)

The briefing's central hypothesis — "the rule only reaches models through AGENTS.md,
not through the hook/plugin injection path" — is **confirmed by direct code reading**.
Here is the exact proof chain:

1. **What the prompt-time hook actually injects.** Every runtime prompt hook
   (Gemini `BeforeAgent`, Codex/Devin `UserPromptSubmit`, OpenCode
   `experimental.chat.system.transform`) funnels through one renderer:
   `system-skill-advisor/mcp_server/lib/render.ts → renderAdvisorBrief()`.
   The ONLY strings it can emit are (render.ts:150-159):
   - `Advisor: <freshness>; use <skillLabel> <conf>/<unc> pass.`
   - `Advisor: <freshness>; ambiguous: <A> .. vs <B> .. pass.`
   Token cap = 80 default, 120 max (`DEFAULT_TOKEN_CAP = 80`, `MAX_TOKEN_CAP = 120`,
   render.ts:40-42). The brief is a **skill-routing pointer with two float scores**.
   It contains no rule text, no forbidden-pattern list, no "do not write ADR-xxx",
   and crucially **no reference to comment hygiene at all** unless `comment-hygiene`
   happened to be the winning *skill label* — which it never is, because it is a
   constitutional MEMORY entry, not a skill in the advisor inventory.

2. **The shared payload confirms it.** `skill-advisor-brief.ts:275-282` builds the
   only section the envelope ever carries: `{ key: 'advisor-brief', content:
   <renderedBrief> }`. There is no code path that reads
   `constitutional/comment-hygiene.md` and appends its body. Grep for
   `constitutional|comment.?hygiene|forbidden` across the entire
   `system-skill-advisor` tree returns matches only in tests and `skill_advisor.py`.

3. **What `skill_advisor.py` does with "constitutional".** One line — 1565:
   `"constitutional memory": [("system-spec-kit", 1.7)]`. That is a trigger-phrase →
   skill-weight mapping. It means "if the user's prompt literally mentions
   constitutional memory, boost system-spec-kit." It does NOT inject constitutional
   content, and a normal coding prompt ("add lease cleanup") never trips it.

4. **The "always-surface" claim is about search ranking, not injection.**
   `comment-hygiene.md` frontmatter says `importanceTier: constitutional` and the
   footer says "Always surfaces at top of search results." That governs
   `memory_search` ORDERING. It is true and irrelevant here: nothing in the
   prompt-time hook calls `memory_search` and pastes the top hit into context. The
   constitutional entry is retrievable on demand; it is not pushed.

5. **Therefore the WITH/WITHOUT AGENTS.md result is fully explained.** WITH the rule,
   every model read it from AGENTS.md (Gemini/Codex `context.fileName` includes
   AGENTS.md; OpenCode/Devin load it as project instructions) and self-corrected.
   WITHOUT it, the only remaining model-visible hygiene signal would have to come
   from the hook — and the hook injects `Advisor: live; use sk-code 0.83/0.20 pass.`,
   which says nothing about comments. The models had zero hygiene signal and wrote
   the forbidden comment. This is deterministic, not flaky.

## Per-runtime root cause (correctness view)

- **OpenCode**: AGENTS.md was the source. Plugin injects the advisor pointer only
  (grep of `.opencode/plugins` for constitutional/hygiene = 0 matches). No write-time
  hook exists (ADR-001).
- **Gemini**: `BeforeAgent` fires and injects `additionalContext = brief`
  (gemini/user-prompt-submit.ts:200-205) — but `brief` is the same pointer. The
  "probe session showed the rule" because the probe READ AGENTS.md; the dispatch
  session's rule signal was always AGENTS.md, never the hook. The 429 is a red
  herring (see below).
- **Codex**: `UserPromptSubmit` fires (`hook: UserPromptSubmit Completed`) and
  injects the pointer. Codex's WITH-rule refusal cited AGENTS.md because that is the
  only place the rule existed in its context. The hook contributed routing, not
  hygiene.
- **Devin**: identical shim (devin/user-prompt-submit.ts), identical pointer payload,
  identical AGENTS.md-only dependency.

## Risks & Trade-offs

- Injecting full rule text on EVERY prompt burns context budget and trains models to
  ignore a wall of boilerplate (banner blindness). The fix must be SHORT and
  imperative, not the whole markdown file.
- A hard system-prompt rule that the model cannot see/audit is brittle across
  provider prompt-format changes; prefer model-visible `additionalContext` so it is
  inspectable and testable.

## Assumptions and Evidence Gaps

- ASSUMPTION: the compiled `dist/` matches the `.ts` sources I read (standard build).
  Not separately diffed, but the shim delegation and the single-renderer design make
  divergence unlikely.
- GAP: I did not instrument a live session to capture the exact injected string;
  the conclusion is from static read of the only code path that can produce it. The
  static path is unambiguous (one renderer, one format).

## Alternative Challenged

REJECTED: "the hooks were mis-wired / disabled." Evidence contradicts it — Codex logs
`UserPromptSubmit Completed`, Gemini has `hooksConfig.enabled:true` + registered
`BeforeAgent`, OpenCode plugin transform is active. Wiring is fine. The payload is the
defect. Chasing a wiring fix would waste effort and leave the gap open.

## Confidence

92: The injection-path defect is proven by a single, unambiguous code path
(render.ts is the only emitter; its output format is fixed and pointer-only). The
only uncertainty is dist/source parity, which is low-risk.
