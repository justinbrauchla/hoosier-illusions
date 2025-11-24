import express from 'express';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

console.log('Starting server...');

let storage;
try {
  storage = new Storage();
  console.log('Cloud Storage initialized');
} catch (error) {
  console.error('Failed to initialize Cloud Storage:', error);
}

const BUCKET_NAME = 'hoosier-illusions-radio-config';
const MAPPINGS_FILE = 'mappings.json';
const THEATER_CONFIG_FILE = 'theater-config.json';
const VIDEO_POSITION_FILE = 'video-position.json';
const HOTSPOT_CONFIG_FILE = 'hotspot-config.json';

app.use(express.json());

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Default mappings
// Updated defaults from constants.ts
const defaultMappings = {
  'moonlight in her eyes': {
    videoUrl: 'https://storage.googleapis.com/hoosierillusionsvideos/MoonlightInHerEyes.mp4',
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Moonlight%20In%20Her%20Eyes.mp3',
    showInDropdown: false,
    muteVideo: true,
  },
  'great southern shuffle': {
    videoUrl: 'https://storage.googleapis.com/hoosierillusionsvideos/GreatSouthernShuffle.mp4',
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Great%20Southern%20Shuffle.mp3',
    showInDropdown: false,
    muteVideo: false,
  },
  'hoosier haze': {
    videoUrl: 'https://storage.googleapis.com/hoosierillusionsvideos/Cocoon.mp4',
    audioUrl: 'https://stream.hoosierillusions.com/listen/hoosier-illusions/radio.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'hoosier illusions': {
    videoUrl: 'https://storage.googleapis.com/hoosierillusionsvideos/Neon%20Hijack.mp4',
    audioUrl: 'https://stream.hoosierillusions.com/listen/hoosier-illusions/radio.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'deadspeak': {
    videoUrl: 'https://storage.googleapis.com/hoosierillusionsvideos/Radio%20Illusions%20%231.mp4',
    audioUrl: 'https://stream.hoosierillusions.com/listen/hoosier-illusions/radio.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'hoosier holidays': {
    audioUrl: 'https://stream.hoosierillusions.com/listen/hoosier-illusions/radio.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'vr': {
    panoUrl: 'https://pannellum.org/images/alma.jpg',
    showInDropdown: true,
    muteVideo: true,
  },
  'candy cane lane': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Candy%20Cane%20Lane.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'christmas lights and jingle bells': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Christmas%20Lights%20And%20Jingle%20Bells.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'cocoa kisses': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Cocoa%20Kisses.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'the last christmas tree': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/The%20Last%20Christmas%20Tree.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
};

// Unified Config Endpoint
app.get('/api/config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(MAPPINGS_FILE);
    const [exists] = await file.exists();

    let cloudMappings = {};
    if (exists) {
      const [contents] = await file.download();
      cloudMappings = JSON.parse(contents.toString());
    }

    // Deep merge: Defaults < Cloud
    const mergedMappings = { ...defaultMappings, ...cloudMappings };

    // Filter out mappings marked as deleted
    const finalMappings = Object.fromEntries(
      Object.entries(mergedMappings).filter(([_, value]) => !value._deleted)
    );

    res.set('Cache-Control', 'public, max-age=10'); // Cache for 10s
    res.json(finalMappings);
  } catch (error) {
    console.error('Error fetching config:', error);
    // Fallback to defaults
    res.json(defaultMappings);
  }
});

async function initMappings() {
  // No-op: We now use on-the-fly merging in /api/config
  console.log('Mappings initialization skipped (using unified config)');
}

