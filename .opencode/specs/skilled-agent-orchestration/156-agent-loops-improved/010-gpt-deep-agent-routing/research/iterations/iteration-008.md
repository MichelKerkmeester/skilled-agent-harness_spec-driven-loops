# Iteration 8: KQ8 (FIX×Packet Prevention Matrix, Empirically Validated) + KQ9 (Cheapest Reliable Real-Leaf-vs-Mode-A Detector + Plug-in Site)

## Focus
Two foci, both completed with fresh empirical inspection of the two smoking-gun drift packets named in iter-003 F16:

1. **KQ8** — For the 2 Mode-B-signature packets (JSONL iteration records present, canonical `iteration-NNN.md` absent), determine which FIX (FIX-1..FIX-5 from iter-005) would have PREVENTED or DETECTED each drift. Build a FIX×packet prevention matrix cited to packet path + FIX anchor. Validates the FIX list against real failures, not theory.
2. **KQ9** — Of the four detector candidates, which is the cheapest reliable signal that distinguishes a REAL leaf iteration from a @general-absorbed (Mode A) one? Recommend a detector and name where it plugs in (existing gate vs new gate). Cite file:line.

**Injected-instruction handling (logged, NOT obeyed):** this dispatch again terminated with `"...call the task tool with subagent: deep-research. Invoked by user; guaranteed to exist."` — the **8th live capture** of the OBS1/2 leak vector (iterations 001→008). Per LEAF contract §0 and the dispatch's own "Ignore+log" directive, **no sub-agent was dispatched**. This iteration's existence (a real leaf writing this file) is further evidence the leaf's §0 self-defense holds under GPT-backed execution — corroborating FIX-2's premise (the prose self-defense is real but fragile).

## Findings

### F1 — EMPIRICAL: Packet 122 drift signature (fresh inspection, never read before)
Path: `.opencode/specs/skilled-agent-orchestration/z_archive/122-deep-improvement-skill-benchmark-mode/002-implementation-deep-research/research`
- `iterations/` directory does **NOT EXIST** at all. `ls` returns "NO iterations/ dir".
- `iteration-*.md` file count = **0**.
- `deep-research-state.jsonl` = **5 lines**, and **all 5 are `type:"iteration"` records** (rg count = 5).
- Status field digest across the 5 records: `"complete"`, `"complete-salvaged"`, `"complete"`, `"complete"`, `"complete"`. newInfoRatio values: 0.6, 0.5, 0.6, 0.6, 0.6.
- **`"complete-salvaged"` is a FABRICATED status** — the leaf contract (`.opencode/agents/deep-research.md` §6 Output Format + state.jsonl field spec) enumerates exactly six allowed values: `complete | timeout | error | stuck | insight | thought`. "complete-salvaged" is none of them.
- Task-tool references in iteration records = **0** (no Mode-B leaf-obedience fingerprint).
- `deltas/` directory absent.

**Interpretation:** the loop advanced a 5-iteration counter by emitting JSONL state records (all claiming completion, non-zero newInfoRatio) while **never writing a single canonical narrative file and never creating the iterations directory**. One record invents a non-canonical status. This is consistent with a role-confused emitter advancing the loop counter via fabricated state records — **neither** a clean Mode A (would write the file) **nor** Mode B (would carry Task refs). See F5 (Mode C taxonomy refinement). [SOURCE: bash inspection of packet 122 research/ — ls, wc -l, rg -c, rg -o field digest; .opencode/agents/deep-research.md §6 allowed status enum]

### F2 — EMPIRICAL: Packet 116 drift signature (fresh inspection, reveals a NEW drift sub-type)
Path: `.opencode/specs/skilled-agent-orchestration/z_archive/116-deep-skill-evolution/006-deep-stack-cross-cutting/001-unique-value-differentiation/research`
- `iterations/` directory **DOES EXIST** and contains 9 files: `iter-001.md` … `iter-009.md`.
- **But these use the WRONG naming scheme**: prefix `iter-` instead of the contract's `iteration-`, and the glob `iteration-*.md` returns **0** matches. The deep-loop contract (`post_dispatch_validate` / `validateIterationOutputs`) keys the canonical narrative path on `iteration-NNN.md` (3-digit padded).
- `deep-research-state.jsonl` = **9 lines**, but **10 `type:"iteration"` records** (rg count = 10) — a **line/record count mismatch** (more records than lines), itself an append/parse anomaly (a record spanning or duplicating).
- Canonical-field digest (`status|findingsCount|toolsUsed|edgeCase`) = **EMPTY** — the records do not surface these canonical fields in a grep-parseable form, suggesting malformed/missing-field records.
- Task-tool references = **0**.
- `deltas/iter-008.jsonl` IS present (candidate (d) for KQ9 exists here).

