# Deep Review Iteration 2

## Dimension

Security — shell and Git invocation, output-path handling, untrusted content execution, regex denial of service, and path traversal.

## Files Reviewed

- .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:448
- .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs:692
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:187
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:29
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:52
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh:38
- .skilled/skills/sk-doc/shared/scripts/validate_document.py:1803

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R2-P2-001 — Newline in a tracked Markdown path shifts batched Git replies

- File: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:452
- Claim: A tracked Markdown filename containing a line feed can add an extra request to the Git batch input. The decoder then associates successive replies with the original path list by position, without checking that a reply belongs to the current path.
- Evidence: Tracked paths are split on NUL at .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:179. The census batches document paths at .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:710, serializes requests with line-feed separators at .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:452, and iterates the original path list at .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:462. It assigns each returned body to the cache key for that list entry at .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:478. The regression fixture checks ordinary path names against git show but does not exercise a line-feed path at .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs:692.
- Finding class: class-of-bug.
- Scope proof: Within the census, the document list flows directly into one batch call and the positional cache loop. The loop validates response framing and size, but does not compare each returned object id with the requested path. The existing focused fixture verifies the ordinary case only.
- Counterevidence sought: The reply parser validates header shape and blob size, and the batch fixture checks ordinary cache results against git show. Neither rejects line feeds in a path or verifies reply identity.
- Alternative explanation: This affects advisory census output, and a repository policy could exclude line-feed pathnames. The reviewed inventory preserves them and no such restriction is enforced in the batching path.
- Final severity: P2.
- Confidence: 0.90.
- Downgrade trigger: Remove this finding only if the supported input contract excludes line-feed pathnames and the inventory enforces that invariant before batch serialization.
- Recommendation: Reject line-feed pathnames before batching or read those paths through a framing-safe per-path Git invocation; validate each response against its requested object.

## Traceability Checks

Formal core checks (spec_code and checklist_evidence) and overlay checks (skill_agent, agent_cross_runtime, feature_catalog_code, and playbook_capability) were not assessed in this security-only iteration; they remain for the traceability dimension. Test sources were inspected but no tests were executed.

## Next Dimension

Traceability.

## Verdict

Review verdict: PASS