// FIXED: Changed from /api/mappings to /api/custom-media
app.get('/api/custom-media', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(MAPPINGS_FILE);
    const [contents] = await file.download();
    let mappings = JSON.parse(contents.toString());

    try {
      const onDemandResponse = await fetch('https://stream.hoosierillusions.com/api/station/hoosier-illusions/ondemand');
      if (onDemandResponse.ok) {
        const onDemandData = await onDemandResponse.json();
        onDemandData.forEach(track => {
          if (track.media && track.media.title) {
            const key = track.media.title.trim().toLowerCase();
            const audioUrl = `https://stream.hoosierillusions.com${track.download_url}`;

            if (mappings[key]) {
              // Update existing mapping's URL, preserve other settings
              mappings[key].audioUrl = audioUrl;
            } else {
              // Add new mapping
              mappings[key] = {
                audioUrl: audioUrl,
                showInDropdown: true,
                muteVideo: true
              };
            }
          }
        });
      }
    } catch (fetchError) {
      console.error('Failed to fetch On-Demand list:', fetchError);
      // Continue with stored mappings if fetch fails
    }

    res.json(mappings);
  } catch (error) {
    console.error('Error reading mappings:', error);
    res.status(500).json({ error: 'Failed to read mappings' });
  }
});

app.post('/api/custom-media', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(MAPPINGS_FILE);
    await file.save(JSON.stringify(req.body, null, 2), {
      contentType: 'application/json',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving mappings:', error);
    res.status(500).json({ error: 'Failed to save mappings' });
  }
});

// Endpoint to validate and save a single mapping
app.post('/api/save-mapping', async (req, res) => {
  const { trigger, videoUrl, audioUrl, panoUrl, showInDropdown, muteVideo, playFullscreen } = req.body;

  // Validate URLs
  try {
    const validations = [];
    // Only validate if URL is provided and looks like a storage URL (skip streams/panos if needed, but user said "Take generated videoUrl and audioUrl")
    if (videoUrl && videoUrl.trim()) {
      validations.push(fetch(videoUrl, { method: 'HEAD' }).then(r => ({ url: videoUrl, ok: r.ok })));
    }
    if (audioUrl && audioUrl.trim() && !audioUrl.includes('stream.hoosierillusions.com')) {
      validations.push(fetch(audioUrl, { method: 'HEAD' }).then(r => ({ url: audioUrl, ok: r.ok })));
    }

    if (validations.length > 0) {
      const results = await Promise.all(validations);
      const failed = results.find(r => !r.ok);

      if (failed) {
        console.log(`Validation failed for ${failed.url}`);
        return res.status(400).json({ success: false, error: `File not found: ${failed.url.split('/').pop()} – upload TitleCase.mp4 and .mp3 first` });
      }
    }
  } catch (e) {
    console.error("Validation error:", e);
    return res.status(400).json({ success: false, error: "Validation failed: " + e.message });
  }

  // Save to GCS
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(MAPPINGS_FILE);

    // Read existing
    const [exists] = await file.exists();
    let mappings = {};
    if (exists) {
      const [contents] = await file.download();
      mappings = JSON.parse(contents.toString());
    }

    // Update
    mappings[trigger.trim().toLowerCase()] = {
      videoUrl: videoUrl?.trim(),
      audioUrl: audioUrl?.trim(),
      panoUrl: panoUrl?.trim(),
      showInDropdown,
      muteVideo,
      playFullscreen
    };

    // Write back
    await file.save(JSON.stringify(mappings, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving mapping:', error);
    res.status(500).json({ error: 'Failed to save mapping' });
  }
});

// Theater config endpoints
app.get('/api/theater-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(THEATER_CONFIG_FILE);
    const [exists] = await file.exists();

    if (!exists) {
      const defaultConfig = {
        backgroundUrl: 'https://storage.googleapis.com/hoosierillusionsimages/front.png',
        maskUrl: 'https://storage.googleapis.com/hoosierillusionsimages/front-transparent.png'
      };
      return res.json(defaultConfig);
    }

    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading theater config:', error);
    res.status(500).json({ error: 'Failed to read theater config' });
  }
});

