# Iteration 9: Header/Banner Conformance (repeat) on Remaining Sub-Surfaces

## Focus
Angle 1 (repeat) — revisit the header/banner census on the sub-surfaces not inspected in iteration 1 (`runtime/api`, `runtime/hooks`, `runtime/cli/core`, `runtime/cli/retrieval`, and the dotfile dev scripts), and confirm whether the header-tag divergence found there is a one-off or a cross-language pattern.

## Findings

### F9.1 [P1] Hardcoded absolute developer-machine paths in a checked-in script
- **Code:** `runtime/cli/.scan-validate-all.sh:5-6`
  - `ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs"`
  - `VALIDATE="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh"`
- **Standard:** shell `validation-security-and-shellcheck.md` §5 "Quote All Paths" + §2 "Safe File Operations"; universal P0 input/path validation. A checked-in script must not embed a machine-specific absolute path — it will not run on another checkout or in CI.
- **What is present:** Two absolute paths under `/Users/michelkerkmeester/...` are hardcoded as globals rather than derived from `SCRIPT_DIR`/`$(git rev-parse --show-toplevel)`. The sibling `.scan-one.sh` (lines 3-5) correctly derives `SCRIPT_DIR` and `REPO_ROOT` from `$0`/`dirname`, so this is an inconsistency within the same directory.
- **Severity:** P1 — breaks on any machine other than the author's, and silently (the script still runs, scanning a nonexistent root, returning a misleading pass).
- **One-line fix:** **mechanical** — replace both with `ROOT="$(git rev-parse --show-toplevel)/.opencode/specs"` and `VALIDATE="$(dirname "${BASH_SOURCE[0]}")/spec/validate.sh"`.

### F9.2 [P2] Cross-language file-header tag vocabulary is not uniform
- **Code:** `runtime/cli/retrieval/generate-trigger-index.mjs:3` (`# SCRIPT: Trigger Index Generator`), `runtime/cli/retrieval/{rg-wrapper,measure-cold-lookup,lookup-trigger-index,retrofit-convention,sweep-memory-residue}.mjs` (same `# SCRIPT:` form), `runtime/hooks/lib/spec-gate/spec-gate-core.mjs:2-3` (box-drawing `║ COMPONENT:`), `runtime/cli/spec/create.sh` (`# SPECKIT:`), `runtime/cli/rules/*.sh` (`# RULE:`), `shared/frontmatter/parse-frontmatter.ts:2` (`// MODULE:`).
- **Standard:** TS header = `// MODULE:` (`typescript/style-guide/overview-strict-and-naming.md` §2); shell header = `# COMPONENT:`/`# SPECKIT:` (`shell/style-guide/overview-structure-and-naming.md` §2). There is no documented `# SCRIPT:` tag name.
- **What is present:** The header-tag vocabulary spans `// MODULE:` (TS), `# SCRIPT:` (JS `.mjs`), `# COMPONENT:` (shell + box-drawing form), `# SPECKIT:`/`# SPEC-KIT:` (shell), `# RULE:` (shell rules). Each is internally consistent, so none is a bug, but a reader cannot infer the tag from the standard: `SCRIPT:` is used by `.mjs` modules without being named in either the TS or shell standard.
- **Severity:** P2 (documentation/consistency; no behavioral effect).
- **One-line fix:** **judgment-required** — either add `# SCRIPT:` as a sanctioned JS `.mjs` header tag in `javascript/style-guide.md` and the shell header references, or align `.mjs` on one documented tag.

### F9.3 [Conforming] `runtime/api`, `runtime/hooks` TypeScript and the box-drawing `.mjs` carry headers
- **Code:** scans of `runtime/api/**/*.ts`, `runtime/hooks/**/*.ts`, `runtime/cli/core/**/*.ts` (all open with `// MODULE:`), and the `.mjs`/`.cjs` reports that my earlier `MODULE:`-only grep flagged are actually headed (`# SCRIPT:`/`# COMPONENT:`) — a false negative corrected by re-reading.
- **Standard:** TS §2; JS §3/imports-and-exports header patterns.
- **What is present:** The "NO-MODULE" rows from the mechanical `MODULE:` grep (`runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, `runtime/cli/retrieval/*.mjs`) are false positives — the files use `# SCRIPT:`/`# COMPONENT:` headers instead of `// MODULE:`. No `.mjs`/`.cjs` module is actually headerless.
- **Severity:** Reported as a corrected baseline (the finding is F9.2, not "missing headers").

## Sources Consulted
- `runtime/cli/.scan-validate-all.sh:5-6`, `runtime/cli/.scan-one.sh:3-5`
- `runtime/cli/retrieval/generate-trigger-index.mjs:3` and sibling `*.mjs`
- `runtime/hooks/lib/spec-gate/spec-gate-core.mjs:2-3`
- `runtime/api/**`, `runtime/hooks/**`, `runtime/cli/core/**` header scans

## Assessment
- **newInfoRatio:** 0.6
- **Novelty justification:** The hardcoded absolute paths (P1) are new and the strongest find of this pass; the `# SCRIPT:` header-tag census refines the angle-1 divergence.
- **Confidence:** High for F9.1 (direct read); for F9.2 the `.mjs` header reads are direct. The mechanical `MODULE:` grep's false negatives are independently corrected by reading the files.

## Reflection
- What worked: The repeat pass over new sub-surfaces caught a P1 that iteration 1's `rules/`/`spec/`-focused census missed — the hardcoded-path dotfile. Re-reading the "headerless" `.mjs` showed my grep pattern was TS-specific.
- What failed: The first-pass `MODULE:`-only grep produced false negatives for `.mjs`; a tag-agnostic header scan is required for mixed-language directories.
- Ruled out: Treating the `.mjs` files as headerless — they are headed with a JS-convention tag.

## Recommended Next Focus
Angle 2 (repeat) — deepen the duplication check: confirm whether the `spec-folder`/path-utils and repo-root families reuse the shared modules, and whether the `api/` barrel re-export layer introduces duplicate public surfaces.
