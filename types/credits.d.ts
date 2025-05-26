// honestly don't know if this is a good way to write definition files but it seems to work.

// yaml interfaces made with the help of yaml-to-ts.deno.dev!
interface Credits {
  title: string;
  // people that appeared in the video
  featured?: Person[];
  // people that helped produce the video
  contributed?: Person[];
  // any and all music used in the video, including timestamps
  music: Song[];
  // any assets used throughout the video
  assets?: Asset[];
  // random notes you want to add post edit
  notes?: Note[];
}
interface Song {
  title: string;
  artist: string[];
  links?: Link[];
  timestamp: string;
}
interface Asset {
  title: string;
  desc: string;
  creators?: Person[];
  source?: Source;
}
interface Source {
  note?: Note;
  url?: string;
}
interface Person {
  name: string;
  note?: Note;
  links?: Link[];
}
interface Note {
  note: string;
}
interface Link {
  platform: string;
  url: string;
}
