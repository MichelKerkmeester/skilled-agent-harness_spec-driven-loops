VERDICT: FIX

- [P1] .skilled/skills/sk-git/references/quick-reference.md:115 | 9 | The fenced shell example changed despite the requirement to preserve code blocks; its placeholder also changes the concrete command. | Replace `SPECKIT_COMMIT_SPEC='<spec-folder>' \` with `SPECKIT_COMMIT_SPEC=sk-git/028-crawlable-commit-history/003-contract-and-hook \`.
- [P1] .skilled/skills/sk-git/references/quick-reference.md:123 | 9 | The fenced lookup examples changed despite the requirement to preserve code blocks. | Restore `git log -E --grep='^Spec: sk-git/028'` and `git log --fixed-strings --grep='Commit-Id: 0009113'`.

All 16 validator runs exited 0 with no blocking errors. Fifteen had no render warnings; the remaining `render_h2_numbering` warning is on the inbound-frozen `8b.` heading, so keeping it unchanged is justified. This review made no edits.