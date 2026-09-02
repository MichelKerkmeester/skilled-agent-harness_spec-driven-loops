# Iteration 003 — implementation, test, template, and flag seam audit

## Focus

Trace live code imports and process-management rules that keep the memory server alive; inspect package/install scripts, shared embeddings and IPC helpers, deep-loop reducers/tests, plugin tests, templates, feature catalogs, manual playbooks, `.env.example`, `ENV-REFERENCE.md`, and ignore rules. Separate delete-only code from shared advisor/HF infrastructure and from historical benchmark prose.

## Required evidence

- Cite source and test anchors for every implementation seam that must change after consumer rewiring.
- Inventory server-owned versus shared package/workspace dependencies.
- Classify `SPECKIT_*`, `MEMORY_*`, socket, DB, launcher, and CLI flags as delete, rewire, or retain/exception.
- Confirm tests and manual-testing playbooks that would become false or fail after phases 002/003.
- Continue to iteration 004 even if the convergence ratio falls below threshold.
