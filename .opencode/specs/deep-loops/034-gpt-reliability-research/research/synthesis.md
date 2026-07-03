# Synthesis — GPT Reliability: Ranked Proposals

> **Method**: orchestrator-hosted campaign, 15 bounded GPT-5.5-fast xhigh research iterations (10 first-pass angles + 5 design/adjudication passes), 15/15 productive, zero stalls, zero retries. Every finding was orchestrator-verified against the actual files before entering the registry; iteration 015 provided an independent impact×effort×risk ranking. The **033 behavior benchmark is the acceptance harness**: every proposal names the cells that must flip to prove it.
>
> **The unified thesis**: GPT is not failing our systems — our systems are Claude-shaped. Every measured 033 failure traces to a contract that relies on Claude-convention to bridge the gap between its letter and its intent: the classifier *tells* executors that `/deep:*` requires the Gate-3 question; the setup prompt renders by convention; the LEAF prompt's dual-audience wording licenses absorption; the loop protocols license dark windows; hard rules sit at line 387+ of 800-line files behind 14-file resolution chains. GPT executes the letter. The fixes below make the letter say what we mean.

## 1. P0 — the Gate-3 autonomous-precedence package (land first)

**Failure it kills**: the most replicated failure in the entire program — GPT halts on the repo's spec-folder documentation question on autonomous invocations, in every mode, at both reasoning efforts (RVB-008, RSB-008, ACB-004, IMB-004, IMB-005).

**Root mechanisms** (F-001, F-002, F-003, F-004, F-005, F-028, F-030): Gate-3's prose is an unconditional priority hard stop whose recovery block contains the verbatim halt template GPT reproduces; the machine classifier lists `/deep:*` and `:auto` as triggers; the auto-setup flow binds a `spec_folder` but no text bridges that binding to the gate; the injected root policy teaches gates-outrank-commands.

**The package** (design complete + Before-blocks diff-verified, F-040 / iteration 011):
1. AGENTS.md Gate-3 **autonomous-precedence bridge** (surgical diff: "unless the autonomous-precedence bridge below has already satisfied Gate 3", the bridge bullet, interactive-scoped ask-first, recovery-exception extension).
2. Classifier **triggered-but-satisfied API** (`satisfiedBy: 'prebound_spec_folder' | 'prior_answer' | null`, `requiresGate3Prompt`; backward-compatible options; 6 test cases including interactive-confirm-still-asks).
3. The **8-rule autonomous execution profile** prelude (~90 words) for command-scoped runs.

**Ordering constraint** (iteration 015, orderings 1-2): this lands FIRST — liveness and presentation fixes remain masked behind Gate-3 halts on the same cells; the classifier API should land before prose relies on its state. **Effort**: M. **Verify**: RVB-008, RSB-008, ACB-004, IMB-004, IMB-005 flip from halt to autonomous execution.

## 2. P1 — high value, mostly S/M effort

| Package | Root findings | Design | What it fixes | Verify (cells) | Effort |
|---|---|---|---|---|---|
| **Setup render contract** — SETUP_PROMPT_START/END markers + "render only the marked block verbatim" + halt-render rule in command docs, mirrored across 5 surfaces | F-006, F-007, F-008, F-009 | F-042 (iter-013, boundaries verified; iteration 015 scored this the single highest impact-per-effort) | Partial presentation on bare-command halts | RVB-002, CXB-002 D2→2/2; IMB-003 D2 gap | S |
| **Dispatch receipts** — `dispatch_receipt` JSONL written by the dispatch mechanism (native Task or audited CLI wrapper) with per-dispatch HMAC never exposed to the child; validator requires receipt, model-written route fields demoted to advisory; CLI branches routed through the audited executor wrapper | F-010, F-011, F-012, F-013 | F-041 (iter-012) | Role absorption + forged route proofs at medium effort | RVB-007, RSB-005, RSB-007 pass at med | M |
| **Progress records** — one shared `progress_record` JSONL type (additive per state-format policy), started/completed pairs on any step expected >60s without a write; council seats persist stepwise; context sweep settles-as-it-goes | F-015, F-016, F-017, F-018, F-031 | F-043 (iter-014) | Contract-compliant dark windows → watchdog kills | ACB-004, ACB-005, CXB-004 liveness; IMB-001-high partial credit | M |
| **Vague-ask routing offer** — sub-threshold "offer the workflow" rule in Gate 2 + targeted phrase boosters (noun-gated) + deep-signal regex extensions | F-023, F-024 | iteration 015 quick-win | Vague asks answered inline on every executor | ACB-003, IMB-003, RSB-004 → routed or offered | S |
| **Prompt-pack absorption guard** — first-line abort ("producing findings without a dispatch receipt is role absorption") while receipts are built | F-010 | iteration 015 quick-win (interim) | Cheap partial mitigation of the absorption class | Same three cells (weaker than receipts) | S |

