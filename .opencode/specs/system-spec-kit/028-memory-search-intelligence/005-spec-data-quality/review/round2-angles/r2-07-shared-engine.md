# r2-07 shared-engine (architecture)

**Angle summary:** The one-engine-three-doors design is architecturally sound and earns its abstraction (a genuinely shared safety-critical decision over git-tracked authored docs, committed consumers, principled build-order), but the spec overstates INV-1 as "mechanical" when it can only cross-check human declarations, and its headline success criterion plus INV-2 are forward-declared against consumers that do not exist this phase.

**Grounding note (positive):** Round1 F001 (the `scripts -> mcp_server/handlers` import-boundary blocker) is now resolved via the api-barrel route, and I confirmed the resolution holds against live code: `scripts/tsconfig.json:11` maps `@spec-kit/mcp-server/api`, `mcp_server/package.json:10` exports `./api`, and `scripts/evals/import-policy-rules.ts:12-16` prohibits only `lib/core/handlers`, not `/api`. The load-bearing reuse seam is buildable as now specified. I did not re-raise F001/F002/F003.

---

## FINDINGS

### F1 [P1] INV-1 is sold as "mechanical" but can only check declarations, not behavior
- **Evidence (SPEC-PREMISE):** `026-shared-safe-fix-engine/spec.md:79` ("The two structural invariants encoded mechanically. INV-1, a detector that touches an authored-doc body is never `safe`"), `spec.md:111` (REQ-004 acceptance: "A registry entry that declares `safe` on a body-mutating detector fails the invariant check"), `spec.md:211` (the only cited mechanism: "a `computeAuthoredDocQuality` wrapper that throws on full-auto and ... quarantining the budget-trim to memory-save").
- **Live cross-check:** `rg computeAuthoredDocQuality|touchesBody|body-mutat` over `scripts` and `mcp_server` returns nothing, so the mechanism is a design claim, not built code (consistent with research-only).
- **The architecture gap:** a `fix()` is an arbitrary function. Nothing can mechanically prove an arbitrary fix does not mutate an authored body. The two cited mechanisms only fence off the ONE known destructive path (`runQualityLoop` / `attemptAutoFix`, the 8000-char trim at `mcp_server/handlers/quality-loop.ts:465`). For any NEW detector added later, INV-1 reduces to the registry author correctly setting `fixClass`, and REQ-004's check can only compare that declaration against another declaration (some `touchesBody`-style flag), not against the fix's real behavior. So the self-guarding registry guards a declaration against a declaration. Deny-by-default backstops OMISSION (no class becomes `none`), but neither deny-by-default nor INV-1 catches MISCLASSIFICATION (a body-mutating fix wrongly tagged `safe`), which is the exact failure the risk table at `spec.md:140` says INV-1 prevents. The spec should state INV-1 as a declaration-consistency check plus human review, not a mechanical behavioral guarantee.

### F2 [P2] SC-001, the headline "one engine serves three doors" criterion, is unverifiable within 026
- **Evidence (SPEC-PREMISE):** `spec.md:128` (SC-001: "proven by A1, B1, and B2 importing the same `detector-registry.ts` and calling the same `runDetectors`") against the build order at `spec.md:215` ("engine before front doors") and the Out-of-Scope list `spec.md:82-86` placing A1 (001), B1 (011), B2 (012) in separate unbuilt phases.
- **The architecture gap:** the engine is built first, so no consumer exists to prove the "shared, not forked" property, and the `runDetectors(target, opts)` signature plus the `{issues, applied, skipped}` return are designed against three hypothetical consumer shapes (A1 single-target on-write, B1 corpus sweep, B2 interactive) with none available to validate the API fits all three. The phase can be marked complete while its own headline success criterion cannot be tested. This is the one real over-abstraction risk in an otherwise-earned design. Recommend restating SC-001 to something falsifiable within 026 (a fixture consumer or a contract test that exercises all three call shapes against the real engine).

### F3 [P2] INV-2 is forward-declared against an empty member set and an unbuilt gate
- **Evidence (SPEC-PREMISE):** `spec.md:208` lists the five frozen `safe` entries (`desc.shape`, `enum.tier_status_ctype`, `triggers.propagate`, `hvr.style`, `anchor.unclosed`), all authored-doc structural, zero retrieval-class. INV-2 routes retrieval-class promotions through 015-c2 (`spec.md:79,216`), and `plan.md:163` records that 015-c2 dependency as **Yellow** (not built).
- **The architecture gap:** INV-2 guards a category with no members in this phase and points at a gate that does not exist yet, so its enforcement is inert at 026. That is cheap and degrades safely (retrieval detectors stay suggest-only by default), but any claim that "the engine enforces INV-2" is aspirational until 015-c2 lands. Recommend the spec mark INV-2 explicitly as a forward-declared guard with no live enforcement path this phase, so a builder does not test it as active.

### F4 [P2] "guarded-class" vocabulary collides with the three-value fixClass enum
- **Evidence (SPEC-PREMISE):** `spec.md:74` and `spec.md:209` define `fixClass` as "one of `safe`, `risky`, or `none`", deny-by-default. `spec.md:119` (REQ-007) and `spec.md:207` then describe the allow-list edit as "a `guarded`-class change". Two different vocabularies share the word "class".
- **The architecture gap:** "guarded" is a change-management classification of the registry-edit ACT, not a detector `fixClass` value, but the shared "class" wording invites a builder to read it as a fourth `fixClass`. If someone implements `fixClass: 'guarded'`, the deny-by-default filter (`allowFixClass` always `['safe']`, `spec.md:77`) silently skips it, but it falls outside the declared three-value enum and any enum-validation the registry adds. Recommend renaming the edit classification (for example "guarded registry change") so the detector enum stays unambiguously three values.

---

## RETURN
- **Slice:** r2-07 shared-engine (architecture)
- **Counts:** P0: 0 | P1: 1 | P2: 3
- **Most important:** F1 [P1] INV-1 is sold as "mechanical" (`spec.md:79,111,211`) but the self-guarding registry can only cross-check human declarations, not the real behavior of an arbitrary `fix()`. Deny-by-default catches omission, nothing catches a body-mutating fix misclassified as `safe`, which is the exact risk INV-1 is claimed to close.
