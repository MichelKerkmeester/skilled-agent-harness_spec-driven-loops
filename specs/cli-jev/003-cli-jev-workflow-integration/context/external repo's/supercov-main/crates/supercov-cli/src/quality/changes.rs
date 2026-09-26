//! Which change to review, and the two versions of every file in it.
//!
//! Three ranges cover the three moments a review is wanted: before a commit,
//! before a push, and on a pull request. They differ only in where `before` and
//! `after` are read from, so one selector serves all three and any later command
//! that works on a change can take the same flags.
//!
//! Whole files are read, never hunks. A hunk cannot answer whether a change
//! introduced a property or whether the file already had it, which is the whole
//! question, so the extra tokens are the point rather than an oversight.

use std::path::{Path, PathBuf};
use std::process::Command;

/// Where the two versions of each file come from.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Range {
    /// Working tree against the index: what is not yet staged.
    Unstaged,
    /// Index against HEAD: what a commit would contain.
    Staged,
    /// Working tree against the **merge base** with this ref, which is where
    /// the branch left it, not its current tip. Comparing against a tip that
    /// has moved on would report other people's code as this change.
    Base(String),
}

impl Range {
    pub fn describe(&self) -> String {
        match self {
            Range::Unstaged => "unstaged changes".into(),
            Range::Staged => "staged changes".into(),
            Range::Base(reference) => format!("changes since this branch left {reference}"),
        }
    }

    /// How the range names itself in a saved record, stable across runs.
    pub fn id(&self) -> String {
        match self {
            Range::Unstaged => "unstaged".into(),
            Range::Staged => "staged".into(),
            Range::Base(reference) => format!("base:{reference}"),
        }
    }
}

/// How a file was changed. A deletion cannot introduce anything, so it is not
/// reviewed; it is still reported so the count matches what Git says changed.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Kind {
    Added,
    Modified,
    Deleted,
}

/// One changed file with both of its versions already read.
#[derive(Clone, Debug)]
pub struct Change {
    pub path: String,
    pub kind: Kind,
    /// Empty for an added file, which has no previous version.
    pub before: String,
    /// Empty for a deleted file.
    pub after: String,
    /// The unified diff for this path, used only when both versions together
    /// exceed the request budget.
    pub patch: String,
}

impl Change {
    pub fn reviewable(&self) -> bool {
        self.kind != Kind::Deleted && !self.after.is_empty()
    }
}

fn git(root: &Path, arguments: &[&str]) -> Result<Vec<u8>, String> {
    let output = Command::new("git")
        .current_dir(root)
        .args(arguments)
        .output()
        .map_err(|e| format!("cannot run git: {e}"))?;
    if !output.status.success() {
        let message = String::from_utf8_lossy(&output.stderr);
        let message = message.trim();
        return Err(if message.is_empty() {
            format!("git {} failed", arguments.join(" "))
        } else {
            format!("git {}: {message}", arguments.join(" "))
        });
    }
    Ok(output.stdout)
}

fn text(root: &Path, arguments: &[&str]) -> Result<String, String> {
    let bytes = git(root, arguments)?;
    String::from_utf8(bytes).map_err(|_| "git returned output that is not UTF-8".to_string())
}

/// A blob at a revision. The empty revision is the index, because `git show`
/// spells a staged blob `:path` with nothing before the colon.
///
/// Failures are reported, never swallowed. An earlier version returned an empty
/// string for any error, which turned a malformed revision spec into a silent
/// comparison against nothing: every property looked introduced and detection
/// quietly weakened instead of failing. A file that genuinely has no previous
/// version is an addition, and the caller already knows that from Git.
fn blob(root: &Path, revision: &str, path: &str) -> Result<String, String> {
    let spec = format!("{revision}:{path}");
    let bytes = git(root, &["show", &spec]).map_err(|e| format!("cannot read {spec}: {e}"))?;
    String::from_utf8(bytes).map_err(|_| format!("{spec} is not UTF-8"))
}

