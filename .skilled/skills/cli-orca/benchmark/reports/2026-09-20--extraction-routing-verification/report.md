---
title: "cli-orca extraction and routing verification benchmark"
description: "Dated package, hub, packet, advisor and compiled-routing evidence for the standalone cli-orca skill extracted out of the mcp-tooling hub."
version: 1.0.0.0
---

# cli-orca extraction and routing verification benchmark

**Run label:** `2026-09-20--extraction-routing-verification`
**Scope:** standalone skill package gates, hub mode removal, packet validation, advisor routing, compiled-routing posture, frozen-manifest reproduction
**Serving posture:** the hub reports `stale-manifest`, so its prose router stays authoritative and compiled routing is recorded rather than presented as serving
**Verdict:** PASS for all sixteen gates, with one advisory census warning inside the playbook package gate

## 1. OVERVIEW

This report records the closed-out evidence for the extraction of the Orca CLI subject out of the mcp-tooling parent hub into the standalone `cli-orca` skill. Every row below was observed by running the named command, and its stdout plus exit status is captured in the gate-results file listed here.

### Evidence Artifacts

| Artifact | Purpose |
|---|---|
| [`routing-replays.json`](routing-replays.json) | Advisor replays for the positive, holdout and negative prompts plus the hub compiled-routing status, route and admission records |
| `specs/cli-orca/002-consolidate-official-orca-skills/scratch/gate-results.md` | Captured stdout and exit status of every gate in the close-out suite |
| `specs/cli-orca/002-consolidate-official-orca-skills/scratch/baseline-pre-extraction.txt` | Pre-extraction baseline used for the before and after comparison |
| `specs/cli-orca/001-mcp-orca-cli/benchmark/reports/orca-integration/` | The retained hub-era integration evidence, including the routing replay fixtures |

---

## 2. GATE RESULTS

| Gate | Command | Observed result |
|---|---|---|
| Fleet root metadata | `ci-skill-root-metadata.cjs --fix` | `checked=14 passed=14 failed=0`, and `cli-orca` is classified class S |
| Package validation | `validate_skill_package.py .skilled/skills/cli-orca --strict` | `Detected kind: standalone` |
| Package check | `package_skill.py --check --strict` | `Result: PASS` with zero warnings |
| Feature catalog package | `validate_catalog_package.py --package cli-orca` | `PASS: 0 violations` |
| Playbook package | `validate-playbook-package.cjs --package cli-orca` | `PASS scenarios=8 categories=4 violations=0 warnings=1` |
| Hub parent check | `parent-skill-check.cjs .skilled/skills/mcp-tooling` | All hard invariants passed, 0 warnings, 9 declared modes, 84 unique aliases, 21 vocabulary classes |
| Packet 001 | `validate.sh specs/cli-orca/001-mcp-orca-cli --strict` | `RESULT: PASSED` |
| Packet 002 | `validate.sh specs/cli-orca/002-consolidate-official-orca-skills --strict` | `RESULT: PASSED`, 0 errors, 2 advisory warnings |
| Document corpus | `validate_document.py <each doc> --blocking-only` | `checked=32 blocking=0` |
| Retired-leaf sweep | `rg "mcp-tooling/mcp-orca-cli" .skilled/skills` excluding changelogs and benchmark evidence | 0 live references |
| Frontmatter versions | `check-frontmatter-versions.sh` | `2926 files ok=2918 skip-no-frontmatter=8` |
| Advisor positive | `advisor_recommend --prompt "orca worktree handoff to another agent through the Orca CLI"` | `cli-orca` first at `0.7` confidence `0.8962`, `sk-git` second at `0.608667` |
| Advisor holdout | `advisor_recommend --prompt "Show the OpenOrca model label for the current request."` | `recommendations: []` |
| Derived freshness | `ci-skill-derived-freshness.cjs` | `checked=14 fresh=14 stale=0` |
| Frozen manifest | `test_readme_manifest.py` | `derived=811 frozen=811 reproduced=True`, exclusions 21 of 21 |
| Compiled route | `compiled-route.cjs --hub mcp-tooling --prompt "Use the Orca CLI to inspect the current worktree and terminal"` | `{"servingAuthority":"legacy","hubId":"mcp-tooling"}`, so no Orca target is returned |
| Hub admission | `compiled-route-admission.cjs --hub mcp-tooling` | `pass`, 16 scored scenarios passing, 0 drift, 0 stale |
| Snapshot provenance | `shasum -a 256` plus `cmp` over the eight stubs | 8 of 8 digests match the manifest and the bytes are identical to the source |

---

## 3. ADVISOR ROUTING EVIDENCE

| Prompt class | Prompt | Outcome |
|---|---|---|
| Positive, full phrase | `orca worktree handoff to another agent through the Orca CLI` | `cli-orca` ranked first |
| Positive, short phrase | `orca terminal` | `cli-orca` only, confidence `0.9106` |
| Positive, holdout class | `managed worktree paired terminal` | `cli-orca` first at `0.82` with `sk-git` second at `0.638064` |
| Negative, unrelated product | `Show the OpenOrca model label for the current request.` | no recommendation |
| Negative, generic git | `create a git worktree for the release branch` | `sk-git`, never `cli-orca` |
| Mixed long prompt | `use the orca cli to inspect the current worktree and terminal` | no recommendation, see the limitation below |

---

## 4. HUB EXTRACTION EVIDENCE

The hub declares nine tool bridges after the extraction. `parent-skill-check.cjs` confirms that every registry mode, router signal, tie-break entry, vocabulary class, resource path and leaf-manifest row still agrees, and that the nine packet frontmatter names match their registry `packetSkillName` values.

The hub's compiled route no longer returns an Orca target. `compiled-route-status.cjs` reports `servingAuthority: legacy` with `causeCode: stale-manifest`, and the same shape is returned for an unrelated Chrome prompt, so the observation is a hub-wide serving posture change rather than prompt-specific evidence. `compiled-route-admission.cjs` still judges the hub as passing.

---

## 5. INTERPRETATION

The extraction is observable from three independent directions. The fleet root-metadata gate classifies and validates the new standalone root. The advisor re-ingest routes Orca-qualified phrases to `cli-orca` and keeps the OpenOrca and generic-worktree holdouts away from it. The stale-reference sweep finds no live path that still points at the retired `mcp-tooling/mcp-orca-cli` leaf, while the hub's own changelog keeps its historical entry and the retired hub routing scenarios survive as packet evidence under `benchmark/reports/hub-routing-archived/`.

Two facts bound the claims made here. First, the advisor recall hole is real and unresolved: a long prompt that mixes an Orca phrase with generic worktree and terminal vocabulary scores below the surfacing threshold, because the lexical lane normalizes token overlap against the unexpanded prompt length. Short Orca-qualified phrases route, long mixed ones can return nothing. Second, the hub compiled route reports a stale activation manifest. Republishing that manifest needs the authored compiled-routing tree, which the sync tool cannot locate because the authored tree now lives under `specs/sk-doc/z_archive/`, so the hub serves through its prose router and the compiled posture is recorded as legacy authority.

No Orca worktree, terminal input, browser mutation, automation, artifact publication or skill share was performed by this run. Every gate above is read-only apart from the derived-file regeneration that the metadata gate performs by design.
