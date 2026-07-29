# Consolidated Review Report — Skill-Metadata Program Deep Review

**Reviewed tree:** `skilled/v4.0.0.0` @ `a39e6ea716` (program range `2fa9fc480c..a39e6ea716`).
**Lineages:** `sol-high` (GPT-5.6-SOL, high, cli-opencode, 5 iters) and `glm-high` (GLM-5.2, high, cli-devin, 5 iters), max-iterations, no early convergence. External CLIs converged early by operator instruction after both reached 5/5.

**Consolidated verdict: CONDITIONAL — 0 P0, 1 P1, 10 distinct P2.** Both lineages returned CONDITIONAL independently. No finding blocks release; the single P1 is a one-line CI trigger-path gap, fixed in this packet (see §4).

---

## 1. Cross-lineage convergence

Both models, reviewing independently, landed on the same headline defect and the same error-suppression concern — the strongest signal in the set.

| Concern | SOL | GLM | Consolidated |
|---|---|---|---|
| CI workflow does not trigger on `command-metadata.json` changes | P1-002 (conf 0.99) | F009 (P1, conf 0.88) | **P1 — confirmed, fixed** |
| Fleet-gate discovery suppresses enumeration errors → false-green `checked=0 exit 0` | P1-003 → P2 (callers contained) | F001 + F008 (P2) | **P2 — backlog** |
| Authored `packet` / choreography paths not validated against documented roots | P1-001 (P1, conf 0.97) | F003 (P2) | **P2 — adjudicated (read-only probes; current values clean)** |

---

## 2. The P1 (confirmed against source, fixed)

**CI trigger-path gap** — `.github/workflows/routing-registry-drift.yml` `push.paths` and `pull_request.paths`.

The workflow runs `ci-skill-root-metadata.cjs` (line 109) as its fleet gate, and its `paths:` filter lists `leaf-manifest.json`, `leaf-manifest.config.json`, `leaf-aliases.json`, `description.json`, and `graph-metadata.json` — but **not** `command-metadata.json` (`grep -c command-metadata` → 0). Root cause: those path entries were added in the 021 enforcement follow-up (`d65d352d63`), when `command-metadata.json` was still an sk-design-only overlay; packet 022 promoted it to a class-H requirement and the filter was never backfilled. Net effect: a push or PR touching only a hub's `command-metadata.json` does not start the workflow, so the authoritative fleet gate never runs in CI for exactly the file the newest standard added.

Counter-evidence weighed and rejected as sufficient: the pre-push hook (`pre-push:178-190`) does invoke the same gate for any `.opencode/skills` diff, catching this on local push — but it is bypassable (`SPECKIT_SKIP_PREPUSH_SKILL_GATE=1`) and cannot enroll a pull request whose path filter prevents the workflow from starting.

**Fix applied in this packet:** `'.opencode/skills/*/command-metadata.json'` added to both `push.paths` and `pull_request.paths`.

---

## 3. P2 backlog (reported, not fixed — operator-gated)

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| P2-A | correctness | Fleet-gate top-level `readdir` swallows all errors → false-green `checked=0`; both fleet CLIs return exit 0 for an existing non-directory `--skills-dir`. Production callers use the default derived path, containing impact. | `ci-skill-root-metadata.cjs:81`, `ci-leaf-manifest-freshness.cjs:57-71` |
| P2-B | correctness | Authored standalone `packet` and choreography resource paths are normalized only by `path.join()` and accepted by repo-root **or** skill-root probes — no containment check against documented roots before filesystem access. Read-only; current authored values clean. (SOL rated P1.) | `generate-leaf-manifest.cjs:103-147`, `command-metadata-schema.cjs:155-180`, `ci-skill-root-metadata.cjs:285-296` |
| P2-C | correctness | Within-entry duplicate owned signals silently allowed (dedup is cross-entry only). | `command-metadata-schema.cjs:143-151` |
| P2-D | security | `isWithin` containment unsound for cross-drive Windows paths. | `watcher.ts:166-169` |
| P2-E | traceability | Exit-code convention not reconciled across sibling fleet gates (the two CLIs differ on the "cannot run" code). | `ci-leaf-manifest-freshness.cjs:100-103` |
| P2-F | maintainability | Watcher test hardcodes the cross-package chokidar path instead of resolving from the advisor's own `node_modules`. | `daemon-watcher-new-root-ingestion.vitest.ts:216-218` |
| P2-G | maintainability | Journey proof does not assert scaffold-vs-template equivalence (the documented-equivalent shapes could drift undetected). | `create-journey-proof.test.cjs:57-75` |
| P2-H | maintainability | Silent subdir-skip `catch` blocks in the fleet walkers are undocumented. | `ci-leaf-manifest-freshness.cjs:63`, `ci-skill-root-metadata.cjs:124` |
| P2-I | maintainability | Pre-push `HEAD@{push}` first-push diff-guard fallback is underdocumented. | `pre-push:180` |
| P2-J | maintainability | The dual repo-root/skillDir choreography resolution contradicts the stated "repo-root-relative" contract; document or drop the fallback. | `ci-skill-root-metadata.cjs:291` |

**Suggested remediation lanes** (for a future packet): (A) silent-failure hardening — narrow the `readdir` catches to re-throw non-ENOENT at top level, shared `safeReaddir` helper, applied to P2-A/H; (B) containment tightening — validate normalized `packet`/choreography targets against documented roots, closing P2-B/J and the within-entry dedup P2-C; (C) test-honesty — P2-F/G plus documenting P2-D/E/I.

---

## 4. Confirmed-clean surfaces (both lineages)

- Manifest leaf IDs reject absolute paths and traversal and are canonically sorted before emission.
- Manifest freshness byte-compares every discovered manifest and fails on stale bytes or regeneration errors.
- The command-metadata core schema validates command-id shape, registry-bound owner modes, cross-entry command + signal uniqueness, and strictly-ordered choreography.
- The scaffolded-journey proof asserts doctor exit 0 for both classes (the earlier SOL-flagged weak-assertion risk did not reproduce).
- The watcher's delete/recreate cycle re-adds identity files (the poisoning the pre-landing SOL review caught is fixed and covered).
- The scoped contract, containment, and journey tests pass in the reviewed worktree.

---

## 5. Audit metadata

- **Dimension coverage:** correctness, security, traceability, maintainability, cross-reference (SOL) / correctness, security, traceability, maintainability (GLM) — 4-5 dimensions each, 100% of configured.
- **Convergence:** both ran to the 5-iteration cap under `stop-policy=max-iterations`; convergence signals treated as telemetry only, so no false-positive early STOP was possible.
- **Graphless caveat:** the Spec Memory MCP / structural-impact analysis was unavailable for both lineages; all findings rest on direct producer/consumer/caller reads and passing scoped tests, not graph traversal.
- **Adjudication:** the one severity disagreement (authored-path containment, SOL P1 / GLM P2) is consolidated to **P2** for release — the probes are read-only and every current authored value is in-bounds — but flagged for hardening because validator integrity nominally depends on unchecked authored paths.
