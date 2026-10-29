import http.server
from functools import partial
from pathlib import Path
from urllib.parse import urlsplit

PORT = 8000
ROOT = Path(__file__).resolve().parent

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Legacy entry URLs should open the portfolio immediately. The static
        # home.html redirect also preserves this behavior on other web hosts.
        request = urlsplit(self.path)
        if request.path == '/home.html':
            self.send_response(302)
            self.send_header('Location', '/' + ('?' + request.query if request.query else ''))
            self.send_header('Content-Length', '0')
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    handler = partial(NoCacheHTTPRequestHandler, directory=str(ROOT))
    # Threading keeps one browser's persistent connection from holding up the
    # stylesheet, images, or a second browser opened alongside it.
    with http.server.ThreadingHTTPServer(("localhost", PORT), handler) as httpd:
        print(f"Serving at http://localhost:{PORT} with cache disabled")
        httpd.serve_forever()

