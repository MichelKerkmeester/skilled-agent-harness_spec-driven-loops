# Iteration 2 — RQ1b: Prompt-cost quantification — eager catalog vs bounded brief

Focus: how many tokens each side spends per session/turn on routing metadata, where the cost is
paid (system prompt vs user-message tail), and where a scope stub + on-demand search could apply.

## Measurements (this repository, this runtime)

- Eager catalog on Pi: the `<available_skills>` block lists 16 skills. Sum of frontmatter
  description lengths measured on disk: 2,346 chars; names ≈ 280 chars; 16 absolute `SKILL.md`
  locations ≈ 1,840 chars; XML tags/structure ≈ 1,100 chars → **≈ 5.5 KB ≈ 1.3–1.5K tokens**,
  present in the system prompt of every Pi session [CONFIRMED: descriptions measured from
  `.pi/skills/*/SKILL.md` frontmatter this iteration; block format and location strings observed
  in this session's system prompt].
- Scope stub the orchestrator would substitute: 5 lines, ≈ 480 chars ≈ 120 tokens, independent of
  library size [CONFIRMED: `context/pi-skill-orchestrator-main/src/scope.ts:104-118`, string
  lengths counted].
- Advisor brief: head line capped at 80 tokens (320 chars), ambiguity variant at 120 tokens with
  at most two labels [CONFIRMED: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:79-81`,
  `:409-438`], plus `Directives:` + hygiene directive ≈ 233 chars uncapped
  [CONFIRMED: `render.ts:101-107`]. Total delivered contribution ≈ 0.5–0.7 KB ≈ 130–180 tokens.
- The brief shows **at most two** skill labels (top + ambiguous runner-up)
  [CONFIRMED: `render.ts:409-433`]; it never re-lists catalog data.

## Findings

### F2-1 — The cost split is asymmetric in *where* it is paid, not only in size

- **Orchestrator mechanism** [CONFIRMED]: the catalog is *removed* from the system prompt and the
  stub is a constant replacement (`context/pi-skill-orchestrator-main/src/catalog.ts:140-157`);
  the extension also refuses to rewrite history to protect provider prompt caches
  (`context/pi-skill-orchestrator-main/docs/architecture.md:113-117`).
- **Advisor counterpart** [CONFIRMED]: the brief is appended to each new user message on Pi
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:284-285`) and to the system
  prompt in the OpenCode plugin (`.skilled/skills/system-skill-advisor/ARCHITECTURE.md:133`).
  Identical repeats are suppressed on Pi (`prompt-advisor.ts:129-152`).
- **Analysis**: the catalog is ~8-10× the brief per occurrence but sits in the prefix-stable system
  prompt; the brief is small but recurs on the message tail of every delivered turn. Over a long
  session the cumulative brief cost can rival the catalog cost [INFERRED — depends on provider
  cache pricing and turn counts; would confirm with provider price sheets plus one session's usage
  log comparing cached-input vs full-input spend].
- **Proposed change**: instrument per-turn brief bytes (the Pi debug line already reports
  `durationMs` at `prompt-advisor.ts:176-191`; add delivered-byte accounting) before any
  prompt-cost refactor; then decide whether brief dedup should be default-on everywhere.
- **Benefit**: turns a design-taste argument into a measured one.
- **Cost**: one counter in the render path.
- **Risk**: none material.
- **Verdict: ADOPT** (measure-first accounting + default-on dedup) — the two mechanisms that
  actually control recurring cost already exist; they need measurement and wider use, not redesign.

### F2-2 — Scope-stub + on-demand search is Pi-first, not universal

- **Orchestrator mechanism** [CONFIRMED]: catalog rewrite happens in the `before_agent_start`
  extension hook, which owns the system prompt (`context/pi-skill-orchestrator-main/src/index.ts:281-326`).
- **Advisor counterpart** [CONFIRMED]: advisor adapters are prompt-submit surfaces —
  `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:133` lists Claude/Codex/Cursor/Devin/Pi
  adapters plus the OpenCode plugin; the Pi adapter transforms the input message
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:214-286`) and cannot delete
  system-prompt content. Claude/Codex/Cursor prompt-submit hooks can only add context
  [INFERRED — would confirm from each CLI's hook contract docs; the Claude adapter's
  `hookSpecificOutput.additionalContext` shape at `prompt-advisor.ts:248-250` is additive evidence].
- **Proposed change**: scope the "replace catalog with stub" idea to a Pi-side companion extension
  (out of advisor scope per phase spec), and keep the advisor's universal lever as the stub-style
  count line from F1-2.
- **Benefit**: honest targeting; no dead-end design for hook surfaces that cannot rewrite prompts.
- **Cost**: documentation of the runtime capability matrix.
- **Risk**: over-claiming Pi capability if `before_agent_start` semantics change — the
  orchestrator's own compatibility tests exist for exactly that
  (`context/pi-skill-orchestrator-main/tests/pi-compatibility.test.mjs`).
- **Verdict: ADAPT** — adopt the mechanism only where a system-prompt-owning surface exists (Pi
  first), and express the rest as brief-format discipline.

### F2-3 — Advisor-side caches save advisor compute, not model tokens

- **Orchestrator mechanism**: none (the extension keeps metadata in memory, no answer cache;
  `context/pi-skill-orchestrator-main/src/index.ts:282-284` rebuilds records per turn).
- **Advisor counterpart** [CONFIRMED]: an exact-prompt cache with HMAC keying, 5-minute TTL and
  1000-entry bound (`.skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:10-13`,
  `:69-80`), plus prompt-policy gates that skip trivial prompts entirely
  (`.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:60-67` — `fire:false` for
  short/casual input means *no brief at all*, the cheapest possible output).
- **Proposed change**: none. Record that the advisor already has three cost gates (policy skip,
  cache, dedup) the orchestrator lacks; the orchestrator's win is only in the O(n) catalog term.
- **Benefit**: correct attribution of cost levers.
- **Cost**: none.
- **Risk**: none.
- **Verdict: REJECT** (adopting orchestrator cost machinery here) — the advisor's per-request
  caching and policy skip already dominate what the extension could add; the catalog term is the
  only real gap and it is a runtime concern.

## Ruled out this iteration

- A token-perfect reproduction of Pi's catalog renderer — the on-disk frontmatter sum plus the
  observed block format bounds it within ~10%, which is sufficient for an 8-10× ratio claim.
- Token Saver tool-schema deferral as a cost lever — tool schema volume, not skill routing; out of
  scope except as noted in F3 (deferred to RQ6/RQ7 passes).

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Eager catalog ≈ 5.5 KB / ~1.4K tokens on this Pi setup | CONFIRMED (measured) | — |
| Brief ≈ 0.5-0.7 KB / ~130-180 tokens, ≤2 labels | CONFIRMED | — (`render.ts:79-81,101-107,409-438`) |
| Cumulative brief cost can rival catalog cost in long sessions | INFERRED | Provider cache pricing + one session's usage log |
| Prompt-submit hooks (Claude/Codex/Cursor) cannot strip the system catalog | INFERRED | Each CLI's hook contract; `additionalContext`-style additive shapes |
| OpenCode plugin appends the brief to the system prompt | CONFIRMED | — (`ARCHITECTURE.md:133`) |
