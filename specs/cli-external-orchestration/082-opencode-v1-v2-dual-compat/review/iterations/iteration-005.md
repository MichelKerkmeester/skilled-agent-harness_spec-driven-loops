# Iteration 005 — correctness and security (broadened cross-cutting pass + finding replay)

**Review target:** `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat`
**Dimension:** correctness and security — broadened pass over the scope files the first four iterations left unread or partially read: the agent definitions and command tree, `opencode.json`, the install guide and setup helper, the `/doctor:opencode` battery, the CI workflow, the contract compiler and the tests. Plus a replay of the active P1 and the P2 set against source.
**Mode:** review (read-only target; writes limited to this run directory)

## Dimension

Four iterations surveyed this packet from the top down: producers first, then the enforcement chain, then the documents, then the cost of a third version. That method concentrates findings where producers meet consumers and it systematically skips the surfaces that nothing else consumes — configuration, agent frontmatter, CI triggers and the generated-contract pipeline. This iteration reads those, and it does the one thing no prior iteration could: it replays the accumulated findings against the code and documents that produced them.

Two results matter more than the findings. First, **the active P1 reproduces exactly as filed** — the divergence is real, in one file, and it is the only document in the packet that claims a non-closing state. Second, **the compiled contract pipeline is intact**: all 61 recorded source digests across the three compiled contracts recompute to their current source files. That closes a traceability question the earlier iterations could only assume.

## Files Reviewed

