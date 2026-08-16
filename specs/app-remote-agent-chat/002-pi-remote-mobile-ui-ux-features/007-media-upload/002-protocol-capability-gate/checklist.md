# Checklist — Protocol Contracts and Fail-Closed Capability Gate

- [ ] Existing text prompt, steer, follow-up, plan, approval, sync, and cache tests pass.
- [ ] Malformed prompt-submit data and every pixel-bearing submission shape are rejected before relay business logic.
- [ ] Runtime snapshot data is the sole source of active-model capability and host limits.
- [ ] A text-only model reports `imageIn: false`; the client does not infer capability from a model label.
- [ ] With `PI_REMOTE_MEDIA_ENABLED` unset or not `1`, no attachment route is registered and no UI photo action exists.
- [ ] Existing read-only routes retain their prior behavior and authorization semantics.
- [ ] New DTOs and guards reject unknown keys, invalid digests, invalid ordinals, out-of-range values, filenames, paths, base64, and pixels.
- [ ] Unknown transcript kinds remain safely preserved or rendered as unknown without media assumptions.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test` exits 0.
- [ ] `npm run test:web` exits 0.
- [ ] Focused protocol guard and existing relay/web suites exit 0.
- [ ] A real CDP run uses exactly 390 CSS px in light and dark themes with media disabled.
- [ ] The CDP evidence shows no photo rows, no attachment rail, and no changed text-composer layout.
- [ ] The scoped worktree contains only intended implementation changes and repository-permitted generated output.

