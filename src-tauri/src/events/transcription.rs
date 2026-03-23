use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct PartialTranscriptionEvent {
    pub partial_text: String,
    pub is_final: bool,
    pub timestamp: u64,
}

#[derive(Clone, Debug, Serialize)]
pub struct StreamingStateChangedEvent {
    pub is_streaming: bool,
    pub timestamp: u64,
}
