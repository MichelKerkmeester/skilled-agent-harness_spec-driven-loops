# Iteration 2 — Beancount directive and inventory model

## Focus

Primary Beancount documentation review of the directive grammar and the inventory model that the plugin reads and writes through its generated files.

## Findings

1. Beancount directives begin with an ISO date and a directive type. Declarations are re-sorted chronologically after parsing, so file order is not the semantic order. Non-transaction directives apply at the beginning of their date; a transaction on the same date is processed after them. This explains why the plugin’s include order is organizational rather than a substitute for date correctness. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

2. `open` is `YYYY-MM-DD open Account [ConstraintCurrency,...] ["BookingMethod"]`. The open date must be no later than every posting date to that account; the physical location of the line in an included file does not matter. Currency constraints limit postings, and booking methods control ambiguous cost-lot reductions. `close` is `YYYY-MM-DD close Account`; postings after the close date are errors, but close does not automatically assert a zero balance. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

3. Accounts are colon-separated names rooted in `Assets`, `Liabilities`, `Equity`, `Income`, or `Expenses`. A posting can cause a simple, no-cost commodity to go negative; the root account type does not impose a sign constraint. A file-layer AI must therefore distinguish legal negative cash/credit balances from invalid negative cost-basis inventory. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://beancount.github.io/docs/how_inventories_work/]

4. A transaction header is `YYYY-MM-DD [txn|Flag] [[Payee] Narration]`; following indented lines are postings. Each posting is `Account Amount [Cost] [@ Price]`, and at most one amount may be elided for Beancount to interpolate. The non-negotiable invariant is that posting weights sum to zero in every balancing currency. The plugin’s transaction renderer can emit inferred postings, but an AI should prefer explicit amounts when importing or reconciling because an inferred amount can hide a classification error. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

5. Posting weight is determined in priority order: amount alone contributes its amount/currency; amount plus `@` contributes units multiplied by the per-unit price in the price currency; amount plus `{cost}` contributes units multiplied by the cost in the cost currency; when both cost and price exist, cost controls balancing and price is informational/price-database input. `@` is per-unit conversion and `@@` is total conversion. Cost and price magnitudes are unsigned; negative cost/price annotations are invalid. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

6. Multi-currency transactions balance through explicit conversion prices or through a posting whose amount is in the balancing currency. Example: `-400 USD @ 1.09 CAD` balances `436.01 CAD` subject to inferred precision/tolerance. A raw `-400 USD` and `436.01 CAD` pair does not balance because the units are different and no conversion weight is supplied. Operating currency is reporting configuration; it does not change ledger processing semantics. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

7. Cost-basis lots use `{number currency}`, optionally with a lot date and quoted label; total cost uses `{{...}}` in the plugin’s renderer model. Acquisitions create distinct lots unless commodity and all cost attributes match exactly. Reductions select lots by matching any supplied cost/date/label attributes; `{}` means no explicit selector. If multiple lots match and the reduction is not exactly the total matched quantity, default strict booking raises an ambiguity error; FIFO/LIFO can select oldest/newest lots where configured. [SOURCE: https://beancount.github.io/docs/how_inventories_work/] [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

8. A cost-basis reduction must have enough matching units. Reducing a lot at the wrong cost, or reducing more units than the matching inventory contains, fails; Beancount normally rejects a resulting negative quantity for a commodity held at cost. This is distinct from a currency account going negative. An AI must query `position`, `cost(position)`, and lot detail before generating a sale or transfer. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://beancount.github.io/docs/how_inventories_work/]

9. `balance` is `YYYY-MM-DD balance Account Amount [~ Tolerance]` and checks the stated commodity at the beginning of that date. It checks units, not total cost, and each assertion checks only one commodity; multiple currencies require multiple assertions. Lots of the same commodity are aggregated for the assertion. Parent-account assertions include descendant balances, but the parent must itself be opened. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

10. `pad` is `YYYY-MM-DD pad Account AccountPad`. It inserts a synthetic `P` transaction before the subsequent balance assertion, using the difference and the source account. It has no commodity argument, affects commodities with corresponding assertions, is benign without a subsequent assertion, cannot be unused, and is not suitable for positions held at cost. Multiple pads for the same account/commodity are currently invalid. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

11. `note` is `YYYY-MM-DD note Account Description`; it attaches a dated account comment and has no posting or balancing effect. `commodity` is `YYYY-MM-DD commodity Currency` with optional metadata and is optional for using a currency; duplicate commodity declarations are errors. `price` is `YYYY-MM-DD price Commodity Amount`, a dated base-to-quote rate used for valuation and conversion. Multiple prices for a commodity on the same day resolve to the last one in file/parsed order. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

12. `include "relative/path.beancount"` splits the ledger. Relative paths resolve from the including file; includes are collected by the loader rather than processed as a strict textual macro. The plugin’s `ledger.beancount` therefore acts as the root, and every generated target file must be reachable through an include. A file-layer AI should check that a newly created file is included before interpreting a successful write as visible to bean-query. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

13. Beancount’s `query` directive is `YYYY-MM-DD query Name SqlContents` and is experimental in the language reference; the plugin writes named queries to `queries.beancount` and exposes them through inline `bql-q:<name>` processing. The directive’s date is an implicit close boundary in the older language reference, so stored query definitions should use a stable date and should not be confused with the plugin’s live fenced BQL blocks, which execute the supplied query against the configured ledger. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts]

## Ruled Out

- `operating_currency` does not convert or rebalance postings; it is a reporting option.
- `balance` cannot assert total cost-basis value; it asserts units of one commodity.
- `pad` is not a generic cost-basis initializer and cannot safely fill investment lots.
- Include textual order is not the primary semantic ordering rule; dates are.

## Dead Ends

- The official syntax manual is older than the current v3 runtime in some wording and marks some sections as evolving. The invariant-level rules were cross-checked against the official inventory/trading pages and will be paired with beanquery’s current grammar in iteration 3.

## Edge Cases

- Same-day `open`/`close`/`balance`/`pad` semantics are date-bound, not line-bound.
- A balance assertion can pass while an unasserted second commodity remains wrong.
- A transaction can be syntactically valid but fail on weight imbalance, currency constraints, unopened/closed accounts, or cost-lot selection.
- A price annotation on a costed posting does not make that sale balance at market value; cost remains the balancing weight.
- An empty inferred posting may be accepted by the parser but can conceal missing capital-gain or fee legs.

## Sources Consulted

- [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]
- [SOURCE: https://beancount.github.io/docs/how_inventories_work/]
- [SOURCE: https://beancount.github.io/docs/trading_with_beancount/]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts]

## Assessment

The plugin’s generated files are ordinary Beancount input. The AI operating at the file layer must validate two contracts independently: syntactic/directive validity and accounting/inventory invariants. The most dangerous false positive is a successful append to a valid target file whose ledger is then rejected by bean-check because of chronology, weights, or lots.

## Reflection

The directive model is date-driven and inventory-aware. A safe workflow therefore reads the ledger’s current open accounts, balances, prices, and positions before writing; filename placement is a routing concern, while the loader’s chronological view is the accounting concern.

## Recommended Next Focus

Beanquery/BQL grammar and plugin query processors: exact statements, columns, functions, grouping, ordering, output formats, dashboard query idioms, and bean-price CLI behavior.