app.post('/api/theater-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(THEATER_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), {
      contentType: 'application/json',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving theater config:', error);
    res.status(500).json({ error: 'Failed to save theater config' });
  }
});

// Video position endpoints
app.get('/api/video-position', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(VIDEO_POSITION_FILE);
    const [exists] = await file.exists();

    if (!exists) {
      const defaultPosition = {
        top: '35%',
        left: '27%',
        width: '40%',
        height: '25%'
      };
      return res.json(defaultPosition);
    }

    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading video position:', error);
    res.status(500).json({ error: 'Failed to read video position' });
  }
});

app.post('/api/video-position', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(VIDEO_POSITION_FILE);
    await file.save(JSON.stringify(req.body, null, 2), {
      contentType: 'application/json',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving video position:', error);
    res.status(500).json({ error: 'Failed to save video position' });
  }
});

// Hotspot config endpoints
app.get('/api/hotspot-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(HOTSPOT_CONFIG_FILE);
    const [exists] = await file.exists();

    if (!exists) {
      const defaultConfig = {
        hotspotIconUrl: "https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png",
        hotspots: [
          {
            id: 'posters-left',
            label: 'Album Posters',
            top: 15,
            left: 5,
            width: 10,
            height: 15,
            contents: [
              {
                title: 'The Hall of Legends',
                description: 'Ancient posters depicting the great illusionists of the 19th century. Some say their eyes follow you as you move across the room.',
                imagePlaceholder: 'https://storage.googleapis.com/hoosierillusionsimages/Generated%20Image%20November%2021%2C%202025%20-%206_18AM.png',
                linkUrl: ""
              },
              {
                title: 'The Vanishing Elephant',
                description: 'A faded lithograph advertising the impossible feat performed in 1918. The elephant looks surprisingly happy.',
                imagePlaceholder: 'Elephant Trick',
                linkUrl: ""
              },
              {
                title: 'Midnight Matinee',
                description: 'A poster for a show that supposedly happens only on leap years. The date is always blurred.',
                imagePlaceholder: 'Midnight Show',
                linkUrl: ""
              }
            ]
          },
          {
            id: 'bookshelf-left',
            label: 'Arcane Library',
            top: 45,
            left: 2,
            width: 12,
            height: 30,
            contents: [
              {
                title: 'Forbidden Grimoires',
                description: 'A collection of spellbooks and tomery that predate the theatre itself. The books are bound in leather that feels suspiciously warm to the touch.',
                imagePlaceholder: 'Mystic Bookshelf',
                linkUrl: ""
              },
              {
                title: 'The Diary of The Founder',
                description: 'Handwritten notes detailing the construction of the theatre. Several pages are stuck together with what looks like ectoplasm.',
                imagePlaceholder: 'Old Diary',
                linkUrl: ""
              }
            ]
          },
          {
            id: 'doors-right',
            label: 'Stage Door',
            top: 42,
            left: 76,
            width: 10,
            height: 22,
            contents: [
              {
                title: 'The Portal',
                description: 'These double doors lead backstage to the dressing rooms of the mythical. Dare you enter and challenge the spirits?',
                imagePlaceholder: 'Ornate Double Doors',
                linkUrl: ""
              },
              {
                title: 'The Green Room',
                description: 'A lounge area where spirits relax between hauntings. The coffee is always fresh, but the cups float away if you are not careful.',
                imagePlaceholder: 'Floating Teacup',
                linkUrl: ""
              },
              {
                title: 'The Prop Loft',
                description: 'Shelves filled with wands that misfire, hats with bottomless pits, and decks of cards that shuffle themselves.',
                imagePlaceholder: 'Magical Clutter',
                linkUrl: ""
              }
            ]
          }
        ]
      };
      return res.json(defaultConfig);
    }

    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading hotspot config:', error);
    res.status(500).json({ error: 'Failed to read hotspot config' });
  }
});

