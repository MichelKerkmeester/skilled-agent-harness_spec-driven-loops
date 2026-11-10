# Iteration 013 — v4.0.0.0 and v4.0.0.16, cluster claims only

## Focus

The two releases whose notes had never been read against the tree: `v4.0.0.0` (the hub consolidation, the seven-executor roster, the retired deep router and the evidence ledger) and `v4.0.0.16` (private surfaces, lane resume, pi Terra). Scope held to the four cluster paths. Registry-retired subjects were excluded up front by a keyword sweep of the prior 106 findings: lane resume, operator-edit quarantine, `dispatchId` generation and the gateway identity row are already evidenced and were not re-opened.

## Actions Taken

1. Read both release notes whole, then extracted only the claims that name a cluster path or a cluster behaviour.
2. Swept `findings-registry.json` for `verdict, resume, dispatch id, gateway, state-log, ROUTER.md, jev, Terra, quarantine, dup` to build the exclusion list before choosing claims.
3. Checked three `v4.0.0.0` claims against the tree: the retired deep router agent, the `smart-routing.md` to root `ROUTER.md` move, and the pi roster plus its default.
4. Checked two `v4.0.0.16` claims: `gpt-6.1-terra` in the deep-loop path, and the pi fast-mode priority tier.
5. Followed the roster claim into the file that defines it, which surfaced the flat-price comment in F1.

## Findings

### F1 — P2 — drift + misalignment — a routing comment still argues from the billing claim v4.0.0.0 retracted

The fan-out slot for `glm-5.3-flash` is justified in-code by "The fan-out slot goes to DevPass because it bills a flat-price plan rather than per token." [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:250]

The same release note states the opposite: "A claim that it is a flat-price subscription was wrong. It bills per token at ordinary list rates. The plan buys credits at a three-times bonus, which discounts the bill rather than removing it." The note then measures exactly this model and finds a 48.6% saving at GLM's 28%-of-prompt cached-read rate, which is the arithmetic a flat-price story cannot produce.

- Release introduced: v4.0.0.0 (the comment and the retraction landed in the same release; the comment was never revisited).
- Why it matters: the comment is the durable WHY for a provider choice. A maintainer re-ranking fan-out cost reads a false premise and can move the slot on it. It is also a comment-hygiene miss by this repository's own standard, since the surviving comment states a claim rather than the fact that justifies it.
- Confidence: high. Both texts were read this iteration.
- Verify: `grep -n "flat-price" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` against the release note's "What the Caching Is Actually Worth" section.

### F2 — P2 — improvement (operator UX) — a playbook PASS criterion is pinned to a source line range and to a literal roster count

Row PI-017 verifies the pi allowlist with `sed -n '210,256p'` against `executor-config.ts` and declares PASS for "Ten IDs are listed" naming all ten literals. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md:46]

The roster now spans lines 228 to 251 with `PI_DEFAULT_MODEL` at 256, so the pinned range over-reads eighteen lines of preceding comment and ends one line short of the closing `] as const;`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:236] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:256]

- Release introduced: v4.0.0.16, whose `083-gpt-6-1-terra-roster` entry appended terra and moved the roster from six ids to ten. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.16.0.md:24]
- Status: latent, not active. The range still covers the list today, so the row passes; it fails silently the first time anyone edits above line 210.
- Why it matters: the check a human runs to confirm the roster is the check that rots first, and it rots without an error. The ten literals also have to be edited by hand on every roster change, which is the same duplication the release line's own routing findings keep recording.
- Confidence: medium. The overlap and the gap are measured; the token cost of maintaining it is a judgment.
- Verify: `sed -n '228,251p' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | grep -c "^  '"` — counts the ids actually in the list; compare with the row's literal list.

### Claims checked and found true (recorded so the release is not read as verified-empty)

- **v4.0.0.0, "there is no router agent left to call."** `.skilled/agents` holds twelve entries and `.opencode/agents` holds the deep pair only; no `deep.md` or `deep-loop.md` router persona survives, and the `@deep-loop` grep hits only the runtime package name `@deep-loop/runtime`. Verified.
- **v4.0.0.0, "the second-stage router ... moved to a root `ROUTER.md`."** `ROUTER.md` exists at the hub root and names its own provenance. [SOURCE: .skilled/skills/system-deep-loop/ROUTER.md:3] Every remaining `smart-routing` reference is in a historical changelog, which the move's own entry explicitly permits. [SOURCE: .skilled/skills/system-deep-loop/changelog/v1.4.3.0.md:15] Verified.
- **v4.0.0.0, "Pi runs a closed ... roster with DeepSeek V4.1 Flash as its default."** `PI_DEFAULT_MODEL` is `deepseek-v4.1-flash-1017`; the roster is a `readonly` const tuple behind `isPiModelAllowed`. Verified. The note's "six-provider" arithmetic was not independently confirmed, because bare literals such as `minimax-m3` resolve their provider outside this file.
- **v4.0.0.16, "pi runs GPT-6.1 Terra in deep loops."** Present in the allowlist and the fan-out accepts it; the cli-pi reference marks it dispatch-verified. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:65] Verified.

## Questions Answered

None of the three strategy key questions closed this iteration. F1 and F2 are new instances inside a release read, not answers to the open hub-canon, UX or executor-failure questions.

## Questions Remaining

- **Executor failure handling** (v4.0.0.3, v4.0.0.16) — ninth iteration carried. Still unread: what a single-executor run records for a devin `resource_exhausted`, or a builder throw.
- **Hub canon** (v4.0.1.0) — `package_skill.py --strict` conformance across the hub and its seven modes. Structural routing is proven; the parent-hub check is not.
- **v4.0.0.16 fast-mode half** — "Pi's fast mode also sends GPT-6.1 Terra on the priority service tier". A `priority` grep over `.pi/extensions/pi-fast-mode-w-subagent-support` matched only benchmark fixtures, no source, so the claim is neither confirmed nor refuted. Needs the tier map read directly.
- **UX** — two of three `*-presentation.txt` assets remain unread; the `deep-research-*` twin has never been compared against the `deep-review-*` instances.
- **Over-engineering** — `runtime-capabilities.json` plus the un-called `dispatchSeat` seam, blast radius still unchecked.
- **F1's runtime repro** — confirming `--bogus-flag` returns exit 0 through the gateway needs write authority the leaf does not have.

## Next Focus

Iteration 14 should take the executor-failure question, which has now survived nine deferrals and is the only remaining key question whose subject is a run-time outcome rather than a document: read what the single-executor path writes when an executor returns a quota error, and state whether a run can change executor without archiving its research tree. Second priority is the hub-canon conformance run, which is a single command against nine packets.
