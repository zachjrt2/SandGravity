#!/usr/bin/env python3
"""
Gravity Wars Launcher
Starts a local HTTP server and automatically opens the game in your default web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time

PORT = 8080

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()

    Handler = NoCacheHandler
    # Suppress verbose log messages
    Handler.log_message = lambda self, format, *args: None

    # Try binding to PORT or find the next available port
    global PORT
    for p in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", p), Handler) as httpd:
                PORT = p
                print(f"==================================================")
                print(f"   🪐 GRAVITY WARS: WORMS IN ORBIT 🪐")
                print(f"==================================================")
                print(f" Serving locally at: http://localhost:{PORT}")
                print(f" Press Ctrl+C to stop the server.")
                print(f"==================================================")
                
                # Open browser slightly after server is ready
                threading.Thread(target=lambda: (time.sleep(0.5), webbrowser.open(f"http://localhost:{PORT}"))).start()
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\nServer stopped. Thanks for playing Gravity Wars!")
        sys.exit(0)
