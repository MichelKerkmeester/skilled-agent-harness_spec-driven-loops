# Iteration 2: Parent routing references versus live compiled runtime

## Focus
Parent routing-reference claims versus the live compiled-routing runtime and all seven hub surfaces.

## Actions Taken
- Read the four parent reference documents and captured exact line ranges for carrier coverage, serving authority, demotion-to-telemetry, and bundle-rule claims.
- Enumerated the seven hubs named by the parent reference: `sk-code`, `sk-doc`, `sk-design`, `sk-prompt`, `mcp-tooling`, `system-deep-loop`, and `cli-external-orchestration`.
- Parsed each hub's `hub-router.json`, `mode-registry.json`, and `leaf-manifest.json`; verified all seven shared `smart-routing.md` files exist and contain a fenced routing projection.
- Inspected and executed the public compiled-route front door, then traced its resolver through the compiled runtime engine and representative compiled hub routers.
- Compared the relevant parent-reference lines with the pre-`140266be3e` versions to classify each discrepancy.

## Findings

### P1: PRE-EXISTING — the parent reference contradicts itself about the seven-hub surface-router contract
Evidence: `routing-config-and-advisor-reference.md:136` says the `smart-routing.md` surface router is carried only by `sk-code` and `sk-doc`, and `:184` repeats that coverage matrix. The same document says all seven hubs carry it at `:199` and that the collapse is 7-of-7 at `:202`. On disk, each of the seven named hubs has `shared/references/smart-routing.md` with a fenced projection, and each has a populated `leaf-manifest.json` with `resourceContractVersion: 1`; the live file set therefore agrees with the 7-of-7 claim, not the 2-of-7 claim. The contradiction is present in the parent version before `140266be3e`; the commit did not edit these carrier lines.

### P1: PRE-EXISTING — the parent describes hub-router selection as telemetry-only while the live compiled serving path consumes compiled hub policy
Evidence: `routing-config-and-advisor-reference.md:202` says hub-router mode selection is consumed only as `routeTelemetry`, while `:131` in `routing-before-after.md` identifies the compiled runtime as current serving authority. The actual `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs:65-82` loads each compiled hub snapshot and its `canary-router.cjs` or `router.cjs`, and `:94-106` evaluates that compiled policy to produce the served decision. Representative live engines consume policy-defined bundle rules at `006-parent-hub-rollout/007-sk-doc/lib/router.cjs:167-172`, `006-parent-hub-rollout/006-sk-design/lib/router.cjs:158-163`, and `006-parent-hub-rollout/003-mcp-tooling/lib/router.cjs:119-127`; this is serving behavior, not telemetry. The parent prose may describe the benchmark replay lane, but it does not scope the claim that way and is inconsistent with its own current-serving-authority note. The mismatch predates `140266be3e`; the relevant line was unchanged by that commit.

## Questions Answered
- All seven named hubs have the expected live routing surface and typed manifest on disk; the parent reference has a stale 2-of-7 carrier statement alongside its correct 7-of-7 statement.
- The compiled serving path is present and executable, but its policy-consuming semantics are not captured by the parent's blanket telemetry-only description.

## Questions Remaining
- Does `140266be3e` leave any new wrong metric, stale link, or changed claim beyond these pre-existing contradictions?
- Do parent and nested graph metadata agree with the actual 21-child and nested topology?
- Which cross-document links are broken or non-rooted after excluding frozen artifacts?

## Sources Consulted
- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:136,184,191,199,202`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-before-after.md:131`
- `.opencode/bin/compiled-route.cjs:4-45`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/compiled-route.cjs:65-106`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:167-172`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/router.cjs:158-163`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/003-mcp-tooling/lib/router.cjs:119-127`

## Recommended Next Focus
Diff every parent document touched by `140266be3e` against its parent revision and run a root-aware markdown-link audit over the non-excluded tree.

## Ruled Out
- The compiled runtime being absent or merely represented by a manifest was ruled out: the tracked closure contains the runtime engine, seven activation manifests, and the public front door executed successfully for all seven hubs.
- Treating the 2-of-7 statement as current runtime truth was ruled out by direct seven-hub enumeration.
