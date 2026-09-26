//! The version gate the Go matrix rests on.
//!
//! A test of a Go 1.26 construct has nothing to say on the 1.22 leg that
//! exists to prove the floor still works, so it skips there. That makes the
//! gate itself load-bearing: get it wrong in the permissive direction and a
//! job whose toolchain setup quietly produced the wrong version skips every
//! version-specific test and reports success.

#[path = "common/mod.rs"]
mod common;

#[test]
fn a_toolchain_version_is_ordered_by_its_minor_and_nothing_else() {
    // Whatever the tool prints, and whatever the workflow writes.
    assert_eq!(common::version_pair("go1.27.1"), Some((1, 27)));
    assert_eq!(common::version_pair("1.26"), Some((1, 26)));
    assert_eq!(
        common::version_pair("go1.22.12 darwin/arm64"),
        Some((1, 22))
    );
    assert_eq!(common::version_pair("go1.26"), Some((1, 26)));

    // Go's language changes land on minors and never on patches, so the patch
    // must not decide anything: a test asking for 1.26 that skipped on 1.26.8
    // would skip on a perfectly capable toolchain.
    assert!(common::at_least("go1.26.0", "1.26"));
    assert!(common::at_least("go1.26.8", "1.26"));
    assert!(common::at_least("go1.27.1", "1.26"));
    assert!(!common::at_least("go1.25.5", "1.26"));
    assert!(!common::at_least("1.22", "1.26"));

    // A version nothing could read is not a claim that it is new enough. It
    // has to fail closed: `go version` printing something unexpected must not
    // make a 1.26 test run on a 1.22 toolchain and fail as though the code
    // were broken.
    assert!(!common::at_least("", "1.26"));
    assert!(!common::at_least("devel +abcdef", "1.26"));
    assert!(!common::at_least("go", "1.26"));
}

#[test]
fn a_job_that_promised_a_newer_toolchain_cannot_skip_quietly() {
    // This is the whole point of passing the matrix version through: on the
    // 1.26 and 1.27 legs, a skip means setup-go did not deliver what the
    // matrix asked for, and that has to be a failure rather than a green run
    // over a test that never executed.
    assert!(common::skipping_is_a_failure(Some("1.26"), "1.26"));
    assert!(common::skipping_is_a_failure(Some("1.27"), "1.26"));

    // And on the legs pinned to an older toolchain it is a legitimate skip.
    assert!(!common::skipping_is_a_failure(Some("1.22"), "1.26"));
    assert!(!common::skipping_is_a_failure(Some("1.25"), "1.26"));

    // A machine that promised nothing -- a contributor's laptop -- skips.
    assert!(!common::skipping_is_a_failure(None, "1.26"));
}
