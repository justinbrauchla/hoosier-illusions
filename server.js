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
const LANDING_CONFIG_FILE = 'landing-config.json';
const LOBBY_CONFIG_FILE = 'lobby-config.json';
const FAUNA_CONFIG_FILE = 'fauna-config.json';
const DEADSPEAK_CONFIG_FILE = 'deadspeak-config.json';
const PARLOR_CONFIG_FILE = 'parlor-config.json';
const SPECIAL_EXHIBITS_HALL_CONFIG_FILE = 'special-exhibits-hall-config.json';
const ILLUSIONIST_MENU_CONFIG_FILE = 'illusionist-menu-config.json';
const MEMBERS_FILE = 'members.json';
const PLAYER_APP_CONFIG_FILE = 'player-app-config.json';

app.use(express.json({ limit: '50mb' }));

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent';

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
  'cole porter': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Cole%20Porter.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'dan toler': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Dan%20Toler.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'dreamers road': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Dreamers%20Road.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'hoagy carmichael': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Hoagy%20Carmichael.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'hollywood\'s roar': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Hollywood%27s%20Roar.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'in the haze of the night': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/In%20The%20Haze%20Of%20The%20Night.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'james dean': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/James%20Dean.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'kurt vonnegut jr.': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Kurt%20Vonnegut%20Jr..mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'midnight check-in': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Midnight%20Check-In.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'southern road blues': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Southern%20Road%20Blues.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'tralfamadore blues': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Tralfamadore%20Blues.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'wes montgomery': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Wes%20Montgomery.mp3',
    showInDropdown: true,
    muteVideo: true,
  },
  'zoo promo': {
    audioUrl: 'https://storage.googleapis.com/hoosierillusionsaudio/Zoo%20Promo.mp3',
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

    // Fetch On-Demand tracks and merge them
    try {
      const onDemandResponse = await fetch('https://stream.hoosierillusions.com/api/station/hoosier-illusions/ondemand');
      if (onDemandResponse.ok) {
        const onDemandData = await onDemandResponse.json();
        onDemandData.forEach(track => {
          if (track.media && track.media.title) {
            const key = track.media.title.trim().toLowerCase();
            const audioUrl = `/api/proxy-audio?url=https://stream.hoosierillusions.com${track.download_url}`;

            if (finalMappings[key]) {
              // Update existing mapping's URL if needed, but preserve user settings
              // Only update if it's a placeholder or different
              if (!finalMappings[key].audioUrl || finalMappings[key].audioUrl.includes('/ondemand/download/')) {
                finalMappings[key].audioUrl = audioUrl;
              }
              // Backfill metadata if missing
              if (!finalMappings[key].imageUrl && track.media.art) {
                finalMappings[key].imageUrl = track.media.art;
              }
              if (!finalMappings[key].title && track.media.title) {
                finalMappings[key].title = track.media.title;
              }
            } else {
              // Add new mapping for on-demand track
              finalMappings[key] = {
                audioUrl: audioUrl,
                showInDropdown: true, // Default to true (searchable)
                muteVideo: true,
                title: track.media.title,
                album: track.media.album,
                artist: track.media.artist,
                imageUrl: track.media.art || ''
              };
            }
          }
        });
      }
    } catch (fetchError) {
      console.error('Failed to fetch On-Demand list in /api/config:', fetchError);
      // Continue with existing mappings if fetch fails
    }

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
            const audioUrl = `/api/proxy-audio?url=https://stream.hoosierillusions.com${track.download_url}`;

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

    // Calculate effective mappings to save
    // If a default mapping is missing from req.body, explicitly mark it as deleted
    const mappingsToSave = { ...req.body };

    Object.keys(defaultMappings).forEach(key => {
      if (!mappingsToSave[key]) {
        mappingsToSave[key] = { _deleted: true };
      }
    });

    // FORCE REMOVE 'vr' if it somehow persists
    if (mappingsToSave['vr']) {
      delete mappingsToSave['vr'];
    }

    await file.save(JSON.stringify(mappingsToSave, null, 2), {
      contentType: 'application/json',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving mappings:', error);
    res.status(500).json({ error: 'Failed to save mappings' });
  }
});

