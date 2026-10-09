# Deep Research — Iteration 3

- Run: fanout-luna-max-fast-1791552201492-cjjo4q
- Focus: Ponytail hook lifecycle, state, and portability mechanisms versus sk-code's current adapters
- Status: complete
- New information ratio: 1.0

## Focus

Which Ponytail hook, state, and cross-runtime portability mechanisms can improve sk-code surfaces without violating its read-first, scope, and verification floors?

## Actions Taken

- Read Ponytail's UserPromptSubmit lifecycle hook and its regression tests for normal EOF and open-stdin behavior.
- Compared the hook's bounded exit behavior with the sk-code Claude and Codex PostToolUse quality adapters, their runtime timeouts, and the existing multi-runtime delivery contract.
- Compared the proposal with the prior refinement's hook recommendations and recorded one bounded, previously unproposed adapter resilience idea.

## Findings

1. **NEW:** Give the Claude and Codex PostToolUse quality adapters a short adapter-local stdin deadline and an open-stdin regression case. Ponytail exits promptly on normal EOF and has a one-second fallback for a stalled stdin stream, with tests asserting both the fast EOF path and self-exit before an external watchdog; sk-code's adapters read stdin to EOF and currently rely on each host's 10-second timeout. This narrows the failure window for a wrapper that fails to close stdin without changing the hook's fail-open policy. Sources: `specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-mode-tracker.js:160-178`; `specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/hooks.test.js:776-817`; `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs:43-47`; `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs:35-39`; `.claude/settings.json:200-207`; `.codex/hooks.json:105-112`; `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:66,82-84`.

## Questions Answered

- Which Ponytail hook, state, and cross-runtime portability mechanisms can improve sk-code surfaces without violating its read-first, scope, and verification floors? **Answered:** the useful transplant is a bounded, self-owned stdin watchdog and its regression fixture at the external-hook boundary. The prior report covers prompt-injection and persistent-state tradeoffs but does not name this EOF-specific adapter safeguard.

## Questions Remaining

- Which Ponytail benchmark and correctness gates could improve sk-code benchmark and advisor tooling?
- Which earlier recommendations are already adopted, lost, or still new after checking the current two-axis hub and every relevant tooling surface?

## Rejected Transfers

- Do not adopt Ponytail's global intensity state or always-on per-turn instruction injection: the earlier refinement explicitly rejects the persistent mode flag and always-on prompt injection, while the current hub selects a workflow mode and bundles read-only surface evidence through its two-axis router. Sources: `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:82-84`; `.skilled/skills/sk-code/SKILL.md:52-71`.

## Assessment

This is a targeted hardening idea for the command-hook adapters, not a request to replace their host-specific protocols or their current fail-open behavior. The existing shared routing, bounded checker budgets, and cross-runtime delivery table remain the contract; only the stdin acquisition edge and a deterministic regression fixture need consideration. Source evidence confirms the host registrations cap execution at ten seconds, but does not establish that any current runtime actually hangs on stdin in this checkout. The improvement is preventive and should be validated on the host wrappers it targets before adoption.

## Reflection

The portable-skill lesson is not to reproduce Ponytail's mode tracking. Its regression case shows a narrower transferable principle: test that the adapter process can terminate by itself when a host fails to complete the expected stream protocol, as well as remaining fast when the protocol succeeds.

## Recommended Next Focus

Inspect Ponytail's benchmark and correctness gates against sk-code's existing benchmark reports, correctness controls, and skill-advisor probe battery. Keep any proposed metric behind the existing correctness gate and avoid creating a parallel benchmark framework.

## Sources Consulted

- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-mode-tracker.js:132-178`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/hooks.test.js:776-817`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:3-5,45-49`
- `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs:43-47`
- `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs:35-39`
- `.claude/settings.json:200-207`
- `.codex/hooks.json:105-112`
- `.skilled/hooks/post-edit-quality/README.md:60-72`
- `.skilled/skills/sk-code/SKILL.md:52-71`
- `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:66,82-84`
