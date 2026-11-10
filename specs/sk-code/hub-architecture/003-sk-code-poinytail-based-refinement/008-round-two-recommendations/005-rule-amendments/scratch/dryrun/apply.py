#!/usr/bin/env python3
# Planning dry run: applies the proposed amendments to COPIES under dryrun/tree.
# Each old string must occur exactly once or the run stops.
import sys
from pathlib import Path

TREE = Path(sys.argv[1]) / ".skilled" / "repo-rules"

PREVENT = [
    (
        "past the move you can justify.\n\n---\n\n## 2. THE PRE-WRITE PASS",
        "past the move you can justify.\n\n"
        "**A short diff is not a cheaper move when the next reader has to decode it.** "
        "A one-liner that packs two decisions into one expression moves the cost to every later reader, "
        "who must rebuild the intent before they can check it. "
        "When two moves cost the same, the one that handles the edge cases correctly wins.\n\n"
        "---\n\n## 2. THE PRE-WRITE PASS",
    ),
    (
        "2. **What does it touch?** If the change can break a caller or a shared contract, name\n"
        "   the owning module, one real caller (`file:line`), and the contract that must not\n"
        "   break. No real caller means the change is smaller than you think, or the code\n"
        "   should not exist either.\n",
        "2. **What does it touch?** If the change can break a caller or a shared contract, name\n"
        "   the owning module, one real caller (`file:line`) and the contract that must not\n"
        "   break. Then list the tests, fixtures, config and exports the change must reach. No\n"
        "   real caller means the change is smaller than you think, or the code should not exist\n"
        "   either.\n",
    ),
    (
        "`blast-radius.md` pass, because installing mutates the environment.\n\n---\n\n## 5. WHAT THIS RULE IS NOT",
        "`blast-radius.md` pass, because installing mutates the environment.\n\n"
        "**Moves and merges.** Moved or merged code keeps its error handling and validation. "
        "Dropping a check during a move is a behavior change that needs its own reason.\n\n"
        "---\n\n## 5. WHAT THIS RULE IS NOT",
    ),
    (
        "  speculative.\n\n---\n\n## 6. SELF-CHECK",
        "  speculative.\n\n"
        "- **Not a reason to cut accessibility.** Restraint never cuts accessibility on user-facing UI: "
        "interactive elements stay keyboard-operable, carry an accessible name and keep a visible focus state.\n\n"
        "---\n\n## 6. SELF-CHECK",
    ),
    (
        "- [ ] Named the move and wrote the climbing sentence for every move past \"build nothing\".\n",
        "- [ ] Named the move and wrote the climbing sentence for every move past \"build nothing\".\n"
        "- [ ] When two moves cost the same, I took the one that handles the edge cases correctly. "
        "A shorter diff that the next reader must decode did not count as cheaper.\n",
    ),
    (
        "- [ ] Where the change touches a caller or a shared contract, I named the owner, one real caller and the contract before editing.",
        "- [ ] Where the change touches a caller or a shared contract, I named the owner, one real caller and the contract before editing. "
        "I listed the tests, fixtures, config and exports it must reach.",
    ),
    (
        "- [ ] Every performance claim carries a measurement, and every new dependency names what the project's own tools could not do.",
        "- [ ] Every performance claim carries a measurement, and every new dependency names what the project's own tools could not do.\n"
        "- [ ] Moved or merged code kept its error handling and validation. "
        "Every check dropped during a move has its own stated reason.\n"
        "- [ ] Restraint did not cut accessibility on user-facing UI, where interactive elements stay keyboard-operable, "
        "carry an accessible name and keep a visible focus state.",
    ),
    ("version: 1.0.1.2\n", "version: 1.0.1.3\n"),
]

EVIDENCE = [
    (
        "Every substantive turn ends with an honest status. Four things, briefly:",
        "Every substantive turn ends with an honest status. Five things, briefly:",
    ),
    (
        "4. **The state of the work:** edited / committed / pushed / dirty, and which branch.\n",
        "4. **The state of the work:** edited / committed / pushed / dirty, and which branch.\n"
        "5. **Known residual risk.** Any risk the operator must weigh before relying on the work, "
        "such as an untested path or a state that could not be checked. "
        "Write \"none known\" when there is none.\n",
    ),
    (
        "- [ ] The close-out says what failed and what is inferred, not only what worked.\n",
        "- [ ] The close-out says what failed and what is inferred, not only what worked.\n"
        "- [ ] The close-out names any known residual risk the operator must weigh. "
        "It says \"none known\" when there is none.\n",
    ),
    ("version: 1.1.1.2\n", "version: 1.1.1.3\n"),
]


def apply(name, edits):
    path = TREE / name
    text = path.read_text(encoding="utf-8")
    for old, new in edits:
        count = text.count(old)
        if count != 1:
            sys.exit(f"{name}: expected 1 match, found {count}: {old[:70]!r}")
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")
    print(f"{name}: {len(edits)} edits applied")


apply("prevent-overengineering.md", PREVENT)
apply("evidence-and-proof.md", EVIDENCE)
