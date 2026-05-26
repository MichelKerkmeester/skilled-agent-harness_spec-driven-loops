---
title: "Embedder set dry-run and validation"
description: "embedder_set plans an embedder swap in dry-run mode without starting a reindex, validates the requested name against the registry, and returns a structured error for unknown embedders so operators can rehearse swaps safely."
---

# Embedder set dry-run and validation

---

## 1. OVERVIEW

embedder_set plans an embedder swap in dry-run mode without starting a reindex, validates the requested name against the registry, and returns a structured error for unknown embedders so operators can rehearse swaps safely.

A real embedder swap rebuilds the corpus vector table and re-embeds every indexed document, which can take 15 minutes or more on a populated workspace. The dry-run path lets operators preview the planned table name, dimension count, and reindex action without paying that cost, and the validation path turns typos into structured errors instead of partial swaps.

---

## 2. CURRENT REALITY

The handler lives at `mcp_server/handlers/embedder-set.ts`. The happy-path contract for `embedder_set({ name, dryRun: true })` is to look the name up in the embedder registry, compute the resulting table and dimension shape, and return a `plan` object describing the action without mutating the active pointer or starting a reindex job. The active pointer reported by `embedder_status({})` after a dry-run is unchanged from before the call.

The validation path covers two cases. A name absent from the registry returns a structured error that names valid choices or recovery guidance, rather than crashing or silently swapping. A name present in the registry but blocked by an in-flight swap (visible through `embedder_status`) also fails cleanly so two swaps cannot collide.

The handler shares its name lookup with `embedder_list` and its job lookup with `embedder_status`, so the three handlers stay consistent on which embedders exist and which ones are mid-swap. A real swap (no `dryRun`) follows the same plan path, then writes a swap job into the database and returns the job id for `embedder_status` polling.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | Handler | Plans or applies an embedder swap, validates the requested name against the registry, and returns a structured error for unknown embedders |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` | Handler | Reports the active embedder pointer used by the dry-run no-op invariant |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | Lib | Canonical registry consulted for name validation and plan computation |

### Validation And Tests

| File | Focus |
|------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-set.vitest.ts` | Handler-level coverage for dry-run planning, invalid-name errors, and the active-pointer invariant |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts` | Coverage for the full reindex path triggered by a non-dry-run swap |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/282-embedder-set-dry-run-and-validation.md` | Playbook scenario 282 covering dry-run plan output, invalid-name handling, and active-pointer no-op |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/45-embedder-set-dry-run-and-validation.md`
