pub fn selected(value: bool) -> usize {
    if value { 11 } else { 17 }
}

#[cfg(test)]
static PROCESS_STATE: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(0);

#[test]
fn a_ordinary_libtest_sets_process_state() {
    assert_eq!(selected(true), 11);
    assert_eq!(
        PROCESS_STATE.fetch_add(1, std::sync::atomic::Ordering::SeqCst),
        0
    );
}

#[test]
fn b_ordinary_libtest_observes_process_state() {
    assert_eq!(
        PROCESS_STATE.load(std::sync::atomic::Ordering::SeqCst),
        1
    );
}
