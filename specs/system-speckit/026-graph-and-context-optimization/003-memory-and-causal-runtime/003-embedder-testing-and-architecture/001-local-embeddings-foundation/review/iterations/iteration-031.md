# Deep Review v3 Iteration 031 - 011 docs and blocker

**Dimension:** documentation  
**Commit reviewed:** d76f3b795

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No documentation-only P0. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V3-011-002 | `011-embeddinggemma-unification/scratch/blocker.md:19` | The blocker file now points at the wrong remaining fix. | The manual patch it asks for at lines 19-21 is already reflected in `.codex/config.toml:16`, `:21-22`, and `:42`; the remaining launcher-parity defect is the actual command at `.codex/config.toml:10-11`. | Replace this blocker with the live blocker: route Codex through `spec-kit-memory-launcher.cjs` or add equivalent `.env.local` loading. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | Prompt-asymmetry documentation is accurate. | `shared.py:43-53` maps `google/embeddinggemma-300m` to `InstructionRetrieval` and explicitly says document prompts are not applied; `011/implementation-summary.md:63` says the same. | Keep the asymmetry note; make it a follow-on, not a blocker. |

## Notes
The "doc-prompt asymmetry" caveat is one of the cleaner parts of 011. The stale blocker text is the risky part because it sends the next operator to patch strings that are already patched.
