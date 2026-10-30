---
title: "Implementation Plan: Record the advisor runtime dist build so a fresh build writes its own freshness attestation"
description: "Add a prepare step before the TypeScript compile and a record step after it, both through the spec-kit freshness CLI, so the advisor runtime build leaves an attested record beside each of its two dist entries. A contract test holds the package scripts to the freshness registry, and a checker-origin fallback keeps a missing attestation from failing a legitimate build."
trigger_phrases:
  - "build freshness record plan"
  - "advisor prebuild record-build plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Record the advisor runtime dist build so a fresh build writes its own freshness attestation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 20+, TypeScript compiled by `tsc -p tsconfig.build.json` |
| **Framework** | npm package scripts and their `prebuild` / `postbuild` lifecycle |
| **Storage** | JSON freshness records written beside each dist entry |
| **Testing** | `node --test` for the doctor suites, vitest for the advisor runtime, `validate.sh --strict` for the packet |

### Overview
The advisor runtime package gains a `prebuild` that runs the freshness CLI's `prepare-build` for both declared dist entries, and its existing `postbuild` gains `record-build` for both, after the data copy. That mirrors the spec-kit runtime, whose build already prepares before `tsc` and records in `finalize-dist.mjs`. A vitest contract test reads the freshness registry and holds the scripts to it, so an entry the registry adds without a matching step fails the suite rather than the next fresh provision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0 and writes two `origin: "build"` records
- [x] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 and leaves both records byte-identical
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Prepare-then-attest around an existing compile, expressed entirely in package scripts.

### Key Components
- **`prebuild` and `postbuild`** in the advisor runtime's `package.json`: the two npm lifecycle hooks that run before and after `build`, so the compile script itself is unchanged.
- **`dist-freshness.cjs`**: the spec-kit runtime's freshness module. `prepare-build` stores the source hash of the tree about to be compiled; `record-build` promotes it to an attestation once the compile has finished and the source is unchanged.
- **`DIST_PACKAGES`**: the registry entry for the advisor runtime, which names the two dist entries (`default`, `skill-advisor-cli`) the scripts must cover.
- **`tests/dist-build-record-contract.vitest.ts`**: reads that registry and asserts the two scripts name exactly those entries.

### Data Flow
`prebuild` hashes the watched source for an entry and stores it as a pending record beside the dist entry's folder. `tsc` emits the compile. `postbuild` copies the data files, then `record-build` re-hashes the source, compares it with the pending hash, hashes the emitted entry, and writes the authoritative record with `origin: "build"`. A later freshness check reads that record, finds the hashes equal, and returns fresh without writing anything.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Two layers. The record itself is observed by deleting both records, running the build, and reading the two JSON files back. The absence of a write is observed by running the doctor suite immediately after that build and comparing the records byte for byte before and after. The contract test covers the scripts structurally: run against the shipped scripts it passes, and dropping one entry from `prebuild` makes it fail, which was checked by editing the script, running the test and restoring it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
`node` 20 or later. The freshness CLI is reached by relative path from the advisor package (`../../system-spec-kit/runtime/cli/lib/dist-freshness.cjs`), which is the same sibling the package already borrows its TypeScript compiler from. No package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Trigger: a build fails for a reason inside the new steps rather than inside the compile. Remove the `prebuild` script and the `record-build` chain from `postbuild`, which returns the package to compiling and copying only; the freshness check then falls back to writing a checker record on its first run, exactly as before.
<!-- /ANCHOR:rollback -->

---
