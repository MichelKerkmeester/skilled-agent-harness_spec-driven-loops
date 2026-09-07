# Iteration 1 — the scorer's shape — gpt-5.6-luna

## Focus

Trace the scorer's tokenization, overlap normalization, explicit phrase handling, and confidence floors. Compare representative short phrases with contextual phrases without lowering the fixed `0.8` confidence bar.

### What was read

- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/text.ts:5-115` for stop words, normalization, tokenization, phrase specificity, overlap, and read-only classification.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts:54-96` for the original-token denominator and lexical candidate fields.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:251-346` for phrase and author-signal matching.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/derived.ts:21-112` for derived phrase scoring and its caps.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts:8-29` for live lane weights.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/scoring-constants.ts:169-231` and `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:393-456,686-716,791-825` for calibration, fusion, and low-information abstention.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223` for projection fields and filesystem/SQLite source loading.
- `.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server/skill-advisor-cli.js:1105-1144` for the daemon-backed live probe path.

### What was measured

The requested daemon-backed probe could not reach the socket in this sandbox. The direct CLI result was:

```text
status: error
error: backend unavailable: connect EPERM /tmp/system-skill-advisor/697296aed00e/daemon-ipc.sock
exitCode: 75
```

I therefore ran the checked-in built scorer directly with the repository projection (read-only), preserving the same prompt shapes:

```text
font size                  topSkill=null; recommendations=[]
plot this                  topSkill=null; recommendations=[]
plot this data             topSkill=sk-design; confidence=0.82; uncertainty=0.30; passes_threshold=true; lexical=0.6666666666666666
what should this look like topSkill=sk-design; confidence=0.82; uncertainty=0.24; passes_threshold=true; explicit=1; lexical=0.3333333333333333; derived=0.148593
review this screen         topSkill=sk-code; confidence=0.9349; uncertainty=0.12; passes_threshold=true; explicit=1; lexical=1; graph=0.4216666666666667; derived=0.141883
```

The text utility probe returned:

```text
font size                  filtered=[font,size]; specificity=0.88; one-candidate-overlap=0.6666666666666666
plot this                  filtered=[plot]; all=[plot,this]; specificity=0.88; one-candidate-overlap=0.3333333333333333
plot this data             filtered=[plot,data]; all=[plot,this,data]; specificity=1; one-candidate-overlap=0.6666666666666666
what should this look like filtered=[look]; all=[what,should,this,look,like]; specificity=1; one-candidate-overlap=0.3333333333333333
```

### Findings

1. The main short-query failure is a normalization/representation effect, not a low phrase-specificity score. `tokenize` removes stop words and tokens of length two or less; `plot this` becomes one lexical token while `plot this data` becomes two. `scoreTokenOverlap` divides by `max(3, denominatorBasis)`, so a one-hit short query tops out at `0.3333` and a two-hit query at `0.6667` before other lane evidence. The built scorer's no-result/result pair reproduces this shape. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/text.ts:29-34,80-100`]
2. The authored phrase path has a separate signal. `phraseSpecificity` assigns `0.88` to both two-token phrases and `1.0` to three-or-more-token phrases, and the explicit lane scans the projection's `intentSignals` and `keywords` with boundary matching. Thus an exact stage-1 author signal can reach the `0.82` floor even when lexical overlap is only `0.3333`; `what should this look like` is the concrete probe. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/text.ts:64-74`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:315-334`]
3. A router declaration that is absent from the stage-1 projection has no equivalent author path. Lexical candidates are assembled from the projected skill id, name, description, domains, intent signals, and keywords; the projection loader obtains graph intent signals from graph metadata and does not read `hub-router.json` in this scoring path. That explains why a stage-2 phrase can remain invisible even though the phrase itself is well formed. The exact stage-1 versus stage-2 contract is deferred to iteration 3. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts:54-72`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223`]
4. The confidence calibration is deliberately generous after a strong direct signal, but it cannot create evidence from an empty projection match. `directScore >= 0.65` lifts confidence to at least `0.82`; task-intent signals can also floor confidence at `0.82`, while the low-information ambiguity gate raises uncertainty for diffuse short prompts. No-result short phrases fail earlier because no recommendation is emitted, not because the fixed confidence threshold is too high. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:409-440,791-824`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/scoring-constants.ts:169-201`]
5. Lane weighting makes lexical recovery weak by design relative to authored evidence: explicit author `0.42`, lexical `0.28`, graph `0.13`, derived `0.12`, semantic `0.05`. A fix should therefore preserve the distinction between an exact authorized phrase and a generic token overlap; simply increasing the lexical weight would make common words more competitive and worsen collision arbitration. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts:8-29`]

### Recommendations

1. [needs a scorer change] Add an explicit query-shape/phrase-anchor contribution for an exact multi-word stage-1 signal before stop-word filtering, counting the phrase as one authorized unit rather than as several lexical tokens. Keep the `0.8` threshold and retain abstention when no stage-1 phrase or other direct evidence exists.
2. [implementable today] Treat stage-2-only short declarations as `no-reach` telemetry until the stage-1/stage-2 invariant is in place; do not convert them into hard scorer failures or compensate by adding generic keywords.
3. [implementable today] Add regression fixtures around the observed boundary (`plot this`, `plot this data`, and `what should this look like`) to the reach gate, with expected categories of no-reach, route, and route respectively. The gate should assert exact ownership only after stage-1 authorization is available.

### What this iteration could not settle

It did not settle which hub should own collision phrases such as `review this screen`, nor the exact generated invariant linking every router declaration to graph metadata. It also could not query the running daemon because the sandbox returned `EPERM` for its IPC socket; the checked-in scorer was used for the reproducible shape probes.

## Sources Consulted

All source files listed under “What was read,” plus the supplied worker prompt at `specs/system-skill-advisor/024-routing-perfection-research/research/dispatch-prompt.md` and the existing baseline measurements under `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/` (used as supplied context, not re-derived).

## Assessment

Question 1 is answered: short no-reach is produced by the intersection of stage-1 vocabulary coverage and a minimum-denominator lexical overlap model. Phrase specificity and the confidence bar are not the primary defect. The repair seam is an explicit, stage-1-authorized phrase unit plus a contract check; lexical weight inflation and confidence-bar reduction are rejected.

## Reflection

The direct scorer probe separated two cases that look identical in the fleet scan: no stage-1 evidence (`font size`, `plot this`) and a short phrase with an author signal (`what should this look like`). The next iteration must hold the scorer fixed and inspect ownership/arbitration across hub contracts, because a stronger phrase anchor alone could amplify the wrong hub if generic review tokens remain dominant.

## Recommended Next Focus

Iteration 2: cross-hub collision arbitration — read all six hub contracts and trace why review/audit phrases are captured by `sk-code`, then compare artifact discriminators, hub-owned verbs, and negative signals.

