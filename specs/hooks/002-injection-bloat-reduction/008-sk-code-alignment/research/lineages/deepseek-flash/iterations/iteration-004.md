# Iteration 4: Observer ordering verification + reverse-reference README scan

## Focus

Broaden the review angle per the max-iterations stop policy: verify with exact line numbers that the four stdout-write Gate-3 adapters observe strictly post-emission, that the Pi return-based hook observes as the final pre-return step, and run a reverse-reference scan for any additional README that names the 12 changed files.

## Findings

### F19 — Post-emission observer ordering CONFIRMED with line numbers (all four stdout adapters)

Each stdout-write adapter calls `observeGate3QuestionDelivery` INSIDE the `process.stdout.write(JSON.stringify(...), callback)` completion callback, so observation runs only after the bytes are handed to the host write — strictly post-emission:

- `hooks/claude/spec-gate-classify.mjs:70-78` — `process.stdout.write({...hookSpecificOutput...}, () => { guardCore.observeGate3QuestionDelivery(observeArgs); process.exit(0); })`
- `hooks/codex/spec-gate-classify.mjs:67-75` — identical shape
- `hooks/cursor/spec-gate-classify.mjs:74-81` — identical shape (`permission:'allow'` + `agent_message`)
- `hooks/devin/spec-gate-classify.mjs:73-80` — identical shape

The four adapters match the frozen contract claim "Gate-3 delivery observers fire strictly post-emission on the stdout-write adapters" exactly. No pre-emission observation exists.

### F20 — Return-based hooks observe as the final pre-return step CONFIRMED

- `hooks/pi/spec-gate-classify.ts:51-56` — builds the `output` transform object, then `guard.observeGate3QuestionDelivery(observeArgs);` as the last statement before `return output`.
- `hooks/pi/prompt-advisor.ts:485-490` — builds `output`, then `await observeEmittedPiDispatch(...)` as the last statement before `return output`.
- `hooks/claude/user-prompt-submit.ts:283-294` — builds the output envelope, then `observeEmittedAdvisorPolicy(emitted, {...candidate:'004'})`, then `return output`.

Matches "return-based hooks observe as the final pre-return step after the output is committed" exactly.

### F21 — Reverse-reference scan: no additional stale README found

Scanned every `*.md` under `.opencode/skills` that names any of the 12 changed files. Matches fall into four classes:
1. **Accurate inventory/reference lines** in `lib/README.md` (render.ts, but missing policy-plan.ts — F10), `hooks/pi/README.md` (prompt-advisor.ts + render.ts, accurate), `hooks/skill-advisor-hook.md` (runtime matrix paths, accurate), `lib/spec-gate/README.md` (spec-gate-core.mjs, accurate), `hooks/{claude,codex,pi}/README.md` (spec-gate-core.mjs reference, accurate).
2. **The known omission** — `lib/README.md` flat-module tree misses `policy-plan.ts` (F10).
3. **Playbook references** (`cli-cursor/manual-testing-playbook/...`) refer to Cursor's `user-prompt-submit` adapters and the dormant `beforeSubmitPrompt` state — accurate and unchanged by this commit (only the Cursor spec-gate-classify.mjs changed, and the playbook does not claim observer behavior).
4. **`references/shared/hooks.md`** (sk-code-opencode) restates "OpenCode prompt-time advice is delivered by the OpenCode plugin and bridge" — accurate, not contradicted.

Conclusion: the reverse-reference scan adds no new stale README beyond the F10/F11/F12 set. The README surface touched by these files is fully inventoried.

### F22 — README freshness verdict consolidated (final)

- **Directly contradicted statements: none.** No README made a claim about delivery confirmation, epoch semantics, or observer timing before this change, so nothing became false.
- **Stale-by-omission (must-fix):** `lib/README.md` (missing `policy-plan.ts` from both trees), `ENV-REFERENCE.md` (no spec-gate section — suppression env undiscoverable), `lib/spec-gate/README.md` (ENTRYPOINTS missing the delivery-observation API + suppression flag).
- **Under-specified (optional):** per-runtime spec-gate hook READMEs (no observer-timing mention), shadow-delta vs shadow-delivery terminology overlap in `lib/shadow/README.md` + `mcp-server/README.md`.

## Sources Consulted

- [SOURCE: hooks/{claude,codex,cursor,devin}/spec-gate-classify.mjs:70-81]
- [SOURCE: hooks/pi/spec-gate-classify.ts:51-56]
- [SOURCE: hooks/pi/prompt-advisor.ts:485-490]
- [SOURCE: hooks/claude/user-prompt-submit.ts:283-294]
- [SOURCE: rg -rln across .opencode/skills/*.md for the 12 file basenames]

## Assessment

newInfoRatio: 0.15
noveltyJustification: F19/F20 confirm the frozen observer contract with exact line numbers (evidence, not new claims); F21 closes the reverse-reference scan with no additions; F22 is the consolidated verdict. Mostly confirmation on an established surface — convergence territory, but per stopPolicy=max-iterations we continue to iteration 5 and broaden rather than synthesize early.

Key questions: Q2/Q3/Q4 reconfirmed; no new open questions.

## Reflection

What worked: exact-line verification of the observer ordering converted the frozen-contract claim from assertion to evidence; the reverse scan bounded the README surface exhaustively.

What failed / ruled out: Ruled out any README that falsely describes the changed behavior (none exist); ruled out the cursor playbook being affected (its subject, the beforeSubmitPrompt delivery state, is unchanged).

## Recommended Next Focus

Iteration 5 (final): Broaden once more with an independent verification pass — (a) re-derive the must-fix split against the authoritative sk-code opencode-surface checklists (universal-checklist.md, typescript-checklist.md, javascript-checklist.md) to catch any missed alignment item in the 12 files; (b) confirm the `observeRenderedAdvisorPolicy` no-op stub in policy-plan.ts is intentional shadow-only telemetry and correctly documented; (c) sanity-check that no changed file uses `console.log`/stdout directly (plugin TUI rule). Then close the loop with synthesis.
