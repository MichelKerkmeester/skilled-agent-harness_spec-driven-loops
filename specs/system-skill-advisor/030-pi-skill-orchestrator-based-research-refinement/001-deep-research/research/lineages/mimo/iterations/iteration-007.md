# Iteration 7 — RQ6: Output bounds — result caps and truncation on both sides

Focus: the extension's 5/8 result caps and configured description truncation, where the advisor
bounds its brief, and whether the extension's limits would change what the model sees.

## Bounds inventory

**Extension** [CONFIRMED]:
- Search results: default 5, hard-clamped 1..8 (`context/pi-skill-orchestrator-main/src/search.ts:46`;
  tool schema `maximum: 8` at `context/pi-skill-orchestrator-main/src/index.ts:590`).
- Per-result description: flattened and truncated to `catalogDescriptionMax`, default 160,
  clamped 0..240, `0` ⇒ names only
  (`context/pi-skill-orchestrator-main/src/config.ts:45`, `:138-139`;
  `index.ts:603-609`).
- Ingestion: indexed descriptions normalized and sliced to 1024 chars
  (`context/pi-skill-orchestrator-main/src/catalog.ts:5-13`).
- Prompt stub: constant size (iteration 1).

**Advisor** [CONFIRMED]:
- Brief head: default 80 tokens / 320 chars, ambiguity 120 tokens, hard max 120, ellipsis
  truncation (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:79-81`, `:120-127`,
  `:427-438`). At most two labels (`render.ts:409-433`).
- The `Directives:` + hygiene block is concatenated **outside** the token cap
  (`render.ts:430`, `:438`) — constant, but not counted by the cap it sits next to.
- Shared-payload source refs: ≤8 skill refs, sorted
  (`.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:250`).
- Transport caps: CLI fallback stdout ≤1 MiB
  (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:80`), Claude hook
  prompt ≤64 KiB (`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:107`),
  Pi raw input ≤32 KiB (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:8`).
- Metadata ingestion: skill-graph metadata values over 512 chars are dropped to null
  (`.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/metadata-sanitizer.ts:11`, `:34`).

## Findings

### F7-1 — The 5/8 cap + 160-char description is the right output shape for a pull surface

- **Orchestrator mechanism** [CONFIRMED]: `skill_search` returns ≤5 numbered
  name-plus-truncated-description rows plus one steering line
  (`context/pi-skill-orchestrator-main/src/index.ts:610-616`), capped 1..8 (`search.ts:46`).
- **Advisor counterpart**: no multi-result model-visible surface today — the brief decides one
  (or two under ambiguity) labels (`render.ts:409-433`); a pull surface would need an output shape
  (cf. F3-2).
- **Proposed change**: if the F3-2 pull surface is built, adopt exactly these bounds: ≤5 rows
  default / ≤8 max, descriptions ≤160 chars flattened with ellipsis, names-only mode at 0.
- **Benefit**: proven shape (the extension ships tests around it), and it matches the brief's
  information density per row.
- **Cost**: zero design work — the constants transfer with the shape.
- **Risk**: none material; 5 rows × ~200 chars is well under one turn's usual tool output.
- **Verdict: ADOPT** — the limits are well-chosen and directly reusable for any advisor pull
  result; nothing changes for the pushed brief, which is already smaller.

### F7-2 — The brief's token cap counts the head only

- **Orchestrator mechanism**: n/a — the extension has no uncapped append; its stub is fully
  constant (iteration 1, `scope.ts:104-118`).
- **Advisor counterpart** [CONFIRMED]: `capText` bounds only the route line; then
  `DIRECTIVES_LABEL + HYGIENE_DIRECTIVE` (≈233 chars, `render.ts:101-107`) is concatenated after
  the cap (`render.ts:430`, `:438`). A "80-token brief" is really ~80 head tokens + ~58 directive
  tokens ≈ 138 tokens worst case.
- **Proposed change**: make the bound whole-brief: either fold the directive into the token cap or
  rename the accounting to `head tokens + fixed overhead`, and expose the real total in the
  delivered-bytes counter from F2-1. Keep the directive exempt from *shrinking* (it is a hard
  governance rule) but never uncounted.
- **Benefit**: honest cost numbers (the F2-1 measurement rests on this) and no surprise if the
  directive ever grows.
- **Cost**: a few lines in `render.ts` accounting.
- **Risk**: strictly enforcing a whole-brief cap could truncate the directive — avoid by counting,
  not clipping.
- **Verdict: ADAPT** — keep the constant directive, fix the accounting so the bound describes the
  thing the model actually receives.

### F7-3 — Drop-to-null vs truncate-and-keep on over-long metadata

- **Orchestrator mechanism** [CONFIRMED]: over-long descriptions are truncated to a 1024-char
  prefix and kept (`context/pi-skill-orchestrator-main/src/catalog.ts:7-13`) — partial signal
  survives.
- **Advisor counterpart** [CONFIRMED]: skill-graph metadata values over 512 chars return null and
  the field is dropped entirely (`.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/metadata-sanitizer.ts:11`,
  `:34`).
- **Proposed change**: for ranking-relevant fields (domains, intent_signals, keywords,
  description), keep a sanitized 512-char prefix instead of null when over length; keep
  drop-to-null for fields where a partial value would be semantically wrong (ids, paths).
- **Benefit**: an over-long intent signal stops silently demoting its skill in lexical/derived
  lanes.
- **Cost**: one policy switch per field class in the sanitizer.
- **Risk**: partial keywords may match weakly where the full value would not — bounded because
  the score clamps (F6-2) absorb it.
- **Verdict: ADAPT** — truncate-with-keep for signal fields is strictly more informative than
  drop, and it matches the extension's ingestion philosophy.

## Ruled out this iteration

- Raising or lowering the 5/8 or 80/120 constants themselves — no evidence in this phase says the
  numbers are wrong; only the accounting and the pull-shape reuse were examined.
- Token Saver's recovery-store budget (bounded in-memory, pass-through when too large —
  `context/pi-skill-orchestrator-main/docs/architecture.md:96`) — tool-result compression, out of
  scope per the phase spec except where noted.

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Extension caps: 5 default / 8 max, 160-char descriptions, 1024-char ingestion slice | CONFIRMED | — (`search.ts:46`, `config.ts:45,138-139`, `catalog.ts:5-13`) |
| Brief head is capped; the directive block is outside the cap | CONFIRMED | — (`render.ts:120-127,430,438`) |
| True worst-case delivered brief ≈ 138 tokens, not 80 | CONFIRMED (arithmetic on read constants) | — |
| Metadata >512 chars drops to null in the advisor sanitizer | CONFIRMED | — (`metadata-sanitizer.ts:11,34`) |
| Dropped signal fields measurably demote their skills | INFERRED | Score a corpus skill with vs without its over-length intent signals |
