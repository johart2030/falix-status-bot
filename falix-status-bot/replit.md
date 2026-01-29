# Minecraft Server Status Discord Bot

## Overview

This is a Discord bot that monitors a Minecraft server's online status and reports changes to a designated Discord channel. The bot periodically checks if the Minecraft server is online and tracks uptime, sending notifications when the server status changes. It also includes a simple Express server to keep the Replit instance awake.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Components

**Discord Bot (discord.js)**
- Uses Discord.js v14 with minimal gateway intents (Guilds, GuildMessages)
- Monitors a specific channel for sending status updates
- Tracks server online/offline state and uptime duration

**Minecraft Server Monitoring**
- Uses `minecraft-server-util` library to ping and check Minecraft server status
- Target server: `notogsmp.falixsrv.me`
- Tracks when server comes online and calculates uptime

**Keep-Alive Server (Express)**
- Simple Express server on port 3000
- Single endpoint (`/`) returns "OK"
- Prevents Replit from sleeping due to inactivity

### Configuration

Environment variables required:
- `TOKEN` - Discord bot authentication token
- `CHANNEL_ID` - Discord channel ID for status notifications

Server configuration is hardcoded:
- Minecraft server IP: `notogsmp.falixsrv.me`

### Design Decisions

**Stateful Monitoring**
- Problem: Need to detect when server status changes, not just current status
- Solution: Maintains `isOnline` boolean and `onlineSince` timestamp in memory
- Trade-off: State is lost on bot restart, but simplifies implementation

**Keep-Alive Pattern**
- Problem: Replit free tier puts projects to sleep after inactivity
- Solution: Express server provides an endpoint that can be pinged by external services (like UptimeRobot)
- Note: This is a common pattern for keeping Replit bots running

## External Dependencies

### NPM Packages
- `discord.js` (v14.25.1) - Discord API wrapper for bot functionality
- `minecraft-server-util` (v5.4.4) - Minecraft server status checking
- `express` (v5.2.1) - HTTP server for keep-alive endpoint
- `@types/node` (v22.13.11) - TypeScript type definitions (unused, can be removed)

### External Services
- **Discord API** - Bot authentication and message sending
- **Minecraft Server** - Target server being monitored (Falix hosting)

### Required Secrets
The bot requires these environment variables to be set in Replit Secrets:
- `TOKEN` - Discord bot token from Discord Developer Portal
- `CHANNEL_ID` - ID of the Discord channel for notifications