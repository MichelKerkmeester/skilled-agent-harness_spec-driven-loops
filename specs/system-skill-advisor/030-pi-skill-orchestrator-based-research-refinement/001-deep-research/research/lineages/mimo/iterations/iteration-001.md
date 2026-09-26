# Iteration 1 — RQ1a: Lazy catalog with scope stub (orchestrator) vs advisor push surface

Focus: how the orchestrator removes Pi's eager skill catalog and replaces it with a constant-size
scope stub, and what the advisor does instead on the same runtime.

## Findings

### F1-1 — Conservative eager-catalog removal + single scope-stub replacement (RQ1)

- **Orchestrator mechanism** [CONFIRMED]: `context/pi-skill-orchestrator-main/src/catalog.ts:95-134`
  (`nativeSkillCatalogRanges`) scans *every* `<available_skills>` block and treats one as Pi's
  native catalog only when it contains a known skill name or an associated preamble (preamble
  string matched at `catalog.ts:98`; association guarded at `catalog.ts:118-120`).
  `catalog.ts:140-157` (`replaceNativeSkillCatalog`) removes all recognized ranges and inserts
  exactly one replacement at the first removed position. The rewrite runs per turn in
  `context/pi-skill-orchestrator-main/src/index.ts:281-326` (`before_agent_start`), and when no
  safe range is found but a catalog *looks* present (`catalog.ts:170-188`,
  `containsPotentialNativeSkillCatalog`), it warns instead of deleting
  (`index.ts:309-318`) and returns the prompt unchanged. Docs state the same contract:
  `context/pi-skill-orchestrator-main/docs/architecture.md:21-25`, `:121-123`.
  Tests guarantee no name/description/path leakage after stripping
  (`context/pi-skill-orchestrator-main/tests/catalog.test.mjs:41-52`) and exactly one stub even
  for duplicate catalogs (`tests/catalog.test.mjs:86-93`).
- **Advisor counterpart**: none for stripping. The advisor never rewrites the system prompt; the
  Pi hook appends the brief onto the user prompt text
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:284-285`). The eager catalog
  therefore remains in the model's system prompt alongside the brief [CONFIRMED by the runtime's
  own `<available_skills>` block being present in this session's system prompt, and by the
  preamble wording the orchestrator matches verbatim at `catalog.ts:98`].
- **Proposed change**: do not strip the catalog from inside the advisor (that rewrite belongs to
  a Pi extension layer). Instead treat "never restate catalog data in the brief" as an explicit
  advisor output invariant.
- **Expected benefit**: prevents double payment (catalog + brief restating names/descriptions).
- **Cost**: near zero (policy wording + a render guard).
- **Risk**: if the advisor ever needs to name a skill outside the catalog, a strict invariant
  would forbid it — needs an allowlist for the recommended skill name itself (which the brief
  already carries at `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:415-436`).
- **Verdict: ADAPT** — the stripping is a runtime-extension concern and out of the advisor's
  blast radius, but the constant-size, zero-catalog-data stub discipline is worth adopting as a
  brief-format invariant.

### F1-2 — Scope stub is constant-size; the eager catalog is O(library)

- **Orchestrator mechanism** [CONFIRMED]: `context/pi-skill-orchestrator-main/src/scope.ts:104-118`
  (`renderScopeCatalog`) emits five fixed lines carrying only scope label, candidate *count* and
  usage instructions — "Installed skill names, descriptions, locations, and SKILL.md bodies are
  intentionally omitted" (`scope.ts:114`). Cost grows only by digit count of the candidate number.
- **Advisor counterpart** [CONFIRMED]: the brief is already bounded: default 80-token cap,
  ambiguous 120, hard max 120 (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:79-81`),
  enforced as charCap = tokens×4 with `...` truncation (`render.ts:120-127`). On Pi, identical
  repeated briefs are suppressed entirely per session
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:129-152`).
- **Proposed change**: none structural; the advisor already matches the stub's cost discipline.
  The gap is that the *runtime catalog* still costs O(n) every turn on Pi while the brief rides on
  top (see F1-1). A scope-stub-style count line ("N skills indexed, brief covers top 1") would let
  the model know the pull-able universe without listing it.
- **Expected benefit**: model awareness of discovery depth without catalog tokens.
- **Cost**: one line in the brief (~15 tokens) or in a companion stub.
- **Risk**: stale counts when the skill set changes mid-session; must be regenerated per turn like
  the orchestrator does (`index.ts:298-301`).
- **Verdict: ADOPT** (the count-line stub) — it is the cheapest transferable unit of the lazy
  catalog design and adds no new surface.

### F1-3 — The brief does not replace the catalog; it adds to it on Pi

- **Orchestrator mechanism** [CONFIRMED]: replacement semantics — strip-then-insert one stub
  (`context/pi-skill-orchestrator-main/src/catalog.ts:140-157`); if the catalog cannot be safely
  recognized, the extension appends only the stub (`index.ts:321-325`), never duplicating data.
- **Advisor counterpart** [CONFIRMED]: additive semantics — `prompt-advisor.ts:284-285` returns
  `transform` with `event.text + "\n\n" + briefBlock`; the system prompt is untouched. The de-dup
  path (`prompt-advisor.ts:261-276`) is the only cost reducer and only fires on exact repeats.
- **Proposed change**: record the add-vs-replace asymmetry as a design constraint: on Pi the total
  per-turn routing cost = O(catalog) + O(brief); any advisor-side improvement that only shrinks
  the brief has a floor it cannot cross while the catalog is eager.
- **Expected benefit**: sets realistic expectations for prompt-cost work (RQ1b measures the split).
- **Cost**: none (analysis finding).
- **Risk**: none.
- **Verdict: REJECT** (brief-replaces-catalog inside the advisor) — the advisor cannot remove
  prompt content it does not own; catalog removal is only safe from a system-prompt-owning
  extension with the conservative recognizer the orchestrator built.

## Ruled out this iteration

- Editing or even proposing a change to `context/pi-skill-orchestrator-main/` — reference material,
  read-only by charter.
- Measuring real token counts of the eager catalog — deferred to iteration 2 (RQ1b), which
  quantifies the split across runtimes.

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Catalog stripping is conservative and warn-not-delete on unknown formats | CONFIRMED | — (read `catalog.ts:95-188`, `index.ts:302-319`, `tests/catalog.test.mjs:97-109`) |
| Advisor brief is additive on Pi, ≤120 tokens, deduped on repeat | CONFIRMED | — (read `prompt-advisor.ts:284-285`, `render.ts:79-127`) |
| The eager `<available_skills>` catalog is present in model context on Pi today | CONFIRMED | — (present in this session's system prompt; preamble string matches `catalog.ts:98`) |
| Non-Pi runtimes (claude/codex/cursor) have no native all-skill catalog to strip | INFERRED | Read each runtime's system-prompt construction (e.g. Claude Code skill injection docs) and confirm no name+description+path block exists |
