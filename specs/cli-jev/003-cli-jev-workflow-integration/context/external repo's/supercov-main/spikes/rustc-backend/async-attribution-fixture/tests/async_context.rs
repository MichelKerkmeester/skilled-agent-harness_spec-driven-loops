use std::{
    future::Future,
    pin::Pin,
    sync::Arc,
    task::{Context, Poll, Wake, Waker},
};

struct NoopWake;

impl Wake for NoopWake {
    fn wake(self: Arc<Self>) {}
}

fn poll_once<F: Future>(future: Pin<&mut F>) -> Poll<F::Output> {
    let waker = Waker::from(Arc::new(NoopWake));
    future.poll(&mut Context::from_waker(&waker))
}

#[test]
fn assertion_context_crosses_executor_threads() {
    let future = Box::pin(supercov_async_attribution_fixture::assert_after_yield(true));
    let mut future = std::thread::spawn(move || {
        let mut future = future;
        assert!(poll_once(future.as_mut()).is_pending());
        std::hint::black_box(supercov_async_attribution_fixture::outside_assertion_probe());
        future
    })
    .join()
    .unwrap();
    std::thread::spawn(move || {
        assert!(poll_once(future.as_mut()).is_ready());
    })
    .join()
    .unwrap();
}

#[test]
fn cancelled_assertion_restores_the_executor_context() {
    std::thread::spawn(|| {
        let mut future = Box::pin(
            supercov_async_attribution_fixture::assert_after_yield(true),
        );
        assert!(poll_once(future.as_mut()).is_pending());
        drop(future);
        std::hint::black_box(supercov_async_attribution_fixture::outside_assertion_probe());
    })
    .join()
    .unwrap();
}
