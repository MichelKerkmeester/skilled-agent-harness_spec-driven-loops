# Iteration 19: Content-Bound Utilization Proof

## Focus

[D3-A2 / D3] self-attested vs content-bound proof of utilization: proof must echo a value that exists only in the loaded file, or carry a content hash. Corpus: local repo.

This pass continues iteration 18's hub-router finding. It assumes prompt-to-mode replay can be made deterministic, then asks what proves the selected packet and shared context were actually used rather than merely named.

## Actions Taken

1. Re-read the current strategy and prior D2/D3 iterations to avoid re-covering command metadata, command descriptions, tool grants, or hub-router parseability. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:36] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-018.md:84] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-018.md:95]
2. Read the live `sk-design` hub, registry, context-loading contract, context-loaded card, proof-of-application card, and proof checker. [SOURCE: .opencode/skills/sk-design/SKILL.md:58] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47]
3. Read the deep-improvement skill-benchmark scripts to compare deterministic router proof, live observed evidence, and self-attestation handling. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:209] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:543]
4. Computed SHA-256 hashes for the core proof files as a concrete example of content-bound anchors available to a checker. [SOURCE: command output from `shasum -a 256`, iteration 19]

## Findings

### Finding 1: Current sk-design proof cards are deterministic self-attestation, not content-bound utilization proof

Severity: P1. Label: ENFORCEABLE on a test corpus; ADVISORY for open-ended design quality after the proof passes.

The hub already creates the right enforcement point: for UI build work it requires a context manifest, the context-loaded card before recommendations, and the proof-of-application card before ready claims. [SOURCE: .opencode/skills/sk-design/SKILL.md:58] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] The shared contract says the manifest is "proof of context, not a summary" and blocks design claims until files are named as loaded. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65]

The current cards stop one step short of content proof. The context-loaded card asks for yes/no loaded rows for `register.md`, `brief_to_dials.md`, mode packets, preflight, contrast refs, audit refs, and small-model profiles. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:49] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:58] The proof-of-application card asks for "File or artifact | Cited where" plus evidence/gap cells and READY/NOT READY. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:35] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:57] None of those fields require an echoed anchor line, a unique in-file value, or a digest computed from the loaded file.

Buildable recommendation: extend both cards with a `SOURCE PROOF` section, and make it mandatory whenever a row says a file was loaded:

```text
SOURCE PROOF:
- path:
  sha256:
  anchor:
  echo:
  used_for:
```

For the files read this iteration, the checker could accept either a current SHA-256 digest or an echoed anchor verified against the file. Example hashes from the local repo:

- `shared/context_loading_contract.md`: `3fb246292a2a0dd662049104fc000f2495ab2fbac213b77d1ef09b25b2449e9b`
- `shared/assets/context_loaded_card.md`: `587f07626b8932a5a36f4f9611ddaac9a7986847c4d37fb576af91b111a4ca21`
- `shared/assets/proof_of_application_card.md`: `ec6e9a42442a4592b3a31f966d3f9f0367456168578b35ab19df83cda04e1515`
- `shared/scripts/proof_check.py`: `85ddeda42bb0856a75848a4c37eb28a9f8c9c78d7a68d7de0e073646bcfa6d72`

This is enforceable because a checker can recompute each digest or search the claimed echo in the named file before accepting a LOADED or READY verdict.

### Finding 2: `proof_check.py` enforces field presence and READY, but cannot distinguish applied context from keyword stuffing

Severity: P1. Label: ENFORCEABLE.

The proof checker's documented contract is to exit non-zero unless every required proof field is present and the verdict reads READY. [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:4] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:16] Its implementation matches four proof-field labels with regexes and marks READY with a checkbox-aware regex. [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:25] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:39] The `check()` function returns success when the labels are present and READY is asserted. [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:52] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:53]

That is useful as a shape gate, but it is still self-attestation. A note can contain the strings `REGISTER`, `DIALS`, `CONTRAST PAIRS`, `INTERFACE PREFLIGHT`, `AUDIT EVIDENCE`, and `[x] READY` without proving any referenced file was opened or used. The current script has no file-path validation, digest validation, anchor lookup, or line-echo check.

Buildable recommendation: add a second gate mode to `proof_check.py`, for example `--require-source-proof`. It should parse `SOURCE PROOF` rows, reject missing files, compute SHA-256 for each path, and require either:

- `sha256` equals the current file digest; or
- `anchor`/`echo` appears in the named file and the file digest is recorded in the report.

The checker should also cross-check that every required loaded-file row marked yes has a matching source-proof row, and that every final proof-field evidence cell references at least one source-proof id.

