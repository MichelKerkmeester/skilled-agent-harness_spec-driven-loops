# Iteration 8 — Routing Doctrine and Discovery Audit

**Focus:** D1 Correctness + D3 Traceability — Angle 8: phase 011 claims each hub now states one always-loaded policy in the artifact the runtime reads, retired families are out of the deep-loop discovery vocabulary, and the manifests were re-minted. Also spot-checks the impl summary's measured runtime claims.
**Phase record audited:** `011-routing-doctrine-and-discovery`

## Method

1. Read every hub's `routerPolicy` block and checked for `defaultResourceSemantics`/`defaultResourceContract`.
2. Grepped the deep-loop `SKILL.md` keyword block for all six retired families.
3. Walked `graph-metadata.json` for retired vocabulary; used `git log -p` (read-only) to confirm which terms were dropped vs kept.
4. Verified the impl summary's runtime claims: schema `additionalProperties`, `DEFAULT_RESOURCE` in compiled-routing, the per-compiler census, and the sk-code fallback target's existence.
5. Reused iteration 7's guard run for the re-mint claim.

## Evidence

### Verified claims

- **All five hubs carry `defaultResourceSemantics: "fallback-only"`** plus a `defaultResourceContract` sentence that names the stage-two preamble as a distinct concept [SOURCE: each `hub-router.json` routerPolicy block; e.g. sk-code/hub-router.json:14-16].
- **Zero hits** for `conformance`, `standard-authority`, `conformance-review`, `read-only-default`, `context-gathering`, `reuse-catalog`, `skill-benchmark`, `deep-alignment` in `system-deep-loop/SKILL.md`.
- **graph-metadata**: `git log -p` on the re-mint commit shows `skill benchmark` and `standard-authority` removed; current state 26 trigger phrases / 12 key topics, zero duplicates — matching AC-006 exactly.
- **Runtime claims measured in the summary reproduce**: `compiled-policy.v1.schema.json` is `additionalProperties: false` with no `defaultResource` property; `grep -r DEFAULT_RESOURCE` over `.opencode/bin/lib/compiled-routing/` returns 0 hits; per-hub compiler census is exactly "three never reference (sk-code, system-deep-loop, mcp-tooling), one hardcodes `null` (cli-external-orchestration:235), one reads `defaultResource?.[0]` (sk-doc:313)".
- **sk-code fallback path is real**: `defaultResource: ["shared/README.md"]` and `.opencode/skills/sk-code/shared/README.md` exists — so the summary's counterfactual (trimming the JSON would orphan the loop's fallback load) is grounded.
- **Manifests fresh**: guard run from iteration 7 — all five hubs `fresh`, exit 0.

### Candidates adjudicated — not defects

- **Residual "model benchmark" discovery terms** (`intent_signals[10]` "agent improvement benchmark", `trigger_phrases[25]` "model benchmark", `key_topics[10]` "model-benchmark"): these map to deep-improvement's live lane-B model benchmark (documented in `deep-improvement/README.md`), not the retired `skill-benchmark` lane. The dropped terms were `skill benchmark` + `standard-authority` per the commit diff. Refuted.
- **`mcp-tooling` contract capitalizes "ONLY"**: same semantics, stylistic variance only. Noted, not a finding.
- The n1-shadow generic `compiler.cjs` does reference `defaultResource` (allowlist + non-null validation) — but the summary's "five compilers" census counts the five per-hub compilers; the generic layer validates the field's shape rather than consuming it. Consistent with the claim as scoped.

## Findings

None new. All four requirements and both success criteria verified mechanically; the impl summary's measured claims reproduce exactly.

## Verdict rationale

Doctrine and runtime agree; retired vocabulary is out; the kept terms map to live capabilities. The one non-executable check (full suite) is outside this lineage's write-containment but the guard half was independently re-run.

Review verdict: PASS
