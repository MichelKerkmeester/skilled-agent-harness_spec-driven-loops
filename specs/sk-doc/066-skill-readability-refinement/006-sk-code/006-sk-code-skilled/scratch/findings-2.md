### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md:25 | 8 | The Usage load list is the entry file's index of the three-file tier, but it names only one of the two companions, so a reader following it never reaches the verification part. | Replace line 25 with: "2. **Load** this file and its two companions, [naming-init-formatting-and-css.md](./naming-init-formatting-and-css.md) and [verification-quick-reference-and-related.md](./verification-quick-reference-and-related.md), for a `.js` or `.css` target."

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/mcp-server-authoring.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/mcp-server-authoring.md:38 | 7 | One pre-check packs the launcher, the daemon entrypoint and the socket path into a single sentence, so the three tiers cannot be scanned or checked separately. | Replace line 38 with the lead-in "- [ ] For launcher-backed services, account for the three-tier assembly:" followed by three indented sub-bullets: "- Launcher process"; "- Daemon/server `dist/` entrypoint"; "- Socket path configured through `SPECKIT_IPC_SOCKET_DIR`".

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/python-checklist.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md:30 | 8 | The entry file's Usage sentence acts as the index for the four-part directory but names none of the three remaining files, so the set is not listed anywhere in the file that introduces it. | Replace line 30 with: "Apply this first part with the universal checklist, then continue in order through [p0-safety-and-boundary-discipline.md](./p0-safety-and-boundary-discipline.md), [p1-required.md](./p1-required.md) and [p2-evidence-validation-and-resources.md](./p2-evidence-validation-and-resources.md)."

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md:52 | 7 | The prohibition packs four separate exposure categories into one sentence, so a reader checking a boundary DTO cannot scan what is banned. | Replace line 52 with "Boundary contracts must not expose:" followed by four bullets: "- `usize` or `isize`"; "- borrowed fields"; "- Rust ordinal enum values"; "- integers that exceed JavaScript’s safe range without an explicit `BigInt` or decimal-string contract".

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:164 | 1 | The evidence instruction points at "section 6", which does not exist in this file (the file ends at section 2); the gate sequence is section 4 of the P2 part, so the reference is undefined and the reader cannot find the commands. | Replace "in section 6" with "in [p2-evidence-validation-and-resources.md](./p2-evidence-validation-and-resources.md) §4".

### .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:130 | 1 | The review-evidence template cites `rust_checklist.md`, which does not exist; the Rust checklist is the four files in `rust-checklist/`, so a copied evidence row names a dead file. | Replace line 130 with: "- [ ] Rust standards validated in the `rust-checklist/` files"
