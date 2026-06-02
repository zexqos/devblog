export interface Article {
  id:                     number;
  title:                  string;
  description:            string;
  body_html:              string;
  body_markdown:          string;
  cover_image:            string | null;
  tag_list:               string[];
  readable_publish_date:  string;
  reading_time_minutes:   number;
  public_reactions_count: number;
  comments_count:         number;
  url:                    string;
  user: {
    name:          string;
    username:      string;
    profile_image: string;
  };
}

export interface ArticlesParams {
  page?:     number;
  per_page?: number;
  tag?:      string;
  q?:        string;
}

export interface BookmarksContextValue {
  bookmarks:      number[];
  likedPosts:     number[];
  toggleBookmark: (id: number) => void;
  toggleLike:     (id: number) => void;
  isBookmarked:   (id: number) => boolean;
  isLiked:        (id: number) => boolean;
  clearBookmarks: () => void;
}

export type Theme       = 'light' | 'dark';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  status?: number;
}

export interface Comment {
  id:           number;
  created_at:   string;
  body_html:    string;
  user: {
    name:          string;
    username:      string;
    profile_image: string;
  };
}