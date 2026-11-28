## B-2

- Status: handed_off
- Severity: P1
- File: .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md:34
- Reason: The code root is wrong and not the doc, so the order is fixed in 015 and the doc keeps the order the runtime should have.
- Evidence: `rg -n 'routine-fatigued' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` exits 1, so the cause the reference names is not in the registry.

## C-3

- Status: rebutted
- Severity: P2
- File: .skilled/skills/system-skilled-bots/README.md:12
- Reason: The sentence describes the manifest the skill ships in its own tree, and the compiled front door is a different artifact.
- Evidence: `rg -n 'activation manifest' .skilled/skills/system-skilled-bots/README.md` exits 0 and the line names the skill's own tree.
