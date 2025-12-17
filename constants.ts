import { Mappings } from './types';

export const defaultMappings: Mappings = {
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

export const DEFAULT_VIDEO_SRC = 'https://storage.googleapis.com/hoosierillusionsvideos/WelcomeToHoosierIllusions.mp4';
export const DEFAULT_THEATER_CONFIG = {
    backgroundUrl: 'https://storage.googleapis.com/hoosierillusionsimages/front.png',
    maskUrl: 'https://storage.googleapis.com/hoosierillusionsimages/front-transparent.png'
};

export const DEFAULT_HOTSPOT_CONFIG = {
    hotspotIconUrl: "https://storage.googleapis.com/hoosierillusionsimages/OwlWhiteTransparent.png",
    merchandiseHotspotIconUrl: "https://storage.googleapis.com/hoosierillusionsimages/OwlBlackTransparent.png",
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
    ],
    merchandiseHotspots: []
};
