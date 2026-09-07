# Iteration 008 — Caller / consultation census re-verification (post-fix tree)

**Focus:** Round one's q-consulted census ran against the pre-fix tree. Re-verify in this tree: does anything execute the lookup (hooks/plugins/settings) — and is the index actually consulted by the surfaces the docs claim (save, doctor, agents, command docs)? Plus: is the doctor YAML actually WIRED (referenced by the doctor command surface), or is it an orphan assembly?

**Method:** `rg` census for `lookup-trigger-index` and `generate-trigger-index` across `.opencode/` (excluding dist); read `doctor/speckit.md`, `_routes.yaml`, `doctor-speckit-presentation.txt` wiring; check hooks dir inventory; read save.md + save-presentation generator references.

## Findings

### V18 — NO HOOK, PLUGIN OR SETTINGS REGISTRY EXECUTES THE LOOKUP (L5 dropped-row re-verified, no new evidence)

- **Path:line:** `rg -ln "lookup-trigger-index"` over `.opencode/hooks`, `.opencode/agents`, `.opencode/plugins*`, `.opencode/settings*` → hits ONLY in `.opencode/agents/*.md` (deep-research, deep-review, deep-improvement, review, debug — docs, not hooks); `.opencode/hooks/` exists (README.md, codex-watchdog, completion, directive-lifecycle, …) with zero references
- **Claimed vs actual:** Round one's L5 was DROPPED with the reason "the hook-system table's column is titled Manual fallback; Gate 1 instructs the model directly" — the column IS titled `Manual fallback` (hook-system.md:89-93, verified line-by-line this pass). The dropped row's stated reason holds; nothing new contradicts it.
- **Severity:** no row — re-verified decision only.

### V19 — DOCTOR YAML IS WIRED INTO THE COMMAND SURFACE (verified, positive; closes a round-one residual)

- **Path:line:** `.opencode/commands/doctor/_routes.yaml` + `speckit.md` + `assets/doctor-speckit-presentation.txt` all name `doctor-speckit-retrieval.yaml` (rg); `speckit.md` routes `/doctor speckit-retrieval`
- **Claimed vs actual:** The retrieval doctor is reachable through the actual doctor command surface, not just an YAML sitting in assets — round one's L6 correction note ("the activity did not") is fully closed: signal + activity + wiring all present.
- **Severity:** verified-positive; record only.

### V20 — GENERATOR IS CONSULTED BY MANY SURFACES; LOOKUP BY THE EXPECTED SET ONLY (verified, positive)

- **Path:line:** `rg -ln "generate-trigger-index"` → 15 files including `commands/create/assets/create-skill-{auto,confirm}.yaml`, `commands/speckit/{save.md,assets/save-presentation.txt}`, `commands/doctor/assets/doctor-update.yaml`, `doctor-speckit-retrieval.yaml`, `system-spec-kit/{SKILL.md,README.md}`, `runtime/data/README.md`, `install-guides/README.md`, manual-testing-playbook; lookup consumers: AGENTS.md:83, search.md:45-49, doctor YAML, the five agent docs, `measure-cold-lookup.mjs` (spawns it)
- **Claimed vs actual:** The index is consulted by the documented caller set; the generator is consulted by doc-generation + doctor + save paths. No orphaned claim found (contrast: measure-cold-lookup — still acceptance-only + optional doctor check, correct per L7's fix).
- **Severity:** verified-positive; record only.

### N11 — SAVE-PATH FRESHNESS CLAIM IS AT DOC-LEVEL ONLY IN THE COMMANDS (P2, new evidence on save integration)

- **Path:line:** `.opencode/commands/speckit/save.md` + `assets/save-presentation.txt` reference `generate-trigger-index` (rg) — but check: their wording; `runtime/…/workflow-trigger-index-freshness.vitest.ts` exists (the save-side check round-one cited as workflow.ts:344)
- **Claimed vs actual:** (partially verified) The save command does mention regeneration; the actual freshness gate lives in the runtime workflow tests (`workflow-trigger-index-freshness.vitest.ts` present in tests/) — the per-packet save-time check exists as round one recorded. The command docs' mention is advisory wording, not an executable claim.
- **Severity:** P2 — no contradiction found; recorded to close the loop (round one's F7.2 verified; this pass re-found the same test file).
- **Fidelity note:** I did not re-read `runtime/hooks/lib/…/workflow.ts` line 344 in this pass (round-one's citation); the test file's existence is the fresh evidence. Do not claim line-level re-verification.

## Ruled out this pass

- "Doctor is dead surface": rejected — wired via _routes.yaml + speckit.md + presentation (V19).
- "Lookup executed by a hook": rejected again with the same census (V18) — the L5 drop stands.

## Open questions

1. Since Gate 1's lookup is model-read-the-doc (V18), and repo-rules carry 164 dead phrases (N7) — is the missing mechanical enforcer for GATE 1 the same root cause as the missing enforcer for phrase quality (nothing executes, nothing censuses)? (Synthesis-level question, not a new row.)
