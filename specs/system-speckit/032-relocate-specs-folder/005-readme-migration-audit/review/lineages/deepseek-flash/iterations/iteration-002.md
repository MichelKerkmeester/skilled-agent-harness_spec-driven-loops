# Iteration 2: D2 Security

## Focus

Security dimension on the same README set: trust boundaries, integrity guards, secrets exposure, path-handling under the symlink flip. Focus files: `.opencode/bin/README.md`, `check-no-spec-imports.cjs`, git-hooks/drift-marker docs, deep relative links in mcp-server hooks READMEs, secret scan across all 23 hit files.

## Scorecard

- Dimensions covered: [correctness, security]
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P1, Required

- **F013**: bin/README durable-invariant claim no longer matches post-flip root coverage, `.opencode/bin/README.md:28` + `.opencode/bin/check-no-spec-imports.cjs:26`
  - Evidence: README claims "nothing under `bin/` reaches into `.opencode/specs/` at runtime, so the serving path cannot break when the authored tree moves." The guard's `SPECS_ROOT = path.join(REPO_ROOT, '.opencode', 'specs')`. Post-flip the canonical spec tree is `specs/` (top-level). A relative canonical-root import from `.opencode/bin/lib/` (`../../../specs/sk-doc/...`) resolves lexically to `/Public/specs/...`, and the guard's `underSpecs()` returns `false` (verified via Node lexical-resolution test). The integrity guard — and the README's security claim about it — is scoped to the legacy alias only; imports from the canonical root pass undetected.
  - Recommendation: Re-point the guard to the canonical `specs/` root (or both roots) and update the README invariant claim.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | bin/README.md:28 vs check-no-spec-imports.cjs:26 | Security invariant doc claim is stale relative to shipped root coverage |
| checklist_evidence | notApplicable | hard | - | No checklist.md |

## Assessment

- New findings ratio: 1.0
- Dimensions addressed: [security]
- Novelty justification: F013 is a distinct security-relevant gap (guard scoped to legacy alias), separate from F001/F002 correctness findings.

## Ruled Out

- Secrets exposure: scanned all 23 non-specs hit READMEs for api_key/secret/token/password patterns — only placeholder values (`your-key-here`) and env-var names documented (VOYAGE_API_KEY, OPENAI_API_KEY, HF_EMBED_AUTH_TOKEN as config docs, not live credentials). No exposure.
- Deep relative links in mcp-server hooks cursor/devin READMEs resolve correctly through the symlink to the canonical packet (`realpath` confirmed both target files exist) — no broken trust boundary.
- Path-escape: sk-design `--output .opencode/specs/<track>/<packet>/output` writes via symlink into `specs/` — functionally contained, no escape (a P2 doc-staleness already captured as F006, not a security issue).

## Dead Ends

- None.

## Recommended Next Focus

D3 Traceability — run `spec_code` core protocol against the spec folder itself: verify REQ-001..REQ-004 claims, plan.md dual-executor claims, and README findings vs spec.md scope. Also verify whether the root README's `specs/` link form (canonical) is used anywhere vs the legacy alias.

## Claim Adjudication

```json
{
  "findingId": "F013",
  "claim": "The check-no-spec-imports integrity guard (and the bin/README invariant claim about it) is scoped to the legacy `.opencode/specs` alias; canonical-root `specs/` imports pass undetected post-flip.",
  "evidenceRefs": [".opencode/bin/README.md:28", ".opencode/bin/check-no-spec-imports.cjs:26"],
  "counterevidenceSought": "Ran a lexical Node resolution test from .opencode/bin/lib with `../../../specs/sk-doc/019-skill-routing-refactor/engine.ts`; underSpecs() returned false. Also checked compiled-route-sync.cjs SPECS_ROOT (still .opencode/specs).",
  "alternativeExplanation": "The guard could be intentionally legacy-scoped if no runtime file imports canonical specs/ today; but the README presents the invariant as protecting against the authored tree moving, which is exactly the flip that just happened.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "If a follow-up confirms the guard now checks the canonical root or an explicit dual-root policy, downgrade to P2.",
  "transitions": [ { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" } ]
}
```

Review verdict: CONDITIONAL
