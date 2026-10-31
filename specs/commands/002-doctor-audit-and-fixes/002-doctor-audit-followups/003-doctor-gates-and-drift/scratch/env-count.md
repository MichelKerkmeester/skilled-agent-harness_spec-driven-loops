# ENV-REFERENCE.md variable recount

Method (the document's own sentence): unique backticked names in the `Variable` column of every table below the count sentence. A table counts when its header row has a cell exactly equal to `Variable`; every backticked token in that column's cells is one name; names are deduplicated across tables. Script: a Python pass that splits each table row on unescaped pipes, takes the `Variable` column, and collects ``...`` tokens.

```
tables [(40, 'gov', 10), (70, 'Variable', 25), (104, 'gov', 3), (134, 'Variable', 13), (156, 'Variable', 26), (191, 'Variable', 4), (202, 'Variable', 4), (217, 'Variable', 14), (254, 'Variable', 12), (281, None, 0), (293, 'Variable', 5), (307, 'Variable', 4), (322, 'Variable', 18), (349, 'Variable', 13), (375, 'Variable', 8), (391, 'Variable', 3), (403, 'Variable', 1), (413, 'Variable', 5)]
Variable-column unique: 154
plus governing-env-var column: 158
['SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP', 'SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR', 'SPECKIT_ENTITY_CONFIG_PATH', 'SPECKIT_PI_DIRECTIVE_DEDUP']
non-identifier tokens in Variable column: []
```

Result: 154 by the stated method. The earlier 158 comes from also counting the flag tables' `governing env var` column, which adds the four names listed above. The sentence at line 34 now states 154 and names the four extra names and the 158 total, so both counts are reproducible.

Sentence after the fix:

34:Total unique variables documented: 154, counted as unique backticked names in the `Variable` column of every table below. Recount with that method when adding rows. Multi-variable cells count once per name. The flag tables name their variables in a `governing env var` column instead, so the four names that appear only there (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`, `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`, `SPECKIT_ENTITY_CONFIG_PATH`, `SPECKIT_PI_DIRECTIVE_DEDUP`) sit outside this count; with them the document names 158. Every documented name must have a verified reader in source; a name with no reader is removed rather than kept as history.
