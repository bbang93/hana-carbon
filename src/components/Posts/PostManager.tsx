'use client';

import React, { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { postsAtom, companiesAtom } from '@/store/atoms';
import { Post } from '@/types';
import { createOrUpdatePost } from '@/lib/api';

interface PostManagerProps {
  onClose?: () => void;
}

const PostManager: React.FC<PostManagerProps> = ({ onClose }) => {
  const [posts, setPosts] = useAtom(postsAtom);
  const [companies] = useAtom(companiesAtom);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    resourceUid: ''
  });

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany = !selectedCompany ||
                            companies.find(c => c.id === post.resourceUid)?.name.includes(selectedCompany);
      return matchesSearch && matchesCompany;
    });
  }, [posts, searchTerm, selectedCompany, companies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      const postData = {
        id: editingPost?.id || `post-${Date.now()}`,
        title: formData.title,
        content: formData.content,
        resourceUid: formData.resourceUid || companies[0]?.id || 'default',
        dateTime: editingPost?.dateTime || new Date().toISOString()
      };

      const result = await createOrUpdatePost(postData);

      if (editingPost) {
        setPosts(posts.map(p => p.id === editingPost.id ? result : p));
      } else {
        setPosts([...posts, result]);
      }

      setFormData({ title: '', content: '', resourceUid: '' });
      setEditingPost(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Post 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      resourceUid: post.resourceUid
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '', resourceUid: '' });
    setEditingPost(null);
    setIsCreating(false);
  };

  const getCompanyName = (resourceUid: string) => {
    const company = companies.find(c => c.id === resourceUid);
    return company?.name || 'Unknown Company';
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: '700',
          color: '#0f172a'
        }}>
          📝 게시물 관리
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              style={{
                padding: '12px 24px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
            >
              ✏️ 새 게시물
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '12px',
                background: '#f1f5f9',
                color: '#64748b',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 게시물 작성/편집 폼 */}
      {isCreating && (
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151'
          }}>
            {editingPost ? '게시물 수정' : '새 게시물 작성'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="게시물 제목을 입력하세요"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                관련 회사
              </label>
              <select
                value={formData.resourceUid}
                onChange={(e) => setFormData({ ...formData, resourceUid: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  background: 'white',
                  outline: 'none'
                }}
              >
                <option value="">회사를 선택하세요</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name} ({company.country})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                내용
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="게시물 내용을 입력하세요"
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '10px 20px',
                  background: isSubmitting ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting ? '저장 중...' : (editingPost ? '수정' : '저장')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 검색 및 필터 */}
      {!isCreating && (
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="게시물 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ minWidth: '200px' }}>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="">모든 회사</option>
              {companies.map(company => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 게시물 목록 */}
      {!isCreating && (
        <div style={{
          display: 'grid',
          gap: '16px'
        }}>
          {filteredPosts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {searchTerm || selectedCompany ? '검색 결과가 없습니다.' : '게시물이 없습니다.'}
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              onClick={() => handleEdit(post)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}>
                    {post.title}
                  </h3>
                  <div style={{
                    padding: '4px 8px',
                    background: '#dcfce7',
                    color: '#16a34a',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getCompanyName(post.resourceUid)}
                  </div>
                </div>

                <p style={{
                  margin: '0 0 12px 0',
                  color: '#6b7280',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden'
                }}>
                  {post.content}
                </p>

                <div style={{
                  fontSize: '12px',
                  color: '#9ca3af'
                }}>
                  {new Date(post.dateTime).toLocaleDateString('ko-KR')} {new Date(post.dateTime).toLocaleTimeString('ko-KR')}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 통계 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        borderRadius: '12px',
        border: '1px solid #bbf7d0',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          fontSize: '14px'
        }}>
          <div>
            <span style={{ fontWeight: '700', fontSize: '18px', color: '#047857' }}>
              {filteredPosts.length}
            </span>
            <div style={{ color: '#065f46' }}>
              {searchTerm || selectedCompany ? '필터링된' : '전체'} 게시물
            </div>
          </div>
          <div>
            <span style={{ fontWeight: '700', fontSize: '18px', color: '#047857' }}>
              {new Set(posts.map(p => p.resourceUid)).size}
            </span>
            <div style={{ color: '#065f46' }}>관련 회사 수</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManager;