import { fetchCountries, fetchCompanies, fetchPosts, createOrUpdatePost } from '@/lib/api';
import { Post } from '@/types';

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCountries', () => {
    it('should return an array of countries', async () => {
      const countries = await fetchCountries();
      expect(Array.isArray(countries)).toBe(true);
      expect(countries.length).toBeGreaterThan(0);

      if (countries.length > 0) {
        expect(countries[0]).toHaveProperty('code');
        expect(countries[0]).toHaveProperty('name');
        expect(countries[0]).toHaveProperty('flag');
      }
    });
  });

  describe('fetchCompanies', () => {
    it('should return an array of companies', async () => {
      const companies = await fetchCompanies();
      expect(Array.isArray(companies)).toBe(true);
      expect(companies.length).toBeGreaterThan(0);

      if (companies.length > 0) {
        expect(companies[0]).toHaveProperty('id');
        expect(companies[0]).toHaveProperty('name');
        expect(companies[0]).toHaveProperty('country');
        expect(companies[0]).toHaveProperty('emissions');
        expect(Array.isArray(companies[0].emissions)).toBe(true);
      }
    });
  });

  describe('fetchPosts', () => {
    it('should return an array of posts', async () => {
      const posts = await fetchPosts();
      expect(Array.isArray(posts)).toBe(true);

      if (posts.length > 0) {
        expect(posts[0]).toHaveProperty('id');
        expect(posts[0]).toHaveProperty('title');
        expect(posts[0]).toHaveProperty('resourceUid');
        expect(posts[0]).toHaveProperty('dateTime');
        expect(posts[0]).toHaveProperty('content');
      }
    });
  });

  describe('createOrUpdatePost', () => {
    it('should create a new post when id is not provided', async () => {
      const newPostData: Omit<Post, 'id'> = {
        title: 'Test Post',
        resourceUid: 'company-1',
        dateTime: '2024-01',
        content: 'Test content'
      };

      const createdPost = await createOrUpdatePost(newPostData);

      expect(createdPost).toHaveProperty('id');
      expect(createdPost.title).toBe(newPostData.title);
      expect(createdPost.resourceUid).toBe(newPostData.resourceUid);
      expect(createdPost.dateTime).toBe(newPostData.dateTime);
      expect(createdPost.content).toBe(newPostData.content);
    });
  });
});