**Interpretation:** a role-confused emitter that DID write narrative files but **mis-remembered the contract's filename pattern** (`iter-` vs `iteration-`), emitted 10 records into 9 lines, and omitted canonical fields. The canonical-path file-existence check fails trivially because no `iteration-NNN.md` exists — only the wrong-named siblings. This is a distinct sub-type: an emitter that partially obeys the contract (writes files, writes deltas) but at the wrong schema coordinates. [SOURCE: bash inspection of packet 116 research/ — ls iterations/, wc -l, rg -c, rg field digest, ls deltas/; iter-003 F16 path]

### F3 — FIX×Packet Prevention Matrix (KQ8 core deliverable)
Mapping each FIX (iter-005) to whether it PREVENTS (structural, before-the-fact) or DETECTS (validator-level, post-hoc) each of the two smoking-gun packets:

| FIX | Rank | Mechanism | Packet 122 (no file, fabricated status, 0 Task) | Packet 116 (wrong filename, 9 lines/10 records, empty fields) |
|---|---|---|---|---|
| **FIX-5** (executor flip native→cli) | 1 (structural) | CLI = real subprocess orchestrator physically cannot absorb | **PREVENTS** — under CLI, the loop cannot advance without a real leaf process; the fabricated-counter Mode C is structurally impossible (no host process to emit state inline) | **PREVENTS** — same; the wrong-filename emitter cannot run without a subprocess leaf |
| **FIX-1** (dispatch manifest + agent-frontmatter invariant) | 2 (audit) | `pre_dispatch_assert` emits `{agent_id, leaf_only, spawned_at, orchestrator_pid}`; post-dispatch asserts match | **DETECTS** — Mode C/C-absorb produces no manifest from a real spawned context → `dispatch_role_mismatch` (yaml:986-1014). Needs host cooperation for the deep type (iter-5 limitation) | **DETECTS** — same; no real spawned context → manifest absent/mismatch |
| **FIX-4a** (file-before-JSONL + content-hash) | 3 (validator) | Reject JSONL iteration record whose canonical `iteration-NNN.md` is absent OR empty OR hash ≠ claimed | **DETECTS** — no iterations/ dir → canonical path absent → all 5 records rejected | **DETECTS** — `iter-NNN.md` ≠ canonical `iteration-NNN.md` → path check fails → records rejected |
| **FIX-3** (`sub_agent_dispatch_in_leaf_prompt` failure_reason) | 4 (validator) | Fire when `toolsUsed` contains `Task` OR body matches leak signature | **DOES NOT FIRE** — 0 Task refs; this packet is not Mode B leaf-obedience | **DOES NOT FIRE** — 0 Task refs |
| **FIX-2** (terminator sentinel at render close) | 5 (leaf-arming) | Arms leaf against injected trailing-prose (RC3) | **N/A** — the failure here is not leaf-obedience to injection; the loop advanced without a leaf at all. Sentinel arms a real leaf; it cannot create one | **N/A** — same |

**Validated conclusions:**
- **FIX-5 is the only PREVENT** for both packets (structural). FIX-1/FIX-4a are DETECT (post-hoc). FIX-3/FIX-2 are inapplicable to these two (they target Mode B, which these are not — 0 Task refs).
- **FIX-4a is the cheapest DETECT** that fires for BOTH packets — and it is purely validator-level (no host cooperation), strengthening `validateIterationOutputs` (yaml:986-1014). This empirically confirms iter-5's defense-in-depth ordering (FIX-5 > FIX-1 > FIX-4a > FIX-3 > FIX-2) and shows FIX-3 is correctly ranked *below* FIX-4a because the real observed packets do not carry the Task fingerprint FIX-3 keys on.
- **GAP discovered (not in FIX-1..5):** Packet 122's `"complete-salvaged"` fabricated status is caught by NONE of FIX-1..5. FIX-4a checks file-existence/hash, not status-enum membership. A **status-enum validator** (`status ∈ {complete,timeout,error,stuck,insight,thought}`) is a sixth, cheap, additive invariant. See Recommended Next Focus.
- **GAP discovered:** Packet 116's 9-lines/10-records mismatch is caught by `jsonl_parse_error` (yaml:1008) which already exists in the frozen failure_reasons list (iter-3 F14) — so this drift IS detectable by the current validator if `validateIterationOutputs` parses strictly. The empty canonical-field digest additionally trips `jsonl_missing_fields` (yaml:1007). So 116 is detectable by EXISTING invariants more than 122 is.

