#!/usr/bin/env python3
"""Apply the phase 4 crossing fixes to copies. Refuses unless each marker is unique."""
import sys
from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {count}")
    return text.replace(old, new)


def main() -> None:
    spec_path = Path(sys.argv[1])
    research_path = Path(sys.argv[2])

    spec = spec_path.read_text()

    # S1: the Level 2 NFR anchor marks the Level 2 heading only. The body is shared
    # with Level 3, so a pair that spans it would close inside a deeper gate.
    spec = replace_once(
        spec,
        "<!-- ANCHOR:nfr -->\n## L2: NON-FUNCTIONAL REQUIREMENTS\n<!-- /IF -->",
        "<!-- ANCHOR:nfr -->\n## L2: NON-FUNCTIONAL REQUIREMENTS\n<!-- /ANCHOR:nfr -->\n<!-- /IF -->",
        "S1-open",
    )
    spec = replace_once(
        spec,
        "- **NFR-R02**: [Error rate - e.g., <1%]\n<!-- /ANCHOR:nfr -->\n<!-- /IF -->",
        "- **NFR-R02**: [Error rate - e.g., <1%]\n<!-- /IF -->",
        "S1-close",
    )

    # S2: the Level 2 edge-cases anchor marks the Level 2 heading only, and the
    # missing close after the Level 2-only bullet is restored so Level 3 keeps
    # the State Transitions block.
    spec = replace_once(
        spec,
        "<!-- ANCHOR:edge-cases -->\n## L2: EDGE CASES\n<!-- /IF -->",
        "<!-- ANCHOR:edge-cases -->\n## L2: EDGE CASES\n<!-- /ANCHOR:edge-cases -->\n<!-- /IF -->",
        "S2-open",
    )
    spec = replace_once(
        spec,
        "### Error Scenarios\n"
        "- External service failure: [Fallback behavior]\n"
        "<!-- IF level:2,3 -->\n"
        "- Network timeout: [Retry strategy]\n"
        "<!-- IF level:2 -->\n"
        "- Concurrent access: [Conflict resolution]\n"
        "\n"
        "### State Transitions\n"
        "- Partial completion: [Recovery behavior]\n"
        "- Session expiry: [User experience]\n"
        "<!-- /ANCHOR:edge-cases -->\n"
        "<!-- /IF -->\n"
        "<!-- /IF -->",
        "### Error Scenarios\n"
        "- External service failure: [Fallback behavior]\n"
        "<!-- IF level:2,3 -->\n"
        "- Network timeout: [Retry strategy]\n"
        "<!-- /IF -->\n"
        "<!-- IF level:2 -->\n"
        "- Concurrent access: [Conflict resolution]\n"
        "<!-- /IF -->\n"
        "\n"
        "### State Transitions\n"
        "- Partial completion: [Recovery behavior]\n"
        "- Session expiry: [User experience]",
        "S2-body",
    )

    s3_start = "<!-- IF level:2 -->\n<!-- ANCHOR:questions -->\n## 10. OPEN QUESTIONS"
    s3_end = "<!-- IF level:1 -->\n<!-- ANCHOR:questions -->\n## 7. OPEN QUESTIONS\n<!-- /IF -->"
    s3_new = (
        "<!-- IF level:2 -->\n"
        "<!-- ANCHOR:questions -->\n"
        "## 10. OPEN QUESTIONS\n\n"
        "- [Question 1 requiring clarification]\n"
        "- [Question 2 requiring clarification]\n"
        "<!-- /ANCHOR:questions -->\n"
        "<!-- /IF -->\n"
        "<!-- /IF -->\n"
        "<!-- IF level:1 -->\n"
        "<!-- ANCHOR:questions -->\n"
        "## 7. OPEN QUESTIONS\n\n"
        "- [Question 1 requiring clarification]\n"
        "- [Question 2 requiring clarification]\n"
        "<!-- /ANCHOR:questions -->\n"
        "<!-- /IF -->"
    )
    start = spec.index(s3_start)
    end = spec.index(s3_end, start) + len(s3_end)
    spec = spec[:start] + s3_new + spec[end:]

    s4_start = "<!-- ANCHOR:questions -->\n## 16. OPEN QUESTIONS"
    s4_end = (
        "<!-- IF level:1,2,3 -->\n"
        "- [Question 2 requiring clarification]\n"
        "<!-- /ANCHOR:questions -->\n"
        "<!-- /IF -->"
    )
    s4_new = (
        "<!-- IF level:3+ -->\n"
        "<!-- ANCHOR:questions -->\n"
        "## 16. OPEN QUESTIONS\n\n"
        "- [Question 1 requiring clarification]\n"
        "- [Question 2 requiring clarification]\n"
        "<!-- /ANCHOR:questions -->\n"
        "<!-- /IF -->\n"
        "<!-- /IF -->\n"
        "<!-- IF level:3 -->\n"
        "<!-- ANCHOR:questions -->\n"
        "## 12. OPEN QUESTIONS\n\n"
        "- [Question 1 requiring clarification]\n"
        "- [Question 2 requiring clarification]\n"
        "<!-- /ANCHOR:questions -->\n"
        "<!-- /IF -->\n"
        "<!-- /IF -->"
    )
    start = spec.index(s4_start)
    end = spec.index(s4_end, start) + len(s4_end)
    spec = spec[:start] + s4_new + spec[end:]

    spec_path.write_text(spec)

    research = research_path.read_text()
    research = replace_once(
        research,
        "<!-- ANCHOR:core-architecture -->\n<!-- IF level:2,3,3+,phase -->",
        "<!-- IF level:2,3,3+,phase -->\n<!-- ANCHOR:core-architecture -->",
        "R1",
    )
    research = replace_once(
        research,
        "<!-- ANCHOR:changelog-updates -->\n<!-- /IF -->\n## CHANGELOG & UPDATES",
        "<!-- /IF -->\n<!-- ANCHOR:changelog-updates -->\n## CHANGELOG & UPDATES",
        "R2",
    )
    research = replace_once(
        research,
        "<!-- ANCHOR:integration-patterns -->\n<!-- /IF -->\n<!-- IF level:3,3+,phase -->",
        "<!-- /IF -->\n<!-- IF level:3,3+,phase -->\n<!-- ANCHOR:integration-patterns -->",
        "R3",
    )
    research_path.write_text(research)
    print("applied S1-S4 and R1-R3")


if __name__ == "__main__":
    main()
