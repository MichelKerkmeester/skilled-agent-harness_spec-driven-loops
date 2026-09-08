# Iteration 007 — KQ-R2c: hook adapter contents — parity scaffolding quantified

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 7 | focus: the six-runtime hook matrix — what the codex/cursor/devin/pi adapters actually contain vs claude's, how much is parity scaffolding, and whether F11/F13's keep-decisions survive new evidence.
Evidence reads: `runtime/hooks/{claude,codex,cursor,devin,pi,opencode,lib}` trees (wc + ls), `hooks/README.md:23,67,82,88,140`, `hooks/opencode/system-spec-gate.js` (symlink target header), `hooks/pi/spec-gate-classify.ts` (head), similarity measurement via python difflib on the 4 spec-gate pairs + shared.ts (runtime-name-neutralized). Reads cost: 6 bash calls. No node/validate/git.

## What exists (recounted in this tree)

- claude 4,249 / codex 1,069 / cursor 1,523 / devin 1,608 / pi 469 / lib ~4,021 (incl. spec-gate core + workspace) / opencode 296 (via symlink) — round one's counts confirmed at the same scale; the earlier "lib 101" was a glob artifact (subdirs), lib is ~4,021.
- `hooks/opencode/system-spec-gate.js` IS a symlink (`lrwxr-xr-x -> ../../../../../plugins/system-spec-gate.js`), and hooks/README.md:67,82 document it as "Browsability-only symlink … OpenCode discovers plugins solely from `.opencode/plugins/`, so the real file stays there and nothing loads through this symlink." **F13 (census) confirmed correct — round two confirms again; no finding.**
- Every runtime's gate pair (classify + enforce) consumes the same shared core: claude/codex/cursor/devin through `lib/hook-adapter-shared.mjs` + `lib/spec-gate/spec-gate-core.mjs`; pi through `lib/spec-gate/spec-gate-core.mjs` directly (its `spec-gate-classify.ts` imports the core and calls `sanitizePromptForClassify`).
- **Similarity (measured, names neutralized):** spec-gate-classify.mjs = 68–68/84 lines identical (76–82% ratio) across claude↔{codex,cursor,devin}; spec-gate-enforce.mjs = 87–98/120 (68–76%); shared.ts = 22–44/147 (12–28%). The transport-specific logic (event names, payload shapes) lives in shared.ts + the ~20–30% of the gate pairs; the remaining ~70% is line-for-line duplicated text with a one-word runtime name difference.

## F11 re-examination — quantified, but the keep-reason still holds

Round one's F11 (3,582 LOC of adapter ceremony) → census recorded decision "not to change: the adapters are five runtimes' live registration contracts … a port changes runtime behavior the simplification program has no evidence against." New evidence this pass:
1. The ceremony is ~70% duplicated gate text — the registration-specific content is confined to shared.ts (12–28% shared) and the per-runtime event/payload shapes.
2. A behavior-preserving consolidation precedent EXISTS in-tree: pi's single TS adapter pair (469 L total for the same gate job, also core-backed) and the opencode plugin adapter (296 L, core-backed "only maps OpenCode's transport onto it" — its own header). The thin shape is proven; the fat four are the pre-core shape.
3. BUT the consolidation still changes each runtime's load paths (each runtime loads its own files by path), and the census's reason was never "the code can't shrink" — it was "no EVIDENCE against changing live runtime behavior." The similarity data does not manufacture that evidence; it only shows the shrink is mechanical (generate the per-runtime shims from one template).

Verdict: **F11 keep stands (no new evidence its reason is wrong); the phase-2 port's scope is now quantified** — ~70% of four adapter pairs + the shared.ts split is the real transport layer. This moves F11's phase-2 from "unquantified ceremony" to "mechanical shim generation over one core + four transport shims": a rank change in the plan's risk table, not a re-list.

## Findings

**No new findings this iteration.** F13 re-confirmed (symlink, documented; census right); F11 re-examined (keep holds; duplication quantified). Recorded for the ranked plan: the 70–80% gate-adapter duplication + the pi/opencode thin precedent are the two data points that phase-2's risk table should carry.

## Open / UNKNOWN (carried, not resolved)

- **Runtime usage census**: which of claude/codex/cursor/devin hooks actually fire in this fleet is NOT decidable from in-boundary evidence (the registrations live in root config dirs outside the evidenceBoundary; round one recorded the same UNKNOWN). The in-boundary evidence shows the four gate pairs are live-shaped (each carries its own README + tests) but true firing requires the out-of-boundary registration check. Recorded, not counted.

## Provisional counts

- Gate-adapter duplication: classify 76–82%, enforce 68–76%, shared.ts 12–28% (neutralized difflib ratios).
- Thin-shape precedent: pi 469 L / opencode 296 L / lib core ~4,021 L — vs fat four 8,449 L.
