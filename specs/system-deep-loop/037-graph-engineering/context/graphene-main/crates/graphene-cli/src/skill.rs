//! The agent skill, compiled into the binary.
//!
//! `gr init` writes it into a repository. Shipping it inside `gr` means the
//! prose an agent reads and the binary it drives are the same artifact and
//! cannot drift apart between machines.

use std::path::{Path, PathBuf};

use rust_embed::Embed;

#[derive(Embed)]
#[folder = "$CARGO_MANIFEST_DIR/../../skill/"]
struct Skill;

pub const INSTALL_DIR: &str = ".claude/skills/graphene";

pub struct Installed {
    pub root: PathBuf,
    pub written: Vec<String>,
    pub skipped: Vec<String>,
}

/// Write the skill into `root`. Existing files are left alone unless `force`.
pub fn install(root: &Path, force: bool) -> std::io::Result<Installed> {
    let target = root.join(INSTALL_DIR);
    let mut written = Vec::new();
    let mut skipped = Vec::new();

    for name in Skill::iter() {
        let Some(file) = Skill::get(&name) else { continue };
        let path = target.join(name.as_ref());
        if path.exists() && !force {
            skipped.push(name.to_string());
            continue;
        }
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        std::fs::write(&path, file.data.as_ref())?;
        written.push(name.to_string());
    }

    written.sort();
    skipped.sort();
    Ok(Installed { root: target, written, skipped })
}

/// Every file the skill ships, so a test can assert the binary carries it.
pub fn manifest() -> Vec<String> {
    let mut v: Vec<String> = Skill::iter().map(|n| n.to_string()).collect();
    v.sort();
    v
}
