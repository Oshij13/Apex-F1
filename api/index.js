import server from "../dist/server/server.js";

export default async function handler(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const fullUrl = `${protocol}://${host}${req.url}`;

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val) {
        headers.set(key, Array.isArray(val) ? val.join(", ") : val);
      }
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const request = new Request(fullUrl, {
      method: req.method,
      headers,
      body: hasBody ? req : undefined,
      duplex: "half",
    });

    const response = await server.fetch(request);

    res.statusCode = response.status;
    response.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Vercel SSR Handler Error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
