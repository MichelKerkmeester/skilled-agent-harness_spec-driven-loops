# Iteration 017 — Traceability A8-deepen (gemini-removal dangling refs — settle severity)

## Dispatcher
- **Run:** 17 (dispatch slot — parallel fan-out). Per the established parallel-safety pattern (see iter-009 §Dispatcher / Edge Case 1), this leaf wrote ONLY `iterations/iteration-017.md` + `deltas/iter-017.jsonl`. Did NOT append to/modify `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, or `deep-review-config.json`.
- **Mode:** review (READ-ONLY — settle/refine prior findings, no code modification).
- **Dimension:** traceability
- **Angle:** A8-deepen — settle F-A8-01 (dangling `.gemini/agents/` refs in Claude/Codex mirrors after gemini-removal commit `8683890935`) and re-assess F-A8-02 (`_NOTE_HF_EMBED_SOCKET` single-owner-invariant note missing from `.codex/config.toml` + `.devin/config.json`).
- **Budget profile:** adjudicate (target 8-10 tool calls; used ~9).
- **Review target:** current live tree + `git show 8683890935 --name-only` (gemini-removal commit), within the `a9e9bdb0a5^..HEAD` range.
- **Read first (per dispatch):** `iterations/iteration-009.md` (F-A8-01, F-A8-02 originals — both filed P2 there).

## Files Reviewed
- `.claude/agents/orchestrate.md:21` — the flagged worst-case "Gemini profile reads `.gemini/agents/`" routing directive (read lines 1-45 for full surrounding context: frontmatter, Path Convention line 19, Runtime Directory Resolution line 21, dispatch mechanism line 23).
- `.claude/agents/{orchestrate,deep-review,prompt-improver}.md` + `.codex/agents/{deep-review,prompt-improver}.toml` + `README.txt` — exact `.gemini/agents` hit enumeration (grep).
- `.codex/agents/orchestrate.toml` — checked for the same dangling line (it has NONE).
- Consumption surfaces: grepped all `*.cjs|*.js|*.ts|*.sh|*.json|*.toml` for any code that reads/parses/loads `.claude/agents/*.md` as routing data or resolves an agent dir by profile, and for any reader of `.gemini/agents`.
- `git show 8683890935 --name-only` filtered to `.claude/agents/` / `.codex/agents/` (empty = mirrors not re-synced).
- `.gemini` directory existence (gone) + any Gemini agent-runtime/profile registration in configs.
- MCP configs `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.devin/config.json` — `_NOTE_HF_EMBED_SOCKET` presence AND the actual `HF_EMBED_SERVER_URL` socket values for mk-spec-memory vs mk_skill_advisor.

## Findings — New
(No NEW findings. This iteration SETTLES/refines two prior P2 advisories. Both remain P2 with strengthened evidence; F-A8-01's P1-vs-P2 question is decisively resolved at P2.)

### P0 Findings
None.

### P1 Findings
None. (See Settled Verdicts below: the F-A8-01 P1 hypothesis — "a live router that would fail/misroute" — is REFUTED. No runtime parses `.claude/agents/orchestrate.md:21` as routing data; the Gemini branch is unselectable.)

### P2 Findings
None new. F-A8-01 and F-A8-02 are carried forward from iter-009 at P2 with the refinements below.

## Settled Verdicts (the dispatch question)

### F-A8-01 — `.claude/agents/orchestrate.md:21` "Gemini profile reads `.gemini/agents/`" → **SETTLED P2 (inert doc drift), NOT P1.**

Reachability adjudication (Hunter → Skeptic → Referee):

1. **Is line 21 parsed by any runtime/agent-router as routing data?** — NO. Grep across all `*.cjs|*.js|*.ts|*.sh|*.json|*.toml` (excluding `.git`/`node_modules`/`.worktrees`/`specs`) found ZERO code that reads/parses `.claude/agents/*.md` to resolve an agent directory by profile, and ZERO code that reads `.gemini/agents`. The only programmatic consumers of `.claude/agents/*.md` are (a) the Claude Code runtime, which loads each file as an agent *definition* (system prompt) keyed on its YAML frontmatter `name:` — it does not execute prose line 21 as a path-resolution routine; and (b) test/playbook scripts that `require_path`/`copy_file` specific named files (`setup-cp-sandbox.sh`, `multi-ai-council-runtime-parity.vitest.ts:55` reads frontmatter only). None act on line 21.
   - `[SOURCE: grep "\.claude/agents" across code = only test/playbook + frontmatter reads]`
   - `[SOURCE: grep "\.gemini/agents" across code = 0 code hits; only the 7 mirror/doc lines]`

2. **Could an LLM orchestrator (reading line 21 as an instruction) ever SELECT the Gemini branch?** — NO, under any non-Gemini runtime. Line 21's own rule is *"Choose the active runtime directory once per workflow."* When `.claude/agents/orchestrate.md` is the loaded definition, the active runtime is Claude → the LLM selects `.claude/agents/`. The Gemini clause is a dead branch that only a live Gemini agent harness loading `.gemini/agents/orchestrate.md` could select — and that file, the entire `.gemini/` dir, and any Gemini harness no longer exist (`ls .gemini` → "No such file or directory"; commit `8683890935` deleted it).
   - `[SOURCE: .claude/agents/orchestrate.md:21 — "Choose the active runtime directory once per workflow"]`
   - `[SOURCE: ls .gemini → No such file or directory]`

3. **Is any Gemini AGENT-RUNTIME/profile wired anywhere?** — NO. `opencode.json` has no gemini; no `agent_router` file carries profile→dir logic; no config registers a Gemini agent profile/runtime/agent-dir. The only "Gemini" runtime mentions in scope are the cli-opencode *executor* causal-summary (`cli-opencode/graph-metadata.json:203`) and the `.codex/agents/deep-review.toml:260` mirror row — the executor route was already RULED OUT in iter-009 (external Gemini binary is intentionally supported), and the mirror row is part of F-A8-01 itself.
   - `[SOURCE: grep -niE "gemini.*(profile|runtime|agent.?dir)" across configs = 0 agent-profile registrations]`

4. **Skeptic challenge (severity inflation check):** The dispatch framed line 21 as "an ACTIVE routing directive pointing at a deleted dir." It IS active *prose*, but "active" ≠ "reachable." For P1 ("a live router that would fail/misroute") there must exist an execution path that, under a runtime that actually runs, resolves `.gemini/agents/` and fails. No such path exists: (i) no code resolves it; (ii) no LLM under Claude/Codex/OpenCode selects the Gemini branch; (iii) the only selector (a Gemini harness) is deleted. The directive cannot fire → it cannot misroute → it cannot crash. It is inert.
   - **Referee verdict:** P2 (doc/config drift in a READ-ONLY downstream mirror). Confirmed at the P2 floor for mirror-only drift. Would rise to P1 ONLY if a live Gemini agent-runtime were re-wired to resolve agents from `.gemini/agents/` — which would itself be a separate, larger regression, not this line.

5. **`.codex/agents/orchestrate.toml` cross-check:** It exists but contains NO Gemini directory-resolution line, so the Codex orchestrate mirror is already clean on this specific worst-case. F-A8-01's orchestrate hit is confined to the Claude mirror. The remaining Codex hits (`deep-review.toml:260`, `prompt-improver.toml:54`, `README.txt:8`) are list/table mirror rows, not routing directives — strictly inert.

**Disposition:** F-A8-01 stays **P2**, severity question CLOSED. Evidence strengthened: explicitly proven non-reachable. Remediation remains the mirror-regen recommendation (drop the Gemini row/column when `.claude/.codex` agent mirrors are re-synced post-removal). Hand to the maintainability/dead-code pass (iter 12-13).

### F-A8-02 — `_NOTE_HF_EMBED_SOCKET` missing from `.codex/config.toml` + `.devin/config.json` → **SETTLED P2; operator mis-run risk is LOW (invariant satisfied in fact).**

New decisive evidence beyond iter-009: the prose note is absent, BUT the operationally load-bearing VALUE it documents is already correct and identical in both configs.

- Both configs DO co-host the two socket owners (so the invariant is in-scope, refuting iter-009's "maybe notApplicable" hedge): `.codex/config.toml` has 5 spec-memory + 7 skill-advisor refs; `.devin/config.json` has 4 + 6.
  - `[SOURCE: grep counts in .codex/config.toml, .devin/config.json]`
- The actual single-owner pin — `HF_EMBED_SERVER_URL` — is set to the IDENTICAL value for both services in BOTH configs:
  - `.codex/config.toml:67` (mk-spec-memory) = `unix:///tmp/mk-hf-embed/hf-embed.sock`; `.codex/config.toml:108` (skill-advisor) = `unix:///tmp/mk-hf-embed/hf-embed.sock` — IDENTICAL.
  - `.devin/config.json:16` (mk-spec-memory) = `unix:///tmp/mk-hf-embed/hf-embed.sock`; `.devin/config.json:43` (skill-advisor) = `unix:///tmp/mk-hf-embed/hf-embed.sock` — IDENTICAL.
  - `[SOURCE: .codex/config.toml:67,108; .devin/config.json:16,43]`

**Operator mis-run assessment:** The single-owner invariant ("both services consume ONE resident nomic server via the shared socket") is ALREADY SATISFIED IN FACT in both configs — the two `HF_EMBED_SERVER_URL` values are the same string. To "mis-run a second model-server owner" an operator would have to actively EDIT one of two already-identical, visibly-adjacent values to diverge them. The missing `_NOTE_HF_EMBED_SOCKET` removes only the *explanatory warning* against doing so; it does not remove the correct value and does not create a divergence. Risk = LOW (advisory documentation gap, not a latent misconfiguration).

**Disposition:** F-A8-02 stays **P2** (advisory `_NOTE_` parity gap). Severity unchanged; risk now characterized as low because the invariant holds in the actual config values. Recommendation: fan the canonical `_NOTE_HF_EMBED_SOCKET` (and `_NOTE_TOTAL_MCP_BUDGET`) into the codex/devin configs during MCP-config maintenance for parity + future-edit protection. Promote to P1 ONLY if the two socket values were ever found diverged (they are not).

## Traceability Checks
- **gemini-removal completeness (re-confirmed):** `.gemini/` fully deleted; commit `8683890935 --name-only` touched no `.claude/agents/`|`.codex/agents/` files → 7 mirror/doc refs are confirmed un-resynced drift. Canonical machine source (`runtime_capabilities.json`) confirmed clean in iter-009 (not re-walked here — adjudicate scope).
- **Reachability proof (new):** No code resolves agent dir by profile; no code reads `.gemini/agents`; no Gemini agent-runtime/profile is registered. Line 21 Gemini branch is unselectable.
- **Config-value invariant (new):** `HF_EMBED_SERVER_URL` identical for mk-spec-memory and skill-advisor in BOTH codex + devin configs → single-owner invariant satisfied in fact despite the missing prose note.

## Integration Evidence
- **Agent runtime mirrors** (`.claude/agents/`, `.codex/agents/`): inspected READ-ONLY as downstream packaging surfaces per agent contract. F-A8-01 confined to mirror rows; `.codex/agents/orchestrate.toml` clean of the worst-case line. Not modified.
- **Claude Code agent-definition loader** (frontmatter-keyed system-prompt loader): identified as the only programmatic consumer of `.claude/agents/*.md`; it does not execute prose line 21 as path resolution. Named per integration-naming gate.
- **MCP config fan-out** (`opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.devin/config.json`): inspected for `_NOTE_HF_EMBED_SOCKET` presence AND the actual `HF_EMBED_SERVER_URL` socket values. F-A8-02 = prose-only gap; values correct.

## Edge Cases
1. **Iteration-number vs JSONL-derived (dispatch 17 vs committed JSONL count):** Parallel fan-out — dispatch owns slot assignment; committed `state.jsonl` lags and is the orchestrator's to reconcile, not this leaf's. Honored dispatch slot 017 per the parallel-safety directive; did NOT append to `state.jsonl`. Same expected mismatch recorded in iter-009 Edge Case 1.
2. **"Active" vs "reachable" semantics:** The dispatch called line 21 an "ACTIVE routing directive." Adjudicated the distinction explicitly: it is active prose but non-reachable execution. Resolved toward reachability (the P1/P2 hinge) rather than the surface "active" wording, to avoid severity inflation.
3. **cli-opencode "Gemini runtime" causal-summary (`cli-opencode/graph-metadata.json:203`):** Refers to the external Gemini CLI *executor* (intentionally supported), NOT a Gemini *agent-runtime* that loads `.gemini/agents/`. Disambiguated to avoid a false dangling-ref hit; consistent with iter-009's executor-vs-skill ruling.
4. **Canonical machine sources not re-walked:** `runtime_capabilities.json` cleanliness was established in iter-009; not re-verified here (adjudicate budget, no contradicting evidence surfaced). Carried forward as-is.

## Confirmed-Clean Surfaces
- **Agent-dir profile resolution code path:** clean — none exists; line 21 is inert prose, not executed routing.
- **`.codex/agents/orchestrate.toml`:** clean of the worst-case Gemini directory-resolution line (no gemini ref at all).
- **codex/devin `HF_EMBED_SERVER_URL` single-owner pin:** clean — both services pinned to the identical socket value in both configs; invariant satisfied in fact.
- **`.gemini/` directory:** clean removal — fully deleted, no residual dir.

## Ruled Out
- **F-A8-01 as P1 ("live router that fails/misroutes"):** RULED OUT — no code resolves the path, no LLM under a non-Gemini runtime selects the Gemini branch, no Gemini harness exists. Do not retry as P1 unless a live Gemini agent-runtime is re-wired.
- **cli-opencode Gemini-runtime causal-summary as a dangling agent-dir ref:** RULED OUT — external executor reference, intentional (consistent with iter-009).
- **F-A8-02 as a latent misconfiguration:** RULED OUT — the actual `HF_EMBED_SERVER_URL` values are already identical across both services in both configs; gap is documentation-only.

## Next Focus
- **Dimension:** traceability (A8 now fully settled — A8-deepen complete this iter).
- **Focus area:** maintainability iter 12-13 (dead-code + mirror-regen + config-fan-out recommendation) should absorb the now-settled F-A8-01 (P2) + F-A8-02 (P2) as concrete remediation items: (a) re-sync `.claude/agents/` + `.codex/agents/` mirrors to drop the deleted-`.gemini/agents/` rows; (b) fan `_NOTE_HF_EMBED_SOCKET` + `_NOTE_TOTAL_MCP_BUDGET` into codex/devin configs.
- **Reason:** Both A8 findings are decisively at the P2 floor with reachability/invariant proofs; no further traceability deepening is warranted for A8.
- **Rotation status:** traceability — A7 (iter 7/8), A8 (iter 9 + this deepen), A9 (changelog accuracy) remain per charter for the rotation.
- **Blocked/productive carry-forward:** Productive — F-A8-01 + F-A8-02 ready as remediation inputs; no open P1 hypothesis remains on A8. The `_NOTE_2_TOOLS` 37-tool claim vs `tool-schemas.ts` is still A7's job (not touched here).
- **Required evidence (for the maintainability remediation pass):** mirror-regen step that re-syncs `.claude/.codex` agents post-canonical-edit; config-maintenance step that fans the canonical `_NOTE_*` set into `.codex/config.toml` (TOML form) + `.devin/config.json`.
