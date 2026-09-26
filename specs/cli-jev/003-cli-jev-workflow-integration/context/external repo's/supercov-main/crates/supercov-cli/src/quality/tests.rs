use super::*;
use std::sync::atomic::{AtomicUsize, Ordering};

static NEXT: AtomicUsize = AtomicUsize::new(0);

struct Temp(PathBuf);
impl Temp {
    fn new() -> Self {
        let path = std::env::temp_dir().join(format!(
            "supercov-quality-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(&path).unwrap();
        Self(path.canonicalize().unwrap())
    }
    fn write(&self, path: &str, text: &str) {
        let target = self.0.join(path);
        fs::create_dir_all(target.parent().unwrap()).unwrap();
        fs::write(target, text).unwrap();
    }
}
impl Drop for Temp {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}

#[test]
fn discovery_honors_ignores_deduplicates_and_checks_scope() {
    let temp = Temp::new();
    temp.write(".gitignore", "ignored.ts\n");
    temp.write("src/a.ts", "export const a = 1;");
    temp.write("src/.hidden.ts", "hidden");
    temp.write("src/ignored.ts", "ignored");
    temp.write("src/node_modules/lib/index.js", "dependency");
    // Build output, because a Cargo package sits beside it.
    temp.write("src/Cargo.toml", "[package]\nname = \"a\"\n");
    temp.write("src/target/lib.rs", "build");
    temp.write("src/readme.md", "docs");
    assert_eq!(
        discover(&temp.0, &["src".into(), "src/a.ts".into()]).unwrap(),
        vec![temp.0.join("src/a.ts")]
    );
    assert_eq!(
        discover(&temp.0, &["src/ignored.ts".into()]).unwrap(),
        vec![temp.0.join("src/ignored.ts")]
    );
    assert!(discover(&temp.0, &["..".into()]).is_err());
    #[cfg(unix)]
    {
        std::os::unix::fs::symlink(temp.0.join("src/a.ts"), temp.0.join("link.ts")).unwrap();
        assert!(discover(&temp.0, &["link.ts".into()]).is_err());
        std::os::unix::fs::symlink(temp.0.join("src"), temp.0.join("linked-dir")).unwrap();
        assert!(discover(&temp.0, &["linked-dir/a.ts".into()]).is_err());
    }
}

#[test]
fn scan_rejects_unknown_or_missing_options() {
    // --review-below overrode a rubric cutoff. The rubric is gone and no
    // threshold here is calibrated, so the option is refused rather than
    // accepted and ignored.
    assert!(parse_scan(vec!["a.ts".into(), "--review-below".into(), "7.5".into()]).is_err());

    // No path is no longer an error; the caller fills in this directory.
    assert!(parse_scan(vec![]).unwrap().paths.is_empty());
    assert_eq!(defaulted(parse_scan(vec![]).unwrap()).paths, here());
    // A path given explicitly is never replaced by the default.
    assert_eq!(
        defaulted(parse_scan(vec!["a.ts".into()]).unwrap()).paths,
        vec![PathBuf::from("a.ts")]
    );
    assert!(parse_scan(vec!["a.ts".into(), "--context".into()]).is_err());
    assert!(parse_scan(vec!["a.ts".into(), "--scope".into(), "function".into()]).is_err());
    assert!(
        parse_scan(vec!["a.ts".into(), "--json".into(), "--dry-run".into()])
            .unwrap()
            .dry_run
    );
}

#[test]
fn a_subcommand_is_only_a_reserved_word_and_a_path_can_still_be_scanned() {
    let scanned =
        |arguments: Vec<&str>| match parse(arguments.iter().map(|a| a.to_string()).collect()) {
            Ok(Command::Health(options)) => options.paths,
            _ => panic!("expected an assessment"),
        };
    assert_eq!(scanned(vec!["src"]), vec![PathBuf::from("src")]);
    // No path at all is the repository. `supercov quality` should say something
    // about the code you are standing in without being told where to look.
    assert_eq!(scanned(vec![]), vec![PathBuf::from(".")]);
    assert!(matches!(
        parse(vec!["gaps".into()]),
        Ok(Command::Gaps { snapshot: None, .. })
    ));
    // A directory named after a subcommand is still assessable through `scan`.
    assert_eq!(scanned(vec!["scan", "show"]), vec![PathBuf::from("show")]);
    assert_eq!(
        scanned(vec!["scan", "src", "--refresh"]),
        vec![PathBuf::from("src")]
    );
    assert!(matches!(
        parse(vec!["show".into()]),
        Ok(Command::Show { snapshot: None, .. })
    ));
    assert!(matches!(
        parse(vec!["snapshots".into()]),
        Ok(Command::Snapshots { .. })
    ));
}

#[test]
fn snapshots_are_immutable_and_only_a_snapshot_id_opens_one() {
    let temp = Temp::new();
    let files = json!({"files": []});
    let (first, _) = store::identity().unwrap();
    store::write(
        &temp.0,
        "quality",
        &first,
        &json!({"created_at": "2026-09-17T00-00-00-000000Z"}),
        &files,
    )
    .unwrap();
    // An id is never reused, and an existing one is refused rather than revised.
    assert!(
        store::write(
            &temp.0,
            "quality",
            &first,
            &json!({"created_at": "later"}),
            &files
        )
        .unwrap_err()
        .contains("already exists")
    );
    let (second, _) = store::identity().unwrap();
    assert_ne!(first, second);
    store::write(
        &temp.0,
        "quality",
        &second,
        &json!({"created_at": "2026-09-17T01-00-00-000000Z"}),
        &files,
    )
    .unwrap();

    assert_eq!(store::resolve(&temp.0, "quality", None).unwrap(), second);
    assert_eq!(
        store::resolve(&temp.0, "quality", Some("latest")).unwrap(),
        second
    );
    assert_eq!(
        store::resolve(&temp.0, "quality", Some(&first)).unwrap(),
        first
    );
    let listed = store::list(&temp.0, "quality").unwrap();
    assert_eq!(listed.len(), 2);
    assert_eq!(listed[0].0, second, "most recent first");

    // A selector is checked before any path is built from it.
    for selector in [
        "..",
        "../../etc/passwd",
        "q_0123",
        "run_0123456789abcdef",
        "",
    ] {
        assert!(store::resolve(&temp.0, "quality", Some(selector)).is_err());
        assert!(store::read(&temp.0, "quality", selector).is_err());
    }
    // A pointer at a snapshot that is gone falls back to the newest kept one.
    fs::remove_dir_all(
        store::root(&temp.0, "quality")
            .join("snapshots")
            .join(&second),
    )
    .unwrap();
    assert_eq!(store::resolve(&temp.0, "quality", None).unwrap(), first);
    // And with nothing left, browsing says so instead of inventing a snapshot.
    fs::remove_dir_all(store::root(&temp.0, "quality").join("snapshots")).unwrap();
    assert!(
        store::resolve(&temp.0, "quality", None)
            .unwrap_err()
            .contains("no quality snapshot here yet")
    );
}

// ---- named-property catalog -------------------------------------------------

fn values(pairs: &[(&str, f64)]) -> BTreeMap<String, f64> {
    pairs.iter().map(|(k, v)| ((*k).to_owned(), *v)).collect()
}

#[test]
fn catalog_parses_and_holds_only_checks_the_evidence_kept() {
    let catalog = catalog::properties();
    assert_eq!(catalog.len(), 12);
    let ids: Vec<&str> = catalog.iter().map(|c| c.id.as_str()).collect();
    // Cut for firing on everything rather than for being wrong, and for never
    // firing at all. Re-adding one silently would undo a measured decision.
    for gone in ["mixed_abstraction", "comment_deodorant", "data_class"] {
        assert!(!ids.contains(&gone), "{gone} was cut from the catalog");
    }
    for check in catalog {
        assert!(!check.task.is_empty() && !check.present.is_empty());
        assert!(!check.absent.is_empty() && !check.evidence.is_empty());
    }
}

#[test]
fn health_is_ten_when_nothing_fires_and_zero_when_everything_does() {
    assert_eq!(
        catalog::health(&values(&[("a", 0.0), ("b", 0.0)])),
        Some(10.0)
    );
    assert_eq!(
        catalog::health(&values(&[("a", 1.0), ("b", 1.0)])),
        Some(0.0)
    );
    assert_eq!(
        catalog::health(&values(&[("a", 0.0), ("b", 1.0)])),
        Some(5.0)
    );
    assert_eq!(catalog::health(&BTreeMap::new()), None);
}

#[test]
fn health_uses_the_mean_so_the_scale_survives_a_catalog_change() {
    // Two checks at 0.5 and four checks at 0.5 are the same health. A sum would
    // make the number mean something different after a check is added.
    let two = catalog::health(&values(&[("a", 0.5), ("b", 0.5)]));
    let four = catalog::health(&values(&[("a", 0.5), ("b", 0.5), ("c", 0.5), ("d", 0.5)]));
    assert_eq!(two, four);
}

#[test]
fn present_reports_only_what_fired_strongest_first() {
    let fired = catalog::present(&values(&[
        ("low", 0.49),
        ("high", 0.91),
        ("edge", catalog::PRESENT_AT),
        ("under", catalog::PRESENT_AT - 0.01),
        ("mid", 0.7),
    ]));
    let names: Vec<&str> = fired.iter().map(|(id, _)| id.as_str()).collect();
    assert_eq!(names, ["high", "mid", "edge"]);
}

#[test]
fn the_presence_threshold_was_chosen_against_evidence_not_taken_as_the_midpoint() {
    // 0.5 was the midpoint. 0.60 agrees with a blind reader on 80.8% of 240
    // shared judgements against 79.2%, reports 2.2 properties per file across
    // 272 classes rather than 2.8, and still catches all eight deliberately
    // introduced smells while co-firing on unrelated checks falls from 12% to
    // 7%. Changing it back is a decision, not a tidy-up.
    assert_eq!(catalog::PRESENT_AT, 0.6);
    // The composite must not depend on it: health is the mean of raw answers.
    let all_just_under = values(&[("a", 0.59), ("b", 0.59)]);
    let all_just_over = values(&[("a", 0.61), ("b", 0.61)]);
    assert!(catalog::health(&all_just_under) > catalog::health(&all_just_over));
    assert!(catalog::present(&all_just_under).is_empty());
    assert_eq!(catalog::present(&all_just_over).len(), 2);
}

#[test]
fn aggregate_weights_by_size_so_small_files_cannot_outvote_the_code() {
    // Nine tiny perfect files and one large bad one: a plain average would call
    // this healthy, which is the failure weighting exists to prevent.
    let mut files = vec![(10u64, 10.0f64); 9];
    files.push((10_000, 0.0));
    let weighted = catalog::aggregate(&files).unwrap();
    assert!(weighted < 0.1, "byte-weighted health was {weighted}");
    assert_eq!(catalog::aggregate(&[]), None);
}

#[test]
fn a_change_request_sends_exactly_the_two_versions() {
    // The wrapped shape measurably weakened detection. If this test fails the
    // request is no longer the one the evidence was gathered on.
    let request = catalog::change_request("old", "new");
    let state = request["state"].as_object().unwrap();
    assert_eq!(state.len(), 2);
    assert_eq!(state["before"], "old");
    assert_eq!(state["after"], "new");
    // Twelve complexity properties, the three risks that exist only in the
    // change form, and the twelve security surfaces in their differential form.
    assert_eq!(
        request["questions"].as_object().unwrap().len(),
        catalog::properties().len() + catalog::risks().len() + catalog::security::checks().len()
    );
}

#[test]
fn risk_checks_are_asked_of_a_change_and_never_of_a_file() {
    let risks: BTreeSet<&str> = catalog::risks().iter().map(|r| r.id.as_str()).collect();
    assert_eq!(risks.len(), 3);
    assert!(risks.contains("weakens_tests") && risks.contains("data_migration"));
    // Moved 2026-09-20: the three security risks became the twelve-check
    // security surface catalog, asked of a change in the same differential
    // form as the complexity catalog.
    for moved in ["hardcoded_secret", "injection_risk", "touches_auth"] {
        assert!(
            !risks.contains(moved),
            "{moved} moved to the security catalog"
        );
    }
    // Removed 2026-09-18: it fired on 20 of 50 real pull requests with a median
    // of 0.45, and had no ground truth to justify that rate.
    assert!(
        !risks.contains("breaks_api"),
        "breaks_api was removed for firing too often"
    );
    // A file has no before, so "did this change add a credential" has no answer.
    let file = catalog::file_questions();
    for risk in &risks {
        assert!(
            !file.contains_key(*risk),
            "{risk} must not be asked of a file"
        );
    }
    let change = catalog::change_questions();
    for risk in &risks {
        assert!(
            change.contains_key(*risk),
            "{risk} must be asked of a change"
        );
    }
    // A risk question already asks about the change, so it does not carry the
    // complexity form's "where `before` did not" clause.
    let task = |q: &Value| q["instructions"]["task"].as_str().unwrap().to_owned();
    assert!(!task(&change["weakens_tests"]).contains("where `before` did not"));
    assert!(task(&change["deep_nesting"]).contains("where `before` did not"));
    // The security catalog is asked of a change in the differential form too,
    // and of a file only through `supercov security`, never through quality.
    assert!(task(&change["injection_sink"]).contains("where `before` did not"));
    assert!(!file.contains_key("injection_sink"));
    // Everything a report carries about a check covers both catalogs.
    let described = catalog::described();
    let named: BTreeSet<&str> = described
        .as_array()
        .unwrap()
        .iter()
        .filter_map(|e| e["check"].as_str())
        .collect();
    for risk in &risks {
        assert!(
            named.contains(*risk),
            "{risk} must travel with its evidence"
        );
    }
}

#[test]
fn change_questions_ask_what_appeared_and_file_questions_do_not() {
    let change = catalog::change_questions();
    let file = catalog::file_questions();
    let task = |q: &Value| q["instructions"]["task"].as_str().unwrap().to_owned();
    assert!(task(&change["deep_nesting"]).contains("does `after` show the following"));
    assert!(!task(&file["deep_nesting"]).contains("`after`"));
    // The underlying question is the same one in both forms.
    assert!(task(&change["deep_nesting"]).ends_with(&task(&file["deep_nesting"])));
}

#[test]
fn a_file_request_names_the_path_but_a_change_request_does_not() {
    let file = catalog::file_request("src/a.rs", "fn a() {}");
    assert_eq!(file["state"]["file"]["path"], "src/a.rs");
    assert_eq!(file["state"]["file"]["source"], "fn a() {}");
}

// ---- change ranges ----------------------------------------------------------

#[test]
fn patch_accepts_each_range_and_works_out_the_rest_from_the_repository() {
    let parse_range = |args: &[&str]| match parse(
        std::iter::once("patch")
            .chain(args.iter().copied())
            .map(str::to_owned)
            .collect(),
    ) {
        Ok(Command::Patch { range, .. }) => Ok(range),
        Ok(_) => panic!("patch did not parse as a patch"),
        Err(e) => Err(e),
    };
    // No flag is not a default range: it means work it out from the tree.
    assert_eq!(parse_range(&[]).unwrap(), None);
    assert_eq!(
        parse_range(&["--staged"]).unwrap(),
        Some(changes::Range::Staged)
    );
    assert_eq!(
        parse_range(&["--cached"]).unwrap(),
        Some(changes::Range::Staged)
    );
    assert_eq!(
        parse_range(&["--base", "main"]).unwrap(),
        Some(changes::Range::Base("main".into()))
    );
    assert!(parse_range(&["--base"]).is_err());
    assert!(parse_range(&["--staged", "--base", "main"]).is_err());
    // The old spelling is gone rather than quietly aliased, because it meant
    // the ref's tip where --base means the merge base.
    assert!(parse_range(&["--since", "main"]).is_err());
    // Naming the same range twice is not a conflict.
    assert!(parse_range(&["--staged", "--cached"]).is_ok());
    assert!(parse_range(&["--nonsense"]).is_err());
}

#[test]
fn patch_takes_paths_and_a_limit() {
    match parse(
        ["patch", "--limit", "3", "src", "docs/a.md"]
            .iter()
            .map(|s| (*s).to_owned())
            .collect(),
    ) {
        Ok(Command::Patch { paths, limit, .. }) => {
            assert_eq!(limit, 3);
            assert_eq!(
                paths,
                vec![PathBuf::from("src"), PathBuf::from("docs/a.md")]
            );
        }
        other => panic!("unexpected parse: {}", other.is_err()),
    }
}

#[test]
fn range_names_itself_the_same_way_every_run() {
    assert_eq!(changes::Range::Unstaged.id(), "unstaged");
    assert_eq!(changes::Range::Staged.id(), "staged");
    assert_eq!(changes::Range::Base("v1".into()).id(), "base:v1");
    assert!(changes::Range::Base("v1".into()).describe().contains("v1"));
}

fn git_in(root: &Path, arguments: &[&str]) {
    let status = std::process::Command::new("git")
        .current_dir(root)
        .args(arguments)
        .output()
        .expect("git runs in tests");
    assert!(
        status.status.success(),
        "git {:?}: {}",
        arguments,
        String::from_utf8_lossy(&status.stderr)
    );
}

fn repository() -> Temp {
    let temp = Temp::new();
    git_in(&temp.0, &["init", "--quiet"]);
    git_in(&temp.0, &["config", "user.email", "t@example.invalid"]);
    git_in(&temp.0, &["config", "user.name", "Test"]);
    git_in(&temp.0, &["config", "commit.gpgsign", "false"]);
    temp
}

#[test]
fn unstaged_compares_the_working_tree_with_the_index() {
    let temp = repository();
    temp.write("a.rs", "fn a() {}\n");
    git_in(&temp.0, &["add", "a.rs"]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    temp.write("a.rs", "fn a() { let x = 1; }\n");

    let found = changes::collect(&temp.0, &changes::Range::Unstaged, &[]).unwrap();
    assert_eq!(found.len(), 1);
    // before comes from the index, which is the committed text here. An earlier
    // version built the revision spec as `::a.rs`, git failed, and the error was
    // swallowed into an empty before: every property looked introduced.
    assert_eq!(found[0].before, "fn a() {}\n");
    assert_eq!(found[0].after, "fn a() { let x = 1; }\n");
    assert!(found[0].reviewable());
    assert!(found[0].patch.contains("let x = 1"));
}

#[test]
fn staged_compares_the_index_with_head() {
    let temp = repository();
    temp.write("a.rs", "fn a() {}\n");
    git_in(&temp.0, &["add", "a.rs"]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    temp.write("a.rs", "fn a() { staged(); }\n");
    git_in(&temp.0, &["add", "a.rs"]);
    // Working tree moves on again; --staged must not see this.
    temp.write("a.rs", "fn a() { later(); }\n");

    let found = changes::collect(&temp.0, &changes::Range::Staged, &[]).unwrap();
    assert_eq!(found.len(), 1);
    assert_eq!(found[0].before, "fn a() {}\n");
    assert_eq!(found[0].after, "fn a() { staged(); }\n");
}

#[test]
fn base_compares_the_working_tree_with_the_merge_base_not_the_tip() {
    let temp = repository();
    temp.write("a.rs", "fn a() {}\n");
    git_in(&temp.0, &["add", "a.rs"]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    git_in(&temp.0, &["tag", "base"]);
    temp.write("a.rs", "fn a() { two(); }\n");
    git_in(&temp.0, &["add", "a.rs"]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "second"]);
    temp.write("a.rs", "fn a() { three(); }\n");

    let found = changes::collect(&temp.0, &changes::Range::Base("base".into()), &[]).unwrap();
    assert_eq!(found.len(), 1);
    assert_eq!(found[0].before, "fn a() {}\n");
    assert_eq!(found[0].after, "fn a() { three(); }\n");
    assert!(changes::collect(&temp.0, &changes::Range::Base("nope".into()), &[]).is_err());
}

#[test]
fn a_base_that_moved_on_is_not_this_branch_s_obligation() {
    // The whole reason for the merge base. main gains a commit after the branch
    // leaves it; comparing against main's tip would report that commit's file as
    // part of this change.
    let temp = repository();
    temp.write("shared.rs", "fn shared() {}\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    git_in(&temp.0, &["checkout", "--quiet", "-b", "work"]);
    temp.write("mine.rs", "fn mine() {}\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "mine"]);

    let main = String::from_utf8(
        std::process::Command::new("git")
            .current_dir(&temp.0)
            .args(["rev-parse", "HEAD~1"])
            .output()
            .unwrap()
            .stdout,
    )
    .unwrap();
    git_in(&temp.0, &["checkout", "--quiet", main.trim()]);
    git_in(&temp.0, &["checkout", "--quiet", "-B", "main"]);
    temp.write("theirs.rs", "fn theirs() {}\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "theirs"]);
    git_in(&temp.0, &["checkout", "--quiet", "work"]);

    let found = changes::collect(&temp.0, &changes::Range::Base("main".into()), &[]).unwrap();
    let paths: Vec<&str> = found.iter().map(|c| c.path.as_str()).collect();
    assert!(paths.contains(&"mine.rs"), "{paths:?}");
    assert!(
        !paths.contains(&"theirs.rs"),
        "a commit landed on main after this branch left it is not this change: {paths:?}"
    );
}

#[test]
fn an_untracked_file_is_reviewed_as_an_addition() {
    let temp = repository();
    temp.write("tracked.rs", "fn tracked() {}\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    temp.write("brand-new.rs", "fn fresh() {}\n");

    // git diff never mentions an untracked file, but the author wrote it.
    let found = changes::collect(&temp.0, &changes::Range::Unstaged, &[]).unwrap();
    let new = found.iter().find(|c| c.path == "brand-new.rs").unwrap();
    assert_eq!(new.kind, changes::Kind::Added);
    assert_eq!(new.after, "fn fresh() {}\n");
    assert!(new.before.is_empty());
    // Staged work is the exception: an untracked file is not in the index.
    let staged = changes::collect(&temp.0, &changes::Range::Staged, &[]).unwrap();
    assert!(staged.iter().all(|c| c.path != "brand-new.rs"));
}

#[test]
fn an_annotation_anchors_at_the_first_line_the_change_adds() {
    let patch = "diff --git a/a.rs b/a.rs\n--- a/a.rs\n+++ b/a.rs\n@@ -10,3 +12,7 @@ fn a() {\n+    added\n";
    assert_eq!(changes::first_added_line(patch), Some(12));
    assert_eq!(changes::first_added_line("no hunks here"), None);
}

#[test]
fn an_addition_has_no_previous_version_and_a_deletion_is_not_reviewed() {
    let temp = repository();
    temp.write("keep.rs", "fn keep() {}\n");
    temp.write("gone.rs", "fn gone() {}\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    temp.write("new.rs", "fn added() {}\n");
    fs::remove_file(temp.0.join("gone.rs")).unwrap();
    git_in(&temp.0, &["add", "-A"]);

    let found = changes::collect(&temp.0, &changes::Range::Staged, &[]).unwrap();
    let by = |name: &str| found.iter().find(|c| c.path == name).unwrap();
    assert_eq!(by("new.rs").kind, changes::Kind::Added);
    assert!(by("new.rs").before.is_empty());
    assert!(by("new.rs").reviewable());
    assert_eq!(by("gone.rs").kind, changes::Kind::Deleted);
    assert!(!by("gone.rs").reviewable(), "a deletion introduces nothing");
}

#[test]
fn naming_a_directory_reviews_only_the_changes_inside_it() {
    let temp = repository();
    temp.write("src/a.rs", "fn a() {}\n");
    temp.write("other/b.rs", "fn b() {}\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    temp.write("src/a.rs", "fn a() { one(); }\n");
    temp.write("other/b.rs", "fn b() { two(); }\n");

    let only = [PathBuf::from("src")];
    let found = changes::collect(&temp.0, &changes::Range::Unstaged, &only).unwrap();
    assert_eq!(found.len(), 1);
    assert_eq!(found[0].path, "src/a.rs");
}

#[test]
fn review_outside_a_repository_says_so() {
    let temp = Temp::new();
    let error = changes::collect(&temp.0, &changes::Range::Unstaged, &[]).unwrap_err();
    assert!(error.contains("Git repository"), "{error}");
}

#[test]
fn a_band_says_only_what_the_resolution_supports() {
    assert_eq!(band(Some(9.1)), "good");
    assert_eq!(band(Some(8.0)), "good");
    assert_eq!(band(Some(7.9)), "fair");
    assert_eq!(band(Some(5.0)), "fair");
    assert_eq!(band(Some(4.9)), "weak");
    assert_eq!(band(None), "\u{2014}");
}

fn windowed(path: &str, checks: &[(&str, f64)]) -> Answers {
    Answers {
        lines: Vec::new(),
        labels: Vec::new(),

        classified: BTreeMap::new(),
        path: path.to_owned(),
        bytes: 100,
        // Every window of one file carries that file's digest, which is what
        // lets the folded row say which source it describes.
        sha256: "0".repeat(64),
        windows: 1,
        note: Some("windowed".into()),
        values: Some(checks.iter().map(|(k, v)| ((*k).to_owned(), *v)).collect()),
        cached: true,
        error: None,
    }
}

#[test]
fn windows_of_one_file_fold_back_by_taking_the_strongest_answer() {
    // Every question is existential: "does this file contain a method that..."
    // is true if any window has one, so the highest value wins.
    let folded = combine_windows(vec![
        windowed("a.rs", &[("long_method", 0.1), ("dead_code", 0.9)]),
        windowed("a.rs", &[("long_method", 0.8), ("dead_code", 0.2)]),
        windowed("b.rs", &[("long_method", 0.3), ("dead_code", 0.3)]),
    ]);
    assert_eq!(folded.len(), 2);
    let a = &folded[0];
    assert_eq!(a.path, "a.rs");
    assert_eq!(a.windows, 2);
    assert_eq!(a.bytes, 200, "a windowed file reports its whole size");
    let values = a.values.as_ref().unwrap();
    assert_eq!(values["long_method"], 0.8);
    assert_eq!(values["dead_code"], 0.9);
    // Order of first appearance is kept, so the report is stable.
    assert_eq!(folded[1].path, "b.rs");
    assert_eq!(folded[1].windows, 1);
}

#[test]
fn folding_keeps_the_first_error_and_only_claims_cached_when_every_window_was() {
    let mut miss = windowed("a.rs", &[("long_method", 0.1)]);
    miss.cached = false;
    let folded = combine_windows(vec![windowed("a.rs", &[("long_method", 0.2)]), miss]);
    assert!(
        !folded[0].cached,
        "one live window means the file was not cached"
    );
}

#[test]
fn an_oversized_file_is_windowed_and_every_window_fits() {
    // A single file can be split where a pair of versions cannot: there is one
    // text, so each window is still real code to ask about.
    let mut source = String::from("// oversized\n");
    for index in 0..3000 {
        source.push_str(&format!(
            "export function unit{index}(a: number) {{\n  return a + {index};\n}}\n"
        ));
    }
    assert!(
        within_budget(&catalog::file_request("big.ts", &source))
            .unwrap()
            .is_none(),
        "the fixture must exceed the budget or this proves nothing"
    );
    let windows = catalog_windows("big.ts", &source, Instrument::Catalog).unwrap();
    assert!(windows.len() > 1, "an oversized file is split");
    for (window, text) in &windows {
        assert!(
            within_budget(&catalog::file_request("big.ts", text))
                .unwrap()
                .is_some(),
            "window {} of {} is still over budget",
            window.index,
            window.of
        );
    }
    // The windows partition the file: every byte is asked about exactly once.
    let covered: usize = windows.iter().map(|(_, text)| text.len()).sum();
    assert_eq!(covered, source.len());
    assert_eq!(windows.last().unwrap().0.of, windows.len());
}

#[test]
fn a_single_line_over_the_budget_says_so_rather_than_failing_silently() {
    let source = format!("const blob = \"{}\";\n", "x y ".repeat(60_000));
    let error = catalog_windows("blob.ts", &source, Instrument::Catalog).unwrap_err();
    assert!(error.contains("line 1 alone"), "{error}");
}

#[test]
fn a_template_with_no_parser_is_windowed_at_line_boundaries() {
    // A template has no declarations to split at, and was reported as a failure
    // whatever its size. Lines are a real boundary in a template.
    let mut source = String::from("<html><body>\n");
    for index in 0..4000 {
        source.push_str(&format!(
            "<p class=\"row\">{{{{ rows[{index}].name }}}} and more text</p>\n"
        ));
    }
    source.push_str("</body></html>\n");
    for instrument in [Instrument::Catalog, Instrument::Security] {
        assert!(
            within_budget(&instrument.file_request("page.html", &source))
                .unwrap()
                .is_none(),
            "the fixture must exceed the budget or this proves nothing"
        );
        let windows = catalog_windows("page.html", &source, instrument).unwrap();
        assert!(windows.len() > 1);
        for (_, text) in &windows {
            assert!(
                within_budget(&instrument.file_request("page.html", text))
                    .unwrap()
                    .is_some(),
                "a window planned for {instrument:?} is over its own budget"
            );
        }
        let covered: usize = windows.iter().map(|(_, text)| text.len()).sum();
        assert_eq!(covered, source.len());
    }
}

#[test]
fn inline_base64_is_estimated_at_a_token_a_byte() {
    // The report that came back HTTP 400: a third of it inline PNGs.
    let image = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA".repeat(40);
    let prose = "div.row { width: 32px; height: 32px; }\n".repeat(50);
    let dense = format!("{prose}background-image: url(data:image/png;base64,{image});\n");
    assert_eq!(estimated_tokens(prose.as_bytes()), prose.len().div_ceil(3));
    assert!(estimated_tokens(dense.as_bytes()) >= prose.len() / 3 + image.len());
    // An identifier or URL in ordinary source is not a dense run.
    let code = "const sessionTokenRefreshIntervalMilliseconds = fetchConfiguration();\n";
    assert_eq!(estimated_tokens(code.as_bytes()), code.len().div_ceil(3));
}

#[test]
fn test_files_are_recognised_in_every_language_this_assesses() {
    for path in [
        // Directory conventions, shared across languages.
        "tests/auth.rs",
        "src/__tests__/login.tsx",
        "spec/models/user.rb",
        "e2e/checkout.ts",
        "internal/testdata/golden.go",
        "src/fixtures/orders.ts",
        "app/__mocks__/stripe.ts",
        "features/step_definitions/login.rb",
        // Separator conventions, per language.
        "src/login.test.ts",
        "src/login.spec.tsx",
        "internal/auth_test.go",
        "app/test_login.py",
        "app/login_test.py",
        "lib/user_spec.rb",
        "src/login-spec.js",
        // CamelCase conventions: Java, Kotlin, C#, Swift, PHP.
        "src/main/java/com/x/OrderTest.java",
        "src/main/java/com/x/OrderTests.java",
        "src/main/java/com/x/OrderTestCase.java",
        "src/main/kotlin/OrderSpec.kt",
        "Sources/AppTests/LoginTests.swift",
        "src/OrderIT.java",
        // Framework entry points.
        "conftest.py",
        "spec/spec_helper.rb",
    ] {
        assert_eq!(
            skipped_path(path).map(Skipped::reason),
            Some("test"),
            "{path} should be recognised as test code"
        );
    }
}

#[test]
fn a_name_that_merely_contains_test_is_still_source() {
    // Matching whole separator-delimited parts, never substrings, is what keeps
    // these out of the skip list.
    for path in [
        "src/latest.ts",
        "src/contest.rs",
        "src/manifest.rs",
        "app/attestation.go",
        "src/protest.py",
        "src/Manifest.java",
        "src/Greatest.java",
        "src/AUDIT.java",
        "src/EDIT.cs",
        "lib/testing.rb",
        "src/specification.ts",
    ] {
        assert_eq!(skipped_path(path), None, "{path} is source, not a test");
    }
}

#[test]
fn generated_output_is_recognised_by_name_and_by_its_own_marker() {
    for path in [
        "api/types.d.ts",
        "web/bundle.min.js",
        "proto/order.pb.go",
        "proto/order_pb2.py",
        "src/Form.designer.cs",
        "src/schema.generated.ts",
    ] {
        assert_eq!(
            skipped_path(path).map(Skipped::reason),
            Some("generated"),
            "{path} should be recognised as generated"
        );
    }
    // The marker in the file is the one signal that needs no naming convention.
    assert!(generated_header(
        "// Code generated by protoc. DO NOT EDIT.\npackage x\n"
    ));
    assert!(generated_header("/* @generated */\nexport const a = 1;\n"));
    assert!(generated_header("# This file is auto-generated.\n"));
    assert!(!generated_header(
        "// A hand-written file about code generation.\n"
    ));
    // Only the head of the file is read: a mention far down does not count.
    let late = format!("{}\n// DO NOT EDIT\n", "x\n".repeat(4000));
    assert!(!generated_header(&late));
}

#[test]
fn a_source_root_puts_files_in_and_everything_else_stays_out() {
    // An allowlist, like the coverage scope: nothing counts until a root puts
    // it in, which is what stops a prototype tree being read as the product.
    let temp = Temp::new();
    temp.write("package.json", "{}\n");
    temp.write("src/app.ts", "export const a = 1;\n");
    temp.write("src/app.test.ts", "it('works', () => {});\n");
    temp.write("src/types.d.ts", "export declare const a: number;\n");
    temp.write("scratch/prototype.ts", "export const b = 2;\n");

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let status = |path: &str| {
        view.entries
            .iter()
            .find(|e| e.path == path)
            .unwrap_or_else(|| panic!("{path} missing from the scope"))
    };
    assert_eq!(status("src/app.ts").status, scope::Status::Included);
    assert_eq!(status("src/app.test.ts").status, scope::Status::Excluded);
    assert_eq!(status("src/app.test.ts").reason, "test");
    assert_eq!(status("src/types.d.ts").status, scope::Status::Excluded);
    // Under no root, and not obviously test or generated: say so rather than
    // guessing either way.
    assert_eq!(
        status("scratch/prototype.ts").status,
        scope::Status::Ambiguous
    );
    assert_eq!(view.ambiguous(), 1);
    assert!(view.limitation().unwrap().contains("SUPERCOV_SOURCE_ROOTS"));
    assert_eq!(view.mode, "automatic");
}

#[test]
fn declared_roots_replace_discovery_and_leave_nothing_ambiguous() {
    let temp = Temp::new();
    temp.write("package.json", "{}\n");
    temp.write("src/app.ts", "export const a = 1;\n");
    temp.write("scratch/prototype.ts", "export const b = 2;\n");
    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();

    let roots = vec!["scratch".to_string()];
    let view = scope::classify(&temp.0, &files, Some(&roots));
    let status = |path: &str| {
        view.entries
            .iter()
            .find(|e| e.path == path)
            .unwrap()
            .clone()
    };
    assert_eq!(view.mode, "explicit");
    assert_eq!(
        status("scratch/prototype.ts").status,
        scope::Status::Included
    );
    // In explicit mode a file outside the roots is a decision, not a question.
    assert_eq!(status("src/app.ts").status, scope::Status::Excluded);
    assert_eq!(status("src/app.ts").reason, "outside explicit source roots");
    assert_eq!(view.ambiguous(), 0);
    assert!(view.limitation().is_none());
}

#[test]
fn a_package_is_a_root_only_where_a_manifest_is_conventional_or_declared() {
    let temp = Temp::new();
    temp.write("package.json", "{\"workspaces\": [\"odd/*\"]}\n");
    temp.write("src/root.ts", "export const a = 1;\n");
    // Under a conventional package parent: a package.
    temp.write("packages/web/package.json", "{}\n");
    temp.write("packages/web/src/page.ts", "export const b = 2;\n");
    // Declared by the root manifest, though `odd` is not conventional.
    temp.write("odd/thing/package.json", "{}\n");
    temp.write("odd/thing/src/thing.ts", "export const c = 3;\n");
    // A manifest nowhere conventional and declared by nobody: a prototype.
    temp.write("spikes/toy/package.json", "{}\n");
    temp.write("spikes/toy/src/toy.ts", "export const d = 4;\n");
    // A manifest inside a test tree is a fixture, never a source root.
    temp.write("tests/fixtures/packages/app/package.json", "{}\n");
    temp.write(
        "tests/fixtures/packages/app/src/f.ts",
        "export const e = 5;\n",
    );

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let status = |path: &str| view.entries.iter().find(|e| e.path == path).unwrap().status;
    assert_eq!(status("src/root.ts"), scope::Status::Included);
    assert_eq!(status("packages/web/src/page.ts"), scope::Status::Included);
    assert_eq!(status("odd/thing/src/thing.ts"), scope::Status::Included);
    assert_eq!(status("spikes/toy/src/toy.ts"), scope::Status::Ambiguous);
    assert_eq!(
        status("tests/fixtures/packages/app/src/f.ts"),
        scope::Status::Excluded
    );
    assert!(
        !view.roots.iter().any(|root| root.starts_with("tests/")),
        "a fixture must never become a source root: {:?}",
        view.roots
    );
}

#[test]
fn cargo_workspace_members_are_roots_and_a_crate_outside_one_is_not() {
    let temp = Temp::new();
    temp.write(
        "Cargo.toml",
        "[workspace]\nmembers = [\n  \"crates/engine\",\n]\nresolver = \"3\"\n",
    );
    temp.write("crates/engine/Cargo.toml", "[package]\nname = \"engine\"\n");
    temp.write("crates/engine/src/lib.rs", "pub fn a() {}\n");
    temp.write("spikes/toy/Cargo.toml", "[package]\nname = \"toy\"\n");
    temp.write("spikes/toy/src/main.rs", "fn main() {}\n");

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let status = |path: &str| view.entries.iter().find(|e| e.path == path).unwrap().status;
    assert_eq!(status("crates/engine/src/lib.rs"), scope::Status::Included);
    assert_eq!(status("spikes/toy/src/main.rs"), scope::Status::Ambiguous);
}

#[test]
fn a_declared_package_with_no_conventional_layout_is_measured_whole() {
    let temp = Temp::new();
    temp.write("package.json", "{\"workspaces\": [\"extension\"]}\n");
    temp.write("extension/package.json", "{}\n");
    temp.write("extension/blocks/widget.ts", "export const a = 1;\n");
    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    assert_eq!(
        view.entries
            .iter()
            .find(|e| e.path == "extension/blocks/widget.ts")
            .unwrap()
            .status,
        scope::Status::Included
    );
}

#[test]
fn declared_roots_are_read_from_the_environment_as_a_comma_list() {
    // Parsing only; the variable itself is process-wide and not set in tests.
    let parsed = |value: &str| -> Vec<String> {
        value
            .split(',')
            .map(|part| part.trim().to_owned())
            .filter(|part| !part.is_empty())
            .collect()
    };
    assert_eq!(parsed("src,app"), vec!["src", "app"]);
    assert_eq!(parsed(" src , app "), vec!["src", "app"]);
    assert!(parsed(" , ").is_empty());
}

#[test]
fn a_manifest_says_where_code_lives_when_the_layout_is_not_conventional() {
    // This repository's own package.json names `bin/supercov.js` and
    // `./runtime/javascript/*.mjs`. Neither is a conventional source directory
    // and both ship, so reading the manifest is what stops them being guesses.
    let temp = Temp::new();
    temp.write(
        "package.json",
        r#"{"bin":{"tool":"bin/tool.js"},"exports":{"./x":"./runtime/javascript/x.mjs"}}"#,
    );
    temp.write("bin/tool.js", "export const a = 1;\n");
    temp.write("bin/helper.js", "export const b = 2;\n");
    temp.write("runtime/javascript/x.mjs", "export const c = 3;\n");
    temp.write("runtime/python/y.py", "c = 3\n");

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let status = |path: &str| view.entries.iter().find(|e| e.path == path).unwrap().status;
    assert_eq!(status("bin/tool.js"), scope::Status::Included);
    // A declared file in a directory of its own brings the directory, so the
    // files it loads travel with it.
    assert_eq!(status("bin/helper.js"), scope::Status::Included);
    assert_eq!(status("runtime/javascript/x.mjs"), scope::Status::Included);
    // Nothing declares the Python runtime, so it stays a question.
    assert_eq!(status("runtime/python/y.py"), scope::Status::Ambiguous);
}

#[test]
fn a_build_script_is_itself_and_does_not_drag_in_its_whole_crate() {
    let temp = Temp::new();
    temp.write("Cargo.toml", "[workspace]\nmembers = [\"crates/engine\"]\n");
    temp.write("crates/engine/Cargo.toml", "[package]\nname = \"engine\"\n");
    temp.write("crates/engine/build.rs", "fn main() {}\n");
    temp.write("crates/engine/src/lib.rs", "pub fn a() {}\n");
    temp.write("crates/engine/assets/blob.rs", "pub fn b() {}\n");

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let status = |path: &str| view.entries.iter().find(|e| e.path == path).unwrap().status;
    // Cargo compiles build.rs without being told, so it is real code.
    assert_eq!(status("crates/engine/build.rs"), scope::Status::Included);
    assert_eq!(status("crates/engine/src/lib.rs"), scope::Status::Included);
    // Taking the build script's parent would have swallowed the whole crate.
    assert_eq!(
        status("crates/engine/assets/blob.rs"),
        scope::Status::Ambiguous
    );
}

#[test]
fn code_kept_beside_a_package_is_named_rather_than_left_unclassified() {
    // A tool script is the coverage scope's own rule, in its words. Examples
    // and benchmarks ship to nobody and there is nothing to declare, so saying
    // why is more useful than calling them unclassified.
    let temp = Temp::new();
    temp.write("package.json", "{}\n");
    temp.write("src/app.ts", "export const a = 1;\n");
    temp.write("scripts/release.mjs", "export const b = 2;\n");
    temp.write("examples/demo/app.ts", "export const c = 3;\n");
    temp.write("benches/throughput.rs", "fn main() {}\n");

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let entry = |path: &str| {
        view.entries
            .iter()
            .find(|e| e.path == path)
            .unwrap()
            .clone()
    };
    assert_eq!(entry("scripts/release.mjs").status, scope::Status::Excluded);
    assert_eq!(entry("scripts/release.mjs").reason, "tool script");
    assert_eq!(entry("examples/demo/app.ts").reason, "example");
    assert_eq!(entry("benches/throughput.rs").reason, "benchmark");
    assert_eq!(entry("src/app.ts").status, scope::Status::Included);
    assert_eq!(view.ambiguous(), 0);
}

// ---- classic layouts, one language at a time ---------------------------------

/// Build a project, classify it, and report each path's status and reason.
fn layout(files: &[(&str, &str)]) -> (Temp, BTreeMap<String, (scope::Status, String)>) {
    let temp = Temp::new();
    for (path, body) in files {
        temp.write(path, body);
    }
    let found = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &found, None);
    let map = view
        .entries
        .iter()
        .map(|e| (e.path.clone(), (e.status, e.reason.clone())))
        .collect();
    (temp, map)
}

#[track_caller]
fn included(map: &BTreeMap<String, (scope::Status, String)>, paths: &[&str]) {
    for path in paths {
        match map.get(*path) {
            Some((scope::Status::Included, _)) => {}
            Some((status, reason)) => {
                panic!("{path} should be source, got {status:?} ({reason})")
            }
            None => panic!("{path} was never discovered"),
        }
    }
}

#[track_caller]
fn excluded_as(map: &BTreeMap<String, (scope::Status, String)>, reason: &str, paths: &[&str]) {
    for path in paths {
        match map.get(*path) {
            Some((scope::Status::Excluded, got)) if got == reason => {}
            Some((status, got)) => {
                panic!("{path} should be excluded as {reason}, got {status:?} ({got})")
            }
            None => panic!("{path} was never discovered"),
        }
    }
}

#[test]
fn layout_javascript_and_typescript() {
    let (_temp, map) = layout(&[
        (
            "package.json",
            r#"{"main":"dist/index.js","bin":{"cli":"bin/cli.js"}}"#,
        ),
        ("src/index.ts", "export const a = 1;\n"),
        ("src/routes/page.tsx", "export default () => null;\n"),
        ("lib/util.mjs", "export const b = 2;\n"),
        ("app/server.cts", "export const c = 3;\n"),
        ("bin/cli.js", "#!/usr/bin/env node\n"),
        // Jest and Vitest.
        ("src/__tests__/login.ts", "it('x', () => {});\n"),
        ("src/login.test.ts", "it('x', () => {});\n"),
        ("src/login.spec.tsx", "it('x', () => {});\n"),
        // Mocha, Playwright and Cypress.
        ("test/unit.js", "it('x', () => {});\n"),
        ("e2e/checkout.spec.ts", "test('x', async () => {});\n"),
        ("cypress/e2e/login.cy.ts", "it('x', () => {});\n"),
        ("src/__mocks__/stripe.ts", "export default {};\n"),
        ("api/handler.ts", "export const h = 1;\n"),
        ("types/global.d.ts", "declare const a: number;\n"),
    ]);
    included(
        &map,
        &[
            "src/index.ts",
            "src/routes/page.tsx",
            "lib/util.mjs",
            "app/server.cts",
            "bin/cli.js",
            "api/handler.ts",
        ],
    );
    excluded_as(
        &map,
        "test",
        &[
            "src/__tests__/login.ts",
            "src/login.test.ts",
            "src/login.spec.tsx",
            "test/unit.js",
            "e2e/checkout.spec.ts",
            "cypress/e2e/login.cy.ts",
            "src/__mocks__/stripe.ts",
        ],
    );
    excluded_as(&map, "generated", &["types/global.d.ts"]);
}

#[test]
fn layout_rust() {
    let (_temp, map) = layout(&[
        ("Cargo.toml", "[workspace]\nmembers = [\"crates/engine\"]\n"),
        ("crates/engine/Cargo.toml", "[package]\nname = \"engine\"\n"),
        ("crates/engine/src/lib.rs", "pub fn a() {}\n"),
        ("crates/engine/src/bin/tool.rs", "fn main() {}\n"),
        ("crates/engine/build.rs", "fn main() {}\n"),
        // Cargo's own conventions for code that is not the library.
        ("crates/engine/tests/integration.rs", "#[test] fn t() {}\n"),
        ("crates/engine/benches/speed.rs", "fn main() {}\n"),
        ("crates/engine/examples/demo.rs", "fn main() {}\n"),
    ]);
    included(
        &map,
        &[
            "crates/engine/src/lib.rs",
            "crates/engine/src/bin/tool.rs",
            "crates/engine/build.rs",
        ],
    );
    excluded_as(&map, "test", &["crates/engine/tests/integration.rs"]);
    excluded_as(&map, "benchmark", &["crates/engine/benches/speed.rs"]);
    excluded_as(&map, "example", &["crates/engine/examples/demo.rs"]);
}

#[test]
fn layout_python_src_and_flat() {
    // Both layouts PyPA documents: `src/pkg` and a package at the root.
    let (_temp, map) = layout(&[
        ("pyproject.toml", "[project]\nname = \"shop\"\n"),
        ("src/shop/__init__.py", "\n"),
        ("src/shop/orders.py", "def a(): pass\n"),
        ("tests/test_orders.py", "def test_a(): pass\n"),
        ("conftest.py", "\n"),
    ]);
    included(&map, &["src/shop/__init__.py", "src/shop/orders.py"]);
    excluded_as(&map, "test", &["tests/test_orders.py", "conftest.py"]);

    let (_temp, flat) = layout(&[
        ("pyproject.toml", "[project]\nname = \"shop\"\n"),
        ("shop/__init__.py", "\n"),
        ("shop/orders.py", "def a(): pass\n"),
        ("shop/orders_test.py", "def test_a(): pass\n"),
    ]);
    included(&flat, &["shop/__init__.py", "shop/orders.py"]);
    excluded_as(&flat, "test", &["shop/orders_test.py"]);
}

#[test]
fn layout_ruby_gem_and_rails() {
    let (_temp, map) = layout(&[
        ("Gemfile", "source 'https://rubygems.org'\n"),
        ("lib/shop.rb", "module Shop; end\n"),
        ("lib/shop/order.rb", "class Order; end\n"),
        ("app/models/user.rb", "class User; end\n"),
        ("app/controllers/orders_controller.rb", "class C; end\n"),
        // RSpec, Minitest and Cucumber.
        ("spec/models/user_spec.rb", "describe User do; end\n"),
        ("spec/spec_helper.rb", "\n"),
        ("test/models/user_test.rb", "class T; end\n"),
        ("features/step_definitions/login.rb", "\n"),
    ]);
    included(
        &map,
        &[
            "lib/shop.rb",
            "lib/shop/order.rb",
            "app/models/user.rb",
            "app/controllers/orders_controller.rb",
        ],
    );
    excluded_as(
        &map,
        "test",
        &[
            "spec/models/user_spec.rb",
            "spec/spec_helper.rb",
            "test/models/user_test.rb",
            "features/step_definitions/login.rb",
        ],
    );
}

#[test]
fn layout_go_module() {
    let (_temp, map) = layout(&[
        ("go.mod", "module example.com/shop\n\ngo 1.22\n"),
        // A Go module keeps package files at its root, which is as
        // conventional as any subdirectory.
        ("main.go", "package main\n"),
        ("shop.go", "package shop\n"),
        ("cmd/server/main.go", "package main\n"),
        ("internal/store/store.go", "package store\n"),
        ("pkg/api/api.go", "package api\n"),
        ("internal/store/store_test.go", "package store\n"),
        ("internal/store/testdata/golden.go", "package store\n"),
    ]);
    included(
        &map,
        &[
            "main.go",
            "shop.go",
            "cmd/server/main.go",
            "internal/store/store.go",
            "pkg/api/api.go",
        ],
    );
    excluded_as(
        &map,
        "test",
        &[
            "internal/store/store_test.go",
            "internal/store/testdata/golden.go",
        ],
    );
}

#[test]
fn layout_java_and_kotlin_maven_gradle() {
    let (_temp, map) = layout(&[
        ("pom.xml", "<project/>\n"),
        ("src/main/java/com/shop/Order.java", "class Order {}\n"),
        ("src/main/kotlin/com/shop/User.kt", "class User\n"),
        (
            "src/test/java/com/shop/OrderTest.java",
            "class OrderTest {}\n",
        ),
        ("src/test/kotlin/com/shop/UserSpec.kt", "class UserSpec\n"),
        (
            "src/integrationTest/java/com/shop/OrderIT.java",
            "class OrderIT {}\n",
        ),
    ]);
    included(
        &map,
        &[
            "src/main/java/com/shop/Order.java",
            "src/main/kotlin/com/shop/User.kt",
        ],
    );
    excluded_as(
        &map,
        "test",
        &[
            "src/test/java/com/shop/OrderTest.java",
            "src/test/kotlin/com/shop/UserSpec.kt",
            "src/integrationTest/java/com/shop/OrderIT.java",
        ],
    );
}

#[test]
fn layout_c_and_cpp() {
    let (_temp, map) = layout(&[
        ("package.json", "{}\n"),
        ("src/engine.cpp", "int main() { return 0; }\n"),
        ("src/engine.h", "#pragma once\n"),
        // A public header directory is where a C or C++ project keeps its API.
        ("include/shop/api.h", "#pragma once\n"),
        ("lib/util.c", "int u(void) { return 0; }\n"),
        ("tests/engine_test.cc", "int main() { return 0; }\n"),
        ("src/engine_test.cpp", "int main() { return 0; }\n"),
    ]);
    included(
        &map,
        &[
            "src/engine.cpp",
            "src/engine.h",
            "include/shop/api.h",
            "lib/util.c",
        ],
    );
    excluded_as(
        &map,
        "test",
        &["tests/engine_test.cc", "src/engine_test.cpp"],
    );
}

#[test]
fn layout_csharp() {
    let (_temp, map) = layout(&[
        ("Shop.sln", "\n"),
        ("src/Shop/Shop.csproj", "<Project/>\n"),
        ("src/Shop/Order.cs", "class Order {}\n"),
        // The .NET convention is a sibling project directory named for tests.
        ("tests/Shop.Tests/Shop.Tests.csproj", "<Project/>\n"),
        ("tests/Shop.Tests/OrderTests.cs", "class OrderTests {}\n"),
        ("src/Shop/Form.designer.cs", "partial class Form {}\n"),
    ]);
    included(&map, &["src/Shop/Order.cs"]);
    excluded_as(&map, "test", &["tests/Shop.Tests/OrderTests.cs"]);
    excluded_as(&map, "generated", &["src/Shop/Form.designer.cs"]);
}

#[test]
fn layout_swift_package() {
    let (_temp, map) = layout(&[
        ("Package.swift", "// swift-tools-version:5.9\n"),
        // SwiftPM's layout is Sources/<Target> and Tests/<Target>Tests.
        ("Sources/Shop/Order.swift", "struct Order {}\n"),
        ("Sources/ShopCLI/main.swift", "print(1)\n"),
        ("Tests/ShopTests/OrderTests.swift", "import XCTest\n"),
    ]);
    included(
        &map,
        &["Sources/Shop/Order.swift", "Sources/ShopCLI/main.swift"],
    );
    excluded_as(&map, "test", &["Tests/ShopTests/OrderTests.swift"]);
}

#[test]
fn layout_php_composer_and_laravel() {
    let (_temp, map) = layout(&[
        (
            "composer.json",
            r#"{"autoload":{"psr-4":{"Shop\\":"src/"}}}"#,
        ),
        ("src/Order.php", "<?php class Order {}\n"),
        (
            "app/Http/Controllers/OrderController.php",
            "<?php class C {}\n",
        ),
        ("tests/Feature/OrderTest.php", "<?php class OrderTest {}\n"),
        ("src/OrderTest.php", "<?php class OrderTest {}\n"),
    ]);
    included(
        &map,
        &["src/Order.php", "app/Http/Controllers/OrderController.php"],
    );
    excluded_as(
        &map,
        "test",
        &["tests/Feature/OrderTest.php", "src/OrderTest.php"],
    );
}

// ---- the decline gate --------------------------------------------------------

/// Save a catalog snapshot directly, so a comparison can be tested without a
/// key or a network.
fn catalog_snapshot(root: &Path, id: &str, health: f64, files: Vec<Value>) {
    let manifest = json!({
        "schema_version": 3, "id": id, "created_at": "2026-09-18T00:00:00.000Z",
        "instrument": "catalog", "catalog_version": catalog::CATALOG_VERSION,
        "model": MODEL, "scope": "file", "health": health,
    });
    store::write(root, "quality", id, &manifest, &json!({ "files": files })).unwrap();
}

fn assessed_file(path: &str, health: f64, bytes: u64, present: &[&str]) -> Value {
    json!({
        "path": path, "status": "completed", "health": health, "bytes": bytes,
        "present": present.iter()
            .map(|check| json!({ "check": check, "value": 0.8 }))
            .collect::<Vec<_>>(),
    })
}

#[test]
fn a_diff_reports_what_declined_and_which_properties_appeared() {
    let temp = Temp::new();
    catalog_snapshot(
        &temp.0,
        "q_00000000000000b1",
        6.0,
        vec![
            assessed_file("src/a.ts", 7.0, 100, &[]),
            assessed_file("src/b.ts", 5.0, 100, &["long_method"]),
            assessed_file("src/gone.ts", 9.0, 100, &[]),
        ],
    );
    catalog_snapshot(
        &temp.0,
        "q_00000000000000a1",
        5.0,
        vec![
            assessed_file("src/a.ts", 4.0, 180, &["deep_nesting", "magic_values"]),
            assessed_file("src/b.ts", 5.0, 100, &["long_method"]),
            assessed_file("src/new.ts", 8.0, 50, &[]),
        ],
    );
    let view = query::diff(
        &temp.0,
        "quality",
        "q_00000000000000b1",
        "q_00000000000000a1",
        20,
    )
    .unwrap();
    let counts = &view["counts"];
    assert_eq!(counts["declined"], 1);
    assert_eq!(counts["improved"], 0);
    assert_eq!(counts["unchanged"], 1);
    assert_eq!(counts["added"], 1);
    assert_eq!(counts["removed"], 1);
    assert_eq!(counts["properties_appeared"], 2);
    let declined = &view["declined"][0];
    assert_eq!(declined["path"], "src/a.ts");
    assert_eq!(declined["movement"], -3.0);
    let appeared: BTreeSet<&str> = declined["appeared"]
        .as_array()
        .unwrap()
        .iter()
        .filter_map(|v| v.as_str())
        .collect();
    assert_eq!(appeared, BTreeSet::from(["deep_nesting", "magic_values"]));
    assert_eq!(view["health"]["from"], 6.0);
    assert_eq!(view["health"]["to"], 5.0);
}

#[test]
fn a_diff_says_when_a_movement_cannot_be_the_code() {
    // Identical bytes mean the same question was asked twice, so a movement is
    // the model's own variation. Reporting it as a decline without saying so
    // would invite a reader to go looking for an edit that never happened.
    let temp = Temp::new();
    catalog_snapshot(
        &temp.0,
        "q_0000000000000501",
        6.0,
        vec![assessed_file("src/a.ts", 6.0, 100, &[])],
    );
    catalog_snapshot(
        &temp.0,
        "q_0000000000000502",
        5.8,
        vec![assessed_file("src/a.ts", 5.8, 100, &[])],
    );
    let view = query::diff(
        &temp.0,
        "quality",
        "q_0000000000000501",
        "q_0000000000000502",
        20,
    )
    .unwrap();
    assert_eq!(view["counts"]["declined"], 1);
    assert_eq!(view["declined"][0]["same_source"], true);

    let text = query::render(&view);
    assert!(
        text.contains("the file did not change"),
        "the reader must be told the code is identical:\n{text}"
    );
}

#[test]
fn a_diff_refuses_to_compare_two_different_questions() {
    let temp = Temp::new();
    catalog_snapshot(
        &temp.0,
        "q_00000000000000c1",
        6.0,
        vec![assessed_file("src/a.ts", 6.0, 100, &[])],
    );
    // A snapshot from a different catalog asks different questions, so a
    // difference between the two is not a difference in the code.
    let manifest = json!({
        "schema_version": 3, "id": "q_0000000000000001",
        "created_at": "2026-09-01T00:00:00.000Z", "instrument": "catalog",
        "catalog_version": "smells-v1", "model": MODEL, "health": 6.0,
    });
    store::write(
        &temp.0,
        "quality",
        "q_0000000000000001",
        &manifest,
        &json!({ "files": [assessed_file("src/a.ts", 6.0, 100, &[])] }),
    )
    .unwrap();
    let error = query::diff(
        &temp.0,
        "quality",
        "q_0000000000000001",
        "q_00000000000000c1",
        20,
    )
    .unwrap_err();
    assert!(error.contains("catalog_version"), "{error}");

    // The same snapshot twice is a mistake, not a comparison.
    let same = query::diff(
        &temp.0,
        "quality",
        "q_00000000000000c1",
        "q_00000000000000c1",
        20,
    )
    .unwrap_err();
    assert!(same.contains("same snapshot twice"), "{same}");
}

#[test]
fn a_diff_will_not_read_a_snapshot_the_catalog_did_not_write() {
    let temp = Temp::new();
    catalog_snapshot(
        &temp.0,
        "q_00000000000000ca",
        6.0,
        vec![assessed_file("src/a.ts", 6.0, 100, &[])],
    );
    // A snapshot with no instrument marker predates the catalog.
    store::write(
        &temp.0,
        "quality",
        "q_000000000000001e",
        &json!({ "schema_version": 3, "id": "q_000000000000001e",
                 "created_at": "2026-09-01T00:00:00.000Z", "model": MODEL }),
        &json!({ "files": [] }),
    )
    .unwrap();
    let error = query::diff(
        &temp.0,
        "quality",
        "q_000000000000001e",
        "q_00000000000000ca",
        20,
    )
    .unwrap_err();
    assert!(error.contains("not written by the catalog"), "{error}");
}

#[test]
fn build_output_a_manifest_ships_is_not_a_source_root() {
    // A compiled package declares what it ships, which is the build output.
    // `"bin": "dist/index.js"` is a real declaration and a useless source root:
    // the code a reader would change is the input, not the artifact. Found by
    // running the scope over real repositories, where three of nine reported
    // `dist` as source.
    let temp = Temp::new();
    temp.write(
        "package.json",
        r#"{"bin":{"tool":"dist/index.js"},"main":"build/main.js"}"#,
    );
    temp.write("src/index.ts", "export const a = 1;\n");
    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    assert_eq!(view.roots, vec!["src".to_string()]);
    assert!(
        !view
            .roots
            .iter()
            .any(|root| root == "dist" || root == "build"),
        "build output became a source root: {:?}",
        view.roots
    );
}

#[test]
fn a_test_directory_is_recognised_by_suffix_as_well_as_by_name() {
    // Found on real repositories: Hono keeps `runtime-tests/`, and .NET names a
    // test project `Shop.Tests`. Neither is in the fixed list, both are tests.
    for path in [
        "runtime-tests/workerd/index.ts",
        "runtime-tests/lambda/mock.ts",
        "Shop.Tests/OrderFixture.cs",
        "integration_tests/api.py",
        "api-spec/contract.ts",
    ] {
        assert_eq!(
            skipped_path(path).map(Skipped::reason),
            Some("test"),
            "{path} should be recognised as test code"
        );
    }
    // A separator is required before the suffix, so these stay source.
    for path in [
        "src/contest/rules.ts",
        "src/latest/index.ts",
        "protest/main.go",
    ] {
        assert_eq!(skipped_path(path), None, "{path} is source, not a test");
    }
}

#[test]
fn tool_configuration_is_not_the_product_being_built() {
    // Found on real repositories: config files were nearly all of what remained
    // unclassified across seven of them.
    let temp = Temp::new();
    temp.write("package.json", "{}\n");
    temp.write("src/app.ts", "export const a = 1;\n");
    for config in [
        "vite.config.ts",
        "vitest.config.mts",
        "eslint.config.mjs",
        "tsup.config.ts",
        "postcss.config.js",
        "packages/web/next.config.js",
    ] {
        temp.write(config, "export default {};\n");
    }
    // A file merely named for configuring something is still source.
    temp.write("src/configure.ts", "export const c = 1;\n");

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let entry = |path: &str| {
        view.entries
            .iter()
            .find(|e| e.path == path)
            .unwrap()
            .clone()
    };
    for config in [
        "vite.config.ts",
        "eslint.config.mjs",
        "packages/web/next.config.js",
    ] {
        assert_eq!(entry(config).status, scope::Status::Excluded, "{config}");
        assert_eq!(
            entry(config).reason,
            "build or tool configuration",
            "{config}"
        );
    }
    assert_eq!(entry("src/configure.ts").status, scope::Status::Included);
    assert_eq!(view.ambiguous(), 0);
    // The dotfile spelling never reaches classification, because discovery
    // skips hidden files, but the rule covers it for a path named directly.
    assert_eq!(
        scope::classify(&temp.0, &[temp.0.join(".eslintrc.js")], None).entries[0].reason,
        "build or tool configuration"
    );
}

// ---- what eight real projects taught the scope --------------------------------

#[test]
fn a_gradle_module_names_its_build_file_after_itself() {
    // JUnit 5 calls it `junit-jupiter-api.gradle.kts`, not `build.gradle.kts`.
    // Looking only for the fixed name found 9 of its 1,064 source files.
    let temp = Temp::new();
    temp.write("settings.gradle.kts", "rootProject.name = \"junit\"\n");
    temp.write(
        "junit-jupiter-api/junit-jupiter-api.gradle.kts",
        "plugins {}\n",
    );
    temp.write(
        "junit-jupiter-api/src/main/java/org/junit/Api.java",
        "class Api {}\n",
    );
    temp.write(
        "junit-jupiter-api/src/test/java/org/junit/ApiTest.java",
        "class ApiTest {}\n",
    );

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let status = |p: &str| view.entries.iter().find(|e| e.path == p).unwrap().status;
    assert_eq!(
        status("junit-jupiter-api/src/main/java/org/junit/Api.java"),
        scope::Status::Included
    );
    assert_eq!(
        status("junit-jupiter-api/src/test/java/org/junit/ApiTest.java"),
        scope::Status::Excluded
    );
}

#[test]
fn a_dotnet_project_keeps_its_sources_beside_the_project_file() {
    // Rx.NET nests projects several levels deep and puts sources directly in the
    // project directory, with a namespace folder called `Internal`. That folder
    // collides with Go's `internal`, so it became the only root and every file
    // beside the project file was unclassified: 0 of 1,473 included.
    let temp = Temp::new();
    temp.write("Reactive.sln", "\n");
    temp.write(
        "Rx.NET/Source/src/System.Reactive/System.Reactive.csproj",
        "<Project/>\n",
    );
    temp.write(
        "Rx.NET/Source/src/System.Reactive/AnonymousObservable.cs",
        "class A {}\n",
    );
    temp.write(
        "Rx.NET/Source/src/System.Reactive/Internal/Sink.cs",
        "class S {}\n",
    );
    temp.write(
        "Rx.NET/Source/tests/Tests.System.Reactive/ObservableTest.cs",
        "class T {}\n",
    );

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let status = |p: &str| view.entries.iter().find(|e| e.path == p).unwrap().status;
    assert_eq!(
        status("Rx.NET/Source/src/System.Reactive/AnonymousObservable.cs"),
        scope::Status::Included,
        "a source file beside its project file is source"
    );
    assert_eq!(
        status("Rx.NET/Source/src/System.Reactive/Internal/Sink.cs"),
        scope::Status::Included
    );
    assert_eq!(
        status("Rx.NET/Source/tests/Tests.System.Reactive/ObservableTest.cs"),
        scope::Status::Excluded
    );
    assert_eq!(view.ambiguous(), 0);
}

#[test]
fn a_python_test_package_is_not_a_source_root() {
    // `requests` keeps an `__init__.py` in `tests/`, which made it a source root
    // beside `src`. A Python package that is a test package is still a test.
    let temp = Temp::new();
    temp.write("pyproject.toml", "[project]\nname = \"requests\"\n");
    temp.write("src/requests/__init__.py", "\n");
    temp.write("src/requests/api.py", "def get(): pass\n");
    temp.write("tests/__init__.py", "\n");
    temp.write("tests/test_api.py", "def test_get(): pass\n");

    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    assert!(
        !view.roots.iter().any(|root| root == "tests"),
        "a test package became a source root: {:?}",
        view.roots
    );
    assert_eq!(
        view.entries
            .iter()
            .find(|e| e.path == "tests/test_api.py")
            .unwrap()
            .status,
        scope::Status::Excluded
    );
}

#[test]
fn code_inside_documentation_is_there_to_be_read() {
    let temp = Temp::new();
    temp.write("package.json", "{}\n");
    temp.write("src/app.ts", "export const a = 1;\n");
    temp.write(
        "docs/mkdocs/examples/readme.cpp",
        "int main() { return 0; }\n",
    );
    temp.write("documentation/src/demo.java", "class Demo {}\n");
    let files = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let view = scope::classify(&temp.0, &files, None);
    let entry = |p: &str| view.entries.iter().find(|e| e.path == p).unwrap().clone();
    assert_eq!(
        entry("docs/mkdocs/examples/readme.cpp").reason,
        "documentation"
    );
    assert_eq!(entry("documentation/src/demo.java").reason, "documentation");
    assert_eq!(entry("src/app.ts").status, scope::Status::Included);
}

#[test]
fn a_tools_own_untracked_state_is_not_a_change_somebody_made() {
    // Reviewing a real merged commit in a repository that had been assessed
    // reported 393 changed files, 391 of them this tool's own response cache.
    // Git lists them because nothing ignores them; nobody changed them.
    let temp = repository();
    temp.write("src/a.ts", "export const a = 1;\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    temp.write("src/b.ts", "export const b = 2;\n");
    temp.write(".supercov/quality/requests/abc.json", "{}\n");
    temp.write(".cache/tool/state.ts", "export const c = 3;\n");

    let found = changes::collect(&temp.0, &changes::Range::Unstaged, &[]).unwrap();
    let paths: Vec<&str> = found.iter().map(|c| c.path.as_str()).collect();
    assert_eq!(
        paths,
        vec!["src/b.ts"],
        "only the real new file is a change"
    );
}

#[test]
fn patch_takes_a_run_to_cross_findings_with() {
    match parse(
        ["patch", "--run", "latest", "--base", "main"]
            .iter()
            .map(|s| (*s).to_owned())
            .collect(),
    ) {
        Ok(Command::Patch { run, range, .. }) => {
            assert_eq!(run.as_deref(), Some("latest"));
            assert_eq!(range, Some(changes::Range::Base("main".into())));
        }
        _ => panic!("expected a patch"),
    }
    assert!(parse(vec!["patch".into(), "--run".into()]).is_err());
    // Without it, nothing about coverage is read, because an assessment must
    // never require a run and a run must never require an assessment.
    match parse(vec!["patch".into()]) {
        Ok(Command::Patch { run, .. }) => assert!(run.is_none()),
        _ => panic!("expected a patch"),
    }
}

#[test]
fn a_finding_in_uncovered_code_is_marked_and_counted() {
    // Neither half justifies stopping anyone alone: a structural property is a
    // judgment, and an uncovered line is normal in code nobody has tested. Both
    // at once is the claim a coverage tool and a quality tool cannot make apart.
    let mut report = json!({
        "reviewed_files": 2, "introduced": 1, "range_description": "unstaged changes",
        "files": [
            { "path": "src/a.ts", "status": "completed",
              "present": [{"check": "deep_nesting", "value": 0.8}] },
            { "path": "src/b.ts", "status": "completed", "present": [] },
        ]
    });
    // Stand in for the run, so the marking logic is tested without one.
    let covered = |path: &str, uncovered: usize| json!({ "measured_lines": 10, "uncovered_lines": uncovered, "in_run": true, "path": path });
    let files = report["files"].as_array_mut().unwrap();
    files[0]["coverage"] = covered("src/a.ts", 4);
    files[1]["coverage"] = covered("src/b.ts", 4);
    for file in files.iter_mut() {
        let introduced = file["present"].as_array().is_some_and(|p| !p.is_empty());
        let uncovered = file["coverage"]["uncovered_lines"].as_u64().unwrap_or(0);
        if introduced && uncovered > 0 {
            file["untested_and_changed"] = json!(true);
        }
    }
    assert_eq!(report["files"][0]["untested_and_changed"], true);
    assert!(report["files"][1]["untested_and_changed"].is_null());

    let text = human_patch(&report, 20);
    assert!(
        text.contains("not covered by the run"),
        "the reader must be told the finding sits in untested code:\n{text}"
    );
}

#[test]
fn a_scope_question_carries_the_whole_tree_and_asks_only_what_is_unsettled() {
    // A convention is per-path and cannot see the tree. The model seeing all of
    // it at once is the entire difference: `runtime/python/runtime.py` is
    // unclassifiable alone and obvious beside `runtime/javascript/` and a
    // manifest that ships one of them.
    let asking = vec![
        "runtime/python/runtime.py".to_string(),
        "spikes/toy/main.rs".to_string(),
    ];
    let request = catalog::scope_request(
        "supercov",
        "src/a.ts\nruntime/python/runtime.py\nspikes/toy/main.rs",
        "package.json\nCargo.toml",
        &asking,
    );
    let state = request["state"].as_object().unwrap();
    assert_eq!(state["repository"], "supercov");
    assert!(
        state["tree"]
            .as_str()
            .unwrap()
            .contains("runtime/python/runtime.py")
    );
    assert!(state["manifests"].as_str().unwrap().contains("Cargo.toml"));
    let questions = request["questions"].as_object().unwrap();
    assert_eq!(
        questions.len(),
        2,
        "only the unsettled files are asked about"
    );
    let task = questions["f0"]["instructions"]["task"].as_str().unwrap();
    assert!(task.contains("runtime/python/runtime.py"));
    assert!(task.contains("in the context of the whole tree"));
    // Paths only. Sending contents would cost a hundred times as much and is
    // not what this was measured on.
    assert!(!state.contains_key("source"));
}

#[test]
fn a_manifest_is_recognised_from_its_path_for_the_scope_question() {
    for path in [
        "package.json",
        "crates/engine/Cargo.toml",
        "pyproject.toml",
        "Package.swift",
        "junit-jupiter-api/junit-jupiter-api.gradle.kts",
        "src/Shop/Shop.csproj",
        "Reactive.sln",
    ] {
        assert!(scope::declares_a_package(path), "{path} declares a package");
    }
    for path in ["src/app.ts", "README.md", "src/packaged.rs"] {
        assert!(!scope::declares_a_package(path), "{path} does not");
    }
}

#[test]
fn declared_roots_are_an_answer_and_the_model_does_not_override_them() {
    // Asking the model to second-guess a declaration would make
    // SUPERCOV_SOURCE_ROOTS advisory, which is the opposite of its purpose.
    let temp = Temp::new();
    temp.write("package.json", "{}\n");
    temp.write("scratch/prototype.ts", "export const b = 2;\n");
    let found = discover(&temp.0, &[PathBuf::from(".")]).unwrap();
    let roots = vec!["scratch".to_string()];
    let mut explicit = scope::classify(&temp.0, &found, Some(&roots));
    assert_eq!(explicit.mode, "explicit");
    assert!(
        resolve_ambiguity(&temp.0, &mut explicit, &found, Some("key"), false).is_none(),
        "an explicit scope is never re-decided"
    );
    // And with nothing ambiguous there is nothing to ask, so no request is made.
    let mut automatic = scope::classify(&temp.0, &found, None);
    if automatic.ambiguous() == 0 {
        assert!(resolve_ambiguity(&temp.0, &mut automatic, &found, Some("key"), false).is_none());
    }
    // Without a credential it stays silent rather than failing an assessment.
    let mut again = scope::classify(&temp.0, &found, None);
    assert!(resolve_ambiguity(&temp.0, &mut again, &found, None, false).is_none());
    assert!(resolve_ambiguity(&temp.0, &mut again, &found, Some("  "), false).is_none());
}

// ---- running it for real ------------------------------------------------------

#[test]
fn a_rate_limit_is_waited_out_once_by_everyone() {
    // Eight requests run at once. Without somewhere shared to put a limit, each
    // worker discovers it alone and they all wake together, which is how a
    // limit becomes a stampede.
    let started = Instant::now();
    pause_for(Duration::from_millis(120));
    let workers: Vec<_> = (0..4)
        .map(|_| std::thread::spawn(wait_out_any_pause))
        .collect();
    for worker in workers {
        worker.join().unwrap();
    }
    let waited = started.elapsed();
    assert!(
        waited >= Duration::from_millis(120),
        "every worker waited: {waited:?}"
    );
    assert!(
        waited < Duration::from_secs(3),
        "and none of them waited forever: {waited:?}"
    );
    // Once it has passed, nobody waits again.
    let after = Instant::now();
    wait_out_any_pause();
    assert!(after.elapsed() < Duration::from_millis(400));
}

#[test]
fn a_longer_pause_replaces_a_shorter_one_and_never_the_other_way() {
    pause_for(Duration::from_millis(10));
    pause_for(Duration::from_millis(400));
    pause_for(Duration::from_millis(10));
    let started = Instant::now();
    wait_out_any_pause();
    assert!(
        started.elapsed() >= Duration::from_millis(350),
        "the longest wait wins, so a later short 429 cannot shorten an earlier long one"
    );
}

#[test]
fn a_run_says_what_it_will_cost_before_it_spends_it() {
    // Output tokens are free, so the bill is the input, and the input is known
    // exactly from the bytes about to be sent. On a monorepo this is the
    // difference between a surprise and a decision.
    let request = catalog::file_request("a.ts", &"x".repeat(300_000));
    let bytes = serde_json::to_vec(&request).unwrap();
    let pending = vec![((0usize, None), request, bytes)];
    let (tokens, usd) = estimated_cost(&pending);
    assert!(tokens > 90_000, "{tokens}");
    assert!((usd - tokens as f64 / 1e6 * 0.042).abs() < 1e-9);
    assert_eq!(estimated_cost(&[]), (0, 0.0));
}

#[test]
fn the_cache_follows_the_content_so_a_branch_switch_costs_nothing() {
    // A response is keyed by the hash of the exact request, which contains the
    // file's bytes and nothing about where it came from. Switching branches,
    // rebasing or checking out an old commit therefore re-uses every answer for
    // a file whose content is unchanged, and pays only for the ones that moved.
    let temp = Temp::new();
    let request = catalog::file_request("src/a.ts", "export const a = 1;\n");
    let hash = digest(&serde_json::to_vec(&request).unwrap());
    let entry = CacheEntry {
        request_hash: hash.clone(),
        response: ApiResponse {
            model: MODEL.to_owned(),
            answers: catalog::properties()
                .iter()
                .map(|c| (c.id.clone(), Answer::Noul { noul: 0.2 }))
                .collect(),
            usage: Usage {
                input_tokens: 100,
                output_tokens: 0,
            },
        },
        elapsed_ms: 1,
    };
    let path = store::responses(&temp.0, "quality").join(format!("{hash}.json"));
    fs::create_dir_all(path.parent().unwrap()).unwrap();
    save(&path, &entry).unwrap();

    // The same content in a different place is the same request.
    let moved = catalog::file_request("src/a.ts", "export const a = 1;\n");
    let moved_hash = digest(&serde_json::to_vec(&moved).unwrap());
    assert_eq!(moved_hash, hash);
    assert!(
        cached(&path, &hash, &moved).unwrap().is_some(),
        "answered from cache"
    );

    // An edit is a different request, so it is paid for and nothing stale is
    // served in its place.
    let edited = catalog::file_request("src/a.ts", "export const a = 2;\n");
    let edited_hash = digest(&serde_json::to_vec(&edited).unwrap());
    assert_ne!(edited_hash, hash);
    assert!(
        cached(
            &store::responses(&temp.0, "quality").join(format!("{edited_hash}.json")),
            &edited_hash,
            &edited
        )
        .unwrap()
        .is_none()
    );
}

#[test]
fn with_no_range_a_dirty_tree_means_the_uncommitted_work() {
    // Someone running this in a tree with uncommitted edits means those edits.
    // Asking them to type --unstaged to get what they are looking at is the
    // kind of default that makes a command feel like paperwork.
    let temp = repository();
    temp.write("src/a.ts", "export const a = 1;\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);

    temp.write("src/a.ts", "export const a = 2;\n");
    assert_eq!(changes::automatic(&temp.0), changes::Range::Unstaged);

    // An untracked file is uncommitted work too.
    git_in(&temp.0, &["checkout", "--quiet", "--", "src/a.ts"]);
    temp.write("src/new.ts", "export const b = 2;\n");
    assert_eq!(changes::automatic(&temp.0), changes::Range::Unstaged);

    // Staged and nothing else means what a commit would contain.
    fs::remove_file(temp.0.join("src/new.ts")).unwrap();
    temp.write("src/a.ts", "export const a = 3;\n");
    git_in(&temp.0, &["add", "src/a.ts"]);
    assert_eq!(changes::automatic(&temp.0), changes::Range::Staged);
}

#[test]
fn with_no_range_a_clean_tree_means_everything_since_the_default_branch() {
    let temp = repository();
    temp.write("src/a.ts", "export const a = 1;\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    git_in(&temp.0, &["branch", "-M", "main"]);
    git_in(&temp.0, &["checkout", "--quiet", "-b", "work"]);
    temp.write("src/b.ts", "export const b = 2;\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "mine"]);

    // Nothing uncommitted, so the subject is the branch.
    assert_eq!(
        changes::automatic(&temp.0),
        changes::Range::Base("main".into())
    );
    let found = changes::collect(&temp.0, &changes::automatic(&temp.0), &[]).unwrap();
    assert_eq!(
        found.iter().map(|c| c.path.as_str()).collect::<Vec<_>>(),
        vec!["src/b.ts"]
    );
}

#[test]
fn the_default_branch_comes_from_the_remote_before_any_guess() {
    let temp = repository();
    temp.write("src/a.ts", "export const a = 1;\n");
    git_in(&temp.0, &["add", "."]);
    git_in(&temp.0, &["commit", "--quiet", "-m", "first"]);
    git_in(&temp.0, &["branch", "-M", "main"]);
    // No remote at all: fall back to a conventional name that exists.
    assert_eq!(changes::default_branch(&temp.0).as_deref(), Some("main"));

    // What the remote calls its default wins over the convention, because a
    // repository whose trunk is `develop` should not be compared with `main`.
    git_in(&temp.0, &["checkout", "--quiet", "-b", "develop"]);
    git_in(
        &temp.0,
        &["update-ref", "refs/remotes/origin/develop", "HEAD"],
    );
    git_in(
        &temp.0,
        &[
            "symbolic-ref",
            "refs/remotes/origin/HEAD",
            "refs/remotes/origin/develop",
        ],
    );
    assert_eq!(
        changes::default_branch(&temp.0).as_deref(),
        Some("origin/develop")
    );
}

#[test]
fn assessing_without_a_key_stops_before_it_does_anything() {
    // It used to discover this once per file, deep inside the sender, and every
    // file failed separately: the result was an empty report claiming a score
    // over zero files and an exit code of success.
    let error = require_key(None, Instrument::Catalog).unwrap_err();
    assert!(error.contains("TYPESAFE_API_KEY"), "{error}");
    assert!(
        error.contains("typesafe.ai"),
        "the message says where to get one"
    );
    assert!(error.contains("--dry-run"), "and what works without one");
    assert!(error.starts_with("quality needs"), "{error}");
    let security = require_key(None, Instrument::Security).unwrap_err();
    assert!(
        security.starts_with("security needs"),
        "a security scan names itself, not quality: {security}"
    );
    assert!(
        require_key(Some("   "), Instrument::Catalog).is_err(),
        "a blank key is no key"
    );
    assert!(require_key(Some("apikey_x"), Instrument::Security).is_ok());

    // A key is never an option, because one on the command line lands in shell
    // history and in the process list.
    assert!(parse_scan(vec!["--key".into(), "apikey_x".into()]).is_err());
    assert!(parse_scan(vec!["--api-key".into(), "apikey_x".into()]).is_err());
}

#[test]
fn a_band_matches_the_number_printed_beside_it() {
    // 4.95 prints as 5.0, and a reader seeing `weak (5.0/10)` beside a legend
    // that says fair starts at 5 would be right to distrust both.
    assert_eq!(band(Some(4.95)), "fair");
    assert_eq!(band(Some(4.94)), "weak");
    assert_eq!(band(Some(7.95)), "good");
    assert_eq!(band(Some(7.94)), "fair");
}

// ---- security lane ----------------------------------------------------------

#[test]
fn security_asks_its_own_twelve_of_a_file_and_nothing_from_the_complexity_catalog() {
    let temp = Temp::new();
    temp.write("src/a.ts", "export const a = 1\n");
    let options = Options {
        paths: vec![PathBuf::from("src/a.ts")],
        dry_run: true,
        ..Options::default()
    };
    let (report, _) = run_health(&temp.0, &options, None, Instrument::Security).unwrap();
    assert_eq!(report["instrument"], "security");
    assert_eq!(report["catalog_version"], catalog::security::VERSION);
    let requests = report["requests"].as_array().unwrap();
    assert_eq!(requests.len(), 1);
    let asked: BTreeSet<&str> = requests[0]["questions"]
        .as_object()
        .unwrap()
        .keys()
        .map(String::as_str)
        .collect();
    let security: BTreeSet<&str> = catalog::security::checks()
        .iter()
        .map(|c| c.id.as_str())
        .collect();
    assert_eq!(asked, security);
    assert!(!asked.contains("deep_nesting") && !asked.contains("weakens_tests"));
    // And the quality lane asks a file none of the security questions.
    let (report, _) = run_health(&temp.0, &options, None, Instrument::Catalog).unwrap();
    let asked: BTreeSet<&str> = report["requests"][0]["questions"]
        .as_object()
        .unwrap()
        .keys()
        .map(String::as_str)
        .collect();
    assert!(asked.is_disjoint(&security));
}

#[test]
fn a_security_answer_is_never_scored_and_sorts_by_what_fired() {
    let flagged = Answers {
        lines: Vec::new(),
        labels: Vec::new(),

        classified: BTreeMap::new(),
        path: "src/b.ts".into(),
        sha256: "test-source".into(),
        bytes: 10,
        windows: 1,
        note: None,
        values: Some(values(&[
            ("injection_sink", 0.9),
            ("secret_in_source", 0.7),
            ("weak_cryptography", 0.1),
        ])),
        cached: false,
        error: None,
    };
    let value = scored(&flagged, Instrument::Security);
    assert!(
        value["health"].is_null(),
        "security answers are never composed into a number"
    );
    let present: Vec<&str> = value["present"]
        .as_array()
        .unwrap()
        .iter()
        .map(|p| p["check"].as_str().unwrap())
        .collect();
    assert_eq!(present, ["injection_sink", "secret_in_source"]);
    // The same answers under the quality instrument would have a health.
    assert!(scored(&flagged, Instrument::Catalog)["health"].is_number());
}

#[test]
fn the_security_report_names_what_fired_and_where_tests_never_went() {
    let report = json!({
        "counts": {"assessed": 3, "flagged": 1},
        "by_check": {"injection_sink": 1},
        "catalog_version": "security-v3", "model": "jev-1.13.0", "id": "q_0123456789abcdef",
        "run": "run_1", "flagged_in_untested_code": 1, "flagged_executed_unasserted": 1,
        "files": [
            {"path": "src/routes.ts", "status": "completed",
             "present": [{"check": "injection_sink", "value": 0.93, "tier": "line",
                          "lines": [{"line": 42, "check": "injection_sink", "value": 0.91, "text": "db.query(`select ${id}`)"}]}],
             "flagged_and_untested": true, "flagged_and_unasserted": true,
             "assertions": {"lines_credited": 0},
             "coverage": {"in_run": true, "uncovered_lines": 12}},
            {"path": "src/clean.ts", "status": "completed", "present": []},
            {"path": "src/broken.ts", "status": "failed", "error": "unreadable"}
        ]
    });
    let text = human_security(&report);
    assert!(text.starts_with("Security: 1 of 3 files flagged, 2 clean.\n"));
    assert!(text.contains("injection_sink 1"));
    assert!(text.contains("1 flagged files have lines no test in run run_1 executed; 1 are executed by tests that no assertion is credited with."));
    assert!(text.contains("executed by tests, but no assertion is credited"));
    assert!(
        text.contains(
            "  src/routes.ts\n    0.93  injection_sink\n          line 42  0.91  db.query(`select ${id}`)\n    and 12 of its measured lines"
        ),
        "{text}"
    );
    assert!(
        !text.contains("file-level only"),
        "a line-confirmed finding carries no caveat"
    );
    assert!(
        !text.contains("src/clean.ts"),
        "a clean file is counted, not listed"
    );
    assert!(text.contains("error  src/broken.ts"));
    assert!(
        !text.contains("/10"),
        "no number is ever printed for security"
    );
}

#[test]
fn security_snapshots_live_in_their_own_lane_and_read_back_as_security() {
    let temp = Temp::new();
    let (id, _) = store::identity().unwrap();
    let manifest = json!({
        "created_at": "2026-09-20T00-00-00-000000Z", "instrument": "security",
        "catalog_version": "security-v3", "model": "jev-1.13.0",
        "counts": {"assessed": 1, "flagged": 1}, "by_check": {"secret_in_source": 1},
    });
    let files = json!({"files": [{"path": "src/k.ts", "status": "completed",
        "present": [{"check": "secret_in_source", "value": 0.99}], "checks": {"secret_in_source": 0.99}}]});
    store::write(&temp.0, "security", &id, &manifest, &files).unwrap();
    // Nothing in the quality lane, so quality cannot read it as its own.
    assert!(query::show(&temp.0, "quality", None, 20).is_err());
    let view = query::show(&temp.0, "security", None, 20).unwrap();
    assert_eq!(view["view"], "security");
    assert_eq!(view["instrument"], "security");
    let text = query::render(&view);
    assert!(text.starts_with("Security: 1 of 1 files flagged, 0 clean.\n"));
    assert!(text.contains("0.99  secret_in_source"));
    let file = query::file(&temp.0, "security", "src/k.ts", None).unwrap();
    assert!(query::render(&file).starts_with("src/k.ts  security surface\n"));
    let gaps = query::gaps(&temp.0, "security", None, 20).unwrap();
    assert_eq!(gaps["total"], 1);
}

#[test]
fn an_assessment_takes_a_run_to_cross_with() {
    let options = parse_scan(vec!["--run".into(), "latest".into(), "src".into()]).unwrap();
    assert_eq!(options.run.as_deref(), Some("latest"));
    assert!(parse_scan(vec!["--run".into()]).is_err());
    assert!(parse_scan(vec!["--run".into(), "a".into(), "--run".into(), "b".into()]).is_err());
}

#[test]
fn cleaning_an_assessment_lane_preserves_the_other_lane() {
    let temp = Temp::new();
    let (id, _) = store::identity().unwrap();
    for lane in ["quality", "security"] {
        store::write(
            &temp.0,
            lane,
            &id,
            &json!({"created_at": "2026-09-23T00:00:00Z"}),
            &json!({"files": []}),
        )
        .unwrap();
    }
    let preview = clean(&temp.0, "security", 0, true).unwrap();
    assert_eq!(preview["view"], "security.clean");
    assert_eq!(store::list(&temp.0, "security").unwrap().len(), 1);
    clean(&temp.0, "security", 0, false).unwrap();
    assert!(store::list(&temp.0, "security").unwrap().is_empty());
    assert_eq!(store::list(&temp.0, "quality").unwrap().len(), 1);
}

#[test]
fn security_totals_include_a_check_only_the_line_pass_found() {
    let answer = Answers {
        path: "src/log.ts".into(),
        bytes: 10,
        sha256: "source".into(),
        windows: 1,
        lines: vec![
            json!({"line": 5, "check": "sensitive_data_exposure", "value": 0.9, "text": "log(token)"}),
        ],
        labels: Vec::new(),
        classified: BTreeMap::new(),
        note: None,
        values: Some(values(&[("sensitive_data_exposure", 0.1)])),
        cached: false,
        error: None,
    };
    assert!(present_for(answer.values.as_ref().unwrap(), Instrument::Security).is_empty());
    let record = scored(&answer, Instrument::Security);
    let (flagged, confirmed, checks) = finding_counts(&[record]);
    assert_eq!(flagged, 1);
    assert_eq!(confirmed, 1);
    assert_eq!(checks.get("sensitive_data_exposure"), Some(&1));
}

#[test]
fn base_url_is_read_as_typesafe_sdks_read_it() {
    let endpoint = |base| endpoint_for(base).unwrap();
    assert_eq!(endpoint(None), "https://api.typesafe.ai/v1/systemone");
    assert_eq!(
        endpoint(Some("https://openrouter.ai/api/")),
        "https://openrouter.ai/api/v1/systemone"
    );
    for local in [
        "http://localhost:8787",
        "http://127.0.0.1:8787/api",
        "http://[::1]:8787",
    ] {
        assert_eq!(endpoint(Some(local)), format!("{local}/v1/systemone"));
    }
    for refused in [
        "http://gateway.example.com",
        "http://localhost.example.com",
        "http://localhost@gateway.example.com",
        "gateway.example.com",
        "ftp://localhost",
    ] {
        assert!(endpoint_for(Some(refused)).is_err(), "{refused}");
    }
}

#[test]
fn a_host_is_named_without_credentials_port_or_path() {
    assert_eq!(
        host("https://openrouter.ai/api/v1/systemone"),
        "openrouter.ai"
    );
    assert_eq!(host("http://user:secret@127.0.0.1:8787/api"), "127.0.0.1");
    assert_eq!(host("http://[::1]:8787"), "[::1]");
}

#[test]
fn a_target_directory_is_output_only_when_a_build_owns_it() {
    // realvuln-python-app keeps its whole Flask package in `target/`. Dropping
    // the directory by name left `security scope` with no source at all.
    let flask = Temp::new();
    flask.write(
        "target/runserver.py",
        "from project import app\napp.run()\n",
    );
    flask.write("target/project/__init__.py", "app = object()\n");
    let found = discover_for(&flask.0, &here(), Instrument::Security).unwrap();
    assert!(found.iter().any(|p| p.ends_with("target/runserver.py")));

    let cargo = Temp::new();
    cargo.write("Cargo.toml", "[package]\nname = \"a\"\n");
    cargo.write("src/lib.rs", "pub fn a() {}\n");
    cargo.write("target/debug/build/out.rs", "pub fn generated() {}\n");
    let found = discover_for(&cargo.0, &here(), Instrument::Catalog).unwrap();
    assert!(
        found
            .iter()
            .all(|p| !p.to_string_lossy().contains("/target/"))
    );

    // A target directory elsewhere that Cargo wrote, by its own marker.
    let marked = Temp::new();
    marked.write("app/main.py", "print(1)\n");
    marked.write(
        "target/CACHEDIR.TAG",
        "Signature: 8a477f597d28d172789f06886806bc55\n",
    );
    marked.write("target/release/build.py", "print(2)\n");
    let found = discover_for(&marked.0, &here(), Instrument::Catalog).unwrap();
    assert!(
        found
            .iter()
            .all(|p| !p.to_string_lossy().contains("/target/"))
    );
}

#[test]
fn security_scope_is_the_list_security_reads() {
    // `security scope` walked with the quality rules and without the
    // promotion, so it could report no source for a checkout `security` then
    // assessed, and `--dry-run` sent nothing for a file at the root.
    let temp = Temp::new();
    temp.write("dsvw.py", "import http.server\n");
    temp.write("templates/report.html", "<p>{{ name | safe }}</p>\n");
    let found = discover_for(&temp.0, &here(), Instrument::Security).unwrap();
    let view = scope_for(&temp.0, &found, Instrument::Security);
    let included: Vec<&str> = view.included().map(|e| e.path.as_str()).collect();
    assert_eq!(included, ["dsvw.py", "templates/report.html"]);
    let quality = scope_for(
        &temp.0,
        &discover_for(&temp.0, &here(), Instrument::Catalog).unwrap(),
        Instrument::Catalog,
    );
    assert_eq!(
        quality.included().count(),
        0,
        "quality still leaves it ambiguous"
    );
    assert_eq!(quality.ambiguous(), 1);
}

#[test]
fn vendored_and_minified_javascript_is_not_the_code_under_review() {
    let temp = Temp::new();
    temp.write("package.json", "{}\n");
    temp.write(
        "src/app.js",
        "/*! @license MIT, our own library */\nexport const a = 1;\n",
    );
    temp.write(
        "public/js/app.js",
        "$(function () { $('#form').submit(); });\n",
    );
    temp.write(
        "public/plugins/flot/jquery.flot.js",
        "(function ($) {\n  $.plot = 1;\n})(jQuery);\n",
    );
    temp.write(
        "static/js/widgets.js",
        "/*!\n * Widgets v1.2 | MIT\n */\nvar w = 1;\n",
    );
    temp.write(
        "static/js/redoc.standalone.js",
        &format!("!function(){{{}}}();\n", "var a=1;".repeat(2000)),
    );
    // A Python file with one enormous HTML string is still first-party.
    temp.write(
        "app/dsvw.py",
        &format!("HTML = \"{}\"\nprint(HTML)\n", "<td>".repeat(3000)),
    );
    let found = discover_for(&temp.0, &here(), Instrument::Security).unwrap();
    let view = scope_for(&temp.0, &found, Instrument::Security);
    let reason = |path: &str| {
        let entry = view.entries.iter().find(|e| e.path == path).unwrap();
        (entry.status, entry.reason.clone())
    };
    assert_eq!(
        reason("src/app.js").0,
        scope::Status::Included,
        "a licence in src/ is ours"
    );
    assert_eq!(reason("public/js/app.js").0, scope::Status::Included);
    assert_eq!(reason("app/dsvw.py").0, scope::Status::Included);
    for path in ["public/plugins/flot/jquery.flot.js", "static/js/widgets.js"] {
        assert_eq!(
            reason(path),
            (
                scope::Status::Excluded,
                "vendored third-party library".to_owned()
            ),
            "{path}"
        );
    }
    assert_eq!(
        reason("static/js/redoc.standalone.js"),
        (scope::Status::Excluded, "minified code".to_owned())
    );
}

#[test]
fn json_is_read_for_security_only_when_it_configures_something() {
    for (path, read) in [
        ("config/default.json", true),
        ("src/config.json", true),
        ("proxy.conf.json", true),
        ("appsettings.Development.json", true),
        ("firebase.json", true),
        ("secrets.json", true),
        ("data/static/i18n/fr_FR.json", false),
        ("frontend/src/assets/i18n/de_CH.json", false),
        ("drizzle/meta/0000_snapshot.json", false),
        ("sarif.json", false),
        ("swagger-output.json", false),
        ("bower.json", false),
        ("package.json", false),
    ] {
        assert_eq!(
            is_assessable(Path::new(path), Instrument::Security),
            read,
            "{path}"
        );
    }
}
