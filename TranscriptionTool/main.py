from recorder import AudioRecorder
from transcriber import Transcriber
from ui import TranscriptionApp


def main():
    recorder = AudioRecorder()
    transcriber = Transcriber()
    app = TranscriptionApp(recorder, transcriber)
    app.mainloop()


if __name__ == "__main__":
    main()
