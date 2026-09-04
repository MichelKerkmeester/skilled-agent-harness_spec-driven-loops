---
title: "Iteration 6: D2 Security — preserved advisor and trust-boundary surfaces"
trigger_phrases: []
---

# Iteration 6: D2 Security — preserved advisor and trust-boundary surfaces

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`

## Focus

Primary dimension: security. This pass follows preserved advisor isolation from the launcher environment and database boundary through the shared embedder and IPC contracts, rechecks the remote HF request perimeter, and then tests the opt-in documentation-trigger harvest for malformed frontmatter delimiters. The only new issue is a parser-boundary robustness gap; the trust-state vocabulary, local registry bridge, secret scrubber, and launcher fixture contracts did not support additional findings.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 18
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Scope inventory: 438 paths in `scratch/review-scope.txt`; this iteration reviewed 18 listed paths

## Findings

### P0, Blocker

- None.

### P1, Required

- None newly opened. F003 remains active: the remote-bind token is still present only in the bind gate and is not checked by the HTTP request handler.

### P2, Advisory

- **F008 — Doc-frontmatter harvest accepts a non-fence line as the closing delimiter.** `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts:93-98]` `parseDocFrontmatter` searches for the first `\n---` prefix rather than a complete closing-fence line, so a content line such as `---not-a-fence` terminates the parsed block and causes subsequent frontmatter keys or trigger phrases to be ignored. `[SOURCE: .opencode/skills/system-skill-advisor/README.md:140-144]` The harvested `references/` and `assets/` metadata is an opt-in routing input, so this can silently remove a document's routing signal or return partial metadata when a document contains an ambiguous delimiter. The boundary is a malformed-input case and does not cross into code execution or arbitrary file access, so severity is P2. This is confirmed from the delimiter predicate; a focused fixture with a `---not-a-fence` line would confirm the resulting partial parse end to end.
  - Recommendation: require the closing marker to be an entire line (`---` followed by CRLF, LF, or end-of-input), reject or report malformed fences, and add a regression case for prefix collisions while preserving valid Windows line endings.

## Claim adjudication

```json
[
  {
    "findingId": "F008",
    "claim": "The doc-trigger parser can terminate frontmatter at a line that only begins with the closing-fence token.",
    "evidenceRefs": [
      ".opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts:93-98",
      ".opencode/skills/system-skill-advisor/README.md:140-144"
    ],
    "counterevidenceSought": "Checked the opening-fence guard, closing search expression, block slicing and the documented references/assets consumer path; no whole-line check exists.",
    "alternativeExplanation": "Repository-authored docs normally use standalone `---` lines. That convention does not make the parser's prefix match equivalent to a strict frontmatter delimiter for malformed or hand-edited input.",
    "finalSeverity": "P2",
    "confidence": 0.91,
    "downgradeTrigger": "If the ingest caller validates complete YAML/frontmatter fences before calling this parser, or the parser is proven unreachable for external or hand-edited docs, downgrade to documentation/test debt.",
    "transitions": [
      { "iteration": 6, "from": null, "to": "P2", "reason": "A prefix-only closing-fence search can silently truncate the opt-in routing metadata block." }
    ]
  }
]
```

## Search and ruled-out checks

- The local advisor embedder registry is a deliberate re-export of the shared canonical registry, and the parity fixture constrains the one real manifest; no registry divergence or purged-model resurrection was supported `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/embedders/registry.ts:1-14]` `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/embedders/shared-factory-parity.vitest.ts:1-102]`.
- The launcher allowlist and bootstrap tests restrict child environment propagation to named values and explicitly compute the advisor-owned database and IPC directory; the duplicate environment expression in the launcher is harmless maintenance noise, not a trust-boundary bypass `[SOURCE: .opencode/bin/system-skill-advisor-launcher.cjs:103-159,282-307,342-352]` `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/launcher-bootstrap.vitest.ts:88-176]`.
- The database policy and standalone shape keep advisor SQLite ownership package-local, while the lease tests cover live, stale and override-keyed ownership; no additional cross-server writer path was evidenced `[SOURCE: .opencode/skills/system-skill-advisor/references/config/db-path-policy.md:42-86]` `[SOURCE: .opencode/skills/system-skill-advisor/references/runtime/standalone-mcp-shape.md:43-66]` `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/launcher-lease.vitest.ts:269-280,401-490]`.
- The shared payload validator rejects prompt-derived source refs, enforces sanitized labels, and preserves the explicit trust-state vocabulary; the `quarantined` playbook term is not part of the advisor response vocabulary and was not treated as a mismatch `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:47-102,543-620]` `[SOURCE: .opencode/skills/system-skill-advisor/README.md:126-144]`.
- The shared HF client still sends only content headers, so F003 remains active; no second independent request-auth issue was opened. The cascade and HF timeout env parsers use permissive integer prefixes, but this is the same malformed numeric-input family already captured by F002 and was deferred rather than duplicated `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:107-125]` `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:302-312,489-500,634-651]`.
- The secret scrubber applies ordered credential patterns and fail-closed replacement, and the launcher model-server default tests cover unset, enabled and explicit-off values; no new secret propagation or default-on regression was supported `[SOURCE: .opencode/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:1-251]` `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/launcher-model-server-default.vitest.ts:1-47]`.

## Traceability checks

- `spec_code`: partial. The opt-in doc-trigger contract is implemented, but the parser's closing delimiter is weaker than the frontmatter boundary it consumes (F008); F003 remains an unresolved security perimeter issue.
- `checklist_evidence`: blocked. No authoritative validator or checklist gate was run under the explicit lineage-only write boundary.

## Adversarial self-check

- Hunter: traced child-env allowlisting, database ownership, lease identity, shared payload trust states, HF transport headers, secret scrubbing, and the doc-harvest parser/consumer path.
- Skeptic: standard repository docs use standalone `---` lines and the harvest flag is off by default; those facts reduce exposure but do not make the parser's prefix match safe for malformed input when the flag is enabled.
- Referee: F008 is distinct from F002's CLI limit parser because it affects frontmatter block termination and routing metadata, not command-line numeric parsing. Existing F001-F007 remain active with unchanged severity.

## Next dimension

D1 Correctness / D3 Traceability — shared system-spec-kit engine, templates and cross-reference surfaces; continue the forced-depth loop despite convergence telemetry.

Review verdict: CONDITIONAL
