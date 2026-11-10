---
title: "Implementation Plan: Phase 23: sk-vision runtime fixes from the post-merge research"
description: "Fix the nine sk-vision rows the post-merge research left open, in one branch: repair setup disposal and the grace downgrade first, then the test layout, host-adapter coverage and the host-without-session.hook path, then the four runtime lifetime slips. Each row lands with a test that fails on the old code, a recorded mutation proving it, and a CI step that runs the suite on the v1 battery leg."
trigger_phrases:
  - "sk vision runtime fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 23: sk-vision runtime fixes from the post-merge research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Bun |
| **Framework** | OpenCode plugin host adapters (v1 `server`, v2 `setup`) over the sk-vision runtime |
| **Storage** | None |
| **Testing** | `bun:test` in `vision-runtime/tests/`, plus the plugin suite and the two-version battery |

### Overview
Nine rows of the post-merge fix list land in one branch, ordered by blast radius: the two P1 defects in `src/plugin.ts` first, then the test layout and host-adapter coverage, then the four P3 lifetime slips in `src/runtime/client.ts`. Every row gets a test that fails on the original code and passes on the fix, captured as a mutation record under `scratch/mutation/`, and the suite joins CI on the v1 battery leg.
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
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted repairs to one host adapter and its runtime client, each proven by a failing-then-passing test.

### Key Components
- **`vision-runtime/src/plugin.ts`**: the v2 `setup` entry. It registers the command, the tools and the `session.hook('prompt')` inspection, then returns a disposer. Rows 4, 5, 20 and 24 change what that disposer releases, when the inspection waits for evidence, what happens without `session.hook`, and whether a failed command registration fails setup.
- **`vision-runtime/src/runtime/client.ts`**: the runtime client. It probes the interpreter and `uv`, provisions the venv and waits for a startup ping. Rows 23, 25 and 26 change the ping timer lifetime, the probe timeout and the `mkdir` cleanup.
- **`vision-runtime/tests/`**: the suite. Seven tests move here from `src/` (row 13), and the new `layout.test.ts` and `host-adapter.test.ts` guard the layout and the shipped OpenCode hook adapter (rows 13 and 15).
- **`.github/workflows/opencode-dual-version.yml`**: the two-version CI workflow. Row 15 adds a step that runs `bun test tests` and `bunx tsc --noEmit` on the v1 battery leg after provisioning.

### Data Flow
The host calls `setup(ctx)`, which registers the command through `ctx.command.transform`, the tools through `ctx.tool.transform` and the prompt hook through `ctx.session.hook`. The returned disposer releases all of them through `Promise.allSettled` and rethrows the first rejection. On a prompt with images, the hook reads the session model: an unreadable model now sets `guaranteed`, so the runtime waits for the evidence instead of racing the 2 s grace. The runtime client spawns Python, probes it through one shared `probe()`, provisions a venv it may later remove, and waits for a startup ping under a timer that no longer holds the event loop.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The baseline is recorded before any edit in `scratch/baseline/`: sk-vision `bun test` 67 pass 0 fail, `tsc` exit 0, the plugin suite 397 pass, the v1 battery exit 0 and the v2 battery exit 1.

Each row then carries a mutation record in `scratch/mutation/`, run against the original file and the fixed one: `row04-old-code.txt`, `row05-old-code.txt`, `row13-guard-old-layout.txt`, `row15-wiring-mutations.txt`, `row20-old-code.txt`, `row23-old-code.txt`, `row24-old-code.txt`, `row25-old-code.txt` and `row26-old-code.txt`. A record counts only when the test fails on the original and passes on the fix; row 15 breaks the wiring by hand because the adapter source is unchanged, and row 23 also runs a partial fix with only `unref()` removed.

The final runs live in `scratch/final/`: `bun test` 76 pass 0 fail across 10 files (67 plus 9 new), `tsc --noEmit` exit 0, the plugin suite 397 pass, the v1 battery exit 0 with 3 PASS, and the v2 battery exit 1, unchanged from the baseline. A clean-env run with an empty HOME and no `SK_VISION` variables gives 73 pass and 0 fail (`scratch/final/ci-like.txt`).

CI owns the durable check: the new `Run the sk-vision runtime suite` step in `.github/workflows/opencode-dual-version.yml` runs `bun test tests` and `bunx tsc --noEmit` on the v1 battery leg after provisioning. The Python handler suite under `python/` stays out because it needs Pillow, which the runner lacks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`../014-post-merge-deep-research/research/research.md` §9 supplies the nine rows and their severities, and the findings behind them came from 015 (f-001..f-007) and 018 (F1, F3). The pinned OpenCode v1 and v2 batteries plus the plugin suite supply the regression boundary, and the provisioning step in `.github/workflows/opencode-dual-version.yml` is what lets the new CI step run.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped edits to `src/plugin.ts`, `src/runtime/client.ts`, the seven moved tests, the two new tests, the 13 doc files, `SKILL.md` and the CI workflow. Nothing migrates and no stored state changes; the records under `scratch/` stay as history, and the seven tests return to `src/` by reverting the moves.
<!-- /ANCHOR:rollback -->

---