app.post('/api/hotspot-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(HOTSPOT_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), {
      contentType: 'application/json',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving hotspot config:', error);
    res.status(500).json({ error: 'Failed to save hotspot config' });
  }
});


// Force update Album Posters hotspot
app.post('/api/force-update-album-posters', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(HOTSPOT_CONFIG_FILE);

    // Get current config
    const [exists] = await file.exists();
    let config;

    if (exists) {
      const [contents] = await file.download();
      config = JSON.parse(contents.toString());
    } else {
      // Use default if doesn't exist
      const defaultResponse = await fetch(`http://localhost:${PORT}/api/hotspot-config`);
      config = await defaultResponse.json();
    }

    // Find and update the posters hotspot
    const postersHotspot = config.hotspots.find(h => h.id === 'posters-left');

    if (postersHotspot) {
      postersHotspot.label = 'Album Posters';
      if (postersHotspot.contents && postersHotspot.contents.length > 0) {
        postersHotspot.contents[0].imagePlaceholder = 'https://storage.googleapis.com/hoosierillusionsimages/Generated%20Image%20November%2021%2C%202025%20-%206_18AM.png';
      }
    }

    // Save updated config
    await file.save(JSON.stringify(config, null, 2), {
      contentType: 'application/json',
    });

    res.json({ success: true, message: 'Album Posters hotspot updated successfully' });
  } catch (error) {
    console.error('Error force-updating Album Posters:', error);
    res.status(500).json({ error: 'Failed to update Album Posters hotspot' });
  }
});

// Chat endpoint - handles both triggers and AI chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, mappings } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messageLower = message.trim().toLowerCase();

    // Check if message matches a trigger
    if (mappings && mappings[messageLower]) {
      return res.json({
        type: 'trigger',
        trigger: messageLower,
        mapping: mappings[messageLower]
      });
    }

    // If not a trigger, use AI to respond
    if (!GEMINI_API_KEY) {
      return res.json({
        type: 'chat',
        response: "I'm here to help! Try typing one of the available shortcuts to play media, or ask me how to use this site."
      });
    }

    const systemPrompt = `You are a helpful assistant for the Hoosier Illusions website. This is an interactive media experience where users can:
- Type trigger words to play videos and audio streams
- Available triggers include: ${mappings ? Object.keys(mappings).filter(k => mappings[k].showInDropdown).join(', ') : 'hoosier illusions, hoosier haze, deadspeak'}
- The site features a virtual theater where videos play within a theater screen
- Users can access an admin panel at /admin to manage media mappings

Keep responses brief (1-2 sentences), friendly, and focused on helping users navigate the site. If they ask about triggers, mention the available ones.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help! Try typing a trigger word to play media.";

    res.json({
      type: 'chat',
      response: aiResponse
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.json({
      type: 'chat',
      response: "I'm here to help! Try typing one of the available shortcuts to play media."
    });
  }
});



// Proxy for Now Playing data to remove corsproxy.io dependency
let lastNowPlayingData = null;

app.get('/api/nowplaying', async (req, res) => {
  try {
    const response = await fetch('https://stream.hoosierillusions.com/api/nowplaying/hoosier-illusions');

    if (!response.ok) {
      throw new Error(`AzuraCast API error: ${response.status}`);
    }

    const data = await response.json();
    lastNowPlayingData = data; // Cache success

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=3, stale-while-revalidate=5');
    res.json(data);

  } catch (error) {
    console.error('Error fetching Now Playing data:', error);

    // Fallback to last known good data or offline state
    if (lastNowPlayingData) {
      res.json(lastNowPlayingData);
    } else {
      res.json({
        live: {
          is_live: false,
          streamer_name: "Offline"
        },
        now_playing: {
          song: {
            title: "Stream Offline",
            artist: ""
          }
        }
      });
    }
  }
});

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all: serve index.html for any other routes (SPA routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server immediately, initialize mappings in background
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  initMappings().catch(err => console.error('Background init failed:', err));
});
