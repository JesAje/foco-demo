"""Servidor local, sin dependencias externas, para la demo Foco."""

from __future__ import annotations

import json
import threading
import uuid
import webbrowser
from datetime import date
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data.json"
HOST = "127.0.0.1"
PORT = 8000
LOCK = threading.Lock()

INITIAL_STATE = {
    "points": 28,
    "streak": 6,
    "exercises": 28,
    "last_practice_date": "",
    "focus_minutes": 0,
    "completed_sessions": 0,
    "profile": {"career": "Ing. Civil", "semester": "3er semestre", "difficulties": ["Organizarme", "Ser constante"], "study_style": "Con ejercicios"},
    "coupon_unlocked": False,
    "blocks": [
        {"id": "demo-1", "title": "Repaso de integrales", "subject": "Cálculo I", "time": "10:30", "minutes": 25, "done": False},
        {"id": "demo-2", "title": "Resolver guía 4", "subject": "Álgebra Lineal", "time": "13:00", "minutes": 40, "done": False},
        {"id": "demo-3", "title": "Ejercicio diario", "subject": "Racha · 8 min", "time": "18:30", "minutes": 8, "done": False},
    ],
}


def read_state() -> dict:
    with LOCK:
        if not DATA_FILE.exists():
            write_state(INITIAL_STATE)
        try:
            state = json.loads(DATA_FILE.read_text(encoding="utf-8"))
            for key, value in INITIAL_STATE.items():
                state.setdefault(key, value)
            for index, block in enumerate(state.get("blocks", [])):
                block.setdefault("id", f"legacy-{index}")
                block.setdefault("done", False)
            write_state(state)
            return state
        except (OSError, json.JSONDecodeError):
            write_state(INITIAL_STATE)
            return dict(INITIAL_STATE)


def write_state(state: dict) -> None:
    DATA_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


class FocoHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        if urlparse(self.path).path == "/api/state":
            self.send_json(read_state())
            return
        if urlparse(self.path).path == "/":
            self.path = "/index.html"
        super().do_GET()

    def do_POST(self) -> None:
        route = urlparse(self.path).path
        try:
            length = min(int(self.headers.get("Content-Length", "0")), 32_000)
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_json({"error": "Solicitud inválida"}, status=400)
            return

        if route == "/api/blocks":
            self.add_block(payload)
        elif route == "/api/blocks/change":
            self.change_block(payload)
        elif route == "/api/practice":
            self.record_practice(payload)
        elif route == "/api/profile":
            self.save_profile(payload)
        elif route == "/api/focus":
            self.record_focus(payload)
        else:
            self.send_json({"error": "Ruta no encontrada"}, status=404)

    def add_block(self, payload: dict) -> None:
        title = str(payload.get("title", "")).strip()[:100]
        subject = str(payload.get("subject", "")).strip()[:80]
        time = str(payload.get("time", "")).strip()[:20]
        try:
            minutes = max(1, min(int(payload.get("minutes", 25)), 600))
        except (TypeError, ValueError):
            minutes = 25
        if not title or not subject or not time:
            self.send_json({"error": "Completa el nombre, ramo y hora."}, status=400)
            return

        with LOCK:
            state = self.read_state_unlocked()
            state["blocks"].append({"id": uuid.uuid4().hex[:10], "title": title, "subject": subject, "time": time, "minutes": minutes, "done": False})
            write_state(state)
        self.send_json(state)

    def record_practice(self, payload: dict) -> None:
        correct = bool(payload.get("correct"))
        with LOCK:
            state = self.read_state_unlocked()
            state["exercises"] = int(state.get("exercises", 0)) + 1
            if correct:
                state["points"] = int(state.get("points", 0)) + 5
                today = date.today().isoformat()
                if state.get("last_practice_date") != today:
                    state["streak"] = int(state.get("streak", 0)) + 1
                    state["last_practice_date"] = today
                state["last_practice_date"] = today
            if state["exercises"] >= 50:
                state["coupon_unlocked"] = True
            write_state(state)
        self.send_json(state)

    def change_block(self, payload: dict) -> None:
        block_id = str(payload.get("id", ""))
        action = payload.get("action")
        with LOCK:
            state = self.read_state_unlocked()
            blocks = state.get("blocks", [])
            target = next((block for block in blocks if block.get("id") == block_id), None)
            if not target:
                self.send_json({"error": "No encontramos ese bloque."}, status=404)
                return
            if action == "toggle":
                target["done"] = not target.get("done", False)
            elif action == "delete":
                state["blocks"] = [block for block in blocks if block.get("id") != block_id]
            else:
                self.send_json({"error": "Acción no válida."}, status=400)
                return
            write_state(state)
        self.send_json(state)

    def save_profile(self, payload: dict) -> None:
        profile = {
            "career": str(payload.get("career", "")).strip()[:80],
            "semester": str(payload.get("semester", "")).strip()[:40],
            "difficulties": [str(value)[:70] for value in payload.get("difficulties", [])[:8] if isinstance(value, str)],
            "study_style": str(payload.get("study_style", "")).strip()[:80],
        }
        with LOCK:
            state = self.read_state_unlocked()
            state["profile"] = profile
            write_state(state)
        self.send_json(state)

    def record_focus(self, payload: dict) -> None:
        try:
            minutes = max(1, min(int(payload.get("minutes", 25)), 120))
        except (TypeError, ValueError):
            minutes = 25
        with LOCK:
            state = self.read_state_unlocked()
            state["focus_minutes"] = int(state.get("focus_minutes", 0)) + minutes
            state["completed_sessions"] = int(state.get("completed_sessions", 0)) + 1
            state["points"] = int(state.get("points", 0)) + 5
            write_state(state)
        self.send_json(state)

    def read_state_unlocked(self) -> dict:
        if not DATA_FILE.exists():
            return dict(INITIAL_STATE)
        try:
            state = json.loads(DATA_FILE.read_text(encoding="utf-8"))
            for key, value in INITIAL_STATE.items():
                state.setdefault(key, value)
            for index, block in enumerate(state.get("blocks", [])):
                block.setdefault("id", f"legacy-{index}")
                block.setdefault("done", False)
            return state
        except (OSError, json.JSONDecodeError):
            return dict(INITIAL_STATE)

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args) -> None:
        print(f"[{self.log_date_time_string()}] {format % args}")


def main() -> None:
    address = f"http://{HOST}:{PORT}"
    try:
        server = ThreadingHTTPServer((HOST, PORT), FocoHandler)
    except OSError as exc:
        raise SystemExit(f"No se pudo iniciar el servidor en {address}: {exc}") from exc
    print("La demo Foco está lista en " + address)
    print("Deja esta ventana abierta mientras usas la demo. Presiona Ctrl+C para cerrarla.")
    webbrowser.open(address)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()


