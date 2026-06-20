const fs = require("fs");
const path = require("path");
const http = require("http");
const { exec } = require("child_process");
const { google } = require("googleapis");
const readline = require("readline");

const PORT = 8085;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const ENV_PATH = path.join(__dirname, "../.env");

// Helper to ask questions in terminal
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

// Helper to parse existing env variables
function readEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    return {};
  }
  const content = fs.readFileSync(ENV_PATH, "utf-8");
  const env = {};
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      let val = match[2] || "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1);
      }
      env[match[1]] = val;
    }
  });
  return env;
}

// Helper to write/update env variables
function writeEnv(updates) {
  let content = "";
  if (fs.existsSync(ENV_PATH)) {
    content = fs.readFileSync(ENV_PATH, "utf-8");
  }

  for (const [key, val] of Object.entries(updates)) {
    const regex = new RegExp(`^\\s*${key}\\s*=.*$`, "m");
    const escapedVal = val.includes("\n") || val.includes(" ") ? `"${val.replace(/"/g, '\\"')}"` : val;
    const newEntry = `${key}=${escapedVal}`;
    if (regex.test(content)) {
      content = content.replace(regex, newEntry);
    } else {
      content += `\n${newEntry}\n`;
    }
  }

  // Clean double newlines
  content = content.replace(/\n{3,}/g, "\n\n");
  fs.writeFileSync(ENV_PATH, content, "utf-8");
  console.log("Successfully updated .env file!");
}

async function run() {
  console.log("=========================================");
  console.log("   Google Drive OAuth2 Setup Assistant   ");
  console.log("=========================================\n");

  const env = readEnv();
  let clientId = env.GOOGLE_CLIENT_ID;
  let clientSecret = env.GOOGLE_CLIENT_SECRET;

  if (clientId) {
    console.log(`Found GOOGLE_CLIENT_ID in .env: ${clientId.substring(0, 15)}...`);
    const keep = await askQuestion("Do you want to reuse this Client ID? (y/n): ");
    if (keep.toLowerCase() !== "y") {
      clientId = null;
    }
  }

  if (!clientId) {
    clientId = await askQuestion("Enter your Google OAuth2 Client ID: ");
  }

  if (clientSecret) {
    console.log(`Found GOOGLE_CLIENT_SECRET in .env: ***...`);
    const keep = await askQuestion("Do you want to reuse this Client Secret? (y/n): ");
    if (keep.toLowerCase() !== "y") {
      clientSecret = null;
    }
  }

  if (!clientSecret) {
    clientSecret = await askQuestion("Enter your Google OAuth2 Client Secret: ");
  }

  if (!clientId || !clientSecret) {
    console.error("Error: Both Client ID and Client Secret are required.");
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

  // Generate auth url with offline access to get a refresh token
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive"],
    prompt: "consent",
  });

  // Start HTTP server to receive redirect callback
  const server = http.createServer(async (req, res) => {
    if (req.url.startsWith("/oauth2callback")) {
      const urlParams = new URL(req.url, `http://localhost:${PORT}`);
      const code = urlParams.searchParams.get("code");

      if (code) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #0f172a; color: #f8fafc;">
              <h1 style="color: #10b981;">Authentication Successful!</h1>
              <p>You can close this tab now and return to the console.</p>
            </body>
          </html>
        `);

        console.log("\nReceived authorization code. Exchanging for tokens...");
        try {
          const { tokens } = await oauth2Client.getToken(code);
          const refreshToken = tokens.refresh_token;

          if (!refreshToken) {
            console.error(
              "\nError: No refresh token was returned. Make sure to delete the app access in your Google Account security page (https://myaccount.google.com/permissions) and try again to force consent!"
            );
            server.close();
            process.exit(1);
          }

          writeEnv({
            GOOGLE_CLIENT_ID: clientId,
            GOOGLE_CLIENT_SECRET: clientSecret,
            GOOGLE_REFRESH_TOKEN: refreshToken,
          });

          console.log("\nOAuth2 setup completed successfully!");
          console.log(`Refresh Token saved: ${refreshToken.substring(0, 10)}...`);
          server.close();
          process.exit(0);
        } catch (err) {
          console.error("\nError exchanging authorization code for tokens:", err.message);
          server.close();
          process.exit(1);
        }
      } else {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>Authentication failed: No authorization code received.</h1>");
        server.close();
        process.exit(1);
      }
    }
  });

  server.listen(PORT, () => {
    console.log(`\nTemporary local server started on port ${PORT}.`);
    console.log("Please visit this authorization URL in your browser:\n");
    console.log(authUrl);
    console.log("\nAttempting to open the URL automatically...");

    // Try to open browser automatically
    let command;
    if (process.platform === "win32") {
      command = `start "" "${authUrl}"`;
    } else if (process.platform === "darwin") {
      command = `open "${authUrl}"`;
    } else {
      command = `xdg-open "${authUrl}"`;
    }

    exec(command, (err) => {
      if (err) {
        console.log("Could not open browser automatically. Please copy and paste the URL above manually.");
      }
    });
  });
}

run().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
