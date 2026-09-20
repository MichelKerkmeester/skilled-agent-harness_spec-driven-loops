# cli-jev shared tier

`shared/` holds packet-shared, workflow-layer helpers that are deliberately non-discoverable: it is
not a packet, carries no `graph-metadata.json`, and never appears in `mode-registry.json`.

This hub currently ships no shared helpers. Anything a future packet needs in common goes here with
its own README, and stays out of the two-axis packet model by design.
