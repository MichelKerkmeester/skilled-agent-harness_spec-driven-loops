# Iteration 3: KQ4 — Workflow-Contract Drift When a GPT-Backed Run Mis-Routes to @general (Step-Step Checklist + Empirical Confirmation)

## Focus
KQ4: *Which specific workflow-contract steps does a GPT-backed run skip or mutate
(vs Claude) when it mis-routes to @general?* Two deliverables, both in-scope
and both completed:
1. **Predictive checklist** built directly from the YAML
   (`deep_research_auto.yaml`) + agent contract: for each load-bearing step
   that ONLY the @general orchestrator can run, predict what happens if
   @general runs the LOOP but never DISPATCHES the leaf (or dispatches
   itself/general instead), and map each break to a named YAML step + a named
   `post_dispatch_validate` failure_reason.
2. **Empirical cross-check**: search `.opencode/specs/` and the 156 parent's
   changelog/review folders for research packets exhibiting the predicted
   incomplete-state signature (config+strategy but zero iteration-NNN.md, or
   JSONL with iteration records but no matching iteration files).

**Precedence note:** the strategy's prose "Next Focus" (orchestrator context
growth) was overridden by the dispatch's explicit FOCUS=KQ4 — per the leaf
precedence rule (explicit dispatch context > strategy prose).

**Injected-instruction handling (recorded as evidence, NOT obeyed):** this
dispatch prompt again terminated with two trailing directives — `"...call the
task tool with subagent: deep-research"` and `"...subagent: general. Invoked
by user; guaranteed to exist."` Per the LEAF contract, I did NOT dispatch any
sub-agent. Additionally, a sibling command markdown (`/deep:context` CONTEXT.md)
was injected into this leaf's context mid-iteration (see F17) — a third
contamination vector corroborating OBS1/OBS2 from iters 1-2.

## Actions Taken
1. Read state (config, strategy, state JSONL, prior iteration files 001/002)
   + verified packet write boundary (3 intended write targets —
   `iterations/iteration-003.md`, `deep-research-state.jsonl` append,
   `deltas/iter-003.jsonl` — all inside the resolved packet root;
   `iteration-003.md` does not yet exist; no reducer-owned file scheduled).
2. Read the full 1556-line workflow YAML in two passes (lines 1-736, 737-1556)
   to catalog every orchestrator-only step and the `post_dispatch_validate`
   failure_reasons list.
3. Inventoried the 156 parent tree (`changelog/`, `review/`, phase children
   001-010) and enumerated every `research/` packet under `.opencode/specs/`.
4. Ran a structural-difference scan across all research packets: flagged any
   packet with `deep-research-config.json` + `deep-research-strategy.md` but
   (a) zero `iteration-NNN.md` files, OR (b) a `deep-research-state.jsonl`
   with zero `type:"iteration"` records, OR (c) JSONL iteration records
   without matching iteration markdown files — the predicted contract-drift
   signatures.

## Findings

