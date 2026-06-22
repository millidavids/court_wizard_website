#!/usr/bin/env python3
"""Build the site, then serve the rendered _site/ for local preview.

The shipped HTML is produced at build time: scripts/render.mjs injects the
changelog and the markdown bodies (credits, privacy, health) into the pages.
Serving the raw repo root would show those as empty placeholders, so this
script runs the build first and serves _site/ — exactly what gets deployed.

Re-run after editing index.html or anything under content/ to rebuild.

We serve via an explicit directory= (not os.chdir) so that re-running the
build — which does `rm -rf _site` — can't yank the server's working directory
out from under it (that crashes every request with os.getcwd FileNotFoundError).

The handler also emulates Cloudflare Pages' default single-page-application
fallback: any GET that doesn't resolve to a real file serves index.html, so
deep paths like /about/privacy and /features/endless work locally exactly as
they do in production. Real assets (/css, /js, /images) are served normally.
"""

import functools
import http.server
import os
import subprocess
import sys

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(ROOT, "_site")


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        # SPA fallback: only rewrite to /index.html when the path resolves to
        # neither a real file nor a real directory (i.e. it's a client route
        # like /about/privacy). Real files are served as-is; real directories
        # are left to the parent handler (301 → trailing slash). This mirrors
        # Cloudflare Pages, which serves existing assets before the fallback.
        path = self.translate_path(self.path)
        if not os.path.isfile(path) and not os.path.isdir(path):
            self.path = "/index.html"
        return super().send_head()


build = subprocess.run(["./scripts/build_site.sh"], cwd=ROOT)
if build.returncode != 0:
    sys.exit(
        "\nbuild failed (see error above). "
        "If it's a missing-module error, run `npm install` first."
    )

Handler = functools.partial(SPAHandler, directory=SITE)
print(f"Serving built site at http://localhost:{PORT}  (dir: {SITE})")
http.server.HTTPServer(("", PORT), Handler).serve_forever()
