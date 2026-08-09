//! `gr init` is how the skill reaches a repository. A binary that ships an
//! incomplete skill teaches an agent half a workflow, so what it writes is
//! asserted against what the repository holds.

use std::path::{Path, PathBuf};

fn skill_dir() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../../skill").canonicalize().unwrap()
}

fn tmp() -> PathBuf {
    let d = std::env::temp_dir().join(format!(
        "graphene-init-{}-{}",
        std::process::id(),
        std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos()
    ));
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn shipped() -> Vec<String> {
    let root = skill_dir();
    let mut out = Vec::new();
    let mut stack = vec![root.clone()];
    while let Some(dir) = stack.pop() {
        for entry in std::fs::read_dir(&dir).unwrap().filter_map(|e| e.ok()) {
            let p = entry.path();
            if p.is_dir() {
                stack.push(p);
            } else {
                out.push(p.strip_prefix(&root).unwrap().to_string_lossy().replace('\\', "/"));
            }
        }
    }
    out.sort();
    out
}

#[test]
fn the_binary_carries_every_file_the_skill_ships() {
    assert_eq!(
        graphene_cli::skill::manifest(),
        shipped(),
        "the embedded skill and the repository's skill have drifted"
    );
}

#[test]
fn init_writes_the_skill_and_creates_the_store() {
    let root = tmp();
    let installed = graphene_cli::skill::install(&root, false).unwrap();

    assert_eq!(installed.written, shipped());
    assert!(installed.skipped.is_empty());
    assert!(root.join(".claude/skills/graphene/SKILL.md").exists());
    assert!(root.join(".claude/skills/graphene/references/decomposition.md").exists());
    assert!(root.join(".claude/skills/graphene/examples/BAD-monolith.json").exists());
}

/// Running it twice must not clobber a skill someone has edited.
#[test]
fn init_is_safe_to_run_again() {
    let root = tmp();
    graphene_cli::skill::install(&root, false).unwrap();

    let edited = root.join(".claude/skills/graphene/SKILL.md");
    std::fs::write(&edited, "locally edited").unwrap();

    let again = graphene_cli::skill::install(&root, false).unwrap();
    assert!(again.written.is_empty(), "nothing is overwritten by default");
    assert_eq!(again.skipped, shipped());
    assert_eq!(std::fs::read_to_string(&edited).unwrap(), "locally edited");

    let forced = graphene_cli::skill::install(&root, true).unwrap();
    assert_eq!(forced.written, shipped());
    assert!(std::fs::read_to_string(&edited).unwrap().contains("Graphene"));
}

#[test]
fn the_installed_skill_is_byte_for_byte_what_the_repository_holds() {
    let root = tmp();
    graphene_cli::skill::install(&root, false).unwrap();
    for name in shipped() {
        let a = std::fs::read(skill_dir().join(&name)).unwrap();
        let b = std::fs::read(root.join(".claude/skills/graphene").join(&name)).unwrap();
        assert_eq!(a, b, "{name} differs from what the repository ships");
    }
}
