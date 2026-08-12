# Iteration 2: Security

## Dimension
security

## Files Reviewed
- `.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py`
- `.opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py`
- `.opencode/skills/sk-doc/sk-create-diagram/scripts/README.md`
- `.opencode/skills/sk-doc/sk-create-diagram/scripts/validate-flowchart.sh`
- `.opencode/skills/sk-doc/sk-create-diagram/references/foundations/onboarding.md`

## Findings by Severity

### P0
None.

### P1
None.

### P2

- **F-S-001**: Extract `--out` writes to an arbitrary filesystem path with no confinement. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:958]
  - Same pattern in `mermaid_extract.py:1411`. `scripts/README.md:86` documents writes to `--out` or stdout as the only mutation. The CLIs are agent-invoked and the agent already has Write, so this does not expand a network/untrusted-user attack surface; it is missing defense-in-depth (no resolve-against-source-dir, no reject of absolute paths outside the workspace).
  - findingClass: path-confinement
  - scopeProof: direct read of both `main()` `--out` branches; grep found no subprocess/eval/http in either extractor
  - affectedSurfaceHints: ["drawio_extract.py", "mermaid_extract.py"]

## Traceability Checks
Not this iteration.

## Ruled Out
- XXE / DTD expansion: `_reject_unsafe_xml` rejects `<!DOCTYPE` and `<!ENTITY` before parse. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59]
- Mermaid code execution: no `eval`/`exec`/`subprocess`/`urlopen`; click targets counted and discarded per module docstring. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py:7]
- Packet-owned network fetch during onboarding: onboarding.md states fetch is performed by the calling session; packet tool surface has no network-fetch tool. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/references/foundations/onboarding.md:38]
- Secrets in skill tree: none observed in extractors or SKILL.md.

## Adversarial self-check
No P0 candidates. `--out` considered for P1 (arbitrary write) and downgraded: callers are the same agent that already holds Write/Bash.

## Claim adjudication
None required (no new P0/P1).

## Verdict
PASS with advisories.

## Next Dimension
traceability — leaf-manifest path drift after phase 008, command-metadata vs ascii-markdown merge, hub-router alias parity.

Review verdict: PASS
