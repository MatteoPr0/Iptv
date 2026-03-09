import { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Range",
      },
    });
  }

  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const headers = new Headers();
    headers.set("User-Agent", "VLC/3.0.16 LibVLC/3.0.16");
    
    const range = request.headers.get("range");
    if (range) {
      headers.set("Range", range);
    }

    const response = await fetch(targetUrl, { headers });

    if (!response.ok && response.status !== 206) {
      return new Response(JSON.stringify({ error: `Target responded with status ${response.status}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const responseHeaders = new Headers();
    const headersToForward = ["content-type", "content-length", "content-range", "accept-ranges"];
    headersToForward.forEach((header) => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    // Add CORS headers
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Range");

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: responseHeaders,
      });
    }

    if (contentType.includes("application/vnd.apple.mpegurl") || contentType.includes("audio/mpegurl") || targetUrl.includes(".m3u8")) {
      let m3u8Content = await response.text();
      const baseUrl = new URL(response.url || targetUrl);
      
      m3u8Content = m3u8Content.split('\n').map(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
          try {
            const segmentUrl = new URL(line, baseUrl).toString();
            return `/proxy?url=${encodeURIComponent(segmentUrl)}`;
          } catch (e) {
            return line;
          }
        }
        return line;
      }).join('\n');
      
      return new Response(m3u8Content, {
        status: response.status,
        headers: responseHeaders,
      });
    }

    // For video streams, return the body directly (Edge Functions support streaming)
    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Proxy request failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const config: Config = {
  path: "/proxy",
};