// Endpoint to save a single mapping (with validation)
app.post('/api/save-mapping', async (req, res) => {
  const { trigger, videoUrl, audioUrl, panoUrl, imageUrl, showInDropdown, muteVideo, playFullscreen } = req.body;

  if (!trigger) {
    return res.status(400).json({ error: 'Trigger word is required' });
  }

  // Validate GCS URLs (only if provided)
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
      imageUrl: imageUrl?.trim(),
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
            posterOverlayUrl: 'https://storage.googleapis.com/hoosierillusionsimages/Generated%20Image%20November%2021%2C%202025%20-%206_15AM.png',
            contents: [
              {
                title: 'Hoosier Holidays',
                description: 'A festive collection of holiday classics and seasonal favorites from Hoosier Illusions Studio.',
                imagePlaceholder: 'https://storage.googleapis.com/hoosierillusionsimages/Generated%20Image%20November%2021%2C%202025%20-%206_18AM.png',
                linkUrl: "",
                scale: 0.5,
                posterWidth: 100
              },
              {
                title: 'Deadspeak',
                description: 'Mysterious transmissions from beyond the veil. A haunting audio experience.',
                imagePlaceholder: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png',
                linkUrl: "",
                scale: 0.5,
                posterWidth: 100
              },
              {
                title: 'The Illusionists Gambit',
                description: 'A theatrical journey through magic, mystery, and musical mastery.',
                imagePlaceholder: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png',
                linkUrl: "",
                scale: 0.5,
                posterWidth: 100
              },
              {
                title: 'Fauna the Musical',
                description: 'An enchanting musical journey through the natural world.',
                imagePlaceholder: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png',
                linkUrl: "",
                scale: 0.5,
                posterWidth: 100
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

// Landing Config Endpoints
app.get('/api/landing-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(LANDING_CONFIG_FILE);
    const [exists] = await file.exists();
    if (!exists) return res.json({ hotspotIconUrl: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png', hotspots: [] });
    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading landing config:', error);
    res.status(500).json({ error: 'Failed to read landing config' });
  }
});

app.post('/api/landing-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(LANDING_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving landing config:', error);
    res.status(500).json({ error: 'Failed to save landing config' });
  }
});

// Player App Config Endpoints
const PLAYER_APP_DEFAULT_CONFIG = {
  defaultStageImg: 'https://storage.googleapis.com/hoosierillusionsimages/roomlogo.png',
  stream1: 'https://stream.hoosierillusions.com/listen/hoosier-illusions/radio.mp3',
  video1: 'https://storage.googleapis.com/hoosierillusionsvideos/roomlogo.mp4',
  loop1: 'https://storage.googleapis.com/hoosierillusionsvideos/roomlogo.mp4',
  isMuted1: true,
  stream2: 'https://storage.googleapis.com/hoosierillusionsaudio/DanToler.mp3',
  video2: 'https://storage.googleapis.com/hoosierillusionsvideos/UnicornLoop.mp4',
  loop2: 'https://storage.googleapis.com/hoosierillusionsvideos/UnicornLoop.mp4',
  isMuted2: true,
  stream3: 'https://storage.googleapis.com/hoosierillusionsaudio/CallToJoin.mp3',
  video3: 'https://storage.googleapis.com/hoosierillusionsvideos/MermaidLoop.mp4',
  loop3: 'https://storage.googleapis.com/hoosierillusionsvideos/MermaidLoop.mp4',
  isMuted3: true
};

app.get('/api/player-app-config', async (req, res) => {
  try {
    // FORCING DEFAULTS TO ENSURE NEW VIDEOS LOAD
    console.log('[Server] Forcing player app defaults');
    res.json(PLAYER_APP_DEFAULT_CONFIG);
  } catch (error) {
    console.error('Error reading player app config:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/player-app-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(PLAYER_APP_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), {
      contentType: 'application/json',
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving player app config:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Lobby Config Endpoints
app.get('/api/lobby-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(LOBBY_CONFIG_FILE);
    const [exists] = await file.exists();
    if (!exists) return res.json({ hotspotIconUrl: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png', hotspots: [] });
    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading lobby config:', error);
    res.status(500).json({ error: 'Failed to read lobby config' });
  }
});

app.post('/api/lobby-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(LOBBY_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving lobby config:', error);
    res.status(500).json({ error: 'Failed to save lobby config' });
  }
});

// Special Exhibits Config Endpoints

// Fauna
app.get('/api/fauna-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(FAUNA_CONFIG_FILE);
    const [exists] = await file.exists();
    if (!exists) return res.json({ hotspotIconUrl: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png', hotspots: [] });
    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading fauna config:', error);
    res.status(500).json({ error: 'Failed to read fauna config' });
  }
});

app.post('/api/fauna-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(FAUNA_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving fauna config:', error);
    res.status(500).json({ error: 'Failed to save fauna config' });
  }
});

