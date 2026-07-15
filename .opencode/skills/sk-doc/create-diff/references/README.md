# create-diff — reference route-map

Overflow guidance beyond `SKILL.md`, split into single-concern files. Load the one that matches the concern; do not load everything by default.

| Concern | File |
| --- | --- |
| Which formats are supported and at what fidelity; PDF extractor dependency | [`capabilities-and-fidelity.md`](capabilities-and-fidelity.md) |
| The baseline-before-edit workflow, the explicit-pair fallback, and snapshot lifecycle | [`workflow.md`](workflow.md) |
| Every command, flag, JSON output, and exit code | [`cli-reference.md`](cli-reference.md) |
| What the generated report guarantees for assistive/keyboard/no-JS use | [`accessibility-contract.md`](accessibility-contract.md) |
| An end-to-end walkthrough using the shipped fixtures | [`worked-example.md`](worked-example.md) |

The engine is `../scripts/create_diff.py`; the report safety validator is `../scripts/validate_report.py`. Shared sk-doc markdown standards live at `../../shared/`. This packet has no packet-local advisor metadata.
