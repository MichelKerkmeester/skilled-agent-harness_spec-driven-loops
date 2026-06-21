# Iteration 006 - KQ6: Command-doc quality automation

**Focus:** What command-doc quality automation exists across the command surface and what is missing.
**newInfoRatio:** 0.55
**Novelty:** Command QA is a router-manifest integrity check scoped to /doctor only; surfaces the enforced mutation-class enum as the typed-governance pattern the spec metadata lacks; confirms the recurring presence-not-quality / structural-only theme (convergence signal).
**Status:** complete

## What I examined
- `route-validate.py` assertion contract (`:1-30`) [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:1-30]
- Command families: `commands/{memory,doctor,speckit,deep,create}` [SOURCE: dir listing]
- `route-validate.sh`, `check-mcp-mutation-class.sh` [SOURCE: file listing]

## Findings

### F1. Command QA is real but narrow — a manifest-integrity CI assertion for /doctor only
`route-validate.py` validates `commands/doctor/_routes.yaml` for: YAML+schema_version, route integrity + required keys, no duplicate targets, asset existence, **mutation class in {read-only, add-only, mutates}**, `mcp_tools` subset of the allowed-tools union, **≥1 trigger phrase per route**, and flag-collision flagging (`:7-22`). This is a strong structural gate — but it is **doctor-specific**. The other command families (memory, speckit, deep, create) have no equivalent corpus-wide route/quality validator.

### F2. Commands already check trigger-phrase PRESENCE (better than spec docs) but still not quality
Assertion G ("every route has ≥1 trigger phrase") means the doctor command surface enforces a trigger-phrase floor the spec corpus never enforces. But it is presence-only: nothing checks the trigger phrases are discriminative across commands or match the command body — the same content-quality hole seen in iters 3-5.

### F3. The mutation-class enum is the typed-governance pattern the spec metadata is missing
`route-validate.py` enforces `mutation_class in {read-only, add-only, mutates}` and `check-mcp-mutation-class.sh` backs it. This is exactly the **enforced-enum discipline** the spec metadata lacks: iter 3 F2 found `importance_tier`/`status`/`content_type` are free `z.string()` with no enum. Cross-pollination: give the spec metadata JSONs the same enforced enums the command surface already has for mutation_class. Floor-bypassing, trivial, logic+governance reader.

### F4. Recurring theme = convergence signal
KQ6 surfaced no new *category* of gap. Across KQ1-KQ6 the same three findings recur: (a) automation is structural/presence, never content-quality; (b) automation detects/blocks, never refines; (c) coverage is uneven (rich where someone built it — doctor router, skill advisor — absent elsewhere). The corpus needs a **uniform** quality layer, not more point checks. This recurrence is the first strong convergence signal.

## Dead Ends / Ruled Out
- Expecting a corpus-wide command linter: ruled out — only the doctor router has a manifest validator; coverage is per-builder, not systemic.
- Treating ≥1-trigger-phrase as a quality check: ruled out — presence-only, like every other trigger check found.

## Answers
- **KQ6 answered:** Command QA = a /doctor-scoped manifest-integrity validator (mutation-class enum, ≥1 trigger phrase, asset/tool subset checks). Missing: corpus-wide command-doc quality, discriminative description/trigger checks, body-matches-frontmatter. Best borrowable asset: the enforced mutation-class enum -> apply enum discipline to spec metadata.

## Next focus
KQ7: context-engineering-layer automation (assembly, retrieval, injection, prompt packs, memory write safety).
