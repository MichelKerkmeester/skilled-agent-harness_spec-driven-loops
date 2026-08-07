# Review Report — Skill-Metadata Program Deep Review (glm-high lineage)

**Spec folder:** `sk-doc/019-skill-routing-refactor/027-program-deep-review`
**Lineage:** glm-high · session `fanout-glm-high-1785257671132-a9gil1` · executor `cli-devin model=glm-5-2`
**Iterations:** 5 (stopPolicy=max-iterations) · **Dimensions:** correctness, security, traceability, maintainability

---

## 1. Executive Summary

**Verdict: CONDITIONAL** — 0 active P0, 1 active P1, 9 active P2 · `hasAdvisories: true`

The skill-metadata program landed on skilled/v4.0.0.0 is in a **clean, conforming state**. A live run of the fleet gate (`ci-skill-root-metadata.cjs --format json`) confirms all 11 roots (7 hubs, 4 standalone) conform to the H/S class contract with zero violations, and the doctrine (`skill-root-metadata-contract.md`) is honest against the shipped behavior across every normative claim verified (fleet roster, file matrix, generated-vs-authored split, template inventory, related-resource links). The watcher ingestion seam has strong path containment, including symlink-aware realpath re-checks.

The one CONDITIONAL driver is **F009 (P1)**: the `routing-registry-drift.yml` CI workflow runs the command-metadata core-schema validator but does not list `command-metadata.json` in its trigger `paths`, so a command-metadata-only regression on the release line (skilled/v*, no PR) would not trigger CI. The remaining 9 findings are P2 defensive-hardening and test-honesty advisories. No correctness or security failure is active.

**Scope:** the H/S class contract + fleet gate, the command-metadata core schema, the JSON template set, the advisor watcher ingestion seam, the creation-journey fixes, the doctrine coherence sweep, and the CI/hooks wiring (spec.md §2 surfaces 1-6).

---

## 2. Planning Trigger

**Routes to `/speckit:plan` for remediation** (CONDITIONAL: active P1 present).

The single P1 (F009) is a CI trigger-coverage gap — a one-line `paths` addition to `.github/workflows/routing-registry-drift.yml`. The P2 advisories are non-blocking and may be batched into the same plan or deferred to a changelog pass. No P0 blocks release; the program is shippable once F009 is addressed (or explicitly accepted with the pre-push hook as the enforced boundary).

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | First/Last | Status |
|----|-----|-----------|-------|----------|------------|--------|
| F009 | **P1** | maintainability | CI workflow trigger paths omit `command-metadata.json` | `.github/workflows/routing-registry-drift.yml:15-32`, `:35-52`, `:101-109`; `ci-skill-root-metadata.cjs:260-303` | 5/5 | open (adjudicated, finalSeverity P1, conf 0.88) |
| F001 | P2 | correctness | Fleet gate top-level readdir swallows all errors | `ci-skill-root-metadata.cjs:81` | 1/1 | open |
| F002 | P2 | correctness | Within-entry duplicate owned signals silently allowed | `command-metadata-schema.cjs:143-151` | 1/1 | open |
| F003 | P2 | correctness | Choreography resource probe resolves repo-root OR skillDir | `ci-skill-root-metadata.cjs:291` | 1/1 | open |
| F004 | P2 | security | `isWithin` containment unsound for cross-drive Windows paths | `watcher.ts:166-169` | 2/2 | open |
| F005 | P2 | traceability | Exit-code convention not reconciled across sibling fleet gates | `ci-leaf-manifest-freshness.cjs:100-103` | 3/3 | open |
| F006 | P2 | maintainability | Watcher test hardcodes cross-package chokidar path | `daemon-watcher-new-root-ingestion.vitest.ts:216-218` | 4/4 | open |
| F007 | P2 | maintainability | Journey proof does not assert scaffold-vs-template equivalence | `create-journey-proof.test.cjs:57-75` | 4/4 | open |
| F008 | P2 | maintainability | Silent subdir-skip `catch` undocumented in fleet walkers | `ci-leaf-manifest-freshness.cjs:63`; `ci-skill-root-metadata.cjs:124` | 4/4 | open |
| F010 | P2 | maintainability | Pre-push `HEAD@{push}` diff guard subtlety underdocumented | `pre-push:180` | 5/5 | open |

