#[cfg(test)]
mod tests {
    use std::sync::atomic::{AtomicUsize, Ordering};

    static PROCESS_STATE: AtomicUsize = AtomicUsize::new(0);

    #[test]
    fn a_writes_output_and_sets_process_state() {
        assert_eq!(PROCESS_STATE.fetch_add(1, Ordering::SeqCst), 0);
        println!("fixture stdout");
        eprintln!("fixture stderr");
    }

    #[test]
    fn b_observes_process_state_from_the_prior_test() {
        assert_eq!(PROCESS_STATE.load(Ordering::SeqCst), 1);
    }

    #[test]
    #[should_panic(expected = "expected fixture panic")]
    fn c_expected_panic() {
        panic!("expected fixture panic");
    }

    #[test]
    #[ignore = "fixture ignore reason"]
    fn d_ignored() {
        panic!("ignored test must not run");
    }
}
