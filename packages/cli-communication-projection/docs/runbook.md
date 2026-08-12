# Release runbook

1. Build and verify with `npm ci`, `npm run check`, and
   `npx vitest run --config vitest.config.ts test/release`.
2. Run `npm pack --dry-run`; confirm only package metadata, `dist`, and `docs`
   are present. Inspect the final tarball before distribution.
3. Install the exact tarball into a clean consumer and import every public
   subpath using [install.md](./install.md).
4. Choose local-only, hosted, or mixed privacy explicitly. Confirm there is no
   undeclared fallback.
5. Run the compatibility doctor with fresh runtime, protocol, provider, model,
   privacy, and presentation evidence.
6. Run the deterministic six-runtime injected rehearsal and verify the
   local-only transport spy records zero hosted calls.
7. Operator-run prerequisite: execute the real live credentialed provider smoke
   in the approved environment. Supply credential references through the
   approved secret store; never record values, prompts, responses, or raw
   transcript content. This step is deliberately outside automated tests.
8. Operator-run prerequisite: complete the powered, blinded HUMAN
   non-inferiority study. Proxy or synthetic scores are diagnostic only and do
   not authorize release.
9. Assemble fresh provider, runtime, fidelity, privacy, evaluation, doctor, and
   strict-validation evidence. Release only when the fail-closed gate returns
   `release-ready`.
10. Retain the previous exact tarball and rehearse [rollback.md](./rollback.md)
    before rollout.

Stop and select original-only mode on any missing, stale, provisional,
contradictory, or failed release prerequisite.
