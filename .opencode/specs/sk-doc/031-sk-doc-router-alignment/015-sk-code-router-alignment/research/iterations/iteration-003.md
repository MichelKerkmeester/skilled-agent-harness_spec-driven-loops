# Iteration 3: Runtime Influence of Intent Signals, Resource Maps, and Defaults

## Focus

This iteration investigated how `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` influence recall outside the already-established deterministic assembly path. The narrow interpretation was the boundary between hub packet selection, benchmark replay, and actual leaf-file loading. The phrase “always-loaded” is ambiguous across those layers, so this iteration preserves that ambiguity rather than treating benchmark assembly as proof of live file reads.

## Findings

1. The hub's route contract selects a workflow packet and zero-or-more surface packets through `mode-registry.json` and `hub-router.json`, then loads only their `SKILL.md` entrypoints. That route function does not read the parent `INTENT_SIGNALS`, `RESOURCE_MAP`, or `DEFAULT_RESOURCE` projection, so those structures do not directly determine hub packet selection. [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-120]
2. The authoritative prose intent model is richer than its machine projection: prose scoring uses request text, target files, known context, and a +5 phase boost, while the benchmark projection explicitly omits phase boosts and doc-only anti-signals. Consequently, machine-signal recall is an intentionally lossy proxy for the human/runtime routing contract rather than an exact model of it. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:46-89] [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:298-307]
3. The benchmark corpus itself documents a concrete blind spot: Mode A replays prompt text only, while sk-code's intended surface decision also uses CWD and target paths. The contamination-clean loadspeed scenario therefore leaves positive intent/resource gold empty and defers the expected PERFORMANCE resources to live Mode B. Prompt-only misses in this class cannot establish live leaf-file recall. [SOURCE: .opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:1-18] [INFERENCE: the fixture's explicit non-penalizing empty gold prevents Mode A from measuring the stated live resource expectation]
4. `DEFAULT_RESOURCE` has three distinct scopes that should not be collapsed: the parent projection seeds every deterministic parent replay with four raw preamble paths; each surface packet declares a different packet-local default set; and the hub route loads packet entrypoints (or `shared/README.md` on fallback), not those declared leaf defaults. The statement that defaults are “always loaded” is therefore confirmed for deterministic replay and declared surface contracts, but actual automatic leaf reads remain unverified without live load telemetry. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:309-343] [SOURCE: .opencode/skills/sk-code/code-webflow/SKILL.md:53-85] [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:43-73] [SOURCE: .opencode/skills/sk-code/SKILL.md:78-120]

## Ruled Out

- Assuming the parent machine-readable router directly drives hub mode/surface packet selection; the hub's documented route function uses registry and hub-router decisions instead. [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-120]
- Treating prompt-only Mode A misses as proof of live leaf-file misses when CWD/target-path evidence is intentionally absent. [SOURCE: .opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:18]

## Dead Ends

None promoted. The two ruled-out interpretations are scope distinctions, not exhausted optimization directions.

## Edge Cases

- Ambiguous input: “influence outside the deterministic assembly path” could mean hub packet selection, human-guided leaf reads, or live executor telemetry. This iteration chose the narrow hub-versus-live-loading boundary and defers executor telemetry.
- Contradictory evidence: the smart-router prose says the default preamble is loaded on every route, while the hub route function only names packet `SKILL.md` entrypoints and fallback `shared/README.md`. The evidence supports a projection/contract-versus-runtime-scope distinction, but no live trace confirms automatic leaf reads. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:309-318] [SOURCE: .opencode/skills/sk-code/SKILL.md:78-120]
- Missing dependencies: live Mode B file-load telemetry was not present in the consulted evidence; the existing private fixture explicitly defers its positive resource expectation to that lane. [SOURCE: .opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:18]
- Partial success: the influence boundary is established for hub routing and Mode A, but live leaf-read behavior remains unresolved. Status is `complete` because the iteration produced cited, in-scope findings and answered the narrower benchmark-versus-runtime question.

## Sources Consulted

- `.opencode/skills/sk-code/SKILL.md:40-179`
- `.opencode/skills/sk-code/shared/references/smart_routing.md:1-180,298-572`
- `.opencode/skills/sk-code/code-webflow/SKILL.md:45-139`
- `.opencode/skills/sk-code/code-opencode/SKILL.md:42-131`
- `.opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:1-18`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:24-136`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:1-396`

## Assessment

- New information ratio: 0.88 (3 fully new findings and 1 partially new finding: `(3 + 0.5) / 4 = 0.875`, rounded to 0.88)
- Questions addressed: How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` influence recall outside deterministic assembly?
- Questions answered: How do these structures influence Mode A and hub packet selection, and why does that not establish live leaf-file recall?

## Reflection

- What worked and why: Separating the hub's packet-entrypoint route from the parent and packet-local machine projections exposed which claims are executable hub behavior, benchmark behavior, and authored contract.
- What did not work and why: Static sources could not prove actual executor leaf reads; the available fixture expressly defers that observation to live Mode B.
- What I would do differently: In a follow-up, inspect one existing live Mode B trace with file-load evidence before reading more routing prose, then compare its loaded leaves against the parent projection and packet-local defaults.

## Recommended Next Focus

Verify the smallest available live Mode B or manual-playbook trace that records actual leaf files loaded after a hub packet is selected. Compare those reads with the packet-local `DEFAULT_RESOURCE` and matched `RESOURCE_MAP` entries, while preserving Mode A as a separate prompt-only proxy. If no such trace exists, record live leaf recall as unmeasured rather than inferring it from deterministic replay.
