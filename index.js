const { Client, GatewayIntentBits } = require("discord.js");
const { status } = require("minecraft-server-util");
const express = require("express");

// ===== KEEP REPLIT AWAKE =====
const app = express();
app.get("/", (req, res) => {
  res.status(200).send("Bot is online!");
  console.log(`Keep-alive ping received at ${new Date().toISOString()}`);
});
app.listen(5000, "0.0.0.0", () => {
  console.log("Keep-alive server listening on port 5000");
});

// ===== DISCORD BOT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_IDS = [process.env.CHANNEL_ID];
const SERVER_IP = "notogsmp.falixsrv.me";

// Add specific IDs for multiple channels if they exist in secrets/env
if (process.env.CHANNEL_ID_TESTING) {
  CHANNEL_IDS.push(process.env.CHANNEL_ID_TESTING);
}

let isOnline = false;
let onlineSince = null;
let lastPlayerCount = 0;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

async function sendToAllChannels(message) {
  for (const id of CHANNEL_IDS) {
    try {
      if (!id) continue;
      const channel = await client.channels.fetch(id.trim());
      if (channel) {
        await channel.send(message);
      }
    } catch (err) {
      console.error(`Failed to send to channel ${id}:`, err.message);
    }
  }
}

client.once("clientReady", async () => {
  console.log(`Bot is running as: ${client.user.tag}`);

  // Ping command listener
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    
    const content = message.content.toLowerCase();
    if (content.startsWith("!ping") || message.mentions.has(client.user)) {
      await message.reply("🏓 Pong! I am alive and monitoring the server.");
    }
  });

  // Send startup message
  await sendToAllChannels("🚀 **Bot has started and is now monitoring the server!**");
  console.log("Startup message sent to all channels.");

  setInterval(async () => {
    try {
      const res = await status(SERVER_IP);
      const currentPlayers = res.players.online;

      // ===== SERVER JUST CAME ONLINE =====
      if (!isOnline) {
        isOnline = true;
        onlineSince = Date.now();
        lastPlayerCount = currentPlayers;

        await sendToAllChannels(
          "🟢 **Minecraft server is now ONLINE!**\n⏱️ Uptime: starting now"
        );
        return;
      }

      // ===== PLAYER JOIN / LEAVE DETECTION =====
      if (currentPlayers > lastPlayerCount) {
        const joined = currentPlayers - lastPlayerCount;
        await sendToAllChannels(
          `👤 **${joined} player${joined > 1 ? "s" : ""} joined** (now ${currentPlayers} online)`
        );
      }

      if (currentPlayers < lastPlayerCount) {
        const left = lastPlayerCount - currentPlayers;
        await sendToAllChannels(
          `🚪 **${left} player${left > 1 ? "s" : ""} left** (now ${currentPlayers} online)`
        );
      }

      lastPlayerCount = currentPlayers;

    } catch {
      if (isOnline) {
        isOnline = false;
        const uptime = formatTime(Date.now() - onlineSince);
        onlineSince = null;
        lastPlayerCount = 0;

        await sendToAllChannels(
          `🔴 **Minecraft server is now OFFLINE**\n⏱️ Total runtime: **${uptime}**`
        );
      }
    }
  }, 30000); // check every 30 seconds
});

client.login(TOKEN);