// DeadSpeak
app.get('/api/deadspeak-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(DEADSPEAK_CONFIG_FILE);
    const [exists] = await file.exists();
    if (!exists) return res.json({ hotspotIconUrl: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png', hotspots: [] });
    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading deadspeak config:', error);
    res.status(500).json({ error: 'Failed to read deadspeak config' });
  }
});

app.post('/api/deadspeak-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(DEADSPEAK_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving deadspeak config:', error);
    res.status(500).json({ error: 'Failed to save deadspeak config' });
  }
});

// The Parlor
app.get('/api/parlor-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(PARLOR_CONFIG_FILE);
    const [exists] = await file.exists();
    if (!exists) return res.json({ hotspotIconUrl: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png', hotspots: [] });
    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading parlor config:', error);
    res.status(500).json({ error: 'Failed to read parlor config' });
  }
});

app.post('/api/parlor-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(PARLOR_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving parlor config:', error);
    res.status(500).json({ error: 'Failed to save parlor config' });
  }
});

// Special Exhibits Hall
app.get('/api/special-exhibits-hall-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(SPECIAL_EXHIBITS_HALL_CONFIG_FILE);
    const [exists] = await file.exists();
    if (!exists) return res.json({ hotspotIconUrl: 'https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png', hotspots: [] });
    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading special exhibits hall config:', error);
    res.status(500).json({ error: 'Failed to read special exhibits hall config' });
  }
});

app.post('/api/special-exhibits-hall-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(SPECIAL_EXHIBITS_HALL_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving special exhibits hall config:', error);
    res.status(500).json({ error: 'Failed to save special exhibits hall config' });
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

// Chat endpoint - handles AI chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Fetch the system context from GCS
    const bucket = storage.bucket(BUCKET_NAME);
    const contextFile = bucket.file(ORACLE_CONTEXT_FILE);
    const [exists] = await contextFile.exists();

    let systemInstruction = "You are the Oracle of Hoosier Illusions. You are mysterious, slightly cryptic, but helpful. You speak in riddles sometimes.";
    if (exists) {
      const [contents] = await contextFile.download();
      systemInstruction = contents.toString();
    }

    // Prepare the payload for Gemini REST API
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `System Instruction: ${systemInstruction}\n\nUser Message: ${message}` }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.7
      }
    };

    if (!GEMINI_API_KEY) {
      console.warn("Missing GEMINI_API_KEY environment variable");
      return res.status(503).json({ reply: "The Oracle is disconnected. (Missing GEMINI_API_KEY in server environment)" });
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API Failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "...";

  } catch (error) {
    res.status(500).json({ error: `Oracle Error: ${error.message}` });
  }
});

// Oracle Configuration Endpoints
const ORACLE_CONFIG_FILE = 'oracle-config.json';