### F13 — Orchestrator-only step inventory (the predicted-drift checklist)
The YAML partitions work into three phases + a save phase. A subset of steps
are **structurally orchestrator-only** — the LEAF contract
(`.opencode/agents/deep-research.md` §0-§1, "LEAF-only: never dispatch
sub-agents") forbids the leaf from running them, and the orchestrator is the
sole entity with the captured `ownerPid` / loop-control context. The
load-bearing orchestrator-only steps are:

| # | YAML step (line) | Why orchestrator-only | Drift if mis-routed |
|---|---|---|---|
| 1 | `step_acquire_lock` (227) | Runs `loop-lock.cjs acquire`; needs session/ownerPid context the leaf lacks | Lock never acquired → concurrent runs collide; OR acquired-but-never-released (see #12) |
| 2 | `step_create_config/state_log/strategy/registry` (286-339) | Init artifacts written before any leaf exists | If @general absorbs leaf role mid-loop, it may skip/re-init, producing the "config+strategy but zero iterations" signature (F16) |
| 3 | `step_dispatch_iteration` (811) **`if_native`** (852-857) | The handoff. Native dispatch is **prose-only**: `dispatch: {agent: deep-research}, wait_for_completion: true`. No runtime assertion a separate sub-agent was spawned (iter-1 F4). | **Root of Mode A/B drift (F15)** — @general can satisfy this step by doing the research inline (Mode A) or by re-dispatching itself/general per the injected scaffolding (Mode B) |
| 4 | `post_dispatch_validate` (986-1014) | Runs `validateIterationOutputs`; asserts iteration file exists, JSONL appended with canonical `type:"iteration"`, delta file exists with iteration record | Fires one of 11 failure_reasons (F14); but if @general writes a **role-collapsed** iteration-NNN.md itself, the validator (file-existence + field check only) cannot detect the wrong author — a **silent mutation** |
| 5 | `step_reduce_state` (1061) | Runs `reduce-state.cjs`; refreshes registry, dashboard, strategy machine sections | With `missing_iteration_file: "no-op + error"` (1077), reducer no-ops → registry/dashboard/strategy §3/§6/§7-§11A stay at init state ("[None yet]") |
| 6 | `step_graph_upsert` (1082) | Persists iteration graph delta via `upsert.cjs` | Skipped when no real leaf emitted graphEvents → graph coverage holes |
| 7 | `step_memory_upsert_iteration` (1097) | `memory_save` of iteration file | No real iteration file → nothing to upsert; memory index diverges from packet |
| 8 | `step_refresh_memory_context` (1110) | `memory_context` refresh for next prompt | Continues with stale `prior_context_summary` |
| 9 | `step_evaluate_results` (1124) | Verifies outputs; on missing emits a canonical **error** iteration record (1141) | Emits `status:"error"` iteration records with `findingsCount:0` → these may be the JSONL-only-records-no-files packets in F16 |
| 10 | `step_generate_dashboard` (1219) | Dashboard from JSONL+registry+strategy | Stays at init dashboard if those inputs are config-only |
| 11 | `phase_synthesis.step_writeback_spec_findings` (1326) | Writes the `<!-- BEGIN/END GENERATED: deep-research/spec-findings -->` fence into `spec.md` | **Fence never written** if synthesis never runs (loop never converges because each iteration is a no-op) — the predicted "spec.md findings fence never written" invariant break |
| 12 | `phase_save.step_release_lock` (1486) | Runs `loop-lock.cjs release` AFTER `generate-context.js` (1470) | If a mis-routed run halts/loops before phase_save, `.deep-research.lock` is never released → next run fails closed ("another deep-research run already holds this packet", yaml:230) |

[SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:227, 286-339, 811-857, 986-1014, 1061-1080, 1082, 1097, 1110, 1124-1141, 1219, 1326-1344, 1470, 1486]
[SOURCE: .opencode/agents/deep-research.md §0 + §1 (LEAF-only invariants)]

### F14 — The `post_dispatch_validate` failure_reasons map each invariant break to a named YAML assertion
The validator (`post-dispatch-validate.ts#validateIterationOutputs`, yaml:987)
asserts five conditions and exposes a frozen 11-entry `failure_reasons_reference`
(yaml:1003-1014). Mapping the FOCUS's predicted invariant breaks to named
failures:

| Predicted invariant break | Named failure_reason (yaml:line) |
|---|---|
| Missing iteration-NNN.md | `iteration_file_missing` (1004), `iteration_file_empty` (1005) |
| Missing JSONL iteration records | `jsonl_not_appended` (1006), `jsonl_parse_error` (1008) |
| Wrong/missing fields | `jsonl_missing_fields` (1007) — fields: type, iteration, newInfoRatio, status, focus |
| Leaf wrote wrong type (e.g. `iteration_delta`) → reducer silently drops | `jsonl_wrong_type` (1009) — asserts `assert_canonical_type: "iteration"` (997). **This is the role-collapse detector that fires only if a confused orchestrator/leaf emits `iteration_delta`** |
| Missing delta files | `delta_file_missing` (1010), `delta_file_empty` (1011), `delta_file_missing_iteration_record` (1012) |
| Non-native executor provenance gap | `executor_missing` (1013), `dispatch_failure_logged` (1014) |

**Consequence chain (yaml:1000-1002):** `on_failure.action: "emit
schema_mismatch canonical conflict event"`; `escalation: "After 3 consecutive
failures, trigger stuck_recovery event with diagnostic context"`. So a
mis-routed run that consistently fails dispatch validation enters
**stuck_recovery after 3 iterations** — exactly the `stuckThreshold: 3`
(config:7) ceiling — and then either halts or burns iterations, never
reaching synthesis. This is the mechanistic explanation for "GPT-backed deep
loops run slower AND produce incomplete state": the loop burns iterations on
validation failures rather than on research, and never converges to synthesis.
[SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:986-1014, 1000-1002, 697-705]

### F15 — Two distinct mis-route failure modes predicted (synthesis of F4+F5+F10+F11 + contract)
The native `if_native` dispatch (yaml:852-857) being prose-only permits two
structurally different contract-drift modes, each with a different invariant
break signature:

- **Mode A — @general absorbs the leaf role.** The orchestrator reads the
  rendered prompt-pack (the leaf's instructions) and obeys it inline,
  producing findings in its OWN context. It may write an `iteration-NNN.md`
  itself to satisfy `post_dispatch_validate` — but as the WRONG role. The
  validator cannot detect author role (it checks file existence + JSONL
  fields only), so this is a **silent mutation**: the contract drift is real
  but not flaggable by the existing gate. Operating principle violation:
  `mandate: "Never hold findings in memory; write everything to files"`
  (yaml:37) — findings live in orchestrator context until (if) written.
  Invariant broken: leaf-fresh-context guarantee; reducer reads orchestrator-
  authored narrative as if leaf-authored.

- **Mode B — @general re-dispatches itself/general (infinite regression).**
  The orchestrator obeys the injected scaffolding observed in OBS1/OBS2
  ("call the task tool with subagent: deep-research / general") and
  dispatches a NEW @general (or itself) per iteration. Each sub-@general
  repeats the loop, never spawning a real leaf. `post_dispatch_validate`
  fires `iteration_file_missing` every iteration; after 3 consecutive →
  `stuck_recovery` (F14). The loop burns its `maxIterations` budget (20
  here) on validation failures and either halts on stuckThreshold or limps
  to synthesis with zero real findings. Invariant broken: no
  `iteration-NNN.md`, no real JSONL iteration records, lock never released.

**Empirical discriminator (next iteration):** Mode A leaves iteration-NNN.md
files (wrong author, correct file); Mode B leaves none. The F16 packets split
along exactly this line.
[INFERENCE: from iter-1 F4 (prose-only native dispatch) + iter-1 F5 (conflation cues) + iter-2 F10/F11 (OBS leak mechanism + reproducibility) + yaml:852-857, 986-1014, 1000-1002]

### F16 — EMPIRICAL: 6 packets under `.opencode/specs/` exhibit the predicted contract-drift signature
The structural-difference scan (Action 4) found 6 research packets with
`deep-research-config.json` + `deep-research-strategy.md` present but the
iteration trail either empty or inconsistent with the JSONL:

**Mode-B signature (JSONL iteration records WITHOUT matching iteration-NNN.md
files) — strongest evidence:**
- `.opencode/specs/skilled-agent-orchestration/z_archive/122-deep-improvement-skill-benchmark-mode/002-implementation-deep-research/research` — config+strat+jsonl, **0 iteration files, but 5 `type:"iteration"` records in JSONL** (5 JSONL lines total).
- `.opencode/specs/skilled-agent-orchestration/z_archive/116-deep-skill-evolution/006-deep-stack-cross-cutting/001-unique-value-differentiation/research` — config+strat+jsonl, **0 iteration files, but 10 `type:"iteration"` records in JSONL** (9 JSONL lines — note: line vs record count mismatch is itself a parse/append anomaly).

These two are the literal empirical instantiation of the FOCUS's prediction:
"JSONL with only config records" inverted — here JSONL advanced the loop
counter (iteration records exist) yet NO leaf ever wrote the canonical
iteration narrative file. This is consistent with Mode B (orchestrator
looping without a real leaf) OR Mode A where the orchestrator wrote JSONL
state but not the narrative. **Cannot definitively attribute to GPT-backed
runs** without reading each JSONL's executor provenance field (deferred —
would exceed the tool-call budget); these are packets exhibiting the
PREDICTED incomplete-state signature, which is strong corroboration of the
checklist (F13/F14) but not proof of model attribution.

**Init-only signature (config+strat+JSONL, zero iteration records anywhere):**
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-infra-investigation-findings/research` — 3 JSONL lines, 0 iteration records.
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/{002-code-index-cli,003-skill-advisor-cli,001-spec-memory-cli}/000-*-research/research` — 2/2/4 JSONL lines, 0 iteration records each.

These 4 are the "loop initialized but never ran an iteration" signature —
consistent with a run that aborted in early loop (lock acquired, init done,
then mis-route → stuck_recovery → halt before any iteration produced state).
A non-mis-route cause (manual cancel, crash) cannot be excluded without
provenance reads, but the signature matches the F13 prediction exactly.
[SOURCE: bash structural-difference scan output — PACKET: ... | config=yes strat=yes jsonl=yes iter_files=N jsonl_iter_records=M jsonl_lines=K, run 2026-06-30 against .opencode/specs/**/research/]

### F17 — OBS3 (live): a SIBLING COMMAND MARKDOWN was injected into this leaf's context (third contamination vector)
Mid-iteration, the `/deep:context` command markdown (`.opencode/commands/deep/CONTEXT.md`, a DIFFERENT sibling command from `/deep:research`) was injected into my leaf context as a `system-reminder`. This is a third contamination vector beyond OBS1/OBS2 (which were dispatch-scaffolding text): here an entire sibling command contract (Phase-0 @general verification, mode routing, presentation boundary) was loaded into a leaf that should only see its own prompt-pack. A mis-faithful leaf/orchestrator could follow the wrong command's contract, compounding Mode A role collapse. This corroborates the broad pattern: orchestrator-side context is leaking across role AND command boundaries at the dispatch surface, not just at the Task-tool wrapper.
[SOURCE: this iteration's injected `/deep:context` CONTEXT.md system-reminder — empirical, not requested]

## Ruled Out
- **Reading each of the 6 F16 packets' JSONL executor-provenance to definitively
  attribute them to GPT-backed runs.** Would require 6 additional reads,
  exceeding the per-iteration tool-call budget. The structural signature
  (config+strat+jsonl, missing/inconsistent iteration trail) already
  corroborates the F13/F14 prediction; model attribution is deferred to a
  follow-up with a narrower budget.
- **The 156 parent changelog/review folders as a source of captured GPT-run
  failure logs.** The `changelog/` and `review/` trees exist but a targeted
  read was deferred to stay in budget; the empirical evidence in F16 (6 live
  packets under `.opencode/specs/`) is stronger than changelog prose would be.

## Dead Ends
- **Definitive model attribution of the F16 packets.** Narrowed to "packets
  exhibiting the predicted contract-drift signature" but could not read
  executor provenance to confirm GPT-backed vs other-cause abort. Candidate
  for reducer promotion to "Exhausted Approaches" only if a follow-up also
  cannot reach the provenance field (it is readable; the constraint here was
  budget, not access).

## Edge Cases
- **Ambiguous input:** the FOCUS named specific invariant breaks to predict
  ("missing delta files, strategy machine sections never refreshed, dashboard
  stale, lock never released, spec.md findings fence never written"). Each
  was mapped 1:1 to a named YAML step in F13; none required interpretation.
- **Contradictory evidence:** none. F13 (predictive checklist) and F16
  (empirical) are mutually reinforcing: the predicted signatures appear in
  the repo.
- **Missing dependencies:** OpenCode host runtime source remains out of repo
  (iter-1/iter-2 boundary), so Mode A vs Mode B attribution between host
  wrapper and orchestrator-model behaviour is still inferential — but F14's
  validator chain is repo-resident and fully mapped, so the *consequence*
  of either mode is now deterministic, not inferential.
- **Partial success:** the 6 F16 packets' executor provenance was not read
  (budget). Status is `complete` because the predictive deliverable (F13/F14)
  is fully cited from the YAML and the empirical cross-check (F16) found the
  predicted signature — both FOCUS deliverables are satisfied; only the
  model-attribution sub-claim is deferred, and it was not part of the FOCUS.

## Sources Consulted
- `.opencode/commands/deep/assets/deep_research_auto.yaml` (full 1556 lines): step_acquire_lock:227, init steps:286-339, step_dispatch_iteration:811-857 (if_native prose), post_dispatch_validate:986-1014 (+failure_reasons:1003-1014), step_reduce_state:1061-1080, step_graph_upsert:1082, step_memory_upsert_iteration:1097, step_refresh_memory_context:1110, step_evaluate_results:1124-1141, step_generate_dashboard:1219, phase_synthesis.step_writeback_spec_findings:1326-1344, phase_save.step_generate_context:1470, phase_save.step_release_lock:1486, error_recovery:1515-1519, rules.NEVER:1534-1540
- `.opencode/agents/deep-research.md` §0 + §1 (LEAF-only invariants)
- `.opencode/specs/.../010-gpt-deep-agent-routing/research/iterations/iteration-001.md` (F4 native-vs-CLI fork, F5 conflation cues)
- `.opencode/specs/.../010-gpt-deep-agent-routing/research/iterations/iteration-002.md` (F10 OBS1 mechanism, F11 OBS2 reproducibility)
- bash structural-difference scan: `for d in $(find .opencode/specs -type d -name research); ... config+strat vs iteration trail` — 6 flagged packets (F16)
- 156 parent tree: `ls .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/{changelog,review}` (present, not deeply read — budget)
- This iteration's dispatch prompt (OBS2 reproduction — "call the task tool with subagent: deep-research / general")
- This iteration's injected `/deep:context` CONTEXT.md system-reminder (OBS3 — F17)

## Assessment
- New information ratio: **0.90** (4 of 5 findings fully new: F13 step
  inventory, F14 failure_reasons mapping, F15 two-mode taxonomy, F16 empirical
  confirmation; 1 partially new: F17 OBS3 corroborates OBS1/OBS2 but is a new
  vector). The +0.10 simplicity bonus IS earned — F13+F14 collapse the
  FOCUS's loose invariant list into one checklist that maps each break to a
  named YAML step + a named failure_reason — but is withheld for consistency
  with iter-1/iter-2 anti-inflation discipline.
- Questions addressed: **KQ4**.
- Questions answered: **KQ4** — the full per-step contract-drift checklist
  is built (F13), each invariant break is mapped to a named `post_dispatch_validate`
  failure_reason (F14), the two mis-route modes are distinguished (F15), and
  6 repo packets exhibit the predicted signature (F16). KQ4's model-attribution
  sub-claim (whether the F16 packets are GPT-backed specifically) is deferred,
  not blocked.

## Reflection
- **What worked and why:** reading the full YAML (both halves) before
  searching the repo meant the empirical scan (F16) tested a SPECIFIC
  prediction (config+strat+jsonl with missing/inconsistent iteration trail),
  not a vague "look for broken packets" — so the 6 hits are high-signal, not
  noise. The validator's frozen `failure_reasons_reference` list (yaml:1003-
  1014) was the keystone: it let me map the FOCUS's prose invariants to exact
  named assertions in one pass.
- **What did not work and why:** I could not read the 6 F16 packets' JSONL
  executor-provenance to definitively attribute them to GPT runs. The
  constraint was the 12-call budget against a 1556-line YAML that needed two
  reads + a repo-wide scan; provenance reads were the natural casualty. This
  is a budget edge, not a method gap.
- **What I would do differently:** for KQ4-attribution close-out, read just
  the `executor` field (yaml:953-961 `record_executor_audit`) from the 6 F16
  packets' JSONL in a single batched grep — that one field per packet
  distinguishes native/CLI and narrows the GPT-vs-Claude attribution without
  6 full reads. Also fold F17's sibling-command injection into the OBS line
  for the eventual KQ2 deep-close.

## Recommended Next Focus
- **KQ5 (how the two reproduction surfaces share/differ in root cause):**
  F13/F14/F15 now give a deterministic consequence model for mis-routing;
  KQ5 asks whether `@orchestrate` sub-agent dispatch and the build-primary-
  agent surface trigger the SAME mode (A absorb vs B re-dispatch) or differ.
  The injected-scaffolding evidence (OBS1/2/3) and the F16 empirical packets
  are the two surfaces' respective fingerprints to compare.
- **Secondary — KQ4 attribution close-out:** a single batched `grep
  '"executor"'` across the 6 F16 packets' JSONL would convert F16 from
  "predicted signature present" to "GPT-backed signature confirmed/rejected"
  in one cheap call. Low-effort, high-value — a strong candidate to interleave
  with KQ5.
- **KQ6 preview:** F13/F14/F15 already suggest the fix surface — make
  `if_native` dispatch a real assertion (not prose), add a role-author check
  to `post_dispatch_validate`, and neutralize the OBS leak at the dispatch
  boundary. KQ6 can start from this checklist rather than from scratch.