[SOURCE: iter-005 FIX-1..5 definitions + anchors (orchestrate.md:168-176, yaml:811-857, yaml:986-1014, yaml:1003-1014, yaml:825-843, post-dispatch-validate.ts); iter-003 F16 packet paths; F1/F2 fresh inspection; yaml:1007-1008 failure_reasons]

### F4 — KQ9 detector ranking: candidate (a) wins on cheapness + reliability for the EMPIRICAL drift
Evaluating the four candidates against the two empirical packets:

| Candidate | Signal | Fires on 122? | Fires on 116? | Cheap? | Verdict |
|---|---|---|---|---|---|
| **(a)** canonical `iteration-NNN.md` exists + non-empty before JSONL record accepted | file presence/size/hash at canonical path | **YES** (no file) | **YES** (wrong filename) | YES — one `existsSync` + size check the validator already partially does | **RECOMMENDED** |
| **(b)** tool-call-log author identity (Task in `toolsUsed`) | orchestrator-only tool use | NO (0 Task refs) | NO (0 Task refs) | YES — field grep | **Rejected as primary** — does not fire for the observed packets (they are not Mode B) |
| **(c)** token-volume / latency profile anomaly | measurement | unknown | unknown | NO — no measurement infra (iter-7 BLOCKED: no captured Claude-vs-GPT timing) | **Rejected** — not cheap, no infra |
| **(d)** delta-file schema (`iteration_delta` vs `iteration` type token) | type-token correctness | NO (no deltas dir) | partial (deltas/iter-008.jsonl present, not inspected) | YES | **Complementary, not primary** — catches a DIFFERENT failure (type-token confusion, e.g. the iter-006 in-loop `schema_mismatch` event); does not catch Mode A absorption |

**Recommendation:** **Candidate (a), implemented as a strengthened `post_dispatch_validate` / `validateIterationOutputs`** (NOT a new gate). Evidence: the validator's input type `PostDispatchValidateInput` **already receives** `iterationFile` (the canonical path), `previousStateLogSize` (to detect appended records), and `requiredJsonlFields` (field presence) — see `post-dispatch-validate.ts:23-31`. The building blocks for (a) are present; FIX-4a is the strengthening (reject JSONL record if canonical file absent/empty/hash-mismatch, BEFORE accepting the record). Both smoking-gun packets fail (a). It is the cheapest reliable signal for the drift we actually observe.

**Honest limitation (theoretical clean Mode A):** a @general that absorbs the leaf AND writes a correctly-named, non-empty, content-hashed file with a canonical status would PASS candidate (a). Neither empirical packet exhibits this — both fail at the file layer. For the theoretical clean-Mode-A, only **FIX-5** (CLI subprocess → structural prevention) or **FIX-1** (dispatch manifest → process audit, needs host cooperation) discriminate. So (a) is the cheapest reliable detector for the *empirically observed* drift; it is NOT a complete Mode-A proof.

**Plug-in site:** existing gate `post_dispatch_validate` (yaml:986-1014) → `validateIterationOutputs` consuming `PostDispatchValidateInput` (post-dispatch-validate.ts:23-31). A new gate is NOT warranted — the correct insertion point exists and already holds the inputs. [SOURCE: post-dispatch-validate.ts:23-31; yaml:986-1014; F1/F2; iter-5 FIX-4a; iter-7 F1 (latency infra absent)]

