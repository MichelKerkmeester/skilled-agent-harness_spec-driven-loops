# Iteration 4 — Leaf Manifest Symlink Walk Audit

**Focus:** D1 Correctness + D3 Traceability — Angle 4: do symlinked references reach the manifest, and does the freshness gate share the generator's traversal?
**Phase record audited:** `004-leaf-manifest-and-doctrine-reachability`

## Method

1. Extracted all 271 leaves from `sk-code/leaf-manifest.json` and stat-resolved every one against its packet dir.
2. Verified the 12 claimed doctrine leaves are symlinks that resolve.
3. Read the generator's link handling for the three named error classes and the walk's root set.
4. Checked the freshness gate's traversal delegation claim.
5. Fleet-wide adversarial sweep: walked every symlink under `.opencode/skills/` (122 total), classified each as inside vs outside a walked root (`references/`/`assets/` only), and cross-checked in-root links against their skill's manifest — this tests the phase's "other manifests byte-identical" out-of-scope claim.

## Evidence

### SC-001 — the 12 doctrine leaves exist, are symlinks, and resolve

All four surface packets carry `references/workflow-{implement,debug,verify}.md`; each is a symlink (e.g. `sk-code-webflow/references/workflow-implement.md -> ../../shared/references/workflow-implement.md`) and every one resolves to a real file. Manifest total: 271 leaves, 0 unresolved.

### REQ-002 — three named error classes

`generate-leaf-manifest.cjs` throws `BROKEN_LEAF_SYMLINK` (:118), `LEAF_SYMLINK_OUT_OF_ROOT` (:121), `UNSUPPORTED_LEAF_SYMLINK` (:124) — each a named `ContractError`, none silently skipped. The walk detects links via `entry.isSymbolicLink()` (:111), which correctly sees symlinks that `isFile()` would follow — matching the stated defect.

### REQ-003 — traversal delegation

`ci-leaf-manifest-freshness.cjs:43` imports `buildManifestBytes` from the generator — the gate regenerates the manifest bytes and compares, so a second divergent walk cannot exist. Strongest form of the requirement.

### The "byte-identical other manifests" claim — verified adversarially

122 symlinks exist under `.opencode/skills/`; exactly 12 live inside a walked root (`references/`/`assets/`), and all 12 are the sk-code doctrine leaves now in the manifest. Every other symlink sits under `node_modules/.bin`, `scripts/`, or `mcp-server/` — outside `allowedRoots` (`['references','assets']`, generator :155). Regenerating any other skill's manifest today produces identical bytes. The claim survives the boundary test.

### Tests

`ci-leaf-manifest-freshness.test.cjs` covers fail-closed discovery, traversal-failure reporting, exclusions, symlink resolution, and the happy path — matching the "five traversal tests" claim in shape and coverage.

## Findings

None. The fix is exactly what the record describes: the walker sees symlinks, unreachable links fail loudly with named errors, the gate shares the generator's traversal by construction, and no other manifest has an in-root symlink to gain or lose.

## Claims refuted

- "Other skills' in-root symlinks would have drifted the manifests" — refuted: a complete symlink census shows zero in-root links outside sk-code's 12.
- "The gate could still diverge" — refuted structurally: it calls the generator's own `buildManifestBytes`.
- "A broken/escaping link could slip through" — refuted: three named error classes, each thrown, none skipped.

## Verdict rationale

Clean pass; every verifiable claim confirmed against the tree.

Review verdict: PASS
