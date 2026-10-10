---
title: "Scripts: drift-guard gate runner"
description: "Single entry point that runs all sk-code drift guards as one completion gate."
---

# Scripts

---

## 1. OVERVIEW

`scripts/` holds the one drift-guard entrypoint for the `code-opencode` mode. It runs three drift guards (alignment-drift, stack-folder, router-sync) in sequence and exits non-zero if any fails, so a completion gate never has to remember separate commands. The router-sync guard (`assets/scripts/verify_router_sync.cjs`) restores the four checks of the router-sync suite that was deleted with its lane: (1) every path in the machine-readable router exists on disk, every routable reference or asset doc is routed, and every full path the prose maps name is routed; (2) the parent surface RESOURCE_MAP equals the union of the surface children's maps plus the parent tier; (3) compiled route-gold destinations, `leaf-manifest.json` and the code-opencode RESOURCE_MAP agree through `qualifiedIdToLeaf`; (4) every playbook routing scenario's `expected_resource` is emitted by the router. The entrypoint runs legs 1a, 2, 3 and 4. Leg 1b, the orphan-doc part of (1), is not run: nine docs have no router naming them, so it stays out of the entrypoint until they are routed (owner: sk-code). The dead-path part of (1) is `verify_alignment_drift.py --check-router`, which this entrypoint also runs. `.github/workflows/routing-registry-drift.yml` covers the compiled side of (3) and (4), in CI only, in warn-only mode.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-all-drift-guards.sh` | Runs `verify_alignment_drift.py --check-router`, `verify_stack_folders.py` and `verify_router_sync.cjs --checks 1a,2,3,4` in order, printing a PASS/FAIL line per guard; a comment after the router-sync guard records leg 1b, which is not run, and its owner (sk-code) |

---

## 3. VALIDATION

Run from any working directory, the script resolves its own paths:

```bash
bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
```

Expected: a `PASS: router-sync` line, `run-all-drift-guards: all 3 guards PASSED` and exit code 0.

---

## 4. RELATED

- [`code-opencode SKILL.md`](../SKILL.md)
- [`code-opencode README.md`](../README.md)