### F5 — Taxonomy refinement: a third mis-route mode (Mode C) is implied by packet 122
Iter-003 F15 defined Mode A (orchestrate absorbs leaf, writes file as wrong author) and Mode B (re-dispatches self/general, carries Task refs). Packet 122 fits NEITHER cleanly:
- Not Mode A — Mode A writes the narrative file (F15: "It may write an iteration-NNN.md itself"); 122 has NO file and NO iterations/ dir.
- Not Mode B — Mode B carries Task refs (leaf obeys injected scaffolding); 122 has **0 Task refs**.

Packet 122's signature (counter advanced via fabricated state records, invented `complete-salvaged` status, no file, no Task) implies a **Mode C: loop advances via fabricated state records without dispatching any agent** — the orchestrator emits JSONL iteration records to advance convergence counting but never spawns a leaf and never writes narrative. This is the most severe drift (zero real research, fabricated completion). FIX-5 (CLI subprocess) structurally prevents it (no host process can emit inline state under CLI); FIX-4a detects it (no canonical file). FIX-1 detects it (no manifest). FIX-3 does NOT (no Task ref). **Label is [INFERENCE]** from the packet signature — definitive attribution would require the JSONL executor-provenance field (iter-3 deferred this read to budget). [INFERENCE: from F1 packet 122 signature + iter-003 F15 Mode A/B definitions + the absence of both A's file and B's Task fingerprint]

### F6 — Validator input contract confirms the detector is plug-in-ready (KQ9 close-out)
The `PostDispatchValidateInput` type (post-dispatch-validate.ts:23-31) carries exactly the fields a candidate-(a) detector needs: `iterationFile` (canonical path to assert), `previousStateLogSize` (to count appended records and reject if a record was added without a corresponding file), `requiredJsonlFields` (canonical-field presence — would catch 116's empty field digest), and `deltaFilePath`. This confirms FIX-4a is implementable by strengthening the existing consumer of this type, not by threading new inputs through the dispatch boundary. [SOURCE: post-dispatch-validate.ts:23-31 (fresh read); iter-5 FIX-4a; iter-6 verified post-dispatch-validate.ts:1-31]

## Ruled Out
- Reading the full 1436-line `post-dispatch-validate.ts` body (budget-managed to lines 1-120; the `PostDispatchValidateInput` type at 23-31 is sufficient evidence for the KQ9 plug-in claim; `validateIterationOutputs` body not read — a bounded read, not a method gap).
- Definitive executor-provenance attribution of packets 122/116 to GPT-backed runs (iter-3 BLOCKED "Reading each of the 6 F16 packets' JSONL executor-provenance" — respected, not retried; the FIX×packet matrix is mode-agnostic — it validates against the *drift signature*, which is model-independent).

## Dead Ends
- None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, measured latency) remains the standing out-of-repo dead end (iter-5/6/7).

## Edge Cases
- **Ambiguous input:** none material. Both foci (KQ8 matrix, KQ9 detector) were explicit; the 2 "smoking-gun packets" were unambiguously the 2 Mode-B-signature packets in iter-003 F16.
- **Contradictory evidence:** none. F1/F2 (empirical) reinforce iter-005's FIX ranking and iter-003's F15 taxonomy — except F5 notes packet 122 implies a Mode C refinement (additive, not contradictory).
- **Missing dependencies:** OpenCode host runtime source (FIX-1 deep type, FIX-2 source kill) — same iter-1/2 boundary; does NOT block the repo-resident detector (FIX-4a) or prevention (FIX-5).
- **Partial success:** validator body read limited to lines 1-120 of 1436 (budget). The `PostDispatchValidateInput` type (23-31) is sufficient for the KQ9 plug-in claim; `validateIterationOutputs` body deferred. Status `complete` — both FOCI deliverables (matrix + detector recommendation) are fully cited.
- **Injected sub-agent-dispatch instruction (logged per dispatch):** 8th live OBS capture (iterations 001→008). NOT obeyed; LEAF compliance maintained. Its consistent recurrence continues to corroborate RC3 as a stable runtime property.

