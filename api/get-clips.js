export default async function handler(req, res) {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const channelName = "DTLdabs";

    try {
        // 1. Get App Access Token
        const authRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
            method: 'POST'
        });
        const authData = await authRes.json();
        const token = authData.access_token;

        // 2. Get Broadcaster ID
        const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${channelName}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`
            }
        });
        const userData = await userRes.json();
        const broadcasterId = userData.data[0].id;

        // 3. Fetch Clips
        const clipsRes = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&first=100`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`
            }
        });
        const clipsData = await clipsRes.json();

        res.status(200).json(clipsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
