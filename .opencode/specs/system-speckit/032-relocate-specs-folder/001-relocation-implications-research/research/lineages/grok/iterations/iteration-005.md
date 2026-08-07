# Iteration 5: In-repo path-reference scale and risk classes

## Focus

Measure how widely `.opencode/specs` appears in-repo and classify blast radius for a relocation rewrite.

## Findings

1. **Raw match volume is dominated by packet/docs content, not runtime code.** Unfiltered `rg -l '\.opencode/specs'` reported ~14989 files / ~476k match occurrences (includes descriptions.json and research noise). Extension breakdown excluding z_archive, research lineages/archives, and descriptions.json: `md: 6178`, `json: 1554`, `ts: 114`, `cjs: 48`, `sh: 34`, `mjs: 18`, `js: 6`. [SOURCE: shell:rg extension counts 2026-08-06]

2. **Runtime/code surface without tests/research is ~117 files.** `rg -l` over `*.{ts,js,cjs,mjs,sh}` excluding tests, vitest, research, z_archive → 117 files. This is the actionable rewrite set for behavioral correctness; markdown/json are continuity and narrative debt. [SOURCE: shell:rg code-surface count]

3. **Risk tier A — hard blockers (must change before cutover):** `create.sh` SPECS_DIR default; `backfill-graph-metadata` default root; `findSpecsRoot`; Memory `memory-index-discovery` canonical preference; `startup-checks` path lock; `index-scope` specs exclude glob; Gate 3 operator example strings (soft but high-frequency). Evidence from iterations 1 and 4.

4. **Risk tier B — dual-accept already present (verify after move):** `create.sh` validator allowlist; `review-research-paths` approved roots; Gate 3 `SPEC_ROOTS` / `hasSpecRootPrefix`; `normalizeSpecFolderReference`; `scaffold-debug-delegation` packet_pointer; `folder-detector` prefix strip; session-stop `SPEC_FOLDER_PREFIXES`; parts of memory-index-alias SQL. These reduce rewrite need but need regression tests with a real top-level tree (not only symlink collapse).

5. **Risk tier C — documentation & packet pointers (volume, lower urgency):** AGENTS/CLAUDE path tables; thousands of `specFolder` / continuity strings inside packet markdown/json; Gate 3 prompt examples. Wrong docs cause operator confusion more than runtime failure.

6. **Risk tier D — generated / ephemeral:** `descriptions.json`, research lineages, archives — regenerate or accept churn; do not hand-edit.

7. **Naive string replace is unsafe.** Paths appear inside SQL LIKE patterns, regex/globs (`**/.opencode/specs/**`), comments, and dual-root arrays where both forms must remain during a migration window. Prefer allowlist dual-root + default-root flip over blanket replace.

## Ruled Out

- Using raw 476k occurrence count as the migration rewrite estimate — inflated by docs/generated.
- Blanket `sed` across the repo as the primary migration tactic.

## Assessment

- newInfoRatio: 0.90
- Novelty justification: Quantified scale + four risk tiers are new; tier A/B content reuses prior findings as classification inputs (partial).
- Questions answered: Scale measured; risk classes ranked; rewrite strategy guidance stated.

## Recommended Next Focus

Synthesize a ranked implication list and lean go/no-go recommendation, then verify any remaining gap on backfill supported-root behavior and invert-symlink Memory shadowing with a concrete decision matrix.