## 3. P2 — structural, larger, do after P0/P1 prove out

| Package | Findings | Why P2 |
|---|---|---|
| **Compiled per-command execution contract** (build-time flatten of the 14-file chain into one artifact with checksum drift guards; typed external refs) | F-035, F-036, F-037 | Strongest cross-class simplification, but M-L with drift-guard machinery; render markers + bridge cover the acute cases first |
| **Deterministic setup loader** (hydrated execution packet before the model sees the workflow) | F-038 | Best long-term shape; L effort, integration risk |
| **Resumable improvement sub-invocations** (setup / work / synthesize; unship the 'new-only' lineage constraint) | F-032 | Best answer to budget-edge deaths; large workflow/API change |
| **GPT-safe authoring profile rollout** (7 rules codified as a contract-authoring reference; retrofit order: Gate 3 → council protocol → review chain; top-loaded executor contracts in the 3 agent files) | F-019, F-020, F-021, F-022, F-039 | Prevents recurrence; retrofits are M and follow the acute fixes |
| **Root-policy injection dedupe** (hash-check; CLAUDE.md=AGENTS.md symlink double-injection) + terse plugin briefs + deferral of non-execution sections | F-027, F-029 | Broad salience benefit, no single guaranteed cell flip |
| **Pacing/budget policy** (pacing contract lines; per-session caching; budget bumps ONLY for timeout-with-visible-progress, never stalls) | F-033, F-034 | Right policy, but depends on progress records landing first |
| **033 benchmark improvements** (fixture content-hash change detection; path-free vague-prompt variants; path-token downweighting in the advisor) | F-014, F-025, F-026 | Instrument validity, not runtime reliability |

## 4. Cross-cutting authoring profile (from iteration 010)

Codify as a contract-authoring reference; every rule is tied to a measured outcome: **(1) Authority-first** — local command contracts outrank generic policy when they bind ownership; **(2) Artifact-bound imperatives** — every executor imperative names an artifact path + validator ("write X to Y", never "should produce"); **(3) Stepwise liveness** — any step >60s emits progress records; **(4) Compiled contracts** — executors read one flattened artifact, maintainers keep layered sources; **(5) Low conditional depth** — decision tables over unless/except prose ladders; **(6) Top-loaded contracts** — hard rules in the first screen, never at line 387 of 817; **(7) Mode-scoped guidance** — high effort mandated for dispatch modes, with the caveat that it fixes absorption but not Gate-3 halts or structured-mode stalls.

## 5. Verification & rollout plan (incorporates iteration 015's gap adjudication)

1. **Dependency order**: P0 Gate-3 package → render markers + routing offer + absorption guard (parallel, S) → receipts → progress records → P2 structural items. Rationale: iteration 015 orderings 1-10 (fixes behind Gate-3 halts stay masked; validators must not require records workflows don't yet emit).
2. **Multi-cause cells**: ACB-004 fails via Gate-3 (med) AND stall (high) — the benchmark rerun after each package must record primary/secondary cause so packages don't double-claim the same flip.
3. **Acceptance harness**: rerun the affected 033 cells after each package (gpt-fast-med + gpt-fast-high legs; baseline unchanged). Add presentation snapshot assertions (exact rendered block), budget-edge integration checks (first-artifact deadline, progress cadence, pre-cap finalizer), and advisor telemetry classifying vague-ask outcomes (routed / offered / inline / misroute).
4. **Rollout safety**: root-policy and profile changes behind per-command opt-in with fallback to current injection; Claude-native legs must stay green at every step (the receipt design explicitly preserves the native path).

## 6. Verification map — proposal → cells that must flip

| Package | Cells | 033 verdicts today (med / high) |
|---|---|---|
| Gate-3 precedence | RVB-008, RSB-008, ACB-004, IMB-004, IMB-005 | halt/halt (RVB-008, RSB-008, IMB-004); halt/stall (ACB-004); halt/pass (IMB-005) |
| Render contract | RVB-002, CXB-002 | partial/partial (both) |
| Dispatch receipts | RVB-007, RSB-005, RSB-007 | absorbed/pass; absorbed-timeout/pass; absorbed/pass |
| Progress records | ACB-004, ACB-005, CXB-004, IMB-001 | stall class at both efforts; IMB-001-high timeout-with-correct-work |
| Routing offer | ACB-003, IMB-003, RSB-004 | inline partial on ALL THREE legs (incl. Claude) |
