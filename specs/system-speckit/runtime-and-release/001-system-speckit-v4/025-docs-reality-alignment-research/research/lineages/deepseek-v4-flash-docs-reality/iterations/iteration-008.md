# Iteration 8: Broaden — references/templates and references/structure drift scan

## Focus

Broaden pass (not a new focus area) over the under-audited `references/templates/**` and `references/structure/**` groups: hunt for stale pre-rename paths and phantom script references that a designer would copy verbatim.

## Findings

### F8-01 — phase-definitions.md uses a stale pre-rename validate.sh path (P1 misleading)

**Doc claim (quoted):** `references/structure/phase-definitions.md:236` — "`./scripts/spec/validate.sh specs/###-parent-feature/ --recursive`."

**Actual behavior:** `scripts/spec/validate.sh` does not exist (MISSING on disk). After the `scripts/` -> `runtime/cli/` rename the validator lives at `runtime/cli/spec/validate.sh` (EXISTS). The command as written fails with "No such file or directory."

- Doc: [SOURCE: references/structure/phase-definitions.md:236]
- Actual: [SOURCE: runtime/cli/spec/validate.sh] (exists); [SOURCE: scripts/spec/validate.sh] (missing)
- Severity: P1
- One-line fix: change to `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/###-parent-feature/ --recursive`.

### F8-02 — level-selection-guide.md references a phantom rule script (P1 misleading)

**Doc claim (quoted):** `references/templates/level-selection-guide.md:191` — "`bash .opencode/skills/system-spec-kit/runtime/cli/rules/check-section-counts.sh specs/XXX/`."

**Actual behavior:** `runtime/cli/rules/check-section-counts.sh` does not exist (MISSING). Its neighbors on lines 190,192,193 (`check-complexity.sh`, `check-ai-protocols.sh`, `check-level-match.sh`) all exist, so the row is a stray reference to a removed/renamed rule (section counts are subsumed by the complexity/content-metric rules). A verbatim run fails.

- Doc: [SOURCE: references/templates/level-selection-guide.md:191]
- Actual: [SOURCE: runtime/cli/rules/] (no check-section-counts.sh)
- Severity: P1
- One-line fix: drop the `check-section-counts.sh` line or replace it with the rule that actually checks section counts.

### F8-03 — level-specifications.md names a phantom completion script (P2 cosmetic)

**Doc claim (quoted):** `references/templates/level-specifications.md:78` — "use `validate.sh`, `check-completion.sh`, and `check-placeholders.sh` where applicable."

**Actual behavior:** `check-completion.sh` does not exist in `runtime/cli/rules/` (MISSING). The completion gate is `validate.sh --strict` (the `AC_CLOSURE` / `CONTINUITY_FRESHNESS` rules) — there is no standalone `check-completion.sh`. `check-placeholders.sh` does exist.

- Doc: [SOURCE: references/templates/level-specifications.md:78]
- Actual: [SOURCE: runtime/cli/rules/] (no check-completion.sh; check-placeholders.sh exists)
- Severity: P2
- One-line fix: replace `check-completion.sh` with "`validate.sh --strict`" (the AC_CLOSURE closure gate).

## Sources Consulted

- references/structure/phase-definitions.md:236
- references/templates/level-selection-guide.md:190-193
- references/templates/level-specifications.md:78
- references/structure/folder-structure.md:120,138,161-167,311,329 (retired `memory/` framing — correct, not flagged)
- references/templates/template-guide.md:619; references/structure/sub-folder-versioning.md:28,109 (retired memory writes framing — correct)
- runtime/cli/spec/validate.sh; runtime/cli/rules/ (dir listing)
- references/structure/grep-convention.md:42,411,414 (retrofit-convention.mjs / check-grep-convention.sh — both exist)

## Assessment

- newInfoRatio: 0.85
- Novelty justification: F8-01/F8-02/F8-03 are new stale-path/phantom-script findings in the templates/structure references; they are F1-family (paths that changed/no longer exist) but surfaced in the broaden pass.
- Confidence notes: All three confirmed by direct `[ -f ]` checks and directory listing; the runtime side of each is unambiguous (missing file vs existing real path).

## Reflection

- What worked: the templates/structure references still carry more pre-rename path drift than the memory docs — the `scripts/` -> `runtime/cli/` rename penetrates the structure/phase-definitions and level tooling docs.
- What failed: the `memory/` "retired compatibility folder" framing in folder-structure.md and sub-folder-versioning.md is already correct, so the retire-frame scan yielded no new findings there.
- Ruled out: the retired `memory/*.md` framing in folder-structure.md / template-guide.md / sub-folder-versioning.md — consistent and correct, not flagged.

## Recommended Next Focus

[Broaden] references/workflows and references/debugging scan (iteration 9): check execution-methods/intake-contract/quick-reference and troubleshooting for retired `scripts/`, `memory`, MCP, and daemon references.