### Finding 3: The skill-benchmark harness corroborates activation and paths, but its live evidence is not content-bound

Severity: P1. Label: ENFORCEABLE for benchmark lanes; ADVISORY for production runtime unless ready claims are forced through the checker.

The live executor states the core observability limit directly: OpenCode emits no startup "resources loaded" manifest. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:18] To work around that, it prompts the model to state routing in JSON and uses `tool_use` events as corroboration: skill activation is a hard signal, and reads/globs/greps under the skill tree are observed discovery. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:21] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:22]

The parser then records tool names, skill activation, observed read paths, stated resources, and response text. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:212] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:224] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:229] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:252] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:258] The report evidence mirrors that: event count, activation, tool calls, observed read paths, whether stated routing parsed, and a response head. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:209] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:212] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:215] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:217]

That evidence proves "the path was routed or mentioned" better than it proves "the file content affected the answer." D5 connectivity is also structural: it catches unparseable routers, missing paths, dead intent keys, path escapes, and orphan references. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:10] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:12] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:15] It does not verify that an output echoed or applied any content from those paths.

Buildable recommendation: add `observedContentProofs` to the normalized live result and `expectedSourceProofs` to scenario fixtures. The scenario output should include a `sourceProofs` JSON array:

```json
[
  {
    "path": "shared/context_loading_contract.md",
    "sha256": "3fb246292a2a0dd662049104fc000f2495ab2fbac213b77d1ef09b25b2449e9b",
    "anchor": "REGISTER-FIRST GATE",
    "echo": "`register.md` is the first read for any design or UI work.",
    "used_for": "register/dials gate"
  }
]
```

Score it as a separate `D3-content` or proof-gate lane: missing source proof caps the scenario at structural pass; matching source proof unlocks utilization pass. The final design-quality score remains separate and advisory.

### Finding 4: Existing benchmark machinery already recognizes self-attestation risk; the same pattern should be reused for utilization proof

Severity: P2. Label: ENFORCEABLE for scoring and warnings.

The model-benchmark runner has an explicit phantom-gap warning for self-reported scores: if a profile declares `self_score_pattern`, it extracts the self score, compares it to the independent score, and warns when the mean gap exceeds a threshold. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:543] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:547] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:568] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:581] The skill-benchmark D4 ablation also drops contaminated skill-OFF pairs when the supposedly off run still loaded or read the skill. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:14] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:98] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:102]

Utilization proof needs the same attitude: a claimed context manifest is not enough until independently checked. The difference is that the independent check can be cheaper than a grader: hash the file, verify the echoed anchor, and tie the proof id to the decision field that used it.

Buildable recommendation: add profile fields such as:

```json
{
  "contentProof": {
    "required": true,
    "accepted": ["sha256", "anchorEcho"],
    "claimPattern": "SOURCE PROOF:",
    "warnOnSelfOnly": true
  }
}
```

Then report a `self_utilization_gap` beside the existing phantom-gap style warning: outputs that claim loaded context but fail hash/anchor checks should be flagged as self-attested, even if structural routing and field-shape checks pass.

## Questions Answered

- Q2/D3: Parent-to-sub-skill routing proof is not enough. Utilization proof should be a second gate after route replay: the selected packet and required shared files must produce `SOURCE PROOF` entries whose hashes or echoes validate against the on-disk files.
- Q5/all: The enforceable part is deterministic: parse card rows, recompute file hashes, search echoed anchors, require proof ids in final evidence cells, and cap benchmark results when proof is self-attested only. The advisory part is whether the resulting design decision is tasteful or strategically right.

## Questions Remaining

- Should content-bound proof live directly in `context_loaded_card.md` and `proof_of_application_card.md`, or should the cards reference a separate `source_proof_card.md` to avoid making the one-screen cards too heavy?
- Should the benchmark harness score source proof as a new D3-content lane, a D5 hard gate extension, or a separate proof gate that caps READY/adoption claims only?
- Should live executors try to hash `tool_use` read outputs when available, or should they rely on model-emitted `sourceProofs` plus offline verification against the current repo checkout?

## Next Focus

Continue D3 with the buildable checker design: choose where the `SOURCE PROOF` schema lives, how fixtures express expected source proofs, and how the skill-benchmark report distinguishes structural routing pass, content-bound utilization pass, and advisory design-quality pass.

Assessment: newInfoRatio 0.73. Novelty is high because iteration 18 made hub routing replayable, but this pass identifies the next proof layer and shows exactly where the current cards, checker, and benchmark evidence remain self-attested.
