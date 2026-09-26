# Supercov issues observed during the compiler-identity step

No existing product bugs were fixed. Work is isolated to the
`codex/asserted-typescript-analyzer` worktree. The existing `RUST-ASSERT-001`
assertion-phase TODO remains in the runtime calibration.

## RUST-LIBTEST-REBUILD-001: same recorded source identity, different rlib bytes

Status: observed build/reproducibility mismatch; exact cause not isolated. Do not
weaken the attestation checks or assume either binary has different semantics.

Rebuilding the compiler correctly made its old libtest sidecar stale. After
preserving that sidecar outside the build directory and asking the existing
official builder to rebuild it, the builder stopped with:

```text
libtest companion bundle mismatch: the same exact libtest identity produced different artifact bytes
```

The old and freshly built bundles agree on these recorded inputs:

- rustc commit: `59807616e1fa2540724bfbac14d7976d7e4a3860`.
- Host: `aarch64-apple-darwin`.
- Original source SHA-256: `ceef202261b5f75f402676f6213daaf31dd9d6ec7f3ecfec7148b0aee8cfb298`.
- Event runtime SHA-256: `df40a9dcdfbc4d0ba9f2e7ecfe0992b86362fad8ee2f6fa261a2b74a2053aa88`.
- Patched source SHA-256: `7500ccc2020d054e00d780e5597278172b284ee256fb3b2b9c722a1066bdf3e4`.
- Artifact name: `libtest-supercov-v3-59807616e1fa-7500ccc2020d.rlib`.

But the artifact SHA-256 differs:

- Earlier artifact: `42218514478f7fbe1dcb0f534e82259db2bd0b4899d46a422a7e984255fdf8e0`.
- First new artifact: `7fb18f4eb51046f9ae1e59894e2b36b14909306f13c4da6b90c350124aac2d29`.

A second fresh build, using a copied **same new compiler executable**, produced
the earlier `422185...` artifact again. Both new bundles have compiler build ID
`34a10156991a191522ec5d5cdf7399300b7092042b80211865b114e75f1fe7c9`.
Thus compiler build-ID change alone does not explain the two rlib hashes.
Working directories, environment and temporary source paths differed; this is
not yet a controlled one-variable reproduction or proof of nondeterminism.

Evidence retained locally:

- Original bundle + artifact: `/tmp/supercov-identity-bundle.NOGONJ`.
- Failed builder log: `/var/folders/4q/cdhj37516zzbc7z9ckrst0x40000gn/T/supercov-rust-asserted-Oct3We/prepare-libtest.stderr`.
- First successful new build: `/var/folders/4q/cdhj37516zzbc7z9ckrst0x40000gn/T/supercov-rust-asserted-mOnKLe/libtest-build` and the worktree's `spikes/rustc-backend/target/debug` bundle.
- Independent copied-compiler rebuild, sidecar and artifact:
  `/tmp/supercov-libtest-rebuild.qvJfdA`.

The exact failed command is the existing private builder:

```text
target/debug/supercov __build-rust-libtest-companion
  <Rust-1.95.0-sysroot>/lib/rustlib/src/rust/library/test
  <fresh-temporary-build-directory>
  <Rust-1.95.0-sysroot>/bin/rustc
  <worktree>/spikes/rustc-backend/target/debug/supercov-rustc-backend-spike
```

The first rebuild ran from a copied Cargo fixture with
`RUSTFLAGS='--cfg supercov_assertion_identities'` and
`RUSTUP_TOOLCHAIN=1.95.0`. The later copied-compiler build ran from the worktree
without that explicit RUSTFLAGS assignment. Neither variable has been established
as the cause. The builder invokes rustc directly, so Cargo flag propagation must
not be assumed.

Workaround used: preserve both old generated files, then let the official builder
publish a fresh attested bundle. No source edit, attestation edit or deletion of
user data. Future investigation should control environment and source paths,
compare rlib members, and distinguish an unrecorded input from a canonicalization
defect. Add a regression/TODO only after isolating a stable reproduction.
