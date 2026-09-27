#[test]
fn exp16_accuracy() {
    let xs: Vec<f32> = (-120..=20).map(|i| i as f32 * 0.5).collect();
    let mut v = xs.clone();
    deem_runtime::kernels::scan::exp_in_place(&mut v);
    let mut worst = 0f32;
    for i in 0..xs.len() {
        let want = (xs[i] as f64).exp();
        let got = v[i] as f64;
        let rel = if want == 0.0 { 0.0 } else { (got - want).abs() / want };
        if rel > worst as f64 {
            worst = rel as f32;
        }
    }
    println!("worst rel err: {worst}");
    assert!(worst < 1e-6, "exp16 inaccurate: {worst}");
}

#[test]
fn silu_accuracy() {
    for x in [-30f32, -5.0, -1.0, -0.1, 0.0, 0.1, 1.0, 5.0, 30.0] {
        let mut buf = [x; 1];
        deem_runtime::kernels::scan::silu_in_place(&mut buf);
        let want = x / (1.0 + (-x as f64).exp()) as f32;
        let d = (buf[0] - want).abs();
        assert!(d < 1e-6, "silu({x}) = {} want {want}", buf[0]);
    }
}
