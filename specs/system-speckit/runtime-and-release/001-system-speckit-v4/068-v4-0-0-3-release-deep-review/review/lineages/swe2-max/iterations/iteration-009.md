# Iteration 009 — maintainability: sk-code-webflow + sk-design doc-heavy tail

## Scope and method

- **sk-design validator contract** — three docs updated in lockstep
  (`feature-catalog/validate/validate.md`, `references/quality-checklist.md`
  [VS-05], `references/validate/phantom-hex-detection.md`): the verdict moved
  from "`isPass()` requires `claimsScore >= 80`" to "`isValidationPass()`
  passes on zero hard failures in `target`/`schema`/`provenance`".
  Verified against code: `validate.ts:699` `isValidationPass` =
  `failures.length === 0`; `:730` `claimsScore < 80` prints advisory only;
  `:765` CLI exits on `isValidationPass`. `validate.ts` itself was untouched
  in this range — the docs were stale and this release corrected them. The
  new text matches behavior exactly, including the soft claimsScore advisory.
- **sk-design hub routing** — `SKILL.md` rule 6 rewritten: "never quote a
  compiled routing decision… not in the compiled closure" → "take the mode
  from the compiled front door `compiled-route.cjs --hub sk-design`". Verified
  live: the front door returns `selectionKind:"single"` →
  `sk-design-md-generator` with a policy hash; `compiled-route-admission.cjs
  --hub sk-design --json` → `ok:true`, verdict `pass`, counts
  `{pass:4,drift:0}`. The committed benchmark capture
  (`benchmark/reports/2026-09-27-…/raw/admission.json`) shows the earlier
  `drift` verdict the fix closed — evidence trail coherent: report documented
  the drift, fix landed, current state passes.
- **sk-code-webflow** — the ~90 two-line reference diffs are all the same
  frontmatter renumber (`version: 3.5.0.x → 1.5.0.x`), matching the hub's
  v4→v2 mapping. Verified complete: zero `version: [34].` remains under
  `sk-code/`, `sk-design/` packets. `minify-webflow.mjs` verified in
  iteration 5 (execFileSync argv, no shell).
- **`sk-design-md-generator` unknown-fallback playbook** — the
  `ambiguous-multi-intent.md` edit aligns gold labels with the fixed router
  (scenario SD-007 appears in the admission capture with the updated
  goldModes). Consistent.
- **`backend/package-lock.json`** — Dependabot alert cleanup
  (commit 49cb1843011, five lockfiles). Lockfile-only; no manifest change.
- **sk-prompt README version lag** — `README.md:10` reads `version: 3.0.0.0`
  vs `SKILL.md` 3.0.2.0. Predates the release (already 3.0.0.0 at v4.0.0.2
  when SKILL.md was 3.0.1.0); README is not the version authority per the
  hub's own contract. Pre-existing nit, not a release finding.
- `steer.md` — re-read; unchanged.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Review verdict: PASS