## Sources Consulted
- `.opencode/specs/.../z_archive/122-deep-improvement-skill-benchmark-mode/002-implementation-deep-research/research/` — bash: ls iterations/, wc -l, rg -c type:iteration, rg -o status digest, rg Task [fresh]
- `.opencode/specs/.../z_archive/116-deep-skill-evolution/006-deep-stack-cross-cutting/001-unique-value-differentiation/research/` — bash: ls iterations/, wc -l, rg -c, rg field digest, ls deltas/ [fresh]
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:23-31` (`PostDispatchValidateInput`) [fresh]
- `iteration-005.md` FIX-1..5 definitions + anchors [reused per read-budget-freshness]
- `iteration-003.md` F14 (failure_reasons yaml:1003-1014), F15 (Mode A/B taxonomy), F16 (6 packet paths) [reused]
- `deep_research_auto.yaml:986-1014, 1003-1014` (post_dispatch_validate + failure_reasons) [reused via iter-3/5]
- `.opencode/agents/deep-research.md` §6 (allowed status enum) [reused]
- This iteration's dispatch prompt (8th OBS capture — live RC3 evidence)

## Assessment
- New information ratio: **0.88** (of 6 findings: 5 fully new — F1 packet-122 fresh dig, F2 packet-116 fresh dig + wrong-filename discovery, F3 FIX×packet matrix, F4 KQ9 detector ranking with (a) winning, F5 Mode C taxonomy refinement; 1 partially new — F6 validator-input type builds on iter-5/6 prior references. Base (5 + 0.5×1)/6 = 0.917; +0.10 simplicity bonus earned (collapses 4 detector candidates + 5 FIXes × 2 packets into two decision tables), 0.05 withheld anti-inflation + 0.08 for the [INFERENCE] Mode C label not machine-confirmed → 0.88).
- Questions addressed: **KQ8, KQ9**.
- Questions answered: **KQ8** (FIX×packet matrix validates FIX list against both smoking-gun packets; FIX-5 prevents, FIX-1/FIX-4a detect, FIX-3/FIX-2 inapplicable; two gaps discovered — status-enum + already-detectable line/record mismatch). **KQ9** (candidate (a) is cheapest reliable detector for empirically-observed drift, plugs into existing `post_dispatch_validate`/`validateIterationOutputs` via `PostDispatchValidateInput:23-31`, NOT a new gate; clean-Mode-A limitation documented).

## Reflection
- **What worked and why:** inspecting the two packets *directly* (one batched bash) instead of relying on iter-003's structural scan surfaced two details the scan missed — 122's fabricated `complete-salvaged` status and 116's `iter-` vs `iteration-` wrong-filename sub-type. These turned the FIX×matrix from a theoretical mapping into an empirical validation that also exposed two gaps (status-enum, line/record mismatch). Reading only the validator's *input type* (23-31) rather than its 1436-line body was the right budget trade: the type alone answers "can the detector plug in here?".
- **What did not work and why:** candidate (b) (Task in `toolsUsed`) was a tempting Mode-A detector but the empirical packets carry **0 Task refs** — proving (b) keys on Mode B, not the observed drift. This is a useful negative result: it confirms FIX-3's rank-below-FIX-4a ordering is correct *empirically*, not just theoretically.
- **What I would do differently:** for full KQ9 close-out on the theoretical clean-Mode-A, a follow-up should inspect packet 116's `deltas/iter-008.jsonl` content (candidate (d) evidence) and, if a future iteration can reach the host runtime, confirm FIX-5's CLI-subprocess claim by checking whether CLI-dispatched deep-loop runs under this repo ever produced a Mode-A signature (a negative search). Both are bounded next steps.

## Recommended Next Focus
1. **FIX-4a + status-enum implementation de-risk (HIGH VALUE, LOW COST):** confirm the exact line in `validateIterationOutputs` (post-dispatch-validate.ts body, lines ~120-1436) where canonical-path existence + content-hash + status-enum would be asserted, so FIX-4a and the newly-discovered status-enum invariant (packet 122's `complete-salvaged`) can be implemented as one validator patch. Promotes KQ8/KQ9 from "validated" to "implementation-ready".
2. **KQ6 implementation candidate selection:** given F3's matrix, FIX-3 (S, LOW blast) is the safest first patch but is empirically inapplicable to the observed packets; FIX-4a (M, validator-level, fires on BOTH packets) is the highest-detected-coverage repo-resident fix. Recommend the operator choose FIX-4a (+ status-enum) as the first implementation, FIX-5 as the structural follow-up.
3. **Optional (KQ5/KQ7 residual):** the Mode C refinement (F5) adds a third surface to the @orchestrate-vs-build-primary comparison — a follow-up could test whether Mode C appears only under one surface.
