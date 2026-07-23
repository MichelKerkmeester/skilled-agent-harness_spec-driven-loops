# Iteration 14: Auto/Confirm Intake Policy

## Focus
Prevent both exhaustive questionnaires and silent high-impact assumptions.

## Findings
1. **Three intake states:** `resolved` when brief fields and route are clear; `auto-resolvable` when a bounded, reversible assumption cannot alter route/acceptance; `confirmation-required` when an answer changes route, artifact identity, destructive action, acceptance criteria, or access boundary. This turns progressive intake into deterministic behavior.
2. **Assumption ledger:** every auto-filled field records `{field, assumedValue, rationale, reversibility, impact}` in `Resolved Brief`. Never ask for information already observable in supplied context, owned system, or target artifact.
3. **Single checkpoint:** bundle all confirmation-required decisions into one concise prompt after context/brief resolution and before exemplar acquisition or mutation. Offer a recommendation and defaults. Do not serially interrogate users.
4. **Mandatory confirm:** overwrite/delete; authenticated or private capture; new external transmission; audit mutation; selecting among materially different direction families; changing preserved identity/content; or missing canonical URL/output target for design-reference. Optional direction review may be offered for high-fidelity design, but is not mandatory when the user explicitly requested autonomous execution.
5. **Auto-safe:** source reads within declared scope, `no-fit` fallback, reversible advisory specs, axis/reference selection, bounded subject/job assumptions, and non-mutating static/audit analysis. Any executor-level permission flag remains separate from design approval.

## Decision Table
| Situation | Action |
|---|---|
| Missing detail does not alter route/proof | assume + ledger |
| Missing detail alters mode or acceptance | ask once |
| Destructive/overwrite/private access | confirm |
| User requested autonomous direction | choose one coherent direction + ledger |
| Multiple plausible aesthetics but same acceptance | choose, do not offer a menu |
| Evidence unavailable | lower proof label, do not block unless acceptance requires it |

## Ruled Out
- Mandatory exhaustive brief forms.
- Unlimited silent assumptions under an `auto` label.
- Confusing CLI tool permissions with creative-direction approval.

## Assessment
- New information ratio: 0.46
- Novelty justification: Converts progressive intake into an auditable three-state decision policy with one checkpoint and explicit mandatory-confirm classes.

## Recommended Next Focus
Define router/mode architecture and the exact context envelope so command templates orchestrate without duplicating sk-design doctrine.
