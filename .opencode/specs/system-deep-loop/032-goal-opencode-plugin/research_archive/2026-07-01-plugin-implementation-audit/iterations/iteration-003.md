# Iteration 003 — Built-in `/goal` Collision Check (Path A vs B decider)

**Segment:** 1 | **Iteration:** 3 of 15 | **Mode:** research | **newInfoRatio:** 0.72

---

## Focus

Resolve the blocking question raised at the end of iteration 002: **Does opencode ship a built-in `/goal` command** that would justify the `opencode_` prefix on the shipped command file? This single fact decides **Path A** (rename `opencode_goal.md` → `goal.md` to realize the intended `/goal` namespace) vs **Path B** (keep `opencode_goal.md` and amend all docs to match).

---

## Actions Taken

1. **Located the opencode installation.** `which opencode` → Homebrew symlink → npm package `opencode-ai` v**1.17.11** at `/opt/homebrew/lib/node_modules/opencode-ai/`; the real platform binary is `node_modules/opencode-darwin-arm64/bin/opencode` (Mach-O arm64, Bun-compiled — embeds the full opencode TS source).
2. **Searched the binary for the exact `/goal` token.** `strings … | rg -nc '"/goal"'` → **0 matches**. No `/goal` slash-command string exists anywhere in the binary.
3. **Inventoried built-in command name strings.** Confirmed real built-in commands surface as plain Title-case names: `Clear`, `Compact`, `Init`, `Update`, `Undo`, `Redo`. **`Goal` is absent.**
4. **Classified all 44 case-insensitive `goal` hits** to rule out false negatives. Every hit is noise:
   - Common-word / TLD dictionaries embedded in the binary (e.g. `…goalgrew…`).
   - System-prompt prose ("achieving your goal", "primary goal is to help users", "ultimate goal").
   - Language-grammar keywords: Coq `Goal`, Lean4 `goals`/`revgoals`.
   - **None** is a command registration.

(9 tool calls used of 12; 3 reserved for artifact writes.)

---

## Findings

### F-007 — P1: No built-in `/goal` command exists; collision-avoidance rationale REFUTED

**Classification:** confirmed fact (resolves the blocking collision check).

The opencode 1.17.11 binary contains **no** `/goal` command token and **no** `Goal` command-name string. The set of built-in commands (Clear, Compact, Init, Update, Undo, Redo, …) does not include anything goal-named. Therefore the `opencode_` prefix on the shipped `.opencode/commands/opencode_goal.md` is **not** justified by a namespace collision with a built-in.

**Decision: Path A is viable and preferred.** Renaming `opencode_goal.md` → `goal.md` will realize the intended `/goal` namespace with zero collision risk. Path B (keep the prefix) is no longer defensible on collision grounds — at most it would need a *different* recorded rationale, of which there is none in any phase-003 doc.

### F-008 — P1: Shipped plugin fails its own documented `/goal` invocation contract

**Classification:** drift / functional gap (high confidence; resolution rule remains to be hard-confirmed).

Because (a) there is no built-in `/goal` to fall back on, and (b) the only goal command file is named `opencode_goal.md`, the intended `/goal set …` UX (per success criteria SC-001, the command body heading `# /goal`, and all four phase-003 docs) **does not resolve to the shipped file** under opencode's standard filename→namespace rule. The plugin as shipped therefore cannot be invoked as `/goal` — the single most important user-facing verb is broken. This compounds F-005/F-006 (iteration 2) from a doc-drift into a live functional defect.

### O-002 — Observation: all 44 `goal` hits are non-command noise

Documented above in Actions Taken. Worth recording so a future iteration does not re-investigate "is there a hidden /goal somewhere in the binary?" — **exhausted, do not retry** (see §Exhausted Approaches).

---

## Questions Answered

- **Collision check — ANSWERED (CONFIRMED).** No built-in `/goal` command exists in opencode 1.17.11. **Path A wins**: rename `opencode_goal.md` → `goal.md`.

---

## Confirmed vs Inferred

- **CONFIRMED:** No `/goal` token and no `Goal` command name in the opencode binary (direct `strings` evidence).
- **CONFIRMED:** Built-in commands present as Title-case strings (Clear/Compact/Init/Update/Undo/Redo).
- **INFERRED (still unconfirmed, now non-blocking):** The exact filename→namespace resolution rule for `opencode_goal.md` (does it yield `/opencode_goal`, or are prefixes stripped?). Regardless of the exact rule, the *absence* of a built-in `/goal` means Path A is safe; this only refines F-008's "how broken is it today" claim.

---

## Questions Remaining

- [ ] Confirm the exact opencode command-resolution rule for `.opencode/commands/*.md` → invocation string (does `opencode_goal.md` → `/opencode_goal`?). Non-blocking for Path A; refines F-008.
- [ ] (Carried) Per-phase `plan.md`/`tasks.md` drift for phases 001, 002, 004–008 (003 done in iter 2).
- [ ] (Carried) **F-004:** read `mk-goal.js` lines 1244+ (injection/transform/event wiring).
- [ ] (Carried) Examine `mk-goal-*.test.cjs` suite — does it exercise the command *namespace* at all, and does it cover the unverified code tail?
- [ ] (Carried) Cross-check the 9 resolved design forks against shipped behavior (fork #8 "command style = root /goal" is now *directly* implicated by F-007/F-008).

---

## Next Focus

Execute the plan deferred since iteration 2 (this iteration was a detour to unblock the Path A/B decision). Next iteration: read the **`mk-goal-*.test.cjs` suite** to (a) determine whether any test guards the command **filename/namespace** — it almost certainly does not, which would explain how F-005/F-007 slipped through — and (b) begin covering the unverified **`mk-goal.js` tail (lines 1244+, F-004)**: phase 002 injection (`renderGoalInjection`/`appendGoalBrief`/transform), phase 003 tool registration, and phase 004/006 `event()` wiring. These are the two largest unexamined surfaces and keep novelty high (anti-convergence).
