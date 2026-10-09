---
title: "Scripts: drift-guard gate runner"
description: "Single entry point that runs all sk-code drift guards as one completion gate."
---

# Scripts

---

## 1. OVERVIEW

`scripts/` holds the one drift-guard entrypoint for the `code-opencode` mode. It runs the two live drift guards (alignment-drift, stack-folder) in sequence and exits non-zero if either fails, so a completion gate never has to remember separate commands. A third guard, the router-sync suite, was retired with its lane and has no full replacement. It checked four things: (1) every path in the machine-readable router exists on disk, every routable reference or asset doc is routed, and every full path the prose maps name is routed; (2) the parent surface RESOURCE_MAP equals the union of the surface children's maps plus the parent tier; (3) compiled route-gold destinations, `leaf-manifest.json` and the code-opencode RESOURCE_MAP agree through `qualifiedIdToLeaf`; (4) every playbook routing scenario's `expected_resource` is emitted by the router. The dead-path part of (1) is `verify_alignment_drift.py --check-router`, which this entrypoint runs. `.github/workflows/routing-registry-drift.yml` covers the compiled side of (3) and (4), in CI only: its compiled-serving admission step runs `--warn-only`, and its leaf-manifest freshness step byte-checks every `leaf-manifest.json`. No step reads RESOURCE_MAP. Orphan and prose-path coverage in (1), all of (2), the RESOURCE_MAP-to-manifest leg of (3) and the surface-router side of (4) have no guard. Owner of the gap: sk-code.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-all-drift-guards.sh` | Runs `verify_alignment_drift.py --check-router` and `verify_stack_folders.py` in order, printing a PASS/FAIL line per guard; a comment after the guard calls records the retired router-sync guard's four checks, its partial successor, the gap and the owner (sk-code) |

---

## 3. VALIDATION

Run from any working directory, the script resolves its own paths:

```bash
bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
```

Expected: `run-all-drift-guards: all 2 guards PASSED` and exit code 0.

---

## 4. RELATED

- [`code-opencode SKILL.md`](../SKILL.md)
- [`code-opencode README.md`](../README.md)
