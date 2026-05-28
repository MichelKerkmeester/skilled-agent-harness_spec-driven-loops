# Bundle-gate fixture

The output must produce `scripts/check.cjs` that imports `vitest/config`
and calls `defineConfig({})`. Running the script must exit 0.

If a non-existent vitest export is invented, grep would pass but smoke-run
fails. This is the canonical test for the 3-layer bundle gate.