---

## 4. Remediation Workstreams

**Lane A — CI coverage (P1, do first):**
- F009: Add `.opencode/skills/*/command-metadata.json` to both `push.paths` and `pull_request.paths` in `routing-registry-drift.yml`. Verify with a command-metadata-only edit that the workflow triggers.

**Lane B — Silent-failure hardening (P2, batch):**
- F001: Narrow `findSkillRoots`'s `catch` to re-throw non-`ENOENT` (or emit a `GATE_CANNOT_RUN` violation + exit 2).
- F008: Extract a shared `safeReaddir` helper with a documented per-level policy (re-throw at top level, skip-and-warn nested); apply to `findManifestDirs` and `findNestedIdentities`.

**Lane C — Schema/probe tightness (P2):**
- F002: Dedup owned signals within an entry before the cross-entry check, or document within-entry repetition as legal.
- F003: Document the dual repo-root/skillDir choreography resolution, or drop the skillDir fallback to match the stated "repo-root-relative" contract.

**Lane D — Test honesty & docs (P2):**
- F006: Resolve chokidar from the advisor's own `node_modules` (or workspace root) and assert the dependency in the advisor package manifest.
- F007: Add a scaffold-vs-template diff assertion to `create-journey-proof.test.cjs` (or document where equivalence is proven).
- F005: Document both fleet gates' exit codes in one place; align the "cannot run" code.
- F010: Add a one-line comment on the `HEAD@{push}` first-push fallback in `pre-push`.
- F004: Unify `isWithin` on the `assertContainment`-style drive-letter check, or document posix-only support.

---

## 5. Spec Seed

Minimal spec delta implied by findings (for a follow-up remediation spec):
- **REQ-CI-TRIGGER:** The routing-registry-drift workflow MUST trigger on `.opencode/skills/*/command-metadata.json` edits (push + pull_request), because the workflow runs the command-metadata core-schema validator. (F009)
- **REQ-GATE-FAILCLOSED:** The fleet gate's top-level discovery MUST distinguish "cannot run" (non-ENOENT) from "no roots" and fail closed. (F001, F008)
- **REQ-SCHEMA-UNIQUIFY:** The command-metadata core schema MUST reject within-entry duplicate owned signals or document them as legal. (F002)

---

## 6. Plan Seed

Action-ready remediation tasks (reference finding IDs):
1. [F009] Add `command-metadata.json` to `routing-registry-drift.yml` push + pull_request `paths`; add a regression test that edits only a command-metadata.json and asserts the workflow triggers.
2. [F001/F008] Introduce `safeReaddir` in `create-skill/scripts/lib/` with a per-level policy; refactor `findSkillRoots` (re-throw non-ENOENT), `findManifestDirs`, `findNestedIdentities` (skip-and-warn).
3. [F002] In `command-metadata-schema.cjs`, dedup `intent.ownedSignals` within an entry before the cross-entry `seenSignals` check; add a negative test.
4. [F003] Decide and document the choreography `resourceExists` resolution scope; if repo-root-only, drop the `|| skillDir` fallback.
5. [F006] Replace the cross-package chokidar path in the watcher test with an advisor-local or workspace-root resolve.
6. [F005/F010/F004/F007] Documentation/consistency follow-ups (exit codes, pre-push comment, isWithin drive-letter, journey equivalence assertion).

---

## 7. Traceability Status

| Protocol | Level | Gate | Status | Evidence |
|----------|-------|------|--------|----------|
| spec_code | core | hard | **pass** | Doctrine §2 fleet roster == live gate (7H/4S, 11/11); §3 matrix == REQUIRED/FORBIDDEN_BY_CLASS; §4 generated-vs-authored == GENERATED_BY_CLASS; §6 templates == assets/ ls; §7 links all resolve. |
| checklist_evidence | core | hard | skipped | Level 1 folder, no `checklist.md` — advisory/exempt. |
| feature_catalog_code | overlay | advisory | partial | Not the focus of this review; deferred. |
| playbook_capability | overlay | advisory | partial | Not the focus of this review; deferred. |

**Unresolved gaps:** none blocking. The doctrine is honest against the code; the one traceability finding (F005) is a cross-gate exit-code convention gap, not a doctrine-vs-code contradiction.

