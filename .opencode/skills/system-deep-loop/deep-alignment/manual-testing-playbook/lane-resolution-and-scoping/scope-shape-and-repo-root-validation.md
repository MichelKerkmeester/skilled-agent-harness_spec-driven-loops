---
title: "DAL-006 -- Scope-shape validation and repo-root containment"
description: "Verify the three scope shapes (paths, globs, branchRange), that paths/globs values are non-empty and validated against the repo root (traversal rejected), and that branchRange requires non-empty from/to."
version: 1.0.0.0
---

# DAL-006 -- Scope-shape validation and repo-root containment

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-006`.

---

## 1. OVERVIEW

This scenario validates scope-shape checking for `DAL-006`. The objective is to verify the three `SCOPE_TYPES` (`paths`, `globs`, `branchRange`), that `paths`/`globs` values are a non-empty array of non-empty strings each validated against the repo root (so a `..`-traversal or repo-escaping value fails), and that `branchRange` requires non-empty `from`/`to` (refs, not repo-root-validated).

### WHY THIS MATTERS

`validateScope` is the security boundary (NFR-S01): every path/glob is repo-root-validated before any adapter's `discover()` can walk it, so a malformed scope cannot escape the workspace. If this check were skipped or weakened, a lane could point an adapter's filesystem walk outside the repo.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the three scope shapes and the repo-root containment / non-empty-field rules.
- Real user request: What scope shapes can I use, and will a path that escapes the repo be rejected?
- Prompt: `Validate deep-alignment scope-shape validation: the three SCOPE_TYPES, non-empty paths/globs values run through the repo-root guard, and branchRange from/to requirements.`
- Expected execution process: Read `SCOPE_TYPES`, `validateScope`, and the `validateNamespaceValue` import, then call `resolveLanesFromConfig` with a traversal path, an empty values array, and a branchRange missing `to`, confirming each fails; then confirm a well-formed lane of each shape resolves.
- Desired user-facing outcome: The user is told the three shapes, that path/glob values are repo-root-guarded (traversal rejected), and that branchRange needs both refs.
- Expected signals: `SCOPE_TYPES = ['paths','globs','branchRange']`; a `..`-traversal or repo-escaping `paths`/`globs` value fails the lane (NFR-S01, via `validateNamespaceValue`); an empty `values` array fails; a `branchRange` missing `from` or `to` fails; refs are not repo-root-validated.
- Pass/fail posture: PASS if each malformed scope is rejected and each well-formed shape resolves. FAIL if a traversal value is accepted or a valid shape is rejected.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the constant and guard are read before the runtime rejections.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment scope-shape validation: the three SCOPE_TYPES, non-empty paths/globs values run through the repo-root guard, and branchRange from/to requirements.
### Commands
1. `bash: rg -n 'SCOPE_TYPES|validateScope|validateNamespaceValue|branchRange|non-empty array' .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`
2. `bash: node -e "const s=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs'); for(const sc of [{type:'paths',values:['../../etc/passwd']},{type:'globs',values:[]},{type:'branchRange',from:'main'}]){try{s.validateScope(sc,'scope');console.log('ACCEPTED(bad):',JSON.stringify(sc));}catch(e){console.log('REJECTED:',e.message);}}"`
3. `bash: node -e "const s=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs'); for(const sc of [{type:'paths',values:['docs/']},{type:'globs',values:['src/**/*.ts']},{type:'branchRange',from:'main',to:'HEAD'}]){console.log('OK:',JSON.stringify(s.validateScope(sc,'scope')));}"`
### Expected
`SCOPE_TYPES` lists the three shapes; `validateScope` routes `paths`/`globs` values through `validateNamespaceValue`. The traversal path, the empty `values` array, and the `from`-only branchRange are each REJECTED with a labeled message; the three well-formed scopes each resolve OK (branchRange returning trimmed `from`/`to`).
### Evidence
Capture the three rejection messages and the three OK resolutions, plus the `SCOPE_TYPES` constant and the `validateNamespaceValue` call site.
### Pass/Fail
PASS if each malformed scope is rejected and each well-formed shape resolves. FAIL if a traversal value is accepted or a valid shape is rejected.
### Failure Triage
A traversal or repo-escaping path being ACCEPTED is a hard security-boundary FAIL. If a valid shape is rejected, inspect `validateScope`'s branch for that `scope.type`.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `lane-resolution-and-scoping/` | Lane-resolution category; `scoping.cjs`'s `validateScope` is exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | `SCOPE_TYPES`, `validateScope`, `validateNamespaceValue` reuse |
| `.opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` | `validateNamespaceValue` — the shared repo-root/traversal guard reused (NFR-S01) |
| `.opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md` | §5 scope shapes; §8 malformed-scope error contract |

---

## 5. SOURCE METADATA

- Group: LANE RESOLUTION AND SCOPING
- Playbook ID: DAL-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `lane-resolution-and-scoping/scope-shape-and-repo-root-validation.md`
