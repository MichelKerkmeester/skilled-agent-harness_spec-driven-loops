# Review Iteration 007 — Template metadata residue

## Route

Resolved route: mode=review target_agent=deep-review

## Files reviewed

- `.opencode/skills/system-spec-kit/templates/packet-types/review.spec.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:572-627`

## Finding

### F008 — P2 — Packet templates retain template-session and template-tag defaults

The review packet template contains `[template:review/spec.md]` and `template-session` defaults, while the core implementation-summary source retains template-only path/default markers. `create.sh` has replacement logic for some scaffold fields, but the source contract itself does not make the rendered-output invariant explicit, and packet-type rendering has a separate path. This creates a maintainability risk of template identifiers leaking into authored metadata.

Disposition: active. Finding class: `template-residue`. Scope proof: direct source reads and comparison with the scaffold substitution block.

## Claim adjudication

Claim F008: accepted P2. Counterevidence sought: `create.sh` replacement logic. Alternative explanation: these markers may be intentionally replaced, but no single post-render assertion covers packet-type output. Validator fingerprint: `template-marker-sweep-v1`.

## Search coverage

`reviewDepthSchemaVersion: 2`; `graphCoverageMode: graphless_fallback`. Search ledger rows: `review packet template -> finding:F008`; `core metadata defaults -> finding:F008`; `rendered-title markers -> finding:F008`.

Review verdict: CONDITIONAL
