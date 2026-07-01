# Iteration 002 — Filename & Namespace Audit (F-001 follow-up)

**Segment:** 1 | **Iteration:** 2 of 15 | **Mode:** research | **newInfoRatio:** 0.80

---

## Focus

Resolve carried-forward **F-001**: Confirm whether `.opencode/commands/goal.md` coexists with `opencode_goal.md`, determine the actual `/goal` invocation namespace, and decide whether spec 003 needs amending.

---

## Actions Taken

1. **Globbed `.opencode/commands/*.md`** and `.opencode/commands/**/*goal*` to inventory command files.
2. **Read `.opencode/commands/opencode_goal.md`** (the only goal command file on disk) — frontmatter, routing contract, body heading.
3. **Read phase 003 `spec.md`** — deliverables, scope, files-to-change, success criteria.
4. **Read phase 003 `implementation-summary.md`** — "Files Changed" claims.
5. **Read phase 003 `tasks.md`** — T004 task record + key_files.
6. **Read phase 003 `plan.md`** — architecture, affected-surfaces, rollback.

(6 tool calls; 8 of 12 budget used; 3 reserved for artifact writes.)

---

## Findings

### F-005 — P1: Command filename drift (spec 003 mandates `goal.md`; shipped as `opencode_goal.md`)

**Classification:** regression / unresolved gap (spec↔code drift).

Every phase-003 document unanimously names the deliverable `.opencode/commands/goal.md` and marks it `[x]` complete:

| Doc | Line | Claim |
|-----|------|-------|
| `spec.md` | 72, 98, 113 | Deliverable + In-Scope + Files-to-Change = `.opencode/commands/goal.md` |
| `plan.md` | 80, 96, 102, 119, 160 | Architecture + Affected-Surfaces + Phases + Rollback = `.opencode/commands/goal.md` |
| `tasks.md` | 18, 65 | `key_files` + `[x] T004 Create .opencode/commands/goal.md` |
| `implementation-summary.md` | 18, 57, 67, 78 | `key_files` + "Files Changed: `.opencode/commands/goal.md` \| Created" |

**Actual disk state:** Glob of `.opencode/commands/*.md` returns only `opencode_goal.md`, `prompt.md`, `agent_router.md`. **`goal.md` does not exist.** They do **not** coexist — there is exactly one goal command file, named `opencode_goal.md`.

All four continuity `key_files` blocks (spec/plan/tasks/summary) also list the non-existent `goal.md`, so the drift is propagated into memory/index metadata.

**Status:** unresolved gap. No documentation anywhere in phase 003 records a rename decision or a namespace rationale.

### F-006 — P2: Command file self-describes as `/goal` but is named `opencode_goal.md`

**Classification:** drift / internal inconsistency.

The shipped `opencode_goal.md` body contradicts its own filename:
- Heading line 7: `# /goal`
- Line 9: "Thin root router for the session goal plugin."
- Line 15: "`/goal` is a state-free router…"
- Lines 51–59: instructions repeatedly reference the `/goal` verb surface (`/goal set …`).

So the file *claims* to be `/goal` while bearing the `opencode_` prefix. The intent (per body + all phase-003 docs + success criteria SC-001 "`/goal set <objective>` routes to…") is unambiguously the **`/goal`** namespace. The filename defeats that intent.

### O-001 — Observation: `opencode_` prefix is anomalous

No other command file uses an `opencode_` prefix: siblings are `prompt.md` and `agent_router.md`. The prefix on `opencode_goal.md` is singular, reinforcing that it is either a collision-avoidance rename or an error — neither of which is recorded.

---

## Questions Answered

- **F-001 — ANSWERED.** `.opencode/commands/goal.md` does **not** exist and does **not** coexist with `opencode_goal.md`. Only `opencode_goal.md` ships. **Spec 003 DOES need amending** — see "Amendment Recommendation" below.

---

## Namespace Determination (confirmed vs inferred)

- **CONFIRMED:** The *intended* namespace is `/goal` — established by all four phase-003 docs, the success criteria, and the command file's own body (`# /goal`).
- **CONFIRMED:** The shipped filename is `opencode_goal.md`.
- **INFERRED (unconfirmed):** The *actual resolved* invocation string produced by `opencode_goal.md`. In opencode, a command file's invocation is derived from its filename; `opencode_goal.md` resolves to something **other than a bare `/goal`** (most likely `/opencode_goal`). This inference was **not** verified against opencode's command-resolution source this iteration.

---

## Amendment Recommendation (spec 003)

Two resolution paths; decision hinges on one unverified fact:

- **Path A (recommended) — rename file to match docs/intent:** Rename `opencode_goal.md` → `goal.md`. Realizes the spec's intended `/goal` namespace; makes shipped code match all four docs with zero spec rewrites; lowest friction. **Preferred unless `/goal` is a reserved built-in.**
- **Path B — amend docs to match file:** Keep `opencode_goal.md`; rewrite spec/plan/tasks/summary filenames + the command body heading + SC-001 to document the actual namespace; record *why* `/goal` was abandoned.

**Blocking verification needed before choosing:** Does opencode ship a **built-in `/goal` command** that forced the `opencode_` prefix to avoid a collision? If yes → Path B is intentional (but docs still need fixing). If no → Path A. The command body still saying `# /goal` suggests the rename was likely **not** propagated to the body/docs, favoring Path A as the accidental-drift fix.

---

## Questions Remaining

- [ ] **NEW:** Verify the exact opencode command-resolution rule for `opencode_goal.md` → resolved invocation string (confirm or refute `/opencode_goal`).
- [ ] **NEW:** Determine whether a built-in `/goal` command exists in opencode (collision check) — this decides Path A vs B.
- [ ] Do the `mk-goal-*.test.cjs` files exercise the command *namespace* at all, or only the `mk_goal`/`mk_goal_status` tool paths? (Likely the latter; the filename drift would not be caught by tool-path tests.)
- [ ] (Carried) Per-phase plan.md/tasks.md drift for phases 001, 002, 004–008 (003 done this iteration).
- [ ] (Carried) F-004: read `mk-goal.js` lines 1244+ (injection/transform/event wiring).
- [ ] (Carried) Cross-check 9 resolved design forks (esp. "command style" + "reuse vs standalone") against shipped behavior.

---

## Next Focus

Rotate to an unexamined axis (anti-convergence). Next iteration: read the `mk-goal-*.test.cjs` suite to (a) determine whether any test guards the command *filename/namespace* (testing the gap surfaced by F-005) and (b) begin covering the unverified `mk-goal.js` tail per F-004, since the test suite and the code tail are the two largest unexamined surfaces.