app.get('/api/oracle-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(ORACLE_CONFIG_FILE);
    const [exists] = await file.exists();

    if (!exists) {
      // Default Configuration
      const defaultConfig = {
        greeting: "Greeting, seeker. The Oracle is listening. Select a path.",
        mainMenu: [
          { id: 'login', label: 'Access My Account', type: 'action', action: 'login' },
          { id: 'store', label: 'Make an Offering (Store)', type: 'link', value: 'https://hoosierillusions.com/store' },
          { id: 'faq', label: 'Seek Wisdom (FAQs)', type: 'submenu', value: 'faq' }
        ],
        faqs: [
          { question: "What is this place?", answer: "This is the digital echo of the Hoosier Illusions Theater." },
          { question: "How do I watch?", answer: "The eye sees all when the time is right." }
        ]
      };
      return res.json(defaultConfig);
    }

    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error fetching oracle config:', error);
    res.status(500).json({ error: 'Failed to fetch oracle config' });
  }
});

app.post('/api/oracle-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(ORACLE_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2));
    console.log('Oracle config saved.');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving oracle config:', error);
    res.status(500).json({ error: 'Failed to save oracle config' });
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

// Get track metadata from audio URL
app.get('/api/track-metadata', async (req, res) => {
  const audioUrl = req.query.url;
  if (!audioUrl) return res.status(400).json({ error: 'Missing url parameter' });

  // TODO: Implement proper AzuraCast file/media API lookup
  // For now, return null and rely on custom imageUrl in admin panel
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ albumArt: null });
});



// Proxy for Album Art to avoid CORS issues
app.get('/api/album-art', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send('Missing url');

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error) {
    console.error('Album art proxy error:', error);
    res.redirect('https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png');
  }
});

// Proxy for Audio to handle Content-Disposition and Range requests
app.get('/api/proxy-audio', async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl) return res.status(400).send('Missing url');

  const audioUrl = decodeURIComponent(rawUrl);
  console.log(`[Proxy] Requesting: ${audioUrl}`);
  if (req.headers.range) {
    console.log(`[Proxy] Range request: ${req.headers.range}`);
  }

  try {
    const headers = {};
    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    // Use a custom agent if needed, but default fetch should work
    const response = await fetch(audioUrl, { headers });

    if (!response.ok && response.status !== 206) {
      console.error(`[Proxy] Upstream error ${response.status} for ${audioUrl}`);
      throw new Error(`Failed to fetch audio: ${response.status}`);
    }

    // Forward Content-Type
    const contentType = response.headers.get('content-type');
    if (contentType) res.set('Content-Type', contentType);

    // Ensure Content-Disposition is inline
    res.set('Content-Disposition', 'inline');

    // Forward Content-Range if available
    const contentRange = response.headers.get('content-range');
    if (contentRange) {
      res.set('Content-Range', contentRange);
    }

    // DO NOT forward Content-Length when piping, as it can cause mismatches if the stream is transformed
    // or if the upstream length differs from what node-fetch delivers.
    // Let Express/Node handle the transfer encoding.

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Accept-Ranges', 'bytes');

    // Set status code (200 or 206)
    res.status(response.status);

    // Stream the response
    const { Readable } = await import('stream');
    // @ts-ignore
    const nodeStream = Readable.fromWeb(response.body);

    nodeStream.on('error', (err) => {
      console.error('[Proxy] Stream error:', err);
      if (!res.headersSent) res.status(500).end();
      else res.end();
    });

    nodeStream.pipe(res);

  } catch (error) {
    console.error('[Proxy] Error:', error);
    if (!res.headersSent) {
      res.status(500).send('Failed to proxy audio');
    }
  }
});

// Illusionist Menu Config
app.get('/api/illusionist-menu-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(ILLUSIONIST_MENU_CONFIG_FILE);
    const [exists] = await file.exists();
    if (!exists) {
      // Default config
      return res.json({
        greeting: "Welcome to the Illusionist's Lounge. Please select an option.",
        mainMenu: [
          { id: '1', label: 'Login', type: 'action', action: 'login' },
          { id: '2', label: 'Back', type: 'back' }
        ],
        faqs: []
      });
    }
    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading illusionist menu config:', error);
    res.status(500).json({ error: 'Failed to read illusionist menu config' });
  }
});

