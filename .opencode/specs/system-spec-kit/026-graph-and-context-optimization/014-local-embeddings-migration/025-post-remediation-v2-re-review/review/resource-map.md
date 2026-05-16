# Resource Map — Post-Remediation V2 Re-Review

| Surface | Files Scanned | P0 | P1 | P2 | Notes |
|---------|---------------|----|----|----|-------|
| Claude command mirrors | 4 | 0 | 12 | 0 | Claude mirrors duplicate stale doctor command DB boundaries and hardcoded probes. |
| OpenCode command surfaces | 4 | 0 | 5 | 7 | Doctor command prompt sources and YAML assets still contain singleton and dtype-less Voyage DB mutation boundaries. |
| OpenCode install guides | 1 | 0 | 2 | 1 | Install guide README still has stale provider count, first-run resolver, and llama-cpp-only troubleshooting examples. |
| CocoIndex skill documentation | 5 | 0 | 10 | 6 | Voyage Code 3 remains the visible cloud default/alternative in multiple README, install, settings, SKILL, and template surfaces. |
| System Spec Kit documentation | 7 | 0 | 3 | 5 | Provider counts, cascade wording, quality claims, and profile filename examples drift from post-014 defaults. |
| System Spec Kit MCP install guide | 1 | 0 | 12 | 0 | Singleton DB, ONNX dependency, backup/restore, and troubleshooting commands still describe pre-profile-keyed defaults. |
| System Spec Kit tests and fixtures | 3 | 0 | 1 | 5 | Fixtures and embedding tests still encode singleton or dtype-less profile filenames and hf-local-only auto expectations. |
| System Spec Kit code and scripts | 7 | 0 | 1 | 6 | Comments, setup config notes, eval/migration helpers, and shared code still name stale singleton/Nomic/Voyage Code 3 assumptions. |
| Root config and release docs | 3 | 0 | 5 | 0 | Root MCP config/release examples still expose stale cascade, performance, MiniLM, or singleton DB guidance. |
| Gemini command mirrors | 2 | 0 | 0 | 2 | Gemini mirrors inherit stale doctor command DB boundary examples. |

Note: `Files Scanned` counts unique finding-bearing files per surface from the iteration findings. The iteration summaries report broad sweeps ranging from 51 to 5010 files per pass, but they do not break total scanned files down by surface family.