/// The branch this repository is compared against when nobody says.
///
/// `origin/HEAD` is what the remote itself calls its default branch, so it is
/// asked first and needs no guessing. A clone made with `--single-branch`, or
/// one whose `origin/HEAD` was never fetched, does not have it, and the two
/// conventional names are tried instead.
pub fn default_branch(root: &Path) -> Option<String> {
    if let Ok(name) = text(
        root,
        &["symbolic-ref", "--quiet", "refs/remotes/origin/HEAD"],
    ) && let Some(branch) = name.trim().strip_prefix("refs/remotes/")
    {
        return Some(branch.to_owned());
    }
    ["origin/main", "origin/master", "main", "master"]
        .into_iter()
        .find(|candidate| {
            git(
                root,
                &["rev-parse", "--verify", &format!("{candidate}^{{commit}}")],
            )
            .is_ok()
        })
        .map(str::to_owned)
}

/// What to review when the caller did not say.
///
/// Work in progress first, because someone running this in a working tree with
/// uncommitted edits means those edits. With a clean tree it means the branch:
/// everything since this branch left the default one. Neither is a guess a user
/// has to correct, and the report names which it chose.
pub fn automatic(root: &Path) -> Range {
    // A hidden directory belongs to a tool, including this one: Supercov's own
    // response cache is untracked, so counting it would make every tree look
    // dirty and this choice would never reach the branch.
    let dirty = |arguments: &[&str]| {
        text(root, arguments).is_ok_and(|out| {
            out.lines().any(|path| {
                !path.trim().is_empty() && !path.split('/').any(|segment| segment.starts_with('.'))
            })
        })
    };
    if dirty(&["diff", "--name-only"]) || dirty(&["ls-files", "--others", "--exclude-standard"]) {
        return Range::Unstaged;
    }
    if dirty(&["diff", "--cached", "--name-only"]) {
        return Range::Staged;
    }
    match default_branch(root) {
        Some(branch) => Range::Base(branch),
        None => Range::Unstaged,
    }
}

pub fn is_repository(root: &Path) -> bool {
    git(root, &["rev-parse", "--git-dir"]).is_ok()
}

/// The commit a range is measured against, for the record a review saves.
pub fn head(root: &Path) -> Option<String> {
    text(root, &["rev-parse", "HEAD"])
        .ok()
        .map(|s| s.trim().to_owned())
}

/// Where the branch left the named ref.
///
/// `runs patch` resolves a base the same way and for the same reason. The error
/// names the usual cause, because a shallow CI checkout has no merge base at
/// all and the git message alone does not say so.
fn merge_base(root: &Path, reference: &str) -> Result<String, String> {
    text(root, &["merge-base", reference, "HEAD"])
        .map(|s| s.trim().to_owned())
        .map_err(|error| format!(
            "{error}\nCould not find where this branch left {reference}. A shallow checkout has \
             no merge base: fetch with enough history (actions/checkout uses fetch-depth: 0), and \
             make sure {reference} exists locally."
        ))
}

/// The arguments that select this range, shared by every git call that needs it.
/// The base is already resolved to a commit by the caller.
fn selector<'a>(range: &'a Range, resolved: &'a str) -> Vec<&'a str> {
    match range {
        Range::Unstaged => vec![],
        Range::Staged => vec!["--cached"],
        Range::Base(_) => vec![resolved],
    }
}

/// Where the command is running, relative to the repository root.
///
/// Git speaks in repository-relative paths. A user who runs this in a
/// subdirectory means the paths they can see, so paths are translated rather
/// than matched by basename, which would attribute one `index.ts` to another.
fn prefix(root: &Path) -> Option<String> {
    let top = text(root, &["rev-parse", "--show-toplevel"]).ok()?;
    let top = std::fs::canonicalize(top.trim()).ok()?;
    let here = std::fs::canonicalize(root).ok()?;
    let rest = here
        .strip_prefix(&top)
        .ok()?
        .to_string_lossy()
        .replace('\\', "/");
    (!rest.is_empty()).then(|| format!("{rest}/"))
}

fn patch(root: &Path, range: &Range, resolved: &str, path: &str) -> String {
    let mut arguments = vec!["diff", "-U3"];
    arguments.extend(selector(range, resolved));
    arguments.extend(["--", path]);
    text(root, &arguments).unwrap_or_default()
}

