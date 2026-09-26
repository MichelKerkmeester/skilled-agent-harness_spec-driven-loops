use std::{
    future::Future,
    pin::Pin,
    task::{Context, Poll},
};

pub struct YieldOnce {
    value: bool,
    yielded: bool,
}

impl YieldOnce {
    pub fn new(value: bool) -> Self {
        Self {
            value,
            yielded: false,
        }
    }
}

impl Future for YieldOnce {
    type Output = bool;

    fn poll(mut self: Pin<&mut Self>, context: &mut Context<'_>) -> Poll<Self::Output> {
        if self.yielded {
            Poll::Ready(self.value)
        } else {
            self.yielded = true;
            context.waker().wake_by_ref();
            Poll::Pending
        }
    }
}

pub async fn assert_after_yield(value: bool) {
    assert!(YieldOnce::new(value).await);
}

pub fn outside_assertion_probe() -> usize {
    17
}

