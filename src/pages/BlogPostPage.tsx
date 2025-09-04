import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  comments: Comment[];
}

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState({
    content: '',
    authorName: '',
    authorEmail: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('获取文章失败');
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!post) return;
      
      const commentData = {
        ...newComment,
        post: { id: post.id }
      };
      
      const response = await axios.post('http://localhost:8080/api/comments', commentData);
      
      // 更新页面上的评论列表
      setPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [...prev.comments, response.data]
        };
      });
      
      // 清空表单
      setNewComment({
        content: '',
        authorName: '',
        authorEmail: ''
      });
    } catch (err) {
      setError('提交评论失败');
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!post) return <div>未找到文章</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          发布时间: {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="prose max-w-none mb-8">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </article>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">评论</h2>
        
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-6">
            {post.comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{comment.authorName}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">暂无评论</p>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">发表评论</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
                姓名 *
              </label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={newComment.authorName}
                onChange={handleCommentChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700">
                邮箱 *
              </label>
              <input
                type="email"
                id="authorEmail"
                name="authorEmail"
                value={newComment.authorEmail}
                onChange={handleCommentChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                评论内容 *
              </label>
              <textarea
                id="content"
                name="content"
                value={newComment.content}
                onChange={handleCommentChange}
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              提交评论
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;