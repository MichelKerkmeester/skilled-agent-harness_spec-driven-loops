# Iteration 6 — Catalog and README Citation-Truth Audit

**Focus:** D3 Traceability + D1 Correctness — Angle 6: REQ-001 of phase 005 is mechanically testable — "no catalog, README or playbook in the three hubs cites a path absent from the tree." Sweep every backtick citation in the reviewed doc surface and resolve it against every plausible root.
**Phase record audited:** `005-catalog-and-readme-truth`

## Method

1. Verified the specific claims first: the playbook's 20-row test table (all 20 paths exist), the feature catalog's 54-entry count (overview sums 4+1+3+13+2+6+5+5+8+2+3+2 = 54; exactly 54 `###` entries).
2. Then swept all 70 reviewed catalog/README/playbook files for backtick-quoted paths — repo-rooted (`.opencode/`, `.claude/`, `.pi/`, `.codex/`, `specs/`) and packet-relative (`references/`, `assets/`, `scripts/`, `tests/`, `feature-catalog/`, …) — resolving each against every ancestor of the citing file.
3. Adjudicated each candidate: skipped placeholders (`<run-label>`), brace globs, deliberate fake fixtures (`zzz_fake_language`), cross-repo-scoped references the doc itself declares, and fixture-internal trees.

## Evidence

### Verified claims

- Playbook test table at manual-testing-playbook.md:614-633 — all 20 cited test files exist on disk.
- Feature catalog count — header claims 54 entries [SOURCE: feature-catalog.md:19]; overview table sums to 54; exactly 54 `###` feature sections present.

### Dead citations that survive the sweep

- **`sk-code/manual-testing-playbook/` cites `references/*` resolving to a nonexistent dir.** The playbook declares its own root convention: "paths shown relative to `.opencode/skills/sk-code/`" [SOURCE: manual-testing-playbook.md:105]. Under it, `references/stack-detection.md` means `sk-code/references/stack-detection.md` — and `sk-code/references/` does not exist; the real file is `sk-code/shared/references/stack-detection.md`. The doc itself proves knowledge of the real path in the same file [SOURCE: manual-testing-playbook.md:61 — "verify with `head -40 .opencode/skills/sk-code/shared/references/stack-detection.md`"]. Affected citations: `references/stack-detection.md` (14 files), `references/phase-detection.md` (3), `references/universal/code-quality-standards.md` (5), `references/universal/code-style-guide.md` (4) — ~19 files carrying dead links.
- **`sk-code-obsidian/README.md` near-miss citations.** :75 cites `references/obsidian-api-boundary.md` (real: `obsidian-plugin-api.md`); :134 cites `references/screenshot-fixture-harness.md` (real: `screenshot-harness.md`). Both absent from `sk-code-obsidian/references/` [SOURCE: directory listing].
- **The feature catalog itself cites an absent surface.** The VALIDATION row names `lib/mode-contracts/strict-gate-validator.ts` as a primary surface [SOURCE: feature-catalog.md:25]; `runtime/lib/mode-contracts/` contains only README.md, index.ts, mode-contract-types.ts, substrate-ports.ts.

### Candidates refuted (checked, not defects)

- `060-stress-test/README.md` → `cp-improve-target` agent files: the fixture carries its own complete six-tree agent set internally; the README describes fixture-relative paths. Refuted.
- `sk-code-mobile-cli/README.md` → `specs/003-design-system-library/` and `feature-catalog/design-system/token-library.md`: both explicitly declared as living "in that repo" / "in the app repo" — documented cross-repo references. Refuted.
- `check-dist-staleness-hook.md` → `lib/validation`: names a path inside `system-spec-kit/runtime`'s dist config (exists at `system-spec-kit/runtime/lib/validation`); describes the watcher's config, not a doc to follow. Refuted.

### Ambiguous-root citations

- `cli-external-orchestration/manual-testing-playbook.md:55` verifies a scorer behavior "by `tests/scorer/executor-delegation.vitest.ts` and `tests/parity/fixtures/executor-delegation-cases.json`" — bare `tests/` resolves under no ancestor of the citing file; the files live at `system-skill-advisor/runtime/tests/...`. The doc does fully name the scorer path, so a reader can triangulate — weaker than a dead link, still not "a reader arrives at the file it names."
- `deep-improvement/README.md:108` names `benchmark/model-benchmark/{run_label}/` as lane B's output root; `benchmark/` contains only README.md + reports/ — a runtime-created write-target rather than a readable citation.

## Findings

### F004 (P1 — traceability): REQ-001's sweep-to-zero claim fails on a surviving citation class

The phase's P0 requirement was "No catalog, README or playbook in the three hubs cites a path absent from the tree." ~19 sk-code playbook files still cite `references/*` paths that resolve nowhere under the documents' own stated root convention, the obsidian README carries two dead near-miss citations, and the feature catalog's own VALIDATION row names an absent file. This is the phase's headline defect class — not a different residual class — surviving in bulk.

*Adjudication:* claim = "playbook/README citations to `references/*` and the catalog's `strict-gate-validator.ts` are absent paths"; evidence = resolver sweep over all ancestors + `ls` on the target dirs + the docs' own root-convention statement; counterevidence sought = a `sk-code/references/` symlink or an alternate stated root (none exists — `ls` fails, convention says `sk-code/`); alternative explanation = an unstated `shared/` convention readers are expected to know (contradicted by the declared convention and by line 61 spelling out the `shared/` path); final severity P1; confidence high; downgrade trigger = evidence that the playbook template documents a `shared/`-relative root I did not find.

### F005 (P2 — traceability): two citations name paths only resolvable through unstated foreign roots, and one names a not-yet-created write-target

`tests/scorer/executor-delegation.vitest.ts` + `tests/parity/fixtures/executor-delegation-cases.json` in the cli-external-orchestration playbook resolve only under `system-skill-advisor/runtime/`; `benchmark/model-benchmark/` in the deep-improvement README names a directory no run has created. Weaker than F004 — the first names its owner file fully, the second describes an output location — but both sit inside the swept surface.

## Verdict rationale

A real surviving instance of the phase's own target class, at scale (~20+ sites). Not a P0: the wrongness is documentation-level and the missing root is discoverable — but REQ-001 as written is not met.

Review verdict: CONDITIONAL