- `.skilled/bin/tests/opencode-config-shape.test.cjs` (full read, 45 lines)
- `opencode.json` (full read)
- `.skilled/agents/*.md` — all 11 frontmatter blocks (`ai-council`, `code`, `context`, `debug`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, `review`)
- `.opencode/agents/` — directory listing and the `mode:` line of all 11 mirrors
- `.github/workflows/opencode-dual-version.yml` (full read)
- `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:20-60,401-435,654-694`
- `.skilled/command-support/deep/assets/compiled/deep-review.contract.md:1-30` (generated header, 16 source digests)
- `.skilled/command-support/deep/assets/compiled/deep-ai-council.contract.md` (28 source digests), `deep-research.contract.md` (17 source digests) — digest verification only
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md:70-89` (P1 replay)
- Packet-wide completion metadata: `spec.md:21`, `011-two-version-proof-and-closeout/goal.md:21`, `011-two-version-proof-and-closeout/implementation-summary.md:23`
- Context (outside the 157-file manifest, read only): `.skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:104`, `references/opencode-tools.md:171`, `references/permissions-matrix.md:19`

## Findings by Severity

### P0 — Critical

None.

### P1 — Required

#### 1 [P1] `R3-P1-001` replayed and CONFIRMED — the closeout child records the packet as not closing while every other document says Complete

- Claim: the closure statement in the closeout acceptance criteria denies closure, in a packet whose four other completion fields say 100%.
- Evidence: `**Closeable:** No` at [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md:86], immediately followed by `Not started. This section is written when the packet closes, not before.` at [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md:88]. The same file's own frontmatter carries `completion_pct: 100` at [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md:21], and so do `spec.md`, the phase `goal.md` and `implementation-summary.md`.
- Counterevidence sought: whether the "not before" sentence is an instruction to the reader rather than a state claim, which would make the whole block template scaffolding rather than an assertion. It is scaffolding — and that does not help. A closure section still holding its template text in a packet whose other four documents assert `completion_pct: 100` is the divergence, not a defence of it: the packet is either closed, in which case this block should read `Closeable: Yes`, or it is not, in which case the four `100` fields are wrong. Both readings leave a document that contradicts its siblings.
- Alternative explanation: the closure block may be populated only by a generator step that this packet's completion path never runs, making it a known-unpopulated field everywhere. That would lower the severity to a documentation gap rather than a completion claim — and it is the one reading I could not exclude, because no generator for this block is in scope.
- Final severity: P1. A release decision reading this packet meets one document that says the packet is not closeable and four that say it is.
- Confidence: high on the divergence (the two texts are read directly), medium on the intent behind the closure block.
- Downgrade trigger: a generator or documented convention showing the closure block is machine-filled at a release step this review does not exercise, or a single edit reconciling the block with the four `100` fields.

### P2 — Minor

#### 2 [P2] The dual-version config guard pins one family's shape, and nothing asserts the other — while the agent frontmatter that carries the permission denials is checked by nothing at all

- Case: `opencode.json` and the eleven agent definitions both express their permission model in a single shape. The guard that exists checks only that the shape is the v1 one. On the second family the same file is read by a binary whose schema this repo never asserts, and the frontmatter whose `write: deny` / `bash: deny` lines are the entire read-only guarantee of five agents is read by no test, no battery leg and no CI path.
- File: `.skilled/bin/tests/opencode-config-shape.test.cjs:25`
- Evidence: `checkConfigShape` forbids top-level `permissions`, `plugins` and `disabled` ([SOURCE: .skilled/bin/tests/opencode-config-shape.test.cjs:22]) and requires top-level `permission` ([SOURCE: .skilled/bin/tests/opencode-config-shape.test.cjs:25]); its only test is named for one family — "keeps the v1 config shape" ([SOURCE: .skilled/bin/tests/opencode-config-shape.test.cjs:28]) — and the second test exercises only the negative case (`rejects a top-level plugins key`). The assertion is on **key names only**: the permission *value* vocabulary is never checked, so a permission key the active major does not implement passes the guard silently. That is not hypothetical for this file, which carries `doom_loop` and `external_directory` alongside `edit`, `bash` and `webfetch` ([SOURCE: opencode.json:7], [SOURCE: opencode.json:8]). The agent side is the sharper end: five of the eleven definitions deny writes ([SOURCE: .skilled/agents/context.md:8] and the same line in `prompt-improver`, `review`, and the two read-only delegates), two deny bash, and one declares `mode: all` ([SOURCE: .skilled/agents/markdown.md:4]) — a vocabulary this repo records for v1 but not for v2.
- User impact: on the second family, a permission the binary does not recognise is a permission that does not deny. The failure is silent, it lands on the agents that are supposed to be read-only, and neither the local guard nor the two-version battery is looking at it.
- Finding class: missing_parity_test (extends `R4-P2-001`'s class from the version-output classifiers to the configuration surface; the two share a class, not a producer or a consumer)
- Scope proof: `opencode-config-shape.test.cjs` is the only in-manifest test that reads `opencode.json`; the eleven agent files are in the manifest but no test in `.opencode/plugins/tests/`, `.skilled/bin/tests/` or `.skilled/commands/doctor/scripts/tests/` reads an agent frontmatter. The reference layer states the gap in prose rather than closing it: v2 "registers the agent's mode, permissions and temperature from its frontmatter", and "whether it applies those permissions during a run is unverified on OpenCode 2.0.32" ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:104], the same sentence at [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md:171]).
- Affected surface hints: ["opencode.json permission vocabulary", "11 agent frontmatter permission blocks", "config-shape guard", "v2 agent-permission enforcement"]
- Recommendation: extend the guard from key names to a value vocabulary per family, assert `mode` against each family's accepted set, and add one battery leg that reads each agent's declared denies and confirms the run honoured them — that leg is what converts the prose "unverified" into a test.

#### 3 [P2] The two-version battery never runs for a change to agent frontmatter or the dispatch guards, so the one surface that could break on a single major is outside the gate

- Case: a commit that changes `mode: primary` to `mode: subagent`, tightens an agent's permission block, or edits the dispatch guards lands with no battery run. The workflow whose stated purpose is catching "a plugin that loads on one major and not the other" is triggered by plugin paths, `opencode.json`, and the battery's own file — not by the agent definitions, not by `.skilled/hooks/dispatch/`, and not by the command tree.
- File: `.github/workflows/opencode-dual-version.yml:13`
- Evidence: the `paths:` filters for both `pull_request` and `push` enumerate `.opencode/plugins/**`, `.skilled/plugins/**`, `.skilled/skills/sk-vision/**`, `.opencode/package.json`, `.opencode/package-lock.json`, `opencode.json`, the battery script, the battery test and the workflow itself ([SOURCE: .github/workflows/opencode-dual-version.yml:13], closing at [SOURCE: .github/workflows/opencode-dual-version.yml:22]). The job that runs is a registration and version battery: each family is installed into its own npm prefix, the binary is reached by full path, its `--version` output is asserted exactly, and the `both` job proves the two dispatch names still resolve to two distinct binaries. None of those legs reads an agent file.
- User impact: the dual-compat gate is a plugin gate. Agent frontmatter drift — the exact surface whose v2 support the references mark unverified — passes CI green, and the gap is invisible because the workflow's own comment describes a broader purpose than its filter implements.
- Finding class: guard_bypass
- Scope proof: the filter lists nine path globs; a `git diff --name-only` touching only `.skilled/agents/deep-review.md` matches none of them, and touching only `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` matches none of them either.
- Affected surface hints: ["CI path filters", "agent frontmatter", "dispatch guards", "command tree"]
- Recommendation: add `.skilled/agents/**`, `.opencode/agents/**` and `.skilled/hooks/dispatch/**` to both filters, and add the frontmatter read that finding 2 asks for to the battery so the trigger has something to run.

### What holds up

**The compiled contract pipeline is fresh, and this is now measured rather than assumed.** Each compiled contract embeds a generated header listing every maintained source with its sha256 ([SOURCE: .skilled/command-support/deep/assets/compiled/deep-review.contract.md:7]). I recomputed all of them: 16/16 for `deep-review`, 17/17 for `deep-research`, 28/28 for `deep-ai-council` — 61 digests, 0 mismatches. The hashing convention matched on the first attempt because the compiler hashes the whole file ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:406]), not a section, and the header records `section: 'full'` for every entry. The compiler also digests the body it emits ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:682]) and stamps the header into the artifact ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:663]), so staleness is detectable by recomputation rather than by trust. That is the right design, and it is the strongest traceability link in the slice.

**The CI workflow itself survives a security read on second contact.** Matrix `fail-fast: false` so one family's failure cannot hide the other's; three actions SHA-pinned to commit ids; no event field interpolated into a `run:` block (the only `${{ }}` uses are matrix constants); `set -euo pipefail` in every multi-line step; the v2 family isolated behind a launcher that redirects `OPENCODE_DB` so it cannot migrate v1's database in place; and the version assertions are exact strings rather than prefixes. The two asserted strings — `1.19.3` and `opencode v2.0.32` — match the shapes the install reference records, so the CI and the docs agree about what each binary prints. Iteration 2 ruled the injection direction out; this read adds nothing to reopen it.

**The agent mirrors agree with their source.** All eleven `.opencode/agents/*.md` files carry the same filename, the same byte size and the same `mode:` value as their `.skilled/agents/*.md` counterpart — nine `subagent`, `orchestrate` `primary`, `markdown` `all`. That closes the mechanical half of the `agent_cross_runtime` overlay that stayed partial after iteration 3.

## Traceability Checks

- **spec_code — replay, confirmed.** The packet's completion metadata was read in four places rather than one. Three agree at `completion_pct: 100`; the fourth, the closure block in the same document family, says otherwise. `R3-P1-001` stands.
- **agent_cross_runtime (overlay) — partial, improved.** Two claims were separable and only one was settled. *Settled:* the two agent directories carry the same eleven definitions with the same `mode:` values, verified by listing and frontmatter read. *Not settled:* `agent-mirror-crosswalk.md` naming six of eleven agent names remains unread, so whether the crosswalk document omits five or organises them per runtime is still unknown — the same open question iteration 3 deferred, unchanged.
- **feature_catalog_code (overlay) — pass, extended.** The catalog describes dispatch semantics; the compiler's `COMMANDS` table is the maintained definition those semantics are compiled from, and its per-command source lists are exactly the digest sets verified fresh above. Catalog to code to generated artifact is now a checked chain rather than a documented one.
- **checklist_evidence (core) — fail, carried.** `R3-P1-001` is the failing row and this iteration re-confirmed it. `R3-P2-001` (four closed phase children carrying a Draft acceptance-criteria status) was **not** replayed this iteration; it is carried at its filed evidence, not re-verified.
- **P2 replay status, stated exactly.** Two of the ten were touched with fresh evidence: `R4-P2-002` (the literal v1-and-v2 conjunction in the rule engine) is unaffected by anything read here and stands; `R1-P2-002` and `R1-P2-001` were not re-read. The remaining eight — `R1-P2-001`, `R1-P2-003`, `R2-P2-001`, `R2-P2-002`, `R2-P2-003`, `R3-P2-001`, `R3-P2-002`, `R4-P2-001` — were **not** replayed against source this iteration. No P2 is downgraded or withdrawn; all ten carry forward with their filing evidence intact. I am stating this rather than implying a full replay, because only the P1 and the two new surfaces were re-read.

## Ruled Out

- **"The compiled contracts are stale against their sources."** They are not. 61 digests recompute to their exact recorded values across three artifacts, and the compiler hashes whole files under a convention that matches the header's own `section: 'full'` label. Recomputing beat reading the freshness prose. Recorded so the next session does not re-enter it.
- **"A third-version cost also hides in the generated-contract pipeline."** It does not. The compiler's version constant ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:23]) is a contract schema version, not an OpenCode family, and no family literal appears in its source lists — so `R4-P2-001`'s cost estimate of four detectors plus the rule engine stands unrevised.
- **"The CI workflow interpolates an attacker-controlled value into a shell."** Iteration 2 ruled this out; the full read confirms it and adds the DB-isolation launcher and exact version assertions as additional strengths.
- **"The agent mirror directories have drifted."** They have not — eleven files, identical names and sizes, identical `mode:` values.

## Verdict

One P1 re-confirmed, two new P2s, no P0. The P1 was replayed against the same file that produced it and reproduces line for line, so it is not a stale finding; its confidence is high on the divergence and medium on the intent, with a named downgrade trigger. The two P2s land on adjacent surfaces — an assertion that covers one family's configuration shape, and a CI trigger that omits the two directories the assertion would need to cover — and each is read directly from source with no inference in the causal chain.

The packet's strongest evidence this iteration is negative-result evidence: the contract pipeline verifies fresh under recomputation, which is a claim three prior iterations asserted without measuring.

Mapped to the run rather than to new origins this iteration: the registry still holds an active P1, so the run's posture is unchanged and this iteration does not clear it. Reported as CONDITIONAL rather than PASS on that basis — PASS would describe an iteration with no P1 findings, and this iteration has a confirmed P1 among them.

## Next Dimension

None remaining. All four dimensions are covered and this was the fifth and final iteration. The next step is synthesis over the accumulated registry: one P1 for a reconciliation edit, and twelve P2s that are all local and independently actionable.

## SCOPE VIOLATIONS

None. Every write landed inside this run directory (`iterations/`, `deltas/`, `deep-review-strategy.md`); the reviewed target was read only, and the state log is written solely through the append gateway.

Review verdict: CONDITIONAL