fn name_status(root: &Path, range: &Range, resolved: &str) -> Result<Vec<(Kind, String)>, String> {
    let mut arguments = vec!["diff", "--name-status", "--no-renames", "-z"];
    arguments.extend(selector(range, resolved));
    let raw = text(root, &arguments)?;
    // -z separates every field with NUL, so a path containing a newline or a
    // quote survives. Fields alternate status, path, status, path.
    let mut fields = raw.split('\0').filter(|s| !s.is_empty());
    let mut out = Vec::new();
    while let (Some(status), Some(path)) = (fields.next(), fields.next()) {
        let kind = match status.chars().next() {
            Some('A') => Kind::Added,
            Some('D') => Kind::Deleted,
            _ => Kind::Modified,
        };
        out.push((kind, path.to_owned()));
    }
    Ok(out)
}

/// Every changed file in the range, with both versions read.
///
/// `only` restricts the review to paths the user named, matched as a prefix so
/// naming a directory reviews the changes inside it.
pub fn collect(root: &Path, range: &Range, only: &[PathBuf]) -> Result<Vec<Change>, String> {
    if !is_repository(root) {
        return Err("quality patch needs a Git repository; run it inside one".into());
    }
    let resolved = match range {
        Range::Base(reference) => merge_base(root, reference)?,
        _ => String::new(),
    };
    let prefix = prefix(root);
    // A path Git reports is repository-relative; keep only what is under this
    // directory and name it the way the user would.
    let relocate = |path: String| -> Option<String> {
        match prefix.as_ref() {
            Some(prefix) => path.strip_prefix(prefix).map(str::to_owned),
            None => Some(path),
        }
    };
    let wanted = |path: &str| {
        only.is_empty()
            || only.iter().any(|p| {
                let p = p.to_string_lossy().trim_end_matches('/').to_owned();
                path == p || path.starts_with(&format!("{p}/"))
            })
    };

    let mut listed = name_status(root, range, &resolved)?;
    // A file Git does not track yet is entirely new and is a change the author
    // made, so it is reviewed. `git diff` never mentions it. Staged work is the
    // exception: an untracked file is by definition not in the index.
    if *range != Range::Staged {
        for path in text(root, &["ls-files", "--others", "--exclude-standard", "-z"])?
            .split('\0')
            .filter(|s| !s.is_empty())
        {
            // Everything under a hidden directory belongs to a tool, including
            // this one: reviewing a real commit in a repository that had been
            // assessed reported 393 changed files, 391 of them Supercov's own
            // response cache. Git lists them because nothing ignores them;
            // nobody changed them.
            if path.split('/').any(|segment| segment.starts_with('.')) {
                continue;
            }
            listed.push((Kind::Added, path.to_owned()));
        }
    }

    let mut out = Vec::new();
    for (kind, path) in listed {
        let Some(path) = relocate(path) else { continue };
        if !wanted(&path) {
            continue;
        }
        // The empty revision is the index: `git show :path`.
        let (before_rev, after_rev) = match range {
            Range::Unstaged => ("", None),
            Range::Staged => ("HEAD", Some("")),
            Range::Base(_) => (resolved.as_str(), None),
        };
        let repository_path = match prefix.as_ref() {
            Some(prefix) => format!("{prefix}{path}"),
            None => path.clone(),
        };
        let before = if kind == Kind::Added {
            String::new()
        } else {
            blob(root, before_rev, &repository_path)?
        };
        let after = match (kind, after_rev) {
            (Kind::Deleted, _) => String::new(),
            (_, Some(revision)) => blob(root, revision, &repository_path)?,
            (_, None) => std::fs::read_to_string(root.join(&path)).unwrap_or_default(),
        };
        let patch = patch(root, range, &resolved, &repository_path);
        out.push(Change {
            path,
            kind,
            before,
            after,
            patch,
        });
    }
    out.sort_by(|a, b| a.path.cmp(&b.path));
    out.dedup_by(|a, b| a.path == b.path);
    Ok(out)
}

/// The first line the change adds, so a CI annotation can point somewhere.
///
/// A named property is a fact about a file rather than about one line, so this
/// anchors a finding at the start of the change instead of pretending to know
/// which line caused it.
pub fn first_added_line(patch: &str) -> Option<u32> {
    for line in patch.lines() {
        let Some(rest) = line.strip_prefix("@@ ") else {
            continue;
        };
        let after = rest.split(" +").nth(1)?;
        let number = after.split([',', ' ', '@']).next()?.parse::<u32>().ok()?;
        return Some(number.max(1));
    }
    None
}
