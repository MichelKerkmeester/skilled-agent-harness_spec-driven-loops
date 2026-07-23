# Iteration 1: Q1 / Thread 1 — Minimum Useful Null-Hub Helper

## Focus

Stress-test the fallback-resource rule without re-deriving the Run 1 keep/flip verdict. The narrow interpretation of “child hints” is the child packets’ documented `UNKNOWN_FALLBACK` checklists and route maps, rather than loading every child packet’s full resource set.

## Findings

1. The full `mode-registry.json` is not a minimal null-state helper: it carries all 12 workflow entries, including packet identity, command, aliases, tool surfaces, and advisor metadata. The hub instead classifies with `hub-router.json`, then resolves the matching registry entry only after a mode is selected. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-160] [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-95]
2. The live null-hub behavior already has a small *semantic* contract: with low confidence, contradiction, or no winning mode under `defaultMode: null`, it loads `shared/references/quick_reference.md` and asks for workflow mode, target component, inputs, and validation expectations. But the configured default resource is a quality/optimizer cheat sheet, not a cross-mode choice card. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-14] [SOURCE: .opencode/skills/sk-doc/SKILL.md:77-97] [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:2-16] [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:64-145]
3. The second-layer router and representative children favor scoped, on-demand loading: no keyword match confirms artifact and intent before loading anything, and full inventory is explicit-only. Child fallbacks first request child-specific discriminators, then load a thin route map that points to one needed concern; this makes a child hint useful only after a candidate child is already ranked. [SOURCE: .opencode/skills/sk-doc/shared/references/smart_routing.md:8-9] [SOURCE: .opencode/skills/sk-doc/shared/references/smart_routing.md:207-214] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:56-92] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:69-124] [SOURCE: .opencode/skills/sk-doc/create-command/references/README.md:21-38] [SOURCE: .opencode/skills/sk-doc/create-quality-control/references/README.md:21-35]
4. The committed payload sizes make indiscriminate helper loading hard to justify: `quick_reference.md` is 14,132 bytes, the full registry is 10,515 bytes, `hub-router.json` is 5,937 bytes, and the two representative child route maps are 3,942 and 3,804 bytes. The minimum plausible improvement is therefore a newly generated compressed disambiguation card: defer reason; zero to two ranked candidate mode labels with one discriminating alias each; the four hub confirmation fields; and a child hint only for an already-ranked candidate. This is a proposal, not a measured token floor. [SOURCE: command output: wc -c .opencode/skills/sk-doc/{mode-registry.json,hub-router.json,shared/references/quick_reference.md,create-command/references/README.md,create-quality-control/references/README.md}] [INFERENCE: based on the source topology and payload-size comparison above]

## Ruled Out

- Unconditional full-registry injection as the null fallback: it includes routing-adjacent metadata and all child surfaces, while the hub contract already separates classification from entry resolution. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:17-160] [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-95]
- An unconditional child-specific hint before ranking a candidate: each inspected child asks for information that presupposes its own domain, so it cannot resolve a genuine zero-signal hub request. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:81-92] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:105-124]

## Dead Ends

- Committed sources provide byte-size proxies, not a token budget or route-accuracy experiment; they cannot establish an exact numerical minimum payload.
- The existing shared quick reference is not a neutral fallback-menu specimen, so its size cannot be treated as the target card size. [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:2-16] [SOURCE: .opencode/skills/sk-doc/shared/references/quick_reference.md:64-145]

## Edge Cases

- Ambiguous input: “child hints” was interpreted as child `UNKNOWN_FALLBACK` checklists and route maps; exhaustive child-content loading was deferred because it would violate the narrow focus. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:56-92] [SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md:69-124]
- Contradictory evidence: none found.
- Missing dependencies: `memory_match_triggers` timed out before local research. It was an optional retrieval accelerator; direct committed-source reads supplied the evidence.
- Partial success: the iteration completed from local evidence, but the exact token floor and routing lift remain unmeasured.

## Sources Consulted

- .opencode/skills/sk-doc/mode-registry.json:17-160
- .opencode/skills/sk-doc/hub-router.json:4-50
- .opencode/skills/sk-doc/SKILL.md:55-101
- .opencode/skills/sk-doc/shared/references/smart_routing.md:8-9, 207-214
- .opencode/skills/sk-doc/create-command/SKILL.md:56-92
- .opencode/skills/sk-doc/create-quality-control/SKILL.md:51-124
- .opencode/skills/sk-doc/shared/references/quick_reference.md:2-16, 64-145
- .opencode/skills/sk-doc/create-command/references/README.md:15-38
- .opencode/skills/sk-doc/create-quality-control/references/README.md:15-35
- command output: `wc -c` payload-size comparison

## Assessment

- New information ratio: 0.88
- Questions addressed: Q1 / thread 1 — fallback helper payload and its measurable tradeoff.
- Questions answered: none; the candidate payload is evidence-backed, but its minimum effective size requires a controlled routing evaluation.

## Reflection

- What worked and why: comparing the hub’s explicit defer branch with registry topology and two child fallback patterns separated selection metadata from post-selection guidance, avoiding a repeat of the Run 1 default-policy verdict.
- What did not work and why: the optional memory trigger timed out, and source inspection cannot measure whether a card changes live model decisions; the necessary behavioral evidence is absent from committed documents.
- What I would do differently: run a bounded fixture set with no-helper, compact-card, full-registry, and conditional-child-hint arms, logging correct resolution, wrong-mode selection, clarification turns, and added input tokens.

## Recommended Next Focus

Complete Q1’s empirical boundary: define the smallest card as the first payload that improves correct post-defer resolution over defer-only without increasing wrong-mode selection, then compare it against full-registry and conditional-child-hint controls on zero-signal, weak-signal, and ambiguous prompts. [INFERENCE: the committed sources define fallback semantics and candidate components but no outcome metric]
