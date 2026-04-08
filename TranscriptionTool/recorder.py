import enum
import datetime
import numpy as np
import sounddevice as sd
from scipy.io import wavfile

from config import SAMPLE_RATE, CHANNELS, DTYPE, RECORDINGS_DIR


class State(enum.Enum):
    IDLE = "idle"
    RECORDING = "recording"
    PAUSED = "paused"


class AudioRecorder:
    def __init__(self):
        self._state = State.IDLE
        self._chunks: list[np.ndarray] = []
        self._stream: sd.InputStream | None = None

    @property
    def state(self) -> State:
        return self._state

    def _callback(self, indata, frames, time_info, status):
        if self._state == State.RECORDING:
            self._chunks.append(indata.copy())

    def start(self):
        if self._state != State.IDLE:
            return
        self._chunks = []
        self._stream = sd.InputStream(
            samplerate=SAMPLE_RATE,
            channels=CHANNELS,
            dtype=DTYPE,
            callback=self._callback,
        )
        self._stream.start()
        self._state = State.RECORDING

    def pause(self):
        if self._state == State.RECORDING:
            self._state = State.PAUSED

    def resume(self):
        if self._state == State.PAUSED:
            self._state = State.RECORDING

    def stop(self) -> str | None:
        if self._state == State.IDLE:
            return None
        self._state = State.IDLE
        if self._stream:
            self._stream.stop()
            self._stream.close()
            self._stream = None
        if not self._chunks:
            return None
        audio = np.concatenate(self._chunks, axis=0)
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"recording_{timestamp}.wav"
        filepath = f"{RECORDINGS_DIR}/{filename}"
        wavfile.write(filepath, SAMPLE_RATE, audio)
        self._chunks = []
        return filepath
