import { Company, Post, Country } from '@/types';
import { companies, posts, countries } from '@/data/mockData';

const _countries = [...countries];
const _companies = [...companies];
let _posts = [...posts];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

export async function fetchCountries(): Promise<Country[]> {
  await delay(jitter());
  return _countries;
}

export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  return _companies;
}

export async function fetchPosts(): Promise<Post[]> {
  await delay(jitter());
  return _posts;
}

export async function createOrUpdatePost(p: Omit<Post, "id"> & { id?: string }): Promise<Post> {
  await delay(jitter());

  if (maybeFail()) {
    throw new Error("서버 오류: 게시물 저장에 실패했습니다.");
  }

  if (p.id) {
    const index = _posts.findIndex(post => post.id === p.id);
    if (index !== -1) {
      _posts[index] = p as Post;
      return p as Post;
    } else {
      throw new Error("게시물을 찾을 수 없습니다.");
    }
  } else {
    const created = { ...p, id: crypto.randomUUID() };
    _posts = [..._posts, created];
    return created;
  }
}