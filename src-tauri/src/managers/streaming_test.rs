use crate::managers::streaming::StreamingState;
use std::sync::atomic::{AtomicBool, Ordering};

#[test]
fn test_streaming_state_creation() {
    let state = StreamingState::new();
    assert!(!state.is_streaming());
}

#[test]
fn test_streaming_state_toggle() {
    let state = StreamingState::new();
    state.start_streaming();
    assert!(state.is_streaming());
    state.stop_streaming();
    assert!(!state.is_streaming());
}
