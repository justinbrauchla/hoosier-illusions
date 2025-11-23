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
};

export const DEFAULT_VIDEO_SRC = 'https://storage.googleapis.com/hoosierillusionsvideos/WelcomeToHoosierIllusions.mp4';
export const DEFAULT_THEATER_CONFIG = {
    backgroundUrl: 'https://storage.googleapis.com/hoosierillusionsimages/front.png',
    maskUrl: 'https://storage.googleapis.com/hoosierillusionsimages/front-transparent.png'
};

export const DEFAULT_HOTSPOT_CONFIG = {
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