app.post('/api/illusionist-menu-config', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(ILLUSIONIST_MENU_CONFIG_FILE);
    await file.save(JSON.stringify(req.body, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving illusionist menu config:', error);
    res.status(500).json({ error: 'Failed to save illusionist menu config' });
  }
});

// MEMBERSHIP ENDPOINTS

// Get All Members (Admin)
app.get('/api/members', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(MEMBERS_FILE);
    const [exists] = await file.exists();
    if (!exists) return res.json([]);

    const [contents] = await file.download();
    res.json(JSON.parse(contents.toString()));
  } catch (error) {
    console.error('Error reading members:', error);
    res.status(500).json({ error: 'Failed to read members' });
  }
});

// Update Members List (Admin)
app.post('/api/members', async (req, res) => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(MEMBERS_FILE);
    await file.save(JSON.stringify(req.body, null, 2), { contentType: 'application/json' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving members:', error);
    res.status(500).json({ error: 'Failed to save members' });
  }
});

// Member Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password, email, tier } = req.body;

    // Basic validation
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(MEMBERS_FILE);
    const [exists] = await file.exists();

    let members = [];
    if (exists) {
      const [contents] = await file.download();
      members = JSON.parse(contents.toString());
    }

    // Check if user exists
    if (members.find(m => m.username === username || m.email === email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Default tier is Theater if not specified
    const newMember = {
      id: Date.now().toString(),
      username,
      password, // In production, hash this!
      email,
      tier: tier || 'Theater',
      joinedAt: new Date().toISOString()
    };

    members.push(newMember);

    await file.save(JSON.stringify(members, null, 2), { contentType: 'application/json' });

    res.json({ success: true, member: { username, email, tier: newMember.tier } });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal signup error' });
  }
});

// Admin: Upload Bounty Guide
app.post('/api/admin/upload-guide', async (req, res) => {
  try {
    const { imageData, filename } = req.body;
    if (!imageData || !filename) {
      return res.status(400).json({ error: 'Missing image data or filename' });
    }

    // Strip header if present (data:image/png;base64,...)
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const bucket = storage.bucket('hoosierillusionsimages'); // Use the images bucket
    const file = bucket.file(`bounty_guides/${filename}`);

    await file.save(buffer, {
      contentType: 'image/png',
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    await file.makePublic();

    // Return a proxy URL to avoid public bucket issues
    const publicUrl = `https://hoosierillusions.com/api/guide/${filename}`;

    res.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Upload guide error:', error);
    res.status(500).json({ error: 'Failed to upload guide' });
  }
});

// Admin: Proxy Bounty Guide (Serves images without needing public bucket)
app.get('/api/guide/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Basic validation to prevent directory traversal
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).send('Invalid filename');
    }

    const bucket = storage.bucket('hoosierillusionsimages');
    const file = bucket.file(`bounty_guides/${filename}`);
    const [exists] = await file.exists();

    if (!exists) {
      return res.status(404).send('Guide not found');
    }

    // Set correct headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    file.createReadStream().pipe(res);

  } catch (error) {
    console.error('Proxy guide error:', error);
    res.status(500).send('Error serving guide');
  }
});

// Member Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(MEMBERS_FILE);
    const [exists] = await file.exists();

    if (!exists) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const [contents] = await file.download();
    const members = JSON.parse(contents.toString());

    // Find member
    const member = members.find(m => m.username === username);

    if (member && member.password === password) {
      return res.json({
        success: true,
        member: {
          username: member.username,
          email: member.email,
          tier: member.tier
        }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal login error' });
  }
});

// Serve static files from dist (this includes player.html and admin.html)
app.use(express.static(path.join(__dirname, 'dist')));

// Explicit route for Admin Dashboard
app.get('/eventsadmin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'eventsadmin.html'));
});

// Catch-all: serve index.html for any other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server immediately, initialize mappings in background
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  initMappings().catch(err => console.error('Background init failed:', err));
});
