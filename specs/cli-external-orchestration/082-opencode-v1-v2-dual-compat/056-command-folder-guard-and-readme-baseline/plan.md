---
title: "Implementation Plan: Phase 56: command-folder-guard-and-readme-baseline"
description: "Teach the battery's `command-listed` leg what files in the command folder are not commands: a new `listNonCommandFiles` walker maps every non-`.md` file to the name a host could register for it, `allowedCommandSources` carries that map as `nonCommand`, and `legCommandListed` fails a listed name the map explains unless it is a required command, a v2 built-in or a configured MCP prompt. Rebuild the README verdict baseline from the tracked set, and prove both with four new unit tests, the live battery on both versions and a clean parity diff."
trigger_phrases:
  - "command folder guard and readme baseline plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 56: command-folder-guard-and-readme-baseline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS for the battery and its `node:test` suite, JSON for the README verdict fixture, Python for the parity check |
| **Framework** | The OpenCode 1.19.3 and 2.0.32 command scanners, read through the doctor battery |
| **Storage** | None; the evidence lands in `scratch/` as a verification record and a live battery transcript |
| **Testing** | The battery unit tests, the live battery on both versions, the sk-doc script tests and the tracked smoke suites |

### Overview
Phase 055 proved the `.markdown` exclusion with two command lists, which can only show that nothing changed. This phase makes the proof name files. The battery gains a walker that records every file in the command folder that is not a `.md` command, together with the name a host would register for it, and the `command-listed` leg fails when a listed name is explained by one of those files. That failure runs before the allowlist skip, so a global or inherited folder owning the same name no longer hides it. The README verdict baseline is rebuilt from the tracked set in the same change, because it was the other half of 055's gap.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
- [ ] Commit and push to main
- [ ] Confirm CI green at the pushed commit
- [ ] Update the v4.0.0.13 changelog and related docs
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: one walker feeding one leg, with the exemption list kept explicit so a host's fixed entries never read as a stray.

### Key Components
- **`listNonCommandFiles(dir)`**: walks `command/` and `commands/` under `.opencode`, following links and ending a cycle on a visited real path, and maps both the relative path and the extension-less stem of every file that is not a `.md` command to that file. A stem a `.md` command already owns is left out, because the command answers that name.
- **`allowedCommandSources(root, family, env, isolated)`**: returns the same `required` and `allowed` sets as before plus `nonCommand`, the map the walker builds.
- **`legCommandListed(family, listed, sources)`**: fails a listed name the map explains, unless the name is a required command, a v2 built-in, or a configured MCP prompt. A global or inherited folder in `allowed` does not exempt it.
- **The README verdict baseline**: `baseline-readme-verdicts.json`, rebuilt from the tracked set rather than patched by hand.
- **The proof**: `scratch/verification.txt` for the unit, revert, parity and review results, and `scratch/battery-live.txt` for the live run on both versions.

### Data Flow
The walker reads the command folder once per `allowedCommandSources` call and produces a name-to-file map. The leg takes that map with the allowlist, checks each listed name against the map first, and only then falls back to the allowlist and the MCP prompt count. The repository CI workflow runs the battery on 1.19.3 and 2.0.32, so the leg runs on both versions on every change to the battery or its tests.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Four unit tests carry the check: C14 fails a listed README even when a global folder owns its name, C15 pins the walker's name and stem mapping, C16 keeps v2 built-ins and configured MCP prompts passing, and C17 proves a linked command folder still exposes a non-command name. The revert proof is the part that makes C14 evidence rather than assertion: with the check removed from `legCommandListed`, C14 goes red, and it goes green again when the check is restored. The live battery on both versions shows the new check does not fail a legitimate listing, the parity check shows the rebuilt baseline matches the tracked set, and the tracked smoke suites show the surrounding trees still pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Both installed OpenCode versions must answer a command listing, and the battery must be able to read v1 from a private data home and v2 through a private `serve` so the shared OpenCode 2 service is never touched. The README parity check must run locally, and the tracked smoke suites must be runnable against the same worktree.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit: `legCommandListed` returns to the allowlist-only check, `listNonCommandFiles` and the `nonCommand` field go with it, and the verdict baseline returns to 978 entries. The command proof drops back to two command lists and the baseline returns to missing seven tracked READMEs, so the rollback costs the guard and nothing else.
<!-- /ANCHOR:rollback -->

---
