export interface MappingValue {
    videoUrl?: string;
    audioUrl?: string;
    panoUrl?: string;
    imageUrl?: string;
    showInDropdown?: boolean;
    muteVideo?: boolean;
    playFullscreen?: boolean;
    title?: string;
    album?: string;
    artist?: string;
    _deleted?: boolean;
}

export type Mappings = Record<string, MappingValue>;

export interface Song {
    title: string;
    artist: string;
    album: string;
    art: string;
}

export interface NowPlayingData {
    station?: {
        logo_url?: string;
        art?: string;
    };
    now_playing: {
        song: Song;
    };
    playing_next: {
        song: Song;
    };
}

export interface ContentItem {
    title: string;
    description: string;
    imagePlaceholder: string;
    linkUrl?: string;
    scale?: number;
    posterWidth?: number; // Width percentage for the 4:5 poster container (default 100)
    offsetX?: number; // Horizontal offset percentage for poster positioning
    offsetY?: number; // Vertical offset percentage for poster positioning
}

export interface HotspotData {
    id: string;
    label: string;
    top: number;
    left: number;
    width: number;
    height: number;
    contents: ContentItem[];
    posterOverlayUrl?: string; // Static poster cutout overlay for Album Posters
}

export interface GameConfig {
    hotspotIconUrl: string;
    merchandiseHotspotIconUrl?: string;
    hotspots: HotspotData[];
    merchandiseHotspots?: HotspotData[];
}

export enum CreatureType {
    BIGFOOT = 'Bigfoot',
    UNICORN = 'Unicorn',
    MERMAID = 'Mermaid',
    YETI = 'Yeti',
}
