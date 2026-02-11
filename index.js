// Corrected player join/leave messages

const playerJoinMessage = "Player has joined the game!";
const playerLeaveMessage = "Player has left the game!";

function onPlayerJoin(player) {
    console.log(playerJoinMessage.replace("Player", player.name));
}

function onPlayerLeave(player) {
    console.log(playerLeaveMessage.replace("Player", player.name));
}

// Example usage:
// onPlayerJoin({ name: 'JohnDoe' });
// onPlayerLeave({ name: 'JohnDoe' });
