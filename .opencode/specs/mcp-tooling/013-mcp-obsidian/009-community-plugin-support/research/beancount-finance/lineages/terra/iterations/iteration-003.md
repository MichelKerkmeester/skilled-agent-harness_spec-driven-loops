# Iteration 003 — operational safety and adversarial cases

## Result

The apparent convergence after the core model was treated as telemetry. The final required pass broadened into behavior the plugin does not itself guarantee: parser validity after writes, account state, multi-currency valuation, lot syntax, CSV import hygiene, reconciliation, stale rendered queries, and tool-output limits.

## Confirmed safeguards and omissions

- Transaction creation appends with atomic vault writes and can create backups when configured, but the inspected transaction writer does not establish a local balanced-entry or bean-check gate before append.
- Update and delete locate a transaction by filename and line number from BQL, then replace or remove the matching block with optional backup.
- The unified modal creates transaction, balance, open, close, note, and query directives. Pad is not an available modal operation. Open and close directives are not editable in that modal path.
- The plugin contains an ERRORS query helper. That is a BeanQuery-based diagnostic surface, not proof that every write invokes the bean-check program.
- Price metadata validation uses a restricted source pattern, shell-disabled spawn, and a ten-second source validation timeout. The later price collection run uses a larger timeout.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/transactionDirectives.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/modals/UnifiedTransactionModal.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/queries/index.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/validators.ts]

## AI operating conclusion

An AI should work in a staged flow: resolve the main ledger and include graph, inspect existing account/currency/lot conventions, generate an explicit candidate entry, calculate both sides independently, run a parser/check query, append only to the designated file, then rerun a targeted BQL reconciliation. For CSV, use a generated staging file and a deterministic import identifier such as a link, not a blind append to the primary journal.

This is a recommended protocol, not a claim that the plugin provides CSV import or automatic reconciliation. It turns the plugin’s file-level strengths into a controlled workflow while respecting its validation gaps.

## Convergence record

Iteration 003 reached a 0.58 convergence signal after broadening review angles. The configured max-iterations policy, not convergence, authorizes synthesis.
