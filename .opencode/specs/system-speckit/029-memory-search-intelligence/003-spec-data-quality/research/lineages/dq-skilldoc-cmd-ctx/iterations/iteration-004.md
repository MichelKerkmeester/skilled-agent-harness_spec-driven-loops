# Iteration 004 — KQ4: CONTEXT-ENGINEERING per-turn assembly DQ

**Focus:** Prompt assets, memory injection, retrieval profiles, resource-map, hook/advisor briefs — the per-turn context-assembly machinery and what automated DQ checks it lacks.

## Findings

### F4.1 — KEYSTONE: THREE copies of the intent-trigger vocabulary drive per-turn assembly, reconciled only by prompt discipline
The decision of *what context to assemble each turn* is governed by an intent-trigger vocabulary that exists in **three independently-maintained copies**:
1. **CLAUDE.md prose** Gate-3 positive triggers (create, add, remove, delete, rename, move, update, change, modify, edit, fix, patch, refactor, rewrite, implement, build, write, generate, configure).
2. **`gate-3-classifier.ts`** typed `FILE_WRITE_TRIGGERS` (`:67-72`) — the machine that actually fires the spec-folder question. Its own comment states "The prose trigger lists in those docs remain as human-readable references" (`:9`) — i.e. copies 1 and 2 are hand-synced. `[SOURCE: gate-3-classifier.ts:4-9,67-72]`
3. **advisor `prompt-policy.default.json`** `WORK_INTENT_VERBS` (add, analyze, build, change, check, configure, create, debug, delete…) — the machine that fires the advisor brief per turn. `[SOURCE: prompt-policy.default.json sets.WORK_INTENT_VERBS]`
- The three **diverge by design**: gate-3 *intentionally omits* `analyze`/`decompose`/`phase` because they false-positive on review prompts (`gate-3-classifier.ts:149-151`), while prompt-policy *includes* `analyze`. So "analyze X" assembles different context under the two gates — and **nothing asserts which divergences are intentional vs drift.**
- **Granular feature (net-new, highest-value context-eng lever):** an on-write coherence gate diffing the three trigger vocabularies, with an explicit allow-list of sanctioned divergences (e.g. `analyze` ∈ advisor-only). Any *unlisted* delta fails. This is the per-turn-assembly analogue of the cross-skill coherence check (F2.1) and bypasses the truncation floor entirely (it governs assembly, not retrieval).

### F4.2 — The per-turn hook/advisor injection contract is validated by a MANUAL playbook, not an on-write test
`skill_advisor_hook_validation.md` is explicitly a "Manual validation playbook" run "after changing any runtime hook registration, any advisor MCP handler, the OpenCode plugin-helper bridge, or the shared render/threshold contract." It verifies shared-render parity, `thresholdSemantics`, prompt-safe accepted/corrected/ignored telemetry, durable JSONL diagnostics, runtime parity, and the disable-flag rollback. `[SOURCE: skill_advisor_hook_validation.md:1-40]`
- **Granular feature:** promote the playbook's mechanical assertions (render parity across runtimes, threshold-semantics presence, prompt-safe telemetry totals) into an **automated on-write contract test** fired when the hook brief / shared render / threshold contract changes. The assertions are already specified; only the manual→automated conversion is missing.

### F4.3 — Prompt-pack templates and retrieval profiles HAVE unit tests, but no authored-asset drift gate
`renderPromptPack` (`deep-loop-runtime/lib/deep-loop/prompt-pack.ts`) renders the `.md.tmpl` assets (deep-research, deep-review, ai-council), and `prompt-pack.vitest.ts` + `retrieval-profile.vitest.ts` exist. `[SOURCE: find prompt_pack + retrieval-profile.vitest.ts]`
- **Granular gap:** these are *build-time unit tests on the renderer*, not *authored-asset DQ gates on the `.md.tmpl` content*. No check asserts every `{placeholder}` in a template is supplied by the renderer (and vice-versa) — a template-placeholder coherence gate. A new `.md.tmpl` or a renamed placeholder silently breaks assembly until a runtime failure. **Granular feature:** an on-write template↔renderer placeholder-parity check over the prompt-pack assets.

### F4.4 — resource-map coverage is a per-packet gate, not a context-asset corpus gate
The `resource_map_present` flag and coverage-gate concept exist only inside the deep-research packet contract (`ENV_REFERENCE.md`, deep-research SKILL.md), governing exclusion-set hints for one research run. `[SOURCE: grep resource_map_present → spec-kit packet scope only]`
- **Granular feature:** a corpus-level resource-map freshness check — assert each packet's `resource-map.md` (when present) still reflects on-disk files (no stale/missing entries), the context-assembly analogue of the skill-graph drift gate (F1.2).

## Dead Ends / Ruled Out
- **Assuming the three trigger vocabularies are auto-synced** — the classifier comment confirms prose copies are hand-maintained "human-readable references." `[SOURCE: gate-3-classifier.ts:9]`
- **Treating existing vitest coverage as authored-asset DQ** — they test the renderer/profile code, not the `.md.tmpl`/policy-JSON content drift. `[SOURCE: prompt-pack.vitest.ts location under tests/]`

## Assessment
- **newInfoRatio:** 0.78 — the triple-copy trigger vocabulary and the manual-playbook hook contract are specific, novel context-engineering DQ levers absent from all prior lineages.
- **Novelty justification:** identifies the exact per-turn assembly decision surfaces (trigger vocab ×3, hook contract, template placeholders, resource-map freshness) and the reuse-first conversion for each.
- Questions answered: KQ4.
