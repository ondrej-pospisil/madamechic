import http.server
import os
os.chdir('/Users/ondrejpospisil/Desktop/test-claude/madame-chic')
handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('', 3456), handler)
print(f"Serving on port 3456")
httpd.serve_forever()