---

## 8. Deferred Items

- **P2 advisories (9):** F001-F004, F005-F008, F010 — defensive hardening, test honesty, and documentation. Non-blocking; batch into Lane B/C/D above or a future changelog pass.
- **Overlay protocols** (feature_catalog_code, playbook_capability): only partially exercised; a dedicated pass could verify catalog claims against discoverable implementation and playbook scenarios against executable reality.
- **Scaffold-vs-template equivalence** (F007): the spec asks for it; the journey proof does not assert it. Either add the assertion or document where it is proven.
- **Acceptance-coverage (AC_COVERAGE):** advisory only — Level 1 folder, no checklist.md.

---

## 9. Audit Appendix

### Iteration table
| Run | Focus | Dimensions | newFindingsRatio | New findings | Verdict |
|-----|-------|------------|------------------|--------------|---------|
| 1 | correctness | correctness | 0.43 | P2×3 | PASS |
| 2 | security | security | 0.25 | P2×1 | PASS |
| 3 | traceability | traceability | 0.17 | P2×1 | PASS |
| 4 | maintainability | maintainability | 0.60 | P2×3 | PASS |
| 5 | CI wiring | maintainability | 0.70 | P1×1, P2×1 | CONDITIONAL |

### Convergence signal replay
- stopPolicy = max-iterations (5). Convergence treated as telemetry only per dispatch contract; ratios ascended [0.17→0.60→0.70] as angles broadened into CI wiring, so no false-positive STOP was possible. Dimension coverage reached 4/4 (100%) by iteration 4; required traceability protocol `spec_code` covered (pass) by iteration 3. No P0 ever appeared; the single P1 (F009) appeared at iteration 5 and was adjudicated (finalSeverity P1, confidence 0.88, packet present) — `claimAdjudicationGate` passes.
- Composite stop score not reached (by design under max-iterations); the legal-stop decision tree was not invoked because the loop ran to maxIterations.

### File coverage matrix
| File | Covered in |
|------|-----------|
| lib/skill-root-metadata-contract.cjs | 1, 3 |
| lib/command-metadata-schema.cjs | 1 |
| lib/leaf-resource-contract.cjs | 1, 2 |
| ci-skill-root-metadata.cjs | 1, 3, 4 |
| generate-leaf-manifest.cjs | 1, 2 |
| ci-leaf-manifest-freshness.cjs | 1, 3, 4 |
| daemon/watcher.ts | 1, 2 |
| derived/provenance.ts | 2 |
| tests/daemon-watcher-new-root-ingestion.vitest.ts | 4 |
| tests/create-journey-proof.test.cjs | 4 |
| init_skill.py | (read for scaffold-vs-template check) |
| references/shared/skill-root-metadata-contract.md | 3 |
| 7× command-metadata.json | (sampled sk-doc; gate validated all 7) |
| routing-registry-drift.yml | 5 |
| git-hooks/pre-push | 5 |

### Dimension breakdown
- **Correctness:** 3 P2 — silent readdir, within-entry dup signals, permissive resource probe. No active breakage (live gate 11/11 pass).
- **Security:** 1 P2 — cross-drive `isWithin` edge. Ingestion containment (key_files, aliases, leaf ids) confirmed strong incl. symlink realpath re-check.
- **Traceability:** 1 P2 — cross-gate exit-code convention. Doctrine honest against code across all verified claims.
- **Maintainability:** 1 P1 + 4 P2 — CI trigger gap (P1), cross-package test dep, journey-equivalence gap, silent subdir-skip, pre-push doc.

### Verified ground truth
- `node ci-skill-root-metadata.cjs --format json` → checked=11 passed=11 failed=0; byClass H=7, S=4, unclassified=0 (run 2026-07-28). Matches doctrine §2 exactly.
- `grep -c command-metadata routing-registry-drift.yml` → 0 (confirms F009).
- Doctrine §7 link targets all exist on disk (no dead links).

### Claim adjudication
- F009 (the only P1) carries a typed adjudication packet (embedded in iteration-005.md) with evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity P1, confidence 0.88, and a downgradeTrigger. `claim_adjudication` event persisted to JSONL (passed=true, no missing packets).
