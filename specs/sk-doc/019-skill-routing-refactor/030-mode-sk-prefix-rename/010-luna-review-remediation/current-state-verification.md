---
title: "Current-State Verification: sk-prefix rename"
description: "Authoritative current route-gold, compiled-routing, generated-metadata, catalog, and packet-validation state backed by packet-local command evidence."
trigger_phrases:
  - "sk prefix current state"
  - "current state verification"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---

# Current-State Verification: Sk-Prefix Rename

**Authority:** This record supersedes the acceptance snapshot in
`008-verification-and-closeout`. The phase 008 and phase 009 observations remain
historical records; this file is the authority for the current executable state.

**Repository identity:** `ab605d5c0bffcc9e56749538b796fae082d0b512` plus the
uncommitted working-tree changes present during these runs. The evidence is a
working-tree measurement, not a clean-commit claim.

Each linked JSON envelope records the exact command, working directory, start and
end timestamps, full stdout, full stderr, exit code, and any generated Lane C
report artifacts.

## Gate Results

### sk-doc route-gold and Lane C suite — mixed: route-gold pass, suite fail

**Timestamp:** `2026-07-29T14:49:57.881Z`

```text
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-doc --outputs-dir <tmp>/sk-prefix-current-state-IkndQ7/route-gold --trace-mode router --route-gold on --compiled-routing-parity off
```

```text
cd .opencode/skills/system-deep-loop/deep-improvement/scripts
npx vitest run skill-benchmark/tests --config vitest.config.mjs
```

Evidence: [sk-doc-route-gold.json](evidence/sk-doc-route-gold.json)

- Skill benchmark: **PASS**, exit `0`, aggregate `98`, 32 scenarios.
- Route-gold: **PASS**, 32/32 matches, 0 violations, 0 parse failures.
- Lane C Vitest: **FAIL**, exit `1`; 9/19 test files passed and 179/210
  tests passed (10 files and 31 tests failed).
- The failures include the known stale pre-rename `create-skill` import in
  `sk-code-router-sync.vitest.ts:206`. Other suite failures retain additional
  pre-rename route/path assumptions. They are recorded as out-of-scope current
  failures and were not repaired.

### Compiled-routing parity — fail

**Timestamp:** `2026-07-29T14:49:59.178Z`

`compiled-routing-parity.cjs` is a module consumed by the Lane C orchestrator and
does not expose a standalone CLI. Its maintained invocation is:

```text
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-doc --outputs-dir <tmp>/sk-prefix-current-state-IkndQ7/compiled-routing-parity --trace-mode router --route-gold on --compiled-routing-parity on
```

Evidence: [compiled-routing-parity.json](evidence/compiled-routing-parity.json)

- **FAIL**, exit `3`, verdict `BLOCKED-BY-COMPILED-DRIFT`, aggregate `98`.
- Frozen route-gold remains green at 32/32.
- Compiled parity is 0 matches and 32 drift rows. Every row reports
  `re-mint-required` with cause `compile-error`.
- No activation data was minted or repaired.

### Root metadata — fail on known owner-mode rename drift

**Timestamp:** `2026-07-29T14:49:59.335Z`

```text
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --format json
```

Evidence: [root-metadata.json](evidence/root-metadata.json)

- **FAIL**, exit `1`; 11 roots checked, 9 passed, 2 failed, 0 fixed.
- `sk-doc` has 11 `COMMAND_METADATA_UNKNOWN_OWNER_MODE` violations using
  unprefixed owner modes.
- `sk-prompt` has 1 `COMMAND_METADATA_UNKNOWN_OWNER_MODE` violation using
  `prompt-improve`.
- These are the known pre-existing owner-mode rename-drift failures. No
  `--fix` run or authored metadata change was made.

### Leaf-manifest freshness — pass

**Timestamp:** `2026-07-29T14:49:59.512Z`

```text
node .opencode/skills/sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs
```

```text
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --format json
```

Evidence: [leaf-manifest-freshness.json](evidence/leaf-manifest-freshness.json)

- Focused traversal regression: **PASS**, exit `0`.
- Fleet freshness: **PASS**, exit `0`; 11 checked, 11 fresh, 0 failed,
  0 traversal failures.

### Catalog document and package validation — mixed: documents pass, package fail

**Timestamp:** `2026-07-29T14:49:59.689Z`

```text
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/feature-catalog/feature-catalog.md --json
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md --json
python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --strict --json
```

Evidence: [catalog-package-validation.json](evidence/catalog-package-validation.json)

- Root catalog document: **PASS**, exit `0`, 0 issues.
- Detailed catalog document: **PASS**, exit `0`, 0 issues.
- Exact live workflow-mode inventory checks: **PASS**; no inventory mismatch
  violation was reported.
- Strict package validator: **FAIL**, exit `1`, with 19 pre-existing
  `missing_source_path` violations across compiled-routing/advisor source
  references. No catalog source reference was changed in this phase.

### Strict packet validation — externally blocked

**Timestamp:** `2026-07-29T14:49:59.858Z`

```text
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/010-luna-review-remediation --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename --recursive --strict
```

Evidence: [strict-spec-validation.json](evidence/strict-spec-validation.json)

- Child strict validation: **BLOCKED**, exit `3`.
- Recursive parent strict validation: **BLOCKED**, exit `3`.
- Both stop before packet validation because the
  `system-spec-kit/mcp-server` compiled validation orchestrator is stale.
  The known external source is the v4 pi-hook version skew.
- The mcp-server dist was not rebuilt, as required.

## Current Acceptance State

The current state is not globally green. sk-doc route-gold and leaf-manifest
freshness pass. Compiled-routing parity, root metadata, the broader Lane C
suite, and strict package validation retain recorded out-of-scope failures.
Spec validation is externally blocked by stale compiled spec-kit output.
None of those failures was changed or masked during this verification pass.
