# Iteration 5: Playbook scenarios and isolation

## Dimension

Traceability — playbook scenario presence, stable IDs, index wiring, and throwaway-vault isolation.

## Evidence

The exact inventory found 11/11 scenario files, IDs, and overview links. Ten scenarios use a throwaway vault or repository. `OBS-011` instead uses only `LEDGER="${TMPDIR:-/tmp}/mcp-obsidian-playbook.beancount"` and describes a scratch ledger: [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/beancount-transaction.md:24-29] and [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/beancount-transaction.md:36-50]. The full index is [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:315-325].

## Findings by severity

### P1 — F002

Beancount’s playbook does not create or use a throwaway vault. It can prove a balanced ledger append but not the required vault-isolation boundary. Recommendation: wrap it in a disposable vault fixture, or document an approved standalone-file exception with equivalent isolation proof.

F001 remains active.

## Typed adjudication

The claim was confirmed by reading the complete OBS-011 scenario and comparing its setup and cleanup with the other ten tie-ins. The standalone-ledger explanation was considered but does not satisfy the stated throwaway-vault rule. Final severity P1, confidence 0.94.

Review verdict: CONDITIONAL
