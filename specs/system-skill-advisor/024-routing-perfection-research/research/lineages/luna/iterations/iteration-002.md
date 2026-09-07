# Iteration 2 — cross-hub collision arbitration — gpt-5.6-luna

## Focus

Explain why stage-2 phrases owned by `sk-design`, `sk-doc`, or `system-deep-loop` can lose to generic `sk-code` or `sk-git` evidence. Compare router ownership, graph metadata visibility, explicit token boosts, and existing primary-intent arbitration.

### What was read

- All four contract files for each of `sk-design`, `sk-doc`, `sk-code`, `mcp-tooling`, `system-deep-loop`, and `cli-external-orchestration`: `graph-metadata.json`, `hub-router.json`, `ROUTER.md`, and `mode-registry.json`.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:18-35,62-73,100-135,251-346` for generic token boosts, phrase boosts, and author matching.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:126-170,542-620` for query classification, lane multipliers, and primary-intent arbitration.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223` for the stage-1 projection boundary.

### What was measured

The router contracts declare these relevant stage-2 phrases:

```text
sk-design ROUTER.md:64-68       design review; critique this; visual audit; review this screen; decision branch
sk-doc ROUTER.md:149-150        review the documentation; review bar; pass review; audit the docs
system-deep-loop ROUTER.md:71-75 iterative review; review convergence; audit the diff
sk-code ROUTER.md:328-338       code-quality/review-related surface vocabulary, but no generic stage-2 ownership for the above phrases
```

The stage-1 graph metadata contains representative specific signals but not the exact stage-2 collision phrases in this sample:

```text
sk-design: accessibility review; review this component; design review findings; visual audit
sk-doc: document before after review; score document quality; optimize documentation
sk-code: code review; pr review; security review; quality gate; review packet docs
system-deep-loop: deep-review; iterative review loop; deep-review wave; convergence review
```

The checked-in built scorer probe (not a live-daemon result; the daemon socket returned `EPERM` in iteration 1) returned:

```text
review bar              topSkill=sk-code; confidence=0.9285; sk-design=0.82; system-deep-loop=0.82
pass review             topSkill=sk-code; confidence=0.9285; sk-design=0.82; system-deep-loop=0.82
review the documentation topSkill=sk-design; confidence=0.82; ambiguous=true
review this screen      topSkill=sk-code; confidence=0.9349; sk-design=0.82
audit the diff          topSkill=sk-code; confidence=0.82
iterative review        topSkill=sk-design; confidence=0.82
decision branch         topSkill=sk-git; confidence=0.9451; sk-code=0.82
```

The supplied generation-679 baseline remains authoritative for the fleet scan: `review bar`, `pass review`, and `review the documentation` were observed going to `sk-code`; `iterative review` and `review convergence` to `sk-design`; `audit the diff` to `sk-code`; and `decision branch` to `sk-git`. The local built projection differs for two probes, so those differences are recorded as implementation-state drift rather than silently merged into the baseline.

### Findings

1. Stage-2 ownership is semantically more specific than the stage-1 scorer's generic token table. `sk-doc` explicitly claims `review the documentation`, `review bar`, and `pass review`; `system-deep-loop` claims `iterative review`, `review convergence`, and `audit the diff`; `sk-design` claims `review this screen` and `decision branch`. Yet the explicit scorer maps bare `review` to `sk-code` at `0.85`, bare `audit` to `sk-code` at `0.75`, and bare `branch` to `sk-git` at `0.45`. This is a direct collision mechanism, not a tie-break failure inside a hub. [SOURCE: `.opencode/skills/sk-design/ROUTER.md:63-68`; `.opencode/skills/sk-doc/ROUTER.md:148-150`; `.opencode/skills/system-deep-loop/ROUTER.md:71-75`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:18-21,62-65`]
2. Existing primary-intent arbitration only recognizes selected contextual patterns. It demotes `sk-code` for explicit `deep-review`, boosts `sk-code` for `compare|audit|review` plus classifier/vocabulary/prose/implementation terms, and handles `code audit` and colon-command review loops. It has no general rule saying that a phrase declared by another hub's stage-2 router outranks a generic `review`, `audit`, or `branch` token. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:542-620`]
3. The six hub contracts intentionally make stage-2 routers local: each `ROUTER.md` says `hub-router.json` picks the workflow mode and the document picks leaves, with the layers kept separate. That separation is correct inside a hub but leaves no cross-hub ownership signal for the advisor to consume. Nested mode registries reinforce hub membership rather than creating one advisor entry per mode. [SOURCE: `.opencode/skills/sk-doc/ROUTER.md:20-35`; `.opencode/skills/mcp-tooling/ROUTER.md:20-33`; `.opencode/skills/cli-external-orchestration/ROUTER.md:21-34`; `.opencode/skills/sk-code/mode-registry.json:5-12`]
4. The `decision branch` case shows that specificity must be semantic, not merely longer. `decision branch` is a design FLOWCHART keyword at stage 2, but `branch` has a first-class `sk-git` token boost, so a literal token arbitration can send it to git even when the design phrase is exact. A rule that treats every multi-word phrase as dominant would wrongly preserve the same defect in other collisions. [SOURCE: `.opencode/skills/sk-design/ROUTER.md:63-68`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:18-21`]
5. The direct built scorer and supplied daemon-generation baseline disagree on two collision probes, which is itself a signal about projection/runtime freshness. The direct run is reproducible from checked-in code, but it cannot establish the live daemon's current rank because the IPC path is unavailable. The safe conclusion is the shared mechanism (generic token boosts plus absent cross-hub stage-2 ownership), not the discrepant local rank. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server/skill-advisor-cli.js:1105-1124`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:251-346`]

### Recommendations

1. [needs a scorer change] Add a generated cross-hub phrase-ownership lane or arbitration table sourced from each hub's machine-readable `ROUTER.md` declaration. A phrase-specific owner should outrank a generic token boost only when the phrase is exact, normalized, and backed by a stage-1 authorization record; otherwise generic-token evidence still participates and ambiguity remains possible.
2. [implementable today] Keep generic `review`, `audit`, and `branch` boosts as fallback evidence, but report a structured collision diagnostic when a stage-2 owner and generic token owner disagree. This makes wrong-hub cases visible without lowering the threshold or silently changing ownership.
3. [implementable today] Add safe-negative collision fixtures: `review this screen` must not be accepted as a pure `sk-code` success; `decision branch` must not be treated as unambiguous git solely because of `branch`; `code audit` and `/deep:review` should preserve their existing explicit owners.
4. [needs a scorer change] Use phrase ownership as a bounded bonus/penalty after the scorer's direct lanes, not a universal string override. The arbitration must require a stage-1 phrase anchor or a generated reach proof, preventing stage-2 prose from becoming an untrusted global vocabulary dump.

### What this iteration could not settle

It could not determine the live daemon's current collision ranks because IPC returned `EPERM`, and it did not yet define the complete stage-1/stage-2 reach proof. It also did not inspect the compiled route contract or the CI checker implementation in depth; those are reserved for iterations 4 and 5.

## Sources Consulted

All twenty-four hub contract files named above, the explicit and fusion scorer lanes, the projection loader, the worker prompt, and the supplied generation-679 scratch measurements.

## Assessment

Question 2 is answered: cross-hub collisions are caused by a missing cross-hub ownership input combined with generic explicit token boosts. Hub-local `hub-router.json`/`ROUTER.md` arbitration cannot repair an advisor decision that never receives those declarations. The principled seam is a generated, stage-1-authorized phrase-ownership signal with bounded arbitration, plus collision diagnostics and safe negatives.

## Reflection

The stage-2 contracts are internally explicit but intentionally invisible to the generic advisor projection. This makes “add more router keywords” an incomplete remedy: it can improve a hub's local replay while leaving the first-stage rank unchanged. Iteration 3 should turn that observation into a concrete invariant and measure exact versus normalized phrase coverage.

## Recommended Next Focus

Iteration 3: the two-vocabulary contract — join every router declaration to graph metadata intent signals, distinguish exact/normalized phrase reach from bare common-word reach, and specify the invariant that catches silent no-reach.

